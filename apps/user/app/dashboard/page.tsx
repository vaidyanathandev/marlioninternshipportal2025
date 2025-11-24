'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Progress } from '@marlion/ui';
import { BootcampTab } from '../../components/dashboard/BootcampTab';
import { ProblemStatementTab } from '../../components/dashboard/ProblemStatementTab';
import { ProjectTrackerTab } from '../../components/dashboard/ProjectTrackerTab';
import { HelpTab } from '../../components/dashboard/HelpTab';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<'bootcamp' | 'problem' | 'tracker' | 'help'>('bootcamp');

  const student = useQuery(
    api.students.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  );

  const bootcampProgress = useQuery(
    api.bootcamp.getProgress,
    student ? { studentId: student._id } : 'skip'
  );

  const modules = useQuery(
    api.bootcamp.listModules,
    student ? { stream: student.stream } : 'skip'
  );

  if (!isLoaded || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 animate-pulse">
            <svg className="w-12 h-12 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-slate-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate overall progress
  const totalModules = modules?.length || 0;
  const completedModules = bootcampProgress?.filter((p) => p.completed).length || 0;
  const bootcampPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  // For now, project and logs percentage will be static
  const projectPercentage = 0;
  const logsPercentage = 0;
  const overallProgress = (bootcampPercentage + projectPercentage + logsPercentage) / 3;

  const tabs = [
    { id: 'bootcamp', label: 'Bootcamp', icon: '🎓' },
    { id: 'problem', label: 'Problem Statement', icon: '📋' },
    { id: 'tracker', label: 'Project Tracker', icon: '📊' },
    { id: 'help', label: 'Help', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold text-slate-100">Dashboard</span>
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-400">Overall Progress</p>
                <p className="text-lg font-bold text-blue-400">
                  {Math.round(overallProgress)}%
                </p>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <button
                onClick={() => {
                  /* User menu */
                }}
                className="flex items-center gap-3 hover:bg-slate-800 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {student.fullName.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-200">
                    {student.fullName}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{student.stream}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Banner */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                Welcome back, {student.fullName.split(' ')[0]}! 👋
              </h2>
              <p className="text-slate-400">
                Keep up the great work. You're {Math.round(overallProgress)}% through the
                internship.
              </p>
            </div>
            {overallProgress === 100 && (
              <button
                onClick={() => router.push('/certificate')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Download Certificate 🎉
              </button>
            )}
          </div>
          <Progress value={overallProgress} showLabel />
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'bootcamp' && <BootcampTab student={student} />}
        {activeTab === 'problem' && <ProblemStatementTab student={student} />}
        {activeTab === 'tracker' && <ProjectTrackerTab student={student} />}
        {activeTab === 'help' && <HelpTab student={student} />}
      </div>
    </div>
  );
}
