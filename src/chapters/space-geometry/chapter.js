import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas3D } from "../../engines/canvas3d.ts";
import { cross3, pointPlaneDist3D, skewLinesDist3D, triple3, vAdd, vNorm } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "sg-intro",
    title: { tr: "Uzay Geometrisi (ℝ³)", en: "Space Geometry (ℝ³)" },
    paragraphs: [
      {
        tr: R`Üç boyutlu uzayda (\(\mathbb{R}^3\)) iki yeni fenomen ortaya çıkar: yalnızca \(\mathbb{R}^3\)'e özgü olan [[cross-product|vektörel çarpım]] (\(\mathbf u \times \mathbf v\)) ve ne kesişen ne de paralel olan [[skew-lines|aykırı doğrular]].`,
        en: R`Three-dimensional space \(\mathbb{R}^3\) introduces two hallmarks: the [[cross-product|cross product]] (\(\mathbf u \times \mathbf v\)) and [[skew-lines|skew lines]] that neither intersect nor run parallel.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> 3B sahneleri sürükleyip döndürerek vektörel çarpımın alan ve diklik anlamını, düzlem denklemini (\(\mathbf n\cdot\mathbf x = d\)), nokta–düzlem uzaklığını ve aykırı doğrular arası en kısa mesafeyi hesaplayabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will orbit interactive 3D scenes to grasp the cross product, plane equations (\(\mathbf n\cdot\mathbf x = d\)), point-to-plane distance, and shortest distance between skew lines.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 5 · Uzay Geometrisi", en: "Lecture 5 · Space Geometry" }],
      [{ tr: "Vektörel çarpım", en: "Cross product" }, { tr: R`\(\mathbf u\times\mathbf v \perp \mathbf u, \mathbf v\), alan \(=\|\mathbf u\times\mathbf v\|\)`, en: R`\(\mathbf u\times\mathbf v \perp \mathbf u, \mathbf v\), area \(=\|\mathbf u\times\mathbf v\|\)` }],
      [{ tr: "Düzlem & Doğru", en: "Plane & Line" }, { tr: R`\(ax+by+cz=d\quad\) ve \(\quad\mathbf r(t)=\mathbf p + t\mathbf d\)`, en: R`\(ax+by+cz=d\quad\) and \(\quad\mathbf r(t)=\mathbf p + t\mathbf d\)` }],
    ],
  },
  sections: [
    {
      id: "sg-cross",
      mathId: "m-sg-cross",
      title: { tr: "Vektörel Çarpım ve Paralelkenar Alanı", en: "Cross Product & Parallelogram Area" },
      body: [
        {
          tr: R`İki 3B vektör \(\mathbf u\) ve \(\mathbf v\)'nin [[cross-product|vektörel çarpımı]] \(\mathbf u \times \mathbf v\), ikisinin gerdiği düzleme <b>dik</b> bir vektördür. Uzunluğu, ikisinin oluşturduğu paralelkenarın alanına eşittir: \(\|\mathbf u\times\mathbf v\| = \|\mathbf u\|\|\mathbf v\|\sin\theta\).`,
          en: R`The [[cross-product|cross product]] \(\mathbf u\times\mathbf v\) is <b>orthogonal</b> to both \(\mathbf u\) and \(\mathbf v\), with magnitude \(\|\mathbf u\|\|\mathbf v\|\sin\theta\) equal to the area of the parallelogram they span.`,
        },
        { eq: R`\mathbf u \times \mathbf v = \begin{vmatrix}\mathbf i & \mathbf j & \mathbf k \\ u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3\end{vmatrix}` },
        {
          tr: R`<b>Deneyin:</b> 3B sahneyi fareyle sürükleyerek döndürün! \(\mathbf u\) ve \(\mathbf v\)'nin bileşenlerini değiştirin; turuncu ok \(\mathbf u\times\mathbf v\)'nin taralı paralelkenara daima dik kaldığını görün.`,
          en: R`<b>Try it:</b> drag the 3D viewport to orbit! Adjust \(\mathbf u\) and \(\mathbf v\) and verify that the orange arrow \(\mathbf u\times\mathbf v\) stays strictly perpendicular to the shaded parallelogram.`,
        },
      ],
      demo(box, state) {
        const s = (state.cross ??= { u: [2, 0.5, 0.5], v: [0.5, 2, 0.5] });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 310 });

        const draw = () => {
          const c = cross3(s.u, s.v);
          const sum = vAdd(s.u, s.v);
          view3d.draw({
            range: 4.5,
            quads: [{ pts: [[0, 0, 0], s.u, sum, s.v], fill: "rgba(42,120,214,0.18)", stroke: COLORS.c1 }],
            vectors: [
              { to: s.u, color: COLORS.c1, label: "u" },
              { to: s.v, color: COLORS.c3, label: "v" },
              { to: c, color: COLORS.c2, width: 3, label: "u×v" },
            ],
          });
          calc.textContent = `\\(\\mathbf u\\times\\mathbf v = (${tx(c[0], 2)},\\ ${tx(c[1], 2)},\\ ${tx(c[2], 2)}),\\qquad \\text{Alan} = \\|\\mathbf u\\times\\mathbf v\\| = ${tx(vNorm(c), 2)}\\)`;
        };
        ctl.append(
          slider("u_z", { min: -2, max: 2, step: 0.25, value: s.u[2], onInput: (v) => { s.u[2] = v; draw(); } }),
          slider("v_x", { min: -2, max: 2, step: 0.25, value: s.v[0], onInput: (v) => { s.v[0] = v; draw(); } }),
          slider("v_y", { min: -2, max: 2.5, step: 0.25, value: s.v[1], onInput: (v) => { s.v[1] = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "sg-planes",
      mathId: "m-sg-plane",
      title: { tr: "Uzayda Düzlemler ve Nokta–Düzlem Uzaklığı", en: "Planes in ℝ³ & Point-to-Plane Distance" },
      body: [
        {
          tr: R`Bir düzlem, bir nokta \(P_0\) ve [[normal-vector|normal vektörü]] \(\mathbf n=(a,b,c)\) ile benzersiz biçimde belirlenir: \(\mathbf n \cdot (\mathbf x - P_0) = 0 \iff ax + by + cz = d\). Herhangi bir \(Q\) noktasının düzleme uzaklığı 2B formülün birebir 3B genellemesidir:`,
          en: R`A plane is uniquely determined by a point \(P_0\) and its [[normal-vector|normal vector]] \(\mathbf n=(a,b,c)\): \(\mathbf n\cdot(\mathbf x-P_0)=0 \iff ax+by+cz=d\). Point-to-plane distance generalizes the 2D formula directly:`,
        },
        { eq: R`d(Q, \Pi) = \frac{|a q_1 + b q_2 + c q_3 - d|}{\sqrt{a^2 + b^2 + c^2}}` },
        {
          tr: R`<b>Deneyin:</b> Düzlemin normalini ve \(Q\) noktasının yüksekliği \(q_z\)'yi değiştirin; kesikli dikme çizgisini 3B olarak çevirerek inceleyin.`,
          en: R`<b>Try it:</b> tilt the plane normal and vary \(q_z\); orbit the 3D scene to inspect the perpendicular drop segment from \(Q\) to the plane.`,
        },
      ],
      demo(box, state) {
        const s = (state.plane ??= { a: 0.5, b: 0.5, c: 1, d: 0.5, qz: 2.8 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 310 });

        const draw = () => {
          const n = [s.a, s.b, s.c];
          const Q = [1, 1, s.qz];
          const n2 = s.a * s.a + s.b * s.b + s.c * s.c || 1;
          const t = (s.a * Q[0] + s.b * Q[1] + s.c * Q[2] - s.d) / n2;
          const H = [Q[0] - s.a * t, Q[1] - s.b * t, Q[2] - s.c * t];
          const dist = pointPlaneDist3D(Q, n, s.d);
          view3d.draw({
            range: 4,
            planes: [{ normal: n, d: s.d, size: 2.8 }],
            segments: [{ from: Q, to: H, color: COLORS.c2, dash: [5, 3], width: 2.3 }],
            vectors: [{ from: H, to: [H[0] + s.a, H[1] + s.b, H[2] + s.c], color: COLORS.c3, label: "n" }],
            points: [
              { p: Q, color: COLORS.c2, label: "Q" },
              { p: H, color: COLORS.c1, label: "H" },
            ],
          });
          calc.textContent = `\\(${tx(s.a, 1)}x + ${tx(s.b, 1)}y + ${tx(s.c, 1)}z = ${tx(s.d, 1)},\\qquad d(Q,\\Pi) = ${tx(dist, 3)}\\)`;
        };
        ctl.append(
          slider("a", { min: -1.5, max: 1.5, step: 0.25, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
          slider("b", { min: -1.5, max: 1.5, step: 0.25, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
          slider("q_z", { min: -2, max: 3.5, step: 0.2, value: s.qz, onInput: (v) => { s.qz = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "sg-skew",
      mathId: "m-sg-plane",
      title: { tr: "Uzayda Doğrular ve Aykırı Doğrular", en: "Lines in ℝ³ & Skew Lines" },
      body: [
        {
          tr: R`Düzlemde paralel olmayan iki doğru mutlaka kesişir, ama uzayda birbirine teğet geçip hiç kesişmeyen [[skew-lines|aykırı doğrular]] vardır! En kısa uzaklık, ortak dikme yönü \(\mathbf d_1 \times \mathbf d_2\) üzerine izdüşümle bulunur:`,
          en: R`Unlike 2D lines, two non-parallel lines in \(\mathbb{R}^3\) can miss each other completely ([[skew-lines|skew lines]]). Their shortest distance projects \(P_2 - P_1\) onto the common normal \(\mathbf d_1\times\mathbf d_2\):`,
        },
        { eq: R`d(\ell_1, \ell_2) = \frac{|(P_2 - P_1) \cdot (\mathbf d_1 \times \mathbf d_2)|}{\|\mathbf d_1 \times \mathbf d_2\|}` },
        {
          tr: R`<b>Deneyin:</b> İkinci doğrunun \(z\) yüksekliği \(h\)'yi kaydırın. \(h = 0\) iken doğrular orijinde kesişir (\(d = 0\)); \(h \ne 0\) iken aykırı hale gelirler!`,
          en: R`<b>Try it:</b> slide the height \(h\) of the second line. At \(h = 0\) the lines intersect (\(d = 0\)); for \(h \ne 0\) they become skew!`,
        },
      ],
      demo(box, state) {
        const s = (state.skew ??= { h: 1.8 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 290 });

        const draw = () => {
          const p1 = [0, 0, 0], d1 = [1, 0.3, 0];
          const p2 = [0, 0, s.h], d2 = [0.2, 1, 0];
          const dist = skewLinesDist3D(p1, d1, p2, d2);
          view3d.draw({
            range: 4,
            segments: [
              { from: [-3 * d1[0], -3 * d1[1], 0], to: [3 * d1[0], 3 * d1[1], 0], color: COLORS.c1, width: 2.6 },
              { from: [-3 * d2[0], -3 * d2[1], s.h], to: [3 * d2[0], 3 * d2[1], s.h], color: COLORS.c3, width: 2.6 },
              { from: [0, 0, 0], to: [0, 0, s.h], color: COLORS.c2, dash: [4, 3], width: 2.5 },
            ],
            points: [
              { p: [0, 0, 0], color: COLORS.c1, label: "ℓ₁" },
              { p: [0, 0, s.h], color: COLORS.c3, label: "ℓ₂" },
            ],
          });
          calc.textContent = `\\(d(\\ell_1, \\ell_2) = ${tx(dist, 2)}\\quad (${Math.abs(dist) < 1e-6 ? L({ tr: "\\text{Kesişiyor!}", en: "\\text{Intersecting!}" }) : L({ tr: "\\text{Aykırı doğrular}", en: "\\text{Skew lines}" })})\\)`;
        };
        ctl.append(slider("h", { min: -2.5, max: 2.5, step: 0.2, value: s.h, onInput: (v) => { s.h = v; draw(); } }));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "3B Geometri ve Karma Çarpım Atölyesi", en: "3D Geometry & Triple Product Studio" },
    sub: {
      tr: R`Hazır 3B sahneler arasında geçiş yapın (iki düzlemin kesişimi, karma çarpım hacmi, dik düzlemler) ve sahneyi sürükleyerek her açıdan inceleyin.`,
      en: R`Switch between classic 3D configurations (intersecting planes, parallelepiped volume, orthogonal planes) and orbit freely.`,
    },
    build(host, state) {
      const s = (state.pg ??= { preset: "planes", zScale: 1.5 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const view3d = createCanvas3D(stage, { height: 390 });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, ctl2, calc);

      const draw = () => {
        if (s.preset === "planes") {
          const n1 = [1, 0, 0.5], n2 = [0, 1, -0.5];
          const dir = cross3(n1, n2);
          view3d.draw({
            range: 4,
            planes: [
              { normal: n1, d: 0, color: "rgba(42,120,214,0.18)", size: 2.8 },
              { normal: n2, d: 0, color: "rgba(27,175,122,0.18)", size: 2.8 },
            ],
            segments: [{ from: [-2.5 * dir[0], -2.5 * dir[1], -2.5 * dir[2]], to: [2.5 * dir[0], 2.5 * dir[1], 2.5 * dir[2]], color: COLORS.c2, width: 3.2 }],
            vectors: [
              { to: n1, color: COLORS.c1, label: "n₁" },
              { to: n2, color: COLORS.c3, label: "n₂" },
            ],
          });
          calc.textContent = `\\(\\mathbf d = \\mathbf n_1 \\times \\mathbf n_2 = (${tx(dir[0], 2)},\\ ${tx(dir[1], 2)},\\ ${tx(dir[2], 2)})\\)`;
        } else {
          const a = [2.2, 0.4, 0], b = [0.4, 2.2, 0], c = [0.6, 0.5, s.zScale];
          const vol = Math.abs(triple3(a, b, c));
          view3d.draw({
            range: 4,
            quads: [{ pts: [[0, 0, 0], a, vAdd(a, b), b], fill: "rgba(42,120,214,0.18)", stroke: COLORS.c1 }],
            vectors: [
              { to: a, color: COLORS.c1, label: "a" },
              { to: b, color: COLORS.c3, label: "b" },
              { to: c, color: COLORS.c2, label: "c" },
            ],
          });
          calc.textContent = `\\(\\text{Hacim} = |\\mathbf a\\cdot(\\mathbf b\\times\\mathbf c)| = |\\det[\\mathbf a\\ \\mathbf b\\ \\mathbf c]| = ${tx(vol, 2)}\\)`;
        }
      };
      ctl.append(
        segmented(
          [
            ["planes", { tr: "İki düzlem kesişimi", en: "Two-plane intersection" }],
            ["vol", { tr: "Karma çarpım hacmi", en: "Triple product volume" }],
          ],
          s.preset,
          (v) => { s.preset = v; draw(); },
        ),
      );
      ctl2.append(slider("c_z", { min: 0, max: 3, step: 0.2, value: s.zScale, onInput: (v) => { s.zScale = v; draw(); } }));
      draw();
    },
  },
  mathSections: [
    {
      id: "m-sg-cross",
      title: { tr: "Vektörel Çarpım, Lagrange Özdeşliği ve Hacim", en: "Cross Product, Lagrange Identity & Volume" },
      blocks: [
        { eq: R`\|\mathbf u \times \mathbf v\|^2 = \|\mathbf u\|^2\|\mathbf v\|^2 - (\mathbf u\cdot\mathbf v)^2 = \|\mathbf u\|^2\|\mathbf v\|^2\sin^2\theta` },
        {
          derive: {
            title: { tr: "u × v'nin u ve v'ye dik olduğunun ispatı", en: "Proof that u × v is orthogonal to u and v" },
            steps: [
              { tex: R`\mathbf u \times \mathbf v = (u_2 v_3 - u_3 v_2,\ u_3 v_1 - u_1 v_3,\ u_1 v_2 - u_2 v_1)`, why: { tr: "Bileşen tanımını açarız.", en: "Write out the components of u × v." } },
              { tex: R`\mathbf u \cdot (\mathbf u \times \mathbf v) = u_1 u_2 v_3 - u_1 u_3 v_2 + u_2 u_3 v_1 - u_2 u_1 v_3 + u_3 u_1 v_2 - u_3 u_2 v_1`, why: { tr: "u ile nokta çarpımı hesaplarız.", en: "Compute the dot product with u." } },
              { tex: R`\mathbf u \cdot (\mathbf u \times \mathbf v) = 0 \quad \text{ve benzer şekilde} \quad \mathbf v \cdot (\mathbf u \times \mathbf v) = 0`, why: { tr: "Altı terim ikişer ikişer birbirini götürür; determinanta göre iki satırı aynı olduğundan 0'dır.", en: "All six terms cancel in pairs (equivalently, a determinant with two equal rows vanishes)." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-sg-plane",
      title: { tr: "Uzayda Düzlem ve Aykırı Doğru Mesafeleri", en: "Plane & Skew-Line Distance Formulas" },
      blocks: [
        { eq: R`d(Q, \Pi) = \frac{|\mathbf n\cdot Q - d|}{\|\mathbf n\|}, \qquad d(\ell_1, \ell_2) = \frac{|(P_2-P_1)\cdot(\mathbf d_1\times\mathbf d_2)|}{\|\mathbf d_1\times\mathbf d_2\|}` },
        {
          callout: "info",
          title: { tr: "Aykırı doğrular testi", en: "Skew lines test" },
          text: {
            tr: R`\(\mathbf d_1 \times \mathbf d_2 = \mathbf 0\) ise doğrular paraleldir. \(\mathbf d_1 \times \mathbf d_2 \ne \mathbf 0\) iken karma çarpım \((P_2-P_1)\cdot(\mathbf d_1\times\mathbf d_2) = 0\) ise doğrular kesişir; 0 değilse aykırıdır!`,
            en: R`If \(\mathbf d_1\times\mathbf d_2=\mathbf 0\) the lines are parallel. Otherwise they intersect iff \((P_2-P_1)\cdot(\mathbf d_1\times\mathbf d_2)=0\), and are skew otherwise!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
