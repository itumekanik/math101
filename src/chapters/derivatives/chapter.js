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
        tr: R`Bir şeyin <i>tam şu anda</i> ne kadar hızlı değiştiğini nasıl ölçersiniz? [[derivative|Türev]] \(f'(x_0)\) (sesli okunuşu: <i>"\(f\) üssü \(x_0\)"</i> veya Leibniz gösterimiyle \(\frac{df}{dx}\): <i>"\(f\)'nin \(x\)'e göre anlık değişim hızı"</i>), bir eğrinin iki noktasından geçen <b>kirişi</b> \(h \to 0\) limitiyle tam o noktaya dokunan <b>teğet doğrusuna</b> dönüştürür.`,
        en: R`How do you measure how fast something is changing at a <i>single frozen instant</i>? The [[derivative|derivative]] \(f'(x_0)\) (read aloud as <i>"\(f\) prime of \(x_0\)"</i>, or in Leibniz form \(\frac{df}{dx}\): <i>"the instantaneous rate of change of \(f\) with respect to \(x\)"</i>) shrinks a two-point <b>secant line</b> into the one-point <b>tangent line</b> as \(h \to 0\).`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> kirişten teğete geçişi, [[chain-rule|Zincir Kuralını]], \(f, f', f''\) üçlüsüyle [[critical-point|kritik nokta]] ve [[inflection-point|büküm noktası]] analizini, [[mvt|Ortalama Değer Teoremini (MVT)]], [[lhopital|L'Hôpital kuralını]] ve Newton–Raphson kök bulma yöntemini bizzat deneyimleyerek öğreneceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will visualize secant-to-tangent limits, master the [[chain-rule|Chain Rule]], connect \(f, f', f''\) to [[critical-point|extrema]] and [[inflection-point|concavity]], verify the [[mvt|Mean Value Theorem]], apply [[lhopital|L'Hôpital's rule]], and step through Newton–Raphson root finding.`,
      },
    ],
    analogy: {
      title: { tr: "Araba hız göstergesi vs ortalama yolculuk hızı", en: "Car speedometer vs average trip speed" },
      text: {
        tr: R`\(120\text{ km}\) yolu \(2\) saatte gittiyseniz <b>ortalama hızınız</b> \(60\text{ km/sa}\)'tir — bu, başlangıç ile bitişi birleştiren <i>kirişin eğimidir</i>. Ama kırmızı ışıkta \(0\text{ km/sa}\) ile durdunuz, otobanda \(100\text{ km/sa}\)'e çıktınız! Tam belli bir saniyede ibrenin gösterdiği <b>anlık hız</b> ise <b>türevdir</b>: ölçüm süresini \(1\text{ sa} \to 1\text{ dk} \to 0{,}01\text{ sn} \to 0\)'a indirdiğinizde ortalama hız, hız göstergesinin tam değerine kilitlenir!`,
        en: R`Driving \(120\text{ km}\) in \(2\) hours gives an <b>average speed</b> of \(60\text{ km/h}\) — the slope of the <i>secant</i> joining start and finish. Yet at a red light you sat at \(0\text{ km/h}\) and on the highway you cruised at \(100\text{ km/h}\)! The speedometer needle at one exact instant is the <b>derivative</b>: shrink the measurement window from \(1\text{ h} \to 1\text{ min} \to 0.01\text{ s} \to 0\), and average speed locks onto instantaneous speed!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 14+15 · Türevler + Türev Uygulamaları", en: "Lecture 14+15 · Derivatives + Applications" }],
      [{ tr: "Temel tanım", en: "Core definition" }, { tr: R`\(f'(x_0) = \lim_{h \to 0}\frac{f(x_0+h)-f(x_0)}{h}\)`, en: R`\(f'(x_0) = \lim_{h \to 0}\frac{f(x_0+h)-f(x_0)}{h}\)` }],
      [{ tr: "Doğrusal yaklaşım", en: "Linearization" }, { tr: R`\(L(x) = f(a) + f'(a)(x - a)\)`, en: R`\(L(x) = f(a) + f'(a)(x - a)\)` }],
      [{ tr: "Büyük teoremler", en: "Key theorems" }, { tr: "Zincir kuralı, Rolle, Lagrange (MVT), L'Hôpital, Newton", en: "Chain rule, Rolle, Lagrange (MVT), L'Hôpital, Newton" }],
    ],
    tip: {
      title: { tr: "Geometrik anahtar", en: "Geometric key" },
      text: {
        tr: R`\(f'(x) > 0\) → eğri tırmanıyor; \(f'(x) < 0\) → eğri iniyor; \(f'(x) = 0\) → teğet tam yatay! \(f''(x)\) ise eğimin kendisinin ne kadar hızlı değiştiğini (yukarı mı aşağı mı büküldüğünü) söyler.`,
        en: R`\(f'(x) > 0\) → climbing; \(f'(x) < 0\) → falling; \(f'(x) = 0\) → flat horizontal tangent! Meanwhile \(f''(x)\) measures how fast the slope itself changes (upward cup vs downward cap).`,
      },
    },
  },

  sections: [
    {
      id: "der-secant",
      mathId: "m-der-rules",
      title: { tr: "Ortalama Hızdan Anlık Hıza: Kiriş → Teğet", en: "Average Speed to Instant Speed: Secant → Tangent" },
      body: [
        {
          tr: R`Eğri üzerindeki \(x_0\) ve \(x_0 + h\) noktalarını birleştiren doğruya <b>kiriş (sekant)</b> denir; eğimi \(\frac{f(x_0+h) - f(x_0)}{h}\)'dir (dikey değişim bölü yatay değişim). Adım boyu \(h\)'yi sıfıra yaklaştırdıkça ikinci nokta ilk noktaya kayar ve kiriş doğrusu eğriye tam teğet geçen doğruya dönüşür.`,
          en: R`The straight line joining \(x_0\) and \(x_0 + h\) on the curve is a <b>secant line</b> with slope \(\frac{f(x_0+h)-f(x_0)}{h}\) (rise over run). As the gap \(h\) shrinks toward \(0\), the second point glides into the first and the secant rotates smoothly into the <b>tangent line</b>.`,
        },
        {
          note: {
            tr: R`<b>Gösterim notu:</b> \(f'(x)\), \(y'\) ve \(\frac{dy}{dx}\) tamamen aynı kavramı anlatır. \(\frac{dy}{dx}\) kesir gibi görünür ve değişim oranı fikrini ("minik \(dy\) bölü minik \(dx\)") akılda tutmak için harikadır.`,
            en: R`<b>Notation note:</b> \(f'(x)\), \(y'\), and \(\frac{dy}{dx}\) all mean the exact same derivative. Writing \(\frac{dy}{dx}\) reminds you it is a ratio of tiny vertical change to tiny horizontal change.`,
          },
        },
        { eq: R`f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}` },
        {
          example: {
            title: { tr: "Tanımdan türev: f(x) = x² için f'(x) = 2x", en: "Derivative from the definition: f(x) = x² gives f'(x) = 2x" },
            problem: {
              tr: R`\(f(x) = x^2\) fonksiyonunun \(x = 3\) noktasındaki anlık eğimini \(h \to 0\) limitiyle hesaplayın.`,
              en: R`Compute the instantaneous slope of \(f(x) = x^2\) at \(x = 3\) directly from the limit definition.`,
            },
            steps: [
              {
                expr: R`\frac{f(3 + h) - f(3)}{h} = \frac{(3 + h)^2 - 3^2}{h}`,
                note: { tr: R`Önce \(3\) ile \(3 + h\) arasındaki kiriş eğimini (ortalama hızı) yazarız.`, en: R`Write the secant slope (average rate of change) between \(3\) and \(3 + h\).` },
              },
              {
                expr: R`= \frac{(9 + 6h + h^2) - 9}{h} = \frac{6h + h^2}{h} = 6 + h \quad (h \ne 0)`,
                note: { tr: R`Kareyi açarız; \(9\)'lar gider ve ortak \(h\) çarpanı sadeleşir!`, en: R`Expand the square; the \(9\)'s cancel and \(h\) divides cleanly out!` },
              },
              {
                expr: R`f'(3) = \lim_{h \to 0} (6 + h) = 6`,
                note: { tr: R`Artık \(h \to 0\) alınca anlık teğet eğimi \(6\) çıkar (gerçekten \(2 \cdot 3 = 6\)).`, en: R`Taking \(h \to 0\) leaves instantaneous tangent slope \(6\) (matching \(2 \cdot 3 = 6\)).` },
              },
            ],
            answer: { tr: R`\(f'(3) = 6\); yani \((3, 9)\) noktasındaki teğetin eğimi \(6\)'dır.`, en: R`\(f'(3) = 6\); the tangent at \((3, 9)\) has slope \(6\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: Süreklilik = Türevlenebilirlik sanmak", en: "Common mistake: assuming continuous implies differentiable" },
            text: {
              tr: R`Türevli her fonksiyon mutlaka süreklidir, ama <b>tersi doğru değildir!</b> Örneğin \(f(x) = |x - 1|\) her yerde süreklidir ama \(x = 1\)'de keskin bir köşe yapar: soldan eğim \(-1\), sağdan eğim \(+1\)'dir → tek bir teğet çizilemez, türev YOKTUR!`,
              en: R`Differentiable always implies continuous, but <b>not the reverse!</b> The curve \(f(x) = |x - 1|\) is continuous everywhere, yet forms a sharp corner at \(x = 1\): left slope is \(-1\) and right slope is \(+1\), so no unique tangent exists!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>Yumuşak eğri</b> modunda \(h\) kaydırıcısını \(1{,}5\)'ten \(0{,}05\)'e doğru küçültün: turuncu kirişin yeşil kesikli teğetin üzerine tam oturduğunu izleyin.`, en: R`In <b>Smooth curve</b> mode, drag \(h\) from \(1.5\) down to \(0.05\): watch the orange secant lock onto the dashed green tangent.` },
            { tr: R`\(x_0\)'ı kaydırıp eğimin \(0\) olduğu tepe/çukur noktalarını bulun!`, en: R`Slide \(x_0\) to hunt for spots where the tangent becomes completely horizontal (\(f'(x_0) = 0\))!` },
            { tr: R`<b>Keskin köşe |x−1|</b> moduna geçip \(x_0 = 1\) yapın ve \(h\)'yi pozitiften negatife çevirin: sağ kiriş \(+1\), sol kiriş \(-1\) eğimde kilitlenir!`, en: R`Switch to <b>Sharp corner |x−1|</b> at \(x_0 = 1\) and flip \(h\) from positive to negative: right secant stays \(+1\), left stays \(-1\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.sec ??= { kind: "smooth", x0: 1, h: 1.4 });
        const fSmooth = (x) => 0.4 * x * x * x - 0.8 * x + 1;
        const dfSmooth = (x) => 1.2 * x * x - 0.8;
        const fCorner = (x) => Math.abs(x - 1) + 0.8;

        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl1, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 265 });

        let slH;
        const draw = () => {
          const isSmooth = s.kind === "smooth";
          const f = isSmooth ? fSmooth : fCorner;
          const hVal = Math.abs(s.h) < 0.04 ? (s.h < 0 ? -0.05 : 0.05) : s.h;
          const y0 = f(s.x0);
          const x1 = s.x0 + hVal;
          const y1 = f(x1);
          const mSec = (y1 - y0) / hVal;
          const atCorner = !isSmooth && Math.abs(s.x0 - 1) < 0.05;
          const mTan = isSmooth ? dfSmooth(s.x0) : s.x0 > 1 ? 1 : -1;

          const lines = [
            { a: mSec, b: -1, c: y0 - mSec * s.x0, color: COLORS.c2, width: 2.3, label: L({ tr: "kiriş", en: "secant" }) },
          ];
          if (!atCorner) {
            lines.unshift({ a: mTan, b: -1, c: y0 - mTan * s.x0, color: COLORS.c3, dash: [5, 4], width: 2, label: L({ tr: "teğet", en: "tangent" }) });
          }

          plot.draw({
            x: [-2.2, 3.6],
            y: [-1.5, 5.5],
            xLabel: "x",
            yLabel: "y",
            curves: [{ f, color: COLORS.c1, width: 2.7 }],
            lines,
            points: [
              { x: s.x0, y: y0, color: COLORS.c3, r: 5.5, label: "x₀" },
              { x: x1, y: y1, color: COLORS.c2, r: 5.5, label: "x₀+h" },
            ],
          });
          calc.textContent = atCorner
            ? `\\(m_{\\text{sec}} = ${tx(mSec, 3)},\\qquad f'(1)\\ \\text{${L({ tr: "YOK! (sol = −1, sağ = +1)", en: "DNE! (left = −1, right = +1)" })}}\\)`
            : `\\(m_{\\text{sec}} = \\frac{f(x_0+h)-f(x_0)}{h} = ${tx(mSec, 3)},\\qquad f'(x_0) = ${tx(mTan, 3)}\\)`;
        };

        const shrinkBtn = h("button", { type: "button", class: "btn small", text: "h → 0.05" });
        shrinkBtn.addEventListener("click", () => {
          s.h = 0.05;
          slH.set(0.05);
          draw();
        });

        ctl1.append(
          segmented(
            [["smooth", { tr: "Yumuşak eğri", en: "Smooth curve" }], ["corner", { tr: "Keskin köşe |x−1|", en: "Sharp corner |x−1|" }]],
            s.kind,
            (v) => { s.kind = v; draw(); },
          ),
          shrinkBtn,
        );
        slH = slider("h", { min: -1.6, max: 1.8, step: 0.05, value: s.h, onInput: (v) => { s.h = v; draw(); } });
        ctl2.append(
          slider("x₀", { min: -1.4, max: 2.2, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
          slH,
        );
        draw();
      },
    },

    {
      id: "der-chain",
      mathId: "m-der-chain",
      title: { tr: "Türev Kuralları ve Zincir Kuralı", en: "Differentiation Rules & The Chain Rule" },
      body: [
        {
          tr: R`Her defasında limit almak yerine birkaç pratik kural tüm fonksiyonları anında türevlememizi sağlar: kuvvet kuralı \((x^n)' = nx^{n-1}\), çarpım kuralı \((fg)' = f'g + fg'\), bölüm kuralı ve en güçlüsü olan [[chain-rule|Zincir Kuralı]] — iç içe geçmiş [[composition|bileşke]] fonksiyonların türevi!`,
          en: R`Instead of evaluating limits from scratch every time, a handful of algebraic rules handle almost any expression: power rule \((x^n)' = nx^{n-1}\), product rule \((fg)' = f'g + fg'\), quotient rule, and the superstar [[chain-rule|Chain Rule]] for nested [[composition|compositions]]!`,
        },
        {
          analogy: {
            title: { tr: "Birbirine geçmiş dişli çarklar", en: "Interlocking gears" },
            text: {
              tr: R`Pedal (\(x\)) bir tur döndüğünde orta dişli (\(u = g(x)\)) \(3\) tur dönüyorsa (\(du/dx = 3\)), orta dişli her turda arka tekerleği (\(y = f(u)\)) \(2\) tur döndürüyorsa (\(dy/du = 2\)), pedal bir tur döndüğünde arka tekerlek kaç tur döner? Tabii ki \(2 \times 3 = 6\) tur! Zincir kuralı tam olarak bunu söyler: iç içe hızlar <b>çarpılır</b>!`,
              en: R`Suppose turning pedal \(x\) spins middle gear \(u = g(x)\) at \(3\times\) speed (\(du/dx = 3\)), and the middle gear spins rear wheel \(y = f(u)\) at \(2\times\) speed (\(dy/du = 2\)). How fast does the rear wheel turn per pedal turn? \(2 \times 3 = 6\times\)! Along a chain of functions, rates of change simply <b>multiply</b>!`,
            },
          },
        },
        { eq: R`\frac{d}{dx}\Big[f\!\big(g(x)\big)\Big] = f'\!\big(g(x)\big) \cdot g'(x) \qquad \Longleftrightarrow \qquad \frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}` },
        {
          example: {
            title: { tr: "Zincir kuralı ile iki temel örnek", en: "Two clean Chain Rule calculations" },
            problem: {
              tr: R`\(h(x) = (3x + 1)^2\) ve \(k(x) = \sin(2x)\) fonksiyonlarının türevini bulun.`,
              en: R`Differentiate \(h(x) = (3x + 1)^2\) and \(k(x) = \sin(2x)\).`,
            },
            steps: [
              {
                expr: R`h(x) = u^2,\quad u = 3x + 1 \implies h'(x) = 2u \cdot u' = 2(3x + 1)\cdot 3 = 18x + 6`,
                note: { tr: R`Dış kabuk \((\cdot)^2\)'nin türevi \(2(\cdot)\), için türevi \((3x+1)' = 3\). Sağlama: \((3x+1)^2 = 9x^2+6x+1 \implies 18x+6\)!`, en: R`Outer shell \((\cdot)^2\) gives \(2(\cdot)\), inner gives \((3x+1)' = 3\). Check: \((9x^2+6x+1)' = 18x+6\)!` },
              },
              {
                expr: R`k(x) = \sin(u),\quad u = 2x \implies k'(x) = \cos(2x) \cdot 2 = 2\cos(2x)`,
                note: { tr: R`İçerideki \(2x\) dalgayı \(2\) kat hızlandırdığı için eğim de \(2\) katına çıkar!`, en: R`Because \(2x\) compresses the wave by \(2\times\), the slope doubles too!` },
              },
            ],
            answer: { tr: R`\(h'(x) = 6(3x+1) = 18x+6\) ve \(k'(x) = 2\cos(2x)\).`, en: R`\(h'(x) = 6(3x+1) = 18x+6\) and \(k'(x) = 2\cos(2x)\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: İçin türevini (g′(x)) unutmak!", en: "Common mistake: forgetting the inner derivative g′(x)!" },
            text: {
              tr: R`En yaygın sınav hatası \((e^{3x})' = e^{3x}\) veya \((\sin(x^2))' = \cos(x^2)\) yazıp bırakmaktır! Doğrusu: önce dışın türevini al (içi hiç değiştirmeden bırak), <b>sonra mutlaka için türeviyle çarp</b>: \((e^{3x})' = 3e^{3x}\) ve \((\sin(x^2))' = 2x\cos(x^2)\).`,
              en: R`The #1 exam slip is writing \((e^{3x})' = e^{3x}\) or \((\sin(x^2))' = \cos(x^2)\)! Always differentiate the outer layer (keeping the inside untouched) and <b>multiply by the derivative of the inside</b>: \(3e^{3x}\) and \(2x\cos(x^2)\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>sin(k·x)</b> seçili iken \(x_0 = 0\) tutun ve \(k\)'yı \(1\)'den \(3\)'e çıkarın: dalga \(3\) kat sıkışır ve orijindeki teğet eğimi tam \(1 \to 3\) olur!`, en: R`With <b>sin(k·x)</b> at \(x_0 = 0\), raise \(k\) from \(1\) to \(3\): the wave compresses \(3\times\) and the tangent slope climbs from \(1\) to \(3\)!` },
            { tr: R`<b>e^(k·x)</b> seçin ve \(k = 2\) yapın: kesikli \(e^x\) eğrisine kıyasla \(e^{2x}\)'in her noktada hem daha hızlı tırmandığını hem eğiminin \(k\cdot e^{kx}\) olduğunu doğrulayın.`, en: R`Pick <b>e^(k·x)</b> with \(k = 2\): compare against dashed \(e^x\) and verify the slope equals \(f'(kx)\cdot k = k e^{kx}\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.chain ??= { fn: "sin", k: 2, x0: 0 });
        const lib = {
          sin: {
            name: "sin(k·x)",
            outer: (u) => Math.sin(u),
            dOuter: (u) => Math.cos(u),
            xr: [-3.5, 3.5],
            yr: [-2.2, 2.2],
          },
          exp: {
            name: "e^(k·x)",
            outer: (u) => Math.exp(u),
            dOuter: (u) => Math.exp(u),
            xr: [-2.5, 2.2],
            yr: [-0.5, 6.5],
          },
          sq: {
            name: "0.4(k·x + 1)²",
            outer: (u) => 0.4 * (u + 1) * (u + 1),
            dOuter: (u) => 0.8 * (u + 1),
            xr: [-3, 2.5],
            yr: [-0.5, 6],
          },
        };
        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl1, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          const item = lib[s.fn];
          const comp = (x) => item.outer(s.k * x);
          const u0 = s.k * s.x0;
          const y0 = comp(s.x0);
          const outSlope = item.dOuter(u0);
          const totalSlope = outSlope * s.k;
          plot.draw({
            x: item.xr,
            y: item.yr,
            xLabel: "x",
            yLabel: "y",
            curves: [
              { f: item.outer, color: COLORS.muted, width: 1.8, dash: [5, 4] },
              { f: comp, color: COLORS.c1, width: 2.7 },
            ],
            lines: [{ a: totalSlope, b: -1, c: y0 - totalSlope * s.x0, color: COLORS.c2, width: 2.1 }],
            points: [{ x: s.x0, y: y0, color: COLORS.c2, r: 5.5, ring: true }],
          });
          calc.textContent = `\\(u = ${tx(u0, 2)},\\quad f'(u) = ${tx(outSlope, 2)},\\quad g'(x_0) = ${tx(s.k, 1)} \\implies (f\\circ g)'(x_0) = ${tx(outSlope, 2)}\\cdot ${tx(s.k, 1)} = ${tx(totalSlope, 2)}\\)`;
        };
        ctl1.append(segmented(Object.entries(lib).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }));
        ctl2.append(
          slider(L({ tr: "İç hız k", en: "Inner rate k" }), { min: 0.5, max: 3, step: 0.25, value: s.k, onInput: (v) => { s.k = v; draw(); } }),
          slider("x₀", { min: -1.5, max: 1.2, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },

    {
      id: "der-mvt",
      mathId: "m-der-mvt",
      title: { tr: "Kritik Noktalar, Konkavlık ve Ortalama Değer Teoremi (MVT)", en: "Critical Points, Concavity & Mean Value Theorem" },
      body: [
        {
          tr: R`Birinci türev \(f'\) eğrinin tırmandığını (\(f' > 0\)) mı indiğini (\(f' < 0\)) mi söyler; \(f'(c) = 0\) olan [[critical-point|kritik noktalarda]] teğet yataydır (tepe veya çukur adayları!). İkinci türev \(f''\) ise bükülmeyi yönetir: \(f'' > 0\) iken gülen kâse (konveks / yerel min), \(f'' < 0\) iken üzgün kubbe (konkav / yerel maks), \(f''\) işaret değiştirince [[inflection-point|büküm noktası]] oluşur. [[mvt|Lagrange'ın Ortalama Değer Teoremi (MVT)]] ise aralığın ortalama eğimine tam paralel bir teğetin varlığını garantiler.`,
          en: R`The first derivative \(f'\) tracks rising (\(f' > 0\)) vs falling (\(f' < 0\)); where \(f'(c) = 0\) we hit [[critical-point|critical points]] (candidate peaks and valleys). The second derivative \(f''\) controls bending: \(f'' > 0\) bends upward like a cup (convex / local min), \(f'' < 0\) bends downward like a cap (concave / local max), and sign flips give [[inflection-point|inflection points]]. [[mvt|Lagrange's Mean Value Theorem]] ties average slope to instantaneous slope on \([a, b]\).`,
        },
        {
          analogy: {
            title: { tr: "Otobandaki ortalama hız radarı", en: "Highway average-speed camera" },
            text: {
              tr: R`İki gişe arası \(100\text{ km}\) ve siz bu mesafeyi tam \(1\) saatte geçtiniz (ortalama hız \(100\text{ km/sa}\)). Polis anlık radar kurmamış olsa bile <b>Ortalama Değer Teoremi</b> sayesinde, o yolun içinde en az bir \(c\) anında hız göstergenizin <b>tam \(100\text{ km/sa}\)</b> göstermiş olduğunu matematiksel kesinlikle bilir!`,
              en: R`Two toll booths sit \(100\text{ km}\) apart and you pass them \(1\) hour apart (average speed \(100\text{ km/h}\)). Even without catching you with a radar gun, the <b>Mean Value Theorem</b> guarantees with mathematical certainty that at some exact instant \(c\) in between, your speedometer read <b>exactly \(100\text{ km/h}\)</b>!`,
            },
          },
        },
        { eq: R`\exists\, c \in (a, b) : \quad f'(c) = \frac{f(b) - f(a)}{b - a}` },
        {
          example: {
            title: { tr: "f(x) = x³ − 3x için tepe, çukur ve büküm noktası", en: "Peaks, valleys & inflection of f(x) = x³ − 3x" },
            problem: { tr: R`\(f(x) = x^3 - 3x\) eğrisinin yerel ekstremum ve büküm noktalarını sınıflandırın.`, en: R`Classify all local extrema and inflection points of \(f(x) = x^3 - 3x\).` },
            steps: [
              { expr: R`f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1) = 0 \implies x = -1,\ x = +1`, note: { tr: R`Birinci türevi sıfırlayıp kritik noktaları buluruz.`, en: R`Set the first derivative to zero to locate critical points.` } },
              { expr: R`f''(x) = 6x \implies f''(-1) = -6 < 0,\quad f''(1) = +6 > 0`, note: { tr: R`\(x = -1\)'de aşağı bükümlü → <b>yerel maksimum</b>; \(x = +1\)'de yukarı bükümlü → <b>yerel minimum</b>!`, en: R`Downward bend at \(x = -1\) → <b>local max</b>; upward bend at \(x = +1\) → <b>local min</b>!` } },
              { expr: R`f''(x) = 6x = 0 \implies x = 0`, note: { tr: R`\(f''\) solda negatif, sağda pozitif olduğundan \((0, 0)\) büküm noktasıdır.`, en: R`Because \(f''\) changes sign from \(-\) to \(+\), \((0, 0)\) is the inflection point.` } },
            ],
            answer: { tr: R`Yerel maks \((-1, 2)\), yerel min \((1, -2)\), büküm noktası \((0, 0)\).`, en: R`Local max \((-1, 2)\), local min \((1, -2)\), inflection point \((0, 0)\).` },
          },
        },
        {
          tryList: [
            { tr: R`<b>MVT (Paralel Teğet)</b> modunda \(a\) ve \(b\)'yi kaydırın: turuncu kiriş ile yeşil kesikli teğetin her zaman tam paralel kaldığını görün!`, en: R`In <b>MVT (Parallel Tangent)</b> mode, slide \(a\) and \(b\): watch the green tangent stay strictly parallel to the orange chord!` },
            { tr: R`\(a = -1{,}8\) ve \(b = 1{,}8\) civarında \(f(a) \approx f(b)\) yapın: kiriş yataylaşır ve bu özel durum <b>Rolle Teoremi</b> olur (\(f'(c) = 0\))!`, en: R`Adjust \(a\) and \(b\) so \(f(a) \approx f(b)\): the chord flattens horizontally, revealing <b>Rolle's Theorem</b> (\(f'(c) = 0\))!` },
            { tr: R`<b>f, f′, f″ Analizi</b> moduna geçip \(x_0\)'ı \(-1\), \(0\) ve \(+1\) üzerinden yürütün: tepe, büküm ve çukurda \(f'\) ile \(f''\) işaretlerinin nasıl döndüğünü okuyun.`, en: R`Switch to <b>f, f′, f″ Inspector</b> and slide \(x_0\) across \(-1\), \(0\), and \(+1\) to see \(f'\) and \(f''\) flip sign!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.mvt ??= { mode: "mvt", a: -1.2, b: 2.4, x0: -1 });
        const f = (x) => 0.35 * x * x * x - x + 1;
        const df = (x) => 1.05 * x * x - 1;
        const d2f = (x) => 2.1 * x;

        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg info" });
        box.append(ctl1, ctl2, host, calc, msg);
        const plot = createCanvas2D(host, { height: 265 });

        const draw = () => {
          if (s.mode === "mvt") {
            const a = Math.min(s.a, s.b - 0.4);
            const b = Math.max(s.b, a + 0.4);
            const slope = (f(b) - f(a)) / (b - a);
            const r = Math.sqrt(Math.max(0, (slope + 1) / 1.05));
            const cands = [-r, r].filter((c) => c > a && c < b);
            const c = cands[0] ?? (a + b) / 2;
            plot.draw({
              x: [-3, 3.5],
              y: [-2, 4.5],
              xLabel: "x",
              yLabel: "y",
              curves: [{ f, color: COLORS.c1, width: 2.7 }],
              segments: [{ from: [a, f(a)], to: [b, f(b)], color: COLORS.c2, width: 2.3 }],
              lines: [{ a: df(c), b: -1, c: f(c) - df(c) * c, color: COLORS.c3, dash: [5, 4], width: 2.2, label: "f'(c)" }],
              points: [
                { x: a, y: f(a), color: COLORS.c2, r: 5, label: "a" },
                { x: b, y: f(b), color: COLORS.c2, r: 5, label: "b" },
                { x: c, y: f(c), color: COLORS.c3, r: 6, ring: true, label: `c ≈ ${ns(c, 2)}` },
              ],
            });
            calc.textContent = `\\(\\frac{f(b)-f(a)}{b-a} = ${tx(slope, 3)} = f'(${tx(c, 3)})\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `✓ Kiriş eğimi ${ns(slope, 2)}; c ≈ ${ns(c, 2)} noktasındaki teğet kirişe tam paralel!`,
              en: `✓ Secant slope is ${ns(slope, 2)}; the tangent at c ≈ ${ns(c, 2)} runs strictly parallel!`,
            });
          } else {
            const g = (x) => (x * x * x) / 3 - x;
            const g1 = (x) => x * x - 1;
            const g2 = (x) => 2 * x;
            const y0 = g(s.x0), s1 = g1(s.x0), s2 = g2(s.x0);
            plot.draw({
              x: [-2.6, 2.6],
              y: [-2.8, 2.8],
              xLabel: "x",
              yLabel: "y",
              curves: [
                { f: g, color: COLORS.c1, width: 2.7 },
                { f: g1, color: COLORS.c2, width: 1.9, dash: [5, 4] },
                { f: g2, color: COLORS.c3, width: 1.7, dash: [2, 3] },
              ],
              lines: [{ a: s1, b: -1, c: y0 - s1 * s.x0, color: COLORS.c4, width: 1.8 }],
              points: [
                { x: s.x0, y: y0, color: COLORS.c1, r: 6, ring: true },
                { x: -1, y: g(-1), color: COLORS.c2, r: 4.5, label: L({ tr: "maks", en: "max" }) },
                { x: 1, y: g(1), color: COLORS.c2, r: 4.5, label: "min" },
                { x: 0, y: 0, color: COLORS.c3, r: 4.5, label: L({ tr: "dönüm", en: "infl." }) },
              ],
            });
            calc.textContent = `\\(f(x_0) = ${tx(y0, 2)},\\quad f'(x_0) = ${tx(s1, 2)},\\quad f''(x_0) = ${tx(s2, 2)}\\)`;
            const mono = Math.abs(s1) < 0.08
              ? L({ tr: "Kritik nokta (yatay teğet)", en: "Critical point (horizontal tangent)" })
              : s1 > 0
                ? L({ tr: "Artan (f' > 0)", en: "Increasing (f' > 0)" })
                : L({ tr: "Azalan (f' < 0)", en: "Decreasing (f' < 0)" });
            const conc = Math.abs(s2) < 0.08
              ? L({ tr: "Büküm noktası (f'' = 0)", en: "Inflection point (f'' = 0)" })
              : s2 > 0
                ? L({ tr: "Yukarı bükümlü / Konveks (f'' > 0)", en: "Concave up / Convex (f'' > 0)" })
                : L({ tr: "Aşağı bükümlü / Konkav (f'' < 0)", en: "Concave down / Concave (f'' < 0)" });
            msg.className = "pc-msg info";
            msg.textContent = `${mono} · ${conc}`;
          }
        };

        const syncControls = () => {
          ctl2.replaceChildren();
          if (s.mode === "mvt") {
            ctl2.append(
              slider("a", { min: -2.4, max: 1, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
              slider("b", { min: 0.2, max: 2.8, step: 0.2, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
            );
          } else {
            ctl2.append(slider("x₀", { min: -2.2, max: 2.2, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }));
          }
        };

        ctl1.append(
          segmented(
            [["mvt", { tr: "MVT (Paralel Teğet)", en: "MVT (Parallel Tangent)" }], ["shape", { tr: "f, f′, f″ Analizi", en: "f, f′, f″ Inspector" }]],
            s.mode,
            (v) => { s.mode = v; syncControls(); draw(); },
          ),
        );
        syncControls();
        draw();
      },
    },

    {
      id: "der-apps",
      mathId: "m-der-apps",
      title: { tr: "L'Hôpital Kuralı, Doğrusal Yaklaşım ve Newton–Raphson", en: "L'Hôpital's Rule, Linearization & Newton–Raphson" },
      body: [
        {
          tr: R`Yumuşak bir eğriye yeterince yakından bakarsanız teğet doğrusundan ayırt edilemez: \(f(x) \approx L(x) = f(a) + f'(a)(x - a)\). Bu tek basit fikir iki dev uygulamayı anında doğurur: (1) [[lhopital|L'Hôpital Kuralı]] — \(f(a) = g(a) = 0\) iken \(\frac{f(x)}{g(x)} \approx \frac{f'(a)(x-a)}{g'(a)(x-a)} = \frac{f'(a)}{g'(a)}\) olur! (2) <b>Newton–Raphson yöntemi</b> — eğrinin kökünü bulmak için teğet doğrusunu \(x\)-eksenine indirip her adımda köke sıçrarız!`,
          en: R`Zoom close enough into any smooth curve and it looks indistinguishable from its tangent line \(L(x) = f(a) + f'(a)(x - a)\). That single idea immediately unlocks two power tools: (1) [[lhopital|L'Hôpital's Rule]] — when \(f(a) = g(a) = 0\), near \(a\) we have \(\frac{f(x)}{g(x)} \approx \frac{f'(a)(x-a)}{g'(a)(x-a)} = \frac{f'(a)}{g'(a)}\)! (2) <b>Newton–Raphson</b> — slide down the tangent line to the \(x\)-axis repeatedly to home in on a root!`,
        },
        {
          analogy: {
            title: { tr: "Teğet kaydırağıyla köke zıplamak", en: "Sliding down tangent ramps to the root" },
            text: {
              tr: R`Eğrinin deniz seviyesini (\(y = 0\)) nerede kestiğini bulmak istiyorsunuz. Tahmininiz \(x_0\)'da eğriye bir <b>teğet kaydırağı</b> kurup deniz seviyesine kadar kayarsınız: indiğiniz yer \(x_1\)'dir! Oradan tekrar yukarı çıkıp yeni bir kaydırak kurarsınız — her zıplayışta doğru basamak sayısı neredeyse <b>ikiye katlanır</b>!`,
              en: R`To find where a curve crosses sea level (\(y = 0\)), stand at your guess \(x_0\), place a straight <b>tangent slide</b> along the curve, and slide down to \(y = 0\) to land at \(x_1\). Repeat — each slide roughly <b>doubles</b> your accurate decimal digits!`,
            },
          },
        },
        { eq: R`L(x) = f(a) + f'(a)(x - a), \qquad x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}` },
        {
          example: {
            title: { tr: "Hem √4,1 tahmini hem √2 için 1 Newton adımı", en: "Linearizing √4.1 & one Newton step for √2" },
            problem: { tr: R`(a) \(f(x) = \sqrt{x}\) ile \(\sqrt{4{,}1}\) tahminini yapın. (b) \(x^2 - 2 = 0\) için \(x_0 = 2\)'den \(x_1\)'i hesaplayın.`, en: R`(a) Approximate \(\sqrt{4.1}\) via \(f(x) = \sqrt{x}\) at \(a = 4\). (b) Run one Newton step on \(x^2 - 2 = 0\) from \(x_0 = 2\).` },
            steps: [
              { expr: R`f(4) = 2,\quad f'(4) = \frac{1}{2\sqrt{4}} = 0{,}25 \implies \sqrt{4{,}1} \approx 2 + 0{,}25(0{,}1) = 2{,}025`, note: { tr: R`Gerçek değer \(2{,}02485\): tek satır zihinden hesapla \(0{,}00015\) hata!`, en: R`True value is \(2.02485\): one mental line gives \(0.00015\) accuracy!` } },
              { expr: R`x_1 = x_0 - \frac{x_0^2 - 2}{2x_0} = 2 - \frac{4 - 2}{4} = 2 - 0{,}5 = 1{,}5`, note: { tr: R`Bir sonraki adım \(x_2 = 1{,}5 - \frac{0{,}25}{3} \approx 1{,}4167\) — iki adımda \(\sqrt{2} \approx 1{,}4142\)'ye yapıştı!`, en: R`The next step gives \(x_2 = 1.5 - 0.25/3 \approx 1.4167\) — already hugging \(\sqrt{2} \approx 1.4142\)!` } },
            ],
            answer: { tr: R`\(\sqrt{4{,}1} \approx 2{,}025\) ve \(x_1 = 1{,}5\).`, en: R`\(\sqrt{4.1} \approx 2.025\) and \(x_1 = 1.5\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: 0/0 yokken L'Hôpital uygulamak!", en: "Common mistake: using L'Hôpital when it is NOT 0/0!" },
            text: {
              tr: R`\(\lim_{x \to 1}\frac{x^2 + 1}{x + 1}\) için ezbere türev alırsanız \(\frac{2x}{1} \to 2\) çıkar ki <b>YANLIŞTIR!</b> Çünkü \(x = 1\) yazınca zaten \(\frac{2}{2} = 1\) çıkıyor — belirsizlik yok! L'Hôpital'i yalnızca \(\frac{0}{0}\) veya \(\frac{\infty}{\infty}\) kontrolünü geçtikten sonra kullanın.`,
              en: R`Blindly differentiating \(\lim_{x \to 1}\frac{x^2 + 1}{x + 1}\) gives \(\frac{2x}{1} \to 2\), which is <b>WRONG!</b> Direct substitution already yields \(\frac{2}{2} = 1\) — no indeterminate form exists! Always check \(0/0\) or \(\infty/\infty\) first.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>x² − 2 = 0</b> denkleminde <b>+1 Adım</b> düğmesine art arda basın: 3 adımda \(x_3 \approx 1{,}414216\) ile \(\sqrt{2}\)'yi 5 basamak yakaladığınızı görün!`, en: R`For <b>x² − 2 = 0</b>, click <b>+1 Step</b> repeatedly: in just 3 slides you nail \(\sqrt{2} \approx 1.414216\) to 5 digits!` },
            { tr: R`Başlangıç tahminini \(x_0 = 0{,}5\)'e çekin: eğim küçük olduğu için ilk teğet ileriye fırlasa bile hemen geri toparlanıp köke yakınsar!`, en: R`Lower \(x_0\) to \(0.5\): a flat tangent overshoots first, then snaps rapidly right back onto \(\sqrt{2}\)!` },
            { tr: R`<b>cos(x) − x = 0</b> aşkın denklemine geçin: cebirsel formülü olmayan bu denklemin kökünü (\(0{,}7391\)) Newton 3 adımda bulur!`, en: R`Switch to transcendental <b>cos(x) − x = 0</b>: Newton nails its root (\(0.7391\)) in 3 steps even though no algebraic formula exists!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.newt ??= { eq: "sqrt2", x0: 2.8, steps: 3 });
        const eqs = {
          sqrt2: {
            label: "x² − 2 = 0",
            f: (x) => x * x - 2,
            df: (x) => 2 * x,
            xr: [0, 3.6],
            yr: [-2.5, 8.2],
            root: Math.SQRT2,
          },
          cbrt2: {
            label: "x³ − 2 = 0",
            f: (x) => x * x * x - 2,
            df: (x) => 3 * x * x,
            xr: [0, 2.8],
            yr: [-2.5, 9],
            root: Math.cbrt(2),
          },
          cosx: {
            label: "cos(x) − x = 0",
            f: (x) => Math.cos(x) - x,
            df: (x) => -Math.sin(x) - 1,
            xr: [-0.2, 2.6],
            yr: [-2.5, 1.5],
            root: 0.7390851332,
          },
        };

        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl1, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 265 });

        const draw = () => {
          const cur = eqs[s.eq];
          const xStart = Math.max(cur.xr[0] + 0.3, Math.min(cur.xr[1] - 0.1, s.x0));
          const xs = newtonRaphson(cur.f, cur.df, xStart, s.steps);
          const segs = [];
          for (let i = 0; i < xs.length - 1; i++) {
            segs.push(
              { from: [xs[i], 0], to: [xs[i], cur.f(xs[i])], color: COLORS.muted, dash: [3, 3], width: 1.3 },
              { from: [xs[i], cur.f(xs[i])], to: [xs[i + 1], 0], color: COLORS.c2, width: 2.1 },
            );
          }
          plot.draw({
            x: cur.xr,
            y: cur.yr,
            xLabel: "x",
            yLabel: "f(x)",
            lines: [{ a: 0, b: 1, c: 0, color: COLORS.axis, width: 1.4 }],
            curves: [{ f: cur.f, color: COLORS.c1, width: 2.7 }],
            segments: segs,
            points: [
              { x: cur.root, y: 0, color: COLORS.c4, r: 4.5, hollow: true },
              ...xs.map((x, i) => ({ x, y: 0, color: i === 0 ? COLORS.c2 : COLORS.c3, r: 5, label: i <= 3 ? `x${i}` : undefined })),
            ],
          });
          const last = xs[xs.length - 1];
          const err = Math.abs(last - cur.root);
          calc.textContent = `${xs.map((x, i) => `\\(x_${i}=${tx(x, 5)}\\)`).join(" → ")} · \\(|x_${xs.length - 1} - r| = ${tx(err, 6)}\\)`;
        };

        const addBtn = h("button", { type: "button", class: "btn small primary", text: L({ tr: "+1 Adım", en: "+1 Step" }) });
        const resetBtn = h("button", { type: "button", class: "btn small", text: L({ tr: "Sıfırla", en: "Reset" }) });
        addBtn.addEventListener("click", () => {
          s.steps = Math.min(5, s.steps + 1);
          draw();
        });
        resetBtn.addEventListener("click", () => {
          s.steps = 1;
          draw();
        });

        ctl1.append(
          segmented(Object.entries(eqs).map(([k, v]) => [k, v.label]), s.eq, (v) => { s.eq = v; draw(); }),
          addBtn,
          resetBtn,
        );
        ctl2.append(slider("x₀", { min: 0.4, max: 3.3, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }));
        draw();
      },
    },
  ],

  playground: {
    title: { tr: "f, f′, f″ Eğri Stüdyosu & Doğrusal Yaklaşım Tezgâhı", en: "f, f′, f″ Curve Studio & Linearization Workbench" },
    sub: {
      tr: R`Dört hazır eğri üzerinde hem \(f, f', f''\) grafiklerinin eşzamanlı davranışını hem de \(x_0\) noktasındaki teğet doğrusu \(L(x)\)'in yaklaşım hatasını etkileşimli olarak keşfedin.`,
      en: R`Explore four iconic curves interactively: inspect \(f, f', f''\) together or measure the tangent-line linearization error \(|f(x_0+\Delta x) - L(x_0+\Delta x)|\).`,
    },
    experiments: [
      { tr: R`<b>Kübik (⅓x³−x)</b> önayarında \(x_0 = -1\) ve \(x_0 = +1\) yapın: mavi eğride tepe/çukur varken turuncu \(f'\) grafiğinin tam \(0\)'dan geçtiğini doğrulayın.`, en: R`Pick <b>Cubic (⅓x³−x)</b> at \(x_0 = -1\) and \(x_0 = +1\): verify orange \(f'\) crosses zero exactly at the peaks and valleys of blue \(f\).` },
      { tr: R`<b>Çan (e^(−x²))</b> önayarında \(x_0 \approx \pm 0{,}7\) yapın: yeşil \(f''\) sıfırlandığı anda çan eğrisinin bükülme yönü değişir (büküm noktası!).`, en: R`Pick <b>Bell (e^(−x²))</b> near \(x_0 \approx \pm 0.7\): where green \(f''\) hits zero, the bell curve flips concavity (inflection point!).` },
      { tr: R`<b>Doğrusal Yaklaşım</b> moduna geçin ve \(\Delta x\)'i \(1{,}2\)'den \(0{,}2\)'ye küçültün: hata \(|f - L|\)'nin \((\Delta x)^2\) hızıyla çöküp neredeyse sıfırlandığını izleyin!`, en: R`Switch to <b>Linearization</b> and shrink \(\Delta x\) from \(1.2\) to \(0.2\): watch error \(|f - L|\) collapse quadratically like \((\Delta x)^2\)!` },
      { tr: R`<b>W Eğrisi (¼x⁴−x²)</b> önayarında kaç tane kritik nokta (3) ve kaç tane büküm noktası (2) olduğunu \(x_0\)'ı gezdirerek sayın.`, en: R`In <b>W Curve (¼x⁴−x²)</b>, scrub \(x_0\) to count all 3 critical points and 2 inflection points.` },
    ],
    build(host, state) {
      const s = (state.pg ??= { mode: "derivs", fn: "cubic", x0: 0.6, dx: 0.7 });
      const fns = {
        cubic: { label: { tr: "Kübik (⅓x³−x)", en: "Cubic (⅓x³−x)" }, f: (x) => (x * x * x) / 3 - x, yr: [-3.2, 3.2] },
        quart: { label: { tr: "W Eğrisi (¼x⁴−x²)", en: "W Curve (¼x⁴−x²)" }, f: (x) => 0.25 * x ** 4 - x * x, yr: [-2.5, 4] },
        sin: { label: { tr: "Dalga (sin x)", en: "Wave (sin x)" }, f: (x) => Math.sin(x), yr: [-2, 2] },
        bell: { label: { tr: "Çan (e^(−x²))", en: "Bell (e^(−x²))" }, f: (x) => Math.exp(-x * x), yr: [-2.2, 1.8] },
      };

      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 385 });
      const legend = h("div", { class: "canvas-legend" });
      stage.append(legend);

      const presets = h("div", { class: "t-controls" });
      const ctl1 = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır eğriler", en: "Quick presets" }) }),
        presets,
        ctl1,
        ctl2,
        tiles,
        calc,
      );

      let segMode, slX0, slDx;
      const draw = () => {
        const cur = fns[s.fn];
        const f = cur.f;
        const f1 = (x) => numDiff(f, x);
        const f2 = (x) => numDiff2(f, x);
        const y0 = f(s.x0), m0 = f1(s.x0), c0 = f2(s.x0);

        if (s.mode === "derivs") {
          plot.draw({
            x: [-3, 3],
            y: cur.yr,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a: 1, b: 0, c: -s.x0, color: COLORS.muted, dash: [4, 4], width: 1.2 }],
            curves: [
              { f, color: COLORS.c1, width: 2.8 },
              { f: f1, color: COLORS.c2, width: 2.1, dash: [5, 4] },
              { f: f2, color: COLORS.c3, width: 1.9, dash: [2, 3] },
            ],
            points: [
              { x: s.x0, y: y0, color: COLORS.c1, r: 5.5, ring: true },
              { x: s.x0, y: m0, color: COLORS.c2, r: 4.5 },
              { x: s.x0, y: c0, color: COLORS.c3, r: 4.5 },
            ],
          });
          legend.replaceChildren(
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c1}` }), "f(x)"),
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c2}` }), "f′(x)"),
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c3}` }), "f″(x)"),
          );
          tiles.replaceChildren(
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f(x₀)" }), h("span", { class: "pg-tile-value", text: ns(y0, 3) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f′(x₀)" }), h("span", { class: "pg-tile-value", text: ns(m0, 3) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f″(x₀)" }), h("span", { class: "pg-tile-value", text: ns(c0, 3) })),
          );
          calc.textContent = `\\(x_0 = ${tx(s.x0, 2)}:\\quad f'(x_0) ${m0 > 0.05 ? "> 0" : m0 < -0.05 ? "< 0" : "\\approx 0"},\\quad f''(x_0) ${c0 > 0.05 ? "> 0" : c0 < -0.05 ? "< 0" : "\\approx 0"}\\)`;
        } else {
          const x1 = s.x0 + s.dx;
          const exact = f(x1);
          const approx = y0 + m0 * s.dx;
          const err = Math.abs(exact - approx);
          plot.draw({
            x: [-3, 3],
            y: cur.yr,
            xLabel: "x",
            yLabel: "y",
            curves: [{ f, color: COLORS.c1, width: 2.8 }],
            lines: [{ a: m0, b: -1, c: y0 - m0 * s.x0, color: COLORS.c2, width: 2.2, label: "L(x)" }],
            segments: [{ from: [x1, exact], to: [x1, approx], color: COLORS.bad, width: 2.5 }],
            points: [
              { x: s.x0, y: y0, color: COLORS.c3, r: 5.5, label: "x₀" },
              { x: x1, y: exact, color: COLORS.c1, r: 5, label: "f" },
              { x: x1, y: approx, color: COLORS.c2, r: 5, label: "L" },
            ],
          });
          legend.replaceChildren(
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c1}` }), "f(x)"),
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c2}` }), "L(x) = f(x₀)+f′(x₀)(x−x₀)"),
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.bad}` }), L({ tr: "Hata |f − L|", en: "Error |f − L|" })),
          );
          tiles.replaceChildren(
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f(x₀+Δx)" }), h("span", { class: "pg-tile-value", text: ns(exact, 4) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "L(x₀+Δx)" }), h("span", { class: "pg-tile-value", text: ns(approx, 4) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "|f − L|" }), h("span", { class: "pg-tile-value", text: ns(err, 4) })),
          );
          calc.textContent = `\\(L(x) = ${tx(y0, 2)} ${m0 >= 0 ? "+" : "-"} ${tx(Math.abs(m0), 2)}(x ${s.x0 >= 0 ? "-" : "+"} ${tx(Math.abs(s.x0), 2)})\\)`;
        }
      };

      for (const [key, item] of Object.entries(fns)) {
        const b = h("button", { type: "button", class: "btn small", text: L(item.label) });
        b.addEventListener("click", () => {
          s.fn = key;
          s.x0 = key === "bell" ? 0.7 : key === "quart" ? 0 : 0.6;
          slX0.set(s.x0);
          draw();
        });
        presets.append(b);
      }

      segMode = segmented(
        [["derivs", "f, f′, f″"], ["linear", { tr: "Doğrusal Yaklaşım L(x)", en: "Linearization L(x)" }]],
        s.mode,
        (v) => { s.mode = v; draw(); },
      );
      slX0 = slider("x₀", { min: -2.2, max: 2.2, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } });
      slDx = slider("Δx", { min: -1.2, max: 1.2, step: 0.1, value: s.dx, onInput: (v) => { s.dx = v; draw(); } });
      ctl1.append(segMode);
      ctl2.append(slX0, slDx);
      draw();
    },
  },

  mathSections: [
    {
      id: "m-der-rules",
      title: { tr: "Temel Türev Tablosu ve Çarpım Kuralı İspatı", en: "Elementary Derivative Table & Product Rule Proof" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Fonksiyon f(x)", en: "Function f(x)" },
              { tr: "Türevi f′(x)", en: "Derivative f′(x)" },
              { tr: "Not / Koşul", en: "Note / Domain" },
            ],
            rows: [
              [R`\(x^n\)`, R`\(n x^{n-1}\)`, { tr: R`Her reel \(n \in \mathbb{R}\) için`, en: R`For any real \(n \in \mathbb{R}\)` }],
              [R`\(e^x,\ a^x\)`, R`\(e^x,\ a^x \ln a\)`, { tr: R`\(e^x\) kendi türevine eşittir!`, en: R`\(e^x\) is its own derivative!` }],
              [R`\(\ln x\)`, R`\(\dfrac{1}{x}\)`, R`\(x > 0\)`],
              [R`\(\sin x,\ \cos x\)`, R`\(\cos x,\ -\sin x\)`, { tr: "x radyan cinsinden", en: "x in radians" }],
              [R`\(\tan x\)`, R`\(\sec^2 x = \dfrac{1}{\cos^2 x}\)`, R`\(\cos x \ne 0\)`],
              [R`\(\arcsin x,\ \arctan x\)`, R`\(\dfrac{1}{\sqrt{1-x^2}},\ \dfrac{1}{1+x^2}\)`, R`\(|x| < 1,\ x \in \mathbb{R}\)`],
            ],
          },
        },
        { eq: R`(fg)' = f'g + fg', \qquad \left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}` },
        {
          derive: {
            title: { tr: "Çarpım kuralının ilk ilkelerden ispatı", en: "Proof of the Product Rule from first principles" },
            steps: [
              { tex: R`(fg)'(x) = \lim_{h \to 0}\frac{f(x+h)g(x+h) - f(x)g(x)}{h}`, why: { tr: "Türevin limit tanımıyla başlarız.", en: "Start directly from the limit definition of derivative." } },
              { tex: R`= \lim_{h \to 0}\frac{f(x+h)g(x+h) - f(x)g(x+h) + f(x)g(x+h) - f(x)g(x)}{h}`, why: { tr: R`Paya \(f(x)g(x+h)\) terimini hem çıkarıp hem ekleriz (değeri değişmez, ama iki ayrı türev oranı oluşur!).`, en: R`Subtract and add \(f(x)g(x+h)\) in the numerator to separate the changes in \(f\) and \(g\)!` } },
              { tex: R`= \lim_{h \to 0}\left[\frac{f(x+h)-f(x)}{h}g(x+h) + f(x)\frac{g(x+h)-g(x)}{h}\right] = f'(x)g(x) + f(x)g'(x)`, why: { tr: R`\(g\) türevlenebilir olduğundan süreklidir: \(h \to 0\) iken \(g(x+h) \to g(x)\). İspat tamamlandı!`, en: R`Differentiability of \(g\) implies continuity, so \(g(x+h) \to g(x)\) as \(h \to 0\). Done!` } },
            ],
          },
        },
      ],
    },
    {
      id: "m-der-chain",
      title: { tr: "Zincir Kuralı ve Kapalı Fonksiyon Türevi", en: "Chain Rule & Implicit Differentiation" },
      blocks: [
        { eq: R`(f \circ g)'(x) = f'(g(x))\,g'(x), \qquad \frac{d}{dx}\big[y(x)^2\big] = 2y\,\frac{dy}{dx}` },
        {
          example: {
            title: { tr: "Kapalı türev: x² + y² = 25 çemberinin (3, 4)'teki teğet eğimi", en: "Implicit differentiation on the circle x² + y² = 25 at (3, 4)" },
            problem: { tr: R`\(y\)'yi yalnız bırakmadan \((3, 4)\) noktasında \(\frac{dy}{dx}\) eğimini bulun.`, en: R`Find the tangent slope \(\frac{dy}{dx}\) at \((3, 4)\) without solving for \(y\).` },
            steps: [
              { expr: R`\frac{d}{dx}(x^2) + \frac{d}{dx}(y^2) = \frac{d}{dx}(25)`, note: { tr: R`Denklemin iki tarafının \(x\)'e göre türevini alırız.`, en: R`Differentiate both sides with respect to \(x\).` } },
              { expr: R`2x + 2y\,\frac{dy}{dx} = 0`, note: { tr: R`\(y\) bir \(x\) fonksiyonu olduğundan zincir kuralıyla \((y^2)' = 2y \cdot \frac{dy}{dx}\) gelir!`, en: R`Because \(y\) depends on \(x\), the Chain Rule gives \((y^2)' = 2y\,\frac{dy}{dx}\)!` } },
              { expr: R`\frac{dy}{dx} = -\frac{x}{y} \implies \left.\frac{dy}{dx}\right|_{(3,4)} = -\frac{3}{4}`, note: { tr: R`Yarıçap eğimi \(\frac{4}{3}\)'tür; çarpımları \(-1\) → teğet yarıçapa gerçekten dik!`, en: R`The radius slope is \(\frac{4}{3}\); product is \(-1\), confirming tangent \(\perp\) radius!` } },
            ],
            answer: { tr: R`\((3, 4)\) noktasındaki teğet eğimi \(-\frac{3}{4} = -0{,}75\)'tir.`, en: R`The tangent slope at \((3, 4)\) is \(-\frac{3}{4} = -0.75\).` },
          },
        },
        {
          callout: "tip",
          title: { tr: "Ters fonksiyon türevi formülü", en: "Inverse function derivative shortcut" },
          text: {
            tr: R`\(f(f^{-1}(x)) = x\) özdeşliğine zincir kuralı uygulayınca \((f^{-1})'(x) = \frac{1}{f'(f^{-1}(x))}\) çıkar! Örneğin \(y = \arctan x \implies \tan y = x \implies (\arctan x)' = \frac{1}{\sec^2 y} = \frac{1}{1 + x^2}\).`,
            en: R`Applying the Chain Rule to \(f(f^{-1}(x)) = x\) immediately gives \((f^{-1})'(x) = \frac{1}{f'(f^{-1}(x))}\) — that is how \((\arctan x)' = \frac{1}{1 + x^2}\) is derived!`,
          },
        },
      ],
    },
    {
      id: "m-der-mvt",
      title: { tr: "Rolle → Ortalama Değer Teoremi (MVT) ve Ekstremum Testleri", en: "Rolle → Mean Value Theorem & Extremum Tests" },
      blocks: [
        {
          derive: {
            title: { tr: "Rolle Teoremi → Lagrange MVT ispatı", en: "Deriving MVT from Rolle's Theorem" },
            steps: [
              { tex: R`h(x) = f(x) - \left[f(a) + \frac{f(b)-f(a)}{b-a}(x - a)\right]`, why: { tr: R`Eğri \(f(x)\) ile uçları birleştiren kiriş doğrusu arasındaki dikey boşluğu \(h(x)\) olarak tanımlarız.`, en: R`Define \(h(x)\) as the vertical gap between the curve \(f(x)\) and the secant chord.` } },
              { tex: { tr: R`h(a) = 0 \quad \text{ve} \quad h(b) = 0`, en: R`h(a) = 0 \quad \text{and} \quad h(b) = 0` }, why: { tr: R`Kiriş iki uçta eğriye değdiğinden \(h(a) = h(b) = 0\). Rolle Teoremi arada \(h'(c) = 0\) sağlayan bir \(c \in (a, b)\) garantiler!`, en: R`Because the chord meets the curve at both endpoints, \(h(a) = h(b) = 0\); Rolle's Theorem guarantees some \(c \in (a, b)\) with \(h'(c) = 0\)!` } },
              { tex: R`h'(c) = f'(c) - \frac{f(b)-f(a)}{b-a} = 0 \implies f'(c) = \frac{f(b)-f(a)}{b-a}`, why: { tr: R`\(h'\)'yi sıfıra eşitleyip kiriş eğimini karşıya atınca MVT ispatlanır!`, en: R`Setting \(h'(c) = 0\) and moving the chord slope across proves the MVT!` } },
            ],
          },
        },
        {
          table: {
            head: [
              { tr: "Türev işareti", en: "Derivative sign" },
              { tr: "Grafiğin davranışı", en: "Curve behavior" },
              { tr: "Ekstremum / Dönüm", en: "Extremum / Inflection" },
            ],
            rows: [
              [R`\(f'(x) > 0\ /\ f'(x) < 0\)`, { tr: "Artan / Azalan", en: "Increasing / Decreasing" }, { tr: R`\(f'\) işareti \(+\to -\) ise yerel maks`, en: R`\(f'\) flips \(+\to -\) → local max` }],
              [R`\(f'(c) = 0,\ f''(c) < 0\)`, { tr: "Yatay teğet + aşağı kubbe", en: "Flat tangent + concave down" }, { tr: "Yerel Maksimum", en: "Local Maximum" }],
              [R`\(f'(c) = 0,\ f''(c) > 0\)`, { tr: "Yatay teğet + yukarı kâse", en: "Flat tangent + concave up" }, { tr: "Yerel Minimum", en: "Local Minimum" }],
              [R`\(f''(c) = 0\)` + " (±)", { tr: "Eğrilik yön değiştirir", en: "Concavity flips sign" }, { tr: "Büküm Noktası", en: "Inflection Point" }],
            ],
          },
        },
        {
          example: {
            title: { tr: "Optimizasyon: Çevresi 20 m olan en geniş dikdörtgen", en: "Optimization: largest rectangle with perimeter 20 m" },
            problem: { tr: R`Çevresi \(2x + 2y = 20\) olan dikdörtgenin alanı \(A = xy\) en fazla kaç olabilir?`, en: R`Maximize the area \(A = xy\) of a rectangle with perimeter \(2x + 2y = 20\).` },
            steps: [
              { expr: R`y = 10 - x \implies A(x) = x(10 - x) = 10x - x^2 \quad (0 < x < 10)`, note: { tr: R`Önce kısıttan \(y\)'yi çekip alanı tek değişkenli yaparız.`, en: R`Solve the constraint for \(y\) so area depends only on \(x\).` } },
              { expr: R`A'(x) = 10 - 2x = 0 \implies x = 5, \qquad A''(5) = -2 < 0`, note: { tr: R`İkinci türev negatif olduğundan \(x = 5\) kesin maksimumdur!`, en: R`Since \(A''(5) = -2 < 0\), \(x = 5\) is a guaranteed maximum!` } },
            ],
            answer: { tr: R`\(x = y = 5\text{ m}\) (kare) ve maksimum alan \(A = 25\text{ m}^2\).`, en: R`A \(5 \times 5\text{ m}\) square gives maximum area \(25\text{ m}^2\).` },
          },
        },
      ],
    },
    {
      id: "m-der-apps",
      title: { tr: "L'Hôpital Kuralı ve Belirsizlik Dönüşümleri", en: "L'Hôpital's Rule & Indeterminate Conversions" },
      blocks: [
        { eq: R`\lim_{x \to a}\frac{f(x)}{g(x)} \stackrel{0/0,\ \infty/\infty}{=} \lim_{x \to a}\frac{f'(x)}{g'(x)}` },
        {
          example: {
            title: { tr: "Ardışık iki kez L'Hôpital uygulaması", en: "Applying L'Hôpital's Rule twice in a row" },
            problem: { tr: R`\(\lim_{x \to 0}\frac{e^{2x} - 1 - 2x}{x^2}\) limitini hesaplayın.`, en: R`Evaluate \(\lim_{x \to 0}\frac{e^{2x} - 1 - 2x}{x^2}\).` },
            steps: [
              { expr: R`\frac{e^0 - 1 - 0}{0^2} = \frac{0}{0} \xrightarrow{\text{L'H}} \lim_{x \to 0}\frac{2e^{2x} - 2}{2x}`, note: { tr: R`\(0/0\) kontrolünü geçtik! Pay ve paydanın ayrı ayrı türevini alırız (bölüm kuralı DEĞİL!).`, en: R`It is \(0/0\)! Differentiate top and bottom separately (NOT the quotient rule!).` } },
              { expr: R`\frac{2 - 2}{0} = \frac{0}{0} \xrightarrow{\text{L'H}} \lim_{x \to 0}\frac{4e^{2x}}{2} = \frac{4}{2} = 2`, note: { tr: R`Hâlâ \(0/0\) olduğundan bir kez daha L'Hôpital uygularız; belirsizlik çözülür!`, en: R`Still \(0/0\), so apply L'Hôpital once more — the limit evaluates cleanly to \(2\)!` } },
            ],
            answer: { tr: R`Limit \(2\)'dir.`, en: R`The limit equals \(2\).` },
          },
        },
        {
          callout: "warn",
          title: { tr: "İki klasik L'Hôpital kuralı uyarısı", en: "Two classic L'Hôpital warnings" },
          text: {
            tr: R`(1) L'Hôpital'de bölüm kuralı uygulanmaz: payın türevi <i>bölü</i> paydanın türevi alınır! (2) Diğer belirsizlikleri (\(0 \cdot \infty\), \(1^\infty\), \(\infty^0\)) önce cebirsel olarak veya \(\ln\) alıp \(\frac{0}{0}\) ya da \(\frac{\infty}{\infty}\) biçimine çevirmeden L'Hôpital uygulamayın.`,
            en: R`(1) Never use the quotient rule in L'Hôpital: differentiate top and bottom separately! (2) Convert \(0 \cdot \infty\), \(1^\infty\), or \(\infty^0\) into \(\frac{0}{0}\) or \(\frac{\infty}{\infty}\) (using reciprocals or \(\ln\)) BEFORE applying L'Hôpital.`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
