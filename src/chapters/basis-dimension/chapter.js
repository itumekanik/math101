import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { det2, inv2, matMul, matVec, solveLinear, vAdd, vNorm, vScale } from "../../engines/math-core.ts";
import { matToTex } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, txs, segmented } = KIT;

mountChapter({
  intro: {
    id: "bd-intro",
    title: { tr: "Taban, Boyut ve Koordinatlar", en: "Basis, Dimension, and Coordinates" },
    paragraphs: [
      {
        tr: R`Bir vektör uzayındaki her noktaya tek ve net bir adres vermek istiyorsak, önce uzayın iskeletini kurmalıyız: <b>[[basis|taban]]</b> \(\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}\). Taban, uzayı hem tamamen <b>geren</b> hem de içinde tek bir gereksiz vektör bile barındırmayan (<b>doğrusal bağımsız</b>) en sade yapı taşları setidir.`,
        en: R`To give every vector in a space one crystal-clear address, we first build its skeleton: a <b>[[basis|basis]]</b> \(\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}\). A basis is the leanest set of building blocks that <b>spans</b> the whole space with ZERO redundancy (<b>linearly independent</b>).`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> herhangi bir vektör kümesinin taban olup olmadığını sınayacak, eğik bir \(\mathcal{B}\)-ızgarasında koordinat \([\mathbf{x}]_{\mathcal{B}}\) okuyacak, taban değişim matrisi \(P\) ile \([\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x}\) dönüşümünü uygulayacak ve <b>[[rank-nullity|Rank–Sıfırlık Teoremini]]</b> (\(\operatorname{rank}(A) + \dim\ker(A) = n\)) ustalıkla kullanacaksınız.`,
        en: R`<b>By the end of this chapter</b> you will test whether vectors form a basis, read coordinates \([\mathbf{x}]_{\mathcal{B}}\) on a slanted \(\mathcal{B}\)-grid, convert between coordinate systems with \(P\) and \(P^{-1}\), and apply the <b>[[rank-nullity|Rank–Nullity Theorem]]</b> (\(\operatorname{rank}(A) + \dim\ker(A) = n\)).`,
      },
    ],
    analogy: {
      title: { tr: "Hiç bilmeyenler için: Bir taban = Şehrin en sade GPS eksenleri", en: "Zero-jargon intuition: A basis = Minimal GPS axes" },
      text: {
        tr: R`Bir arkadaşınıza şehirde buluşma yeri tarif ettiğinizi düşünün. <b>Sadece 1 yön</b> ("Doğu") verirseniz tek bir caddede sıkışırsınız — şehrin geri kalanına ulaşamazsınız (<b>eksik, germez</b>). <b>3 yön</b> ("Doğu, Kuzey, Kuzeydoğu") verirseniz aynı kafe için sonsuz farklı tarif çıkar (<b>fazla, bağımlı</b>). İşte <b>2 bağımsız yön</b> ("Doğu" ve "Kuzey") tam altın noktadır: her adrese ulaşılır VE her adresin <b>tek bir</b> koordinatı vardır — buna <b>taban</b> denir!`,
        en: R`Imagine giving GPS directions in a city. With <b>only 1 axis</b> ("East"), you're stuck on one street and can't reach the rest of town (<b>too few — fails to span</b>). With <b>3 axes</b> ("East, North, Northeast"), the same café has infinitely many different addresses (<b>too many — redundant</b>). Exactly <b>2 independent axes</b> hit the sweet spot: every spot is reachable AND has <b>one unique</b> coordinate pair — that's a <b>basis</b>!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 11 · Taban, Boyut ve Koordinatlar", en: "Lecture 11 · Basis, Dimension & Coordinates" }],
      [{ tr: "Taban & Boyut", en: "Basis & Dimension" }, { tr: R`Geren + Bağımsız küme; eleman sayısı \(\dim(V)\) her tabanda sabittir`, en: R`Spanning + Independent set; its size \(\dim(V)\) is invariant across all bases` }],
      [{ tr: "Taban değişimi", en: "Change of basis" }, { tr: R`\(\mathbf{x} = P[\mathbf{x}]_{\mathcal{B}},\quad [\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x},\quad [T]_{\mathcal{B}} = P^{-1}[T]_{\mathcal{E}}P\)`, en: R`\(\mathbf{x} = P[\mathbf{x}]_{\mathcal{B}},\quad [\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x},\quad [T]_{\mathcal{B}} = P^{-1}[T]_{\mathcal{E}}P\)` }],
      [{ tr: "Rank–Sıfırlık", en: "Rank–Nullity" }, { tr: R`\(\operatorname{rank}(A) + \dim\ker(A) = n\) (sütun sayısı!)`, en: R`\(\operatorname{rank}(A) + \dim\ker(A) = n\) (# of columns!)` }],
    ],
    tip: {
      title: { tr: "İki hayat kurtaran ezber kontrolü", en: "Two life-saving sanity checks" },
      text: {
        tr: R`1) Sütunları \(\mathbf{b}_1, \mathbf{b}_2\) olan \(P\) matrisi <b>\(\mathcal{B}\)'den standarta</b> gider (\(\mathbf{x} = P[\mathbf{x}]_{\mathcal{B}}\)); tersi için \(P^{-1}\) gerekir.<br>2) Rank–Sıfırlık formülündeki \(n\) daima matrisin <b>sütun sayısıdır</b> (satır sayısı değil!).`,
        en: R`1) \(P = [\mathbf{b}_1\ \mathbf{b}_2]\) always maps <b>FROM \(\mathcal{B}\) TO standard</b> (\(\mathbf{x} = P[\mathbf{x}]_{\mathcal{B}}\)); use \(P^{-1}\) to go the other way.<br>2) In Rank–Nullity, \(n\) is ALWAYS the number of <b>columns</b> (never rows!).`,
      },
    },
  },
  sections: [
    {
      id: "bd-what",
      mathId: "m-bd-dim",
      title: { tr: "Taban = Ne Eksik Ne Fazla: Tam Yeterli Bağımsız Vektörler", en: "Basis = Just Enough Independent Vectors (Neither Too Few Nor Too Many)" },
      body: [
        {
          tr: R`Bir vektör uzayı \(V\) için \(\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}\) kümesinin <b>[[basis|taban]]</b> olabilmesi için iki kuralın aynı anda sağlanması gerekir: (1) tüm uzayı doldurmalı ([[span|germe]]) ve (2) hiçbir vektör diğerlerinin kopyası olmamalı ([[linear-independence|doğrusal bağımsızlık]]).`,
          en: R`A collection \(\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}\) is a <b>[[basis|basis]]</b> of a vector space \(V\) when it satisfies TWO rules simultaneously: (1) it reaches every vector in \(V\) ([[span|spans]] \(V\)), and (2) no vector is redundant ([[linear-independence|linearly independent]]).`,
        },
        {
          eq: {
            tr: R`\mathcal{B}\text{ bir tabandır} \iff \operatorname{span}(\mathcal{B}) = V \;\text{ ve }\; \mathcal{B}\text{ doğrusal bağımsızdır}`,
            en: R`\mathcal{B}\text{ is a basis} \iff \operatorname{span}(\mathcal{B}) = V \;\text{ and }\; \mathcal{B}\text{ is linearly independent}`,
          },
        },
        {
          analogy: {
            title: { tr: "Boyut Teoremi: Hangi tabanı seçersen seç sayı değişmez!", en: "Dimension Theorem: Every basis has the EXACT same size!" },
            text: {
              tr: R`Bir odanın genişliğini ister metre ister adım ister karışla ölçün — oda yine 2 boyutlu bir zemine sahiptir! Aynı şekilde \(\mathbb{R}^2\) için seçebileceğiniz sonsuz farklı taban vardır ama <b>hepsi tam olarak 2 vektör içerir</b>. Bu değişmez sayıya uzayın <b>boyutu</b> denir ve \(\dim(V)\) diye okunur ("\(V\)'nin boyutu").`,
              en: R`Whether you measure a room with meters, feet, or tilted grid tiles, the floor is always 2-dimensional! Likewise, \(\mathbb{R}^2\) has infinitely many valid bases, yet <b>every single one contains exactly 2 vectors</b>. This rock-solid invariant is the <b>dimension</b>, written \(\dim(V)\) ("dimension of \(V\)").`,
            },
          },
        },
        {
          example: {
            title: { tr: "İki vektör ℝ²'nin tabanı mıdır?", en: "Do two vectors form a basis of ℝ²?" },
            problem: {
              tr: R`\(\mathcal{B} = \{(2, 1),\ (1, 3)\}\) kümesi \(\mathbb{R}^2\) için geçerli bir taban mıdır?`,
              en: R`Is \(\mathcal{B} = \{(2, 1),\ (1, 3)\}\) a valid basis of \(\mathbb{R}^2\)?`,
            },
            steps: [
              {
                expr: R`|\mathcal{B}| = 2 = \dim(\mathbb{R}^2)`,
                note: { tr: R`Önce vektör sayısını kontrol ederiz: 2 vektör tam doğru sayıda (ne eksik ne fazla).`, en: R`First check the count: 2 vectors matches \(\dim(\mathbb{R}^2) = 2\) (neither too few nor too many).` },
              },
              {
                expr: R`\det\begin{bmatrix} 2 & 1 \\ 1 & 3 \end{bmatrix} = 2\cdot 3 - 1\cdot 1 = 5 \ne 0`,
                note: { tr: R`Determinant sıfırdan farklı olduğuna göre iki vektör doğrusal bağımsızdır!`, en: R`A nonzero determinant proves the two vectors are linearly independent!` },
              },
              {
                expr: {
                  tr: R`\text{2 bağımsız vektör } \mathbb{R}^2\text{'de otomatik olarak gerer} \implies \text{TABAN!}`,
                  en: R`2\text{ independent vectors in } \mathbb{R}^2\text{ automatically span} \implies \text{BASIS!}`,
                },
                note: { tr: R`Boyutu \(n\) olan bir uzayda \(n\) tane bağımsız vektör otomatik olarak tüm uzayı gerer!`, en: R`In any \(n\)-dimensional space, \(n\) independent vectors automatically span the entire space!` },
              },
            ],
            answer: { tr: R`Evet! \(\mathcal{B} = \{(2, 1),\ (1, 3)\}\), \(\mathbb{R}^2\)'nin geçerli bir tabanıdır.`, en: R`Yes! \(\mathcal{B} = \{(2, 1),\ (1, 3)\}\) is a valid basis of \(\mathbb{R}^2\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Yaygın yanılgı: \"Uzayın tek bir tabanı vardır\" YANLIŞ!", en: "Common myth: \"A space only has ONE basis\" — FALSE!" },
            text: {
              tr: R`Standart taban \(\mathcal{E} = \{(1, 0),\ (0, 1)\}\) sadece en alışık olduğumuz tabandır, tek taban değildir! \(\mathbb{R}^2\)'de aynı doğru üzerinde olmayan <b>herhangi iki vektör</b> kusursuz bir taban oluşturur. Hatta mühendislik ve fizikte probleme uygun özel (örneğin döndürülmüş) taban seçmek karmaşık denklemleri bir anda basitleştirir.`,
              en: R`The standard basis \(\mathcal{E} = \{(1, 0),\ (0, 1)\}\) is merely our default habit, NOT the only basis! <b>Any two non-collinear vectors</b> in \(\mathbb{R}^2\) form a perfectly valid basis — and in physics & computer graphics, switching to a smart custom basis often turns messy equations diagonal!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"1 Vektör (Eksik)"</b> moduna bakın: yalnızca mavi doğru üzerindeki noktalar erişilebilir — düzlemi geremediği için taban DEĞİL!`, en: R`Look at <b>"1 Vector (Too Few)"</b>: only points on the blue line are reachable — fails to span \(\mathbb{R}^2\), NOT a basis!` },
            { tr: R`<b>"2 Vektör (Tam!)"</b> moduna geçin: mavi ızgara tüm düzlemi kaplar! Şimdi yeşil \(\mathbf{v}_2\)'yi mavi \(\mathbf{v}_1\) ile aynı doğrultuya sürükleyip tabanın nasıl bozulduğunu izleyin.`, en: R`Switch to <b>"2 Vectors (Just Right!)"</b>: the blue grid tiles the whole plane! Now drag green \(\mathbf{v}_2\) onto \(\mathbf{v}_1\)'s line to watch the basis break.` },
            { tr: R`<b>"3 Vektör (Fazla)"</b> moduna tıklayın: mor \(\mathbf{v}_3\)'ün otomatik olarak \(\mathbf{v}_1\) ve \(\mathbf{v}_2\)'nin bileşimi olduğunu (fazlalık!) görün.`, en: R`Click <b>"3 Vectors (Too Many)"</b>: watch purple \(\mathbf{v}_3\) automatically written as a redundant combination of \(\mathbf{v}_1\) and \(\mathbf{v}_2\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.what ??= { count: 2, v1: [2, 0.5], v2: [0.5, 2], v3: [2.5, 2.5] });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 275,
          interactive: true,
          hint: L({ tr: "Vektör uçlarını sürükleyin", en: "Drag vector tips" }),
        });

        const draw = () => {
          const d = det2([[s.v1[0], s.v2[0]], [s.v1[1], s.v2[1]]]);
          const indep2 = Math.abs(d) > 0.14;

          if (s.count === 1) {
            const v1Sq = s.v1[0] * s.v1[0] + s.v1[1] * s.v1[1];
            plot.draw({
              x: [-4, 4.5], y: [-4, 4.5], equalAspect: true, xLabel: "x", yLabel: "y",
              lines: v1Sq > 1e-6 ? [{ a: -s.v1[1], b: s.v1[0], c: 0, color: COLORS.c1, width: 2.8, dash: [6, 4], label: L({ tr: "span (1B)", en: "span (1D)" }) }] : [],
              vectors: [{ to: s.v1, color: COLORS.c1, width: 3, label: "v₁" }],
              handles: [{ id: "v1", x: s.v1[0], y: s.v1[1], color: COLORS.c1, onDrag: (x, y) => { s.v1 = [x, y]; draw(); } }],
            });
            calc.textContent = `\\(\\dim\\operatorname{span}\\{\\mathbf{v}_1\\} = 1 < 2 = \\dim(\\mathbb{R}^2)\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "EKSİK (Taban değil!): Bağımsız ama tüm ℝ²'yi germiyor — sadece tek bir doğruya ulaşabilir.",
              en: "TOO FEW (Not a basis!): Independent, yet fails to span ℝ² — trapped on a single 1D line.",
            });
          } else if (s.count === 2) {
            const v1Sq = s.v1[0] * s.v1[0] + s.v1[1] * s.v1[1];
            plot.draw({
              x: [-4, 4.5], y: [-4, 4.5], equalAspect: true, xLabel: "x", yLabel: "y",
              basisGrid: indep2 ? { b1: s.v1, b2: s.v2, color: COLORS.c1, range: 5 } : undefined,
              lines: !indep2 && v1Sq > 1e-6 ? [{ a: -s.v1[1], b: s.v1[0], c: 0, color: COLORS.bad, width: 2.6, dash: [6, 4] }] : [],
              vectors: [
                { to: s.v1, color: COLORS.c1, width: 2.8, label: "v₁" },
                { to: s.v2, color: COLORS.c3, width: 2.8, label: "v₂" },
              ],
              handles: [
                { id: "v1", x: s.v1[0], y: s.v1[1], color: COLORS.c1, onDrag: (x, y) => { s.v1 = [x, y]; draw(); } },
                { id: "v2", x: s.v2[0], y: s.v2[1], color: COLORS.c3, onDrag: (x, y) => { s.v2 = [x, y]; draw(); } },
              ],
            });
            calc.textContent = `\\(\\det[\\mathbf{v}_1\\ \\mathbf{v}_2] = ${tx(d, 2)} ${indep2 ? `\\ne 0 \\implies \\text{${L({ tr: "TABAN!", en: "BASIS!" })}}` : `\\approx 0 \\implies \\text{${L({ tr: "BAĞIMLI", en: "DEPENDENT" })}}`}\\)`;
            if (indep2) {
              msg.className = "pc-msg good";
              msg.textContent = L({
                tr: "TAM YETERLİ (Geçerli Taban!): Hem doğrusal bağımsız hem de tüm ℝ²'yi geriyor!",
                en: "JUST RIGHT (Valid Basis!): Both linearly independent AND spans all of ℝ²!",
              });
            } else {
              msg.className = "pc-msg bad";
              msg.textContent = L({
                tr: "Taban bozuldu! İki vektör aynı doğruya düştü (bağımlı) → germe 1B doğruya çöktü.",
                en: "Basis broken! The two vectors aligned (dependent) → span collapsed to a 1D line.",
              });
            }
          } else {
            const sol = indep2 ? solveLinear([[s.v1[0], s.v2[0]], [s.v1[1], s.v2[1]]], s.v3) : null;
            const p1 = sol ? vScale(s.v1, sol[0]) : null;
            plot.draw({
              x: [-4, 4.5], y: [-4, 4.5], equalAspect: true, xLabel: "x", yLabel: "y",
              basisGrid: indep2 ? { b1: s.v1, b2: s.v2, color: COLORS.c1, range: 5 } : undefined,
              segments: p1 ? [
                { from: [0, 0], to: p1, color: COLORS.c1, dash: [4, 3], width: 2 },
                { from: p1, to: s.v3, color: COLORS.c3, dash: [4, 3], width: 2 },
              ] : [],
              vectors: [
                { to: s.v1, color: COLORS.c1, width: 2.6, label: "v₁" },
                { to: s.v2, color: COLORS.c3, width: 2.6, label: "v₂" },
                { to: s.v3, color: COLORS.c4, width: 2.8, label: "v₃" },
              ],
              handles: [
                { id: "v1", x: s.v1[0], y: s.v1[1], color: COLORS.c1, onDrag: (x, y) => { s.v1 = [x, y]; draw(); } },
                { id: "v2", x: s.v2[0], y: s.v2[1], color: COLORS.c3, onDrag: (x, y) => { s.v2 = [x, y]; draw(); } },
                { id: "v3", x: s.v3[0], y: s.v3[1], color: COLORS.c4, onDrag: (x, y) => { s.v3 = [x, y]; draw(); } },
              ],
            });
            calc.textContent = sol
              ? `\\(\\mathbf{v}_3 = ${tx(sol[0], 2)}\\,\\mathbf{v}_1 ${txs(sol[1], 2)}\\,\\mathbf{v}_2 \\implies \\mathbf{v}_3\\ \\text{${L({ tr: "fazlalık!", en: "is redundant!" })}}\\)`
              : `\\(\\mathbf{v}_1, \\mathbf{v}_2\\ \\text{${L({ tr: "zaten bağımlı!", en: "already dependent!" })}}\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "FAZLA (Taban değil!): ℝ²'yi geriyor ama 3 vektör her zaman bağımlıdır — v₃ gereksiz!",
              en: "TOO MANY (Not a basis!): Spans ℝ², but 3 vectors in ℝ² are always dependent — v₃ is redundant!",
            });
          }
        };

        ctl.append(
          segmented(
            [
              [1, { tr: "1 Vektör (Eksik)", en: "1 Vector (Too Few)" }],
              [2, { tr: "2 Vektör (Tam!)", en: "2 Vectors (Just Right!)" }],
              [3, { tr: "3 Vektör (Fazla)", en: "3 Vectors (Too Many)" }],
            ],
            s.count,
            (v) => { s.count = Number(v); draw(); },
          ),
        );
        draw();
      },
    },
    {
      id: "bd-grid",
      mathId: "m-bd-change",
      title: { tr: "Özel Bir Tabanda Koordinatlar: Eğik Izgarayı Okumak", en: "Coordinates in a Custom Basis: Reading a Slanted Grid" },
      body: [
        {
          tr: R`Bir ok (\(\mathbf{x}\)) uzayda fiziksel olarak hiç kıpırdamaz; ama ona hangi eksen ızgarasından baktığımıza göre sayısal etiketi değişir! Sembolleri sesli okuyalım: \([\mathbf{x}]_{\mathcal{E}}\) standart eksenlerdeki koordinatlar, \([\mathbf{x}]_{\mathcal{B}} = \begin{bmatrix} c_1 \\ c_2 \end{bmatrix}\) ise "\(\mathbf{x}\)'in \(\mathcal{B} = \{\mathbf{b}_1, \mathbf{b}_2\}\) tabanındaki koordinatları" demektir. Sütunları \(\mathbf{b}_1, \mathbf{b}_2\) olan \(P\) matrisi bizi \(\mathcal{B}\)'den standarta taşır:`,
          en: R`A physical arrow \(\mathbf{x}\) never moves, yet its numeric label changes whenever you switch coordinate grids! Read the symbols aloud: \([\mathbf{x}]_{\mathcal{E}}\) means standard coordinates, while \([\mathbf{x}]_{\mathcal{B}} = \begin{bmatrix} c_1 \\ c_2 \end{bmatrix}\) reads "the coordinates of \(\mathbf{x}\) in basis \(\mathcal{B} = \{\mathbf{b}_1, \mathbf{b}_2\}\)". Putting \(\mathbf{b}_1, \mathbf{b}_2\) as the columns of \(P\) converts \(\mathcal{B}\)-coordinates to standard ones:`,
        },
        { eq: R`\mathbf{x} = c_1\mathbf{b}_1 + c_2\mathbf{b}_2 = \underbrace{\big[\mathbf{b}_1\ \ \mathbf{b}_2\big]}_{P}\,[\mathbf{x}]_{\mathcal{B}} \quad\Longleftrightarrow\quad [\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x}` },
        {
          analogy: {
            title: { tr: "Eğik caddelerde hazine tarifi", en: "Treasure directions along slanted avenues" },
            text: {
              tr: R`Standart harita "4 blok Doğu, 5 blok Kuzey" derken, eğik bulvarlı bir semtteki harita "Bulvar \(\mathbf{b}_1\) boyunca 1 blok, Cadde \(\mathbf{b}_2\) boyunca 2 blok git!" diyebilir. İkisi de <b>tam aynı kafeye</b> çıkar; sadece adım sayıları \((4, 5)\) yerine \((1, 2)\) olarak yazılmıştır!`,
              en: R`A standard map says "4 blocks East, 5 blocks North", while a slanted-street neighborhood map says "Walk 1 block along Avenue \(\mathbf{b}_1\), then 2 blocks along Boulevard \(\mathbf{b}_2\)!" Both land on the <b>exact same spot</b> — only the step counts change from \((4, 5)\) to \((1, 2)\)!`,
            },
          },
        },
        {
          example: {
            title: { tr: "Eğik bir tabanda [x]_ℬ koordinatlarını hesaplama", en: "Computing [x]_ℬ in a slanted basis" },
            problem: {
              tr: R`Taban \(\mathcal{B} = \{\mathbf{b}_1 = (2, 1),\ \mathbf{b}_2 = (1, 2)\}\) olsun. Standart koordinatları \(\mathbf{x} = (4, 5)\) olan vektörün \(\mathcal{B}\)-koordinatları \([\mathbf{x}]_{\mathcal{B}}\) nedir?`,
              en: R`Let \(\mathcal{B} = \{\mathbf{b}_1 = (2, 1),\ \mathbf{b}_2 = (1, 2)\}\). Find the \(\mathcal{B}\)-coordinates \([\mathbf{x}]_{\mathcal{B}}\) of \(\mathbf{x} = (4, 5)\).`,
            },
            steps: [
              {
                expr: R`P = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}, \qquad \det(P) = 2\cdot 2 - 1\cdot 1 = 3`,
                note: { tr: R`Taban vektörlerini <b>sütunlar</b> hâlinde \(P\) matrisine yazarız ve determinantı buluruz.`, en: R`Place the basis vectors as the <b>columns</b> of \(P\) and compute \(\det(P)\).` },
              },
              {
                expr: R`P^{-1} = \frac{1}{3}\begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix}`,
                note: { tr: R`\(2 \times 2\) ters matris formülüyle \(P^{-1}\)'i yazarız (köşegen yer değiştirir, diğer ikisinin işareti döner).`, en: R`Invert \(P\) via the \(2 \times 2\) inverse formula (swap diagonal, negate off-diagonal, divide by \(\det\)).` },
              },
              {
                expr: R`[\mathbf{x}]_{\mathcal{B}} = P^{-1}\begin{bmatrix} 4 \\ 5 \end{bmatrix} = \frac{1}{3}\begin{bmatrix} 2(4) - 1(5) \\ -1(4) + 2(5) \end{bmatrix} = \frac{1}{3}\begin{bmatrix} 3 \\ 6 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}`,
                note: { tr: R`Sağlama: \(1\cdot(2, 1) + 2\cdot(1, 2) = (2 + 2,\ 1 + 4) = (4, 5)\) — kusursuz!`, en: R`Check: \(1\cdot(2, 1) + 2\cdot(1, 2) = (2 + 2,\ 1 + 4) = (4, 5)\) — exact match!` },
              },
            ],
            answer: { tr: R`\([\mathbf{x}]_{\mathcal{B}} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\) (yani \(\mathbf{x} = 1\,\mathbf{b}_1 + 2\,\mathbf{b}_2\)).`, en: R`\([\mathbf{x}]_{\mathcal{B}} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\) (meaning \(\mathbf{x} = 1\,\mathbf{b}_1 + 2\,\mathbf{b}_2\)).` },
          },
        },
        {
          pitfall: {
            title: { tr: "En sık karışıklık: P ile mi çarpacağım, P⁻¹ ile mi?", en: "Most common mix-up: Multiply by P or by P⁻¹?" },
            text: {
              tr: R`Ezberlemeye çalışmayın — 2 saniyelik testi kullanın! \(\mathcal{B}\) tabanında \(\mathbf{b}_1\)'in kendisinin koordinatı \(\begin{bmatrix}1\\0\end{bmatrix}\)'dır. \(P\begin{bmatrix}1\\0\end{bmatrix}\) hesabı 1. sütunu yani \(\mathbf{b}_1\)'i (standart koordinatları!) verir. Demek ki <b>\(P\): \(\mathcal{B} \to \text{Standart}\)</b>, <b>\(P^{-1}\): \(\text{Standart} \to \mathcal{B}\)</b> yönünde çalışır!`,
              en: R`Never memorize blindly — use the 2-second test! In basis \(\mathcal{B}\), the vector \(\mathbf{b}_1\) itself has coordinates \(\begin{bmatrix}1\\0\end{bmatrix}\). Multiplying \(P\begin{bmatrix}1\\0\end{bmatrix}\) picks column 1, which is \(\mathbf{b}_1\) in standard coordinates! Therefore <b>\(P\): \(\mathcal{B} \to \text{Standard}\)</b>, and <b>\(P^{-1}\): \(\text{Standard} \to \mathcal{B}\)</b>!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"Örnek (4, 5)"</b> butonuna tıklayın ve az önceki çözümlü örneğin eğik ızgarada gerçekten 1 mavi + 2 yeşil kutucuk olduğunu gözünüzle sayın!`, en: R`Click <b>"Example (4, 5)"</b> and count the slanted tiles with your own eyes: 1 blue step + 2 green steps lands directly on \((4, 5)\)!` },
            { tr: R`Turuncu \(\mathbf{x}\) ucunu tam mavi \(\mathbf{b}_1\) ucunun üzerine sürükleyin: \([\mathbf{x}]_{\mathcal{B}}\)'nin anında \(\begin{bmatrix}1\\0\end{bmatrix}\) olduğunu görün.`, en: R`Drag orange \(\mathbf{x}\) directly onto the tip of blue \(\mathbf{b}_1\): watch \([\mathbf{x}]_{\mathcal{B}}\) snap straight to \(\begin{bmatrix}1\\0\end{bmatrix}\).` },
            { tr: R`<b>"Dik 45°"</b> butonuna tıklayın: eğik ızgaranın tertemiz döndürülmüş bir kare ızgaraya dönüştüğünü ve \(\det(P) = 1\) olduğunu fark edin.`, en: R`Click <b>"Rotated 45°"</b>: watch the slanted mesh turn into a crisp rotated square grid with \(\det(P) = 1\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.grid ??= { b1: [1.5, 0.5], b2: [-0.5, 1.5], x: [2.5, 2.5] });
        const presets = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(presets, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 300,
          interactive: true,
          hint: L({ tr: "b₁, b₂ ve turuncu x uçlarını sürükleyin", en: "Drag tips of b₁, b₂, and orange x" }),
        });

        const draw = () => {
          const P = [[s.b1[0], s.b2[0]], [s.b1[1], s.b2[1]]];
          const d = det2(P);
          const Pinv = Math.abs(d) > 0.08 ? inv2(P) : null;
          const xB = Pinv ? matVec(Pinv, s.x) : null;
          const p1 = xB ? vScale(s.b1, xB[0]) : null;
          plot.draw({
            x: [-4, 5.5],
            y: [-3.5, 5.5],
            equalAspect: true,
            xLabel: "e₁",
            yLabel: "e₂",
            basisGrid: Pinv ? { b1: s.b1, b2: s.b2, color: COLORS.c1, range: 6 } : undefined,
            segments: p1
              ? [
                  { from: [0, 0], to: p1, color: COLORS.c1, dash: [4, 3], width: 2.2 },
                  { from: p1, to: s.x, color: COLORS.c3, dash: [4, 3], width: 2.2 },
                ]
              : [],
            vectors: [
              { to: s.b1, color: COLORS.c1, label: "b₁" },
              { to: s.b2, color: COLORS.c3, label: "b₂" },
              { to: s.x, color: COLORS.c2, width: 3, label: "x" },
            ],
            handles: [
              { id: "b1", x: s.b1[0], y: s.b1[1], color: COLORS.c1, onDrag: (x, y) => { s.b1 = [x, y]; draw(); } },
              { id: "b2", x: s.b2[0], y: s.b2[1], color: COLORS.c3, onDrag: (x, y) => { s.b2 = [x, y]; draw(); } },
              { id: "x", x: s.x[0], y: s.x[1], color: COLORS.c2, onDrag: (x, y) => { s.x = [x, y]; draw(); } },
            ],
          });
          if (xB) {
            calc.textContent = `\\([\\mathbf{x}]_{\\mathcal{E}} = \\begin{bmatrix}${tx(s.x[0], 2)}\\\\${tx(s.x[1], 2)}\\end{bmatrix},\\quad P = ${matToTex(P)},\\quad [\\mathbf{x}]_{\\mathcal{B}} = P^{-1}\\mathbf{x} = \\begin{bmatrix}${tx(xB[0], 2)}\\\\${tx(xB[1], 2)}\\end{bmatrix}\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Eğik yolda okuma: x = (${ns(xB[0], 2)})·b₁ + (${ns(xB[1], 2)})·b₂  (det P = ${ns(d, 2)} ≠ 0).`,
              en: `Reading the slanted path: x = (${ns(xB[0], 2)})·b₁ + (${ns(xB[1], 2)})·b₂  (det P = ${ns(d, 2)} ≠ 0).`,
            });
          } else {
            calc.textContent = `\\(\\det(P) \\approx 0 \\implies \\{\\mathbf{b}_1, \\mathbf{b}_2\\}\\ \\text{${L({ tr: "taban değildir!", en: "is NOT a basis!" })}}\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "b₁ ve b₂ aynı doğruya düştü! P tersinir değil, benzersiz koordinat tanımlanamaz.",
              en: "b₁ and b₂ collapsed onto one line! P is not invertible, so unique coordinates fail.",
            });
          }
        };

        const mkBtn = (label, b1, b2, x) => {
          const bt = h("button", { type: "button", class: "btn small", text: L(label) });
          bt.addEventListener("click", () => { s.b1 = [...b1]; s.b2 = [...b2]; if (x) s.x = [...x]; draw(); });
          return bt;
        };
        presets.append(
          mkBtn({ tr: "Örnek (4, 5)", en: "Example (4, 5)" }, [2, 1], [1, 2], [4, 5]),
          mkBtn({ tr: "Eğik Taban", en: "Slanted Basis" }, [1.5, 0.5], [-0.5, 1.5], [2.5, 2.5]),
          mkBtn({ tr: "Dik 45°", en: "Rotated 45°" }, [0.707, 0.707], [-0.707, 0.707], [2.12, 0.71]),
          mkBtn({ tr: "Standart", en: "Standard" }, [1, 0], [0, 1], [3, 2]),
        );
        draw();
      },
    },
    {
      id: "bd-rank-nullity",
      mathId: "m-bd-rn",
      title: { tr: "Rank–Sıfırlık Teoremi: Boyut Korunumu", en: "Rank–Nullity Theorem: Conservation of Dimension" },
      body: [
        {
          tr: R`Bir \(m \times n\) matris \(A\), girdi uzayı \(\mathbb{R}^n\)'den çıktı uzayı \(\mathbb{R}^m\)'ye giden bir makinedir. Girdideki \(n\) boyutun her birine yalnızca iki şey olabilir: ya hayatta kalıp çıktı uzayı \(\operatorname{Col}(A)\)'da yeni bir yön yaratır (sayısı = <b>[[rank|\(\operatorname{rank}(A)\)]]</b>), ya da sıfıra ezilip [[kernel-image|çekirdek]] \(\ker(A)\)'nın içine gider (sayısı = <b>\(\operatorname{nullity}(A) = \dim\ker(A)\)</b>). Hiçbir boyut yoktan var olmaz, yok olmaz:`,
          en: R`An \(m \times n\) matrix \(A\) is a machine taking inputs in \(\mathbb{R}^n\) to outputs in \(\mathbb{R}^m\). Every one of the \(n\) input dimensions meets one of two fates: either it survives into the output column space \(\operatorname{Col}(A)\) (counted by <b>[[rank|\(\operatorname{rank}(A)\)]]</b>), or it gets crushed to zero in the [[kernel-image|kernel]] \(\ker(A)\) (counted by <b>\(\operatorname{nullity}(A) = \dim\ker(A)\)</b>). Dimension is strictly conserved:`,
        },
        {
          eq: {
            tr: R`\underbrace{\dim\operatorname{Col}(A)}_{\operatorname{rank}(A)} + \underbrace{\dim\ker(A)}_{\operatorname{nullity}(A)} = n \quad (\text{sütun sayısı})`,
            en: R`\underbrace{\dim\operatorname{Col}(A)}_{\operatorname{rank}(A)} + \underbrace{\dim\ker(A)}_{\operatorname{nullity}(A)} = n \quad (\text{\# of columns})`,
          },
        },
        {
          analogy: {
            title: { tr: "El feneri gölgesi: 3B nesne → 2B gölge + 1B ezilen ışın", en: "Flashlight shadow: 3D object → 2D shadow + 1D squashed ray" },
            text: {
              tr: R`Üç boyutlu bir odayı (\(n = 3\)) duvardaki iki boyutlu bir gölgeye düşürdüğünüzü düşünün. Duvarda 2 boyut hayatta kalır (\(\operatorname{rank} = 2\)), ışığın geldiği 1 derinlik yönü ise tek bir noktaya ezilir (\(\dim\ker = 1\)). Toplam: \(2 + 1 = 3\)! Bir makine ne kadar çok boyutu sıfıra eziyorsa, çıktısının boyutu o kadar küçülür.`,
              en: R`Project a 3D room (\(n = 3\)) onto a flat 2D wall shadow. Two dimensions survive on the wall (\(\operatorname{rank} = 2\)), while the 1 depth direction pointing along the light beam collapses to a point (\(\dim\ker = 1\)). Total: \(2 + 1 = 3\)! Every dimension lost to the kernel reduces the output dimension by exactly one.`,
            },
          },
        },
        {
          example: {
            title: { tr: "2 × 3 bir matriste rank, çekirdek tabanı ve Rank–Sıfırlık kontrolü", en: "Finding rank, kernel basis & verifying Rank–Nullity on a 2 × 3 matrix" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \end{bmatrix}\) matrisi için \(\operatorname{rank}(A)\), \(\dim\ker(A)\) ve \(\ker(A)\)'nın bir tabanını bulun.`,
              en: R`For \(A = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \end{bmatrix}\), find \(\operatorname{rank}(A)\), \(\dim\ker(A)\), and a basis for \(\ker(A)\).`,
            },
            steps: [
              {
                expr: R`R_2 \leftarrow R_2 - 2R_1 \implies \begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 0 \end{bmatrix}`,
                note: { tr: R`İkinci satır birincinin tam 2 katı olduğu için yok olur! Yalnızca <b>1 pivot</b> (1. sütunda) kaldı → \(\operatorname{rank}(A) = 1\).`, en: R`Row 2 is twice Row 1 and vanishes! Only <b>1 pivot</b> remains (column 1) → \(\operatorname{rank}(A) = 1\).` },
              },
              {
                expr: {
                  tr: R`x_1 + 2x_2 + 3x_3 = 0 \implies x_1 = -2s - 3t \quad (x_2 = s,\ x_3 = t\text{ serbest})`,
                  en: R`x_1 + 2x_2 + 3x_3 = 0 \implies x_1 = -2s - 3t \quad (x_2 = s,\ x_3 = t\text{ free})`,
                },
                note: { tr: R`Pivot olmayan 2. ve 3. sütunlar serbest değişken olur (\(s, t \in \mathbb{R}\)).`, en: R`Non-pivot columns 2 and 3 become free variables (\(s, t \in \mathbb{R}\)).` },
              },
              {
                expr: R`\mathbf{x} = s\begin{bmatrix}-2\\1\\0\end{bmatrix} + t\begin{bmatrix}-3\\0\\1\end{bmatrix} \implies \dim\ker(A) = 2`,
                note: { tr: R`Çekirdek 2 bağımsız vektör tarafından geriliyor! Rank–Sıfırlık kontrolü: \(1 + 2 = 3 = n\) (sütun sayısı) ✓!`, en: R`Two independent vectors span \(\ker(A)\)! Rank–Nullity check: \(1 + 2 = 3 = n\) (columns) ✓!` },
              },
            ],
            answer: { tr: R`\(\operatorname{rank}(A) = 1\), \(\dim\ker(A) = 2\), \(\ker(A)\) tabanı \(\{(-2, 1, 0)^T,\ (-3, 0, 1)^T\}\).`, en: R`\(\operatorname{rank}(A) = 1\), \(\dim\ker(A) = 2\), basis of \(\ker(A)\) is \(\{(-2, 1, 0)^T,\ (-3, 0, 1)^T\}\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Klasik sınav hatası: n yerine satır sayısı m'yi yazmak!", en: "Classic exam error: Plugging in rows m instead of columns n!" },
            text: {
              tr: R`\(4 \times 7\) bir matrisin girdisi \(\mathbf{x} \in \mathbb{R}^7\) vektörüdür (7 bileşen!). Dolayısıyla \(\ker(A) \subseteq \mathbb{R}^7\) olur ve \(\operatorname{rank}(A) + \dim\ker(A) = \mathbf{7}\) (asla 4 değil!). Unutmayın: \(A\mathbf{x}\) çarpımında \(\mathbf{x}\)'in uzunluğu her zaman <b>sütun sayısı \(n\)</b>'dir.`,
              en: R`A \(4 \times 7\) matrix takes input vectors \(\mathbf{x} \in \mathbb{R}^7\) (7 entries!). Thus \(\ker(A) \subseteq \mathbb{R}^7\) and \(\operatorname{rank}(A) + \dim\ker(A) = \mathbf{7}\) (NEVER 4!). Remember: in \(A\mathbf{x}\), the length of \(\mathbf{x}\) always equals the number of <b>columns \(n\)</b>.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"İzdüşüm (1+1)"</b> modunda yeşil \(\mathbf{x}\) ucunu sürükleyip turuncu kesikli \(\ker(A)\) doğrusunun tam üzerine getirin: çıktı \(A\mathbf{x}\)'in bir anda <b>\((0, 0)\)'a ezildiğini</b> görün!`, en: R`In <b>"Projection (1+1)"</b>, drag green \(\mathbf{x}\) directly onto the dashed orange \(\ker(A)\) line: watch output \(A\mathbf{x}\) collapse to <b>\((0, 0)\)</b>!` },
            { tr: R`\(\mathbf{x}\)'i düzlemde dilediğiniz yere sürükleyin: çıktı \(A\mathbf{x}\) (koyu mavi ok) ne yaparsanız yapın mavi \(\operatorname{Col}(A)\) doğrusundan asla dışarı çıkamaz!`, en: R`Drag \(\mathbf{x}\) anywhere in the plane: no matter where you go, output \(A\mathbf{x}\) (deep blue arrow) is trapped forever on the blue \(\operatorname{Col}(A)\) line!` },
            { tr: R`<b>"Tam Rank (2+0)"</b> ve <b>"Sıfır (0+2)"</b> arasında geçiş yapıp \(r + \dim\ker = 2\) toplamının hiç değişmediğini doğrulayın.`, en: R`Switch between <b>"Full Rank (2+0)"</b> and <b>"Zero Map (0+2)"</b> and verify \(r + \dim\ker = 2\) stays conserved.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.rn ??= { mode: "proj", x: [1.5, 1.5] });
        const modes = {
          full: { label: { tr: "Tam rank (2+0)", en: "Full rank (2+0)" }, A: [[1.2, 0.4], [0, 1.1]], r: 2, nul: 0 },
          proj: { label: { tr: "İzdüşüm (1+1)", en: "Projection (1+1)" }, A: [[1, 1], [0.5, 0.5]], r: 1, nul: 1 },
          squash: { label: { tr: "Yatay ezme (1+1)", en: "Horizontal squash (1+1)" }, A: [[1, 0], [0, 0]], r: 1, nul: 1 },
          zero: { label: { tr: "Sıfır (0+2)", en: "Zero map (0+2)" }, A: [[0, 0], [0, 0]], r: 0, nul: 2 },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 270,
          interactive: true,
          hint: L({ tr: "Girdi x ucunu sürükleyip çıktı Ax'i izleyin", en: "Drag input x and watch output Ax" }),
        });

        const draw = () => {
          const m = modes[s.mode];
          const Ax = matVec(m.A, s.x);
          const lines = [];
          if (s.mode === "proj") {
            lines.push(
              { a: 1, b: -2, c: 0, color: COLORS.c1, width: 2.8, label: "Col(A)" },
              { a: 1, b: 1, c: 0, color: COLORS.c2, width: 2.4, dash: [6, 4], label: "ker(A)" },
            );
          } else if (s.mode === "squash") {
            lines.push(
              { a: 0, b: 1, c: 0, color: COLORS.c1, width: 2.8, label: L({ tr: "Col(A): x-eks.", en: "Col(A): x-axis" }) },
              { a: 1, b: 0, c: 0, color: COLORS.c2, width: 2.4, dash: [6, 4], label: L({ tr: "ker(A): y-eks.", en: "ker(A): y-axis" }) },
            );
          }
          const zeroOut = vNorm(Ax) < 0.14;
          plot.draw({
            x: [-3.5, 3.5],
            y: [-3.5, 3.5],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            basisGrid: s.mode === "full" ? { b1: [1.2, 0], b2: [0.4, 1.1], color: COLORS.c1, range: 4 } : undefined,
            lines,
            points: [
              ...(s.mode === "full" ? [{ x: 0, y: 0, color: COLORS.c2, r: 5.5, label: "ker(A)={0}" }] : []),
              ...(s.mode === "zero" ? [{ x: 0, y: 0, color: COLORS.c1, r: 5.5, label: "Col(A)={0}" }] : []),
              { x: Ax[0], y: Ax[1], color: zeroOut ? COLORS.bad : COLORS.c1, r: 5.5, ring: true },
            ],
            vectors: [
              { to: s.x, color: COLORS.c3, width: 2.4, label: "x" },
              { to: Ax, color: COLORS.c1, width: 3.1, label: "Ax" },
            ],
            handles: [
              { id: "x", x: s.x[0], y: s.x[1], color: COLORS.c3, onDrag: (x, y) => { s.x = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(A = ${matToTex(m.A)},\\quad A\\mathbf{x} = \\begin{bmatrix}${tx(Ax[0], 2)}\\\\${tx(Ax[1], 2)}\\end{bmatrix},\\quad \\operatorname{rank}(A)+\\dim\\ker(A) = ${m.r} + ${m.nul} = 2\\)`;
          if (zeroOut) {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "Ax ≈ (0, 0)! Şu an x vektörü çekirdek ker(A) içinde olduğu için sıfıra ezildi!",
              en: "Ax ≈ (0, 0)! Right now x lies in ker(A), so the matrix crushes it to zero!",
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `Girdi x = (${ns(s.x[0], 2)}, ${ns(s.x[1], 2)}) → Çıktı Ax = (${ns(Ax[0], 2)}, ${ns(Ax[1], 2)}) daima Col(A) içindedir.`,
              en: `Input x = (${ns(s.x[0], 2)}, ${ns(s.x[1], 2)}) → Output Ax = (${ns(Ax[0], 2)}, ${ns(Ax[1], 2)}) always lands in Col(A).`,
            });
          }
        };

        ctl.append(segmented(Object.entries(modes).map(([k, v]) => [k, v.label]), s.mode, (v) => { s.mode = v; draw(); }));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Taban Değişimi ve Benzer Matrisler Stüdyosu", en: "Change-of-Basis & Similar Matrices Studio" },
    sub: {
      tr: R`Hazır tabanlar arasında geçiş yapın veya \(\mathbf{b}_1, \mathbf{b}_2, \mathbf{x}\) uçlarını doğrudan sürükleyin; hem koordinat dönüşümünü \([\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x}\) hem de doğrusal dönüşüm matrisi \([T]_{\mathcal{B}} = P^{-1}[T]_{\mathcal{E}}P\)'yi canlı gözlemleyin.`,
      en: R`Switch presets or drag \(\mathbf{b}_1, \mathbf{b}_2, \mathbf{x}\) directly to inspect both coordinate conversion \([\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x}\) and matrix similarity \([T]_{\mathcal{B}} = P^{-1}[T]_{\mathcal{E}}P\) live.`,
    },
    experiments: [
      { tr: R`<b>"Standart"</b> ve <b>"Dönük 45°"</b> arasında geçiş yapın: \(\mathbf{x} = (2, 1)\) okunun koordinatları değişse de uzunluğu \(\|\mathbf{x}\| = \sqrt{5} \approx 2{,}24\) ve \(\|[\mathbf{x}]_{\mathcal{B}}\|\) birbirine <b>birebir eşit</b> kalır (ortonormal taban uzunlukları korur!).`, en: R`Toggle between <b>"Standard"</b> and <b>"Rotated 45°"</b>: the coordinates of \(\mathbf{x} = (2, 1)\) change, yet \(\|[\mathbf{x}]_{\mathcal{B}}\| = \|\mathbf{x}\| \approx 2.24\) stays <b>identical</b> (orthonormal bases preserve length!).` },
      { tr: R`<b>"Köşegenleştirici Taban"</b> butonuna tıklayın: \(A = \begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix}\) dönüşümünün yeni tabandaki matrisi \([T]_{\mathcal{B}} = P^{-1}AP\)'nin tertemiz köşegen \(\begin{bmatrix}3 & 0 \\ 0 & -1\end{bmatrix}\) olduğuna dikkat edin!`, en: R`Click <b>"Diagonalizing Basis"</b>: watch the matrix of \(A = \begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix}\) transform into the clean diagonal matrix \([T]_{\mathcal{B}} = P^{-1}AP = \begin{bmatrix}3 & 0 \\ 0 & -1\end{bmatrix}\)!` },
      { tr: R`<b>"Eğik Taban"</b> seçip \(\mathbf{x}\)'i sürükleyin; \(\det(P) = 3\) iken her yeni ızgara karesinin alanının standart karenin 3 katı olduğunu gözlemleyin.`, en: R`Pick <b>"Slanted Basis"</b> and drag \(\mathbf{x}\); with \(\det(P) = 3\), every slanted grid parallelogram has 3 times the area of a unit square.` },
      { tr: R`<b>"Yakın Paralel (Kötü)"</b> butonuna tıklayın: \(\det(P)\) çok küçüldüğünde \(\mathbf{x}\)'i azıcık oynatmanın bile \([\mathbf{x}]_{\mathcal{B}}\) koordinatlarında dev sıçramalara yol açtığını görün!`, en: R`Click <b>"Nearly Parallel (Ill-Cond.)"</b>: when \(\det(P)\) is tiny, nudging \(\mathbf{x}\) slightly makes \([\mathbf{x}]_{\mathcal{B}}\) swing wildly!` },
    ],
    build(host, state) {
      const s = (state.pg ??= { b1: [0.707, 0.707], b2: [-0.707, 0.707], x: [2, 1], preset: "rot" });
      const Tmat = [[1, 2], [2, 1]];
      const presets = {
        std: { label: { tr: "Standart", en: "Standard" }, b1: [1, 0], b2: [0, 1] },
        rot: { label: { tr: "Dönük 45°", en: "Rotated 45°" }, b1: [0.707, 0.707], b2: [-0.707, 0.707] },
        diag: { label: { tr: "Köşegenleştirici", en: "Diagonalizing" }, b1: [1, 1], b2: [1, -1] },
        skew: { label: { tr: "Eğik Taban", en: "Slanted Basis" }, b1: [2, 1], b2: [1, 2] },
        bad: { label: { tr: "Yakın Paralel", en: "Nearly Parallel" }, b1: [2, 1], b2: [1.9, 1.15] },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, {
        height: 400,
        interactive: true,
        hint: L({ tr: "x, b₁ veya b₂ uçlarını sürükleyin", en: "Drag tips of x, b₁, or b₂" }),
      });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc1 = h("div", { class: "pc-calc" });
      const calc2 = h("div", { class: "pc-calc" });
      side.append(ctl, tiles, calc1, calc2);

      const draw = () => {
        const P = [[s.b1[0], s.b2[0]], [s.b1[1], s.b2[1]]];
        const d = det2(P);
        const Pinv = Math.abs(d) > 0.05 ? inv2(P) : null;
        const xB = Pinv ? matVec(Pinv, s.x) : null;
        const TB = Pinv ? matMul(matMul(Pinv, Tmat), P) : null;
        const p1 = xB ? vScale(s.b1, xB[0]) : null;
        plot.draw({
          x: [-4.5, 4.5],
          y: [-4.5, 4.5],
          equalAspect: true,
          xLabel: "x",
          yLabel: "y",
          basisGrid: Pinv ? { b1: s.b1, b2: s.b2, color: COLORS.c1, range: 6 } : undefined,
          segments: p1
            ? [
                { from: [0, 0], to: p1, color: COLORS.c1, dash: [4, 3], width: 2 },
                { from: p1, to: s.x, color: COLORS.c3, dash: [4, 3], width: 2 },
              ]
            : [],
          vectors: [
            { to: s.b1, color: COLORS.c1, label: "b₁" },
            { to: s.b2, color: COLORS.c3, label: "b₂" },
            { to: s.x, color: COLORS.c2, width: 3, label: "x" },
          ],
          handles: [
            { id: "b1", x: s.b1[0], y: s.b1[1], color: COLORS.c1, onDrag: (x, y) => { s.b1 = [x, y]; draw(); } },
            { id: "b2", x: s.b2[0], y: s.b2[1], color: COLORS.c3, onDrag: (x, y) => { s.b2 = [x, y]; draw(); } },
            { id: "x", x: s.x[0], y: s.x[1], color: COLORS.c2, onDrag: (x, y) => { s.x = [x, y]; draw(); } },
          ],
        });

        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "det(P)" }), h("span", { class: "pg-tile-value", text: ns(d, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "‖x‖" }), h("span", { class: "pg-tile-value", text: ns(vNorm(s.x), 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "‖[x]_ℬ‖" }), h("span", { class: "pg-tile-value", text: xB ? ns(vNorm(xB), 2) : "—" })),
        );
        if (Pinv && xB && TB) {
          calc1.textContent = `\\(P = ${matToTex(P)},\\quad P^{-1} = ${matToTex(Pinv)},\\quad [\\mathbf{x}]_{\\mathcal{B}} = \\begin{bmatrix}${tx(xB[0], 2)}\\\\${tx(xB[1], 2)}\\end{bmatrix}\\)`;
          calc2.textContent = `\\([T]_{\\mathcal{E}} = ${matToTex(Tmat)} \\;\\Longrightarrow\\; [T]_{\\mathcal{B}} = P^{-1}[T]_{\\mathcal{E}}P = ${matToTex(TB)}\\)`;
        } else {
          calc1.textContent = `\\(\\det(P) \\approx 0 \\implies P^{-1}\\ \\text{${L({ tr: "yok! (Bağımlı)", en: "does not exist! (Dependent)" })}}\\)`;
          calc2.textContent = "";
        }
      };

      ctl.append(
        segmented(
          Object.entries(presets).map(([k, v]) => [k, v.label]),
          s.preset,
          (v) => {
            s.preset = v;
            s.b1 = [...presets[v].b1];
            s.b2 = [...presets[v].b2];
            draw();
          },
        ),
      );
      draw();
    },
  },
  mathSections: [
    {
      id: "m-bd-dim",
      title: { tr: "Taban, Boyut Teoremi ve Klasik Standart Tabanlar", en: "Basis, Dimension Theorem & Standard Bases" },
      blocks: [
        {
          p: {
            tr: R`<b>Boyut Teoremi:</b> Bir vektör uzayı \(V\)'nin sonlu elemanlı bir tabanı varsa, \(V\)'nin diğer <b>tüm tabanları aynı sayıda eleman içerir</b>; bu ortak sayıya \(V\)'nin boyutu (\(\dim V\)) denir.`,
            en: R`<b>Dimension Theorem:</b> If a vector space \(V\) has a finite basis of \(n\) vectors, then <b>every basis of \(V\) contains exactly \(n\) vectors</b>. This invariant is the dimension \(\dim V\).`,
          },
        },
        {
          table: {
            head: [{ tr: "Vektör Uzayı", en: "Vector Space" }, { tr: "Standart Taban", en: "Standard Basis" }, { tr: "Boyut (dim)", en: "Dimension" }],
            rows: [
              [R`\(\mathbb{R}^n\)`, R`\(\{\mathbf{e}_1, \mathbf{e}_2, \dots, \mathbf{e}_n\}\)`, R`\(n\)`],
              [R`\(\mathcal{P}_n\)`, R`\(\{1,\ x,\ x^2, \dots, x^n\}\)`, R`\(n + 1\)`],
              [R`\(\mathbb{R}^{2 \times 2}\)`, R`\(\left\{\begin{bmatrix}1&0\\0&0\end{bmatrix}, \begin{bmatrix}0&1\\0&0\end{bmatrix}, \begin{bmatrix}0&0\\1&0\end{bmatrix}, \begin{bmatrix}0&0\\0&1\end{bmatrix}\right\}\)`, R`\(4\)`],
              [{ tr: R`Simetrik \(2 \times 2\) matrisler`, en: R`Symmetric \(2 \times 2\) matrices` }, R`\(\left\{\begin{bmatrix}1&0\\0&0\end{bmatrix}, \begin{bmatrix}0&0\\0&1\end{bmatrix}, \begin{bmatrix}0&1\\1&0\end{bmatrix}\right\}\)`, R`\(3\)`],
              [R`\(\{\mathbf{0}\}\)`, { tr: R`\(\varnothing\) (boş küme)`, en: R`\(\varnothing\) (empty set)` }, R`\(0\)`],
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Yarı-İş Kısayolu (Boyut Biliniyorsa!)", en: "Half-the-Work Shortcut (When dim V = n is Known!)" },
          text: {
            tr: R`Eğer \(\dim(V) = n\) olduğunu biliyorsanız ve elinizde tam \(n\) vektör varsa, taban olduğunu kanıtlamak için <b>yalnızca tek bir koşulu</b> kontrol etmek yeterlidir: bağımsızlarsa otomatik gererler; geriyorlarsa otomatik bağımsızdırlar!`,
            en: R`Whenever you already know \(\dim(V) = n\) and have exactly \(n\) vectors, you only need to check <b>ONE</b> condition: if they are linearly independent, they automatically span \(V\); if they span \(V\), they are automatically independent!`,
          },
        },
      ],
    },
    {
      id: "m-bd-change",
      title: { tr: "Koordinatların Tekliği ve Taban Değişim Formülleri", en: "Uniqueness of Coordinates & Change-of-Basis Formulas" },
      blocks: [
        {
          derive: {
            title: { tr: "İspat 1: Bir tabanda her vektörün koordinatları TEKTİR", en: "Proof 1: Coordinates in a basis are UNIQUE" },
            steps: [
              { tex: R`\mathbf{x} = \sum_{i=1}^n c_i \mathbf{b}_i = \sum_{i=1}^n d_i \mathbf{b}_i`, why: { tr: "Aynı x vektörünün ℬ tabanında iki farklı yazılışı olduğunu varsayalım.", en: "Suppose the same vector x has two different expansions in basis ℬ." } },
              { tex: R`\sum_{i=1}^n (c_i - d_i)\mathbf{b}_i = \mathbf{0}`, why: { tr: "İki eşitliği taraf tarafa çıkararak sıfıra eşitleriz.", en: "Subtract the two expansions to get a linear combination equal to 0." } },
              { tex: R`c_i - d_i = 0 \implies c_i = d_i \quad \forall\, i = 1, \dots, n`, why: { tr: "Taban vektörleri doğrusal bağımsız olduğundan sıfırı veren tek ağırlık grubu hepsinin 0 olmasıdır!", en: "Since the basis is linearly independent, every coefficient must vanish — so both recipes are identical!" } },
            ],
          },
        },
        {
          derive: {
            title: { tr: "İspat 2: Doğrusal dönüşüm matrisi neden [T]_ℬ = P⁻¹ [T]_ℰ P olur?", en: "Proof 2: Why a linear map changes as [T]_ℬ = P⁻¹ [T]_ℰ P" },
            steps: [
              { tex: R`[\mathbf{x}]_{\mathcal{E}} = P\,[\mathbf{x}]_{\mathcal{B}}, \qquad [T(\mathbf{x})]_{\mathcal{E}} = P\,[T(\mathbf{x})]_{\mathcal{B}}`, why: { tr: "P matrisi herhangi bir vektörü ℬ-koordinatlarından standart koordinatlara çevirir (hem girdi x hem çıktı T(x) için).", en: "P converts any vector from ℬ-coordinates to standard coordinates (both input x and output T(x))." } },
              { tex: R`[T(\mathbf{x})]_{\mathcal{E}} = [T]_{\mathcal{E}}\,[\mathbf{x}]_{\mathcal{E}} = [T]_{\mathcal{E}}\,P\,[\mathbf{x}]_{\mathcal{B}}`, why: { tr: "Standart tabanda T'yi uygulamak [T]_ℰ ile çarpmaktır.", en: "In standard coordinates, applying T means multiplying by [T]_ℰ." } },
              { tex: R`P\,[T(\mathbf{x})]_{\mathcal{B}} = [T]_{\mathcal{E}}\,P\,[\mathbf{x}]_{\mathcal{B}}`, why: { tr: "1. ve 2. adımdaki iki [T(x)]_ℰ ifadesini eşitleriz.", en: "Equate the two expressions for [T(x)]_ℰ." } },
              { tex: R`[T(\mathbf{x})]_{\mathcal{B}} = \underbrace{\big(P^{-1}\,[T]_{\mathcal{E}}\,P\big)}_{[T]_{\mathcal{B}}}\,[\mathbf{x}]_{\mathcal{B}}`, why: { tr: "Soldan P⁻¹ ile çarpınca ℬ-koordinatlarındaki dönüşüm matrisi çıkar: önce standarta git (P), T'yi uygula ([T]_ℰ), sonra ℬ'ye geri dön (P⁻¹)!", en: "Multiply on the left by P⁻¹: read right-to-left — convert to standard (P), apply T ([T]_ℰ), convert back to ℬ (P⁻¹)!" } },
            ],
          },
        },
        {
          example: {
            title: { tr: "Akıllı taban seçerek bir matrisi köşegenleştirme", en: "Diagonalizing a matrix by choosing a smart basis" },
            problem: {
              tr: R`Standart matrisi \([T]_{\mathcal{E}} = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}\) olan dönüşümün \(\mathcal{B} = \{(1, 1),\ (1, -1)\}\) tabanındaki matrisi \([T]_{\mathcal{B}}\)'yi hesaplayın.`,
              en: R`Compute \([T]_{\mathcal{B}}\) for \([T]_{\mathcal{E}} = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}\) in the basis \(\mathcal{B} = \{(1, 1),\ (1, -1)\}\).`,
            },
            steps: [
              { expr: R`P = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}, \qquad P^{-1} = \frac{1}{2}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}`, note: { tr: R`\(\det(P) = -1 - 1 = -2\) olduğundan \(P^{-1}\) hemen bulunur.`, en: R`With \(\det(P) = -2\), \(P^{-1}\) follows immediately.` } },
              { expr: R`[T]_{\mathcal{E}} P = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} = \begin{bmatrix} 3 & -1 \\ 3 & 1 \end{bmatrix}`, note: { tr: R`Önce \([T]_{\mathcal{E}} P\) çarpımını hesaplarız.`, en: R`Multiply \([T]_{\mathcal{E}} P\) first.` } },
              { expr: R`[T]_{\mathcal{B}} = P^{-1}[T]_{\mathcal{E}} P = \frac{1}{2}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} 3 & -1 \\ 3 & 1 \end{bmatrix} = \begin{bmatrix} 3 & 0 \\ 0 & -1 \end{bmatrix}`, note: { tr: R`Mükemmel! Bu tabanda dönüşüm sadece \(\mathbf{b}_1\)'i 3 kat uzatıyor ve \(\mathbf{b}_2\)'yi ters çeviriyor!`, en: R`Magic! In basis \(\mathcal{B}\), \(T\) simply stretches \(\mathbf{b}_1\) by \(3\) and flips \(\mathbf{b}_2\) by \(-1\)!` } },
            ],
            answer: { tr: R`\([T]_{\mathcal{B}} = \begin{bmatrix} 3 & 0 \\ 0 & -1 \end{bmatrix}\) (köşegen matris!).`, en: R`\([T]_{\mathcal{B}} = \begin{bmatrix} 3 & 0 \\ 0 & -1 \end{bmatrix}\) (a clean diagonal matrix!).` },
          },
        },
        {
          callout: "warn",
          title: { tr: "Çarpım sırasına dikkat: P⁻¹ A P ≠ P A P⁻¹!", en: "Watch the order: P⁻¹ A P ≠ P A P⁻¹!" },
          text: {
            tr: R`İşlem sağdan sola okunur: \(\mathbf{v}_{\mathcal{B}}\) girdiğine göre ilk değen matris \(\mathcal{B}\)'den standarta çeviren \(P\) olmalıdır, en soldaki ise standartan \(\mathcal{B}\)'ye geri döndüren \(P^{-1}\)!`,
            en: R`Read matrix products right-to-left: feeding \([\mathbf{x}]_{\mathcal{B}}\) hits \(P\) first (converting \(\mathcal{B} \to \mathcal{E}\)), then \(A\), then \(P^{-1}\) last (returning \(\mathcal{E} \to \mathcal{B}\))!`,
          },
        },
      ],
    },
    {
      id: "m-bd-rn",
      title: { tr: "Rank–Sıfırlık Teoremi ve Dört Temel Alt Uzay", en: "Rank–Nullity Theorem & Four Fundamental Subspaces" },
      blocks: [
        {
          derive: {
            title: { tr: "İspat 3: Rank–Sıfırlık Teoremi (RREF Pivot Sayımı ile)", en: "Proof 3: Rank–Nullity Theorem (via RREF Pivot Counting)" },
            steps: [
              { tex: R`A \in \mathbb{R}^{m \times n} \xrightarrow{\text{RREF}} R`, why: { tr: "A matrisini temel satır işlemleriyle RREF formuna indirgeriz; bu işlemler çekirdeği ker(A) ve sütun ilişkilerini hiç değiştirmez.", en: "Row-reduce A to RREF; row operations preserve both ker(A) and all column dependence relations." } },
              {
                tex: {
                  tr: R`\text{Pivot sütun sayısı} = r = \operatorname{rank}(A) = \dim\operatorname{Col}(A)`,
                  en: R`\#\text{ pivot columns} = r = \operatorname{rank}(A) = \dim\operatorname{Col}(A)`,
                },
                why: { tr: "A'nın pivotlara karşılık gelen r tane orijinal sütunu Col(A)'nın bir tabanını oluşturur.", en: "The r original columns of A in pivot positions form a basis of Col(A)." },
              },
              {
                tex: {
                  tr: R`\text{Serbest sütun sayısı} = n - r = \dim\ker(A)`,
                  en: R`\#\text{ free columns} = n - r = \dim\ker(A)`,
                },
                why: { tr: "Her serbest sütun Ax = 0 genel çözümünde bağımsız bir temel çözüm vektörü üretir.", en: "Each free column generates one independent basis vector for the solution space ker(A)." },
              },
              { tex: R`\operatorname{rank}(A) + \dim\ker(A) = r + (n - r) = n`, why: { tr: "Her sütun ya pivot ya da serbest olduğundan toplam daima sütun sayısı n'dir!", en: "Since every column is either a pivot column or a free column, their sum is always n!" } },
            ],
          },
        },
        {
          table: {
            head: [{ tr: "Alt Uzay", en: "Subspace" }, { tr: "Yaşadığı Uzay", en: "Lives in" }, { tr: "Boyut", en: "Dimension" }, { tr: "RREF'ten Taban Bulma", en: "Basis from RREF" }],
            rows: [
              [R`\(\operatorname{Col}(A)\)`, R`\(\mathbb{R}^m\)`, R`\(r\)`, { tr: R`Orijinal \(A\)'nın pivot sütunları`, en: R`Pivot columns of original \(A\)` }],
              [R`\(\ker(A)\)`, R`\(\mathbb{R}^n\)`, R`\(n - r\)`, { tr: R`\(R\mathbf{x} = \mathbf{0}\) serbest değişken çözümleri`, en: R`Free-variable solutions of \(R\mathbf{x} = \mathbf{0}\)` }],
              [R`\(\operatorname{Row}(A)\)`, R`\(\mathbb{R}^n\)`, R`\(r\)`, { tr: R`\(R\)'nin sıfırdan farklı satırları`, en: R`Nonzero rows of \(R\)` }],
              [R`\(\ker(A^T)\)`, R`\(\mathbb{R}^m\)`, R`\(m - r\)`, { tr: R`\(A^T\mathbf{y} = \mathbf{0}\) çözümleri`, en: R`Solutions of \(A^T\mathbf{y} = \mathbf{0}\)` }],
            ],
          },
        },
        {
          example: {
            title: { tr: "3 × 5 bir matrisin dört temel alt uzayının boyutları", en: "Dimensions of all four subspaces of a 3 × 5 matrix" },
            problem: {
              tr: R`Bir \(3 \times 5\) matris \(A\)'nın rankı \(\operatorname{rank}(A) = 2\) ise \(\operatorname{Col}(A),\ \ker(A),\ \operatorname{Row}(A)\) ve \(\ker(A^T)\) boyutları kaçtır?`,
              en: R`If a \(3 \times 5\) matrix \(A\) has \(\operatorname{rank}(A) = 2\), find the dimensions of \(\operatorname{Col}(A),\ \ker(A),\ \operatorname{Row}(A)\), and \(\ker(A^T)\).`,
            },
            steps: [
              { expr: R`m = 3,\quad n = 5,\quad r = 2`, note: { tr: R`Satır sayısı \(m = 3\), sütun sayısı \(n = 5\) ve rank \(r = 2\).`, en: R`Identify rows \(m = 3\), columns \(n = 5\), and rank \(r = 2\).` } },
              { expr: R`\dim\operatorname{Col}(A) = r = 2,\qquad \dim\operatorname{Row}(A) = r = 2`, note: { tr: R`Sütun rankı ve satır rankı her zaman eşittir!`, en: R`Column rank and row rank are always equal!` } },
              { expr: R`\dim\ker(A) = n - r = 5 - 2 = 3,\qquad \dim\ker(A^T) = m - r = 3 - 2 = 1`, note: { tr: R`Rank–Sıfırlık kuralını hem \(A\) (\(2+3=5\)) hem \(A^T\) (\(2+1=3\)) için uygularız.`, en: R`Apply Rank–Nullity to both \(A\) (\(2+3=5\)) and \(A^T\) (\(2+1=3\)).` } },
            ],
            answer: { tr: R`\(\dim\operatorname{Col}(A) = 2\), \(\dim\ker(A) = 3\), \(\dim\operatorname{Row}(A) = 2\), \(\dim\ker(A^T) = 1\).`, en: R`\(\dim\operatorname{Col}(A) = 2\), \(\dim\ker(A) = 3\), \(\dim\operatorname{Row}(A) = 2\), \(\dim\ker(A^T) = 1\).` },
          },
        },
        {
          callout: "tip",
          title: { tr: "Kare matrislerde (n × n) büyük eşdeğerlik", en: "Grand equivalence for square (n × n) matrices" },
          text: {
            tr: R`Kare bir \(n \times n\) matris \(A\) için şu 4 ifade birebir aynı anlama gelir: (1) \(A\) tersinirdir, (2) \(\det(A) \ne 0\), (3) \(\operatorname{rank}(A) = n\), (4) \(\ker(A) = \{\mathbf{0}\}\) (\(\dim\ker = 0\)).`,
            en: R`For a square \(n \times n\) matrix \(A\), these 4 statements are all equivalent: (1) \(A\) is invertible, (2) \(\det(A) \ne 0\), (3) \(\operatorname{rank}(A) = n\), (4) \(\ker(A) = \{\mathbf{0}\}\) (\(\dim\ker = 0\)).`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
