export type Filter =
	| { key: "rank"; value: number }
	| { key: "preferredOnCampus"; value: boolean }
	| { key: "hoursPerWeek", value: "0-10" | "11-20" | "21-30" | "30+" };
	// | { key: "favoriteCluster"; value: string}
	// | { key: "finishedWhen"; value: string};