import { RankInfo } from "../../../types/rankInfo.js";


function createRankMap(activeUsers: any[]) {
	const map = new Map<number, RankInfo>();

	for (const user of activeUsers){
		map.set(user.id, {
			rank: 0,
			newCore: false,
		});
	}
	return map;
}

function setRank(
	map: Map<number, { rank: number; newCore: boolean }>,
	users: any[],
	rank: number,
) {
	for (const entry of users) {
		const existing = map.get(entry.user.id);
		if (!existing) { 
			continue;
		}
		existing.rank = rank;
	}
}

function setNewCore(
	map: Map<number, { rank: number; newCore: boolean }>,
	users: any[],
) {
	for (const entry of users) {
		const existing = map.get(entry.user.id);

		if(!existing) continue;

		existing.newCore = true;
	}
}

export function buildRankMap(
	activeUsers: any[],
	rank1Users: any[],
	rank2Users: any[],
	rank3Users: any[],
	rank4Users: any[],
	rank5Users: any[],
	rank6Users: any[],
	newCoreUsers: any[],
) {
	const rankMap = createRankMap(activeUsers);

	setRank(rankMap, rank1Users, 1);
	setRank(rankMap, rank2Users, 2);
	setRank(rankMap, rank3Users, 3);
	setRank(rankMap, rank4Users, 4);
	setRank(rankMap, rank5Users, 5);
	setRank(rankMap, rank6Users, 6);

	setNewCore(rankMap, newCoreUsers);

	return rankMap;
}