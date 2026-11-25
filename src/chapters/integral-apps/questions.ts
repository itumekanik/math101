import type { PracticeSection } from "../../shared/practice.ts";
import { numDiff, simpson } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ia-area",
    title: { tr: "Eğriler arası alan ve ortalama değer", en: "Area between curves & average value" },
    intro: {
      tr: R`İki eğri arasındaki kapalı alanlar, kesişim noktaları ve fonksiyonun ortalama değeri.`,
      en: R`Regions trapped between curves, crossing-point splits, and average function values.`,
    },
    read: { tab: "theory", section: "ia-area" },
    questions: [
      {
        id: "ia-q1",
        kind: "number",
        q: {
          tr: R`\(y = x\) ve \(y = x^2\) eğrileri arasında \([0, 1]\) aralığında kalan alan kaçtır? (Ondalık: 3 basamak)`,
          en: R`What is the area between \(y = x\) and \(y = x^2\) on \([0, 1]\)? (Decimal to 3 places)`,
        },
        label: { tr: "Alan =", en: "Area =" },
        answer: 1 / 6,
        tolerance: 0.002,
        compute: () => simpson((x) => x - x * x, 0, 1, 20),
        hint: { tr: R`\(\int_0^1 (x - x^2)\,dx = \frac{1}{2} - \frac{1}{3} = \frac{1}{6} \approx 0{,}167\).`, en: R`\(\int_0^1 (x - x^2)\,dx = \frac{1}{2} - \frac{1}{3} = \frac{1}{6} \approx 0.167\).` },
        explain: { tr: R`\(\left[\frac{x^2}{2} - \frac{x^3}{3}\right]_0^1 = \frac{1}{6} \approx 0{,}1667\).`, en: R`\(\left[\frac{x^2}{2} - \frac{x^3}{3}\right]_0^1 = \frac{1}{6} \approx 0.1667\).` },
      },
      {
        id: "ia-q2",
        kind: "number",
        q: {
          tr: R`\(f(x) = 3x^2\) fonksiyonunun \([0, 2]\) aralığındaki ortalama değeri \(\bar f\) kaçtır?`,
          en: R`What is the average value \(\bar f\) of \(f(x) = 3x^2\) on \([0, 2]\)?`,
        },
        label: { tr: R`\(\bar f =\)`, en: R`\(\bar f =\)` },
        answer: 4,
        compute: () => simpson((x) => 3 * x * x, 0, 2, 20) / 2,
        hint: { tr: R`\(\bar f = \frac{1}{2 - 0}\int_0^2 3x^2\,dx\) formülünü uygulayın.`, en: R`Apply \(\bar f = \frac{1}{2 - 0}\int_0^2 3x^2\,dx\).` },
        explain: { tr: R`\(\frac{1}{2}\big[x^3\big]_0^2 = \frac{8}{2} = 4\).`, en: R`\(\frac{1}{2}\big[x^3\big]_0^2 = \frac{8}{2} = 4\).` },
      },
      {
        id: "ia-q3",
        kind: "choice",
        q: {
          tr: R`\(y = x\) ve \(y = x^2\) eğrileri \(x = 1\)'de kesişir. \([0, 2]\) aralığındaki <b>toplam geometrik alan</b> kaçtır?`,
          en: R`\(y = x\) and \(y = x^2\) cross at \(x = 1\). What is the <b>total geometric area</b> between them on \([0, 2]\)?`,
        },
        options: [
          {
            text: { tr: R`\(-\dfrac{2}{3}\)` , en: R`\(-\dfrac{2}{3}\)` },
            why: { tr: R`Geometrik alan asla negatif olamaz! Eğriler \(x = 1\)'de yer değiştirdiği için integrali bölmeden almak iki bölgeyi birbirinden çıkardı.`, en: R`Geometric area can never be negative! Integrating without splitting at \(x = 1\) subtracted the second piece from the first.` },
          },
          {
            text: { tr: R`\(\dfrac{2}{3}\)` , en: R`\(\dfrac{2}{3}\)` },
            why: { tr: R`Sadece sonuca mutlak değer koymak da yetmez (\(\left|\frac{1}{6} - \frac{5}{6}\right| = \frac{2}{3}\)); iki pozitif parçayı <b>toplamanız</b> gerekir!`, en: R`Taking the absolute value at the very end still subtracts the pieces (\(\left|\frac{1}{6} - \frac{5}{6}\right| = \frac{2}{3}\)); you must <b>add</b> both positive areas!` },
          },
          { text: { tr: R`\(1\) (çünkü \(\frac{1}{6} + \frac{5}{6} = 1\))`, en: R`\(1\) (since \(\frac{1}{6} + \frac{5}{6} = 1\))` } },
        ],
        answer: 2,
        compute: () => {
          const a1 = simpson((x) => x - x * x, 0, 1, 20);
          const a2 = simpson((x) => x * x - x, 1, 2, 20);
          return Math.abs(a1 + a2 - 1) < 1e-6 ? 2 : -1;
        },
        explain: {
          tr: R`\([0, 1]\)'de üstte \(x\) (\(\frac{1}{6}\)), \([1, 2]\)'de üstte \(x^2\) (\(\frac{5}{6}\)) vardır; toplam alan \(\frac{1}{6} + \frac{5}{6} = 1\)'dir.`,
          en: R`\(x\) is on top over \([0, 1]\) (area \(\frac{1}{6}\)) and \(x^2\) is on top over \([1, 2]\) (area \(\frac{5}{6}\)), giving total area \(1\).`,
        },
      },
    ],
  },
  {
    id: "px-ia-vol",
    title: { tr: "3B dönel cisimler: disk ve halka yöntemi", en: "3D solids of revolution: disk & washer" },
    intro: {
      tr: R`Dairesel kesitlerle dönel hacim hesabı ve halka yöntemi tuzağı.`,
      en: R`Computing revolved volumes via disks and avoiding the classic washer trap.`,
    },
    read: { tab: "theory", section: "ia-revolution" },
    questions: [
      {
        id: "ia-q4",
        kind: "number",
        q: {
          tr: R`\(y = \sqrt{x}\) eğrisi \([0, 4]\) üzerinde \(x\)-ekseni etrafında döndürülünce hacim \(V = k\pi\) oluyor. \(k\) kaçtır?`,
          en: R`Revolving \(y = \sqrt{x}\) on \([0, 4]\) around the \(x\)-axis produces volume \(V = k\pi\). What is \(k\)?`,
        },
        label: { tr: R`\(k =\)`, en: R`\(k =\)` },
        answer: 8,
        compute: () => simpson((x) => x, 0, 4, 20),
        hint: { tr: R`Disk formülü: \(V = \pi\int_0^4 (\sqrt{x})^2\,dx = \pi\int_0^4 x\,dx\).`, en: R`Disk formula: \(V = \pi\int_0^4 (\sqrt{x})^2\,dx = \pi\int_0^4 x\,dx\).` },
        explain: { tr: R`\(\int_0^4 x\,dx = \left[\frac{x^2}{2}\right]_0^4 = 8\), dolayısıyla \(V = 8\pi\) ve \(k = 8\).`, en: R`\(\int_0^4 x\,dx = 8\), so \(V = 8\pi\) and \(k = 8\).` },
      },
      {
        id: "ia-q5",
        kind: "choice",
        q: {
          tr: R`Halka (Washer) yönteminde belirli bir \(x\) noktasında dış yarıçap \(R = 3\) ve iç delik yarıçapı \(r = 1\) ise o halka kesitinin alanı kaçtır?`,
          en: R`In the Washer method, if a slice has outer radius \(R = 3\) and inner hole radius \(r = 1\), what is the slice's area?`,
        },
        options: [
          {
            text: { tr: R`\(\pi(3 - 1)^2 = 4\pi\)`, en: R`\(\pi(3 - 1)^2 = 4\pi\)` },
            why: { tr: R`Klasik halka tuzağı! Yarıçapları çıkarıp karesini almak yerine, <b>önce kareleri alıp sonra çıkarmalısınız</b>: \(\pi R^2 - \pi r^2\).`, en: R`Classic washer trap! Never square the difference \((R - r)^2\); always subtract the disk areas \(\pi R^2 - \pi r^2\)!` },
          },
          { text: { tr: R`\(\pi(3^2 - 1^2) = 8\pi\)`, en: R`\(\pi(3^2 - 1^2) = 8\pi\)` } },
          {
            text: { tr: R`\(2\pi(3 - 1) = 4\pi\)`, en: R`\(2\pi(3 - 1) = 4\pi\)` },
            why: { tr: R`\(2\pi R\) çemberin çevresidir, diskin alanı \(\pi R^2\)'dir!`, en: R`\(2\pi R\) is circumference; a disk's area is \(\pi R^2\)!` },
          },
        ],
        answer: 1,
        compute: () => (Math.PI * (3 * 3 - 1 * 1) === 8 * Math.PI ? 1 : -1),
        explain: {
          tr: R`Büyük dairenin alanı \(\pi\cdot 3^2 = 9\pi\), içteki boşluğun alanı \(\pi\cdot 1^2 = \pi\); halkanın alanı \(9\pi - \pi = 8\pi\)'dir.`,
          en: R`Outer disk area is \(9\pi\) and inner hole area is \(\pi\), leaving washer area \(9\pi - \pi = 8\pi\).`,
        },
      },
    ],
  },
  {
    id: "px-ia-arc",
    title: { tr: "Yay uzunluğu ve kırık çizgi yaklaşımı", en: "Arc length & polygonal chains" },
    intro: {
      tr: R`Pisagor temelli yay uzunluğu hesabı ve poligonal yaklaşımın geometrik davranışı.`,
      en: R`Pythagorean arc length calculation and geometric behavior of polygonal approximations.`,
    },
    read: { tab: "theory", section: "ia-arclength" },
    questions: [
      {
        id: "ia-q6",
        kind: "number",
        q: {
          tr: R`\(y = 2x\) doğrusunun \([0, 3]\) üzerindeki yay uzunluğu \(L\) için \(L^2\) kaçtır?`,
          en: R`For the arc length \(L\) of \(y = 2x\) on \([0, 3]\), what is \(L^2\)?`,
        },
        label: { tr: R`\(L^2 =\)`, en: R`\(L^2 =\)` },
        answer: 45,
        compute: () => (3 * Math.sqrt(1 + 4)) ** 2,
        hint: { tr: R`\(f'(x) = 2 \implies L = \int_0^3 \sqrt{1 + 2^2}\,dx = 3\sqrt{5}\).`, en: R`\(f'(x) = 2 \implies L = \int_0^3 \sqrt{1 + 2^2}\,dx = 3\sqrt{5}\).` },
        explain: { tr: R`\(L = 3\sqrt{5} \implies L^2 = 9\cdot 5 = 45\) (Pisagor'la da \(3^2 + 6^2 = 45\)).`, en: R`\(L = 3\sqrt{5} \implies L^2 = 45\) (matching Pythagoras \(3^2 + 6^2 = 45\)).` },
      },
      {
        id: "ia-q7",
        kind: "predict",
        q: {
          tr: R`\(y = \sin x\) eğrisinin \([0, \pi]\) üzerindeki gerçek yay uzunluğu \(L\) ile \(4\) düz doğru parçasından oluşan kırık çizgi uzunluğu \(L_4\) karşılaştırıldığında hangisi doğrudur?`,
          en: R`Comparing the 4-chord polygonal length \(L_4\) against the exact arc length \(L\) of \(y = \sin x\) on \([0, \pi]\), which statement holds?`,
        },
        options: [
          { tr: R`\(L_4 < L\) (kırık çizgi her zaman gerçek yaydan kısadır!)`, en: R`\(L_4 < L\) (straight chords are always shorter than the curve!)` },
          { tr: R`\(L_4 = L\) (tam eşittir)`, en: R`\(L_4 = L\) (they are equal)` },
          { tr: R`\(L_4 > L\) (kırık çizgi yaydan uzundur)`, en: R`\(L_4 > L\) (chords overestimate the curve)` },
        ],
        answer: 0,
        run: () => {
          let poly = 0;
          for (let i = 0; i < 4; i++) {
            const x0 = (i / 4) * Math.PI;
            const x1 = ((i + 1) / 4) * Math.PI;
            poly += Math.hypot(x1 - x0, Math.sin(x1) - Math.sin(x0));
          }
          const exact = simpson((x) => Math.sqrt(1 + numDiff(Math.sin, x) ** 2), 0, Math.PI, 200);
          return {
            answer: poly < exact ? 0 : 2,
            result: {
              tr: R`\(L_4 = ${poly.toFixed(4).replace(".", "{,}")} < L = ${exact.toFixed(4).replace(".", "{,}")}\) — iki nokta arasındaki en kısa yol doğru parçası olduğundan her kiriş kendi yay parçasından kısadır!`,
              en: R`\(L_4 = ${poly.toFixed(4)} < L = ${exact.toFixed(4)}\) — since a straight segment is the shortest path between two points, every chord underestimates its arc!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "ia-arclength" },
        explain: {
          tr: R`İki nokta arasındaki en kısa mesafe doğru parçasıdır; bu yüzden eğriye yerleştirilen her kırık çizgi uzunluğu \(L_n \le L\) olur ve \(n \to \infty\) iken aşağıdan \(L\)'ye yakınsar.`,
          en: R`A straight line is the shortest distance between two points, so every inscribed polygonal chain satisfies \(L_n \le L\) and climbs upward to \(L\) as \(n \to \infty\).`,
        },
      },
    ],
  },
];
