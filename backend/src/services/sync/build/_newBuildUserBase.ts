//pbohme

export function newBuildUserBase(
	apiUser: any,
	coalition?: {
		name: string;
		slug: string;
	},
	rankInfo?: {
		rank: number;
		newCore: boolean;
	},
	projectInfo?: any
) {
	return {
		id: apiUser.id,
		login: apiUser.login,

		intraEmail: apiUser.email,

		campusId: 51,
		campusName: "Berlin",

		coalitionName: coalition?.name ?? null,
		coalitionSlug: coalition?.slug ?? null,

		currentRank: rankInfo?.rank ?? null,
		newCore: rankInfo?.newCore ?? false,
		
		completedProjects: projectInfo?.completedProjects ?? [],
		activeProjects: projectInfo?.activeProjects ?? [],
	};
}