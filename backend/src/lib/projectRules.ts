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

		// 1. schon fertig in der Gruppe?
		const anyDone = group.some((p) => doneSlugs.has(p));

		// 2. irgendeins der Projekte ist aktiv (egal ob team oder nicht)
		const anyActive = group.some((p) => activeProjectMap.has(p));

		if (anyDone || anyActive) {
			return true;
		}
	}

	return false;
}