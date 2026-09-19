import { FastifyRequest, FastifyReply } from 'fastify';
import { FriendService } from "../services/friendService.js";

// const friendService = new FriendService();

export class FriendController {

	// GET /api/friends
	async getFriends(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const friendService = request.server.friendService;
		const friends = await friendService.getFriendsList(userId);
		return reply.send(friends);
	}

	// GET /api/friends/requests
	async getPendingRequests(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const friendService = request.server.friendService;
		const requests = await friendService.getPendingRequests(userId);
		return reply.send(requests);
	}

	// POST /api/friends/request
	async sendRequest(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const { targetUserId } = request.body as { targetUserId: number };

		if (!targetUserId) {
			return reply.status(400).send({ error: 'targetUserId is required'});
		}

		try {
			const friendService = request.server.friendService;
			const friendship = await friendService.sendFriendRequest(userId, targetUserId);
			return reply.status(201).send({ message: 'Friend request sent', friendship });
		} catch (err: any) {
			return reply.status(400).send({ error: err.message });
		}
	}

	// PUT /api/friends/accept
	async acceptRequest(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const { senderId } = request.body as { senderId: number };
		if (!senderId) {
			return reply.status(400).send({ error: 'senderId is required' });
		}
		try {
			const friendService = request.server.friendService;
			await friendService.acceptFriendRequest(userId, senderId);
			return reply.send({ message: 'Friend request accepted' });
		} catch (err: any) {
			return reply.status(400).send({ error: err.message });
		}
	}

	// DELETE /api/friends/:id
	async removeFriend(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const { targetId } = request.params as { targetId: string};
		const parsedTargetId = parseInt(targetId, 10);
		try {
			const friendService = request.server.friendService;
			await friendService.removeFriendOrRequest(userId, parsedTargetId);
			return reply.send({ message: 'Friend or request removed' });
		} catch (err: any) {
			return reply.status(400).send({ error: err.message });
		}
  }
}