'use client';

import { useEffect, useState } from 'react';

type Props = {
  startTime: string | Date;
  size?: 'sm' | 'default';
};

export default function FocusTimer({ startTime, size = 'default' }: Props) {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const start = new Date(startTime).getTime();

    const update = () => {
      const now = Date.now();
      const diff = now - start;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(
        `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center space-x-3">
      <span className={`${size === 'sm' ? 'text-base' : 'text-xl'} font-mono tracking-wide text-primary`}>
        {elapsed}
      </span>
      <span className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-lime-500 animate-ping`} />
    </div>
  );
}
