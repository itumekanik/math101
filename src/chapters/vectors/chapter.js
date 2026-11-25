import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { vAdd, vAngle, vDot, vNorm, vProject, vScale, vSub } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "vec-intro",
    title: { tr: "Sayılar, Noktalar ve Vektörler", en: "Numbers, Points, and Vectors" },
    paragraphs: [
      {
        tr: R`Sayı kümeleri hiyerarşisi \(\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}\) tek boyutlu sayı doğrusunu doldurur. İki veya daha fazla koordinatı birleştirdiğimizde düzlemde (\(\mathbb{R}^2\)) ve uzayda (\(\mathbb{R}^n\)) noktalar ve [[vector|vektörler]] ortaya çıkar.`,
        en: R`The number hierarchy \(\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}\) fills the real line. Grouping coordinates together yields points and [[vector|vectors]] in \(\mathbb{R}^2\) and \(\mathbb{R}^n\).`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> vektör toplama ve skaler çarpmayı geometrik olarak görecek, [[norm|Öklid normunu]] ve [[dot-product|nokta çarpımı]] açı ve dik [[projection|izdüşüm]] ile bağlayacak, ayrıca [[cauchy-schwarz|Cauchy–Schwarz]] ve üçgen eşitsizliklerini ispatlayabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will visualize vector addition and scaling, connect [[norm|Euclidean norm]] and [[dot-product|dot product]] to angles and orthogonal [[projection|projection]], and prove the [[cauchy-schwarz|Cauchy–Schwarz]] and triangle inequalities.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 2 · Sayılar, Noktalar ve Vektörler", en: "Lecture 2 · Numbers, Points, and Vectors" }],
      [{ tr: "Temel araçlar", en: "Core tools" }, { tr: R`\(\|\mathbf v\|,\ \mathbf u\cdot\mathbf v,\ \cos\theta,\ \operatorname{proj}_{\mathbf v}\mathbf u\)`, en: R`\(\|\mathbf v\|,\ \mathbf u\cdot\mathbf v,\ \cos\theta,\ \operatorname{proj}_{\mathbf v}\mathbf u\)` }],
      [{ tr: "Büyük eşitsizlikler", en: "Key inequalities" }, { tr: "Cauchy–Schwarz ve Üçgen Eşitsizliği", en: "Cauchy–Schwarz & Triangle Inequality" }],
    ],
    tip: {
      title: { tr: "Nokta mı, vektör mü?", en: "Point vs. vector" },
      text: {
        tr: R`Bir \(P\) noktası uzaydaki bir konumu, \(\overrightarrow{PQ} = Q - P\) vektörü ise bir yer değiştirmeyi temsil eder. Orijine sabitlenen konum vektörü \(\overrightarrow{OP}\) ikisini özdeşleştirir.`,
        en: R`A point \(P\) marks a location, while \(\overrightarrow{PQ} = Q - P\) is a displacement. Anchoring vectors at the origin identifies \(P\) with its position vector \(\overrightarrow{OP}\).`,
      },
    },
  },
  sections: [
    {
      id: "vec-ops",
      mathId: "m-vec-dot",
      title: { tr: "Vektör Toplama ve Skaler Çarpma", en: "Vector Addition & Scalar Multiplication" },
      body: [
        {
          tr: R`İki [[vector|vektörün]] toplamı \(\mathbf u + \mathbf v\) bileşen bileşen yapılır; geometrik olarak <b>paralelkenar kuralıdır</b>. Bir \(\lambda\in\mathbb{R}\) skaleriyle çarpım \(\lambda\mathbf u\) vektörü ölçekler (\(\lambda < 0\) ise yönünü ters çevirir).`,
          en: R`Vector addition \(\mathbf u + \mathbf v\) acts componentwise and forms the diagonal of a <b>parallelogram</b>. Multiplying by a scalar \(\lambda\in\mathbb{R}\) stretches \(\mathbf u\) (and reverses it if \(\lambda < 0\)).`,
        },
        { eq: R`\mathbf u + \mathbf v = (u_1+v_1,\ u_2+v_2), \qquad \lambda\mathbf u = (\lambda u_1,\ \lambda u_2)` },
        {
          tr: R`<b>Deneyin:</b> Sağdaki düzlemde \(\mathbf u\) (mavi) ve \(\mathbf v\) (yeşil) uçlarını sürükleyin; \(\lambda\) kaydırıcısıyla \(\lambda\mathbf u + \mathbf v\) doğrusal bileşimini izleyin.`,
          en: R`<b>Try it:</b> drag the tips of \(\mathbf u\) (blue) and \(\mathbf v\) (green) on the plane, and adjust \(\lambda\) to observe the linear combination \(\lambda\mathbf u + \mathbf v\).`,
        },
      ],
      demo(box, state) {
        const s = (state.ops ??= { u: [2.2, 1.2], v: [0.8, 2.2], lam: 1 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "u ve v uçlarını sürükleyin", en: "Drag the tips of u and v" }),
        });
        const draw = () => {
          const lu = vScale(s.u, s.lam);
          const sum = vAdd(lu, s.v);
          plot.draw({
            x: [-5, 5],
            y: [-4, 5],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            polygons: [{ pts: [[0, 0], [lu[0], lu[1]], [sum[0], sum[1]], [s.v[0], s.v[1]]], fill: "rgba(42,120,214,0.09)", stroke: COLORS.muted, dash: [4, 4], width: 1.2 }],
            vectors: [
              { to: s.u, color: COLORS.c1, label: "u" },
              { to: s.v, color: COLORS.c3, label: "v" },
              ...(s.lam !== 1 ? [{ to: [lu[0], lu[1]], color: COLORS.c1, dash: [4, 3], label: "λu" }] : []),
              { to: [sum[0], sum[1]], color: COLORS.c2, width: 3, label: "λu+v" },
            ],
            handles: [
              { id: "u", x: s.u[0], y: s.u[1], color: COLORS.c1, onDrag: (x, y) => { s.u = [x, y]; draw(); } },
              { id: "v", x: s.v[0], y: s.v[1], color: COLORS.c3, onDrag: (x, y) => { s.v = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(${tx(s.lam, 1)}\\mathbf u + \\mathbf v = (${tx(sum[0], 2)},\\ ${tx(sum[1], 2)}),\\quad \\|\\mathbf u\\|=${tx(vNorm(s.u), 2)},\\; \\|\\mathbf v\\|=${tx(vNorm(s.v), 2)}\\)`;
        };
        ctl.append(slider("λ", { min: -2, max: 2, step: 0.1, value: s.lam, onInput: (v) => { s.lam = v; draw(); } }));
        draw();
      },
    },
    {
      id: "vec-dot",
      mathId: "m-vec-dot",
      title: { tr: "Nokta Çarpım, Açı ve Diklik", en: "Dot Product, Angle & Orthogonality" },
      body: [
        {
          tr: R`[[dot-product|Nokta çarpım]] iki vektörün ne kadar aynı yöne baktığını ölçer. İşareti doğrudan aradaki \(\theta\) açısını belirler: pozitifse dar açı, 0 ise <b>dik (ortogonal)</b>, negatifse geniş açı!`,
          en: R`The [[dot-product|dot product]] measures directional alignment. Its sign immediately classifies the angle \(\theta\): positive means acute, zero means <b>orthogonal</b>, negative means obtuse.`,
        },
        { eq: R`\mathbf u \cdot \mathbf v = u_1 v_1 + u_2 v_2 = \|\mathbf u\|\,\|\mathbf v\|\cos\theta` },
        {
          tr: R`<b>Deneyin:</b> \(\mathbf u\)'yu döndürün ve \(\mathbf u\cdot\mathbf v = 0\) olduğunda iki vektörün tam \(90^\circ\) dikleştiğini görün.`,
          en: R`<b>Try it:</b> rotate \(\mathbf u\) and watch \(\mathbf u\cdot\mathbf v = 0\) happen at the exact \(90^\circ\) right angle.`,
        },
      ],
      demo(box, state) {
        const s = (state.dot ??= { ang: 55, len: 2.8 });
        const v = [3, 0];
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc, msg);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const rad = (s.ang * Math.PI) / 180;
          const u = [s.len * Math.cos(rad), s.len * Math.sin(rad)];
          const dp = vDot(u, v);
          const pr = vProject(u, v);
          plot.draw({
            x: [-4, 4.5],
            y: [-3, 3.8],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            angles: [{ cx: 0, cy: 0, r: 0.9, start: 0, end: rad, color: COLORS.c2, label: `${s.ang}°` }],
            segments: [{ from: [u[0], u[1]], to: [pr[0], pr[1]], color: COLORS.muted, dash: [4, 3] }],
            vectors: [
              { to: v, color: COLORS.c3, label: "v" },
              { to: [pr[0], pr[1]], color: COLORS.c2, width: 3.5, label: "proj" },
              { to: [u[0], u[1]], color: COLORS.c1, label: "u" },
            ],
          });
          calc.textContent = `\\(\\mathbf u\\cdot\\mathbf v = ${tx(dp, 2)},\\qquad \\cos\\theta = ${tx(Math.cos(rad), 3)},\\qquad \\operatorname{proj}_{\\mathbf v}\\mathbf u = (${tx(pr[0], 2)},\\ 0)\\)`;
          if (Math.abs(dp) < 0.08) {
            msg.className = "pc-msg good";
            msg.textContent = L({ tr: "Dik (Ortogonal): u·v = 0 ve izdüşüm sıfır vektörü!", en: "Orthogonal: u·v = 0 and the projection collapses to the zero vector!" });
          } else if (dp > 0) {
            msg.className = "pc-msg info";
            msg.textContent = L({ tr: "Dar açı (u·v > 0): u'nun v yönünde pozitif bileşeni var.", en: "Acute angle (u·v > 0): u has a positive component along v." });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({ tr: "Geniş açı (u·v < 0): u, v'nin ters yönüne bakıyor.", en: "Obtuse angle (u·v < 0): u points opposite to v." });
          }
        };
        ctl.append(
          slider("θ (°)", { min: 0, max: 180, step: 5, value: s.ang, fmt: (v) => `${v}°`, onInput: (v) => { s.ang = v; draw(); } }),
          slider("‖u‖", { min: 0.5, max: 3.5, step: 0.1, value: s.len, onInput: (v) => { s.len = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "vec-ineq",
      mathId: "m-vec-cs",
      title: { tr: "Cauchy–Schwarz ve Üçgen Eşitsizliği", en: "Cauchy–Schwarz & Triangle Inequality" },
      body: [
        {
          tr: R`İki temel eşitsizlik tüm Öklid geometrisini yönetir: [[cauchy-schwarz|Cauchy–Schwarz]] \(|\mathbf u\cdot\mathbf v|\le\|\mathbf u\|\|\mathbf v\|\) ve üçgen eşitsizliği \(\|\mathbf u+\mathbf v\|\le\|\mathbf u\|+\|\mathbf v\|\). Her ikisinde de eşitlik yalnızca vektörler aynı (veya zıt) doğruda olduğunda sağlanır.`,
          en: R`Two inequalities govern Euclidean geometry: [[cauchy-schwarz|Cauchy–Schwarz]] \(|\mathbf u\cdot\mathbf v|\le\|\mathbf u\|\|\mathbf v\|\) and the triangle inequality \(\|\mathbf u+\mathbf v\|\le\|\mathbf u\|+\|\mathbf v\|\). Equality holds iff the vectors are collinear.`,
        },
        { eq: R`|\mathbf u \cdot \mathbf v| \le \|\mathbf u\|\,\|\mathbf v\|, \qquad \|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|` },
        {
          tr: R`<b>Deneyin:</b> \(\mathbf u\) ve \(\mathbf v\)'yi sürükleyip iki eşitsizliğin sol ve sağ taraflarını canlı karşılaştırın; vektörleri aynı doğrultuya getirip eşitlik anını yakalayın.`,
          en: R`<b>Try it:</b> drag \(\mathbf u\) and \(\mathbf v\) to compare both sides of the inequalities live; align them to witness equality.`,
        },
      ],
      demo(box, state) {
        const s = (state.ineq ??= { u: [2.4, 0.8], v: [0.6, 2.2] });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(host, calc);
        const plot = createCanvas2D(host, {
          height: 260,
          interactive: true,
          hint: L({ tr: "Noktaları sürükleyin", en: "Drag tips" }),
        });
        const draw = () => {
          const sum = vAdd(s.u, s.v);
          const nu = vNorm(s.u), nv = vNorm(s.v), nsum = vNorm(sum);
          const dp = Math.abs(vDot(s.u, s.v));
          plot.draw({
            x: [-4, 5],
            y: [-3, 5],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            polygons: [{ pts: [[0, 0], s.u, [sum[0], sum[1]]], fill: "rgba(27,175,122,0.12)" }],
            vectors: [
              { to: s.u, color: COLORS.c1, label: "u" },
              { from: s.u, to: [sum[0], sum[1]], color: COLORS.c3, label: "v" },
              { to: [sum[0], sum[1]], color: COLORS.c2, width: 2.8, label: "u+v" },
            ],
            handles: [
              { id: "u", x: s.u[0], y: s.u[1], color: COLORS.c1, onDrag: (x, y) => { s.u = [x, y]; draw(); } },
              { id: "v", x: s.v[0], y: s.v[1], color: COLORS.c3, onDrag: (x, y) => { s.v = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(|\\mathbf u\\cdot\\mathbf v| = ${tx(dp, 2)} \\le \\|\\mathbf u\\|\\|\\mathbf v\\| = ${tx(nu * nv, 2)}\\qquad|\\qquad \\|\\mathbf u+\\mathbf v\\| = ${tx(nsum, 2)} \\le \\|\\mathbf u\\|+\\|\\mathbf v\\| = ${tx(nu + nv, 2)}\\)`;
        };
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "2B Vektör Laboratuvarı", en: "2D Vector Lab" },
    sub: {
      tr: R`\(\mathbf u\) ve \(\mathbf v\) uçlarını serbestçe sürükleyin; fark, dik izdüşüm ve birim vektörleri açıp kapatarak tüm nicelikleri anlık görün.`,
      en: R`Drag \(\mathbf u\) and \(\mathbf v\) freely; toggle difference, orthogonal projection, and unit vectors while inspecting every metric live.`,
    },
    build(host, state) {
      const s = (state.pg ??= { u: [3, 1.5], v: [1, 2.5], mode: "proj" });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const plot = createCanvas2D(stage, {
        height: 400,
        interactive: true,
        hint: L({ tr: "u ve v uçlarını sürükleyin", en: "Drag tips of u and v" }),
      });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, tiles, calc);

      const draw = () => {
        const sum = vAdd(s.u, s.v);
        const diff = vSub(s.u, s.v);
        const proj = vProject(s.u, s.v);
        const deg = (vAngle(s.u, s.v) * 180) / Math.PI;
        const detArea = Math.abs(s.u[0] * s.v[1] - s.u[1] * s.v[0]);
        const extra = [];
        const segs = [];
        if (s.mode === "sum") extra.push({ to: [sum[0], sum[1]], color: COLORS.c2, label: "u+v" });
        if (s.mode === "diff") extra.push({ from: s.v, to: s.u, color: COLORS.c2, label: "u−v" });
        if (s.mode === "proj") {
          extra.push({ to: [proj[0], proj[1]], color: COLORS.c2, width: 3, label: "proj" });
          segs.push({ from: s.u, to: [proj[0], proj[1]], color: COLORS.muted, dash: [4, 3] });
        }
        if (s.mode === "unit") {
          const nu = vNorm(s.u) || 1;
          const nv = vNorm(s.v) || 1;
          extra.push(
            { to: [s.u[0] / nu, s.u[1] / nu], color: COLORS.c2, width: 3, label: "û" },
            { to: [s.v[0] / nv, s.v[1] / nv], color: COLORS.c4, width: 3, label: "v̂" },
          );
        }
        plot.draw({
          x: [-5, 5],
          y: [-5, 5],
          equalAspect: true,
          xLabel: "x",
          yLabel: "y",
          circles: s.mode === "unit" ? [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [4, 4] }] : [],
          segments: segs,
          vectors: [
            { to: s.u, color: COLORS.c1, label: "u" },
            { to: s.v, color: COLORS.c3, label: "v" },
            ...extra,
          ],
          handles: [
            { id: "u", x: s.u[0], y: s.u[1], color: COLORS.c1, onDrag: (x, y) => { s.u = [x, y]; draw(); } },
            { id: "v", x: s.v[0], y: s.v[1], color: COLORS.c3, onDrag: (x, y) => { s.v = [x, y]; draw(); } },
          ],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "u · v" }), h("span", { class: "pg-tile-value", text: ns(vDot(s.u, s.v), 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "θ" }), h("span", { class: "pg-tile-value", text: `${ns(deg, 1)}°` })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Alan |det|", en: "Area |det|" }) }), h("span", { class: "pg-tile-value", text: ns(detArea, 2) })),
        );
        calc.textContent = `\\(\\mathbf u=(${tx(s.u[0], 2)},${tx(s.u[1], 2)}),\\; \\mathbf v=(${tx(s.v[0], 2)},${tx(s.v[1], 2)}),\\; \\|\\mathbf u-\\mathbf v\\|=${tx(vNorm(diff), 2)}\\)`;
      };
      ctl.append(
        segmented(
          [
            ["proj", { tr: "İzdüşüm", en: "Projection" }],
            ["sum", { tr: "Toplam u+v", en: "Sum u+v" }],
            ["diff", { tr: "Fark u−v", en: "Diff u−v" }],
            ["unit", { tr: "Birim vektör", en: "Unit vectors" }],
          ],
          s.mode,
          (v) => { s.mode = v; draw(); },
        ),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-vec-dot",
      title: { tr: "Nokta Çarpım ve Kosinüs Teoremi Bağlantısı", en: "Dot Product via the Law of Cosines" },
      blocks: [
        { eq: R`\mathbf u \cdot \mathbf v = \sum_{i=1}^n u_i v_i = \|\mathbf u\|\,\|\mathbf v\|\cos\theta` },
        {
          derive: {
            title: { tr: "Cebirsel ve geometrik nokta çarpımın denkliği", en: "Equivalence of algebraic and geometric dot products" },
            steps: [
              { tex: R`\|\mathbf u - \mathbf v\|^2 = \|\mathbf u\|^2 + \|\mathbf v\|^2 - 2\|\mathbf u\|\|\mathbf v\|\cos\theta`, why: { tr: "Kenarları u, v ve u−v olan üçgende Kosinüs Teoremi.", en: "Law of Cosines on the triangle with sides u, v, and u−v." } },
              { tex: R`\|\mathbf u - \mathbf v\|^2 = (\mathbf u - \mathbf v)\cdot(\mathbf u - \mathbf v) = \|\mathbf u\|^2 - 2(\mathbf u\cdot\mathbf v) + \|\mathbf v\|^2`, why: { tr: "Cebirsel açılım yapılır (çift doğrusallık ve simetri).", en: "Expand algebraically using bilinearity and symmetry." } },
              { tex: R`-2(\mathbf u\cdot\mathbf v) = -2\|\mathbf u\|\|\mathbf v\|\cos\theta \implies \mathbf u\cdot\mathbf v = \|\mathbf u\|\|\mathbf v\|\cos\theta`, why: { tr: "İki ifade eşitlenip ortak terimler sadeleştirilir.", en: "Equate the two expansions and cancel common terms." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-vec-cs",
      title: { tr: "Cauchy–Schwarz ve Üçgen Eşitsizliğinin İspatı", en: "Proof of Cauchy–Schwarz & Triangle Inequality" },
      blocks: [
        {
          derive: {
            title: { tr: "Cauchy–Schwarz Eşitsizliği (Her boyutta geçerli ispat)", en: "Cauchy–Schwarz Inequality (Dimension-free proof)" },
            steps: [
              { tex: R`p(t) = \|\mathbf u + t\mathbf v\|^2 = \|\mathbf v\|^2 t^2 + 2(\mathbf u\cdot\mathbf v)\,t + \|\mathbf u\|^2 \ge 0`, why: { tr: "Her reel t için bir normun karesi negatif olamaz (v ≠ 0).", en: "For every real t, a squared norm is nonnegative (assume v ≠ 0)." } },
              { tex: R`\Delta = \big(2(\mathbf u\cdot\mathbf v)\big)^2 - 4\|\mathbf v\|^2\|\mathbf u\|^2 \le 0`, why: { tr: "Daima ≥ 0 olan bir ikinci derece polinomun diskriminantı ≤ 0 olmalıdır.", en: "A nonnegative quadratic polynomial must have discriminant Δ ≤ 0." } },
              { tex: R`(\mathbf u\cdot\mathbf v)^2 \le \|\mathbf u\|^2\|\mathbf v\|^2 \implies |\mathbf u\cdot\mathbf v| \le \|\mathbf u\|\|\mathbf v\|`, why: { tr: "4 ile bölüp karekök alınarak ispat tamamlanır.", en: "Divide by 4 and take square roots to finish." } },
            ],
          },
        },
        {
          derive: {
            title: { tr: "Üçgen Eşitsizliği", en: "Triangle Inequality" },
            steps: [
              { tex: R`\|\mathbf u + \mathbf v\|^2 = \|\mathbf u\|^2 + 2(\mathbf u\cdot\mathbf v) + \|\mathbf v\|^2`, why: { tr: "Normun karesi açılır.", en: "Expand the squared norm." } },
              { tex: R`\le \|\mathbf u\|^2 + 2\|\mathbf u\|\|\mathbf v\| + \|\mathbf v\|^2 = (\|\mathbf u\| + \|\mathbf v\|)^2`, why: { tr: "Cauchy–Schwarz gereği u·v ≤ |u·v| ≤ ‖u‖‖v‖.", en: "By Cauchy–Schwarz, u·v ≤ ‖u‖‖v‖." } },
              { tex: R`\|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|`, why: { tr: "Her iki taraf ≥ 0 olduğundan karekök alınır.", en: "Both sides are nonnegative, so take square roots." } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
