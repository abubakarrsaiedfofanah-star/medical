export type StockStatus = 'In stock' | 'Low stock' | 'Out of stock';

export type Medicine = {
  id: string;
  name: string;
  category: string;
  strength: string;
  packSize: string;
  stock: number;
  reorderLevel: number;
  price: number;
  status: StockStatus;
};

export type PharmacyOrder = {
  id: string;
  patient: string;
  items: number;
  total: number;
  status: 'Ready' | 'Processing' | 'Collected';
  createdAt: string;
};
