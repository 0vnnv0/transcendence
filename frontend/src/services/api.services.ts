import type { User, CreateChatResponse } from '../types';

const API_BASE = '/api';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error('Fehler beim Laden der User');
  }
  return response.json();
};

export const createChat = async (targetUserId: string): Promise<CreateChatResponse> => {
  const response = await fetch(`${API_BASE}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUserId }), 
  });

  if (!response.ok) {
    throw new Error('Chat konnte nicht erstellt werden');
  }
  return response.json();
};