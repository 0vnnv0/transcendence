import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { getUsers } from "../controllers/user/getUsers.js";
import { getUser } from "../controllers/user/getUser.js";
import { getNextProjects } from "../controllers/user/getNextProjects.js";
import { getCurrentProjects } from "../controllers/user/getCurrentProjects.js";
import { getMatches } from "../controllers/user/getMatches.js";


export async function userRoutes(
	server: FastifyInstance,
	prisma: PrismaClient
) {
	server.get("/users", getUsers(prisma));
	server.get("/users/:login", getUser(prisma));
	server.get("/users/:login/next-project", getNextProjects(prisma));
	server.get("/users/:login/next-project/current", getCurrentProjects(prisma));
	server.get("/users/:login/:slug/matches", getMatches(prisma)); 
}
