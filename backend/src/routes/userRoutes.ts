import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { getAvailableProjects } from "../data/_getAvailableProjects.js";
import { ProjectDefinition, PROJECTS } from "../types/coreProjects.js";

function getProjectMeta(slug:string) {
	return PROJECTS.find(p => p.slug === slug)
}

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


//MISSING: cub3d/minirt und webserv/ft_irc exclusions
	fastify.get("/users/:login/:slug/matches", async (request, reply) => {
		const { login, slug } = request.params as {
			login: string;
			slug: string;
		};

		const user = await prisma.testUser.findUnique({
			where: { login }
		});

		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		const completed = (user.completedProjects as string[] | null) ?? [];
		if (completed.includes(slug)) {
			return reply.code(409).send({
				error: "Project already completed"
			});
		}

		const active = (user.activeProjects as {
			slug: string;
			status: string;
			hasTeam: boolean;
		}[] | null) ?? [];

		const activeProject = active.find(p => p.slug === slug);

		if (activeProject?.hasTeam) {
			return reply.code(409).send({
				error: "You already have a team"
			});
		}

		const projectMeta = getProjectMeta(slug);
		if (!projectMeta) {
			return reply.code(404).send({
				error: "Project not found"
			});
		}

		if (
			(user.newCore && !projectMeta.newCore) ||
			(!user.newCore && !projectMeta.oldCore)
		) {
			return reply.code(403).send({
				error: "Project is not part of your core curriculum"
			});
		}

		let users: any[] = await prisma.testUser.findMany();

		//MATCHING LOGIK

		const matches = users.filter(candidate => {
			if (candidate.id === user.id) return false;

			// completed check
			const candidateCompleted =
				(candidate.completedProjects as string[] | null) ?? [];

			if (candidateCompleted.includes(slug)) return false;

			// active + has team check
			const candidateActive =
				(candidate.activeProjects as {
					slug: string;
					status: string;
					hasTeam: boolean;
				}[] | null) ?? [];

			const candidateActiveProject = candidateActive.find(
				p => p.slug === slug
			);

			if (candidateActiveProject?.hasTeam) return false;

			// core match
			const candidateMetaOk =
				candidate.newCore === user.newCore;

			if (!candidateMetaOk) return false;

			// rank range logic (angepasst)
			const rankDiff = Math.abs(
				(user.currentRank ?? 0) - (candidate.currentRank ?? 0)
			);

			if (rankDiff > 1) return false;

			return true;
		});

		// 6. RETURN
		return {
			project: slug,
			user: user.login,
			matches
		};
	});
		
	fastify.get(
		"/users/:login/next-project/current",
		async (request, reply) => {
			const { login } = request.params as {
				login: string;
			};

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
	);
 


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

		if (available.length === 0) {
			return reply.code(404).send({
				error: "no available projects found"
			})
		}

		return {
			login: user.login,
			availableProjects: available
		};
	});

	fastify.get("/users/:login", async (request, reply) => {
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
	});
}