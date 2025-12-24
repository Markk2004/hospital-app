import React, { useState } from 'react';
import { Search, Bell, Printer, TrendingUp, TrendingDown, DollarSign, Wrench } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Mock Data
const maintenanceCostData = [
  { month: 'ม.ค.', cost: 45000 },
  { month: 'ก.พ.', cost: 52000 },
  { month: 'มี.ค.', cost: 48000 },
  { month: 'เม.ย.', cost: 61000 },
  { month: 'พ.ค.', cost: 55000 },
  { month: 'มิ.ย.', cost: 58000 }
];

const assetByDepartment = [
  { name: 'ฉุกเฉิน', value: 120, color: '#3b82f6' },
  { name: 'ICU', value: 85, color: '#8b5cf6' },
  { name: 'ผู้ป่วยใน', value: 150, color: '#ec4899' },
  { name: 'ผู้ป่วยนอก', value: 95, color: '#14b8a6' },
  { name: 'ห้องผ่าตัด', value: 110, color: '#f59e0b' }
];

const statusSummary = [
  { status: 'พร้อมใช้งาน', count: 420, color: '#10b981' },
  { status: 'กำลังใช้งาน', count: 140, color: '#3b82f6' },
  { status: 'ซ่อมบำรุง', count: 28, color: '#f59e0b' },
  { status: 'ชำรุด', count: 12, color: '#ef4444' }
];

export const ReportSummaryView: React.FC = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-06-30');

  const totalAssets = statusSummary.reduce((sum, item) => sum + item.count, 0);
  const totalMaintenance = maintenanceCostData.reduce((sum, item) => sum + item.cost, 0);
  const avgMonthlyCost = Math.round(totalMaintenance / maintenanceCostData.length);
  const maintenanceInProgress = statusSummary.find(s => s.status === 'ซ่อมบำรุง')?.count || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800">รายงานสรุปภาพรวม</h1>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-slate-200">
                <Search className="w-5 h-5 text-slate-400" />
                <input type="text" placeholder="ค้นหา..." className="outline-none text-sm w-32 lg:w-48" />
              </div>
              <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-100">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">วันที่เริ่มต้น</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">วันที่สิ้นสุด</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl font-semibold transition-all"
              >
                <Printer className="w-5 h-5" />
                พิมพ์รายงาน
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up animation-delay-200">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">ครุภัณฑ์ทั้งหมด</p>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600">{totalAssets}</h3>
              <p className="text-xs text-gray-400 mt-1">รายการ</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">ค่าซ่อมบำรุงรวม</p>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-green-600">฿{(totalMaintenance / 1000).toFixed(0)}K</h3>
              <p className="text-xs text-gray-400 mt-1">6 เดือนที่ผ่านมา</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">ค่าเฉลี่ย/เดือน</p>
                <TrendingDown className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600">฿{(avgMonthlyCost / 1000).toFixed(0)}K</h3>
              <p className="text-xs text-gray-400 mt-1">ประหยัด 5%</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">กำลังซ่อม</p>
                <Wrench className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold text-orange-600">{maintenanceInProgress}</h3>
              <p className="text-xs text-gray-400 mt-1">รายการ</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up animation-delay-300">
            {/* Maintenance Cost Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">ค่าซ่อมบำรุงรายเดือน</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maintenanceCostData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <RechartsTooltip />
                  <Bar dataKey="cost" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">สถานะครุภัณฑ์</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusSummary}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {statusSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset by Department */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up animation-delay-400">
            <h3 className="text-lg font-bold text-slate-800 mb-4">จำนวนครุภัณฑ์ตามแผนก</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assetByDepartment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                <RechartsTooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {assetByDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
