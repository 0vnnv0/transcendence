import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { authenticateApiKey } from "./apiAuth.js";
import { getUsers } from "../controllers/user/getUsers.js";
import { getUser } from "../controllers/user/getUser.js";
import { getProjects } from "../controllers/user/getProjects.js";
import { getMatches } from "../controllers/user/getMatches.js";
import { PublicFriendController } from "./publicFriendController.js";
import prisma from "../lib/prisma.js";

const publicFriendController = new PublicFriendController(prisma);

export async function apiRoutes(
    server: FastifyInstance,
    prisma: PrismaClient
) {
    server.register(async (api) => {

        api.addHook("onRequest", authenticateApiKey);

		//Users	
		api.get("/users", getUsers(prisma));
		api.get("/users/:login", getUser(prisma));
		api.get(
			"/users/:login/projects",
			getProjects(prisma)
		);
		api.get(
			"/users/:login/:slug/matches",
			getMatches(prisma)
		);

		//Ftiendships
		api.get(
			"/friendships/:login",
			publicFriendController.getFriendships
		);

		api.post(
			"/friendships",
			publicFriendController.createFriendship
		);

		api.put(
			"/friendships/:id",
			publicFriendController.updateFriendship
		);

		api.delete(
			"/friendships/:id",
			publicFriendController.deleteFriendship
		);	
	}, {prefix: "/api"});
}