import { useQuery } from '@tanstack/react-query';
import { fetchAllUsers, fetchUserProfile, fetchUsersBySearch } from '../services/user.service';
import type { ChatUser } from '../types/chat'

export function useUserProfile(login: string | null) {
  return useQuery({
    queryKey: ['userProfile', login], // Unique cache key per user
    queryFn: () => fetchUserProfile(login!),
    enabled: !!login, // ONLY run the query if 'login' is not null/empty
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes (prevents endless network calls)
  });
}

export const useUsers = () => {
  return useQuery<ChatUser[], Error>({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  });
};

export const useUsersSearch = (searchQuery: string) => {
  return useQuery<ChatUser[], Error>({
    queryKey: ['users', searchQuery], 
    queryFn: () => fetchUsersBySearch(searchQuery),
    enabled: searchQuery.trim().length > 0, 
  });
};