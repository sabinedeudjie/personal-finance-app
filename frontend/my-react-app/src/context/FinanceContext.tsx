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
  getCategories,
  type Transaction,
  type Category,
} from '../services/api';
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

const STORAGE_KEY = 'nkapflow_transactions';

interface FinanceContextValue {
  transactions: Transaction[];
  categories: Category[];
  summary: FinancialSummary;
  monthlyData: MonthlyDataPoint[];
  categoryBreakdown: CategoryAmount[];
  balanceTrend: BalanceTrendPoint[];
  trends: { balance: number | null; income: number | null; expense: number | null };
  loading: boolean;
  usingLocalStorage: boolean;
  refresh: () => Promise<void>;
  addTransaction: (
    payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>
  ) => Promise<void>;
  editTransaction: (
    id: string,
    payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>
  ) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

function readLocalTransactions(): Transaction[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);

  const persistLocal = useCallback((next: Transaction[]) => {
    setTransactions(next);
    writeLocalTransactions(next);
    setUsingLocalStorage(true);
  }, []);

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
      writeLocalTransactions(remoteTransactions);
      setUsingLocalStorage(false);
    } catch {
      setTransactions(readLocalTransactions());
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
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
      usingLocalStorage,
      refresh,
      addTransaction,
      editTransaction,
      removeTransaction,
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
      usingLocalStorage,
      refresh,
      addTransaction,
      editTransaction,
      removeTransaction,
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
