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
					select: { id: true, intraName: true, intraEmail: true, isOnline: true, avatarUrl: true}
				},
				receiver: {
					select: { id: true, intraName: true, intraEmail: true, isOnline: true, avatarUrl: true}
				}
			}
		});
		// senderId und receiverId tauschen, damit immer friend in der map landet
		return friendships.map((f: any) => {
			const friendProfile = friendships.senderId === userId ? friendships.receiver : friendships.sender;
			return {
				friendshipId: f.id,
				avatarUrl: f.avatarUrl,
				...friendProfile
			};
		});
		
	}

	async getPendingRequests(userId: number) {
		return prisma.friendship.findMany({
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
			return { status: 'NONE' };
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

	async sendFriendRequest(senderId: number, targetIntraName: string) {
		// in User Tabelle suchen, ob existiert
		let targetUser = await prisma.user.findUnique({
			where: { intraName: targetIntraName }
		});

		if (!targetUser) {
			const testUser = await prisma.testUser.findUnique({
				where: { login: targetIntraName }
			});

			if (!testUser) {
				throw new Error('User not found');
			}

			targetUser = await prisma.user.create({
				data: {
					intraName: testUser.login,
					intraEmail: testUser.intraEmail || `${testUser.login}@student.42berlin.de`,
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

		if (targetUser.id === senderId) {
			throw new Error('Cannot add yourself as a friend');
		}

		// existiert Freundschaft schon?
		const existing = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ senderId, receiverId: targetUser.id },
					{ senderId: targetUser.id, receiverId: senderId }
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
				receiverId: targetUser.id,
				status: 'PENDING'
			}
		});
	}

	async acceptFriendRequest(userId: number, friendshipId: number) {

		const request = await prisma.friendship.findUnique({
			where: { id: friendshipId }
		});

		if (!request || request.receiverId !== userId) {
			throw new Error('Request not found or unauthorized');
		}

		return prisma.friendship.update({
			where: { id: friendshipId },
			data: { status: 'ACCEPTED' }
		});
	}

	async removeFriendOrRequest(userId: number, friendshipId: number) {
		const friendship = await prisma.friendship.findUnique({
			where: { id: friendshipId }
		});

		if (!friendship || (friendship.senderId !== userId && friendship.receiverId !== userId)) {
			throw new Error('Friendship not found or unauthorized');
		}
		
		return prisma.friendship.delete({
			where: { id: friendshipId }
		});
	}
}
