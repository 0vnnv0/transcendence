import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchAllFriends, sendFriendRequest, acceptFriendRequest, fetchRequestedFriends, removeFriendOrRequest  } from '../services/friends.service';
import toast from 'react-hot-toast';

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
        onSuccess: () => {
            toast.success('Friendrequest sent!');
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        },
        onError: (error: any) => {
            console.error("Fehler beim Senden der Anfrage:", error);
            toast.error(error?.response?.data?.message || 'Error trying to sent friendrequest.');
        }
    });
}

export function useAcceptFriend() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (senderUserId: number) => acceptFriendRequest(senderUserId),
        onSuccess: () => {
            toast.success('Friendrequest accepted!');
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); 
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
        onError: (error: any) => {
            console.error("Error accepting friend request:", error);
            toast.error(error?.response?.data?.message || 'Error trying to acceppt friend');
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
            toast.success('You are no longer friends.');
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); 
        },
        onError: (error: any) => {
            console.error("Error removing friend:", error);
            toast.error(error?.response?.data?.message || 'Error trying to remove friendstatus.');
        }
    });
}