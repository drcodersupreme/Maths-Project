export type LineSearchMethod = 'exact' | 'backtracking' | 'fixed';

export type { CompiledObjective } from '../engine/symbolic';

export type TerminationReason =
  | 'CONVERGED_GRADIENT_NORM'
  | 'INITIAL_POINT_CONVERGED'
  | 'MAX_ITERATIONS_REACHED'
  | 'LINE_SEARCH_FAILED'
  | 'NUMERICAL_OVERFLOW';

export type StationaryPointType =
  | 'LOCAL_MINIMUM'
  | 'LOCAL_MAXIMUM'
  | 'SADDLE_POINT'
  | 'INCONCLUSIVE';

export interface StationaryPointClassification {
  type: StationaryPointType;
  fxx: number;
  fyy: number;
  fxy: number;
  det: number;
  trace: number;
  eigenvalues: [number, number];
  explanation: string;
}

export interface LineSearchTrial {
  trialIndex: number;
  alpha: number;
  trialPoint: [number, number];
  trialF: number;
  armijoThreshold?: number;
  satisfied: boolean;
}

export interface LineSearchResult {
  alpha: number;
  lineSearchType: 'exact_analytical' | 'backtracking' | 'fixed';
  phiAlphaExpr?: string;
  phiAlphaLatex?: string;
  dphiAlphaExpr?: string;
  dphiAlphaLatex?: string;
  trials: LineSearchTrial[];
  success: boolean;
  message?: string;
}

export interface MathStepsLatex {
  step1Coordinates: string;
  step2FunctionValue: string;
  step3PartialDerivatives: string;
  step4GradientVector: string;
  step5SearchDirection: string;
  step6PhiAlpha: string;
  step7DphiAlpha: string;
  step8AlphaCalculation: string;
  step9CoordinateUpdate: string;
  step10NewFunctionValue: string;
  step11NewGradient: string;
  step12ConvergenceCheck: string;
}

export interface IterationDetail {
  k: number;
  xk: [number, number];
  fxk: number;
  gx: number;
  gy: number;
  gradient: [number, number];
  gradientNorm: number;
  direction: [number, number];
  alpha: number;
  lineSearchType: 'exact_analytical' | 'backtracking' | 'fixed';
  phiAlphaExpr?: string;
  phiAlphaLatex?: string;
  dphiAlphaExpr?: string;
  dphiAlphaLatex?: string;
  lineSearchTrials?: LineSearchTrial[];
  nextXk: [number, number];
  nextFxk: number;
  nextGradient: [number, number];
  nextGradientNorm: number;
  convergedHere: boolean;
  mathStepsLatex: MathStepsLatex;
}

export type AlgorithmPhase =
  | 'START'
  | 'EVAL_FUNC'
  | 'COMPUTE_GRAD'
  | 'CHECK_CONV'
  | 'COMPUTE_DIR'
  | 'LINE_SEARCH'
  | 'UPDATE_X'
  | 'CLASSIFY'
  | 'TERMINATED';

export interface ExecutionStep {
  stepIndex: number;
  iteration: number;
  phase: AlgorithmPhase;
  codeSnippet: string;
  codeLineNumbers: [number, number];
  title: string;
  description: string;
  formulaLatex: string;
  variables: {
    k: number;
    x: number;
    y: number;
    f: number;
    gx: number;
    gy: number;
    gradNorm: number;
    dx: number;
    dy: number;
    alpha: number;
    nextX?: number;
    nextY?: number;
    nextF?: number;
  };
  outputSummary: string;
}

export interface SolverOptions {
  fnExpr: string;
  x0: [number, number];
  maxIterations: number;
  tolerance: number;
  lineSearchMethod: LineSearchMethod;
  fixedAlpha?: number;
  armijoRho?: number;
  armijoC1?: number;
}

export interface OptimizationResult {
  options: SolverOptions;
  iterations: IterationDetail[];
  converged: boolean;
  terminationReason: TerminationReason;
  totalIterations: number;
  finalPoint: [number, number];
  finalValue: number;
  finalGradientNorm: number;
  stationaryClassification?: StationaryPointClassification;
  gradientFormula: {
    gx: string;
    gy: string;
    gxLatex: string;
    gyLatex: string;
  };
  hessianFormula?: {
    fxx: string;
    fxy: string;
    fyy: string;
    fxxLatex: string;
    fxyLatex: string;
    fyyLatex: string;
  };
  executionTrace: ExecutionStep[];
}

export interface PresetProblem {
  id: string;
  title: string;
  category: string;
  formula: string;
  x0: [number, number];
  tolerance: number;
  maxIterations: number;
  lineSearchMethod: LineSearchMethod;
  fixedAlpha?: number;
  knownMinimum?: {
    point: [number, number];
    value: number;
    pointLatex: string;
    valueLatex: string;
  };
  description: string;
  learningObjective: string;
}
