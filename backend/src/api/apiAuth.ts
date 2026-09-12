//pbohme

import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticateApiKey(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const clientId = request.headers["x-api-client"];
    const apiKey = request.headers["x-api-key"];

    if (
        clientId !== process.env.PUBLIC_API_CLIENT_ID ||
        apiKey !== process.env.PUBLIC_API_KEY
    ) {
        return reply.code(401).send({
            error: "Invalid API credentials"
        });
    }
}