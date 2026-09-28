import { planets } from '../data/planets';

interface SizeComparisonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SizeComparison({ isOpen, onToggle }: SizeComparisonProps) {
  const maxRadius = Math.max(...planets.map(p => p.radius));

  return (
    <div className="absolute top-4 left-4 z-40">
      <button
        onClick={onToggle}
        className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 hover:text-white transition-all hover:border-gray-500"
      >
        📏 Сравнение размеров
      </button>

      {isOpen && (
        <div className="mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-4 w-64 shadow-2xl animate-slide-in">
          <h3 className="text-white font-bold text-sm mb-3">Реальные размеры планет</h3>
          <div className="space-y-2">
            {planets.map(planet => {
              const relativeSize = (planet.radius / maxRadius) * 100;
              return (
                <div key={planet.id} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16 truncate">{planet.nameRu}</span>
                  <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(relativeSize, 3)}%`,
                        background: `linear-gradient(90deg, ${planet.color}, ${planet.glowColor})`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {planet.radius >= 10000
                      ? `${(planet.radius / 1000).toFixed(0)}k`
                      : `${planet.radius.toFixed(0)}`}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Масштаб относительно Юпитера (крупнейшей планеты)
          </p>
        </div>
      )}
    </div>
  );
}
