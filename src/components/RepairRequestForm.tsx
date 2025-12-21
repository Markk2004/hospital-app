import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';
import type { FormData } from '../types';

interface RepairRequestFormProps {
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
}

export const RepairRequestForm: React.FC<RepairRequestFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({ 
    assetName: '', 
    location: 'Auto: Ward 5', 
    issue: '', 
    urgency: 'normal',
    reporter: 'Admin User'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
    setFormData({...formData, [e.target.name]: e.target.value});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.assetName || !formData.issue) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 mt-4 animate-in fade-in slide-in-from-bottom-4 overflow-y-auto max-h-[85vh]">
      <div className="text-center mb-6 md:mb-8">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
          <FileText className="w-7 h-7 md:w-8 md:h-8" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">แบบฟอร์มแจ้งซ่อม</h2>
        <p className="text-slate-500 mt-2 text-sm">กรุณาระบุรายละเอียดให้ครบถ้วน</p>
      </div>

      <div className="space-y-5 md:space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อเครื่อง / รหัส</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  name="assetName" 
                  value={formData.assetName} 
                  onChange={handleChange} 
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  placeholder="ค้นหา..." 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">สถานที่</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50" 
                placeholder="ระบุตึก/ชั้น" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">อาการเสีย</label>
            <textarea 
              name="issue" 
              value={formData.issue} 
              onChange={handleChange} 
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none" 
              placeholder="รายละเอียดอาการ..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ความเร่งด่วน</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'normal', label: 'ปกติ', icon: CheckCircle2, color: 'peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700' },
                { id: 'medium', label: 'เร่งด่วน', icon: Clock, color: 'peer-checked:bg-orange-50 peer-checked:border-orange-500 peer-checked:text-orange-700' },
                { id: 'high', label: 'ฉุกเฉิน', icon: AlertTriangle, color: 'peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700' }
              ].map(opt => (
                <label key={opt.id} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="urgency" 
                    value={opt.id} 
                    checked={formData.urgency === opt.id} 
                    onChange={handleChange} 
                    className="peer sr-only" 
                  />
                  <div className={`p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 transition-all ${opt.color}`}>
                    <opt.icon className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <span className="text-xs md:text-sm font-bold">{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div className="pt-6 flex gap-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm"
            >
              ส่งเรื่อง
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
