// components/Chat/MessageList.tsx
import { useChatMessages } from '../../../hooks/useChat';
import type { Socket } from 'socket.io-client';

interface MessageListProps {
  chatId: number;
  userId: number;
  socket: Socket | null;
}

export function MessageList({ chatId, userId, socket }: MessageListProps) {
  const { data, isLoading, isError } = useChatMessages(chatId, userId, socket);

  let content = null;

  if (isLoading) {
    content = <div className="p-4 text-gray-500 text-center">Lade Nachrichten...</div>;
  } else if (isError) {
    content = <div className="p-4 text-red-500 text-center">Fehler beim Laden des Chats.</div>;
  } else if (!data || data.messages.length === 0) {
    content = <div className="p-4 text-gray-500 text-center">Noch keine Nachrichten. Schreib das erste "Hallo"!</div>;
  } else {
    content = (
      <div className="flex flex-col gap-3 p-4">
        {data.messages.map((msg) => {
          const isOwnMessage = msg.senderId === userId;
          
          return (
            <div 
              key={msg.id} 
              className={`max-w-[70%] p-3 rounded-lg ${
                isOwnMessage 
                  ? 'bg-blue-500 text-white self-end rounded-br-none' 
                  : 'bg-gray-200 text-black self-start rounded-bl-none'
              }`}
            >
              <div className="text-xs opacity-75 mb-1 font-semibold">
                {msg.sender.intraName}
              </div>
              <div>{msg.content}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {content}
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { socket } from '../../../services/socket';

// interface Message {
// 	id: number;
// 	content: string;
// 	senderId: number;
// 	sender: {
// 		id: number;
// 		intraName: string;
// 	}
// }

// interface MessageListProps {
// 	chatId: number;
// }
// const MessageList: React.FC<MessageListProps> = ({ chatId }) => {
// 	const [messages, setMessages] = useState<Message[]>([]);
	
// 	useEffect(() => {
// 		const handleNewMessage = (newMessage: Message) => {
// 			console.log("Neue Nachricht empfangen:", newMessage);
// 			setMessages((prevMessages) => [...prevMessages, newMessage]);
// 		};

// 		socket.on("new_message", handleNewMessage);
// 		return () => {
// 			socket.off("new_message", handleNewMessage);
// 		};
// 	}, []);
 
//  return (
//  	<div className="flex-1 bg-gray-50 overflow-y-auto p-4 pb-10">
// 		{messages.length === 0 ? (
// 			<p className="text-gray-400 text-center mt-10">Start a conversation</p>
// 		) : (
// 			messages.map((msg) => (
// 				<div key={msg.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 w-fit max-w-[70%]">
// 					<span className="text-xs text-gray-400 font-bold mb-1 block">
//                             {msg.sender.intraName}
//                     </span>
//                     <p className="text-black">{msg.content}</p>
// 					</div>	
// 			))
// 		)}
//     </div>
//  );
// }

export default MessageList;