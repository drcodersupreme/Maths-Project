import { solveSteepestDescent } from '../engine/solver';
import { prepareObjective, classifyStationaryPoint } from '../engine/symbolic';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

function approxEqual(a: number, b: number, eps: number = 1e-4): boolean {
  return Math.abs(a - b) <= eps;
}

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE MATHEMATICAL TEST SUITE');
console.log('====================================================\n');

// -----------------------------------------------------------------
// Test 1: Example 1 (x^2 + y^2 - 4x - 6y)
// -----------------------------------------------------------------
console.log('--- Test 1: Example 1 ---');
const res1 = solveSteepestDescent({
  fnExpr: 'x^2 + y^2 - 4x - 6y',
  x0: [0, 0],
  maxIterations: 50,
  tolerance: 1e-5,
  lineSearchMethod: 'exact',
});

assert(res1.converged, 'Example 1 converges');
assert(res1.terminationReason === 'CONVERGED_GRADIENT_NORM', 'Reason is CONVERGED_GRADIENT_NORM');
assert(res1.iterations.length === 1, `Example 1 converges in 1 iteration (actual: ${res1.iterations.length})`);
assert(approxEqual(res1.finalPoint[0], 2.0), `Example 1 x* = 2 (actual: ${res1.finalPoint[0]})`);
assert(approxEqual(res1.finalPoint[1], 3.0), `Example 1 y* = 3 (actual: ${res1.finalPoint[1]})`);
assert(approxEqual(res1.finalValue, -13.0), `Example 1 f(X*) = -13 (actual: ${res1.finalValue})`);
assert(res1.finalGradientNorm < 1e-5, `Example 1 final ||g|| < 1e-5 (actual: ${res1.finalGradientNorm})`);
assert(res1.stationaryClassification?.type === 'LOCAL_MINIMUM', 'Example 1 classified as LOCAL_MINIMUM');

// -----------------------------------------------------------------
// Test 2: Example 2 (x^2 + 4y^2 - 4x - 8y)
// -----------------------------------------------------------------
console.log('\n--- Test 2: Example 2 (Zigzagging Elliptic) ---');
const res2 = solveSteepestDescent({
  fnExpr: 'x^2 + 4y^2 - 4x - 8y',
  x0: [0, 0],
  maxIterations: 50,
  tolerance: 1e-5,
  lineSearchMethod: 'exact',
});

assert(res2.converged, 'Example 2 converges');
assert(approxEqual(res2.finalPoint[0], 2.0, 1e-3), `Example 2 x* = 2 (actual: ${res2.finalPoint[0]})`);
assert(approxEqual(res2.finalPoint[1], 1.0, 1e-3), `Example 2 y* = 1 (actual: ${res2.finalPoint[1]})`);
assert(approxEqual(res2.finalValue, -8.0, 1e-3), `Example 2 f(X*) = -8 (actual: ${res2.finalValue})`);
assert(res2.stationaryClassification?.type === 'LOCAL_MINIMUM', 'Example 2 classified as LOCAL_MINIMUM');

// Verify orthogonality of consecutive search directions in Example 2
if (res2.iterations.length >= 2) {
  const d0 = res2.iterations[0].direction;
  const d1 = res2.iterations[1].direction;
  const dotProduct = d0[0] * d1[0] + d0[1] * d1[1];
  assert(Math.abs(dotProduct) < 1e-4, `Consecutive directions d0 · d1 ≈ 0 (actual: ${dotProduct})`);
}

// -----------------------------------------------------------------
// Test 3: Example 3 (x^2 + xy + 2y^2 - 6x - 8y) - User Correction
// -----------------------------------------------------------------
console.log('\n--- Test 3: Example 3 (Corrected Analytical Minimum) ---');
const expectedX3 = 16 / 7; // ~2.285714
const expectedY3 = 10 / 7; // ~1.428571
const expectedF3 = -88 / 7; // ~-12.571429

const res3 = solveSteepestDescent({
  fnExpr: 'x^2 + xy + 2y^2 - 6x - 8y',
  x0: [1, 1],
  maxIterations: 100,
  tolerance: 1e-5,
  lineSearchMethod: 'exact',
});

