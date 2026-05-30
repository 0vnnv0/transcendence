import dotenv from "dotenv";
import path from "path";

import prisma from "../lib/prisma.js";
import { buildActiveBerlinUsers } from "../data/buildActiveBerlinUsers.js";
import { fetchBerlinCoreUsers } from "../data/fetchBerlinCoreUsers.js";

dotenv.config({
	path: path.resolve(process.cwd(), ".env"),
});

async function syncBerlinUsers() {
	const coreUsers = await fetchBerlinCoreUsers();
	console.log("Berlin Core: ", coreUsers.length);

	const activeUsers = buildActiveBerlinUsers(coreUsers);
	console.log("Berlin active Core: ", activeUsers.length);

	for (const user of activeUsers) {
		await prisma.testUser.upsert({
			where: { id: user.id },
			update: {
				login: user.login,
			},
			create: {
				id: user.id,
				login: user.login,
			},
		});
	}

	console.log("DONEEEE");
}

syncBerlinUsers().catch(console.error);