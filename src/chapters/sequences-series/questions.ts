import type { PracticeSection } from "../../shared/practice.ts";
import { geometricPartialSum } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ss-main",
    title: { tr: "Geometrik, p-serisi, oran testi ve alterne seriler", en: "Geometric, p-series, ratio & alternating tests" },
    intro: { tr: R`Yakınsaklık testleri ve tam toplamlar.`, en: R`Convergence criteria and exact sums.` },
    read: { tab: "theory", section: "ss-partial" },
    questions: [
      {
        id: "ss-q1",
        kind: "number",
        q: {
          tr: R`\(\sum_{n=0}^\infty 3 \left(\frac{1}{4}\right)^n\) geometrik serisinin toplamı kaçtır?`,
          en: R`What is the sum of the geometric series \(\sum_{n=0}^\infty 3 \left(\frac{1}{4}\right)^n\)?`,
        },
        label: { tr: "Toplam =", en: "Sum =" },
        answer: 4,
        compute: () => 3 / (1 - 0.25),
        hint: { tr: R`\(a / (1 - r)\) formülünde \(a = 3,\ r = 1/4\).`, en: R`Use \(a / (1 - r)\) with \(a = 3,\ r = 1/4\).` },
        explain: { tr: R`\(\frac{3}{1 - 1/4} = \frac{3}{3/4} = 4\).`, en: R`\(\frac{3}{1 - 1/4} = \frac{3}{3/4} = 4\).` },
      },
      {
        id: "ss-q2",
        kind: "choice",
        q: {
          tr: R`Aşağıdaki serilerden hangisi <b>yakınsaktır</b>?`,
          en: R`Which of the following series <b>converges</b>?`,
        },
        options: [
          {
            text: { tr: R`\(\sum_{n=1}^\infty \frac{1}{\sqrt{n}}\)`, en: R`\(\sum_{n=1}^\infty \frac{1}{\sqrt{n}}\)` },
            why: { tr: R`\(p = 1/2 \le 1\) olduğundan ıraksaktır.`, en: R`A \(p\)-series with \(p = 1/2 \le 1\) diverges.` },
          },
          {
            text: { tr: R`\(\sum_{n=1}^\infty \frac{n}{2n + 1}\)`, en: R`\(\sum_{n=1}^\infty \frac{n}{2n + 1}\)` },
            why: { tr: R`Terim limiti \(1/2 \ne 0\) olduğundan derhal ıraksar.`, en: R`Terms approach \(1/2 \ne 0\), failing the divergence test.` },
          },
          { text: { tr: R`\(\sum_{n=1}^\infty \frac{1}{n^{3/2}}\)`, en: R`\(\sum_{n=1}^\infty \frac{1}{n^{3/2}}\)` } },
        ],
        answer: 2,
        compute: () => (geometricPartialSum(0.5, 40) < 2.01 ? 2 : -1),
        explain: { tr: R`\(p = 3/2 > 1\) olduğundan \(p\)-serisi yakınsaktır.`, en: R`Since \(p = 3/2 > 1\), this \(p\)-series converges.` },
      },
      {
        id: "ss-q3",
        kind: "choice",
        q: {
          tr: R`Alterne harmonik seri \(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n}\) için hangisi doğrudur?`,
          en: R`Which statement holds for the alternating harmonic series \(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n}\)?`,
        },
        options: [
          {
            text: { tr: "Mutlak yakınsaktır", en: "Absolutely convergent" },
            why: { tr: R`Mutlak değer serisi \(\sum 1/n\) ıraksaktır.`, en: R`The series of absolute values \(\sum 1/n\) diverges.` },
          },
          { text: { tr: "Koşullu yakınsaktır (Leibniz ile yakınsar, mutlak değeri ıraksar)", en: "Conditionally convergent (converges by Leibniz, but not absolutely)" } },
          {
            text: { tr: "Iraksaktır", en: "Divergent" },
            why: { tr: R`\(1/n\) pozitif, azalan ve 0'a gittiğinden Leibniz testi yakınsaklık verir (toplam \(\ln 2\)).`, en: R`Since \(1/n \downarrow 0\), the Leibniz test guarantees convergence (to \(\ln 2\)).` },
          },
        ],
        answer: 1,
        explain: { tr: R`Serinin kendisi \(\ln 2\)'ye yakınsar ama \(\sum 1/n = \infty\); bu yüzden <b>koşullu yakınsaktır</b>.`, en: R`It converges to \(\ln 2\) while \(\sum 1/n = \infty\), making it <b>conditionally convergent</b>.` },
      },
    ],
  },
];
