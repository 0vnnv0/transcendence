import Fastify from "fastify";
import cors from "@fastify/cors";

import { Server } from "socket.io";

import { displayUsersRoutes } from "./routes/displayUsers";

import { chatRoutes } from "./routes/chatRoutes";

//all statements logged in the consule
const fastify = Fastify({
	logger: true,
});

//building the server using fastify + accepting connections
async function buildServer() {
	await fastify.register(cors, {
		origin: "*",
	});

	await displayUsersRoutes(fastify);
	await chatRoutes(fastify);

	const io = new Server(fastify.server, {
		cors: {
			origin: "*",
		},
	});

	io.on("connection", (socket) => {
		console.log("socket connected:", socket.id);
	});

	return fastify;
}

export default buildServer;