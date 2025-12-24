import React, { useState } from 'react';
import { Search, Bell, History, AlertCircle } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  image: string;
  remaining: number;
  category: string;
}

interface BorrowItem {
  assetId: string;
  name: string;
  quantity: number;
}

// Mock data - ในอนาคตจะดึงจาก API หรือ database
const mockAssets: Asset[] = [
  {
    id: 'AS-0001',
    name: 'เครื่องวัดความดัน',
    image: '/images/4.jpg',
    remaining: 100,
    category: 'medical'
  },
  {
    id: 'AS-0002',
    name: 'เครื่องวัดอุณหภูมิ',
    image: '/images/5.jpg',
    remaining: 85,
    category: 'medical'
  },
  {
    id: 'AS-0003',
    name: 'เครื่องวัดน้ำหนัก',
    image: '/images/6.jpg',
    remaining: 45,
    category: 'medical'
  },
  {
    id: 'AS-0004',
    name: 'เตียงผู้ป่วย',
    image: '/images/7.jpg',
    remaining: 120,
    category: 'furniture'
  },
  {
    id: 'AS-0005',
    name: 'รถเข็นผู้ป่วย',
    image: '/images/8.jpg',
    remaining: 30,
    category: 'furniture'
  },
  {
    id: 'AS-0006',
    name: 'เครื่องดูดเสมหะ',
    image: '/images/9.jpg',
    remaining: 55,
    category: 'medical'
  },
  {
    id: 'AS-0007',
    name: 'เครื่องให้ออกซิเจน',
    image: '/images/4.jpg',
    remaining: 75,
    category: 'lifesaving'
  },
  {
    id: 'AS-0008',
    name: 'เครื่องช่วยหายใจ',
    image: '/images/5.jpg',
    remaining: 25,
    category: 'lifesaving'
  }
];

export const AssetBorrowView: React.FC = () => {
  const [mode, setMode] = useState<'borrow' | 'return'>('borrow');
  const [searchQuery, setSearchQuery] = useState('');
  const [borrowQuantities, setBorrowQuantities] = useState<{ [key: string]: number }>({});
  const [borrowList, setBorrowList] = useState<BorrowItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const pendingReturn = 2; // Mock data - จำนวนค้างคืน

  const filteredAssets = mockAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuantityChange = (assetId: string, value: number) => {
    setBorrowQuantities(prev => ({
      ...prev,
      [assetId]: Math.max(1, Math.min(value, mockAssets.find(a => a.id === assetId)?.remaining || 1))
    }));
  };

  const handleAddToBorrowList = (asset: Asset) => {
    const quantity = borrowQuantities[asset.id] || 1;
    
    if (quantity > asset.remaining) {
      alert('จำนวนที่ยืมเกินจำนวนคงเหลือ');
      return;
    }

    const existingItem = borrowList.find(item => item.assetId === asset.id);
    
    if (existingItem) {
      setBorrowList(prev =>
        prev.map(item =>
          item.assetId === asset.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setBorrowList(prev => [
        ...prev,
        {
          assetId: asset.id,
          name: asset.name,
          quantity
        }
      ]);
    }

    alert(`เพิ่ม "${asset.name}" จำนวน ${quantity} ชิ้น เข้ารายการแล้ว`);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800">ระบบยืม - คืน</h1>
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
                {pendingReturn > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="glass-morphism glass-morphism-hover p-4 rounded-2xl animate-fade-in-up animation-delay-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาครุภัณฑ์"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                />
              </div>

              {/* Mode Toggles */}
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => setMode('borrow')}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    mode === 'borrow'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ยืม
                </button>
                <button
                  onClick={() => setMode('return')}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    mode === 'return'
                      ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg shadow-red-400/30'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  คืน
                </button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up animation-delay-200">
            <h2 className="text-xl font-bold text-slate-700">รายการครุภัณฑ์</h2>
            
            <div className="flex items-center gap-3">
              {/* Overdue Badge */}
              {pendingReturn > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-red-700">
                    จำนวนค้างคืน : {pendingReturn}
                  </span>
                </div>
              )}

              {/* History Button */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-colors"
              >
                <History className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">ประวัติการยืม</span>
              </button>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up animation-delay-300">
            {filteredAssets.map((asset, index) => (
              <div
                key={asset.id}
                className="glass-morphism glass-morphism-hover rounded-2xl overflow-hidden group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e2e8f0" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {/* Asset ID Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
                    <span className="text-xs font-bold text-slate-700">{asset.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-center text-lg">
                    {asset.name}
                  </h3>

                  {/* Remaining Info */}
                  <div className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">จำนวนคงเหลือ :</span>
                    <span className={`text-sm font-bold ${
                      asset.remaining < 30 ? 'text-red-600' : 
                      asset.remaining < 60 ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      {asset.remaining}
                    </span>
                  </div>

                  {/* Borrow Quantity Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      จำนวนการยืม :
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={asset.remaining}
                      value={borrowQuantities[asset.id] || 1}
                      onChange={(e) => handleQuantityChange(asset.id, parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center font-semibold"
                    />
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => handleAddToBorrowList(asset)}
                    disabled={asset.remaining === 0}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                      asset.remaining === 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-700 hover:shadow-md'
                    }`}
                  >
                    {asset.remaining === 0 ? 'ไม่มีสินค้า' : 'เพิ่มรายการ'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAssets.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 mb-2">ไม่พบครุภัณฑ์</h3>
              <p className="text-slate-500">ลองค้นหาด้วยคำค้นอื่น</p>
            </div>
          )}

          {/* History Modal Placeholder */}
          {showHistory && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">ประวัติการยืม</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span className="text-2xl text-slate-600">×</span>
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-center text-slate-500 py-8">
                    ฟีเจอร์นี้จะพัฒนาในเวอร์ชันถัดไป
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Spacing at bottom */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
