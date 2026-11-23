import * as math from 'mathjs';
import { CompiledObjective } from './symbolic';
import { LineSearchResult, LineSearchTrial, LineSearchMethod } from '../types/optimization';

/**
 * Format numbers cleanly for LaTeX rendering
 */
export function formatNum(n: number, decimals: number = 4): string {
  if (Math.abs(n) < 1e-12) return '0';
  if (Math.abs(n) >= 1e4 || Math.abs(n) < 1e-3) {
    return n.toExponential(decimals);
  }
  return Number(n.toFixed(decimals)).toString();
}

/**
 * Formats a polynomial c2 * a^2 + c1 * a + c0 cleanly into LaTeX
 */
export function formatQuadraticLatex(c2: number, c1: number, c0: number): string {
  const parts: string[] = [];

  // c2 * a^2
  if (Math.abs(c2) > 1e-9) {
    const coeff = Math.abs(c2 - 1) < 1e-9 ? '' : Math.abs(c2 + 1) < 1e-9 ? '-' : formatNum(c2);
    parts.push(`${coeff}\\alpha^2`);
  }

  // c1 * a
  if (Math.abs(c1) > 1e-9) {
    const sign = parts.length > 0 ? (c1 > 0 ? '+' : '-') : (c1 < 0 ? '-' : '');
    const absVal = Math.abs(c1);
    const coeff = Math.abs(absVal - 1) < 1e-9 ? '' : formatNum(absVal);
    parts.push(`${sign} ${coeff}\\alpha`.trim());
  }

  // c0
  if (Math.abs(c0) > 1e-9 || parts.length === 0) {
    const sign = parts.length > 0 ? (c0 > 0 ? '+' : '-') : (c0 < 0 ? '-' : '');
    parts.push(`${sign} ${formatNum(Math.abs(c0))}`.trim());
  }

  return parts.join(' ');
}

/**
 * Performs exact analytical line search for quadratic functions or approximations
 */
export function exactLineSearch(
  obj: CompiledObjective,
  xk: [number, number],
  gk: [number, number],
  dk: [number, number]
): LineSearchResult {
  const [x, y] = xk;
  const [gx, gy] = gk;
  const [dx, dy] = dk;
  const fxk = obj.evaluate(x, y);

  // Compute Hessian at current point
  const { fxx, fyy, fxy } = obj.evaluateHessian(x, y);

  // d^T * H * d
  const dTHd = dx * (fxx * dx + fxy * dy) + dy * (fxy * dx + fyy * dy);
  // g^T * g = ||g||^2
  const gradNormSq = gx * gx + gy * gy;

  // c0 = f(Xk)
  // c1 = g^T * d = -||g||^2
  // c2 = 0.5 * d^T * H * d
  const c0 = fxk;
  const c1 = -gradNormSq;
  const c2 = 0.5 * dTHd;

  const phiAlphaLatex = `\\phi(\\alpha) = ${formatQuadraticLatex(c2, c1, c0)}`;
  const dphiAlphaLatex = `\\frac{d\\phi}{d\\alpha} = ${formatNum(2 * c2)}\\alpha ${c1 >= 0 ? '+' : '-'} ${formatNum(Math.abs(c1))}`;

  // If d^T * H * d > 0, the 1D function is strictly convex with a unique global minimum
  if (dTHd > 1e-12) {
    const alphaStar = gradNormSq / dTHd;
    const nextPt: [number, number] = [x + alphaStar * dx, y + alphaStar * dy];
    const nextF = obj.evaluate(nextPt[0], nextPt[1]);

    const trial: LineSearchTrial = {
      trialIndex: 0,
      alpha: alphaStar,
      trialPoint: nextPt,
      trialF: nextF,
      armijoThreshold: fxk - 1e-4 * alphaStar * gradNormSq,
      satisfied: nextF < fxk,
    };

    // Also attempt symbolic mathjs expansion for exact display of phi(a)
    let symbolicPhi = '';
    let symbolicDphi = '';
    try {
      // Substitute x = (x0 + a*dx) and y = (y0 + a*dy)
      const subX = `(${formatNum(x, 6)} + a * (${formatNum(dx, 6)}))`;
      const subY = `(${formatNum(y, 6)} + a * (${formatNum(dy, 6)}))`;
      const replaced = obj.fnExpr
        .replace(/\bx\b/g, subX)
        .replace(/\by\b/g, subY);
      const parsedPhi = math.parse(replaced);
      const simplifiedPhi = math.simplify(parsedPhi);
      symbolicPhi = simplifiedPhi.toTex();
      const dphiNode = math.simplify(math.derivative(simplifiedPhi, 'a'));
      symbolicDphi = dphiNode.toTex();
    } catch {
      // Fallback to quadratic formula latex
      symbolicPhi = phiAlphaLatex;
      symbolicDphi = dphiAlphaLatex;
    }

    return {
      alpha: alphaStar,
      lineSearchType: 'exact_analytical',
      phiAlphaExpr: `phi(a) = ${c2.toFixed(6)}*a^2 + (${c1.toFixed(6)})*a + ${c0.toFixed(6)}`,
      phiAlphaLatex: symbolicPhi || phiAlphaLatex,
      dphiAlphaExpr: `dphi/da = ${(2 * c2).toFixed(6)}*a + (${c1.toFixed(6)})`,
      dphiAlphaLatex: symbolicDphi || dphiAlphaLatex,
      trials: [trial],
      success: true,
      message: 'Exact analytical line search: minimized quadratic along search direction (dφ/dα = 0).',
    };
  }

  // If dTHd <= 0, the function is concave or flat in this direction; fallback to Armijo backtracking
  const fallback = backtrackingLineSearch(obj, xk, gk, dk, 1.0, 0.5, 1e-4);
  return {
    ...fallback,
    message: 'Analytical line search curvature non-positive (d^T H d ≤ 0); switched to Armijo backtracking.',
  };
}

