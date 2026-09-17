import React from "react";
import { useParams, useNavigate } from 'react-router-dom'; 
import type { ChatUser } from "../../../types/chat";

interface ChatHeaderProps {
    otherUser?: ChatUser;
	isLoading?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ otherUser, isLoading }) => {
    const navigate = useNavigate();

    if (isLoading || !otherUser) {
        return <div className="p-4 border-b border-gray-200 h-[73px] animate-pulse bg-purple/55" />;
    }

    return (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <img 
                    src={otherUser.avatarUrl}
                    alt={otherUser.intraName}
                    className="size-15 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/users/${otherUser.intraName}`)}
                />
                <div 
                    className="cursor-pointer"
                    onClick={() => navigate(`/users/${otherUser.intraName}`)}
                >
                    <h2 className="font-[Gasoek_One] text-4xl">{otherUser.intraName}</h2>
                    <p className="text-sm text-gray-500">Offline</p>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader;