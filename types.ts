export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  TRIAL = 'TRIAL',
  PAID = 'PAID'
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  studentId?: string; // Derived from title parsing
  tags: string[]; // e.g., #paid, #trial
  status: EventStatus;
}

export interface Student {
  id: string;
  name: string;
  parentName: string; // New field
  className: string;  // New field
  hourlyRate: number; // VND
  sessionRate: number; // VND (alternative)
  pricingModel: 'HOURLY' | 'SESSION';
  email: string;
}

export interface Email {
  id: string;
  subject: string;
  snippet: string;
  date: Date;
  sender: string;
  labels: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

// Result of AI Processing
export interface EmailAnalysisResult {
  relatedStudentName: string | null;
  targetDate: string | null; // ISO Date string
  action: 'CANCEL' | 'RESCHEDULE' | 'CONFIRM' | 'UNKNOWN';
  reason?: string;
}

export interface MonthlyReport {
  studentId: string;
  parentName: string;
  studentName: string;
  className: string;
  feePerSession: number;
  totalSessions: number;
  totalAmount: number;
  dayList: string; // "6, 7, 13..."
  details: CalendarEvent[];
}