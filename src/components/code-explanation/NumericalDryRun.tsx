import React, { useState } from 'react';
import { PREDEFINED_DRY_RUNS, DryRunProblem } from '../../engine/dryRunGenerator';
import { KatexMath } from '../common/KatexMath';

export const NumericalDryRun: React.FC = () => {
  const [selectedProblemKey, setSelectedProblemKey] = useState<string>('example3');

  const problem: DryRunProblem =
    PREDEFINED_DRY_RUNS[selectedProblemKey] || PREDEFINED_DRY_RUNS.example3;

  return (
    <div className="space-y-5">
      {/* Header and Problem Selector */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-3">
        <div>
          <h2 className="text-base font-bold text-[#202124]">
            Textbook Numerical Dry Run – Exam Solutions
          </h2>
          <p className="text-xs text-[#6B7280]">
            Complete sequential numerical solutions worked out by hand with exact arithmetic fractions and algebraic substitutions for B.Tech optimization examinations.
          </p>
        </div>

        {/* Problem Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Object.values(PREDEFINED_DRY_RUNS).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProblemKey(p.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                selectedProblemKey === p.id
                  ? 'bg-blue-50 text-[#2563EB] border-blue-200 font-semibold'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#202124]'
              }`}
            >
              {p.problemTitle.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Specification & Analytical Minimum */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <h3 className="text-sm font-bold text-[#202124]">{problem.problemTitle}</h3>
          <span className="text-xs font-mono text-[#6B7280]">
            Starting Point X₀ = ({problem.startingPoint[0]}, {problem.startingPoint[1]})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F7F8FA] p-3 rounded border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">
              Objective Function:
            </span>
            <KatexMath math={problem.functionLatex} block />
          </div>

          <div className="bg-[#F7F8FA] p-3 rounded border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">
              Exact Analytical Minimum (Solved via ∇f = 0):
            </span>
            <div className="space-y-1 text-xs font-mono">
              <div>
                <span className="text-[#6B7280]">X* = </span>
                <span className="font-semibold text-green-700">
                  {problem.analyticalMinimum.pointFraction}
                </span>
              </div>
              <div>
                <span className="text-[#6B7280]">f(X*) = </span>
                <span className="font-semibold text-green-700">
                  {problem.analyticalMinimum.valueFraction}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hessian Matrix */}
        <div className="bg-[#F7F8FA] p-3.5 rounded border border-[#E5E7EB] space-y-2">
          <span className="text-xs font-semibold text-[#202124] uppercase tracking-wide block">
            Hessian Curvature & Second-Derivative Test:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <span className="text-[#6B7280] block mb-0.5">Hessian H:</span>
              <KatexMath math={problem.hessianAnalysis.matrixLatex} block />
            </div>
            <div>
              <span className="text-[#6B7280] block mb-0.5">Determinant:</span>
              <KatexMath math={problem.hessianAnalysis.determinant} block />
            </div>
            <div>
              <span className="text-[#6B7280] block mb-0.5">Eigenvalues:</span>
              <KatexMath math={problem.hessianAnalysis.eigenvalues} block />
            </div>
          </div>
          <div className="text-xs text-green-800 font-semibold pt-1">
            Classification: {problem.hessianAnalysis.classification}
          </div>
        </div>

        {/* Theoretical Key Takeaway */}
        <div className="bg-blue-50/60 border border-blue-100 rounded p-3 text-xs">
          <span className="font-semibold text-[#1E40AF] block mb-1">
            Key Optimization Concept:
          </span>
          <p className="text-[#374151] leading-relaxed text-[11px]">
            {problem.keyInsight}
          </p>
        </div>
      </div>

      {/* Sequential Iteration 0 Workings */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
        <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wide border-b border-[#E5E7EB] pb-2">
          Iteration 0: Sequential Step-by-Step Manual Derivation
        </h3>

        <div className="space-y-3">
          {problem.iteration0Steps.map((step, idx) => (
            <div
              key={idx}
              className="border-b border-[#F3F4F6] pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-[#374151] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-semibold text-[#202124]">{step.title}</h4>
                  <div className="py-1 text-xs overflow-x-auto scrollbar-thin">
                    <KatexMath math={step.mathLatex} block />
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{step.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sequential Iteration 1 Workings (if present) */}
      {problem.iteration1Steps.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wide border-b border-[#E5E7EB] pb-2">
            Iteration 1: Orthogonality Verification & Progress
          </h3>

          <div className="space-y-3">
            {problem.iteration1Steps.map((step, idx) => (
              <div
                key={idx}
                className="border-b border-[#F3F4F6] pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-[#374151] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + problem.iteration0Steps.length + 1}
                  </span>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-semibold text-[#202124]">{step.title}</h4>
                    <div className="py-1 text-xs overflow-x-auto scrollbar-thin">
                      <KatexMath math={step.mathLatex} block />
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">{step.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
