import React from 'react';
import { useParams } from 'react-router-dom';
import { useChatMessages } from '../../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader'; 
import { socket } from '../../../services/socket'; 
import { useAuth } from '../../context/AuthContext';

import { useEffect } from 'react'; //junruh

const ChatWindow: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const parsedChatId = parseInt(chatId || '0', 10);
    
    const { userId: currentUserId } = useAuth(); 

	//junruh: manually joining sockets in case of new chats
	useEffect(() => {
		if (!socket) return;
	  
		const token = localStorage.getItem('token');

		// Attach token dynamically to socket auth payload
		socket.auth = {
			token: token ? `Bearer ${token}` : ''
		};
		// 1. Force connection if disconnected
		if (!socket.connected) {
		  console.log("🔌 Attempting socket connection...");
		  socket.connect();
		}
	  
		// 2. Join the chat room for live updates
		if (parsedChatId) {
		  socket.emit('join_chat_room', { chatId: parsedChatId });
		}
	  
		// Debug listeners
		const onConnect = () => console.log("✅ Socket connected successfully! ID:", socket.id);
		const onConnectError = (err: Error) => console.error("❌ Socket connection error:", err.message);
	  
		socket.on('connect', onConnect);
		socket.on('connect_error', onConnectError);
	  
		return () => {
		  socket.off('connect', onConnect);
		  socket.off('connect_error', onConnectError);
		};
	  }, [socket, parsedChatId]);
	//end of junruh

    if (!currentUserId) {
        return <div className="text-purple">Loading user...</div>;
    }
    const { data, isLoading, isError } = useChatMessages(parsedChatId, currentUserId, socket);
	const otherUser = data?.participants.find(u => u.id !== currentUserId);

	//junruh: added debug statements and reconnect
    const handleSendMessage = (content: string) => {
		console.log("1. Send button clicked. Content:", content);

		if (!socket) {
			console.error("Socket object is null");
			return;
		}

		// If socket disconnected, try connecting and then emit
		if (!socket.connected) {
			console.warn("Socket was disconnected. Reconnecting...");
			socket.connect();
		}

		console.log("2. Emitting send_message to backend...");
        socket.emit('send_message', {
            chatId: parsedChatId,
            senderId: currentUserId,
            content: content
        });
    };

    let mainContent = null;

    if (isLoading) {
        mainContent = (
            <div className="flex-1 flex justify-center items-center text-purple-500 font-kyiv">
                Loading messages...
            </div>
        );
    } else if (isError) {
        mainContent = (
            <div className="flex-1 flex justify-center items-center text-red-500 font-kyiv">
                Error loading chat history.
            </div>
        );
    } else if (!data || data.messages.length === 0) {
        mainContent = (
            <div className="flex-1 flex justify-center items-center text-gray-500 font-kyiv">
                No messages yet. Say hi!
            </div>
        );
    } else {
        mainContent = (
            <MessageList 
                messages={data.messages} 
                currentUserId={currentUserId} 
            />
        );
    }

    return (
        <div className="flex flex-col h-screen bg-purple/50 w-full">
            <ChatHeader otherUser={otherUser} isLoading={isLoading} />

            {mainContent}

            <MessageInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading || isError} 
            />
        </div>
    );
};

export default ChatWindow;