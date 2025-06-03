'use client';

import Link from 'next/link';
import { useMenuStore } from '@/store/useMenuStore';
import Image from 'next/image';
import { useThemeStore } from '@/store/theme';
import { useAuthStore } from '@/store/auth';

export default function Header() {
  const setIsMenuOpen = useMenuStore((state) => state.setIsMenuOpen);
  const { theme } = useThemeStore();

  const { user } = useAuthStore();
  /* eslint-disable @next/next/no-img-element */
  return (
    <header className="navbar top-0 z-50 w-full border-b border-neutral p-0 bg-base-300">
      <div className="container flex max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={
              theme === 'emerald'
                ? '/logo-light-192x192.png'
                : '/logo-dark-192x192.png'
            }
            alt="Silent Tracker Logo"
            width={64}
            height={64}
            className="rounded-md"
            priority
          />
          <span className="font-bold text-secondary">Silent Tracker</span>
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
              src={
                user?.email
                  ? `https://api.dicebear.com/9.x/glass/svg?seed=${user.email}`
                  : 'https://api.dicebear.com/9.x/glass/svg?seed=anonymous'
              }
              className="w-10 h-10 rounded-full"
            />
          </div>
        </button>
      </div>
    </header>
  );
}
