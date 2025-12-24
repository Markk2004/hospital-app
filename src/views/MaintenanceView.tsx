import React, { useState } from 'react';
import { Wrench, Plus, LayoutList, Layout, MapPin } from 'lucide-react';
import type { Job, Part, FormData } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { RepairRequestForm } from '../components/RepairRequestForm';
import { JobDetailModal } from '../components/JobDetailModal';

interface MaintenanceViewProps {
  jobs: Job[];
  inventory: Part[];
  onUpdateJob: (j: Job) => void;
  onAddJob: (j: Job) => void;
  onUsePart: (pid: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ 
  jobs, 
  inventory, 
  onUpdateJob, 
  onAddJob, 
  onUsePart, 
  onShowToast 
}) => {
  const [activeView, setActiveView] = useState('board');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getJobsByStatus = (status: Job['status']) => jobs.filter(j => j.status === status);

  // เรียงลำดับตามความสำคัญ: high > medium > normal
  const sortedJobs = [...jobs].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, normal: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleUpdateJob = (updatedJob: Job) => {
    onUpdateJob(updatedJob);
    setSelectedJob(null);
  };

  const handleAddNewJob = (formData: FormData) => {
    const newJob: Job = {
      id: `JOB-2512-${Math.floor(Math.random() * 900) + 100}`,
      assetId: formData.assetId || 'N/A',
      assetName: formData.assetName,
      location: formData.location || '-',
      issue: formData.issue,
      urgency: formData.urgency,
      status: 'new',
      reporter: formData.reporter,
      date: new Date().toLocaleString('th-TH'),
      type: 'CM',
      technician: null,
      partsUsed: [],
      repairNote: ''
    };
    onAddJob(newJob);
    setActiveView('list');
    
    if (formData.urgency === 'high') {
        onShowToast(`แจ้งเตือน: มีงานซ่อมด่วนใหม่! (${newJob.assetName})`, 'error');
    } else {
        onShowToast("สร้างใบงานซ่อมใหม่แล้ว!", 'success');
    }
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {activeView !== 'form' && (
        <div className="px-3 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 animate-in fade-in">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-600" /> 
            <span className="hidden sm:inline">ระบบแจ้งซ่อม</span>
            <span className="sm:hidden">แจ้งซ่อม</span>
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveView('list')} 
              className={`p-2 rounded-md transition-all touch-manipulation active:scale-95 ${activeView === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              <LayoutList size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button 
              onClick={() => setActiveView('board')} 
              className={`p-2 rounded-md transition-all touch-manipulation active:scale-95 ${activeView === 'board' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              <Layout size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button 
              onClick={() => setActiveView('form')} 
              className="p-2 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors touch-manipulation active:scale-95"
            >
              <Plus size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        {activeView === 'form' && (
          <RepairRequestForm onCancel={() => setActiveView('list')} onSubmit={handleAddNewJob} />
        )}
        
        {activeView === 'list' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 flex flex-col h-full max-h-[calc(100vh-200px)]">
            <div className="overflow-x-auto flex-1 overscroll-contain">
              <table className="w-full text-xs md:text-sm text-left whitespace-nowrap md:whitespace-normal">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-3 md:px-6 py-3 md:py-4">Job ID</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">อุปกรณ์</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 hidden md:table-cell">อาการ</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell">เวลาแจ้ง</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-center">เร่งด่วน</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentJobs.map(job => (
                    <tr 
                      key={job.id} 
                      onClick={() => handleSelectJob(job)} 
                      className={`transition-colors cursor-pointer touch-manipulation active:bg-blue-100 ${job.urgency === 'high' ? 'bg-red-50 hover:bg-red-100' : job.urgency === 'medium' ? 'bg-orange-50/50 hover:bg-orange-100/50' : 'hover:bg-blue-50/30'}`}
                    >
                      <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-blue-600">
                        {job.id}
                        {job.urgency === 'high' && (
                          <span className="ml-1 md:ml-2 inline-flex w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="font-semibold text-slate-800 text-xs md:text-sm">{job.assetName}</div>
                        <div className="text-[10px] md:text-xs text-slate-400 flex items-center gap-0.5 md:gap-1 mt-0.5 md:table-cell">
                          <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-slate-600 max-w-xs truncate hidden md:table-cell">{job.issue}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                        <div className="text-slate-700 font-medium text-xs">{job.date}</div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                        <UrgencyBadge level={job.urgency} />
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                        <StatusBadge status={job.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-3 md:p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50 gap-2 md:gap-0">
                <span className="text-[10px] md:text-xs text-slate-500 font-medium">
                  แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, sortedJobs.length)} จาก {sortedJobs.length} รายการ
                </span>
                <div className="flex items-center gap-1.5 md:gap-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="px-2.5 md:px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 text-[11px] md:text-xs font-bold disabled:opacity-50 hover:bg-slate-50 touch-manipulation active:scale-95"
                    >
                        ย้อนกลับ
                    </button>
                    <span className="text-[10px] md:text-xs font-bold text-slate-700 px-1 md:px-2">
                      หน้า {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="px-2.5 md:px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 text-[11px] md:text-xs font-bold disabled:opacity-50 hover:bg-slate-50 touch-manipulation active:scale-95"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
          </div>
        )}

        {activeView === 'board' && (
           <div className="flex h-full gap-3 md:gap-4 overflow-x-auto pb-3 md:pb-4 px-3 md:px-4 animate-in fade-in snap-x snap-mandatory overscroll-x-contain">
             {(['new', 'in_progress', 'waiting_parts', 'completed'] as const).map(status => (
               <div key={status} className="flex-shrink-0 w-64 md:w-72 lg:w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 max-h-full snap-center">
                  <div className="p-2.5 md:p-3 font-bold text-slate-600 uppercase text-[10px] md:text-xs tracking-wider flex justify-between bg-white/50 rounded-t-xl border-b border-slate-100">
                    <span className="truncate">
                      {status === 'new' ? 'งานใหม่' : status === 'in_progress' ? 'กำลังดำเนินการ' : status === 'waiting_parts' ? 'รออะไหล่' : 'เสร็จสิ้น'}
                    </span>
                    <span className="bg-white px-1.5 md:px-2 rounded-md shadow-sm text-slate-800 border border-slate-200 ml-1">
                      {getJobsByStatus(status).length}
                    </span>
                  </div>
                  <div className="p-2 space-y-2 overflow-y-auto flex-1 overscroll-contain">
                    {getJobsByStatus(status).map(job => (
                      <div 
                        key={job.id} 
                        onClick={() => handleSelectJob(job)} 
                        className={`bg-white p-2.5 md:p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group touch-manipulation active:scale-98 ${job.urgency === 'high' ? 'ring-2 ring-red-100 border-red-200' : ''}`}
                      >
                         <div className="flex justify-between mb-1.5 md:mb-2">
                           <span className="text-[9px] md:text-[10px] font-bold bg-slate-50 px-1 rounded border text-slate-500">
                             {job.id}
                           </span>
                           <UrgencyBadge level={job.urgency} />
                         </div>
                         <h4 className="font-bold text-slate-700 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                           {job.assetName}
                         </h4>
                         <p className="text-xs text-slate-500 mb-2 line-clamp-2">{job.issue}</p>
                         <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin size={10} /> {job.location}
                            </span>
                            <StatusBadge status={job.status} />
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
             ))}
           </div>
        )}
      </div>

      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          inventory={inventory} 
          onUsePart={onUsePart} 
          onClose={() => setSelectedJob(null)} 
          onSave={handleUpdateJob} 
          onShowToast={(msg) => onShowToast(msg, 'success')} 
        />
      )}
    </div>
  );
};
