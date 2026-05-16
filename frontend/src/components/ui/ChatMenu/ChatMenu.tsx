import { useState } from 'react';

function ChatMenu() {
	const [isChatsOpen, setIsChatsOpen] = useState(false);

	return (
		<li className="flex flex-col my-auto w-full">
			<button 
				className="w-full flex items-center justify-between font-kyiv text-bg text-white hover:bg-gray-500/60 hover:rounded-md hover:scale-110 transition-all cursor-pointer"
				onClick={() => setIsChatsOpen(!isChatsOpen)} 
      		>
			<span className="flex items-center my-auto gap-2">
			<img src="chat_closed.svg" />
			<img src="chat.svg" />
			Chats
			</span>
			<img src="plus.svg"/>
			</button>
		</li>
	)
}

export default ChatMenu;