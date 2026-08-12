import type { Friends } from "../types/friends";

export const fetchAllFriends = async (): Promise<Friends[]> => {
  const response = await fetch(`/api/friends`);
  
  if (!response.ok) {
    throw new Error('Error trying to load friends');
  }
  
  return response.json();
};