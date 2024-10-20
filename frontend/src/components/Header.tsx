import React, { useState } from 'react';
import { LogIn, UserPlus, User, LogOut, Settings } from 'lucide-react';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import type { AuthOptions, KindeUser } from '@kinde-oss/kinde-auth-pkce-js';
import type { LanguagesResponse } from 'src/hooks/useJudge';
import SettingsModal from './SettingsModal';
import type AceEditor from 'react-ace';

interface HeaderProps {
  code: React.MutableRefObject<AceEditor | null>;
  user: KindeUser | undefined;
  languages: LanguagesResponse;
  setLanguageID: React.Dispatch<React.SetStateAction<number>>;
  onLogin: (options: AuthOptions) => Promise<void>;
  onSignup: (options: AuthOptions) => Promise<void>;
  onLogout: () => void;
  onSubmit: () => void;
  onSubmitWithStdin: () => void;
  onClearSubmissions: () => void;
}

export default function Header({
  code,
  user,
  languages,
  setLanguageID,
  onLogin,
  onSignup,
  onLogout,
  onSubmit,
  onSubmitWithStdin,
  onClearSubmissions,
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false); // State to control modal
  const loginOpts: AuthOptions = {};
  const signupOpts: AuthOptions = {};

  const login = async () => {
    await onLogin(loginOpts);
  };
  const signup = async () => {
    await onSignup(signupOpts);
  };

  const logout = () => {
    onLogout();
    window.location.reload();
  };

  return (
    <header className="w-full bg-[#211e20] border-b border-[#555568] p-2">
      <div className="flex justify-between items-center">
        <div className="text-[#a0a08b]">PIP-OS v7.1.0.8</div>
        <div className="flex items-center space-x-2">
          <Button variant="link" style={{ color: '#e9efec' }} className="hover:bg-[#504945] transition-colors duration-200" onClick={onSubmit}>
            Execute
          </Button>
          <Button variant="link" style={{ color: '#e9efec' }} className="hover:bg-[#504945] transition-colors duration-200" onClick={onSubmitWithStdin}>
            Execute with Stdin
          </Button>
          <Button variant="link" style={{ color: '#e9efec' }} className="hover:bg-[#cc241d] transition-colors duration-200" onClick={onClearSubmissions}>
            Clear Local Submissions
          </Button>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="link" style={{ color: '#e9efec' }} className="hover:bg-[#504945] transition-colors duration-200">
              Languages
            </Dropdown.Toggle>
            <Dropdown.Menu className="border-[#555568] scrollable-dropdown">
              {languages.map((lang) => (
                <Dropdown.Item key={lang.id} className="text-[#e9efec] hover:bg-[#504945]" onClick={() => setLanguageID(lang.id)}>
                  {lang.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center mr-4">
              <User className="w-5 h-5 text-[#a0a08b] mr-2" />
              <span className="text-[#a0a08b]">{user.given_name ?? 'friend'}</span>
              <button type="button" onClick={logout} className="ml-4 text-[#a0a08b] hover:text-[#e9efec] hover:bg-[#504945] p-1 rounded transition-colors duration-200">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center mr-4">
              <button type="button" onClick={login} className="mr-2 text-[#a0a08b] hover:text-[#e9efec] hover:bg-[#504945] p-1 rounded transition-colors duration-200">
                <LogIn className="w-5 h-5" />
              </button>
              <button type="button" onClick={signup} className="text-[#a0a08b] hover:text-[#e9efec] hover:bg-[#504945] p-1 rounded transition-colors duration-200">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          )}
          <Button variant="link" onClick={() => setShowSettings(true)}>
            <Settings className="w-7 h-7 text-[#a0a08b] hover:text-[#e9efec] hover:bg-[#504945] p-1 rounded transition-colors duration-200" />
          </Button>
          <div className="text-[#a0a08b]">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
      <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} code={code}/>
    </header>
  );
}
