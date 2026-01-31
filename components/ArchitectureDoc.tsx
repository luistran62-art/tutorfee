import React from 'react';
import { Database, Server, Workflow, Globe, Cpu } from 'lucide-react';

export const ArchitectureDoc: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Kiến Trúc Hệ Thống</h1>
        <p className="text-slate-500">Tài liệu kỹ thuật cho hệ thống tính học phí tự động TutorFee AI.</p>
      </div>

      {/* 1. Architecture Diagram */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center mb-4 text-blue-600">
          <Server className="mr-2" />
          <h2 className="text-xl font-bold text-slate-900">1. Sơ đồ Kiến trúc (High-Level)</h2>
        </div>
        <div className="font-mono text-xs md:text-sm bg-slate-900 text-green-400 p-6 rounded-lg leading-relaxed whitespace-pre overflow-x-auto">
{`
[CLIENT SIDE - REACT SPA]
    |
    |  (REST / GraphQL)
    V
[BACKEND API GATEWAY (Node.js/Express or Python/FastAPI)]
    |
    +--- [AUTH SERVICE] <------> [GOOGLE OAUTH 2.0]
    |
    +--- [SYNC WORKER]
    |       |
    |       +--- [Google Calendar API] (Fetch Events)
    |       +--- [Gmail API] (Fetch Class Notices)
    |
    +--- [AI SERVICE] <--------> [GOOGLE GEMINI API] (NLP Analysis)
    |       (Analyze Email Content -> Extract Intent/Dates)
    |
    +--- [CORE DATABASE (PostgreSQL)]
            (Users, Students, Rates, Invoices, SyncedEvents)
`}
        </div>
      </section>

      {/* 2. Database Schema */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center mb-4 text-purple-600">
          <Database className="mr-2" />
          <h2 className="text-xl font-bold text-slate-900">2. Database Schema (PostgreSQL)</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-700">Users</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>id (PK)</li>
                    <li>email (Unique)</li>
                    <li>google_access_token</li>
                    <li>google_refresh_token</li>
                </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-700">Students</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>id (PK)</li>
                    <li>user_id (FK)</li>
                    <li>name</li>
                    <li>default_rate (Decimal)</li>
                    <li>pricing_model (ENUM: 'SESSION', 'HOURLY')</li>
                </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-700">Events</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>id (PK)</li>
                    <li>student_id (FK)</li>
                    <li>google_event_id</li>
                    <li>start_time (Timestamp)</li>
                    <li>end_time (Timestamp)</li>
                    <li>status (ENUM: 'COMPLETED', 'CANCELLED', 'PAID')</li>
                    <li>ai_flagged (Boolean)</li>
                </ul>
            </div>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-700">Invoices</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>id (PK)</li>
                    <li>student_id (FK)</li>
                    <li>month (Date)</li>
                    <li>total_amount</li>
                    <li>is_sent (Boolean)</li>
                </ul>
            </div>
        </div>
      </section>

      {/* 3. Workflows */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center mb-4 text-orange-600">
          <Workflow className="mr-2" />
          <h2 className="text-xl font-bold text-slate-900">3. Luồng Xử Lý (Workflow)</h2>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-slate-800 mb-2">A. Đồng bộ & Tính toán</h3>
                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                    <li>Người dùng nhấn "Sync" trên Dashboard.</li>
                    <li>Backend gọi Google Calendar API lấy danh sách events trong tháng.</li>
                    <li>Hệ thống map events với danh sách <code className="bg-slate-100 px-1 rounded">Students</code> dựa trên Title/Description.</li>
                    <li>Lưu/Cập nhật events vào Database với trạng thái mặc định.</li>
                </ol>
            </div>
            <div className="border-t pt-4">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center">
                    B. AI Đối soát (Smart Reconciliation)
                    <Cpu size={16} className="ml-2 text-blue-500"/>
                </h3>
                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                    <li>Backend fetch emails có label "Học tập" qua Gmail API.</li>
                    <li>Gửi nội dung email (snippet) sang Gemini API (Model: gemini-2.5-flash).</li>
                    <li>Prompt: <em>"Trích xuất tên học sinh, ngày nghỉ, và hành động (Cancel/Reschedule)."</em></li>
                    <li>Nếu AI phát hiện "Cancel" vào ngày X: Tìm Event ngày X trong DB &rarr; Update Status = 'CANCELLED'.</li>
                    <li>Recalculate: Tính lại tổng tiền dựa trên status mới.</li>
                </ol>
            </div>
        </div>
      </section>

      {/* 4. Pseudocode */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center mb-4 text-slate-900">
          <Globe className="mr-2" />
          <h2 className="text-xl font-bold">4. Pseudocode (Logic lõi)</h2>
        </div>
        <div className="font-mono text-xs bg-slate-50 border border-slate-200 p-4 rounded-lg text-slate-700">
{`function calculateMonthlyFee(student, month):
    events = db.getEvents(student.id, month)
    total = 0
    
    for event in events:
        if event.tags.contains('#trial'):
            continue // Bỏ qua học thử
            
        if event.status == 'CANCELLED':
            // Check logic bù
            if hasMakeupClass(event):
                // Logic phức tạp: nếu đã học bù thì tính tiền buổi bù, bỏ buổi này
                continue 
            else:
                continue // Không tính tiền
                
        duration = event.end - event.start
        
        if student.pricing_model == 'HOURLY':
            total += duration * student.hourly_rate
        else:
            total += student.session_rate
            
    return total`}
        </div>
      </section>
    </div>
  );
};