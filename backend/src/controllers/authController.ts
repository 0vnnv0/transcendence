// kommuniziert mit dem User und steuert den Auth Porzess

import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/authService.js";
import Fastify from 'fastify';
import { request } from "node:http";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
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
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});
		if (existingUser) {
			const loginUrl = 'http://localhost:8080/login';
  			return reply.redirect(loginUrl);
		}
		// secure hashed password
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword
			},
			select: { id: true, email: true, createdAt: true}
		});
		return reply.code(201).send({
			message: "Registration successful!",
			user: newUser
		});
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
		const user = await prisma.user.findUnique({
			where: { email }
		});
		if (!user) {
			return reply.code(401).send({
				error: "Unauthorized",
				message: "Invalid E-Mail or wrong password."
			});
		}

		const passwordIsValid = await bcrypt.compare(password, user.password);
		if (!passwordIsValid) {
			return reply.code(401).send({
				error: "Unauthorized",
				message: "Invalid E-Mail or wrong password."
			});
		}

		// const userIsValid = await AuthService.verifyUserCredentials(email, password);
		// if (!userIsValid) {
		// 	return reply.status(401).send({
		// 		error: 'Unautherized',
		// 		message: '42 Student Credentials not found'
		// 	});
		// }

		const token = fastify.jwt.sign({
			id: user.id,
			email: user.email,
		}, { expiresIn: '1d'});

		return reply.send({
			message: 'Login erfolgreich',
			access_token: token,
			user: { id: user.id, email: user.email }
		});
	} catch (error) {
		fastify.log.error(error);
		return reply.status(500).send({
			error: 'Internal Server Errror',
			message: 'Internal Error'
		});
	}

};

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
