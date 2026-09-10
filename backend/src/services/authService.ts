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
	// 2. Sicherstellen, dass Campus-Daten existieren (verhindert den "undefined reading '0'" Fehler)
	const campus = userData.campus && userData.campus.length > 0 ? userData.campus[0] : { id: 0, name: "Unknown" };
	
	// 3. Fetch newCore status from API (quest 128)
	let isNewCore = false;
	try {
		const client = new FortyTwoClient(accessToken);
		const service = new FortyTwoService(client);
		const newCoreUsers = await service.fetchQuestUsers(128);
		isNewCore = newCoreUsers.some((entry: any) => entry.user.id === userData.id);
	} catch (error) {
		console.error("Error fetching newCore status:", error);
		isNewCore = false;
	}

	return prisma.user.upsert({
		where: {
			intraName: userData.login
		},
		update: {
			currentRank: Math.floor(userData.level || 0),
			blackholeDate: mainCursus?.blackholed_at ? new Date(mainCursus.blackholed_at) : null,
			newCore: isNewCore,
			isOnline: true,	
		},
		create: {
			id: userData.id,
			intraName: userData.login,
			intraEmail: userData.email,
			avatarUrl: userData.url,
			campusID: campus.id,
			campusName: campus.name,
			currentRank: Math.floor(userData.level || 0),
			paceDeadline: new Date(), // Hier muss aus Quest Datum genommen werden
			blackholeDate:  mainCursus?.blackholed_at ? new Date(mainCursus.blackholed_at) : null,
			newCore: isNewCore,
			isOnline: true,
		}
	});
  }
}