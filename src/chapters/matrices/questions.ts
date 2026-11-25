import type { PracticeSection } from "../../shared/practice.ts";
import { matMul, matVec } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-mx-ops",
    title: { tr: "Matris çarpımı, boyutlar ve transpoz", en: "Matrix multiplication, dimensions & transpose" },
    intro: { tr: R`Matris-vektör ve matris-matris çarpımları.`, en: R`Matrix-vector and matrix-matrix products.` },
    read: { tab: "theory", section: "mx-transform" },
    questions: [
      {
        id: "mx-q1",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}2 & -1\\ 3 & 4\end{bmatrix}\) ve \(\mathbf x = \begin{bmatrix}3\\ 2\end{bmatrix}\) ise \(A\mathbf x\) vektörünün 1. bileşeni kaçtır?`,
          en: R`For \(A = \begin{bmatrix}2 & -1\\ 3 & 4\end{bmatrix}\) and \(\mathbf x = \begin{bmatrix}3\\ 2\end{bmatrix}\), what is the first component of \(A\mathbf x\)?`,
        },
        label: { tr: R`\((A\mathbf x)_1 =\)`, en: R`\((A\mathbf x)_1 =\)` },
        answer: 4,
        compute: () => matVec([[2, -1], [3, 4]], [3, 2])[0]!,
        hint: { tr: R`İlk satır ile vektörün nokta çarpımını alın: \(2\cdot 3 + (-1)\cdot 2\).`, en: R`Take the dot product of row 1 with \(\mathbf x\): \(2\cdot 3 + (-1)\cdot 2\).` },
        explain: { tr: R`\(2\cdot 3 + (-1)\cdot 2 = 6 - 2 = 4\).`, en: R`\(2\cdot 3 + (-1)\cdot 2 = 6 - 2 = 4\).` },
      },
      {
        id: "mx-q2",
        kind: "choice",
        q: {
          tr: R`\(A\) boyutu \(3\times 4\) ve \(B\) boyutu \(4\times 2\) ise \(AB\)'nin boyutu nedir?`,
          en: R`If \(A\) is \(3\times 4\) and \(B\) is \(4\times 2\), what is the size of \(AB\)?`,
        },
        options: [
          {
            text: { tr: R`\(4\times 4\)`, en: R`\(4\times 4\)` },
            why: { tr: R`İç boyutlar (4) eşleşip sadeleşir, dış boyutlar kalır.`, en: R`The inner dimensions (4) contract; outer dimensions remain.` },
          },
          { text: { tr: R`\(3\times 2\)`, en: R`\(3\times 2\)` } },
          {
            text: { tr: "Tanımsızdır", en: "Undefined" },
            why: { tr: R`\(A\)'nın sütun sayısı (4), \(B\)'nin satır sayısına (4) eşit olduğundan çarpım tanımlıdır.`, en: R`Columns of \(A\) (4) match rows of \(B\) (4), so \(AB\) is defined.` },
          },
        ],
        answer: 1,
        explain: { tr: R`\((3\times 4)\cdot(4\times 2) \to 3\times 2\).`, en: R`\((3\times 4)\cdot(4\times 2) \to 3\times 2\).` },
      },
      {
        id: "mx-q3",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}1 & 2\\ 0 & 1\end{bmatrix}\) ve \(B = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\) için \((AB)_{11}\) girişi kaçtır?`,
          en: R`For \(A = \begin{bmatrix}1 & 2\\ 0 & 1\end{bmatrix}\) and \(B = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\), what is \((AB)_{11}\)?`,
        },
        label: { tr: R`\((AB)_{11} =\)`, en: R`\((AB)_{11} =\)` },
        answer: 2,
        compute: () => matMul([[1, 2], [0, 1]], [[0, -1], [1, 0]])[0]![0]!,
        hint: { tr: R`\(A\)'nın 1. satırı ile \(B\)'nin 1. sütununu çarpıp toplayın.`, en: R`Dot row 1 of \(A\) with column 1 of \(B\).` },
        explain: { tr: R`\(1\cdot 0 + 2\cdot 1 = 2\).`, en: R`\(1\cdot 0 + 2\cdot 1 = 2\).` },
      },
      {
        id: "mx-q4",
        kind: "choice",
        q: {
          tr: R`\((ABC)^T\) ifadesi hangisine eşittir?`,
          en: R`Which expression equals \((ABC)^T\)?`,
        },
        options: [
          {
            text: { tr: R`\(A^T B^T C^T\)`, en: R`\(A^T B^T C^T\)` },
            why: { tr: R`Transpoz çarpım sırasını ters çevirir.`, en: R`Transpose reverses multiplication order.` },
          },
          {
            text: { tr: R`\(B^T A^T C^T\)`, en: R`\(B^T A^T C^T\)` },
            why: { tr: R`Tüm faktörlerin sırası baştan sona tersine döner.`, en: R`All three factors reverse completely.` },
          },
          { text: { tr: R`\(C^T B^T A^T\)`, en: R`\(C^T B^T A^T\)` } },
        ],
        answer: 2,
        explain: { tr: R`\(((AB)C)^T = C^T (AB)^T = C^T B^T A^T\).`, en: R`\(((AB)C)^T = C^T (AB)^T = C^T B^T A^T\).` },
      },
    ],
  },
];
