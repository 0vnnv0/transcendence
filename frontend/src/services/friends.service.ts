import type { Friends } from "../types/friends";

export const getAuthHeaders = () => {
	console.log("Mein Token:", localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token || ''}`,
        // 'Content-Type': 'application/json',
    };
};

export const fetchAllFriends = async (): Promise<Friends[]> => {
  const response = await fetch(`/api/friends`, {
    headers: getAuthHeaders(),
});
  
  if (!response.ok) {
    throw new Error('Error trying to load friends');
  }
  
  return response.json();
};


export const sendFriendRequest = async (targetUserId: number): Promise<void> => {
console.log("Sende Freundschaftsanfrage für targetUserId:", targetUserId);
    const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
			...getAuthHeaders(),
			'Content-Type': 'application/json',
		},
        body: JSON.stringify({ targetUserId }), 
		
    });

    if (!response.ok) {
		const errorData = await response.json();
		console.error("Backend-Fehlergrund:", errorData.error);
        throw new Error('Failed to send friend request');
    }
	return response.json();
};

export const acceptFriendRequest = async (senderId: number): Promise<void> => {
    const response = await fetch('/api/friends/request', {
        method: 'PUT',
        headers: {
			...getAuthHeaders(),
			'Content-Type': 'application/json',
		},
        body: JSON.stringify({ senderId }), 
    });

    if (!response.ok) {
        throw new Error('Failed to accept friend request');
    }
};

export const removeFriendOrRequest = async (targetId: number): Promise<void> => {
    const response = await fetch(`/api/friends/remove/${targetId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
		body: JSON.stringify({ targetId }),
    });

    if (!response.ok) {
        throw new Error('Failed to remove friend or decline request');
    }
};

export const fetchRequestedFriends = async (): Promise<Friends[]> => {
  const response = await fetch(`/api/friends/requests`, {
    headers: getAuthHeaders(),
  }
  );
  
  if (!response.ok) {
    throw new Error('Error trying to load your friend requests');
  }
  
  return response.json();
};
