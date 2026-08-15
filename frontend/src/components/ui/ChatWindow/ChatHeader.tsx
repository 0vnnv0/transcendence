import React from "react";
import { useParams, useNavigate } from 'react-router-dom'; 

interface ChatHeaderProps {
    chatId: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId }) => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();

    return (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <img 
                    src="/profile.jpg" 
                    alt="user image" 
                    className="size-15 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/${username}`)} // Wohin soll das führen? /users/name?
                />
                <div>
                    <div 
                        className="cursor-pointer"
                        onClick={() => navigate(`/${username}`)}
                    >
                        <h2 className="font-[Gasoek_One] text-4xl">Chat #{chatId}</h2>
                    </div>
                    <p className="text-sm text-gray-500">Offline</p>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader;