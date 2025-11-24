'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Button } from '@marlion/ui';
import { VoiceRecorder } from '../../components/VoiceRecorder';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function InterviewPage() {
  const router = useRouter();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [typingSpeeds, setTypingSpeeds] = useState<number[]>([]);
  const [isFlagged, setIsFlagged] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);

  const student = useQuery(
    api.students.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  );

  const createInterview = useMutation(api.interviews.create);
  const addMessage = useMutation(api.interviews.addMessage);
  const completeInterview = useMutation(api.interviews.complete);
  const generateQuestion = useAction(api.ai.generateInterviewQuestions);
  const scoreInterview = useAction(api.ai.scoreInterview);
  const detectCopyPaste = useAction(api.ai.detectCopyPaste);

  const MAX_QUESTIONS = 8;

  useEffect(() => {
    if (student && !interviewId) {
      initializeInterview();
    }
  }, [student]);

  const initializeInterview = async () => {
    if (!student) return;

    try {
      const id = await createInterview({ studentId: student._id });
      setInterviewId(id);
      await askNextQuestion([]);
    } catch (error) {
      console.error('Failed to initialize interview:', error);
    }
  };

  const askNextQuestion = async (previousAnswers: string[]) => {
    if (!student || questionCount >= MAX_QUESTIONS) return;

    setIsLoading(true);
    try {
      const question = await generateQuestion({
        stream: student.stream,
        previousAnswers,
      });

      const newMessage: Message = {
        role: 'assistant',
        content: question,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);

      if (interviewId) {
        await addMessage({
          interviewId: interviewId as any,
          role: 'assistant',
          content: question,
        });
      }

      setQuestionCount((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to generate question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = async (text: string) => {
    await handleAnswer(text);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    await handleAnswer(textInput);
    setTextInput('');
  };

  const handleAnswer = async (answer: string) => {
    if (!interviewId || !student) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: answer,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    await addMessage({
      interviewId: interviewId as any,
      role: 'user',
      content: answer,
    });

    // Check for copy-paste
    const avgSpeed = typingSpeeds.reduce((a, b) => a + b, 0) / typingSpeeds.length || 0;
    try {
      const detection = await detectCopyPaste({
        text: answer,
        typingSpeed: avgSpeed,
      });

      if (detection.flagged) {
        setIsFlagged(true);
        return;
      }
    } catch (error) {
      console.error('Copy-paste detection failed:', error);
    }

    // Ask next question or complete interview
    if (questionCount < MAX_QUESTIONS) {
      const userAnswers = messages
        .filter((m) => m.role === 'user')
        .map((m) => m.content);
      userAnswers.push(answer);
      await askNextQuestion(userAnswers);
    } else {
      await finishInterview();
    }
  };

  const handleTypingSpeed = (speed: number) => {
    setTypingSpeeds((prev) => [...prev, speed]);
  };

  const finishInterview = async () => {
    if (!interviewId) return;

    setIsLoading(true);
    try {
      const transcript = messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));

      const scoring = await scoreInterview({ transcript });

      await completeInterview({
        interviewId: interviewId as any,
        score: scoring.score,
        technicalScore: scoring.technicalScore,
        psychologicalScore: scoring.psychologicalScore,
        summary: scoring.summary,
        flagged: isFlagged,
      });

      router.push('/results');
    } catch (error) {
      console.error('Failed to complete interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFlagged) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-2xl text-center" glass>
          <div className="mb-6">
            <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
              <svg className="w-16 h-16 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Copy-Paste Detected
            </h2>
            <p className="text-slate-300 text-lg mb-6">
              We'd rather work with AI directly than collaborate with humans who
              mindlessly copy-paste.
            </p>
            <p className="text-slate-400">
              If you believe this was a mistake, please contact us to appeal.
            </p>
          </div>
          <Button onClick={() => router.push('/')}>
            Return to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 animate-pulse">
            <svg className="w-12 h-12 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-slate-300 text-lg">Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-100">
              AI Interview - {student.stream.charAt(0).toUpperCase() + student.stream.slice(1)}
            </h1>
            <div className="text-right">
              <p className="text-sm text-slate-400">Question</p>
              <p className="text-2xl font-bold text-blue-400">
                {questionCount} / {MAX_QUESTIONS}
              </p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${(questionCount / MAX_QUESTIONS) * 100}%` }}
            />
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="mb-6" glass>
          <div className="space-y-6 min-h-[400px] max-h-[500px] overflow-y-auto mb-6 pr-2">
            {messages.length === 0 && isLoading && (
              <div className="text-center py-20">
                <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 animate-pulse">
                  <svg className="w-12 h-12 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-slate-300">Preparing your first question...</p>
              </div>
            )}

            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold mb-2 opacity-70">
                    {message.role === 'user' ? 'You' : 'AI Interviewer'}
                  </p>
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-6 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {questionCount < MAX_QUESTIONS && !isLoading && (
            <div className="border-t border-slate-800 pt-6">
              <div className="mb-6">
                <VoiceRecorder
                  onTranscript={handleVoiceTranscript}
                  onTypingSpeed={handleTypingSpeed}
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <p className="text-center text-slate-500 text-sm mb-4">
                  OR type your answer below
                </p>
                <form onSubmit={handleTextSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="flex-1 px-4 py-3 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={!textInput.trim() || isLoading}>
                    Send
                  </Button>
                </form>
              </div>
            </div>
          )}

          {questionCount >= MAX_QUESTIONS && !isLoading && (
            <div className="text-center border-t border-slate-800 pt-6">
              <p className="text-slate-300 mb-4">
                Interview complete! Analyzing your responses...
              </p>
              <Button onClick={finishInterview} size="lg">
                View Results
              </Button>
            </div>
          )}
        </Card>

        {/* Tips */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Interview Tips</h3>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Be authentic - we value genuine passion over perfect answers</li>
                <li>• Take your time - quality matters more than speed</li>
                <li>• Show your learning mindset and curiosity</li>
                <li>• Connect your answers to assistive tech and social impact</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
