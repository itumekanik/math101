import type { PracticeSection } from "../../shared/practice.ts";
import { cDiv, cMod, cMul, cPow } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-cx-arith",
    title: { tr: "Argand düzlemi, modül, çarpma ve bölme", en: "Argand plane, modulus, multiplication & division" },
    intro: {
      tr: R`Standart \(a + bi\) aritmetiği, modül hesabı ve eşlenikle bölme.`,
      en: R`Standard \(a + bi\) arithmetic, modulus calculations, and dividing with conjugates.`,
    },
    read: { tab: "theory", section: "cx-argand" },
    questions: [
      {
        id: "cx-q1",
        kind: "number",
        q: {
          tr: R`\(z = 3 - 4i\) karmaşık sayısının modülü (orijine uzaklığı) \(|z|\) kaçtır?`,
          en: R`What is the modulus (distance from the origin) \(|z|\) of \(z = 3 - 4i\)?`,
        },
        label: { tr: R`\(|z| =\)`, en: R`\(|z| =\)` },
        answer: 5,
        compute: () => cMod({ re: 3, im: -4 }),
        hint: { tr: R`Modül daima \(\sqrt{a^2 + b^2}\) formülüyle hesaplanır: \(\sqrt{3^2 + (-4)^2}\).`, en: R`Modulus is always \(\sqrt{a^2 + b^2}\): compute \(\sqrt{3^2 + (-4)^2}\).` },
        explain: { tr: R`\(|3 - 4i| = \sqrt{9 + 16} = \sqrt{25} = 5\).`, en: R`\(|3 - 4i| = \sqrt{9 + 16} = \sqrt{25} = 5\).` },
      },
      {
        id: "cx-q2",
        kind: "number",
        q: {
          tr: R`\(z_1 = 2 + i\) ve \(z_2 = 1 + 3i\) ise \(z_1 z_2\) çarpımının reel kısmı kaçtır?`,
          en: R`For \(z_1 = 2 + i\) and \(z_2 = 1 + 3i\), what is the real part of \(z_1 z_2\)?`,
        },
        label: { tr: R`\(\operatorname{Re}(z_1 z_2) =\)`, en: R`\(\operatorname{Re}(z_1 z_2) =\)` },
        answer: -1,
        compute: () => cMul({ re: 2, im: 1 }, { re: 1, im: 3 }).re,
        hint: { tr: R`\(i^2 = -1\) olduğunu unutmayın: \(2\cdot 1 + i\cdot 3i = 2 - 3\).`, en: R`Remember \(i^2 = -1\): compute \(2\cdot 1 + i\cdot 3i = 2 - 3\).` },
        explain: { tr: R`\((2 + i)(1 + 3i) = (2 - 3) + (6 + 1)i = -1 + 7i\), dolayısıyla reel kısım \(-1\)'dir.`, en: R`\((2 + i)(1 + 3i) = (2 - 3) + (6 + 1)i = -1 + 7i\), so the real part is \(-1\).` },
      },
      {
        id: "cx-q3",
        kind: "choice",
        q: {
          tr: R`\(\dfrac{3 + i}{1 - i}\) bölümü standart \(a + bi\) biçiminde hangisine eşittir?`,
          en: R`What is \(\dfrac{3 + i}{1 - i}\) in standard \(a + bi\) form?`,
        },
        options: [
          { text: { tr: R`\(1 + 2i\)`, en: R`\(1 + 2i\)` } },
          {
            text: { tr: R`\(2 + 4i\)`, en: R`\(2 + 4i\)` },
            why: { tr: R`Payı \((1 + i)\) ile doğru çarptınız ama paydadaki \((1 - i)(1 + i) = 2\)'ye bölmeyi unuttunuz!`, en: R`You expanded the numerator right, but forgot to divide by the denominator \((1 - i)(1 + i) = 2\)!` },
          },
          {
            text: { tr: R`\(3 - i\)`, en: R`\(3 - i\)` },
            why: { tr: R`Karmaşık bölmede reel ve sanal kısımlar ayrı ayrı bölünemez; paydanın eşleniği \((1 + i)\) ile çarpmalısınız!`, en: R`You cannot divide real and imaginary parts separately; multiply top and bottom by the conjugate \((1 + i)\)!` },
          },
        ],
        answer: 0,
        compute: () => {
          const q = cDiv({ re: 3, im: 1 }, { re: 1, im: -1 });
          return Math.abs(q.re - 1) < 1e-9 && Math.abs(q.im - 2) < 1e-9 ? 0 : -1;
        },
        explain: {
          tr: R`\(\frac{(3+i)(1+i)}{(1-i)(1+i)} = \frac{2 + 4i}{2} = 1 + 2i\).`,
          en: R`\(\frac{(3+i)(1+i)}{(1-i)(1+i)} = \frac{2 + 4i}{2} = 1 + 2i\).`,
        },
      },
    ],
  },
  {
    id: "px-cx-euler",
    title: { tr: "90° dönüş, kutupsal form ve Euler kuvvetleri", en: "90° rotation, polar form & Euler powers" },
    intro: {
      tr: R`Karmaşık çarpmanın geometrik anlamı ve Euler/De Moivre ile yüksek kuvvet hesabı.`,
      en: R`Geometric meaning of multiplication and fast powers via Euler's formula.`,
    },
    read: { tab: "theory", section: "cx-euler" },
    questions: [
      {
        id: "cx-q4",
        kind: "choice",
        q: {
          tr: R`Argand düzleminde sıfırdan farklı bir \(z\) karmaşık sayısını \(i\) ile çarpmak geometrik olarak ne yapar?`,
          en: R`Geometrically, what does multiplying a nonzero complex number \(z\) by \(i\) do on the Argand plane?`,
        },
        options: [
          {
            text: { tr: "Reel eksene göre ayna yansıması alır", en: "Reflects z across the real axis" },
            why: { tr: R`Reel eksene göre yansıma alma işlemi <b>eşlenik</b> \(\bar z\)'dir, \(i\) ile çarpma değil!`, en: R`Reflecting across the real axis is taking the <b>conjugate</b> \(\bar z\), not multiplying by \(i\)!` },
          },
          {
            text: { tr: "Uzunluğunu koruyarak saat yönünün tersine tam 90° döndürür", en: "Rotates z counterclockwise by 90° without changing its length" },
          },
          {
            text: { tr: "Orijine göre 180° ters çevirir", en: "Flips z by 180° through the origin" },
            why: { tr: R`\(180^\circ\) çeviren işlem \(-1 = i^2\) ile çarpmaktır; tek bir \(i\) yarısı olan \(90^\circ\) döndürür.`, en: R`A \(180^\circ\) flip is multiplying by \(-1 = i^2\); a single \(i\) turns by half of that: \(90^\circ\).` },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(i = 1\cdot e^{i\pi/2}\) olduğundan \(|iz| = 1\cdot|z| = |z|\) ve \(\arg(iz) = \arg z + 90^\circ\)'dir.`,
          en: R`Since \(i = 1\cdot e^{i\pi/2}\), multiplying by \(i\) keeps \(|z|\) unchanged and adds \(90^\circ\) (\(\pi/2\)) to the angle.`,
        },
      },
      {
        id: "cx-q5",
        kind: "number",
        q: {
          tr: R`\((1 + i)^4\) işleminin reel kısmı kaçtır?`,
          en: R`What is the real part of \((1 + i)^4\)?`,
        },
        label: { tr: R`\(\operatorname{Re}((1 + i)^4) =\)`, en: R`\(\operatorname{Re}((1 + i)^4) =\)` },
        answer: -4,
        compute: () => Math.round(cPow({ re: 1, im: 1 }, 4).re),
        hint: { tr: R`\(1 + i = \sqrt{2}\,e^{i\pi/4}\); 4. kuvvetini alın: \((\sqrt{2})^4 e^{i\pi} = 4(-1)\).`, en: R`Write \(1 + i = \sqrt{2}\,e^{i\pi/4}\) and raise to the 4th power: \(4e^{i\pi}\).` },
        explain: { tr: R`\((1 + i)^2 = 2i\), karesi \((2i)^2 = -4\). Kutupsal yoldan: \((\sqrt{2})^4 e^{i\pi} = 4(-1) = -4\).`, en: R`\((1 + i)^2 = 2i\), so \((1 + i)^4 = (2i)^2 = -4\) (or \(4e^{i\pi} = -4\)).` },
      },
    ],
  },
  {
    id: "px-cx-roots",
    title: { tr: "Birimin kökleri ve De Moivre spiralleri", en: "Roots of unity & De Moivre spirals" },
    intro: {
      tr: R`Düzgün çokgen oluşturan n. kökler ve |z| büyüklüğüne göre kuvvetlerin uzun vadeli kaderi.`,
      en: R`Regular polygons of nth roots and the long-term fate of powers based on |z|.`,
    },
    read: { tab: "theory", section: "cx-roots" },
    questions: [
      {
        id: "cx-q6",
        kind: "choice",
        q: {
          tr: R`\(z^6 = 1\) denkleminin karmaşık düzlemdeki tüm kökleri nasıl bir geometrik şekil oluşturur?`,
          en: R`What geometric figure do all complex roots of \(z^6 = 1\) form on the Argand plane?`,
        },
        options: [
          {
            text: { tr: "Reel eksen üzerinde yalnızca iki nokta (±1)", en: "Only two points (±1) on the real axis" },
            why: { tr: R`\(\pm 1\) yalnızca reel köklerdir; karmaşık düzlemde toplam \(6\) kök vardır!`, en: R`\(\pm 1\) are just the real roots; over \(\mathbb{C}\) there are \(6\) distinct roots!` },
          },
          { text: { tr: "Birim çember üzerinde 60° aralıklı düzgün altıgen", en: "A regular hexagon on the unit circle with vertices 60° apart" } },
          {
            text: { tr: "Yarıçapı 6 olan çember üzerinde 6 nokta", en: "6 points on a circle of radius 6" },
            why: { tr: R`Köklerin ortak yarıçapı \(|1|^{1/6} = 1\)'dir, \(6\) değil!`, en: R`The shared radius is \(|1|^{1/6} = 1\), not \(6\)!` },
          },
        ],
        answer: 1,
        explain: {
          tr: R`Kökler \(z_k = e^{i\cdot 2\pi k/6}\) (\(k = 0, 1, 2, 3, 4, 5\)) olup yarıçapı \(1\) olan birim çemberde \(\frac{360^\circ}{6} = 60^\circ\) aralıklı düzgün altıgenin köşeleridir.`,
          en: R`The roots \(e^{i\cdot 2\pi k/6}\) sit at \(60^\circ\) spacing around the unit circle, forming a regular hexagon.`,
        },
      },
      {
        id: "cx-q7",
        kind: "predict",
        q: {
          tr: R`\(z = 0{,}6 + 0{,}6i\) karmaşık sayısının kuvvetleri \(z, z^2, z^3, \dots, z^{10}\) alındığında \(|z^{10}|\) büyüklüğü nasıl davranır?`,
          en: R`When taking successive powers \(z, z^2, \dots, z^{10}\) of \(z = 0.6 + 0.6i\), how does \(|z^{10}|\) behave?`,
        },
        options: [
          { tr: R`Orijine doğru küçülür (\(|z^{10}| < 0{,}25\) — içe kapanan spiral!)`, en: R`Shrinks toward the origin (\(|z^{10}| < 0.25\) — shrinking spiral!)` },
          { tr: R`Birim çemberde sabit kalır (\(|z^{10}| = 1\))`, en: R`Stays fixed on the unit circle (\(|z^{10}| = 1\))` },
          { tr: R`Dışa doğru büyür (\(|z^{10}| > 5\) — dışa açılan spiral!)`, en: R`Explodes outward (\(|z^{10}| > 5\) — expanding spiral!)` },
        ],
        answer: 0,
        run: () => {
          const z = { re: 0.6, im: 0.6 };
          const r = cMod(z);
          const r10 = cMod(cPow(z, 10));
          return {
            answer: r10 < 0.25 ? 0 : r10 > 5 ? 2 : 1,
            result: {
              tr: R`\(|z| = \sqrt{0{,}72} \approx ${r.toFixed(3).replace(".", "{,}")} < 1\) olduğundan \(|z^{10}| = |z|^{10} \approx ${r10.toFixed(4).replace(".", "{,}")}\) — spiral hızla orijine kapanır!`,
              en: R`Since \(|z| = \sqrt{0.72} \approx ${r.toFixed(3)} < 1\), \(|z^{10}| = |z|^{10} \approx ${r10.toFixed(4)}\) — the spiral shrinks rapidly into the origin!`,
            },
          };
        },
        tryIt: { tab: "play" },
        explain: {
          tr: R`De Moivre yasasına göre \(|z^n| = |z|^n\)'dir. \(|0{,}6 + 0{,}6i| = \sqrt{0{,}36 + 0{,}36} \approx 0{,}849 < 1\) olduğundan kuvvet arttıkça modül \(0\)'a gider.`,
          en: R`By De Moivre's law \(|z^n| = |z|^n\). Since \(|0.6 + 0.6i| \approx 0.849 < 1\), raising it to higher powers pulls it toward \(0\).`,
        },
      },
    ],
  },
];
