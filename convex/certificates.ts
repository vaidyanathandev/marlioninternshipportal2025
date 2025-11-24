import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    studentId: v.id('students'),
    verificationCode: v.string(),
    pdfUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const certificateId = await ctx.db.insert('certificates', {
      studentId: args.studentId,
      issueDate: Date.now(),
      verificationCode: args.verificationCode,
      pdfUrl: args.pdfUrl,
    });
    return certificateId;
  },
});

export const getByStudent = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, args) => {
    const certificate = await ctx.db
      .query('certificates')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .first();
    return certificate;
  },
});

export const getByVerificationCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const certificate = await ctx.db
      .query('certificates')
      .withIndex('by_verification_code', (q) =>
        q.eq('verificationCode', args.code)
      )
      .first();

    if (!certificate) return null;

    const student = await ctx.db.get(certificate.studentId);
    return { ...certificate, student };
  },
});
