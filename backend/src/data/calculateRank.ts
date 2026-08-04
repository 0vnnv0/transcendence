//OLD

//ACHTUNG: aktuell: macht fehler fuer alle students die schon fertig sind!!
//returned trd rank 6

// export function calculateRank(questsUsers: any[]): number {

// 	let maxRank = -1;
// 	let hasCompletedCommonCore = false;

// 	for (const questUser of questsUsers) {
// 		if (!questUser.validated_at) {
// 			continue;
// 		}

// 		const questId = questUser.quest_id;
// 		if (questId === 37) {
// 			hasCompletedCommonCore = true;
// 			continue;
// 		}

// 		const questName = questUser.quest?.name;
// 		if (!questName) {
// 			continue;
// 		}

// 		if (!questName.includes("Common Core Rank")) {
// 			continue;
// 		}

// 		const match = questName.match(/Rank\s+(\d+)/);
// 		if (!match) {
// 			continue;
// 		}

// 		const rank = Number(match[1]);

// 		maxRank = Math.max(maxRank, rank);
// 	}

// 	let finalRank = maxRank + 1; 
// 	if (hasCompletedCommonCore) {
// 		finalRank = Math.max(finalRank, 7);
// 	}

// 	return finalRank;
// }