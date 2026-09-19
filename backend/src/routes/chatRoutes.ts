//this sets upp all routes related to chats and messages

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { isInChat } from "../sockets/chat.js";

export async function chatRoutes(fastify: FastifyInstance, prisma: PrismaClient)
{
	fastify.get('/chats', { onRequest: [fastify.authenticate] }, async (request, response) => 
		loadChats(fastify, prisma, request, response));
	fastify.get('/chat/:chatId', { onRequest: [fastify.authenticate] }, async (request, response) =>
		loadMessages(fastify, prisma, request, response));
	fastify.post('/chats', { onRequest: [fastify.authenticate] }, async (request, response) =>
        createChat(fastify, prisma, request, response));
}

//loads the past 50 messages once you open chat and has the capacity to load the next 50 messages on a cursor request until the end (but havent tested this)
//it returns the messages and the next cursor that should be used for the next call to this to retreve the next 50
//returns null for this property when we get to the end
async function loadMessages(fastify: FastifyInstance, prisma: PrismaClient, request: FastifyRequest, response: FastifyReply)
{
	const userId = (request.user as { id: number }).id;
	if (!userId)
		return response.code(401).send({ error: "Unauthorized access." });

	const { chatId } = request.params as { chatId: number };
	const { cursorId: rawCursorId } = request.query as { cursorId?: string };
	const cursorId = rawCursorId ? Number(rawCursorId) : undefined;

	const userInChat = await isInChat(userId, chatId, prisma);
	if (!userInChat) {
		return response.code(403).send({ error: "You are not part of this chat." });
	}

	try {
		const limit = 50;
		const chat = await prisma.chat.findUnique({
			where: { id: Number(chatId) },
			include: { users: true }
		});

		if (!chat) {
			return response.code(404).send({ error: "Chat not found." });
		}

		const messages = await prisma.chatMessage.findMany({
			where: { chatId: Number(chatId) },
			orderBy: { createdAt: "desc" },
			take: limit,
			...(cursorId && { skip: 1, cursor: { id: cursorId } }),
			include: {
				sender: { select: { id: true, login: true, avatarUrl: true, isOnline: true } },
			},
		});

		const nextCursor = messages.length === limit ? messages[messages.length - 1]?.id : null;
		const chronologicalMessages = messages.reverse();

		const participants = chat.users.map(u => ({
			id: u.id,
			intraName: u.login,
			avatarUrl: u.avatarUrl ?? undefined,
			isOnline: u.isOnline,
			customAvatar: u.customAvatar
		}));

		return {
			messages: chronologicalMessages.map(m => ({
				...m,
				sender: {
					id: m.sender.id,
					intraName: m.sender.login,
					avatarUrl: m.sender.avatarUrl ?? undefined,
					isOnline: m.sender.isOnline,
					customAvatar: m.sender.customAvatar
				}
			})),
			nextCursor,
			participants
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
	const userId = (request.user as { id: number }).id;
	if (!userId)
		return response.code(401).send({ error: "Unauthorized access." });

	try {
		const userChats = await prisma.chat.findMany({
			where: {
				users: {
					some: { id: userId }
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

		return response.send(userChats);
	} catch (error) {
		fastify.log.error(error);
		return response.code(500).send({ error: "Failed to load chats." });
	}
}

// creates a new 1-on-1 chat or returns the existing one if they already have a chat history
async function createChat(fastify: FastifyInstance, prisma: PrismaClient, request: FastifyRequest, response: FastifyReply)
{
    const { currentUserId, targetUserId } = request.body as { 
        currentUserId: number; 
        targetUserId: number; 
    };
	const userId = (request.user as { id: number }).id;
	console.log("userid: " + userId + "current: " + currentUserId);
	
	if (!userId  || userId !== currentUserId)
		return response.code(401).send({ error: "Unauthorized access." });

    if (!currentUserId || !targetUserId) {
        return response.code(400).send({ error: "Missing currentUserId or targetUserId in body" });
    }

    try {
        const existingChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { users: { some: { id: currentUserId } } },
                    { users: { some: { id: targetUserId } } }
                ]
            }
        });

        if (existingChat) {
            return { chatId: existingChat.id };
        }

        const newChat = await prisma.chat.create({
            data: {
                users: {
                    connect: [
                        { id: currentUserId },
                        { id: targetUserId }
                    ]
                }
            }
        });

        return { chatId: newChat.id };
        
    } catch (error) {
        fastify.log.error(error);
        return response.code(500).send({ error: "Failed to create chat." });
    }
}
