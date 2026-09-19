import React from 'react';
import { useParams } from 'react-router-dom';
import { useChatMessages } from '../../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader'; 
import { socket } from '../../../services/socket'; 
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useEffect } from 'react'; //junruh
import Forbidden from '../../../pages/Forbidden';

const ChatWindow: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const parsedChatId = parseInt(chatId || '0', 10);
    const { userId: currentUserId } = useAuth(); 
	//junruh: for infinite scroll:
	const { 
		data, 
		isLoading, 
		isError, 
		error,
		fetchNextPage, 
		hasNextPage, 
		isFetchingNextPage 
	} = useChatMessages(parsedChatId, currentUserId, socket);
	//junruh: manually joining sockets in case of new chats & attaching token dynamically to socket auth payload
	useEffect(() => {
		if (!socket) return;
	  
		const token = localStorage.getItem('token');
		socket.auth = {
			token: token ? `Bearer ${token}` : ''
		};
		if (!socket.connected) {
		  console.log("🔌 Attempting socket connection...");
		  socket.connect();
		}
	  
		if (parsedChatId) {
		  socket.emit('join_chat_room', { chatId: parsedChatId });
		}
	  
		// debug listeners
		const onConnect = () => console.log("✅ Socket connected successfully! ID:", socket.id);
		const onConnectError = (err: Error) => console.error("❌ Socket connection error:", err.message);
	  
		socket.on('connect', onConnect);
		socket.on('connect_error', onConnectError);
	  
		return () => {
		  socket.off('connect', onConnect);
		  socket.off('connect_error', onConnectError);
		};
	  }, [socket, parsedChatId]);
	//end of sockets

    // const { data, isLoading, isError } = useChatMessages(parsedChatId, currentUserId, socket);
    if (!currentUserId) {
        return <div className="text-purple">Loading user...</div>;
    }
	
	//junruh: handle pagination stuff, sorting, extracting participants
	const allMessages = data?.pages
    ? [...data.pages].reverse().flatMap(page => page.messages)
    : [];

    const participants = data?.pages[0]?.participants ?? [];
    const otherUser = participants.find(u => u.id !== currentUserId);

	//junruh: added debug statements and reconnect
    const handleSendMessage = (content: string) => {
		console.log("1. Send button clicked. Content:", content);

		if (!socket) {
			console.error("Socket object is null");
			return;
		}

		if (!socket.connected) {
			console.warn("Socket was disconnected. Reconnecting...");
			socket.connect();
		}

		console.log("2. Emitting send_message to backend...");
        socket.emit('send_message', {
            chatId: parsedChatId,
            senderId: currentUserId,
            content: content
        });
    };

    let mainContent = null;

    if (isLoading) {
        mainContent = (
            <div className="flex-1 flex justify-center items-center text-purple-500 font-kyiv">
                Loading messages...
            </div>
        );
    // } else if (isError) {
    //     mainContent = (
    //         <div className="flex-1 flex justify-center items-center text-red-500 font-kyiv">
    //             Error loading chat history.
    //         </div>
    //     );
	} else if (isError) {
		if ((error as any)?.status === 403) {
			mainContent = <Forbidden />;
		} else {
			mainContent = (
				<div className="flex-1 flex justify-center items-center text-red-500 font-kyiv">
					Error loading chat history.
				</div>
			);
		}	
    } else if (allMessages.length === 0) {
        mainContent = (
            <div className="flex-1 flex justify-center items-center text-gray-500 font-kyiv">
                No messages yet. Say hi!
            </div>
        );
    } else { //junruh modified for pagination
        mainContent = (
            <MessageList 
                messages={allMessages} 
                currentUserId={currentUserId}
                onLoadMore={() => fetchNextPage()}
                hasMore={!!hasNextPage}
                isLoadingMore={isFetchingNextPage}
            />
        );
    }
	const { onlineUserIds } = useSocket();

	const enhancedOtherUser = otherUser ? {
		...otherUser,
		isOnline: onlineUserIds.includes(otherUser.id)
	} : undefined;
	
	const isForbidden = isError && (error as ApiError)?.status === 403;

	return (
		<>
			{isForbidden ? (
				<Forbidden />
			) : (
				<div className="flex flex-col h-screen bg-white w-full">
					<ChatHeader
						otherUser={enhancedOtherUser}
						isLoading={isLoading}
					/>

					{mainContent}

					<MessageInput
						onSendMessage={handleSendMessage}
						disabled={isLoading || isError}
					/>
				</div>
			)}
		</>
	);


    // return (
    //     <div className="flex flex-col h-screen bg-white w-full">
    //         <ChatHeader otherUser={enhancedOtherUser} isLoading={isLoading} />

    //         {mainContent}

    //         <MessageInput 
    //             onSendMessage={handleSendMessage} 
    //             disabled={isLoading || isError} 
    //         />
    //     </div>
    // );
};

export default ChatWindow;
