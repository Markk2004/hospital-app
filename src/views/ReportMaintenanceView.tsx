import React, { useState } from 'react';
import { Search, Bell, Printer } from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  assetCode: string;
  assetName: string;
  department: string;
  issue: string;
  technician: string;
  startDate: string;
  endDate: string;
  cost: number;
  status: 'เสร็จสิ้น' | 'กำลังดำเนินการ' | 'รอดำเนินการ';
}

const MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: 'M001',
    assetCode: 'E-001',
    assetName: 'เครื่องวัดความดัน',
    department: 'ฉุกเฉิน',
    issue: 'เปลี่ยนสายยาง',
    technician: 'วิชัย ช่างซ่อม',
    startDate: '2025-06-15',
    endDate: '2025-06-16',
    cost: 2500,
    status: 'เสร็จสิ้น'
  },
  {
    id: 'M002',
    assetCode: 'E-003',
    assetName: 'เครื่องให้ออกซิเจน',
    department: 'ICU',
    issue: 'ซ่อมวาล์ว',
    technician: 'ประยุทธ์ ช่วยเหลือ',
    startDate: '2025-06-18',
    endDate: '2025-06-20',
    cost: 8500,
    status: 'เสร็จสิ้น'
  },
  {
    id: 'M003',
    assetCode: 'E-005',
    assetName: 'เครื่องวัดอุณหภูมิ',
    department: 'รังสีวิทยา',
    issue: 'เปลี่ยนแบตเตอรี่',
    technician: 'วิชัย ช่างซ่อม',
    startDate: '2025-06-22',
    endDate: '',
    cost: 1200,
    status: 'กำลังดำเนินการ'
  },
  {
    id: 'M004',
    assetCode: 'E-002',
    assetName: 'เตียงผู้ป่วย',
    department: 'ผู้ป่วยใน',
    issue: 'ซ่อมล้อ',
    technician: 'ประยุทธ์ ช่วยเหลือ',
    startDate: '2025-06-10',
    endDate: '2025-06-11',
    cost: 3200,
    status: 'เสร็จสิ้น'
  },
  {
    id: 'M005',
    assetCode: 'E-006',
    assetName: 'เครื่องช่วยหายใจ',
    department: 'ICU',
    issue: 'ตรวจเช็คระบบ',
    technician: 'วิชัย ช่างซ่อม',
    startDate: '2025-06-25',
    endDate: '',
    cost: 0,
    status: 'รอดำเนินการ'
  },
  {
    id: 'M006',
    assetCode: 'E-004',
    assetName: 'รถเข็นผู้ป่วย',
    department: 'ผู้ป่วยนอก',
    issue: 'เปลี่ยนเบรก',
    technician: 'ประยุทธ์ ช่วยเหลือ',
    startDate: '2025-06-12',
    endDate: '2025-06-13',
    cost: 1800,
    status: 'เสร็จสิ้น'
  }
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; text: string }> = {
    'เสร็จสิ้น': { bg: 'bg-green-100', text: 'text-green-700' },
    'กำลังดำเนินการ': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'รอดำเนินการ': { bg: 'bg-orange-100', text: 'text-orange-700' }
  };

  const style = config[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {status}
    </span>
  );
};

export const ReportMaintenanceView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredRecords = MAINTENANCE_RECORDS.filter(record => {
    const matchesSearch = record.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCost = filteredRecords.reduce((sum, r) => sum + r.cost, 0);
  const completedJobs = filteredRecords.filter(r => r.status === 'เสร็จสิ้น').length;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800">รายงานการซ่อมบำรุง</h1>
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up animation-delay-100">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">งานทั้งหมด</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">{filteredRecords.length}</h3>
              <p className="text-xs text-gray-400 mt-1">รายการ</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">เสร็จสิ้นแล้ว</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">{completedJobs}</h3>
              <p className="text-xs text-gray-400 mt-1">งานที่ปิดแล้ว</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">ค่าใช้จ่ายรวม</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-2">฿{totalCost.toLocaleString()}</h3>
              <p className="text-xs text-gray-400 mt-1">บาท</p>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ค้นหา</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหา..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">วันที่เริ่ม</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">วันที่สิ้นสุด</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">สถานะ</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                  <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                  <option value="รอดำเนินการ">รอดำเนินการ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">รายการซ่อมบำรุง</h2>
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
                    <th className="px-6 py-4">รหัสงาน</th>
                    <th className="px-6 py-4">ครุภัณฑ์</th>
                    <th className="px-6 py-4">แผนก</th>
                    <th className="px-6 py-4">ปัญหา</th>
                    <th className="px-6 py-4">ช่าง</th>
                    <th className="px-6 py-4">วันที่เริ่ม</th>
                    <th className="px-6 py-4">วันที่เสร็จ</th>
                    <th className="px-6 py-4 text-right">ค่าใช้จ่าย</th>
                    <th className="px-6 py-4">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-700">{record.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{record.assetName}</span>
                          <span className="text-xs text-gray-400">{record.assetCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.issue}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.technician}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.startDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.endDate || '-'}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-700">
                        {record.cost > 0 ? `฿${record.cost.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
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
