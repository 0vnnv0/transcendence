// hreusing
// bekommt die Daten vom Auth Prozess und gibt json Files zurueck

import prisma from "../lib/prisma.js";
import { FortyTwoClient } from "./fortyTwoClient.js";
import { FortyTwoService } from "./fortyTwoService.js";

export class AuthService {

  static async fetchIntraUser(accessToken: string) {
    const response = await fetch("https://api.intra.42.fr/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
  }

  static async upsertUser(userData: any, accessToken: string) {
	if (!userData.login || !userData.email) {
      throw new Error("Invalid user data from 42 API");
    }
    
    const mainCursus = userData.cursus_users?.find(
      (c: any) => c.cursus.slug === '42cursus' || c.cursus_id === 21
    );

    return prisma.testUser.upsert({
      where: { login: userData.login },
      update: {
        isOnline: true,
        // avatarUrl: userData.image?.versions?.large ?? userData.image?.link ?? null,
      },
      // Fallback: Falls der User wider Erwarten noch NICHT in der DB war (z.B. neu an der Schule)
      create: {
        id: userData.id,
        login: userData.login,
        intraEmail: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        avatarUrl: userData.image?.versions?.large ?? userData.image?.link ?? null,
        campusId: 51,
        campusName: "Berlin",
        currentRank: Math.floor(mainCursus?.level || userData.level || 0),
        isOnline: true,
		}
	});
  }
}