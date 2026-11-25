import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

const TRANS_FNS = {
  exp: {
    name: "eˣ",
    f: (x) => Math.exp(x),
    inv: (x) => (x > 0 ? Math.log(x) : NaN),
    dom: R`\mathbb{R}`,
    img: R`(0,\infty)`,
    invName: R`\ln x`,
  },
  sin: {
    name: "sin(x)",
    f: (x) => Math.sin(x),
    inv: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : NaN),
    dom: R`[-\tfrac{\pi}{2},\tfrac{\pi}{2}]`,
    img: R`[-1,1]`,
    invName: R`\arcsin x`,
  },
  tan: {
    name: "tan(x)",
    f: (x) => Math.tan(x),
    inv: (x) => Math.atan(x),
    dom: R`(-\tfrac{\pi}{2},\tfrac{\pi}{2})`,
    img: R`\mathbb{R}`,
    invName: R`\arctan x`,
  },
  sinh: {
    name: "sinh(x)",
    f: (x) => Math.sinh(x),
    inv: (x) => Math.asinh(x),
    dom: R`\mathbb{R}`,
    img: R`\mathbb{R}`,
    invName: R`\operatorname{arsinh} x`,
  },
  cosh: {
    name: "cosh(x)",
    f: (x) => Math.cosh(x),
    inv: (x) => (x >= 1 ? Math.acosh(x) : NaN),
    dom: R`[0,\infty)`,
    img: R`[1,\infty)`,
    invName: R`\operatorname{arcosh} x`,
  },
  tanh: {
    name: "tanh(x)",
    f: (x) => Math.tanh(x),
    inv: (x) => (Math.abs(x) < 1 ? Math.atanh(x) : NaN),
    dom: R`\mathbb{R}`,
    img: R`(-1,1)`,
    invName: R`\operatorname{artanh} x`,
  },
};

function makePresetBtn(label, onClick) {
  const b = h("button", { type: "button", class: "btn small", text: L(label) });
  b.addEventListener("click", onClick);
  return b;
}

