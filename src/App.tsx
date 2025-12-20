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
  Save,
  QrCode,
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
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- DATA ---

const initialPartsInventory = [
  { id: 'P001', name: 'Battery 12V Li-ion', price: 2500, stock: 15 },
  { id: 'P002', name: 'Oxygen Sensor', price: 4500, stock: 4 },
  { id: 'P003', name: 'Power Cord (Medical Grade)', price: 850, stock: 20 },
  { id: 'P004', name: 'LCD Screen 7"', price: 3200, stock: 2 },
  { id: 'P005', name: 'Rubber Seal / O-Ring', price: 150, stock: 50 },
];

const initialJobs = [
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
    repairNote: '',
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
    repairNote: 'กำลังตรวจสอบวงจรภาคจ่ายไฟ',
  },
  {
    id: 'JOB-2512-003',
    assetId: 'EQ-ER-01',
    assetName: 'Defibrillator (เครื่องกระตุกหัวใจ)',
    location: 'ER ห้องฉุกเฉิน',
    issue: 'PM Check รอบ 6 เดือน',
    urgency: 'normal',
    status: 'waiting_parts',
    reporter: 'System Auto-Gen',
    date: '19/12/2025 08:00',
    type: 'PM',
    technician: 'วิศวกร วิชัย',
    partsUsed: [
      { id: 'P001', name: 'Battery 12V Li-ion', qty: 1, price: 2500 },
    ],
    repairNote: 'แบตเตอรี่เสื่อมตามอายุ รอของมาเปลี่ยน',
  },
];

const assetStatusData = [
  { name: 'พร้อมใช้งาน', value: 450, color: '#10B981' },
  { name: 'ถูกยืมใช้งาน', value: 120, color: '#3B82F6' },
  { name: 'ส่งซ่อม', value: 35, color: '#EF4444' },
  { name: 'จำหน่ายออก', value: 15, color: '#9CA3AF' },
];
const depreciationData = [
  { name: 'เครื่องช่วยหายใจ', cost: 1200000, current: 800000 },
  { name: 'เตียงผู้ป่วยไฟฟ้า', cost: 500000, current: 350000 },
  { name: 'เครื่อง X-Ray', cost: 3500000, current: 1200000 },
  { name: 'Monitor EKG', cost: 300000, current: 150000 },
];
const lowStockParts = [
  { id: 'P-101', name: 'Battery 12V Lead-Acid', qty: 2, min: 5, unit: 'ก้อน' },
  { id: 'P-205', name: 'O-Ring Seal Set A', qty: 0, min: 10, unit: 'ชุด' },
  { id: 'P-331', name: 'Filter Hepa', qty: 4, min: 10, unit: 'ชิ้น' },
];

// --- COMPONENTS HELPER ---

