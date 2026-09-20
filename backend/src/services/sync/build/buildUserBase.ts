//pbohme

import { newBuildUserBase } from "./newBuildUserBase.js";

export function buildUserBase(
	user: any,
	coalitionMap: Map<number, any>,
	rankMap: Map<number, any>,
	projectMap: Map<number, any>
) {
	const avatarUrl = user.image?.versions?.large;

	if (!avatarUrl) {
		return null;
	}

	const coalition = coalitionMap.get(user.id);

	if (!coalition) {
		return null;
	}
	
	const rankInfo = rankMap.get(user.id);
	const projectInfo = projectMap.get(user.id);

	return newBuildUserBase(user, coalition, rankInfo, projectInfo);
}