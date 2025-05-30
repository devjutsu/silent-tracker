'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <div className="navbar bg-base-100 shadow-lg px-4">
      <div className="flex-1">
        <Link href="/dashboard" className="btn btn-ghost text-xl">
          Silent Tracker
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
              />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <Link href="/settings" className="justify-between">
                Settings
                <span className="badge">New</span>
              </Link>
            </li>
            <li><a onClick={onSignOut}>Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 