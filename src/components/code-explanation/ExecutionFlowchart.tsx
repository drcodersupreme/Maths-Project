import React from 'react';
import { AlgorithmPhase } from '../../types/optimization';

interface ExecutionFlowchartProps {
  activePhase: AlgorithmPhase;
}

export const ExecutionFlowchart: React.FC<ExecutionFlowchartProps> = ({ activePhase }) => {
  const nodes = [
    { id: 'START', label: '1. Initialize', sub: 'X₀, f(X₀)' },
    { id: 'COMPUTE_GRAD', label: '2. Gradient', sub: '∇f(X_k)' },
    { id: 'CHECK_CONV', label: '3. Convergence', sub: '||∇f|| < ε' },
    { id: 'COMPUTE_DIR', label: '4. Direction', sub: 'd_k = -∇f' },
    { id: 'LINE_SEARCH', label: '5. Line Search', sub: 'Min φ(α)' },
    { id: 'UPDATE_X', label: '6. Update', sub: 'X_{k+1} = X + αd' },
    { id: 'CLASSIFY', label: '7. Classify', sub: 'Hessian H(X*)' },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wide">
          Algorithm Execution Flowchart
        </h3>
        <span className="text-[11px] text-[#6B7280]">
          Active Stage: <span className="font-semibold text-[#2563EB]">{activePhase}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 pt-1">
        {nodes.map((node) => {
          const isActive = activePhase === node.id;
          return (
            <div
              key={node.id}
              className={`p-2 rounded-md border text-center transition-colors ${
                isActive
                  ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-semibold'
                  : 'bg-[#F7F8FA] border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              <div className="text-xs">{node.label}</div>
              <div className="text-[10px] font-mono mt-0.5 text-gray-500">{node.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
