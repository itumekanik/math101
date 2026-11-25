import type { PracticeSection } from "../../shared/practice.ts";
import { matMul, matTranspose, matVec } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-mx-vec",
    title: { tr: "Matris–vektör çarpımı ve boyutlar", en: "Matrix–vector products & dimensions" },
    intro: {
      tr: R`Sütun bakış açısı, \(A\mathbf x\) hesaplama ve çarpım boyut kuralları.`,
      en: R`The column viewpoint, computing \(A\mathbf x\), and dimension matching rules.`,
    },
    read: { tab: "theory", section: "mx-transform" },
    questions: [
      {
        id: "mat-q1",
        kind: "choice",
        q: {
          tr: R`Bir \(2\times 2\) matris \(A = [\mathbf a_1\ \mathbf a_2]\) düzleme uygulandığında sütun vektörleri \(\mathbf a_1\) ve \(\mathbf a_2\) geometrik olarak neyi gösterir?`,
          en: R`When a \(2\times 2\) matrix \(A = [\mathbf a_1\ \mathbf a_2]\) transforms the plane, what do its columns \(\mathbf a_1\) and \(\mathbf a_2\) represent geometrically?`,
        },
        options: [
          {
            text: {
              tr: R`Standart taban vektörleri \(\mathbf e_1 = (1,0)\) ve \(\mathbf e_2 = (0,1)\)'in dönüştükten sonra vardığı konumları`,
              en: R`The exact landing spots of \(\mathbf e_1 = (1,0)\) and \(\mathbf e_2 = (0,1)\) after the transformation`,
            },
          },
          {
            text: {
              tr: R`Orijinin \((0,0)\) dönüşümden sonra kaydığı iki farklı noktayı`,
              en: R`Two points where the origin \((0,0)\) shifts to after the transformation`,
            },
            why: {
              tr: R`Doğrusal dönüşümlerde \(A\mathbf 0 = \mathbf 0\); orijin asla yerinden oynamaz!`,
              en: R`In every linear map \(A\mathbf 0 = \mathbf 0\); the origin never moves!`,
            },
          },
          {
            text: {
              tr: R`Dönüşümden hiç etkilenmeyen sabit vektörleri`,
              en: R`Vectors that stay completely unchanged by the transformation`,
            },
            why: {
              tr: R`Sütunlar \(\mathbf e_1\) ve \(\mathbf e_2\)'nin yeni görüntüleridir (\(A\mathbf e_1 = \mathbf a_1\)); ancak \(A = I\) iken değişmeden kalırlar.`,
              en: R`Columns record the images \(A\mathbf e_1\) and \(A\mathbf e_2\); they stay unchanged only when \(A = I\).`,
            },
          },
        ],
        answer: 0,
        explain: {
          tr: R`\(A\mathbf e_1 = 1\cdot \mathbf a_1 + 0\cdot \mathbf a_2 = \mathbf a_1\) ve \(A\mathbf e_2 = \mathbf a_2\). Bu yüzden sütunlar standart birim okların yeni adresleridir.`,
          en: R`\(A\mathbf e_1 = 1\cdot\mathbf a_1 + 0\cdot\mathbf a_2 = \mathbf a_1\) and \(A\mathbf e_2 = \mathbf a_2\), so the columns record where the unit basis arrows land.`,
        },
      },
      {
        id: "mat-q2",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}2 & -1\\ 3 & 4\end{bmatrix}\) ve \(\mathbf x = \begin{bmatrix}3\\ 2\end{bmatrix}\) ise \(A\mathbf x\) vektörünün 1. bileşeni kaçtır?`,
          en: R`For \(A = \begin{bmatrix}2 & -1\\ 3 & 4\end{bmatrix}\) and \(\mathbf x = \begin{bmatrix}3\\ 2\end{bmatrix}\), what is the first component of \(A\mathbf x\)?`,
        },
        label: { tr: R`\((A\mathbf x)_1 =\)`, en: R`\((A\mathbf x)_1 =\)` },
        answer: 4,
        compute: () => matVec([[2, -1], [3, 4]], [3, 2])[0]!,
        hint: {
          tr: R`İlk satır \([2, -1]\) ile \(\mathbf x = (3, 2)\) vektörünün nokta çarpımını alın: \(2\cdot 3 + (-1)\cdot 2\).`,
          en: R`Dot row 1 (\([2, -1]\)) with \(\mathbf x = (3, 2)\): \(2\cdot 3 + (-1)\cdot 2\).`,
        },
        explain: {
          tr: R`Satır gözüyle \(2\cdot 3 + (-1)\cdot 2 = 6 - 2 = 4\). Sütun gözüyle \(3\begin{bmatrix}2\\3\end{bmatrix} + 2\begin{bmatrix}-1\\4\end{bmatrix} = \begin{bmatrix}4\\17\end{bmatrix}\), ilk bileşen \(4\)'tür.`,
          en: R`Row view: \(2\cdot 3 + (-1)\cdot 2 = 6 - 2 = 4\). Column view: \(3\begin{bmatrix}2\\3\end{bmatrix} + 2\begin{bmatrix}-1\\4\end{bmatrix} = \begin{bmatrix}4\\17\end{bmatrix}\), so entry 1 is \(4\).`,
        },
      },
      {
        id: "mat-q3",
        kind: "choice",
        q: {
          tr: R`\(A\) boyutu \(3\times 4\) ve \(B\) boyutu \(4\times 2\) ise \(AB\) ve \(BA\) çarpımları hakkında hangisi doğrudur?`,
          en: R`If \(A\) is \(3\times 4\) and \(B\) is \(4\times 2\), which statement about \(AB\) and \(BA\) is true?`,
        },
        options: [
          {
            text: { tr: R`\(AB\) boyutu \(4\times 4\)'tür ve \(BA\) tanımlıdır`, en: R`\(AB\) is \(4\times 4\) and \(BA\) is defined` },
            why: {
              tr: R`Çarpımda iç boyutlar (4) eşleşip kaybolur, dış boyutlar \((3\times 2)\) kalır!`,
              en: R`The inner dimensions (4) contract away; the outer dimensions \((3\times 2)\) remain!`,
            },
          },
          {
            text: { tr: R`\(AB\) boyutu \(3\times 2\)'dir, ancak \(BA\) tanımsızdır`, en: R`\(AB\) is \(3\times 2\), while \(BA\) is undefined` },
          },
          {
            text: { tr: R`İkisi de tanımsızdır çünkü kare matris değillerdir`, en: R`Both are undefined because the matrices are not square` },
            why: {
              tr: R`Matris çarpımı için kare olmak gerekmez; sadece soldakinin sütun sayısı sağdakinin satır sayısına eşit olmalıdır (\(4 = 4\)).`,
              en: R`Matrices do not need to be square to multiply; only columns of left = rows of right (\(4 = 4\)) is needed.`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(AB\): \((3\times 4)\cdot(4\times 2) \to 3\times 2\) (iç boyutlar \(4=4\) uyuşur). \(BA\): \((4\times 2)\cdot(3\times 4)\) iç boyutlar \(2 \ne 3\) olduğundan tanımsızdır!`,
          en: R`\(AB\): \((3\times 4)\cdot(4\times 2) \to 3\times 2\) (inner \(4 = 4\) matches). \(BA\): \((4\times 2)\cdot(3\times 4)\) fails since \(2 \ne 3\), so \(BA\) is undefined!`,
        },
      },
    ],
  },

  {
    id: "px-mx-prod",
    title: { tr: "Matris çarpımı ve sıra etkisi (AB ≠ BA)", en: "Matrix products & order sensitivity (AB ≠ BA)" },
    intro: {
      tr: R`İki dönüşümün bileşkesini hesaplama ve sırayı değiştirmenin etkisini tahmin etme.`,
      en: R`Computing compositions and predicting the effect of reversing multiplication order.`,
    },
    read: { tab: "theory", section: "mx-comp" },
    questions: [
      {
        id: "mat-q4",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}1 & 2\\ 0 & 1\end{bmatrix}\) ve \(B = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\) için \((AB)_{11}\) girişi kaçtır?`,
          en: R`For \(A = \begin{bmatrix}1 & 2\\ 0 & 1\end{bmatrix}\) and \(B = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\), what is the \((1, 1)\) entry \((AB)_{11}\)?`,
        },
        label: { tr: R`\((AB)_{11} =\)`, en: R`\((AB)_{11} =\)` },
        answer: 2,
        compute: () => matMul([[1, 2], [0, 1]], [[0, -1], [1, 0]])[0]![0]!,
        hint: {
          tr: R`\(A\)'nın 1. satırı \([1, 2]\) ile \(B\)'nin 1. sütunu \([0, 1]^T\) çarpılıp toplanır.`,
          en: R`Dot row 1 of \(A\) (\([1, 2]\)) with column 1 of \(B\) (\([0, 1]^T\)).`,
        },
        explain: {
          tr: R`\((AB)_{11} = 1\cdot 0 + 2\cdot 1 = 0 + 2 = 2\). (Sakın eleman eleman \(1\cdot 0 = 0\) yapmayın!)`,
          en: R`\((AB)_{11} = 1\cdot 0 + 2\cdot 1 = 0 + 2 = 2\). (Not entrywise \(1\cdot 0 = 0\)!)`,
        },
      },
      {
        id: "mat-q5",
        kind: "predict",
        q: {
          tr: R`Bir önceki sorudaki \(A = \begin{bmatrix}1 & 2\\ 0 & 1\end{bmatrix}\) ve \(B = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\) için \((AB)_{11} = 2\) bulmuştuk. Sırayı çevirip \(BA\) hesaplarsak \((BA)_{11}\) ne olur?`,
          en: R`For the same \(A = \begin{bmatrix}1 & 2\\ 0 & 1\end{bmatrix}\) and \(B = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\), we found \((AB)_{11} = 2\). If we reverse the order to \(BA\), what happens to \((BA)_{11}\)?`,
        },
        options: [
          { tr: R`Değişmez: \(AB = BA\) olduğundan \((BA)_{11} = 2\)`, en: R`Unchanged: \(AB = BA\), so \((BA)_{11} = 2\)` },
          { tr: R`Sıra sonucu değiştirir: \(AB \ne BA\) ve \((BA)_{11} = 0\)`, en: R`Order changes the result: \(AB \ne BA\) and \((BA)_{11} = 0\)` },
          { tr: R`Sadece işaret değişir: \((BA)_{11} = -2\)`, en: R`Only the sign flips: \((BA)_{11} = -2\)` },
        ],
        answer: 1,
        run() {
          const A = [[1, 2], [0, 1]];
          const B = [[0, -1], [1, 0]];
          const ab = matMul(A, B);
          const ba = matMul(B, A);
          const val = ba[0]![0]!;
          return {
            answer: val === 0 ? 1 : val === 2 ? 0 : 2,
            result: {
              tr: R`\(AB = \begin{bmatrix}${ab[0]![0]} & ${ab[0]![1]}\\ ${ab[1]![0]} & ${ab[1]![1]}\end{bmatrix}\), ama \(BA = \begin{bmatrix}${ba[0]![0]} & ${ba[0]![1]}\\ ${ba[1]![0]} & ${ba[1]![1]}\end{bmatrix}\), yani \((BA)_{11} = ${val}\).`,
              en: R`\(AB = \begin{bmatrix}${ab[0]![0]} & ${ab[0]![1]}\\ ${ab[1]![0]} & ${ab[1]![1]}\end{bmatrix}\), whereas \(BA = \begin{bmatrix}${ba[0]![0]} & ${ba[0]![1]}\\ ${ba[1]![0]} & ${ba[1]![1]}\end{bmatrix}\), so \((BA)_{11} = ${val}\).`,
            },
          };
        },
        tryIt: { tab: "theory", section: "mx-comp" },
        explain: {
          tr: R`\((BA)_{11}\) için \(B\)'nin 1. satırı \([0, -1]\) ile \(A\)'nın 1. sütunu \([1, 0]^T\) çarpılır: \(0\cdot 1 + (-1)\cdot 0 = 0\). Kaydırma ile dönme değişmeli değildir!`,
          en: R`For \((BA)_{11}\), dot row 1 of \(B\) (\([0, -1]\)) with column 1 of \(A\) (\([1, 0]^T\)): \(0\cdot 1 + (-1)\cdot 0 = 0\). Shear and rotation do not commute!`,
        },
      },
    ],
  },

  {
    id: "px-mx-trans",
    title: { tr: "Transpoz, simetri ve sınav tuzakları", en: "Transpose, symmetry & exam traps" },
    intro: {
      tr: R`Çarpımın transpozu kuralı ve simetrik matris oluşturma alıştırmaları.`,
      en: R`The product-transpose reversal rule and building symmetric matrices.`,
    },
    read: { tab: "theory", section: "mx-transpose" },
    questions: [
      {
        id: "mat-q6",
        kind: "choice",
        q: {
          tr: R`Uyumlu boyutlardaki \(A, B, C\) matrisleri için \((ABC)^T\) ifadesi hangisine eşittir?`,
          en: R`For matrices \(A, B, C\) of compatible sizes, which expression equals \((ABC)^T\)?`,
        },
        options: [
          {
            text: { tr: R`\(A^T B^T C^T\)`, en: R`\(A^T B^T C^T\)` },
            why: {
              tr: R`Transpoz çarpım sırasını koruyamaz; boyutlar bile uyuşmaz! Sıra tamamen tersine döner.`,
              en: R`Transpose cannot keep the same order (even dimensions fail to match); the order reverses completely.`,
            },
          },
          {
            text: { tr: R`\(B^T A^T C^T\)`, en: R`\(B^T A^T C^T\)` },
            why: {
              tr: R`Yalnızca ilk ikisi değil, üç faktörün hepsi baştan sona ters sıraya dizilmelidir.`,
              en: R`Not just the first two — all three factors must reverse from end to end.`,
            },
          },
          { text: { tr: R`\(C^T B^T A^T\)`, en: R`\(C^T B^T A^T\)` } },
        ],
        answer: 2,
        explain: {
          tr: R`Kuralı iki kez uygularız: \(((AB)C)^T = C^T (AB)^T = C^T B^T A^T\).`,
          en: R`Apply the two-matrix rule twice: \(((AB)C)^T = C^T (AB)^T = C^T B^T A^T\).`,
        },
      },
      {
        id: "mat-q7",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix} 3 & 5 \\ -1 & 2 \end{bmatrix}\) verildiğinde, her zaman simetrik olan \(S = A + A^T\) matrisinin \((1, 2)\) elemanı \(S_{12}\) kaçtır?`,
          en: R`Given \(A = \begin{bmatrix} 3 & 5 \\ -1 & 2 \end{bmatrix}\), what is the \((1, 2)\) entry \(S_{12}\) of the symmetric matrix \(S = A + A^T\)?`,
        },
        label: { tr: R`\(S_{12} =\)`, en: R`\(S_{12} =\)` },
        answer: 4,
        compute: () => {
          const A = [[3, 5], [-1, 2]];
          const At = matTranspose(A);
          return A[0]![1]! + At[0]![1]!;
        },
        hint: {
          tr: R`\((A^T)_{12} = A_{21} = -1\). Şimdi \(A_{12} + A_{21} = 5 + (-1)\) toplayın!`,
          en: R`\((A^T)_{12} = A_{21} = -1\). Now add \(A_{12} + A_{21} = 5 + (-1)\)!`,
        },
        explain: {
          tr: R`\(A^T = \begin{bmatrix} 3 & -1 \\ 5 & 2 \end{bmatrix}\) olduğundan \(S = A + A^T = \begin{bmatrix} 6 & 4 \\ 4 & 4 \end{bmatrix}\). Gördüğünüz gibi \(S_{12} = S_{21} = 4\) (simetrik!).`,
          en: R`Since \(A^T = \begin{bmatrix} 3 & -1 \\ 5 & 2 \end{bmatrix}\), we get \(S = A + A^T = \begin{bmatrix} 6 & 4 \\ 4 & 4 \end{bmatrix}\). Notice \(S_{12} = S_{21} = 4\) (symmetric!).`,
        },
      },
    ],
  },
];
