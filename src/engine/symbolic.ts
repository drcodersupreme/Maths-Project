import * as math from 'mathjs';
import { StationaryPointClassification } from '../types/optimization';

export interface CompiledObjective {
  fnExpr: string;
  fnLatex: string;
  evaluate: (x: number, y: number) => number;
  evaluateGradient: (x: number, y: number) => [number, number];
  evaluateHessian: (x: number, y: number) => { fxx: number; fyy: number; fxy: number };
  gradientFormula: {
    gx: string;
    gy: string;
    gxLatex: string;
    gyLatex: string;
  };
  hessianFormula: {
    fxx: string;
    fxy: string;
    fyy: string;
    fxxLatex: string;
    fxyLatex: string;
    fyyLatex: string;
  };
}

/**
 * Clean up expressions into legible LaTeX
 */
export function cleanLatex(node: math.MathNode): string {
  try {
    return node.toTex({ parenthesis: 'auto' });
  } catch {
    return node.toString();
  }
}

/**
 * Preprocesses formula expressions to support natural mathematical notation:
 * - xy -> x * y
 * - yx -> y * x
 * - 4x -> 4 * x
 * - ) ( -> ) * (
 */
export function sanitizeFormula(expr: string): string {
  let s = expr.trim();
  // Replace xy and yx with explicit multiplication, preserving functions
  s = s.replace(/\bxy\b/gi, 'x * y');
  s = s.replace(/\byx\b/gi, 'y * x');
  // Number followed immediately by variable: 2x -> 2 * x, 4y -> 4 * y
  s = s.replace(/(\d+)([xy])/gi, '$1 * $2');
  // Variable followed immediately by parenthesis: x( -> x * (
  s = s.replace(/([xy])\s*\(/gi, '$1 * (');
  // Parenthesis followed by variable: )x -> ) * x
  s = s.replace(/\)\s*([xy])/gi, ') * $1');
  return s;
}

/**
 * Prepares and compiles a 2-variable function f(x, y) with symbolic derivatives and Hessian
 */
export function prepareObjective(rawExpr: string): CompiledObjective {
  const sanitized = sanitizeFormula(rawExpr);
  const parsedNode = math.parse(sanitized);

  // Symbolic 1st derivatives
  const gxNode = math.derivative(parsedNode, 'x');
  const gyNode = math.derivative(parsedNode, 'y');

  // Simplify for display
  const simplifiedGx = math.simplify(gxNode);
  const simplifiedGy = math.simplify(gyNode);

  // Symbolic 2nd derivatives (Hessian entries)
  const fxxNode = math.simplify(math.derivative(gxNode, 'x'));
  const fyyNode = math.simplify(math.derivative(gyNode, 'y'));
  const fxyNode = math.simplify(math.derivative(gxNode, 'y'));

  // Compiled functions for maximum numerical evaluation performance
  const compiledF = parsedNode.compile();
  const compiledGx = gxNode.compile();
  const compiledGy = gyNode.compile();
  const compiledFxx = fxxNode.compile();
  const compiledFyy = fyyNode.compile();
  const compiledFxy = fxyNode.compile();

  const evaluate = (x: number, y: number): number => {
    try {
      const res = compiledF.evaluate({ x, y });
      if (typeof res === 'number') {
        if (!isFinite(res)) throw new Error('Non-finite evaluation');
        return res;
      }
      return Number(res);
    } catch (err) {
      throw new Error(`Failed to evaluate f(${x}, ${y}): ${(err as Error).message}`);
    }
  };

  const evaluateGradient = (x: number, y: number): [number, number] => {
    try {
      const gx = Number(compiledGx.evaluate({ x, y }));
      const gy = Number(compiledGy.evaluate({ x, y }));
      if (!isFinite(gx) || !isFinite(gy)) throw new Error('Gradient contains non-finite values');
      return [gx, gy];
    } catch (err) {
      throw new Error(`Failed to evaluate ∇f(${x}, ${y}): ${(err as Error).message}`);
    }
  };

  const evaluateHessian = (x: number, y: number): { fxx: number; fyy: number; fxy: number } => {
    try {
      const fxx = Number(compiledFxx.evaluate({ x, y }));
      const fyy = Number(compiledFyy.evaluate({ x, y }));
      const fxy = Number(compiledFxy.evaluate({ x, y }));
      return { fxx, fyy, fxy };
    } catch {
      // Fallback finite difference if symbolic 2nd derivative fails for exotic functions
      const h = 1e-5;
      const [gxP, gyP] = evaluateGradient(x + h, y);
      const [gxM] = evaluateGradient(x - h, y);
      const [, gyY] = evaluateGradient(x, y + h);
      const [, gyYM] = evaluateGradient(x, y - h);
      const fxx = (gxP - gxM) / (2 * h);
      const fyy = (gyY - gyYM) / (2 * h);
      const [gxYP] = evaluateGradient(x, y + h);
      const [gxYM] = evaluateGradient(x, y - h);
      const fxy = (gxYP - gxYM) / (2 * h);
      return { fxx, fyy, fxy };
    }
  };

  return {
    fnExpr: sanitized,
    fnLatex: cleanLatex(parsedNode),
    evaluate,
    evaluateGradient,
    evaluateHessian,
    gradientFormula: {
      gx: simplifiedGx.toString(),
      gy: simplifiedGy.toString(),
      gxLatex: cleanLatex(simplifiedGx),
      gyLatex: cleanLatex(simplifiedGy),
    },
    hessianFormula: {
      fxx: fxxNode.toString(),
      fxy: fxyNode.toString(),
      fyy: fyyNode.toString(),
      fxxLatex: cleanLatex(fxxNode),
      fxyLatex: cleanLatex(fxyNode),
      fyyLatex: cleanLatex(fyyNode),
    },
  };
}

