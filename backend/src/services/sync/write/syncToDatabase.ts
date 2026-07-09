import { PrismaClient } from "@prisma/client";

export async function syncToDatabase(prisma: PrismaClient, users: any[]) {
	console.log("Syncing to DB...");

	for (const user of users) {
		await prisma.testUser.upsert({
			where: { id: user.id },
			update: {
				login: user.login,
				intraEmail: user.intraEmail,
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

	console.log("DB sync done");
}