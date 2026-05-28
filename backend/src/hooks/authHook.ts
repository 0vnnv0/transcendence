import prisma from "../lib/prisma.js";
import { FastifyRequest, FastifyReply } from "fastify";

export const checkJwtAndBlacklist = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		await request.jwtVerify();

		const authHeader = request.headers.authorization;
		const token = authHeader?.split(' ')[1];

		if (!token) {
			return reply.code(401).send({
				error: 'Unauthorized',
			message: 'Token missing.'
		});
		}

		const isBlacklisted = await prisma.blacklistedToken.findUnique({
			where: { token }
		});

		if (isBlacklisted) {
			return reply.code(401).send({
				error: 'Unauthorized',
				message: 'This token is invalid.'
			});
		}
	} catch (err){
		return reply.code(401).send({
			error: 'Unauthorized',
			message: 'Invalid token.'
		});
	}
};