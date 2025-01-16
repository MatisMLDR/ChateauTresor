'use client';

import React from 'react';
import { Star } from 'lucide-react'; // Icône d'étoile de Lucide (utilisé par shadcn/ui)
import { cn } from '@/lib/utils'; // Utilitaires de shadcn/ui pour les classes conditionnelles
import { RatingStarsProps } from '@/types';

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange = () => {},
  maxStars = 5,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = value >= starValue;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                'h-5 w-5',
                isFilled ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
