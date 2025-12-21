import type { StockStatus } from '../types';

interface StockStatusBadgeProps {
  currentStock: number;
  minStock: number;
  unit?: string;
}

export function StockStatusBadge({ currentStock, minStock, unit = 'ชิ้น' }: StockStatusBadgeProps) {
  const getStatus = (): StockStatus => {
    if (currentStock === 0) return 'out_of_stock';
    if (currentStock < minStock) return 'low_stock';
    if (currentStock >= minStock && currentStock < minStock * 2) return 'adequate';
    return 'overstocked';
  };

  const status = getStatus();

  const statusConfig = {
    out_of_stock: {
      label: 'หมดสต็อก',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: '🚫'
    },
    low_stock: {
      label: 'ต่ำกว่าเกณฑ์',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: '⚠️'
    },
    adequate: {
      label: 'เพียงพอ',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: '✓'
    },
    overstocked: {
      label: 'สต็อกเกิน',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: '📦'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col gap-1">
      <span 
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        <span>{config.icon}</span>
        {config.label}
      </span>
      <div className="text-xs text-slate-600">
        <span className={`font-bold ${currentStock === 0 ? 'text-red-600' : currentStock < minStock ? 'text-orange-600' : 'text-slate-700'}`}>
          เหลือ {currentStock} {unit}
        </span>
        <span className="text-slate-400 ml-1">(ขั้นต่ำ {minStock})</span>
      </div>
    </div>
  );
}
