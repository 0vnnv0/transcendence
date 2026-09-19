//pbohme

import { PrismaClient } from "@prisma/client";

export async function syncToDatabase(prisma: PrismaClient, users: any[]) {

	const userIds = users.map(user => user.id);

	await prisma.testUser.deleteMany({
		where: {
			id: {
				notIn: userIds,
			}
		}
	})

	for (const user of users) {
		await prisma.testUser.upsert({
			where: { id: user.id },
			update: {
				login: user.login,
				intraEmail: user.intraEmail,

				firstName: user.firstName,
				lastName: user.lastName,

				avatarUrl: user.avatarUrl,
				intraUrl: user.intraUrl,

				campusId: user.campusId,
				campusName: user.campusName,

				coalitionName: user.coalitionName,
				coalitionSlug: user.coalitionSlug,
				
				completedProjects: user.completedProjects,
				activeProjects: user.activeProjects,
			},
			create: user,
		});
	}
}