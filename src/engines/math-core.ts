/**
 * Pure mathematical computation engine for Lectures 1–21.
 * Used both by live interactive visualizations and by unit-tested practice verification.
 */

export type Vec = number[];
export type Mat = number[][];

// =====================================================================
// Vectors & Inner Products
// =====================================================================
export const vAdd = (a: readonly number[], b: readonly number[]): Vec => a.map((x, i) => x + (b[i] ?? 0));
export const vSub = (a: readonly number[], b: readonly number[]): Vec => a.map((x, i) => x - (b[i] ?? 0));
export const vScale = (a: readonly number[], s: number): Vec => a.map((x) => x * s);
export const vDot = (a: readonly number[], b: readonly number[]): number =>
  a.reduce((sum, x, i) => sum + x * (b[i] ?? 0), 0);
export const vNorm = (a: readonly number[]): number => Math.hypot(...a);

export function vAngle(a: readonly number[], b: readonly number[]): number {
  const denom = vNorm(a) * vNorm(b);
  if (denom < 1e-12) return 0;
  const c = Math.max(-1, Math.min(1, vDot(a, b) / denom));
  return Math.acos(c);
}

export function vProject(u: readonly number[], onto: readonly number[]): Vec {
  const d = vDot(onto, onto);
  if (d < 1e-12) return onto.map(() => 0);
  return vScale(onto, vDot(u, onto) / d);
}

export function cross3(a: readonly [number, number, number], b: readonly [number, number, number]): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function triple3(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  c: readonly [number, number, number],
): number {
  return vDot(a, cross3(b, c));
}

// =====================================================================
// Analytic Geometry (2D & 3D)
// =====================================================================
export function pointLineDist2D(p: readonly [number, number], a: number, b: number, c: number): number {
  const denom = Math.hypot(a, b);
  return denom < 1e-12 ? NaN : Math.abs(a * p[0] + b * p[1] + c) / denom;
}

export function lineIntersection2D(
  l1: readonly [number, number, number],
  l2: readonly [number, number, number],
): [number, number] | null {
  const [a1, b1, c1] = l1;
  const [a2, b2, c2] = l2;
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-10) return null;
  // a1 x + b1 y + c1 = 0  =>  a1 x + b1 y = -c1
  return [(b1 * c2 - b2 * c1) / det, (c1 * a2 - c2 * a1) / det];
}

export function pointPlaneDist3D(
  p: readonly [number, number, number],
  n: readonly [number, number, number],
  d: number,
): number {
  // Plane: n · x = d
  const len = vNorm(n);
  return len < 1e-12 ? NaN : Math.abs(vDot(n, p) - d) / len;
}

export function skewLinesDist3D(
  p1: readonly [number, number, number],
  d1: readonly [number, number, number],
  p2: readonly [number, number, number],
  d2: readonly [number, number, number],
): number {
  const n = cross3(d1, d2);
  const diff: [number, number, number] = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  const nLen = vNorm(n);
  if (nLen < 1e-10) {
    // parallel lines: ||(p2 - p1) x d1|| / ||d1||
    const dLen = vNorm(d1);
    return dLen < 1e-10 ? vNorm(diff) : vNorm(cross3(diff, d1)) / dLen;
  }
  return Math.abs(vDot(diff, n)) / nLen;
}

// =====================================================================
// Matrices, Determinants, Inverses & Gaussian Elimination
// =====================================================================
export function matTranspose(A: Mat): Mat {
  if (!A.length) return [];
  const rows = A.length;
  const cols = A[0]!.length;
  return Array.from({ length: cols }, (_, c) => Array.from({ length: rows }, (_, r) => A[r]![c]!));
}

export function matMul(A: Mat, B: Mat): Mat {
  const m = A.length;
  const k = A[0]?.length ?? 0;
  const n = B[0]?.length ?? 0;
  const out: Mat = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += A[i]![t]! * B[t]![j]!;
      out[i]![j] = s;
    }
  }
  return out;
}

