import type { PracticeSection } from "../../shared/practice.ts";
import { vAngle, vDot, vNorm, vProject } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-vec-basics",
    title: { tr: "Norm ve birim vektör", en: "Norm & unit vectors" },
    intro: {
      tr: R`Vektör uzunluğu (Pisagor) ve yönü koruyarak uzunluğu 1 yapma üzerine alıştırmalar.`,
      en: R`Warm-up drills on Euclidean length and normalizing a vector to length 1.`,
    },
    read: { tab: "theory", section: "vec-basics" },
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
        hint: { tr: R`\(\sqrt{3^2 + (-4)^2 + 12^2}\) hesaplayın; negatif sayının karesi pozitiftir.`, en: R`Compute \(\sqrt{3^2 + (-4)^2 + 12^2}\); squaring a negative number gives a positive.` },
        explain: {
          tr: R`\(\|\mathbf u\| = \sqrt{9 + 16 + 144} = \sqrt{169} = 13\).`,
          en: R`\(\|\mathbf u\| = \sqrt{9 + 16 + 144} = \sqrt{169} = 13\).`,
        },
      },
      {
        id: "vec-q2",
        kind: "choice",
        q: {
          tr: R`\(\mathbf v = (3, 4)\) ile aynı yönde olan <b>birim vektör</b> \(\hat{\mathbf v}\) hangisidir?`,
          en: R`Which is the <b>unit vector</b> \(\hat{\mathbf v}\) pointing in the same direction as \(\mathbf v = (3, 4)\)?`,
        },
        options: [
          {
            text: { tr: R`\(\left(\frac{3}{7},\ \frac{4}{7}\right)\)`, en: R`\(\left(\frac{3}{7},\ \frac{4}{7}\right)\)` },
            why: { tr: R`Norm \(3 + 4 = 7\) değil, Pisagor gereği \(\sqrt{3^2 + 4^2} = 5\)'tir.`, en: R`The norm is \(\sqrt{3^2 + 4^2} = 5\), not the sum \(3 + 4 = 7\).` },
          },
          { text: { tr: R`\(\left(\frac{3}{5},\ \frac{4}{5}\right)\)`, en: R`\(\left(\frac{3}{5},\ \frac{4}{5}\right)\)` } },
          {
            text: { tr: R`\(\left(\frac{3}{25},\ \frac{4}{25}\right)\)`, en: R`\(\left(\frac{3}{25},\ \frac{4}{25}\right)\)` },
            why: { tr: R`Karekök almayı unuttunuz: \(25 = \|\mathbf v\|^2\), oysa \(\|\mathbf v\| = 5\)'e bölmeliyiz.`, en: R`Remember to take the square root: \(25 = \|\mathbf v\|^2\), so we divide by \(\|\mathbf v\| = 5\).` },
          },
        ],
        answer: 1,
        compute: () => (Math.abs(vNorm([3 / 5, 4 / 5]) - 1) < 1e-9 ? 1 : -1),
        explain: {
          tr: R`\(\|\mathbf v\| = \sqrt{3^2 + 4^2} = 5\) olduğundan \(\hat{\mathbf v} = \frac{\mathbf v}{\|\mathbf v\|} = (\frac{3}{5}, \frac{4}{5})\).`,
          en: R`Since \(\|\mathbf v\| = \sqrt{3^2 + 4^2} = 5\), dividing gives \(\hat{\mathbf v} = (\frac{3}{5}, \frac{4}{5})\).`,
        },
      },
    ],
  },
  {
    id: "px-vec-dot",
    title: { tr: "Nokta çarpım, diklik ve izdüşüm", en: "Dot product, orthogonality & projection" },
    intro: {
      tr: R`Nokta çarpımın işaretiyle açı sınıflandırması, diklik koşulu ve gölge (izdüşüm) hesabı.`,
      en: R`Classifying angles by sign, testing perpendicularity, and projecting vectors.`,
    },
    read: { tab: "theory", section: "vec-dot" },
    questions: [
      {
        id: "vec-q3",
        kind: "number",
        q: {
          tr: R`\(\mathbf u = (2, k, -1)\) ve \(\mathbf v = (3, -2, 4)\) dik (ortogonal) ise \(k\) kaçtır?`,
          en: R`If \(\mathbf u = (2, k, -1)\) and \(\mathbf v = (3, -2, 4)\) are orthogonal, what is \(k\)?`,
        },
        label: { tr: R`\(k =\)`, en: R`\(k =\)` },
        answer: 1,
        compute: () => (2 * 3 + -1 * 4) / 2,
        hint: { tr: R`Dik vektörlerde \(\mathbf u \cdot \mathbf v = 0\) denklemini kurun.`, en: R`Orthogonal vectors satisfy \(\mathbf u \cdot \mathbf v = 0\).` },
        explain: {
          tr: R`\(2(3) + k(-2) + (-1)(4) = 0 \implies 6 - 2k - 4 = 0 \implies 2k = 2 \implies k = 1\).`,
          en: R`\(2(3) + k(-2) + (-1)(4) = 0 \implies 6 - 2k - 4 = 0 \implies 2k = 2 \implies k = 1\).`,
        },
      },
      {
        id: "vec-q4",
        kind: "choice",
        q: {
          tr: R`\(\mathbf u = (4, 3)\) vektörünün \(\mathbf v = (1, 0)\) üzerine dik izdüşümü nedir?`,
          en: R`What is the orthogonal projection of \(\mathbf u = (4, 3)\) onto \(\mathbf v = (1, 0)\)?`,
        },
        options: [
          {
            text: { tr: R`\((0, 3)\)`, en: R`\((0, 3)\)` },
            why: { tr: R`Bu, \(\mathbf v\)'ye dik kalan bileşendir (\(\mathbf u_\perp = \mathbf u - \operatorname{proj}_{\mathbf v}\mathbf u\)).`, en: R`That is the perpendicular leftover component \(\mathbf u_\perp = \mathbf u - \operatorname{proj}_{\mathbf v}\mathbf u\).` },
          },
          { text: { tr: R`\((4, 0)\)`, en: R`\((4, 0)\)` } },
          {
            text: { tr: R`\((5, 0)\)`, en: R`\((5, 0)\)` },
            why: { tr: R`Gölge uzunluğu norm \(\|\mathbf u\| = 5\) değil, \(\frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|}=4\)'tür.`, en: R`The shadow length is \(\frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|}=4\), not the full norm \(\|\mathbf u\|=5\).` },
          },
        ],
        answer: 1,
        compute: () => (vProject([4, 3], [1, 0])[0] === 4 ? 1 : -1),
        explain: {
          tr: R`\(\operatorname{proj}_{\mathbf v}\mathbf u = \frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|^2}\mathbf v = \frac{4}{1}(1,0) = (4,0)\).`,
          en: R`\(\operatorname{proj}_{\mathbf v}\mathbf u = \frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|^2}\mathbf v = 4(1,0) = (4,0)\).`,
        },
      },
      {
        id: "vec-q5",
        kind: "predict",
        q: {
          tr: R`\(\mathbf u = (2, 1)\) ile \(\mathbf v = (-3, 4)\) arasındaki \(\theta\) açısı dar mı, dik mi, yoksa geniş midir?`,
          en: R`Is the angle \(\theta\) between \(\mathbf u = (2, 1)\) and \(\mathbf v = (-3, 4)\) acute, right, or obtuse?`,
        },
        options: [
          { tr: R`Dar açı (\(0^\circ \le \theta < 90^\circ\))`, en: R`Acute (\(0^\circ \le \theta < 90^\circ\))` },
          { tr: R`Dik açı (\(\theta = 90^\circ\))`, en: R`Right angle (\(\theta = 90^\circ\))` },
          { tr: R`Geniş açı (\(90^\circ < \theta \le 180^\circ\))`, en: R`Obtuse (\(90^\circ < \theta \le 180^\circ\))` },
        ],
        answer: 2,
        run: () => {
          const u = [2, 1];
          const v = [-3, 4];
          const dp = vDot(u, v);
          const deg = (vAngle(u, v) * 180) / Math.PI;
          const ans = Math.abs(dp) < 1e-9 ? 1 : dp > 0 ? 0 : 2;
          return {
            answer: ans,
            result: {
              tr: `\\(\\mathbf u \\cdot \\mathbf v = ${dp} < 0\\) ve \\(\\theta \\approx ${deg.toFixed(1).replace(".", "{,}")}^\\circ\\) → <b>Geniş açı!</b>`,
              en: `\\(\\mathbf u \\cdot \\mathbf v = ${dp} < 0\\), giving \\(\\theta \\approx ${deg.toFixed(1)}^\\circ\\) → <b>Obtuse!</b>`,
            },
          };
        },
        tryIt: { tab: "theory", section: "vec-dot" },
        explain: {
          tr: R`Nokta çarpım \(\mathbf u \cdot \mathbf v = -6 + 4 = -2 < 0\) olduğu için \(\cos\theta < 0\), yani açı \(90^\circ\)'den büyüktür.`,
          en: R`Because \(\mathbf u \cdot \mathbf v = -6 + 4 = -2 < 0\), we have \(\cos\theta < 0\), so the angle exceeds \(90^\circ\).`,
        },
      },
    ],
  },
  {
    id: "px-vec-ineq",
    title: { tr: "Cauchy–Schwarz ve üçgen eşitsizliği", en: "Cauchy–Schwarz & triangle inequality" },
    intro: {
      tr: R`Klasik eşitsizliklerin sınır ve eşitlik durumlarını sınayın.`,
      en: R`Test the boundary and equality cases of the classical vector inequalities.`,
    },
    read: { tab: "theory", section: "vec-ineq" },
    questions: [
      {
        id: "vec-q6",
        kind: "choice",
        q: {
          tr: R`\(\|\mathbf u\| = 3\) ve \(\|\mathbf v\| = 5\) ise \(\mathbf u \cdot \mathbf v\)'nin alabileceği en küçük değer kaçtır?`,
          en: R`If \(\|\mathbf u\| = 3\) and \(\|\mathbf v\| = 5\), what is the minimum possible value of \(\mathbf u \cdot \mathbf v\)?`,
        },
        options: [
          {
            text: { tr: R`\(0\)`, en: R`\(0\)` },
            why: { tr: R`Nokta çarpım geniş açılarda negatif olabilir; sıfır sadece \(90^\circ\)'de oluşur.`, en: R`Dot products become negative for obtuse angles; zero only happens at \(90^\circ\).` },
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
          tr: R`Cauchy–Schwarz gereği \(-15 \le \mathbf u\cdot\mathbf v \le 15\); zıt yönlü olduklarında (\(\theta = 180^\circ\)) tam \(-15\) elde edilir.`,
          en: R`By Cauchy–Schwarz, \(-15 \le \mathbf u\cdot\mathbf v \le 15\), attaining \(-15\) when opposite (\(\theta = 180^\circ\)).`,
        },
      },
      {
        id: "vec-q7",
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
            why: { tr: R`Zıt yönlü olduklarında birbirini götürür ve \(\|\mathbf u+\mathbf v\| = 0\) olur.`, en: R`Opposite vectors cancel out so \(\|\mathbf u+\mathbf v\| = 0\).` },
          },
        ],
        answer: 0,
        explain: {
          tr: R`İki tarafın karesini alırsak \(\mathbf u\cdot\mathbf v = \|\mathbf u\|\|\mathbf v\| \iff \cos\theta = 1 \iff \theta = 0^\circ\), yani aynı yönlüdürler.`,
          en: R`Squaring both sides gives \(\mathbf u\cdot\mathbf v = \|\mathbf u\|\|\mathbf v\| \iff \cos\theta = 1\), meaning they point in the exact same direction.`,
        },
      },
    ],
  },
];
