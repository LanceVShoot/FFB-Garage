'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from './LoginModal';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out!', {
      position: 'bottom-right'
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-gray-800/30 border-b border-gray-700/50">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-white">
              FFB Garage
            </Link>

            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              {user && (
                <Link 
                  href="/submit" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Submit Settings
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-300">{user}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </button>
              )}
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                    />
                  </svg>
                )}
              </button>
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