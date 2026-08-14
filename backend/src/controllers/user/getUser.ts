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

		// 2. Parallel oder nacheinander in beiden Tabellen suchen
        const [mainUser, testUser] = await Promise.all([
            prisma.user.findUnique({ where: { intraName: login } }),
            prisma.testUser.findUnique({ where: { login } })
        ]);

        // 3. Falls weder mainUser noch testUser existieren -> 404
        if (!mainUser && !testUser) {
            return reply.status(404).send({
                error: "User not found"
            });
        }
// 4. Freundschaftsstatus initialisieren
        let friendshipStatus = 'NONE';
        let friendshipId: number | null = null;

        // 5. Status ermitteln, WENN mainUser existiert und ein Token mitgeschickt wurde
        if (currentUserId && mainUser) {
            const result = await friendService.getFriendshipStatusWith(
                currentUserId,
                mainUser.id
            );
            friendshipStatus = result.status;
            friendshipId = result.friendshipId;
        }

        // 6. Antwort zusammenbauen: 
        // WICHTIG: mainUser hat Vorrang vor testUser, damit id & intraName stimmen!
        const baseData = mainUser ?? testUser;

        return reply.send({
            ...baseData,
            // Sicherstellen, dass login/intraName konsistent zurückgegeben werden
            intraName: mainUser?.intraName ?? testUser?.login,
            avatarUrl: testUser?.avatarUrl ?? null,
            friendshipStatus,
            friendshipId
        });
	}
}
