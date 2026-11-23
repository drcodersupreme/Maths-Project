import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import { IterationDetail, CompiledObjective, PresetProblem } from '../../types/optimization';

interface SurfacePlotProps {
  obj: CompiledObjective;
  iterations: IterationDetail[];
  x0: [number, number];
  currentIteration: number;
  knownMinimum?: PresetProblem['knownMinimum'];
}

export const SurfacePlot: React.FC<SurfacePlotProps> = ({
  obj,
  iterations,
  x0,
  currentIteration,
  knownMinimum,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic 3D domain bounding box
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

    const spanX = Math.max(maxX - minX, 2.0);
    const spanY = Math.max(maxY - minY, 2.0);

    const padX = spanX * 0.35;
    const padY = spanY * 0.35;

    return {
      xMin: minX - padX,
      xMax: maxX + padX,
      yMin: minY - padY,
      yMax: maxY + padY,
    };
  }, [x0, iterations, knownMinimum]);

  // Generate 3D surface grid
  const surfaceGrid = useMemo(() => {
    const numPoints = 45;
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

    // 3D Path data
    const pathX: number[] = [x0[0]];
    const pathY: number[] = [x0[1]];
    const pathZ: number[] = [obj.evaluate(x0[0], x0[1])];

    const maxSteps = Math.min(currentIteration, iterations.length);
    for (let i = 0; i < maxSteps; i++) {
      const it = iterations[i];
      pathX.push(it.nextXk[0]);
      pathY.push(it.nextXk[1]);
      pathZ.push(it.nextFxk);
    }

    const activeX = pathX[pathX.length - 1];
    const activeY = pathY[pathY.length - 1];
    const activeZ = pathZ[pathZ.length - 1];

    const traces: any[] = [
      // 1. 3D Surface
      {
        type: 'surface',
        x: surfaceGrid.xVals,
        y: surfaceGrid.yVals,
        z: surfaceGrid.zVals,
        colorscale: 'YlGnBu',
        reversescale: true,
        opacity: 0.9,
        showscale: false,
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: '#1E40AF',
            project: { z: true },
          },
        },
        hoverinfo: 'none',
      },

      // 2. 3D Optimization Trajectory Line
      {
        type: 'scatter3d',
        mode: 'lines+markers',
        x: pathX,
        y: pathY,
        z: pathZ.map((z) => z + 0.05),
        name: 'Optimization Path',
        line: {
          color: '#1E40AF',
          width: 5,
        },
        marker: {
          color: '#2563EB',
          size: 4,
        },
        hoverinfo: 'text',
        text: pathX.map(
          (x, i) => `<b>Step ${i}</b><br>x: ${x.toFixed(4)}<br>y: ${pathY[i].toFixed(4)}<br>f(X): ${pathZ[i].toFixed(4)}`
        ),
      },

      // 3. Start Point Marker
      {
        type: 'scatter3d',
        mode: 'markers+text',
        x: [x0[0]],
        y: [x0[1]],
        z: [pathZ[0] + 0.1],
        name: 'Start X₀',
        marker: {
          color: '#DC2626',
          size: 7,
          symbol: 'diamond',
        },
        text: ['X₀'],
        textposition: 'top center',
        textfont: { color: '#991B1B', size: 11, family: 'Inter', weight: 600 },
        hoverinfo: 'text',
        hovertext: `Start Point X₀: (${x0[0].toFixed(4)}, ${x0[1].toFixed(4)})`,
      },

      // 4. Current Iteration Point
      {
        type: 'scatter3d',
        mode: 'markers',
        x: [activeX],
        y: [activeY],
        z: [activeZ + 0.15],
        name: `Current (Step ${currentIteration})`,
        marker: {
          color: '#2563EB',
          size: 8,
          symbol: 'circle',
          line: { color: '#FFFFFF', width: 2 },
        },
        hoverinfo: 'text',
        hovertext: `Active Step ${currentIteration}: (${activeX.toFixed(4)}, ${activeY.toFixed(4)})`,
      },
    ];

    // 5. Analytical Minimum Marker (if defined)
    if (knownMinimum) {
      traces.push({
        type: 'scatter3d',
        mode: 'markers+text',
        x: [knownMinimum.point[0]],
        y: [knownMinimum.point[1]],
        z: [knownMinimum.value + 0.1],
        name: 'Exact Min X*',
        marker: {
          color: '#16A34A',
          size: 8,
          symbol: 'cross',
        },
        text: ['X* (Min)'],
        textposition: 'bottom center',
        textfont: { color: '#166534', size: 11, family: 'Inter', weight: 600 },
      });
    }

    const layout: any = {
      paper_bgcolor: '#FFFFFF',
      plot_bgcolor: '#FFFFFF',
      margin: { l: 10, r: 10, t: 25, b: 10 },
      scene: {
        xaxis: {
          title: 'x',
          color: '#4B5563',
          gridcolor: '#E5E7EB',
          backgroundcolor: '#F9FAFB',
        },
        yaxis: {
          title: 'y',
          color: '#4B5563',
          gridcolor: '#E5E7EB',
          backgroundcolor: '#F9FAFB',
        },
        zaxis: {
          title: 'f(x, y)',
          color: '#4B5563',
          gridcolor: '#E5E7EB',
          backgroundcolor: '#F9FAFB',
        },
        camera: {
          eye: { x: 1.5, y: -1.5, z: 1.2 },
        },
      },
      legend: {
        x: 0,
        y: 1.05,
        orientation: 'h',
        font: { color: '#374151', size: 11, family: 'Inter' },
        bgcolor: 'transparent',
      },
      autosize: true,
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
    };

    Plotly.react(containerRef.current, traces, layout, config);
  }, [surfaceGrid, iterations, currentIteration, x0, knownMinimum, obj]);

  return (
    <div className="w-full h-full min-h-[480px] bg-white rounded-lg border border-[#E5E7EB] p-2 flex flex-col">
      <div ref={containerRef} className="w-full h-full flex-1" />
    </div>
  );
};
