import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cMod,
  cMul,
  cNthRoots,
  cPow,
  cross3,
  det,
  det2,
  det3,
  gramSchmidt,
  inv2,
  invMatrix,
  leastSquaresPoly,
  lineIntersection2D,
  matMul,
  newtonRaphson,
  pointLineDist2D,
  pointPlaneDist3D,
  riemannSum,
  rrefSteps,
  simpson,
  skewLinesDist3D,
  solveLinear,
  taylorExp,
  taylorSin,
  triple3,
  vDot,
  vNorm,
} from "../../src/engines/math-core.ts";

const approx = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `expected ${a} ≈ ${b}`);

describe("math-core engine", () => {
  it("computes 2D/3D vectors and analytic geometry accurately", () => {
    approx(vNorm([3, 4, 12]), 13);
    assert.deepEqual(cross3([1, 0, 0], [0, 1, 0]), [0, 0, 1]);
    approx(triple3([2, 0, 0], [0, 3, 0], [0, 0, 4]), 24);
    approx(pointLineDist2D([1, 2], 3, 4, -1), 2);
    assert.deepEqual(lineIntersection2D([1, 1, -5], [1, -1, -1]), [3, 2]);
    approx(pointPlaneDist3D([1, 2, 2], [2, 1, 2], 2), 2);
    approx(skewLinesDist3D([0, 0, 0], [1, 0, 0], [0, 0, 5], [0, 1, 0]), 5);
  });

  it("handles matrices, determinants, inverses and RREF steps", () => {
    approx(det2([[4, 3], [2, 5]]), 14);
    approx(det3([[2, 1, 0], [0, 3, 1], [1, 0, 2]]), 13);
    approx(det([[2, 1, 0], [0, 3, 1], [1, 0, 2]]), 13);

    const A = [[2, 1], [1, 2]];
    const Ainv = inv2(A)!;
    const I = matMul(A, Ainv);
    approx(I[0]![0]!, 1);
    approx(I[0]![1]!, 0);
    approx(I[1]![0]!, 0);
    approx(I[1]![1]!, 1);

    const B = [[2, 1, 0], [0, 3, 1], [1, 0, 2]];
    const Binv = invMatrix(B)!;
    const IB = matMul(B, Binv);
    approx(IB[0]![0]!, 1);
    approx(IB[1]![1]!, 1);
    approx(IB[2]![2]!, 1);
    approx(IB[0]![2]!, 0);

    const sol = solveLinear([[1, 2], [3, -1]], [5, 1])!;
    approx(sol[0]!, 1);
    approx(sol[1]!, 2);

    const inc = rrefSteps([[1, 1, 2], [1, 1, 5]], 2);
    assert.equal(inc.rankA, 1);
    assert.equal(inc.rankAug, 2);
  });

  it("performs Gram–Schmidt and least squares fitting", () => {
    const { orthonormal } = gramSchmidt([[3, 0], [4, 5]]);
    approx(vNorm(orthonormal[0]!), 1);
    approx(vNorm(orthonormal[1]!), 1);
    approx(vDot(orthonormal[0]!, orthonormal[1]!), 0);

    const fit = leastSquaresPoly([[0, 1], [1, 3], [2, 5]], 1);
    approx(fit.coeffs[0]!, 1);
    approx(fit.coeffs[1]!, 2);
    approx(fit.ssr, 0);
  });

  it("evaluates calculus, Taylor series, and complex roots", () => {
    approx(simpson((x) => x * x, 0, 3, 20), 9);
    approx(riemannSum((x) => 2 * x, 0, 4, 100, "mid"), 16, 1e-4);
    const nr = newtonRaphson((x) => x * x - 2, (x) => 2 * x, 2, 6);
    approx(nr[nr.length - 1]!, Math.SQRT2, 1e-9);
    approx(taylorExp(1, 12), Math.E, 1e-8);
    approx(taylorSin(Math.PI / 6, 9), 0.5, 1e-7);

    approx(cMod(cMul({ re: 3, im: 4 }, { re: 0, im: 2 })), 10);
    approx(cPow({ re: 1, im: 1 }, 4).re, -4);
    const roots = cNthRoots({ re: 1, im: 0 }, 4);
    assert.equal(roots.length, 4);
    for (const r of roots) approx(cMod(r), 1);
  });
});
