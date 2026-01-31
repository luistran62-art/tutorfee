import React, { useState } from 'react';
import { CalendarEvent, Student } from '../types';
import { DollarSign, Users, CalendarCheck, TrendingUp, ChevronRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  events: CalendarEvent[];
  students: Student[];
}

export const Dashboard: React.FC<DashboardProps> = ({ events, students }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // 1. Calculate Global Stats
  const totalClasses = events.filter(e => e.status !== 'CANCELLED').length;
  const cancelledClasses = events.filter(e => e.status === 'CANCELLED').length;
  
  const calculateRevenue = (studentEvents: CalendarEvent[], student: Student) => {
    return studentEvents.reduce((acc, event) => {
        if (event.status === 'CANCELLED' || event.status === 'TRIAL') return acc;
        if (student.pricingModel === 'SESSION') {
            return acc + student.sessionRate;
        } else {
            const durationHours = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
            return acc + (student.hourlyRate * durationHours);
        }
    }, 0);
  };

  const totalRevenue = students.reduce((acc, s) => {
    const sEvents = events.filter(e => e.title.includes(s.name));
    return acc + calculateRevenue(sEvents, s);
  }, 0);

  // 2. Group By Class Logic
  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));
  
  const classStats = uniqueClasses.map(className => {
      const classStudents = students.filter(s => s.className === className);
      const studentCount = classStudents.length;
      const classRevenue = classStudents.reduce((acc, s) => {
          const sEvents = events.filter(e => e.title.includes(s.name));
          return acc + calculateRevenue(sEvents, s);
      }, 0);
      
      return {
          className,
          studentCount,
          revenue: classRevenue,
          students: classStudents
      };
  });

  const StatCard = ({ title, value, sub, icon, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 mt-2">{sub}</p>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
    </div>
  );

  // View: List of Students in a Class
  if (selectedClass) {
      const currentClassData = classStats.find(c => c.className === selectedClass);
      
      return (
          <div className="space-y-6">
              <button 
                onClick={() => setSelectedClass(null)}
                className="flex items-center text-slate-500 hover:text-blue-600 transition-colors"
              >
                  <ArrowLeft size={18} className="mr-1"/> Quay lại danh sách lớp
              </button>

              <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                      <GraduationCap className="mr-3 text-blue-600" />
                      Lớp: {selectedClass}
                  </h1>
                  <span className="text-emerald-600 font-bold text-lg">
                      Tổng thu: {currentClassData?.revenue.toLocaleString()} đ
                  </span>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-600 font-bold border-b border-slate-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Học sinh</th>
                            <th className="px-6 py-4">Phụ huynh</th>
                            <th className="px-6 py-4 text-center">Số buổi học</th>
                            <th className="px-6 py-4 text-right">Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {currentClassData?.students.map(s => {
                            const sEvents = events.filter(e => e.title.includes(s.name) && e.status !== 'CANCELLED' && e.status !== 'TRIAL');
                            const rev = calculateRevenue(sEvents, s);
                            return (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{s.parentName}</td>
                                    <td className="px-6 py-4 text-center">{sEvents.length}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{rev.toLocaleString()} đ</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
              </div>
          </div>
      );
  }

  // View: Main Dashboard (Class Overview)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Tổng Quan</h1>
        <p className="text-slate-500">Thống kê hoạt động dạy học theo lớp.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Doanh Thu Ước Tính" 
          value={`${totalRevenue.toLocaleString()} đ`} 
          sub="Toàn bộ các lớp"
          icon={<DollarSign size={24} />}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Tổng Số Buổi" 
          value={totalClasses} 
          sub={`${cancelledClasses} buổi huỷ`}
          icon={<CalendarCheck size={24} />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Tổng Học Sinh" 
          value={students.length} 
          sub="Đang hoạt động"
          icon={<Users size={24} />}
          color="bg-purple-500"
        />
        <StatCard 
          title="Số Lớp Học" 
          value={uniqueClasses.length} 
          sub="Đang mở"
          icon={<TrendingUp size={24} />}
          color="bg-orange-400"
        />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Danh Sách Lớp Học</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classStats.map((cls) => (
              <div 
                key={cls.className} 
                onClick={() => setSelectedClass(cls.className)}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              >
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <GraduationCap size={24} />
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Lớp {cls.className}</h4>
                  <p className="text-sm text-slate-500 mb-4">{cls.studentCount} học sinh</p>
                  
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium uppercase">Doanh thu</span>
                      <span className="text-emerald-600 font-bold">{cls.revenue.toLocaleString()} đ</span>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};