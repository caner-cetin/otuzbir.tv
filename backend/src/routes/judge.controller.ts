import { HttpException } from "../models/Exception";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { Judge0 } from "../util/judge0";
import { DB } from "../db";
import dayjs from "dayjs";
import {
	JUDGE0_AUTHN_HEADER,
	JUDGE0_AUTHN_TOKEN,
	JUDGE0_BASE_API_URL,
} from "../config";

export const Health = async (req: FastifyRequest, reply: FastifyReply) => {
	try {
		return Judge0.Health.getWorkerQueues();
	} catch (error) {
		throw new HttpException(500, "Error fetching health status");
	}
};

export const Languages = async (req: FastifyRequest, reply: FastifyReply) => {
	try {
		return Judge0.Language.getAll();
	} catch (error) {
		throw new HttpException(500, "Error fetching languages");
	}
};

export const SubmitCode = async (req: FastifyRequest, reply: FastifyReply) => {
	const code = req.rawBody;
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
};

export const SubmitStdin = async (
	req: FastifyRequest<{ Querystring: { id: number } }>,
	reply: FastifyReply,
) => {
	const stdin = req.rawBody;
	if (!stdin) {
		return;
	}
	const { id } = req.query;
	if (!stdin && !id) {
		throw new HttpException(400, "both stdin and id cannot be null");
	}
	await DB.updateTable("submissions")
		.set({
			stdin: Buffer.from(stdin).toString("base64"),
			updatedAt: dayjs(),
		})
		.execute();
	return;
};

export const SubmitSubmission = async (
	request: FastifyRequest<{ Querystring: { language: number } }>,
	reply: FastifyReply,
) => {
	const { id } = request.params as { id: string };
	const { language } = request.query;
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
		false,
	);
};

export const GetSubmission = async (
	request: FastifyRequest<{ Params: { token: string } }>,
	reply: FastifyReply,
) => {
	return await Judge0.Submission.get(request.params.token);
};
