import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { vAdd, vAngle, vDot, vNorm, vProject, vScale, vSub } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

function makePresetBtn(label, onClick) {
  const b = h("button", { type: "button", class: "btn small", text: L(label) });
  b.addEventListener("click", onClick);
  return b;
}

mountChapter({
  intro: {
    id: "vec-intro",
    title: { tr: "Sayılar, Noktalar ve Vektörler", en: "Numbers, Points, and Vectors" },
    paragraphs: [
      {
        tr: R`Tek boyutlu sayı doğrusunda doğal sayılardan reel sayılara uzanan \(\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}\) hiyerarşisi yalnızca <i>"ne kadar?"</i> sorusunu yanıtlar. İki veya daha fazla sayıyı sıralı biçimde bir araya getirdiğimizde düzlemde (\(\mathbb{R}^2\)) ve uzayda (\(\mathbb{R}^n\)) hem <b>konumları</b> (noktalar) hem de <b>yönlü yer değiştirmeleri</b> ([[vector|vektörler]]) tanımlayabiliriz.`,
        en: R`On the 1D number line, the number hierarchy \(\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}\) only answers <i>"how much?"</i>. Grouping numbers into ordered pairs or triples unlocks \(\mathbb{R}^2\) and \(\mathbb{R}^n\), letting us describe both <b>locations</b> (points) and <b>directed displacements</b> ([[vector|vectors]]).`,
      },
      {
        tr: R`Bu bölümde sıkça göreceğimiz iki sembolü yüksek sesle okuyalım: \(\|\mathbf v\|\) ifadesi <i>"\(\mathbf v\)'nin normu (uzunluğu)"</i>, \(\mathbf u \cdot \mathbf v\) ifadesi ise <i>"\(\mathbf u\) nokta \(\mathbf v\)"</i> demektir. <b>Bölümün sonunda</b> vektörleri ok gibi çizip toplayabilecek, nokta çarpımla açıları ve dikliği sınayabilecek, dik [[projection|izdüşüm]] hesaplayabilecek ve [[cauchy-schwarz|Cauchy–Schwarz]] ile üçgen eşitsizliğini ispatlayabileceksiniz.`,
        en: R`Let us read two key symbols aloud right away: \(\|\mathbf v\|\) means <i>"the norm (length) of \(\mathbf v\)"</i>, and \(\mathbf u \cdot \mathbf v\) reads <i>"\(\mathbf u\) dot \(\mathbf v\)"</i>. <b>By the end of this chapter</b> you will add and scale vectors visually, test angles and perpendicularity with the dot product, compute orthogonal [[projection|projections]], and prove the [[cauchy-schwarz|Cauchy–Schwarz]] and triangle inequalities.`,
      },
    ],
    analogy: {
      title: { tr: "Haritadaki Konum İğnesi vs. Yol Tarifi Oku", en: "GPS Pin vs. Walking Directions" },
      text: {
        tr: R`Bir <b>nokta</b> \(P = (3, 4)\), haritada bir kafenin sabit adresidir (<i>"neredesin?"</i>). Bir <b>vektör</b> \(\mathbf v = (3, 4)\) ise bir yol tarifidir: <i>"Nereden başlarsan başla, 3 blok doğuya ve 4 blok kuzeye yürü!"</i> Aynı oku haritada başka bir sokağa taşısanız bile uzunluğu (\(5\) blok) ve yönü değişmediği sürece o <b>aynı vektördür</b>.`,
        en: R`A <b>point</b> \(P = (3, 4)\) is a fixed cafe pin on a map (<i>"where are you?"</i>). A <b>vector</b> \(\mathbf v = (3, 4)\) is a walking instruction: <i>"Wherever you start, walk 3 blocks East and 4 blocks North!"</i> Even if you slide that arrow to another street, as long as its length (\(5\) blocks) and direction stay the same, it is the <b>exact same vector</b>.`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 2 · Sayılar, Noktalar ve Vektörler", en: "Lecture 2 · Numbers, Points, and Vectors" }],
      [{ tr: "Temel araçlar", en: "Core tools" }, { tr: R`\(\|\mathbf v\|,\ \hat{\mathbf v},\ \mathbf u\cdot\mathbf v,\ \cos\theta,\ \operatorname{proj}_{\mathbf v}\mathbf u\)`, en: R`\(\|\mathbf v\|,\ \hat{\mathbf v},\ \mathbf u\cdot\mathbf v,\ \cos\theta,\ \operatorname{proj}_{\mathbf v}\mathbf u\)` }],
      [{ tr: "Büyük eşitsizlikler", en: "Key inequalities" }, { tr: "Cauchy–Schwarz ve Üçgen Eşitsizliği", en: "Cauchy–Schwarz & Triangle Inequality" }],
    ],
    tip: {
      title: { tr: "Nokta mı, vektör mü?", en: "Point vs. vector" },
      text: {
        tr: R`Bir \(P\) noktası uzaydaki bir konumu, \(\overrightarrow{PQ} = Q - P\) vektörü ise \(P\)'den \(Q\)'ya yer değiştirmeyi temsil eder. Başlangıcı orijin \(O = (0,0)\) olan konum vektörü \(\overrightarrow{OP}\) ikisini pratik biçimde özdeşleştirir.`,
        en: R`A point \(P\) marks a fixed position, while \(\overrightarrow{PQ} = Q - P\) is the displacement from \(P\) to \(Q\). Anchoring a vector at the origin \(O = (0,0)\) pairs each point \(P\) with its position vector \(\overrightarrow{OP}\).`,
      },
    },
  },
  sections: [
    {
      id: "vec-basics",
      mathId: "m-vec-norm",
      title: { tr: "Noktalar, Vektörler, Uzunluk (Norm) ve Birim Vektör", en: "Points, Vectors, Length (Norm) & Unit Vectors" },
      body: [
        {
          tr: R`\(P = (p_1, p_2)\) noktasından \(Q = (q_1, q_2)\) noktasına giden yer değiştirme [[vector|vektörü]], <i>"hedef eksi başlangıç"</i> kuralıyla bulunur: \(\overrightarrow{PQ} = Q - P = (q_1 - p_1,\ q_2 - p_2)\). Bir vektörün uzunluğunu veren [[norm|Öklid normu]] \(\|\mathbf v\|\) bildiğimiz Pisagor teoreminden başka bir şey değildir.`,
          en: R`The displacement [[vector|vector]] from point \(P = (p_1, p_2)\) to point \(Q = (q_1, q_2)\) follows the <i>"tip minus tail"</i> rule: \(\overrightarrow{PQ} = Q - P = (q_1 - p_1,\ q_2 - p_2)\). Its length, called the [[norm|Euclidean norm]] \(\|\mathbf v\|\), is literally the Pythagorean theorem.`,
        },
        {
          tr: R`Sıfırdan farklı herhangi bir \(\mathbf v\) vektörünü kendi uzunluğuna böldüğümüzde uzunluğu tam \(1\) olan <b>birim vektör</b> \(\hat{\mathbf v}\) (<i>"\(\mathbf v\) şapka"</i>) elde ederiz. Bu işleme <b>normalleştirme</b> denir ve vektörün yalnızca saf yönünü saklar.`,
          en: R`Dividing any nonzero vector \(\mathbf v\) by its own length yields a length-\(1\) <b>unit vector</b> \(\hat{\mathbf v}\) (read <i>"\(\mathbf v\)-hat"</i>). This process — <b>normalization</b> — strips away size and keeps pure direction.`,
        },
        {
          analogy: {
            title: { tr: "Birim Vektör = Saf Pusula İğnesi", en: "Unit Vector = A Pure Compass Needle" },
            text: {
              tr: R`Rüzgâr kuzeydoğuya saatte \(5\text{ km}\) ile de esse, \(50\text{ km}\) ile de esse <b>yönü aynıdır</b>. Rüzgâr vektörünü kendi hızına (normuna) böldüğünüzde elinizde uzunluğu tam \(1\) olan saf bir pusula iğnesi (\(\hat{\mathbf v}\)) kalır.`,
              en: R`Whether wind blows Northeast at \(5\text{ km/h}\) or \(50\text{ km/h}\), its <b>direction</b> is identical. Dividing the wind vector by its speed leaves a pure length-\(1\) compass needle (\(\hat{\mathbf v}\)) pointing strictly Northeast.`,
            },
          },
        },
        { eq: R`\overrightarrow{PQ} = Q - P, \qquad \|\mathbf v\| = \sqrt{v_1^2 + v_2^2}, \qquad \hat{\mathbf v} = \frac{\mathbf v}{\|\mathbf v\|} \quad (\mathbf v \ne \mathbf 0)` },
        {
          example: {
            title: { tr: "İki noktadan vektör, norm ve birim vektör bulma", en: "Displacement, norm, and unit vector from two points" },
            problem: {
              tr: R`\(P = (1, 2)\) ve \(Q = (4, 6)\) noktaları için \(\mathbf v = \overrightarrow{PQ}\) vektörünü, uzunluğunu ve birim vektörünü bulun.`,
              en: R`For \(P = (1, 2)\) and \(Q = (4, 6)\), find \(\mathbf v = \overrightarrow{PQ}\), its norm, and its unit vector.`,
            },
            steps: [
              {
                expr: R`\mathbf v = Q - P = (4 - 1,\ 6 - 2) = (3,\ 4)`,
                note: { tr: R`Hedef noktadan başlangıç noktasını çıkarırız: sağa \(3\), yukarı \(4\) birim.`, en: R`Subtract tail from tip: \(3\) units right and \(4\) units up.` },
              },
              {
                expr: R`\|\mathbf v\| = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5`,
                note: { tr: R`Pisagor teoremiyle klasik \(3\text{–}4\text{–}5\) dik üçgeninin hipotenüsünü buluruz.`, en: R`Pythagoras gives the classic \(3\text{–}4\text{–}5\) right triangle hypotenuse.` },
              },
              {
                expr: R`\hat{\mathbf v} = \frac{1}{5}(3,\ 4) = \left(\frac{3}{5},\ \frac{4}{5}\right) = (0{,}6,\ 0{,}8)`,
                note: { tr: R`Kontrol: \(\sqrt{0{,}6^2 + 0{,}8^2} = \sqrt{0{,}36 + 0{,}64} = 1\) ✓!`, en: R`Check: \(\sqrt{0.6^2 + 0.8^2} = \sqrt{0.36 + 0.64} = 1\) ✓!` },
              },
            ],
            answer: {
              tr: R`\(\mathbf v = (3, 4)\), \(\|\mathbf v\| = 5\) ve \(\hat{\mathbf v} = (\frac{3}{5}, \frac{4}{5})\).`,
              en: R`\(\mathbf v = (3, 4)\), \(\|\mathbf v\| = 5\), and \(\hat{\mathbf v} = (\frac{3}{5}, \frac{4}{5})\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Norm bileşenlerin toplamı değildir!", en: "Norm is NOT the sum of coordinates!" },
            text: {
              tr: R`\((3, 4)\) vektörünün uzunluğu \(3 + 4 = 7\) değil, \(\sqrt{3^2 + 4^2} = 5\)'tir! Ayrıca sıfır vektörünün \(\mathbf 0 = (0, 0)\) yönü yoktur ve sıfıra bölünemeyeceği için <b>birim vektörü tanımlı değildir</b>.`,
              en: R`The length of \((3, 4)\) is \(\sqrt{3^2 + 4^2} = 5\), NOT \(3 + 4 = 7\)! Also, the zero vector \(\mathbf 0 = (0, 0)\) has no direction and <b>cannot be normalized</b> (division by zero).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Yeşil \(P\) ve mavi \(Q\) noktalarını birlikte aynı miktarda kaydırın: orijindeki kesikli \(\mathbf v\) okunun hiç kıpırdamadığını görün!`, en: R`Drag \(P\) and \(Q\) together by the same shift: notice the origin-anchored copy of \(\mathbf v\) stays completely unchanged!` },
            { tr: R`"3–4–5 Üçgeni" hazır ayarına tıklayıp \(\|\mathbf v\| = 5\) ve \(\hat{\mathbf v} = (0.6, 0.8)\) değerlerini doğrulayın.`, en: R`Click the "3–4–5 Triangle" preset to verify \(\|\mathbf v\| = 5\) and \(\hat{\mathbf v} = (0.6, 0.8)\).` },
            { tr: R`\(Q\)'yu istediğiniz yere sürükleyin: turuncu birim vektör \(\hat{\mathbf v}\)'nin ucunun <b>daima</b> kesikli birim çember (\(r=1\)) üzerinde gezdiğini gözlemleyin.`, en: R`Drag \(Q\) anywhere: watch the orange unit vector \(\hat{\mathbf v}\) ALWAYS touch the dashed unit circle (\(r=1\)).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.basics ??= { p: [0.5, 0.5], q: [3.5, 2.5] });
        const presets = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, host, calc);
        const plot = createCanvas2D(host, {
          height: 280,
          interactive: true,
          hint: L({ tr: "P ve Q noktalarını sürükleyin", en: "Drag points P and Q" }),
        });

        const draw = () => {
          const v = vSub(s.q, s.p);
          const len = vNorm(v);
          const u = len > 1e-6 ? [v[0] / len, v[1] / len] : [0, 0];
          const atOrigin = Math.hypot(s.p[0], s.p[1]) < 0.12;
          plot.draw({
            x: [-4.5, 5],
            y: [-4, 5],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [4, 4], width: 1.4 }],
            vectors: [
              { from: s.p, to: s.q, color: COLORS.c1, width: 2.8, label: atOrigin ? "v = PQ" : "PQ" },
              ...(!atOrigin ? [{ to: [v[0], v[1]], color: COLORS.c1, dash: [4, 3], width: 2, label: "v" }] : []),
              ...(len > 1e-6 ? [{ to: u, color: COLORS.c2, width: 3, label: "v̂" }] : []),
            ],
            handles: [
              { id: "p", x: s.p[0], y: s.p[1], color: COLORS.c3, label: "P", onDrag: (x, y) => { s.p = [x, y]; draw(); } },
              { id: "q", x: s.q[0], y: s.q[1], color: COLORS.c1, label: "Q", onDrag: (x, y) => { s.q = [x, y]; draw(); } },
            ],
          });
          calc.textContent = len > 1e-6
            ? `\\(\\mathbf v = Q - P = (${tx(v[0], 2)},\\ ${tx(v[1], 2)}),\\quad \\|\\mathbf v\\| = ${tx(len, 2)},\\quad \\hat{\\mathbf v} = (${tx(u[0], 2)},\\ ${tx(u[1], 2)})\\)`
            : `\\(\\mathbf v = (0,\\ 0),\\quad \\|\\mathbf v\\| = 0\\quad (\\text{birim vektör yok / no unit vector})\\)`;
        };
        presets.append(
          makePresetBtn({ tr: "3–4–5 Üçgeni", en: "3–4–5 Triangle" }, () => { s.p = [0, 0]; s.q = [3, 4]; draw(); }),
          makePresetBtn({ tr: "Taşınmış 3–4–5", en: "Shifted 3–4–5" }, () => { s.p = [-2, -1]; s.q = [1, 3]; draw(); }),
          makePresetBtn({ tr: "Sola aşağı", en: "Down-left" }, () => { s.p = [1, 1]; s.q = [-2, -2]; draw(); }),
        );
        draw();
      },
    },
    {
      id: "vec-ops",
      mathId: "m-vec-norm",
      title: { tr: "Vektör Toplama, Çıkarma ve Skaler Çarpma", en: "Vector Addition, Subtraction & Scaling" },
      body: [
        {
          tr: R`İki vektörü toplamak (\(\mathbf u + \mathbf v\)) aynı sıradaki bileşenleri toplamaktır. Geometrik olarak \(\mathbf u\)'nun ucuna \(\mathbf v\)'yi eklersiniz (<i>uç uca ekleme</i> veya <b>paralelkenar kuralı</b>). Bir \(\lambda\in\mathbb{R}\) sayısıyla çarpmak (\(\lambda \mathbf u\)) oku uzatır veya kısaltır; \(\lambda < 0\) ise yönünü tam tersine çevirir.`,
          en: R`Adding two vectors (\(\mathbf u + \mathbf v\)) adds matching coordinates. Geometrically, place the tail of \(\mathbf v\) at the tip of \(\mathbf u\) (the <i>head-to-tail</i> or <b>parallelogram law</b>). Multiplying by a scalar \(\lambda\in\mathbb{R}\) stretches or shrinks \(\mathbf u\), and flips its direction whenever \(\lambda < 0\).`,
        },
        {
          tr: R`Bu geometri hemen ünlü <b>Üçgen Eşitsizliğini</b> verir: iki nokta arasındaki en kısa yol düz çizgidir, yani \(\mathbf u\) ve \(\mathbf v\) boyunca iki adımda yürümek (\(\|\mathbf u\| + \|\mathbf v\|\)) doğrudan \(\mathbf u + \mathbf v\) boyunca gitmekten (\(\|\mathbf u + \mathbf v\|\)) asla daha kısa olamaz!`,
          en: R`This picture immediately reveals the <b>Triangle Inequality</b>: a straight shortcut is never longer than a two-leg detour, so \(\|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|\)!`,
        },
        {
          analogy: {
            title: { tr: "Yan Rüzgârda Uçan Uçak", en: "Airplane in a Crosswind" },
            text: {
              tr: R`Uçağın motoru onu \(\mathbf u\) yönünde iterken yan rüzgâr da \(\mathbf v\) yönünde sürükler; uçağın yerdeki gerçek hareketi \(\mathbf u + \mathbf v\) toplamıdır. Motor gücünü iki katına çıkarmak (\(\lambda = 2\)) sadece \(\mathbf u\) okunu iki kat uzatır, yönünü değiştirmez!`,
              en: R`The jet engine pushes the plane by \(\mathbf u\) while a crosswind drifts it by \(\mathbf v\); its true ground path is \(\mathbf u + \mathbf v\). Doubling engine thrust (\(\lambda = 2\)) doubles the length of \(\mathbf u\); reversing thrust (\(\lambda = -1\)) flips \(\mathbf u\) backward.`,
            },
          },
        },
        { eq: R`\mathbf u + \mathbf v = (u_1+v_1,\ u_2+v_2), \qquad \lambda\mathbf u = (\lambda u_1,\ \lambda u_2), \qquad \|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|` },
        {
          example: {
            title: { tr: "Doğrusal bileşim ve üçgen eşitsizliği kontrolü", en: "Linear combination & triangle inequality check" },
            problem: {
              tr: R`\(\mathbf u = (2, 1)\) ve \(\mathbf v = (-1, 3)\) için \(2\mathbf u + \mathbf v\) ve \(\mathbf u - \mathbf v\) vektörlerini bulun; \(\|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|\) olduğunu kontrol edin.`,
              en: R`For \(\mathbf u = (2, 1)\) and \(\mathbf v = (-1, 3)\), compute \(2\mathbf u + \mathbf v\) and \(\mathbf u - \mathbf v\), and verify \(\|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|\).`,
            },
            steps: [
              {
                expr: R`2\mathbf u + \mathbf v = (4, 2) + (-1, 3) = (3, 5)`,
                note: { tr: R`Önce \(\mathbf u\)'nun her bileşenini \(2\) ile çarpar, sonra \(\mathbf v\) ile toplarız.`, en: R`First multiply each entry of \(\mathbf u\) by \(2\), then add \(\mathbf v\) componentwise.` },
              },
              {
                expr: R`\mathbf u - \mathbf v = (2 - (-1),\ 1 - 3) = (3, -2)`,
                note: { tr: R`Çıkarma, \(\mathbf v\)'nin ucundan \(\mathbf u\)'nun ucuna giden vektördür.`, en: R`Subtraction points from the tip of \(\mathbf v\) to the tip of \(\mathbf u\).` },
              },
              {
                expr: R`\|\mathbf u + \mathbf v\| = \|(1, 4)\| = \sqrt{17} \approx 4{,}12 \le \sqrt{5} + \sqrt{10} \approx 5{,}40`,
                note: { tr: R`Doğrudan gitmek (\(4{,}12\)) iki parça yürümekten (\(5{,}40\)) kesinlikle kısadır ✓.`, en: R`Going straight (\(4.12\)) is strictly shorter than walking both legs (\(5.40\)) ✓.` },
              },
            ],
            answer: {
              tr: R`\(2\mathbf u + \mathbf v = (3, 5)\) ve \(\mathbf u - \mathbf v = (3, -2)\).`,
              en: R`\(2\mathbf u + \mathbf v = (3, 5)\) and \(\mathbf u - \mathbf v = (3, -2)\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "u − v okunun yönünü ters çizmek!", en: "Drawing u − v backwards!" },
            text: {
              tr: R`Çıkarma vektörü \(\mathbf u - \mathbf v\), \(\mathbf u\)'dan \(\mathbf v\)'ye DEĞİL, <b>\(\mathbf v\)'nin ucundan \(\mathbf u\)'nun ucuna</b> işaret eder! Neden? Çünkü \(\mathbf v + (\mathbf u - \mathbf v) = \mathbf u\) eşitliği sağlanmalıdır.`,
              en: R`The difference \(\mathbf u - \mathbf v\) points from the tip of <b>\(\mathbf v\) toward the tip of \(\mathbf u\)</b> (not the other way around!). Why? Because \(\mathbf v + (\mathbf u - \mathbf v)\) must land back at \(\mathbf u\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`\(\lambda\) kaydırıcısını \(-1\)'e çekin: mavi kesikli \(-\mathbf u\) geriye döner ve turuncu sonuç \(\mathbf v - \mathbf u\) olur.`, en: R`Slide \(\lambda\) to \(-1\): the dashed \(-\mathbf u\) flips backward and the orange vector becomes \(\mathbf v - \mathbf u\).` },
            { tr: R`"Aynı yön (Eşitlik)" düğmesine tıklayın: paralelkenar düz çizgiye çöker ve \(\|\lambda\mathbf u + \mathbf v\| = \|\lambda\mathbf u\| + \|\mathbf v\|\) eşitliği yakalanır!`, en: R`Click "Same direction (Equality)" to collapse the parallelogram into a line where \(\|\lambda\mathbf u + \mathbf v\| = \|\lambda\mathbf u\| + \|\mathbf v\|\)!` },
            { tr: R`\(\mathbf u\) ve \(\mathbf v\) uçlarını sürükleyerek [[linear-combination|doğrusal bileşim]] \(\lambda\mathbf u + \mathbf v\)'nin nasıl değiştiğini gözlemleyin.`, en: R`Drag the tips of \(\mathbf u\) and \(\mathbf v\) freely to see how the [[linear-combination|linear combination]] \(\lambda\mathbf u + \mathbf v\) responds.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.ops ??= { u: [2.2, 1.2], v: [0.8, 2.2], lam: 1 });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 280,
          interactive: true,
          hint: L({ tr: "u ve v uçlarını sürükleyin", en: "Drag the tips of u and v" }),
        });

        let slLam;
        const draw = () => {
          const lu = vScale(s.u, s.lam);
          const sum = vAdd(lu, s.v);
          plot.draw({
            x: [-5, 5],
            y: [-4, 5],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            polygons: [{ pts: [[0, 0], [lu[0], lu[1]], [sum[0], sum[1]], [s.v[0], s.v[1]]], fill: "rgba(42,120,214,0.09)", stroke: COLORS.muted, dash: [4, 4], width: 1.2 }],
            vectors: [
              { to: s.u, color: COLORS.c1, label: "u" },
              { to: s.v, color: COLORS.c3, label: "v" },
              ...(s.lam !== 1 ? [{ to: [lu[0], lu[1]], color: COLORS.c1, dash: [4, 3], label: "λu" }] : []),
              { to: [sum[0], sum[1]], color: COLORS.c2, width: 3, label: "λu+v" },
            ],
            handles: [
              { id: "u", x: s.u[0], y: s.u[1], color: COLORS.c1, onDrag: (x, y) => { s.u = [x, y]; draw(); } },
              { id: "v", x: s.v[0], y: s.v[1], color: COLORS.c3, onDrag: (x, y) => { s.v = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(${tx(s.lam, 1)}\\mathbf u + \\mathbf v = (${tx(sum[0], 2)},\\ ${tx(sum[1], 2)}),\\quad \\|\\lambda\\mathbf u+\\mathbf v\\|=${tx(vNorm(sum), 2)} \\le \\|\\lambda\\mathbf u\\|+\\|\\mathbf v\\|=${tx(vNorm(lu) + vNorm(s.v), 2)}\\)`;
        };
        const setPreset = (u, v, lam) => { s.u = u; s.v = v; s.lam = lam; slLam.set(lam); draw(); };
        presets.append(
          makePresetBtn({ tr: "Paralelkenar", en: "Parallelogram" }, () => setPreset([2.2, 1.2], [0.8, 2.2], 1)),
          makePresetBtn({ tr: "Aynı yön (Eşitlik)", en: "Same dir (Equality)" }, () => setPreset([2, 1], [1.4, 0.7], 1)),
          makePresetBtn({ tr: "Fark (λ=−1)", en: "Difference (λ=−1)" }, () => setPreset([2, 1], [1, 2.5], -1)),
        );
        slLam = slider("λ", { min: -2, max: 2, step: 0.1, value: s.lam, onInput: (v) => { s.lam = v; draw(); } });
        ctl.append(slLam);
        draw();
      },
    },
    {
      id: "vec-dot",
      mathId: "m-vec-dot",
      title: { tr: "Nokta Çarpım, Açı ve Diklik Testi", en: "Dot Product, Angle & Orthogonality Test" },
      body: [
        {
          tr: R`İki vektörü çarpıp <b>tek bir sayı</b> (skaler) üreten [[dot-product|nokta çarpım]] \(\mathbf u \cdot \mathbf v\), eşleşen bileşenleri çarpıp toplar: \(u_1 v_1 + u_2 v_2\). Mucizevi olan şudur: bu basit çarp-topla hesabı aynı zamanda iki ok arasındaki \(\theta\) açısını doğrudan ölçer!`,
          en: R`The [[dot-product|dot product]] \(\mathbf u \cdot \mathbf v\) multiplies matching entries and adds them up (\(u_1 v_1 + u_2 v_2\)) to produce a <b>single number</b> (a scalar). Remarkably, this tiny arithmetic sum directly measures the angle \(\theta\) between the two arrows!`,
        },
        {
          tr: R`İşaretine tek bakışta açıyı sınıflandırabilirsiniz: \(\mathbf u \cdot \mathbf v > 0\) ise <b>dar açı</b> (aynı tarafa bakıyorlar), \(\mathbf u \cdot \mathbf v = 0\) ise <b>tam \(90^\circ\) dik ([[orthogonality|ortogonal]])</b>, \(\mathbf u \cdot \mathbf v < 0\) ise <b>geniş açı</b> (ters tarafa bakıyorlar).`,
          en: R`Its sign classifies the angle instantly: \(\mathbf u \cdot \mathbf v > 0\) means <b>acute</b> (pointing roughly together), \(\mathbf u \cdot \mathbf v = 0\) means <b>exact \(90^\circ\) perpendicular ([[orthogonality|orthogonal]])</b>, and \(\mathbf u \cdot \mathbf v < 0\) means <b>obtuse</b> (pointing opposite).`,
        },
        {
          analogy: {
            title: { tr: "Alışveriş Faturası ve Kızak İtmek", en: "Grocery Bill & Pushing a Sled" },
            text: {
              tr: R`Cebirsel olarak nokta çarpım bir market faturasıdır: \((3\text{ elma},\ 2\text{ süt}) \cdot (10\text{ TL},\ 25\text{ TL}) = 3\cdot 10 + 2\cdot 25 = 80\text{ TL}\). Fiziksel olarak ise bir kızağı \(\theta\) açısıyla ittiğinizde yapılan iş \(\|\mathbf F\|\|\mathbf d\|\cos\theta\)'dır: kızağı yan taraftan (\(90^\circ\)) iterseniz ileriye hiç hareket etmez, yani nokta çarpım \(0\)'dır!`,
              en: R`Algebraically, a dot product is a grocery bill: \((3\text{ apples},\ 2\text{ milks}) \cdot (2\text{ USD},\ 4\text{ USD}) = 3(2)+2(4) = 14\text{ USD}\). Physically, pushing a sled at angle \(\theta\) only uses the forward part \(\|\mathbf F\|\cos\theta\): pushing strictly sideways (\(90^\circ\)) does zero forward work (\(\mathbf u \cdot \mathbf v = 0\))!`,
            },
          },
        },
        { eq: R`\mathbf u \cdot \mathbf v = u_1 v_1 + u_2 v_2 = \|\mathbf u\|\,\|\mathbf v\|\cos\theta, \qquad \mathbf u \perp \mathbf v \iff \mathbf u \cdot \mathbf v = 0` },
        {
          example: {
            title: { tr: "Diklik testi ve iki vektör arasındaki açı", en: "Testing orthogonality and finding an angle" },
            problem: {
              tr: R`(a) \(\mathbf u = (2, -3)\) ve \(\mathbf v = (6, 4)\) dik midir? (b) \(\mathbf a = (1, 0)\) ile \(\mathbf b = (1, 1)\) arasındaki açı kaç derecedir?`,
              en: R`(a) Are \(\mathbf u = (2, -3)\) and \(\mathbf v = (6, 4)\) orthogonal? (b) Find the angle between \(\mathbf a = (1, 0)\) and \(\mathbf b = (1, 1)\).`,
            },
            steps: [
              {
                expr: R`\mathbf u \cdot \mathbf v = (2)(6) + (-3)(4) = 12 - 12 = 0`,
                note: { tr: R`Nokta çarpım tam \(0\) çıktı! Sıfırdan farklı oldukları için kesinlikle \(90^\circ\) diktirler.`, en: R`The dot product is exactly \(0\)! Since both are nonzero, they meet at \(90^\circ\).` },
              },
              {
                expr: R`\mathbf a \cdot \mathbf b = 1\cdot 1 + 0\cdot 1 = 1, \qquad \|\mathbf a\| = 1, \qquad \|\mathbf b\| = \sqrt{1^2 + 1^2} = \sqrt{2}`,
                note: { tr: R`Açı formülü için nokta çarpım ve iki normu hesaplıyoruz.`, en: R`Compute the dot product and both norms for the cosine formula.` },
              },
              {
                expr: R`\cos\theta = \frac{\mathbf a \cdot \mathbf b}{\|\mathbf a\|\,\|\mathbf b\|} = \frac{1}{1 \cdot \sqrt{2}} = \frac{\sqrt{2}}{2} \implies \theta = 45^\circ`,
                note: { tr: R`Kosinüsü \(\sqrt{2}/2\) olan açı \(45^\circ\) (\(\pi/4\) radyan) olur.`, en: R`The angle whose cosine is \(\sqrt{2}/2\) is \(45^\circ\) (\(\pi/4\) radians).` },
              },
            ],
            answer: {
              tr: R`(a) Evet, \(\mathbf u \perp \mathbf v\). (b) \(\theta = 45^\circ\).`,
              en: R`(a) Yes, \(\mathbf u \perp \mathbf v\). (b) \(\theta = 45^\circ\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Nokta çarpımın sonucu vektör DEĞİL, tek bir sayıdır!", en: "The dot product outputs a NUMBER, not a vector!" },
            text: {
              tr: R`\((2, 3) \cdot (4, 5)\) işlemini \((8, 15)\) diye bırakmak yaygın bir acemi hatasıdır. İki çarpımı mutlaka <b>toplamalısınız</b>: \(8 + 15 = 23\). Ayrıca iki sıfırdan farklı sayının çarpımı sıfır olamaz, ama iki sıfırdan farklı vektörün nokta çarpımı sıfır olabilir (dik olduklarında!).`,
              en: R`Do not leave \((2, 3) \cdot (4, 5)\) as a pair \((8, 15)\) — you MUST <b>add</b> them to get a single number: \(8 + 15 = 23\). Also, unlike ordinary numbers, two nonzero vectors CAN have a zero dot product (whenever they are perpendicular!).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`"90° (Dik)" düğmesine basın ve \(\mathbf u \cdot \mathbf v = 0\) anında turuncu gölgenin tamamen kaybolduğunu görün.`, en: R`Click "90° (Right)" and watch \(\mathbf u \cdot \mathbf v = 0\) as the orange projection vanishes completely.` },
            { tr: R`"135°" veya "180°" düğmelerine tıklayarak nokta çarpımın nasıl negatife döndüğünü inceleyin.`, en: R`Click "135°" or "180°" to see the dot product turn negative as \(\mathbf u\) points opposite to \(\mathbf v\).` },
            { tr: R`\(\|\mathbf u\|\) uzunluğunu iki katına çıkarın: açı sabit kalırken \(\mathbf u \cdot \mathbf v\) de tam iki katına çıkar.`, en: R`Double \(\|\mathbf u\|\): the angle stays unchanged while \(\mathbf u \cdot \mathbf v\) scales proportionally.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.dot ??= { ang: 55, len: 2.8 });
        const v = [3, 0];
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc, msg);
        const plot = createCanvas2D(host, { height: 265 });

        let slAng;
        const draw = () => {
          const rad = (s.ang * Math.PI) / 180;
          const u = [s.len * Math.cos(rad), s.len * Math.sin(rad)];
          const dp = vDot(u, v);
          const pr = vProject(u, v);
          plot.draw({
            x: [-4, 4.5],
            y: [-3, 3.8],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            angles: s.ang > 0 ? [{ cx: 0, cy: 0, r: 0.9, start: 0, end: rad, color: COLORS.c2, label: `${s.ang}°` }] : [],
            segments: [{ from: [u[0], u[1]], to: [pr[0], pr[1]], color: COLORS.muted, dash: [4, 3] }],
            vectors: [
              { to: v, color: COLORS.c3, label: "v" },
              { to: [pr[0], pr[1]], color: COLORS.c2, width: 3.5, label: "proj" },
              { to: [u[0], u[1]], color: COLORS.c1, label: "u" },
            ],
          });
          calc.textContent = `\\(\\mathbf u\\cdot\\mathbf v = ${tx(dp, 2)},\\qquad \\cos\\theta = ${tx(Math.cos(rad), 3)},\\qquad \\operatorname{proj}_{\\mathbf v}\\mathbf u = (${tx(pr[0], 2)},\\ 0)\\)`;
          if (Math.abs(dp) < 0.08) {
            msg.className = "pc-msg good";
            msg.textContent = L({ tr: "Dik (Ortogonal): u·v = 0 ve izdüşüm sıfır vektörü!", en: "Orthogonal: u·v = 0 and the projection collapses to the zero vector!" });
          } else if (dp > 0) {
            msg.className = "pc-msg info";
            msg.textContent = L({ tr: "Dar açı (u·v > 0): u'nun v yönünde pozitif bileşeni var.", en: "Acute angle (u·v > 0): u has a positive component along v." });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({ tr: "Geniş açı (u·v < 0): u, v'nin ters yönüne bakıyor.", en: "Obtuse angle (u·v < 0): u points opposite to v." });
          }
        };
        const setAng = (a) => { s.ang = a; slAng.set(a); draw(); };
        presets.append(
          makePresetBtn({ tr: "0°", en: "0°" }, () => setAng(0)),
          makePresetBtn({ tr: "45°", en: "45°" }, () => setAng(45)),
          makePresetBtn({ tr: "90° (Dik)", en: "90° (Right)" }, () => setAng(90)),
          makePresetBtn({ tr: "135°", en: "135°" }, () => setAng(135)),
          makePresetBtn({ tr: "180°", en: "180°" }, () => setAng(180)),
        );
        slAng = slider("θ (°)", { min: 0, max: 180, step: 5, value: s.ang, fmt: (v) => `${v}°`, onInput: (v) => { s.ang = v; draw(); } });
        ctl.append(
          slAng,
          slider("‖u‖", { min: 0.5, max: 3.5, step: 0.1, value: s.len, onInput: (v) => { s.len = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "vec-ineq",
      mathId: "m-vec-cs",
      title: { tr: "Dik İzdüşüm ve Cauchy–Schwarz Eşitsizliği", en: "Orthogonal Projection & Cauchy–Schwarz Inequality" },
      body: [
        {
          tr: R`Bir \(\mathbf u\) vektörünü başka bir \(\mathbf v\) yönü boyunca iki dik parçaya ayırmak analiz ve lineer cebirin en güçlü numaralarından biridir: \(\mathbf v\) üzerindeki gölge parçasına [[projection|dik izdüşüm]] \(\operatorname{proj}_{\mathbf v}\mathbf u\), kalan parçaya ise \(\mathbf u_\perp = \mathbf u - \operatorname{proj}_{\mathbf v}\mathbf u\) deriz ve bu kalan parça \(\mathbf v\)'ye daima \(90^\circ\) diktir.`,
          en: R`Splitting a vector \(\mathbf u\) into a piece along \(\mathbf v\) and a piece perpendicular to \(\mathbf v\) is one of the most useful tools in mathematics. The shadow along \(\mathbf v\) is the [[projection|orthogonal projection]] \(\operatorname{proj}_{\mathbf v}\mathbf u\), and the leftover piece \(\mathbf u_\perp = \mathbf u - \operatorname{proj}_{\mathbf v}\mathbf u\) is ALWAYS perpendicular to \(\mathbf v\).`,
        },
        {
          tr: R`Aynı zamanda \(|\cos\theta| \le 1\) olduğu için her iki vektör [[cauchy-schwarz|Cauchy–Schwarz eşitsizliğini]] sağlar: \(|\mathbf u \cdot \mathbf v| \le \|\mathbf u\|\,\|\mathbf v\|\). Eşitlik ancak ve ancak iki vektör aynı doğru üzerindeyse (birbirinin katıysa) gerçekleşir!`,
          en: R`Because \(|\cos\theta| \le 1\), every pair of vectors obeys the [[cauchy-schwarz|Cauchy–Schwarz inequality]]: \(|\mathbf u \cdot \mathbf v| \le \|\mathbf u\|\,\|\mathbf v\|\). Equality holds if and only if the two vectors lie along the same line (one is a scalar multiple of the other)!`,
        },
        {
          analogy: {
            title: { tr: "Tepedeki Güneşin Yola Düşen Gölgesi", en: "Noon Sun Casting a Shadow on a Road" },
            text: {
              tr: R`Düz bir yol (\(\mathbf v\)) boyunca eğik duran bir sokak lambasını (\(\mathbf u\)) düşünün. Güneş tam yolun tepesinden vurduğunda lambanın yola düşen gölgesi \(\operatorname{proj}_{\mathbf v}\mathbf u\) olur. Gölgenin ucundan lambanın tepesine çıkan dik yükseklik çizgisi ise \(\mathbf u_\perp\)'dir!`,
              en: R`Picture a tilted lamppost (\(\mathbf u\)) rising above a straight road (\(\mathbf v\)). When the sun shines straight down perpendicular to the road, the shadow on the road is \(\operatorname{proj}_{\mathbf v}\mathbf u\), and the vertical drop from the lamp to the shadow tip is \(\mathbf u_\perp\)!`,
            },
          },
        },
        { eq: R`\operatorname{proj}_{\mathbf v}\mathbf u = \frac{\mathbf u \cdot \mathbf v}{\|\mathbf v\|^2}\,\mathbf v, \qquad |\mathbf u \cdot \mathbf v| \le \|\mathbf u\|\,\|\mathbf v\|` },
        {
          example: {
            title: { tr: "Dik izdüşüm hesaplama ve diklik doğrulaması", en: "Computing an orthogonal projection & verifying orthogonality" },
            problem: {
              tr: R`\(\mathbf u = (3, 4)\) vektörünün \(\mathbf v = (1, 1)\) üzerindeki dik izdüşümünü ve dik bileşeni \(\mathbf u_\perp\)'yi bulun.`,
              en: R`Find the orthogonal projection of \(\mathbf u = (3, 4)\) onto \(\mathbf v = (1, 1)\) and the perpendicular component \(\mathbf u_\perp\).`,
            },
            steps: [
              {
                expr: R`\mathbf u \cdot \mathbf v = 3(1) + 4(1) = 7, \qquad \|\mathbf v\|^2 = 1^2 + 1^2 = 2`,
                note: { tr: R`Pay için nokta çarpımı, payda için \(\mathbf v\)'nin normunun karesini hesaplıyoruz.`, en: R`Compute the dot product for the numerator and \(\|\mathbf v\|^2 = \mathbf v \cdot \mathbf v\) for the denominator.` },
              },
              {
                expr: R`\operatorname{proj}_{\mathbf v}\mathbf u = \frac{7}{2}(1, 1) = (3{,}5,\ 3{,}5)`,
                note: { tr: R`Bu skaler oranı \(\mathbf v\) vektörüyle çarparak gölge vektörünü elde ederiz.`, en: R`Multiply this scalar ratio by \(\mathbf v\) to get the shadow vector.` },
              },
              {
                expr: R`\mathbf u_\perp = \mathbf u - \operatorname{proj}_{\mathbf v}\mathbf u = (-0{,}5,\ 0{,}5), \qquad \mathbf u_\perp \cdot \mathbf v = -0{,}5 + 0{,}5 = 0`,
                note: { tr: R`Kalan parça gerçekten \(\mathbf v\)'ye tam \(90^\circ\) dik çıktı ✓!`, en: R`The leftover piece is indeed strictly perpendicular to \(\mathbf v\) ✓!` },
              },
            ],
            answer: {
              tr: R`\(\operatorname{proj}_{\mathbf v}\mathbf u = (3{,}5,\ 3{,}5)\) ve \(\mathbf u_\perp = (-0{,}5,\ 0{,}5)\).`,
              en: R`\(\operatorname{proj}_{\mathbf v}\mathbf u = (3.5,\ 3.5)\) and \(\mathbf u_\perp = (-0.5,\ 0.5)\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Paydada ‖v‖ değil, ‖v‖² var!", en: "Divide by ‖v‖², NOT ‖v‖!" },
            text: {
              tr: R`İzdüşüm formülünde en sık unutulan kare: \(\frac{\mathbf u \cdot \mathbf v}{\|\mathbf v\|^2}\mathbf v\). Bir \(\|\mathbf v\|\) gölge uzunluğunu bulmak, ikinci \(\|\mathbf v\|\) ise \(\mathbf v\)'yi birim vektör \(\hat{\mathbf v}\) yapmak için gerekir — ikisi çarpılınca \(\|\mathbf v\|^2 = \mathbf v \cdot \mathbf v\) olur!`,
              en: R`The #1 mistake in projection formulas is writing \(\|\mathbf v\|\) instead of \(\|\mathbf v\|^2\) in \(\frac{\mathbf u \cdot \mathbf v}{\|\mathbf v\|^2}\mathbf v\). One factor of \(\|\mathbf v\|\) finds the shadow length and the second turns \(\mathbf v\) into a unit vector \(\hat{\mathbf v}\)!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`"Aynı doğru (Eşitlik)" düğmesine basın: dik hata çizgisi kaybolur ve \(|\mathbf u\cdot\mathbf v| = \|\mathbf u\|\|\mathbf v\|\) eşitliği sağlanır.`, en: R`Click "Collinear (Equality)": the perpendicular residual disappears and \(|\mathbf u\cdot\mathbf v| = \|\mathbf u\|\|\mathbf v\|\) hits exact equality.` },
            { tr: R`"Dik (Gölge = 0)" düğmesine tıklayın: gölge sıfıra çöker ve \(\mathbf u\)'nun tamamı \(\mathbf u_\perp\) olur.`, en: R`Click "Orthogonal (Shadow = 0)": the projection collapses to zero and all of \(\mathbf u\) lies in \(\mathbf u_\perp\).` },
            { tr: R`\(\mathbf u\) ve \(\mathbf v\)'yi sürükleyin; kesikli hata segmentinin yeşil \(\mathbf v\) doğrultusuna daima \(90^\circ\) dik kaldığını görün.`, en: R`Drag \(\mathbf u\) and \(\mathbf v\) freely and notice the dashed residual segment always meets the line of \(\mathbf v\) at \(90^\circ\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.ineq ??= { u: [2.4, 3.0], v: [3.2, 1.0] });
        const presets = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, host, calc);
        const plot = createCanvas2D(host, {
          height: 270,
          interactive: true,
          hint: L({ tr: "u ve v uçlarını sürükleyin", en: "Drag tips of u and v" }),
        });
        const draw = () => {
          const pr = vProject(s.u, s.v);
          const nu = vNorm(s.u), nv = vNorm(s.v);
          const dp = Math.abs(vDot(s.u, s.v));
          plot.draw({
            x: [-4.5, 5],
            y: [-3.5, 5],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            lines: nv > 1e-6 ? [{ a: s.v[1], b: -s.v[0], c: 0, color: COLORS.grid, dash: [4, 4], width: 1.4 }] : [],
            segments: [{ from: s.u, to: [pr[0], pr[1]], color: COLORS.c4, dash: [4, 3], width: 2 }],
            vectors: [
              { to: s.v, color: COLORS.c3, label: "v" },
              { to: [pr[0], pr[1]], color: COLORS.c2, width: 3.3, label: "proj" },
              { to: s.u, color: COLORS.c1, label: "u" },
            ],
            handles: [
              { id: "u", x: s.u[0], y: s.u[1], color: COLORS.c1, onDrag: (x, y) => { s.u = [x, y]; draw(); } },
              { id: "v", x: s.v[0], y: s.v[1], color: COLORS.c3, onDrag: (x, y) => { s.v = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(\\operatorname{proj}_{\\mathbf v}\\mathbf u = (${tx(pr[0], 2)},\\ ${tx(pr[1], 2)}),\\qquad |\\mathbf u\\cdot\\mathbf v| = ${tx(dp, 2)} \\le \\|\\mathbf u\\|\\|\\mathbf v\\| = ${tx(nu * nv, 2)}\\)`;
        };
        presets.append(
          makePresetBtn({ tr: "Dar açı", en: "Acute" }, () => { s.u = [2.4, 3.0]; s.v = [3.2, 1.0]; draw(); }),
          makePresetBtn({ tr: "Dik (Gölge = 0)", en: "Orthogonal (0)" }, () => { s.u = [-1.5, 3.0]; s.v = [3.0, 1.5]; draw(); }),
          makePresetBtn({ tr: "Aynı doğru (Eşitlik)", en: "Collinear (=)" }, () => { s.u = [3.6, 1.8]; s.v = [2.0, 1.0]; draw(); }),
          makePresetBtn({ tr: "Geniş açı", en: "Obtuse" }, () => { s.u = [-2.5, 2.0]; s.v = [3.0, 0.8]; draw(); }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "2B Vektör Laboratuvarı", en: "2D Vector Lab" },
    sub: {
      tr: R`\(\mathbf u\) ve \(\mathbf v\) uçlarını serbestçe sürükleyin; hazır senaryolarla diklik, paralellik, fark, izdüşüm ve birim vektörleri tek ekranda karşılaştırın.`,
      en: R`Drag \(\mathbf u\) and \(\mathbf v\) freely or load presets to compare orthogonality, parallelism, sum/difference, projection, and unit vectors side by side.`,
    },
    experiments: [
      {
        tr: R`<b>Diklik testi:</b> <i>"Dik (90°)"</i> ayarına tıklayın ve \(\mathbf u \cdot \mathbf v = 0\), \(\theta = 90^\circ\) iken paralelkenar alanının tam \(\|\mathbf u\|\|\mathbf v\|\) olduğunu görün.`,
        en: R`<b>Orthogonality check:</b> click <i>"Orthogonal (90°)"</i> and verify \(\mathbf u \cdot \mathbf v = 0\), \(\theta = 90^\circ\), and parallelogram area \(= \|\mathbf u\|\|\mathbf v\|\).`,
      },
      {
        tr: R`<b>Paralelkenar ne zaman çöker?</b> <i>"Paralel (Alan=0)"</i> ayarına basın: iki vektör aynı doğrultuda olduğu için <b>Alan |det|</b> tam sıfır olur!`,
        en: R`<b>When does area collapse?</b> Click <i>"Parallel (Area=0)"</i>: collinear vectors span zero 2D area so <b>Area |det|</b> hits 0!`,
      },
      {
        tr: R`<b>Birim çember keşfi:</b> <i>"Birim vektör"</i> moduna geçip \(\mathbf u\)'yu uzatın veya kısaltın — \(\hat{\mathbf u}\) okunun sadece döndüğünü ama uzunluğunun hep \(1\) kaldığını izleyin.`,
        en: R`<b>Unit circle check:</b> switch to <i>"Unit vectors"</i> mode and stretch \(\mathbf u\) — notice \(\hat{\mathbf u}\) rotates without ever leaving the unit circle.`,
      },
      {
        tr: R`<b>İki nokta arası uzaklık:</b> <i>"Fark u−v"</i> moduna geçin: turuncu ok tam \(\mathbf v\)'nin ucundan \(\mathbf u\)'nun ucuna uzanır ve uzunluğu \(\|\mathbf u - \mathbf v\|\) iki uç arasındaki mesafedir.`,
        en: R`<b>Distance between tips:</b> switch to <i>"Diff u−v"</i>: the orange arrow connects the tip of \(\mathbf v\) to the tip of \(\mathbf u\), with length \(\|\mathbf u - \mathbf v\|\).`,
      },
    ],
    build(host, state) {
      const s = (state.pg ??= { u: [3, 1.5], v: [1, 2.5], mode: "proj" });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const plot = createCanvas2D(stage, {
        height: 400,
        interactive: true,
        hint: L({ tr: "u ve v uçlarını sürükleyin", en: "Drag tips of u and v" }),
      });
      const presets = h("div", { class: "t-controls" });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır senaryolar", en: "Quick presets" }) }),
        presets,
        h("div", { class: "mini-title", text: L({ tr: "Gösterim modu", en: "Display mode" }) }),
        ctl,
        tiles,
        calc,
      );

      let segMode;
      const draw = () => {
        const sum = vAdd(s.u, s.v);
        const diff = vSub(s.u, s.v);
        const proj = vProject(s.u, s.v);
        const deg = (vAngle(s.u, s.v) * 180) / Math.PI;
        const detArea = Math.abs(s.u[0] * s.v[1] - s.u[1] * s.v[0]);
        const extra = [];
        const segs = [];
        if (s.mode === "sum") extra.push({ to: [sum[0], sum[1]], color: COLORS.c2, label: "u+v" });
        if (s.mode === "diff") extra.push({ from: s.v, to: s.u, color: COLORS.c2, label: "u−v" });
        if (s.mode === "proj") {
          extra.push({ to: [proj[0], proj[1]], color: COLORS.c2, width: 3, label: "proj" });
          segs.push({ from: s.u, to: [proj[0], proj[1]], color: COLORS.muted, dash: [4, 3] });
        }
        if (s.mode === "unit") {
          const nu = vNorm(s.u) || 1;
          const nv = vNorm(s.v) || 1;
          extra.push(
            { to: [s.u[0] / nu, s.u[1] / nu], color: COLORS.c2, width: 3, label: "û" },
            { to: [s.v[0] / nv, s.v[1] / nv], color: COLORS.c4, width: 3, label: "v̂" },
          );
        }
        plot.draw({
          x: [-5, 5],
          y: [-5, 5],
          equalAspect: true,
          xLabel: "x",
          yLabel: "y",
          circles: s.mode === "unit" ? [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [4, 4] }] : [],
          segments: segs,
          vectors: [
            { to: s.u, color: COLORS.c1, label: "u" },
            { to: s.v, color: COLORS.c3, label: "v" },
            ...extra,
          ],
          handles: [
            { id: "u", x: s.u[0], y: s.u[1], color: COLORS.c1, onDrag: (x, y) => { s.u = [x, y]; draw(); } },
            { id: "v", x: s.v[0], y: s.v[1], color: COLORS.c3, onDrag: (x, y) => { s.v = [x, y]; draw(); } },
          ],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "u · v" }), h("span", { class: "pg-tile-value", text: ns(vDot(s.u, s.v), 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "θ" }), h("span", { class: "pg-tile-value", text: `${ns(deg, 1)}°` })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Alan |det|", en: "Area |det|" }) }), h("span", { class: "pg-tile-value", text: ns(detArea, 2) })),
        );
        calc.textContent = `\\(\\mathbf u=(${tx(s.u[0], 2)},${tx(s.u[1], 2)}),\\; \\mathbf v=(${tx(s.v[0], 2)},${tx(s.v[1], 2)}),\\; \\|\\mathbf u-\\mathbf v\\|=${tx(vNorm(diff), 2)}\\)`;
      };

      const applyPreset = (u, v, mode) => {
        s.u = u; s.v = v;
        if (mode) { s.mode = mode; segMode.set(mode); }
        draw();
      };
      presets.append(
        makePresetBtn({ tr: "Dik (90°)", en: "Orthogonal (90°)" }, () => applyPreset([3, 1.5], [-1.5, 3], "proj")),
        makePresetBtn({ tr: "Paralel (Alan=0)", en: "Parallel (Area=0)" }, () => applyPreset([4, 2], [2, 1], "sum")),
        makePresetBtn({ tr: "Geniş açı", en: "Obtuse angle" }, () => applyPreset([-2.5, 2], [3, 1], "proj")),
        makePresetBtn({ tr: "3–4–5 Birim", en: "3–4–5 Unit" }, () => applyPreset([3, 4], [4, 0], "unit")),
      );

      segMode = segmented(
        [
          ["proj", { tr: "İzdüşüm", en: "Projection" }],
          ["sum", { tr: "Toplam u+v", en: "Sum u+v" }],
          ["diff", { tr: "Fark u−v", en: "Diff u−v" }],
          ["unit", { tr: "Birim vektör", en: "Unit vectors" }],
        ],
        s.mode,
        (v) => { s.mode = v; draw(); },
      );
      ctl.append(segMode);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-vec-norm",
      title: { tr: "Vektör İşlemleri, Norm ve Temel Özellikler", en: "Vector Operations, Norm & Core Properties" },
      blocks: [
        {
          p: {
            tr: R`\(\mathbb{R}^n\) uzayındaki tüm vektör formülleri 2 boyutta öğrendiklerimizin birebir aynısıdır — yalnızca \(2\) terim yerine \(n\) terim toplanır!`,
            en: R`Every vector formula in \(\mathbb{R}^n\) is identical to the 2D version — we simply sum across \(n\) coordinates instead of \(2\)!`,
          },
        },
        {
          table: {
            head: [
              { tr: "Kavram", en: "Concept" },
              { tr: "Formül (\(\mathbb{R}^n\))", en: "Formula (\(\mathbb{R}^n\))" },
              { tr: "Geometrik anlam", en: "Geometric meaning" },
            ],
            rows: [
              [{ tr: "Öklid normu", en: "Euclidean norm" }, R`\(\|\mathbf v\| = \sqrt{v_1^2 + \dots + v_n^2}\)`, { tr: "Vektörün uzunluğu", en: "Length of the arrow" }],
              [{ tr: "İki nokta mesafesi", en: "Distance" }, R`\(d(P,Q) = \|Q - P\|\)`, { tr: "İki nokta arası düz çizgi uzaklığı", en: "Straight-line distance" }],
              [{ tr: "Birim vektör", en: "Unit vector" }, R`\(\hat{\mathbf v} = \mathbf v / \|\mathbf v\|\)`, { tr: "Uzunluğu 1 olan saf yön oku", en: "Length-1 pure direction arrow" }],
              [{ tr: "Nokta çarpım", en: "Dot product" }, R`\(\mathbf u\cdot\mathbf v = \sum_{i=1}^n u_i v_i\)`, { tr: "Hizalanma ölçüsü; 0 ise dik", en: "Alignment measure; 0 iff orthogonal" }],
              [{ tr: "Dik izdüşüm", en: "Projection" }, R`\(\operatorname{proj}_{\mathbf v}\mathbf u = \frac{\mathbf u\cdot\mathbf v}{\|\mathbf v\|^2}\mathbf v\)`, { tr: "u'nun v üzerindeki gölgesi", en: "Shadow of u onto v" }],
            ],
          },
        },
        {
          example: {
            title: { tr: "3 boyutta uzaklık ve birim vektör hesabı", en: "3D distance and unit vector" },
            problem: {
              tr: R`\(A = (1, 0, -2)\) ile \(B = (3, 2, -1)\) noktaları arasındaki uzaklığı ve \(\overrightarrow{AB}\) yönündeki birim vektörü bulun.`,
              en: R`Find the distance between \(A = (1, 0, -2)\) and \(B = (3, 2, -1)\), plus the unit vector along \(\overrightarrow{AB}\).`,
            },
            steps: [
              {
                expr: R`\mathbf v = B - A = (3 - 1,\ 2 - 0,\ -1 - (-2)) = (2, 2, 1)`,
                note: { tr: R`Koordinat koordinat çıkararak yer değiştirme vektörünü kurarız.`, en: R`Subtract coordinates componentwise to get the displacement vector.` },
              },
              {
                expr: R`\|\mathbf v\| = \sqrt{2^2 + 2^2 + 1^2} = \sqrt{4 + 4 + 1} = \sqrt{9} = 3`,
                note: { tr: R`3 boyutlu Pisagor ile tam sayı uzunluk \(3\) çıkar!`, en: R`3D Pythagoras gives a clean integer length of \(3\)!` },
              },
              {
                expr: R`\hat{\mathbf v} = \frac{1}{3}(2, 2, 1) = \left(\frac{2}{3},\ \frac{2}{3},\ \frac{1}{3}\right)`,
                note: { tr: R`Kontrol: \((4 + 4 + 1)/9 = 1\) ✓.`, en: R`Check: \((4 + 4 + 1)/9 = 1\) ✓.` },
              },
            ],
            answer: { tr: R`Uzaklık \(d(A, B) = 3\), birim vektör \((\frac{2}{3}, \frac{2}{3}, \frac{1}{3})\).`, en: R`Distance \(d(A, B) = 3\), unit vector \((\frac{2}{3}, \frac{2}{3}, \frac{1}{3})\).` },
          },
        },
      ],
    },
    {
      id: "m-vec-dot",
      title: { tr: "Nokta Çarpım ve Kosinüs Teoremi Bağlantısı", en: "Dot Product via the Law of Cosines" },
      blocks: [
        { eq: R`\mathbf u \cdot \mathbf v = \sum_{i=1}^n u_i v_i = \|\mathbf u\|\,\|\mathbf v\|\cos\theta` },
        {
          derive: {
            title: { tr: "Cebirsel ve geometrik nokta çarpımın denkliği", en: "Equivalence of algebraic and geometric dot products" },
            steps: [
              { tex: R`\|\mathbf u - \mathbf v\|^2 = \|\mathbf u\|^2 + \|\mathbf v\|^2 - 2\|\mathbf u\|\|\mathbf v\|\cos\theta`, why: { tr: "Kenarları u, v ve u−v olan üçgende liseden bildiğimiz Kosinüs Teoremini yazarız.", en: "Apply the classical Law of Cosines to the triangle with sides u, v, and u−v." } },
              { tex: R`\|\mathbf u - \mathbf v\|^2 = (\mathbf u - \mathbf v)\cdot(\mathbf u - \mathbf v) = \|\mathbf u\|^2 - 2(\mathbf u\cdot\mathbf v) + \|\mathbf v\|^2`, why: { tr: "Aynı uzunluğun karesini nokta çarpımın dağılma özelliğiyle cebirsel olarak açarız.", en: "Expand the same squared length algebraically using bilinearity and symmetry." } },
              { tex: R`-2(\mathbf u\cdot\mathbf v) = -2\|\mathbf u\|\|\mathbf v\|\cos\theta \implies \mathbf u\cdot\mathbf v = \|\mathbf u\|\|\mathbf v\|\cos\theta`, why: { tr: "İki ifadedeki ortak ‖u‖² + ‖v‖² terimlerini silip −2'ye bölünce sihirli eşitlik çıkar!", en: "Cancel ‖u‖² + ‖v‖² from both sides and divide by −2 — done!" } },
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Dikleştirme hilesi (2 boyutta anında dik vektör)", en: "Instant perpendicular vector trick in 2D" },
          text: {
            tr: R`2B'de \(\mathbf v = (a, b)\) vektörüne dik bir vektör mü lazım? İki sayının yerini değiştirin ve <b>birinin işaretini</b> eksi yapın: \((-b, a)\) veya \((b, -a)\). Kontrol: \(a(-b) + b(a) = 0\)!`,
            en: R`Need a vector perpendicular to \(\mathbf v = (a, b)\) in 2D? Just swap the two numbers and negate <b>one</b> of them: \((-b, a)\) or \((b, -a)\). Check: \(a(-b) + b(a) = 0\)!`,
          },
        },
      ],
    },
    {
      id: "m-vec-cs",
      title: { tr: "Cauchy–Schwarz ve Üçgen Eşitsizliğinin İspatı", en: "Proof of Cauchy–Schwarz & Triangle Inequality" },
      blocks: [
        {
          p: {
            tr: R`\(\mathbb{R}^2\)'de \(|\cos\theta| \le 1\) gözle görülebilir, ama \(100\) boyutlu uzayda veya fonksiyon uzaylarında açı çizemeyiz! Aşağıdaki zarif ispat yalnızca ikinci derece polinomun diskriminantını kullanır ve <b>her boyutta</b> çalışır.`,
            en: R`In 2D, \(|\cos\theta| \le 1\) is visually obvious, but in 100 dimensions or function spaces we cannot draw a protractor! The elegant proof below uses only a quadratic discriminant and works in <b>every dimension</b>.`,
          },
        },
        {
          derive: {
            title: { tr: "Cauchy–Schwarz Eşitsizliği (Her boyutta geçerli ispat)", en: "Cauchy–Schwarz Inequality (Dimension-free proof)" },
            steps: [
              { tex: R`p(t) = \|\mathbf u + t\mathbf v\|^2 = \|\mathbf v\|^2 t^2 + 2(\mathbf u\cdot\mathbf v)\,t + \|\mathbf u\|^2 \ge 0`, why: { tr: "Her reel t için bir uzunluğun karesi asla negatif olamaz (v ≠ 0 varsayalım; v = 0 ise 0 ≤ 0 zaten doğrudur).", en: "A squared length can never be negative for any real t (assume v ≠ 0; if v = 0 both sides are 0)." } },
              { tex: R`\Delta = \big(2(\mathbf u\cdot\mathbf v)\big)^2 - 4\|\mathbf v\|^2\|\mathbf u\|^2 \le 0`, why: { tr: "Grafiği hiç x-ekseninin altına inmeyen bir parabolün en fazla bir kökü olabilir, yani diskriminant Δ ≤ 0!", en: "A quadratic that stays ≥ 0 everywhere can have at most one real root, so its discriminant satisfies Δ ≤ 0!" } },
              { tex: R`(\mathbf u\cdot\mathbf v)^2 \le \|\mathbf u\|^2\|\mathbf v\|^2 \implies |\mathbf u\cdot\mathbf v| \le \|\mathbf u\|\|\mathbf v\|`, why: { tr: "Her iki tarafı 4'e bölüp karekök alınca ispat biter!", en: "Divide by 4 and take square roots to complete the proof!" } },
            ],
          },
        },
        {
          derive: {
            title: { tr: "Üçgen Eşitsizliği", en: "Triangle Inequality" },
            steps: [
              { tex: R`\|\mathbf u + \mathbf v\|^2 = \|\mathbf u\|^2 + 2(\mathbf u\cdot\mathbf v) + \|\mathbf v\|^2`, why: { tr: "Toplam vektörün normunun karesini (u+v)·(u+v) olarak açarız.", en: "Expand ‖u+v‖² = (u+v)·(u+v)." } },
              { tex: R`\le \|\mathbf u\|^2 + 2\|\mathbf u\|\|\mathbf v\| + \|\mathbf v\|^2 = (\|\mathbf u\| + \|\mathbf v\|)^2`, why: { tr: "Cauchy–Schwarz gereği u·v ≤ |u·v| ≤ ‖u‖‖v‖ yerine yazınca tam kare oluşur.", en: "By Cauchy–Schwarz, u·v ≤ ‖u‖‖v‖, turning the right side into a perfect square." } },
              { tex: R`\|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|`, why: { tr: "Her iki taraf negatif olmadığından karekök aldığımızda eşitsizlik korunur.", en: "Both sides are nonnegative, so taking square roots preserves the inequality." } },
            ],
          },
        },
        {
          example: {
            title: { tr: "Cauchy–Schwarz ile en büyük/en küçük değer bulmak", en: "Finding extreme values using Cauchy–Schwarz" },
            problem: {
              tr: R`\(x^2 + y^2 = 25\) koşulu altında \(3x + 4y\) ifadesinin alabileceği en büyük ve en küçük değer kaçtır?`,
              en: R`Given \(x^2 + y^2 = 25\), find the maximum and minimum possible values of \(3x + 4y\).`,
            },
            steps: [
              {
                expr: R`\mathbf u = (3, 4), \qquad \mathbf v = (x, y) \implies \mathbf u \cdot \mathbf v = 3x + 4y`,
                note: { tr: R`İfadeyi iki vektörün nokta çarpımı olarak yeniden okuruz!`, en: R`Recognize \(3x + 4y\) as a dot product of two vectors!` },
              },
              {
                expr: R`\|\mathbf u\| = \sqrt{3^2 + 4^2} = 5, \qquad \|\mathbf v\| = \sqrt{x^2 + y^2} = \sqrt{25} = 5`,
                note: { tr: R`İki vektörün uzunluklarını hesaplarız.`, en: R`Compute both norms.` },
              },
              {
                expr: R`|3x + 4y| \le \|\mathbf u\|\,\|\mathbf v\| = 5 \cdot 5 = 25 \implies -25 \le 3x + 4y \le 25`,
                note: { tr: R`Maksimum \((x,y)=(3,4)\)'te \(+25\), minimum \((x,y)=(-3,-4)\)'te \(-25\) olur!`, en: R`Maximum \(+25\) occurs at \((x,y)=(3,4)\) and minimum \(-25\) at \((-3,-4)\)!` },
              },
            ],
            answer: { tr: R`En büyük değer \(25\), en küçük değer \(-25\).`, en: R`Maximum is \(25\), minimum is \(-25\).` },
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
