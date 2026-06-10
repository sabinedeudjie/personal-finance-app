import apiClient from './axios.client';

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

export const register = async (payload: { email: string; password: string; name?: string }) => {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
};

export const updateUser = async (
  id: string,
  payload: { name?: string; email?: string; password?: string }
) => {
  const { data } = await apiClient.patch(`/users/${id}`, payload);
  return data;
};
