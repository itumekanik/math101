import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { lineIntersection2D, pointLineDist2D, vAngle } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "pg-intro",
    title: { tr: "Düzlem Geometrisi (Analitik Geometri 2B)", en: "Plane Geometry (2D Analytic Geometry)" },
    paragraphs: [
      {
        tr: R`Düzlemde doğrular ve [[conic|konik kesitler]] cebirsel denklemlerle ifade edildiğinde uzaklık, kesişim ve açı soruları doğrudan vektör hesabına dönüşür.`,
        en: R`Expressing lines and [[conic|conic sections]] algebraically turns geometric questions of distance, intersection, and angle directly into vector calculations.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> doğruların parametrik ve kapalı (\(ax+by+c=0\)) formları arasında geçiş yapacak, [[normal-vector|normal vektörle]] nokta-doğru uzaklığını türetecek ve elips, parabol, hiperbolü dışmerkezlik \(e\) üzerinden sınıflandırabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will convert between parametric and implicit line forms (\(ax+by+c=0\)), derive point-to-line distance via the [[normal-vector|normal vector]], and classify ellipses, parabolas, and hyperbolas via eccentricity \(e\).`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 3+4 · Düzlem Geometrisi", en: "Lecture 3+4 · Plane Geometry" }],
      [{ tr: "Doğrular", en: "Lines" }, { tr: R`\(\mathbf p + t\mathbf d\ \leftrightarrow\ ax+by+c=0,\ \mathbf n=(a,b)\)`, en: R`\(\mathbf p + t\mathbf d\ \leftrightarrow\ ax+by+c=0,\ \mathbf n=(a,b)\)` }],
      [{ tr: "Konikler", en: "Conics" }, { tr: R`Çember, Elips (\(e<1\)), Parabol (\(e=1\)), Hiperbol (\(e>1\))`, en: R`Circle, Ellipse (\(e<1\)), Parabola (\(e=1\)), Hyperbola (\(e>1\))` }],
    ],
  },
  sections: [
    {
      id: "pg-lines",
      mathId: "m-pg-dist",
      title: { tr: "Doğru Denklemi ve Normal Vektör", en: "Line Equations & The Normal Vector" },
      body: [
        {
          tr: R`Kapalı denklem \(ax + by + c = 0\) bir doğruyu tek hamlede tanımlar; katsayı vektörü [[normal-vector|\(\mathbf n = (a, b)\)]] doğruya <b>her zaman diktir</b>, yön vektörü ise \(\mathbf d = (-b, a)\)'dır (\(\mathbf n\cdot\mathbf d = 0\)).`,
          en: R`The implicit equation \(ax + by + c = 0\) defines a line compactly: its coefficient vector [[normal-vector|\(\mathbf n = (a, b)\)]] is <b>always perpendicular</b> to the line, and \(\mathbf d = (-b, a)\) points along it.`,
        },
        { eq: R`d(P_0, \ell) = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}` },
        {
          tr: R`<b>Deneyin:</b> Mavi \(P_0\) noktasını düzlemde sürükleyin veya \(a, b, c\) parametrelerini değiştirin. Dik izdüşüm ayağı \(H\) ve uzaklık \(d(P_0, \ell)\) anında güncellenir.`,
          en: R`<b>Try it:</b> drag point \(P_0\) across the plane or adjust \(a, b, c\) to watch the orthogonal foot \(H\) and distance \(d(P_0, \ell)\) update live.`,
        },
      ],
      demo(box, state) {
        const s = (state.line ??= { a: 1, b: -2, c: 2, p: [1.5, 2.8] });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 280,
          interactive: true,
          hint: L({ tr: "P₀ noktasını sürükleyin", en: "Drag point P₀" }),
        });

        const draw = () => {
          const n2 = s.a * s.a + s.b * s.b || 1;
          const t = (s.a * s.p[0] + s.b * s.p[1] + s.c) / n2;
          const foot = [s.p[0] - s.a * t, s.p[1] - s.b * t];
          const dist = pointLineDist2D(s.p, s.a, s.b, s.c);
          const nLen = Math.hypot(s.a, s.b) || 1;
          plot.draw({
            x: [-5, 5],
            y: [-4, 5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a: s.a, b: s.b, c: s.c, color: COLORS.c1, width: 2.6, label: "ℓ" }],
            segments: [{ from: s.p, to: foot, color: COLORS.c2, dash: [4, 3], width: 2 }],
            vectors: [{ from: foot, to: [foot[0] + (s.a / nLen) * 1.1, foot[1] + (s.b / nLen) * 1.1], color: COLORS.c3, label: "n" }],
            points: [{ x: foot[0], y: foot[1], color: COLORS.c1, r: 4.5, label: "H" }],
            handles: [{ id: "p", x: s.p[0], y: s.p[1], color: COLORS.c2, label: "P₀", onDrag: (x, y) => { s.p = [x, y]; draw(); } }],
          });
          calc.textContent = `\\(${tx(s.a, 1)}x ${s.b >= 0 ? "+" : "-"} ${tx(Math.abs(s.b), 1)}y ${s.c >= 0 ? "+" : "-"} ${tx(Math.abs(s.c), 1)} = 0,\\qquad d(P_0,\\ell) = ${tx(dist, 3)}\\)`;
        };
        ctl.append(
          slider("a", { min: -3, max: 3, step: 0.5, value: s.a, onInput: (v) => { if (v || s.b) { s.a = v; draw(); } } }),
          slider("b", { min: -3, max: 3, step: 0.5, value: s.b, onInput: (v) => { if (v || s.a) { s.b = v; draw(); } } }),
          slider("c", { min: -4, max: 4, step: 0.5, value: s.c, onInput: (v) => { s.c = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "pg-conics",
      mathId: "m-pg-conics",
      title: { tr: "Konik Kesitler: Elips, Parabol ve Hiperbol", en: "Conic Sections: Ellipse, Parabola & Hyperbola" },
      body: [
        {
          tr: R`Bir [[conic|konik kesit]], bir odak noktası \(F\) ile doğrultman doğrusuna uzaklıklarının oranı sabit \(e\) (dışmerkezlik) olan noktaların geometrik yeridir. Standart konikler:`,
          en: R`A [[conic|conic section]] is the locus whose ratio of distances to focus \(F\) and directrix equals constant eccentricity \(e\). In standard axes:`,
        },
        { eq: R`\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1\ (\text{elips}), \qquad \frac{x^2}{a^2} - \frac{y^2}{b^2} = 1\ (\text{hiperbol}), \qquad y^2 = 4px\ (\text{parabol})` },
        {
          tr: R`<b>Deneyin:</b> Elips, parabol ve hiperbol arasında geçiş yapın; yarı eksenler \(a, b\) değiştikçe odak noktaları \(F_1, F_2\), asimptotlar ve dışmerkezlik \(e\)'nin nasıl değiştiğini inceleyin.`,
          en: R`<b>Try it:</b> switch between ellipse, parabola, and hyperbola; vary semi-axes \(a, b\) to watch foci \(F_1, F_2\), asymptotes, and eccentricity \(e\) update live.`,
        },
      ],
      demo(box, state) {
        const s = (state.conic ??= { kind: "ellipse", a: 3, b: 1.8 });
        const ctl = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 280 });

        const draw = () => {
          if (s.kind === "ellipse") {
            const major = Math.max(s.a, s.b);
            const minor = Math.min(s.a, s.b);
            const c = Math.sqrt(Math.max(0, major * major - minor * minor));
            const horiz = s.a >= s.b;
            const foci = horiz ? [[-c, 0], [c, 0]] : [[0, -c], [0, c]];
            plot.draw({
              x: [-5, 5], y: [-4, 4], equalAspect: true, xLabel: "x", yLabel: "y",
              parametrics: [{ fx: (t) => s.a * Math.cos(t), fy: (t) => s.b * Math.sin(t), t0: 0, t1: Math.PI * 2, color: COLORS.c1, width: 2.6 }],
              points: foci.map(([fx, fy], i) => ({ x: fx, y: fy, color: COLORS.c2, r: 5, label: `F${i + 1}` })),
            });
            calc.textContent = `\\(\\frac{x^2}{${tx(s.a * s.a, 2)}} + \\frac{y^2}{${tx(s.b * s.b, 2)}} = 1,\\quad c=${tx(c, 2)},\\quad e = \\frac{c}{${horiz ? "a" : "b"}} = ${tx(c / major, 3)}\\)`;
          } else if (s.kind === "hyperbola") {
            const c = Math.hypot(s.a, s.b);
            plot.draw({
              x: [-6, 6], y: [-5, 5], equalAspect: true, xLabel: "x", yLabel: "y",
              lines: [
                { a: s.b, b: -s.a, c: 0, color: COLORS.muted, dash: [5, 4] },
                { a: s.b, b: s.a, c: 0, color: COLORS.muted, dash: [5, 4] },
              ],
              parametrics: [
                { fx: (t) => s.a * Math.cosh(t), fy: (t) => s.b * Math.sinh(t), t0: -2.2, t1: 2.2, color: COLORS.c1, width: 2.6 },
                { fx: (t) => -s.a * Math.cosh(t), fy: (t) => s.b * Math.sinh(t), t0: -2.2, t1: 2.2, color: COLORS.c1, width: 2.6 },
              ],
              points: [
                { x: -c, y: 0, color: COLORS.c2, r: 5, label: "F₁" },
                { x: c, y: 0, color: COLORS.c2, r: 5, label: "F₂" },
              ],
            });
            calc.textContent = `\\(\\frac{x^2}{${tx(s.a * s.a, 2)}} - \\frac{y^2}{${tx(s.b * s.b, 2)}} = 1,\\quad c=${tx(c, 2)},\\quad e = ${tx(c / s.a, 3)} > 1\\)`;
          } else {
            const p = s.a * 0.5;
            plot.draw({
              x: [-4, 6], y: [-5, 5], equalAspect: true, xLabel: "x", yLabel: "y",
              lines: [{ a: 1, b: 0, c: p, color: COLORS.c3, dash: [5, 4], label: `x = -${ns(p, 2)}` }],
              parametrics: [{ fx: (t) => (t * t) / (4 * p), fy: (t) => t, t0: -5, t1: 5, color: COLORS.c1, width: 2.6 }],
              points: [{ x: p, y: 0, color: COLORS.c2, r: 5.5, label: "F" }],
            });
            calc.textContent = `\\(y^2 = ${tx(4 * p, 2)}x,\\qquad F=(${tx(p, 2)}, 0),\\qquad e = 1\\)`;
          }
        };
        ctl.append(
          segmented(
            [
              ["ellipse", { tr: "Elips", en: "Ellipse" }],
              ["parabola", { tr: "Parabol", en: "Parabola" }],
              ["hyperbola", { tr: "Hiperbol", en: "Hyperbola" }],
            ],
            s.kind,
            (v) => { s.kind = v; draw(); },
          ),
        );
        ctl2.append(
          slider("a", { min: 0.6, max: 4, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
          slider("b", { min: 0.6, max: 3.5, step: 0.2, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "İki Doğru: Kesişim, Paralellik ve Açı", en: "Two Lines: Intersection, Parallelism & Angle" },
    sub: {
      tr: R`İki doğrunun katsayılarını değiştirin; kesişim noktasını, aralarındaki dar açıyı ve paralellik durumunu canlı izleyin.`,
      en: R`Adjust coefficients of two lines to inspect their intersection point, acute angle, and parallel/coincident cases live.`,
    },
    build(host, state) {
      const s = (state.pg ??= { a1: 1, b1: -1, c1: 1, a2: 1, b2: 2, c2: -4 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 390 });
      const ctl1 = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const msg = h("p", { class: "pc-msg" });
      side.append(
        h("div", { class: "mini-title", text: "ℓ₁ : a₁x + b₁y + c₁ = 0" }),
        ctl1,
        h("div", { class: "mini-title", text: "ℓ₂ : a₂x + b₂y + c₂ = 0" }),
        ctl2,
        tiles,
        msg,
      );

      const draw = () => {
        const pt = lineIntersection2D([s.a1, s.b1, s.c1], [s.a2, s.b2, s.c2]);
        const angRaw = (vAngle([s.a1, s.b1], [s.a2, s.b2]) * 180) / Math.PI;
        const acute = Math.min(angRaw, 180 - angRaw);
        const det = s.a1 * s.b2 - s.a2 * s.b1;
        plot.draw({
          x: [-6, 6], y: [-6, 6], equalAspect: true, xLabel: "x", yLabel: "y",
          lines: [
            { a: s.a1, b: s.b1, c: s.c1, color: COLORS.c1, width: 2.6, label: "ℓ₁" },
            { a: s.a2, b: s.b2, c: s.c2, color: COLORS.c2, width: 2.6, label: "ℓ₂" },
          ],
          points: pt ? [{ x: pt[0], y: pt[1], color: COLORS.c3, r: 6.5, ring: true, label: `(${ns(pt[0], 2)}, ${ns(pt[1], 2)})` }] : [],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "det(n₁, n₂)" }), h("span", { class: "pg-tile-value", text: ns(det, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Dar açı", en: "Acute angle" }) }), h("span", { class: "pg-tile-value", text: `${ns(acute, 1)}°` })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Kesişim", en: "Intersection" }) }), h("span", { class: "pg-tile-value", text: pt ? `(${ns(pt[0], 1)}, ${ns(pt[1], 1)})` : "∅" })),
        );
        if (pt) {
          msg.className = "pc-msg good";
          msg.textContent = L({ tr: "Determinant ≠ 0: doğrular tek bir noktada kesişir.", en: "Determinant ≠ 0: the lines meet at a unique point." });
        } else {
          msg.className = "pc-msg bad";
          msg.textContent = L({ tr: "Normal vektörler paralel (det = 0): doğrular paralel veya çakışık!", en: "Parallel normals (det = 0): the lines are parallel or coincident!" });
        }
      };
      ctl1.append(
        slider("a₁", { min: -3, max: 3, step: 0.5, value: s.a1, onInput: (v) => { if (v || s.b1) { s.a1 = v; draw(); } } }),
        slider("b₁", { min: -3, max: 3, step: 0.5, value: s.b1, onInput: (v) => { if (v || s.a1) { s.b1 = v; draw(); } } }),
        slider("c₁", { min: -5, max: 5, step: 0.5, value: s.c1, onInput: (v) => { s.c1 = v; draw(); } }),
      );
      ctl2.append(
        slider("a₂", { min: -3, max: 3, step: 0.5, value: s.a2, onInput: (v) => { if (v || s.b2) { s.a2 = v; draw(); } } }),
        slider("b₂", { min: -3, max: 3, step: 0.5, value: s.b2, onInput: (v) => { if (v || s.a2) { s.b2 = v; draw(); } } }),
        slider("c₂", { min: -5, max: 5, step: 0.5, value: s.c2, onInput: (v) => { s.c2 = v; draw(); } }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-pg-dist",
      title: { tr: "Noktanın Doğruya Uzaklığı Formülünün İspatı", en: "Derivation of Point-to-Line Distance" },
      blocks: [
        {
          derive: {
            title: { tr: "Dik izdüşümle nokta–doğru uzaklığı", en: "Point-to-line distance via normal projection" },
            steps: [
              { tex: R`\ell:\ \mathbf n \cdot \mathbf x + c = 0, \qquad \mathbf n = (a, b) \ne \mathbf 0`, why: { tr: "Doğruyu normal vektör biçiminde yazarız.", en: "Write the line using its normal vector n = (a, b)." } },
              { tex: R`Q \in \ell \implies \mathbf n \cdot Q = -c`, why: { tr: "Doğru üzerinde herhangi bir Q noktası seçilir.", en: "Pick any anchor point Q lying on the line." } },
              { tex: R`d(P_0, \ell) = \left|\frac{\mathbf n \cdot (P_0 - Q)}{\|\mathbf n\|}\right| = \frac{|\mathbf n\cdot P_0 - \mathbf n\cdot Q|}{\|\mathbf n\|}`, why: { tr: "Uzaklık, P₀−Q vektörünün birim normal üzerine skaler izdüşümüdür.", en: "Distance equals the magnitude of projecting P₀−Q onto the unit normal." } },
              { tex: R`d(P_0, \ell) = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}`, why: { tr: "−n·Q = c yerine yazılınca ünlü uzaklık formülü çıkar.", en: "Substituting −n·Q = c gives the distance formula." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-pg-conics",
      title: { tr: "Konik Kesitlerin Standart Denklemleri", en: "Canonical Equations of Conic Sections" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Konik", en: "Conic" },
              { tr: "Standart denklem", en: "Canonical equation" },
              { tr: "Odak ilişkisi", en: "Focus relation" },
              { tr: "Dışmerkezlik e", en: "Eccentricity e" },
            ],
            rows: [
              [{ tr: "Çember", en: "Circle" }, R`\(x^2 + y^2 = r^2\)`, R`\(c = 0\)`, R`\(e = 0\)`],
              [{ tr: "Elips", en: "Ellipse" }, R`\(\frac{x^2}{a^2}+\frac{y^2}{b^2}=1\ (a>b)\)`, R`\(c^2 = a^2 - b^2\)`, R`\(e = c/a \in (0,1)\)`],
              [{ tr: "Parabol", en: "Parabola" }, R`\(y^2 = 4px\)`, R`\(F = (p,0)\)`, R`\(e = 1\)`],
              [{ tr: "Hiperbol", en: "Hyperbola" }, R`\(\frac{x^2}{a^2}-\frac{y^2}{b^2}=1\)`, R`\(c^2 = a^2 + b^2\)`, R`\(e = c/a > 1\)`],
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
