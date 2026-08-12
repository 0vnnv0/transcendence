import { useQuery } from '@tanstack/react-query';
import { fetchAllFriends } from '../services/friends.service';

export function useFriends() {
	return useQuery({
		queryKey: ['friends'],
		queryFn: fetchAllFriends,
	});
}