import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  TestMode,
  TestDuration,
  WordCount,
  LetterState,
  WordState,
  TestStats,
  KeystrokeTelemetry,
  ChartDataPoint,
} from '../types/typing';

interface UseTypingEngineProps {
  initialWords: string[];
  mode: TestMode;
  duration: TestDuration;
  wordCount: WordCount;
  isStrict: boolean;
  onKeyStroke?: (key: string, isError: boolean) => void;
  onFinish?: (stats: TestStats) => void;
}

export function useTypingEngine({
  initialWords,
  mode,
  duration,
  wordCount,
  isStrict,
  onKeyStroke,
  onFinish,
}: UseTypingEngineProps) {
  const [words, setWords] = useState<string[]>(initialWords);
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(mode === 'time' ? duration : 0);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);

  // Synchronous refs to avoid stale state closures
  const wordStatesRef = useRef<WordState[]>([]);
  const currentWordIndexRef = useRef(0);
  const currentInputRef = useRef('');
  const isFinishedRef = useRef(false);
  const isStartedRef = useRef(false);

  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const lastSecondRecordedRef = useRef(0);
  const chartPointsRef = useRef<ChartDataPoint[]>([]);
  const keystrokesRef = useRef<KeystrokeTelemetry[]>([]);
  const totalKeystrokesCountRef = useRef(0);

  // Helper to accurately compute character counts from word states
  const computeCharacterCounts = useCallback((states: WordState[], activeIdx: number) => {
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    let missed = 0;

    states.forEach((ws, idx) => {
      if (idx < activeIdx || (idx === activeIdx && ws.isComplete)) {
        ws.letters.forEach((l) => {
          if (l.status === 'correct') correct++;
          else if (l.status === 'incorrect') incorrect++;
          else if (l.status === 'extra') extra++;
          else if (l.status === 'untyped') missed++;
        });
      } else if (idx === activeIdx) {
        ws.letters.forEach((l) => {
          if (l.status === 'correct') correct++;
          else if (l.status === 'incorrect') incorrect++;
          else if (l.status === 'extra') extra++;
          else missed++;
        });
      }
    });

    return { correct, incorrect, extra, missed };
  }, []);

  // Initialize word states when words change or test resets
  const resetTest = useCallback(
    (newWords?: string[]) => {
      const activeWords = newWords || words;
      const initialStates: WordState[] = activeWords.map((w) => ({
        original: w,
        typed: '',
        isComplete: false,
        hasError: false,
        letters: w.split('').map((char) => ({ char, status: 'untyped' as const })),
      }));

      if (newWords) setWords(newWords);
      wordStatesRef.current = initialStates;
      setWordStates(initialStates);

      currentWordIndexRef.current = 0;
      setCurrentWordIndex(0);
      currentInputRef.current = '';
      setCurrentInput('');

      isStartedRef.current = false;
      setIsStarted(false);
      isFinishedRef.current = false;
      setIsFinished(false);

      setTimeLeft(mode === 'time' ? duration : 0);
      setLiveWpm(0);
      setLiveAccuracy(100);

      startTimeRef.current = null;
      lastSecondRecordedRef.current = 0;
      chartPointsRef.current = [];
      keystrokesRef.current = [];
      totalKeystrokesCountRef.current = 0;

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    },
    [words, mode, duration]
  );

  useEffect(() => {
    resetTest(initialWords);
  }, [initialWords]);

  useEffect(() => {
    setTimeLeft(mode === 'time' ? duration : 0);
  }, [mode, duration]);

  // Complete test function
  const finishTest = useCallback(
    (overrideStates?: WordState[], overrideIndex?: number) => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      setIsFinished(true);

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      const endTime = performance.now();
      const startTime = startTimeRef.current || endTime;
      const elapsedSeconds = Math.max((endTime - startTime) / 1000, 0.5);

      const activeStates = overrideStates || wordStatesRef.current;
      const activeIdx = overrideIndex !== undefined ? overrideIndex : currentWordIndexRef.current;
      const { correct, incorrect, extra, missed } = computeCharacterCounts(activeStates, activeIdx);

      const netWpm = Math.max(0, Math.round((correct / 5) / (elapsedSeconds / 60)));
      const rawWpm = Math.max(0, Math.round(((correct + incorrect + extra) / 5) / (elapsedSeconds / 60)));
      const totalAttempted = correct + incorrect + extra;
      const acc = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 1000) / 10 : 100;

      // Calculate Consistency %
      const chart = chartPointsRef.current;
      let consistency = 85;
      if (chart.length >= 3) {
        const wpms = chart.map((c) => c.wpm);
        const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        if (mean > 0) {
          const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
          const stdDev = Math.sqrt(variance);
          const cv = (stdDev / mean) * 100;
          consistency = Math.max(10, Math.min(100, Math.round(100 - cv)));
        }
      }

      const stats: TestStats = {
        wpm: netWpm,
        rawWpm,
        accuracy: acc,
        consistency,
        correctChars: correct,
        incorrectChars: incorrect,
        extraChars: extra,
        missedChars: missed,
        totalChars: correct + incorrect + extra + missed,
        timeElapsed: Math.round(elapsedSeconds * 10) / 10,
        chartData: chart,
        keystrokes: keystrokesRef.current,
        mode: mode === 'time' ? `time ${duration}` : mode === 'words' ? `words ${wordCount}` : mode,
      };

      if (onFinish) {
        onFinish(stats);
      }
    },
    [computeCharacterCounts, mode, duration, wordCount, onFinish]
  );

  // High-precision second-by-second tracker interval (checks every 250ms for smooth clock & chart)
  useEffect(() => {
    if (!isStarted || isFinished) return;

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current || isFinishedRef.current) return;

      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const wholeSecond = Math.floor(elapsed);

      // Compute live stats accurately from wordStatesRef without drift
      const { correct, incorrect, extra } = computeCharacterCounts(
        wordStatesRef.current,
        currentWordIndexRef.current
      );
      const totalAttempted = correct + incorrect + extra;
      const curWpm = elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
      const curAcc = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 100;

      setLiveWpm(curWpm);
      setLiveAccuracy(curAcc);

      // Record chart data point once every whole second
      if (wholeSecond > lastSecondRecordedRef.current && wholeSecond > 0) {
        lastSecondRecordedRef.current = wholeSecond;
        chartPointsRef.current.push({
          second: wholeSecond,
          wpm: curWpm,
          raw: Math.round(((totalAttempted) / 5) / (elapsed / 60)),
          errors: incorrect + extra,
        });
      }

      // Check timer expiration
      if (mode === 'time') {
        const remaining = Math.max(0, Math.ceil(duration - elapsed));
        setTimeLeft(remaining);

        if (elapsed >= duration) {
          finishTest();
        }
      } else {
        setTimeLeft(wholeSecond);
      }
    }, 250);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isStarted, isFinished, mode, duration, computeCharacterCounts, finishTest]);

  // Handle keystroke input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isFinishedRef.current) return;

      // Caps Lock detection
      setCapsLockActive(e.getModifierState('CapsLock'));

      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        return;
      }

      const now = performance.now();

      // Start timer on first valid keypress
      if (!isStartedRef.current) {
        isStartedRef.current = true;
        setIsStarted(true);
        startTimeRef.current = now;
      }

      const wordIdx = currentWordIndexRef.current;
      const currentWord = words[wordIdx];
      if (!currentWord) return;

      const inputVal = currentInputRef.current;

      // 1. Backspace handling
      if (e.key === 'Backspace') {
        e.preventDefault();

        // Ctrl + Backspace: Delete entire current word input or jump to previous word
        if (e.ctrlKey) {
          if (inputVal.length > 0) {
            currentInputRef.current = '';
            setCurrentInput('');
            const next = [...wordStatesRef.current];
            const ws = next[wordIdx];
            if (ws) {
              ws.typed = '';
              ws.letters = ws.original.split('').map((char) => ({ char, status: 'untyped' }));
              ws.hasError = false;
            }
            wordStatesRef.current = next;
            setWordStates(next);
            onKeyStroke?.('Backspace', false);
          } else if (wordIdx > 0) {
            // Jump back to previous word and clear it
            const prevIdx = wordIdx - 1;
            currentWordIndexRef.current = prevIdx;
            setCurrentWordIndex(prevIdx);
            currentInputRef.current = '';
            setCurrentInput('');
            const next = [...wordStatesRef.current];
            const prevWs = next[prevIdx];
            if (prevWs) {
              prevWs.typed = '';
              prevWs.isComplete = false;
              prevWs.letters = prevWs.original.split('').map((char) => ({ char, status: 'untyped' }));
              prevWs.hasError = false;
            }
            wordStatesRef.current = next;
            setWordStates(next);
            onKeyStroke?.('Backspace', false);
          }
          return;
        }

        // Single Backspace
        if (inputVal.length > 0) {
          const newInput = inputVal.slice(0, -1);
          currentInputRef.current = newInput;
          setCurrentInput(newInput);

          const next = [...wordStatesRef.current];
          const ws = next[wordIdx];
          if (ws) {
            ws.typed = newInput;
            const originalChars = ws.original.split('');
            const newLetters: LetterState[] = [];

            for (let i = 0; i < Math.max(originalChars.length, newInput.length); i++) {
              if (i < newInput.length && i < originalChars.length) {
                newLetters.push({
                  char: originalChars[i],
                  status: newInput[i] === originalChars[i] ? 'correct' : 'incorrect',
                });
              } else if (i < originalChars.length) {
                newLetters.push({ char: originalChars[i], status: 'untyped' });
              } else {
                newLetters.push({ char: newInput[i], status: 'extra' });
              }
            }
            ws.letters = newLetters;
            ws.hasError = newLetters.some((l) => l.status === 'incorrect' || l.status === 'extra');
          }
          wordStatesRef.current = next;
          setWordStates(next);
          onKeyStroke?.('Backspace', false);
        } else if (wordIdx > 0) {
          // Jump back to previous word if it had an error
          const prevIdx = wordIdx - 1;
          const prevWs = wordStatesRef.current[prevIdx];
          if (prevWs && prevWs.hasError) {
            currentWordIndexRef.current = prevIdx;
            setCurrentWordIndex(prevIdx);
            currentInputRef.current = prevWs.typed;
            setCurrentInput(prevWs.typed);
            prevWs.isComplete = false;
            onKeyStroke?.('Backspace', false);
          }
        }
        return;
      }

      // 2. Spacebar handling: word advancement
      if (e.key === ' ') {
        e.preventDefault();
        if (inputVal.length === 0) return; // Ignore leading spaces

        const isLastWord = wordIdx === words.length - 1;

        // Finalize current word state
        const next = [...wordStatesRef.current];
        const ws = next[wordIdx];
        if (ws) {
          ws.isComplete = true;
          const originalChars = ws.original.split('');
          const letters: LetterState[] = [];

          for (let i = 0; i < Math.max(originalChars.length, inputVal.length); i++) {
            if (i < inputVal.length && i < originalChars.length) {
              letters.push({
                char: originalChars[i],
                status: inputVal[i] === originalChars[i] ? 'correct' : 'incorrect',
              });
            } else if (i < originalChars.length) {
              // User pressed space early, remaining chars are missed/incorrect
              letters.push({ char: originalChars[i], status: 'incorrect' });
            } else {
              letters.push({ char: inputVal[i], status: 'extra' });
            }
          }
          ws.letters = letters;
          ws.hasError = letters.some((l) => l.status === 'incorrect' || l.status === 'extra');
        }
        wordStatesRef.current = next;
        setWordStates(next);

        // Telemetry log for space
        const elapsedMs = Math.round(now - (startTimeRef.current || now));
        totalKeystrokesCountRef.current += 1;
        keystrokesRef.current.push({
          key: ' ',
          time: elapsedMs,
          charIndex: totalKeystrokesCountRef.current,
          isCorrect: true,
        });

        onKeyStroke?.(' ', false);

        if (isLastWord) {
          finishTest(next, wordIdx);
        } else {
          const nextIdx = wordIdx + 1;
          currentWordIndexRef.current = nextIdx;
          setCurrentWordIndex(nextIdx);
          currentInputRef.current = '';
          setCurrentInput('');
        }
        return;
      }

      // 3. Regular printable character
      if (e.key.length === 1) {
        e.preventDefault();
        const charTyped = e.key;
        const targetChar = currentWord[inputVal.length];
        const isMatch = targetChar === charTyped;

        // Master / Sudden Death check: ends test immediately on typo
        if (isStrict && !isMatch) {
          onKeyStroke?.(charTyped, true);
          finishTest();
          return;
        }

        totalKeystrokesCountRef.current += 1;
        const newInput = inputVal + charTyped;
        currentInputRef.current = newInput;
        setCurrentInput(newInput);

        // Update word states synchronously in ref and React state
        const next = [...wordStatesRef.current];
        const ws = next[wordIdx];
        if (ws) {
          ws.typed = newInput;
          const originalChars = ws.original.split('');
          const newLetters: LetterState[] = [];

          for (let i = 0; i < Math.max(originalChars.length, newInput.length); i++) {
            if (i < newInput.length && i < originalChars.length) {
              newLetters.push({
                char: originalChars[i],
                status: newInput[i] === originalChars[i] ? 'correct' : 'incorrect',
              });
            } else if (i < originalChars.length) {
              newLetters.push({ char: originalChars[i], status: 'untyped' });
            } else {
              newLetters.push({ char: newInput[i], status: 'extra' });
            }
          }
          ws.letters = newLetters;
          ws.hasError = newLetters.some((l) => l.status === 'incorrect' || l.status === 'extra');
        }
        wordStatesRef.current = next;
        setWordStates(next);

        // Record keystroke telemetry
        const elapsedMs = Math.round(now - (startTimeRef.current || now));
        keystrokesRef.current.push({
          key: charTyped,
          time: elapsedMs,
          charIndex: totalKeystrokesCountRef.current,
          isCorrect: isMatch,
        });

        onKeyStroke?.(charTyped, !isMatch);

        // Auto-advance if this was the last word and user completed it
        if (wordIdx === words.length - 1 && newInput.length >= currentWord.length) {
          if (ws) ws.isComplete = true;
          finishTest(next, wordIdx);
        }
      }
    },
    [words, isStrict, onKeyStroke, finishTest]
  );

  return {
    words,
    wordStates,
    currentWordIndex,
    currentInput,
    isStarted,
    isFinished,
    timeLeft,
    capsLockActive,
    liveWpm,
    liveAccuracy,
    handleKeyDown,
    resetTest,
    finishTest,
  };
}
