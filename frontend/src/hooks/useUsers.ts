import { useQuery } from '@tanstack/react-query';
import { fetchUsers, fetchUserProfile } from '../services/user.service';

export function useUserProfile(login: string | null) {
  return useQuery({
    queryKey: ['userProfile', login], // Unique cache key per user
    queryFn: () => fetchUserProfile(login!),
    enabled: !!login, // ONLY run the query if 'login' is not null/empty
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes (prevents endless network calls)
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
