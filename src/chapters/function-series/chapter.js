import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { taylorCos, taylorExp, taylorLn1p, taylorSin } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "fs-intro",
    title: { tr: "Fonksiyon Serileri, Kuvvet Serileri ve Taylor Açılımları", en: "Function Series, Power Series & Taylor Expansions" },
    paragraphs: [
      {
        tr: R`Sayı serilerini \(x\) değişkenine bağladığımızda <b>fonksiyon dizileri ve serileri</b> doğar. [[uniform-convergence|Düzgün yakınsaklık]], limit fonksiyonun sürekliliğini korur ve terim terim türev/integrale izin verir. [[power-series|Kuvvet serileri]] ve [[taylor-series|Taylor serileri]] ise \(\sin x, e^x, \ln(1+x)\) gibi aşkın fonksiyonları polinomlara dönüştürür!`,
        en: R`Letting terms depend on \(x\) yields <b>function series</b>. [[uniform-convergence|Uniform convergence]] preserves continuity and permits term-by-term integration. [[power-series|Power series]] and [[taylor-series|Taylor series]] turn transcendental functions like \(\sin x, e^x, \ln(1+x)\) into infinite polynomials!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> noktasal ile düzgün yakınsaklık arasındaki farkı görsel olarak ayırt edecek, kuvvet serisinin yakınsaklık yarıçapı \(R\)'yi hesaplayacak ve Taylor polinomlarının derece \(N\) arttıkça eğriye nasıl sarıldığını deneyimleyeceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will visually separate pointwise from uniform convergence, compute radius of convergence \(R\), and explore Taylor polynomials wrapping onto transcendental curves as degree \(N\) increases.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 17 · Fonksiyon Serileri", en: "Lecture 17 · Function Series" }],
      [{ tr: "Yakınsaklık yarıçapı", en: "Radius R" }, { tr: R`\(R = \lim \left|\frac{c_n}{c_{n+1}}\right|\) (yakınsak: \(|x-a| < R\))`, en: R`\(R = \lim \left|\frac{c_n}{c_{n+1}}\right|\) (converges for \(|x-a| < R\))` }],
      [{ tr: "Taylor polinomu", en: "Taylor polynomial" }, { tr: R`\(T_N(x) = \sum_{k=0}^N \frac{f^{(k)}(a)}{k!}(x-a)^k\)`, en: R`\(T_N(x) = \sum_{k=0}^N \frac{f^{(k)}(a)}{k!}(x-a)^k\)` }],
    ],
  },
  sections: [
    {
      id: "fs-uniform",
      mathId: "m-fs-unif",
      title: { tr: "Noktasal vs Düzgün Yakınsaklık (ε-Tüpü)", en: "Pointwise vs Uniform Convergence (The ε-Tube)" },
      body: [
        {
          tr: R`\([0, 1]\) üzerinde \(f_n(x) = x^n\) her noktada yakınsar (\(x<1\) için 0, \(x=1\) için 1), ama sürekli fonksiyonların limiti <b>süreksiz</b> çıkar — çünkü yakınsaklık <b>düzgün değildir</b>! Oysa \(g_n(x) = \frac{\sin(nx)}{n}\) her \(x\)'te aynı anda \(1/n \to 0\) kadar küçülür ve \(\varepsilon\)-tüpüne tamamen girer.`,
          en: R`On \([0,1]\), \(f_n(x)=x^n\) converges pointwise to a <b>discontinuous</b> limit (0 for \(x<1\), 1 at \(x=1\)) because convergence is <b>not uniform</b>! By contrast, \(g_n(x)=\frac{\sin(nx)}{n}\) slips completely inside any \(\varepsilon\)-tube simultaneously!`,
        },
        { eq: R`\sup_{x \in I} |f_n(x) - f(x)| \xrightarrow{n\to\infty} 0 \quad (\text{düzgün / uniform})` },
        {
          tr: R`<b>Deneyin:</b> \(f_n(x)=x^n\) ile \(\frac{\sin(nx)}{n}\) arasında geçiş yapıp \(n\)'yi büyütün. \(x^n\) ne kadar büyük \(n\) seçerseniz seçin \(x=1\) yakınında \(\varepsilon\)-tüpünün dışına taşmaya devam eder!`,
          en: R`<b>Try it:</b> toggle between \(x^n\) and \(\frac{\sin(nx)}{n}\) and raise \(n\). No matter how large \(n\) is, \(x^n\) always spikes out of the \(\varepsilon\)-band near \(x=1\)!`,
        },
      ],
      demo(box, state) {
        const s = (state.unif ??= { mode: "xn", n: 8 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, msg);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          if (s.mode === "xn") {
            plot.draw({
              x: [-0.05, 1.08], y: [-0.15, 1.15], xLabel: "x", yLabel: "fₙ(x)",
              bands: [{ axis: "y", from: -0.2, to: 0.2, color: "rgba(42,120,214,0.14)", border: COLORS.c1 }],
              curves: [{ f: (x) => (x >= 0 && x <= 1 ? x ** s.n : NaN), color: COLORS.c2, width: 2.6 }],
              points: [{ x: 1, y: 1, color: COLORS.c2, r: 5 }],
            });
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `sup |xⁿ − f(x)| = 1 (n=${s.n} ne kadar büyürse büyüsün 0'a gitmez!) → Yalnızca noktasal yakınsak.`,
              en: `sup |xⁿ − f(x)| = 1 regardless of n = ${s.n} → Pointwise only, NOT uniform!`,
            });
          } else {
            const sup = 1 / s.n;
            plot.draw({
              x: [0, 6.3], y: [-0.6, 0.6], xLabel: "x", yLabel: "gₙ(x)",
              bands: [{ axis: "y", from: -0.2, to: 0.2, color: "rgba(27,175,122,0.14)", border: COLORS.c3 }],
              curves: [{ f: (x) => Math.sin(s.n * x) / s.n, color: COLORS.c1, width: 2.5 }],
            });
            msg.className = sup <= 0.2 ? "pc-msg good" : "pc-msg info";
            msg.textContent = L({
              tr: `sup |sin(${s.n}x)/${s.n}| = ${ns(sup, 3)} → 0. ${sup <= 0.2 ? "Tüm eğri ε = 0,2 tüpünün içinde!" : "n ≥ 5 yapınca tüm eğri tüpe girer!"}`,
              en: `sup |sin(${s.n}x)/${s.n}| = ${ns(sup, 3)} → 0. ${sup <= 0.2 ? "Entire curve sits inside the ε = 0.2 tube!" : "Set n ≥ 5 to enter the ε = 0.2 tube!"}`,
            });
          }
        };
        ctl.append(
          segmented([["xn", "fₙ(x) = xⁿ"], ["sinn", "gₙ(x) = sin(nx)/n"]], s.mode, (v) => { s.mode = v; draw(); }),
          slider("n", { min: 1, max: 30, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "fs-taylor",
      mathId: "m-fs-taylor",
      title: { tr: "Taylor / Maclaurin Polinomları ve Yakınsaklık Yarıçapı", en: "Taylor / Maclaurin Polynomials & Radius R" },
      body: [
        {
          tr: R`Bir fonksiyonun \(x = 0\)'daki ilk \(N\) türevini eşleştiren polinom \(T_N(x)\), o noktanın civarında fonksiyonu olağanüstü isabetle taklit eder. \(\sin x, \cos x, e^x\) için yakınsaklık yarıçapı \(R = \infty\)'dir; oysa \(\ln(1+x)\) ve \(\frac{1}{1-x}\) için \(R = 1\)'dir — \(|x| > 1\) olunca polinom patlar!`,
          en: R`Matching the first \(N\) derivatives at \(0\) produces \(T_N(x)\). While \(\sin x, \cos x, e^x\) have radius \(R = \infty\), \(\ln(1+x)\) and \(\frac{1}{1-x}\) stop converging at \(R = 1\)!`,
        },
        { eq: R`e^x = \sum_{n=0}^\infty \frac{x^n}{n!},\qquad \sin x = \sum_{k=0}^\infty (-1)^k\frac{x^{2k+1}}{(2k+1)!},\qquad \frac{1}{1-x} = \sum_{n=0}^\infty x^n\ (|x|<1)` },
        {
          tr: R`<b>Deneyin:</b> Derece \(N\)'yi artırın ve \(\ln(1+x)\) veya \(1/(1-x)\) seçtiğinizde \(x = \pm 1\) duvarının ötesinde polinomun nasıl saptığını izleyin!`,
          en: R`<b>Try it:</b> scrub degree \(N\) upward and compare \(R = \infty\) (\(\sin x, e^x\)) against \(R = 1\) (\(\ln(1+x)\))!`,
        },
      ],
      demo(box, state) {
        const s = (state.tay ??= { fn: "sin", N: 5 });
        const fns = {
          sin: { name: "sin(x)", f: (x) => Math.sin(x), T: (x, n) => taylorSin(x, n), R: "∞", xr: [-6.5, 6.5], yr: [-2.2, 2.2] },
          cos: { name: "cos(x)", f: (x) => Math.cos(x), T: (x, n) => taylorCos(x, n), R: "∞", xr: [-6.5, 6.5], yr: [-2.2, 2.2] },
          exp: { name: "eˣ", f: (x) => Math.exp(x), T: (x, n) => taylorExp(x, n), R: "∞", xr: [-3.5, 3], yr: [-1, 8] },
          ln1p: { name: "ln(1+x)", f: (x) => (x > -1 ? Math.log(1 + x) : NaN), T: (x, n) => taylorLn1p(x, n), R: "1", xr: [-1.4, 2.2], yr: [-2.5, 1.8] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const cur = fns[s.fn];
          plot.draw({
            x: cur.xr, y: cur.yr, xLabel: "x", yLabel: "y",
            bands: cur.R === "1" ? [{ axis: "x", from: -1, to: 1, color: "rgba(27,175,122,0.10)", border: COLORS.c3 }] : [],
            curves: [
              { f: cur.f, color: COLORS.muted, width: 2.2, dash: [6, 4] },
              { f: (x) => cur.T(x, s.N), color: COLORS.c1, width: 2.7 },
            ],
          });
          const xTest = s.fn === "ln1p" ? 0.5 : 1.5;
          const err = Math.abs(cur.f(xTest) - cur.T(xTest, s.N));
          calc.textContent = `\\(R = ${cur.R},\\qquad |f(${tx(xTest, 1)}) - T_{${s.N}}(${tx(xTest, 1)})| = ${tx(err, 5)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("N", { min: 1, max: 13, step: 1, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Kuvvet Serisi & Taylor Hata Tezgâhı", en: "Power Series & Taylor Error Workbench" },
    sub: {
      tr: R`\(e^x\) ve \(\sin x\) için değerlendirme noktası \(x_0\) ile polinom derecesi \(N\)'yi değiştirin; kesin değer, Taylor yaklaşımı ve gerçek kalan hata \(|R_N(x_0)|\)'ı anlık okuyun.`,
      en: R`Adjust evaluation point \(x_0\) and polynomial degree \(N\) to inspect exact value, \(T_N(x_0)\), and remainder error \(|R_N(x_0)|\) live.`,
    },
    build(host, state) {
      const s = (state.pg ??= { fn: "exp", N: 4, x0: 1.5 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 370 });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      side.append(ctl, tiles);

      const draw = () => {
        const f = s.fn === "exp" ? (x) => Math.exp(x) : (x) => Math.sin(x);
        const T = s.fn === "exp" ? (x) => taylorExp(x, s.N) : (x) => taylorSin(x, s.N);
        const ex = f(s.x0), ap = T(s.x0);
        plot.draw({
          x: [-4, 4], y: s.fn === "exp" ? [-1, 10] : [-2, 2], xLabel: "x", yLabel: "y",
          curves: [
            { f, color: COLORS.muted, dash: [5, 4], width: 2 },
            { f: T, color: COLORS.c1, width: 2.7 },
          ],
          segments: [{ from: [s.x0, ex], to: [s.x0, ap], color: COLORS.c2, width: 2.4 }],
          points: [
            { x: s.x0, y: ex, color: COLORS.c3, r: 5 },
            { x: s.x0, y: ap, color: COLORS.c2, r: 5 },
          ],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f(x₀)" }), h("span", { class: "pg-tile-value", text: ns(ex, 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `T_${s.N}(x₀)` }), h("span", { class: "pg-tile-value", text: ns(ap, 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "|Rₙ(x₀)|" }), h("span", { class: "pg-tile-value", text: ns(Math.abs(ex - ap), 5) })),
        );
      };
      ctl.append(
        segmented([["exp", "eˣ"], ["sin", "sin(x)"]], s.fn, (v) => { s.fn = v; draw(); }),
        slider("N", { min: 1, max: 11, step: 1, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
        slider("x₀", { min: -3, max: 3, step: 0.25, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-fs-unif",
      title: { tr: "Weierstrass M-Testi ve Terim Terim İşlemler", en: "Weierstrass M-Test & Term-by-Term Operations" },
      blocks: [
        { eq: R`|f_n(x)| \le M_n\ (\forall x\in I) \text{ ve } \sum_{n=1}^\infty M_n < \infty \implies \sum_{n=1}^\infty f_n(x)\ \text{düzgün yakınsak}` },
        {
          p: {
            tr: R`Düzgün yakınsaklık sağlandığında sürekli fonksiyonların serisi süreklidir ve integral ile toplam yer değiştirebilir: \(\int_a^b \sum f_n = \sum \int_a^b f_n\).`,
            en: R`Uniform convergence preserves continuity and justifies interchanging summation and integration: \(\int_a^b \sum f_n = \sum \int_a^b f_n\).`,
          },
        },
      ],
    },
    {
      id: "m-fs-taylor",
      title: { tr: "Taylor Katsayılarının Türetilmesi ve Lagrange Kalanı", en: "Derivation of Taylor Coefficients & Lagrange Remainder" },
      blocks: [
        {
          derive: {
            title: { tr: "Kuvvet serisinden cₖ = f⁽ᵏ⁾(a) / k! formülü", en: "Recovering cₖ = f⁽ᵏ⁾(a) / k! from a power series" },
            steps: [
              { tex: R`f(x) = c_0 + c_1(x-a) + c_2(x-a)^2 + c_3(x-a)^3 + \cdots`, why: { tr: "Yakınsaklık aralığının içinde kuvvet serisi sonsuz kez türevlenebilir.", en: "Inside its interval of convergence, a power series is infinitely differentiable." } },
              { tex: R`f^{(k)}(x) = k!\,c_k + \frac{(k+1)!}{1!}c_{k+1}(x-a) + \cdots`, why: { tr: "k kez türev alındığında derecesi k'dan küçük tüm terimler yok olur.", en: "Differentiating k times annihilates all powers below k and leaves k!·cₖ as the constant term." } },
              { tex: R`f^{(k)}(a) = k!\,c_k \implies c_k = \frac{f^{(k)}(a)}{k!}`, why: { tr: "x = a yerine konulunca yalnızca cₖ terimi kalır.", en: "Evaluating at x = a isolates cₖ = f⁽ᵏ⁾(a) / k!." } },
            ],
          },
        },
        { eq: R`R_N(x) = \frac{f^{(N+1)}(\xi)}{(N+1)!}(x - a)^{N+1} \quad (\xi \text{ arada / between } a \text{ and } x)` },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
