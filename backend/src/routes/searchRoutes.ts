//pbohme

import { FastifyInstance } from "fastify";
import { globalSearch } from '../controllers/searchController.js'; // Pfad zu deinem Controller

export async function searchRoutes(server: FastifyInstance) {
  server.get('/search', globalSearch);
}

export default searchRoutes;