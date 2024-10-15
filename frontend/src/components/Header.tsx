import React from 'react';
import { LogIn, UserPlus, User, LogOut } from 'lucide-react';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import type { AuthOptions, KindeUser } from '@kinde-oss/kinde-auth-pkce-js';

interface HeaderProps {
  user: KindeUser | undefined;
  onLogin: (options: AuthOptions) => Promise<void>;
  onSignup: (options: AuthOptions) => Promise<void>;
  onLogout: () => void;
  onSubmit: () => void;
  onSubmitWithStdin: () => void;
  onClearSubmissions: () => void;
}

export default function Header({
  user,
  onLogin,
  onSignup,
  onLogout,
  onSubmit,
  onSubmitWithStdin,
  onClearSubmissions
}: HeaderProps) {
  const loginOpts: AuthOptions = {}
  const signupOpts: AuthOptions = {}

  const login = async () => {
    await onLogin(loginOpts)
  }
  const signup = async () => {
    await onSignup(signupOpts)
  }

  const logout = () => {
    onLogout()
    window.location.reload()
  }
  return (
    <header className="w-full bg-[#211e20] border-b border-[#555568] p-2">
      <div className="flex justify-between items-center">
        <div className="text-[#a0a08b]">PIP-OS v7.1.0.8</div>
        <div className="flex items-center space-x-2">
          <Button variant="primary" onClick={onSubmit}>Submit</Button>
          <Button variant="secondary" onClick={onSubmitWithStdin}>Submit with Stdin</Button>
          <Button variant="danger" onClick={onClearSubmissions}>Clear Submissions</Button>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Languages
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => console.log("piton")}>Python (w/ LSP)</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center mr-4">
              <User className="w-5 h-5 text-[#a0a08b] mr-2" />
              <span className="text-[#a0a08b]">{user.given_name ?? "friend"}</span>
              <button type='button' onClick={logout} className="ml-4 text-[#a0a08b] hover:text-[#e9efec]">
                <LogOut className='w-5 h-5' />
              </button>
            </div>
          ) : (
            <div className="flex items-center mr-4">
              <button type='button' onClick={login} className="mr-2">
                <LogIn className="w-5 h-5 text-[#a0a08b] hover:text-[#e9efec]" />
              </button>
              <button type='button' onClick={signup}>
                <UserPlus className="w-5 h-5 text-[#a0a08b] hover:text-[#e9efec]" />
              </button>
            </div>
          )}
          <div className="text-[#a0a08b]">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </header>
  );
}