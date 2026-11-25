import type { PracticeSection } from "../../shared/practice.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-fn-domain",
    title: { tr: "Tanım kümesi, birebirlik ve ters fonksiyon", en: "Domain, injectivity and inverses" },
    intro: {
      tr: R`Fonksiyonun tanım aralığı, birebirliği ve tersi üzerine kısa sorular.`,
      en: R`Short checks on domains, injectivity and inverse functions.`,
    },
    read: { tab: "theory", section: "fn-injective" },
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
            why: { tr: R`\(x = 3\) için \(\ln(0)\) tanımsızdır.`, en: R`At \(x = 3\), \(\ln(0)\) is undefined.` },
          },
          {
            text: { tr: R`\(\mathbb{R} \setminus \{3\}\)`, en: R`\(\mathbb{R} \setminus \{3\}\)` },
            why: { tr: R`Negatif sayılar için reel \(\ln\) tanımlı değildir.`, en: R`The real logarithm is undefined for negative inputs.` },
          },
        ],
        answer: 0,
        explain: {
          tr: R`\(\ln(u)\) için \(u > 0\) gerekir: \(2x - 6 > 0 \iff x > 3\).`,
          en: R`\(\ln(u)\) requires \(u > 0\), so \(2x - 6 > 0 \iff x > 3\).`,
        },
      },
      {
        id: "fn-q2",
        kind: "number",
        q: {
          tr: R`\(f(x) = 3x - 5\) ise \(f^{-1}(7)\) kaçtır?`,
          en: R`If \(f(x) = 3x - 5\), what is \(f^{-1}(7)\)?`,
        },
        label: { tr: R`\(f^{-1}(7) =\)`, en: R`\(f^{-1}(7) =\)` },
        answer: 4,
        compute: () => (7 + 5) / 3,
        hint: { tr: R`\(3x - 5 = 7\) denklemini çözün.`, en: R`Solve \(3x - 5 = 7\).` },
        explain: {
          tr: R`\(f^{-1}(y) = (y + 5)/3\), dolayısıyla \(f^{-1}(7) = 12/3 = 4\).`,
          en: R`\(f^{-1}(y) = (y + 5)/3\), so \(f^{-1}(7) = 12/3 = 4\).`,
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
            why: { tr: R`İç dönüşümler ters çalışır: \(2(x - 3)\) sıkıştırır ve sağa kaydırır.`, en: R`Inner operations invert: \(2(x - 3)\) compresses and shifts right.` },
          },
          { text: { tr: "Yatayda 2 kat sıkıştırılıp 3 birim sağa kaydırılır", en: "Compressed horizontally by 2 and shifted right by 3" } },
          {
            text: { tr: "Yatayda 2 kat sıkıştırılıp 6 birim sağa kaydırılır", en: "Compressed horizontally by 2 and shifted right by 6" },
            why: { tr: R`Önce çarpanı ayırın: \(2x - 6 = 2(x - 3)\), yani kayma 3 birimdir.`, en: R`Factor first: \(2x - 6 = 2(x - 3)\), so the shift is 3, not 6.` },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(2x - 6 = 2(x - 3)\) olduğundan \(b = 2\) (2 kat yatay sıkıştırma) ve \(c = 3\) (3 birim sağa öteleme).`,
          en: R`Writing \(2x - 6 = 2(x - 3)\) reveals \(b = 2\) (horizontal compression by 2) and \(c = 3\) (right shift by 3).`,
        },
      },
    ],
  },
  {
    id: "px-fn-trans",
    title: { tr: "Aşkın ve hiperbolik fonksiyonlar", en: "Transcendental & hyperbolic functions" },
    intro: {
      tr: R`Logaritma, ters trigonometri ve hiperbolik özdeşlikler.`,
      en: R`Logarithms, inverse trig, and hyperbolic identities.`,
    },
    read: { tab: "theory", section: "fn-hyperbolic" },
    questions: [
      {
        id: "fn-q4",
        kind: "number",
        q: {
          tr: R`\(\ln(e^5) - 2\ln(e)\) işleminin değeri nedir?`,
          en: R`Evaluate \(\ln(e^5) - 2\ln(e)\).`,
        },
        label: { tr: "Değer =", en: "Value =" },
        answer: 3,
        compute: () => Math.log(Math.exp(5)) - 2 * Math.log(Math.E),
        hint: { tr: R`\(\ln(e^k) = k\) özelliğini kullanın.`, en: R`Use \(\ln(e^k) = k\).` },
        explain: {
          tr: R`\(\ln(e^5) = 5\) ve \(\ln(e) = 1\), dolayısıyla \(5 - 2 = 3\).`,
          en: R`\(\ln(e^5) = 5\) and \(\ln(e) = 1\), giving \(5 - 2 = 3\).`,
        },
      },
      {
        id: "fn-q5",
        kind: "choice",
        q: {
          tr: R`\(\sinh x = 3/4\) ise \(\cosh x\) kaçtır?`,
          en: R`If \(\sinh x = 3/4\), what is \(\cosh x\)?`,
        },
        options: [
          {
            text: { tr: R`\(-5/4\)`, en: R`\(-5/4\)` },
            why: { tr: R`\(\cosh x = \frac{e^x+e^{-x}}{2}\) her reel \(x\) için \(\ge 1\)'dir, negatif olamaz.`, en: R`\(\cosh x = \frac{e^x+e^{-x}}{2} \ge 1\) for all real \(x\), never negative.` },
          },
          {
            text: { tr: R`\(\sqrt{7}/4\)`, en: R`\(\sqrt{7}/4\)` },
            why: { tr: R`Bu \(\cos^2+\sin^2=1\) formülünden gelir; hiperbolikte eksi işareti vardır: \(\cosh^2-\sinh^2=1\).`, en: R`That uses \(\cos^2+\sin^2=1\); the hyperbolic identity has a minus sign: \(\cosh^2-\sinh^2=1\).` },
          },
          { text: { tr: R`\(5/4\)`, en: R`\(5/4\)` } },
        ],
        answer: 2,
        compute: () => (Math.abs(Math.cosh(Math.asinh(0.75)) - 1.25) < 1e-9 ? 2 : -1),
        explain: {
          tr: R`\(\cosh^2 x = 1 + \sinh^2 x = 1 + 9/16 = 25/16\). \(\cosh x \ge 1\) olduğundan \(\cosh x = 5/4\).`,
          en: R`\(\cosh^2 x = 1 + \sinh^2 x = 1 + 9/16 = 25/16\), and since \(\cosh x \ge 1\), \(\cosh x = 5/4\).`,
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
];
