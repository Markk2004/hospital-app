// Type Definitions for Hospital Asset Management System

export type StockStatus = 'out_of_stock' | 'low_stock' | 'adequate' | 'overstocked';

export interface Part {
  id: string;
  name: string;
  price: number;
  stock: number;
  min: number;
  unit: string;
  qty?: number;
}

export interface InventoryAlert {
  id: string;
  partId: string;
  partName: string;
  currentStock: number;
  minStock: number;
  status: StockStatus;
  severity: 'critical' | 'warning' | 'info';
}

export interface Job {
  id: string;
  assetId: string;
  assetName: string;
  location: string;
  issue: string;
  urgency: 'normal' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'waiting_parts' | 'completed';
  reporter: string;
  date: string;
  type: 'CM' | 'PM';
  technician: string | null;
  partsUsed: Part[];
  repairNote: string;
}

export interface FormData {
  assetName: string;
  assetId?: string;
  location: string;
  issue: string;
  urgency: 'normal' | 'medium' | 'high';
  reporter: string;
}
