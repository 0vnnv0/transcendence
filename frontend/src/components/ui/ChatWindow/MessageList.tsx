import { useState, useEffect } from "react";
import { socket } from '../../../services/socket';

interface Message {
	id: number;
	content: string;
	senderId: number;
	sender: {
		id: number;
		intraName: string;
	}
}

interface MessageListProps {
	chatId: number;
}
const MessageList: React.FC<MessageListProps> = ({ chatId }) => {
	const [messages, setMessages] = useState<Message[]>([]);
	
	useEffect(() => {
		const handleNewMessage = (newMessage: Message) => {
			console.log("Neue Nachricht empfangen:", newMessage);
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		};

		socket.on("new_message", handleNewMessage);
		return () => {
			socket.off("new_message", handleNewMessage);
		};
	}, []);
 
 return (
 	<div className="flex-1 bg-gray-50 overflow-y-auto p-4 pb-10">
		{messages.length === 0 ? (
			<p className="text-gray-400 text-center mt-10">Start a conversation</p>
		) : (
			messages.map((msg) => (
				<div key={msg.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 w-fit max-w-[70%]">
					<span className="text-xs text-gray-400 font-bold mb-1 block">
                            {msg.sender.intraName}
                    </span>
                    <p className="text-black">{msg.content}</p>
					</div>	
			))
		)}
    </div>
 );
}

export default MessageList;