//pbohme

import { FastifyReply, FastifyRequest } from "fastify";

const requests = new Map<string, number[]>();

const MAX_REQUESTS = 2;
const WINDOW_MS = 1000;

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

    const key = `${clientId}:${apiKey}`;
    const now = Date.now();

    const timestamps = requests.get(key) || [];

    const recentRequests = timestamps.filter(
        timestamp => now - timestamp < WINDOW_MS
    );

    if (recentRequests.length >= MAX_REQUESTS) {
        return reply.code(429).send({
            error: "Too many requests"
        });
    }

    recentRequests.push(now);
    requests.set(key, recentRequests);
}