assert(res3.converged, 'Example 3 converges');
assert(approxEqual(res3.finalPoint[0], expectedX3, 1e-3), `Example 3 x* = 16/7 ≈ ${expectedX3.toFixed(6)} (actual: ${res3.finalPoint[0].toFixed(6)})`);
assert(approxEqual(res3.finalPoint[1], expectedY3, 1e-3), `Example 3 y* = 10/7 ≈ ${expectedY3.toFixed(6)} (actual: ${res3.finalPoint[1].toFixed(6)})`);
assert(approxEqual(res3.finalValue, expectedF3, 1e-3), `Example 3 f(X*) = -88/7 ≈ ${expectedF3.toFixed(6)} (actual: ${res3.finalValue.toFixed(6)})`);
assert(res3.stationaryClassification?.type === 'LOCAL_MINIMUM', 'Example 3 classified as LOCAL_MINIMUM');
assert(approxEqual(res3.stationaryClassification?.det ?? 0, 7.0), 'Hessian determinant det(H) = 7');

// -----------------------------------------------------------------
// Test 4: Backtracking Line Search on Example 3
// -----------------------------------------------------------------
console.log('\n--- Test 4: Backtracking Line Search ---');
const res3Armijo = solveSteepestDescent({
  fnExpr: 'x^2 + xy + 2y^2 - 6x - 8y',
  x0: [1, 1],
  maxIterations: 150,
  tolerance: 1e-3,
  lineSearchMethod: 'backtracking',
  fixedAlpha: 1.0,
  armijoRho: 0.5,
  armijoC1: 1e-4,
});

assert(res3Armijo.converged, 'Example 3 converges with Armijo backtracking');
assert(approxEqual(res3Armijo.finalPoint[0], expectedX3, 1e-2), `Backtracking x* close to 16/7 (actual: ${res3Armijo.finalPoint[0].toFixed(4)})`);
assert(approxEqual(res3Armijo.finalPoint[1], expectedY3, 1e-2), `Backtracking y* close to 10/7 (actual: ${res3Armijo.finalPoint[1].toFixed(4)})`);

// Verify strict decrease for all steps
for (let i = 0; i < res3Armijo.iterations.length; i++) {
  const iter = res3Armijo.iterations[i];
  assert(iter.nextFxk < iter.fxk + 1e-9, `Step ${i}: f(X_{k+1}) < f(X_k) (${iter.nextFxk} < ${iter.fxk})`);
}

// -----------------------------------------------------------------
// Test 5: Stationary Point Classification (Saddle & Local Max)
// -----------------------------------------------------------------
console.log('\n--- Test 5: Stationary Point Classification ---');
// Saddle point: f(x, y) = x^2 - y^2 at (0, 0)
const saddleObj = prepareObjective('x^2 - y^2');
const saddleClassification = classifyStationaryPoint(saddleObj.evaluateHessian, [0, 0]);
assert(saddleClassification.type === 'SADDLE_POINT', `x^2 - y^2 at (0,0) classified as SADDLE_POINT (actual: ${saddleClassification.type})`);
assert(saddleClassification.det < 0, `Saddle point determinant < 0 (actual: ${saddleClassification.det})`);

// Local maximum: f(x, y) = -x^2 - y^2 at (0, 0)
const maxObj = prepareObjective('-x^2 - y^2');
const maxClassification = classifyStationaryPoint(maxObj.evaluateHessian, [0, 0]);
assert(maxClassification.type === 'LOCAL_MAXIMUM', `-x^2 - y^2 at (0,0) classified as LOCAL_MAXIMUM (actual: ${maxClassification.type})`);
assert(maxClassification.det > 0 && maxClassification.fxx < 0, `Local max det > 0 and fxx < 0`);

// -----------------------------------------------------------------
// Test 6: Initial Point Already Converged
// -----------------------------------------------------------------
console.log('\n--- Test 6: Initial Point Already Converged ---');
const resInitConv = solveSteepestDescent({
  fnExpr: 'x^2 + y^2 - 4x - 6y',
  x0: [2, 3], // Already at minimum
  maxIterations: 50,
  tolerance: 1e-5,
  lineSearchMethod: 'exact',
});

assert(resInitConv.converged, 'Initial point detected as converged');
assert(resInitConv.terminationReason === 'INITIAL_POINT_CONVERGED', 'Termination reason is INITIAL_POINT_CONVERGED');
assert(resInitConv.totalIterations === 0, 'Zero iterations performed when starting at stationary point');
assert(resInitConv.stationaryClassification?.type === 'LOCAL_MINIMUM', 'Classified as LOCAL_MINIMUM at start point');

console.log('\n====================================================');
console.log('🎉 ALL MATHEMATICAL VALIDATION TESTS PASSED 100%!');
console.log('====================================================');
