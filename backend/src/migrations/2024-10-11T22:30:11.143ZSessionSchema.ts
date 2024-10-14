import type { Kysely } from "kysely";
import type { Database } from "../db";
import dayjs from "dayjs";
import {
	REFRESH_TOKEN_EXPIRY_TIME,
	SESSION_TOKEN_EXPIRY_TIME,
} from "../config";

export async function up(db: Kysely<Database>): Promise<void> {
	await db.schema
		.createTable("sessions")
		.addColumn("sessionId", "serial", (col) => col.primaryKey())
		.addColumn("userId", "integer", (col) => col.references("users.id"))
		.addColumn("accessToken", "text", (col) => col.notNull())
		.addColumn("refreshToken", "text", (col) => col.notNull())
		.addColumn("createdAt", "timestamptz", (col) =>
			col.notNull().defaultTo(dayjs().toDate()),
		)
		.addColumn("accessExpiresAt", "timestamptz", (col) =>
			col.notNull().defaultTo(dayjs().add(SESSION_TOKEN_EXPIRY_TIME).toDate()),
		)
		.addColumn("refreshExpiresAt", "timestamptz", (col) =>
			col.notNull().defaultTo(dayjs().add(REFRESH_TOKEN_EXPIRY_TIME).toDate()),
		)
		.addColumn("refreshExpired", "boolean", (col) =>
			col.notNull().defaultTo(false),
		)
		.addColumn("refreshExpiredAt", "timestamptz")
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema.dropTable("sessions").execute();
}
