import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const HealthResponse = z.array(
	z.object({
		queue: z.string(),
		size: z.number(),
		available: z.number(),
		idle: z.number(),
		working: z.number(),
		paused: z.number(),
		failed: z.number(),
	}),
);

const LanguagesResponse = z.array(
	z.object({
		id: z.number(),
		name: z.string(),
	}),
);

const SubmitCodeResponse = z.object({ id: z.number() });

const GetSubmissionResponse = z.object({
	stdout: z.string().nullable().optional(),
	time: z.string(),
	memory: z.number(),
	stderr: z.string().nullable().optional(),
	token: z.string(),
	compile_output: z.string().nullable().optional(),
	message: z.string().nullable().optional(),
	status: z.object({
		id: z.number(),
		description: z.string(),
	}),
});

const CreateSubmissionResponse = z.object({
	token: z.string()
})
export const { schemas: judgeSchemas, $ref } = buildJsonSchemas(
	{
		HealthResponse,
		LanguagesResponse,
		SubmitCodeResponse,
		GetSubmissionResponse,
		CreateSubmissionResponse
	},
	{ $id: "$JudgeSchema" },
);
