'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import MenuModal from './MenuModal';
import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="navbar top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo-192x192.png"
            alt="Silent Tracker Logo"
            width={64}
            height={64}
            className="rounded-md"
            priority
          />
          <span className="font-bold">Silent Tracker</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <button
          className="btn btn-ghost btn-circle avatar"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <div className="w-10 rounded-full">
            <img
              alt="User avatar"
              src={user?.email 
                ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
                : 'https://api.dicebear.com/7.x/initials/svg?seed=anonymous'
              }
            />
          </div>
        </button>
        <MenuModal
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSignOut={onSignOut}
        />
      </div>
    </header>
  );
} 