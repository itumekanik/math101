import type { PracticeSection } from "../../shared/practice.ts";
import { simpson } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ia-main",
    title: { tr: "Alan, dönel hacim, yay uzunluğu ve ortalama değer", en: "Area, volumes of revolution, arc length & average value" },
    intro: { tr: R`Belirli integralin geometrik ve fiziksel uygulamaları.`, en: R`Geometric and physical applications of definite integrals.` },
    read: { tab: "theory", section: "ia-revolution" },
    questions: [
      {
        id: "ia-q1",
        kind: "number",
        q: {
          tr: R`\(y = x\) ve \(y = x^2\) eğrileri arasında \([0, 1]\) aralığında kalan alan kaçtır? (Ondalık: 3 basamak)`,
          en: R`What is the area between \(y = x\) and \(y = x^2\) on \([0, 1]\)? (Decimal to 3 places)`,
        },
        label: { tr: "Alan =", en: "Area =" },
        answer: 1 / 6,
        tolerance: 0.002,
        compute: () => simpson((x) => x - x * x, 0, 1, 20),
        hint: { tr: R`\(\int_0^1 (x - x^2)\,dx = \frac{1}{2} - \frac{1}{3} = \frac{1}{6} \approx 0{,}167\).`, en: R`\(\int_0^1 (x - x^2)\,dx = \frac{1}{2} - \frac{1}{3} = \frac{1}{6} \approx 0.167\).` },
        explain: { tr: R`\([x^2/2 - x^3/3]_0^1 = 1/6 \approx 0{,}1667\).`, en: R`\([x^2/2 - x^3/3]_0^1 = 1/6 \approx 0.1667\).` },
      },
      {
        id: "ia-q2",
        kind: "number",
        q: {
          tr: R`\(y = \sqrt{x}\) eğrisi \([0, 4]\) üzerinde \(x\)-ekseni etrafında döndürülünce hacim \(V = k\pi\) oluyor. \(k\) kaçtır?`,
          en: R`Revolving \(y = \sqrt{x}\) on \([0, 4]\) around the \(x\)-axis yields volume \(V = k\pi\). What is \(k\)?`,
        },
        label: { tr: R`\(k =\)`, en: R`\(k =\)` },
        answer: 8,
        compute: () => simpson((x) => x, 0, 4, 20),
        hint: { tr: R`\(V = \pi \int_0^4 (\sqrt{x})^2\,dx = \pi \int_0^4 x\,dx\).`, en: R`Compute \(V = \pi \int_0^4 (\sqrt{x})^2\,dx = \pi \int_0^4 x\,dx\).` },
        explain: { tr: R`\(\int_0^4 x\,dx = \left[\frac{x^2}{2}\right]_0^4 = 8\), dolayısıyla \(V = 8\pi\) ve \(k = 8\).`, en: R`\(\int_0^4 x\,dx = 8\), so \(V = 8\pi\) and \(k = 8\).` },
      },
      {
        id: "ia-q3",
        kind: "number",
        q: {
          tr: R`\(f(x) = 3x^2\) fonksiyonunun \([0, 2]\) aralığındaki ortalama değeri \(\bar f\) kaçtır?`,
          en: R`What is the average value \(\bar f\) of \(f(x) = 3x^2\) on \([0, 2]\)?`,
        },
        label: { tr: R`\(\bar f =\)`, en: R`\(\bar f =\)` },
        answer: 4,
        compute: () => simpson((x) => 3 * x * x, 0, 2, 20) / 2,
        hint: { tr: R`\(\frac{1}{2-0}\int_0^2 3x^2\,dx\).`, en: R`Compute \(\frac{1}{2-0}\int_0^2 3x^2\,dx\).` },
        explain: { tr: R`\(\frac{1}{2}[x^3]_0^2 = \frac{8}{2} = 4\).`, en: R`\(\frac{1}{2}[x^3]_0^2 = \frac{8}{2} = 4\).` },
      },
      {
        id: "ia-q4",
        kind: "number",
        q: {
          tr: R`\(y = 2x\) doğrusunun \([0, 3]\) üzerindeki yay uzunluğu \(L\) için \(L^2\) kaçtır?`,
          en: R`For the arc length \(L\) of \(y = 2x\) on \([0, 3]\), what is \(L^2\)?`,
        },
        label: { tr: R`\(L^2 =\)`, en: R`\(L^2 =\)` },
        answer: 45,
        compute: () => (3 * Math.sqrt(1 + 4)) ** 2,
        hint: { tr: R`\(f'(x)=2 \implies L = \int_0^3 \sqrt{1+4}\,dx = 3\sqrt{5}\).`, en: R`\(f'(x)=2 \implies L = \int_0^3 \sqrt{5}\,dx = 3\sqrt{5}\).` },
        explain: { tr: R`\(L = 3\sqrt{5} \implies L^2 = 9\cdot 5 = 45\) (Pisagor'la da \(3^2 + 6^2 = 45\)).`, en: R`\(L = 3\sqrt{5} \implies L^2 = 45\) (matching Pythagoras \(3^2 + 6^2 = 45\)).` },
      },
    ],
  },
];
