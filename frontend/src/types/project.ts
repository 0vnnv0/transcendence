export interface ProjectData {
	id: number;
	name: string;
	slug: string;
	description: string;
	projectRank: number;
	teamSize: {
		min: number;
		max: number;
	};
	keywords: string[];
}
