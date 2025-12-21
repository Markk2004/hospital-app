import React, { useEffect } from 'react';
import { X, Check, AlertTriangle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, show, type = 'success', onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const styles = {
    success: 'bg-slate-800 text-white border-slate-700',
    error: 'bg-red-600 text-white border-red-700',
    warning: 'bg-orange-500 text-white border-orange-600'
  };

  const icons = {
    success: Check,
    error: AlertTriangle,
    warning: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 w-full max-w-sm px-4">
      <div className={`${styles[type]} px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border`}>
        <div className="bg-white/20 rounded-full p-2">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-sm">{message}</span>
        <button onClick={onClose} className="ml-auto text-white/60 hover:text-white">
          <X size={18}/>
        </button>
      </div>
    </div>
  );
};
