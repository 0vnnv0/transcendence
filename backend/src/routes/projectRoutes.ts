//pbohme
//alle projects

import { FastifyInstance } from "fastify";
import { PROJECTS } from "../types/coreProjects.js";

export async function projectRoutes(
	server: FastifyInstance
) {
	server.get("/projects", async (request, reply) => {

		const { rank,core } = request.query as {
			rank?: string;
			core?: "new" | "old";
		};

		let projects = PROJECTS;

		if (core === "new") {
			projects = projects.filter(p => p.newCore);
		}

		if (core === "old") {
			projects = projects.filter(p => p.oldCore);
		}

		if (rank) {
			projects = projects.filter(
				project => project.projectRank === Number(rank)
			);
		}

		if (projects.length === 0) {
			return reply.code(404).send({
				error: "No projects found"
			});
		}

		return projects;
	});
}