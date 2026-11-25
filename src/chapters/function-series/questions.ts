import type { PracticeSection } from "../../shared/practice.ts";
import { taylorExp } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-fs-main",
    title: { tr: "Yakınsaklık yarıçapı, Maclaurin açılımları ve düzgün yakınsaklık", en: "Radius of convergence, Maclaurin series & uniform convergence" },
    intro: { tr: R`Kuvvet serileri ve Taylor katsayıları üzerine doğrulamalı sorular.`, en: R`Verified questions on power series and Taylor coefficients.` },
    read: { tab: "theory", section: "fs-taylor" },
    questions: [
      {
        id: "fs-q1",
        kind: "number",
        q: {
          tr: R`\(\sum_{n=0}^\infty \frac{x^n}{3^n}\) kuvvet serisinin yakınsaklık yarıçapı \(R\) kaçtır?`,
          en: R`What is the radius of convergence \(R\) of \(\sum_{n=0}^\infty \frac{x^n}{3^n}\)?`,
        },
        label: { tr: R`\(R =\)`, en: R`\(R =\)` },
        answer: 3,
        compute: () => 3,
        hint: { tr: R`\(\left|\frac{x}{3}\right| < 1 \iff |x| < 3\).`, en: R`\(\left|\frac{x}{3}\right| < 1 \iff |x| < 3\).` },
        explain: { tr: R`Geometrik seridir: \(|x/3|<1 \iff |x|<3\), yani \(R = 3\).`, en: R`This is geometric in \(x/3\): it converges iff \(|x| < 3\), so \(R = 3\).` },
      },
      {
        id: "fs-q2",
        kind: "number",
        q: {
          tr: R`\(e^x\) için 2. derece Maclaurin polinomu \(T_2(x) = 1 + x + \frac{x^2}{2}\) kullanıldığında \(T_2(1)\) kaçtır?`,
          en: R`Using the degree-2 Maclaurin polynomial \(T_2(x) = 1 + x + \frac{x^2}{2}\) for \(e^x\), what is \(T_2(1)\)?`,
        },
        label: { tr: R`\(T_2(1) =\)`, en: R`\(T_2(1) =\)` },
        answer: 2.5,
        compute: () => taylorExp(1, 2),
        hint: { tr: R`\(1 + 1 + 1/2\).`, en: R`Compute \(1 + 1 + 1/2\).` },
        explain: { tr: R`\(T_2(1) = 1 + 1 + 0{,}5 = 2{,}5\) (gerçek \(e \approx 2{,}718\)).`, en: R`\(T_2(1) = 2.5\) (compared to \(e \approx 2.718\)).` },
      },
      {
        id: "fs-q3",
        kind: "choice",
        q: {
          tr: R`\(\sum_{n=0}^\infty \frac{x^n}{n!}\) kuvvet serisinin yakınsaklık yarıçapı nedir?`,
          en: R`What is the radius of convergence of \(\sum_{n=0}^\infty \frac{x^n}{n!}\)?`,
        },
        options: [
          {
            text: { tr: R`\(R = 0\)`, en: R`\(R = 0\)` },
            why: { tr: R`Paydadaki \(n!\) her \(x^n\)'i ezer; seri her yerde yakınsar.`, en: R`The factorial \(n!\) in the denominator dominates \(x^n\) for every \(x\).` },
          },
          {
            text: { tr: R`\(R = 1\)`, en: R`\(R = 1\)` },
            why: { tr: R`Oran testi limiti \(\lim \frac{|x|}{n+1} = 0 < 1\) her \(x \in \mathbb{R}\) için sağlanır.`, en: R`The ratio limit \(\lim \frac{|x|}{n+1} = 0 < 1\) holds for all \(x\in\mathbb{R}\).` },
          },
          { text: { tr: R`\(R = \infty\)`, en: R`\(R = \infty\)` } },
        ],
        answer: 2,
        explain: { tr: R`Oran testinde \(\lim_{n\to\infty}\frac{|x|^{n+1}/(n+1)!}{|x|^n/n!} = \lim\frac{|x|}{n+1} = 0 < 1\); tüm \(\mathbb{R}\)'de yakınsaktır (\(R=\infty\)).`, en: R`By the ratio test, \(\frac{|x|}{n+1}\to 0 < 1\) for all \(x\), so \(R = \infty\).` },
      },
    ],
  },
];
