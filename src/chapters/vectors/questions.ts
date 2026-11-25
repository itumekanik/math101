import type { PracticeSection } from "../../shared/practice.ts";
import { vDot, vNorm, vProject } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-vec-basic",
    title: { tr: "Norm, nokta çarpım ve diklik", en: "Norm, dot product and orthogonality" },
    intro: {
      tr: R`Vektör uzunluğu, nokta çarpım ve açı ilişkileri.`,
      en: R`Vector lengths, dot products, and angle checks.`,
    },
    read: { tab: "theory", section: "vec-dot" },
    questions: [
      {
        id: "vec-q1",
        kind: "number",
        q: {
          tr: R`\(\mathbf u = (3, -4, 12)\) vektörünün Öklid normu \(\|\mathbf u\|\) kaçtır?`,
          en: R`What is the Euclidean norm \(\|\mathbf u\|\) of \(\mathbf u = (3, -4, 12)\)?`,
        },
        label: { tr: R`\(\|\mathbf u\| =\)`, en: R`\(\|\mathbf u\| =\)` },
        answer: 13,
        compute: () => vNorm([3, -4, 12]),
        hint: { tr: R`\(\sqrt{3^2 + (-4)^2 + 12^2}\) hesaplayın.`, en: R`Compute \(\sqrt{3^2 + (-4)^2 + 12^2}\).` },
        explain: {
          tr: R`\(\sqrt{9 + 16 + 144} = \sqrt{169} = 13\).`,
          en: R`\(\sqrt{9 + 16 + 144} = \sqrt{169} = 13\).`,
        },
      },
      {
        id: "vec-q2",
        kind: "number",
        q: {
          tr: R`\(\mathbf u = (2, k, -1)\) ve \(\mathbf v = (3, -2, 4)\) dik (ortogonal) ise \(k\) kaçtır?`,
          en: R`If \(\mathbf u = (2, k, -1)\) and \(\mathbf v = (3, -2, 4)\) are orthogonal, what is \(k\)?`,
        },
        label: { tr: R`\(k =\)`, en: R`\(k =\)` },
        answer: 1,
        compute: () => (2 * 3 + -1 * 4) / 2,
        hint: { tr: R`\(\mathbf u \cdot \mathbf v = 0\) denklemini kurun.`, en: R`Set \(\mathbf u \cdot \mathbf v = 0\).` },
        explain: {
          tr: R`\(6 - 2k - 4 = 0 \implies 2k = 2 \implies k = 1\).`,
          en: R`\(6 - 2k - 4 = 0 \implies 2k = 2 \implies k = 1\).`,
        },
      },
      {
        id: "vec-q3",
        kind: "choice",
        q: {
          tr: R`\(\mathbf u = (4, 3)\) vektörünün \(\mathbf v = (1, 0)\) üzerine dik izdüşümü nedir?`,
          en: R`What is the orthogonal projection of \(\mathbf u = (4, 3)\) onto \(\mathbf v = (1, 0)\)?`,
        },
        options: [
          {
            text: { tr: R`\((0, 3)\)`, en: R`\((0, 3)\)` },
            why: { tr: R`Bu, \(\mathbf v\)'ye dik bileşendir (\(\mathbf u - \operatorname{proj}_{\mathbf v}\mathbf u\)).`, en: R`That is the component perpendicular to \(\mathbf v\).` },
          },
          { text: { tr: R`\((4, 0)\)`, en: R`\((4, 0)\)` } },
          {
            text: { tr: R`\((5, 0)\)`, en: R`\((5, 0)\)` },
            why: { tr: R`İzdüşüm uzunluğu norm değil, \(\frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|}=4\)'tür.`, en: R`The projected length is \(\frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|}=4\), not \(\|\mathbf u\|\).` },
          },
        ],
        answer: 1,
        compute: () => (vProject([4, 3], [1, 0])[0] === 4 ? 1 : -1),
        explain: {
          tr: R`\(\operatorname{proj}_{\mathbf v}\mathbf u = \frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|^2}\mathbf v = \frac{4}{1}(1,0) = (4,0)\).`,
          en: R`\(\operatorname{proj}_{\mathbf v}\mathbf u = \frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|^2}\mathbf v = 4(1,0) = (4,0)\).`,
        },
      },
    ],
  },
  {
    id: "px-vec-ineq",
    title: { tr: "Cauchy–Schwarz ve üçgen eşitsizliği", en: "Cauchy–Schwarz & triangle inequality" },
    intro: {
      tr: R`Eşitsizliklerin ne zaman eşitliğe dönüştüğünü sınayın.`,
      en: R`Test when the classical vector inequalities become equalities.`,
    },
    read: { tab: "theory", section: "vec-ineq" },
    questions: [
      {
        id: "vec-q4",
        kind: "choice",
        q: {
          tr: R`\(\|\mathbf u\| = 3\) ve \(\|\mathbf v\| = 5\) ise \(\mathbf u \cdot \mathbf v\)'nin alabileceği en küçük değer kaçtır?`,
          en: R`If \(\|\mathbf u\| = 3\) and \(\|\mathbf v\| = 5\), what is the minimum possible value of \(\mathbf u \cdot \mathbf v\)?`,
        },
        options: [
          {
            text: { tr: R`\(0\)`, en: R`\(0\)` },
            why: { tr: R`Nokta çarpım geniş açılarda negatif olabilir.`, en: R`Dot products can be negative for obtuse angles.` },
          },
          {
            text: { tr: R`\(-8\)`, en: R`\(-8\)` },
            why: { tr: R`Cauchy–Schwarz toplamla değil, çarpımla sınırlıdır: \(-\|\mathbf u\|\|\mathbf v\|\).`, en: R`Cauchy–Schwarz uses the product \(-\|\mathbf u\|\|\mathbf v\|\), not the sum.` },
          },
          { text: { tr: R`\(-15\)`, en: R`\(-15\)` } },
        ],
        answer: 2,
        compute: () => (vDot([3, 0], [-5, 0]) === -15 ? 2 : -1),
        explain: {
          tr: R`Cauchy–Schwarz gereği \(-15 \le \mathbf u\cdot\mathbf v \le 15\); zıt yönlü olduklarında (\(\theta=\pi\)) \(-15\) elde edilir.`,
          en: R`By Cauchy–Schwarz, \(-15 \le \mathbf u\cdot\mathbf v \le 15\), attaining \(-15\) when opposite (\(\theta = \pi\)).`,
        },
      },
      {
        id: "vec-q5",
        kind: "choice",
        q: {
          tr: R`Sıfırdan farklı \(\mathbf u, \mathbf v\) için \(\|\mathbf u + \mathbf v\| = \|\mathbf u\| + \|\mathbf v\|\) ne zaman sağlanır?`,
          en: R`For nonzero \(\mathbf u, \mathbf v\), when does \(\|\mathbf u + \mathbf v\| = \|\mathbf u\| + \|\mathbf v\|\) hold?`,
        },
        options: [
          { text: { tr: R`\(\mathbf u = \lambda \mathbf v,\ \lambda > 0\) (aynı yönlü)`, en: R`\(\mathbf u = \lambda \mathbf v,\ \lambda > 0\) (same direction)` } },
          {
            text: { tr: R`\(\mathbf u \cdot \mathbf v = 0\) (dik)`, en: R`\(\mathbf u \cdot \mathbf v = 0\) (orthogonal)` },
            why: { tr: R`Dikken Pisagor gereği \(\|\mathbf u+\mathbf v\| = \sqrt{\|\mathbf u\|^2+\|\mathbf v\|^2} < \|\mathbf u\|+\|\mathbf v\|\).`, en: R`When orthogonal, Pythagoras gives \(\sqrt{\|\mathbf u\|^2+\|\mathbf v\|^2} < \|\mathbf u\|+\|\mathbf v\|\).` },
          },
          {
            text: { tr: R`\(\mathbf u = -\mathbf v\) (zıt yönlü)`, en: R`\(\mathbf u = -\mathbf v\) (opposite direction)` },
            why: { tr: R`Zıt yönlü olduklarında \(\|\mathbf u+\mathbf v\| = 0\) olur.`, en: R`Opposite vectors cancel so \(\|\mathbf u+\mathbf v\| = 0\).` },
          },
        ],
        answer: 0,
        explain: {
          tr: R`Karesini alırsak \(\mathbf u\cdot\mathbf v = \|\mathbf u\|\|\mathbf v\| \iff \cos\theta = 1 \iff \theta = 0\), yani aynı yönlüdürler.`,
          en: R`Squaring both sides gives \(\mathbf u\cdot\mathbf v = \|\mathbf u\|\|\mathbf v\| \iff \cos\theta = 1\), so they point in the same direction.`,
        },
      },
    ],
  },
];
