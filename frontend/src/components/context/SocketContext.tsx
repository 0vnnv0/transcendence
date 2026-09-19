import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../../services/socket'; // Nutze deinen bestehenden Socket-Import
import { useAuth } from './AuthContext';

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
   			 console.log("📥 EMPFANGEN initial_online_users:", data);
 		   let ids: number[] = [];
 		   if (Array.isArray(data)) {
   		     ids = data.map(Number);
  		  } else if (data && typeof data === 'object') {
 		       ids = Object.keys(data).map(Number);
		    }
 		   setOnlineUserIds(ids);
		});

		socket.on("user_online", (data) => {
			console.log("🟢 EVENT user_online empfangen:", data);
			setOnlineUserIds(prev => [...new Set([...prev, data.userId])]);
		});

		socket.on("user_offline", (data) => {
			console.log("🔴 EVENT user_offline empfangen:", data);
			setOnlineUserIds(prev => prev.filter(id => id !== data.userId));
		});

        return () => {
            socket.off('connect', onConnect);
            socket.off("initial_online_users");
            socket.off("user_online");
            socket.off("user_offline");
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ onlineUserIds }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);