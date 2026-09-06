import React, { useEffect } from 'react';
import type { Theme } from '../../types/typing';
import { Palette } from 'lucide-react';

interface ThemeSwitchProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ theme, setTheme }) => {
  const themes: { id: Theme; name: string }[] = [
    { id: 'carbon', name: 'cyber' },
    { id: 'matrix', name: 'matrix' },
    { id: 'amber', name: 'amber' },
    { id: 'synthwave', name: 'synth' },
    { id: 'nordic', name: 'nordic' },
  ];

  useEffect(() => {
    if (theme === 'carbon') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('tp_theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-text-sub">
      <Palette className="w-3.5 h-3.5 text-main" />
      <div className="flex items-center gap-1 bg-bg px-2 py-1 rounded-xl border border-text-sub/15 shadow-inner">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`px-2 py-0.5 rounded-lg capitalize transition-all ${
              theme === t.id
                ? 'bg-main text-bg font-bold shadow-[0_0_8px_var(--color-main)]'
                : 'hover:text-text'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
};
