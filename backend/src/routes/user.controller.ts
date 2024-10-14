import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginInput, SignupInput } from "./user.schema";
import { HttpException } from "../models/Exception";
import { hash, verify } from "argon2";
import dayjs from "dayjs";
import { DB } from "../db";
import { UserPayload } from "../models/User";
import { decode } from "jsonwebtoken";

export const Login = async (
	req: FastifyRequest<{ Body: LoginInput }>,
	reply: FastifyReply,
) => {
	const { username, password, email } = req.body;

	const user = await DB.selectFrom("users")
		.select([
			"password",
			"createdAt",
			"updatedAt",
			"deletedAt",
			"username",
			"id",
		])
		.where((eb) =>
			eb.or([
				eb("username", "=", username || ""),
				eb("email", "=", email || ""),
			]),
		)
		.executeTakeFirst();

	if (!user) {
		throw new HttpException(400, "YOU_DO_NOT_EXIST");
	}

	if (!(await verify(user.password, password))) {
		throw new HttpException(400, "WRONG_PASSWORD");
	}
	const payload = new UserPayload(user.id, user.username);
	const { access_token, refresh_token } = await payload.signTokens(req);

	return reply.status(200).send({
		user: {
			id: user.id,
			username: user.username,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			deletedAt: user.deletedAt,
		},
		accessToken: access_token,
		refreshToken: refresh_token,
	});
};

export const Signup = async (
	req: FastifyRequest<{ Body: SignupInput }>,
	reply: FastifyReply,
) => {
	const { username, password, email } = req.body;

	const existingUser = await DB.selectFrom("users")
		.select(["username", "email"])
		.where("username", "=", username)
		.executeTakeFirst();

	if (existingUser) {
		throw new HttpException(400, "USER_EXISTS_BEGONE_DECEIVER");
	}

	const user = await DB.insertInto("users")
		.values({
			username,
			password: await hash(password),
			email,
			createdAt: dayjs(),
		})
		.returning(["id", "username"])
		.executeTakeFirst();

	if (!user) {
		throw new HttpException(500, "Something went wrong while creating user");
	}
	const payload = new UserPayload(user.id, user.username);
	const { access_token, refresh_token } = await payload.signTokens(req);

	return reply.status(200).send({
		accessToken: access_token,
		refreshToken: refresh_token,
	});
};

export const Me = async (request: FastifyRequest, reply: FastifyReply) => {
	return await DB.selectFrom("users")
		.select(["username", "createdAt", "updatedAt", "id", "banned", "banReason"])
		.where("id", "=", request.user.id)
		.executeTakeFirst();
};

export const Refresh = async (request: FastifyRequest, reply: FastifyReply) => {
	const token = request.headers.authorization?.split("Bearer ")[1];

	if (!token) {
		throw new HttpException(400, "PLEASE_LOGIN_AGAIN");
	}

	const payload = decode(token) as UserPayload;

	if (!payload || typeof payload === "string") {
		throw new HttpException(500, "OOPS");
	}

	const session = await DB.selectFrom("sessions")
		.select("userId")
		.where("userId", "=", payload.id)
		.where("refreshExpired", "=", false)
		.where("refreshToken", "=", token.trim())
		.executeTakeFirst();

	if (!session) {
		throw new HttpException(400, "YOU_ARE_NOT_LOGGED_IN");
	}
	const newPayload = new UserPayload(session.userId, payload.username);
	const { access_token, refresh_token } = await newPayload.signTokens(request);
	return reply.send({
		access_token: access_token,
		refresh_token: refresh_token,
	});
};

export const Logout = async (request: FastifyRequest, reply: FastifyReply) => {
	await DB.updateTable("sessions")
		.set({
			refreshExpired: true,
			refreshExpiredAt: dayjs(),
		})
		.where("userId", "=", request.user.id)
		.execute();
	return reply.send({ message: "LOGGED_OUT" });
};
