// type CoreProject = {
//   name: string;
//   slug: string;
//   description: string;
//   rank: number;
//   estimatedHours?: number;
//   teamSize?: number;
// };


export interface Project {
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