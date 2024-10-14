import type { Dayjs } from "dayjs";
import type { FastifyRequest } from "fastify";
import type { Generated } from "kysely";
import dayjs from "dayjs";
import { DB } from "../db";
import {
	JWT_SECRET,
	REFRESH_TOKEN_EXPIRY_TIME,
	SESSION_TOKEN_EXPIRY_TIME,
} from "../config";
import fastifyJwt from "@fastify/jwt";
import { sign } from "jsonwebtoken";
export interface UserTable {
	id: Generated<number>;
	username: string;
	password: string;
	email: string;
	createdAt: Dayjs;
	updatedAt: Dayjs | undefined;
	deletedAt: Dayjs | undefined;
	banned: boolean | undefined;
	banReason: string | undefined;
}

export class UserPayload {
	constructor(
		public id: number,
		public username: string,
	) {}

	async signTokens(request: FastifyRequest) {
		const access_token_expires_at = dayjs().add(
			SESSION_TOKEN_EXPIRY_TIME,
			"seconds",
		);
		const refresh_token_expires_at = dayjs().add(
			REFRESH_TOKEN_EXPIRY_TIME,
			"seconds",
		);

		const access_token = sign(
			{
				id: this.id,
				username: this.username,
				exp: access_token_expires_at.unix(),
			},
			JWT_SECRET,
		);

		const refresh_token = sign(
			{
				id: this.id,
				exp: refresh_token_expires_at.unix(),
			},
			JWT_SECRET,
		);

		await DB.updateTable("sessions")
			.set({
				refreshExpired: true,
				refreshExpiresAt: dayjs(),
			})
			.where("userId", "=", this.id)
			.execute();

		await DB.insertInto("sessions")
			.values({
				userId: this.id,
				accessToken: access_token,
				refreshToken: refresh_token,
				createdAt: dayjs(),
				accessExpiresAt: access_token_expires_at,
				refreshExpiresAt: refresh_token_expires_at,
				refreshExpired: false,
				refreshExpiredAt: undefined,
			})
			.execute();

		return { access_token, refresh_token };
	}
}
