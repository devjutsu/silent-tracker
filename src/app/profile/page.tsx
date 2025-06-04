'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/auth';
import toast from 'react-hot-toast';
import React from 'react';
import { supabase } from '@/lib/supabase';
import AvatarEditor from '../../features/profile/AvatarEditor';
import ProfileInfoCard from '../../features/profile/ProfileInfoCard';
import ProfileUpdateForm from '../../features/profile/ProfileUpdateForm';

export default function Profile() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    error: authError,
    getUser,
  } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await getUser();
        if (user && user.user_metadata && user.user_metadata.full_name) {
          setDisplayName(user.user_metadata.full_name);
        }
      } catch (error) {
        toast.error(`Failed to load profile: ${error}`);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('User not found');
      return;
    }

    try {
      // Update user metadata (display name)
      if (displayName !== (user.user_metadata?.full_name || '')) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: displayName },
        });
        if (updateError) throw updateError;
      }

      // Update password if provided
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (passwordError) throw passwordError;
        setNewPassword(''); // Clear password field after successful update
      }

      // Refresh user data
      await getUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center pt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      </div>
    );
  }

  if (authError || !user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center pt-8">
        <h2 className="text-3xl font-bold mb-8">Profile</h2>
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          <div className="card bg-base-100 shadow-xl p-6 rounded-box flex flex-col items-center">
            <AvatarEditor email={user.email} />
            <ProfileInfoCard
              name={displayName}
              email={user.email}
              lastSignInAt={user.last_sign_in_at}
            />
          </div>

          {/* Combined Update Card */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            <ProfileUpdateForm
              displayName={displayName}
              newPassword={newPassword}
              onDisplayNameChange={setDisplayName}
              onPasswordChange={setNewPassword}
              onSubmit={handleSaveChanges}
              isDisabled={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
