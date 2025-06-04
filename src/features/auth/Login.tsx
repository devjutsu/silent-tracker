'use client';

import { useState } from 'react';
import { useAuthStore } from '@/features/auth/auth';
import { supabase } from '@/lib/supabase';

type AuthMode = 'sign-in' | 'sign-up' | 'reset';

export default function Login() {
  const { loading, signIn, signUp, resetPassword } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (mode === 'sign-in') {
        await signIn(email, password);
      } else if (mode === 'sign-up') {
        await signUp(email, password);
        setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMessage({ type: 'success', text: 'Check your email for the password reset link!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center mb-4">Silent Tracker</h1>
          
          {/* Mode Tabs */}
          <div className="tabs tabs-boxed justify-center mb-4">
            <button
              className={`tab ${mode === 'sign-in' ? 'tab-active' : ''}`}
              onClick={() => setMode('sign-in')}
            >
              Sign In
            </button>
            <button
              className={`tab ${mode === 'sign-up' ? 'tab-active' : ''}`}
              onClick={() => setMode('sign-up')}
            >
              Sign Up
            </button>
            <button
              className={`tab ${mode === 'reset' ? 'tab-active' : ''}`}
              onClick={() => setMode('reset')}
            >
              Reset Password
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== 'reset' && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full">
              {mode === 'sign-in' ? 'Sign In' : mode === 'sign-up' ? 'Sign Up' : 'Reset Password'}
            </button>
          </form>

          {/* Social Login */}
          {mode === 'sign-in' && (
            <div className="divider">OR</div>
          )}
          
          {mode === 'sign-in' && (
            <div className="flex flex-col gap-2">
              <button
                className="btn btn-outline w-full"
                onClick={() => handleSocialLogin('google')}
              >
                Continue with Google
              </button>
              <button
                className="btn btn-outline w-full"
                onClick={() => handleSocialLogin('facebook')}
              >
                Continue with Facebook
              </button>
              <button
                className="btn btn-outline w-full"
                onClick={() => handleSocialLogin('apple')}
              >
                Continue with Apple
              </button>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mt-4`}>
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 