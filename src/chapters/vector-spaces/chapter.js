import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { createCanvas3D } from "../../engines/canvas3d.ts";
import { cross3, det2, det3, solveLinear, vAdd, vNorm, vScale, vSub } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, txs, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "vs-intro",
    title: { tr: "Vektör Uzayları, Alt Uzaylar, Germe ve Bağımsızlık", en: "Vector Spaces, Subspaces, Span & Independence" },
    paragraphs: [
      {
        tr: R`Lisede vektörleri sadece "oklar" olarak tanıdık. Oysa üniversite matematiğinde oklar buzdağının yalnızca görünen ucudur: polinomlar (\(\mathcal{P}_n\)), matrisler (\(\mathbb{R}^{m \times n}\)) ve sürekli fonksiyonlar (\(C([a, b])\)) aynı toplama ve sayıyla çarpma kurallarına uydukları için birer [[vector-space|vektör uzayıdır]]!`,
        en: R`You probably met vectors as geometric arrows. In university mathematics, arrows are just the tip of the iceberg: polynomials (\(\mathcal{P}_n\)), matrices (\(\mathbb{R}^{m \times n}\)), and continuous functions (\(C([a, b])\)) all obey the exact same addition and scaling rules, so they are all [[vector-space|vector spaces]]!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> herhangi bir kümenin ne zaman vektör uzayı veya [[subspace|alt uzay]] olduğunu 3 basit kuralla kontrol edecek, [[linear-combination|doğrusal bileşim]] ve [[span|germe (span)]] haritalarını çizecek ve [[linear-independence|doğrusal bağımsızlık]] ile gereksiz fazlalığı bir bakışta ayırt edeceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will test [[subspace|subspaces]] using the 3-rule closure check, visualize [[linear-combination|linear combinations]] and [[span|span]], and instantly distinguish [[linear-independence|linear independence]] from redundancy.`,
      },
    ],
    analogy: {
      title: { tr: "Hiç bilmeyenler için: Bir vektör uzayı = Güvenli karıştırma stüdyosu", en: "Zero-jargon intuition: A vector space = A safe mixing studio" },
      text: {
        tr: R`Bir müzik ekolayzırını (veya bir tarif mutfağını) düşünün. İki ses dalgasını üst üste ekleyebilir (<b>toplama</b>), herhangi bir sesin şiddetini 2 katına çıkarıp ya da ters çevirebilirsiniz (<b>skalerle çarpma</b>) ve her zaman bir "sessizlik" seviyesi vardır (<b>sıfır vektörü</b>). Ne kadar karıştırırsanız karıştırın elde ettiğiniz şey yine aynı türden bir ses dalgasıdır. İşte <b>kapalı ve kurallı her karıştırma evreni</b> bir vektör uzayıdır!`,
        en: R`Imagine an audio equalizer (or a smoothie kitchen). You can blend two sound waves together (<b>addition</b>), boost or flip any track's volume by a real number (<b>scalar multiplication</b>), and you always have pure silence (the <b>zero vector</b>). No matter how you mix tracks, you always stay inside the same universe of sound waves. Any self-contained mixing universe obeying these rules is a <b>vector space</b>!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 9+10 · Vektör Uzayları", en: "Lecture 9+10 · Vector Spaces" }],
      [{ tr: "Klasik uzaylar", en: "Classic spaces" }, { tr: R`\(\mathbb{R}^n\), polinomlar \(\mathcal{P}_n\), matrisler \(\mathbb{R}^{m \times n}\), \(C([a, b])\)`, en: R`\(\mathbb{R}^n\), polynomials \(\mathcal{P}_n\), matrices \(\mathbb{R}^{m \times n}\), \(C([a, b])\)` }],
      [{ tr: "3'lü alt uzay testi", en: "3-rule subspace test" }, { tr: R`\(\mathbf{0} \in W\), toplama kapalı (\(\mathbf{u} + \mathbf{v} \in W\)), ölçekleme kapalı (\(\lambda\mathbf{u} \in W\))`, en: R`\(\mathbf{0} \in W\), closed under \(+\) and scalar scaling \(\lambda\mathbf{u}\)` }],
      [{ tr: "Temel alt uzaylar", en: "Fundamental subspaces" }, { tr: R`[[kernel-image|\(\ker(A)\)]] (sıfıra gidenler) ve \(\operatorname{Col}(A)\) (sütunların germesi)`, en: R`[[kernel-image|\(\ker(A)\)]] (inputs sent to \(\mathbf{0}\)) and \(\operatorname{Col}(A)\) (span of columns)` }],
    ],
    tip: {
      title: { tr: "Sözlü sınav altın kuralı", en: "Oral exam golden rule" },
      text: {
        tr: R`Bir kümenin alt uzay olup olmadığı sorulduğunda <b>ilk bakacağınız yer her zaman sıfır vektörüdür</b> (\(\mathbf{0} \in W\)?). Sıfır içeride değilse (örneğin \(y = 2x + 1\) doğrusu) diğer kurallara bakmaya bile gerek yok — hemen "alt uzay değil" diyebilirsiniz!`,
        en: R`When asked if a subset is a subspace, <b>check the zero vector first</b> (\(\mathbf{0} \in W\)?). If zero is missing (like the shifted line \(y = 2x + 1\)), stop immediately — it can never be a subspace!`,
      },
    },
  },
  sections: [
    {
      id: "vs-axioms",
      mathId: "m-vs-axioms",
      title: { tr: "Oklardan Fazlası: Polinomlar ve Fonksiyonlar Nasıl Vektör Olur?", en: "Beyond Arrows: How Polynomials & Functions Act Like Vectors" },
      body: [
        {
          tr: R`Bir küme \(V\)'ye <b>[[vector-space|vektör uzayı]]</b> dememiz için elemanlarının "ok" olması gerekmez! Sadece iki işlem tanımlı olmalı — <b>toplama</b> (\(\mathbf{u} + \mathbf{v}\)) ve bir reel sayıyla <b>skaler çarpma</b> (\(\lambda \mathbf{u}\)) — ve bu işlemler 8 doğal cebir kuralına (değişme, birleşme, dağılma, sıfır elemanı ve ters eleman) uymalıdır.`,
          en: R`For a set \(V\) to be a <b>[[vector-space|vector space]]</b>, its elements do NOT have to be arrows! We only need two operations — <b>addition</b> (\(\mathbf{u} + \mathbf{v}\)) and <b>scalar multiplication</b> (\(\lambda\mathbf{u}\)) — obeying 8 natural algebra axioms (commutativity, associativity, distributivity, a zero element, and additive inverses).`,
        },
        {
          tr: R`<b>Sembolleri sesli okuyalım:</b> \(\mathcal{P}_n\) sembolü "derecesi <b>en fazla</b> \(n\) olan reel polinomlar uzayı", \(\mathbb{R}^{m \times n}\) sembolü "\(m \times n\) boyutlu tüm reel matrisler uzayı", \(C([a, b])\) ise "\([a, b]\) kapalı aralığındaki tüm sürekli fonksiyonlar uzayı" diye okunur. Örneğin \(\mathcal{P}_2\)'deki her polinom sadece üç katsayılı bir pakettir:`,
          en: R`<b>How to read the notation aloud:</b> \(\mathcal{P}_n\) reads "polynomials of degree <b>at most</b> \(n\)", \(\mathbb{R}^{m \times n}\) reads "all \(m \times n\) real matrices", and \(C([a, b])\) reads "all continuous functions on \([a, b]\)". For example, every polynomial in \(\mathcal{P}_2\) is secretly a 3-number package:`,
        },
        { eq: R`p(x) = c_0 \cdot 1 + c_1 \cdot x + c_2 \cdot x^2 \;\longleftrightarrow\; (c_0,\ c_1,\ c_2) \in \mathbb{R}^3` },
        {
          analogy: {
            title: { tr: "Üç sürgülü polinom mikseri", en: "The 3-slider polynomial mixer" },
            text: {
              tr: R`Bir ikinci derece polinom \(c_0 + c_1 x + c_2 x^2\), üç saf malzemenin karışımıdır: \(c_0\) grafiği yukarı/aşağı kaldırır (sabit çizgi \(1\)), \(c_1\) grafiğe eğim verir (doğru \(x\)), \(c_2\) ise grafiği parabol gibi büker (\(x^2\)). İki polinomu toplamak, bu üç sürgüyü ayrı ayrı toplamakla tamamen aynıdır!`,
              en: R`A quadratic \(c_0 + c_1 x + c_2 x^2\) mixes three pure ingredients: \(c_0\) lifts the curve up/down (constant \(1\)), \(c_1\) tilts it (line \(x\)), and \(c_2\) bends it into a parabola (\(x^2\)). Adding two polynomials is identical to adding their three slider settings!`,
            },
          },
        },
        {
          example: {
            title: { tr: "Polinomlar uzayı 𝒫₂'de toplama ve skaler çarpım", en: "Adding & scaling polynomials in 𝒫₂" },
            problem: {
              tr: R`\(p(x) = 1 + 2x - x^2\) ve \(q(x) = 3 - x + 2x^2\) polinomları \(\mathcal{P}_2\)'de olsun. \(2p(x) + q(x)\) bileşimini hesaplayın ve hâlâ \(\mathcal{P}_2\)'de kaldığını doğrulayın.`,
              en: R`Let \(p(x) = 1 + 2x - x^2\) and \(q(x) = 3 - x + 2x^2\) in \(\mathcal{P}_2\). Compute \(2p(x) + q(x)\) and confirm it stays in \(\mathcal{P}_2\).`,
            },
            steps: [
              {
                expr: R`2p(x) = 2(1 + 2x - x^2) = 2 + 4x - 2x^2`,
                note: { tr: R`Önce \(p(x)\)'i skaler \(2\) ile çarpıyoruz (her katsayı iki katına çıkar).`, en: R`First multiply every coefficient of \(p(x)\) by the scalar \(2\).` },
              },
              {
                expr: R`2p(x) + q(x) = (2 + 3) + (4 - 1)x + (-2 + 2)x^2 = 5 + 3x + 0x^2`,
                note: { tr: R`Aynı dereceli terimleri topluyoruz; \(x^2\) teriminin katsayısı \(0\) çıktı!`, en: R`Combine matching powers of \(x\); notice the \(x^2\) terms cancel to \(0\)!` },
              },
              {
                expr: {
                  tr: R`5 + 3x \in \mathcal{P}_2 \quad (\text{derece } 1 \le 2)`,
                  en: R`5 + 3x \in \mathcal{P}_2 \quad (\text{degree } 1 \le 2)`,
                },
                note: { tr: R`Derece 1'e düştü, ama \(\mathcal{P}_2\) "derecesi <b>en fazla</b> 2" olan tüm polinomları kapsadığı için sonuç hâlâ \(\mathcal{P}_2\)'nin içindedir!`, en: R`The degree dropped to 1, and because \(\mathcal{P}_2\) includes degree <b>at most</b> 2, the result is safely inside \(\mathcal{P}_2\)!` },
              },
            ],
            answer: { tr: R`\(2p(x) + q(x) = 5 + 3x \in \mathcal{P}_2\) (katsayı vektörü \((5, 3, 0)\)).`, en: R`\(2p(x) + q(x) = 5 + 3x \in \mathcal{P}_2\) (coefficient vector \((5, 3, 0)\)).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Dikkat: \"Derecesi TAM 2 olan polinomlar\" vektör uzayı DEĞİLDİR!", en: "Watch out: Polynomials of degree EXACTLY 2 do NOT form a vector space!" },
            text: {
              tr: R`Az önceki örnekte gördüğümüz gibi iki 2. derece polinomun toplamında \(x^2\) terimleri birbirini götürebilir: \((x^2 + 3x) + (-x^2 + 5) = 3x + 5\) (derecesi 1!). Üstelik sıfır polinomu \(0\) bu kümede yoktur. Bu yüzden \(\mathcal{P}_n\) tanımında daima "derecesi <b>en fazla</b> \(n\)" (\(\le n\)) deriz!`,
              en: R`As we just saw, adding two quadratics can cancel the \(x^2\) term: \((x^2 + 3x) + (-x^2 + 5) = 3x + 5\) (degree 1!). Worse yet, the zero polynomial \(0\) isn't even degree 2. That's why \(\mathcal{P}_n\) ALWAYS means degree <b>at most</b> \(n\) (\(\le n\))!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`\(c_2\) sürgüsünü \(0\) yapın: parabol düz bir doğruya dönüşür ama hâlâ \(\mathcal{P}_2\) içindedir.`, en: R`Set slider \(c_2 = 0\): the parabola flattens into a straight line, still inside \(\mathcal{P}_2\).` },
            { tr: R`<b>"Sıfır (0)"</b> butonuna tıklayın: tüm sürgüler 0 olur — bu, \(\mathcal{P}_2\)'nin "sıfır vektörü" olan yatay sıfır fonksiyonudur.`, en: R`Click <b>"Zero (0)"</b>: all sliders zero out — this flat zero function is the "zero vector" of \(\mathcal{P}_2\).` },
            { tr: R`Önce <b>"Parabol"</b>, sonra <b>"Ters Çevir (−p)"</b> butonuna tıklayın: \(-1\) skalerle çarpmanın grafiği \(x\)-eksenine göre nasıl yansıttığını izleyin!`, en: R`Click <b>"Parabola"</b> then <b>"Flip (−p)"</b> to watch scalar multiplication by \(-1\) mirror the curve across the \(x\)-axis!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.poly ??= { c0: -0.5, c1: 0.75, c2: 0.75 });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(presets, ctl, host, calc, msg);
        const plot = createCanvas2D(host, { height: 255 });

        let s0, s1, s2;
        const draw = () => {
          const p = (x) => s.c0 + s.c1 * x + s.c2 * x * x;
          plot.draw({
            x: [-3, 3],
            y: [-4, 4],
            xLabel: "x",
            yLabel: "p(x)",
            curves: [
              { f: () => s.c0, color: COLORS.c3, width: 1.3, dash: [4, 4] },
              { f: (x) => s.c1 * x, color: COLORS.c4, width: 1.3, dash: [4, 4] },
              { f: (x) => s.c2 * x * x, color: COLORS.c2, width: 1.3, dash: [4, 4] },
              { f: p, color: COLORS.c1, width: 3 },
            ],
            points: [{ x: 0, y: s.c0, color: COLORS.c1, r: 4.5, label: `p(0)=${ns(s.c0, 2)}` }],
          });
          calc.textContent = `\\(p(x) = ${tx(s.c0, 2)} ${txs(s.c1, 2)}\\,x ${txs(s.c2, 2)}\\,x^2 \\;\\longleftrightarrow\\; (${tx(s.c0, 2)},\\ ${tx(s.c1, 2)},\\ ${tx(s.c2, 2)}) \\in \\mathbb{R}^3\\)`;
          const deg = Math.abs(s.c2) > 1e-6 ? 2 : Math.abs(s.c1) > 1e-6 ? 1 : Math.abs(s.c0) > 1e-6 ? 0 : -1;
          msg.className = "pc-msg good";
          if (deg === -1) {
            msg.textContent = L({
              tr: "p(x) ≡ 0: Polinom uzayı 𝒫₂'nin sıfır vektörü (her vektör uzayında bulunmak zorundadır!).",
              en: "p(x) ≡ 0: The zero vector of 𝒫₂ (required in every vector space!).",
            });
          } else {
            msg.textContent = L({
              tr: `Derece = ${deg} ≤ 2 → Geçerli bir 𝒫₂ elemanı! (Kesikli eğriler üç temel malzeme: c₀, c₁x, c₂x².)`,
              en: `Degree = ${deg} ≤ 2 → Valid element of 𝒫₂! (Dashed curves show the 3 ingredients: c₀, c₁x, c₂x².)`,
            });
          }
        };

        const apply = (c0, c1, c2) => {
          s.c0 = c0; s.c1 = c1; s.c2 = c2;
          s0.set(c0); s1.set(c1); s2.set(c2);
          draw();
        };

        const mkBtn = (label, fn) => {
          const b = h("button", { type: "button", class: "btn small", text: L(label) });
          b.addEventListener("click", fn);
          return b;
        };
        presets.append(
          mkBtn({ tr: "Sıfır (0)", en: "Zero (0)" }, () => apply(0, 0, 0)),
          mkBtn({ tr: "Doğru (1+x)", en: "Line (1+x)" }, () => apply(1, 1, 0)),
          mkBtn({ tr: "Parabol (x²−1)", en: "Parabola (x²−1)" }, () => apply(-1, 0, 1)),
          mkBtn({ tr: "Ters Çevir (−p)", en: "Flip (−p)" }, () => apply(-s.c0, -s.c1, -s.c2)),
        );
        s0 = slider("c₀ (·1)", { min: -2, max: 2, step: 0.25, value: s.c0, onInput: (v) => { s.c0 = v; draw(); } });
        s1 = slider("c₁ (·x)", { min: -2, max: 2, step: 0.25, value: s.c1, onInput: (v) => { s.c1 = v; draw(); } });
        s2 = slider("c₂ (·x²)", { min: -2, max: 2, step: 0.25, value: s.c2, onInput: (v) => { s.c2 = v; draw(); } });
        ctl.append(s0, s1, s2);
        draw();
      },
    },
    {
      id: "vs-subspace",
      mathId: "m-vs-sub",
      title: { tr: "Alt Uzaylar ve 3 Kuraldan Oluşan Kapalılık Testi", en: "Subspaces & The 3-Rule Closure Test" },
      body: [
        {
          tr: R`Büyük bir vektör uzayı \(V\)'nin (örneğin \(\mathbb{R}^2\) düzleminin) içinden küçük bir parça \(W\) seçtiğimizde, bu parça kendi başına da tam bir vektör uzayı olabilir mi? İşte buna <b>[[subspace|alt uzay]]</b> denir! Harika haber: 8 aksiyomu baştan kanıtlamamıza gerek yok; yalnızca <b>3 kapalılık kuralını</b> kontrol etmek yeterlidir:`,
          en: R`If you carve out a smaller subset \(W\) inside a vector space \(V\) (say inside \(\mathbb{R}^2\)), when is \(W\) a self-contained vector space on its own? That's a <b>[[subspace|subspace]]</b>! Great news: you don't need to re-verify all 8 axioms — checking just <b>3 simple closure rules</b> suffices:`,
        },
        { eq: R`\text{(1) }\mathbf{0} \in W,\qquad \text{(2) }\mathbf{u}, \mathbf{v} \in W \implies \mathbf{u} + \mathbf{v} \in W,\qquad \text{(3) }\lambda \in \mathbb{R},\ \mathbf{u} \in W \implies \lambda\mathbf{u} \in W` },
        {
          analogy: {
            title: { tr: "Kendi kendine yeten VIP kulüp", en: "The self-contained VIP club" },
            text: {
              tr: R`\(W\)'yi büyük şehrin (\(V\)) içinde kapalı bir kulüp gibi düşünün. (1) Orijin yani "sıfır" üye mutlaka içeride olmalı. (2) Kulüpteki iki üye güçlerini birleştirdiğinde (\(\mathbf{u} + \mathbf{v}\)) sonuç dışarı taşmamalı. (3) Bir üyeyi büyütüp küçülttüğünüzde veya tersine çevirdiğinizde (\(\lambda\mathbf{u}\)) hâlâ kulübün içinde kalmalı! Doğruyu orijinden 1 milim bile kaydırsanız (\(y = mx + b,\ b \ne 0\)), bu üç kuralın hepsi aynı anda bozulur.`,
              en: R`Think of \(W\) as a club inside a big city \(V\). (1) The neutral zero member \(\mathbf{0}\) must be inside. (2) Combining any two members (\(\mathbf{u} + \mathbf{v}\)) keeps you inside. (3) Stretching, shrinking, or flipping any member (\(\lambda\mathbf{u}\)) STILL keeps you inside! Shift a line off the origin by even a tiny \(b \ne 0\), and ALL THREE rules shatter at once.`,
            },
          },
        },
        {
          example: {
            title: { tr: "İki doğruyu karşılaştıralım: y = 2x mi, y = 2x + 1 mi?", en: "Comparing two lines: y = 2x vs y = 2x + 1" },
            problem: {
              tr: R`\(W_1 = \{(x, y) \in \mathbb{R}^2 : y = 2x\}\) ve \(W_2 = \{(x, y) \in \mathbb{R}^2 : y = 2x + 1\}\) kümelerinden hangisi \(\mathbb{R}^2\)'nin alt uzayıdır?`,
              en: R`Which of \(W_1 = \{(x, y) \in \mathbb{R}^2 : y = 2x\}\) and \(W_2 = \{(x, y) \in \mathbb{R}^2 : y = 2x + 1\}\) is a subspace of \(\mathbb{R}^2\)?`,
            },
            steps: [
              {
                expr: R`W_1:\ (0, 0) \to 0 = 2(0) \checkmark`,
                note: { tr: R`Sıfır vektörü \(W_1\)'in üzerinde.`, en: R`The zero vector satisfies \(W_1\).` },
              },
              {
                expr: R`(x_1, 2x_1) + (x_2, 2x_2) = (x_1 + x_2,\ 2(x_1 + x_2)) \in W_1,\quad \lambda(x, 2x) = (\lambda x,\ 2(\lambda x)) \in W_1`,
                note: { tr: R`İkinci bileşen hâlâ birincinin 2 katı: hem toplama hem skaler çarpım kapalı → \(W_1\) <b>alt uzaydır</b>!`, en: R`The second entry stays twice the first under addition and scaling → \(W_1\) <b>is a subspace</b>!` },
              },
              {
                expr: {
                  tr: R`W_2:\ (0, 0) \to 0 \ne 2(0) + 1 = 1\;\text{ ve }\;(0,1) + (1,3) = (1,4) \notin W_2`,
                  en: R`W_2:\ (0, 0) \to 0 \ne 2(0) + 1 = 1\;\text{ and }\;(0,1) + (1,3) = (1,4) \notin W_2`,
                },
                note: { tr: R`\(W_2\) orijini içermez ve üzerinde iki nokta toplandığında \((1,4)\) doğrunun dışına fırlar (\(2(1)+1 = 3 \ne 4\)) → <b>alt uzay değildir!</b>`, en: R`\(W_2\) misses the origin AND adding two points \((0,1) + (1,3) = (1,4)\) jumps off the line (\(2(1)+1 = 3 \ne 4\)) → <b>NOT a subspace!</b>` },
              },
            ],
            answer: { tr: R`Yalnızca \(W_1\) (\(y = 2x\)) bir alt uzaydır.`, en: R`Only \(W_1\) (\(y = 2x\)) is a subspace.` },
          },
        },
        {
          pitfall: {
            title: { tr: "Birinci bölge tuzağı: x ≥ 0, y ≥ 0 neden alt uzay değil?", en: "The First Quadrant trap: why is x ≥ 0, y ≥ 0 NOT a subspace?" },
            text: {
              tr: R`Birinci bölge \(Q_1 = \{(x, y) : x \ge 0,\ y \ge 0\}\) orijini \((0,0)\) içerir VE iki pozitif vektörün toplamı yine pozitiftir! Pek çok öğrenci burada "alt uzay" diye yanılır. Oysa 3. kural <b>negatif skalerleri de</b> kapsar: \(\lambda = -1\) seçersek \((-1)\cdot(2, 3) = (-2, -3) \notin Q_1\) olur — dışarı çıktık!`,
              en: R`The first quadrant \(Q_1 = \{(x, y) : x \ge 0,\ y \ge 0\}\) contains \((0,0)\) AND is closed under addition! Many beginners get fooled here. Rule 3 must hold for <b>ALL real scalars, including negative ones</b>: picking \(\lambda = -1\) sends \((2, 3)\) to \((-2, -3) \notin Q_1\) — closure fails!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"Orijinden Geçer (b=0)"</b> butonuna tıklayın: hem \(\mathbf{u} + \mathbf{v}\) hem de \(\lambda\mathbf{u}\) tam mavi doğru \(W\)'nin üzerinde kalır!`, en: R`Click <b>"Through Origin (b=0)"</b>: both \(\mathbf{u} + \mathbf{v}\) and \(\lambda\mathbf{u}\) land cleanly on the blue line \(W\)!` },
            { tr: R`\(b\) sürgüsünü \(1{,}2\)'ye getirin: orijin noktası kırmızı içi boş halkaya döner ve \(\mathbf{u} + \mathbf{v}\) (kırmızı ok) doğrudan tam \(b\) birim yukarı fırlar!`, en: R`Slide \(b\) to \(1.2\): the origin turns hollow red and \(\mathbf{u} + \mathbf{v}\) (red arrow) escapes above the line by exactly \(b\)!` },
            { tr: R`\(b \ne 0\) iken \(\lambda\)'yı \(-1\) yapın: mor \(\lambda\mathbf{u}\) vektörünün de doğrunun tamamen dışına savrulduğunu gözlemleyin.`, en: R`With \(b \ne 0\), slide \(\lambda\) to \(-1\): watch the purple scaled vector \(\lambda\mathbf{u}\) fly completely off the line too.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.sub ??= { b: 1.2, lam: 1.5 });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(presets, ctl, host, calc, msg);
        const plot = createCanvas2D(host, { height: 270 });

        let sb, sl;
        const draw = () => {
          const m = 0.5;
          const u = [1, m * 1 + s.b];
          const v = [2, m * 2 + s.b];
          const sum = vAdd(u, v);
          const scaled = vScale(u, s.lam);
          const isSub = Math.abs(s.b) < 1e-6;
          plot.draw({
            x: [-2.5, 5],
            y: [-2.5, 5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a: m, b: -1, c: s.b, color: COLORS.c1, width: 2.6, label: `W: y = 0.5x${s.b >= 0 ? "+" : ""}${ns(s.b, 1)}` }],
            points: [
              { x: 0, y: 0, color: isSub ? COLORS.good : COLORS.bad, r: 5.5, hollow: !isSub, label: isSub ? "0 ∈ W" : "0 ∉ W" },
            ],
            vectors: [
              { to: u, color: COLORS.c3, label: "u" },
              { to: v, color: COLORS.c1, label: "v" },
              { to: scaled, color: COLORS.c4, width: 2.2, dash: [4, 3], label: "λu" },
              { to: sum, color: isSub ? COLORS.good : COLORS.bad, width: 2.8, label: "u+v" },
            ],
          });
          calc.textContent = `\\(\\mathbf{u}=(${tx(u[0], 1)},${tx(u[1], 1)}),\\; \\mathbf{v}=(${tx(v[0], 1)},${tx(v[1], 1)}) \\implies \\mathbf{u}+\\mathbf{v}=(${tx(sum[0], 1)},${tx(sum[1], 1)}),\\; ${tx(s.lam, 1)}\\mathbf{u}=(${tx(scaled[0], 1)},${tx(scaled[1], 1)})\\)`;
          if (isSub) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: "b = 0: Orijin W içinde, u + v ∈ W ve λu ∈ W → 3 kuralın tümü sağlandı, GEÇERLİ ALT UZAY!",
              en: "b = 0: Origin is in W, u + v ∈ W, and λu ∈ W → All 3 rules pass, VALID SUBSPACE!",
            });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `b = ${ns(s.b, 1)} ≠ 0: (0,0) ∉ W ve u + v doğrudan ${ns(Math.abs(s.b), 1)} birim saptı → ALT UZAY DEĞİL!`,
              en: `b = ${ns(s.b, 1)} ≠ 0: (0,0) ∉ W and u + v misses the line by ${ns(Math.abs(s.b), 1)} → NOT A SUBSPACE!`,
            });
          }
        };

        const setVals = (b, lam) => {
          s.b = b; s.lam = lam;
          sb.set(b); sl.set(lam);
          draw();
        };
        const mkBtn = (label, fn) => {
          const bt = h("button", { type: "button", class: "btn small", text: L(label) });
          bt.addEventListener("click", fn);
          return bt;
        };
        presets.append(
          mkBtn({ tr: "Orijinden Geçer (b=0)", en: "Through Origin (b=0)" }, () => setVals(0, 1.5)),
          mkBtn({ tr: "Kaydırılmış (b=1,2)", en: "Shifted (b=1.2)" }, () => setVals(1.2, 1.5)),
          mkBtn({ tr: "Negatif Ölçek (λ=−1)", en: "Negative Scale (λ=−1)" }, () => setVals(1.2, -1)),
        );
        sb = slider("b", { min: -1.5, max: 1.5, step: 0.3, value: s.b, onInput: (v) => { s.b = v; draw(); } });
        sl = slider("λ", { min: -1.5, max: 2, step: 0.5, value: s.lam, onInput: (v) => { s.lam = v; draw(); } });
        ctl.append(sb, sl);
        draw();
      },
    },
    {
      id: "vs-span",
      mathId: "m-vs-indep",
      title: { tr: "Doğrusal Bileşim ve Germe (Span): Nerelere Ulaşabilirsin?", en: "Linear Combinations & Span: Everywhere You Can Reach" },
      body: [
        {
          tr: R`Elimizde \(\mathbf{v}_1\) ve \(\mathbf{v}_2\) gibi vektörler olsun. Bunları istediğimiz reel sayılarla çarpıp toplayarak oluşturduğumuz \(c_1 \mathbf{v}_1 + c_2 \mathbf{v}_2\) ifadesine <b>[[linear-combination|doğrusal bileşim]]</b> denir. Tüm olası \((c_1, c_2)\) seçimlerini taradığımızda ulaşabildiğimiz noktaların oluşturduğu haritaya ise <b>[[span|germe (span)]]</b> adı verilir:`,
          en: R`Given vectors \(\mathbf{v}_1\) and \(\mathbf{v}_2\), scaling them by any real weights and adding gives a <b>[[linear-combination|linear combination]]</b> \(c_1\mathbf{v}_1 + c_2\mathbf{v}_2\). The complete map of EVERY point you can possibly reach by varying \((c_1, c_2)\) is called their <b>[[span|span]]</b>:`,
        },
        { eq: R`\operatorname{span}\{\mathbf{v}_1, \mathbf{v}_2\} = \{\, c_1\mathbf{v}_1 + c_2\mathbf{v}_2 \mid c_1, c_2 \in \mathbb{R} \,\}` },
        {
          analogy: {
            title: { tr: "İki raylı gezgin robot", en: "The two-rail explorer robot" },
            text: {
              tr: R`Düz bir arazide sadece iki yönde ileri-geri gidebilen bir robot hayal edin: mavi ray \(\mathbf{v}_1\) ve yeşil ray \(\mathbf{v}_2\). Robot önce \(\mathbf{v}_1\) yönünde \(c_1\) adım, ardından \(\mathbf{v}_2\) yönünde \(c_2\) adım atar. İki ray farklı yönlere bakıyorsa robot haritadaki <b>her eve</b> ulaşabilir (\(\operatorname{span} = \mathbb{R}^2\))! İki ray aynı otoyoldaysa robot sonsuza kadar o tek çizgide sıkışır.`,
              en: R`Picture a robot on a flat map that can only drive forward/backward along two rail directions: blue rail \(\mathbf{v}_1\) and green rail \(\mathbf{v}_2\). It takes \(c_1\) steps along \(\mathbf{v}_1\), then \(c_2\) steps along \(\mathbf{v}_2\). If the two rails point differently, the robot can reach <b>every single address on the plane</b> (\(\operatorname{span} = \mathbb{R}^2\))!`,
            },
          },
        },
        {
          note: {
            tr: R`<b>Güzel gerçek:</b> Hangi vektörleri seçerseniz seçin, \(\operatorname{span}\{\mathbf{v}_1, \dots, \mathbf{v}_k\}\) <b>her zaman bir alt uzaydır</b>! Çünkü \(c_1 = \dots = c_k = 0\) seçince sıfır vektörünü verir ve iki doğrusal bileşimin toplamı yine bir doğrusal bileşimdir.`,
            en: R`<b>Key fact:</b> For ANY list of vectors, \(\operatorname{span}\{\mathbf{v}_1, \dots, \mathbf{v}_k\}\) is <b>always a valid subspace</b>! Setting all \(c_i = 0\) produces \(\mathbf{0}\), and adding or scaling linear combinations always gives another linear combination.`,
          },
        },
        {
          example: {
            title: { tr: "Bir hedef nokta germenin (span) içinde mi?", en: "Is a target point inside the span?" },
            problem: {
              tr: R`\(\mathbf{b} = (5, 7)\) vektörü \(\mathbf{v}_1 = (1, 2)\) ve \(\mathbf{v}_2 = (2, 1)\) vektörlerinin germesinde midir? Eğer öyleyse \((c_1, c_2)\) ağırlıklarını bulun.`,
              en: R`Is \(\mathbf{b} = (5, 7)\) inside \(\operatorname{span}\{(1, 2),\ (2, 1)\}\)? If so, find the exact weights \((c_1, c_2)\).`,
            },
            steps: [
              {
                expr: R`c_1(1, 2) + c_2(2, 1) = (5, 7) \iff \begin{cases} c_1 + 2c_2 = 5 \\ 2c_1 + c_2 = 7 \end{cases}`,
                note: { tr: R`Vektör eşitliğini \(x\) ve \(y\) bileşenleri için iki doğrusal denkleme ayırırız.`, en: R`Split the vector equation into one linear equation per coordinate.` },
              },
              {
                expr: R`2(c_1 + 2c_2) - (2c_1 + c_2) = 10 - 7 \implies 3c_2 = 3 \implies c_2 = 1`,
                note: { tr: R`Birinci denklemi 2 ile çarpıp ikinciden çıkararak \(c_1\)'i yok ederiz.`, en: R`Multiply the first equation by 2 and subtract the second to eliminate \(c_1\).` },
              },
              {
                expr: R`c_1 = 5 - 2(1) = 3 \implies 3(1, 2) + 1(2, 1) = (3 + 2,\ 6 + 1) = (5, 7)\;\checkmark`,
                note: { tr: R`Bulduğumuz sayıları yerine koyup sağlamasını yaparız — tam isabet!`, en: R`Plug both weights back in to verify — bullseye!` },
              },
            ],
            answer: { tr: R`Evet! \(\mathbf{b} = 3\mathbf{v}_1 + 1\mathbf{v}_2\), yani \(\mathbf{b} \in \operatorname{span}\{\mathbf{v}_1, \mathbf{v}_2\}\).`, en: R`Yes! \(\mathbf{b} = 3\mathbf{v}_1 + 1\mathbf{v}_2\), so \(\mathbf{b} \in \operatorname{span}\{\mathbf{v}_1, \mathbf{v}_2\}\).` },
          },
        },
        {
          tryList: [
            { tr: R`\(c_1\) ve \(c_2\) sürgülerini oynatarak turuncu \(\mathbf{w} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2\) okunu mor hedef noktası \(\mathbf{b}\)'ye ulaştırmaya çalışın!`, en: R`Adjust sliders \(c_1\) and \(c_2\) to steer the orange vector \(\mathbf{w} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2\) onto the purple target \(\mathbf{b}\)!` },
            { tr: R`<b>"Hedefi Yakala!"</b> butonuna tıklayın ve tam çözüm ağırlıklarının paralelkenar yolunu nasıl tamamladığını görün.`, en: R`Click <b>"Snap to Target!"</b> and watch the exact weights complete the dashed parallelogram path.` },
            { tr: R`Mor \(\mathbf{b}\) hedefini düzlemde istediğiniz başka bir yere sürükleyin — her seferinde yeni bir \((c_1, c_2)\) tarifi bulabileceksiniz.`, en: R`Drag purple target \(\mathbf{b}\) anywhere else in the plane — there is ALWAYS a working \((c_1, c_2)\) recipe!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.combo ??= { c1: 1, c2: 0.5, b: [2.5, 2.5] });
        const v1 = [2, 0.5];
        const v2 = [0.5, 2];
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(presets, ctl, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 275,
          interactive: true,
          hint: L({ tr: "Mor hedef nokta b'yi sürükleyin", en: "Drag the purple target b" }),
        });

        let sc1, sc2;
        const draw = () => {
          const p1 = vScale(v1, s.c1);
          const w = vAdd(p1, vScale(v2, s.c2));
          const err = vNorm(vSub(w, s.b));
          const hit = err < 0.16;
          plot.draw({
            x: [-4.5, 4.5],
            y: [-4.5, 4.5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            basisGrid: { b1: v1, b2: v2, color: COLORS.c1, range: 4 },
            segments: [
              { from: [0, 0], to: p1, color: COLORS.c1, dash: [4, 3], width: 2 },
              { from: p1, to: w, color: COLORS.c3, dash: [4, 3], width: 2 },
            ],
            vectors: [
              { to: v1, color: COLORS.c1, width: 2.2, label: "v₁" },
              { to: v2, color: COLORS.c3, width: 2.2, label: "v₂" },
              { to: w, color: hit ? COLORS.good : COLORS.c2, width: 3, label: "w" },
            ],
            handles: [
              { id: "b", x: s.b[0], y: s.b[1], color: COLORS.c4, label: "b", onDrag: (x, y) => { s.b = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(\\mathbf{w} = ${tx(s.c1, 2)}\\,\\mathbf{v}_1 ${txs(s.c2, 2)}\\,\\mathbf{v}_2 = (${tx(w[0], 2)},\\ ${tx(w[1], 2)}),\\qquad \\|\\mathbf{w} - \\mathbf{b}\\| = ${tx(err, 2)}\\)`;
          if (hit) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: "Tam isabet! b hedefi v₁ ve v₂'nin doğrusal bileşimi olarak yazıldı.",
              en: "Bullseye! Target b is expressed as a linear combination of v₁ and v₂.",
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `Hedefe uzaklık ${ns(err, 2)}. c₁, c₂ sürgülerini kaydırın veya "Hedefi Yakala!" butonuna basın.`,
              en: `Distance to target: ${ns(err, 2)}. Tune c₁, c₂ or press "Snap to Target!"`,
            });
          }
        };

        const setC = (c1, c2) => {
          s.c1 = Math.max(-2.5, Math.min(2.5, Math.round(c1 * 20) / 20));
          s.c2 = Math.max(-2.5, Math.min(2.5, Math.round(c2 * 20) / 20));
          sc1.set(s.c1); sc2.set(s.c2);
          draw();
        };
        const mkBtn = (label, fn) => {
          const bt = h("button", { type: "button", class: "btn small", text: L(label) });
          bt.addEventListener("click", fn);
          return bt;
        };
        presets.append(
          mkBtn({ tr: "Hedefi Yakala!", en: "Snap to Target!" }, () => {
            const sol = solveLinear([[v1[0], v2[0]], [v1[1], v2[1]]], s.b);
            if (sol) setC(sol[0], sol[1]);
          }),
          mkBtn({ tr: "Sıfırla (0, 0)", en: "Reset (0, 0)" }, () => setC(0, 0)),
          mkBtn({ tr: "Ters Adım (−1, 1,5)", en: "Reverse (−1, 1.5)" }, () => setC(-1, 1.5)),
        );
        sc1 = slider("c₁", { min: -2.5, max: 2.5, step: 0.05, value: s.c1, onInput: (v) => { s.c1 = v; draw(); } });
        sc2 = slider("c₂", { min: -2.5, max: 2.5, step: 0.05, value: s.c2, onInput: (v) => { s.c2 = v; draw(); } });
        ctl.append(sc1, sc2);
        draw();
      },
    },
    {
      id: "vs-indep",
      mathId: "m-vs-indep",
      title: { tr: "Doğrusal Bağımsızlık ve Fazlalık: Germe Ne Zaman Çöker?", en: "Linear Independence vs. Redundancy: Watching Span Collapse" },
      body: [
        {
          tr: R`Peki elimizdeki vektörlerden biri aslında <b>gereksiz (kopya)</b> ise bunu nasıl anlarız? Eğer bir vektör diğerlerinin doğrusal bileşimi olarak yazılabiliyorsa o küme <b>doğrusal bağımlıdır</b> — o vektörü çıkarsak bile [[span|germe]] hiç küçülmez! Hiçbir vektör gereksiz değilse küme <b>[[linear-independence|doğrusal bağımsızdır]]</b>:`,
          en: R`How can we tell when one of our vectors is <b>redundant</b>? If any vector is already a linear combination of the others, the set is <b>linearly dependent</b> — throwing it away doesn't shrink the [[span|span]] at all! When ZERO vectors are redundant, the set is <b>[[linear-independence|linearly independent]]</b>:`,
        },
        { eq: R`c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \dots + c_k\mathbf{v}_k = \mathbf{0} \implies c_1 = c_2 = \dots = c_k = 0` },
        {
          analogy: {
            title: { tr: "Sıfıra giden kestirme yol testi", en: "The shortcut-back-to-zero test" },
            text: {
              tr: R`Pusulanızda "Doğu" ve "Kuzey" varken çantanıza bir de "Kuzeydoğu (= Doğu + Kuzey)" koyarsanız yeni hiçbir yere ulaşamazsınız — üstelik <b>1 adım Doğu + 1 adım Kuzey − 1 adım Kuzeydoğu = başlangıç (sıfır)!</b> İşte sıfırdan farklı ağırlıklarla sıfıra dönebiliyorsanız (önemsiz olmayan çözüm varsa) vektörler <b>bağımlıdır</b>.`,
              en: R`If your compass already has "East" and "North", packing "Northeast (= East + North)" unlocks ZERO new destinations — and lets you loop back to zero: <b>1 East + 1 North − 1 Northeast = 0!</b> Whenever nonzero weights cancel back to \(\mathbf{0}\), the set is <b>dependent</b>.`,
            },
          },
        },
        {
          example: {
            title: { tr: "İki çifti test edelim: Bağımlı mı, bağımsız mı?", en: "Testing two pairs: Dependent or Independent?" },
            problem: {
              tr: R`\(A = \{(1, 2),\ (2, 4)\}\) ve \(B = \{(1, 2),\ (2, 1)\}\) kümelerinin doğrusal bağımsızlığını belirleyin.`,
              en: R`Determine whether \(A = \{(1, 2),\ (2, 4)\}\) and \(B = \{(1, 2),\ (2, 1)\}\) are linearly independent.`,
            },
            steps: [
              {
                expr: R`A:\quad 2(1, 2) - 1(2, 4) = (2 - 2,\ 4 - 4) = (0, 0), \qquad \det\begin{bmatrix}1 & 2 \\ 2 & 4\end{bmatrix} = 4 - 4 = 0`,
                note: { tr: R`Ağırlıklar \((2, -1) \ne (0, 0)\) olduğu hâlde sıfıra ulaştık (\(\mathbf{v}_2 = 2\mathbf{v}_1\)) → \(A\) <b>bağımlı!</b>`, en: R`Nonzero weights \((2, -1)\) hit zero because \(\mathbf{v}_2 = 2\mathbf{v}_1\) → \(A\) is <b>dependent!</b>` },
              },
              {
                expr: R`B:\quad \det\begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix} = 1\cdot 1 - 2\cdot 2 = -3 \ne 0`,
                note: { tr: R`Determinant (paralelkenar alanı) sıfırdan farklı! Tek çözüm \(c_1 = c_2 = 0\) → \(B\) <b>bağımsız!</b>`, en: R`Nonzero determinant (nonzero parallelogram area)! Only \(c_1 = c_2 = 0\) works → \(B\) is <b>independent!</b>` },
              },
            ],
            answer: { tr: R`\(A\) doğrusal bağımlı (germesi tek bir doğru); \(B\) doğrusal bağımsız (germesi tüm \(\mathbb{R}^2\)).`, en: R`\(A\) is linearly dependent (spans only a line); \(B\) is linearly independent (spans all of \(\mathbb{R}^2\)).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık tuzak: \"Hiçbir ikili paralel değilse bağımsızdır\" YANLIŞ!", en: "Classic trap: \"No two are parallel ⇒ independent\" is FALSE!" },
            text: {
              tr: R`\(\mathbb{R}^2\)'de \(\{(1,0),\ (0,1),\ (1,1)\}\) kümesine bakın: hiçbir iki vektör birbirinin katı (paralel) değildir! Ama \((1,1) = (1,0) + (0,1)\) olduğu için üçlü <b>bağımlıdır</b>. Altın kural: \(\mathbb{R}^n\)'de \(n\)'den fazla vektör (\(k > n\)) <b>asla</b> doğrusal bağımsız olamaz!`,
              en: R`Look at \(\{(1,0),\ (0,1),\ (1,1)\}\) in \(\mathbb{R}^2\): no two vectors are parallel multiples of each other! Yet \((1,1) = (1,0) + (0,1)\), so the triple is <b>dependent</b>. Golden rule: more than \(n\) vectors in \(\mathbb{R}^n\) (\(k > n\)) are <b>ALWAYS</b> linearly dependent!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"Aynı Doğruya Çökert!"</b> butonuna tıklayın: mavi 2B ızgara bir anda kaybolur, paralelkenar alanı \(|\det| = 0\) olur ve germe kırmızı 1B doğruya çöker!`, en: R`Click <b>"Collapse to Line!"</b>: the 2D blue grid vanishes, the parallelogram area \(|\det|\) hits 0, and the span collapses to a single red line!` },
            { tr: R`Yeşil \(\mathbf{v}_2\) ucunu mavi \(\mathbf{v}_1\) doğrusunun üzerinden yavaşça geçirin: paralelkenarın sıfıra sıkışıp öbür tarafta yeniden açılışını görün.`, en: R`Slowly drag green \(\mathbf{v}_2\) across the line of \(\mathbf{v}_1\): watch the shaded parallelogram squash flat to zero and reopen!` },
            { tr: R`Bağımlı durumdayken turuncu \(\mathbf{b}\)'yi kırmızı doğrudan uzaklaştırın: artık \(\mathbf{b}\)'ye ulaşan hiçbir \((c_1, c_2)\) bileşimi yoktur!`, en: R`While dependent, drag orange \(\mathbf{b}\) off the dashed red line — no combination \(c_1\mathbf{v}_1 + c_2\mathbf{v}_2\) can reach it anymore!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.indep ??= { v1: [2, 0.5], v2: [0.5, 2], b: [2.5, 2.5] });
        const presets = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(presets, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 280,
          interactive: true,
          hint: L({ tr: "v₁, v₂ ve hedef b uçlarını sürükleyin", en: "Drag tips of v₁, v₂, and target b" }),
        });

        const draw = () => {
          const A = [[s.v1[0], s.v2[0]], [s.v1[1], s.v2[1]]];
          const d = det2(A);
          const indep = Math.abs(d) > 0.14;
          const c = indep ? solveLinear(A, s.b) : null;
          const c1v1 = c ? vScale(s.v1, c[0]) : null;
          const v1Sq = s.v1[0] * s.v1[0] + s.v1[1] * s.v1[1];
          const ratio = v1Sq > 1e-6 ? (s.v2[0] * s.v1[0] + s.v2[1] * s.v1[1]) / v1Sq : 0;

          plot.draw({
            x: [-4, 4.5],
            y: [-4, 4.5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            basisGrid: indep ? { b1: s.v1, b2: s.v2, color: COLORS.c1, range: 4 } : undefined,
            polygons: indep
              ? [{ pts: [[0, 0], s.v1, vAdd(s.v1, s.v2), s.v2], fill: "rgba(42,120,214,0.14)", stroke: COLORS.c1, width: 1.2 }]
              : [],
            lines: !indep && v1Sq > 1e-6 ? [{ a: -s.v1[1], b: s.v1[0], c: 0, color: COLORS.bad, width: 2.6, dash: [6, 4], label: L({ tr: "span (1B)", en: "span (1D)" }) }] : [],
            segments: c1v1 ? [{ from: c1v1, to: s.b, color: COLORS.c3, dash: [4, 3] }] : [],
            vectors: [
              { to: s.v1, color: COLORS.c1, label: "v₁" },
              { to: s.v2, color: COLORS.c3, label: "v₂" },
              { to: s.b, color: COLORS.c2, width: 2.8, label: "b" },
            ],
            handles: [
              { id: "v1", x: s.v1[0], y: s.v1[1], color: COLORS.c1, onDrag: (x, y) => { s.v1 = [x, y]; draw(); } },
              { id: "v2", x: s.v2[0], y: s.v2[1], color: COLORS.c3, onDrag: (x, y) => { s.v2 = [x, y]; draw(); } },
              { id: "b", x: s.b[0], y: s.b[1], color: COLORS.c2, onDrag: (x, y) => { s.b = [x, y]; draw(); } },
            ],
          });

          if (indep && c) {
            calc.textContent = `\\(\\det[\\mathbf{v}_1\\ \\mathbf{v}_2] = ${tx(d, 2)} \\ne 0,\\qquad \\mathbf{b} = ${tx(c[0], 2)}\\,\\mathbf{v}_1 ${txs(c[1], 2)}\\,\\mathbf{v}_2\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Doğrusal bağımsız! Paralelkenar alanı |det| = ${ns(Math.abs(d), 2)} > 0 → span = tüm ℝ².`,
              en: `Linearly independent! Parallelogram area |det| = ${ns(Math.abs(d), 2)} > 0 → span = all of ℝ².`,
            });
          } else {
            calc.textContent = `\\(\\det[\\mathbf{v}_1\\ \\mathbf{v}_2] \\approx 0,\\qquad \\mathbf{v}_2 \\approx ${tx(ratio, 2)}\\,\\mathbf{v}_1 \\implies \\dim\\operatorname{span} = 1\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "Doğrusal bağımlı! v₂, v₁'in katı olduğu için germe 1 boyutlu kırmızı doğruya çöktü.",
              en: "Linearly dependent! Since v₂ is a multiple of v₁, the span collapsed onto a 1D red line.",
            });
          }
        };

        const mkBtn = (label, v1, v2) => {
          const bt = h("button", { type: "button", class: "btn small", text: L(label) });
          bt.addEventListener("click", () => { s.v1 = [...v1]; s.v2 = [...v2]; draw(); });
          return bt;
        };
        presets.append(
          mkBtn({ tr: "Bağımsız", en: "Independent" }, [2, 0.5], [0.5, 2]),
          mkBtn({ tr: "Aynı Doğruya Çökert!", en: "Collapse to Line!" }, [2, 1], [3, 1.5]),
          mkBtn({ tr: "Zıt Yön (Bağımlı)", en: "Opposite (Dep.)" }, [2, 1], [-2, -1]),
          mkBtn({ tr: "Dik (90°)", en: "Perpendicular" }, [2, 0], [0, 2]),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "ℝ³'te Alt Uzay ve Germe (Span) Keşif Laboratuvarı", en: "3D Subspace & Span Exploration Lab" },
    sub: {
      tr: R`Üç boyutlu uzayda (\(\mathbb{R}^3\)) 2 veya 3 vektörün gerdiği alt uzayın nasıl 1B doğruya, 2B düzleme veya tüm \(\mathbb{R}^3\)'e dönüştüğünü döndürerek keşfedin.`,
      en: R`Orbit in 3D to see how 2 or 3 vectors in \(\mathbb{R}^3\) span a 1D line, a 2D plane through the origin, or all of \(\mathbb{R}^3\).`,
    },
    experiments: [
      { tr: R`<b>"2 Bağımsız (Düzlem)"</b> senaryosunda 3B sahneyi kenardan (yandan) bakacak şekilde döndürün: mavi düzlemin tam <b>orijin \((0,0,0)\)'dan geçen</b> jilet gibi ince bir levha olduğunu görün.`, en: R`In <b>"2 Independent (Plane)"</b>, orbit the 3D scene edge-on: confirm the blue sheet passes cleanly through the <b>origin \((0,0,0)\)</b>.` },
      { tr: R`\(v_{2,z}\) sürgüsünü \(-2\)'den \(+2\)'ye sürükleyin: düzlem orijine çivili bir menteşe gibi eğilir, ama asla orijinden ayrılmaz!`, en: R`Slide \(v_{2,z}\) from \(-2\) to \(+2\): the plane tilts like a hinge pinned at the origin, never leaving \((0,0,0)\)!` },
      { tr: R`<b>"Bağımlı (Doğru)"</b> butonuna tıklayın: \(\mathbf{v}_2 = 0{,}7\,\mathbf{v}_1\) olduğu anda tüm 2B düzlem tek bir 1B turuncu doğruya çöker (\(\dim = 1\))!`, en: R`Click <b>"Dependent (Line)"</b>: the moment \(\mathbf{v}_2 = 0.7\,\mathbf{v}_1\), the entire 2D sheet collapses onto a 1D orange line (\(\dim = 1\))!` },
      { tr: R`<b>"3 Vektör (ℝ³)"</b> senaryosunu açın ve \(v_{3,z}\) sürgüsünü yavaşça 0'a yaklaştırın: mor \(\mathbf{v}_3\) mavi düzlemin içine yatınca \(\det = 0\) olur ve 3 vektör artık tüm \(\mathbb{R}^3\)'ü geremez!`, en: R`Select <b>"3 Vectors (ℝ³)"</b> and slide \(v_{3,z}\) down to 0: once purple \(\mathbf{v}_3\) lies flat in the blue plane, \(\det = 0\) and the 3 vectors fail to span \(\mathbb{R}^3\)!` },
    ],
    build(host, state) {
      const s = (state.pg ??= { mode: "plane", tz: 1, z3: 2.2 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const view3d = createCanvas3D(stage, { height: 390 });
      const ctlMode = h("div", { class: "t-controls" });
      const ctlSliders = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      const msg = h("p", { class: "pc-msg" });
      side.append(ctlMode, ctlSliders, tiles, calc, msg);

      let sTz, sZ3;
      const draw = () => {
        const v1 = s.mode === "xy" ? [2.2, 0, 0] : [2, 0.5, 0.4];
        const v2 =
          s.mode === "line"
            ? vScale(v1, 0.7)
            : s.mode === "xy"
              ? [0, 2.2, 0]
              : [0.4, 2, s.tz];
        const v3 = s.mode === "r3" ? [1.2, 1.25, s.z3] : null;
        const normal = cross3(v1, v2);
        const crossNorm = vNorm(normal);
        const vol = v3 ? det3([[v1[0], v2[0], v3[0]], [v1[1], v2[1], v3[1]], [v1[2], v2[2], v3[2]]]) : 0;

        let dim = 2;
        if (s.mode === "line") dim = 1;
        else if (s.mode === "r3") dim = Math.abs(vol) > 0.25 ? 3 : 2;

        const vectors = [
          { to: v1, color: COLORS.c1, label: "v₁" },
          { to: v2, color: COLORS.c3, label: "v₂" },
        ];
        if (v3) vectors.push({ to: v3, color: COLORS.c4, label: "v₃" });

        view3d.draw({
          range: 4,
          planes: s.mode !== "line" ? [{ normal, d: 0, size: 2.8 }] : [],
          segments: s.mode === "line" ? [{ from: [-3, -0.75, -0.6], to: [3, 0.75, 0.6], color: COLORS.c2, width: 3 }] : [],
          vectors,
          points: [{ p: [0, 0, 0], color: COLORS.good, label: "0" }],
        });

        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Boyut (dim)", en: "Dimension" }) }), h("span", { class: "pg-tile-value", text: String(dim) })),
          h("div", { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: v3 ? "|det(v₁,v₂,v₃)|" : "‖v₁ × v₂‖" }),
            h("span", { class: "pg-tile-value", text: ns(v3 ? Math.abs(vol) : crossNorm, 2) }),
          ),
          h("div", { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: L({ tr: "Alt uzay türü", en: "Subspace type" }) }),
            h("span", { class: "pg-tile-value", text: dim === 1 ? L({ tr: "Doğru", en: "Line" }) : dim === 2 ? L({ tr: "Düzlem", en: "Plane" }) : "ℝ³" }),
          ),
        );

        if (dim === 1) {
          calc.textContent = `\\(\\mathbf{v}_2 = 0{,}7\\,\\mathbf{v}_1 \\implies \\dim\\operatorname{span}\\{\\mathbf{v}_1,\\mathbf{v}_2\\} = 1\\)`;
          msg.className = "pc-msg bad";
          msg.textContent = L({
            tr: "Bağımlı çift: v₁ ve v₂ aynı doğrultuda olduğundan yalnızca 1B bir doğru gererler.",
            en: "Dependent pair: v₁ and v₂ are collinear, spanning only a 1D line.",
          });
        } else if (dim === 2) {
          calc.textContent = v3
            ? `\\(\\det[\\mathbf{v}_1\\ \\mathbf{v}_2\\ \\mathbf{v}_3] \\approx 0 \\implies \\mathbf{v}_3 \\in \\operatorname{span}\\{\\mathbf{v}_1,\\mathbf{v}_2\\}\\ (\\dim = 2)\\)`
            : `\\(\\|\\mathbf{v}_1 \\times \\mathbf{v}_2\\| = ${tx(crossNorm, 2)} > 0 \\implies \\dim\\operatorname{span}\\{\\mathbf{v}_1,\\mathbf{v}_2\\} = 2\\)`;
          msg.className = v3 ? "pc-msg bad" : "pc-msg good";
          msg.textContent = v3
            ? L({ tr: "v₃ düzlemin içine düştü (bağımlı)! Üç vektör hâlâ yalnızca 2B düzlemi geriyor.", en: "v₃ fell into the plane (dependent)! All three vectors still span only a 2D plane." })
            : L({ tr: "Bağımsız çift: Orijinden geçen 2B bir düzlem (alt uzay) oluştu.", en: "Independent pair: Spans a 2D plane (subspace) through the origin." });
        } else {
          calc.textContent = `\\(\\det[\\mathbf{v}_1\\ \\mathbf{v}_2\\ \\mathbf{v}_3] = ${tx(vol, 2)} \\ne 0 \\implies \\operatorname{span}\\{\\mathbf{v}_1,\\mathbf{v}_2,\\mathbf{v}_3\\} = \\mathbb{R}^3\\)`;
          msg.className = "pc-msg good";
          msg.textContent = L({
            tr: "3 doğrusal bağımsız vektör! Düzlemin dışına çıkan v₃ ile tüm 3B uzay (ℝ³) gerildi.",
            en: "3 linearly independent vectors! Lifting v₃ off the plane spans all of ℝ³.",
          });
        }
      };

      const modeSeg = segmented(
        [
          ["plane", { tr: "2 Bağımsız (Düzlem)", en: "2 Indep. (Plane)" }],
          ["line", { tr: "Bağımlı (Doğru)", en: "Dependent (Line)" }],
          ["xy", { tr: "XY Düzlemi", en: "XY Plane" }],
          ["r3", { tr: "3 Vektör (ℝ³)", en: "3 Vectors (ℝ³)" }],
        ],
        s.mode,
        (v) => {
          s.mode = v;
          if (v === "r3" && Math.abs(s.tz - 1) > 2) { s.tz = 0.6; sTz.set(s.tz); }
          draw();
        },
      );
      ctlMode.append(modeSeg);
      sTz = slider("v₂,z", { min: -2, max: 2, step: 0.2, value: s.tz, onInput: (v) => { s.tz = v; draw(); } });
      sZ3 = slider("v₃,z", { min: -2, max: 3, step: 0.2, value: s.z3, onInput: (v) => { s.z3 = v; if (s.mode !== "r3") { s.mode = "r3"; modeSeg.set("r3"); } draw(); } });
      ctlSliders.append(sTz, sZ3);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-vs-axioms",
      title: { tr: "Vektör Uzayı Aksiyomları ve Klasik Uzaylar", en: "Vector Space Axioms & Classic Spaces" },
      blocks: [
        {
          p: {
            tr: R`Bir küme \(V\) üzerinde tanımlı toplama (\(+ : V \times V \to V\)) ve reel sayılarla skaler çarpma (\(\cdot : \mathbb{R} \times V \to V\)) işlemleri aşağıdaki 8 aksiyomu sağladığında \((V, +, \cdot)\) bir <b>reel vektör uzayıdır</b>:`,
            en: R`A set \(V\) equipped with vector addition (\(+ : V \times V \to V\)) and real scalar multiplication (\(\cdot : \mathbb{R} \times V \to V\)) is a <b>real vector space</b> when it obeys these 8 axioms:`,
          },
        },
        {
          table: {
            head: [{ tr: "Grup", en: "Group" }, { tr: "Aksiyom", en: "Axiom" }, { tr: "Anlamı (düz dille)", en: "Plain meaning" }],
            rows: [
              [{ tr: "Toplama (A1–A2)", en: "Addition (A1–A2)" }, R`\(\mathbf{u}+\mathbf{v}=\mathbf{v}+\mathbf{u},\quad (\mathbf{u}+\mathbf{v})+\mathbf{w}=\mathbf{u}+(\mathbf{v}+\mathbf{w})\)`, { tr: "Sıra ve parantez önemli değil", en: "Order & grouping don't matter" }],
              [{ tr: "Toplama (A3–A4)", en: "Addition (A3–A4)" }, R`\(\exists\,\mathbf{0}:\ \mathbf{u}+\mathbf{0}=\mathbf{u},\quad \exists\,(-\mathbf{u}):\ \mathbf{u}+(-\mathbf{u})=\mathbf{0}\)`, { tr: "Etkisiz sıfır ve geri alma (ters) var", en: "Zero element & additive inverse exist" }],
              [{ tr: "Dağılma (S1–S2)", en: "Distributive (S1–S2)" }, R`\(\lambda(\mathbf{u}+\mathbf{v})=\lambda\mathbf{u}+\lambda\mathbf{v},\quad (\lambda+\mu)\mathbf{u}=\lambda\mathbf{u}+\mu\mathbf{u}\)`, { tr: "Çarpma toplama üzerine dağılır", en: "Scaling distributes over sums" }],
              [{ tr: "Uyum (S3–S4)", en: "Compatibility (S3–S4)" }, R`\((\lambda\mu)\mathbf{u}=\lambda(\mu\mathbf{u}),\quad 1\cdot\mathbf{u}=\mathbf{u}\)`, { tr: "Ölçekleme birleşir ve 1 değiştirmez", en: "Scaling associates & 1 leaves unchanged" }],
            ],
          },
        },
        {
          h: { tr: "Üniversite matematiğinin 4 klasik vektör uzayı", en: "The 4 classic university vector spaces" },
        },
        {
          table: {
            head: [{ tr: "Uzay", en: "Space" }, { tr: "Elemanları", en: "Elements" }, { tr: "Sıfır vektörü", en: "Zero vector" }, { tr: "Boyut", en: "Dimension" }],
            rows: [
              [R`\(\mathbb{R}^n\)`, { tr: R`\(n\)-bileşenli reel listeler`, en: R`Ordered \(n\)-tuples of reals` }, R`\((0, 0, \dots, 0)\)`, R`\(n\)`],
              [R`\(\mathcal{P}_n\)`, { tr: R`Derecesi \(\le n\) olan polinomlar`, en: R`Polynomials of degree \(\le n\)` }, R`\(p(x) \equiv 0\)`, R`\(n + 1\)`],
              [R`\(\mathbb{R}^{m \times n}\)`, { tr: R`\(m \times n\) reel matrisler`, en: R`\(m \times n\) real matrices` }, R`\(O_{m \times n}\)`, R`\(mn\)`],
              [R`\(C([a, b])\)`, { tr: R`\([a, b]\)'de sürekli fonksiyonlar`, en: R`Continuous functions on \([a, b]\)` }, R`\(f(x) \equiv 0\)`, R`\(\infty\)`],
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Unutmayın: dim(𝒫ₙ) = n + 1!", en: "Don't forget: dim(𝒫ₙ) = n + 1!" },
          text: {
            tr: R`\(\mathcal{P}_3\) uzayının boyutu 3 değil <b>4</b>'tür! Çünkü sabit terim \(1 = x^0\) de bir yapı taşıdır: \(\{1, x, x^2, x^3\}\).`,
            en: R`The dimension of \(\mathcal{P}_3\) is <b>4</b>, not 3! Remember the constant term \(1 = x^0\): \(\{1, x, x^2, x^3\}\).`,
          },
        },
      ],
    },
    {
      id: "m-vs-sub",
      title: { tr: "Alt Uzay Kriteri, Çekirdek ker(A) ve Sütun Uzayı Col(A)", en: "Subspace Test, Kernel ker(A) & Column Space Col(A)" },
      blocks: [
        {
          p: {
            tr: R`Bir \(m \times n\) matris \(A\) doğal olarak iki hayati [[subspace|alt uzay]] doğurur: sıfıra ezilen girdilerin kümesi <b>çekirdek</b> \(\ker(A) \subseteq \mathbb{R}^n\) ve ulaşılabilen çıktıların kümesi <b>sütun uzayı</b> \(\operatorname{Col}(A) \subseteq \mathbb{R}^m\). İkisinin de 3'lü alt uzay testini nasıl geçtiğini adım adım görelim:`,
            en: R`Every \(m \times n\) matrix \(A\) naturally produces two vital [[subspace|subspaces]]: its <b>kernel (nullspace)</b> \(\ker(A) \subseteq \mathbb{R}^n\) of inputs sent to zero, and its <b>column space</b> \(\operatorname{Col}(A) \subseteq \mathbb{R}^m\) of reachable outputs. Let's prove both step-by-step:`,
          },
        },
        {
          derive: {
            title: { tr: "İspat 1: Çekirdek ker(A) = {x ∈ ℝⁿ : Ax = 0} bir alt uzaydır", en: "Proof 1: The kernel ker(A) = {x ∈ ℝⁿ : Ax = 0} is a subspace" },
            steps: [
              { tex: R`A\mathbf{0} = \mathbf{0} \implies \mathbf{0} \in \ker(A)`, why: { tr: "Kural 1: Herhangi bir matris sıfır vektörünü sıfıra götürür, yani çekirdek asla boş değildir.", en: "Rule 1: Every matrix sends zero to zero, so the kernel always contains 0." } },
              { tex: R`\mathbf{u}, \mathbf{v} \in \ker(A) \implies A(\mathbf{u} + \mathbf{v}) = A\mathbf{u} + A\mathbf{v} = \mathbf{0} + \mathbf{0} = \mathbf{0}`, why: { tr: "Kural 2: Matris çarpımının doğrusallığı sayesinde toplamın çıktısı da sıfır olur → u + v ∈ ker(A).", en: "Rule 2: By linearity of matrix multiplication, the sum also maps to 0 → u + v ∈ ker(A)." } },
              { tex: R`\lambda \in \mathbb{R},\ \mathbf{u} \in \ker(A) \implies A(\lambda\mathbf{u}) = \lambda(A\mathbf{u}) = \lambda\mathbf{0} = \mathbf{0}`, why: { tr: "Kural 3: Skaler dışarı çıkar ve sıfırla çarpılınca yine sıfır verir → λu ∈ ker(A). İspat tamamlandı!", en: "Rule 3: Pull the scalar λ outside; multiplying 0 still gives 0 → λu ∈ ker(A). QED!" } },
            ],
          },
        },
        {
          derive: {
            title: { tr: "İspat 2: Sütun uzayı Col(A) = {Ax : x ∈ ℝⁿ} bir alt uzaydır", en: "Proof 2: The column space Col(A) = {Ax : x ∈ ℝⁿ} is a subspace" },
            steps: [
              { tex: R`\mathbf{0} = A\mathbf{0} \implies \mathbf{0} \in \operatorname{Col}(A)`, why: { tr: "Kural 1: Girdi olarak x = 0 seçersek çıktı 0 olur; demek ki 0 ∈ Col(A).", en: "Rule 1: Plugging in x = 0 outputs 0, so 0 lies in Col(A)." } },
              { tex: R`\mathbf{b}_1 = A\mathbf{x}_1,\ \mathbf{b}_2 = A\mathbf{x}_2 \implies \mathbf{b}_1 + \mathbf{b}_2 = A(\mathbf{x}_1 + \mathbf{x}_2) \in \operatorname{Col}(A)`, why: { tr: "Kural 2: İki ulaşılabilir çıktının toplamı, girdilerin toplamının çıktısıdır — yine Col(A)'da!", en: "Rule 2: Adding two reachable outputs gives the output of x₁ + x₂ — still inside Col(A)!" } },
              { tex: R`\lambda\mathbf{b}_1 = \lambda(A\mathbf{x}_1) = A(\lambda\mathbf{x}_1) \in \operatorname{Col}(A)`, why: { tr: "Kural 3: Çıktıyı λ ile ölçeklemek, girdiyi λ ile ölçeklemekle elde edilir. Üç kural da tamam!", en: "Rule 3: Scaling the output by λ is achieved by scaling the input by λ. All 3 rules hold!" } },
            ],
          },
        },
        {
          example: {
            title: { tr: "Polinom uzayı 𝒫₂ içinde alt uzay testi", en: "Subspace test inside the polynomial space 𝒫₂" },
            problem: {
              tr: R`\(W = \{p \in \mathcal{P}_2 : p(1) = 0\}\) kümesi (yani \(x = 1\)'de kökü olan polinomlar) \(\mathcal{P}_2\)'nin bir alt uzayı mıdır?`,
              en: R`Is \(W = \{p \in \mathcal{P}_2 : p(1) = 0\}\) (polynomials vanishing at \(x = 1\)) a subspace of \(\mathcal{P}_2\)?`,
            },
            steps: [
              { expr: R`z(x) \equiv 0 \implies z(1) = 0 \implies z \in W`, note: { tr: R`Sıfır polinomu her noktada 0'dır, özellikle \(x = 1\)'de de 0'dır.`, en: R`The zero polynomial equals 0 everywhere, including at \(x = 1\).` } },
              { expr: R`(p + q)(1) = p(1) + q(1) = 0 + 0 = 0 \implies p + q \in W`, note: { tr: R`İkisinin de \(1\)'deki değeri 0 ise toplamın \(1\)'deki değeri de 0'dır.`, en: R`If both vanish at \(1\), their sum vanishes at \(1\).` } },
              { expr: R`(\lambda p)(1) = \lambda\,p(1) = \lambda \cdot 0 = 0 \implies \lambda p \in W`, note: { tr: R`Skalerle çarpınca \(1\)'deki değer hâlâ 0 kalır!`, en: R`Scaling keeps the value at \(1\) equal to 0!` } },
            ],
            answer: { tr: R`Evet, \(W\) bir alt uzaydır! (Not: \(p(1) = 1\) olsaydı sıfır polinomu uymayacağı için alt uzay olmazdı.)`, en: R`Yes, \(W\) is a subspace! (Note: \(p(1) = 1\) would fail because the zero polynomial has \(0(1) = 0 \ne 1\).)` },
          },
        },
        {
          callout: "warn",
          title: { tr: "İki alt uzayın BİRLEŞİMİ genelde alt uzay DEĞİLDİR!", en: "The UNION of two subspaces is usually NOT a subspace!" },
          text: {
            tr: R`\(\mathbb{R}^2\)'de \(x\)-ekseni ve \(y\)-ekseni ayrı ayrı alt uzaydır; fakat birleşimleri \(U = (x\text{-ekseni}) \cup (y\text{-ekseni})\) alt uzay değildir! Çünkü \((1, 0) \in U\) ve \((0, 1) \in U\) iken toplamları \((1, 1) \notin U\). Oysa iki alt uzayın <b>kesişimi</b> \(W_1 \cap W_2\) her zaman bir alt uzaydır!`,
            en: R`In \(\mathbb{R}^2\), the \(x\)-axis and \(y\)-axis are each subspaces, yet their union \(U\) is NOT: \((1, 0) \in U\) and \((0, 1) \in U\), but \((1, 0) + (0, 1) = (1, 1) \notin U\). By contrast, the <b>intersection</b> \(W_1 \cap W_2\) of subspaces is ALWAYS a subspace!`,
          },
        },
      ],
    },
    {
      id: "m-vs-indep",
      title: { tr: "Doğrusal Bağımsızlık Kriterleri ve Hızlı Kontrol Tablosu", en: "Linear Independence Criteria & Quick Reference" },
      blocks: [
        {
          eq: R`c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k = \mathbf{0} \iff A\mathbf{c} = \mathbf{0} \quad\big(A = [\mathbf{v}_1\ \dots\ \mathbf{v}_k]\big)`,
        },
        {
          table: {
            head: [{ tr: "Özellik", en: "Property" }, { tr: "Doğrusal Bağımsız", en: "Linearly Independent" }, { tr: "Doğrusal Bağımlı", en: "Linearly Dependent" }],
            rows: [
              [{ tr: R`\(A\mathbf{c} = \mathbf{0}\) çözümü`, en: R`Solutions to \(A\mathbf{c} = \mathbf{0}\)` }, { tr: R`Yalnızca \(\mathbf{c} = \mathbf{0}\) (tek çözüm)`, en: R`Only \(\mathbf{c} = \mathbf{0}\) (trivial)` }, { tr: R`Sonsuz çok sıfırdan farklı çözüm`, en: R`Infinitely many nonzero solutions` }],
              [{ tr: "RREF pivot sayısı", en: "Pivots in RREF" }, { tr: R`Her sütunda pivot var (\(\operatorname{rank}(A) = k\))`, en: R`Pivot in every column (\(\operatorname{rank}(A) = k\))` }, { tr: R`En az bir serbest sütun (\(\operatorname{rank}(A) < k\))`, en: R`At least one free column (\(\operatorname{rank}(A) < k\))` }],
              [{ tr: R`Kare matris (\(k = n\))`, en: R`Square case (\(k = n\))` }, R`\(\det(A) \ne 0\)`, R`\(\det(A) = 0\)`],
              [{ tr: "Geometrik anlam", en: "Geometric meaning" }, { tr: "Her vektör yepyeni bir boyut ekler", en: "Each vector adds a brand-new dimension" }, { tr: "En az bir vektör diğerlerinin germesinde", en: "At least one vector lies in the span of the others" }],
            ],
          },
        },
        {
          example: {
            title: { tr: "ℝ³'te 3 vektörün bağımsızlığını determinantla test etme", en: "Testing 3 vectors in ℝ³ via determinant" },
            problem: {
              tr: R`\(\mathbf{v}_1 = (1, 0, 1),\ \mathbf{v}_2 = (0, 1, 1),\ \mathbf{v}_3 = (1, 1, 2)\) vektörleri doğrusal bağımsız mıdır?`,
              en: R`Are \(\mathbf{v}_1 = (1, 0, 1),\ \mathbf{v}_2 = (0, 1, 1),\ \mathbf{v}_3 = (1, 1, 2)\) linearly independent?`,
            },
            steps: [
              {
                expr: R`A = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{bmatrix}`,
                note: { tr: R`Vektörleri sütun (veya satır) olarak bir \(3 \times 3\) matrise yerleştiririz.`, en: R`Place the three vectors as columns of a \(3 \times 3\) matrix.` },
              },
              {
                expr: R`\det(A) = 1(1\cdot 2 - 1\cdot 1) - 0 + 1(0\cdot 1 - 1\cdot 1) = 1 - 1 = 0`,
                note: { tr: R`Determinant 0 çıktı — bu üç vektörün oluşturduğu paralelyüzün hacmi 0 (aynı düzlemdeler)!`, en: R`The determinant is 0 — their parallelepiped volume is 0 (they are coplanar)!` },
              },
              {
                expr: R`\mathbf{v}_1 + \mathbf{v}_2 - \mathbf{v}_3 = (1+0-1,\ 0+1-1,\ 1+1-2) = (0, 0, 0)`,
                note: { tr: R`Doğrudan bağımlılık ilişkisi: \(\mathbf{v}_3 = \mathbf{v}_1 + \mathbf{v}_2\) gereksizdir!`, en: R`Explicit dependence relation: \(\mathbf{v}_3 = \mathbf{v}_1 + \mathbf{v}_2\) is redundant!` },
              },
            ],
            answer: { tr: R`Hayır, doğrusal bağımlıdırlar; germeleri \(\mathbb{R}^3\)'te yalnızca 2B bir düzlemdir.`, en: R`No, they are linearly dependent; they only span a 2D plane in \(\mathbb{R}^3\).` },
          },
        },
        {
          callout: "tip",
          title: { tr: "İki saniyelik bağımlılık dedektörleri", en: "Two-second dependence detectors" },
          text: {
            tr: R`1) Kümede sıfır vektörü \(\mathbf{0}\) varsa küme <b>otomatik bağımlıdır</b> (çünkü \(1\cdot\mathbf{0} = \mathbf{0}\)).<br>2) \(\mathbb{R}^n\)'de \(n\)'den fazla vektör (\(k > n\)) varsa hesap yapmadan <b>otomatik bağımlıdır</b> diyebilirsiniz!`,
            en: R`1) Any set containing \(\mathbf{0}\) is <b>automatically dependent</b> (since \(1\cdot\mathbf{0} = \mathbf{0}\)).<br>2) More than \(n\) vectors in \(\mathbb{R}^n\) (\(k > n\)) are <b>automatically dependent</b> — no arithmetic needed!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
