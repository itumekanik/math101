import type { PracticeSection } from "../../shared/practice.ts";
import { rref, solveLinear } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ls-geom",
    title: { tr: "Geometri, çözüm olasılıkları ve temel çözme", en: "Geometry, solution outcomes & basic solving" },
    intro: {
      tr: R`Lineer sistemlerin kaç çözümü olabileceği ve \(2\times 2\) kesişim hesabı.`,
      en: R`How many solutions a linear system can have and finding a \(2\times 2\) intersection.`,
    },
    read: { tab: "theory", section: "ls-cases" },
    questions: [
      {
        id: "ls-q1",
        kind: "choice",
        q: {
          tr: R`Reel katsayılı bir lineer denklem sisteminin <b>tam olarak \(2\)</b> farklı çözümü olabilir mi?`,
          en: R`Can a linear system over \(\mathbb{R}\) have <b>exactly \(2\)</b> distinct solutions?`,
        },
        options: [
          {
            text: { tr: "Evet, 2 bilinmeyenli bir sistemde olabilir", en: "Yes, when there are 2 variables" },
            why: {
              tr: R`İki düz doğru ya 1 noktada kesişir, ya paralel olup hiç kesişmez, ya da tamamen çakışır — asla tam 2 noktada kesişemezler!`,
              en: R`Two straight lines cross at 1 point, run parallel (0 points), or overlap completely (\(\infty\) points) — never at exactly 2 points!`,
            },
          },
          {
            text: { tr: R`Hayır — bir lineer sistemin her zaman \(0\), \(1\) veya sonsuz çözümü vardır`, en: R`No — a linear system always has \(0\), \(1\), or infinitely many solutions` },
          },
          {
            text: { tr: R`Evet, katsayı matrisinin determinantı \(\det(A) = 0\) ise`, en: R`Yes, whenever \(\det(A) = 0\)` },
            why: {
              tr: R`\(\det(A) = 0\) olduğunda sistem ya çözümsüzdür (\(0\) çözüm) ya da serbest değişkenlidir (sonsuz çözüm) — yine asla \(2\) değildir!`,
              en: R`When \(\det(A) = 0\), the system has either \(0\) solutions or infinitely many — still never \(2\)!`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Eğer \(\mathbf x_1\) ve \(\mathbf x_2\) iki farklı çözümse, her \(t\in\mathbb{R}\) için \((1-t)\mathbf x_1 + t\mathbf x_2\) de çözümdür! Dolayısıyla 2 çözüm bulduğunuz anda mecburen sonsuz çözüm vardır.`,
          en: R`If \(\mathbf x_1 \ne \mathbf x_2\) both solve \(A\mathbf x = \mathbf b\), then \((1-t)\mathbf x_1 + t\mathbf x_2\) solves it for EVERY \(t\in\mathbb{R}\)! Two distinct solutions automatically force infinitely many.`,
        },
      },
      {
        id: "ls-q2",
        kind: "number",
        q: {
          tr: R`\(x + 2y = 5\) ve \(3x - y = 1\) sisteminin tek çözümünde \(x\) kaçtır?`,
          en: R`In the unique solution to \(x + 2y = 5\) and \(3x - y = 1\), what is \(x\)?`,
        },
        label: { tr: R`\(x =\)`, en: R`\(x =\)` },
        answer: 1,
        compute: () => solveLinear([[1, 2], [3, -1]], [5, 1])![0]!,
        hint: {
          tr: R`İkinci denklemi \(2\) ile çarpıp (\(6x - 2y = 2\)) birinciyle toplayın: \(7x = 7\).`,
          en: R`Multiply the second equation by \(2\) (\(6x - 2y = 2\)) and add to the first: \(7x = 7\).`,
        },
        explain: {
          tr: R`\(R_1 + 2R_2\) işlemi \(7x = 7 \implies x = 1\) verir; ilk denklemde yerine koyunca \(1 + 2y = 5 \implies y = 2\).`,
          en: R`Adding twice the second equation to the first gives \(7x = 7 \implies x = 1\), and then \(1 + 2y = 5 \implies y = 2\).`,
        },
      },
    ],
  },

  {
    id: "px-ls-rref",
    title: { tr: "Gauss yok etme, RREF okuma ve rank", en: "Gaussian elimination, reading RREF & rank" },
    intro: {
      tr: R`Sıfır satırı ile çelişki satırını ayırt etme ve matris rankı bulma.`,
      en: R`Distinguishing zero rows from contradiction rows and computing matrix rank.`,
    },
    read: { tab: "theory", section: "ls-gauss" },
    questions: [
      {
        id: "ls-q3",
        kind: "choice",
        q: {
          tr: R`\(3\times 3\) bir sistemin \([A\mid\mathbf b]\) matrisi RREF'e indirildiğinde 1. ve 2. sütunlarda pivot çıkarken en alt satır \([\,0\ \ 0\ \ 0 \mid 0\,]\) oluyor. Bu ne anlama gelir?`,
          en: R`After reducing a \(3\times 3\) system \([A\mid\mathbf b]\) to RREF, columns 1 and 2 have pivots and the bottom row is \([\,0\ \ 0\ \ 0 \mid 0\,]\). What does this mean?`,
        },
        options: [
          {
            text: { tr: "Sistem tutarsızdır, çözüm yoktur", en: "The system is inconsistent (no solution)" },
            why: {
              tr: R`\([0\ 0\ 0 \mid 0]\) satırı "\(0 = 0\)" demektir ve tamamen doğrudur! Tutarsızlık için sağ tarafta sıfırdan farklı bir sayı (örneğin \([0\ 0\ 0 \mid 1]\)) gerekir.`,
              en: R`\([0\ 0\ 0 \mid 0]\) reads "\(0 = 0\)", which is true! Inconsistency requires a nonzero entry on the right, like \([0\ 0\ 0 \mid 1]\).`,
            },
          },
          {
            text: { tr: "Tek bir çözüm vardır", en: "There is a unique solution" },
            why: {
              tr: R`\(3\) bilinmeyen var ama yalnızca \(2\) pivot bulunuyor; 3. sütun (\(x_3\)) serbest kalır!`,
              en: R`There are \(3\) unknowns but only \(2\) pivots, leaving column 3 (\(x_3\)) free!`,
            },
          },
          {
            text: { tr: R`\(x_3\) serbest parametreli sonsuz çözüm vardır`, en: R`Infinitely many solutions with \(x_3\) as a free parameter` },
          },
        ],
        answer: 2,
        explain: {
          tr: R`\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = 2 < 3 = n\): sistem tutarlıdır ve pivotsuz kalan \(x_3\) serbest değişkeniyle sonsuz çözüm üretir.`,
          en: R`\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = 2 < 3 = n\): consistent with \(3 - 2 = 1\) free variable (\(x_3\)), giving infinitely many solutions.`,
        },
      },
      {
        id: "ls-q4",
        kind: "number",
        q: {
          tr: R`\(A = \begin{bmatrix}1 & 2 & 3\\ 2 & 4 & 6\\ 0 & 1 & 1\end{bmatrix}\) matrisinin rankı \(\operatorname{rank}(A)\) kaçtır?`,
          en: R`What is the rank \(\operatorname{rank}(A)\) of \(A = \begin{bmatrix}1 & 2 & 3\\ 2 & 4 & 6\\ 0 & 1 & 1\end{bmatrix}\)?`,
        },
        label: { tr: R`\(\operatorname{rank}(A) =\)`, en: R`\(\operatorname{rank}(A) =\)` },
        answer: 2,
        compute: () => rref([[1, 2, 3], [2, 4, 6], [0, 1, 1]], 3).rankA,
        hint: {
          tr: R`2. satır, 1. satırın tam \(2\) katıdır! \(R_2 \leftarrow R_2 - 2R_1\) yaptığınızda kaç sıfırdan farklı satır (pivot) kalır?`,
          en: R`Notice row 2 is exactly twice row 1! After \(R_2 \leftarrow R_2 - 2R_1\), how many nonzero pivot rows remain?`,
        },
        explain: {
          tr: R`\(R_2 \leftarrow R_2 - 2R_1\) işlemi 2. satırı tamamen sıfırlar; kalan \([1, 2, 3]\) ve \([0, 1, 1]\) satırları \(2\) pivot verir, yani \(\operatorname{rank}(A) = 2\).`,
          en: R`\(R_2 \leftarrow R_2 - 2R_1\) zeroes out row 2; the remaining rows \([1, 2, 3]\) and \([0, 1, 1]\) give \(2\) pivots, so \(\operatorname{rank}(A) = 2\).`,
        },
      },
    ],
  },

  {
    id: "px-ls-rc",
    title: { tr: "Rouché–Capelli, homojen sistemler ve tahmin", en: "Rouché–Capelli, homogeneous systems & prediction" },
    intro: {
      tr: R`Rank karşılaştırması, serbest parametre sayısı ve sağ tarafı değiştirmenin etkisi.`,
      en: R`Rank comparison, counting free parameters, and predicting what happens when \(\mathbf b\) changes.`,
    },
    read: { tab: "theory", section: "ls-rank" },
    questions: [
      {
        id: "ls-q5",
        kind: "choice",
        q: {
          tr: R`Bir \(3\times 4\) lineer sistemde (\(3\) denklem, \(4\) bilinmeyen) \(\operatorname{rank}(A) = 2\) ve \(\operatorname{rank}([A\mid\mathbf b]) = 2\) ise çözüm kümesi nasıldır?`,
          en: R`For a \(3\times 4\) system (\(3\) equations, \(4\) unknowns) with \(\operatorname{rank}(A) = 2\) and \(\operatorname{rank}([A\mid\mathbf b]) = 2\), what is the solution set?`,
        },
        options: [
          {
            text: { tr: "Tek çözüm vardır", en: "Unique solution" },
            why: {
              tr: R`Tek çözüm için tüm \(n = 4\) sütunda pivot olması, yani \(\operatorname{rank}(A) = 4\) gerekir.`,
              en: R`A unique solution requires a pivot in all \(n = 4\) columns, i.e. \(\operatorname{rank}(A) = 4\).`,
            },
          },
          {
            text: { tr: R`\(2\) serbest parametreli sonsuz çözüm vardır`, en: R`Infinitely many solutions with \(2\) free parameters` },
          },
          {
            text: { tr: "Çözüm yoktur", en: "No solution" },
            why: {
              tr: R`\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b])\) eşitliği Rouché–Capelli gereği tutarlılığı garantiler.`,
              en: R`Equal ranks (\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b])\)) guarantee consistency by Rouché–Capelli.`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Ranklar eşit (\(2 = 2\)) olduğundan sistem tutarlıdır; serbest değişken sayısı \(n - r = 4 - 2 = 2\)'dir.`,
          en: R`Equal ranks (\(2 = 2\)) mean the system is consistent, with \(n - r = 4 - 2 = 2\) free parameters.`,
        },
      },
      {
        id: "ls-q6",
        kind: "choice",
        q: {
          tr: R`Homojen sistem \(A\mathbf x = \mathbf 0\) için aşağıdakilerden hangisi <b>her zaman</b> doğrudur?`,
          en: R`Which statement is <b>always</b> true for a homogeneous system \(A\mathbf x = \mathbf 0\)?`,
        },
        options: [
          {
            text: { tr: R`En az bir çözümü vardır (\(\mathbf x = \mathbf 0\))`, en: R`It always has at least one solution (\(\mathbf x = \mathbf 0\))` },
          },
          {
            text: { tr: "Yalnızca tek bir çözümü vardır", en: "It only ever has one solution" },
            why: {
              tr: R`\(\operatorname{rank}(A) < n\) olduğunda serbest değişken oluşur ve sıfırdan farklı sonsuz çözüm bulunur.`,
              en: R`Whenever \(\operatorname{rank}(A) < n\), free variables produce infinitely many nonzero solutions.`,
            },
          },
          {
            text: { tr: "Bilinmeyen sayısı denklem sayısından fazlaysa çözüm yoktur", en: "If unknowns exceed equations, there is no solution" },
            why: {
              tr: R`Tam tersi! \(n > m\) iken \(r \le m < n\) olduğu için sıfırdan farklı sonsuz çözüm <b>garantidir</b>.`,
              en: R`The exact opposite! When \(n > m\), \(r \le m < n\) guarantees infinitely many nontrivial solutions.`,
            },
          },
        ],
        answer: 0,
        explain: {
          tr: R`\(A\mathbf 0 = \mathbf 0\) daima sağlandığından homojen bir sistem asla tutarsız olamaz; ya tek çözümü (\(\mathbf 0\)) ya da sonsuz çözümü vardır.`,
          en: R`Since \(A\mathbf 0 = \mathbf 0\) always holds, a homogeneous system is never inconsistent — it has either only \(\mathbf 0\) or infinitely many solutions.`,
        },
      },
      {
        id: "ls-q7",
        kind: "predict",
        q: {
          tr: R`\(\left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 2 & 4 & 3 & 9 \\ 1 & 2 & 2 & 5 \end{array}\right]\) sistemi tutarlıdır ve sonsuz çözümü vardır (\(\operatorname{rank} = 2\)). Sadece en sağ alttaki \(5\) sayısını \(6\) yaparsak ne olur?`,
          en: R`The system \(\left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 2 & 4 & 3 & 9 \\ 1 & 2 & 2 & 5 \end{array}\right]\) is consistent with infinitely many solutions (\(\operatorname{rank} = 2\)). Predict what happens if we change ONLY the bottom-right \(5\) to \(6\)!`,
        },
        options: [
          { tr: R`Hâlâ sonsuz çözüm olur (\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = 2\))`, en: R`Still infinitely many solutions (\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = 2\))` },
          { tr: R`Tutarsız olur ve çözüm kalmaz (\(\operatorname{rank}(A) = 2 < \operatorname{rank}([A\mid\mathbf b]) = 3\))`, en: R`Becomes inconsistent with no solution (\(\operatorname{rank}(A) = 2 < \operatorname{rank}([A\mid\mathbf b]) = 3\))` },
          { tr: R`Tek çözüme dönüşür (\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = 3\))`, en: R`Turns into a unique solution (\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = 3\))` },
        ],
        answer: 1,
        run() {
          const res = rref(
            [
              [1, 2, 1, 4],
              [2, 4, 3, 9],
              [1, 2, 2, 6],
            ],
            3,
          );
          const ans = res.rankAug > res.rankA ? 1 : res.rankA === 3 ? 2 : 0;
          return {
            answer: ans,
            result: {
              tr: R`RREF sonucu: \(\operatorname{rank}(A) = ${res.rankA}\), \(\operatorname{rank}([A\mid\mathbf b]) = ${res.rankAug}\) (son satır \([0\ 0\ 0 \mid ${res.matrix[2]![3]}]\): çelişki!).`,
              en: R`RREF gives \(\operatorname{rank}(A) = ${res.rankA}\), \(\operatorname{rank}([A\mid\mathbf b]) = ${res.rankAug}\) (bottom row \([0\ 0\ 0 \mid ${res.matrix[2]![3]}]\): contradiction!).`,
            },
          };
        },
        tryIt: { tab: "play" },
        explain: {
          tr: R`\(A\) matrisi hiç değişmediği için \(\operatorname{rank}(A) = 2\) kalır (yani tek çözüm olamaz!). \(R_2 - 2R_1\) bize \(x_3 = 1\), \(R_3 - R_1\) ise \(x_3 = 2\) dediğinden \(0 = 1\) çelişkisi doğar ve \(\operatorname{rank}([A\mid\mathbf b]) = 3\) olur!`,
          en: R`Because \(A\) did not change, \(\operatorname{rank}(A)\) stays \(2\) (so a unique solution is impossible!). Eliminating gives \(x_3 = 1\) from row 2 and \(x_3 = 2\) from row 3 — a \(0 = 1\) contradiction pushing \(\operatorname{rank}([A\mid\mathbf b]) = 3\)!`,
        },
      },
    ],
  },
];
