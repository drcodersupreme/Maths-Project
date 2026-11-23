export interface CodeLineExplanation {
  lineNumber: number;
  code: string;
  simpleEnglish: string;
  whyRequired: string;
  mathematicalFormula: string;
  formulaLatex: string;
  sampleInput: string;
  sampleOutput: string;
  conceptTag: string;
}

export interface MathCodeBridgeItem {
  id: string;
  mathConcept: string;
  formulaLatex: string;
  typeScriptSnippet: string;
  whyItMatters: string;
  detailedExplanation: string;
  examinationTip: string;
}

export interface VivaQuestion {
  question: string;
  category: 'Mathematical Foundations' | 'Convergence & Curvature' | 'Algorithmic Implementation' | 'Line Search Methods';
  answer: string;
  mathFormula?: string;
  practicalRelevance: string;
}

export const AUTHENTIC_TYPESCRIPT_SOURCE = `// ============================================================================
// Core Steepest Descent Numerical Optimization Engine (TypeScript)
// ============================================================================

export function solveSteepestDescent(options: SolverOptions): OptimizationResult {
  const { fnExpr, x0, maxIterations, tolerance, lineSearchMethod } = options;
  const obj = prepareObjective(fnExpr);

  let currentX: [number, number] = [x0[0], x0[1]];
  let currentF = obj.evaluate(currentX[0], currentX[1]);
  let [gx, gy] = obj.evaluateGradient(currentX[0], currentX[1]);
  let gradNorm = Math.sqrt(gx * gx + gy * gy);

  // Check initial gradient norm: prevent redundant work if X0 is already stationary
  if (gradNorm < tolerance) {
    const classification = classifyStationaryPoint(obj.evaluateHessian, currentX);
    return { converged: true, terminationReason: 'INITIAL_POINT_CONVERGED', ... };
  }

  for (let k = 0; k < maxIterations; k++) {
    // 1. Current Gradient & Norm
    const [cgx, cgy] = [gx, gy];
    const cGradNorm = gradNorm;

    // 2. Search Direction: Negative Gradient
    const [dx, dy]: [number, number] = [-cgx, -cgy];

    // 3. Step Size Selection via Line Search (Exact or Backtracking)
    const lineSearchResult = computeStepSize(lineSearchMethod, obj, currentX, [cgx, cgy], [dx, dy]);
    const alpha = lineSearchResult.alpha;
    if (!lineSearchResult.success || alpha <= 0) break;

    // 4. Update Coordinates along search ray
    const nextX: [number, number] = [currentX[0] + alpha * dx, currentX[1] + alpha * dy];
    const nextF = obj.evaluate(nextX[0], nextX[1]);

    // 5. Compute New Gradient at X_{k+1}
    const nextG = obj.evaluateGradient(nextX[0], nextX[1]);
    const nextGradNorm = Math.sqrt(nextG[0] * nextG[0] + nextG[1] * nextG[1]);

    // 6. Test Convergence Stopping Criterion
    if (nextGradNorm < tolerance) {
      const stationaryClassification = classifyStationaryPoint(obj.evaluateHessian, nextX);
      return { converged: true, terminationReason: 'CONVERGED_GRADIENT_NORM', ... };
    }

    currentX = nextX;
    currentF = nextF;
    [gx, gy] = nextG;
    gradNorm = nextGradNorm;
  }
}`;

