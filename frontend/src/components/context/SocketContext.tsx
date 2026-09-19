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

        socket.on("new_message", (message) => {
            if (message.senderId !== userId) {
                const senderName = message.sender?.intraName || "Jemand";
                
                toast.custom((t) => (
                    <div 
                        onClick={() => {
                            window.location.href = `/chat/${message.chatId}`;
                            toast.dismiss(t.id);
                        }}
                        className="cursor-pointer bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col gap-1 hover:bg-gray-700 transition"
                    >
                        <span className="font-bold text-xs text-orange-400">Neue Nachricht von {senderName}</span>
                        <span className="text-sm truncate max-w-xs">{message.content}</span>
                    </div>
                ), { duration: 4000 });
            }
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off("initial_online_users");
            socket.off("user_online");
            socket.off("user_offline");
            socket.off("new_message");
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ onlineUserIds }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);