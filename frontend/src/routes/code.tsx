import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CustomToast from "src/components/CustomToast";
import AceEditor from 'react-ace';
import { getSubmission, useJudge } from "src/hooks/useJudge";
import Submissions from "src/hooks/useSubmissions";
import {
  getStoredSubmissions,
  type StoredSubmission,
} from "src/utils/submissionCounter";
import Header from "../components/Header";
import 'ace-builds/src-noconflict/ext-error_marker';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';
import 'ace-builds/src-noconflict/ext-code_lens'
import 'ace-builds/src-noconflict/ext-statusbar';
import OutputModal from "../components/OutputModal";
import StdinModal from "../components/StdinModal";
import { configureAce } from "src/editor/config";
import { LANGUAGE_CONFIG } from "src/editor/languages";
export const Route = createFileRoute("/code")({
  component: MonacoPage,
});


export default function MonacoPage() {
  const [showStdinModal, setShowStdinModal] = useState(false);
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [languageID, setLanguageID] = useState<number>(71);
  const code = useRef<AceEditor | null>(null);
  const { login, register, logout } = useKindeAuth();
  const auth = useKindeAuth();
  const user = auth.user;
  const JudgeAPI = useJudge();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    configureAce();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const storedSubmissions = getStoredSubmissions();
      setSubmissions(storedSubmissions.sort((a, b) => b.localId - a.localId));
    }
  }, [isMobile]);

  useEffect(() => {
    const language = LANGUAGE_CONFIG[languageID];
    language?.extensionModule().then(() => {
      code.current?.editor?.session.setMode(`ace/mode/${language?.mode}`);
      code.current?.editor?.setValue(language?.defaultText);
    });
  }, [languageID])



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
        onSubmit={() => Submissions.handleSubmitCode(code.current, languageID, false, setShowStdinModal, JudgeAPI, setSubmissions)}
        onSubmitWithStdin={() => Submissions.handleSubmitCode(code.current, languageID, true, setShowStdinModal, JudgeAPI, setSubmissions)}
        onClearSubmissions={() => Submissions.handleClearSubmissions(setSubmissions)}
      />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={70} minSize={30}>
          <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", backgroundColor: "#1e1e1e" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <AceEditor
                mode="python"
                ref={code}
                theme="tomorrow_night_eighties"
                name="ace-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
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