//pbohme
//fuer das alte curriculum: entweder-oder projekte schliessen sich gegenseitig aus
//immer wenn das relevant ist (erledigte projekte, etc) wird die funktion gecallet

export const OLD_CORE_EXCLUSIONS: string[][] = [
	["cub3d", "minirt"],
	["webserv", "ft_irc"],
];

type ActiveProjectInfo = {
	hasTeam: boolean;
	status: string;
};

export function isExcludedByOldCoreRules(
	slug: string,
	doneSlugs: Set<string>,
	activeProjectMap: Map<string, ActiveProjectInfo>
): boolean {
	for (const group of OLD_CORE_EXCLUSIONS) {
		if (!group.includes(slug)) continue;

		for (const project of group) {
			if (project === slug) continue;

			if (doneSlugs.has(project)) {
				return true;
			}

			if (activeProjectMap.has(project)) {
				return true;
			}
		}
	}

	return false;
}