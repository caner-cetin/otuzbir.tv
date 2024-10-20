import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import CustomToast from 'src/components/CustomToast'
import { initializeAce } from 'src/editor/config'
import { LANGUAGE_CONFIG } from 'src/editor/languages'
import { getSubmission, useJudge } from 'src/hooks/useJudge'
import Submissions, { type StoredSubmission } from 'src/hooks/useSubmissions'
import { getStoredSubmissions } from 'src/utils/submissionCounter'
import Header from '../../components/Header'
import OutputModal from '../../components/OutputModal'
import StdinModal from '../../components/StdinModal'
import 'ace-builds/src-noconflict/ext-code_lens'
import 'ace-builds/src-noconflict/ext-error_marker'
import 'ace-builds/src-noconflict/ext-inline_autocomplete'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-settings_menu'
import 'ace-builds/src-noconflict/ext-statusbar'
import Markdown from 'react-markdown'
import {
  type CodeStorage,
  LanguageId,
  RenderFirst,
  Settings,
  useColorTheme,
  useRenderFirst,
} from 'src/services/settings'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/code/')({
  component: MainPage,
})

export default function MainPage() {
  const [showStdinModal, setShowStdinModal] = useState(false)
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [renderFirst, setRenderFirst] = useRenderFirst()
  const [colorTheme] = useColorTheme()
  const [languageID, setLanguageID] = useState<number>(() => {
    if (renderFirst === RenderFirst.WelcomeMarkdown) {
      return LanguageId.Markdown
    }
    const storedLanguageID = localStorage.getItem(Settings.DEFAULT_LANGUAGE_ID)
    return storedLanguageID
      ? Number.parseInt(storedLanguageID, 10)
      : LanguageId.Python3
  })
  const [prevLanguageID, setPrevLanguageID] = useState<number>(
    LanguageId.Python3,
  )
  const [sourceCode, setSourceCode] = useState<string | null>(null)
  const [readme, setReadme] = useState<string | null>(null)
  const code = useRef<AceEditor | null>(null)
  const { login, register, logout } = useKindeAuth()
  const auth = useKindeAuth()
  const user = auth.user
  const JudgeAPI = useJudge()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <we do not need to re-render upon language ID change>
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', checkMobile)
    if (renderFirst === RenderFirst.CodeEditor) {
      initializeAce(code, colorTheme, languageID)
    } else if (renderFirst === RenderFirst.WelcomeMarkdown) {
      const readReadme = async () => {
        const response = await fetch('/readme.md')
        if (response.ok) {
          const text = await response.text()
          setReadme(text)
        } else {
          toast.error('dumbass me forgot writing readme.md, sorry')
        }
      }
      readReadme()
    }
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      const storedSubmissions = getStoredSubmissions()
      setSubmissions(storedSubmissions.sort((a, b) => b.localId - a.localId))
    }
  }, [isMobile])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <declaring both language id and source code causes to re-render 2 times when a source code is reloaded>
  useEffect(() => {
    if (languageID !== LanguageId.Markdown && languageID !== prevLanguageID) {
      setRenderFirst(RenderFirst.CodeEditor)
      const previousLanguage = LANGUAGE_CONFIG[prevLanguageID]
      const codes = JSON.parse(
        localStorage.getItem(Settings.CODE_STORAGE) || '{}',
      ) as CodeStorage
      const previousLanguageModeID: string = code.current?.editor
        ?.getSession()
        // @ts-ignore
        .getMode().$id
      const oldCode = code.current?.editor?.getValue()
      codes[previousLanguageModeID] = oldCode
        ? btoa(oldCode)
        : btoa(previousLanguage?.defaultText || '')
      localStorage.setItem(Settings.CODE_STORAGE, JSON.stringify(codes))

      const currentLanguage = LANGUAGE_CONFIG[languageID]
      currentLanguage?.extensionModule().then(() => {
        code.current?.editor?.session.setMode(
          `ace/mode/${currentLanguage?.mode}`,
        )
        const currentLanguageModeID: string =
          // @ts-ignore
          code.current?.editor?.session.getMode().$id
        const cs = JSON.parse(
          localStorage.getItem(Settings.CODE_STORAGE) || '{}',
        ) as CodeStorage
        const savedCode = cs[currentLanguageModeID]

        // Restore source code
        code.current?.editor?.setValue(
          savedCode ? atob(savedCode) : currentLanguage?.defaultText || '',
        )

        if (sourceCode) {
          code.current?.editor?.setValue(sourceCode)
          setSourceCode(null) // Clear to avoid re-render
        }
      })
      setPrevLanguageID(languageID)
      localStorage.setItem(Settings.DEFAULT_LANGUAGE_ID, languageID.toString())
    }
  }, [languageID])

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
        <h1 className="text-2xl text-center">
          Not usable on mobile/tablets. sowwy.
        </h1>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex flex-col">
      <CustomToast />
      <Header
        code={code}
        user={user}
        languages={JudgeAPI.languages.data ?? []}
        languageID={languageID}
        displayingSharedCode={false}
        setLanguageID={setLanguageID}
        onLogin={login}
        onSignup={register}
        onLogout={logout}
        onSubmit={() =>
          Submissions.handleSubmitCode(
            code.current,
            languageID,
            false,
            setShowStdinModal,
            JudgeAPI,
            setSubmissions,
          )
        }
        onSubmitWithStdin={() =>
          Submissions.handleSubmitCode(
            code.current,
            languageID,
            true,
            setShowStdinModal,
            JudgeAPI,
            setSubmissions,
          )
        }
        onClearSubmissions={() =>
          Submissions.handleClearSubmissions(setSubmissions)
        }
      />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={70} minSize={30}>
          {renderFirst === RenderFirst.WelcomeMarkdown && (
            <div
              style={{
                display: 'flex',
                width: '100%',
                maxHeight: '90vh',
                backgroundColor: '#1e1e1e',
              }}
            >
              <div
                style={{
                  flex: 1,
                  position: 'relative',
                  overflow: 'auto',
                  padding: '20px',
                }}
              >
                <Markdown
                  remarkPlugins={[
                    [remarkGfm, { singleTilde: false }],
                    [
                      remarkToc,
                      { tight: true, maxDepth: 5, heading: 'contents' },
                    ],
                  ]}
                  rehypePlugins={[[rehypeSlug]]}
                >
                  {readme}
                </Markdown>
              </div>
            </div>
          )}
          {renderFirst === RenderFirst.CodeEditor && (
            <div
              style={{
                display: 'flex',
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                backgroundColor: '#1e1e1e',
              }}
            >
              <div style={{ flex: 1, position: 'relative' }}>
                <AceEditor
                  mode="python"
                  ref={code}
                  theme="tomorrow_night_eighties"
                  name="ace-editor"
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
          )}
        </Panel>
        <PanelResizeHandle className="w-2 bg-[#3c3836] hover:bg-[#504945] cursor-col-resize" />
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-[#2c2a2a] p-4 overflow-y-auto">
            <OutputModal
              displayingSharedCode={false}
              setSourceCode={setSourceCode}
              submissions={submissions}
              getSubmission={getSubmission}
              setLanguageId={setLanguageID}
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
  )
}
