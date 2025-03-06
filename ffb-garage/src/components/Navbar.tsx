'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out!', {
      position: 'bottom-right',
    });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-900/50 border-b border-zinc-800/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/"
                className="text-xl font-bold text-zinc-100"
              >
                FFB Garage
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/submit"
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Submit Settings
              </Link>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 
                           rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-all"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 
                           rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
} 