export const LINE_BY_LINE_EXPLANATIONS: CodeLineExplanation[] = [
  {
    lineNumber: 7,
    code: 'const obj = prepareObjective(fnExpr);',
    simpleEnglish: 'Parses the mathematical text string entered by the user and compiles symbolic derivatives using math.js.',
    whyRequired: 'We need exact symbolic formulas for ∂f/∂x, ∂f/∂y, and the Hessian matrix rather than noisy numerical approximations.',
    mathematicalFormula: 'f(x, y), \\quad \\nabla f(x, y) = [\\partial f/\\partial x, \\partial f/\\partial y]^T',
    formulaLatex: '\\nabla f(x, y) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x} \\\\ \\frac{\\partial f}{\\partial y} \\end{bmatrix}',
    sampleInput: 'fnExpr = "x^2 + xy + 2y^2 - 6x - 8y"',
    sampleOutput: 'Compiled functions for f(x,y), gx(x,y), gy(x,y), and Hessian H(x,y)',
    conceptTag: 'Symbolic Differentiation',
  },
  {
    lineNumber: 9,
    code: 'let currentX: [number, number] = [x0[0], x0[1]];',
    simpleEnglish: 'Initializes the 2D coordinate vector X₀ with the starting point coordinates chosen by the student.',
    whyRequired: 'Optimization is an iterative sequence of points X₀, X₁, X₂, ... starting from an initial guess.',
    mathematicalFormula: 'X_0 = [x_0, y_0]^T',
    formulaLatex: 'X_0 = \\begin{bmatrix} x_0 \\\\ y_0 \\end{bmatrix}',
    sampleInput: 'x0 = [1, 1]',
    sampleOutput: 'currentX = [1, 1]',
    conceptTag: 'Vector Initialization',
  },
  {
    lineNumber: 10,
    code: 'let currentF = obj.evaluate(currentX[0], currentX[1]);',
    simpleEnglish: 'Computes the objective function value f(X) at the current point.',
    whyRequired: 'We must track function values to verify monotonic descent: f(X_{k+1}) < f(X_k).',
    mathematicalFormula: 'f(X_k) = f(x_k, y_k)',
    formulaLatex: 'f(X_k) = f(x_k, y_k)',
    sampleInput: 'currentX = [1, 1]',
    sampleOutput: 'currentF = -10',
    conceptTag: 'Function Evaluation',
  },
  {
    lineNumber: 11,
    code: 'let [gx, gy] = obj.evaluateGradient(currentX[0], currentX[1]);',
    simpleEnglish: 'Evaluates the partial derivatives ∂f/∂x and ∂f/∂y at the current coordinates.',
    whyRequired: 'The gradient vector ∇f(X_k) indicates the direction of maximum rate of increase of the function.',
    mathematicalFormula: 'g_k = \\nabla f(X_k) = [\\partial f/\\partial x(X_k), \\partial f/\\partial y(X_k)]^T',
    formulaLatex: 'g_k = \\nabla f(X_k) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x}(X_k) \\\\ \\frac{\\partial f}{\\partial y}(X_k) \\end{bmatrix}',
    sampleInput: 'currentX = [1, 1]',
    sampleOutput: 'gx = -3, gy = -3',
    conceptTag: 'Gradient Vector',
  },
  {
    lineNumber: 12,
    code: 'let gradNorm = Math.sqrt(gx * gx + gy * gy);',
    simpleEnglish: 'Calculates the Euclidean (L2) norm of the gradient vector.',
    whyRequired: 'The gradient norm ||g|| measures how steep the surface is. At an unconstrained minimum, the surface is completely flat, meaning ||g|| = 0.',
    mathematicalFormula: '\\|g_k\\| = \\sqrt{g_x^2 + g_y^2}',
    formulaLatex: '\\|g_k\\| = \\sqrt{\\left(\\frac{\\partial f}{\\partial x}\\right)^2 + \\left(\\frac{\\partial f}{\\partial y}\\right)^2}',
    sampleInput: 'gx = -3, gy = -3',
    sampleOutput: 'gradNorm = 4.24264',
    conceptTag: 'Vector Norm & First-Order Optimality',
  },
  {
    lineNumber: 15,
    code: 'if (gradNorm < tolerance) { ... }',
    simpleEnglish: 'Checks whether the initial point is already a stationary point before entering the loop.',
    whyRequired: 'Prevents wasteful iterations, division by zero, and invalid line search steps if the user starts directly at a stationary point.',
    mathematicalFormula: '\\|\\nabla f(X_0)\\| < \\varepsilon',
    formulaLatex: '\\|\\nabla f(X_0)\\| < \\varepsilon',
    sampleInput: 'gradNorm = 0.0, tolerance = 1e-5',
    sampleOutput: 'Halts immediately with INITIAL_POINT_CONVERGED',
    conceptTag: 'Boundary Check & Safety',
  },
  {
    lineNumber: 24,
    code: 'const [dx, dy]: [number, number] = [-cgx, -cgy];',
    simpleEnglish: 'Sets the search direction to the negative of the gradient vector: d = -g.',
    whyRequired: 'Because the gradient points in the direction of steepest increase, its exact opposite points in the direction of steepest descent.',
    mathematicalFormula: 'd_k = -g_k = -\\nabla f(X_k)',
    formulaLatex: 'd_k = -\\nabla f(X_k) = -\\begin{bmatrix} g_x \\\\ g_y \\end{bmatrix}',
    sampleInput: 'cgx = -3, cgy = -3',
    sampleOutput: 'dx = 3, dy = 3',
    conceptTag: 'Steepest Descent Direction',
  },
  {
    lineNumber: 27,
    code: 'const lineSearchResult = computeStepSize(lineSearchMethod, obj, currentX, [cgx, cgy], [dx, dy]);',
    simpleEnglish: 'Computes the optimal step size α by minimizing the 1D function φ(α) = f(X_k + α d_k).',
    whyRequired: 'Without an appropriate step size α, the algorithm will either crawl too slowly or overshoot the valley and diverge.',
    mathematicalFormula: '\\min_{\\alpha > 0} \\phi(\\alpha) = f(X_k + \\alpha d_k) \\implies \\frac{d\\phi}{d\\alpha} = 0',
    formulaLatex: '\\alpha_k = \\arg\\min_{\\alpha > 0} f(X_k + \\alpha d_k)',
    sampleInput: 'Quadratic function along d = [3, 3]^T',
    sampleOutput: 'alpha = 0.25 (Exact analytical step size)',
    conceptTag: 'Line Search & Optimization',
  },
  {
    lineNumber: 32,
    code: 'const nextX: [number, number] = [currentX[0] + alpha * dx, currentX[1] + alpha * dy];',
    simpleEnglish: 'Updates the position vector by taking a step of size α along the direction d.',
    whyRequired: 'This is the fundamental recurrence equation of all line-search optimization algorithms.',
    mathematicalFormula: 'X_{k+1} = X_k + \\alpha_k d_k',
    formulaLatex: 'X_{k+1} = X_k + \\alpha_k d_k = \\begin{bmatrix} x_k + \\alpha_k d_x \\\\ y_k + \\alpha_k d_y \\end{bmatrix}',
    sampleInput: 'currentX = [1, 1], alpha = 0.25, d = [3, 3]',
    sampleOutput: 'nextX = [1.75, 1.75]',
    conceptTag: 'Coordinate Update',
  },
  {
    lineNumber: 36,
    code: 'const nextG = obj.evaluateGradient(nextX[0], nextX[1]);',
    simpleEnglish: 'Computes the new gradient at the updated position X_{k+1}.',
    whyRequired: 'Needed to check whether the new point has reached the minimum (||g|| < ε) and to establish the next descent direction.',
    mathematicalFormula: 'g_{k+1} = \\nabla f(X_{k+1})',
    formulaLatex: 'g_{k+1} = \\nabla f(X_{k+1}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x}(X_{k+1}) \\\\ \\frac{\\partial f}{\\partial y}(X_{k+1}) \\end{bmatrix}',
    sampleInput: 'nextX = [1.75, 1.75]',
    sampleOutput: 'nextG = [-0.75, 0.75]',
    conceptTag: 'Gradient Evaluation',
  },
  {
    lineNumber: 40,
    code: 'if (nextGradNorm < tolerance) { ... }',
    simpleEnglish: 'Checks if the gradient norm at the new point is less than the user-specified tolerance ε.',
    whyRequired: 'First-order necessary condition for unconstrained optimization: ∇f(X*) = 0.',
    mathematicalFormula: '\\|\\nabla f(X_{k+1})\\| < \\varepsilon',
    formulaLatex: '\\|g_{k+1}\\| = \\|\\nabla f(X_{k+1})\\| < \\varepsilon',
    sampleInput: 'nextGradNorm = 0.000003, tolerance = 1e-5',
    sampleOutput: 'Terminates with CONVERGED_GRADIENT_NORM',
    conceptTag: 'Stopping Criterion',
  },
  {
    lineNumber: 41,
    code: 'const stationaryClassification = classifyStationaryPoint(obj.evaluateHessian, nextX);',
    simpleEnglish: 'Calculates the Hessian matrix at the stationary point and checks its eigenvalues.',
    whyRequired: 'A zero gradient only guarantees a stationary point. We must examine the 2nd derivatives to prove whether it is a local minimum, local maximum, or saddle point.',
    mathematicalFormula: 'H(X) = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{xy} & f_{yy} \\end{bmatrix}, \\; \\det(H) > 0, \\; f_{xx} > 0 \\implies \\text{Min}',
    formulaLatex: 'H(X^*) = \\begin{bmatrix} \\frac{\\partial^2 f}{\\partial x^2} & \\frac{\\partial^2 f}{\\partial x \\partial y} \\\\ \\frac{\\partial^2 f}{\\partial y \\partial x} & \\frac{\\partial^2 f}{\\partial y^2} \\end{bmatrix} \\succ 0',
    sampleInput: 'nextX = [16/7, 10/7]',
    sampleOutput: 'det(H) = 7 > 0, fxx = 2 > 0 -> LOCAL_MINIMUM',
    conceptTag: 'Second-Order Optimality (Hessian)',
  },
];

