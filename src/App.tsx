import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Wrench, 
  Package, 
  ArrowRightLeft, 
  AlertCircle, 
  Activity,
  Search,
  Bell,
  User,
  Menu,
  X,
  Plus,
  Clock,
  CheckCircle2,
  MapPin,
  LayoutList,
  Layout,
  Trash2,
  FileText,
  AlertTriangle,
  ChevronRight,
  Calculator,
  Camera,
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Loader2,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- TYPES ---

interface Part {
  id: string;
  name: string;
  price: number;
  stock: number;
  min: number;
  unit: string;
  qty?: number;
}

interface Job {
  id: string;
  assetId: string;
  assetName: string;
  location: string;
  issue: string;
  urgency: 'normal' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'waiting_parts' | 'completed';
  reporter: string;
  date: string;
  type: 'CM' | 'PM';
  technician: string | null;
  partsUsed: Part[];
  repairNote: string;
}

interface FormData {
  assetName: string;
  assetId?: string;
  location: string;
  issue: string;
  urgency: 'normal' | 'medium' | 'high';
  reporter: string;
}

// --- INITIAL DATA ---

const initialPartsInventoryData: Part[] = [
  { id: 'P001', name: 'Battery 12V Li-ion', price: 2500, stock: 15, min: 5, unit: 'ก้อน' },
  { id: 'P002', name: 'Oxygen Sensor', price: 4500, stock: 4, min: 3, unit: 'ตัว' },
  { id: 'P003', name: 'Power Cord (Grade A)', price: 850, stock: 20, min: 10, unit: 'เส้น' },
  { id: 'P004', name: 'LCD Screen 7"', price: 3200, stock: 2, min: 2, unit: 'จอ' },
  { id: 'P005', name: 'Rubber Seal / O-Ring', price: 150, stock: 50, min: 20, unit: 'ชุด' },
  { id: 'P006', name: 'Filter Hepa', price: 1200, stock: 5, min: 10, unit: 'ชิ้น' },
  { id: 'P007', name: 'ECG Cable Set (5 Lead)', price: 2100, stock: 6, min: 4, unit: 'ชุด' },
  { id: 'P008', name: 'NIBP Cuff (Adult L)', price: 980, stock: 3, min: 6, unit: 'ชิ้น' },
  { id: 'P009', name: 'Infusion Pump Tubing', price: 320, stock: 28, min: 12, unit: 'ม้วน' },
  { id: 'P010', name: 'Ventilator Exhalation Valve', price: 5400, stock: 1, min: 3, unit: 'ชิ้น' },
  { id: 'P011', name: 'Ultrasound Probe Gel (1L)', price: 260, stock: 34, min: 15, unit: 'ขวด' },
  { id: 'P012', name: 'Defib Paddle Pad (Adult)', price: 1800, stock: 7, min: 6, unit: 'คู่' },
];

