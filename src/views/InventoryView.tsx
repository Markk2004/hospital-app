import { useState, useMemo } from 'react';
import { 
  Package, AlertTriangle, Search, TrendingUp, TrendingDown, 
  Plus, Edit2, Trash2, Download, Upload, Grid3x3, List,
  ArrowUp, ArrowDown, X,
  BarChart3, ShoppingCart, FileText, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, XCircle, Truck, Calendar, User
} from 'lucide-react';
import type { Part, InventoryAlert, PurchaseOrder } from '../types';
import { StockStatusBadge } from '../components/StockStatusBadge';

interface InventoryViewProps {
  inventory: Part[];
  onUpdateInventory?: (inventory: Part[]) => void;
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

export function InventoryView({ inventory: initialInventory, onUpdateInventory }: InventoryViewProps) {
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Purchase Order States
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showOrdersListModal, setShowOrdersListModal] = useState(false);
  const [showReceiveConfirmModal, setShowReceiveConfirmModal] = useState(false);
  const [selectedOrderForReceive, setSelectedOrderForReceive] = useState<PurchaseOrder | null>(null);
  const [selectedPartForOrder, setSelectedPartForOrder] = useState<Part | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(0);
  const [orderNote, setOrderNote] = useState('');
  const [damagedQuantity, setDamagedQuantity] = useState<number>(0);
  const [receiveNote, setReceiveNote] = useState('');

  // ฟังก์ชันจัดการอะไหล่
  const handleAddPart = () => {
    if (!formData.name || !formData.id) return;
    
    const newPart: Part = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      min: Number(formData.min)
    };
    
    const updatedInventory = [...inventory, newPart];
    setInventory(updatedInventory);
    onUpdateInventory?.(updatedInventory);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditPart = () => {
    if (!selectedPart) return;
    
    const updatedInventory = inventory.map(part => 
      part.id === selectedPart.id ? { ...formData } : part
    );
    setInventory(updatedInventory);
    onUpdateInventory?.(updatedInventory);
    setShowEditModal(false);
    setSelectedPart(null);
    resetForm();
  };

  const handleDeletePart = (partId: string) => {
    if (confirm('คุณต้องการลบอะไหล่นี้หรือไม่?')) {
      const updatedInventory = inventory.filter(part => part.id !== partId);
      setInventory(updatedInventory);
      onUpdateInventory?.(updatedInventory);
    }
  };

  const handleStockAdjustment = () => {
    if (!selectedPart || stockAdjustment === 0) return;
    
    const updatedInventory = inventory.map(part => 
      part.id === selectedPart.id 
        ? { ...part, stock: Math.max(0, part.stock + stockAdjustment) }
        : part
    );
    setInventory(updatedInventory);
    onUpdateInventory?.(updatedInventory);
    setShowStockModal(false);
    setSelectedPart(null);
    setStockAdjustment(0);
    setStockNote('');
  };

  // Purchase Order Functions
  const openPurchaseModal = (part: Part) => {
    setSelectedPartForOrder(part);
    // แนะนำจำนวนที่ควรสั่งซื้อ (เติมให้ถึง min * 2)
    const suggestedQty = Math.max(0, (part.min * 2) - part.stock);
    setOrderQuantity(suggestedQty);
    setOrderNote('');
    setShowPurchaseModal(true);
  };

  const handleCreatePurchaseOrder = () => {
    if (!selectedPartForOrder || orderQuantity <= 0) return;

    const newOrder: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      partId: selectedPartForOrder.id,
      partName: selectedPartForOrder.name,
      quantity: orderQuantity,
      unitPrice: selectedPartForOrder.price,
      totalPrice: orderQuantity * selectedPartForOrder.price,
      status: 'pending',
      requestedBy: 'Admin', // ในระบบจริงจะใช้ user ที่ login
      requestedDate: new Date().toISOString(),
      supplier: 'ผู้จัดจำหน่ายหลัก',
      note: orderNote
    };

