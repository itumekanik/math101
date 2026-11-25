import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { geometricPartialSum, pSeriesSum } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "ss-intro",
    title: { tr: "Reel Sayı Dizileri ve Serileri", en: "Sequences & Series of Real Numbers" },
    paragraphs: [
      {
        tr: R`Bir sonsuz toplam ([[series|seri]]) \(\sum_{n=1}^\infty a_n\), kısmi toplamlar dizisinin \(S_N = a_1 + \dots + a_N\) limiti olarak tanımlanır. En büyük tuzak şudur: terimler sıfıra gitse bile (\(a_n \to 0\)), seri ıraksayabilir — en ünlü örnek <b>harmonik seri</b> \(\sum \frac{1}{n} = \infty\)'dir!`,
        en: R`An infinite [[series|series]] \(\sum_{n=1}^\infty a_n\) is defined as the limit of its partial sums \(S_N = a_1 + \dots + a_N\). The classic pitfall: even if \(a_n \to 0\), the series can still diverge — famously the <b>harmonic series</b> \(\sum \frac{1}{n} = \infty\)!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> kısmi toplam grafiklerini yorumlayacak, geometrik ve \(p\)-serilerinin yakınsaklık sınırını (\(p > 1\)), Oran/İntegral/Karşılaştırma testlerini ve Leibniz alterne seri hata sınırını kullanabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will interpret partial sum plots, apply geometric and \(p\)-series thresholds (\(p > 1\)), use Ratio, Integral, and Comparison tests, and bound alternating series errors via Leibniz.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 16 · Reel Sayı Dizileri ve Serileri", en: "Lecture 16 · Sequences & Real Series" }],
      [{ tr: "Geometrik seri", en: "Geometric series" }, { tr: R`\(\sum_{n=0}^\infty r^n = \frac{1}{1-r}\iff |r|<1\)`, en: R`\(\sum_{n=0}^\infty r^n = \frac{1}{1-r}\iff |r|<1\)` }],
      [{ tr: "p-serisi & Oran", en: "p-series & Ratio" }, { tr: R`\(\sum n^{-p}\) yakınsak \(\iff p>1\); Oran testi \(L<1\)`, en: R`\(\sum n^{-p}\) converges \(\iff p>1\); Ratio test \(L<1\)` }],
    ],
  },
  sections: [
    {
      id: "ss-partial",
      mathId: "m-ss-geom",
      title: { tr: "Terimler aₙ vs Kısmi Toplamlar Sₙ", en: "Terms aₙ vs Partial Sums Sₙ" },
      body: [
        {
          tr: R`Aşağıdaki grafikte her terim \(a_n\) hızla sıfıra iniyor gibi görünse de, kısmi toplamlar \(S_N\)'nin davranışı tamamen farklı olabilir: \(\sum \frac{1}{n^2} \to \frac{\pi^2}{6} \approx 1{,}645\) yakınsarken, \(\sum \frac{1}{n}\) sonsuza kadar tırmanmaya devam eder!`,
          en: R`Even when individual terms \(a_n\) appear to vanish quickly, partial sums \(S_N\) behave dramatically differently: \(\sum \frac{1}{n^2} \to \frac{\pi^2}{6} \approx 1.645\) converges, whereas \(\sum \frac{1}{n}\) climbs forever!`,
        },
        { eq: R`S_N = \sum_{n=1}^{N} a_n, \qquad \sum_{n=1}^\infty a_n \text{ yakınsak} \implies \lim_{n\to\infty} a_n = 0\ (\text{tersi yanlış!})` },
        {
          tr: R`<b>Deneyin:</b> Seri türünü değiştirin ve \(N\)'yi artırarak \(S_N\) (mavi noktalar) ile \(a_n\) (yeşil) arasındaki farkı inceleyin; alterne harmonik serinin \(\ln 2\) etrafında salınarak daralışını izleyin!`,
          en: R`<b>Try it:</b> switch series and increase \(N\) to compare \(S_N\) (blue) against \(a_n\) (green); watch the alternating harmonic series oscillate smoothly into \(\ln 2\)!`,
        },
      ],
      demo(box, state) {
        const s = (state.ser ??= { kind: "p2", N: 25 });
        const families = {
          geom: { label: "Σ (0.6)ⁿ", term: (n) => 0.6 ** (n - 1), exact: 2.5, yMax: 3 },
          harm: { label: "Σ 1/n", term: (n) => 1 / n, exact: null, yMax: 5 },
          p2: { label: "Σ 1/n²", term: (n) => 1 / (n * n), exact: (Math.PI * Math.PI) / 6, yMax: 2.2 },
          alt: { label: "Σ (−1)ⁿ⁻¹/n", term: (n) => (n % 2 === 1 ? 1 : -1) / n, exact: Math.LN2, yMax: 1.3 },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const fam = families[s.kind];
          const ptsS = [];
          const ptsA = [];
          let sum = 0;
          for (let n = 1; n <= s.N; n++) {
            const a = fam.term(n);
            sum += a;
            ptsA.push({ x: n, y: a, color: COLORS.c3, r: 3 });
            ptsS.push({ x: n, y: sum, color: COLORS.c1, r: 4 });
          }
          const segs = [];
          for (let i = 0; i < ptsS.length - 1; i++) {
            segs.push({ from: [ptsS[i].x, ptsS[i].y], to: [ptsS[i + 1].x, ptsS[i + 1].y], color: COLORS.c1, width: 1.6 });
          }
          plot.draw({
            x: [0, Math.max(10, s.N + 2)],
            y: [s.kind === "alt" ? -0.6 : -0.1, fam.yMax],
            xLabel: "n", yLabel: "Sₙ / aₙ",
            lines: fam.exact != null ? [{ a: 0, b: 1, c: -fam.exact, color: COLORS.c2, dash: [5, 4], label: `S = ${ns(fam.exact, 3)}` }] : [],
            segments: segs,
            points: [...ptsA, ...ptsS],
          });
          calc.textContent = fam.exact != null
            ? `\\(S_{${s.N}} = ${tx(sum, 4)},\\qquad S_{\\infty} = ${tx(fam.exact, 4)},\\qquad |S_{\\infty} - S_{${s.N}}| = ${tx(Math.abs(fam.exact - sum), 4)}\\)`
            : `\\(S_{${s.N}} = ${tx(sum, 4)}\\quad (\\text{${L({ tr: "Sınır yok: harmonik seri ıraksar!", en: "Unbounded: harmonic series diverges!" })}})\\)`;
        };
        ctl.append(
          segmented(Object.entries(families).map(([k, v]) => [k, v.label]), s.kind, (v) => { s.kind = v; draw(); }),
          slider("N", { min: 5, max: 60, step: 5, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "ss-integral-test",
      mathId: "m-ss-tests",
      title: { tr: "İntegral Testi: Dikdörtgenler ve p = 1 Eşiği", en: "The Integral Test & The p = 1 Threshold" },
      body: [
        {
          tr: R`Pozitif ve azalan \(f(x) = 1/x^p\) için seri toplamı \(\sum_{n=1}^\infty \frac{1}{n^p}\) birim genişlikli dikdörtgen alanlarıdır ve eğri altındaki \(\int_1^\infty x^{-p}\,dx\) integraliyle aynı kaderi paylaşır!`,
          en: R`For positive decreasing \(f(x) = 1/x^p\), the series \(\sum_{n=1}^\infty n^{-p}\) is a sum of unit-width rectangles sharing the exact same fate as \(\int_1^\infty x^{-p}\,dx\)!`,
        },
        { eq: R`\int_1^\infty \frac{dx}{x^p} < \infty \iff p > 1 \iff \sum_{n=1}^\infty \frac{1}{n^p} \text{ yakınsak}` },
        {
          tr: R`<b>Deneyin:</b> \(p\) üssünü \(0{,}6\)'dan \(2{,}5\)'e kaydırın; tam \(p = 1\)'de yakınsaklık durumunun nasıl değiştiğini gözlemleyin.`,
          en: R`<b>Try it:</b> slide \(p\) across the critical boundary \(p = 1\) and compare the series sum against the tail integral.`,
        },
      ],
      demo(box, state) {
        const s = (state.it ??= { p: 1.5 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, msg);
        const plot = createCanvas2D(host, { height: 250 });

        const draw = () => {
          const f = (x) => (x > 0 ? 1 / x ** s.p : NaN);
          const rects = [];
          for (let n = 1; n <= 12; n++) {
            rects.push({ x0: n, x1: n + 1, y0: 0, y1: f(n), fill: "rgba(42,120,214,0.16)", stroke: COLORS.c1 });
          }
          plot.draw({
            x: [0.5, 13], y: [-0.05, 1.2], xLabel: "x", yLabel: "1/xᵖ",
            rects,
            curves: [{ f, color: COLORS.c2, width: 2.6, xRange: [1, 13] }],
          });
          const s20 = pSeriesSum(s.p, 20);
          if (s.p > 1) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `p = ${ns(s.p, 2)} > 1 → Yakınsak! ∫₁^∞ x⁻ᵖ dx = ${ns(1 / (s.p - 1), 3)}, S₂₀ = ${ns(s20, 3)}.`,
              en: `p = ${ns(s.p, 2)} > 1 → Convergent! ∫₁^∞ x⁻ᵖ dx = ${ns(1 / (s.p - 1), 3)}, S₂₀ = ${ns(s20, 3)}.`,
            });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `p = ${ns(s.p, 2)} ≤ 1 → Iraksak! Kuyruk integrali sonsuz, S₂₀ = ${ns(s20, 3)} büyümeye devam eder.`,
              en: `p = ${ns(s.p, 2)} ≤ 1 → Divergent! Tail integral is ∞; S₂₀ = ${ns(s20, 3)} grows without bound.`,
            });
          }
        };
        ctl.append(slider("p", { min: 0.5, max: 2.5, step: 0.1, value: s.p, onInput: (v) => { s.p = v; draw(); } }));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Geometrik Seri & Oran Testi Stüdyosu", en: "Geometric Series & Ratio Studio" },
    sub: {
      tr: R`Ortak çarpan \(r\)'yi \(-1{,}2\) ile \(+1{,}2\) arasında kaydırarak geometrik serinin yakınsama (\(|r|<1\)), salınım (\(r=-1\)) ve patlama (\(|r|>1\)) rejimlerini canlı görün.`,
      en: R`Slide common ratio \(r \in [-1.2, 1.2]\) to see convergence (\(|r|<1\)), oscillation (\(r=-1\)), and divergence (\(|r|>1\)) live.`,
    },
    build(host, state) {
      const s = (state.pg ??= { r: 0.7, N: 20 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 370 });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      side.append(ctl, tiles);

      const draw = () => {
        const pts = [];
        let maxAbs = 2;
        for (let n = 0; n <= s.N; n++) {
          const val = geometricPartialSum(s.r, n);
          if (Math.abs(val) < 100) maxAbs = Math.max(maxAbs, Math.abs(val) * 1.15);
          pts.push({ x: n, y: Math.max(-50, Math.min(50, val)), color: COLORS.c1, r: 4 });
        }
        const conv = Math.abs(s.r) < 1;
        const exact = conv ? 1 / (1 - s.r) : NaN;
        plot.draw({
          x: [-0.5, s.N + 1], y: [-Math.min(12, maxAbs), Math.min(12, maxAbs)], xLabel: "N", yLabel: "Sₙ",
          lines: conv ? [{ a: 0, b: 1, c: -exact, color: COLORS.c2, dash: [5, 4], label: `1/(1−r) = ${ns(exact, 3)}` }] : [],
          points: pts,
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "|r|" }), h("span", { class: "pg-tile-value", text: ns(Math.abs(s.r), 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `S_${s.N}` }), h("span", { class: "pg-tile-value", text: ns(geometricPartialSum(s.r, s.N), 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "1/(1−r)" }), h("span", { class: "pg-tile-value", text: conv ? ns(exact, 3) : "∞ / ∄" })),
        );
      };
      ctl.append(
        slider("r", { min: -1.15, max: 1.15, step: 0.05, value: s.r, onInput: (v) => { s.r = v; draw(); } }),
        slider("N", { min: 5, max: 35, step: 5, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-ss-geom",
      title: { tr: "Geometrik Seri Toplamı ve Harmonik Serinin Iraksaklık İspatı", en: "Geometric Sum & Oresme's Proof for the Harmonic Series" },
      blocks: [
        {
          derive: {
            title: { tr: "Harmonik serinin ıraksadığı (Oresme gruplama ispatı)", en: "Oresme's grouping proof that Σ 1/n = ∞" },
            steps: [
              { tex: R`H = 1 + \frac{1}{2} + \left(\frac{1}{3} + \frac{1}{4}\right) + \left(\frac{1}{5} + \frac{1}{6} + \frac{1}{7} + \frac{1}{8}\right) + \cdots`, why: { tr: "Terimleri 2, 4, 8, ... uzunluğunda bloklara ayırırız.", en: "Group terms into blocks of length 2, 4, 8, ..." } },
              { tex: R`\frac{1}{3}+\frac{1}{4} > \frac{1}{4}+\frac{1}{4} = \frac{1}{2}, \qquad \frac{1}{5}+\cdots+\frac{1}{8} > 4\cdot\frac{1}{8} = \frac{1}{2}`, why: { tr: "Her bloktaki her terim bloğun son teriminden büyüktür; her blok > 1/2 eder!", en: "Every block has sum strictly exceeding 1/2!" } },
              { tex: R`S_{2^k} > 1 + \frac{k}{2} \xrightarrow{k\to\infty} \infty`, why: { tr: "Kısmi toplamlar üstten sınırsızdır → seri ıraksar.", en: "Partial sums grow past every bound → series diverges." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-ss-tests",
      title: { tr: "Yakınsaklık Testleri Özet Tablosu", en: "Convergence Tests Quick Reference" },
      blocks: [
        {
          table: {
            head: [{ tr: "Test", en: "Test" }, { tr: "Koşul / Formül", en: "Criterion" }, { tr: "Sonuç", en: "Conclusion" }],
            rows: [
              [{ tr: "Iraksaklık testi", en: "Divergence test" }, R`\(\lim a_n \ne 0\)`, { tr: "Kesinlikle ıraksar", en: "Must diverge" }],
              [{ tr: "Oran testi (d'Alembert)", en: "Ratio test" }, R`\(L = \lim |a_{n+1}/a_n|\)`, { tr: R`\(L<1\) mutlak yakınsak, \(L>1\) ıraksak, \(L=1\) belirsiz`, en: R`\(L<1\) abs. conv., \(L>1\) div., \(L=1\) inconclusive` }],
              [{ tr: "Kök testi (Cauchy)", en: "Root test" }, R`\(L = \lim \sqrt[n]{|a_n|}\)`, { tr: R`\(L<1\) mutlak yakınsak, \(L>1\) ıraksak`, en: R`\(L<1\) abs. conv., \(L>1\) div.` }],
              [{ tr: "Leibniz (Alterne)", en: "Alternating (Leibniz)" }, R`\(\sum (-1)^n b_n,\ b_n\downarrow 0\)`, { tr: R`Yakınsak; hata \(|R_N| \le b_{N+1}\)`, en: R`Converges; error \(|R_N| \le b_{N+1}\)` }],
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
