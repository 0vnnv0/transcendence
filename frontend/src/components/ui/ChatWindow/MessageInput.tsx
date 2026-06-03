import { useState } from 'react'
import { socket } from '../../../services/socket'


interface MessageInputProps {
    chatId: number;
}

const MessageInput: React.FC<MessageInputProps> = () => {
    const [text, setText] = useState("");

    return (
            <div className="flex items-center">
                <div className="flex-1">
                    <textarea  
                        placeholder="Type a message..."
                        className="w-full text-sm bg-gray-100 rounded-full py-3 px-4 focus:ring-2 focus:outline-black resize-none"
                    />

                </div>
                <div className="ml-3">
                    <button 
                        type="submit"
                        className="bg-white rounded-full size-12 flex items-center justify-center hover:bg-gray-500 cursor-pointer">
                        <img src="/send.svg" alt="send"></img>
                    </button>
                </div>
            </div>
    )
}

export default MessageInput