import { toast } from "react-hot-toast";
import "@codingame/monaco-vscode-python-default-extension";
import type { JudgeAPISpec } from "./useJudge";
import type { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";

export namespace Submissions {
	const SUBMISSION_COUNTER_KEY = "submissionCounter";
	const SUBMISSIONS_KEY = "submissions";

	export interface StoredSubmission {
		localId: number;
		globalId: number;
		token: string;
	}

	export function getNextSubmissionId(): number {
		const currentCounter = localStorage.getItem(SUBMISSION_COUNTER_KEY);
		const nextId = currentCounter ? Number.parseInt(currentCounter, 10) + 1 : 1;
		localStorage.setItem(SUBMISSION_COUNTER_KEY, nextId.toString());
		return nextId;
	}

	export function saveSubmission(submission: StoredSubmission): void {
		const submissions = getStoredSubmissions();
		submissions.push(submission);
		localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
	}

	export function getStoredSubmissions(): StoredSubmission[] {
		const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
		return storedSubmissions ? JSON.parse(storedSubmissions) : [];
	}

	export function clearStoredSubmissions(): void {
		localStorage.removeItem(SUBMISSIONS_KEY);
		localStorage.removeItem(SUBMISSION_COUNTER_KEY);
	}

	export async function handleSubmitCode(
		editor: MonacoEditorLanguageClientWrapper | null,
		withStdin: boolean,
		setShowStdinModal: (show: boolean) => void,
		JudgeAPI: JudgeAPISpec,
		setSubmissions: React.Dispatch<React.SetStateAction<StoredSubmission[]>>
	): Promise<void> {
		if (editor === null) {
			toast.error("editor is uninitalized");
			return;
		}
		const code = editor?.getTextContents()?.text;
		if (code === undefined || code === null) {
			toast.error("No code to submit");
			return;
		}
		try {
			const result = await JudgeAPI.submitCode.mutateAsync(code);
			if (withStdin) {
				setShowStdinModal(true);
			} else {
				await finalizeSubmission(result.id, JudgeAPI, setSubmissions);
			}
		} catch (error) {
			toast.error("Failed to submit code");
		}
	}

	export async function handleSubmitStdin(
		stdin: string,
		JudgeAPI: JudgeAPISpec,
		setSubmissions: React.Dispatch<React.SetStateAction<StoredSubmission[]>>
	): Promise<void> {
		if (!JudgeAPI.submitCode.data?.id) {
			toast.error("No submission ID available");
			return;
		}
		try {
			if (stdin.trim() !== "") {
				await JudgeAPI.submitStdin.mutateAsync({
					id: JudgeAPI.submitCode.data.id,
					stdin,
				});
			}
			await finalizeSubmission(JudgeAPI.submitCode.data.id, JudgeAPI, setSubmissions);
		} catch (error) {
			toast.error("Failed to process submission");
		}
	}

	async function finalizeSubmission(
		globalId: number,
		JudgeAPI: JudgeAPISpec,
		setSubmissions: React.Dispatch<React.SetStateAction<StoredSubmission[]>>
	): Promise<void> {
		const result = await JudgeAPI.submitSubmission.mutateAsync(globalId);
		const localId = getNextSubmissionId();
		const newSubmission = { localId, globalId, token: result.token };
		saveSubmission(newSubmission);
		setSubmissions(prev => [newSubmission, ...prev].sort((a, b) => b.localId - a.localId));
		toast.success("Submission successful");
	}

	export function handleClearSubmissions(
		setSubmissions: React.Dispatch<React.SetStateAction<StoredSubmission[]>>
	): void {
		clearStoredSubmissions();
		setSubmissions([]);
		toast.success("Submissions cleared");
	}
}

export default Submissions;
