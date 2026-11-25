import type { PracticeSection } from "../../shared/practice.ts";
import { riemannSum, simpson } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-def-riemann",
    title: { tr: "İşaretli alan ve Riemann toplamları", en: "Signed area & Riemann sums" },
    intro: {
      tr: R`Belirli integralin işaretli alan anlamı ve dikdörtgen yaklaşımlarının karşılaştırılması.`,
      en: R`Signed area cancellation and comparing numerical Riemann approximations.`,
    },
    read: { tab: "theory", section: "di-riemann" },
    questions: [
      {
        id: "def-q1",
        kind: "choice",
        q: {
          tr: R`\(\int_0^{2\pi} \sin x\,dx\) belirli integrali neden \(0\) çıkar?`,
          en: R`Why does \(\int_0^{2\pi} \sin x\,dx\) equal \(0\)?`,
        },
        options: [
          {
            text: { tr: R`\(\sin x\) bu aralıkta her yerde \(0\)'dır`, en: R`\(\sin x\) is zero everywhere on \([0, 2\pi]\)` },
            why: { tr: R`\(\sin x\) sadece \(0, \pi, 2\pi\) noktalarında sıfırdır; arada pozitif ve negatif tepecikler vardır.`, en: R`\(\sin x\) is nonzero almost everywhere; it creates equal positive and negative humps.` },
          },
          {
            text: { tr: "Pozitif [0, π] alanı (+2) ile negatif [π, 2π] alanı (−2) birbirini götürür", en: "The positive area (+2) on [0, π] and negative area (−2) on [π, 2π] cancel out" },
          },
          {
            text: { tr: "Çünkü integrali alırken + C sabiti 0'a eşitlenmiştir", en: "Because the constant + C was chosen to be 0" },
            why: { tr: R`Belirli integralde \(+ C\) zaten \(F(b) - F(a)\) çıkarma işleminde kaybolur; sıfır çıkmasının sebebi işaretli alanların birbirini dengelemesidir.`, en: R`\(+ C\) cancels in any definite integral; zero happens specifically because positive and negative areas cancel.` },
          },
        ],
        answer: 1,
        compute: () => (Math.abs(simpson(Math.sin, 0, 2 * Math.PI, 40)) < 1e-9 ? 1 : -1),
        explain: {
          tr: R`Belirli integral <b>işaretli alandır</b>: \((+2) + (-2) = 0\). Eğer boyanacak toplam geometrik alan sorulursa \(\int_0^{2\pi}|\sin x|\,dx = 4\)'tür.`,
          en: R`Definite integrals measure <b>signed area</b>: \((+2) + (-2) = 0\). Total unsigned area would be \(\int_0^{2\pi}|\sin x|\,dx = 4\).`,
        },
      },
      {
        id: "def-q2",
        kind: "number",
        q: {
          tr: R`\(\int_0^2 (3x^2 + 1)\,dx\) belirli integralinin değeri kaçtır?`,
          en: R`Evaluate the definite integral \(\int_0^2 (3x^2 + 1)\,dx\).`,
        },
        label: { tr: "İntegral =", en: "Integral =" },
        answer: 10,
        compute: () => simpson((x) => 3 * x * x + 1, 0, 2, 20),
        hint: { tr: R`İlkel fonksiyon \(F(x) = x^3 + x\); \(F(2) - F(0)\) hesaplayın.`, en: R`Antiderivative \(F(x) = x^3 + x\); compute \(F(2) - F(0)\).` },
        explain: { tr: R`\(\big[x^3 + x\big]_0^2 = (8 + 2) - (0 + 0) = 10\).`, en: R`\(\big[x^3 + x\big]_0^2 = (8 + 2) - 0 = 10\).` },
      },
      {
        id: "def-q3",
        kind: "predict",
        q: {
          tr: R`\(f(x) = 0{,}25x^2\) fonksiyonunun \([0, 4]\) aralığındaki integralini (kesin değer \(16/3 \approx 5{,}333\)) \(n = 4\) dilimle tahmin ederken, <b>Sol</b> toplam mı yoksa <b>Orta Nokta</b> toplamı mı kesin değere çok daha yakın çıkar?`,
          en: R`When approximating \(\int_0^4 0.25x^2\,dx = 16/3 \approx 5.333\) with \(n = 4\) strips, which rule lands much closer to the exact value?`,
        },
        options: [
          { tr: "Sol Riemann toplamı (hata neredeyse 0)", en: "Left Riemann sum (almost zero error)" },
          { tr: "Orta Nokta toplamı (hatası Sol toplamdan çok daha küçük!)", en: "Midpoint rule (error is dramatically smaller than Left!)" },
          { tr: "İkisi tam olarak aynı sayıyı verir", en: "Both produce the exact same number" },
        ],
        answer: 1,
        run: () => {
          const f = (x: number) => 0.25 * x * x;
          const exact = 16 / 3;
          const errL = Math.abs(riemannSum(f, 0, 4, 4, "left") - exact);
          const errM = Math.abs(riemannSum(f, 0, 4, 4, "mid") - exact);
          return {
            answer: errM < errL ? 1 : 0,
            result: {
              tr: R`Sol toplam hatası \(= ${errL.toFixed(3).replace(".", "{,}")}\), Orta Nokta hatası ise yalnızca \(= ${errM.toFixed(3).replace(".", "{,}")}\) (20+ kat daha keskin)!`,
              en: R`Left error \(= ${errL.toFixed(3)}\) vs Midpoint error \(= ${errM.toFixed(3)}\) (over 20× sharper)!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "di-riemann" },
        explain: {
          tr: R`Artan bir fonksiyonda Sol toplam her dilimde alttan kalır (\(3{,}5\)); Orta Nokta toplamında ise şeridin yarısı üstte yarısı altta kaldığından hatalar dengelenir (\(5{,}25\)).`,
          en: R`On an increasing curve, Left underestimates every strip (\(3.5\)), whereas Midpoint balances overhang and underhang inside each strip (\(5.25\)).`,
        },
      },
    ],
  },
  {
    id: "px-def-ftc",
    title: { tr: "FTC, simetri ve belirli u-dönüşümü", en: "FTC, symmetry & definite u-substitution" },
    intro: {
      tr: R`Alan biriktiricinin türevi, tek/çift fonksiyon kısayolları ve sınır dönüşümü.`,
      en: R`Differentiating area accumulators, even/odd shortcuts, and converting limits in u-sub.`,
    },
    read: { tab: "theory", section: "di-ftc" },
    questions: [
      {
        id: "def-q4",
        kind: "number",
        q: {
          tr: R`\(A(x) = \int_1^x \sqrt{t^2 + 9}\,dt\) ise Kalkülüsün Temel Teoremi'ne göre \(A'(4)\) kaçtır?`,
          en: R`If \(A(x) = \int_1^x \sqrt{t^2 + 9}\,dt\), what is \(A'(4)\) by the Fundamental Theorem of Calculus?`,
        },
        label: { tr: R`\(A'(4) =\)`, en: R`\(A'(4) =\)` },
        answer: 5,
        compute: () => Math.sqrt(4 * 4 + 9),
        hint: { tr: R`İntegrali hesaplamaya hiç gerek yok! FTC 1. Kısım gereği \(A'(x) = \sqrt{x^2 + 9}\).`, en: R`No integration needed! By FTC Part 1, \(A'(x) = \sqrt{x^2 + 9}\).` },
        explain: { tr: R`\(A'(x) = \sqrt{x^2 + 9} \implies A'(4) = \sqrt{16 + 9} = \sqrt{25} = 5\).`, en: R`\(A'(x) = \sqrt{x^2 + 9} \implies A'(4) = \sqrt{16 + 9} = 5\).` },
      },
      {
        id: "def-q5",
        kind: "number",
        q: {
          tr: R`Tek/çift simetri kısayolunu kullanarak \(\int_{-3}^3 (x^5 - 4x + 2)\,dx\) integralini hesaplayın.`,
          en: R`Use even/odd symmetry to evaluate \(\int_{-3}^3 (x^5 - 4x + 2)\,dx\).`,
        },
        label: { tr: "İntegral =", en: "Integral =" },
        answer: 12,
        compute: () => simpson((x) => x ** 5 - 4 * x + 2, -3, 3, 40),
        hint: { tr: R`\(x^5\) ve \(-4x\) tek fonksiyonlardır (\([-3, 3]\)'te integralleri \(0\))! Geriye sadece \(\int_{-3}^3 2\,dx\) kalır.`, en: R`\(x^5\) and \(-4x\) are odd (integrating to \(0\) on \([-3, 3]\)); only \(\int_{-3}^3 2\,dx\) remains!` },
        explain: { tr: R`Tek terimler simetrik aralıkta sıfırlanır: \(0 - 0 + \int_{-3}^3 2\,dx = 2 \cdot (3 - (-3)) = 12\).`, en: R`Odd terms vanish on \([-3, 3]\), leaving \(\int_{-3}^3 2\,dx = 2 \cdot 6 = 12\).` },
      },
      {
        id: "def-q6",
        kind: "choice",
        q: {
          tr: R`\(\int_0^2 2x(x^2 + 1)^3\,dx\) belirli integralinde \(u = x^2 + 1\) dönüşümü yapıldığında yeni integral hangisi olur?`,
          en: R`When applying \(u = x^2 + 1\) to \(\int_0^2 2x(x^2 + 1)^3\,dx\), what is the correct transformed integral?`,
        },
        options: [
          {
            text: { tr: R`\(\int_0^2 u^3\,du\)`, en: R`\(\int_0^2 u^3\,du\)` },
            why: { tr: R`Klasik tuzak! \(0\) ve \(2\) eski \(x\) sınırlarıdır; \(u = x^2 + 1\) sınırlarını güncellemeyi unuttunuz!`, en: R`Classic trap! \(0\) and \(2\) are the old \(x\)-limits; you forgot to convert them via \(u = x^2 + 1\)!` },
          },
          {
            text: { tr: R`\(\int_1^5 u^3\,du\)`, en: R`\(\int_1^5 u^3\,du\)` },
          },
          {
            text: { tr: R`\(\int_1^4 u^3\,du\)`, en: R`\(\int_1^4 u^3\,du\)` },
            why: { tr: R`Üst sınırı tekrar kontrol edin: \(x = 2 \implies u = 2^2 + 1 = 5\), \(4\) değil!`, en: R`Recheck the upper limit: \(x = 2 \implies u = 2^2 + 1 = 5\), not \(4\)!` },
          },
        ],
        answer: 1,
        compute: () => {
          const orig = simpson((x) => 2 * x * (x * x + 1) ** 3, 0, 2, 200);
          const sub = simpson((u) => u ** 3, 1, 5, 40);
          return Math.abs(orig - sub) < 1e-6 ? 1 : -1;
        },
        explain: {
          tr: R`\(du = 2x\,dx\) olur; alt sınır \(x = 0 \to u = 1\), üst sınır \(x = 2 \to u = 5\) olur. Böylece \(\int_1^5 u^3\,du = \frac{5^4 - 1^4}{4} = 156\).`,
          en: R`\(du = 2x\,dx\); lower limit \(x = 0 \to u = 1\), upper limit \(x = 2 \to u = 5\), yielding \(\int_1^5 u^3\,du = 156\).`,
        },
      },
    ],
  },
  {
    id: "px-def-improper",
    title: { tr: "Genelleştirilmiş integraller", en: "Improper integrals" },
    intro: {
      tr: R`Sonsuz aralıkların yakınsaklığı ve p-testi sınır değeri.`,
      en: R`Convergence of infinite tails and the p-integral borderline.`,
    },
    read: { tab: "theory", section: "di-improper" },
    questions: [
      {
        id: "def-q7",
        kind: "number",
        q: {
          tr: R`Genelleştirilmiş integral \(\int_1^\infty \frac{1}{x^3}\,dx\) kaçtır?`,
          en: R`Evaluate the improper integral \(\int_1^\infty \frac{1}{x^3}\,dx\).`,
        },
        label: { tr: "Değer =", en: "Value =" },
        answer: 0.5,
        compute: () => 1 / (3 - 1),
        hint: { tr: R`\(p = 3 > 1\) olduğundan yakınsaktır ve formülü \(\frac{1}{p - 1}\)'dir.`, en: R`Since \(p = 3 > 1\), it converges to \(\frac{1}{p - 1}\).` },
        explain: {
          tr: R`\(\lim_{b\to\infty}\left[-\frac{1}{2x^2}\right]_1^b = 0 - \left(-\frac{1}{2}\right) = 0{,}5\).`,
          en: R`\(\lim_{b\to\infty}\left[-\frac{1}{2x^2}\right]_1^b = 0 - \left(-\frac{1}{2}\right) = 0.5\).`,
        },
      },
    ],
  },
];
