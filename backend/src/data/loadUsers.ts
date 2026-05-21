//DUMMIE
// this creates random users as a replacement for the API
// frage: erstaml alle user laden? oder bei allem -> request an die API?
import { User } from "../types/User.js";

const NUMBER_OF_USERS = 300;

const campuses = ["Berlin", "Heilbronn", "Wolfsburg"];

function getRandomCampus(): string {
	return campuses[Math.floor(Math.random() * campuses.length)];
}

function getRandomRank(): number {
	return Math.floor(Math.random() * 7); // 0 - 6
}

export const users: User[] = Array.from(
	{ length: NUMBER_OF_USERS },
	(_, index) => ({
		id: index + 1,
		login: `user${index + 1}`,
		campus: getRandomCampus(),
		rank: getRandomRank(),
	})
);