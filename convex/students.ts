import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    clerkId: v.string(),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    college: v.string(),
    yearOfStudy: v.number(),
    department: v.string(),
    registerNumber: v.string(),
    collegeIdProofUrl: v.optional(v.string()),
    stream: v.union(
      v.literal('immersive'),
      v.literal('fullstack'),
      v.literal('agentic'),
      v.literal('datascience')
    ),
    startDate: v.string(),
    endDate: v.string(),
    specialRequests: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const studentId = await ctx.db.insert('students', {
      ...args,
      registrationStatus: 'interview',
    });
    return studentId;
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query('students')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();
    return student;
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query('students')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
    return student;
  },
});

export const updateStatus = mutation({
  args: {
    studentId: v.id('students'),
    status: v.union(
      v.literal('pending'),
      v.literal('interview'),
      v.literal('selected'),
      v.literal('rejected')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, {
      registrationStatus: args.status,
    });
  },
});

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('interview'),
        v.literal('selected'),
        v.literal('rejected')
      )
    ),
    stream: v.optional(
      v.union(
        v.literal('immersive'),
        v.literal('fullstack'),
        v.literal('agentic'),
        v.literal('datascience')
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('students');

    if (args.status) {
      query = query.withIndex('by_status', (q) => q.eq('registrationStatus', args.status));
    }

    const students = await query.collect();

    if (args.stream) {
      return students.filter((s) => s.stream === args.stream);
    }

    return students;
  },
});

export const getById = query({
  args: { id: v.id('students') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const searchByName = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allStudents = await ctx.db.query('students').collect();
    return allStudents.filter((s) =>
      s.fullName.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});
