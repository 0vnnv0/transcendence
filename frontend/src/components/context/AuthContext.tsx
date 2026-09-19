import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { socket } from '../../services/socket';

interface AuthContextType {
	userName: string;
	userId: number | null;
	updateUser: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [userName, setUserName] = useState<string>("Guest");
	const [userId, setUserId] = useState<number | null>(null);

    const updateUser = (token: string) => {
        try {
            const decoded = jwtDecode<{ id: number; intraName: string }>(token);
            setUserName(decoded.intraName);
            setUserId(decoded.id);
        } catch (e) {
            console.error("Failed to decode token during real-time update:", e);
        }
    };

	const logout = () => {
		localStorage.removeItem('token');
		setUserId(null);
		setUserName("Guest");
		if (socket.connected) {
			socket.disconnect();
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const decoded = jwtDecode<{ id: number; intraName: string }>(token);
				setUserName(decoded.intraName);
				setUserId(decoded.id);
			} catch (e) {
				localStorage.removeItem('token');
			}
		}
  	}, []);

	useEffect(() => {
		if (userId) {
			socket.connect();
			socket.emit("register", { userId: userId }); 
			
			return () => {
				socket.disconnect();
			}
		}
	}, [userId]);

	return (
		<AuthContext.Provider value={{ userName, userId, updateUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context)
			throw new Error("useAuth muss innerhalb eines AuthProviders genutzt werden!");
	return context;
}