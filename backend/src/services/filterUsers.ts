//DUMMIE
// filtering users by rank or campus
// will be implemente with API

import { User } from "../types/User";

type FilterValue = string | number;

type Filters = {
	[key: string]: FilterValue;
};

const allowedFilters = ["campus", "rank"];

export function filterUsers(
	users: User[],
	filters: Filters
): User[] {
	return users.filter((user) => {
		return Object.entries(filters).every(([key, value]) => {

			if (!allowedFilters.includes(key))
				return true;

			const userValue = user[key as keyof User];

			return String(userValue) === String(value);
		});
	});
}