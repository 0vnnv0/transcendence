import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../../types/chat';

//junruh: modified function to integrate pagination for scrolling, previous function is below
interface MessageListProps {
    messages: ChatMessage[];
    currentUserId: number;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
    messages, 
    currentUserId,
    onLoadMore,
    hasMore,
    isLoadingMore
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const endOfListRef = useRef<HTMLDivElement>(null);

    // Track state to preserve scroll position when loading older messages
    const prevScrollHeightRef = useRef<number>(0);
    const isInitialLoadRef = useRef<boolean>(true);

    // 1. Scroll-up detector to trigger older page fetch
    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop } = containerRef.current;

        if (scrollTop < 50 && hasMore && !isLoadingMore) {
            // Save scrollHeight before loading more messages
            prevScrollHeightRef.current = containerRef.current.scrollHeight;
            onLoadMore();
        }
    };

    // 2. Adjust scroll offset after new messages load
    useEffect(() => {
        if (!containerRef.current) return;

        // On first render: scroll directly to bottom
        if (isInitialLoadRef.current && messages.length > 0) {
            endOfListRef.current?.scrollIntoView({ behavior: 'auto' });
            isInitialLoadRef.current = false;
            return;
        }

        // When older messages are loaded at top: adjust scroll position so UI doesn't jump
        if (prevScrollHeightRef.current > 0) {
            const newScrollHeight = containerRef.current.scrollHeight;
            containerRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current;
            prevScrollHeightRef.current = 0;
            return;
        }

        // On new incoming live message: scroll to bottom smoothly
        endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
        >
            {isLoadingMore && (
                <div className="text-center text-xs text-purple-300 py-1 font-kyiv">
                    Loading older messages...
                </div>
            )}

            {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                
				return (
					<div 
						key={msg.id} 
						className={`flex min-w-0 w-full ${isMe ? 'justify-end' : 'justify-start'}`}
					>
						<div 
							className={`max-w-[70%] sm:max-w-[60%] p-3 rounded-lg text-white font-kyiv flex flex-col gap-1 min-w-0 overflow-hidden ${
								isMe ? 'bg-purple-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
							}`}
						>
							{!isMe && msg.sender?.intraName && (
								<span className="text-xs text-gray-300 font-bold truncate">
									{msg.sender.intraName}
								</span>
							)}
							<p className="whitespace-pre-wrap break-all [overflow-wrap:anywhere] text-sm">
								{msg.content}
							</p>
						</div>
					</div>
				);
            })}
            
            <div ref={endOfListRef} />
        </div>
    );
};

export default MessageList;