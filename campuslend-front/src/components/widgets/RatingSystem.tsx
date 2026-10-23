import React from 'react';
import { Star } from 'lucide-react';

interface RatingSystemProps {
  score: number;
  onRate?: (newScore: number) => void;
  readonly?: boolean;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ score, onRate, readonly = false }) => {
  const isClickable = !readonly && !!onRate;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = score >= star;
          const isHalf = !isFilled && score >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              disabled={!isClickable}
              onClick={() => onRate?.(star)}
              className={`p-0.5 transition-all duration-150 ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'fill-gray-200 text-gray-200'
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-gray-900">{score.toFixed(1)}</span>
    </div>
  );
};

export default RatingSystem;
