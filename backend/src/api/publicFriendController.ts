//pbohme

import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { FriendService } from "../services/friendService.js";

// const friendService = new FriendService();

export class PublicFriendController {
	private friendService: FriendService;
    constructor(
		private prisma: PrismaClient,
		private io: any) {
			this.friendService = new FriendService(io);
		}

    // GET /api/friendships/:login
    async getFriendships(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { login } = request.params as { login: string };

        const user = await this.friendService.getUserByLogin(login);

        if (!user) {
            return reply.status(404).send({
                error: "User not found"
            });
        }

        const friendships = await this.friendService.getFriendsList(user.id);

        return reply.send(friendships);
    }


	// POST /api/friendships
	async createFriendship(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { senderLogin, receiverLogin } = request.body as {
			senderLogin: string;
			receiverLogin: string;
		};

		if (!senderLogin || !receiverLogin) {
			return reply.status(400).send({
				error: "senderLogin and receiverLogin are required"
			});
		}

		const sender = await this.friendService.getUserByLogin(senderLogin);
		const receiver = await this.friendService.getUserByLogin(receiverLogin);

		if (!sender) {
			return reply.status(404).send({
				error: "Sender not found"
			});
		}

		if (!receiver) {
			return reply.status(404).send({
				error: "Receiver not found"
			});
		}

		try {
			const friendship = await this.friendService.sendFriendRequest(
				sender.id,
				receiver.id
			);

			return reply.status(201).send({
				message: "Friend request sent",
				friendship
			});
		} catch (err: any) {
			return reply.status(400).send({
				error: err.message
			});
		}
	}

	async updateFriendshipStatus(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { senderLogin, receiverLogin, status } = request.body as {
			senderLogin: string;
			receiverLogin: string;
			status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
		};

		if (!senderLogin || !receiverLogin || !status) {
			return reply.status(400).send({
				error: "senderLogin, receiverLogin and status are required"
			});
		}

		if (status !== 'PENDING' && status !== 'ACCEPTED' && status !== 'BLOCKED') {
			return reply.status(400).send({
				error: "Invalid status. Use PENDING, ACCEPTED or BLOCKED"
			});
		}

		const sender = await this.friendService.getUserByLogin(senderLogin);
		const receiver = await this.friendService.getUserByLogin(receiverLogin);

		if (!sender) {
			return reply.status(404).send({
				error: "Sender not found"
			});
		}

		if (!receiver) {
			return reply.status(404).send({
				error: "Receiver not found"
			});
		}

		try {
			await this.friendService.updateFriendshipStatus(
				sender.id,
				receiver.id,
				status
			);

			return reply.send({
				message: "Status updated"
			});
		} catch (err: any) {
			return reply.status(400).send({
				error: err.message
			});
		}
	}

	async deleteFriendship(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { senderLogin, receiverLogin } = request.body as {
			senderLogin: string;
			receiverLogin: string;
		};

		if (!senderLogin || !receiverLogin) {
			return reply.status(400).send({
				error: "senderLogin and receiverLogin are required"
			});
		}

		const sender = await this.friendService.getUserByLogin(senderLogin);
		const receiver = await this.friendService.getUserByLogin(receiverLogin);

		if (!sender) {
			return reply.status(404).send({
				error: "Sender not found"
			});
		}

		if (!receiver) {
			return reply.status(404).send({
				error: "Receiver not found"
			});
		}

		try {
			await this.friendService.removeFriendOrRequest(
				receiver.id,
				sender.id
			);

			return reply.send({
				message: "Friendship deleted"
			});
		} catch (err: any) {
			return reply.status(400).send({
				error: err.message
			});
		}
	}
}