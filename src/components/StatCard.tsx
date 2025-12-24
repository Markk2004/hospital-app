import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  colorClass: string;
  index?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, colorClass, index = 0 }) => {
  return (
    <div 
      className="glass-morphism glass-morphism-hover p-5 rounded-2xl flex items-start justify-between min-h-[120px] animate-fade-in-up group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex-1 mr-4 min-w-0 relative z-10">
        <p className="text-slate-600 text-sm font-semibold mb-2 truncate tracking-wide uppercase text-xs">{title}</p>
        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-none mb-2 tracking-tight">{value}</h3>
        <div className="flex items-center gap-1.5">
          {subtext.includes('+') ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30">
              {subtext}
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {subtext}
            </span>
          )}
        </div>
      </div>
      
      <div className={`relative p-4 rounded-2xl flex-shrink-0 overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <div className={`absolute inset-0 opacity-20 ${colorClass} blur-xl transition-opacity duration-300 group-hover:opacity-40`}></div>
        <div className={`absolute inset-0 opacity-10 ${colorClass} transition-opacity duration-300 group-hover:opacity-20`}></div>
        <Icon className={`w-8 h-8 relative z-10 ${colorClass.replace('bg-', 'text-')} drop-shadow-lg`} />
      </div>
    </div>
  );
};
