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
        tr: R`Önceki bölümde gördüğümüz belirsiz integral \(\int f(x)\,dx\) bize bir <b>fonksiyon ailesi</b> (\(F(x) + C\)) veriyordu. Sınır eklediğimizde ortaya çıkan [[riemann-sum|belirli integral]] \(\int_a^b f(x)\,dx\) (<em>"a'dan b'ye f(x) dx integrali"</em>) ise tek bir <b>gerçek sayıdır</b>: \(a\) ile \(b\) arasında eğrinin altında kalan <b>işaretli net alanı</b> ölçer!`,
        en: R`Whereas an indefinite integral \(\int f(x)\,dx\) returns a <b>family of functions</b> (\(F(x) + C\)), adding limits produces a [[riemann-sum|definite integral]] \(\int_a^b f(x)\,dx\) (read aloud as <em>"the integral from a to b of f(x) dx"</em>), which is a single <b>number</b> measuring the <b>net signed area</b> between \(a\) and \(b\)!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> aralığı \(n\) ince dilime bölerek Riemann ve Yamuk toplamlarının kesin alana nasıl yakınsadığını görecek; [[ftc|Kalkülüsün Temel Teoremi (FTC)]] sayesinde bu sonsuz toplamı tek bir \(F(b) - F(a)\) çıkarmasına indirecek; tek/çift simetri kısayollarını ve [[improper-integral|genelleştirilmiş integralleri]] ustaca kullanabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will watch Riemann and Trapezoidal sums converge to exact signed area, see how the [[ftc|Fundamental Theorem of Calculus (FTC)]] collapses infinite sums into \(F(b) - F(a)\), apply even/odd symmetry and definite \(u\)-substitution, and judge convergence of [[improper-integral|improper integrals]].`,
      },
    ],
    analogy: {
      title: { tr: "Hız göstergesi grafiğinden gidilen toplam yolu hesaplamak", en: "Finding total distance from a car's speedometer graph" },
      text: {
        tr: R`Bir araba 2 saat boyunca sabit \(60\text{ km/sa}\) hızla giderse aldığı yol basit bir dikdörtgenin alanıdır: \(60 \times 2 = 120\text{ km}\). Peki hızınız trafikte her saniye değişiyorsa? Zamanı çok ince \(\Delta t\) dilimlerine böler, her minik dilimde hızı neredeyse sabit sayıp ince dikdörtgenlerin alanlarını toplarsınız! Üstelik geri vitese takarsanız (negatif hız), o dilim net yer değiştirmeden <b>çıkarılır</b> — işte "işaretli alan" tam olarak budur!`,
        en: R`If a car drives at a steady \(60\text{ km/h}\) for 2 hours, the distance is simply a rectangle's area: \(60 \times 2 = 120\text{ km}\). When your speed varies continuously in traffic, slice time into tiny steps \(\Delta t\), treat speed as nearly constant on each step, and sum those thin rectangles! Even better: driving in reverse (negative speed) <b>subtracts</b> from net displacement — that is literally why definite integrals measure signed area!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 19 · Belirli İntegraller", en: "Lecture 19 · Definite Integrals" }],
      [{ tr: "FTC (1. & 2. Kısım)", en: "FTC (Parts 1 & 2)" }, { tr: R`\(\frac{d}{dx}\int_a^x f(t)\,dt = f(x),\quad \int_a^b f = F(b)-F(a)\)`, en: R`\(\frac{d}{dx}\int_a^x f(t)\,dt = f(x),\quad \int_a^b f = F(b)-F(a)\)` }],
      [{ tr: "Genelleştirilmiş sınır", en: "Improper p-borderline" }, { tr: R`\(\int_1^\infty x^{-p}\,dx < \infty \iff p > 1\)`, en: R`\(\int_1^\infty x^{-p}\,dx < \infty \iff p > 1\)` }],
    ],
    tip: {
      title: { tr: "Belirsiz vs Belirli — tek bakışta fark", en: "Indefinite vs Definite — at a glance" },
      text: {
        tr: R`\(\int f(x)\,dx = F(x) + C\) bir <b>fonksiyon ailesidir</b>; \(\int_a^b f(x)\,dx = F(b) - F(a)\) ise bir <b>sayıdır</b> (burada \(+ C\) yazılmaz çünkü \((F(b)+C) - (F(a)+C)\) çıkarma işleminde birbirini götürür!).`,
        en: R`\(\int f(x)\,dx = F(x) + C\) is a <b>family of functions</b>, whereas \(\int_a^b f(x)\,dx = F(b) - F(a)\) is a <b>number</b> (no \(+ C\) needed since \((F(b)+C)-(F(a)+C)\) cancels \(C\) out!).`,
      },
    },
  },
  sections: [
    {
      id: "di-riemann",
      mathId: "m-di-riemann",
      title: { tr: "İşaretli Alan ve Riemann Toplamları: n Dikdörtgene Dilimlemek", en: "Signed Area & Riemann Sums: Slicing Into n Rectangles" },
      body: [
        {
          tr: R`Eğri altındaki alanı doğrudan formülle bilmediğimizde \([a, b]\) aralığını genişliği \(\Delta x = \frac{b - a}{n}\) olan \(n\) eşit şeride böleriz. Her şeridin yüksekliğini sol uçtan (<b>Sol</b>), sağ uçtan (<b>Sağ</b>), ortasından (<b>Orta Nokta</b>) veya iki ucun ortalamasından (<b>Yamuk</b>) seçip alanları toplarız. \(x\)-ekseninin üstündeki dilimler <b>pozitif (mavi)</b>, altındakiler <b>negatif (turuncu)</b> sayılır!`,
          en: R`When we have no elementary geometry formula for a curved region, we chop \([a, b]\) into \(n\) strips of width \(\Delta x = \frac{b - a}{n}\). On each strip we pick a height from the <b>Left</b>, <b>Right</b>, <b>Midpoint</b>, or connect both tops (<b>Trapezoid</b>), then sum all strips. Strips above the \(x\)-axis count <b>positively (blue)</b>; strips below count <b>negatively (orange)</b>!`,
        },
        {
          analogy: {
            title: { tr: "Aylık banka hesap özeti gibi düşünün", en: "Think of a monthly bank statement" },
            text: {
              tr: R`Sıfır çizgisinin üstündeki mavi sütunlar hesabınıza giren gelirler (\(+\)), altındaki turuncu sütunlar ise harcamalarınızdır (\(-\)). Belirli integral ay sonundaki <b>net bakiye değişimini</b> verir — eğer gelir ve gider eşitse net toplam \(0\) çıkar!`,
              en: R`Blue bars above the zero line are deposits (\(+\)) and orange bars below are withdrawals (\(-\)). The definite integral reports your <b>net balance change</b> — if deposits and withdrawals match, the net integral is \(0\)!`,
            },
          },
        },
        { eq: R`\int_a^b f(x)\,dx = \lim_{n\to\infty}\sum_{i=1}^{n} f(x_i^*)\,\Delta x, \qquad \Delta x = \frac{b - a}{n}` },
        {
          example: {
            title: { tr: "4 dikdörtgenle elle Sol ve Orta Nokta Riemann toplamı", en: "Hand-computing 4-strip Left & Midpoint Riemann sums" },
            problem: {
              tr: R`\(f(x) = x^2\) fonksiyonunun \([0, 2]\) aralığındaki integralini \(n = 4\) dilimle tahmin edip kesin değer \(\frac{8}{3} \approx 2{,}667\) ile karşılaştırın.`,
              en: R`Approximate \(\int_0^2 x^2\,dx\) using \(n = 4\) strips and compare with the exact value \(\frac{8}{3} \approx 2.667\).`,
            },
            steps: [
              {
                expr: R`\Delta x = \frac{2 - 0}{4} = 0{,}5 \quad \text{(bölme noktaları / grid: } 0,\; 0{,}5,\; 1,\; 1{,}5,\; 2\text{)}`,
                note: { tr: "Aralığı 0,5 genişliğinde 4 eşit şeride böldük.", en: "Split [0, 2] into 4 strips of width Δx = 0.5." },
              },
              {
                expr: R`L_4 = 0{,}5\cdot\big(0^2 + 0{,}5^2 + 1^2 + 1{,}5^2\big) = 0{,}5\cdot(0 + 0{,}25 + 1 + 2{,}25) = 1{,}75`,
                note: { tr: "Sol uçlar artan eğrinin hep altında kaldığı için L₄ gerçek alandan oldukça küçük kaldı.", en: "Left endpoints stay below an increasing curve, so L₄ underestimates noticeably." },
              },
              {
                expr: R`M_4 = 0{,}5\cdot\big(0{,}25^2 + 0{,}75^2 + 1{,}25^2 + 1{,}75^2\big) = 0{,}5\cdot 5{,}25 = 2{,}625`,
                note: { tr: "Orta nokta kuralında her şeridin taşan ve eksik kalan köşeleri neredeyse birbirini dengeler — hata yalnızca 0,042!", en: "In the Midpoint rule, the tiny overhang and underhang on each strip almost cancel — error is just 0.042!" },
              },
            ],
            answer: { tr: R`\(L_4 = 1{,}75\), \(M_4 = 2{,}625\) (Kesin değer: \(2{,}667\))`, en: R`\(L_4 = 1.75\), \(M_4 = 2.625\) (Exact: \(2.667\))` },
          },
        },
        {
          pitfall: {
            title: { tr: "İşaretli integral ile toplam geometrik alanı karıştırmak!", en: "Confusing signed integral with total geometric area!" },
            text: {
              tr: R`\(\int_0^{2\pi} \sin x\,dx = 0\) çıkması eğrinin altında alan olmadığı anlamına gelmez! \([0, \pi]\)'deki \(+2\) alanı ile \([\pi, 2\pi]\)'deki \(-2\) alanı birbirini götürür. Gerçek boyanacak toplam alan soruluyorsa mutlak değer gerekir: \(\int_0^{2\pi}|\sin x|\,dx = 2 + 2 = 4\).`,
              en: R`Getting \(\int_0^{2\pi} \sin x\,dx = 0\) does NOT mean the curve encloses zero area! The \(+2\) hump on \([0, \pi]\) cancels the \(-2\) dip on \([\pi, 2\pi]\). For total unsigned paintable area, integrate \(|\sin x|\) to get \(2 + 2 = 4\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>sin(x) [0, 4]</b> eğrisinde \(x = \pi \approx 3{,}14\)'ten sonra dikdörtgenlerin nasıl <b>turuncuya</b> (negatif katkı) döndüğünü izleyin.`, en: R`On <b>sin(x) [0, 4]</b>, notice how rectangles turn <b>orange</b> (negative contribution) past \(x = \pi \approx 3.14\).` },
            { tr: R`<b>0.25x²</b> seçip \(n = 6\) tutun; <b>Sol → Orta → Sağ → Yamuk</b> tuşları arasında gezerek hatanın Orta Nokta ve Yamuk'ta nasıl dramatik küçüldüğünü karşılaştırın!`, en: R`Pick <b>0.25x²</b> at \(n = 6\); toggle <b>Left → Mid → Right → Trap</b> and compare how drastically Midpoint and Trapezoid slash the error!` },
            { tr: R`<b>x − 2 [0, 4]</b> seçin: sol yarıdaki turuncu üçgen ile sağ yarıdaki mavi üçgenin birbirini tam \(0\)'a sıfırladığını görün!`, en: R`Pick <b>x − 2 [0, 4]</b> and watch the orange negative triangle cancel the blue positive triangle to exact \(0\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.riem ??= { mode: "mid", n: 8, fn: "sin" });
        const fns = {
          sin: { label: "sin(x)", f: (x) => Math.sin(x), a: 0, b: 4, exact: 1 - Math.cos(4), yr: [-1.2, 1.3] },
          sq: { label: "0.25x²", f: (x) => 0.25 * x * x, a: 0, b: 4, exact: 16 / 3, yr: [-0.3, 4.4] },
          lin: { label: "x − 2", f: (x) => x - 2, a: 0, b: 4, exact: 0, yr: [-2.4, 2.4] },
        };
        const ctl = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        const draw = () => {
          const cur = fns[s.fn];
          const dx = (cur.b - cur.a) / s.n;
          const rects = [];
          const polygons = [];
          for (let i = 0; i < s.n; i++) {
            const x0 = cur.a + i * dx, x1 = x0 + dx;
            if (s.mode === "trap") {
              const y0 = cur.f(x0), y1 = cur.f(x1);
              const avg = (y0 + y1) / 2;
              polygons.push({
                pts: [[x0, 0], [x0, y0], [x1, y1], [x1, 0]],
                fill: avg >= 0 ? "rgba(42,120,214,0.22)" : "rgba(235,104,52,0.24)",
                stroke: avg >= 0 ? COLORS.c1 : COLORS.c2,
                width: 1.3,
              });
            } else {
              const xm = s.mode === "left" ? x0 : s.mode === "right" ? x1 : (x0 + x1) / 2;
              const y = cur.f(xm);
              rects.push({
                x0, x1, y0: 0, y1: y,
                fill: y >= 0 ? "rgba(42,120,214,0.22)" : "rgba(235,104,52,0.24)",
                stroke: y >= 0 ? COLORS.c1 : COLORS.c2,
              });
            }
          }
          const approx = riemannSum(cur.f, cur.a, cur.b, s.n, s.mode);
          const errLbl = L({ tr: "\\text{hata}", en: "\\text{err}" });
          plot.draw({
            x: [cur.a - 0.3, cur.b + 0.3], y: cur.yr, xLabel: "x", yLabel: "f(x)",
            rects,
            polygons,
            curves: [{ f: cur.f, color: COLORS.text, width: 2.5 }],
          });
          calc.textContent = `\\(R_{${s.n}} = ${tx(approx, 4)},\\qquad \\int_${cur.a}^${cur.b} f(x)\\,dx = ${tx(cur.exact, 4)},\\qquad |${errLbl}| = ${tx(Math.abs(approx - cur.exact), 4)}\\)`;
        };
        ctl.append(
          segmented([["left", { tr: "Sol", en: "Left" }], ["mid", { tr: "Orta", en: "Mid" }], ["right", { tr: "Sağ", en: "Right" }], ["trap", { tr: "Yamuk", en: "Trap" }]], s.mode, (v) => { s.mode = v; draw(); }),
          segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); }),
        );
        ctl2.append(
          slider("n", { min: 2, max: 40, step: 2, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "di-ftc",
      mathId: "m-di-ftc",
      title: { tr: "Kalkülüsün Temel Teoremi (FTC): Neden Alan = F(b) − F(a)?", en: "Fundamental Theorem of Calculus: Why Area = F(b) − F(a)?" },
      body: [
        {
          tr: R`Sonsuz dikdörtgen limiti almak çok yorucudur. [[ftc|Kalkülüsün Temel Teoremi]], alan bulmayı (integral) ile eğim bulmayı (türev) iki mucizevi adımda birbirine bağlar:<br><b>1. Kısım:</b> Üst sınırı hareketli alan biriktirici \(A(x) = \int_a^x f(t)\,dt\) fonksiyonunu düşünün. \(x\)'i çok küçük bir \(dx\) kadar sağa ittiğinizde alana eklenen ince şeridin alanı yaklaşık \(f(x)\,dx\)'tir — yani alanın anlık büyüme hızı tam olarak eğrinin yüksekliğidir: \(A'(x) = f(x)\)!<br><b>2. Kısım (Newton–Leibniz):</b> \(A(x)\), \(f\)'nin bir ilkel fonksiyonu olduğundan herhangi bir \(F(x)\) ilkeliyle \(\int_a^b f(x)\,dx = F(b) - F(a)\) çıkar!`,
          en: R`Taking infinite Riemann limits by hand is exhausting. The [[ftc|Fundamental Theorem of Calculus]] connects area (integration) and slope (differentiation) in two breathtaking parts:<br><b>Part 1:</b> Think of the moving-boundary area accumulator \(A(x) = \int_a^x f(t)\,dt\). Nudging \(x\) right by a tiny \(dx\) adds a sliver of area \(\approx f(x)\,dx\), so area grows at rate \(A'(x) = f(x)\)!<br><b>Part 2 (Newton–Leibniz):</b> Because \(A(x)\) is an antiderivative of \(f\), ANY antiderivative \(F(x)\) computes the exact area in one subtraction: \(\int_a^b f(x)\,dx = F(b) - F(a)\)!`,
        },
        {
          note: {
            tr: R`<b>İçeride neden \(t\) harfi var?</b> \(A(x) = \int_a^x f(t)\,dt\) yazımında \(x\) harfi zaten sağ duvarın konumu olarak meşguldür; \(t\) ise sadece \(a\)'dan \(x\)'e kadar tarama yapan "kuklacı (dummy)" değişkendir.`,
            en: R`<b>Why is there a \(t\) inside?</b> In \(A(x) = \int_a^x f(t)\,dt\), \(x\) is already busy marking the moving right wall; \(t\) is simply a dummy counter sweeping from \(a\) to \(x\).`,
          },
        },
        { eq: R`\frac{d}{dx}\int_a^x f(t)\,dt = f(x) \qquad \text{ve / and} \qquad \int_a^b f(x)\,dx = F(b) - F(a)` },
        {
          example: {
            title: { tr: "FTC 2. Kısım ile zahmetsiz kesin alan hesabı", en: "Effortless exact area via FTC Part 2" },
            problem: {
              tr: R`\(\int_1^3 (3x^2 - 2x)\,dx\) belirli integralini Newton–Leibniz formülüyle hesaplayın.`,
              en: R`Evaluate \(\int_1^3 (3x^2 - 2x)\,dx\) using the Newton–Leibniz formula.`,
            },
            steps: [
              {
                expr: R`F(x) = \int (3x^2 - 2x)\,dx = x^3 - x^2`,
                note: { tr: "Önce herhangi bir ilkel fonksiyon F(x) buluruz (C = 0 seçmek yeterlidir).", en: "First find any antiderivative F(x) (choosing C = 0 is simplest)." },
              },
              {
                expr: R`F(3) = 3^3 - 3^2 = 27 - 9 = 18, \qquad F(1) = 1^3 - 1^2 = 0`,
                note: { tr: "Üst sınırı (3) ve alt sınırı (1) sırayla F(x) içinde yerine koyarız.", en: "Evaluate F at the upper limit (3) and lower limit (1)." },
              },
              {
                expr: R`\int_1^3 (3x^2 - 2x)\,dx = \Big[x^3 - x^2\Big]_1^3 = 18 - 0 = 18`,
                note: { tr: "Üstten altı çıkarırız: sonsuz dikdörtgen toplamı tek bir çıkarmada bitti!", en: "Subtract F(1) from F(3): an infinite Riemann limit collapsed into one subtraction!" },
              },
            ],
            answer: { tr: R`\(18\)`, en: R`\(18\)` },
          },
        },
        {
          tryList: [
            { tr: R`<b>cos(t)</b> için \(x\) duvarını \(0\)'dan \(6{,}2\)'ye sürükleyin: \(f(t) > 0\) (mavi bölge) boyunca yeşil \(A(x) = \sin x\) yükselir, tam \(x = \pi/2 \approx 1{,}57\)'de tepe yapar, \(f(t) < 0\) (turuncu bölge) başlayınca düşer!`, en: R`On <b>cos(t)</b>, drag wall \(x\) from \(0\) to \(6.2\): green \(A(x) = \sin x\) climbs across the blue positive region, peaks right at \(x = \pi/2 \approx 1.57\), and falls as orange negative area arrives!` },
            { tr: R`\(x = \pi \approx 3{,}14\) konumuna gelin: mavi alan ile turuncu alan eşitlenince yeşil \(A(\pi)\) tam \(0\) olur!`, en: R`Stop near \(x = \pi \approx 3.14\): the blue and orange regions match in size, pulling green \(A(\pi)\) back to \(0\)!` },
            { tr: R`<b>t − 2</b> seçip \(x = 2\) (minimum noktası) ve \(x = 4\) (toplam alan \(= 0\)) anlarını yakalayın.`, en: R`Switch to <b>t − 2</b> and check \(x = 2\) (exact minimum of \(A(x)\)) and \(x = 4\) (net area returns to \(0\)).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.ftc ??= { fn: "cos", x: 2.2 });
        const fns = {
          cos: {
            label: "f(t) = cos t",
            f: (t) => Math.cos(t),
            A: (x) => Math.sin(x),
            ftex: "\\cos t",
            Atex: "\\sin",
            xr: [-0.2, 6.4],
            yr: [-1.45, 1.45],
            maxX: 6.2,
          },
          lin: {
            label: "f(t) = t − 2",
            f: (t) => t - 2,
            A: (x) => 0.5 * x * x - 2 * x,
            ftex: "(t - 2)",
            Atex: "A",
            xr: [-0.2, 4.6],
            yr: [-2.6, 2.8],
            maxX: 4.4,
          },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 265 });
        let xSlider;

        const draw = () => {
          const cur = fns[s.fn];
          const x = Math.min(cur.maxX, s.x);
          // Shade positive and negative subregions separately for crystal clarity
          const areas = [
            { f: (t) => Math.max(0, cur.f(t)), from: 0, to: x, fill: "rgba(42,120,214,0.22)" },
            { f: (t) => Math.min(0, cur.f(t)), from: 0, to: x, fill: "rgba(235,104,52,0.24)" },
          ];
          const valA = cur.A(x);
          const valF = cur.f(x);
          plot.draw({
            x: cur.xr, y: cur.yr, xLabel: "t", yLabel: "y",
            areas,
            curves: [
              { f: cur.f, color: COLORS.c1, width: 2.5 },
              { f: cur.A, color: COLORS.c3, width: 2.4, dash: [5, 4] },
            ],
            lines: [{ a: 1, b: 0, c: -x, color: COLORS.c2, dash: [4, 3] }],
            points: [
              { x, y: valF, color: COLORS.c1, r: 5, label: "f(x)" },
              { x, y: valA, color: COLORS.c3, r: 6, ring: true, label: "A(x)" },
            ],
          });
          calc.textContent = `\\(A(${tx(x, 2)}) = \\int_0^{${tx(x, 2)}} ${cur.ftex}\\,dt = ${tx(valA, 3)},\\qquad A'(${tx(x, 2)}) = f(${tx(x, 2)}) = ${tx(valF, 3)}\\)`;
        };
        xSlider = slider("x", { min: 0, max: 6.2, step: 0.1, value: s.x, onInput: (v) => { s.x = v; draw(); } });
        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => {
            s.fn = v;
            if (s.x > fns[v].maxX) { s.x = fns[v].maxX; xSlider.set(s.x); }
            draw();
          }),
          xSlider,
        );
        draw();
      },
    },
    {
      id: "di-sym",
      mathId: "m-di-sym",
      title: { tr: "Simetri Kısayolları (Tek/Çift) ve Belirli u-Dönüşümü", en: "Symmetry Shortcuts (Even/Odd) & Definite u-Substitution" },
      body: [
        {
          tr: R`Sınırlar sıfıra göre simetrik bir \([-a, a]\) aralığındaysa, kalemi bile oynatmadan harika kısayollar yakalayabilirsiniz:<br>• <b>Tek fonksiyon</b> (\(f(-x) = -f(x)\), örneğin \(x^3, \sin x\)): Sol yarıdaki alan, sağ yarıdaki alanın tam ters işaretlisidir — birbirlerini sıfırlayıp <b>anında \(0\)</b> verirler!<br>• <b>Çift fonksiyon</b> (\(f(-x) = f(x)\), örneğin \(x^2, \cos x\)): İki yarı ayna gibidir, sadece yarısını hesaplayıp \(2\) ile çarpmak yeterlidir!`,
          en: R`Whenever the limits are symmetric around zero (\([-a, a]\)), check parity before doing any work:<br>• <b>Odd function</b> (\(f(-x) = -f(x)\), like \(x^3, \sin x\)): the left half is the exact negative mirror of the right half — they cancel to <b>\(0\) instantly</b>!<br>• <b>Even function</b> (\(f(-x) = f(x)\), like \(x^2, \cos x\)): both halves match identically, so integrate \([0, a]\) and double it!`,
        },
        {
          note: {
            tr: R`<b>Belirli integralde [[u-substitution|\(u\)-dönüşümü]]:</b> \(u = g(x)\) yazdığınızda sınırları da \(x = a \to u = g(a)\) ve \(x = b \to u = g(b)\) olarak yeni değişkene çevirin! Böylece bir daha \(x\)'e geri dönmenize bile gerek kalmaz.`,
            en: R`<b>Definite [[u-substitution|\(u\)-substitution]]:</b> when setting \(u = g(x)\), transform the limits too: \(x = a \to u = g(a)\) and \(x = b \to u = g(b)\)! Then evaluate directly in \(u\) without ever switching back to \(x\).`,
          },
        },
        { eq: R`\text{Tek / Odd: } \int_{-a}^{a} f(x)\,dx = 0, \qquad \text{Çift / Even: } \int_{-a}^{a} f(x)\,dx = 2\int_0^{a} f(x)\,dx` },
        {
          example: {
            title: { tr: "Belirli u-dönüşümü: sınırları da u'ya çevirmek", en: "Definite u-substitution: updating the limits" },
            problem: {
              tr: R`\(\int_0^2 2x(x^2 + 1)^2\,dx\) belirli integralini sınırları güncelleyerek hesaplayın.`,
              en: R`Evaluate \(\int_0^2 2x(x^2 + 1)^2\,dx\) by changing the integration limits to \(u\).`,
            },
            steps: [
              {
                expr: R`u = x^2 + 1 \implies du = 2x\,dx`,
                note: { tr: "İç ifadeyi u seçtik; türevi 2x dx doğrudan du oldu.", en: "Set u = x² + 1 so 2x dx becomes du cleanly." },
              },
              {
                expr: R`x = 0 \Rightarrow u = 0^2 + 1 = 1, \qquad x = 2 \Rightarrow u = 2^2 + 1 = 5`,
                note: { tr: "ALTIN ADIM: Alt ve üst sınırları yeni u değişkenine dönüştürdük!", en: "KEY STEP: Convert both lower and upper limits into the new u-world!" },
              },
              {
                expr: R`\int_1^5 u^2\,du = \left[\frac{u^3}{3}\right]_1^5 = \frac{125 - 1}{3} = \frac{124}{3}`,
                note: { tr: "Artık x'e dönmeye gerek yok — doğrudan u = 5 ve u = 1 koyup bitiriyoruz!", en: "No need to substitute back to x — just plug in u = 5 and u = 1!" },
              },
            ],
            answer: { tr: R`\(\dfrac{124}{3} \approx 41{,}33\)`, en: R`\(\dfrac{124}{3} \approx 41.33\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "u-dönüşümünde eski x sınırlarını kullanmak!", en: "Keeping old x-limits after switching to u!" },
            text: {
              tr: R`Yukarıdaki örnekte \(\int_0^2 u^2\,du = \frac{8}{3}\) yazmak sınavlarda en sık yapılan hatadır! \(0\) ve \(2\) sayıları \(x\)'in sınırlarıdır, \(u\)'nun değil. Ya sınırları \((1, 5)\) olarak güncelleyin ya da ilkel fonksiyonu tekrar \((x^2+1)^3/3\) yazıp sonra \((0, 2)\) koyun.`,
              en: R`Writing \(\int_0^2 u^2\,du = \frac{8}{3}\) in the example above is the #1 exam trap! The numbers \(0\) and \(2\) belong to \(x\), NOT to \(u\). Either convert limits to \((1, 5)\) OR return to \((x^2+1)^3/3\) before plugging in \((0, 2)\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>Tek</b> eğrilerden <b>x³</b> veya <b>sin(x)</b> seçin ve \(a\) kaydırıcısını oynatın: \(I_{\text{sol}} = -I_{\text{sağ}}\) olduğundan toplam integralin her \(a\) için \(0\) kaldığını görün!`, en: R`Pick an <b>Odd</b> curve (<b>x³</b> or <b>sin x</b>) and slide \(a\): watch \(I_{\text{left}} = -I_{\text{right}}\) keep the total locked at exact \(0\)!` },
            { tr: R`<b>Çift</b> eğrilerden <b>x²</b> veya <b>e⁻ˣ²</b> seçin: iki taraf da aynı mavi işarette toplanır ve toplam tam \(2 \cdot I_{\text{sağ}}\) olur.`, en: R`Pick an <b>Even</b> curve (<b>x²</b> or <b>e⁻ˣ²</b>): both halves match in blue and sum to exact \(2 \cdot I_{\text{right}}\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.sym ??= { fn: "cube", a: 2 });
        const fns = {
          cube: { label: "x³/4 (Tek/Odd)", parity: "odd", f: (x) => (x * x * x) / 4, yr: [-2.8, 2.8] },
          sin: { label: "sin x (Tek/Odd)", parity: "odd", f: (x) => Math.sin(x), yr: [-1.4, 1.4] },
          sq: { label: "x²/2 (Çift/Even)", parity: "even", f: (x) => 0.5 * x * x, yr: [-0.4, 3.8] },
          gauss: { label: "e⁻ˣ² (Çift/Even)", parity: "even", f: (x) => Math.exp(-x * x), yr: [-0.2, 1.3] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 245 });

        const draw = () => {
          const cur = fns[s.fn];
          const iLeft = simpson(cur.f, -s.a, 0, 80);
          const iRight = simpson(cur.f, 0, s.a, 80);
          const total = iLeft + iRight;
          plot.draw({
            x: [-3.2, 3.2], y: cur.yr, xLabel: "x", yLabel: "f(x)",
            areas: [
              { f: (x) => Math.max(0, cur.f(x)), from: -s.a, to: s.a, fill: "rgba(42,120,214,0.22)" },
              { f: (x) => Math.min(0, cur.f(x)), from: -s.a, to: s.a, fill: "rgba(235,104,52,0.25)" },
            ],
            lines: [
              { a: 1, b: 0, c: s.a, color: COLORS.muted, dash: [4, 4] },
              { a: 1, b: 0, c: -s.a, color: COLORS.muted, dash: [4, 4] },
            ],
            curves: [{ f: cur.f, color: COLORS.text, width: 2.5 }],
          });
          const lLbl = L({ tr: "\\text{sol}", en: "\\text{left}" });
          const rLbl = L({ tr: "\\text{sağ}", en: "\\text{right}" });
          calc.textContent = `\\(I_{${lLbl}} = ${tx(iLeft, 3)},\\quad I_{${rLbl}} = ${tx(iRight, 3)} \\implies \\int_{-${tx(s.a, 1)}}^{${tx(s.a, 1)}} f(x)\\,dx = ${tx(total, 3)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("a", { min: 0.5, max: 2.8, step: 0.1, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "di-improper",
      mathId: "m-di-improper",
      title: { tr: "Genelleştirilmiş İntegraller: Sonsuz Kuyruklar ve 1/xᵖ Sınırı", en: "Improper Integrals: Infinite Tails & The 1/xᵖ Borderline" },
      body: [
        {
          tr: R`Peki taradığımız alan sağa doğru <b>sonsuza kadar</b> uzanıyorsa (\([1, \infty)\)) ne olur? \(\infty\) bir sayı olmadığı için doğrudan yerine koyamayız; önce sonlu bir \(b\) duvarına kadar integre edip sonra duvarı sonsuza göndeririz: \(\lim_{b\to\infty}\int_1^b f(x)\,dx\). Bu limit sonlu bir sayıya oturursa integral <b>yakınsar</b>, sonsuza büyürse <b>ıraksar</b>!`,
          en: R`What if a region stretches <b>all the way to infinity</b> (\([1, \infty)\))? Since \(\infty\) is not a number you can plug in, we integrate up to a finite wall \(b\) and then send the wall to infinity: \(\lim_{b\to\infty}\int_1^b f(x)\,dx\). If that limit settles to a finite number, the integral <b>converges</b>; if it grows without bound, it <b>diverges</b>!`,
        },
        {
          analogy: {
            title: { tr: "Sonsuz uzunlukta bir şeridi tek kova boyayla boyamak mümkün mü?", en: "Can one bucket of paint cover an infinitely long strip?" },
            text: {
              tr: R`İnanması zor ama EVET — eğer şerit yeterince <b>hızlı inceliyorsa</b>! \(y = 1/x^2\) eğrisinin \([1, \infty)\) altındaki sonsuz uzunluktaki kuyruğunun toplam alanı tam olarak \(1\) birimdir (tek bir kova boya yeter!). Oysa \(y = 1/x\) yeterince hızlı incelmediği için sonsuz kova boya yutar!`,
              en: R`Amazingly, YES — if the strip narrows <b>fast enough</b>! The infinitely long tail under \(y = 1/x^2\) on \([1, \infty)\) has total area equal to exactly \(1\) (one paint bucket covers it all!). By contrast, \(y = 1/x\) narrows too slowly and swallows infinitely many buckets!`,
            },
          },
        },
        { eq: R`\int_1^\infty \frac{1}{x^p}\,dx = \lim_{b\to\infty}\int_1^b x^{-p}\,dx = \begin{cases}\dfrac{1}{p - 1} & p > 1 \;\;(\text{yakınsak / converges}) \\[6pt] \infty & p \le 1 \;\;(\text{ıraksak / diverges})\end{cases}` },
        {
          example: {
            title: { tr: "Bıçak sırtı karşılaştırma: 1/x² (yakınsak) vs 1/x (ıraksak)", en: "Razor-edge comparison: 1/x² (converges) vs 1/x (diverges)" },
            problem: {
              tr: R`\(\int_1^\infty \frac{1}{x^2}\,dx\) ve \(\int_1^\infty \frac{1}{x}\,dx\) genelleştirilmiş integrallerini limit tanımıyla hesaplayın.`,
              en: R`Evaluate both \(\int_1^\infty \frac{1}{x^2}\,dx\) and \(\int_1^\infty \frac{1}{x}\,dx\) from the limit definition.`,
            },
            steps: [
              {
                expr: R`\int_1^\infty \frac{1}{x^2}\,dx = \lim_{b\to\infty}\left[-\frac{1}{x}\right]_1^b = \lim_{b\to\infty}\left(-\frac{1}{b} + 1\right) = 0 + 1 = 1`,
                note: { tr: "p = 2 > 1 olduğundan b → ∞ iken 1/b → 0 olur ve sonlu alan 1 çıkar!", en: "With p = 2 > 1, 1/b → 0 as b → ∞, yielding finite total area 1!" },
              },
              {
                expr: R`\int_1^\infty \frac{1}{x}\,dx = \lim_{b\to\infty}\Big[\ln x\Big]_1^b = \lim_{b\to\infty}(\ln b - 0) = +\infty`,
                note: { tr: "p = 1 sınırında ln b çok yavaş da olsa sınırsız büyür → ıraksak!", en: "At the borderline p = 1, ln b climbs slowly but without bound → diverges!" },
              },
            ],
            answer: { tr: R`\(\int_1^\infty x^{-2}\,dx = 1\) (yakınsak), \(\int_1^\infty x^{-1}\,dx = \infty\) (ıraksak)`, en: R`\(\int_1^\infty x^{-2}\,dx = 1\) (converges), \(\int_1^\infty x^{-1}\,dx = \infty\) (diverges)` },
          },
        },
        {
          pitfall: {
            title: { tr: "Eğri sıfıra yaklaşıyor diye alan sonlu olmak ZORUNDA değildir!", en: "Approaching zero does NOT guarantee finite area!" },
            text: {
              tr: R`\(x \to \infty\) iken \(1/x \to 0\) olması alanı sonlu yapmaya yetmez (tıpkı Ders 16'daki [[p-series|harmonik seri]] \(\sum 1/n = \infty\) gibi!). Yakınsaklık için eğrinin \(1/x\)'ten <b>daha hızlı</b> (yani \(p > 1\)) yere yapışması şarttır.`,
              en: R`Even though \(1/x \to 0\) as \(x \to \infty\), that is NOT enough for finite area (mirroring the [[p-series|harmonic series]] \(\sum 1/n = \infty\)!). The tail must drop strictly <b>faster</b> than \(1/x\) (i.e. \(p > 1\)).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>p = 2</b> tuşuna tıklayıp \(b\) duvarını \(25\)'e kadar kaydırın: yeşil taralı alanın \(1{,}000\) sınırına nasıl kilitlendiğini görün!`, en: R`Click <b>p = 2</b> and push wall \(b\) up to \(25\): watch the green area lock neatly under its ceiling of \(1.000\)!` },
            { tr: R`<b>p = 1</b> (sınır çizgisi) ve <b>p = 0.5</b> seçin: alanın kırmızı/turuncu tonda durmadan tırmandığını ve kesikli gri \(1/x\) eğrisinin üstünde kaldığını görün.`, en: R`Click <b>p = 1</b> and <b>p = 0.5</b>: watch the orange area keep growing endlessly while the curve sits at or above the dashed gray \(1/x\) boundary.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.imp ??= { p: 2.0, b: 10 });
        const ctl = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const badge = h("p", { class: "pc-msg" });
        box.append(ctl, ctl2, host, calc, badge);
        const plot = createCanvas2D(host, { height: 245 });
        let pSlider, bSlider;

        const draw = () => {
          const f = (x) => (x > 0 ? x ** -s.p : NaN);
          const ref = (x) => (x > 0 ? 1 / x : NaN);
          const conv = s.p > 1.0001;
          const partial = Math.abs(s.p - 1) < 1e-4 ? Math.log(s.b) : (1 - s.b ** (1 - s.p)) / (s.p - 1);
          const limVal = conv ? 1 / (s.p - 1) : Infinity;
          plot.draw({
            x: [0.5, 25.5], y: [-0.08, 1.25], xLabel: "x", yLabel: "1/xᵖ",
            areas: [{ f, from: 1, to: s.b, fill: conv ? "rgba(27,175,122,0.22)" : "rgba(235,104,52,0.24)" }],
            lines: [
              { a: 1, b: 0, c: -1, color: COLORS.muted, dash: [3, 3] },
              { a: 1, b: 0, c: -s.b, color: conv ? COLORS.c3 : COLORS.c2, dash: [5, 3], width: 1.8 },
            ],
            curves: [
              { f: ref, color: COLORS.muted, width: 1.6, dash: [4, 4], xRange: [0.8, 25.5] },
              { f, color: conv ? COLORS.c3 : COLORS.c2, width: 2.7, xRange: [0.8, 25.5] },
            ],
          });
          calc.textContent = `\\(\\int_1^{${s.b}} \\frac{dx}{x^{${tx(s.p, 1)}}} = ${tx(partial, 4)},\\qquad \\int_1^{\\infty} \\frac{dx}{x^{${tx(s.p, 1)}}} = ${conv ? tx(limVal, 4) : "+\\infty"}\\)`;
          badge.className = `pc-msg ${conv ? "good" : "bad"}`;
          badge.textContent = conv
            ? L({
                tr: `p = ${ns(s.p, 1)} > 1: Eğri 1/x'ten hızlı düşüyor → YAKINSAK! Sonsuz kuyruğun toplam alanı ${ns(limVal, 3)}.`,
                en: `p = ${ns(s.p, 1)} > 1: Drops faster than 1/x → CONVERGES! Total infinite area = ${ns(limVal, 3)}.`,
              })
            : L({
                tr: `p = ${ns(s.p, 1)} ≤ 1: Eğri yeterince hızlı incelmiyor → IRAKSAK! b büyüdükçe alan sınırsız artar.`,
                en: `p = ${ns(s.p, 1)} ≤ 1: Tail narrows too slowly → DIVERGES! Area grows without bound as b → ∞.`,
              });
        };

        for (const [lbl, pVal] of [["p = 0.5", 0.5], ["p = 1 (1/x)", 1.0], ["p = 1.5", 1.5], ["p = 2 (1/x²)", 2.0]]) {
          const btn = h("button", { type: "button", class: "btn small", text: lbl });
          btn.addEventListener("click", () => { s.p = pVal; pSlider.set(pVal); draw(); });
          ctl.append(btn);
        }
        pSlider = slider("p", { min: 0.4, max: 3, step: 0.1, value: s.p, onInput: (v) => { s.p = v; draw(); } });
        bSlider = slider("b", { min: 2, max: 25, step: 1, value: s.b, fmt: (v) => String(v), onInput: (v) => { s.b = v; draw(); } });
        ctl2.append(pSlider, bSlider);
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Sayısal İntegral Laboratuvarı: Sol, Orta, Yamuk ve Simpson", en: "Numerical Quadrature Lab: Left, Midpoint, Trapezoid & Simpson" },
    sub: {
      tr: R`İlkel fonksiyonu elemanter olmayan Gauss çanı \(\int_0^b e^{-x^2/2}\,dx\) dahil 3 farklı fonksiyonda dört sayısal yöntemin doğruluk yarışını izleyin!`,
      en: R`Pit four numerical quadrature rules against each other — including the non-elementary Gaussian bell \(\int_0^b e^{-x^2/2}\,dx\)!`,
    },
    experiments: [
      { tr: R`<b>"Gauss Çanı (n=6)"</b> önayarında Yamuk hatasını ve Simpson hatasını karşılaştırın: aynı \(n = 6\) dilimle Simpson nasıl onlarca kat daha keskin sonuç verir?`, en: R`Click <b>"Gaussian (n=6)"</b> and compare Trapezoid vs Simpson error: with the exact same \(n = 6\) slices, how many times sharper is Simpson?` },
      { tr: R`<b>"Kaba (n=2)"</b> tuşundan <b>"İnce (n=16)"</b> tuşuna geçin: \(n\)'yi 8 kat artırdığınızda Sol hatası ~8 kat, Yamuk hatası ~64 kat, Simpson hatası ise ~4096 kat düşer!`, en: R`Jump from <b>"Coarse (n=2)"</b> to <b>"Fine (n=16)"</b>: multiplying \(n\) by 8 cuts Left error by ~8×, Trapezoid by ~64×, and Simpson by ~4096×!` },
      { tr: R`<b>"Kübik Polinom"</b> önayarına tıklayın: sadece \(n = 2\) dilimde bile Simpson kuralının hatası tam <b>0</b> çıkar (çünkü Simpson parabollerle kübik eğrileri bile hatasız bütünler)!`, en: R`Click <b>"Cubic Poly"</b>: even at \(n = 2\), Simpson's error hits exact <b>0</b> (Simpson's parabolic arcs integrate every cubic polynomial with zero error)!` },
      { tr: R`\(b\) üst sınırını \(0{,}5\)'ten \(4\)'e kadar kaydırıp Gauss eğrisinin \([0, \infty)\) toplamı olan \(\sqrt{\pi/2} \approx 1{,}2533\) değerine yaklaştığını gözlemleyin.`, en: R`Slide \(b\) from \(0.5\) to \(4\) on the Gaussian bell and watch the integral approach its famous infinite limit \(\sqrt{\pi/2} \approx 1.2533\).` },
    ],
    build(host, state) {
      const s = (state.pg ??= { fn: "gauss", b: 2, n: 6 });
      const fns = {
        gauss: { label: "e⁻ˣ²/²", f: (x) => Math.exp(-0.5 * x * x), yr: [-0.1, 1.2], yLbl: "e^(-x²/2)" },
        sin: { label: "sin(x)", f: (x) => Math.sin(x), yr: [-1.1, 1.2], yLbl: "sin x" },
        cubic: { label: "0.1x³ + 0.3", f: (x) => 0.1 * x * x * x + 0.3, yr: [-0.1, 3.8], yLbl: "0.1x³+0.3" },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 380 });
      const presets = h("div", { class: "t-controls" });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(presets, ctl, ctl2, tiles, calc);

      let segCtrl, bSlider, nSlider;

      const draw = () => {
        const cur = fns[s.fn];
        const f = cur.f;
        const ref = simpson(f, 0, s.b, 400);
        const rL = riemannSum(f, 0, s.b, s.n, "left");
        const rM = riemannSum(f, 0, s.b, s.n, "mid");
        const rT = riemannSum(f, 0, s.b, s.n, "trap");
        const rS = simpson(f, 0, s.b, s.n);
        const dx = s.b / s.n;
        const polys = [];
        for (let i = 0; i < s.n; i++) {
          const x0 = i * dx, x1 = x0 + dx;
          const avg = (f(x0) + f(x1)) / 2;
          polys.push({
            pts: [[x0, 0], [x0, f(x0)], [x1, f(x1)], [x1, 0]],
            fill: avg >= 0 ? "rgba(27,175,122,0.16)" : "rgba(235,104,52,0.20)",
            stroke: avg >= 0 ? COLORS.c3 : COLORS.c2,
            width: 1.2,
          });
        }
        plot.draw({
          x: [-0.3, Math.max(2.5, s.b + 0.4)], y: cur.yr, xLabel: "x", yLabel: cur.yLbl,
          polygons: polys,
          curves: [{ f, color: COLORS.c1, width: 2.7 }],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Sol hata", en: "Left err" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(rL - ref), 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Orta hata", en: "Mid err" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(rM - ref), 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Yamuk hata", en: "Trap err" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(rT - ref), 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Simpson hata", en: "Simpson err" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(rS - ref), 6) })),
        );
        const refLbl = L({ tr: "\\text{Referans}", en: "\\text{Reference}" });
        calc.textContent = `\\(${refLbl} = ${tx(ref, 6)},\\qquad \\text{Simpson}_{${s.n}} = ${tx(rS, 6)}\\)`;
      };

      const applyPreset = (fn, b, n) => {
        s.fn = fn;
        s.b = b;
        s.n = n;
        segCtrl.set(fn);
        bSlider.set(b);
        nSlider.set(n);
        draw();
      };

      const presetDefs = [
        [{ tr: "Gauss Çanı (n=6)", en: "Gaussian (n=6)" }, "gauss", 2, 6],
        [{ tr: "Kaba Bölme (n=2)", en: "Coarse (n=2)" }, "gauss", 2, 2],
        [{ tr: "İnce Bölme (n=16)", en: "Fine (n=16)" }, "gauss", 2, 16],
        [{ tr: "Kübik (Simpson = 0 hata!)", en: "Cubic (Simpson = 0 err!)" }, "cubic", 3, 2],
      ];
      for (const [lbl, fn, b, n] of presetDefs) {
        const btn = h("button", { type: "button", class: "btn small", text: L(lbl) });
        btn.addEventListener("click", () => applyPreset(fn, b, n));
        presets.append(btn);
      }

      segCtrl = segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); });
      bSlider = slider("b", { min: 0.5, max: 4, step: 0.5, value: s.b, onInput: (v) => { s.b = v; draw(); } });
      nSlider = slider("n", { min: 2, max: 20, step: 2, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } });
      ctl.append(segCtrl);
      ctl2.append(bSlider, nSlider);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-di-riemann",
      title: { tr: "Belirli İntegralin Temel Özellikleri", en: "Core Properties of Definite Integrals" },
      blocks: [
        {
          table: {
            head: [{ tr: "Özellik", en: "Property" }, { tr: "Formül", en: "Formula" }, { tr: "Sezgisel anlam", en: "Intuition" }],
            rows: [
              [{ tr: "Sıfır genişlik", en: "Zero width" }, R`\(\int_a^a f(x)\,dx = 0\)`, { tr: "Genişliği 0 olan şeridin alanı 0'dır.", en: "A zero-width strip has zero area." }],
              [{ tr: "Sınır değişimi", en: "Reversing limits" }, R`\(\int_b^a f(x)\,dx = -\int_a^b f(x)\,dx\)`, { tr: "Geri yönde yürümek işareti çevirir.", en: "Walking backwards flips the sign." }],
              [{ tr: "Aralık toplamsallığı", en: "Additivity" }, R`\(\int_a^b f + \int_b^c f = \int_a^c f\)`, { tr: "İki bitişik parçanın toplamı bütünü verir.", en: "Adjacent strips add up to the whole." }],
              [{ tr: "Doğrusallık", en: "Linearity" }, R`\(\int_a^b (\alpha f + \beta g) = \alpha\int_a^b f + \beta\int_a^b g\)`, { tr: "Sabit dışarı, toplam ayrı.", en: "Scale out constants, split sums." }],
              [{ tr: "Sıralama / Üçgen", en: "Order & bound" }, R`\(\left|\int_a^b f(x)\,dx\right| \le \int_a^b |f(x)|\,dx\)`, { tr: "İşaretli alan toplam alandan büyük olamaz.", en: "Net signed area ≤ total unsigned area." }],
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Sayısal kuralların hata hızları", en: "Error convergence speeds of quadrature rules" },
          text: {
            tr: R`\(n\) dilim sayısı arttıkça Sol/Sağ toplamların hatası \(O(1/n)\) hızında, Orta Nokta ve Yamuk kuralları \(O(1/n^2)\) hızında, Simpson kuralı ise parabolik yaylar kullandığı için muazzam bir \(O(1/n^4)\) hızında sıfıra iner!`,
            en: R`As \(n\) grows, Left/Right error decays as \(O(1/n)\), Midpoint and Trapezoid as \(O(1/n^2)\), and Simpson's rule (using parabolic arcs) crushes error at a dramatic \(O(1/n^4)\)!`,
          },
        },
      ],
    },
    {
      id: "m-di-ftc",
      title: { tr: "Kalkülüsün Temel Teoreminin İspatı (1. ve 2. Kısım)", en: "Proof of the Fundamental Theorem of Calculus (Parts 1 & 2)" },
      blocks: [
        {
          derive: {
            title: { tr: "FTC 1. Kısım: A'(x) = f(x) ve 2. Kısım: ∫ₐᵇ f = F(b) − F(a)", en: "FTC Part 1 (A'(x) = f(x)) & Part 2 (Newton–Leibniz)" },
            steps: [
              {
                tex: R`\frac{A(x+h) - A(x)}{h} = \frac{1}{h}\int_x^{x+h} f(t)\,dt`,
                why: { tr: "A(x+h) − A(x) farkı yalnızca [x, x+h] ince diliminin alanıdır; h'ye bölünce o dilimin ortalama yüksekliği elde edilir.", en: "Additivity isolates the thin strip [x, x+h]; dividing by h yields its average height." },
              },
              {
                tex: R`\frac{1}{h}\int_x^{x+h} f(t)\,dt = f(c_h) \quad \big(c_h \in [x, x+h]\big)`,
                why: { tr: "Sürekli f için İntegrallerin Ortalama Değer Teoremi, ortalama yüksekliğin aralıktaki bir c_h noktasında tam olarak alındığını garantiler.", en: "For continuous f, the Mean Value Theorem for Integrals guarantees some c_h in [x, x+h] attains that exact average height." },
              },
              {
                tex: R`A'(x) = \lim_{h\to 0} f(c_h) = f(x)`,
                why: { tr: "h → 0 iken c_h sayısı x'e sıkışır; süreklilik sayesinde f(c_h) → f(x) olur — FTC 1. Kısım kanıtlandı!", en: "As h → 0, c_h is squeezed to x; continuity sends f(c_h) → f(x) — proving FTC Part 1!" },
              },
              {
                tex: R`A(x) = F(x) + C,\quad A(a) = 0 \implies C = -F(a) \implies \int_a^b f(t)\,dt = F(b) - F(a)`,
                why: { tr: "Hem A hem F aynı f'nin ilkel fonksiyonu olduğundan sadece bir C sabiti kadar farklıdırlar; A(a) = 0 koyarak C = −F(a) buluruz!", en: "Both A and F are antiderivatives of f, so they differ by a constant C; setting x = a gives 0 = F(a) + C ⇒ C = −F(a)!" },
              },
            ],
          },
        },
        {
          example: {
            title: { tr: "FTC 1. Kısım + Zincir Kuralı (sınav klasiği!)", en: "FTC Part 1 + Chain Rule (exam classic!)" },
            problem: {
              tr: R`\(G(x) = \int_1^{x^2} \sin(t^3)\,dt\) fonksiyonunun türevi \(G'(x)\)'i bulun.`,
              en: R`Differentiate \(G(x) = \int_1^{x^2} \sin(t^3)\,dt\).`,
            },
            steps: [
              {
                expr: R`A(u) = \int_1^u \sin(t^3)\,dt \implies G(x) = A(x^2)`,
                note: { tr: "Üst sınır x değil x² olduğu için G(x) bir bileşke fonksiyondur!", en: "Since the upper limit is x² instead of x, G(x) is a composition A(x²)!" },
              },
              {
                expr: R`G'(x) = A'(x^2)\cdot (x^2)' = \sin\big((x^2)^3\big)\cdot 2x = 2x\sin(x^6)`,
                note: { tr: "İntegrali hiç almadan: t yerine üst sınırı (x²) yaz ve üst sınırın türevi (2x) ile çarp!", en: "No integration needed: plug the upper limit x² in for t, then multiply by its derivative 2x!" },
              },
            ],
            answer: { tr: R`\(G'(x) = 2x\sin(x^6)\)`, en: R`\(G'(x) = 2x\sin(x^6)\)` },
          },
        },
      ],
    },
    {
      id: "m-di-sym",
      title: { tr: "Tek/Çift Simetri İspatı ve Belirli u-Dönüşümü", en: "Proof of Parity Shortcuts & Definite u-Substitution" },
      blocks: [
        {
          derive: {
            title: { tr: "Tek fonksiyonun simetrik integralinin neden 0 olduğu", en: "Why an odd function integrates to 0 on [−a, a]" },
            steps: [
              {
                tex: R`\int_{-a}^a f(x)\,dx = \int_{-a}^0 f(x)\,dx + \int_0^a f(x)\,dx`,
                why: { tr: "Aralığı 0 noktasından iki simetrik parçaya ayırırız.", en: "Split the symmetric interval at 0." },
              },
              {
                tex: R`u = -x \implies du = -dx,\quad (-a \to a,\; 0 \to 0):\quad \int_{-a}^0 f(x)\,dx = \int_a^0 f(-u)(-du) = \int_0^a f(-u)\,du`,
                why: { tr: "Sol parçada u = −x dönüşümü yapıp eksi işaretiyle sınırları çeviririz.", en: "Substitute u = −x in the left half and flip limits using the minus sign." },
              },
              {
                tex: R`\int_{-a}^a f(x)\,dx = \int_0^a \big(f(-x) + f(x)\big)\,dx = \begin{cases}0 & f(-x) = -f(x)\text{ (tek/odd)} \\ 2\int_0^a f(x)\,dx & f(-x) = f(x)\text{ (çift/even)}\end{cases}`,
                why: { tr: "Tek fonksiyonda f(−x) + f(x) = 0; çift fonksiyonda 2f(x) çıkar!", en: "Odd makes f(−x)+f(x) = 0; even makes it 2f(x)!" },
              },
            ],
          },
        },
        {
          callout: "warn",
          title: { tr: "Belirli u-dönüşümünde sınır kontrolü", en: "Limit check in definite u-substitution" },
          text: {
            tr: R`\(\int_a^b f(g(x))g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du\). Yeni sınırlar \(g(a) > g(b)\) şeklinde ters bile çıksa dokunmayın — eksi işaretini doğal olarak doğru tutar!`,
            en: R`\(\int_a^b f(g(x))g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du\). Even if \(g(a) > g(b)\), keep them in that exact order — the sign comes out automatically right!`,
          },
        },
      ],
    },
    {
      id: "m-di-improper",
      title: { tr: "Genelleştirilmiş İntegraller (1. ve 2. Tür)", en: "Improper Integrals (Type 1 & Type 2)" },
      blocks: [
        {
          table: {
            head: [{ tr: "Tür", en: "Type" }, { tr: "Tanım (Limit)", en: "Limit Definition" }, { tr: "p-Testi Sınırı", en: "p-Test Borderline" }],
            rows: [
              [{ tr: "1. Tür (Sonsuz aralık)", en: "Type 1 (Infinite tail)" }, R`\(\int_a^\infty f = \lim_{b\to\infty}\int_a^b f\)`, R`\(\int_1^\infty x^{-p}\,dx < \infty \iff p > 1\)`],
              [{ tr: "2. Tür (Dikey asimptot)", en: "Type 2 (Vertical pole)" }, R`\(\int_0^1 f = \lim_{\varepsilon\to 0^+}\int_\varepsilon^1 f\)`, R`\(\int_0^1 x^{-p}\,dx < \infty \iff p < 1\)`],
            ],
          },
        },
        {
          example: {
            title: { tr: "2. Tür genelleştirilmiş integral: dikey asimptotlu ama SONLU alan!", en: "Type 2 improper integral: infinite spike, FINITE area!" },
            problem: {
              tr: R`\(\int_0^1 \frac{1}{\sqrt{x}}\,dx\) integralinin yakınsak mı ıraksak mı olduğunu belirleyip değerini bulun.`,
              en: R`Determine whether \(\int_0^1 \frac{1}{\sqrt{x}}\,dx\) converges and compute its value.`,
            },
            steps: [
              {
                expr: R`\int_0^1 x^{-1/2}\,dx = \lim_{\varepsilon\to 0^+}\int_\varepsilon^1 x^{-1/2}\,dx`,
                note: { tr: "x = 0'da payda sıfır olduğu için (dikey asimptot!) alt sınırı ε → 0⁺ limiti olarak yazarız.", en: "Because x = 0 blows up to ∞, replace 0 with a right-hand limit ε → 0⁺." },
              },
              {
                expr: R`= \lim_{\varepsilon\to 0^+}\Big[2\sqrt{x}\Big]_\varepsilon^1 = \lim_{\varepsilon\to 0^+}(2 - 2\sqrt{\varepsilon}) = 2`,
                note: { tr: "p = 1/2 < 1 olduğundan sivri tepe sonsuza çıksa da altındaki alan sonlu (tam 2) kalır!", en: "Since p = 1/2 < 1, even though the spike shoots to ∞, the enclosed area is finite (exact 2)!" },
              },
            ],
            answer: { tr: R`Yakınsak; değeri \(2\)`, en: R`Convergent; value is \(2\)` },
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
