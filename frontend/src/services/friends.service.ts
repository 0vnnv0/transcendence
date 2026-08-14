import type { Friends } from "../types/friends";

export const fetchAllFriends = async (): Promise<Friends[]> => {
  const response = await fetch(`/api/friends`);
  
  if (!response.ok) {
    throw new Error('Error trying to load friends');
  }
  
  return response.json();
};

export const sendFriendRequest = async (targetUserId: number): Promise<void> => {
    const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${token}` // Falls ihr JWT nutzt
        },
        body: JSON.stringify({ targetUserId }), 
    });

    if (!response.ok) {
        throw new Error('Failed to send friend request');
    }
    };

export const acceptFriendRequest = async (senderId: number): Promise<void> => {
    const response = await fetch('/api/friends/request', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId }), 
    });

    if (!response.ok) {
        throw new Error('Failed to accept friend request');
    }
};

export const fetchRequestedFriends = async (): Promise<Friends[]> => {
  const response = await fetch(`/api/friends/requests`);
  
  if (!response.ok) {
    throw new Error('Error trying to load your friend requests');
  }
  
  return response.json();
};