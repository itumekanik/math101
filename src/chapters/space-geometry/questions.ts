import type { PracticeSection } from "../../shared/practice.ts";
import { cross3, pointPlaneDist3D, skewLinesDist3D, triple3, vNorm } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-sg-basic",
    title: { tr: "Düzlemler, vektörel çarpım ve karma çarpım", en: "Planes, cross product & triple product" },
    intro: {
      tr: R`3B'de düzlem normali okuma, vektörel çarpımın yönü/alanı ve eşdüzlemlilik testi.`,
      en: R`Reading plane normals, cross-product direction/area, and coplanarity in 3D.`,
    },
    read: { tab: "theory", section: "sg-cross" },
    questions: [
      {
        id: "sg-q1",
        kind: "choice",
        q: {
          tr: R`\(\mathbb{R}^3\) uzayında \(2x - y + 3z = 6\) denklemi neyi temsil eder?`,
          en: R`In \(\mathbb{R}^3\), what geometric object does \(2x - y + 3z = 6\) represent?`,
        },
        options: [
          {
            text: { tr: R`Yön vektörü \((2, -1, 3)\) olan bir doğru`, en: R`A line with direction vector \((2, -1, 3)\)` },
            why: { tr: R`3B'de tek bir doğrusal denklem doğru değil düzlem çizer; doğrular parametrik \(\mathbf r(t)=P_0+t\mathbf d\) ile yazılır.`, en: R`A single linear equation in 3D defines a plane, not a line; lines require parametric form \(\mathbf r(t)=P_0+t\mathbf d\).` },
          },
          { text: { tr: R`Normal vektörü \((2, -1, 3)\) olan bir düzlem`, en: R`A plane with normal vector \((2, -1, 3)\)` } },
          {
            text: { tr: R`Merkezi \((2, -1, 3)\) olan bir küre`, en: R`A sphere centered at \((2, -1, 3)\)` },
            why: { tr: R`Küre denklemi ikinci derecedendir (\(x^2+y^2+z^2\)); bu denklem tamamen birinci derecedir.`, en: R`Spheres require quadratic terms (\(x^2+y^2+z^2\)); this equation is purely linear.` },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(ax + by + cz = d\) denklemi \(\mathbb{R}^3\)'te normal vektörü \(\mathbf n = (a, b, c) = (2, -1, 3)\) olan sonsuz bir düzlem tanımlar.`,
          en: R`In \(\mathbb{R}^3\), \(ax + by + cz = d\) defines a plane whose normal vector is \(\mathbf n = (a, b, c) = (2, -1, 3)\).`,
        },
      },
      {
        id: "sg-q2",
        kind: "number",
        q: {
          tr: R`\(\mathbf u = (1, 0, 0)\) ve \(\mathbf v = (0, 3, 4)\) vektörlerinin oluşturduğu paralelkenarın alanı kaçtır?`,
          en: R`What is the area of the parallelogram spanned by \(\mathbf u = (1, 0, 0)\) and \(\mathbf v = (0, 3, 4)\)?`,
        },
        label: { tr: "Alan =", en: "Area =" },
        answer: 5,
        compute: () => vNorm(cross3([1, 0, 0], [0, 3, 4])),
        hint: { tr: R`\(\mathbf u \times \mathbf v\) vektörünü bulup uzunluğu \(\|\mathbf u \times \mathbf v\|\)'yi hesaplayın.`, en: R`Find \(\mathbf u \times \mathbf v\) and take its norm \(\|\mathbf u \times \mathbf v\|\).` },
        explain: { tr: R`\(\mathbf u\times\mathbf v = (0, -4, 3)\) ve uzunluğu \(\sqrt{0^2 + (-4)^2 + 3^2} = \sqrt{25} = 5\).`, en: R`\(\mathbf u\times\mathbf v = (0, -4, 3)\), whose norm is \(\sqrt{16 + 9} = 5\).` },
      },
      {
        id: "sg-q3",
        kind: "choice",
        q: {
          tr: R`Eğer \(\mathbf u \times \mathbf v = (2, -1, 3)\) ise, ters sırada çarpım \(\mathbf v \times \mathbf u\) nedir?`,
          en: R`If \(\mathbf u \times \mathbf v = (2, -1, 3)\), what is the reversed cross product \(\mathbf v \times \mathbf u\)?`,
        },
        options: [
          {
            text: { tr: R`\((2, -1, 3)\)`, en: R`\((2, -1, 3)\)` },
            why: { tr: R`Vektörel çarpımda değişme özelliği yoktur; sıra değişince sağ el başparmağı ters yöne döner!`, en: R`The cross product is NOT commutative; swapping order flips the right-hand thumb upside down!` },
          },
          { text: { tr: R`\((-2, 1, -3)\)`, en: R`\((-2, 1, -3)\)` } },
          {
            text: { tr: R`\((3, -1, 2)\)`, en: R`\((3, -1, 2)\)` },
            why: { tr: R`Bileşenlerin sırası değil, tüm bileşenlerin işareti tersine döner: \(\mathbf v \times \mathbf u = -(\mathbf u \times \mathbf v)\).`, en: R`You negate every entry rather than reversing them: \(\mathbf v \times \mathbf u = -(\mathbf u \times \mathbf v)\).` },
          },
        ],
        answer: 1,
        compute: () => {
          const c1 = cross3([1, 2, 0], [0, 1, 3]);
          const c2 = cross3([0, 1, 3], [1, 2, 0]);
          return c2[0] === -c1[0] && c2[1] === -c1[1] && c2[2] === -c1[2] ? 1 : -1;
        },
        explain: {
          tr: R`Anti-simetri gereği \(\mathbf v \times \mathbf u = -(\mathbf u \times \mathbf v) = (-2, 1, -3)\).`,
          en: R`By anti-commutativity, \(\mathbf v \times \mathbf u = -(\mathbf u \times \mathbf v) = (-2, 1, -3)\).`,
        },
      },
      {
        id: "sg-q4",
        kind: "predict",
        q: {
          tr: R`\(\mathbf a = (1, 0, 0)\), \(\mathbf b = (0, 2, 0)\) ve \(\mathbf c = (3, 4, 0)\) vektörlerinin gerdiği 3B paralelyüzün hacmi nedir?`,
          en: R`What is the 3D parallelepiped volume spanned by \(\mathbf a = (1, 0, 0)\), \(\mathbf b = (0, 2, 0)\), and \(\mathbf c = (3, 4, 0)\)?`,
        },
        options: [
          { tr: R`\(0\) (üç vektör aynı düzlemde — eşdüzlemli!)`, en: R`\(0\) (all three vectors are coplanar!)` },
          { tr: R`\(6\) birimküp`, en: R`\(6\) cubic units` },
          { tr: R`\(24\) birimküp`, en: R`\(24\) cubic units` },
        ],
        answer: 0,
        run: () => {
          const vol = Math.abs(triple3([1, 0, 0], [0, 2, 0], [3, 4, 0]));
          return {
            answer: vol === 0 ? 0 : 1,
            result: {
              tr: `\\(|\\mathbf a \\cdot (\\mathbf b \\times \\mathbf c)| = ${vol}\\) — üç vektörün de \\(z = 0\\) olduğundan hepsi \\(xy\\)-düzlemine çöker!`,
              en: `\\(|\\mathbf a \\cdot (\\mathbf b \\times \\mathbf c)| = ${vol}\\) — all three have \\(z = 0\\), so they lie flat in the \\(xy\\)-plane!`,
            },
          };
        },
        tryIt: { tab: "play" },
        explain: {
          tr: R`Üç vektörün de \(z\)-bileşeni \(0\) olduğundan hepsi \(xy\)-düzleminde yatar; yükseklik sıfır olduğu için hacim \(|\mathbf a\cdot(\mathbf b\times\mathbf c)| = 0\)'dır.`,
          en: R`All three vectors have \(z = 0\) and lie inside the \(xy\)-plane; zero height gives zero volume \(|\mathbf a\cdot(\mathbf b\times\mathbf c)| = 0\).`,
        },
      },
    ],
  },
  {
    id: "px-sg-dist",
    title: { tr: "Uzaklıklar ve eşdüzlemlilik koşulu", en: "3D distances & coplanarity condition" },
    intro: {
      tr: R`Nokta–düzlem uzaklığı, aykırı doğrular arası mesafe ve karma çarpım testi.`,
      en: R`Point-to-plane distance, skew-line distance, and the scalar triple product test.`,
    },
    read: { tab: "theory", section: "sg-skew" },
    questions: [
      {
        id: "sg-q5",
        kind: "number",
        q: {
          tr: R`\(Q = (1, 2, 2)\) noktasının \(2x + y + 2z = 2\) düzlemine uzaklığı kaçtır?`,
          en: R`What is the distance from \(Q = (1, 2, 2)\) to the plane \(2x + y + 2z = 2\)?`,
        },
        label: { tr: R`\(d =\)`, en: R`\(d =\)` },
        answer: 2,
        compute: () => pointPlaneDist3D([1, 2, 2], [2, 1, 2], 2),
        hint: { tr: R`\(\frac{|2(1)+1(2)+2(2)-2|}{\sqrt{2^2+1^2+2^2}}\) hesaplayın.`, en: R`Compute \(\frac{|2(1)+1(2)+2(2)-2|}{\sqrt{2^2+1^2+2^2}}\).` },
        explain: { tr: R`\(|2 + 2 + 4 - 2| / \sqrt{4 + 1 + 4} = 6 / 3 = 2\).`, en: R`\(|2 + 2 + 4 - 2| / \sqrt{4 + 1 + 4} = 6 / 3 = 2\).` },
      },
      {
        id: "sg-q6",
        kind: "number",
        q: {
          tr: R`\(\ell_1: (0,0,0)+t(1,0,0)\) ve \(\ell_2: (0,0,3)+s(0,1,0)\) aykırı doğruları arasındaki en kısa mesafe kaçtır?`,
          en: R`What is the shortest distance between the skew lines \(\ell_1: (0,0,0)+t(1,0,0)\) and \(\ell_2: (0,0,3)+s(0,1,0)\)?`,
        },
        label: { tr: R`\(d =\)`, en: R`\(d =\)` },
        answer: 3,
        compute: () => skewLinesDist3D([0, 0, 0], [1, 0, 0], [0, 0, 3], [0, 1, 0]),
        hint: { tr: R`Ortak dikme yönü \((1,0,0)\times(0,1,0)=(0,0,1)\)'dir.`, en: R`The common normal direction is \((1,0,0)\times(0,1,0)=(0,0,1)\).` },
        explain: { tr: R`Birinci doğru \(z=0\) düzleminde, ikinci doğru \(z=3\) yüksekliğindedir; aradaki dik köprü \(3\) birimdir.`, en: R`The first line lies in \(z=0\) and the second at \(z=3\), so the vertical bridge has length \(3\).` },
      },
      {
        id: "sg-q7",
        kind: "choice",
        q: {
          tr: R`Üç vektör \(\mathbf a, \mathbf b, \mathbf c \in \mathbb{R}^3\) hangi koşulda aynı düzlemdedir (eşdüzlemli)?`,
          en: R`When are three vectors \(\mathbf a, \mathbf b, \mathbf c \in \mathbb{R}^3\) coplanar?`,
        },
        options: [
          { text: { tr: R`\(\mathbf a \cdot (\mathbf b \times \mathbf c) = 0\)`, en: R`\(\mathbf a \cdot (\mathbf b \times \mathbf c) = 0\)` } },
          {
            text: { tr: R`\(\mathbf a \cdot \mathbf b = 0\)`, en: R`\(\mathbf a \cdot \mathbf b = 0\)` },
            why: { tr: R`Bu yalnızca \(\mathbf a \perp \mathbf b\) demektir; \(\mathbf c\) üçüncü boyuta doğru düzlemden dışarı çıkabilir.`, en: R`That only says \(\mathbf a \perp \mathbf b\); \(\mathbf c\) can still stick out into the 3rd dimension.` },
          },
          {
            text: { tr: R`\(\|\mathbf a + \mathbf b + \mathbf c\| = 0\)`, en: R`\(\|\mathbf a + \mathbf b + \mathbf c\| = 0\)` },
            why: { tr: R`Bu çok özel bir durumdur; toplamı sıfır olmayan sonsuz tane eşdüzlemli vektör üçlüsü vardır.`, en: R`Coplanar vectors do not need to sum to zero.` },
          },
        ],
        answer: 0,
        compute: () => (triple3([1, 0, 0], [0, 1, 0], [2, 3, 0]) === 0 ? 0 : -1),
        explain: { tr: R`Paralelyüzün hacmi \(|\mathbf a\cdot(\mathbf b\times\mathbf c)| = 0\) olması, üç vektörün aynı düzleme çöktüğünü (eşdüzlemli olduğunu) gösterir.`, en: R`Zero parallelepiped volume \(|\mathbf a\cdot(\mathbf b\times\mathbf c)| = 0\) holds iff the three vectors lie in one flat plane.` },
      },
    ],
  },
];
