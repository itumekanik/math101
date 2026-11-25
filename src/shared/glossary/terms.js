/*
 * Bilingual University Mathematics Glossary (Lectures 1–21).
 */
import { I18N, L } from "../i18n.js";
import { CHAPTER, PLACE_TITLES, TAB_NAMES, chapterOf } from "../core.js";

const R = String.raw;

export const GLOSSARY_GROUPS = [
  { key: "foundations", title: { tr: "Fonksiyonlar ve Geometri", en: "Functions & Geometry" } },
  { key: "matrices", title: { tr: "Matrisler ve Lineer Sistemler", en: "Matrices & Linear Systems" } },
  { key: "spaces", title: { tr: "Vektör ve İç Çarpım Uzayları", en: "Vector & Inner Product Spaces" } },
  { key: "calculus", title: { tr: "Limit ve Türev", en: "Limits & Derivatives" } },
  { key: "series-int", title: { tr: "Seriler ve İntegral", en: "Series & Integrals" } },
  { key: "complex", title: { tr: "Karmaşık Sayılar", en: "Complex Numbers" } },
];

export const GLOSSARY = {
  // ---- Foundations & Geometry ----
  function: {
    group: "foundations",
    name: { tr: "Fonksiyon", en: "Function" },
    aka: ["mapping", "gönderim", "domain", "tanım kümesi"],
    def: {
      tr: R`Tanım kümesi \(A\)'daki her elemanı değer kümesi \(B\)'deki <b>tam olarak bir</b> elemana eşleyen kural: \(f: A \to B\).`,
      en: R`A rule \(f: A \to B\) assigning to every element in the domain \(A\) <b>exactly one</b> element in the codomain \(B\).`,
    },
    see: ["injective", "inverse-fn", "transcendental"],
    link: { chapter: "functions", tab: "theory" },
  },
  injective: {
    group: "foundations",
    name: { tr: "Birebir (İnjektif) & Örten", en: "Injective & Surjective" },
    aka: ["bijective", "bijektif", "one-to-one", "onto"],
    def: {
      tr: R`\(f(x_1)=f(x_2) \Rightarrow x_1=x_2\) ise <b>birebir</b>; her \(y \in B\) için \(f(x)=y\) sağlayan bir \(x\) varsa <b>örten</b>dir. İkisi birden sağlanırsa fonksiyon <b>bijektif</b>tir ve [[inverse-fn|ters fonksiyonu]] vardır.`,
      en: R`<b>Injective</b> if \(f(x_1)=f(x_2) \Rightarrow x_1=x_2\); <b>surjective</b> if every \(y \in B\) is hit. Both together give a <b>bijection</b>, which guarantees an [[inverse-fn|inverse]].`,
    },
    link: { chapter: "functions", tab: "theory" },
  },
  "inverse-fn": {
    group: "foundations",
    name: { tr: "Ters Fonksiyon", en: "Inverse function" },
    aka: ["inverse", "f^-1", "yansıma"],
    def: {
      tr: R`\(f^{-1}(f(x)) = x\) ve \(f(f^{-1}(y)) = y\) sağlayan fonksiyon. Grafiği \(f\)'nin grafiğinin \(y = x\) doğrusuna göre simetriğidir.`,
      en: R`The function satisfying \(f^{-1}(f(x)) = x\) and \(f(f^{-1}(y)) = y\). Its graph is the reflection of \(f\) across the line \(y = x\).`,
    },
    link: { chapter: "functions", tab: "theory" },
  },
  transcendental: {
    group: "foundations",
    name: { tr: "Aşkın Fonksiyon", en: "Transcendental function" },
    aka: ["exp", "ln", "sin", "cos", "sinh", "cosh", "hiperbolik"],
    def: {
      tr: R`Sonlu polinom denklemleriyle ifade edilemeyen fonksiyonlar: \(e^x\), \(\ln x\), trigonometrik (\(\sin,\cos,\tan\)) ve hiperbolik (\(\sinh,\cosh,\tanh\)) fonksiyonlar.`,
      en: R`Functions not expressible via finite polynomial equations: \(e^x\), \(\ln x\), trigonometric (\(\sin,\cos,\tan\)) and hyperbolic (\(\sinh,\cosh,\tanh\)) functions.`,
    },
    link: { chapter: "functions", tab: "theory" },
  },
  vector: {
    group: "foundations",
    name: { tr: "Vektör", en: "Vector" },
    aka: ["norm", "büyüklük", "yön"],
    def: {
      tr: R`Hem büyüklüğe ([[norm|norm]]) hem yöne sahip matematiksel nesne. \(\mathbb{R}^n\)'de sıralı \(n\)-li \(\mathbf v = (v_1,\dots,v_n)\) olarak yazılır.`,
      en: R`A mathematical object having both magnitude ([[norm|norm]]) and direction, written in \(\mathbb{R}^n\) as an ordered tuple \(\mathbf v = (v_1,\dots,v_n)\).`,
    },
    see: ["dot-product", "cross-product", "norm"],
    link: { chapter: "vectors", tab: "theory" },
  },
  norm: {
    group: "foundations",
    name: { tr: "Norm (Uzunluk)", en: "Norm (Length)" },
    aka: ["magnitude", "uzunluk", "euclidean"],
    def: {
      tr: R`Bir vektörün uzunluğu: Öklid normu \(\|\mathbf v\| = \sqrt{\mathbf v \cdot \mathbf v} = \sqrt{v_1^2 + \dots + v_n^2}\). Normu 1 olan vektöre <b>birim vektör</b> denir.`,
      en: R`The length of a vector: Euclidean norm \(\|\mathbf v\| = \sqrt{\mathbf v \cdot \mathbf v} = \sqrt{v_1^2 + \dots + v_n^2}\). A vector with norm 1 is a <b>unit vector</b>.`,
    },
    link: { chapter: "vectors", tab: "theory" },
  },
  "dot-product": {
    group: "foundations",
    name: { tr: "Nokta (Skaler) Çarpım", en: "Dot product" },
    aka: ["skaler çarpım", "scalar product", "angle"],
    def: {
      tr: R`\(\mathbf u \cdot \mathbf v = \sum u_i v_i = \|\mathbf u\|\|\mathbf v\|\cos\theta\). İki sıfırdan farklı vektör ancak ve ancak \(\mathbf u \cdot \mathbf v = 0\) ise diktir ([[orthogonality|ortogonal]]).`,
      en: R`\(\mathbf u \cdot \mathbf v = \sum u_i v_i = \|\mathbf u\|\|\mathbf v\|\cos\theta\). Two nonzero vectors are perpendicular ([[orthogonality|orthogonal]]) iff \(\mathbf u \cdot \mathbf v = 0\).`,
    },
    see: ["inner-product", "projection", "cauchy-schwarz"],
    link: { chapter: "vectors", tab: "theory" },
  },
  "cauchy-schwarz": {
    group: "foundations",
    name: { tr: "Cauchy–Schwarz Eşitsizliği", en: "Cauchy–Schwarz inequality" },
    aka: ["eşitsizlik", "inequality"],
    def: {
      tr: R`Her [[inner-product|iç çarpım]] uzayında \(|\langle \mathbf u, \mathbf v \rangle| \le \|\mathbf u\|\,\|\mathbf v\|\). Eşitlik ancak vektörler doğrusal bağımlıysa sağlanır.`,
      en: R`In any [[inner-product|inner product]] space, \(|\langle \mathbf u, \mathbf v \rangle| \le \|\mathbf u\|\,\|\mathbf v\|\), with equality iff the vectors are linearly dependent.`,
    },
    link: [{ chapter: "vectors", tab: "math" }, { chapter: "inner-product", tab: "math" }],
  },
  "normal-vector": {
    group: "foundations",
    name: { tr: "Normal Vektör", en: "Normal vector" },
    aka: ["dik vektör", "perpendicular"],
    def: {
      tr: R`Bir doğruya (2B'de \(ax+by+c=0\) için \(\mathbf n=(a,b)\)) veya bir düzleme (3B'de \(ax+by+cz=d\) için \(\mathbf n=(a,b,c)\)) dik olan sıfırdan farklı vektör.`,
      en: R`A nonzero vector perpendicular to a line (\(\mathbf n=(a,b)\) for \(ax+by+c=0\)) or a plane (\(\mathbf n=(a,b,c)\) for \(ax+by+cz=d\)).`,
    },
    link: [{ chapter: "plane-geometry", tab: "theory" }, { chapter: "space-geometry", tab: "theory" }],
  },
  conic: {
    group: "foundations",
    name: { tr: "Konik Kesit", en: "Conic section" },
    aka: ["elips", "parabol", "hiperbol", "ellipse", "parabola", "hyperbola", "eccentricity"],
    def: {
      tr: R`Bir koninin bir düzlemle kesişimi: çember (\(e=0\)), elips (\(0 < e < 1\)), parabol (\(e=1\)) ve hiperbol (\(e > 1\)); burada \(e\) dışmerkezliktir.`,
      en: R`Intersection of a cone and a plane: circle (\(e=0\)), ellipse (\(0 < e < 1\)), parabola (\(e=1\)), and hyperbola (\(e > 1\)), classified by eccentricity \(e\).`,
    },
    link: { chapter: "plane-geometry", tab: "theory" },
  },
  "cross-product": {
    group: "foundations",
    name: { tr: "Vektörel Çarpım", en: "Cross product" },
    aka: ["dış çarpım", "vector product", "right-hand rule"],
    def: {
      tr: R`\(\mathbb{R}^3\)'te \(\mathbf u \times \mathbf v\), hem \(\mathbf u\)'ya hem \(\mathbf v\)'ye diktir; yönü sağ el kuralıyla bulunur ve uzunluğu \(\|\mathbf u \times \mathbf v\| = \|\mathbf u\|\|\mathbf v\|\sin\theta\) paralelkenarın alanına eşittir.`,
      en: R`In \(\mathbb{R}^3\), \(\mathbf u \times \mathbf v\) is perpendicular to both \(\mathbf u\) and \(\mathbf v\) (right-hand rule), with length \(\|\mathbf u\|\|\mathbf v\|\sin\theta\) equal to the parallelogram area.`,
    },
    link: { chapter: "space-geometry", tab: "theory" },
  },
  "skew-lines": {
    group: "foundations",
    name: { tr: "Aykırı Doğrular", en: "Skew lines" },
    aka: ["aykırı", "3d lines"],
    def: {
      tr: R`\(\mathbb{R}^3\)'te ne paralel olan ne de kesişen iki doğru. Ortak bir düzlemde yatmazlar ve aralarındaki en kısa uzaklık iki yön vektörüne de diktir.`,
      en: R`Two lines in \(\mathbb{R}^3\) that are neither parallel nor intersecting; they are non-coplanar and their shortest connector is perpendicular to both.`,
    },
    link: { chapter: "space-geometry", tab: "theory" },
  },

  // ---- Matrices & Linear Systems ----
  matrix: {
    group: "matrices",
    name: { tr: "Matris", en: "Matrix" },
    aka: ["linear map", "doğrusal dönüşüm", "transpose"],
    def: {
      tr: R`\(m\) satır ve \(n\) sütundan oluşan sayı tablosu (\(A \in \mathbb{R}^{m\times n}\)). \(\mathbf x \mapsto A\mathbf x\) çarpımı \(\mathbb{R}^n \to \mathbb{R}^m\) bir doğrusal dönüşümü temsil eder.`,
      en: R`An \(m \times n\) rectangular array of numbers (\(A \in \mathbb{R}^{m\times n}\)). Multiplication \(\mathbf x \mapsto A\mathbf x\) represents a linear map \(\mathbb{R}^n \to \mathbb{R}^m\).`,
    },
    see: ["determinant", "inverse-matrix", "rank"],
    link: { chapter: "matrices", tab: "theory" },
  },
  transpose: {
    group: "matrices",
    name: { tr: "Transpoz (Devrik)", en: "Transpose" },
    aka: ["A^T", "simetrik", "symmetric"],
    def: {
      tr: R`Satırları sütun, sütunları satır yapılan matris: \((A^T)_{ij} = A_{ji}\). Önemli özellik: \((AB)^T = B^T A^T\). \(A^T = A\) ise matris <b>simetrik</b>tir.`,
      en: R`Obtained by swapping rows and columns: \((A^T)_{ij} = A_{ji}\), satisfying \((AB)^T = B^T A^T\). A matrix with \(A^T = A\) is <b>symmetric</b>.`,
    },
    link: { chapter: "matrices", tab: "theory" },
  },
  determinant: {
    group: "matrices",
    name: { tr: "Determinant", en: "Determinant" },
    aka: ["det", "area scale", "singular"],
    def: {
      tr: R`Kare matrise atanan skaler \(\det(A)\). Geometrik olarak dönüşümün yönlü alan/hacim ölçekleme çarpanıdır. \(\det(A) \ne 0 \iff A\) tersinirdir.`,
      en: R`A scalar \(\det(A)\) assigned to a square matrix: geometrically the signed area/volume scaling factor. \(\det(A) \ne 0 \iff A\) is invertible.`,
    },
    see: ["inverse-matrix", "orthogonal-matrix"],
    link: { chapter: "square-matrices", tab: "theory" },
  },
  "inverse-matrix": {
    group: "matrices",
    name: { tr: "Ters Matris", en: "Inverse matrix" },
    aka: ["invertible", "tersinir", "nonsingular", "A^-1"],
    def: {
      tr: R`\(A A^{-1} = A^{-1} A = I\) sağlayan kare matris \(A^{-1}\). Yalnızca \(\det(A) \ne 0\) olduğunda mevcuttur ve tektir.`,
      en: R`The unique square matrix \(A^{-1}\) satisfying \(A A^{-1} = A^{-1} A = I\). It exists if and only if \(\det(A) \ne 0\).`,
    },
    link: { chapter: "square-matrices", tab: "theory" },
  },
  "orthogonal-matrix": {
    group: "matrices",
    name: { tr: "Ortogonal Matris", en: "Orthogonal matrix" },
    aka: ["Q^T Q = I", "rotation", "dönme"],
    def: {
      tr: R`\(Q^T Q = I\), yani \(Q^{-1} = Q^T\) sağlayan kare matris. Sütunları ortonormaldir; uzunlukları ve açıları korur (\(\|Q\mathbf x\|=\|\mathbf x\|\)) ve \(\det(Q) = \pm 1\).`,
      en: R`A square matrix satisfying \(Q^T Q = I\) (so \(Q^{-1} = Q^T\)). Its columns are orthonormal; it preserves lengths and angles, with \(\det(Q) = \pm 1\).`,
    },
    link: { chapter: "square-matrices", tab: "theory" },
  },
  rref: {
    group: "matrices",
    name: { tr: "Gauss Yok Etme & RREF", en: "Gaussian Elimination & RREF" },
    aka: ["pivot", "satır indirgeme", "row reduction", "echelon"],
    def: {
      tr: R`Satır değişimi, sıfırdan farklı skalerle çarpma ve satır ekleme (temel satır işlemleri) ile genişletilmiş matrisi \([A\mid\mathbf b]\) indirgenmiş satır basamak formuna (RREF) getirme yöntemi.`,
      en: R`Applying elementary row operations (swap, scale, add multiple) to reduce \([A\mid\mathbf b]\) to Reduced Row Echelon Form (RREF) without changing the solution set.`,
    },
    see: ["rank"],
    link: { chapter: "linear-systems", tab: "theory" },
  },
  rank: {
    group: "matrices",
    name: { tr: "Rank", en: "Rank" },
    aka: ["pivot sayısı", "column space", "rouche-capelli"],
    def: {
      tr: R`Matrisin basamak formundaki pivot sayısı; doğrusal bağımsız satır veya sütun sayısına eşittir. \(A\mathbf x=\mathbf b\) ancak \(\operatorname{rank}(A)=\operatorname{rank}([A\mid\mathbf b])\) ise tutarlıdır.`,
      en: R`Number of pivots in row echelon form, equal to the dimension of the column space (and row space). \(A\mathbf x=\mathbf b\) is consistent iff \(\operatorname{rank}(A)=\operatorname{rank}([A\mid\mathbf b])\).`,
    },
    link: [{ chapter: "linear-systems", tab: "theory" }, { chapter: "basis-dimension", tab: "theory" }],
  },

  // ---- Vector & Inner Product Spaces ----
  "vector-space": {
    group: "spaces",
    name: { tr: "Vektör Uzayı", en: "Vector space" },
    aka: ["aksiyom", "axioms", "linear space"],
    def: {
      tr: R`Vektör toplaması ve skalerle çarpma işlemleri altında 8 temel aksiyomu sağlayan küme \(V\) (örneğin \(\mathbb{R}^n\), polinomlar \(\mathcal P_n\), sürekli fonksiyonlar \(C([a,b])\)).`,
      en: R`A set \(V\) equipped with vector addition and scalar multiplication satisfying the 8 axioms (e.g. \(\mathbb{R}^n\), polynomials \(\mathcal P_n\), continuous functions \(C([a,b])\)).`,
    },
    see: ["subspace", "span", "basis"],
    link: { chapter: "vector-spaces", tab: "theory" },
  },
  subspace: {
    group: "spaces",
    name: { tr: "Alt Uzay", en: "Subspace" },
    aka: ["alt vektör uzayı", "closure", "kapalılık"],
    def: {
      tr: R`Bir vektör uzayı \(V\)'nin sıfır vektörünü içeren, toplama ve skaler çarpma altında kapalı alt kümesi \(W\). \(\mathbb{R}^3\)'te orijinden geçen doğrular ve düzlemler alt uzaydır.`,
      en: R`A subset \(W \subseteq V\) containing \(\mathbf 0\) and closed under addition and scalar multiplication. In \(\mathbb{R}^3\), lines and planes through the origin are subspaces.`,
    },
    link: { chapter: "vector-spaces", tab: "theory" },
  },
  span: {
    group: "spaces",
    name: { tr: "Germe (Span)", en: "Span" },
    aka: ["doğrusal bileşim", "linear combination"],
    def: {
      tr: R`\(\{\mathbf v_1,\dots,\mathbf v_k\}\) vektörlerinin tüm doğrusal bileşimlerinin kümesi: \(\operatorname{span}\{\mathbf v_i\} = \{c_1\mathbf v_1 + \dots + c_k\mathbf v_k\}\).`,
      en: R`The set of all linear combinations \(c_1\mathbf v_1 + \dots + c_k\mathbf v_k\) of a collection of vectors — the smallest subspace containing them.`,
    },
    see: ["linear-independence", "basis"],
    link: { chapter: "vector-spaces", tab: "theory" },
  },
  "linear-independence": {
    group: "spaces",
    name: { tr: "Doğrusal Bağımsızlık", en: "Linear independence" },
    aka: ["bağımlı", "independent", "dependent"],
    def: {
      tr: R`\(c_1\mathbf v_1 + \dots + c_k\mathbf v_k = \mathbf 0\) denkleminin tek çözümü \(c_1=\dots=c_k=0\) ise vektörler doğrusal bağımsızdır: hiçbiri diğerlerinin bileşimi değildir.`,
      en: R`Vectors are linearly independent if \(c_1\mathbf v_1 + \dots + c_k\mathbf v_k = \mathbf 0\) implies all \(c_i = 0\): no vector is redundant.`,
    },
    link: { chapter: "vector-spaces", tab: "theory" },
  },
  basis: {
    group: "spaces",
    name: { tr: "Taban & Boyut", en: "Basis & Dimension" },
    aka: ["dimension", "boyut", "coordinates", "koordinat"],
    def: {
      tr: R`Uzayı hem [[span|geren]] hem de [[linear-independence|doğrusal bağımsız]] vektör kümesi <b>taban</b>dır. Tabandaki vektör sayısı uzayın <b>boyut</b>udur (\(\dim V\)) ve her vektörün tabana göre koordinatları tektir.`,
      en: R`A linearly independent set that spans \(V\) is a <b>basis</b>. Its size is the <b>dimension</b> \(\dim V\), and every vector has unique coordinates in that basis.`,
    },
    link: { chapter: "basis-dimension", tab: "theory" },
  },
  "inner-product": {
    group: "spaces",
    name: { tr: "İç Çarpım", en: "Inner product" },
    aka: ["hilbert", "euclidean", "integral inner product"],
    def: {
      tr: R`Nokta çarpımın herhangi bir vektör uzayına genellemesi: simetrik, doğrusal ve pozitif tanımlı \(\langle u, v \rangle\) işlemi. Fonksiyonlarda \(\langle f,g\rangle = \int_a^b f(x)g(x)\,dx\).`,
      en: R`Generalization of the dot product to any vector space: symmetric, bilinear, positive-definite \(\langle u, v\rangle\). For functions, \(\langle f,g\rangle = \int_a^b f(x)g(x)\,dx\).`,
    },
    see: ["orthogonality", "projection", "gram-schmidt"],
    link: { chapter: "inner-product", tab: "theory" },
  },
  orthogonality: {
    group: "spaces",
    name: { tr: "Ortogonallik (Dik)", en: "Orthogonality" },
    aka: ["orthonormal", "ortonormal", "dik"],
    def: {
      tr: R`\(\langle u, v \rangle = 0\) sağlayan vektörler ortogonaldir. Hem ikişer ikişer dik hem birim uzunluklu tabana <b>ortonormal taban</b> denir.`,
      en: R`Vectors with \(\langle u, v\rangle = 0\) are orthogonal. A basis of mutually orthogonal unit vectors is <b>orthonormal</b>.`,
    },
    link: { chapter: "inner-product", tab: "theory" },
  },
  projection: {
    group: "spaces",
    name: { tr: "Dik İzdüşüm & En İyi Yaklaşım", en: "Orthogonal projection & Best approximation" },
    aka: ["least squares", "en küçük kareler", "normal equations"],
    def: {
      tr: R`Bir \(\mathbf y\) vektörüne bir \(W\) alt uzayındaki en yakın nokta \(\hat{\mathbf y} = \operatorname{proj}_W(\mathbf y)\)'dir; hata vektörü \(\mathbf y - \hat{\mathbf y}\) tüm \(W\)'ye diktir. En küçük karelerde normal denklemleri \(A^T A \hat{\mathbf c} = A^T \mathbf y\) verir.`,
      en: R`The closest point in subspace \(W\) to \(\mathbf y\) is \(\hat{\mathbf y} = \operatorname{proj}_W(\mathbf y)\), with residual \(\mathbf y - \hat{\mathbf y} \perp W\). In least squares this yields the normal equations \(A^T A \hat{\mathbf c} = A^T \mathbf y\).`,
    },
    link: { chapter: "inner-product", tab: "theory" },
  },
  "gram-schmidt": {
    group: "spaces",
    name: { tr: "Gram–Schmidt Süreci", en: "Gram–Schmidt process" },
    aka: ["orthogonalization", "dikleştirme"],
    def: {
      tr: R`Herhangi bir doğrusal bağımsız tabandan, önceki yönlerin izdüşümlerini çıkarıp normalize ederek ortonormal taban üreten algoritma.`,
      en: R`Algorithm turning any linearly independent basis into an orthonormal basis by subtracting projections onto previous vectors and normalizing.`,
    },
    link: { chapter: "inner-product", tab: "theory" },
  },

  // ---- Calculus: Limits & Derivatives ----
  limit: {
    group: "calculus",
    name: { tr: "Limit (ε–δ Tanımı)", en: "Limit (ε–δ definition)" },
    aka: ["epsilon", "delta", "yakınsama", "asymptote"],
    def: {
      tr: R`Her \(\varepsilon > 0\) için öyle bir \(\delta > 0\) vardır ki \(0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon\). Noktadaki değer değil, civardaki davranış önemlidir.`,
      en: R`For every \(\varepsilon > 0\) there exists \(\delta > 0\) such that \(0 < |x-a| < \delta \Rightarrow |f(x)-L| < \varepsilon\). Only behavior near \(a\) matters.`,
    },
    see: ["continuity", "derivative"],
    link: { chapter: "limits", tab: "theory" },
  },
  continuity: {
    group: "calculus",
    name: { tr: "Süreklilik", en: "Continuity" },
    aka: ["continuous", "ivt", "ara değer"],
    def: {
      tr: R`\(\lim_{x\to a} f(x) = f(a)\) ise \(f\) fonksiyonu \(a\)'da süreklidir. Kapalı aralıkta sürekli fonksiyonlar Ara Değer Teoremi (IVT) ile tüm ara değerleri alır.`,
      en: R`\(f\) is continuous at \(a\) iff \(\lim_{x\to a} f(x) = f(a)\). On \([a,b]\), continuous functions attain every intermediate value (IVT).`,
    },
    link: { chapter: "limits", tab: "theory" },
  },
  derivative: {
    group: "calculus",
    name: { tr: "Türev", en: "Derivative" },
    aka: ["tangent", "teğet", "slope", "eğim", "hız"],
    def: {
      tr: R`Anlık değişim hızı ve teğet doğrunun eğimi: \(f'(a) = \lim_{h\to 0}\frac{f(a+h)-f(a)}{h}\). En iyi doğrusal yaklaşımı verir: \(f(x) \approx f(a) + f'(a)(x-a)\).`,
      en: R`Instantaneous rate of change and slope of the tangent line: \(f'(a) = \lim_{h\to 0}\frac{f(a+h)-f(a)}{h}\), giving the best linear approximation.`,
    },
    see: ["mvt", "lhopital", "antiderivative"],
    link: { chapter: "derivatives", tab: "theory" },
  },
  mvt: {
    group: "calculus",
    name: { tr: "Ortalama Değer Teoremi (MVT)", en: "Mean Value Theorem (MVT)" },
    aka: ["lagrange", "rolle"],
    def: {
      tr: R`\([a,b]\)'de sürekli ve \((a,b)\)'de türevlenebilir \(f\) için \(f'(c) = \frac{f(b)-f(a)}{b-a}\) sağlayan en az bir \(c \in (a,b)\) vardır: teğet kirişe paraleldir.`,
      en: R`If \(f\) is continuous on \([a,b]\) and differentiable on \((a,b)\), some \(c \in (a,b)\) has \(f'(c) = \frac{f(b)-f(a)}{b-a}\): tangent parallel to secant.`,
    },
    link: { chapter: "derivatives", tab: "theory" },
  },
  lhopital: {
    group: "calculus",
    name: { tr: "L'Hôpital Kuralı", en: "L'Hôpital's Rule" },
    aka: ["belirsizlik", "indeterminate", "0/0"],
    def: {
      tr: R`\(0/0\) veya \(\infty/\infty\) belirsizliklerinde, sağdaki limit varsa \(\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}\).`,
      en: R`For \(0/0\) or \(\infty/\infty\) indeterminate forms, \(\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}\) whenever the right-hand limit exists.`,
    },
    link: { chapter: "derivatives", tab: "math" },
  },

  // ---- Series & Integrals ----
  series: {
    group: "series-int",
    name: { tr: "Sayı Serisi", en: "Infinite series" },
    aka: ["partial sum", "kısmi toplam", "harmonic", "geometric"],
    def: {
      tr: R`Bir \((a_n)\) dizisinin kısmi toplamları \(S_N = \sum_{n=1}^N a_n\)'in limiti: \(\sum_{n=1}^\infty a_n = \lim_{N\to\infty} S_N\). Yakınsaklık için \(a_n \to 0\) gereklidir ama yeterli değildir.`,
      en: R`The limit of partial sums \(S_N = \sum_{n=1}^N a_n\). While \(a_n \to 0\) is necessary for convergence, it is not sufficient (e.g. harmonic series \(\sum 1/n\)).`,
    },
    see: ["power-series", "taylor-series"],
    link: { chapter: "sequences-series", tab: "theory" },
  },
  "uniform-convergence": {
    group: "series-int",
    name: { tr: "Düzgün Yakınsaklık", en: "Uniform convergence" },
    aka: ["weierstrass", "pointwise", "noktasal"],
    def: {
      tr: R`\(\sup_{x\in I}|f_n(x)-f(x)| \to 0\): tüm \(I\) aralığında aynı \(N(\varepsilon)\) işe yarar. Sürekliliği ve integralin/türevin limitle yer değiştirmesini korur.`,
      en: R`\(\sup_{x\in I}|f_n(x)-f(x)| \to 0\): one \(N(\varepsilon)\) works simultaneously for all \(x\in I\). Preserves continuity and allows passing limits inside integrals.`,
    },
    link: { chapter: "function-series", tab: "theory" },
  },
  "power-series": {
    group: "series-int",
    name: { tr: "Kuvvet Serisi & Yakınsaklık Yarıçapı", en: "Power series & Radius of convergence" },
    aka: ["radius", "yarıçap", "R"],
    def: {
      tr: R`\(\sum_{n=0}^\infty c_n (x-a)^n\) biçimindeki seri. \(|x-a| < R\) için mutlak yakınsar, \(|x-a| > R\) için ıraksar; \(R\) yakınsaklık yarıçapıdır.`,
      en: R`A series \(\sum_{n=0}^\infty c_n(x-a)^n\) converging absolutely for \(|x-a| < R\) and diverging for \(|x-a| > R\), where \(R\) is the radius of convergence.`,
    },
    see: ["taylor-series"],
    link: { chapter: "function-series", tab: "theory" },
  },
  "taylor-series": {
    group: "series-int",
    name: { tr: "Taylor & Maclaurin Serisi", en: "Taylor & Maclaurin series" },
    aka: ["maclaurin", "lagrange remainder", "polinom yaklaşımı"],
    def: {
      tr: R`Bir fonksiyonun \(a\) noktası civarındaki polinom açılımı: \(\sum_{n=0}^\infty \frac{f^{(n)}(a)}{n!}(x-a)^n\). \(a=0\) özel hâline Maclaurin serisi denir.`,
      en: R`Polynomial expansion of a smooth function around \(a\): \(\sum_{n=0}^\infty \frac{f^{(n)}(a)}{n!}(x-a)^n\) (Maclaurin series when \(a=0\)).`,
    },
    link: { chapter: "function-series", tab: "theory" },
  },
  antiderivative: {
    group: "series-int",
    name: { tr: "Belirsiz İntegral (İlkel Fonksiyon)", en: "Antiderivative (Indefinite integral)" },
    aka: ["primitive", "ilkel", "F(x)+C"],
    def: {
      tr: R`\(F'(x) = f(x)\) sağlayan tüm fonksiyonlar ailesi: \(\int f(x)\,dx = F(x) + C\). İki ilkel fonksiyon bir aralıkta yalnızca bir sabit kadar farklıdır.`,
      en: R`The family \(\int f(x)\,dx = F(x) + C\) of all functions whose derivative is \(f(x)\). Any two antiderivatives on an interval differ by a constant.`,
    },
    see: ["ftc", "riemann-sum"],
    link: { chapter: "indefinite-integrals", tab: "theory" },
  },
  "riemann-sum": {
    group: "series-int",
    name: { tr: "Riemann Toplamı & Belirli İntegral", en: "Riemann sum & Definite integral" },
    aka: ["darboux", "area", "alan"],
    def: {
      tr: R`Aralığı küçük parçalara bölüp dikdörtgen alanlarını toplama: \(\int_a^b f(x)\,dx = \lim_{\|P\|\to 0}\sum f(x_i^*)\Delta x_i\). Eğrinin altındaki <b>işaretli alanı</b> verir.`,
      en: R`Limit of approximating rectangle sums \(\sum f(x_i^*)\Delta x_i\) as partition width goes to 0, measuring the <b>signed area</b> under \(f\) on \([a,b]\).`,
    },
    see: ["ftc"],
    link: { chapter: "definite-integrals", tab: "theory" },
  },
  ftc: {
    group: "series-int",
    name: { tr: "Kalkülüsün Temel Teoremi (FTC)", en: "Fundamental Theorem of Calculus" },
    aka: ["newton-leibniz", "temel teorem"],
    def: {
      tr: R`Türev ile integrali birbirine bağlar: (1) \(\frac{d}{dx}\int_a^x f(t)\,dt = f(x)\) ve (2) \(\int_a^b f(x)\,dx = F(b) - F(a)\).`,
      en: R`Connects differentiation and integration: (1) \(\frac{d}{dx}\int_a^x f(t)\,dt = f(x)\), and (2) \(\int_a^b f(x)\,dx = F(b) - F(a)\).`,
    },
    link: { chapter: "definite-integrals", tab: "theory" },
  },
  "improper-integral": {
    group: "series-int",
    name: { tr: "Genelleştirilmiş İntegral", en: "Improper integral" },
    aka: ["sonsuz aralık", "unbounded"],
    def: {
      tr: R`Sınırlarından biri \(\pm\infty\) olan veya fonksiyonun sonsuza gittiği bir noktayı içeren belirli integral; bir limit olarak tanımlanır: \(\int_a^\infty f = \lim_{b\to\infty}\int_a^b f\).`,
      en: R`A definite integral over an infinite interval or across a vertical asymptote, defined via a limit such as \(\int_a^\infty f(x)\,dx = \lim_{b\to\infty}\int_a^b f(x)\,dx\).`,
    },
    link: { chapter: "definite-integrals", tab: "theory" },
  },
  "solid-of-revolution": {
    group: "series-int",
    name: { tr: "Dönel Cisim Hacmi", en: "Solid of revolution" },
    aka: ["disk", "washer", "shell", "hacim"],
    def: {
      tr: R`\(y=f(x)\) eğrisinin bir eksen etrafında döndürülmesiyle oluşan cismin hacmi. Disk yöntemiyle \(V = \pi \int_a^b [f(x)]^2\,dx\).`,
      en: R`Volume formed by rotating \(y=f(x)\) around an axis; by the disk method, \(V = \pi \int_a^b [f(x)]^2\,dx\).`,
    },
    link: { chapter: "integral-apps", tab: "theory" },
  },

  // ---- Complex Numbers ----
  "complex-number": {
    group: "complex",
    name: { tr: "Karmaşık Sayı", en: "Complex number" },
    aka: ["argand", "imaginary", "sanal", "i"],
    def: {
      tr: R`\(i^2 = -1\) olmak üzere \(z = a + bi\) (\(a,b\in\mathbb{R}\)) biçimindeki sayı. Karmaşık düzlemde (Argand düzlemi) \((a,b)\) noktası olarak gösterilir.`,
      en: R`A number \(z = a + bi\) with \(a,b\in\mathbb{R}\) and \(i^2=-1\), plotted as \((a,b)\) on the complex (Argand) plane.`,
    },
    see: ["euler-formula", "modulus-arg"],
    link: { chapter: "complex-numbers", tab: "theory" },
  },
  "modulus-arg": {
    group: "complex",
    name: { tr: "Modül, Argüman & Eşlenik", en: "Modulus, Argument & Conjugate" },
    aka: ["polar", "kutupsal", "conjugate", "eşlenik"],
    def: {
      tr: R`\(z = a+bi\) için eşlenik \(\bar z = a-bi\), modül \(r = |z| = \sqrt{a^2+b^2}\) (orijine uzaklık), argüman \(\theta = \arg z\) (pozitif reel eksenle açı). Çarpmada modüller çarpılır, argümanlar toplanır.`,
      en: R`For \(z=a+bi\): conjugate \(\bar z = a-bi\), modulus \(r=|z|=\sqrt{a^2+b^2}\), argument \(\theta=\arg z\). Multiplying complex numbers multiplies moduli and adds arguments.`,
    },
    link: { chapter: "complex-numbers", tab: "theory" },
  },
  "euler-formula": {
    group: "complex",
    name: { tr: "Euler Formülü & De Moivre", en: "Euler's formula & De Moivre" },
    aka: ["e^{i theta}", "de moivre", "roots of unity"],
    def: {
      tr: R`\(e^{i\theta} = \cos\theta + i\sin\theta\). Buradan \(z = re^{i\theta}\) kutupsal formu, De Moivre formülü \(z^n = r^n e^{in\theta}\) ve \(e^{i\pi} + 1 = 0\) özdeşliği doğar.`,
      en: R`\(e^{i\theta} = \cos\theta + i\sin\theta\), yielding polar form \(z=re^{i\theta}\), De Moivre's law \(z^n=r^n e^{in\theta}\), and \(e^{i\pi}+1=0\).`,
    },
    link: { chapter: "complex-numbers", tab: "theory" },
  },

  // ---- Extended Beginner-Friendly Glossary Entries ----
  "domain-range": {
    group: "foundations",
    name: { tr: "Tanım ve Görüntü Kümesi", en: "Domain & Range" },
    aka: ["domain", "range", "codomain", "tanım", "görüntü"],
    def: {
      tr: R`<b>Tanım kümesi</b> makineye verebileceğiniz geçerli girdilerin tamamıdır (örneğin \(\sqrt{x}\) için \(x \ge 0\), \(1/x\) için \(x \ne 0\)). <b>Görüntü kümesi</b> ise makinenin gerçekten üretebildiği tüm çıktıların kümesidir.`,
      en: R`The <b>domain</b> is the set of all valid inputs you can feed into a function (e.g. \(x \ge 0\) for \(\sqrt{x}\), \(x \ne 0\) for \(1/x\)). The <b>range</b> is the set of all actual outputs it produces.`,
    },
    see: ["function", "injective"],
    link: { chapter: "functions", tab: "theory" },
  },
  composition: {
    group: "foundations",
    name: { tr: "Bileşke Fonksiyon", en: "Function composition" },
    aka: ["f(g(x))", "f∘g", "zincir"],
    def: {
      tr: R`İki fonksiyonu arka arkaya bağlamaktır: \((f \circ g)(x) = f(g(x))\). Önce içteki \(g\) çalışır, onun çıktısı dıştaki \(f\)'ye girdi olur. Sıra önemlidir: genelde \(f(g(x)) \ne g(f(x))\).`,
      en: R`Chaining two functions back-to-back: \((f \circ g)(x) = f(g(x))\). The inner function \(g\) runs first, and its output feeds into \(f\). Order matters: usually \(f(g(x)) \ne g(f(x))\).`,
    },
    see: ["function", "inverse-fn", "chain-rule"],
    link: { chapter: "functions", tab: "play" },
  },
  "linear-combination": {
    group: "spaces",
    name: { tr: "Doğrusal Bileşim", en: "Linear combination" },
    aka: ["combination", "kombinasyon", "c1 v1 + c2 v2"],
    def: {
      tr: R`Vektörleri sayılarla çarpıp toplamak: \(c_1\mathbf v_1 + c_2\mathbf v_2 + \dots + c_k\mathbf v_k\). Yemek tarifi gibi düşünebilirsiniz: \(c_i\) katsayıları her malzemeden kaç ölçek koyduğunuzdur.`,
      en: R`Scaling vectors by numbers and adding them: \(c_1\mathbf v_1 + c_2\mathbf v_2 + \dots + c_k\mathbf v_k\). Think of a recipe where each scalar \(c_i\) is how many scoops of ingredient \(\mathbf v_i\) you mix in.`,
    },
    see: ["span", "linear-independence", "basis"],
    link: { chapter: "vector-spaces", tab: "theory" },
  },
  "kernel-image": {
    group: "spaces",
    name: { tr: "Çekirdek (Nullspace) & Görüntü Uzayı", en: "Kernel (Nullspace) & Column Space" },
    aka: ["nullspace", "ker", "im", "column space", "sıfır uzayı"],
    def: {
      tr: R`Bir \(A\) matrisinin <b>çekirdeği</b> \(\ker(A) = \{\mathbf x : A\mathbf x = \mathbf 0\}\) (sıfıra ezilen girdiler); <b>görüntü (sütun) uzayı</b> \(\operatorname{Col}(A) = \{A\mathbf x\}\) (ulaşılabilen tüm çıktılar).`,
      en: R`The <b>kernel (nullspace)</b> \(\ker(A)=\{\mathbf x : A\mathbf x=\mathbf 0\}\) holds all inputs squashed to zero; the <b>column space</b> \(\operatorname{Col}(A)=\{A\mathbf x\}\) holds all reachable outputs.`,
    },
    see: ["rank", "rank-nullity", "subspace"],
    link: [{ chapter: "linear-systems", tab: "math" }, { chapter: "basis-dimension", tab: "theory" }],
  },
  "rank-nullity": {
    group: "spaces",
    name: { tr: "Rank–Nullity (Boyut) Teoremi", en: "Rank–Nullity Theorem" },
    aka: ["boyut teoremi", "nullity", "serbest değişken"],
    def: {
      tr: R`\(m\times n\) bir \(A\) matrisi için \(\operatorname{rank}(A) + \dim(\ker A) = n\). Yani her girdi sütunu ya çıktıya yeni bir boyut katar (pivot) ya da çekirdekte serbest değişken olur — ikisinin toplamı daima sütun sayısı \(n\)'dir.`,
      en: R`For an \(m\times n\) matrix \(A\), \(\operatorname{rank}(A) + \dim(\ker A) = n\). Every input column either creates an output dimension (pivot) or becomes a free variable in the kernel.`,
    },
    see: ["rank", "kernel-image", "basis"],
    link: { chapter: "basis-dimension", tab: "math" },
  },
  "linear-map": {
    group: "matrices",
    name: { tr: "Doğrusal Dönüşüm", en: "Linear transformation" },
    aka: ["linear transformation", "dönüşüm", "T(x)=Ax"],
    def: {
      tr: R`Orijini sabit tutan ve ızgara çizgilerini bükmeden paralel/eşit aralıklı bırakan dönüşüm: \(T(\mathbf u+\mathbf v)=T(\mathbf u)+T(\mathbf v)\) ve \(T(c\mathbf u)=cT(\mathbf u)\). Sonlu boyutta her doğrusal dönüşüm bir [[matrix|matris]] çarpımıdır.`,
      en: R`A map keeping the origin fixed and grid lines straight, parallel, and evenly spaced: \(T(\mathbf u+\mathbf v)=T(\mathbf u)+T(\mathbf v)\) and \(T(c\mathbf u)=cT(\mathbf u)\). In finite dimensions every linear map is a [[matrix|matrix]].`,
    },
    see: ["matrix", "determinant"],
    link: { chapter: "matrices", tab: "theory" },
  },
  asymptote: {
    group: "calculus",
    name: { tr: "Asimptot", en: "Asymptote" },
    aka: ["dikey asimptot", "yatay asimptot", "vertical", "horizontal"],
    def: {
      tr: R`Grafiğin sonsuza doğru giderek yapıştığı ama değmek zorunda olmadığı kılavuz doğru. Payda sıfırlandığında <b>dikey asimptot</b> (\(x=a\)), \(x\to\pm\infty\) iken fonksiyon bir \(L\) sayısına yaklaşıyorsa <b>yatay asimptot</b> (\(y=L\)) oluşur.`,
      en: R`A guide line a curve hugs ever closer toward infinity. Blowing up at \(x=a\) gives a <b>vertical asymptote</b>; settling to \(L\) as \(x\to\pm\infty\) gives a <b>horizontal asymptote</b> \(y=L\).`,
    },
    see: ["limit", "continuity"],
    link: { chapter: "limits", tab: "theory" },
  },
  "squeeze-theorem": {
    group: "calculus",
    name: { tr: "Sandviç (Sıkıştırma) Teoremi", en: "Squeeze (Sandwich) Theorem" },
    aka: ["sandviç", "sıkıştırma", "sandwich"],
    def: {
      tr: R`Eğer \(g(x) \le f(x) \le h(x)\) ve hem alt sınır \(g\) hem üst sınır \(h\) aynı \(L\) limitine gidiyorsa, arada sıkışan \(f(x)\) de mecburen \(L\)'ye gider. \(\lim_{x\to 0} x^2\sin(1/x)=0\) bunun klasik örneğidir.`,
      en: R`If \(g(x) \le f(x) \le h(x)\) and both outer functions converge to \(L\), the trapped function \(f(x)\) must converge to \(L\) too — e.g. \(\lim_{x\to 0} x^2\sin(1/x)=0\).`,
    },
    see: ["limit"],
    link: { chapter: "limits", tab: "theory" },
  },
  "chain-rule": {
    group: "calculus",
    name: { tr: "Zincir Kuralı", en: "Chain rule" },
    aka: ["bileşke türevi", "dışın türevi çarpı için türevi"],
    def: {
      tr: R`İç içe geçmiş fonksiyonların türevi: \(\frac{d}{dx}f(g(x)) = f'(g(x))\cdot g'(x)\). Dişli çarklar gibi düşünün: büyük çarkın hızı, küçük çarkın hızlarının çarpımıdır.`,
      en: R`Derivative of nested functions: \(\frac{d}{dx}f(g(x)) = f'(g(x))\cdot g'(x)\). Like interlocking gears, rates of change multiply along the chain.`,
    },
    see: ["derivative", "composition", "u-substitution"],
    link: { chapter: "derivatives", tab: "theory" },
  },
  "critical-point": {
    group: "calculus",
    name: { tr: "Kritik Nokta & Ekstremum", en: "Critical point & Extremum" },
    aka: ["maksimum", "minimum", "maximum", "minimum", "tepe", "çukur"],
    def: {
      tr: R`\(f'(c)=0\) (teğet yatay) veya \(f'(c)\) tanımsız olan nokta. Yerel tepe (maksimum) ve çukurlar (minimum) yalnızca kritik noktalarda veya aralık uçlarında ortaya çıkabilir.`,
      en: R`A point where \(f'(c)=0\) (horizontal tangent) or \(f'(c)\) does not exist. Local peaks and valleys can only occur at critical points or endpoints.`,
    },
    see: ["derivative", "inflection-point"],
    link: { chapter: "derivatives", tab: "theory" },
  },
  "inflection-point": {
    group: "calculus",
    name: { tr: "Büküm Noktası & Konkavlık", en: "Inflection point & Concavity" },
    aka: ["konveks", "konkav", "second derivative", "ikinci türev"],
    def: {
      tr: R`\(f''(x) > 0\) iken grafik yukarı bakar (gülen yüz, konveks); \(f''(x) < 0\) iken aşağı bakar (konkav). Eğriliğin işaret değiştirdiği noktaya <b>büküm noktası</b> denir.`,
      en: R`Where \(f''(x) > 0\) the curve bends upward (cup / convex); where \(f''(x) < 0\) it bends downward (cap / concave). A point where concavity flips is an <b>inflection point</b>.`,
    },
    see: ["derivative", "critical-point"],
    link: { chapter: "derivatives", tab: "math" },
  },
  "geometric-series": {
    group: "series-int",
    name: { tr: "Geometrik Seri", en: "Geometric series" },
    aka: ["ortak oran", "common ratio", "a/(1-r)"],
    def: {
      tr: R`Her terimin bir öncekinin sabit \(r\) katı olduğu seri: \(\sum_{n=0}^\infty a r^n\). Yalnızca \(|r| < 1\) iken yakınsar ve tam toplamı \(\frac{a}{1-r}\) olur.`,
      en: R`A series where each term is \(r\) times the previous: \(\sum_{n=0}^\infty a r^n\). Converges if and only if \(|r| < 1\), with exact sum \(\frac{a}{1-r}\).`,
    },
    see: ["series", "p-series"],
    link: { chapter: "sequences-series", tab: "theory" },
  },
  "p-series": {
    group: "series-int",
    name: { tr: "p-Serisi & Harmonik Seri", en: "p-series & Harmonic series" },
    aka: ["harmonic", "harmonik", "1/n^p"],
    def: {
      tr: R`\(\sum_{n=1}^\infty \frac{1}{n^p}\) serisi \(p > 1\) ise yakınsar, \(p \le 1\) ise ıraksar. \(p=1\) özel hâli olan <b>harmonik seri</b> \(\sum \frac{1}{n}\) terimleri sıfıra gitmesine rağmen sonsuza büyür!`,
      en: R`\(\sum_{n=1}^\infty \frac{1}{n^p}\) converges iff \(p > 1\) and diverges for \(p \le 1\). The borderline case \(p=1\) is the <b>harmonic series</b> \(\sum 1/n\), which diverges even though \(1/n \to 0\).`,
    },
    see: ["series", "geometric-series"],
    link: { chapter: "sequences-series", tab: "theory" },
  },
  "u-substitution": {
    group: "series-int",
    name: { tr: "Değişken Değiştirme (u-Dönüşümü)", en: "u-Substitution" },
    aka: ["substitution", "zincir kuralının tersi"],
    def: {
      tr: R`[[chain-rule|Zincir kuralının]] integraldeki tersidir: içteki ifadeye \(u=g(x)\) deyip \(du=g'(x)\,dx\) yazınca karmaşık integral basit bir \(\int f(u)\,du\) integraline dönüşür.`,
      en: R`The reverse of the [[chain-rule|chain rule]]: setting \(u=g(x)\) and \(du=g'(x)\,dx\) collapses a complicated integral into a simple \(\int f(u)\,du\).`,
    },
    see: ["antiderivative", "chain-rule", "integration-by-parts"],
    link: { chapter: "indefinite-integrals", tab: "theory" },
  },
  "integration-by-parts": {
    group: "series-int",
    name: { tr: "Kısmi İntegrasyon", en: "Integration by parts" },
    aka: ["by parts", "LIATE", "LAPTU", "u dv"],
    def: {
      tr: R`Çarpımın türevi kuralının tersi: \(\int u\,dv = uv - \int v\,du\). Türev alınca sadeleşen parçayı \(u\) seçmek (örneğin \(\ln x\) veya \(x^n\)) integrali kolaylaştırır.`,
      en: R`The reverse of the product rule: \(\int u\,dv = uv - \int v\,du\). Pick \(u\) to be the factor that simplifies when differentiated (e.g. \(\ln x\) or \(x^n\)).`,
    },
    see: ["antiderivative", "u-substitution"],
    link: { chapter: "indefinite-integrals", tab: "theory" },
  },
  "arc-length": {
    group: "series-int",
    name: { tr: "Yay Uzunluğu", en: "Arc length" },
    aka: ["eğri uzunluğu", "curve length", "pisagor"],
    def: {
      tr: R`Bir eğriyi minik düz parçalara bölüp Pisagor teoremiyle \(ds = \sqrt{1 + (f'(x))^2}\,dx\) toplamak: \(L = \int_a^b \sqrt{1 + (f'(x))^2}\,dx\).`,
      en: R`Slicing a curve into tiny straight segments via Pythagoras \(ds = \sqrt{1+(f'(x))^2}\,dx\) and summing: \(L = \int_a^b \sqrt{1+(f'(x))^2}\,dx\).`,
    },
    see: ["solid-of-revolution", "riemann-sum"],
    link: { chapter: "integral-apps", tab: "theory" },
  },
  "roots-of-unity": {
    group: "complex",
    name: { tr: "n. Dereceden Kökler & Birim Kökleri", en: "nth Roots & Roots of Unity" },
    aka: ["n-inci kök", "düzgün çokgen", "polygon"],
    def: {
      tr: R`\(z^n = w\) denkleminin karmaşık düzlemde daima tam \(n\) tane kökü vardır. Hepsi \(|w|^{1/n}\) yarıçaplı çember üzerinde eşit \(2\pi/n\) açılarla dizilerek düzgün bir \(n\)-gen oluşturur.`,
      en: R`The equation \(z^n = w\) always has exactly \(n\) complex solutions, equally spaced by angle \(2\pi/n\) on the circle of radius \(|w|^{1/n}\), forming a regular \(n\)-gon.`,
    },
    see: ["euler-formula", "modulus-arg"],
    link: { chapter: "complex-numbers", tab: "theory" },
  },
};

