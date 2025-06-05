'use client';

import Header from '@/components/Header';
import { useAuthStore } from '@/features/auth/auth';
import { redirect } from 'next/navigation';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuthStore();

  // If user is not authenticated, redirect to home page
  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}
