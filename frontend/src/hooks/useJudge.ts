import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import api from "src/services/api";

// Types based on your Zod schemas
type HealthResponse = Array<{
	queue: string;
	size: number;
	available: number;
	idle: number;
	working: number;
	paused: number;
	failed: number;
}>;

type LanguagesResponse = Array<{
	id: number;
	name: string;
}>;

type SubmitCodeResponse = {
	id: number;
};

export type GetSubmissionResponse = {
	stdout: string | null;
	time: string;
	memory: number;
	stderr: string | null;
	token: string;
	compile_output: string | null;
	message: string | null;
	status: {
		id: number;
		description: string;
	};
};
const getHealth = () =>
	api.get<HealthResponse>("/judge/health").then((res) => res.data);
const getLanguages = () =>
	api.get<LanguagesResponse>("/judge/languages").then((res) => res.data);
const submitCode = (code: string) =>
	api
		.post<SubmitCodeResponse>("/judge/submit/code", code, {
			headers: { "Content-Type": "text/plain" },
		})
		.then((res) => res.data);

interface submitStdinOpts {
	id: number;
	stdin: string;
}
const submitStdin = (opts: submitStdinOpts) =>
	api
		.post(`/judge/submit/stdin?id=${opts.id}`, opts.stdin, {
			headers: { "Content-Type": "text/plain" },
		})
		.then((res) => res.data);
const submitSubmission = (id: number) =>
	api
		.put<GetSubmissionResponse>(`/judge/submit/${id}?language=71`)
		.then((res) => res.data);

export interface JudgeAPISpec {
	health: UseMutationResult<HealthResponse, Error, void, unknown>;
	languages: UseMutationResult<LanguagesResponse, Error, void, unknown>;
	submitCode: UseMutationResult<SubmitCodeResponse, Error, string, unknown>;
	submitStdin: UseMutationResult<
		null,
		Error,
		{
			id: number;
			stdin: string;
		},
		unknown
	>;
	submitSubmission: UseMutationResult<
		GetSubmissionResponse,
		Error,
		number,
		unknown
	>;
}

// Hook
export function useJudge(): JudgeAPISpec {
	const healthMutation = useMutation<HealthResponse, Error>({
		mutationFn: getHealth,
	});
	const languagesMutation = useMutation<LanguagesResponse, Error>({
		mutationFn: getLanguages,
	});

	const submitCodeMutation = useMutation<SubmitCodeResponse, Error, string>({
		mutationFn: submitCode,
	});
	const submitStdinMutation = useMutation<null, Error, submitStdinOpts>({
		mutationFn: submitStdin,
	});
	const submitSubmissionMutation = useMutation<
		GetSubmissionResponse,
		Error,
		number
	>({
		mutationFn: submitSubmission,
	});

	return {
		health: healthMutation,
		languages: languagesMutation,
		submitCode: submitCodeMutation,
		submitStdin: submitStdinMutation,
		submitSubmission: submitSubmissionMutation,
	};
}

// Export this function separately
export const getSubmission = (token: string) =>
	api.get<GetSubmissionResponse>(`/judge/${token}`).then((res) => res.data);
