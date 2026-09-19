import React, { useState } from 'react';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
    const [content, setContent] = useState('');

	//junruh: added more debug statements and chnanged this next line bc of react type deprecated error:
    //const handleSubmit = (e: React.FormEvent) => { 
	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		console.log("➡️ [MessageInput] Submit triggered with content:", content);
	
		if (content.trim().length === 0 || disabled) {
			console.warn("⚠️ [MessageInput] Blocked submit! Empty content or disabled flag is true:", { content, disabled });
			return;
		}

        onSendMessage(content.trim());
        setContent(''); // Feld nach dem Senden leeren
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2 pb-24 md:pb-4"
        >
            <input
                type="text"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
				//junruh: changed this bc of react type error. old line:
				//onChange={(e) => setContent(e.target.value)} 
                placeholder="Type a message..."
                disabled={disabled}
                className="flex-1 bg-gray-900 border border-gray-600 text-white p-3 rounded-md focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
            <button 
                type="submit"
                disabled={disabled || content.trim().length === 0}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-md transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Send
            </button>
        </form>
    );
};

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
