import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Stop } from '@/types';
import toast from 'react-hot-toast';

export function useAddStop(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stopData: Partial<Stop>) => {
      const { data } = await apiClient.post<{ stop: Stop }>(`/trips/${tripId}/stops`, stopData);
      return data.stop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      toast.success('Stop added!');
    },
  });
}

export function useUpdateStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ stopId, updates }: { stopId: string; updates: Partial<Stop> }) => {
      const { data } = await apiClient.put<{ stop: Stop }>(`/stops/${stopId}`, updates);
      return data.stop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useDeleteStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stopId: string) => {
      await apiClient.delete(`/stops/${stopId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Stop removed');
    },
  });
}

export function useReorderStops() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ stopId, newOrder }: { stopId: string; newOrder: number }) => {
      await apiClient.put(`/stops/${stopId}/reorder`, { newOrder });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}