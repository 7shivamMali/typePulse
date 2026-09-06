import React, { useState } from 'react';
import { loginUser, registerUser } from '../../services/api';
import type { UserProfile } from '../../types/typing';
import { X, User, Lock, Mail, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!email.includes('@')) {
          setError('Please provide a valid email address');
          setLoading(false);
          return;
        }
        const data = await registerUser(username, email, password);
        onAuthSuccess(data.access_token, data.user);
        onClose();
      } else {
        const data = await loginUser(username, password);
        onAuthSuccess(data.access_token, data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 font-mono">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-bg-surface border border-text-sub/20 shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-sub hover:text-text rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-4 mb-6 border-b border-text-sub/15 pb-2">
          <button
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`pb-1 text-sm font-semibold transition-all ${
              !isRegister ? 'text-main border-b-2 border-main' : 'text-text-sub hover:text-text'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`pb-1 text-sm font-semibold transition-all ${
              isRegister ? 'text-main border-b-2 border-main' : 'text-text-sub hover:text-text'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-error/15 text-error text-xs border border-error/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-sub mb-1">Username</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg border border-text-sub/20 focus-within:border-main transition-colors">
              <User className="w-4 h-4 text-text-sub" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="developer123"
                className="w-full bg-transparent text-sm text-text focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs text-text-sub mb-1">Email</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg border border-text-sub/20 focus-within:border-main transition-colors">
                <Mail className="w-4 h-4 text-text-sub" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-text focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-text-sub mb-1">Password</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg border border-text-sub/20 focus-within:border-main transition-colors">
              <Lock className="w-4 h-4 text-text-sub" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-text focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-main text-bg font-bold text-sm hover:brightness-110 shadow transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
