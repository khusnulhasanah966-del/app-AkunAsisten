export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface Transaction {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  notes?: string;
  receiptImage?: string; // base64 or url
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'masuk' | 'keluar' | 'penyesuaian';
  quantity: number;
  date: string;
  notes: string;
  createdAt: string;
}

export interface Product {
  id: string;
  userId: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface DebtPayment {
  id: string;
  date: string;
  amount: number;
  notes?: string;
  createdAt: string;
}

export type DebtType = 'utang' | 'piutang'; // utang: kita berutang ke supplier, piutang: pelanggan berutang ke kita
export type DebtStatus = 'belum_lunas' | 'sebagian' | 'lunas';

export interface DebtReceivable {
  id: string;
  userId: string;
  type: DebtType;
  partyName: string; // nama pihak (supplier / pelanggan)
  transactionDate: string;
  dueDate: string;
  initialAmount: number;
  paidAmount: number;
  status: DebtStatus;
  notes?: string;
  payments: DebtPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  completed: boolean;
  content: string; // Detailed guide content markdown/html
  iconName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  phone: string;
  address?: string;
  initialBalance: number;
  avatarUrl?: string;
}

