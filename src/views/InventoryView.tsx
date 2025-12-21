import { useState, useMemo } from 'react';
import { Package, AlertTriangle, Search, TrendingUp, TrendingDown } from 'lucide-react';
import type { Part, InventoryAlert } from '../types';
import { StockStatusBadge } from '../components/StockStatusBadge';

interface InventoryViewProps {
  inventory: Part[];
}

export function InventoryView({ inventory }: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'ok'>('all');

  // สร้าง alerts จากข้อมูล inventory
  const alerts: InventoryAlert[] = useMemo(() => {
    return inventory
      .map(part => {
        let status: 'out_of_stock' | 'low_stock' | 'adequate' | 'overstocked';
        let severity: 'critical' | 'warning' | 'info';

        if (part.stock === 0) {
          status = 'out_of_stock';
          severity = 'critical';
        } else if (part.stock < part.min) {
          status = 'low_stock';
          severity = 'warning';
        } else if (part.stock >= part.min && part.stock < part.min * 2) {
          status = 'adequate';
          severity = 'info';
        } else {
          status = 'overstocked';
          severity = 'info';
        }

        return {
          id: `alert-${part.id}`,
          partId: part.id,
          partName: part.name,
          currentStock: part.stock,
          minStock: part.min,
          status,
          severity
        };
      })
      .sort((a, b) => {
        // เรียงตาม severity (critical > warning > info)
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }, [inventory]);

  // นับจำนวน alerts แต่ละประเภท
  const alertCounts = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
      total: alerts.filter(a => a.severity !== 'info').length
    };
  }, [alerts]);

  // กรองข้อมูลตาม search และ filter
  const filteredInventory = useMemo(() => {
    return inventory.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filterStatus === 'all') return true;
      if (filterStatus === 'critical') return part.stock === 0;
      if (filterStatus === 'warning') return part.stock > 0 && part.stock < part.min;
      if (filterStatus === 'ok') return part.stock >= part.min;
      
      return true;
    });
  }, [inventory, searchTerm, filterStatus]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-7 h-7 text-blue-600" />
              คลังอะไหล่
            </h2>
            <p className="text-slate-500 text-sm mt-1">ระบบจัดการและติดตามสต็อกอะไหล่</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">รายการทั้งหมด</div>
              <div className="text-2xl font-bold text-slate-800">{inventory.length}</div>
            </div>
            <div className="flex-1 md:flex-initial bg-orange-50 px-4 py-3 rounded-xl border border-orange-200 shadow-sm">
              <div className="text-xs text-orange-600 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                ต่ำกว่าเกณฑ์
              </div>
              <div className="text-2xl font-bold text-orange-700">{alertCounts.warning}</div>
            </div>
            <div className="flex-1 md:flex-initial bg-red-50 px-4 py-3 rounded-xl border border-red-200 shadow-sm">
              <div className="text-xs text-red-600 mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                หมดสต็อก
              </div>
              <div className="text-2xl font-bold text-red-700">{alertCounts.critical}</div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {alertCounts.total > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  การแจ้งเตือนอะไหล่ ({alertCounts.total} รายการ)
                </h3>
                <div className="space-y-2">
                  {alerts
                    .filter(alert => alert.severity !== 'info')
                    .slice(0, 5)
                    .map(alert => (
                      <div 
                        key={alert.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          alert.severity === 'critical' 
                            ? 'bg-red-100 border border-red-200' 
                            : 'bg-orange-100 border border-orange-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {alert.severity === 'critical' ? '🚫' : '⚠️'}
                          </span>
                          <div>
                            <div className="font-semibold text-slate-800">
                              {alert.partName}
                            </div>
                            <div className="text-xs text-slate-600">
                              รหัส: {alert.partId}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            alert.severity === 'critical' ? 'text-red-700' : 'text-orange-700'
                          }`}>
                            {alert.currentStock === 0 ? 'หมดสต็อก' : `เหลือ ${alert.currentStock}`}
                          </div>
                          <div className="text-xs text-slate-600">
                            ต้องการขั้นต่ำ {alert.minStock}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {alertCounts.total > 5 && (
                  <div className="text-sm text-slate-600 mt-3 text-center">
                    และอีก {alertCounts.total - 5} รายการ...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่ออะไหล่หรือรหัส..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'ทั้งหมด', icon: Package },
              { id: 'critical', label: 'หมดสต็อก', icon: TrendingDown },
              { id: 'warning', label: 'ต่ำกว่าเกณฑ์', icon: AlertTriangle },
              { id: 'ok', label: 'ปกติ', icon: TrendingUp }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold transition-all ${
                  filterStatus === filter.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                <span className="hidden md:inline">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    รหัส / ชื่ออะไหล่
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    สถานะสต็อก
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                    ราคา/หน่วย
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                    มูลค่ารวม
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <div>ไม่พบข้อมูลอะไหล่</div>
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((part, idx) => (
                    <tr 
                      key={part.id} 
                      className={`hover:bg-slate-50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                            {part.id.slice(-2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{part.name}</div>
                            <div className="text-xs text-slate-500">รหัส: {part.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <StockStatusBadge 
                            currentStock={part.stock} 
                            minStock={part.min} 
                            unit={part.unit}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-slate-800 font-semibold">
                          ฿{part.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          ต่อ {part.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-slate-800 font-bold text-lg">
                          ฿{(part.price * part.stock).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-slate-600 mb-1">มูลค่าสต็อกรวม</div>
              <div className="text-3xl font-bold text-blue-600">
                ฿{inventory.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">จำนวนรายการอะไหล่</div>
              <div className="text-3xl font-bold text-slate-800">
                {inventory.length} รายการ
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">ต้องเตรียมสั่งซื้อ</div>
              <div className="text-3xl font-bold text-orange-600">
                {alertCounts.total} รายการ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
