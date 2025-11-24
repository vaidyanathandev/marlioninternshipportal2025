'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Button, Input, TextArea } from '@marlion/ui';
import type { Student } from '@marlion/types';

export function ProblemStatementTab({ student }: { student: Student }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const proposal = useQuery(api.projects.getProposal, { studentId: student._id });
  const createProposal = useMutation(api.projects.createProposal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createProposal({
        studentId: student._id,
        title,
        description,
      });
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to submit proposal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (proposal) {
    const statusColors = {
      pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      approved: 'bg-green-500/10 border-green-500/20 text-green-400',
      rejected: 'bg-red-500/10 border-red-500/20 text-red-400',
    };

    const statusIcons = {
      pending: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      approved: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      rejected: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };

    return (
      <div className="max-w-3xl">
        <Card>
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[proposal.status]}`}>
              {statusIcons[proposal.status]}
              <span className="font-semibold capitalize">{proposal.status}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            {proposal.title}
          </h2>

          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-slate-300 whitespace-pre-wrap">{proposal.description}</p>
          </div>

          {proposal.adminFeedback && (
            <Card className="bg-blue-500/5 border-blue-500/20">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">Admin Feedback</h4>
                  <p className="text-slate-300">{proposal.adminFeedback}</p>
                </div>
              </div>
            </Card>
          )}

          {proposal.status === 'pending' && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                Your proposal is under review. Check back within 24 hours for feedback.
              </p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Card>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Project Proposal
        </h2>
        <p className="text-slate-400 mb-6">
          Submit your project idea or upload a custom proposal. Your project
          should align with assistive technology for neurodiverse children.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Title"
            placeholder="e.g., AI-powered Learning Assistant for Dyslexic Children"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextArea
            label="Project Description"
            placeholder="Describe your project idea, its impact, and how you plan to implement it..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
              Detailed Proposal (Optional)
            </label>
            <label className="flex items-center justify-center w-full px-4 py-6 rounded-lg bg-[#0f172a] border-2 border-dashed border-slate-700 text-slate-400 cursor-pointer hover:border-blue-500 transition-colors">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm">Click to upload PDF document</p>
                <p className="text-xs text-slate-500 mt-1">Max file size: 10MB</p>
              </div>
              <input type="file" className="hidden" accept=".pdf" />
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
          </Button>
        </form>

        <Card className="mt-6 bg-blue-500/5 border-blue-500/20">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Project Guidelines</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Focus on assistive technology for neurodiverse children</li>
                <li>• Ensure the project is feasible within the internship duration</li>
                <li>• Include clear goals and expected outcomes</li>
                <li>• Consider accessibility and inclusivity in your design</li>
              </ul>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}
