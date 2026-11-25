import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { lineIntersection2D, pointLineDist2D, vAngle } from "../../engines/math-core.ts";
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
    id: "pg-intro",
    title: { tr: "Düzlem Geometrisi (Analitik Geometri 2B)", en: "Plane Geometry (2D Analytic Geometry)" },
    paragraphs: [
      {
        tr: R`Analitik geometri, cetvel ve pergelle çizilen şekillerin altına bir \((x, y)\) koordinat ızgarası serer. Böylece düzlemdeki doğrular ve [[conic|konik kesitler]] (çember, elips, parabol, hiperbol) cebirsel denklemlere dönüşür; uzaklık, kesişim ve açı soruları birkaç satır vektör hesabıyla kesin olarak çözülür.`,
        en: R`Analytic geometry slips an \((x, y)\) coordinate grid underneath classical geometric drawings. Lines and [[conic|conic sections]] (circles, ellipses, parabolas, hyperbolas) become clean algebraic equations, turning distance, intersection, and angle questions into quick, exact vector calculations.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> doğruların eğim, parametrik (\(\mathbf r(t) = P_0 + t\mathbf d\)) ve kapalı (\(ax + by + c = 0\)) formları arasında rahatça geçiş yapacak, [[normal-vector|normal vektörle]] nokta–doğru uzaklığını hesaplayıp ispatlayacak, çember ve elipsi odaklarıyla okuyacak ve tüm konikleri <b>dışmerkezlik</b> \(e\) sayısıyla tek bakışta sınıflandırabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will switch effortlessly between slope, parametric (\(\mathbf r(t) = P_0 + t\mathbf d\)), and implicit (\(ax + by + c = 0\)) line forms, derive and use point-to-line distance via the [[normal-vector|normal vector]], read circles and ellipses from their foci, and classify every conic at a glance using its <b>eccentricity</b> \(e\).`,
      },
    ],
    analogy: {
      title: { tr: "Kareli Defter ve El Fenerinin Işık Konisi", en: "Graph Paper & A Flashlight's Cone of Light" },
      text: {
        tr: R`Analitik geometri, bir haritanın üzerine şeffaf kareli kâğıt koymak gibidir — artık her sokağın eğimi ve iki bina arası mesafe birer sayıdır! <b>Konik kesitler</b> ise karanlıkta düz bir duvara tuttuğunuz el fenerinin ışık izidir: tam dik tutarsanız <b>çember</b>, hafif eğerseniz <b>elips</b>, ışığın kenarına paralel tutarsanız <b>parabol</b>, daha da dikleştirirseniz <b>hiperbol</b> oluşur!`,
        en: R`Analytic geometry is like placing transparent graph paper over a city map — every street and distance becomes numbers. And <b>conic sections</b> are literally the light beam of a flashlight aimed at a flat wall: straight on gives a <b>circle</b>, tilted gives an <b>ellipse</b>, tilted parallel to the beam edge gives a <b>parabola</b>, and tilted steeper gives a <b>hyperbola</b>!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 3+4 · Düzlem Geometrisi", en: "Lecture 3+4 · Plane Geometry" }],
      [{ tr: "Doğrular", en: "Lines" }, { tr: R`\(\mathbf r(t) = P_0 + t\mathbf d \ \leftrightarrow\ ax+by+c=0,\ \mathbf n=(a,b)\)`, en: R`\(\mathbf r(t) = P_0 + t\mathbf d \ \leftrightarrow\ ax+by+c=0,\ \mathbf n=(a,b)\)` }],
      [{ tr: "Konikler", en: "Conics" }, { tr: R`Çember (\(e = 0\)), Elips (\(0 < e < 1\)), Parabol (\(e = 1\)), Hiperbol (\(e > 1\))`, en: R`Circle (\(e = 0\)), Ellipse (\(0 < e < 1\)), Parabola (\(e = 1\)), Hyperbola (\(e > 1\))` }],
    ],
    tip: {
      title: { tr: "Altın kısayol: Normal vektörü hemen oku!", en: "Golden shortcut: read the normal immediately!" },
      text: {
        tr: R`\(ax + by + c = 0\) denklemini gördüğünüz an \(x\) ve \(y\)'nin katsayıları size doğruya \(90^\circ\) dik [[normal-vector|\(\mathbf n = (a, b)\)]] vektörünü, \((-b, a)\) ise doğrunun yön vektörünü verir. Hiç eğim hesabı yapmadan diklik, paralellik ve uzaklık çözebilirsiniz!`,
        en: R`The moment you see \(ax + by + c = 0\), the coefficients of \(x\) and \(y\) hand you the perpendicular [[normal-vector|normal vector]] \(\mathbf n = (a, b)\), while \((-b, a)\) points along the line. Parallelism, right angles, and distances follow without even computing slopes!`,
      },
    },
  },
  sections: [
    {
      id: "pg-lines",
      mathId: "m-pg-lines",
      title: { tr: "Düzlemde Doğrular: Eğim, Parametrik ve Normal Biçim", en: "Lines in the Plane: Slope, Parametric & Normal Form" },
      body: [
        {
          tr: R`Aynı doğruyu üç farklı gözlükle yazabiliriz: (1) Liseden tanıdık <b>eğim biçimi</b> \(y = mx + k\) (ancak dikey doğruları yazamaz!), (2) <b>parametrik biçim</b> \(\mathbf r(t) = P_0 + t\mathbf d\) (\(P_0\) başlangıç noktası, \(\mathbf d\) yön [[vector|vektörü]], \(t\) zaman parametresi), (3) <b>kapalı / normal biçim</b> \(ax + by + c = 0\).`,
          en: R`We can describe the exact same line in three ways: (1) familiar <b>slope-intercept form</b> \(y = mx + k\) (which fails for vertical lines!), (2) <b>parametric form</b> \(\mathbf r(t) = P_0 + t\mathbf d\) (anchor point \(P_0\), direction [[vector|vector]] \(\mathbf d\), time parameter \(t\)), and (3) <b>implicit / normal form</b> \(ax + by + c = 0\).`,
        },
        {
          tr: R`Kapalı denklemde katsayı vektörü [[normal-vector|\(\mathbf n = (a, b)\)]] doğruya <b>her zaman diktir</b>, yön vektörü ise \(\mathbf d = (-b, a)\)'dır. Gerçekten [[dot-product|nokta çarpımları]] \(\mathbf n \cdot \mathbf d = a(-b) + b(a) = 0\) olur!`,
          en: R`In implicit form, the coefficient vector [[normal-vector|\(\mathbf n = (a, b)\)]] is <b>always perpendicular</b> to the line, while \(\mathbf d = (-b, a)\) runs along it. Indeed, their [[dot-product|dot product]] is \(\mathbf n \cdot \mathbf d = a(-b) + b(a) = 0\)!`,
        },
        {
          analogy: {
            title: { tr: "Arabanın Rotası vs. Duvar Sensörü", en: "Car Trajectory vs. Wall Sensor" },
            text: {
              tr: R`<b>Parametrik biçim</b> \(\mathbf r(t) = P_0 + t\mathbf d\) bir arabanın \(t\). saniyede tam nerede olduğunu söyler. <b>Normal biçim</b> \(ax + by + c = 0\) ise bir lazer duvar sensörüdür: bir \((x, y)\) noktasını yerine koyduğunuzda sonuç \(0\) çıkıyorsa nokta tam çizginin üstündedir, \(\mathbf n = (a, b)\) ise duvardan dışarı dik bakan oktur!`,
              en: R`<b>Parametric form</b> \(\mathbf r(t) = P_0 + t\mathbf d\) tells you where a car is at time \(t\). <b>Normal form</b> \(ax + by + c = 0\) is a laser boundary check: plug in any point \((x, y)\) and getting \(0\) means you are right on the line, while \(\mathbf n = (a, b)\) points straight out at \(90^\circ\)!`,
            },
          },
        },
        { eq: R`\mathbf r(t) = P_0 + t\mathbf d \quad \Longleftrightarrow \quad ax + by + c = 0 \qquad \big(\mathbf n = (a,b) \perp \mathbf d = (-b,a)\big)` },
        {
          example: {
            title: { tr: "Parametrik doğrudan kapalı (normal) denkleme geçiş", en: "Converting a parametric line to implicit normal form" },
            problem: {
              tr: R`\(P_0 = (1, 2)\) noktasından geçen ve yön vektörü \(\mathbf d = (2, 1)\) olan doğrunun kapalı \(ax + by + c = 0\) denklemini bulun.`,
              en: R`Find the implicit equation \(ax + by + c = 0\) of the line through \(P_0 = (1, 2)\) with direction \(\mathbf d = (2, 1)\).`,
            },
            steps: [
              {
                expr: R`\mathbf d = (2, 1) \implies \mathbf n = (1, -2)`,
                note: { tr: R`Yön vektörüne dik bir normal vektör kuruyoruz (yer değiştir + birini eksi yap). Kontrol: \(\mathbf n \cdot \mathbf d = 2 - 2 = 0\) ✓.`, en: R`Build a normal perpendicular to \(\mathbf d\) (swap and negate one entry). Check: \(\mathbf n \cdot \mathbf d = 2 - 2 = 0\) ✓.` },
              },
              {
                expr: R`\mathbf n \cdot (\mathbf x - P_0) = 0 \implies 1(x - 1) - 2(y - 2) = 0`,
                note: { tr: R`Doğru üzerindeki her \(\mathbf x = (x,y)\) için \(\mathbf x - P_0\) vektörü normale diktir.`, en: R`For every point \(\mathbf x = (x, y)\) on the line, \(\mathbf x - P_0\) is perpendicular to \(\mathbf n\).` },
              },
              {
                expr: R`x - 1 - 2y + 4 = 0 \implies x - 2y + 3 = 0`,
                note: { tr: R`Doğrulama: \(P_0 = (1, 2)\) için \(1 - 2(2) + 3 = 0\) ve \(t = 1\) noktası \((3, 3)\) için \(3 - 6 + 3 = 0\) ✓!`, en: R`Check: \(P_0 = (1, 2)\) gives \(1 - 4 + 3 = 0\), and at \(t = 1\), \((3, 3)\) gives \(3 - 6 + 3 = 0\) ✓!` },
              },
            ],
            answer: {
              tr: R`\(x - 2y + 3 = 0\) (veya eğim biçiminde \(y = \frac{1}{2}x + \frac{3}{2}\)).`,
              en: R`\(x - 2y + 3 = 0\) (or in slope form, \(y = \frac{1}{2}x + \frac{3}{2}\)).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Dikey doğruları y = mx + k yazamazsınız!", en: "Vertical lines CANNOT be written as y = mx + k!" },
            text: {
              tr: R`\(x = 2\) dikey doğrusunun eğimi sonsuzdur (\(\Delta x = 0\)), bu yüzden \(y = mx + k\) formu dikey doğruları tamamen kaçırır. Oysa normal biçim \(1\cdot x + 0\cdot y - 2 = 0\) ve parametrik biçim \((2, 0) + t(0, 1)\) dikey doğruları hiçbir istisna olmadan kusursuz ifade eder!`,
              en: R`The vertical line \(x = 2\) has undefined slope (\(\Delta x = 0\)), so \(y = mx + k\) cannot represent it at all! In contrast, normal form \(1\cdot x + 0\cdot y - 2 = 0\) and parametric form \((2, 0) + t(0, 1)\) handle every single line with zero exceptions!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`\(t\) kaydırıcısını hareket ettirin: turuncu \(P(t) = P_0 + t\mathbf d\) noktasının mavi doğru boyunca sabit hızla kaydığını izleyin.`, en: R`Slide \(t\): watch the orange point \(P(t) = P_0 + t\mathbf d\) cruise along the blue line at constant speed.` },
            { tr: R`"Dikey x = 2" düğmesine basın: yön vektörü \(\mathbf d = (0, 1)\) yukarı bakarken normal \(\mathbf n = (1, 0)\) yatay kalır ve \(y\) terimi sıfırlanır!`, en: R`Click "Vertical x = 2": \(\mathbf d = (0, 1)\) points straight up while \(\mathbf n = (1, 0)\) points horizontally and the \(y\)-term vanishes!` },
            { tr: R`\(d_x\) ve \(d_y\)'yi değiştirin; yeşil \(\mathbf d\) ile mor \(\mathbf n\) oklarının daima tam \(90^\circ\) dik kaldığını görün.`, en: R`Vary \(d_x\) and \(d_y\) and notice the green direction \(\mathbf d\) and purple normal \(\mathbf n\) stay locked at \(90^\circ\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.param ??= { p0: [1, 1], dx: 2, dy: 1, t: 1.2 });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc);
        const plot = createCanvas2D(host, { height: 270 });

        let slDx, slDy, slT;
        const draw = () => {
          const a = s.dy;
          const b = -s.dx;
          const c = -(a * s.p0[0] + b * s.p0[1]);
          const pt = [s.p0[0] + s.t * s.dx, s.p0[1] + s.t * s.dy];
          const nLen = Math.hypot(a, b) || 1;
          const dLen = Math.hypot(s.dx, s.dy) || 1;
          plot.draw({
            x: [-5, 5],
            y: [-4, 5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a, b, c, color: COLORS.c1, width: 2.5, label: "ℓ" }],
            vectors: [
              { from: s.p0, to: [s.p0[0] + (s.dx / dLen) * 1.4, s.p0[1] + (s.dy / dLen) * 1.4], color: COLORS.c3, width: 2.6, label: "d" },
              { from: s.p0, to: [s.p0[0] + (a / nLen) * 1.3, s.p0[1] + (b / nLen) * 1.3], color: COLORS.c4, width: 2.6, label: "n" },
            ],
            points: [
              { x: s.p0[0], y: s.p0[1], color: COLORS.c1, r: 5, label: "P₀" },
              { x: pt[0], y: pt[1], color: COLORS.c2, r: 6, ring: true, label: `P(t)` },
            ],
          });
          calc.textContent = `\\(P(t)=(${tx(pt[0], 2)},\\ ${tx(pt[1], 2)}),\\quad ${tx(a, 1)}x ${b >= 0 ? "+" : "-"} ${tx(Math.abs(b), 1)}y ${c >= 0 ? "+" : "-"} ${tx(Math.abs(c), 1)} = 0,\\quad \\mathbf n\\cdot\\mathbf d = 0\\)`;
        };
        const setP = (p0, dx, dy, t) => {
          s.p0 = p0; s.dx = dx; s.dy = dy; s.t = t;
          slDx.set(dx); slDy.set(dy); slT.set(t);
          draw();
        };
        presets.append(
          makePresetBtn({ tr: "Eğik doğru", en: "Tilted line" }, () => setP([1, 1], 2, 1, 1)),
          makePresetBtn({ tr: "Dikey x = 2", en: "Vertical x = 2" }, () => setP([2, 0], 0, 2, 1)),
          makePresetBtn({ tr: "Yatay y = 1", en: "Horizontal y = 1" }, () => setP([0, 1], 2, 0, 1)),
        );
        slDx = slider("d_x", { min: -3, max: 3, step: 0.5, value: s.dx, onInput: (v) => { if (v || s.dy) { s.dx = v; draw(); } } });
        slDy = slider("d_y", { min: -3, max: 3, step: 0.5, value: s.dy, onInput: (v) => { if (v || s.dx) { s.dy = v; draw(); } } });
        slT = slider("t", { min: -2, max: 2, step: 0.1, value: s.t, onInput: (v) => { s.t = v; draw(); } });
        ctl.append(slDx, slDy, slT);
        draw();
      },
    },
    {
      id: "pg-dist",
      mathId: "m-pg-dist",
      title: { tr: "Noktanın Doğruya Uzaklığı ve İki Doğrunun Durumu", en: "Point-to-Line Distance & Two Lines" },
      body: [
        {
          tr: R`Bir \(P_0 = (x_0, y_0)\) noktasının \(\ell: ax + by + c = 0\) doğrusuna olan en kısa uzaklığı, noktadan doğruya inilen <b>dikmenin</b> uzunluğudur. Normal vektör \(\mathbf n = (a, b)\) üzerine izdüşüm alındığında tek satırlık mucizevi formül ortaya çıkar:`,
          en: R`The shortest distance from a point \(P_0 = (x_0, y_0)\) to the line \(\ell: ax + by + c = 0\) is the length of the <b>perpendicular drop</b> onto \(\ell\). Projecting onto the normal vector \(\mathbf n = (a, b)\) yields one compact formula:`,
        },
        {
          analogy: {
            title: { tr: "Yüzücüden Düz Sahile En Kısa Yol", en: "Swimmer Heading to a Straight Beach" },
            text: {
              tr: R`Denizdeki bir yüzücü (\(P_0\)) düz bir sahile (\(\ell\)) en hızlı nasıl ulaşır? Çapraz yüzerek değil, sahile tam \(90^\circ\) dik — yani <b>normal vektör \(\mathbf n\) doğrultusunda</b> yüzerek! Ayağını kuma bastığı nokta dik izdüşüm ayağı \(H\)'dir.`,
              en: R`How does a swimmer at \(P_0\) reach a straight shoreline \(\ell\) in minimum distance? Not diagonally, but straight at \(90^\circ\) to the shore — along the <b>normal vector \(\mathbf n\)</b>! The spot where they touch sand is the orthogonal foot \(H\).`,
            },
          },
        },
        { eq: R`d(P_0, \ell) = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}, \qquad \ell_1 \perp \ell_2 \iff a_1 a_2 + b_1 b_2 = 0` },
        {
          tr: R`İki doğru \(\ell_1, \ell_2\) verildiğinde normal vektörlerini karşılaştırmak yeterlidir: [[determinant|determinant]] \(a_1 b_2 - a_2 b_1 \ne 0\) ise tek noktada kesişirler; \(0\) ise paraleller (veya çakışıklar); \(\mathbf n_1 \cdot \mathbf n_2 = 0\) ise tam \(90^\circ\) diktirler!`,
          en: R`For two lines \(\ell_1, \ell_2\), just compare their normals: if the [[determinant|determinant]] \(a_1 b_2 - a_2 b_1 \ne 0\) they intersect at one unique point; if \(0\) they are parallel (or coincident); and if \(\mathbf n_1 \cdot \mathbf n_2 = 0\) they meet at a \(90^\circ\) right angle!`,
        },
        {
          example: {
            title: { tr: "Noktadan doğruya uzaklık hesabı", en: "Calculating point-to-line distance" },
            problem: {
              tr: R`\(P_0 = (2, -1)\) noktasının \(3x + 4y = 12\) doğrusuna olan en kısa uzaklığını bulun.`,
              en: R`Find the shortest distance from \(P_0 = (2, -1)\) to the line \(3x + 4y = 12\).`,
            },
            steps: [
              {
                expr: R`3x + 4y - 12 = 0 \implies a = 3,\ b = 4,\ c = -12`,
                note: { tr: R`Önce her şeyi eşitliğin sol tarafına alıp \(= 0\) biçimine getiririz!`, en: R`First move every term to the left-hand side so the right side is \(0\)!` },
              },
              {
                expr: R`|ax_0 + by_0 + c| = |3(2) + 4(-1) - 12| = |6 - 4 - 12| = |-10| = 10`,
                note: { tr: R`Noktanın koordinatlarını denkleme yazıp mutlak değerini alırız.`, en: R`Plug the coordinates of \(P_0\) into the left-hand side and take the absolute value.` },
              },
              {
                expr: R`d(P_0, \ell) = \frac{10}{\sqrt{3^2 + 4^2}} = \frac{10}{5} = 2`,
                note: { tr: R`Normal vektörün uzunluğu \(\|\mathbf n\| = 5\)'e böleriz.`, en: R`Divide by the normal vector length \(\|\mathbf n\| = 5\).` },
              },
            ],
            answer: { tr: R`\(d(P_0, \ell) = 2\) birim.`, en: R`\(d(P_0, \ell) = 2\) units.` },
          },
        },
        {
          pitfall: {
            title: { tr: "c'nin işaretini ve mutlak değeri unutmayın!", en: "Watch the sign of c and the absolute value!" },
            text: {
              tr: R`Denklem \(3x + 4y = 12\) diye verildiğinde \(c = +12\) değil, \(3x + 4y - 12 = 0\) olduğu için <b>\(c = -12\)</b>'dir! Ayrıca uzaklık asla negatif olamayacağından paydaki mutlak değer \(|\cdot|\) vazgeçilmezdir.`,
              en: R`When a line is written as \(3x + 4y = 12\), do NOT plug in \(c = +12\) — rewrite it as \(3x + 4y - 12 = 0\) so <b>\(c = -12\)</b>! And never drop the absolute value bars: distance is always nonnegative.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Turuncu \(P_0\) noktasını mavi doğrunun tam üstüne sürükleyin: pay sıfırlandığı için \(d(P_0, \ell) = 0\) olur.`, en: R`Drag \(P_0\) right onto the blue line: the numerator hits zero so \(d(P_0, \ell) = 0\).` },
            { tr: R`\(P_0\)'ı doğrunun diğer tarafına geçirin: \(ax_0 + by_0 + c\) işaret değiştirir ama uzaklık \(d\) pozitif kalır.`, en: R`Drag \(P_0\) to the opposite side of the line: \(ax_0 + by_0 + c\) flips sign while distance \(d\) stays positive.` },
            { tr: R`"3x + 4y − 12 = 0" düğmesine basıp yukarıdaki çözümlü örneği \(P_0 = (2, -1)\) noktasında canlı doğrulayın.`, en: R`Click "3x + 4y − 12 = 0" to verify our worked example at \(P_0 = (2, -1)\) live on screen.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.line ??= { a: 1, b: -2, c: 2, p: [1.5, 2.8] });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 275,
          interactive: true,
          hint: L({ tr: "P₀ noktasını sürükleyin", en: "Drag point P₀" }),
        });

        let slA, slB, slC;
        const draw = () => {
          const n2 = s.a * s.a + s.b * s.b || 1;
          const signed = s.a * s.p[0] + s.b * s.p[1] + s.c;
          const t = signed / n2;
          const foot = [s.p[0] - s.a * t, s.p[1] - s.b * t];
          const dist = pointLineDist2D(s.p, s.a, s.b, s.c);
          const nLen = Math.hypot(s.a, s.b) || 1;
          plot.draw({
            x: [-5, 5],
            y: [-4, 5],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a: s.a, b: s.b, c: s.c, color: COLORS.c1, width: 2.6, label: "ℓ" }],
            segments: [{ from: s.p, to: foot, color: COLORS.c2, dash: [4, 3], width: 2 }],
            vectors: [{ from: foot, to: [foot[0] + (s.a / nLen) * 1.1, foot[1] + (s.b / nLen) * 1.1], color: COLORS.c3, label: "n" }],
            points: [{ x: foot[0], y: foot[1], color: COLORS.c1, r: 4.5, label: "H" }],
            handles: [{ id: "p", x: s.p[0], y: s.p[1], color: COLORS.c2, label: "P₀", onDrag: (x, y) => { s.p = [x, y]; draw(); } }],
          });
          calc.textContent = `\\(${tx(s.a, 1)}x ${s.b >= 0 ? "+" : "-"} ${tx(Math.abs(s.b), 1)}y ${s.c >= 0 ? "+" : "-"} ${tx(Math.abs(s.c), 1)} = 0,\\qquad d = \\frac{|${tx(signed, 2)}|}{${tx(nLen, 2)}} = ${tx(dist, 3)}\\)`;
        };
        const setL = (a, b, c, p) => {
          s.a = a; s.b = b; s.c = c; s.p = p;
          slA.set(a); slB.set(b); slC.set(c);
          draw();
        };
        presets.append(
          makePresetBtn({ tr: "Standart", en: "Standard" }, () => setL(1, -2, 2, [1.5, 2.8])),
          makePresetBtn({ tr: "3x + 4y − 12 = 0", en: "3x + 4y − 12 = 0" }, () => setL(1.5, 2, -6, [2, -1])),
          makePresetBtn({ tr: "Köşegen x − y = 0", en: "Diagonal x − y = 0" }, () => setL(1, -1, 0, [-1, 2])),
        );
        slA = slider("a", { min: -3, max: 3, step: 0.5, value: s.a, onInput: (v) => { if (v || s.b) { s.a = v; draw(); } } });
        slB = slider("b", { min: -3, max: 3, step: 0.5, value: s.b, onInput: (v) => { if (v || s.a) { s.b = v; draw(); } } });
        slC = slider("c", { min: -6, max: 6, step: 0.5, value: s.c, onInput: (v) => { s.c = v; draw(); } });
        ctl.append(slA, slB, slC);
        draw();
      },
    },
    {
      id: "pg-ellipse",
      mathId: "m-pg-conics",
      title: { tr: "Çember ve Elips: Odaklar ve Standart Denklem", en: "Circles & Ellipses: Foci & Standard Form" },
      body: [
        {
          tr: R`Bir <b>çember</b>, tek bir merkez \((h, k)\) noktasına eşit \(r\) uzaklıktaki noktaların kümesidir: \((x - h)^2 + (y - k)^2 = r^2\). Çemberi bir eksende hafifçe uzattığımızda bir <b>elips</b> elde ederiz: tek merkez iki <b>odak noktasına</b> (\(F_1, F_2\)) ayrılır ve elips üzerindeki her \(P\) noktasının iki odağa uzaklıkları toplamı daima sabittir: \(|PF_1| + |PF_2| = 2a\)!`,
          en: R`A <b>circle</b> is the set of all points at constant radius \(r\) from one center \((h, k)\): \((x - h)^2 + (y - k)^2 = r^2\). Gently stretching a circle along one axis produces an <b>ellipse</b>: the single center splits into two <b>foci</b> (\(F_1, F_2\)), and every point \(P\) on the curve keeps a constant sum of distances: \(|PF_1| + |PF_2| = 2a\)!`,
        },
        {
          analogy: {
            title: { tr: "İki Çivi ve İp ile Mükemmel Elips Çizmek", en: "Drawing an Ellipse with Two Pins & String" },
            text: {
              tr: R`Tahtaya \(F_1\) ve \(F_2\) noktalarına iki çivi çakın, aralarına \(2a\) uzunluğunda gevşek bir ip bağlayın ve kalemle ipi gergin tutarak etrafta gezdirin. İpin toplam boyu \(|PF_1| + |PF_2| = 2a\) hiç değişmediği için kalem kusursuz bir elips çizer! İki çiviyi tek noktada birleştirirseniz (\(c = 0\)) ip çember çizer!`,
              en: R`Push two pins into a board at \(F_1\) and \(F_2\), tie a loose string of length \(2a\) between them, and pull it taut with a pencil as you trace around. Because the string length \(|PF_1| + |PF_2| = 2a\) stays fixed, you draw an exact ellipse! Merge the two pins together (\(c = 0\)) and you get a circle!`,
            },
          },
        },
        { eq: R`\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1, \qquad c^2 = |a^2 - b^2|, \qquad e = \frac{c}{\max(a,b)} \in [0, 1)` },
        {
          example: {
            title: { tr: "Bir elipsin eksenlerini, odaklarını ve dışmerkezliğini okumak", en: "Reading semi-axes, foci, and eccentricity of an ellipse" },
            problem: {
              tr: R`\(\frac{x^2}{25} + \frac{y^2}{16} = 1\) elipsinin yarı eksenlerini (\(a, b\)), odak noktalarını (\(F_1, F_2\)) ve dışmerkezliğini (\(e\)) bulun.`,
              en: R`Find the semi-axes (\(a, b\)), foci (\(F_1, F_2\)), and eccentricity (\(e\)) of \(\frac{x^2}{25} + \frac{y^2}{16} = 1\).`,
            },
            steps: [
              {
                expr: R`a^2 = 25 \implies a = 5, \qquad b^2 = 16 \implies b = 4`,
                note: { tr: R`Paydalar \(a^2\) ve \(b^2\) olduğu için kareköklerini alırız. \(a > b\) olduğundan büyük eksen yataydır.`, en: R`Take square roots of the denominators: \(a = 5\) and \(b = 4\). Since \(a > b\), the major axis is horizontal.` },
              },
              {
                expr: R`c = \sqrt{a^2 - b^2} = \sqrt{25 - 16} = \sqrt{9} = 3`,
                note: { tr: R`Odaklar elipsin <i>içinde</i> olduğundan \(a^2 - b^2\) farkını alırız: \(F_1 = (-3, 0)\) ve \(F_2 = (3, 0)\).`, en: R`Since foci lie <i>inside</i> the ellipse, subtract \(a^2 - b^2\): \(F_1 = (-3, 0)\) and \(F_2 = (3, 0)\).` },
              },
              {
                expr: R`e = \frac{c}{a} = \frac{3}{5} = 0{,}6 \qquad (0 < e < 1)`,
                note: { tr: R`\(e = 0\) tam çember, \(e \to 1\) çok yassı elipstir; \(0{,}6\) orta düzeyde basık bir elips gösterir.`, en: R`\(e = 0\) is a circle and \(e \to 1\) is very flat; \(0.6\) is moderately elongated.` },
              },
            ],
            answer: {
              tr: R`\(a = 5,\ b = 4\), odaklar \((\pm 3, 0)\), \(e = \frac{3}{5}\) ve ip uzunluğu \(2a = 10\).`,
              en: R`\(a = 5,\ b = 4\), foci \((\pm 3, 0)\), \(e = \frac{3}{5}\), and string length \(2a = 10\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Paydadaki sayıların karekökünü almayı ve eksi işaretini unutmayın!", en: "Take square roots of denominators & subtract for ellipse foci!" },
            text: {
              tr: R`\(\frac{x^2}{25} + \frac{y^2}{16} = 1\) için yarı eksen \(25\) değil <b>\(\sqrt{25} = 5\)</b>'tir! Ayrıca elipste odaklar şeklin <i>içinde</i> kaldığı için \(c < a\) olur — yani \(c^2 = a^2 - b^2\) (artı değil, eksi!).`,
              en: R`In \(\frac{x^2}{25} + \frac{y^2}{16} = 1\), the semi-axis is <b>\(\sqrt{25} = 5\)</b>, NOT \(25\)! And because ellipse foci sit <i>inside</i> the curve (\(c < a\)), always use \(c^2 = a^2 - b^2\) (minus, not plus!).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`\(\theta\) kaydırıcısını döndürerek \(P\) noktasını elips etrafında gezdirin: mor ve turuncu iplerin boyu değişse de toplam \(|PF_1| + |PF_2|\) değerinin <b>kıpırdamadan \(2a\)</b> kaldığını görün!`, en: R`Slide \(\theta\) around the ellipse: watch the two strings change length while their sum \(|PF_1| + |PF_2|\) stays locked at <b>exactly \(2a\)</b>!` },
            { tr: R`"Çember (a = b)" düğmesine tıklayın: iki odak orijinde tek noktaya birleşir ve \(e = 0\) olur!`, en: R`Click "Circle (a = b)": both foci merge at the origin and eccentricity drops to \(e = 0\)!` },
            { tr: R`"Dikey Elips (b > a)" düğmesine tıklayın: odakların \(y\)-eksenine taşındığını gözlemleyin.`, en: R`Click "Vertical Ellipse (b > a)" to see the foci jump onto the \(y\)-axis.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.ell ??= { a: 3.2, b: 2.0, th: 0.9 });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc);
        const plot = createCanvas2D(host, { height: 275 });

        let slA, slB;
        const draw = () => {
          const major = Math.max(s.a, s.b);
          const minor = Math.min(s.a, s.b);
          const c = Math.sqrt(Math.max(0, major * major - minor * minor));
          const horiz = s.a >= s.b;
          const f1 = horiz ? [-c, 0] : [0, -c];
          const f2 = horiz ? [c, 0] : [0, c];
          const p = [s.a * Math.cos(s.th), s.b * Math.sin(s.th)];
          const d1 = Math.hypot(p[0] - f1[0], p[1] - f1[1]);
          const d2 = Math.hypot(p[0] - f2[0], p[1] - f2[1]);
          plot.draw({
            x: [-4.6, 4.6],
            y: [-4, 4],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            parametrics: [{ fx: (t) => s.a * Math.cos(t), fy: (t) => s.b * Math.sin(t), t0: 0, t1: Math.PI * 2, color: COLORS.c1, width: 2.6 }],
            segments: [
              { from: f1, to: p, color: COLORS.c2, width: 2 },
              { from: f2, to: p, color: COLORS.c4, width: 2 },
            ],
            points: [
              { x: f1[0], y: f1[1], color: COLORS.c2, r: 5, label: "F₁" },
              { x: f2[0], y: f2[1], color: COLORS.c4, r: 5, label: "F₂" },
              { x: p[0], y: p[1], color: COLORS.c3, r: 6, ring: true, label: "P" },
            ],
          });
          calc.textContent = `\\(|PF_1|+|PF_2| = ${tx(d1, 2)} + ${tx(d2, 2)} = ${tx(d1 + d2, 2)} = 2\\cdot${tx(major, 2)},\\qquad e = \\frac{${tx(c, 2)}}{${tx(major, 2)}} = ${tx(c / major, 3)}\\)`;
        };
        const setE = (a, b) => { s.a = a; s.b = b; slA.set(a); slB.set(b); draw(); };
        presets.append(
          makePresetBtn({ tr: "Çember (a = b)", en: "Circle (a = b)" }, () => setE(2.6, 2.6)),
          makePresetBtn({ tr: "Yatay Elips", en: "Horizontal" }, () => setE(3.5, 2.1)),
          makePresetBtn({ tr: "Dikey Elips (b > a)", en: "Vertical (b > a)" }, () => setE(1.8, 3.2)),
        );
        slA = slider("a", { min: 0.8, max: 4, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } });
        slB = slider("b", { min: 0.8, max: 3.6, step: 0.2, value: s.b, onInput: (v) => { s.b = v; draw(); } });
        ctl.append(
          slA,
          slB,
          slider("θ", { min: 0, max: 6.28, step: 0.1, value: s.th, onInput: (v) => { s.th = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "pg-conics",
      mathId: "m-pg-conics",
      title: { tr: "Parabol, Hiperbol ve Dışmerkezlik e Sınıflandırması", en: "Parabolas, Hyperbolas & Eccentricity e Classifier" },
      body: [
        {
          tr: R`Tüm [[conic|konik kesitleri]] tek bir sayı — <b>dışmerkezlik \(e\)</b> — birleştirir: bir \(P\) noktasının odak \(F\)'ye uzaklığının, doğrultman doğrusuna uzaklığına oranı \(e\) olsun. \(e = 0\) <b>çember</b>, \(0 < e < 1\) <b>elips</b>, \(e = 1\) <b>parabol</b>, \(e > 1\) ise <b>hiperbol</b> verir!`,
          en: R`One single number — the <b>eccentricity \(e\)</b> — unifies every [[conic|conic section]]: the ratio of distance from focus \(F\) to distance from the directrix line. We get a <b>circle</b> when \(e = 0\), an <b>ellipse</b> when \(0 < e < 1\), a <b>parabola</b> when \(e = 1\), and a <b>hyperbola</b> when \(e > 1\)!`,
        },
        {
          tr: R`<b>Parabolde</b> (\(y^2 = 4px\)) her nokta odak \(F = (p, 0)\) ile doğrultman \(x = -p\)'ye eşit uzaklıktadır. <b>Hiperbolde</b> (\(\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1\)) ise iki odağa uzaklıkların <i>farkı</i> sabittir (\(||PF_1| - |PF_2|| = 2a\)), odaklar dışarıdadır (\(c^2 = a^2 + b^2\)) ve iki kol sonsuzda \(y = \pm \frac{b}{a}x\) [[asymptote|asimptotlarına]] sarılır.`,
          en: R`On a <b>parabola</b> (\(y^2 = 4px\)), every point is equidistant from focus \(F = (p, 0)\) and directrix \(x = -p\). On a <b>hyperbola</b> (\(\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1\)), the <i>difference</i> of focal distances is constant (\(||PF_1| - |PF_2|| = 2a\)), foci sit outside (\(c^2 = a^2 + b^2\)), and the two branches hug the [[asymptote|asymptotes]] \(y = \pm \frac{b}{a}x\).`,
        },
        {
          analogy: {
            title: { tr: "Uydu Çanağı ve Uzaydaki Gezegen/Kuyrukluyıldız Yörüngeleri", en: "Satellite Dishes & Planetary/Comet Orbits" },
            text: {
              tr: R`Uydu çanakları parabol (\(e = 1\)) şeklindedir çünkü paralel gelen tüm sinyalleri tek odak noktasına \(F\) yansıtır! Gök mekaniğinde ise gezegenler kapalı <b>elips</b> (\(0 < e < 1\)), tam kaçış hızındaki kuyrukluyıldızlar <b>parabol</b> (\(e = 1\)), güneş sisteminden bir kez geçip giden yıldızlararası cisimler ise açık <b>hiperbol</b> (\(e > 1\)) yörüngesi çizer!`,
              en: R`Satellite dishes are parabolic (\(e = 1\)) because they bounce every parallel incoming signal straight into the focus \(F\)! In astronomy, planets follow closed <b>ellipses</b> (\(0 < e < 1\)), borderline comets follow <b>parabolas</b> (\(e = 1\)), and interstellar visitors slingshot past the Sun on open <b>hyperbolas</b> (\(e > 1\))!`,
            },
          },
        },
        { eq: R`y^2 = 4px \ (e = 1), \qquad \frac{x^2}{a^2} - \frac{y^2}{b^2} = 1 \ \Big(c^2 = a^2 + b^2,\quad y = \pm\frac{b}{a}x,\quad e = \frac{c}{a} > 1\Big)` },
        {
          example: {
            title: { tr: "Hiperbolün odakları, dışmerkezliği ve asimptotları", en: "Foci, eccentricity, and asymptotes of a hyperbola" },
            problem: {
              tr: R`\(\frac{x^2}{9} - \frac{y^2}{16} = 1\) hiperbolünün odaklarını, dışmerkezliğini ve asimptotlarını bulun.`,
              en: R`Find the foci, eccentricity, and asymptotes of the hyperbola \(\frac{x^2}{9} - \frac{y^2}{16} = 1\).`,
            },
            steps: [
              {
                expr: R`a = \sqrt{9} = 3, \qquad b = \sqrt{16} = 4`,
                note: { tr: R`Paydalardan karekök alarak \(a\) ve \(b\)'yi okuyoruz.`, en: R`Take square roots of the denominators to read \(a = 3\) and \(b = 4\).` },
              },
              {
                expr: R`c = \sqrt{a^2 + b^2} = \sqrt{9 + 16} = 5 \implies e = \frac{c}{a} = \frac{5}{3} \approx 1{,}67 > 1`,
                note: { tr: R`Hiperbolde denklemde eksi, odak formülünde ARTI vardır: \(c^2 = a^2 + b^2\)! Odaklar \((\pm 5, 0)\).`, en: R`Hyperbolas have a minus in the equation and a PLUS in the focus rule: \(c^2 = a^2 + b^2\)! Foci are \((\pm 5, 0)\).` },
              },
              {
                expr: R`\frac{x^2}{9} - \frac{y^2}{16} = 0 \implies \frac{y^2}{16} = \frac{x^2}{9} \implies y = \pm \frac{4}{3}x`,
                note: { tr: R`Asimptot kısayolu: sağdaki \(1\)'i \(0\) yapıp \(y\)'yi çekin — eğimi asla ters yazmazsınız!`, en: R`Asymptote trick: replace \(= 1\) with \(= 0\) and solve for \(y\) — you can never flip the slope!` },
              },
            ],
            answer: {
              tr: R`Odaklar \((\pm 5, 0)\), \(e = \frac{5}{3}\), asimptotlar \(y = \pm \frac{4}{3}x\).`,
              en: R`Foci \((\pm 5, 0)\), \(e = \frac{5}{3}\), asymptotes \(y = \pm \frac{4}{3}x\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Asimptot eğimini b/a yerine a/b yazmak!", en: "Flipping the asymptote slope to a/b instead of b/a!" },
            text: {
              tr: R`\(\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1\) için asimptotlar \(y = \pm \frac{b}{a}x\)'tir (\(a/b\) değil!). Ezberlemek yerine her seferinde <b>sağ tarafı \(0\) yapın</b>: \(\frac{y^2}{b^2} = \frac{x^2}{a^2} \implies y = \pm \frac{b}{a}x\).`,
              en: R`For \(\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1\), the asymptotes are \(y = \pm \frac{b}{a}x\) (NOT \(a/b\)). Instead of memorizing, just <b>replace \(= 1\) with \(= 0\)</b> and solve for \(y\): \(\frac{y^2}{b^2} = \frac{x^2}{a^2} \implies y = \pm \frac{b}{a}x\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`"Parabol" sekmesini seçin: tepe noktası \((0,0)\)'ın odak \(F=(p,0)\) ve yeşil doğrultman \(x=-p\)'ye tam eşit uzaklıkta olduğunu ve seçili \(P\) noktasında \(|PF| = d(P, \text{doğrultman})\) olduğunu görün.`, en: R`Select "Parabola": see how the vertex sits midway between focus \(F=(p,0)\) and green directrix \(x=-p\), and notice \(|PF| = d(P, \text{directrix})\).` },
            { tr: R`"Hiperbol" sekmesinde \(b\)'yi büyütün: kesikli X-şeklindeki asimptotların dikleşerek kolları daha geniş açtığını izleyin.`, en: R`Switch to "Hyperbola" and increase \(b\): watch the dashed X-shaped asymptotes steepen and pull the branches wider.` },
            { tr: R`Üç sekme arasında hızla geçerek \(e < 1\), \(e = 1\) ve \(e > 1\) değerlerinin şekli nasıl belirlediğini karşılaştırın.`, en: R`Toggle across all three modes and compare how \(e < 1\), \(e = 1\), and \(e > 1\) classify the shape.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.conic ??= { kind: "hyperbola", a: 2.2, b: 1.8 });
        const ctl = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 280 });

        const draw = () => {
          if (s.kind === "ellipse") {
            const major = Math.max(s.a, s.b);
            const minor = Math.min(s.a, s.b);
            const c = Math.sqrt(Math.max(0, major * major - minor * minor));
            const horiz = s.a >= s.b;
            const foci = horiz ? [[-c, 0], [c, 0]] : [[0, -c], [0, c]];
            plot.draw({
              x: [-5, 5], y: [-4, 4], equalAspect: true, xLabel: "x", yLabel: "y",
              parametrics: [{ fx: (t) => s.a * Math.cos(t), fy: (t) => s.b * Math.sin(t), t0: 0, t1: Math.PI * 2, color: COLORS.c1, width: 2.6 }],
              points: foci.map(([fx, fy], i) => ({ x: fx, y: fy, color: COLORS.c2, r: 5, label: `F${i + 1}` })),
            });
            calc.textContent = `\\(\\frac{x^2}{${tx(s.a * s.a, 2)}} + \\frac{y^2}{${tx(s.b * s.b, 2)}} = 1,\\quad c=${tx(c, 2)},\\quad e = ${tx(c / major, 3)} < 1\\)`;
          } else if (s.kind === "hyperbola") {
            const c = Math.hypot(s.a, s.b);
            plot.draw({
              x: [-6, 6], y: [-5, 5], equalAspect: true, xLabel: "x", yLabel: "y",
              lines: [
                { a: s.b, b: -s.a, c: 0, color: COLORS.muted, dash: [5, 4] },
                { a: s.b, b: s.a, c: 0, color: COLORS.muted, dash: [5, 4] },
              ],
              parametrics: [
                { fx: (t) => s.a * Math.cosh(t), fy: (t) => s.b * Math.sinh(t), t0: -2.2, t1: 2.2, color: COLORS.c1, width: 2.6 },
                { fx: (t) => -s.a * Math.cosh(t), fy: (t) => s.b * Math.sinh(t), t0: -2.2, t1: 2.2, color: COLORS.c1, width: 2.6 },
              ],
              points: [
                { x: -c, y: 0, color: COLORS.c2, r: 5, label: "F₁" },
                { x: c, y: 0, color: COLORS.c2, r: 5, label: "F₂" },
              ],
            });
            calc.textContent = `\\(\\frac{x^2}{${tx(s.a * s.a, 2)}} - \\frac{y^2}{${tx(s.b * s.b, 2)}} = 1,\\quad c=${tx(c, 2)},\\quad e = ${tx(c / s.a, 3)} > 1,\\quad y=\\pm ${tx(s.b / s.a, 2)}x\\)`;
          } else {
            const p = s.a * 0.5;
            const py = 2 * p;
            const px = (py * py) / (4 * p);
            plot.draw({
              x: [-4, 6], y: [-5, 5], equalAspect: true, xLabel: "x", yLabel: "y",
              lines: [{ a: 1, b: 0, c: p, color: COLORS.c3, dash: [5, 4], label: `x = -${ns(p, 2)}` }],
              parametrics: [{ fx: (t) => (t * t) / (4 * p), fy: (t) => t, t0: -5, t1: 5, color: COLORS.c1, width: 2.6 }],
              segments: [
                { from: [p, 0], to: [px, py], color: COLORS.c2, dash: [4, 3], width: 1.8 },
                { from: [-p, py], to: [px, py], color: COLORS.c3, dash: [4, 3], width: 1.8 },
              ],
              points: [
                { x: p, y: 0, color: COLORS.c2, r: 5.5, label: "F" },
                { x: px, y: py, color: COLORS.c4, r: 5, label: "P" },
              ],
            });
            calc.textContent = `\\(y^2 = ${tx(4 * p, 2)}x,\\quad F=(${tx(p, 2)}, 0),\\quad |PF| = d(P,\\text{doğrultman}) = ${tx(2 * p, 2)},\\quad e = 1\\)`;
          }
        };
        ctl.append(
          segmented(
            [
              ["ellipse", { tr: "Elips (e<1)", en: "Ellipse (e<1)" }],
              ["parabola", { tr: "Parabol (e=1)", en: "Parabola (e=1)" }],
              ["hyperbola", { tr: "Hiperbol (e>1)", en: "Hyperbola (e>1)" }],
            ],
            s.kind,
            (v) => { s.kind = v; draw(); },
          ),
        );
        ctl2.append(
          slider("a", { min: 0.6, max: 4, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
          slider("b", { min: 0.6, max: 3.5, step: 0.2, value: s.b, onInput: (v) => { s.b = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "İki Doğru: Kesişim, Paralellik ve Açı", en: "Two Lines: Intersection, Parallelism & Angle" },
    sub: {
      tr: R`İki doğrunun katsayılarını değiştirin veya hazır senaryoları yükleyin; kesişim noktasını, aralarındaki dar açıyı, normal vektörlerin nokta çarpımını ve determinantı canlı izleyin.`,
      en: R`Adjust coefficients of two lines or click a preset to inspect their intersection point, acute angle, normal dot product, and determinant live.`,
    },
    experiments: [
      {
        tr: R`<b>Tek kesişim:</b> <i>"Kesişen (Standart)"</i> ayarında \(\det(\mathbf n_1, \mathbf n_2) \ne 0\) olduğundan iki doğru tam bir yeşil noktada buluşur.`,
        en: R`<b>Unique intersection:</b> on <i>"Intersecting"</i>, \(\det(\mathbf n_1, \mathbf n_2) \ne 0\) guarantees a single green meeting point.`,
      },
      {
        tr: R`<b>Tam \(90^\circ\) diklik:</b> <i>"Dik (90°)"</i> düğmesine tıklayın — normal vektörlerin nokta çarpımı \(\mathbf n_1 \cdot \mathbf n_2 = 0\) olduğunda dar açı tam \(90^\circ\) olur!`,
        en: R`<b>Exact \(90^\circ\) right angle:</b> click <i>"Perpendicular (90°)"</i> — whenever \(\mathbf n_1 \cdot \mathbf n_2 = 0\), the acute angle hits exactly \(90^\circ\)!`,
      },
      {
        tr: R`<b>Paralel ama ayrı doğrular:</b> <i>"Paralel (∅)"</i> düğmesine basın; \(\det = 0\) olduğu için kesişim kümesi boş (\(\emptyset\)) kalır. \(c_2\)'yi değiştirerek iki paralel doğru arasındaki boşluğu açıp kapatın.`,
        en: R`<b>Parallel distinct lines:</b> click <i>"Parallel (∅)"</i>; \(\det = 0\) leaves no intersection (\(\emptyset\)). Slide \(c_2\) to vary the gap between them.`,
      },
      {
        tr: R`<b>Sonsuz kesişim (Çakışık doğrular):</b> <i>"Çakışık (∞)"</i> ayarında ikinci denklem birincinin tam \(2\) katıdır — iki doğru üst üste biner!`,
        en: R`<b>Infinitely many intersections:</b> click <i>"Coincident (∞)"</i>: the second equation is \(2\times\) the first, so both lines overlap completely!`,
      },
    ],
    build(host, state) {
      const s = (state.pg ??= { a1: 1, b1: -1, c1: 1, a2: 1, b2: 2, c2: -4 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 390 });
      const presets = h("div", { class: "t-controls" });
      const ctl1 = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const msg = h("p", { class: "pc-msg" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır senaryolar", en: "Quick presets" }) }),
        presets,
        h("div", { class: "mini-title", text: "ℓ₁ : a₁x + b₁y + c₁ = 0" }),
        ctl1,
        h("div", { class: "mini-title", text: "ℓ₂ : a₂x + b₂y + c₂ = 0" }),
        ctl2,
        tiles,
        msg,
      );

      let slA1, slB1, slC1, slA2, slB2, slC2;
      const draw = () => {
        const pt = lineIntersection2D([s.a1, s.b1, s.c1], [s.a2, s.b2, s.c2]);
        const angRaw = (vAngle([s.a1, s.b1], [s.a2, s.b2]) * 180) / Math.PI;
        const acute = Math.min(angRaw, 180 - angRaw);
        const det = s.a1 * s.b2 - s.a2 * s.b1;
        const ndot = s.a1 * s.a2 + s.b1 * s.b2;
        const ratio = Math.abs(s.a1) > 1e-6 ? s.a2 / s.a1 : s.b2 / s.b1;
        const coincident = Math.abs(det) < 1e-8 && Math.abs(s.c2 - ratio * s.c1) < 1e-6;
        plot.draw({
          x: [-6, 6], y: [-6, 6], equalAspect: true, xLabel: "x", yLabel: "y",
          lines: [
            { a: s.a1, b: s.b1, c: s.c1, color: COLORS.c1, width: 2.6, label: "ℓ₁" },
            { a: s.a2, b: s.b2, c: s.c2, color: COLORS.c2, width: 2.6, dash: coincident ? [7, 5] : [], label: "ℓ₂" },
          ],
          points: pt ? [{ x: pt[0], y: pt[1], color: COLORS.c3, r: 6.5, ring: true, label: `(${ns(pt[0], 2)}, ${ns(pt[1], 2)})` }] : [],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "det(n₁, n₂)" }), h("span", { class: "pg-tile-value", text: ns(det, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "n₁ · n₂" }), h("span", { class: "pg-tile-value", text: ns(ndot, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Dar açı", en: "Acute angle" }) }), h("span", { class: "pg-tile-value", text: `${ns(acute, 1)}°` })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Kesişim", en: "Intersection" }) }), h("span", { class: "pg-tile-value", text: pt ? `(${ns(pt[0], 1)}, ${ns(pt[1], 1)})` : coincident ? "∞" : "∅" })),
        );
        if (pt) {
          msg.className = "pc-msg good";
          msg.textContent = Math.abs(ndot) < 1e-6
            ? L({ tr: "n₁·n₂ = 0: doğrular tam 90° dik kesişiyor!", en: "n₁·n₂ = 0: the lines intersect at an exact 90° right angle!" })
            : L({ tr: "Determinant ≠ 0: doğrular tek bir noktada kesişir.", en: "Determinant ≠ 0: the lines meet at a unique point." });
        } else if (coincident) {
          msg.className = "pc-msg info";
          msg.textContent = L({ tr: "Çakışık doğrular: ikinci denklem birincinin katı → sonsuz ortak nokta!", en: "Coincident lines: one equation is a multiple of the other → infinitely many shared points!" });
        } else {
          msg.className = "pc-msg bad";
          msg.textContent = L({ tr: "Paralel doğrular (det = 0): normal vektörler paralel ama sabit terimler orantısız → kesişim yok!", en: "Parallel lines (det = 0): parallel normals with different offsets → no intersection!" });
        }
      };

      const setAll = (a1, b1, c1, a2, b2, c2) => {
        Object.assign(s, { a1, b1, c1, a2, b2, c2 });
        slA1.set(a1); slB1.set(b1); slC1.set(c1);
        slA2.set(a2); slB2.set(b2); slC2.set(c2);
        draw();
      };
      presets.append(
        makePresetBtn({ tr: "Kesişen", en: "Intersecting" }, () => setAll(1, -1, 1, 1, 2, -4)),
        makePresetBtn({ tr: "Dik (90°)", en: "Right (90°)" }, () => setAll(2, -1, 1, 1, 2, -3)),
        makePresetBtn({ tr: "Paralel (∅)", en: "Parallel (∅)" }, () => setAll(1, -2, 2, 1, -2, -4)),
        makePresetBtn({ tr: "Çakışık (∞)", en: "Coincident (∞)" }, () => setAll(1, -1, 2, 2, -2, 4)),
      );

      slA1 = slider("a₁", { min: -3, max: 3, step: 0.5, value: s.a1, onInput: (v) => { if (v || s.b1) { s.a1 = v; draw(); } } });
      slB1 = slider("b₁", { min: -3, max: 3, step: 0.5, value: s.b1, onInput: (v) => { if (v || s.a1) { s.b1 = v; draw(); } } });
      slC1 = slider("c₁", { min: -5, max: 5, step: 0.5, value: s.c1, onInput: (v) => { s.c1 = v; draw(); } });
      slA2 = slider("a₂", { min: -3, max: 3, step: 0.5, value: s.a2, onInput: (v) => { if (v || s.b2) { s.a2 = v; draw(); } } });
      slB2 = slider("b₂", { min: -3, max: 3, step: 0.5, value: s.b2, onInput: (v) => { if (v || s.a2) { s.b2 = v; draw(); } } });
      slC2 = slider("c₂", { min: -5, max: 5, step: 0.5, value: s.c2, onInput: (v) => { s.c2 = v; draw(); } });
      ctl1.append(slA1, slB1, slC1);
      ctl2.append(slA2, slB2, slC2);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-pg-lines",
      title: { tr: "Doğru Formları ve İki Doğru Arasındaki Açı", en: "Line Forms & Angle Between Two Lines" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Biçim", en: "Form" },
              { tr: "Denklem", en: "Equation" },
              { tr: "Ne zaman en kullanışlı?", en: "Best used when..." },
            ],
            rows: [
              [{ tr: "Eğim–kesim", en: "Slope-intercept" }, R`\(y = mx + k\)`, { tr: "Hızlı çizim (dikey doğrular hariç!)", en: "Quick graphing (cannot express vertical lines!)" }],
              [{ tr: "Parametrik", en: "Parametric" }, R`\(\mathbf r(t) = P_0 + t\mathbf d\)`, { tr: "Doğru üstünde hareket etmek & 3B'ye geçmek", en: "Moving along a line & generalizing to 3D" }],
              [{ tr: "Kapalı / Normal", en: "Implicit / Normal" }, R`\(ax + by + c = 0\)`, { tr: "Uzaklık, kesişim, diklik ve paralellik testleri", en: "Distance, intersection, right-angle & parallel tests" }],
            ],
          },
        },
        { eq: R`\cos\theta = \frac{|\mathbf n_1 \cdot \mathbf n_2|}{\|\mathbf n_1\|\,\|\mathbf n_2\|} = \frac{|a_1 a_2 + b_1 b_2|}{\sqrt{a_1^2 + b_1^2}\,\sqrt{a_2^2 + b_2^2}}` },
        {
          callout: "tip",
          title: { tr: "Neden mutlak değer koyduk?", en: "Why the absolute value in cos θ?" },
          text: {
            tr: R`İki doğru kesiştiğinde biri dar (\(\theta\)), biri geniş (\(180^\circ - \theta\)) iki açı oluşur. Payda mutlak değer almak daima <b>dar açıyı</b> (\(0^\circ \le \theta \le 90^\circ\)) seçer.`,
            en: R`Two intersecting lines form both an acute angle (\(\theta\)) and an obtuse supplement (\(180^\circ - \theta\)). The absolute value always picks the <b>acute angle</b> (\(0^\circ \le \theta \le 90^\circ\)).`,
          },
        },
      ],
    },
    {
      id: "m-pg-dist",
      title: { tr: "Noktanın Doğruya ve Paralel Doğruların Uzaklığı İspatı", en: "Derivation of Point-to-Line & Parallel Line Distances" },
      blocks: [
        {
          derive: {
            title: { tr: "Dik izdüşümle nokta–doğru uzaklığı", en: "Point-to-line distance via normal projection" },
            steps: [
              { tex: R`\ell:\ \mathbf n \cdot \mathbf x + c = 0, \qquad \mathbf n = (a, b) \ne \mathbf 0`, why: { tr: "Doğruyu normal vektör n = (a, b) kullanarak nokta çarpım biçiminde yazarız.", en: "Rewrite ax + by + c = 0 using dot product with normal n = (a, b)." } },
              { tex: R`Q \in \ell \implies \mathbf n \cdot Q = -c`, why: { tr: "Doğru üzerinde herhangi bir Q referans noktası seçelim; denklemi sağladığı için n·Q = −c olur.", en: "Pick any anchor point Q on the line; satisfying the equation gives n·Q = −c." } },
              { tex: R`d(P_0, \ell) = \left|\frac{\mathbf n \cdot (P_0 - Q)}{\|\mathbf n\|}\right| = \frac{|\mathbf n\cdot P_0 - \mathbf n\cdot Q|}{\|\mathbf n\|}`, why: { tr: "En kısa mesafe, P₀ − Q vektörünün birim normal n/‖n‖ üzerindeki gölgesinin uzunluğudur.", en: "Shortest distance is the shadow length of P₀ − Q along the unit normal n/‖n‖." } },
              { tex: R`d(P_0, \ell) = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}`, why: { tr: "−n·Q = c yerine koyunca ünlü uzaklık formülü ispatlanır!", en: "Substitute −n·Q = c to obtain the famous distance formula!" } },
            ],
          },
        },
        {
          derive: {
            title: { tr: "İki paralel doğru arası uzaklık", en: "Distance between two parallel lines" },
            steps: [
              { tex: R`\ell_1:\ ax + by + c_1 = 0, \qquad \ell_2:\ ax + by + c_2 = 0`, why: { tr: "İki paralel doğru aynı (a, b) katsayılarıyla yazılabilir (gerekirse birini bir sayıyla bölün).", en: "Rewrite both parallel lines with identical (a, b) coefficients (scale one if needed)." } },
              { tex: R`P_0 = (x_0, y_0) \in \ell_1 \implies ax_0 + by_0 = -c_1`, why: { tr: "Birinci doğru üstünden herhangi bir P₀ noktası seçeriz.", en: "Pick any point P₀ on the first line." } },
              { tex: R`d(\ell_1, \ell_2) = d(P_0, \ell_2) = \frac{|ax_0 + by_0 + c_2|}{\sqrt{a^2 + b^2}} = \frac{|c_2 - c_1|}{\sqrt{a^2 + b^2}}`, why: { tr: "ax₀ + by₀ = −c₁ yerine yazılınca paralel doğrular arası mesafe tek adımda çıkar!", en: "Replacing ax₀ + by₀ by −c₁ gives the parallel-line distance formula immediately!" } },
            ],
          },
        },
        {
          example: {
            title: { tr: "Paralel iki doğru arasındaki uzaklık", en: "Distance between two parallel lines" },
            problem: {
              tr: R`\(6x + 8y - 10 = 0\) ve \(3x + 4y + 5 = 0\) doğruları arasındaki uzaklık kaçtır?`,
              en: R`Find the distance between \(6x + 8y - 10 = 0\) and \(3x + 4y + 5 = 0\).`,
            },
            steps: [
              {
                expr: R`6x + 8y - 10 = 0 \;\xrightarrow{\div 2}\; 3x + 4y - 5 = 0`,
                note: { tr: R`Önce \((a, b)\) katsayılarını eşitlemeliyiz! İlk denklemi \(2\)'ye böleriz.`, en: R`First match the \((a, b)\) coefficients! Divide the first equation by \(2\).` },
              },
              {
                expr: R`d = \frac{|c_2 - c_1|}{\sqrt{a^2 + b^2}} = \frac{|5 - (-5)|}{\sqrt{3^2 + 4^2}} = \frac{10}{5} = 2`,
                note: { tr: R`\(c_1 = -5\) ve \(c_2 = +5\) farkının mutlak değeri \(10\), normal uzunluğu \(5\)'tir.`, en: R`The difference \(|5 - (-5)| = 10\) divided by normal length \(5\) gives \(2\).` },
              },
            ],
            answer: { tr: R`Uzaklık \(2\) birimdir.`, en: R`The distance is \(2\) units.` },
          },
        },
      ],
    },
    {
      id: "m-pg-conics",
      title: { tr: "Konik Kesitlerin Standart Denklemleri ve Tam Kare", en: "Canonical Conic Equations & Completing the Square" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Konik", en: "Conic" },
              { tr: "Standart denklem", en: "Canonical equation" },
              { tr: "Odak ilişkisi", en: "Focus relation" },
              { tr: "Dışmerkezlik e", en: "Eccentricity e" },
            ],
            rows: [
              [{ tr: "Çember", en: "Circle" }, R`\(x^2 + y^2 = r^2\)`, R`\(c = 0\)`, R`\(e = 0\)`],
              [{ tr: "Elips", en: "Ellipse" }, R`\(\frac{x^2}{a^2}+\frac{y^2}{b^2}=1\ (a > b)\)`, R`\(c^2 = a^2 - b^2\)`, R`\(0 < e = c/a < 1\)`],
              [{ tr: "Parabol", en: "Parabola" }, R`\(y^2 = 4px\)`, R`\(F = (p,0),\ x=-p\)`, R`\(e = 1\)`],
              [{ tr: "Hiperbol", en: "Hyperbola" }, R`\(\frac{x^2}{a^2}-\frac{y^2}{b^2}=1\)`, R`\(c^2 = a^2 + b^2\)`, R`\(e = c/a > 1\)`],
            ],
          },
        },
        {
          example: {
            title: { tr: "Tam kareye tamamlayarak çemberin merkezi ve yarıçapını bulmak", en: "Completing the square to find center and radius of a circle" },
            problem: {
              tr: R`\(x^2 - 4x + y^2 + 6y - 3 = 0\) denkleminin merkezini ve yarıçapını bulun.`,
              en: R`Find the center and radius of \(x^2 - 4x + y^2 + 6y - 3 = 0\).`,
            },
            steps: [
              {
                expr: R`(x^2 - 4x + 4) + (y^2 + 6y + 9) = 3 + 4 + 9`,
                note: { tr: R`\(x\) katsayısı \(-4\)'ün yarısının karesi \(4\)'ü, \(y\) katsayısı \(6\)'nın yarısının karesi \(9\)'u iki tarafa da ekleriz.`, en: R`Add \((-4/2)^2 = 4\) for \(x\) and \((6/2)^2 = 9\) for \(y\) to both sides.` },
              },
              {
                expr: R`(x - 2)^2 + (y + 3)^2 = 16 = 4^2`,
                note: { tr: R`Standart \((x - h)^2 + (y - k)^2 = r^2\) biçimi ortaya çıkar!`, en: R`This reveals the standard form \((x - h)^2 + (y - k)^2 = r^2\)!` },
              },
            ],
            answer: { tr: R`Merkez \((2, -3)\) ve yarıçap \(r = 4\).`, en: R`Center \((2, -3)\) and radius \(r = 4\).` },
          },
        },
        {
          callout: "warn",
          title: { tr: "Elips vs. Hiperbol işaret zıtlığı", en: "Opposite signs between ellipse & hyperbola" },
          text: {
            tr: R`Kolay hatırlama kuralı: <b>Denklemdeki işaretle odak formülündeki işaret daima zıttır!</b> Elips denkleminde <b>\(+\)</b> var \(\implies c^2 = a^2 - b^2\) (eksi). Hiperbol denkleminde <b>\(-\)</b> var \(\implies c^2 = a^2 + b^2\) (artı).`,
            en: R`Easy memory trick: <b>the equation sign and the focus-formula sign are ALWAYS opposite!</b> Ellipses have <b>\(+\)</b> in the equation \(\implies c^2 = a^2 - b^2\). Hyperbolas have <b>\(-\)</b> in the equation \(\implies c^2 = a^2 + b^2\).`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
