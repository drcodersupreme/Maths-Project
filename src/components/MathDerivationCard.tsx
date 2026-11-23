import React, { useState } from 'react';
import { IterationDetail, StationaryPointClassification } from '../types/optimization';
import { KatexMath } from './common/KatexMath';

interface MathDerivationCardProps {
  iteration: IterationDetail | null;
  currentK: number;
  totalIterations: number;
  tolerance: number;
  stationaryClassification?: StationaryPointClassification;
  converged: boolean;
  fnExpr: string;
}

export const MathDerivationCard: React.FC<MathDerivationCardProps> = ({
  iteration,
  currentK,
  totalIterations,
  tolerance,
  stationaryClassification,
  converged,
}) => {
  // Store expanded steps (accordion style, default first 2 or user-selected)
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  if (!iteration) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 text-center text-[#6B7280]">
        <h3 className="text-sm font-semibold text-[#202124] mb-1">
          Initial State (Iteration 0)
        </h3>
        <p className="text-xs">
          Click <b>Next</b> or <b>Play</b> in the navigation bar to compute the first iteration and reveal its step-by-step mathematical derivation.
        </p>
      </div>
    );
  }

  const { mathStepsLatex, k } = iteration;

  // 12 sequential mathematical steps
  const steps = [
    {
      num: 1,
      title: 'Current Coordinates',
      latex: mathStepsLatex.step1Coordinates,
      explanation: 'The current point vector X_k in 2D space.',
      deepExplanation: 'Optimization is an iterative sequence of coordinate vectors X₀, X₁, X₂, ... converging toward the unconstrained minimizer X*.',
    },
    {
      num: 2,
      title: 'Objective Function Value',
      latex: mathStepsLatex.step2FunctionValue,
      explanation: 'Evaluate f(x, y) at the current point.',
      deepExplanation: 'We monitor f(X_k) after every iteration to guarantee monotonic decrease: f(X_{k+1}) < f(X_k).',
    },
    {
      num: 3,
      title: 'Partial Derivatives',
      latex: mathStepsLatex.step3PartialDerivatives,
      explanation: 'Compute exact analytical partial derivatives ∂f/∂x and ∂f/∂y.',
      deepExplanation: 'Derived symbolically using the rules of differential calculus. Evaluated at current coordinates to construct the gradient vector.',
    },
    {
      num: 4,
      title: 'Gradient Vector',
      latex: `g_{${k}} = \\nabla f(X_{${k}}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x} \\\\ \\frac{\\partial f}{\\partial y} \\end{bmatrix} = \\begin{bmatrix} ${iteration.gx.toFixed(6)} \\\\ ${iteration.gy.toFixed(6)} \\end{bmatrix}`,
      explanation: 'Vector representing the rate and direction of maximum increase.',
      deepExplanation: 'The gradient vector ∇f(X_k) is perpendicular to the tangent of the level contour curve passing through X_k.',
    },
    {
      num: 5,
      title: 'Gradient Norm',
      latex: `\\|g_{${k}}\\| = \\sqrt{(${iteration.gx.toFixed(4)})^2 + (${iteration.gy.toFixed(4)})^2} = ${iteration.gradientNorm.toFixed(6)}`,
      explanation: 'Euclidean length of the gradient vector.',
      deepExplanation: 'At the unconstrained minimum, the surface is flat and the gradient vanishes: ||∇f(X*)|| = 0. We terminate when ||g|| < ε.',
    },
    {
      num: 6,
      title: 'Search Direction',
      latex: mathStepsLatex.step5SearchDirection,
      explanation: 'Move in the negative gradient direction: d_k = -g_k.',
      deepExplanation: 'Because ∇f indicates steepest ascent, -∇f represents the local direction of steepest descent.',
    },
    {
      num: 7,
      title: 'Line Search Function',
      latex: mathStepsLatex.step6PhiAlpha,
      explanation: 'Parametric restriction φ(α) = f(X_k + α d_k) along the search ray.',
      deepExplanation: 'Converts the 2-variable optimization problem into a 1D line minimization problem in scalar step size α.',
    },
    {
      num: 8,
      title: 'Derivative of Line Search Function',
      latex: mathStepsLatex.step7DphiAlpha,
      explanation: 'Compute dφ(α)/dα by chain rule: ∇f(X_k + α d_k)ᵀ d_k.',
      deepExplanation: 'At the minimum of φ(α), the tangent slope is zero: dφ/dα = 0.',
    },
    {
      num: 9,
      title: 'Optimal Alpha',
      latex: mathStepsLatex.step8AlphaCalculation,
      explanation: 'Solve dφ(α)/dα = 0 for step size α_k.',
      deepExplanation: 'For quadratic functions, this yields an exact analytical closed-form step size α = (gᵀ g) / (dᵀ H d).',
    },
    {
      num: 10,
      title: 'Updated Coordinates',
      latex: mathStepsLatex.step9CoordinateUpdate,
      explanation: 'Advance position vector: X_{k+1} = X_k + α_k d_k.',
      deepExplanation: 'Updates coordinates component-by-component by translating along direction d_k with step size α_k.',
    },
    {
      num: 11,
      title: 'New Function Value',
      latex: mathStepsLatex.step10NewFunctionValue,
      explanation: 'Evaluate f at the new coordinate vector X_{k+1}.',
      deepExplanation: 'Verifies decrease Δf = f(X_{k+1}) - f(X_k) < 0.',
    },
    {
      num: 12,
      title: 'New Gradient and Convergence Test',
      latex: `${mathStepsLatex.step11NewGradient} \\\\[4pt] ${mathStepsLatex.step12ConvergenceCheck}`,
      explanation: `Check if ||∇f(X_{k+1})|| < ε (${tolerance}).`,
      deepExplanation: iteration.convergedHere
        ? 'Convergence achieved! The gradient norm is smaller than tolerance ε. Terminating algorithm.'
        : 'Convergence not yet reached. The new direction d_{k+1} will be orthogonal to d_k.',
    },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3.5">
        <div>
          <h2 className="text-base font-bold text-[#202124]">
            Mathematical Derivation – Iteration {k}
          </h2>
          <p className="text-xs text-[#6B7280]">
            Step-by-step sequential mathematical calculation rendered with KaTeX
          </p>
        </div>

        <div className="text-xs font-medium text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
          {iteration.lineSearchType === 'exact_analytical'
            ? 'Exact Analytical Line Search'
            : iteration.lineSearchType === 'backtracking'
            ? 'Armijo Backtracking'
            : 'Fixed Step Size'}
        </div>
      </div>

      {/* Sequential Numbered Vertical Steps */}
      <div className="space-y-3.5">
        {steps.map((st) => {
          const isExpanded = expandedStep === st.num;

          return (
            <div
              key={st.num}
              className="border-b border-[#F3F4F6] pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start space-x-3">
                {/* Step number circle */}
                <span className="w-5 h-5 rounded-full bg-gray-100 text-[#374151] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {st.num}
                </span>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wide">
                      {st.title}
                    </h3>
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : st.num)}
                      className="text-[11px] text-[#6B7280] hover:text-[#2563EB] transition-colors"
                    >
                      {isExpanded ? 'Hide Notes' : 'Explain'}
                    </button>
                  </div>

                  {/* Mathematical Equation */}
                  <div className="py-1 text-sm overflow-x-auto scrollbar-thin">
                    <KatexMath math={st.latex} block />
                  </div>

                  {/* Plain English Explanation */}
                  <p className="text-xs text-[#6B7280]">
                    {st.explanation}
                  </p>

                  {/* Expandable Deep Explanation */}
                  {isExpanded && (
                    <div className="bg-[#F7F8FA] border-l-2 border-[#2563EB] p-2.5 rounded-r text-xs text-[#374151] mt-1.5 leading-relaxed">
                      {st.deepExplanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Armijo Backtracking Trial Details (if applicable) */}
      {iteration.lineSearchTrials && iteration.lineSearchTrials.length > 1 && (
        <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
          <h4 className="text-xs font-semibold text-[#202124]">
            Backtracking Line Search Trials ({iteration.lineSearchTrials.length} trials)
          </h4>
          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border border-[#E5E7EB]">
              <thead className="bg-[#F7F8FA] text-[#6B7280] border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-1.5 px-3">Trial</th>
                  <th className="py-1.5 px-3">α</th>
                  <th className="py-1.5 px-3">Trial Point</th>
                  <th className="py-1.5 px-3">Trial f(X)</th>
                  <th className="py-1.5 px-3">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#374151]">
                {iteration.lineSearchTrials.map((tr) => (
                  <tr key={tr.trialIndex} className={tr.satisfied ? 'bg-green-50' : ''}>
                    <td className="py-1 px-3">{tr.trialIndex + 1}</td>
                    <td className="py-1 px-3 font-semibold">{tr.alpha.toFixed(6)}</td>
                    <td className="py-1 px-3">({tr.trialPoint[0].toFixed(4)}, {tr.trialPoint[1].toFixed(4)})</td>
                    <td className="py-1 px-3">{tr.trialF.toFixed(6)}</td>
                    <td className="py-1 px-3">
                      {tr.satisfied ? (
                        <span className="text-green-700 font-semibold">Satisfied (Accepted)</span>
                      ) : (
                        <span className="text-gray-400">Failed (Shrink α)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stationary Point Classification via Hessian Matrix */}
      {stationaryClassification && (
        <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg p-4 space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wide">
              Second-Order Optimality: Hessian Curvature Test
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-800">
              {stationaryClassification.type}
            </span>
          </div>

          <p className="text-xs text-[#4B5563] leading-relaxed">
            {stationaryClassification.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-1">
            <div className="bg-white p-2.5 rounded border border-[#E5E7EB]">
              <span className="text-[#6B7280] text-[11px] block mb-1">Hessian Matrix:</span>
              <KatexMath
                math={`H = \\begin{bmatrix} ${stationaryClassification.fxx.toFixed(2)} & ${stationaryClassification.fxy.toFixed(2)} \\\\ ${stationaryClassification.fxy.toFixed(2)} & ${stationaryClassification.fyy.toFixed(2)} \\end{bmatrix}`}
                block
              />
            </div>

            <div className="bg-white p-2.5 rounded border border-[#E5E7EB]">
              <span className="text-[#6B7280] text-[11px] block mb-1">Determinant & Trace:</span>
              <div className="mt-1 space-y-0.5">
                <div>det(H) = <span className="font-semibold text-[#202124]">{stationaryClassification.det.toFixed(4)}</span></div>
                <div>trace(H) = <span className="font-semibold text-[#202124]">{stationaryClassification.trace.toFixed(4)}</span></div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded border border-[#E5E7EB]">
              <span className="text-[#6B7280] text-[11px] block mb-1">Eigenvalues:</span>
              <div className="mt-1 space-y-0.5">
                <div>λ₁ = <span className="font-semibold text-[#2563EB]">{stationaryClassification.eigenvalues[0].toFixed(4)}</span></div>
                <div>λ₂ = <span className="font-semibold text-[#2563EB]">{stationaryClassification.eigenvalues[1].toFixed(4)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
