import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchAllFriends, sendFriendRequest, acceptFriendRequest, fetchRequestedFriends, removeFriendOrRequest  } from '../services/friends.service';

export function useFriends() {
	return useQuery({
		queryKey: ['friends'],
		queryFn: fetchAllFriends,
	});
}

export function useAddFriend() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (targetUserId: number) => sendFriendRequest(targetUserId),
        onSuccess: async () => {
            console.log("Friend request sent successfully! Forcing reload...");
            
            await queryClient.invalidateQueries({ 
                queryKey: ['userProfile'], 
                exact: false 
            });

            await queryClient.refetchQueries({ 
                queryKey: ['userProfile'],
                type: 'active' 
            });
            
            await queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        }
    });
}

export function useAcceptFriend() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (senderUserId: number) => acceptFriendRequest(senderUserId),
        onSuccess: (_, senderUserId) => {
            console.log("Friend request accepted!");
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); 
        },
        onError: (error) => {
            console.error("Error accepting friend request:", error);
        }
    });
}

export function useFriendRequests() {
    return useQuery({
        queryKey: ['friendRequests'],
        queryFn: fetchRequestedFriends,
        staleTime: 1000 * 45,
    });
}

export function useRemoveFriend() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (friendshipId: number) => removeFriendOrRequest(friendshipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
            queryClient.invalidateQueries({ queryKey: ['allFriends'] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); 
        }
    });
}