export const otherLang = () => (I18N.lang === "en" ? "tr" : "en");

export function termify(html, self = null) {
  // Escape raw `<tag`-like sequences inside \( ... \) so innerHTML never parses `<e<1` as an HTML tag
  const safe = html.replace(/\\\([\s\S]*?\\\)/g, (m) => m.replace(/<(?=[a-zA-Z!/])/g, "&lt;"));
  return safe.replace(/\[\[([\w-]+)\|([^\]]+)\]\]/g, (_, key, text) =>
    GLOSSARY[key] && key !== self
      ? `<button type="button" class="gl-term" data-term="${key}">${text}</button>`
      : text,
  );
}

export function placeLabel(link) {
  const chapter = link.chapter || CHAPTER;
  const here = chapter === CHAPTER;
  const tabName = L(TAB_NAMES[link.tab] || { tr: link.tab, en: link.tab });
  const ch = chapterOf(chapter);
  const prefix = here || !ch ? "" : `${ch.short} · `;
  let name = link.section && (link.title || PLACE_TITLES[link.section]);
  name = name && L(name);
  if (!name && here && link.section) {
    name = document.querySelector(`#${link.section} h2`)?.textContent.trim();
  }
  return prefix + tabName + (name ? ` → ${name}` : "");
}

export function termPlaces(key) {
  const entry = GLOSSARY[key];
  const places = [entry.link || []].flat();
  const here = (p) => (p.chapter || CHAPTER) === CHAPTER;
  return [...places.filter(here), ...places.filter((p) => !here(p))];
}

export function relatedTerms(key) {
  const entry = GLOSSARY[key];
  const linked = L(entry.def);
  return (entry.see || []).filter((k) => GLOSSARY[k] && !linked.includes(`[[${k}|`));
}
