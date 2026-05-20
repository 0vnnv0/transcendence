//DUMMIE
//dummie for indexfile
import buildServer from "./serverSetup";
<<<<<<< HEAD
=======
//import { Pool } from 'pg';
// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import prisma from "./lib/prisma";

// 1. Prisma Adapter Setup (wie im Guide)
const connectionString = process.env.DATABASE_URL;
//const pool = new Pool({ connectionString });
const pool = new pg.Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });
>>>>>>> 449985c (added: json file with all information about the projects, a script to add the data to prisma (not working yet: PrismaClient Init error))

async function start() {
	const server = await buildServer();

	try {
		await server.listen({
			port: 3000,
		});

		console.log("Server running on port 3000");
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

start();