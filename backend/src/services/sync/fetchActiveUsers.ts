//pbohme

import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildActiveBerlinUsers } from "./build/buildActiveBerlinUsers.js";

export async function fetchActiveUsers(service: FortyTwoService) {
	console.log("\x1b[1mFETCHING USERS...\x1b[0m");
	const coreUsers = await service.fetchQuestUsers(37, { validated: false });
	console.log("🐻 Berlin core: ", coreUsers.length);

	const activeUsers = buildActiveBerlinUsers(coreUsers);
	console.log("🔥 Berlin active core: ", activeUsers.length);
	
	await sleep(1000);
	return activeUsers;
}