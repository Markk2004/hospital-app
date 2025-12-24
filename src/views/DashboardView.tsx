import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, ArrowRightLeft, Wrench, AlertCircle, Activity, 
  Clock, User, CheckCircle2, Package, AlertTriangle, TrendingDown, 
  ChevronRight, ShoppingCart, TrendingUp, DollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import type { Job, Part } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { StockStatusBadge } from '../components/StockStatusBadge';

interface DashboardViewProps {
  jobs: Job[];
  inventory: Part[];
  onNavigate: (tab: string) => void;
}

const depreciationData = [
  { name: 'เครื่องช่วยหายใจ', cost: 1200000, current: 800000, depreciation: 400000 },
  { name: 'เตียงผู้ป่วยไฟฟ้า', cost: 500000, current: 350000, depreciation: 150000 },
  { name: 'เครื่อง X-Ray', cost: 3500000, current: 1200000, depreciation: 2300000 },
  { name: 'Monitor EKG', cost: 300000, current: 150000, depreciation: 150000 },
];

// Custom Tooltip สำหรับ Pie Chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-200">
        <p className="font-bold text-slate-800 mb-1">{payload[0].name}</p>
        <p className="text-2xl font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].value} เครื่อง
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% ของทั้งหมด
        </p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip สำหรับ Bar Chart