export function matVec(A: Mat, x: readonly number[]): Vec {
  return A.map((row) => vDot(row, x));
}

export function det2(A: Mat): number {
  return A[0]![0]! * A[1]![1]! - A[0]![1]! * A[1]![0]!;
}

export function det3(A: Mat): number {
  const [a, b, c] = A[0]!;
  const [d, e, f] = A[1]!;
  const [g, h, i] = A[2]!;
  return a! * (e! * i! - f! * h!) - b! * (d! * i! - f! * g!) + c! * (d! * h! - e! * g!);
}

export function det(A: Mat): number {
  const n = A.length;
  if (n === 1) return A[0]![0]!;
  if (n === 2) return det2(A);
  if (n === 3) return det3(A);
  const M = A.map((r) => [...r]);
  let sign = 1;
  let result = 1;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r]![col]!) > Math.abs(M[pivot]![col]!)) pivot = r;
    }
    if (Math.abs(M[pivot]![col]!) < 1e-12) return 0;
    if (pivot !== col) {
      [M[col], M[pivot]] = [M[pivot]!, M[col]!];
      sign = -sign;
    }
    const pv = M[col]![col]!;
    result *= pv;
    for (let r = col + 1; r < n; r++) {
      const f = M[r]![col]! / pv;
      for (let c = col; c < n; c++) M[r]![c]! -= f * M[col]![c]!;
    }
  }
  return sign * result;
}

export function inv2(A: Mat): Mat | null {
  const d = det2(A);
  if (Math.abs(d) < 1e-12) return null;
  return [
    [A[1]![1]! / d, -A[0]![1]! / d],
    [-A[1]![0]! / d, A[0]![0]! / d],
  ];
}

export function invMatrix(A: Mat): Mat | null {
  const n = A.length;
  const aug = A.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  const { matrix, pivots } = rref(aug, n);
  if (pivots.length < n) return null;
  return matrix.map((row) => row.slice(n));
}

export interface RrefStep {
  matrix: Mat;
  pivots: [number, number][];
  changedRows: number[];
  op: { tr: string; en: string };
}

export function rrefSteps(input: Mat, coeffCols = input[0]?.length ?? 0): {
  steps: RrefStep[];
  matrix: Mat;
  pivots: [number, number][];
  rankA: number;
  rankAug: number;
} {
  const M = input.map((r) => r.map((v) => (Math.abs(v) < 1e-12 ? 0 : v)));
  const rows = M.length;
  const cols = M[0]?.length ?? 0;
  const snap = (): Mat => M.map((r) => r.map((v) => (Math.abs(v) < 1e-10 ? 0 : v)));
  const pivots: [number, number][] = [];
  const steps: RrefStep[] = [
    {
      matrix: snap(),
      pivots: [],
      changedRows: [],
      op: { tr: "Başlangıç matrisi", en: "Initial matrix" },
    },
  ];

  let r = 0;
  for (let c = 0; c < coeffCols && r < rows; c++) {
    let best = r;
    for (let i = r + 1; i < rows; i++) {
      if (Math.abs(M[i]![c]!) > Math.abs(M[best]![c]!)) best = i;
    }
    if (Math.abs(M[best]![c]!) < 1e-10) continue;

    if (best !== r) {
      [M[r], M[best]] = [M[best]!, M[r]!];
      steps.push({
        matrix: snap(),
        pivots: [...pivots],
        changedRows: [r, best],
        op: {
          tr: `Satır değişimi: R${r + 1} ↔ R${best + 1}`,
          en: `Row swap: R${r + 1} ↔ R${best + 1}`,
        },
      });
    }

    const pv = M[r]![c]!;
    if (Math.abs(pv - 1) > 1e-10) {
      for (let j = c; j < cols; j++) M[r]![j]! /= pv;
      steps.push({
        matrix: snap(),
        pivots: [...pivots, [r, c]],
        changedRows: [r],
        op: {
          tr: `Pivotu 1 yap: R${r + 1} ← R${r + 1} / ${Number(pv.toFixed(2))}`,
          en: `Normalize pivot: R${r + 1} ← R${r + 1} / ${Number(pv.toFixed(2))}`,
        },
      });
    }

    pivots.push([r, c]);

    for (let i = 0; i < rows; i++) {
      if (i === r) continue;
      const factor = M[i]![c]!;
      if (Math.abs(factor) < 1e-10) continue;
      for (let j = c; j < cols; j++) M[i]![j]! -= factor * M[r]![j]!;
      const sign = factor > 0 ? "−" : "+";
      const mag = Number(Math.abs(factor).toFixed(2));
      steps.push({
        matrix: snap(),
        pivots: [...pivots],
        changedRows: [i],
        op: {
          tr: `Yok etme: R${i + 1} ← R${i + 1} ${sign} ${mag}·R${r + 1}`,
          en: `Eliminate: R${i + 1} ← R${i + 1} ${sign} ${mag}·R${r + 1}`,
        },
      });
    }
    r++;
  }

  const finalM = snap();
  const rankA = pivots.length;
  let rankAug = rankA;
  if (cols > coeffCols) {
    for (let i = rankA; i < rows; i++) {
      const hasRhs = finalM[i]!.slice(coeffCols).some((v) => Math.abs(v) > 1e-8);
      if (hasRhs) {
        rankAug = rankA + 1;
        break;
      }
    }
  }

  return { steps, matrix: finalM, pivots, rankA, rankAug };
}

