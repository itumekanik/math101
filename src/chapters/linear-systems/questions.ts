import type { PracticeSection } from "../../shared/practice.ts";
import { rref, solveLinear } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ls-main",
    title: { tr: "Gauss yok etme, rank ve çözüm sayısı", en: "Elimination, rank & solution counts" },
    intro: { tr: R`Rouché–Capelli teoremi ve RREF okuma alıştırmaları.`, en: R`Rouché–Capelli theorem and reading solutions from RREF.` },
    read: { tab: "theory", section: "ls-gauss" },
    questions: [
      {
        id: "ls-q1",
        kind: "number",
        q: {
          tr: R`\(x + 2y = 5\) ve \(3x - y = 1\) sisteminin tek çözümünde \(x\) kaçtır?`,
          en: R`In the unique solution to \(x + 2y = 5\) and \(3x - y = 1\), what is \(x\)?`,
        },
        label: { tr: R`\(x =\)`, en: R`\(x =\)` },
        answer: 1,
        compute: () => solveLinear([[1, 2], [3, -1]], [5, 1])![0]!,
        hint: { tr: R`İkinci denklemi 2 ile çarpıp birinciyle toplayın: \(7x = 7\).`, en: R`Multiply the second equation by 2 and add to the first: \(7x = 7\).` },
        explain: { tr: R`\(7x = 7 \implies x = 1\), yerine koyunca \(y = 2\).`, en: R`\(7x = 7 \implies x = 1\), giving \(y = 2\).` },
      },
      {
        id: "ls-q2",
        kind: "choice",
        q: {
          tr: R`Bir \(3\times 4\) sistemde \(\operatorname{rank}(A) = 2\) ve \(\operatorname{rank}([A\mid\mathbf b]) = 2\) ise çözüm kümesi nasıldır?`,
          en: R`For a \(3\times 4\) system with \(\operatorname{rank}(A) = 2\) and \(\operatorname{rank}([A\mid\mathbf b]) = 2\), what is the solution set?`,
        },
        options: [
          {
            text: { tr: "Tek çözüm vardır", en: "Unique solution" },
            why: { tr: R`Tek çözüm için \(\operatorname{rank}(A) = n = 4\) gerekir.`, en: R`Uniqueness requires \(\operatorname{rank}(A) = n = 4\).` },
          },
          { text: { tr: "2 serbest parametreli sonsuz çözüm vardır", en: "Infinitely many solutions with 2 free parameters" } },
          {
            text: { tr: "Çözüm yoktur", en: "No solution" },
            why: { tr: R`Ranklar eşit olduğundan sistem tutarlıdır.`, en: R`Equal ranks guarantee consistency.` },
          },
        ],
        answer: 1,
        explain: { tr: R`Tutarlıdır ve serbest değişken sayısı \(n - r = 4 - 2 = 2\)'dir.`, en: R`The system is consistent with \(n - r = 4 - 2 = 2\) free variables.` },
      },
      {
        id: "ls-q3",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}1 & 2 & 3\\ 2 & 4 & 6\\ 0 & 1 & 1\end{bmatrix}\) matrisinin rankı kaçtır?`,
          en: R`What is the rank of \(A = \begin{bmatrix}1 & 2 & 3\\ 2 & 4 & 6\\ 0 & 1 & 1\end{bmatrix}\)?`,
        },
        label: { tr: R`\(\operatorname{rank}(A) =\)`, en: R`\(\operatorname{rank}(A) =\)` },
        answer: 2,
        compute: () => rref([[1, 2, 3], [2, 4, 6], [0, 1, 1]], 3).rankA,
        hint: { tr: R`2. satır, 1. satırın tam 2 katıdır; yok edince sıfırlanır.`, en: R`Row 2 is twice row 1, so it zeroes out during elimination.` },
        explain: { tr: R`\(R_2 \leftarrow R_2 - 2R_1\) sıfır satırı verir; kalan iki satır bağımsızdır, yani \(\operatorname{rank}(A) = 2\).`, en: R`\(R_2 \leftarrow R_2 - 2R_1\) produces a zero row; the remaining two rows give 2 pivots, so \(\operatorname{rank}(A) = 2\).` },
      },
      {
        id: "ls-q4",
        kind: "choice",
        q: {
          tr: R`Homojen sistem \(A\mathbf x = \mathbf 0\) için aşağıdakilerden hangisi <b>her zaman</b> doğrudur?`,
          en: R`Which statement is <b>always</b> true for a homogeneous system \(A\mathbf x = \mathbf 0\)?`,
        },
        options: [
          { text: { tr: R`En az bir çözümü vardır (\(\mathbf x = \mathbf 0\))`, en: R`It always has at least one solution (\(\mathbf x = \mathbf 0\))` } },
          {
            text: { tr: "Yalnızca tek çözümü vardır", en: "It only ever has one solution" },
            why: { tr: R`Serbest değişken varsa sıfırdan farklı sonsuz çözüm bulunur.`, en: R`Whenever there is a free variable, infinitely many nonzero solutions exist.` },
          },
          {
            text: { tr: "Bilinmeyen sayısı denklem sayısından fazlaysa çözüm yoktur", en: "If unknowns exceed equations, there is no solution" },
            why: { tr: R`Tam tersi: \(n > m\) iken kesinlikle sıfırdan farklı sonsuz çözüm vardır!`, en: R`The opposite: when \(n > m\), infinitely many nontrivial solutions are guaranteed!` },
          },
        ],
        answer: 0,
        explain: { tr: R`\(\mathbf x = \mathbf 0\) daima \(A\mathbf 0 = \mathbf 0\) sağlar; homojen bir sistem asla tutarsız olamaz.`, en: R`\(\mathbf x = \mathbf 0\) always satisfies \(A\mathbf 0 = \mathbf 0\), so a homogeneous system is never inconsistent.` },
      },
    ],
  },
];
