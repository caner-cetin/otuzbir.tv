import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';
import type AceEditor from 'react-ace';
import { RenderFirst, Settings, Themes, useColorTheme, useRenderFirst } from 'src/services/settings';
import { initializeAce } from 'src/editor/config';

interface SettingsModalProps {
  code: React.MutableRefObject<AceEditor | null>;
  languageID: number;
  setLanguageID: React.Dispatch<React.SetStateAction<number>>;
  show: boolean;
  onHide: () => void;
}


export default function SettingsModal({ code, languageID, setLanguageID, show, onHide }: SettingsModalProps) {
  const [colorTheme, setColorTheme] = useColorTheme();
  const [oldColorTheme, setOldColorTheme] = useState(colorTheme)
  const [renderFirst, setRenderFirst] = useRenderFirst()
  const [oldRenderFirst, setOldRenderFirst] = useState(renderFirst)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (oldColorTheme !== colorTheme) {
      setOldColorTheme(colorTheme)
      if (!code.current) {
        initializeAce(code, colorTheme, languageID);
      }
      code.current?.editor?.setTheme(`ace/theme/${colorTheme}`);
      localStorage.setItem(Settings.COLOR_THEME, colorTheme);
    }
  }, [colorTheme])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <no need to re render on changing old value>
  useEffect(() => {
    if (oldRenderFirst !== renderFirst) {
      setOldRenderFirst(renderFirst)
      localStorage.setItem(Settings.RENDER_FIRST, JSON.stringify(renderFirst))
    }
  }, [renderFirst])


  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-[#3c3836] border-b border-[#555568] text-[#a0a08b]">
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-[#3c3836] text-[#e9efec]">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" variant="link" style={{ color: '#e9efec' }} className="hover:bg-[#504945] transition-colors duration-200">
            Color Theme
          </Dropdown.Toggle>

          <Dropdown.Menu className='scrollable-dropdown' >
            <Dropdown.Item onClick={() => setColorTheme(Themes.Chrome)}>Chrome</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Clouds)}>Clouds</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.CrimsonEditor)}>Crimson Editor</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Dawn)}>Dawn</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Dreamweaver)}>Dreamweaver</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Eclipse)}>Eclipse</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.GitHub)}>GitHub</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.IPlastic)}>IPlastic</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.KatzenMilch)}>KatzenMilch</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Kuroir)}>Kuroir</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.SolarizedLight)}>Solarized Light</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.SQLServer)}>SQL Server</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.TextMate)}>TextMate</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Tomorrow)}>Tomorrow</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.XCode)}>XCode</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Ambiance)}>Ambiance</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Chaos)}>Chaos</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.CloudsMidnight)}>Clouds Midnight</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Cobalt)}>Cobalt</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Dracula)}>Dracula</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.GreenOnBlack)}>Green on Black</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Gruvbox)}>Gruvbox</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.IdleFingers)}>Idle Fingers</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.KrTheme)}>Kr Theme</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Merbivore)}>Merbivore</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.MerbivoreSoft)}>Merbivore Soft</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.MonoIndustrial)}>Mono Industrial</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Monokai)}>Monokai</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.PastelOnDark)}>Pastel on Dark</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.SolarizedDark)}>Solarized Dark</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Terminal)}>Terminal</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.TomorrowNight)}>Tomorrow Night</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.TomorrowNightBlue)}>Tomorrow Night Blue</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.TomorrowNightBright)}>Tomorrow Night Bright</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.TomorrowNightEighties)}>Tomorrow Night Eighties</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.Twilight)}>Twilight</Dropdown.Item>
            <Dropdown.Item onClick={() => setColorTheme(Themes.VibrantInk)}>Vibrant Ink</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle id='dropdown-basic' variant='link' style={{ color: '#e9efec' }} className='hover:bg-[#504945] transition-colors duration-200'>
            Set Initial View
          </Dropdown.Toggle>

          <Dropdown.Menu className='scrollable-dropdown'>
            <Dropdown.Item onClick={() => setRenderFirst(RenderFirst.WelcomeMarkdown)}>README</Dropdown.Item>
            <Dropdown.Item onClick={() => setRenderFirst(RenderFirst.CodeEditor)}>Default Editor</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer className="bg-[#3c3836] border-t border-[#555568]">
        <Button variant="secondary" onClick={onHide} className="text-[#e9efec] bg-[#504945] border-[#555568]">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
