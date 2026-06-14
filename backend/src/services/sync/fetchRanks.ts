import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildRankMap } from "./build/buildRankMap.js";

export async function fetchRanks(
	service: FortyTwoService,
	token: string,
	activeUsers: any[]
) {
	const rank1 = await service.fetchQuestUsers(44, token);
	await sleep(1000);

	const rank2 = await service.fetchQuestUsers(45, token);
	await sleep(1000);

	const rank3 = await service.fetchQuestUsers(46, token);
	await sleep(1000);

	const rank4 = await service.fetchQuestUsers(47, token);
	await sleep(1000);

	const rank5 = await service.fetchQuestUsers(48, token);
	await sleep(1000);

	const rank6 = await service.fetchQuestUsers(49, token);
	await sleep(1000);

	const newCore = await service.fetchQuestUsers(128, token);

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