const UrgencyBadge = ({ level, detailed = false }) => {
  const configs = {
    high: {
      color: 'bg-red-100 text-red-700 border-red-200',
      text: 'ฉุกเฉิน',
      fullText: 'ฉุกเฉิน (Emergency)',
      icon: AlertTriangle,
    },
    medium: {
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      text: 'เร่งด่วน',
      fullText: 'เร่งด่วน (Urgent)',
      icon: Clock,
    },
    normal: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      text: 'ปกติ',
      fullText: 'ปกติ (Normal)',
      icon: CheckCircle2,
    },
  };
  const config = configs[level] || configs.normal;
  const Icon = config.icon;
  return (
    <span
      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.color} whitespace-nowrap`}
    >
      <Icon className="w-3 h-3" /> {detailed ? config.fullText : config.text}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    new: 'bg-blue-50 text-blue-600 border-blue-200',
    in_progress: 'bg-orange-50 text-orange-600 border-orange-200',
    waiting_parts: 'bg-purple-50 text-purple-600 border-purple-200',
    completed: 'bg-green-50 text-green-600 border-green-200',
  };
  const labels = {
    new: 'งานใหม่',
    in_progress: 'กำลังซ่อม',
    waiting_parts: 'รออะไหล่',
    completed: 'เสร็จสิ้น',
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-gray-100'
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between min-h-[120px] hover:shadow-md transition-shadow duration-300">
    <div className="flex-1 mr-2">
      <p className="text-slate-500 text-sm font-medium mb-2 truncate">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-slate-800 leading-none mb-2">
        {value}
      </h3>
      <p
        className={`text-xs ${
          subtext.includes('+') ? 'text-green-600' : 'text-slate-400'
        }`}
      >
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg flex-shrink-0 ${colorClass} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

// --- COMPONENT: LOGIN PAGE ---
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [text, setText] = useState('');
  const fullText = 'ระบบบริหารจัดการครุภัณฑ์ทางการเเพทย์';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Login Process
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLogin(); // Trigger Login Success
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 animate-in fade-in duration-500">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 opacity-90 z-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="relative z-20 text-white max-w-lg">
          <div className="mb-8 inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span className="text-sm font-medium tracking-wide">
              Secure Hospital Gateway
            </span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Hospital{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
              Asset
            </span>{' '}
            <br /> Management
          </h1>
          <p className="text-lg text-blue-100/90 leading-relaxed mb-8 h-8 font-light">
            {text}
            <span className="animate-pulse">|</span>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <Activity className="w-8 h-8 mb-3 text-blue-300" />
              <h3 className="font-bold text-lg">Real-time</h3>
              <p className="text-xs text-blue-200">
                ติดตามสถานะเครื่องมือแพทย์ได้ทันที
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <Stethoscope className="w-8 h-8 mb-3 text-emerald-300" />
              <h3 className="font-bold text-lg">Maintenance</h3>
              <p className="text-xs text-blue-200">
                แจ้งซ่อมและติดตามงานได้ง่ายดาย
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              ยินดีต้อนรับกลับ
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบจัดการครุภัณฑ์
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                รหัสพนักงาน / อีเมล
              </label>
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
                <label className="text-sm font-semibold text-slate-700">
                  รหัสผ่าน
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
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
                  เข้าสู่ระบบสำเร็จ <ShieldCheck className="h-5 w-5" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  เข้าสู่ระบบ <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-6 opacity-70">
            <p className="text-xs text-slate-500 text-center">
              พบปัญหาการใช้งาน? ติดต่อ{' '}
              <a
                href="#"
                className="text-blue-600 font-semibold hover:underline"
              >
                ศูนย์คอมพิวเตอร์ (1122)
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODAL: JOB DETAIL ---
const JobDetailModal = ({ job, onClose, onSave }) => {
  const [status, setStatus] = useState(job.status);
  const [repairNote, setRepairNote] = useState(job.repairNote || '');
  const [usedParts, setUsedParts] = useState(job.partsUsed || []);
  const [selectedPartId, setSelectedPartId] = useState('');

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const part = initialPartsInventory.find((p) => p.id === selectedPartId);
    const existing = usedParts.find((p) => p.id === part.id);
    if (existing) {
      setUsedParts(
        usedParts.map((p) => (p.id === part.id ? { ...p, qty: p.qty + 1 } : p))
      );
    } else {
      setUsedParts([...usedParts, { ...part, qty: 1 }]);
    }
  };

  const handleRemovePart = (id) => {
    setUsedParts(usedParts.filter((p) => p.id !== id));
  };

  const totalCost = usedParts.reduce((sum, p) => sum + p.price * p.qty, 0);

  const handleSave = (newStatus) => {
    onSave({
      ...job,
      status: newStatus,
      repairNote: repairNote,
      partsUsed: usedParts,
      technician:
        newStatus !== 'new' && !job.technician ? 'Admin User' : job.technician,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">{job.id}</h2>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold border ${
                  job.type === 'PM'
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}
              >
                {job.type}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              แจ้งเมื่อ: {job.date} | โดย: {job.reporter}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 border-r border-slate-100 p-6 overflow-y-auto bg-white">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Asset Info
                </label>
                <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {job.assetName}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {job.assetId}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" /> {job.location}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  อาการที่แจ้ง
                </label>
                <div className="mt-2 p-4 bg-red-50 rounded-xl border border-red-100 text-slate-700">
                  <p className="font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                    "{job.issue}"
                  </p>
                  <div className="mt-3">
                    <UrgencyBadge level={job.urgency} detailed />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-2/3 p-6 overflow-y-auto bg-slate-50/30 flex flex-col">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-blue-600" /> บันทึกการซ่อม
                </h3>
                <textarea
                  className="w-full h-24 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="ระบุสาเหตุที่พบ และวิธีการแก้ไข..."
                  value={repairNote}
                  onChange={(e) => setRepairNote(e.target.value)}
                  disabled={status === 'completed'}
                ></textarea>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-500" />{' '}
                    เบิกอะไหล่
                  </h3>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">รวมค่าใช้จ่าย</p>
                    <p className="font-bold text-blue-600 text-lg">
                      ฿{totalCost.toLocaleString()}
                    </p>
                  </div>
                </div>
                {status !== 'completed' && (
                  <div className="flex gap-2 mb-4">
                    <select
                      className="flex-1 p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                    >
                      <option value="">-- เลือกอะไหล่ --</option>
                      {initialPartsInventory.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name} (สต็อก: {part.stock}) - ฿
                          {part.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddPart}
                      disabled={!selectedPartId}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      + เพิ่ม
                    </button>
                  </div>
                )}
                {usedParts.length > 0 ? (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="p-2 pl-3">รายการ</th>
                          <th className="p-2 text-center">จำนวน</th>
                          <th className="p-2 text-right">ราคา</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {usedParts.map((part) => (
                          <tr
                            key={part.id}
                            className="border-t border-slate-50"
                          >
                            <td className="p-2 pl-3 font-medium text-slate-700">
                              {part.name}
                            </td>
                            <td className="p-2 text-center">{part.qty}</td>
                            <td className="p-2 text-right text-slate-500">
                              ฿{(part.price * part.qty).toLocaleString()}
                            </td>
                            <td className="p-2 text-center">
                              {status !== 'completed' && (
                                <button
                                  onClick={() => handleRemovePart(part.id)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg bg-slate-50">
                    ยังไม่มีการใช้อะไหล่
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 z-10">
          {status !== 'completed' ? (
            <>
              <button
                onClick={() => handleSave('waiting_parts')}
                className={`px-4 py-2 rounded-xl font-bold border flex items-center gap-2 transition-colors ${
                  status === 'waiting_parts'
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4" /> รออะไหล่
              </button>
              <button
                onClick={() => handleSave('in_progress')}
                className={`px-4 py-2 rounded-xl font-bold border flex items-center gap-2 transition-colors ${
                  status === 'in_progress'
                    ? 'bg-orange-100 border-orange-300 text-orange-700'
                    : 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Wrench className="w-4 h-4" /> กำลังซ่อม
              </button>
              <button
                onClick={() => handleSave('completed')}
                className="px-6 py-2 rounded-xl text-white font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> ปิดงานซ่อม
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl border border-green-200">
              <CheckCircle2 className="w-5 h-5" /> ปิดงานเรียบร้อยแล้ว{' '}
              <button
                onClick={onClose}
                className="ml-4 text-slate-500 hover:text-slate-700 text-sm underline"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: REPAIR REQUEST FORM (V1 DESIGN) ---
const RepairRequestForm = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    assetName: '',
    location: 'Auto: Ward 5',
    issue: '',
    urgency: 'normal',
  });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.assetName || !formData.issue)
      return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 mt-4 animate-in fade-in slide-in-from-bottom-4 overflow-y-auto max-h-[90vh]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          แบบฟอร์มแจ้งซ่อม (New Request)
        </h2>
        <p className="text-slate-500 mt-2">
          กรุณาระบุรายละเอียดให้ครบถ้วนเพื่อความรวดเร็วในการแก้ไข
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between group cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-700">
                Scan QR Code / Barcode
              </h4>
              <p className="text-xs text-slate-400">
                สแกนที่ตัวเครื่องเพื่อดึงข้อมูลอัตโนมัติ
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                รหัสครุภัณฑ์ / ชื่อเครื่อง
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="ค้นหาชื่อเครื่อง..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                สถานที่ (Location)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50"
                placeholder="ระบุตึก/ชั้น/ห้อง"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              อาการเสีย
            </label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
              placeholder="อธิบายอาการ..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              ความเร่งด่วน
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'normal',
                  label: 'ปกติ',
                  icon: CheckCircle2,
                  color:
                    'peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700',
                },
                {
                  id: 'medium',
                  label: 'เร่งด่วน',
                  icon: Clock,
                  color:
                    'peer-checked:bg-orange-50 peer-checked:border-orange-500 peer-checked:text-orange-700',
                },
                {
                  id: 'high',
                  label: 'ฉุกเฉิน',
                  icon: AlertTriangle,
                  color:
                    'peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700',
                },
              ].map((opt) => (
                <label key={opt.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value={opt.id}
                    checked={formData.urgency === opt.id}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div
                    className={`p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 transition-all ${opt.color}`}
                  >
                    <opt.icon className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <span className="text-sm font-bold">{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-6 flex gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              ส่งใบแจ้งซ่อม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- VIEW: DASHBOARD ---
const DashboardView = ({ jobs, onNavigate }) => (
  <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50/50 animate-in fade-in duration-300 h-full overflow-y-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="ครุภัณฑ์ทั้งหมด"
        value="620"
        subtext="มูลค่า 45.2 ลบ."
        icon={Stethoscope}
        colorClass="bg-blue-500 text-blue-500"
      />
      <StatCard
        title="ถูกยืมใช้งาน"
        value="120"
        subtext="+12% จากเดือนก่อน"
        icon={ArrowRightLeft}
        colorClass="bg-green-500 text-green-500"
      />
      <StatCard
        title="งานซ่อมคงค้าง"
        value={jobs.filter((j) => j.status !== 'completed').length}
        subtext="Real-time Update"
        icon={Wrench}
        colorClass="bg-orange-500 text-orange-500"
      />
      <StatCard
        title="อะไหล่ใกล้หมด"
        value="5"
        subtext="สั่งซื้อด่วน 2 รายการ"
        icon={AlertCircle}
        colorClass="bg-red-500 text-red-500"
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col h-80">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          สถานะครุภัณฑ์
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={assetStatusData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={4}
            >
              {assetStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col h-80">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          มูลค่าทางบัญชี
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={depreciationData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v / 1000}k`}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip formatter={(v) => `฿${v.toLocaleString()}`} />
            <Bar
              dataKey="cost"
              name="ราคาทุน"
              fill="#94a3b8"
              radius={[4, 4, 4, 4]}
              barSize={20}
            />
            <Bar
              dataKey="current"
              name="มูลค่าปัจจุบัน"
              fill="#3b82f6"
              radius={[4, 4, 4, 4]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/30">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" /> งานซ่อมล่าสุด
          </h3>
          <button
            onClick={() => onNavigate('maintenance')}
            className="text-xs text-blue-600 hover:underline"
          >
            ดูทั้งหมด
          </button>
        </div>
        <div className="p-4 space-y-3">
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 text-sm">
                    {job.assetName}
                  </h4>
                  <p className="text-xs text-slate-500">{job.issue}</p>
                </div>
              </div>
              <StatusBadge status={job.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" /> แจ้งเตือนอะไหล่
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {lowStockParts.map((part) => (
            <div
              key={part.id}
              className="p-3 bg-white border border-slate-100 rounded-xl"
            >
              <div className="flex justify-between mb-2">
                <span className="font-bold text-sm text-slate-700">
                  {part.name}
                </span>
                <span
                  className={`text-sm font-bold ${
                    part.qty === 0 ? 'text-red-600' : 'text-orange-500'
                  }`}
                >
                  {part.qty} {part.unit}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    part.qty === 0 ? 'bg-red-500' : 'bg-orange-400'
                  }`}
                  style={{ width: `${(part.qty / part.min) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- VIEW: MAINTENANCE SYSTEM ---
const MaintenanceView = ({ jobs, onUpdateJob, onAddJob }) => {
  const [activeView, setActiveView] = useState('board');
  const [selectedJob, setSelectedJob] = useState(null);

  const getJobsByStatus = (status) => jobs.filter((j) => j.status === status);

  const handleUpdateJob = (updatedJob) => {
    onUpdateJob(updatedJob);
    setSelectedJob(null);
  };

  const handleAddNewJob = (formData) => {
    const newJob = {
      id: `JOB-2512-${Math.floor(Math.random() * 900) + 100}`,
      assetId: 'N/A',
      assetName: formData.assetName,
      location: formData.location || '-',
      issue: formData.issue,
      urgency: formData.urgency,
      status: 'new',
      reporter: 'Admin User',
      date: new Date().toLocaleString('th-TH'),
      type: 'CM',
      technician: null,
      partsUsed: [],
      repairNote: '',
    };
    onAddJob(newJob);
    setActiveView('list');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {activeView !== 'form' && (
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 animate-in fade-in">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" /> ระบบแจ้งซ่อม
            (Maintenance)
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('list')}
              className={`p-2 rounded-md transition-all ${
                activeView === 'list'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-slate-500'
              }`}
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={() => setActiveView('board')}
              className={`p-2 rounded-md transition-all ${
                activeView === 'board'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-slate-500'
              }`}
            >
              <Layout size={18} />
            </button>
            <button
              onClick={() => setActiveView('form')}
              className="p-2 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {activeView === 'form' && (
          <RepairRequestForm
            onCancel={() => setActiveView('list')}
            onSubmit={handleAddNewJob}
          />
        )}

        {activeView === 'list' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Job ID</th>
                  <th className="px-6 py-4">อุปกรณ์</th>
                  <th className="px-6 py-4">อาการ</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-blue-600">
                      {job.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>{job.assetName}</div>
                      <div className="text-xs text-slate-400">
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{job.issue}</td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === 'board' && (
          <div className="flex h-full gap-4 overflow-x-auto pb-4 animate-in fade-in">
            {['new', 'in_progress', 'waiting_parts', 'completed'].map(
              (status) => (
                <div
                  key={status}
                  className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 max-h-full"
                >
                  <div className="p-3 font-bold text-slate-600 uppercase text-xs tracking-wider flex justify-between bg-white/50 rounded-t-xl border-b border-slate-100">
                    {status === 'new'
                      ? 'งานใหม่'
                      : status === 'in_progress'
                      ? 'กำลังดำเนินการ'
                      : status === 'waiting_parts'
                      ? 'รออะไหล่'
                      : 'เสร็จสิ้น'}
                    <span className="bg-white px-2 rounded-md shadow-sm text-slate-800 border border-slate-200">
                      {getJobsByStatus(status).length}
                    </span>
                  </div>
                  <div className="p-2 space-y-2 overflow-y-auto flex-1">
                    {getJobsByStatus(status).map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-bold bg-slate-50 px-1 rounded border text-slate-500">
                            {job.id}
                          </span>
                          <UrgencyBadge level={job.urgency} />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                          {job.assetName}
                        </h4>
                        <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                          {job.issue}
                        </p>
                        <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin size={10} /> {job.location}
                          </span>
                          <StatusBadge status={job.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={handleUpdateJob}
        />
      )}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState(initialJobs);

  const handleAddJob = (newJob) => {
    setJobs([newJob, ...jobs]);
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs(jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
  };

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <div
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap overflow-hidden ${
        activeTab === id
          ? 'bg-blue-50 text-blue-600 font-bold shadow-sm'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          activeTab === id ? 'text-blue-600' : 'text-slate-400'
        }`}
      />
      <span className="truncate">{label}</span>
    </div>
  );

  // LOGIC: ถ้ายังไม่ Login ให้โชว์หน้า Login
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // ถ้า Login แล้วให้โชว์หน้า App ปกติ
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20 h-full flex-shrink-0 shadow-lg shadow-slate-100`}
      >
        <div className="p-6 flex items-center justify-between h-20">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl truncate animate-in fade-in">
              <Activity className="w-8 h-8 flex-shrink-0" />
              <span>Hospital Asset</span>
            </div>
          ) : (
            <Activity className="w-8 h-8 text-blue-600 mx-auto" />
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block text-slate-400 hover:text-slate-600 transition-transform hover:scale-110"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <SidebarItem
            icon={LayoutDashboard}
            label={isSidebarOpen ? 'ภาพรวม (Dashboard)' : ''}
            id="dashboard"
          />
          <SidebarItem
            icon={Wrench}
            label={isSidebarOpen ? 'แจ้งซ่อม (Maintenance)' : ''}
            id="maintenance"
          />
          <div className="pt-4 pb-2">
            <div className="h-px bg-slate-100 w-full"></div>
            {isSidebarOpen && (
              <p className="text-xs font-bold text-slate-400 mt-4 mb-2 px-2">
                ASSET MANAGEMENT
              </p>
            )}
          </div>
          <SidebarItem
            icon={Stethoscope}
            label={isSidebarOpen ? 'ทะเบียนครุภัณฑ์' : ''}
            id="assets"
          />
          <SidebarItem
            icon={ArrowRightLeft}
            label={isSidebarOpen ? 'ระบบยืม-คืน' : ''}
            id="loans"
          />
          <SidebarItem
            icon={Package}
            label={isSidebarOpen ? 'คลังอะไหล่' : ''}
            id="parts"
          />
        </nav>
        <div className="p-4 border-t border-slate-100">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-3 overflow-hidden bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  Admin User
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Engineering Dept.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            {activeTab === 'dashboard'
              ? 'Dashboard Overview'
              : activeTab === 'maintenance'
              ? 'Maintenance Management'
              : 'Assets Registry'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'dashboard' && (
            <DashboardView jobs={jobs} onNavigate={setActiveTab} />
          )}
          {activeTab === 'maintenance' && (
            <MaintenanceView
              jobs={jobs}
              onAddJob={handleAddJob}
              onUpdateJob={handleUpdateJob}
            />
          )}
          {activeTab !== 'dashboard' && activeTab !== 'maintenance' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Package size={64} className="mb-4 opacity-20" />
              <p>หน้า "{activeTab}" ยังไม่เปิดใช้งานใน Demo นี้</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
