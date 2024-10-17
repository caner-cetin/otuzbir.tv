import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "../components/Header";
import StdinModal from "../components/StdinModal";
import OutputModal from "../components/OutputModal";
import "@codingame/monaco-vscode-python-default-extension";
import { createFileRoute } from "@tanstack/react-router";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { VSConfig } from "../editor/config";
import { useJudge, getSubmission } from "src/hooks/useJudge";
import {
  getStoredSubmissions,
  type StoredSubmission,
} from "src/utils/submissionCounter";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Submissions from "src/hooks/useSubmissions";
import CustomToast from "src/components/CustomToast";
import { LANGUAGE_CONFIG, useLanguageExtensionLoader } from "src/editor/loadLanguageExtension";
export const Route = createFileRoute("/code")({
  component: MonacoPage,
});

export default function MonacoPage() {
  const [showStdinModal, setShowStdinModal] = useState(false);
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [editorState, setEditorState] = useState<MonacoEditorLanguageClientWrapper | null>(null);
  const [languageID, setLanguageID] = useState<number>(71);
  const { isLoading } = useLanguageExtensionLoader(languageID, editorState);
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

  const editorInitialized = React.useRef(false);

  useEffect(() => {
    if (!isMobile && !editorInitialized.current) {
      const initEditor = async () => {
        const wrapper = new MonacoEditorLanguageClientWrapper();
        const wrapperConfig = VSConfig();
        await wrapper.init(wrapperConfig);
        await wrapper.start();
        editorInitialized.current = true;
        setEditorState(wrapper);
      };
      initEditor();
    }
  }, [isMobile]);


  useEffect(() => {
    if (editorState && LANGUAGE_CONFIG[languageID]) {
      const config = LANGUAGE_CONFIG[languageID];
      editorState.updateCodeResources({
        main: {
          text: config.defaultText,
          fileExt: config.fileExt,
        }
      }).catch(error => {
        console.error('Failed to update editor resources:', error);
        toast.error('Failed to update editor. Please refresh the page.');
      });
    }
  }, [languageID, editorState]);

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
      <CustomToast />
      <Header
        user={user}
        languages={JudgeAPI.languages.data ?? []}
        setLanguageID={setLanguageID}
        onLogin={login}
        onSignup={register}
        onLogout={logout}
        onSubmit={() => Submissions.handleSubmitCode(editorState, languageID, false, setShowStdinModal, JudgeAPI, setSubmissions)}
        onSubmitWithStdin={() => Submissions.handleSubmitCode(editorState, languageID, true, setShowStdinModal, JudgeAPI, setSubmissions)}
        onClearSubmissions={() => Submissions.handleClearSubmissions(setSubmissions)}
      />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={70} minSize={30}>
          <div
            id="monaco-editor-root"
            className="h-full"
            style={{ visibility: isLoading ? 'hidden' : 'visible' }}
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
        languageId={languageID}
        onHide={() => setShowStdinModal(false)}
        onSubmit={Submissions.handleSubmitStdin}
        setSubmissions={setSubmissions}
        judgeApi={JudgeAPI}
      />
    </div>
  );
}
