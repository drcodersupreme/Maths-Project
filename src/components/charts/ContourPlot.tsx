import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import { IterationDetail, CompiledObjective, PresetProblem } from '../../types/optimization';

interface ContourPlotProps {
  obj: CompiledObjective;
  iterations: IterationDetail[];
  x0: [number, number];
  currentIteration: number;
  knownMinimum?: PresetProblem['knownMinimum'];
  onSelectIteration?: (k: number) => void;
}

export const ContourPlot: React.FC<ContourPlotProps> = ({
  obj,
  iterations,
  x0,
  currentIteration,
  knownMinimum,
  onSelectIteration,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute dynamic domain bounding box
  const domain = useMemo(() => {
    const allX = [x0[0], ...iterations.map((it) => it.xk[0]), ...iterations.map((it) => it.nextXk[0])];
    const allY = [x0[1], ...iterations.map((it) => it.xk[1]), ...iterations.map((it) => it.nextXk[1])];

    if (knownMinimum) {
      allX.push(knownMinimum.point[0]);
      allY.push(knownMinimum.point[1]);
    }

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const spanX = Math.max(maxX - minX, 2.5);
    const spanY = Math.max(maxY - minY, 2.5);

    const padX = spanX * 0.35;
    const padY = spanY * 0.35;

    return {
      xMin: minX - padX,
      xMax: maxX + padX,
      yMin: minY - padY,
      yMax: maxY + padY,
    };
  }, [x0, iterations, knownMinimum]);

  // Generate 2D contour grid
  const gridData = useMemo(() => {
    const numPoints = 80;
    const xVals: number[] = [];
    const yVals: number[] = [];
    const zVals: number[][] = [];

    const stepX = (domain.xMax - domain.xMin) / (numPoints - 1);
    const stepY = (domain.yMax - domain.yMin) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) xVals.push(domain.xMin + i * stepX);
    for (let j = 0; j < numPoints; j++) yVals.push(domain.yMin + j * stepY);

    for (let j = 0; j < numPoints; j++) {
      const row: number[] = [];
      const y = yVals[j];
      for (let i = 0; i < numPoints; i++) {
        const x = xVals[i];
        try {
          const val = obj.evaluate(x, y);
          row.push(isFinite(val) ? val : NaN);
        } catch {
          row.push(NaN);
        }
      }
      zVals.push(row);
    }

    return { xVals, yVals, zVals };
  }, [obj, domain]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Build trajectory points up to currentIteration
    const pathX: number[] = [x0[0]];
    const pathY: number[] = [x0[1]];
    const hoverTexts: string[] = [
      `<b>Start Point X₀</b><br>x: ${x0[0].toFixed(4)}<br>y: ${x0[1].toFixed(4)}<br>f(X₀): ${obj.evaluate(x0[0], x0[1]).toFixed(4)}`,
    ];

    const maxSteps = Math.min(currentIteration, iterations.length);
    for (let i = 0; i < maxSteps; i++) {
      const it = iterations[i];
      pathX.push(it.nextXk[0]);
      pathY.push(it.nextXk[1]);
      hoverTexts.push(
        `<b>Iteration ${i + 1}</b><br>x: ${it.nextXk[0].toFixed(4)}<br>y: ${it.nextXk[1].toFixed(4)}<br>f(X): ${it.nextFxk.toFixed(4)}<br>||∇f||: ${it.nextGradientNorm.toExponential(3)}<br>Step α: ${it.alpha.toFixed(5)}`
      );
    }

    const activeX = pathX[pathX.length - 1];
    const activeY = pathY[pathY.length - 1];

    const traces: any[] = [
      // 1. Contour plot with subtle academic light palette (Blues / Viridis / YlGnBu)
      {
        type: 'contour',
        x: gridData.xVals,
        y: gridData.yVals,
        z: gridData.zVals,
        colorscale: 'YlGnBu',
        reversescale: true,
        contours: {
          coloring: 'heatmap',
          showlabels: true,
          labelfont: { size: 10, color: '#374151', family: 'Inter' },
        },
        line: { width: 0.8, color: 'rgba(0, 0, 0, 0.15)' },
        colorbar: {
          title: 'f(x, y)',
          titleside: 'right',
          tickfont: { color: '#6B7280', size: 10, family: 'Inter' },
          titlefont: { color: '#374151', size: 11, family: 'Inter' },
          len: 0.85,
          thickness: 14,
        },
        hoverinfo: 'none',
      },

      // 2. Trajectory Path Line (Deep Navy #1E3A8A)
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: pathX,
        y: pathY,
        name: 'Optimization Path',
        line: {
          color: '#1E40AF',
          width: 2.5,
        },
        marker: {
          color: '#2563EB',
          size: 7,
          symbol: 'circle',
          line: { color: '#FFFFFF', width: 1.5 },
        },
        text: hoverTexts,
        hoverinfo: 'text',
      },

      // 3. Start Point Marker (Red/Amber Diamond)
      {
        type: 'scatter',
        mode: 'markers+text',
        x: [x0[0]],
        y: [x0[1]],
        name: 'Start X₀',
        marker: {
          color: '#DC2626',
          size: 11,
          symbol: 'diamond',
          line: { color: '#FFFFFF', width: 1.5 },
        },
        text: [' X₀'],
        textposition: 'top right',
        textfont: { color: '#991B1B', size: 11, family: 'Inter', weight: 600 },
        hoverinfo: 'text',
        hovertext: `Start Point X₀: (${x0[0].toFixed(4)}, ${x0[1].toFixed(4)})`,
      },

      // 4. Current Iteration Indicator (Solid Blue Circle)
      {
        type: 'scatter',
        mode: 'markers',
        x: [activeX],
        y: [activeY],
        name: `Current (Step ${currentIteration})`,
        marker: {
          color: '#2563EB',
          size: 13,
          symbol: 'circle',
          line: { color: '#FFFFFF', width: 2 },
        },
        hoverinfo: 'text',
        hovertext: `Current Iteration ${currentIteration}: (${activeX.toFixed(4)}, ${activeY.toFixed(4)})`,
      },
    ];

    // 5. Analytical Minimum Marker (if defined)
    if (knownMinimum) {
      traces.push({
        type: 'scatter',
        mode: 'markers+text',
        x: [knownMinimum.point[0]],
        y: [knownMinimum.point[1]],
        name: 'Exact Minimum X*',
        marker: {
          color: '#16A34A',
          size: 13,
          symbol: 'star',
          line: { color: '#FFFFFF', width: 1.5 },
        },
        text: [' X* (Min)'],
        textposition: 'bottom right',
        textfont: { color: '#166534', size: 11, family: 'Inter', weight: 600 },
        hoverinfo: 'text',
        hovertext: `Exact Analytical Min X*: (${knownMinimum.point[0].toFixed(4)}, ${knownMinimum.point[1].toFixed(4)})<br>f(X*): ${knownMinimum.value.toFixed(4)}`,
      });
    }

    // Directional arrows
    const annotations: any[] = [];
    for (let i = 0; i < maxSteps; i++) {
      annotations.push({
        ax: pathX[i],
        ay: pathY[i],
        x: pathX[i + 1],
        y: pathY[i + 1],
        xref: 'x',
        yref: 'y',
        axref: 'x',
        ayref: 'y',
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1.1,
        arrowwidth: 1.8,
        arrowcolor: '#1E3A8A',
        opacity: 0.85,
      });
    }

    const layout: any = {
      paper_bgcolor: '#FFFFFF',
      plot_bgcolor: '#FFFFFF',
      margin: { l: 55, r: 25, t: 30, b: 50 },
      xaxis: {
        title: { text: 'x', font: { color: '#4B5563', size: 12, family: 'Inter' } },
        range: [domain.xMin, domain.xMax],
        color: '#6B7280',
        gridcolor: '#F3F4F6',
        zerolinecolor: '#E5E7EB',
        tickfont: { color: '#4B5563', size: 11, family: 'Inter' },
      },
      yaxis: {
        title: { text: 'y', font: { color: '#4B5563', size: 12, family: 'Inter' } },
        range: [domain.yMin, domain.yMax],
        color: '#6B7280',
        gridcolor: '#F3F4F6',
        zerolinecolor: '#E5E7EB',
        scaleanchor: 'x',
        scaleratio: 1,
        tickfont: { color: '#4B5563', size: 11, family: 'Inter' },
      },
      legend: {
        x: 0,
        y: 1.08,
        orientation: 'h',
        font: { color: '#374151', size: 11, family: 'Inter' },
        bgcolor: 'transparent',
      },
      annotations,
      autosize: true,
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    };

    Plotly.react(containerRef.current, traces, layout, config);

    // Click handler on plot markers
    const el = containerRef.current as any;
    if (el && onSelectIteration) {
      el.on('plotly_click', (data: any) => {
        if (data.points && data.points.length > 0) {
          const ptIdx = data.points[0].pointIndex;
          if (typeof ptIdx === 'number' && ptIdx <= iterations.length) {
            onSelectIteration(ptIdx);
          }
        }
      });
    }
  }, [gridData, iterations, currentIteration, x0, knownMinimum, domain, obj, onSelectIteration]);

  return (
    <div className="w-full h-full min-h-[480px] bg-white rounded-lg border border-[#E5E7EB] p-2 flex flex-col">
      <div ref={containerRef} className="w-full h-full flex-1" />
    </div>
  );
};
