import { io } from 'socket.io-client'

const token = localStorage.getItem('token'); 

export const socket = io(window.location.origin, {
	path: '/api/socket.io', 
	auth: {
		token: token ? `Bearer ${token}` : '',
	},
	autoConnect: false,
	transports: ['websocket', 'polling'],
});

