
import { sleep } from "../../utils/sleep.js";
import { FortyTwoService } from "../fortyTwoService.js";
import { buildActiveBerlinUsers } from "./build/buildActiveBerlinUsers.js";

export async function fetchActiveUsers(service: FortyTwoService) {
	const coreUsers = await service.fetchQuestUsers(37, { validated: false });
	console.log("Berlin core: ", coreUsers.length);

	const activeUsers = buildActiveBerlinUsers(coreUsers);
	console.log("Berlin active core: ", activeUsers.length);
	
	await sleep(1000);
	return activeUsers;
}