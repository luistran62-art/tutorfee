import { CalendarEvent, Email, Student, EventStatus } from './types';

// Utility to create dates relative to today
const today = new Date();
const getRelDate = (days: number, hours: number = 0) => {
  const d = new Date(today);
  d.setDate(today.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d;
};

export const MOCK_STUDENTS: Student[] = [
  { 
    id: 's1', 
    name: 'Minh An', 
    parentName: 'Chị Lan',
    className: '8A',
    hourlyRate: 200000, 
    sessionRate: 300000, 
    pricingModel: 'SESSION', 
    email: 'an.minh@example.com' 
  },
  { 
    id: 's2', 
    name: 'Bảo Ngọc', 
    parentName: 'Bác Nguyễn Hoàng',
    className: '7 Oxford',
    hourlyRate: 250000, 
    sessionRate: 400000, 
    pricingModel: 'SESSION', 
    email: 'ngoc.bao@example.com' 
  },
  { 
    id: 's3', 
    name: 'Gia Huy', 
    parentName: 'Anh Tuấn',
    className: 'Lý 10',
    hourlyRate: 180000, 
    sessionRate: 250000, 
    pricingModel: 'HOURLY', 
    email: 'huy.gia@example.com' 
  },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  // Minh An - Regular Schedule
  {
    id: 'e1',
    title: 'Toán - Minh An - Lớp 8',
    start: getRelDate(-10, 18),
    end: getRelDate(-10, 20), // 2 hours
    description: 'Bài tập đại số.',
    tags: [],
    status: EventStatus.COMPLETED
  },
  {
    id: 'e2',
    title: 'Toán - Minh An - Lớp 8',
    start: getRelDate(-3, 18),
    end: getRelDate(-3, 20),
    description: 'Hình học #trial', // Trial tag
    tags: ['#trial'],
    status: EventStatus.TRIAL
  },
  {
    id: 'e3',
    title: 'Toán - Minh An - Lớp 8',
    start: getRelDate(2, 18),
    end: getRelDate(2, 20),
    description: '',
    tags: [],
    status: EventStatus.SCHEDULED
  },
  
  // Bảo Ngọc - Session based
  {
    id: 'e4',
    title: 'Tiếng Anh - Bảo Ngọc',
    start: getRelDate(-8, 9),
    end: getRelDate(-8, 10), // 1.5 hours really but paid per session
    description: '',
    tags: [],
    status: EventStatus.COMPLETED
  },
  {
    id: 'e5',
    title: 'Tiếng Anh - Bảo Ngọc',
    start: getRelDate(-1, 9),
    end: getRelDate(-1, 10),
    description: '',
    tags: [],
    status: EventStatus.COMPLETED // Yet there is an email saying she was sick
  },

  // Gia Huy - Cancelled explicitly in Calendar
  {
    id: 'e6',
    title: 'Lý - Gia Huy',
    start: getRelDate(-5, 14),
    end: getRelDate(-5, 16),
    description: 'Nghỉ ốm #cancelled',
    tags: ['#cancelled'],
    status: EventStatus.CANCELLED
  }
];

export const MOCK_EMAILS: Email[] = [
  {
    id: 'm1',
    subject: 'Xin phép nghỉ học - Bảo Ngọc',
    snippet: 'Chào thầy, hôm qua (ngày ' + getRelDate(-1).toLocaleDateString('vi-VN') + ') Bảo Ngọc bị sốt nên con không tham gia lớp Tiếng Anh được ạ. Gia đình xin phép nghỉ buổi này.',
    date: getRelDate(0, 8),
    sender: 'phuhuynh@example.com',
    labels: ['Class-Notice', 'Inbox']
  },
  {
    id: 'm2',
    subject: 'Đổi lịch học Minh An',
    snippet: 'Thầy ơi, buổi học Toán thứ 3 tuần sau cho Minh An xin chuyển sang thứ 5 được không ạ?',
    date: getRelDate(-2, 10),
    sender: 'me.minhan@example.com',
    labels: ['Class-Notice']
  }
];