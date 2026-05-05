import { FastifyInstance } from "fastify";
import { loginWith42, handleCallback } from "../controllers/authController";

export async function authRoutes(server: FastifyInstance) {
  server.get("/auth/42", loginWith42);
  server.get("/auth/42/callback", handleCallback);
}