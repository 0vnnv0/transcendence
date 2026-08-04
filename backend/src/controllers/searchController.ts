import prisma from "../lib/prisma.js";
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
				select: { id: true, login: true }
			}),

			// search project by project name
			prisma.project.findMany({
				where: {
					name: { contains: searchTerm, mode: 'insensitive'}
				},
				take: 5,
				select: { id: true, name: true}
			})
		]);
		// save found users and projects
		const formattedUsers = users.map( (u: any) => ({
			id: u.id,
			title: u.login,
			type: 'user',
			url: `/users/${u.login}`
		}));

		const formattedProjects = projects.map( (p: any) => ({
			id: p.id,
			title: p.name,
			type: 'project',
			url: `/projects/${p.id}`
		}));

		return reply.send([...formattedUsers, ...formattedProjects]);

	} catch (error) {
		request.log.error(error);
		return reply.status(500).send({ error: 'Internal Server Error' })
	}

};