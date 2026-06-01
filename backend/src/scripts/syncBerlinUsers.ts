import dotenv from "dotenv";
import path from "path";

import prisma from "../lib/prisma.js";

import { buildActiveBerlinUsers } from "../data/buildActiveBerlinUsers.js";
import { fetchBerlinCoreUsers } from "../services/fetchBerlinCoreUsers.js";
import { FortyTwoService } from "../services/fortyTwoService.js";
import { buildCoalitionMap } from "../data/buildCoalitionMap.js";
import { newBuildUserBase } from "../data/_newBuildUserBase.js";
import { buildRankMap } from "../data/buildRankMap.js";

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
	await sleep(1000);

	const arctosUsers = await service.fetchCoalitionUsers(384, token);
	console.log(arctosUsers.length);
	await sleep(1000);
	const melursusUsers = await service.fetchCoalitionUsers(383, token);
	await sleep(1000);
	console.log(melursusUsers.length);
	const fulgensUsers = await service.fetchCoalitionUsers(382, token);
	await sleep(1000);
	console.log(fulgensUsers.length);

	const coalitionMap = buildCoalitionMap(
		arctosUsers,
		melursusUsers,
		fulgensUsers
	);

	console.log("MAP SIZE", coalitionMap.size);

	const rank1Users = await service.fetchQuestUsers(44, token);
	await sleep(1000);
	const rank2Users = await service.fetchQuestUsers(45, token);
	await sleep(1000);
	const rank3Users = await service.fetchQuestUsers(46, token);
	await sleep(1000);
	const rank4Users = await service.fetchQuestUsers(47, token);
	await sleep(1000);
	const rank5Users = await service.fetchQuestUsers(48, token);
	await sleep(1000);
	const rank6Users = await service.fetchQuestUsers(49, token);
	await sleep(1000);
	const newCoreUsers = await service.fetchQuestUsers(128, token);
	await sleep(1000);

	const rankMap = buildRankMap(
		activeUsers,
		rank1Users,
		rank2Users,
		rank3Users,
		rank4Users,
		rank5Users,
		rank6Users,
		newCoreUsers,
	);

	const users = activeUsers.map((u) => {
		const coalition = coalitionMap.get(u.id); 
		const rankInfo = rankMap.get(u.id);

		return newBuildUserBase(u, coalition, rankInfo);
	});


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

//am ende: noch mal checker funktion --> zb wenn jmd keine coalition hat --> RAUS
