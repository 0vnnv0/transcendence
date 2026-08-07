import React from 'react';
import { useParams } from 'react-router-dom';
import { useChatMessages } from '../../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader'; // Deine bestehende Header-Komponente
// Importiere deinen Socket (z.B. aus einem Context oder einer Service-Datei)
import { socket } from '../../../services/socket'; 

const ChatWindow: React.FC = () => {
    // 1. IDs aus URL und Auth holen
    const { chatId } = useParams<{ chatId: string }>();
    const parsedChatId = parseInt(chatId || '0', 10);
    
    // PLATZHALTER: Die eigene ID (kommt später aus AuthContext)
    const currentUserId = 1;

    // 2. Deinen perfekten Hook aufrufen
    const { 
        data, 
        isLoading, 
        isError 
    } = useChatMessages(parsedChatId, currentUserId, socket);

    // 3. Sende-Logik (UI sendet Text -> Window leitet es an Socket weiter)
    const handleSendMessage = (content: string) => {
        if (!socket) return;
        
        // Das Event 'send_message' muss exakt so in deinem Fastify-Backend existieren!
        socket.emit('send_message', {
            chatId: parsedChatId,
            senderId: currentUserId,
            content: content
        });
    };

    // --------------------------------------------------------
    // Sauberes bedingtes Rendern des Hauptinhalts
    // --------------------------------------------------------
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
        // Daten sind da! Liste rendern.
        mainContent = (
            <MessageList 
                messages={data.messages} 
                currentUserId={currentUserId} 
            />
        );
    }

    // --------------------------------------------------------
    // Das finale Gerüst
    // --------------------------------------------------------
    return (
        <div className="flex flex-col h-screen bg-gray-900 w-full">
            {/* Header wird immer gerendert */}
            <ChatHeader chatId={parsedChatId} />

            {/* Hier wird dynamisch der Content reingeladen */}
            {mainContent}

            {/* Input wird nur aktiviert, wenn der Chat geladen ist */}
            <MessageInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading || isError} 
            />
        </div>
    );
};

export default ChatWindow;