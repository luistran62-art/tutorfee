import React, { useState, useEffect } from 'react';
import { CalendarEvent, Email, Student, MonthlyReport, EventStatus } from '../types';
import { analyzeEmailWithGemini } from '../services/geminiService';
import { RefreshCw, FileDown, Wand2, Loader2, Download } from 'lucide-react';

interface Props {
  events: CalendarEvent[];
  students: Student[];
  emails: Email[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export const TuitionCalculator: React.FC<Props> = ({ events, students, emails, setEvents }) => {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  // Helper: Format currency strictly as "250.000đ"
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount).replace('₫', 'đ');
  };

  // Core Calculation Logic
  const calculate = () => {
    const reportList: MonthlyReport[] = [];

    students.forEach(student => {
      // 1. Filter events for this student in the selected month
      const studentEvents = events.filter(event => {
        const isStudentMatch = event.title.includes(student.name);
        const isMonthMatch = event.start.getMonth() === selectedMonth;
        return isStudentMatch && isMonthMatch;
      });

      // 2. Identify Valid Events (Exclude #trial, #cancelled)
      const validEvents = studentEvents.filter(event => {
        const isTrial = event.tags.includes('#trial') || event.status === EventStatus.TRIAL;
        const isCancelled = event.tags.includes('#cancelled') || event.status === EventStatus.CANCELLED;
        return !isTrial && !isCancelled;
      });

      // 3. Count Sessions
      const totalSessions = validEvents.length;

      // 4. Calculate Fee Per Session
      const feePerSession = student.sessionRate > 0 ? student.sessionRate : student.hourlyRate * 1.5;

      // 5. Total Amount
      let totalAmount = 0;
      if (student.pricingModel === 'SESSION') {
        totalAmount = totalSessions * student.sessionRate;
      } else {
        const totalHours = validEvents.reduce((acc, e) => {
          return acc + (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
        }, 0);
        totalAmount = totalHours * student.hourlyRate;
      }

      // 6. Extract Day List "6, 7, 13..."
      const dayList = validEvents
        .map(e => e.start.getDate())
        .sort((a, b) => a - b) // Sort ascending
        .join(', ');

      reportList.push({
        studentId: student.id,
        parentName: student.parentName,
        studentName: student.name,
        className: student.className,
        feePerSession: feePerSession, 
        totalSessions: totalSessions,
        totalAmount: totalAmount,
        dayList: dayList,
        details: studentEvents
      });
    });

    setReports(reportList);
  };

  useEffect(() => {
    calculate();
  }, [events, selectedMonth]);

  // AI Analysis Handler
  const handleAIScan = async () => {
    if (!process.env.API_KEY) {
        setAiLogs(prev => [...prev, "ERROR: No Gemini API Key found in environment."]);
        return;
    }
    setIsProcessingAI(true);
    setAiLogs([]);
    
    for (const email of emails) {
      setAiLogs(prev => [...prev, `Analyzing email: "${email.subject}"...`]);
      try {
        const result = await analyzeEmailWithGemini(email);
        
        if (result.relatedStudentName) {
            setAiLogs(prev => [...prev, `-> Detected: ${result.relatedStudentName}, Action: ${result.action}`]);
            
            if (result.targetDate && result.action === 'CANCEL') {
               const targetDate = new Date(result.targetDate);
               const relatedEventIndex = events.findIndex(e => {
                  const isSameDate = e.start.toDateString() === targetDate.toDateString();
                  const isSameStudent = e.title.includes(result.relatedStudentName!);
                  return isSameDate && isSameStudent;
               });

               if (relatedEventIndex >= 0) {
                 const updatedEvents = [...events];
                 if (updatedEvents[relatedEventIndex].status !== EventStatus.CANCELLED) {
                    updatedEvents[relatedEventIndex].status = EventStatus.CANCELLED;
                    updatedEvents[relatedEventIndex].tags.push('#cancelled');
                    updatedEvents[relatedEventIndex].description += ` [AI: Huỷ từ email]`;
                    setEvents(updatedEvents);
                    setAiLogs(prev => [...prev, `-> Auto-cancelled class on ${targetDate.getDate()}/${targetDate.getMonth()+1}`]);
                 }
               }
            }
        }
      } catch (err) {
        setAiLogs(prev => [...prev, `-> Error analyzing email.`]);
      }
    }

    setIsProcessingAI(false);
    calculate();
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      calculate();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tính Học Phí</h1>
          <p className="text-slate-500">Bảng tính tự động từ Calendar & Gmail.</p>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
                <RefreshCw size={18} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ'}
            </button>
            <button 
                onClick={handleAIScan}
                disabled={isProcessingAI}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200"
            >
                {isProcessingAI ? <Loader2 size={18} className="mr-2 animate-spin"/> : <Wand2 size={18} className="mr-2" />}
                AI Đối Soát
            </button>
        </div>
      </div>

      {/* AI Logs */}
      {aiLogs.length > 0 && (
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-y-auto max-h-40 border border-slate-700">
              <p className="text-slate-400 mb-2 border-b border-slate-700 pb-1">AI Logs:</p>
              {aiLogs.map((log, i) => <div key={i}>{log}</div>)}
          </div>
      )}

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase mr-3">Chọn tháng:</label>
            <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-1.5 border rounded-md text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                {Array.from({length: 12}, (_, i) => (
                    <option key={i} value={i}>Tháng {i + 1}</option>
                ))}
            </select>
        </div>
        <button className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} className="mr-2" />
            Xuất Excel / CSV
        </button>
      </div>

      {/* Main Table - Strict Format with White Backgrounds */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            {/* Header background changed to white */}
            <thead className="bg-white text-slate-600 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap w-[15%]">Phụ Huynh</th>
                <th className="px-4 py-4 whitespace-nowrap w-[15%]">Học Sinh</th>
                <th className="px-4 py-4 whitespace-nowrap w-[10%] text-center">Lớp</th>
                <th className="px-4 py-4 whitespace-nowrap w-[15%] text-right">Học Phí / Buổi</th>
                <th className="px-4 py-4 whitespace-nowrap w-[10%] text-center">Số Buổi</th>
                <th className="px-4 py-4 whitespace-nowrap w-[15%] text-right">Thành Tiền</th>
                <th className="px-4 py-4 w-[20%]">Chi Tiết Ngày Học (Tháng {selectedMonth + 1})</th>
              </tr>
            </thead>
            {/* Body background is explicitly white */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {reports.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-50 transition-colors">
                  {/* Cột 1: Phụ Huynh */}
                  <td className="px-4 py-3 font-medium text-slate-900 bg-white">
                    {r.parentName}
                  </td>
                  
                  {/* Cột 2: Học Sinh */}
                  <td className="px-4 py-3 text-slate-800 bg-white">
                    {r.studentName}
                  </td>

                  {/* Cột 3: Lớp */}
                  <td className="px-4 py-3 text-center bg-white">
                    <span className="inline-block px-2 py-0.5 bg-white text-slate-600 rounded text-xs font-semibold border border-slate-200">
                      {r.className}
                    </span>
                  </td>

                  {/* Cột 4: Học Phí / Buổi */}
                  <td className="px-4 py-3 text-right text-slate-600 font-mono bg-white">
                    {formatCurrency(r.feePerSession)}
                  </td>

                  {/* Cột 5: Số Buổi */}
                  <td className="px-4 py-3 text-center font-bold text-slate-900 text-base bg-white">
                    {r.totalSessions}
                  </td>

                  {/* Cột 6: Thành Tiền */}
                  <td className="px-4 py-3 text-right font-bold text-emerald-600 text-base font-mono bg-white">
                    {formatCurrency(r.totalAmount)}
                  </td>

                  {/* Cột 7: Chi Tiết Ngày Học */}
                  <td className="px-4 py-3 text-slate-500 text-xs leading-relaxed bg-white">
                    {r.dayList || (
                      <span className="italic text-slate-400">Không có buổi học</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {/* Dòng Tổng Cộng */}
              {reports.length > 0 && (
                <tr className="border-t-2 border-slate-200 bg-white">
                    <td colSpan={4} className="px-4 py-4 text-right font-bold text-slate-900 uppercase bg-white">
                        Tổng Cộng
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-slate-900 bg-white">
                        {reports.reduce((sum, r) => sum + r.totalSessions, 0)}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-blue-700 text-lg font-mono bg-white">
                        {formatCurrency(reports.reduce((sum, r) => sum + r.totalAmount, 0))}
                    </td>
                    <td className="bg-white"></td>
                </tr>
              )}

              {reports.length === 0 && (
                  <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic bg-white">
                          Chưa có dữ liệu cho tháng này. Vui lòng nhấn "Đồng bộ".
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};