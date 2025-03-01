'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // TODO: API call to send verification code
      setIsCodeSent(true);
    } catch {
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email);
      onClose();
      setEmail('');
      setVerificationCode('');
      setIsCodeSent(false);
    } catch {
      setError('Invalid verification code. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {!isCodeSent ? (
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Login to FFB Garage</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                       transition-colors duration-200"
            >
              Send Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Enter Verification Code</h2>
            <p className="text-sm text-gray-300">
              We&apos;ve sent a verification code to {email}
            </p>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                6-Digit Code
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                         tracking-widest text-center text-2xl"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                       transition-colors duration-200"
            >
              Verify Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 