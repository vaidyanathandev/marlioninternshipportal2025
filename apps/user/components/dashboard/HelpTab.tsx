'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Button, TextArea } from '@marlion/ui';
import type { Student } from '@marlion/types';

export function HelpTab({ student }: { student: Student }) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const answerQuestion = useAction(api.ai.answerQuestion);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await answerQuestion({
        question: userMessage,
        context: 'Student help desk - troubleshooting and general support',
      });

      setChatMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    // In production, save to Convex
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSubmitted(false);
    }, 3000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* AI Help Chat */}
      <Card>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">AI Help Desk</h2>
        <p className="text-slate-400 mb-6">
          Ask questions about technical blockers, project guidance, or internship
          logistics.
        </p>

        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-slate-400">Ask a question to get started</p>
            </div>
          )}

          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-xl px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleChatSubmit} className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!chatInput.trim() || isLoading}>
            Send
          </Button>
        </form>
      </Card>

      {/* Feedback & Contact */}
      <div className="space-y-6">
        <Card>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Submit Feedback
          </h2>
          <p className="text-slate-400 mb-6">
            Share your experience, suggestions, or report issues with the
            internship program.
          </p>

          <form onSubmit={handleFeedbackSubmit}>
            <TextArea
              label="Your Feedback"
              placeholder="Tell us about your experience, what's working well, and what could be improved..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={6}
              required
            />

            {feedbackSubmitted ? (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center">
                Thank you for your feedback! 🎉
              </div>
            ) : (
              <Button type="submit" className="w-full mt-4">
                Submit Feedback
              </Button>
            )}
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-100 mb-4">
            Contact Admin
          </h2>
          <p className="text-slate-400 mb-6">
            Need urgent assistance? Reach out directly to the admin team.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:social@marliontech.com"
              className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-slate-200 font-semibold">Email Support</p>
                <p className="text-slate-400 text-sm">social@marliontech.com</p>
              </div>
            </a>

            <a
              href="tel:+919486734438"
              className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-slate-200 font-semibold">Phone Support</p>
                <p className="text-slate-400 text-sm">+91 94867 34438</p>
              </div>
            </a>
          </div>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Quick Tips</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Use the AI chat for instant help with coding questions</li>
                <li>• Check your email for important internship updates</li>
                <li>• Submit daily logs to track your progress effectively</li>
                <li>• Reach out early if you're facing blockers</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
