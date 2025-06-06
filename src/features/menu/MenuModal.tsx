'use client';
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, User, Settings, LogOut, Apple } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/features/auth/auth';
import { useFeatureFlags } from '@/features/settings/featureFlags';
import { useMenuStore } from './useMenuStore';

export default function MenuModal() {
  const { signOut } = useAuthStore();
  const { isKeepFitEnabled } = useFeatureFlags();
  const isOpen = useMenuStore((state) => state.isMenuOpen);
  const setIsMenuOpen = useMenuStore((state) => state.setIsMenuOpen);

  if (!isOpen) return null;

  async function handleSignOut() {
    await signOut();
    setIsMenuOpen(false);
    toast.success('Signed out successfully');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-accent-content/30 backdrop-blur-sm"
      onClick={() => setIsMenuOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-modal-title"
        className="card shadow-2xl rounded-box w-full max-w-xs p-6 relative animate-fade-in bg-base-300/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 p-2 hover:bg-base-100 hover:text-primary"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="btn btn-lg btn-ghost text-primary bg-base-200 flex gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-base-100 hover:shadow-[0_0_8px_theme(colors.primary)] text-base font-medium w-full glow-hover"
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Main</span>
          </Link>

          {isKeepFitEnabled && (
            <Link
              href="/fit"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-lg btn-ghost text-success bg-base-200 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-base-100 hover:shadow-[0_0_8px_theme(colors.success)] text-base font-medium w-full glow-hover"
            >
              <Apple className="w-5 h-5 flex-shrink-0" />
              <span className="text-left">Fit Coach</span>
            </Link>
          )}

          <Link
            href="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="btn btn-lg btn-ghost text-info bg-base-200 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-base-100 hover:shadow-[0_0_8px_theme(colors.info)] text-base font-medium w-full glow-hover"
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Profile</span>
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsMenuOpen(false)}
            className="btn btn-lg btn-ghost text-secondary bg-base-200 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-base-100 hover:shadow-[0_0_8px_theme(colors.secondary)] text-base font-medium w-full glow-hover"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Settings</span>
          </Link>

          <button
            onClick={handleSignOut}
            type="button"
            className="btn btn-lg btn-ghost text-error bg-base-200 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-error/10 hover:shadow-[0_0_8px_theme(colors.error)] text-base font-medium w-full glow-hover"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-left">Sign Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
