//pbohme

import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildProjectUserMap } from "./build/buildProjectUserMap.js";

export async function fetchProjects(service: FortyTwoService) {
	const minishell = await service.fetchProjectUsers(1331,);
	await sleep(500);

	const minirt = await service.fetchProjectUsers(1315);
	await sleep(500);

	const cub3d = await service.fetchProjectUsers(1326);
	await sleep(500);

	const webserv = await service.fetchProjectUsers(1332);
	await sleep(500);

	const ftIrc = await service.fetchProjectUsers(1336);
	await sleep(500);

	const transcendence = await service.fetchProjectUsers(1337);
	await sleep(500);

	const resume = await service.fetchProjectUsers(2623);
	await sleep(500);

	const pushswap = await service.fetchProjectUsers(2687);
	await sleep(500);

	const maze = await service.fetchProjectUsers(2688);
	await sleep(500);

	const pacman = await service.fetchProjectUsers(2706);
	await sleep(500);

	const agent = await service.fetchProjectUsers(2703);
	await sleep(500);

	const answer = await service.fetchProjectUsers(2701);
	await sleep(500);

	console.log("Projects loaded");

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