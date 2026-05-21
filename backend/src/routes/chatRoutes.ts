//DUMMIE
// whn u click on a user --> "chat"
//either with one user or multiple users
import { FastifyInstance } from "fastify";

import { users } from "../data/loadUsers.js";

export async function chatRoutes(server: FastifyInstance) {

	server.get("/chat", async (request, reply) => {

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
	});
}