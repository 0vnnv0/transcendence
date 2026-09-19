import prisma from "../lib/prisma.js";
import { PROJECTS } from "../types/coreProjects.js";
import { FastifyRequest, FastifyReply } from 'fastify';

export const globalSearch = async (request: FastifyRequest, reply: FastifyReply) => {
	const { q } = request.query as { q?: string };

	if (!q || q.trim().length < 2) {
		return reply.send({
			users: [],
			projects: []
		});
	}

	const searchTerm = q.trim();

	try {
		// parallel search
		const [users, projects] = await Promise.all([
			// search user by Intra Name
			prisma.testUser.findMany({
				where: {
					login: { contains: searchTerm, mode: 'insensitive'}
				},
				take: 5, // return only first 5 elements
				select: { id: true, login: true, avatarUrl: true }
			}),

			Promise.resolve(
				PROJECTS.filter((project) => {
					const searchableText = [
						project.name,
					]
						.join(" ")
						.toLowerCase();

					return searchableText.includes(searchTerm.toLowerCase());
				}).slice(0, 5)
			)
		]);
		const formattedUsers = users.map( (u: any) => ({
			id: u.id,
			title: u.login,
			avatarUrl: u.customUrl || u.avatarUrl,
			type: 'user',
			url: `/users/${u.login}`
		}));

		const formattedProjects = projects.map( (p: any) => ({
			id: p.id,
			title: p.name,
			type: 'project',
			projectRank: p.projectRank,
			slug: p.slug,
			keywords: p.keywords,
			url: `/project/${(p.slug).toLowerCase()}`
		}));

		return reply.send([...formattedUsers, ...formattedProjects]);

	} catch (error) {
		request.log.error(error);
		return reply.status(500).send({ error: 'Internal Server Error' })
	}

};


export const fullSearch = async (request: FastifyRequest, reply: FastifyReply) => {
	const { q } = request.query as { q?: string };

	if (!q || q.trim().length < 2) {
		return reply.send({
			users: [],
			projects: []
		});
	}

	const searchTerm = q.trim();

	try {
		// parallel search
		const [users, projects] = await Promise.all([
			// search user by Intra Name
			prisma.testUser.findMany({
				where: {
					login: { contains: searchTerm, mode: 'insensitive'}
				},
				select: { id: true, login: true, avatarUrl: true }
			}),

			Promise.resolve(
				PROJECTS.filter((project) => {
					const searchableText = [
						project.name,
					]
						.join(" ")
						.toLowerCase();

					return searchableText.includes(searchTerm.toLowerCase());
				})
			)
		]);
		const formattedUsers = users.map( (u: any) => ({
			id: u.id,
			title: u.login,
			avatarUrl: u.customUrl || u.avatarUrl,
			type: 'user',
			url: `/users/${u.login}`
		}));

		const formattedProjects = projects.map( (p: any) => ({
			id: p.id,
			title: p.name,
			type: 'project',
			projectRank: p.projectRank,
			slug: p.slug,
			keywords: p.keywords,
			url: `/project/${(p.name).toLowerCase()}`
		}));

		return reply.send([...formattedUsers, ...formattedProjects]);

	} catch (error) {
		request.log.error(error);
		return reply.status(500).send({ error: 'Internal Server Error' })
	}

};
