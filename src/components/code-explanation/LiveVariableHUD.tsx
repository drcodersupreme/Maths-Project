import React from 'react';
import { ExecutionStep } from '../../types/optimization';

interface LiveVariableHUDProps {
  currentStep: ExecutionStep | null;
}

export const LiveVariableHUD: React.FC<LiveVariableHUDProps> = ({ currentStep }) => {
  if (!currentStep) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center text-[#6B7280] text-xs">
        No active execution step.
      </div>
    );
  }

  const v = currentStep.variables;

  const vars = [
    { name: 'k', desc: 'Iteration', val: v.k },
    { name: 'x', desc: 'Coord x', val: v.x.toFixed(4) },
    { name: 'y', desc: 'Coord y', val: v.y.toFixed(4) },
    { name: 'f(X)', desc: 'Function', val: v.f.toFixed(4) },
    { name: 'g_x', desc: '∂f/∂x', val: v.gx.toFixed(4) },
    { name: 'g_y', desc: '∂f/∂y', val: v.gy.toFixed(4) },
    { name: '||g||', desc: 'Grad Norm', val: v.gradNorm.toExponential(3) },
    { name: 'd_x', desc: 'Dir x', val: v.dx.toFixed(4) },
    { name: 'd_y', desc: 'Dir y', val: v.dy.toFixed(4) },
    { name: 'α', desc: 'Alpha', val: v.alpha.toFixed(5) },
    { name: 'next_x', desc: 'Next x', val: v.nextX !== undefined ? v.nextX.toFixed(4) : '—' },
    { name: 'next_y', desc: 'Next y', val: v.nextY !== undefined ? v.nextY.toFixed(4) : '—' },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 space-y-2">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wide">
          Live Variable Memory Inspector
        </h3>
        <span className="text-[11px] text-[#6B7280]">
          Step {currentStep.stepIndex + 1}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {vars.map((item) => (
          <div
            key={item.name}
            className="bg-[#F7F8FA] p-2 rounded border border-[#E5E7EB] font-mono tabular-nums"
          >
            <div className="text-[10px] text-[#6B7280] flex justify-between">
              <span>{item.name}</span>
              <span className="text-[9px] text-gray-400">{item.desc}</span>
            </div>
            <div className="text-xs font-semibold text-[#202124] mt-0.5 truncate">
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
