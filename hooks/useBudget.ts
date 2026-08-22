import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { BudgetData } from '@/types';

export function useBudget(tripId: string) {
  return useQuery({
    queryKey: ['budget', tripId],
    queryFn: async () => {
      const { data } = await apiClient.get<BudgetData>(`/trips/${tripId}/budget`);
      return data;
    },
    enabled: !!tripId,
  });
}