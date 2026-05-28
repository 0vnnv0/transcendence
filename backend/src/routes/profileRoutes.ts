import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

export async function setupProfileRoutes(fastify: FastifyInstance, prisma: PrismaClient)
{
	fastify.get('/profile/:userId', async (request, response) =>
		getProfileInfo(request, response, fastify, prisma));
}

async function getProfileInfo(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	// use this next part to verify that the user is logged in and has access rights, ask about prev validation though, and also add a check for blocked users
	//const usingUserId = request.user.id;
	//if (!usingUserId)
	//	return response.code(401).send({ error: "You are not logged in." });

	const { userId } = request.params as { userId: Number };
	try {

        const userData = await prisma.user.findMany({
            where: {
                id: Number(userId),
            },
            select: {
				id: true,
				email: true,
				intraName: true,
				campusName: true,
				currentRank: true,
				paceDeadline: true,
				blackholeDate: true,
				student: true,
				availability: true,
				quests: {
					include: {}
				},
				projects: {
					include: {}
				},
			}
        });

        return {
			userData
		};
	} catch (error) {
		fastify.log.error(error);
		return response.code(500).send({ error: "Failed to load profile." });
	}
}