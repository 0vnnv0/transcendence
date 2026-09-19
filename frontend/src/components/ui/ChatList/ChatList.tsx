import { NewChatModal } from '../../ui/ChatWindow/NewChatModal';
import { useRecentChats } from '../../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { socket } from '../../../services/socket';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Button from '../Button/Button';


function ChatsList() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { onlineUserIds } = useSocket();
	const { userId } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: recentChats, isLoading, isError } = useRecentChats(userId as number);

	useEffect(() => {
		if (!socket) return;
		const handleNewMessage = () => {
			queryClient.invalidateQueries({ queryKey: ['recentChats', userId] });
		};
		socket.on('new_message', handleNewMessage);
		return () => {
			socket.off('new_message', handleNewMessage);
		};
	}, [queryClient, userId]);

	let chatListContent;

	if (isLoading) {
		chatListContent = <p className="text-gray-400 text-sm">Loading chats...</p>;
	} else if (isError) {
		chatListContent = <p className="text-red-500 text-sm">Error trying to load chats</p>;
	} else if (!recentChats || recentChats.length === 0) {
		chatListContent = <p className="text-gray-400 text-sm">Start a conversation!</p>;
	} else {
		chatListContent = (
			<ul className="flex flex-col gap-1">
				{recentChats.map((chat) => {
					const otherUser = chat.users.find((u) => u.id !== userId);
					const displayName = otherUser?.intraName || 'Unknown';
					const avatarSrc = otherUser?.customAvatar || otherUser?.avatarUrl || '/default-avatar.png';
					const isOnline = otherUser ? onlineUserIds.includes(otherUser.id) : false;

					return (
						<li
							key={chat.id}
							onClick={() => navigate(`/chat/${chat.id}`)}
							className="flex items-center gap-3 cursor-pointer rounded-md px-2 py-2 hover:bg-gray-500/40 active:bg-gray-500/60 transition-colors"
						>
							<div className="relative inline-block shrink-0">
								<img src={avatarSrc} alt={displayName} className="h-10 w-10 rounded-md object-cover" />
								<span
									className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-black ${
										isOnline ? 'bg-green-500' : 'bg-gray-400'
									}`}
									aria-label={isOnline ? 'online' : 'offline'}
								/>
							</div>
							<span className="truncate text-subtitle md:text-paragraph text-black md:text-white">{displayName}</span>
						</li>
					);
				})}
			</ul>
		);
	}

	return (
		<section className="flex min-h-screen bg-cover bg-center bg-no-repeat pb-20">
			<div className="flex-none">
				<Navbar />
			</div>

			<div className="flex flex-col flex-1 w-full gap-6 p-4">
				<div className="flex items-center justify-between gap-4">
					<h1 className="text-title">Chats</h1>
					<Button
						icon="plus"
						onClick={() => setIsModalOpen(true)}
					>New Chat</Button>
				</div>

				{chatListContent}
			</div>

			<NewChatModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                currentUserId={userId as number}
            />
		</section>
	);
}

export default ChatsList;
