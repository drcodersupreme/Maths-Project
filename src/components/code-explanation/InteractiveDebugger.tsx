import React, { useState } from 'react';
import { ExecutionStep } from '../../types/optimization';
import { KatexMath } from '../common/KatexMath';
import { ExecutionFlowchart } from './ExecutionFlowchart';
import { LiveVariableHUD } from './LiveVariableHUD';

interface InteractiveDebuggerProps {
  executionTrace: ExecutionStep[];
}

export const InteractiveDebugger: React.FC<InteractiveDebuggerProps> = ({ executionTrace }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!executionTrace || executionTrace.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 text-center text-[#6B7280] text-xs">
        No execution trace available yet. Please compute a solution first.
      </div>
    );
  }

  const step = executionTrace[currentStepIndex] || executionTrace[0];
  const canPrev = currentStepIndex > 0;
  const canNext = currentStepIndex < executionTrace.length - 1;

  return (
    <div className="space-y-4">
      {/* Flowchart highlighting active phase */}
      <ExecutionFlowchart activePhase={step.phase} />

      {/* Live Variable HUD */}
      <LiveVariableHUD currentStep={step} />

      {/* Main Debugger Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
        {/* Compact Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#202124]">
              Execute Code Step by Step
            </h3>
            <p className="text-xs text-[#6B7280]">
              Iterating through internal numerical operations within Iteration {step.iteration}
            </p>
          </div>

          {/* Stepper Toolbar */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentStepIndex(0)}
              disabled={!canPrev}
              title="Reset Debugger to Step 0"
              className="px-2.5 py-1 text-xs border border-[#E5E7EB] rounded-md text-[#202124] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Reset
            </button>

            <button
              onClick={() => canPrev && setCurrentStepIndex(currentStepIndex - 1)}
              disabled={!canPrev}
              className="px-2.5 py-1 text-xs border border-[#E5E7EB] rounded-md text-[#202124] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Previous Step
            </button>

            <span className="font-mono text-xs px-2.5 py-1 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-[#2563EB] font-medium">
              Step {currentStepIndex + 1} of {executionTrace.length}
            </span>

            <button
              onClick={() => canNext && setCurrentStepIndex(currentStepIndex + 1)}
              disabled={!canNext}
              className="px-3 py-1 text-xs bg-[#2563EB] hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-40 transition-colors"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* 2-Column Debugger View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Code Snippet & Formula */}
          <div className="space-y-3">
            <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-md p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-mono">
                <span>Executing Lines: {step.codeLineNumbers[0]} - {step.codeLineNumbers[1]}</span>
                <span className="font-semibold text-[#2563EB]">{step.phase}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#E5E7EB] font-mono text-xs text-[#202124] overflow-x-auto">
                <code>{step.codeSnippet}</code>
              </div>
            </div>

            <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-md p-3 space-y-1.5">
              <span className="text-[11px] text-[#6B7280] block font-medium">
                Mathematical Equation Represented:
              </span>
              <div className="bg-white p-2 rounded border border-[#E5E7EB] font-mono text-xs overflow-x-auto">
                <KatexMath math={step.formulaLatex} block />
              </div>
            </div>
          </div>

          {/* Right: Explanation & Output */}
          <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-md p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                {step.title}
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed bg-white p-3 rounded border border-[#E5E7EB]">
                {step.description}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-2.5 text-xs">
              <span className="font-semibold text-[#2563EB] block text-[11px] mb-0.5">
                Output Produced:
              </span>
              <span className="text-[#1E40AF] font-mono text-[11px]">{step.outputSummary}</span>
            </div>
          </div>
        </div>

        {/* Scrubber slider */}
        <div className="pt-2 flex items-center space-x-2">
          <span className="text-[10px] font-mono text-[#6B7280]">1</span>
          <input
            type="range"
            min="0"
            max={executionTrace.length - 1}
            value={currentStepIndex}
            onChange={(e) => setCurrentStepIndex(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-[#2563EB]"
          />
          <span className="text-[10px] font-mono text-[#6B7280]">
            {executionTrace.length}
          </span>
        </div>
      </div>
    </div>
  );
};
