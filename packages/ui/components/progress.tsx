import React from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 text-right text-sm text-slate-400">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

Progress.displayName = 'Progress';

export interface StepProgressProps {
  steps: number;
  currentStep: number;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn('flex gap-2', className)}>
      {Array.from({ length: steps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-1 flex-1 rounded-full transition-all duration-300',
            index < currentStep
              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
              : 'bg-slate-800'
          )}
        />
      ))}
    </div>
  );
};

StepProgress.displayName = 'StepProgress';
