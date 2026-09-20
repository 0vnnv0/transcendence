import { io } from 'socket.io-client'

export const socket = io(window.location.origin, {
	path: '/api/socket.io', 
	autoConnect: false,
	transports: ['websocket', 'polling'],
});

