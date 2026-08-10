import { FastifyRequest, FastifyReply } from 'fastify';
import { FriendService } from "../services/friendService.js";

const friendService = new FriendService();

export class FriendController {

	// GET /api/friends
	async getFriends(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const friends = await friendService.getFriendsList(userId);
		return reply.send(friends);
	}

	// GET /api/friends/requests
	async getPendingRequests(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const requests = await friendService.getPendingRequests(userId);
		return reply.send(requests);
	}

	// POST /api/friends/request
	async sendRequest(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const { targetIntraName } = request.body as { targetIntraName: string };

		if (!targetIntraName) {
			return reply.status(400).send({ error: 'targetIntraName is required'});
		}

		try {
			const friendship = await friendService.sendFriendRequest(userId, targetIntraName);
			return reply.status(201).send({ message: 'Friend request sent', friendship });
		} catch (err: any) {
			return reply.status(400).send({ error: err.message });
		}
	}

	// PUT /api/friends/accept/:id
	async acceptRequest(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const { id } = request.params as { id: string };

		try {
			await friendService.acceptFriendRequest(userId, parseInt(id, 10));
			return reply.send({ message: 'Friend request accepted' });
		} catch (err: any) {
			return reply.status(400).send({ error: err.message });
		}
	}

	// DELETE /api/friends/:id
	async removeFriend(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as any).id;
		const { id } = request.params as { id: string };

		try {
			await friendService.removeFriendOrRequest(userId, parseInt(id, 10));
			return reply.send({ message: 'Friend or request removed' });
		} catch (err: any) {
			return reply.status(400).send({ error: err.message });
		}
  }
}