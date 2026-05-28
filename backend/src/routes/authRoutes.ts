import { FastifyInstance } from "fastify";
import { signUpUser, loginUser, loginWith42, handleCallback, logoutUser } from "../controllers/authController.js";
import { checkJwtAndBlacklist } from "../hooks/authHook.js";

export async function authRoutes(server: FastifyInstance) {
  server.post("/signUp", signUpUser);
  server.post("/login", loginUser);
  server.post("/logout", { preHandler: checkJwtAndBlacklist }, logoutUser)
  server.get("/auth/42", loginWith42);
  server.get("/auth/42/callback", handleCallback);
}