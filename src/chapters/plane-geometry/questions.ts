import type { PracticeSection } from "../../shared/practice.ts";
import { lineIntersection2D, pointLineDist2D } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-pg-lines",
    title: { tr: "Doğrular, uzaklık ve kesişim", en: "Lines, distance and intersections" },
    intro: { tr: R`Düzlemde normal vektör, uzaklık ve kesişim hesapları.`, en: R`Normal vectors, distances, and intersections in the plane.` },
    read: { tab: "theory", section: "pg-lines" },
    questions: [
      {
        id: "pg-q1",
        kind: "number",
        q: {
          tr: R`\(P_0 = (1, 2)\) noktasının \(3x + 4y - 1 = 0\) doğrusuna uzaklığı kaçtır?`,
          en: R`What is the distance from \(P_0 = (1, 2)\) to the line \(3x + 4y - 1 = 0\)?`,
        },
        label: { tr: R`\(d =\)`, en: R`\(d =\)` },
        answer: 2,
        compute: () => pointLineDist2D([1, 2], 3, 4, -1),
        hint: { tr: R`\(\frac{|3(1)+4(2)-1|}{\sqrt{3^2+4^2}}\) hesaplayın.`, en: R`Compute \(\frac{|3(1)+4(2)-1|}{\sqrt{3^2+4^2}}\).` },
        explain: { tr: R`\(|3 + 8 - 1|/5 = 10/5 = 2\).`, en: R`\(|3 + 8 - 1|/5 = 10/5 = 2\).` },
      },
      {
        id: "pg-q2",
        kind: "number",
        q: {
          tr: R`\(x + y - 5 = 0\) ve \(x - y - 1 = 0\) doğrularının kesişim noktasının \(x\)-koordinatı nedir?`,
          en: R`What is the \(x\)-coordinate of the intersection of \(x + y - 5 = 0\) and \(x - y - 1 = 0\)?`,
        },
        label: { tr: R`\(x =\)`, en: R`\(x =\)` },
        answer: 3,
        compute: () => lineIntersection2D([1, 1, -5], [1, -1, -1])![0],
        hint: { tr: R`İki denklemi taraf tarafa toplayın.`, en: R`Add the two equations together.` },
        explain: { tr: R`\(2x - 6 = 0 \implies x = 3\) (ve \(y = 2\)).`, en: R`\(2x - 6 = 0 \implies x = 3\) (with \(y = 2\)).` },
      },
      {
        id: "pg-q3",
        kind: "choice",
        q: {
          tr: R`\(\frac{x^2}{25} + \frac{y^2}{9} = 1\) elipsinin dışmerkezliği \(e\) kaçtır?`,
          en: R`What is the eccentricity \(e\) of the ellipse \(\frac{x^2}{25} + \frac{y^2}{9} = 1\)?`,
        },
        options: [
          {
            text: { tr: R`\(3/5\)`, en: R`\(3/5\)` },
            why: { tr: R`\(b/a\) değil, \(c/a = \sqrt{a^2-b^2}/a\) gerekir.`, en: R`Eccentricity is \(c/a = \sqrt{a^2-b^2}/a\), not \(b/a\).` },
          },
          { text: { tr: R`\(4/5\)`, en: R`\(4/5\)` } },
          {
            text: { tr: R`\(\sqrt{34}/5\)`, en: R`\(\sqrt{34}/5\)` },
            why: { tr: R`\(c^2 = a^2 + b^2\) hiperbol içindir; elipste \(c^2 = a^2 - b^2\).`, en: R`\(c^2 = a^2 + b^2\) is for hyperbolas; for ellipses \(c^2 = a^2 - b^2\).` },
          },
        ],
        answer: 1,
        compute: () => (Math.abs(Math.sqrt(25 - 9) / 5 - 0.8) < 1e-9 ? 1 : -1),
        explain: { tr: R`\(a = 5,\ b = 3 \implies c = \sqrt{25 - 9} = 4 \implies e = c/a = 4/5 = 0{,}8\).`, en: R`\(a = 5,\ b = 3 \implies c = \sqrt{25 - 9} = 4 \implies e = c/a = 4/5 = 0.8\).` },
      },
      {
        id: "pg-q4",
        kind: "choice",
        q: {
          tr: R`\(\frac{x^2}{4} - \frac{y^2}{9} = 1\) hiperbolünün asimptotları hangileridir?`,
          en: R`What are the asymptotes of the hyperbola \(\frac{x^2}{4} - \frac{y^2}{9} = 1\)?`,
        },
        options: [
          {
            text: { tr: R`\(y = \pm \frac{2}{3} x\)`, en: R`\(y = \pm \frac{2}{3} x\)` },
            why: { tr: R`Eğim \(\pm b/a = \pm 3/2\)'dir, \(a/b\) değil.`, en: R`The slope is \(\pm b/a = \pm 3/2\), not \(a/b\).` },
          },
          {
            text: { tr: R`\(y = \pm \frac{9}{4} x\)`, en: R`\(y = \pm \frac{9}{4} x\)` },
            why: { tr: R`Karekökleri alın: \(a = 2,\ b = 3\).`, en: R`Remember to take square roots: \(a = 2,\ b = 3\).` },
          },
          { text: { tr: R`\(y = \pm \frac{3}{2} x\)`, en: R`\(y = \pm \frac{3}{2} x\)` } },
        ],
        answer: 2,
        explain: { tr: R`\(\frac{x^2}{4} - \frac{y^2}{9} = 0 \implies y = \pm \frac{3}{2}x\).`, en: R`Setting \(\frac{x^2}{4} - \frac{y^2}{9} = 0\) yields \(y = \pm \frac{3}{2}x\).` },
      },
    ],
  },
];
