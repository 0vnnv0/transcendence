import type { SearchResult } from '../types/search.types';

const API_URL = '/api';

export const fetchGlobalSearch = async (searchQuery: string): Promise<SearchResult[]> => {
  const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Fehler bei der globalen Suche');
  }
  
  return response.json(); 
};