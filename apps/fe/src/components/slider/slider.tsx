'use client';

import React from 'react';
import { cn } from '../../utils/styles';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export const Slider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  formatValue,
  className,
}: SliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      {(label || formatValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && <span className="text-14 font-medium text-meopta-text-secondary">{label}</span>}
          {formatValue && <span className="text-16 font-bold text-meopta-text-primary">{formatValue(value)}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-meopta-border outline-none
          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-meopta-blue [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-meopta-blue [&::-moz-range-thumb]:shadow-md"
        style={{
          background: `linear-gradient(to right, var(--color-meopta-blue) 0%, var(--color-meopta-blue) ${percentage}%, var(--color-meopta-border) ${percentage}%, var(--color-meopta-border) 100%)`,
        }}
      />
      <div className="mt-1 flex justify-between text-12 text-meopta-text-tertiary">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
};
