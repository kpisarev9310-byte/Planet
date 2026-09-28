import { useRef, useCallback, useState } from 'react';
import { Planet } from '../data/planets';

interface AudioState {
  isPlaying: boolean;
  volume: number;
}

export function useSphereMusic() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({ isPlaying: false, volume: 0.3 });
  const intervalRef = useRef<number | null>(null);
  const planetAnglesRef = useRef<number[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const lastPlayTimeRef = useRef<Map<string, number>>(new Map());

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = audioState.volume;
      masterGainRef.current.connect(audioContextRef.current.destination);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [audioState.volume]);

  const playPlanetTone = useCallback((planet: Planet, intensity: number = 0.5) => {
    initAudio();
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    // Prevent playing same planet too frequently
    const now = Date.now();
    const lastPlay = lastPlayTimeRef.current.get(planet.id) || 0;
    if (now - lastPlay < 500) return;
    lastPlayTimeRef.current.set(planet.id, now);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Different waveforms for different planet types
    if (planet.type === 'Газовый гигант') {
      osc.type = 'sine';
    } else if (planet.type === 'Ледяной гигант') {
      osc.type = 'triangle';
    } else {
      osc.type = 'sine';
    }

    // Slight detune for richness
    const detune = (Math.random() - 0.5) * 10;
    osc.frequency.value = planet.frequency;
    osc.detune.value = detune;
    
    gain.gain.value = 0.001;
    gain.gain.exponentialRampToValueAtTime(intensity * 0.12, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }, [initAudio]);

  const updateAngles = useCallback((angles: number[], planetsList: Planet[]) => {
    planetAnglesRef.current = angles;
    planetsRef.current = planetsList;

    if (!audioState.isPlaying) return;

    // Generate sounds based on planet positions
    const now = Date.now();
    angles.forEach((angle, i) => {
      const planet = planetsList[i];
      if (!planet) return;

      const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      
      // Play a note every time planet crosses a "quarter" position
      const quarter = Math.floor(normalizedAngle / (Math.PI / 2));
      const lastQuarter = lastPlayTimeRef.current.get(planet.id + '_q') || -1;
      
      if (quarter !== lastQuarter) {
        lastPlayTimeRef.current.set(planet.id + '_q', quarter);
        const lastTime = lastPlayTimeRef.current.get(planet.id) || 0;
        if (now - lastTime > 800) {
          playPlanetTone(planet, 0.4 + Math.random() * 0.3);
        }
      }
    });
  }, [audioState.isPlaying, playPlanetTone]);

  const startContinuousMusic = useCallback(() => {
    initAudio();
    setAudioState(prev => ({ ...prev, isPlaying: true }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Ambient drone
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (ctx && master) {
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = 'sine';
      drone.frequency.value = 65.41; // C2 - deep space drone
      droneGain.gain.value = 0.02;
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start();
      
      // Store reference to stop later
      (drone as any).__isDrone = true;
      (droneGain as any).__isDroneGain = true;
    }
  }, [initAudio]);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop drone
    const ctx = audioContextRef.current;
    if (ctx) {
      // We can't easily stop individual nodes, so we just set volume to 0
      // The drone will naturally fade
    }
    
    setAudioState(prev => ({ ...prev, isPlaying: false }));
    lastPlayTimeRef.current.clear();
  }, []);

  const setVolume = useCallback((vol: number) => {
    setAudioState(prev => ({ ...prev, volume: vol }));
    if (masterGainRef.current) {
      const ctx = audioContextRef.current;
      if (ctx) {
        masterGainRef.current.gain.setValueAtTime(vol, ctx.currentTime);
      }
    }
  }, []);

  const playAlignmentChord = useCallback((alignedPlanets: Planet[]) => {
    initAudio();
    alignedPlanets.forEach((planet, i) => {
      setTimeout(() => {
        playPlanetTone(planet, 0.9);
      }, i * 200);
    });
  }, [initAudio, playPlanetTone]);

  return {
    audioState,
    playPlanetTone,
    updateAngles,
    startContinuousMusic,
    stopMusic,
    setVolume,
    playAlignmentChord
  };
}
