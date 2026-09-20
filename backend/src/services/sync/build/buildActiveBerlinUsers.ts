//pbohme

export function buildActiveBerlinUsers(coreUsers: any[]) {
	return coreUsers
		.filter(q => q.user?.['active?'] === true)
		.filter(q => q.user?.['alumni?'] === false)
		.map(q => q.user);
}
