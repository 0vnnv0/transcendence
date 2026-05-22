//this is written by ai, i used this to add dummie users to test the chat app,
//it can be deleted later once we have actual users connected
//for anyone who wants to use it, go to srcs and type "docker compose exec backend npm run seed"
//NOTE: if you delete this, make sure you also delete the "seed" script command from package.json

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL!;

const pool = new pg.Pool({
	connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter,
});

const campuses = ["Berlin", "Heilbronn", "Wolfsburg"];

function getRandomCampus(): string {
	return campuses[Math.floor(Math.random() * campuses.length)];
}

function getRandomRank(): number {
	return Math.floor(Math.random() * 7);
}

export async function seed() {
	console.log("Seeding users...");

	for (let i = 1; i <= 20; i++) {
		await prisma.user.upsert({
			where: {
				id: i,
			},
			update: {},
			create: {
				id: i,
				email: `user${i}@test.com`,
				intraName: `user${i}`,
				campusID: i,
				campusName: getRandomCampus(),
				currentRank: getRandomRank(),
			
				paceDeadline: new Date("2026-12-31"),
				blackholeDate: new Date("2027-01-31"),
			
				student: true,
			},
		});
	}

	console.log("Creating test chat...");

	await prisma.chat.upsert({
		where: {
			id: 1,
		},
		update: {},
		create: {
			id: 1,
			users: {
				connect: [
					{ id: 1 },
					{ id: 2 },
				],
			},
		},
	});

	console.log("Done.");
	process.exit(0);
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});