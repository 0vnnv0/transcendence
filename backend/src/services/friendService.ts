// hreusing

import prisma from "../lib/prisma.js";

export class FriendService {

	private io: any; 

    constructor(io?: any) {
        this.io = io;
    }

    private notifyUser(userId: number, event: string, payload: any) {
        if (this.io) {
            // Sendet das Event an den Raum des Ziel-Users: `user_123`
            this.io.to(`user_${userId}`).emit(event, payload);
		}
	}
	async getFriendsList(userId: number) {
    const friendships = await prisma.friendship.findMany({
        where: {
            status: 'ACCEPTED',
            OR: [
                { senderId: userId },
                { receiverId: userId }
            ]
        },
        include: {
            sender: {
                select: { id: true, login: true, intraEmail: true, isOnline: true, avatarUrl: true, customAvatar: true }
            },
            receiver: {
                select: { id: true, login: true, intraEmail: true, isOnline: true, avatarUrl: true , customAvatar: true}
            }
        }
    });

    return friendships.map((f: any) => {
        // Richtige Variable 'f' nutzen!
        const friendProfile = f.senderId === userId ? f.receiver : f.sender;

        return {
            friendshipId: f.id,
            id: friendProfile.id,
            intraName: friendProfile.login,
            intraEmail: friendProfile.intraEmail,
            isOnline: friendProfile.isOnline,
            avatarUrl: friendProfile.avatarUrl,
			customAvatar: friendProfile.customAvatar
        };
    });
}

	async getPendingRequests(userId: number) {
		const requests = await prisma.friendship.findMany({
			where: {
				receiverId: userId,
				status: 'PENDING'
			},
			include: {
				sender: {
					select: {id: true, login: true, intraEmail: true, avatarUrl: true, isOnline: true, customAvatar: true }
				}
			}
		});

		return requests.map((r: any) => ({
			friendshipId: r.id,
			id: r.sender.id,
			intraName: r.sender.login,
			intraEmail: r.sender.intraEmail,
			avatarUrl: r.sender.avatarUrl,
			isOnline: r.sender.isOnline,
			customAvatar: r.sender.customAvatar
		}));
	}

	async getFriendshipStatusWith(currentUserId: number, targetUserId: number) {
		if (currentUserId == targetUserId) {
			return { status: 'SELF', friendshipId: null };
		}

		const friendship = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ senderId: currentUserId, receiverId: targetUserId },
					{ senderId: targetUserId, receiverId: currentUserId }
				]
			}
		});

		if (!friendship) {
			return { status: 'NONE', friendshipId: null };
		}

		if (friendship.status === 'ACCEPTED') {
			return { status: 'ACCEPTED', friendshipId: friendship.id};
		}

		if (friendship.status === 'PENDING') {
			if (friendship.senderId === currentUserId) {
				return { status: 'PENDING_SENT', friendshipId: friendship.id };
			} else {
				return { status: 'PENDING_RECEIVED', friendshipId: friendship.id };
			}
		}

		return { status: 'NONE', friendshipId: null };
	}

	async sendFriendRequest(senderId: number, receiverId: number) {
		
		if (receiverId === senderId) {
			throw new Error('Cannot add yourself as a friend');
		}

		const receiver = await prisma.testUser.findUnique({
			where: { id: receiverId }
		});

		if (!receiver) {
			throw new Error('User not found');
		}

		// existiert Freundschaft schon?
		const existing = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ senderId, receiverId },
					{ senderId: receiverId, receiverId: senderId }
				]
			}
		});
		if (existing) {
			if (existing.status === 'ACCEPTED') throw new Error('Already friends');
			if (existing.status === 'PENDING') throw new Error('Request already pending');
		}

		const created = await prisma.friendship.create({
            data: {
                senderId,
                receiverId,
                status: 'PENDING'
            }
        });

		this.notifyUser(receiverId, 'friend_request_received', {
            friendshipId: created.id,
            senderId
        });

		return created;
	}


	async acceptFriendRequest(receiverId: number, senderId: number) {

		const request = await prisma.friendship.findFirst({
			where: {
				senderId: senderId,
				receiverId: receiverId,
				status: 'PENDING'
			}
		});

		if (!request) {
			throw new Error('Friend request not found or already accepted');
		}

		const updated = await prisma.friendship.update({
            where: { id: request.id },
            data: { status: 'ACCEPTED' }
        });

		this.notifyUser(senderId, 'friend_request_accepted', {
            friendshipId: updated.id,
            acceptedById: receiverId
        });

        // Empfänger zur Sicherheit triggern (für synchrone UI-Updates)
        this.notifyUser(receiverId, 'friend_request_accepted', {
            friendshipId: updated.id,
            acceptedById: receiverId
        });

		return updated;
	}

	async removeFriendOrRequest(userId: number, targetId: number | string) {

		const parsedSenderId = Number(targetId);
		const request = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ senderId: userId, receiverId: parsedSenderId },
					{ senderId: parsedSenderId, receiverId: userId }
				]
			}
		});

		if (!request) {
			throw new Error('Friend request not found');
		}

		const otherUserId = request.senderId === userId ? request.receiverId : request.senderId;

        const deleted = await prisma.friendship.delete({
            where: { id: request.id },
        });

		this.notifyUser(otherUserId, 'friendship_removed', {
            friendshipId: request.id,
            removedById: userId
        });

		this.notifyUser(userId, 'friendship_removed', {
			friendshipId: request.id,
			removedById: userId
		});

        return deleted;
	}

	//pbohme
	async getUserByLogin(login: string) {
		return prisma.testUser.findUnique({
			where: { login }
		});
	}

	async updateFriendshipStatus(
		senderId: number,
		receiverId: number,
		status: 'PENDING' | 'ACCEPTED' | 'BLOCKED'
	) {
		const friendship = await prisma.friendship.findFirst({
			where: {
				senderId,
				receiverId
			}
		});

		if (!friendship) {
			throw new Error('Friend request not found');
		}

		if (friendship.status === status) {
			throw new Error(`Friendship is already ${status}`);
		}

    const updatedFriendship = await prisma.friendship.update({
        where: {
            id: friendship.id
        },
        data: {
            status
        }
    });

	if (status === 'ACCEPTED') {
			this.notifyUser(senderId, 'friend_request_accepted', {
				friendshipId: updatedFriendship.id,
				acceptedById: receiverId
			});

			this.notifyUser(receiverId, 'friend_request_accepted', {
				friendshipId: updatedFriendship.id,
				acceptedById: receiverId
			});
		} 
	}

	// 	return prisma.friendship.update({
	// 		where: {
	// 			id: friendship.id
	// 		},
	// 		data: {
	// 			status
	// 		}
	// 	});
	// }	
}
