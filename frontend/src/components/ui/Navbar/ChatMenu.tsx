import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentChats } from '../../../hooks/useChat'; // Pfad anpassen
import { NewChatModal } from '../ChatWindow/NewChatModal';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../../../services/socket';

function ChatMenu() {
    const navigate = useNavigate();
	const { onlineUserIds } = useSocket();
    const [isChatsOpen, setIsChatsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { userId } = useAuth();

    const { data: recentChats, isLoading, isError } = useRecentChats(userId as number);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket) return;

		const handleSidebarUpdate = (data: { chatId: number; chat?: any; updatedAt?: string }) => {
			console.log("➡️ [SIDEBAR] Update received:", data);

			queryClient.invalidateQueries({ queryKey: ['recentChats', userId] });
		};

		socket.on('sidebar_update', handleSidebarUpdate);

		return () => {
			socket.off('sidebar_update', handleSidebarUpdate);
		};
	}, [socket, queryClient, userId]);

    let chatIcon = "/chat_closed.svg";
    if (isChatsOpen) {
        chatIcon = "/chat_open.svg";
    }

    const handleCreateChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
        console.log("Neuen Chat starten!");
    }

    let chatListContent = null;

    if (isLoading) {
        chatListContent = <div className="text-gray-400 text-sm">Loading chats</div>;
    } else if (isError) {
        chatListContent = <div className="text-red-500 text-sm">Error trying to load chats</div>;
    } else if (!recentChats || recentChats.length === 0) {
        chatListContent = <div className="text-gray-400 text-sm">Start a conversation!</div>;
    } else {
        const top5Chats = recentChats.slice(0, 5);
        
        chatListContent = top5Chats.map((chat) => {
            const otherUser = chat.users.find(u => u.id !== userId);

            const displayName = otherUser?.intraName || "Unbekannt";
            const avatarSrc = otherUser?.customAvatar || otherUser?.avatarUrl || "/default-avatar.png";
            const isOnline = otherUser ? onlineUserIds.includes(otherUser.id) : false;

            return (
                <li
                    key={chat.id}
                    onClick={() => navigate(`/chat/${chat.id}`)} 
                    className="text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-500/65 hover:rounded-md hover:scale-105 transition-all py-1"
                >
                    <div className="relative inline-block shrink-0">
                        <img 
                            src={avatarSrc} 
                            className="h-6 w-6 rounded-md object-cover"
                            alt={displayName}
                        />
                        <span
                            className={`
                                absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black
                                ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
                            `}
                            aria-label={isOnline ? 'online' : 'offline'}
                        />
                    </div>
                    <span className="truncate">{displayName}</span>
                </li>
            );
        });
    }

    return (
        <>
            <li className="flex flex-col mt-30 w-full gap-1">
                <div className="w-full flex items-center justify-between font-kyiv text-base text-white">
                    <button 
                        className="flex flex-1 items-center gap-1 hover:bg-gray-500/60 hover:rounded-md hover:scale-110 transition-all cursor-pointer text-left"
                        onClick={() => setIsChatsOpen(!isChatsOpen)} 
                    >
                        <img src={chatIcon} alt="Chat Icon" />
                        <img src="/chat.svg" alt="Chat" />
                        <span className="my-auto">Chats</span>
                    </button>
                    <button
                        onClick={handleCreateChat}
                        className="p-1.5 ml-2 hover:scale-110 active:scale-95 transition-all cursor-pointer flex justify-center group"
                        title="Start new chat"
                    >
                        <img src="/plus.svg" alt="new chat" className="group-hover:brightness-90" />
                    </button>
                </div>
                
                {isChatsOpen && (
                    <ul className="flex flex-col gap-1 pl-8 text-white font-kyiv">
                        {chatListContent}
                    </ul>
                )}
            </li>

            <NewChatModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                currentUserId={userId as number}
            />
        </>
    );
}

export default ChatMenu;