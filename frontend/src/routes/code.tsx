import React, { useState, useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'
import AuthModal from '../components/AuthModal'
import '@codingame/monaco-vscode-python-default-extension';
import { createFileRoute } from '@tanstack/react-router'
import { MonacoEditorLanguageClientWrapper } from 'monaco-editor-wrapper'
import { VSConfig } from '../editor/python'
export const Route = createFileRoute('/code')({
  component: MonacoPage,
})

export default function MonacoPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const { isAuthenticated, user, handleLogout } = useAuth()
  const editorRef = useRef<MonacoEditorLanguageClientWrapper | null>(null);

  const [editorReady, setEditorReady] = useState(false);
  const wrapper = new MonacoEditorLanguageClientWrapper();
  const wrapperConfig = VSConfig('/workspace', "print('Hello, World!')", '/workspace/script.py', {
    lspHost: 'localhost',
    lspPort: 8080,
    lspPath: 'lsp/pyright',
    lspSecured: false,
  });
  useEffect(() => {
    const initEditor = async () => {
      if (editorRef.current) return;
      await wrapper.init(wrapperConfig);
      await wrapper.start();
      setEditorReady(true);
    };
    initEditor();
  }, [wrapper, wrapperConfig]);

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
      />
      <div id="monaco-editor-root" style={{ height: '100vh', maxWidth: '130vh' }} />
      {showAuthModal && (
        <AuthModal
          isSignup={isSignup}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}