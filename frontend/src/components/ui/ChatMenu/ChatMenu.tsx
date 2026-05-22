import { useState } from 'react';

function ChatMenu() {
	const [isChatsOpen, setIsChatsOpen] = useState(false);
	let chatIcon = "/chat_closed.svg";

	if (isChatsOpen) {
		chatIcon = "/chat_open.svg";
	}

	return (
		<li className="flex flex-col mt-30 w-full gap-1">
			<button 
				className="w-full flex items-center justify-between font-kyiv text-bg text-white hover:bg-gray-500/60 hover:rounded-md hover:scale-110 transition-all cursor-pointer"
				onClick={() => setIsChatsOpen(!isChatsOpen)} 
      		>
			<span className="flex items-center my-auto gap-1">
			<img src={chatIcon} alt="Chat Icon" />
			<img src="/chat.svg" />
			Chats
			</span>
			<img src="/plus.svg"/>
			</button>
			{isChatsOpen && (
				<ul className="flex flex-col gap-1 pl-8 text-white font-kyiv">
					<li className="flex item-center gap-2 cursor-pointer hover:bg-gray-500/60 hover:rounded-md hover:scale-110">
						<div className="relative inline-block">
							<img src="/profile.jpg"
								className="h-6 w-6 rounded-md object-cover transition-all"/>
							<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></span>
						</div>
					hreusing
					</li>
					<li className="flex item-center gap-2 cursor-pointer hover:bg-gray-500/60 hover:rounded-md hover:scale-110">
						<div className="relative inline-block">
							<img src="/profile.jpg"
								className="h-6 w-6 rounded-md object-cover transition-all"/>
							<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-500 border-2 border-black rounded-full"></span>
						</div>
					junruh
					</li>
				</ul>
			)}
		</li>
	)
}

export default ChatMenu;