import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  Product, 
  StockMovement, 
  DebtReceivable, 
  DebtPayment,
  TrainingMaterial, 
  UserProfile 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PRODUCTS, 
  INITIAL_STOCK_MOVEMENTS, 
  INITIAL_DEBTS_RECEIVABLES, 
  INITIAL_TRAINING_MATERIALS 
} from '../data/initialData';

export interface UserAccount extends UserProfile {
  password?: string;
  createdAt?: string;
}

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  registeredUsers: UserAccount[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, businessName: string, pass: string, copyDemoData?: boolean) => boolean;
  logout: () => void;
  switchAccount: (userId: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Transaction;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Products & Stock
  products: Product[];
  stockMovements: StockMovement[];
  addProduct: (product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, type: 'masuk' | 'keluar' | 'penyesuaian', quantity: number, notes: string) => void;

  // Debts and Receivables
  debtsReceivables: DebtReceivable[];
  addDebtReceivable: (item: Omit<DebtReceivable, 'id' | 'userId' | 'paidAmount' | 'status' | 'payments' | 'createdAt' | 'updatedAt'>) => void;
  updateDebtReceivable: (id: string, item: Partial<DebtReceivable>) => void;
  deleteDebtReceivable: (id: string) => void;
  addDebtPayment: (debtId: string, payment: Omit<DebtPayment, 'id' | 'createdAt'>) => void;

  // Training Materials
  trainingMaterials: TrainingMaterial[];
  toggleTrainingCompleted: (id: string) => void;

  // Active Month & Year Filter for Global View
  selectedMonth: number; // 0-11
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;

  // Reset to demo data
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'akunasisten_current_user_id',
  USERS_LIST: 'akunasisten_registered_users',
  AUTH: 'akunasisten_auth',
  TRAINING: 'akunasisten_training',
  dataPrefix: (userId: string) => `akunasisten_data_${userId}`,
};

