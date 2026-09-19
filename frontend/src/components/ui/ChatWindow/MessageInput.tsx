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
            className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2"
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

export default MessageInput