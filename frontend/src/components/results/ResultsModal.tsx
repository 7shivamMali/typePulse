import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { TestStats } from '../../types/typing';
import { WpmChart } from './WpmChart';
import { RotateCcw, Share2, Target, Trophy, Award, Gauge } from 'lucide-react';

interface ResultsModalProps {
  stats: TestStats;
  onRestart: () => void;
  onPracticeWeaknesses?: (keys: string) => void;
  isPb?: boolean;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  stats,
  onRestart,
  onPracticeWeaknesses,
  isPb,
}) => {
  useEffect(() => {
    if (isPb) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#00f2fe', '#ffffff', '#38bdf8', '#ff2a85'],
      });
    }
  }, [isPb]);

  // Extract problematic keys from keystroke telemetry
  const errorKeys: Record<string, number> = {};
  stats.keystrokes?.forEach((k) => {
    if (!k.isCorrect && k.key.length === 1 && k.key !== ' ') {
      errorKeys[k.key] = (errorKeys[k.key] || 0) + 1;
    }
  });

  const sortedWeakKeys = Object.entries(errorKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);

  // Determine Performance Tier
  let tierTitle = 'CADENCE RECRUIT';
  let tierColor = 'text-sky-400 border-sky-400/30 bg-sky-400/10';
  if (stats.wpm >= 110) {
    tierTitle = 'HYPERSONIC OPERATOR';
    tierColor = 'text-amber-400 border-amber-400/30 bg-amber-400/10';
  } else if (stats.wpm >= 80) {
    tierTitle = 'CYBER SPEEDSTER';
    tierColor = 'text-main border-main/30 bg-main/10';
  } else if (stats.wpm >= 55) {
    tierTitle = 'PRECISION STRIKER';
    tierColor = 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
  }

  const copyResults = () => {
    const text = `⚡ TypePulse Dossier\n🚀 Speed: ${stats.wpm} WPM | 🎯 Accuracy: ${stats.accuracy}%\n📊 Mode: ${stats.mode} | Consistency: ${stats.consistency}%\nhttps://typepulse.dev`;
    navigator.clipboard.writeText(text);
    alert('Dossier telemetry copied to clipboard!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 p-8 rounded-3xl bg-bg-surface/90 border border-text-sub/25 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] font-mono animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header / PB Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-text-sub/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-bg border border-text-sub/20 text-main shadow-inner">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-sub uppercase tracking-wider">MISSION DEBRIEF // TELEMETRY</div>
            <div className="text-xl font-extrabold text-text tracking-tight">Diagnostic Performance Report</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${tierColor}`}>
            <Award className="w-4 h-4" />
            <span>{tierTitle}</span>
          </div>

          {isPb && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-main/20 border border-main text-main text-xs font-bold uppercase tracking-wider animate-pulse shadow-[0_0_15px_var(--color-main-glow)]">
              <Trophy className="w-4 h-4" />
              <span>Personal Best!</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-bg border border-text-sub/20 shadow-inner flex flex-col justify-between">
          <span className="text-[11px] text-text-sub uppercase tracking-widest font-semibold">NET SPEED</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-5xl md:text-6xl font-black text-main tracking-tight">
              {stats.wpm}
            </span>
            <span className="text-xs text-text-sub font-normal">WPM</span>
          </div>
          <span className="text-[11px] text-text-sub">Raw: {stats.rawWpm} WPM</span>
        </div>

        <div className="p-5 rounded-2xl bg-bg border border-text-sub/20 shadow-inner flex flex-col justify-between">
          <span className="text-[11px] text-text-sub uppercase tracking-widest font-semibold">ACCURACY</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-5xl md:text-6xl font-black text-text tracking-tight">
              {stats.accuracy}
            </span>
            <span className="text-xl text-text-sub font-normal">%</span>
          </div>
          <span className="text-[11px] text-text-sub">
            {stats.correctChars} correct / {stats.incorrectChars} error
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-bg border border-text-sub/20 shadow-inner flex flex-col justify-between">
          <span className="text-[11px] text-text-sub uppercase tracking-widest font-semibold">CADENCE</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-4xl md:text-5xl font-extrabold text-correct tracking-tight">
              {stats.consistency}%
            </span>
          </div>
          <span className="text-[11px] text-text-sub">Time: {stats.timeElapsed}s</span>
        </div>

        <div className="p-5 rounded-2xl bg-bg border border-text-sub/20 shadow-inner flex flex-col justify-between">
          <span className="text-[11px] text-text-sub uppercase tracking-widest font-semibold">CHAR MATRIX</span>
          <div className="text-sm font-semibold space-y-1 my-1">
            <div className="flex justify-between text-text">
              <span>Correct</span>
              <span className="text-main">{stats.correctChars}</span>
            </div>
            <div className="flex justify-between text-text">
              <span>Incorrect</span>
              <span className="text-rose-400">{stats.incorrectChars}</span>
            </div>
            <div className="flex justify-between text-text-sub text-[11px]">
              <span>Extra / Miss</span>
              <span>{stats.extraChars} / {stats.missedChars}</span>
            </div>
          </div>
          <span className="text-[10px] text-text-sub uppercase">{stats.mode}</span>
        </div>
      </div>

      {/* Cadence Progression Chart */}
      <div className="p-4 rounded-2xl bg-bg border border-text-sub/20">
        <div className="flex items-center justify-between text-xs text-text-sub mb-2 px-2">
          <span className="font-semibold uppercase tracking-wider">Speed Progression Timeline</span>
          <span className="text-[11px]">● Net WPM &nbsp; ┄┄ Raw WPM</span>
        </div>
        <WpmChart data={stats.chartData} />
      </div>

      {/* Targeted Drill Recommendation */}
      {sortedWeakKeys.length > 0 && onPracticeWeaknesses && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 p-4 rounded-2xl bg-bg border border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-text">Weak Keystroke Patterns Detected</div>
              <div className="text-xs text-text-sub mt-0.5">
                Highest error keys:{' '}
                {sortedWeakKeys.map((k) => (
                  <span key={k} className="mx-1 px-1.5 py-0.5 rounded bg-bg-surface border border-rose-500/30 text-rose-400 font-bold">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => onPracticeWeaknesses(sortedWeakKeys.join(','))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all shadow-md"
          >
            <span>Launch Weakness Drill</span>
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-text-sub/20">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-main text-bg font-extrabold text-sm hover:brightness-110 shadow-[0_0_20px_var(--color-main-glow)] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Run (Tab)</span>
        </button>

        <button
          onClick={copyResults}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg border border-text-sub/25 text-text-sub hover:text-text hover:border-main/50 text-sm font-semibold transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Telemetry</span>
        </button>
      </div>
    </div>
  );
};
