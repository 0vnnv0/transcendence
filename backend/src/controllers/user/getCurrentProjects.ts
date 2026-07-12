//pbohme

import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { getAvailableProjects } from "../../data/getAvailableProjects.js";

export function getCurrentProjects(prisma: PrismaClient) {
	return async function(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { login } = request.params as { login: string; };

		const user = await prisma.testUser.findUnique({
			where: { login }
		});

		if (!user) {
			return reply.code(404).send({
				error: "User not found"
			});
		}

		const available = getAvailableProjects(
			user,
			user.newCore ?? false
		);

		if (available.length === 0) {
			return reply.code(404).send({
				error: "No available projects found"
			});
		}

		const userRank = user.currentRank ?? 0;

		let targetRank: number | null = null;

		for (let rank = userRank; rank <= 6; rank++) {
			const projectsAtRank = available.filter(
				project => project.projectRank === rank
			);

			if (projectsAtRank.length > 0) {
				targetRank = rank;
				break;
			}
		}

		if (targetRank === null) {
			return reply.code(404).send({
				error: "No available projects found"
			});
		}

		const currentProjects = available.filter(
			project => project.projectRank === targetRank
		);

		return {
			login: user.login,
			projects: currentProjects
		};

	}
}