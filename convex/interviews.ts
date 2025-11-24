import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    studentId: v.id('students'),
  },
  handler: async (ctx, args) => {
    const interviewId = await ctx.db.insert('interviews', {
      studentId: args.studentId,
      transcript: [],
      score: 0,
      technicalScore: 0,
      psychologicalScore: 0,
      summary: '',
      flagged: false,
      completedAt: 0,
    });
    return interviewId;
  },
});

export const addMessage = mutation({
  args: {
    interviewId: v.id('interviews'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId);
    if (!interview) throw new Error('Interview not found');

    const newTranscript = [
      ...interview.transcript,
      {
        role: args.role,
        content: args.content,
        timestamp: Date.now(),
      },
    ];

    await ctx.db.patch(args.interviewId, {
      transcript: newTranscript,
    });
  },
});

export const complete = mutation({
  args: {
    interviewId: v.id('interviews'),
    score: v.number(),
    technicalScore: v.number(),
    psychologicalScore: v.number(),
    summary: v.string(),
    flagged: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.interviewId, {
      score: args.score,
      technicalScore: args.technicalScore,
      psychologicalScore: args.psychologicalScore,
      summary: args.summary,
      flagged: args.flagged,
      completedAt: Date.now(),
    });
  },
});

export const getByStudent = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, args) => {
    const interview = await ctx.db
      .query('interviews')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .first();
    return interview;
  },
});

export const list = query({
  handler: async (ctx) => {
    const interviews = await ctx.db.query('interviews').collect();
    const withStudents = await Promise.all(
      interviews.map(async (interview) => {
        const student = await ctx.db.get(interview.studentId);
        return { ...interview, student };
      })
    );
    return withStudents;
  },
});

export const getFlagged = query({
  handler: async (ctx) => {
    const allInterviews = await ctx.db.query('interviews').collect();
    return allInterviews.filter((i) => i.flagged);
  },
});
