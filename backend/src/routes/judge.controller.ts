import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { Judge0 } from "../util/judge0";
import { HttpException } from "../models/Exception";
import { DB } from "../db";
import dayjs from "dayjs";

export const judgeRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get("/health", async (request, reply) => {
		try {
			return await Judge0.Health.getWorkerQueues();
		} catch (error) {
			throw new HttpException(500, "Error fetching health status");
		}
	});

	fastify.get("/languages", async (request, reply) => {
		try {
			return await Judge0.Language.getAll();
		} catch (error) {
			throw new HttpException(500, "Error fetching languages");
		}
	});
	fastify.post(
		"/submit/code",
		{
			config: {
				rawBody: true,
			},
		},
		async (request: FastifyRequest, reply) => {
			const code = request.rawBody;
			if (!code) {
				throw new HttpException(400, "beep beep invalid input");
			}
			const subId = await DB.insertInto("submissions")
				.values({
					sourceCode: Buffer.from(code).toString("base64"),
					judgeToken: "",
					stdin: undefined,
					sent: false,
					createdAt: dayjs(),
					updatedAt: dayjs(),
					deletedAt: undefined,
				})
				.returning("id")
				.execute();
			return { id: subId[0].id };
		},
	);

	fastify.post(
		"/submit/stdin",
		{
			config: {
				rawBody: true,
			},
		},
		async (request: FastifyRequest<{ Querystring: { id: string } }>, reply) => {
			const stdin = request.rawBody;
			if (!stdin) {
				return;
			}
			const { id } = request.query;
			if (!stdin && !id) {
				throw new HttpException(400, "both stdin and id cannot be null");
			}
			await DB.updateTable("submissions").set({
				stdin: Buffer.from(stdin).toString("base64"),
				updatedAt: dayjs(),
			});
			return;
		},
	);

	fastify.get("/:token", async (request, reply) => {
		const { token } = request.params as { token: string };
		return await Judge0.Submission.get(token);
	});

	fastify.put(
		"/submit/:id",
		async (
			request: FastifyRequest<{ Querystring: { language: number } }>,
			reply,
		) => {
			const { id } = request.params as { id: string };
			const {language} = request.query
			const submission = await DB.selectFrom("submissions")
				.select(["sourceCode", "stdin"])
				.where("id", "=", Number.parseInt(id))
				.executeTakeFirst();
			if (!submission) {
				throw new HttpException(400, "Invalid submission ID");
			}
			return await Judge0.Submission.create(
				submission.sourceCode,
				language,
				submission.stdin ?? btoa(""),
				true,
				false
			);
		},
	);
};
