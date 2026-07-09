/// <reference path="../types/fastify.d.ts" />

//todo:
// - wie soll availability aussehen??
// - add checks for blocked users
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
    region: "eu-north-1"
});

const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp"
];

async function getS3Url(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	const userId = request.user.id;
	if (!userId)
		return response.code(401).send({ error: "You are not logged in." });

	const body = request.body as {
		contentType: string;
	};
	const contentType = body.contentType;

	if (typeof contentType === 'string') {
		if (!allowedTypes.includes(contentType))
			return response.code(415).send({error: "invalid file type."});
	}
	else {
		return response.code(400).send({error: "could not find content type header."});
	}
    const key = `uploads/${userId}`;

    const command =
        new PutObjectCommand({
            Bucket: "clusterfuck-s3-bucket",
            Key: key,
            ContentType: contentType
        });

    const uploadUrl =
        await getSignedUrl(
            s3,
            command,
            {
                expiresIn: 300
            }
        );

	return response.code(200).send({
		uploadUrl,
		key
		});
}

//schema for validating body for profile modification 
const updateProfileSchema = {
	body: {
	  type: 'object',
	  properties: {
		bio: { type: 'string', maxLength: 300 },
		displayName: { type: 'string', maxLength: 50 },
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
	fastify.delete('/profile/:userId', async (request, response) =>
		deleteProfile(request, response, fastify, prisma));
	fastify.post("/upload-url", async (req, reply) =>
		getS3Url(req, reply, fastify, prisma));
}


async function modProfileInfo(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	// use these next parts to verify that the user is logged in and has access rights, ask about prev validation though, and also add a check for blocked users
	const usingUserId = request.user.id;
	if (!usingUserId)
		return response.code(401).send({ error: "You are not logged in." });

	const { userId } = request.params as { userId: Number };
	if (Number(usingUserId) !== Number(userId))
		return response.code(403).send({error: "you can't modify this Users account."})

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
	const usingUserId = request.user.id;
	if (!usingUserId)
		return response.code(401).send({ error: "You are not logged in." });

	const { userId } = request.params as { userId: any };
	console.log("userId" + Number(userId));
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
		if (!userData) {
			return response.code(404).send({ error: "User profile not found." });
		}
        return {
			userData
		};
	} catch (error) {
		fastify.log.error(error);
		console.log(error);
		return response.code(500).send({ error: "Failed to load profile." });
	}
}

async function deleteProfile(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	// use these next parts to verify that the user is logged in and has access rights, ask about prev validation though, and also add a check for blocked users
	const usingUserId = request.user.id;
	if (!usingUserId)
		return response.code(401).send({ error: "You are not logged in." });

	const { userId } = request.params as { userId: Number };
	if (Number(usingUserId) !== Number(userId))
		return response.code(403).send({error: "you can't delete another Users account."})

	try {
		const updatedUser = await prisma.user.delete({
		  where: { id: Number(userId) },
		});

		return response.code(200).send({
		  message: "Profile deleted successfully.",
		  user: updatedUser
		});
	
	  } catch (error) {
		fastify.log.error(error);
		return response.code(500).send({ error: "An error occurred while deleting the profile." });
	  }
}