export function rref(input: Mat, coeffCols = input[0]?.length ?? 0) {
  const res = rrefSteps(input, coeffCols);
  return { matrix: res.matrix, pivots: res.pivots, rankA: res.rankA, rankAug: res.rankAug };
}

export function solveLinear(A: Mat, b: readonly number[]): Vec | null {
  const n = A[0]?.length ?? 0;
  const aug = A.map((row, i) => [...row, b[i]!]);
  const res = rref(aug, n);
  if (res.rankAug > res.rankA || res.rankA < n) return null;
  return Array.from({ length: n }, (_, i) => res.matrix[i]![n]!);
}

// =====================================================================
// Gram–Schmidt & Least Squares
// =====================================================================
export function gramSchmidt(vectors: Vec[]): { orthogonal: Vec[]; orthonormal: Vec[] } {
  const orthogonal: Vec[] = [];
  const orthonormal: Vec[] = [];
  for (const v of vectors) {
    let u = [...v];
    for (const q of orthonormal) {
      const coeff = vDot(u, q);
      u = vSub(u, vScale(q, coeff));
    }
    orthogonal.push(u);
    const len = vNorm(u);
    orthonormal.push(len > 1e-10 ? vScale(u, 1 / len) : u.map(() => 0));
  }
  return { orthogonal, orthonormal };
}

export function leastSquaresPoly(points: readonly [number, number][], degree: number): {
  coeffs: Vec;
  ssr: number;
  r2: number;
} {
  const A: Mat = points.map(([x]) => Array.from({ length: degree + 1 }, (_, p) => x ** p));
  const y = points.map(([, py]) => py);
  const At = matTranspose(A);
  const AtA = matMul(At, A);
  const Aty = matVec(At, y);
  const coeffs = solveLinear(AtA, Aty) ?? Array(degree + 1).fill(0);
  const pred = (x: number) => coeffs.reduce((s, c, p) => s + c * x ** p, 0);
  const meanY = y.reduce((a, b) => a + b, 0) / Math.max(1, y.length);
  const ssr = points.reduce((s, [x, py]) => s + (py - pred(x)) ** 2, 0);
  const sst = y.reduce((s, py) => s + (py - meanY) ** 2, 0);
  const r2 = sst > 1e-12 ? 1 - ssr / sst : 1;
  return { coeffs, ssr, r2 };
}

