
import { sleep } from "../../utils/sleep.js";
import { fetchBerlinCoreUsers } from "../fetchBerlinCoreUsers.js";
import { buildActiveBerlinUsers } from "./build/buildActiveBerlinUsers.js";

export async function fetchActiveUsers() {
	const coreUsers = await fetchBerlinCoreUsers();
	console.log("Berlin core: ", coreUsers.length);

	const activeUsers = buildActiveBerlinUsers(coreUsers);
	console.log("Berlin active core: ", activeUsers.length);
	
	await sleep(1000);
	return activeUsers;
}