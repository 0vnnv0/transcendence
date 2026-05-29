import prisma from '../lib/prisma.js';
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

		const isBlacklisted = await prisma.blacklistedTokens.findUnique({
			where: { token }
		});

		if (isBlacklisted) {
			return reply.code(401).send({
				error: 'Unauthorized',
				message: 'This token is invalid.'
			});
		}
	} catch (err: any) {
    // DIESE ZEILE ZEIGT UNS DEN ECHTEN GRUND IM TERMINAL:
		console.error("❌ JWT VERIFICATION CRASHED:", err.message);
		
		return reply.code(401).send({ 
		error: 'Unauthorized', 
		message: 'Ungültiges Token.',
		debugReason: err.message // Gibt den Fehler testweise ans Frontend weiter
		});
		// return reply.code(401).send({
		// 	error: 'Unauthorized',
		// 	message: 'Invalid token.'
		// });
	}
}