const initialJobs: Job[] = [
  { 
    id: 'JOB-2512-001', 
    assetId: 'EQ-ICU-05',
    assetName: 'Ventilator (เครื่องช่วยหายใจ)', 
    location: 'ICU ชั้น 3',
    issue: 'เครื่องร้องเตือน Low Pressure บ่อย',
    urgency: 'high', 
    status: 'new', 
    reporter: 'พยาบาลวิชาชีพ สมหญิง',
    date: '20/12/2025 09:30',
    type: 'CM', 
    technician: null,
    partsUsed: [],
    repairNote: ''
  },
  { 
    id: 'JOB-2512-002', 
    assetId: 'EQ-OPD-12',
    assetName: 'Digital BP Monitor', 
    location: 'OPD อายุรกรรม',
    issue: 'เปิดไม่ติด หน้าจอดับ',
    urgency: 'medium',
    status: 'in_progress',
    reporter: 'จนท. ธุรการ',
    date: '20/12/2025 10:15',
    type: 'CM', 
    technician: 'นายช่าง สมชาย',
    partsUsed: [],
    repairNote: 'กำลังตรวจสอบวงจรภาคจ่ายไฟ'
  },
  { 
    id: 'JOB-2512-003', 
    assetId: 'EQ-ER-10',
    assetName: 'Defibrillator', 
    location: 'ER ห้องฉุกเฉิน',
    issue: 'ชาร์จไม่เต็ม แบตลดเร็ว',
    urgency: 'high',
    status: 'waiting_parts',
    reporter: 'พยาบาล ER',
    date: '19/12/2025 21:10',
    type: 'CM', 
    technician: 'ช่างภาคภูมิ',
    partsUsed: [{ id: 'P001', name: 'Battery 12V Li-ion', price: 2500, stock: 15, min: 5, unit: 'ก้อน', qty: 1 }],
    repairNote: 'รอแบตสำรองล็อตใหม่'
  },
  { 
    id: 'JOB-2512-004', 
    assetId: 'EQ-WARD-22',
    assetName: 'Infusion Pump', 
    location: 'Ward 7 ห้อง 712',
    issue: 'Flow rate แกว่ง ±15%',
    urgency: 'medium',
    status: 'in_progress',
    reporter: 'หัวหน้าวอร์ด',
    date: '18/12/2025 14:45',
    type: 'CM', 
    technician: 'ช่างบอย',
    partsUsed: [],
    repairNote: 'ทดสอบการคาลิเบรตใหม่'
  },
  { 
    id: 'JOB-2512-005', 
    assetId: 'EQ-LAB-04',
    assetName: 'Centrifuge รุ่น CX400', 
    location: 'Lab Hematology',
    issue: 'ฝาปิดล็อคไม่สนิท เซนเซอร์ไม่ทำงาน',
    urgency: 'medium',
    status: 'waiting_parts',
    reporter: 'นักเทคนิคการแพทย์',
    date: '17/12/2025 11:05',
    type: 'CM', 
    technician: 'ช่างศักดิ์',
    partsUsed: [{ id: 'P005', name: 'Rubber Seal / O-Ring', price: 150, stock: 50, min: 20, unit: 'ชุด', qty: 2 }],
    repairNote: 'สั่งซีลยางใหม่'
  },
  { 
    id: 'JOB-2512-006', 
    assetId: 'EQ-XR-03',
    assetName: 'Portable X-Ray', 
    location: 'Radiology ชั้น 1',
    issue: 'ล้อเข็นฝืด + มีเสียงดัง',
    urgency: 'normal',
    status: 'new',
    reporter: 'นักรังสีเทคนิค',
    date: '17/12/2025 08:55',
    type: 'CM', 
    technician: null,
    partsUsed: [],
    repairNote: ''
  },
  { 
    id: 'JOB-2512-007', 
    assetId: 'EQ-GEN-77',
    assetName: 'Patient Monitor (5-para)', 
    location: 'Ward 5 ห้อง 502',
    issue: 'NIBP error E07 ค่าวัดไม่ขึ้น',
    urgency: 'normal',
    status: 'completed',
    reporter: 'พยาบาลเวรเช้า',
    date: '16/12/2025 09:20',
    type: 'CM', 
    technician: 'ช่างหนึ่ง',
    partsUsed: [{ id: 'P008', name: 'NIBP Cuff (Adult L)', price: 980, stock: 3, min: 6, unit: 'ชิ้น', qty: 1 }],
    repairNote: 'เปลี่ยน Cuff และทดสอบผ่าน'
  },
  { 
    id: 'JOB-2512-008', 
    assetId: 'EQ-PM-2025-01',
    assetName: 'Suction Machine', 
    location: 'ER',
    issue: 'PM ประจำปี',
    urgency: 'normal',
    status: 'completed',
    reporter: 'System Auto',
    date: '15/12/2025 08:00',
    type: 'PM', 
    technician: 'ช่างใหญ่',
    partsUsed: [{ id: 'P006', name: 'Filter Hepa', price: 1200, stock: 5, min: 10, unit: 'ชิ้น', qty: 1 }],
    repairNote: 'ทำ PM + เปลี่ยนฟิลเตอร์'
  },
];

const depreciationData = [
  { name: 'เครื่องช่วยหายใจ', cost: 1200000, current: 800000 },
  { name: 'เตียงผู้ป่วยไฟฟ้า', cost: 500000, current: 350000 },
  { name: 'เครื่อง X-Ray', cost: 3500000, current: 1200000 },
  { name: 'Monitor EKG', cost: 300000, current: 150000 },
];

// --- COMPONENT: TOAST NOTIFICATION (POPUP) ---
const Toast = ({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000); // Auto close in 3s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4">
      <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700">
        <div className="bg-green-500 rounded-full p-1"><Check className="w-3 h-3 text-white" /></div>
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};

// --- COMPONENTS HELPER ---

