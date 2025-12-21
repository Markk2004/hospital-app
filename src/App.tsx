import { useState, useEffect } from 'react';
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
  Activity
} from 'lucide-react';

// Import Types
import type { Job, Part } from './types';

// Import Data
import { initialJobs, initialPartsInventoryData } from './data/mockData';

// Import Components
import { Toast } from './components/Toast';
import { LoginPage } from './components/LoginPage';
import { MobileLoginPage } from './components/MobileLoginPage';

// Import Views
import { DashboardView } from './views/DashboardView';
import { MaintenanceView } from './views/MaintenanceView';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [partsInventory, setPartsInventory] = useState<Part[]>(initialPartsInventoryData);
  
  // Toast State
  const [toast, setToast] = useState<{ 
    show: boolean; 
    message: string; 
    type: 'success' | 'error' | 'warning' 
  }>({ show: false, message: '', type: 'success' });

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

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any; label: string; id: string }) => (
    <div 
      onClick={() => { 
        setActiveTab(id); 
        if(window.innerWidth < 768) setIsSidebarOpen(false); 
      }} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap overflow-hidden ${
        activeTab === id 
          ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === id ? 'text-blue-600' : 'text-slate-400'}`} />
      <span className="truncate">{label}</span>
    </div>
  );

  // Mobile: Auto close sidebar & Detect Mobile
  useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) setIsSidebarOpen(false);
        else setIsSidebarOpen(true);
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

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`${
        isSidebarOpen 
          ? 'w-64 translate-x-0' 
          : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
      } fixed md:relative bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-30 h-full flex-shrink-0 shadow-lg shadow-slate-100`}>
        <div className="p-6 flex items-center justify-between h-20 shrink-0">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl truncate animate-in fade-in">
              <Activity className="w-8 h-8 flex-shrink-0" />
              <span>Hospital Asset</span>
            </div>
          ) : (
            <Activity className="w-8 h-8 text-blue-600 mx-auto" />
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="hidden md:block text-slate-400 hover:text-slate-600 transition-transform hover:scale-110"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "ภาพรวม (Dashboard)" : ""} id="dashboard" />
          <SidebarItem icon={Wrench} label={isSidebarOpen ? "แจ้งซ่อม (Maintenance)" : ""} id="maintenance" />
          <div className="pt-4 pb-2">
            <div className="h-px bg-slate-100 w-full"></div>
            {isSidebarOpen && <p className="text-xs font-bold text-slate-400 mt-4 mb-2 px-2">ASSET MANAGEMENT</p>}
          </div>
          <SidebarItem icon={Stethoscope} label={isSidebarOpen ? "ทะเบียนครุภัณฑ์" : ""} id="assets" />
          <SidebarItem icon={ArrowRightLeft} label={isSidebarOpen ? "ระบบยืม-คืน" : ""} id="loans" />
          <SidebarItem icon={Package} label={isSidebarOpen ? "คลังอะไหล่" : ""} id="parts" />
        </nav>
        
        <div className="p-4 border-t border-slate-100 shrink-0">
           {isSidebarOpen ? (
             <div className="flex items-center space-x-3 overflow-hidden bg-slate-50 p-3 rounded-xl border border-slate-100">
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
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 h-16 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
               className="md:hidden text-slate-500 hover:text-slate-700"
             >
               <Menu size={24} />
             </button>
             <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate">
               {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'maintenance' ? 'Maintenance' : 'Assets Registry'}
             </h1>
           </div>
           <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="pl-9 pr-4 py-2 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 w-64 text-sm" 
               />
             </div>
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'dashboard' && (
            <DashboardView 
              jobs={jobs} 
              inventory={partsInventory} 
              onNavigate={setActiveTab} 
            />
          )}
          
          {activeTab === 'maintenance' && (
            <MaintenanceView 
              jobs={jobs} 
              inventory={partsInventory} 
              onAddJob={handleAddJob} 
              onUpdateJob={handleUpdateJob} 
              onUsePart={handleUsePart} 
              onShowToast={triggerToast} 
            />
          )}
          
          {(activeTab !== 'dashboard' && activeTab !== 'maintenance') && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Package size={64} className="mb-4 opacity-20" />
              <p>หน้า "{activeTab}" ยังไม่เปิดใช้งานใน Demo นี้</p>
            </div>
          )}
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
