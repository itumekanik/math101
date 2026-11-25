import type { PracticeSection } from "../../shared/practice.ts";
import { det2, inv2, matVec } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-bd-basis",
    title: { tr: "Taban ve boyut kavramı", en: "Basis & dimension concepts" },
    intro: {
      tr: R`Bir kümenin taban olma koşullarını ve Boyut Teoremini test edin.`,
      en: R`Test the conditions for a basis and apply the Dimension Theorem.`,
    },
    read: { tab: "theory", section: "bd-what" },
    questions: [
      {
        id: "bd-q1",
        kind: "choice",
        q: {
          tr: R`\(\mathbb{R}^3\)'ün geçerli herhangi bir tabanı kaç vektör içerir?`,
          en: R`How many vectors does any valid basis of \(\mathbb{R}^3\) contain?`,
        },
        options: [
          {
            text: { tr: "En az 3 (daha fazla da olabilir)", en: "At least 3 (possibly more)" },
            why: {
              tr: R`3'ten fazla vektör \(\mathbb{R}^3\)'te mutlaka doğrusal bağımlı olur; fazlalık içeren küme taban olamaz.`,
              en: R`More than 3 vectors in \(\mathbb{R}^3\) are necessarily linearly dependent, so they cannot be a basis.`,
            },
          },
          { text: { tr: "Her zaman tam olarak 3", en: "Always exactly 3" } },
          {
            text: { tr: "Seçilen tabana göre 2 veya 3 değişebilir", en: "Can be 2 or 3 depending on the basis" },
            why: {
              tr: R`2 vektör \(\mathbb{R}^3\)'te en fazla bir 2B düzlem gerer, tüm uzayı dolduramaz; Boyut Teoremi tüm tabanların aynı boyutta olduğunu garanti eder.`,
              en: R`2 vectors span at most a 2D plane in \(\mathbb{R}^3\); by the Dimension Theorem every basis has the exact same size.`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(\dim(\mathbb{R}^3) = 3\) olduğundan her taban tam olarak 3 doğrusal bağımsız vektörden oluşur (ne eksik ne fazla!).`,
          en: R`Since \(\dim(\mathbb{R}^3) = 3\), every basis has exactly 3 linearly independent vectors (neither too few nor too many!).`,
        },
      },
      {
        id: "bd-q2",
        kind: "choice",
        q: {
          tr: R`Aşağıdaki kümelerden hangisi \(\mathbb{R}^2\) için geçerli bir <b>tabandır</b>?`,
          en: R`Which of the following sets is a valid <b>basis</b> of \(\mathbb{R}^2\)?`,
        },
        options: [
          {
            text: { tr: R`\(\{(1, 2),\ (2, 4)\}\)`, en: R`\(\{(1, 2),\ (2, 4)\}\)` },
            why: {
              tr: R`\((2, 4) = 2(1, 2)\) olduğu için bağımlıdırlar (\(\det = 0\)) — sadece 1B doğru gererler.`,
              en: R`Since \((2, 4) = 2(1, 2)\), they are dependent (\(\det = 0\)) and span only a 1D line.`,
            },
          },
          { text: { tr: R`\(\{(1, 2),\ (2, 1)\}\)`, en: R`\(\{(1, 2),\ (2, 1)\}\)` } },
          {
            text: { tr: R`\(\{(1, 0),\ (0, 1),\ (1, 1)\}\)`, en: R`\(\{(1, 0),\ (0, 1),\ (1, 1)\}\)` },
            why: {
              tr: R`3 vektör \(\mathbb{R}^2\)'yi gerer ama bağımlıdır (\((1,1) = (1,0)+(0,1)\)), dolayısıyla fazlalık vardır!`,
              en: R`3 vectors span \(\mathbb{R}^2\) but are dependent (\((1,1) = (1,0)+(0,1)\)), so there is redundancy!`,
            },
          },
          {
            text: { tr: R`\(\{(3, -1)\}\)`, en: R`\(\{(3, -1)\}\)` },
            why: {
              tr: R`Tek bir vektör \(\mathbb{R}^2\)'yi geremez — sadece 1 boyutlu bir doğru üretir.`,
              en: R`A single vector cannot span \(\mathbb{R}^2\) — it only generates a 1D line.`,
            },
          },
        ],
        answer: 1,
        compute: () => (det2([[1, 2], [2, 1]]) !== 0 ? 1 : -1),
        explain: {
          tr: R`\(\mathcal{B} = \{(1, 2),\ (2, 1)\}\) tam 2 vektör içerir ve \(\det\begin{bmatrix}1&2\\2&1\end{bmatrix} = 1 - 4 = -3 \ne 0\) olduğundan doğrusal bağımsızdır ve \(\mathbb{R}^2\)'yi gerer.`,
          en: R`\(\mathcal{B} = \{(1, 2),\ (2, 1)\}\) has 2 vectors with \(\det = 1 - 4 = -3 \ne 0\), so it is linearly independent and spans \(\mathbb{R}^2\).`,
        },
      },
    ],
  },
  {
    id: "px-bd-coords",
    title: { tr: "Özel tabanda koordinatlar ve P dönüşümü", en: "Custom-basis coordinates & transition matrix P" },
    intro: {
      tr: R`\(\mathbf{x} = P[\mathbf{x}]_{\mathcal{B}}\) ve \([\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x}\) arasındaki yönü pekiştirin.`,
      en: R`Practice switching cleanly in both directions between \(\mathbf{x}\) and \([\mathbf{x}]_{\mathcal{B}}\).`,
    },
    read: { tab: "theory", section: "bd-grid" },
    questions: [
      {
        id: "bd-q3",
        kind: "number",
        q: {
          tr: R`Taban \(\mathcal{B} = \{(1, 1),\ (1, -1)\}\) iken standart koordinatları \(\mathbf{x} = (5, 1)\) olan vektörün ilk \(\mathcal{B}\)-koordinatı \(c_1\) kaçtır?`,
          en: R`With basis \(\mathcal{B} = \{(1, 1),\ (1, -1)\}\), what is the first \(\mathcal{B}\)-coordinate \(c_1\) of \(\mathbf{x} = (5, 1)\)?`,
        },
        label: { tr: R`\(c_1 =\)`, en: R`\(c_1 =\)` },
        answer: 3,
        compute: () => matVec(inv2([[1, 1], [1, -1]])!, [5, 1])[0]!,
        hint: {
          tr: R`\(c_1(1, 1) + c_2(1, -1) = (5, 1)\) denkleminden \(c_1 + c_2 = 5\) ve \(c_1 - c_2 = 1\) gelir; taraf tarafa toplayın!`,
          en: R`From \(c_1(1, 1) + c_2(1, -1) = (5, 1)\), add \(c_1 + c_2 = 5\) and \(c_1 - c_2 = 1\)!`,
        },
        explain: {
          tr: R`İki denklemi toplayınca \(2c_1 = 6 \implies c_1 = 3\) (ve \(c_2 = 2\)). Sağlama: \(3(1, 1) + 2(1, -1) = (5, 1)\).`,
          en: R`Adding gives \(2c_1 = 6 \implies c_1 = 3\) (and \(c_2 = 2\)). Check: \(3(1, 1) + 2(1, -1) = (5, 1)\).`,
        },
      },
      {
        id: "bd-q4",
        kind: "number",
        q: {
          tr: R`\(\mathcal{B} = \{(2, 1),\ (1, 3)\}\) tabanındaki koordinatları \([\mathbf{x}]_{\mathcal{B}} = \begin{bmatrix} 2 \\ -1 \end{bmatrix}\) olan vektörün <b>standart</b> birinci bileşeni \(x_1\) kaçtır?`,
          en: R`A vector has \(\mathcal{B}\)-coordinates \([\mathbf{x}]_{\mathcal{B}} = \begin{bmatrix} 2 \\ -1 \end{bmatrix}\) in \(\mathcal{B} = \{(2, 1),\ (1, 3)\}\). What is its <b>standard</b> first coordinate \(x_1\)?`,
        },
        label: { tr: R`\(x_1 =\)`, en: R`\(x_1 =\)` },
        answer: 3,
        compute: () => matVec([[2, 1], [1, 3]], [2, -1])[0]!,
        hint: {
          tr: R`\(\mathcal{B}\)'den standarta giderken ters almaya gerek yok! Doğrudan \(\mathbf{x} = 2(2, 1) + (-1)(1, 3)\) hesaplayın.`,
          en: R`Going from \(\mathcal{B}\) to standard needs no inverse! Just compute \(\mathbf{x} = 2(2, 1) + (-1)(1, 3)\).`,
        },
        explain: {
          tr: R`\(\mathbf{x} = P[\mathbf{x}]_{\mathcal{B}} = 2(2, 1) - 1(1, 3) = (4 - 1,\ 2 - 3) = (3, -1)\), dolayısıyla \(x_1 = 3\).`,
          en: R`\(\mathbf{x} = P[\mathbf{x}]_{\mathcal{B}} = 2(2, 1) - 1(1, 3) = (3, -1)\), so \(x_1 = 3\).`,
        },
      },
      {
        id: "bd-q5",
        kind: "predict",
        q: {
          tr: R`Eğik taban \(\mathcal{B} = \{\mathbf{b}_1 = (2, 1),\ \mathbf{b}_2 = (1, 2)\}\) seçiliyken \(\mathbf{x} = (4, 5)\) noktasının \([\mathbf{x}]_{\mathcal{B}}\) koordinat vektörü ne olur?`,
          en: R`In the slanted basis \(\mathcal{B} = \{\mathbf{b}_1 = (2, 1),\ \mathbf{b}_2 = (1, 2)\}\), what is the coordinate vector \([\mathbf{x}]_{\mathcal{B}}\) of \(\mathbf{x} = (4, 5)\)?`,
        },
        options: [
          { tr: R`\((4, 5)\)`, en: R`\((4, 5)\)` },
          { tr: R`\((1, 2)\)`, en: R`\((1, 2)\)` },
          { tr: R`\((2, 1)\)`, en: R`\((2, 1)\)` },
          { tr: R`\((3, 3)\)`, en: R`\((3, 3)\)` },
        ],
        answer: 1,
        run: () => {
          const c = matVec(inv2([[2, 1], [1, 2]])!, [4, 5]);
          const ans = Math.abs(c[0]! - 1) < 1e-6 && Math.abs(c[1]! - 2) < 1e-6 ? 1 : -1;
          return {
            answer: ans,
            result: {
              tr: R`\(P^{-1}\begin{bmatrix}4\\5\end{bmatrix} = \begin{bmatrix}${Math.round(c[0]!)}\\${Math.round(c[1]!)}\end{bmatrix}\): gerçekten \(1\cdot(2, 1) + 2\cdot(1, 2) = (4, 5)\)!`,
              en: R`\(P^{-1}\begin{bmatrix}4\\5\end{bmatrix} = \begin{bmatrix}${Math.round(c[0]!)}\\${Math.round(c[1]!)}\end{bmatrix}\): indeed \(1\cdot(2, 1) + 2\cdot(1, 2) = (4, 5)\)!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "bd-grid" },
        explain: {
          tr: R`\(1\,\mathbf{b}_1 + 2\,\mathbf{b}_2 = (2, 1) + (2, 4) = (4, 5)\), dolayısıyla \([\mathbf{x}]_{\mathcal{B}} = (1, 2)\).`,
          en: R`\(1\,\mathbf{b}_1 + 2\,\mathbf{b}_2 = (2, 1) + (2, 4) = (4, 5)\), giving \([\mathbf{x}]_{\mathcal{B}} = (1, 2)\).`,
        },
      },
    ],
  },
  {
    id: "px-bd-rn",
    title: { tr: "Rank–Sıfırlık Teoremi uygulamaları", en: "Rank–Nullity Theorem applications" },
    intro: {
      tr: R`Sütun sayısı \(n\), pivot sayısı ve çekirdek boyutu arasındaki boyut korunumu.`,
      en: R`Dimension conservation linking columns \(n\), rank, and kernel dimension.`,
    },
    read: { tab: "theory", section: "bd-rank-nullity" },
    questions: [
      {
        id: "bd-q6",
        kind: "number",
        q: {
          tr: R`Bir \(4 \times 7\) matrisin rankı \(\operatorname{rank}(A) = 3\) ise çekirdek boyutu \(\dim\ker(A)\) kaçtır?`,
          en: R`If a \(4 \times 7\) matrix has \(\operatorname{rank}(A) = 3\), what is \(\dim\ker(A)\)?`,
        },
        label: { tr: R`\(\dim\ker(A) =\)`, en: R`\(\dim\ker(A) =\)` },
        answer: 4,
        compute: () => 7 - 3,
        hint: {
          tr: R`Rank–Sıfırlık Teoreminde \(n\) <b>sütun</b> sayısıdır (4 değil, 7!).`,
          en: R`In Rank–Nullity, \(n\) is the number of <b>columns</b> (7, not 4!).`,
        },
        explain: {
          tr: R`Girdi vektörleri \(\mathbb{R}^7\)'de yaşar. Dolayısıyla \(\dim\ker(A) = n - \operatorname{rank}(A) = 7 - 3 = 4\).`,
          en: R`Input vectors live in \(\mathbb{R}^7\), so \(\dim\ker(A) = n - \operatorname{rank}(A) = 7 - 3 = 4\).`,
        },
      },
      {
        id: "bd-q7",
        kind: "choice",
        q: {
          tr: R`Bir \(3 \times 3\) kare matris \(A\) için \(\dim\ker(A) = 1\) olduğunu biliyoruz. Aşağıdakilerden hangisi kesinlikle <b>doğrudur</b>?`,
          en: R`We know a \(3 \times 3\) square matrix \(A\) satisfies \(\dim\ker(A) = 1\). Which statement MUST be <b>true</b>?`,
        },
        options: [
          {
            text: { tr: R`\(A\) tersinirdir ve \(\det(A) \ne 0\)`, en: R`\(A\) is invertible and \(\det(A) \ne 0\)` },
            why: {
              tr: R`Tersinir bir matris hiçbir sıfırdan farklı vektörü sıfıra ezemez (\(\dim\ker = 0\) olmalıdır). Burada 1B bir doğru sıfıra eziliyor!`,
              en: R`An invertible matrix sends ONLY \(\mathbf{0}\) to \(\mathbf{0}\) (\(\dim\ker = 0\)). Here an entire 1D line collapses to zero!`,
            },
          },
          {
            text: { tr: R`\(\operatorname{rank}(A) = 2\), yani \(\operatorname{Col}(A)\) bir 2B düzlemdir ve \(A\) tersinir değildir`, en: R`\(\operatorname{rank}(A) = 2\), so \(\operatorname{Col}(A)\) is a 2D plane and \(A\) is NOT invertible` },
          },
          {
            text: { tr: R`\(A\) sıfır matrisidir`, en: R`\(A\) must be the zero matrix` },
            why: {
              tr: R`Sıfır matrisi olsaydı \(\dim\ker(A) = 3\) olurdu! Burada \(\operatorname{rank}(A) = 3 - 1 = 2 > 0\).`,
              en: R`The zero matrix has \(\dim\ker(A) = 3\)! Here \(\operatorname{rank}(A) = 3 - 1 = 2 > 0\).`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Rank–Sıfırlık gereği \(\operatorname{rank}(A) = 3 - 1 = 2\). Demek ki görüntü uzayı \(\operatorname{Col}(A)\) 2 boyutlu bir düzlemdir ve tam rank (3) olmadığı için \(A\) tersinir değildir (\(\det(A) = 0\)).`,
          en: R`By Rank–Nullity, \(\operatorname{rank}(A) = 3 - 1 = 2\). Hence \(\operatorname{Col}(A)\) is a 2D plane and since \(A\) lacks full rank 3, it is singular (\(\det(A) = 0\)).`,
        },
      },
    ],
  },
];
