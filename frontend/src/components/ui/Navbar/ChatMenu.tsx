import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentChats } from '../../../hooks/useChat'; // Pfad anpassen
import { NewChatModal } from '../ChatWindow/NewChatModal';

function ChatMenu() {
    const navigate = useNavigate();
    const [isChatsOpen, setIsChatsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // PLATZHALTER: Die eigene ID (kommt später aus Auth)
    const currentUserId = 1; 

    // Echte Daten aus dem Backend laden!
    const { data: recentChats, isLoading, isError } = useRecentChats(currentUserId);

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
            const otherUser = chat.users.find(u => u.id !== currentUserId) 
                || { intraName: "Unbekannt", id: 0 };

            return (
                <li
                    key={chat.id}
                    onClick={() => navigate(`/chat/${chat.id}`)} 
                    className="flex item-center gap-2 cursor-pointer hover:bg-gray-500/60 hover:rounded-md hover:scale-110"
                >
                    <div className="relative inline-block">
                        <img 
                            src="/profile.jpg" 
                            className="h-6 w-6 rounded-md object-cover transition-all"
                            alt={otherUser.intraName}
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-black rounded-full bg-gray-500"></span>
                    </div>
                    {otherUser.intraName}
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

            {/* NEU: Das Modal einbinden */}
            <NewChatModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                currentUserId={currentUserId}
            />
        </>
    );
}

export default ChatMenu;