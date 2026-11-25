import type { PracticeSection } from "../../shared/practice.ts";
import { det2, det3, inv2 } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-sq-main",
    title: { tr: "Determinant, ters matris ve özellikler", en: "Determinants, inverses & properties" },
    intro: { tr: R`Kare matrislerin determinantı, tersinirliği ve ölçekleme yasaları.`, en: R`Determinants, invertibility, and scaling laws for square matrices.` },
    read: { tab: "theory", section: "sq-det" },
    questions: [
      {
        id: "sq-q1",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}4 & 3\\ 2 & 5\end{bmatrix}\) matrisinin determinantı \(\det(A)\) kaçtır?`,
          en: R`What is \(\det(A)\) for \(A = \begin{bmatrix}4 & 3\\ 2 & 5\end{bmatrix}\)?`,
        },
        label: { tr: R`\(\det(A) =\)`, en: R`\(\det(A) =\)` },
        answer: 14,
        compute: () => det2([[4, 3], [2, 5]]),
        hint: { tr: R`\(ad - bc = 4\cdot 5 - 3\cdot 2\).`, en: R`Compute \(ad - bc = 4\cdot 5 - 3\cdot 2\).` },
        explain: { tr: R`\(20 - 6 = 14\).`, en: R`\(20 - 6 = 14\).` },
      },
      {
        id: "sq-q2",
        kind: "number",
        q: {
          tr: R`\(A\) bir \(3\times 3\) matris ve \(\det(A) = 5\) ise \(\det(2A)\) kaçtır?`,
          en: R`If \(A\) is \(3\times 3\) with \(\det(A) = 5\), what is \(\det(2A)\)?`,
        },
        label: { tr: R`\(\det(2A) =\)`, en: R`\(\det(2A) =\)` },
        answer: 40,
        compute: () => 2 ** 3 * 5,
        hint: { tr: R`\(\det(cA) = c^n \det(A)\) formülünde \(n = 3\) alın.`, en: R`Use \(\det(cA) = c^n \det(A)\) with \(n = 3\).` },
        explain: { tr: R`\(2^3 \cdot 5 = 8 \cdot 5 = 40\).`, en: R`\(2^3 \cdot 5 = 8 \cdot 5 = 40\).` },
      },
      {
        id: "sq-q3",
        kind: "number",
        q: {
          tr: R`Üst üçgensel \(U = \begin{bmatrix}2 & 7 & -3\\ 0 & -4 & 9\\ 0 & 0 & 3\end{bmatrix}\) matrisinin determinantı kaçtır?`,
          en: R`What is the determinant of the upper-triangular matrix \(U = \begin{bmatrix}2 & 7 & -3\\ 0 & -4 & 9\\ 0 & 0 & 3\end{bmatrix}\)?`,
        },
        label: { tr: R`\(\det(U) =\)`, en: R`\(\det(U) =\)` },
        answer: -24,
        compute: () => det3([[2, 7, -3], [0, -4, 9], [0, 0, 3]]),
        hint: { tr: R`Üçgensel matrisin determinantı köşegen elemanlarının çarpımıdır.`, en: R`The determinant of a triangular matrix is the product of its diagonal entries.` },
        explain: { tr: R`\(2 \cdot (-4) \cdot 3 = -24\).`, en: R`\(2 \cdot (-4) \cdot 3 = -24\).` },
      },
      {
        id: "sq-q4",
        kind: "choice",
        q: {
          tr: R`Ortogonal bir matris \(Q\) (\(Q^T Q = I\)) için \(\det(Q)\) hangi değerleri alabilir?`,
          en: R`For an orthogonal matrix \(Q\) (\(Q^T Q = I\)), what values can \(\det(Q)\) take?`,
        },
        options: [
          {
            text: { tr: R`Yalnızca \(+1\)`, en: R`Only \(+1\)` },
            why: { tr: R`Yansımalar da ortogonaldir ve determinantları \(-1\)'dir.`, en: R`Reflections are also orthogonal and have determinant \(-1\).` },
          },
          { text: { tr: R`Yalnızca \(+1\) veya \(-1\)`, en: R`Only \(+1\) or \(-1\)` } },
          {
            text: { tr: "Sıfırdan farklı herhangi bir reel sayı", en: "Any nonzero real number" },
            why: { tr: R`\((\det Q)^2 = \det(Q^T Q) = \det(I) = 1\) zorunluluğu vardır.`, en: R`\((\det Q)^2 = \det(Q^T Q) = 1\) forces \(\det Q = \pm 1\).` },
          },
        ],
        answer: 1,
        compute: () => (inv2([[0, -1], [1, 0]]) !== null ? 1 : -1),
        explain: { tr: R`\(\det(Q^T Q) = \det(Q)^2 = 1 \implies \det(Q) = \pm 1\).`, en: R`\(\det(Q^T Q) = (\det Q)^2 = 1 \implies \det Q = \pm 1\).` },
      },
    ],
  },
];
