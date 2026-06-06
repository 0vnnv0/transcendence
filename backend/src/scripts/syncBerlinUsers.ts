import dotenv from "dotenv";
import path from "path";

import prisma from "../lib/prisma.js";

import { buildActiveBerlinUsers } from "../data/buildActiveBerlinUsers.js";
import { fetchBerlinCoreUsers } from "../services/fetchBerlinCoreUsers.js";
import { FortyTwoService } from "../services/fortyTwoService.js";
import { buildCoalitionMap } from "../data/buildCoalitionMap.js";
import { newBuildUserBase } from "../data/_newBuildUserBase.js";
import { buildRankMap } from "../data/buildRankMap.js";
import { buildProjectUserMap } from "../data/buildProjectUserMap.js";

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
	console.log("\nArtos Users: ", arctosUsers.length);
	await sleep(1000);
	const melursusUsers = await service.fetchCoalitionUsers(383, token);
	await sleep(1000);
	console.log("Melursus Users: ", melursusUsers.length);
	const fulgensUsers = await service.fetchCoalitionUsers(382, token);
	await sleep(1000);
	console.log("Fulgens Users: ", fulgensUsers.length);

	const coalitionMap = buildCoalitionMap(
		arctosUsers,
		melursusUsers,
		fulgensUsers
	);

	const rank1Users = await service.fetchQuestUsers(44, token);
	console.log("\nRank 1 finished by: ", rank1Users.length);
	await sleep(1000);
	const rank2Users = await service.fetchQuestUsers(45, token);
	console.log("Rank 2 finished by: ", rank2Users.length);
	await sleep(1000);
	const rank3Users = await service.fetchQuestUsers(46, token);
	console.log("Rank 3 finished by: ", rank3Users.length);
	await sleep(1000);
	const rank4Users = await service.fetchQuestUsers(47, token);
	console.log("Rank 4 finished by: ", rank4Users.length);
	await sleep(1000);
	const rank5Users = await service.fetchQuestUsers(48, token);
	console.log("Rank 5 finished by: ", rank5Users.length);
	await sleep(1000);
	const rank6Users = await service.fetchQuestUsers(49, token);
	console.log("Rank 6 finished by: ", rank6Users.length);
	await sleep(1000);
	const newCoreUsers = await service.fetchQuestUsers(128, token);
	console.log("new Core users: ", newCoreUsers.length);
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

	// const rankMap = buildRankMap(
	// activeUsers,
	// [],
	// [],
	// [],
	// [],
	// [],
	// [],
	// []
	// );


	const minishellUsers = await service.fetchProjectUsers(1331, token);
	console.log("\nMinishell Users: ", minishellUsers.length);
	await sleep(500);

	const minirtUsers = await service.fetchProjectUsers(1315, token);
	console.log("miniRT Users: ", minirtUsers.length);
	await sleep(500);

	const cub3dUsers = await service.fetchProjectUsers(1326, token);
	console.log("cub3D Users: ", cub3dUsers.length);
	await sleep(500);

	const webservUsers = await service.fetchProjectUsers(1332, token);
	console.log("webserv Users: ", cub3dUsers.length);
	await sleep(500);

	const ftIrcUsers = await service.fetchProjectUsers(1336, token);
	console.log("ft_irc Users: ", ftIrcUsers.length);
	await sleep(500);

	const transcendenceUsers = await service.fetchProjectUsers(1337, token);
	console.log("Transcendence Users: ", transcendenceUsers.length);
	await sleep(500);

	const resumeUsers = await service.fetchProjectUsers(2623, token);
	console.log("Resume Users: ", resumeUsers.length);
	await sleep(500);

	const pushSwapUsers = await service.fetchProjectUsers(2687, token);
	console.log("pushswap Users: ", pushSwapUsers.length);
	await sleep(500);

	const mazeUsers = await service.fetchProjectUsers(2688, token);
	console.log("amazeing Users: ", mazeUsers.length);
	await sleep(500);

	const pacmanUsers = await service.fetchProjectUsers(2706, token);
	console.log("pac man Users: ", pacmanUsers.length);
	await sleep(500);

	const agentUsers = await service.fetchProjectUsers(2703, token);
	console.log("agent smith Users: ", agentUsers.length);
	await sleep(500);

	const answerUsers = await service.fetchProjectUsers(2701, token);
	console.log("answerprotocol Users: ", answerUsers.length);
	await sleep(500);

	const projectUserMap = buildProjectUserMap([
		minishellUsers,
		minirtUsers,
		cub3dUsers,
		webservUsers,
		ftIrcUsers,
		transcendenceUsers,
		resumeUsers,

		pushSwapUsers,
		mazeUsers,
		pacmanUsers,
		agentUsers,
		answerUsers,
	]);

	console.log("\n\nBuilding User Base...");

	const users = activeUsers.map((u) => {
		const coalition = coalitionMap.get(u.id); 
		const rankInfo = rankMap.get(u.id);
		const projectInfo = projectUserMap.get(u.id);

		return newBuildUserBase(u, coalition, rankInfo, projectInfo);
	});


	console.log("\n\nSyncing to Database...");

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

				completedProjects: user.completedProjects,
				activeProjects: user.activeProjects,
			},
			create: 
				user,
		});
	}

	console.log("\nDONEEEE");
}

syncBerlinUsers().catch(console.error);

//am ende: noch mal checker funktion --> zb wenn jmd keine coalition hat --> RAUS
