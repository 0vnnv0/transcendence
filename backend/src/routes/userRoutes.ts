//pbohme
//alle routes die irgendwie mit usern bzw den zugehoerigen daten aus der database zu tun haben

import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { getUsers } from "../controllers/user/getUsers.js";
import { getUser } from "../controllers/user/getUser.js";
import { getMatches } from "../controllers/user/getMatches.js";
import { getProjects } from "../controllers/user/getProjects.js";


export async function userRoutes(
	server: FastifyInstance,
	prisma: PrismaClient
) {
	server.get("/users", getUsers(prisma));
	server.get("/users/:login", getUser(prisma));
	server.get("/users/:login/projects", getProjects(prisma));
	// server.get("/users/:login/next-project", getNextProjects(prisma));
	// server.get("/users/:login/next-project/current", getCurrentProjects(prisma));
	server.get("/users/:login/:slug/matches", getMatches(prisma)); 
}
