// services/chat.service.ts
import type { LoadMessagesResponse, CreateChatResponse } from '../types/chat';
import type { ChatPreview } from '../types/chat';

export const fetchChatHistory = async (chatId: number, cursorId?: number): Promise<LoadMessagesResponse> => {
	const token = localStorage.getItem('token');
	
	const url = cursorId 
    ? `/api/chat/${chatId}?cursorId=${cursorId}` 
    : `/api/chat/${chatId}`;

	const response = await fetch(url, {
	  method: 'GET',
	  headers: {
		'Content-Type': 'application/json',
		'Authorization': token ? `Bearer ${token}` : '', 
	  },
	});

	if (!response.ok) {
		const error = new Error("Unable to load chat history") as Error & {
			status?: number;
		};

		error.status = response.status;

		throw error;
	}
  
	return response.json();
  };

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
    const data = await response.json();
    return data.map((chat: any) => ({
        ...chat,
        users: chat.users.map((u: any) => ({ ...u, intraName: u.login })),
    }));
};
