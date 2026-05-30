import dotenv from "dotenv";
import path from "path";

import prisma from "../lib/prisma.js";

import { buildActiveBerlinUsers } from "../data/buildActiveBerlinUsers.js";
import { fetchBerlinCoreUsers } from "../services/fetchBerlinCoreUsers.js";
import { FortyTwoService } from "../services/fortyTwoService.js";
import { buildCoalitionMap } from "../data/buildCoalitionMap.js";
import { newBuildUserBase } from "../data/_newBuildUserBase.js";

dotenv.config({
	path: path.resolve(process.cwd(), ".env"),
});

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncBerlinUsers() {
	const service = new FortyTwoService();
	const token = await service.getAccessToken();

	const coreUsers = await fetchBerlinCoreUsers();
	console.log("Berlin Core: ", coreUsers.length);

	const activeUsers = buildActiveBerlinUsers(coreUsers);
	console.log("Berlin active Core: ", activeUsers.length);
	await sleep(600);

	const arctosUsers = await service.fetchCoalitionUsers(384, token);
	await sleep(600);
	const melursusUsers = await service.fetchCoalitionUsers(383, token);
	await sleep(600);
	const fulgensUsers = await service.fetchCoalitionUsers(382, token);
	await sleep(600);

	const coalitionMap = buildCoalitionMap(
		arctosUsers,
		melursusUsers,
		fulgensUsers
	);

	console.log("MAP SIZE", coalitionMap.size);

	const users = activeUsers.map((u) => {
		const coalition = coalitionMap.get(u.id); 

		return newBuildUserBase(u, coalition);
	});

	console.log("SAMPLE USER ID:", activeUsers[0].id);
	console.log("MAP SAMPLE:", [...coalitionMap.keys()].slice(0, 5));

	for (const user of users) {
		await prisma.testUser.upsert({
			where: { id: user.id },
			update: {
				login: user.login,
				intraEmail: user.intraEmail,
				campusId: user.campusId,
				campusName: user.campusName,

				coalitionName: user.coalitionName,
				coalitionSlug: user.coalitionSlug,
			},
			create: 
				user,
		});
	}

	console.log("DONEEEE");
}

syncBerlinUsers().catch(console.error);