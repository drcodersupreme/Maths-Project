import React, { useState } from 'react';
import { IterationDetail } from '../types/optimization';
import { KatexMath } from './common/KatexMath';

interface IterationTableProps {
  iterations: IterationDetail[];
  currentIteration: number;
  onSelectIteration: (k: number) => void;
}

export const IterationTable: React.FC<IterationTableProps> = ({
  iterations,
  currentIteration,
  onSelectIteration,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleExpand = (k: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({
      ...prev,
      [k]: !prev[k],
    }));
  };

  if (iterations.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 text-center text-[#6B7280] text-xs">
        No iteration history available yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
          Iteration History Table
        </h3>
        <span className="text-xs text-[#6B7280]">
          {iterations.length} Total Iterations
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-thin max-h-[480px]">
        <table className="w-full text-left text-[13px] font-mono tabular-nums">
          <thead className="bg-[#F7F8FA] text-[#6B7280] border-b border-[#E5E7EB] sticky top-0 z-10 text-xs font-sans font-medium">
            <tr>
              <th className="py-2.5 px-3 w-8 text-center"></th>
              <th className="py-2.5 px-3">k</th>
              <th className="py-2.5 px-3">Coordinates X_k</th>
              <th className="py-2.5 px-3">f(X_k)</th>
              <th className="py-2.5 px-3">Gradient ∇f</th>
              <th className="py-2.5 px-3">Direction d_k</th>
              <th className="py-2.5 px-3">Alpha α</th>
              <th className="py-2.5 px-3">Next Coords X_{'{k+1}'}</th>
              <th className="py-2.5 px-3 text-right">||∇f(X_{'{k+1}'})||</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-[#202124]">
            {iterations.map((iter) => {
              const isActive = currentIteration === iter.k + 1;
              const isExpanded = !!expandedRows[iter.k];

              return (
                <React.Fragment key={iter.k}>
                  <tr
                    onClick={() => onSelectIteration(iter.k + 1)}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-blue-50/70 border-l-2 border-[#2563EB] font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-2 px-3 text-center text-[#6B7280]">
                      <button
                        onClick={(e) => toggleExpand(iter.k, e)}
                        className="text-xs text-[#6B7280] hover:text-[#202124] transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </td>
                    <td className="py-2 px-3 font-semibold text-[#2563EB]">{iter.k}</td>
                    <td className="py-2 px-3">
                      ({iter.xk[0].toFixed(4)}, {iter.xk[1].toFixed(4)})
                    </td>
                    <td className="py-2 px-3">{iter.fxk.toFixed(5)}</td>
                    <td className="py-2 px-3 text-[#4B5563]">
                      [{iter.gx.toFixed(4)}, {iter.gy.toFixed(4)}]
                    </td>
                    <td className="py-2 px-3 text-[#4B5563]">
                      [{iter.direction[0].toFixed(4)}, {iter.direction[1].toFixed(4)}]
                    </td>
                    <td className="py-2 px-3 font-medium text-[#202124]">
                      {iter.alpha.toFixed(5)}
                    </td>
                    <td className="py-2 px-3">
                      ({iter.nextXk[0].toFixed(4)}, {iter.nextXk[1].toFixed(4)})
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span
                        className={
                          iter.convergedHere
                            ? 'text-green-700 font-semibold'
                            : 'text-[#4B5563]'
                        }
                      >
                        {iter.nextGradientNorm.toExponential(3)}
                      </span>
                    </td>
                  </tr>

                  {/* Expandable Derivation Sub-Row */}
                  {isExpanded && (
                    <tr className="bg-[#F7F8FA]">
                      <td colSpan={9} className="p-4 border-b border-[#E5E7EB]">
                        <div className="space-y-3 font-sans text-xs">
                          <h4 className="font-semibold text-[#202124] uppercase tracking-wide">
                            Iteration {iter.k} Calculation Summary
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-2.5 rounded border border-[#E5E7EB]">
                              <span className="text-[11px] text-[#6B7280] block mb-1">
                                Line Search φ(α) Expression:
                              </span>
                              <KatexMath math={iter.mathStepsLatex.step6PhiAlpha} block />
                            </div>
                            <div className="bg-white p-2.5 rounded border border-[#E5E7EB]">
                              <span className="text-[11px] text-[#6B7280] block mb-1">
                                Alpha Derivative Condition dφ/dα = 0:
                              </span>
                              <KatexMath math={iter.mathStepsLatex.step8AlphaCalculation} block />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
