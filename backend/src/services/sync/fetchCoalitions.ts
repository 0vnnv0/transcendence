import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildCoalitionMap } from "./build/buildCoalitionMap.js";

export async function fetchCoalitions(service: FortyTwoService, token: string) {
	const arctos = await service.fetchCoalitionUsers(384, token);
	await sleep(1000);

	const melursus = await service.fetchCoalitionUsers(383, token);
	await sleep(1000);

	const fulgens = await service.fetchCoalitionUsers(382, token);
	await sleep(1000);

	console.log("Coalitions loaded.");

	return buildCoalitionMap(arctos, melursus, fulgens);
}