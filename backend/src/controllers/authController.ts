// kommuniziert mit dem User und steuert den Auth Porzess

import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/authService";

export const loginWith42 = async (request: FastifyRequest, reply: FastifyReply) => {
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.FT_ID}&redirect_uri=${encodeURIComponent(process.env.FT_REDIRECT_URI || "")}&response_type=code&scope=public`;
  return reply.redirect(url);
};

export const handleCallback = async (request: FastifyRequest, reply: FastifyReply) => {
  const { code } = request.query as { code: string };

  try {
    const tokenData: any = await AuthService.getAccessToken(code);
    const userData = await AuthService.fetchIntraUser(tokenData.access_token);
    const user = await AuthService.upsertUser(userData);

    // JWT erstellen: Wir speichern die ID und den Namen im Token
    const token = request.server.jwt.sign({ 
      id: user.id, 
      intraName: user.intraName 
    }, { expiresIn: '1d' }); // Token ist 1 Tag gültig

    // Token an den User schicken
    return { 
      message: "Login erfolgreich", 
      access_token: token, // Das Frontend speichert das meistens im LocalStorage
      user 
    };
  } catch (error) {
	console.error("DEBUG AUTH ERROR:", error); // Das zeigt uns den echten Fehler im Terminal
    return reply.code(500).send({ error: "Auth Service Error" });
  }
};
