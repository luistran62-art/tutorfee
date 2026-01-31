import React from 'react';
import { LayoutDashboard, Calendar, FileText, Settings, Database, Menu, X, BrainCircuit, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Removed "Architecture" menu item
  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'calculator', label: 'Tính Học Phí', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800">
        <div className="p-6 flex items-center space-x-2">
          <BrainCircuit className="text-blue-400" size={32} />
          <span className="text-xl font-bold tracking-tight">TutorFee AI</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center space-x-3">
              {user.avatarUrl ? (
                 <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
              ) : (
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                 </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate w-28">{user.name}</p>
                <p className="text-xs text-slate-400 truncate w-28">{user.email}</p>
              </div>
            </div>
            <button 
                onClick={onLogout}
                className="text-slate-500 hover:text-white transition-colors"
                title="Đăng xuất"
            >
                <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex justify-between items-center z-20">
          <div className="flex items-center space-x-2">
             <BrainCircuit className="text-blue-600" size={24} />
             <span className="font-bold text-lg text-slate-900">TutorFee AI</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-slate-900 text-white z-10 p-4 shadow-xl md:hidden">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${
                    activeTab === item.id ? 'bg-blue-600' : 'hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-slate-800 pt-4 mt-4">
                 <button 
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300"
                 >
                    <LogOut size={20} />
                    <span className="ml-3">Đăng xuất</span>
                 </button>
              </div>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};