const DEFAULT_USERS: UserAccount[] = [
  {
    ...INITIAL_USER,
    password: 'password123',
    createdAt: '2026-09-01T00:00:00Z',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All registered accounts list
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse users list', e);
      }
    }
    return DEFAULT_USERS;
  });

  // Current active user
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const users = (() => {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      try {
        return saved ? JSON.parse(saved) : DEFAULT_USERS;
      } catch {
        return DEFAULT_USERS;
      }
    })();
    const found = users.find((u: UserAccount) => u.id === savedId);
    return found || users[0] || INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved !== null ? JSON.parse(saved) : true; // Default logged in as demo user
  });

  // Financial Filter: default September 2026
  const [selectedMonth, setSelectedMonth] = useState<number>(8);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Helper to load user-specific storage
  const loadUserData = (userId: string) => {
    const key = STORAGE_KEYS.dataPrefix(userId);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
    // If it's the demo user, return demo data
    if (userId === INITIAL_USER.id) {
      return {
        transactions: INITIAL_TRANSACTIONS,
        products: INITIAL_PRODUCTS,
        stockMovements: INITIAL_STOCK_MOVEMENTS,
        debtsReceivables: INITIAL_DEBTS_RECEIVABLES,
      };
    }
    // Otherwise clean initial slate
    return {
      transactions: [],
      products: [],
      stockMovements: [],
      debtsReceivables: [],
    };
  };

  const initialData = loadUserData(user?.id || INITIAL_USER.id);

  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialData.stockMovements);
  const [debtsReceivables, setDebtsReceivables] = useState<DebtReceivable[]>(initialData.debtsReceivables);

  const [trainingMaterials, setTrainingMaterials] = useState<TrainingMaterial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRAINING);
    return saved ? JSON.parse(saved) : INITIAL_TRAINING_MATERIALS;
  });

  // Save registered users list
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Save current auth and user id
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    }
  }, [isAuthenticated, user]);

  // Save active user's transactions, products, stock, debts
  useEffect(() => {
    if (!user) return;
    const key = STORAGE_KEYS.dataPrefix(user.id);
    const payload = {
      transactions,
      products,
      stockMovements,
      debtsReceivables,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  }, [user, transactions, products, stockMovements, debtsReceivables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAINING, JSON.stringify(trainingMaterials));
  }, [trainingMaterials]);

  // Auth Methods
  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check in registeredUsers
    let found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    // If demo user email match or fallback
    if (!found && cleanEmail === INITIAL_USER.email.toLowerCase()) {
      found = registeredUsers.find((u) => u.id === INITIAL_USER.id) || {
        ...INITIAL_USER,
        password: 'password123',
      };
    }

    if (found) {
      // If password matches or demo
      if (!found.password || found.password === cleanPass || cleanPass === 'password123' || !cleanPass) {
        setUser(found);
        setIsAuthenticated(true);
        // Load data for this user
        const uData = loadUserData(found.id);
        setTransactions(uData.transactions);
        setProducts(uData.products);
        setStockMovements(uData.stockMovements);
        setDebtsReceivables(uData.debtsReceivables);
        return true;
      }
    }

    // Allow flexible login for any email by creating quick session
    const quickUser: UserAccount = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0],
      email: cleanEmail,
      businessName: `Usaha ${email.split('@')[0]}`,
      businessType: 'Usaha UMKM',
      phone: '',
      initialBalance: 0,
      password: cleanPass || '123456',
    };
    setRegisteredUsers((prev) => [...prev, quickUser]);
    setUser(quickUser);
    setIsAuthenticated(true);
    setTransactions([]);
    setProducts([]);
    setStockMovements([]);
    setDebtsReceivables([]);
    return true;
  };

  const register = (
    name: string,
    email: string,
    businessName: string,
    pass: string,
    copyDemoData = false
  ): boolean => {
    const newId = 'usr_' + Date.now();
    const newUser: UserAccount = {
      id: newId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      businessName: businessName.trim(),
      businessType: 'Usaha Dagang & Jasa',
      phone: '',
      address: '',
      initialBalance: copyDemoData ? 2550000 : 0,
      password: pass.trim(),
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev.filter((u) => u.email !== newUser.email), newUser]);
    setUser(newUser);
    setIsAuthenticated(true);

    if (copyDemoData) {
      setTransactions(INITIAL_TRANSACTIONS.map((t) => ({ ...t, userId: newId, id: 'trx-' + Math.random().toString(36).substring(2, 9) })));
      setProducts(INITIAL_PRODUCTS.map((p) => ({ ...p, userId: newId, id: 'prod-' + Math.random().toString(36).substring(2, 9) })));
      setStockMovements(INITIAL_STOCK_MOVEMENTS);
      setDebtsReceivables(INITIAL_DEBTS_RECEIVABLES.map((d) => ({ ...d, userId: newId, id: 'dr-' + Math.random().toString(36).substring(2, 9) })));
    } else {
      setTransactions([]);
      setProducts([]);
      setStockMovements([]);
      setDebtsReceivables([]);
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchAccount = (userId: string) => {
    const target = registeredUsers.find((u) => u.id === userId);
    if (!target) return;
    setUser(target);
    setIsAuthenticated(true);
    const uData = loadUserData(target.id);
    setTransactions(uData.transactions);
    setProducts(uData.products);
    setStockMovements(uData.stockMovements);
    setDebtsReceivables(uData.debtsReceivables);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, ...profile } : u))
    );
  };

  // Transaction Methods
  const addTransaction = (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Transaction => {
    const newTx: Transaction = {
      ...tx,
      id: 'trx-' + Date.now(),
      userId: user?.id || 'usr_demo_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Product & Stock Methods
  const addProduct = (prod: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Product => {
    const newProduct: Product = {
      ...prod,
      id: 'prod-' + Date.now(),
      userId: user?.id || 'usr_demo_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setStockMovements((prev) => prev.filter((sm) => sm.productId !== id));
  };

  const adjustStock = (productId: string, type: 'masuk' | 'keluar' | 'penyesuaian', quantity: number, notes: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        let newStock = prod.stock;
        if (type === 'masuk') newStock += quantity;
        else if (type === 'keluar') newStock = Math.max(0, newStock - quantity);
        else if (type === 'penyesuaian') newStock = quantity;

        return { ...prod, stock: newStock, updatedAt: new Date().toISOString() };
      })
    );

    const newMovement: StockMovement = {
      id: 'sm-' + Date.now(),
      productId,
      type,
      quantity,
      date: new Date().toISOString().slice(0, 10),
      notes,
      createdAt: new Date().toISOString(),
    };
    setStockMovements((prev) => [newMovement, ...prev]);
  };

  // Debts & Receivables Methods
  const addDebtReceivable = (item: Omit<DebtReceivable, 'id' | 'userId' | 'paidAmount' | 'status' | 'payments' | 'createdAt' | 'updatedAt'>) => {
    const newItem: DebtReceivable = {
      ...item,
      id: 'dr-' + Date.now(),
      userId: user?.id || 'usr_demo_1',
      paidAmount: 0,
      status: 'belum_lunas',
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDebtsReceivables((prev) => [newItem, ...prev]);
  };

  const updateDebtReceivable = (id: string, updated: Partial<DebtReceivable>) => {
    setDebtsReceivables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated, updatedAt: new Date().toISOString() } : item))
    );
  };

  const deleteDebtReceivable = (id: string) => {
    setDebtsReceivables((prev) => prev.filter((item) => item.id !== id));
  };

  const addDebtPayment = (debtId: string, paymentData: Omit<DebtPayment, 'id' | 'createdAt'>) => {
    const target = debtsReceivables.find((d) => d.id === debtId);
    if (!target) return;

    const newPayment: DebtPayment = {
      ...paymentData,
      id: 'pmt-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const newPaidAmount = target.paidAmount + paymentData.amount;
    const newStatus = newPaidAmount >= target.initialAmount ? 'lunas' : 'sebagian';

    setDebtsReceivables((prev) =>
      prev.map((item) =>
        item.id === debtId
          ? {
              ...item,
              paidAmount: newPaidAmount,
              status: newStatus,
              payments: [...item.payments, newPayment],
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    // Integrasi otomatis ke Kas/Transaksi:
    if (target.type === 'utang') {
      addTransaction({
        date: paymentData.date,
        type: 'pengeluaran',
        amount: paymentData.amount,
        category: 'Pembayaran Utang',
        description: `Bayar utang ke ${target.partyName}`,
        paymentMethod: 'Transfer Bank',
        notes: paymentData.notes || `Pembayaran angsuran/pelunasan utang`,
      });
    } else {
      addTransaction({
        date: paymentData.date,
        type: 'pemasukan',
        amount: paymentData.amount,
        category: 'Penerimaan Piutang',
        description: `Terima piutang dari ${target.partyName}`,
        paymentMethod: 'Transfer Bank',
        notes: paymentData.notes || `Penerimaan pelunasan/angsuran piutang pelanggan`,
      });
    }
  };

  // Training methods
  const toggleTrainingCompleted = (id: string) => {
    setTrainingMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const resetToDemoData = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(true);
    setRegisteredUsers(DEFAULT_USERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setProducts(INITIAL_PRODUCTS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setDebtsReceivables(INITIAL_DEBTS_RECEIVABLES);
    setTrainingMaterials(INITIAL_TRAINING_MATERIALS);
    setSelectedMonth(8); // Sept
    setSelectedYear(2026);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        registeredUsers,
        login,
        register,
        logout,
        switchAccount,
        updateProfile,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        products,
        stockMovements,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        debtsReceivables,
        addDebtReceivable,
        updateDebtReceivable,
        deleteDebtReceivable,
        addDebtPayment,
        trainingMaterials,
        toggleTrainingCompleted,
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
