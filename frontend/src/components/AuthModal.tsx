import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { AxiosError } from 'axios';

interface AuthModalProps {
  isSignup: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isSignup, onClose, onSuccess }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) => {
      const response = await api.post(isSignup ? '/user/signup' : '/user/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      onSuccess();
      toast.success(isSignup ? 'Account created successfully!' : 'Logged in successfully!');
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-[#211e20] p-8 rounded-lg w-96 max-w-full">
        <h2 className="text-2xl mb-4 text-[#e9efec]">{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 bg-[#3a3a3a] text-[#e9efec] rounded"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 bg-[#3a3a3a] text-[#e9efec] rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-[#3a3a3a] text-[#e9efec] rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-[#4a4a4a] text-[#e9efec] rounded hover:bg-[#5a5a5a]"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-[#a0a08b] hover:text-[#e9efec]">
          Close
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}