export const MATH_CODE_BRIDGES: MathCodeBridgeItem[] = [
  {
    id: 'gradient',
    mathConcept: '1. Gradient Vector (Direction of Maximum Increase)',
    formulaLatex: 'g_k = \\nabla f(X_k) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x}(x_k, y_k) \\\\ \\frac{\\partial f}{\\partial y}(x_k, y_k) \\end{bmatrix}',
    typeScriptSnippet: `const [gx, gy] = obj.evaluateGradient(x, y);\nconst gradNorm = Math.sqrt(gx * gx + gy * gy);`,
    whyItMatters: 'The gradient vector is orthogonal to the contour line passing through X_k and points in the direction of steepest ascent.',
    detailedExplanation:
      'We compute the exact partial derivatives with respect to x and y. The vector [gx, gy] represents the slope along the x and y axes. Its Euclidean length Math.sqrt(gx*gx + gy*gy) represents the maximum directional derivative at that point.',
    examinationTip: 'Always remember: The gradient vector is perpendicular (normal) to the tangent of the contour curve f(x, y) = c at point X_k.',
  },
  {
    id: 'direction',
    mathConcept: '2. Search Direction (Steepest Descent)',
    formulaLatex: 'd_k = -g_k = -\\nabla f(X_k)',
    typeScriptSnippet: `const [dx, dy]: [number, number] = [-gx, -gy];`,
    whyItMatters: 'By choosing d = -∇f(X_k), the directional derivative ∇f(X_k)ᵀ d_k = -||∇f(X_k)||² is as negative as possible, guaranteeing local decrease.',
    detailedExplanation:
      'Steepest Descent uses the simplest possible search direction. Because ∇f points uphill, -∇f points directly downhill along the steepest slope.',
    examinationTip: 'Prove in viva: Directional derivative D_u f = ∇f · u = ||∇f|| cos(θ). To minimize this value, cos(θ) must be -1, which means θ = 180° (opposite to gradient)!',
  },
  {
    id: 'linesearch',
    mathConcept: '3. Line Search (Optimal Step Size α)',
    formulaLatex: '\\phi(\\alpha) = f(X_k + \\alpha d_k), \\quad \\frac{d\\phi}{d\\alpha} = 0 \\implies \\alpha_k = \\frac{g_k^T g_k}{d_k^T H d_k}',
    typeScriptSnippet: `const dTHd = dx * (fxx * dx + fxy * dy) + dy * (fxy * dx + fyy * dy);\nconst alpha = (gx * gx + gy * gy) / dTHd;`,
    whyItMatters: 'Taking a fixed step can cause oscillations or divergence. Exact line search finds the precise bottom of the 1D slice along the search ray.',
    detailedExplanation:
      'For quadratic functions, the 1D restriction φ(α) is a parabola in α. Differentiating with respect to α and setting to zero yields the exact closed-form expression α = (gᵀ g) / (dᵀ H d).',
    examinationTip: 'At the exact line search minimum, the new gradient is strictly perpendicular to the search direction: ∇f(X_{k+1}) · d_k = 0.',
  },
  {
    id: 'update',
    mathConcept: '4. Coordinate Vector Update',
    formulaLatex: 'X_{k+1} = X_k + \\alpha_k d_k',
    typeScriptSnippet: `const nextX: [number, number] = [\n  currentX[0] + alpha * dx,\n  currentX[1] + alpha * dy\n];`,
    whyItMatters: 'Translates the point in 2D space along vector d by distance proportional to α.',
    detailedExplanation:
      'Each component is updated independently: x_{k+1} = x_k + α * d_x and y_{k+1} = y_k + α * d_y.',
    examinationTip: 'This is the standard additive update form shared by Steepest Descent, Conjugate Gradient, and Newton-Raphson methods.',
  },
  {
    id: 'convergence',
    mathConcept: '5. Convergence Criterion (First-Order Optimality)',
    formulaLatex: '\\|g_{k+1}\\| = \\|\\nabla f(X_{k+1})\\| < \\varepsilon',
    typeScriptSnippet: `if (nextGradNorm < tolerance) {\n  converged = true;\n  break;\n}`,
    whyItMatters: 'Checking gradient norm is mathematically rigorous. Coordinate step size ||X_{k+1} - X_k|| could be small due to tiny α without reaching the true minimum.',
    detailedExplanation:
      'We test whether the Euclidean length of the gradient vector is below the user-specified tolerance threshold (e.g. 10⁻⁵).',
    examinationTip: 'Never declare convergence solely based on ||X_{k+1} - X_k|| < ε; if the line search gets stuck, the step is small even when far from the minimum.',
  },
  {
    id: 'hessian',
    mathConcept: '6. Stationary Point Classification (Second Derivative Test)',
    formulaLatex: 'H(X^*) = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{xy} & f_{yy} \\end{bmatrix}, \\quad \\det(H) > 0 \\land f_{xx} > 0 \\implies \\text{Local Min}',
    typeScriptSnippet: `const det = fxx * fyy - fxy * fxy;\nif (det > 0 && fxx > 0) return 'LOCAL_MINIMUM';\nif (det > 0 && fxx < 0) return 'LOCAL_MAXIMUM';\nif (det < 0) return 'SADDLE_POINT';`,
    whyItMatters: 'Stationary points can be local minima, local maxima, or saddle points. The Hessian matrix reveals the local curvature.',
    detailedExplanation:
      'If both eigenvalues of H are positive (det > 0, trace > 0, fxx > 0), the matrix is positive definite and the point is a local minimum. If det < 0, eigenvalues have opposite signs and the point is a saddle point.',
    examinationTip: 'In exams, write out the Hessian determinant Δ = f_{xx} f_{yy} - (f_{xy})² and state the Second Partial Derivative Test clearly.',
  },
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    question: 'Why do consecutive search directions in Steepest Descent with exact line search always form a 90° angle (orthogonality)?',
    category: 'Mathematical Foundations',
    mathFormula: 'd_k^T d_{k+1} = - d_k^T \\nabla f(X_{k+1}) = 0',
    answer:
      'Along the line X(α) = X_k + α d_k, the exact line search selects α_k to minimize φ(α) = f(X_k + α d_k). At the minimum of any differentiable 1D function, its derivative must be zero: dφ(α)/dα = ∇f(X_k + α d_k)ᵀ d_k = 0. Since X_{k+1} = X_k + α_k d_k and d_{k+1} = -∇f(X_{k+1}), we have: d_{k+1}ᵀ d_k = -∇f(X_{k+1})ᵀ d_k = 0. Therefore, the new search direction is precisely perpendicular to the previous direction!',
    practicalRelevance:
      'This geometric property explains why steepest descent exhibits perpendicular zigzagging in narrow valleys, resulting in slow convergence for ill-conditioned problems.',
  },
  {
    question: 'What is the condition number of a Hessian matrix, and how does it dictate the convergence speed of Steepest Descent?',
    category: 'Convergence & Curvature',
    mathFormula: '\\kappa(H) = \\frac{\\lambda_{\\max}}{\\lambda_{\\min}}, \\quad \\frac{f(X_{k+1}) - f^*}{f(X_k) - f^*} \\le \\left( \\frac{\\kappa - 1}{\\kappa + 1} \\right)^2',
    answer:
      'The condition number κ(H) is the ratio of the largest eigenvalue λ_max to the smallest eigenvalue λ_min of the Hessian matrix. For a quadratic function, the convergence factor is ((κ - 1)/(κ + 1))². If κ = 1 (circular contours, like Example 1), (1-1)/(1+1) = 0, meaning it converges in exactly 1 iteration! If κ is large (e.g. κ = 100 in an elongated valley), ((99)/(101))² ≈ 0.96, meaning the error decreases by only 4% per iteration, causing severe zigzagging.',
    practicalRelevance:
      'Explains why preconditioning or Newton-Raphson methods (which multiply by H⁻¹ to make κ ≈ 1) are preferred for ill-conditioned engineering problems.',
  },
  {
    question: 'What is the difference between Exact Line Search and Armijo Backtracking Line Search?',
    category: 'Line Search Methods',
    mathFormula: 'f(X_k + \\alpha d_k) \\le f(X_k) + c_1 \\alpha \\nabla f(X_k)^T d_k',
    answer:
      'Exact line search finds the exact mathematical minimum along the 1D search ray by setting dφ/dα = 0. This is fast and closed-form for quadratic functions, but computationally expensive or impossible for complex non-linear functions. Armijo Backtracking is an inexact line search: it starts with α = 1 and reduces α by factor ρ until the function value drops by at least a fraction c₁ of the tangent slope. It guarantees sufficient decrease without wasting excessive evaluations.',
    practicalRelevance:
      'In real-world deep learning and optimization packages (like PyTorch and SciPy), inexact line search (Armijo / Wolfe conditions) is used exclusively.',
  },
  {
    question: 'Why should we test ||∇f(X)|| < ε rather than ||X_{k+1} - X_k|| < ε as the primary stopping condition?',
    category: 'Algorithmic Implementation',
    mathFormula: '\\|\\nabla f(X^*)\\| < \\varepsilon \\quad \\text{vs} \\quad \\|X_{k+1} - X_k\\| = \\alpha_k \\|d_k\\|',
    answer:
      'The true mathematical definition of a stationary point is that the gradient vanishes: ∇f(X*) = 0. The step distance ||X_{k+1} - X_k|| = α_k ||d_k|| can become very small simply because the step size α_k collapsed (e.g. in poor line search) or the algorithm stalled in a flat region far from the actual minimum. Relying on coordinate difference leads to premature false convergence.',
    practicalRelevance:
      'Ensures numerical reliability and prevents false-positive convergence flags in engineering solvers.',
  },
];
