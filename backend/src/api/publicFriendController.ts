//pbohme

import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { FriendService } from "../services/friendService.js";

const friendService = new FriendService();

export class PublicFriendController {
    constructor(private prisma: PrismaClient) {}

    // GET /api/friendships/:login
    async getFriendships(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { login } = request.params as { login: string };

        const user = await friendService.getUserByLogin(login);

        if (!user) {
            return reply.status(404).send({
                error: "User not found"
            });
        }

        const friendships = await friendService.getFriendsList(user.id);

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

		try {
			const sender = await friendService.getUserByLogin(senderLogin);
			const receiver = await friendService.getUserByLogin(receiverLogin);

			if (!sender) {
				return reply.status(404).send({
					error: `Sender '${senderLogin}' not found`
				});
			}

			if (!receiver) {
				return reply.status(404).send({
					error: `Receiver '${receiverLogin}' not found`
				});
			}

			const friendship = await friendService.sendFriendRequest(
				sender.id,
				receiver.id
			);

			return reply.status(201).send(friendship);

		} catch (err: any) {
			return reply.status(400).send({
				error: err.message
			});
		}
	}


	// async updateFriendship(
	// 	request: FastifyRequest,
	// 	reply: FastifyReply
	// ) {
	// 	const { id } = request.params as { id: string };
	// 	const { status } = request.body as {
	// 		status: "PENDING" | "ACCEPTED" | "REJECTED";
	// 	};

	// 	if (!status) {
	// 		return reply.status(400).send({
	// 			error: "status is required"
	// 		});
	// 	}

	// 	try {
	// 		const friendship = await this.prisma.friendship.update({
	// 			where: {
	// 				id: Number(id)
	// 			},
	// 			data: {
	// 				status
	// 			}
	// 		});

	// 		return reply.send(friendship);

	// 	} catch (err: any) {
	// 		return reply.status(404).send({
	// 			error: "Friendship not found"
	// 		});
	// 	}
	// }	

	// async deleteFriendship(
	// 	request: FastifyRequest,
	// 	reply: FastifyReply
	// ) {
	// 	const { id } = request.params as { id: string };

	// 	try {
	// 		await this.prisma.friendship.delete({
	// 			where: {
	// 				id: Number(id)
	// 			}
	// 		});

	// 		return reply.send({
	// 			message: "Friendship deleted"
	// 		});

	// 	} catch (err: any) {
	// 		return reply.status(404).send({
	// 			error: "Friendship not found"
	// 		});
	// 	}
	// }	
}