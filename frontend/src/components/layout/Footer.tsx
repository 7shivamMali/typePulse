import React from 'react';
import { Terminal } from 'lucide-react';

interface FooterProps {
  isZen: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isZen }) => {
  return (
    <footer
      className={`w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between py-6 px-4 font-mono text-xs text-text-sub transition-opacity duration-300 ${
        isZen ? 'opacity-20' : 'opacity-75'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-text-sub/20">tab</kbd>
          <span>restart test</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-text-sub/20">ctrl + backspace</kbd>
          <span>delete word</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <span className="flex items-center gap-1 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-main" />
          <span>Python 3.12 + FastAPI + React</span>
        </span>
      </div>
    </footer>
  );
};
