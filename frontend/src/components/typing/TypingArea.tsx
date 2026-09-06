import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { WordState, CaretStyle } from '../../types/typing';
import { WordDisplay } from './WordDisplay';
import { RotateCcw, AlertTriangle, Terminal, Sparkles } from 'lucide-react';

interface TypingAreaProps {
  wordStates: WordState[];
  currentWordIndex: number;
  currentInput: string;
  isStarted: boolean;
  isFinished: boolean;
  capsLockActive: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRestart: () => void;
  caretStyle?: CaretStyle;
  modeLabel?: string;
  minimalTimer?: number;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  wordStates,
  currentWordIndex,
  currentInput,
  isStarted,
  isFinished,
  capsLockActive,
  onKeyDown,
  onRestart,
  caretStyle = 'line',
  modeLabel = 'session.py',
  minimalTimer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeLetterRef = useRef<HTMLSpanElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  const [isFocused, setIsFocused] = useState(true);
  const [caretPos, setCaretPos] = useState<{ left: number; top: number; height: number }>({
    left: 0,
    top: 0,
    height: 32,
  });
  const [scrollOffsetY, setScrollOffsetY] = useState(0);
  const [activeLineNumber, setActiveLineNumber] = useState(1);

  // Auto-focus input on mount and clicks
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  useEffect(() => {
    focusInput();
    const handleGlobalClick = () => focusInput();
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [focusInput]);

  // Update Caret position and 3-line viewport scroll offset
  useEffect(() => {
    if (!wordsWrapperRef.current || !containerRef.current) return;

    const wrapperRect = wordsWrapperRef.current.getBoundingClientRect();

    if (activeLetterRef.current) {
      const letterRect = activeLetterRef.current.getBoundingClientRect();
      const left = letterRect.left - wrapperRect.left;
      const top = letterRect.top - wrapperRect.top;
      setCaretPos({
        left,
        top,
        height: letterRect.height || 34,
      });

      // Line calculation
      const lineHeight = 46;
      const currentLine = Math.floor(top / lineHeight) + 1;
      setActiveLineNumber(currentLine);

      if (top > lineHeight * 1.5) {
        const offset = Math.floor(top / lineHeight - 1) * lineHeight;
        setScrollOffsetY(offset);
      } else {
        setScrollOffsetY(0);
      }
    } else if (activeWordRef.current) {
      const wordRect = activeWordRef.current.getBoundingClientRect();
      const left = wordRect.left - wrapperRect.left;
      const top = wordRect.top - wrapperRect.top;
      setCaretPos({
        left,
        top,
        height: wordRect.height || 34,
      });
    }
  }, [currentWordIndex, currentInput, wordStates]);

  // Shortcut handler for Tab + Enter
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [onRestart]);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-3 select-none">
      {/* Hidden high-compatibility input field */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={() => {}} // Controlled strictly by onKeyDown
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        disabled={isFinished}
      />

      {/* Main IDE Studio Window Frame */}
      <div className="relative rounded-2xl bg-bg-surface/90 border border-text-sub/20 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300">
        {/* Window Chrome Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-bg/80 border-b border-text-sub/15 text-xs font-mono">
          {/* macOS / Terminal window action dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <div className="flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-md bg-bg-surface border border-text-sub/15 text-[11px] text-text-sub">
              <Terminal className="w-3 h-3 text-main" />
              <span className="text-text font-medium">{modeLabel}</span>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-4 text-[11px] text-text-sub">
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-main animate-pulse" />
              <span>UTF-8 // LF</span>
            </span>
            {minimalTimer !== undefined && (
              <span className="px-2 py-0.5 rounded bg-main/15 border border-main/30 font-bold text-main shadow-[0_0_8px_var(--color-main-glow)]">
                {minimalTimer}s
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-bg-surface border border-text-sub/15 font-semibold text-main">
              Ln {activeLineNumber}, Col {currentInput.length + 1}
            </span>
          </div>
        </div>

        {/* Focus Lost Overlay */}
        {!isFocused && !isFinished && (
          <div
            onClick={focusInput}
            className="absolute inset-0 z-30 flex items-center justify-center bg-bg/75 backdrop-blur-sm cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2.5 text-main font-mono text-xs px-5 py-2.5 rounded-xl bg-bg-surface border border-main/40 shadow-[0_0_25px_var(--color-main-glow)]">
              <Sparkles className="w-4 h-4 text-main animate-spin" />
              <span className="font-semibold">Click or press any key to regain terminal focus</span>
            </div>
          </div>
        )}

        {/* Content Area with Gutter & Words */}
        <div className="flex p-4 min-h-[175px]">
          {/* Left IDE Line Numbers Gutter */}
          <div className="flex flex-col select-none pr-4 mr-2 border-r border-text-sub/15 font-mono text-sm leading-[2.6rem] text-text-sub/40 text-right min-w-[36px]">
            {[1, 2, 3].map((num) => {
              const displayLine = num + Math.max(0, activeLineNumber - 2);
              const isActive = displayLine === activeLineNumber;
              return (
                <div
                  key={num}
                  className={`flex items-center justify-end gap-1.5 transition-colors ${
                    isActive ? 'text-main font-bold' : ''
                  }`}
                >
                  {isActive && <span className="text-[10px] text-main">▶</span>}
                  <span>{String(displayLine).padStart(2, '0')}</span>
                </div>
              );
            })}
          </div>

          {/* Words Viewport */}
          <div
            ref={containerRef}
            onClick={focusInput}
            className="relative flex-1 h-[148px] overflow-hidden cursor-text px-2 font-mono"
          >
            <div
              ref={wordsWrapperRef}
              style={{ transform: `translateY(-${scrollOffsetY}px)` }}
              className="relative transition-transform duration-200 ease-out flex flex-wrap"
            >
              {/* Smooth Glowing Caret */}
              {isFocused && !isFinished && (
                <div
                  style={{
                    transform: `translate(${caretPos.left}px, ${caretPos.top}px)`,
                    height: `${caretPos.height || 34}px`,
                  }}
                  className={`absolute top-0 left-0 z-20 transition-transform duration-75 ease-out pointer-events-none ${
                    caretStyle === 'block'
                      ? 'w-[14px] bg-main/30 border border-main rounded-sm shadow-[0_0_10px_var(--color-main)]'
                      : caretStyle === 'underline'
                      ? 'w-[14px] border-b-2 border-main self-end shadow-[0_0_10px_var(--color-main)]'
                      : 'w-[2.5px] bg-main rounded-full shadow-[0_0_12px_var(--color-main)]'
                  } ${isStarted ? '' : 'animate-caret-blink'}`}
                />
              )}

              {/* Word list */}
              {wordStates.map((wordState, idx) => (
                <WordDisplay
                  key={idx}
                  wordState={wordState}
                  isActive={idx === currentWordIndex}
                  wordRef={idx === currentWordIndex ? (el) => (activeWordRef.current = el) : undefined}
                  activeLetterRef={idx === currentWordIndex ? (el) => (activeLetterRef.current = el) : undefined}
                  currentInputLength={currentInput.length}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Console Status / Restart Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-bg/60 border-t border-text-sub/10 text-xs font-mono">
          {capsLockActive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>CAPS LOCK ON</span>
            </div>
          ) : (
            <div className="text-[11px] text-text-sub flex items-center gap-1">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-text-sub/20 text-text">
                Tab
              </kbd>
              <span>to quick restart</span>
            </div>
          )}

          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-text-sub hover:text-main hover:bg-main/10 rounded-lg transition-all font-mono"
            title="Restart Test (Tab)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>restart buffer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
