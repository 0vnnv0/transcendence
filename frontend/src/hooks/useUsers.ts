import { fetchAllUsers, fetchUserProfile, fetchUsersBySearch, getUploadUrl } from '../services/user.service';
import type { ChatUser } from '../types/chat'
import type { FullUserProfile } from '../types/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchActiveUsersByProject, updateUserProfile } from '../services/user.service';
import { toast } from 'react-hot-toast';
import { uploadAvatarRequest } from '../services/user.service';
import normalizeProfile from '../utils/normalizeUserData';

export function useUserProfile(login: string | null) {
  return useQuery({
    queryKey: ['userProfile', login], 
    queryFn: () => fetchUserProfile(login!),
    enabled: !!login,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes (prevents endless network calls)
	select: normalizeProfile,
  });
}

export const useUsers = () => {
  return useQuery<ChatUser[], Error>({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  });
};

export const useUsersSearch = (searchQuery: string) => {
  return useQuery<FullUserProfile[], Error>({
    queryKey: ['users', searchQuery], 
    queryFn: () => fetchUsersBySearch(searchQuery),
    enabled: searchQuery.trim().length > 0, 
  });
};

export function useGetUploadUrl() {
	return useMutation({
		mutationFn: getUploadUrl
	});
};

export function useUploadAvatar(userId: number, login: string) {
	const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      if (!userId) throw new Error('No user')
      return uploadAvatarRequest(file, userId)
    },

    // Real server response arrived and succeeded — replace preview with the real URL
    onSuccess: (data) => {
      toast.success('Profile picture changed successfully.');
      queryClient.setQueryData(['userProfile', login], (old: any) => {
		const updated = old ? { ...old, customAvatar: data.avatarUrl } : old;
		return updated;
	  })
    },
	 onError: (error: Error) => {
        toast.error(error.message || 'Failed to change profile picture.');
        },
  })
}

export function useActiveUsersByProject(username: string | null, projectName: string) {
	return useQuery({
		queryKey: ['activeUsers', username, projectName],
		queryFn: () => fetchActiveUsersByProject(username!, projectName),
		enabled: !!username, // don't fire the request at all when there's no real user
		retry: false,
		select: (users) => users.map(normalizeProfile),
	});
}

export function useUpdateProfile(userId: number, login: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { days: string[]; location: string }) =>
			updateUserProfile(userId, data),
		onSuccess: () => {
      toast.success('Information saved successfully!');
			queryClient.invalidateQueries({ queryKey: ["userProfile", login] });
		},
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save information.');
        },
	});
}
