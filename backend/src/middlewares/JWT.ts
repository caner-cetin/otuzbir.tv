import fastifyJwt from "@fastify/jwt";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { JWT_SECRET, SESSION_TOKEN_EXPIRY_TIME } from "../config";
import dayjs from "dayjs";

export const authPlugin: FastifyPluginAsync = async (fastify) => {
	if (fastify.jwt) {
		// JWT plugin is already registered, skip
		return;
	}
	fastify.register(fastifyJwt, {
		secret: JWT_SECRET,
		sign: {
			expiresIn: dayjs().add(SESSION_TOKEN_EXPIRY_TIME, "seconds").unix(),
		},
	});
};

export const AuthenticateHook = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		reply.send(err);
	}
};
