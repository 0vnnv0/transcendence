import axios from "axios";
import { FortyTwoService } from "../fortyTwoService.js";
import { calculateRank } from "../../data/calculateRank.js";
import { addCoalition, addNewCore, addNextProject, addRank, buildBaseUser, isNewCore, monthStringToNumber } from "../../data/buildUserBase.js";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const service = new FortyTwoService();

async function test() {

	const testUser = "tiaurin";

	const token = await service.getAccessToken();
	await sleep(600);

	const apiUser = await service.getUserData(testUser, token);
	await sleep(600);

	const questsUsers = await service.getUserQuests(testUser, token);
	await sleep(600);

	const coalitions = await service.getUserCoalitions(apiUser.id, token);
	await sleep(600);

	const projectsUsers = await service.getUserProjects(apiUser.id, token);

	const rank = calculateRank(questsUsers);

	const selectedIn = {
		month: monthStringToNumber(apiUser.pool_month),
		year: Number(apiUser.pool_year)
	};

	const newCore = isNewCore(questsUsers);

	let user = buildBaseUser(apiUser);
	user = addRank(user, rank);
	user = addCoalition(user, coalitions);
	user = addNewCore(user, newCore);
	user = addNextProject(user, selectedIn, projectsUsers);

	console.log("\n--- FINAL USER ---");
	console.dir(user, { depth: null });
}

test();