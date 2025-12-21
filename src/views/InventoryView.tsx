import { useState, useMemo } from 'react';
import { 
  Package, AlertTriangle, Search, TrendingUp, TrendingDown, 
  Plus, Edit2, Trash2, Download, Upload, Grid3x3, List,
  Filter, ArrowUpDown, ArrowUp, ArrowDown, X, Save,
  BarChart3, ShoppingCart, FileText, Eye
} from 'lucide-react';
import type { Part, InventoryAlert } from '../types';
import { StockStatusBadge } from '../components/StockStatusBadge';

interface InventoryViewProps {
  inventory: Part[];
}

type ViewMode = 'table' | 'grid';
type SortField = 'name' | 'stock' | 'price' | 'value' | 'status';
type SortDirection = 'asc' | 'desc';

interface PartFormData {
  id: string;
  name: string;
  price: number;
  stock: number;
  min: number;
  unit: string;
}

export function InventoryView({ inventory: initialInventory }: InventoryViewProps) {
  const [inventory, setInventory] = useState<Part[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'ok'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);
  const [stockNote, setStockNote] = useState('');
  const [formData, setFormData] = useState<PartFormData>({
    id: '',
    name: '',
    price: 0,
    stock: 0,
    min: 0,
    unit: 'ชิ้น'
  });

  // ฟังก์ชันจัดการอะไหล่
  const handleAddPart = () => {
    if (!formData.name || !formData.id) return;
    
    const newPart: Part = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      min: Number(formData.min)
    };
    
    setInventory([...inventory, newPart]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditPart = () => {
    if (!selectedPart) return;
    
    setInventory(inventory.map(part => 
      part.id === selectedPart.id ? { ...formData } : part
    ));
    setShowEditModal(false);
    setSelectedPart(null);
    resetForm();
  };

  const handleDeletePart = (partId: string) => {
    if (confirm('คุณต้องการลบอะไหล่นี้หรือไม่?')) {
      setInventory(inventory.filter(part => part.id !== partId));
    }
  };

  const handleStockAdjustment = () => {
    if (!selectedPart || stockAdjustment === 0) return;
    
    setInventory(inventory.map(part => 
      part.id === selectedPart.id 
        ? { ...part, stock: Math.max(0, part.stock + stockAdjustment) }
        : part
    ));
    setShowStockModal(false);
    setSelectedPart(null);
    setStockAdjustment(0);
    setStockNote('');
  };

  const handleExport = () => {
    const csv = [
      ['รหัส', 'ชื่ออะไหล่', 'ราคา', 'สต็อก', 'ขั้นต่ำ', 'หน่วย', 'มูลค่ารวม'],
      ...filteredAndSortedInventory.map(part => [
        part.id,
        part.name,
        part.price,
        part.stock,
        part.min,
        part.unit,
        part.price * part.stock
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: 0,
      stock: 0,
      min: 0,
      unit: 'ชิ้น'
    });
  };

  const openEditModal = (part: Part) => {
    setSelectedPart(part);
    setFormData({ ...part });
    setShowEditModal(true);
  };

  const openStockModal = (part: Part) => {
    setSelectedPart(part);
    setShowStockModal(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  // กรองและเรียงข้อมูล
  const filteredAndSortedInventory = useMemo(() => {
    let filtered = inventory.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filterStatus === 'all') return true;
      if (filterStatus === 'critical') return part.stock === 0;
      if (filterStatus === 'warning') return part.stock > 0 && part.stock < part.min;
      if (filterStatus === 'ok') return part.stock >= part.min;
      
      return true;
    });

    // เรียงลำดับ
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortField) {
        case 'name':
          compareValue = a.name.localeCompare(b.name, 'th');
          break;
        case 'stock':
          compareValue = a.stock - b.stock;
          break;
        case 'price':
          compareValue = a.price - b.price;
          break;
        case 'value':
          compareValue = (a.price * a.stock) - (b.price * b.stock);
          break;
        case 'status':
          const getStatusValue = (part: Part) => {
            if (part.stock === 0) return 0;
            if (part.stock < part.min) return 1;
            return 2;
          };
          compareValue = getStatusValue(a) - getStatusValue(b);
          break;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [inventory, searchTerm, filterStatus, sortField, sortDirection]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              คลังอะไหล่
            </h2>
            <p className="text-slate-600 text-sm mt-2 ml-1">ระบบจัดการและติดตามสต็อกอะไหล่อัจฉริยะ</p>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto flex-wrap">
            <div className="flex-1 min-w-[140px] bg-white px-4 py-3 rounded-xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-xs text-slate-500 mb-1 font-semibold">รายการทั้งหมด</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {inventory.length}
              </div>
            </div>
            <div className="flex-1 min-w-[140px] bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-3 rounded-xl border-2 border-orange-300 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-xs text-orange-700 mb-1 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                ต่ำกว่าเกณฑ์
              </div>
              <div className="text-2xl font-bold text-orange-700">{alertCounts.warning}</div>
            </div>
            <div className="flex-1 min-w-[140px] bg-gradient-to-br from-red-50 to-red-100 px-4 py-3 rounded-xl border-2 border-red-300 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-xs text-red-700 mb-1 flex items-center gap-1 font-semibold">
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

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่ออะไหล่หรือรหัส..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">ตาราง</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="hidden sm:inline">กริด</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 lg:flex-initial px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">เพิ่มอะไหล่</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
            {[
              { id: 'all', label: 'ทั้งหมด', icon: Package, color: 'blue' },
              { id: 'critical', label: 'หมดสต็อก', icon: TrendingDown, color: 'red' },
              { id: 'warning', label: 'ต่ำกว่าเกณฑ์', icon: AlertTriangle, color: 'orange' },
              { id: 'ok', label: 'ปกติ', icon: TrendingUp, color: 'green' }
            ].map(filter => {
              const Icon = filter.icon;
              const isActive = filterStatus === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    isActive
                      ? `bg-${filter.color}-600 text-white border-${filter.color}-600 shadow-md`
                      : `bg-white text-slate-600 border-slate-200 hover:border-${filter.color}-300`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                  {isActive && (
                    <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {filter.id === 'all' ? inventory.length : 
                       filter.id === 'critical' ? alertCounts.critical :
                       filter.id === 'warning' ? alertCounts.warning :
                       inventory.length - alertCounts.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inventory Display */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                      >
                        ชื่ออะไหล่
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider hover:text-blue-600 transition-colors mx-auto"
                      >
                        สถานะสต็อก
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSort('price')}
                        className="flex items-center justify-end gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider hover:text-blue-600 transition-colors ml-auto"
                      >
                        ราคา/หน่วย
                        {sortField === 'price' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSort('value')}
                        className="flex items-center justify-end gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider hover:text-blue-600 transition-colors ml-auto"
                      >
                        มูลค่ารวม
                        {sortField === 'value' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedInventory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <div className="text-lg font-semibold">ไม่พบข้อมูลอะไหล่</div>
                        <div className="text-sm mt-1">ลองค้นหาด้วยคำอื่นหรือเพิ่มอะไหล่ใหม่</div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedInventory.map((part, idx) => (
                      <tr 
                        key={part.id} 
                        className="hover:bg-blue-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                              {part.id.slice(-2)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{part.name}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span>รหัส: {part.id}</span>
                                <span>•</span>
                                <span>หน่วย: {part.unit}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-2">
                            <StockStatusBadge 
                              currentStock={part.stock} 
                              minStock={part.min} 
                              unit={part.unit}
                            />
                            <div className="text-xs text-slate-500">
                              ขั้นต่ำ: {part.min} {part.unit}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-slate-800 font-bold text-lg">
                            ฿{part.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            ต่อ {part.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-blue-600 font-bold text-xl">
                            ฿{(part.price * part.stock).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openStockModal(part)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                              title="ปรับสต็อก"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(part)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                              title="แก้ไข"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePart(part.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedInventory.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-16 text-center text-slate-500 shadow-lg border border-slate-200">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <div className="text-lg font-semibold">ไม่พบข้อมูลอะไหล่</div>
                <div className="text-sm mt-1">ลองค้นหาด้วยคำอื่นหรือเพิ่มอะไหล่ใหม่</div>
              </div>
            ) : (
              filteredAndSortedInventory.map((part) => (
                <div
                  key={part.id}
                  className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all border-2 border-slate-200 hover:border-blue-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {part.id.slice(-2)}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openStockModal(part)}
                        className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all opacity-0 group-hover:opacity-100"
                        title="ปรับสต็อก"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(part)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all opacity-0 group-hover:opacity-100"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePart(part.id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all opacity-0 group-hover:opacity-100"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="font-bold text-slate-800 text-lg mb-1">{part.name}</div>
                      <div className="text-xs text-slate-500">รหัส: {part.id}</div>
                    </div>

                    <div className="flex justify-center">
                      <StockStatusBadge 
                        currentStock={part.stock} 
                        minStock={part.min} 
                        unit={part.unit}
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">ราคา/หน่วย:</span>
                        <span className="font-bold text-slate-800">฿{part.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">มูลค่ารวม:</span>
                        <span className="font-bold text-blue-600 text-lg">
                          ฿{(part.price * part.stock).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">ขั้นต่ำ:</span>
                        <span className="text-slate-600">{part.min} {part.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Summary */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 shadow-xl border-2 border-blue-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-blue-100 font-semibold">มูลค่าสต็อกรวม</div>
              </div>
              <div className="text-3xl font-bold text-white">
                ฿{inventory.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-blue-100 font-semibold">จำนวนรายการอะไหล่</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {inventory.length} <span className="text-xl text-blue-200">รายการ</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-blue-100 font-semibold">ต้องเตรียมสั่งซื้อ</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {alertCounts.total} <span className="text-xl text-blue-200">รายการ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Part Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Plus className="w-7 h-7" />
                  เพิ่มอะไหล่ใหม่
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">รหัสอะไหล่</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="เช่น P013"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่ออะไหล่</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="เช่น ECG Cable"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ราคา (บาท)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">หน่วย</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ชิ้น"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">สต็อกเริ่มต้น</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">สต็อกขั้นต่ำ</label>
                    <input
                      type="number"
                      value={formData.min}
                      onChange={(e) => setFormData({ ...formData, min: Number(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAddPart}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  เพิ่มอะไหล่
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Part Modal */}
        {showEditModal && selectedPart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Edit2 className="w-7 h-7" />
                  แก้ไขข้อมูลอะไหล่
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">รหัสอะไหล่</label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-100 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่ออะไหล่</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ราคา (บาท)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">หน่วย</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">สต็อกปัจจุบัน</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">สต็อกขั้นต่ำ</label>
                    <input
                      type="number"
                      value={formData.min}
                      onChange={(e) => setFormData({ ...formData, min: Number(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => { setShowEditModal(false); setSelectedPart(null); resetForm(); }}
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleEditPart}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-md"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stock Adjustment Modal */}
        {showStockModal && selectedPart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Upload className="w-7 h-7" />
                  ปรับสต็อกอะไหล่
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-600 mb-1">อะไหล่</div>
                  <div className="font-bold text-lg text-slate-800">{selectedPart.name}</div>
                  <div className="text-sm text-slate-500 mt-1">รหัส: {selectedPart.id}</div>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">สต็อกปัจจุบัน:</span>
                      <span className="font-bold text-xl text-blue-600">
                        {selectedPart.stock} {selectedPart.unit}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ปรับจำนวน (+ เพิ่ม / - ลด)
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStockAdjustment(stockAdjustment - 1)}
                      className="w-12 h-12 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all text-xl"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={stockAdjustment}
                      onChange={(e) => setStockAdjustment(Number(e.target.value))}
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-bold"
                      placeholder="0"
                    />
                    <button
                      onClick={() => setStockAdjustment(stockAdjustment + 1)}
                      className="w-12 h-12 bg-green-100 text-green-600 rounded-xl font-bold hover:bg-green-200 transition-all text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">สต็อกหลังปรับ:</span>
                    <span className="font-bold text-2xl text-blue-600">
                      {Math.max(0, selectedPart.stock + stockAdjustment)} {selectedPart.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">หมายเหตุ (ถ้ามี)</label>
                  <textarea
                    value={stockNote}
                    onChange={(e) => setStockNote(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="เช่น รับอะไหล่จากคลัง, ใช้กับงาน JOB-XXX"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => { setShowStockModal(false); setSelectedPart(null); setStockAdjustment(0); setStockNote(''); }}
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleStockAdjustment}
                  disabled={stockAdjustment === 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  บันทึกการปรับสต็อก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
