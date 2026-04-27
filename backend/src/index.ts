//DUMMIE
//dummie for indexfile
import buildServer from "./serverSetup";

async function start() {
	const server = await buildServer();

	try {
		await server.listen({
			port: 3000,
		});

		console.log("Server running on port 3000");
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

start();