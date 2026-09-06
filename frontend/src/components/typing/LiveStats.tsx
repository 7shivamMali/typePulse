import React from 'react';

interface LiveStatsProps {
  isStarted: boolean;
  timeLeft: number;
  liveWpm: number;
  liveAccuracy: number;
  mode: string;
}

export const LiveStats: React.FC<LiveStatsProps> = ({
  isStarted,
  timeLeft,
  liveWpm,
  liveAccuracy,
  mode,
}) => {
  return (
    <div
      className={`flex items-center gap-8 text-xl font-mono transition-opacity duration-300 ${
        isStarted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col">
        <span className="text-[11px] text-text-sub uppercase tracking-wider">
          {mode.startsWith('time') ? 'time' : 'timer'}
        </span>
        <span className="text-2xl font-bold text-main">
          {mode.startsWith('time') ? `${timeLeft}s` : `${timeLeft}s`}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] text-text-sub uppercase tracking-wider">wpm</span>
        <span className="text-2xl font-bold text-text">{liveWpm}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] text-text-sub uppercase tracking-wider">acc</span>
        <span className="text-2xl font-bold text-text">{liveAccuracy}%</span>
      </div>
    </div>
  );
};
