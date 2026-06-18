import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchUsers, createChat } from '../services/api.services';

export const useAvailableUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

export const useCreateNewChat = () => {
  return useMutation({
    mutationFn: (targetUserId: string) => createChat(targetUserId),
  });
};