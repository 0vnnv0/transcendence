// type CoreProject = {
//   name: string;
//   slug: string;
//   description: string;
//   rank: number;
//   estimatedHours?: number;
//   teamSize?: number;
// };

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