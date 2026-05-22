import { FastifyInstance } from "fastify";
import { registerUser, loginUser, loginWith42, handleCallback } from "../controllers/authController.js";

export async function authRoutes(server: FastifyInstance) {
  server.get("/register", registerUser);
  server.get("/login", loginUser);
  server.get("/auth/42", loginWith42);
  server.get("/auth/42/callback", handleCallback);
}