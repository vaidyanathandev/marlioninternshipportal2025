import { v } from 'convex/values';
import { action } from './_generated/server';

export const chatCompletion = action({
  args: {
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const response = await fetch('https://inference.do-ai.run/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DO_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.3-70b-instruct',
        messages: args.messages,
        temperature: args.temperature ?? 0.7,
        max_tokens: args.maxTokens ?? 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
});

export const generateInterviewQuestions = action({
  args: {
    stream: v.union(
      v.literal('immersive'),
      v.literal('fullstack'),
      v.literal('agentic'),
      v.literal('datascience')
    ),
    previousAnswers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const streamDescriptions = {
      immersive: 'Immersive Tech (AR/VR) focused on assistive technologies',
      fullstack: 'Full Stack Development with focus on accessibility',
      agentic: 'Agentic AI and automation systems',
      datascience: 'Data Science & Machine Learning for social impact',
    };

    const systemPrompt = `You are an AI interviewer for Marlion Technologies' Winter Internship 2025 program.
The internship focuses on ${streamDescriptions[args.stream]} for neurodiverse children.

Generate ONE thoughtful interview question that:
1. Assesses passion for assistive technology and social impact
2. Tests technical understanding relevant to ${args.stream}
3. Evaluates learning mindset and curiosity
4. Is adaptive based on previous answers

Keep the question concise (2-3 sentences max). Make it conversational and engaging.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...args.previousAnswers.map((answer, idx) => [
        { role: 'assistant', content: `Question ${idx + 1}` },
        { role: 'user', content: answer },
      ]).flat(),
      { role: 'user', content: 'Generate the next interview question.' },
    ];

    return await ctx.runAction(ctx.actions.ai.chatCompletion, {
      messages,
      temperature: 0.8,
      maxTokens: 150,
    });
  },
});

export const scoreInterview = action({
  args: {
    transcript: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const systemPrompt = `You are evaluating an internship interview transcript.
Analyze the candidate's responses and provide:
1. Overall score (0-100)
2. Technical score (0-100)
3. Psychological score (passion, curiosity, mindset) (0-100)
4. Brief summary (2-3 sentences)

Format your response as JSON:
{
  "score": 85,
  "technicalScore": 80,
  "psychologicalScore": 90,
  "summary": "Candidate shows strong passion..."
}`;

    const transcriptText = args.transcript
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n\n');

    const response = await ctx.runAction(ctx.actions.ai.chatCompletion, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcriptText },
      ],
      temperature: 0.3,
      maxTokens: 300,
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        score: 50,
        technicalScore: 50,
        psychologicalScore: 50,
        summary: 'Unable to parse AI response',
      };
    }
  },
});

export const detectCopyPaste = action({
  args: {
    text: v.string(),
    typingSpeed: v.number(), // characters per second
  },
  handler: async (ctx, args) => {
    // If typing speed is abnormally fast (>10 chars/sec), likely copy-paste
    if (args.typingSpeed > 10) {
      return { flagged: true, reason: 'Abnormal typing speed detected' };
    }

    // Use AI to detect if text looks AI-generated or copy-pasted
    const systemPrompt = `Analyze if this text appears to be:
1. Copy-pasted from AI (ChatGPT, etc.)
2. Copy-pasted from online sources
3. Genuinely written by a human

Respond with JSON:
{
  "isCopyPasted": true/false,
  "confidence": 0-100,
  "reason": "brief explanation"
}`;

    const response = await ctx.runAction(ctx.actions.ai.chatCompletion, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: args.text },
      ],
      temperature: 0.2,
      maxTokens: 150,
    });

    try {
      const result = JSON.parse(response);
      return {
        flagged: result.isCopyPasted && result.confidence > 70,
        reason: result.reason,
      };
    } catch (error) {
      return { flagged: false, reason: 'Unable to detect' };
    }
  },
});

export const generateQuizQuestions = action({
  args: {
    videoUrl: v.string(),
    moduleName: v.string(),
  },
  handler: async (ctx, args) => {
    const systemPrompt = `Generate 5 multiple-choice quiz questions for a video module titled "${args.moduleName}".
Questions should test understanding of key concepts. Format as JSON:
[
  {
    "question": "What is...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]`;

    const response = await ctx.runAction(ctx.actions.ai.chatCompletion, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate quiz for: ${args.videoUrl}` },
      ],
      temperature: 0.7,
      maxTokens: 800,
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      return [];
    }
  },
});

export const answerQuestion = action({
  args: {
    question: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const systemPrompt = `You are Marlion's AI assistant for the Winter Internship 2025 program.
Answer questions about:
- Internship streams (Immersive Tech, Full Stack, Agentic AI, Data Science)
- Application process and requirements
- Program duration and structure
- Company focus (assistive tech for neurodiverse children)

Be helpful, concise, and encouraging. ${args.context ? `Context: ${args.context}` : ''}`;

    return await ctx.runAction(ctx.actions.ai.chatCompletion, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: args.question },
      ],
      temperature: 0.7,
      maxTokens: 300,
    });
  },
});
