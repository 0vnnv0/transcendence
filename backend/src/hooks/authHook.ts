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
		return reply.code(401).send({
			error: 'Unauthorized',
			message: 'Invalid token.'
		});
	}
}

export const redirectIfLoggedIn = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // 1. Schauen, ob überhaupt ein Token im Header mitsendet wurde
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return; // Kein Token da? Perfekt, der User ist Gast. Mach normal weiter!
 
		}
        
        const token = authHeader.split(' ')[1];

        // 2. Mathematisch prüfen, ob das Token valide ist
        await request.jwtVerify();

        // 3. Prüfen, ob das Token auf der Blacklist steht
        const isBlacklisted = await prisma.blacklistedTokens.findUnique({
            where: { token }
        });

        // 4. Wenn das Token gültig UND nicht geblacklistet ist -> User IST eingeloggt!
        if (!isBlacklisted) {
            // Option A: Direkt per HTTP-Redirect umleiten (gut für API-Anfragen)
            // return reply.redirect('http://localhost:8080/dashboard');

            // Option B: Dem Frontend mit 403 Forbidden sagen: "Du darfst hier nicht rein"
            return reply.code(403).send({
                error: 'Forbidden',
                message: 'Already logged in. Go to dashboard.',
                redirectTo: '/dashboard'
            });
        }
    } catch (err) {
        // Falls jwtVerify fehlschlägt (Token abgelaufen/ungültig), ist das super!
        // Das bedeutet, der User ist effektiv ein Gast. Wir loggen nichts und lassen ihn durch.
        return; 
    }
};