import React, { useState } from 'react';
import { Search, Bell, Printer, BarChart3, Table2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('');
  const [assetSearch, setAssetSearch] = useState('');

  const handleSearch = () => {
    console.log('Searching reports with:', { startDate, endDate, department, assetSearch });
    alert('กำลังค้นหารายงาน...');
  };

  const handlePrint = () => {
    alert('กำลังเตรียมพิมพ์รายงาน...');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800">รายงาน</h1>
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

          {/* Report Filters */}
          <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">ตัวกรองรายงาน</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* วันที่เริ่มต้น */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  วันที่เริ่มต้น
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700"
                />
              </div>

              {/* วันที่สิ้นสุด */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700"
                />
              </div>

              {/* แผนก */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  แผนก
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="emergency">ฉุกเฉิน</option>
                  <option value="icu">ICU</option>
                  <option value="surgery">ห้องผ่าตัด</option>
                  <option value="inpatient">ผู้ป่วยใน</option>
                  <option value="outpatient">ผู้ป่วยนอก</option>
                  <option value="radiology">รังสีวิทยา</option>
                </select>
              </div>

              {/* ครุภัณฑ์ */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ครุภัณฑ์
                </label>
                <input
                  type="text"
                  placeholder="ค้นหาครุภัณฑ์"
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/30"
              >
                <Search className="w-5 h-5" />
                ค้นหา
              </button>
              
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <Printer className="w-5 h-5" />
                พิมพ์รายงาน
              </button>
            </div>
          </div>

          {/* Chart Section */}
          <div className="glass-morphism glass-morphism-hover p-8 rounded-2xl animate-fade-in-up animation-delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Data Visualization</h2>
            </div>
            
            <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">กราฟแสดงผลจะปรากฏที่นี่</p>
                <p className="text-sm text-slate-400 mt-2">เช่น กราฟเส้น, กราฟแท่ง, หรือสถิติต่างๆ</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="glass-morphism glass-morphism-hover p-8 rounded-2xl animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <Table2 className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">TABLE</h2>
            </div>
            
            <div className="min-h-[300px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              <div className="text-center">
                <Table2 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">ตารางข้อมูลจะปรากฏที่นี่</p>
                <p className="text-sm text-slate-400 mt-2">แสดงรายละเอียดข้อมูลที่ถูกกรองตามเงื่อนไข</p>
              </div>
            </div>
          </div>

          {/* Spacing at bottom */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
