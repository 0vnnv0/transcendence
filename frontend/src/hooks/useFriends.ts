import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchAllFriends, sendFriendRequest, acceptFriendRequest } from '../services/friends.service';

export function useFriends() {
	return useQuery({
		queryKey: ['friends'],
		queryFn: fetchAllFriends,
	});
}

export function useAddFriend() {
    return useMutation({
        mutationFn: (targetUserId: number) => sendFriendRequest(targetUserId),
        onSuccess: () => {
            console.log("Friend request sent successfully!");
        },
        onError: (error) => {
            console.error("Error sending friend request:", error);
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