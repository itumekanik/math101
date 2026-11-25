import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { det2, matMul, matTranspose, matVec } from "../../engines/math-core.ts";
import { matToTex, matrixInput } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

const matsEqual = (X, Y, eps = 1e-6) =>
  X.length === Y.length &&
  X[0].length === Y[0].length &&
  X.every((row, i) => row.every((v, j) => Math.abs(v - Y[i][j]) < eps));

const matAdd = (X, Y) => X.map((row, i) => row.map((v, j) => v + Y[i][j]));
const matScale = (X, c) => X.map((row) => row.map((v) => v * c));

mountChapter({
  intro: {
    id: "mx-intro",
    title: {
      tr: "Matrisler ve Vektörler: Doğrusal Dönüşümlerin Dili",
      en: "Matrices & Vectors: The Language of Linear Maps",
    },
    paragraphs: [
      {
        tr: R`Bir [[matrix|matris]] ilk bakışta yalnızca parantez içine dizilmiş bir sayı tablosu gibi görünür: \(m\) yatay <b>satır</b> ve \(n\) dikey <b>sütun</b> varsa bu tabloya "\(m \times n\) boyutlu matris" deriz. İçindeki \(a_{ij}\) sayısı ise basitçe "\(i\). satır, \(j\). sütundaki sayı" diye okunur.`,
        en: R`At first glance, a [[matrix|matrix]] looks like a neat grid of numbers: with \(m\) horizontal <b>rows</b> and \(n\) vertical <b>columns</b>, we call it an "\(m \times n\) matrix." The entry \(a_{ij}\) is simply read aloud as "the number in row \(i\), column \(j\)."`,
      },
      {
        tr: R`Ama matrislerin asıl büyüsü geometridir: \(\mathbf x \mapsto A\mathbf x\) çarpımı, uzayı orijin sabit kalacak biçimde döndüren, esneten, kaydıran veya bir doğruya ezen bir [[linear-map|doğrusal dönüşüm]] makinesidir. <b>Bu bölümün sonunda</b> \(A\mathbf x\)'i sütunların bir tarifi olarak okuyacak, matris çarpımı \(AB\)'nin neden dönüşüm bileşkesi olduğunu (ve neden \(AB \ne BA\) çıktığını) görecek ve [[transpose|transpoz]] kurallarını rahatça kullanabileceksiniz.`,
        en: R`Yet the true magic of matrices is geometric: \(\mathbf x \mapsto A\mathbf x\) is a [[linear-map|linear transformation]] machine that rotates, stretches, shears, or flattens space while keeping the origin pinned down. <b>By the end of this chapter</b> you will read \(A\mathbf x\) as a recipe of columns, see why \(AB\) chains two maps (and why \(AB \ne BA\)), and master [[transpose|transpose]] rules.`,
      },
    ],
    analogy: {
      title: {
        tr: "Yemek Tarifi Tablosu ve Esnek Çarşaf Makinesi",
        en: "A Recipe Table & An Elastic Rubber-Sheet Machine",
      },
      text: {
        tr: R`Bir matrisi iki günlük görüntüyle düşünebilirsiniz. <b>1) Tarif tablosu:</b> her sütun bir malzeme (örneğin temel bir hareket yönü), \(\mathbf x\) vektöründeki sayılar ise o sütundan kaçar ölçek karıştırdığınızdır. <b>2) Esnek ızgara çarşafı:</b> kareli kâğıdı esnek bir lastik çarşafa çizdiğinizi ve orijini \((0,0)\) raptiyeyle sabitlediğinizi hayal edin. Çarşafı düzgünce çektiğinizde, döndürdüğünüzde veya yana kaydırdığınızda \((1,0)\) ve \((0,1)\) oklarının yeni adreslerini sütunlara yazmanız tüm çarşafın yeni hâlini eksiksiz tarif eder!`,
        en: R`Picture a matrix in two everyday ways. <b>1) A recipe table:</b> each column is an ingredient (a basic direction), and the numbers in \(\mathbf x\) tell you how many scoops of each column to mix. <b>2) An elastic coordinate sheet:</b> imagine drawing a square grid on a rubber sheet and pinning the origin \((0,0)\) with a thumbtack. When you smoothly rotate, stretch, or shear the sheet, simply recording the new landing spots of \((1,0)\) and \((0,1)\) as the matrix's columns completely describes where EVERY point on the sheet moves!`,
      },
    },
    summary: [
      [
        { tr: "Ders", en: "Lecture" },
        { tr: "Ders 6 · Matrisler ve Vektörler", en: "Lecture 6 · Matrices and Vectors" },
      ],
      [
        { tr: "Altın bakış açısı", en: "Golden insight" },
        {
          tr: R`\(A\mathbf x = x_1 \mathbf a_1 + x_2 \mathbf a_2 + \dots + x_n \mathbf a_n\)`,
          en: R`\(A\mathbf x = x_1 \mathbf a_1 + x_2 \mathbf a_2 + \dots + x_n \mathbf a_n\)`,
        },
      ],
      [
        { tr: "Boyut kuralı", en: "Dimension rule" },
        {
          tr: R`\((m\times p)\cdot(p\times n) \to (m\times n)\)`,
          en: R`\((m\times p)\cdot(p\times n) \to (m\times n)\)`,
        },
      ],
      [
        { tr: "İki büyük tuzak", en: "Two big traps" },
        {
          tr: R`\(AB \ne BA\) ve \((AB)^T = B^T A^T\)`,
          en: R`\(AB \ne BA\) and \((AB)^T = B^T A^T\)`,
        },
      ],
    ],
    tip: {
      title: { tr: "Başlamadan önce küçük ipucu", en: "Quick beginner mnemonic" },
      text: {
        tr: R`Matris boyutunu ve indisleri okurken sırayı hiç karıştırmayın: <b>önce Satır, sonra Sütun!</b> Yani \(2\times 3\) demek "2 yatay satır, 3 dikey sütun" demektir; \(a_{23}\) ise "2. satır, 3. sütundaki sayı" olarak okunur.`,
        en: R`Never mix up dimensions or indices: always <b>Row first, Column second (R×C)</b>! So a \(2\times 3\) matrix has 2 horizontal rows and 3 vertical columns, and \(a_{23}\) is read "row 2, column 3."`,
      },
    },
  },

  sections: [
    {
      id: "mx-transform",
      mathId: "m-mx-linear",
      title: {
        tr: "Matris Nedir? ve Ax = Sütunların Doğrusal Bileşimi",
        en: "What Is a Matrix? & Ax as a Linear Combination of Columns",
      },
      body: [
        {
          tr: R`Bir \(m\times n\) matrisi \(A\) ile \(n\) bileşenli bir sütun [[vector|vektörü]] \(\mathbf x\)'i çarptığımızda \(A\mathbf x\) (okunuşu: "\(A\) çarpı \(\mathbf x\)") elde ederiz. Bunu hesaplamanın ve anlamanın iki eşdeğer yolu vardır: <b>Satır gözüyle</b> her çıktı sayısı, \(A\)'nın ilgili satırıyla \(\mathbf x\)'in [[dot-product|nokta çarpımıdır]]. <b>Sütun gözüyle</b> ise çok daha derin bir anlam görürüz: \(A\mathbf x\), \(A\)'nın sütunlarının \(\mathbf x\)'teki ağırlıklarla alınmış [[linear-combination|doğrusal bileşimidir]]!`,
          en: R`Multiplying an \(m\times n\) matrix \(A\) by an \(n\)-entry column [[vector|vector]] \(\mathbf x\) produces \(A\mathbf x\) (read aloud: "\(A\) times \(\mathbf x\)"). There are two equivalent ways to view it. By the <b>row view</b> (fast arithmetic), each output entry is the [[dot-product|dot product]] of a row of \(A\) with \(\mathbf x\). By the <b>column view</b> (deep intuition), \(A\mathbf x\) is a [[linear-combination|linear combination]] of the columns of \(A\), weighted by the entries of \(\mathbf x\)!`,
        },
        {
          analogy: {
            title: { tr: "Pusula adımlarını yeniden tanımlamak", en: "Redefining your walking steps" },
            text: {
              tr: R`Normalde \(\mathbf x = (3, 2)\) demek, standart pusulanızla "3 adım doğuya (\(\mathbf e_1\)), 2 adım kuzeye (\(\mathbf e_2\)) yürü" demektir. Bir \(A = [\mathbf a_1\ \mathbf a_2]\) matrisi pusulanızı değiştirir: artık "doğu adımı" 1. sütun \(\mathbf a_1\), "kuzey adımı" 2. sütun \(\mathbf a_2\) olur. Dolayısıyla \(A\mathbf x = 3\mathbf a_1 + 2\mathbf a_2\), yeni adımlarla 3 kez \(\mathbf a_1\) ve 2 kez \(\mathbf a_2\) yürüdüğünüzde vardığınız yerdir!`,
              en: R`Normally \(\mathbf x = (3, 2)\) means "walk 3 steps east (\(\mathbf e_1\)) and 2 steps north (\(\mathbf e_2\))." A matrix \(A = [\mathbf a_1\ \mathbf a_2]\) replaces your compass steps with its columns: "east" becomes column 1 (\(\mathbf a_1\)) and "north" becomes column 2 (\(\mathbf a_2\)). So \(A\mathbf x = 3\mathbf a_1 + 2\mathbf a_2\) is simply where you arrive after taking 3 steps along \(\mathbf a_1\) and 2 steps along \(\mathbf a_2\)!`,
            },
          },
        },
        {
          eq: R`A\begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}\begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = x_1\begin{bmatrix} a_{11} \\ a_{21} \end{bmatrix} + x_2\begin{bmatrix} a_{12} \\ a_{22} \end{bmatrix}`,
        },
        {
          tr: R`Özel olarak \(\mathbf e_1 = (1,0)\) verirseniz \(A\mathbf e_1 = 1\cdot\mathbf a_1 + 0\cdot\mathbf a_2 = \mathbf a_1\) (1. sütun!), \(\mathbf e_2 = (0,1)\) verirseniz \(A\mathbf e_2 = \mathbf a_2\) (2. sütun!) çıkar. Yani bir matrisin sütunları, standart birim okların nereye konduğunu tek bakışta söyler.`,
          en: R`In particular, plugging in \(\mathbf e_1 = (1,0)\) gives \(A\mathbf e_1 = \mathbf a_1\) (column 1!), and \(\mathbf e_2 = (0,1)\) gives \(A\mathbf e_2 = \mathbf a_2\) (column 2!). Every grid line stays straight, parallel, and evenly spaced, and the origin \((0,0)\) never moves.`,
        },
        {
          example: {
            title: { tr: "Ax çarpımını iki gözle hesaplama", en: "Computing Ax using both views" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 2 & -1 \\ 1 & 3 \end{bmatrix}\) ve \(\mathbf x = \begin{bmatrix} 3 \\ 2 \end{bmatrix}\) için \(A\mathbf x\) vektörünü hem sütun hem satır gözüyle hesaplayın.`,
              en: R`Compute \(A\mathbf x\) for \(A = \begin{bmatrix} 2 & -1 \\ 1 & 3 \end{bmatrix}\) and \(\mathbf x = \begin{bmatrix} 3 \\ 2 \end{bmatrix}\) using both the column view and the row view.`,
            },
            steps: [
              {
                expr: R`\mathbf a_1 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}, \qquad \mathbf a_2 = \begin{bmatrix} -1 \\ 3 \end{bmatrix}`,
                note: {
                  tr: R`Önce \(A\)'nın iki sütununu okuyoruz.`,
                  en: R`First read off the two columns of \(A\).`,
                },
              },
              {
                expr: R`A\mathbf x = 3\begin{bmatrix} 2 \\ 1 \end{bmatrix} + 2\begin{bmatrix} -1 \\ 3 \end{bmatrix} = \begin{bmatrix} 6 \\ 3 \end{bmatrix} + \begin{bmatrix} -2 \\ 6 \end{bmatrix} = \begin{bmatrix} 4 \\ 9 \end{bmatrix}`,
                note: {
                  tr: R`<b>Sütun gözüyle:</b> 1. sütundan 3 ölçek, 2. sütundan 2 ölçek alıp topladık.`,
                  en: R`<b>Column view:</b> mix 3 copies of column 1 with 2 copies of column 2.`,
                },
              },
              {
                expr: R`(A\mathbf x)_1 = 2\cdot 3 + (-1)\cdot 2 = 4, \qquad (A\mathbf x)_2 = 1\cdot 3 + 3\cdot 2 = 9`,
                note: {
                  tr: R`<b>Satır gözüyle kontrol:</b> her satırın \(\mathbf x\) ile nokta çarpımı birebir aynı \((4, 9)\) sonucunu verir!`,
                  en: R`<b>Row view check:</b> taking the dot product of each row with \(\mathbf x\) confirms the exact same answer \((4, 9)\)!`,
                },
              },
            ],
            answer: {
              tr: R`\(A\mathbf x = \begin{bmatrix} 4 \\ 9 \end{bmatrix}\)`,
              en: R`\(A\mathbf x = \begin{bmatrix} 4 \\ 9 \end{bmatrix}\)`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: Boyut uyumsuzluğu ve satır–sütun karıştırma", en: "Common mistake: Dimension mismatch & swapping indices" },
            text: {
              tr: R`\(A\mathbf x\) çarpımının tanımlı olması için <b>\(A\)'nın sütun sayısı, \(\mathbf x\)'in bileşen sayısına eşit olmalıdır</b>. Örneğin \(3\times 2\) bir matris ancak \(2\)'li bir vektörle çarpılabilir ve sonuç \(3\)'lü bir vektör olur. Ayrıca \(a_{21}\) her zaman <b>2. satır, 1. sütundur</b> (1. satır, 2. sütun değil!).`,
              en: R`For \(A\mathbf x\) to exist, <b>the number of columns of \(A\) must equal the length of \(\mathbf x\)</b>. A \(3\times 2\) matrix can only eat a \(2\)-entry vector (producing a \(3\)-entry vector). Also, \(a_{21}\) always means <b>row 2, column 1</b> — never column 2, row 1!`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>Birim (I)</b>, <b>Dönme 45°</b>, <b>Kaydırma</b> ve <b>Yansıma</b> düğmelerine tıklayıp kesikli birim karenin mavi paralelkenara nasıl dönüştüğünü izleyin.`,
              en: R`Click <b>Identity (I)</b>, <b>Rotate 45°</b>, <b>Shear</b>, and <b>Reflect</b> to watch the dashed unit square morph into the blue parallelogram.`,
            },
            {
              tr: R`\(x_1\) ve \(x_2\) sürgülerini oynatın: turuncu \(A\mathbf x\) okunun daima bükülmüş mavi ızgaradaki \((x_1, x_2)\) adresine gittiğini görün!`,
              en: R`Move the \(x_1\) and \(x_2\) sliders: notice the orange arrow \(A\mathbf x\) always lands at grid address \((x_1, x_2)\) on the warped blue grid!`,
            },
            {
              tr: R`<b>İzdüşüm</b> düğmesine basın (veya mavi ve yeşil uçları aynı doğruya sürükleyin): tüm 2B ızgaranın tek bir doğruya ezildiğini (\(\det(A) = 0\)) gözlemleyin!`,
              en: R`Click <b>Project</b> (or drag both column tips onto the same line): watch the entire 2D grid flatten onto a single 1D line (\(\det(A) = 0\))!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.tr ??= { a1: [1.5, 0.4], a2: [0.6, 1.3], x1: 1, x2: 1, preset: "custom" });
        const presets = {
          id: { label: { tr: "Birim (I)", en: "Identity (I)" }, a1: [1, 0], a2: [0, 1] },
          rot: { label: { tr: "Dönme 45°", en: "Rotate 45°" }, a1: [0.71, 0.71], a2: [-0.71, 0.71] },
          shear: { label: { tr: "Kaydırma", en: "Shear" }, a1: [1, 0], a2: [1.2, 1] },
          refl: { label: { tr: "Yansıma", en: "Reflect" }, a1: [0, 1], a2: [1, 0] },
          proj: { label: { tr: "İzdüşüm", en: "Project" }, a1: [1.2, 0.6], a2: [0.6, 0.3] },
        };
        const ctl = h("div", { class: "t-controls" });
        const sliders = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, sliders, host, calc, msg);

        const plot = createCanvas2D(host, {
          height: 295,
          interactive: true,
          hint: L({
            tr: "Mavi (Ae₁) ve yeşil (Ae₂) sütun uçlarını sürükleyin",
            en: "Drag blue (Ae₁) and green (Ae₂) column tips",
          }),
        });

        let seg = null;
        const draw = () => {
          const A = [
            [s.a1[0], s.a2[0]],
            [s.a1[1], s.a2[1]],
          ];
          const sum = [s.a1[0] + s.a2[0], s.a1[1] + s.a2[1]];
          const p1 = [s.x1 * s.a1[0], s.x1 * s.a1[1]];
          const ax = [s.x1 * s.a1[0] + s.x2 * s.a2[0], s.x1 * s.a1[1] + s.x2 * s.a2[1]];
          const d = det2(A);
          plot.draw({
            x: [-3.8, 4.2],
            y: [-3.2, 4.2],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            basisGrid: { b1: s.a1, b2: s.a2, color: COLORS.c1, range: 5 },
            polygons: [
              { pts: [[0, 0], [1, 0], [1, 1], [0, 1]], stroke: COLORS.muted, dash: [4, 3], width: 1.4 },
              {
                pts: [[0, 0], s.a1, sum, s.a2],
                fill: Math.abs(d) < 0.06 ? "rgba(208,59,59,0.22)" : "rgba(42,120,214,0.16)",
                stroke: Math.abs(d) < 0.06 ? COLORS.bad : COLORS.c1,
                width: 2,
              },
            ],
            segments: [
              { from: [0, 0], to: p1, color: COLORS.c1, dash: [4, 3], width: 1.6 },
              { from: p1, to: ax, color: COLORS.c3, dash: [4, 3], width: 1.6 },
            ],
            vectors: [
              { to: s.a1, color: COLORS.c1, label: "a₁" },
              { to: s.a2, color: COLORS.c3, label: "a₂" },
              { to: ax, color: COLORS.c2, width: 2.8, label: "Ax" },
            ],
            handles: [
              {
                id: "a1",
                x: s.a1[0],
                y: s.a1[1],
                color: COLORS.c1,
                onDrag: (x, y) => {
                  s.a1 = [x, y];
                  s.preset = "custom";
                  seg?.set("custom");
                  draw();
                },
              },
              {
                id: "a2",
                x: s.a2[0],
                y: s.a2[1],
                color: COLORS.c3,
                onDrag: (x, y) => {
                  s.a2 = [x, y];
                  s.preset = "custom";
                  seg?.set("custom");
                  draw();
                },
              },
            ],
          });
          calc.textContent = `\\(A = ${matToTex(A)},\\quad A\\begin{bmatrix}${tx(s.x1, 1)}\\\\${tx(s.x2, 1)}\\end{bmatrix} = \\begin{bmatrix}${tx(ax[0], 2)}\\\\${tx(ax[1], 2)}\\end{bmatrix},\\quad \\det(A) = ${tx(d, 2)}\\)`;
          if (Math.abs(d) < 0.06) {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "İki sütun aynı doğrultuda (det ≈ 0): tüm 2B düzlem tek bir doğruya ezildi!",
              en: "Both columns lie on one line (det ≈ 0): the entire 2D plane squashed onto a 1D line!",
            });
          } else {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Ax = ${ns(s.x1, 1)}·a₁ + ${ns(s.x2, 1)}·a₂ = (${ns(ax[0], 2)}, ${ns(ax[1], 2)}). Sütunlar tüm düzlemi geriyor.`,
              en: `Ax = ${ns(s.x1, 1)}·a₁ + ${ns(s.x2, 1)}·a₂ = (${ns(ax[0], 2)}, ${ns(ax[1], 2)}). Columns span the full 2D plane.`,
            });
          }
        };

        seg = segmented(
          Object.entries(presets).map(([k, v]) => [k, v.label]),
          s.preset,
          (k) => {
            s.preset = k;
            s.a1 = [...presets[k].a1];
            s.a2 = [...presets[k].a2];
            draw();
          },
        );
        ctl.append(seg);
        sliders.append(
          slider("x₁", {
            min: -2,
            max: 2,
            step: 0.5,
            value: s.x1,
            fmt: (v) => ns(v, 1),
            onInput: (v) => {
              s.x1 = v;
              draw();
            },
          }),
          slider("x₂", {
            min: -2,
            max: 2,
            step: 0.5,
            value: s.x2,
            fmt: (v) => ns(v, 1),
            onInput: (v) => {
              s.x2 = v;
              draw();
            },
          }),
        );
        draw();
      },
    },

    {
      id: "mx-comp",
      mathId: "m-mx-prod",
      title: {
        tr: "Matris Çarpımı AB: Dönüşümleri Zincirlemek ve Neden AB ≠ BA?",
        en: "Matrix Multiplication AB: Chaining Maps & Why AB ≠ BA",
      },
      body: [
        {
          tr: R`İki dönüşümü arka arkaya uygulamak istediğimizde ne olur? Bir \(\mathbf x\) vektörüne önce \(B\) makinesini uygulayıp \(B\mathbf x\)'i bulur, ardından bu çıktıyı \(A\) makinesine verip \(A(B\mathbf x)\)'i elde ederiz. İşte \(AB\) matrisi, bu iki adımlı [[composition|bileşke]] işlemi <b>tek bir matriste</b> toplar: \((AB)\mathbf x = A(B\mathbf x)\). Dikkat: işlemler <b>sağdan sola</b> okunur (önce \(B\), sonra \(A\))!`,
          en: R`What happens when you apply two transformations back-to-back? First feed \(\mathbf x\) into machine \(B\) to get \(B\mathbf x\), then feed that output into machine \(A\) to get \(A(B\mathbf x)\). The product matrix \(AB\) packages this two-step [[composition|composition]] into <b>one single matrix</b>: \((AB)\mathbf x = A(B\mathbf x)\). Notice the order reads <b>right-to-left</b> (apply \(B\) first, then \(A\))!`,
        },
        {
          analogy: {
            title: { tr: "Çorap ve ayakkabı sırası", en: "Socks first, then shoes" },
            text: {
              tr: R`Sabah önce çorap (\(B\)), sonra ayakkabı (\(A\)) giymekle, önce ayakkabı sonra çorap giymek (\(BA\)) bambaşka sonuç verir! Matrislerde de aynısı olur: bir şekli önce \(90^\circ\) döndürüp sonra yatay kaydırmak, önce kaydırıp sonra döndürmekten <b>farklı</b> bir konuma götürür. Bu yüzden matris çarpımı genel olarak <b>değişmeli değildir</b> (\(AB \ne BA\)).`,
              en: R`Putting on socks (\(B\)) and then shoes (\(A\)) works great; swapping the order to shoes first then socks over them (\(BA\)) gives a completely different result! The same happens with matrices: rotating a shape by \(90^\circ\) and then shearing it lands somewhere <b>different</b> from shearing first and rotating second. That is why matrix multiplication is generally <b>not commutative</b> (\(AB \ne BA\)).`,
            },
          },
        },
        {
          eq: R`(AB)_{ij} = \sum_{k=1}^{p} A_{ik} B_{kj} \qquad (m\times p)\cdot(p\times n) \longrightarrow (m\times n)`,
        },
        {
          tr: R`Bu toplam simgesi \(\sum_{k=1}^{p}\) (okunuşu: "\(k\) birden \(p\)'ye toplam") hiç gözünüzü korkutmasın! \((AB)_{ij}\) kutusunu doldurmak için <b>\(A\)'nın \(i\). satırı ile \(B\)'nin \(j\). sütununu</b> eşleştirip çarpar ve toplarsınız. Çarpımın yapılabilmesi için iç boyutlar (ilk matrisin sütun sayısı ile ikincinin satır sayısı) birbirine eşit olmalıdır.`,
          en: R`Do not let the sigma symbol \(\sum_{k=1}^{p}\) ("sum as \(k\) goes from \(1\) to \(p\)") intimidate you! To fill entry \((AB)_{ij}\), simply pair <b>row \(i\) of \(A\) with column \(j\) of \(B\)</b>, multiply matching positions, and add them up. For \(AB\) to exist, the inner dimensions (columns of \(A\) and rows of \(B\)) must match.`,
        },
        {
          example: {
            title: { tr: "AB ve BA çarpımlarını hesaplayıp karşılaştırma", en: "Computing both AB and BA side by side" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}\) (kaydırma) ve \(B = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}\) (\(90^\circ\) dönme) için \(AB\) ve \(BA\) matrislerini bulun.`,
              en: R`Compute both \(AB\) and \(BA\) for \(A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}\) (shear) and \(B = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}\) (\(90^\circ\) rotation).`,
            },
            steps: [
              {
                expr: R`(AB)_{11} = 1\cdot 0 + 2\cdot 1 = 2, \quad (AB)_{12} = 1(-1) + 2\cdot 0 = -1`,
                note: {
                  tr: R`\(AB\)'nin 1. satırı: \(A\)'nın 1. satırını \([1, 2]\), \(B\)'nin 1. ve 2. sütunlarıyla nokta çarpıyoruz.`,
                  en: R`Row 1 of \(AB\): dot row 1 of \(A\) (\([1, 2]\)) with columns 1 and 2 of \(B\).`,
                },
              },
              {
                expr: R`(AB)_{21} = 0\cdot 0 + 1\cdot 1 = 1, \quad (AB)_{22} = 0(-1) + 1\cdot 0 = 0 \implies AB = \begin{bmatrix} 2 & -1 \\ 1 & 0 \end{bmatrix}`,
                note: {
                  tr: R`\(AB\)'nin 2. satırı: \(A\)'nın 2. satırı \([0, 1]\) ile aynı işlemi tekrarlıyoruz.`,
                  en: R`Row 2 of \(AB\): repeat with row 2 of \(A\) (\([0, 1]\)).`,
                },
              },
              {
                expr: R`BA = \begin{bmatrix} 0\cdot 1 + (-1)\cdot 0 & 0\cdot 2 + (-1)\cdot 1 \\ 1\cdot 1 + 0\cdot 0 & 1\cdot 2 + 0\cdot 1 \end{bmatrix} = \begin{bmatrix} 0 & -1 \\ 1 & 2 \end{bmatrix}`,
                note: {
                  tr: R`Şimdi sırayı çevirip \(B\)'nin satırlarını \(A\)'nın sütunlarıyla çarpıyoruz. Köşegen girişleri bile farklı çıktı!`,
                  en: R`Now reverse the order: dot rows of \(B\) with columns of \(A\). Even the diagonal entries changed!`,
                },
              },
            ],
            answer: {
              tr: R`\(AB = \begin{bmatrix} 2 & -1 \\ 1 & 0 \end{bmatrix} \ne \begin{bmatrix} 0 & -1 \\ 1 & 2 \end{bmatrix} = BA\)`,
              en: R`\(AB = \begin{bmatrix} 2 & -1 \\ 1 & 0 \end{bmatrix} \ne \begin{bmatrix} 0 & -1 \\ 1 & 2 \end{bmatrix} = BA\)`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: Eleman eleman çarpmak ve (A+B)² tuzağı", en: "Common mistake: Entrywise products & the (A+B)² trap" },
            text: {
              tr: R`Matris çarpımı kesinlikle karşılıklı kutuları çarpmak <b>değildir</b>: \((AB)_{ij} \ne A_{ij} B_{ij}\). Ayrıca \(AB \ne BA\) olduğundan lise cebirindeki özdeşlikler değişir: \((A + B)^2 = A^2 + AB + BA + B^2\) olur (ancak \(AB = BA\) ise \(A^2 + 2AB + B^2\) yazabilirsiniz!).`,
              en: R`Matrix multiplication is <b>NOT</b> multiplying matching boxes cell-by-cell: \((AB)_{ij} \ne A_{ij} B_{ij}\). Also, because \(AB \ne BA\), high-school algebra formulas change: \((A + B)^2 = A^2 + AB + BA + B^2\) — you can combine \(AB + BA\) into \(2AB\) ONLY if \(A\) and \(B\) commute!`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>Dönme + Kaydırma</b> seçiliyken <b>AB</b> ile <b>BA</b> arasında geçiş yapın; mor kesikli ara durağın (\(B\mathbf x\) veya \(A\mathbf x\)) iki yolu nasıl ayırdığını izleyin.`,
              en: R`With <b>Rot + Shear</b> selected, toggle between <b>AB</b> and <b>BA</b> and follow the dashed purple intermediate step (\(B\mathbf x\) vs \(A\mathbf x\)) to see the paths diverge.`,
            },
            {
              tr: R`<b>Dönme + Yansıma</b> senaryosunu seçip \(\theta\) açısını değiştirin: mavi \(AB\mathbf x\) ile turuncu \(BA\mathbf x\) okları bambaşka bölgelere düşer.`,
              en: R`Switch to <b>Rot + Reflect</b> and sweep the angle \(\theta\): the blue \(AB\mathbf x\) and orange \(BA\mathbf x\) arrows land in totally different quadrants.`,
            },
            {
              tr: R`<b>İki Dönme (AB = BA)</b> seçeneğine tıklayın: iki 2B dönmeyi hangi sırayla uygularsanız uygulayın oklar üst üste biner (\(\theta + 45^\circ = 45^\circ + \theta\))!`,
              en: R`Click <b>Two Rotations (AB = BA)</b>: two 2D rotations about the origin DO commute, so \(AB\mathbf x\) and \(BA\mathbf x\) snap onto the exact same arrow!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.comp ??= { pair: "rotShear", order: "AB", ang: 60 });
        const ctlPair = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctlPair, ctl, host, calc, msg);
        const plot = createCanvas2D(host, { height: 265 });

        const rotMat = (deg) => {
          const r = (deg * Math.PI) / 180;
          return [
            [Math.cos(r), -Math.sin(r)],
            [Math.sin(r), Math.cos(r)],
          ];
        };

        const draw = () => {
          const A = rotMat(s.ang);
          const B =
            s.pair === "rotShear"
              ? [[1, 0.8], [0, 1]]
              : s.pair === "rotRefl"
                ? [[1, 0], [0, -1]]
                : rotMat(45);
          const AB = matMul(A, B);
          const BA = matMul(B, A);
          const x = [1.5, 1];
          const mid = s.order === "AB" ? matVec(B, x) : matVec(A, x);
          const yAB = matVec(AB, x);
          const yBA = matVec(BA, x);
          const comm = matsEqual(AB, BA, 1e-4);

          plot.draw({
            x: [-3.5, 3.5],
            y: [-3.2, 3.5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            vectors: [
              { to: x, color: COLORS.muted, dash: [4, 3], width: 2, label: "x" },
              {
                to: mid,
                color: COLORS.c4,
                dash: [5, 4],
                width: 1.9,
                label: s.order === "AB" ? "Bx" : "Ax",
              },
              { to: yAB, color: COLORS.c1, width: s.order === "AB" ? 3.2 : 1.6, label: "ABx" },
              { to: yBA, color: COLORS.c2, width: s.order === "BA" ? 3.2 : 1.6, label: "BAx" },
            ],
          });

          const cmp = comm ? "=" : "\\ne";
          calc.textContent = `\\(AB = ${matToTex(AB)}\\; ${cmp} \\; BA = ${matToTex(BA)}\\)`;
          if (comm) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Özel durum: iki 2B dönme değişmelidir (AB = BA)! Toplam dönme açısı her iki sırada da ${s.ang + 45}° olur.`,
              en: `Special case: two 2D rotations commute (AB = BA)! Both orders rotate by ${s.ang + 45}°.`,
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: s.order === "AB"
                ? `ABx = (${ns(yAB[0], 2)}, ${ns(yAB[1], 2)}) (önce B, sonra A) ≠ BAx = (${ns(yBA[0], 2)}, ${ns(yBA[1], 2)}).`
                : `BAx = (${ns(yBA[0], 2)}, ${ns(yBA[1], 2)}) (önce A, sonra B) ≠ ABx = (${ns(yAB[0], 2)}, ${ns(yAB[1], 2)}).`,
              en: s.order === "AB"
                ? `ABx = (${ns(yAB[0], 2)}, ${ns(yAB[1], 2)}) (B then A) ≠ BAx = (${ns(yBA[0], 2)}, ${ns(yBA[1], 2)}).`
                : `BAx = (${ns(yBA[0], 2)}, ${ns(yBA[1], 2)}) (A then B) ≠ ABx = (${ns(yAB[0], 2)}, ${ns(yAB[1], 2)}).`,
            });
          }
        };

        ctlPair.append(
          segmented(
            [
              ["rotShear", { tr: "Dönme + Kaydırma", en: "Rot + Shear" }],
              ["rotRefl", { tr: "Dönme + Yansıma", en: "Rot + Reflect" }],
              ["twoRot", { tr: "İki Dönme (AB=BA)", en: "Two Rotations" }],
            ],
            s.pair,
            (v) => {
              s.pair = v;
              draw();
            },
          ),
        );
        ctl.append(
          segmented(
            [
              ["AB", { tr: "AB (önce B)", en: "AB (B first)" }],
              ["BA", { tr: "BA (önce A)", en: "BA (A first)" }],
            ],
            s.order,
            (v) => {
              s.order = v;
              draw();
            },
          ),
          slider("θ (°)", {
            min: 15,
            max: 150,
            step: 15,
            value: s.ang,
            fmt: (v) => `${v}°`,
            onInput: (v) => {
              s.ang = v;
              draw();
            },
          }),
        );
        draw();
      },
    },

    {
      id: "mx-transpose",
      mathId: "m-mx-trans",
      title: {
        tr: "Transpoz (Aᵀ), Simetrik Matrisler ve Ters Sıra Kuralı",
        en: "Transpose (Aᵀ), Symmetric Matrices & The Reversal Rule",
      },
      body: [
        {
          tr: R`Bir \(A\) matrisinin [[transpose|transpozu]] (devriği) \(A^T\) (okunuşu: "\(A\) transpoz"), matrisin <b>satırlarını sütun, sütunlarını satır</b> yaparak elde edilir: \((A^T)_{ij} = A_{ji}\). Eğer \(A\) boyutu \(m\times n\) ise \(A^T\) boyutu \(n\times m\) olur. İki kez transpoz alırsanız başa dönersiniz: \((A^T)^T = A\).`,
          en: R`The [[transpose|transpose]] of a matrix \(A\), written \(A^T\) (read aloud: "\(A\) transpose"), simply swaps its <b>rows and columns</b>: \((A^T)_{ij} = A_{ji}\). If \(A\) has size \(m\times n\), then \(A^T\) has size \(n\times m\). Transposing twice brings you right back: \((A^T)^T = A\).`,
        },
        {
          analogy: {
            title: { tr: "Bir Excel tablosunu yan yatırmak", en: "Flipping a spreadsheet across its diagonal" },
            text: {
              tr: R`Satırlarında öğrencilerin, sütunlarında ders notlarının durduğu bir tablo düşünün. Transpoz almak tabloyu sol üstten sağ alta uzanan ana köşegen boyunca ayna gibi çevirmektir: artık satırlar dersler, sütunlar öğrenciler olur. Hiçbir veri kaybolmaz! Eğer tablo iki şehir arasındaki mesafeleri gösteriyorsa (Ankara–İzmir = İzmir–Ankara), çevirdiğinizde tablo hiç değişmez — işte buna <b>simetrik matris</b> (\(A^T = A\)) denir!`,
              en: R`Imagine a spreadsheet where rows are students and columns are exams. Taking the transpose flips the sheet across its main diagonal so rows become exams and columns become students — no data is lost! If the table records distances between cities (Paris–Rome = Rome–Paris), flipping it changes nothing at all — that is a <b>symmetric matrix</b> (\(A^T = A\))!`,
            },
          },
        },
        {
          eq: R`(A^T)_{ij} = A_{ji}, \qquad (A + B)^T = A^T + B^T, \qquad (AB)^T = B^T A^T`,
        },
        {
          tr: R`Çarpımın transpozu neden sırayı ters çevirir? Boyutlara bakmak bile bunu kanıtlar: \(A\) boyutu \(2\times 3\) ve \(B\) boyutu \(3\times 4\) ise \(AB\) boyutu \(2\times 4\), dolayısıyla \((AB)^T\) boyutu \(4\times 2\) olur. \(A^T B^T\) çarpımı \((3\times 2)(4\times 3)\) tanımlı bile değildir; yalnızca \(B^T A^T\) çarpımı \((4\times 3)(3\times 2) \to 4\times 2\) uyuşur!`,
          en: R`Why does transposing a product reverse the order? Even checking dimensions proves it: if \(A\) is \(2\times 3\) and \(B\) is \(3\times 4\), then \(AB\) is \(2\times 4\), so \((AB)^T\) is \(4\times 2\). The unreversed product \(A^T B^T\) would be \((3\times 2)(4\times 3)\) — undefined! Only \(B^T A^T\) has matching sizes \((4\times 3)(3\times 2) \to 4\times 2\).`,
        },
        {
          example: {
            title: { tr: "(AB)ᵀ = Bᵀ Aᵀ kuralını sayılarla doğrulama", en: "Verifying (AB)ᵀ = Bᵀ Aᵀ with numbers" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 1 & 2 \\ 3 & 0 \end{bmatrix}\) ve \(B = \begin{bmatrix} 2 & -1 \\ 1 & 4 \end{bmatrix}\) için \((AB)^T\), \(B^T A^T\) ve yanlış sıra \(A^T B^T\) matrislerini karşılaştırın.`,
              en: R`For \(A = \begin{bmatrix} 1 & 2 \\ 3 & 0 \end{bmatrix}\) and \(B = \begin{bmatrix} 2 & -1 \\ 1 & 4 \end{bmatrix}\), compare \((AB)^T\), \(B^T A^T\), and the wrong order \(A^T B^T\).`,
            },
            steps: [
              {
                expr: R`AB = \begin{bmatrix} 1\cdot 2 + 2\cdot 1 & 1(-1) + 2\cdot 4 \\ 3\cdot 2 + 0\cdot 1 & 3(-1) + 0\cdot 4 \end{bmatrix} = \begin{bmatrix} 4 & 7 \\ 6 & -3 \end{bmatrix}`,
                note: {
                  tr: R`Önce \(AB\) çarpımını hesaplıyoruz.`,
                  en: R`First compute the product \(AB\).`,
                },
              },
              {
                expr: R`(AB)^T = \begin{bmatrix} 4 & 6 \\ 7 & -3 \end{bmatrix}`,
                note: {
                  tr: R`\(AB\)'nin satır ve sütunlarını yer değiştirip \((AB)^T\)'yi buluyoruz.`,
                  en: R`Swap rows and columns of \(AB\) to get \((AB)^T\).`,
                },
              },
              {
                expr: R`B^T A^T = \begin{bmatrix} 2 & 1 \\ -1 & 4 \end{bmatrix}\begin{bmatrix} 1 & 3 \\ 2 & 0 \end{bmatrix} = \begin{bmatrix} 4 & 6 \\ 7 & -3 \end{bmatrix}`,
                note: {
                  tr: R`\(B^T A^T\) birebir \((AB)^T\) ile eşleşti! Oysa \(A^T B^T = \begin{bmatrix} -1 & 13 \\ 4 & 2 \end{bmatrix}\) bambaşka bir matristir.`,
                  en: R`\(B^T A^T\) matches \((AB)^T\) identically! By contrast, \(A^T B^T = \begin{bmatrix} -1 & 13 \\ 4 & 2 \end{bmatrix}\) is completely wrong.`,
                },
              },
            ],
            answer: {
              tr: R`\((AB)^T = B^T A^T = \begin{bmatrix} 4 & 6 \\ 7 & -3 \end{bmatrix} \ne A^T B^T\)`,
              en: R`\((AB)^T = B^T A^T = \begin{bmatrix} 4 & 6 \\ 7 & -3 \end{bmatrix} \ne A^T B^T\)`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: (AB)ᵀ = Aᵀ Bᵀ yazmak", en: "Common mistake: Writing (AB)ᵀ = Aᵀ Bᵀ" },
            text: {
              tr: R`Sınavlarda en çok puan kaybettiren refleks, parantezi açınca sırayı korumaktır. İster iki ister üç matris olsun, transpoz <b>tüm faktörlerin sırasını baştan sona ters çevirir</b>: \((ABC)^T = C^T B^T A^T\).`,
              en: R`The #1 exam slip is keeping the same order when distributing transpose. Whether there are two or ten factors, transpose <b>reverses the entire product from end to end</b>: \((ABC)^T = C^T B^T A^T\).`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`\(A\) veya \(B\) kutularından herhangi bir sayıyı değiştirin: \((AB)^T\) ile \(B^T A^T\) daima birebir aynı kalırken \(A^T B^T\) çoğunlukla farklı çıkar!`,
              en: R`Edit any number in \(A\) or \(B\): watch \((AB)^T\) and \(B^T A^T\) stay 100% identical while \(A^T B^T\) disagrees!`,
            },
            {
              tr: R`<b>Simetrik A</b> düğmesine tıklayın: \(A^T = A\) olduğunu ve köşegen dışı elemanların birbirinin aynası olduğunu görün.`,
              en: R`Click <b>Symmetric A</b>: see \(A^T = A\) with off-diagonal entries mirroring each other.`,
            },
            {
              tr: R`<b>Ters Simetrik A</b> düğmesine tıklayın: \(A^T = -A\) olduğunda ana köşegenin neden mecburen \(0\) olması gerektiğini fark edin!`,
              en: R`Click <b>Skew-Symmetric A</b>: notice why \(A^T = -A\) forces every diagonal entry to be \(0\)!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.trans ??= {
          A: [[1, 2], [3, 0]],
          B: [[2, -1], [1, 4]],
          preset: "basic",
        });
        const presets = {
          basic: { label: { tr: "Temel Örnek", en: "Basic" }, A: [[1, 2], [3, 0]], B: [[2, -1], [1, 4]] },
          sym: { label: { tr: "Simetrik A", en: "Symmetric A" }, A: [[4, -2], [-2, 5]], B: [[1, 3], [0, 2]] },
          skew: { label: { tr: "Ters Simetrik A", en: "Skew-Sym A" }, A: [[0, 3], [-3, 0]], B: [[2, 1], [1, -1]] },
        };
        const ctl = h("div", { class: "t-controls" });
        const editors = h("div", { class: "mx-row-wrap" });
        const calc1 = h("div", { class: "pc-calc" });
        const calc2 = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, editors, calc1, calc2, msg);

        const draw = () => {
          const At = matTranspose(s.A);
          const Bt = matTranspose(s.B);
          const ABt = matTranspose(matMul(s.A, s.B));
          const BtAt = matMul(Bt, At);
          const AtBt = matMul(At, Bt);
          const symPart = matScale(matAdd(s.A, At), 0.5);
          const isSym = matsEqual(s.A, At);
          const isSkew = matsEqual(s.A, matScale(At, -1));
          const wrongMatches = matsEqual(ABt, AtBt);

          calc1.textContent = `\\(A^T = ${matToTex(At)},\\qquad \\tfrac{1}{2}(A + A^T) = ${matToTex(symPart)}\\)`;
          calc2.textContent = `\\((AB)^T = B^T A^T = ${matToTex(ABt)},\\qquad A^T B^T = ${matToTex(AtBt)}\\)`;
          if (isSym) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `A simetrik (Aᵀ = A)! Ayrıca (AB)ᵀ = BᵀAᵀ doğrulandı${wrongMatches ? " (bu özel çiftte AᵀBᵀ de eşit çıktı)." : " ve AᵀBᵀ ≠ (AB)ᵀ."}`,
              en: `A is symmetric (Aᵀ = A)! Also (AB)ᵀ = BᵀAᵀ holds${wrongMatches ? " (for this special pair AᵀBᵀ happens to match too)." : " while AᵀBᵀ ≠ (AB)ᵀ."}`,
            });
          } else if (isSkew) {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `A ters simetrik (Aᵀ = −A, köşegen daima 0)! (AB)ᵀ = BᵀAᵀ her zaman geçerlidir.`,
              en: `A is skew-symmetric (Aᵀ = −A, diagonal must be 0)! (AB)ᵀ = BᵀAᵀ always holds.`,
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: wrongMatches
                ? `A genel matris. (AB)ᵀ = BᵀAᵀ her zaman eşittir (burada tesadüfen AᵀBᵀ de eşit).`
                : `A genel matris, ama ½(A + Aᵀ) daima simetriktir! Gördüğünüz gibi (AB)ᵀ = BᵀAᵀ ≠ AᵀBᵀ.`,
              en: wrongMatches
                ? `A is general. (AB)ᵀ = BᵀAᵀ always matches (and happens to equal AᵀBᵀ here).`
                : `A is general, yet ½(A + Aᵀ) is ALWAYS symmetric! Notice (AB)ᵀ = BᵀAᵀ ≠ AᵀBᵀ.`,
            });
          }
        };

        const rebuildEditors = () => {
          editors.replaceChildren(
            h("div", {}, h("div", { class: "mini-title", text: "A" }), matrixInput(s.A, draw)),
            h("div", {}, h("div", { class: "mini-title", text: "B" }), matrixInput(s.B, draw)),
          );
          draw();
        };

        ctl.append(
          segmented(
            Object.entries(presets).map(([k, v]) => [k, v.label]),
            s.preset,
            (k) => {
              s.preset = k;
              s.A = presets[k].A.map((r) => [...r]);
              s.B = presets[k].B.map((r) => [...r]);
              rebuildEditors();
            },
          ),
        );
        rebuildEditors();
      },
    },
  ],

  playground: {
    title: {
      tr: "Etkileşimli 2×2 Matris Çarpım & Dönüşüm Stüdyosu",
      en: "Interactive 2×2 Matrix Product & Transform Studio",
    },
    sub: {
      tr: R`Hazır senaryolardan birini seçin veya \(A\) ve \(B\) kutularını kendiniz düzenleyin; \(AB\), \(BA\), \(A\mathbf x\), \(AB\mathbf x\) ve \(BA\mathbf x\) vektörlerini aynı düzlemde canlı karşılaştırın.`,
      en: R`Pick a preset scenario or edit \(A\) and \(B\) yourself; compare \(AB\), \(BA\), \(A\mathbf x\), \(AB\mathbf x\), and \(BA\mathbf x\) live on the same plane.`,
    },
    experiments: [
      {
        tr: R`<b>Birim Matris Testi:</b> <b>Birim (B = I)</b> düğmesine basın; \(AI = IA = A\) olduğunu ve \(AB\mathbf x\) okunun tam \(A\mathbf x\) üzerine bindiğini doğrulayın.`,
        en: R`<b>Identity Test:</b> click <b>Identity (B = I)</b> and verify that \(AI = IA = A\) so \(AB\mathbf x\) lands right on top of \(A\mathbf x\).`,
      },
      {
        tr: R`<b>Değişme Özelliği Çöküşü:</b> <b>Kaydırma + Dönme</b> senaryosunda siyah \(\mathbf x\) ucunu daire çizerek sürükleyin — turuncu \(AB\mathbf x\) ile mor \(BA\mathbf x\) oklarının ne kadar farklı yönlere gittiğini görün.`,
        en: R`<b>Non-Commutativity Live:</b> in <b>Shear + Rot</b>, drag the dark handle \(\mathbf x\) around the origin and watch the orange \(AB\mathbf x\) and purple \(BA\mathbf x\) arrows diverge.`,
      },
      {
        tr: R`<b>Sıfır Bölen Tuzağı (Sınav Klasiği!):</b> <b>Sıfır Çarpım (AB = 0)</b> düğmesine tıklayın: ne \(A\) ne de \(B\) sıfır matrisi, ama \(AB = 0\)! Üstelik \(BA \ne 0\) — reel sayılardaki \(ab = 0 \Rightarrow a=0 \text{ veya } b=0\) kuralı matrislerde çöker!`,
        en: R`<b>Zero-Divisor Trap (Exam Classic!):</b> click <b>Zero Product (AB = 0)</b>: neither \(A\) nor \(B\) is the zero matrix, yet \(AB = 0\) while \(BA \ne 0\)! The real-number rule \(ab=0 \Rightarrow a=0\text{ or }b=0\) fails for matrices!`,
      },
      {
        tr: R`<b>Dönüşümü Geri Alma:</b> <b>Sınav Sorusu (AB = I)</b> senaryosunda \(B\) matrisinin \(A\)'nın etkisini tamamen sildiğini (\(AB\mathbf x = \mathbf x\)) gözlemleyin!`,
        en: R`<b>Undoing a Map:</b> click <b>Exam Case (AB = I)</b> and watch \(B\) completely undo \(A\) so \(AB\mathbf x\) snaps right back onto \(\mathbf x\)!`,
      },
    ],
    build(host, state) {
      const s = (state.pg ??= {
        A: [[1, 1], [0, 1]],
        B: [[0, -1], [1, 0]],
        x: [2, 1],
        preset: "basic",
      });
      const presets = {
        basic: {
          label: { tr: "Kaydırma + Dönme", en: "Shear + Rot" },
          A: [[1, 1], [0, 1]],
          B: [[0, -1], [1, 0]],
          x: [2, 1],
        },
        identity: {
          label: { tr: "Birim (B = I)", en: "Identity (B = I)" },
          A: [[2, -1], [1, 1]],
          B: [[1, 0], [0, 1]],
          x: [1.5, 1],
        },
        zeroDiv: {
          label: { tr: "Sıfır Çarpım (AB = 0)", en: "Zero Product (AB = 0)" },
          A: [[1, -1], [2, -2]],
          B: [[1, 1], [1, 1]],
          x: [1.5, 0.5],
        },
        exam: {
          label: { tr: "Sınav Sorusu (AB = I)", en: "Exam Case (AB = I)" },
          A: [[2, 1], [1, 1]],
          B: [[1, -1], [-1, 2]],
          x: [1.5, 1.5],
        },
      };

      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const ctl = h("div", { class: "t-controls" });
      const canvasHost = h("div");
      stage.append(ctl, canvasHost);

      const plot = createCanvas2D(canvasHost, {
        height: 360,
        interactive: true,
        hint: L({ tr: "x vektörünün ucunu sürükleyin", en: "Drag the tip of vector x" }),
      });

      const editors = h("div", { class: "mx-row-wrap" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      const msg = h("p", { class: "pc-msg" });
      side.append(editors, tiles, calc, msg);

      const draw = () => {
        const AB = matMul(s.A, s.B);
        const BA = matMul(s.B, s.A);
        const ax = matVec(s.A, s.x);
        const abx = matVec(AB, s.x);
        const bax = matVec(BA, s.x);
        const comm = matsEqual(AB, BA, 1e-5);
        const abZero = matsEqual(AB, [[0, 0], [0, 0]], 1e-5);
        const abId = matsEqual(AB, [[1, 0], [0, 1]], 1e-5);

        plot.draw({
          x: [-5.5, 5.5],
          y: [-5.5, 5.5],
          equalAspect: true,
          xLabel: "x",
          yLabel: "y",
          vectors: [
            { to: s.x, color: COLORS.muted, width: 2.2, label: "x" },
            { to: ax, color: COLORS.c1, dash: [5, 4], width: 2, label: "Ax" },
            { to: abx, color: COLORS.c2, width: 3, label: "ABx" },
            { to: bax, color: COLORS.c4, width: 2.4, label: "BAx" },
          ],
          handles: [
            {
              id: "x",
              x: s.x[0],
              y: s.x[1],
              color: COLORS.text,
              onDrag: (x, y) => {
                s.x = [x, y];
                draw();
              },
            },
          ],
        });

        tiles.replaceChildren(
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: "AB = BA?" }),
            h("span", { class: "pg-tile-value", text: comm ? L({ tr: "Evet ✓", en: "Yes ✓" }) : L({ tr: "Hayır ✕", en: "No ✕" }) }),
          ),
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: "det(A)" }),
            h("span", { class: "pg-tile-value", text: ns(det2(s.A), 2) }),
          ),
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: "det(B)" }),
            h("span", { class: "pg-tile-value", text: ns(det2(s.B), 2) }),
          ),
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: "det(AB)" }),
            h("span", { class: "pg-tile-value", text: ns(det2(AB), 2) }),
          ),
        );

        calc.textContent = `\\(AB = ${matToTex(AB)},\\quad BA = ${matToTex(BA)},\\quad AB\\mathbf x = (${tx(abx[0], 2)},\\ ${tx(abx[1], 2)})\\)`;
        if (abZero) {
          msg.className = "pc-msg bad";
          msg.textContent = L({
            tr: "Sıfır bölen örneği: A ≠ 0 ve B ≠ 0 olduğu hâlde AB = 0! Her x vektörü sıfıra ezildi.",
            en: "Zero-divisor phenomenon: A ≠ 0 and B ≠ 0, yet AB = 0! Every input vector x is crushed to zero.",
          });
        } else if (abId) {
          msg.className = "pc-msg good";
          msg.textContent = L({
            tr: "AB = I₂: B, A'nın ters matrisidir! ABx tam olarak x'e geri döndü.",
            en: "AB = I₂: B is the inverse of A! ABx landed right back on x.",
          });
        } else if (comm) {
          msg.className = "pc-msg good";
          msg.textContent = L({
            tr: "AB = BA: Bu iki matris değişmelidir — turuncu ABx ile mor BAx çakışıyor.",
            en: "AB = BA: These two matrices commute — orange ABx and purple BAx coincide.",
          });
        } else {
          msg.className = "pc-msg info";
          msg.textContent = L({
            tr: `AB ≠ BA: ABx = (${ns(abx[0], 2)}, ${ns(abx[1], 2)}), BAx = (${ns(bax[0], 2)}, ${ns(bax[1], 2)}).`,
            en: `AB ≠ BA: ABx = (${ns(abx[0], 2)}, ${ns(abx[1], 2)}), BAx = (${ns(bax[0], 2)}, ${ns(bax[1], 2)}).`,
          });
        }
      };

      const rebuildEditors = () => {
        editors.replaceChildren(
          h("div", {}, h("div", { class: "mini-title", text: "A" }), matrixInput(s.A, draw)),
          h("div", {}, h("div", { class: "mini-title", text: "B" }), matrixInput(s.B, draw)),
        );
        draw();
      };

      ctl.append(
        segmented(
          Object.entries(presets).map(([k, v]) => [k, v.label]),
          s.preset,
          (k) => {
            s.preset = k;
            s.A = presets[k].A.map((r) => [...r]);
            s.B = presets[k].B.map((r) => [...r]);
            s.x = [...presets[k].x];
            rebuildEditors();
          },
        ),
      );
      rebuildEditors();
    },
  },

  mathSections: [
    {
      id: "m-mx-linear",
      title: { tr: "Doğrusallık ve Standart 2×2 Dönüşüm Matrisleri", en: "Linearity & Standard 2×2 Transformation Matrices" },
      blocks: [
        {
          p: {
            tr: R`Bir \(m\times n\) matrisi \(A\), \(\mathbb{R}^n\)'den \(\mathbb{R}^m\)'e giden bir [[linear-map|doğrusal dönüşümü]] \(T(\mathbf x) = A\mathbf x\) biçiminde temsil eder. Doğrusallık, toplama ve skalerle çarpmayı koruduğu anlamına gelir:`,
            en: R`Every \(m\times n\) matrix \(A\) defines a [[linear-map|linear transformation]] \(T(\mathbf x) = A\mathbf x\) from \(\mathbb{R}^n\) to \(\mathbb{R}^m\). Linearity means it preserves both addition and scalar multiplication:`,
          },
        },
        { eq: R`A(\alpha \mathbf u + \beta \mathbf v) = \alpha A\mathbf u + \beta A\mathbf v, \qquad A = \big[T(\mathbf e_1)\ \ T(\mathbf e_2)\ \ \cdots\ \ T(\mathbf e_n)\big]` },
        {
          table: {
            head: [
              { tr: "Geometrik dönüşüm", en: "Geometric map" },
              { tr: "2×2 Matris", en: "2×2 Matrix" },
              { tr: "Birim karelere etkisi", en: "Effect on the plane" },
            ],
            rows: [
              [
                { tr: "Ölçekleme (Scaling)", en: "Scaling" },
                { tr: R`\(\begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix}\)`, en: R`\(\begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix}\)` },
                { tr: R`\(x\)'i \(s_x\) kat, \(y\)'yi \(s_y\) kat uzatır`, en: R`Stretches \(x\) by \(s_x\) and \(y\) by \(s_y\)` },
              ],
              [
                { tr: R`Saat yönü tersi dönme (\(\theta\))`, en: R`Counter-clockwise rotation (\(\theta\))` },
                { tr: R`\(\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}\)`, en: R`\(\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}\)` },
                { tr: R`Orijin etrafında \(\theta\) kadar döndürür`, en: R`Rotates by \(\theta\) around the origin` },
              ],
              [
                { tr: R`\(x\)-ekseninde yansıma`, en: R`Reflection across \(x\)-axis` },
                { tr: R`\(\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}\)`, en: R`\(\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}\)` },
                { tr: R`Yukarıyı aşağı çevirir (\(\det = -1\))`, en: R`Flips upside down (\(\det = -1\))` },
              ],
              [
                { tr: "Yatay kaydırma (Shear)", en: "Horizontal shear" },
                { tr: R`\(\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}\)`, en: R`\(\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}\)` },
                { tr: R`Üst kenarı \(k\) kadar yana iter, alanı korur`, en: R`Slants top edge by \(k\), keeps area equal to 1` },
              ],
              [
                { tr: R`\(x\)-eksenine izdüşüm`, en: R`Projection onto \(x\)-axis` },
                { tr: R`\(\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}\)`, en: R`\(\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}\)` },
                { tr: R`\(y\) koordinatını siler, düzlemi doğruya ezer`, en: R`Drops \(y\), squashes 2D plane onto the \(x\)-axis` },
              ],
            ],
          },
        },
        {
          example: {
            title: { tr: "Taban görüntülerinden matris kurma", en: "Building a matrix from where e₁ and e₂ land" },
            problem: {
              tr: R`Bir doğrusal dönüşüm \(T(\mathbf e_1) = (3, -1)\) ve \(T(\mathbf e_2) = (2, 4)\) yapıyorsa, \(T\)'nin matrisi \(A\) nedir ve \(T(2, -1)\) nereye gider?`,
              en: R`A linear map sends \(T(\mathbf e_1) = (3, -1)\) and \(T(\mathbf e_2) = (2, 4)\). Find its matrix \(A\) and compute \(T(2, -1)\).`,
            },
            steps: [
              {
                expr: R`A = \begin{bmatrix} 3 & 2 \\ -1 & 4 \end{bmatrix}`,
                note: {
                  tr: R`\(T(\mathbf e_1)\)'i 1. sütuna, \(T(\mathbf e_2)\)'yi 2. sütuna yerleştiriyoruz.`,
                  en: R`Place \(T(\mathbf e_1)\) as column 1 and \(T(\mathbf e_2)\) as column 2.`,
                },
              },
              {
                expr: R`T\begin{bmatrix} 2 \\ -1 \end{bmatrix} = 2\begin{bmatrix} 3 \\ -1 \end{bmatrix} - 1\begin{bmatrix} 2 \\ 4 \end{bmatrix} = \begin{bmatrix} 6 - 2 \\ -2 - 4 \end{bmatrix} = \begin{bmatrix} 4 \\ -6 \end{bmatrix}`,
                note: {
                  tr: R`Sütun doğrusal bileşimiyle \(T(2,-1)\) hemen hesaplanır.`,
                  en: R`Combine the columns with weights \(2\) and \(-1\).`,
                },
              },
            ],
            answer: {
              tr: R`\(A = \begin{bmatrix} 3 & 2 \\ -1 & 4 \end{bmatrix}\) ve \(T(2, -1) = (4, -6)\).`,
              en: R`\(A = \begin{bmatrix} 3 & 2 \\ -1 & 4 \end{bmatrix}\) and \(T(2, -1) = (4, -6)\).`,
            },
          },
        },
      ],
    },

    {
      id: "m-mx-prod",
      title: { tr: "Matris Çarpımı Yasaları ve Birleşme Özelliği", en: "Matrix Multiplication Laws & Associativity" },
      blocks: [
        {
          p: {
            tr: R`Matris cebiri reel sayı cebirine çok benzer görünür; ancak bazı kurallar <b>her zaman geçerli</b>, bazıları ise <b>kesinlikle geçersizdir</b>. Aşağıdaki tablo sınavlarda tüm hataları önler:`,
            en: R`Matrix algebra looks deceptively similar to real-number algebra, yet some laws <b>always hold</b> while others <b>dramatically fail</b>. Keep this reference table handy:`,
          },
        },
        {
          table: {
            head: [
              { tr: "Özellik / İfade", en: "Property / Statement" },
              { tr: "Geçerli mi?", en: "Valid?" },
              { tr: "Açıklama", en: "Explanation" },
            ],
            rows: [
              [
                { tr: R`\(A(BC) = (AB)C\)`, en: R`\(A(BC) = (AB)C\)` },
                { tr: "Evet ✓", en: "Yes ✓" },
                { tr: "Birleşme özelliği: parantezleri kaydırabilirsiniz (sırayı değil!).", en: "Associativity: you may regroup parentheses (without swapping order!)." },
              ],
              [
                { tr: R`\(A(B + C) = AB + AC\)`, en: R`\(A(B + C) = AB + AC\)` },
                { tr: "Evet ✓", en: "Yes ✓" },
                { tr: "Sol ve sağ dağılma özellikleri her zaman geçerlidir.", en: "Left and right distributivity always hold." },
              ],
              [
                { tr: R`\(I_m A = A = A I_n\)`, en: R`\(I_m A = A = A I_n\)` },
                { tr: "Evet ✓", en: "Yes ✓" },
                { tr: "Birim matris çarpımda 1 sayısı gibi etkisizdir.", en: "Identity matrix acts like the number 1." },
              ],
              [
                { tr: R`\(AB = BA\)`, en: R`\(AB = BA\)` },
                { tr: "Hayır ✕", en: "No ✕" },
                { tr: "Değişme özelliği genelde bozulur (sıra önemlidir!).", en: "Multiplication is generally non-commutative." },
              ],
              [
                { tr: R`\(AB = O \implies A = O \text{ veya } B = O\)`, en: R`\(AB = O \implies A = O \text{ or } B = O\)` },
                { tr: "Hayır ✕", en: "No ✕" },
                { tr: "Sıfırdan farklı iki matrisin çarpımı sıfır matrisi çıkabilir!", en: "Two nonzero matrices can multiply to the zero matrix!" },
              ],
              [
                { tr: R`\(AB = AC \text{ ve } A \ne O \implies B = C\)`, en: R`\(AB = AC \text{ and } A \ne O \implies B = C\)` },
                { tr: "Hayır ✕", en: "No ✕" },
                { tr: R`Sadeleştirme ancak \(A^{-1}\) varsa (tersinirse) yapılabilir.`, en: R`Cancellation only works when \(A\) is invertible (\(A^{-1}\) exists).` },
              ],
            ],
          },
        },
        {
          derive: {
            title: { tr: "Neden (AB)x = A(Bx) ve A(BC) = (AB)C?", en: "Why (AB)x = A(Bx) and A(BC) = (AB)C?" },
            steps: [
              {
                tex: R`\big(A(BC)\big)_{il} = \sum_{j} A_{ij} (BC)_{jl}`,
                why: {
                  tr: R`Önce \(A\) ile \(BC\)'nin çarpımının \((i, l)\) elemanını tanımdan yazıyoruz.`,
                  en: R`Start with the definition of the \((i, l)\) entry of \(A\) times \((BC)\).`,
                },
              },
              {
                tex: R`= \sum_{j} A_{ij} \left(\sum_{k} B_{jk} C_{kl}\right) = \sum_{j}\sum_{k} A_{ij} B_{jk} C_{kl}`,
                why: {
                  tr: R`\((BC)_{jl}\)'yi açıp \(A_{ij}\)'yi parantez içine dağıtıyoruz — reel sayılarda çarpma dağılır.`,
                  en: R`Expand \((BC)_{jl}\) and distribute the scalar \(A_{ij}\) inside the sum.`,
                },
              },
              {
                tex: R`= \sum_{k} \left(\sum_{j} A_{ij} B_{jk}\right) C_{kl} = \sum_{k} (AB)_{ik} C_{kl} = \big((AB)C\big)_{il}`,
                why: {
                  tr: R`Sonlu toplamların sırasını değiştirince içteki toplam tam olarak \((AB)_{ik}\) olur! Aynı mantıkla \(C\) yerine vektör \(\mathbf x\) koyunca \((AB)\mathbf x = A(B\mathbf x)\) elde edilir.`,
                  en: R`Swap the order of the two finite sums: the inner sum is literally \((AB)_{ik}\)! Taking \(C = \mathbf x\) gives \((AB)\mathbf x = A(B\mathbf x)\) too.`,
                },
              },
            ],
          },
        },
        {
          callout: "warn",
          title: { tr: "Sıfır bölen örneğini aklınızda tutun!", en: "Keep this zero-divisor example in your pocket!" },
          text: {
            tr: R`\(A = \begin{bmatrix} 1 & -1 \\ 2 & -2 \end{bmatrix}\) ve \(B = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}\) ikisi de sıfırdan farklıdır ama \(AB = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}\) olur! Neden? \(B\) tüm düzlemi \(y = x\) doğrusuna ezer, \(A\) ise \(y = x\) üzerindeki her vektörü sıfıra gönderir.`,
            en: R`\(A = \begin{bmatrix} 1 & -1 \\ 2 & -2 \end{bmatrix}\) and \(B = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}\) are both nonzero, yet \(AB = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}\)! Why? \(B\) collapses the plane onto the line \(y = x\), and \(A\) crushes that exact line to \((0, 0)\).`,
          },
        },
      ],
    },

    {
      id: "m-mx-trans",
      title: { tr: "Transpoz Kuralı (AB)ᵀ = Bᵀ Aᵀ İspatı ve Simetrik Ayrıştırma", en: "Proof of (AB)ᵀ = Bᵀ Aᵀ & Symmetric Decomposition" },
      blocks: [
        {
          derive: {
            title: { tr: "Çarpımın transpozu sırayı ters çevirir: (AB)ᵀ = Bᵀ Aᵀ", en: "Proof that (AB)ᵀ = Bᵀ Aᵀ" },
            steps: [
              {
                tex: R`\big((AB)^T\big)_{ij} = (AB)_{ji}`,
                why: {
                  tr: R`Transpozun tanımı: \((i, j)\) konumundaki eleman, orijinal matrisin \((j, i)\) konumundaki elemanıdır.`,
                  en: R`Definition of transpose: entry \((i, j)\) of the transpose is entry \((j, i)\) of the original matrix.`,
                },
              },
              {
                tex: R`(AB)_{ji} = \sum_{k=1}^{p} A_{jk} B_{ki}`,
                why: {
                  tr: R`\(AB\) çarpımının \((j, i)\) elemanını satır–sütun toplamıyla açıyoruz: \(A\)'nın \(j\). satırı ile \(B\)'nin \(i\). sütunu.`,
                  en: R`Expand entry \((j, i)\) of \(AB\): dot row \(j\) of \(A\) with column \(i\) of \(B\).`,
                },
              },
              {
                tex: R`= \sum_{k=1}^{p} B_{ki} A_{jk} = \sum_{k=1}^{p} (B^T)_{ik} (A^T)_{kj} = (B^T A^T)_{ij}`,
                why: {
                  tr: R`Her terim birer reel sayı olduğu için \(A_{jk} B_{ki} = B_{ki} A_{jk}\) diye yer değiştirebiliriz! Sonra \(B_{ki} = (B^T)_{ik}\) ve \(A_{jk} = (A^T)_{kj}\) yazınca tam olarak \(B^T A^T\) çarpımının \((i, j)\) elemanı ortaya çıkar.`,
                  en: R`Inside the sum, \(A_{jk}\) and \(B_{ki}\) are plain numbers, so we can swap them to \(B_{ki} A_{jk}\). Rewriting \(B_{ki} = (B^T)_{ik}\) and \(A_{jk} = (A^T)_{kj}\) yields the exact \((i, j)\) entry of \(B^T A^T\)!`,
                },
              },
            ],
          },
        },
        {
          example: {
            title: { tr: "Her kare matrisi Simetrik + Ters Simetrik olarak ayırma", en: "Splitting any square matrix into Symmetric + Skew-Symmetric" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 4 & 6 \\ 2 & 8 \end{bmatrix}\) matrisini \(A = S + K\) biçiminde bir simetrik (\(S^T = S\)) ve bir ters simetrik (\(K^T = -K\)) matrisin toplamı olarak yazın.`,
              en: R`Decompose \(A = \begin{bmatrix} 4 & 6 \\ 2 & 8 \end{bmatrix}\) as \(A = S + K\) where \(S^T = S\) (symmetric) and \(K^T = -K\) (skew-symmetric).`,
            },
            steps: [
              {
                expr: R`A^T = \begin{bmatrix} 4 & 2 \\ 6 & 8 \end{bmatrix}`,
                note: {
                  tr: R`Önce \(A\)'nın transpozunu alıyoruz.`,
                  en: R`First take the transpose \(A^T\).`,
                },
              },
              {
                expr: R`S = \frac{1}{2}(A + A^T) = \frac{1}{2}\begin{bmatrix} 8 & 8 \\ 8 & 16 \end{bmatrix} = \begin{bmatrix} 4 & 4 \\ 4 & 8 \end{bmatrix}`,
                note: {
                  tr: R`Simetrik parça \(S = \tfrac{1}{2}(A + A^T)\): kontrol edin, \(S^T = S\)!`,
                  en: R`Symmetric part \(S = \tfrac{1}{2}(A + A^T)\): check that \(S^T = S\)!`,
                },
              },
              {
                expr: R`K = \frac{1}{2}(A - A^T) = \frac{1}{2}\begin{bmatrix} 0 & 4 \\ -4 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 2 \\ -2 & 0 \end{bmatrix}`,
                note: {
                  tr: R`Ters simetrik parça \(K = \tfrac{1}{2}(A - A^T)\): kontrol edin, \(K^T = -K\) ve \(S + K = A\)!`,
                  en: R`Skew-symmetric part \(K = \tfrac{1}{2}(A - A^T)\): check that \(K^T = -K\) and \(S + K = A\)!`,
                },
              },
            ],
            answer: {
              tr: R`\(A = \begin{bmatrix} 4 & 4 \\ 4 & 8 \end{bmatrix} + \begin{bmatrix} 0 & 2 \\ -2 & 0 \end{bmatrix}\)`,
              en: R`\(A = \begin{bmatrix} 4 & 4 \\ 4 & 8 \end{bmatrix} + \begin{bmatrix} 0 & 2 \\ -2 & 0 \end{bmatrix}\)`,
            },
          },
        },
        {
          callout: "tip",
          title: { tr: "AᵀA her zaman simetriktir!", en: "AᵀA is ALWAYS symmetric!" },
          text: {
            tr: R`\(A\) dikdörtgen (kare bile olmasa!) herhangi bir matris olsun; \((A^T A)^T = A^T (A^T)^T = A^T A\) olduğundan \(A^T A\) <b>daima kare ve simetriktir</b>. Bu harika özellik Bölüm 10'da en küçük kareler (Least Squares) yönteminin kalbidir!`,
            en: R`For ANY matrix \(A\) (even rectangular!), \((A^T A)^T = A^T (A^T)^T = A^T A\), so \(A^T A\) is <b>always square and symmetric</b>. This gem powers Least Squares in Chapter 10!`,
          },
        },
      ],
    },

    {
      id: "m-mx-types",
      title: { tr: "Özel Matris Türleri ve Hızlı Kısayollar", en: "Special Matrix Families & Quick Shortcuts" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Matris türü", en: "Matrix type" },
              { tr: "Koşul / Tanım", en: "Condition / Definition" },
              { tr: "Örnek & Özellik", en: "Example & Key property" },
            ],
            rows: [
              [
                { tr: R`Birim matris \(I_n\)`, en: R`Identity \(I_n\)` },
                { tr: R`Köşegende \(1\), diğer her yerde \(0\)`, en: R`\(1\)s on diagonal, \(0\)s elsewhere` },
                { tr: R`\(I_n \mathbf x = \mathbf x\), \(A I = I A = A\)`, en: R`\(I_n \mathbf x = \mathbf x\), \(A I = I A = A\)` },
              ],
              [
                { tr: "Köşegen (Diagonal)", en: "Diagonal" },
                { tr: R`\(i \ne j \implies a_{ij} = 0\)`, en: R`\(i \ne j \implies a_{ij} = 0\)` },
                { tr: R`\(D^k\): sadece köşegen elemanlarının \(k\). kuvvetini al!`, en: R`\(D^k\): just raise each diagonal entry to the \(k\)-th power!` },
              ],
              [
                { tr: "Üst / Alt Üçgensel", en: "Upper / Lower Triangular" },
                { tr: R`Köşegenin altı (veya üstü) hep \(0\)`, en: R`All entries below (or above) diagonal are \(0\)` },
                { tr: "İki üst üçgenselin çarpımı yine üst üçgenseldir.", en: "Product of two upper-triangular matrices stays upper-triangular." },
              ],
              [
                { tr: "Simetrik", en: "Symmetric" },
                { tr: R`\(A^T = A\) (\(a_{ij} = a_{ji}\))`, en: R`\(A^T = A\) (\(a_{ij} = a_{ji}\))` },
                { tr: R`Örn. \(\begin{bmatrix} 2 & 5 \\ 5 & -1 \end{bmatrix}\) — köşegene göre ayna!`, en: R`E.g. \(\begin{bmatrix} 2 & 5 \\ 5 & -1 \end{bmatrix}\) — mirror across diagonal!` },
              ],
              [
                { tr: "Ters Simetrik", en: "Skew-Symmetric" },
                { tr: R`\(A^T = -A\) (\(a_{ij} = -a_{ji}\))`, en: R`\(A^T = -A\) (\(a_{ij} = -a_{ji}\))` },
                { tr: R`Ana köşegen mecburen hep \(0\)'dır (\(a_{ii} = -a_{ii}\)).`, en: R`Main diagonal must be all \(0\)s (\(a_{ii} = -a_{ii}\)).` },
              ],
            ],
          },
        },
        {
          links: [
            { tab: "theory", section: "mx-transform" },
            { tab: "theory", section: "mx-comp" },
            { tab: "theory", section: "mx-transpose" },
            { tab: "play" },
          ],
        },
      ],
    },
  ],

  practiceSections: PRACTICE,
});
