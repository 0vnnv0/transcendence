//pbohme

import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildRankMap } from "./build/buildRankMap.js";

export async function fetchRanks(
	service: FortyTwoService,
	activeUsers: any[]
) {
	console.log("\n\n\x1b[1mFETCHING RANKS...\x1b[0m")

	const rank1 = await service.fetchQuestUsers(44);
	console.log("rank \x1b[1m1\x1b[0m loaded");
	await sleep(1000);

	const rank2 = await service.fetchQuestUsers(45);
	console.log("rank \x1b[1m2\x1b[0m loaded");
	await sleep(1000);

	const rank3 = await service.fetchQuestUsers(46);
	console.log("rank \x1b[1m3\x1b[0m loaded");
	await sleep(1000);

	const rank4 = await service.fetchQuestUsers(47);
	console.log("rank \x1b[1m4\x1b[0m loaded");
	await sleep(1000);

	const rank5 = await service.fetchQuestUsers(48);
	console.log("rank \x1b[1m5\x1b[0m loaded");
	await sleep(1000);

	const rank6 = await service.fetchQuestUsers(49);
	console.log("rank \x1b[1m6\x1b[0m loaded");
	await sleep(1000);

	const newCore = await service.fetchQuestUsers(128);

	return buildRankMap(
		activeUsers,
		rank1,
		rank2,
		rank3,
		rank4,
		rank5,
		rank6,
		newCore
	);
}