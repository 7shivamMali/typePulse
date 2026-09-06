import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../../services/api';
import { X, Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  wpm: number;
  raw_wpm: number;
  accuracy: number;
  mode: string;
  created_at: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('time 30');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchLeaderboard(mode)
      .then((data) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 font-mono">
      <div className="relative w-full max-w-2xl p-6 rounded-2xl bg-bg-surface border border-text-sub/20 shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-sub hover:text-text rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-main" />
          <h2 className="text-lg font-bold text-text">Leaderboard</h2>
        </div>

        {/* Mode filter tabs */}
        <div className="flex gap-2 mb-6 border-b border-text-sub/15 pb-2 text-xs">
          {['time 15', 'time 30', 'time 60', 'words 25', 'code python'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                mode === m ? 'bg-main/15 text-main font-semibold' : 'text-text-sub hover:text-text'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[220px]">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-text-sub text-sm">
              Loading rankings...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-sub text-sm">
              <span>No scores recorded yet for {mode}.</span>
              <span className="text-xs opacity-75 mt-1">Be the first to set a record!</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-text-sub/15 text-text-sub uppercase">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3 text-right">WPM</th>
                  <th className="py-2 px-3 text-right">Accuracy</th>
                  <th className="py-2 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text-sub/10">
                {entries.map((item) => (
                  <tr key={item.rank} className="hover:bg-bg/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-text-sub">
                      {item.rank === 1 ? (
                        <span className="text-main flex items-center gap-1">
                          <Medal className="w-3.5 h-3.5" /> 1
                        </span>
                      ) : (
                        item.rank
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-text">{item.username}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-main">{item.wpm}</td>
                    <td className="py-2.5 px-3 text-right text-text-sub">{item.accuracy}%</td>
                    <td className="py-2.5 px-3 text-right text-text-sub">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
