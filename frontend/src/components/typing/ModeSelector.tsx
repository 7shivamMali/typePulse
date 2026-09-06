import React from 'react';
import type { TestMode, TestDuration, WordCount, CodeLanguage } from '../../types/typing';
import { Clock, Type, Quote, Code, Target, AtSign, Hash, ShieldAlert } from 'lucide-react';

interface ModeSelectorProps {
  mode: TestMode;
  setMode: (mode: TestMode) => void;
  duration: TestDuration;
  setDuration: (duration: TestDuration) => void;
  wordCount: WordCount;
  setWordCount: (count: WordCount) => void;
  codeLanguage: CodeLanguage;
  setCodeLanguage: (lang: CodeLanguage) => void;
  hasPunctuation: boolean;
  setHasPunctuation: (val: boolean) => void;
  hasNumbers: boolean;
  setHasNumbers: (val: boolean) => void;
  isStrict: boolean;
  setIsStrict: (val: boolean) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  setMode,
  duration,
  setDuration,
  wordCount,
  setWordCount,
  codeLanguage,
  setCodeLanguage,
  hasPunctuation,
  setHasPunctuation,
  hasNumbers,
  setHasNumbers,
  isStrict,
  setIsStrict,
  disabled,
}) => {
  return (
    <div
      className={`w-full max-w-4xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-2 p-2 rounded-2xl bg-bg-surface/75 border border-text-sub/20 backdrop-blur-xl shadow-lg font-mono text-xs text-text-sub transition-opacity duration-300 ${
        disabled ? 'opacity-20 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Primary Mode Switcher Deck */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-bg border border-text-sub/15">
        <button
          onClick={() => setMode('time')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
            mode === 'time'
              ? 'bg-main text-bg font-bold shadow-[0_0_10px_var(--color-main)]'
              : 'hover:text-text hover:bg-bg-surface'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>time</span>
        </button>

        <button
          onClick={() => setMode('words')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
            mode === 'words'
              ? 'bg-main text-bg font-bold shadow-[0_0_10px_var(--color-main)]'
              : 'hover:text-text hover:bg-bg-surface'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>words</span>
        </button>

        <button
          onClick={() => setMode('quote')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
            mode === 'quote'
              ? 'bg-main text-bg font-bold shadow-[0_0_10px_var(--color-main)]'
              : 'hover:text-text hover:bg-bg-surface'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>quote</span>
        </button>

        <button
          onClick={() => setMode('code')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
            mode === 'code'
              ? 'bg-main text-bg font-bold shadow-[0_0_10px_var(--color-main)]'
              : 'hover:text-text hover:bg-bg-surface'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>code</span>
        </button>

        <button
          onClick={() => setMode('drill')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
            mode === 'drill'
              ? 'bg-main text-bg font-bold shadow-[0_0_10px_var(--color-main)]'
              : 'hover:text-text hover:bg-bg-surface'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>drill</span>
        </button>
      </div>

      {/* Middle: Mode Parameters (15s, 30s, or language) */}
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-bg border border-text-sub/15 text-xs">
        {mode === 'time' &&
          ([15, 30, 60, 120] as TestDuration[]).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-2 py-0.5 rounded-md transition-all ${
                duration === d
                  ? 'bg-main/20 text-main font-bold border border-main/30'
                  : 'hover:text-text'
              }`}
            >
              {d}s
            </button>
          ))}

        {mode === 'words' &&
          ([10, 25, 50, 100] as WordCount[]).map((c) => (
            <button
              key={c}
              onClick={() => setWordCount(c)}
              className={`px-2 py-0.5 rounded-md transition-all ${
                wordCount === c
                  ? 'bg-main/20 text-main font-bold border border-main/30'
                  : 'hover:text-text'
              }`}
            >
              {c}
            </button>
          ))}

        {mode === 'code' &&
          (['python', 'javascript', 'sql'] as CodeLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setCodeLanguage(lang)}
              className={`px-2 py-0.5 rounded-md capitalize transition-all ${
                codeLanguage === lang
                  ? 'bg-main/20 text-main font-bold border border-main/30'
                  : 'hover:text-text'
              }`}
            >
              {lang}
            </button>
          ))}

        {mode === 'quote' && (
          <span className="text-[11px] text-text-sub px-2">Tech Quotes</span>
        )}

        {mode === 'drill' && (
          <span className="text-[11px] text-main font-medium px-2">AI Drill Buffer</span>
        )}
      </div>

      {/* Modifiers (Punctuation, Numbers, Strict) */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-bg border border-text-sub/15">
        {mode !== 'code' && (
          <>
            <button
              onClick={() => setHasPunctuation(!hasPunctuation)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                hasPunctuation
                  ? 'bg-main/20 text-main font-semibold border border-main/30'
                  : 'hover:text-text'
              }`}
              title="Toggle Punctuation"
            >
              <AtSign className="w-3 h-3" />
              <span>punct</span>
            </button>

            <button
              onClick={() => setHasNumbers(!hasNumbers)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                hasNumbers
                  ? 'bg-main/20 text-main font-semibold border border-main/30'
                  : 'hover:text-text'
              }`}
              title="Toggle Numbers"
            >
              <Hash className="w-3 h-3" />
              <span>nums</span>
            </button>
          </>
        )}

        <button
          onClick={() => setIsStrict(!isStrict)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
            isStrict
              ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              : 'hover:text-text'
          }`}
          title="Master Mode: 0 errors allowed"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>strict</span>
        </button>
      </div>
    </div>
  );
};
