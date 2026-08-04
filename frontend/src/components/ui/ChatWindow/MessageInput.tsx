// components/Chat/MessageInput.tsx
import { useState } from 'react';
import type { Socket } from 'socket.io-client';

interface MessageInputProps {
  chatId: number;
  socket: Socket | null;
}

export function MessageInput({ chatId, socket }: MessageInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !socket) return;

    socket.emit('send_message', { chatId, content });
        setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nachricht schreiben..."
        className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500 text-black"
      />
      <button 
        type="submit" 
        disabled={!content.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Senden
      </button>
    </form>
  );
}

// import { useState } from 'react'
// import { socket } from '../../../services/socket'


// interface MessageInputProps {
//     chatId: number;
// }

// const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
//     const [text, setText] = useState("");

// 	const handleSend = (e: React.SyntheticEvent) => {
// 		e.preventDefault();
// 		if (text.trim() === "")
// 			return;

// 		socket.emit("send_message", {
// 			chatId: chatId,
// 			content: text
// 		});
// 		setText("");
// 	};

//     return (
// 		<form onSubmit={handleSend} >
//             <div className="flex items-center">
//                 <div className="flex-1">
//                     <input  
// 						type="text"
// 						value={text}
// 						onChange={(e) => setText(e.target.value)}
//                         placeholder="Type a message..."
//                         className="w-full text-sm bg-gray-100 rounded-full py-3 px-4 focus:ring-2 focus:outline-purple resize-none"
//                     />
//                 </div>
//                 <div className="ml-3">
//                     <button 
//                         type="submit"
//                         className="bg-purple rounded-full size-10 flex items-center justify-center hover:bg-purple-dark cursor-pointer">
//                         <img src="/send.svg" alt="send"></img>
//                     </button>
//                 </div>
//             </div>
// 		</form>
//     )
// }

export default MessageInput