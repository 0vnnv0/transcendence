//DUMMIE
//dummie for indexfile
import buildServer from "./serverSetup.js";
//import { Pool } from 'pg';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { setupChatSockets } from "./sockets/chat.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { PrismaClient } from "@prisma/client";
import { projectRoutes } from "./routes/projectRoutes.js";


// 1. Prisma Adapter Setup (wie im Guide)
const connectionString = process.env.DATABASE_URL;
//const pool = new Pool({ connectionString });
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function start() {
	const {app, io} = await buildServer();

	// 2. Die Route aus dem Guide für Fastify adaptieren
    app.get("/", async (request, reply) => {
        try {
            const userCount = await prisma.user.count();
            
            const message = userCount === 0
                ? "No users have been added yet."
                : "Some users have been added to the database.";
            
            return { message }; // Fastify wandelt Objekte automatisch in JSON um
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Database connection failed" });
        }
    });

	// Alle 60 Minuten abgelaufene Tokens aus der Blacklist löschen
	setInterval(async () => {
	try {
		const deleted = await prisma.blacklistedTokens.deleteMany({
		where: {
			expiresAt: { lt: new Date() }
		}
		});
		console.log(`Blacklist cleaned: ${deleted.count} expired tokens deleted.`);
	} catch (err) {
		console.error("Error during Blacklist cleaning: ", err);
	}
	}, 1000 * 60 * 60);

	setupChatSockets(io, prisma);
	await chatRoutes(app, prisma);
	//await profileRoutes(app, {prisma});
	app.register(profileRoutes, {prisma});
	await userRoutes(app, prisma);
	await projectRoutes(app);
	try {
		await app.listen({
			port: 3000,
			host: '0.0.0.0'
		});

		console.log("Server running on http://localhost:3000");
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

start();
