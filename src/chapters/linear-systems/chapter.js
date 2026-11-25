import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { rref } from "../../engines/math-core.ts";
import { createRrefStepper, matrixDisplay, matrixInput } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

function augToTex(mat, coeffCols, digits = 2) {
  const cols = mat[0].length;
  const spec = `${"c".repeat(coeffCols)}|${"c".repeat(cols - coeffCols)}`;
  const rows = mat.map((row) =>
    row
      .map((v) => {
        const c = Math.abs(v) < 1e-9 ? 0 : v;
        return Number.isInteger(c) ? String(c) : c.toFixed(digits).replace(/\.?0+$/, "");
      })
      .join(" & "),
  );
  return `\\left[\\begin{array}{${spec}} ${rows.join(" \\\\ ")} \\end{array}\\right]`;
}

mountChapter({
  intro: {
    id: "ls-intro",
    title: {
      tr: "Lineer Denklem Sistemleri ve Gauss Yok Etme",
      en: "Linear Systems & Gaussian Elimination",
    },
    paragraphs: [
      {
        tr: R`Bir lineer denklem sistemi \(A\mathbf x = \mathbf b\), bilinmeyen sayılar \(x_1, x_2, \dots, x_n\) hakkında aynı anda sağlanması gereken kurallar listesidir. Bilinmeyenlerin tüm katsayılarını \(A\) matrisine, eşitliklerin sağ tarafını \(\mathbf b\) sütununa yazıp tek tabloda birleştirdiğimizde buna <b>genişletilmiş matris</b> \([A \mid \mathbf b]\) deriz — ortadaki dikey çizgi sadece "\(=\)" işaretlerinin kısaltmasıdır!`,
        en: R`A linear system \(A\mathbf x = \mathbf b\) is a list of rules that unknown numbers \(x_1, x_2, \dots, x_n\) must satisfy simultaneously. Packing the coefficients into \(A\) and the right-hand numbers into \(\mathbf b\) gives the <b>augmented matrix</b> \([A \mid \mathbf b]\) — the vertical bar is simply neat shorthand for the "\(=\)" signs!`,
      },
      {
        tr: R`İnanılmaz ama gerçek: bir lineer sistemin kaç tane bilinmeyeni olursa olsun her zaman yalnızca <b>üç olasılıktan</b> biri geçerlidir — <b>tek çözüm</b>, <b>sonsuz çözüm</b> veya <b>çözüm yok</b> (asla tam 2 veya 5 çözüm olamaz!). <b>Bu bölümün sonunda</b> [[rref|Gauss–Jordan yok etme]] adımlarını izleyecek, [[rank|rank]] karşılaştırmasıyla Rouché–Capelli teoremini kullanacak ve tüm çözümleri \(\mathbf x = \mathbf x_p + \mathbf x_h\) biçiminde yazabileceksiniz.`,
        en: R`Remarkably, no matter how many variables a linear system has, only <b>three outcomes</b> are ever possible: a <b>unique solution</b>, <b>infinitely many solutions</b>, or <b>no solution</b> (never exactly 2 or 5!). <b>By the end of this chapter</b> you will step through [[rref|Gaussian elimination]], classify any system using [[rank|rank]] (Rouché–Capelli), and write general solutions as \(\mathbf x = \mathbf x_p + \mathbf x_h\).`,
      },
    ],
    analogy: {
      title: {
        tr: "Kesişen Yollar ve Terazi Dengesi",
        en: "Intersecting Roads & A Balanced Scale",
      },
      text: {
        tr: R`<b>Geometrik resim:</b> İki bilinmeyenli sistemde her denklem düz bir yoldur (3 bilinmeyende düz bir tabaka/düzlem). Sistemi çözmek, <em>tüm yolların aynı anda kesiştiği kavşağı</em> bulmaktır — düz yollar ya <b>1 kavşakta</b> kesişir, ya <b>paralel</b> gidip hiç buluşmaz, ya da <b>aynı yol</b> üstünde çakışır! <b>Cebirsel resim:</b> Her denklem dengede duran bir terazidir. İki terazinin yerini değiştirmek, bir terazinin iki kefesini de \(2\)'yle çarpmak veya bir dengeli teraziyi diğerine eklemek <b>dengeyi asla bozmaz</b>. Gauss yok etme, sadece bu üç güvenli hamleyle bilinmeyenleri tek tek ayıklama sanatıdır!`,
        en: R`<b>Geometric picture:</b> each equation in two variables draws a straight road (or a flat sheet/plane in 3D). Solving the system means finding <em>where all roads meet at once</em>: straight roads cross at <b>1 junction</b>, run <b>parallel</b> and never meet, or overlap as the <b>same road</b>! <b>Algebraic picture:</b> think of each equation as a balanced scale. Swapping two scales, doubling both sides of a scale, or adding one balanced scale onto another <b>never breaks the balance</b>. Gaussian elimination uses only those three safe moves to peel variables apart one by one!`,
      },
    },
    summary: [
      [
        { tr: "Ders", en: "Lecture" },
        { tr: "Ders 8 · Lineer Denklem Sistemleri", en: "Lecture 8 · Linear Systems" },
      ],
      [
        { tr: "Yalnızca 3 olasılık", en: "Only 3 outcomes" },
        {
          tr: R`\(0\), \(1\) veya \(\infty\) çözüm (asla \(2\) çözüm değil!)`,
          en: R`\(0\), \(1\), or \(\infty\) solutions (never \(2\) solutions!)`,
        },
      ],
      [
        { tr: "Rouché–Capelli", en: "Rouché–Capelli" },
        {
          tr: R`Tutarlı \(\iff \operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b])\)`,
          en: R`Consistent \(\iff \operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b])\)`,
        },
      ],
      [
        { tr: "Serbest değişken", en: "Free variables" },
        {
          tr: R`\(n - \operatorname{rank}(A)\) adet serbest parametre`,
          en: R`\(n - \operatorname{rank}(A)\) free parameters`,
        },
      ],
    ],
    tip: {
      title: { tr: "RREF nedir? Kısaltmadan korkmayın!", en: "What is RREF? Don't fear the acronym!" },
      text: {
        tr: R`<b>RREF</b> (Reduced Row Echelon Form / İndirgenmiş Satır Basamak Formu), denklemlerin olabilecek en sade "cevap okuma" hâlidir: her pivot \(1\)'dir ve kendi sütunundaki tek sıfırdan farklı sayıdır — sanki sistem kendi cevabını yüksek sesle söylüyor gibi!`,
        en: R`<b>RREF</b> (Reduced Row Echelon Form) is simply the cleanest possible "read-off" form of a system: every pivot is \(1\) and sits alone in its column with zeros above and below — the answer practically reads itself aloud!`,
      },
    },
  },

  sections: [
    {
      id: "ls-cases",
      mathId: "m-ls-geom",
      title: {
        tr: "Ax = b Sisteminin Geometrisi: Kesişen Doğrular ve 3 Olasılık",
        en: "Geometry of Ax = b: Intersecting Lines & The 3 Outcomes",
      },
      body: [
        {
          tr: R`İki bilinmeyenli bir lineer sistemde her satır, \((x_1, x_2)\) düzleminde bir doğru çizer. Bir noktanın sistemin çözümü olması demek, <b>her iki doğrunun da üzerinde</b> bulunması demektir. İki düz doğru ya tek bir noktada kesişir (<b>tek çözüm</b>), ya paralel ve ayrı durur (<b>çözüm yok / tutarsız</b>), ya da birebir üst üste çakışır (<b>sonsuz çözüm</b>).`,
          en: R`In a two-variable linear system, each equation draws a straight line in the \((x_1, x_2)\)-plane. A point solves the system when it lies on <b>both lines at the same time</b>. Two straight lines either cross at a single point (<b>unique solution</b>), run parallel without touching (<b>no solution / inconsistent</b>), or overlap completely (<b>infinitely many solutions</b>).`,
        },
        {
          analogy: {
            title: { tr: "İki düz tren rayı neden asla tam 2 kez kesişmez?", en: "Why can two straight train tracks never cross exactly twice?" },
            text: {
              tr: R`İki düz ray bir kez kesişip ayrıldıktan sonra bir daha bükülüp geri dönemez; dolayısıyla kesişim sayısı ya \(0\), ya \(1\), ya da aynı rayın tüm noktaları (\(\infty\)) olur. Yüksek boyutlarda da mantık aynıdır: eğer \(\mathbf x_1\) ve \(\mathbf x_2\) iki farklı çözümse, ikisini birleştiren <em>doğrunun üzerindeki sonsuz noktanın tamamı</em> da çözümdür!`,
              en: R`Once two straight tracks cross and separate, they cannot curve back to meet a second time — so they meet at \(0\), \(1\), or infinitely many points. The exact same geometry holds in any dimension: if \(\mathbf x_1\) and \(\mathbf x_2\) are two distinct solutions, EVERY point along the entire line through them is also a solution!`,
            },
          },
        },
        {
          eq: {
            tr: R`\operatorname{RREF}([A\mid\mathbf b])\text{ son satırı:}\quad \begin{cases} [\,0\ \ 0 \mid c\ne 0\,] & \implies \text{Çelişki } (0 = c):\ \text{Çözüm yok }(\emptyset) \\ [\,0\ \ 0 \mid 0\,] & \implies \text{Yedek denklem } (0 = 0):\ \text{Sonsuz çözüm} \\ \text{Her sütunda pivot} & \implies \text{Tek çözüm} \end{cases}`,
            en: R`\text{Bottom row of }\operatorname{RREF}([A\mid\mathbf b]):\quad \begin{cases} [\,0\ \ 0 \mid c\ne 0\,] & \implies \text{Contradiction } (0 = c):\ \text{No solution }(\emptyset) \\ [\,0\ \ 0 \mid 0\,] & \implies \text{Redundant } (0 = 0):\ \text{Infinite solutions} \\ \text{Pivot in every column} & \implies \text{Unique solution} \end{cases}`,
          },
        },
        {
          example: {
            title: { tr: "Aynı ilk denklemle 3 farklı senaryo", en: "Three outcomes sharing the same first equation" },
            problem: {
              tr: R`İlk denklem \(x_1 + x_2 = 3\) olsun. İkinci denklem sırasıyla (a) \(-x_1 + x_2 = -1\), (b) \(x_1 + x_2 = 1\) ve (c) \(2x_1 + 2x_2 = 6\) olduğunda çözüm kümelerini bulun.`,
              en: R`Start with \(x_1 + x_2 = 3\). Find the solution set when the second equation is (a) \(-x_1 + x_2 = -1\), (b) \(x_1 + x_2 = 1\), and (c) \(2x_1 + 2x_2 = 6\).`,
            },
            steps: [
              {
                expr: R`\text{(a) } (x_1 + x_2) + (-x_1 + x_2) = 3 + (-1) \implies 2x_2 = 2 \implies x_2 = 1,\ x_1 = 2`,
                note: {
                  tr: R`<b>Tek çözüm:</b> iki doğru dik kesişir ve tek kavşak noktası \((2, 1)\) çıkar.`,
                  en: R`<b>Unique solution:</b> the two lines cross once at the single point \((2, 1)\).`,
                },
              },
              {
                expr: {
                  tr: R`\text{(b) } (x_1 + x_2) - (x_1 + x_2) = 1 - 3 \implies 0 = -2 \quad (\text{imkânsız!})`,
                  en: R`\text{(b) } (x_1 + x_2) - (x_1 + x_2) = 1 - 3 \implies 0 = -2 \quad (\text{impossible!})`,
                },
                note: {
                  tr: R`<b>Çözüm yok:</b> aynı eğimli iki paralel doğru asla buluşmaz (\(\emptyset\)).`,
                  en: R`<b>No solution:</b> two parallel distinct lines never meet (\(\emptyset\)).`,
                },
              },
              {
                expr: R`\text{(c) } (2x_1 + 2x_2) - 2(x_1 + x_2) = 6 - 6 \implies 0 = 0 \implies x_2 = t,\ x_1 = 3 - t`,
                note: {
                  tr: R`<b>Sonsuz çözüm:</b> ikinci denklem ilkinin sadece 2 katıdır (aynı doğru!); her \(t \in \mathbb{R}\) için \((3-t, t)\) bir çözümdür.`,
                  en: R`<b>Infinitely many solutions:</b> equation 2 is simply twice equation 1 (the exact same line!); \((3-t, t)\) solves both for every \(t \in \mathbb{R}\).`,
                },
              },
            ],
            answer: {
              tr: R`(a) Tek: \((2, 1)\), (b) Çözüm yok: \(\emptyset\), (c) Sonsuz: \(\{(3-t, t) : t\in\mathbb{R}\}\).`,
              en: R`(a) Unique: \((2, 1)\), (b) None: \(\emptyset\), (c) Infinite: \(\{(3-t, t) : t\in\mathbb{R}\}\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: [0 0 | 0] ile [0 0 | 5] satırlarını karıştırmak!", en: "Common mistake: Confusing [0 0 | 0] with [0 0 | 5]!" },
            text: {
              tr: R`Alt satırda <b>\([0\ 0 \mid 0]\)</b> görmek demek \(0x_1 + 0x_2 = 0\) yani "\(0 = 0\)" demektir — bu tamamen <b>doğru</b> ve zararsızdır; yalnızca denklemlerden birinin yedek olduğunu söyler. Oysa <b>\([0\ 0 \mid 5]\)</b> satırı "\(0 = 5\)" çelişkisidir ve tüm çözüm kümesini anında boşaltır (\(\emptyset\))!`,
              en: R`A bottom row of <b>\([0\ 0 \mid 0]\)</b> translates to \(0x_1 + 0x_2 = 0\), i.e. "\(0 = 0\)" — completely <b>true</b> and harmless, merely signaling a redundant equation. By contrast, <b>\([0\ 0 \mid 5]\)</b> says "\(0 = 5\)", an impossible contradiction that immediately wipes out all solutions (\(\emptyset\))!`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>Tek çözüm</b>, <b>Çözüm yok</b> ve <b>Sonsuz çözüm</b> düğmelerine sırayla tıklayıp hem iki doğrunun konumunu hem de alttaki RREF matrisinin son satırını karşılaştırın.`,
              en: R`Click <b>Unique</b>, <b>No solution</b>, and <b>Infinite</b> in turn and compare both the lines and the bottom row of the RREF matrix underneath.`,
            },
            {
              tr: R`<b>Çözüm yok</b> seçiliyken \(d\) sürgüsünü \(1\)'den \(3\)'e kaydırın: paralel turuncu doğrunun mavi doğrunun tam üstüne oturup çelişkinin \([0\ 0 \mid -2]\)'den \([0\ 0 \mid 0]\)'a nasıl dönüştüğünü görün!`,
              en: R`Starting from <b>No solution</b>, slide \(d\) from \(1\) to \(3\): watch the parallel orange line glide right on top of the blue line as \([0\ 0 \mid -2]\) turns into \([0\ 0 \mid 0]\)!`,
            },
            {
              tr: R`Şimdi \(k\) eğim sürgüsünü \(1\)'den hafifçe uzaklaştırın: doğrular paralellikten çıktığı anda yeşil kesişim noktasının anında ortaya çıktığını izleyin!`,
              en: R`Now nudge the slope coefficient \(k\) away from \(1\): the instant the lines stop being parallel, a green intersection dot snaps into existence!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.cases ??= { mode: "unique", k: -1, d: -1 });
        const modes = {
          unique: { label: { tr: "Tek çözüm", en: "Unique" }, k: -1, d: -1 },
          none: { label: { tr: "Çözüm yok", en: "No solution" }, k: 1, d: 1 },
          inf: { label: { tr: "Sonsuz çözüm", en: "Infinite" }, k: 1, d: 3 },
        };
        const ctl = h("div", { class: "t-controls" });
        const sliders = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, sliders, host, calc, msg);
        const plot = createCanvas2D(host, { height: 260 });

        let seg = null;
        const draw = () => {
          // L1: x1 + x2 = 3  =>  1*x1 + 1*x2 - 3 = 0
          // L2: k*x1 + x2 = d => k*x1 + 1*x2 - d = 0
          const aug = [
            [1, 1, 3],
            [s.k, 1, s.d],
          ];
          const res = rref(aug, 2);
          const isInf = res.rankA === 1 && res.rankAug === 1;
          const isNone = res.rankAug > res.rankA;
          const pt = !isInf && !isNone ? [res.matrix[0][2], res.matrix[1][2]] : null;

          plot.draw({
            x: [-3.5, 5.5],
            y: [-3.5, 5.5],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            lines: [
              { a: 1, b: 1, c: -3, color: COLORS.c1, width: 2.8, label: "L₁: x₁ + x₂ = 3" },
              {
                a: s.k,
                b: 1,
                c: -s.d,
                color: COLORS.c2,
                width: isInf ? 2.6 : 2.8,
                dash: isInf ? [8, 5] : [],
                label: `L₂: ${ns(s.k, 1)}x₁ + x₂ = ${ns(s.d, 1)}`,
              },
            ],
            points: pt
              ? [
                  {
                    x: pt[0],
                    y: pt[1],
                    color: COLORS.c3,
                    r: 6.5,
                    ring: true,
                    label: `(${ns(pt[0], 2)}, ${ns(pt[1], 2)})`,
                  },
                ]
              : [],
          });

          calc.textContent = `\\(\\operatorname{RREF}([A\\mid\\mathbf b]) = ${augToTex(res.matrix, 2)}\\)`;
          if (isNone) {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `Paralel ayrı doğrular! Son satır 0 = ${ns(res.matrix[1][2], 2)} çelişkisini veriyor → Çözüm yok (rank A = 1 < rank [A|b] = 2).`,
              en: `Parallel distinct lines! Bottom row says 0 = ${ns(res.matrix[1][2], 2)} (contradiction) → No solution (rank A = 1 < rank [A|b] = 2).`,
            });
          } else if (isInf) {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: "Çakışan doğrular! Son satır 0 = 0 (zararsız) → Sonsuz çözüm: x₂ = t, x₁ = 3 − t (rank A = rank [A|b] = 1 < 2).",
              en: "Coincident lines! Bottom row is 0 = 0 (harmless) → Infinite solutions: x₂ = t, x₁ = 3 − t (rank A = rank [A|b] = 1 < 2).",
            });
          } else {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Tek kesişim noktası: (${ns(pt[0], 2)}, ${ns(pt[1], 2)})! İki sütunda da pivot var (rank A = rank [A|b] = 2).`,
              en: `Unique intersection: (${ns(pt[0], 2)}, ${ns(pt[1], 2)})! Pivot in every column (rank A = rank [A|b] = 2).`,
            });
          }
        };

        const kSl = slider("k (L₂)", {
          min: -2,
          max: 2,
          step: 0.5,
          value: s.k,
          fmt: (v) => ns(v, 1),
          onInput: (v) => {
            s.k = v;
            s.mode = "custom";
            seg?.set("custom");
            draw();
          },
        });
        const dSl = slider("d (L₂)", {
          min: -3,
          max: 5,
          step: 0.5,
          value: s.d,
          fmt: (v) => ns(v, 1),
          onInput: (v) => {
            s.d = v;
            s.mode = "custom";
            seg?.set("custom");
            draw();
          },
        });

        seg = segmented(
          Object.entries(modes).map(([k, v]) => [k, v.label]),
          s.mode,
          (v) => {
            s.mode = v;
            s.k = modes[v].k;
            s.d = modes[v].d;
            kSl.set(s.k);
            dSl.set(s.d);
            draw();
          },
        );
        ctl.append(seg);
        sliders.append(kSl, dSl);
        draw();
      },
    },

    {
      id: "ls-gauss",
      mathId: "m-ls-rref",
      title: {
        tr: "Temel Satır İşlemleri ve Adım Adım Gauss–Jordan Yok Etme (RREF)",
        en: "Elementary Row Operations & Step-by-Step Gaussian Elimination",
      },
      body: [
        {
          tr: R`İki bilinmeyende çizim yapmak kolaydır; peki 3, 5 veya 100 bilinmeyenli bir sistemi nasıl çözeriz? Cevap [[rref|Gauss–Jordan yok etme]] algoritmasıdır! Yalnızca şu <b>üç temel satır işlemini</b> kullanarak genişletilmiş matrisi \([A\mid\mathbf b]\) indirgenmiş satır basamak formuna (RREF) getiririz — bu üç işlem çözüm kümesini <b>asla değiştirmez</b>:`,
          en: R`Drawing lines works in 2D, but how do we solve systems with 3, 5, or 100 variables? With [[rref|Gauss–Jordan elimination]]! Using ONLY these <b>three elementary row operations</b>, we simplify \([A\mid\mathbf b]\) into RREF without <b>ever altering the solution set</b>:`,
        },
        {
          list: [
            {
              tr: R`<b>Satır değişimi (\(R_i \leftrightarrow R_j\)):</b> İki denklemin sırasını değiştir.`,
              en: R`<b>Row swap (\(R_i \leftrightarrow R_j\)):</b> swap the order of two equations.`,
            },
            {
              tr: R`<b>Sıfırdan farklı skalerle çarpma (\(R_i \leftarrow c R_i,\ c \ne 0\)):</b> Bir denklemin tüm terimlerini sıfır olmayan bir sayıyla çarp veya böl (pivotu \(1\) yapmak için!).`,
              en: R`<b>Nonzero scaling (\(R_i \leftarrow c R_i,\ c \ne 0\)):</b> multiply or divide a row by any nonzero constant (used to make pivots equal to \(1\)!).`,
            },
            {
              tr: R`<b>Satır ekleme (\(R_i \leftarrow R_i + c R_j\)):</b> Bir satıra başka bir satırın katını ekle (pivotun altını ve üstünü sıfırlamak için!).`,
              en: R`<b>Row replacement (\(R_i \leftarrow R_i + c R_j\)):</b> add a multiple of one row to another (used to create zeros below and above each pivot!).`,
            },
          ],
          ordered: true,
        },
        {
          analogy: {
            title: { tr: "Temiz bir merdiven basamağı inşa etmek", en: "Building a clean staircase of pivots" },
            text: {
              tr: R`Önce soldan sağa ilerleyip her sütunda bir <b>pivot</b> (\(1\)) seçer ve altındaki sayıları sıfırlarız (ileri yok etme — aşağı inen bir merdiven oluşur!). Sonra her pivotun <em>üstündeki</em> sayıları da sıfırlarız (Jordan aşaması). Bittiğinde her basamakta tek bir bilinmeyen yalnız kalır ve cevap doğrudan sağ sütunda görünür!`,
              en: R`Working left to right, pick a <b>pivot</b> (\(1\)) in each column and zero out everything below it (forming a downward staircase). Then zero out everything <em>above</em> each pivot too (the Jordan pass). When done, each staircase step isolates one variable so the answer sits waiting in the rightmost column!`,
            },
          },
        },
        {
          eq: R`R_i \leftrightarrow R_j, \qquad R_i \leftarrow c R_i\ (c \ne 0), \qquad R_i \leftarrow R_i + c R_j`,
        },
        {
          example: {
            title: { tr: "Bir 2×2 sistemi adım adım RREF'e indirme", en: "Reducing a 2×2 system to RREF step by step" },
            problem: {
              tr: R`\(x + 2y = 5\) ve \(3x + 5y = 14\) sistemini temel satır işlemleriyle RREF'e indirip çözün.`,
              en: R`Solve \(x + 2y = 5\) and \(3x + 5y = 14\) by reducing \([A\mid\mathbf b]\) to RREF.`,
            },
            steps: [
              {
                expr: R`\left[\begin{array}{cc|c} 1 & 2 & 5 \\ 3 & 5 & 14 \end{array}\right]`,
                note: {
                  tr: R`Genişletilmiş matrisi yazıyoruz. \((1, 1)\) konumundaki ilk pivot zaten \(1\)!`,
                  en: R`Write the augmented matrix. Pivot 1 at \((1, 1)\) is already \(1\)!`,
                },
              },
              {
                expr: R`R_2 \leftarrow R_2 - 3R_1 \implies \left[\begin{array}{cc|c} 1 & 2 & 5 \\ 0 & -1 & -1 \end{array}\right]`,
                note: {
                  tr: R`1. pivotun altındaki \(3\)'ü sıfırlıyoruz (\(3 - 3\cdot 1 = 0\), \(5 - 3\cdot 2 = -1\), \(14 - 3\cdot 5 = -1\)).`,
                  en: R`Zero out the \(3\) below pivot 1 (\(3 - 3 = 0\), \(5 - 6 = -1\), \(14 - 15 = -1\)).`,
                },
              },
              {
                expr: R`R_2 \leftarrow -R_2 \implies \left[\begin{array}{cc|c} 1 & 2 & 5 \\ 0 & 1 & 1 \end{array}\right]`,
                note: {
                  tr: R`2. satırı \(-1\) ile çarpıp 2. pivotu \(1\) yapıyoruz.`,
                  en: R`Multiply row 2 by \(-1\) to turn pivot 2 into \(1\).`,
                },
              },
              {
                expr: R`R_1 \leftarrow R_1 - 2R_2 \implies \left[\begin{array}{cc|c} 1 & 0 & 3 \\ 0 & 1 & 1 \end{array}\right]`,
                note: {
                  tr: R`2. pivotun üstündeki \(2\)'yi sıfırladık — işte RREF! Doğrudan \(x = 3\) ve \(y = 1\) okunur.`,
                  en: R`Zero out the \(2\) above pivot 2 — full RREF! Read directly: \(x = 3\) and \(y = 1\).`,
                },
              },
            ],
            answer: {
              tr: R`\(x = 3,\ y = 1\) (sağlama: \(3 + 2(1) = 5\) ve \(3(3) + 5(1) = 14\) ✓).`,
              en: R`\(x = 3,\ y = 1\) (check: \(3 + 2(1) = 5\) and \(3(3) + 5(1) = 14\) ✓).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: Yasak satır işlemleri!", en: "Common mistake: Illegal row operations!" },
            text: {
              tr: R`Şu üç hamle kesinlikle <b>YASAKTIR</b>: <b>(1)</b> Bir satırı \(0\) ile çarpmak (\(R_2 \leftarrow 0\cdot R_2\) bütün denklemi yok eder!), <b>(2)</b> Bir satıra sabit bir sayı eklemek (\(R_1 \leftarrow R_1 + 2\) denklemi bozar!), <b>(3)</b> Lineer sistem çözerken <b>sütun işlemi</b> yapmak (sütunları karıştırmak bilinmeyenleri karıştırır!).`,
              en: R`Never perform these three <b>ILLEGAL</b> moves: <b>(1)</b> multiplying a row by \(0\) (\(R_2 \leftarrow 0\cdot R_2\) erases an equation!), <b>(2)</b> adding a plain constant to a row (\(R_1 \leftarrow R_1 + 2\) breaks the equation!), or <b>(3)</b> doing <b>column operations</b> while solving \(A\mathbf x = \mathbf b\) (columns belong to variables!).`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>3×3 Tek çözüm</b> seçiliyken <b>Sonraki adım →</b> düğmesine tek tek basın: mavi pivotların basamak basamak nasıl oluştuğunu ve değişen satırların vurgulanmasını izleyin!`,
              en: R`On <b>3×3 Unique</b>, click <b>Next step →</b> one click at a time: watch blue pivots step down the staircase as modified rows highlight!`,
            },
            {
              tr: R`<b>Serbest değişkenli</b> seçeneğine geçip <b>RREF</b> düğmesine basın: 2. sütunda hiç mavi pivot kalmadığını görün — işte \(x_2\) serbest değişkendir!`,
              en: R`Switch to <b>Free variable</b> and click <b>RREF</b>: notice column 2 has NO blue pivot — that makes \(x_2\) a free variable!`,
            },
            {
              tr: R`<b>Tutarsız (0 = 1)</b> seçeneğinde <b>RREF</b>'e atlayın ve en alt satıra bakın: katsayıların hepsi \(0\) ama sağ taraf sıfırdan farklı!`,
              en: R`Switch to <b>Inconsistent</b> and jump to <b>RREF</b>: check the bottom row — all zero coefficients on the left, nonzero on the right!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.gauss ??= { preset: "unique" });
        const presets = {
          unique: { label: { tr: "3×3 Tek çözüm", en: "3×3 Unique" }, M: [[1, 2, -1, 3], [2, 1, 1, 4], [-1, 1, 2, 1]] },
          inf: { label: { tr: "Serbest değişkenli", en: "Free variable" }, M: [[1, 1, 1, 4], [2, 2, 3, 9], [1, 1, 2, 5]] },
          none: { label: { tr: "Tutarsız (0 = c)", en: "Inconsistent" }, M: [[1, 2, 1, 2], [2, 4, 2, 5], [0, 1, -1, 1]] },
        };
        const ctl = h("div", { class: "t-controls" });
        const stepHost = h("div");
        const verdict = h("p", { class: "pc-msg" });
        box.append(ctl, stepHost, verdict);

        const stepper = createRrefStepper(stepHost, presets[s.preset].M, 3);
        const showVerdict = (res) => {
          const pCols = res.pivots.map(([, c]) => `x${c + 1}`).join(", ");
          const pivotSet = new Set(res.pivots.map(([, c]) => c));
          const freeCols = [0, 1, 2].filter((c) => !pivotSet.has(c)).map((c) => `x${c + 1}`).join(", ");
          if (res.rankAug > res.rankA) {
            verdict.className = "pc-msg bad";
            verdict.textContent = L({
              tr: `RREF sonucu: rank(A) = ${res.rankA} < rank([A|b]) = ${res.rankAug} → Çelişki satırı çıktı, çözüm YOK!`,
              en: `RREF summary: rank(A) = ${res.rankA} < rank([A|b]) = ${res.rankAug} → Contradiction row found, NO solution!`,
            });
          } else if (res.rankA === 3) {
            verdict.className = "pc-msg good";
            verdict.textContent = L({
              tr: `RREF sonucu: rank = 3 (pivotlar: ${pCols}), serbest değişken yok → Tek çözüm!`,
              en: `RREF summary: rank = 3 (pivots: ${pCols}), zero free variables → Unique solution!`,
            });
          } else {
            verdict.className = "pc-msg info";
            verdict.textContent = L({
              tr: `RREF sonucu: rank(A) = rank([A|b]) = ${res.rankA} (pivot: ${pCols}; serbest: ${freeCols}) → Sonsuz çözüm!`,
              en: `RREF summary: rank(A) = rank([A|b]) = ${res.rankA} (pivots: ${pCols}; free: ${freeCols}) → Infinitely many solutions!`,
            });
          }
        };

        showVerdict(stepper.getResult());
        ctl.append(
          segmented(
            Object.entries(presets).map(([k, v]) => [k, v.label]),
            s.preset,
            (k) => {
              s.preset = k;
              const res = stepper.update(presets[k].M, 3);
              showVerdict(res);
            },
          ),
        );
      },
    },

    {
      id: "ls-rank",
      mathId: "m-ls-rc",
      title: {
        tr: "Rank, Pivot vs. Serbest Değişkenler ve Rouché–Capelli Teoremi",
        en: "Rank, Pivot vs. Free Variables & The Rouché–Capelli Theorem",
      },
      body: [
        {
          tr: R`Bir matrisin [[rank|rankı]] \(\operatorname{rank}(A)\) ("\(A\)'nın rankı"), RREF'e indirildiğinde ortaya çıkan <b>pivot sayısından</b> başka bir şey değildir! Başka bir deyişle, sistemdeki birbirinin tekrarı olmayan <em>gerçekten bağımsız denklem sayısını</em> ölçer.`,
          en: R`The [[rank|rank]] of a matrix, \(\operatorname{rank}(A)\) ("rank of \(A\)"), is simply the <b>number of pivots</b> surviving in its RREF! In plain words, it counts how many genuinely independent (non-redundant) equations the system actually has.`,
        },
        {
          tr: R`<b>Rouché–Capelli Teoremi</b> her boyuttaki (\(m\times n\)) lineer sistemi iki küçük sayıyı karşılaştırarak anında sınıflandırır: \(r = \operatorname{rank}(A)\) ve \(r_{\text{aug}} = \operatorname{rank}([A\mid\mathbf b])\). Eğer \(r < r_{\text{aug}}\) ise çözüm yoktur. Eğer \(r = r_{\text{aug}}\) ise sistem tutarlıdır ve <b>serbest değişken sayısı tam olarak \(n - r\)</b> olur (\(n\): toplam bilinmeyen sayısı)!`,
          en: R`The <b>Rouché–Capelli Theorem</b> classifies ANY \(m\times n\) linear system by comparing two numbers: \(r = \operatorname{rank}(A)\) and \(r_{\text{aug}} = \operatorname{rank}([A\mid\mathbf b])\). If \(r < r_{\text{aug}}\), there is no solution. If \(r = r_{\text{aug}}\), the system is consistent with exactly <b>\(n - r\) free variables</b> (where \(n\) is the number of unknowns)!`,
        },
        {
          analogy: {
            title: { tr: "Bütçedeki kısıtlar vs. özgür tercih hakkı", en: "Independent rules vs. degrees of freedom" },
            text: {
              tr: R`Günlük \(n = 3\) karar vereceğinizi düşünün (ders, spor ve dinlenme saatleri). Her bağımsız kural (her <b>pivot</b>) bir kararınızı kilitler. Eğer elinizde yalnızca \(r = 2\) bağımsız kural varsa, \(n - r = 3 - 2 = 1\) tane <b>serbest tercih hakkınız</b> kalır (ona \(t\) deriz) — siz \(t\)'yi özgürce seçersiniz, diğer iki pivot değişkeni buna göre otomatik hesaplanır!`,
              en: R`Imagine choosing \(n = 3\) daily numbers (hours of study, exercise, rest). Each independent constraint (each <b>pivot</b>) locks down one choice. If you only have \(r = 2\) independent constraints, you have \(n - r = 3 - 2 = 1\) <b>free degree of freedom</b> (call it \(t\)) — pick \(t\) freely, and the 2 pivot variables adjust automatically!`,
            },
          },
        },
        {
          eq: {
            tr: R`\text{Tutarlı} \iff \operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]), \qquad \#(\text{serbest değişken}) = n - \operatorname{rank}(A)`,
            en: R`\text{Consistent} \iff \operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]), \qquad \#(\text{free variables}) = n - \operatorname{rank}(A)`,
          },
        },
        {
          example: {
            title: { tr: "RREF'ten pivot ve serbest değişkenlerle parametrik çözüm okuma", en: "Reading a parametric solution from RREF" },
            problem: {
              tr: R`\(3\) bilinmeyenli (\(x_1, x_2, x_3\)) bir sistemin RREF hâli \(\left[\begin{array}{ccc|c} 1 & 2 & 0 & 5 \\ 0 & 0 & 1 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]\) ise rankları, serbest değişkeni ve genel çözümü yazın.`,
              en: R`A system in \(x_1, x_2, x_3\) has RREF \(\left[\begin{array}{ccc|c} 1 & 2 & 0 & 5 \\ 0 & 0 & 1 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]\). Find the ranks, free variable, and general solution.`,
            },
            steps: [
              {
                expr: R`\operatorname{rank}(A) = 2, \qquad \operatorname{rank}([A\mid\mathbf b]) = 2, \qquad n = 3`,
                note: {
                  tr: R`1. ve 3. sütunlarda pivot var (\(r = 2\)). En alttaki \([0\ 0\ 0\mid 0]\) çelişki değil, dolayısıyla \(r = r_{\text{aug}} = 2\) (tutarlı!).`,
                  en: R`Pivots sit in columns 1 and 3 (\(r = 2\)). The bottom row \([0\ 0\ 0\mid 0]\) is no contradiction, so \(r = r_{\text{aug}} = 2\) (consistent!).`,
                },
              },
              {
                expr: {
                  tr: R`\text{Pivot: } x_1, x_3, \qquad \text{Serbest: } x_2 = t \quad (t \in \mathbb{R})`,
                  en: R`\text{Pivots: } x_1, x_3, \qquad \text{Free: } x_2 = t \quad (t \in \mathbb{R})`,
                },
                note: {
                  tr: R`Pivotu olmayan tek sütun 2. sütun olduğundan \(n - r = 3 - 2 = 1\) serbest değişken \(x_2 = t\) seçilir.`,
                  en: R`Column 2 has no pivot, giving \(n - r = 3 - 2 = 1\) free variable: set \(x_2 = t\).`,
                },
              },
              {
                expr: R`x_1 + 2x_2 = 5 \implies x_1 = 5 - 2t, \qquad x_3 = 3`,
                note: {
                  tr: R`Her pivot satırından pivot değişkenini \(t\) cinsinden yalnız bırakıyoruz.`,
                  en: R`Solve each pivot row for its pivot variable in terms of \(t\).`,
                },
              },
              {
                expr: R`\mathbf x = \begin{bmatrix} 5 - 2t \\ t \\ 3 \end{bmatrix} = \begin{bmatrix} 5 \\ 0 \\ 3 \end{bmatrix} + t\begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix} = \mathbf x_p + \mathbf x_h`,
                note: {
                  tr: R`Sabit kısım \(\mathbf x_p = (5, 0, 3)\) bir özel çözümdür; \(t(-2, 1, 0)\) ise homojen sistem \(A\mathbf x = \mathbf 0\)'ın tüm çözümleridir!`,
                  en: R`The constant part \(\mathbf x_p = (5, 0, 3)\) is a particular solution, and \(t(-2, 1, 0)\) gives all solutions of \(A\mathbf x = \mathbf 0\)!`,
                },
              },
            ],
            answer: {
              tr: R`Sonsuz çözüm: \(\mathbf x = (5, 0, 3) + t(-2, 1, 0),\ t \in \mathbb{R}\).`,
              en: R`Infinitely many solutions: \(\mathbf x = (5, 0, 3) + t(-2, 1, 0),\ t \in \mathbb{R}\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: 'Sıfır satırı var = kesin sonsuz çözüm!' sanmak", en: "Common mistake: Thinking 'a zero row always means infinite solutions!'" },
            text: {
              tr: R`Dikkat! \(3\) denklem ve yalnızca \(2\) bilinmeyenli bir sistemde RREF \(\left[\begin{array}{cc|c} 1 & 0 & 2 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{array}\right]\) çıkabilir: en altta sıfır satırı VAR, ama \(n = 2\) sütunun ikisinde de pivot olduğu için \(n - r = 2 - 2 = 0\) serbest değişken vardır — yani <b>çözüm tektir</b>! Sonsuz çözümü yaratan şey sıfır satırı değil, <b>pivotsuz (serbest) sütunlardır</b> (\(r < n\))!`,
              en: R`Watch out! A \(3\)-equation, \(2\)-variable system can have RREF \(\left[\begin{array}{cc|c} 1 & 0 & 2 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{array}\right]\): there IS a zero row at the bottom, yet BOTH variable columns have pivots (\(r = n = 2\), zero free variables) — so the solution \((2, 1)\) is <b>UNIQUE</b>! Infinite solutions come from <b>non-pivot (free) columns</b> (\(r < n\)), not zero rows!`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>2×3 (1 Serbest)</b> seçeneğine tıklayın: 2 denklem, 3 bilinmeyen varken \(r \le 2 < 3\) olduğu için tutarlıysa mutlaka en az 1 serbest değişken vardır (\(x_2\))!`,
              en: R`Click <b>2×3 (1 Free)</b>: with 2 equations and 3 unknowns, \(r \le 2 < 3\), so whenever it is consistent there is guaranteed to be at least 1 free variable (\(x_2\))!`,
            },
            {
              tr: R`<b>3×2 (Tek Çözüm!)</b> seçeneğine bakın: en altta \([0\ 0 \mid 0]\) sıfır satırı duruyor, ama her iki değişken sütununda da pivot olduğu için çözüm <b>tek</b>!`,
              en: R`Click <b>3×2 (Unique!)</b>: there is a \([0\ 0 \mid 0]\) zero row at the bottom, YET both variable columns hold pivots, so the solution is <b>unique</b>!`,
            },
            {
              tr: R`<b>3×2 (Tek Çözüm!)</b> içindeyken sağ sütundaki en alt sayıyı (\(4\)) \(5\) yapın: \(\operatorname{rank}([A\mid\mathbf b])\) anında \(2\)'den \(3\)'e fırlar ve sistem tutarsız hâle gelir!`,
              en: R`While in <b>3×2 (Unique!)</b>, change the bottom-right entry (\(4\)) to \(5\): watch \(\operatorname{rank}([A\mid\mathbf b])\) jump from \(2\) to \(3\) and break consistency!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.rank ??= {
          preset: "u23",
          n: 3,
          M: [[1, 2, 1, 5], [0, 0, 1, 3]],
        });
        const presets = {
          u23: { label: { tr: "2×3 (1 Serbest)", en: "2×3 (1 Free)" }, n: 3, M: [[1, 2, 1, 5], [0, 0, 1, 3]] },
          o32: { label: { tr: "3×2 (Tek Çözüm!)", en: "3×2 (Unique!)" }, n: 2, M: [[1, 1, 3], [1, -1, 1], [2, 0, 4]] },
          s33: { label: { tr: "3×3 (2 Serbest)", en: "3×3 (2 Free)" }, n: 3, M: [[1, 2, -1, 4], [2, 4, -2, 8], [-1, -2, 1, -4]] },
          inc: { label: { tr: "3×3 (Tutarsız)", en: "3×3 (Inconsistent)" }, n: 3, M: [[1, 1, 1, 2], [2, 2, 2, 5], [0, 1, -1, 1]] },
        };

        const ctl = h("div", { class: "t-controls" });
        const grids = h("div", { class: "mx-row-wrap" });
        const inWrap = h("div");
        const outWrap = h("div");
        grids.append(inWrap, outWrap);
        const tiles = h("div", { class: "pg-tiles" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, grids, tiles, msg);

        const draw = () => {
          const res = rref(s.M, s.n);
          const pivotCols = res.pivots.map(([, c]) => c);
          const pivotSet = new Set(pivotCols);
          const freeCols = Array.from({ length: s.n }, (_, c) => c).filter((c) => !pivotSet.has(c));
          const pNames = pivotCols.map((c) => `x${c + 1}`).join(", ") || "—";
          const fNames = freeCols.map((c) => `x${c + 1}`).join(", ") || "—";

          outWrap.replaceChildren(
            h("div", { class: "mini-title", text: "RREF([A | b])" }),
            matrixDisplay(res.matrix, { pivots: res.pivots, augCol: s.n }),
          );

          tiles.replaceChildren(
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "rank(A)" }), h("span", { class: "pg-tile-value", text: String(res.rankA) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "rank([A|b])" }), h("span", { class: "pg-tile-value", text: String(res.rankAug) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Bilinmeyen (n)", en: "Unknowns (n)" }) }), h("span", { class: "pg-tile-value", text: String(s.n) })),
            h(
              "div",
              { class: "pg-tile" },
              h("span", { class: "pg-tile-label", text: L({ tr: "Serbest (n−r)", en: "Free (n−r)" }) }),
              h("span", { class: "pg-tile-value", text: res.rankAug > res.rankA ? "—" : String(s.n - res.rankA) }),
            ),
          );

          if (res.rankAug > res.rankA) {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `Tutarsız! rank(A) = ${res.rankA} < rank([A|b]) = ${res.rankAug}. Sağ sütunda çelişki satırı oluştu → Çözüm yok!`,
              en: `Inconsistent! rank(A) = ${res.rankA} < rank([A|b]) = ${res.rankAug}. Contradiction row in the RHS column → No solution!`,
            });
          } else if (freeCols.length === 0) {
            const sol = Array.from({ length: s.n }, (_, i) => ns(res.matrix[i][s.n], 2)).join(", ");
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Tek çözüm: (${sol})! Pivotlar: ${pNames}; serbest değişken yok (n − r = 0).`,
              en: `Unique solution: (${sol})! Pivots: ${pNames}; zero free variables (n − r = 0).`,
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `Sonsuz çözüm! Pivot değişkenler: ${pNames} · Serbest parametreler (${freeCols.length}): ${fNames}.`,
              en: `Infinitely many solutions! Pivot variables: ${pNames} · Free parameters (${freeCols.length}): ${fNames}.`,
            });
          }
        };

        const rebuildInput = () => {
          inWrap.replaceChildren(
            h("div", { class: "mini-title", text: "[A | b]" }),
            matrixInput(s.M, draw, { augCol: s.n }),
          );
          draw();
        };

        ctl.append(
          segmented(
            Object.entries(presets).map(([k, v]) => [k, v.label]),
            s.preset,
            (k) => {
              s.preset = k;
              s.n = presets[k].n;
              s.M = presets[k].M.map((r) => [...r]);
              rebuildInput();
            },
          ),
        );
        rebuildInput();
      },
    },
  ],

  playground: {
    title: {
      tr: "Etkileşimli 3×3 Lineer Sistem Çözücü (Gauss–Jordan Laboratuvarı)",
      en: "Interactive 3×3 Linear System Solver (Gauss–Jordan Lab)",
    },
    sub: {
      tr: R`Hazır senaryolardan birini seçin veya genişletilmiş matris \([A \mid \mathbf b]\) kutularını kendiniz düzenleyin; her satır işlemini tek tek oynatın ve rank / pivot / çözüm sınıflandırmasını canlı görün.`,
      en: R`Pick a preset scenario or edit the augmented matrix \([A \mid \mathbf b]\) directly; step through every row operation and read the rank, pivots, and solution classification live.`,
    },
    experiments: [
      {
        tr: R`<b>Sınav Klasiği (Tek Çözüm):</b> <b>Tek Çözüm</b> düğmesine basıp <b>Sonraki adım →</b> ile tüm adımları oynatın; çıkan \((5, 3, -2)\) çözümünü ilk satıra koyup kontrol edin: \(5 + 3 + (-2) = 6\) ✓!`,
        en: R`<b>Exam Classic (Unique):</b> load <b>Unique Solution</b> and step through with <b>Next step →</b>; plug the resulting \((5, 3, -2)\) back into row 1 to verify: \(5 + 3 + (-2) = 6\) ✓!`,
      },
      {
        tr: R`<b>Tek Sayıyla Sistemi Çökertmek:</b> <b>Sonsuz Çözüm</b> düğmesine basın (\(\operatorname{rank} = 2\)). Şimdi en sağ alttaki \(5\) sayısını \(6\) yapın — \(\operatorname{rank}([A\mid\mathbf b])\) anında \(3\)'e çıkar ve tüm çözümler yok olur!`,
        en: R`<b>Breaking Consistency With One Number:</b> load <b>Infinite Solutions</b> (\(\operatorname{rank} = 2\)), then change ONLY the bottom-right \(5\) to \(6\) — watch \(\operatorname{rank}([A\mid\mathbf b])\) jump to \(3\) and kill every solution!`,
      },
      {
        tr: R`<b>Homojen Sistem (Ax = 0):</b> <b>Homojen</b> senaryosunu açın. Sağ sütunu \((0, 0, 0)\) bıraktığınız sürece \(A\)'daki sayıları istediğiniz kadar değiştirin — sistemi asla tutarsız yapamadığınızı göreceksiniz!`,
        en: R`<b>Homogeneous System (Ax = 0):</b> load <b>Homogeneous</b>. Keep the right column \((0, 0, 0)\) and edit any entries of \(A\) — notice you can NEVER make it inconsistent because \(\mathbf x = \mathbf 0\) always works!`,
      },
      {
        tr: R`<b>Ödev / Sınav Kontrolü:</b> Kendi \(3\times 3\) sisteminizi kutulara girip <b>Sonraki adım →</b> ile kâğıtta yaptığınız yok etme adımlarını tek tek doğrulayın.`,
        en: R`<b>Check Your Own Work:</b> type any \(3\times 3\) homework system into the grid and use <b>Next step →</b> to verify every elimination step you did on paper.`,
      },
    ],
    build(host, state) {
      const s = (state.pg ??= {
        preset: "unique",
        M: [[1, 1, 1, 6], [0, 2, 5, -4], [2, 5, -1, 27]],
      });
      const presets = {
        unique: { label: { tr: "Tek Çözüm", en: "Unique" }, M: [[1, 1, 1, 6], [0, 2, 5, -4], [2, 5, -1, 27]] },
        inf: { label: { tr: "Sonsuz Çözüm", en: "Infinite" }, M: [[1, 2, 1, 4], [2, 4, 3, 9], [1, 2, 2, 5]] },
        none: { label: { tr: "Tutarsız (Çelişki)", en: "Inconsistent" }, M: [[1, 2, 1, 4], [2, 4, 3, 9], [1, 2, 2, 6]] },
        hom: { label: { tr: "Homojen (Ax = 0)", en: "Homogeneous" }, M: [[1, -2, 1, 0], [2, -4, 2, 0], [1, -1, 0, 0]] },
      };

      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const ctl = h("div", { class: "t-controls" });
      const editWrap = h("div", { class: "mx-row-wrap" });
      const tiles = h("div", { class: "pg-tiles" });
      const msg = h("p", { class: "pc-msg" });
      stage.append(ctl, h("div", { class: "mini-title", text: "[A | b]" }), editWrap, tiles, msg);

      const stepper = createRrefStepper(side, s.M, 3);
      const sync = () => {
        const res = stepper.update(s.M, 3);
        const free = 3 - res.rankA;
        const pivotSet = new Set(res.pivots.map(([, c]) => c));
        const pNames = res.pivots.map(([, c]) => `x${c + 1}`).join(", ") || "—";
        const fNames = [0, 1, 2].filter((c) => !pivotSet.has(c)).map((c) => `x${c + 1}`).join(", ") || "—";

        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "rank(A)" }), h("span", { class: "pg-tile-value", text: String(res.rankA) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "rank([A|b])" }), h("span", { class: "pg-tile-value", text: String(res.rankAug) })),
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: L({ tr: "Serbest", en: "Free vars" }) }),
            h("span", { class: "pg-tile-value", text: res.rankAug > res.rankA ? "—" : String(free) }),
          ),
        );
        if (res.rankAug > res.rankA) {
          msg.className = "pc-msg bad";
          msg.textContent = L({
            tr: "rank(A) < rank([A|b]): sistem tutarsız, çözüm kümesi boş (∅)!",
            en: "rank(A) < rank([A|b]): inconsistent system, empty solution set (∅)!",
          });
        } else if (free === 0) {
          msg.className = "pc-msg good";
          msg.textContent = L({
            tr: `Tek çözüm: x = (${ns(res.matrix[0][3], 2)}, ${ns(res.matrix[1][3], 2)}, ${ns(res.matrix[2][3], 2)})!`,
            en: `Unique solution: x = (${ns(res.matrix[0][3], 2)}, ${ns(res.matrix[1][3], 2)}, ${ns(res.matrix[2][3], 2)})!`,
          });
        } else {
          msg.className = "pc-msg info";
          msg.textContent = L({
            tr: `Tutarlı ve ${free} serbest değişkenli (pivot: ${pNames}; serbest: ${fNames}): sonsuz çözüm!`,
            en: `Consistent with ${free} free variable(s) (pivots: ${pNames}; free: ${fNames}): infinitely many solutions!`,
          });
        }
      };

      const rebuildEditor = () => {
        editWrap.replaceChildren(matrixInput(s.M, sync, { augCol: 3 }));
        sync();
      };

      ctl.append(
        segmented(
          Object.entries(presets).map(([k, v]) => [k, v.label]),
          s.preset,
          (k) => {
            s.preset = k;
            s.M = presets[k].M.map((r) => [...r]);
            rebuildEditor();
          },
        ),
      );
      rebuildEditor();
    },
  },

  mathSections: [
    {
      id: "m-ls-geom",
      title: { tr: "Satır ve Sütun Görünümü: Ax = b İki Farklı Gözle", en: "Row Picture vs. Column Picture of Ax = b" },
      blocks: [
        {
          p: {
            tr: R`Aynı \(A\mathbf x = \mathbf b\) sistemini iki farklı gözlükle görebilirsiniz. <b>Satır görünümü</b> her satırı bir doğru/düzlem olarak çizer ve kesişim noktasını arar. <b>Sütun görünümü</b> ise \(A\mathbf x = x_1\mathbf a_1 + \dots + x_n\mathbf a_n = \mathbf b\) der ve şunu sorar: "\(A\)'nın sütunlarından kaçar ölçek karıştırırsak hedef vektör \(\mathbf b\)'ye ulaşırız?"`,
            en: R`You can view the exact same system \(A\mathbf x = \mathbf b\) through two lenses. The <b>row picture</b> draws each row as a line or plane and looks for their intersection. The <b>column picture</b> writes \(x_1\mathbf a_1 + \dots + x_n\mathbf a_n = \mathbf b\) and asks: "what recipe of \(A\)'s columns builds the target vector \(\mathbf b\)?"`,
          },
        },
        { eq: R`A\mathbf x = \mathbf b \iff x_1\mathbf a_1 + x_2\mathbf a_2 + \dots + x_n\mathbf a_n = \mathbf b` },
        {
          callout: "tip",
          title: { tr: "Sütun görünümünün büyük hediyesi", en: "The big payoff of the column picture" },
          text: {
            tr: R`\(A\mathbf x = \mathbf b\) sisteminin en az bir çözümü olması <b>ancak ve ancak</b> hedef vektör \(\mathbf b\)'nin, \(A\)'nın sütunlarının [[span|gerdiği]] (span) uzayda bulunmasıyla mümkündür! Bu köprü Bölüm 8 ve 9'da vektör uzaylarının temelini oluşturur.`,
            en: R`The system \(A\mathbf x = \mathbf b\) has a solution <b>if and only if</b> \(\mathbf b\) lies in the [[span|span]] of the columns of \(A\)! This bridge leads directly into vector spaces in Chapters 8 and 9.`,
          },
        },
        {
          example: {
            title: { tr: "Bir sistemi hem satır hem sütun gözüyle okuma", en: "Reading one system in both row and column pictures" },
            problem: {
              tr: R`\(2x + y = 5\) ve \(x - y = 1\) sisteminin çözümü \((x, y) = (2, 1)\) sonucunu iki görünümde de doğrulayın.`,
              en: R`Verify the solution \((x, y) = (2, 1)\) of \(2x + y = 5\) and \(x - y = 1\) in both the row picture and the column picture.`,
            },
            steps: [
              {
                expr: {
                  tr: R`\text{Satır: } 2(2) + 1 = 5\ \checkmark, \qquad 2 - 1 = 1\ \checkmark`,
                  en: R`\text{Row: } 2(2) + 1 = 5\ \checkmark, \qquad 2 - 1 = 1\ \checkmark`,
                },
                note: {
                  tr: R`<b>Satır görünümü:</b> \((2, 1)\) noktası hem \(2x + y = 5\) hem de \(x - y = 1\) doğrusu üzerindedir.`,
                  en: R`<b>Row picture:</b> the point \((2, 1)\) sits on both lines \(2x + y = 5\) and \(x - y = 1\).`,
                },
              },
              {
                expr: {
                  tr: R`\text{Sütun: } 2\begin{bmatrix} 2 \\ 1 \end{bmatrix} + 1\begin{bmatrix} 1 \\ -1 \end{bmatrix} = \begin{bmatrix} 4 + 1 \\ 2 - 1 \end{bmatrix} = \begin{bmatrix} 5 \\ 1 \end{bmatrix}`,
                  en: R`\text{Column: } 2\begin{bmatrix} 2 \\ 1 \end{bmatrix} + 1\begin{bmatrix} 1 \\ -1 \end{bmatrix} = \begin{bmatrix} 4 + 1 \\ 2 - 1 \end{bmatrix} = \begin{bmatrix} 5 \\ 1 \end{bmatrix}`,
                },
                note: {
                  tr: R`<b>Sütun görünümü:</b> 1. sütundan \(2\) ölçek + 2. sütundan \(1\) ölçek tam olarak hedef vektör \(\mathbf b = (5, 1)\)'i inşa eder!`,
                  en: R`<b>Column picture:</b> \(2\) copies of column 1 plus \(1\) copy of column 2 build the exact target \(\mathbf b = (5, 1)\)!`,
                },
              },
            ],
            answer: {
              tr: R`İki görünüm aynı tek çözümü verir: \((x, y) = (2, 1)\).`,
              en: R`Both pictures give the exact same unique solution: \((x, y) = (2, 1)\).`,
            },
          },
        },
      ],
    },

    {
      id: "m-ls-rref",
      title: { tr: "RREF Koşulları ve Satır İşlemlerinin Denkliği İspatı", en: "RREF Conditions & Proof of Row-Operation Equivalence" },
      blocks: [
        {
          p: {
            tr: R`Bir matrisin tam <b>İndirgenmiş Satır Basamak Formunda (RREF)</b> sayılması için şu dört şartın dördünü birden sağlaması gerekir:`,
            en: R`A matrix is in <b>Reduced Row Echelon Form (RREF)</b> if and only if it satisfies all four conditions:`,
          },
        },
        {
          list: [
            { tr: R`Sıfır olmayan her satırın soldan ilk sıfırdan farklı elemanı (<b>pivot</b>) \(1\)'dir.`, en: R`The leading nonzero entry (<b>pivot</b>) of every nonzero row is \(1\).` },
            { tr: R`Her pivot, bir üst satırdaki pivottan kesinlikle daha sağdadır (merdiven biçimi).`, en: R`Each pivot lies strictly to the right of the pivot above it (staircase shape).` },
            { tr: R`Bir pivotun bulunduğu sütundaki diğer <b>tüm</b> girişler (hem altı hem üstü) \(0\)'dır.`, en: R`Every other entry in a pivot column (both below and above) is \(0\).` },
            { tr: R`Tamamen sıfır olan satırlar en altta yer alır.`, en: R`All-zero rows sit at the bottom.` },
          ],
          ordered: true,
        },
        {
          table: {
            head: [
              { tr: "Temel satır işlemi", en: "Elementary row operation" },
              { tr: "Geri alan ters işlem", en: "Inverse operation" },
              { tr: "det(A) etkisi", en: "Effect on det(A)" },
            ],
            rows: [
              [
                { tr: R`Satır değişimi: \(R_i \leftrightarrow R_j\)`, en: R`Swap: \(R_i \leftrightarrow R_j\)` },
                { tr: R`Kendisi: \(R_i \leftrightarrow R_j\)`, en: R`Itself: \(R_i \leftrightarrow R_j\)` },
                { tr: R`\(-\det(A)\)`, en: R`\(-\det(A)\)` },
              ],
              [
                { tr: R`Ölçekleme: \(R_i \leftarrow c R_i\ (c \ne 0)\)`, en: R`Scale: \(R_i \leftarrow c R_i\ (c \ne 0)\)` },
                { tr: R`\(R_i \leftarrow \frac{1}{c} R_i\)`, en: R`\(R_i \leftarrow \frac{1}{c} R_i\)` },
                { tr: R`\(c\det(A)\)`, en: R`\(c\det(A)\)` },
              ],
              [
                { tr: R`Satır ekleme: \(R_i \leftarrow R_i + c R_j\)`, en: R`Replace: \(R_i \leftarrow R_i + c R_j\)` },
                { tr: R`\(R_i \leftarrow R_i - c R_j\)`, en: R`\(R_i \leftarrow R_i - c R_j\)` },
                { tr: R`Değişmez (\(\det(A)\))`, en: R`Unchanged (\(\det(A)\))` },
              ],
            ],
          },
        },
        {
          derive: {
            title: { tr: "Temel satır işlemleri çözüm kümesini neden asla değiştirmez?", en: "Why do elementary row operations never change the solution set?" },
            steps: [
              {
                tex: {
                  tr: R`\mathbf x \text{ eski sistemi sağlar} \implies \mathbf x \text{ yeni sistemi de sağlar}`,
                  en: R`\mathbf x \text{ solves the old system} \implies \mathbf x \text{ solves the new system}`,
                },
                why: {
                  tr: R`Satır sırasını değiştirmek, bir eşitliğin iki yanını \(c\) ile çarpmak veya iki doğru eşitliği toplamak yeni doğru eşitlikler üretir; yani eski hiçbir çözüm kaybolmaz!`,
                  en: R`Reordering equations, scaling both sides by \(c\), or adding one true equation to another always produces true equations — so no solution is ever lost!`,
                },
              },
              {
                tex: {
                  tr: R`\text{Her işlemin tersi vardır} \implies \text{eski sistem yenisinden geri elde edilir}`,
                  en: R`\text{Every row op is invertible} \implies \text{the old system follows back from the new one}`,
                },
                why: {
                  tr: R`Peki ya yeni sistemde "sahte" fazladan çözümler türemiş olabilir mi? Hayır! Çünkü her satır işleminin tersi de bir temel satır işlemidir (bu yüzden \(c = 0\) yasaktır: \(1/0\) yoktur!).`,
                  en: R`Could the new system sneak in extra "fake" solutions? No! Because every row operation is reversible by another row operation (that is why \(c = 0\) is forbidden — you could never divide by \(0\) to undo it!).`,
                },
              },
              {
                tex: {
                  tr: R`\mathbf x \text{ yeni sistemi sağlar} \iff \mathbf x \text{ eski sistemi sağlar}`,
                  en: R`\mathbf x \text{ solves the new system} \iff \mathbf x \text{ solves the old system}`,
                },
                why: {
                  tr: R`İki yönlü gerektirme sağlanır: \([A\mid\mathbf b]\) ile \(\operatorname{RREF}([A\mid\mathbf b])\) sistemlerinin çözüm kümeleri birebir aynıdır!`,
                  en: R`Equivalence holds in both directions: \([A\mid\mathbf b]\) and \(\operatorname{RREF}([A\mid\mathbf b])\) share the exact same solution set!`,
                },
              },
            ],
          },
        },
      ],
    },

    {
      id: "m-ls-rc",
      title: { tr: "Rouché–Capelli Teoremi ve x = xₚ + xₕ İspatı", en: "Rouché–Capelli Theorem & Proof of x = xₚ + xₕ" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Rank koşulu", en: "Rank condition" },
              { tr: "Çözüm sayısı", en: "Solutions" },
              { tr: "Serbest parametre", en: "Free parameters" },
            ],
            rows: [
              [
                { tr: R`\(\operatorname{rank}(A) < \operatorname{rank}([A\mid\mathbf b])\)`, en: R`\(\operatorname{rank}(A) < \operatorname{rank}([A\mid\mathbf b])\)` },
                { tr: R`Çözüm yok (\(\emptyset\))`, en: R`No solution (\(\emptyset\))` },
                { tr: "— (tutarsız)", en: "— (inconsistent)" },
              ],
              [
                { tr: R`\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = n\)`, en: R`\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = n\)` },
                { tr: "Tek çözüm", en: "Unique solution" },
                { tr: R`\(0\)`, en: R`\(0\)` },
              ],
              [
                { tr: R`\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = r < n\)`, en: R`\(\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b]) = r < n\)` },
                { tr: "Sonsuz çözüm", en: "Infinitely many" },
                { tr: R`\(n - r\) adet`, en: R`\(n - r\)` },
              ],
            ],
          },
        },
        { eq: R`\mathbf x = \mathbf x_p + \mathbf x_h, \qquad A\mathbf x_p = \mathbf b,\quad A\mathbf x_h = \mathbf 0` },
        {
          derive: {
            title: { tr: "Genel çözüm yapısı: Ax = b çözümlerinin tamamı xₚ + ker(A)'dır", en: "Proof of the general solution structure x = xₚ + xₕ" },
            steps: [
              {
                tex: {
                  tr: R`A\mathbf x_p = \mathbf b \quad \text{ve} \quad A\mathbf x = \mathbf b`,
                  en: R`A\mathbf x_p = \mathbf b \quad \text{and} \quad A\mathbf x = \mathbf b`,
                },
                why: {
                  tr: R`\(\mathbf x_p\) sabit bir özel çözüm (herhangi bir çözüm), \(\mathbf x\) ise sistemin başka herhangi bir çözümü olsun.`,
                  en: R`Let \(\mathbf x_p\) be one fixed particular solution and \(\mathbf x\) be any other solution of \(A\mathbf x = \mathbf b\).`,
                },
              },
              {
                tex: R`A(\mathbf x - \mathbf x_p) = A\mathbf x - A\mathbf x_p = \mathbf b - \mathbf b = \mathbf 0`,
                why: {
                  tr: R`Doğrusallıktan dolayı fark vektörü \(\mathbf x_h = \mathbf x - \mathbf x_p\) homojen denklemi \(A\mathbf x_h = \mathbf 0\) sağlar — yani [[kernel-image|çekirdek]] \(\ker(A)\) içindedir!`,
                  en: R`By linearity, the difference \(\mathbf x_h = \mathbf x - \mathbf x_p\) solves the homogeneous system \(A\mathbf x_h = \mathbf 0\) — so it lives in the [[kernel-image|kernel]] \(\ker(A)\)!`,
                },
              },
              {
                tex: R`A(\mathbf x_p + \mathbf x_h) = A\mathbf x_p + A\mathbf x_h = \mathbf b + \mathbf 0 = \mathbf b`,
                why: {
                  tr: R`<b>Ters yön:</b> çekirdekten hangi \(\mathbf x_h\)'yi alıp \(\mathbf x_p\)'ye eklerseniz ekleyin yeniden \(A\mathbf x = \mathbf b\)'yi sağlar! Dolayısıyla tüm çözüm kümesi \(\mathbf x_p + \ker(A)\)'dır.`,
                  en: R`<b>Converse:</b> adding ANY \(\mathbf x_h \in \ker(A)\) to \(\mathbf x_p\) still gives \(\mathbf b\)! Thus the complete solution set is the shifted kernel \(\mathbf x_p + \ker(A)\).`,
                },
              },
            ],
          },
        },
        {
          example: {
            title: { tr: "Bir 2×3 sistemin çözümünü xₚ + xₕ biçiminde yazma", en: "Writing a 2×3 solution set in x = xₚ + xₕ form" },
            problem: {
              tr: R`\(x + 2y - z = 3\) ve \(2x + 4y - z = 7\) sisteminin tüm çözümlerini \(\mathbf x = \mathbf x_p + \mathbf x_h\) biçiminde ifade edin.`,
              en: R`Express all solutions of \(x + 2y - z = 3\) and \(2x + 4y - z = 7\) in the form \(\mathbf x = \mathbf x_p + \mathbf x_h\).`,
            },
            steps: [
              {
                expr: R`\left[\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 2 & 4 & -1 & 7 \end{array}\right] \xrightarrow{R_2 \leftarrow R_2 - 2R_1} \left[\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & 0 & 1 & 1 \end{array}\right]`,
                note: {
                  tr: R`1. sütundaki \(2\)'yi sıfırladık; 3. sütunda temiz bir pivot \(1\) oluştu.`,
                  en: R`Eliminate the \(2\) in column 1; a clean pivot \(1\) appears in column 3.`,
                },
              },
              {
                expr: R`\xrightarrow{R_1 \leftarrow R_1 + R_2} \left[\begin{array}{ccc|c} 1 & 2 & 0 & 4 \\ 0 & 0 & 1 & 1 \end{array}\right]`,
                note: {
                  tr: R`3. pivotun üstünü sıfırlayarak tam RREF'e ulaştık. Pivotlar: \(x, z\); serbest değişken: \(y = t\).`,
                  en: R`Zero above pivot 3 to finish RREF. Pivots: \(x, z\); free variable: \(y = t\).`,
                },
              },
              {
                expr: R`x = 4 - 2t,\ y = t,\ z = 1 \implies \mathbf x = \begin{bmatrix} 4 \\ 0 \\ 1 \end{bmatrix} + t\begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix}`,
                note: {
                  tr: R`Kontrol: \(\mathbf x_p = (4, 0, 1)\) her iki denklemi de sağlar (\(4 - 1 = 3\) ve \(8 - 1 = 7\)), \(\mathbf x_h = (-2, 1, 0)\) ise ikisini de \(0\) yapar!`,
                  en: R`Check: \(\mathbf x_p = (4, 0, 1)\) satisfies both equations (\(4 - 1 = 3\) and \(8 - 1 = 7\)), while \(\mathbf x_h = (-2, 1, 0)\) maps to \((0, 0)\)!`,
                },
              },
            ],
            answer: {
              tr: R`\(\mathbf x = (4, 0, 1) + t(-2, 1, 0),\ t \in \mathbb{R}\).`,
              en: R`\(\mathbf x = (4, 0, 1) + t(-2, 1, 0),\ t \in \mathbb{R}\).`,
            },
          },
        },
      ],
    },

    {
      id: "m-ls-hom",
      title: { tr: "Homojen Sistemler (Ax = 0) ve Kare Sistemler", en: "Homogeneous Systems (Ax = 0) & Square Systems" },
      blocks: [
        {
          p: {
            tr: R`Sağ tarafı tamamen sıfır olan \(A\mathbf x = \mathbf 0\) sistemine <b>homojen sistem</b> denir. \(\mathbf x = \mathbf 0\) her zaman \(A\mathbf 0 = \mathbf 0\) sağladığı için homojen bir sistem <b>asla tutarsız olamaz</b>: ya yalnızca aşikâr çözüm \(\mathbf x = \mathbf 0\) vardır (\(\operatorname{rank}(A) = n\)), ya da sıfırdan farklı sonsuz çözüm vardır (\(\operatorname{rank}(A) < n\)).`,
            en: R`When the right-hand side is zero, \(A\mathbf x = \mathbf 0\) is a <b>homogeneous system</b>. Because \(\mathbf x = \mathbf 0\) ALWAYS satisfies \(A\mathbf 0 = \mathbf 0\), a homogeneous system is <b>never inconsistent</b>: either \(\mathbf x = \mathbf 0\) is the only solution (\(\operatorname{rank}(A) = n\)), or there are infinitely many nontrivial solutions (\(\operatorname{rank}(A) < n\)).`,
          },
        },
        {
          eq: {
            tr: R`m < n \text{ (bilinmeyen > denklem)} \implies \operatorname{rank}(A) \le m < n \implies A\mathbf x = \mathbf 0\text{ için sonsuz çözüm!}`,
            en: R`m < n \text{ (unknowns > equations)} \implies \operatorname{rank}(A) \le m < n \implies A\mathbf x = \mathbf 0\text{ has }\infty\text{ solutions!}`,
          },
        },
        {
          p: {
            tr: R`\(A\) bir \(n\times n\) <b>kare matris</b> olduğunda Bölüm 6 ile mükemmel bir köprü kurulur: aşağıdaki ifadelerin hepsi birbirine <b>birebir denktir</b>:`,
            en: R`When \(A\) is an \(n\times n\) <b>square matrix</b>, Chapter 6 and Chapter 7 snap together — all of the following statements are <b>100% equivalent</b>:`,
          },
        },
        {
          eq: {
            tr: R`\det(A) \ne 0 \iff A^{-1}\text{ var} \iff \operatorname{rank}(A) = n \iff \operatorname{RREF}(A) = I_n \iff A\mathbf x = \mathbf b\text{ her }\mathbf b\text{ için tek çözümlü}`,
            en: R`\det(A) \ne 0 \iff A^{-1}\text{ exists} \iff \operatorname{rank}(A) = n \iff \operatorname{RREF}(A) = I_n \iff A\mathbf x = \mathbf b\text{ has a unique solution for all }\mathbf b`,
          },
        },
        {
          callout: "warn",
          title: { tr: "m < n kuralını homojen olmayan sistemle karıştırmayın!", en: "Do NOT apply the m < n guarantee to Ax = b when b ≠ 0!" },
          text: {
            tr: R`Bilinmeyen sayısı denklem sayısından fazlaysa (\(m < n\)), <b>homojen</b> sistem \(A\mathbf x = \mathbf 0\) kesinlikle sonsuz çözümlüdür. Ama \(A\mathbf x = \mathbf b\) (\(\mathbf b \ne \mathbf 0\)) hâlâ <b>çözümsüz</b> olabilir! Örnek: \(x + y + z = 1\) ve \(x + y + z = 5\) (2 denklem, 3 bilinmeyen, ama açık çelişki!).`,
            en: R`When unknowns outnumber equations (\(m < n\)), a <b>homogeneous</b> system \(A\mathbf x = \mathbf 0\) ALWAYS has infinitely many solutions. However, a non-homogeneous system \(A\mathbf x = \mathbf b\) can still be <b>inconsistent</b>! Example: \(x + y + z = 1\) and \(x + y + z = 5\) (2 equations, 3 unknowns, impossible!).`,
          },
        },
        {
          links: [
            { tab: "theory", section: "ls-cases" },
            { tab: "theory", section: "ls-gauss" },
            { tab: "theory", section: "ls-rank" },
            { tab: "play" },
          ],
        },
      ],
    },
  ],

  practiceSections: PRACTICE,
});
