
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

export function setupChatSockets(io: Server, prisma: PrismaClient) {
	const onlineUsers = new Map<number, string>();

	io.on("connection", (socket) => {
		console.log("Socket connected:", socket.id);

		// --------------------------------
		// TEMP REGISTER (until auth exists)
		// frontend:
		// socket.emit("register", { userId: 1 })
		// --------------------------------
		socket.on("register", async ({ userId }) => {
			const id = Number(userId);

			socket.data.userId = id;
			onlineUsers.set(id, socket.id);

			// auto join all chats this user belongs to
			const chats = await prisma.chat.findMany({
				where: {
					users: {
						some: {
							id,
						},
					},
				},
				select: {
					id: true,
				},
			});

			for (const chat of chats) {
				socket.join(`chat_${chat.id}`);
			}

			console.log(`User ${id} joined ${chats.length} chats`);
		});

		// --------------------------------
		// Join one chat manually
		// --------------------------------
		socket.on("join_chat", (chatId) => {

			console.log(`Joining manually: chat_${chatId}`);
			socket.join(`chat_${chatId}`);
		});

		// --------------------------------
		// Leave chat
		// --------------------------------
		socket.on("leave_chat", (chatId) => {
			socket.leave(`chat_${chatId}`);
		});

		// --------------------------------
		// Send message
		// frontend:
		// socket.emit("send_message", {
		//   chatId: 5,
		//   content: "hello"
		// })
		// --------------------------------
		socket.on("send_message", async ({ chatId, content }) => {
			try {
				const senderId = socket.data.userId;

				if (!senderId) {
					console.log("NO SENDER ID");
					return;
				}
				if (!content || !String(content).trim()) return;

				const message = await prisma.chatMessage.create({
					data: {
						chatId: Number(chatId),
						senderId: Number(senderId),
						content: String(content),
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

				console.log(`Sending message to chat_${chatId}`);
				io.to(`chat_${chatId}`).emit("new_message", message);
			} catch (err) {
				console.error(err);
			}
		});

		// --------------------------------
		// Typing indicator
		// --------------------------------
		socket.on("typing", ({ chatId }) => {
			socket.to(`chat_${chatId}`).emit("typing", {
				userId: socket.data.userId,
			});
		});

		// --------------------------------
		// Disconnect
		// --------------------------------
		socket.on("disconnect", () => {
			const userId = socket.data.userId;

			if (userId) {
				onlineUsers.delete(userId);
			}

			console.log("Socket disconnected:", socket.id);
		});
	});
}