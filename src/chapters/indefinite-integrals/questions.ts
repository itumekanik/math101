import type { PracticeSection } from "../../shared/practice.ts";
import { numDiff } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ind-basics",
    title: { tr: "İlkel fonksiyon, + C sabiti ve temel kurallar", en: "Antiderivatives, + C & core rules" },
    intro: {
      tr: R`Belirsiz integralin türevle ilişkisi, başlangıç koşulları ve mutlak değer kuralı.`,
      en: R`How antiderivatives reverse differentiation, initial value problems, and the absolute value rule.`,
    },
    read: { tab: "theory", section: "ii-family" },
    questions: [
      {
        id: "ind-q1",
        kind: "choice",
        q: {
          tr: R`\(F(x) = x^2 + 3\) ve \(G(x) = x^2 - 7\) fonksiyonları neden aynı \(f(x) = 2x\) fonksiyonunun ilkel fonksiyonlarıdır?`,
          en: R`Why are both \(F(x) = x^2 + 3\) and \(G(x) = x^2 - 7\) antiderivatives of \(f(x) = 2x\)?`,
        },
        options: [
          {
            text: { tr: "Çünkü ikisi de her x noktasında aynı 2x türevine (eğime) sahiptir; sabitler türevde 0 olur", en: "Because both have the exact same derivative 2x everywhere; constants differentiate to 0" },
          },
          {
            text: { tr: "Çünkü x = 0 noktasında aynı y değerini alırlar", en: "Because they take the same y-value at x = 0" },
            why: { tr: R`\(F(0) = 3\) iken \(G(0) = -7\)'dir; değerleri değil <b>eğimleri</b> aynıdır!`, en: R`\(F(0) = 3\) while \(G(0) = -7\); their <b>slopes</b> match, not their y-values!` },
          },
          {
            text: { tr: "Çünkü integral alırken sabit sayılar otomatik olarak silinir ve C = 0 alınır", en: "Because integration forces C = 0 automatically" },
            why: { tr: R`Tam tersine, sabit bilinmediği için tüm paralel aileyi kapsayan \(+ C\) yazılır.`, en: R`On the contrary, because the constant is unknown, we write \(+ C\) to include every vertical shift.` },
          },
        ],
        answer: 0,
        explain: {
          tr: R`\((x^2 + 3)' = 2x\) ve \((x^2 - 7)' = 2x\). İki ilkel fonksiyon arasındaki fark daima sabit bir sayıdır (\(10\)), bu yüzden grafikleri birbirinin dikey kaydırılmış hâlidir.`,
          en: R`Both \((x^2 + 3)' = 2x\) and \((x^2 - 7)' = 2x\). Any two antiderivatives on an interval differ only by a constant vertical shift.`,
        },
      },
      {
        id: "ind-q2",
        kind: "number",
        q: {
          tr: R`\(F'(x) = 4x^3\) ve \(F(1) = 7\) koşulunu sağlayan tekil ilkel fonksiyon için \(F(2)\) kaçtır?`,
          en: R`If \(F'(x) = 4x^3\) and \(F(1) = 7\), what is \(F(2)\)?`,
        },
        label: { tr: R`\(F(2) =\)`, en: R`\(F(2) =\)` },
        answer: 22,
        compute: () => 2 ** 4 + (7 - 1),
        hint: { tr: R`Önce \(F(x) = x^4 + C\) yazın; \(F(1) = 1 + C = 7\)'den \(C = 6\) bulunur.`, en: R`First write \(F(x) = x^4 + C\); from \(F(1) = 1 + C = 7\) we find \(C = 6\).` },
        explain: { tr: R`\(F(x) = x^4 + 6 \implies F(2) = 2^4 + 6 = 16 + 6 = 22\).`, en: R`\(F(x) = x^4 + 6 \implies F(2) = 16 + 6 = 22\).` },
      },
      {
        id: "ind-q3",
        kind: "choice",
        q: {
          tr: R`\(\int \frac{1}{x}\,dx\) integralinin \(x < 0\) bölgesinde de geçerli doğru sonucu hangisidir?`,
          en: R`Which antiderivative of \(\int \frac{1}{x}\,dx\) remains valid for \(x < 0\) as well?`,
        },
        options: [
          {
            text: { tr: R`\(-\frac{1}{x^2} + C\)`, en: R`\(-\frac{1}{x^2} + C\)` },
            why: { tr: R`Dikkat: \(-\frac{1}{x^2}\), \(\frac{1}{x}\)'in integrali değil <b>türevidir</b>!`, en: R`Careful: \(-\frac{1}{x^2}\) is the <b>derivative</b> of \(\frac{1}{x}\), not its integral!` },
          },
          {
            text: { tr: R`\(\ln(x) + C\)`, en: R`\(\ln(x) + C\)` },
            why: { tr: R`\(\ln(x)\) yalnızca \(x > 0\) için tanımlıdır; negatif \(x\)'lerde çalışmaz!`, en: R`\(\ln(x)\) only exists for \(x > 0\) and fails on negative inputs!` },
          },
          { text: { tr: R`\(\ln|x| + C\)`, en: R`\(\ln|x| + C\)` } },
        ],
        answer: 2,
        compute: () => (Math.abs(numDiff((x) => Math.log(Math.abs(x)), -2) - -0.5) < 1e-4 ? 2 : -1),
        explain: {
          tr: R`\(x < 0\) için \(\ln|x| = \ln(-x)\) olup zincir kuralıyla türevi \(\frac{-1}{-x} = \frac{1}{x}\) çıkar. Mutlak değer tüm \(x \ne 0\) noktalarını tek formülde birleştirir.`,
          en: R`For \(x < 0\), \(\ln|x| = \ln(-x)\), whose derivative by the chain rule is \(\frac{-1}{-x} = \frac{1}{x}\). Absolute value bars cover all \(x \ne 0\).`,
        },
      },
    ],
  },
  {
    id: "px-ind-sub",
    title: { tr: "u-Dönüşümü ve kısmi integrasyon", en: "u-Substitution & integration by parts" },
    intro: {
      tr: R`Zincir kuralını ve çarpım kuralını tersten uygulayarak integralleri sadeleştirme.`,
      en: R`Reversing the chain rule and product rule to tame products and composite integrands.`,
    },
    read: { tab: "theory", section: "ii-usub" },
    questions: [
      {
        id: "ind-q4",
        kind: "choice",
        q: {
          tr: R`\(\int 3x^2 e^{x^3}\,dx\) belirsiz integrali hangisine eşittir?`,
          en: R`Which antiderivative equals \(\int 3x^2 e^{x^3}\,dx\)?`,
        },
        options: [
          { text: { tr: R`\(e^{x^3} + C\)`, en: R`\(e^{x^3} + C\)` } },
          {
            text: { tr: R`\(3e^{x^3} + C\)`, en: R`\(3e^{x^3} + C\)` },
            why: { tr: R`\(3x^2\,dx\) ifadesinin tamamı \(du\) olur; dışarıda fazladan \(3\) çarpanı kalmaz.`, en: R`The entire \(3x^2\,dx\) turns into \(du\); no extra factor of \(3\) stays behind.` },
          },
          {
            text: { tr: R`\(x^3 e^{x^3} + C\)`, en: R`\(x^3 e^{x^3} + C\)` },
            why: { tr: R`Türevini kontrol edin: çarpım kuralından fazladan \(3x^2(1 + x^3)e^{x^3}\) çıkar.`, en: R`Check by differentiating: the product rule produces an extra unwanted term.` },
          },
        ],
        answer: 0,
        compute: () => (Math.abs(numDiff((x) => Math.exp(x ** 3), 1) - 3 * Math.E) < 1e-4 ? 0 : -1),
        explain: {
          tr: R`\(u = x^3 \implies du = 3x^2\,dx\), böylece \(\int e^u\,du = e^u + C = e^{x^3} + C\).`,
          en: R`Set \(u = x^3\), so \(du = 3x^2\,dx\), giving \(\int e^u\,du = e^u + C = e^{x^3} + C\).`,
        },
      },
      {
        id: "ind-q5",
        kind: "choice",
        q: {
          tr: R`\(\int \ln x\,dx\) için kısmi integrasyonda LAPTU/LIATE kuralına göre \(u\) ve \(dv\) nasıl seçilir?`,
          en: R`For \(\int \ln x\,dx\), how should \(u\) and \(dv\) be chosen using LIATE?`,
        },
        options: [
          {
            text: { tr: R`\(u = 1,\; dv = \ln x\,dx\)`, en: R`\(u = 1,\; dv = \ln x\,dx\)` },
            why: { tr: R`\(dv = \ln x\,dx\)'i integre etmek zaten çözmeye çalıştığımız sorunun ta kendisidir!`, en: R`Integrating \(dv = \ln x\,dx\) is literally the original problem we don't know yet!` },
          },
          { text: { tr: R`\(u = \ln x,\; dv = 1\,dx\)`, en: R`\(u = \ln x,\; dv = 1\,dx\)` } },
          {
            text: { tr: R`\(u = x,\; dv = \frac{1}{x}\,dx\)`, en: R`\(u = x,\; dv = \frac{1}{x}\,dx\)` },
            why: { tr: R`\(u \cdot dv = x\cdot\frac{1}{x}dx = 1\,dx\) olur, \(\ln x\,dx\) değil!`, en: R`Their product \(u\,dv = x\cdot\frac{1}{x}dx = 1\,dx\), not \(\ln x\,dx\)!` },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Logaritma (L) ilk sıradadır: \(u = \ln x \implies du = \frac{1}{x}dx\) ve \(dv = 1\,dx \implies v = x\). Buradan \(x\ln x - \int x\cdot\frac{1}{x}\,dx = x\ln x - x + C\).`,
          en: R`Logarithm (L) comes first: \(u = \ln x \implies du = \frac{1}{x}dx\), \(dv = 1\,dx \implies v = x\), yielding \(x\ln x - \int 1\,dx = x\ln x - x + C\).`,
        },
      },
    ],
  },
  {
    id: "px-ind-pf",
    title: { tr: "Basit kesirler ve sayısal türev sağlaması", en: "Partial fractions & numerical derivative check" },
    intro: {
      tr: R`Rasyonel ifadeleri parçalama ve bulduğunuz ilkel fonksiyonu türevle doğrulama.`,
      en: R`Splitting rational functions and verifying antiderivatives numerically.`,
    },
    read: { tab: "theory", section: "ii-partial" },
    questions: [
      {
        id: "ind-q6",
        kind: "number",
        q: {
          tr: R`\(\frac{5x - 1}{(x - 2)(x + 1)} = \frac{A}{x - 2} + \frac{B}{x + 1}\) basit kesir ayrışımında \(A\) katsayısı kaçtır?`,
          en: R`In the partial fraction decomposition \(\frac{5x - 1}{(x - 2)(x + 1)} = \frac{A}{x - 2} + \frac{B}{x + 1}\), what is \(A\)?`,
        },
        label: { tr: R`\(A =\)`, en: R`\(A =\)` },
        answer: 3,
        compute: () => (5 * 2 - 1) / (2 + 1),
        hint: { tr: R`\(5x - 1 = A(x + 1) + B(x - 2)\) eşitliğinde \(x = 2\) yazın (veya kapatma kısayolunu kullanın).`, en: R`Plug \(x = 2\) into \(5x - 1 = A(x + 1) + B(x - 2)\) (or use the cover-up shortcut).` },
        explain: { tr: R`\(x = 2\) için \(5(2) - 1 = A(2 + 1) + 0 \implies 9 = 3A \implies A = 3\) (ve \(B = 2\)).`, en: R`At \(x = 2\), \(9 = 3A + 0 \implies A = 3\) (and \(B = 2\)).` },
      },
      {
        id: "ind-q7",
        kind: "predict",
        q: {
          tr: R`\(F(x) = (x - 1)e^x + 5\) fonksiyonunun \(x = 2\) noktasındaki sayısal türevi \(F'(2)\) hesaplanırsa hangi değere eşit çıkar?`,
          en: R`If we numerically differentiate \(F(x) = (x - 1)e^x + 5\) at \(x = 2\), which value will \(F'(2)\) match?`,
        },
        options: [
          { tr: R`\(e^2 \approx 7{,}389\)`, en: R`\(e^2 \approx 7.389\)` },
          { tr: R`\(2e^2 \approx 14{,}778\) (çünkü \(F'(x) = x e^x\))`, en: R`\(2e^2 \approx 14.778\) (since \(F'(x) = x e^x\))` },
          { tr: R`\(2e^2 + 5 \approx 19{,}778\) (sabit \(+ 5\) de eklenir)`, en: R`\(2e^2 + 5 \approx 19.778\) (including the constant \(+ 5\))` },
        ],
        answer: 1,
        run: () => {
          const d = numDiff((x) => (x - 1) * Math.exp(x) + 5, 2);
          const target = 2 * Math.exp(2);
          return {
            answer: Math.abs(d - target) < 1e-4 ? 1 : 0,
            result: {
              tr: R`Sayısal türev \(F'(2) = ${d.toFixed(4).replace(".", "{,}")}\) ve \(2e^2 = ${target.toFixed(4).replace(".", "{,}")}\) — sabit \(+ 5\) türevde tamamen kaybolur!`,
              en: R`Numerical derivative \(F'(2) = ${d.toFixed(4)}\) matches \(2e^2 = ${target.toFixed(4)}\) — the constant \(+ 5\) vanishes completely!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "ii-parts" },
        explain: {
          tr: R`\((x - 1)e^x + 5\), \(\int x e^x\,dx\)'in bir ilkel fonksiyonudur; \(+ 5\) sabiti türevde \(0\) olduğundan \(F'(2) = 2e^2 \approx 14{,}778\) çıkar.`,
          en: R`\((x - 1)e^x + 5\) is an antiderivative of \(x e^x\), and the constant \(+ 5\) differentiates to \(0\), so \(F'(2) = 2e^2 \approx 14.778\).`,
        },
      },
    ],
  },
];
