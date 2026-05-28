import { FastifyInstance } from "fastify";
import { signUpUser, loginUser, loginWith42, handleCallback } from "../controllers/authController.js";

export async function authRoutes(server: FastifyInstance) {
  server.post("/signUp", signUpUser);
  server.post("/login", loginUser);
  server.get("/auth/42", loginWith42);
  server.get("/auth/42/callback", handleCallback);
}