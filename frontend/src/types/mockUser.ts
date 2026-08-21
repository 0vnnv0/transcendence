import type { FullUserProfile } from './user.ts'; // adjust import path to your actual types file

// NOTE: ActiveProject and Friendship weren't provided in the interfaces you shared,
// so I assumed a reasonable shape for mock purposes. Adjust field names to match
// your real types if these are off.
//
// interface ActiveProject {
//   id: number;
//   name: string;
//   status: 'in_progress' | 'searching_a_group' | 'finished';
// }
//
// interface Friendship {
//   status: 'pending' | 'accepted';
// }

export const mockUsers: FullUserProfile[] = [
	{
		id: 1,
		login: 'jdoe',
		email: 'jdoe@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=1',
		firstName: 'Jane',
		lastName: 'Doe',
		intraUrl: 'https://profile.intra.42.fr/users/jdoe',
		currentRank: 3,
		coalitionName: 'The Federation',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'in_progress' }],
		// friendship: null,
		preferredDays: [], // empty -> should render "Mon-Sun"
		isRemote: false,
	},
	{
		id: 2,
		login: 'amuller',
		email: 'amuller@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=2',
		firstName: 'Anna',
		lastName: 'Muller',
		intraUrl: 'https://profile.intra.42.fr/users/amuller',
		currentRank: 5,
		coalitionName: 'The Assembly',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: { status: 'accepted' },
		preferredDays: ['Mon'], // single day -> "Mon"
		isRemote: true,
	},
	{
		id: 3,
		login: 'kzimmer',
		email: 'kzimmer@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=3',
		firstName: 'Karl',
		lastName: 'Zimmer',
		intraUrl: 'https://profile.intra.42.fr/users/kzimmer',
		currentRank: 2,
		coalitionName: 'The Order',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: { status: 'pending' },
		preferredDays: ['Mon', 'Wed'], // 2 days, not consecutive -> "Mon, Wed"
		isRemote: false,
	},
	{
		id: 4,
		login: 'lschmidt',
		email: 'lschmidt@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=4',
		firstName: 'Lena',
		lastName: 'Schmidt',
		intraUrl: 'https://profile.intra.42.fr/users/lschmidt',
		currentRank: 7,
		coalitionName: 'The Federation',
		activeProjects: [{ hasTeam: false, slug: 'cub3d', status: 'in_progress' }],
		// friendship: null,
		preferredDays: ['Tue', 'Wed', 'Thurs'], // 3 consecutive -> comma list (<=3 rule), "Tue, Wed, Thu"
		isRemote: true,
	},
	{
		id: 5,
		login: 'mgarcia',
		email: 'mgarcia@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=5',
		firstName: 'Miguel',
		lastName: 'Garcia',
		intraUrl: 'https://profile.intra.42.fr/users/mgarcia',
		currentRank: 4,
		coalitionName: 'The Assembly',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: { status: 'accepted' },
		preferredDays: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri'], // 5 consecutive -> single span "Mon-Fri"
		isRemote: false,
	},
	{
		id: 6,
		login: 'sweber',
		email: 'sweber@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=6',
		firstName: 'Sophie',
		lastName: 'Weber',
		intraUrl: 'https://profile.intra.42.fr/users/sweber',
		currentRank: 6,
		coalitionName: 'The Order',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: null,
		preferredDays: ['Wed', 'Thurs', 'Fri', 'Sat'], // 4 consecutive -> "Wed-Sat"
		isRemote: true,
	},
	{
		id: 7,
		login: 'tklein',
		email: 'tklein@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=7',
		firstName: 'Tom',
		lastName: 'Klein',
		intraUrl: 'https://profile.intra.42.fr/users/tklein',
		currentRank: 1,
		coalitionName: 'The Federation',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: { status: 'pending' },
		preferredDays: ['Mon', 'Tue', 'Fri', 'Sat', 'Sun'], // disjoint spans -> "Mon-Tue, Fri-Sun"
		isRemote: false,
	},
	{
		id: 8,
		login: 'nwolf',
		email: 'nwolf@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=8',
		firstName: 'Nina',
		lastName: 'Wolf',
		intraUrl: 'https://profile.intra.42.fr/users/nwolf',
		currentRank: 8,
		coalitionName: 'The Assembly',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: { status: 'accepted' },
		preferredDays: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'], // all 7 -> "Mon-Sun"
		isRemote: true,
	},
	{
		id: 9,
		login: 'fbauer',
		email: 'fbauer@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=9',
		firstName: 'Felix',
		lastName: 'Bauer',
		intraUrl: 'https://profile.intra.42.fr/users/fbauer',
		currentRank: 9,
		coalitionName: 'The Order',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: null,
		preferredDays: ['Sat', 'Sun'], // 2 days, consecutive but under threshold -> "Sat, Sun"
		isRemote: false,
	},
	{
		id: 10,
		login: 'hkoch',
		email: 'hkoch@student.42.fr',
		avatarUrl: 'https://i.pravatar.cc/150?img=10',
		firstName: 'Hannah',
		lastName: 'Koch',
		intraUrl: 'https://profile.intra.42.fr/users/hkoch',
		currentRank: 10,
		coalitionName: 'The Federation',
		activeProjects: [{ hasTeam: false, slug: 'ft_transcendence', status: 'searching_a_group' }],
		// friendship: { status: 'pending' },
		preferredDays: ['Tue', 'Thurs', 'Sat'], // 3 days, scattered, unordered input on purpose -> tests sorting, "Tue, Thu, Sat"
		isRemote: true,
	},
];
