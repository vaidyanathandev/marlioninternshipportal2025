'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Card, Button } from '@marlion/ui';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'interviews' | 'courses'>('overview');

  const students = useQuery(api.students.list, {});
  const interviews = useQuery(api.interviews.list, {});

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  const totalStudents = students?.length || 0;
  const pendingInterviews = students?.filter((s) => s.registrationStatus === 'interview').length || 0;
  const selectedStudents = students?.filter((s) => s.registrationStatus === 'selected').length || 0;
  const rejectedStudents = students?.filter((s) => s.registrationStatus === 'rejected').length || 0;

  const metrics = [
    {
      label: 'Total Registrations',
      value: totalStudents,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Pending Interviews',
      value: pendingInterviews,
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Selected Students',
      value: selectedStudents,
      icon: '✅',
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Rejected',
      value: rejectedStudents,
      icon: '❌',
      color: 'from-red-500 to-red-600',
    },
  ];

  const navigationItems = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Students', href: '/students', icon: '👥' },
    { label: 'Interviews', href: '/interviews', icon: '💬' },
    { label: 'Courses', href: '/courses', icon: '📚' },
    { label: 'Projects', href: '/projects', icon: '📋' },
    { label: 'Analytics', href: '/analytics', icon: '📈' },
    { label: 'Certificates', href: '/certificates', icon: '🎓' },
    { label: 'Announcements', href: '/announcements', icon: '📢' },
    { label: 'Feedback', href: '/feedback', icon: '💭' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-slate-800 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <p className="text-slate-100 font-bold">Marlion Admin</p>
              <p className="text-slate-400 text-xs">Winter 2025</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-slate-100">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Logged in as</p>
            <p className="text-slate-200 text-sm font-semibold truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400">
              Manage internship applications and monitor student progress
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <Card key={metric.label} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${metric.color} opacity-10 rounded-full -mr-10 -mt-10`}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className={`text-3xl font-bold bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}>
                      {metric.value}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{metric.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Students Table */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100">Recent Registrations</h2>
              <Link href="/students">
                <Button size="sm">View All →</Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">College</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Stream</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.slice(0, 10).map((student) => (
                    <tr key={student._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-slate-200">{student.fullName}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm">{student.email}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm">{student.college.substring(0, 30)}...</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-semibold uppercase">
                          {student.stream}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          student.registrationStatus === 'selected'
                            ? 'bg-green-500/10 text-green-400'
                            : student.registrationStatus === 'interview'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : student.registrationStatus === 'rejected'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {student.registrationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/students/${student._id}`}>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                            View →
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(!students || students.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-slate-400">No students registered yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Link href="/interviews">
              <Card className="hover:border-blue-500 transition-colors cursor-pointer">
                <h3 className="text-lg font-bold text-slate-100 mb-2">Review Interviews</h3>
                <p className="text-slate-400 text-sm mb-4">
                  {pendingInterviews} interviews awaiting review
                </p>
                <Button size="sm" variant="secondary" className="w-full">
                  Start Reviewing →
                </Button>
              </Card>
            </Link>

            <Link href="/courses">
              <Card className="hover:border-purple-500 transition-colors cursor-pointer">
                <h3 className="text-lg font-bold text-slate-100 mb-2">Manage Courses</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Add or edit bootcamp modules
                </p>
                <Button size="sm" variant="secondary" className="w-full">
                  Manage Courses →
                </Button>
              </Card>
            </Link>

            <Link href="/announcements">
              <Card className="hover:border-green-500 transition-colors cursor-pointer">
                <h3 className="text-lg font-bold text-slate-100 mb-2">Send Announcement</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Broadcast message to all students
                </p>
                <Button size="sm" variant="secondary" className="w-full">
                  Create Announcement →
                </Button>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
