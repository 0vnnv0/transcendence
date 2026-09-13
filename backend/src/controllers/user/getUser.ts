//pbohme

import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { FriendService } from "../../services/friendService.js";

const friendService = new FriendService();

export function getUser(prisma: PrismaClient) {
	return async function ( request: FastifyRequest, reply: FastifyReply) {
		const { login } = request.params as { login: string };

		try {
            await request.jwtVerify();
        } catch (err) {

        }

        const currentUserId = (request.user as any)?.id;

        // const testUser = await Promise.all([
            const testUser = await prisma.testUser.findUnique(
				{ where: { login: login } }
			)
        // ]);

        if (!testUser) {
            return reply.status(404).send({
                error: `User with login '${login}' not found`
            });
        }

        let friendshipStatus = 'NONE';
        let friendshipId: number | null = null;

		const targetUserId = testUser?.id;

        if (currentUserId && targetUserId) {
            const result = await friendService.getFriendshipStatusWith(
                currentUserId,
                targetUserId
            );
            friendshipStatus = result.status;
            friendshipId = result.friendshipId;
        }

		console.log("AVATAR URL: ", testUser.avatarUrl);
        return reply.send({
			...testUser,
            id: testUser.id,
            login: testUser.login,
            intraName: testUser.login,
            intraEmail: testUser.intraEmail,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            avatarUrl: testUser.avatarUrl,
            campusId: testUser.campusId,
            campusName: testUser.campusName,
            currentRank: testUser.currentRank,
            isOnline: testUser.isOnline,
            coalitionName: testUser.coalitionName,
            completedProjects: testUser.completedProjects,
            activeProjects: testUser.activeProjects,
            friendship: {
                status: friendshipStatus,
                id: friendshipId,
            }
        });
	}
}
