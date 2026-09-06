import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  TestMode,
  TestDuration,
  WordCount,
  CodeLanguage,
  Theme,
  SoundProfile,
  TestStats,
} from './types/typing';
import {
  fetchWords,
  fetchCodeSnippet,
  fetchDrill,
  submitTestResult,
} from './services/api';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useSoundEffects } from './hooks/useSoundEffects';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ModeSelector } from './components/typing/ModeSelector';
import { CockpitHeader } from './components/cockpit/CockpitHeader';
import { TypingArea } from './components/typing/TypingArea';
import { VirtualKeyboard } from './components/keyboard/VirtualKeyboard';
import { ResultsModal } from './components/results/ResultsModal';
import { SettingsModal } from './components/settings/SettingsModal';

const DEFAULT_WORDS = [
  'function', 'async', 'import', 'system', 'return', 'await', 'stream',
  'interface', 'execute', 'quantum', 'cipher', 'protocol', 'matrix', 'terminal',
  'compile', 'vector', 'packet', 'runtime', 'buffer', 'thread', 'pipeline',
  'kernel', 'socket', 'syntax', 'module', 'deploy', 'render', 'dynamic',
];

export function App() {
  // Theme & Sound settings
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('tp_theme') as Theme) || 'carbon';
  });
  const [soundProfile, setSoundProfile] = useState<SoundProfile>(() => {
    return (localStorage.getItem('tp_sound') as SoundProfile) || 'clicky';
  });

  // Mode settings
  const [mode, setMode] = useState<TestMode>('time');
  const [duration, setDuration] = useState<TestDuration>(30);
  const [wordCount, setWordCount] = useState<WordCount>(25);
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('python');
  const [hasPunctuation, setHasPunctuation] = useState(false);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [isStrict, setIsStrict] = useState(false);

  // Display & Cockpit toggles (persisted in localStorage)
  const [showKeyboard, setShowKeyboard] = useState<boolean>(() => {
    const saved = localStorage.getItem('tp_show_keyboard');
    return saved !== null ? saved === 'true' : true;
  });
  const [showCockpit, setShowCockpit] = useState<boolean>(() => {
    const saved = localStorage.getItem('tp_show_cockpit');
    return saved !== null ? saved === 'true' : true;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [cadenceIntensity, setCadenceIntensity] = useState(0);

  // Content state
  const [loadedWords, setLoadedWords] = useState<string[]>(DEFAULT_WORDS);
  const [isLoadingWords, setIsLoadingWords] = useState(false);

  // Results & PB
  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [isPb, setIsPb] = useState(false);

  // Audio synthesizer
  const { playKeySound, testSound } = useSoundEffects(soundProfile);
  const cadenceDecayRef = useRef<number | null>(null);

  // Sync theme to DOM and localStorage
  useEffect(() => {
    if (theme === 'carbon') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('tp_theme', theme);
  }, [theme]);

  // Sync audio to localStorage
  useEffect(() => {
    localStorage.setItem('tp_sound', soundProfile);
  }, [soundProfile]);

  // Sync display toggles to localStorage
  useEffect(() => {
    localStorage.setItem('tp_show_keyboard', String(showKeyboard));
  }, [showKeyboard]);

  useEffect(() => {
    localStorage.setItem('tp_show_cockpit', String(showCockpit));
  }, [showCockpit]);

  // Track physical keypress for virtual keyboard radar & audio cadence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKey(e.key);
      setCadenceIntensity(1);

      if (cadenceDecayRef.current) cancelAnimationFrame(cadenceDecayRef.current);
      const decay = () => {
        setCadenceIntensity((prev) => {
          if (prev <= 0.05) return 0;
          cadenceDecayRef.current = requestAnimationFrame(decay);
          return prev * 0.88;
        });
      };
      cadenceDecayRef.current = requestAnimationFrame(decay);
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (cadenceDecayRef.current) cancelAnimationFrame(cadenceDecayRef.current);
    };
  }, []);

  // Load text based on selected mode
  const loadText = useCallback(async () => {
    setIsLoadingWords(true);
    try {
      if (mode === 'code') {
        const data = await fetchCodeSnippet(codeLanguage);
        const codeTokens = data.code
          .replace(/\n/g, ' ')
          .split(' ')
          .filter((t: string) => t.length > 0);
        setLoadedWords(codeTokens.length > 0 ? codeTokens : DEFAULT_WORDS);
      } else if (mode === 'quote') {
        const data = await fetchWords({ mode: 'quote' });
        setLoadedWords(data.words);
      } else if (mode === 'drill') {
        const data = await fetchDrill('th,in,er,ou', 30);
        setLoadedWords(data.words);
      } else {
        const count = mode === 'words' ? wordCount : 60;
        const data = await fetchWords({
          count,
          punctuation: hasPunctuation,
          numbers: hasNumbers,
          mode: 'words',
        });
        setLoadedWords(data.words);
      }
    } catch {
      setLoadedWords(DEFAULT_WORDS);
    } finally {
      setIsLoadingWords(false);
    }
  }, [mode, duration, wordCount, codeLanguage, hasPunctuation, hasNumbers]);

  useEffect(() => {
    loadText();
  }, [loadText]);

  // Handle test completion
  const handleTestFinished = useCallback(
    async (stats: TestStats) => {
      setTestStats(stats);
      setIsPb(false);

      try {
        const payload = {
          wpm: stats.wpm,
          raw_wpm: stats.rawWpm,
          accuracy: stats.accuracy,
          consistency: stats.consistency,
          mode: stats.mode,
          duration: stats.timeElapsed,
          characters: `${stats.correctChars}/${stats.incorrectChars}/${stats.extraChars}/${stats.missedChars}`,
          keystrokes: JSON.stringify(stats.keystrokes.slice(0, 500)),
        };

        const res = await submitTestResult(payload);
        if (res.is_pb) {
          setIsPb(true);
        }
      } catch (err) {
        console.error('Failed to sync test to backend:', err);
      }
    },
    []
  );

  // Typing engine
  const {
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
  } = useTypingEngine({
    initialWords: loadedWords,
    mode,
    duration,
    wordCount,
    isStrict,
    onKeyStroke: playKeySound,
    onFinish: handleTestFinished,
  });

  // Handle manual or shortcut test restart
  const handleRestart = useCallback(() => {
    setTestStats(null);
    setIsPb(false);
    loadText().then(() => resetTest());
  }, [loadText, resetTest]);

  // Handle practice weaknesses button from results modal
  const handlePracticeWeaknesses = useCallback(
    async (keys: string) => {
      setMode('drill');
      setTestStats(null);
      setIsLoadingWords(true);
      try {
        const data = await fetchDrill(keys, 30);
        setLoadedWords(data.words);
        resetTest(data.words);
      } catch {
        handleRestart();
      } finally {
        setIsLoadingWords(false);
      }
    },
    [resetTest, handleRestart]
  );


  const modeLabel =
    mode === 'code'
      ? `kernel_${codeLanguage}.ts`
      : mode === 'drill'
      ? 'nlp_drill_buffer.txt'
      : mode === 'quote'
      ? 'manifesto_quote.md'
      : `session_${mode}.py`;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg text-text transition-colors duration-300 relative">
      {/* Ambient background glow accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-main/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        isZen={isStarted && !isFinished}
      />

      {/* Main Cockpit Arena */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-5xl mx-auto my-auto py-2 z-10">
        {!testStats ? (
          <>
            {/* Modular Cyber Control Deck */}
            <div className="mb-4 w-full">
              <ModeSelector
                mode={mode}
                setMode={setMode}
                duration={duration}
                setDuration={setDuration}
                wordCount={wordCount}
                setWordCount={setWordCount}
                codeLanguage={codeLanguage}
                setCodeLanguage={setCodeLanguage}
                hasPunctuation={hasPunctuation}
                setHasPunctuation={setHasPunctuation}
                hasNumbers={hasNumbers}
                setHasNumbers={setHasNumbers}
                isStrict={isStrict}
                setIsStrict={setIsStrict}
                disabled={isStarted}
              />
            </div>

            {/* Cockpit Telemetry Header (Speedometer + Cadence Equalizer + Accuracy Ring) */}
            {showCockpit && (
              <CockpitHeader
                isStarted={isStarted}
                timeLeft={timeLeft}
                liveWpm={liveWpm}
                liveAccuracy={liveAccuracy}
                mode={mode}
                keystrokeCadence={cadenceIntensity}
              />
            )}

            {/* IDE Studio Console Viewport */}
            {isLoadingWords ? (
              <div className="w-full max-w-4xl h-[230px] flex items-center justify-center font-mono text-text-sub text-sm rounded-2xl bg-bg-surface/50 border border-text-sub/20 animate-pulse my-3">
                Compiling buffer telemetry...
              </div>
            ) : (
              <TypingArea
                wordStates={wordStates}
                currentWordIndex={currentWordIndex}
                currentInput={currentInput}
                isStarted={isStarted}
                isFinished={isFinished}
                capsLockActive={capsLockActive}
                onKeyDown={handleKeyDown}
                onRestart={handleRestart}
                modeLabel={modeLabel}
                minimalTimer={!showCockpit ? timeLeft : undefined}
              />
            )}

            {/* Interactive 60% Keystroke Radar Keyboard */}
            {showKeyboard && (
              <div className="w-full transition-all duration-300">
                <VirtualKeyboard activeKey={activeKey} />
              </div>
            )}
          </>
        ) : (
          /* Mission Dossier / Results Telemetry Report */
          <ResultsModal
            stats={testStats}
            onRestart={handleRestart}
            onPracticeWeaknesses={handlePracticeWeaknesses}
            isPb={isPb}
          />
        )}
      </main>

      {/* Footer */}
      <Footer isZen={isStarted && !isFinished} />

      {/* Settings Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
        showKeyboard={showKeyboard}
        setShowKeyboard={setShowKeyboard}
        showCockpit={showCockpit}
        setShowCockpit={setShowCockpit}
        onTestSound={testSound}
      />
    </div>
  );
}

export default App;
