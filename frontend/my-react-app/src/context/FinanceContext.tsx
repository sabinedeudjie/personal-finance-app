import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getTransactions,
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  type Transaction,
} from '../services/transactions.api';
import {
  getCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  type Category,
} from '../services/categories.api';
import {
  computeSummary,
  computeMonthlyData,
  computeCategoryBreakdown,
  computeBalanceTrend,
  computeTrends,
  type FinancialSummary,
  type MonthlyDataPoint,
  type CategoryAmount,
  type BalanceTrendPoint,
} from '../utils/financeCalculations';
import { useAuth } from '../hooks/useAuth';

const getStorageKey = (userId?: string) => userId ? `nkapflow_tx_${userId}` : 'nkapflow_transactions';

interface FinanceContextValue {
  transactions: Transaction[];
  categories: Category[];
  summary: FinancialSummary;
  monthlyData: MonthlyDataPoint[];
  categoryBreakdown: CategoryAmount[];
  balanceTrend: BalanceTrendPoint[];
  trends: { balance: number | null; income: number | null; expense: number | null };
  loading: boolean;
  error: string | null;
  usingLocalStorage: boolean;
  refresh: () => Promise<void>;
  reset: () => void;
  addTransaction: (
    payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>
  ) => Promise<void>;
  editTransaction: (
    id: string,
    payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>
  ) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addCategory: (payload: Omit<Category, 'id'>) => Promise<void>;
  editCategory: (id: string, payload: Partial<Category>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

function readLocalTransactions(userId?: string): Transaction[] {
  const raw = localStorage.getItem(getStorageKey(userId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalTransactions(userId: string | undefined, transactions: Transaction[]) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(transactions));
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);

  const persistLocal = useCallback((next: Transaction[]) => {
    setTransactions(next);
    writeLocalTransactions(user?.id, next);
    setUsingLocalStorage(true);
  }, [user?.id]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [remoteTransactions, remoteCategories] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);
      setTransactions(remoteTransactions);
      setCategories(remoteCategories);
      writeLocalTransactions(user?.id, remoteTransactions);
      setUsingLocalStorage(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur réseau de connexion au serveur backend.');
      setTransactions(readLocalTransactions(user?.id));
      setCategories([
        { id: '1', name: 'Alimentation', type: 'expense' },
        { id: '2', name: 'Transport', type: 'expense' },
        { id: '3', name: 'Logement', type: 'expense' },
        { id: '4', name: 'Loisirs', type: 'expense' },
        { id: '5', name: 'Salaire', type: 'income' },
      ]);
      setUsingLocalStorage(true);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const reset = useCallback(() => {
    setTransactions([]);
    setCategories([]);
    setError(null);
    setUsingLocalStorage(false);
    setLoading(false);
  }, []);

  const addTransaction = useCallback(
    async (payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>) => {
      try {
        await apiCreateTransaction(payload);
        await refresh();
      } catch {
        const category = categories.find((item) => item.id === payload.category_id);
        const next: Transaction = {
          id: String(Date.now()),
          user_id: 'local',
          ...payload,
          category: category ? { id: category.id, name: category.name } : undefined,
        };
        persistLocal([next, ...transactions]);
      }
    },
    [categories, persistLocal, refresh, transactions]
  );

  const editTransaction = useCallback(
    async (
      id: string,
      payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>
    ) => {
      try {
        await apiUpdateTransaction(id, payload);
        await refresh();
      } catch {
        const category = categories.find((item) => item.id === payload.category_id);
        const next = transactions.map((tx) =>
          tx.id === id
            ? {
                ...tx,
                ...payload,
                category: category ? { id: category.id, name: category.name } : undefined,
              }
            : tx
        );
        persistLocal(next);
      }
    },
    [categories, persistLocal, refresh, transactions]
  );

  const removeTransaction = useCallback(
    async (id: string) => {
      try {
        await apiDeleteTransaction(id);
        await refresh();
      } catch {
        persistLocal(transactions.filter((tx) => tx.id !== id));
      }
    },
    [persistLocal, refresh, transactions]
  );

  const addCategory = useCallback(
    async (payload: Omit<Category, 'id'>) => {
      try {
        await apiCreateCategory(payload);
        await refresh();
      } catch {
        const next: Category = {
          id: String(Date.now()),
          ...payload,
        };
        setCategories((prev) => [...prev, next]);
      }
    },
    [refresh]
  );

  const editCategory = useCallback(
    async (id: string, payload: Partial<Category>) => {
      try {
        await apiUpdateCategory(id, payload);
        await refresh();
      } catch {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...payload } : c))
        );
      }
    },
    [refresh]
  );

  const removeCategory = useCallback(
    async (id: string) => {
      try {
        await apiDeleteCategory(id);
        await refresh();
      } catch {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    },
    [refresh]
  );

  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const monthlyData = useMemo(() => computeMonthlyData(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => computeCategoryBreakdown(transactions), [transactions]);
  const balanceTrend = useMemo(() => computeBalanceTrend(monthlyData), [monthlyData]);
  const trends = useMemo(() => computeTrends(transactions), [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      categories,
      summary,
      monthlyData,
      categoryBreakdown,
      balanceTrend,
      trends,
      loading,
      error,
      usingLocalStorage,
      refresh,
      reset,
      addTransaction,
      editTransaction,
      removeTransaction,
      addCategory,
      editCategory,
      removeCategory,
    }),
    [
      transactions,
      categories,
      summary,
      monthlyData,
      categoryBreakdown,
      balanceTrend,
      trends,
      loading,
      error,
      usingLocalStorage,
      refresh,
      reset,
      addTransaction,
      editTransaction,
      removeTransaction,
      addCategory,
      editCategory,
      removeCategory,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
