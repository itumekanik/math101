import type { PracticeSection } from "../../shared/practice.ts";
import { lineIntersection2D, pointLineDist2D } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-pg-lines",
    title: { tr: "Doğrular, normal vektör, uzaklık ve kesişim", en: "Lines, normal vectors, distance & intersections" },
    intro: {
      tr: R`Düzlemde normal vektör okuma, nokta–doğru uzaklığı ve iki doğrunun göreli durumu.`,
      en: R`Reading normal vectors, computing point-to-line distances, and testing two lines.`,
    },
    read: { tab: "theory", section: "pg-dist" },
    questions: [
      {
        id: "pg-q1",
        kind: "choice",
        q: {
          tr: R`\(2x - 5y + 7 = 0\) doğrusuna <b>dik</b> olan bir normal vektör hangisidir?`,
          en: R`Which vector is a normal vector <b>perpendicular</b> to the line \(2x - 5y + 7 = 0\)?`,
        },
        options: [
          { text: { tr: R`\(\mathbf n = (2, -5)\)`, en: R`\(\mathbf n = (2, -5)\)` } },
          {
            text: { tr: R`\(\mathbf n = (5, 2)\)`, en: R`\(\mathbf n = (5, 2)\)` },
            why: { tr: R`\((5, 2)\) doğruya dik değil, doğruya <b>paralel</b> yön vektörüdür (\((2,-5)\cdot(5,2)=0\)).`, en: R`\((5, 2)\) points <b>along</b> the line (direction vector), not perpendicular to it.` },
          },
          {
            text: { tr: R`\(\mathbf n = (2, 7)\)`, en: R`\(\mathbf n = (2, 7)\)` },
            why: { tr: R`Sabit terim \(c = 7\) doğruyu sadece öteler; normal vektör yalnızca \(x\) ve \(y\) katsayılarından \((a, b)\) oluşur.`, en: R`The constant \(c = 7\) only shifts the line; the normal uses only the \(x, y\) coefficients \((a, b)\).` },
          },
        ],
        answer: 0,
        explain: {
          tr: R`\(ax + by + c = 0\) biçiminde normal vektör doğrudan katsayılardan okunur: \(\mathbf n = (a, b) = (2, -5)\).`,
          en: R`In \(ax + by + c = 0\), the normal vector is read directly from the coefficients: \(\mathbf n = (a, b) = (2, -5)\).`,
        },
      },
      {
        id: "pg-q2",
        kind: "number",
        q: {
          tr: R`\(P_0 = (1, 2)\) noktasının \(3x + 4y - 1 = 0\) doğrusuna uzaklığı kaçtır?`,
          en: R`What is the distance from \(P_0 = (1, 2)\) to the line \(3x + 4y - 1 = 0\)?`,
        },
        label: { tr: R`\(d =\)`, en: R`\(d =\)` },
        answer: 2,
        compute: () => pointLineDist2D([1, 2], 3, 4, -1),
        hint: { tr: R`\(\frac{|3(1)+4(2)-1|}{\sqrt{3^2+4^2}}\) hesaplayın.`, en: R`Compute \(\frac{|3(1)+4(2)-1|}{\sqrt{3^2+4^2}}\).` },
        explain: { tr: R`\(|3 + 8 - 1| / \sqrt{9 + 16} = 10 / 5 = 2\).`, en: R`\(|3 + 8 - 1| / \sqrt{9 + 16} = 10 / 5 = 2\).` },
      },
      {
        id: "pg-q3",
        kind: "number",
        q: {
          tr: R`\(x + y - 5 = 0\) ve \(x - y - 1 = 0\) doğrularının kesişim noktasının \(x\)-koordinatı nedir?`,
          en: R`What is the \(x\)-coordinate of the intersection of \(x + y - 5 = 0\) and \(x - y - 1 = 0\)?`,
        },
        label: { tr: R`\(x =\)`, en: R`\(x =\)` },
        answer: 3,
        compute: () => lineIntersection2D([1, 1, -5], [1, -1, -1])![0],
        hint: { tr: R`İki denklemi taraf tarafa toplayarak \(y\)'yi yok edin.`, en: R`Add the two equations together to eliminate \(y\).` },
        explain: { tr: R`Taraf tarafa toplama: \(2x - 6 = 0 \implies x = 3\) (ve \(y = 2\)).`, en: R`Adding gives \(2x - 6 = 0 \implies x = 3\) (with \(y = 2\)).` },
      },
      {
        id: "pg-q4",
        kind: "predict",
        q: {
          tr: R`\(\ell_1: 2x - 4y + 1 = 0\) ve \(\ell_2: x - 2y + 5 = 0\) doğrularının göreli durumu nedir?`,
          en: R`What is the relative position of \(\ell_1: 2x - 4y + 1 = 0\) and \(\ell_2: x - 2y + 5 = 0\)?`,
        },
        options: [
          { tr: "Tek bir noktada kesişirler", en: "They intersect at a unique point" },
          { tr: "Paralel ve ayrıdırlar (kesişim yok)", en: "Parallel and distinct (no intersection)" },
          { tr: "Tam 90° dik kesişirler", en: "They intersect at an exact 90° angle" },
        ],
        answer: 1,
        run: () => {
          const pt = lineIntersection2D([2, -4, 1], [1, -2, 5]);
          const det = 2 * -2 - 1 * -4;
          return {
            answer: pt === null ? 1 : 0,
            result: {
              tr: `\\(\\det(\\mathbf n_1, \\mathbf n_2) = ${det}\\), ancak sabit terimler orantısız (\\(1 \\ne 2\\cdot 5\\)) → <b>Paralel ve ayrılar (kesişim = ∅)!</b>`,
              en: `\\(\\det(\\mathbf n_1, \\mathbf n_2) = ${det}\\) while constants fail to match (\\(1 \\ne 2\\cdot 5\\)) → <b>Parallel and distinct (intersection = ∅)!</b>`,
            },
          };
        },
        tryIt: { tab: "play" },
        explain: {
          tr: R`\(\mathbf n_1 = (2, -4) = 2\mathbf n_2\) olduğundan normaller paraleldir (\(\det = 0\)). Ancak \(1 \ne 2(5)\) olduğu için çakışık değil, ayrı paralel doğrulardır.`,
          en: R`Since \(\mathbf n_1 = (2, -4) = 2\mathbf n_2\), the normals are parallel (\(\det = 0\)), and \(1 \ne 2(5)\) means they are distinct parallel lines.`,
        },
      },
    ],
  },
  {
    id: "px-pg-conics",
    title: { tr: "Konik kesitler: elips, parabol ve hiperbol", en: "Conic sections: ellipse, parabola & hyperbola" },
    intro: {
      tr: R`Odaklar, dışmerkezlik \(e\) ve hiperbol asimptotları üzerine klasik sınav soruları.`,
      en: R`Classic exam problems on foci, eccentricity \(e\), and hyperbola asymptotes.`,
    },
    read: { tab: "theory", section: "pg-conics" },
    questions: [
      {
        id: "pg-q5",
        kind: "choice",
        q: {
          tr: R`\(\frac{x^2}{25} + \frac{y^2}{9} = 1\) elipsinin dışmerkezliği \(e\) kaçtır?`,
          en: R`What is the eccentricity \(e\) of the ellipse \(\frac{x^2}{25} + \frac{y^2}{9} = 1\)?`,
        },
        options: [
          {
            text: { tr: R`\(3/5\)`, en: R`\(3/5\)` },
            why: { tr: R`\(b/a\) değil, odak uzaklığıyla \(c/a = \sqrt{a^2-b^2}/a\) hesaplanmalıdır.`, en: R`Eccentricity uses focal distance \(c/a = \sqrt{a^2-b^2}/a\), not \(b/a\).` },
          },
          { text: { tr: R`\(4/5\)`, en: R`\(4/5\)` } },
          {
            text: { tr: R`\(\sqrt{34}/5\)`, en: R`\(\sqrt{34}/5\)` },
            why: { tr: R`\(c^2 = a^2 + b^2\) hiperbol içindir; elipste \(c^2 = a^2 - b^2\) (eksi) kullanılır.`, en: R`\(c^2 = a^2 + b^2\) is for hyperbolas; ellipses use \(c^2 = a^2 - b^2\).` },
          },
        ],
        answer: 1,
        compute: () => (Math.abs(Math.sqrt(25 - 9) / 5 - 0.8) < 1e-9 ? 1 : -1),
        explain: { tr: R`\(a = 5,\ b = 3 \implies c = \sqrt{25 - 9} = 4 \implies e = c/a = 4/5 = 0{,}8\).`, en: R`\(a = 5,\ b = 3 \implies c = \sqrt{25 - 9} = 4 \implies e = c/a = 4/5 = 0.8\).` },
      },
      {
        id: "pg-q6",
        kind: "choice",
        q: {
          tr: R`\(\frac{x^2}{4} - \frac{y^2}{9} = 1\) hiperbolünün asimptotları hangileridir?`,
          en: R`What are the asymptotes of the hyperbola \(\frac{x^2}{4} - \frac{y^2}{9} = 1\)?`,
        },
        options: [
          {
            text: { tr: R`\(y = \pm \frac{2}{3} x\)`, en: R`\(y = \pm \frac{2}{3} x\)` },
            why: { tr: R`Eğim \(\pm b/a = \pm 3/2\)'dir, \(a/b\) değil — sağ tarafı \(0\) yapıp \(y\)'yi çekerek kolayca kontrol edin.`, en: R`The slope is \(\pm b/a = \pm 3/2\), not \(a/b\) — check by setting the right side to \(0\).` },
          },
          {
            text: { tr: R`\(y = \pm \frac{9}{4} x\)`, en: R`\(y = \pm \frac{9}{4} x\)` },
            why: { tr: R`Paydaların karekökünü almayı unuttunuz: \(a = 2,\ b = 3\).`, en: R`Remember to take square roots of the denominators: \(a = 2,\ b = 3\).` },
          },
          { text: { tr: R`\(y = \pm \frac{3}{2} x\)`, en: R`\(y = \pm \frac{3}{2} x\)` } },
        ],
        answer: 2,
        explain: { tr: R`\(\frac{x^2}{4} - \frac{y^2}{9} = 0 \implies \frac{y^2}{9} = \frac{x^2}{4} \implies y = \pm \frac{3}{2}x\).`, en: R`Setting \(\frac{x^2}{4} - \frac{y^2}{9} = 0\) yields \(y = \pm \frac{3}{2}x\).` },
      },
      {
        id: "pg-q7",
        kind: "number",
        q: {
          tr: R`\(y^2 = 12x\) parabolünün odak noktası \(F = (p, 0)\) için \(p\) kaçtır?`,
          en: R`For the parabola \(y^2 = 12x\) with focus \(F = (p, 0)\), what is \(p\)?`,
        },
        label: { tr: R`\(p =\)`, en: R`\(p =\)` },
        answer: 3,
        compute: () => 12 / 4,
        hint: { tr: R`Standart \(y^2 = 4px\) denklemiyle karşılaştırıp \(4p = 12\) çözün.`, en: R`Match with standard form \(y^2 = 4px\) and solve \(4p = 12\).` },
        explain: { tr: R`\(4p = 12 \implies p = 3\), yani odak \(F = (3, 0)\) ve doğrultman \(x = -3\)'tür.`, en: R`\(4p = 12 \implies p = 3\), so the focus is \(F = (3, 0)\) and directrix is \(x = -3\).` },
      },
    ],
  },
];
