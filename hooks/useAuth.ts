import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { AuthResponse, User } from '@/types';
import { TOKEN_KEY, USER_KEY } from '@/lib/constants';
import toast from 'react-hot-toast';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setAuth(data.user, data.token);
      toast.success('Logged in successfully!');
    },
  });
}

export function useSignup() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setAuth(data.user, data.token);
      toast.success('Account created successfully!');
    },
  });
}

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ user: User }>('/auth/me');
      return data.user;
    },
    enabled: !!token,
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      const { data } = await apiClient.put<{ user: User }>('/auth/update-profile', profileData);
      return data.user;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile updated!');
    },
  });
}