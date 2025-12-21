import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, ArrowRightLeft, Wrench, AlertCircle, Activity, 
  Clock, User, CheckCircle2 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import type { Job, Part } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

interface DashboardViewProps {
  jobs: Job[];
  inventory: Part[];
  onNavigate: (tab: string) => void;
}

const depreciationData = [
  { name: 'เครื่องช่วยหายใจ', cost: 1200000, current: 800000 },
  { name: 'เตียงผู้ป่วยไฟฟ้า', cost: 500000, current: 350000 },
  { name: 'เครื่อง X-Ray', cost: 3500000, current: 1200000 },
  { name: 'Monitor EKG', cost: 300000, current: 150000 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ jobs, inventory, onNavigate }) => {
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

          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {dynamicAssetStatusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>

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
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/30">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" /> งานซ่อมล่าสุด
            </h3>
            <button onClick={() => onNavigate('maintenance')} className="text-xs text-blue-600 hover:underline">
              ดูทั้งหมด
            </button>
          </div>
          <div className="p-4 space-y-3">
             {jobs.slice(0, 4).map((job) => (
               <div key={job.id} className="p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{job.id}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {job.date}</span>
                      </div>
                      <StatusBadge status={job.status} />
                  </div>
                  <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${job.urgency === 'high' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                          <Activity className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-700 text-sm truncate">{job.assetName}</h4>
                          <p className="text-xs text-slate-500 truncate"><span className="font-semibold text-slate-600">อาการ:</span> {job.issue}</p>
                          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><User size={10}/> แจ้งโดย: {job.reporter}</p>
                      </div>
                  </div>
               </div>
             ))}
             {jobs.length === 0 && <p className="text-center text-slate-400 py-4">ไม่มีงานซ่อมล่าสุด</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <AlertCircle className="w-5 h-5 text-red-600" /> แจ้งเตือนอะไหล่ (Low Stock)
             </h3>
           </div>
           <div className="p-4 space-y-4">
              {lowStockParts.length > 0 ? lowStockParts.map((part) => (
                <div key={part.id} className="p-3 bg-white border border-slate-100 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm text-slate-700">{part.name}</span>
                    <span className={`text-sm font-bold ${part.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                      {part.stock} {part.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${part.stock === 0 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${(part.stock/part.min)*100}%` }}></div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-green-500 py-6 flex flex-col items-center">
                  <CheckCircle2 className="mb-2"/> สต็อกอะไหล่ปกติทุกรายการ
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
