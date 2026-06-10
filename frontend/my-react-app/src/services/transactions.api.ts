import apiClient from './axios.client';

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
  search?: string;
}

export const getTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
  const { data } = await apiClient.get('/transactions', { params: filters });
  return data;
};

export const createTransaction = async (
  payload: Omit<Transaction, 'id' | 'created_at' | 'category' | 'user_id'>
) => {
  const { data } = await apiClient.post('/transactions', payload);
  return data;
};

export const updateTransaction = async (id: string, payload: Partial<Transaction>) => {
  const { data } = await apiClient.put(`/transactions/${id}`, payload);
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { data } = await apiClient.delete(`/transactions/${id}`);
  return data;
};
