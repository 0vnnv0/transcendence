// services/chat.service.ts
import type { LoadMessagesResponse, CreateChatResponse } from '../types/chat';
import type { ChatPreview } from '../types/chat';

//junruh: replaced: 
// export const fetchChatHistory = async (chatId: number, userId: number): Promise<LoadMessagesResponse> => {
//   const response = await fetch(`/api/chat/${chatId}?userId=${userId}`);
  
//   if (!response.ok) {
//     throw new Error('Error trying to load message');
//   }
  
//   return response.json();
// };

//junruh: changed fetch call to send jwt token with request, otherwise we cant authenticate
export const fetchChatHistory = async (chatId: number): Promise<LoadMessagesResponse> => {
	const token = localStorage.getItem('token');
  
	const response = await fetch(`/api/chat/${chatId}`, {
	  method: 'GET',
	  headers: {
		'Content-Type': 'application/json',
		'Authorization': token ? `Bearer ${token}` : '', 
	  },
	});
  
	if (!response.ok) {
	  throw new Error('Error trying to load messages');
	}
  
	return response.json();
  };

//junruh: also added authentication here
export const createNewChat = async (currentUserId: number, targetUserId: number): Promise<CreateChatResponse> => {
	console.log("Sende an Backend - currentUserId:", currentUserId, "targetUserId:", targetUserId);	
	const token = localStorage.getItem('token');

	const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
			'Authorization': token ? `Bearer ${token}` : '', 
        },
        body: JSON.stringify({ currentUserId: currentUserId, targetUserId: targetUserId }),
    });

    if (!response.ok) {
        throw new Error('Fehler beim Erstellen des Chats');
    }

    return response.json();
};
//junruh: replaced this next bit bc we need jwt:
// export const fetchRecentChats = async (userId: number): Promise<ChatPreview[]> => {
//     const response = await fetch(`/api/chats?userId=${userId}`);
//     if (!response.ok) {
//         throw new Error('Fehler beim Laden der letzten Chats');
//     }
//     return response.json();
// };

export const fetchRecentChats = async (): Promise<ChatPreview[]> => {
    // 1. Get token from storage
    const token = localStorage.getItem('token'); 

    // 2. Pass Authorization header
    const response = await fetch(`/api/chats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error('Fehler beim Laden der letzten Chats');
    }
    return response.json();
};