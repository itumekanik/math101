import type { PracticeSection } from "../../shared/practice.ts";
import { det2, det3, inv2, matVec, vNorm } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-sq-det",
    title: { tr: "Determinant ve ölçekleme kuralları", en: "Determinants & scaling laws" },
    intro: {
      tr: R`\(2\times 2\) ve \(3\times 3\) determinant hesapları ile \(\det(cA)\) ölçekleme tuzağı.`,
      en: R`Computing \(2\times 2\) and \(3\times 3\) determinants and avoiding the \(\det(cA)\) trap.`,
    },
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
        hint: {
          tr: R`Ana köşegen çarpımından ters köşegen çarpımını çıkarın: \(ad - bc = 4\cdot 5 - 3\cdot 2\).`,
          en: R`Subtract the off-diagonal product from the main diagonal: \(ad - bc = 4\cdot 5 - 3\cdot 2\).`,
        },
        explain: {
          tr: R`\(\det(A) = 4\cdot 5 - 3\cdot 2 = 20 - 6 = 14\). Pozitif olduğundan yönelim korunur ve alan \(14\) kat büyür.`,
          en: R`\(\det(A) = 4\cdot 5 - 3\cdot 2 = 20 - 6 = 14\). Since \(14 > 0\), orientation is preserved and area scales by \(14\).`,
        },
      },
      {
        id: "sq-q2",
        kind: "number",
        q: {
          tr: R`\(A\) bir \(3\times 3\) matris ve \(\det(A) = 5\) ise \(\det(2A)\) kaçtır?`,
          en: R`If \(A\) is a \(3\times 3\) matrix with \(\det(A) = 5\), what is \(\det(2A)\)?`,
        },
        label: { tr: R`\(\det(2A) =\)`, en: R`\(\det(2A) =\)` },
        answer: 40,
        compute: () => 2 ** 3 * 5,
        hint: {
          tr: R`Dikkat: \(2A\) her üç satırı da \(2\) ile çarpar! \(\det(cA) = c^n \det(A)\) formülünde \(n = 3\) alın.`,
          en: R`Careful: \(2A\) scales all three rows by \(2\)! Use \(\det(cA) = c^n \det(A)\) with \(n = 3\).`,
        },
        explain: {
          tr: R`\(3\times 3\) matriste 3 boyutun her biri \(2\) katına çıkar, yani hacim \(2^3 = 8\) kat büyür: \(\det(2A) = 2^3 \cdot 5 = 40\).`,
          en: R`In 3D, scaling all 3 axes by \(2\) multiplies volume by \(2^3 = 8\): \(\det(2A) = 2^3 \cdot 5 = 40\).`,
        },
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
        hint: {
          tr: R`Üçgensel matriste köşegen dışındaki sayılar determinanta etki etmez — yalnızca köşegeni çarpın!`,
          en: R`Off-diagonal entries do not affect a triangular determinant — just multiply the main diagonal!`,
        },
        explain: {
          tr: R`Üst üçgensel matrisin determinantı köşegen elemanlarının çarpımıdır: \(2 \cdot (-4) \cdot 3 = -24\).`,
          en: R`The determinant of any triangular matrix equals the product of its diagonal entries: \(2 \cdot (-4) \cdot 3 = -24\).`,
        },
      },
    ],
  },

  {
    id: "px-sq-inv",
    title: { tr: "Ters matris hesaplama ve çarpım tersi", en: "Computing inverses & the reversal law" },
    intro: {
      tr: R`\(2\times 2\) ters matris formülü ve çarpımın tersi kuralı.`,
      en: R`Applying the \(2\times 2\) inverse formula and the product-inverse reversal rule.`,
    },
    read: { tab: "theory", section: "sq-inv" },
    questions: [
      {
        id: "sq-q4",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}5 & 2\\ 2 & 1\end{bmatrix}\) matrisinin tersi \(A^{-1}\)'in \((1, 2)\) konumundaki elemanı kaçtır?`,
          en: R`For \(A = \begin{bmatrix}5 & 2\\ 2 & 1\end{bmatrix}\), what is the \((1, 2)\) entry of \(A^{-1}\)?`,
        },
        label: { tr: R`\((A^{-1})_{12} =\)`, en: R`\((A^{-1})_{12} =\)` },
        answer: -2,
        compute: () => inv2([[5, 2], [2, 1]])![0]![1]!,
        hint: {
          tr: R`Önce \(\det(A) = 5\cdot 1 - 2\cdot 2 = 1\) bulun, sonra ters köşegendeki \(2\)'nin işaretini çevirin!`,
          en: R`First find \(\det(A) = 5\cdot 1 - 2\cdot 2 = 1\), then negate the off-diagonal entry \(2\)!`,
        },
        explain: {
          tr: R`\(\det(A) = 5 - 4 = 1\) olduğundan \(A^{-1} = \begin{bmatrix}1 & -2\\ -2 & 5\end{bmatrix}\). Dolayısıyla \((A^{-1})_{12} = -2\).`,
          en: R`Since \(\det(A) = 5 - 4 = 1\), \(A^{-1} = \begin{bmatrix}1 & -2\\ -2 & 5\end{bmatrix}\), so \((A^{-1})_{12} = -2\).`,
        },
      },
      {
        id: "sq-q5",
        kind: "choice",
        q: {
          tr: R`\(A\) ve \(B\) tersinir \(n\times n\) matrislerse \((AB)^{-1}\) hangisine eşittir?`,
          en: R`If \(A\) and \(B\) are invertible \(n\times n\) matrices, which expression equals \((AB)^{-1}\)?`,
        },
        options: [
          {
            text: { tr: R`\(A^{-1} B^{-1}\)`, en: R`\(A^{-1} B^{-1}\)` },
            why: {
              tr: R`\((AB)(A^{-1}B^{-1})\) ortadaki \(B\) ile \(A^{-1}\) sadeleşemediği için genelde \(I\) vermez! Sıra ters dönmelidir.`,
              en: R`In \((AB)(A^{-1}B^{-1})\), the middle \(B\) and \(A^{-1}\) cannot cancel in general! You must reverse the order.`,
            },
          },
          { text: { tr: R`\(B^{-1} A^{-1}\)`, en: R`\(B^{-1} A^{-1}\)` } },
          {
            text: { tr: R`\(\dfrac{1}{\det(AB)}\,AB\)`, en: R`\(\dfrac{1}{\det(AB)}\,AB\)` },
            why: {
              tr: R`Bir matrisi kendi determinantına bölmek ters matrisi vermez; örneğin \(2\times 2\)'de köşegenlerin yer ve işaret değiştirmesi gerekir.`,
              en: R`Dividing a matrix by its determinant does not invert it — even for \(2\times 2\) you must swap and negate entries.`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Çorap–ayakkabı kuralı: \((AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = I\), dolayısıyla \((AB)^{-1} = B^{-1}A^{-1}\).`,
          en: R`Socks-and-shoes rule: \((AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = I\), so \((AB)^{-1} = B^{-1}A^{-1}\).`,
        },
      },
    ],
  },

  {
    id: "px-sq-orth",
    title: { tr: "Ortogonal matrisler ve uzunluk koruma", en: "Orthogonal matrices & length preservation" },
    intro: {
      tr: R`\(Q^T Q = I\) koşulunun determinant ve vektör uzunluğu üzerindeki sonuçları.`,
      en: R`Consequences of \(Q^T Q = I\) for determinants and vector lengths.`,
    },
    read: { tab: "theory", section: "sq-orth" },
    questions: [
      {
        id: "sq-q6",
        kind: "choice",
        q: {
          tr: R`Ortogonal bir matris \(Q\) (\(Q^T Q = I\)) için \(\det(Q)\) hangi değerleri alabilir?`,
          en: R`For an orthogonal matrix \(Q\) (\(Q^T Q = I\)), what values can \(\det(Q)\) take?`,
        },
        options: [
          {
            text: { tr: R`Yalnızca \(+1\)`, en: R`Only \(+1\)` },
            why: {
              tr: R`Yansımalar (örneğin \(\begin{bmatrix}1 & 0\\ 0 & -1\end{bmatrix}\)) da ortogonaldir ve determinantları \(-1\)'dir!`,
              en: R`Reflections (such as \(\begin{bmatrix}1 & 0\\ 0 & -1\end{bmatrix}\)) are also orthogonal and have determinant \(-1\)!`,
            },
          },
          { text: { tr: R`Yalnızca \(+1\) veya \(-1\)`, en: R`Only \(+1\) or \(-1\)` } },
          {
            text: { tr: "Sıfırdan farklı herhangi bir reel sayı", en: "Any nonzero real number" },
            why: {
              tr: R`\((\det Q)^2 = \det(Q^T Q) = \det(I) = 1\) eşitliği \(\det(Q)\)'yu yalnızca \(\pm 1\) değerlerine kilitler.`,
              en: R`\((\det Q)^2 = \det(Q^T Q) = \det(I) = 1\) restricts \(\det Q\) strictly to \(\pm 1\).`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(\det(Q^T Q) = \det(Q^T)\det(Q) = (\det Q)^2 = \det(I) = 1 \implies \det(Q) = +1\) (dönme) veya \(-1\) (yansıma).`,
          en: R`\(\det(Q^T Q) = (\det Q)^2 = \det(I) = 1 \implies \det Q = +1\) (rotation) or \(-1\) (reflection).`,
        },
      },
      {
        id: "sq-q7",
        kind: "predict",
        q: {
          tr: R`Ortogonal dönme matrisi \(Q = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\) uzunluğu \(\|\mathbf x\| = 5\) olan \(\mathbf x = (3, 4)\) vektörüne uygulanıyor. Yeni vektör \(Q\mathbf x\)'in uzunluğu \(\|Q\mathbf x\|\) kaç olur?`,
          en: R`The orthogonal rotation \(Q = \begin{bmatrix}0 & -1\\ 1 & 0\end{bmatrix}\) is applied to \(\mathbf x = (3, 4)\), which has length \(\|\mathbf x\| = 5\). Predict the length \(\|Q\mathbf x\|\)!`,
        },
        options: [
          { tr: R`Değişmez: \(\|Q\mathbf x\| = 5\)`, en: R`Unchanged: \(\|Q\mathbf x\| = 5\)` },
          { tr: R`Bileşenler toplamı olur: \(\|Q\mathbf x\| = 7\)`, en: R`Becomes the sum of entries: \(\|Q\mathbf x\| = 7\)` },
          { tr: R`Karesi alınır: \(\|Q\mathbf x\| = 25\)`, en: R`Gets squared: \(\|Q\mathbf x\| = 25\)` },
        ],
        answer: 0,
        run() {
          const Q = [[0, -1], [1, 0]];
          const x = [3, 4];
          const qx = matVec(Q, x);
          const len = vNorm(qx);
          return {
            answer: Math.abs(len - 5) < 1e-9 ? 0 : Math.abs(len - 7) < 1e-9 ? 1 : 2,
            result: {
              tr: R`\(Q\mathbf x = (${qx[0]}, ${qx[1]}) \implies \|Q\mathbf x\| = \sqrt{(${qx[0]})^2 + ${qx[1]}^2} = \sqrt{25} = ${len}\).`,
              en: R`\(Q\mathbf x = (${qx[0]}, ${qx[1]}) \implies \|Q\mathbf x\| = \sqrt{(${qx[0]})^2 + ${qx[1]}^2} = \sqrt{25} = ${len}\).`,
            },
          };
        },
        tryIt: { tab: "theory", section: "sq-orth" },
        explain: {
          tr: R`Her ortogonal matris uzunlukları birebir korur: \(\|Q\mathbf x\| = \|\mathbf x\| = 5\). Burada \(Q\mathbf x = (-4, 3)\) sadece \(90^\circ\) dönmüştür, boyu değişmemiştir!`,
          en: R`Every orthogonal matrix preserves lengths identically: \(\|Q\mathbf x\| = \|\mathbf x\| = 5\). Here \(Q\mathbf x = (-4, 3)\) is simply rotated by \(90^\circ\) with the exact same length!`,
        },
      },
    ],
  },
];
