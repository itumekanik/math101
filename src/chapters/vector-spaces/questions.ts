import type { PracticeSection } from "../../shared/practice.ts";
import { det3 } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-vs-main",
    title: { tr: "Alt uzaylar, germe ve doğrusal bağımsızlık", en: "Subspaces, span & linear independence" },
    intro: { tr: R`Alt uzay testi, polinom uzayları ve bağımsızlık kontrolü.`, en: R`Subspace tests, polynomial spaces, and independence checks.` },
    read: { tab: "theory", section: "vs-subspace" },
    questions: [
      {
        id: "vs-q1",
        kind: "choice",
        q: {
          tr: R`Aşağıdaki alt kümelerden hangisi \(\mathbb{R}^2\)'nin bir <b>alt uzayıdır</b>?`,
          en: R`Which subset of \(\mathbb{R}^2\) is a valid <b>subspace</b>?`,
        },
        options: [
          {
            text: { tr: R`\(\{(x,y) : x + y = 1\}\)`, en: R`\(\{(x,y) : x + y = 1\}\)` },
            why: { tr: R`\((0,0)\) bu kümede değil (\(0+0 \ne 1\)).`, en: R`\((0,0)\) is not in the set (\(0+0\ne 1\)).` },
          },
          {
            text: { tr: R`\(\{(x,y) : x \ge 0,\ y \ge 0\}\)`, en: R`\(\{(x,y) : x \ge 0,\ y \ge 0\}\)` },
            why: { tr: R`Negatif skalerle çarpım altında kapalı değildir (\(-1\cdot(1,1) = (-1,-1)\)).`, en: R`Not closed under negative scalars (\(-1\cdot(1,1)=(-1,-1)\)).` },
          },
          { text: { tr: R`\(\{(x,y) : 3x - 2y = 0\}\)`, en: R`\(\{(x,y) : 3x - 2y = 0\}\)` } },
        ],
        answer: 2,
        explain: { tr: R`Homojen denklem \(3x-2y=0\) orijinden geçen bir doğrudur; sıfırı içerir ve tüm doğrusal bileşimlere kapalıdır.`, en: R`The homogeneous line \(3x-2y=0\) contains \(\mathbf 0\) and is closed under addition and scalar multiplication.` },
      },
      {
        id: "vs-q2",
        kind: "choice",
        q: {
          tr: R`\(\mathbf v_1=(1,0,1),\ \mathbf v_2=(0,1,1),\ \mathbf v_3=(1,1,2)\) vektörleri doğrusal bağımsız mıdır?`,
          en: R`Are \(\mathbf v_1=(1,0,1),\ \mathbf v_2=(0,1,1),\ \mathbf v_3=(1,1,2)\) linearly independent?`,
        },
        options: [
          {
            text: { tr: "Evet, bağımsızdırlar", en: "Yes, linearly independent" },
            why: { tr: R`Dikkat: \(\mathbf v_1 + \mathbf v_2 = (1,1,2) = \mathbf v_3\)!`, en: R`Look closely: \(\mathbf v_1 + \mathbf v_2 = (1,1,2) = \mathbf v_3\)!` },
          },
          { text: { tr: R`Hayır, bağımlıdırlar (\(\mathbf v_3 = \mathbf v_1 + \mathbf v_2\))`, en: R`No, dependent (\(\mathbf v_3 = \mathbf v_1 + \mathbf v_2\))` } },
        ],
        answer: 1,
        compute: () => (det3([[1, 0, 1], [0, 1, 1], [1, 1, 2]]) === 0 ? 1 : 0),
        explain: { tr: R`\(\det[\mathbf v_1\ \mathbf v_2\ \mathbf v_3] = 0\) ve \(\mathbf v_1 + \mathbf v_2 - \mathbf v_3 = \mathbf 0\); yani bağımlıdırlar.`, en: R`\(\det[\mathbf v_1\ \mathbf v_2\ \mathbf v_3] = 0\) with \(\mathbf v_1 + \mathbf v_2 - \mathbf v_3 = \mathbf 0\), so they are dependent.` },
      },
      {
        id: "vs-q3",
        kind: "number",
        q: {
          tr: R`Derecesi en fazla 3 olan reel polinomlar uzayı \(\mathcal P_3\)'ün boyutu kaçtır?`,
          en: R`What is the dimension of \(\mathcal P_3\), the space of real polynomials of degree at most 3?`,
        },
        label: { tr: R`\(\dim(\mathcal P_3) =\)`, en: R`\(\dim(\mathcal P_3) =\)` },
        answer: 4,
        compute: () => 3 + 1,
        hint: { tr: R`Standart tabanı sayın: \(\{1, x, x^2, x^3\}\).`, en: R`Count the standard basis: \(\{1, x, x^2, x^3\}\).` },
        explain: { tr: R`Sabit terim \(1\) dahil dört taban elemanı vardır: \(\dim(\mathcal P_n) = n + 1 = 4\).`, en: R`Including the constant \(1\), there are four basis polynomials: \(\dim(\mathcal P_n) = n + 1 = 4\).` },
      },
    ],
  },
];
