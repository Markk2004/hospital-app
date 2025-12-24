import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, Activity, Stethoscope } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

interface LoginPageProps {
  onLogin: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onForgotPassword, onRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      alert('กรุณายืนยันว่าคุณไม่ใช่หุ่นยนต์');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLogin(); 
      }, 800);
    }, 1500);
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 font-sans selection:bg-blue-100 selection:text-blue-900 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"></div>
        
        {/* Floating 3D Spheres */}
        <div className="absolute top-10 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
      </div>

      {/* Breaking Container - Decorative Element */}
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-400 rounded-full blur-2xl opacity-30 -translate-y-1/2 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-gradient-to-tr from-indigo-400 to-sky-500 rounded-full blur-3xl opacity-20 translate-y-1/2 pointer-events-none animate-pulse delay-700"></div>

      {/* Main Card Container with Glassmorphism */}
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-visible animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        
        {/* Breaking Element - 3D Floating Card Top Right */}
        <div className="hidden lg:block absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-400 to-sky-500 rounded-2xl shadow-2xl transform rotate-12 animate-pulse z-20">
          <div className="absolute inset-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"></div>
        </div>

        {/* Overlapping Glassmorphism Decorations */}
        <div className="hidden lg:block absolute top-1/4 -left-4 w-16 h-16 bg-indigo-400/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg z-20"></div>
        <div className="hidden lg:block absolute bottom-1/3 -right-4 w-20 h-20 bg-blue-500/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg transform rotate-45 z-20"></div>

        <div className="flex flex-col lg:flex-row min-h-[600px] relative">
          
          {/* Left Side - Abstract 3D Illustration */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-600 relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
            {/* Grainy Texture Overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}></div>

            {/* 3D Abstract Shapes - Geometric Design */}
            <div className="absolute inset-0">
              {/* Large Floating Cube/Diamond */}
              <div className="absolute top-1/4 left-1/4 w-80 h-80 transform rotate-45">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-indigo-200/40 rounded-3xl blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute inset-8 bg-gradient-to-tr from-blue-300/50 to-white/30 rounded-2xl blur-lg" style={{
                  transform: 'rotate(-45deg) scale(0.8)'
                }}></div>
              </div>
              
              {/* Floating Rings */}
              <div className="absolute top-1/3 right-1/4 w-56 h-56">
                <div className="absolute inset-0 border-8 border-white/20 rounded-full blur-sm animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute inset-8 border-4 border-indigo-200/30 rounded-full blur-sm animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
              </div>

              {/* Gradient Spheres */}
              <div className="absolute bottom-1/4 right-1/3 w-40 h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-indigo-400 rounded-full blur-2xl opacity-60 animate-pulse delay-500"></div>
              </div>

              <div className="absolute top-2/3 left-1/3 w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-sky-300 rounded-full blur-xl opacity-50 animate-pulse delay-1000"></div>
              </div>

              {/* Floating Dots */}
              <div className="absolute top-20 right-20 w-4 h-4 bg-white/80 rounded-full animate-ping opacity-60"></div>
              <div className="absolute bottom-32 left-32 w-3 h-3 bg-indigo-200 rounded-full animate-ping opacity-60 delay-300"></div>
              <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-sky-200 rounded-full animate-ping opacity-60 delay-700"></div>
              <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-white/70 rounded-full animate-ping opacity-60 delay-500"></div>
            </div>

            {/* Content with Glassmorphism Card */}
            <div className="relative z-10 text-white max-w-md space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight drop-shadow-lg">
                  Hospital Asset<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-sky-100">
                    Management
                  </span>
                </h1>
                
                <p className="text-blue-50/90 text-lg font-light leading-relaxed drop-shadow">
                  ระบบบริหารจัดการครุภัณฑ์ทางการแพทย์<br/>ที่ทันสมัยและมีประสิทธิภาพ
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group cursor-default shadow-xl">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <Activity className="w-6 h-6 text-white drop-shadow" />
                  </div>
                  <h3 className="font-bold text-base mb-1 drop-shadow">Real-time Tracking</h3>
                  <p className="text-xs text-blue-50/80 leading-relaxed">ติดตามสถานะแบบเรียลไทม์</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group cursor-default shadow-xl">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <Stethoscope className="w-6 h-6 text-white drop-shadow" />
                  </div>
                  <h3 className="font-bold text-base mb-1 drop-shadow">Easy Maintenance</h3>
                  <p className="text-xs text-blue-50/80 leading-relaxed">บริการซ่อมบำรุงที่สะดวก</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Login Form with Overlapping Elements */}
          <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white/50 backdrop-blur-sm relative">
            
            {/* Overlapping Glassmorphism Accent */}
            <div className="hidden lg:block absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 backdrop-blur-md rounded-full border border-white/50 -z-10"></div>
            <div className="hidden lg:block absolute bottom-12 left-8 w-24 h-24 bg-gradient-to-tr from-sky-400/20 to-blue-400/20 backdrop-blur-md rounded-2xl border border-white/50 transform rotate-12 -z-10"></div>

            <div className="w-full max-w-md space-y-8 relative z-10">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                  ยินดีต้อนรับ
                </h2>
                <p className="text-slate-500 text-base">
                  เข้าสู่ระบบเพื่อจัดการครุภัณฑ์ของคุณ
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">รหัสพนักงาน / อีเมล</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      name="username" 
                      required 
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                      placeholder="admin@hospital.com" 
                      value={formData.username} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">รหัสผ่าน</label>
                    <button 
                      type="button"
                      onClick={onForgotPassword}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 transition-colors" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      required 
                      className="block w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                      placeholder="••••••••" 
                      value={formData.password} 
                      onChange={handleChange} 
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" /> : 
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                      }
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer" 
                    />
                    <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      จดจำฉันไว้
                    </span>
                  </label>
                </div>
                
                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6Lev2DUsAAAAAB5Vzo5XHIt_zQddLt2J5iSSS5-F"
                    onChange={handleRecaptchaChange}
                    theme="light"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading || isSuccess || !recaptchaToken}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>กำลังเข้าสู่ระบบ...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      <span>เข้าสู่ระบบสำเร็จ!</span>
                    </>
                  ) : (
                    <>
                      <span>เข้าสู่ระบบ</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-6">
                <p className="text-sm text-slate-500">
                  ยังไม่มีบัญชี?{' '}
                  <button 
                    onClick={onRegister}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    ลงทะเบียน
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-4 left-6 text-sm text-slate-600 font-medium hidden lg:block">
          © 2025 Hospital Asset Maintenance. All rights reserved.
        </div>
        <div className="absolute bottom-4 right-6 hidden lg:block">
          <span className="text-sm text-slate-600">พบปัญหาการใช้งาน? </span>
          <a href="#" className="text-base font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
            ติดต่อฝ่ายสนับสนุน
          </a>
        </div>
      </div>
    </div>
  );
};
