import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "lim-intro",
    title: { tr: "Limitler ve Süreklilik", en: "Limits and Continuity" },
    paragraphs: [
      {
        tr: R`Kalkülüsün tüm yapısı [[limit|limit]] kavramı üzerine kuruludur: \(x\) sayısı \(a\)'ya yaklaşırken \(f(x)\) hangi \(L\) değerine sıkışıyor? Dikkat: \(f(a)\)'nın tanımlı olması bile gerekmez — önemli olan \(a\)'nın <b>delinmiş komşuluğudur</b>!`,
        en: R`All of calculus rests on [[limit|limits]]: what value \(L\) does \(f(x)\) approach as \(x \to a\)? Crucially, \(f(a)\) need not even exist — only the <b>punctured neighborhood</b> around \(a\) matters!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> \(\varepsilon\)–\(\delta\) oyununu görsel olarak oynayacak, Sandviç (Sıkıştırma) Teoremi ile \(\lim_{x\to 0}\frac{\sin x}{x} = 1\)'i ispatlayacak ve [[continuity|süreklilik]] ile Ara Değer Teoremini (IVT) uygulayabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will master the \(\varepsilon\)–\(\delta\) game visually, prove \(\lim_{x\to 0}\frac{\sin x}{x} = 1\) via the Squeeze Theorem, and apply [[continuity|continuity]] and the Intermediate Value Theorem (IVT).`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 13 · Limitler", en: "Lecture 13 · Limits" }],
      [{ tr: "Kesin tanım", en: "Formal definition" }, { tr: R`\(\forall\varepsilon>0\ \exists\delta>0: 0<|x-a|<\delta \Rightarrow |f(x)-L|<\varepsilon\)`, en: R`\(\forall\varepsilon>0\ \exists\delta>0: 0<|x-a|<\delta \Rightarrow |f(x)-L|<\varepsilon\)` }],
      [{ tr: "Temel limitler", en: "Landmark limits" }, { tr: R`\(\lim_{x\to 0}\frac{\sin x}{x}=1,\quad \lim_{n\to\infty}(1+\frac{1}{n})^n = e\)`, en: R`\(\lim_{x\to 0}\frac{\sin x}{x}=1,\quad \lim_{n\to\infty}(1+\frac{1}{n})^n = e\)` }],
    ],
  },
  sections: [
    {
      id: "lim-ed",
      mathId: "m-lim-ed",
      title: { tr: "ε–δ Oyunu: Hedef Bandın İçinde Kalmak", en: "The ε–δ Game: Staying Inside the Target Band" },
      body: [
        {
          tr: R`Biri size \(L\) etrafında ne kadar dar olursa olsun bir hedef şeridi \((L-\varepsilon,\ L+\varepsilon)\) verir. Siz de \(a\) etrafında öyle bir \(\delta\)-penceresi \((a-\delta,\ a+\delta)\) seçmelisiniz ki bu penceredeki tüm grafik parçası yatay \(\varepsilon\)-bandının <b>tamamen içinde</b> kalsın!`,
          en: R`An adversary picks any target tolerance \(\varepsilon > 0\) around \(L\). You must respond with a window \(\delta > 0\) around \(a\) so that the entire curve inside the vertical \(\delta\)-strip stays <b>strictly inside</b> the horizontal \(\varepsilon\)-band!`,
        },
        { eq: R`0 < |x - a| < \delta \implies |f(x) - L| < \varepsilon` },
        {
          tr: R`<b>Deneyin:</b> Önce \(\varepsilon\)'u küçültün; sonra eğri sarı/yeşil kutudan taşmayacak şekilde \(\delta\)'yı daraltın!`,
          en: R`<b>Try it:</b> shrink \(\varepsilon\), then tighten \(\delta\) until the entire graph inside the \(\delta\)-strip stays safely inside the horizontal \(\varepsilon\)-band!`,
        },
      ],
      demo(box, state) {
        const s = (state.ed ??= { eps: 0.7, delta: 0.6 });
        const f = (x) => 0.35 * x * x + 0.5;
        const a = 2, Lval = f(a);
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, msg);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          let ok = true;
          for (let i = 0; i <= 80; i++) {
            const x = a - s.delta + (i / 80) * (2 * s.delta);
            if (Math.abs(f(x) - Lval) >= s.eps) ok = false;
          }
          plot.draw({
            x: [0, 4], y: [0, 4.2], xLabel: "x", yLabel: "f(x)",
            bands: [
              { axis: "y", from: Lval - s.eps, to: Lval + s.eps, color: "rgba(42,120,214,0.14)", border: COLORS.c1 },
              { axis: "x", from: a - s.delta, to: a + s.delta, color: ok ? "rgba(27,175,122,0.16)" : "rgba(208,59,59,0.16)", border: ok ? COLORS.c3 : COLORS.bad },
            ],
            curves: [{ f, color: COLORS.text, width: 2.6 }],
            points: [{ x: a, y: Lval, color: COLORS.c2, r: 5.5, hollow: true, label: `(2, ${ns(Lval, 2)})` }],
          });
          msg.className = ok ? "pc-msg good" : "pc-msg bad";
          msg.textContent = ok
            ? L({ tr: `✓ Başarılı! δ = ${ns(s.delta, 2)} iken şeritteki tüm noktalar |f(x) − L| < ε = ${ns(s.eps, 2)} koşulunu sağlıyor.`, en: `✓ Success! For δ = ${ns(s.delta, 2)}, every point in the strip satisfies |f(x) − L| < ε = ${ns(s.eps, 2)}.` })
            : L({ tr: `✕ Taşma var! δ = ${ns(s.delta, 2)} çok geniş; grafiği ε-bandına sığdırmak için δ'yı küçültün.`, en: `✕ Escaped! δ = ${ns(s.delta, 2)} is too wide; shrink δ to stay inside the ε-band.` });
        };
        ctl.append(
          slider("ε", { min: 0.15, max: 1.2, step: 0.05, value: s.eps, onInput: (v) => { s.eps = v; draw(); } }),
          slider("δ", { min: 0.05, max: 1.0, step: 0.05, value: s.delta, onInput: (v) => { s.delta = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "lim-squeeze",
      mathId: "m-lim-sinx",
      title: { tr: "Sandviç (Sıkıştırma) Teoremi", en: "The Squeeze (Sandwich) Theorem" },
      body: [
        {
          tr: R`Eğer \(g(x) \le f(x) \le h(x)\) ve hem alt sınır \(g(x)\) hem üst sınır \(h(x)\) aynı \(L\) limitine gidiyorsa, arada sıkışan \(f(x)\) de mutlaka \(L\)'ye gitmek zorundadır!`,
          en: R`If \(g(x) \le f(x) \le h(x)\) near \(a\) and both bounds converge to \(L\), the trapped function \(f(x)\) is forced to converge to \(L\) as well!`,
        },
        { eq: R`-|x| \le x\sin\!\left(\frac{1}{x}\right) \le |x| \implies \lim_{x\to 0} x\sin\!\left(\frac{1}{x}\right) = 0` },
        {
          tr: R`<b>Deneyin:</b> İki klasik Sandviç örneği arasında geçiş yapın ve yakınlaştırma kaydırıcısıyla \(x = 0\) etrafına zoom yapın!`,
          en: R`<b>Try it:</b> toggle between two classic Squeeze examples and zoom in toward \(x = 0\)!`,
        },
      ],
      demo(box, state) {
        const s = (state.sq ??= { ex: "sinc", zoom: 1 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          const span = 2.6 / s.zoom;
          if (s.ex === "sinc") {
            plot.draw({
              x: [-span, span], y: [0.4, 1.15], xLabel: "x", yLabel: "y",
              curves: [
                { f: (x) => Math.cos(x), color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: () => 1, color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: (x) => (Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x), color: COLORS.c1, width: 2.7 },
              ],
              points: [{ x: 0, y: 1, color: COLORS.c2, r: 5.5, hollow: true, label: "L = 1" }],
            });
            calc.textContent = R`\(\cos x \le \dfrac{\sin x}{x} \le 1 \implies \lim_{x\to 0}\dfrac{\sin x}{x} = 1\)`;
          } else {
            plot.draw({
              x: [-span * 0.5, span * 0.5], y: [-span * 0.5, span * 0.5], xLabel: "x", yLabel: "y",
              curves: [
                { f: (x) => Math.abs(x), color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: (x) => -Math.abs(x), color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: (x) => (Math.abs(x) < 1e-5 ? 0 : x * Math.sin(1 / x)), color: COLORS.c1, width: 2.2 },
              ],
              points: [{ x: 0, y: 0, color: COLORS.c2, r: 5.5, hollow: true, label: "L = 0" }],
            });
            calc.textContent = R`\(-|x| \le x\sin(1/x) \le |x| \implies \lim_{x\to 0} x\sin(1/x) = 0\)`;
          }
        };
        ctl.append(
          segmented([["sinc", "sin(x)/x"], ["osc", "x·sin(1/x)"]], s.ex, (v) => { s.ex = v; draw(); }),
          slider(L({ tr: "Yakınlaştır", en: "Zoom" }), { min: 1, max: 6, step: 0.5, value: s.zoom, fmt: (v) => `${v}×`, onInput: (v) => { s.zoom = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Limit & Süreksizlik Türleri Laboratuvarı", en: "Limit & Discontinuity Inspector" },
    sub: {
      tr: R`Kaldırılabilir delik, sıçrama süreksizliği, dikey asimptot ve \(1^\infty\) belirsizliği arasında geçiş yapıp sağ/sol yaklaşım değerlerini inceleyin.`,
      en: R`Compare removable holes, jump discontinuities, vertical asymptotes, and \(1^\infty\) forms with live left/right approach values.`,
    },
    build(host, state) {
      const s = (state.pg ??= { kind: "hole", hExp: 1 });
      const cases = {
        hole: { label: { tr: "Delik (0/0)", en: "Removable (0/0)" }, a: 1, f: (x) => (Math.abs(x - 1) < 1e-9 ? NaN : (x * x - 1) / (x - 1)), lim: "2", y: [-1, 5] },
        jump: { label: { tr: "Sıçrama", en: "Jump" }, a: 0, f: (x) => (x < 0 ? -1 : 1), lim: "∄", y: [-2.5, 2.5] },
        asym: { label: { tr: "Asimptot", en: "Asymptote" }, a: 0, f: (x) => 1 / x, lim: "±∞", y: [-6, 6] },
        euler: { label: "(1+x)^(1/x)", a: 0, f: (x) => (x > -1 && Math.abs(x) > 1e-7 ? (1 + x) ** (1 / x) : NaN), lim: "e ≈ 2.718", y: [0, 5] },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 370 });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      side.append(ctl, ctl2, tiles);

      const draw = () => {
        const cur = cases[s.kind];
        const eps = 10 ** -s.hExp;
        const leftV = cur.f(cur.a - eps);
        const rightV = cur.f(cur.a + eps);
        plot.draw({
          x: [cur.a - 3, cur.a + 3], y: cur.y, xLabel: "x", yLabel: "f(x)",
          lines: [{ a: 1, b: 0, c: -cur.a, color: COLORS.muted, dash: [4, 4] }],
          curves: [{ f: cur.f, color: COLORS.c1, width: 2.6 }],
          points: [
            ...(Number.isFinite(leftV) ? [{ x: cur.a - eps, y: leftV, color: COLORS.c3, r: 5 }] : []),
            ...(Number.isFinite(rightV) ? [{ x: cur.a + eps, y: rightV, color: COLORS.c2, r: 5 }] : []),
          ],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `f(a − 10⁻${s.hExp})` }), h("span", { class: "pg-tile-value", text: ns(leftV, 4) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `f(a + 10⁻${s.hExp})` }), h("span", { class: "pg-tile-value", text: ns(rightV, 4) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "lim" }), h("span", { class: "pg-tile-value", text: cur.lim })),
        );
      };
      ctl.append(segmented(Object.entries(cases).map(([k, v]) => [k, v.label]), s.kind, (v) => { s.kind = v; draw(); }));
      ctl2.append(slider("h = 10⁻ᵏ, k", { min: 1, max: 5, step: 1, value: s.hExp, fmt: (v) => String(v), onInput: (v) => { s.hExp = v; draw(); } }));
      draw();
    },
  },
  mathSections: [
    {
      id: "m-lim-ed",
      title: { tr: "ε–δ ile Doğrusal Limit İspatı", en: "Formal ε–δ Proof of a Linear Limit" },
      blocks: [
        {
          derive: {
            title: { tr: "lim_{x→3} (2x − 1) = 5 ispatı", en: "Proof that lim_{x→3} (2x − 1) = 5" },
            steps: [
              { tex: R`|(2x - 1) - 5| = |2x - 6| = 2|x - 3|`, why: { tr: "|f(x) − L| ifadesini |x − a| cinsinden yazarız.", en: "Rewrite |f(x) − L| in terms of |x − a|." } },
              { tex: R`2|x - 3| < \varepsilon \iff |x - 3| < \frac{\varepsilon}{2}`, why: { tr: "Hedef eşitsizliği sağlayan δ koşulu ortaya çıkar.", en: "Solve for the δ bound that guarantees < ε." } },
              { tex: R`\text{Seçim: } \delta = \frac{\varepsilon}{2} \implies \Big(0 < |x-3| < \delta \Rightarrow |f(x) - 5| < \varepsilon\Big)`, why: { tr: "Her ε > 0 için δ = ε/2 çalıştığından limit 5'tir.", en: "Choosing δ = ε/2 works for every ε > 0, proving the limit is 5." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-lim-sinx",
      title: { tr: "Temel Trigonometrik Limit ve Ara Değer Teoremi (IVT)", en: "Fundamental Trig Limit & Intermediate Value Theorem" },
      blocks: [
        { eq: R`\lim_{x\to 0}\frac{\sin x}{x} = 1, \qquad \lim_{x\to 0}\frac{1 - \cos x}{x} = 0, \qquad \lim_{x\to 0}\frac{e^x - 1}{x} = 1` },
        {
          derive: {
            title: { tr: "Birim çember alanlarıyla lim_{x→0} sin(x)/x = 1", en: "Geometric proof of lim_{x→0} sin(x)/x = 1" },
            steps: [
              { tex: R`\frac{1}{2}\sin x < \frac{1}{2}x < \frac{1}{2}\tan x \quad \Big(0 < x < \frac{\pi}{2}\Big)`, why: { tr: "İç üçgen alanı < daire dilimi alanı < dış dik üçgen alanı.", en: "Area of inner triangle < circular sector < outer right triangle." } },
              { tex: R`1 < \frac{x}{\sin x} < \frac{1}{\cos x} \implies \cos x < \frac{\sin x}{x} < 1`, why: { tr: "(1/2)sin x'e bölüp ters çeviririz; çift fonksiyon olduğundan x < 0 için de geçerlidir.", en: "Divide by (1/2)sin x and reciprocate; even symmetry extends to x < 0." } },
              { tex: R`\lim_{x\to 0}\cos x = 1 \text{ ve } \lim_{x\to 0} 1 = 1 \implies \lim_{x\to 0}\frac{\sin x}{x} = 1`, why: { tr: "Sandviç Teoremi limiti 1'e kilitler!", en: "The Squeeze Theorem forces the limit to be 1!" } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
