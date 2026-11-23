import React, { useState } from 'react';
import { SolverOptions, PresetProblem } from '../types/optimization';
import { KatexMath } from './common/KatexMath';
import { PRESET_PROBLEMS } from '../engine/presets';

interface ControlPanelProps {
  options: SolverOptions;
  onOptionsChange: (newOptions: SolverOptions) => void;
  onSolve: () => void;
  onSelectPreset: (preset: PresetProblem) => void;
  selectedPresetId?: string;
  isSolving: boolean;
  fnLatex: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  onOptionsChange,
  onSolve,
  onSelectPreset,
  selectedPresetId,
  isSolving,
  fnLatex,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFieldChange = (field: keyof SolverOptions, value: any) => {
    onOptionsChange({
      ...options,
      [field]: value,
    });
  };

  const handleCoordinateChange = (index: 0 | 1, value: number) => {
    const newX0: [number, number] = [...options.x0];
    newX0[index] = value;
    onOptionsChange({
      ...options,
      x0: newX0,
    });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
      {/* Header with Title and Compact Example Dropdown */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
        <h2 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
          Problem Configuration
        </h2>
      </div>

      {/* Preset Problem Dropdown */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-[#6B7280]">
          Example Problem
        </label>
        <select
          value={selectedPresetId || ''}
          onChange={(e) => {
            const preset = PRESET_PROBLEMS.find((p) => p.id === e.target.value);
            if (preset) onSelectPreset(preset);
          }}
          className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#202124] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
        >
          <option value="" disabled>
            Select standard problem...
          </option>
          {PRESET_PROBLEMS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.title}
            </option>
          ))}
        </select>
      </div>

      {/* Objective Function Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#6B7280] flex justify-between">
          <span>Objective Function f(x, y)</span>
          <span className="text-[11px] text-gray-400">Variables: x, y</span>
        </label>
        <input
          type="text"
          value={options.fnExpr}
          onChange={(e) => handleFieldChange('fnExpr', e.target.value)}
          placeholder="e.g. x^2 + xy + 2y^2 - 6x - 8y"
          className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-3 py-2 text-sm text-[#202124] font-mono focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
        />

        {/* KaTeX Equation Preview */}
        <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs flex items-center justify-between">
          <span className="text-[11px] text-[#6B7280]">Preview:</span>
          <div className="overflow-x-auto text-right">
            <KatexMath math={`f(x, y) = ${fnLatex || options.fnExpr}`} />
          </div>
        </div>
      </div>

      {/* Initial Coordinates (x0, y0) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#6B7280]">
            Initial x₀
          </label>
          <input
            type="number"
            step="0.1"
            value={options.x0[0]}
            onChange={(e) => handleCoordinateChange(0, parseFloat(e.target.value) || 0)}
            className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#202124] font-mono focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[#6B7280]">
            Initial y₀
          </label>
          <input
            type="number"
            step="0.1"
            value={options.x0[1]}
            onChange={(e) => handleCoordinateChange(1, parseFloat(e.target.value) || 0)}
            className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#202124] font-mono focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Step-Size Line Search Method */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#6B7280]">
          Step-Size Selection (Line Search)
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-[#F7F8FA] p-1 border border-[#E5E7EB] rounded-md">
          <button
            type="button"
            onClick={() => handleFieldChange('lineSearchMethod', 'exact')}
            className={`py-1.5 px-2 text-xs font-medium rounded transition-colors ${
              options.lineSearchMethod === 'exact'
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Exact
          </button>
          <button
            type="button"
            onClick={() => handleFieldChange('lineSearchMethod', 'backtracking')}
            className={`py-1.5 px-2 text-xs font-medium rounded transition-colors ${
              options.lineSearchMethod === 'backtracking'
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Backtracking
          </button>
          <button
            type="button"
            onClick={() => handleFieldChange('lineSearchMethod', 'fixed')}
            className={`py-1.5 px-2 text-xs font-medium rounded transition-colors ${
              options.lineSearchMethod === 'fixed'
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Fixed α
          </button>
        </div>
      </div>

      {/* Advanced Parameters (Collapsed by default) */}
      <div className="border-t border-[#E5E7EB] pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-[#6B7280] hover:text-[#202124] flex items-center justify-between w-full font-medium"
        >
          <span>Advanced Parameters</span>
          <span className="text-[11px] text-gray-400 font-mono">
            {showAdvanced ? '▲ Hide' : '▼ Expand'}
          </span>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[#6B7280] block">
                Tolerance (ε)
              </label>
              <input
                type="number"
                step="0.00001"
                min="1e-9"
                max="0.1"
                value={options.tolerance}
                onChange={(e) => handleFieldChange('tolerance', parseFloat(e.target.value) || 1e-5)}
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-2.5 py-1.5 text-xs text-[#202124] font-mono focus:outline-none focus:border-[#2563EB] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#6B7280] block">
                Max Iterations
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={options.maxIterations}
                onChange={(e) => handleFieldChange('maxIterations', parseInt(e.target.value) || 50)}
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-2.5 py-1.5 text-xs text-[#202124] font-mono focus:outline-none focus:border-[#2563EB] focus:bg-white"
              />
            </div>

            {options.lineSearchMethod === 'fixed' && (
              <div className="col-span-2 space-y-1">
                <label className="text-[11px] text-[#6B7280] block">
                  Fixed Alpha (α)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.0001"
                  max="5"
                  value={options.fixedAlpha ?? 0.1}
                  onChange={(e) => handleFieldChange('fixedAlpha', parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-md px-2.5 py-1.5 text-xs text-[#202124] font-mono focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compute Solution Button */}
      <button
        type="button"
        onClick={onSolve}
        disabled={isSolving}
        className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs rounded-md py-2.5 px-4 transition-colors disabled:opacity-50"
      >
        Compute Solution
      </button>
    </div>
  );
};
