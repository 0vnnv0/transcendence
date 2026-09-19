import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface SocketContextType {
    onlineUserIds: number[];
}

const SocketContext = createContext<SocketContextType>({ onlineUserIds: [] });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
    const { userId } = useAuth();

    useEffect(() => {
        if (!userId) {
            toast.remove();
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const token = localStorage.getItem('token');
        socket.auth = {
            token: token ? `Bearer ${token}` : ''
        };

        if (!socket.connected) {
            socket.connect();
        }

        const onConnect = () => {
            socket.emit("register", { userId });
        };

        if (socket.connected) {
            onConnect();
        }

        socket.on('connect', onConnect);

        socket.on("initial_online_users", (data) => {
            let ids: number[] = [];
            if (Array.isArray(data)) {
                ids = data.map(Number);
            } else if (data && typeof data === 'object') {
                ids = Object.keys(data).map(Number);
            }
            setOnlineUserIds(ids);
        });

        socket.on("user_online", (data) => {
            setOnlineUserIds(prev => [...new Set([...prev, data.userId])]);
        });

        socket.on("user_offline", (data) => {
            setOnlineUserIds(prev => prev.filter(id => id !== data.userId));
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off("initial_online_users");
            socket.off("user_online");
            socket.off("user_offline");
        };
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const handleNewMessage = (message: any) => {
            // Aktuelle Chat-ID sicher aus window.location auslesen (funktioniert immer, unabhängig vom Router)
            const currentPathMatch = window.location.pathname.match(/\/chat\/(\d+)/);
            const activeChatId = currentPathMatch ? parseInt(currentPathMatch[1], 10) : null;

            const isInThisChat = activeChatId === message.chatId;

            if (!isInThisChat) {
                const senderName = message.sender?.intraName || "Jemand";
                
                toast.custom((t) => (
                    <div 
                        onClick={() => {
                            window.location.href = `/chat/${message.chatId}`;
                            toast.dismiss(t.id);
                        }}
                        className="cursor-pointer bg-purple-dark text-white p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col gap-1 hover:bg-gray-700 transition"
                    >
                        <span className="font-bold text-xs text-mild-purple">Neue Nachricht von {senderName}</span>
                        <span className="text-sm truncate max-w-xs">{message.content}</span>
                    </div>
                ), { duration: 4000 });
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ onlineUserIds }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { socket } from '../../services/socket';
// import { useAuth } from './AuthContext';
// import { toast } from 'react-hot-toast';
// import { useLocation } from 'react-router';

// interface SocketContextType {
//     onlineUserIds: number[];
// }

// const SocketContext = createContext<SocketContextType>({ onlineUserIds: [] });

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//     const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
//     const { userId } = useAuth();
// 	const location = useLocation();

//     useEffect(() => {
//         if (!userId) return;

//         const token = localStorage.getItem('token');
//         socket.auth = {
//             token: token ? `Bearer ${token}` : ''
//         };

//         if (!socket.connected) {
//             socket.connect();
//         }

//         const onConnect = () => {
//             socket.emit("register", { userId });
//         };

//         if (socket.connected) {
//             onConnect();
//         }

//         socket.on('connect', onConnect);

//         socket.on("initial_online_users", (data) => {
//             let ids: number[] = [];
//             if (Array.isArray(data)) {
//                 ids = data.map(Number);
//             } else if (data && typeof data === 'object') {
//                 ids = Object.keys(data).map(Number);
//             }
//             setOnlineUserIds(ids);
//         });

//         socket.on("user_online", (data) => {
//             setOnlineUserIds(prev => [...new Set([...prev, data.userId])]);
//         });

//         socket.on("user_offline", (data) => {
//             setOnlineUserIds(prev => prev.filter(id => id !== data.userId));
//         });

//         socket.on("new_message", (message) => {
//             if (message.senderId !== userId) {
//                 const senderName = message.sender?.intraName || "Jemand";
                
//                 toast.custom((t) => (
//                     <div 
//                         onClick={() => {
//                             window.location.href = `/chat/${message.chatId}`;
//                             toast.dismiss(t.id);
//                         }}
//                         className="cursor-pointer bg-purple-dark text-white p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col gap-1 hover:bg-gray-700 transition"
//                     >
//                         <span className="font-bold text-xs text-mild-purple">Neue Nachricht von {senderName}</span>
//                         <span className="text-sm truncate max-w-xs">{message.content}</span>
//                     </div>
//                 ), { duration: 4000 });
//             }
//         });

//         return () => {
//             socket.off('connect', onConnect);
//             socket.off("initial_online_users");
//             socket.off("user_online");
//             socket.off("user_offline");
//             socket.off("new_message");
//         };
//     }, [userId]);

//     return (
//         <SocketContext.Provider value={{ onlineUserIds }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export const useSocket = () => useContext(SocketContext);