import type { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import type { JudgeAPISpec } from "src/hooks/useJudge";
import Submissions from "src/hooks/useSubmissions";

interface StdinModalProps {
	show: boolean
	onHide: () => void
	languageId: number
	onSubmit: (stdin: string, JudgeAPI: JudgeAPISpec, languageId: number, setSubmissions: React.Dispatch<React.SetStateAction<Submissions.StoredSubmission[]>>) => Promise<void>
	setSubmissions: React.Dispatch<React.SetStateAction<Submissions.StoredSubmission[]>>
	judgeApi: JudgeAPISpec
}

const StdinModal: React.FC<StdinModalProps> = ({
	show,
	onHide,
	languageId,
	onSubmit,
	setSubmissions,
	judgeApi,
}) => {
	const [stdin, setStdin] = useState("");
	const handleSubmit = () => {
		onSubmit(stdin, judgeApi, languageId, setSubmissions);
		onHide();
		return;
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Stdin</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Control
					as="textarea"
					rows={3}
					value={stdin}
					onChange={(e) => setStdin(e.target.value)}
					placeholder="can be submitted blank"
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Cancel
				</Button>
				<Button variant="primary" onClick={handleSubmit}>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default StdinModal;
