export type TestMode = 'time' | 'words' | 'quote' | 'code' | 'drill';
export type TestDuration = 15 | 30 | 60 | 120;
export type WordCount = 10 | 25 | 50 | 100;
export type CodeLanguage = 'python' | 'javascript' | 'sql';
export type SoundProfile =
  | 'off'
  | 'clicky'
  | 'linear'
  | 'thocky'
  | 'creamy'
  | 'typewriter'
  | 'bubble'
  | 'retro-beep';

export type Theme =
  | 'carbon'
  | 'matrix'
  | 'amber'
  | 'synthwave'
  | 'nordic'
  | 'cyberpunk'
  | 'dracula'
  | 'monokai'
  | 'tokyo'
  | 'sepia'
  | 'paper-light'
  | 'solarized-light'
  | 'sakura-light'
  | 'nord-light'
  | 'matcha-light';
export type CaretStyle = 'line' | 'block' | 'underline';

export type LetterStatus = 'untyped' | 'correct' | 'incorrect' | 'extra';

export interface LetterState {
  char: string;
  status: LetterStatus;
}

export interface WordState {
  original: string;
  letters: LetterState[];
  typed: string;
  isComplete: boolean;
  hasError: boolean;
}

export interface KeystrokeTelemetry {
  key: string;
  time: number;
  charIndex: number;
  isCorrect: boolean;
}

export interface ChartDataPoint {
  second: number;
  wpm: number;
  raw: number;
  errors: number;
}

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalChars: number;
  timeElapsed: number;
  chartData: ChartDataPoint[];
  keystrokes: KeystrokeTelemetry[];
  mode: string;
  isPb?: boolean;
}

export interface GhostData {
  hasGhost: boolean;
  wpm?: number;
  accuracy?: number;
  timeline?: { time: number; charIndex: number }[];
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  stats?: {
    total_tests: number;
    best_wpm: number;
    avg_wpm: number;
    avg_accuracy: number;
  };
}
