import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

const TRANS_FNS = {
  exp: { name: "eˣ", f: (x) => Math.exp(x), inv: (x) => (x > 0 ? Math.log(x) : NaN), dom: "ℝ", img: "(0, ∞)" },
  sin: { name: "sin(x)", f: (x) => Math.sin(x), inv: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : NaN), dom: "[-π/2, π/2]", img: "[-1, 1]" },
  tan: { name: "tan(x)", f: (x) => Math.tan(x), inv: (x) => Math.atan(x), dom: "(-π/2, π/2)", img: "ℝ" },
  sinh: { name: "sinh(x)", f: (x) => Math.sinh(x), inv: (x) => Math.asinh(x), dom: "ℝ", img: "ℝ" },
  cosh: { name: "cosh(x)", f: (x) => Math.cosh(x), inv: (x) => (x >= 1 ? Math.acosh(x) : NaN), dom: "[0, ∞)", img: "[1, ∞)" },
  tanh: { name: "tanh(x)", f: (x) => Math.tanh(x), inv: (x) => (Math.abs(x) < 1 ? Math.atanh(x) : NaN), dom: "ℝ", img: "(-1, 1)" },
};

mountChapter({
  intro: {
    id: "fn-intro",
    title: { tr: "Fonksiyonlar ve Aşkın Fonksiyonlar", en: "Functions and Transcendental Functions" },
    paragraphs: [
      {
        tr: R`Bir [[function|fonksiyon]] \(f: A \to B\), tanım kümesindeki her girdiyi tek bir çıktıya eşler. Analiz ve lineer cebir boyunca tüm kavramlar (limit, türev, integral, seri) fonksiyonların yapısal özellikleri üzerine kurulur.`,
        en: R`A [[function|function]] \(f: A \to B\) assigns a unique output to every input in its domain. Every concept in calculus and linear algebra (limits, derivatives, integrals, series) builds on structural properties of functions.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> şunları yapabileceksiniz: tanım ve görüntü kümesini belirlemek; [[injective|birebirlik]] ve [[inverse-fn|ters fonksiyon]] varlığını yatay doğru testiyle sınamak; grafik dönüşümlerini \(a\,f(b(x-c))+d\) okumak; ve [[transcendental|aşkın fonksiyonların]] (\(e^x, \ln x, \sin x, \sinh x, \cosh x\)) temel özdeşliklerini kullanmak.`,
        en: R`<b>By the end of this chapter</b> you will be able to determine domains and ranges, test [[injective|injectivity]] and [[inverse-fn|invertibility]] via the horizontal-line test, read graph transformations \(a\,f(b(x-c))+d\), and apply identities of [[transcendental|transcendental functions]] (\(e^x, \ln x, \sin x, \sinh x, \cosh x\)).`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 1 · Fonksiyonlar + Aşkın Fonksiyonlar", en: "Lecture 1 · Functions + Transcendental Functions" }],
      [{ tr: "Temel fikirler", en: "Core ideas" }, { tr: "Tanım/görüntü, bileşke, ters fonksiyon, parite, periyot", en: "Domain/range, composition, inverse, parity, periodicity" }],
      [{ tr: "Aşkın aileler", en: "Transcendental families" }, { tr: R`\(e^x,\ \ln x,\ \sin/\cos/\tan,\ \sinh/\cosh/\tanh\)`, en: R`\(e^x,\ \ln x,\ \sin/\cos/\tan,\ \sinh/\cosh/\tanh\)` }],
    ],
    tip: {
      title: { tr: "Sözlü sınav ipucu", en: "Oral exam tip" },
      text: {
        tr: R`\(\sin x\) tüm \(\mathbb{R}\)'de birebir değildir; \(\arcsin x\) tanımlamak için tanım kümesini \([-\pi/2,\pi/2]\)'ye kısıtlarız. Aynı mantık \(\arccos\) (\([0,\pi]\)) ve \(\operatorname{arccosh}\) (\([0,\infty)\)) için de geçerlidir.`,
        en: R`\(\sin x\) is not injective on all of \(\mathbb{R}\); we restrict its domain to \([-\pi/2,\pi/2]\) to define \(\arcsin x\). The same domain restriction yields \(\arccos\) on \([0,\pi]\) and \(\operatorname{arccosh}\) on \([0,\infty)\).`,
      },
    },
  },
  sections: [
    {
      id: "fn-injective",
      mathId: "m-fn-inv",
      title: { tr: "Birebirlik, Örtenlik ve Yatay Doğru Testi", en: "Injectivity, Surjectivity & Horizontal-Line Test" },
      body: [
        {
          tr: R`Bir fonksiyonun [[inverse-fn|tersinin]] var olabilmesi için her çıktıya en fazla bir girdi karşılık gelmelidir ([[injective|birebirlik]]). Geometrik olarak, yatay \(y = c\) doğrusu grafiği birden fazla noktada kesiyorsa fonksiyon o aralıkta birebir değildir.`,
          en: R`For a function to have an [[inverse-fn|inverse]], each output must come from at most one input ([[injective|injectivity]]). Geometrically, if any horizontal line \(y = c\) hits the graph more than once, the function is not injective on that domain.`,
        },
        { eq: R`f(x_1) = f(x_2) \implies x_1 = x_2 \quad (\text{birebir / injective})` },
        {
          tr: R`<b>Deneyin:</b> Aşağıdaki fonksiyonlar arasında geçiş yapıp \(y = c\) yatay doğrusunu kaydırın. \(x^2\) ve \(\sin x\) için birden fazla kesişim noktası çıktığına, \(x^3\) ve \(e^x\) için ise her \(c\) değerinde en fazla tek kesişim olduğuna dikkat edin.`,
          en: R`<b>Try it:</b> switch functions and slide the horizontal line \(y = c\). Notice multiple intersections for \(x^2\) and \(\sin x\), whereas \(x^3\) and \(e^x\) intersect any horizontal line at most once.`,
        },
      ],
      demo(box, state) {
        const s = (state.inj ??= { fn: "sq", c: 1.5 });
        const fns = {
          sq: { name: "x²", f: (x) => x * x, roots: (c) => (c > 0 ? [-Math.sqrt(c), Math.sqrt(c)] : c === 0 ? [0] : []) },
          cube: { name: "x³", f: (x) => x * x * x / 3, roots: (c) => [Math.cbrt(3 * c)] },
          sin: { name: "sin(x)", f: (x) => Math.sin(x), roots: (c) => {
            if (Math.abs(c) > 1) return [];
            const a = Math.asin(c);
            return [-Math.PI - a, a, Math.PI - a, 2 * Math.PI + a].filter((x) => x >= -4.5 && x <= 4.5);
          } },
          exp: { name: "eˣ", f: (x) => Math.exp(x / 1.5), roots: (c) => (c > 0 ? [1.5 * Math.log(c)] : []) },
        };
        const ctl = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, plotHost, msg);
        const plot = createCanvas2D(plotHost, { height: 270 });

        const draw = () => {
          const cur = fns[s.fn];
          const xs = cur.roots(s.c).filter((x) => x >= -4.5 && x <= 4.5);
          plot.draw({
            x: [-4.5, 4.5],
            y: [-3.5, 4.5],
            xLabel: "x",
            yLabel: "y",
            curves: [{ f: cur.f, color: COLORS.c1, width: 2.6 }],
            lines: [{ a: 0, b: 1, c: -s.c, color: COLORS.c2, dash: [6, 4], label: `y = ${ns(s.c, 2)}` }],
            points: xs.map((x) => ({ x, y: s.c, color: xs.length > 1 ? COLORS.bad : COLORS.c3, r: 6, ring: true })),
          });
          if (xs.length > 1) {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `y = ${ns(s.c, 2)} doğrusu grafiği ${xs.length} noktada kesiyor → birebir DEĞİL!`,
              en: `y = ${ns(s.c, 2)} crosses the graph ${xs.length} times → NOT injective!`,
            });
          } else if (xs.length === 1) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Tek kesişim (x ≈ ${ns(xs[0], 2)}). Bu düzeyde her çıktıya tek girdi karşılık geliyor.`,
              en: `Unique intersection (x ≈ ${ns(xs[0], 2)}). A single input maps to this output.`,
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `y = ${ns(s.c, 2)} görüntü kümesinde değil (kesişim yok → ℝ üzerine örten değil).`,
              en: `y = ${ns(s.c, 2)} is outside the range (no intersection → not surjective onto ℝ).`,
            });
          }
        };

        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("c", { min: -2.5, max: 3.5, step: 0.1, value: s.c, onInput: (v) => { s.c = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "fn-transform",
      mathId: "m-fn-basics",
      title: { tr: "Grafik Dönüşümleri: Ölçekleme ve Öteleme", en: "Graph Transformations: Scaling & Shifting" },
      body: [
        {
          tr: R`Bir temel fonksiyonun grafiğinden tüm bir aileyi üretebiliriz: \(g(x) = a\,f(b(x - c)) + d\). Dış parametreler (\(a, d\)) dikey ekseni, iç parametreler (\(b, c\)) yatay ekseni <b>ters yönde</b> etkiler.`,
          en: R`From one parent graph we generate an entire family: \(g(x) = a\,f(b(x - c)) + d\). Outer parameters (\(a, d\)) act vertically, while inner parameters (\(b, c\)) act horizontally in the <b>inverse</b> direction.`,
        },
        { eq: R`g(x) = a\,f\!\big(b(x - c)\big) + d` },
        {
          tr: R`<b>Deneyin:</b> \(b\)'yi 2 yapın — grafik yatayda 2 kat <i>sıkışır</i> (genişlemez!). \(c > 0\) grafiği sağa, \(d > 0\) yukarı öteler. Kesikli eğri orijinal \(f(x)\)'tir.`,
          en: R`<b>Try it:</b> set \(b = 2\) — the graph <i>compresses</i> horizontally by a factor of 2! Positive \(c\) shifts right, positive \(d\) shifts up. The dashed curve is the parent \(f(x)\).`,
        },
      ],
      demo(box, state) {
        const s = (state.tr ??= { base: "sin", a: 1.5, b: 1, c: 0, d: 0 });
        const bases = {
          sin: { name: "sin(x)", f: (x) => Math.sin(x) },
          abs: { name: "|x|", f: (x) => Math.abs(x) },
          exp: { name: "eˣ", f: (x) => Math.exp(x) },
        };
        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const readout = h("div", { class: "pc-calc" });
        box.append(ctl1, ctl2, plotHost, readout);
        const plot = createCanvas2D(plotHost, { height: 260 });

        const draw = () => {
          const base = bases[s.base];
          plot.draw({
            x: [-5, 5],
            y: [-4, 4],
            xLabel: "x",
            yLabel: "y",
            curves: [
              { f: base.f, color: COLORS.muted, width: 1.7, dash: [5, 4] },
              { f: (x) => s.a * base.f(s.b * (x - s.c)) + s.d, color: COLORS.c1, width: 2.7 },
            ],
          });
          readout.textContent = `\\(g(x) = ${tx(s.a, 1)}\\cdot f\\big(${tx(s.b, 1)}(x ${s.c >= 0 ? "-" : "+"} ${tx(Math.abs(s.c), 1)})\\big) ${s.d >= 0 ? "+" : "-"} ${tx(Math.abs(s.d), 1)}\\)`;
        };
        ctl1.append(segmented(Object.entries(bases).map(([k, v]) => [k, v.name]), s.base, (v) => { s.base = v; draw(); }));
        ctl2.append(
          slider("a", { min: -2.5, max: 2.5, step: 0.1, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
          slider("b", { min: 0.2, max: 3, step: 0.1, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
          slider("c", { min: -3, max: 3, step: 0.2, value: s.c, onInput: (v) => { s.c = v; draw(); } }),
          slider("d", { min: -2.5, max: 2.5, step: 0.2, value: s.d, onInput: (v) => { s.d = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "fn-inverse",
      mathId: "m-fn-inv",
      title: { tr: "Ters Fonksiyon ve y = x Simetrisi", en: "Inverse Functions & Reflection Across y = x" },
      body: [
        {
          tr: R`Eğer \((x_0, y_0)\) noktası \(f\)'nin grafiğindeyse, \((y_0, x_0)\) noktası [[inverse-fn|\(f^{-1}\)]]'in grafiğindedir. Koordinatları yer değiştirmek geometrik olarak \(y = x\) doğrusuna göre yansıma demektir.`,
          en: R`Whenever \((x_0, y_0)\) lies on the graph of \(f\), the swapped point \((y_0, x_0)\) lies on the graph of [[inverse-fn|\(f^{-1}\)]]. Swapping coordinates reflects the curve across \(y = x\).`,
        },
        { eq: R`y = e^x \iff x = \ln y, \qquad y = \sinh x \iff x = \operatorname{arsinh} y` },
        {
          tr: R`<b>Deneyin:</b> Bir [[transcendental|aşkın fonksiyon]] seçin ve \(x_0\) noktasını kaydırın. \((x_0, f(x_0))\) ile \((f(x_0), x_0)\) noktalarının \(y=x\) doğrusuna eşit uzaklıkta dik simetrik olduğunu görün.`,
          en: R`<b>Try it:</b> pick a [[transcendental|transcendental function]] and slide \(x_0\). Watch \((x_0, f(x_0))\) and \((f(x_0), x_0)\) mirror symmetrically across \(y = x\).`,
        },
      ],
      demo(box, state) {
        const s = (state.inv ??= { fn: "exp", x0: 0.8 });
        const ctl = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const out = h("div", { class: "pc-calc" });
        box.append(ctl, plotHost, out);
        const plot = createCanvas2D(plotHost, { height: 290 });

        const draw = () => {
          const item = TRANS_FNS[s.fn];
          const xRange = s.fn === "sin" ? [-Math.PI / 2, Math.PI / 2] : s.fn === "tan" ? [-1.45, 1.45] : s.fn === "cosh" ? [0, 3.5] : undefined;
          const x0 = xRange ? Math.max(xRange[0] + 0.05, Math.min(xRange[1] - 0.05, s.x0)) : s.x0;
          const y0 = item.f(x0);
          plot.draw({
            x: [-3.5, 3.5],
            y: [-3.5, 3.5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a: 1, b: -1, c: 0, color: COLORS.muted, dash: [5, 4], label: "y = x" }],
            curves: [
              { f: item.f, color: COLORS.c1, width: 2.6, xRange },
              { f: item.inv, color: COLORS.c2, width: 2.6 },
            ],
            segments: [{ from: [x0, y0], to: [y0, x0], color: COLORS.c3, dash: [4, 3], width: 1.6 }],
            points: [
              { x: x0, y: y0, color: COLORS.c1, r: 5.5, label: `(${ns(x0, 2)}, ${ns(y0, 2)})` },
              { x: y0, y: x0, color: COLORS.c2, r: 5.5, label: `(${ns(y0, 2)}, ${ns(x0, 2)})` },
            ],
          });
          out.textContent = `\\(f(${tx(x0, 2)}) = ${tx(y0, 2)}\\quad\\Longleftrightarrow\\quad f^{-1}(${tx(y0, 2)}) = ${tx(x0, 2)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(TRANS_FNS).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("x₀", { min: -2, max: 2, step: 0.05, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "fn-hyperbolic",
      mathId: "m-fn-hyp",
      title: { tr: "Hiperbolik Fonksiyonlar ve Birim Hiperbol", en: "Hyperbolic Functions & The Unit Hyperbola" },
      body: [
        {
          tr: R`Nasıl \((\cos t, \sin t)\) noktası \(x^2 + y^2 = 1\) birim çemberini tarıyorsa, \((\cosh t, \sinh t)\) noktası da \(x^2 - y^2 = 1\) <b>birim hiperbolünün</b> sağ kolunu tarar. Her ikisi de \(e^x\) ve \(e^{-x}\)'in çift ve tek parçalarıdır:`,
          en: R`Just as \((\cos t, \sin t)\) traces the unit circle \(x^2 + y^2 = 1\), the point \((\cosh t, \sinh t)\) traces the right branch of the <b>unit hyperbola</b> \(x^2 - y^2 = 1\). They are literally the even and odd parts of \(e^x\):`,
        },
        { eq: R`\cosh x = \frac{e^x + e^{-x}}{2}, \qquad \sinh x = \frac{e^x - e^{-x}}{2}, \qquad \cosh^2 x - \sinh^2 x = 1` },
        {
          tr: R`<b>Deneyin:</b> \(t\) parametresini değiştirin ve \((\cosh t, \sinh t)\) noktasının birim hiperbol üzerinde hareket edişini izleyin; aynı anda \(e^t = \cosh t + \sinh t\) eşitliğini kontrol edin.`,
          en: R`<b>Try it:</b> slide the parameter \(t\) and watch \((\cosh t, \sinh t)\) glide along the unit hyperbola while checking \(e^t = \cosh t + \sinh t\).`,
        },
      ],
      demo(box, state) {
        const s = (state.hyp ??= { t: 0.9 });
        const ctl = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, plotHost, calc);
        const plot = createCanvas2D(plotHost, { height: 270 });

        const draw = () => {
          const ch = Math.cosh(s.t);
          const sh = Math.sinh(s.t);
          plot.draw({
            x: [-0.5, 4.5],
            y: [-3, 3],
            equalAspect: true,
            xLabel: "x = cosh t",
            yLabel: "y = sinh t",
            lines: [
              { a: 1, b: -1, c: 0, color: COLORS.muted, dash: [4, 4] },
              { a: 1, b: 1, c: 0, color: COLORS.muted, dash: [4, 4] },
            ],
            parametrics: [
              { fx: (u) => Math.cosh(u), fy: (u) => Math.sinh(u), t0: -2.2, t1: 2.2, color: COLORS.c1, width: 2.6 },
            ],
            segments: [
              { from: [0, 0], to: [ch, sh], color: COLORS.c2, width: 2 },
              { from: [ch, 0], to: [ch, sh], color: COLORS.c3, dash: [4, 3] },
            ],
            points: [{ x: ch, y: sh, color: COLORS.c2, r: 6, ring: true, label: `(${ns(ch, 2)}, ${ns(sh, 2)})` }],
          });
          calc.textContent = `\\(\\cosh(${tx(s.t, 2)})=${tx(ch, 3)},\\; \\sinh(${tx(s.t, 2)})=${tx(sh, 3)},\\; \\cosh^2 t - \\sinh^2 t = ${tx(ch * ch - sh * sh, 4)}\\)`;
        };
        ctl.append(slider("t", { min: -1.8, max: 1.8, step: 0.05, value: s.t, onInput: (v) => { s.t = v; draw(); } }));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Fonksiyon & Bileşke Laboratuvarı", en: "Function & Composition Studio" },
    sub: {
      tr: R`İki fonksiyon \(f(x)\) ve \(g(x)\) seçip hem kendi grafiklerini hem de bileşke \((f \circ g)(x) = f(g(x))\) ile tersini aynı düzlemde inceleyin; fareyle grafiğin üzerine gelerek değerleri okuyun.`,
      en: R`Pick two functions \(f(x)\) and \(g(x)\) to inspect \(f\), \(g\), and their composition \((f\circ g)(x) = f(g(x))\) on the same coordinate plane; hover anywhere to read exact values.`,
    },
    build(host, state) {
      const s = (state.pg ??= { f: "sin", g: "sq", k: 1, x0: 1 });
      const lib = {
        sin: { label: "sin(x)", f: (x) => Math.sin(x) },
        cos: { label: "cos(x)", f: (x) => Math.cos(x) },
        exp: { label: "eˣ", f: (x) => Math.exp(x) },
        ln: { label: "ln(|x|+0.1)", f: (x) => Math.log(Math.abs(x) + 0.1) },
        sq: { label: "0.5x²", f: (x) => 0.5 * x * x },
        lin: { label: "x + 1", f: (x) => x + 1 },
        tanh: { label: "tanh(x)", f: (x) => Math.tanh(x) },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const plot = createCanvas2D(stage, { height: 390 });
      const legend = h("div", { class: "canvas-legend" });
      stage.append(legend);

      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const ctl3 = h("div", { class: "t-controls" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Dış fonksiyon f(x)", en: "Outer function f(x)" }) }),
        ctl,
        h("div", { class: "mini-title", text: L({ tr: "İç fonksiyon g(x)", en: "Inner function g(x)" }) }),
        ctl2,
        ctl3,
        tiles,
        calc,
      );

      const draw = () => {
        const F = (x) => lib[s.f].f(x);
        const G = (x) => s.k * lib[s.g].f(x);
        const FG = (x) => F(G(x));
        const gx = G(s.x0);
        const fgx = F(gx);
        plot.draw({
          x: [-5, 5],
          y: [-4, 4],
          xLabel: "x",
          yLabel: "y",
          curves: [
            { f: F, color: COLORS.c1, width: 2, dash: [5, 4] },
            { f: G, color: COLORS.c3, width: 2, dash: [3, 3] },
            { f: FG, color: COLORS.c2, width: 3 },
          ],
          points: [
            { x: s.x0, y: gx, color: COLORS.c3, r: 5 },
            { x: s.x0, y: fgx, color: COLORS.c2, r: 6, ring: true },
          ],
          hover: (x) => ({
            title: `x = ${ns(x, 2)}`,
            rows: [
              { value: ns(FG(x), 3), label: "(f∘g)(x)", color: COLORS.c2 },
              { value: ns(F(x), 3), label: "f(x)", color: COLORS.c1 },
              { value: ns(G(x), 3), label: "g(x)", color: COLORS.c3 },
            ],
          }),
        });
        legend.replaceChildren(
          h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c2}` }), `(f∘g)(x)`),
          h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c1}` }), `f(x) = ${lib[s.f].label}`),
          h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c3}` }), `g(x) = ${ns(s.k, 1)}·(${lib[s.g].label})`),
        );
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "x₀" }), h("span", { class: "pg-tile-value", text: ns(s.x0, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "g(x₀)" }), h("span", { class: "pg-tile-value", text: ns(gx, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f(g(x₀))" }), h("span", { class: "pg-tile-value", text: ns(fgx, 3) })),
        );
        calc.textContent = `\\(x_0 = ${tx(s.x0, 2)} \\xrightarrow{g} ${tx(gx, 3)} \\xrightarrow{f} ${tx(fgx, 3)}\\)`;
      };

      const opts = Object.entries(lib).map(([k, v]) => [k, v.label]);
      ctl.append(segmented(opts, s.f, (v) => { s.f = v; draw(); }));
      ctl2.append(segmented(opts, s.g, (v) => { s.g = v; draw(); }));
      ctl3.append(
        slider("k", { min: -2, max: 2, step: 0.1, value: s.k, onInput: (v) => { s.k = v; draw(); } }),
        slider("x₀", { min: -4, max: 4, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-fn-basics",
      title: { tr: "Temel Kavramlar ve Aşkın Fonksiyon Tablosu", en: "Core Properties & Transcendental Reference" },
      blocks: [
        {
          p: {
            tr: R`Bir [[function|fonksiyon]] \(f: D \to \mathbb{R}\) için parite (çift: \(f(-x)=f(x)\), tek: \(f(-x)=-f(x)\)), monotonluk ve periyodiklik (\(f(x+T)=f(x)\)) fonksiyonun davranışını hızla özetler.`,
            en: R`For \(f: D \to \mathbb{R}\), parity (even: \(f(-x)=f(x)\), odd: \(f(-x)=-f(x)\)), monotonicity, and periodicity (\(f(x+T)=f(x)\)) capture global symmetry.`,
          },
        },
        {
          table: {
            head: [
              { tr: "Fonksiyon", en: "Function" },
              { tr: "Tanım kümesi", en: "Domain" },
              { tr: "Görüntü kümesi", en: "Range" },
              { tr: "Temel özellik", en: "Key property" },
            ],
            rows: [
              [R`\(e^x\)`, R`\(\mathbb{R}\)`, R`\((0,\infty)\)`, R`\(e^{a+b}=e^a e^b\), artan`],
              [R`\(\ln x\)`, R`\((0,\infty)\)`, R`\(\mathbb{R}\)`, R`\(\ln(ab)=\ln a+\ln b\)`],
              [R`\(\arcsin x\)`, R`\([-1,1]\)`, R`\([-\tfrac{\pi}{2},\tfrac{\pi}{2}]\)`, R`tek / odd`],
              [R`\(\arccos x\)`, R`\([-1,1]\)`, R`\([0,\pi]\)`, R`\(\arcsin x + \arccos x = \tfrac{\pi}{2}\)`],
              [R`\(\arctan x\)`, R`\(\mathbb{R}\)`, R`\((-\tfrac{\pi}{2},\tfrac{\pi}{2})\)`, R`yatay asimptot \(\pm\tfrac{\pi}{2}\)`],
              [R`\(\sinh x,\ \cosh x\)`, R`\(\mathbb{R}\)`, R`\(\mathbb{R},\ [1,\infty)\)`, R`\(\cosh^2 x - \sinh^2 x = 1\)`],
            ],
          },
        },
      ],
    },
    {
      id: "m-fn-inv",
      title: { tr: "Ters Fonksiyon ve Logaritma Kurallarının Türetilmesi", en: "Inverse Functions & Logarithm Laws" },
      blocks: [
        {
          p: {
            tr: R`Kesin monoton her fonksiyon birebirdir; dolayısıyla görüntü kümesi üzerine bir [[inverse-fn|ters fonksiyonu]] vardır. \(\ln x\), \(e^x\)'in tersi olarak tanımlandığında tüm logaritma kuralları üstel yasadan doğrudan çıkar.`,
            en: R`Every strictly monotone function is injective and therefore invertible onto its range. Defining \(\ln x\) as the inverse of \(e^x\) immediately yields all logarithm laws.`,
          },
        },
        {
          derive: {
            title: { tr: "Çarpımın logaritması: ln(ab) = ln a + ln b", en: "Logarithm of a product: ln(ab) = ln a + ln b" },
            steps: [
              { tex: R`u = \ln a,\quad v = \ln b \quad (a, b > 0)`, why: { tr: "Pozitif a ve b için doğal logaritmalar tanımlıdır.", en: "For positive a and b, the natural logarithms exist." } },
              { tex: R`e^u = a,\qquad e^v = b`, why: { tr: "Ters fonksiyon tanımı: ln(x) ve exp(x) birbirinin tersidir.", en: "Inverse definition: ln and exp undo each other." } },
              { tex: R`a b = e^u e^v = e^{u + v}`, why: { tr: "Üstel fonksiyonun temel çarpım yasası uygulanır.", en: "Apply the fundamental product law of exponentials." } },
              { tex: R`\ln(ab) = \ln(e^{u+v}) = u + v = \ln a + \ln b`, why: { tr: "İki tarafın ln'i alınınca kural ispatlanır.", en: "Taking ln of both sides completes the proof." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-fn-hyp",
      title: { tr: "Hiperbolik Özdeşlikler ve Ters Hiperbolik Formülü", en: "Hyperbolic Identities & Inverse Formula" },
      blocks: [
        { eq: R`\cosh^2 x - \sinh^2 x = 1, \qquad 1 - \tanh^2 x = \operatorname{sech}^2 x` },
        {
          derive: {
            title: { tr: "arsinh(y) için açık logaritmik formül", en: "Closed-form logarithm for arsinh(y)" },
            steps: [
              { tex: R`y = \sinh x = \frac{e^x - e^{-x}}{2}`, why: { tr: "Tersini bulmak için x'i y cinsinden çekeceğiz.", en: "To invert sinh, solve for x in terms of y." } },
              { tex: R`e^x - 2y - e^{-x} = 0 \implies (e^x)^2 - 2y\,e^x - 1 = 0`, why: { tr: "Her iki taraf 2·eˣ ile çarpılır; u = eˣ cinsinden ikinci derece denklem oluşur.", en: "Multiply by 2·eˣ to obtain a quadratic in u = eˣ." } },
              { tex: R`e^x = \frac{2y \pm \sqrt{4y^2 + 4}}{2} = y + \sqrt{y^2 + 1}`, why: { tr: "eˣ > 0 ve √(y²+1) > |y| olduğundan yalnızca '+' kökü geçerlidir.", en: "Since eˣ > 0 and √(y²+1) > |y|, only the '+' branch is positive." } },
              { tex: R`\operatorname{arsinh}(y) = x = \ln\!\big(y + \sqrt{y^2 + 1}\big)`, why: { tr: "Her y ∈ ℝ için geçerli açık formül elde edilir.", en: "Taking ln gives the exact formula valid for every y ∈ ℝ." } },
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Çift + Tek ayrıştırma", en: "Even + Odd decomposition" },
          text: {
            tr: R`Her fonksiyon benzersiz biçimde bir çift ve bir tek fonksiyonun toplamı olarak yazılabilir: \(f(x) = \frac{f(x)+f(-x)}{2} + \frac{f(x)-f(-x)}{2}\). \(f(x)=e^x\) için bu tam olarak \(\cosh x + \sinh x\)'tir!`,
            en: R`Every function uniquely decomposes into an even plus an odd part: \(f(x) = \frac{f(x)+f(-x)}{2} + \frac{f(x)-f(-x)}{2}\). For \(e^x\), this is literally \(\cosh x + \sinh x\)!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
