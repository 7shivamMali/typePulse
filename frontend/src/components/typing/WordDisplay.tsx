import React, { memo } from 'react';
import type { WordState } from '../../types/typing';

interface WordDisplayProps {
  wordState: WordState;
  isActive: boolean;
  wordRef?: (el: HTMLSpanElement | null) => void;
  activeLetterRef?: (el: HTMLSpanElement | null) => void;
  currentInputLength: number;
}

export const WordDisplay: React.FC<WordDisplayProps> = memo(({
  wordState,
  isActive,
  wordRef,
  activeLetterRef,
  currentInputLength,
}) => {
  return (
    <span
      ref={wordRef}
      className={`relative inline-flex items-center my-[3px] mr-[1px] text-[1.65rem] leading-[2.6rem] font-mono select-none transition-colors duration-150 ${
        wordState.hasError && wordState.isComplete ? 'border-b-2 border-error/50' : ''
      }`}
    >
      {wordState.letters.map((letter, idx) => {
        const isCurrentLetter = isActive && idx === currentInputLength;

        let colorClass = 'text-text-sub';
        if (letter.status === 'correct') {
          colorClass = 'text-text';
        } else if (letter.status === 'incorrect') {
          colorClass = 'text-error bg-error/15 rounded-sm';
        } else if (letter.status === 'extra') {
          colorClass = 'text-error-sub underline';
        }

        return (
          <span
            key={idx}
            ref={isCurrentLetter ? activeLetterRef : undefined}
            className={`relative tracking-wide ${colorClass}`}
          >
            {letter.char}
          </span>
        );
      })}

      {/* Trailing space anchor for rock-solid cursor alignment after last letter */}
      <span
        ref={isActive && currentInputLength >= wordState.letters.length ? activeLetterRef : undefined}
        className="relative tracking-wide text-transparent select-none inline-block"
      >
        &nbsp;
      </span>
    </span>
  );
});

WordDisplay.displayName = 'WordDisplay';
