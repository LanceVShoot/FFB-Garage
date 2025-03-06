'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-sm bg-gray-800/30 border-b border-gray-700/50">
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          FFB Garage
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/submit" className="text-gray-300 hover:text-white transition-colors">
                Submit Settings
              </Link>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
} 