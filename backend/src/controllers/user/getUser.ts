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

        const [mainUser, testUser] = await Promise.all([
            prisma.user.findUnique({ where: { intraName: login } }),
            prisma.testUser.findUnique({ where: { login } })
        ]);

        if (!mainUser && !testUser) {
            return reply.status(404).send({
                error: "User not found"
            });
        }

        let friendshipStatus = 'NONE';
        let friendshipId: number | null = null;

		const targetUserId = mainUser?.id ?? testUser?.id;

        if (currentUserId && targetUserId) {
            const result = await friendService.getFriendshipStatusWith(
                currentUserId,
                targetUserId
            );
            friendshipStatus = result.status;
            friendshipId = result.friendshipId;
        }

        const baseData = mainUser ?? testUser;

        return reply.send({
            ...baseData,
            intraName: mainUser?.intraName ?? testUser?.login,
            avatarUrl: testUser?.avatarUrl ?? mainUser?.avatarUrl ?? null,
            friendship: {
                status: friendshipStatus,
                id: friendshipId,
            }
        });
	}
}
