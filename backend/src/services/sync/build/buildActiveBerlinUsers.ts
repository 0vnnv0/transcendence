export function buildActiveBerlinUsers(coreUsers: any[]) {
	return coreUsers
		.filter(q => q.user?.['active?'] === true)
		.filter(q => q.user?.['alumni?'] === false)
		.map(q => q.user);
}

// export function buildActiveBerlinUsers(
// 	berlinUsers: any[],
// 	coreUsers: any[]
// ) {
// 	const berlinIds = new Set(
// 		berlinUsers.map(u => u.id)
// 	);

// 	const activeCoreIds = new Set(
// 		coreUsers
// 			.filter(q => q.validated_at === null)
// 			.map(q => q.user.id)
// 	)

// 	const activeUsers = berlinUsers.filter( user =>
// 		activeCoreIds.has(user.id)
// 	);

// 	return activeUsers;
// }