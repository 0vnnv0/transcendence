// //DUMMIE
// //Displaying the filtered users
// import { FastifyInstance } from "fastify";

// import { users } from "../data/loadUsers";
// import { filterUsers } from "../services/filterUsers";

// export async function displayUsersRoutes(server: FastifyInstance) {

// 	server.get("/users", async (request, reply) => {

// 		const query = request.query as Record<string, string>;

// 		const filteredUsers = filterUsers(users, query);

// 		return filteredUsers;
// 	});
// }