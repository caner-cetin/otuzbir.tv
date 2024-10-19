import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import {
	GetSubmission,
	Health,
	Languages,
	SubmitCode,
	SubmitStdin,
	SubmitSubmission,
} from "./judge.controller";
import { $ref } from "./judge.schema";

export const judgeRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get(
		"/health",
		{
			schema: {
				response: {
					200: $ref("HealthResponse"),
				},
			},
		},
		Health,
	);

	fastify.get(
		"/languages",
		{
			schema: {
				response: {
					200: $ref("LanguagesResponse"),
				},
			},
		},
		Languages,
	);
	fastify.post(
		"/submit/code",
		{
			schema: {
				response: {
					200: $ref("SubmitCodeResponse"),
				},
			},
			config: {
				rawBody: true,
			},
		},
		SubmitCode,
	);

	fastify.post(
		"/submit/stdin",
		{
			config: {
				rawBody: true,
			},
			schema: {
				querystring: {
					type: "object",
					properties: {
						id: { type: "number" },
					},
					required: ["id"],
				},
			},
		},
		SubmitStdin,
	);

	fastify.get(
		"/:token",
		{
			schema: {
				params: {
					type: "object",
					properties: {
						token: { type: "string" },
					},
					required: ["token"],
				},
				response: {
					200: $ref("GetSubmissionResponse"),
				},
			},
		},
		GetSubmission,
	);

	fastify.put(
		"/submit/:id",
		{
			schema: {
				params: {
					type: "object",
					properties: {
						id: { type: "string" },
					},
					required: ["id"],
				},
				response: {
					200: $ref("CreateSubmissionResponse"),
				},
			},
		},
		SubmitSubmission,
	);
};
