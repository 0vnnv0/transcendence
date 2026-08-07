import { io } from 'socket.io-client'

const BACKEND_URL = 'http://c0c7c3.42berlin.de:8080'

export const socket = io(BACKEND_URL, {
    autoConnect: false,
});

export default socket