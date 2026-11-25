import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { gramSchmidt, leastSquaresPoly, simpson, vDot, vNorm, vProject, vSub } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "ip-intro",
    title: { tr: "İç Çarpım Uzayları, Gram–Schmidt ve En İyi Yaklaşım", en: "Inner Product Spaces, Gram–Schmidt & Best Approximation" },
    paragraphs: [
      {
        tr: R`Nokta çarpımın temel özelliklerini soyutlayarak fonksiyonlar ve polinomlar dahil her vektör uzayına açı ve uzunluk tanımlayabiliriz: [[inner-product|iç çarpım]] \(\langle u, v \rangle\). Örneğin \([-\pi,\pi]\)'de \(\langle f,g\rangle = \int_{-\pi}^\pi f(x)g(x)\,dx\) altında \(\sin(nx)\) ve \(\cos(mx)\) fonksiyonları birbirine <b>diktir</b>!`,
        en: R`Abstracting the dot product gives angles and lengths in any vector space (including functions!): an [[inner-product|inner product]] \(\langle u, v\rangle\). Under \(\int_{-\pi}^\pi f(x)g(x)\,dx\), \(\sin(nx)\) and \(\cos(mx)\) are <b>orthogonal</b>!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> [[gram-schmidt|Gram–Schmidt]] ile ortonormal taban kuracak, [[projection|dik izdüşümün]] neden en yakın noktayı (en iyi yaklaşımı) verdiğini ispatlayacak ve veri noktalarına <b>En Küçük Kareler</b> (\(A^T A \hat{\mathbf c} = A^T \mathbf y\)) eğrisi uydurabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will orthogonalize bases with [[gram-schmidt|Gram–Schmidt]], prove why [[projection|orthogonal projection]] gives the closest approximation, and solve <b>Least Squares</b> via normal equations \(A^T A \hat{\mathbf c} = A^T \mathbf y\).`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 12 · İç Çarpım Uzayları + En İyi Yaklaşım", en: "Lecture 12 · Inner Product Spaces + Best Approximation" }],
      [{ tr: "En iyi yaklaşım", en: "Best approximation" }, { tr: R`\(\hat{\mathbf y} = \sum \langle \mathbf y, \mathbf q_i\rangle \mathbf q_i,\quad (\mathbf y - \hat{\mathbf y}) \perp W\)`, en: R`\(\hat{\mathbf y} = \sum \langle \mathbf y, \mathbf q_i\rangle \mathbf q_i,\quad (\mathbf y - \hat{\mathbf y}) \perp W\)` }],
      [{ tr: "Normal denklemler", en: "Normal equations" }, { tr: R`\(A^T A \hat{\mathbf c} = A^T \mathbf y\)`, en: R`\(A^T A \hat{\mathbf c} = A^T \mathbf y\)` }],
    ],
  },
  sections: [
    {
      id: "ip-gs",
      mathId: "m-ip-gs",
      title: { tr: "Gram–Schmidt: Eğik Tabanı Dikleştirme", en: "Gram–Schmidt: Turning Any Basis Orthonormal" },
      body: [
        {
          tr: R`[[orthogonality|Ortonormal]] bir tabanda koordinat bulmak matris tersi gerektirmez — tek bir iç çarpım yeterlidir: \(c_i = \langle \mathbf x, \mathbf q_i\rangle\)! [[gram-schmidt|Gram–Schmidt]] süreci herhangi bir \(\{\mathbf v_1, \mathbf v_2\}\) tabanından \(\mathbf v_2\)'nin \(\mathbf q_1\) yönündeki gölgesini çıkarıp birim uzunluğa ölçekleyerek \(\{\mathbf q_1, \mathbf q_2\}\) üretir.`,
          en: R`In an [[orthogonality|orthonormal]] basis, coordinates need no matrix inversion — just inner products \(c_i = \langle \mathbf x, \mathbf q_i\rangle\)! [[gram-schmidt|Gram–Schmidt]] strips off the shadow of \(\mathbf v_2\) along \(\mathbf q_1\) and normalizes.`,
        },
        { eq: R`\mathbf q_1 = \frac{\mathbf v_1}{\|\mathbf v_1\|}, \qquad \mathbf u_2 = \mathbf v_2 - \langle\mathbf v_2, \mathbf q_1\rangle \mathbf q_1, \qquad \mathbf q_2 = \frac{\mathbf u_2}{\|\mathbf u_2\|}` },
        {
          tr: R`<b>Deneyin:</b> Mavi \(\mathbf v_1\) ve yeşil \(\mathbf v_2\) uçlarını sürükleyin; Gram–Schmidt'in ürettiği birim çember üzerindeki dik \(\mathbf q_1, \mathbf q_2\) vektörlerinin her zaman \(90^\circ\) kaldığını görün.`,
          en: R`<b>Try it:</b> drag \(\mathbf v_1\) and \(\mathbf v_2\) and watch the Gram–Schmidt vectors \(\mathbf q_1, \mathbf q_2\) on the unit circle stay strictly perpendicular!`,
        },
      ],
      demo(box, state) {
        const s = (state.gs ??= { v1: [2.4, 0.8], v2: [1.4, 2.2] });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(host, calc);
        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "v₁ ve v₂ uçlarını sürükleyin", en: "Drag tips of v₁ and v₂" }),
        });

        const draw = () => {
          const { orthogonal, orthonormal } = gramSchmidt([s.v1, s.v2]);
          const q1 = orthonormal[0], q2 = orthonormal[1], u2 = orthogonal[1];
          const proj = vProject(s.v2, s.v1);
          plot.draw({
            x: [-3, 3.8], y: [-2.5, 3.5], equalAspect: true, xLabel: "x₁", yLabel: "x₂",
            circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [4, 4] }],
            segments: [{ from: s.v2, to: proj, color: COLORS.muted, dash: [4, 3] }],
            vectors: [
              { to: s.v1, color: COLORS.c1, dash: [5, 3], label: "v₁" },
              { to: s.v2, color: COLORS.c3, dash: [5, 3], label: "v₂" },
              { to: u2, color: COLORS.c4, width: 1.8, dash: [3, 3], label: "u₂" },
              { to: q1, color: COLORS.c1, width: 3.2, label: "q₁" },
              { to: q2, color: COLORS.c2, width: 3.2, label: "q₂" },
            ],
            handles: [
              { id: "v1", x: s.v1[0], y: s.v1[1], color: COLORS.c1, onDrag: (x, y) => { s.v1 = [x, y]; draw(); } },
              { id: "v2", x: s.v2[0], y: s.v2[1], color: COLORS.c3, onDrag: (x, y) => { s.v2 = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(\\mathbf q_1 = (${tx(q1[0], 2)},\\ ${tx(q1[1], 2)}),\\quad \\mathbf q_2 = (${tx(q2[0], 2)},\\ ${tx(q2[1], 2)}),\\quad \\mathbf q_1\\cdot\\mathbf q_2 = ${tx(vDot(q1, q2), 3)}\\)`;
        };
        draw();
      },
    },
    {
      id: "ip-fn-orth",
      mathId: "m-ip-best",
      title: { tr: "Fonksiyonlarda İç Çarpım ve Ortogonallik", en: "Inner Product of Functions & Orthogonality" },
      body: [
        {
          tr: R`\([-\pi, \pi]\) aralığında iki fonksiyonun iç çarpımı \(\langle f, g\rangle = \int_{-\pi}^\pi f(x)g(x)\,dx\) olarak tanımlanır. Bu çarpımın işaretli alanı 0 ise iki fonksiyon birbirine <b>diktir</b> — Fourier serilerinin ve polinom yaklaşımlarının temeli budur!`,
          en: R`On \([-\pi,\pi]\), define \(\langle f, g\rangle = \int_{-\pi}^\pi f(x)g(x)\,dx\). When the signed area of \(f(x)g(x)\) vanishes, the two functions are <b>orthogonal</b> — the foundation of Fourier series!`,
        },
        { eq: R`\langle \sin(mx), \sin(nx) \rangle = \int_{-\pi}^{\pi} \sin(mx)\sin(nx)\,dx = \begin{cases} \pi & m = n \\ 0 & m \ne n \end{cases}` },
        {
          tr: R`<b>Deneyin:</b> \(m\) ve \(n\) frekanslarını değiştirin. \(m \ne n\) iken çarpım eğrisi \(f(x)g(x)\)'in pozitif ve negatif alanlarının birbirini <b>tam olarak</b> götürdüğünü görün!`,
          en: R`<b>Try it:</b> vary frequencies \(m\) and \(n\). Whenever \(m\ne n\), the positive and negative lobes of \(\sin(mx)\sin(nx)\) cancel to exactly 0!`,
        },
      ],
      demo(box, state) {
        const s = (state.fnIp ??= { m: 1, n: 2 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 240 });

        const draw = () => {
          const prod = (x) => Math.sin(s.m * x) * Math.sin(s.n * x);
          const val = simpson(prod, -Math.PI, Math.PI, 200);
          plot.draw({
            x: [-3.2, 3.2], y: [-1.3, 1.3], xLabel: "x", yLabel: "f·g",
            areas: [{ f: prod, from: -Math.PI, to: Math.PI, fill: Math.abs(val) < 1e-4 ? "rgba(27,175,122,0.22)" : "rgba(42,120,214,0.22)" }],
            curves: [{ f: prod, color: COLORS.c1, width: 2.5 }],
          });
          calc.textContent = `\\(\\langle \\sin(${s.m}x),\\ \\sin(${s.n}x) \\rangle = \\int_{-\\pi}^{\\pi} \\sin(${s.m}x)\\sin(${s.n}x)\\,dx = ${tx(val, 3)}\\)`;
        };
        ctl.append(
          slider("m", { min: 1, max: 4, step: 1, value: s.m, fmt: (v) => String(v), onInput: (v) => { s.m = v; draw(); } }),
          slider("n", { min: 1, max: 4, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "En Küçük Kareler (Best Approximation) Laboratuvarı", en: "Least-Squares Best Approximation Lab" },
    sub: {
      tr: R`Veri noktalarını sürükleyin ve doğru (derece 1) veya parabol (derece 2) seçin; normal denklemler \(A^T A \hat{\mathbf c} = A^T \mathbf y\) artık kareler toplamını (SSR) en aza indirger!`,
      en: R`Drag the data points and switch between line (deg 1) and parabola (deg 2) fits solved via the normal equations \(A^T A \hat{\mathbf c} = A^T \mathbf y\).`,
    },
    build(host, state) {
      const s = (state.pg ??= {
        pts: [[-3, -1.5], [-1.5, -0.3], [0, 0.8], [1.5, 1.4], [3, 3.2]],
        deg: 1,
      });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, {
        height: 390,
        interactive: true,
        hint: L({ tr: "Veri noktalarını sürükleyin", en: "Drag data points" }),
      });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, tiles, calc);

      const draw = () => {
        const fit = leastSquaresPoly(s.pts, s.deg);
        const f = (x) => fit.coeffs.reduce((acc, c, p) => acc + c * x ** p, 0);
        plot.draw({
          x: [-4.5, 4.5], y: [-4, 5], xLabel: "x", yLabel: "y",
          curves: [{ f, color: COLORS.c1, width: 2.8 }],
          segments: s.pts.map(([x, y]) => ({ from: [x, y], to: [x, f(x)], color: COLORS.c2, dash: [4, 3], width: 1.8 })),
          handles: s.pts.map(([x, y], i) => ({
            id: `p${i}`, x, y, color: COLORS.c3,
            onDrag: (nx, ny) => { s.pts[i] = [nx, ny]; draw(); },
          })),
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "SSR (‖r‖²)" }), h("span", { class: "pg-tile-value", text: ns(fit.ssr, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "R²" }), h("span", { class: "pg-tile-value", text: ns(fit.r2, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Derece", en: "Degree" }) }), h("span", { class: "pg-tile-value", text: String(s.deg) })),
        );
        const terms = fit.coeffs.map((c, p) => (p === 0 ? tx(c, 2) : `${c >= 0 ? "+" : "-"} ${tx(Math.abs(c), 2)}x${p > 1 ? `^${p}` : ""}`)).join(" ");
        calc.textContent = `\\(\\hat y(x) = ${terms}\\)`;
      };
      ctl.append(
        segmented([[1, { tr: "Doğru (d=1)", en: "Line (d=1)" }], [2, { tr: "Parabol (d=2)", en: "Parabola (d=2)" }], [3, { tr: "Kübik (d=3)", en: "Cubic (d=3)" }]], s.deg, (v) => { s.deg = Number(v); draw(); }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-ip-gs",
      title: { tr: "İç Çarpım Aksiyomları ve Pisagor Teoremi", en: "Inner Product Axioms & Pythagoras" },
      blocks: [
        { eq: R`\langle u, v \rangle = \langle v, u \rangle,\qquad \langle \alpha u + \beta w, v\rangle = \alpha\langle u,v\rangle + \beta\langle w,v\rangle,\qquad \langle u,u\rangle > 0\ (u\ne 0)` },
        { eq: R`\langle u, v \rangle = 0 \implies \|u + v\|^2 = \|u\|^2 + \|v\|^2` },
      ],
    },
    {
      id: "m-ip-best",
      title: { tr: "En İyi Yaklaşım Teoremi ve Normal Denklemler İspatı", en: "Proof of Best Approximation & Normal Equations" },
      blocks: [
        {
          derive: {
            title: { tr: "Dik izdüşüm ŷ neden W içindeki en yakın noktadır?", en: "Why orthogonal projection ŷ minimizes ‖y − w‖ over W" },
            steps: [
              { tex: R`\mathbf y - \mathbf w = (\mathbf y - \hat{\mathbf y}) + (\hat{\mathbf y} - \mathbf w)`, why: { tr: "W içindeki keyfi bir w için fark vektörünü ikiye ayırırız.", en: "For any w ∈ W, split y − w at the orthogonal projection ŷ." } },
              { tex: R`\langle \mathbf y - \hat{\mathbf y},\ \hat{\mathbf y} - \mathbf w \rangle = 0`, why: { tr: "ŷ − w ∈ W ve artık y − ŷ ⊥ W olduğundan iki parça diktir!", en: "Since ŷ − w ∈ W and the residual y − ŷ ⊥ W, the pieces are orthogonal!" } },
              { tex: R`\|\mathbf y - \mathbf w\|^2 = \|\mathbf y - \hat{\mathbf y}\|^2 + \|\hat{\mathbf y} - \mathbf w\|^2 \ge \|\mathbf y - \hat{\mathbf y}\|^2`, why: { tr: "Pisagor Teoremi gereği en küçük uzaklık yalnızca w = ŷ iken elde edilir.", en: "By Pythagoras, distance is uniquely minimized at w = ŷ." } },
              { tex: R`A^T(\mathbf y - A\hat{\mathbf c}) = \mathbf 0 \iff A^T A \hat{\mathbf c} = A^T \mathbf y`, why: { tr: "W = Col(A) için artığın tüm sütunlara dik olması normal denklemleri verir!", en: "For W = Col(A), residual orthogonality to every column yields AᵀAĉ = Aᵀy!" } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
