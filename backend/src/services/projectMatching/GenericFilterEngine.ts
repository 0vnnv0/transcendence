import { User } from "../../types/User.js";
import { Filter } from "./filterTypes.js";

function matchesHoursRange(userHours: number, range: string): boolean {
	switch (range) {
		case "0-10": 
			return userHours >= 0 && userHours <= 10;
		case "11-20": 
			return userHours >= 11 && userHours <= 20;
		case "21-30": 
			return userHours >= 21 && userHours <= 30;
		case "30+":
			return userHours > 30;
		default:
			return false;
	}
}

export function applyFilters(users: User[], filters: Filter[]): User[] {
	return users.filter((user) => {
		return filters.every((filter) => {
			switch (filter.key) {
				case "rank":
					return user.rank === filter.value;

				case "preferredOnCampus": 
					return user.preferredOnCampus == filter.value;

				case "hoursPerWeek":
					return user.hoursPerWeek !== undefined &&
						matchesHoursRange(user.hoursPerWeek, filter.value);

				default:
					return true;
			}
		});
	});
}