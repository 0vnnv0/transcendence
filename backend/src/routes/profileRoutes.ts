/// <reference path="../types/fastify.d.ts" />

//todo: 
// - add password changing logic to this and then add to updateProfileSchema
// - wie soll availability aussehen??
// - add checks for blocked users
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

//schema for validating body for profile modification 
const updateProfileSchema = {
	body: {
	  type: 'object',
	  properties: {
		bio: { type: 'string', maxLength: 300 },
		displayName: { type: 'string', minLength: 2, maxLength: 50 },
//		availability: {type: }
	  },
	  additionalProperties: false
	},
	params: {
	  type: 'object',
	  properties: {
		userId: { type: 'number' }
	  },
	  required: ['userId']
	}
};

//+availability?
interface updateProfileBody {
	bio?: string;
	displayName?: string;
}

interface ProfileRoutesOptions {
    prisma: PrismaClient;
}

export async function profileRoutes(fastify: FastifyInstance, opts: ProfileRoutesOptions)
{
	const prisma = opts.prisma;
	fastify.addHook('preHandler', async (request, reply) => {
		try {
			await request.jwtVerify();
		} catch (err) {
			return reply.code(401).send({ error: 'Unauthorized' });
		}
	});
	fastify.get('/profile/:userId', async (request, response) =>
		getProfileInfo(request, response, fastify, prisma));
	fastify.patch('/profile/:userId', {schema: updateProfileSchema}, async (request, response) =>
		modProfileInfo(request, response, fastify, prisma));
}


async function modProfileInfo(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	// use these next parts to verify that the user is logged in and has access rights, ask about prev validation though, and also add a check for blocked users
	// const usingUserId = request.user.id;
	// if (!usingUserId)
	// 	return response.code(401).send({ error: "You are not logged in." });

	const { userId } = request.params as { userId: Number };
	// if (usingUserId !== userId)
	// 	return response.code(403).send({error: "you can't modify this Users account."})

	const body = request.body as updateProfileBody;
	if (Object.keys(body).length === 0) {
		return response.code(400).send({ error: "No update data provided." });
	}

	try {
		const updatedUser = await prisma.user.update({
		  where: { id: Number(userId) },
		  data: body,
		  select: {
			id: true,
			displayName: true,
			bio: true
		  }
		});

		return response.code(200).send({
		  message: "Profile updated successfully.",
		  user: updatedUser
		});
	
	  } catch (error) {
		fastify.log.error(error);
		return response.code(500).send({ error: "An error occurred while updating the profile." });
	  }
}

async function getProfileInfo(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	// use this next part to verify that the user is logged in and has access rights, ask about prev validation though, and also add a check for blocked users
	// const usingUserId = request.user.id;
	// if (!usingUserId)
	// 	return response.code(401).send({ error: "You are not logged in." });

	const { userId } = request.params as { userId: Number };
	try {

        const userData = await prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
            select: {
				id: true,
				email: true,
				intraName: true,
				displayName: true,
				campusName: true,
				currentRank: true,
				paceDeadline: true,
				blackholeDate: true,
				student: true,
				availability: true,
				bio: true,
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
		console.log(error);
		return response.code(500).send({ error: "Failed to load profile." });
	}
}