import { Planet } from '../data/planets';

interface PlanetInfoProps {
  planet: Planet;
  onClose: () => void;
  onPlayTone: (planet: Planet) => void;
}

export function PlanetInfo({ planet, onClose, onPlayTone }: PlanetInfoProps) {
  return (
    <div className="absolute top-4 right-4 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-5 shadow-2xl z-50 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full shadow-lg"
            style={{
              background: `radial-gradient(circle at 30% 30%, white, ${planet.color})`,
              boxShadow: `0 0 20px ${planet.glowColor}80`
            }}
          />
          <div>
            <h2 className="text-xl font-bold text-white">{planet.nameRu}</h2>
            <p className="text-xs text-gray-400">{planet.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4">{planet.description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Радиус</p>
          <p className="text-white font-semibold">{planet.radius.toLocaleString()} км</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400">До Солнца</p>
          <p className="text-white font-semibold">{planet.distanceFromSun} млн км</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Период</p>
          <p className="text-white font-semibold">
            {planet.orbitalPeriod > 365
              ? `${(planet.orbitalPeriod / 365.25).toFixed(1)} лет`
              : `${planet.orbitalPeriod} дней`}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Спутники</p>
          <p className="text-white font-semibold">{planet.moons}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Температура</p>
          <p className="text-white font-semibold text-xs">{planet.temperature}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Тип</p>
          <p className="text-white font-semibold text-xs">{planet.type}</p>
        </div>
      </div>

      {/* Music of the Spheres */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-300">🎵 Музыка Сфер</p>
            <p className="text-white font-semibold text-sm">
              Нота: {planet.note} ({planet.frequency} Гц)
            </p>
          </div>
          <button
            onClick={() => onPlayTone(planet)}
            className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <span className="text-lg">♪</span>
          </button>
        </div>
      </div>

      {/* Fun Fact */}
      <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-3">
        <p className="text-xs text-yellow-300 mb-1">💡 Интересный факт</p>
        <p className="text-gray-200 text-sm">{planet.funFact}</p>
      </div>
    </div>
  );
}
