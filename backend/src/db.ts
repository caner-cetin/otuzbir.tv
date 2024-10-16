import * as path from "node:path";
import { Pool } from "pg";
import { promises as fs } from "node:fs";
import {
	Kysely,
	Migrator,
	PostgresDialect,
	FileMigrationProvider,
} from "kysely";
import type { SubmissionsTable } from "./models/Submissions";
if (process.env.DATABASE_URL === null) {
	console.error("DATABASE_URL not found in environment variables");
	process.exit(1);
}

export interface Database {
	submissions: SubmissionsTable;
}
export const DB = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
}).withSchema("otuzbir");

export async function InitDB() {
	const migrator = new Migrator({
		db: DB,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, "migrations"),
		}),
	});

	const { error, results } = await migrator.migrateToLatest();
	if (results) {
		for (const result of results) {
			if (result.status === "Success") {
				console.log(
					`migration "${result.migrationName}" was executed successfully`,
				);
			} else if (result.status === "Error") {
				console.error(`failed to execute migration "${result.migrationName}"`);
			}
		}
	}
	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}
	console.log("finished migration");
}
