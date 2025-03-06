'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-blueGray-800/80 backdrop-blur-xl border-b border-blueGray-700/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/"
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lightBlue-400 to-lightBlue-200"
              >
                FFB Garage
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/submit"
                className="px-4 py-2 text-sm font-medium text-blueGray-300 hover:text-white transition-colors"
              >
                Submit Settings
              </Link>

              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium bg-blueGray-900/50 text-blueGray-300 hover:text-white rounded-lg border border-blueGray-700/50 hover:border-lightBlue-500/50 transition-all"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium bg-lightBlue-500/20 text-lightBlue-300 hover:bg-lightBlue-500/30 rounded-lg border border-lightBlue-500/30 hover:border-lightBlue-500/50 transition-all"
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