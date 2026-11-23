import { PresetProblem } from '../types/optimization';

export const PRESET_PROBLEMS: PresetProblem[] = [
  {
    id: 'example1',
    title: 'Example 1: Circular Quadratic Basin (Sphere)',
    category: 'Ideal Condition (κ = 1)',
    formula: 'x^2 + y^2 - 4x - 6y',
    x0: [0, 0],
    tolerance: 1e-5,
    maxIterations: 20,
    lineSearchMethod: 'exact',
    knownMinimum: {
      point: [2, 3],
      value: -13,
      pointLatex: '(2, 3)',
      valueLatex: '-13',
    },
    description:
      'A symmetric paraboloid with circular contour lines. Hessian eigenvalues are equal (λ₁ = λ₂ = 2). The negative gradient points directly at the unconstrained minimum, converging in exactly 1 iteration.',
    learningObjective:
      'Observe ideal convergence when condition number κ = 1. No zigzagging occurs.',
  },
  {
    id: 'example2',
    title: 'Example 2: Elliptic Quadratic (Zigzagging)',
    category: 'Anisotropic Valley (κ = 4)',
    formula: 'x^2 + 4y^2 - 4x - 8y',
    x0: [0, 0],
    tolerance: 1e-5,
    maxIterations: 40,
    lineSearchMethod: 'exact',
    knownMinimum: {
      point: [2, 1],
      value: -8,
      pointLatex: '(2, 1)',
      valueLatex: '-8',
    },
    description:
      'An elliptical bowl elongated along the x-axis. Because the curvature along y (fyy = 8) is 4 times steeper than along x (fxx = 2), consecutive search directions bounce perpendicularly across the valley in a classic zigzag pattern.',
    learningObjective:
      'Witness the orthogonal zigzagging phenomenon where d_{k+1} ⊥ d_k, slowing down convergence.',
  },
  {
    id: 'example3',
    title: 'Example 3: Coupled Quadratic with Cross-Term xy',
    category: 'Rotated Ellipse (Cross-Term)',
    formula: 'x^2 + xy + 2y^2 - 6x - 8y',
    x0: [1, 1],
    tolerance: 1e-5,
    maxIterations: 60,
    lineSearchMethod: 'exact',
    knownMinimum: {
      point: [16 / 7, 10 / 7],
      value: -88 / 7,
      pointLatex: '\\left(\\frac{16}{7}, \\frac{10}{7}\\right) \\approx (2.2857, 1.4286)',
      valueLatex: '-\\frac{88}{7} \\approx -12.5714',
    },
    description:
      'A coupled quadratic function containing cross-term xy, which rotates the principal elliptical axes. The analytical minimum is obtained by solving 2x + y = 6 and x + 4y = 8 simultaneously.',
    learningObjective:
      'Verify how Steepest Descent handles coupled variables with off-diagonal Hessian entries.',
  },
  {
    id: 'example4',
    title: 'Example 4: Rosenbrock Curved Valley (Banana Function)',
    category: 'Non-Convex Valley',
    formula: '(1 - x)^2 + 10 * (y - x^2)^2',
    x0: [-0.5, 0.5],
    tolerance: 1e-4,
    maxIterations: 100,
    lineSearchMethod: 'backtracking',
    fixedAlpha: 0.8,
    knownMinimum: {
      point: [1, 1],
      value: 0,
      pointLatex: '(1, 1)',
      valueLatex: '0',
    },
    description:
      'Classic non-linear benchmark function with a steep parabolic valley. The bottom of the valley curves along y = x². Tests numerical Armijo backtracking line search on a non-quadratic landscape.',
    learningObjective:
      'Observe performance on non-linear curved valleys where exact quadratic line search is not applicable.',
  },
];