mountChapter({
  intro: {
    id: "fn-intro",
    title: { tr: "Fonksiyonlar ve Aşkın Fonksiyonlar", en: "Functions and Transcendental Functions" },
    paragraphs: [
      {
        tr: R`Matematikte bir [[function|fonksiyon]] en basit hâliyle güvenilir bir <b>girdi → çıktı kuralıdır</b>. \(f: A \to B\) yazısını yüksek sesle <i>"\(f\) fonksiyonu \(A\) kümesinden \(B\) kümesine gider"</i>, \(y = f(x)\) yazısını ise <i>"\(x\) girdiğinde çıktı \(f\) parantez \(x\) olur"</i> diye okuruz. Analizdeki limit, türev ve integral gibi tüm konular bu kuralı derinlemesine tanımak üzerine kurulur.`,
        en: R`At heart, a mathematical [[function|function]] is simply a reliable <b>input → output rule</b>. We read \(f: A \to B\) aloud as <i>"\(f\) maps set \(A\) into set \(B\)"</i>, and \(y = f(x)\) as <i>"\(y\) equals \(f\) of \(x\)"</i>. Every major idea in calculus — limits, derivatives, integrals, and series — is built on understanding how functions behave.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> şunları hiç zorlanmadan yapabileceksiniz: bir fonksiyonun [[domain-range|tanım ve görüntü kümesini]] bulmak; [[injective|birebirlik]] ve [[inverse-fn|ters fonksiyon]] varlığını yatay doğru testiyle anında görmek; \(a\,f(b(x-c))+d\) grafik dönüşümlerini okumak; ve \(e^x, \ln x, \sin x, \sinh x, \cosh x\) gibi [[transcendental|aşkın fonksiyonların]] temel kimliklerini kullanmak.`,
        en: R`<b>By the end of this chapter</b> you will comfortably find the [[domain-range|domain and range]] of a function, test [[injective|injectivity]] and [[inverse-fn|invertibility]] visually with the horizontal-line test, read graph transformations \(a\,f(b(x-c))+d\) at a glance, and work with [[transcendental|transcendental functions]] such as \(e^x, \ln x, \sin x, \sinh x, \cosh x\).`,
      },
    ],
    analogy: {
      title: { tr: "İçecek Otomatı Benzetmesi", en: "The Vending Machine Analogy" },
      text: {
        tr: R`Bir fonksiyonu içecek otomatı gibi düşünün: bir tuşa (girdi \(x\)) bastığınızda makine size <b>tam olarak bir</b> içecek (çıktı \(f(x)\)) vermelidir. İki farklı tuş aynı suyu verebilir (bu hâlâ geçerli bir fonksiyondur!), ama tek bir tuş bir gün su bir gün kahve verirse o makine bozuktur — yani fonksiyon değildir. Makinenin kabul ettiği tuşlar <b>tanım kümesi</b>, gerçekten çıkabilen içecekler ise <b>görüntü kümesidir</b>.`,
        en: R`Picture a function as a vending machine: pressing a button (input \(x\)) must always dispense <b>exactly one</b> predictable drink (output \(f(x)\)). Two different buttons are allowed to dispense the same water (still a valid function!), but one button cannot randomly spit out two different drinks at once. The set of valid buttons is the <b>domain</b>, and the set of drinks it can actually dispense is the <b>range</b>.`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 1 · Fonksiyonlar + Aşkın Fonksiyonlar", en: "Lecture 1 · Functions + Transcendental Functions" }],
      [{ tr: "Temel fikirler", en: "Core ideas" }, { tr: "Tanım/görüntü, birebirlik, bileşke, ters fonksiyon, dönüşümler", en: "Domain/range, injectivity, composition, inverses, transformations" }],
      [{ tr: "Aşkın aileler", en: "Transcendental families" }, { tr: R`\(e^x,\ \ln x,\ \sin/\cos/\tan,\ \sinh/\cosh/\tanh\)`, en: R`\(e^x,\ \ln x,\ \sin/\cos/\tan,\ \sinh/\cosh/\tanh\)` }],
    ],
    tip: {
      title: { tr: "Sözlü sınav ipucu", en: "Oral exam tip" },
      text: {
        tr: R`\(\sin x\) tüm \(\mathbb{R}\)'de birebir değildir; \(\arcsin x\) tanımlamak için tanım kümesini \([-\pi/2,\pi/2]\)'ye kısıtlarız. Aynı kısıtlama mantığı \(\arccos\) (\([0,\pi]\)) ve \(\operatorname{arcosh}\) (\([0,\infty)\)) için de geçerlidir.`,
        en: R`\(\sin x\) is not injective on all of \(\mathbb{R}\); we restrict its domain to \([-\pi/2,\pi/2]\) to define \(\arcsin x\). The same domain restriction yields \(\arccos\) on \([0,\pi]\) and \(\operatorname{arcosh}\) on \([0,\infty)\).`,
      },
    },
  },
  sections: [
    {
      id: "fn-domain",
      mathId: "m-fn-basics",
      title: { tr: "Fonksiyon Nedir? Makine Modeli, Tanım ve Görüntü Kümesi", en: "What Is a Function? Machine Model, Domain & Range" },
      body: [
        {
          tr: R`Bir [[function|fonksiyonu]] \(x\) sayısını alıp \(f(x)\) sayısına dönüştüren bir işlem kutusu olarak görebiliriz. Grafikte her dikey \(x = x_0\) doğrusu eğriyi <b>en fazla bir kez</b> kesmelidir (<i>dikey doğru testi</i>), çünkü tek bir girdinin iki farklı çıktısı olamaz.`,
          en: R`Think of a [[function|function]] as a processing box turning an input \(x\) into a single output \(f(x)\). On a graph, every vertical line \(x = x_0\) may hit the curve <b>at most once</b> (the <i>vertical-line test</i>), because one input cannot produce two outputs.`,
        },
        {
          tr: R`Reel sayılarda (\(\mathbb{R}\)) çalışırken [[domain-range|tanım kümesini]] bulmak için şu <b>üç altın yasağı</b> kontrol etmek çoğu zaman yeterlidir: (1) <b>Payda sıfır olamaz</b> (\(\frac{1}{u} \Rightarrow u \ne 0\)), (2) <b>Çift dereceli kökün içi negatif olamaz</b> (\(\sqrt{u} \Rightarrow u \ge 0\)), (3) <b>Logaritmanın içi kesin pozitif olmalıdır</b> (\(\ln u \Rightarrow u > 0\)).`,
          en: R`When working over the real numbers (\(\mathbb{R}\)), finding the [[domain-range|domain]] usually boils down to checking <b>three golden rules</b>: (1) <b>Never divide by zero</b> (\(\frac{1}{u} \Rightarrow u \ne 0\)), (2) <b>No negative numbers under even roots</b> (\(\sqrt{u} \Rightarrow u \ge 0\)), (3) <b>Logarithms only accept strictly positive inputs</b> (\(\ln u \Rightarrow u > 0\)).`,
        },
        {
          analogy: {
            title: { tr: "Kahve Makinesinin Güvenlik Kuralları", en: "Safety Rules of a Coffee Machine" },
            text: {
              tr: R`Bir kahve makinesine taş atarsanız hata verir. Matematikte de \(x = 1\) değerini \(\frac{1}{x-1}\) makinesine veya \(x = -4\) değerini \(\sqrt{x}\) makinesine vermek aynı şeydir: makine hata verir, yani o \(x\) değeri tanım kümesinin dışındadır.`,
              en: R`Drop a pebble into a coffee machine and it flashes an error. Feeding \(x = 1\) into \(\frac{1}{x-1}\) or \(x = -4\) into \(\sqrt{x}\) does the exact same thing in real arithmetic: the machine rejects the input because it lies outside the domain.`,
            },
          },
        },
        { eq: R`\operatorname{Dom}\!\left(\frac{1}{x-a}\right) = \mathbb{R}\setminus\{a\}, \qquad \operatorname{Dom}(\sqrt{x-a}) = [a,\infty), \qquad \operatorname{Dom}(\ln(x-a)) = (a,\infty)` },
        {
          example: {
            title: { tr: "Tanım kümesi bulma ve değer hesaplama", en: "Finding a domain and evaluating a function" },
            problem: {
              tr: R`\(f(x) = \sqrt{x - 2} + \frac{1}{x - 5}\) fonksiyonunun en geniş reel tanım kümesini bulun ve \(f(6)\) değerini hesaplayın.`,
              en: R`Find the largest real domain of \(f(x) = \sqrt{x - 2} + \frac{1}{x - 5}\) and evaluate \(f(6)\).`,
            },
            steps: [
              {
                expr: R`x - 2 \ge 0 \implies x \ge 2`,
                note: { tr: R`Karekökün içi negatif olamaz; bu yüzden \(x\) en az \(2\) olmalıdır.`, en: R`The expression inside the square root must be nonnegative, so \(x \ge 2\).` },
              },
              {
                expr: R`x - 5 \ne 0 \implies x \ne 5`,
                note: { tr: R`Payda sıfır olamayacağı için \(x = 5\) noktasını kümeden çıkarırız.`, en: R`The denominator cannot be zero, so we exclude \(x = 5\).` },
              },
              {
                expr: R`f(6) = \sqrt{6 - 2} + \frac{1}{6 - 5} = \sqrt{4} + \frac{1}{1} = 2 + 1 = 3`,
                note: { tr: R`\(x = 6\) her iki koşulu da sağladığından geçerli bir girdidir; çıktısı \(3\)'tür.`, en: R`Since \(x = 6\) satisfies both conditions, it is a valid input and outputs \(3\).` },
              },
            ],
            answer: {
              tr: R`Tanım kümesi \([2, \infty) \setminus \{5\} = [2, 5) \cup (5, \infty)\) ve \(f(6) = 3\).`,
              en: R`Domain is \([2, \infty) \setminus \{5\} = [2, 5) \cup (5, \infty)\), and \(f(6) = 3\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Karekök işareti ve parantez tuzağı", en: "Square-root sign & parenthesis trap" },
            text: {
              tr: R`Reel fonksiyonlarda \(\sqrt{9}\) her zaman <b>yalnızca \(+3\)</b> demektir (\(\pm 3\) değil!). Eğer iki çıktı verseydi fonksiyon kuralı bozulurdu. Ayrıca \(f(x + 1)\) ifadesi \(f(x) + 1\) ile aynı şey değildir: ilkinde \(x\) yerine \(x+1\) yazarız, ikincisinde sonuca \(1\) ekleriz.`,
              en: R`In real functions, \(\sqrt{9}\) ALWAYS means <b>only \(+3\)</b> (never \(\pm 3\)!), otherwise it would violate the single-output rule. Also, \(f(x + 1)\) is NOT the same as \(f(x) + 1\): the first replaces every \(x\) by \(x + 1\), while the second adds \(1\) afterward.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`\(\sqrt{x+2}\) seçip \(x_0\)'ı kırmızı yasak bölgeye (\(x_0 < -2\)) kaydırın — makinenin neden çıktı veremediğini görün.`, en: R`Select \(\sqrt{x+2}\) and slide \(x_0\) into the red forbidden region (\(x_0 < -2\)) to see why the machine rejects the input.` },
            { tr: R`\(\frac{1}{x-1}\) seçip \(x_0 = 1\)'in hemen soluna ve sağına bakın: grafik [[asymptote|dikey asimptotta]] kopar.`, en: R`Switch to \(\frac{1}{x-1}\) and step just left and right of \(x_0 = 1\) to watch the [[asymptote|vertical asymptote]] split the graph.` },
            { tr: R`\(x^2 - 1\) seçin: tüm reel sayılar geçerlidir, ancak çıktı hiçbir zaman \(-1\)'in altına inmez (görüntü kümesi \([-1, \infty)\)).`, en: R`Pick \(x^2 - 1\): every real input works, yet the output never drops below \(-1\) (range is \([-1, \infty)\)).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.dom ??= { fn: "sqrt", x0: 2 });
        const fns = {
          sqrt: {
            name: "√(x+2)",
            tex: R`\sqrt{x+2}`,
            f: (x) => (x >= -2 ? Math.sqrt(x + 2) : NaN),
            valid: (x) => x >= -2,
            badBands: [{ axis: "x", from: -5, to: -2, color: "rgba(208,59,59,0.10)", border: COLORS.bad }],
            goodBands: [{ axis: "x", from: -2, to: 5, color: "rgba(27,175,122,0.07)" }],
            domTex: R`[-2,\infty)`,
            ranTex: R`[0,\infty)`,
            xRange: [-2, 5],
            whyBad: { tr: "Kök içi negatif (x + 2 < 0) → reel çıktı yok!", en: "Inside root is negative (x + 2 < 0) → no real output!" },
          },
          recip: {
            name: "1/(x−1)",
            tex: R`\frac{1}{x-1}`,
            f: (x) => (Math.abs(x - 1) > 1e-3 ? 1 / (x - 1) : NaN),
            valid: (x) => Math.abs(x - 1) > 0.04,
            badBands: [],
            goodBands: [{ axis: "x", from: -5, to: 5, color: "rgba(27,175,122,0.05)" }],
            asym: 1,
            domTex: R`\mathbb{R}\setminus\{1\}`,
            ranTex: R`\mathbb{R}\setminus\{0\}`,
            whyBad: { tr: "x = 1 iken payda 0 oluyor → sıfıra bölme yasak!", en: "At x = 1 the denominator is 0 → division by zero is forbidden!" },
          },
          ln: {
            name: "ln(x+1)",
            tex: R`\ln(x+1)`,
            f: (x) => (x > -1 ? Math.log(x + 1) : NaN),
            valid: (x) => x > -1 + 1e-4,
            badBands: [{ axis: "x", from: -5, to: -1, color: "rgba(208,59,59,0.10)", border: COLORS.bad }],
            goodBands: [{ axis: "x", from: -1, to: 5, color: "rgba(27,175,122,0.07)" }],
            domTex: R`(-1,\infty)`,
            ranTex: R`\mathbb{R}`,
            xRange: [-0.999, 5],
            whyBad: { tr: "Logaritma içi ≤ 0 (x + 1 ≤ 0) → tanımsız!", en: "Logarithm input ≤ 0 (x + 1 ≤ 0) → undefined!" },
          },
          parab: {
            name: "x² − 1",
            tex: R`x^2 - 1`,
            f: (x) => x * x - 1,
            valid: () => true,
            badBands: [],
            goodBands: [{ axis: "y", from: -1, to: 4.5, color: "rgba(42,120,214,0.07)", border: COLORS.c1 }],
            domTex: R`\mathbb{R}`,
            ranTex: R`[-1,\infty)`,
            whyBad: { tr: "", en: "" },
          },
        };
        const ctl = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, plotHost, calc, msg);
        const plot = createCanvas2D(plotHost, { height: 265 });

        const draw = () => {
          const cur = fns[s.fn];
          const ok = cur.valid(s.x0);
          const y0 = ok ? cur.f(s.x0) : NaN;
          const lines = cur.asym != null ? [{ a: 1, b: 0, c: -cur.asym, color: COLORS.bad, dash: [5, 4], label: `x = ${cur.asym}` }] : [];
          const segs = [];
          const pts = [];
          if (ok && Number.isFinite(y0) && Math.abs(y0) <= 4.5) {
            segs.push(
              { from: [s.x0, 0], to: [s.x0, y0], color: COLORS.c2, dash: [4, 3], width: 1.8 },
              { from: [s.x0, y0], to: [0, y0], color: COLORS.c3, dash: [4, 3], width: 1.8 },
            );
            pts.push(
              { x: s.x0, y: 0, color: COLORS.c2, r: 4.5, label: `x₀` },
              { x: s.x0, y: y0, color: COLORS.c1, r: 6, ring: true, label: `(${ns(s.x0, 2)}, ${ns(y0, 2)})` },
              { x: 0, y: y0, color: COLORS.c3, r: 4.5, label: `y₀` },
            );
          } else {
            pts.push({ x: s.x0, y: 0, color: COLORS.bad, r: 5.5, hollow: true, label: `x₀` });
          }
          plot.draw({
            x: [-4.5, 4.5],
            y: [-3.5, 4.5],
            xLabel: "x",
            yLabel: "y",
            bands: [...cur.badBands, ...cur.goodBands],
            lines,
            curves: [{ f: cur.f, color: COLORS.c1, width: 2.7, xRange: cur.xRange }],
            segments: segs,
            points: pts,
          });
          if (ok && Number.isFinite(y0)) {
            calc.textContent = `\\(f(x) = ${cur.tex},\\quad \\operatorname{Dom}=${cur.domTex},\\quad \\operatorname{Im}=${cur.ranTex},\\quad ${tx(s.x0, 2)} \\mapsto ${tx(y0, 3)}\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Geçerli girdi! Makine x₀ = ${ns(s.x0, 2)} değerini tek bir çıktıya eşledi: f(x₀) = ${ns(y0, 3)}.`,
              en: `Valid input! The machine maps x₀ = ${ns(s.x0, 2)} to the single output f(x₀) = ${ns(y0, 3)}.`,
            });
          } else {
            calc.textContent = `\\(f(x) = ${cur.tex},\\quad \\operatorname{Dom}=${cur.domTex},\\quad \\operatorname{Im}=${cur.ranTex}\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L(cur.whyBad);
          }
        };

        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("x₀", { min: -4, max: 4, step: 0.2, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "fn-injective",
      mathId: "m-fn-inv",
      title: { tr: "Birebirlik, Örtenlik ve Yatay Doğru Testi", en: "Injectivity, Surjectivity & Horizontal-Line Test" },
      body: [
        {
          tr: R`Bir makineyi <b>geriye doğru</b> çalıştırabilmek ([[inverse-fn|tersini]] alabilmek) için her çıktının yalnızca tek bir girdiden gelmesi gerekir; buna [[injective|birebirlik]] (injektiflik) denir. Formüldeki \(\implies\) oku <i>"ise"</i> (gerektirir) anlamına gelir: çıktılar eşitse girdiler de mecburen aynı olmalıdır.`,
          en: R`To run a function machine <b>in reverse</b> (take its [[inverse-fn|inverse]]), every output must come from at most one input — this property is [[injective|injectivity]] (one-to-one). The arrow \(\implies\) reads <i>"implies"</i>: equal outputs must come from equal inputs.`,
        },
        {
          tr: R`Eğer hedef kümedeki her değer en az bir kez vuruluyorsa fonksiyon <b>örten</b> (sürjektif), hem birebir hem örtense <b>bijektif</b>tir. Grafikte bunu anında görmek için yatay \(y = c\) doğrusunu kaydırırız: doğru eğriyi birden fazla noktada kesiyorsa fonksiyon birebir <b>değildir</b>!`,
          en: R`If every element in the target codomain is hit at least once, the function is <b>surjective</b> (onto); being both injective and surjective makes it <b>bijective</b>. Visually, sweep a horizontal line \(y = c\) across the graph: if it crosses the curve more than once, the function is <b>not</b> injective!`,
        },
        {
          analogy: {
            title: { tr: "Öğrenci Numarası vs. Doğum Günü", en: "Student ID vs. Birthday" },
            text: {
              tr: R`Sınıftaki her öğrencinin <b>öğrenci numarası</b> birebirdir: numarayı söylerseniz hangi öğrenci olduğunu tek hamlede geri bulabilirsiniz. Oysa <b>doğum günü</b> birebir değildir: "12 Mayıs" dediğinizde iki farklı öğrenci çıkabilir, hangisi olduğunu kesin olarak geri bulamazsınız!`,
              en: R`Mapping each student to their <b>student ID</b> is injective: given an ID, you can uniquely trace back the exact student. Mapping each student to their <b>birthday</b> is NOT injective: two different students can share May 12, so you cannot reverse the lookup!`,
            },
          },
        },
        { eq: R`f(x_1) = f(x_2) \implies x_1 = x_2 \quad (\text{birebir / injective})` },
        {
          example: {
            title: { tr: "x² fonksiyonunu birebir hâle getirmek", en: "Making x² injective by restricting its domain" },
            problem: {
              tr: R`\(f(x) = x^2\) fonksiyonunun tüm \(\mathbb{R}\)'de neden birebir olmadığını gösterin ve nasıl birebir yapılabileceğini açıklayın.`,
              en: R`Explain why \(f(x) = x^2\) fails injectivity on all of \(\mathbb{R}\), and how to fix it.`,
            },
            steps: [
              {
                expr: R`f(-2) = (-2)^2 = 4 \quad \text{ve} \quad f(2) = 2^2 = 4`,
                note: { tr: R`İki farklı girdi (\(-2 \ne 2\)) aynı \(4\) çıktısını veriyor; \(y = 4\) yatay doğrusu grafiği iki kez kesiyor.`, en: R`Two distinct inputs (\(-2 \ne 2\)) yield the same output \(4\), so \(y = 4\) crosses the parabola twice.` },
              },
              {
                expr: R`x \ge 0 \implies \big(x_1^2 = x_2^2 \implies x_1 = x_2\big)`,
                note: { tr: R`Tanım kümesini \([0, \infty)\) ile kısıtlarsak yalnızca sağ kol kalır ve her yatay doğru grafiği en fazla bir kez keser.`, en: R`Restricting the domain to \([0, \infty)\) keeps only the right branch, where every horizontal line crosses at most once.` },
              },
            ],
            answer: {
              tr: R`\(x^2\) tüm \(\mathbb{R}\)'de birebir değildir, ama \([0, \infty) \to [0, \infty)\) üzerinde bijektiftir (tersi \(\sqrt{x}\)).`,
              en: R`\(x^2\) is not injective on \(\mathbb{R}\), but it IS bijective on \([0, \infty) \to [0, \infty)\) (with inverse \(\sqrt{x}\)).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Dikey doğru testi ≠ Yatay doğru testi", en: "Vertical-line test ≠ Horizontal-line test" },
            text: {
              tr: R`İki testi karıştırmayın! <b>Dikey</b> doğru testi <i>"Bu grafik bir fonksiyon mu?"</i> sorusunu yanıtlar. <b>Yatay</b> doğru testi ise <i>"Bu fonksiyon birebir (tersi alınabilir) mi?"</i> sorusunu yanıtlar.`,
              en: R`Never mix up the two tests! The <b>vertical</b>-line test asks <i>"Is this curve a function at all?"</i> The <b>horizontal</b>-line test asks <i>"Is this function injective (invertible)?"</i>`,
            },
          },
        },
        {
          tryList: [
            { tr: R`\(x^2\) seçiliyken \(c = 2\) ile \(c = -1\)'i karşılaştırın: \(c = 2\)'de 2 kesişim (birebir değil), \(c = -1\)'de 0 kesişim (örten değil!).`, en: R`With \(x^2\) selected, compare \(c = 2\) (2 crossings → not injective) and \(c = -1\) (0 crossings → not surjective onto \(\mathbb{R}\)).` },
            { tr: R`\(x^2\ (x \ge 0)\) seçeneğine tıklayıp kısıtlamanın ikinci kesişimi nasıl yok ettiğini izleyin.`, en: R`Switch to \(x^2\ (x \ge 0)\) and watch domain restriction eliminate the duplicate intersection.` },
            { tr: R`\(x^3\) ve \(e^x\) seçip \(c\)'yi kaydırın: kesin artan oldukları için hiçbir yatay doğru grafiği iki kez kesemez.`, en: R`Try \(x^3\) and \(e^x\): because they strictly increase, no horizontal line ever crosses them twice.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.inj ??= { fn: "sq", c: 1.5 });
        const fns = {
          sq: { name: "x²", f: (x) => x * x, roots: (c) => (c > 0 ? [-Math.sqrt(c), Math.sqrt(c)] : c === 0 ? [0] : []) },
          sqPos: { name: "x² (x≥0)", f: (x) => x * x, xRange: [0, 4.5], roots: (c) => (c >= 0 ? [Math.sqrt(c)] : []) },
          cube: { name: "x³", f: (x) => (x * x * x) / 3, roots: (c) => [Math.cbrt(3 * c)] },
          sin: {
            name: "sin(x)",
            f: (x) => Math.sin(x),
            roots: (c) => {
              if (Math.abs(c) > 1) return [];
              const a = Math.asin(c);
              return [-Math.PI - a, a, Math.PI - a, 2 * Math.PI + a].filter((x) => x >= -4.5 && x <= 4.5);
            },
          },
          exp: { name: "eˣ", f: (x) => Math.exp(x / 1.5), roots: (c) => (c > 0 ? [1.5 * Math.log(c)] : []) },
        };
        const ctl = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, plotHost, msg);
        const plot = createCanvas2D(plotHost, { height: 270 });

        const draw = () => {
          const cur = fns[s.fn];
          const xs = cur.roots(s.c).filter((x) => x >= -4.5 && x <= 4.5);
          plot.draw({
            x: [-4.5, 4.5],
            y: [-3.5, 4.5],
            xLabel: "x",
            yLabel: "y",
            curves: [
              ...(s.fn === "sqPos" ? [{ f: (x) => x * x, color: COLORS.muted, width: 1.4, dash: [4, 4], xRange: [-4.5, 0] }] : []),
              { f: cur.f, color: COLORS.c1, width: 2.6, xRange: cur.xRange },
            ],
            lines: [{ a: 0, b: 1, c: -s.c, color: COLORS.c2, dash: [6, 4], label: `y = ${ns(s.c, 2)}` }],
            points: xs.map((x) => ({ x, y: s.c, color: xs.length > 1 ? COLORS.bad : COLORS.c3, r: 6, ring: true })),
          });
          if (xs.length > 1) {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `y = ${ns(s.c, 2)} doğrusu grafiği ${xs.length} noktada kesiyor → birebir DEĞİL!`,
              en: `y = ${ns(s.c, 2)} crosses the graph ${xs.length} times → NOT injective!`,
            });
          } else if (xs.length === 1) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Tek kesişim (x ≈ ${ns(xs[0], 2)}). Bu düzeyde her çıktıya tek bir girdi karşılık geliyor.`,
              en: `Unique intersection (x ≈ ${ns(xs[0], 2)}). A single input maps to this output.`,
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `y = ${ns(s.c, 2)} görüntü kümesinde değil (kesişim yok → ℝ üzerine örten değil).`,
              en: `y = ${ns(s.c, 2)} is outside the range (no intersection → not surjective onto ℝ).`,
            });
          }
        };

        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("c", { min: -2.5, max: 3.5, step: 0.1, value: s.c, onInput: (v) => { s.c = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "fn-transform",
      mathId: "m-fn-basics",
      title: { tr: "Grafik Dönüşümleri: Ölçekleme, Yansıma ve Öteleme", en: "Graph Transformations: Scaling, Reflection & Shifting" },
      body: [
        {
          tr: R`Tek bir temel fonksiyonun grafiğini bildiğinizde tüm ailesini çizebilirsiniz: \(g(x) = a\,f(b(x - c)) + d\). Burada <b>dış parametreler</b> (\(a\) ve \(d\)) dikey eksende beklediğiniz gibi davranır: \(a\) dikey gerer (\(a < 0\) ise ters çevirir), \(d\) yukarı-aşağı öteler.`,
          en: R`Once you know one parent curve, you know an entire family: \(g(x) = a\,f(b(x - c)) + d\). The <b>outer parameters</b> (\(a\) and \(d\)) act vertically just as intuition expects: \(a\) stretches vertically (and flips upside down if \(a < 0\)), while \(d\) shifts up or down.`,
        },
        {
          tr: R`Buna karşılık <b>iç parametreler</b> (\(b\) ve \(c\)) yatay eksende <b>ters yönde</b> çalışır! \(b > 1\) grafiği yatayda <i>sıkıştırır</i> (çünkü \(x\)'in \(b\) kat daha küçük değişimi aynı etkiyi yapar) ve \((x - c)\) grafiği <i>sağa</i> \(c\) birim kaydırır.`,
          en: R`In contrast, the <b>inner parameters</b> (\(b\) and \(c\)) act horizontally in the <b>opposite</b> direction! Setting \(b > 1\) <i>compresses</i> the graph horizontally (everything happens \(b\) times faster), and \((x - c)\) shifts the graph <i>right</i> by \(c\).`,
        },
        {
          analogy: {
            title: { tr: "Video Oynatma Hızı ve Başlangıç Saati", en: "Video Playback Speed & Start Time" },
            text: {
              tr: R`Bir videoyu \(2\times\) hızla izlerseniz (\(f(2t)\)) film yarı sürede biter — yani zaman ekseni yatayda <b>2 kat sıkışır</b>! Film saat \(0\) yerine \(3\) saat geç başlarsa (\(f(t - 3)\)), olaylar zaman çizelgesinde \(3\) birim <b>sağa</b> kayar.`,
              en: R`Playing a movie at \(2\times\) speed (\(f(2t)\)) finishes it in half the time — the horizontal timeline <b>compresses by 2</b>! Starting the movie \(3\) hours later (\(f(t - 3)\)) moves every scene \(3\) units to the <b>right</b>.`,
            },
          },
        },
        { eq: R`g(x) = a\,f\!\big(b(x - c)\big) + d` },
        {
          example: {
            title: { tr: "İç ifadeyi çarpanına ayırarak dönüşüm okumak", en: "Factoring the inside to read transformations" },
            problem: {
              tr: R`\(g(x) = -2\,|2x - 6| + 1\) grafiğinin \(f(x) = |x|\) grafiğinden hangi adımlarla elde edildiğini bulun.`,
              en: R`Describe step by step how \(g(x) = -2\,|2x - 6| + 1\) is obtained from \(f(x) = |x|\).`,
            },
            steps: [
              {
                expr: R`2x - 6 = 2(x - 3) \implies g(x) = -2\,|2(x - 3)| + 1`,
                note: { tr: R`Önce \(x\)'in katsayısını mutlaka paranteze alırız: \(b = 2\) ve \(c = 3\).`, en: R`Always factor out the coefficient of \(x\) first: \(b = 2\) and \(c = 3\).` },
              },
              {
                expr: R`b = 2 \ (\text{yatay } \tfrac{1}{2}\text{ sıkışma}), \quad c = 3 \ (\text{3 birim sağa})`,
                note: { tr: R`Grafik yatayda \(2\) kat sıkışır ve köşe noktası \(x = 0\)'dan \(x = 3\)'e sağa kayar.`, en: R`The graph compresses horizontally by \(2\) and its corner moves right from \(x = 0\) to \(x = 3\).` },
              },
              {
                expr: R`a = -2 \ (\text{dikey 2 kat + ters çevirme}), \quad d = 1 \ (\text{1 birim yukarı})`,
                note: { tr: R`Dikeyde \(2\) kat uzar, \(x\)-eksenine göre aşağı çevrilir ve \(1\) birim yukarı çıkar; yeni tepe \((3, 1)\) olur.`, en: R`It stretches vertically by \(2\), flips upside down across the \(x\)-axis, and lifts by \(1\), putting the peak at \((3, 1)\).` },
              },
            ],
            answer: {
              tr: R`Köşesi \((3, 1)\)'de olan, aşağı bakan ve kolları \(4\) kat dikleşmiş V-grafiği.`,
              en: R`A downward-opening V with vertex at \((3, 1)\) and slopes \(\pm 4\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "En klasik sınav tuzağı: f(2x − 6) ≠ 6 birim sağa!", en: "Classic exam trap: f(2x − 6) is NOT shifted by 6!" },
            text: {
              tr: R`\(f(2x - 6)\) ifadesini görüp "6 birim sağa kayar" demek çok yaygın bir hatadır. Yatay ötelemeyi okumak için \(x\) yalnız kalmalıdır: \(2x - 6 = 2(x - 3)\) olduğundan gerçek kayma <b>3 birim sağadır</b>!`,
              en: R`Never read \(f(2x - 6)\) as "shift right by 6." You must isolate \(x\) inside the inner factor: \(2x - 6 = 2(x - 3)\), so the true horizontal shift is <b>3 units right</b>!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`"Yatay sıkıştır (b=2)" hazır ayarına tıklayın ve sinüs dalgasının aynı aralıkta iki kat sık salındığını görün.`, en: R`Click "Compress (b=2)" and watch the sine wave complete twice as many cycles in the same window.` },
            { tr: R`"Ters çevir (a=−1)" ile grafiğin \(x\)-eksenine göre nasıl ayna görüntüsü aldığını gözlemleyin.`, en: R`Click "Flip (a=−1)" to mirror the curve vertically across the \(x\)-axis.` },
            { tr: R`\(f(x) = |x|\) seçip \(c = 2, d = -1\) yapın: V'nin sivri köşesi tam \((2, -1)\) noktasına taşınır!`, en: R`Pick \(|x|\) and set \(c = 2, d = -1\): the sharp corner lands right at \((2, -1)\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.tr ??= { base: "sin", a: 1.5, b: 1, c: 0, d: 0 });
        const bases = {
          sin: { name: "sin(x)", f: (x) => Math.sin(x) },
          abs: { name: "|x|", f: (x) => Math.abs(x) },
          sq: { name: "0.5x²", f: (x) => 0.5 * x * x },
          exp: { name: "eˣ", f: (x) => Math.exp(x) },
        };
        const ctl1 = h("div", { class: "t-controls" });
        const presets = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const readout = h("div", { class: "pc-calc" });
        box.append(ctl1, presets, ctl2, plotHost, readout);
        const plot = createCanvas2D(plotHost, { height: 260 });

        let slA, slB, slC, slD;
        const syncSliders = () => {
          slA.set(s.a);
          slB.set(s.b);
          slC.set(s.c);
          slD.set(s.d);
        };
        const draw = () => {
          const base = bases[s.base];
          plot.draw({
            x: [-5, 5],
            y: [-4, 4],
            xLabel: "x",
            yLabel: "y",
            curves: [
              { f: base.f, color: COLORS.muted, width: 1.7, dash: [5, 4] },
              { f: (x) => s.a * base.f(s.b * (x - s.c)) + s.d, color: COLORS.c1, width: 2.7 },
            ],
            points: s.base === "abs" || s.base === "sq"
              ? [{ x: s.c, y: s.d, color: COLORS.c2, r: 5.5, ring: true, label: `(${ns(s.c, 1)}, ${ns(s.d, 1)})` }]
              : [],
          });
          readout.textContent = `\\(g(x) = ${tx(s.a, 1)}\\cdot f\\big(${tx(s.b, 1)}(x ${s.c >= 0 ? "-" : "+"} ${tx(Math.abs(s.c), 1)})\\big) ${s.d >= 0 ? "+" : "-"} ${tx(Math.abs(s.d), 1)}\\)`;
        };
        const setPreset = (a, b, c, d) => {
          s.a = a; s.b = b; s.c = c; s.d = d;
          syncSliders();
          draw();
        };
        ctl1.append(segmented(Object.entries(bases).map(([k, v]) => [k, v.name]), s.base, (v) => { s.base = v; draw(); }));
        presets.append(
          makePresetBtn({ tr: "Sıfırla", en: "Reset" }, () => setPreset(1, 1, 0, 0)),
          makePresetBtn({ tr: "Yatay sıkıştır (b=2)", en: "Compress (b=2)" }, () => setPreset(1, 2, 0, 0)),
          makePresetBtn({ tr: "Sağa + Yukarı", en: "Right + Up" }, () => setPreset(1, 1, 2, 1)),
          makePresetBtn({ tr: "Ters çevir (a=−1)", en: "Flip (a=−1)" }, () => setPreset(-1, 1, 0, 0)),
        );
        slA = slider("a", { min: -2.5, max: 2.5, step: 0.1, value: s.a, onInput: (v) => { s.a = v; draw(); } });
        slB = slider("b", { min: 0.2, max: 3, step: 0.1, value: s.b, onInput: (v) => { s.b = v; draw(); } });
        slC = slider("c", { min: -3, max: 3, step: 0.2, value: s.c, onInput: (v) => { s.c = v; draw(); } });
        slD = slider("d", { min: -2.5, max: 2.5, step: 0.2, value: s.d, onInput: (v) => { s.d = v; draw(); } });
        ctl2.append(slA, slB, slC, slD);
        draw();
      },
    },
    {
      id: "fn-inverse",
      mathId: "m-fn-inv",
      title: { tr: "Ters Fonksiyon ve y = x Ayna Simetrisi", en: "Inverse Functions & Reflection Across y = x" },
      body: [
        {
          tr: R`Bir \(f\) fonksiyonu birebirse onun yaptığı işlemi tamamen geri alan [[inverse-fn|\(f^{-1}\)]] (<i>"\(f\)'in tersi"</i>) fonksiyonu vardır: \((x_0, y_0)\) noktası \(f\) üzerindeyse, koordinatları yer değişmiş \((y_0, x_0)\) noktası \(f^{-1}\) üzerindedir. \(x\) ile \(y\)'yi değiştirmek geometrik olarak grafiği <b>\(y = x\) aynasından yansıtmaktır</b>.`,
          en: R`Whenever \(f\) is injective, it has an [[inverse-fn|inverse]] \(f^{-1}\) (read <i>"\(f\) inverse"</i>) that completely undoes \(f\). If \((x_0, y_0)\) lies on the graph of \(f\), swapping coordinates puts \((y_0, x_0)\) on the graph of \(f^{-1}\). Geometrically, swapping \(x\) and \(y\) <b>reflects the curve across the mirror line \(y = x\)</b>.`,
        },
        {
          analogy: {
            title: { tr: "Çorap ve Ayakkabı Giymek / Geri Al (Ctrl+Z)", en: "Socks & Shoes / Undo (Ctrl+Z)" },
            text: {
              tr: R`Sabah önce çorap sonra ayakkabı giyersiniz; akşam çıkarırken işlemi <b>tersten</b> yaparsınız: önce ayakkabı, sonra çorap! Aynı şekilde \(f(x) = 2x + 3\) önce \(2\) ile çarpıp sonra \(3\) ekliyorsa, tersi \(f^{-1}(y) = \frac{y - 3}{2}\) önce \(3\) çıkarıp sonra \(2\)'ye böler.`,
              en: R`In the morning you put on socks then shoes; to undo it at night you reverse every step: shoes off first, then socks! Likewise, since \(f(x) = 2x + 3\) multiplies by \(2\) then adds \(3\), its inverse \(f^{-1}(y) = \frac{y - 3}{2}\) subtracts \(3\) then divides by \(2\).`,
            },
          },
        },
        { eq: R`f^{-1}\!\big(f(x)\big) = x, \qquad y = e^x \iff x = \ln y, \qquad y = \sinh x \iff x = \operatorname{arsinh} y` },
        {
          example: {
            title: { tr: "Doğrusal fonksiyonun tersini bulma ve doğrulama", en: "Finding and checking an inverse function" },
            problem: {
              tr: R`\(f(x) = 2x + 3\) fonksiyonunun tersi \(f^{-1}(x)\)'i bulun ve \(f^{-1}(7)\)'yi doğrulayın.`,
              en: R`Find the inverse \(f^{-1}(x)\) of \(f(x) = 2x + 3\) and verify \(f^{-1}(7)\).`,
            },
            steps: [
              {
                expr: R`y = 2x + 3`,
                note: { tr: R`Çıktıya \(y\) adını verip \(x\)'i yalnız bırakmayı hedefleriz.`, en: R`Write \(y = f(x)\) and solve for the input \(x\).` },
              },
              {
                expr: R`y - 3 = 2x \implies x = \frac{y - 3}{2}`,
                note: { tr: R`Önce \(3\) çıkarır, sonra \(2\)'ye böleriz.`, en: R`Subtract \(3\), then divide both sides by \(2\).` },
              },
              {
                expr: R`f^{-1}(x) = \frac{x - 3}{2}, \qquad f^{-1}(7) = \frac{7 - 3}{2} = 2`,
                note: { tr: R`Son olarak değişken adını tekrar \(x\) yazarız. Kontrol: \(f(2) = 2(2) + 3 = 7\) ✓!`, en: R`Rename the variable back to \(x\). Check: \(f(2) = 2(2) + 3 = 7\) ✓!` },
              },
            ],
            answer: {
              tr: R`\(f^{-1}(x) = \frac{x - 3}{2}\) ve \(f^{-1}(7) = 2\).`,
              en: R`\(f^{-1}(x) = \frac{x - 3}{2}\) and \(f^{-1}(7) = 2\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Üstteki −1 kuvvet DEĞİLDİR!", en: "The −1 superscript is NOT a reciprocal!" },
            text: {
              tr: R`Matematikteki en meşhur gösterim tuzağı: \(f^{-1}(x)\) <b>kesinlikle \(\frac{1}{f(x)}\) değildir!</b> Örneğin \(\sin^{-1}(x) = \arcsin(x)\) iken, \(\frac{1}{\sin x} = \csc x\) bambaşka bir fonksiyondur.`,
              en: R`The most famous notation trap in calculus: \(f^{-1}(x)\) does <b>NOT mean \(\frac{1}{f(x)}\)!</b> For instance, \(\sin^{-1}(x) = \arcsin(x)\), whereas \(\frac{1}{\sin x} = \csc x\) is a completely different function.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`\(e^x\) seçip \(x_0 = 0\) yapın: mavi nokta \((0, 1)\), turuncu ayna noktası \((1, 0)\) olur — yani \(e^0 = 1 \iff \ln 1 = 0\).`, en: R`Pick \(e^x\) and set \(x_0 = 0\): \((0, 1)\) mirrors to \((1, 0)\), visualizing \(e^0 = 1 \iff \ln 1 = 0\).` },
            { tr: R`\(\sin x\) seçin: yalnızca \([-\pi/2, \pi/2]\) aralığının çizildiğine ve \(\arcsin x\)'in görüntü kümesinin bu yüzden \([-\pi/2, \pi/2]\) olduğuna dikkat edin.`, en: R`Select \(\sin x\): notice only \([-\pi/2, \pi/2]\) is drawn so that \(\arcsin x\) stays a valid single-valued function.` },
            { tr: R`\(\cosh x\) seçip neden \(x \ge 0\) sağ kolunun alındığını ve tersinin \([1, \infty)\)'dan başladığını görün.`, en: R`Select \(\cosh x\) and observe why only the \(x \ge 0\) branch is mirrored, starting \(\operatorname{arcosh}\) at \(x = 1\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.inv ??= { fn: "exp", x0: 0.8 });
        const ctl = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const out = h("div", { class: "pc-calc" });
        box.append(ctl, plotHost, out);
        const plot = createCanvas2D(plotHost, { height: 290 });

        const draw = () => {
          const item = TRANS_FNS[s.fn];
          const xRange = s.fn === "sin" ? [-Math.PI / 2, Math.PI / 2] : s.fn === "tan" ? [-1.45, 1.45] : s.fn === "cosh" ? [0, 3.5] : undefined;
          const x0 = xRange ? Math.max(xRange[0] + 0.05, Math.min(xRange[1] - 0.05, s.x0)) : s.x0;
          const y0 = item.f(x0);
          plot.draw({
            x: [-3.5, 3.5],
            y: [-3.5, 3.5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a: 1, b: -1, c: 0, color: COLORS.muted, dash: [5, 4], label: "y = x" }],
            curves: [
              { f: item.f, color: COLORS.c1, width: 2.6, xRange },
              { f: item.inv, color: COLORS.c2, width: 2.6 },
            ],
            segments: [{ from: [x0, y0], to: [y0, x0], color: COLORS.c3, dash: [4, 3], width: 1.6 }],
            points: [
              { x: x0, y: y0, color: COLORS.c1, r: 5.5, label: `(${ns(x0, 2)}, ${ns(y0, 2)})` },
              { x: y0, y: x0, color: COLORS.c2, r: 5.5, label: `(${ns(y0, 2)}, ${ns(x0, 2)})` },
            ],
          });
          out.textContent = `\\(f(${tx(x0, 2)}) = ${tx(y0, 2)}\\iff f^{-1}(${tx(y0, 2)}) = ${tx(x0, 2)},\\quad f^{-1}(x)=${item.invName}\\)`;
        };
        ctl.append(
          segmented(Object.entries(TRANS_FNS).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("x₀", { min: -2, max: 2, step: 0.05, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "fn-hyperbolic",
      mathId: "m-fn-hyp",
      title: { tr: "Hiperbolik Fonksiyonlar ve Birim Hiperbol", en: "Hyperbolic Functions & The Unit Hyperbola" },
      body: [
        {
          tr: R`[[transcendental|Hiperbolik fonksiyonlar]] \(\cosh x\) (<i>"hiperbolik kosinüs"</i>) ve \(\sinh x\) (<i>"hiperbolik sinüs"</i>) gizemli yeni nesneler değil, sadece \(e^x\) ile \(e^{-x}\)'in ortalaması ve yarı farkıdır! Nasıl \((\cos t, \sin t)\) noktası \(x^2 + y^2 = 1\) birim çemberinde geziyorsa, \((\cosh t, \sinh t)\) noktası da \(x^2 - y^2 = 1\) <b>birim hiperbolünün</b> sağ kolunda gezer.`,
          en: R`The [[transcendental|hyperbolic functions]] \(\cosh x\) (<i>"hyperbolic cosine"</i>) and \(\sinh x\) (<i>"hyperbolic sine"</i>) are nothing mysterious — they are simply the average and half-difference of \(e^x\) and \(e^{-x}\)! Just as \((\cos t, \sin t)\) traces the unit circle \(x^2 + y^2 = 1\), the point \((\cosh t, \sinh t)\) glides along the right branch of the <b>unit hyperbola</b> \(x^2 - y^2 = 1\).`,
        },
        {
          analogy: {
            title: { tr: "Asılı Zincir (Katenar) ve Çemberin İkizi", en: "The Hanging Chain & Twin of the Circle" },
            text: {
              tr: R`Bir kolyeyi veya elektrik telini iki ucundan tutup serbest bırakın: yerçekimi altında aldığı o zarif kavis parabol değil, tam olarak \(y = \cosh x\) (<i>katenar</i>) eğrisidir! Ayrıca \(\cosh x\) her zaman \(\ge 1\)'dir ve çift fonksiyondur (\(\cosh(-x) = \cosh x\)); \(\sinh x\) ise tek fonksiyondur (\(\sinh(-x) = -\sinh x\)).`,
              en: R`Hold a necklace or power cable by its two ends and let it hang freely: that graceful curve is NOT a parabola — it is literally \(y = \cosh x\) (a <i>catenary</i>)! Notice also that \(\cosh x \ge 1\) is always even (\(\cosh(-x) = \cosh x\)), while \(\sinh x\) is odd (\(\sinh(-x) = -\sinh x\)).`,
            },
          },
        },
        { eq: R`\cosh x = \frac{e^x + e^{-x}}{2}, \qquad \sinh x = \frac{e^x - e^{-x}}{2}, \qquad \cosh^2 x - \sinh^2 x = 1` },
        {
          example: {
            title: { tr: "ln 2 noktasında cosh ve sinh hesabı", en: "Evaluating cosh and sinh at ln 2" },
            problem: {
              tr: R`\(\cosh(\ln 2)\) ve \(\sinh(\ln 2)\) değerlerini hesaplayıp \(\cosh^2 x - \sinh^2 x = 1\) özdeşliğini doğrulayın.`,
              en: R`Compute \(\cosh(\ln 2)\) and \(\sinh(\ln 2)\), then verify \(\cosh^2 x - \sinh^2 x = 1\).`,
            },
            steps: [
              {
                expr: R`e^{\ln 2} = 2, \qquad e^{-\ln 2} = \frac{1}{e^{\ln 2}} = \frac{1}{2}`,
                note: { tr: R`Önce \(e^x\) ve \(e^{-x}\) parçalarını hesaplıyoruz.`, en: R`First evaluate the two exponential pieces \(e^x\) and \(e^{-x}\).` },
              },
              {
                expr: R`\cosh(\ln 2) = \frac{2 + \tfrac{1}{2}}{2} = \frac{5}{4}, \qquad \sinh(\ln 2) = \frac{2 - \tfrac{1}{2}}{2} = \frac{3}{4}`,
                note: { tr: R`Toplamın yarısı \(\cosh\), farkın yarısı \(\sinh\) verir.`, en: R`Half the sum gives \(\cosh\); half the difference gives \(\sinh\).` },
              },
              {
                expr: R`\left(\frac{5}{4}\right)^2 - \left(\frac{3}{4}\right)^2 = \frac{25 - 9}{16} = \frac{16}{16} = 1`,
                note: { tr: R`Birim hiperbol özdeşliği kusursuz sağlanır! Ayrıca \(\frac{5}{4} + \frac{3}{4} = 2 = e^{\ln 2}\) ✓.`, en: R`The unit hyperbola identity holds exactly! Also \(\frac{5}{4} + \frac{3}{4} = 2 = e^{\ln 2}\) ✓.` },
              },
            ],
            answer: {
              tr: R`\(\cosh(\ln 2) = \frac{5}{4}\) ve \(\sinh(\ln 2) = \frac{3}{4}\).`,
              en: R`\(\cosh(\ln 2) = \frac{5}{4}\) and \(\sinh(\ln 2) = \frac{3}{4}\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`"t = 0" düğmesine basın: nokta hiperbolün tepesi \((1, 0)\)'da durur (\(\cosh 0 = 1,\ \sinh 0 = 0\)).`, en: R`Click "t = 0": the point sits at the vertex \((1, 0)\) (\(\cosh 0 = 1,\ \sinh 0 = 0\)).` },
            { tr: R`"t = ln 2" düğmesiyle yukarıdaki çözümlü örneği \((1.25,\ 0.75)\) grafik üzerinde doğrulayın.`, en: R`Click "t = ln 2" to see our worked example \((1.25,\ 0.75)\) live on the hyperbola.` },
            { tr: R`\(t\)'yi \(+1\) ile \(-1\) arasında değiştirip \(\cosh\)'un aynı kaldığını, \(\sinh\)'un işaret değiştirdiğini görün.`, en: R`Toggle between \(t = +1\) and \(t = -1\) to watch \(\cosh\) stay equal while \(\sinh\) flips sign.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.hyp ??= { t: 0.9 });
        const ctl = h("div", { class: "t-controls" });
        const presets = h("div", { class: "t-controls" });
        const plotHost = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, plotHost, calc);
        const plot = createCanvas2D(plotHost, { height: 270 });

        let slT;
        const draw = () => {
          const ch = Math.cosh(s.t);
          const sh = Math.sinh(s.t);
          plot.draw({
            x: [-0.5, 4.5],
            y: [-3, 3],
            equalAspect: true,
            xLabel: "x = cosh t",
            yLabel: "y = sinh t",
            lines: [
              { a: 1, b: -1, c: 0, color: COLORS.muted, dash: [4, 4] },
              { a: 1, b: 1, c: 0, color: COLORS.muted, dash: [4, 4] },
            ],
            parametrics: [
              { fx: (u) => Math.cosh(u), fy: (u) => Math.sinh(u), t0: -2.2, t1: 2.2, color: COLORS.c1, width: 2.6 },
            ],
            segments: [
              { from: [0, 0], to: [ch, sh], color: COLORS.c2, width: 2 },
              { from: [ch, 0], to: [ch, sh], color: COLORS.c3, dash: [4, 3] },
            ],
            points: [{ x: ch, y: sh, color: COLORS.c2, r: 6, ring: true, label: `(${ns(ch, 2)}, ${ns(sh, 2)})` }],
          });
          calc.textContent = `\\(\\cosh(${tx(s.t, 2)})=${tx(ch, 3)},\\; \\sinh(${tx(s.t, 2)})=${tx(sh, 3)},\\; \\cosh^2 t - \\sinh^2 t = ${tx(ch * ch - sh * sh, 4)},\\; e^t = ${tx(ch + sh, 3)}\\)`;
        };
        const setT = (val) => { s.t = val; slT.set(val); draw(); };
        presets.append(
          makePresetBtn({ tr: "t = 0", en: "t = 0" }, () => setT(0)),
          makePresetBtn({ tr: "t = ln 2 ≈ 0.69", en: "t = ln 2 ≈ 0.69" }, () => setT(0.69)),
          makePresetBtn({ tr: "t = −1", en: "t = −1" }, () => setT(-1)),
          makePresetBtn({ tr: "t = +1", en: "t = +1" }, () => setT(1)),
        );
        slT = slider("t", { min: -1.8, max: 1.8, step: 0.01, value: s.t, onInput: (v) => { s.t = v; draw(); } });
        ctl.append(slT);
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Fonksiyon & Bileşke Laboratuvarı", en: "Function & Composition Studio" },
    sub: {
      tr: R`İki fonksiyon \(f(x)\) (dış makine) ve \(g(x)\) (iç makine) seçip [[composition|bileşke]] \((f \circ g)(x) = f(g(x))\) grafiğini canlı inceleyin; fareyle eğrinin üzerine gelerek anlık değerleri okuyun.`,
      en: R`Choose an outer machine \(f(x)\) and an inner machine \(g(x)\) to watch their [[composition|composition]] \((f \circ g)(x) = f(g(x))\) form live; hover anywhere on the plot to read exact values.`,
    },
    experiments: [
      {
        tr: R`<b>Sıra gerçekten önemli mi?</b> Önce <i>"Sıra A: f=x+1, g=0.5x²"</i>, sonra <i>"Sıra B: f=0.5x², g=x+1"</i> hazır ayarına tıklayın ve \(f(g(x))\) ile \(g(f(x))\)'in bambaşka grafikler çizdiğini görün!`,
        en: R`<b>Does order matter?</b> Click <i>"Order A: f=x+1, g=0.5x²"</i> then <i>"Order B: f=0.5x², g=x+1"</i> to see that \(f(g(x))\) and \(g(f(x))\) are completely different curves!`,
      },
      {
        tr: R`<b>Ters fonksiyonlar birbirini yok eder:</b> <i>"Ters iptal: ln(eˣ)"</i> düğmesine basın — turuncu bileşke eğrisinin tam olarak \(y = x\) doğrusuna dönüştüğünü görün!`,
        en: R`<b>Inverses cancel each other:</b> click <i>"Inverse cancel: ln(eˣ)"</i> and watch the orange composition curve turn into the straight identity line \(y = x\)!`,
      },
      {
        tr: R`<b>Hızlı salınım:</b> <i>"sin(0.5x²)"</i> ayarında \(k\) kaydırıcısını \(2\)'ye çıkarın; içteki parabol büyüdükçe sinüs dalgalarının kenarlarda giderek sıklaştığını gözlemleyin.`,
        en: R`<b>Frequency chirp:</b> on <i>"sin(0.5x²)"</i>, slide \(k\) up to \(2\) and watch the sine ripples crowd closer together as \(x\) moves away from \(0\).`,
      },
      {
        tr: R`<b>İki adımlı makine izleme:</b> \(x_0\) kaydırıcısını hareket ettirin ve alttaki \(x_0 \xrightarrow{g} g(x_0) \xrightarrow{f} f(g(x_0))\) zincirini adım adım okuyun.`,
        en: R`<b>Trace the two-stage pipeline:</b> drag the \(x_0\) slider and follow the live chain \(x_0 \xrightarrow{g} g(x_0) \xrightarrow{f} f(g(x_0))\) below.`,
      },
    ],
    build(host, state) {
      const s = (state.pg ??= { f: "sin", g: "sq", k: 1, x0: 1 });
      const lib = {
        sin: { label: "sin(x)", f: (x) => Math.sin(x) },
        cos: { label: "cos(x)", f: (x) => Math.cos(x) },
        exp: { label: "eˣ", f: (x) => Math.exp(x) },
        ln: { label: "ln(|x|+0.001)", f: (x) => Math.log(Math.abs(x) + 0.001) },
        sq: { label: "0.5x²", f: (x) => 0.5 * x * x },
        lin: { label: "x + 1", f: (x) => x + 1 },
        tanh: { label: "tanh(x)", f: (x) => Math.tanh(x) },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const plot = createCanvas2D(stage, { height: 390 });
      const legend = h("div", { class: "canvas-legend" });
      stage.append(legend);

      const presets = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const ctl3 = h("div", { class: "t-controls" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır senaryolar", en: "Quick presets" }) }),
        presets,
        h("div", { class: "mini-title", text: L({ tr: "Dış fonksiyon f(x)", en: "Outer function f(x)" }) }),
        ctl,
        h("div", { class: "mini-title", text: L({ tr: "İç fonksiyon g(x)", en: "Inner function g(x)" }) }),
        ctl2,
        ctl3,
        tiles,
        calc,
      );

      let segF, segG, slK, slX;
      const draw = () => {
        const F = (x) => lib[s.f].f(x);
        const G = (x) => s.k * lib[s.g].f(x);
        const FG = (x) => F(G(x));
        const gx = G(s.x0);
        const fgx = F(gx);
        plot.draw({
          x: [-5, 5],
          y: [-4, 4],
          xLabel: "x",
          yLabel: "y",
          curves: [
            { f: F, color: COLORS.c1, width: 2, dash: [5, 4] },
            { f: G, color: COLORS.c3, width: 2, dash: [3, 3] },
            { f: FG, color: COLORS.c2, width: 3 },
          ],
          points: [
            { x: s.x0, y: gx, color: COLORS.c3, r: 5 },
            { x: s.x0, y: fgx, color: COLORS.c2, r: 6, ring: true },
          ],
          hover: (x) => ({
            title: `x = ${ns(x, 2)}`,
            rows: [
              { value: ns(FG(x), 3), label: "(f∘g)(x)", color: COLORS.c2 },
              { value: ns(F(x), 3), label: "f(x)", color: COLORS.c1 },
              { value: ns(G(x), 3), label: "g(x)", color: COLORS.c3 },
            ],
          }),
        });
        legend.replaceChildren(
          h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c2}` }), `(f∘g)(x)`),
          h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c1}` }), `f(x) = ${lib[s.f].label}`),
          h("span", { class: "canvas-legend-item" }, h("span", { class: "key-line", style: `background:${COLORS.c3}` }), `g(x) = ${ns(s.k, 1)}·(${lib[s.g].label})`),
        );
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "x₀" }), h("span", { class: "pg-tile-value", text: ns(s.x0, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "g(x₀)" }), h("span", { class: "pg-tile-value", text: ns(gx, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f(g(x₀))" }), h("span", { class: "pg-tile-value", text: ns(fgx, 3) })),
        );
        calc.textContent = `\\(x_0 = ${tx(s.x0, 2)} \\xrightarrow{g} ${tx(gx, 3)} \\xrightarrow{f} ${tx(fgx, 3)}\\)`;
      };

      const applyPreset = (f, g, k, x0) => {
        s.f = f; s.g = g; s.k = k; s.x0 = x0;
        segF.set(f); segG.set(g); slK.set(k); slX.set(x0);
        draw();
      };

      presets.append(
        makePresetBtn({ tr: "Sıra A: (x+1)∘(0.5x²)", en: "Order A: (x+1)∘(0.5x²)" }, () => applyPreset("lin", "sq", 1, 2)),
        makePresetBtn({ tr: "Sıra B: (0.5x²)∘(x+1)", en: "Order B: (0.5x²)∘(x+1)" }, () => applyPreset("sq", "lin", 1, 2)),
        makePresetBtn({ tr: "Ters iptal: ln(eˣ)", en: "Inverse cancel: ln(eˣ)" }, () => applyPreset("ln", "exp", 1, 1.5)),
        makePresetBtn({ tr: "Dalga: sin(0.5x²)", en: "Chirp: sin(0.5x²)" }, () => applyPreset("sin", "sq", 1, 1)),
      );

      const opts = Object.entries(lib).map(([k, v]) => [k, v.label]);
      segF = segmented(opts, s.f, (v) => { s.f = v; draw(); });
      segG = segmented(opts, s.g, (v) => { s.g = v; draw(); });
      slK = slider("k", { min: -2, max: 2, step: 0.1, value: s.k, onInput: (v) => { s.k = v; draw(); } });
      slX = slider("x₀", { min: -4, max: 4, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } });
      ctl.append(segF);
      ctl2.append(segG);
      ctl3.append(slK, slX);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-fn-basics",
      title: { tr: "Temel Kavramlar, Parite ve Aşkın Fonksiyon Tablosu", en: "Core Properties, Parity & Transcendental Table" },
      blocks: [
        {
          p: {
            tr: R`Bir [[function|fonksiyon]] \(f: D \to \mathbb{R}\) için üç yapısal özellik grafiği ilk bakışta özetler: <b>çift</b> (\(f(-x)=f(x)\), \(y\)-eksenine göre simetrik), <b>tek</b> (\(f(-x)=-f(x)\), orijine göre simetrik) ve <b>periyodik</b> (\(f(x+T)=f(x)\), kendini her \(T\) birimde bir tekrarlar).`,
            en: R`Three structural properties summarize any function \(f: D \to \mathbb{R}\) at a glance: <b>even</b> (\(f(-x)=f(x)\), symmetric across the \(y\)-axis), <b>odd</b> (\(f(-x)=-f(x)\), symmetric through the origin), and <b>periodic</b> (\(f(x+T)=f(x)\), repeating every \(T\) units).`,
          },
        },
        {
          table: {
            head: [
              { tr: "Fonksiyon", en: "Function" },
              { tr: "Tanım kümesi", en: "Domain" },
              { tr: "Görüntü kümesi", en: "Range" },
              { tr: "Temel özellik", en: "Key property" },
            ],
            rows: [
              [R`\(e^x\)`, R`\(\mathbb{R}\)`, R`\((0,\infty)\)`, { tr: R`\(e^{a+b}=e^a e^b\), kesin artan`, en: R`\(e^{a+b}=e^a e^b\), strictly increasing` }],
              [R`\(\ln x\)`, R`\((0,\infty)\)`, R`\(\mathbb{R}\)`, R`\(\ln(ab)=\ln a+\ln b\)`],
              [R`\(\sin x,\ \cos x\)`, R`\(\mathbb{R}\)`, R`\([-1,1]\)`, { tr: R`\(2\pi\)-periyodik; \(\sin\) tek, \(\cos\) çift`, en: R`\(2\pi\)-periodic; \(\sin\) odd, \(\cos\) even` }],
              [R`\(\arcsin x\)`, R`\([-1,1]\)`, R`\([-\tfrac{\pi}{2},\tfrac{\pi}{2}]\)`, { tr: R`tek fonksiyon`, en: R`odd function` }],
              [R`\(\arccos x\)`, R`\([-1,1]\)`, R`\([0,\pi]\)`, R`\(\arcsin x + \arccos x = \tfrac{\pi}{2}\)`],
              [R`\(\arctan x\)`, R`\(\mathbb{R}\)`, R`\((-\tfrac{\pi}{2},\tfrac{\pi}{2})\)`, { tr: R`yatay asimptot \(y=\pm\tfrac{\pi}{2}\)`, en: R`horizontal asymptotes \(y=\pm\tfrac{\pi}{2}\)` }],
              [R`\(\sinh x,\ \cosh x\)`, R`\(\mathbb{R}\)`, R`\(\mathbb{R},\ [1,\infty)\)`, R`\(\cosh^2 x - \sinh^2 x = 1\)`],
            ],
          },
        },
        {
          example: {
            title: { tr: "Bir fonksiyonun çift mi tek mi olduğunu sınamak", en: "Testing whether a function is even or odd" },
            problem: {
              tr: R`\(f(x) = x^3 \cos x\) fonksiyonu çift mi, tek mi, yoksa hiçbiri mi?`,
              en: R`Is \(f(x) = x^3 \cos x\) even, odd, or neither?`,
            },
            steps: [
              {
                expr: R`f(-x) = (-x)^3 \cos(-x)`,
                note: { tr: R`Her \(x\) yerine \(-x\) yazarız.`, en: R`Replace every \(x\) with \(-x\).` },
              },
              {
                expr: R`(-x)^3 = -x^3, \qquad \cos(-x) = \cos x`,
                note: { tr: R`Küpler işareti korur (tek), kosinüs ise eksiyi yutar (çift).`, en: R`Cubing preserves the minus sign (odd), while cosine absorbs it (even).` },
              },
              {
                expr: R`f(-x) = -x^3 \cos x = -f(x)`,
                note: { tr: R`Sonuç tam \(-f(x)\) çıktığı için fonksiyon <b>tektir</b>.`, en: R`Since \(f(-x) = -f(x)\), the function is <b>odd</b>.` },
              },
            ],
            answer: { tr: R`Tek fonksiyon (orijine göre simetrik).`, en: R`Odd function (symmetric through the origin).` },
          },
        },
      ],
    },
    {
      id: "m-fn-inv",
      title: { tr: "Ters Fonksiyon ve Logaritma Kurallarının İspatı", en: "Inverse Functions & Proof of Logarithm Laws" },
      blocks: [
        {
          p: {
            tr: R`Kesin artan veya kesin azalan her fonksiyon birebirdir; dolayısıyla görüntü kümesi üzerine bir [[inverse-fn|ters fonksiyonu]] vardır. Doğal logaritma \(\ln x\), üstel \(e^x\) fonksiyonunun tersi olarak tanımlandığında tüm logaritma kuralları üstel yasalardan iki satırda çıkar.`,
            en: R`Every strictly monotone function is injective and thus invertible onto its range. Once we define the natural logarithm \(\ln x\) as the inverse of \(e^x\), every logarithm law follows in a few lines from the laws of exponents.`,
          },
        },
        {
          derive: {
            title: { tr: "Çarpımın logaritması: ln(ab) = ln a + ln b", en: "Logarithm of a product: ln(ab) = ln a + ln b" },
            steps: [
              { tex: R`u = \ln a,\qquad v = \ln b \qquad (a, b > 0)`, why: { tr: "Pozitif a ve b sayılarının doğal logaritmalarına kısaca u ve v adını verelim.", en: "Give the natural logarithms of positive numbers a and b short names u and v." } },
              { tex: R`e^u = a,\qquad e^v = b`, why: { tr: "Ters fonksiyon tanımı gereği ln ile exp birbirini geri alır.", en: "By the definition of inverse functions, exp undoes ln." } },
              { tex: R`a b = e^u e^v = e^{u + v}`, why: { tr: "Aynı tabanlı üstel ifadeler çarpılırken üsler toplanır.", en: "When multiplying exponentials with the same base, exponents add." } },
              { tex: R`\ln(ab) = \ln(e^{u+v}) = u + v = \ln a + \ln b`, why: { tr: "Her iki tarafın ln'i alınıp u ve v yerine yazılınca ispat biter!", en: "Take ln of both sides and substitute u and v back in — proof complete!" } },
            ],
          },
        },
        {
          example: {
            title: { tr: "Kesirli bir fonksiyonun tersini bulmak", en: "Inverting a rational function" },
            problem: {
              tr: R`\(f(x) = \frac{x + 1}{x - 2}\) (\(x \ne 2\)) fonksiyonunun tersi \(f^{-1}(x)\)'i bulun.`,
              en: R`Find the inverse \(f^{-1}(x)\) of \(f(x) = \frac{x + 1}{x - 2}\) (\(x \ne 2\)).`,
            },
            steps: [
              {
                expr: R`y = \frac{x + 1}{x - 2} \implies y(x - 2) = x + 1`,
                note: { tr: R`Paydadan kurtulmak için iki tarafı \((x - 2)\) ile çarparız.`, en: R`Clear the denominator by multiplying both sides by \((x - 2)\).` },
              },
              {
                expr: R`yx - 2y = x + 1 \implies x(y - 1) = 2y + 1`,
                note: { tr: R`İçinde \(x\) geçen tüm terimleri sol tarafa toplarız ve \(x\) parantezine alırız.`, en: R`Gather every term containing \(x\) on the left and factor out \(x\).` },
              },
              {
                expr: R`x = \frac{2y + 1}{y - 1} \implies f^{-1}(x) = \frac{2x + 1}{x - 1} \quad (x \ne 1)`,
                note: { tr: R`\(x\)'i yalnız bıraktıktan sonra harfleri geri adlandırırız. Kontrol: \(f(3) = 4\) ve \(f^{-1}(4) = 9/3 = 3\) ✓!`, en: R`Divide by \(y - 1\) and rename \(y \to x\). Check: \(f(3) = 4\) and \(f^{-1}(4) = 9/3 = 3\) ✓!` },
              },
            ],
            answer: { tr: R`\(f^{-1}(x) = \frac{2x + 1}{x - 1}\), tanım kümesi \(\mathbb{R}\setminus\{1\}\).`, en: R`\(f^{-1}(x) = \frac{2x + 1}{x - 1}\), domain \(\mathbb{R}\setminus\{1\}\).` },
          },
        },
        {
          callout: "warn",
          title: { tr: "Ters trigonometride aralık kontrolü", en: "Always check the principal range for inverse trig" },
          text: {
            tr: R`\(\arcsin(\sin x) = x\) eşitliği <b>yalnızca \(-\frac{\pi}{2} \le x \le \frac{\pi}{2}\)</b> aralığında doğrudur! Örneğin \(\arcsin(\sin \frac{5\pi}{6})\) sonucu \(\frac{5\pi}{6}\) değil, aynı sinüsü (\(1/2\)) veren \([-\frac{\pi}{2},\frac{\pi}{2}]\) içindeki \(\frac{\pi}{6}\)'dır.`,
            en: R`The cancellation \(\arcsin(\sin x) = x\) holds <b>only when \(-\frac{\pi}{2} \le x \le \frac{\pi}{2}\)</b>! For example, \(\arcsin(\sin \frac{5\pi}{6})\) is NOT \(\frac{5\pi}{6}\); it returns \(\frac{\pi}{6}\), the unique angle in \([-\frac{\pi}{2},\frac{\pi}{2}]\) with sine \(1/2\).`,
          },
        },
      ],
    },
    {
      id: "m-fn-hyp",
      title: { tr: "Hiperbolik Özdeşlikler ve Ters Hiperbolik Formülü", en: "Hyperbolic Identities & Inverse Formula" },
      blocks: [
        { eq: R`\cosh^2 x - \sinh^2 x = 1, \qquad 1 - \tanh^2 x = \operatorname{sech}^2 x, \qquad \sinh(2x) = 2\sinh x\cosh x` },
        {
          derive: {
            title: { tr: "Birim hiperbol özdeşliğinin ispatı: cosh² x − sinh² x = 1", en: "Proof of the unit hyperbola identity: cosh² x − sinh² x = 1" },
            steps: [
              { tex: R`\cosh^2 x - \sinh^2 x = (\cosh x + \sinh x)(\cosh x - \sinh x)`, why: { tr: "İki kare farkı a² − b² = (a + b)(a − b) özdeşliğini kullanırız.", en: "Factor as a difference of squares: a² − b² = (a + b)(a − b)." } },
              { tex: R`\cosh x + \sinh x = \frac{e^x+e^{-x}}{2} + \frac{e^x-e^{-x}}{2} = e^x`, why: { tr: "e⁻ˣ terimleri birbirini götürür ve geriye tam eˣ kalır.", en: "The e⁻ˣ terms cancel out, leaving exactly eˣ." } },
              { tex: R`\cosh x - \sinh x = \frac{e^x+e^{-x}}{2} - \frac{e^x-e^{-x}}{2} = e^{-x}`, why: { tr: "Bu kez eˣ terimleri gider ve geriye e⁻ˣ kalır.", en: "This time eˣ cancels, leaving exactly e⁻ˣ." } },
              { tex: R`\cosh^2 x - \sinh^2 x = e^x \cdot e^{-x} = e^0 = 1`, why: { tr: "İkisinin çarpımı her reel x için 1'dir!", en: "Multiplying them yields e⁰ = 1 for every real x!" } },
            ],
          },
        },
        {
          derive: {
            title: { tr: "arsinh(y) için açık logaritmik formül", en: "Closed-form logarithm for arsinh(y)" },
            steps: [
              { tex: R`y = \sinh x = \frac{e^x - e^{-x}}{2}`, why: { tr: "Tersini bulmak için x'i y cinsinden çekeceğiz.", en: "To invert sinh, solve for x in terms of y." } },
              { tex: R`e^x - 2y - e^{-x} = 0 \implies (e^x)^2 - 2y\,e^x - 1 = 0`, why: { tr: "Her iki tarafı 2·eˣ ile çarparız; u = eˣ değişkeninde ikinci derece denklem oluşur.", en: "Multiply by 2·eˣ to obtain a standard quadratic equation in u = eˣ." } },
              { tex: R`e^x = \frac{2y \pm \sqrt{4y^2 + 4}}{2} = y + \sqrt{y^2 + 1}`, why: { tr: "eˣ > 0 ve √(y²+1) > |y| olduğundan eksi kök negatiftir; yalnızca '+' kökü geçerlidir.", en: "Since eˣ > 0 and √(y²+1) > |y|, the minus branch is negative; only '+' survives." } },
              { tex: R`\operatorname{arsinh}(y) = x = \ln\!\big(y + \sqrt{y^2 + 1}\big)`, why: { tr: "İki tarafın ln'i alınınca her y ∈ ℝ için geçerli tam formül çıkar.", en: "Taking ln of both sides yields the closed formula valid for every y ∈ ℝ." } },
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Her fonksiyonun Çift + Tek ayrıştırması", en: "Every function splits into Even + Odd" },
          text: {
            tr: R`Tanım kümesi simetrik her fonksiyon benzersiz biçimde bir çift ve bir tek fonksiyonun toplamı olarak yazılabilir: \(f(x) = \frac{f(x)+f(-x)}{2} + \frac{f(x)-f(-x)}{2}\). \(f(x)=e^x\) için bu tam olarak \(\cosh x + \sinh x\)'tir!`,
            en: R`Any function on a symmetric domain splits uniquely into an even plus an odd part: \(f(x) = \frac{f(x)+f(-x)}{2} + \frac{f(x)-f(-x)}{2}\). Applying this to \(f(x) = e^x\) produces literally \(\cosh x + \sinh x\)!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
