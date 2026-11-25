import type { PracticeSection } from "../../shared/practice.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-fn-domain",
    title: { tr: "Tanım kümesi, birebirlik ve dönüşümler", en: "Domain, injectivity & graph transformations" },
    intro: {
      tr: R`Fonksiyonun geçerli girdileri, yatay doğru testi ve grafik ötelemeleri üzerine temel sorular.`,
      en: R`Core checks on valid inputs, the horizontal-line test, and graph transformations.`,
    },
    read: { tab: "theory", section: "fn-domain" },
    questions: [
      {
        id: "fn-q1",
        kind: "choice",
        q: {
          tr: R`\(f(x) = \ln(2x - 6)\) fonksiyonunun en geniş reel tanım kümesi nedir?`,
          en: R`What is the largest real domain of \(f(x) = \ln(2x - 6)\)?`,
        },
        options: [
          { text: { tr: R`\((3,\infty)\)`, en: R`\((3,\infty)\)` } },
          {
            text: { tr: R`\([3,\infty)\)`, en: R`\([3,\infty)\)` },
            why: { tr: R`\(x = 3\) koyduğunuzda \(\ln(0)\) çıkar; logaritma sıfırda tanımsızdır, bu yüzden \(3\) dahil edilemez.`, en: R`Plugging in \(x = 3\) gives \(\ln(0)\), which is undefined, so \(3\) must be excluded.` },
          },
          {
            text: { tr: R`\(\mathbb{R} \setminus \{3\}\)`, en: R`\(\mathbb{R} \setminus \{3\}\)` },
            why: { tr: R`Bu kural kesirli ifadeler (\(\frac{1}{2x-6}\)) için geçerlidir; reel \(\ln\) negatif sayıları da kabul etmez.`, en: R`That rule is for denominators like \(\frac{1}{2x-6}\); the real logarithm also rejects negative inputs.` },
          },
        ],
        answer: 0,
        explain: {
          tr: R`\(\ln(u)\) için \(u > 0\) şartı gerekir: \(2x - 6 > 0 \iff 2x > 6 \iff x > 3\), yani \((3, \infty)\).`,
          en: R`\(\ln(u)\) requires \(u > 0\), giving \(2x - 6 > 0 \iff 2x > 6 \iff x > 3\), i.e. \((3, \infty)\).`,
        },
      },
      {
        id: "fn-q2",
        kind: "choice",
        q: {
          tr: R`Aşağıdaki fonksiyonlardan hangisi tüm reel sayılar \(\mathbb{R}\) üzerinde <b>birebirdir</b> (yatay doğru testini geçer)?`,
          en: R`Which of the following functions is <b>injective</b> (passes the horizontal-line test) on all of \(\mathbb{R}\)?`,
        },
        options: [
          {
            text: { tr: R`\(f(x) = x^2 + 1\)`, en: R`\(f(x) = x^2 + 1\)` },
            why: { tr: R`Çift kuvvet olduğu için \(f(-2) = f(2) = 5\); iki farklı girdi aynı çıktıyı verir.`, en: R`Because of the square, \(f(-2) = f(2) = 5\): two distinct inputs share the same output.` },
          },
          {
            text: { tr: R`\(f(x) = \sin x\)`, en: R`\(f(x) = \sin x\)` },
            why: { tr: R`Periyodik olduğu için \(f(0) = f(\pi) = f(2\pi) = 0\); yatay doğru sonsuz kez keser.`, en: R`Being periodic, \(f(0) = f(\pi) = f(2\pi) = 0\): horizontal lines cross infinitely often.` },
          },
          { text: { tr: R`\(f(x) = x^3 + 2\)`, en: R`\(f(x) = x^3 + 2\)` } },
        ],
        answer: 2,
        explain: {
          tr: R`\(x^3 + 2\) tüm \(\mathbb{R}\)'de kesin artandır: \(x_1^3 + 2 = x_2^3 + 2 \implies x_1^3 = x_2^3 \implies x_1 = x_2\).`,
          en: R`\(x^3 + 2\) is strictly increasing on all of \(\mathbb{R}\): \(x_1^3 + 2 = x_2^3 + 2 \implies x_1 = x_2\).`,
        },
      },
      {
        id: "fn-q3",
        kind: "choice",
        q: {
          tr: R`\(g(x) = f(2x - 6)\) grafiği \(f(x)\)'ten nasıl elde edilir?`,
          en: R`How is the graph of \(g(x) = f(2x - 6)\) obtained from \(f(x)\)?`,
        },
        options: [
          {
            text: { tr: "Yatayda 2 kat genişletilip 6 birim sola kaydırılır", en: "Stretched horizontally by 2 and shifted left by 6" },
            why: { tr: R`İç dönüşümler ters yönde çalışır: \(2(x - 3)\) yatayda sıkıştırır ve sağa kaydırır.`, en: R`Inner transformations act inversely: \(2(x - 3)\) compresses horizontally and shifts right.` },
          },
          { text: { tr: "Yatayda 2 kat sıkıştırılıp 3 birim sağa kaydırılır", en: "Compressed horizontally by 2 and shifted right by 3" } },
          {
            text: { tr: "Yatayda 2 kat sıkıştırılıp 6 birim sağa kaydırılır", en: "Compressed horizontally by 2 and shifted right by 6" },
            why: { tr: R`Önce çarpanı ayırmalısınız: \(2x - 6 = 2(x - 3)\), dolayısıyla öteleme \(6\) değil \(3\) birimdir.`, en: R`Remember to factor first: \(2x - 6 = 2(x - 3)\), so the shift is \(3\), not \(6\).` },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(2x - 6 = 2(x - 3)\) yazdığımızda \(b = 2\) (yatayda 2 kat sıkıştırma) ve \(c = 3\) (3 birim sağa öteleme) doğrudan okunur.`,
          en: R`Factoring \(2x - 6 = 2(x - 3)\) reveals \(b = 2\) (horizontal compression by 2) and \(c = 3\) (shift right by 3).`,
        },
      },
    ],
  },
  {
    id: "px-fn-inv",
    title: { tr: "Bileşke ve ters fonksiyon hesapları", en: "Composition & inverse calculations" },
    intro: {
      tr: R`Makineyi geri çalıştırma, bileşke zinciri ve ters trigonometrik aralık tuzağı.`,
      en: R`Reversing the function machine, chaining compositions, and inverse trig ranges.`,
    },
    read: { tab: "theory", section: "fn-inverse" },
    questions: [
      {
        id: "fn-q4",
        kind: "number",
        q: {
          tr: R`\(f(x) = 3x - 5\) ise \(f^{-1}(7)\) kaçtır?`,
          en: R`If \(f(x) = 3x - 5\), what is \(f^{-1}(7)\)?`,
        },
        label: { tr: R`\(f^{-1}(7) =\)`, en: R`\(f^{-1}(7) =\)` },
        answer: 4,
        compute: () => (7 + 5) / 3,
        hint: { tr: R`"\(f(x) = 7\) yapan \(x\) kaçtır?" sorusunu çözün: \(3x - 5 = 7\).`, en: R`Ask "which \(x\) outputs \(7\)?" and solve \(3x - 5 = 7\).` },
        explain: {
          tr: R`\(3x - 5 = 7 \implies 3x = 12 \implies x = 4\). Gerçekten \(f(4) = 3(4) - 5 = 7\).`,
          en: R`Solving \(3x - 5 = 7\) gives \(3x = 12 \implies x = 4\), and indeed \(f(4) = 7\).`,
        },
      },
      {
        id: "fn-q5",
        kind: "number",
        q: {
          tr: R`\(f(x) = x^2 + 1\) ve \(g(x) = 3x - 4\) ise bileşke \((f \circ g)(2) = f(g(2))\) değeri kaçtır?`,
          en: R`Given \(f(x) = x^2 + 1\) and \(g(x) = 3x - 4\), what is \((f \circ g)(2) = f(g(2))\)?`,
        },
        label: { tr: R`\((f \circ g)(2) =\)`, en: R`\((f \circ g)(2) =\)` },
        answer: 5,
        compute: () => {
          const g2 = 3 * 2 - 4;
          return g2 * g2 + 1;
        },
        hint: { tr: R`Önce içteki \(g(2)\)'yi hesaplayın, sonra bulduğunuz sayıyı \(f\)'nin içine koyun.`, en: R`Evaluate the inner \(g(2)\) first, then plug that result into \(f\).` },
        explain: {
          tr: R`Önce iç makine: \(g(2) = 3(2) - 4 = 2\). Sonra dış makine: \(f(2) = 2^2 + 1 = 5\).`,
          en: R`Inner machine first: \(g(2) = 3(2) - 4 = 2\). Outer machine next: \(f(2) = 2^2 + 1 = 5\).`,
        },
      },
      {
        id: "fn-q6",
        kind: "predict",
        q: {
          tr: R`\(\arcsin(\sin(3\pi/4))\) ifadesinin sonucu nedir?`,
          en: R`What does \(\arcsin(\sin(3\pi/4))\) evaluate to?`,
        },
        options: [
          { tr: R`\(3\pi/4\)`, en: R`\(3\pi/4\)` },
          { tr: R`\(\pi/4\)`, en: R`\(\pi/4\)` },
          { tr: R`\(-\pi/4\)`, en: R`\(-\pi/4\)` },
        ],
        answer: 1,
        run: () => {
          const val = Math.asin(Math.sin((3 * Math.PI) / 4));
          return {
            answer: Math.abs(val - Math.PI / 4) < 1e-9 ? 1 : 0,
            result: {
              tr: R`\(\sin(3\pi/4) = \sqrt{2}/2 \approx 0{,}7071\), ve \(\arcsin(\sqrt{2}/2) = \pi/4 \approx 0{,}7854\).`,
              en: R`\(\sin(3\pi/4) = \sqrt{2}/2 \approx 0.7071\), and \(\arcsin(\sqrt{2}/2) = \pi/4 \approx 0.7854\).`,
            },
          };
        },
        tryIt: { tab: "theory", section: "fn-inverse" },
        explain: {
          tr: R`\(\arcsin\)'in görüntü kümesi \([-\pi/2,\pi/2]\)'dir. \(3\pi/4\) bu aralığın dışında olduğundan aynı sinüsü veren \(\pi/4\) döner.`,
          en: R`The range of \(\arcsin\) is \([-\pi/2,\pi/2]\). Since \(3\pi/4\) lies outside it, \(\arcsin\) returns \(\pi/4\), which shares the same sine.`,
        },
      },
    ],
  },
  {
    id: "px-fn-trans",
    title: { tr: "Aşkın ve hiperbolik fonksiyonlar", en: "Transcendental & hyperbolic functions" },
    intro: {
      tr: R`Logaritma kuralları ve birim hiperbol özdeşliği üzerine hesap soruları.`,
      en: R`Calculations using logarithm laws and the unit hyperbola identity.`,
    },
    read: { tab: "theory", section: "fn-hyperbolic" },
    questions: [
      {
        id: "fn-q7",
        kind: "number",
        q: {
          tr: R`\(\ln(e^5) - 2\ln(e)\) işleminin değeri nedir?`,
          en: R`Evaluate \(\ln(e^5) - 2\ln(e)\).`,
        },
        label: { tr: "Değer =", en: "Value =" },
        answer: 3,
        compute: () => Math.log(Math.exp(5)) - 2 * Math.log(Math.E),
        hint: { tr: R`\(\ln\) ile \(e^x\) birbirinin tersidir: \(\ln(e^k) = k\).`, en: R`\(\ln\) undoes \(e^x\), so \(\ln(e^k) = k\).` },
        explain: {
          tr: R`\(\ln(e^5) = 5\) ve \(\ln(e) = \ln(e^1) = 1\), dolayısıyla \(5 - 2(1) = 3\).`,
          en: R`\(\ln(e^5) = 5\) and \(\ln(e) = 1\), giving \(5 - 2(1) = 3\).`,
        },
      },
      {
        id: "fn-q8",
        kind: "choice",
        q: {
          tr: R`\(\sinh x = 3/4\) ise \(\cosh x\) kaçtır?`,
          en: R`If \(\sinh x = 3/4\), what is \(\cosh x\)?`,
        },
        options: [
          {
            text: { tr: R`\(-5/4\)`, en: R`\(-5/4\)` },
            why: { tr: R`\(\cosh x = \frac{e^x+e^{-x}}{2}\) her reel \(x\) için \(\ge 1\)'dir, asla negatif olamaz.`, en: R`\(\cosh x = \frac{e^x+e^{-x}}{2} \ge 1\) for all real \(x\), so it is never negative.` },
          },
          {
            text: { tr: R`\(\sqrt{7}/4\)`, en: R`\(\sqrt{7}/4\)` },
            why: { tr: R`Bu sonuç \(\cos^2+\sin^2=1\) formülünden gelir; hiperbolikte eksi işareti vardır: \(\cosh^2-\sinh^2=1\).`, en: R`That comes from \(\cos^2+\sin^2=1\); the hyperbolic identity has a minus sign: \(\cosh^2-\sinh^2=1\).` },
          },
          { text: { tr: R`\(5/4\)`, en: R`\(5/4\)` } },
        ],
        answer: 2,
        compute: () => (Math.abs(Math.cosh(Math.asinh(0.75)) - 1.25) < 1e-9 ? 2 : -1),
        explain: {
          tr: R`\(\cosh^2 x = 1 + \sinh^2 x = 1 + \frac{9}{16} = \frac{25}{16}\). \(\cosh x \ge 1\) olduğundan \(\cosh x = \frac{5}{4}\).`,
          en: R`\(\cosh^2 x = 1 + \sinh^2 x = 1 + \frac{9}{16} = \frac{25}{16}\), and since \(\cosh x \ge 1\), \(\cosh x = \frac{5}{4}\).`,
        },
      },
    ],
  },
];
