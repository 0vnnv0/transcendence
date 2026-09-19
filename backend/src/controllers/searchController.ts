import prisma from "../lib/prisma.js";
import { PROJECTS } from "../types/coreProjects.js";
import { FastifyRequest, FastifyReply } from 'fastify';

async function searchUsers(searchTerm: string) {
    const loginUsers = await prisma.testUser.findMany({
        where: {
            login: {
                contains: searchTerm,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            login: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
        },
    });

    const nameUsers = await prisma.testUser.findMany({
        where: {
            OR: [
                {
                    firstName: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        },
        select: {
            id: true,
            login: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
        },
    });

    return {
        loginUsers,
        nameUsers,
    };	
}

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
			searchUsers(searchTerm),

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

		const loginUsers = users.loginUsers.slice(0, 5);
		const nameUsers = users.nameUsers.slice(0, 5);		

		const formattedLoginUsers = loginUsers.map((u: any) => ({
			id: u.id,
			title: u.login,
			login: u.login,
			firstName: u.firstName,
			lastName: u.lastName,
			avatarUrl: u.customUrl || u.avatarUrl,
			type: "login",
			url: `/users/${u.login}`,
		}));

		const formattedNameUsers = nameUsers.map((u: any) => ({
			id: u.id,
			title: u.login,
			login: u.login,
			firstName: u.firstName,
			lastName: u.lastName,
			avatarUrl: u.customUrl || u.avatarUrl,
			type: "name",
			url: `/users/${u.login}`,
		}));

        const formattedUsers = [
            ...formattedLoginUsers,
            ...formattedNameUsers,
        ].filter(
            (user, index, self) =>
                index === self.findIndex((u) => u.id === user.id)
        );		

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
			searchUsers(searchTerm),

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

		const loginUsers = users.loginUsers;
		const nameUsers = users.nameUsers;

		const formattedLoginUsers = loginUsers.map((u: any) => ({
			id: u.id,
			title: u.login,
			login: u.login,
			firstName: u.firstName,
			lastName: u.lastName,
			avatarUrl: u.customUrl || u.avatarUrl,
			type: "login",
			url: `/users/${u.login}`,
		}));

		const formattedNameUsers = nameUsers.map((u: any) => ({
			id: u.id,
			title: u.login,
			login: u.login,
			firstName: u.firstName,
			lastName: u.lastName,
			avatarUrl: u.customUrl || u.avatarUrl,
			type: "name",
			url: `/users/${u.login}`,
		}));

        const formattedUsers = [
            ...formattedLoginUsers,
            ...formattedNameUsers,
        ].filter(
            (user, index, self) =>
                index === self.findIndex((u) => u.id === user.id)
        );	

		// const formattedUsers = users.map( (u: any) => ({
		// 	id: u.id,
		// 	title: u.login,
		// 	avatarUrl: u.customUrl || u.avatarUrl,
		// 	type: 'user',
		// 	url: `/users/${u.login}`
		// }));

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