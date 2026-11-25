import type { PracticeSection } from "../../shared/practice.ts";
import { taylorExp, taylorLn1p } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-fs-unif",
    title: { tr: "Noktasal vs Düzgün Yakınsaklık ve M-Testi", en: "Pointwise vs Uniform Convergence & M-Test" },
    intro: {
      tr: R`Noktasal yakınsaklığın neden sürekliliği bozabildiğini ve Weierstrass M-Testinin nasıl kurulduğunu sınayın.`,
      en: R`Check why pointwise convergence can break continuity and how to set up the Weierstrass M-Test.`,
    },
    read: { tab: "theory", section: "fs-uniform" },
    questions: [
      {
        id: "fs-q1",
        kind: "choice",
        q: {
          tr: R`\([0, 1]\) aralığında \(f_n(x) = x^n\) dizisi neden <b>düzgün yakınsak değildir</b>?`,
          en: R`Why does \(f_n(x) = x^n\) on \([0, 1]\) fail to converge <b>uniformly</b>?`,
        },
        options: [
          {
            text: { tr: R`Çünkü \(x = 0{,}5\)'te bile limiti yoktur`, en: R`Because it has no limit even at \(x = 0.5\)` },
            why: {
              tr: R`\(x = 0{,}5\) için \((0{,}5)^n \to 0\); aslında \([0, 1]\)'deki her noktada noktasal limit vardır.`,
              en: R`At \(x = 0.5\), \((0.5)^n \to 0\); the pointwise limit actually exists at every point in \([0, 1]\).`,
            },
          },
          { text: { tr: R`Çünkü sürekli fonksiyonların noktasal limiti \(x = 1\)'de süreksizdir (ve \(\sup_{x \in [0,1]} |x^n - f(x)| = 1 \not\to 0\))`, en: R`Because the pointwise limit of continuous functions is discontinuous at \(x = 1\) (and \(\sup_{x \in [0,1]} |x^n - f(x)| = 1 \not\to 0\))` } },
          {
            text: { tr: R`Çünkü \(f_n(x)\) fonksiyonları polinomdur`, en: R`Because the functions \(f_n(x)\) are polynomials` },
            why: {
              tr: R`Polinomlar pekâlâ düzgün yakınsayabilir (örneğin \([0, 0{,}5]\) üzerinde \(x^n \to 0\) düzgün yakınsaktır!).`,
              en: R`Polynomials can certainly converge uniformly — e.g., \(x^n \to 0\) IS uniform on \([0, 0.5]\)!`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Düzgün yakınsaklık sürekli fonksiyonların limitini mutlaka sürekli yapar. \(x^n\)'in limiti \(x = 1\)'de \(0\)'dan \(1\)'e sıçradığı (ve en büyük fark hep \(1\) kaldığı) için yakınsaklık düzgün değildir!`,
          en: R`Uniform convergence always preserves continuity. Because the limit of \(x^n\) jumps from \(0\) to \(1\) at \(x = 1\) (keeping \(\sup |x^n - f(x)| = 1\)), convergence cannot be uniform!`,
        },
      },
      {
        id: "fs-q2",
        kind: "choice",
        q: {
          tr: R`\(\sum_{n=1}^\infty \frac{\sin(nx)}{n^2}\) serisinin tüm \(\mathbb{R}\) üzerinde düzgün yakınsadığını göstermek için Weierstrass M-Testinde hangi \(M_n\) seçilmelidir?`,
          en: R`Which bound \(M_n\) proves via the Weierstrass M-Test that \(\sum_{n=1}^\infty \frac{\sin(nx)}{n^2}\) converges uniformly on all of \(\mathbb{R}\)?`,
        },
        options: [
          {
            text: { tr: R`\(M_n = \frac{1}{n}\)`, en: R`\(M_n = \frac{1}{n}\)` },
            why: {
              tr: R`\(\sum \frac{1}{n}\) (harmonik seri) ıraksak olduğundan M-Testi için kullanılamaz — daha sıkı sınır gerekir!`,
              en: R`Because \(\sum \frac{1}{n}\) diverges, it fails the M-Test requirement \(\sum M_n < \infty\)!`,
            },
          },
          { text: { tr: R`\(M_n = \frac{1}{n^2}\)`, en: R`\(M_n = \frac{1}{n^2}\)` } },
          {
            text: { tr: R`\(M_n = \frac{|x|}{n^2}\)`, en: R`\(M_n = \frac{|x|}{n^2}\)` },
            why: {
              tr: R`Weierstrass M-Testindeki \(M_n\) sayıları <b>\(x\)'ten bağımsız sabit sayılar</b> olmalıdır!`,
              en: R`In the Weierstrass M-Test, each \(M_n\) MUST be a constant independent of \(x\)!`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Her \(x \in \mathbb{R}\) için \(\left|\frac{\sin(nx)}{n^2}\right| \le \frac{1}{n^2}\) ve \(\sum \frac{1}{n^2} < \infty\) (\(p = 2 > 1\)) olduğundan seri tüm \(\mathbb{R}\)'de düzgün yakınsaktır.`,
          en: R`Since \(\left|\frac{\sin(nx)}{n^2}\right| \le \frac{1}{n^2}\) for all \(x\) and \(\sum \frac{1}{n^2} < \infty\), the M-Test guarantees uniform convergence on \(\mathbb{R}\).`,
        },
      },
    ],
  },

  {
    id: "px-fs-power",
    title: { tr: "Kuvvet Serileri ve Yakınsaklık Yarıçapı R", en: "Power Series & Radius of Convergence R" },
    intro: {
      tr: R`Geometrik kalıp ve Oran Testi ile yakınsaklık yarıçapını hesaplayın.`,
      en: R`Compute radii of convergence using the geometric pattern and Ratio Test.`,
    },
    read: { tab: "theory", section: "fs-power" },
    questions: [
      {
        id: "fs-q3",
        kind: "number",
        q: {
          tr: R`\(\sum_{n=0}^\infty \frac{x^n}{3^n}\) kuvvet serisinin yakınsaklık yarıçapı \(R\) kaçtır?`,
          en: R`What is the radius of convergence \(R\) of \(\sum_{n=0}^\infty \frac{x^n}{3^n}\)?`,
        },
        label: { tr: R`\(R =\)`, en: R`\(R =\)` },
        answer: 3,
        compute: () => 3,
        hint: {
          tr: R`Seriyi \(\sum (x/3)^n\) diye okuyun: \(\left|\frac{x}{3}\right| < 1 \iff |x| < 3\).`,
          en: R`Read this as \(\sum (x/3)^n\): it converges iff \(\left|\frac{x}{3}\right| < 1 \iff |x| < 3\).`,
        },
        explain: {
          tr: R`Geometrik seri koşulu \(|x/3| < 1 \iff |x| < 3\)'tür, dolayısıyla \(R = 3\).`,
          en: R`By the geometric series condition, \(|x/3| < 1 \iff |x| < 3\), so \(R = 3\).`,
        },
      },
      {
        id: "fs-q4",
        kind: "choice",
        q: {
          tr: R`\(\sum_{n=0}^\infty \frac{x^n}{n!}\) kuvvet serisinin yakınsaklık yarıçapı nedir?`,
          en: R`What is the radius of convergence of \(\sum_{n=0}^\infty \frac{x^n}{n!}\)?`,
        },
        options: [
          {
            text: { tr: R`\(R = 0\)`, en: R`\(R = 0\)` },
            why: {
              tr: R`Paydadaki \(n!\) her \(x^n\) kuvvetini ezer; seri yalnızca \(x = 0\)'da değil tüm \(\mathbb{R}\)'de yakınsar!`,
              en: R`The factorial \(n!\) in the denominator crushes \(x^n\) for every \(x\), so it converges everywhere!`,
            },
          },
          {
            text: { tr: R`\(R = 1\)`, en: R`\(R = 1\)` },
            why: {
              tr: R`Oran testi limiti \(\lim \frac{|x|}{n + 1} = 0 < 1\) değeri \(x\) ne kadar büyük olursa olsun sağlanır.`,
              en: R`The ratio limit \(\lim \frac{|x|}{n + 1} = 0 < 1\) holds no matter how large \(|x|\) is.`,
            },
          },
          { text: { tr: R`\(R = \infty\)`, en: R`\(R = \infty\)` } },
        ],
        answer: 2,
        explain: {
          tr: R`Oran testinde \(\lim_{n \to \infty}\frac{|x|^{n+1}/(n+1)!}{|x|^n/n!} = \lim\frac{|x|}{n+1} = 0 < 1\) her \(x \in \mathbb{R}\) için geçerlidir → \(R = \infty\) (bu zaten \(e^x\)'in serisidir!).`,
          en: R`By the Ratio Test, \(\frac{|x|}{n+1} \to 0 < 1\) for all \(x \in \mathbb{R}\), giving \(R = \infty\) (this is the series for \(e^x\)!).`,
        },
      },
    ],
  },

  {
    id: "px-fs-taylor",
    title: { tr: "Taylor / Maclaurin Polinomları ve Yarıçap Tuzağı", en: "Taylor / Maclaurin Polynomials & The Radius Trap" },
    intro: {
      tr: R`Maclaurin polinomlarını hesaplayın ve yarıçap dışına çıkmanın etkisini canlı tahmin edin.`,
      en: R`Compute Maclaurin approximations and coefficients, then predict what happens outside the radius of convergence.`,
    },
    read: { tab: "theory", section: "fs-taylor" },
    questions: [
      {
        id: "fs-q5",
        kind: "number",
        q: {
          tr: R`\(e^x\) için 2. derece Maclaurin polinomu \(T_2(x) = 1 + x + \frac{x^2}{2}\) kullanıldığında \(T_2(1)\) kaçtır?`,
          en: R`Using the degree-2 Maclaurin polynomial \(T_2(x) = 1 + x + \frac{x^2}{2}\) for \(e^x\), what is \(T_2(1)\)?`,
        },
        label: { tr: R`\(T_2(1) =\)`, en: R`\(T_2(1) =\)` },
        answer: 2.5,
        compute: () => taylorExp(1, 2),
        hint: {
          tr: R`Polinomda \(x = 1\) yazın: \(1 + 1 + \frac{1}{2}\).`,
          en: R`Substitute \(x = 1\): \(1 + 1 + \frac{1}{2}\).`,
        },
        explain: {
          tr: R`\(T_2(1) = 1 + 1 + 0{,}5 = 2{,}5\) (gerçek değer \(e \approx 2{,}718\)).`,
          en: R`\(T_2(1) = 1 + 1 + 0.5 = 2.5\) (compared to \(e \approx 2.718\)).`,
        },
      },
      {
        id: "fs-q6",
        kind: "number",
        q: {
          tr: R`\(\cos(2x)\) fonksiyonunun Maclaurin serisindeki \(x^2\) teriminin katsayısı \(c_2\) kaçtır?`,
          en: R`What is the coefficient \(c_2\) of \(x^2\) in the Maclaurin series of \(\cos(2x)\)?`,
        },
        label: { tr: R`\(c_2 =\)`, en: R`\(c_2 =\)` },
        answer: -2,
        compute: () => -(2 ** 2) / 2,
        hint: {
          tr: R`\(\cos u = 1 - \frac{u^2}{2!} + \cdots\) açılımında \(u = 2x\) yazın!`,
          en: R`Substitute \(u = 2x\) into \(\cos u = 1 - \frac{u^2}{2!} + \cdots\)!`,
        },
        explain: {
          tr: R`\(\cos(2x) = 1 - \frac{(2x)^2}{2} + \cdots = 1 - 2x^2 + \cdots\), dolayısıyla \(c_2 = -2\).`,
          en: R`\(\cos(2x) = 1 - \frac{(2x)^2}{2} + \cdots = 1 - 2x^2 + \cdots\), so \(c_2 = -2\).`,
        },
      },
      {
        id: "fs-q7",
        kind: "predict",
        q: {
          tr: R`\(\ln(1 + x)\) serisinin yakınsaklık yarıçapı \(R = 1\)'dir. Yarıçap dışındaki \(x = 1{,}5\) noktasında Maclaurin polinomunun derecesini \(N = 5\)'ten \(N = 13\)'e çıkarırsak yaklaşım hatası nasıl değişir?`,
          en: R`The Maclaurin series of \(\ln(1 + x)\) has radius \(R = 1\). If we evaluate it outside that radius at \(x = 1.5\) and raise the degree from \(N = 5\) to \(N = 13\), what happens to the error?`,
        },
        options: [
          { tr: R`Çok daha <b>kötüleşir</b> (hata büyüyerek patlar!)`, en: R`Gets dramatically <b>worse</b> (error explodes!)` },
          { tr: R`Daha fazla terim eklediğimiz için mutlaka iyileşir`, en: R`Must improve because we added more terms` },
          { tr: R`Hata sabit kalır`, en: R`Error stays constant` },
        ],
        answer: 0,
        run: () => {
          const exact = Math.log(2.5);
          const e5 = Math.abs(exact - taylorLn1p(1.5, 5));
          const e13 = Math.abs(exact - taylorLn1p(1.5, 13));
          return {
            answer: e13 > e5 ? 0 : 1,
            result: {
              tr: R`Gerçek \(\ln(2{,}5) \approx ${exact.toFixed(3)}\): \(N = 5\) hatası \(\approx ${e5.toFixed(2)}\) iken, \(N = 13\) hatası \(\approx ${e13.toFixed(2)}\) olarak fırladı!`,
              en: R`Exact \(\ln(2.5) \approx ${exact.toFixed(3)}\): error jumped from \(\approx ${e5.toFixed(2)}\) at \(N = 5\) up to \(\approx ${e13.toFixed(2)}\) at \(N = 13\)!`,
            },
          };
        },
        tryIt: { tab: "play" },
        explain: {
          tr: R`\(|x| = 1{,}5 > R = 1\) olduğundan \(\frac{(1{,}5)^n}{n}\) terimleri küçülmek yerine büyür! Yakınsaklık yarıçapı dışındaki noktalarda Taylor polinomu işe yaramaz — bunun için merkezi \(a = 1\) gibi yakın bir yere taşımak gerekir.`,
          en: R`Because \(|x| = 1.5 > R = 1\), the terms \(\frac{(1.5)^n}{n}\) grow without bound! Outside its radius of convergence, a Taylor series cannot approximate the function — recenter at \(a = 1\) instead.`,
        },
      },
    ],
  },
];