// =====================================================================
// Calculus & Series
// =====================================================================
export const numDiff = (f: (x: number) => number, x: number, h = 1e-5): number =>
  (f(x + h) - f(x - h)) / (2 * h);

export const numDiff2 = (f: (x: number) => number, x: number, h = 1e-4): number =>
  (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);

export function simpson(f: (x: number) => number, a: number, b: number, n = 200): number {
  const steps = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / steps;
  let sum = f(a) + f(b);
  for (let i = 1; i < steps; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (sum * h) / 3;
}

export function riemannSum(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  mode: "left" | "right" | "mid" | "trap" = "left",
): number {
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    if (mode === "left") sum += f(x0) * dx;
    else if (mode === "right") sum += f(x1) * dx;
    else if (mode === "mid") sum += f((x0 + x1) / 2) * dx;
    else sum += ((f(x0) + f(x1)) / 2) * dx;
  }
  return sum;
}

export function newtonRaphson(
  f: (x: number) => number,
  df: (x: number) => number,
  x0: number,
  steps = 8,
): number[] {
  const xs = [x0];
  let x = x0;
  for (let i = 0; i < steps; i++) {
    const d = df(x);
    if (Math.abs(d) < 1e-12) break;
    x = x - f(x) / d;
    xs.push(x);
    if (Math.abs(f(x)) < 1e-12) break;
  }
  return xs;
}

export function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function taylorSin(x: number, maxDeg: number): number {
  let s = 0;
  for (let k = 0; 2 * k + 1 <= maxDeg; k++) {
    const p = 2 * k + 1;
    s += ((k % 2 === 0 ? 1 : -1) * x ** p) / factorial(p);
  }
  return s;
}

export function taylorCos(x: number, maxDeg: number): number {
  let s = 0;
  for (let k = 0; 2 * k <= maxDeg; k++) {
    const p = 2 * k;
    s += ((k % 2 === 0 ? 1 : -1) * x ** p) / factorial(p);
  }
  return s;
}

export function taylorExp(x: number, maxDeg: number): number {
  let s = 0;
  for (let k = 0; k <= maxDeg; k++) s += x ** k / factorial(k);
  return s;
}

export function taylorLn1p(x: number, maxDeg: number): number {
  let s = 0;
  for (let k = 1; k <= maxDeg; k++) s += ((k % 2 === 1 ? 1 : -1) * x ** k) / k;
  return s;
}

export function pSeriesSum(p: number, n: number): number {
  let s = 0;
  for (let k = 1; k <= n; k++) s += 1 / k ** p;
  return s;
}

export function geometricPartialSum(r: number, n: number): number {
  if (Math.abs(r - 1) < 1e-12) return n + 1;
  return (1 - r ** (n + 1)) / (1 - r);
}

// =====================================================================
// Complex Numbers
// =====================================================================
export interface Complex {
  re: number;
  im: number;
}

export const cAdd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im });
export const cSub = (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im });
export const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
export const cDiv = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
export const cConj = (z: Complex): Complex => ({ re: z.re, im: -z.im });
export const cMod = (z: Complex): number => Math.hypot(z.re, z.im);
export const cArg = (z: Complex): number => Math.atan2(z.im, z.re);
export const cFromPolar = (r: number, theta: number): Complex => ({
  re: r * Math.cos(theta),
  im: r * Math.sin(theta),
});
export const cPow = (z: Complex, n: number): Complex => cFromPolar(cMod(z) ** n, cArg(z) * n);

export function cNthRoots(w: Complex, n: number): Complex[] {
  const r = cMod(w) ** (1 / n);
  const theta = cArg(w);
  return Array.from({ length: n }, (_, k) => cFromPolar(r, (theta + 2 * Math.PI * k) / n));
}
