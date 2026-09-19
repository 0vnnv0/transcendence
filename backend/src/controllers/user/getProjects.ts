//pbohme

import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { getAvailableProjects } from "../../data/getAvailableProjects.js";
import { ProjectDefinition, PROJECTS } from "../../types/coreProjects.js";

export function getProjects(prisma: PrismaClient) {
	return async function (
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { login } = request.params as { login: string };
		const { view = "available" } = request.query as {
			view?: "available" | "current" | "recommended";
		};

		const user = await prisma.testUser.findUnique({
			where: { login },
		});

		if (!user) {
			return reply.code(404).send({
				error: "User not found",
			});
		}

		const done = user.completedProjects.length ?? 0;
		const requiredGroupProjects = user.newCore ? 7 : 5;

		if (done >= requiredGroupProjects) {
			return reply.code(200).send({
				status: "completed",
				message: "All group projects completed.",
				projects: [],
			});
		}

		const available = getAvailableProjects(
			user,
			user.newCore ?? false
		);
		
		console.log("USER RANK:", user.currentRank);
		console.log("NEW CORE:", user.newCore);
		console.log(
			"AVAILABLE:",
			available.map(p => ({
				slug: p.slug,
				rank: p.projectRank,
			}))
		);
		console.log("ACTIVE:", user.activeProjects);

		const userRank = user.currentRank ?? 0;

		switch (view) {
			case "available": {
				const projects = available.filter(
					project => project.projectRank >= userRank
				);

				return {
					login: user.login,
					projects,
				};
			}

			case "current": {

				let targetRank: number | null = null;

				for (let rank = userRank; rank <= 6; rank++) {
					if (
						available.some(
							project => project.projectRank === rank
						)
					) {
						targetRank = rank;
						break;
					}
				}

				if (targetRank === null) {
					return reply.code(404).send({
						error: "No current projects found",
					});
				}

				const projects = available.filter(
					project => project.projectRank === targetRank
				);

				return {
					login: user.login,
					projects,
				};
			}

			case "recommended": {
				let targetRank: number | null = null;

				for (let rank = userRank; rank <= 6; rank++) {
					if (
						available.some(
							project => project.projectRank === rank
						)
					) {
						targetRank = rank;
						break;
					}
				}

				if (targetRank === null) {
					return {
						login: user.login,
						projects: [],
					};
				}

				const projects = available
					.filter(project => project.projectRank > targetRank)
					.sort((a, b) => a.projectRank - b.projectRank)
					.slice(0, 3);

				return {
					login: user.login,
					projects,
				};
			}

			default:
				return reply.code(400).send({
					error: "Invalid view",
				});
		}
	};
}