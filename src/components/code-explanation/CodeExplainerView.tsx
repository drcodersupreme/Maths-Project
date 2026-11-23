import React, { useState } from 'react';
import { ExecutionStep } from '../../types/optimization';
import { InteractiveDebugger } from './InteractiveDebugger';
import { LineByLineCode } from './LineByLineCode';
import { MathCodeBridge } from './MathCodeBridge';

interface CodeExplainerViewProps {
  executionTrace: ExecutionStep[];
}

export const CodeExplainerView: React.FC<CodeExplainerViewProps> = ({ executionTrace }) => {
  const [subTab, setSubTab] = useState<'debugger' | 'linebyline' | 'bridge'>('debugger');

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSubTab('debugger')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'debugger'
                ? 'bg-blue-50 text-[#2563EB] font-semibold'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Interactive Code Debugger
          </button>

          <button
            onClick={() => setSubTab('linebyline')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'linebyline'
                ? 'bg-blue-50 text-[#2563EB] font-semibold'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Line-by-Line Code Viewer
          </button>

          <button
            onClick={() => setSubTab('bridge')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'bridge'
                ? 'bg-blue-50 text-[#2563EB] font-semibold'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Connect Math with Code
          </button>
        </div>

        <span className="text-[11px] text-[#6B7280] hidden sm:inline pr-2">
          Understand the Code Mode
        </span>
      </div>

      {/* Render Selected View */}
      {subTab === 'debugger' && <InteractiveDebugger executionTrace={executionTrace} />}
      {subTab === 'linebyline' && <LineByLineCode />}
      {subTab === 'bridge' && <MathCodeBridge />}
    </div>
  );
};
