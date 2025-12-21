import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, Activity, Stethoscope } from 'lucide-react';

interface MobileLoginPageProps {
  onLogin: () => void;
}

export const MobileLoginPage: React.FC<MobileLoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [text, setText] = useState('');
  
  const fullText = "ระบบบริหารจัดการครุภัณฑ์การแพทย์";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 60);
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
    <div className="min-h-screen w-full bg-slate-50 font-sans relative flex flex-col items-center justify-start overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      <div className="absolute top-0 w-full h-[45vh] bg-blue-600 rounded-b-[40px] shadow-lg z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 opacity-90"></div>
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute top-[20%] left-[-30px] w-24 h-24 bg-cyan-400 opacity-20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 pt-12 pb-6 flex flex-col items-center">
        <div className="text-center text-white mb-8 w-full animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg mb-5">
             <ShieldCheck className="w-4 h-4 text-emerald-300" />
             <span className="text-[10px] uppercase font-bold tracking-widest text-blue-50">Hospital Gateway</span>
           </div>
           
           <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-2">
             Hospital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Asset</span><br/>Management
           </h1>
           
           <div className="h-6 flex items-center justify-center">
              <p className="text-sm text-blue-100/80 font-light flex items-center gap-1">
                {text}<span className="w-0.5 h-4 bg-blue-200 animate-pulse"></span>
              </p>
           </div>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
           <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">ยินดีต้อนรับกลับ</h2>
              <p className="text-slate-400 text-xs mt-1">ลงชื่อเข้าใช้งานระบบด้วยรหัสพนักงาน</p>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-slate-600 ml-1">รหัสพนักงาน / อีเมล</label>
                <div className="relative transition-transform duration-300 focus-within:scale-[1.02]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="username" 
                    required 
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                    placeholder="เช่น admin@hospital.com" 
                    value={formData.username} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-xs font-bold text-slate-600">รหัสผ่าน</label>
                   <a href="#" className="text-[10px] font-medium text-blue-600 hover:text-blue-700">ลืมรหัสผ่าน?</a>
                </div>
                <div className="relative transition-transform duration-300 focus-within:scale-[1.02]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required 
                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
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
                className={`w-full flex items-center justify-center py-4 px-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform active:scale-95 mt-2 ${
                  isSuccess 
                    ? 'bg-emerald-500 hover:bg-emerald-600 ring-2 ring-emerald-500/50' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : isSuccess ? (
                  <span className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                    เข้าสู่ระบบสำเร็จ <ShieldCheck className="h-5 w-5"/>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    เข้าสู่ระบบ <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </button>
           </form>
           
           <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                 <div className="p-2.5 bg-blue-50 rounded-full text-blue-500">
                    <Activity className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-medium">Real-time Track</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-400">
                 <div className="p-2.5 bg-emerald-50 rounded-full text-emerald-500">
                    <Stethoscope className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-medium">Maintenance</span>
              </div>
           </div>
        </div>

        <p className="mt-8 text-[10px] text-slate-400/80 font-medium">
          © 2025 Hospital Asset System. Secure Connection.
        </p>
      </div>
    </div>
  );
};
