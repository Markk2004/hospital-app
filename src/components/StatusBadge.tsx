import React from 'react';
import type { Job } from '../types';

interface StatusBadgeProps {
  status: Job['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    new: 'bg-blue-50 text-blue-600 border-blue-200',
    in_progress: 'bg-orange-50 text-orange-600 border-orange-200',
    waiting_parts: 'bg-purple-50 text-purple-600 border-purple-200',
    completed: 'bg-green-50 text-green-600 border-green-200',
  };
  
  const labels = { 
    new: 'งานใหม่', 
    in_progress: 'กำลังซ่อม', 
    waiting_parts: 'รออะไหล่', 
    completed: 'เสร็จสิ้น' 
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100'}`}>
      {labels[status] || status}
    </span>
  );
};
