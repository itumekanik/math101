import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { det2, inv2, matVec, vScale } from "../../engines/math-core.ts";
import { matToTex } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, segmented } = KIT;

mountChapter({
  intro: {
    id: "bd-intro",
    title: { tr: "Taban, Boyut ve Koordinatlar", en: "Basis, Dimension, and Coordinates" },
    paragraphs: [
      {
        tr: R`Bir vektör uzayının [[basis|tabanı]] \(\mathcal B = \{\mathbf b_1, \dots, \mathbf b_n\}\), uzayı hem geren hem de doğrusal bağımsız olan en küçük yapı taşları kümesidir. Bir taban seçtiğimiz anda, uzaydaki her vektörün o tabana göre <b>benzersiz</b> bir koordinat vektörü \([\mathbf x]_{\mathcal B}\) olur!`,
        en: R`A [[basis|basis]] \(\mathcal B = \{\mathbf b_1, \dots, \mathbf b_n\}\) is a minimal spanning, linearly independent set of building blocks. Fixing a basis assigns every vector a <b>unique</b> coordinate tuple \([\mathbf x]_{\mathcal B}\)!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> eğik bir \(\mathcal B\)-ızgarası üzerinde koordinat okuyacak, taban değişim matrisi \(P_{\mathcal E \leftarrow \mathcal B}\) ile \([\mathbf x]_{\mathcal B} = P^{-1}[\mathbf x]_{\mathcal E}\) dönüşümünü yapacak ve <b>Rank–Sıfırlık Teoremini</b> (\(\operatorname{rank}(A) + \dim\ker(A) = n\)) kullanabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will read coordinates on a skewed \(\mathcal B\)-grid, convert between bases using \(P_{\mathcal E \leftarrow \mathcal B}\) and \([\mathbf x]_{\mathcal B} = P^{-1}[\mathbf x]_{\mathcal E}\), and apply the <b>Rank–Nullity Theorem</b>.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 11 · Taban, Boyut ve Koordinatlar", en: "Lecture 11 · Basis, Dimension & Coordinates" }],
      [{ tr: "Taban değişimi", en: "Change of basis" }, { tr: R`\([\mathbf x]_{\mathcal E} = P[\mathbf x]_{\mathcal B},\quad [\mathbf x]_{\mathcal B} = P^{-1}[\mathbf x]_{\mathcal E}\)`, en: R`\([\mathbf x]_{\mathcal E} = P[\mathbf x]_{\mathcal B},\quad [\mathbf x]_{\mathcal B} = P^{-1}[\mathbf x]_{\mathcal E}\)` }],
      [{ tr: "Rank–Sıfırlık", en: "Rank–Nullity" }, { tr: R`\(\operatorname{rank}(A) + \dim\ker(A) = n\)`, en: R`\(\operatorname{rank}(A) + \dim\ker(A) = n\)` }],
    ],
  },
  sections: [
    {
      id: "bd-grid",
      mathId: "m-bd-change",
      title: { tr: "Aynı Vektör, İki Farklı Koordinat Sistemi", en: "Same Vector, Two Coordinate Systems" },
      body: [
        {
          tr: R`Bir ok (\(\mathbf x\)) fiziksel olarak değişmez; ama hangi tabanı (\(\mathcal E\) standart veya \(\mathcal B = \{\mathbf b_1, \mathbf b_2\}\)) kullandığımıza göre koordinat sayıları değişir. Sütunları \(\mathbf b_1, \mathbf b_2\) olan \(P\) matrisi bizi \(\mathcal B\)'den standart koordinatlara taşır:`,
          en: R`The geometric arrow \(\mathbf x\) never moves, yet its coordinate numbers change depending on the chosen basis (\(\mathcal E\) vs \(\mathcal B = \{\mathbf b_1, \mathbf b_2\}\)). Putting \(\mathbf b_1, \mathbf b_2\) as columns of \(P\) maps \(\mathcal B\)-coordinates to standard ones:`,
        },
        { eq: R`\mathbf x = c_1 \mathbf b_1 + c_2 \mathbf b_2 = \underbrace{[\mathbf b_1\ \mathbf b_2]}_{P}\,[\mathbf x]_{\mathcal B} \implies [\mathbf x]_{\mathcal B} = P^{-1}\mathbf x` },
        {
          tr: R`<b>Deneyin:</b> Turuncu \(\mathbf x\) noktasını veya mavi/yeşil taban vektörlerini sürükleyin! Arka plandaki eğik ızgara \(\mathcal B\)-koordinatlarını doğrudan saymanızı sağlar.`,
          en: R`<b>Try it:</b> drag the orange vector \(\mathbf x\) or the basis vectors \(\mathbf b_1, \mathbf b_2\)! Count grid steps along the skewed \(\mathcal B\)-grid to verify \([\mathbf x]_{\mathcal B}\).`,
        },
      ],
      demo(box, state) {
        const s = (state.grid ??= { b1: [1.5, 0.5], b2: [-0.5, 1.5], x: [2.5, 2.5] });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(host, calc);
        const plot = createCanvas2D(host, {
          height: 300,
          interactive: true,
          hint: L({ tr: "b₁, b₂ ve x uçlarını sürükleyin", en: "Drag b₁, b₂, and x" }),
        });

        const draw = () => {
          const P = [[s.b1[0], s.b2[0]], [s.b1[1], s.b2[1]]];
          const Pinv = inv2(P);
          const xB = Pinv ? matVec(Pinv, s.x) : null;
          const p1 = xB ? vScale(s.b1, xB[0]) : null;
          plot.draw({
            x: [-4, 4.5], y: [-3.5, 4.5], equalAspect: true, xLabel: "e₁", yLabel: "e₂",
            basisGrid: Pinv ? { b1: s.b1, b2: s.b2, color: COLORS.c1, range: 6 } : undefined,
            segments: p1 ? [
              { from: [0, 0], to: p1, color: COLORS.c1, dash: [4, 3], width: 2 },
              { from: p1, to: s.x, color: COLORS.c3, dash: [4, 3], width: 2 },
            ] : [],
            vectors: [
              { to: s.b1, color: COLORS.c1, label: "b₁" },
              { to: s.b2, color: COLORS.c3, label: "b₂" },
              { to: s.x, color: COLORS.c2, width: 3, label: "x" },
            ],
            handles: [
              { id: "b1", x: s.b1[0], y: s.b1[1], color: COLORS.c1, onDrag: (x, y) => { s.b1 = [x, y]; draw(); } },
              { id: "b2", x: s.b2[0], y: s.b2[1], color: COLORS.c3, onDrag: (x, y) => { s.b2 = [x, y]; draw(); } },
              { id: "x", x: s.x[0], y: s.x[1], color: COLORS.c2, onDrag: (x, y) => { s.x = [x, y]; draw(); } },
            ],
          });
          calc.textContent = xB
            ? `\\([\\mathbf x]_{\\mathcal E} = \\begin{bmatrix}${tx(s.x[0], 2)}\\\\${tx(s.x[1], 2)}\\end{bmatrix},\\quad P = ${matToTex(P)},\\quad [\\mathbf x]_{\\mathcal B} = P^{-1}\\mathbf x = \\begin{bmatrix}${tx(xB[0], 2)}\\\\${tx(xB[1], 2)}\\end{bmatrix}\\)`
            : `\\(\\det(P) = 0 \\implies \\{\\mathbf b_1, \\mathbf b_2\\}\\ \\text{${L({ tr: "taban değildir!", en: "is NOT a basis!" })}}\\)`;
        };
        draw();
      },
    },
    {
      id: "bd-rank-nullity",
      mathId: "m-bd-rn",
      title: { tr: "Rank–Sıfırlık Teoremi: Boyut Korunumu", en: "Rank–Nullity Theorem: Conservation of Dimension" },
      body: [
        {
          tr: R`Bir \(m\times n\) matris \(A\), \(\mathbb{R}^n\)'deki her boyutu ya sıfıra ezer (\(\ker A\)) ya da görüntü uzayında (\(\operatorname{Col} A\)) korur. İkisinin boyutları toplamı daima girdi boyutuna (\(n\)) eşittir!`,
          en: R`An \(m\times n\) matrix \(A\) either crushes each input dimension to zero (\(\ker A\)) or preserves it in the image (\(\operatorname{Col} A\)). Their dimensions always add up to the input dimension \(n\)!`,
        },
        { eq: R`\dim\operatorname{Col}(A) + \dim\ker(A) = \operatorname{rank}(A) + \operatorname{nullity}(A) = n` },
        {
          tr: R`<b>Deneyin:</b> Aşağıdaki \(2\times 2\) dönüşümler arasında geçiş yapın: tam rank (\(2 + 0 = 2\)), bir doğruya izdüşüm (\(1 + 1 = 2\)) ve sıfır matrisi (\(0 + 2 = 2\)).`,
          en: R`<b>Try it:</b> compare full rank (\(2 + 0 = 2\)), projection onto a line (\(1 + 1 = 2\)), and the zero map (\(0 + 2 = 2\)).`,
        },
      ],
      demo(box, state) {
        const s = (state.rn ??= { mode: "proj" });
        const modes = {
          full: { label: { tr: "Tam rank (2+0)", en: "Full rank (2+0)" }, A: [[1.5, 0.5], [0, 1.2]], r: 2, nul: 0 },
          proj: { label: { tr: "İzdüşüm (1+1)", en: "Projection (1+1)" }, A: [[1, 1], [0.5, 0.5]], r: 1, nul: 1 },
          zero: { label: { tr: "Sıfır (0+2)", en: "Zero map (0+2)" }, A: [[0, 0], [0, 0]], r: 0, nul: 2 },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 250 });

        const draw = () => {
          const m = modes[s.mode];
          const lines = [];
          if (s.mode === "proj") {
            lines.push(
              { a: 1, b: -2, c: 0, color: COLORS.c1, width: 2.8, label: "Col(A)" },
              { a: 1, b: 1, c: 0, color: COLORS.c2, width: 2.4, dash: [5, 4], label: "ker(A)" },
            );
          }
          plot.draw({
            x: [-3.5, 3.5], y: [-3.5, 3.5], equalAspect: true, xLabel: "x₁", yLabel: "x₂",
            basisGrid: s.mode === "full" ? { b1: [1.5, 0], b2: [0.5, 1.2], color: COLORS.c1, range: 4 } : undefined,
            lines,
            points: s.mode === "full"
              ? [{ x: 0, y: 0, color: COLORS.c2, r: 6, label: "ker(A) = {0}" }]
              : s.mode === "zero"
                ? [{ x: 0, y: 0, color: COLORS.c1, r: 6, label: "Col(A) = {0}" }]
                : [],
          });
          calc.textContent = `\\(A = ${matToTex(m.A)},\\qquad \\operatorname{rank}(A)=${m.r},\\quad \\dim\\ker(A)=${m.nul},\\quad ${m.r} + ${m.nul} = 2 = n\\)`;
        };
        ctl.append(segmented(Object.entries(modes).map(([k, v]) => [k, v.label]), s.mode, (v) => { s.mode = v; draw(); }));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Taban Değişimi ve Benzer Matrisler Laboratuvarı", en: "Change-of-Basis & Coordinates Studio" },
    sub: {
      tr: R`Standart taban, \(45^\circ\) döndürülmüş ortonormal taban veya eğik bir taban seçip aynı vektörün farklı tabanlardaki koordinatlarını anlık karşılaştırın.`,
      en: R`Switch between standard, rotated orthonormal, and skewed bases to inspect transition matrices \(P\), \(P^{-1}\) and live coordinates.`,
    },
    build(host, state) {
      const s = (state.pg ??= { preset: "rot", x: [2, 1] });
      const presets = {
        std: { label: { tr: "Standart", en: "Standard" }, b1: [1, 0], b2: [0, 1] },
        rot: { label: { tr: "Dönük 45°", en: "Rotated 45°" }, b1: [0.707, 0.707], b2: [-0.707, 0.707] },
        skew: { label: { tr: "Eğik taban", en: "Skew basis" }, b1: [2, 1], b2: [1, 2] },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 380, interactive: true, hint: L({ tr: "x ucunu sürükleyin", en: "Drag tip of x" }) });
      const ctl = h("div", { class: "t-controls" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, calc);

      const draw = () => {
        const cur = presets[s.preset];
        const P = [[cur.b1[0], cur.b2[0]], [cur.b1[1], cur.b2[1]]];
        const Pinv = inv2(P);
        const xB = matVec(Pinv, s.x);
        plot.draw({
          x: [-4.5, 4.5], y: [-4.5, 4.5], equalAspect: true, xLabel: "x", yLabel: "y",
          basisGrid: { b1: cur.b1, b2: cur.b2, color: COLORS.c1, range: 6 },
          vectors: [
            { to: cur.b1, color: COLORS.c1, label: "b₁" },
            { to: cur.b2, color: COLORS.c3, label: "b₂" },
            { to: s.x, color: COLORS.c2, width: 3, label: "x" },
          ],
          handles: [{ id: "x", x: s.x[0], y: s.x[1], color: COLORS.c2, onDrag: (x, y) => { s.x = [x, y]; draw(); } }],
        });
        calc.textContent = `\\(P = ${matToTex(P)},\\quad P^{-1} = ${matToTex(Pinv)},\\quad [\\mathbf x]_{\\mathcal B} = \\begin{bmatrix}${tx(xB[0], 2)}\\\\${tx(xB[1], 2)}\\end{bmatrix},\\quad \\det(P)=${tx(det2(P), 2)}\\)`;
      };
      ctl.append(segmented(Object.entries(presets).map(([k, v]) => [k, v.label]), s.preset, (v) => { s.preset = v; draw(); }));
      draw();
    },
  },
  mathSections: [
    {
      id: "m-bd-change",
      title: { tr: "Koordinatların Tekliği ve Taban Değişim Formülü", en: "Uniqueness of Coordinates & Change of Basis" },
      blocks: [
        {
          derive: {
            title: { tr: "Bir tabanda her vektörün koordinatları tektir", en: "Uniqueness of coordinates in a basis" },
            steps: [
              { tex: R`\mathbf x = \sum_{i=1}^n c_i \mathbf b_i = \sum_{i=1}^n d_i \mathbf b_i`, why: { tr: "Aynı x vektörünün iki farklı gösterimi olduğunu varsayalım.", en: "Suppose x has two representations in basis B." } },
              { tex: R`\sum_{i=1}^n (c_i - d_i)\mathbf b_i = \mathbf 0`, why: { tr: "İki eşitliği taraf tarafa çıkarırız.", en: "Subtract the two expressions." } },
              { tex: R`c_i - d_i = 0 \implies c_i = d_i \quad \forall i`, why: { tr: "Taban vektörleri doğrusal bağımsız olduğundan tüm farklar 0 olmalıdır.", en: "Linear independence of the basis forces every difference to vanish." } },
            ],
          },
        },
        { eq: R`[T]_{\mathcal B} = P^{-1} [T]_{\mathcal E} P` },
      ],
    },
    {
      id: "m-bd-rn",
      title: { tr: "Rank–Sıfırlık Teoremi (İspat Özeti)", en: "Rank–Nullity Theorem (Proof Sketch)" },
      blocks: [
        { eq: R`\operatorname{rank}(A) + \dim\ker(A) = n` },
        {
          p: {
            tr: R`\(A\) matrisini [[rref|RREF]] formuna indirdiğimizde toplam \(n\) sütunun \(r = \operatorname{rank}(A)\) tanesi pivot sütunudur (bunlar \(\operatorname{Col}(A)\)'nın tabanını verir), kalan \(n - r\) sütun ise serbest değişkenlere karşılık gelir ve tam olarak \(\ker(A)\)'nın taban vektörlerini üretir. Dolayısıyla \(r + (n - r) = n\).`,
            en: R`In RREF, the \(n\) columns split cleanly into \(r = \operatorname{rank}(A)\) pivot columns (yielding a basis of \(\operatorname{Col}(A)\)) and \(n - r\) free columns (yielding \(n - r\) basis vectors of \(\ker(A)\)). Hence \(r + (n - r) = n\).`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
