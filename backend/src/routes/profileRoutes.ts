/// <reference path="../types/fastify.d.ts" />

//todo:

//if using delete need to add deleting the pfp

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export const s3 = new S3Client({
    region: "eu-north-1"
});
const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp"
];
const MAX_FILE_SIZE = 2 * 1024 * 1024;



//schema for validating body for profile modification 
const updateProfileSchema = {
	body: {
	  type: 'object',
	  properties: {
		bio: { type: 'string', maxLength: 300 },
		availability: {
			type: 'object',
			properties: {
			  workDaysPerWeek: { type: 'integer', minimum: 1, maximum: 7 },
			  startDate: { type: 'string', format: 'date-time' },
			  endDate: { type: 'string', format: 'date-time' },
			  preferredDays: {
				type: 'array',
				items: { type: 'string' }
			  },
			  isRemote: { type: 'boolean' }
			},
			required: ['workDaysPerWeek', 'preferredDays', 'isRemote'],
			additionalProperties: false
		  }
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

const confirmAvatarSchema = {
	type: 'object',
	required: ['avatarUrl'],
	properties: {
	  avatarUrl: { 
		type: 'string',
		minLength: 1 
	  },
	},
  } as const;

interface AvailabilityInput {
    workDaysPerWeek: number;
    startDate: string;
    endDate: string;
    preferredDays: string[];
    isRemote?: boolean;
}

interface updateProfileBody {
	bio?: string;
	displayName?: string;
	availability?: AvailabilityInput;
}

interface ProfileRoutesOptions {
    prisma: PrismaClient;
}

interface ConfirmAvatarBody {
	avatarUrl: string;
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
	// changed get to post cause we need a body and this cannot be sent with get
	fastify.post("/upload-url", async (req, reply) =>
		getS3Url(req, reply, fastify, prisma));
	fastify.post<{ Body: ConfirmAvatarBody }>('/api/users/:userId/avatar', {schema: {body: confirmAvatarSchema}}, async (request, reply) => 
		updateS3Link(request, reply, fastify, prisma));
}

async function getProfileInfo(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	const usingUserId = request.user?.id;
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
				intraName: true,
				campusName: true,
				currentRank: true,
				paceDeadline: true,
				blackholeDate: true,
				coalitionName:true,
				bio: true,
				quests: {
					include: {}
				},
				projects: {
					include: {}
				},
				availability: {
					include: {}
				},
				newCore: true,
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

async function modProfileInfo(
    request: FastifyRequest, 
    response: FastifyReply, 
    fastify: FastifyInstance, 
    prisma: PrismaClient
) {
    const usingUserId = request.user?.id;
    if (!usingUserId) {
        return response.code(401).send({ error: "You are not logged in." });
    }

    const { userId } = request.params as { userId: number };
    if (Number(usingUserId) !== Number(userId)) {
        return response.code(403).send({ error: "You can't modify this user's account." });
    }

    const { availability, ...userFields } = request.body as updateProfileBody;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                ...userFields,
                ...(availability && {
                    availability: {
                        upsert: {
                            create: {
                                workDaysPerWeek: availability.workDaysPerWeek ?? 5,
                                startDate: availability.startDate ? new Date(availability.startDate) : new Date(),
                                endDate: availability.endDate ? new Date(availability.endDate) : new Date(),
                                preferredDays: availability.preferredDays ?? [],
                                isRemote: availability.isRemote ?? false
                            },
                            update: {
                                ...(availability.workDaysPerWeek !== undefined && { workDaysPerWeek: availability.workDaysPerWeek }),
                                ...(availability.startDate && { startDate: new Date(availability.startDate) }),
                                ...(availability.endDate && { endDate: new Date(availability.endDate) }),
                                ...(availability.preferredDays && { preferredDays: availability.preferredDays }),
                                ...(availability.isRemote !== undefined && { isRemote: availability.isRemote })
                            }
                        }
                    }
                })
            },
            select: {
                id: true,
                bio: true,
                intraName: true,
                availability: true
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

async function getS3Url(request: FastifyRequest, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
    const userId = request.user?.id;
    if (!userId) {
        return response.code(401).send({ error: "you are not logged in." });
    }

    const body = request.body as { contentType?: string };
    const contentType = body?.contentType;

    if (!contentType || typeof contentType !== 'string') {
        return response.code(400).send({ error: "missing or invalid contentType in request body." });
    }

    if (!allowedTypes.includes(contentType)) {
        return response.code(415).send({ error: "invalid file type. Only JPEG, PNG, and WebP are allowed." });
    }

    const key = `uploads/${userId}`;
	const bucketName = process.env.AWS_S3_BUCKET_NAME;
	if (typeof bucketName !== 'string')
		return response.code(500).send({ error: "missing bucket name" });

    try {
        const { url, fields } = await createPresignedPost(s3, {
            Bucket: bucketName,
            Key: key,
            Conditions: [
                ["eq", "$Content-Type", contentType],
                ["content-length-range", 1, MAX_FILE_SIZE],
            ],
            Fields: {
                "Content-Type": contentType,
            },
            Expires: 300,
        });

        return response.code(200).send({
            url,
            fields,
            key,
        });
    } catch (err) {
        request.log.error(err);
        return response.code(500).send({ error: "failed to generate upload URL." });
    }
}

async function updateS3Link(request: FastifyRequest<{ Body: ConfirmAvatarBody }>, response: FastifyReply, fastify: FastifyInstance, prisma: PrismaClient)
{
	const userId = request.user?.id;
    if (!userId) {
        return response.code(401).send({ error: "you are not logged in." });
    }

	const { avatarUrl } = request.body;

	let s3Key: string;
    try {
        const parsedUrl = new URL(avatarUrl);
        s3Key = parsedUrl.pathname.replace(/^\//, ''); 
    } catch {
        return response.code(400).send({ error: "Invalid avatar URL format." });
    }

	if (!s3Key.startsWith(`avatars/${userId}`)) {
		return response.code(403).send({ error: 'Unauthorized object key' });
	}

	try {
		const headData = await s3.send(new HeadObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: s3Key,
		}));

		await prisma.user.update({
			where: { id: userId },
			data: { customAvatar: avatarUrl }
		});

		return response.code(200).send({avatarKey: avatarUrl });
	} catch (err: any) {
		if (err.name === 'NotFound') {
		return response.code(404).send({ error: 'Image was not found in S3.' });
		}
		return response.code(500).send({ error: 'Failed to verify upload' });
	}
};

