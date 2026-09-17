import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
// import { displayUsersRoutes } from "./routes/displayUsers.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { searchRoutes } from "./routes/searchRoutes.js"
import { friendRoutes } from "./routes/friendRoutes.js";



// Plugin Json Web Token, damit User eingeloggt bleibt
import fastifyJwt from "@fastify/jwt";

//universal declaration of JWT_SECRET so we dont end up using different secrets in different parts of the project
import dotenv from 'dotenv';
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET || 'super-geheimes-passwort-fuer-den-cluster'

//all statements logged in the console
const fastify = Fastify({
	logger: true,
});

//building the server using fastify + accepting connections
async function buildServer() {
	await fastify.register(cors, {
		// origin: "*",
		origin: ['http://localhost:5173', 
            'http://127.0.0.1:5173', 
            'http://localhost:5137',
            'http://10.11.5.3:5173',         // <-- Your direct cluster IP
            'http://c0c5c3.42berlin.de:5173'], // <-- Your cluster hostname
		credentials: true,
	});

	await fastify.register(fastifyJwt, {
		secret: JWT_SECRET
		});

	fastify.decorate('authenticate', async (request, reply) => {
		try {
			await request.jwtVerify();
		} catch (err) {
			return reply.status(401).send(err);
		}
	});

	await fastify.register(authRoutes);
	await fastify.register(searchRoutes);
	await fastify.register(friendRoutes);

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
