import { io } from 'socket.io-client'
//junruh: changed from this whole block to whats below so we can establish socket connections at all 
// const BACKEND_URL = 'https://localhost:8443' //'http://c0c7c3.42berlin.de:8080'

//const BACKEND_URL = '/api' //'http://c0c7c3.42berlin.de:8080'

// export const socket = io(BACKEND_URL, {
//     autoConnect: false,
// });

// export default socket

const token = localStorage.getItem('token'); 

export const socket = io(window.location.origin, {
	path: '/api/socket.io', 
	auth: {
		token: token ? `Bearer ${token}` : '',
	},
	autoConnect: false,
	transports: ['websocket', 'polling'],
});