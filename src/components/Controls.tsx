interface ControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  sphereMusicEnabled: boolean;
  onToggleSphereMusic: () => void;
  musicVolume: number;
  onVolumeChange: (vol: number) => void;
}

export function Controls({
  isPaused,
  onTogglePause,
  speed,
  onSpeedChange,
  showOrbits,
  onToggleOrbits,
  showLabels,
  onToggleLabels,
  sphereMusicEnabled,
  onToggleSphereMusic,
  musicVolume,
  onVolumeChange
}: ControlsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl p-4 shadow-2xl z-40">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* Play/Pause */}
        <button
          onClick={onTogglePause}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
            isPaused ? 'bg-green-600 hover:bg-green-500' : 'bg-orange-600 hover:bg-orange-500'
          }`}
          title={isPaused ? 'Воспроизвести' : 'Пауза'}
        >
          {isPaused ? (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          )}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Скорость:</span>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs text-white font-mono w-10">{speed.toFixed(1)}x</span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-700" />

        {/* Toggle Orbits */}
        <button
          onClick={onToggleOrbits}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showOrbits ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Орбиты
        </button>

        {/* Toggle Labels */}
        <button
          onClick={onToggleLabels}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showLabels ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Названия
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-700" />

        {/* Music of the Spheres Toggle */}
        <button
          onClick={onToggleSphereMusic}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            sphereMusicEnabled
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span>🎵</span>
          <span>Музыка Сфер</span>
        </button>

        {/* Volume */}
        {sphereMusicEnabled && (
          <div className="flex items-center gap-2">
            <span className="text-xs">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
