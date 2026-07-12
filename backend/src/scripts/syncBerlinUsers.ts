import dotenv from "dotenv";
import path from "path";

import prisma from "../lib/prisma.js";

import { FortyTwoService } from "../services/fortyTwoService.js";
import { fetchActiveUsers } from "../services/sync/fetchActiveUsers.js";
import { fetchCoalitions } from "../services/sync/fetchCoalitions.js";
import { fetchProjects } from "../services/sync/fetchProjects.js";
import { buildUserBase } from "../services/sync/build/buildUserBase.js";
import { syncToDatabase } from "../services/sync/write/syncToDatabase.js";
import { fetchRanks } from "../services/sync/fetchRanks.js";
import { getAccessToken } from "../services/token.js";
import { FortyTwoClient } from "../services/fortyTwoClient.js";

// dotenv.config({
// 	path: path.resolve(process.cwd(), ".env"),
// });

dotenv.config();

export async function syncBerlinUsers() {
	const token = await getAccessToken();
	const client = new FortyTwoClient(token);
	const service = new FortyTwoService(client);

	const activeUsers = await fetchActiveUsers(service);

	const coalitionMap = await fetchCoalitions(service);
	const rankMap = await fetchRanks(service, activeUsers);
	const projectMap = await fetchProjects(service);

	const users = activeUsers.map(u =>
		buildUserBase(u, coalitionMap, rankMap, projectMap)
	);

	await syncToDatabase(prisma, users);
	console.log("\nDONEEEE");
}

syncBerlinUsers().catch(console.error);
