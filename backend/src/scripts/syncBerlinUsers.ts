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

// dotenv.config({
// 	path: path.resolve(process.cwd(), ".env"),
// });

dotenv.config();

export async function syncBerlinUsers() {
	const service = new FortyTwoService();
	const token = await service.getAccessToken();

	const activeUsers = await fetchActiveUsers();

	const coalitionMap = await fetchCoalitions(service, token);
	const rankMap = await fetchRanks(service, token, activeUsers);
	const projectMap = await fetchProjects(service, token);

	const users = activeUsers.map(u =>
		buildUserBase(u, coalitionMap, rankMap, projectMap)
	);

	await syncToDatabase(prisma, users);
	console.log("\nDONEEEE");
}

syncBerlinUsers().catch(console.error);
