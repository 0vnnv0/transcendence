//OLD VERSION 
//just used for reference

import { ProjectDefinition } from "../types/coreProjects.js";
import projectsData from "./coreProjects.json";

const OLD_CORE_EXCLUSIONS = [
	["cub3d", "minirt"],
	["webserv", "ft_irc"]
];

const projects: ProjectDefinition[] = projectsData;

function isExcludedByGroup(
	slug: string, 
	doneSlugs: Set<string>,
	activeSlugs: Set<string> ): boolean {
	for (const group of OLD_CORE_EXCLUSIONS) {
		if (!group.includes(slug)) continue;
		const anyDone = group.some(p => doneSlugs.has(p));
		const anyActive = group.some(p => activeSlugs.has(p));
		if (anyDone || anyActive) {
			return true;
		}
	} 
	return false;
}



export function getNextProject(
	rank: number,
	newCore: boolean,
	projectsUsers: any[]
): ProjectDefinition[] {
	let currentRank = rank;

	while (currentRank <= 6) {

		//kandidaten rausfiltern
		const pool = projects.filter(
			(project) => project.projectRank === currentRank
		);
		//core filter
		const filteredByCore = pool.filter((project) => {
			if (newCore) {
				return project.newCore;
			} else {
				return project.oldCore;
			}
		});

		//finished projects checken
		const doneSlugs = new Set<string>(
			projectsUsers
				.filter(pu =>
					pu.status === "finished" && pu.project?.slug
				)
				.map(pu => pu.project.slug)
		);

		//atives team oder single
		const activeSlugs = new Set<string>();
		for (const pu of projectsUsers) {
			if (!pu.teams) continue;
			for (const team of pu.teams) {
				if (
					team.status !== "finished" &&
					team.users?.some((u:any) => u.validated)
				) {
					activeSlugs.add(pu.project.slug);
				}
			}
		}	

		//finaler filter 
		const available = filteredByCore.filter(project => {
			const slug = project.slug;
			if (doneSlugs.has(slug)) return false;

			if (!newCore) {
				if (isExcludedByGroup(slug, doneSlugs, activeSlugs)) {
					return false;
				}
			}

			if (activeSlugs.has(slug)) return false;
			return true;
		});

		if (available.length > 0) {
			return available;
		}

		currentRank++;
	}

	return [];
}