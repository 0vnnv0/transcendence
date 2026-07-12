//pbohme

import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { getAvailableProjects } from "../../data/getAvailableProjects.js";

export function getNextProjects(prisma: PrismaClient) {
	return async function(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { login } = request.params as { login: string };
		const user = await prisma.testUser.findUnique({
			where: { login }
		});

		if (!user) {
			return reply.status(404).send({
				error: "User not found"
			});
		}

		const available = getAvailableProjects(
			user,
			user.newCore ?? false
		);

		if (available.length === 0) {
			return reply.code(404).send({
				error: "no available projects found"
			})
		}

		const userRank = user.currentRank ?? 0;
		const filteredProjects = available.filter(
			project => project.projectRank >= userRank
		);

		if (filteredProjects.length === 0) {
			return reply.code(404).send({
				error: "No available projects found"
			});
		}

		return {
			login: user.login,
			availableProjects: filteredProjects
		};
	}
}