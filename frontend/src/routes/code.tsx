import React, { useState, useEffect, useRef } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'
import AuthModal from '../components/AuthModal'
import StdinModal from '../components/StdinModal'
import OutputModal from '../components/OutputModal'
import '@codingame/monaco-vscode-python-default-extension';
import { createFileRoute } from '@tanstack/react-router'
import { MonacoEditorLanguageClientWrapper } from 'monaco-editor-wrapper'
import { VSConfig } from '../editor/python'
import { useJudge, getSubmission } from 'src/hooks/useJudge'
import { getNextSubmissionId, saveSubmission, getStoredSubmissions, clearStoredSubmissions, StoredSubmission } from '../utils/submissionCounter'

export const Route = createFileRoute('/code')({
  component: MonacoPage,
})

export default function MonacoPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showStdinModal, setShowStdinModal] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const { isAuthenticated, user, handleLogout } = useAuth()
  const editorRef = useRef<MonacoEditorLanguageClientWrapper | null>(null);

  const {
    health,
    languages,
    submitCode,
    submitStdin,
    submitSubmission,
  } = useJudge();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this value as needed
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const storedSubmissions = getStoredSubmissions();
      setSubmissions(storedSubmissions);
    }
  }, [isMobile]);

  const handleSubmitCode = async (withStdin: boolean) => {
    const code = editorRef.current?.getTextContents()?.text;
    if (code === undefined || code === null) {
      toast.error('No code to submit');
      return;
    }
    try {
      const result = await submitCode.mutateAsync(code);
      if (withStdin) {
        setShowStdinModal(true);
      } else {
        await finalizeSubmission(result.id);
      }
    } catch (error) {
      toast.error('Failed to submit code');
    }
  };

  const handleSubmitStdin = async (stdin: string) => {
    if (!submitCode.data?.id) {
      toast.error('No submission ID available');
      return;
    }

    try {
      if (stdin.trim() !== '') {
        await submitStdin.mutateAsync({ id: submitCode.data.id, stdin });
      }
      await finalizeSubmission(submitCode.data.id);
    } catch (error) {
      toast.error('Failed to process submission');
    }
  };

  const finalizeSubmission = async (globalId: number) => {
    const result = await submitSubmission.mutateAsync(globalId);
    const localId = getNextSubmissionId();
    const newSubmission = { localId, globalId, token: result.token };
    setSubmissions(prev => [...prev, newSubmission]);
    saveSubmission(newSubmission);
    toast.success('Submission successful');
  };

  const handleClearSubmissions = () => {
    clearStoredSubmissions();
    setSubmissions([]);
    toast.success('Submissions cleared');
  };

  useEffect(() => {
    if (!isMobile) {
      const initEditor = async () => {
        if (editorRef.current) return;
        const wrapper = new MonacoEditorLanguageClientWrapper();
        const wrapperConfig = VSConfig('/workspace', "print('Hello, World!')", '/workspace/script.py', {
          lspHost: 'localhost',
          lspPort: 8080,
          lspPath: 'lsp/pyright',
          lspSecured: false,
        });
        await wrapper.init(wrapperConfig);
        await wrapper.start();
        editorRef.current = wrapper;
      };
      initEditor();
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
        <h1 className="text-2xl text-center">Not usable on mobile/tablets. sowwy.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex flex-col">
      <Toaster />
      <Header
        isAuthenticated={isAuthenticated}
        user={user ?? null}
        onLogin={() => {
          setIsSignup(false)
          setShowAuthModal(true)
        }}
        onSignup={() => {
          setIsSignup(true)
          setShowAuthModal(true)
        }}
        onLogout={handleLogout}
        onSubmit={() => handleSubmitCode(false)}
        onSubmitWithStdin={() => handleSubmitCode(true)}
        onClearSubmissions={handleClearSubmissions}
      />
      <div className="flex flex-1">
        <div id="monaco-editor-root" className="flex-1" style={{ height: 'calc(100vh - 60px)' }} />
        <div className="w-1/3 bg-[#2c2a2a] p-4 overflow-auto">
          <OutputModal
            submissions={submissions}
            getSubmission={getSubmission}
          />
        </div>
      </div>
      {showAuthModal && (
        <AuthModal
          isSignup={isSignup}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
      <StdinModal
        show={showStdinModal}
        onHide={() => setShowStdinModal(false)}
        onSubmit={handleSubmitStdin}
      />
    </div>
  )
}