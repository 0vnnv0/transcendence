//pbohme

import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildRankMap } from "./build/buildRankMap.js";

export async function fetchRanks(
	service: FortyTwoService,
	activeUsers: any[]
) {
	const rank1 = await service.fetchQuestUsers(44);
	await sleep(1000);

	const rank2 = await service.fetchQuestUsers(45);
	await sleep(1000);

	const rank3 = await service.fetchQuestUsers(46);
	await sleep(1000);

	const rank4 = await service.fetchQuestUsers(47);
	await sleep(1000);

	const rank5 = await service.fetchQuestUsers(48);
	await sleep(1000);

	const rank6 = await service.fetchQuestUsers(49);
	await sleep(1000);

	const newCore = await service.fetchQuestUsers(128);

	console.log("Ranks loaded");

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