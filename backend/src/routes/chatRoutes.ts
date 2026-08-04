//this sets upp all routes related to chats and messages

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { isInChat } from "../sockets/chat.js";

export async function chatRoutes(fastify: FastifyInstance, prisma: PrismaClient)
{
	fastify.get('/chats', async (request, response) => 
		loadChats(fastify, prisma, request, response));
	fastify.get('/chat/:chatId', async (request, response) =>
		loadMessages(fastify, prisma, request, response));
}

//loads the past 50 messages once you open chat and has the capacity to load the next 50 messages on a cursor request until the end (but havent tested this)
//it returns the messages and the next cursor that should be used for the next call to this to retreve the next 50
//returns null for this property when we get to the end
async function loadMessages(fastify: FastifyInstance, prisma: PrismaClient, request: FastifyRequest, response: FastifyReply)
{
	//only need this next bit until JWT is implemented: const userId = request.user.id;
	const { userId } = request.query as { userId?: number };
	if (!userId) {
		return response.code(400).send({ error: "Missing userId query parameter" });
	}

	const { chatId } = request.params as { chatId: number};

	const { cursorId: rawCursorId } = request.query as { cursorId?: string };
	const cursorId = rawCursorId ? Number(rawCursorId) : undefined;

	const userInChat = await isInChat(userId, chatId, prisma);
	if (!userInChat) {
		return response.code(403).send({ error: "You are not part of this chat." });
	}

	try {
        const limit = 50;

        const messages = await prisma.chatMessage.findMany({
            where: {
                chatId: Number(chatId),
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
            ...(cursorId && {
                skip: 1, 
                cursor: { id: cursorId },
            }),
            include: {
                sender: {
                    select: {
                        id: true,
                        intraName: true,
                    },
                },
            },
        });
		const nextCursor = messages.length === limit ? messages[messages.length - 1]?.id : null;
        const chronologicalMessages = messages.reverse();
        return {
            messages: chronologicalMessages,
            nextCursor: nextCursor
		};
	} catch (error) {
		fastify.log.error(error);
		return response.code(500).send({ error: "Failed to load messages." });
	}
}

//returns all chats that user is a part of in the order of last messages within chat
//return values include the db colums that the chat owns plus user data plus the last message in that chat for preview
async function loadChats(fastify: FastifyInstance, prisma: PrismaClient, request: FastifyRequest, response: FastifyReply)
{
	//only need this next bit until JWT is implemented: const userId = request.user.id;
	const { userId } = request.query as { userId?: string };
	if (!userId) {
		return response.code(400).send({ error: "Missing userId query parameter" });
	}

	try {
		const userChats = await prisma.chat.findMany({
			where: {
				users: {
					some: { id: Number(userId) }
				}
			},
			orderBy: {
				updatedAt: 'desc'
			},
			include: {
				users: true,
				messages: {
					take: 1,
					orderBy: { createdAt: 'desc' }
				}
			}
		});

		return userChats;
	} catch (error) {
		fastify.log.error(error);
		return response.code(500).send({ error: "Failed to load chats." });
	}
}