// hreusing
// bekommt die Daten vom Auth Prozess und gibt json Files zurueck

import prisma from "../lib/prisma.js";
import { FortyTwoClient } from "./fortyTwoClient.js";
import { FortyTwoService } from "./fortyTwoService.js";
import { getAccessToken } from "./token.js";

export class AuthService {
	// function to verify the given Login data with 42 intra
//   static async getAccessToken(code: string) {
//     const response = await fetch("https://api.intra.42.fr/oauth/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         grant_type: "authorization_code",
//         client_id: process.env.FT_ID!,
//         client_secret: process.env.FT_SECRET!,
//         code,
//         redirect_uri: process.env.FT_REDIRECT_URI!,
//       }),
//     });
//     const data = await response.json();
// 	if (!response.ok) {
// 		console.error("42 Token API Error:", data);
// 	}
// 	return data;
//   }

  static async fetchIntraUser(accessToken: string) {
    const response = await fetch("https://api.intra.42.fr/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
  }

  static async upsertUser(userData: any, accessToken: string) {
	const mainCursus = userData.cursus_users?.find(
	(c: any) => c.cursus.slug === '42cursus' || c.cursus_id === 21
	);
	// 1. Sicherstellen, dass das Datum valide ist oder ein Fallback nutzen
	//const bhDate = userData.blackholed_at ? new Date(userData.blackholed_at) : new Date();
	
	// 2. Sicherstellen, dass Campus-Daten existieren (verhindert den "undefined reading '0'" Fehler)
	const campus = userData.campus && userData.campus.length > 0 ? userData.campus[0] : { id: 0, name: "Unknown" };
	
	// 3. Fetch newCore status from API (quest 128)
	let isNewCore = false;
	try {
		// const token = await getAccessToken();
		// const client = new FortyTwoClient(token);
		// const service = new FortyTwoService(client);
		// const newCoreUsers = await service.fetchQuestUsers(128);
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
			intraName: userData.login,
			intraEmail: userData.email,
			campusID: campus.id,
			campusName: campus.name,
			currentRank: Math.floor(userData.level || 0),
			paceDeadline: new Date(), // Hier muss aus Quest Datum genommen werden
			blackholeDate:  mainCursus?.blackholed_at ? new Date(mainCursus.blackholed_at) : null,
			newCore: isNewCore,
			// student: mainCursus?.grade === 'Cadet',
			isOnline: true,
		}
	});
  }
}