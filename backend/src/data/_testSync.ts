import 'dotenv/config';
import prisma from "../lib/prisma.js";
import { fetchBerlinUsers } from "../services/projectMatching/_testFetchBerlin.js";


export async function syncBerlinUsers() {
  const users = await fetchBerlinUsers();

  for (const user of users) {
    await prisma.testUser.upsert({
      where: { id: user.id },
      update: {
        login: user.login,
      },
      create: {
        id: user.id,
        login: user.login,
      },
    });
  }

  console.log(`Synced ${users.length} users`);
}