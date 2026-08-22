import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { City } from '@/types';
import { useDebounce } from './useDebounce';

export function useCitySearch(query: string, country?: string, region?: string) {
  const debouncedQuery = useDebounce(query, 300);
  return useQuery({
    queryKey: ['cities', 'search', debouncedQuery, country, region],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.append('q', debouncedQuery);
      if (country) params.append('country', country);
      if (region) params.append('region', region);
      const { data } = await apiClient.get<{ cities: City[] }>(`/cities/search?${params.toString()}`);
      return data.cities;
    },
    enabled: debouncedQuery.length > 0,
  });
}

export function usePopularCities() {
  return useQuery({
    queryKey: ['cities', 'popular'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ cities: City[] }>('/cities/popular');
      return data.cities;
    },
  });
}

export function useCity(cityId: string) {
  return useQuery({
    queryKey: ['city', cityId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ city: City }>(`/cities/${cityId}`);
      return data.city;
    },
    enabled: !!cityId,
  });
}