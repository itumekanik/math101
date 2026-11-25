import type { PracticeSection } from "../../shared/practice.ts";
import { gramSchmidt, leastSquaresPoly, simpson, vDot, vNorm, vProject } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ip-orth",
    title: { tr: "İç çarpım, dik fonksiyonlar ve ortonormal koordinatlar", en: "Inner products, orthogonal functions & orthonormal coordinates" },
    intro: {
      tr: R`Fonksiyonlarda integral iç çarpımı ve ortonormal tabanda hızlı koordinat hesabı.`,
      en: R`Function inner products via integration and fast coordinates in an orthonormal basis.`,
    },
    read: { tab: "theory", section: "ip-fn-orth" },
    questions: [
      {
        id: "ip-q1",
        kind: "choice",
        q: {
          tr: R`\([-1, 1]\) aralığında \(\langle f, g \rangle = \int_{-1}^1 f(x)g(x)\,dx\) iç çarpımına göre \(f(x) = 1\) ve \(g(x) = x\) nasıl ilişkilidir?`,
          en: R`Under \(\langle f, g \rangle = \int_{-1}^1 f(x)g(x)\,dx\) on \([-1, 1]\), how are \(f(x) = 1\) and \(g(x) = x\) related?`,
        },
        options: [
          { text: { tr: R`Ortogonaldir (birbirine diktir: \(\langle 1, x \rangle = 0\))`, en: R`Orthogonal (perpendicular: \(\langle 1, x \rangle = 0\))` } },
          {
            text: { tr: R`İç çarpımları \(2\)'dir`, en: R`Their inner product is \(2\)` },
            why: {
              tr: R`\(\int_{-1}^1 1\cdot 1\,dx = 2\)'dir; fakat burada \(1 \cdot x = x\) tek fonksiyondur ve \([-1, 1]\) üzerindeki pozitif ve negatif alanlar birbirini sıfırlar!`,
              en: R`\(\int_{-1}^1 1\,dx = 2\), whereas \(1 \cdot x = x\) is odd so its positive and negative areas on \([-1, 1]\) cancel to 0!`,
            },
          },
          {
            text: { tr: "Polinomlar için iç çarpım tanımlanamaz", en: "Inner products cannot be defined for polynomials" },
            why: {
              tr: R`İkisi de \([-1, 1]\)'de sürekli olduğundan integral iç çarpımı tamamen geçerlidir.`,
              en: R`Both are continuous on \([-1, 1]\), so the integral inner product is completely valid.`,
            },
          },
        ],
        answer: 0,
        compute: () => (Math.abs(simpson((x) => x, -1, 1, 20)) < 1e-9 ? 0 : -1),
        explain: {
          tr: R`\(\int_{-1}^1 1\cdot x\,dx = \left[\frac{x^2}{2}\right]_{-1}^1 = \frac{1}{2} - \frac{1}{2} = 0\), dolayısıyla \(1 \perp x\).`,
          en: R`\(\int_{-1}^1 x\,dx = \left[\frac{x^2}{2}\right]_{-1}^1 = \frac{1}{2} - \frac{1}{2} = 0\), so \(1\) and \(x\) are orthogonal.`,
        },
      },
      {
        id: "ip-q2",
        kind: "number",
        q: {
          tr: R`\(\{\mathbf{q}_1, \mathbf{q}_2\}\) ortonormal tabanında \(\mathbf{q}_1 = \left(\frac{3}{5}, \frac{4}{5}\right)\) ise \(\mathbf{x} = (5, 0)\)'ın \(\mathbf{q}_1\) koordinatı \(\langle \mathbf{x}, \mathbf{q}_1 \rangle\) kaçtır?`,
          en: R`With orthonormal basis vector \(\mathbf{q}_1 = \left(\frac{3}{5}, \frac{4}{5}\right)\), what is the \(\mathbf{q}_1\)-coordinate \(\langle \mathbf{x}, \mathbf{q}_1 \rangle\) of \(\mathbf{x} = (5, 0)\)?`,
        },
        label: { tr: R`\(\langle \mathbf{x}, \mathbf{q}_1 \rangle =\)`, en: R`\(\langle \mathbf{x}, \mathbf{q}_1 \rangle =\)` },
        answer: 3,
        compute: () => vDot([5, 0], [0.6, 0.8]),
        hint: {
          tr: R`Ortonormal tabanda matris tersi yok: doğrudan nokta çarpım \(5 \cdot \frac{3}{5} + 0 \cdot \frac{4}{5}\) alın!`,
          en: R`No matrix inverse needed in an orthonormal basis — just take \(\mathbf{x} \cdot \mathbf{q}_1 = 5\cdot\frac{3}{5} + 0\cdot\frac{4}{5}\)!`,
        },
        explain: {
          tr: R`\(\mathbf{q}_1\) birim vektör olduğu için koordinat doğrudan \(5 \cdot 0{,}6 + 0 \cdot 0{,}8 = 3\) olur.`,
          en: R`Since \(\mathbf{q}_1\) is a unit vector, the coordinate is directly \(5 \cdot 0.6 + 0 \cdot 0.8 = 3\).`,
        },
      },
    ],
  },
  {
    id: "px-ip-proj-gs",
    title: { tr: "Dik izdüşüm ve Gram–Schmidt süreci", en: "Orthogonal projection & Gram–Schmidt process" },
    intro: {
      tr: R`Gölge düşürme formülü, paydadaki \(\|\mathbf{u}\|^2\) kontrolü ve dikleştirme.`,
      en: R`Projection shadows, the \(\|\mathbf{u}\|^2\) denominator check, and Gram–Schmidt steps.`,
    },
    read: { tab: "theory", section: "ip-proj" },
    questions: [
      {
        id: "ip-q3",
        kind: "number",
        q: {
          tr: R`\(\mathbf{y} = (3, 4)\) vektörünün \(\mathbf{u} = (2, 1)\) üzerine dik izdüşümü \(\hat{\mathbf{y}} = \operatorname{proj}_{\mathbf{u}}(\mathbf{y})\)'nin birinci bileşeni (\(x\)-koordinatı) kaçtır?`,
          en: R`What is the first coordinate (\(x\)-component) of the orthogonal projection \(\hat{\mathbf{y}} = \operatorname{proj}_{\mathbf{u}}(\mathbf{y})\) of \(\mathbf{y} = (3, 4)\) onto \(\mathbf{u} = (2, 1)\)?`,
        },
        label: { tr: R`\(\hat{y}_1 =\)`, en: R`\(\hat{y}_1 =\)` },
        answer: 4,
        compute: () => vProject([3, 4], [2, 1])[0]!,
        hint: {
          tr: R`\(\frac{\mathbf{y}\cdot\mathbf{u}}{\|\mathbf{u}\|^2}\,\mathbf{u}\) formülünde pay \(= 3(2)+4(1) = 10\), payda \(= 2^2 + 1^2 = 5\).`,
          en: R`In \(\frac{\mathbf{y}\cdot\mathbf{u}}{\|\mathbf{u}\|^2}\,\mathbf{u}\), numerator \(= 3(2)+4(1) = 10\) and denominator \(= 2^2+1^2 = 5\).`,
        },
        explain: {
          tr: R`\(\hat{\mathbf{y}} = \frac{10}{5}(2, 1) = (4, 2)\), dolayısıyla birinci bileşen \(4\)'tür.`,
          en: R`\(\hat{\mathbf{y}} = \frac{10}{5}(2, 1) = (4, 2)\), so the first coordinate is \(4\).`,
        },
      },
      {
        id: "ip-q4",
        kind: "number",
        q: {
          tr: R`\(\mathbf{v}_1 = (1, 0)\) ve \(\mathbf{v}_2 = (3, 4)\) üzerine Gram–Schmidt uygulandığında oluşan ortogonal vektör \(\mathbf{u}_2 = \mathbf{v}_2 - \operatorname{proj}_{\mathbf{v}_1}\mathbf{v}_2\)'nin normu kaçtır?`,
          en: R`Applying Gram–Schmidt to \(\mathbf{v}_1 = (1, 0)\) and \(\mathbf{v}_2 = (3, 4)\), what is the norm of \(\mathbf{u}_2 = \mathbf{v}_2 - \operatorname{proj}_{\mathbf{v}_1}\mathbf{v}_2\)?`,
        },
        label: { tr: R`\(\|\mathbf{u}_2\| =\)`, en: R`\(\|\mathbf{u}_2\| =\)` },
        answer: 4,
        compute: () => vNorm(gramSchmidt([[1, 0], [3, 4]]).orthogonal[1]!),
        hint: {
          tr: R`\(\mathbf{v}_2\)'nin \(\mathbf{v}_1 = (1, 0)\) üzerindeki gölgesi \((3, 0)\)'dır; bunu \((3, 4)\)'ten çıkarınca ne kalır?`,
          en: R`The shadow of \(\mathbf{v}_2\) along \((1, 0)\) is \((3, 0)\); subtract that from \((3, 4)\).`,
        },
        explain: {
          tr: R`\(\mathbf{u}_2 = (3, 4) - (3, 0) = (0, 4)\), dolayısıyla \(\|\mathbf{u}_2\| = 4\).`,
          en: R`\(\mathbf{u}_2 = (3, 4) - (3, 0) = (0, 4)\), so \(\|\mathbf{u}_2\| = 4\).`,
        },
      },
      {
        id: "ip-q5",
        kind: "choice",
        q: {
          tr: R`Bir öğrenci \(\mathbf{v}_1 = (2, 0)\) ve \(\mathbf{v}_2 = (3, 4)\) için Gram–Schmidt yaparken \(\mathbf{u}_2 = \mathbf{v}_2 - (\mathbf{v}_2 \cdot \mathbf{v}_1)\mathbf{v}_1 = (3, 4) - 6(2, 0) = (-9, 4)\) buluyor ama \(\mathbf{u}_2 \cdot \mathbf{v}_1 = -18 \ne 0\) çıkıyor! Öğrenci nerede hata yaptı?`,
          en: R`Applying Gram–Schmidt to \(\mathbf{v}_1 = (2, 0)\) and \(\mathbf{v}_2 = (3, 4)\), a student computes \(\mathbf{u}_2 = \mathbf{v}_2 - (\mathbf{v}_2 \cdot \mathbf{v}_1)\mathbf{v}_1 = (3, 4) - 6(2, 0) = (-9, 4)\), yet \(\mathbf{u}_2 \cdot \mathbf{v}_1 = -18 \ne 0\)! What went wrong?`,
        },
        options: [
          {
            text: { tr: R`\(\mathbf{v}_1\) ve \(\mathbf{v}_2\) doğrusal bağımlıdır`, en: R`\(\mathbf{v}_1\) and \(\mathbf{v}_2\) are linearly dependent` },
            why: {
              tr: R`\((2, 0)\) ve \((3, 4)\) birbirinin katı değildir (\(\det = 8 \ne 0\)), gayet bağımsızlar!`,
              en: R`\((2, 0)\) and \((3, 4)\) are completely independent (\(\det = 8 \ne 0\))!`,
            },
          },
          {
            text: { tr: R`\(\mathbf{v}_1\) birim vektör olmadığı (\(\|\mathbf{v}_1\| = 2 \ne 1\)) hâlde \(\|\mathbf{v}_1\|^2 = 4\)'e bölmeyi unuttu!`, en: R`Forgot to divide by \(\|\mathbf{v}_1\|^2 = 4\) even though \(\mathbf{v}_1\) is NOT a unit vector (\(\|\mathbf{v}_1\| = 2\))!` },
          },
          {
            text: { tr: "Gölgeyi çıkarmak yerine toplamalıydı", en: "Should have added the projection instead of subtracting" },
            why: {
              tr: R`Gölge daima çıkarılır (eksi işareti doğru!); hata paydadaki \(\|\mathbf{v}_1\|^2\)'yi unutmaktır.`,
              en: R`Subtracting the shadow is right; the mistake was missing the denominator \(\|\mathbf{v}_1\|^2\).`,
            },
          },
        ],
        answer: 1,
        explain: {
          tr: R`\(\mathbf{v}_1 = (2, 0)\) birim vektör olmadığından ya önce \(\mathbf{q}_1 = (1, 0)\) diye normalize edilmeli ya da \(\frac{\mathbf{v}_2\cdot\mathbf{v}_1}{\|\mathbf{v}_1\|^2}\mathbf{v}_1 = \frac{6}{4}(2, 0) = (3, 0)\) çıkarılmalıdır: \((3, 4) - (3, 0) = (0, 4) \perp (2, 0)\)!`,
          en: R`Because \(\|\mathbf{v}_1\| = 2 \ne 1\), either normalize to \(\mathbf{q}_1 = (1, 0)\) first or divide by \(\|\mathbf{v}_1\|^2 = 4\): \((3, 4) - \frac{6}{4}(2, 0) = (0, 4) \perp (2, 0)\)!`,
        },
      },
    ],
  },
  {
    id: "px-ip-lsq",
    title: { tr: "En Küçük Kareler ve Normal Denklemler", en: "Least Squares & Normal Equations" },
    intro: {
      tr: R`Doğru uydurma, normal denklemler \(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\) ve canlı tahmin.`,
      en: R`Line fitting, normal equations \(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\), and live prediction.`,
    },
    read: { tab: "theory", section: "ip-lsq" },
    questions: [
      {
        id: "ip-q6",
        kind: "number",
        q: {
          tr: R`Veri noktaları \((0, 1),\ (1, 3),\ (2, 5)\) için en küçük kareler doğrusu \(\hat{y} = c_0 + c_1 x\)'in eğimi \(c_1\) kaçtır?`,
          en: R`What is the slope \(c_1\) of the least-squares line \(\hat{y} = c_0 + c_1 x\) for \((0, 1),\ (1, 3),\ (2, 5)\)?`,
        },
        label: { tr: R`\(c_1 =\)`, en: R`\(c_1 =\)` },
        answer: 2,
        compute: () => leastSquaresPoly([[0, 1], [1, 3], [2, 5]], 1).coeffs[1]!,
        hint: {
          tr: R`Noktaların artışına bakın: \(x\) her \(1\) arttığında \(y\) tam \(2\) artıyor — üç nokta zaten tek bir doğrunun üzerinde!`,
          en: R`Look at the jump: every \(+1\) in \(x\) adds \(+2\) in \(y\) — all three points already lie on one exact line!`,
        },
        explain: {
          tr: R`Üç nokta tam olarak \(y = 1 + 2x\) doğrusu üzerindedir (\(\mathrm{SSR} = 0\)), dolayısıyla eğim \(c_1 = 2\).`,
          en: R`All three points lie exactly on \(y = 1 + 2x\) (\(\mathrm{SSR} = 0\)), so the slope is \(c_1 = 2\).`,
        },
      },
      {
        id: "ip-q7",
        kind: "predict",
        q: {
          tr: R`Aynı doğru üzerinde <b>olmayan</b> \((0, 1),\ (1, 2),\ (2, 4)\) veri noktalarına normal denklemlerle en küçük kareler doğrusu \(\hat{y} = c_0 + c_1 x\) uydurduğumuzda eğim \(c_1\) kaç çıkar?`,
          en: R`When we fit a least-squares line \(\hat{y} = c_0 + c_1 x\) via normal equations to the <b>non-collinear</b> points \((0, 1),\ (1, 2),\ (2, 4)\), what slope \(c_1\) emerges?`,
        },
        options: [
          { tr: R`\(c_1 = 1\)`, en: R`\(c_1 = 1\)` },
          { tr: R`\(c_1 = 1{,}5\)`, en: R`\(c_1 = 1.5\)` },
          { tr: R`\(c_1 = 2\)`, en: R`\(c_1 = 2\)` },
          { tr: R`\(c_1 = 2{,}5\)`, en: R`\(c_1 = 2.5\)` },
        ],
        answer: 1,
        run: () => {
          const fit = leastSquaresPoly([[0, 1], [1, 2], [2, 4]], 1);
          const slope = fit.coeffs[1]!;
          const idx = Math.abs(slope - 1.5) < 1e-6 ? 1 : -1;
          return {
            answer: idx,
            result: {
              tr: R`Normal denklemler: \(\hat{y}(x) = ${fit.coeffs[0]!.toFixed(2).replace(".", "{,}")} + ${slope.toFixed(1).replace(".", "{,}")}x\) ve \(\mathrm{SSR} = ${fit.ssr.toFixed(3).replace(".", "{,}")}\) → eğim <b>\(c_1 = 1{,}5\)</b>!`,
              en: R`Normal equations give \(\hat{y}(x) = ${fit.coeffs[0]!.toFixed(2)} + ${slope.toFixed(1)}x\) with \(\mathrm{SSR} = ${fit.ssr.toFixed(3)}\) → slope <b>\(c_1 = 1.5\)</b>!`,
            },
          };
        },
        tryIt: { tab: "theory", section: "ip-lsq" },
        explain: {
          tr: R`\(A^T A = \begin{bmatrix}3 & 3\\3 & 5\end{bmatrix}\) ve \(A^T\mathbf{y} = \begin{bmatrix}7\\10\end{bmatrix}\) sisteminden \(2c_1 = 3 \implies c_1 = 1{,}5\) (ilk aralıktaki eğim 1 ile ikinci aralıktaki eğim 2'nin tam ortası!).`,
          en: R`From \(A^T A = \begin{bmatrix}3 & 3\\3 & 5\end{bmatrix}\) and \(A^T\mathbf{y} = \begin{bmatrix}7\\10\end{bmatrix}\), subtracting gives \(2c_1 = 3 \implies c_1 = 1.5\) (right halfway between the two segment slopes 1 and 2!).`,
        },
      },
    ],
  },
];