const UrgencyBadge = ({ level, detailed = false }: { level: Job['urgency'], detailed?: boolean }) => {
  const configs = {
    high: { color: 'bg-red-100 text-red-700 border-red-200', text: 'ฉุกเฉิน', fullText: 'ฉุกเฉิน (Emergency)', icon: AlertTriangle },
    medium: { color: 'bg-orange-100 text-orange-700 border-orange-200', text: 'เร่งด่วน', fullText: 'เร่งด่วน (Urgent)', icon: Clock },
    normal: { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'ปกติ', fullText: 'ปกติ (Normal)', icon: CheckCircle2 },
  };
  const config = configs[level] || configs.normal;
  const Icon = config.icon;
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.color} whitespace-nowrap`}>
      <Icon className="w-3 h-3" /> {detailed ? config.fullText : config.text}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Job['status'] }) => {
  const styles = {
    new: 'bg-blue-50 text-blue-600 border-blue-200',
    in_progress: 'bg-orange-50 text-orange-600 border-orange-200',
    waiting_parts: 'bg-purple-50 text-purple-600 border-purple-200',
    completed: 'bg-green-50 text-green-600 border-green-200',
  };
  const labels = { new: 'งานใหม่', in_progress: 'กำลังซ่อม', waiting_parts: 'รออะไหล่', completed: 'เสร็จสิ้น' };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100'}`}>
      {labels[status] || status}
    </span>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: { title: string; value: string | number; subtext: string; icon: any; colorClass: string }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between min-h-[120px] hover:shadow-md transition-shadow duration-300">
    <div className="flex-1 mr-2">
      <p className="text-slate-500 text-sm font-medium mb-2 truncate">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 leading-none mb-2">{value}</h3>
      <p className={`text-xs ${subtext.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>{subtext}</p>
    </div>
    <div className={`p-3 rounded-lg flex-shrink-0 ${colorClass} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

// --- COMPONENT: LOGIN PAGE ---
const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // New state
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      {/* LEFT SIDE: IMAGE & INFO (DESKTOP ONLY) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 opacity-90 z-10"></div>
        <div className="relative z-20 text-white max-w-lg">
          
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Hospital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Asset</span> <br/> Management</h1>
          <p className="text-lg text-blue-100/90 leading-relaxed mb-8 h-8 font-light">{text}<span className="animate-pulse">|</span></p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <Activity className="w-8 h-8 mb-3 text-blue-300" /><h3 className="font-bold text-lg">Real-time</h3><p className="text-xs text-blue-200">ติดตามสถานะเครื่องมือแพทย์ได้ทันที</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <Stethoscope className="w-8 h-8 mb-3 text-emerald-300" /><h3 className="font-bold text-lg">Maintenance</h3><p className="text-xs text-blue-200">แจ้งซ่อมและติดตามงานได้ง่ายดาย</p>
            </div>
          </div>
        </div>
      </div>
      {/* RIGHT SIDE: LOGIN FORM */}
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                <input type="text" name="username" required className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm shadow-sm" placeholder="Admin" value={formData.username} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1"><label className="text-sm font-semibold text-slate-700">รหัสผ่าน</label><a href="#" className="text-xs font-medium text-blue-600 hover:underline">ลืมรหัสผ่าน?</a></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                <input type={showPassword ? "text" : "password"} name="password" required className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm shadow-sm" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
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

            <button type="submit" disabled={isLoading || isSuccess} className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform active:scale-[0.98] ${isSuccess ? 'bg-emerald-500 hover:bg-emerald-600 ring-emerald-500/50' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}>
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : isSuccess ? <span className="flex items-center gap-2">เข้าสู่ระบบสำเร็จ <ShieldCheck className="h-5 w-5"/></span> : <span className="flex items-center gap-2">เข้าสู่ระบบ <ArrowRight className="h-5 w-5" /></span>}
            </button>
          </form>
        </div>

        {/* Footer Elements */}
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

const MobileLoginPage = ({ onLogin = () => {} }: { onLogin: () => void }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [text, setText] = useState('');
  
  // ข้อความสำหรับพิมพ์ (ย่อให้สั้นลงนิดหน่อยเพื่อให้พอดีมือถือ)
  const fullText = "ระบบบริหารจัดการครุภัณฑ์การแพทย์";

  // Typing Effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLogin(); 
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans relative flex flex-col items-center justify-start overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Background Gradient Header (ส่วนสีน้ำเงินด้านบน) */}
      <div className="absolute top-0 w-full h-[45vh] bg-blue-600 rounded-b-[40px] shadow-lg z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 opacity-90"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute top-[20%] left-[-30px] w-24 h-24 bg-cyan-400 opacity-20 rounded-full blur-xl"></div>
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 w-full max-w-md px-6 pt-12 pb-6 flex flex-col items-center h-full">
        
        {/* Branding Section */}
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

        {/* Login Card */}
        <div className="w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
           <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">ยินดีต้อนรับกลับ</h2>
              <p className="text-slate-400 text-xs mt-1">ลงชื่อเข้าใช้งานระบบด้วยรหัสพนักงาน</p>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
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

              {/* Password Input */}
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

              {/* Remember Me Checkbox */}
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

              {/* Submit Button */}
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
           
           {/* Quick Features (Icon Grid) */}
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

        {/* Footer */}
        <p className="mt-8 text-[10px] text-slate-400/80 font-medium">
          © 2025 Hospital Asset System. Secure Connection.
        </p>

      </div>
    </div>
  );
};

