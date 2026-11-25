import type { PracticeSection } from "../../shared/practice.ts";
import { inv2, matVec } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-bd-main",
    title: { tr: "Koordinatlar, taban değişimi ve Rank–Sıfırlık", en: "Coordinates, change of basis & Rank–Nullity" },
    intro: { tr: R`Taban koordinatları ve boyut hesapları.`, en: R`Basis coordinates and dimension calculations.` },
    read: { tab: "theory", section: "bd-grid" },
    questions: [
      {
        id: "bd-q1",
        kind: "number",
        q: {
          tr: R`Taban \(\mathcal B = \{(1, 1),\ (1, -1)\}\) iken \(\mathbf x = (5, 1)\) vektörünün ilk \(\mathcal B\)-koordinatı \(c_1\) kaçtır?`,
          en: R`With basis \(\mathcal B = \{(1, 1),\ (1, -1)\}\), what is the first \(\mathcal B\)-coordinate \(c_1\) of \(\mathbf x = (5, 1)\)?`,
        },
        label: { tr: R`\(c_1 =\)`, en: R`\(c_1 =\)` },
        answer: 3,
        compute: () => matVec(inv2([[1, 1], [1, -1]])!, [5, 1])[0]!,
        hint: { tr: R`\(c_1 + c_2 = 5\) ve \(c_1 - c_2 = 1\) sistemini çözün.`, en: R`Solve \(c_1 + c_2 = 5\) and \(c_1 - c_2 = 1\).` },
        explain: { tr: R`İki denklemi toplayınca \(2c_1 = 6 \implies c_1 = 3\) (ve \(c_2 = 2\)).`, en: R`Adding gives \(2c_1 = 6 \implies c_1 = 3\) (and \(c_2 = 2\)).` },
      },
      {
        id: "bd-q2",
        kind: "number",
        q: {
          tr: R`Bir \(4 \times 7\) matrisin rankı \(\operatorname{rank}(A) = 3\) ise çekirdek boyutu \(\dim\ker(A)\) kaçtır?`,
          en: R`If a \(4 \times 7\) matrix has \(\operatorname{rank}(A) = 3\), what is \(\dim\ker(A)\)?`,
        },
        label: { tr: R`\(\dim\ker(A) =\)`, en: R`\(\dim\ker(A) =\)` },
        answer: 4,
        compute: () => 7 - 3,
        hint: { tr: R`Rank–Sıfırlık Teoreminde \(n\) <b>sütun</b> sayısıdır (7).`, en: R`In Rank–Nullity, \(n\) is the number of <b>columns</b> (7).` },
        explain: { tr: R`\(\dim\ker(A) = n - \operatorname{rank}(A) = 7 - 3 = 4\).`, en: R`\(\dim\ker(A) = n - \operatorname{rank}(A) = 7 - 3 = 4\).` },
      },
      {
        id: "bd-q3",
        kind: "choice",
        q: {
          tr: R`\(\mathbb{R}^3\)'ün bir tabanı kaç vektör içerir?`,
          en: R`How many vectors does any basis of \(\mathbb{R}^3\) contain?`,
        },
        options: [
          {
            text: { tr: "En az 3 (daha fazla da olabilir)", en: "At least 3 (possibly more)" },
            why: { tr: R`3'ten fazla vektör \(\mathbb{R}^3\)'te doğrusal bağımlı olur, taban olamaz.`, en: R`More than 3 vectors in \(\mathbb{R}^3\) are necessarily linearly dependent.` },
          },
          { text: { tr: "Her zaman tam olarak 3", en: "Always exactly 3" } },
          {
            text: { tr: "Seçilen tabana göre değişir", en: "Depends on the chosen basis" },
            why: { tr: R`Boyut teoremi gereği bir vektör uzayının tüm tabanları aynı sayıda eleman içerir.`, en: R`By the Dimension Theorem, every basis of a vector space has the exact same size.` },
          },
        ],
        answer: 1,
        explain: { tr: R`\(\dim(\mathbb{R}^3) = 3\) olduğundan her taban tam olarak 3 doğrusal bağımsız vektörden oluşur.`, en: R`Since \(\dim(\mathbb{R}^3) = 3\), every basis has exactly 3 linearly independent vectors.` },
      },
    ],
  },
];
