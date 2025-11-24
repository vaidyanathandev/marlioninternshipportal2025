'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Button, Input, TextArea } from '@marlion/ui';
import type { Student, ProjectTaskStatus } from '@marlion/types';

export function ProjectTrackerTab({ student }: { student: Student }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newLogDescription, setNewLogDescription] = useState('');
  const [newLogGithub, setNewLogGithub] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);

  const tasks = useQuery(api.projects.listTasks, { studentId: student._id });
  const logs = useQuery(api.projects.listLogs, { studentId: student._id });
  const createTask = useMutation(api.projects.createTask);
  const updateTaskStatus = useMutation(api.projects.updateTaskStatus);
  const deleteTask = useMutation(api.projects.deleteTask);
  const createLog = useMutation(api.projects.createLog);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask({
      studentId: student._id,
      title: newTaskTitle,
      milestone: 'General',
      order: (tasks?.length || 0) + 1,
    });

    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogDescription.trim()) return;

    await createLog({
      studentId: student._id,
      date: new Date().toISOString().split('T')[0],
      description: newLogDescription,
      githubUrl: newLogGithub || undefined,
      attachments: [],
    });

    setNewLogDescription('');
    setNewLogGithub('');
    setShowAddLog(false);
  };

  const columns: { status: ProjectTaskStatus; label: string; color: string }[] = [
    { status: 'todo', label: 'To Do', color: 'bg-slate-700' },
    { status: 'inprogress', label: 'In Progress', color: 'bg-blue-600' },
    { status: 'review', label: 'Review', color: 'bg-yellow-600' },
    { status: 'done', label: 'Done', color: 'bg-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Kanban Board */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-100">Project Tracker</h2>
          <Button onClick={() => setShowAddTask(true)} size="sm">
            + Add Task
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = tasks?.filter((t) => t.status === column.status) || [];

            return (
              <div key={column.status}>
                <div className={`${column.color} rounded-t-lg px-4 py-3`}>
                  <h3 className="text-white font-semibold">
                    {column.label} ({columnTasks.length})
                  </h3>
                </div>

                <div className="bg-slate-800/50 rounded-b-lg p-4 min-h-[400px] space-y-3">
                  {columnTasks.map((task) => (
                    <Card key={task._id} className="bg-surface hover:border-slate-700 cursor-move">
                      <p className="text-slate-200 mb-3">{task.title}</p>

                      <div className="flex items-center justify-between">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus({
                              taskId: task._id,
                              status: e.target.value as ProjectTaskStatus,
                            })
                          }
                          className="text-xs px-2 py-1 rounded bg-slate-700 border-slate-600 text-slate-300"
                        >
                          {columns.map((col) => (
                            <option key={col.status} value={col.status}>
                              {col.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => deleteTask({ taskId: task._id })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </Card>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-500 text-sm">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Add New Task</h3>
            <form onSubmit={handleAddTask}>
              <Input
                label="Task Title"
                placeholder="e.g., Design user interface mockups"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">
                  Add Task
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTaskTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Daily Logs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-100">Daily Logs</h2>
          <Button onClick={() => setShowAddLog(true)} size="sm">
            + Add Log
          </Button>
        </div>

        <div className="space-y-4">
          {logs && logs.length > 0 ? (
            logs.map((log) => (
              <Card key={log._id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm">
                      {new Date(log.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 whitespace-pre-wrap mb-3">{log.description}</p>

                {log.githubUrl && (
                  <a
                    href={log.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                )}
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-100 mb-2">No daily logs yet</h3>
              <p className="text-slate-400">Start documenting your daily progress</p>
            </Card>
          )}
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <Card className="max-w-2xl w-full">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Add Daily Log</h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <TextArea
                label="What did you work on today?"
                placeholder="Describe your progress, challenges faced, and learnings..."
                value={newLogDescription}
                onChange={(e) => setNewLogDescription(e.target.value)}
                rows={6}
                required
              />

              <Input
                label="GitHub URL (Optional)"
                placeholder="https://github.com/username/repo/commit/..."
                value={newLogGithub}
                onChange={(e) => setNewLogGithub(e.target.value)}
              />

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Submit Log
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddLog(false);
                    setNewLogDescription('');
                    setNewLogGithub('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
