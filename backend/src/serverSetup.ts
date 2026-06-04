import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
// import { displayUsersRoutes } from "./routes/displayUsers.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";

// Plugin Json Web Token, damit User eingeloggt bleibt
import fastifyJwt from "@fastify/jwt";

//all statements logged in the consule
const fastify = Fastify({
	logger: true,
});

//building the server using fastify + accepting connections
async function buildServer() {
	await fastify.register(cors, {
		origin: "*",
	});

	await fastify.register(authRoutes);
	await fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || 'super-geheimes-passwort-fuer-den-cluster'
		});
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	fastify.register(fastifyStatic, {
		root: path.join(__dirname, "../htmlTests"),
		prefix: "/",
	});

	// await displayUsersRoutes(fastify);

	const io = new Server(fastify.server, {
		cors: {
			origin: "*",
		},
	});

	io.on("connection", (socket) => {
		console.log("socket connected:", socket.id);
	});

	return {app: fastify, io};
}

export default buildServer;