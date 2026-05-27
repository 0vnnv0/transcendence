//DUMMIE
// whn u click on a user --> "chat"
//either with one user or multiple users
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

//import { users } from "../data/loadUsers.js";
import { PrismaClient } from "@prisma/client";
import { isInChat } from "../sockets/chat.js";

export async function chatRoutes(fastify: FastifyInstance, prisma: PrismaClient)
{
	fastify.get('/chats', async (request, response) => loadChats(fastify, prisma, request, response));
	fastify.get('/chat/:chatId', async (request, response) => loadMessages(fastify, prisma, request, response));
/*	server.get("/chat", async (request, reply) => {

		const query = request.query as {
			id?: string | string[];
		};

		if (!query.id) {
			return {
				message: "No user id provided",
			};
		}

		const ids = Array.isArray(query.id)
			? query.id.map(Number)
			: [Number(query.id)];

		const matchedUsers = users.filter((user) =>
			ids.includes(user.id)
		);

		if (matchedUsers.length === 0) {
			return {
				message: "No users found",
			};
		}

		return {
			message:
				matchedUsers.length === 1
					? "Chat with user"
					: "Chat with multiple users",

			users: matchedUsers,
		};
	});*/
}

//loads the past 50 messages once you open chat and has the capacity to load the next 50 messages on a cursor request until the end (but havent tested this)
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

	if (!isInChat(userId, chatId, prisma))
		return response.code(403).send({ error: "You are not part of this chat." });

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

//returns all chats that user is a part of
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