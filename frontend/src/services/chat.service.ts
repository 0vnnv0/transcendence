// services/chat.service.ts
import type { LoadMessagesResponse, CreateChatResponse } from '../types/chat';
import type { ChatPreview } from '../types/chat';

export const fetchChatHistory = async (chatId: number, userId: number): Promise<LoadMessagesResponse> => {
  const response = await fetch(`/api/chat/${chatId}?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error('Error trying to load message');
  }
  
  return response.json();
};

export const createNewChat = async (currentUserId: number, targetUserId: number): Promise<CreateChatResponse> => {
console.log("Sende an Backend - currentUserId:", currentUserId, "targetUserId:", targetUserId);	const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId, targetUserId: targetUserId }),
    });

    if (!response.ok) {
        throw new Error('Fehler beim Erstellen des Chats');
    }

    return response.json();
};

export const fetchRecentChats = async (userId: number): Promise<ChatPreview[]> => {
    const response = await fetch(`/api/chats?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Fehler beim Laden der letzten Chats');
    }
    return response.json();
};