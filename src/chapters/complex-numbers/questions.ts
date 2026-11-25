import type { PracticeSection } from "../../shared/practice.ts";
import { cMod, cMul, cPow } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-cx-main",
    title: { tr: "Modül, kutupsal form, Euler ve n. kökler", en: "Modulus, polar form, Euler & n-th roots" },
    intro: { tr: R`Karmaşık aritmetik, De Moivre kuvvetleri ve birimin kökleri.`, en: R`Complex arithmetic, De Moivre powers, and roots of unity.` },
    read: { tab: "theory", section: "cx-mul" },
    questions: [
      {
        id: "cx-q1",
        kind: "number",
        q: {
          tr: R`\(z = 3 - 4i\) karmaşık sayısının modülü \(|z|\) kaçtır?`,
          en: R`What is the modulus \(|z|\) of \(z = 3 - 4i\)?`,
        },
        label: { tr: R`\(|z| =\)`, en: R`\(|z| =\)` },
        answer: 5,
        compute: () => cMod({ re: 3, im: -4 }),
        hint: { tr: R`\(\sqrt{3^2 + (-4)^2}\).`, en: R`Compute \(\sqrt{3^2 + (-4)^2}\).` },
        explain: { tr: R`\(|3 - 4i| = \sqrt{9 + 16} = 5\).`, en: R`\(|3 - 4i| = \sqrt{9 + 16} = 5\).` },
      },
      {
        id: "cx-q2",
        kind: "number",
        q: {
          tr: R`\((1 + i)^4\) işleminin reel kısmı kaçtır?`,
          en: R`What is the real part of \((1 + i)^4\)?`,
        },
        label: { tr: R`\(\operatorname{Re}((1+i)^4) =\)`, en: R`\(\operatorname{Re}((1+i)^4) =\)` },
        answer: -4,
        compute: () => Math.round(cPow({ re: 1, im: 1 }, 4).re),
        hint: { tr: R`\(1+i = \sqrt{2}\,e^{i\pi/4}\); 4. kuvvetini alın: \((\sqrt{2})^4 e^{i\pi}\).`, en: R`Write \(1+i = \sqrt{2}\,e^{i\pi/4}\) and raise to the 4th power: \(4e^{i\pi}\).` },
        explain: { tr: R`\((1+i)^2 = 2i\), karesi \((2i)^2 = -4\). Kutupsal yoldan: \((\sqrt{2})^4 e^{i\pi} = 4(-1) = -4\).`, en: R`\((1+i)^2 = 2i\), so \((1+i)^4 = (2i)^2 = -4\).` },
      },
      {
        id: "cx-q3",
        kind: "number",
        q: {
          tr: R`\(z_1 = 2 + i\) ve \(z_2 = 1 + 3i\) ise \(z_1 z_2\) çarpımının reel kısmı kaçtır?`,
          en: R`For \(z_1 = 2 + i\) and \(z_2 = 1 + 3i\), what is the real part of \(z_1 z_2\)?`,
        },
        label: { tr: R`\(\operatorname{Re}(z_1 z_2) =\)`, en: R`\(\operatorname{Re}(z_1 z_2) =\)` },
        answer: -1,
        compute: () => cMul({ re: 2, im: 1 }, { re: 1, im: 3 }).re,
        hint: { tr: R`\(i^2 = -1\) olduğunu unutmayın: \(2\cdot 1 + i\cdot 3i\).`, en: R`Remember \(i^2 = -1\): compute \(2\cdot 1 - 1\cdot 3\).` },
        explain: { tr: R`\((2+i)(1+3i) = (2 - 3) + (6 + 1)i = -1 + 7i\).`, en: R`\((2+i)(1+3i) = (2 - 3) + (6 + 1)i = -1 + 7i\).` },
      },
      {
        id: "cx-q4",
        kind: "choice",
        q: {
          tr: R`\(z^6 = 1\) denkleminin karmaşık düzlemdeki kökleri nasıl bir geometrik şekil oluşturur?`,
          en: R`What geometric figure do the complex roots of \(z^6 = 1\) form?`,
        },
        options: [
          {
            text: { tr: "Reel eksen üzerinde iki nokta", en: "Two points on the real axis" },
            why: { tr: R`\(\pm 1\) yalnızca reel köklerdir; toplam 6 karmaşık kök vardır.`, en: R`\(\pm 1\) are only the real roots; there are 6 complex roots in total.` },
          },
          { text: { tr: "Birim çember üzerinde düzgün altıgen (her köşe 60° aralıklı)", en: "A regular hexagon on the unit circle (60° apart)" } },
          {
            text: { tr: "Yarıçapı 6 olan çember üzerinde 6 nokta", en: "6 points on a circle of radius 6" },
            why: { tr: R`Yarıçap \(1^{1/6} = 1\)'dir, 6 değil!`, en: R`The radius is \(1^{1/6} = 1\), not 6!` },
          },
        ],
        answer: 1,
        explain: { tr: R`Kökler \(e^{i\cdot 2\pi k/6}\ (k=0,\dots,5)\) olup birim çember üzerinde \(60^\circ\) aralıklı düzgün altıgenin köşeleridir.`, en: R`The roots \(e^{i\cdot 2\pi k/6}\) sit at \(60^\circ\) intervals around the unit circle, forming a regular hexagon.` },
      },
    ],
  },
];
