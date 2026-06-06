import { ProjectDefinition, PROJECTS } from "../types/coreProjects.js";

export const projectBySlug = new Map<string, ProjectDefinition>();
export const projectsByRank = new Map<number, ProjectDefinition[]>();

for (const project of PROJECTS) {
	projectBySlug.set(project.slug, project);

	if (!projectsByRank.has(project.projectRank)) {
		projectsByRank.set(project.projectRank, []);
	}

	projectsByRank.get(project.projectRank)!.push(project);
}