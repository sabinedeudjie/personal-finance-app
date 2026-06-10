import apiClient from './axios.client';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string | null;
}

export const getCategories = async (filters?: {
  search?: string;
  type?: string;
}): Promise<Category[]> => {
  const { data } = await apiClient.get('/categories', { params: filters });
  return data;
};

export const createCategory = async (payload: Omit<Category, 'id'>) => {
  const { data } = await apiClient.post('/categories', payload);
  return data;
};

export const updateCategory = async (id: string, payload: Partial<Category>) => {
  const { data } = await apiClient.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await apiClient.delete(`/categories/${id}`);
  return data;
};
