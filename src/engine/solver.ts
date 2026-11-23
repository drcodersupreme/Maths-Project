import { CompiledObjective, prepareObjective, classifyStationaryPoint } from './symbolic';
import { computeStepSize, formatNum } from './linesearch';
import {
  OptimizationResult,
  SolverOptions,
  IterationDetail,
  ExecutionStep,
  TerminationReason,
  MathStepsLatex,
} from '../types/optimization';

/**
 * Builds the comprehensive 12-step mathematical derivation in KaTeX for a single iteration
 */
function buildMathSteps(
  k: number,
  xk: [number, number],
  fxk: number,
  gk: [number, number],
  dk: [number, number],
  alpha: number,
  phiAlphaLatex: string,
  dphiAlphaLatex: string,
  nextXk: [number, number],
  nextFxk: number,
  nextGk: [number, number],
  nextNorm: number,
  tolerance: number,
  converged: boolean,
  obj: CompiledObjective
): MathStepsLatex {
  const [x, y] = xk;
  const [gx, gy] = gk;
  const [dx, dy] = dk;
  const [nx, ny] = nextXk;
  const [ngx, ngy] = nextGk;
  const gradNorm = Math.sqrt(gx * gx + gy * gy);

  // Step 1: Coordinates
  const step1Coordinates = `X_{${k}} = \\begin{bmatrix} x_{${k}} \\\\ y_{${k}} \\end{bmatrix} = \\begin{bmatrix} ${formatNum(x, 6)} \\\\ ${formatNum(y, 6)} \\end{bmatrix}`;

  // Step 2: Function Value
  const step2FunctionValue = `f(X_{${k}}) = f(${formatNum(x, 4)}, ${formatNum(y, 4)}) = ${formatNum(fxk, 6)}`;

  // Step 3: Partial Derivatives
  const step3PartialDerivatives = `\\frac{\\partial f}{\\partial x} = ${obj.gradientFormula.gxLatex} = ${formatNum(gx, 6)}, \\quad \\frac{\\partial f}{\\partial y} = ${obj.gradientFormula.gyLatex} = ${formatNum(gy, 6)}`;

  // Step 4: Gradient Vector
  const step4GradientVector = `g_{${k}} = \\nabla f(X_{${k}}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x} \\\\ \\frac{\\partial f}{\\partial y} \\end{bmatrix} = \\begin{bmatrix} ${formatNum(gx, 6)} \\\\ ${formatNum(gy, 6)} \\end{bmatrix}, \\quad \\|g_{${k}}\\| = \\sqrt{(${formatNum(gx, 4)})^2 + (${formatNum(gy, 4)})^2} = ${formatNum(gradNorm, 6)}`;

  // Step 5: Search Direction
  const step5SearchDirection = `d_{${k}} = -g_{${k}} = -\\begin{bmatrix} ${formatNum(gx, 6)} \\\\ ${formatNum(gy, 6)} \\end{bmatrix} = \\begin{bmatrix} ${formatNum(dx, 6)} \\\\ ${formatNum(dy, 6)} \\end{bmatrix}`;

  // Step 6: Line Search Function
  const step6PhiAlpha = `\\phi(\\alpha) = f(X_{${k}} + \\alpha d_{${k}}) = f\\left( ${formatNum(x, 4)} + (${formatNum(dx, 4)})\\alpha, \\; ${formatNum(y, 4)} + (${formatNum(dy, 4)})\\alpha \\right) \\implies ${phiAlphaLatex}`;

  // Step 7: Derivative of phi(alpha)
  const step7DphiAlpha = `\\frac{d\\phi(\\alpha)}{d\\alpha} = \\nabla f(X_{${k}} + \\alpha d_{${k}})^T d_{${k}} \\implies ${dphiAlphaLatex}`;

  // Step 8: Alpha Calculation
  const step8AlphaCalculation = `\\frac{d\\phi(\\alpha)}{d\\alpha} = 0 \\implies \\alpha_{${k}} = ${formatNum(alpha, 6)}`;

  // Step 9: Updated Coordinates
  const step9CoordinateUpdate = `X_{${k + 1}} = X_{${k}} + \\alpha_{${k}} d_{${k}} = \\begin{bmatrix} ${formatNum(x, 6)} \\\\ ${formatNum(y, 6)} \\end{bmatrix} + (${formatNum(alpha, 6)}) \\begin{bmatrix} ${formatNum(dx, 6)} \\\\ ${formatNum(dy, 6)} \\end{bmatrix} = \\begin{bmatrix} ${formatNum(nx, 6)} \\\\ ${formatNum(ny, 6)} \\end{bmatrix}`;

  // Step 10: New Function Value
  const step10NewFunctionValue = `f(X_{${k + 1}}) = f(${formatNum(nx, 4)}, ${formatNum(ny, 4)}) = ${formatNum(nextFxk, 6)} \\quad (\\Delta f = ${formatNum(nextFxk - fxk, 6)})`;

  // Step 11: New Gradient and Norm
  const step11NewGradient = `g_{${k + 1}} = \\nabla f(X_{${k + 1}}) = \\begin{bmatrix} ${formatNum(ngx, 6)} \\\\ ${formatNum(ngy, 6)} \\end{bmatrix}, \\quad \\|g_{${k + 1}}\\| = ${formatNum(nextNorm, 6)}`;

  // Step 12: Convergence Check
  const step12ConvergenceCheck = `\\|g_{${k + 1}}\\| = ${formatNum(nextNorm, 6)} ${converged ? '<' : '\\ge'} \\varepsilon = ${tolerance} \\implies \\text{${converged ? 'Convergence Criterion Satisfied! Terminate.' : 'Convergence Not Reached. Proceed to Next Iteration.'}}`;

  return {
    step1Coordinates,
    step2FunctionValue,
    step3PartialDerivatives,
    step4GradientVector,
    step5SearchDirection,
    step6PhiAlpha,
    step7DphiAlpha,
    step8AlphaCalculation,
    step9CoordinateUpdate,
    step10NewFunctionValue,
    step11NewGradient,
    step12ConvergenceCheck,
  };
}

