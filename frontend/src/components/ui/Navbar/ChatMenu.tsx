import { useState } from 'react';
import { useNavigate } from 'react-router-dom'


function ChatMenu() {
	const navigate = useNavigate();
	const [isChatsOpen, setIsChatsOpen] = useState(false);
	const [activeChats, setActiveChats] = useState([
        { id: 101, username: "hreusing", isOnline: true, avatar: "/profile.jpg" },
        { id: 102, username: "junruh", isOnline: false, avatar: "/profile.jpg" },
        { id: 103, username: "caruso", isOnline: true, avatar: "/profile.jpg" }
	]);

	let chatIcon = "/chat_closed.svg";
	if (isChatsOpen) {
		chatIcon = "/chat_open.svg";
	}

	const handleCreateChat = (e: React.MouseEvent) => {
		e.stopPropagation();
		console.log("Neuen Chat starten!");
	}

	return (
		<li className="flex flex-col mt-30 w-full gap-1">
			<div className="w-full flex items-center justify-between font kyiv text-bg text-white">
				<button 
					className="flex flex-1 items-center gap-1 hover:bg-gray-500/60 hover:rounded-md hover:scale-110 transition-all cursor-pointer text-left"
					onClick={() => setIsChatsOpen(!isChatsOpen)} 
				>
				<img src={chatIcon} alt="Chat Icon" />
				<img src="/chat.svg" />
				<span className="my-auto">Chats</span>
				</button>
				<button
					onClick={handleCreateChat}
					className="p-1.5 ml-2 hover:scale-115 active:scale-95 transition-all cursor-pointer flex justify-center group"
					title="Start new chat"
				>
					<img src="/plus.svg"
						 alt="new chat"
						className="group-hover:brightness-900"
					/>
				</button>
			</div>
			{isChatsOpen && (
				<ul className="flex flex-col gap-1 pl-8 text-white font-kyiv">
					{activeChats.map((chat) => (
					<li
						key={chat.id}
						onClick={() => navigate(`/chat/${chat.id}`)} 
					className="flex item-center gap-2 cursor-pointer hover:bg-gray-500/60 hover:rounded-md hover:scale-110">
						<div className="relative inline-block">
							<img 
								src={chat.avatar}
								className="h-6 w-6 rounded-md object-cover transition-all"
								alt={chat.username}
							/>
							<span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-black rounded-full
							${chat.isOnline ? 'bg-green-500' : 'bg-gray-500'}
							`}></span>
						</div>
						{chat.username}
					</li>
					))}
				</ul>
			)}
		</li>
	)
}

export default ChatMenu;