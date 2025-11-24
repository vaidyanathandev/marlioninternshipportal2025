export type InternshipStream = 'immersive' | 'fullstack' | 'agentic' | 'datascience';

export type RegistrationStatus = 'pending' | 'interview' | 'selected' | 'rejected';

export type ProjectTaskStatus = 'todo' | 'inprogress' | 'review' | 'done';

export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface Student {
  _id: string;
  _creationTime: number;
  clerkId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  yearOfStudy: number;
  department: string;
  registerNumber: string;
  collegeIdProofUrl?: string;
  stream: InternshipStream;
  startDate: string;
  endDate: string;
  specialRequests?: string;
  registrationStatus: RegistrationStatus;
}

export interface Interview {
  _id: string;
  _creationTime: number;
  studentId: string;
  transcript: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  score: number;
  technicalScore: number;
  psychologicalScore: number;
  summary: string;
  flagged: boolean;
  completedAt: number;
}

export interface BootcampProgress {
  _id: string;
  _creationTime: number;
  studentId: string;
  moduleId: string;
  completed: boolean;
  quizScore: number;
  watchTime: number;
}

export interface ProjectProposal {
  _id: string;
  _creationTime: number;
  studentId: string;
  title: string;
  description: string;
  pdfUrl?: string;
  status: ProposalStatus;
  adminFeedback?: string;
}

export interface ProjectTask {
  _id: string;
  _creationTime: number;
  studentId: string;
  title: string;
  status: ProjectTaskStatus;
  milestone: string;
  order: number;
}

export interface DailyLog {
  _id: string;
  _creationTime: number;
  studentId: string;
  date: string;
  description: string;
  githubUrl?: string;
  attachments: string[];
  submittedAt: number;
}

export interface CourseModule {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  stream: InternshipStream;
  duration: number;
  aiSummary?: string;
}

export interface Announcement {
  _id: string;
  _creationTime: number;
  title: string;
  body: string;
  targetAudience: 'all' | InternshipStream | string;
  scheduledFor?: number;
  createdBy: string;
}

export interface Certificate {
  _id: string;
  _creationTime: number;
  studentId: string;
  issueDate: number;
  verificationCode: string;
  pdfUrl: string;
}
