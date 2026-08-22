import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Activity } from '@/types';
import toast from 'react-hot-toast';

export function useAddActivity(stopId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityData: Partial<Activity>) => {
      const { data } = await apiClient.post<{ activity: Activity }>(
        `/stops/${stopId}/activities`,
        activityData
      );
      return data.activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Activity added!');
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      activityId,
      updates,
    }: {
      activityId: string;
      updates: Partial<Activity>;
    }) => {
      const { data } = await apiClient.put<{ activity: Activity }>(
        `/activities/${activityId}`,
        updates
      );
      return data.activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityId: string) => {
      await apiClient.delete(`/activities/${activityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Activity removed');
    },
  });
}