'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import MenuModal from './MenuModal';
import { useState } from 'react';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="navbar bg-base-100 shadow-lg px-4">
      <div className="flex-1">
        <Link href="/dashboard" className="btn btn-ghost text-xl">
          Silent Tracker
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
    </div>
  );
} 