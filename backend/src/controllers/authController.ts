// kommuniziert mit dem User und steuert den Auth Porzess
// hreusing

import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/authService.js";
import { getAccessToken } from "../services/token.js";
import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import prisma from "../lib/prisma.js";

const fastify = Fastify({ logger: true });


export const signUpUser = async (request: FastifyRequest, reply: FastifyReply) => {
	const { email, password } = request.body as {email?: string, password?: string};
	if (!email || !password) {
		return reply.status(400).send({
			error: 'Bad Request',
			message: 'E-Mail and Password need to be filled in.'
		});
	}
	//password rules
	if (password.length < 6) {
		return reply.code(400).send({
			error: "Bad Request",
			message: "Password needs to be at least 6 characters long."
    	});
  	}

	try {
		const existingUser = await prisma.loggedUser.findUnique({
			where: { email }
		});
		if (existingUser) {
			return reply.code(400).send({
			error: "Bad Request",
			message: "Email already exists, please log in."
    	});
		}
		// secure hashed password
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.loggedUser.create({
			data: {
				email,
				password: hashedPassword
			},
			select: { id: true, email: true, createdAt: true}
		});
		reply.code(201); 
		return {
			message: "Registration successful!",
			loggedUser: newUser
		};
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({ error: "Internal Server Error "});
	}
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
	const { email, password } = request.body as {email?: string, password?: string};
	if (!email || !password) {
		return reply.status(400).send({
			error: 'Bad Request',
			message: 'E-Mail and Password need to be filled in.'
		});
	}

	try {
		const user = await prisma.loggedUser.findUnique({
			where: { email }
		});
		if (!user) {
			return reply.code(401).send({
				error: "Unauthorized",
				message: "Account does not exist. Try with another e-mail or sign up."
			});
		}

		const passwordIsValid = await bcrypt.compare(password, user.password);
		if (!passwordIsValid) {
			return reply.code(401).send({
				error: "Unauthorized",
				message: "Wrong password. Try again."
			});
		}

		const token = request.server.jwt.sign({
			id: user.id,
			email: user.email,
		}, { expiresIn: '1d'});

		return reply.send({
			message: 'Login successful',
			access_token: token,
			loggedUser: { id: user.id, email: user.email }
		});
	} catch (error) {
		fastify.log.error(error);
		return reply.status(500).send({
			error: 'Internal Server Errror',
			message: 'Internal Error'
		});
	}

};

export const logoutUser = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const authHeader = request.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return reply.code(400).send({ message: 'No Token found'});
		}
		const token = authHeader.split(' ')[1];

		const decoded = request.server.jwt.decode<{ exp: number }>(token);
		if (decoded && decoded.exp) {
			const expiresAt = new Date(decoded.exp * 1000);
			
			await prisma.blacklistedTokens.upsert({
				where: { token },
				update: {},
				create: {
					token,
					expiresAt
				}
			});
		}
		const userId = (request.user as any).id;
		await prisma.user.update({
          where: { id: userId },
          data: { isOnline: false },
        });
		return reply.send({
			message: 'Logout successful. Token blacklisted.'
		})
	} catch (error) {
		request.log.error(error);
		return reply.status(500).send({error: 'Internal Server Error'});
	}
};

export const loginWith42 = async (request: FastifyRequest, reply: FastifyReply) => {
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.FT_ID}&redirect_uri=${encodeURIComponent(process.env.FT_REDIRECT_URI || "")}&response_type=code&scope=public`;
  return reply.redirect(url);
};

export const handleCallback = async (request: FastifyRequest, reply: FastifyReply) => {
  const { code } = request.query as { code: string };

  try {
    const accessToken = await getAccessToken(code);
    const userData = await AuthService.fetchIntraUser(accessToken);
    const user = await AuthService.upsertUser(userData, accessToken);

    // JWT erstellen: Wir speichern die ID, den Namen, newCore Status und isOnline im Token
    const token = request.server.jwt.sign({ 
      id: user.id, 
      intraName: user.intraName,
      newCore: user.newCore,
      isOnline: user.isOnline
    }, { expiresIn: '1d' }); // Token ist 1 Tag gültig

	const frontendRedirectUrl = `https://localhost:8443/authsuccess?token=${token}`; // const frontendRedirectUrl = `http://c0c7c2.42berlin.de:8080/authsuccess?token=${token}`;
	return reply.redirect(frontendRedirectUrl);
  } catch (error) {
	console.error("DEBUG AUTH ERROR:", error); // Das zeigt den echten Fehler im Terminal
    return reply.code(500).send({ error: "Auth Service Error" });
  }
};
