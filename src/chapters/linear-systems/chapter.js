import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { createRrefStepper, matrixInput } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "ls-intro",
    title: { tr: "Lineer Denklem Sistemleri ve Gauss Yok Etme", en: "Linear Systems & Gaussian Elimination" },
    paragraphs: [
      {
        tr: R`Bir lineer sistem \(A\mathbf x = \mathbf b\) her zaman yalnızca üç olasılıktan birine sahiptir: <b>tek çözüm</b>, <b>sonsuz çözüm</b> veya <b>çözüm yok</b>. [[rref|Gauss–Jordan yok etme]] yöntemi temel satır işlemleriyle genişletilmiş matrisi \([A\mid\mathbf b]\) indirgenmiş basamak formuna (RREF) getirerek sonucu kesinleştirir.`,
        en: R`Every linear system \(A\mathbf x = \mathbf b\) falls into exactly one of three cases: <b>unique solution</b>, <b>infinitely many solutions</b>, or <b>no solution</b>. [[rref|Gaussian elimination]] reduces \([A\mid\mathbf b]\) to RREF to reveal the exact structure.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> her satır işlemini adım adım izleyecek, [[rank|rank]] karşılaştırmasıyla Rouché–Capelli teoremini uygulayacak ve genel çözümü \(\mathbf x = \mathbf x_p + \mathbf x_h\) biçiminde okuyabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will step through elementary row operations, apply Rouché–Capelli via [[rank|rank]], and decompose solutions as \(\mathbf x = \mathbf x_p + \mathbf x_h\).`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 8 · Lineer Denklem Sistemleri", en: "Lecture 8 · Linear Systems" }],
      [{ tr: "Rouché–Capelli", en: "Rouché–Capelli" }, { tr: R`Tutarlı \(\iff \operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b])\)`, en: R`Consistent \(\iff \operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf b])\)` }],
      [{ tr: "Serbest değişken", en: "Free variables" }, { tr: R`\(n - \operatorname{rank}(A)\) adet serbest parametre`, en: R`\(n - \operatorname{rank}(A)\) free parameters` }],
    ],
  },
  sections: [
    {
      id: "ls-cases",
      mathId: "m-ls-rc",
      title: { tr: "Üç Olasılık: Tek, Sonsuz veya Çözümsüz", en: "Three Cases: Unique, Infinite, or Inconsistent" },
      body: [
        {
          tr: R`İki bilinmeyenli sistemde her denklem bir doğrudur: doğrular kesişiyorsa tek çözüm, paralel ve ayrıysa çözüm yok (\(0 = c \ne 0\) çelişkisi!), üst üste çakışıksa sonsuz çözüm vardır.`,
          en: R`In two variables, each equation is a line: intersecting means a unique solution, parallel & distinct means inconsistent (row \([0\ 0\mid c\ne 0]\)), coincident means infinitely many solutions.`,
        },
        { eq: R`\operatorname{rank}(A) < \operatorname{rank}([A\mid\mathbf b]) \implies \text{Çözüm yok } (\emptyset)` },
        {
          tr: R`<b>Deneyin:</b> İkinci denklemin sağ tarafı \(b_2\)'yi ve eğimini değiştirin; üç rejimin hem grafikte hem RREF'te nasıl göründüğünü karşılaştırın.`,
          en: R`<b>Try it:</b> switch between the three regimes and watch both the geometry and the RREF pivot structure change simultaneously.`,
        },
      ],
      demo(box, state) {
        const s = (state.cases ??= { mode: "unique" });
        const modes = {
          unique: { label: { tr: "Tek çözüm", en: "Unique" }, lines: [[1, 1, -3], [1, -1, -1]], pt: [2, 1], rref: "1 & 0 & 2 \\\\ 0 & 1 & 1" },
          none: { label: { tr: "Çözüm yok", en: "No solution" }, lines: [[1, -1, -1], [1, -1, 2]], pt: null, rref: "1 & -1 & 0 \\\\ 0 & 0 & 1" },
          inf: { label: { tr: "Sonsuz çözüm", en: "Infinite" }, lines: [[1, -1, -1], [2, -2, -2]], pt: null, rref: "1 & -1 & 1 \\\\ 0 & 0 & 0" },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 250 });

        const draw = () => {
          const m = modes[s.mode];
          plot.draw({
            x: [-3, 5], y: [-3, 5], equalAspect: true, xLabel: "x₁", yLabel: "x₂",
            lines: [
              { a: m.lines[0][0], b: m.lines[0][1], c: m.lines[0][2], color: COLORS.c1, width: 2.6 },
              { a: m.lines[1][0], b: m.lines[1][1], c: m.lines[1][2], color: COLORS.c2, width: s.mode === "inf" ? 2.4 : 2.6, dash: s.mode === "inf" ? [7, 5] : [] },
            ],
            points: m.pt ? [{ x: m.pt[0], y: m.pt[1], color: COLORS.c3, r: 6.5, ring: true, label: "(2, 1)" }] : [],
          });
          calc.textContent = `\\(\\operatorname{RREF}([A\\mid\\mathbf b]) = \\begin{bmatrix} ${m.rref} \\end{bmatrix}\\)`;
        };
        ctl.append(segmented(Object.entries(modes).map(([k, v]) => [k, v.label]), s.mode, (v) => { s.mode = v; draw(); }));
        draw();
      },
    },
    {
      id: "ls-gauss",
      mathId: "m-ls-rref",
      title: { tr: "Adım Adım Gauss–Jordan Yok Etme", en: "Step-by-Step Gaussian Elimination" },
      body: [
        {
          tr: R`Üç temel satır işlemi çözüm kümesini <b>asla değiştirmez</b>: (1) İki satırı yer değiştir, (2) Bir satırı sıfırdan farklı skalerle çarp, (3) Bir satıra başka bir satırın katını ekle.`,
          en: R`Three elementary row operations <b>never alter the solution set</b>: (1) swap two rows, (2) scale a row by a nonzero scalar, (3) add a multiple of one row to another.`,
        },
        {
          tr: R`<b>Deneyin:</b> Sağdaki sistemde <b>Sonraki adım →</b> düğmesine basarak pivotların (mavi) nasıl seçildiğini ve altındaki/üstündeki girişlerin nasıl sıfırlandığını adım adım izleyin!`,
          en: R`<b>Try it:</b> click <b>Next step →</b> to watch pivots (highlighted blue) form and eliminate entries below and above them!`,
        },
      ],
      demo(box, state) {
        const s = (state.gauss ??= { preset: "unique" });
        const presets = {
          unique: { label: { tr: "3×3 Tek çözüm", en: "3×3 Unique" }, M: [[1, 2, -1, 3], [2, 1, 1, 4], [-1, 1, 2, 1]] },
          inf: { label: { tr: "Serbest değişkenli", en: "Free variable" }, M: [[1, 1, 1, 4], [2, 2, 3, 9], [1, 1, 2, 5]] },
          none: { label: { tr: "Tutarsız (0=1)", en: "Inconsistent" }, M: [[1, 2, 1, 2], [2, 4, 2, 5], [0, 1, -1, 1]] },
        };
        const ctl = h("div", { class: "t-controls" });
        const stepHost = h("div");
        box.append(ctl, stepHost);
        const stepper = createRrefStepper(stepHost, presets[s.preset].M, 3);
        ctl.append(
          segmented(Object.entries(presets).map(([k, v]) => [k, v.label]), s.preset, (k) => {
            s.preset = k;
            stepper.update(presets[k].M, 3);
          }),
        );
      },
    },
  ],
  playground: {
    title: { tr: "Etkileşimli 3×3 Lineer Sistem Çözücü (Gauss–Jordan)", en: "Interactive 3×3 Linear System Solver (RREF)" },
    sub: {
      tr: R`Genişletilmiş matris \([A \mid \mathbf b]\) girişlerini kendiniz düzenleyin; her satır işlemini oynatın ve rank / çözüm sınıflandırmasını anında görün.`,
      en: R`Edit the augmented matrix \([A\mid\mathbf b]\) directly, step through Gaussian elimination, and read the rank and solution classification live.`,
    },
    build(host, state) {
      const s = (state.pg ??= { M: [[1, 1, 1, 6], [0, 2, 5, -4], [2, 5, -1, 27]] });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const editWrap = h("div", { class: "mx-row-wrap" });
      const tiles = h("div", { class: "pg-tiles" });
      const msg = h("p", { class: "pc-msg" });
      stage.append(h("div", { class: "mini-title", text: "[A | b]" }), editWrap, tiles, msg);

      const stepper = createRrefStepper(side, s.M, 3);
      const sync = () => {
        const res = stepper.update(s.M, 3);
        const free = 3 - res.rankA;
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "rank(A)" }), h("span", { class: "pg-tile-value", text: String(res.rankA) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "rank([A|b])" }), h("span", { class: "pg-tile-value", text: String(res.rankAug) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Serbest", en: "Free vars" }) }), h("span", { class: "pg-tile-value", text: res.rankAug > res.rankA ? "—" : String(free) })),
        );
        if (res.rankAug > res.rankA) {
          msg.className = "pc-msg bad";
          msg.textContent = L({ tr: "rank(A) < rank([A|b]): sistem tutarsız, çözüm kümesi boş!", en: "rank(A) < rank([A|b]): inconsistent system, no solution!" });
        } else if (free === 0) {
          msg.className = "pc-msg good";
          msg.textContent = L({
            tr: `Tek çözüm: x = (${ns(res.matrix[0][3], 2)}, ${ns(res.matrix[1][3], 2)}, ${ns(res.matrix[2][3], 2)})`,
            en: `Unique solution: x = (${ns(res.matrix[0][3], 2)}, ${ns(res.matrix[1][3], 2)}, ${ns(res.matrix[2][3], 2)})`,
          });
        } else {
          msg.className = "pc-msg info";
          msg.textContent = L({
            tr: `Tutarlı ve ${free} serbest değişkenli: sonsuz çözüm!`,
            en: `Consistent with ${free} free variable(s): infinitely many solutions!`,
          });
        }
      };
      editWrap.append(matrixInput(s.M, sync, { augCol: 3 }));
      sync();
    },
  },
  mathSections: [
    {
      id: "m-ls-rref",
      title: { tr: "İndirgenmiş Satır Basamak Formu (RREF) Kuralları", en: "Reduced Row Echelon Form (RREF) Conditions" },
      blocks: [
        {
          list: [
            { tr: R`Sıfır olmayan her satırın ilk sıfırdan farklı elemanı (<b>pivot</b>) 1'dir.`, en: R`The leading nonzero entry (<b>pivot</b>) of every nonzero row is 1.` },
            { tr: R`Her pivot, bir üst satırdaki pivottan kesinlikle daha sağdadır.`, en: R`Each pivot lies strictly to the right of the pivot above it.` },
            { tr: R`Bir pivotun bulunduğu sütundaki diğer tüm girişler 0'dır.`, en: R`Every other entry in a pivot column is 0.` },
            { tr: R`Tamamen sıfır olan satırlar en altta yer alır.`, en: R`All-zero rows sit at the bottom.` },
          ],
          ordered: true,
        },
      ],
    },
    {
      id: "m-ls-rc",
      title: { tr: "Çözüm Yapısı x = xₚ + xₕ İspatı", en: "Proof of General Solution Structure x = xₚ + xₕ" },
      blocks: [
        { eq: R`\mathbf x = \mathbf x_p + \mathbf x_h, \qquad A\mathbf x_p = \mathbf b,\quad A\mathbf x_h = \mathbf 0` },
        {
          derive: {
            title: { tr: "Homojen olmayan sistemin tüm çözümleri", en: "Characterization of all solutions to Ax = b" },
            steps: [
              { tex: R`A\mathbf x_p = \mathbf b \quad \text{ve} \quad A\mathbf x = \mathbf b`, why: { tr: "xₚ sabit bir özel çözüm, x herhangi bir başka çözüm olsun.", en: "Let xₚ be one particular solution and x any other solution." } },
              { tex: R`A(\mathbf x - \mathbf x_p) = A\mathbf x - A\mathbf x_p = \mathbf b - \mathbf b = \mathbf 0`, why: { tr: "Doğrusallık gereği fark vektörü xₕ = x − xₚ homojen denklemi sağlar.", en: "By linearity, xₕ = x − xₚ solves the homogeneous system Axₕ = 0." } },
              { tex: R`\mathbf x = \mathbf x_p + \mathbf x_h,\quad \mathbf x_h \in \ker(A)`, why: { tr: "Dolayısıyla çözüm kümesi, çekirdek alt uzayı ker(A)'nın xₚ kadar ötelenmesidir.", en: "Thus the solution set is the kernel ker(A) translated by xₚ." } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
