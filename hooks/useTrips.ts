import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Trip } from '@/types';
import toast from 'react-hot-toast';

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ trips: Trip[] }>('/trips');
      return data.trips;
    },
  });
}

export function useTrip(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ trip: Trip }>(`/trips/${tripId}`);
      return data.trip;
    },
    enabled: !!tripId,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripData: Partial<Trip>) => {
      const { data } = await apiClient.post<{ trip: Trip }>('/trips', tripData);
      return data.trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip created!');
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tripId, tripData }: { tripId: string; tripData: Partial<Trip> }) => {
      const { data } = await apiClient.put<{ trip: Trip }>(`/trips/${tripId}`, tripData);
      return data.trip;
    },
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ['trip', trip._id] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip updated!');
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripId: string) => {
      await apiClient.delete(`/trips/${tripId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deleted');
    },
  });
}

export function useShareTrip() {
  return useMutation({
    mutationFn: async (tripId: string) => {
      const { data } = await apiClient.post<{ shareableLink: string }>(`/trips/${tripId}/share`);
      return data.shareableLink;
    },
  });
}

export function useCopyTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripId: string) => {
      const { data } = await apiClient.post<{ trip: Trip }>(`/trips/${tripId}/copy`);
      return data.trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip copied to your account!');
    },
  });
}