/**
 * Executes the complete Steepest Descent Algorithm with exact mathematical tracking
 */
export function solveSteepestDescent(options: SolverOptions): OptimizationResult {
  const {
    fnExpr,
    x0,
    maxIterations,
    tolerance,
    lineSearchMethod,
    fixedAlpha,
    armijoRho,
    armijoC1,
  } = options;

  const obj = prepareObjective(fnExpr);

  let currentX: [number, number] = [x0[0], x0[1]];
  let currentF = obj.evaluate(currentX[0], currentX[1]);
  let [gx, gy] = obj.evaluateGradient(currentX[0], currentX[1]);
  let gradNorm = Math.sqrt(gx * gx + gy * gy);

  const iterations: IterationDetail[] = [];
  const executionTrace: ExecutionStep[] = [];
  let stepIndexCounter = 0;

  // Initial step 0 execution trace
  executionTrace.push({
    stepIndex: stepIndexCounter++,
    iteration: 0,
    phase: 'START',
    codeSnippet: 'let currentX: [number, number] = [x0[0], x0[1]];',
    codeLineNumbers: [45, 45],
    title: 'Initialize Algorithm',
    description: `Initialize search at starting vector X₀ = [${x0[0]}, ${x0[1]}]ᵀ with tolerance ε = ${tolerance}.`,
    formulaLatex: `X_0 = \\begin{bmatrix} ${x0[0]} \\\\ ${x0[1]} \\end{bmatrix}`,
    variables: {
      k: 0,
      x: currentX[0],
      y: currentX[1],
      f: currentF,
      gx,
      gy,
      gradNorm,
      dx: -gx,
      dy: -gy,
      alpha: 0,
    },
    outputSummary: `Initialized at (${x0[0]}, ${x0[1]}) with f(X₀) = ${formatNum(currentF, 6)}.`,
  });

  // Check initial gradient norm: if ||∇f(X0)|| < ε, initial point is already a stationary point
  if (gradNorm < tolerance) {
    const classification = classifyStationaryPoint(obj.evaluateHessian, currentX);

    executionTrace.push({
      stepIndex: stepIndexCounter++,
      iteration: 0,
      phase: 'CLASSIFY',
      codeSnippet: 'if (gradNorm < tolerance) { return classifyStationaryPoint(...); }',
      codeLineNumbers: [70, 75],
      title: 'Initial Point Already Stationary',
      description: `||∇f(X₀)|| = ${formatNum(gradNorm, 6)} < ε. Initial point is already stationary! Classified via Hessian matrix.`,
      formulaLatex: `\\|\\nabla f(X_0)\\| = ${formatNum(gradNorm, 6)} < \\varepsilon = ${tolerance}`,
      variables: {
        k: 0,
        x: currentX[0],
        y: currentX[1],
        f: currentF,
        gx,
        gy,
        gradNorm,
        dx: 0,
        dy: 0,
        alpha: 0,
      },
      outputSummary: `Stationary point at X₀: ${classification.type}.`,
    });

    return {
      options,
      iterations: [],
      converged: true,
      terminationReason: 'INITIAL_POINT_CONVERGED',
      totalIterations: 0,
      finalPoint: currentX,
      finalValue: currentF,
      finalGradientNorm: gradNorm,
      stationaryClassification: classification,
      gradientFormula: obj.gradientFormula,
      hessianFormula: obj.hessianFormula,
      executionTrace,
    };
  }

  let converged = false;
  let terminationReason: TerminationReason = 'MAX_ITERATIONS_REACHED';

  for (let k = 0; k < maxIterations; k++) {
    // Current iteration values
    const [x, y] = currentX;
    const [cgx, cgy] = [gx, gy];
    const cGradNorm = gradNorm;
    const [dx, dy]: [number, number] = [-cgx, -cgy];

    // Execution trace: Compute Gradient
    executionTrace.push({
      stepIndex: stepIndexCounter++,
      iteration: k,
      phase: 'COMPUTE_GRAD',
      codeSnippet: 'const [gx, gy] = obj.evaluateGradient(x, y);',
      codeLineNumbers: [88, 90],
      title: `Iteration ${k}: Compute Gradient Vector`,
      description: `Evaluate partial derivatives ∂f/∂x and ∂f/∂y at X_${k} = (${formatNum(x, 4)}, ${formatNum(y, 4)}).`,
      formulaLatex: `g_{${k}} = \\nabla f(X_{${k}}) = \\begin{bmatrix} ${formatNum(cgx, 4)} \\\\ ${formatNum(cgy, 4)} \\end{bmatrix}`,
      variables: {
        k,
        x,
        y,
        f: currentF,
        gx: cgx,
        gy: cgy,
        gradNorm: cGradNorm,
        dx,
        dy,
        alpha: 0,
      },
      outputSummary: `Gradient g_${k} = [${formatNum(cgx, 4)}, ${formatNum(cgy, 4)}]ᵀ, ||g_${k}|| = ${formatNum(cGradNorm, 4)}.`,
    });

    // Execution trace: Compute Direction
    executionTrace.push({
      stepIndex: stepIndexCounter++,
      iteration: k,
      phase: 'COMPUTE_DIR',
      codeSnippet: 'const direction: [number, number] = [-gx, -gy];',
      codeLineNumbers: [92, 92],
      title: `Iteration ${k}: Determine Steepest Descent Direction`,
      description: 'Direction of steepest decrease is opposite to gradient: d = -∇f(X).',
      formulaLatex: `d_{${k}} = -g_{${k}} = \\begin{bmatrix} ${formatNum(dx, 4)} \\\\ ${formatNum(dy, 4)} \\end{bmatrix}`,
      variables: {
        k,
        x,
        y,
        f: currentF,
        gx: cgx,
        gy: cgy,
        gradNorm: cGradNorm,
        dx,
        dy,
        alpha: 0,
      },
      outputSummary: `Search direction d_${k} = [${formatNum(dx, 4)}, ${formatNum(dy, 4)}]ᵀ.`,
    });

    // Compute step size alpha
    const lineSearchResult = computeStepSize(
      lineSearchMethod,
      obj,
      currentX,
      [cgx, cgy],
      [dx, dy],
      { fixedAlpha, armijoRho, armijoC1 }
    );

    const alpha = lineSearchResult.alpha;

    if (!lineSearchResult.success || alpha <= 0 || !isFinite(alpha)) {
      terminationReason = 'LINE_SEARCH_FAILED';
      break;
    }

    // Execution trace: Line Search
    executionTrace.push({
      stepIndex: stepIndexCounter++,
      iteration: k,
      phase: 'LINE_SEARCH',
      codeSnippet: 'const lineSearchResult = computeStepSize(method, obj, currentX, gk, dk);',
      codeLineNumbers: [98, 104],
      title: `Iteration ${k}: Solve Line Search for Step Size α`,
      description: `${lineSearchResult.message || 'Compute step size along direction d.'}`,
      formulaLatex: lineSearchResult.phiAlphaLatex
        ? `${lineSearchResult.phiAlphaLatex} \\implies \\alpha_{${k}} = ${formatNum(alpha, 6)}`
        : `\\alpha_{${k}} = ${formatNum(alpha, 6)}`,
      variables: {
        k,
        x,
        y,
        f: currentF,
        gx: cgx,
        gy: cgy,
        gradNorm: cGradNorm,
        dx,
        dy,
        alpha,
      },
      outputSummary: `Computed α_${k} = ${formatNum(alpha, 6)}.`,
    });

    // Compute updated coordinates
    const nextX: [number, number] = [x + alpha * dx, y + alpha * dy];

    if (!isFinite(nextX[0]) || !isFinite(nextX[1])) {
      terminationReason = 'NUMERICAL_OVERFLOW';
      break;
    }

    const nextF = obj.evaluate(nextX[0], nextX[1]);
    const nextG = obj.evaluateGradient(nextX[0], nextX[1]);
    const nextGradNorm = Math.sqrt(nextG[0] * nextG[0] + nextG[1] * nextG[1]);

    const isConvergedHere = nextGradNorm < tolerance;

    // Execution trace: Update X
    executionTrace.push({
      stepIndex: stepIndexCounter++,
      iteration: k,
      phase: 'UPDATE_X',
      codeSnippet: 'currentX = [x + alpha * dx, y + alpha * dy];',
      codeLineNumbers: [110, 112],
      title: `Iteration ${k}: Update Point Coordinates`,
      description: `Move along d_${k} with step size α_${k}: X_${k+1} = X_${k} + α_${k} d_${k}.`,
      formulaLatex: `X_{${k+1}} = \\begin{bmatrix} ${formatNum(nextX[0], 4)} \\\\ ${formatNum(nextX[1], 4)} \\end{bmatrix}, \\; f(X_{${k+1}}) = ${formatNum(nextF, 4)}`,
      variables: {
        k,
        x,
        y,
        f: currentF,
        gx: cgx,
        gy: cgy,
        gradNorm: cGradNorm,
        dx,
        dy,
        alpha,
        nextX: nextX[0],
        nextY: nextX[1],
        nextF,
      },
      outputSummary: `Updated to (${formatNum(nextX[0], 4)}, ${formatNum(nextX[1], 4)}), f = ${formatNum(nextF, 4)}.`,
    });

    // Execution trace: Convergence Check
    executionTrace.push({
      stepIndex: stepIndexCounter++,
      iteration: k,
      phase: 'CHECK_CONV',
      codeSnippet: 'if (nextGradNorm < tolerance) { converged = true; break; }',
      codeLineNumbers: [118, 122],
      title: `Iteration ${k}: Test Convergence Condition`,
      description: `Check ||∇f(X_${k+1})|| < ε: ${formatNum(nextGradNorm, 6)} ${isConvergedHere ? '<' : '≥'} ${tolerance}.`,
      formulaLatex: `\\|g_{${k+1}}\\| = ${formatNum(nextGradNorm, 6)} \\; ${isConvergedHere ? '<' : '\\ge'} \\; \\varepsilon = ${tolerance}`,
      variables: {
        k,
        x: nextX[0],
        y: nextX[1],
        f: nextF,
        gx: nextG[0],
        gy: nextG[1],
        gradNorm: nextGradNorm,
        dx: -nextG[0],
        dy: -nextG[1],
        alpha,
      },
      outputSummary: isConvergedHere
        ? `Converged at iteration ${k + 1}! ||∇f|| = ${formatNum(nextGradNorm, 6)} < ε.`
        : `Not converged yet (||∇f|| = ${formatNum(nextGradNorm, 6)} ≥ ε). Continuing...`,
    });

    // Build the 12-step LaTeX mathematical breakdown
    const mathSteps = buildMathSteps(
      k,
      currentX,
      currentF,
      [cgx, cgy],
      [dx, dy],
      alpha,
      lineSearchResult.phiAlphaLatex ?? `\\phi(\\alpha) = f(X_{${k}} + \\alpha d_{${k}})`,
      lineSearchResult.dphiAlphaLatex ?? `\\frac{d\\phi}{d\\alpha} = 0`,
      nextX,
      nextF,
      nextG,
      nextGradNorm,
      tolerance,
      isConvergedHere,
      obj
    );

    iterations.push({
      k,
      xk: currentX,
      fxk: currentF,
      gx: cgx,
      gy: cgy,
      gradient: [cgx, cgy],
      gradientNorm: cGradNorm,
      direction: [dx, dy],
      alpha,
      lineSearchType: lineSearchResult.lineSearchType,
      phiAlphaExpr: lineSearchResult.phiAlphaExpr,
      phiAlphaLatex: lineSearchResult.phiAlphaLatex,
      dphiAlphaExpr: lineSearchResult.dphiAlphaExpr,
      dphiAlphaLatex: lineSearchResult.dphiAlphaLatex,
      lineSearchTrials: lineSearchResult.trials,
      nextXk: nextX,
      nextFxk: nextF,
      nextGradient: nextG,
      nextGradientNorm: nextGradNorm,
      convergedHere: isConvergedHere,
      mathStepsLatex: mathSteps,
    });

    // Advance to next iteration
    currentX = nextX;
    currentF = nextF;
    [gx, gy] = nextG;
    gradNorm = nextGradNorm;

    if (isConvergedHere) {
      converged = true;
      terminationReason = 'CONVERGED_GRADIENT_NORM';
      break;
    }
  }

  // Stationary point classification at final point
  const stationaryClassification = classifyStationaryPoint(obj.evaluateHessian, currentX);

  if (converged) {
    executionTrace.push({
      stepIndex: stepIndexCounter++,
      iteration: iterations.length,
      phase: 'CLASSIFY',
      codeSnippet: 'const stationaryClassification = classifyStationaryPoint(obj.evaluateHessian, currentX);',
      codeLineNumbers: [142, 145],
      title: 'Classify Converged Stationary Point via Hessian Matrix',
      description: stationaryClassification.explanation,
      formulaLatex: `H(X^*) = \\begin{bmatrix} ${formatNum(stationaryClassification.fxx, 4)} & ${formatNum(stationaryClassification.fxy, 4)} \\\\ ${formatNum(stationaryClassification.fxy, 4)} & ${formatNum(stationaryClassification.fyy, 4)} \\end{bmatrix}, \\; \\det(H) = ${formatNum(stationaryClassification.det, 4)}`,
      variables: {
        k: iterations.length,
        x: currentX[0],
        y: currentX[1],
        f: currentF,
        gx,
        gy,
        gradNorm,
        dx: 0,
        dy: 0,
        alpha: 0,
      },
      outputSummary: `Classification: ${stationaryClassification.type}`,
    });
  }

  executionTrace.push({
    stepIndex: stepIndexCounter++,
    iteration: iterations.length,
    phase: 'TERMINATED',
    codeSnippet: 'return { options, iterations, converged, terminationReason, ... };',
    codeLineNumbers: [150, 165],
    title: 'Optimization Process Terminated',
    description: `Process concluded with status: ${terminationReason}. Total iterations completed: ${iterations.length}.`,
    formulaLatex: `X^* = \\begin{bmatrix} ${formatNum(currentX[0], 6)} \\\\ ${formatNum(currentX[1], 6)} \\end{bmatrix}, \\; f(X^*) = ${formatNum(currentF, 6)}`,
    variables: {
      k: iterations.length,
      x: currentX[0],
      y: currentX[1],
      f: currentF,
      gx,
      gy,
      gradNorm,
      dx: 0,
      dy: 0,
      alpha: 0,
    },
    outputSummary: `Terminated with status ${terminationReason}.`,
  });

  return {
    options,
    iterations,
    converged,
    terminationReason,
    totalIterations: iterations.length,
    finalPoint: currentX,
    finalValue: currentF,
    finalGradientNorm: gradNorm,
    stationaryClassification,
    gradientFormula: obj.gradientFormula,
    hessianFormula: obj.hessianFormula,
    executionTrace,
  };
}
