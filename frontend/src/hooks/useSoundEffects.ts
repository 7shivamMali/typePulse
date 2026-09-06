import { useRef, useCallback } from 'react';
import type { SoundProfile } from '../types/typing';

export function useSoundEffects(profile: SoundProfile = 'clicky') {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSoundWithProfile = useCallback(
    (targetProfile: SoundProfile, key: string = 'a', isError: boolean = false) => {
      if (targetProfile === 'off') return;

      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const isSpace = key === ' ';

        if (isError) {
          // Subtle error thud/buzz
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          return;
        }

        // Slight organic variation per keystroke
        const jitter = 0.95 + Math.random() * 0.1;
        const spacePitchMod = isSpace ? 0.75 : 1.0;

        if (targetProfile === 'clicky') {
          // 1. High crisp click (click leaf)
          const clickOsc = ctx.createOscillator();
          const clickGain = ctx.createGain();
          clickOsc.type = 'triangle';
          clickOsc.frequency.setValueAtTime(2200 * jitter * spacePitchMod, now);
          clickGain.gain.setValueAtTime(0.04, now);
          clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

          clickOsc.connect(clickGain);
          clickGain.connect(ctx.destination);
          clickOsc.start(now);
          clickOsc.stop(now + 0.012);

          // 2. Bottom-out thud
          const thudOsc = ctx.createOscillator();
          const thudGain = ctx.createGain();
          thudOsc.type = 'sine';
          thudOsc.frequency.setValueAtTime(180 * jitter * spacePitchMod, now + 0.005);
          thudGain.gain.setValueAtTime(0.08, now + 0.005);
          thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          thudOsc.connect(thudGain);
          thudGain.connect(ctx.destination);
          thudOsc.start(now + 0.005);
          thudOsc.stop(now + 0.04);
        } else if (targetProfile === 'linear') {
          // Soft dampened bottom-out
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150 * jitter * spacePitchMod, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.035);

          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.035);
        } else if (targetProfile === 'thocky') {
          // Deep acoustic thock with low-pass resonance
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(95 * jitter * spacePitchMod, now);
          osc.frequency.exponentialRampToValueAtTime(55, now + 0.05);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, now);
          filter.Q.setValueAtTime(3, now);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (targetProfile === 'creamy') {
          // Lubed mechanical switch - mellow, velvety, deep warmth
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(160 * jitter * spacePitchMod, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.045);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(500, now);
          filter.Q.setValueAtTime(2, now);

          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.045);
        } else if (targetProfile === 'typewriter') {
          // Vintage mechanical typewriter: metallic snap + heavy platen strike
          // 1. Metallic clack
          const snapOsc = ctx.createOscillator();
          const snapFilter = ctx.createBiquadFilter();
          const snapGain = ctx.createGain();
          snapOsc.type = 'triangle';
          snapOsc.frequency.setValueAtTime(2800 * jitter * spacePitchMod, now);
          snapFilter.type = 'bandpass';
          snapFilter.frequency.setValueAtTime(3200, now);
          snapFilter.Q.setValueAtTime(4, now);
          snapGain.gain.setValueAtTime(0.06, now);
          snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
          snapOsc.connect(snapFilter);
          snapFilter.connect(snapGain);
          snapGain.connect(ctx.destination);
          snapOsc.start(now);
          snapOsc.stop(now + 0.015);

          // 2. Heavy strike body
          const bodyOsc = ctx.createOscillator();
          const bodyGain = ctx.createGain();
          bodyOsc.type = 'sine';
          bodyOsc.frequency.setValueAtTime(220 * jitter * spacePitchMod, now + 0.003);
          bodyOsc.frequency.exponentialRampToValueAtTime(75, now + 0.045);
          bodyGain.gain.setValueAtTime(0.09, now + 0.003);
          bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          bodyOsc.connect(bodyGain);
          bodyGain.connect(ctx.destination);
          bodyOsc.start(now + 0.003);
          bodyOsc.stop(now + 0.045);
        } else if (targetProfile === 'bubble') {
          // Bubbly water drop / pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(450 * jitter * spacePitchMod, now);
          osc.frequency.exponentialRampToValueAtTime(1150 * jitter, now + 0.025);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.035);
        } else if (targetProfile === 'retro-beep') {
          // 8-bit arcade terminal chirp
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(580 * jitter * spacePitchMod, now);
          osc.frequency.setValueAtTime(880 * jitter * spacePitchMod, now + 0.012);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
        }
      } catch {
        // Ignore audio context errors gracefully
      }
    },
    [getAudioContext]
  );

  const playKeySound = useCallback(
    (key: string, isError: boolean = false) => {
      playSoundWithProfile(profile, key, isError);
    },
    [profile, playSoundWithProfile]
  );

  const testSound = useCallback(
    (targetProfile: SoundProfile) => {
      playSoundWithProfile(targetProfile, 'a', false);
    },
    [playSoundWithProfile]
  );

  return { playKeySound, testSound };
}
