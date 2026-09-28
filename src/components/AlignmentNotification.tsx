import { Planet } from '../data/planets';
import { useEffect, useState } from 'react';

interface AlignmentNotificationProps {
  alignedPlanets: Planet[];
  onDismiss: () => void;
}

export function AlignmentNotification({ alignedPlanets, onDismiss }: AlignmentNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (alignedPlanets.length === 0) return null;

  return (
    <div
      className={`absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-900/90 to-orange-900/90 backdrop-blur-md border border-yellow-500/50 rounded-2xl p-4 shadow-2xl z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">✨</span>
        <div>
          <h3 className="text-yellow-200 font-bold text-sm">Парад планет!</h3>
          <p className="text-yellow-100/80 text-xs">
            {alignedPlanets.map(p => p.nameRu).join(' • ')} выстроились в линию
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-yellow-300/60 hover:text-yellow-200 ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
