//hreusing

import { FastifyInstance } from "fastify";
import { globalSearch, fullSearch } from '../controllers/searchController.js'; // Pfad zu deinem Controller

export async function searchRoutes(server: FastifyInstance) {
  server.get('/search', globalSearch);
  server.get('/search-all', fullSearch);
}

export default searchRoutes;