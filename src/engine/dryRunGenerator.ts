export interface DryRunStep {
  title: string;
  mathLatex: string;
  explanation: string;
}

export interface DryRunProblem {
  id: string;
  problemTitle: string;
  functionExpr: string;
  functionLatex: string;
  startingPoint: [number, number];
  analyticalMinimum: {
    point: [number, number];
    pointFraction: string;
    value: number;
    valueFraction: string;
  };
  hessianAnalysis: {
    matrixLatex: string;
    determinant: string;
    eigenvalues: string;
    classification: string;
  };
  iteration0Steps: DryRunStep[];
  iteration1Steps: DryRunStep[];
  keyInsight: string;
}

export const PREDEFINED_DRY_RUNS: Record<string, DryRunProblem> = {
  example1: {
    id: 'example1',
    problemTitle: 'Example 1: Circular Quadratic Basin (Isotropic)',
    functionExpr: 'x^2 + y^2 - 4x - 6y',
    functionLatex: 'f(x,y) = x^2 + y^2 - 4x - 6y',
    startingPoint: [0, 0],
    analyticalMinimum: {
      point: [2, 3],
      pointFraction: '(2, 3)',
      value: -13,
      valueFraction: '-13',
    },
    hessianAnalysis: {
      matrixLatex: 'H = \\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix}',
      determinant: '\\det(H) = 2(2) - 0 = 4 > 0',
      eigenvalues: '\\lambda_1 = 2, \\; \\lambda_2 = 2 > 0',
      classification: 'Strict Local (and Global) Minimum (H ≻ 0, Condition number κ = 1)',
    },
    keyInsight:
      'Because the Hessian eigenvalues are identical (λ₁ = λ₂ = 2), the level curves are perfect circles (condition number κ = 1). The negative gradient points directly through the unconstrained minimizer, causing Steepest Descent with exact line search to converge in exactly 1 iteration!',
    iteration0Steps: [
      {
        title: '1. Evaluate Function at Starting Point X₀ = (0, 0)',
        mathLatex: 'f(0, 0) = 0^2 + 0^2 - 4(0) - 6(0) = 0',
        explanation: 'Substitute the starting coordinates x = 0, y = 0 into the objective function.',
      },
      {
        title: '2. Compute Analytical Partial Derivatives',
        mathLatex: '\\frac{\\partial f}{\\partial x} = 2x - 4, \\quad \\frac{\\partial f}{\\partial y} = 2y - 6',
        explanation: 'Differentiate f(x,y) partially with respect to x treating y as constant, and vice versa.',
      },
      {
        title: '3. Evaluate Gradient Vector g₀ at (0, 0)',
        mathLatex: 'g_0 = \\nabla f(0, 0) = \\begin{bmatrix} 2(0) - 4 \\\\ 2(0) - 6 \\end{bmatrix} = \\begin{bmatrix} -4 \\\\ -6 \\end{bmatrix}, \\quad \\|g_0\\| = \\sqrt{(-4)^2 + (-6)^2} = \\sqrt{52} \\approx 7.2111',
        explanation: 'Evaluate the partial derivatives at the current coordinates. The norm ||g₀|| is strictly greater than tolerance ε.',
      },
      {
        title: '4. Determine Search Direction d₀',
        mathLatex: 'd_0 = -g_0 = -\\begin{bmatrix} -4 \\\\ -6 \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 6 \\end{bmatrix}',
        explanation: 'Steepest descent always moves along the negative gradient direction.',
      },
      {
        title: '5. Formulate Line Search Function φ(α) = f(X₀ + α d₀)',
        mathLatex: 'x(\\alpha) = 0 + 4\\alpha = 4\\alpha, \\quad y(\\alpha) = 0 + 6\\alpha = 6\\alpha \\\\\n\\phi(\\alpha) = (4\\alpha)^2 + (6\\alpha)^2 - 4(4\\alpha) - 6(6\\alpha) = 16\\alpha^2 + 36\\alpha^2 - 16\\alpha - 36\\alpha = 52\\alpha^2 - 52\\alpha',
        explanation: 'Substitute the parameterized line equation into f(x,y) to convert the 2D optimization into a 1D optimization problem in α.',
      },
      {
        title: '6. Minimize φ(α) to Find Optimal Step Size α₀',
        mathLatex: '\\frac{d\\phi}{d\\alpha} = 104\\alpha - 52 = 0 \\implies 104\\alpha = 52 \\implies \\alpha_0 = \\frac{52}{104} = 0.5',
        explanation: 'Differentiate φ(α) with respect to α and set the derivative to zero (Exact Line Search condition).',
      },
      {
        title: '7. Update Coordinates X₁ = X₀ + α₀ d₀',
        mathLatex: 'X_1 = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} + 0.5 \\begin{bmatrix} 4 \\\\ 6 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix}',
        explanation: 'Take a step of length α₀ along the search direction d₀.',
      },
      {
        title: '8. Evaluate New Function Value f(X₁)',
        mathLatex: 'f(2, 3) = 2^2 + 3^2 - 4(2) - 6(3) = 4 + 9 - 8 - 18 = -13',
        explanation: 'The objective value decreased substantially from 0 to -13.',
      },
      {
        title: '9. Evaluate New Gradient g₁ and Test Convergence',
        mathLatex: 'g_1 = \\begin{bmatrix} 2(2) - 4 \\\\ 2(3) - 6 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}, \\quad \\|g_1\\| = 0 < \\varepsilon = 10^{-5}',
        explanation: 'The gradient norm is exactly zero. The algorithm successfully terminates at the global minimum (2, 3)!',
      },
    ],
    iteration1Steps: [],
  },

  example2: {
    id: 'example2',
    problemTitle: 'Example 2: Elongated Elliptic Quadratic (Anisotropic & Zigzagging)',
    functionExpr: 'x^2 + 4y^2 - 4x - 8y',
    functionLatex: 'f(x,y) = x^2 + 4y^2 - 4x - 8y',
    startingPoint: [0, 0],
    analyticalMinimum: {
      point: [2, 1],
      pointFraction: '(2, 1)',
      value: -8,
      valueFraction: '-8',
    },
    hessianAnalysis: {
      matrixLatex: 'H = \\begin{bmatrix} 2 & 0 \\\\ 0 & 8 \\end{bmatrix}',
      determinant: '\\det(H) = 2(8) - 0 = 16 > 0',
      eigenvalues: '\\lambda_1 = 2, \\; \\lambda_2 = 8 > 0',
      classification: 'Strict Local Minimum (Condition number κ = λ₂/λ₁ = 4)',
    },
    keyInsight:
      'The ratio of eigenvalues is κ = 4/1 = 4. The level curves are eccentric ellipses. Notice that the direction d₁ is precisely orthogonal to d₀ (d₁ · d₀ = 0), demonstrating the classic perpendicular zigzagging pattern of Steepest Descent!',
    iteration0Steps: [
      {
        title: '1. Evaluate Function at X₀ = (0, 0)',
        mathLatex: 'f(0, 0) = 0^2 + 4(0)^2 - 4(0) - 8(0) = 0',
        explanation: 'Compute baseline function value.',
      },
      {
        title: '2. Compute Gradient g₀',
        mathLatex: '\\frac{\\partial f}{\\partial x} = 2x - 4, \\quad \\frac{\\partial f}{\\partial y} = 8y - 8 \\implies g_0 = \\begin{bmatrix} -4 \\\\ -8 \\end{bmatrix}, \\; \\|g_0\\| = \\sqrt{16 + 64} = \\sqrt{80} \\approx 8.9443',
        explanation: 'Evaluate partial derivatives at (0, 0).',
      },
      {
        title: '3. Search Direction d₀',
        mathLatex: 'd_0 = -g_0 = \\begin{bmatrix} 4 \\\\ 8 \\end{bmatrix}',
        explanation: 'Direction of steepest descent.',
      },
      {
        title: '4. Exact Line Search φ(α)',
        mathLatex: 'x(\\alpha) = 4\\alpha, \\quad y(\\alpha) = 8\\alpha \\\\\n\\phi(\\alpha) = (4\\alpha)^2 + 4(8\\alpha)^2 - 4(4\\alpha) - 8(8\\alpha) = 16\\alpha^2 + 256\\alpha^2 - 16\\alpha - 64\\alpha = 272\\alpha^2 - 80\\alpha',
        explanation: 'Parametric function along search ray.',
      },
      {
        title: '5. Minimize φ(α)',
        mathLatex: '\\frac{d\\phi}{d\\alpha} = 544\\alpha - 80 = 0 \\implies \\alpha_0 = \\frac{80}{544} = \\frac{5}{34} \\approx 0.147059',
        explanation: 'Analytical step size.',
      },
      {
        title: '6. Update Point Coordinates X₁',
        mathLatex: 'X_1 = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} + \\frac{5}{34} \\begin{bmatrix} 4 \\\\ 8 \\end{bmatrix} = \\begin{bmatrix} \\frac{20}{34} \\\\ \\frac{40}{34} \\end{bmatrix} = \\begin{bmatrix} \\frac{10}{17} \\\\ \\frac{20}{17} \\end{bmatrix} \\approx \\begin{bmatrix} 0.5882 \\\\ 1.1765 \\end{bmatrix}',
        explanation: 'Updated coordinate vector.',
      },
      {
        title: '7. Evaluate f(X₁) and Gradient g₁',
        mathLatex: 'f(X_1) = \\left(\\frac{10}{17}\\right)^2 + 4\\left(\\frac{20}{17}\\right)^2 - 4\\left(\\frac{10}{17}\\right) - 8\\left(\\frac{20}{17}\\right) = -\\frac{100}{17} \\approx -5.8824 \\\\\ng_1 = \\begin{bmatrix} 2(\\frac{10}{17}) - 4 \\\\ 8(\\frac{20}{17}) - 8 \\end{bmatrix} = \\begin{bmatrix} -\\frac{48}{17} \\\\ \\frac{24}{17} \\end{bmatrix} \\approx \\begin{bmatrix} -2.8235 \\\\ 1.4118 \\end{bmatrix}, \\; \\|g_1\\| \\approx 3.1568',
        explanation: 'Function value drops to -5.8824. ||g₁|| > ε, so proceed to iteration 1.',
      },
    ],
    iteration1Steps: [
      {
        title: '8. Orthogonality Verification (Fundamental Theorem)',
        mathLatex: 'g_1^T d_0 = \\left(-\\frac{48}{17}\\right)(4) + \\left(\\frac{24}{17}\\right)(8) = -\\frac{192}{17} + \\frac{192}{17} = 0 \\implies g_1 \\perp d_0',
        explanation: 'At the exact minimum along a line, the gradient is always perpendicular to the search direction! This proves the step size was analytically exact.',
      },
      {
        title: '9. Determine Direction d₁',
        mathLatex: 'd_1 = -g_1 = \\begin{bmatrix} \\frac{48}{17} \\\\ -\\frac{24}{17} \\end{bmatrix} \\approx \\begin{bmatrix} 2.8235 \\\\ -1.4118 \\end{bmatrix}',
        explanation: 'Notice that d₁ points downwards to the right, orthogonal to the upward-right d₀.',
      },
      {
        title: '10. Minimize φ(α) for Iteration 1',
        mathLatex: 'd_1^T H d_1 = \\left(\\frac{48}{17}\\right)^2 (2) + \\left(-\\frac{24}{17}\\right)^2 (8) = \\frac{4608 + 4608}{289} = \\frac{9216}{289} \\\\\n\\alpha_1 = \\frac{g_1^T g_1}{d_1^T H d_1} = \\frac{\\frac{2304 + 576}{289}}{\\frac{9216}{289}} = \\frac{2880}{9216} = \\frac{5}{16} = 0.3125',
        explanation: 'Exact quadratic line search formula α = (gᵀ g) / (dᵀ H d).',
      },
      {
        title: '11. Updated Point X₂',
        mathLatex: 'X_2 = X_1 + \\alpha_1 d_1 = \\begin{bmatrix} \\frac{10}{17} \\\\ \\frac{20}{17} \\end{bmatrix} + 0.3125 \\begin{bmatrix} \\frac{48}{17} \\\\ -\\frac{24}{17} \\end{bmatrix} = \\begin{bmatrix} 1.4706 \\\\ 0.7353 \\end{bmatrix}, \\; f(X_2) \\approx -7.5087',
        explanation: 'Iterating this orthogonal sequence rapidly converges to the true minimum (2, 1) where f = -8.',
      },
    ],
  },

  example3: {
    id: 'example3',
    problemTitle: 'Example 3: Coupled Quadratic with Cross-Term xy (Corrected Analytical Minimum)',
    functionExpr: 'x^2 + xy + 2y^2 - 6x - 8y',
    functionLatex: 'f(x,y) = x^2 + xy + 2y^2 - 6x - 8y',
    startingPoint: [1, 1],
    analyticalMinimum: {
      point: [16 / 7, 10 / 7],
      pointFraction: '(16/7, 10/7) \\approx (2.285714, 1.428571)',
      value: -88 / 7,
      valueFraction: '-88/7 \\approx -12.571429',
    },
    hessianAnalysis: {
      matrixLatex: 'H = \\begin{bmatrix} 2 & 1 \\\\ 1 & 4 \\end{bmatrix}',
      determinant: '\\det(H) = (2)(4) - (1)^2 = 7 > 0',
      eigenvalues: '\\lambda_1 = 3 - \\sqrt{2} \\approx 1.5858, \\; \\lambda_2 = 3 + \\sqrt{2} \\approx 4.4142 > 0',
      classification: 'Strict Local Minimum (H ≻ 0, Rotated Elliptical Contours)',
    },
    keyInsight:
      'The cross term xy rotates the principal axes of the ellipses by angle θ = 0.5 arctan(2/(4-2)) ≈ 22.5°. Solving the stationary system 2x + y = 6 and x + 4y = 8 yields the exact global minimum at x* = 16/7, y* = 10/7 with f(X*) = -88/7.',
    iteration0Steps: [
      {
        title: '1. Evaluate Function at X₀ = (1, 1)',
        mathLatex: 'f(1, 1) = 1^2 + (1)(1) + 2(1)^2 - 6(1) - 8(1) = 1 + 1 + 2 - 6 - 8 = -10',
        explanation: 'Starting objective value.',
      },
      {
        title: '2. Compute Gradient g₀',
        mathLatex: '\\frac{\\partial f}{\\partial x} = 2x + y - 6 \\implies 2(1) + 1 - 6 = -3 \\\\\n\\frac{\\partial f}{\\partial y} = x + 4y - 8 \\implies 1 + 4(1) - 8 = -3 \\\\\ng_0 = \\begin{bmatrix} -3 \\\\ -3 \\end{bmatrix}, \\quad \\|g_0\\| = \\sqrt{(-3)^2 + (-3)^2} = \\sqrt{18} \\approx 4.2426',
        explanation: 'Evaluate partial derivatives at (1, 1).',
      },
      {
        title: '3. Search Direction d₀',
        mathLatex: 'd_0 = -g_0 = -\\begin{bmatrix} -3 \\\\ -3 \\end{bmatrix} = \\begin{bmatrix} 3 \\\\ 3 \\end{bmatrix}',
        explanation: 'Negative gradient direction.',
      },
      {
        title: '4. Formulate Exact Line Search φ(α)',
        mathLatex: 'x(\\alpha) = 1 + 3\\alpha, \\quad y(\\alpha) = 1 + 3\\alpha \\\\\n\\phi(\\alpha) = (1+3\\alpha)^2 + (1+3\\alpha)^2 + 2(1+3\\alpha)^2 - 6(1+3\\alpha) - 8(1+3\\alpha) \\\\\n= 4(1+3\\alpha)^2 - 14(1+3\\alpha) = 4(1 + 6\\alpha + 9\\alpha^2) - 14 - 42\\alpha = 36\\alpha^2 - 18\\alpha - 10',
        explanation: 'Substitute parametric ray into f(x, y).',
      },
      {
        title: '5. Minimize φ(α) to Find α₀',
        mathLatex: '\\frac{d\\phi}{d\\alpha} = 72\\alpha - 18 = 0 \\implies 72\\alpha = 18 \\implies \\alpha_0 = \\frac{18}{72} = \\frac{1}{4} = 0.25',
        explanation: 'Set derivative of 1D restriction to zero.',
      },
      {
        title: '6. Update Coordinates X₁',
        mathLatex: 'X_1 = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} + 0.25 \\begin{bmatrix} 3 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} 1.75 \\\\ 1.75 \\end{bmatrix} = \\begin{bmatrix} 7/4 \\\\ 7/4 \\end{bmatrix}',
        explanation: 'Update coordinates with exact step.',
      },
      {
        title: '7. Evaluate New Function Value f(X₁)',
        mathLatex: 'f(7/4, 7/4) = 4(7/4)^2 - 14(7/4) = 4\\left(\\frac{49}{16}\\right) - \\frac{98}{4} = \\frac{49}{4} - \\frac{98}{4} = -\\frac{49}{4} = -12.25',
        explanation: 'Function value decreases from -10 to -12.25.',
      },
      {
        title: '8. Evaluate New Gradient g₁',
        mathLatex: 'g_1 = \\begin{bmatrix} 2(7/4) + (7/4) - 6 \\\\ (7/4) + 4(7/4) - 8 \\end{bmatrix} = \\begin{bmatrix} \\frac{21}{4} - \\frac{24}{4} \\\\ \\frac{35}{4} - \\frac{32}{4} \\end{bmatrix} = \\begin{bmatrix} -0.75 \\\\ 0.75 \\end{bmatrix}, \\quad \\|g_1\\| = \\sqrt{2(0.75)^2} \\approx 1.0607',
        explanation: 'Orthogonality check: g₁ · d₀ = (-0.75)(3) + (0.75)(3) = 0! Perfectly perpendicular.',
      },
    ],
    iteration1Steps: [
      {
        title: '9. Analytical System Derivation of True Minimum',
        mathLatex: '\\begin{cases} 2x + y = 6 \\\\ x + 4y = 8 \\end{cases} \\implies 4(2x+y) - (x+4y) = 24 - 8 \\implies 7x = 16 \\implies x^* = \\frac{16}{7} \\approx 2.285714 \\\\\n4y = 8 - \\frac{16}{7} = \\frac{40}{7} \\implies y^* = \\frac{10}{7} \\approx 1.428571 \\\\\nf(x^*, y^*) = -\\frac{88}{7} \\approx -12.571429',
        explanation: 'The analytical global minimum is derived by simultaneously solving ∇f(x, y) = 0.',
      },
      {
        title: '10. Iteration 1 Search Direction d₁',
        mathLatex: 'd_1 = -g_1 = \\begin{bmatrix} 0.75 \\\\ -0.75 \\end{bmatrix}',
        explanation: 'Direction of steepest descent for iteration 1.',
      },
      {
        title: '11. Optimal Alpha α₁ for Iteration 1',
        mathLatex: 'd_1^T H d_1 = \\begin{bmatrix} 0.75 & -0.75 \\end{bmatrix} \\begin{bmatrix} 2 & 1 \\\\ 1 & 4 \\end{bmatrix} \\begin{bmatrix} 0.75 \\\\ -0.75 \\end{bmatrix} = 0.75^2 (2 - 2 + 4) = 0.5625(4) = 2.25 \\\\\n\\alpha_1 = \\frac{g_1^T g_1}{d_1^T H d_1} = \\frac{0.75^2 + 0.75^2}{2.25} = \\frac{1.125}{2.25} = 0.5',
        explanation: 'Exact step size calculation.',
      },
      {
        title: '12. Update Coordinates X₂',
        mathLatex: 'X_2 = \\begin{bmatrix} 1.75 \\\\ 1.75 \\end{bmatrix} + 0.5 \\begin{bmatrix} 0.75 \\\\ -0.75 \\end{bmatrix} = \\begin{bmatrix} 2.125 \\\\ 1.375 \\end{bmatrix} = \\begin{bmatrix} 17/8 \\\\ 11/8 \\end{bmatrix}, \\; f(X_2) = -12.53125',
        explanation: 'Point rapidly approaches (16/7, 10/7) = (2.2857, 1.4286).',
      },
    ],
  },
};
