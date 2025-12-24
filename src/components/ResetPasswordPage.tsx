import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, XCircle, ShieldCheck, Loader2, Mail } from 'lucide-react';

interface ResetPasswordPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [validation, setValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Validate password in real-time
  useEffect(() => {
    setValidation({
      minLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    });
  }, [newPassword]);

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const isFormValid = () => {
    return Object.values(validation).every(v => v === true) && 
           newPassword === confirmPassword && 
           newPassword.length > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
    
    setIsLoading(true);
    // Simulate email verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('password');
    }, 1500);
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center gap-2 transition-all duration-300 ${isValid ? 'text-green-600' : 'text-slate-400'}`}>
      {isValid ? (
        <CheckCircle2 className="w-4 h-4 animate-in zoom-in duration-200" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      <span className={`text-sm ${isValid ? 'font-semibold' : 'font-normal'}`}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100 font-sans selection:bg-blue-100 selection:text-blue-900 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 transition-colors mb-6 flex items-center gap-2 group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">กลับไปหน้าเข้าสู่ระบบ</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            {step === 'email' ? (
              <Mail className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {step === 'email' ? 'ยืนยันอีเมล' : 'ตั้งรหัสผ่านใหม่'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {step === 'email' 
              ? 'กรุณากรอกอีเมลของคุณเพื่อยืนยันตัวตน' 
              : 'กรุณาตั้งรหัสผ่านใหม่ที่ปลอดภัย'}
          </p>
        </div>

        {step === 'email' ? (
          /* Email Verification Form */
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">อีเมล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                  placeholder="example@hospital.com" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>กำลังตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <span>ยืนยันอีเมล</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Password Reset Form */
          <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">รหัสผ่านใหม่</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 transition-colors" />
              </div>
              <input 
                type={showNewPassword ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                className="block w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform" 
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? 
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" /> : 
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                }
              </button>
            </div>
          </div>

          {/* Password Validation Checklist */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-5 border border-slate-200/50">
            <h3 className="text-sm font-bold text-slate-700 mb-3">เงื่อนไขรหัสผ่าน:</h3>
            <div className="space-y-2.5">
              <ValidationItem isValid={validation.minLength} text="มีความยาวอย่างน้อย 8 ตัวอักษร" />
              <ValidationItem isValid={validation.hasUpperCase} text="มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว (A-Z)" />
              <ValidationItem isValid={validation.hasLowerCase} text="มีตัวพิมพ์เล็กอย่างน้อย 1 ตัว (a-z)" />
              <ValidationItem isValid={validation.hasNumber} text="มีตัวเลขอย่างน้อย 1 ตัว (0-9)" />
              <ValidationItem isValid={validation.hasSpecialChar} text="มีอักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*)" />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">ยืนยันรหัสผ่านใหม่</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 transition-colors" />
              </div>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                className={`block w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all text-sm hover:border-slate-300 ${
                  confirmPassword.length > 0 
                    ? passwordsMatch 
                      ? 'border-green-300 focus:border-green-500' 
                      : 'border-red-300 focus:border-red-500'
                    : 'border-slate-200'
                }`}
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" /> : 
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                }
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-600 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง
              </p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && (
              <p className="text-xs text-green-600 mt-1 animate-in fade-in slide-in-from-top-1 duration-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                รหัสผ่านตรงกัน
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={!isFormValid() || isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                <span>บันทึกรหัสผ่านใหม่</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          </form>
        )}

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            🔒 {step === 'email' 
              ? 'ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย' 
              : 'รหัสผ่านของคุณจะถูกเข้ารหัสอย่างปลอดภัย'}<br/>
            ไม่มีใครสามารถเข้าถึงได้ รวมถึงทีมงานของเรา
          </p>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-4 left-6 text-xs text-slate-500 hidden lg:block">
        © 2025 Hospital Asset Maintenance. All rights reserved.
      </div>
      <div className="absolute bottom-4 right-6 text-sm text-blue-600 hover:text-blue-700 cursor-pointer transition-colors hidden lg:block font-medium">
        พบปัญหาการใช้งาน? ติดต่อฝ่ายสนับสนุน
      </div>
    </div>
  );
};
