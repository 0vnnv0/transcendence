import { useState } from 'react'
import { socket } from '../../../services/socket'


interface MessageInputProps {
    chatId: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
    const [text, setText] = useState("");

	const handleSend = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (text.trim() === "")
			return;

		socket.emit("send_message", {
			chatId: chatId,
			content: text
		});
		setText("");
	};

    return (
		<form onSubmit={handleSend} >
            <div className="flex items-center">
                <div className="flex-1">
                    <input  
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full text-sm bg-gray-100 rounded-full py-3 px-4 focus:ring-2 focus:outline-purple resize-none"
                    />
                </div>
                <div className="ml-3">
                    <button 
                        type="submit"
                        className="bg-purple rounded-full size-10 flex items-center justify-center hover:bg-purple-dark cursor-pointer">
                        <img src="/send.svg" alt="send"></img>
                    </button>
                </div>
            </div>
		</form>
    )
}

export default MessageInput