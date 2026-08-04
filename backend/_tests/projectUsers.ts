// //pbohme

// import dotenv from "dotenv";
// import path from "path";
// import { FortyTwoService } from "../src/services/fortyTwoService.js";
// import { buildProjectUserMap } from "../src/data/buildProjectUserMap.js";

// dotenv.config({
// 	path: path.resolve(process.cwd(), ".env"),
// });

// async function run() {
// 	const service = new FortyTwoService();
// 	const token = await service.getAccessToken();

// 	const minishellUsers = await service.fetchProjectUsers(
// 		1331, // minishell
// 		token
// 	);

// 	// const cub3dUsers = await service.fetchProjectUsers(
// 	// 	1326,
// 	// 	token
// 	// )

// 	const transcendenceUsers = await service.fetchProjectUsers(
// 		1337,
// 		token
// 	)

// 	const projectUserMap = buildProjectUserMap([
// 		minishellUsers,
// 		// cub3dUsers
// 		transcendenceUsers
// 	]);

// 	const projects = projectUserMap.get(180624);

// 	console.log(projects);



// 	// const userId = 180624;

// 	// console.log("\n=== MINISHELL ===\n");

// 	// const minishellEntry = minishellUsers.find(
// 	// 	(entry) => entry.user?.id === userId
// 	// );

// 	// console.dir(minishellEntry, { depth: null });

// 	// console.log("\n=== TRANSCENDENCE ===\n");

// 	// const transcendenceEntry = transcendenceUsers.find(
// 	// 	(entry) => entry.user?.id === userId
// 	// );

// 	// console.dir(transcendenceEntry, { depth: null });
// }

// run().catch(console.error);