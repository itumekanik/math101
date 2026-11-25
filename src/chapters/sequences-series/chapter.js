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
        tr: R`Bir <b>dizi</b> \((a_n)\), sayma numaralarına göre sıralanmış sonsuz bir sayı listesidir: \(a_1, a_2, a_3, \dots\). Bu listenin tüm terimlerini art arda topladığımızda ise bir sonsuz [[series|seri]] doğar: \(\sum_{n=1}^\infty a_n\) (sesli okunuşu: <i>"\(n\) eşittir \(1\)'den sonsuza \(a_n\)'lerin toplamı"</i>). Peki sonsuz tane pozitif sayıyı toplayınca sonuç nasıl sonlu bir sayı çıkabilir?`,
        en: R`A <b>sequence</b> \((a_n)\) is an ordered infinite list of numbers: \(a_1, a_2, a_3, \dots\). Adding all its terms together creates an infinite [[series|series]]: \(\sum_{n=1}^\infty a_n\) (read aloud as <i>"the sum of \(a_n\) from \(n = 1\) to infinity"</i>). How can adding infinitely many positive pieces ever yield a finite total?`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> dizilerin limit davranışını okuyabilecek, [[geometric-series|geometrik serilerin]] ve [[p-series|\(p\)-serilerinin]] yakınsaklık sınırlarını kavrayacak, harmonik seri tuzağını aşabilecek ve Karşılaştırma, İntegral, Oran ile Leibniz alterne seri testlerini güvenle uygulayabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will read sequence convergence plots, master [[geometric-series|geometric]] and [[p-series|\(p\)-series]] thresholds, avoid the harmonic-series trap, and apply Comparison, Integral, Ratio, and Leibniz Alternating Series tests with confidence.`,
      },
    ],
    analogy: {
      title: { tr: "Odanın kalan yarısını sonsuza dek yürümek (Zeno)", en: "Walking half the remaining room forever (Zeno)" },
      text: {
        tr: R`Kapı sizden \(2\text{ m}\) uzakta. Önce \(1\text{ m}\) yürüyün, sonra kalan mesafenin yarısını (\(\frac{1}{2}\text{ m}\)), sonra kalanın yarısını (\(\frac{1}{4}\text{ m}\)), sonra \(\frac{1}{8}\text{ m}\)… <b>Sonsuz sayıda</b> adım atıyorsunuz ama toplam yolunuz asla \(2\text{ m}\)'yi geçmiyor: \(1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \dots = 2\)! Adımlar yeterince hızlı küçülürse sonsuz toplam sonlu bir sayıya <b>yakınsar</b>; yeterince hızlı küçülmezse toplam sonsuza <b>ıraksar</b>.`,
        en: R`The door is \(2\text{ m}\) away. Walk \(1\text{ m}\), then half the remaining distance (\(\frac{1}{2}\text{ m}\)), then half again (\(\frac{1}{4}\text{ m}\)), then \(\frac{1}{8}\text{ m}\)… You take <b>infinitely many</b> steps, yet you never pass \(2\text{ m}\): \(1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \dots = 2\)! When steps shrink fast enough, an infinite sum <b>converges</b>; when they shrink too slowly, it <b>diverges</b>.`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 16 · Reel Sayı Dizileri ve Serileri", en: "Lecture 16 · Sequences & Real Series" }],
      [{ tr: "Geometrik seri", en: "Geometric series" }, { tr: R`\(\sum_{n=0}^\infty a r^n = \frac{a}{1 - r} \iff |r| < 1\)`, en: R`\(\sum_{n=0}^\infty a r^n = \frac{a}{1 - r} \iff |r| < 1\)` }],
      [{ tr: "p-serisi eşiği", en: "p-series cutoff" }, { tr: R`\(\sum_{n=1}^\infty \frac{1}{n^p}\) yakınsak \(\iff p > 1\)`, en: R`\(\sum_{n=1}^\infty \frac{1}{n^p}\) converges \(\iff p > 1\)` }],
      [{ tr: "Altın uyarı", en: "Golden warning" }, { tr: R`\(a_n \to 0\) gereklidir ama YETERLİ değildir (\(\sum \frac{1}{n} = \infty\))!`, en: R`\(a_n \to 0\) is necessary, NOT sufficient (\(\sum \frac{1}{n} = \infty\))!` }],
    ],
    tip: {
      title: { tr: "Dizi ile seriyi asla karıştırma!", en: "Never confuse a sequence with a series!" },
      text: {
        tr: R`<b>Dizi</b> \((a_n)\) tek tek adımların listesidir (\(1,\ \frac{1}{2},\ \frac{1}{3},\ \dots\)). <b>Seri</b> \(\sum a_n\) ise o adımların <i>biriken toplamıdır</i> (\(1,\ 1+\frac{1}{2},\ 1+\frac{1}{2}+\frac{1}{3},\ \dots\)). Dizisi \(0\)'a giden bir serinin toplamı pekâlâ \(\infty\) olabilir!`,
        en: R`A <b>sequence</b> \((a_n)\) is the list of individual steps (\(1,\ \frac{1}{2},\ \frac{1}{3},\ \dots\)). A <b>series</b> \(\sum a_n\) is their <i>running total</i> (\(S_1, S_2, S_3, \dots\)). Steps shrinking to \(0\) can still pile up to \(\infty\)!`,
      },
    },
  },

  sections: [
    {
      id: "ss-seq",
      mathId: "m-ss-seq",
      title: { tr: "Sayı Dizileri ve Dizilerin Limiti", en: "Sequences & Limits of Sequences" },
      body: [
        {
          tr: R`Bir \((a_n)\) dizisinin \(L\) sayısına yakınsaması demek, \(n\) yeterince büyüdükten sonra tüm terimlerin \(L\) etrafındaki ne kadar ince olursa olsun \((L - \varepsilon,\ L + \varepsilon)\) şeridinin içine yerleşip bir daha hiç çıkmaması demektir. Özellikle <b>Monoton Yakınsaklık Teoremi</b> çok kullanışlıdır: hem hep artan (veya hep azalan) hem de bir tavanla/tabanla sınırlı olan her dizi mutlaka yakınsar!`,
          en: R`A sequence \((a_n)\) converges to \(L\) if, past some index \(N\), every single remaining dot lands inside the target strip \((L - \varepsilon,\ L + \varepsilon)\) and never leaves again. A key shortcut is the <b>Monotone Convergence Theorem</b>: any sequence that moves steadily in one direction and stays bounded MUST converge!`,
        },
        {
          analogy: {
            title: { tr: "Tavanlı bir odada tırmanmak", en: "Climbing inside a room with a ceiling" },
            text: {
              tr: R`Her adımda yukarı çıkıyorsanız (\(a_{n+1} \ge a_n\)) ama başınızın üstünde geçemeyeceğiniz bir tavan varsa (\(a_n \le M\)), ne geri inebilirsiniz ne de tavanı delebilirsiniz — mecburen bir yüksekliğe sıkışıp yakınsarsınız!`,
              en: R`If every step climbs upward (\(a_{n+1} \ge a_n\)) inside a room with a solid ceiling (\(a_n \le M\)), you can neither go backward nor punch through the roof — you are forced to settle smoothly toward some height \(L \le M\)!`,
            },
          },
        },
        { eq: R`\lim_{n \to \infty} a_n = L \iff \forall \varepsilon > 0\ \exists N:\quad n > N \implies |a_n - L| < \varepsilon` },
        {
          example: {
            title: { tr: "Monoton ve sınırlı bir dizinin limiti", en: "Limit of a monotone bounded sequence" },
            problem: { tr: R`\(a_n = \frac{3n - 1}{n + 2}\) dizisinin ilk 3 terimini ve \(\lim_{n \to \infty} a_n\) limitini bulun.`, en: R`Find the first 3 terms and \(\lim_{n \to \infty} a_n\) for \(a_n = \frac{3n - 1}{n + 2}\).` },
            steps: [
              { expr: R`a_1 = \frac{2}{3} \approx 0{,}67,\qquad a_2 = \frac{5}{4} = 1{,}25,\qquad a_3 = \frac{8}{5} = 1{,}60`, note: { tr: R`Terimler düzenli olarak yükseliyor ama asla \(3\)'ü geçmiyor!`, en: R`Terms climb steadily upward while staying below \(3\)!` } },
              { expr: R`\frac{3n - 1}{n + 2} = \frac{3 - \frac{1}{n}}{1 + \frac{2}{n}} \xrightarrow{n \to \infty} \frac{3 - 0}{1 + 0} = 3`, note: { tr: R`Pay ve paydayı \(n\)'ye bölünce \(1/n\) parçaları \(0\)'a erir.`, en: R`Divide top and bottom by \(n\); the \(1/n\) terms vanish.` } },
            ],
            answer: { tr: R`Dizi monoton artan, üstten \(3\) ile sınırlı ve limiti \(L = 3\)'tür.`, en: R`Monotone increasing, bounded above by \(3\), with limit \(L = 3\).` },
          },
        },
        {
          tryList: [
            { tr: R`<b>(3n−1)/(n+2)</b> dizisinde \(\varepsilon = 0{,}25\) yapın: mavi noktaların \(n \ge 27\)'den sonra sonsuza dek mavi şeridin içinde kaldığını görün.`, en: R`For <b>(3n−1)/(n+2)</b> with \(\varepsilon = 0.25\): watch all blue dots enter the blue band and stay trapped inside.` },
            { tr: R`<b>1 + (−1)ⁿ/n</b> dizisini seçin: noktalar \(L = 1\) etrafında bir alt bir üst zıplasa da salınım sönümlendiği için yakınsar!`, en: R`Switch to <b>1 + (−1)ⁿ/n</b>: even though dots hop above and below \(1\), the swings die out → converges to \(1\)!` },
            { tr: R`<b>(−1)ⁿ</b> dizisini seçin: sınırlı ama monoton değil; \(-1\) ile \(+1\) arasında sonsuza dek zıpladığı için yakınsamaz!`, en: R`Pick <b>(−1)ⁿ</b>: bounded yet not monotone; it bounces forever between \(-1\) and \(+1\) → diverges!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.seq ??= { kind: "mono", N: 28, eps: 0.25 });
        const seqs = {
          mono: { label: "(3n−1)/(n+2)", f: (n) => (3 * n - 1) / (n + 2), lim: 3, yr: [0, 3.6] },
          damped: { label: "1 + (−1)ⁿ/n", f: (n) => 1 + (n % 2 === 0 ? 1 : -1) / n, lim: 1, yr: [-0.2, 2.2] },
          osc: { label: "(−1)ⁿ", f: (n) => (n % 2 === 0 ? 1 : -1), lim: null, yr: [-1.6, 1.6] },
          euler: { label: "(1 + 1/n)ⁿ", f: (n) => (1 + 1 / n) ** n, lim: Math.E, yr: [1.5, 3.1] },
        };
        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl1, ctl2, host, msg);
        const plot = createCanvas2D(host, { height: 255 });

        const draw = () => {
          const cur = seqs[s.kind];
          const pts = [];
          let insideCount = 0;
          for (let n = 1; n <= s.N; n++) {
            const y = cur.f(n);
            const inBand = cur.lim != null && Math.abs(y - cur.lim) < s.eps;
            if (inBand) insideCount++;
            pts.push({ x: n, y, color: cur.lim == null ? COLORS.c2 : inBand ? COLORS.c3 : COLORS.c1, r: 4 });
          }
          plot.draw({
            x: [0, s.N + 2],
            y: cur.yr,
            xLabel: "n",
            yLabel: "aₙ",
            bands: cur.lim != null ? [{ axis: "y", from: cur.lim - s.eps, to: cur.lim + s.eps, color: "rgba(42,120,214,0.13)", border: COLORS.c1 }] : [],
            lines: cur.lim != null ? [{ a: 0, b: 1, c: -cur.lim, color: COLORS.c2, dash: [5, 4], label: `L = ${ns(cur.lim, 3)}` }] : [],
            points: pts,
          });
          const last = cur.f(s.N);
          if (cur.lim != null) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `✓ Yakınsak! L = ${ns(cur.lim, 4)}, a_${s.N} = ${ns(last, 4)}. Son terimler ±${ns(s.eps, 2)} bandında (${insideCount}/${s.N} nokta yeşil).`,
              en: `✓ Convergent! L = ${ns(cur.lim, 4)}, a_${s.N} = ${ns(last, 4)}. Tail terms stay inside ±${ns(s.eps, 2)} (${insideCount}/${s.N} dots green).`,
            });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `✕ Iraksak! Terimler −1 ve +1 arasında sonsuza dek salınır; hiçbir tek L sayısına sıkışmaz.`,
              en: `✕ Divergent! Terms bounce forever between −1 and +1 without approaching any single limit L.`,
            });
          }
        };

        ctl1.append(segmented(Object.entries(seqs).map(([k, v]) => [k, v.label]), s.kind, (v) => { s.kind = v; draw(); }));
        ctl2.append(
          slider("N", { min: 10, max: 45, step: 5, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
          slider("ε", { min: 0.05, max: 0.5, step: 0.05, value: s.eps, onInput: (v) => { s.eps = v; draw(); } }),
        );
        draw();
      },
    },

    {
      id: "ss-partial",
      mathId: "m-ss-geom",
      title: { tr: "Sonsuz Seri = Kısmi Toplamlar & Geometrik Seri", en: "Infinite Series = Partial Sums & Geometric Series" },
      body: [
        {
          tr: R`Bir sonsuz toplamı anlamanın tek yolu, önce ilk \(N\) terimi toplayıp <b>kısmi toplamı</b> oluşturmaktır: \(S_N = a_1 + a_2 + \dots + a_N\). Eğer \(N \to \infty\) iken \(S_N\) sonlu bir \(S\) sayısına yaklaşıyorsa seri <b>yakınsaktır</b>! En temel yakınsak aile [[geometric-series|geometrik seridir]]: her adım bir öncekinin sabit \(r\) katıysa ve \(|r| < 1\) ise toplam tam \(\frac{a}{1 - r}\) çıkar.`,
          en: R`To make sense of an infinite sum, add just the first \(N\) terms to form the <b>partial sum</b> \(S_N = a_1 + a_2 + \dots + a_N\). The series converges if and only if \(S_N \to S\) finitely! Its cornerstone example is the [[geometric-series|geometric series]]: when each term is \(r\) times the previous and \(|r| < 1\), the exact total is \(\frac{a}{1 - r}\).`,
        },
        {
          analogy: {
            title: { tr: "Zıplayan topun toplam yüksekliği", en: "Total bounce height of a rubber ball" },
            text: {
              tr: R`Bir topu \(1\text{ m}\)'den bırakın; her zıplayışta önceki yüksekliğinin \(r = 0{,}6\)'sına çıksın (\(1,\ 0{,}6,\ 0{,}36,\ 0{,}216,\ \dots\)). Sonsuz kez zıplasa bile yüksekliklerin toplamı asla patlamaz — tam \(\frac{1}{1 - 0{,}6} = 2{,}5\text{ m}\)'de durur!`,
              en: R`Drop a ball from \(1\text{ m}\) where each bounce reaches \(r = 0.6\) of the prior height (\(1,\ 0.6,\ 0.36,\ 0.216,\ \dots\)). Even across infinitely many bounces, the heights sum to the exact finite total \(\frac{1}{1 - 0.6} = 2.5\text{ m}\)!`,
            },
          },
        },
        { eq: R`S_N = \sum_{n=0}^{N} a r^n = a\,\frac{1 - r^{N+1}}{1 - r}, \qquad |r| < 1 \implies \sum_{n=0}^\infty a r^n = \frac{a}{1 - r}` },
        {
          example: {
            title: { tr: "Geometrik seri hesabı: Σ 3·(1/4)ⁿ", en: "Geometric series sum: Σ 3·(1/4)ⁿ" },
            problem: { tr: R`\(\sum_{n=0}^\infty 3\left(\frac{1}{4}\right)^n\) serisinin yakınsaklığını kontrol edip tam toplamını bulun.`, en: R`Check convergence and compute the exact sum of \(\sum_{n=0}^\infty 3\left(\frac{1}{4}\right)^n\).` },
            steps: [
              { expr: R`3 + \frac{3}{4} + \frac{3}{16} + \frac{3}{64} + \cdots`, note: { tr: R`İlk terim \(a = 3\), ortak çarpan \(r = \frac{1}{4}\)'tür.`, en: R`First term is \(a = 3\) and common ratio is \(r = \frac{1}{4}\).` } },
              { expr: R`|r| = \frac{1}{4} < 1 \implies S = \frac{a}{1 - r} = \frac{3}{1 - \frac{1}{4}} = \frac{3}{\frac{3}{4}} = 4`, note: { tr: R`\(|r| < 1\) sağlandığı için formül geçerlidir; toplam tam \(4\) çıkar!`, en: R`Since \(|r| < 1\), the formula applies and yields exactly \(4\)!` } },
            ],
            answer: { tr: R`Seri yakınsaktır ve tam toplamı \(4\)'tür.`, en: R`The series converges with exact sum \(4\).` },
          },
        },
        {
          tryList: [
            { tr: R`<b>Σ (0.6)ⁿ</b> seçili iken \(N\)'yi \(5 \to 30\) yapın: yeşil terimler \(a_n\) sıfıra inerken mavi kısmi toplamlar \(S_N\) hızla \(2{,}5\) çizgisine kilitlenir!`, en: R`With <b>Σ (0.6)ⁿ</b>, slide \(N\) from \(5\) to \(30\): green terms \(a_n\) vanish while blue partial sums \(S_N\) lock onto \(2.5\)!` },
            { tr: R`<b>Σ 1/n</b> (harmonik) ile <b>Σ 1/n²</b>'yi kıyaslayın: ikisinde de yeşil noktalar \(a_n \to 0\), ama \(\sum 1/n^2\) hızla \(1{,}645\)'e otururken \(\sum 1/n\) durmadan tırmanır!`, en: R`Compare <b>Σ 1/n</b> against <b>Σ 1/n²</b>: green \(a_n \to 0\) in both, yet \(\sum 1/n^2\) flattens at \(1.645\) while \(\sum 1/n\) keeps climbing!` },
            { tr: R`<b>Σ (−1)ⁿ⁻¹/n</b>'yi seçin: kısmi toplamlar \(\ln 2 \approx 0{,}693\) etrafında testere gibi daralarak yakınsar.`, en: R`Select <b>Σ (−1)ⁿ⁻¹/n</b>: watch partial sums zig-zag inward toward \(\ln 2 \approx 0.693\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.ser ??= { kind: "geom", N: 25 });
        const families = {
          geom: { label: "Σ (0.6)ⁿ", term: (n) => 0.6 ** (n - 1), exact: 2.5, yMax: 3 },
          harm: { label: "Σ 1/n", term: (n) => 1 / n, exact: null, yMax: 5 },
          p2: { label: "Σ 1/n²", term: (n) => 1 / (n * n), exact: (Math.PI * Math.PI) / 6, yMax: 2.2 },
          alt: { label: "Σ (−1)ⁿ⁻¹/n", term: (n) => (n % 2 === 1 ? 1 : -1) / n, exact: Math.LN2, yMax: 1.3 },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const legend = h("div", { class: "canvas-legend" });
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, legend, calc);
        const plot = createCanvas2D(host, { height: 260 });

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
            xLabel: "n",
            yLabel: "Sₙ / aₙ",
            lines: fam.exact != null ? [{ a: 0, b: 1, c: -fam.exact, color: COLORS.c2, dash: [5, 4], label: `S = ${ns(fam.exact, 3)}` }] : [],
            segments: segs,
            points: [...ptsA, ...ptsS],
          });
          legend.replaceChildren(
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-dot", style: `background:${COLORS.c1}` }), L({ tr: "Kısmi toplam Sₙ", en: "Partial sum Sₙ" })),
            h("span", { class: "canvas-legend-item" }, h("span", { class: "key-dot", style: `background:${COLORS.c3}` }), L({ tr: "Tekil terim aₙ", en: "Single term aₙ" })),
          );
          calc.textContent = fam.exact != null
            ? `\\(S_{${s.N}} = ${tx(sum, 4)},\\qquad S_{\\infty} = ${tx(fam.exact, 4)},\\qquad |S_{\\infty} - S_{${s.N}}| = ${tx(Math.abs(fam.exact - sum), 4)}\\)`
            : `\\(S_{${s.N}} = ${tx(sum, 4)}\\quad (\\text{${L({ tr: "Üst sınır yok: harmonik seri ıraksar!", en: "No upper bound: harmonic series diverges!" })}})\\)`;
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
      title: { tr: "Harmonik Tuzak, p-Serileri ve İntegral Testi", en: "The Harmonic Trap, p-Series & The Integral Test" },
      body: [
        {
          tr: R`Bir serinin yakınsaması için terimlerin sıfıra gitmesi (\(a_n \to 0\)) <b>şarttır</b> — eğer \(a_n \not\to 0\) ise seri derhal ıraksar (<b>Iraksaklık Testi</b>). Ama \(a_n \to 0\) olması tek başına yetmez! Peki terimler sıfıra <i>ne kadar hızlı</i> inmeli? Cevabı [[p-series|\(p\)-serisi]] ve <b>İntegral Testi</b> verir: \(\frac{1}{n^p}\) terimlerini genişliği \(1\) olan dikdörtgenler olarak dizdiğimizde toplam, \(y = 1/x^p\) eğrisinin altındaki \(\int_1^\infty x^{-p}\,dx\) alanıyla aynı kaderi paylaşır!`,
          en: R`For any series to converge, its terms MUST shrink to zero (\(a_n \to 0\)) — if not, it diverges immediately (<b>Divergence Test</b>). Yet \(a_n \to 0\) alone is NOT enough! How fast must terms shrink? The [[p-series|\(p\)-series]] and <b>Integral Test</b> give the exact razor edge: stacking width-\(1\) rectangles of height \(1/n^p\) shares the exact same fate as the area \(\int_1^\infty x^{-p}\,dx\)!`,
        },
        {
          pitfall: {
            title: { tr: "En büyük tuzak: aₙ → 0 yakınsaklık garantilemez!", en: "The #1 trap: aₙ → 0 does NOT guarantee convergence!" },
            text: {
              tr: R`<b>Harmonik seri</b> \(1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4} + \dots\) için terimler \(1/n \to 0\) gider, yine de toplam \(\infty\)'a büyür! Çok yavaş büyüdüğü için insanı kandırır (\(S_{1000} \approx 7{,}49\), \(S_{10^6} \approx 14{,}39\)), ama asla durmaz.`,
              en: R`In the <b>harmonic series</b> \(1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4} + \dots\), terms shrink to \(0\), yet the sum grows past every bound! Its snail pace fools beginners (\(S_{1000} \approx 7.49\), \(S_{10^6} \approx 14.39\)), but it still hits \(\infty\).`,
            },
          },
        },
        {
          eq: {
            tr: R`\sum_{n=1}^\infty \frac{1}{n^p}\ \text{yakınsak} \iff \int_1^\infty \frac{dx}{x^p} < \infty \iff p > 1`,
            en: R`\sum_{n=1}^\infty \frac{1}{n^p}\ \text{converges} \iff \int_1^\infty \frac{dx}{x^p} < \infty \iff p > 1`,
          },
        },
        {
          example: {
            title: { tr: "Üç p-serisini 5 saniyede sınıflandırmak", en: "Classifying three p-series in 5 seconds" },
            problem: { tr: R`\(\sum \frac{1}{\sqrt{n}}\), \(\sum \frac{1}{n}\) ve \(\sum \frac{1}{n^{3/2}}\) serilerinin hangileri yakınsaktır?`, en: R`Which of \(\sum \frac{1}{\sqrt{n}}\), \(\sum \frac{1}{n}\), and \(\sum \frac{1}{n^{3/2}}\) converge?` },
            steps: [
              { expr: R`\frac{1}{\sqrt{n}} = \frac{1}{n^{1/2}} \implies p = 0{,}5 \le 1`, note: { tr: R`\(p \le 1\) olduğu için <b>ıraksak</b> (harmonikten bile daha büyük!).`, en: R`Since \(p = 0.5 \le 1\), <b>diverges</b> (even larger than harmonic!).` } },
              { expr: R`\frac{1}{n} = \frac{1}{n^1} \implies p = 1 \le 1`, note: { tr: R`Tam sınır değeri \(p = 1\) (harmonik seri) → <b>ıraksak</b>!`, en: R`Right on the boundary \(p = 1\) (harmonic series) → <b>diverges</b>!` } },
              { expr: R`\frac{1}{n^{3/2}} \implies p = 1{,}5 > 1`, note: { tr: R`\(p > 1\) sağlandığı için <b>yakınsak</b>!`, en: R`Since \(p = 1.5 > 1\), <b>converges</b>!` } },
            ],
            answer: { tr: R`Yalnızca \(\sum \frac{1}{n^{3/2}}\) yakınsaktır.`, en: R`Only \(\sum \frac{1}{n^{3/2}}\) converges.` },
          },
        },
        {
          tryList: [
            { tr: R`Önce <b>p = 1 (Harmonik)</b> düğmesine basın: dikdörtgenlerin kuyruğu yeterince hızlı incelmediği için alan sonsuza gider!`, en: R`Click <b>p = 1 (Harmonic)</b>: the rectangles decay too slowly, so the total area is infinite!` },
            { tr: R`Şimdi \(p\)'yi sadece \(1{,}1\) veya \(1{,}5\)'e çekin: eğri altındaki kuyruk integrali bir anda sonlu olur ve durum yeşile döner!`, en: R`Now nudge \(p\) just past \(1\) to \(1.1\) or \(1.5\): the tail integral suddenly becomes finite and flips green!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.it ??= { p: 1.5 });
        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl1, ctl2, host, msg);
        const plot = createCanvas2D(host, { height: 250 });

        let slP;
        const draw = () => {
          const f = (x) => (x > 0 ? 1 / x ** s.p : NaN);
          const rects = [];
          for (let n = 1; n <= 12; n++) {
            rects.push({ x0: n, x1: n + 1, y0: 0, y1: f(n), fill: s.p > 1 ? "rgba(27,175,122,0.16)" : "rgba(208,59,59,0.14)", stroke: s.p > 1 ? COLORS.c3 : COLORS.bad });
          }
          plot.draw({
            x: [0.5, 13],
            y: [-0.05, 1.2],
            xLabel: "x",
            yLabel: "1/xᵖ",
            rects,
            curves: [{ f, color: COLORS.c2, width: 2.6, xRange: [1, 13] }],
          });
          const s20 = pSeriesSum(s.p, 20);
          if (s.p > 1) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `✓ p = ${ns(s.p, 2)} > 1 → Yakınsak! Kuyruk integrali ∫₁^∞ x⁻ᵖ dx = ${ns(1 / (s.p - 1), 3)}, S₂₀ = ${ns(s20, 3)}.`,
              en: `✓ p = ${ns(s.p, 2)} > 1 → Convergent! Tail integral ∫₁^∞ x⁻ᵖ dx = ${ns(1 / (s.p - 1), 3)}, S₂₀ = ${ns(s20, 3)}.`,
            });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `✕ p = ${ns(s.p, 2)} ≤ 1 → Iraksak! Kuyruk integrali ∞; S₂₀ = ${ns(s20, 3)} büyümeye devam eder.`,
              en: `✕ p = ${ns(s.p, 2)} ≤ 1 → Divergent! Tail integral is ∞; S₂₀ = ${ns(s20, 3)} keeps climbing without bound.`,
            });
          }
        };

        for (const [label, val] of [
          ["p = 0.5", 0.5],
          [L({ tr: "p = 1 (Harmonik)", en: "p = 1 (Harmonic)" }), 1.0],
          ["p = 1.5", 1.5],
          ["p = 2 (Basel)", 2.0],
        ]) {
          const b = h("button", { type: "button", class: "btn small", text: label });
          b.addEventListener("click", () => {
            s.p = val;
            slP.set(val);
            draw();
          });
          ctl1.append(b);
        }
        slP = slider("p", { min: 0.5, max: 2.5, step: 0.1, value: s.p, onInput: (v) => { s.p = v; draw(); } });
        ctl2.append(slP);
        draw();
      },
    },

    {
      id: "ss-tests",
      mathId: "m-ss-tests",
      title: { tr: "Yakınsaklık Testleri: Karşılaştırma, Oran ve Alterne Seriler", en: "Convergence Tests: Comparison, Ratio & Alternating Series" },
      body: [
        {
          tr: R`Serinin toplamını tam hesaplayamadığımızda üç güçlü dedektif testi imdadımıza yetişir: (1) <b>Karşılaştırma Testi</b> — yakınsak bir seriden küçükse yakınsar, ıraksaktan büyükse ıraksar; (2) <b>Oran Testi (d'Alembert)</b> — faktöriyel \(n!\) ve üs \(c^n\) içeren serilerde ardışık terim oranını \(L = \lim |a_{n+1}/a_n|\) ölçer (\(L < 1\) ise yakınsak!); (3) <b>Leibniz Alterne Seri Testi</b> — işaretleri \(+, -, +, -\) değişen ve büyüklükleri \(b_n \downarrow 0\) azalan her seri yakınsar!`,
          en: R`When an exact sum is out of reach, three detective tests decide convergence: (1) <b>Comparison Test</b> — smaller than a convergent series converges, larger than a divergent one diverges; (2) <b>Ratio Test (d'Alembert)</b> — measures \(L = \lim |a_{n+1}/a_n|\) for factorials \(n!\) and powers \(c^n\) (\(L < 1\) converges!); (3) <b>Alternating Series (Leibniz) Test</b> — any series with flipping signs and magnitudes \(b_n \downarrow 0\) converges!`,
        },
        {
          analogy: {
            title: { tr: "Giderek daralan sarkaç adımları", en: "A shrinking pendulum" },
            text: {
              tr: R`Önce sağa \(1\) adım, sonra sola \(\frac{1}{2}\) adım, sağa \(\frac{1}{3}\) adım, sola \(\frac{1}{4}\) adım atın. Her dönüş bir öncekinden kısa olduğundan, hedef \(S\) daima son iki ayak iziniz \(S_N\) ve \(S_{N+1}\) arasında sıkışır — yani durduğunuz anda hatanız asla <b>bir sonraki atılmamış adım \(b_{N+1}\)'den büyük olamaz!</b>`,
              en: R`Step right \(1\), left \(\frac{1}{2}\), right \(\frac{1}{3}\), left \(\frac{1}{4}\)… Because every reverse swing is shorter than the last, the true sum \(S\) is forever trapped between your last two footprints \(S_N\) and \(S_{N+1}\) — so your error NEVER exceeds <b>the first omitted term \(b_{N+1}\)!</b>`,
            },
          },
        },
        {
          eq: {
            tr: R`L = \lim_{n \to \infty}\left|\frac{a_{n+1}}{a_n}\right| < 1 \implies \text{mutlak yakınsak}, \qquad |S - S_N| \le b_{N+1}\ (\text{Leibniz})`,
            en: R`L = \lim_{n \to \infty}\left|\frac{a_{n+1}}{a_n}\right| < 1 \implies \text{abs. convergent}, \qquad |S - S_N| \le b_{N+1}\ (\text{Leibniz})`,
          },
        },
        {
          example: {
            title: { tr: "Oran Testi ile Σ 2ⁿ / n! serisi", en: "Ratio Test on Σ 2ⁿ / n!" },
            problem: { tr: R`\(\sum_{n=1}^\infty \frac{2^n}{n!}\) serisinin yakınsak olup olmadığını Oran Testi ile belirleyin.`, en: R`Use the Ratio Test to check whether \(\sum_{n=1}^\infty \frac{2^n}{n!}\) converges.` },
            steps: [
              { expr: R`\frac{a_{n+1}}{a_n} = \frac{2^{n+1}/(n+1)!}{2^n/n!} = \frac{2^{n+1}}{2^n}\cdot\frac{n!}{(n+1)!}`, note: { tr: R`Bölme işlemini ters çevirip çarpmaya dönüştürürüz.`, en: R`Invert and multiply to pair matching powers and factorials.` } },
              { expr: R`= \frac{2}{n + 1} \xrightarrow{n \to \infty} 0 = L`, note: { tr: R`\((n+1)! = (n+1)\cdot n!\) olduğundan faktöriyeller tertemiz sadeleşir!`, en: R`Since \((n+1)! = (n+1)\cdot n!\), the factorials cancel cleanly!` } },
            ],
            answer: { tr: R`\(L = 0 < 1\) olduğundan seri <b>mutlak yakınsaktır</b> (hatta toplamı \(e^2 - 1\)'dir!).`, en: R`Since \(L = 0 < 1\), the series is <b>absolutely convergent</b> (its sum is \(e^2 - 1\)!).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: Oran Testinde L = 1 çıkınca karar vermek!", en: "Common mistake: drawing a conclusion when L = 1 in the Ratio Test!" },
            text: {
              tr: R`Hem ıraksak \(\sum \frac{1}{n}\) hem de yakınsak \(\sum \frac{1}{n^2}\) için Oran Testi \(L = 1\) verir! Bu yüzden \(L = 1\) sonucu <b>"test sonuçsuz, başka test seç"</b> demektir — asla yakınsak ya da ıraksak ilân etmeyin.`,
              en: R`Both the divergent \(\sum \frac{1}{n}\) and the convergent \(\sum \frac{1}{n^2}\) yield \(L = 1\) in the Ratio Test! Whenever \(L = 1\), the Ratio Test is <b>inconclusive</b> — switch to \(p\)-series, comparison, or integral test.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>Alterne Harmonik (→ ln 2)</b> modunda \(N\)'yi \(3\)'ten \(15\)'e kaydırın: yeşil Leibniz hata bandı \([S_N, S_{N+1}]\)'in gerçek toplam çizgisini her adımda kafese aldığını izleyin!`, en: R`In <b>Alt. Harmonic (→ ln 2)</b>, slide \(N\) from \(3\) to \(15\): watch the green Leibniz band \([S_N, S_{N+1}]\) trap the true sum line at every single step!` },
            { tr: R`<b>Alterne Basel (→ π²/12)</b> moduna geçin ve \(N = 9\) yapın: bir sonraki terim \(b_{10} = 0{,}01\) ve gerçek hata bundan bile küçük!`, en: R`Switch to <b>Alt. Basel (→ π²/12)</b> at \(N = 9\): the next term is \(b_{10} = 0.01\), and the actual error is even smaller!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.alt ??= { kind: "harm", N: 8 });
        const fams = {
          harm: { label: "Σ (−1)ⁿ⁻¹/n → ln 2", b: (n) => 1 / n, exact: Math.LN2, yr: [0.35, 1.1] },
          pi4: { label: "Σ (−1)ⁿ⁻¹/(2n−1) → π/4", b: (n) => 1 / (2 * n - 1), exact: Math.PI / 4, yr: [0.55, 1.1] },
          sq: { label: "Σ (−1)ⁿ⁻¹/n² → π²/12", b: (n) => 1 / (n * n), exact: (Math.PI * Math.PI) / 12, yr: [0.68, 1.05] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          const fam = fams[s.kind];
          const pts = [];
          const segs = [];
          let sum = 0;
          for (let n = 1; n <= s.N + 1; n++) {
            sum += (n % 2 === 1 ? 1 : -1) * fam.b(n);
            pts.push({ x: n, y: sum, color: n <= s.N ? COLORS.c1 : COLORS.c3, r: n === s.N ? 5.5 : 4, ring: n === s.N });
          }
          for (let i = 0; i < pts.length - 1; i++) {
            segs.push({ from: [pts[i].x, pts[i].y], to: [pts[i + 1].x, pts[i + 1].y], color: COLORS.c1, width: 1.7 });
          }
          const sN = pts[s.N - 1].y;
          const sNext = pts[s.N].y;
          const lo = Math.min(sN, sNext);
          const hi = Math.max(sN, sNext);
          const bound = fam.b(s.N + 1);
          const actual = Math.abs(fam.exact - sN);

          plot.draw({
            x: [0.5, s.N + 2.5],
            y: fam.yr,
            xLabel: "N",
            yLabel: "Sₙ",
            bands: [{ axis: "y", from: lo, to: hi, color: "rgba(27,175,122,0.16)", border: COLORS.c3 }],
            lines: [{ a: 0, b: 1, c: -fam.exact, color: COLORS.c2, dash: [5, 4], label: `S = ${ns(fam.exact, 4)}` }],
            segments: segs,
            points: pts,
          });
          calc.textContent = `\\(S_{${s.N}} = ${tx(sN, 4)},\\quad |S - S_{${s.N}}| = ${tx(actual, 4)} \\le b_{${s.N + 1}} = ${tx(bound, 4)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(fams).map(([k, v]) => [k, v.label]), s.kind, (v) => { s.kind = v; draw(); }),
          slider("N", { min: 2, max: 20, step: 1, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } }),
        );
        draw();
      },
    },
  ],

  playground: {
    title: { tr: "Geometrik Seri & Yakınsaklık Rejimleri Laboratuvarı", en: "Geometric Series & Convergence Regimes Lab" },
    sub: {
      tr: R`Ortak çarpan \(r\)'yi değiştirerek \(\sum_{n=0}^{N} r^n\) kısmi toplamlarının yakınsama (\(|r| < 1\)), salınım (\(r = -1\)) ve patlama (\(|r| > 1\)) davranışlarını tek ekranda keşfedin.`,
      en: R`Adjust common ratio \(r\) to explore how partial sums \(\sum_{n=0}^{N} r^n\) converge (\(|r| < 1\)), oscillate (\(r = -1\)), or explode (\(|r| > 1\)).`,
    },
    experiments: [
      { tr: R`<b>Zeno (r = 0,5)</b> önayarını açın: kısmi toplamlar \(1,\ 1{,}5,\ 1{,}75,\ 1{,}875\dots\) olarak tam \(2\)'ye kilitlenir.`, en: R`Click <b>Zeno (r = 0.5)</b>: partial sums \(1,\ 1.5,\ 1.75,\ 1.875\dots\) lock cleanly onto \(2\).` },
      { tr: R`<b>Alterne (r = −0,5)</b> önayarını açın: negatif çarpan yüzünden kısmi toplamlar zikzak çizse de \(|r| < 1\) olduğu için \(\frac{1}{1 - (-0{,}5)} = \frac{2}{3} \approx 0{,}667\)'ye yakınsar!`, en: R`Click <b>Alternating (r = −0.5)</b>: partial sums zig-zag, yet because \(|r| < 1\) they settle right onto \(\frac{1}{1.5} \approx 0.667\)!` },
      { tr: R`<b>Sınır (r = −1)</b> önayarında Grandi serisi \(1 - 1 + 1 - 1 + \dots\)'yı görün: \(S_N\) sonsuza dek \(1\) ve \(0\) arasında sıçrar → ıraksar!`, en: R`Click <b>Boundary (r = −1)</b> for Grandi's series \(1 - 1 + 1 - 1 + \dots\): \(S_N\) alternates forever between \(1\) and \(0\) → diverges!` },
      { tr: R`<b>Patlama (r = 1,1)</b> önayarında \(|r| > 1\) olduğunda terimlerin büyüyüp toplamı nasıl uçurduğunu izleyin.`, en: R`Click <b>Blow-up (r = 1.1)</b> to see \(|r| > 1\) launch the partial sums toward infinity.` },
    ],
    build(host, state) {
      const s = (state.pg ??= { r: 0.5, N: 20 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 375 });
      const presets = h("div", { class: "t-controls" });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const msg = h("p", { class: "pc-msg" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır senaryolar", en: "Quick presets" }) }),
        presets,
        ctl,
        tiles,
        msg,
      );

      let slR, slN;
      const draw = () => {
        const pts = [];
        const segs = [];
        let maxAbs = 2.4;
        for (let n = 0; n <= s.N; n++) {
          const val = geometricPartialSum(s.r, n);
          if (Math.abs(val) < 60) maxAbs = Math.max(maxAbs, Math.abs(val) * 1.15);
          pts.push({ x: n, y: Math.max(-50, Math.min(50, val)), color: COLORS.c1, r: 4 });
        }
        for (let i = 0; i < pts.length - 1; i++) {
          segs.push({ from: [pts[i].x, pts[i].y], to: [pts[i + 1].x, pts[i + 1].y], color: COLORS.c1, width: 1.4 });
        }
        const conv = Math.abs(s.r) < 1;
        const exact = conv ? 1 / (1 - s.r) : NaN;
        plot.draw({
          x: [-0.5, s.N + 1],
          y: [-Math.min(14, maxAbs), Math.min(14, maxAbs)],
          xLabel: "N",
          yLabel: "Sₙ",
          lines: conv ? [{ a: 0, b: 1, c: -exact, color: COLORS.c2, dash: [5, 4], label: `1/(1−r) = ${ns(exact, 3)}` }] : [],
          segments: segs,
          points: pts,
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "|r|" }), h("span", { class: "pg-tile-value", text: ns(Math.abs(s.r), 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `S_${s.N}` }), h("span", { class: "pg-tile-value", text: ns(geometricPartialSum(s.r, s.N), 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "1/(1−r)" }), h("span", { class: "pg-tile-value", text: conv ? ns(exact, 3) : "∞ / ∄" })),
        );
        if (conv) {
          msg.className = "pc-msg good";
          msg.textContent = L({
            tr: `✓ |r| = ${ns(Math.abs(s.r), 2)} < 1 → Yakınsak! Kısmi toplamlar S = 1/(1 − r) = ${ns(exact, 4)} çizgisine yerleşiyor.`,
            en: `✓ |r| = ${ns(Math.abs(s.r), 2)} < 1 → Convergent! Partial sums settle onto S = 1/(1 − r) = ${ns(exact, 4)}.`,
          });
        } else {
          msg.className = "pc-msg bad";
          msg.textContent = L({
            tr: `✕ |r| = ${ns(Math.abs(s.r), 2)} ≥ 1 → Iraksak! Terimler sıfıra inmediği için toplam yakınsamaz.`,
            en: `✕ |r| = ${ns(Math.abs(s.r), 2)} ≥ 1 → Divergent! Terms do not shrink to 0, so the sum cannot converge.`,
          });
        }
      };

      for (const [label, r, N] of [
        [{ tr: "Zeno (r = 0,5)", en: "Zeno (r = 0.5)" }, 0.5, 20],
        [{ tr: "Alterne (r = −0,5)", en: "Alternating (r = −0.5)" }, -0.5, 20],
        [{ tr: "Sınır (r = −1)", en: "Boundary (r = −1)" }, -1.0, 20],
        [{ tr: "Patlama (r = 1,1)", en: "Blow-up (r = 1.1)" }, 1.1, 20],
      ]) {
        const b = h("button", { type: "button", class: "btn small", text: L(label) });
        b.addEventListener("click", () => {
          s.r = r;
          s.N = N;
          slR.set(r);
          slN.set(N);
          draw();
        });
        presets.append(b);
      }

      slR = slider("r", { min: -1.15, max: 1.15, step: 0.05, value: s.r, onInput: (v) => { s.r = v; draw(); } });
      slN = slider("N", { min: 5, max: 35, step: 5, value: s.N, fmt: (v) => String(v), onInput: (v) => { s.N = v; draw(); } });
      ctl.append(slR, slN);
      draw();
    },
  },

  mathSections: [
    {
      id: "m-ss-seq",
      title: { tr: "Dizilerin Yakınsaklığı ve Monotonluk Teoremi", en: "Sequence Convergence & Monotone Theorem" },
      blocks: [
        {
          p: {
            tr: R`Bir \((a_n)\) dizisinin yakınsaklığını incelemek için üç temel araç yeterlidir: (1) baskın kuvvetle bölme (rasyonel diziler), (2) Sandviç Teoremi (\((-1)^n/n\) gibi salınımlı diziler), (3) <b>Monoton Yakınsaklık Teoremi</b> (monoton + sınırlı \(\Rightarrow\) yakınsak).`,
            en: R`Three tools handle almost every sequence limit: (1) dividing by the dominant power, (2) Squeeze Theorem for oscillating factors like \((-1)^n/n\), and (3) the <b>Monotone Convergence Theorem</b> (monotone + bounded \(\Rightarrow\) convergent).`,
          },
        },
        {
          eq: R`\lim_{n \to \infty}\left(1 + \frac{c}{n}\right)^n = e^c, \qquad \lim_{n \to \infty} n^{1/n} = 1, \qquad \lim_{n \to \infty}\frac{c^n}{n!} = 0`,
        },
        {
          callout: "tip",
          title: { tr: "Büyüme hızı merdiveni (en yavaştan en hızlıya)", en: "Growth-rate hierarchy (slowest to fastest)" },
          text: {
            tr: R`\(n \to \infty\) iken şu sıra daima geçerlidir: \(\ln n \ll n^p \ll c^n \ (c > 1) \ll n! \ll n^n\). Paydada daha hızlı büyüyen bir aile varsa dizi sıfıra uçar!`,
            en: R`As \(n \to \infty\), growth always obeys \(\ln n \ll n^p \ll c^n\ (c > 1) \ll n! \ll n^n\). Whenever the denominator sits higher on this ladder, the ratio races to \(0\)!`,
          },
        },
      ],
    },
    {
      id: "m-ss-geom",
      title: { tr: "Geometrik Seri Formülü ve Harmonik Seri İspatı", en: "Geometric Sum Proof & Oresme's Harmonic Proof" },
      blocks: [
        {
          derive: {
            title: { tr: "Geometrik kısmi toplam: S_N = (1 − r^{N+1}) / (1 − r)", en: "Deriving the geometric partial sum S_N" },
            steps: [
              { tex: R`S_N = 1 + r + r^2 + \cdots + r^N`, why: { tr: R`İlk \(N + 1\) terimin toplamını yazarız.`, en: R`Write out the sum of the first \(N + 1\) terms.` } },
              { tex: R`r\,S_N = r + r^2 + \cdots + r^N + r^{N+1}`, why: { tr: R`Tüm satırı \(r\) ile çarpınca terimler bir basamak sağa kayar!`, en: R`Multiply through by \(r\) to shift every term one slot to the right!` } },
              { tex: R`S_N - r\,S_N = 1 - r^{N+1} \implies S_N = \frac{1 - r^{N+1}}{1 - r}\quad (r \ne 1)`, why: { tr: R`İki satırı birbirinden çıkarınca ortadaki tüm terimler teleskop gibi yok olur! \(|r| < 1\) ise \(r^{N+1} \to 0\) olduğundan \(S_\infty = \frac{1}{1 - r}\) çıkar.`, en: R`Subtracting telescopes away every middle term! When \(|r| < 1\), \(r^{N+1} \to 0\), leaving \(S_\infty = \frac{1}{1 - r}\).` } },
            ],
          },
        },
        {
          derive: {
            title: { tr: "Harmonik serinin ıraksadığı (Oresme gruplama ispatı, ~1350)", en: "Oresme's grouping proof that Σ 1/n = ∞ (~1350)" },
            steps: [
              { tex: R`H = 1 + \frac{1}{2} + \left(\frac{1}{3} + \frac{1}{4}\right) + \left(\frac{1}{5} + \frac{1}{6} + \frac{1}{7} + \frac{1}{8}\right) + \cdots`, why: { tr: R`Terimleri \(2, 4, 8, 16, \dots\) uzunluğunda bloklara ayırırız.`, en: R`Group the terms into blocks of length \(2, 4, 8, 16, \dots\).` } },
              { tex: R`\frac{1}{3}+\frac{1}{4} > \frac{1}{4}+\frac{1}{4} = \frac{1}{2}, \qquad \frac{1}{5}+\cdots+\frac{1}{8} > 4\cdot\frac{1}{8} = \frac{1}{2}`, why: { tr: R`Her bloktaki her kesri o bloğun en küçük (son) kesriyle değiştirsek bile her blok \(\frac{1}{2}\)'den büyük gelir!`, en: R`Replacing each term in a block by the smallest (last) term still totals strictly more than \(\frac{1}{2}\) per block!` } },
              { tex: R`S_{2^k} > 1 + \frac{k}{2} \xrightarrow{k \to \infty} \infty`, why: { tr: R`Sonsuz tane \(\frac{1}{2}\) ekleyerek herhangi bir sınırı aşabiliriz → harmonik seri kesinlikle ıraksar!`, en: R`Adding infinitely many halves surpasses every finite bound → the harmonic series diverges!` } },
            ],
          },
        },
      ],
    },
    {
      id: "m-ss-tests",
      title: { tr: "Yakınsaklık Testleri Rehberi ve Hata Sınırı", en: "Convergence Tests Cheat Sheet & Error Bound" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Test", en: "Test" },
              { tr: "Ne zaman dene?", en: "When to reach for it?" },
              { tr: "Kriter & Sonuç", en: "Criterion & Conclusion" },
            ],
            rows: [
              [{ tr: "Iraksaklık testi", en: "Divergence test" }, { tr: "HER ZAMAN ilk bak!", en: "ALWAYS check first!" }, { tr: R`\(\lim a_n \ne 0 \implies\) kesin ıraksar`, en: R`\(\lim a_n \ne 0 \implies\) must diverge` }],
              [{ tr: "Geometrik seri", en: "Geometric series" }, { tr: R`\(a r^n\) biçimi`, en: R`Form \(a r^n\)` }, { tr: R`\(|r| < 1 \iff\) yakınsak, toplam \(\frac{a}{1-r}\)`, en: R`Converges \(\iff |r| < 1\), sum \(\frac{a}{1-r}\)` }],
              [{ tr: "p-Serisi", en: "p-Series" }, { tr: R`\(1/n^p\) biçimi`, en: R`Form \(1/n^p\)` }, { tr: R`Yakınsak \(\iff p > 1\)`, en: R`Converges \(\iff p > 1\)` }],
              [{ tr: "Oran testi (d'Alembert)", en: "Ratio test" }, { tr: R`\(n!\) veya \(c^n\) varsa`, en: R`Factorials \(n!\) or powers \(c^n\)` }, { tr: R`\(L = \lim |a_{n+1}/a_n|\): \(L < 1\) mutlak yak., \(L > 1\) ırak., \(L = 1\) belirsiz`, en: R`\(L = \lim |a_{n+1}/a_n|\): \(L < 1\) abs. conv., \(L > 1\) div., \(L = 1\) inconclusive` }],
              [{ tr: "Kök testi (Cauchy)", en: "Root test" }, { tr: R`\(( \dots )^n\) biçimi`, en: R`Whole \(n\)-th powers \((\dots)^n\)` }, { tr: R`\(L = \lim \sqrt[n]{|a_n|}\): \(L < 1\) mutlak yak., \(L > 1\) ırak.`, en: R`\(L = \lim \sqrt[n]{|a_n|}\): \(L < 1\) abs. conv., \(L > 1\) div.` }],
              [{ tr: "Leibniz (Alterne)", en: "Alternating (Leibniz)" }, { tr: R`\((-1)^n b_n\) işareti değişiyorsa`, en: R`Alternating signs \((-1)^n b_n\)` }, { tr: R`\(b_n \downarrow 0 \implies\) yakınsak; hata \(|S - S_N| \le b_{N+1}\)`, en: R`\(b_n \downarrow 0 \implies\) converges; error \(|S - S_N| \le b_{N+1}\)` }],
            ],
          },
        },
        {
          example: {
            title: { tr: "Leibniz hata sınırı: 0,01 hassasiyet için kaç terim yeter?", en: "Leibniz error bound: how many terms for 0.01 accuracy?" },
            problem: { tr: R`\(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n^2}\) serisini en fazla \(0{,}01\) hatayla hesaplamak için en az kaç terim (\(N\)) toplamak gerekir?`, en: R`How many terms \(N\) of \(\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n^2}\) guarantee an error at most \(0.01\)?` },
            steps: [
              { expr: R`|S - S_N| \le b_{N+1} = \frac{1}{(N + 1)^2}`, note: { tr: R`Leibniz teoremine göre hata, atlanan ilk terimden büyük olamaz.`, en: R`By Leibniz, the remainder is at most the first omitted term.` } },
              { expr: R`\frac{1}{(N + 1)^2} \le 0{,}01 = \frac{1}{100} \iff (N + 1)^2 \ge 100 \iff N + 1 \ge 10`, note: { tr: R`Eşitsizliği ters çevirip karekök alırız.`, en: R`Take reciprocals and square roots.` } },
            ],
            answer: { tr: R`\(N = 9\) terim yeterlidir (\(b_{10} = \frac{1}{100} = 0{,}01\))!`, en: R`Just \(N = 9\) terms suffice (since \(b_{10} = \frac{1}{100} = 0.01\))!` },
          },
        },
        {
          callout: "warn",
          title: { tr: "Mutlak yakınsaklık vs Koşullu yakınsaklık", en: "Absolute vs Conditional convergence" },
          text: {
            tr: R`Eğer \(\sum |a_n|\) yakınsaksa seri <b>mutlak yakınsaktır</b> (ve terimlerinin sırasını istediğiniz gibi karıştırabilirsiniz, toplam değişmez!). Eğer \(\sum a_n\) yakınsak ama \(\sum |a_n| = \infty\) ise (örneğin \(\sum \frac{(-1)^{n-1}}{n} = \ln 2\)) seri <b>koşullu yakınsaktır</b> — terimlerin sırasıyla oynarsanız toplam bile değişir!`,
            en: R`If \(\sum |a_n|\) converges, the series is <b>absolutely convergent</b> (rearranging terms never changes the sum!). If \(\sum a_n\) converges while \(\sum |a_n| = \infty\) (like \(\sum \frac{(-1)^{n-1}}{n} = \ln 2\)), it is <b>conditionally convergent</b> — rearranging terms can actually alter the sum!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
