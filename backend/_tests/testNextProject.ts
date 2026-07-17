// //pbohme

// import { getAvailableProjects } from "../src/data/getAvailableProjects.js";
// import prisma from "../src/lib/prisma.js";

// const userId = Number(process.argv[2]);

// if (!userId) {
// 	console.log("add userId");
// 	process.exit(1);
// }

// async function run() {
// 	const user = await prisma.testUser.findUnique({
// 		where: { id: userId },
// 	});

// 	if (!user) {
// 		console.log("User not found");
// 		return;
// 	}

// 	const available = getAvailableProjects(user, user.newCore ?? false);

// 	console.log("Available projects:");
// 	console.dir(available, { depth: null });
// }

// run().catch(console.error);

// //130662 kmooney -> transcendence