'use client';

import { useState } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Button } from '@marlion/ui';
import type { Student } from '@marlion/types';

export function BootcampTab({ student }: { student: Student }) {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const modules = useQuery(api.bootcamp.listModules, { stream: student.stream });
  const progress = useQuery(api.bootcamp.getProgress, { studentId: student._id });
  const updateProgress = useMutation(api.bootcamp.updateProgress);
  const answerQuestion = useAction(api.ai.answerQuestion);

  const selectedModule = modules?.find((m) => m._id === selectedModuleId);
  const moduleProgress = progress?.find((p) => p.moduleId === selectedModuleId);

  const handleModuleComplete = async () => {
    if (!selectedModuleId) return;
    await updateProgress({
      studentId: student._id,
      moduleId: selectedModuleId,
      completed: true,
      watchTime: 0,
    });
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoadingChat(true);

    try {
      const context = selectedModule
        ? `Current video: ${selectedModule.title}. ${selectedModule.description}`
        : 'General bootcamp questions';

      const response = await answerQuestion({
        question: userMessage,
        context,
      });

      setChatMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error.' },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  if (!modules || modules.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-slate-700/30 rounded-full mb-4">
            <svg className="w-12 h-12 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            Bootcamp Coming Soon
          </h3>
          <p className="text-slate-400">
            Course modules will be available once your internship starts.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Module List */}
      <Card className="lg:col-span-1">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Course Modules</h3>
        <div className="space-y-2">
          {modules.map((module) => {
            const moduleProgress = progress?.find((p) => p.moduleId === module._id);
            const isCompleted = moduleProgress?.completed || false;

            return (
              <button
                key={module._id}
                onClick={() => setSelectedModuleId(module._id)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedModuleId === module._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide mb-1 opacity-70">
                      Module {module.order}
                    </p>
                    <p className="font-semibold">{module.title}</p>
                  </div>
                  {isCompleted && (
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Video Player */}
      <Card className="lg:col-span-1">
        {selectedModule ? (
          <>
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              {selectedModule.title}
            </h3>
            <p className="text-slate-400 mb-4">{selectedModule.description}</p>

            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4">
              <iframe
                src={selectedModule.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {!moduleProgress?.completed && (
              <Button onClick={handleModuleComplete} className="w-full">
                Mark as Complete
              </Button>
            )}

            {moduleProgress?.completed && (
              <div className="flex items-center gap-2 justify-center py-3 bg-green-500/10 rounded-lg">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-500 font-semibold">Completed</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400">Select a module to start learning</p>
          </div>
        )}
      </Card>

      {/* AI Chat Panel */}
      <Card className="lg:col-span-1">
        <h3 className="text-lg font-bold text-slate-100 mb-4">AI Assistant</h3>

        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-slate-400 text-sm">
                Ask questions about the current module
              </p>
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

          {isLoadingChat && (
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

        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoadingChat}
          />
          <Button type="submit" disabled={!chatInput.trim() || isLoadingChat} size="sm">
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
