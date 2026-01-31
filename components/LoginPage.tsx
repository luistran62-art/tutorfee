import React, { useState } from 'react';
import { BrainCircuit } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate network delay for authentication
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <BrainCircuit className="text-blue-600 w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">TutorFee AI</h1>
        <p className="text-slate-500 mb-8">
          Đăng nhập để quản lý lịch dạy và tính học phí tự động.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl border border-slate-300 transition-all shadow-sm active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Tiếp tục với Google</span>
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
          <p>Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="underline hover:text-slate-600">Điều khoản dịch vụ</a> và <a href="#" className="underline hover:text-slate-600">Chính sách bảo mật</a> của TutorFee AI.</p>
        </div>
      </div>
      
      <div className="mt-8 text-slate-400 text-sm">
        &copy; 2024 TutorFee AI. Powered by Google Gemini.
      </div>
    </div>
  );
};