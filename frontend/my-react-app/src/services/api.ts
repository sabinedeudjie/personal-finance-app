import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Transaction {
  id: string;
  user_id: string;
  category_id?: string | null;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  notes?: string | null;
  created_at?: string;
  category?: { id: string; name: string; icon?: string | null };
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: string;
  startDate?: string;
  endDate?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string | null;
}

export interface DashboardSummary {
  income: number;
  expense: number;
  balance: number;
  transactionCount?: number;
}

export interface CategoryBreakdownItem {
  categoryId: string | null;
  categoryName: string;
  color?: string;
  total: number;
}

export interface MonthlyTrend {
  month: number;
  monthName: string;
  income: number;
  expense: number;
  balance: number;
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (payload: { email: string; password: string; name?: string }) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const getDashboardStats = async (): Promise<DashboardSummary> => {
  const { data } = await api.get('/stats/summary', { params: { period: 'year' } });
  return data;
};

export const getCategoryBreakdown = async (period = 'year'): Promise<CategoryBreakdownItem[]> => {
  const { data } = await api.get('/stats/by-category', { params: { period } });
  return data;
};

export const getMonthlyTrends = async (year?: number): Promise<MonthlyTrend[]> => {
  const { data } = await api.get('/stats/trends', { params: { year } });
  return data;
};

export const getTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
  const { data } = await api.get('/transactions', { params: filters });
  return data;
};

export const createTransaction = async (
  payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>
) => {
  const { data } = await api.post('/transactions', payload);
  return data;
};

export const updateTransaction = async (id: string, payload: Partial<Transaction>) => {
  const { data } = await api.put(`/transactions/${id}`, payload);
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { data } = await api.delete(`/transactions/${id}`);
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};

/** Données de démonstration lorsque l'API est indisponible */
export const mockDashboardData = () => ({
  summary: {
    income: 32209,
    expense: 19758.25,
    balance: 12450.75,
    transactionCount: 48,
  } as DashboardSummary,
  monthly: [
    { month: 1, monthName: 'Jan', income: 4200, expense: 3100, balance: 1100 },
    { month: 2, monthName: 'Fév', income: 3800, expense: 2900, balance: 900 },
    { month: 3, monthName: 'Mar', income: 5100, expense: 3800, balance: 1300 },
    { month: 4, monthName: 'Avr', income: 4600, expense: 3400, balance: 1200 },
    { month: 5, monthName: 'Mai', income: 5200, expense: 3900, balance: 1300 },
    { month: 6, monthName: 'Juin', income: 4800, expense: 3500, balance: 1300 },
    { month: 7, monthName: 'Juil', income: 5500, expense: 4200, balance: 1300 },
    { month: 8, monthName: 'Août', income: 4900, expense: 3600, balance: 1300 },
    { month: 9, monthName: 'Sep', income: 5300, expense: 4000, balance: 1300 },
    { month: 10, monthName: 'Oct', income: 4700, expense: 3500, balance: 1200 },
    { month: 11, monthName: 'Nov', income: 5100, expense: 3800, balance: 1300 },
    { month: 12, monthName: 'Déc', income: 5600, expense: 4300, balance: 1300 },
  ] as MonthlyTrend[],
  categories: [
    { categoryId: '1', categoryName: 'Alimentation', total: 3200 },
    { categoryId: '2', categoryName: 'Transport', total: 1800 },
    { categoryId: '3', categoryName: 'Logement', total: 6500 },
    { categoryId: '4', categoryName: 'Santé', total: 1200 },
    { categoryId: '5', categoryName: 'Loisirs', total: 2100 },
    { categoryId: '6', categoryName: 'Autres', total: 4958 },
  ] as CategoryBreakdownItem[],
  transactions: [
    {
      id: '1',
      user_id: 'u1',
      amount: 45000,
      date: '2026-05-28',
      type: 'expense' as const,
      notes: 'Courses supermarché',
      category: { id: '1', name: 'Alimentation' },
    },
    {
      id: '2',
      user_id: 'u1',
      amount: 850000,
      date: '2026-05-25',
      type: 'income' as const,
      notes: 'Salaire mensuel',
      category: { id: '7', name: 'Salaire' },
    },
    {
      id: '3',
      user_id: 'u1',
      amount: 12000,
      date: '2026-05-22',
      type: 'expense' as const,
      notes: 'Abonnement transport',
      category: { id: '2', name: 'Transport' },
    },
    {
      id: '4',
      user_id: 'u1',
      amount: 350000,
      date: '2026-05-20',
      type: 'expense' as const,
      notes: 'Loyer',
      category: { id: '3', name: 'Logement' },
    },
    {
      id: '5',
      user_id: 'u1',
      amount: 28000,
      date: '2026-05-18',
      type: 'expense' as const,
      notes: 'Restaurant',
      category: { id: '5', name: 'Loisirs' },
    },
  ] as Transaction[],
});

export default api;
