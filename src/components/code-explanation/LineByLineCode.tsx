import React, { useState } from 'react';
import {
  AUTHENTIC_TYPESCRIPT_SOURCE,
  LINE_BY_LINE_EXPLANATIONS,
  CodeLineExplanation,
} from '../../engine/codeMetadata';
import { KatexMath } from '../common/KatexMath';

export const LineByLineCode: React.FC = () => {
  const [selectedExplanation, setSelectedExplanation] = useState<CodeLineExplanation>(
    LINE_BY_LINE_EXPLANATIONS[0]
  );

  return (
    <div className="space-y-4">
      <div className="border-b border-[#E5E7EB] pb-2">
        <h2 className="text-base font-bold text-[#202124]">
          Authentic TypeScript Source Code
        </h2>
        <p className="text-xs text-[#6B7280]">
          Inspect the real TypeScript solver engine running in this browser. Click any highlighted line to view its mathematical formulation, algorithmic purpose, inputs, and outputs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Source Code Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg p-3 font-mono text-xs overflow-x-auto scrollbar-thin">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E7EB] text-[11px] text-[#6B7280] font-sans">
            <span>src/engine/solver.ts</span>
            <span className="font-semibold text-[#2563EB]">TypeScript Engine</span>
          </div>

          <pre className="text-[#374151] leading-relaxed">
            <code>
              {AUTHENTIC_TYPESCRIPT_SOURCE.split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                const matchedExp = LINE_BY_LINE_EXPLANATIONS.find(
                  (exp) => exp.lineNumber === lineNum
                );
                const isSelected = selectedExplanation.lineNumber === lineNum;

                return (
                  <div
                    key={lineNum}
                    onClick={() => matchedExp && setSelectedExplanation(matchedExp)}
                    className={`flex items-start py-0.5 px-1.5 rounded cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-100/70 text-[#2563EB] font-semibold border-l-2 border-[#2563EB]'
                        : matchedExp
                        ? 'hover:bg-gray-200/60 text-[#1F2937]'
                        : 'text-gray-400'
                    }`}
                  >
                    <span className="w-7 text-right pr-2.5 select-none text-gray-400 font-normal">
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </code>
          </pre>
        </div>

        {/* Detailed Explanation Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-3 sticky top-16">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] font-semibold">
                  {selectedExplanation.conceptTag}
                </span>
                <h3 className="text-sm font-bold text-[#202124] mt-1">
                  Line {selectedExplanation.lineNumber} Details
                </h3>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#E5E7EB] font-mono text-xs text-[#202124] overflow-x-auto">
              <code>{selectedExplanation.code}</code>
            </div>

            {/* Simple English Explanation */}
            <div>
              <h4 className="text-xs font-semibold text-[#202124] mb-1">
                Plain English Explanation:
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed bg-[#F7F8FA] p-2.5 rounded border border-[#E5E7EB]">
                {selectedExplanation.simpleEnglish}
              </p>
            </div>

            {/* Why Required */}
            <div>
              <h4 className="text-xs font-semibold text-[#202124] mb-1">
                Why This Line Is Required:
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed bg-[#F7F8FA] p-2.5 rounded border border-[#E5E7EB]">
                {selectedExplanation.whyRequired}
              </p>
            </div>

            {/* Mathematical Formula It Represents */}
            <div>
              <h4 className="text-xs font-semibold text-[#202124] mb-1">
                Mathematical Formula Represented:
              </h4>
              <div className="bg-[#F7F8FA] p-2 rounded border border-[#E5E7EB] text-xs">
                <KatexMath math={selectedExplanation.formulaLatex} block />
              </div>
            </div>

            {/* Input / Output */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#F7F8FA] p-2 rounded border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block mb-0.5">Input:</span>
                <span className="text-[#202124] text-[11px] break-all">
                  {selectedExplanation.sampleInput}
                </span>
              </div>
              <div className="bg-[#F7F8FA] p-2 rounded border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block mb-0.5">Output:</span>
                <span className="text-[#202124] text-[11px] break-all">
                  {selectedExplanation.sampleOutput}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
