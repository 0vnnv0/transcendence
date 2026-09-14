import { io } from 'socket.io-client'

// const BACKEND_URL = 'https://localhost:8443' //'http://c0c7c3.42berlin.de:8080'

const BACKEND_URL = '/api' //'http://c0c7c3.42berlin.de:8080'

export const socket = io(BACKEND_URL, {
    autoConnect: false,
});

export default socket