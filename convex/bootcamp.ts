import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Course Modules
export const listModules = query({
  args: {
    stream: v.union(
      v.literal('immersive'),
      v.literal('fullstack'),
      v.literal('agentic'),
      v.literal('datascience')
    ),
  },
  handler: async (ctx, args) => {
    const modules = await ctx.db
      .query('courseModules')
      .withIndex('by_stream', (q) => q.eq('stream', args.stream))
      .collect();
    return modules.sort((a, b) => a.order - b.order);
  },
});

export const getModule = query({
  args: { moduleId: v.id('courseModules') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.moduleId);
  },
});

// Progress Tracking
export const getProgress = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('bootcampProgress')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .collect();
    return progress;
  },
});

export const updateProgress = mutation({
  args: {
    studentId: v.id('students'),
    moduleId: v.string(),
    completed: v.boolean(),
    watchTime: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('bootcampProgress')
      .withIndex('by_student_and_module', (q) =>
        q.eq('studentId', args.studentId).eq('moduleId', args.moduleId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: args.completed,
        watchTime: args.watchTime,
      });
      return existing._id;
    } else {
      return await ctx.db.insert('bootcampProgress', {
        studentId: args.studentId,
        moduleId: args.moduleId,
        completed: args.completed,
        quizScore: 0,
        watchTime: args.watchTime,
      });
    }
  },
});

export const submitQuiz = mutation({
  args: {
    studentId: v.id('students'),
    moduleId: v.string(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('bootcampProgress')
      .withIndex('by_student_and_module', (q) =>
        q.eq('studentId', args.studentId).eq('moduleId', args.moduleId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quizScore: args.score,
        completed: args.score >= 70, // Passing score is 70%
      });
    }
  },
});

// Admin - Create Module
export const createModule = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    order: v.number(),
    stream: v.union(
      v.literal('immersive'),
      v.literal('fullstack'),
      v.literal('agentic'),
      v.literal('datascience')
    ),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('courseModules', {
      ...args,
    });
  },
});
