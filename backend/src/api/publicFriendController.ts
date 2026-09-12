//pbohme

import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

export class PublicFriendController {
    constructor(private prisma: PrismaClient) {}

    // GET /api/friendships/:login
    async getFriendships(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { login } = request.params as { login: string };

        const user = await this.prisma.user.findUnique({
            where: { login }
        });

        if (!user) {
            return reply.status(404).send({
                error: "User not found"
            });
        }

        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { senderId: user.id },
                    { receiverId: user.id }
                ]
            },
            include: {
                sender: true,
                receiver: true
            }
        });

        return reply.send(friendships);
    }


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

		const sender = await this.prisma.user.findUnique({
			where: { login: senderLogin }
		});

		const receiver = await this.prisma.user.findUnique({
			where: { login: receiverLogin }
		});

		if (!sender || !receiver) {
			return reply.status(404).send({
				error: "Sender or receiver not found"
			});
		}

		try {
			const friendship = await this.prisma.friendship.create({
				data: {
					senderId: sender.id,
					receiverId: receiver.id
				}
			});

			return reply.status(201).send(friendship);

		} catch (err: any) {
			return reply.status(400).send({
				error: err.message
			});
		}
	}	


	async updateFriendship(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { id } = request.params as { id: string };
		const { status } = request.body as {
			status: "PENDING" | "ACCEPTED" | "REJECTED";
		};

		if (!status) {
			return reply.status(400).send({
				error: "status is required"
			});
		}

		try {
			const friendship = await this.prisma.friendship.update({
				where: {
					id: Number(id)
				},
				data: {
					status
				}
			});

			return reply.send(friendship);

		} catch (err: any) {
			return reply.status(404).send({
				error: "Friendship not found"
			});
		}
	}	

	async deleteFriendship(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { id } = request.params as { id: string };

		try {
			await this.prisma.friendship.delete({
				where: {
					id: Number(id)
				}
			});

			return reply.send({
				message: "Friendship deleted"
			});

		} catch (err: any) {
			return reply.status(404).send({
				error: "Friendship not found"
			});
		}
	}	
}