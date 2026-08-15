// hooks/useChat.ts
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChatHistory } from '../services/chat.service';
import type { ChatMessage, LoadMessagesResponse } from '../types/chat';
import type { Socket } from 'socket.io-client';
import { createNewChat, fetchRecentChats } from '../services/chat.service';

export const useChatMessages = (chatId: number, userId: number, socket: Socket | null) => {
  const queryClient = useQueryClient();
  const queryKey = ['chat', chatId, 'messages'];

  const queryInfo = useQuery({
    queryKey,
    queryFn: () => fetchChatHistory(chatId, userId),
    enabled: !!chatId && !!userId, 
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: ChatMessage) => {
      if (newMessage.chatId !== chatId) return;

      queryClient.setQueryData<LoadMessagesResponse>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          messages: [...oldData.messages, newMessage], 
        };
      });
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, chatId, queryClient, queryKey]);

  return queryInfo;
};

export const useStartChat = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { currentUserId: number; targetUserId: number }) => 
      createNewChat(data.currentUserId, data.targetUserId),
    
    
    onSuccess: (response) => {
      console.log("Erfolgreich Chat erstellt! Backend-Antwort:", response);
      
      const finalChatId = response.chatId || response.chatid;
      
      if (!finalChatId) {
         console.error("FEHLER: Das Backend hat keine ID zurückgegeben!");
         return;
      }
      
      navigate(`/chat/${finalChatId}`);
    },
    onError: (error) => {
      console.error("Fehler beim Erstellen des Chats:", error);
    }
  });
};

export const useRecentChats = (userId: number) => {
    return useQuery({
        queryKey: ['recentChats', userId],
        queryFn: () => fetchRecentChats(userId),
        enabled: !!userId, 
    });
};