import { useState, useCallback, useRef, useEffect } from 'react';
import { SolarSystemCanvas } from './components/SolarSystemCanvas';
import { PlanetInfo } from './components/PlanetInfo';
import { Controls } from './components/Controls';
import { AlignmentNotification } from './components/AlignmentNotification';
import { SizeComparison } from './components/SizeComparison';
import { SpaceProbe } from './components/SpaceProbe';
import { useSphereMusic } from './hooks/useSphereMusic';
import { Planet, planets } from './data/planets';

interface ProbeState {
  active: boolean;
  target: Planet | null;
  progress: number;
}

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [showSizeComparison, setShowSizeComparison] = useState(false);
  const [showProbe, setShowProbe] = useState(false);
  const [alignedPlanets, setAlignedPlanets] = useState<Planet[]>([]);
  const [showAlignmentNotif, setShowAlignmentNotif] = useState(false);
  const [probe, setProbe] = useState<ProbeState>({ active: false, target: null, progress: 0 });
  const lastAlignmentRef = useRef<string>('');
  const probeIntervalRef = useRef<number | null>(null);

  const {
    audioState,
    playPlanetTone,
    updateAngles,
    startContinuousMusic,
    stopMusic,
    setVolume,
    playAlignmentChord
  } = useSphereMusic();

  const handlePlanetClick = useCallback((planet: Planet) => {
    setSelectedPlanet(prev => prev?.id === planet.id ? null : planet);
    playPlanetTone(planet, 0.8);
  }, [playPlanetTone]);

  const handlePlanetHover = useCallback((planet: Planet | null) => {
    setHoveredPlanet(planet);
  }, []);

  const handleToggleSphereMusic = useCallback(() => {
    if (audioState.isPlaying) {
      stopMusic();
    } else {
      startContinuousMusic();
    }
  }, [audioState.isPlaying, startContinuousMusic, stopMusic]);

  const handlePlanetPositionUpdate = useCallback((angles: number[]) => {
    if (audioState.isPlaying) {
      updateAngles(angles, planets);
    }
  }, [audioState.isPlaying, updateAngles]);

  const handleAlignmentDetected = useCallback((aligned: Planet[]) => {
    const key = aligned.map(p => p.id).sort().join(',');
    if (key !== lastAlignmentRef.current && aligned.length >= 3) {
      lastAlignmentRef.current = key;
      setAlignedPlanets(aligned);
      setShowAlignmentNotif(true);
      if (audioState.isPlaying) {
        playAlignmentChord(aligned);
      }
    }
  }, [audioState.isPlaying, playAlignmentChord]);

  const handleLaunchProbe = useCallback((target: Planet) => {
    setProbe({ active: true, target, progress: 0 });
    setShowProbe(false);

    // Animate probe progress
    if (probeIntervalRef.current) {
      clearInterval(probeIntervalRef.current);
    }
    
    const flightDuration = getFlightDuration(target);
    const step = 50; // ms
    const totalSteps = flightDuration / step;
    let currentStep = 0;

    probeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      
      if (progress >= 1) {
        setProbe({ active: false, target: null, progress: 0 });
        if (probeIntervalRef.current) {
          clearInterval(probeIntervalRef.current);
          probeIntervalRef.current = null;
        }
      } else {
        setProbe(prev => ({ ...prev, progress }));
      }
    }, step);
  }, []);

  // Cleanup probe interval on unmount
  useEffect(() => {
    return () => {
      if (probeIntervalRef.current) {
        clearInterval(probeIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0a1a] relative">
      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <h1 className="text-white text-xl sm:text-2xl font-bold tracking-wide drop-shadow-lg">
          🌌 Солнечная Система — Музыка Сфер
        </h1>
        <p className="text-gray-400 text-xs mt-1 hidden sm:block">
          Нажмите на планету • Включите «Музыку Сфер» • Запустите зонд
        </p>
      </div>

      {/* Canvas */}
      <div className="w-full h-full">
        <SolarSystemCanvas
          isPaused={isPaused}
          speed={speed}
          showOrbits={showOrbits}
          showLabels={showLabels}
          onPlanetClick={handlePlanetClick}
          onPlanetHover={handlePlanetHover}
          hoveredPlanet={hoveredPlanet}
          selectedPlanet={selectedPlanet}
          sphereMusicEnabled={audioState.isPlaying}
          onPlanetPositionUpdate={handlePlanetPositionUpdate}
          onAlignmentDetected={handleAlignmentDetected}
          probe={probe}
        />
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <PlanetInfo
          planet={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
          onPlayTone={(planet) => playPlanetTone(planet, 0.8)}
        />
      )}

      {/* Size Comparison */}
      <SizeComparison
        isOpen={showSizeComparison}
        onToggle={() => setShowSizeComparison(!showSizeComparison)}
      />

      {/* Space Probe */}
      <SpaceProbe
        isOpen={showProbe}
        onToggle={() => setShowProbe(!showProbe)}
        onLaunchProbe={handleLaunchProbe}
        probeActive={probe.active}
        probeTarget={probe.target}
        probeProgress={probe.progress}
      />

      {/* Alignment Notification */}
      {showAlignmentNotif && (
        <AlignmentNotification
          alignedPlanets={alignedPlanets}
          onDismiss={() => setShowAlignmentNotif(false)}
        />
      )}

      {/* Controls */}
      <Controls
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        speed={speed}
        onSpeedChange={setSpeed}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits(!showOrbits)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(!showLabels)}
        sphereMusicEnabled={audioState.isPlaying}
        onToggleSphereMusic={handleToggleSphereMusic}
        musicVolume={audioState.volume}
        onVolumeChange={setVolume}
      />

      {/* Hovered planet tooltip */}
      {hoveredPlanet && !selectedPlanet && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-1.5 z-30 pointer-events-none">
          <p className="text-white text-sm font-medium">{hoveredPlanet.nameRu}</p>
          <p className="text-gray-400 text-xs">Нажмите для подробностей</p>
        </div>
      )}
    </div>
  );
}

function getFlightDuration(planet: Planet): number {
  // Simulated flight durations in ms (accelerated for demo)
  const durations: Record<string, number> = {
    mercury: 4000,
    venus: 3000,
    mars: 5000,
    jupiter: 8000,
    saturn: 10000,
    uranus: 12000,
    neptune: 15000
  };
  return durations[planet.id] || 5000;
}
