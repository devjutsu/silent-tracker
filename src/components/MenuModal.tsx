import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, User, Settings, LogOut } from 'lucide-react';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export default function MenuModal({ isOpen, onClose, onSignOut }: MenuModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="card bg-base-100 shadow-2xl rounded-box w-full max-w-xs p-6 relative animate-fade-in">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
        <nav className="flex flex-col gap-2 mt-4">
          <Link href="/dashboard" onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-200 text-primary text-base font-medium cursor-pointer">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/profile" onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-200 text-info text-base font-medium cursor-pointer">
            <User className="w-5 h-5" />
            Profile
          </Link>
          <Link href="/settings" onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-200 text-secondary text-base font-medium cursor-pointer">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-200 text-warning text-base font-medium cursor-pointer mt-2"
            onClick={() => { onClose(); onSignOut(); }}
            type="button"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </nav>
      </div>
    </div>
  );
} 