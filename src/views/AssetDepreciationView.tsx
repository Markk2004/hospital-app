import React, { useState } from 'react';
import { Search, Bell, Plus, Filter, MoreVertical } from 'lucide-react';

interface DepreciationAsset {
  id: string;
  code: string;
  name: string;
  department: string;
  originalCost: number;
  accumulatedDepreciation: number;
  currentValue: number;
  usedLife: number; // เดือนที่ใช้ไปแล้ว
  totalLife: number; // อายุการใช้งานทั้งหมด (เดือน)
  status: 'Normal' | 'Warning' | 'Critical';
  prediction: string;
}

const ASSETS_DATA: DepreciationAsset[] = [
  {
    id: 'E-001',
    code: 'E-001',
    name: 'เครื่องวัดความดัน',
    department: 'ฉุกเฉิน',
    originalCost: 50000,
    accumulatedDepreciation: 25000,
    currentValue: 25000,
    usedLife: 24,
    totalLife: 48,
    status: 'Normal',
    prediction: 'คาดการณ์ใช้งานได้อีก 2 ปี'
  },
  {
    id: 'E-002',
    code: 'E-002',
    name: 'เตียงผู้ป่วย',
    department: 'ผู้ป่วยใน',
    originalCost: 80000,
    accumulatedDepreciation: 80000,
    currentValue: 0,
    usedLife: 60,
    totalLife: 60,
    status: 'Critical',
    prediction: 'ควรเปลี่ยนใหม่ทันที'
  },
  {
    id: 'E-003',
    code: 'E-003',
    name: 'เครื่องให้ออกซิเจน',
    department: 'ICU',
    originalCost: 120000,
    accumulatedDepreciation: 110000,
    currentValue: 10000,
    usedLife: 54,
    totalLife: 60,
    status: 'Warning',
    prediction: 'ควรเตรียมงบจัดซื้อ'
  },
  {
    id: 'E-004',
    code: 'E-004',
    name: 'รถเข็นผู้ป่วย',
    department: 'ผู้ป่วยนอก',
    originalCost: 35000,
    accumulatedDepreciation: 15000,
    currentValue: 20000,
    usedLife: 18,
    totalLife: 48,
    status: 'Normal',
    prediction: 'สภาพดี ใช้งานได้นาน'
  },
  {
    id: 'E-005',
    code: 'E-005',
    name: 'เครื่องวัดอุณหภูมิ',
    department: 'รังสีวิทยา',
    originalCost: 25000,
    accumulatedDepreciation: 20000,
    currentValue: 5000,
    usedLife: 32,
    totalLife: 40,
    status: 'Warning',
    prediction: 'เหลืออายุ 8 เดือน'
  },
  {
    id: 'E-006',
    code: 'E-006',
    name: 'เครื่องช่วยหายใจ',
    department: 'ICU',
    originalCost: 250000,
    accumulatedDepreciation: 62500,
    currentValue: 187500,
    usedLife: 15,
    totalLife: 60,
    status: 'Normal',
    prediction: 'ยังใหม่ ใช้งานได้ยาวนาน'
  }
];

const ProgressBar: React.FC<{ current: number; max: number; status: string }> = ({ current, max, status }) => {
  const percentage = (current / max) * 100;
  const remaining = max - current;
  
  const colorClass = 
    status === 'Critical' ? 'bg-red-500' :
    status === 'Warning' ? 'bg-orange-500' :
    'bg-green-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{current} / {max} เดือน</span>
        <span className="font-medium">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-400">เหลืออีก {remaining} เดือน</span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    Normal: { bg: 'bg-green-100', text: 'text-green-700', label: 'ปกติ' },
    Warning: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'เฝ้าระวัง' },
    Critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'เร่งด่วน' }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export const AssetDepreciationView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAssets = ASSETS_DATA.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate KPIs
  const totalValue = ASSETS_DATA.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDepreciation = ASSETS_DATA.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0);
  const urgentMaintenance = ASSETS_DATA.filter(a => a.status === 'Critical').length;
  const expiringThisYear = ASSETS_DATA.filter(a => a.status === 'Warning' || a.status === 'Critical').length;
  const depreciationPercentage = ((totalDepreciation / (totalValue + totalDepreciation)) * 100).toFixed(0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `฿${(value / 1000000).toFixed(1)}M`;
    }
    return `฿${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800">ค่าเสื่อมราคา</h1>
            <div className="flex items-center gap-4">
              {/* Global Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-slate-200">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="outline-none text-sm w-32 lg:w-48"
                />
              </div>
              
              {/* Notification Bell */}
              <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up animation-delay-100">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-sm font-medium">มูลค่าทรัพย์สินรวม</p>
              <h3 className="text-2xl font-bold mt-2 text-blue-600">{formatCurrency(totalValue)}</h3>
              <p className="text-xs text-gray-400 mt-1">+2% จากเดือนก่อน</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-sm font-medium">ค่าเสื่อมราคาสะสม</p>
              <h3 className="text-2xl font-bold mt-2 text-indigo-600">{formatCurrency(totalDepreciation)}</h3>
              <p className="text-xs text-gray-400 mt-1">คิดเป็น {depreciationPercentage}% ของทั้งหมด</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-sm font-medium">ต้องซ่อมบำรุง</p>
              <h3 className="text-2xl font-bold mt-2 text-orange-600">{urgentMaintenance}</h3>
              <p className="text-xs text-gray-400 mt-1">รายการเร่งด่วน</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-sm font-medium">ครบกำหนดอายุปีนี้</p>
              <h3 className="text-2xl font-bold mt-2 text-red-600">{expiringThisYear}</h3>
              <p className="text-xs text-gray-400 mt-1">เตรียมงบจัดซื้อ</p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-200">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* ค้นหา */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ค้นหา
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ, รหัส, หรือแผนก"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-slate-700"
                  />
                </div>
              </div>

              {/* สถานะ */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  สถานะ
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-slate-700"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="Normal">ปกติ</option>
                  <option value="Warning">เฝ้าระวัง</option>
                  <option value="Critical">เร่งด่วน</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-300">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">รายการทรัพย์สินและค่าเสื่อมราคา</h2>
                <p className="text-sm text-gray-500">จัดการข้อมูลอายุการใช้งานและสถานะครุภัณฑ์</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Filter size={16} /> กรองข้อมูล
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm shadow-md shadow-purple-200">
                  <Plus size={16} /> เพิ่มรายการ
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">รหัส / ชื่อครุภัณฑ์</th>
                    <th className="px-6 py-4">แผนก</th>
                    <th className="px-6 py-4">มูลค่าปัจจุบัน</th>
                    <th className="px-6 py-4 w-48">อายุการใช้งาน</th>
                    <th className="px-6 py-4">AI Prediction</th>
                    <th className="px-6 py-4">สถานะ</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAssets.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{item.name}</span>
                          <span className="text-xs text-gray-400 font-mono">{item.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.department}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        ฿{item.currentValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <ProgressBar current={item.usedLife} max={item.totalLife} status={item.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${item.status === 'Critical' ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                          ✨ {item.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-purple-600 p-2 rounded-full hover:bg-purple-50">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAssets.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                    <Search className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-600 mb-2">ไม่พบข้อมูล</h3>
                  <p className="text-slate-500">ลองค้นหาด้วยเงื่อนไขอื่น</p>
                </div>
              )}
            </div>
          </div>

          {/* Spacing at bottom */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