/**
 * Classifies a stationary point (where ||∇f|| ≈ 0) via Hessian matrix eigenvalues and determinant
 */
export function classifyStationaryPoint(
  evaluateHessian: (x: number, y: number) => { fxx: number; fyy: number; fxy: number },
  point: [number, number]
): StationaryPointClassification {
  const { fxx, fyy, fxy } = evaluateHessian(point[0], point[1]);
  const det = fxx * fyy - fxy * fxy;
  const trace = fxx + fyy;

  // Eigenvalues of 2x2 symmetric matrix
  const discriminant = Math.max(0, trace * trace - 4 * det);
  const sqrtDisc = Math.sqrt(discriminant);
  const lambda1 = (trace + sqrtDisc) / 2;
  const lambda2 = (trace - sqrtDisc) / 2;

  let type: StationaryPointClassification['type'];
  let explanation = '';

  const tol = 1e-7;

  if (det > tol) {
    if (fxx > tol && lambda1 > 0 && lambda2 > 0) {
      type = 'LOCAL_MINIMUM';
      explanation = `Hessian determinant det(H) = ${det.toFixed(4)} > 0 and f_xx = ${fxx.toFixed(4)} > 0 (eigenvalues λ₁ = ${lambda1.toFixed(4)}, λ₂ = ${lambda2.toFixed(4)} > 0). The Hessian matrix is strictly Positive Definite (H ≻ 0). Thus, this stationary point is a strict local minimum.`;
    } else if (fxx < -tol && lambda1 < 0 && lambda2 < 0) {
      type = 'LOCAL_MAXIMUM';
      explanation = `Hessian determinant det(H) = ${det.toFixed(4)} > 0 and f_xx = ${fxx.toFixed(4)} < 0 (eigenvalues λ₁ = ${lambda1.toFixed(4)}, λ₂ = ${lambda2.toFixed(4)} < 0). The Hessian matrix is strictly Negative Definite (H ≺ 0). Thus, this stationary point is a strict local maximum.`;
    } else {
      type = 'INCONCLUSIVE';
      explanation = `Hessian determinant is positive but near boundary. Inconclusive second-order test.`;
    }
  } else if (det < -tol) {
    type = 'SADDLE_POINT';
    explanation = `Hessian determinant det(H) = ${det.toFixed(4)} < 0 (eigenvalues λ₁ = ${lambda1.toFixed(4)} and λ₂ = ${lambda2.toFixed(4)} have opposite signs). The Hessian matrix is Indefinite. Thus, this stationary point is a Saddle Point.`;
  } else {
    type = 'INCONCLUSIVE';
    explanation = `Hessian determinant det(H) ≈ 0. The second-derivative test is inconclusive (semidefinite Hessian). Higher-order derivatives or directional analysis are required.`;
  }

  return {
    type,
    fxx,
    fyy,
    fxy,
    det,
    trace,
    eigenvalues: [lambda1, lambda2],
    explanation,
  };
}
