import type { PracticeSection } from "../../shared/practice.ts";
import { newtonRaphson } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-der-rules",
    title: { tr: "Türev kuralları, teğet eğimi ve Zincir Kuralı", en: "Differentiation rules, tangent slopes & Chain Rule" },
    intro: {
      tr: R`Kuvvet ve zincir kurallarıyla anlık eğim hesaplama ve klasik zincir kuralı tuzağını yakalama.`,
      en: R`Practice tangent slopes with power and chain rules, plus spotting the #1 chain-rule mistake.`,
    },
    read: { tab: "theory", section: "der-chain" },
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
        hint: {
          tr: R`Zincir kuralıyla \((e^{3x})' = 3e^{3x}\) olur; sonra \(x = 0\) koyun.`,
          en: R`By the Chain Rule, \((e^{3x})' = 3e^{3x}\); then substitute \(x = 0\).`,
        },
        explain: {
          tr: R`\(f'(x) = 3e^{3x} + 2x\). Buradan \(f'(0) = 3e^0 + 0 = 3\).`,
          en: R`\(f'(x) = 3e^{3x} + 2x\), so \(f'(0) = 3 \cdot 1 + 0 = 3\).`,
        },
      },
      {
        id: "der-q2",
        kind: "choice",
        q: {
          tr: R`\(\frac{d}{dx}\big[\sin(x^2)\big]\) türevi aşağıdakilerden hangisidir?`,
          en: R`Which of the following equals \(\frac{d}{dx}\big[\sin(x^2)\big]\)?`,
        },
        options: [
          {
            text: { tr: R`\(\cos(x^2)\)`, en: R`\(\cos(x^2)\)` },
            why: {
              tr: R`İç fonksiyon \(g(x) = x^2\)'nin türevi olan \(2x\) ile çarpmayı unuttunuz!`,
              en: R`You forgot to multiply by the inner derivative \((x^2)' = 2x\)!`,
            },
          },
          { text: { tr: R`\(2x\cos(x^2)\)`, en: R`\(2x\cos(x^2)\)` } },
          {
            text: { tr: R`\(\cos(2x)\)`, en: R`\(\cos(2x)\)` },
            why: {
              tr: R`Dış fonksiyonun türevini alırken içteki \(x^2\) olduğu gibi korunur; için türevi \(2x\) dışarıdan çarpan olarak eklenir.`,
              en: R`Keep the inside \(x^2\) untouched inside \(\cos(\cdot)\), and multiply outside by \((x^2)' = 2x\).`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Zincir kuralı: dış fonksiyon \(\sin(u) \to \cos(u)\) ve iç fonksiyon \(u = x^2 \to 2x\). Çarpım \(2x\cos(x^2)\)'dir.`,
          en: R`Chain Rule: outer \(\sin(u) \to \cos(u)\) times inner \((x^2)' = 2x\) gives \(2x\cos(x^2)\).`,
        },
      },
      {
        id: "der-q3",
        kind: "number",
        q: {
          tr: R`\(f(x) = x^3 - 4x + 5\) eğrisine \(x = 2\) noktasında çizilen teğet doğrusunun eğimi kaçtır?`,
          en: R`What is the slope of the tangent line to \(f(x) = x^3 - 4x + 5\) at \(x = 2\)?`,
        },
        label: { tr: R`\(f'(2) =\)`, en: R`\(f'(2) =\)` },
        answer: 8,
        compute: () => 3 * 2 * 2 - 4,
        hint: {
          tr: R`Önce \(f'(x) = 3x^2 - 4\) bulun, sonra \(x = 2\) yazın.`,
          en: R`Compute \(f'(x) = 3x^2 - 4\) first, then plug in \(x = 2\).`,
        },
        explain: {
          tr: R`\(f'(x) = 3x^2 - 4 \implies f'(2) = 3(4) - 4 = 8\).`,
          en: R`\(f'(x) = 3x^2 - 4 \implies f'(2) = 12 - 4 = 8\).`,
        },
      },
    ],
  },

  {
    id: "px-der-shape",
    title: { tr: "Ekstremumlar, MVT ve Newton–Raphson tahmini", en: "Extrema, MVT & Newton–Raphson prediction" },
    intro: {
      tr: R`İkinci türev testini, Ortalama Değer Teoremini ve Newton yönteminin hızlı yakınsamasını sınayın.`,
      en: R`Test the second-derivative test, Mean Value Theorem, and Newton's quadratic convergence.`,
    },
    read: { tab: "theory", section: "der-mvt" },
    questions: [
      {
        id: "der-q4",
        kind: "choice",
        q: {
          tr: R`İki kez türevlenebilir bir \(f\) fonksiyonu için \(x = c\) noktasında \(f'(c) = 0\) ve \(f''(c) = -5 < 0\) bulunmuştur. \(c\) noktasında ne vardır?`,
          en: R`For a twice-differentiable function \(f\), suppose \(f'(c) = 0\) and \(f''(c) = -5 < 0\). What occurs at \(x = c\)?`,
        },
        options: [
          { text: { tr: "Yerel maksimum (tepe)", en: "Local maximum (peak)" } },
          {
            text: { tr: "Yerel minimum (çukur)", en: "Local minimum (valley)" },
            why: {
              tr: R`Yerel minimum (yukarı bakan kâse) için ikinci türevin pozitif (\(f''(c) > 0\)) olması gerekir.`,
              en: R`A local minimum (upward cup) requires a positive second derivative (\(f''(c) > 0\)).`,
            },
          },
          {
            text: { tr: "Büküm noktası", en: "Inflection point" },
            why: {
              tr: R`Büküm noktasında eğrilik işaret değiştirir, yani \(f''(c) = 0\) olur; burada \(f''(c) = -5 \ne 0\).`,
              en: R`An inflection point requires concavity to change sign (\(f''(c) = 0\)), whereas here \(f''(c) = -5 \ne 0\).`,
            },
          },
        ],
        answer: 0,
        explain: {
          tr: R`\(f'(c) = 0\) yatay teğet, \(f''(c) < 0\) ise eğrinin aşağı doğru büküldüğünü (kubbe) gösterir → kesinlikle <b>yerel maksimum</b>!`,
          en: R`\(f'(c) = 0\) gives a flat tangent while \(f''(c) < 0\) bends the curve downward like a cap → <b>local maximum</b>!`,
        },
      },
      {
        id: "der-q5",
        kind: "number",
        q: {
          tr: R`\(f(x) = x^2\) fonksiyonu için \([1, 5]\) aralığında Ortalama Değer Teoremini (MVT) sağlayan \(c\) noktası kaçtır?`,
          en: R`For \(f(x) = x^2\) on \([1, 5]\), find the MVT point \(c\) satisfying \(f'(c) = \frac{f(5) - f(1)}{5 - 1}\).`,
        },
        label: { tr: R`\(c =\)`, en: R`\(c =\)` },
        answer: 3,
        compute: () => ((25 - 1) / (5 - 1)) / 2,
        hint: {
          tr: R`Kiriş eğimi \(\frac{25 - 1}{5 - 1} = 6\); bunu \(f'(c) = 2c\)'ye eşitleyin.`,
          en: R`The chord slope is \(\frac{25 - 1}{5 - 1} = 6\); solve \(f'(c) = 2c = 6\).`,
        },
        explain: {
          tr: R`\(2c = 6 \implies c = 3\). Güzel bir özellik: her ikinci derece parabolde MVT noktası aralığın tam ortasıdır!`,
          en: R`\(2c = 6 \implies c = 3\). Neat fact: for every parabola, the MVT point is always the exact midpoint!`,
        },
      },
      {
        id: "der-q6",
        kind: "predict",
        q: {
          tr: R`\(f(x) = x^2 - 2\) denkleminde \(x_0 = 2\) ile başlayıp yalnızca <b>2 Newton–Raphson adımı</b> uygularsak \(x_2\) değeri gerçek \(\sqrt{2} \approx 1{,}4142\)'ye ne kadar yaklaşır?`,
          en: R`Starting at \(x_0 = 2\) for \(f(x) = x^2 - 2\), after just <b>2 Newton–Raphson steps</b>, how close is \(x_2\) to \(\sqrt{2} \approx 1.4142\)?`,
        },
        options: [
          { tr: R`Hata \(0{,}003\)'ten küçük (süper hızlı yaklaşır!)`, en: R`Error is below \(0.003\) (converges blazingly fast!)` },
          { tr: R`Hâlâ \(1{,}7\)'nin üzerinde kalır`, en: R`Still stays above \(1.7\)` },
          { tr: R`Kökten uzaklaşıp sonsuza gider`, en: R`Diverges away from the root` },
        ],
        answer: 0,
        run: () => {
          const xs = newtonRaphson((x) => x * x - 2, (x) => 2 * x, 2, 2);
          const x2 = xs[2]!;
          const err = Math.abs(x2 - Math.SQRT2);
          return {
            answer: err < 0.003 ? 0 : 1,
            result: {
              tr: R`\(x_0 = 2 \to x_1 = ${xs[1]!.toFixed(4)} \to x_2 = ${x2.toFixed(5)}\), gerçek hata \(|x_2 - \sqrt{2}| \approx ${err.toFixed(5)} < 0{,}003\)!`,
              en: R`\(x_0 = 2 \to x_1 = ${xs[1]!.toFixed(4)} \to x_2 = ${x2.toFixed(5)}\), actual error \(|x_2 - \sqrt{2}| \approx ${err.toFixed(5)} < 0.003\)!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "der-apps" },
        explain: {
          tr: R`İlk adımda \(x_1 = 2 - \frac{2}{4} = 1{,}5\), ikinci adımda \(x_2 = 1{,}5 - \frac{0{,}25}{3} = \frac{17}{12} \approx 1{,}4167\) olur; hata yalnızca \(0{,}0025\)'tir!`,
          en: R`Step 1 gives \(x_1 = 1.5\), step 2 gives \(x_2 = \frac{17}{12} \approx 1.4167\), within \(0.0025\) of \(\sqrt{2}\)!`,
        },
      },
    ],
  },

  {
    id: "px-der-apps",
    title: { tr: "L'Hôpital Kuralı ve Klasik Tuzak", en: "L'Hôpital's Rule & Classic Pitfall" },
    intro: {
      tr: R`L'Hôpital'i hem doğru yerde uygulamayı hem de uygulanmaması gereken yeri tanımayı pekiştirin.`,
      en: R`Practice both applying L'Hôpital correctly and spotting when it must NOT be used.`,
    },
    read: { tab: "theory", section: "der-apps" },
    questions: [
      {
        id: "der-q7",
        kind: "number",
        q: {
          tr: R`L'Hôpital kuralıyla \(\lim_{x \to 0}\frac{e^{2x} - 1 - 2x}{x^2}\) limitini hesaplayın.`,
          en: R`Use L'Hôpital's rule to evaluate \(\lim_{x \to 0}\frac{e^{2x} - 1 - 2x}{x^2}\).`,
        },
        label: { tr: "Limit =", en: "Limit =" },
        answer: 2,
        compute: () => 4 / 2,
        hint: {
          tr: R`İki kez L'Hôpital uygulayın: \(\frac{2e^{2x} - 2}{2x} \to \frac{4e^{2x}}{2}\).`,
          en: R`Apply L'Hôpital twice: \(\frac{2e^{2x} - 2}{2x} \to \frac{4e^{2x}}{2}\).`,
        },
        explain: {
          tr: R`İlk türev oranı \(\frac{2e^{2x} - 2}{2x}\) hâlâ \(0/0\)'dır. İkinci kez uygulayınca \(\lim_{x \to 0}\frac{4e^{2x}}{2} = 2\) bulunur.`,
          en: R`First L'Hôpital gives \(\frac{2e^{2x}-2}{2x}\) (still \(0/0\)); a second application yields \(\lim_{x \to 0}\frac{4e^{2x}}{2} = 2\).`,
        },
      },
      {
        id: "der-q8",
        kind: "choice",
        q: {
          tr: R`Bir öğrenci \(\lim_{x \to 1}\frac{x^2 + 1}{x + 1}\) limitinde pay ve paydanın türevini alıp \(\lim_{x \to 1}\frac{2x}{1} = 2\) buluyor. Bu çözüm neden <b>yanlıştır</b>?`,
          en: R`A student differentiates top and bottom of \(\lim_{x \to 1}\frac{x^2 + 1}{x + 1}\) to get \(\lim_{x \to 1}\frac{2x}{1} = 2\). Why is this <b>wrong</b>?`,
        },
        options: [
          {
            text: { tr: "Çünkü bölüm kuralı kullanmalıydı", en: "Because they should have used the quotient rule" },
            why: {
              tr: R`L'Hôpital'in geçerli olduğu yerlerde zaten bölüm kuralı kullanılmaz; buradaki hata L'Hôpital şartının sağlanmamasıdır.`,
              en: R`L'Hôpital never uses the quotient rule — the actual error is that L'Hôpital does not apply here at all!`,
            },
          },
          { text: { tr: R`Çünkü \(x = 1\)'de ifade \(0/0\) veya \(\infty/\infty\) belirsizliği DEĞİLDİR (doğrudan cevap \(\frac{2}{2} = 1\))`, en: R`Because at \(x = 1\) it is NOT \(0/0\) or \(\infty/\infty\) (direct substitution already gives \(\frac{2}{2} = 1\))` } },
          {
            text: { tr: R`Çünkü \((x^2 + 1)'\) yanlış alınmış`, en: R`Because the derivative of \(x^2 + 1\) was wrong` },
            why: {
              tr: R`\((x^2 + 1)' = 2x\) ve \((x + 1)' = 1\) türevleri doğrudur; ama L'Hôpital yalnızca belirsizlik varsa geçerlidir.`,
              en: R`Both derivatives are correct; the problem is applying L'Hôpital to a non-indeterminate limit.`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Önce her zaman doğrudan yerine koyun: \(\frac{1^2 + 1}{1 + 1} = \frac{2}{2} = 1\). Belirsizlik yoksa L'Hôpital yanlış sonuç üretir!`,
          en: R`Always check direct substitution first: \(\frac{1^2 + 1}{1 + 1} = 1\). Applying L'Hôpital outside \(0/0\) or \(\infty/\infty\) gives a wrong answer!`,
        },
      },
    ],
  },
];
