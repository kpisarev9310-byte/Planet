import { Planet, planets } from '../data/planets';

interface SpaceProbeProps {
  isOpen: boolean;
  onToggle: () => void;
  onLaunchProbe: (target: Planet) => void;
  probeActive: boolean;
  probeTarget: Planet | null;
  probeProgress: number;
}

const destinations = [
  { id: 'mars', name: 'Марс', time: '7 мес', emoji: '🔴' },
  { id: 'jupiter', name: 'Юпитер', time: '2 года', emoji: '🟤' },
  { id: 'saturn', name: 'Сатурн', time: '3.5 года', emoji: '🟡' },
  { id: 'venus', name: 'Венера', time: '4 мес', emoji: '🟠' },
  { id: 'mercury', name: 'Меркурий', time: '6 мес', emoji: '⚫' },
  { id: 'neptune', name: 'Нептун', time: '12 лет', emoji: '🔵' },
  { id: 'uranus', name: 'Уран', time: '8.5 лет', emoji: '🩵' },
];

function getFlightTime(planetId: string): string {
  const times: Record<string, string> = {
    mercury: '6 месяцев',
    venus: '4 месяца',
    mars: '7 месяцев',
    jupiter: '2 года',
    saturn: '3.5 года',
    uranus: '8.5 лет',
    neptune: '12 лет'
  };
  return times[planetId] || '???';
}

export function SpaceProbe({ isOpen, onToggle, onLaunchProbe, probeActive, probeTarget, probeProgress }: SpaceProbeProps) {
  return (
    <div className="absolute bottom-24 right-4 z-40">
      <button
        onClick={onToggle}
        className={`bg-gray-900/90 backdrop-blur-md border rounded-xl px-3 py-2 text-xs transition-all hover:border-gray-500 ${
          probeActive ? 'border-green-500 text-green-300 shadow-lg shadow-green-500/20' : 'border-gray-700 text-gray-300 hover:text-white'
        }`}
      >
        🚀 {probeActive ? 'Зонд в полёте...' : 'Космический зонд'}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-4 w-60 shadow-2xl animate-slide-in">
          <h3 className="text-white font-bold text-sm mb-2">🚀 Космический зонд</h3>
          <p className="text-gray-400 text-xs mb-3">
            {probeActive 
              ? `Летим к ${probeTarget?.nameRu}...`
              : 'Выберите планету-цель:'}
          </p>

          {probeActive && probeTarget && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white">🌍 → {probeTarget.nameRu}</span>
                <span className="text-xs text-green-400 font-mono">{Math.round(probeProgress * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-100"
                  style={{ width: `${probeProgress * 100}%` }}
                />
              </div>
              <p className="text-xs text-yellow-300/80 mt-2">
                ⏱ Реальное время полёта: ~{getFlightTime(probeTarget.id)}
              </p>
            </div>
          )}

          {!probeActive && (
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {destinations.map(dest => (
                <button
                  key={dest.id}
                  onClick={() => {
                    const planet = planets.find(p => p.id === dest.id);
                    if (planet) onLaunchProbe(planet);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-xs text-gray-300 hover:text-white transition-all flex justify-between items-center group"
                >
                  <span className="flex items-center gap-1.5">
                    <span>{dest.emoji}</span>
                    <span>{dest.name}</span>
                  </span>
                  <span className="text-gray-500 group-hover:text-gray-300">{dest.time}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
