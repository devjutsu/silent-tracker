import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from './ThemeProvider';
import MenuModalWrapper from '@/components/layout/MenuModalWrapper';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Silent Tracker',
  description: 'Own your focus and productivity',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Silent Tracker',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          <MenuModalWrapper />
          {/* <Modal /> */}
          {children}
          {/* <AlertDialog /> */}
          {/* <ConfirmDialog /> */}
          {/* <PromptDialog /> */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'var(--color-base-200)',
                color: 'var(--color-base-content)',
              },
              success: {
                style: {
                  background: 'var(--color-success)',
                  color: 'var(--color-success-content)',
                },
                iconTheme: {
                  primary: 'var(--color-success-content)',
                  secondary: 'var(--color-success)',
                },
              },
              error: {
                style: {
                  background: 'var(--color-error)',
                  color: 'var(--color-error-content)',
                },
                iconTheme: {
                  primary: 'var(--color-error-content)',
                  secondary: 'var(--color-error)',
                },
              },
              loading: {
                style: {
                  background: 'var(--color-info)',
                  color: 'var(--color-info-content)',
                },
                iconTheme: {
                  primary: 'var(--color-info-content)',
                  secondary: 'var(--color-info)',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
