import type { Friends } from "../types/friends";

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
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

    const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ targetUserId }), 
    });

    if (!response.ok) {
        throw new Error('Failed to send friend request');
    }
};

export const acceptFriendRequest = async (senderId: number): Promise<void> => {
    const response = await fetch('/api/friends/request', {
        method: 'PUT',
        headers: getAuthHeaders(),
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
