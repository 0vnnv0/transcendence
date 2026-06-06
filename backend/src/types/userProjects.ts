export type ActiveProject = {
	slug: string;
	hasTeam: boolean;
	status: string;
}

export type UserProjects = {
	completedProjects: string[];
	activeProjects: ActiveProject[];
}