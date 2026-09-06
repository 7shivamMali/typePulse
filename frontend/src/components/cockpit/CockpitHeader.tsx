import React from 'react';
import { Activity, Zap } from 'lucide-react';

interface CockpitHeaderProps {
  isStarted: boolean;
  timeLeft: number;
  liveWpm: number;
  liveAccuracy: number;
  mode: string;
  keystrokeCadence?: number; // 0 to 1 intensity
}

export const CockpitHeader: React.FC<CockpitHeaderProps> = ({
  isStarted,
  timeLeft,
  liveWpm,
  liveAccuracy,
  mode,
  keystrokeCadence = 0,
}) => {
  // Speedometer needle angle calculation (0 to 160 WPM mapped to -90deg to +90deg)
  const maxWpm = 150;
  const clampedWpm = Math.min(liveWpm, maxWpm);
  const needleRotation = -90 + (clampedWpm / maxWpm) * 180;

  // Accuracy circle stroke offset (circumference = 2 * PI * 24 ≈ 150.8)
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (liveAccuracy / 100) * circumference;

  return (
    <div
      className={`w-full max-w-4xl mx-auto flex items-center justify-between p-4 my-2 rounded-2xl bg-bg-surface/60 border border-text-sub/20 backdrop-blur-md font-mono shadow-xl transition-all duration-300 ${
        isStarted ? 'opacity-100' : 'opacity-80'
      }`}
    >
      {/* 1. Timer & Mode Block */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-bg border border-text-sub/20 flex flex-col items-center justify-center min-w-[70px]">
          <span className="text-[10px] text-text-sub uppercase tracking-widest font-semibold">
            {mode.startsWith('time') ? 'REMAIN' : 'ELAPSED'}
          </span>
          <span className="text-2xl font-black text-main tracking-tight">
            {timeLeft}
            <span className="text-xs font-normal ml-0.5 text-text-sub">s</span>
          </span>
        </div>

        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
            <Zap className="w-3.5 h-3.5 text-main" />
            <span className="capitalize">{mode}</span>
          </div>
          <span className="text-[11px] text-text-sub font-medium">
            Telemetry Feed Active
          </span>
        </div>
      </div>

      {/* 2. Interactive Audio Cadence Equalizer (Bounces as you type!) */}
      <div className="hidden md:flex flex-col items-center">
        <div className="flex items-center gap-1 text-[10px] text-text-sub uppercase tracking-wider mb-1.5">
          <Activity className="w-3 h-3 text-main animate-pulse" />
          <span>Cadence Spectrum</span>
        </div>
        <div className="flex items-end gap-1 h-8 px-3 py-1 rounded-lg bg-bg border border-text-sub/15">
          {[40, 75, 55, 90, 65, 80, 45, 95].map((baseHeight, idx) => {
            const dynamicHeight = isStarted
              ? Math.min(100, Math.max(15, baseHeight * (0.3 + keystrokeCadence * 0.8) + (idx % 2 ? 10 : -10)))
              : 15;
            return (
              <div
                key={idx}
                style={{ height: `${dynamicHeight}%` }}
                className="w-1.5 rounded-full bg-main transition-all duration-100 ease-out shadow-[0_0_8px_var(--color-main)]"
              />
            );
          })}
        </div>
      </div>

      {/* 3. Tachometer Speedometer + Accuracy Circular Gauge */}
      <div className="flex items-center gap-6">
        {/* Speedometer Gauge */}
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-12 flex items-center justify-center overflow-hidden">
            {/* Gauge Arc */}
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="var(--color-bg)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="var(--color-main)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="126"
                strokeDashoffset={126 - (clampedWpm / maxWpm) * 126}
                className="transition-all duration-200"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="18"
                stroke="var(--color-main)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${needleRotation}deg)`,
                  transformOrigin: '50px 50px',
                  transition: 'transform 150ms ease-out',
                }}
              />
              <circle cx="50" cy="50" r="4" fill="var(--color-main)" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-text-sub uppercase tracking-wider">SPEED</span>
            <span className="text-2xl font-black text-main leading-tight">
              {liveWpm}
              <span className="text-[11px] font-normal text-text-sub ml-1">WPM</span>
            </span>
          </div>
        </div>

        {/* Accuracy Circular Progress */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="var(--color-bg)"
                strokeWidth="5"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="var(--color-correct)"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-200"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-text">
              {Math.round(liveAccuracy)}%
            </span>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] text-text-sub uppercase tracking-wider">ACCURACY</span>
            <span className="text-sm font-bold text-text">
              {liveAccuracy}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
