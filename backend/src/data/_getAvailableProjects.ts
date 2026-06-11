import { isExcludedByOldCoreRules } from "../lib/projectRules.js";
import { ProjectDefinition } from "../types/coreProjects.js";
import { DBUser } from "../types/DBUser.js";
import { projectsByRank } from "./projectMap.js";

export function getAvailableProjects(user: DBUser, newCore: boolean) {
	const done = new Set(
		(user.completedProjects as any[]).map((p) =>
			typeof p === "string" ? p : p.slug
		)
	);

	const activeProjectMap = new Map<
		string,
		{ hasTeam: boolean; status: string }
	>();

	for (const p of user.activeProjects as any[]) {
		activeProjectMap.set(p.slug, {
			hasTeam: p.hasTeam,
			status: p.status,
		});
	}

	const result: ProjectDefinition[] = [];

	const ranks = Array.from(projectsByRank.keys()).sort((a, b) => a - b);

	for (const rank of ranks) {
		const pool = projectsByRank.get(rank)!;

		const filtered = pool.filter((project) => {
			if (newCore && !project.newCore) return false;
			if (!newCore && !project.oldCore) return false;

			if (done.has(project.slug)) return false;

			const active = activeProjectMap.get(project.slug);
			if (active?.hasTeam === true) {
				return false;
			}

			if (!newCore &&
				isExcludedByOldCoreRules(project.slug, done, activeProjectMap)
			) {
				return false;
			}

			return true;
		});

		result.push(...filtered);
	}
	return result;
}