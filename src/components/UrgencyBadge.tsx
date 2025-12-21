import React from 'react';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import type { Job } from '../types';

interface UrgencyBadgeProps {
  level: Job['urgency'];
  detailed?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, detailed = false }) => {
  const configs = {
    high: { 
      color: 'bg-red-100 text-red-700 border-red-200', 
      text: 'ฉุกเฉิน', 
      fullText: 'ฉุกเฉิน (Emergency)', 
      icon: AlertTriangle 
    },
    medium: { 
      color: 'bg-orange-100 text-orange-700 border-orange-200', 
      text: 'เร่งด่วน', 
      fullText: 'เร่งด่วน (Urgent)', 
      icon: Clock 
    },
    normal: { 
      color: 'bg-blue-100 text-blue-700 border-blue-200', 
      text: 'ปกติ', 
      fullText: 'ปกติ (Normal)', 
      icon: CheckCircle2 
    },
  };
  
  const config = configs[level] || configs.normal;
  const Icon = config.icon;
  
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.color} whitespace-nowrap`}>
      <Icon className="w-3 h-3" /> {detailed ? config.fullText : config.text}
    </span>
  );
};
