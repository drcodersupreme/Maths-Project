import React, { useEffect, useState } from 'react';

interface IterationStepperProps {
  currentIteration: number;
  totalIterations: number;
  onSelectIteration: (k: number) => void;
  onRunAll: () => void;
  currentF?: number;
  currentGradNorm?: number;
  currentCoords?: [number, number];
}

export const IterationStepper: React.FC<IterationStepperProps> = ({
  currentIteration,
  totalIterations,
  onSelectIteration,
  onRunAll,
  currentF,
  currentGradNorm,
  currentCoords,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speed = 700;

  const canPrev = currentIteration > 0;
  const canNext = currentIteration < totalIterations;

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      if (currentIteration < totalIterations) {
        timer = setTimeout(() => {
          onSelectIteration(currentIteration + 1);
        }, speed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentIteration, totalIterations, onSelectIteration]);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              setIsPlaying(false);
              onSelectIteration(0);
            }}
            disabled={!canPrev}
            title="First Iteration (X₀)"
            className="px-2.5 py-1 text-xs border border-[#E5E7EB] rounded-md text-[#202124] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            First
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (canPrev) onSelectIteration(currentIteration - 1);
            }}
            disabled={!canPrev}
            className="px-2.5 py-1 text-xs border border-[#E5E7EB] rounded-md text-[#202124] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>

          <button
            onClick={() => {
              if (currentIteration >= totalIterations) onSelectIteration(0);
              setIsPlaying(!isPlaying);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              isPlaying
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (canNext) onSelectIteration(currentIteration + 1);
            }}
            disabled={!canNext}
            className="px-2.5 py-1 text-xs border border-[#E5E7EB] rounded-md text-[#202124] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Next
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onSelectIteration(totalIterations);
            }}
            disabled={!canNext}
            title="Last Iteration"
            className="px-2.5 py-1 text-xs border border-[#E5E7EB] rounded-md text-[#202124] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Last
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onRunAll();
            }}
            className="px-2.5 py-1 text-xs bg-[#202124] text-white hover:bg-gray-800 rounded-md transition-colors ml-1"
          >
            Run All
          </button>
        </div>

        {/* Current Iteration Indicator */}
        <div className="text-xs font-medium text-[#202124]">
          Iteration <span className="font-bold text-[#2563EB]">{currentIteration}</span> of{' '}
          <span className="font-bold">{totalIterations}</span>
        </div>
      </div>

      {/* Small Metrics & Scrubber Row */}
      <div className="pt-2 border-t border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Scrubber slider */}
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <span className="text-[11px] text-[#6B7280] font-mono">0</span>
          <input
            type="range"
            min="0"
            max={totalIterations || 1}
            value={currentIteration}
            onChange={(e) => {
              setIsPlaying(false);
              onSelectIteration(parseInt(e.target.value));
            }}
            className="w-full h-1.5 bg-gray-200 rounded-md appearance-none cursor-pointer accent-[#2563EB]"
          />
          <span className="text-[11px] text-[#6B7280] font-mono">{totalIterations}</span>
        </div>

        {/* 3 Small Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#374151]">
          {currentCoords && (
            <div>
              <span className="text-[#6B7280]">Coords: </span>
              <span className="font-medium text-[#202124]">
                ({currentCoords[0].toFixed(4)}, {currentCoords[1].toFixed(4)})
              </span>
            </div>
          )}

          {currentF !== undefined && (
            <div>
              <span className="text-[#6B7280]">f(X): </span>
              <span className="font-medium text-[#202124]">{currentF.toFixed(5)}</span>
            </div>
          )}

          {currentGradNorm !== undefined && (
            <div>
              <span className="text-[#6B7280]">||∇f||: </span>
              <span className="font-medium text-[#202124]">
                {currentGradNorm.toExponential(3)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
