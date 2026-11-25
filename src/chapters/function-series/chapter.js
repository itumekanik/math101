import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { taylorCos, taylorExp, taylorLn1p, taylorSin } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

function geomPoly(x, N) {
  let s = 0;
  let p = 1;
  for (let k = 0; k <= N; k++) {
    s += p;
    p *= x;
  }
  return s;
}

function atanPoly(x, N) {
  let s = 0;
  for (let k = 0; 2 * k + 1 <= N; k++) {
    const p = 2 * k + 1;
    s += ((k % 2 === 0 ? 1 : -1) * x ** p) / p;
  }
  return s;
}

mountChapter({
  intro: {
    id: "fs-intro",
    title: { tr: "Fonksiyon Serileri, Kuvvet Serileri ve Taylor Açılımları", en: "Function Series, Power Series & Taylor Expansions" },
    paragraphs: [
      {
        tr: R`Sayı serilerindeki terimleri bir \(x\) değişkenine bağladığımızda <b>fonksiyon dizileri ve serileri</b> ortaya çıkar: her \(n\) adımı tek bir sayı değil, bütün bir <i>grafik</i> üretir! Burada iki dev soruyu yanıtlarız: (1) Tüm grafik aynı anda düzgünce limitine oturuyor mu ([[uniform-convergence|düzgün yakınsaklık]])? (2) [[transcendental|Aşkın fonksiyonları]] (\(\sin x, e^x, \ln(1+x)\)) yalnızca toplama ve çarpma kullanan [[power-series|kuvvet serilerine]] ve [[taylor-series|Taylor polinomlarına]] dönüştürebilir miyiz?`,
        en: R`When each term of a series depends on \(x\), we enter the world of <b>function series</b>: every step \(n\) draws an entire <i>curve</i> instead of a single number! Two big questions drive this chapter: (1) Does the whole graph settle evenly inside a thin tube ([[uniform-convergence|uniform convergence]])? (2) Can we rebuild [[transcendental|transcendental functions]] (\(\sin x, e^x, \ln(1+x)\)) out of pure polynomials via [[power-series|power series]] and [[taylor-series|Taylor expansions]]?`,
      },
      {
        tr: R`<b>Sembol okuma rehberi:</b> \(\sup_{x \in I} |f_n(x) - f(x)|\) ifadesi <i>"\(I\) aralığındaki en kötü (en büyük) dikey hata"</i> diye okunur; \(f^{(k)}(a)\) ise <i>"\(f\)'nin \(a\) noktasındaki \(k\)-ıncı türevi"</i> demektir. <b>Bu bölümün sonunda</b> \(\varepsilon\)-tüpünü, yakınsaklık yarıçapı \(R\)'yi ve Taylor polinomlarının derece \(N\) arttıkça eğriye nasıl sarıldığını ustalıkla kullanacaksınız.`,
        en: R`<b>Reading the symbols aloud:</b> read \(\sup_{x \in I} |f_n(x) - f(x)|\) as <i>"the worst-case vertical gap anywhere on interval \(I\)"</i>, and \(f^{(k)}(a)\) as <i>"the \(k\)-th derivative of \(f\) at \(a\)."</i> <b>By the end of this chapter</b> you will master the \(\varepsilon\)-tube, radius of convergence \(R\), and degree-by-degree Taylor approximations.`,
      },
    ],
    analogy: {
      title: { tr: "Karmaşık bir eğriyi polinom lunapark rayıyla taklit etmek", en: "Mimicking a curve with a polynomial roller coaster" },
      text: {
        tr: R`Bilgisayarlar ve hesap makineleri \(\sin(0{,}7)\)'yi doğrudan ölçemez — yalnızca toplama, çıkarma ve çarpma yapabilirler! <b>Taylor polinomu</b> \(a\) noktasında durup karmaşık eğrinin önce <b>yüksekliğini</b> (\(N = 0\)), sonra <b>eğimini</b> (\(N = 1\), teğet!), sonra <b>bükülmesini</b> (\(N = 2\), parabol!) ve her derecede ince kıvrımlarını kopyalayarak sade bir polinom rayı döşer. Derece \(N\) arttıkça polinom rayı gerçek eğriye giderek daha uzun bir bölgede yapışır!`,
        en: R`A computer cannot directly "feel" \(\sin(0.7)\) or \(e^{0.3}\) — it can only add and multiply! A <b>Taylor polynomial</b> starts at \(a\) and copies the curve's <b>height</b> (\(N = 0\)), then its <b>slope</b> (\(N = 1\), tangent line!), then its <b>bend</b> (\(N = 2\), parabola!), matching finer wiggles one degree at a time until a simple polynomial roller coaster hugs the original curve!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 17 · Fonksiyon Serileri ve Taylor", en: "Lecture 17 · Function Series & Taylor" }],
      [{ tr: "Düzgün yakınsaklık", en: "Uniform conv." }, { tr: R`\(\sup_{x \in I} |f_n(x) - f(x)| \to 0\) (tüm eğri \(\varepsilon\)-tüpünde)`, en: R`\(\sup_{x \in I} |f_n(x) - f(x)| \to 0\) (whole curve inside \(\varepsilon\)-tube)` }],
      [{ tr: "Yakınsaklık yarıçapı", en: "Radius R" }, { tr: R`\(R = \lim \left|\frac{c_n}{c_{n+1}}\right|\) (yakınsak: \(|x - a| < R\))`, en: R`\(R = \lim \left|\frac{c_n}{c_{n+1}}\right|\) (converges for \(|x - a| < R\))` }],
      [{ tr: "Taylor polinomu", en: "Taylor polynomial" }, { tr: R`\(T_N(x) = \sum_{k=0}^N \frac{f^{(k)}(a)}{k!}(x - a)^k\)`, en: R`\(T_N(x) = \sum_{k=0}^N \frac{f^{(k)}(a)}{k!}(x - a)^k\)` }],
    ],
    tip: {
      title: { tr: "Büyük resim", en: "Big picture" },
      text: {
        tr: R`\(T_1(x) = f(a) + f'(a)(x - a)\) zaten geçen bölümdeki <b>doğrusal yaklaşım (teğet doğrusu)</b> formülüdür! Taylor serisi, doğrusal yaklaşımın yüksek dereceli kardeşidir.`,
        en: R`\(T_1(x) = f(a) + f'(a)(x - a)\) is literally the <b>tangent-line linearization</b> from the previous chapter! Taylor polynomials simply generalize that idea to every higher degree.`,
      },
    },
  },

  sections: [
    {
      id: "fs-uniform",
      mathId: "m-fs-unif",
      title: { tr: "Noktasal vs Düzgün Yakınsaklık: ε-Tüpü", en: "Pointwise vs Uniform Convergence: The ε-Tube" },
      body: [
        {
          tr: R`Bir \((f_n)\) fonksiyon dizisi iki farklı biçimde yakınsayabilir. <b>Noktasal yakınsaklık</b>, her \(x\) noktasını ayrı ayrı dondurduğumuzda sayı dizisi \(f_n(x) \to f(x)\) olmasıdır — ama bazı noktalar çok geç yakınsayabilir. [[uniform-convergence|Düzgün yakınsaklık]] ise çok daha güçlüdür: tek bir \(N\) adımından sonra <b>tüm aralıktaki grafiğin tamamı</b> aynı anda \((f(x) - \varepsilon,\ f(x) + \varepsilon)\) tüpünün içine girer!`,
          en: R`A sequence of curves \((f_n)\) can converge in two very different ways. <b>Pointwise convergence</b> means freezing one \(x\) at a time gives \(f_n(x) \to f(x)\) — even if some \(x\)'s take forever to catch up. [[uniform-convergence|Uniform convergence]] is far stronger: past a single shared step \(N\), the <b>entire graph at once</b> slips inside the \((f(x) - \varepsilon,\ f(x) + \varepsilon)\) tube!`,
        },
        {
          analogy: {
            title: { tr: "Yarışçıların tek düdükle hedefe girmesi", en: "Runners crossing the finish line together" },
            text: {
              tr: R`<b>Noktasal yakınsaklıkta</b> her koşucu eninde sonunda bitiş çizgisine varır, ama sonuncu koşucu \(1\) milyon yıl sonra gelebilir. <b>Düzgün yakınsaklıkta</b> ise tek bir saat \(N\) vardır: o dakika geldiğinde pistteki <i>tüm koşucuların hepsi birden</i> \(\varepsilon\)-bölgesinin içindedir!`,
              en: R`In <b>pointwise convergence</b>, every runner eventually finishes, even if runner #999 takes a million years. In <b>uniform convergence</b>, there is a single cutoff time \(N\) by which <i>every runner across the whole track</i> is already inside the \(\varepsilon\)-zone!`,
            },
          },
        },
        {
          eq: {
            tr: R`\sup_{x \in I} |f_n(x) - f(x)| \xrightarrow{n \to \infty} 0 \qquad (\text{düzgün yakınsaklık})`,
            en: R`\sup_{x \in I} |f_n(x) - f(x)| \xrightarrow{n \to \infty} 0 \qquad (\text{uniform convergence})`,
          },
        },
        {
          example: {
            title: { tr: "xⁿ neden düzgün yakınsak DEĞİL, sin(nx)/n neden düzgün?", en: "Why xⁿ is NOT uniform, while sin(nx)/n IS uniform" },
            problem: { tr: R`\([0, 1]\) üzerinde \(f_n(x) = x^n\) ile \(\mathbb{R}\) üzerinde \(g_n(x) = \frac{\sin(nx)}{n}\) dizilerini \(\varepsilon = 0{,}1\) için kıyaslayın.`, en: R`Compare \(f_n(x) = x^n\) on \([0, 1]\) against \(g_n(x) = \frac{\sin(nx)}{n}\) on \(\mathbb{R}\) for \(\varepsilon = 0.1\).` },
            steps: [
              { expr: R`f_n(x) = x^n \to f(x) = \begin{cases} 0, & 0 \le x < 1 \\ 1, & x = 1 \end{cases}`, note: { tr: R`Her \(n\) için \(x = 0{,}999\) gibi \(1\)'e çok yakın bir yerde \(x^n\) hâlâ \(1\)'e yakındır — en kötü fark daima \(\sup = 1 > 0{,}1\)!`, en: R`No matter how big \(n\) is, picking \(x\) close enough to \(1\) keeps \(x^n\) near \(1\) — worst-case gap stays \(\sup = 1 > 0.1\)!` } },
              { expr: R`\sup_{x \in \mathbb{R}} \left|\frac{\sin(nx)}{n} - 0\right| = \frac{1}{n} \le 0{,}1 \iff n \ge 10`, note: { tr: R`\(n = 10\) olduğunda istisnasız <i>her \(x\) için</i> grafik \([-0{,}1,\ 0{,}1]\) tüpüne oturur!`, en: R`By \(n = 10\), the ENTIRE curve for every \(x\) sits snugly inside \([-0.1, 0.1]\)!` } },
            ],
            answer: { tr: R`\(x^n\) yalnızca noktasal yakınsaktır; \(\frac{\sin(nx)}{n}\) ise düzgün yakınsaktır.`, en: R`\(x^n\) is pointwise only; \(\frac{\sin(nx)}{n}\) converges uniformly.` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: Sürekli eğrilerin limiti hep süreklidir sanmak!", en: "Common mistake: assuming a limit of continuous curves is continuous!" },
            text: {
              tr: R`\(f_n(x) = x^n\) her \(n\) için pürüzsüz sürekli bir polinomdur, ama \([0, 1]\)'deki noktasal limiti \(x = 1\)'de \(0\)'dan \(1\)'e sıçrayarak <b>süreksiz</b> çıkar! Sürekliliği ve terim terim integrali koruyan kalkan yalnızca <b>düzgün yakınsaklıktır</b>.`,
              en: R`Every \(f_n(x) = x^n\) is a smooth continuous polynomial, yet its pointwise limit on \([0, 1]\) jumps suddenly from \(0\) to \(1\) at \(x = 1\)! Only <b>uniform convergence</b> guarantees a continuous limit and term-by-term integration.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>fₙ(x) = xⁿ</b> modunda \(n\)'yi \(35\)'e kadar çıkarın: grafik sol tarafta sıfıra çökse de \(x = 1\) dibindeki sivri kule asla \(\varepsilon\)-tüpünün içine girmez!`, en: R`In <b>fₙ(x) = xⁿ</b>, push \(n\) up to \(35\): the curve flattens on the left, yet the spike at \(x = 1\) NEVER enters the \(\varepsilon\)-tube!` },
            { tr: R`<b>gₙ(x) = sin(nx)/n</b> moduna geçin, \(\varepsilon = 0{,}15\) yapın ve \(n\)'yi artırın: \(n \ge 7\) olduğu anda tüm dalga yeşil tüpün içine sığar!`, en: R`Switch to <b>gₙ(x) = sin(nx)/n</b>, set \(\varepsilon = 0.15\), and raise \(n\): once \(n \ge 7\), the whole wave slips into the green tube!` },
            { tr: R`<b>hₙ(x) = x/(1+nx²)</b> modunu deneyin: tepesi \(\frac{1}{2\sqrt{n}}\) olduğundan yavaş ama <i>düzgün</i> biçimde tüpe girer!`, en: R`Try <b>hₙ(x) = x/(1+nx²)</b>: its peak height is \(\frac{1}{2\sqrt{n}} \to 0\), so it enters the tube more slowly, yet <i>uniformly</i>!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.unif ??= { mode: "xn", n: 8, eps: 0.2 });
        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl1, ctl2, host, msg);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          if (s.mode === "xn") {
            plot.draw({
              x: [-0.05, 1.08],
              y: [-0.18, 1.15],
              xLabel: "x",
              yLabel: "fₙ(x)",
              bands: [{ axis: "y", from: -s.eps, to: s.eps, color: "rgba(208,59,59,0.13)", border: COLORS.bad }],
              curves: [{ f: (x) => (x >= 0 && x <= 1 ? x ** s.n : NaN), color: COLORS.c2, width: 2.7 }],
              points: [
                { x: 1, y: 1, color: COLORS.c2, r: 5 },
                { x: 1, y: 0, color: COLORS.c1, r: 5, hollow: true },
              ],
            });
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `✕ sup |xⁿ − f(x)| = 1 ≥ ε = ${ns(s.eps, 2)} (n = ${s.n} ne kadar büyürse büyüsün 0'a inmez!) → Yalnızca noktasal yakınsak.`,
              en: `✕ sup |xⁿ − f(x)| = 1 ≥ ε = ${ns(s.eps, 2)} regardless of n = ${s.n} → Pointwise only, NOT uniform!`,
            });
          } else if (s.mode === "sinn") {
            const sup = 1 / s.n;
            const ok = sup <= s.eps;
            plot.draw({
              x: [0, 6.3],
              y: [-0.65, 0.65],
              xLabel: "x",
              yLabel: "gₙ(x)",
              bands: [{ axis: "y", from: -s.eps, to: s.eps, color: ok ? "rgba(27,175,122,0.16)" : "rgba(42,120,214,0.14)", border: ok ? COLORS.c3 : COLORS.c1 }],
              curves: [{ f: (x) => Math.sin(s.n * x) / s.n, color: COLORS.c1, width: 2.5 }],
            });
            msg.className = ok ? "pc-msg good" : "pc-msg info";
            msg.textContent = L({
              tr: `sup |sin(${s.n}x)/${s.n}| = ${ns(sup, 3)}. ${ok ? `✓ Tüm eğri ε = ${ns(s.eps, 2)} tüpünün içinde!` : `n ≥ ${Math.ceil(1 / s.eps)} yapınca tüm eğri tüpe girer!`}`,
              en: `sup |sin(${s.n}x)/${s.n}| = ${ns(sup, 3)}. ${ok ? `✓ Entire curve sits inside the ε = ${ns(s.eps, 2)} tube!` : `Raise n ≥ ${Math.ceil(1 / s.eps)} to enter the tube!`}`,
            });
          } else {
            const sup = 1 / (2 * Math.sqrt(s.n));
            const ok = sup <= s.eps;
            plot.draw({
              x: [-2.5, 2.5],
              y: [-0.65, 0.65],
              xLabel: "x",
              yLabel: "hₙ(x)",
              bands: [{ axis: "y", from: -s.eps, to: s.eps, color: ok ? "rgba(27,175,122,0.16)" : "rgba(42,120,214,0.14)", border: ok ? COLORS.c3 : COLORS.c1 }],
              curves: [{ f: (x) => x / (1 + s.n * x * x), color: COLORS.c1, width: 2.6 }],
              points: [{ x: 1 / Math.sqrt(s.n), y: sup, color: COLORS.c2, r: 4.5, label: `max=${ns(sup, 2)}` }],
            });
            msg.className = ok ? "pc-msg good" : "pc-msg info";
            msg.textContent = L({
              tr: `sup |x/(1+${s.n}x²)| = 1/(2√${s.n}) = ${ns(sup, 3)} → 0. ${ok ? "✓ Tüm eğri tüpün içinde — düzgün yakınsak!" : "n'yi biraz daha artırın!"}`,
              en: `sup |x/(1+${s.n}x²)| = 1/(2√${s.n}) = ${ns(sup, 3)} → 0. ${ok ? "✓ Entire curve fits inside the tube — uniform!" : "Increase n a bit more!"}`,
            });
          }
        };

        ctl1.append(
          segmented(
            [["xn", "xⁿ"], ["sinn", "sin(nx)/n"], ["bump", "x/(1+nx²)"]],
            s.mode,
            (v) => { s.mode = v; draw(); },
          ),
        );
        ctl2.append(
          slider("n", { min: 1, max: 35, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
          slider("ε", { min: 0.08, max: 0.45, step: 0.02, value: s.eps, onInput: (v) => { s.eps = v; draw(); } }),
        );
        draw();
      },
    },

    {
      id: "fs-power",
      mathId: "m-fs-power",
      title: { tr: "Kuvvet Serileri ve Yakınsaklık Yarıçapı R", en: "Power Series & Radius of Convergence R" },
      body: [
        {
          tr: R`Bir [[power-series|kuvvet serisi]] \(\sum_{n=0}^\infty c_n(x - a)^n\), merkez noktası \(a\) etrafında yazılmış "sonsuz dereceli bir polinom"dur. Her kuvvet serisinin \(R \in [0, \infty]\) biçiminde simetrik bir <b>yakınsaklık yarıçapı</b> vardır: \((a - R,\ a + R)\) aralığının içinde seri mutlak yakınsar (ve polinom gibi terim terim türevlenip integrallenebilir!), dışındaysa (\(|x - a| > R\)) hızla patlayıp ıraksar!`,
          en: R`A [[power-series|power series]] \(\sum_{n=0}^\infty c_n(x - a)^n\) is an "infinite polynomial" centered at \(a\). Every power series owns a symmetric <b>radius of convergence</b> \(R \in [0, \infty]\): strictly inside \((a - R,\ a + R)\) it converges absolutely (and behaves just like a smooth polynomial under term-by-term differentiation and integration!), while strictly outside (\(|x - a| > R\)) it explodes!`,
        },
        {
          analogy: {
            title: { tr: "Wi-Fi modeminin çekim yarıçapı", en: "A Wi-Fi router's signal radius" },
            text: {
              tr: R`Merkez \(a\) modemin durduğu yer, \(R\) ise çekim yarıçapıdır. \(|x - a| < R\) dairesinin <b>içinde</b> sinyal tam çeker (kesin yakınsak!); \(|x - a| > R\) <b>dışında</b> bağlantı tamamen kopar (kesin ıraksak!). Tam duvarın üstündeki iki uç nokta \(x = a - R\) ve \(x = a + R\) ise sinyal sınırıdır — her birini tek tek kontrol etmek gerekir!`,
              en: R`The center \(a\) is your Wi-Fi router and \(R\) is its signal radius. Strictly <b>inside</b> \(|x - a| < R\), signal is rock-solid (absolute convergence); strictly <b>outside</b> \(|x - a| > R\), signal drops completely (divergence). Right on the two boundary walls \(x = a \pm R\), you must test each endpoint individually!`,
            },
          },
        },
        { eq: R`\sum_{n=0}^\infty c_n(x - a)^n, \qquad R = \lim_{n \to \infty}\left|\frac{c_n}{c_{n+1}}\right| = \frac{1}{\limsup_{n \to \infty}\sqrt[n]{|c_n|}}` },
        {
          example: {
            title: { tr: "Yakınsaklık yarıçapı ve uç noktaları bulmak", en: "Finding radius & endpoints of convergence" },
            problem: { tr: R`\(\sum_{n=1}^\infty \frac{(x - 2)^n}{n \cdot 3^n}\) kuvvet serisinin yakınsaklık yarıçapı \(R\) ve tam yakınsaklık aralığını bulun.`, en: R`Find the radius \(R\) and exact interval of convergence for \(\sum_{n=1}^\infty \frac{(x - 2)^n}{n \cdot 3^n}\).` },
            steps: [
              { expr: R`\lim_{n \to \infty}\left|\frac{a_{n+1}}{a_n}\right| = \lim_{n \to \infty}\frac{n}{n + 1}\cdot\frac{|x - 2|}{3} = \frac{|x - 2|}{3} < 1`, note: { tr: R`Oran testi \(|x - 2| < 3\) verir → merkez \(a = 2\), yarıçap \(R = 3\), açık aralık \((-1,\ 5)\)!`, en: R`The Ratio Test requires \(|x - 2| < 3\) → center \(a = 2\), radius \(R = 3\), open interval \((-1, 5)\)!` } },
              { expr: R`x = 5 \implies \sum_{n=1}^\infty \frac{3^n}{n\cdot 3^n} = \sum_{n=1}^\infty \frac{1}{n} = \infty`, note: { tr: R`Sağ uç \(x = 5\)'te harmonik seri çıkar → <b>ıraksak</b> (dahil değil).`, en: R`At right endpoint \(x = 5\) we get the harmonic series → <b>diverges</b> (excluded).` } },
              { expr: R`x = -1 \implies \sum_{n=1}^\infty \frac{(-3)^n}{n\cdot 3^n} = \sum_{n=1}^\infty \frac{(-1)^n}{n}`, note: { tr: R`Sol uç \(x = -1\)'de alterne harmonik seri çıkar → Leibniz ile <b>yakınsak</b> (dahil!).`, en: R`At left endpoint \(x = -1\) we get the alternating harmonic series → <b>converges</b> (included!).` } },
            ],
            answer: { tr: R`Yarıçap \(R = 3\), tam yakınsaklık aralığı \([-1,\ 5)\).`, en: R`Radius \(R = 3\), exact interval of convergence \([-1, 5)\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: Uç noktaları (x = a ± R) test etmeyi unutmak!", en: "Common mistake: forgetting to test the endpoints x = a ± R!" },
            text: {
              tr: R`Oran testi uç noktalarda her zaman \(L = 1\) (belirsiz) verir! Bu yüzden yarıçapı \(R\) bulduktan sonra mutlaka \(x = a - R\) ve \(x = a + R\) değerlerini seriye yerleştirip sayı serisi testleriyle (harmonik, \(p\)-serisi, Leibniz) ayrı ayrı kontrol edin.`,
              en: R`The Ratio Test always returns \(L = 1\) (inconclusive) at the endpoints! Once you find \(R\), always plug in \(x = a - R\) and \(x = a + R\) separately and test each resulting numerical series.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>1/(1−x) (R = 1)</b> modunda \(N\)'yi \(3 \to 15\) çıkarın: yeşil \((-1, 1)\) bandı içinde polinom mavi eğriye tam yapışırken \(x = 1{,}2\)'de çılgınca fırlar!`, en: R`In <b>1/(1−x) (R = 1)</b>, raise \(N\) from \(3\) to \(15\): inside green \((-1, 1)\) the polynomial snaps onto the curve, while at \(x = 1.2\) it blows up!` },
            { tr: R`<b>1/(1−x/2) (R = 2)</b> moduna geçin: \(x/2\) ölçeklemesi yeşil yakınsaklık koridorunu tam iki katına \((-2, 2)\) genişletir!`, en: R`Switch to <b>1/(1−x/2) (R = 2)</b>: scaling \(x \mapsto x/2\) doubles the green convergence corridor to \((-2, 2)\)!` },
            { tr: R`<b>arctan(x) (R = 1)</b> modunda \(x_0 = 1\) yapın: tam duvarın üzerinde bile yakınsar (\(\pi/4\)), ama \(x_0 = 1{,}3\)'e geçtiğiniz anda patlar!`, en: R`In <b>arctan(x) (R = 1)</b> at \(x_0 = 1\): even right on the wall it converges (\(\pi/4\)), yet stepping to \(x_0 = 1.3\) makes it explode!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.pow ??= { kind: "geom1", N: 7, x0: 0.6 });
        const fams = {
          geom1: {
            label: "1/(1−x) (R=1)",
            f: (x) => (Math.abs(1 - x) < 1e-4 ? NaN : 1 / (1 - x)),
            P: (x, N) => geomPoly(x, N),
            R: 1,
            xr: [-1.8, 1.8],
            yr: [-2, 6],
          },
          geom2: {
            label: "1/(1−x/2) (R=2)",
            f: (x) => (Math.abs(2 - x) < 1e-4 ? NaN : 1 / (1 - x / 2)),
            P: (x, N) => geomPoly(x / 2, N),
            R: 2,
            xr: [-2.8, 2.8],
            yr: [-2, 6],
          },
          atan: {
            label: "arctan(x) (R=1)",
            f: (x) => Math.atan(x),
            P: (x, N) => atanPoly(x, N),
            R: 1,
            xr: [-1.8, 1.8],
            yr: [-2.2, 2.2],
          },
        };
        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl1, ctl2, host, msg);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          const cur = fams[s.kind];
          const inside = Math.abs(s.x0) < cur.R;
          const exact = cur.f(s.x0);
          const approx = cur.P(s.x0, s.N);
          const err = Math.abs(exact - approx);
          plot.draw({
            x: cur.xr,
            y: cur.yr,
            xLabel: "x",
            yLabel: "y",
            bands: [{ axis: "x", from: -cur.R, to: cur.R, color: "rgba(27,175,122,0.12)", border: COLORS.c3 }],
            curves: [
              { f: cur.f, color: COLORS.muted, width: 2.2, dash: [6, 4] },
              { f: (x) => cur.P(x, s.N), color: COLORS.c1, width: 2.7 },
            ],
            points: [
              ...(Number.isFinite(exact) && exact >= cur.yr[0] && exact <= cur.yr[1] ? [{ x: s.x0, y: exact, color: COLORS.c3, r: 5 }] : []),
              ...(Number.isFinite(approx) && approx >= cur.yr[0] && approx <= cur.yr[1] ? [{ x: s.x0, y: approx, color: inside ? COLORS.c1 : COLORS.bad, r: 5.5, ring: true }] : []),
            ],
          });
          msg.className = inside ? "pc-msg good" : "pc-msg bad";
          msg.textContent = inside
            ? L({
                tr: `✓ |x₀| = ${ns(Math.abs(s.x0), 2)} < R = ${cur.R} (güvenli bölgede!) → P_${s.N}(x₀) = ${ns(approx, 4)}, hata = ${ns(err, 4)}.`,
                en: `✓ |x₀| = ${ns(Math.abs(s.x0), 2)} < R = ${cur.R} (inside zone!) → P_${s.N}(x₀) = ${ns(approx, 4)}, error = ${ns(err, 4)}.`,
              })
            : L({
                tr: `✕ |x₀| = ${ns(Math.abs(s.x0), 2)} ≥ R = ${cur.R} (yakınsaklık duvarının dışında!) → P_${s.N}(x₀) = ${ns(approx, 3)} patlıyor!`,
                en: `✕ |x₀| = ${ns(Math.abs(s.x0), 2)} ≥ R = ${cur.R} (outside radius wall!) → P_${s.N}(x₀) = ${ns(approx, 3)} diverges!`,
              });
        };
        ctl1.append(segmented(Object.entries(fams).map(([k, v]) => [k, v.label]), s.kind, (v) => { s.kind = v; draw(); }));
        ctl2.append(
          slider("N", { min: 1, max: 15, step: 2, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
          slider("x₀", { min: -2.2, max: 2.2, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },

    {
      id: "fs-taylor",
      mathId: "m-fs-taylor",
      title: { tr: "Taylor & Maclaurin Polinomları: Eğrileri Derece Derece İnşa Etmek", en: "Taylor & Maclaurin Polynomials: Building Curves Degree by Degree" },
      body: [
        {
          tr: R`Bir fonksiyonu \(x = a\) civarında en iyi taklit eden \(N\)-inci derece polinomu bulmak için tek bir kural yeterlidir: polinomun \(a\) noktasındaki ilk \(N\) türevini fonksiyonun türevlerine eşitle! Paydadaki \(k!\) faktöriyeli tam olarak \((x - a)^k\)'nın \(k\)-ıncı türevinden gelen \(k!\) çarpanını sadeleştirmek için oradadır.`,
          en: R`To build the best degree-\(N\) polynomial imitating \(f\) near \(a\), enforce one simple rule: match the value and first \(N\) derivatives of \(f\) at \(a\)! The \(k!\) in the denominator exists specifically to cancel the \(k!\) produced when differentiating \((x - a)^k\) \(k\) times.`,
        },
        {
          note: {
            tr: R`<b>Maclaurin = Özel Taylor:</b> Merkez \(a = 0\) seçildiğinde Taylor serisine kısaca <b>Maclaurin serisi</b> denir: \(T_N(x) = \sum_{k=0}^N \frac{f^{(k)}(0)}{k!}x^k\).`,
            en: R`<b>Maclaurin = Taylor at 0:</b> Setting the center to \(a = 0\) gives the <b>Maclaurin series</b> \(T_N(x) = \sum_{k=0}^N \frac{f^{(k)}(0)}{k!}x^k\).`,
          },
        },
        { eq: R`e^x = \sum_{n=0}^\infty \frac{x^n}{n!},\qquad \sin x = \sum_{k=0}^\infty (-1)^k\frac{x^{2k+1}}{(2k+1)!},\qquad \cos x = \sum_{k=0}^\infty (-1)^k\frac{x^{2k}}{(2k)!}` },
        {
          example: {
            title: { tr: "Elle e¹ ve sin(0,5) hesaplamak!", en: "Computing e¹ and sin(0.5) by hand!" },
            problem: { tr: R`3. derece Maclaurin polinomları ile \(e^1\) ve \(\sin(0{,}5)\) değerlerini tahmin edin.`, en: R`Estimate \(e^1\) and \(\sin(0.5)\) using degree-3 Maclaurin polynomials.` },
            steps: [
              { expr: R`T_3(x) = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} \implies e^1 \approx 1 + 1 + \frac{1}{2} + \frac{1}{6} \approx 2{,}667`, note: { tr: R`Gerçek \(e \approx 2{,}718\); sadece 4 terimle \(\%2\)'den az hata!`, en: R`True \(e \approx 2.718\); under \(2\%\) error with just 4 terms!` } },
              { expr: R`T_3(x) = x - \frac{x^3}{3!} \implies \sin(0{,}5) \approx 0{,}5 - \frac{0{,}125}{6} \approx 0{,}4792`, note: { tr: R`Gerçek \(\sin(0{,}5) \approx 0{,}4794\) — kâğıt kalemle <b>4 basamak isabet</b>!`, en: R`True \(\sin(0.5) \approx 0.4794\) — <b>4-digit accuracy</b> with pencil and paper!` } },
            ],
            answer: { tr: R`\(e \approx 2{,}667\) ve \(\sin(0{,}5) \approx 0{,}4792\).`, en: R`\(e \approx 2.667\) and \(\sin(0.5) \approx 0.4792\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: ln(1+x) polinomunu |x| > 1 dışında kullanmak!", en: "Common mistake: using ln(1+x)'s Maclaurin polynomial past |x| > 1!" },
            text: {
              tr: R`\(\sin x, \cos x, e^x\) için \(R = \infty\) olduğundan derece \(N\) arttıkça polinom her yerde eğriye sarılır. Oysa \(\ln(1 + x)\) için yakınsaklık yarıçapı yalnızca \(R = 1\)'dir! \(x = 1{,}5\) gibi yarıçap dışındaki bir noktada \(N\)'yi büyütmek yaklaşımı <b>iyileştirmez, aksine çığ gibi bozar!</b>`,
              en: R`While \(\sin x, \cos x, e^x\) have \(R = \infty\) and improve everywhere as \(N\) grows, \(\ln(1 + x)\) has radius \(R = 1\)! Evaluating it outside \(|x| \le 1\) (like at \(x = 1.5\)) makes higher degrees <b>explode wildly worse</b>!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>sin(x)</b> seçili iken \(N\)'yi \(1 \to 3 \to 5 \to 9\) artırın: önce teğet doğrusu \(x\), sonra \(x - x^3/6\) eğriye bir kol gibi sarılır; çift derecelerde katsayı \(0\) olduğu için şeklin değişmediğini fark edin!`, en: R`With <b>sin(x)</b>, step \(N\) through \(1 \to 3 \to 5 \to 9\): first the line \(x\), then cubic \(x - x^3/6\) wraps around the wave; notice even degrees add \(0\)!` },
            { tr: R`<b>eˣ</b> modunda \(N = 0 \to 1 \to 2 \to 5\) yapın: sabit \(\to\) teğet \(\to\) parabol \(\to\) üstel eğri evrimini izleyin.`, en: R`In <b>eˣ</b>, step \(N = 0 \to 1 \to 2 \to 5\) to watch constant \(\to\) tangent \(\to\) parabola \(\to\) exponential!` },
            { tr: R`<b>ln(1+x)</b> modunda \(N\)'yi \(1 \to 13\) yapın: yeşil \((-1, 1)\) bandında mükemmel uyum sağlanırken \(x > 1\) tarafında polinomun dikey bir duvara çarpıp fırladığını görün!`, en: R`In <b>ln(1+x)</b>, crank \(N\) from \(1\) to \(13\): inside green \((-1, 1)\) the fit becomes razor-sharp, while past \(x = 1\) the polynomial hits an invisible wall and explodes!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.tay ??= { fn: "sin", N: 5 });
        const fns = {
          sin: { name: "sin(x)", f: (x) => Math.sin(x), T: (x, n) => taylorSin(x, n), R: "∞", xr: [-6.5, 6.5], yr: [-2.2, 2.2] },
          cos: { name: "cos(x)", f: (x) => Math.cos(x), T: (x, n) => taylorCos(x, n), R: "∞", xr: [-6.5, 6.5], yr: [-2.2, 2.2] },
          exp: { name: "eˣ", f: (x) => Math.exp(x), T: (x, n) => taylorExp(x, n), R: "∞", xr: [-3.5, 3], yr: [-1, 8] },
          ln1p: { name: "ln(1+x)", f: (x) => (x > -1 ? Math.log(1 + x) : NaN), T: (x, n) => (n === 0 ? 0 : taylorLn1p(x, n)), R: "1", xr: [-1.3, 2.2], yr: [-2.5, 1.8] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        const polyTex = (fn, N) => {
          if (fn === "exp") {
            const terms = ["1"];
            for (let k = 1; k <= Math.min(N, 4); k++) terms.push(k === 1 ? "x" : `\\frac{x^${k}}{${k}!}`);
            return terms.join(" + ") + (N > 4 ? " + \\cdots" : "");
          }
          if (fn === "sin") {
            if (N < 1) return "0";
            const terms = ["x"];
            if (N >= 3) terms.push("- \\frac{x^3}{3!}");
            if (N >= 5) terms.push("+ \\frac{x^5}{5!}");
            return terms.join(" ") + (N >= 7 ? " - \\cdots" : "");
          }
          if (fn === "cos") {
            const terms = ["1"];
            if (N >= 2) terms.push("- \\frac{x^2}{2!}");
            if (N >= 4) terms.push("+ \\frac{x^4}{4!}");
            return terms.join(" ") + (N >= 6 ? " - \\cdots" : "");
          }
          if (N < 1) return "0";
          const terms = ["x"];
          if (N >= 2) terms.push("- \\frac{x^2}{2}");
          if (N >= 3) terms.push("+ \\frac{x^3}{3}");
          if (N >= 4) terms.push("- \\frac{x^4}{4}");
          return terms.join(" ") + (N >= 5 ? " + \\cdots" : "");
        };

        const draw = () => {
          const cur = fns[s.fn];
          plot.draw({
            x: cur.xr,
            y: cur.yr,
            xLabel: "x",
            yLabel: "y",
            bands: cur.R === "1" ? [{ axis: "x", from: -1, to: 1, color: "rgba(27,175,122,0.12)", border: COLORS.c3 }] : [],
            curves: [
              { f: cur.f, color: COLORS.muted, width: 2.2, dash: [6, 4] },
              { f: (x) => cur.T(x, s.N), color: COLORS.c1, width: 2.7 },
            ],
          });
          const xTest = s.fn === "ln1p" ? 0.5 : 1.5;
          const err = Math.abs(cur.f(xTest) - cur.T(xTest, s.N));
          calc.textContent = `\\(T_{${s.N}}(x) = ${polyTex(s.fn, s.N)},\\qquad R = ${cur.R === "∞" ? "\\infty" : cur.R},\\qquad |f(${tx(xTest, 1)}) - T_{${s.N}}(${tx(xTest, 1)})| = ${tx(err, 5)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(fns).map(([k, v]) => [k, v.name]), s.fn, (v) => { s.fn = v; draw(); }),
          slider("N", { min: 0, max: 13, step: 1, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
        );
        draw();
      },
    },
  ],

  playground: {
    title: { tr: "Taylor Yaklaşımı & Kalan Hata Tezgâhı", en: "Taylor Approximation & Remainder Error Workbench" },
    sub: {
      tr: R`Fonksiyonu, derece \(N\)'yi ve değerlendirme noktası \(x_0\)'ı değiştirin; kesin değer \(f(x_0)\), polinom tahmini \(T_N(x_0)\) ve dikey hata çubuğu \(|R_N(x_0)|\)'ı anlık karşılaştırın.`,
      en: R`Pick a function, degree \(N\), and probe point \(x_0\) to compare exact \(f(x_0)\), Taylor estimate \(T_N(x_0)\), and the vertical error bar \(|R_N(x_0)|\) live.`,
    },
    experiments: [
      { tr: R`<b>sin(1) (N = 3)</b> önayarını deneyin: yalnızca iki terimli \(x - x^3/6\) polinomunun \(\sin(1) \approx 0{,}8415\) değerini \(0{,}008\) hatayla yakaladığını görün!`, en: R`Click <b>sin(1) (N = 3)</b>: see the two-term cubic \(x - x^3/6\) estimate \(\sin(1) \approx 0.8415\) within \(0.008\)!` },
      { tr: R`<b>e¹ ≈ 2,718 (N = 5)</b> önayarında \(N\)'yi \(2 \to 5 \to 8\) artırın: hata her adımda \(1/N!\) yüzünden baş döndürücü hızla çöker.`, en: R`Click <b>e¹ ≈ 2.718 (N = 5)</b> and scrub \(N\) from \(2 \to 5 \to 8\): watch the \(1/N!\) denominator crush the error!` },
      { tr: R`<b>ln(1,5) (İçeride)</b> önayarında \(x_0 = 0{,}5\) (\(R = 1\) içinde!) iken \(N\) arttıkça hatanın düzgünce sıfıra indiğini gözlemleyin.`, en: R`Click <b>ln(1.5) (Inside)</b> at \(x_0 = 0.5\) (inside \(R = 1\)) and raise \(N\): error shrinks smoothly to zero.` },
      { tr: R`<b>Tuzak: ln(2,4) (Dışarıda!)</b> önayarını seçip \(N\)'yi \(3 \to 11\) çıkarın: \(x_0 = 1{,}4 > R = 1\) olduğundan derece arttıkça hata iyileşmek yerine <b>patlar</b>!`, en: R`Click <b>Trap: ln(2.4) (Outside!)</b> and raise \(N\) from \(3 \to 11\): because \(x_0 = 1.4 > R = 1\), raising \(N\) makes the error <b>explode</b>!` },
    ],
    build(host, state) {
      const s = (state.pg ??= { fn: "exp", N: 5, x0: 1.0 });
      const fns = {
        exp: { label: "eˣ", f: (x) => Math.exp(x), T: (x, n) => taylorExp(x, n), xr: [-3.5, 3.5], yr: [-1, 10], R: Infinity },
        sin: { label: "sin(x)", f: (x) => Math.sin(x), T: (x, n) => taylorSin(x, n), xr: [-4.5, 4.5], yr: [-2.2, 2.2], R: Infinity },
        cos: { label: "cos(x)", f: (x) => Math.cos(x), T: (x, n) => taylorCos(x, n), xr: [-4.5, 4.5], yr: [-2.2, 2.2], R: Infinity },
        ln1p: { label: "ln(1+x)", f: (x) => (x > -1 ? Math.log(1 + x) : NaN), T: (x, n) => (n === 0 ? 0 : taylorLn1p(x, n)), xr: [-1.2, 2.4], yr: [-2.5, 3.2], R: 1 },
      };

      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 375 });
      const presets = h("div", { class: "t-controls" });
      const ctl1 = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const msg = h("p", { class: "pc-msg" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır deneyler", en: "Quick presets" }) }),
        presets,
        ctl1,
        ctl2,
        tiles,
        msg,
      );

      let seg, slN, slX;
      const draw = () => {
        const cur = fns[s.fn];
        const xVal = s.fn === "ln1p" ? Math.max(-0.9, Math.min(2.0, s.x0)) : s.x0;
        const ex = cur.f(xVal);
        const ap = cur.T(xVal, s.N);
        const err = Math.abs(ex - ap);
        const outOfR = Math.abs(xVal) > cur.R;

        plot.draw({
          x: cur.xr,
          y: cur.yr,
          xLabel: "x",
          yLabel: "y",
          bands: Number.isFinite(cur.R) ? [{ axis: "x", from: -cur.R, to: cur.R, color: "rgba(27,175,122,0.12)", border: COLORS.c3 }] : [],
          curves: [
            { f: cur.f, color: COLORS.muted, dash: [5, 4], width: 2.1 },
            { f: (x) => cur.T(x, s.N), color: COLORS.c1, width: 2.7 },
          ],
          segments: Number.isFinite(ex) && Number.isFinite(ap) ? [{ from: [xVal, ex], to: [xVal, Math.max(cur.yr[0], Math.min(cur.yr[1], ap))], color: outOfR ? COLORS.bad : COLORS.c2, width: 2.6 }] : [],
          points: [
            ...(Number.isFinite(ex) ? [{ x: xVal, y: ex, color: COLORS.c3, r: 5.5, label: "f" }] : []),
            ...(Number.isFinite(ap) && ap >= cur.yr[0] && ap <= cur.yr[1] ? [{ x: xVal, y: ap, color: outOfR ? COLORS.bad : COLORS.c2, r: 5.5, label: `T${s.N}` }] : []),
          ],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f(x₀)" }), h("span", { class: "pg-tile-value", text: ns(ex, 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `T_${s.N}(x₀)` }), h("span", { class: "pg-tile-value", text: ns(ap, 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "|Rₙ(x₀)|" }), h("span", { class: "pg-tile-value", text: ns(err, 5) })),
        );
        if (outOfR) {
          msg.className = "pc-msg bad";
          msg.textContent = L({
            tr: `✕ Dikkat! |x₀| = ${ns(Math.abs(xVal), 2)} > R = 1 (yakınsaklık yarıçapı dışında)! N büyüdükçe T_N(x₀) gerçek değerden uzaklaşır.`,
            en: `✕ Warning! |x₀| = ${ns(Math.abs(xVal), 2)} > R = 1 (outside radius of convergence)! Raising N makes T_N(x₀) diverge further!`,
          });
        } else {
          msg.className = err < 0.02 ? "pc-msg good" : "pc-msg info";
          msg.textContent = L({
            tr: `x₀ = ${ns(xVal, 2)} güvenli bölgede. N = ${s.N} için gerçek kalan hata |f(x₀) − T_${s.N}(x₀)| = ${ns(err, 5)}.`,
            en: `x₀ = ${ns(xVal, 2)} is inside the convergence zone. At N = ${s.N}, actual error |f(x₀) − T_${s.N}(x₀)| = ${ns(err, 5)}.`,
          });
        }
      };

      const apply = (fn, N, x0) => {
        s.fn = fn;
        s.N = N;
        s.x0 = x0;
        seg.set(fn);
        slN.set(N);
        slX.set(x0);
        draw();
      };

      for (const [label, fn, N, x0] of [
        [{ tr: "sin(1) (N=3)", en: "sin(1) (N=3)" }, "sin", 3, 1.0],
        [{ tr: "e¹ ≈ 2,718 (N=5)", en: "e¹ ≈ 2.718 (N=5)" }, "exp", 5, 1.0],
        [{ tr: "ln(1,5) (İçeride)", en: "ln(1.5) (Inside)" }, "ln1p", 6, 0.5],
        [{ tr: "Tuzak: ln(2,4) (Dışarıda!)", en: "Trap: ln(2.4) (Outside!)" }, "ln1p", 9, 1.4],
      ]) {
        const b = h("button", { type: "button", class: "btn small", text: L(label) });
        b.addEventListener("click", () => apply(fn, N, x0));
        presets.append(b);
      }

      seg = segmented(Object.entries(fns).map(([k, v]) => [k, v.label]), s.fn, (v) => { s.fn = v; draw(); });
      slN = slider("N", { min: 0, max: 13, step: 1, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } });
      slX = slider("x₀", { min: -3, max: 3, step: 0.1, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } });
      ctl1.append(seg);
      ctl2.append(slN, slX);
      draw();
    },
  },

  mathSections: [
    {
      id: "m-fs-unif",
      title: { tr: "Weierstrass M-Testi ve Düzgün Yakınsaklığın Gücü", en: "Weierstrass M-Test & Consequences of Uniform Convergence" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Özellik", en: "Property" },
              { tr: "Yalnızca Noktasal", en: "Pointwise Only" },
              { tr: "Düzgün Yakınsak", en: "Uniformly Convergent" },
            ],
            rows: [
              [{ tr: "Süreklilik korunur mu?", en: "Preserves continuity?" }, { tr: R`Hayır (\(x^n\) karşı örnek!)`, en: R`No (\(x^n\) counterexample!)` }, { tr: "Evet, daima!", en: "Yes, always!" }],
              [{ tr: R`\(\int \lim f_n = \lim \int f_n\)?`, en: R`\(\int \lim f_n = \lim \int f_n\)?` }, { tr: "Garanti değil", en: "Not guaranteed" }, { tr: R`Evet, sonlu \([a, b]\)'de daima!`, en: R`Yes, always on closed \([a, b]\)!` }],
              [{ tr: "Pratik test", en: "Go-to test" }, { tr: R`\(x\)'i sabitleyip limit al`, en: R`Freeze \(x\) and take limit` }, { tr: R`Weierstrass M-Testi (\(|f_n(x)| \le M_n\))`, en: R`Weierstrass M-Test (\(|f_n(x)| \le M_n\))` }],
            ],
          },
        },
        {
          eq: {
            tr: R`|f_n(x)| \le M_n\ (\forall x \in I) \ \text{ ve }\ \sum_{n=1}^\infty M_n < \infty \implies \sum_{n=1}^\infty f_n(x)\ \text{düzgün yakınsak}`,
            en: R`|f_n(x)| \le M_n\ (\forall x \in I) \ \text{ and }\ \sum_{n=1}^\infty M_n < \infty \implies \sum_{n=1}^\infty f_n(x)\ \text{converges uniformly}`,
          },
        },
        {
          example: {
            title: { tr: "Weierstrass M-Testi uygulaması: Σ cos(nx)/n²", en: "Weierstrass M-Test in action: Σ cos(nx)/n²" },
            problem: { tr: R`\(\sum_{n=1}^\infty \frac{\cos(nx)}{n^2}\) serisinin tüm \(\mathbb{R}\) üzerinde düzgün yakınsadığını ve sürekli bir fonksiyon tanımladığını gösterin.`, en: R`Prove \(\sum_{n=1}^\infty \frac{\cos(nx)}{n^2}\) converges uniformly on all of \(\mathbb{R}\) to a continuous function.` },
            steps: [
              { expr: R`\left|\frac{\cos(nx)}{n^2}\right| \le \frac{1}{n^2} = M_n \qquad (\forall x \in \mathbb{R})`, note: { tr: R`\(x\) ne olursa olsun \(|\cos(nx)| \le 1\)'dir; böylece \(x\)'ten bağımsız üst sınır \(M_n = 1/n^2\) buluruz.`, en: R`For every \(x\), \(|\cos(nx)| \le 1\), yielding the \(x\)-free bound \(M_n = 1/n^2\).` } },
              { expr: R`\sum_{n=1}^\infty M_n = \sum_{n=1}^\infty \frac{1}{n^2} < \infty \quad (p = 2 > 1)`, note: { tr: R`Sayı serisi \(p = 2 > 1\) ile yakınsak olduğundan M-Testi hemen düzgün yakınsaklık verir!`, en: R`Since the \(p\)-series with \(p = 2 > 1\) converges, the M-Test guarantees uniform convergence!` } },
            ],
            answer: { tr: R`Seri tüm \(\mathbb{R}\)'de düzgün yakınsaktır ve her terim sürekli olduğundan toplam fonksiyon da süreklidir.`, en: R`Uniformly convergent on all of \(\mathbb{R}\); hence its sum is continuous everywhere.` },
          },
        },
      ],
    },
    {
      id: "m-fs-power",
      title: { tr: "Kuvvet Serilerinde Terim Terim İntegral ve Türev", en: "Term-by-Term Differentiation & Integration of Power Series" },
      blocks: [
        {
          p: {
            tr: R`Bir kuvvet serisinin yakınsaklık aralığının içinde (\(|x - a| < R\)) en güzel özellik şudur: sonsuz seriyi sanki sıradan bir polinommuş gibi <b>terim terim türevleyebilir veya integralleyebilirsiniz</b> — üstelik yakınsaklık yarıçapı \(R\) hiç değişmez!`,
            en: R`Inside its open disk of convergence (\(|x - a| < R\)), a power series can be <b>differentiated and integrated term by term</b> just like an ordinary polynomial — and the radius \(R\) stays completely unchanged!`,
          },
        },
        {
          derive: {
            title: { tr: "Geometrik seriden ln(1+x) ve arctan(x) açılımlarını türetmek", en: "Deriving ln(1+x) & arctan(x) from the geometric series" },
            steps: [
              { tex: R`\frac{1}{1 + t} = \sum_{n=0}^\infty (-1)^n t^n = 1 - t + t^2 - t^3 + \cdots \qquad (|t| < 1)`, why: { tr: R`Temel geometrik seri \(\frac{1}{1-r}\) formülünde \(r = -t\) yazarız.`, en: R`Substitute \(r = -t\) into the geometric series \(\frac{1}{1 - r} = \sum r^n\).` } },
              { tex: R`\ln(1 + x) = \int_0^x \frac{dt}{1 + t} = \sum_{n=0}^\infty (-1)^n \frac{x^{n+1}}{n + 1} = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots`, why: { tr: R`\(|x| < 1\) içinde terim terim integral alınca \(\ln(1 + x)\) serisi zahmetsizce doğar! (Hatta \(x = 1\)'de \(\ln 2 = 1 - \frac{1}{2} + \frac{1}{3} - \cdots\) verir!)`, en: R`Integrate term by term from \(0\) to \(x\): \(\ln(1 + x)\) pops right out! (And at \(x = 1\) it gives \(\ln 2 = 1 - \frac{1}{2} + \frac{1}{3} - \cdots\)!)` } },
              { tex: R`\frac{1}{1 + t^2} = \sum_{k=0}^\infty (-1)^k t^{2k} \implies \arctan x = \int_0^x \frac{dt}{1 + t^2} = x - \frac{x^3}{3} + \frac{x^5}{5} - \cdots`, why: { tr: R`Aynı numara \(r = -t^2\) ile \(\arctan x\) serisini (ve \(x = 1\)'de \(\frac{\pi}{4} = 1 - \frac{1}{3} + \frac{1}{5} - \cdots\) Leibniz formülünü) üretir!`, en: R`The exact same trick with \(r = -t^2\) gives \(\arctan x\) (and at \(x = 1\), Leibniz's formula \(\frac{\pi}{4} = 1 - \frac{1}{3} + \frac{1}{5} - \cdots\))!` } },
            ],
          },
        },
      ],
    },
    {
      id: "m-fs-taylor",
      title: { tr: "Temel Maclaurin Tablosu, Katsayı İspatı ve Lagrange Kalanı", en: "Essential Maclaurin Table, Coefficient Proof & Lagrange Remainder" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Fonksiyon", en: "Function" },
              { tr: "Maclaurin Serisi (a = 0)", en: "Maclaurin Series (a = 0)" },
              { tr: "Yakınsaklık Yarıçapı", en: "Radius R" },
            ],
            rows: [
              [R`\(e^x\)`, R`\(\sum_{n=0}^\infty \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots\)`, R`\(R = \infty\)`],
              [R`\(\sin x\)`, R`\(\sum_{k=0}^\infty (-1)^k\frac{x^{2k+1}}{(2k+1)!} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots\)`, R`\(R = \infty\)`],
              [R`\(\cos x\)`, R`\(\sum_{k=0}^\infty (-1)^k\frac{x^{2k}}{(2k)!} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots\)`, R`\(R = \infty\)`],
              [R`\(\dfrac{1}{1 - x}\)`, R`\(\sum_{n=0}^\infty x^n = 1 + x + x^2 + x^3 + \cdots\)`, R`\(R = 1\ (|x| < 1)\)`],
              [R`\(\ln(1 + x)\)`, R`\(\sum_{n=1}^\infty (-1)^{n-1}\frac{x^n}{n} = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots\)`, R`\(R = 1\ (-1 < x \le 1)\)`],
              [R`\(\arctan x\)`, R`\(\sum_{k=0}^\infty (-1)^k\frac{x^{2k+1}}{2k+1} = x - \frac{x^3}{3} + \frac{x^5}{5} - \cdots\)`, R`\(R = 1\ (|x| \le 1)\)`],
            ],
          },
        },
        {
          derive: {
            title: { tr: "Kuvvet serisinden cₖ = f⁽ᵏ⁾(a) / k! formülünün ispatı", en: "Deriving Taylor's coefficient formula cₖ = f⁽ᵏ⁾(a) / k!" },
            steps: [
              { tex: R`f(x) = c_0 + c_1(x - a) + c_2(x - a)^2 + c_3(x - a)^3 + \cdots`, why: { tr: R`Yakınsaklık aralığı içinde kuvvet serisi sonsuz kez terim terim türevlenebilir.`, en: R`Inside its interval of convergence, a power series is infinitely differentiable term by term.` } },
              { tex: R`f^{(k)}(x) = k!\,c_k + \frac{(k+1)!}{1!}c_{k+1}(x - a) + \cdots`, why: { tr: R`\(k\) kez türev alınca derecesi \(k\)'dan küçük her terim \(0\) olur; \((x - a)^k\) terimi ise tam \(k!\,c_k\) sabitine dönüşür!`, en: R`Differentiating \(k\) times kills every lower power and turns \(c_k(x-a)^k\) into the constant \(k!\,c_k\)!` } },
              { tex: R`f^{(k)}(a) = k!\,c_k \implies c_k = \frac{f^{(k)}(a)}{k!}`, why: { tr: R`\(x = a\) yazınca tüm \((x - a)\) terimleri sıfırlanır ve \(c_k\) tek başına kalır!`, en: R`Setting \(x = a\) zeros out every \((x - a)\) term, isolating \(c_k = f^{(k)}(a) / k!\)!` } },
            ],
          },
        },
        {
          eq: {
            tr: R`R_N(x) = f(x) - T_N(x) = \frac{f^{(N+1)}(\xi)}{(N + 1)!}(x - a)^{N+1} \quad (\xi,\ a \text{ ile } x \text{ arasında})`,
            en: R`R_N(x) = f(x) - T_N(x) = \frac{f^{(N+1)}(\xi)}{(N + 1)!}(x - a)^{N+1} \quad (\xi \text{ between } a \text{ and } x)`,
          },
        },
        {
          example: {
            title: { tr: "Lagrange Kalanı ile kesin hata üst sınırı", en: "Certifying accuracy with the Lagrange Remainder" },
            problem: { tr: R`\(\sin(0{,}5) \approx T_3(0{,}5) = 0{,}5 - \frac{(0{,}5)^3}{6}\) yaklaşımının hatası en fazla kaç olabilir?`, en: R`Bound the worst-case error of \(\sin(0.5) \approx T_3(0.5) = 0.5 - \frac{(0.5)^3}{6}\).` },
            steps: [
              { expr: R`T_3(x) = T_4(x) \implies |R_4(0{,}5)| = \frac{|\cos(\xi)|}{5!}(0{,}5)^5`, note: { tr: R`\(x^4\) katsayısı \(0\) olduğundan \(T_3 = T_4\)'tür ve bir sonraki terim \(5!\)'dir!`, en: R`Since the \(x^4\) term is \(0\), \(T_3 = T_4\), so the remainder starts at degree \(5\)!` } },
              { expr: R`|\cos(\xi)| \le 1 \implies |R_4(0{,}5)| \le \frac{0{,}03125}{120} \approx 0{,}00026`, note: { tr: R`\(\xi\)'nin tam yerini bilmeden bile \(|\cos \xi| \le 1\) diyerek kesin üst sınır buluruz!`, en: R`Even without knowing \(\xi\), \(|\cos \xi| \le 1\) certifies the exact error ceiling!` } },
            ],
            answer: { tr: R`Hata kesinlikle \(0{,}00026\)'dan küçüktür!`, en: R`The error is strictly guaranteed to be below \(0.00026\)!` },
          },
        },
        {
          callout: "tip",
          title: { tr: "Bileşke ile hızlı Maclaurin üretme hilesi", en: "Fast Maclaurin trick via substitution" },
          text: {
            tr: R`\(\cos(2x)\) veya \(e^{-x^2}\) için uzun uzun türev almayın! Temel tablodaki \(x\) yerine doğrudan \(2x\) veya \(-x^2\) yazın: \(\cos(2x) = 1 - \frac{(2x)^2}{2!} + \frac{(2x)^4}{4!} - \cdots = 1 - 2x^2 + \frac{2}{3}x^4 - \cdots\)!`,
            en: R`Never differentiate \(\cos(2x)\) or \(e^{-x^2}\) repeatedly from scratch! Just plug \(2x\) or \(-x^2\) into the standard table: \(\cos(2x) = 1 - \frac{(2x)^2}{2!} + \cdots = 1 - 2x^2 + \frac{2}{3}x^4 - \cdots\)!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
