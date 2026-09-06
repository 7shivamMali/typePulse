import React, { memo } from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  isCompact?: boolean;
}

const KEYBOARD_ROWS = [
  [
    { code: '`', label: '`' },
    { code: '1', label: '1' },
    { code: '2', label: '2' },
    { code: '3', label: '3' },
    { code: '4', label: '4' },
    { code: '5', label: '5' },
    { code: '6', label: '6' },
    { code: '7', label: '7' },
    { code: '8', label: '8' },
    { code: '9', label: '9' },
    { code: '0', label: '0' },
    { code: '-', label: '-' },
    { code: '=', label: '=' },
    { code: 'Backspace', label: '⌫', width: 'w-14' },
  ],
  [
    { code: 'Tab', label: 'Tab', width: 'w-12' },
    { code: 'q', label: 'Q' },
    { code: 'w', label: 'W' },
    { code: 'e', label: 'E' },
    { code: 'r', label: 'R' },
    { code: 't', label: 'T' },
    { code: 'y', label: 'Y' },
    { code: 'u', label: 'U' },
    { code: 'i', label: 'I' },
    { code: 'o', label: 'O' },
    { code: 'p', label: 'P' },
    { code: '[', label: '[' },
    { code: ']', label: ']' },
    { code: '\\', label: '\\', width: 'w-10' },
  ],
  [
    { code: 'CapsLock', label: 'Caps', width: 'w-14' },
    { code: 'a', label: 'A' },
    { code: 's', label: 'S' },
    { code: 'd', label: 'D' },
    { code: 'f', label: 'F' },
    { code: 'g', label: 'G' },
    { code: 'h', label: 'H' },
    { code: 'j', label: 'J' },
    { code: 'k', label: 'K' },
    { code: 'l', label: 'L' },
    { code: ';', label: ';' },
    { code: "'", label: "'" },
    { code: 'Enter', label: 'Enter', width: 'w-16' },
  ],
  [
    { code: 'Shift', label: 'Shift', width: 'w-16' },
    { code: 'z', label: 'Z' },
    { code: 'x', label: 'X' },
    { code: 'c', label: 'C' },
    { code: 'v', label: 'V' },
    { code: 'b', label: 'B' },
    { code: 'n', label: 'N' },
    { code: 'm', label: 'M' },
    { code: ',', label: ',' },
    { code: '.', label: '.' },
    { code: '/', label: '/' },
    { code: 'Shift', label: 'Shift', width: 'w-18' },
  ],
  [
    { code: 'Control', label: 'Ctrl', width: 'w-12' },
    { code: 'Alt', label: 'Alt', width: 'w-10' },
    { code: ' ', label: '━━━━━ SPACE ━━━━━', width: 'flex-1' },
    { code: 'Alt', label: 'Alt', width: 'w-10' },
    { code: 'Control', label: 'Ctrl', width: 'w-12' },
  ],
];

const SHIFT_MAP: Record<string, string> = {
  '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\',
  ':': ';', '"': "'", '<': ',', '>': '.', '?': '/',
  '~': '`',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = memo(({ activeKey }) => {
  const normalizedActiveKey = activeKey ? activeKey.toLowerCase() : null;
  const mappedKey = activeKey && SHIFT_MAP[activeKey] ? SHIFT_MAP[activeKey].toLowerCase() : null;

  return (
    <div className="w-full max-w-3xl mx-auto my-4 p-3 rounded-2xl bg-bg-surface/50 border border-text-sub/15 backdrop-blur-md shadow-lg select-none">
      <div className="flex items-center justify-between pb-2 mb-2 px-1 border-b border-text-sub/10 text-[10px] text-text-sub uppercase tracking-wider font-mono">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-main animate-pulse" />
          Interactive 60% Keystroke Radar
        </span>
        <span>RGB Matrix Active</span>
      </div>

      <div className="space-y-1.5 font-mono text-xs">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 justify-center">
            {row.map((k, keyIdx) => {
              const keyCodeLower = k.code.toLowerCase();
              const isPressed =
                normalizedActiveKey === keyCodeLower ||
                mappedKey === keyCodeLower ||
                (k.code === ' ' && normalizedActiveKey === ' ');

              return (
                <div
                  key={keyIdx}
                  className={`h-9 flex items-center justify-center rounded-lg border transition-all duration-75 text-[11px] font-semibold ${
                    k.width || 'w-9'
                  } ${
                    isPressed
                      ? 'bg-main text-bg border-main scale-95 shadow-[0_0_15px_var(--color-main)] translate-y-[1px]'
                      : 'bg-bg border-text-sub/20 text-text-sub/80 hover:border-text-sub/40'
                  }`}
                >
                  {k.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

VirtualKeyboard.displayName = 'VirtualKeyboard';
