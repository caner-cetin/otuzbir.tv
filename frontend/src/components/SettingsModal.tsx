import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';
import type AceEditor from 'react-ace';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  code: React.MutableRefObject<AceEditor | null>;
  show: boolean;
  onHide: () => void;
}

/* 
  Key is the mode identifier string, value is the base64 encoded string of the source code
*/
export type CodeStorage = Record<string, string | undefined>
export enum Settings {
  COLOR_THEME = "colorTheme",
  CODE_STORAGE = "codeStorage",
  LANGUAGE_ID = "languageID"
}

export enum Themes {
  Chrome = 'chrome',
  Clouds = 'clouds',
  CrimsonEditor = 'crimson_editor',
  Dawn = 'dawn',
  Dreamweaver = 'dreamweaver',
  Eclipse = 'eclipse',
  GitHub = 'github',
  IPlastic = 'iplastic',
  KatzenMilch = 'katzenmilch',
  Kuroir = 'kuroir',
  SolarizedLight = 'solarized_light',
  SQLServer = 'sqlserver',
  TextMate = 'textmate',
  Tomorrow = 'tomorrow',
  XCode = 'xcode',
  Ambiance = 'ambiance',
  Chaos = 'chaos',
  CloudsMidnight = 'clouds_midnight',
  Cobalt = 'cobalt',
  Dracula = 'dracula',
  GreenOnBlack = 'gob',
  Gruvbox = 'gruvbox',
  IdleFingers = 'idle_fingers',
  KrTheme = 'kr_theme',
  Merbivore = 'merbivore',
  MerbivoreSoft = 'merbivore_soft',
  MonoIndustrial = 'mono_industrial',
  Monokai = 'monokai',
  PastelOnDark = 'pastel_on_dark',
  SolarizedDark = 'solarized_dark',
  Terminal = 'terminal',
  TomorrowNight = 'tomorrow_night',
  TomorrowNightBlue = 'tomorrow_night_blue',
  TomorrowNightBright = 'tomorrow_night_bright',
  TomorrowNightEighties = 'tomorrow_night_eighties',
  Twilight = 'twilight',
  VibrantInk = 'vibrant_ink'
}
export default function SettingsModal({ code, show, onHide }: SettingsModalProps) {
  const [colorTheme, setColorTheme] = useState(localStorage.getItem(Settings.COLOR_THEME) || Themes.TomorrowNightEighties);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!code.current) {
      toast.error('Editor canvas is not initialized, refresh the page. Sowwy.');
      return
    }
    if (!code.current.editor) {
      toast.error('Code editor not initialized, refresh the page. Sowwy.');
    }
    code.current?.editor?.setTheme(`ace/theme/${colorTheme}`);
    localStorage.setItem(Settings.COLOR_THEME, colorTheme);
  }, [colorTheme])


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
      </Modal.Body>
      <Modal.Footer className="bg-[#3c3836] border-t border-[#555568]">
        <Button variant="secondary" onClick={onHide} className="text-[#e9efec] bg-[#504945] border-[#555568]">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
