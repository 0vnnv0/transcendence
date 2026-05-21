import { Project } from "../../types/coreProjects.js";
import projectsData from "../../data/coreProjects.json";

const projects: Project[] = projectsData;

//vielleicht auch andere logic nach welchem core man sucht...
function isOldCore(month: number, year: number): boolean {
	if (year < 2025) return true;
	if (year === 2025 && month < 9) return true;
	return false;
}

export function getNextProject(
	rank: number,
	selectedIn: { month: number; year: number }
): Project[] {
	let currentRank = rank;

	while (currentRank <= 6) {
		const pool = projects.filter(
			(project) => project.projectRank === currentRank
		);

		const filtered = pool.filter((project) => {
			if (isOldCore(selectedIn.month, selectedIn.year)) {
				return project.oldCore;
			} else {
				return project.newCore;
			}
		});

		if (filtered.length > 0) {
			return filtered;
		}

		currentRank++;
	}

	return [];
}