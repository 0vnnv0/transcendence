//pbohme

import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildCoalitionMap } from "./build/buildCoalitionMap.js";

export async function fetchCoalitions(service: FortyTwoService) {
	console.log("\n\n\x1b[1mFETCHING COALITIONS...\x1b[0m")
	const arctos = await service.fetchCoalitionUsers(384);
	console.log("❄️ ", "\x1b[34mArctos users: \x1b[0m", arctos.length)
	await sleep(1000);

	const melursus = await service.fetchCoalitionUsers(383);
	console.log("🌶️ ", "\x1b[31mMelursus users: \x1b[0m", melursus.length)
	await sleep(1000);

	const fulgens = await service.fetchCoalitionUsers(382);
	console.log("🍀", "\x1b[32mFulgens users: \x1b[0m", fulgens.length)
	await sleep(1000);

	// console.log("\x1b[mALL COALITIONS LOADED.\x1b[m");

	return buildCoalitionMap(arctos, melursus, fulgens);
}