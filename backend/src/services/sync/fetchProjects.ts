//pbohme

import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildProjectUserMap } from "./build/buildProjectUserMap.js";

export async function fetchProjects(service: FortyTwoService) {
	console.log("\n\n\x1b[1mFETCHING PROJECTS...\x1b[0m")
	const minishell = await service.fetchProjectUsers(1331);
	console.log("🐚 minishell loaded")
	await sleep(500);

	const minirt = await service.fetchProjectUsers(1315);
	console.log("🪩", " miniRT loaded")
	await sleep(500);

	const cub3d = await service.fetchProjectUsers(1326);
	console.log("🎮 cub3D loaded")
	await sleep(500);

	const webserv = await service.fetchProjectUsers(1332);
	console.log("🌐 webserv loaded")
	await sleep(500);

	const ftIrc = await service.fetchProjectUsers(1336);
	console.log("💬 ft_irc loaded")
	await sleep(500);

	const transcendence = await service.fetchProjectUsers(1337);
	console.log("♾️", " transcendence loaded")
	await sleep(500);

	const resume = await service.fetchProjectUsers(2623);
	console.log("📄 collaborative resume loaded")
	await sleep(500);

	const pushswap = await service.fetchProjectUsers(2687);
	console.log("🔢 pushswap loaded")
	await sleep(500);

	const maze = await service.fetchProjectUsers(2688);
	console.log("🗺️", " a-maze-ing loaded")
	await sleep(500);

	const pacman = await service.fetchProjectUsers(2706);
	console.log("👻 pacman loaded")
	await sleep(500);

	const agent = await service.fetchProjectUsers(2703);
	console.log("🕵️‍♀️", " agent smith loaded")
	await sleep(500);

	const answer = await service.fetchProjectUsers(2701);
	console.log("🤖 the answer protocol loaded")
	await sleep(500);

	// console.log("Projects loaded");

	return buildProjectUserMap([
		minishell,
		minirt,
		cub3d,
		webserv,
		ftIrc,
		transcendence,
		resume,
		pushswap,
		maze,
		pacman,
		agent,
		answer,
	]);
}