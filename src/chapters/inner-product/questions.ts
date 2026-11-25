import type { PracticeSection } from "../../shared/practice.ts";
import { gramSchmidt, leastSquaresPoly, simpson, vDot, vNorm } from "../../engines/math-core.ts";

const R = String.raw;

export const PRACTICE: PracticeSection[] = [
  {
    id: "px-ip-main",
    title: { tr: "Ortogonallik, Gram–Schmidt ve En Küçük Kareler", en: "Orthogonality, Gram–Schmidt & Least Squares" },
    intro: { tr: R`İç çarpım, ortonormal taban ve normal denklemler.`, en: R`Inner products, orthonormal bases, and normal equations.` },
    read: { tab: "theory", section: "ip-gs" },
    questions: [
      {
        id: "ip-q1",
        kind: "number",
        q: {
          tr: R`\(\{\mathbf q_1, \mathbf q_2\}\) ortonormal tabanında \(\mathbf q_1 = (\frac{3}{5}, \frac{4}{5})\) ise \(\mathbf x = (5, 0)\)'ın \(\mathbf q_1\) koordinatı \(\langle \mathbf x, \mathbf q_1\rangle\) kaçtır?`,
          en: R`With orthonormal basis vector \(\mathbf q_1 = (\frac{3}{5}, \frac{4}{5})\), what is the \(\mathbf q_1\)-coordinate \(\langle \mathbf x, \mathbf q_1\rangle\) of \(\mathbf x = (5, 0)\)?`,
        },
        label: { tr: R`\(\langle \mathbf x, \mathbf q_1\rangle =\)`, en: R`\(\langle \mathbf x, \mathbf q_1\rangle =\)` },
        answer: 3,
        compute: () => vDot([5, 0], [0.6, 0.8]),
        hint: { tr: R`Ortonormal tabanda koordinat doğrudan nokta çarpımdır: \(5\cdot\frac{3}{5} + 0\cdot\frac{4}{5}\).`, en: R`In an orthonormal basis, the coordinate is just \(\mathbf x \cdot \mathbf q_1\).` },
        explain: { tr: R`\(5\cdot 0{,}6 + 0\cdot 0{,}8 = 3\).`, en: R`\(5\cdot 0.6 + 0\cdot 0.8 = 3\).` },
      },
      {
        id: "ip-q2",
        kind: "number",
        q: {
          tr: R`\(\mathbf v_1 = (1, 0)\) ve \(\mathbf v_2 = (3, 4)\) üzerine Gram–Schmidt uygulandığında oluşan ortogonal vektör \(\mathbf u_2 = \mathbf v_2 - \operatorname{proj}_{\mathbf v_1}\mathbf v_2\)'nin normu kaçtır?`,
          en: R`Applying Gram–Schmidt to \(\mathbf v_1 = (1, 0)\) and \(\mathbf v_2 = (3, 4)\), what is the norm of \(\mathbf u_2 = \mathbf v_2 - \operatorname{proj}_{\mathbf v_1}\mathbf v_2\)?`,
        },
        label: { tr: R`\(\|\mathbf u_2\| =\)`, en: R`\(\|\mathbf u_2\| =\)` },
        answer: 4,
        compute: () => vNorm(gramSchmidt([[1, 0], [3, 4]]).orthogonal[1]!),
        hint: { tr: R`\(\mathbf v_2\)'nin \(\mathbf v_1 = (1,0)\) üzerindeki bileşeni \((3,0)\)'dır; çıkarınca ne kalır?`, en: R`Subtracting the \((1,0)\) component \((3,0)\) leaves \((0,4)\).` },
        explain: { tr: R`\(\mathbf u_2 = (3,4) - (3,0) = (0,4)\), dolayısıyla \(\|\mathbf u_2\| = 4\).`, en: R`\(\mathbf u_2 = (3,4) - (3,0) = (0,4)\), so \(\|\mathbf u_2\| = 4\).` },
      },
      {
        id: "ip-q3",
        kind: "choice",
        q: {
          tr: R`\([-1, 1]\) aralığında \(\langle f, g \rangle = \int_{-1}^1 f(x)g(x)\,dx\) iç çarpımına göre \(f(x) = 1\) ve \(g(x) = x\) nasıl ilişkilidir?`,
          en: R`Under \(\langle f, g\rangle = \int_{-1}^1 f(x)g(x)\,dx\), how are \(f(x) = 1\) and \(g(x) = x\) related?`,
        },
        options: [
          { text: { tr: R`Ortogonaldir (\(\langle 1, x\rangle = 0\))`, en: R`Orthogonal (\(\langle 1, x\rangle = 0\))` } },
          {
            text: { tr: R`İç çarpımları \(2\)'dir`, en: R`Their inner product is \(2\)` },
            why: { tr: R`\(\int_{-1}^1 1\cdot 1\,dx = 2\)'dir; ama \(x\) tek fonksiyondur ve simetrik aralıkta integrali 0'dır!`, en: R`\(\int_{-1}^1 1\,dx = 2\), but \(x\) is odd so its integral over \([-1,1]\) is 0!` },
          },
          {
            text: { tr: "İç çarpım tanımlanamaz", en: "The inner product is undefined" },
            why: { tr: R`İkisi de sürekli olduğundan integral sorunsuz hesaplanır.`, en: R`Both are continuous on \([-1,1]\), so the integral is well-defined.` },
          },
        ],
        answer: 0,
        compute: () => (Math.abs(simpson((x) => x, -1, 1, 20)) < 1e-9 ? 0 : -1),
        explain: { tr: R`\(\int_{-1}^1 1\cdot x\,dx = \left[\frac{x^2}{2}\right]_{-1}^1 = 0\), dolayısıyla \(1 \perp x\).`, en: R`\(\int_{-1}^1 x\,dx = 0\), so \(1\) and \(x\) are orthogonal.` },
      },
      {
        id: "ip-q4",
        kind: "number",
        q: {
          tr: R`Veri noktaları \((0, 1),\ (1, 3),\ (2, 5)\) için en küçük kareler doğrusu \(\hat y = c_0 + c_1 x\)'in eğimi \(c_1\) kaçtır?`,
          en: R`What is the slope \(c_1\) of the least-squares line \(\hat y = c_0 + c_1 x\) for \((0, 1),\ (1, 3),\ (2, 5)\)?`,
        },
        label: { tr: R`\(c_1 =\)`, en: R`\(c_1 =\)` },
        answer: 2,
        compute: () => leastSquaresPoly([[0, 1], [1, 3], [2, 5]], 1).coeffs[1]!,
        hint: { tr: R`Üç nokta zaten tam bir doğrunun üzerinde!`, en: R`All three points already lie on a single line!` },
        explain: { tr: R`Noktalar \(y = 1 + 2x\) doğrusu üzerindedir (\(SSR = 0\)), dolayısıyla \(c_1 = 2\).`, en: R`The points lie exactly on \(y = 1 + 2x\) (\(SSR = 0\)), so \(c_1 = 2\).` },
      },
    ],
  },
];
