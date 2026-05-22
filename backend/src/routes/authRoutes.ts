import { FastifyInstance } from "fastify";
import { loginWith42, handleCallback } from "../controllers/authController.ts";

export async function authRoutes(server: FastifyInstance) {
  server.get("/login", loginOnPage);
  server.get("/auth/42", loginWith42);
  server.get("/auth/42/callback", handleCallback);
}