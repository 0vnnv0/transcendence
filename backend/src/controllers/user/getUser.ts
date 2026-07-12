//pbohme

import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export function getUser(prisma: PrismaClient) {
	return async function (
		request: FastifyRequest,
		reply: FastifyReply) {
		const { login } = request.params as { login: string };

		const user = await prisma.testUser.findUnique({
			where: { login }
		});

		if (!user) {
			return reply.status(404).send({
				error: "User not found"
			});
		}
		return user;
	}
}