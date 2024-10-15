import { useMutation, useQuery } from "@tanstack/react-query";
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

type GetSubmissionResponse = {
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
const submitStdin = (id: number, stdin: string) =>
	api.post(`/judge/submit/stdin?id=${id}`, stdin, {
		headers: { "Content-Type": "text/plain" },
	});
const submitSubmission = (id: number) =>
	api
		.put<GetSubmissionResponse>(`/judge/submit/${id}?language=71`)
		.then((res) => res.data);

// Hook
export function useJudge() {
	const healthMutation = useMutation<HealthResponse, Error>({
		mutationFn: getHealth,
	});
	const languagesMutation = useMutation<LanguagesResponse, Error>({
		mutationFn: getLanguages,
	});

	const submitCodeMutation = useMutation<SubmitCodeResponse, Error, string>({
		mutationFn: submitCode,
	});
	const submitStdinMutation = useMutation<
		void,
		Error,
		{ id: number; stdin: string }
	>(({ id, stdin }) => submitStdin(id, stdin));
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
