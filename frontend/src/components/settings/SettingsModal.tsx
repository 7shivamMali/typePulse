import React, { useState, useEffect, useRef } from 'react';
import type { Theme, SoundProfile } from '../../types/typing';
import {
  X,
  Sliders,
  Palette,
  Volume2,
  VolumeX,
  Gauge,
  Keyboard,
  Check,
  Play,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  soundProfile: SoundProfile;
  setSoundProfile: (sound: SoundProfile) => void;
  showKeyboard: boolean;
  setShowKeyboard: (show: boolean) => void;
  showCockpit: boolean;
  setShowCockpit: (show: boolean) => void;
  onTestSound?: (sound: SoundProfile) => void;
}

interface ThemeConfig {
  id: Theme;
  name: string;
  tag: string;
  bg: string;
  main: string;
  text: string;
  accent: string;
}

const THEMES: ThemeConfig[] = [
  { id: 'carbon', name: 'Cyber Carbon', tag: 'Default', bg: '#090d16', main: '#00f2fe', text: '#f1f5f9', accent: '#38bdf8' },
  { id: 'matrix', name: 'Matrix Terminal', tag: 'Hacker', bg: '#040805', main: '#00ff66', text: '#dcfce7', accent: '#4ade80' },
  { id: 'amber', name: 'Amber CRT', tag: 'Vintage', bg: '#120a02', main: '#ffb000', text: '#fef3c7', accent: '#f59e0b' },
  { id: 'synthwave', name: 'Synthwave 84', tag: 'Neon', bg: '#0c071e', main: '#ff2a85', text: '#fdf4ff', accent: '#c084fc' },
  { id: 'nordic', name: 'Nordic Frost', tag: 'Ice', bg: '#131720', main: '#38bdf8', text: '#f8fafc', accent: '#7dd3fc' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', tag: 'High Voltage', bg: '#0d0e15', main: '#fcee0a', text: '#ffffff', accent: '#00f0ff' },
  { id: 'dracula', name: 'Dracula Vampire', tag: 'Gothic', bg: '#1e1f29', main: '#bd93f9', text: '#f8f8f2', accent: '#ff79c6' },
  { id: 'monokai', name: 'Monokai Pro', tag: 'Editor', bg: '#1e1f1c', main: '#a6e22e', text: '#f8f8f2', accent: '#fd971f' },
  { id: 'tokyo', name: 'Tokyo Night', tag: 'Anime', bg: '#16161e', main: '#7aa2f7', text: '#c0caf5', accent: '#7dcfff' },
  { id: 'sepia', name: 'Warm Sepia', tag: 'Parchment', bg: '#1c1714', main: '#d97706', text: '#f5eedc', accent: '#eab308' },
  { id: 'paper-light', name: 'Paper Light', tag: 'Clean Light', bg: '#f8fafc', main: '#0284c7', text: '#0f172a', accent: '#059669' },
  { id: 'solarized-light', name: 'Solarized Light', tag: 'Ivory Paper', bg: '#fdf6e3', main: '#b58900', text: '#073642', accent: '#2aa198' },
  { id: 'sakura-light', name: 'Sakura Blossom', tag: 'Pastel Rose', bg: '#fff5f7', main: '#e11d48', text: '#4c1d2e', accent: '#059669' },
  { id: 'nord-light', name: 'Nord Snow', tag: 'Arctic Frost', bg: '#eceff4', main: '#4c566a', text: '#2e3440', accent: '#5e81ac' },
  { id: 'matcha-light', name: 'Matcha Tea', tag: 'Botanical', bg: '#f5f8f3', main: '#16a34a', text: '#1b3824', accent: '#15803d' },
];

interface SoundConfig {
  id: SoundProfile;
  name: string;
  switchType: string;
  description: string;
}

const SOUNDS: SoundConfig[] = [
  { id: 'clicky', name: 'Crisp Clicky', switchType: 'Blue Switch', description: 'Sharp click leaf with tactile snappy acoustic snap' },
  { id: 'linear', name: 'Smooth Linear', switchType: 'Red Switch', description: 'Gentle cushioned bottom-out with minimal resistance' },
  { id: 'thocky', name: 'Deep Thock', switchType: 'Holy Panda', description: 'Acoustic low-frequency resonance and heavy switch body' },
  { id: 'creamy', name: 'Lubed Creamy', switchType: 'Krytox Lubed', description: 'Warm, velvety double-tap with softened transient' },
  { id: 'typewriter', name: 'Metal Typewriter', switchType: 'Mechanical Strike', description: 'Vintage steel lever strike with solid platen impact' },
  { id: 'bubble', name: 'Water Bubble', switchType: 'Bubble Pop', description: 'Satisfying buoyant water droplet pop and chirp' },
  { id: 'retro-beep', name: '8-Bit Beep', switchType: 'Arcade Blip', description: 'Crisp retro console terminal frequency pulses' },
  { id: 'off', name: 'Mute / Silent', switchType: 'Zero Audio', description: 'Disables all synthesized keystroke audio' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  soundProfile,
  setSoundProfile,
  showKeyboard,
  setShowKeyboard,
  showCockpit,
  setShowCockpit,
  onTestSound,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'sound' | 'display'>('theme');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Settings Dialog */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-bg-surface border border-text-sub/25 shadow-2xl shadow-black/60 overflow-hidden font-mono text-text"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-text-sub/20 bg-bg/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-main/15 text-main border border-main/30">
              <Sliders className="w-5 h-5 text-main" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                Settings
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-main/10 text-main border border-main/20">
                  Studio Config
                </span>
              </h2>
              <p className="text-xs text-text-sub">Personalize themes, synthesized switch acoustics & cockpit telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-sub hover:text-text hover:bg-bg border border-transparent hover:border-text-sub/20 transition-all"
            title="Close Settings (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-text-sub/15 bg-bg/20 text-xs">
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
              activeTab === 'theme'
                ? 'bg-main/15 text-main border-main/40 font-semibold shadow-sm'
                : 'text-text-sub border-transparent hover:text-text hover:bg-bg'
            }`}
          >
            <Palette className="w-4 h-4 text-main" />
            <span>Themes ({THEMES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sound')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
              activeTab === 'sound'
                ? 'bg-main/15 text-main border-main/40 font-semibold shadow-sm'
                : 'text-text-sub border-transparent hover:text-text hover:bg-bg'
            }`}
          >
            <Volume2 className="w-4 h-4 text-main" />
            <span>Switch Audio ({SOUNDS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
              activeTab === 'display'
                ? 'bg-main/15 text-main border-main/40 font-semibold shadow-sm'
                : 'text-text-sub border-transparent hover:text-text hover:bg-bg'
            }`}
          >
            <Gauge className="w-4 h-4 text-main" />
            <span>Cockpit & Display</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: THEMES */}
          {activeTab === 'theme' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-text-sub pb-1">
                <span>Select active color scheme:</span>
                <span className="text-[11px] text-main font-semibold capitalize">
                  Current: {THEMES.find((t) => t.id === theme)?.name || theme}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                        isSelected
                          ? 'border-main bg-main/10 shadow-[0_0_12px_var(--color-main-glow)]'
                          : 'border-text-sub/20 bg-bg/60 hover:border-text-sub/40 hover:bg-bg'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-main font-bold' : 'text-text'}`}>
                            {t.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-bg-surface text-text-sub border border-text-sub/20">
                            {t.tag}
                          </span>
                        </div>
                        <span className="text-[10px] text-text-sub mt-0.5 font-mono">{t.id}</span>
                      </div>

                      {/* Swatch & Indicator */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center -space-x-1 p-1 rounded-lg bg-bg border border-text-sub/20">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: t.bg }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: t.main }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: t.accent }} />
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-main text-bg flex items-center justify-center font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-text-sub/20 group-hover:border-text-sub/40" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SOUND PROFILES */}
          {activeTab === 'sound' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-text-sub pb-1">
                <span>Select synthesized mechanical keystroke profile:</span>
                <span className="text-[11px] text-main font-semibold capitalize">
                  Current: {SOUNDS.find((s) => s.id === soundProfile)?.name || soundProfile}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {SOUNDS.map((s) => {
                  const isSelected = soundProfile === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSoundProfile(s.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-main bg-main/10 shadow-[0_0_12px_var(--color-main-glow)]'
                          : 'border-text-sub/20 bg-bg/60 hover:border-text-sub/40 hover:bg-bg'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-main text-bg' : 'bg-bg text-text-sub border border-text-sub/20'}`}>
                          {s.id === 'off' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${isSelected ? 'text-main font-bold' : 'text-text'}`}>
                              {s.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-sub border border-text-sub/20">
                              {s.switchType}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-sub mt-0.5">{s.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {s.id !== 'off' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onTestSound) {
                                onTestSound(s.id);
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] bg-bg border border-text-sub/25 hover:border-main hover:text-main transition-all text-text-sub font-mono"
                            title="Preview sound"
                          >
                            <Play className="w-3 h-3 text-main fill-main" />
                            <span>Test</span>
                          </button>
                        )}
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-main text-bg flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-text-sub/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DISPLAY & COCKPIT ELEMENTS */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              <div className="text-xs text-text-sub pb-1">
                Customize workspace display elements and telemetry meters:
              </div>

              {/* Toggle 1: Virtual Keyboard / Radar */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-text-sub/20 bg-bg/60 hover:border-text-sub/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-main/15 text-main border border-main/25 mt-0.5">
                    <Keyboard className="w-4 h-4 text-main" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text">60% Keystroke Radar Keyboard</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-main border border-main/20 font-semibold">
                        {showKeyboard ? 'ACTIVE' : 'MUTED'}
                      </span>
                    </div>
                    <p className="text-xs text-text-sub mt-1 leading-relaxed max-w-md">
                      Displays the interactive 60% mechanical layout with live key glow and real-time keystroke heat mapping below the editor.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showKeyboard ? 'bg-main shadow-[0_0_10px_var(--color-main-glow)]' : 'bg-text-sub/30'
                  }`}
                  role="switch"
                  aria-checked={showKeyboard}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-bg shadow ring-0 transition duration-200 ease-in-out ${
                      showKeyboard ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Cadence, Speed & Accuracy Telemetry Bar */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-text-sub/20 bg-bg/60 hover:border-text-sub/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-main/15 text-main border border-main/25 mt-0.5">
                    <Gauge className="w-4 h-4 text-main" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text">Cadence, Speed & Accuracy Bar</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-main border border-main/20 font-semibold">
                        {showCockpit ? 'ACTIVE' : 'MUTED'}
                      </span>
                    </div>
                    <p className="text-xs text-text-sub mt-1 leading-relaxed max-w-md">
                      Displays the top telemetry cockpit header featuring the tachometer speedometer gauge, real-time typing cadence spectrum equalizer, and circular accuracy ring.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCockpit(!showCockpit)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showCockpit ? 'bg-main shadow-[0_0_10px_var(--color-main-glow)]' : 'bg-text-sub/30'
                  }`}
                  role="switch"
                  aria-checked={showCockpit}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-bg shadow ring-0 transition duration-200 ease-in-out ${
                      showCockpit ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-text-sub/20 bg-bg/40 text-xs">
          <div className="flex items-center gap-1.5 text-text-sub text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-main" />
            <span>Preferences auto-save to browser local storage</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-main text-bg font-bold hover:brightness-110 shadow-[0_0_10px_var(--color-main-glow)] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
