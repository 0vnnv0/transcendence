import { UserProjects } from "../types/userProjects.js";


export function buildProjectUserMap(
	projectResponses: any[][]
) {
	const map = new Map<number, UserProjects>();

	for (const projectUsers of projectResponses) {
		for (const entry of projectUsers) {

			const user = entry.user;

			if (!user) {
				continue;
			}

			if (user["active?"] !== true) {
				continue;
			}

			if (user["alumni?"] === true) {
				continue;
			}

			const userId = user.id;

			if (!map.has(userId)) {
				map.set(userId, {
					completedProjects: [],
					activeProjects: [],
				});
			}

			const projectInfo = map.get(userId)!;

			const slug = entry.project?.slug;

			if (!slug) {
				continue;
			}

			if (entry["validated?"] === true) {
				projectInfo.completedProjects.push(slug);
			}
			else {
				projectInfo.activeProjects.push({
					slug,
					hasTeam: (entry.teams?.length ?? 0) > 0,
					status: entry.status,
				});
			}
		}
	}

	return map;
}