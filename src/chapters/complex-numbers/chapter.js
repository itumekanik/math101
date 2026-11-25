import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { cArg, cConj, cFromPolar, cMod, cMul, cNthRoots, cPow } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "cx-intro",
    title: { tr: "Karmaşık Sayılar, Euler Formülü ve Birimin Kökleri", en: "Complex Numbers, Euler's Formula & n-th Roots" },
    paragraphs: [
      {
        tr: R`\(x^2 + 1 = 0\) denklemini çözmek için tanımlanan \(i = \sqrt{-1}\) bizi sayı doğrusundan iki boyutlu <b>Argand (karmaşık) düzlemine</b> taşır! [[complex-number|Karmaşık sayılarda]] çarpma bir dönme + ölçekleme işlemidir ve [[euler-formula|Euler formülü]] \(e^{i\theta} = \cos\theta + i\sin\theta\) tüm trigonometriyi tek bir üstel yasaya indirger!`,
        en: R`Introducing \(i = \sqrt{-1}\) to solve \(x^2 + 1 = 0\) lifts us from the real line to the 2D <b>Argand plane</b>! Multiplication becomes rotation + scaling, and [[euler-formula|Euler's formula]] \(e^{i\theta} = \cos\theta + i\sin\theta\) unifies exponentials and trigonometry!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> karmaşık çarpmayı modül çarpımı + açı toplamı olarak görecek, De Moivre formülüyle yüksek kuvvetleri hesaplayacak ve \(z^n = w\) denkleminin \(n\) adet kökünü düzgün \(n\)-gen olarak çizebileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will visualize complex multiplication as rotate-and-scale, compute powers via De Moivre's law, and plot all \(n\) roots of \(z^n = w\) as a regular \(n\)-gon.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 21 · Karmaşık Sayılar", en: "Lecture 21 · Complex Numbers" }],
      [{ tr: "Kutupsal & Euler", en: "Polar & Euler" }, { tr: R`\(z = a+bi = r(\cos\theta + i\sin\theta) = re^{i\theta}\)`, en: R`\(z = a+bi = r(\cos\theta + i\sin\theta) = re^{i\theta}\)` }],
      [{ tr: "De Moivre & Kökler", en: "De Moivre & Roots" }, { tr: R`\(z^n = r^n e^{in\theta},\quad z_k = r^{1/n}e^{i(\theta+2\pi k)/n}\)`, en: R`\(z^n = r^n e^{in\theta},\quad z_k = r^{1/n}e^{i(\theta+2\pi k)/n}\)` }],
    ],
  },
  sections: [
    {
      id: "cx-mul",
      mathId: "m-cx-euler",
      title: { tr: "Karmaşık Çarpma = Döndür + Ölçekle", en: "Complex Multiplication = Rotate + Scale" },
      body: [
        {
          tr: R`İki karmaşık sayı \(z_1 = r_1 e^{i\theta_1}\) ve \(z_2 = r_2 e^{i\theta_2}\) çarpıldığında <b>modüller çarpılır, argümanlar (açılar) toplanır</b>! Özellikle \(i = e^{i\pi/2}\) ile çarpmak düzlemi tam \(90^\circ\) saat yönünün tersine döndürür.`,
          en: R`Multiplying \(z_1 = r_1 e^{i\theta_1}\) and \(z_2 = r_2 e^{i\theta_2}\) <b>multiplies their moduli and adds their angles</b>! Multiplying by \(i = e^{i\pi/2}\) is literally a \(90^\circ\) counterclockwise rotation.`,
        },
        { eq: R`z_1 z_2 = (r_1 r_2)\,e^{i(\theta_1 + \theta_2)}, \qquad |z_1 z_2| = |z_1|\,|z_2|, \qquad \arg(z_1 z_2) = \arg z_1 + \arg z_2` },
        {
          tr: R`<b>Deneyin:</b> Argand düzleminde \(z_1\) (mavi) ve \(z_2\) (yeşil) noktalarını sürükleyin! Çarpım \(z_1 z_2\) (turuncu) açısının iki açının toplamı, uzunluğunun iki uzunluğun çarpımı olduğunu görün.`,
          en: R`<b>Try it:</b> drag \(z_1\) (blue) and \(z_2\) (green) on the Argand plane and watch \(z_1 z_2\) (orange) rotate by \(\theta_1 + \theta_2\) and scale to \(r_1 r_2\)!`,
        },
      ],
      demo(box, state) {
        const s = (state.mul ??= { z1: { re: 1.5, im: 0.8 }, z2: { re: 0.6, im: 1.2 } });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(host, calc);
        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "z₁ ve z₂ uçlarını sürükleyin", en: "Drag z₁ and z₂" }),
        });

        const draw = () => {
          const prod = cMul(s.z1, s.z2);
          const r1 = cMod(s.z1), r2 = cMod(s.z2), rp = cMod(prod);
          const a1 = (cArg(s.z1) * 180) / Math.PI;
          const a2 = (cArg(s.z2) * 180) / Math.PI;
          const ap = (cArg(prod) * 180) / Math.PI;
          plot.draw({
            x: [-4.5, 4.5], y: [-4, 4.5], equalAspect: true, xLabel: "Re", yLabel: "Im",
            circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [4, 4] }],
            vectors: [
              { to: [s.z1.re, s.z1.im], color: COLORS.c1, label: "z₁" },
              { to: [s.z2.re, s.z2.im], color: COLORS.c3, label: "z₂" },
              { to: [prod.re, prod.im], color: COLORS.c2, width: 3, label: "z₁z₂" },
            ],
            handles: [
              { id: "z1", x: s.z1.re, y: s.z1.im, color: COLORS.c1, onDrag: (x, y) => { s.z1 = { re: x, im: y }; draw(); } },
              { id: "z2", x: s.z2.re, y: s.z2.im, color: COLORS.c3, onDrag: (x, y) => { s.z2 = { re: x, im: y }; draw(); } },
            ],
          });
          calc.textContent = `\\(|z_1|=${tx(r1, 2)}\\ (\\angle ${tx(a1, 0)}^\\circ),\\; |z_2|=${tx(r2, 2)}\\ (\\angle ${tx(a2, 0)}^\\circ) \\implies |z_1 z_2|=${tx(rp, 2)}\\ (\\angle ${tx(ap, 0)}^\\circ)\\)`;
        };
        draw();
      },
    },
    {
      id: "cx-roots",
      mathId: "m-cx-roots",
      title: { tr: "n. Dereceden Kökler: Düzgün n-Genin Köşeleri", en: "n-th Roots: Vertices of a Regular n-Gon" },
      body: [
        {
          tr: R`Reel sayılarda \(x^4 = 1\)'in yalnızca iki kökü (\(\pm 1\)) vardır; ama karmaşık düzlemde sıfırdan farklı her \(w = R e^{i\varphi}\) sayısının <b>tam olarak \(n\) adet</b> farklı \(n\). dereceden kökü vardır ve bunlar yarıçapı \(R^{1/n}\) olan çember üzerinde <b>düzgün bir \(n\)-gen</b> oluştururlar!`,
          en: R`Over \(\mathbb{C}\), every nonzero \(w = Re^{i\varphi}\) has <b>exactly \(n\) distinct \(n\)-th roots</b>, evenly spaced at angles \(2\pi/n\) apart as the vertices of a <b>regular \(n\)-gon</b> on the circle of radius \(R^{1/n}\)!`,
        },
        { eq: R`z_k = R^{1/n}\,e^{\,i\frac{\varphi + 2\pi k}{n}}, \qquad k = 0, 1, \dots, n - 1` },
        {
          tr: R`<b>Deneyin:</b> Kök derecesi \(n\)'yi \(2\)'den \(10\)'a değiştirin ve \(w\) açısını \(\varphi\) kaydırıcısıyla çevirerek düzgün çokgenin nasıl döndüğünü görün!`,
          en: R`<b>Try it:</b> vary \(n\) from 2 to 10 and rotate the angle \(\varphi\) of \(w\) to watch the entire regular \(n\)-gon rotate smoothly!`,
        },
      ],
      demo(box, state) {
        const s = (state.roots ??= { n: 5, deg: 0, R: 1.8 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 280 });

        const draw = () => {
          const rad = (s.deg * Math.PI) / 180;
          const w = cFromPolar(s.R, rad);
          const roots = cNthRoots(w, s.n);
          const rRoot = s.R ** (1 / s.n);
          plot.draw({
            x: [-2.6, 2.6], y: [-2.6, 2.6], equalAspect: true, xLabel: "Re", yLabel: "Im",
            circles: [{ cx: 0, cy: 0, r: rRoot, stroke: COLORS.c1, dash: [5, 4] }],
            polygons: [{ pts: roots.map((z) => [z.re, z.im]), fill: "rgba(42,120,214,0.14)", stroke: COLORS.c1, width: 2.2 }],
            vectors: [{ to: [w.re, w.im], color: COLORS.c2, dash: [4, 3], label: "w" }],
            points: roots.map((z, k) => ({ x: z.re, y: z.im, color: COLORS.c3, r: 5.5, label: `z${k}` })),
          });
          calc.textContent = `\\(z^{${s.n}} = ${tx(s.R, 1)}\\,e^{i\\cdot ${s.deg}^\\circ} \\implies |z_k| = ${tx(rRoot, 3)},\\quad \\Delta\\theta = \\frac{360^\\circ}{${s.n}} = ${tx(360 / s.n, 1)}^\\circ\\)`;
        };
        ctl.append(
          slider("n", { min: 2, max: 10, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
          slider("φ (°)", { min: 0, max: 360, step: 15, value: s.deg, fmt: (v) => `${v}°`, onInput: (v) => { s.deg = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Argand Düzlemi: Eşlenik, De Moivre Kuvvetleri ve Euler", en: "Argand Plane: Conjugates, De Moivre Powers & Euler" },
    sub: {
      tr: R`\(z\) noktasını sürükleyin; eşleniği \(\bar z\) ile \(z, z^2, z^3, \dots, z^n\) kuvvetlerinin spiral yörüngesini (içeri kapanma \(|z|<1\), birim çemberde dönme \(|z|=1\), dışa açılma \(|z|>1\)) izleyin!`,
      en: R`Drag \(z\) to watch the conjugate \(\bar z\) and the spiral orbit \(z, z^2, \dots, z^n\) shrink (\(|z|<1\)), circle (\(|z|=1\)), or expand (\(|z|>1\))!`,
    },
    build(host, state) {
      const s = (state.pg ??= { z: { re: 0.9, im: 0.55 }, pow: 6 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, {
        height: 390,
        interactive: true,
        hint: L({ tr: "z ucunu birim çemberin içine/dışına sürükleyin", en: "Drag z inside or outside the unit circle" }),
      });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctl, tiles, calc);

      const draw = () => {
        const conj = cConj(s.z);
        const r = cMod(s.z);
        const deg = (cArg(s.z) * 180) / Math.PI;
        const pows = Array.from({ length: s.pow }, (_, k) => cPow(s.z, k + 1));
        const segs = [];
        for (let i = 0; i < pows.length - 1; i++) {
          segs.push({ from: [pows[i].re, pows[i].im], to: [pows[i + 1].re, pows[i + 1].im], color: COLORS.c2, dash: [3, 3], width: 1.6 });
        }
        plot.draw({
          x: [-3.5, 3.5], y: [-3.5, 3.5], equalAspect: true, xLabel: "Re", yLabel: "Im",
          circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [5, 4] }],
          segments: segs,
          vectors: [
            { to: [conj.re, conj.im], color: COLORS.c3, dash: [4, 3], label: "z̄" },
            { to: [s.z.re, s.z.im], color: COLORS.c1, width: 2.8, label: "z" },
          ],
          points: pows.map((p, k) => ({ x: p.re, y: p.im, color: k === 0 ? COLORS.c1 : COLORS.c2, r: 4.5, label: k > 0 ? `z^${k + 1}` : undefined })),
          handles: [{ id: "z", x: s.z.re, y: s.z.im, color: COLORS.c1, onDrag: (x, y) => { s.z = { re: x, im: y }; draw(); } }],
        });
        const zn = pows[pows.length - 1];
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "|z|" }), h("span", { class: "pg-tile-value", text: ns(r, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "arg(z)" }), h("span", { class: "pg-tile-value", text: `${ns(deg, 1)}°` })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `|z^${s.pow}|` }), h("span", { class: "pg-tile-value", text: ns(cMod(zn), 3) })),
        );
        calc.textContent = `\\(z = ${tx(s.z.re, 2)} ${s.z.im >= 0 ? "+" : "-"} ${tx(Math.abs(s.z.im), 2)}i = ${tx(r, 2)}\\,e^{i\\cdot ${tx(deg, 1)}^\\circ}\\)`;
      };
      ctl.append(slider("n (zⁿ)", { min: 2, max: 10, step: 1, value: s.pow, fmt: (v) => String(v), onInput: (v) => { s.pow = v; draw(); } }));
      draw();
    },
  },
  mathSections: [
    {
      id: "m-cx-euler",
      title: { tr: "Euler Formülünün Maclaurin Serisinden Türetilmesi", en: "Deriving Euler's Formula from Maclaurin Series" },
      blocks: [
        {
          derive: {
            title: { tr: "e^(iθ) = cos θ + i sin θ (Ders 17 ve Ders 21'in muhteşem birleşimi!)", en: "e^(iθ) = cos θ + i sin θ (Connecting Lecture 17 & Lecture 21!)" },
            steps: [
              { tex: R`e^z = \sum_{n=0}^\infty \frac{z^n}{n!} = 1 + z + \frac{z^2}{2!} + \frac{z^3}{3!} + \frac{z^4}{4!} + \cdots`, why: { tr: "Üstel fonksiyonun tüm kompleks düzlemde yakınsak Maclaurin serisine z = iθ yazalım.", en: "Substitute z = iθ into the Maclaurin series of e^z." } },
              { tex: R`e^{i\theta} = 1 + i\theta - \frac{\theta^2}{2!} - i\frac{\theta^3}{3!} + \frac{\theta^4}{4!} + i\frac{\theta^5}{5!} - \cdots`, why: { tr: "i² = −1, i³ = −i, i⁴ = 1 kuvvet döngüsü uygulanır.", en: "Use i² = −1, i³ = −i, i⁴ = 1." } },
              { tex: R`e^{i\theta} = \underbrace{\left(1 - \frac{\theta^2}{2!} + \frac{\theta^4}{4!} - \cdots\right)}_{\cos\theta} + i\underbrace{\left(\theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \cdots\right)}_{\sin\theta}`, why: { tr: "Reel (çift) ve sanal (tek) terimler ayrıldığında cos θ ve sin θ serileri ortaya çıkar!", en: "Separating real and imaginary terms recovers cos θ and sin θ exactly!" } },
              { tex: R`e^{i\pi} + 1 = 0`, why: { tr: "θ = π konulunca matematiğin beş temel sabitini (e, i, π, 1, 0) birleştiren Euler Özdeşliği doğar.", en: "Setting θ = π yields Euler's Identity linking e, i, π, 1, and 0." } },
            ],
          },
        },
      ],
    },
    {
      id: "m-cx-roots",
      title: { tr: "De Moivre ve Eşlenik Kök Teoremi", en: "De Moivre & Complex Conjugate Root Theorem" },
      blocks: [
        { eq: R`(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta), \qquad z\bar z = |z|^2` },
        {
          callout: "tip",
          title: { tr: "Reel katsayılı polinomlar", en: "Real polynomials" },
          text: {
            tr: R`Reel katsayılı bir polinomun \(z_0\) karmaşık kökü varsa, eşleniği \(\bar z_0\) da mutlaka köktür! Bu yüzden tek dereceli her reel polinomun en az bir reel kökü vardır.`,
            en: R`Complex roots of real polynomials always arrive in conjugate pairs \((z_0, \bar z_0)\), so every odd-degree real polynomial has at least one real root.`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
