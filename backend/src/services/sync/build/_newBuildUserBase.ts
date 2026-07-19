//pbohme

import { FortyTwoUser } from "../../../types/FortyTwoUser.js";

function buildIntraProfileUrl(apiUrl: string | null) {

	if (!apiUrl) {
		return null;
	}

	return apiUrl
		.replace("api.intra.42.fr/v2/users/", "profile.intra.42.fr/users/");
}

export function newBuildUserBase(
	apiUser: FortyTwoUser,
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

		firstName: apiUser.first_name,
		lastName: apiUser.last_name,

		avatarUrl: apiUser.image?.versions?.large ?? null,

		intraUrl: buildIntraProfileUrl(apiUser.url),

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