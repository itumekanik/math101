import type { PracticeSection } from "../../shared/practice.ts";
import { numDiff } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ii-main",
    title: { tr: "İlkel fonksiyon, u-dönüşümü ve kısmi integrasyon", en: "Antiderivatives, u-substitution & by parts" },
    intro: { tr: R`Belirsiz integral kuralları ve türevle doğrulama.`, en: R`Indefinite integration rules and differentiation checks.` },
    read: { tab: "theory", section: "ii-methods" },
    questions: [
      {
        id: "ii-q1",
        kind: "choice",
        q: {
          tr: R`\(\int 3x^2 e^{x^3}\,dx\) integrali hangisine eşittir?`,
          en: R`Which antiderivative equals \(\int 3x^2 e^{x^3}\,dx\)?`,
        },
        options: [
          { text: { tr: R`\(e^{x^3} + C\)`, en: R`\(e^{x^3} + C\)` } },
          {
            text: { tr: R`\(3e^{x^3} + C\)`, en: R`\(3e^{x^3} + C\)` },
            why: { tr: R`\(3x^2\,dx\) tamamen \(du\)'ya dönüşür, ekstra 3 kalmaz.`, en: R`\(3x^2\,dx\) becomes \(du\) completely; no factor of 3 remains.` },
          },
          {
            text: { tr: R`\(x^3 e^{x^3} + C\)`, en: R`\(x^3 e^{x^3} + C\)` },
            why: { tr: R`Türevini alın: çarpım kuralından fazladan terim çıkar.`, en: R`Differentiating this produces an extra product-rule term.` },
          },
        ],
        answer: 0,
        compute: () => (Math.abs(numDiff((x) => Math.exp(x ** 3), 1) - 3 * Math.E) < 1e-4 ? 0 : -1),
        explain: { tr: R`\(u = x^3 \implies du = 3x^2\,dx\), böylece \(\int e^u\,du = e^{x^3} + C\).`, en: R`Set \(u = x^3\), \(du = 3x^2\,dx\), yielding \(\int e^u\,du = e^{x^3} + C\).` },
      },
      {
        id: "ii-q2",
        kind: "choice",
        q: {
          tr: R`\(\int \ln x\,dx\) için kısmi integrasyonda \(u\) ve \(dv\) nasıl seçilir?`,
          en: R`For \(\int \ln x\,dx\), how should \(u\) and \(dv\) be chosen for integration by parts?`,
        },
        options: [
          {
            text: { tr: R`\(u = 1,\ dv = \ln x\,dx\)`, en: R`\(u = 1,\ dv = \ln x\,dx\)` },
            why: { tr: R`\(dv = \ln x\,dx\)'i integre etmek zaten başlangıç sorumuzun kendisidir!`, en: R`Integrating \(dv = \ln x\,dx\) is the very problem we are trying to solve!` },
          },
          { text: { tr: R`\(u = \ln x,\ dv = 1\,dx\)`, en: R`\(u = \ln x,\ dv = 1\,dx\)` } },
        ],
        answer: 1,
        explain: { tr: R`\(u = \ln x \implies du = \frac{1}{x}dx\), \(v = x\); sonuç \(x\ln x - \int 1\,dx = x\ln x - x + C\).`, en: R`With \(u = \ln x\) and \(dv = dx\), we get \(x\ln x - \int 1\,dx = x\ln x - x + C\).` },
      },
      {
        id: "ii-q3",
        kind: "number",
        q: {
          tr: R`\(F'(x) = 4x^3\) ve \(F(1) = 7\) koşulunu sağlayan ilkel fonksiyon için \(F(2)\) kaçtır?`,
          en: R`If \(F'(x) = 4x^3\) and \(F(1) = 7\), what is \(F(2)\)?`,
        },
        label: { tr: R`\(F(2) =\)`, en: R`\(F(2) =\)` },
        answer: 22,
        compute: () => 2 ** 4 + (7 - 1),
        hint: { tr: R`\(F(x) = x^4 + C\); \(F(1) = 7\)'den \(C = 6\) bulunur.`, en: R`\(F(x) = x^4 + C\); using \(F(1) = 7\) gives \(C = 6\).` },
        explain: { tr: R`\(F(x) = x^4 + 6 \implies F(2) = 16 + 6 = 22\).`, en: R`\(F(x) = x^4 + 6 \implies F(2) = 16 + 6 = 22\).` },
      },
    ],
  },
];
