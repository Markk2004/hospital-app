import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  ready: number;
  inUse: number;
  damaged: number;
  repair: number;
  total: number;
}

// Mock data
const mockAssets: Asset[] = [
  {
    id: 'A001',
    code: 'MED-001',
    name: 'เครื่องช่วยหายใจ Ventilator',
    category: 'เครื่องมือแพทย์',
    ready: 8,
    inUse: 12,
    damaged: 2,
    repair: 3,
    total: 25
  },
  {
    id: 'A002',
    code: 'BED-001',
    name: 'เตียงผู้ป่วยไฟฟ้า ICU',
    category: 'เฟอร์นิเจอร์การแพทย์',
    ready: 45,
    inUse: 30,
    damaged: 5,
    repair: 8,
    total: 88
  },
  {
    id: 'A003',
    code: 'XRAY-001',
    name: 'เครื่อง X-Ray Digital',
    category: 'เครื่องมือวินิจฉัย',
    ready: 3,
    inUse: 5,
    damaged: 1,
    repair: 2,
    total: 11
  },
  {
    id: 'A004',
    code: 'MON-001',
    name: 'Monitor ติดตามสัญญาณชีพ',
    category: 'เครื่องมือตรวจสอบ',
    ready: 25,
    inUse: 40,
    damaged: 8,
    repair: 5,
    total: 78
  },
  {
    id: 'A005',
    code: 'ULTRA-001',
    name: 'เครื่อง Ultrasound 4D',
    category: 'เครื่องมือวินิจฉัย',
    ready: 6,
    inUse: 8,
    damaged: 1,
    repair: 1,
    total: 16
  },
  {
    id: 'A006',
    code: 'DEFIB-001',
    name: 'เครื่อง Defibrillator',
    category: 'เครื่องมือช่วยชีวิต',
    ready: 15,
    inUse: 10,
    damaged: 3,
    repair: 2,
    total: 30
  },
  {
    id: 'A007',
    code: 'CHAIR-001',
    name: 'รถเข็นผู้ป่วย Wheelchair',
    category: 'เฟอร์นิเจอร์การแพทย์',
    ready: 60,
    inUse: 35,
    damaged: 12,
    repair: 8,
    total: 115
  },
  {
    id: 'A008',
    code: 'PUMP-001',
    name: 'Infusion Pump เครื่องควบคุมสารน้ำ',
    category: 'เครื่องมือแพทย์',
    ready: 50,
    inUse: 70,
    damaged: 10,
    repair: 15,
    total: 145
  }
];

const categories = [
  'ทั้งหมด',
  'เครื่องมือแพทย์',
  'เฟอร์นิเจอร์การแพทย์',
  'เครื่องมือวินิจฉัย',
  'เครื่องมือตรวจสอบ',
  'เครื่องมือช่วยชีวิต'
];

const StatusBadge = ({ count, type }: { count: number; type: 'ready' | 'inUse' | 'damaged' | 'repair' | 'total' }) => {
  const styles = {
    ready: 'bg-green-100 text-green-700 border-green-200',
    inUse: 'bg-amber-50 text-amber-700 border-amber-200',
    damaged: 'bg-red-100 text-red-700 border-red-200',
    repair: 'bg-orange-100 text-orange-700 border-orange-200',
    total: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold border ${styles[type]} min-w-[3rem]`}>
      {count}
    </span>
  );
};

export const AssetView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Filter Section */}
        <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อครุภัณฑ์หรือรหัส..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in-up animation-delay-100">
          <div className="glass-morphism glass-morphism-hover p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 mb-2 font-medium">พร้อมใช้งาน</div>
            <div className="text-3xl font-bold text-green-600">
              {filteredAssets.reduce((sum, asset) => sum + asset.ready, 0)}
            </div>
          </div>
          <div className="glass-morphism glass-morphism-hover p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 mb-2 font-medium">กำลังใช้งาน</div>
            <div className="text-3xl font-bold text-amber-600">
              {filteredAssets.reduce((sum, asset) => sum + asset.inUse, 0)}
            </div>
          </div>
          <div className="glass-morphism glass-morphism-hover p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 mb-2 font-medium">ชำรุด</div>
            <div className="text-3xl font-bold text-red-600">
              {filteredAssets.reduce((sum, asset) => sum + asset.damaged, 0)}
            </div>
          </div>
          <div className="glass-morphism glass-morphism-hover p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 mb-2 font-medium">ซ่อมแซม</div>
            <div className="text-3xl font-bold text-orange-600">
              {filteredAssets.reduce((sum, asset) => sum + asset.repair, 0)}
            </div>
          </div>
          <div className="glass-morphism glass-morphism-hover p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 mb-2 font-medium">รวมทั้งหมด</div>
            <div className="text-3xl font-bold text-blue-600">
              {filteredAssets.reduce((sum, asset) => sum + asset.total, 0)}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-morphism rounded-2xl overflow-hidden animate-fade-in-up animation-delay-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">
                    รหัส
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">
                    ชื่อครุภัณฑ์
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">
                    หมวดหมู่
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-green-700 uppercase tracking-wider">
                    พร้อมใช้งาน
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-amber-700 uppercase tracking-wider">
                    กำลังใช้งาน
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-red-700 uppercase tracking-wider">
                    ชำรุด
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-orange-700 uppercase tracking-wider">
                    ซ่อมแซม
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-blue-700 uppercase tracking-wider">
                    รวม
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-lg font-semibold">ไม่พบข้อมูลครุภัณฑ์</p>
                        <p className="text-sm">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนหมวดหมู่</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr 
                      key={asset.id} 
                      className="hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                            {asset.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {asset.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          {asset.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge count={asset.ready} type="ready" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge count={asset.inUse} type="inUse" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge count={asset.damaged} type="damaged" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge count={asset.repair} type="repair" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge count={asset.total} type="total" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-slate-500 animate-fade-in-up animation-delay-300">
          แสดง {filteredAssets.length} รายการ จากทั้งหมด {mockAssets.length} รายการ
        </div>
      </div>
    </div>
  );
};