// --- MODAL: JOB DETAIL ---
const JobDetailModal = ({ 
  job, 
  inventory, 
  onClose, 
  onSave, 
  onUsePart,
  onShowToast // รับ Function แสดง Toast
}: { 
  job: Job; 
  inventory: Part[]; 
  onClose: () => void; 
  onSave: (j: Job) => void;
  onUsePart: (partId: string) => void;
  onShowToast: (msg: string) => void;
}) => {
  const [status] = useState<Job['status']>(job.status);
  const [repairNote, setRepairNote] = useState(job.repairNote || '');
  const [usedParts, setUsedParts] = useState<Part[]>(job.partsUsed || []);
  const [selectedPartId, setSelectedPartId] = useState('');

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const partInStock = inventory.find(p => p.id === selectedPartId);
    
    if (!partInStock || partInStock.stock <= 0) {
      alert("อะไหล่หมด! ไม่สามารถเบิกได้");
      return;
    }
    
    onUsePart(selectedPartId); 

    const existing = usedParts.find(p => p.id === partInStock.id);
    if (existing) {
      setUsedParts(usedParts.map(p => p.id === partInStock.id ? { ...p, qty: (p.qty || 0) + 1 } : p));
    } else {
      setUsedParts([...usedParts, { ...partInStock, qty: 1 }]);
    }
  };

  const handleRemovePart = (id: string) => {
    setUsedParts(usedParts.filter(p => p.id !== id));
  };

  const totalCost = usedParts.reduce((sum, p) => sum + (p.price * (p.qty || 1)), 0);

  const handleSave = (newStatus: Job['status']) => {
    onSave({
      ...job,
      status: newStatus,
      repairNote: repairNote,
      partsUsed: usedParts,
      technician: newStatus !== 'new' && !job.technician ? 'Admin User' : job.technician
    });

    // ถ้ากดปิดงานซ่อม ให้เด้ง Popup แจ้งเตือน
    if (newStatus === 'completed') {
      onShowToast("ปิดงานซ่อมเรียบร้อยแล้ว!");
    }
  };

  // ปรับ Responsive: บนมือถือ (default) เป็น flex-col, บนจอใหญ่ (md) เป็น flex-row
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-bold text-slate-800">{job.id}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${job.type === 'PM' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-200 text-slate-600 border-slate-300'}`}>
                {job.type}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">แจ้งเมื่อ: {job.date} | โดย: {job.reporter}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
             {/* Left Panel: Asset Info - บนมือถือจะอยู่บนสุด */}
             <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 p-4 md:p-6 overflow-y-auto bg-white shrink-0">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Info</label>
                    <div className="mt-2 p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600"><Package className="w-6 h-6" /></div>
                        <div><p className="font-bold text-slate-800 text-sm md:text-base">{job.assetName}</p><p className="text-xs text-slate-500 font-mono mt-0.5">{job.assetId}</p></div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">อาการที่แจ้ง</label>
                    <div className="mt-2 p-3 md:p-4 bg-red-50 rounded-xl border border-red-100 text-slate-700">
                      <p className="font-medium flex items-start gap-2 text-sm md:text-base"><AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />"{job.issue}"</p>
                      <div className="mt-3"><UrgencyBadge level={job.urgency} detailed /></div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Right Panel: Work Area - เลื่อนได้อิสระ */}
             <div className="w-full md:w-2/3 p-4 md:p-6 overflow-y-auto bg-slate-50/30 flex flex-col">
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-sm md:text-base"><Wrench className="w-5 h-5 text-blue-600" /> บันทึกการซ่อม</h3>
                    <textarea 
                      className="w-full h-24 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="ระบุสาเหตุที่พบ และวิธีการแก้ไข..."
                      value={repairNote}
                      onChange={(e) => setRepairNote(e.target.value)}
                      disabled={status === 'completed'}
                    ></textarea>
                  </div>

                  <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base"><Calculator className="w-5 h-5 text-orange-500" /> เบิกอะไหล่</h3>
                        <div className="text-right"><p className="text-xs text-slate-500">รวมค่าใช้จ่าย</p><p className="font-bold text-blue-600 text-base md:text-lg">฿{totalCost.toLocaleString()}</p></div>
                    </div>
                    {status !== 'completed' && (
                      <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <select className="flex-1 p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full" value={selectedPartId} onChange={(e) => setSelectedPartId(e.target.value)}>
                          <option value="">-- เลือกอะไหล่ --</option>
                          {inventory.map(part => (
                            <option key={part.id} value={part.id} disabled={part.stock <= 0}>
                               {part.name} (เหลือ: {part.stock}) - ฿{part.price.toLocaleString()}
                            </option>
                          ))}
                        </select>
                        <button onClick={handleAddPart} disabled={!selectedPartId} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap w-full sm:w-auto">+ เพิ่ม</button>
                      </div>
                    )}
                    {usedParts.length > 0 ? (
                      <div className="border border-slate-100 rounded-lg overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[300px]">
                          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-2 pl-3">รายการ</th><th className="p-2 text-center">จำนวน</th><th className="p-2 text-right">ราคา</th><th className="p-2"></th></tr></thead>
                          <tbody>
                            {usedParts.map((part) => (
                              <tr key={part.id} className="border-t border-slate-50">
                                <td className="p-2 pl-3 font-medium text-slate-700">{part.name}</td><td className="p-2 text-center">{part.qty}</td><td className="p-2 text-right text-slate-500">฿{(part.price * (part.qty || 1)).toLocaleString()}</td>
                                <td className="p-2 text-center">{status !== 'completed' && (<button onClick={() => handleRemovePart(part.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <div className="text-center p-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg bg-slate-50">ยังไม่มีการใช้อะไหล่</div>}
                  </div>
                </div>
             </div>
        </div>

        {/* Footer Actions - Responsive: Stack on mobile, Row on desktop */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-t border-slate-200 bg-white flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3 z-10 shrink-0">
           {status !== 'completed' ? (
             <>
               <button onClick={() => handleSave('waiting_parts')} className={`px-4 py-2.5 rounded-xl font-bold border flex items-center justify-center gap-2 transition-colors text-sm ${status === 'waiting_parts' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}><Clock className="w-4 h-4" /> รออะไหล่</button>
               <button onClick={() => handleSave('in_progress')} className={`px-4 py-2.5 rounded-xl font-bold border flex items-center justify-center gap-2 transition-colors text-sm ${status === 'in_progress' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50'}`}><Wrench className="w-4 h-4" /> กำลังซ่อม</button>
               <button onClick={() => handleSave('completed')} className="px-6 py-2.5 rounded-xl text-white font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4" /> ปิดงานซ่อม</button>
             </>
           ) : (
             <div className="flex items-center justify-center w-full sm:w-auto gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl border border-green-200 text-sm"><CheckCircle2 className="w-5 h-5" /> ปิดงานเรียบร้อยแล้ว <button onClick={onClose} className="ml-4 text-slate-500 hover:text-slate-700 text-xs underline">ปิดหน้าต่าง</button></div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: REPAIR REQUEST FORM ---
const RepairRequestForm = ({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (data: FormData) => void }) => {
  const [formData, setFormData] = useState<FormData>({ 
    assetName: '', 
    location: 'Auto: Ward 5', 
    issue: '', 
    urgency: 'normal',
    reporter: 'Admin User'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({...formData, [e.target.name]: e.target.value});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.assetName || !formData.issue) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 mt-4 animate-in fade-in slide-in-from-bottom-4 overflow-y-auto max-h-[85vh]">
      <div className="text-center mb-6 md:mb-8">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm"><FileText className="w-7 h-7 md:w-8 md:h-8" /></div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">แบบฟอร์มแจ้งซ่อม</h2>
        <p className="text-slate-500 mt-2 text-sm">กรุณาระบุรายละเอียดให้ครบถ้วน</p>
      </div>

      <div className="space-y-5 md:space-y-6">
        <div 
            onClick={() => alert("ระบบ QR Code ปิดปรับปรุงชั่วคราว")}
            className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between group cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
        >
           <div className="flex items-center gap-4"><div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform"><Camera className="w-6 h-6 text-slate-600" /></div><div><h4 className="font-bold text-slate-700 text-sm md:text-base">Scan QR Code</h4><p className="text-xs text-slate-400">สแกนเพื่อดึงข้อมูลอัตโนมัติ</p></div></div><ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-slate-700 mb-1">ชื่อเครื่อง / รหัส</label><div className="relative"><Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" /><input type="text" name="assetName" value={formData.assetName} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="ค้นหา..." /></div></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">สถานที่</label><input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50" placeholder="ระบุตึก/ชั้น" /></div>
          </div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">อาการเสีย</label><textarea name="issue" value={formData.issue} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none" placeholder="รายละเอียดอาการ..."></textarea></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-2">ความเร่งด่วน</label><div className="grid grid-cols-3 gap-3">{[{ id: 'normal', label: 'ปกติ', icon: CheckCircle2, color: 'peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700' },{ id: 'medium', label: 'เร่งด่วน', icon: Clock, color: 'peer-checked:bg-orange-50 peer-checked:border-orange-500 peer-checked:text-orange-700' },{ id: 'high', label: 'ฉุกเฉิน', icon: AlertTriangle, color: 'peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700' }].map(opt => (<label key={opt.id} className="cursor-pointer"><input type="radio" name="urgency" value={opt.id} checked={formData.urgency === opt.id} onChange={handleChange} className="peer sr-only" /><div className={`p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 transition-all ${opt.color}`}><opt.icon className="w-5 h-5 mx-auto mb-1 opacity-70" /><span className="text-xs md:text-sm font-bold">{opt.label}</span></div></label>))}</div></div>
          <div className="pt-6 flex gap-3 border-t border-slate-100"><button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm">ยกเลิก</button><button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm">ส่งเรื่อง</button></div>
        </form>
      </div>
    </div>
  );
};

// --- VIEW: DASHBOARD ---
const DashboardView = ({ jobs, inventory, onNavigate }: { jobs: Job[]; inventory: Part[]; onNavigate: (tab: string) => void }) => {
  
  const inRepairCount = jobs.filter(j => j.status !== 'completed').length;
  const totalAssets = 620; 
  const borrowed = 120;
  const disposed = 15;
  const ready = totalAssets - inRepairCount - borrowed - disposed;

  const dynamicAssetStatusData = [
    { name: 'พร้อมใช้งาน', value: ready, color: '#10B981' }, 
    { name: 'ถูกยืมใช้งาน', value: borrowed, color: '#3B82F6' },
    { name: 'ส่งซ่อม', value: inRepairCount, color: '#EF4444' },     
    { name: 'จำหน่ายออก', value: disposed, color: '#9CA3AF' },   
  ];

  const lowStockParts = inventory.filter(p => p.stock <= p.min);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const chartHeight = isMobile ? 220 : 320;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50/50 animate-in fade-in duration-300 h-full overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="ครุภัณฑ์ทั้งหมด" value={totalAssets.toString()} subtext="มูลค่า 45.2 ลบ." icon={Stethoscope} colorClass="bg-blue-500 text-blue-500" />
        <StatCard title="ถูกยืมใช้งาน" value={borrowed.toString()} subtext="+12% จากเดือนก่อน" icon={ArrowRightLeft} colorClass="bg-green-500 text-green-500" />
        <StatCard title="งานซ่อมคงค้าง" value={inRepairCount} subtext="Real-time Update" icon={Wrench} colorClass="bg-orange-500 text-orange-500" />
        <StatCard title="อะไหล่ใกล้หมด" value={lowStockParts.length} subtext={`ต้องสั่งซื้อ ${lowStockParts.length} รายการ`} icon={AlertCircle} colorClass="bg-red-500 text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col h-auto lg:h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">สถานะครุภัณฑ์ (Real-time)</h3>
          
          {/* Chart Area */}
          <div className="flex-1" style={{ minHeight: chartHeight }}>
             <ResponsiveContainer width="100%" height={chartHeight}>
               <PieChart>
                 <Pie data={dynamicAssetStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" cornerRadius={4}>
                    {dynamicAssetStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                 </Pie>
                 <RechartsTooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>

          {/* Legend: Color Indicators */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {dynamicAssetStatusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>

          {/* New Requirement: Explicit Numbers */}
          <div className="mt-4 border-t border-slate-100 pt-4">
             <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-500 font-medium">ทั้งหมด</span>
                <span className="text-lg font-bold text-slate-800">{totalAssets}</span>
             </div>
             <div className="grid grid-cols-2 gap-2 text-xs">
                {dynamicAssetStatusData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                       <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                          <span className="text-slate-600 truncate">{item.name}</span>
                       </div>
                       <span className="font-bold text-slate-800">{item.value}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col h-80 lg:h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">มูลค่าทางบัญชี</h3>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={depreciationData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: any) => `${v/1000}k`} axisLine={false} tickLine={false} />
              <RechartsTooltip formatter={(v: any) => v ? `฿${v.toLocaleString()}` : '0'} />
              <Bar dataKey="cost" name="ราคาทุน" fill="#94a3b8" radius={[4, 4, 4, 4]} barSize={20} />
              <Bar dataKey="current" name="มูลค่าปัจจุบัน" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/30"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Wrench className="w-5 h-5 text-blue-600" /> งานซ่อมล่าสุด</h3><button onClick={() => onNavigate('maintenance')} className="text-xs text-blue-600 hover:underline">ดูทั้งหมด</button></div>
          <div className="p-4 space-y-3">
             {jobs.slice(0, 3).map((job) => (<div key={job.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Activity className="w-5 h-5" /></div><div><h4 className="font-semibold text-slate-700 text-sm">{job.assetName}</h4><p className="text-xs text-slate-500">{job.issue}</p></div></div><StatusBadge status={job.status} /></div>))}
             {jobs.length === 0 && <p className="text-center text-slate-400 py-4">ไม่มีงานซ่อมล่าสุด</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/30"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600" /> แจ้งเตือนอะไหล่ (Low Stock)</h3></div>
           <div className="p-4 space-y-4">
              {lowStockParts.length > 0 ? lowStockParts.map((part) => (
                <div key={part.id} className="p-3 bg-white border border-slate-100 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm text-slate-700">{part.name}</span>
                    <span className={`text-sm font-bold ${part.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>{part.stock} {part.unit}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${part.stock === 0 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${(part.stock/part.min)*100}%` }}></div>
                  </div>
                </div>
              )) : <div className="text-center text-green-500 py-6 flex flex-col items-center"><CheckCircle2 className="mb-2"/> สต็อกอะไหล่ปกติทุกรายการ</div>}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- VIEW: MAINTENANCE SYSTEM ---
const MaintenanceView = ({ jobs, inventory, onUpdateJob, onAddJob, onUsePart, onShowToast }: { jobs: Job[]; inventory: Part[]; onUpdateJob: (j: Job) => void; onAddJob: (j: Job) => void; onUsePart: (pid: string) => void; onShowToast: (msg: string) => void; }) => {
  const [activeView, setActiveView] = useState('board');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const getJobsByStatus = (status: Job['status']) => jobs.filter(j => j.status === status);

  const handleUpdateJob = (updatedJob: Job) => {
    onUpdateJob(updatedJob);
    setSelectedJob(null);
  };

  const handleAddNewJob = (formData: FormData) => {
    const newJob: Job = {
      id: `JOB-2512-${Math.floor(Math.random() * 900) + 100}`,
      assetId: formData.assetId || 'N/A', 
      assetName: formData.assetName, 
      location: formData.location || '-', 
      issue: formData.issue, 
      urgency: formData.urgency, 
      status: 'new', 
      reporter: formData.reporter, 
      date: new Date().toLocaleString('th-TH'), 
      type: 'CM', 
      technician: null, 
      partsUsed: [], 
      repairNote: ''
    };
    onAddJob(newJob);
    setActiveView('list');
    onShowToast("สร้างใบงานซ่อมใหม่แล้ว!");
  };

  const handleSelectJob = (job: Job) => {
    if (job.urgency === 'high' && job.status !== 'completed') {
      alert(`แจ้งเตือน: งานซ่อมด่วน (${job.id}) - ${job.assetName}`);
    }
    setSelectedJob(job);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {activeView !== 'form' && (
        <div className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 animate-in fade-in">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 md:w-6 md:h-6 text-blue-600" /> <span className="hidden sm:inline">ระบบแจ้งซ่อม</span><span className="sm:hidden">แจ้งซ่อม</span>
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setActiveView('list')} className={`p-2 rounded-md transition-all ${activeView === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}><LayoutList size={18} /></button>
            <button onClick={() => setActiveView('board')} className={`p-2 rounded-md transition-all ${activeView === 'board' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}><Layout size={18} /></button>
            <button onClick={() => setActiveView('form')} className="p-2 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"><Plus size={18} /></button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeView === 'form' && <RepairRequestForm onCancel={() => setActiveView('list')} onSubmit={handleAddNewJob} />}
        
        {activeView === 'list' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr><th className="px-6 py-4">Job ID</th><th className="px-6 py-4">อุปกรณ์</th><th className="px-6 py-4">อาการ</th><th className="px-6 py-4 text-center">สถานะ</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map(job => (
                    <tr key={job.id} onClick={() => handleSelectJob(job)} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-bold text-blue-600">{job.id}</td>
                      <td className="px-6 py-4"><div>{job.assetName}</div><div className="text-xs text-slate-400">{job.location}</div></td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{job.issue}</td>
                      <td className="px-6 py-4 text-center"><StatusBadge status={job.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'board' && (
           <div className="flex h-full gap-4 overflow-x-auto pb-4 animate-in fade-in snap-x">
             {(['new', 'in_progress', 'waiting_parts', 'completed'] as const).map(status => (
               <div key={status} className="flex-shrink-0 w-72 md:w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 max-h-full snap-center">
                  <div className="p-3 font-bold text-slate-600 uppercase text-xs tracking-wider flex justify-between bg-white/50 rounded-t-xl border-b border-slate-100">
                    {status === 'new' ? 'งานใหม่' : status === 'in_progress' ? 'กำลังดำเนินการ' : status === 'waiting_parts' ? 'รออะไหล่' : 'เสร็จสิ้น'}
                    <span className="bg-white px-2 rounded-md shadow-sm text-slate-800 border border-slate-200">{getJobsByStatus(status).length}</span>
                  </div>
                  <div className="p-2 space-y-2 overflow-y-auto flex-1">
                    {getJobsByStatus(status).map(job => (
                      <div key={job.id} onClick={() => handleSelectJob(job)} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                         <div className="flex justify-between mb-2">
                           <span className="text-[10px] font-bold bg-slate-50 px-1 rounded border text-slate-500">{job.id}</span>
                           <UrgencyBadge level={job.urgency} />
                         </div>
                         <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{job.assetName}</h4>
                         <p className="text-xs text-slate-500 mb-2 line-clamp-2">{job.issue}</p>
                         <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                            <StatusBadge status={job.status} />
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
             ))}
           </div>
        )}
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} inventory={inventory} onUsePart={onUsePart} onClose={() => setSelectedJob(null)} onSave={handleUpdateJob} onShowToast={onShowToast} />}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // Add isMobile state
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [partsInventory, setPartsInventory] = useState<Part[]>(initialPartsInventoryData);
  
  // Toast State
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const triggerToast = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  const handleAddJob = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const handleUsePart = (partId: string) => {
    setPartsInventory(prev => prev.map(part => 
        part.id === partId ? { ...part, stock: Math.max(0, part.stock - 1) } : part
    ));
  };

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any; label: string; id: string }) => (
    <div onClick={() => { setActiveTab(id); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap overflow-hidden ${activeTab === id ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === id ? 'text-blue-600' : 'text-slate-400'}`} /><span className="truncate">{label}</span>
    </div>
  );

  // Mobile: Auto close sidebar & Detect Mobile
  useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) setIsSidebarOpen(false);
        else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) {
    return isMobile ? <MobileLoginPage onLogin={() => setIsLoggedIn(true)} /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'} fixed md:relative bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-30 h-full flex-shrink-0 shadow-lg shadow-slate-100`}>
        <div className="p-6 flex items-center justify-between h-20 shrink-0">
          {isSidebarOpen ? <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl truncate animate-in fade-in"><Activity className="w-8 h-8 flex-shrink-0" /><span>Hospital Asset</span></div> : <Activity className="w-8 h-8 text-blue-600 mx-auto" />}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block text-slate-400 hover:text-slate-600 transition-transform hover:scale-110">{isSidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><X size={20} /></button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "ภาพรวม (Dashboard)" : ""} id="dashboard" />
          <SidebarItem icon={Wrench} label={isSidebarOpen ? "แจ้งซ่อม (Maintenance)" : ""} id="maintenance" />
          <div className="pt-4 pb-2"><div className="h-px bg-slate-100 w-full"></div>{isSidebarOpen && <p className="text-xs font-bold text-slate-400 mt-4 mb-2 px-2">ASSET MANAGEMENT</p>}</div>
          <SidebarItem icon={Stethoscope} label={isSidebarOpen ? "ทะเบียนครุภัณฑ์" : ""} id="assets" />
          <SidebarItem icon={ArrowRightLeft} label={isSidebarOpen ? "ระบบยืม-คืน" : ""} id="loans" />
          <SidebarItem icon={Package} label={isSidebarOpen ? "คลังอะไหล่" : ""} id="parts" />
        </nav>
        <div className="p-4 border-t border-slate-100 shrink-0">
           {isSidebarOpen ? <div className="flex items-center space-x-3 overflow-hidden bg-slate-50 p-3 rounded-xl border border-slate-100"><div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0"><User className="w-5 h-5" /></div><div className="min-w-0"><p className="text-sm font-semibold text-slate-700 truncate">Admin User</p><p className="text-xs text-slate-500 truncate">Engineering Dept.</p></div></div> : <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto"><User className="w-5 h-5" /></div>}
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 h-16 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500 hover:text-slate-700"><Menu size={24} /></button>
             <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate">{activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'maintenance' ? 'Maintenance' : 'Assets Registry'}</h1>
           </div>
           <div className="flex items-center gap-4"><div className="relative hidden md:block"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" /><input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 w-64 text-sm" /></div><button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full"><Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span></button></div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'dashboard' && <DashboardView jobs={jobs} inventory={partsInventory} onNavigate={setActiveTab} />}
          {activeTab === 'maintenance' && <MaintenanceView jobs={jobs} inventory={partsInventory} onAddJob={handleAddJob} onUpdateJob={handleUpdateJob} onUsePart={handleUsePart} onShowToast={triggerToast} />}
          {(activeTab !== 'dashboard' && activeTab !== 'maintenance') && <div className="flex flex-col items-center justify-center h-full text-slate-400"><Package size={64} className="mb-4 opacity-20" /><p>หน้า "{activeTab}" ยังไม่เปิดใช้งานใน Demo นี้</p></div>}
        </div>
        
        {/* Render Toast Globally */}
        <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      </main>
    </div>
  );
}