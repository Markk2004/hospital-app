import React, { useState, useRef } from 'react';
import { User, CreditCard, Phone, Camera, ArrowRight, CheckCircle2, Loader2, Upload, X } from 'lucide-react';

interface RegisterPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idCard: '',
    phone: ''
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format ID Card Number
    if (name === 'idCard') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 13) {
        setFormData({ ...formData, [name]: cleaned });
      }
      return;
    }
    
    // Format Phone Number
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        setFormData({ ...formData, [name]: cleaned });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const formatIdCard = (value: string) => {
    if (!value) return '';
    const parts = [
      value.slice(0, 1),
      value.slice(1, 5),
      value.slice(5, 10),
      value.slice(10, 12),
      value.slice(12, 13)
    ].filter(part => part);
    return parts.join('-');
  };

  const formatPhone = (value: string) => {
    if (!value) return '';
    if (value.length <= 3) return value;
    if (value.length <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      alert('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง');
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setPhoto(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setShowCamera(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    return formData.firstName.length > 0 &&
           formData.lastName.length > 0 &&
           formData.idCard.length === 13 &&
           formData.phone.length === 10 &&
           photo !== null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('ลงทะเบียนสำเร็จ!');
      onSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100 font-sans selection:bg-blue-100 selection:text-blue-900 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        
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
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            ลงทะเบียนผู้ใช้งาน
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            กรุณากรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชีใหม่
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">ชื่อ</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                  placeholder="กรอกชื่อ" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">นามสกุล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                  placeholder="กรอกนามสกุล" 
                />
              </div>
            </div>
          </div>

          {/* ID Card Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">เลขบัตรประชาชน</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                name="idCard"
                value={formatIdCard(formData.idCard)}
                onChange={handleChange}
                required 
                className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                placeholder="X-XXXX-XXXXX-XX-X" 
              />
            </div>
            {formData.idCard.length > 0 && formData.idCard.length < 13 && (
              <p className="text-xs text-amber-600 mt-1">กรุณากรอกเลขบัตรประชาชน 13 หลัก</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">เบอร์โทรศัพท์</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                name="phone"
                value={formatPhone(formData.phone)}
                onChange={handleChange}
                required 
                className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm hover:border-slate-300" 
                placeholder="0XX-XXX-XXXX" 
              />
            </div>
            {formData.phone.length > 0 && formData.phone.length < 10 && (
              <p className="text-xs text-amber-600 mt-1">กรุณากรอกเบอร์โทรศัพท์ 10 หลัก</p>
            )}
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">ถ่ายรูปหน้ายืนยันตัวตน</label>
            
            {!photo && !showCamera && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  ถ่ายรูป
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-4 px-6 bg-white border-2 border-blue-500 text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  อัปโหลดรูป
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {showCamera && (
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="py-3 px-8 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    ถ่ายภาพ
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="py-3 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}

            {photo && (
              <div className="relative bg-slate-100 rounded-2xl overflow-hidden p-4">
                <img src={photo} alt="Profile" className="w-full h-auto rounded-xl" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">รูปภาพพร้อมใช้งาน</span>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
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
                <span>กำลังลงทะเบียน...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>ลงทะเบียน</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            🔒 ข้อมูลส่วนตัวของคุณจะถูกเก็บรักษาอย่างปลอดภัย<br/>
            ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
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
