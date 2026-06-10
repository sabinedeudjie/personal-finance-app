import apiClient from './axios.client';

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

export const getDashboardStats = async (): Promise<DashboardSummary> => {
  const { data } = await apiClient.get('/stats/summary', { params: { period: 'year' } });
  return data;
};

export const getCategoryBreakdown = async (period = 'year'): Promise<CategoryBreakdownItem[]> => {
  const { data } = await apiClient.get('/stats/by-category', { params: { period } });
  return data;
};

export const getMonthlyTrends = async (year?: number): Promise<MonthlyTrend[]> => {
  const { data } = await apiClient.get('/stats/trends', { params: { year } });
  return data;
};
