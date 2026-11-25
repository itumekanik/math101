import type { PracticeSection } from "../../shared/practice.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-seq-basic",
    title: { tr: "Dizilerin limiti, geometrik seriler ve harmonik tuzak", en: "Sequence limits, geometric series & the harmonic trap" },
    intro: {
      tr: R`Önce dizi limitini ve geometrik seri toplamını hesaplayın, ardından serilerdeki en yaygın mantık tuzağını test edin.`,
      en: R`Compute a sequence limit and a geometric sum, then test the single most common misconception in infinite series.`,
    },
    read: { tab: "theory", section: "ss-seq" },
    questions: [
      {
        id: "seq-q1",
        kind: "number",
        q: {
          tr: R`\(a_n = \frac{4n^2 - n}{2n^2 + 5}\) dizisinin \(n \to \infty\) limiti kaçtır?`,
          en: R`What is the limit of the sequence \(a_n = \frac{4n^2 - n}{2n^2 + 5}\) as \(n \to \infty\)?`,
        },
        label: { tr: R`\(\lim a_n =\)`, en: R`\(\lim a_n =\)` },
        answer: 2,
        compute: () => 4 / 2,
        hint: {
          tr: R`Pay ve paydayı en büyük kuvvet \(n^2\)'ye bölün.`,
          en: R`Divide numerator and denominator by the highest power \(n^2\).`,
        },
        explain: {
          tr: R`\(\frac{4 - 1/n}{2 + 5/n^2} \to \frac{4}{2} = 2\).`,
          en: R`Dividing by \(n^2\) gives \(\frac{4 - 1/n}{2 + 5/n^2} \to \frac{4}{2} = 2\).`,
        },
      },
      {
        id: "seq-q2",
        kind: "number",
        q: {
          tr: R`\(\sum_{n=0}^\infty 3 \left(\frac{1}{4}\right)^n\) geometrik serisinin tam toplamı kaçtır?`,
          en: R`What is the exact sum of the geometric series \(\sum_{n=0}^\infty 3 \left(\frac{1}{4}\right)^n\)?`,
        },
        label: { tr: "Toplam =", en: "Sum =" },
        answer: 4,
        compute: () => 3 / (1 - 0.25),
        hint: {
          tr: R`\(|r| = \frac{1}{4} < 1\) olduğundan \(\frac{a}{1 - r}\) formülünde \(a = 3,\ r = \frac{1}{4}\) yazın.`,
          en: R`Since \(|r| = \frac{1}{4} < 1\), plug \(a = 3,\ r = \frac{1}{4}\) into \(\frac{a}{1 - r}\).`,
        },
        explain: {
          tr: R`\(\frac{3}{1 - 1/4} = \frac{3}{3/4} = 4\).`,
          en: R`\(\frac{3}{1 - 1/4} = \frac{3}{3/4} = 4\).`,
        },
      },
      {
        id: "seq-q3",
        kind: "choice",
        q: {
          tr: R`Bir öğrenci şöyle iddia ediyor: <i>"\(\lim_{n \to \infty} a_n = 0\) ise \(\sum_{n=1}^\infty a_n\) serisi mutlaka yakınsaktır."</i> Bu iddia doğru mudur?`,
          en: R`A student claims: <i>"If \(\lim_{n \to \infty} a_n = 0\), then \(\sum_{n=1}^\infty a_n\) must converge."</i> Is this true?`,
        },
        options: [
          {
            text: { tr: "Doğru — terimler sıfıra inince toplam mutlaka durur", en: "True — shrinking terms always make the sum stop" },
            why: {
              tr: R`Klasik tuzak! Terimlerin sıfıra inmesi yetmez, <i>yeterince hızlı</i> inmesi gerekir. Örneğin harmonik seride \(1/n \to 0\) ama toplam \(\infty\)'dur!`,
              en: R`Classic trap! Terms must shrink <i>fast enough</i>. In the harmonic series, \(1/n \to 0\) yet \(\sum 1/n = \infty\)!`,
            },
          },
          { text: { tr: R`Yanlış — harmonik seri \(\sum \frac{1}{n}\) için \(a_n \to 0\) olduğu hâlde seri ıraksar`, en: R`False — the harmonic series \(\sum \frac{1}{n}\) has \(a_n \to 0\) yet diverges` } },
          {
            text: { tr: R`Yalnızca terimler pozitifse doğrudur`, en: R`True only if all terms are positive` },
            why: {
              tr: R`Harmonik seri \(\sum \frac{1}{n}\) zaten tamamen pozitif terimlidir ve buna rağmen ıraksar!`,
              en: R`The harmonic series \(\sum \frac{1}{n}\) already has all positive terms and still diverges!`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(a_n \to 0\) koşulu yakınsaklık için <b>gereklidir ama yeterli değildir</b>. Karşı örnek olarak harmonik seri \(\sum_{n=1}^\infty \frac{1}{n} = \infty\) her zaman aklınızda olsun!`,
          en: R`\(a_n \to 0\) is <b>necessary but NOT sufficient</b> for convergence; the harmonic series \(\sum 1/n = \infty\) is the gold-standard counterexample!`,
        },
      },
    ],
  },

  {
    id: "px-seq-tests",
    title: { tr: "p-Serileri ve Oran Testi (d'Alembert)", en: "p-Series & Ratio Test (d'Alembert)" },
    intro: {
      tr: R`\(p > 1\) eşiğini ve Oran Testi limitini hesaplayarak yakınsaklık kararını verin.`,
      en: R`Apply the \(p > 1\) threshold and compute a Ratio Test limit.`,
    },
    read: { tab: "theory", section: "ss-integral-test" },
    questions: [
      {
        id: "seq-q4",
        kind: "choice",
        q: {
          tr: R`Aşağıdaki serilerden hangisi <b>yakınsaktır</b>?`,
          en: R`Which of the following series <b>converges</b>?`,
        },
        options: [
          {
            text: { tr: R`\(\sum_{n=1}^\infty \frac{1}{\sqrt{n}}\)`, en: R`\(\sum_{n=1}^\infty \frac{1}{\sqrt{n}}\)` },
            why: {
              tr: R`Bu \(p = \frac{1}{2} \le 1\) olan bir \(p\)-serisidir, dolayısıyla ıraksar.`,
              en: R`This is a \(p\)-series with \(p = \frac{1}{2} \le 1\), so it diverges.`,
            },
          },
          {
            text: { tr: R`\(\sum_{n=1}^\infty \frac{n}{2n + 1}\)`, en: R`\(\sum_{n=1}^\infty \frac{n}{2n + 1}\)` },
            why: {
              tr: R`Terimlerin limiti \(\frac{1}{2} \ne 0\) olduğundan Iraksaklık Testi ile derhal ıraksar.`,
              en: R`Its terms approach \(\frac{1}{2} \ne 0\), so it fails the Divergence Test immediately.`,
            },
          },
          { text: { tr: R`\(\sum_{n=1}^\infty \frac{1}{n^{3/2}}\)`, en: R`\(\sum_{n=1}^\infty \frac{1}{n^{3/2}}\)` } },
        ],
        answer: 2,
        explain: {
          tr: R`\(p = \frac{3}{2} = 1{,}5 > 1\) olduğundan \(\sum \frac{1}{n^{3/2}}\) yakınsak bir \(p\)-serisidir.`,
          en: R`Since \(p = \frac{3}{2} = 1.5 > 1\), this \(p\)-series converges.`,
        },
      },
      {
        id: "seq-q5",
        kind: "number",
        q: {
          tr: R`\(\sum_{n=1}^\infty \frac{3^n}{4^n \cdot n}\) serisine Oran Testi uygulandığında \(L = \lim_{n \to \infty}\left|\frac{a_{n+1}}{a_n}\right|\) değeri kaç çıkar?`,
          en: R`Applying the Ratio Test to \(\sum_{n=1}^\infty \frac{3^n}{4^n \cdot n}\), what is the limit \(L = \lim_{n \to \infty}\left|\frac{a_{n+1}}{a_n}\right|\)?`,
        },
        label: { tr: R`\(L =\)`, en: R`\(L =\)` },
        answer: 0.75,
        compute: () => 3 / 4,
        hint: {
          tr: R`\(\frac{a_{n+1}}{a_n} = \frac{3}{4} \cdot \frac{n}{n + 1}\) ifadesinin \(n \to \infty\) limitini alın.`,
          en: R`Simplify \(\frac{a_{n+1}}{a_n} = \frac{3}{4} \cdot \frac{n}{n + 1}\) and let \(n \to \infty\).`,
        },
        explain: {
          tr: R`\(\lim_{n \to \infty}\frac{3}{4}\cdot\frac{n}{n+1} = \frac{3}{4} = 0{,}75 < 1\), dolayısıyla seri mutlak yakınsaktır!`,
          en: R`\(\lim_{n \to \infty}\frac{3}{4}\cdot\frac{n}{n+1} = 0.75 < 1\), proving absolute convergence!`,
        },
      },
    ],
  },

  {
    id: "px-seq-alt",
    title: { tr: "Alterne Seriler, Koşullu Yakınsaklık ve Hata Sınırı", en: "Alternating Series, Conditional Convergence & Error Bound" },
    intro: {
      tr: R`İşaret değiştiren serilerde mutlak/koşullu yakınsaklık ayrımını ve Leibniz hata tahminini sınayın.`,
      en: R`Test absolute vs conditional convergence and verify the Leibniz error bound live.`,
    },
    read: { tab: "theory", section: "ss-tests" },
    questions: [
      {
        id: "seq-q6",
        kind: "choice",
        q: {
          tr: R`Alterne harmonik seri \(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n}\) için hangisi doğrudur?`,
          en: R`Which statement holds for the alternating harmonic series \(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n}\)?`,
        },
        options: [
          {
            text: { tr: "Mutlak yakınsaktır", en: "Absolutely convergent" },
            why: {
              tr: R`Mutlak değer serisi \(\sum \frac{1}{n}\) (harmonik seri) ıraksaktır!`,
              en: R`The series of absolute values \(\sum \frac{1}{n}\) is the divergent harmonic series!`,
            },
          },
          { text: { tr: "Koşullu yakınsaktır (Leibniz ile yakınsar, mutlak değeri ıraksar)", en: "Conditionally convergent (converges by Leibniz, not absolutely)" } },
          {
            text: { tr: "Iraksaktır", en: "Divergent" },
            why: {
              tr: R`\(b_n = 1/n\) pozitif, azalan ve \(0\)'a gittiğinden Leibniz testi yakınsaklık verir (toplamı \(\ln 2\)).`,
              en: R`Since \(b_n = 1/n\) decreases steadily to \(0\), the Leibniz test guarantees convergence (to \(\ln 2\)).`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Serinin kendisi \(\ln 2\)'ye yakınsar ama mutlak değerli hâli \(\sum \frac{1}{n} = \infty\); bu yüzden <b>koşullu yakınsaktır</b>.`,
          en: R`It converges to \(\ln 2\) while \(\sum 1/n = \infty\), making it the classic <b>conditionally convergent</b> series.`,
        },
      },
      {
        id: "seq-q7",
        kind: "predict",
        q: {
          tr: R`Alterne seri \(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n^2} = \frac{\pi^2}{12}\) için yalnızca ilk \(N = 9\) terimi toplarsak, gerçek hata \(|S - S_9|\) değeri \(0{,}01\)'den küçük veya eşit midir?`,
          en: R`If we sum just the first \(N = 9\) terms of \(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n^2} = \frac{\pi^2}{12}\), is the actual error \(|S - S_9|\) guaranteed to be \(\le 0.01\)?`,
        },
        options: [
          { tr: R`Evet — Leibniz sınırına göre \(|S - S_9| \le b_{10} = \frac{1}{100} = 0{,}01\)`, en: R`Yes — by Leibniz, \(|S - S_9| \le b_{10} = \frac{1}{100} = 0.01\)` },
          { tr: R`Hayır — 100 terimden azıyla \(0{,}01\) hataya inilemez`, en: R`No — fewer than 100 terms cannot reach \(0.01\) error` },
          { tr: R`Seri ıraksak olduğu için hata tanımlı değildir`, en: R`Error is undefined because the series diverges` },
        ],
        answer: 0,
        run: () => {
          let s9 = 0;
          for (let n = 1; n <= 9; n++) s9 += (n % 2 === 1 ? 1 : -1) / (n * n);
          const exact = (Math.PI * Math.PI) / 12;
          const err = Math.abs(exact - s9);
          return {
            answer: err <= 0.01 ? 0 : 1,
            result: {
              tr: R`\(S_9 \approx ${s9.toFixed(5)}\), \(S = \frac{\pi^2}{12} \approx ${exact.toFixed(5)}\), gerçek hata \(|S - S_9| \approx ${err.toFixed(5)} \le 0{,}01\)!`,
              en: R`\(S_9 \approx ${s9.toFixed(5)}\), \(S = \frac{\pi^2}{12} \approx ${exact.toFixed(5)}\), actual error \(|S - S_9| \approx ${err.toFixed(5)} \le 0.01\)!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "ss-tests" },
        explain: {
          tr: R`Leibniz hata sınırı \(|S - S_N| \le b_{N+1}\) der. \(N = 9\) için atlanan ilk terim \(b_{10} = \frac{1}{10^2} = 0{,}01\)'dir; gerçek hata (\(\approx 0{,}0052\)) bundan bile küçüktür!`,
          en: R`Leibniz bounds the error by the first omitted term \(b_{10} = \frac{1}{10^2} = 0.01\); the true error (\(\approx 0.0052\)) is about half that bound!`,
        },
      },
    ],
  },
];
