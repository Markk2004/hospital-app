import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-3 md:p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between min-h-[100px] md:min-h-[120px] hover:shadow-md transition-shadow duration-300 touch-manipulation active:scale-98">
    <div className="flex-1 mr-1.5 md:mr-2 min-w-0">
      <p className="text-slate-500 text-xs md:text-sm font-medium mb-1 md:mb-2 truncate">{title}</p>
      <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-none mb-1 md:mb-2">{value}</h3>
      <p className={`text-[10px] md:text-xs truncate ${subtext.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>{subtext}</p>
    </div>
    <div className={`p-2 md:p-3 rounded-lg flex-shrink-0 ${colorClass} bg-opacity-10`}>
      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
  </div>
);
