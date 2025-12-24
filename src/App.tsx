import { useState, useEffect, lazy, Suspense } from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Wrench, 
  Package, 
  ArrowRightLeft,
  Search,
  Bell,
  User,
  Menu,
  X,
  Activity,
  ChevronDown,
  ChevronRight,
  FileText,
  TrendingDown,
  ClipboardList,
  Users,
  FileBarChart,
  PieChart,
  Loader2
} from 'lucide-react';

// Import Types
import type { Job, Part } from './types';

// Import Data
import { initialJobs, initialPartsInventoryData } from './data/mockData';

// Import Components
import { Toast } from './components/Toast';
import { LoginPage } from './components/LoginPage';
import { MobileLoginPage } from './components/MobileLoginPage';
import { NewsSlider } from './components/NewsSlider';

// Lazy Load Views for better performance
const DashboardView = lazy(() => import('./views/DashboardView').then(m => ({ default: m.DashboardView })));
const MaintenanceView = lazy(() => import('./views/MaintenanceView').then(m => ({ default: m.MaintenanceView })));
const InventoryView = lazy(() => import('./views/InventoryView').then(m => ({ default: m.InventoryView })));
const AssetView = lazy(() => import('./views/AssetView').then(m => ({ default: m.AssetView })));
const AssetRegisterView = lazy(() => import('./views/AssetRegisterView').then(m => ({ default: m.AssetRegisterView })));
const AssetBorrowView = lazy(() => import('./views/AssetBorrowView').then(m => ({ default: m.AssetBorrowView })));
const AssetDepreciationView = lazy(() => import('./views/AssetDepreciationView').then(m => ({ default: m.AssetDepreciationView })));
const ReportsView = lazy(() => import('./views/ReportsView').then(m => ({ default: m.ReportsView })));
const ReportSummaryView = lazy(() => import('./views/ReportSummaryView').then(m => ({ default: m.ReportSummaryView })));
const ReportMaintenanceView = lazy(() => import('./views/ReportMaintenanceView').then(m => ({ default: m.ReportMaintenanceView })));
const ReportPartsView = lazy(() => import('./views/ReportPartsView').then(m => ({ default: m.ReportPartsView })));
const UserManagementView = lazy(() => import('./views/UserManagementView').then(m => ({ default: m.UserManagementView })));

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSeenSlider, setHasSeenSlider] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [partsInventory, setPartsInventory] = useState<Part[]>(initialPartsInventoryData);
  
  // Dropdown states
  const [assetMenuOpen, setAssetMenuOpen] = useState(false);
  const [maintenanceMenuOpen, setMaintenanceMenuOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{ 
    show: boolean; 
    message: string; 
    type: 'success' | 'error' | 'warning' 
  }>({ show: false, message: '', type: 'success' });

  // คำนวณจำนวนอะไหล่ที่ต้องแจ้งเตือน
  const lowStockCount = partsInventory.filter(p => p.stock > 0 && p.stock < p.min).length;
  const outOfStockCount = partsInventory.filter(p => p.stock === 0).length;
  const totalAlerts = lowStockCount + outOfStockCount;

  const triggerToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message: msg, type });
  };

  const handleAddJob = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const handleUsePart = (partId: string) => {
    setPartsInventory(prev => prev.map(part => 
        part.id === partId ? { ...part, stock: Math.max(0, part.stock - 1) } : part
    ));
  };

  const handleUpdateInventory = (updatedInventory: Part[]) => {
    setPartsInventory(updatedInventory);
  };

  // Sidebar Menu Items
  const showLabels = isSidebarOpen || isSidebarHovered;
  
  const SidebarItem = ({ icon: Icon, label, id }: { icon: any; label: string; id: string }) => (
    <div 
      onClick={() => { 
        setActiveTab(id); 
        if(window.innerWidth < 768) setIsSidebarOpen(false); 
      }}
      title={!showLabels ? label : undefined}
      className={`flex items-center space-x-3 px-3 md:px-4 py-3.5 md:py-3 rounded-lg cursor-pointer transition-all whitespace-nowrap overflow-hidden touch-manipulation group ${
        activeTab === id 
          ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' 
          : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
      }`}
    >
      <Icon className={`w-5 h-5 md:w-5 md:h-5 flex-shrink-0 ${activeTab === id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      {showLabels && <span className="truncate text-base md:text-sm animate-in fade-in slide-in-from-left-2 duration-200">{label}</span>}
    </div>
  );

  // Dropdown Menu Parent
  const DropdownParent = ({ 
    icon: Icon, 
    label, 
    isOpen, 
    onClick 
  }: { 
    icon: any; 
    label: string; 
    isOpen: boolean; 
    onClick: () => void;
  }) => (
    <div 
      onClick={onClick}
      title={!showLabels ? label : undefined}
      className={`flex items-center justify-between px-3 md:px-4 py-3.5 md:py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap overflow-hidden touch-manipulation ${
        isOpen 
          ? 'bg-blue-50 text-blue-600 font-semibold' 
          : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 md:w-5 md:h-5 flex-shrink-0 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
        {showLabels && <span className="truncate text-base md:text-sm">{label}</span>}
      </div>
      {showLabels && (
        isOpen ? <ChevronDown className="w-4 h-4 md:w-4 md:h-4" /> : <ChevronRight className="w-4 h-4 md:w-4 md:h-4" />
      )}
    </div>
  );

  // Dropdown Menu Child
  const DropdownChild = ({ 
    icon: Icon, 
    label, 
    id 
  }: { 
    icon: any; 
    label: string; 
    id: string;
  }) => (
    <div 
      onClick={() => { 
        setActiveTab(id); 
        if(window.innerWidth < 768) setIsSidebarOpen(false); 
      }}
      title={!showLabels ? label : undefined}
      className={`flex items-center space-x-3 pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-2.5 rounded-lg cursor-pointer transition-all whitespace-nowrap overflow-hidden touch-manipulation group ${
        activeTab === id 
          ? 'bg-blue-100 text-blue-700 font-semibold' 
          : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
      }`}
    >
      <Icon className={`w-4 h-4 md:w-4 md:h-4 flex-shrink-0 ${activeTab === id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      {showLabels && <span className="truncate text-base md:text-sm animate-in fade-in slide-in-from-left-2 duration-200">{label}</span>}
    </div>
  );

  // Mobile: Auto close sidebar & Detect Mobile
  useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(false); // Desktop starts collapsed
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) {
    return isMobile 
      ? <MobileLoginPage onLogin={() => setIsLoggedIn(true)} /> 
      : <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (!hasSeenSlider) {
    return <NewsSlider onEnterSite={() => setHasSeenSlider(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside 
        onMouseEnter={() => {
          if (!isMobile) {
            setIsSidebarHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setIsSidebarHovered(false);
          }
        }}
        className={`${
          isSidebarOpen && isMobile
            ? 'w-72 translate-x-0' 
            : isMobile
            ? 'w-0 -translate-x-full'
            : (showLabels ? 'w-64' : 'w-20')
        } fixed md:relative bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col z-30 h-full flex-shrink-0 shadow-lg shadow-slate-100 overscroll-contain`}>
        <div className="p-4 md:p-6 flex items-center justify-between h-16 md:h-20 shrink-0">
          {/* Mobile: Full Logo */}
          {isMobile && isSidebarOpen ? (
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-lg animate-in fade-in">
              <Activity className="w-8 h-8 flex-shrink-0" />
              <span>Hospital Asset</span>
            </div>
          ) : isMobile ? null : (
            /* Desktop: Icon only, expand on hover */
            showLabels ? (
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl truncate animate-in fade-in slide-in-from-left-3 duration-200">
                <Activity className="w-8 h-8 flex-shrink-0" />
                <span>Hospital Asset</span>
              </div>
            ) : (
              <Activity className="w-8 h-8 text-blue-600 mx-auto" />
            )
          )}
          
          {/* Mobile close button */}
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="text-slate-400 p-2 -mr-2 touch-manipulation active:bg-slate-100 rounded-lg"
            >
              <X size={22} />
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-3 md:px-4 space-y-1.5 md:space-y-2 mt-2 md:mt-4 overflow-y-auto overscroll-contain">
          {/* หน้าหลัก - Dashboard */}
          <SidebarItem 
            icon={LayoutDashboard} 
            label="หน้าหลัก" 
            id="dashboard" 
          />
          
          {/* ครุภัณฑ์ - Dropdown */}
          <div className="space-y-1">
            <DropdownParent 
              icon={Stethoscope} 
              label="ครุภัณฑ์" 
              isOpen={assetMenuOpen}
              onClick={() => setAssetMenuOpen(!assetMenuOpen)}
            />
            {assetMenuOpen && showLabels && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                <DropdownChild icon={Package} label="รายการครุภัณฑ์" id="asset-list" />
                <DropdownChild icon={FileText} label="ลงทะเบียน" id="asset-register" />
                <DropdownChild icon={ArrowRightLeft} label="ระบบยืม-คืน" id="asset-borrow" />
                <DropdownChild icon={TrendingDown} label="ค่าเสื่อวราคา" id="asset-depreciation" />
              </div>
            )}
          </div>

          {/* ซ่อมบำรุง - Dropdown */}
          <div className="space-y-1">
            <DropdownParent 
              icon={Wrench} 
              label="ซ่อมบำรุง" 
              isOpen={maintenanceMenuOpen}
              onClick={() => setMaintenanceMenuOpen(!maintenanceMenuOpen)}
            />
            {maintenanceMenuOpen && showLabels && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                <DropdownChild icon={ClipboardList} label="รายการซ่อม" id="maintenance-list" />
                <DropdownChild icon={Package} label="คลังอะไหล่" id="parts-inventory" />
              </div>
            )}
          </div>

          {/* รายงาน - Dropdown */}
          <div className="space-y-1">
            <DropdownParent 
              icon={FileBarChart} 
              label="รายงาน" 
              isOpen={reportMenuOpen}
              onClick={() => setReportMenuOpen(!reportMenuOpen)}
            />
            {reportMenuOpen && showLabels && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                <DropdownChild icon={PieChart} label="สรุปภาพรวม" id="report-summary" />
                <DropdownChild icon={FileBarChart} label="รายงานการซ่อม" id="report-maintenance" />
                <DropdownChild icon={Package} label="รายงานอะไหล่" id="report-parts" />
              </div>
            )}
          </div>

          {/* ผู้ใช้งาน */}
          <SidebarItem 
            icon={Users} 
            label="ผู้ใช้งาน" 
            id="user-management"
          />
        </nav>
        
        <div className="p-4 border-t border-slate-100 shrink-0">
           {showLabels ? (
             <div className="flex items-center space-x-3 overflow-hidden bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-left-2 duration-200">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                 <User className="w-5 h-5" />
               </div>
               <div className="min-w-0">
                 <p className="text-sm font-semibold text-slate-700 truncate">Admin User</p>
                 <p className="text-xs text-slate-500 truncate">Engineering Dept.</p>
               </div>
             </div>
           ) : (
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
               <User className="w-5 h-5" />
             </div>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-3 md:px-8 h-14 md:h-16 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
               className="md:hidden text-slate-500 hover:text-slate-700 p-2 -ml-2 touch-manipulation active:bg-slate-100 rounded-lg flex-shrink-0"
             >
               <Menu size={22} />
             </button>
             <h1 className="text-base md:text-xl font-bold text-slate-800 truncate">
               {activeTab === 'dashboard' && 'หน้าหลัก'}
               {activeTab === 'asset-list' && 'รายการครุภัณฑ์'}
               {activeTab === 'asset-register' && 'ลงทะเบียนครุภัณฑ์'}
               {activeTab === 'asset-borrow' && 'ระบบยืม-คืนครุภัณฑ์'}
               {activeTab === 'asset-depreciation' && 'ค่าเสื่อมราคา'}
               {activeTab === 'maintenance-list' && 'รายการซ่อมบำรุง'}
               {activeTab === 'parts-inventory' && 'คลังอะไหล่'}
               {activeTab === 'parts-order' && 'สั่งซื้ออะไหล่'}
               {activeTab === 'report-summary' && 'สรุปภาพรวม'}
               {activeTab === 'report-maintenance' && 'รายงานการซ่อม'}
               {activeTab === 'report-parts' && 'รายงานอะไหล่'}
               {activeTab === 'user-management' && 'ผู้ใช้งานในระบบ'}
             </h1>
           </div>
           <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
             <div className="relative hidden md:block">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="pl-9 pr-4 py-2 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 w-64 text-sm" 
               />
             </div>
             <button 
               onClick={() => setActiveTab('parts-inventory')}
               className="relative p-2.5 md:p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors touch-manipulation active:bg-slate-200"
               title={`การแจ้งเตือนอะไหล่: ${totalAlerts} รายการ`}
             >
               <Bell size={20} className="md:w-5 md:h-5" />
               {totalAlerts > 0 && (
                 <>
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                     {totalAlerts > 9 ? '9+' : totalAlerts}
                   </span>
                 </>
               )}
             </button>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">กำลังโหลด...</p>
              </div>
            </div>
          }>
            {activeTab === 'dashboard' && (
              <DashboardView 
                jobs={jobs} 
                inventory={partsInventory} 
                onNavigate={setActiveTab} 
              />
            )}
            
            {activeTab === 'maintenance-list' && (
              <MaintenanceView 
                jobs={jobs} 
                inventory={partsInventory} 
                onAddJob={handleAddJob} 
                onUpdateJob={handleUpdateJob} 
                onUsePart={handleUsePart} 
                onShowToast={triggerToast} 
              />
            )}
            
            {activeTab === 'parts-inventory' && (
              <InventoryView 
                inventory={partsInventory} 
                onUpdateInventory={handleUpdateInventory}
              />
            )}

            {activeTab === 'asset-list' && <AssetView />}
            
            {activeTab === 'asset-register' && <AssetRegisterView />}
            
            {activeTab === 'asset-borrow' && <AssetBorrowView />}
            
            {activeTab === 'asset-depreciation' && <AssetDepreciationView />}
            
            {activeTab === 'report-summary' && <ReportSummaryView />}
            {activeTab === 'report-maintenance' && <ReportMaintenanceView />}
            {activeTab === 'report-parts' && <ReportPartsView />}
            {activeTab === 'report-inventory' && <ReportsView />}
            {activeTab === 'report-depreciation' && <ReportsView />}
            
            {activeTab === 'user-management' && <UserManagementView />}
          </Suspense>
        </div>
        
        {/* Toast Notification */}
        <Toast 
          show={toast.show} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      </main>
    </div>
  );
}
