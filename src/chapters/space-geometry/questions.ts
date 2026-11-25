import type { PracticeSection } from "../../shared/practice.ts";
import { cross3, pointPlaneDist3D, skewLinesDist3D, triple3, vNorm } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-sg-main",
    title: { tr: "Vektörel çarpım, düzlemler ve uzaklıklar", en: "Cross product, planes and distances" },
    intro: { tr: R`\(\mathbb{R}^3\)'te alan, hacim ve nokta-düzlem mesafesi.`, en: R`Area, volume, and point-to-plane distances in \(\mathbb{R}^3\).` },
    read: { tab: "theory", section: "sg-cross" },
    questions: [
      {
        id: "sg-q1",
        kind: "number",
        q: {
          tr: R`\(\mathbf u = (1, 0, 0)\) ve \(\mathbf v = (0, 3, 4)\) vektörlerinin oluşturduğu paralelkenarın alanı kaçtır?`,
          en: R`What is the area of the parallelogram spanned by \(\mathbf u = (1, 0, 0)\) and \(\mathbf v = (0, 3, 4)\)?`,
        },
        label: { tr: "Alan =", en: "Area =" },
        answer: 5,
        compute: () => vNorm(cross3([1, 0, 0], [0, 3, 4])),
        hint: { tr: R`\(\|\mathbf u \times \mathbf v\|\) hesaplayın.`, en: R`Compute \(\|\mathbf u \times \mathbf v\|\).` },
        explain: { tr: R`\(\mathbf u\times\mathbf v = (0, -4, 3)\) ve normu \(\sqrt{16 + 9} = 5\).`, en: R`\(\mathbf u\times\mathbf v = (0, -4, 3)\), whose norm is \(\sqrt{16 + 9} = 5\).` },
      },
      {
        id: "sg-q2",
        kind: "number",
        q: {
          tr: R`\(Q = (1, 2, 2)\) noktasının \(2x + y + 2z = 2\) düzlemine uzaklığı kaçtır?`,
          en: R`What is the distance from \(Q = (1, 2, 2)\) to the plane \(2x + y + 2z = 2\)?`,
        },
        label: { tr: R`\(d =\)`, en: R`\(d =\)` },
        answer: 2,
        compute: () => pointPlaneDist3D([1, 2, 2], [2, 1, 2], 2),
        hint: { tr: R`\(\frac{|2(1)+1(2)+2(2)-2|}{\sqrt{2^2+1^2+2^2}}\) hesaplayın.`, en: R`Compute \(\frac{|2(1)+1(2)+2(2)-2|}{\sqrt{2^2+1^2+2^2}}\).` },
        explain: { tr: R`\(|2 + 2 + 4 - 2| / \sqrt{9} = 6 / 3 = 2\).`, en: R`\(|2 + 2 + 4 - 2| / \sqrt{9} = 6 / 3 = 2\).` },
      },
      {
        id: "sg-q3",
        kind: "number",
        q: {
          tr: R`\(\ell_1: (0,0,0)+t(1,0,0)\) ve \(\ell_2: (0,0,3)+s(0,1,0)\) aykırı doğruları arasındaki en kısa mesafe kaçtır?`,
          en: R`What is the shortest distance between the skew lines \(\ell_1: (0,0,0)+t(1,0,0)\) and \(\ell_2: (0,0,3)+s(0,1,0)\)?`,
        },
        label: { tr: R`\(d =\)`, en: R`\(d =\)` },
        answer: 3,
        compute: () => skewLinesDist3D([0, 0, 0], [1, 0, 0], [0, 0, 3], [0, 1, 0]),
        hint: { tr: R`Ortak dikme yönü \((1,0,0)\times(0,1,0)=(0,0,1)\)'dir.`, en: R`The common normal direction is \((1,0,0)\times(0,1,0)=(0,0,1)\).` },
        explain: { tr: R`Birinci doğru \(z=0\), ikinci doğru \(z=3\) düzlemindedir; en kısa uzaklık 3'tür.`, en: R`The first line lies in \(z=0\) and the second in \(z=3\), so the distance is 3.` },
      },
      {
        id: "sg-q4",
        kind: "choice",
        q: {
          tr: R`Üç vektör \(\mathbf a, \mathbf b, \mathbf c \in \mathbb{R}^3\) hangi koşulda aynı düzlemdedir (eşdüzlemli)?`,
          en: R`When are three vectors \(\mathbf a, \mathbf b, \mathbf c \in \mathbb{R}^3\) coplanar?`,
        },
        options: [
          { text: { tr: R`\(\mathbf a \cdot (\mathbf b \times \mathbf c) = 0\)`, en: R`\(\mathbf a \cdot (\mathbf b \times \mathbf c) = 0\)` } },
          {
            text: { tr: R`\(\mathbf a \cdot \mathbf b = 0\)`, en: R`\(\mathbf a \cdot \mathbf b = 0\)` },
            why: { tr: R`Bu yalnızca \(\mathbf a \perp \mathbf b\) demektir; \(\mathbf c\) düzlemden dışarı çıkabilir.`, en: R`That only says \(\mathbf a \perp \mathbf b\); \(\mathbf c\) can still stick out of their plane.` },
          },
          {
            text: { tr: R`\(\|\mathbf a + \mathbf b + \mathbf c\| = 0\)`, en: R`\(\|\mathbf a + \mathbf b + \mathbf c\| = 0\)` },
            why: { tr: R`Bu özel bir durumdur; toplamı 0 olmayan eşdüzlemli vektörler de vardır.`, en: R`Coplanar vectors do not need to sum to zero.` },
          },
        ],
        answer: 0,
        compute: () => (triple3([1, 0, 0], [0, 1, 0], [2, 3, 0]) === 0 ? 0 : -1),
        explain: { tr: R`Paralelyüzün hacmi \(|\mathbf a\cdot(\mathbf b\times\mathbf c)| = 0\) olması üç vektörün aynı düzleme çöktüğünü gösterir.`, en: R`Zero parallelepiped volume \(|\mathbf a\cdot(\mathbf b\times\mathbf c)| = 0\) means the three vectors lie in one plane.` },
      },
    ],
  },
];
