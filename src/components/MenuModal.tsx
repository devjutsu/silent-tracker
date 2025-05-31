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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="card shadow-2xl rounded-box w-full max-w-xs p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2 p-2 hover:bg-base-100 hover:text-primary"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/dashboard" onClick={onClose}
            className="btn btn-lg btn-neutral flex gap-3 px-3 py-2 rounded-lg transition hover:bg-base-100 text-primary text-base font-medium cursor-pointer w-full">
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Main</span>
          </Link>
          <Link href="/profile" onClick={onClose}
            className="btn btn-lg btn-neutral flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-100 text-info text-base font-medium cursor-pointer w-full">
            <User className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Profile</span>
          </Link>
          <Link href="/settings" onClick={onClose}
            className="btn btn-lg btn-neutral flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-100 text-secondary text-base font-medium cursor-pointer w-full">
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Settings</span>
          </Link>
          <button
            className="btn btn-lg btn-neutral flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-100 text-error text-base font-medium cursor-pointer w-full"
            onClick={() => { onClose(); onSignOut(); }}
            type="button"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Sign Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
} 