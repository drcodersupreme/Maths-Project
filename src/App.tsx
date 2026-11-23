import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ControlPanel } from './components/ControlPanel';
import { IterationStepper } from './components/IterationStepper';
import { ContourPlot } from './components/charts/ContourPlot';
import { SurfacePlot } from './components/charts/SurfacePlot';
import { ConvergencePlot } from './components/charts/ConvergencePlot';
import { MathDerivationCard } from './components/MathDerivationCard';
import { IterationTable } from './components/IterationTable';
import { CodeExplainerView } from './components/code-explanation/CodeExplainerView';
import { NumericalDryRun } from './components/code-explanation/NumericalDryRun';
import { VivaPrepGuide } from './components/code-explanation/VivaPrepGuide';
import { PRESET_PROBLEMS } from './engine/presets';
import { SolverOptions, OptimizationResult, PresetProblem } from './types/optimization';
import { prepareObjective, CompiledObjective } from './engine/symbolic';
import { solveSteepestDescent } from './engine/solver';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('visualizer');

  // Solver options state (Default: Example 3)
  const [options, setOptions] = useState<SolverOptions>({
    fnExpr: PRESET_PROBLEMS[2].formula,
    x0: PRESET_PROBLEMS[2].x0,
    maxIterations: PRESET_PROBLEMS[2].maxIterations,
    tolerance: PRESET_PROBLEMS[2].tolerance,
    lineSearchMethod: PRESET_PROBLEMS[2].lineSearchMethod,
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>('example3');
  const [currentIteration, setCurrentIteration] = useState<number>(0);
  const [graphTab, setGraphTab] = useState<'contour' | 'surface' | 'convergence'>('contour');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compile objective symbolically
  const compiledObj = useMemo<CompiledObjective | null>(() => {
    try {
      setErrorMessage(null);
      return prepareObjective(options.fnExpr);
    } catch (err) {
      setErrorMessage((err as Error).message);
      return null;
    }
  }, [options.fnExpr]);

  // Compute optimization result
  const result = useMemo<OptimizationResult | null>(() => {
    if (!compiledObj) return null;
    try {
      return solveSteepestDescent(options);
    } catch (err) {
      setErrorMessage(`Solver Error: ${(err as Error).message}`);
      return null;
    }
  }, [compiledObj, options]);

  // Sync iteration slider when new solution is computed
  useEffect(() => {
    if (result) {
      setCurrentIteration(result.iterations.length);
    }
  }, [result]);

  // Handler for preset selection
  const handleSelectPreset = useCallback((preset: PresetProblem) => {
    setSelectedPresetId(preset.id);
    setOptions({
      fnExpr: preset.formula,
      x0: [...preset.x0],
      maxIterations: preset.maxIterations,
      tolerance: preset.tolerance,
      lineSearchMethod: preset.lineSearchMethod,
      fixedAlpha: preset.fixedAlpha,
    });
  }, []);

  // Handle re-solve action
  const handleSolve = useCallback(() => {
    if (!compiledObj) return;
    try {
      const res = solveSteepestDescent(options);
      setCurrentIteration(res.iterations.length);
    } catch (err) {
      setErrorMessage(`Solver Error: ${(err as Error).message}`);
    }
  }, [compiledObj, options]);

  // Run all iterations to convergence
  const handleRunAll = useCallback(() => {
    if (result) {
      setCurrentIteration(result.iterations.length);
    }
  }, [result]);

  // Get active iteration detail for mathematical derivations
  const activeIterationDetail = useMemo(() => {
    if (!result || result.iterations.length === 0) return null;
    if (currentIteration === 0) return null;
    const index = Math.min(currentIteration - 1, result.iterations.length - 1);
    return result.iterations[index];
  }, [result, currentIteration]);

  // Preset match for analytical minimum badge
  const activePreset = PRESET_PROBLEMS.find((p) => p.id === selectedPresetId);

  return (
    <div className="min-h-screen bg-white text-[#202124] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Clean Minimalist Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        converged={result?.converged ?? false}
        totalIterations={result?.iterations.length ?? 0}
      />

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto w-full px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-xs">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            {/* Clean 2-Column Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Problem Configuration (4 cols) */}
              <div className="lg:col-span-4">
                <ControlPanel
                  options={options}
                  onOptionsChange={setOptions}
                  onSolve={handleSolve}
                  onSelectPreset={handleSelectPreset}
                  selectedPresetId={selectedPresetId}
                  isSolving={false}
                  fnLatex={compiledObj?.fnLatex || options.fnExpr}
                />
              </div>

              {/* Right Column: Visualization & Navigation (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Clean Tabbed Visualization Bar */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setGraphTab('contour')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        graphTab === 'contour'
                          ? 'bg-blue-50 text-[#2563EB] font-semibold'
                          : 'text-[#6B7280] hover:text-[#202124]'
                      }`}
                    >
                      2D Contour Plot
                    </button>

                    <button
                      onClick={() => setGraphTab('surface')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        graphTab === 'surface'
                          ? 'bg-blue-50 text-[#2563EB] font-semibold'
                          : 'text-[#6B7280] hover:text-[#202124]'
                      }`}
                    >
                      3D Surface Plot
                    </button>

                    <button
                      onClick={() => setGraphTab('convergence')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        graphTab === 'convergence'
                          ? 'bg-blue-50 text-[#2563EB] font-semibold'
                          : 'text-[#6B7280] hover:text-[#202124]'
                      }`}
                    >
                      Convergence Graph
                    </button>
                  </div>

                  <span className="text-[11px] text-[#6B7280] hidden sm:inline">
                    Interactive Graphics
                  </span>
                </div>

                {/* Single Active Graph Visualization */}
                <div className="min-h-[480px]">
                  {compiledObj && result && (
                    <>
                      {graphTab === 'contour' && (
                        <ContourPlot
                          obj={compiledObj}
                          iterations={result.iterations}
                          x0={options.x0}
                          currentIteration={currentIteration}
                          knownMinimum={activePreset?.knownMinimum}
                          onSelectIteration={setCurrentIteration}
                        />
                      )}
                      {graphTab === 'surface' && (
                        <SurfacePlot
                          obj={compiledObj}
                          iterations={result.iterations}
                          x0={options.x0}
                          currentIteration={currentIteration}
                          knownMinimum={activePreset?.knownMinimum}
                        />
                      )}
                      {graphTab === 'convergence' && (
                        <ConvergencePlot
                          iterations={result.iterations}
                          initialF={compiledObj.evaluate(options.x0[0], options.x0[1])}
                          initialGradNorm={result.iterations[0]?.gradientNorm ?? 0}
                          currentIteration={currentIteration}
                          tolerance={options.tolerance}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Compact Horizontal Iteration Navigation */}
                <IterationStepper
                  currentIteration={currentIteration}
                  totalIterations={result?.iterations.length ?? 0}
                  onSelectIteration={setCurrentIteration}
                  onRunAll={handleRunAll}
                  currentF={activeIterationDetail?.nextFxk ?? result?.finalValue}
                  currentGradNorm={
                    activeIterationDetail?.nextGradientNorm ?? result?.finalGradientNorm
                  }
                  currentCoords={
                    activeIterationDetail ? activeIterationDetail.nextXk : options.x0
                  }
                />
              </div>
            </div>

            {/* Bottom Section: Sequential Mathematical Derivation */}
            <MathDerivationCard
              iteration={activeIterationDetail}
              currentK={currentIteration}
              totalIterations={result?.iterations.length ?? 0}
              tolerance={options.tolerance}
              stationaryClassification={result?.stationaryClassification}
              converged={result?.converged ?? false}
              fnExpr={options.fnExpr}
            />

            {/* Bottom Section: Iteration History Table */}
            {result && (
              <IterationTable
                iterations={result.iterations}
                currentIteration={currentIteration}
                onSelectIteration={setCurrentIteration}
              />
            )}
          </div>
        )}

        {/* Tab 2: Understand the Code */}
        {activeTab === 'code-explanation' && result && (
          <CodeExplainerView executionTrace={result.executionTrace} />
        )}

        {/* Tab 3: Textbook Dry Run */}
        {activeTab === 'dry-run' && <NumericalDryRun />}

        {/* Tab 4: Viva Preparation */}
        {activeTab === 'viva' && <VivaPrepGuide />}
      </main>

      {/* Minimalist Academic Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-4 px-6 text-center text-xs text-[#6B7280]">
        Steepest Descent Solver • Minimalist Academic Optimization Platform
      </footer>
    </div>
  );
};

export default App;
