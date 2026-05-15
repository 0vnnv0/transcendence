import { useState } from 'react';

function ChatMenu() {
	const [isChatsOpen, setIsChatsOpen] = useState(false);

	return (
		<li className="w-full">
			<button 
				className="w-full flex items-center justify-between gap-2 font-kyiv text-bg text-white  hover:bg-gray-500/60 hover:rounded-md hover:scale-110 transition-all cursor-pointer"
				onClick={() => setIsChatsOpen(!isChatsOpen)} 
      		>
			<span className="flex items-center gap-2">
			Chats
			<img src="chat.svg"/>
			</span>
			</button>
		</li>
	)
}

export default ChatMenu;