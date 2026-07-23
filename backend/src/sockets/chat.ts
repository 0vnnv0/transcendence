//TODO on this: 
// - create chat function but for rest route 
// - use online Users array?
// - replace register with some form of authentication
// - maybe mod the db schemas to improve this
// - rn everything fails silently by returning and maybe logging, better error handling?


import { Server } from "socket.io";
import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

//this sets up all socket events needed for chatting
export function setupChatSockets(io: Server, prisma: PrismaClient) {
	const onlineUsers = new Map<number, string>();

	io.on("connection", (socket) => {
		console.log("Socket connected:", socket.id);
		
		socket.on("register", ({ userId }) => 
			registerUser(userId, socket, prisma, onlineUsers));
		socket.on("join_chat", (chatId) => 
			userJoinChat(chatId, socket, prisma));
		socket.on("add_user", (chatId, futureUserId) =>
			addUserToChat(chatId, socket, prisma, futureUserId))
		socket.on("leave_chat", (chatId) => 
			userLeaveChat(chatId, socket, prisma));
		socket.on("send_message", async ({ chatId, content }) => 
			sendMessage(chatId, content, socket, prisma, io));
		socket.on("typing", ({ chatId }) => 
			typingSignal(chatId, socket, prisma));
		socket.on("disconnect", () => 
			userDisconnect(onlineUsers, socket));
	});
}

function onlineCheck(userId: number, onlineUsers: Map<number, string>)
{
	
}

//this temporarily registers different users, needs to be changed once we add authentication
//it also autoconnects users to the chats they were a part of in the past based on db entries
//on the frontend we would have sth like socket.emit("register", { userId: 1 })
async function registerUser(
    userId: unknown,
    socket: Socket,
    prisma: PrismaClient,
    onlineUsers: Map<number, string>
) {
    const id = Number(userId);

    socket.data.userId = id;
    onlineUsers.set(id, socket.id);

    const chats = await prisma.chat.findMany({
        where: {
            users: {
                some: { id },
            },
        },
        select: {
            id: true,
        },
    });

    // Join room for each chat room
    for (const chat of chats) {
        socket.join(`chat_${chat.id}`);
    }
	socket.emit("chat_list", chats);

    console.log(`User ${id} joined ${chats.length} chats`);
}

//used to add another user to a chat, will entirely replace joinChat at some point bc of safety
//returns if user making this request is not in chat and if user to be added does not exist
async function addUserToChat(
	chatId: number,
    socket: Socket,
    prisma: PrismaClient,
	futureUserId: number
) {
	if (!(await isInChat(socket.data.userId, chatId, prisma))) return;
	try {
        await prisma.chat.update({
            where: {
                id: Number(chatId),
            },
            data: {
                users: {
                    connect: {
                        id: Number(futureUserId),
                    },
                },
            },
        });
    } catch (error) {
		socket.emit("error_occurred", {
			message: "Could not add User."
		});
        return;
    }
}

// adds one user to a chat(room), also adds db relation so
// when this user logs in in the future they will 
// automatically be added to the real time chat and will skip this step
async function userJoinChat(
    chatId: unknown,
    socket: Socket,
    prisma: PrismaClient,
) {
	try {
		const userId = socket.data.userId;
		if (!userId) {
			console.log("No userId");
			return;
		}

		await prisma.chat.update({
			where: {
				id: Number(chatId),
			},

			data: {
				users: {
					connect: {
						id: Number(userId),
					},
				},
			},
		});

		socket.join(`chat_${chatId}`);

		console.log(`User ${userId} joined chat ${chatId}`);
	}
	catch (err) {
		console.error(err);
		socket.emit("error_occurred", {
			message: "Could not join Chat."
		});
	}
}

//see userJoinChat (directly above this) but reverse
async function userLeaveChat(
    chatId: unknown,
    socket: Socket,
    prisma: PrismaClient,
) {
	try {
		const userId = socket.data.userId;
		if (!userId) {
			console.log("No userId");
			return;
		}

		await prisma.chat.update({
			where: {
				id: Number(chatId),
			},

			data: {
				users: {
					disconnect: {
						id: Number(userId),
					},
				},
			},
		});

		socket.leave(`chat_${chatId}`);

		console.log(`User ${userId} left chat ${chatId}`);
	}
	catch (err) {
		socket.emit("error_occurred", {
			message: "Could not leave Chat."
		});
		console.error(err);
	}
}

//this registers a message to be sent, saves it to the db and emits it to the designated chat id
async function sendMessage (
	chatId: number, 
	content: String,
	socket: Socket,
    prisma: PrismaClient,
	io: Server
) {
	try {
		const senderId = socket.data.userId;

		if (!senderId) {
			console.log("NO SENDER ID");
			return;
		}
		if (!(await isInChat(senderId, chatId, prisma))) return;
		if (!content || !String(content).trim()) return;

		const message = await prisma.chatMessage.create({
			data: {
				chatId: Number(chatId),
				senderId: Number(senderId),
				content: String(content)
			},
			include: {
				sender: {
					select: {
						id: true,
						intraName: true,
					},
				},
			},
		});
		await prisma.chat.update({
			where: { id: Number(chatId) },
			data: { updatedAt: new Date() }
		});
		console.log(`Sending message to chat_${chatId}`);
		io.to(`chat_${chatId}`).emit("new_message", message);
	}
	catch (err) {
		console.error(err);
		socket.emit("error_occurred", {
			message: "Could not send Message."
		});
	}
}

//emits a typing signal to the other participants
async function typingSignal(chatId: number, socket: Socket, prisma: PrismaClient){
	const userId = socket.data.userId;
	if (!(await isInChat(userId, chatId, prisma))) return;

	socket.to(`chat_${chatId}`).emit("typing", {
		chatId: Number(chatId),
		userId: userId,
	});
}

//registers user disconnect, for now only updates the onlineUsers array, might be unnecessary or updated later
function userDisconnect(onlineUsers: Map<number, string>, socket: Socket) {
	const userId = socket.data.userId;

	if (userId) {
		onlineUsers.delete(userId);
	}

	console.log("Socket disconnected:", socket.id);
}

//helper: tests if user making request is actually part of the chat before sending messages or adding users
export async function isInChat (userId: number, chatId: number, prisma: PrismaClient) {
	const isMember = await prisma.chat.findFirst({
		where: {
			id: chatId,
			users: {
				some: {
					id: userId
				},
			},
		},
		select: {
			id: true,
		},
	});
	return !!isMember;
}