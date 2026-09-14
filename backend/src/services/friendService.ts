// hreusing

import prisma from "../lib/prisma.js";

export class FriendService {

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
                select: { id: true, intraName: true, intraEmail: true, isOnline: true, avatarUrl: true }
            },
            receiver: {
                select: { id: true, intraName: true, intraEmail: true, isOnline: true, avatarUrl: true }
            }
        }
    });

    return friendships.map((f: any) => {
        // Richtige Variable 'f' nutzen!
        const friendProfile = f.senderId === userId ? f.receiver : f.sender;

        return {
            friendshipId: f.id,
            id: friendProfile.id,
            intraName: friendProfile.intraName,
            intraEmail: friendProfile.intraEmail,
            isOnline: friendProfile.isOnline,
            avatarUrl: friendProfile.avatarUrl
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
					select: {id: true, intraName: true, intraEmail: true, avatarUrl: true }
				}
			}
		});

		return requests.map((r: any) => ({
			friendshipId: r.id,
			id: r.sender.id,
			intraName: r.sender.intraName,
			intraEmail: r.sender.intraEmail,
			avatarUrl: r.sender.avatarUrl,
			isOnline: r.sender.isOnline,
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
		// in User Tabelle suchen, ob existiert
		let receiver = await prisma.user.findUnique({
			where: { id: receiverId }
		});

		if (!receiver) {
			const recId = await prisma.testUser.findUnique({
				where: { id: receiverId }
			});
			const intraName = recId.login;
			const testUser = await prisma.testUser.findUnique({
				where: { login: intraName }
			});

			if (!testUser) {
				throw new Error('User not found');
			}
			receiver = await prisma.user.create({
				data: {
					id: testUser.id,
					intraName: testUser.login,
					intraEmail: testUser.intraEmail || `${testUser.login}@student.42berlin.de`,
					avatarUrl: testUser.avatarUrl,
					campusID: testUser.campusId || 51,
					campusName: testUser.campusName || 'Berlin',
					currentRank: testUser.currentRank || 0,
					paceDeadline: new Date(),
					newCore: testUser.newCore,
					coalitionName: testUser.coalitionName,
					coalitionSlug: testUser.coalitionSlug
				}
			});
		}
		if (receiver.id === senderId) {
			throw new Error('Cannot add yourself as a friend');
		}

		// existiert Freundschaft schon?
		const existing = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ senderId, receiverId: receiver.id },
					{ senderId: receiver.id, receiverId: senderId }
				]
			}
		});
		if (existing) {
			if (existing.status === 'ACCEPTED') throw new Error('Already friends');
			if (existing.status === 'PENDING') throw new Error('Request already pending');
		}

		// Freundschaftsanfrage erstellen
		return prisma.friendship.create({
			data: {
				senderId,
				receiverId: receiver.id,
				status: 'PENDING'
			}
		});
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

		return prisma.friendship.update({
			where: { id: request.id },
        	data: { status: 'ACCEPTED' }
		});
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

		return prisma.friendship.delete({
			where: { id: request.id },
		});
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

		return prisma.friendship.update({
			where: {
				id: friendship.id
			},
			data: {
				status
			}
		});
	}	
}
