import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { createCanvas3D } from "../../engines/canvas3d.ts";
import { det2, solveLinear, vAdd, vScale } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "vs-intro",
    title: { tr: "Vektör Uzayları, Alt Uzaylar, Germe ve Bağımsızlık", en: "Vector Spaces, Subspaces, Span & Independence" },
    paragraphs: [
      {
        tr: R`Oklarla başladığımız vektör kavramı aslında çok daha geneldir: polinomlar (\(\mathcal P_n\)), matrisler (\(\mathbb{R}^{m\times n}\)) ve sürekli fonksiyonlar (\(C[a,b]\)) aynı 8 aksiyomu sağladıkları için birer [[vector-space|vektör uzayıdır]]!`,
        en: R`Vectors go far beyond arrows: polynomials (\(\mathcal P_n\)), matrices (\(\mathbb{R}^{m\times n}\)), and continuous functions (\(C[a,b]\)) all obey the same 8 axioms and form [[vector-space|vector spaces]]!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> bir alt kümenin [[subspace|alt uzay]] olup olmadığını 3 koşulla test edecek, [[span|germe (span)]] ve [[linear-independence|doğrusal bağımsızlık]] arasındaki bağı görecek, bir matrisin sütun uzayı \(\operatorname{Col}(A)\) ve çekirdeğini \(\ker(A)\) tanıyacaksınız.`,
        en: R`<b>By the end of this chapter</b> you will test [[subspace|subspaces]] with the 3-condition criterion, visualize [[span|span]] and [[linear-independence|linear independence]], and identify \(\operatorname{Col}(A)\) and \(\ker(A)\).`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 9+10 · Vektör Uzayları", en: "Lecture 9+10 · Vector Spaces" }],
      [{ tr: "Alt uzay testi", en: "Subspace test" }, { tr: R`\(\mathbf 0 \in W\), toplam kapalı, skaler çarpım kapalı`, en: R`\(\mathbf 0 \in W\), closed under \(+\) and scalar multiplication` }],
      [{ tr: "Temel alt uzaylar", en: "Fundamental subspaces" }, { tr: R`\(\ker(A) = \{\mathbf x : A\mathbf x=\mathbf 0\}\), \(\operatorname{Col}(A) = \operatorname{span}(\text{sütunlar})\)`, en: R`\(\ker(A) = \{\mathbf x : A\mathbf x=\mathbf 0\}\), \(\operatorname{Col}(A) = \operatorname{span}(\text{columns})\)` }],
    ],
  },
  sections: [
    {
      id: "vs-subspace",
      mathId: "m-vs-sub",
      title: { tr: "Alt Uzay Nedir? Orijinden Geçmeyen Doğru Neden Bozulur?", en: "Subspaces: Why Shifting Off the Origin Breaks Closure" },
      body: [
        {
          tr: R`Bir alt küme \(W \subseteq \mathbb{R}^2\)'nin [[subspace|alt uzay]] olması için mutlaka sıfır vektörünü \(\mathbf 0\) içermesi ve toplama/ölçekleme altında kapalı olması gerekir. Orijinden geçen \(y = mx\) doğrusu bir alt uzaydır; fakat \(y = mx + b\ (b \ne 0)\) doğrusunda iki noktanın toplamı doğrudan <b>dışarı fırlar</b>!`,
          en: R`For \(W \subseteq \mathbb{R}^2\) to be a [[subspace|subspace]], it must contain \(\mathbf 0\) and stay closed under addition and scaling. A line \(y = mx\) through the origin is a subspace; shift it by \(b\ne 0\) and \(\mathbf u + \mathbf v\) <b>jumps off the line</b>!`,
        },
        { eq: R`\mathbf 0 \in W,\qquad \mathbf u, \mathbf v \in W \implies \mathbf u + \mathbf v \in W,\qquad \lambda\mathbf u \in W` },
        {
          tr: R`<b>Deneyin:</b> \(b\) kaydırmasını 0'dan farklı yapın ve \(W\) üzerindeki iki noktanın toplamı \(\mathbf u + \mathbf v\)'nin (turuncu) doğrudan nasıl koptuğunu görün!`,
          en: R`<b>Try it:</b> move the shift \(b\) away from 0 and watch \(\mathbf u + \mathbf v\) (orange) escape from the shifted line!`,
        },
      ],
      demo(box, state) {
        const s = (state.sub ??= { b: 1.2 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, msg);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const m = 0.5;
          const u = [1, m * 1 + s.b];
          const v = [2, m * 2 + s.b];
          const sum = vAdd(u, v);
          const isSub = Math.abs(s.b) < 1e-6;
          plot.draw({
            x: [-2, 5], y: [-2, 5], equalAspect: true, xLabel: "x", yLabel: "y",
            lines: [{ a: m, b: -1, c: s.b, color: COLORS.c1, width: 2.6, label: "W" }],
            vectors: [
              { to: u, color: COLORS.c3, label: "u" },
              { to: v, color: COLORS.c1, label: "v" },
              { to: sum, color: isSub ? COLORS.good : COLORS.bad, width: 2.8, label: "u+v" },
            ],
          });
          if (isSub) {
            msg.className = "pc-msg good";
            msg.textContent = L({ tr: "b = 0: Orijin W'nin içinde ve u + v hâlâ W üzerinde → Geçerli bir alt uzay!", en: "b = 0: Origin is in W and u + v stays on W → Valid subspace!" });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `b = ${ns(s.b, 1)} ≠ 0: (0,0) ∉ W ve u+v = (${ns(sum[0], 1)}, ${ns(sum[1], 1)}) doğrudan ${ns(s.b, 1)} birim saptı → Alt uzay DEĞİL!`,
              en: `b = ${ns(s.b, 1)} ≠ 0: (0,0) ∉ W and u+v misses the line by ${ns(s.b, 1)} → NOT a subspace!`,
            });
          }
        };
        ctl.append(slider("b", { min: -1.5, max: 1.5, step: 0.3, value: s.b, onInput: (v) => { s.b = v; draw(); } }));
        draw();
      },
    },
    {
      id: "vs-span",
      mathId: "m-vs-indep",
      title: { tr: "Germe (Span) ve Doğrusal Bağımsızlık", en: "Span & Linear Independence" },
      body: [
        {
          tr: R`İki vektör \(\mathbf v_1, \mathbf v_2 \in \mathbb{R}^2\) birbirinin katı değilse ([[linear-independence|doğrusal bağımsızsa]]), [[span|\(\operatorname{span}\{\mathbf v_1, \mathbf v_2\}\)]] tüm düzlemi \(\mathbb{R}^2\) doldurur: her hedef \(\mathbf b\) için tek bir \((c_1, c_2)\) bileşimi vardır. Aynı doğruya düştüklerinde ise germe bir <b>doğruya çöker</b>!`,
          en: R`When \(\mathbf v_1, \mathbf v_2 \in \mathbb{R}^2\) are [[linear-independence|linearly independent]], their [[span|span]] fills all of \(\mathbb{R}^2\) and every target \(\mathbf b\) has unique weights \((c_1, c_2)\). If they align, their span collapses to a <b>1D line</b>!`,
        },
        { eq: R`c_1 \mathbf v_1 + c_2 \mathbf v_2 = \mathbf b` },
        {
          tr: R`<b>Deneyin:</b> \(\mathbf v_1, \mathbf v_2\) ve hedef \(\mathbf b\)'yi sürükleyin. \(\mathbf v_2\)'yi \(\mathbf v_1\)'in doğrultusuna getirdiğinizde \(\det = 0\) olduğunu ve çözümün bozulduğunu izleyin.`,
          en: R`<b>Try it:</b> drag \(\mathbf v_1, \mathbf v_2\), and target \(\mathbf b\). Align \(\mathbf v_2\) with \(\mathbf v_1\) to watch linear dependence collapse the span!`,
        },
      ],
      demo(box, state) {
        const s = (state.span ??= { v1: [2, 0.5], v2: [0.5, 2], b: [2.5, 2.5] });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 280,
          interactive: true,
          hint: L({ tr: "v₁, v₂ ve hedef b'yi sürükleyin", en: "Drag v₁, v₂, and target b" }),
        });
        const draw = () => {
          const A = [[s.v1[0], s.v2[0]], [s.v1[1], s.v2[1]]];
          const d = det2(A);
          const indep = Math.abs(d) > 0.12;
          const c = indep ? solveLinear(A, s.b) : null;
          const c1v1 = c ? vScale(s.v1, c[0]) : null;
          plot.draw({
            x: [-4, 4.5], y: [-4, 4.5], equalAspect: true, xLabel: "x", yLabel: "y",
            basisGrid: indep ? { b1: s.v1, b2: s.v2, color: COLORS.c1, range: 4 } : undefined,
            lines: !indep ? [{ a: -s.v1[1], b: s.v1[0], c: 0, color: COLORS.bad, width: 2.5, dash: [5, 4] }] : [],
            segments: c1v1 ? [{ from: c1v1, to: s.b, color: COLORS.c3, dash: [4, 3] }] : [],
            vectors: [
              { to: s.v1, color: COLORS.c1, label: "v₁" },
              { to: s.v2, color: COLORS.c3, label: "v₂" },
              { to: s.b, color: COLORS.c2, width: 2.8, label: "b" },
            ],
            handles: [
              { id: "v1", x: s.v1[0], y: s.v1[1], color: COLORS.c1, onDrag: (x, y) => { s.v1 = [x, y]; draw(); } },
              { id: "v2", x: s.v2[0], y: s.v2[1], color: COLORS.c3, onDrag: (x, y) => { s.v2 = [x, y]; draw(); } },
              { id: "b", x: s.b[0], y: s.b[1], color: COLORS.c2, onDrag: (x, y) => { s.b = [x, y]; draw(); } },
            ],
          });
          if (indep && c) {
            calc.textContent = `\\(\\mathbf b = ${tx(c[0], 2)}\\,\\mathbf v_1 ${c[1] >= 0 ? "+" : "-"} ${tx(Math.abs(c[1]), 2)}\\,\\mathbf v_2\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({ tr: "Doğrusal bağımsız (det ≠ 0): span = tüm ℝ²!", en: "Linearly independent (det ≠ 0): span = all of ℝ²!" });
          } else {
            calc.textContent = `\\(\\det[\\mathbf v_1\\ \\mathbf v_2] \\approx 0 \\implies \\dim\\operatorname{span} = 1\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({ tr: "Doğrusal bağımlı! Germe yalnızca tek bir doğruya çöktü.", en: "Linearly dependent! The span collapsed onto a single line." });
          }
        };
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "ℝ³'te Alt Uzay ve Germe (Span) Keşif Alanı", en: "3D Subspace & Span Explorer" },
    sub: {
      tr: R`ℝ³'te iki vektörün gerdiği düzlem (2B alt uzay) ile bağımlı olduklarında oluşan doğruyu (1B alt uzay) 3B döndürerek inceleyin.`,
      en: R`Orbit in 3D to compare a 2D plane spanned by two independent vectors versus a collapsed 1D line when they become dependent.`,
    },
    build(host, state) {
      const s = (state.pg ??= { mode: "plane", t: 1 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const view3d = createCanvas3D(stage, { height: 380 });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, ctl2, calc);

      const draw = () => {
        const v1 = [2, 0.5, 0.5];
        const v2 = s.mode === "plane" ? [0.4, 2, s.t] : [1.4, 0.35, 0.35];
        const normal = [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
        view3d.draw({
          range: 4,
          planes: s.mode === "plane" ? [{ normal, d: 0, size: 2.8 }] : [],
          segments: s.mode === "line" ? [{ from: [-3, -0.75, -0.75], to: [3, 0.75, 0.75], color: COLORS.c2, width: 2.8 }] : [],
          vectors: [
            { to: v1, color: COLORS.c1, label: "v₁" },
            { to: v2, color: COLORS.c3, label: "v₂" },
          ],
        });
        calc.textContent = s.mode === "plane"
          ? `\\(\\dim\\operatorname{span}\\{\\mathbf v_1,\\mathbf v_2\\} = 2\\quad (${L({ tr: "\\text{Orijinden geçen düzlem}", en: "\\text{Plane through origin}" })})\\)`
          : `\\(\\mathbf v_2 = 0{,}7\\,\\mathbf v_1 \\implies \\dim\\operatorname{span}\\{\\mathbf v_1,\\mathbf v_2\\} = 1\\)`;
      };
      ctl.append(
        segmented([["plane", { tr: "Bağımsız (Düzlem)", en: "Independent (Plane)" }], ["line", { tr: "Bağımlı (Doğru)", en: "Dependent (Line)" }]], s.mode, (v) => { s.mode = v; draw(); }),
      );
      ctl2.append(slider("v₂,z", { min: -2, max: 2, step: 0.2, value: s.t, onInput: (v) => { s.t = v; draw(); } }));
      draw();
    },
  },
  mathSections: [
    {
      id: "m-vs-sub",
      title: { tr: "Alt Uzay Kriteri ve Örnek Vektör Uzayları", en: "Subspace Criterion & Classic Vector Spaces" },
      blocks: [
        {
          table: {
            head: [{ tr: "Uzay", en: "Space" }, { tr: "Elemanları", en: "Elements" }, { tr: "Boyut", en: "Dimension" }],
            rows: [
              [R`\(\mathbb{R}^n\)`, { tr: R`\(n\)-bileşenli reel vektörler`, en: R`\(n\)-tuples of real numbers` }, R`\(n\)`],
              [R`\(\mathcal P_n\)`, { tr: R`Derecesi \(\le n\) olan polinomlar`, en: R`Polynomials of degree \(\le n\)` }, R`\(n + 1\)`],
              [R`\(\mathbb{R}^{m\times n}\)`, { tr: R`\(m\times n\) reel matrisler`, en: R`\(m\times n\) real matrices` }, R`\(mn\)`],
              [R`\(C([a,b])\)`, { tr: R`\([a,b]\)'de sürekli fonksiyonlar`, en: R`Continuous functions on \([a,b]\)` }, R`\(\infty\)`],
            ],
          },
        },
        {
          derive: {
            title: { tr: "Çekirdek ker(A)'nın alt uzay olduğunun ispatı", en: "Proof that ker(A) is a subspace of ℝⁿ" },
            steps: [
              { tex: R`A\mathbf 0 = \mathbf 0 \implies \mathbf 0 \in \ker(A)`, why: { tr: "Sıfır vektörü çekirdeğe aittir (boş değil).", en: "The zero vector lies in ker(A)." } },
              { tex: R`\mathbf u, \mathbf v \in \ker(A) \implies A(\mathbf u + \mathbf v) = A\mathbf u + A\mathbf v = \mathbf 0 + \mathbf 0 = \mathbf 0`, why: { tr: "Toplama altında kapalılık.", en: "Closure under vector addition." } },
              { tex: R`\lambda \in \mathbb{R},\ \mathbf u \in \ker(A) \implies A(\lambda\mathbf u) = \lambda(A\mathbf u) = \lambda\mathbf 0 = \mathbf 0`, why: { tr: "Skaler çarpma altında kapalılık → ker(A) bir alt uzaydır.", en: "Closure under scalar multiplication completes the proof." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-vs-indep",
      title: { tr: "Doğrusal Bağımsızlık Kriteri", en: "Linear Independence Criterion" },
      blocks: [
        { eq: R`c_1\mathbf v_1 + \dots + c_k\mathbf v_k = \mathbf 0 \implies c_1 = \dots = c_k = 0` },
        {
          callout: "tip",
          title: { tr: "Hızlı kontrol", en: "Quick check" },
          text: {
            tr: R`\(\mathbb{R}^n\)'de \(n\)'den fazla vektör (\(k > n\)) <b>asla</b> doğrusal bağımsız olamaz! Ayrıca kümede \(\mathbf 0\) vektörü varsa küme otomatik olarak bağımlıdır.`,
            en: R`More than \(n\) vectors in \(\mathbb{R}^n\) (\(k > n\)) can <b>never</b> be linearly independent! Any set containing \(\mathbf 0\) is automatically dependent.`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