    setPurchaseOrders([newOrder, ...purchaseOrders]);
    setShowPurchaseModal(false);
    setSelectedPartForOrder(null);
    setOrderQuantity(0);
    setOrderNote('');
  };

  const openReceiveConfirmModal = (order: PurchaseOrder) => {
    setSelectedOrderForReceive(order);
    setDamagedQuantity(0);
    setReceiveNote('');
    setShowReceiveConfirmModal(true);
  };

  const handleConfirmReceive = () => {
    if (!selectedOrderForReceive) return;
    
    // คำนวณจำนวนที่ใช้ได้จริง (ยอดรับ - ของชำรุด)
    const actualQuantity = selectedOrderForReceive.quantity - damagedQuantity;
    
    if (actualQuantity < 0) {
      alert('จำนวนชำรุดมากกว่าจำนวนที่สั่ง กรุณาตรวจสอบอีกครั้ง');
      return;
    }
    
    // อัพเดทคำสั่งซื้อ
    const orderId = selectedOrderForReceive.id;
    const orderToUpdate = purchaseOrders.find(o => o.id === orderId);
    
    setPurchaseOrders(purchaseOrders.map(order => {
      if (order.id === orderId) {
        return { 
          ...order, 
          status: 'received' as const,
          receivedDate: new Date().toISOString(),
          damagedQuantity: damagedQuantity > 0 ? damagedQuantity : undefined,
          receiveNote: receiveNote || undefined
        };
      }
      return order;
    }));
    
    // เพิ่มสต็อก (เฉพาะจำนวนที่ใช้ได้)
    if (orderToUpdate && actualQuantity > 0) {
      setInventory(prevInventory => {
        const updatedInventory = prevInventory.map(part =>
          part.id === orderToUpdate.partId
            ? { ...part, stock: part.stock + actualQuantity }
            : part
        );
        onUpdateInventory?.(updatedInventory);
        return updatedInventory;
      });
    }
    
    setShowReceiveConfirmModal(false);
    setSelectedOrderForReceive(null);
    setDamagedQuantity(0);
    setReceiveNote('');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: PurchaseOrder['status']) => {
    // หา order ที่ต้องการอัพเดท
    const orderToUpdate = purchaseOrders.find(o => o.id === orderId);
    
    // อัพเดท purchase orders
    setPurchaseOrders(purchaseOrders.map(order => {
      if (order.id === orderId) {
        const updates: Partial<PurchaseOrder> = { status: newStatus };
        
        if (newStatus === 'ordered' && !order.orderedDate) {
          updates.orderedDate = new Date().toISOString();
        }
        
        if (newStatus === 'received') {
          updates.receivedDate = new Date().toISOString();
        }
        
        return { ...order, ...updates };
      }
      return order;
    }));
    
    // เพิ่มสต็อกเมื่อได้รับของ (แยกออกมาเพื่อให้ state sync ดีขึ้น)
    if (newStatus === 'received' && orderToUpdate) {
      setInventory(prevInventory => {
        const updatedInventory = prevInventory.map(part =>
          part.id === orderToUpdate.partId
            ? { ...part, stock: part.stock + orderToUpdate.quantity }
            : part
        );
        onUpdateInventory?.(updatedInventory);
        return updatedInventory;
      });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('คุณต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?')) {
      setPurchaseOrders(purchaseOrders.filter(order => order.id !== orderId));
    }
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
        // ตรวจสอบว่ามี pending/ordered purchase order สำหรับ part นี้หรือไม่
        const hasPendingOrder = purchaseOrders.some(
          order => order.partId === part.id && 
          (order.status === 'pending' || order.status === 'ordered')
        );
        
        let status: 'out_of_stock' | 'low_stock' | 'adequate' | 'overstocked';
        let severity: 'critical' | 'warning' | 'info';

        if (part.stock === 0) {
          status = 'out_of_stock';
          // ถ้ามี pending order อยู่แล้ว ไม่แสดงเป็น critical
          severity = hasPendingOrder ? 'info' : 'critical';
        } else if (part.stock < part.min) {
          status = 'low_stock';
          // ถ้ามี pending order อยู่แล้ว ไม่แสดงเป็น warning
          severity = hasPendingOrder ? 'info' : 'warning';
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
  }, [inventory, purchaseOrders]);

  // นับจำนวน alerts แต่ละประเภท
  const alertCounts = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
      total: alerts.filter(a => a.severity !== 'info').length
    };
  }, [alerts]);

  // นับจำนวน purchase orders ตามสถานะ
  const orderCounts = useMemo(() => {
    return {
      pending: purchaseOrders.filter(o => o.status === 'pending').length,
      ordered: purchaseOrders.filter(o => o.status === 'ordered').length,
      total: purchaseOrders.filter(o => o.status !== 'received' && o.status !== 'cancelled').length
    };
  }, [purchaseOrders]);

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
          // เรียงตามตัวเลขในรหัส ID (P001, P002, ... P010)
          const extractNumber = (id: string) => {
            const match = id.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          };
          compareValue = extractNumber(a.id) - extractNumber(b.id);
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

  // คำนวณ pagination
  const totalPages = Math.ceil(filteredAndSortedInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedInventory.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortField, sortDirection]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

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
            <button
              onClick={() => setShowOrdersListModal(true)}
              className="flex-1 min-w-[180px] bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-3 rounded-xl border-2 border-purple-300 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="text-xs text-purple-700 mb-1 flex items-center gap-1 font-semibold whitespace-nowrap">
                <ShoppingCart className="w-3 h-3" />
                คำสั่งซื้อรอดำเนินการ
              </div>
              <div className="text-2xl font-bold text-purple-700">{orderCounts.total}</div>
            </button>
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
                        className={`flex items-center justify-between p-3 rounded-lg gap-3 ${
                          alert.severity === 'critical' 
                            ? 'bg-red-100 border border-red-200' 
                            : 'bg-orange-100 border border-orange-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl flex-shrink-0">
                            {alert.severity === 'critical' ? '🚫' : '⚠️'}
                          </span>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800">
                              {alert.partName}
                            </div>
                            <div className="text-xs text-slate-600">
                              รหัส: {alert.partId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <div className={`text-lg font-bold whitespace-nowrap ${
                              alert.severity === 'critical' ? 'text-red-700' : 'text-orange-700'
                            }`}>
                              {alert.currentStock === 0 ? 'หมดสต็อก' : `เหลือ ${alert.currentStock}`}
                            </div>
                            <div className="text-xs text-slate-600 whitespace-nowrap">
                              ต้องการขั้นต่ำ {alert.minStock}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const part = inventory.find(p => p.id === alert.partId);
                              if (part) openPurchaseModal(part);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md text-sm flex items-center gap-2 whitespace-nowrap"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            สั่งซื้อด่วน
                          </button>
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
                        รหัส / ชื่ออะไหล่
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
                    currentItems.map((part) => (
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
                              onClick={() => openPurchaseModal(part)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                              title="สั่งซื้ออะไหล่"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openStockModal(part)}
                              className="p-2 bg-cyan-100 text-cyan-600 rounded-lg hover:bg-cyan-200 transition-all"
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
              currentItems.map((part) => (
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
                        onClick={() => openPurchaseModal(part)}
                        className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all opacity-0 group-hover:opacity-100"
                        title="สั่งซื้อ"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openStockModal(part)}
                        className="p-1.5 bg-cyan-100 text-cyan-600 rounded-lg hover:bg-cyan-200 transition-all opacity-0 group-hover:opacity-100"
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

        {/* Pagination */}
        {filteredAndSortedInventory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                แสดง <span className="font-bold text-slate-800">{startIndex + 1}</span> ถึง{' '}
                <span className="font-bold text-slate-800">
                  {Math.min(endIndex, filteredAndSortedInventory.length)}
                </span>{' '}
                จาก <span className="font-bold text-slate-800">{filteredAndSortedInventory.length}</span> รายการ
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">ย้อนกลับ</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-slate-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-[40px] h-10 px-3 rounded-xl font-bold transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-110'
                            : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-md'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <span className="hidden sm:inline">ถัดไป</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
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

        {/* Purchase Order Modal */}
        {showPurchaseModal && selectedPartForOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="w-7 h-7" />
                  สั่งซื้ออะไหล่
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-600 mb-1">อะไหล่ที่ต้องการสั่งซื้อ</div>
                  <div className="font-bold text-lg text-slate-800">{selectedPartForOrder.name}</div>
                  <div className="text-sm text-slate-500 mt-1">รหัส: {selectedPartForOrder.id}</div>
                  <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-slate-600">สต็อกปัจจุบัน</div>
                      <div className="font-bold text-blue-600">
                        {selectedPartForOrder.stock} {selectedPartForOrder.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">ราคา/หน่วย</div>
                      <div className="font-bold text-slate-800">
                        ฿{selectedPartForOrder.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    จำนวนที่ต้องการสั่งซื้อ
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOrderQuantity(Math.max(0, orderQuantity - 10))}
                      className="w-12 h-12 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all"
                    >
                      −10
                    </button>
                    <button
                      onClick={() => setOrderQuantity(Math.max(0, orderQuantity - 1))}
                      className="w-12 h-12 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(0, Number(e.target.value)))}
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-bold"
                      placeholder="0"
                    />
                    <button
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="w-12 h-12 bg-green-100 text-green-600 rounded-xl font-bold hover:bg-green-200 transition-all"
                    >
                      +
                    </button>
                    <button
                      onClick={() => setOrderQuantity(orderQuantity + 10)}
                      className="w-12 h-12 bg-green-100 text-green-600 rounded-xl font-bold hover:bg-green-200 transition-all"
                    >
                      +10
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    💡 แนะนำ: สั่ง {Math.max(0, (selectedPartForOrder.min * 2) - selectedPartForOrder.stock)} {selectedPartForOrder.unit} เพื่อเติมให้ถึง {selectedPartForOrder.min * 2}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">มูลค่ารวม:</span>
                    <span className="font-bold text-2xl text-green-600">
                      ฿{(orderQuantity * selectedPartForOrder.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {orderQuantity} {selectedPartForOrder.unit} × ฿{selectedPartForOrder.price.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">หมายเหตุ (ถ้ามี)</label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="เช่น ต้องการด่วน, สำหรับงานซ่อม, ฯลฯ"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => { 
                    setShowPurchaseModal(false); 
                    setSelectedPartForOrder(null); 
                    setOrderQuantity(0);
                    setOrderNote('');
                  }}
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreatePurchaseOrder}
                  disabled={orderQuantity <= 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  สร้างคำสั่งซื้อ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Orders List Modal */}
        {showOrdersListModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="w-7 h-7" />
                    รายการคำสั่งซื้ออะไหล่
                  </h3>
                  <button
                    onClick={() => setShowOrdersListModal(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="mt-4 flex gap-3">
                  <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-purple-100">รอดำเนินการ</div>
                    <div className="text-lg font-bold text-white">{orderCounts.pending}</div>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-purple-100">สั่งซื้อแล้ว</div>
                    <div className="text-lg font-bold text-white">{orderCounts.ordered}</div>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-purple-100">ทั้งหมด</div>
                    <div className="text-lg font-bold text-white">{purchaseOrders.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {purchaseOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-slate-300" />
                    <div className="text-xl font-semibold text-slate-600 mb-2">ยังไม่มีคำสั่งซื้อ</div>
                    <div className="text-sm text-slate-500">เริ่มสั่งซื้ออะไหล่จากหน้าคลังอะไหล่</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseOrders.map((order) => {
                      const statusConfig = {
                        pending: { 
                          bg: 'bg-yellow-100 border-yellow-300', 
                          text: 'text-yellow-700',
                          icon: Clock,
                          label: 'รอดำเนินการ'
                        },
                        ordered: { 
                          bg: 'bg-blue-100 border-blue-300', 
                          text: 'text-blue-700',
                          icon: Truck,
                          label: 'สั่งซื้อแล้ว'
                        },
                        received: { 
                          bg: 'bg-green-100 border-green-300', 
                          text: 'text-green-700',
                          icon: CheckCircle2,
                          label: 'ได้รับแล้ว'
                        },
                        cancelled: { 
                          bg: 'bg-red-100 border-red-300', 
                          text: 'text-red-700',
                          icon: XCircle,
                          label: 'ยกเลิก'
                        }
                      };
                      
                      const config = statusConfig[order.status];
                      const StatusIcon = config.icon;
                      
                      return (
                        <div key={order.id} className={`${config.bg} border-2 rounded-xl p-5 hover:shadow-lg transition-all`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`px-3 py-1.5 ${config.bg} border-2 ${config.bg.replace('100', '300')} rounded-lg flex items-center gap-2`}>
                                  <StatusIcon className={`w-4 h-4 ${config.text}`} />
                                  <span className={`text-sm font-bold ${config.text}`}>{config.label}</span>
                                </div>
                                <span className="text-xs text-slate-500 font-mono">{order.id}</span>
                              </div>
                              <div className="font-bold text-lg text-slate-800">{order.partName}</div>
                              <div className="text-sm text-slate-600 mt-1">รหัส: {order.partId}</div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600">
                                ฿{order.totalPrice.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {order.quantity} × ฿{order.unitPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                            <div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                ผู้ขอ
                              </div>
                              <div className="font-semibold text-slate-700">{order.requestedBy}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                วันที่ขอ
                              </div>
                              <div className="font-semibold text-slate-700">
                                {new Date(order.requestedDate).toLocaleDateString('th-TH', { 
                                  day: 'numeric', 
                                  month: 'short',
                                  year: '2-digit'
                                })}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                ผู้จัดจำหน่าย
                              </div>
                              <div className="font-semibold text-slate-700">{order.supplier || '-'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">จำนวน</div>
                              <div className="font-bold text-purple-600">{order.quantity}</div>
                            </div>
                          </div>
                          
                          {order.note && (
                            <div className="bg-white/50 rounded-lg p-3 mb-4">
                              <div className="text-xs text-slate-500 mb-1">หมายเหตุ:</div>
                              <div className="text-sm text-slate-700">{order.note}</div>
                            </div>
                          )}
                          
                          <div className="flex gap-2 flex-wrap">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'ordered')}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm flex items-center gap-2"
                                >
                                  <Truck className="w-4 h-4" />
                                  ยืนยันสั่งซื้อ
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                  className="px-4 py-2 bg-red-100 text-red-700 border-2 border-red-300 rounded-lg font-semibold hover:bg-red-200 transition-all text-sm"
                                >
                                  ยกเลิก
                                </button>
                              </>
                            )}
                            
                            {order.status === 'ordered' && (
                              <button
                                onClick={() => openReceiveConfirmModal(order)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all text-sm flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                ยืนยันรับของ
                              </button>
                            )}
                            
                            {(order.status === 'cancelled' || order.status === 'received') && (
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200 transition-all text-sm"
                              >
                                <Trash2 className="w-4 h-4 inline mr-1" />
                                ลบรายการ
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200">
                <button
                  onClick={() => setShowOrdersListModal(false)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all shadow-md"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receive Confirmation Modal */}
        {showReceiveConfirmModal && selectedOrderForReceive && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl flex-shrink-0">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7" />
                  ยืนยันการรับของ
                </h3>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-900 mb-1">
                      กรุณาตรวจสอบความถูกต้อง
                    </div>
                    <div className="text-sm text-amber-700">
                      โปรดยืนยันว่าได้รับสินค้าตามรายการด้านล่างเรียบร้อยแล้ว
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">รหัสคำสั่งซื้อ</div>
                      <div className="font-bold text-slate-800">{selectedOrderForReceive.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-1">วันที่สั่งซื้อ</div>
                      <div className="font-semibold text-slate-700 text-sm">
                        {new Date(selectedOrderForReceive.orderedDate || selectedOrderForReceive.requestedDate).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-1">ชื่ออะไหล่</div>
                    <div className="font-bold text-lg text-slate-800">{selectedOrderForReceive.partName}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">จำนวน</div>
                      <div className="font-bold text-green-600 text-lg">
                        {selectedOrderForReceive.quantity}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">ราคา/หน่วย</div>
                      <div className="font-semibold text-slate-700">
                        ฿{selectedOrderForReceive.unitPrice.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">มูลค่ารวม</div>
                      <div className="font-bold text-purple-600">
                        ฿{selectedOrderForReceive.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {selectedOrderForReceive.supplier && (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-xs text-slate-500 mb-1">ผู้จัดจำหน่าย</div>
                      <div className="font-semibold text-slate-700">{selectedOrderForReceive.supplier}</div>
                    </div>
                  )}

                  {selectedOrderForReceive.note && (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-xs text-slate-500 mb-1">หมายเหตุคำสั่งซื้อ</div>
                      <div className="text-sm text-slate-700">{selectedOrderForReceive.note}</div>
                    </div>
                  )}
                </div>

                {/* ส่วนกรอกจำนวนชำรุด */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      จำนวนที่ชำรุด/เสียหาย (ถ้ามี)
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDamagedQuantity(Math.max(0, damagedQuantity - 1))}
                        className="w-12 h-12 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={damagedQuantity <= 0}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={damagedQuantity}
                        onChange={(e) => setDamagedQuantity(Math.max(0, Math.min(selectedOrderForReceive.quantity, Number(e.target.value))))}
                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg font-bold"
                        placeholder="0"
                        max={selectedOrderForReceive.quantity}
                      />
                      <button
                        onClick={() => setDamagedQuantity(Math.min(selectedOrderForReceive.quantity, damagedQuantity + 1))}
                        className="w-12 h-12 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={damagedQuantity >= selectedOrderForReceive.quantity}
                      >
                        +
                      </button>
                    </div>
                    {damagedQuantity > 0 && (
                      <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-xs text-red-600 font-semibold mb-1">⚠️ มีของชำรุด</div>
                        <div className="text-sm text-red-700">
                          จำนวนที่จะเพิ่มสต็อก: <span className="font-bold">{selectedOrderForReceive.quantity - damagedQuantity}</span> หน่วย
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      หมายเหตุการรับของ (ถ้ามี)
                    </label>
                    <textarea
                      value={receiveNote}
                      onChange={(e) => setReceiveNote(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={2}
                      placeholder="เช่น มีของชำรุด 2 ชิ้น, บรรจุภัณฑ์เสียหาย, ฯลฯ"
                    />
                  </div>
                </div>

                <div className={`border-2 rounded-xl p-4 ${damagedQuantity > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-start gap-3">
                    {damagedQuantity > 0 ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className={`flex-1 text-sm ${damagedQuantity > 0 ? 'text-amber-800' : 'text-green-800'}`}>
                      <div className="font-semibold mb-2">สรุปการดำเนินการ:</div>
                      <div className="space-y-1.5 bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between">
                          <span>จำนวนที่สั่ง:</span>
                          <span className="font-bold">{selectedOrderForReceive.quantity} หน่วย</span>
                        </div>
                        {damagedQuantity > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>จำนวนชำรุด:</span>
                            <span className="font-bold">-{damagedQuantity} หน่วย</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-slate-300">
                          <span className="font-semibold">เพิ่มสต็อก:</span>
                          <span className="font-bold text-green-600 text-lg">
                            +{selectedOrderForReceive.quantity - damagedQuantity} หน่วย
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        • อัปเดตสถานะเป็น "ได้รับสินค้าแล้ว"<br/>
                        • บันทึกวันที่รับของเป็นวันที่ปัจจุบัน
                        {damagedQuantity > 0 && <><br/>• บันทึกจำนวนชำรุดไว้ในระบบ</>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3 flex-shrink-0">
                <button
                  onClick={() => {
                    setShowReceiveConfirmModal(false);
                    setSelectedOrderForReceive(null);
                  }}
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmReceive}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  ยืนยันรับของ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
