import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "../components/Header";
import StdinModal from "../components/StdinModal";
import OutputModal from "../components/OutputModal";
import "@codingame/monaco-vscode-python-default-extension";
import { createFileRoute } from "@tanstack/react-router";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { VSConfig } from "../editor/python";
import { useJudge, getSubmission } from "src/hooks/useJudge";
import {
  getStoredSubmissions,
  type StoredSubmission,
} from "src/utils/submissionCounter";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Submissions from "src/hooks/useSubmissions";

export const Route = createFileRoute("/code")({
  component: MonacoPage,
});

export default function MonacoPage() {
  const [showStdinModal, setShowStdinModal] = useState(false);
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [editorState, setEditorState] = useState<MonacoEditorLanguageClientWrapper | null>(null);
  const { login, register, logout } = useKindeAuth();
  const auth = useKindeAuth();
  const user = auth.user;
  const JudgeAPI = useJudge();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this value as needed
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const storedSubmissions = getStoredSubmissions();
      setSubmissions(storedSubmissions.sort((a, b) => b.localId - a.localId));
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      const initEditor = async () => {
        const wrapper = new MonacoEditorLanguageClientWrapper();
        const wrapperConfig = VSConfig(
          "/workspace",
          "print('Hello, World!')",
          "/workspace/script.py",
          {
            lspHost: "localhost",
            lspPort: 8080,
            lspPath: "lsp/pyright",
            lspSecured: false,
          },
        );
        await wrapper.init(wrapperConfig);
        await wrapper.start();
        setEditorState(wrapper);
      };
      initEditor();
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
        <h1 className="text-2xl text-center">
          Not usable on mobile/tablets. sowwy.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex flex-col">
      <Toaster />
      <Header
        user={user}
        onLogin={login}
        onSignup={register}
        onLogout={logout}
        onSubmit={() => Submissions.handleSubmitCode(editorState, false, setShowStdinModal, JudgeAPI, setSubmissions)}
        onSubmitWithStdin={() => Submissions.handleSubmitCode(editorState, true, setShowStdinModal, JudgeAPI, setSubmissions)}
        onClearSubmissions={() => Submissions.handleClearSubmissions(setSubmissions)}
      />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={70} minSize={30}>
          <div
            id="monaco-editor-root"
            className="h-full"
          />
        </Panel>
        <PanelResizeHandle className="w-2 bg-[#3c3836] hover:bg-[#504945] cursor-col-resize" />
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-[#2c2a2a] p-4 overflow-y-auto">
            <OutputModal
              submissions={submissions}
              getSubmission={getSubmission}
            />
          </div>
        </Panel>
      </PanelGroup>
      <StdinModal
        show={showStdinModal}
        onHide={() => setShowStdinModal(false)}
        onSubmit={Submissions.handleSubmitStdin}
        setSubmissions={setSubmissions}
        judgeApi={JudgeAPI}
      />
    </div>
  );
}
