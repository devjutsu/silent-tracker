'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  email?: string;
  onAvatarChange: (dataUrl: string | null) => void;
};

export default function AvatarEditor({ email, onAvatarChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setPreview(result);
        onAvatarChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <img
        src={preview || `https://api.dicebear.com/9.x/glass/svg?seed=${email}`}
        alt="User avatar"
        className="w-24 h-24 rounded-full mb-4 border border-base-300 object-cover"
      />
      <button
        className="btn btn-xs btn-neutral absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        Change
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {preview && (
        <div className="flex gap-2 mt-2 justify-center">
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => toast('Avatar upload coming soon')}
          >
            Save
          </button>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => {
              setPreview(null);
              onAvatarChange(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
