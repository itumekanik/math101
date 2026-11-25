import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { riemannSum, simpson } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "di-intro",
    title: { tr: "Belirli İntegraller, Riemann Toplamları ve Temel Teorem", en: "Definite Integrals, Riemann Sums & FTC" },
    paragraphs: [
      {
        tr: R`[[riemann-sum|Belirli integral]] \(\int_a^b f(x)\,dx\), aralığı ince dilimlere bölüp dikdörtgenlerin işaretli alanlarını toplamanın limitidir. [[ftc|Kalkülüsün Temel Teoremi (FTC)]] bu zahmetli limiti mucizevi biçimde tek bir çıkarma işlemine indirger: \(F(b) - F(a)\)!`,
        en: R`The [[riemann-sum|definite integral]] \(\int_a^b f(x)\,dx\) is the limit of signed rectangle sums. The [[ftc|Fundamental Theorem of Calculus (FTC)]] collapses that infinite limit into one subtraction: \(F(b) - F(a)\)!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> Sol, Sağ, Orta Nokta ve Yamuk toplamlarının \(n\to\infty\) ile kesin alana yakınsamasını görecek, alan biriktirici \(A(x) = \int_a^x f(t)\,dt\)'nin türevinin neden \(f(x)\) olduğunu anlayacak ve [[improper-integral|genelleştirilmiş integralleri]] test edebileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will watch Left, Right, Midpoint, and Trapezoidal sums converge to exact signed area, verify \(A'(x) = f(x)\) visually, and determine convergence of [[improper-integral|improper integrals]].`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 19 · Belirli İntegraller", en: "Lecture 19 · Definite Integrals" }],
      [{ tr: "FTC (1. & 2. Kısım)", en: "FTC (Parts 1 & 2)" }, { tr: R`\(\frac{d}{dx}\int_a^x f(t)\,dt = f(x),\quad \int_a^b f = F(b)-F(a)\)`, en: R`\(\frac{d}{dx}\int_a^x f(t)\,dt = f(x),\quad \int_a^b f = F(b)-F(a)\)` }],
      [{ tr: "Genelleştirilmiş", en: "Improper p-test" }, { tr: R`\(\int_1^\infty x^{-p}dx<\infty \iff p>1\); \(\int_0^1 x^{-p}dx<\infty \iff p<1\)`, en: R`\(\int_1^\infty x^{-p}dx<\infty \iff p>1\); \(\int_0^1 x^{-p}dx<\infty \iff p<1\)` }],
    ],
  },
  sections: [
    {
      id: "di-riemann",
      mathId: "m-di-ftc",
      title: { tr: "Riemann Toplamları: Dikdörtgenlerden Kesin Alana", en: "Riemann Sums: Rectangles to Exact Area" },
      body: [
        {
          tr: R`\([a, b]\) aralığını genişliği \(\Delta x = (b-a)/n\) olan \(n\) parçaya böleriz. \(x\)-ekseninin üstündeki parçalar pozitif (mavi/yeşil), altındaki parçalar negatif (turuncu) katkı verir: belirli integral <b>işaretli alandır</b>!`,
          en: R`Partition \([a, b]\) into \(n\) strips of width \(\Delta x = (b-a)/n\). Regions above the axis add positively while regions below subtract: the definite integral measures <b>signed area</b>!`,
        },
        { eq: R`\int_a^b f(x)\,dx = \lim_{n\to\infty}\sum_{i=1}^{n} f(x_i^*)\,\Delta x` },
        {
          tr: R`<b>Deneyin:</b> Sol, Sağ ve Orta Nokta yöntemlerini seçin ve \(n\) dilim sayısını artırın; Orta Nokta kuralının çok küçük \(n\)'de bile hatayı nasıl hızla sıfırladığına dikkat edin!`,
          en: R`<b>Try it:</b> switch between Left, Right, and Midpoint rules and raise \(n\); notice how fast the Midpoint rule crushes the approximation error!`,
        },
      ],
      demo(box, state) {
        const s = (state.riem ??= { mode: "mid", n: 8, fn: "sin" });
        const fns = {
          sin: { label: "sin(x) [0, 4]", f: (x) => Math.sin(x), a: 0, b: 4, exact: 1 - Math.cos(4), yr: [-1.2, 1.3] },
          sq: { label: "0.25x² [0, 4]", f: (x) => 0.25 * x * x, a: 0, b: 4, exact: 16 / 3, yr: [-0.3, 4.4] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const cur = fns[s.fn];
          const dx = (cur.b - cur.a) / s.n;
          const rects = [];
          for (let i = 0; i < s.n; i++) {
            const x0 = cur.a + i * dx, x1 = x0 + dx;
            const xm = s.mode === "left" ? x0 : s.mode === "right" ? x1 : (x0 + x1) / 2;
            const y = cur.f(xm);
            rects.push({
              x0, x1, y0: 0, y1: y,
              fill: y >= 0 ? "rgba(42,120,214,0.22)" : "rgba(235,104,52,0.24)",
              stroke: y >= 0 ? COLORS.c1 : COLORS.c2,
            });
          }
          const approx = riemannSum(cur.f, cur.a, cur.b, s.n, s.mode);
          plot.draw({
            x: [cur.a - 0.3, cur.b + 0.3], y: cur.yr, xLabel: "x", yLabel: "f(x)",
            rects,
            curves: [{ f: cur.f, color: COLORS.text, width: 2.5 }],
          });
          calc.textContent = `\\(R_{${s.n}} = ${tx(approx, 4)},\\qquad \\int_${cur.a}^${cur.b} f(x)\\,dx = ${tx(cur.exact, 4)},\\qquad |\\text{hata}| = ${tx(Math.abs(approx - cur.exact), 4)}\\)`;
        };
        ctl.append(
          segmented([["left", { tr: "Sol", en: "Left" }], ["mid", { tr: "Orta", en: "Mid" }], ["right", { tr: "Sağ", en: "Right" }]], s.mode, (v) => { s.mode = v; draw(); }),
          segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("n", { min: 2, max: 40, step: 2, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "di-ftc",
      mathId: "m-di-ftc",
      title: { tr: "Kalkülüsün Temel Teoremi: Alan Biriktirici A(x)", en: "Fundamental Theorem of Calculus: Area Accumulator A(x)" },
      body: [
        {
          tr: R`Üst sınırı hareketli tutalım: \(A(x) = \int_0^x f(t)\,dt\). \(x\)'i çok küçük bir \(dx\) kadar sağa kaydırdığımızda eklenen ince dilimin alanı yaklaşık \(f(x)\,dx\)'tir; dolayısıyla alanın büyüme hızı tam olarak eğrinin yüksekliğidir: \(A'(x) = f(x)\)!`,
          en: R`Let the upper limit vary: \(A(x) = \int_0^x f(t)\,dt\). Nudging \(x\) by \(dx\) adds a thin strip of area \(f(x)\,dx\), so the rate of change of area equals the curve's height: \(A'(x) = f(x)\)!`,
        },
        { eq: R`A(x) = \int_0^x f(t)\,dt \implies A'(x) = f(x)` },
        {
          tr: R`<b>Deneyin:</b> Üst sınır \(x\)'i kaydırın! Mavi taralı alan \(A(x)\)'in, \(f(x) > 0\) iken büyüdüğünü, \(f(x) < 0\) iken (turuncu) azaldığını ve \(f(x) = 0\) anında maksimumuna ulaştığını görün!`,
          en: R`<b>Try it:</b> slide the upper limit \(x\)! Watch the accumulated area \(A(x)\) climb while \(f>0\), peak precisely where \(f=0\), and decrease when \(f<0\)!`,
        },
      ],
      demo(box, state) {
        const s = (state.ftc ??= { x: 2.2 });
        const f = (t) => Math.cos(t);
        const A = (x) => Math.sin(x);
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          plot.draw({
            x: [-0.2, 6.4], y: [-1.4, 1.4], xLabel: "t", yLabel: "y",
            areas: [{ f, from: 0, to: s.x, fill: f(s.x) >= 0 ? "rgba(42,120,214,0.20)" : "rgba(235,104,52,0.20)" }],
            curves: [
              { f, color: COLORS.c1, width: 2.5 },
              { f: A, color: COLORS.c3, width: 2.4, dash: [5, 4] },
            ],
            lines: [{ a: 1, b: 0, c: -s.x, color: COLORS.c2, dash: [4, 3] }],
            points: [
              { x: s.x, y: f(s.x), color: COLORS.c1, r: 5, label: "f(x)" },
              { x: s.x, y: A(s.x), color: COLORS.c3, r: 6, ring: true, label: "A(x)" },
            ],
          });
          calc.textContent = `\\(A(${tx(s.x, 2)}) = \\int_0^{${tx(s.x, 2)}} \\cos t\\,dt = \\sin(${tx(s.x, 2)}) = ${tx(A(s.x), 3)},\\qquad A'(x) = \\cos(${tx(s.x, 2)}) = ${tx(f(s.x), 3)}\\)`;
        };
        ctl.append(slider("x", { min: 0, max: 6.2, step: 0.1, value: s.x, onInput: (v) => { s.x = v; draw(); } }));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Sayısal İntegral & Genelleştirilmiş p-İntegrali Laboratuvarı", en: "Numerical Quadrature & Improper Integral Lab" },
    sub: {
      tr: R`\(\int_0^b e^{-x^2/2}\,dx\) (ilkel fonksiyonu elemanter olmayan Gauss integrali!) için Sol, Orta Nokta, Yamuk ve Simpson kurallarının hızlarını karşılaştırın.`,
      en: R`Compare Left, Midpoint, Trapezoid, and Simpson's rule errors on \(\int_0^b e^{-x^2/2}\,dx\) (no elementary antiderivative!).`,
    },
    build(host, state) {
      const s = (state.pg ??= { b: 2, n: 6 });
      const f = (x) => Math.exp(-0.5 * x * x);
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 370 });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, tiles, calc);

      const draw = () => {
        const ref = simpson(f, 0, s.b, 400);
        const rL = riemannSum(f, 0, s.b, s.n, "left");
        const rT = riemannSum(f, 0, s.b, s.n, "trap");
        const rS = simpson(f, 0, s.b, s.n);
        const dx = s.b / s.n;
        const polys = [];
        for (let i = 0; i < s.n; i++) {
          const x0 = i * dx, x1 = x0 + dx;
          polys.push({ pts: [[x0, 0], [x0, f(x0)], [x1, f(x1)], [x1, 0]], fill: "rgba(27,175,122,0.16)", stroke: COLORS.c3, width: 1.2 });
        }
        plot.draw({
          x: [-0.3, Math.max(2.5, s.b + 0.4)], y: [-0.1, 1.2], xLabel: "x", yLabel: "e^(-x²/2)",
          polygons: polys,
          curves: [{ f, color: COLORS.c1, width: 2.7 }],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Sol hata", en: "Left err" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(rL - ref), 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Yamuk hata", en: "Trap err" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(rT - ref), 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "Simpson err" }), h("span", { class: "pg-tile-value", text: ns(Math.abs(rS - ref), 6) })),
        );
        calc.textContent = `\\(\\text{Referans} = ${tx(ref, 6)},\\qquad \\text{Simpson}_{${s.n}} = ${tx(rS, 6)}\\)`;
      };
      ctl.append(
        slider("b", { min: 0.5, max: 4, step: 0.5, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
        slider("n", { min: 2, max: 20, step: 2, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-di-ftc",
      title: { tr: "Kalkülüsün Temel Teoreminin İspatı", en: "Proof of the Fundamental Theorem of Calculus" },
      blocks: [
        {
          derive: {
            title: { tr: "FTC 1. Kısım: A'(x) = f(x) ve 2. Kısım: ∫ₐᵇ f = F(b) − F(a)", en: "FTC Parts 1 & 2" },
            steps: [
              { tex: R`\frac{A(x+h) - A(x)}{h} = \frac{1}{h}\int_x^{x+h} f(t)\,dt`, why: { tr: "İntegralin toplamsallığıyla alan artışı [x, x+h] dilimine indirgenir.", en: "Additivity isolates the strip from x to x + h." } },
              { tex: R`\frac{1}{h}\int_x^{x+h} f(t)\,dt = f(c_h) \quad (c_h \in [x, x+h])`, why: { tr: "Sürekli f için İntegrallerin Ortalama Değer Teoremi uygulanır.", en: "Apply the Mean Value Theorem for Integrals for continuous f." } },
              { tex: R`A'(x) = \lim_{h\to 0} f(c_h) = f(x)`, why: { tr: "h → 0 iken c_h → x ve süreklilikten f(c_h) → f(x) çıkar!", en: "As h → 0, c_h → x, so continuity gives A'(x) = f(x)!" } },
              { tex: R`A(x) = F(x) + C,\quad A(a) = 0 \implies C = -F(a) \implies \int_a^b f(t)\,dt = F(b) - F(a)`, why: { tr: "Herhangi bir ilkel F, A'dan yalnızca sabit C kadar farklıdır.", en: "Any antiderivative F differs from A by a constant C = −F(a)." } },
            ],
          },
        },
        { eq: R`\int_1^\infty \frac{dx}{x^p} = \begin{cases}\frac{1}{p-1} & p > 1 \\ \infty & p \le 1\end{cases}, \qquad \int_0^1 \frac{dx}{x^p} = \begin{cases}\frac{1}{1-p} & p < 1 \\ \infty & p \ge 1\end{cases}` },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
