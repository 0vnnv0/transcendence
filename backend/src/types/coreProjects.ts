//pbohme

import projectsData from "../data/coreProjects.json";


export interface ProjectDefinition {
	id: number;
	name: string;
	slug: string;
	estimatedHours: number;
	teamSize: {
		min: number;
		max: number;
	};
	xpPoints: number;
	projectRank: number;
	description: string;
	keywords: string[];
	skills: string[];
	oldCore: boolean;
	newCore: boolean;
}

export const PROJECTS: ProjectDefinition[] = projectsData;