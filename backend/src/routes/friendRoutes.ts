import { FastifyInstance } from "fastify";
import {FriendController } from "../controllers/friendController.js";

const controller = new FriendController();

export async function friendRoutes(server: FastifyInstance) {
  server.addHook('onRequest', server.authenticate);

  server.get('/friends', controller.getFriends);
  server.get('/friends/requests', controller.getPendingRequests);
  server.post('/friends/request', controller.sendRequest);
  server.put('/friends/accept/:id', controller.acceptRequest);
  server.delete('/friends/remove/:id', controller.removeFriend);
}