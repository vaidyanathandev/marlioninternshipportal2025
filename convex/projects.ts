import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Proposals
export const createProposal = mutation({
  args: {
    studentId: v.id('students'),
    title: v.string(),
    description: v.string(),
    pdfUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('projectProposals', {
      studentId: args.studentId,
      title: args.title,
      description: args.description,
      pdfUrl: args.pdfUrl,
      status: 'pending',
    });
  },
});

export const getProposal = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projectProposals')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .first();
  },
});

export const updateProposalStatus = mutation({
  args: {
    proposalId: v.id('projectProposals'),
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.proposalId, {
      status: args.status,
      adminFeedback: args.feedback,
    });
  },
});

// Tasks
export const listTasks = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('projectTasks')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .collect();
    return tasks.sort((a, b) => a.order - b.order);
  },
});

export const createTask = mutation({
  args: {
    studentId: v.id('students'),
    title: v.string(),
    milestone: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('projectTasks', {
      studentId: args.studentId,
      title: args.title,
      status: 'todo',
      milestone: args.milestone,
      order: args.order,
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id('projectTasks'),
    status: v.union(
      v.literal('todo'),
      v.literal('inprogress'),
      v.literal('review'),
      v.literal('done')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, { status: args.status });
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id('projectTasks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

// Daily Logs
export const listLogs = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query('dailyLogs')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .collect();
    return logs.sort((a, b) => b.submittedAt - a.submittedAt);
  },
});

export const createLog = mutation({
  args: {
    studentId: v.id('students'),
    date: v.string(),
    description: v.string(),
    githubUrl: v.optional(v.string()),
    attachments: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('dailyLogs', {
      studentId: args.studentId,
      date: args.date,
      description: args.description,
      githubUrl: args.githubUrl,
      attachments: args.attachments,
      submittedAt: Date.now(),
    });
  },
});
