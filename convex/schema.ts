import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  students: defineTable({
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
    registrationStatus: v.union(
      v.literal('pending'),
      v.literal('interview'),
      v.literal('selected'),
      v.literal('rejected')
    ),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email'])
    .index('by_status', ['registrationStatus'])
    .index('by_stream', ['stream']),

  interviews: defineTable({
    studentId: v.id('students'),
    transcript: v.array(
      v.object({
        role: v.union(v.literal('user'), v.literal('assistant')),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
    score: v.number(),
    technicalScore: v.number(),
    psychologicalScore: v.number(),
    summary: v.string(),
    flagged: v.boolean(),
    completedAt: v.number(),
  }).index('by_student', ['studentId']),

  bootcampProgress: defineTable({
    studentId: v.id('students'),
    moduleId: v.string(),
    completed: v.boolean(),
    quizScore: v.number(),
    watchTime: v.number(),
  })
    .index('by_student', ['studentId'])
    .index('by_module', ['moduleId'])
    .index('by_student_and_module', ['studentId', 'moduleId']),

  projectProposals: defineTable({
    studentId: v.id('students'),
    title: v.string(),
    description: v.string(),
    pdfUrl: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    adminFeedback: v.optional(v.string()),
  })
    .index('by_student', ['studentId'])
    .index('by_status', ['status']),

  projectTasks: defineTable({
    studentId: v.id('students'),
    title: v.string(),
    status: v.union(
      v.literal('todo'),
      v.literal('inprogress'),
      v.literal('review'),
      v.literal('done')
    ),
    milestone: v.string(),
    order: v.number(),
  })
    .index('by_student', ['studentId'])
    .index('by_status', ['status']),

  dailyLogs: defineTable({
    studentId: v.id('students'),
    date: v.string(),
    description: v.string(),
    githubUrl: v.optional(v.string()),
    attachments: v.array(v.string()),
    submittedAt: v.number(),
  })
    .index('by_student', ['studentId'])
    .index('by_date', ['date']),

  courseModules: defineTable({
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
    aiSummary: v.optional(v.string()),
    quizQuestions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          options: v.array(v.string()),
          correctAnswer: v.number(),
        })
      )
    ),
  })
    .index('by_stream', ['stream'])
    .index('by_order', ['order']),

  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    targetAudience: v.string(),
    scheduledFor: v.optional(v.number()),
    createdBy: v.string(),
  }).index('by_target', ['targetAudience']),

  certificates: defineTable({
    studentId: v.id('students'),
    issueDate: v.number(),
    verificationCode: v.string(),
    pdfUrl: v.string(),
  })
    .index('by_student', ['studentId'])
    .index('by_verification_code', ['verificationCode']),

  feedback: defineTable({
    studentId: v.id('students'),
    rating: v.number(),
    comment: v.string(),
    sentiment: v.optional(v.string()),
    submittedAt: v.number(),
  }).index('by_student', ['studentId']),
});
