//pbohme

import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { PROJECTS } from "../../types/coreProjects.js";
import { isExcludedByOldCoreRules } from "../../lib/projectRules.js";

function getProjectMeta(slug:string) {
	return PROJECTS.find(p => p.slug === slug)
}

export function getMatches(prisma: PrismaClient) {
	return async function(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { login, slug } = request.params as {
			login: string;
			slug: string;
		};

		const { rank, coalition, completed } = request.query as {
			rank?: string;
			coalition?: string;
			completed?: string;
		};

		const rankFilter = rank ? Number(rank) : null;

		const user = await prisma.testUser.findUnique({
			where: { login }
		});

		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		const friendships: any[] = await prisma.friendship.findMany({
			where: {
				status: "ACCEPTED",
				OR: [
					{ senderId: user.id },
					{ receiverId: user.id }
				]
			}
		});

		const friendIds = new Set(
			friendships.map(friendship =>
				friendship.senderId === user.id
					? friendship.receiverId
					: friendship.senderId
			)
		);

		const comp = (user.completedProjects as string[] | null) ?? [];
		if (comp.includes(slug)) {
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

		if (!user.newCore) {
			const doneSlugs = new Set(
				user.completedProjects as string[] | null ?? []
			);

			const userActive =
				(user.activeProject as {
					slug: string;
					status: string;
					hasTeam: boolean;
				}[] | null) ?? [];

			const activeProjectMap = new Map(
				userActive.map(project => [
					project.slug,
					{
						hasTeam: project.hasTeam,
						status: project.status
					}
				])
			);
			if (
				isExcludedByOldCoreRules(
					slug,
					doneSlugs,
					activeProjectMap
				)
			) {
				return reply.code(409).send({
					error: "Project is excluded because another project on this rank is already completed or active"
				});
			}
		}

		let users: any[] = await prisma.testUser.findMany({
			include: { availability: true },
		});

		//MATCHING LOGIK

		const matches = users.filter(candidate => {
			if (candidate.id === user.id) return false;

			//FILTER checken
			if (rankFilter !== null) {
				if (candidate.currentRank !== rankFilter) return false;
			}
			if (coalition) {
				if (candidate.coalitionSlug !== coalition) return false;
			}

			if (completed) {
				const candidateCompleted =
					(candidate.completedProjects as string[] | null) ?? [];

				if (!candidateCompleted.includes(completed)) return false;
			}

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

			if (!candidate.newCore) {
				const candidateDoneSlugs = new Set(candidateCompleted);

				const candidateActiveProjectMap = new Map(
					candidateActive.map(project => [
						project.slug,
						{
							hasTeam: project.hasTeam,
							status: project.status
						}
					])
				);

				if (
					isExcludedByOldCoreRules(
						slug,
						candidateDoneSlugs,
						candidateActiveProjectMap
					)
				) {
					return false;
				}
			}

			// core match
			const candidateMetaOk =
				candidate.newCore === user.newCore;

			if (!candidateMetaOk) return false;

			const userRank = user.currentRank ?? 0;
			const candidateRank = candidate.currentRank ?? 0;
			if (candidateRank < userRank - 1) return false;
			if (candidateRank > projectMeta.projectRank) return false;

			return true;
		});

		const matchesWithFriendship = matches.map(candidate => ({
			...candidate,
			isFriend: friendIds.has(candidate.id)
		}));

		// 6. RETURN
		return {
			project: slug,
			user: user.login,
			matches: matchesWithFriendship
		};
	}
}