/**
 * Performs Armijo Backtracking Line Search
 * Condition: f(Xk + alpha * dk) <= f(Xk) + c1 * alpha * (gk^T dk)
 */
export function backtrackingLineSearch(
  obj: CompiledObjective,
  xk: [number, number],
  gk: [number, number],
  dk: [number, number],
  initialAlpha: number = 1.0,
  rho: number = 0.5,
  c1: number = 1e-4
): LineSearchResult {
  const [x, y] = xk;
  const [gx, gy] = gk;
  const [dx, dy] = dk;
  const fxk = obj.evaluate(x, y);

  // Directional derivative: gk^T * dk
  // Since dk = -gk for steepest descent, gk^T * dk = -||gk||^2 <= 0
  const dirDeriv = gx * dx + gy * dy;

  const trials: LineSearchTrial[] = [];
  let alpha = initialAlpha;
  let trialIndex = 0;
  const maxTrials = 40;

  while (trialIndex < maxTrials) {
    const trialX: [number, number] = [x + alpha * dx, y + alpha * dy];
    const trialF = obj.evaluate(trialX[0], trialX[1]);
    const armijoThreshold = fxk + c1 * alpha * dirDeriv;
    const satisfied = trialF <= armijoThreshold + 1e-12;

    trials.push({
      trialIndex,
      alpha,
      trialPoint: trialX,
      trialF,
      armijoThreshold,
      satisfied,
    });

    if (satisfied) {
      return {
        alpha,
        lineSearchType: 'backtracking',
        trials,
        success: true,
        message: `Armijo condition satisfied at trial ${trialIndex + 1} with α = ${formatNum(alpha)}.`,
      };
    }

    alpha *= rho;
    trialIndex++;

    if (alpha < 1e-16) break;
  }

  return {
    alpha: trials[trials.length - 1]?.alpha ?? 1e-4,
    lineSearchType: 'backtracking',
    trials,
    success: false,
    message: 'Backtracking line search failed to satisfy Armijo condition within maximum trials.',
  };
}

/**
 * Fixed step-size selection
 */
export function fixedStepLineSearch(
  obj: CompiledObjective,
  xk: [number, number],
  gk: [number, number],
  dk: [number, number],
  fixedAlpha: number
): LineSearchResult {
  const [x, y] = xk;
  const [dx, dy] = dk;
  const fxk = obj.evaluate(x, y);
  const trialPoint: [number, number] = [x + fixedAlpha * dx, y + fixedAlpha * dy];
  const trialF = obj.evaluate(trialPoint[0], trialPoint[1]);
  const satisfied = trialF < fxk;

  const trial: LineSearchTrial = {
    trialIndex: 0,
    alpha: fixedAlpha,
    trialPoint,
    trialF,
    armijoThreshold: fxk,
    satisfied,
  };

  return {
    alpha: fixedAlpha,
    lineSearchType: 'fixed',
    trials: [trial],
    success: satisfied,
    message: satisfied
      ? `Fixed step size α = ${fixedAlpha} decreased function value.`
      : `Fixed step size α = ${fixedAlpha} caused function value to increase (f_new > f_old).`,
  };
}

/**
 * Dispatcher for step-size computation based on method
 */
export function computeStepSize(
  method: LineSearchMethod,
  obj: CompiledObjective,
  xk: [number, number],
  gk: [number, number],
  dk: [number, number],
  options?: { fixedAlpha?: number; armijoRho?: number; armijoC1?: number }
): LineSearchResult {
  if (method === 'exact') {
    return exactLineSearch(obj, xk, gk, dk);
  } else if (method === 'backtracking') {
    return backtrackingLineSearch(
      obj,
      xk,
      gk,
      dk,
      options?.fixedAlpha ?? 1.0,
      options?.armijoRho ?? 0.5,
      options?.armijoC1 ?? 1e-4
    );
  } else {
    return fixedStepLineSearch(obj, xk, gk, dk, options?.fixedAlpha ?? 0.1);
  }
}
