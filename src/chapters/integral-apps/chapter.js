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
        tr: R`Belirli integralin gerçek mühendislik gücü <b>"İnce Dilimle → Tek Dilimi Ölç → Hepsini Topla (\(\int\))"</b> ilkesidir! Dikey ince şeritleri topladığımızda iki eğri arasındaki <b>alanı</b>, dairesel dilimleri (disk veya halka) üst üste dizdiğimizde [[solid-of-revolution|3B dönel cisimlerin hacmini]], minik dik üçgenlerin hipotenüslerini uç uca eklediğimizde ise kıvrımlı bir eğrinin gerçek [[arc-length|yay uzunluğunu]] buluruz!`,
        en: R`The true engineering superpower of integration is <b>"Slice Thinly → Measure One Slice → Sum All Slices (\(\int\))"</b>! Summing vertical ribbons gives the <b>area between curves</b>, stacking circular coins (disks or washers) yields [[solid-of-revolution|3D solids of revolution]], and chaining tiny right-triangle hypotenuses yields exact [[arc-length|arc length]]!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> kesişen eğriler arasında alan hesaplarken işareti nasıl koruyacağınızı bilecek, 3B dönel cisimleri döndürerek disk (\(\pi R^2\)) ve halka (\(\pi(R^2 - r^2)\)) kesitlerini canlı inceleyecek, yay uzunluğu integralini Pisagor'dan türetip kullanabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will safely split areas at curve intersections, orbit 3D solids of revolution with live disk (\(\pi R^2\)) and washer (\(\pi(R^2 - r^2)\)) slices, compute average values, and derive arc length directly from Pythagoras.`,
      },
    ],
    analogy: {
      title: { tr: "Çömlekçi çarkında kil döndürmek ve kıvrımlı yolu şerit metreyle ölçmek", en: "Spinning clay on a pottery wheel & measuring a trail with tiny rulers" },
      text: {
        tr: R`Bir çömlekçi çarkında eğri bir profili \(360^\circ\) döndürdüğünüzde simetrik bir vazo oluşur. Bu vazonun hacmini bulmak için onu bir ekmek somunu gibi kağıt inceliğinde madeni paralara (disklere) dilimlediğinizi hayal edin: her paranın hacmi \(\pi R(x)^2\,dx\)'tir ve integral sadece tüm paraları üst üste toplar! Kıvrımlı bir dağ yolunun uzunluğunu ölçmek içinse yolu minik düz cetvellerle (\(\sqrt{dx^2 + dy^2}\)) kaplayıp toplarız!`,
        en: R`Spinning a clay curve \(360^\circ\) on a pottery wheel shapes a symmetric vase. To measure its volume, imagine slicing the vase like a loaf of bread into paper-thin circular coins of radius \(R(x)\): each coin has volume \(\pi R(x)^2\,dx\), and the integral simply stacks all coins! To measure a winding mountain road, we lay tiny straight rulers (\(\sqrt{dx^2 + dy^2}\)) end-to-end and add them up!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 20 · Belirli İntegral Uygulamaları", en: "Lecture 20 · Applications of Definite Integrals" }],
      [{ tr: "Alan & Ortalama", en: "Area & Average" }, { tr: R`\(A = \int_a^b |f(x)-g(x)|\,dx,\quad \bar f = \frac{1}{b-a}\int_a^b f(x)\,dx\)`, en: R`\(A = \int_a^b |f(x)-g(x)|\,dx,\quad \bar f = \frac{1}{b-a}\int_a^b f(x)\,dx\)` }],
      [{ tr: "Disk/Halka & Yay", en: "Disk/Washer & Arc" }, { tr: R`\(V = \pi\int_a^b(R^2 - r^2)\,dx,\quad L = \int_a^b\sqrt{1 + [f'(x)]^2}\,dx\)`, en: R`\(V = \pi\int_a^b(R^2 - r^2)\,dx,\quad L = \int_a^b\sqrt{1 + [f'(x)]^2}\,dx\)` }],
    ],
    tip: {
      title: { tr: "Her soruda ilk 10 saniye kuralı", en: "The 10-second sketch rule" },
      text: {
        tr: R`İntegrali yazmadan önce mutlaka küçük bir taslak çizin! Taslak size üç kritik sorunun cevabını anında verir: (1) Hangi eğri üstte? (2) Eğriler aralık içinde kesişiyor mu? (3) Cisim dolu bir disk mi yoksa içi oyuk bir halka mı?`,
        en: R`Always draw a quick 10-second sketch before writing an integral! It instantly answers three vital questions: (1) Which curve is on top? (2) Do they cross inside \([a, b]\)? (3) Is the solid a filled disk or a hollow washer?`,
      },
    },
  },
  sections: [
    {
      id: "ia-area",
      mathId: "m-ia-area",
      title: { tr: "İki Eğri Arasındaki Alan, Kesişim Noktaları ve Ortalama Değer", en: "Area Between Two Curves, Crossings & Average Value" },
      body: [
        {
          tr: R`İki eğri arasındaki bir bölgeyi ince dikey şeritlere böldüğünüzde, herhangi bir \(x\) konumundaki şeridin yüksekliği daima <b>(üstteki eğri − alttaki eğri)</b>, yani \(f(x) - g(x)\) olur. Üstelik bu formül eğrilerin ikisi de \(x\)-ekseninin altında kalsa bile aynen çalışır! Ancak eğriler aralık içinde <b>kesişip yer değiştiriyorsa</b>, kesişim noktasında integrali mutlaka ikiye bölmeniz gerekir.`,
          en: R`Slice a region between two curves into thin vertical strips: at any \(x\), the strip's height is simply <b>(top curve − bottom curve)</b> \(= f(x) - g(x)\), which works even when both curves dip below the \(x\)-axis! However, if the curves <b>cross and swap places</b> inside \([a, b]\), you MUST split the integral at the intersection point.`,
        },
        {
          analogy: {
            title: { tr: "Bir fonksiyonun ortalama değeri: dalgalı suyu düzleştirmek", en: "Average value: leveling choppy water flat" },
            text: {
              tr: R`Bir akvaryumdaki su dalgalı bir \(y = f(x)\) eğrisi gibi yükselip alçalıyor olsun. Dalgaları durdurup suyu tamamen dümdüz yatay bir seviyeye \(\bar f\) getirdiğinizde suyun toplam alanı (hacmi) değişmez: \(\bar f \cdot (b - a) = \int_a^b f(x)\,dx\)! İşte ortalama değer budur.`,
              en: R`Imagine sloshing water inside a fish tank forming a curve \(y = f(x)\). When the waves settle completely flat at height \(\bar f\), the total area stays identical: \(\bar f \cdot (b - a) = \int_a^b f(x)\,dx\)! That flat water level is the average value.`,
            },
          },
        },
        { eq: R`A = \int_a^b \big|f(x) - g(x)\big|\,dx, \qquad \bar f = \frac{1}{b - a}\int_a^b f(x)\,dx` },
        {
          example: {
            title: { tr: "Kesişim noktalarını bulup iki eğri arası alanı hesaplamak", en: "Finding intersections & computing enclosed area" },
            problem: {
              tr: R`\(y = x + 2\) doğrusu ile \(y = x^2\) parabolünün çevrelediği kapalı bölgenin alanını bulun.`,
              en: R`Find the area of the closed region bounded by the line \(y = x + 2\) and the parabola \(y = x^2\).`,
            },
            steps: [
              {
                expr: R`x^2 = x + 2 \implies x^2 - x - 2 = 0 \implies (x - 2)(x + 1) = 0 \implies x = -1,\; x = 2`,
                note: { tr: "Önce iki eğriyi birbirine eşitleyerek bölgenin sol (−1) ve sağ (2) sınırlarını bulduk.", en: "Set the two curves equal to find the left (−1) and right (2) intersection points." },
              },
              {
                expr: R`x = 0 \text{ testi: } y_{\text{doğru}} = 2 > y_{\text{parabol}} = 0 \implies \text{Üstte } x + 2`,
                note: { tr: "Aralıktan bir test noktası (x = 0) seçerek hangisinin üstte olduğunu doğruladık.", en: "Test one interior point (x = 0) to confirm the line sits above the parabola." },
              },
              {
                expr: R`A = \int_{-1}^{2} (x + 2 - x^2)\,dx = \left[\frac{x^2}{2} + 2x - \frac{x^3}{3}\right]_{-1}^{2} = \left(2 + 4 - \frac{8}{3}\right) - \left(\frac{1}{2} - 2 + \frac{1}{3}\right) = \frac{10}{3} + \frac{7}{6} = \frac{9}{2}`,
                note: { tr: "Üst eğriden alt eğriyi çıkarıp FTC ile hesapladık: tam 4,5 birim kare!", en: "Integrate (top − bottom) via FTC to get exact area 4.5!" },
              },
            ],
            answer: { tr: R`\(A = \dfrac{9}{2} = 4{,}5\)`, en: R`\(A = \dfrac{9}{2} = 4.5\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "Kesişen eğrilerde integrali bölmemek alanları birbirinden çıkarır!", en: "Forgetting to split at a crossing subtracts regions instead of adding!" },
            text: {
              tr: R`\(y = x\) ve \(y = x^2\) eğrileri \(x = 1\)'de kesişir. \([0, 2]\) üzerinde bölmeden \(\int_0^2 (x - x^2)\,dx = -\frac{2}{3}\) alırsanız, \([0, 1]\)'deki \(+\frac{1}{6}\) ile \([1, 2]\)'deki \(-\frac{5}{6}\) birbirinden çıkarılır! Oysa gerçek alan \(\frac{1}{6} + \frac{5}{6} = 1\)'dir.`,
              en: R`The curves \(y = x\) and \(y = x^2\) cross at \(x = 1\). Computing \(\int_0^2 (x - x^2)\,dx = -\frac{2}{3}\) blindly subtracts the second piece (\(\frac{5}{6}\)) from the first (\(\frac{1}{6}\))! Splitting gives the true geometric area \(\frac{1}{6} + \frac{5}{6} = 1\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"Yaprak: a√x vs x²"</b> modunda \(a\) kaydırıcısını oynatarak kesişim noktasının ve mavi yaprak alanının nasıl büyüdüğünü görün.`, en: R`In <b>"Leaf: a√x vs x²"</b> mode, slide \(a\) to watch the intersection point and blue leaf area resize live.` },
            { tr: R`<b>"Kesişme Tuzağı: x vs x²"</b> moduna geçip \(b = 2\) yapın: mavi \([0, 1]\) bölgesi ile turuncu \([1, 2]\) bölgesini karşılaştırın — işaretli integral \(-\frac{2}{3}\) çıkarken gerçek geometrik alan tam \(1\) çıkar!`, en: R`Switch to <b>"Crossing Trap: x vs x²"</b> and set \(b = 2\): compare blue \([0, 1]\) vs orange \([1, 2]\) — the signed integral is \(-\frac{2}{3}\) while the true geometric area is exact \(1\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.area ??= { mode: "leaf", a: 1.5, b: 1.8 });
        const ctl = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 255 });

        const draw = () => {
          if (s.mode === "leaf") {
            const f = (x) => (x >= 0 ? s.a * Math.sqrt(x) : NaN);
            const g = (x) => x * x;
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
          } else {
            const f = (x) => x;
            const g = (x) => x * x;
            const split = Math.min(1, s.b);
            const signed = simpson((x) => f(x) - g(x), 0, s.b, 120);
            const geom = simpson((x) => Math.abs(f(x) - g(x)), 0, split, 80) + (s.b > 1 ? simpson((x) => Math.abs(f(x) - g(x)), 1, s.b, 80) : 0);
            const areas = [{ f, g, from: 0, to: split, fill: "rgba(42,120,214,0.24)" }];
            if (s.b > 1) areas.push({ f: g, g: f, from: 1, to: s.b, fill: "rgba(235,104,52,0.26)" });
            plot.draw({
              x: [-0.2, 2.3], y: [-0.2, 4.4], xLabel: "x", yLabel: "y",
              areas,
              lines: [{ a: 1, b: 0, c: -s.b, color: COLORS.muted, dash: [4, 3] }],
              curves: [
                { f, color: COLORS.c1, width: 2.5 },
                { f: g, color: COLORS.c2, width: 2.5 },
              ],
              points: [{ x: 1, y: 1, color: COLORS.c3, r: 5.5, ring: true, label: "(1, 1)" }],
            });
            const sLbl = L({ tr: "\\text{İşaretli}", en: "\\text{Signed}" });
            const gLbl = L({ tr: "\\text{Gerçek Alan}", en: "\\text{True Area}" });
            calc.textContent = `\\(${sLbl} = \\int_0^{${tx(s.b, 1)}}(x - x^2)\\,dx = ${tx(signed, 3)},\\qquad ${gLbl} = \\int_0^{${tx(s.b, 1)}}|x - x^2|\\,dx = ${tx(geom, 3)}\\)`;
          }
        };

        const renderControls = () => {
          ctl2.replaceChildren(
            s.mode === "leaf"
              ? slider("a", { min: 0.6, max: 2.4, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } })
              : slider("b", { min: 0.6, max: 2.0, step: 0.1, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
          );
        };

        ctl.append(
          segmented(
            [
              ["leaf", { tr: "Yaprak: a√x vs x²", en: "Leaf: a√x vs x²" }],
              ["cross", { tr: "Kesişme Tuzağı: x vs x²", en: "Crossing Trap: x vs x²" }],
            ],
            s.mode,
            (v) => { s.mode = v; renderControls(); draw(); },
          ),
        );
        renderControls();
        draw();
      },
    },
    {
      id: "ia-revolution",
      mathId: "m-ia-vol",
      title: { tr: "3B Dönel Cisim Hacmi: Disk ve Halka (Washer) Yöntemi", en: "3D Solids of Revolution: Disk & Washer Methods" },
      body: [
        {
          tr: R`Bir \(y = R(x)\) eğrisinin altındaki alanı \(x\)-ekseni etrafında \(360^\circ\) döndürdüğümüzde 3 boyutlu bir <b>dönel cisim</b> oluşur. Bu cismi herhangi bir \(x\) konumunda bıçakla dik kestiğinizde:<br>• Cisim doluysa kesit, yarıçapı \(R(x)\) ve alanı \(\pi [R(x)]^2\) olan dairesel bir <b>disk</b>tir.<br>• Ortada \(r(x)\) yarıçaplı bir boşluk varsa kesit, büyük daireden küçük dairenin çıkarıldığı \(\pi\big([R(x)]^2 - [r(x)]^2\big)\) alanlı bir <b>halka (washer)</b>dır!`,
          en: R`Revolving a region around the \(x\)-axis by \(360^\circ\) creates a 3D <b>solid of revolution</b>. Slice it perpendicular to the \(x\)-axis at any \(x\):<br>• If solid, the cross-section is a circular <b>disk</b> of radius \(R(x)\) and area \(\pi [R(x)]^2\).<br>• If hollow with inner radius \(r(x)\), the cross-section is a flat ring — a <b>washer</b> — with area big circle minus small circle: \(\pi\big([R(x)]^2 - [r(x)]^2\big)\)!`,
        },
        {
          analogy: {
            title: { tr: "Havuç dilimi (Disk) vs Ananas halkası (Washer)", en: "Carrot slice (Disk) vs Pineapple ring (Washer)" },
            text: {
              tr: R`Bir havucu doğradığınızda her dilim içi dolu bir dairedir (\(\pi R^2\)). İçi oyulmuş bir ananası dilimlediğinizde ise her dilim ortası delik bir halkadır (\(\pi R^2 - \pi r^2\))! İntegral, \(a\)'dan \(b\)'ye kadar tüm bu ince dilimlerin hacimlerini tek tek üst üste yığar.`,
              en: R`Slicing a solid carrot gives circular disks (\(\pi R^2\)). Slicing a cored pineapple gives flat washers (\(\pi R^2 - \pi r^2\))! Integration simply adds up the volumes of all those thin slices from \(a\) to \(b\).`,
            },
          },
        },
        { eq: R`V = \pi \int_a^b \Big([R(x)]^2 - [r(x)]^2\Big)\,dx` },
        {
          example: {
            title: { tr: "İçi oyuk halka (Washer) hacmi — silindirden koni oymak!", en: "Washer volume — carving a cone out of a cylinder!" },
            problem: {
              tr: R`\([0, 2]\) üzerinde dış sınır \(y = 2\) ile iç sınır \(y = x\) arasındaki bölge \(x\)-ekseni etrafında döndürülürse hacim kaç olur?`,
              en: R`Revolve the region between outer \(y = 2\) and inner \(y = x\) on \([0, 2]\) around the \(x\)-axis. Find the volume.`,
            },
            steps: [
              {
                expr: R`R(x) = 2 \;\;(\text{dış / outer}), \qquad r(x) = x \;\;(\text{iç / inner})`,
                note: { tr: "Her x konumunda eksenden en uzak eğri R(x) = 2, en yakın eğri r(x) = x'tir.", en: "At every x, the outer radius is R(x) = 2 and the inner hole radius is r(x) = x." },
              },
              {
                expr: R`A(x) = \pi\big(R(x)^2 - r(x)^2\big) = \pi(4 - x^2)`,
                note: { tr: "Önce her yarıçapın KARESİNİ alıp sonra çıkardık!", en: "Square EACH radius first, THEN subtract!" },
              },
              {
                expr: R`V = \pi\int_0^2 (4 - x^2)\,dx = \pi\left[4x - \frac{x^3}{3}\right]_0^2 = \pi\left(8 - \frac{8}{3}\right) = \frac{16\pi}{3}`,
                note: { tr: "Geometrik kontrol: Silindir (π·2²·2 = 8π) eksi Koni (⅓·8π) = 16π/3 — birebir tuttu!", en: "Geometry sanity check: Cylinder (8π) minus Cone (8π/3) = 16π/3 — exact match!" },
              },
            ],
            answer: { tr: R`\(V = \dfrac{16\pi}{3} \approx 16{,}76\)`, en: R`\(V = \dfrac{16\pi}{3} \approx 16.76\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "En meşhur tuzak: π(R − r)² YANLIŞTIR — doğrusu π(R² − r²)!", en: "Most famous trap: π(R − r)² is WRONG — always use π(R² − r²)!" },
            text: {
              tr: R`Dış yarıçap \(R = 3\), iç yarıçap \(r = 1\) olan bir halkanın alanı büyük daire (\(9\pi\)) eksi küçük daire (\(1\pi\)) = <b>\(8\pi\)</b>'dir. Eğer yanlışlıkla \(\pi(3 - 1)^2 = 4\pi\) yazarsanız hacmin yarısını kaybedersiniz!`,
              en: R`For a ring with outer \(R = 3\) and inner \(r = 1\), the true area is big disk (\(9\pi\)) minus hole (\(1\pi\)) = <b>\(8\pi\)</b>. Writing \(\pi(3 - 1)^2 = 4\pi\) loses half the true volume!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`3B cismi fare/parmakla <b>sürükleyip döndürün</b> (veya üstteki <b>XY / XZ / 3D</b> açı tuşlarına basın)!`, en: R`<b>Drag to orbit</b> the 3D solid (or click the <b>3D / XY / XZ</b> camera presets)!` },
            { tr: R`<b>\(x_0\)</b> dilim kaydırıcısını oynatarak turuncu kesitin cisim boyunca nasıl daralıp genişlediğini ve anlık kesit alanı \(A(x_0)\)'ın değişimini izleyin.`, en: R`Slide the <b>\(x_0\)</b> cross-section slice along the axis and watch the live orange slice area \(A(x_0)\) expand and contract.` },
            { tr: R`<b>"Halka (Washer)"</b> seçip \(x_0\)'ı büyütün: içteki koni deliği genişledikçe halka kesitinin nasıl inceldiğini görün!`, en: R`Pick <b>"Washer"</b> and increase \(x_0\): watch the inner circular hole grow larger as the orange ring narrows!` },
          ],
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
          const sx = Math.min(sh.b, s.slice);
          const rOut = sh.R(sx);
          const rIn = sh.r ? sh.r(sx) : 0;
          const sliceArea = Math.PI * (rOut * rOut - rIn * rIn);
          const vol = Math.PI * simpson((x) => sh.R(x) ** 2 - (sh.r ? sh.r(x) ** 2 : 0), sh.a, sh.b, 120);
          view3d.draw({
            range: 3.6,
            revolution: { R: sh.R, r: sh.r || undefined, a: sh.a, b: sh.b, sliceX: sx, color: COLORS.c1 },
          });
          calc.textContent = `\\(A(${tx(sx, 1)}) = \\pi(${tx(rOut, 2)}^2${sh.r ? ` - ${tx(rIn, 2)}^2` : ""}) = ${tx(sliceArea, 2)},\\qquad V = ${tx(vol, 3)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(shapes).map(([k, v]) => [k, v.label]), s.shape, (v) => { s.shape = v; draw(); }),
          slider("x₀", { min: 0.1, max: 2.8, step: 0.1, value: s.slice, onInput: (v) => { s.slice = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "ia-arclength",
      mathId: "m-ia-arclength",
      title: { tr: "Yay Uzunluğu: Pisagor'dan Eğri Mesafesine", en: "Arc Length: Curve Distance from Pythagoras" },
      body: [
        {
          tr: R`Kıvrımlı bir \(y = f(x)\) eğrisini esnek bir ip gibi düşünüp düzleştirdiğimizde boyu ne kadar olur? Eğriyi \(n\) tane minik düz doğru parçasına (kirişe) böleriz. Her minik adımda yatayda \(dx\), dikeyde \(dy \approx f'(x)\,dx\) ilerleriz. Pisagor teoremi tek bir minik adımın hipotenüsünü hemen verir: \(ds = \sqrt{dx^2 + dy^2} = \sqrt{1 + [f'(x)]^2}\,dx\)!`,
          en: R`Imagine straightening a curved wire \(y = f(x)\) to measure its length. Chop the curve into \(n\) tiny straight chords: each step moves horizontally by \(dx\) and vertically by \(dy \approx f'(x)\,dx\). By Pythagoras, one tiny chord has hypotenuse \(ds = \sqrt{dx^2 + dy^2} = \sqrt{1 + [f'(x)]^2}\,dx\)!`,
        },
        {
          analogy: {
            title: { tr: "Dağ yürüyüşündeki GPS takip cihazı", en: "A GPS tracker on a winding hiking trail" },
            text: {
              tr: R`Akıllı saatiniz konumunuzu yalnızca 10 dakikada bir kaydederse kıvrımlı patikayı kaba düz çizgilerle birleştirir ve gerçek mesafeden <b>kısa</b> ölçer! Kayıt sıklığını saniyede bire (\(n \to \infty\)) çıkardığınızda kırık çizgi patikaya tam yapışır ve gerçek yay uzunluğuna ulaşır.`,
              en: R`If your smartwatch pings GPS only once every 10 minutes, it connects distant points with straight shortcuts and <b>underestimates</b> the trail! Increase the ping frequency (\(n \to \infty\)) and the polygonal chain hugs the true arc length.`,
            },
          },
        },
        { eq: R`ds = \sqrt{dx^2 + dy^2} = \sqrt{1 + [f'(x)]^2}\,dx \implies L = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx` },
        {
          example: {
            title: { tr: "Yay uzunluğu formülünü düz doğruda Pisagor'la doğrulamak", en: "Sanity-checking arc length on a straight line via Pythagoras" },
            problem: {
              tr: R`\(y = 2x + 1\) doğrusunun \([0, 3]\) aralığındaki yay uzunluğunu integral formülüyle bulup Pisagor'la kontrol edin.`,
              en: R`Compute the arc length of \(y = 2x + 1\) on \([0, 3]\) via the integral formula and verify with Pythagoras.`,
            },
            steps: [
              {
                expr: R`f'(x) = 2 \implies 1 + [f'(x)]^2 = 1 + 2^2 = 5`,
                note: { tr: "Önce türevi bulduk, karesini aldık ve 1 ekledik.", en: "Differentiate, square the slope, and add 1." },
              },
              {
                expr: R`L = \int_0^3 \sqrt{5}\,dx = 3\sqrt{5} \approx 6{,}708`,
                note: { tr: "Sabit √5'in [0, 3] üzerindeki integrali 3√5'tir.", en: "Integrating the constant √5 across [0, 3] gives 3√5." },
              },
              {
                expr: R`\text{Pisagor / Pythagoras: } \sqrt{\Delta x^2 + \Delta y^2} = \sqrt{3^2 + 6^2} = \sqrt{45} = 3\sqrt{5} \;\checkmark`,
                note: { tr: "Başlangıç (0, 1) ile bitiş (3, 7) arasındaki doğrudan mesafe birebir aynı çıktı!", en: "Direct distance from (0, 1) to (3, 7) matches identically!" },
              },
            ],
            answer: { tr: R`\(L = 3\sqrt{5} \approx 6{,}708\)`, en: R`\(L = 3\sqrt{5} \approx 6.708\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "√(1 + [f'(x)]²) ifadesini 1 + f'(x) diye dışarı çıkarmak!", en: "Never simplify √(1 + [f'(x)]²) to 1 + f'(x)!" },
            text: {
              tr: R`Karekök toplamın üzerine dağılmaz (\(\sqrt{1 + 4} = \sqrt{5} \ne 1 + 2 = 3\))! Ayrıca karekökün içindeki "\(1 +\)" terimini veya \(f'(x)\)'in karesini unutmayın.`,
              en: R`Square roots never split over addition (\(\sqrt{1 + 4} = \sqrt{5} \ne 1 + 2 = 3\))! Never drop the "\(1 +\)" or forget to square \(f'(x)\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>sin(x) [0, π]</b> eğrisinde \(n = 1\) yapın: tek doğru parçası \((0, 0)\)'dan \((\pi, 0)\)'a gider (\(L_1 = 3{,}142\)), oysa gerçek yay uzunluğu \(3{,}820\)'dir!`, en: R`On <b>sin(x) [0, π]</b>, drop \(n = 1\): one straight chord runs flat from \((0, 0)\) to \((\pi, 0)\) (\(L_1 = 3.142\)), far shorter than exact \(3.820\)!` },
            { tr: R`\(n\) kaydırıcısını \(24\)'e kadar artırın: turuncu kırık çizginin uzunluğu \(L_n\) her zaman gerçek \(L\)'nin <b>altından</b> gelerek kesin değere yapışır!`, en: R`Slide \(n\) up to \(24\): watch the orange polygonal length \(L_n\) always climb <b>from below</b> straight into exact \(L\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.arc ??= { fn: "sin", n: 4 });
        const fns = {
          sin: { label: "sin(x) [0, π]", f: (x) => Math.sin(x), a: 0, b: Math.PI, yr: [-0.2, 1.35] },
          parab: { label: "0.5x² [0, 2]", f: (x) => 0.5 * x * x, a: 0, b: 2, yr: [-0.2, 2.35] },
          cosh: { label: "cosh(x) [−1, 1]", f: (x) => Math.cosh(x), a: -1, b: 1, yr: [0.5, 1.9] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 250 });

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
          const exLbl = L({ tr: "\\text{Kesin } L", en: "\\text{Exact } L" });
          const errLbl = L({ tr: "\\text{Fark}", en: "\\text{Diff}" });
          calc.textContent = `\\(L_{${s.n}} = ${tx(polyLen, 4)},\\qquad ${exLbl} = ${tx(exact, 4)},\\qquad ${errLbl} = ${tx(Math.abs(exact - polyLen), 4)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("n", { min: 1, max: 24, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "3B Dönel Cisim Tasarım ve Geometri Stüdyosu", en: "3D Solid of Revolution & Geometry Studio" },
    sub: {
      tr: R`Kendi 3B vazonuzu veya halka borunuzu tasarlayın! Dış profil \(R(x) = a + b\sin(2x)\), iç delik yarıçapı \(r\) ve uzunluk \(H\) parametrelerini oynatarak <b>3B Hacim</b>, <b>Kesit Alanı</b>, <b>Ortalama Yarıçap</b> ve <b>Profil Yay Uzunluğu</b> büyüklüklerinin hepsini aynı anda izleyin!`,
      en: R`Sculpt your own 3D vase or hollow pipe! Adjust outer profile \(R(x) = a + b\sin(2x)\), inner bore radius \(r\), and length \(H\) to see <b>3D Volume</b>, <b>Slice Area</b>, <b>Average Radius</b>, and <b>Profile Arc Length</b> update live!`,
    },
    experiments: [
      { tr: R`<b>"Silindir (b=0, r=0)"</b> önayarına tıklayın: \(R = 1{,}2, H = 3\) için hacmin lise formülü \(\pi R^2 H = \pi(1{,}44)(3) \approx 13{,}57\) ile birebir tuttuğunu kontrol edin!`, en: R`Click <b>"Cylinder (b=0, r=0)"</b>: check that volume matches \(\pi R^2 H = \pi(1.44)(3) \approx 13.57\) exactly!` },
      { tr: R`<b>"Dalgalı Vazo"</b> önayarında dalga genliği \(b\)'yi \(0\)'dan \(0{,}6\)'ya çıkarın: ortalama yarıçap neredeyse değişmese bile <b>3B hacmin ve yay uzunluğunun arttığını</b> fark edin (çünkü kare almak \(R^2\) büyük tepeleri daha çok büyütür!).`, en: R`In <b>"Wavy Vase"</b>, raise wave amplitude \(b\) from \(0\) to \(0.6\): notice both <b>volume and arc length increase</b> even when average radius barely changes (squaring \(R^2\) boosts bulges more than dips shrink!).` },
      { tr: R`<b>"İçi Boş Boru"</b> önayarında \(r = 0{,}8\) iken \(r\)'yi artırıp \(a\)'ya yaklaştırın: halka kesiti inceldikçe hacmin hızla sıfıra yaklaştığını görün.`, en: R`In <b>"Hollow Pipe"</b>, increase inner bore \(r\) toward outer radius \(a\) and watch the washer thin out as volume drops toward zero.` },
      { tr: R`<b>\(x_0\)</b> dilimini vazonun en şişkin ve en dar noktalarına sürükleyerek anlık kesit alanı \(A(x_0)\) kutucuğundaki maksimum ve minimum değerleri yakalayın!`, en: R`Slide <b>\(x_0\)</b> to the widest bulge and narrowest waist of the vase to spot the maximum and minimum slice areas \(A(x_0)\)!` },
    ],
    build(host, state) {
      const s = (state.pg ??= { a: 1.2, b: 0.4, r: 0, H: 3.0, slice: 1.0 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const view3d = createCanvas3D(stage, { height: 390 });
      const presets = h("div", { class: "t-controls" });
      const ctl1 = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(presets, ctl1, ctl2, tiles, calc);

      let aSl, bSl, rSl, hSl, xSl;

      const draw = () => {
        const Rfn = (x) => Math.max(0.15, s.a + s.b * Math.sin(2 * x));
        const rInnerVal = Math.min(s.r, Math.max(0, s.a - Math.abs(s.b) - 0.05));
        const rFn = rInnerVal > 0.02 ? () => rInnerVal : null;
        const sx = Math.min(s.H, s.slice);
        const rOutAt = Rfn(sx);
        const sliceArea = Math.PI * (rOutAt * rOutAt - rInnerVal * rInnerVal);
        const vol = Math.PI * simpson((x) => Rfn(x) ** 2 - rInnerVal * rInnerVal, 0, s.H, 120);
        const avgR = simpson(Rfn, 0, s.H, 100) / s.H;
        const arcLen = simpson((x) => Math.sqrt(1 + numDiff(Rfn, x) ** 2), 0, s.H, 140);

        view3d.draw({
          range: 3.8,
          revolution: { R: Rfn, r: rFn || undefined, a: 0, b: s.H, sliceX: sx, color: COLORS.c1 },
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "3B Hacim V", en: "3D Volume V" }) }), h("span", { class: "pg-tile-value", text: ns(vol, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Kesit A(x₀)", en: "Slice A(x₀)" }) }), h("span", { class: "pg-tile-value", text: ns(sliceArea, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Ort. R̄", en: "Avg R̄" }) }), h("span", { class: "pg-tile-value", text: ns(avgR, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Yay L", en: "Arc L" }) }), h("span", { class: "pg-tile-value", text: ns(arcLen, 3) })),
        );
        calc.textContent = `\\(R(x) = ${tx(s.a, 1)} + ${tx(s.b, 1)}\\sin(2x),\\quad r = ${tx(rInnerVal, 2)},\\quad [0, ${tx(s.H, 1)}]\\)`;
      };

      const applyPreset = (a, b, r, H, slice) => {
        s.a = a; s.b = b; s.r = r; s.H = H; s.slice = slice;
        aSl.set(a); bSl.set(b); rSl.set(r); hSl.set(H); xSl.set(slice);
        draw();
      };

      const presetDefs = [
        [{ tr: "Silindir", en: "Cylinder" }, 1.2, 0, 0, 3.0, 1.5],
        [{ tr: "Dalgalı Vazo", en: "Wavy Vase" }, 1.2, 0.45, 0, 3.0, 0.8],
        [{ tr: "İçi Boş Boru", en: "Hollow Pipe" }, 1.4, 0, 0.8, 2.8, 1.4],
        [{ tr: "İnce Kadeh", en: "Sculpted Goblet" }, 1.0, 0.5, 0.3, 3.2, 2.4],
      ];
      for (const [lbl, a, b, r, H, sl] of presetDefs) {
        const btn = h("button", { type: "button", class: "btn small", text: L(lbl) });
        btn.addEventListener("click", () => applyPreset(a, b, r, H, sl));
        presets.append(btn);
      }

      aSl = slider("a (R₀)", { min: 0.7, max: 1.8, step: 0.1, value: s.a, onInput: (v) => { s.a = v; draw(); } });
      bSl = slider("b (dalga)", { min: 0, max: 0.6, step: 0.05, value: s.b, onInput: (v) => { s.b = v; draw(); } });
      rSl = slider("r (iç delik)", { min: 0, max: 1.0, step: 0.1, value: s.r, onInput: (v) => { s.r = v; draw(); } });
      hSl = slider("H (boy)", { min: 1.5, max: 3.4, step: 0.2, value: s.H, onInput: (v) => { s.H = v; draw(); } });
      xSl = slider("x₀ (dilim)", { min: 0.1, max: 3.2, step: 0.1, value: s.slice, onInput: (v) => { s.slice = v; draw(); } });
      ctl1.append(aSl, bSl, rSl);
      ctl2.append(hSl, xSl);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-ia-area",
      title: { tr: "Eğriler Arası Alan ve İntegrallerin Ortalama Değer Teoremi", en: "Area Between Curves & Mean Value Theorem for Integrals" },
      blocks: [
        {
          p: {
            tr: R`\([a, b]\) üzerinde sürekli \(f\) fonksiyonu için \(\bar f = \frac{1}{b-a}\int_a^b f(x)\,dx\) ortalama değerdir. <b>İntegrallerin Ortalama Değer Teoremi</b>, sürekli bir eğrinin bu ortalama yüksekliği aralıktaki en az bir \(c \in [a, b]\) noktasında mutlaka aldığını (\(f(c) = \bar f\)) garanti eder!`,
            en: R`For continuous \(f\) on \([a, b]\), the average value is \(\bar f = \frac{1}{b-a}\int_a^b f(x)\,dx\). The <b>Mean Value Theorem for Integrals</b> guarantees some point \(c \in [a, b]\) hits this exact average height: \(f(c) = \bar f\).`,
          },
        },
        { eq: R`A = \int_a^b |f(x) - g(x)|\,dx, \qquad \exists\, c \in [a, b]:\; f(c) = \frac{1}{b - a}\int_a^b f(x)\,dx` },
        {
          example: {
            title: { tr: "Kesişen iki eğri arasındaki gerçek alanı bölmek", en: "Splitting true area across a crossing point" },
            problem: {
              tr: R`\(y = x\) ve \(y = x^2\) eğrileri arasında \([0, 2]\) aralığında kalan toplam geometrik alanı hesaplayın.`,
              en: R`Compute the total geometric area between \(y = x\) and \(y = x^2\) on \([0, 2]\).`,
            },
            steps: [
              {
                expr: R`x = x^2 \implies x = 0 \text{ ve } x = 1 \quad (\text{aralık içindeki kesişim!})`,
                note: { tr: "[0, 1]'de x ≥ x², [1, 2]'de ise x² ≥ x olur — bu yüzden integrali x = 1'den böleriz.", en: "x ≥ x² on [0, 1] and x² ≥ x on [1, 2], so split at x = 1." },
              },
              {
                expr: R`A = \int_0^1 (x - x^2)\,dx + \int_1^2 (x^2 - x)\,dx = \frac{1}{6} + \frac{5}{6} = 1`,
                note: { tr: "İki pozitif alanın toplamı tam olarak 1 çıkar!", en: "The two positive pieces sum to exact 1!" },
              },
            ],
            answer: { tr: R`\(A = 1\)`, en: R`\(A = 1\)` },
          },
        },
      ],
    },
    {
      id: "m-ia-vol",
      title: { tr: "Dönel Hacim Formülleri (Disk, Halka, Kabuk) ve Koni İspatı", en: "Volume Formulas (Disk, Washer, Shell) & Cone Derivation" },
      blocks: [
        {
          table: {
            head: [{ tr: "Yöntem", en: "Method" }, { tr: "Eksen & Şekil", en: "Axis & Shape" }, { tr: "Hacim Formülü", en: "Volume Formula" }],
            rows: [
              [{ tr: "Disk (dolu)", en: "Disk (solid)" }, { tr: R`\(x\)-ekseni etrafında \(y = R(x)\)`, en: R`\(y = R(x)\) around \(x\)-axis` }, R`\(V = \pi\int_a^b [R(x)]^2\,dx\)`],
              [{ tr: "Halka (oyuk)", en: "Washer (hollow)" }, { tr: R`\(x\)-ekseni, dış \(R(x)\) / iç \(r(x)\)`, en: R`\(x\)-axis, outer \(R(x)\) / inner \(r(x)\)` }, R`\(V = \pi\int_a^b \big([R(x)]^2 - [r(x)]^2\big)\,dx\)`],
              [{ tr: "Silindirik Kabuk", en: "Cylindrical Shell" }, { tr: R`\(y\)-ekseni etrafında \(y = f(x) \ge 0\)`, en: R`\(y = f(x) \ge 0\) around \(y\)-axis` }, R`\(V = 2\pi\int_a^b x\,f(x)\,dx\)`],
            ],
          },
        },
        {
          derive: {
            title: { tr: "Koni hacmi formülü V = ⅓πr²h neden 1/3 içerir?", en: "Why does a cone's volume V = ⅓πr²h have a factor of 1/3?" },
            steps: [
              {
                tex: R`R(x) = \frac{r}{h}x \quad (0 \le x \le h)`,
                why: { tr: "Orijinden (h, r) noktasına giden doğruyu x-ekseni etrafında döndürünce taban yarıçapı r, yüksekliği h olan tam bir dik koni oluşur!", en: "Revolving the line from (0, 0) to (h, r) around the x-axis sweeps out a right circular cone of radius r and height h!" },
              },
              {
                tex: R`V = \pi \int_0^h \left(\frac{r}{h}x\right)^2 dx = \pi\frac{r^2}{h^2}\int_0^h x^2\,dx`,
                why: { tr: "Disk yöntemini uygularız; sabit r²/h² integralin dışına çıkar.", en: "Apply the disk method and pull the constant r²/h² outside." },
              },
              {
                tex: R`V = \pi\frac{r^2}{h^2}\cdot\left[\frac{x^3}{3}\right]_0^h = \pi\frac{r^2}{h^2}\cdot\frac{h^3}{3} = \frac{1}{3}\pi r^2 h`,
                why: { tr: "İşte ortaokuldan beri ezberlediğimiz gizemli 1/3 çarpanı doğrudan x²'nin integrali x³/3'ten gelir!", en: "The mysterious factor of 1/3 comes directly from integrating x² into x³/3!" },
              },
            ],
          },
        },
        {
          callout: "warn",
          title: { tr: "Halka yönteminde karelerin farkı!", en: "Difference of squares in Washer method!" },
          text: {
            tr: R`Daima \(R(x)^2 - r(x)^2\) yazın, asla \((R(x) - r(x))^2\) değil! Büyük diskin alanından küçük deliğin alanını çıkarıyoruz.`,
            en: R`Always write \(R(x)^2 - r(x)^2\), NEVER \((R(x) - r(x))^2\)! We subtract the inner circle's area from the outer circle's area.`,
          },
        },
      ],
    },
    {
      id: "m-ia-arclength",
      title: { tr: "Yay Uzunluğu Türetmesi ve Çözümlü Örnek", en: "Arc Length Derivation & Worked Example" },
      blocks: [
        {
          derive: {
            title: { tr: "Pisagor + Ortalama Değer Teoremi → ds = √(1 + [f'(x)]²) dx", en: "Pythagoras + MVT → ds = √(1 + [f'(x)]²) dx" },
            steps: [
              {
                tex: R`\Delta s_i = \sqrt{(\Delta x_i)^2 + (\Delta y_i)^2}`,
                why: { tr: "Eğri üzerindeki ardışık iki noktayı birleştiren küçük kirişin uzunluğu Pisagor teoremiyle yazılır.", en: "The length of one tiny chord between consecutive points follows Pythagoras." },
              },
              {
                tex: R`\Delta y_i = f(x_i) - f(x_{i-1}) = f'(c_i)\,\Delta x_i \quad \big(c_i \in (x_{i-1}, x_i)\big)`,
                why: { tr: "Ortalama Değer Teoremi (MVT) sayesinde Δy dikey farkı türev f'(c_i) çarpı Δx olarak yazılır.", en: "By the Mean Value Theorem, Δy equals f'(c_i) times Δx for some interior point c_i." },
              },
              {
                tex: R`\Delta s_i = \sqrt{(\Delta x_i)^2 + [f'(c_i)\,\Delta x_i]^2} = \sqrt{1 + [f'(c_i)]^2}\,\Delta x_i`,
                why: { tr: "Ortak Δx_i > 0 çarpanını karekökün dışına alırız.", en: "Factor out Δx_i > 0 from under the square root." },
              },
              {
                tex: R`L = \lim_{\|P\|\to 0}\sum_{i=1}^{n}\sqrt{1 + [f'(c_i)]^2}\,\Delta x_i = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx`,
                why: { tr: "Riemann toplamının limiti kesin yay uzunluğu integralini verir!", en: "Taking the Riemann limit produces the exact arc length integral!" },
              },
            ],
          },
        },
        {
          example: {
            title: { tr: "Karekökün temiz açıldığı klasik yay uzunluğu sorusu", en: "A classic arc length integral that simplifies cleanly" },
            problem: {
              tr: R`\(f(x) = \frac{2}{3}x^{3/2}\) eğrisinin \([0, 3]\) aralığındaki yay uzunluğunu bulun.`,
              en: R`Find the exact arc length of \(f(x) = \frac{2}{3}x^{3/2}\) on \([0, 3]\).`,
            },
            steps: [
              {
                expr: R`f'(x) = \frac{2}{3}\cdot\frac{3}{2}x^{1/2} = \sqrt{x} \implies [f'(x)]^2 = x`,
                note: { tr: "Katsayı 2/3 özel olarak sadeleşsin diye seçilmiş: türevin karesi sade bir x oldu!", en: "The factor 2/3 cancels cleanly, leaving [f'(x)]² = x!" },
              },
              {
                expr: R`L = \int_0^3 \sqrt{1 + x}\,dx = \left[\frac{2}{3}(1 + x)^{3/2}\right]_0^3 = \frac{2}{3}\big(4^{3/2} - 1^{3/2}\big) = \frac{2}{3}(8 - 1) = \frac{14}{3}`,
                note: { tr: "u = 1 + x dönüşümüyle kök kolayca integre edildi!", en: "Substituting u = 1 + x evaluates the integral cleanly to 14/3!" },
              },
            ],
            answer: { tr: R`\(L = \dfrac{14}{3} \approx 4{,}667\)`, en: R`\(L = \dfrac{14}{3} \approx 4.667\)` },
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
