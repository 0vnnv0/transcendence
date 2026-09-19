import readline from "readline";
import { syncBerlinUsers } from "./syncBerlinUsers.js";
import prisma from "../lib/prisma.js";


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});


function ask(question: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(question, resolve);
	});
}


export async function main() {
	const lastUserSync = await prisma.testUser.findFirst({
		orderBy: {
			updatedAt: "desc",
		},
		select: {
			updatedAt: true,
		},
	});


	console.log(
		`\nLast sync: ${
			lastUserSync?.updatedAt ?? "never"
		}`
	);


	const answer = await ask(
		"Sync all users to database? [y/n] "
	);


	if (answer.toLowerCase() === "y") {
		console.log("\n\x1b[1;35mStarting sync...\x1b[0m\n");

		await syncBerlinUsers();

	} else {
		console.log("\nSkipping sync.");
	}


	rl.close();
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});