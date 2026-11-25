import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { numDiff } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "ii-intro",
    title: { tr: "Belirsiz İntegraller ve İntegrasyon Teknikleri", en: "Indefinite Integrals & Integration Techniques" },
    paragraphs: [
      {
        tr: R`Türev almanın ters işlemi [[antiderivative|ilkel fonksiyon]] (belirsiz integral) bulmaktır: \(F'(x) = f(x)\). Bir sabitin türevi 0 olduğundan her ilkel fonksiyon sonsuz bir paralel eğri ailesi \(F(x) + C\) üretir!`,
        en: R`Reversing differentiation yields the [[antiderivative|indefinite integral]]: \(F'(x) = f(x)\). Since constants differentiate to 0, every antiderivative forms an infinite family of vertically shifted curves \(F(x) + C\)!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> \(F(x)+C\) eğri ailesinin her üyesinin aynı \(x\) noktasında aynı eğime sahip olduğunu görecek; değişken değiştirme (\(u\)-substitution), kısmi integrasyon (\(\int u\,dv\)) ve basit kesirlere ayırma tekniklerini ustalıkla uygulayacaksınız.`,
        en: R`<b>By the end of this chapter</b> you will see why every member of \(F(x)+C\) shares the same tangent slope at any \(x\), and apply \(u\)-substitution, integration by parts, and partial fractions.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 18 · Belirsiz İntegraller", en: "Lecture 18 · Indefinite Integrals" }],
      [{ tr: "Temel teknikler", en: "Core methods" }, { tr: R`\(u\)-dönüşümü, Kısmi İntegrasyon (LIATE), Basit Kesirler`, en: R`\(u\)-substitution, Integration by Parts (LIATE), Partial Fractions` }],
      [{ tr: "Kısmi integrasyon", en: "By parts" }, { tr: R`\(\int u\,dv = uv - \int v\,du\)`, en: R`\(\int u\,dv = uv - \int v\,du\)` }],
    ],
  },
  sections: [
    {
      id: "ii-family",
      mathId: "m-ii-table",
      title: { tr: "İlkel Fonksiyon Ailesi F(x) + C ve Eğim Eşitliği", en: "The Antiderivative Family F(x) + C" },
      body: [
        {
          tr: R`\(F(x) + C\) sabitini değiştirmek grafiği yalnızca yukarı/aşağı kaydırır; dolayısıyla aynı \(x_0\) dikey çizgisindeki <b>tüm eğrilerin teğetleri birbirine paraleldir</b> ve ortak eğimleri \(f(x_0)\)'tır!`,
          en: R`Varying \(C\) in \(F(x) + C\) only shifts the graph vertically, so at any given \(x_0\), <b>all curves share parallel tangents</b> with common slope \(f(x_0)\)!`,
        },
        { eq: R`\frac{d}{dx}\big(F(x) + C\big) = F'(x) = f(x)` },
        {
          tr: R`<b>Deneyin:</b> \(C\) ve \(x_0\) kaydırıcılarını oynatın; tüm paralel eğrilerin \(x_0\)'daki teğetlerinin birebir aynı \(f(x_0)\) eğimini paylaştığını görün.`,
          en: R`<b>Try it:</b> slide \(C\) and \(x_0\) to verify that every shifted curve has the exact same tangent slope \(f(x_0)\) along the vertical line \(x = x_0\).`,
        },
      ],
      demo(box, state) {
        const s = (state.fam ??= { fn: "quad", C: 0.5, x0: 1 });
        const fams = {
          quad: { label: "f(x)=x²", f: (x) => x * x, F: (x) => (x * x * x) / 3, Ftex: "\\tfrac{1}{3}x^3" },
          cos: { label: "f(x)=cos(x)", f: (x) => Math.cos(x), F: (x) => Math.sin(x), Ftex: "\\sin x" },
          exp: { label: "f(x)=eˣ/2", f: (x) => 0.5 * Math.exp(x), F: (x) => 0.5 * Math.exp(x), Ftex: "\\tfrac{1}{2}e^x" },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const cur = fams[s.fn];
          const slope = cur.f(s.x0);
          const y0 = cur.F(s.x0) + s.C;
          const ghosts = [-2, -1, 0, 1, 2].map((c) => ({ f: (x) => cur.F(x) + c, color: COLORS.grid, width: 1.5 }));
          plot.draw({
            x: [-3, 3], y: [-3.5, 4], xLabel: "x", yLabel: "F(x)+C",
            curves: [
              ...ghosts,
              { f: (x) => cur.F(x) + s.C, color: COLORS.c1, width: 2.8 },
            ],
            lines: [
              { a: 1, b: 0, c: -s.x0, color: COLORS.muted, dash: [4, 4] },
              { a: slope, b: -1, c: y0 - slope * s.x0, color: COLORS.c2, width: 2.2 },
            ],
            points: [{ x: s.x0, y: y0, color: COLORS.c2, r: 5.5, ring: true }],
          });
          calc.textContent = `\\(F(x)+C = ${cur.Ftex} ${s.C >= 0 ? "+" : "-"} ${tx(Math.abs(s.C), 1)},\\qquad F'(${tx(s.x0, 1)}) = f(${tx(s.x0, 1)}) = ${tx(slope, 3)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(fams).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("C", { min: -2, max: 2, step: 0.25, value: s.C, onInput: (v) => { s.C = v; draw(); } }),
          slider("x₀", { min: -2, max: 2, step: 0.2, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "ii-methods",
      mathId: "m-ii-parts",
      title: { tr: "Değişken Değiştirme, Kısmi İntegrasyon ve Basit Kesirler", en: "Substitution, By Parts & Partial Fractions" },
      body: [
        {
          tr: R`Türev kurallarını tersine çevirdiğimizde iki ana teknik doğar: Zincir Kuralı tersi → <b>Değişken Değiştirme</b> (\(u=g(x)\)), Çarpım Kuralı tersi → <b>Kısmi İntegrasyon</b> (\(\int u\,dv = uv - \int v\,du\)). Rasyonel fonksiyonlarda ise payda çarpanlara ayrılıp <b>basit kesirlere</b> bölünür.`,
          en: R`Reversing differentiation rules yields the two master techniques: Chain Rule backwards → <b>u-Substitution</b>, Product Rule backwards → <b>Integration by Parts</b>. For rational functions, split into <b>Partial Fractions</b>.`,
        },
        { eq: R`\int f(g(x))g'(x)\,dx = \int f(u)\,du, \qquad \int u\,dv = uv - \int v\,du` },
        {
          tr: R`<b>Deneyin:</b> Sağdaki interaktif koçta üç teknikten birini seçip adım adım dönüşümü ve türevle sağlamasını \(F'(x) = f(x)\) inceleyin!`,
          en: R`<b>Try it:</b> pick a technique in the interactive coach to step through the symbolic transformation and check \(F'(x) = f(x)\)!`,
        },
      ],
      demo(box, state) {
        const s = (state.meth ??= { m: "sub" });
        const examples = {
          sub: {
            label: { tr: "u-Dönüşümü", en: "u-Substitution" },
            steps: [
              R`\int 2x\cos(x^2)\,dx`,
              R`u = x^2 \implies du = 2x\,dx`,
              R`\int \cos(u)\,du = \sin(u) + C = \sin(x^2) + C`,
            ],
            f: (x) => 2 * x * Math.cos(x * x),
            F: (x) => Math.sin(x * x),
          },
          parts: {
            label: { tr: "Kısmi İntegrasyon", en: "By Parts" },
            steps: [
              R`\int x e^x\,dx`,
              R`u = x,\; dv = e^x dx \implies du = dx,\; v = e^x`,
              R`x e^x - \int e^x\,dx = (x - 1)e^x + C`,
            ],
            f: (x) => x * Math.exp(x),
            F: (x) => (x - 1) * Math.exp(x),
          },
          pf: {
            label: { tr: "Basit Kesirler", en: "Partial Fractions" },
            steps: [
              R`\int \frac{2}{x^2 - 1}\,dx = \int \left(\frac{1}{x-1} - \frac{1}{x+1}\right)dx`,
              R`= \ln|x-1| - \ln|x+1| + C = \ln\!\left|\frac{x-1}{x+1}\right| + C`,
            ],
            f: (x) => 2 / (x * x - 1),
            F: (x) => Math.log(Math.abs((x - 1) / (x + 1))),
          },
        };
        const ctl = h("div", { class: "t-controls" });
        const out = h("div", { class: "m-widget-out" });
        const msg = h("p", { class: "pc-msg good" });
        box.append(ctl, out, msg);

        const draw = () => {
          const ex = examples[s.m];
          out.replaceChildren(...ex.steps.map((tex) => h("div", { class: "m-eq", text: `\\(\\displaystyle ${tex}\\)` })));
          const xTest = 2;
          const numDeriv = numDiff(ex.F, xTest);
          const exact = ex.f(xTest);
          msg.textContent = L({
            tr: `Sağlama (x = 2): F'(2) = ${ns(numDeriv, 4)} ve f(2) = ${ns(exact, 4)} — birebir tutuyor!`,
            en: `Verification at x = 2: F'(2) = ${ns(numDeriv, 4)} vs f(2) = ${ns(exact, 4)} — exact match!`,
          });
        };
        ctl.append(segmented(Object.entries(examples).map(([k, v]) => [k, v.label]), s.m, (v) => { s.m = v; draw(); }));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Türev–İlkel Doğrulama Laboratuvarı", en: "Antiderivative Verification Studio" },
    sub: {
      tr: R`Klasik belirsiz integrallerden birini seçip hem integrandı \(f(x)\) hem de ilkel fonksiyon \(F(x)+C\)'yi aynı düzlemde görün; \(F'(x_0)\) ile \(f(x_0)\)'ın eşitliğini sınayın.`,
      en: R`Compare \(f(x)\) and \(F(x)+C\) on the same plot and verify numerically that \(F'(x_0) = f(x_0)\) at any \(x_0\).`,
    },
    build(host, state) {
      const s = (state.pg ??= { ex: "atan", C: 0, x0: 1 });
      const items = {
        atan: { label: "1/(1+x²)", f: (x) => 1 / (1 + x * x), F: (x) => Math.atan(x), name: "\\arctan x" },
        xlnx: { label: "ln(x)", f: (x) => (x > 0 ? Math.log(x) : NaN), F: (x) => (x > 0 ? x * Math.log(x) - x : NaN), name: "x\\ln x - x" },
        sin2: { label: "sin(2x)", f: (x) => Math.sin(2 * x), F: (x) => -0.5 * Math.cos(2 * x), name: "-\\tfrac{1}{2}\\cos(2x)" },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 370 });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, ctl2, calc);

      const draw = () => {
        const cur = items[s.ex];
        const x0 = s.ex === "xlnx" ? Math.max(0.25, s.x0) : s.x0;
        plot.draw({
          x: s.ex === "xlnx" ? [-0.2, 4.5] : [-3.5, 3.5],
          y: [-2.5, 3], xLabel: "x", yLabel: "y",
          curves: [
            { f: cur.f, color: COLORS.c2, width: 2.2, dash: [5, 4] },
            { f: (x) => cur.F(x) + s.C, color: COLORS.c1, width: 2.8 },
          ],
          points: [
            { x: x0, y: cur.f(x0), color: COLORS.c2, r: 5 },
            { x: x0, y: cur.F(x0) + s.C, color: COLORS.c1, r: 5 },
          ],
        });
        calc.textContent = `\\(F(x)+C = ${cur.name} ${s.C >= 0 ? "+" : "-"} ${tx(Math.abs(s.C), 1)},\\quad F'(${tx(x0, 2)}) = ${tx(numDiff(cur.F, x0), 4)} = f(${tx(x0, 2)})\\)`;
      };
      ctl.append(segmented(Object.entries(items).map(([k, v]) => [k, v.label]), s.ex, (v) => { s.ex = v; draw(); }));
      ctl2.append(
        slider("C", { min: -1.5, max: 1.5, step: 0.25, value: s.C, onInput: (v) => { s.C = v; draw(); } }),
        slider("x₀", { min: -2.5, max: 3, step: 0.25, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-ii-table",
      title: { tr: "Temel Belirsiz İntegraller Tablosu", en: "Table of Elementary Indefinite Integrals" },
      blocks: [
        {
          table: {
            head: [{ tr: "İntegral", en: "Integral" }, { tr: "Sonuç", en: "Result" }],
            rows: [
              [R`\(\int x^n\,dx\ (n\ne -1)\)`, R`\(\frac{x^{n+1}}{n+1} + C\)`],
              [R`\(\int \frac{1}{x}\,dx\)`, R`\(\ln|x| + C\)`],
              [R`\(\int e^{ax}\,dx\)`, R`\(\frac{1}{a}e^{ax} + C\)`],
              [R`\(\int \frac{1}{1+x^2}\,dx\)`, R`\(\arctan x + C\)`],
              [R`\(\int \frac{1}{\sqrt{1-x^2}}\,dx\)`, R`\(\arcsin x + C\)`],
              [R`\(\int \ln x\,dx\)`, R`\(x\ln x - x + C\)`],
            ],
          },
        },
      ],
    },
    {
      id: "m-ii-parts",
      title: { tr: "Kısmi İntegrasyonun Çarpım Kuralından Türetilmesi", en: "Deriving Integration by Parts from the Product Rule" },
      blocks: [
        {
          derive: {
            title: { tr: "Çarpım kuralı → Kısmi integrasyon", en: "Product rule → Integration by parts" },
            steps: [
              { tex: R`\frac{d}{dx}\big[u(x)v(x)\big] = u'(x)v(x) + u(x)v'(x)`, why: { tr: "Çarpım kuralıyla başlarız.", en: "Start from the product rule." } },
              { tex: R`u(x)v(x) = \int v(x)u'(x)\,dx + \int u(x)v'(x)\,dx`, why: { tr: "Her iki tarafın belirsiz integrali alınır.", en: "Integrate both sides with respect to x." } },
              { tex: R`\int u\,dv = uv - \int v\,du`, why: { tr: "LIATE sırası (Log, Inverse trig, Algebraic, Trig, Exponential) u seçimine rehberlik eder.", en: "Use LIATE (Log, Inverse trig, Algebraic, Trig, Exponential) to choose u." } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
