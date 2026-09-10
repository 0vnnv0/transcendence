import { fetchAllUsers, fetchUserProfile, fetchUsersBySearch, getUploadUrl } from '../services/user.service';
import type { ChatUser } from '../types/chat'
import type { FullUserProfile } from '../types/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchActiveUsersByProject, updateUserProfile } from '../services/user.service';
import { toast } from 'react-hot-toast';
import { uploadAvatar } from '../services/user.service';

export function useUserProfile(login: string | null) {
  return useQuery({
    queryKey: ['userProfile', login], 
    queryFn: () => fetchUserProfile(login!),
    enabled: !!login,
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

export function useUploadAvatar(userKey: string | number) {
	const queryClient = useQueryClient();

	// return useMutation({
	// 	mutationFn: (file: File) => uploadAvatar(file),
	// 	onSuccess: () => {
	// 		// invalidate whatever query holds the user/profile data
	// 		// so the new avatar URL gets picked up
	// 		queryClient.invalidateQueries({ queryKey: ['user', userId] });
	// 	},
	// });
  return useMutation({
    mutationFn: (file: File) => {
      if (!userKey) throw new Error('No user')
      return uploadAvatar(file)
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
      toast.success('Profile picture changed successfully.');
      queryClient.setQueryData(['userProfile', userKey], (old: any) =>
        old ? { ...old, avatarUrl: data.avatarUrl } : old
      )
    },
	 onError: (error: Error) => {
        toast.error(error.message || 'Failed to change profile picture.');
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

// export function useUpdateAvatar(userKey: string | null) {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (file: File) => {
//       if (!userKey) throw new Error('No user')
//       return updateAvatar(userKey, file)
//     },

//     // // For Live Updates (on my own browser)
// 	// // Fires immediately when .mutate() is called — before the network request resolves
//     // onMutate: async (file: File) => {
//     //   // Stop any in-flight refetches so they don't overwrite our optimistic data
//     //   await queryClient.cancelQueries({ queryKey: ['userProfile', userKey] })
//     //   // Snapshot the current cache so we can roll back on error
//     //   const previousProfile = queryClient.getQueryData(['userProfile', userKey])
//     //   // Create a local, temporary URL for the picked file
//     //   const previewUrl = URL.createObjectURL(file)
//     //   // Optimistically write it into the cache — UI updates instantly
//     //   queryClient.setQueryData(['userProfile', userKey], (old: any) =>
//     //     old ? { ...old, avatarUrl: previewUrl } : old
//     //   )
//     //   // Passed to onError / onSettled as `context`
//     //   return { previousProfile, previewUrl }
//     // },

//     // Real server response arrived and succeeded — replace preview with the real URL
//     onSuccess: (data) => {
//       toast.success('Profile picture changed successfully.');
//       queryClient.setQueryData(['userProfile', userKey], (old: any) =>
//         old ? { ...old, avatarUrl: data.avatarUrl } : old
//       )
//     },

//     // // Server call failed — roll back to the snapshot
//     // onError: (_err, _file, context) => {
//     //   if (context?.previousProfile) {
//     //     queryClient.setQueryData(['userProfile', userKey], context.previousProfile)
//     //   }
//     // },

//     // // Runs after either success or error — cleanup + safety net
//     // onSettled: (_data, _err, _file, context) => {
//     //   if (context?.previewUrl) {
//     //     URL.revokeObjectURL(context.previewUrl) // free the blob URL from memory
//     //   }
//     //   // Optional: refetch to guarantee we're in sync with the DB, even on success
//     //   queryClient.invalidateQueries({ queryKey: ['userProfile', userKey] })
//     // },
//   })
// }

export function useActiveUsersByProject(username: string | null, projectName: string) {
	return useQuery({
		queryKey: ['activeUsers', username, projectName],
		queryFn: () => fetchActiveUsersByProject(username!, projectName),
		enabled: !!username, // don't fire the request at all when there's no real user
		retry: false,
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
