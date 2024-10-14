import type { Kysely } from "kysely";
import type { Database } from "../db";
import dayjs from "dayjs";

export async function up(db: Kysely<Database>): Promise<void> {
	db.schema
		.createTable("users")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("username", "varchar(32)", (col) => col.unique().notNull())
		.addColumn("password", "text", (col) => col.notNull())
		.addColumn("email", "text", (col) => col.notNull())
		.addColumn("createdAt", "timestamptz", (col) =>
			col.notNull().defaultTo(dayjs().toDate()),
		)
		.addColumn("updatedAt", "timestamptz", (col) =>
			col.notNull().defaultTo(dayjs().toDate()),
		)
		.addColumn("deletedAt", "timestamptz")
		.addColumn("banned", "boolean", (col) => col.notNull().defaultTo(false))
		.addColumn("banReason", "text")
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema.dropTable("user").execute();
}
