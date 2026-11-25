import type { PracticeSection } from "../../shared/practice.ts";
import { simpson } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-di-main",
    title: { tr: "Belirli integral, FTC ve genelleştirilmiş integraller", en: "Definite integrals, FTC & improper integrals" },
    intro: { tr: R`Newton–Leibniz formülü, FTC türevi ve genelleştirilmiş integral yakınsaklığı.`, en: R`Newton–Leibniz evaluation, FTC differentiation, and improper convergence.` },
    read: { tab: "theory", section: "di-ftc" },
    questions: [
      {
        id: "di-q1",
        kind: "number",
        q: {
          tr: R`\(\int_0^2 (3x^2 + 1)\,dx\) belirli integralinin değeri kaçtır?`,
          en: R`Evaluate \(\int_0^2 (3x^2 + 1)\,dx\).`,
        },
        label: { tr: "İntegral =", en: "Integral =" },
        answer: 10,
        compute: () => simpson((x) => 3 * x * x + 1, 0, 2, 20),
        hint: { tr: R`İlkel fonksiyon \(F(x) = x^3 + x\); \(F(2) - F(0)\) hesaplayın.`, en: R`Antiderivative \(F(x) = x^3 + x\); compute \(F(2) - F(0)\).` },
        explain: { tr: R`\([x^3 + x]_0^2 = (8 + 2) - 0 = 10\).`, en: R`\([x^3 + x]_0^2 = (8 + 2) - 0 = 10\).` },
      },
      {
        id: "di-q2",
        kind: "number",
        q: {
          tr: R`\(A(x) = \int_1^x \sqrt{t^2 + 9}\,dt\) ise FTC'ye göre \(A'(4)\) kaçtır?`,
          en: R`If \(A(x) = \int_1^x \sqrt{t^2 + 9}\,dt\), what is \(A'(4)\) by the FTC?`,
        },
        label: { tr: R`\(A'(4) =\)`, en: R`\(A'(4) =\)` },
        answer: 5,
        compute: () => Math.sqrt(4 * 4 + 9),
        hint: { tr: R`İntegrali almanıza gerek yok! \(A'(x) = \sqrt{x^2 + 9}\).`, en: R`No integration needed! Just evaluate \(A'(x) = \sqrt{x^2 + 9}\).` },
        explain: { tr: R`FTC 1. Kısım gereği \(A'(4) = \sqrt{16 + 9} = 5\).`, en: R`By FTC Part 1, \(A'(4) = \sqrt{16 + 9} = 5\).` },
      },
      {
        id: "di-q3",
        kind: "number",
        q: {
          tr: R`Genelleştirilmiş integral \(\int_1^\infty \frac{1}{x^3}\,dx\) kaçtır?`,
          en: R`Evaluate the improper integral \(\int_1^\infty \frac{1}{x^3}\,dx\).`,
        },
        label: { tr: "Değer =", en: "Value =" },
        answer: 0.5,
        compute: () => 1 / (3 - 1),
        hint: { tr: R`\(p = 3 > 1\) olduğundan \(\frac{1}{p-1}\) formülü uygulanır.`, en: R`Since \(p = 3 > 1\), use \(\frac{1}{p-1}\).` },
        explain: { tr: R`\(\lim_{b\to\infty}\left[-\frac{1}{2x^2}\right]_1^b = 0 - (-1/2) = 0{,}5\).`, en: R`\(\lim_{b\to\infty}\left[-\frac{1}{2x^2}\right]_1^b = 0.5\).` },
      },
      {
        id: "di-q4",
        kind: "choice",
        q: {
          tr: R`\(\int_0^{2\pi} \sin x\,dx\) neden 0 çıkar?`,
          en: R`Why is \(\int_0^{2\pi} \sin x\,dx = 0\)?`,
        },
        options: [
          {
            text: { tr: R`\(\sin x\) bu aralıkta hep 0'dır`, en: R`\(\sin x\) is zero everywhere on \([0,2\pi]\)` },
            why: { tr: R`\(\sin x\) sıfırdan farklıdır, ancak pozitif ve negatif alanları eşittir.`, en: R`\(\sin x\) is nonzero; its positive and negative areas cancel.` },
          },
          { text: { tr: "Pozitif [0,π] alanı (+2) ile negatif [π,2π] alanı (−2) birbirini götürür", en: "The positive area (+2) on [0,π] and negative area (−2) on [π,2π] cancel" } },
        ],
        answer: 1,
        compute: () => (Math.abs(simpson(Math.sin, 0, 2 * Math.PI, 40)) < 1e-9 ? 1 : -1),
        explain: { tr: R`Belirli integral işaretli alandır: \(2 + (-2) = 0\). Toplam geometrik alan sorulursa \(\int_0^{2\pi}|\sin x|\,dx = 4\)'tür.`, en: R`Definite integrals measure signed area: \(2 + (-2) = 0\) (total unsigned area is \(4\)).` },
      },
    ],
  },
];
