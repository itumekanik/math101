import type { PracticeSection } from "../../shared/practice.ts";
import { det3, rref, solveLinear } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-vs-spaces",
    title: { tr: "Vektör uzayları ve 3'lü alt uzay testi", en: "Vector spaces & the 3-rule subspace test" },
    intro: {
      tr: R`Polinom uzayları, 3 kapalılık kuralı ve klasik alt uzay tuzakları.`,
      en: R`Polynomial spaces, the 3 closure rules, and classic subspace traps.`,
    },
    read: { tab: "theory", section: "vs-subspace" },
    questions: [
      {
        id: "vs-q1",
        kind: "choice",
        q: {
          tr: R`Aşağıdaki alt kümelerden hangisi \(\mathbb{R}^2\)'nin geçerli bir <b>alt uzayıdır</b>?`,
          en: R`Which subset of \(\mathbb{R}^2\) is a valid <b>subspace</b>?`,
        },
        options: [
          {
            text: { tr: R`\(\{(x, y) : x + y = 1\}\)`, en: R`\(\{(x, y) : x + y = 1\}\)` },
            why: {
              tr: R`Sıfır vektörü \((0, 0)\) bu kümede değildir çünkü \(0 + 0 = 0 \ne 1\). Orijinden geçmeyen doğru asla alt uzay olamaz!`,
              en: R`The zero vector \((0, 0)\) is missing since \(0 + 0 = 0 \ne 1\). A line off the origin is never a subspace!`,
            },
          },
          {
            text: { tr: R`\(\{(x, y) : x \ge 0,\ y \ge 0\}\) (1. bölge)`, en: R`\(\{(x, y) : x \ge 0,\ y \ge 0\}\) (1st quadrant)` },
            why: {
              tr: R`Sıfırı içerir ve toplamaya kapalıdır ama negatif skalerle çarpmada dışarı çıkar: \((-1)\cdot(1, 1) = (-1, -1)\).`,
              en: R`It contains \(\mathbf{0}\) and is closed under addition, but fails negative scalars: \((-1)\cdot(1, 1) = (-1, -1)\).`,
            },
          },
          { text: { tr: R`\(\{(x, y) : 3x - 2y = 0\}\)`, en: R`\(\{(x, y) : 3x - 2y = 0\}\)` } },
          {
            text: { tr: R`\(\{(x, y) : x^2 + y^2 = 1\}\) (birim çember)`, en: R`\(\{(x, y) : x^2 + y^2 = 1\}\) (unit circle)` },
            why: {
              tr: R`Orijin \((0, 0)\) çemberin üzerinde değildir (\(0^2 + 0^2 \ne 1\)) ve \((1, 0) + (0, 1) = (1, 1)\) çemberin dışına taşar.`,
              en: R`The origin \((0, 0)\) is not on the circle (\(0 \ne 1\)), and \((1, 0) + (0, 1) = (1, 1)\) leaves the circle.`,
            },
          },
        ],
        answer: 2,
        explain: {
          tr: R`Homojen denklem \(3x - 2y = 0\) orijinden geçen bir doğrudur: \((0,0)\) sağlar, iki çözümün toplamı ve her reel katı yine \(3x - 2y = 0\) denklemini sağlar.`,
          en: R`The homogeneous equation \(3x - 2y = 0\) is a line through the origin: it contains \(\mathbf{0}\) and stays closed under addition and all real scalar multiples.`,
        },
      },
      {
        id: "vs-q2",
        kind: "number",
        q: {
          tr: R`Derecesi en fazla 3 olan reel polinomlar uzayı \(\mathcal{P}_3\)'ün boyutu kaçtır?`,
          en: R`What is the dimension of \(\mathcal{P}_3\), the space of real polynomials of degree at most 3?`,
        },
        label: { tr: R`\(\dim(\mathcal{P}_3) =\)`, en: R`\(\dim(\mathcal{P}_3) =\)` },
        answer: 4,
        compute: () => 3 + 1,
        hint: {
          tr: R`Standart yapı taşlarını tek tek sayın: \(1,\ x,\ x^2,\ x^3\) (sabit terim \(1\)'i unutmayın!).`,
          en: R`Count every standard building block: \(1,\ x,\ x^2,\ x^3\) (don't forget the constant \(1\)!).`,
        },
        explain: {
          tr: R`Her \(p(x) = c_0 + c_1 x + c_2 x^2 + c_3 x^3\) polinomu 4 serbest katsayıyla belirlenir: \(\dim(\mathcal{P}_n) = n + 1 = 4\).`,
          en: R`Every \(p(x) = c_0 + c_1 x + c_2 x^2 + c_3 x^3\) has 4 free coefficients: \(\dim(\mathcal{P}_n) = n + 1 = 4\).`,
        },
      },
      {
        id: "vs-q3",
        kind: "choice",
        q: {
          tr: R`Derecesi <b>tam olarak 2</b> olan tüm reel polinomların kümesi \(S = \{ax^2 + bx + c : a \ne 0\}\) neden bir vektör uzayı <b>değildir</b>?`,
          en: R`Why is the set \(S = \{ax^2 + bx + c : a \ne 0\}\) of polynomials of degree <b>exactly 2</b> NOT a vector space?`,
        },
        options: [
          {
            text: { tr: "Polinomlar hiçbir zaman vektör olamaz", en: "Polynomials can never be vectors" },
            why: {
              tr: R`Polinomlar pekâlâ vektör uzayı oluşturur (\(\mathcal{P}_n\)); sorun polinom olmakta değil, \(a \ne 0\) kısıtındadır!`,
              en: R`Polynomials happily form vector spaces (\(\mathcal{P}_n\)); the issue is the restriction \(a \ne 0\), not polynomials themselves!`,
            },
          },
          {
            text: { tr: R`Sıfır polinomu \(0 \notin S\) ve toplamada \(x^2\) terimi yok olabilir: \((x^2 + x) + (-x^2 + 1) = x + 1 \notin S\)`, en: R`Zero polynomial \(0 \notin S\), and addition can cancel \(x^2\): \((x^2 + x) + (-x^2 + 1) = x + 1 \notin S\)` },
          },
          {
            text: { tr: "Polinomlarda toplama değişmeli değildir", en: "Polynomial addition is not commutative" },
            why: {
              tr: R`Her zaman \(p(x) + q(x) = q(x) + p(x)\) sağlanır; bozulan şey değişme özelliği değil kapalılık ve sıfır elemanıdır.`,
              en: R`\(p(x) + q(x) = q(x) + p(x)\) always holds; what fails is closure and the zero element.`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(S\)'de sıfır polinomu yoktur (\(a = 0\) yasak) ve iki 2. derece polinomun toplamı 1. dereceye düşebilir. Bu yüzden \(\mathcal{P}_2\) "derecesi en fazla 2" olarak tanımlanır.`,
          en: R`\(S\) excludes the zero polynomial (since \(a = 0\) is forbidden) and adding two quadratics can drop the degree to 1. That's why \(\mathcal{P}_2\) requires degree at most 2.`,
        },
      },
    ],
  },
  {
    id: "px-vs-span",
    title: { tr: "Doğrusal bileşim ve bağımsızlık hesapları", en: "Linear combinations & independence checks" },
    intro: {
      tr: R`Bir hedef vektörü doğrusal bileşim olarak yazma ve 3B'de bağımsızlık testi.`,
      en: R`Solving for linear combination weights and testing independence in 3D.`,
    },
    read: { tab: "theory", section: "vs-span" },
    questions: [
      {
        id: "vs-q4",
        kind: "number",
        q: {
          tr: R`\(\mathbf{b} = (5, 7)\) vektörünü \(\mathbf{v}_1 = (1, 2)\) ve \(\mathbf{v}_2 = (2, 1)\) cinsinden \(\mathbf{b} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2\) diye yazdığımızda \(c_1\) katsayısı kaçtır?`,
          en: R`When writing \(\mathbf{b} = (5, 7)\) as \(\mathbf{b} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2\) with \(\mathbf{v}_1 = (1, 2)\) and \(\mathbf{v}_2 = (2, 1)\), what is \(c_1\)?`,
        },
        label: { tr: R`\(c_1 =\)`, en: R`\(c_1 =\)` },
        answer: 3,
        compute: () => solveLinear([[1, 2], [2, 1]], [5, 7])![0]!,
        hint: {
          tr: R`\(c_1 + 2c_2 = 5\) ve \(2c_1 + c_2 = 7\) sistemini çözün (2. denklemin iki katından 1.'yi çıkarın).`,
          en: R`Solve \(c_1 + 2c_2 = 5\) and \(2c_1 + c_2 = 7\) (subtract the first from twice the second).`,
        },
        explain: {
          tr: R`\(2(2c_1 + c_2) - (c_1 + 2c_2) = 14 - 5 \implies 3c_1 = 9 \implies c_1 = 3\) (ve \(c_2 = 1\)). Sağlama: \(3(1,2) + 1(2,1) = (5,7)\).`,
          en: R`\(2(2c_1 + c_2) - (c_1 + 2c_2) = 14 - 5 \implies 3c_1 = 9 \implies c_1 = 3\) (and \(c_2 = 1\)). Check: \(3(1,2) + 1(2,1) = (5,7)\).`,
        },
      },
      {
        id: "vs-q5",
        kind: "choice",
        q: {
          tr: R`\(\mathbf{v}_1 = (1, 0, 1),\ \mathbf{v}_2 = (0, 1, 1),\ \mathbf{v}_3 = (1, 1, 2)\) vektörleri doğrusal bağımsız mıdır?`,
          en: R`Are \(\mathbf{v}_1 = (1, 0, 1),\ \mathbf{v}_2 = (0, 1, 1),\ \mathbf{v}_3 = (1, 1, 2)\) linearly independent?`,
        },
        options: [
          {
            text: { tr: "Evet, üçü de sıfırdan farklı ve paralel değil", en: "Yes, all three are nonzero and non-parallel" },
            why: {
              tr: R`İkişer ikişer paralel olmamaları yetmez! Dikkatlice toplayın: \(\mathbf{v}_1 + \mathbf{v}_2 = (1, 0, 1) + (0, 1, 1) = (1, 1, 2) = \mathbf{v}_3\)!`,
              en: R`Being pairwise non-parallel is not enough! Add the first two: \(\mathbf{v}_1 + \mathbf{v}_2 = (1, 0, 1) + (0, 1, 1) = (1, 1, 2) = \mathbf{v}_3\)!`,
            },
          },
          { text: { tr: R`Hayır, bağımlıdırlar (\(\mathbf{v}_3 = \mathbf{v}_1 + \mathbf{v}_2\))`, en: R`No, dependent (\(\mathbf{v}_3 = \mathbf{v}_1 + \mathbf{v}_2\))` } },
        ],
        answer: 1,
        compute: () => (det3([[1, 0, 1], [0, 1, 1], [1, 1, 2]]) === 0 ? 1 : 0),
        explain: {
          tr: R`\(\det[\mathbf{v}_1\ \mathbf{v}_2\ \mathbf{v}_3] = 0\) ve \(\mathbf{v}_1 + \mathbf{v}_2 - \mathbf{v}_3 = \mathbf{0}\). Sıfırdan farklı ağırlıklar \((1, 1, -1)\) sıfırı verdiğinden bağımlıdırlar.`,
          en: R`\(\det[\mathbf{v}_1\ \mathbf{v}_2\ \mathbf{v}_3] = 0\) with \(\mathbf{v}_1 + \mathbf{v}_2 - \mathbf{v}_3 = \mathbf{0}\). Nonzero weights \((1, 1, -1)\) give zero, so they are dependent.`,
        },
      },
    ],
  },
  {
    id: "px-vs-indep",
    title: { tr: "Geometrik tahmin ve boyut sınırları", en: "Geometric prediction & dimension limits" },
    intro: {
      tr: R`3B'de germe çöküşünü tahmin edin ve \(k > n\) kuralını pekiştirin.`,
      en: R`Predict span collapse in 3D and master the \(k > n\) rule.`,
    },
    read: { tab: "theory", section: "vs-indep" },
    questions: [
      {
        id: "vs-q6",
        kind: "predict",
        q: {
          tr: R`\(\mathbb{R}^3\)'te \(\mathbf{v}_1 = (1, 2, 1),\ \mathbf{v}_2 = (2, 4, 2),\ \mathbf{v}_3 = (0, 1, 1)\) vektörlerinin germesi \(\operatorname{span}\{\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3\}\) geometrik olarak nedir?`,
          en: R`Geometrically, what is \(\operatorname{span}\{\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3\}\) in \(\mathbb{R}^3\) for \(\mathbf{v}_1 = (1, 2, 1),\ \mathbf{v}_2 = (2, 4, 2),\ \mathbf{v}_3 = (0, 1, 1)\)?`,
        },
        options: [
          { tr: "Orijinden geçen 1B bir doğru", en: "A 1D line through the origin" },
          { tr: "Orijinden geçen 2B bir düzlem", en: "A 2D plane through the origin" },
          { tr: R`Tüm 3B uzay \(\mathbb{R}^3\)`, en: R`All of 3D space \(\mathbb{R}^3\)` },
          { tr: R`Yalnızca orijin \(\{\mathbf{0}\}\)`, en: R`Only the origin \(\{\mathbf{0}\}\)` },
        ],
        answer: 1,
        run: () => {
          const r = rref([[1, 2, 0], [2, 4, 1], [1, 2, 1]]).rankA;
          return {
            answer: r === 1 ? 0 : r === 2 ? 1 : r === 3 ? 2 : 3,
            result: {
              tr: R`RREF rankı \(\operatorname{rank} = ${r}\): \(\mathbf{v}_2 = 2\mathbf{v}_1\) gereksizdir, fakat \(\mathbf{v}_1\) ve \(\mathbf{v}_3\) bağımsızdır → <b>2B düzlem</b>!`,
              en: R`RREF gives \(\operatorname{rank} = ${r}\): \(\mathbf{v}_2 = 2\mathbf{v}_1\) is redundant, while \(\mathbf{v}_1\) and \(\mathbf{v}_3\) are independent → a <b>2D plane</b>!`,
            },
          };
        },
        tryIt: { tab: "play" },
        explain: {
          tr: R`\(\mathbf{v}_2 = 2\mathbf{v}_1\) olduğu için \(\mathbf{v}_2\) hiç yeni yön eklemez. Kalan \(\mathbf{v}_1 = (1, 2, 1)\) ve \(\mathbf{v}_3 = (0, 1, 1)\) birbirinin katı olmadığından orijinden geçen 2 boyutlu bir düzlem gererler.`,
          en: R`Because \(\mathbf{v}_2 = 2\mathbf{v}_1\), \(\mathbf{v}_2\) adds no new direction. The remaining two vectors \(\mathbf{v}_1\) and \(\mathbf{v}_3\) are not multiples of each other, so they span a 2D plane through the origin.`,
        },
      },
      {
        id: "vs-q7",
        kind: "choice",
        q: {
          tr: R`\(\mathbb{R}^3\) içinde hiçbir ikisi paralel olmayan <b>4 tane</b> sıfırdan farklı vektör seçtik. Bu 4 vektör doğrusal bağımsız olabilir mi?`,
          en: R`We pick <b>4 nonzero vectors</b> in \(\mathbb{R}^3\) such that no two are parallel. Can these 4 vectors be linearly independent?`,
        },
        options: [
          {
            text: { tr: "Evet, yeterince farklı yönlerde seçilirse olabilir", en: "Yes, if they point in sufficiently distinct directions" },
            why: {
              tr: R`\(\mathbb{R}^3\)'ün sadece 3 boyutu vardır! 3 bağımsız vektör tüm uzayı doldurduğu anda 4. vektör mecburen onların bileşimi olur.`,
              en: R`\(\mathbb{R}^3\) only has 3 dimensions! Once 3 independent vectors fill all of \(\mathbb{R}^3\), any 4th vector is forced to be a combination of them.`,
            },
          },
          { text: { tr: R`Asla! \(\mathbb{R}^n\)'de \(k > n\) vektör daima bağımlıdır`, en: R`Never! In \(\mathbb{R}^n\), any \(k > n\) vectors are always dependent` } },
          {
            text: { tr: "Ancak birim uzunluklu seçilirse bağımsız olurlar", en: "Only if we normalize them to unit length" },
            why: {
              tr: R`Vektörleri ölçeklemek bağımlılığı değiştirmez; 4 bilinmeyenli 3 homojen denklemde daima en az 1 serbest değişken vardır.`,
              en: R`Rescaling never removes dependence; 3 homogeneous equations in 4 unknowns always have at least 1 free variable.`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(A\mathbf{c} = \mathbf{0}\) sistemi 3 denklem ve 4 bilinmeyen içerir (\(n = 3 < 4 = k\)). En fazla 3 pivot olabilir; en az 1 serbest değişken mutlaka kalır, dolayısıyla sıfırdan farklı çözüm her zaman vardır.`,
          en: R`The system \(A\mathbf{c} = \mathbf{0}\) has 3 equations and 4 unknowns (\(3 < 4\)). With at most 3 pivots, at least 1 free variable guarantees a nonzero solution.`,
        },
      },
    ],
  },
];
