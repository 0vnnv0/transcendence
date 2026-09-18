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
    const { email, password } = request.body as { email?: string; password?: string };
    if (!email || !password) {
        return reply.status(400).send({
            error: 'Bad Request',
            message: 'E-Mail and Password need to be filled in.'
        });
    }

    if (password.length < 6) {
        return reply.code(400).send({
            error: "Bad Request",
            message: "Password needs to be at least 6 characters long."
        });
    }

    if (!email.endsWith('@student.42berlin.de')) {
        return reply.code(400).send({
            error: "Bad Request",
            message: "Please use a valid 42 Berlin email address ending with @student.42berlin.de."
        });
    }

    const username = email.split('@')[0];

    try {
        const existingTestUser = await prisma.testUser.findUnique({
            where: { login: username }
        });

        if (!existingTestUser) {
            return reply.code(400).send({
                error: "Bad Request",
                message: "No 42 Berlin student account found for this username. Please use your 42 credentials/email."
            });
        }

        const existingUser = await prisma.loggedUser.findUnique({
            where: { email }
        });

        if (existingUser) {
            return reply.code(400).send({
                error: "Bad Request",
                message: "Email already exists, please log in."
            });
        }

        // Secure hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.loggedUser.create({
            data: {
                email,
                password: hashedPassword
            },
            select: { id: true, email: true, createdAt: true }
        });

        const testUser = await prisma.testUser.update({
            where: { login: username },
            data: { isOnline: true }
        });

        const token = request.server.jwt.sign({
            id: testUser.id,
            intraName: testUser.login,
        }, { expiresIn: '1d' });

        return reply.code(201).send({
            message: "Registration successful!",
            token: token,
            access_token: token,
            loggedUser: { id: testUser.id, email: newUser.email }
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
    }
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email?: string; password?: string };
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

        const username = user.email.split('@')[0];

        const testUser = await prisma.testUser.findUnique({
            where: { login: username }
        });

        if (!testUser) {
            return reply.code(400).send({
                error: "Bad Request",
                message: "No associated 42 student account found for this user."
            });
        }

        // Status auf online setzen
        await prisma.testUser.update({
            where: { id: testUser.id },
            data: { isOnline: true }
        });

        const token = request.server.jwt.sign({
            id: testUser.id,
            intraName: testUser.login,
        }, { expiresIn: '1d' });

        return reply.send({
            message: 'Login successful',
            access_token: token,
            loggedUser: { id: testUser.id, email: user.email }
        });
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
            error: 'Internal Server Error',
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
		await prisma.testUser.update({
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
      intraName: user.login,
    //   newCore: user.isNewCore,
      isOnline: user.isOnline
    }, { expiresIn: '1d' }); // Token ist 1 Tag gültig

	const frontendRedirectUrl = `https://c1b1c1.42berlin.de:8443/authsuccess?token=${token}`; // const frontendRedirectUrl = `http://c0c7c2.42berlin.de:8080/authsuccess?token=${token}`;
	return reply.redirect(frontendRedirectUrl);
  } catch (error) {
	console.error("DEBUG AUTH ERROR:", error); // Das zeigt den echten Fehler im Terminal
    return reply.code(500).send({ error: "Auth Service Error" });
  }
};