const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-200">
        <p className="font-bold text-slate-800 mb-2">{payload[0].payload.name}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-600">ราคาทุน:</span>
            <span className="font-bold text-slate-700">฿{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-600">มูลค่าปัจจุบัน:</span>
            <span className="font-bold text-blue-600">฿{payload[1].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-600">ค่าเสื่อมราคา:</span>
            <span className="font-bold text-red-600">฿{(payload[0].value - payload[1].value).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardView: React.FC<DashboardViewProps> = ({ jobs, inventory, onNavigate }) => {
  const inRepairCount = jobs.filter(j => j.status !== 'completed').length;
  const totalAssets = 620;
  const borrowed = 120;
  const disposed = 15;
  const ready = totalAssets - inRepairCount - borrowed - disposed;

  const dynamicAssetStatusData = [
    { name: 'พร้อมใช้งาน', value: ready, color: '#10B981', total: totalAssets },
    { name: 'ถูกยืมใช้งาน', value: borrowed, color: '#3B82F6', total: totalAssets },
    { name: 'ส่งซ่อม', value: inRepairCount, color: '#EF4444', total: totalAssets },
    { name: 'จำหน่ายออก', value: disposed, color: '#9CA3AF', total: totalAssets },
  ];

  // จัดกลุ่มอะไหล่ตามสถานะ
  const outOfStockParts = inventory.filter(p => p.stock === 0);
  const lowStockParts = inventory.filter(p => p.stock > 0 && p.stock < p.min);
  const criticalParts = [...outOfStockParts, ...lowStockParts].slice(0, 6);
  const totalAlerts = outOfStockParts.length + lowStockParts.length;

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const chartHeight = isMobile ? 240 : 300;

  return (
    <div className="p-3 md:p-4 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8 bg-slate-50/50 animate-in fade-in duration-300 h-full overflow-y-auto overscroll-contain">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <StatCard title="ครุภัณฑ์ทั้งหมด" value={totalAssets.toString()} subtext="มูลค่า 45.2 ลบ." icon={Stethoscope} colorClass="bg-blue-500 text-blue-500" />
        <StatCard title="ถูกยืมใช้งาน" value={borrowed.toString()} subtext="+12% จากเดือนก่อน" icon={ArrowRightLeft} colorClass="bg-green-500 text-green-500" />
        <StatCard title="งานซ่อมคงค้าง" value={inRepairCount} subtext="Real-time Update" icon={Wrench} colorClass="bg-orange-500 text-orange-500" />
        <StatCard 
          title="อะไหล่ใกล้หมด" 
          value={totalAlerts} 
          subtext={`หมดสต็อก ${outOfStockParts.length} | ต่ำ ${lowStockParts.length}`} 
          icon={AlertCircle} 
          colorClass="bg-red-500 text-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">{/* Pie Chart - Donut Style */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-4 md:p-6 rounded-2xl shadow-lg border border-slate-200 lg:col-span-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1">สถานะครุภัณฑ์</h3>
              <p className="text-xs text-slate-500">อัพเดทแบบ Real-time</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 relative" style={{ minHeight: chartHeight }}>
             <ResponsiveContainer width="100%" height={chartHeight}>
               <PieChart>
                 <defs>
                   {dynamicAssetStatusData.map((entry, index) => (
                     <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                       <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                     </linearGradient>
                   ))}
                 </defs>
                 <Pie 
                   data={dynamicAssetStatusData} 
                   cx="50%" 
                   cy="50%" 
                   innerRadius={isMobile ? 55 : 70}
                   outerRadius={isMobile ? 75 : 95}
                   paddingAngle={3}
                   dataKey="value" 
                   cornerRadius={6}
                   onMouseEnter={(_, index) => setActiveIndex(index)}
                   onMouseLeave={() => setActiveIndex(null)}
                 >
                    {dynamicAssetStatusData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient-${index})`}
                        stroke={activeIndex === index ? '#fff' : 'none'}
                        strokeWidth={activeIndex === index ? 3 : 0}
                        style={{
                          filter: activeIndex === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                          transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                 </Pie>
                 <RechartsTooltip content={<CustomPieTooltip />} />
               </PieChart>
             </ResponsiveContainer>
             
             {/* Center Text */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                 <div className="text-4xl font-bold text-slate-800">{totalAssets}</div>
                 <div className="text-xs text-slate-500 mt-1">เครื่อง</div>
               </div>
             </div>
          </div>

          {/* Legend with Stats */}
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-200">
             <div className="grid grid-cols-2 gap-2 md:gap-3">
                {dynamicAssetStatusData.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-white border border-slate-100 hover:shadow-md transition-all cursor-pointer touch-manipulation active:scale-95"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                       <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                          <div 
                            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" 
                            style={{
                              backgroundColor: item.color,
                              boxShadow: activeIndex === idx ? `0 0 8px ${item.color}` : 'none'
                            }}
                          ></div>
                          <span className="text-[11px] md:text-xs text-slate-600 truncate">{item.name}</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-sm md:text-base font-bold text-slate-800">{item.value}</span>
                         <span className="text-[9px] md:text-[10px] text-slate-400">
                           {((item.value / totalAssets) * 100).toFixed(0)}%
                         </span>
                       </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
        
        {/* Bar Chart with Gradient */}
        <div className="bg-gradient-to-br from-white to-indigo-50/30 p-4 md:p-6 rounded-2xl shadow-lg border border-slate-200 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1">มูลค่าทางบัญชี</h3>
              <p className="text-xs text-slate-500">เปรียบเทียบราคาทุนและมูลค่าปัจจุบัน</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="bg-white p-2 md:p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">ราคาทุนรวม</div>
              <div className="text-base md:text-xl font-bold text-slate-700">
                ฿{(depreciationData.reduce((sum, d) => sum + d.cost, 0) / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-white p-2 md:p-3 rounded-xl border border-blue-100 shadow-sm">
              <div className="text-[10px] md:text-xs text-blue-600 mb-0.5 md:mb-1 flex items-center gap-0.5 md:gap-1">
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span className="truncate">มูลค่าปัจจุบัน</span>
              </div>
              <div className="text-base md:text-xl font-bold text-blue-600">
                ฿{(depreciationData.reduce((sum, d) => sum + d.current, 0) / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-white p-2 md:p-3 rounded-xl border border-red-100 shadow-sm">
              <div className="text-[10px] md:text-xs text-red-600 mb-0.5 md:mb-1 flex items-center gap-0.5 md:gap-1">
                <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span className="truncate">ค่าเสื่อม</span>
              </div>
              <div className="text-base md:text-xl font-bold text-red-600">
                ฿{(depreciationData.reduce((sum, d) => sum + (d.cost - d.current), 0) / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={chartHeight - 80}>
            <BarChart data={depreciationData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                tick={{fontSize: 11, fill: '#64748b'}} 
                axisLine={false} 
                tickLine={false}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(v: any) => `${v/1000000}M`}
                tick={{fontSize: 11, fill: '#64748b'}}
                axisLine={false} 
                tickLine={false}
              />
              <RechartsTooltip content={<CustomBarTooltip />} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} />
              <Bar 
                dataKey="cost" 
                name="ราคาทุน" 
                fill="url(#costGradient)" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={35}
              />
              <Bar 
                dataKey="current" 
                name="มูลค่าปัจจุบัน" 
                fill="url(#currentGradient)" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={35}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-b from-slate-300 to-slate-500"></div>
              <span className="text-xs text-slate-600">ราคาทุน</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-b from-blue-400 to-blue-600"></div>
              <span className="text-xs text-slate-600">มูลค่าปัจจุบัน</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-4 md:pb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
          <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/30">
            <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /> 
              <span>งานซ่อมล่าสุด</span>
            </h3>
            <button 
              onClick={() => onNavigate('maintenance-list')} 
              className="text-xs text-blue-600 hover:underline touch-manipulation active:scale-95 px-2 py-1"
            >
              ดูทั้งหมด
            </button>
          </div>
          <div className="p-3 md:p-4 space-y-2 md:space-y-3 overflow-y-auto">
             {jobs.slice(0, 4).map((job) => (
               <div key={job.id} className="p-2.5 md:p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group touch-manipulation active:scale-98">
                  <div className="flex justify-between items-start mb-1.5 md:mb-2">
                      <div className="flex items-center gap-1.5 md:gap-2">
                          <span className="text-[9px] md:text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{job.id}</span>
                          <span className="text-[9px] md:text-[10px] text-slate-400 flex items-center gap-0.5 md:gap-1"><Clock size={9} className="md:w-2.5 md:h-2.5"/> {job.date}</span>
                      </div>
                      <StatusBadge status={job.status} />
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${job.urgency === 'high' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                          <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-700 text-xs md:text-sm truncate">{job.assetName}</h4>
                          <p className="text-[11px] md:text-xs text-slate-500 truncate"><span className="font-semibold text-slate-600">อาการ:</span> {job.issue}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 mt-0.5 md:mt-1 flex items-center gap-0.5 md:gap-1"><User size={9} className="md:w-2.5 md:h-2.5"/> แจ้งโดย: {job.reporter}</p>
                      </div>
                  </div>
               </div>
             ))}
             {jobs.length === 0 && <p className="text-center text-slate-400 py-4 text-sm">ไม่มีงานซ่อมล่าสุด</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
           <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-orange-50">
             <div className="flex items-center gap-2">
               <div className="p-1.5 md:p-2 bg-red-100 rounded-lg">
                 <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
               </div>
               <div>
                 <h3 className="text-base md:text-lg font-bold text-slate-800">แจ้งเตือนอะไหล่</h3>
                 <p className="text-[10px] md:text-xs text-slate-500">ต้องดำเนินการ {totalAlerts} รายการ</p>
               </div>
             </div>
             <button 
               onClick={() => onNavigate('parts-inventory')}
               className="flex items-center gap-0.5 md:gap-1 text-[11px] md:text-xs bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm touch-manipulation active:scale-95"
             >
               <span>ดูทั้งหมด</span>
               <ChevronRight size={12} className="md:w-3.5 md:h-3.5" />
             </button>
           </div>
           
           {totalAlerts > 0 ? (
             <div className="flex-1 overflow-y-auto overscroll-contain">
               {/* สรุปสถานะ */}
               <div className="p-3 md:p-4 bg-slate-50 border-b border-slate-100">
                 <div className="grid grid-cols-2 gap-2 md:gap-3">
                   <div className="bg-white p-2 md:p-3 rounded-lg border border-red-200 shadow-sm">
                     <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                       <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                       <span className="text-[10px] md:text-xs font-semibold text-red-600">หมดสต็อก</span>
                     </div>
                     <div className="text-xl md:text-2xl font-bold text-red-700">{outOfStockParts.length}</div>
                     <div className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 md:mt-1">ต้องสั่งซื้อด่วน</div>
                   </div>
                   <div className="bg-white p-2 md:p-3 rounded-lg border border-orange-200 shadow-sm">
                     <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                       <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                       <span className="text-[10px] md:text-xs font-semibold text-orange-600">ต่ำกว่าเกณฑ์</span>
                     </div>
                     <div className="text-xl md:text-2xl font-bold text-orange-700">{lowStockParts.length}</div>
                     <div className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 md:mt-1">เตรียมสั่งซื้อ</div>
                   </div>
                 </div>
               </div>

               {/* รายการอะไหล่ */}
               <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                 {criticalParts.map((part) => {
                   const isOutOfStock = part.stock === 0;
                   const stockPercentage = Math.min((part.stock / part.min) * 100, 100);
                   
                   return (
                     <div 
                       key={part.id} 
                       className={`p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${
                         isOutOfStock 
                           ? 'bg-red-50 border-red-200 hover:border-red-300' 
                           : 'bg-orange-50 border-orange-200 hover:border-orange-300'
                       }`}
                       onClick={() => onNavigate('parts-inventory')}
                     >
                       <div className="flex items-start justify-between mb-3">
                         <div className="flex items-start gap-3 flex-1 min-w-0">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                             isOutOfStock ? 'bg-red-200' : 'bg-orange-200'
                           }`}>
                             <Package className={`w-5 h-5 ${isOutOfStock ? 'text-red-700' : 'text-orange-700'}`} />
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{part.name}</h4>
                             <div className="flex items-center gap-2 mb-2">
                               <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                 {part.id}
                               </span>
                               <span className="text-[10px] text-slate-500">
                                 ราคา ฿{part.price.toLocaleString()}/{part.unit}
                               </span>
                             </div>
                           </div>
                         </div>
                         <StockStatusBadge 
                           currentStock={part.stock} 
                           minStock={part.min} 
                           unit={part.unit}
                         />
                       </div>

                       {/* Progress Bar */}
                       <div className="mb-3">
                         <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-600">
                             ปัจจุบัน: <span className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-orange-600'}`}>
                               {part.stock} {part.unit}
                             </span>
                           </span>
                           <span className="text-slate-500">
                             ขั้นต่ำ: {part.min} {part.unit}
                           </span>
                         </div>
                         <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                           <div 
                             className={`h-2 rounded-full transition-all ${
                               isOutOfStock ? 'bg-red-500' : 'bg-orange-400'
                             }`} 
                             style={{ width: `${stockPercentage}%` }}
                           ></div>
                         </div>
                       </div>

                       {/* Action Button */}
                       <button 
                         className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                           isOutOfStock
                             ? 'bg-red-600 text-white hover:bg-red-700'
                             : 'bg-orange-600 text-white hover:bg-orange-700'
                         }`}
                         onClick={(e) => {
                           e.stopPropagation();
                           onNavigate('parts-inventory');
                         }}
                       >
                         <ShoppingCart className="w-4 h-4" />
                         {isOutOfStock ? 'สั่งซื้อด่วน' : 'เตรียมสั่งซื้อ'}
                       </button>
                     </div>
                   );
                 })}

                 {totalAlerts > 6 && (
                   <button 
                     onClick={() => onNavigate('parts-inventory')}
                     className="w-full p-3 text-center text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 font-semibold transition-colors"
                   >
                     ดูอีก {totalAlerts - 6} รายการ →
                   </button>
                 )}
               </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 className="w-8 h-8 text-green-600" />
               </div>
               <h4 className="text-lg font-bold text-slate-800 mb-2">สต็อกอะไหล่เพียงพอ</h4>
               <p className="text-sm text-slate-500">ไม่มีอะไหล่ที่ต้องแจ้งเตือนในขณะนี้</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
