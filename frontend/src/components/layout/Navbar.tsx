import React from 'react';
import { Terminal, Sliders } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  isZen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  isZen,
}) => {
  return (
    <header
      className={`w-full max-w-5xl mx-auto flex items-center justify-between py-5 px-4 font-mono transition-opacity duration-300 ${
        isZen ? 'opacity-20' : 'opacity-100'
      }`}
    >
      {/* Clean Brand Logo */}
      <div className="flex items-center gap-3 select-none cursor-pointer">
        <div className="p-2.5 rounded-xl bg-main/15 text-main border border-main/30 shadow-[0_0_15px_var(--color-main-glow)]">
          <Terminal className="w-5 h-5 text-main" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-text">TypePulse</span>
        </div>
      </div>

      {/* Right Controls: Studio Settings */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono border border-text-sub/20 bg-bg/80 text-text-sub hover:text-text hover:border-main/50 hover:bg-main/10 hover:shadow-[0_0_12px_var(--color-main-glow)] transition-all"
          title="Open Studio Settings (Themes, Audio, Cockpit Display)"
        >
          <Sliders className="w-3.5 h-3.5 text-main" />
          <span className="font-semibold">settings</span>
        </button>
      </div>
    </header>
  );
};
