import React, { useState } from 'react';
import { X, Wrench, Calculator, Package, MapPin, AlertTriangle, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import type { Job, Part } from '../types';
import { UrgencyBadge } from './UrgencyBadge';

interface JobDetailModalProps {
  job: Job;
  inventory: Part[];
  onClose: () => void;
  onSave: (j: Job) => void;
  onUsePart: (partId: string) => void;
  onShowToast: (msg: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ 
  job, 
  inventory, 
  onClose, 
  onSave, 
  onUsePart,
  onShowToast
}) => {
  const [status] = useState<Job['status']>(job.status);
  const [repairNote, setRepairNote] = useState(job.repairNote || '');
  const [usedParts, setUsedParts] = useState<Part[]>(job.partsUsed || []);
  const [selectedPartId, setSelectedPartId] = useState('');

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const partInStock = inventory.find(p => p.id === selectedPartId);
    
    if (!partInStock || partInStock.stock <= 0) {
      alert("อะไหล่หมด! ไม่สามารถเบิกได้");
      return;
    }
    
    onUsePart(selectedPartId); 

    const existing = usedParts.find(p => p.id === partInStock.id);
    if (existing) {
      setUsedParts(usedParts.map(p => p.id === partInStock.id ? { ...p, qty: (p.qty || 0) + 1 } : p));
    } else {
      setUsedParts([...usedParts, { ...partInStock, qty: 1 }]);
    }
  };

  const handleRemovePart = (id: string) => {
    setUsedParts(usedParts.filter(p => p.id !== id));
  };

  const totalCost = usedParts.reduce((sum, p) => sum + (p.price * (p.qty || 1)), 0);

  const handleSave = (newStatus: Job['status']) => {
    onSave({
      ...job,
      status: newStatus,
      repairNote: repairNote,
      partsUsed: usedParts,
      technician: newStatus !== 'new' && !job.technician ? 'Admin User' : job.technician
    });

    if (newStatus === 'completed') {
      onShowToast("ปิดงานซ่อมเรียบร้อยแล้ว!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-bold text-slate-800">{job.id}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${job.type === 'PM' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-200 text-slate-600 border-slate-300'}`}>
                {job.type}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">แจ้งเมื่อ: {job.date} | โดย: {job.reporter}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 p-4 md:p-6 overflow-y-auto bg-white shrink-0">
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Info</label>
                <div className="mt-2 p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm md:text-base">{job.assetName}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{job.assetId}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" /> {job.location}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">อาการที่แจ้ง</label>
                <div className="mt-2 p-3 md:p-4 bg-red-50 rounded-xl border border-red-100 text-slate-700">
                  <p className="font-medium flex items-start gap-2 text-sm md:text-base">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />"{job.issue}"
                  </p>
                  <div className="mt-3"><UrgencyBadge level={job.urgency} detailed /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 p-4 md:p-6 overflow-y-auto bg-slate-50/30 flex flex-col">
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-sm md:text-base">
                  <Wrench className="w-5 h-5 text-blue-600" /> บันทึกการซ่อม
                </h3>
                <textarea 
                  className="w-full h-24 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="ระบุสาเหตุที่พบ และวิธีการแก้ไข..."
                  value={repairNote}
                  onChange={(e) => setRepairNote(e.target.value)}
                  disabled={status === 'completed'}
                ></textarea>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                    <Calculator className="w-5 h-5 text-orange-500" /> เบิกอะไหล่
                  </h3>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">รวมค่าใช้จ่าย</p>
                    <p className="font-bold text-blue-600 text-base md:text-lg">฿{totalCost.toLocaleString()}</p>
                  </div>
                </div>
                {status !== 'completed' && (
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <select 
                      className="flex-1 p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full" 
                      value={selectedPartId} 
                      onChange={(e) => setSelectedPartId(e.target.value)}
                    >
                      <option value="">-- เลือกอะไหล่ --</option>
                      {inventory.map(part => (
                        <option key={part.id} value={part.id} disabled={part.stock <= 0}>
                          {part.name} (เหลือ: {part.stock}) - ฿{part.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={handleAddPart} 
                      disabled={!selectedPartId} 
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap w-full sm:w-auto"
                    >
                      + เพิ่ม
                    </button>
                  </div>
                )}
                {usedParts.length > 0 ? (
                  <div className="border border-slate-100 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[300px]">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="p-2 pl-3">รายการ</th>
                          <th className="p-2 text-center">จำนวน</th>
                          <th className="p-2 text-right">ราคา</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {usedParts.map((part) => (
                          <tr key={part.id} className="border-t border-slate-50">
                            <td className="p-2 pl-3 font-medium text-slate-700">{part.name}</td>
                            <td className="p-2 text-center">{part.qty}</td>
                            <td className="p-2 text-right text-slate-500">฿{(part.price * (part.qty || 1)).toLocaleString()}</td>
                            <td className="p-2 text-center">
                              {status !== 'completed' && (
                                <button onClick={() => handleRemovePart(part.id)} className="text-red-400 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg bg-slate-50">
                    ยังไม่มีการใช้อะไหล่
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 border-t border-slate-200 bg-white flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3 z-10 shrink-0">
          {status !== 'completed' ? (
            <>
              <button 
                onClick={() => handleSave('waiting_parts')} 
                className={`px-4 py-2.5 rounded-xl font-bold border flex items-center justify-center gap-2 transition-colors text-sm ${status === 'waiting_parts' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
              >
                <Clock className="w-4 h-4" /> รออะไหล่
              </button>
              <button 
                onClick={() => handleSave('in_progress')} 
                className={`px-4 py-2.5 rounded-xl font-bold border flex items-center justify-center gap-2 transition-colors text-sm ${status === 'in_progress' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50'}`}
              >
                <Wrench className="w-4 h-4" /> กำลังซ่อม
              </button>
              <button 
                onClick={() => handleSave('completed')} 
                className="px-6 py-2.5 rounded-xl text-white font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> ปิดงานซ่อม
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center w-full sm:w-auto gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl border border-green-200 text-sm">
              <CheckCircle2 className="w-5 h-5" /> ปิดงานเรียบร้อยแล้ว 
              <button onClick={onClose} className="ml-4 text-slate-500 hover:text-slate-700 text-xs underline">
                ปิดหน้าต่าง
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
