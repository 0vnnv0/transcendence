import { newBuildUserBase } from "./_newBuildUserBase.js";

export function buildUserBase(
	user: any,
	coalitionMap: Map<number, any>,
	rankMap: Map<number, any>,
	projectMap: Map<number, any>
) {
	const coalition = coalitionMap.get(user.id);
	const rankInfo = rankMap.get(user.id);
	const projectInfo = projectMap.get(user.id);

	return newBuildUserBase(user, coalition, rankInfo, projectInfo);
}