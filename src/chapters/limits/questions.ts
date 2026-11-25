import type { PracticeSection } from "../../shared/practice.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-lim-main",
    title: { tr: "Limit hesapları, Sandviç Teoremi ve süreklilik", en: "Limit evaluation, Squeeze Theorem & continuity" },
    intro: { tr: R`Belirsizlik giderme, temel trigonometrik limitler ve IVT.`, en: R`Resolving indeterminate forms, trig limits, and IVT.` },
    read: { tab: "theory", section: "lim-ed" },
    questions: [
      {
        id: "lim-q1",
        kind: "number",
        q: {
          tr: R`\(\lim_{x\to 2} \frac{x^2 - 4}{x - 2}\) limiti kaçtır?`,
          en: R`Evaluate \(\lim_{x\to 2} \frac{x^2 - 4}{x - 2}\).`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 4,
        compute: () => 2 + 2,
        hint: { tr: R`Payı \((x-2)(x+2)\) diye çarpanlara ayırıp sadeleştirin.`, en: R`Factor the numerator as \((x-2)(x+2)\) and cancel.` },
        explain: { tr: R`\(x\ne 2\) için kesir \(x+2\)'ye eşittir; \(x\to 2\) iken limit \(2+2 = 4\).`, en: R`For \(x\ne 2\), the ratio simplifies to \(x+2\), approaching \(4\).` },
      },
      {
        id: "lim-q2",
        kind: "number",
        q: {
          tr: R`\(\lim_{x\to 0} \frac{\sin(5x)}{2x}\) kaçtır?`,
          en: R`What is \(\lim_{x\to 0} \frac{\sin(5x)}{2x}\)?`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 2.5,
        compute: () => 5 / 2,
        hint: { tr: R`\(\frac{5}{2}\cdot\frac{\sin(5x)}{5x}\) biçiminde yazın.`, en: R`Rewrite as \(\frac{5}{2}\cdot\frac{\sin(5x)}{5x}\).` },
        explain: { tr: R`\(\lim_{u\to 0}\frac{\sin u}{u}=1\) olduğundan sonuç \(\frac{5}{2} = 2{,}5\).`, en: R`Using \(\lim_{u\to 0}\frac{\sin u}{u}=1\), the limit is \(\frac{5}{2} = 2.5\).` },
      },
      {
        id: "lim-q3",
        kind: "number",
        q: {
          tr: R`\(\lim_{x\to\infty} \frac{6x^3 - x + 1}{2x^3 + 5x^2}\) limiti kaçtır?`,
          en: R`What is \(\lim_{x\to\infty} \frac{6x^3 - x + 1}{2x^3 + 5x^2}\)?`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 3,
        compute: () => 6 / 2,
        hint: { tr: R`Pay ve paydayı en yüksek derece \(x^3\)'e bölün.`, en: R`Divide numerator and denominator by \(x^3\).` },
        explain: { tr: R`Baskın terimler oranı \(6/2 = 3\)'tür.`, en: R`The ratio of leading coefficients is \(6/2 = 3\).` },
      },
      {
        id: "lim-q4",
        kind: "choice",
        q: {
          tr: R`\(f(x) = x^3 + x - 1\) için \(f(0) = -1 < 0\) ve \(f(1) = 1 > 0\). Hangi teorem \((0,1)\) aralığında en az bir kök garantiler?`,
          en: R`For \(f(x) = x^3 + x - 1\), \(f(0) = -1 < 0\) and \(f(1) = 1 > 0\). Which theorem guarantees a root in \((0,1)\)?`,
        },
        options: [
          { text: { tr: "Ara Değer Teoremi (IVT)", en: "Intermediate Value Theorem (IVT)" } },
          {
            text: { tr: "Sandviç Teoremi", en: "Squeeze Theorem" },
            why: { tr: R`Sandviç Teoremi iki fonksiyon arasında sıkışan limit içindir.`, en: R`The Squeeze Theorem traps limits between two bounding functions.` },
          },
          {
            text: { tr: "Cauchy–Schwarz Eşitsizliği", en: "Cauchy–Schwarz Inequality" },
            why: { tr: R`Cauchy–Schwarz vektör iç çarpımlarıyla ilgilidir.`, en: R`Cauchy–Schwarz concerns inner products of vectors.` },
          },
        ],
        answer: 0,
        explain: { tr: R`Polinomlar süreklidir; işaret değiştirdiği \([0,1]\) aralığında IVT en az bir \(c \in (0,1)\) ile \(f(c)=0\) garantiler.`, en: R`Because \(f\) is continuous and changes sign on \([0,1]\), the IVT guarantees some \(c\in(0,1)\) with \(f(c)=0\).` },
      },
    ],
  },
];
