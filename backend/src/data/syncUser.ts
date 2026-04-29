import { PrismaClient } from '@prisma/client';
import { FortyTwoService } from '../services/fortyTwoService';

const prisma = new PrismaClient();
const ftService = new FortyTwoService();

export async function sync42UserToDb(login: string) {
  try {
    console.log(`Starte Sync für ${login}...`);
    const token = await ftService.getAccessToken();
    const userData = await ftService.getUserData(login, token);

    const user = await prisma.user42.upsert({
      where: { id: userData.id },
      update: {
        login: userData.login,
        email: userData.email,
        level: userData.cursus_users[0]?.level || 0,
      },
      create: {
        id: userData.id,
        login: userData.login,
        email: userData.email,
        level: userData.cursus_users[0]?.level || 0,
      },
    });

    console.log(`Erfolg: ${user.login} ist in der Datenbank!`);
    return user;
  } catch (error) {
    console.error('Fehler beim 42-API Sync:', error);
  }
}