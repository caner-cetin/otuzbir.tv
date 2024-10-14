import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const LoginRequest = z
	.object({
		username: z.string().min(3).max(32).optional(),
		password: z.string().min(8).max(32),
		email: z.string().email().optional(),
	})
	.refine((data) => data.username || data.email, {
		message: "Either username or email must be provided",
		path: ["username", "email"],
	});
export type LoginInput = z.infer<typeof LoginRequest>;
const LoginResponse = z.object({
	user: z.object({
		id: z.number(),
		username: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
		deletedAt: z.date(),
	}),
	accessToken: z.string(),
	refreshToken: z.string(),
});

const SignupRequest = z.object({
	username: z.string().min(3).max(32),
	password: z.string().min(8).max(32),
	email: z.string().email(),
});
export type SignupInput = z.infer<typeof SignupRequest>;
const SignupResponse = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
});

const MeResponse = z.object({
	username: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	id: z.number(),
	banned: z.boolean(),
	banReason: z.string(),
});

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
	{
		LoginRequest,
		LoginResponse,
		SignupRequest,
		SignupResponse,
		MeResponse,
	},
	{ $id: "UserSchema" },
);
