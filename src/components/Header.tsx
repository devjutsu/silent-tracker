'use client';

import Link from 'next/link';
import { useThemeStore } from '@/features/theme/theme';
import { useAuthStore } from '@/features/auth/auth';
import { useModalStore } from '@/features/dialog/modalStore';

export default function Header() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { openModal } = useModalStore();

  /* eslint-disable @next/next/no-img-element */
  return (
    <header className="navbar top-0 z-50 w-full border-b border-neutral p-0 px-8 bg-base-300">
      <div className="container flex max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img
            // src={
            //   theme === LIGHT_THEME
            //     ? '/logo-light-192x192.png'
            //     : '/logo-dark-192x192.png'
            // }
            src='/logo-md.png'
            alt="Silent Tracker Logo"
            width={64}
            height={64}
            className="rounded-md mb-1"
          />
          <span className="font-bold text-secondary">Silent Tracker</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        {user && (
          <button
            className="btn btn-ghost btn-circle avatar"
            onClick={() => openModal('menu', {})}
            aria-label="Open menu"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.email}`}
                className="w-10 h-10 rounded-full"
              />
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
