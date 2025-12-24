import React, { useState } from 'react';
import { Search, Bell, Printer, TrendingUp, Package, AlertTriangle } from 'lucide-react';

interface PartsUsage {
  id: string;
  partCode: string;
  partName: string;
  category: string;
  usedQty: number;
  remainingQty: number;
  unitPrice: number;
  totalCost: number;
  usedBy: string;
  department: string;
  date: string;
  status: 'ปกติ' | 'ต่ำกว่าเกณฑ์' | 'หมด';
}

const PARTS_USAGE: PartsUsage[] = [
  {
    id: 'PU001',
    partCode: 'P-101',
    partName: 'สายยาง',
    category: 'วัสดุทั่วไป',
    usedQty: 5,
    remainingQty: 45,
    unitPrice: 150,
    totalCost: 750,
    usedBy: 'วิชัย ช่างซ่อม',
    department: 'ฉุกเฉิน',
    date: '2025-06-15',
    status: 'ปกติ'
  },
  {
    id: 'PU002',
    partCode: 'P-205',
    partName: 'วาล์วออกซิเจน',
    category: 'ชิ้นส่วนเครื่องกล',
    usedQty: 2,
    remainingQty: 8,
    unitPrice: 2800,
    totalCost: 5600,
    usedBy: 'ประยุทธ์ ช่วยเหลือ',
    department: 'ICU',
    date: '2025-06-18',
    status: 'ต่ำกว่าเกณฑ์'
  },
  {
    id: 'PU003',
    partCode: 'P-089',
    partName: 'แบตเตอรี่ AAA',
    category: 'อิเล็กทรอนิกส์',
    usedQty: 4,
    remainingQty: 96,
    unitPrice: 25,
    totalCost: 100,
    usedBy: 'วิชัย ช่างซ่อม',
    department: 'รังสีวิทยา',
    date: '2025-06-22',
    status: 'ปกติ'
  },
  {
    id: 'PU004',
    partCode: 'P-112',
    partName: 'ล้อรถเข็น',
    category: 'ชิ้นส่วนเครื่องกล',
    usedQty: 4,
    remainingQty: 12,
    unitPrice: 350,
    totalCost: 1400,
    usedBy: 'ประยุทธ์ ช่วยเหลือ',
    department: 'ผู้ป่วยใน',
    date: '2025-06-10',
    status: 'ต่ำกว่าเกณฑ์'
  },
  {
    id: 'PU005',
    partCode: 'P-178',
    partName: 'ฟิลเตอร์อากาศ',
    category: 'วัสดุสิ้นเปลือง',
    usedQty: 6,
    remainingQty: 0,
    unitPrice: 450,
    totalCost: 2700,
    usedBy: 'วิชัย ช่างซ่อม',
    department: 'ICU',
    date: '2025-06-20',
    status: 'หมด'
  },
  {
    id: 'PU006',
    partCode: 'P-092',
    partName: 'ผ้าเบรก',
    category: 'ชิ้นส่วนเครื่องกล',
    usedQty: 2,
    remainingQty: 18,
    unitPrice: 280,
    totalCost: 560,
    usedBy: 'ประยุทธ์ ช่วยเหลือ',
    department: 'ผู้ป่วยนอก',
    date: '2025-06-12',
    status: 'ปกติ'
  },
  {
    id: 'PU007',
    partCode: 'P-145',
    partName: 'น็อตสกรู M6',
    category: 'วัสดุทั่วไป',
    usedQty: 20,
    remainingQty: 180,
    unitPrice: 5,
    totalCost: 100,
    usedBy: 'วิชัย ช่างซ่อม',
    department: 'ห้องผ่าตัด',
    date: '2025-06-14',
    status: 'ปกติ'
  }
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; text: string }> = {
    'ปกติ': { bg: 'bg-green-100', text: 'text-green-700' },
    'ต่ำกว่าเกณฑ์': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'หมด': { bg: 'bg-red-100', text: 'text-red-700' }
  };

  const style = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {status === 'หมด' && <AlertTriangle size={12} />}
      {status}
    </span>
  );
};

export const ReportPartsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredParts = PARTS_USAGE.filter(part => {
    const matchesSearch = part.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         part.partCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalUsage = filteredParts.reduce((sum, p) => sum + p.usedQty, 0);
  const totalCost = filteredParts.reduce((sum, p) => sum + p.totalCost, 0);
  const lowStockCount = filteredParts.filter(p => p.status === 'ต่ำกว่าเกณฑ์' || p.status === 'หมด').length;

  const categories = ['all', ...Array.from(new Set(PARTS_USAGE.map(p => p.category)))];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-green-50/20 to-slate-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800">รายงานการใช้อะไหล่</h1>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-slate-200">
                <Search className="w-5 h-5 text-slate-400" />
                <input type="text" placeholder="ค้นหา..." className="outline-none text-sm w-32 lg:w-48" />
              </div>
              <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
                {lowStockCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up animation-delay-100">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">จำนวนใช้ทั้งหมด</p>
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600">{totalUsage}</h3>
              <p className="text-xs text-gray-400 mt-1">ชิ้น</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">มูลค่ารวม</p>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-green-600">฿{totalCost.toLocaleString()}</h3>
              <p className="text-xs text-gray-400 mt-1">บาท</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">สต็อกต่ำ/หมด</p>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-red-600">{lowStockCount}</h3>
              <p className="text-xs text-gray-400 mt-1">รายการ</p>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ค้นหา</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อหรือรหัส..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">หมวดหมู่</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'ทั้งหมด' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">สถานะสต็อก</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="ปกติ">ปกติ</option>
                  <option value="ต่ำกว่าเกณฑ์">ต่ำกว่าเกณฑ์</option>
                  <option value="หมด">หมด</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">รายการใช้อะไหล่</h2>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <Printer size={16} /> พิมพ์รายงาน
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">รหัสอะไหล่</th>
                    <th className="px-6 py-4">ชื่ออะไหล่</th>
                    <th className="px-6 py-4">หมวดหมู่</th>
                    <th className="px-6 py-4 text-right">จำนวนใช้</th>
                    <th className="px-6 py-4 text-right">คงเหลือ</th>
                    <th className="px-6 py-4 text-right">ราคา/หน่วย</th>
                    <th className="px-6 py-4 text-right">มูลค่ารวม</th>
                    <th className="px-6 py-4">ผู้ใช้</th>
                    <th className="px-6 py-4">วันที่</th>
                    <th className="px-6 py-4">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-700">{part.partCode}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{part.partName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{part.category}</td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-600">{part.usedQty}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${
                          part.remainingQty === 0 ? 'text-red-600' :
                          part.remainingQty < 15 ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {part.remainingQty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600">฿{part.unitPrice}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-700">฿{part.totalCost.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{part.usedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{part.date}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={part.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredParts.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-600 mb-2">ไม่พบข้อมูล</h3>
                  <p className="text-slate-500">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
                </div>
              )}
            </div>
          </div>

          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
