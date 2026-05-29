import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Types
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  user_id?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category_id?: string;
  category?: Category;
  notes?: string;
  created_at: string;
}


export interface TransactionFilters {
  from?: string;
  to?: string;
  type?: 'income' | 'expense';
  category_id?: string;
  skip?: number;
  take?: number;
}

// Categories
export const getCategories = (): Promise<Category[]> =>
  api.get('/categories').then(r => r.data);

export const createCategory = (data: Omit<Category, 'id'>) =>
  api.post('/categories', data).then(r => r.data);

export const deleteCategory = (id: string) =>
  api.delete(`/categories/${id}`);

// Transactions
export const getTransactions = (filters?: TransactionFilters): Promise<Transaction[]> =>
  api.get('/transactions', { params: filters }).then(r => r.data);

export const createTransaction = (data: Omit<Transaction, 'id' | 'created_at' | 'category'>) =>
  api.post('/transactions', data).then(r => r.data);

export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  api.put(`/transactions/${id}`, data).then(r => r.data);

export const deleteTransaction = (id: string) =>
  api.delete(`/transactions/${id}`);