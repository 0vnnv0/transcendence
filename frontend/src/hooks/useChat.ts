// hooks/useChat.ts
import { useEffect } from 'react';
import { useMutation, useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChatHistory } from '../services/chat.service';
import type { ChatMessage, LoadMessagesResponse } from '../types/chat';
import type { Socket } from 'socket.io-client';
import { createNewChat, fetchRecentChats } from '../services/chat.service';
import toast from 'react-hot-toast';

export const useChatMessages = (chatId: number, userId: number | null, socket: Socket | null) => {
	const queryClient = useQueryClient();
	const queryKey = ['chat', Number(chatId), 'messages'];

	//junruh: changed this to use pagination via reacts infinite query, old function w/o pagination is below
	const queryInfo = useInfiniteQuery<LoadMessagesResponse, Error>({
	  queryKey,
	  queryFn: ({ pageParam }) => fetchChatHistory(chatId, pageParam as number | undefined),
	  initialPageParam: undefined,
	  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
	  enabled: !!chatId && !!userId,
	});
  
	useEffect(() => {
	  if (!socket) return;
  
	  const handleNewMessage = (newMessage: ChatMessage) => {
		if (Number(newMessage.chatId) !== Number(chatId)) return;
  
		queryClient.setQueryData<InfiniteData<LoadMessagesResponse>>(queryKey, (oldData) => {
		  if (!oldData) return oldData;
  
		  const newPages = [...oldData.pages];
		  const lastPageIndex = newPages.length - 1;
  
		  newPages[lastPageIndex] = {
			...newPages[lastPageIndex],
			messages: [...newPages[lastPageIndex].messages, newMessage],
		  };
  
		  return {
			...oldData,
			pages: newPages,
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
      toast.success('Chat created successfully');  
      
      const finalChatId = response.chatId;
      
      if (!finalChatId) {
         console.error("FEHLER: Das Backend hat keine ID zurückgegeben!");
         return;
      }
      
      navigate(`/chat/${finalChatId}`);
    },
    onError: () => {
      toast.error('Error trying to create chat');
    }
  });
};

export const useRecentChats = (userId: number) => {
    return useQuery({
        queryKey: ['recentChats', userId],
        queryFn: () => fetchRecentChats(),
        enabled: !!userId, 
    });
};
