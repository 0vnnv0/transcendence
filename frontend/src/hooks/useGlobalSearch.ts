import { useQuery } from '@tanstack/react-query';
import { fetchGlobalSearch } from '../services/search.service';
import type { SearchResult } from '../types/search.types';

export const useGlobalSearch = (searchQuery: string) => {
  return useQuery<SearchResult[], Error>({
    queryKey: ['globalSearch', searchQuery],
    queryFn: () => fetchGlobalSearch(searchQuery),
    enabled: searchQuery.trim().length >= 2,
  });
};