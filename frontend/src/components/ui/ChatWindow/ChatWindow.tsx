import React from 'react';
import { useParams } from 'react-router-dom';
import { useChatMessages } from '../../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader'; 
import { socket } from '../../../services/socket'; 
import { useAuth } from '../../context/AuthContext';

const ChatWindow: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const parsedChatId = parseInt(chatId || '0', 10);
    
    const { userId: currentUserId } = useAuth(); 
    if (!currentUserId) {
        return <div className="text-purple">Loading user...</div>;
    }
    const { data, isLoading, isError } = useChatMessages(parsedChatId, currentUserId, socket);

    const handleSendMessage = (content: string) => {
        if (!socket) return;
        
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
        <div className="flex flex-col h-screen bg-gray-900 w-full">
            <ChatHeader chatId={parsedChatId} />

            {mainContent}

            <MessageInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading || isError} 
            />
        </div>
    );
};

export default ChatWindow;