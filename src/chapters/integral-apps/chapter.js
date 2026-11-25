import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { createCanvas3D } from "../../engines/canvas3d.ts";
import { numDiff, simpson } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "ia-intro",
    title: { tr: "Belirli İntegral Uygulamaları: Alan, 3B Hacim ve Yay Uzunluğu", en: "Applications of Definite Integrals: Area, 3D Volume & Arc Length" },
    paragraphs: [
      {
        tr: R`İntegralin gerçek gücü "sonsuz küçük dilimleri topla" ilkesindedir: dikey dilimler iki eğri arası alanı, dairesel dilimler (disk/halka) [[solid-of-revolution|3B dönel cisimlerin hacmini]], küçük hipotenüsler ise bir eğrinin gerçek <b>yay uzunluğunu</b> verir!`,
        en: R`Integration shines through "slice and sum": vertical strips measure area between curves, circular disks/washers build [[solid-of-revolution|3D solids of revolution]], and tiny hypotenuses sum to exact <b>arc length</b>!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> eğriler arası alanı hesaplayacak, 3B dönel cisimleri döndürerek disk ve halka kesitlerini inceleyecek, yay uzunluğu integralini ve bir fonksiyonun ortalama değerini kullanabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will compute areas between curves, orbit 3D solids of revolution with live disk/washer slices, derive arc length, and compute average values.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 20 · Belirli İntegral Uygulamaları", en: "Lecture 20 · Applications of Definite Integrals" }],
      [{ tr: "Disk / Halka hacmi", en: "Disk / Washer volume" }, { tr: R`\(V = \pi \int_a^b \big(R(x)^2 - r(x)^2\big)\,dx\)`, en: R`\(V = \pi \int_a^b \big(R(x)^2 - r(x)^2\big)\,dx\)` }],
      [{ tr: "Yay uzunluğu", en: "Arc length" }, { tr: R`\(L = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx\)`, en: R`\(L = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx\)` }],
    ],
  },
  sections: [
    {
      id: "ia-area",
      mathId: "m-ia-vol",
      title: { tr: "İki Eğri Arasındaki Alan ve Ortalama Değer", en: "Area Between Curves & Average Value" },
      body: [
        {
          tr: R`\([a, b]\) üzerinde üstte \(f(x)\), altta \(g(x)\) kalıyorsa aradaki alan \(\int_a^b (f(x)-g(x))\,dx\)'tir. Eğer eğriler kesişip yer değiştiriyorsa mutlak değer \(\int_a^b |f(x)-g(x)|\,dx\) gerekir!`,
          en: R`Between an upper curve \(f(x)\) and lower curve \(g(x)\), the enclosed area is \(\int_a^b |f(x)-g(x)|\,dx\), splitting at intersections where top and bottom swap.`,
        },
        { eq: R`A = \int_a^b |f(x) - g(x)|\,dx, \qquad \bar f = \frac{1}{b - a}\int_a^b f(x)\,dx` },
        {
          tr: R`<b>Deneyin:</b> \(f(x) = a\sqrt{x}\) ile \(g(x) = x^2\) arasındaki yaprak alanını \(a\) parametresiyle büyütüp küçültün.`,
          en: R`<b>Try it:</b> vary \(a\) to resize the region trapped between \(f(x) = a\sqrt{x}\) and \(g(x) = x^2\).`,
        },
      ],
      demo(box, state) {
        const s = (state.area ??= { a: 1.5 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 250 });

        const draw = () => {
          const f = (x) => (x >= 0 ? s.a * Math.sqrt(x) : NaN);
          const g = (x) => x * x;
          // a * sqrt(x) = x^2 => x^(3/2) = a => x = a^(2/3)
          const xInt = s.a ** (2 / 3);
          const area = simpson((x) => f(x) - g(x), 0, xInt, 120);
          plot.draw({
            x: [-0.2, 2.6], y: [-0.2, 3.6], xLabel: "x", yLabel: "y",
            areas: [{ f, g, from: 0, to: xInt, fill: "rgba(42,120,214,0.22)" }],
            curves: [
              { f, color: COLORS.c1, width: 2.5, xRange: [0, 2.6] },
              { f: g, color: COLORS.c2, width: 2.5 },
            ],
            points: [
              { x: 0, y: 0, color: COLORS.c3, r: 5 },
              { x: xInt, y: g(xInt), color: COLORS.c3, r: 5.5, label: `(${ns(xInt, 2)}, ${ns(g(xInt), 2)})` },
            ],
          });
          calc.textContent = `\\(A = \\int_0^{${tx(xInt, 2)}} (${tx(s.a, 1)}\\sqrt{x} - x^2)\\,dx = ${tx(area, 4)}\\)`;
        };
        ctl.append(slider("a", { min: 0.6, max: 2.4, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } }));
        draw();
      },
    },
    {
      id: "ia-revolution",
      mathId: "m-ia-vol",
      title: { tr: "3B Dönel Cisim Hacmi: Disk ve Halka Yöntemi", en: "3D Volumes of Revolution: Disk & Washer Method" },
      body: [
        {
          tr: R`\(y = R(x)\) eğrisini \(x\)-ekseni etrafında \(360^\circ\) döndürdüğümüzde her \(x\) konumunda yarıçapı \(R(x)\), alanı \(\pi R(x)^2\) olan dairesel bir <b>disk</b> (veya iç oyuk varsa \(\pi(R^2 - r^2)\) <b>halka</b>) elde ederiz!`,
          en: R`Revolving \(y = R(x)\) around the \(x\)-axis produces circular cross-section <b>disks</b> of area \(\pi R(x)^2\) (or <b>washers</b> \(\pi(R^2-r^2)\) when hollow)!`,
        },
        { eq: R`V = \pi \int_a^b \Big([R(x)]^2 - [r(x)]^2\Big)\,dx` },
        {
          tr: R`<b>Deneyin:</b> 3B dönel cismi sürükleyip döndürün! \(x\) dilimini kaydırarak turuncu kesit diskinin/halkasının cismi nasıl taradığını görün!`,
          en: R`<b>Try it:</b> drag to orbit the 3D solid of revolution! Slide the orange cross-section disk/washer along the \(x\)-axis!`,
        },
      ],
      demo(box, state) {
        const s = (state.rev ??= { shape: "parab", slice: 1.4 });
        const shapes = {
          cone: { label: { tr: "Koni", en: "Cone" }, R: (x) => 0.55 * x, r: null, a: 0, b: 3 },
          parab: { label: { tr: "Paraboloid", en: "Paraboloid" }, R: (x) => Math.sqrt(x), r: null, a: 0, b: 3 },
          vase: { label: { tr: "Vazo", en: "Vase" }, R: (x) => 1.1 + 0.45 * Math.sin(2 * x), r: null, a: 0, b: 3 },
          washer: { label: { tr: "Halka (Washer)", en: "Washer" }, R: (x) => 1.5, r: (x) => 0.45 * x, a: 0, b: 2.8 },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 320 });

        const draw = () => {
          const sh = shapes[s.shape];
          const vol = Math.PI * simpson((x) => sh.R(x) ** 2 - (sh.r ? sh.r(x) ** 2 : 0), sh.a, sh.b, 120);
          view3d.draw({
            range: 3.6,
            revolution: { R: sh.R, r: sh.r || undefined, a: sh.a, b: sh.b, sliceX: Math.min(sh.b, s.slice), color: COLORS.c1 },
          });
          calc.textContent = `\\(V = \\pi\\int_{${sh.a}}^{${sh.b}} \\big(R(x)^2${sh.r ? " - r(x)^2" : ""}\\big)\\,dx = ${tx(vol, 3)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(shapes).map(([k, v]) => [k, v.label]), s.shape, (v) => { s.shape = v; draw(); }),
          slider("x", { min: 0.1, max: 2.8, step: 0.1, value: s.slice, onInput: (v) => { s.slice = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Yay Uzunluğu Poligonal Yaklaşım Stüdyosu", en: "Arc Length Polygonal Chain Studio" },
    sub: {
      tr: R`Bir eğriyi \(n\) düz doğru parçasına bölün: \(n\) arttıkça kırık çizginin uzunluğu \(\sum\sqrt{\Delta x^2+\Delta y^2}\) kesin yay uzunluğu integraline \(\int_a^b\sqrt{1+f'(x)^2}\,dx\) yakınsar!`,
      en: R`Approximate a curve with \(n\) chords: as \(n\) increases, the polygonal sum \(\sum\sqrt{\Delta x^2+\Delta y^2}\) converges to \(\int_a^b\sqrt{1+f'(x)^2}\,dx\)!`,
    },
    build(host, state) {
      const s = (state.pg ??= { fn: "sin", n: 5 });
      const fns = {
        sin: { label: "sin(x) [0, π]", f: (x) => Math.sin(x), a: 0, b: Math.PI, yr: [-0.2, 1.4] },
        parab: { label: "0.5x² [0, 2]", f: (x) => 0.5 * x * x, a: 0, b: 2, yr: [-0.2, 2.4] },
        cosh: { label: "cosh(x) [-1, 1]", f: (x) => Math.cosh(x), a: -1, b: 1, yr: [0.5, 2] },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 370 });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      side.append(ctl, tiles);

      const draw = () => {
        const cur = fns[s.fn];
        const segs = [];
        const pts = [];
        let polyLen = 0;
        for (let i = 0; i <= s.n; i++) {
          const x = cur.a + (i / s.n) * (cur.b - cur.a);
          const y = cur.f(x);
          pts.push({ x, y, color: COLORS.c2, r: 4.5 });
          if (i > 0) {
            const p = pts[i - 1];
            segs.push({ from: [p.x, p.y], to: [x, y], color: COLORS.c2, width: 2.4 });
            polyLen += Math.hypot(x - p.x, y - p.y);
          }
        }
        const exact = simpson((x) => Math.sqrt(1 + numDiff(cur.f, x) ** 2), cur.a, cur.b, 200);
        plot.draw({
          x: [cur.a - 0.2, cur.b + 0.2], y: cur.yr, xLabel: "x", yLabel: "y",
          curves: [{ f: cur.f, color: COLORS.c1, width: 2.2, dash: [5, 4] }],
          segments: segs,
          points: pts,
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `L_${s.n}` }), h("span", { class: "pg-tile-value", text: ns(polyLen, 4) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Kesin L", en: "Exact L" }) }), h("span", { class: "pg-tile-value", text: ns(exact, 4) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Fark", en: "Error" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(exact - polyLen), 4) })),
        );
      };
      ctl.append(
        segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); }),
        slider("n", { min: 2, max: 24, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-ia-vol",
      title: { tr: "Hacim (Disk / Kabuk) ve Yay Uzunluğu Türetmesi", en: "Volume (Disk / Shell) & Arc Length Derivations" },
      blocks: [
        { eq: R`V_{\text{disk}} = \pi \int_a^b [f(x)]^2\,dx, \qquad V_{\text{kabuk/shell}} = 2\pi \int_a^b x\,f(x)\,dx` },
        {
          derive: {
            title: { tr: "Yay uzunluğu diferansiyeli ds = √(1 + f'(x)²) dx", en: "Deriving the arc length element ds = √(1 + f'(x)²) dx" },
            steps: [
              { tex: R`\Delta s_i = \sqrt{(\Delta x_i)^2 + (\Delta y_i)^2}`, why: { tr: "Her küçük kirişin uzunluğu Pisagor Teoremi ile yazılır.", en: "Length of one small chord by Pythagoras." } },
              { tex: R`\Delta y_i = f'(c_i)\,\Delta x_i \quad (c_i \in [x_{i-1}, x_i])`, why: { tr: "Ortalama Değer Teoremi (MVT) ile Δy terimi türeve bağlanır.", en: "Apply the Mean Value Theorem to express Δy via f'(c_i)." } },
              { tex: R`L = \lim_{\|P\|\to 0}\sum_i \sqrt{1 + [f'(c_i)]^2}\,\Delta x_i = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx`, why: { tr: "Riemann toplamının limiti kesin yay uzunluğu integralini verir!", en: "Taking the Riemann limit yields the arc length integral!" } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
