import { User } from "../types/User.js";
import { getNextProject } from "./getNextProject.js";

export function buildBaseUser(apiUser: any) {
	return {
		id: apiUser.id,
		login: apiUser.login,
		campus: apiUser.campus
	};
}

export function addRank(user:any, rank:number) {
	return { ...user, rank};
}

export function addCoalition(user:any, coalition: any) {
	return {
		...user,
		coalition: {
			name: coalition?.[0]?.name,
			slug: coalition?.[0]?.slug,
		}
	};
}

export function addNextProject(user: any, selectedIn: any, projectsUsers: any[]) {
	return {
		...user, 
		selectedIn,
		nextProject: getNextProject(user.rank, user.newCore, projectsUsers)
	};
}

export function addNewCore(user:any, newCore: boolean): User {
	return {
		...user,
		newCore
	};
}

export function isNewCore(questsUsers: any[]): boolean {
	return questsUsers.some(
		(qu: any) => qu.quest_id === 128
	);
}

export function monthStringToNumber(month: string): number {
	const months: Record<string, number> = {
		january: 1,
		february: 2,
		march: 3,
		april: 4,
		may: 5,
		june: 6,
		july: 7,
		august: 8,
		september: 9,
		october: 10,
		november: 11,
		december: 12,
	};
	return months[month.toLowerCase()] ?? 1;
}