import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { getAvailableProjects } from "../data/_getAvailableProjects.js";

export async function userRoutes(
	fastify: FastifyInstance,
	prisma: PrismaClient,
) {
fastify.get("/users", async (request) => {
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

	if (coalition)
		where.coalitionSlug = coalition;

	if (rank)
		where.currentRank = Number(rank);

	if (newCore)
		where.newCore = newCore === "true";

	let users: any[] = await prisma.testUser.findMany({
		where
	});

	if (active) {
		users = users.filter(user => {
			const projects = user.activeProjects as
				| { slug: string }[]
				| null;

			return projects?.some(p => p.slug === active);
		});
	}

	if (completed) {
		users = users.filter(user => {
			const projects = user.completedProjects as string[] | null;

			return projects?.includes(completed);
		});
	}

	return users;

	});

	fastify.get("/users/:login/next-project", async (request, reply) => {
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

		return {
			login: user.login,
			availableProjects: available
		};
	});
}