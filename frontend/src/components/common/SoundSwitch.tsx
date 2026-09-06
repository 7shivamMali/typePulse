import React, { useEffect } from 'react';
import type { SoundProfile } from '../../types/typing';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundSwitchProps {
  soundProfile: SoundProfile;
  setSoundProfile: (profile: SoundProfile) => void;
}

export const SoundSwitch: React.FC<SoundSwitchProps> = ({ soundProfile, setSoundProfile }) => {
  const profiles: { id: SoundProfile; name: string }[] = [
    { id: 'off', name: 'off' },
    { id: 'clicky', name: 'click' },
    { id: 'linear', name: 'linear' },
    { id: 'thocky', name: 'thock' },
  ];

  useEffect(() => {
    localStorage.setItem('tp_sound', soundProfile);
  }, [soundProfile]);

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-text-sub">
      {soundProfile === 'off' ? (
        <VolumeX className="w-3.5 h-3.5 opacity-60" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-main" />
      )}
      <div className="flex items-center gap-1 bg-bg-surface px-2 py-1 rounded-lg border border-text-sub/15">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setSoundProfile(p.id)}
            className={`px-1.5 py-0.5 rounded capitalize transition-all ${
              soundProfile === p.id ? 'text-main font-semibold bg-main/10' : 'hover:text-text'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};
