// bekommt die Daten vom Auth Prozess und gibt json Files zurueck

import prisma from "../lib/prisma";

export class AuthService {
  static async getAccessToken(code: string) {
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.FT_ID!,
        client_secret: process.env.FT_SECRET!,
        code,
        redirect_uri: process.env.FT_REDIRECT_URI!,
      }),
    });
    const data = await response.json();
	if (!response.ok) {
		console.error("42 Token API Error:", data);
	}
	return data;
  }

  static async fetchIntraUser(accessToken: string) {
    const response = await fetch("https://api.intra.42.fr/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
  }

  static async upsertUser(userData: any) {
	// 1. Sicherstellen, dass das Datum valide ist oder ein Fallback nutzen
	const bhDate = userData.blackholed_at ? new Date(userData.blackholed_at) : new Date();
	
	// 2. Sicherstellen, dass Campus-Daten existieren (verhindert den "undefined reading '0'" Fehler)
	const campus = userData.campus && userData.campus.length > 0 ? userData.campus[0] : { id: 0, name: "Unknown" };
	return prisma.user.upsert({
		where: {
			intraName: userData.login
			},
		update: {
			currentRank: Math.floor(userData.level || 0),
			blackholeDate: bhDate,
			},
		create: {
			intraName: userData.login,
			email: userData.email,
			campusID: campus.id,
			campusName: campus.name,
			currentRank: Math.floor(userData.level || 0),
			paceDeadline: new Date(), // Hier ggf. auch ein Feld aus der API nutzen
			blackholeDate: bhDate,
			student: true
		}
	});
  }
}