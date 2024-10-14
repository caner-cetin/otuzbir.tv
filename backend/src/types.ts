import type { JWT } from "@fastify/jwt";
import type { FastifyRequest } from "fastify";
import type { UserPayload } from "./models/User";

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
	}
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
	}
	export interface FastifyRequest {
		user: UserPayload;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
