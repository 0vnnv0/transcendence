//pbohme

import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";

export function getUsers(prisma: PrismaClient) {
	return async function (request: FastifyRequest) {
		const {
			coalition,
			rank,
			newCore,
			completed,
			active
		} = request.query as {
			coalition?: string;
			rank?: string;
			newCore?: string;
			completed?: string;
			active?: string;
		};
		const where: any = {};
		
		if (coalition) where.coalitionSlug = coalition;
		if (rank) where.currentRank = Number(rank);
		if (newCore) where.newCore = newCore === "true";

		let users: any[] = await prisma.testUser.findMany({
			where
		});

		if (active) {
			users = users.filter(user => {
				const projects =
					user.activeProjects as
					| { slug: string }[]
					| null;

				return projects?.some(
					p => p.slug === active
				);
			});
		}

		if (completed) {
			users = users.filter(user => {
				const projects = 
					user.completedProjects as 
					string[] | null;
				return projects?.includes(completed);
			});
		}

		return users;
	}
}