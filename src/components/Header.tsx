'use client';

import { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <div className="navbar bg-base-100 shadow-lg px-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold">Silent Tracker</h1>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img 
                alt="User avatar" 
                src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} 
              />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a onClick={onSignOut}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 