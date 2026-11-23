import React from 'react';
import { MATH_CODE_BRIDGES } from '../../engine/codeMetadata';
import { KatexMath } from '../common/KatexMath';

export const MathCodeBridge: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-[#E5E7EB] pb-2">
        <h2 className="text-base font-bold text-[#202124]">
          Connect Mathematics with Code
        </h2>
        <p className="text-xs text-[#6B7280]">
          Direct 1:1 mapping between numerical optimization formulas and their corresponding TypeScript source code lines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MATH_CODE_BRIDGES.map((bridge) => (
          <div
            key={bridge.id}
            className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-3 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wide mb-2">
                {bridge.mathConcept}
              </h3>

              {/* Math Equation */}
              <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#E5E7EB] mb-2 font-mono text-xs overflow-x-auto scrollbar-thin">
                <span className="text-[10px] text-[#6B7280] uppercase font-semibold block mb-0.5">
                  Mathematical Equation:
                </span>
                <KatexMath math={bridge.formulaLatex} block />
              </div>

              {/* Corresponding TypeScript Code */}
              <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#E5E7EB] font-mono text-xs text-[#202124] overflow-x-auto scrollbar-thin mb-2">
                <span className="text-[10px] text-[#6B7280] uppercase font-semibold block mb-0.5">
                  TypeScript Implementation:
                </span>
                <pre className="whitespace-pre">
                  <code>{bridge.typeScriptSnippet}</code>
                </pre>
              </div>

              {/* Detailed Explanation */}
              <p className="text-xs text-[#4B5563] leading-relaxed mb-2">
                {bridge.detailedExplanation}
              </p>
            </div>

            {/* Viva Tip */}
            <div className="bg-blue-50/60 border border-blue-100 rounded p-2.5 text-xs">
              <span className="font-semibold text-[#1E40AF] block text-[11px] mb-0.5">
                Viva & Examination Tip:
              </span>
              <span className="text-[#374151] text-[11px] leading-relaxed">
                {bridge.examinationTip}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
