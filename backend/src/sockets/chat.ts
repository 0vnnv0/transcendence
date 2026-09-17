//TODO on this: 



import { Server } from "socket.io";
import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../serverSetup.js";

interface JwtPayload {
    id: number;
    username?: string;
}


//this sets up all socket events needed for chatting
export function setupChatSockets(io: Server, prisma: PrismaClient) {
	const onlineUsers = new Map<number, string>();

	io.use(async (socket: Socket, next) => {
        try {
            let token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.split(" ")[1];
            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }
			if (token.startsWith("Bearer ")) {
				token = token.substring(7);
			}
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            if (!decoded?.id) {
                return next(new Error("Authentication error: Invalid payload"));
            }
            socket.data.userId = Number(decoded.id);
            next();
        } catch (err) {
			console.error("❌ Socket JWT Verification Error:", err);
            return next(new Error("Authentication error: Unauthorized"));
        }
    });

	io.on("connection", (socket) => {
		console.log("Socket connected:", socket.id);
		
		socket.on("register", ({ userId }) => 
			registerUser(userId, socket, prisma, onlineUsers));
		socket.on("add_user", (chatId, futureUserId) =>
			addUserToChat(chatId, socket, prisma, futureUserId))
		socket.on("leave_chat", (chatId) => 
			userLeaveChat(chatId, socket, prisma));
		socket.on("send_message", async ({ chatId, content }) => 
			sendMessage(chatId, content, socket, prisma, io));
		socket.on("typing", ({ chatId }) => 
			typingSignal(chatId, socket, prisma));
		socket.on("disconnect", () => 
			userDisconnect(onlineUsers, socket, io));
		socket.on("join_chat_room", ({ chatId }) => {
			socket.join(`chat_${Number(chatId)}`);
			console.log(`Socket ${socket.id} joined room chat_${chatId}`);
		});
	});
}

async function getUsernameById(prisma: PrismaClient,userId: number): Promise<string | null> {
	const user = await prisma.testUser.findUnique({
	  where: { id: userId },
	  select: { login: true },
	});
  
	return user ? user.login : null;
  }

//this temporarily registers different users, needs to be changed once we add authentication
//it also autoconnects users to the chats they were a part of in the past based on db entries
//on the frontend we would have sth like socket.emit("register", { userId: 1 })
//
//also broadcasts to all users that this user is now online so it can be shown to everyone via socket event "user_online"
//and sends to itself(frontend) an array which contains every user thats currently online so they can be displayed
async function registerUser(
    userId: unknown,
    socket: Socket,
    prisma: PrismaClient,
    onlineUsers: Map<number, string>
) {
    const id = socket.data.userId as number;

	const username = await getUsernameById(prisma, id);
	if (!username)
	{
		console.warn(`Registration failed: User with ID ${id} not found in database.`);
        socket.emit("error", { message: "User not found" });
        socket.disconnect(true);
        return;
	}
    onlineUsers.set(id, username);

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

	socket.broadcast.emit("user_online", { userId: id });

    // Join room for each chat room
    for (const chat of chats) {
        socket.join(`chat_${chat.id}`);
    }
	socket.emit("chat_list", chats);
    socket.emit("initial_online_users", onlineUsers);

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

// deletes user making this request from a given chat (both on socket and in db)
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
// async function sendMessage (
// 	chatId: number, 
// 	content: String,
// 	socket: Socket,
//     prisma: PrismaClient,
// 	io: Server
// ) {
// 	try {
// 		const senderId = socket.data.userId;

// 		if (!senderId) {
// 			console.log("NO SENDER ID");
// 			return;
// 		}
// 		if (!(await isInChat(senderId, chatId, prisma))) return;
// 		if (!content || !String(content).trim()) return;

// 		const message = await prisma.chatMessage.create({
// 			data: {
// 				chatId: Number(chatId),
// 				senderId: Number(senderId),
// 				content: String(content)
// 			},
// 			include: {
// 				sender: {
// 					select: {
// 						id: true,
// 						login: true,
// 					},
// 				},
// 			},
// 		});
// 		await prisma.chat.update({
// 			where: { id: Number(chatId) },
// 			data: { updatedAt: new Date() }
// 		});
// 		console.log(`Sending message to chat_${chatId}`);
// 		//io.to(`chat_${chatId}`).emit("new_message", message);
// 		io.to(`chat_${chatId}`).emit("new_message", {
// 			...message,
// 			sender: {
// 				id: message.sender.id,
// 				intraName: message.sender.login,
// 				avatarUrl: (message.sender as any).avatarUrl ?? undefined
// 			}
// 		});
// 	}
// 	catch (err) {
// 		console.error(err);
// 		socket.emit("error_occurred", {
// 			message: "Could not send Message."
// 		});
// 	}
// }

async function sendMessage (
    chatId: number, 
    content: String,
    socket: Socket,
    prisma: PrismaClient,
    io: Server
) {
    try {
        console.log("➡️ [SOCKET] send_message received:", { chatId, content });

        const senderId = socket.data.userId;
        console.log("➡️ [SOCKET] senderId from socket.data:", senderId);

        if (!senderId) {
            socket.emit("error_occurred", { message: "Unauthorized socket session" });
            return;
        }

        const userInChat = await isInChat(senderId, chatId, prisma);
        console.log(`➡️ [SOCKET] Is user ${senderId} in chat ${chatId}?`, userInChat);

        if (!userInChat) {
            socket.emit("error_occurred", { message: "You are not in this chat" });
            return;
        }

        if (!content || !String(content).trim()) {
            return;
        }

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
                        login: true,
                    },
                },
            },
        });

        await prisma.chat.update({
            where: { id: Number(chatId) },
            data: { updatedAt: new Date() }
        });

        // Broadcast with intraName formatting
        const formattedMessage = {
            ...message,
            sender: {
                id: message.sender.id,
                intraName: message.sender.login,
                avatarUrl: undefined
            }
        };

        io.to(`chat_${chatId}`).emit("new_message", formattedMessage);
    }
    catch (err) {
        socket.emit("error_occurred", {
            message: "Could not send Message."
        });
    }
}

//emits a typing event to the other participants so that can be displayed but it really doesnt have to be there
async function typingSignal(chatId: number, socket: Socket, prisma: PrismaClient){
	const userId = socket.data.userId;
	if (!(await isInChat(userId, chatId, prisma))) return;

	socket.to(`chat_${chatId}`).emit("typing", {
		chatId: Number(chatId),
		userId: userId,
	});
}

//registers user disconnect and emits socket event "user_offline" to everyone else so they can display online status correctly
function userDisconnect(onlineUsers: Map<number, string>, socket: Socket, io: Server) {
	const userId = socket.data.userId;

	if (userId) {
		onlineUsers.delete(userId);
		io.emit("user_offline", { userId });
	}

	console.log("Socket disconnected:", socket.id);
}

//helper: tests if user making request is actually part of the chat before sending messages or adding users
export async function isInChat(userId: number, chatId: number, prisma: PrismaClient) {
	const isMember = await prisma.chat.findFirst({
		where: {
			id: Number(chatId),
			users: { some: { id: Number(userId) } }
		},
		select: { id: true }
	});
	return !!isMember;
}