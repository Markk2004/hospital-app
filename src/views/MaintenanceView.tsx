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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

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
        <div className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 animate-in fade-in">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 md:w-6 md:h-6 text-blue-600" /> 
            <span className="hidden sm:inline">ระบบแจ้งซ่อม</span>
            <span className="sm:hidden">แจ้งซ่อม</span>
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveView('list')} 
              className={`p-2 rounded-md transition-all ${activeView === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              <LayoutList size={18} />
            </button>
            <button 
              onClick={() => setActiveView('board')} 
              className={`p-2 rounded-md transition-all ${activeView === 'board' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              <Layout size={18} />
            </button>
            <button 
              onClick={() => setActiveView('form')} 
              className="p-2 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
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
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Job ID</th>
                    <th className="px-6 py-4">อุปกรณ์</th>
                    <th className="px-6 py-4">อาการ</th>
                    <th className="px-6 py-4 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentJobs.map(job => (
                    <tr 
                      key={job.id} 
                      onClick={() => handleSelectJob(job)} 
                      className={`transition-colors cursor-pointer ${job.urgency === 'high' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-blue-50/30'}`}
                    >
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {job.id}
                        {job.urgency === 'high' && (
                          <span className="ml-2 inline-flex w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>{job.assetName}</div>
                        <div className="text-xs text-slate-400">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{job.issue}</td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={job.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="text-xs text-slate-500 font-medium">
                  แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, jobs.length)} จาก {jobs.length} รายการ
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 text-xs font-bold disabled:opacity-50 hover:bg-slate-50"
                    >
                        ย้อนกลับ
                    </button>
                    <span className="text-xs font-bold text-slate-700 px-2">
                      หน้า {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 text-xs font-bold disabled:opacity-50 hover:bg-slate-50"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
          </div>
        )}

        {activeView === 'board' && (
           <div className="flex h-full gap-4 overflow-x-auto pb-4 animate-in fade-in snap-x">
             {(['new', 'in_progress', 'waiting_parts', 'completed'] as const).map(status => (
               <div key={status} className="flex-shrink-0 w-72 md:w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 max-h-full snap-center">
                  <div className="p-3 font-bold text-slate-600 uppercase text-xs tracking-wider flex justify-between bg-white/50 rounded-t-xl border-b border-slate-100">
                    {status === 'new' ? 'งานใหม่' : status === 'in_progress' ? 'กำลังดำเนินการ' : status === 'waiting_parts' ? 'รออะไหล่' : 'เสร็จสิ้น'}
                    <span className="bg-white px-2 rounded-md shadow-sm text-slate-800 border border-slate-200">
                      {getJobsByStatus(status).length}
                    </span>
                  </div>
                  <div className="p-2 space-y-2 overflow-y-auto flex-1">
                    {getJobsByStatus(status).map(job => (
                      <div 
                        key={job.id} 
                        onClick={() => handleSelectJob(job)} 
                        className={`bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group ${job.urgency === 'high' ? 'ring-2 ring-red-100 border-red-200' : ''}`}
                      >
                         <div className="flex justify-between mb-2">
                           <span className="text-[10px] font-bold bg-slate-50 px-1 rounded border text-slate-500">
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
