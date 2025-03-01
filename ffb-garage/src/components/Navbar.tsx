'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/images/ffb-garage-logo-no-name.png"
                alt="FFB Garage Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                FFB Garage
              </span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/submit" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Submit Settings
              </Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-300">{user}</span>
                  <button
                    onClick={logout}
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