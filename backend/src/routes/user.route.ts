import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { $ref, type SignupInput, type LoginInput } from "./user.schema";
import { Login, Logout, Me, Refresh, Signup } from "./user.controller";
import { AuthenticateHook, authPlugin } from "../middlewares/JWT";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.post(
		"/signup",
		{
			schema: {
				body: $ref("SignupRequest"),
				response: {
					200: $ref("SignupResponse"),
				},
			},
		},
		Signup,
	);

	fastify.post(
		"/login",
		{
			schema: {
				body: $ref("LoginRequest"),
				response: {
					201: $ref("LoginResponse"),
				},
			},
		},
		Login,
	);

	fastify.get(
		"/me",
		{
			schema: {
				response: {
					200: $ref("MeResponse"),
				},
			},
			onRequest: [AuthenticateHook],
		},
		Me,
	);

	fastify.put(
		"/refresh",
		{
			schema: {
				response: {
					200: $ref("SignupResponse"),
				},
			},
		},
		Refresh,
	);

	fastify.delete("/logout", { onRequest: [AuthenticateHook] }, Logout);
};
