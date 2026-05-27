import { User } from "../../types/User.js";
import { getNextProject } from "./getNextProject.js";

function randomLogin(): string {
	const chars = "abcdefghijklmnopqrstuvwxyz";
	const length = 6 + Math.floor(Math.random() * 6);

	return Array.from({ length }, () =>
		chars[Math.floor(Math.random() * chars.length)]
	).join("");
}

function randomCampus(): string {
	return "Berlin";
}

function randomRank(): number {
	return Math.floor(Math.random() * 7); // 0–6
}

function randomMonth(): number {
	const months = [2, 3, 9, 10];
	return months[Math.floor(Math.random() * months.length)];
}

function randomYear(): number {
	return 2023 + Math.floor(Math.random() * 3); // 2023–2025
}

function randomHoursPerWeek(): number {
	return 5 + Math.floor(Math.random() * 46); // 5–50
}

function randomPreferredOnCampus(): boolean {
	return Math.random() < 0.7; // 70% onCampus, 30% not
}

export function generateUsers(count = 500): User[] {
	return Array.from({ length: count }, (_, i) => {
		const rank = randomRank();

		const selectedIn = {
			month: randomMonth(),
			year: randomYear()
		};

		return {
			id: i + 1,
			login: randomLogin(),
			campus: randomCampus(),
			rank,
			selectedIn,
			nextProject: getNextProject(rank, selectedIn),

			preferredOnCampus: randomPreferredOnCampus(),
			hoursPerWeek: randomHoursPerWeek()	
		};
	});
}

// const users = generateUsers();

// const users = generateUsers(10);

// console.log(JSON.stringify(users, null, 2));