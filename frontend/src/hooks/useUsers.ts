import { fetchAllUsers, fetchUserProfile, fetchUsersBySearch } from '../services/user.service';
import type { ChatUser } from '../types/chat'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvatar } from '../services/user.service';

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


export function useUpdateAvatar(userKey: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => {
      if (!userKey) throw new Error('No user')
      return updateAvatar(userKey, file)
    },

    // // For Live Updates (on my own browser)
	// // Fires immediately when .mutate() is called — before the network request resolves
    // onMutate: async (file: File) => {
    //   // Stop any in-flight refetches so they don't overwrite our optimistic data
    //   await queryClient.cancelQueries({ queryKey: ['userProfile', userKey] })
    //   // Snapshot the current cache so we can roll back on error
    //   const previousProfile = queryClient.getQueryData(['userProfile', userKey])
    //   // Create a local, temporary URL for the picked file
    //   const previewUrl = URL.createObjectURL(file)
    //   // Optimistically write it into the cache — UI updates instantly
    //   queryClient.setQueryData(['userProfile', userKey], (old: any) =>
    //     old ? { ...old, avatarUrl: previewUrl } : old
    //   )
    //   // Passed to onError / onSettled as `context`
    //   return { previousProfile, previewUrl }
    // },

    // Real server response arrived and succeeded — replace preview with the real URL
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', userKey], (old: any) =>
        old ? { ...old, avatarUrl: data.avatarUrl } : old
      )
    },

    // // Server call failed — roll back to the snapshot
    // onError: (_err, _file, context) => {
    //   if (context?.previousProfile) {
    //     queryClient.setQueryData(['userProfile', userKey], context.previousProfile)
    //   }
    // },

    // // Runs after either success or error — cleanup + safety net
    // onSettled: (_data, _err, _file, context) => {
    //   if (context?.previewUrl) {
    //     URL.revokeObjectURL(context.previewUrl) // free the blob URL from memory
    //   }
    //   // Optional: refetch to guarantee we're in sync with the DB, even on success
    //   queryClient.invalidateQueries({ queryKey: ['userProfile', userKey] })
    // },
  })
}
