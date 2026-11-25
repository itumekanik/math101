import type { PracticeSection } from "../../shared/practice.ts";
import { newtonRaphson } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-der-main",
    title: { tr: "Türev kuralları, ekstremum, MVT ve L'Hôpital", en: "Differentiation rules, extrema, MVT & L'Hôpital" },
    intro: { tr: R`Zincir kuralı, kritik noktalar, MVT ve Newton adımı.`, en: R`Chain rule, critical points, MVT, and Newton's step.` },
    read: { tab: "theory", section: "der-secant" },
    questions: [
      {
        id: "der-q1",
        kind: "number",
        q: {
          tr: R`\(f(x) = e^{3x} + x^2\) için \(f'(0)\) kaçtır?`,
          en: R`For \(f(x) = e^{3x} + x^2\), what is \(f'(0)\)?`,
        },
        label: { tr: R`\(f'(0) =\)`, en: R`\(f'(0) =\)` },
        answer: 3,
        compute: () => 3 * Math.exp(0) + 2 * 0,
        hint: { tr: R`Zincir kuralıyla \((e^{3x})' = 3e^{3x}\).`, en: R`By the chain rule, \((e^{3x})' = 3e^{3x}\).` },
        explain: { tr: R`\(f'(x) = 3e^{3x} + 2x \implies f'(0) = 3 + 0 = 3\).`, en: R`\(f'(x) = 3e^{3x} + 2x \implies f'(0) = 3\).` },
      },
      {
        id: "der-q2",
        kind: "number",
        q: {
          tr: R`\(f(x) = x^2\) fonksiyonu için \([1, 5]\) aralığında Ortalama Değer Teoreminin (MVT) sağlandığı \(c\) noktası kaçtır?`,
          en: R`For \(f(x) = x^2\) on \([1, 5]\), find the MVT point \(c\) satisfying \(f'(c) = \frac{f(5)-f(1)}{5-1}\).`,
        },
        label: { tr: R`\(c =\)`, en: R`\(c =\)` },
        answer: 3,
        compute: () => ((25 - 1) / (5 - 1)) / 2,
        hint: { tr: R`\(2c = \frac{25 - 1}{5 - 1} = 6\).`, en: R`Solve \(2c = \frac{25 - 1}{5 - 1} = 6\).` },
        explain: { tr: R`\(2c = 6 \implies c = 3\). İkinci derece polinomlarda MVT noktası daima aralığın tam ortasıdır!`, en: R`\(2c = 6 \implies c = 3\). For any quadratic, the MVT point is always the midpoint!` },
      },
      {
        id: "der-q3",
        kind: "number",
        q: {
          tr: R`L'Hôpital kuralıyla \(\lim_{x\to 0}\frac{e^{2x} - 1 - 2x}{x^2}\) limitini hesaplayın.`,
          en: R`Use L'Hôpital's rule to evaluate \(\lim_{x\to 0}\frac{e^{2x} - 1 - 2x}{x^2}\).`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 2,
        compute: () => 4 / 2,
        hint: { tr: R`İki kez L'Hôpital uygulayın: \(\frac{2e^{2x}-2}{2x} \to \frac{4e^{2x}}{2}\).`, en: R`Apply L'Hôpital twice: \(\frac{2e^{2x}-2}{2x} \to \frac{4e^{2x}}{2}\).` },
        explain: { tr: R`İkinci türev oranı \(\lim_{x\to 0}\frac{4e^{2x}}{2} = 2\).`, en: R`Second derivatives give \(\lim_{x\to 0}\frac{4e^{2x}}{2} = 2\).` },
      },
      {
        id: "der-q4",
        kind: "number",
        q: {
          tr: R`\(f(x) = x^2 - 2\) için \(x_0 = 2\) başlangıcıyla 1 Newton–Raphson adımı sonraki \(x_1\) değeri nedir?`,
          en: R`Starting at \(x_0 = 2\) for \(f(x) = x^2 - 2\), what is \(x_1\) after one Newton–Raphson step?`,
        },
        label: { tr: R`\(x_1 =\)`, en: R`\(x_1 =\)` },
        answer: 1.5,
        compute: () => newtonRaphson((x) => x * x - 2, (x) => 2 * x, 2, 1)[1]!,
        hint: { tr: R`\(x_1 = x_0 - \frac{f(x_0)}{f'(x_0)} = 2 - \frac{2}{4}\).`, en: R`Compute \(x_1 = 2 - \frac{f(2)}{f'(2)} = 2 - \frac{2}{4}\).` },
        explain: { tr: R`\(x_1 = 2 - 2/4 = 1{,}5\) (\(\sqrt{2} \approx 1{,}414\)'e ilk adımda yaklaştı!).`, en: R`\(x_1 = 2 - 2/4 = 1.5\) (already close to \(\sqrt{2} \approx 1.414\)!).` },
      },
    ],
  },
];
