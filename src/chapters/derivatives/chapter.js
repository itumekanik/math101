import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { newtonRaphson, numDiff, numDiff2 } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "der-intro",
    title: { tr: "Türevler ve Türev Uygulamaları", en: "Derivatives & Applications of Derivatives" },
    paragraphs: [
      {
        tr: R`[[derivative|Türev]] \(f'(x_0)\), iki nokta arasındaki kirişin (ortalama değişim hızı) \(h \to 0\) iken teğete (anlık hız) dönüşmesidir. Bir fonksiyonun birinci türevi artma/azalma ve ekstremumları, ikinci türevi \(f''\) ise içbükeylik ve dönüm noktalarını yönetir.`,
        en: R`The [[derivative|derivative]] \(f'(x_0)\) is the limit of secant slopes as \(h \to 0\), turning average rate into instantaneous slope. The sign of \(f'\) governs monotonicity and extrema; \(f''\) governs concavity and inflection points.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> kirişten teğete geçişi, \(f, f', f''\) üçlüsünü, [[mvt|Ortalama Değer Teoremini (MVT)]], [[lhopital|L'Hôpital kuralını]] ve Newton–Raphson kök bulma yöntemini etkileşimli olarak kullanabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will visualize secant-to-tangent limits, connect \(f, f', f''\), verify the [[mvt|Mean Value Theorem]], apply [[lhopital|L'Hôpital's rule]], and run Newton–Raphson root finding.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 14+15 · Türevler + Türev Uygulamaları", en: "Lecture 14+15 · Derivatives + Applications" }],
      [{ tr: "Doğrusal yaklaşım", en: "Linearization" }, { tr: R`\(L(x) = f(a) + f'(a)(x - a)\)`, en: R`\(L(x) = f(a) + f'(a)(x - a)\)` }],
      [{ tr: "Büyük teoremler", en: "Key theorems" }, { tr: R`Rolle, Lagrange (MVT), L'Hôpital, Newton–Raphson`, en: R`Rolle, Lagrange (MVT), L'Hôpital, Newton–Raphson` }],
    ],
  },
  sections: [
    {
      id: "der-secant",
      mathId: "m-der-rules",
      title: { tr: "Kirişten Teğete: h → 0 Limiti", en: "Secant to Tangent: Shrinking h → 0" },
      body: [
        {
          tr: R`\(x_0\) ve \(x_0 + h\) noktalarından geçen kirişin eğimi \(\frac{f(x_0+h)-f(x_0)}{h}\)'dir. \(h\) sıfıra yaklaştıkça kiriş doğrusu eğriye tam dokunan <b>teğet doğrusuna</b> yapışır.`,
          en: R`The secant through \(x_0\) and \(x_0 + h\) has slope \(\frac{f(x_0+h)-f(x_0)}{h}\). As \(h \to 0\), the secant rotates smoothly into the <b>tangent line</b>.`,
        },
        { eq: R`f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}` },
        {
          tr: R`<b>Deneyin:</b> \(h\)'yi \(2\)'den \(0{,}05\)'e doğru küçültün ve kiriş (turuncu) ile gerçek teğetin (yeşil kesikli) üst üste oturduğunu izleyin.`,
          en: R`<b>Try it:</b> shrink \(h\) toward \(0\) and watch the secant (orange) converge onto the true tangent (dashed green).`,
        },
      ],
      demo(box, state) {
        const s = (state.sec ??= { x0: 1, h: 1.5 });
        const f = (x) => 0.4 * x * x * x - 0.8 * x + 1;
        const df = (x) => 1.2 * x * x - 0.8;
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const y0 = f(s.x0);
          const x1 = s.x0 + s.h;
          const y1 = f(x1);
          const mSec = (y1 - y0) / s.h;
          const mTan = df(s.x0);
          plot.draw({
            x: [-2.5, 3.5], y: [-2, 6], xLabel: "x", yLabel: "y",
            curves: [{ f, color: COLORS.c1, width: 2.6 }],
            lines: [
              { a: mTan, b: -1, c: y0 - mTan * s.x0, color: COLORS.c3, dash: [5, 4], width: 2, label: "teğet" },
              { a: mSec, b: -1, c: y0 - mSec * s.x0, color: COLORS.c2, width: 2.3, label: "kiriş" },
            ],
            points: [
              { x: s.x0, y: y0, color: COLORS.c3, r: 5.5 },
              { x: x1, y: y1, color: COLORS.c2, r: 5.5 },
            ],
          });
          calc.textContent = `\\(m_{\\text{sec}} = \\frac{f(x_0+h)-f(x_0)}{h} = ${tx(mSec, 3)},\\qquad f'(x_0) = ${tx(mTan, 3)}\\)`;
        };
        ctl.append(
          slider("x₀", { min: -1.5, max: 2, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
          slider("h", { min: 0.05, max: 2.0, step: 0.05, value: s.h, onInput: (v) => { s.h = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "der-mvt",
      mathId: "m-der-mvt",
      title: { tr: "Ortalama Değer Teoremi (MVT) ve Eğri Çizimi", en: "Mean Value Theorem & Curve Sketching" },
      body: [
        {
          tr: R`[[mvt|Lagrange'ın Ortalama Değer Teoremi]], \([a,b]\) uçlarını birleştiren kirişe <b>tam paralel</b> bir teğetin mutlaka bir iç nokta \(c \in (a,b)\)'de bulunduğunu söyler: yolun ortalama hızına anlık hız olarak en az bir kez ulaşılır!`,
          en: R`[[mvt|Lagrange's Mean Value Theorem]] guarantees some interior \(c \in (a,b)\) where the tangent is <b>strictly parallel</b> to the chord joining \(a\) and \(b\): your instantaneous speed must match your average speed at least once!`,
        },
        { eq: R`\exists\, c \in (a, b) : \quad f'(c) = \frac{f(b) - f(a)}{b - a}` },
        {
          tr: R`<b>Deneyin:</b> \([a,b]\) uç noktalarını kaydırın; kirişin eğimine paralel teğet noktası \(c\)'nin otomatik bulunup paralel doğruyla çizildiğini izleyin.`,
          en: R`<b>Try it:</b> adjust the interval endpoints \(a\) and \(b\) to see the guaranteed point \(c\) where the tangent runs parallel to the secant chord.`,
        },
      ],
      demo(box, state) {
        const s = (state.mvt ??= { a: -1.2, b: 2.4 });
        const f = (x) => 0.35 * x * x * x - x + 1;
        const df = (x) => 1.05 * x * x - 1;
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          const a = Math.min(s.a, s.b - 0.4);
          const b = Math.max(s.b, a + 0.4);
          const slope = (f(b) - f(a)) / (b - a);
          // 1.05 c^2 - 1 = slope => c = ± sqrt((slope + 1)/1.05)
          const r = Math.sqrt(Math.max(0, (slope + 1) / 1.05));
          const cands = [-r, r].filter((c) => c > a && c < b);
          const c = cands[0] ?? (a + b) / 2;
          plot.draw({
            x: [-3, 3.5], y: [-2, 4.5], xLabel: "x", yLabel: "y",
            curves: [{ f, color: COLORS.c1, width: 2.6 }],
            segments: [{ from: [a, f(a)], to: [b, f(b)], color: COLORS.c2, width: 2.2 }],
            lines: [{ a: df(c), b: -1, c: f(c) - df(c) * c, color: COLORS.c3, dash: [5, 4], width: 2.2, label: "f'(c)" }],
            points: [
              { x: a, y: f(a), color: COLORS.c2, r: 5 },
              { x: b, y: f(b), color: COLORS.c2, r: 5 },
              { x: c, y: f(c), color: COLORS.c3, r: 6, ring: true, label: `c ≈ ${ns(c, 2)}` },
            ],
          });
          calc.textContent = `\\(\\frac{f(b)-f(a)}{b-a} = ${tx(slope, 3)} = f'(${tx(c, 3)})\\)`;
        };
        ctl.append(
          slider("a", { min: -2.4, max: 1, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
          slider("b", { min: 0.2, max: 2.8, step: 0.2, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "f, f′, f″ Eğri İnceleme & Newton–Raphson Stüdyosu", en: "f, f′, f″ Curve Analysis & Newton–Raphson Studio" },
    sub: {
      tr: R`İki mod arasında geçiş yapın: <b>Türev Analizi</b> (aynı eksende \(f, f', f''\) ve kritik/dönüm noktaları) veya <b>Newton Yöntemi</b> (\(x_{n+1} = x_n - f(x_n)/f'(x_n)\) ile süper hızlı kök bulma).`,
      en: R`Switch between <b>Derivative Analysis</b> (\(f, f', f''\) synchronized) and <b>Newton's Method</b> (\(x_{n+1} = x_n - f(x_n)/f'(x_n)\) quadratic convergence).`,
    },
    build(host, state) {
      const s = (state.pg ??= { mode: "newton", x0: 2.8, fn: "poly" });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 390 });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, ctl2, calc);

      const draw = () => {
        if (s.mode === "newton") {
          const f = (x) => x * x - 2;
          const df = (x) => 2 * x;
          const xs = newtonRaphson(f, df, s.x0, 5);
          const segs = [];
          for (let i = 0; i < xs.length - 1; i++) {
            segs.push(
              { from: [xs[i], 0], to: [xs[i], f(xs[i])], color: COLORS.muted, dash: [3, 3], width: 1.3 },
              { from: [xs[i], f(xs[i])], to: [xs[i + 1], 0], color: COLORS.c2, width: 2 },
            );
          }
          plot.draw({
            x: [0, 3.6], y: [-2.5, 8], xLabel: "x", yLabel: "x² − 2",
            curves: [{ f, color: COLORS.c1, width: 2.7 }],
            segments: segs,
            points: xs.slice(0, 4).map((x, i) => ({ x, y: 0, color: i === 0 ? COLORS.c2 : COLORS.c3, r: 5, label: `x${i}` })),
          });
          calc.textContent = xs.slice(0, 5).map((x, i) => `\\(x_${i} = ${tx(x, 6)}\\)`).join(" → ");
        } else {
          const f = (x) => (x * x * x) / 3 - x;
          const f1 = (x) => numDiff(f, x);
          const f2 = (x) => numDiff2(f, x);
          plot.draw({
            x: [-3, 3], y: [-3.5, 3.5], xLabel: "x", yLabel: "y",
            curves: [
              { f, color: COLORS.c1, width: 2.8 },
              { f: f1, color: COLORS.c2, width: 2.1, dash: [5, 4] },
              { f: f2, color: COLORS.c3, width: 1.9, dash: [2, 3] },
            ],
            points: [
              { x: -1, y: f(-1), color: COLORS.c2, r: 5.5, label: "maks (-1)" },
              { x: 1, y: f(1), color: COLORS.c2, r: 5.5, label: "min (+1)" },
              { x: 0, y: 0, color: COLORS.c3, r: 5.5, label: "dönüm (0)" },
            ],
          });
          calc.textContent = R`\(f(x)=\tfrac{1}{3}x^3-x\ (\text{mavi}),\quad f'(x)=x^2-1\ (\text{turuncu}),\quad f''(x)=2x\ (\text{yeşil})\)`;
        }
      };
      ctl.append(
        segmented([["newton", { tr: "Newton–Raphson (√2)", en: "Newton–Raphson (√2)" }], ["curves", "f, f′, f″"]], s.mode, (v) => { s.mode = v; draw(); }),
      );
      ctl2.append(slider("x₀", { min: 0.6, max: 3.4, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }));
      draw();
    },
  },
  mathSections: [
    {
      id: "m-der-rules",
      title: { tr: "Temel Türev Kuralları ve Çarpım Kuralı İspatı", en: "Differentiation Rules & Product Rule Proof" },
      blocks: [
        { eq: R`(fg)' = f'g + fg', \qquad \left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}, \qquad (f\circ g)'(x) = f'(g(x))\,g'(x)` },
        {
          derive: {
            title: { tr: "Çarpım kuralının ilk ilkelerden ispatı", en: "Proof of the Product Rule from first principles" },
            steps: [
              { tex: R`(fg)'(x) = \lim_{h\to 0}\frac{f(x+h)g(x+h) - f(x)g(x)}{h}`, why: { tr: "Türevin limit tanımı.", en: "Start with the limit definition." } },
              { tex: R`= \lim_{h\to 0}\frac{f(x+h)g(x+h) - f(x)g(x+h) + f(x)g(x+h) - f(x)g(x)}{h}`, why: { tr: "Paya f(x)g(x+h) terimini ekleyip çıkarırız.", en: "Add and subtract f(x)g(x+h) in the numerator." } },
              { tex: R`= \lim_{h\to 0}\left[\frac{f(x+h)-f(x)}{h}g(x+h) + f(x)\frac{g(x+h)-g(x)}{h}\right] = f'(x)g(x) + f(x)g'(x)`, why: { tr: "g türevlenebilir olduğundan süreklidir: g(x+h) → g(x).", en: "Differentiability of g implies continuity, so g(x+h) → g(x)." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-der-mvt",
      title: { tr: "Rolle'den Ortalama Değer Teoremine ve L'Hôpital", en: "From Rolle's Theorem to MVT & L'Hôpital" },
      blocks: [
        {
          derive: {
            title: { tr: "Rolle Teoremi → Lagrange MVT", en: "Deriving MVT from Rolle's Theorem" },
            steps: [
              { tex: R`h(x) = f(x) - \left[f(a) + \frac{f(b)-f(a)}{b-a}(x - a)\right]`, why: { tr: "f(x) ile kiriş doğrusu arasındaki dikey fark fonksiyonunu tanımlarız.", en: "Define h(x) as the vertical gap between f(x) and its secant chord." } },
              { tex: R`h(a) = 0 \quad \text{ve} \quad h(b) = 0`, why: { tr: "Kiriş uçlarda eğriyle çakıştığından h(a) = h(b) = 0; Rolle Teoremi uygulanır!", en: "Since h(a) = h(b) = 0, Rolle's Theorem guarantees some c ∈ (a,b) with h'(c) = 0." } },
              { tex: R`h'(c) = f'(c) - \frac{f(b)-f(a)}{b-a} = 0 \implies f'(c) = \frac{f(b)-f(a)}{b-a}`, why: { tr: "Türev alınıp 0'a eşitlenince MVT ispatlanır.", en: "Setting h'(c) = 0 immediately gives the Mean Value Theorem." } },
            ],
          },
        },
        { eq: R`\lim_{x\to a}\frac{f(x)}{g(x)} \stackrel{0/0,\ \infty/\infty}{=} \lim_{x\to a}\frac{f'(x)}{g'(x)}` },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
