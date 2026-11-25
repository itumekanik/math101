import type { PracticeSection } from "../../shared/practice.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-lim-basics",
    title: { tr: "Limit sezgi, delikler ve 0/0 belirsizlikleri", en: "Limit intuition, holes & 0/0 indeterminate forms" },
    intro: {
      tr: R`Önce limitin nokta değerinden bağımsızlığını sınayın, ardından çarpanlara ayırma ve eşlenikle \(0/0\) belirsizliklerini çözün.`,
      en: R`First verify that limits ignore the single point \(f(a)\), then resolve \(0/0\) forms by factoring and rationalizing.`,
    },
    read: { tab: "theory", section: "lim-intuition" },
    questions: [
      {
        id: "lim-q1",
        kind: "choice",
        q: {
          tr: R`Bir \(f\) fonksiyonu için \(\lim_{x \to 2^-} f(x) = 4\), \(\lim_{x \to 2^+} f(x) = 4\), fakat fonksiyonun tam o noktadaki değeri \(f(2) = 10\) verilmiştir. \(\lim_{x \to 2} f(x)\) kaçtır?`,
          en: R`Suppose \(\lim_{x \to 2^-} f(x) = 4\) and \(\lim_{x \to 2^+} f(x) = 4\), while the single point value is \(f(2) = 10\). What is \(\lim_{x \to 2} f(x)\)?`,
        },
        options: [
          { text: { tr: R`\(4\)`, en: R`\(4\)` } },
          {
            text: { tr: R`\(10\)`, en: R`\(10\)` },
            why: {
              tr: R`\(10\) sayısı \(f(2)\) değeridir; limit ise \(x = 2\)'nin tam kendisindeki değere değil, sadece etrafındaki gidişata bakar.`,
              en: R`\(10\) is the value \(f(2)\); a limit ignores the value right at \(x = 2\) and only tracks the nearby trend.`,
            },
          },
          {
            text: { tr: "Limit yoktur", en: "The limit does not exist" },
            why: {
              tr: R`Sağ ve sol limitler ikisi de \(4\)'e eşit olduğundan limit vardır! Sadece \(f(2) \ne 4\) olduğu için fonksiyon \(x = 2\)'de sürekli değildir.`,
              en: R`Both one-sided limits agree at \(4\), so the limit exists! Having \(f(2) \ne 4\) breaks continuity, not the limit.`,
            },
          },
        ],
        answer: 0,
        explain: {
          tr: R`İki taraflı limit yalnızca sol ve sağ limitlerin eşitliğine bakar: \(\lim_{x \to 2^-} f(x) = \lim_{x \to 2^+} f(x) = 4 \implies \lim_{x \to 2} f(x) = 4\).`,
          en: R`A two-sided limit depends solely on the left and right approaches agreeing: both equal \(4\), so \(\lim_{x \to 2} f(x) = 4\).`,
        },
      },
      {
        id: "lim-q2",
        kind: "number",
        q: {
          tr: R`\(\lim_{x \to 2} \frac{x^2 - 4}{x - 2}\) limiti kaçtır?`,
          en: R`Evaluate \(\lim_{x \to 2} \frac{x^2 - 4}{x - 2}\).`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 4,
        compute: () => 2 + 2,
        hint: {
          tr: R`\(x = 2\) koyunca \(0/0\) çıkar; payı \((x - 2)(x + 2)\) biçiminde çarpanlara ayırıp \((x - 2)\)'yi sadeleştirin.`,
          en: R`Plugging \(x = 2\) gives \(0/0\); factor the numerator as \((x - 2)(x + 2)\) and cancel \((x - 2)\).`,
        },
        explain: {
          tr: R`\(x \ne 2\) için \(\frac{(x - 2)(x + 2)}{x - 2} = x + 2\)'dir; \(x \to 2\) iken limit \(2 + 2 = 4\).`,
          en: R`For \(x \ne 2\), the fraction simplifies to \(x + 2\), which approaches \(2 + 2 = 4\).`,
        },
      },
      {
        id: "lim-q3",
        kind: "number",
        q: {
          tr: R`Payı eşleniğiyle çarparak \(\lim_{x \to 0} \frac{\sqrt{x + 4} - 2}{x}\) limitini hesaplayın.`,
          en: R`Rationalize the numerator to compute \(\lim_{x \to 0} \frac{\sqrt{x + 4} - 2}{x}\).`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 0.25,
        compute: () => 1 / (Math.sqrt(4) + 2),
        hint: {
          tr: R`Pay ve paydayı \(\sqrt{x + 4} + 2\) ile çarpın; payda \((x + 4) - 4 = x\) kalır ve alttaki \(x\) ile sadeleşir.`,
          en: R`Multiply top and bottom by \(\sqrt{x + 4} + 2\); the numerator becomes \((x + 4) - 4 = x\) and cancels the denominator \(x\).`,
        },
        explain: {
          tr: R`Eşlenik sonrası ifade \(\frac{1}{\sqrt{x + 4} + 2}\)'ye sadeleşir; \(x \to 0\) iken \(\frac{1}{2 + 2} = 0{,}25\) bulunur.`,
          en: R`After rationalizing and canceling \(x\), we get \(\frac{1}{\sqrt{x + 4} + 2} \to \frac{1}{4} = 0.25\).`,
        },
      },
    ],
  },

  {
    id: "px-lim-special",
    title: { tr: "Trigonometrik limitler, sonsuzda limit ve Sandviç Teoremi", en: "Trig limits, limits at infinity & Squeeze Theorem" },
    intro: {
      tr: R`Temel \(\sin(u)/u \to 1\) kalıbını, baskın derece oranını ve Sandviç Teoremi tahminini uygulayın.`,
      en: R`Apply the fundamental \(\sin(u)/u \to 1\) pattern, leading-term ratios, and a live Squeeze Theorem prediction.`,
    },
    read: { tab: "theory", section: "lim-squeeze" },
    questions: [
      {
        id: "lim-q4",
        kind: "number",
        q: {
          tr: R`\(\lim_{x \to 0} \frac{\sin(5x)}{2x}\) kaçtır?`,
          en: R`What is \(\lim_{x \to 0} \frac{\sin(5x)}{2x}\)?`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 2.5,
        compute: () => 5 / 2,
        hint: {
          tr: R`Kesri \(\frac{5}{2} \cdot \frac{\sin(5x)}{5x}\) biçiminde yazıp \(u = 5x\) düşünün.`,
          en: R`Rewrite the fraction as \(\frac{5}{2} \cdot \frac{\sin(5x)}{5x}\) and let \(u = 5x\).`,
        },
        explain: {
          tr: R`\(x \to 0\) iken \(u = 5x \to 0\) ve \(\lim_{u \to 0}\frac{\sin u}{u} = 1\) olduğundan sonuç \(\frac{5}{2} \cdot 1 = 2{,}5\).`,
          en: R`As \(x \to 0\), \(u = 5x \to 0\) and \(\frac{\sin u}{u} \to 1\), leaving \(\frac{5}{2} = 2.5\).`,
        },
      },
      {
        id: "lim-q5",
        kind: "number",
        q: {
          tr: R`\(\lim_{x \to \infty} \frac{6x^3 - x + 1}{2x^3 + 5x^2}\) limiti (yatay asimptot yüksekliği) kaçtır?`,
          en: R`What is \(\lim_{x \to \infty} \frac{6x^3 - x + 1}{2x^3 + 5x^2}\) (the horizontal asymptote height)?`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 3,
        compute: () => 6 / 2,
        hint: {
          tr: R`Pay ve paydayı en büyük kuvvet \(x^3\)'e bölün; \(1/x\) içeren terimler \(0\)'a gider.`,
          en: R`Divide numerator and denominator by \(x^3\); all lower-power terms vanish as \(x \to \infty\).`,
        },
        explain: {
          tr: R`\(\frac{6 - 1/x^2 + 1/x^3}{2 + 5/x} \to \frac{6}{2} = 3\). Grafik \(x \to \infty\)'da \(y = 3\) doğrusuna yapışır.`,
          en: R`Dividing by \(x^3\) leaves \(\frac{6 - 1/x^2 + 1/x^3}{2 + 5/x} \to \frac{6}{2} = 3\).`,
        },
      },
      {
        id: "lim-q6",
        kind: "predict",
        q: {
          tr: R`\(x\) sayısı \(0\)'a yaklaşırken \(\sin(1/x)\) sonsuz kez \(-1\) ile \(+1\) arasında titreşir. Peki \(f(x) = x^2 \sin(1/x)\) için \(x \to 0\) limiti ne olur?`,
          en: R`As \(x \to 0\), \(\sin(1/x)\) oscillates infinitely between \(-1\) and \(+1\). What happens to \(f(x) = x^2 \sin(1/x)\) as \(x \to 0\)?`,
        },
        options: [
          { tr: R`Sıfıra yakınsar (\(\lim_{x \to 0} f(x) = 0\))`, en: R`Converges to zero (\(\lim_{x \to 0} f(x) = 0\))` },
          { tr: R`Titreşim yüzünden limit yoktur`, en: R`No limit exists due to oscillation` },
          { tr: R`\(1\)'e yakınsar`, en: R`Converges to \(1\)` },
        ],
        answer: 0,
        run: () => {
          const v1 = 1e-3 * 1e-3 * Math.sin(1e3);
          const v2 = 1e-4 * 1e-4 * Math.sin(1e4);
          const ok = Math.abs(v2) <= 1e-8;
          return {
            answer: ok ? 0 : 1,
            result: {
              tr: R`\(f(10^{-3}) \approx ${v1.toExponential(2)}\), \(f(10^{-4}) \approx ${v2.toExponential(2)}\); her zaman \(|f(x)| \le x^2 \to 0\)!`,
              en: R`\(f(10^{-3}) \approx ${v1.toExponential(2)}\), \(f(10^{-4}) \approx ${v2.toExponential(2)}\); always bounded by \(|f(x)| \le x^2 \to 0\)!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "lim-squeeze" },
        explain: {
          tr: R`\(-1 \le \sin(1/x) \le 1\) eşitsizliğini \(x^2 \ge 0\) ile çarpınca \(-x^2 \le x^2\sin(1/x) \le x^2\) çıkar. İki sınır da \(0\)'a gittiğinden Sandviç Teoremi limiti \(0\) yapar!`,
          en: R`Multiplying \(-1 \le \sin(1/x) \le 1\) by \(x^2 \ge 0\) traps \(x^2\sin(1/x)\) between \(-x^2\) and \(x^2\); by the Squeeze Theorem the limit is \(0\).`,
        },
      },
    ],
  },

  {
    id: "px-lim-cont",
    title: { tr: "Süreklilik ve Ara Değer Teoremi (IVT)", en: "Continuity & Intermediate Value Theorem (IVT)" },
    intro: {
      tr: R`Sürekli bir fonksiyonun işaret değiştirdiğinde kök üretme garantisini kontrol edin.`,
      en: R`Verify how continuity turns a sign change into a guaranteed root.`,
    },
    read: { tab: "theory", section: "lim-continuity" },
    questions: [
      {
        id: "lim-q7",
        kind: "choice",
        q: {
          tr: R`\(f(x) = x^3 + x - 1\) için \(f(0) = -1 < 0\) ve \(f(1) = 1 > 0\) bulunur. \((0, 1)\) aralığında en az bir \(c\) kökü (\(f(c) = 0\)) olduğunu hangi teorem garantiler?`,
          en: R`For \(f(x) = x^3 + x - 1\), we have \(f(0) = -1 < 0\) and \(f(1) = 1 > 0\). Which theorem guarantees at least one root \(c \in (0, 1)\) with \(f(c) = 0\)?`,
        },
        options: [
          { text: { tr: "Ara Değer Teoremi (IVT)", en: "Intermediate Value Theorem (IVT)" } },
          {
            text: { tr: "Sandviç (Sıkıştırma) Teoremi", en: "Squeeze (Sandwich) Theorem" },
            why: {
              tr: R`Sandviç Teoremi, iki fonksiyon arasına sıkışan bir fonksiyonun limitini bulmak içindir; kök varlığını değil.`,
              en: R`The Squeeze Theorem traps a limit between two bounding curves rather than guaranteeing roots.`,
            },
          },
          {
            text: { tr: "Cauchy–Schwarz Eşitsizliği", en: "Cauchy–Schwarz Inequality" },
            why: {
              tr: R`Cauchy–Schwarz vektörlerin iç çarpımlarıyla ilgilidir (\(|\langle u, v \rangle| \le \|u\|\|v\|\)).`,
              en: R`Cauchy–Schwarz bounds inner products of vectors (\(|\langle u, v \rangle| \le \|u\|\|v\|\)).`,
            },
          },
        ],
        answer: 0,
        explain: {
          tr: R`Polinomlar her yerde süreklidir. \([0, 1]\) kapalı aralığının uçlarında işaret değiştiğinden Ara Değer Teoremi (IVT) arada en az bir \(c \in (0, 1)\) kökü (\(f(c) = 0\)) garantiler.`,
          en: R`Polynomials are continuous everywhere; because \(f\) changes sign from \(-1\) to \(+1\) on \([0, 1]\), the IVT guarantees some \(c \in (0, 1)\) with \(f(c) = 0\).`,
        },
      },
    ],
  },
];
