import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';
import { IterationDetail } from '../../types/optimization';

interface ConvergencePlotProps {
  iterations: IterationDetail[];
  initialF: number;
  initialGradNorm: number;
  currentIteration: number;
  tolerance: number;
}

export const ConvergencePlot: React.FC<ConvergencePlotProps> = ({
  iterations,
  initialF,
  initialGradNorm,
  currentIteration,
  tolerance,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'f' | 'grad' | 'alpha'>('f');
  const [logScale, setLogScale] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const iters = [0, ...iterations.map((_, i) => i + 1)];
    const fVals = [initialF, ...iterations.map((it) => it.nextFxk)];
    const gradNorms = [initialGradNorm, ...iterations.map((it) => it.nextGradientNorm)];
    const alphas = [0, ...iterations.map((it) => it.alpha)];

    const traces: any[] = [];
    let yTitle = '';

    if (activeView === 'f') {
      yTitle = 'Objective Function f(X_k)';
      traces.push({
        x: iters,
        y: fVals,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'f(X_k)',
        line: { color: '#2563EB', width: 2.5 },
        marker: { size: 6, color: '#2563EB' },
        hoverinfo: 'text',
        text: iters.map((k, i) => `Iteration ${k}<br>f(X): ${fVals[i].toFixed(6)}`),
      });
    } else if (activeView === 'grad') {
      yTitle = 'Gradient Norm ||∇f(X_k)||';
      traces.push({
        x: iters,
        y: gradNorms,
        type: 'scatter',
        mode: 'lines+markers',
        name: '||∇f(X_k)||',
        line: { color: '#7C3AED', width: 2.5 },
        marker: { size: 6, color: '#7C3AED' },
        hoverinfo: 'text',
        text: iters.map((k, i) => `Iteration ${k}<br>||∇f||: ${gradNorms[i].toExponential(4)}`),
      });

      // Tolerance horizontal line
      traces.push({
        x: [0, Math.max(1, iters.length - 1)],
        y: [tolerance, tolerance],
        type: 'scatter',
        mode: 'lines',
        name: `Tolerance ε (${tolerance})`,
        line: { color: '#DC2626', width: 1.5, dash: 'dash' },
        hoverinfo: 'skip',
      });
    } else {
      yTitle = 'Step Size (Alpha α_k)';
      traces.push({
        x: iters.slice(1),
        y: alphas.slice(1),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Step Size α',
        line: { color: '#D97706', width: 2.5 },
        marker: { size: 6, color: '#D97706' },
        hoverinfo: 'text',
        text: iters.slice(1).map((k, i) => `Iteration ${k}<br>α: ${alphas[i + 1].toFixed(6)}`),
      });
    }

    // Active iteration vertical reference line
    const shapes: any[] = [
      {
        type: 'line',
        x0: currentIteration,
        x1: currentIteration,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: {
          color: '#2563EB',
          width: 1.5,
          dash: 'dot',
        },
      },
    ];

    const annotations: any[] = [
      {
        x: currentIteration,
        y: 1.02,
        yref: 'paper',
        text: `k = ${currentIteration}`,
        showarrow: false,
        font: { color: '#2563EB', size: 10, family: 'Inter', weight: 600 },
        bgcolor: '#EFF6FF',
        bordercolor: '#BFDBFE',
        borderwidth: 1,
      },
    ];

    const layout: any = {
      paper_bgcolor: '#FFFFFF',
      plot_bgcolor: '#FFFFFF',
      margin: { l: 65, r: 25, t: 30, b: 50 },
      xaxis: {
        title: { text: 'Iteration Number (k)', font: { color: '#4B5563', size: 12, family: 'Inter' } },
        color: '#6B7280',
        gridcolor: '#F3F4F6',
        zerolinecolor: '#E5E7EB',
        dtick: 1,
        tickfont: { color: '#4B5563', size: 11, family: 'Inter' },
      },
      yaxis: {
        title: { text: yTitle, font: { color: '#4B5563', size: 12, family: 'Inter' } },
        type: activeView === 'grad' && logScale ? 'log' : 'linear',
        color: '#6B7280',
        gridcolor: '#F3F4F6',
        zerolinecolor: '#E5E7EB',
        tickfont: { color: '#4B5563', size: 11, family: 'Inter' },
      },
      legend: {
        x: 0,
        y: 1.08,
        orientation: 'h',
        font: { color: '#374151', size: 11, family: 'Inter' },
        bgcolor: 'transparent',
      },
      shapes,
      annotations,
      autosize: true,
    };

    const config = {
      responsive: true,
      displayModeBar: false,
    };

    Plotly.react(containerRef.current, traces, layout, config);
  }, [iterations, initialF, initialGradNorm, currentIteration, tolerance, activeView, logScale]);

  return (
    <div className="w-full h-full min-h-[480px] bg-white rounded-lg border border-[#E5E7EB] p-3 flex flex-col">
      {/* Separate View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-1 border-b border-[#E5E7EB]">
        <div className="flex items-center space-x-1 bg-[#F7F8FA] p-1 border border-[#E5E7EB] rounded-md text-xs">
          <button
            onClick={() => setActiveView('f')}
            className={`px-3 py-1 rounded transition-colors ${
              activeView === 'f'
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Objective Value f(X)
          </button>
          <button
            onClick={() => setActiveView('grad')}
            className={`px-3 py-1 rounded transition-colors ${
              activeView === 'grad'
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Gradient Norm ||∇f||
          </button>
          <button
            onClick={() => setActiveView('alpha')}
            className={`px-3 py-1 rounded transition-colors ${
              activeView === 'alpha'
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'text-[#6B7280] hover:text-[#202124]'
            }`}
          >
            Step Size (Alpha)
          </button>
        </div>

        {activeView === 'grad' && (
          <button
            onClick={() => setLogScale(!logScale)}
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
              logScale
                ? 'bg-blue-50 text-[#2563EB] border-blue-200 font-medium'
                : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#202124]'
            }`}
          >
            Log Scale: {logScale ? 'ON' : 'OFF'}
          </button>
        )}
      </div>

      <div ref={containerRef} className="w-full h-full flex-1" />
    </div>
  );
};
