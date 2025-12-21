import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, Activity, Stethoscope } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [text, setText] = useState('');
  const fullText = "ระบบบริหารจัดการครุภัณฑ์ทางการแพทย์";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLogin(); 
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 animate-in fade-in duration-500 relative">
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 opacity-90 z-10"></div>
        <div className="relative z-20 text-white max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Hospital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Asset</span> <br/> Management
          </h1>
          <p className="text-lg text-blue-100/90 leading-relaxed mb-8 h-8 font-light">
            {text}<span className="animate-pulse">|</span>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <Activity className="w-8 h-8 mb-3 text-blue-300" />
              <h3 className="font-bold text-lg">Real-time</h3>
              <p className="text-xs text-blue-200">ติดตามสถานะเครื่องมือแพทย์ได้ทันที</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <Stethoscope className="w-8 h-8 mb-3 text-emerald-300" />
              <h3 className="font-bold text-lg">Maintenance</h3>
              <p className="text-xs text-blue-200">แจ้งซ่อมและติดตามงานได้ง่ายดาย</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">ยินดีต้อนรับกลับ</h2>
            <p className="text-slate-500 mt-2 text-sm">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบจัดการครุภัณฑ์</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-slate-700 ml-1">รหัสพนักงาน / อีเมล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="username" 
                  required 
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm shadow-sm" 
                  placeholder="Admin" 
                  value={formData.username} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">รหัสผ่าน</label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:underline">ลืมรหัสผ่าน?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required 
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm shadow-sm" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 font-medium">จดจำรหัสผ่าน</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || isSuccess} 
              className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform active:scale-[0.98] ${
                isSuccess 
                  ? 'bg-emerald-500 hover:bg-emerald-600 ring-emerald-500/50' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  เข้าสู่ระบบสำเร็จ <ShieldCheck className="h-5 w-5"/>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  เข้าสู่ระบบ <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="absolute bottom-4 left-6 text-xs text-slate-400 hidden md:block">
          © 2025 Hospital Asset Maintenance. All rights reserved.
        </div>
        <div className="absolute bottom-4 right-6 text-xs text-slate-500 hover:text-blue-600 cursor-pointer transition-colors">
          พบปัญหาการใช้งาน? ติดต่อฝ่ายสนับสนุน
        </div>
      </div>
    </div>
  );
};
