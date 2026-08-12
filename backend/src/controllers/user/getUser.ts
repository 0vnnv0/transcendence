//pbohme

import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { FriendService } from "../../services/friendService.js";

const friendService = new FriendService();

export function getUser(prisma: PrismaClient) {
	return async function ( request: FastifyRequest, reply: FastifyReply) {
		const { login } = request.params as { login: string };

		// 1. ID des aktuell eingeloggten Users aus dem JWT-Token holen (falls authentifiziert)
        const currentUserId = (request.user as any)?.id;

		// const user = await prisma.testUser.findUnique({
		// 	where: { login }
		// }); --> ist jetzt target_user

		// 2. Zuerst in der Haupt-User-Tabelle suchen
        let mainUser: any = await prisma.user.findUnique({
            where: { intraName: login }
        });

        let testUser: any = null;

        // 3. Falls nicht in User, in TestUser suchen
        if (!mainUser) {
            testUser = await prisma.testUser.findUnique({
                where: { login }
            });
        } else {
            testUser = await prisma.testUser.findUnique({
                where: { login: mainUser.intraName }
            });
        }

		const user = mainUser ?? testUser;

		if (!user) {
            return reply.status(404).send({
                error: "User not found"
            });
        }

		// 5. Freundschaftsstatus ermitteln (Standard ist 'NONE')
        let friendshipStatus = 'NONE';
        let friendshipId: number | null = null;

		if (currentUserId && 'intraName' in user) {
            const result = await friendService.getFriendshipStatusWith(
                currentUserId,
                user.id
            );
            friendshipStatus = result.status;
            friendshipId = result.friendshipId;
        }

		return reply.send({
            ...user,
            avatarUrl: testUser?.avatarUrl ?? null,
            friendshipStatus,
            friendshipId
        });
	}
}
