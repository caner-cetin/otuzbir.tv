import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { UserData } from '../types';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      const response = await api.get<UserData>('/user/me');
      return response.data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/user/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return {
    isAuthenticated: !!user,
    user,
    handleLogout,
    isLoading,
    isError,
  };
}