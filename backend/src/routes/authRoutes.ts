import { FastifyInstance } from "fastify";
import { signUpUser, loginUser, loginWith42, handleCallback, logoutUser } from "../controllers/authController.js";
import { redirectIfLoggedIn, checkJwtAndBlacklist } from "../hooks/authHook.js";

export async function authRoutes(server: FastifyInstance) {
  server.post("/signUp",{ preHandler: redirectIfLoggedIn }, signUpUser);
  server.post("/login",{ preHandler: redirectIfLoggedIn }, loginUser);
  server.post("/logout", { preHandler: checkJwtAndBlacklist }, logoutUser)
  server.get("/auth/42",{ preHandler: redirectIfLoggedIn }, loginWith42);
  server.get("/auth/42/callback", handleCallback);
}