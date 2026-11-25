import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { det2, matMul, matVec } from "../../engines/math-core.ts";
import { matToTex, matrixInput } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "mx-intro",
    title: { tr: "Matrisler ve Vektörler: Doğrusal Dönüşümlerin Dili", en: "Matrices & Vectors: The Language of Linear Maps" },
    paragraphs: [
      {
        tr: R`Bir [[matrix|matris]] yalnızca bir sayı tablosu değildir: \(\mathbf x \mapsto A\mathbf x\) işlemi uzayı doğrusal olarak büken, döndüren, yansıtan veya izdüşüren bir makinedir. \(A\)'nın sütunları, standart taban vektörlerinin \(\mathbf e_1, \mathbf e_2\) nereye gittiğini söyler!`,
        en: R`A [[matrix|matrix]] is not just a table of numbers: \(\mathbf x \mapsto A\mathbf x\) is a linear transformation that rotates, shears, reflects, or projects space. The columns of \(A\) record exactly where \(\mathbf e_1, \mathbf e_2\) land!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> \(A\mathbf x\)'i sütunların doğrusal bileşimi olarak okuyacak, matris çarpımı \(AB\)'nin neden dönüşüm bileşkesi olduğunu (ve neden \(AB \ne BA\) çıktığını) görecek ve [[transpose|transpoz]] kurallarını kullanabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will read \(A\mathbf x\) as a linear combination of columns, see why \(AB\) is transformation composition (and why \(AB\ne BA\)), and apply [[transpose|transpose]] identities.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 6 · Matrisler ve Vektörler", en: "Lecture 6 · Matrices and Vectors" }],
      [{ tr: "Altın bakış açısı", en: "Golden insight" }, { tr: R`\(A\mathbf x = x_1 \mathbf a_1 + x_2 \mathbf a_2 + \dots + x_n \mathbf a_n\)`, en: R`\(A\mathbf x = x_1 \mathbf a_1 + x_2 \mathbf a_2 + \dots + x_n \mathbf a_n\)` }],
      [{ tr: "Kritik uyarı", en: "Key warning" }, { tr: R`\(AB \ne BA\) (değişmeli değil) ve \((AB)^T = B^T A^T\)`, en: R`\(AB \ne BA\) (non-commutative) and \((AB)^T = B^T A^T\)` }],
    ],
  },
  sections: [
    {
      id: "mx-transform",
      mathId: "m-mx-linear",
      title: { tr: "2×2 Matris = Düzlemin Doğrusal Dönüşümü", en: "2×2 Matrix = Linear Transformation of the Plane" },
      body: [
        {
          tr: R`\(A = [\mathbf a_1\ \mathbf a_2]\) matrisi \(\mathbf e_1 = (1,0)\)'ı birinci sütuna (\(\mathbf a_1\)), \(\mathbf e_2 = (0,1)\)'i ikinci sütuna (\(\mathbf a_2\)) taşır. Doğrusallık gereği tüm ızgara çizgileri paralel ve eşit aralıklı kalır, orijin yerinden oynamaz.`,
          en: R`The matrix \(A = [\mathbf a_1\ \mathbf a_2]\) sends \(\mathbf e_1 = (1,0)\) to column 1 (\(\mathbf a_1\)) and \(\mathbf e_2 = (0,1)\) to column 2 (\(\mathbf a_2\)). By linearity, grid lines stay parallel and evenly spaced and the origin stays fixed.`,
        },
        { eq: R`A\begin{bmatrix}x_1\\x_2\end{bmatrix} = x_1 \begin{bmatrix}a_{11}\\a_{21}\end{bmatrix} + x_2 \begin{bmatrix}a_{12}\\a_{22}\end{bmatrix}` },
        {
          tr: R`<b>Deneyin:</b> Hazır dönüşümleri (dönme, kaydırma/shear, yansıma, izdüşüm) seçin veya mavi/yeşil sütun vektörlerini doğrudan sürükleyerek birim karenin nasıl büküldüğünü izleyin!`,
          en: R`<b>Try it:</b> pick a preset (rotation, shear, reflection, projection) or drag the blue/green column tips directly to watch the unit square and grid warp!`,
        },
      ],
      demo(box, state) {
        const s = (state.tr ??= { a1: [1.5, 0.4], a2: [0.6, 1.3], preset: "custom" });
        const presets = {
          rot: { label: { tr: "Dönme 45°", en: "Rotate 45°" }, a1: [0.71, 0.71], a2: [-0.71, 0.71] },
          shear: { label: { tr: "Kaydırma", en: "Shear" }, a1: [1, 0], a2: [1.2, 1] },
          refl: { label: { tr: "Yansıma", en: "Reflect" }, a1: [0, 1], a2: [1, 0] },
          proj: { label: { tr: "İzdüşüm", en: "Project" }, a1: [1, 0.5], a2: [0.5, 0.25] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "A·e₁ (mavi) ve A·e₂ (yeşil) uçlarını sürükleyin", en: "Drag columns A·e₁ and A·e₂" }),
        });

        const draw = () => {
          const A = [[s.a1[0], s.a2[0]], [s.a1[1], s.a2[1]]];
          const sum = [s.a1[0] + s.a2[0], s.a1[1] + s.a2[1]];
          plot.draw({
            x: [-3.5, 3.5], y: [-3, 3.5], equalAspect: true, xLabel: "x", yLabel: "y",
            basisGrid: { b1: s.a1, b2: s.a2, color: COLORS.c1, range: 5 },
            polygons: [
              { pts: [[0, 0], [1, 0], [1, 1], [0, 1]], stroke: COLORS.muted, dash: [4, 3], width: 1.4 },
              { pts: [[0, 0], s.a1, sum, s.a2], fill: "rgba(42,120,214,0.18)", stroke: COLORS.c1, width: 2 },
            ],
            vectors: [
              { to: s.a1, color: COLORS.c1, label: "Ae₁" },
              { to: s.a2, color: COLORS.c3, label: "Ae₂" },
            ],
            handles: [
              { id: "a1", x: s.a1[0], y: s.a1[1], color: COLORS.c1, onDrag: (x, y) => { s.a1 = [x, y]; draw(); } },
              { id: "a2", x: s.a2[0], y: s.a2[1], color: COLORS.c3, onDrag: (x, y) => { s.a2 = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(A = ${matToTex(A)},\\qquad \\det(A) = ${tx(det2(A), 2)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(presets).map(([k, v]) => [k, v.label]), s.preset, (k) => {
            s.preset = k;
            s.a1 = [...presets[k].a1];
            s.a2 = [...presets[k].a2];
            draw();
          }),
        );
        draw();
      },
    },
    {
      id: "mx-comp",
      mathId: "m-mx-prod",
      title: { tr: "Matris Çarpımı = Dönüşümlerin Bileşkesi (AB ≠ BA)", en: "Matrix Multiplication = Composition (AB ≠ BA)" },
      body: [
        {
          tr: R`\((AB)\mathbf x = A(B\mathbf x)\): önce \(B\), sonra \(A\) uygulanır! Dönüşümlerin sırası sonucu değiştirir — örneğin önce \(90^\circ\) döndürüp sonra \(x\)-ekseninde yansıtmak, önce yansıtıp sonra döndürmekten <b>farklıdır</b>.`,
          en: R`\((AB)\mathbf x = A(B\mathbf x)\): apply \(B\) first, then \(A\)! Order matters — rotating by \(90^\circ\) then reflecting across the \(x\)-axis gives a <b>different</b> result from reflecting first then rotating.`,
        },
        { eq: R`(AB)_{ij} = \sum_{k=1}^{p} A_{ik} B_{kj} \qquad (m\times p)\cdot(p\times n) \to (m\times n)` },
        {
          tr: R`<b>Deneyin:</b> Aşağıdaki düğmeyle <b>AB</b> (önce B, sonra A) ile <b>BA</b> (önce A, sonra B) sonuçlarını karşılaştırın; iki sonucun düzlemde tamamen farklı yönlere gittiğini görün.`,
          en: R`<b>Try it:</b> toggle between <b>AB</b> (B then A) and <b>BA</b> (A then B) to see how swapping the order lands \(\mathbf v\) in two completely different places.`,
        },
      ],
      demo(box, state) {
        const s = (state.comp ??= { order: "AB", ang: 60 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          const rad = (s.ang * Math.PI) / 180;
          const A = [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]]; // rotation
          const B = [[1, 0.8], [0, 1]]; // horizontal shear
          const AB = matMul(A, B);
          const BA = matMul(B, A);
          const x = [1.5, 1];
          const yAB = matVec(AB, x);
          const yBA = matVec(BA, x);
          plot.draw({
            x: [-3.5, 3.5], y: [-3, 3.5], equalAspect: true, xLabel: "x", yLabel: "y",
            vectors: [
              { to: x, color: COLORS.muted, dash: [4, 3], label: "x" },
              { to: yAB, color: COLORS.c1, width: s.order === "AB" ? 3.2 : 1.6, label: "ABx" },
              { to: yBA, color: COLORS.c2, width: s.order === "BA" ? 3.2 : 1.6, label: "BAx" },
            ],
          });
          calc.textContent = `\\(AB = ${matToTex(AB)}\\;\\ne\\; BA = ${matToTex(BA)}\\)`;
        };
        ctl.append(
          segmented([["AB", "AB (Shear → Rot)"], ["BA", "BA (Rot → Shear)"]], s.order, (v) => { s.order = v; draw(); }),
          slider("θ (°)", { min: 15, max: 150, step: 15, value: s.ang, fmt: (v) => `${v}°`, onInput: (v) => { s.ang = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Etkileşimli 2×2 Matris Çarpım & Dönüşüm Stüdyosu", en: "Interactive 2×2 Matrix Product & Transform Studio" },
    sub: {
      tr: R`\(A\) ve \(B\) matrislerinin girişlerini düzenleyin; \(AB\), \(BA\) ve \(\mathbf x\) vektörünün dönüşmüş görüntüsünü düzlemde anında görün.`,
      en: R`Edit entries of \(A\) and \(B\) to compute \(AB\), \(BA\) and visualize the transformed vector on the plane live.`,
    },
    build(host, state) {
      const s = (state.pg ??= { A: [[1, 1], [0, 1]], B: [[0, -1], [1, 0]], x: [2, 1] });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, {
        height: 380,
        interactive: true,
        hint: L({ tr: "x vektörünü sürükleyin", en: "Drag vector x" }),
      });
      const editors = h("div", { class: "mx-row-wrap" });
      const calc = h("div", { class: "pc-calc" });
      side.append(editors, calc);

      const draw = () => {
        const AB = matMul(s.A, s.B);
        const BA = matMul(s.B, s.A);
        const ax = matVec(s.A, s.x);
        const abx = matVec(AB, s.x);
        plot.draw({
          x: [-5, 5], y: [-5, 5], equalAspect: true, xLabel: "x", yLabel: "y",
          vectors: [
            { to: s.x, color: COLORS.muted, label: "x" },
            { to: ax, color: COLORS.c1, label: "Ax" },
            { to: abx, color: COLORS.c2, width: 3, label: "ABx" },
          ],
          handles: [{ id: "x", x: s.x[0], y: s.x[1], color: COLORS.text, onDrag: (x, y) => { s.x = [x, y]; draw(); } }],
        });
        calc.textContent = `\\(AB = ${matToTex(AB)},\\quad BA = ${matToTex(BA)},\\quad AB\\mathbf x = (${tx(abx[0], 2)},\\ ${tx(abx[1], 2)})\\)`;
      };
      editors.append(
        h("div", {}, h("div", { class: "mini-title", text: "A" }), matrixInput(s.A, draw)),
        h("div", {}, h("div", { class: "mini-title", text: "B" }), matrixInput(s.B, draw)),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-mx-linear",
      title: { tr: "Doğrusallık ve Sütun Görünümü", en: "Linearity & The Column View" },
      blocks: [
        { eq: R`A(\alpha \mathbf u + \beta \mathbf v) = \alpha A\mathbf u + \beta A\mathbf v` },
        {
          p: {
            tr: R`Bir \(m\times n\) matris \(A\), \(\mathbb{R}^n\)'den \(\mathbb{R}^m\)'e giden doğrusal dönüşümleri tam olarak temsil eder: her doğrusal dönüşüm \(T(\mathbf x) = A\mathbf x\) biçimindedir ve \(A\)'nın \(j\). sütunu \(T(\mathbf e_j)\)'dir.`,
            en: R`Every \(m\times n\) matrix \(A\) defines a linear map \(\mathbb{R}^n\to\mathbb{R}^m\), and conversely every linear map has matrix \(A = [T(\mathbf e_1)\ \cdots\ T(\mathbf e_n)]\).`,
          },
        },
      ],
    },
    {
      id: "m-mx-prod",
      title: { tr: "Transpoz Kuralı: (AB)ᵀ = Bᵀ Aᵀ İspatı", en: "Proof of the Transpose Law (AB)ᵀ = Bᵀ Aᵀ" },
      blocks: [
        {
          derive: {
            title: { tr: "Çarpımın transpozu sırayı ters çevirir", en: "Transpose of a product reverses the order" },
            steps: [
              { tex: R`\big((AB)^T\big)_{ij} = (AB)_{ji}`, why: { tr: "Transpozun tanımı: satır ve sütun indisleri yer değiştirir.", en: "Definition of transpose: swap row and column indices." } },
              { tex: R`(AB)_{ji} = \sum_{k=1}^{p} A_{jk} B_{ki}`, why: { tr: "Matris çarpımı tanımı uygulanır.", en: "Expand the (j, i) entry of the matrix product." } },
              { tex: R`= \sum_{k=1}^{p} (B^T)_{ik} (A^T)_{kj} = (B^T A^T)_{ij}`, why: { tr: "B_{ki} = (Bᵀ)_{ik} ve A_{jk} = (Aᵀ)_{kj} yazılarak çarpım tanınır.", en: "Rewrite B_{ki} = (Bᵀ)_{ik} and A_{jk} = (Aᵀ)_{kj} to recognize BᵀAᵀ." } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
