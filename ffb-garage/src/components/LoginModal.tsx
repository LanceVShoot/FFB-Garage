'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleVerifyCode = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Invalid verification code');
      }

      await login(email);
      onClose();
      setEmail('');
      setVerificationCode('');
      setIsCodeSent(false);
      toast.success('Successfully logged in!', {
        position: 'bottom-right',
      });
    } catch (error) {
      setVerificationCode('');
      setError(error instanceof Error ? error.message : 'Invalid verification code. Please try again.');
    }
  }, [email, verificationCode, login, onClose]);

  useEffect(() => {
    if (isOpen && !isCodeSent) {
      emailInputRef.current?.focus();
    }
  }, [isOpen, isCodeSent]);

  useEffect(() => {
    if (verificationCode.length === 6) {
      handleVerifyCode();
    }
  }, [verificationCode, handleVerifyCode]);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      if (!data.success) {
        if (data.error === 'rate_limit') {
          throw new Error('Too many attempts. Please try again in 15 minutes.');
        }
        throw new Error(data.error);
      }
      
      setIsCodeSent(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsCodeSent(false);
    setVerificationCode('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blueGray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-blueGray-800/90 backdrop-blur-xl p-8 rounded-xl border border-blueGray-700/50 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blueGray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          ✕
        </button>

        {!isCodeSent ? (
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Login to FFB Garage</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blueGray-300 mb-2">
                Email Address
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-blueGray-900/50 border border-blueGray-700/50 rounded-lg text-white
                         focus:border-lightBlue-500/50 focus:ring-2 focus:ring-lightBlue-500/20 focus:outline-none"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-lightBlue-500/20 text-lightBlue-300 hover:bg-lightBlue-500/30 rounded-lg
                       border border-lightBlue-500/30 hover:border-lightBlue-500/50 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={handleBack}
                className="text-blueGray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-white">Enter Verification Code</h2>
            </div>
            <p className="text-sm text-blueGray-300">
              We&apos;ve sent a verification code to {email}
            </p>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-blueGray-300 mb-2">
                6-Digit Code
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 bg-blueGray-900/50 border border-blueGray-700/50 rounded-lg text-white
                         focus:border-lightBlue-500/50 focus:ring-2 focus:ring-lightBlue-500/20 focus:outline-none
                         tracking-widest text-center text-2xl"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-lightBlue-500/20 text-lightBlue-300 hover:bg-lightBlue-500/30 rounded-lg
                       border border-lightBlue-500/30 hover:border-lightBlue-500/50 transition-all"
            >
              Verify Code
            </button>
          </form>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-blueGray-800/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="w-10 h-10 border-4 border-lightBlue-500/30 border-t-lightBlue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
} 