import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas3D } from "../../engines/canvas3d.ts";
import { cross3, pointPlaneDist3D, skewLinesDist3D, triple3, vAdd, vDot, vNorm, vSub } from "../../engines/math-core.ts";
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
    id: "sg-intro",
    title: { tr: "Uzay Geometrisi (ℝ³)", en: "Space Geometry (ℝ³)" },
    paragraphs: [
      {
        tr: R`Düzleme (\(x, y\)) üçüncü bir yükseklik ekseni (\(z\)) eklediğimizde içinde yaşadığımız üç boyutlu uzay \(\mathbb{R}^3\) doğar. Burada iki büyüleyici yenilikle tanışırız: yalnızca \(\mathbb{R}^3\)'e özgü olan [[cross-product|vektörel çarpım]] (\(\mathbf u \times \mathbf v\), yüksek sesle <i>"\(\mathbf u\) çarpı \(\mathbf v\)"</i>) ve ne paralel olan ne de kesişen [[skew-lines|aykırı doğrular]].`,
        en: R`Adding a vertical height axis (\(z\)) to the flat \((x, y)\)-plane creates the three-dimensional space \(\mathbb{R}^3\) we live in. Two fascinating new phenomena appear here: the [[cross-product|cross product]] (\(\mathbf u \times \mathbf v\), read <i>"\(\mathbf u\) cross \(\mathbf v\)"</i>) — unique to 3D — and [[skew-lines|skew lines]] that neither meet nor run parallel.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> tüm 3B sahneleri fareyle sürükleyip döndürerek uzayda parametrik doğruları, normal vektörlü düzlem denklemini (\(\Pi: ax + by + cz = d\)), vektörel çarpımın sağ el kuralı ile alan anlamını, nokta–düzlem uzaklığını ve aykırı doğrular arası en kısa mesafeyi kolayca hesaplayabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will orbit interactive 3D scenes freely to master parametric lines in space, plane equations via normals (\(\Pi: ax + by + cz = d\)), the cross product's right-hand rule and area meaning, point-to-plane distance, and the shortest bridge between skew lines.`,
      },
    ],
    analogy: {
      title: { tr: "Odanın Köşesi, Drone Uçuşu ve Üst Geçit", en: "Corner of a Room, a Drone & a Highway Overpass" },
      text: {
        tr: R`Oturduğunuz odanın iki duvarının tabanla buluştuğu köşeye bakın: yerdeki iki kenar \(x\) ve \(y\) eksenleri, tavana doğru yükselen dik köşe ise \(z\) eksenidir! Havada düz bir hat boyunca uçan bir drone <b>3B doğru</b>, havada eğik duran cam bir masa tablası <b>düzlem</b>, farklı yüksekliklerde birbirini teğet geçen iki otoyol köprüsü ise <b>aykırı doğrulardır</b>!`,
        en: R`Look at a bottom corner of the room you are in: the two floor edges are the \(x\)- and \(y\)-axes, and the vertical wall edge rising to the ceiling is the \(z\)-axis! A drone cruising straight through the air traces a <b>3D line</b>, a tilted glass tabletop is a <b>plane</b>, and an overpass crossing above an underpass forms a pair of <b>skew lines</b>!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 5 · Uzay Geometrisi", en: "Lecture 5 · Space Geometry" }],
      [{ tr: "Doğru & Düzlem", en: "Line & Plane" }, { tr: R`\(\mathbf r(t) = P_0 + t\mathbf d\quad\) ve \(\quad ax + by + cz = d\)`, en: R`\(\mathbf r(t) = P_0 + t\mathbf d\quad\) and \(\quad ax + by + cz = d\)` }],
      [{ tr: "Vektörel çarpım", en: "Cross product" }, { tr: R`\(\mathbf u\times\mathbf v \perp \mathbf u, \mathbf v\), alan \(=\|\mathbf u\times\mathbf v\|\), hacim \(=|\mathbf a\cdot(\mathbf b\times\mathbf c)|\)`, en: R`\(\mathbf u\times\mathbf v \perp \mathbf u, \mathbf v\), area \(=\|\mathbf u\times\mathbf v\|\), volume \(=|\mathbf a\cdot(\mathbf b\times\mathbf c)|\)` }],
    ],
    tip: {
      title: { tr: "3B'de tek denklem ne çizer?", en: "What does one linear equation draw in 3D?" },
      text: {
        tr: R`2B'de tek doğrusal denklem \(ax + by = c\) bir doğru verirdi; ancak 3B'de \(ax + by + cz = d\) bir doğru DEĞİL, bir <b>düzlem</b> verir! Uzayda bir doğruyu yazmak için parametrik form \(\mathbf r(t) = P_0 + t\mathbf d\) (veya iki düzlemin kesişimi) gerekir.`,
        en: R`In 2D one linear equation \(ax + by = c\) draws a line, but in 3D one equation \(ax + by + cz = d\) draws a <b>plane</b>, NOT a line! To describe a line in space, use parametric form \(\mathbf r(t) = P_0 + t\mathbf d\) (or the intersection of two planes).`,
      },
    },
  },
  sections: [
    {
      id: "sg-lines",
      mathId: "m-sg-lines",
      title: { tr: "3B Koordinatlar ve Uzayda Parametrik Doğrular", en: "3D Coordinates & Parametric Lines in Space" },
      body: [
        {
          tr: R`Uzayda her nokta üç sayıdan oluşur: \(P = (x, y, z)\). Noktanın yere (\(xy\)-düzlemine) düşen gölgesi \((x, y, 0)\)'dır ve \(z\) yerden yüksekliği gösterir. İki nokta arasındaki uzaklık bildiğimiz Pisagor'un üç boyutlu hâlidir: \(d(A, B) = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}\).`,
          en: R`Every point in space has three coordinates: \(P = (x, y, z)\). Its floor shadow on the \(xy\)-plane is \((x, y, 0)\), and \(z\) is its height above the floor. Distance between two points is simply 3D Pythagoras: \(d(A, B) = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}\).`,
        },
        {
          tr: R`Uzayda bir doğruyu tanımlamak için tek bir başlangıç noktası \(P_0\) ve bir yön [[vector|vektörü]] \(\mathbf d = (d_1, d_2, d_3)\) yeterlidir. \(t\) parametresi tüm reel sayıları tararken \(\mathbf r(t) = P_0 + t\mathbf d\) doğrunun her noktasını tek tek üretir.`,
          en: R`To specify a line in 3D space, all we need is one anchor point \(P_0\) and one direction [[vector|vector]] \(\mathbf d = (d_1, d_2, d_3)\). As the scalar parameter \(t\) sweeps through all real numbers, \(\mathbf r(t) = P_0 + t\mathbf d\) traces the entire infinite line.`,
        },
        {
          analogy: {
            title: { tr: "Sabit Hızlı Drone Uçuşu", en: "Constant-Velocity Drone Flight" },
            text: {
              tr: R`Drone'u \(P_0 = (x_0, y_0, z_0)\) pistinden kaldırıp saniyede \(\mathbf d = (d_1, d_2, d_3)\) hız vektörüyle düz uçurun: \(t\). saniyede drone'un 3B GPS konumu tam olarak \(P_0 + t\mathbf d\) olur! \(t < 0\) değerleri ise kalkıştan önceki geri uzantıyı gösterir.`,
              en: R`Launch a drone from pad \(P_0 = (x_0, y_0, z_0)\) flying straight at constant velocity \(\mathbf d = (d_1, d_2, d_3)\): at second \(t\), its exact 3D GPS position is \(P_0 + t\mathbf d\)! Negative \(t\) traces the path backward behind the pad.`,
            },
          },
        },
        { eq: R`\mathbf r(t) = P_0 + t\mathbf d = (x_0 + t d_1,\ y_0 + t d_2,\ z_0 + t d_3), \qquad t \in \mathbb{R}` },
        {
          example: {
            title: { tr: "İki noktadan geçen 3B doğru ve yere iniş noktası", en: "3D line through two points & where it hits the floor" },
            problem: {
              tr: R`\(A = (1, 0, 2)\) ve \(B = (3, 4, 0)\) noktalarından geçen doğrunun parametrik denklemini yazın; doğrunun orta noktasını ve \(xy\)-düzlemini (\(z = 0\)) kestiği noktayı bulun.`,
              en: R`Write the parametric line through \(A = (1, 0, 2)\) and \(B = (3, 4, 0)\), then find its midpoint and where it meets the \(xy\)-plane (\(z = 0\)).`,
            },
            steps: [
              {
                expr: R`\mathbf d = B - A = (3 - 1,\ 4 - 0,\ 0 - 2) = (2,\ 4,\ -2)`,
                note: { tr: R`\(A\)'dan \(B\)'ye giden yön vektörünü çıkararak buluyoruz.`, en: R`Find the direction vector pointing from \(A\) to \(B\).` },
              },
              {
                expr: R`\mathbf r(t) = (1, 0, 2) + t(2, 4, -2) = (1 + 2t,\ 4t,\ 2 - 2t)`,
                note: { tr: R`\(t = 0\) iken \(A\)'dayız; \(t = 1\) iken tam \(B\)'ye ulaşırız.`, en: R`At \(t = 0\) we are at \(A\); at \(t = 1\) we arrive right at \(B\).` },
              },
              {
                expr: R`t = 0{,}5 \implies \mathbf r(0{,}5) = (2, 2, 1), \qquad z = 0 \implies 2 - 2t = 0 \implies t = 1`,
                note: { tr: R`Orta nokta \((2, 2, 1)\) ve yere iniş noktası \(B = (3, 4, 0)\) olur ✓.`, en: R`Midpoint is \((2, 2, 1)\) and the floor touchdown is \(B = (3, 4, 0)\) ✓.` },
              },
            ],
            answer: {
              tr: R`\(\mathbf r(t) = (1 + 2t,\ 4t,\ 2 - 2t)\), orta nokta \((2, 2, 1)\), \(xy\)-kesişimi \((3, 4, 0)\).`,
              en: R`\(\mathbf r(t) = (1 + 2t,\ 4t,\ 2 - 2t)\), midpoint \((2, 2, 1)\), \(xy\)-intercept \((3, 4, 0)\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Tek bir lineer denklem 3B'de doğru DEĞİL, düzlemdir!", en: "A single linear equation in 3D is a PLANE, not a line!" },
            text: {
              tr: R`\(2x + 3y - z = 5\) denklemini görüp <i>"bu bir doğru"</i> demek en sık yapılan 3B hatasıdır! 3 değişkenden tek bir kısıtlama çıkınca \(3 - 1 = 2\) serbest boyut kalır, yani sonsuz bir <b>düzlem</b> oluşur.`,
              en: R`Never call \(2x + 3y - z = 5\) a line! In 3D space, one linear constraint removes \(1\) degree of freedom from \(3\), leaving \(2\) dimensions — an infinite flat <b>plane</b>!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`3B sahneyi fareyle sürükleyerek döndürün; \(t\) kaydırıcısını oynatarak turuncu \(P(t)\) noktasının ve yere düşen kesikli gölgesinin hareketini izleyin.`, en: R`Drag to orbit the 3D scene; slide \(t\) to watch orange point \(P(t)\) and its dashed vertical floor drop glide in 3D.` },
            { tr: R`Sağ üstteki <b>XY</b> ve <b>XZ</b> kamera düğmelerine basarak aynı 3B doğrunun üstten ve yandan 2B görünüşünü inceleyin.`, en: R`Click the <b>XY</b> and <b>XZ</b> camera buttons to view the line from straight above and from the side.` },
            { tr: R`"Yatay (d_z = 0)" düğmesine basın: doğrunun yüksekliği sabit kalır ve \(xy\)-tabanına paralel uçar!`, en: R`Click "Horizontal (d_z = 0)": the line cruises at constant altitude parallel to the \(xy\)-floor!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.line3 ??= { p0: [0, -0.5, 1.2], d: [1.2, 1, 0.7], t: 1 });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 300 });

        let slT, slDz;
        const draw = () => {
          const pt = [s.p0[0] + s.t * s.d[0], s.p0[1] + s.t * s.d[1], s.p0[2] + s.t * s.d[2]];
          const pMin = [s.p0[0] - 2.2 * s.d[0], s.p0[1] - 2.2 * s.d[1], s.p0[2] - 2.2 * s.d[2]];
          const pMax = [s.p0[0] + 2.2 * s.d[0], s.p0[1] + 2.2 * s.d[1], s.p0[2] + 2.2 * s.d[2]];
          view3d.draw({
            range: 4.2,
            segments: [{ from: pMin, to: pMax, color: COLORS.c1, width: 2.5 }],
            vectors: [{ from: s.p0, to: vAdd(s.p0, s.d), color: COLORS.c3, width: 2.8, label: "d" }],
            points: [
              { p: s.p0, color: COLORS.c1, label: "P₀", dropToXY: true },
              { p: pt, color: COLORS.c2, label: `P(${ns(s.t, 1)})`, dropToXY: true },
            ],
          });
          calc.textContent = `\\(\\mathbf r(${tx(s.t, 1)}) = (${tx(pt[0], 2)},\\ ${tx(pt[1], 2)},\\ ${tx(pt[2], 2)}),\\quad \\mathbf d=(${tx(s.d[0], 1)},\\ ${tx(s.d[1], 1)},\\ ${tx(s.d[2], 1)})\\)`;
        };
        const setL = (p0, d, t) => {
          s.p0 = p0; s.d = d; s.t = t;
          slDz.set(d[2]); slT.set(t);
          draw();
        };
        presets.append(
          makePresetBtn({ tr: "Yükselen doğru", en: "Rising line" }, () => setL([0, -0.5, 1.2], [1.2, 1, 0.7], 1)),
          makePresetBtn({ tr: "Yatay (d_z = 0)", en: "Horizontal (d_z = 0)" }, () => setL([-1, 0, 1.8], [1.4, 0.8, 0], 1)),
          makePresetBtn({ tr: "İnen doğru", en: "Descending" }, () => setL([0, 0, 2.2], [1, 1, -1], 1.2)),
        );
        slT = slider("t", { min: -1.8, max: 1.8, step: 0.1, value: s.t, onInput: (v) => { s.t = v; draw(); } });
        slDz = slider("d_z", { min: -1.5, max: 1.5, step: 0.1, value: s.d[2], onInput: (v) => { s.d[2] = v; draw(); } });
        ctl.append(slT, slDz);
        draw();
      },
    },
    {
      id: "sg-planes",
      mathId: "m-sg-plane",
      title: { tr: "Uzayda Düzlemler ve Normal Vektör ax + by + cz = d", en: "Planes in Space & Normal Vectors ax + by + cz = d" },
      body: [
        {
          tr: R`Uzayda sonsuz bir düz cam levhayı (düzlemi \(\Pi\)) sabitlemek için yalnızca iki bilgi yeterlidir: üzerinden geçen bir \(P_0\) noktası ve yüzeye tam \(90^\circ\) dik duran bir [[normal-vector|normal vektör]] \(\mathbf n = (a, b, c)\). Düzlemdeki her \(\mathbf x = (x, y, z)\) noktası için \(\mathbf x - P_0\) vektörü düzlemin içinde yatar, dolayısıyla normale diktir:`,
          en: R`To freeze an infinite flat sheet (a plane \(\Pi\)) in 3D space, you only need two things: one point \(P_0\) on it and one [[normal-vector|normal vector]] \(\mathbf n = (a, b, c)\) sticking out at \(90^\circ\). Every point \(\mathbf x = (x, y, z)\) on the plane keeps \(\mathbf x - P_0\) perpendicular to \(\mathbf n\):`,
        },
        {
          analogy: {
            title: { tr: "Saplı Tepsi veya Şemsiye Direği", en: "A Flat Tray on a Pole" },
            text: {
              tr: R`Düz bir tepsiyi tam ortasından dik bir sopaya (\(\mathbf n\)) sabitlediğinizi hayal edin. Sopayı hangi yöne eğerseniz tepsinin tamamı o yönde eğilir! Sopanın yönü \(\mathbf n = (a, b, c)\) düzlemin eğimini, sağdaki \(d\) sayısı ise tepsiyi orijinden ne kadar ileri-geri ötelediğinizi belirler.`,
              en: R`Imagine a flat tray bolted perpendicularly to a straight stick (\(\mathbf n\)). Whichever way you tilt the stick, the entire tray tilts with it! The stick \(\mathbf n = (a, b, c)\) fixes the tilt, and the constant \(d\) slides the whole plane parallel to itself.`,
            },
          },
        },
        { eq: R`\mathbf n \cdot (\mathbf x - P_0) = 0 \quad \Longleftrightarrow \quad ax + by + cz = d \qquad (\mathbf n = (a, b, c))` },
        {
          example: {
            title: { tr: "Bir nokta ve normal vektörden düzlem denklemi yazmak", en: "Plane equation from a point and normal vector" },
            problem: {
              tr: R`\(P_0 = (1, 2, 3)\) noktasından geçen ve normal vektörü \(\mathbf n = (2, -1, 4)\) olan düzlemin denklemini bulun.`,
              en: R`Find the equation of the plane passing through \(P_0 = (1, 2, 3)\) with normal vector \(\mathbf n = (2, -1, 4)\).`,
            },
            steps: [
              {
                expr: R`\mathbf n \cdot (\mathbf x - P_0) = 2(x - 1) - 1(y - 2) + 4(z - 3) = 0`,
                note: { tr: R`Normal bileşenlerini \((x - x_0, y - y_0, z - z_0)\) ile nokta çarpım yaparız.`, en: R`Take the dot product of \(\mathbf n\) with \(\mathbf x - P_0\).` },
              },
              {
                expr: R`2x - 2 - y + 2 + 4z - 12 = 0 \implies 2x - y + 4z = 12`,
                note: { tr: R`Sabit sayıları toplayıp sağ tarafa atarız. Kontrol: \(P_0=(1,2,3)\) için \(2(1) - 2 + 4(3) = 12\) ✓!`, en: R`Collect constants on the right. Quick check: \(2(1) - 2 + 4(3) = 12\) ✓!` },
              },
            ],
            answer: { tr: R`\(2x - y + 4z = 12\).`, en: R`\(2x - y + 4z = 12\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Denklemde eksik harf varsa katsayısı 0'dır!", en: "A missing variable has coefficient 0, not 1!" },
            text: {
              tr: R`\(2x - 3z = 6\) düzleminin normal vektörü \((2, -3, 1)\) değil, \(y\) görünmediği için <b>\(\mathbf n = (2, 0, -3)\)</b>'tür! Ayrıca denklemde bir değişken yoksa düzlem o eksene <i>paraleldir</i> (burada \(y\)-eksenine paralel).`,
              en: R`The normal of \(2x - 3z = 6\) is NOT \((2, -3, 1)\) — because \(y\) is absent, its coefficient is \(0\), giving <b>\(\mathbf n = (2, 0, -3)\)</b>! Visually, the plane runs parallel to the missing axis (\(y\)).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`"Yatay z = 1" düğmesine tıklayın: \(a = 0, b = 0\) iken normal \(\mathbf n = (0, 0, 1)\) dosdoğru yukarı bakar ve düzlem tam yatay olur.`, en: R`Click "Horizontal z = 1": with \(a = 0, b = 0\), \(\mathbf n = (0, 0, 1)\) points straight up and the plane lies flat.` },
            { tr: R`\(d\) kaydırıcısını oynatın: düzlemin eğimi hiç değişmeden normal yönünde paralel olarak inip çıktığını görün!`, en: R`Slide \(d\): watch the plane glide smoothly up and down parallel to itself without changing tilt!` },
            { tr: R`\(a\) ve \(b\) ile yeşil \(\mathbf n\) okunu eğin ve sahneyi döndürerek düzlemin oka her zaman tam \(90^\circ\) dik kaldığını gözlemleyin.`, en: R`Tilt the green normal \(\mathbf n\) with \(a\) and \(b\), then orbit to confirm the plane always stays perpendicular to \(\mathbf n\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.pl ??= { a: 0.5, b: 0.5, c: 1, d: 1 });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 300 });

        let slA, slB, slD;
        const draw = () => {
          const n = [s.a, s.b, s.c];
          const n2 = s.a * s.a + s.b * s.b + s.c * s.c || 1;
          const anchor = [(s.a * s.d) / n2, (s.b * s.d) / n2, (s.c * s.d) / n2];
          const nLen = Math.sqrt(n2);
          const nTip = [anchor[0] + (s.a / nLen) * 1.6, anchor[1] + (s.b / nLen) * 1.6, anchor[2] + (s.c / nLen) * 1.6];
          view3d.draw({
            range: 4,
            planes: [{ normal: n, d: s.d, size: 2.7 }],
            vectors: [{ from: anchor, to: nTip, color: COLORS.c3, width: 2.8, label: "n" }],
            points: [{ p: anchor, color: COLORS.c2, label: "P₀" }],
          });
          calc.textContent = `\\(${tx(s.a, 1)}x ${s.b >= 0 ? "+" : "-"} ${tx(Math.abs(s.b), 1)}y + ${tx(s.c, 1)}z = ${tx(s.d, 1)},\\qquad \\mathbf n = (${tx(s.a, 1)},\\ ${tx(s.b, 1)},\\ ${tx(s.c, 1)})\\)`;
        };
        const setP = (a, b, d) => { s.a = a; s.b = b; s.d = d; slA.set(a); slB.set(b); slD.set(d); draw(); };
        presets.append(
          makePresetBtn({ tr: "Yatay z = 1", en: "Horizontal z = 1" }, () => setP(0, 0, 1)),
          makePresetBtn({ tr: "Eğik düzlem", en: "Tilted plane" }, () => setP(0.5, 0.5, 1)),
          makePresetBtn({ tr: "Orijinden geçen (d=0)", en: "Through origin (d=0)" }, () => setP(1, -0.5, 0)),
        );
        slA = slider("a", { min: -1.5, max: 1.5, step: 0.25, value: s.a, onInput: (v) => { s.a = v; draw(); } });
        slB = slider("b", { min: -1.5, max: 1.5, step: 0.25, value: s.b, onInput: (v) => { s.b = v; draw(); } });
        slD = slider("d", { min: -2.5, max: 2.5, step: 0.25, value: s.d, onInput: (v) => { s.d = v; draw(); } });
        ctl.append(slA, slB, slD);
        draw();
      },
    },
    {
      id: "sg-cross",
      mathId: "m-sg-cross",
      title: { tr: "Vektörel Çarpım u × v, Sağ El Kuralı ve Paralelkenar Alanı", en: "Cross Product u × v, Right-Hand Rule & Parallelogram Area" },
      body: [
        {
          tr: R`Nokta çarpım tek bir sayı üretiyordu; [[cross-product|vektörel çarpım]] \(\mathbf u \times \mathbf v\) ise iki 3B vektörden ikisine birden <b>tam \(90^\circ\) dik</b> yepyeni bir 3B vektör üretir! Yönünü <b>sağ el kuralı</b> belirler: sağ elinizin parmaklarını \(\mathbf u\)'dan \(\mathbf v\)'ye doğru kıvırın, başparmağınız \(\mathbf u \times \mathbf v\)'nin yönünü gösterir.`,
          en: R`Whereas the dot product outputs a number, the [[cross-product|cross product]] \(\mathbf u \times \mathbf v\) takes two 3D vectors and outputs a brand-new 3D vector <b>strictly perpendicular</b> to both! Its direction follows the <b>right-hand rule</b>: curl your right fingers from \(\mathbf u\) toward \(\mathbf v\), and your thumb points along \(\mathbf u \times \mathbf v\).`,
        },
        {
          tr: R`Üstelik uzunluğu \(\|\mathbf u \times \mathbf v\| = \|\mathbf u\|\,\|\mathbf v\|\sin\theta\) tam olarak \(\mathbf u\) ve \(\mathbf v\)'nin oluşturduğu <b>paralelkenarın alanına</b> eşittir (oluşturdukları üçgenin alanı ise bunun tam yarısıdır: \(\frac{1}{2}\|\mathbf u \times \mathbf v\|\)).`,
          en: R`Even better, its length \(\|\mathbf u \times \mathbf v\| = \|\mathbf u\|\,\|\mathbf v\|\sin\theta\) equals the exact <b>area of the parallelogram</b> spanned by \(\mathbf u\) and \(\mathbf v\) (so their triangle has area \(\frac{1}{2}\|\mathbf u \times \mathbf v\|\)).`,
        },
        {
          analogy: {
            title: { tr: "İngiliz Anahtarı ve Şişe Kapağı Açmak (Tork)", en: "Turning a Wrench or Unscrewing a Bottle Cap" },
            text: {
              tr: R`Anahtar kolu \(\mathbf u\), uyguladığınız kuvvet \(\mathbf v\) olsun: cıvata ikisine de dik yönde (\(\mathbf u \times \mathbf v\)) yukarı veya aşağı hareket eder! Kolu çekmek yerine paralel iterseniz (\(\theta = 0^\circ\)) cıvata hiç dönmez (\(\mathbf u \times \mathbf v = \mathbf 0\)); en güçlü döndürme tam \(90^\circ\) dik ittiğinizde olur!`,
              en: R`Think of \(\mathbf u\) as a wrench handle and \(\mathbf v\) as your push: the bolt rises or sinks along \(\mathbf u \times \mathbf v\), perpendicular to both! Pushing parallel to the wrench (\(\theta = 0^\circ\)) turns nothing (\(\mathbf u \times \mathbf v = \mathbf 0\)), while pushing at \(90^\circ\) gives maximum torque!`,
            },
          },
        },
        { eq: R`\mathbf u \times \mathbf v = \begin{vmatrix}\mathbf i & \mathbf j & \mathbf k \\ u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3\end{vmatrix} = (u_2 v_3 - u_3 v_2,\ u_3 v_1 - u_1 v_3,\ u_1 v_2 - u_2 v_1)` },
        {
          example: {
            title: { tr: "Vektörel çarpım hesabı, diklik kontrolü ve alan", en: "Computing a cross product, checking orthogonality & area" },
            problem: {
              tr: R`\(\mathbf u = (1, 2, 0)\) ve \(\mathbf v = (0, 1, 3)\) için \(\mathbf u \times \mathbf v\)'yi hesaplayın, her ikisine de dik olduğunu doğrulayın ve paralelkenar alanını bulun.`,
              en: R`Compute \(\mathbf u \times \mathbf v\) for \(\mathbf u = (1, 2, 0)\) and \(\mathbf v = (0, 1, 3)\), check orthogonality, and find the parallelogram area.`,
            },
            steps: [
              {
                expr: R`\mathbf i:\ 2(3) - 0(1) = 6, \qquad -\mathbf j:\ -\big(1(3) - 0(0)\big) = -3, \qquad \mathbf k:\ 1(1) - 2(0) = 1`,
                note: { tr: R`Determinantın ilk satırına göre açılım yaparız — ortadaki \(\mathbf j\) bileşenindeki <b>eksi işaretine</b> dikkat!`, en: R`Expand the \(3\times 3\) determinant along the top row — watch the <b>minus sign</b> on the middle \(\mathbf j\) entry!` },
              },
              {
                expr: R`\mathbf u \cdot (6, -3, 1) = 6 - 6 + 0 = 0, \qquad \mathbf v \cdot (6, -3, 1) = 0 - 3 + 3 = 0`,
                note: { tr: R`Her iki nokta çarpım da sıfır! Hesabımız %100 doğru ✓.`, en: R`Both dot products equal zero — instant confirmation our arithmetic is 100% right ✓.` },
              },
              {
                expr: R`\text{Alan} = \|\mathbf u \times \mathbf v\| = \sqrt{6^2 + (-3)^2 + 1^2} = \sqrt{46} \approx 6{,}78`,
                note: { tr: R`Vektörel çarpımın uzunluğu paralelkenarın alanını verir.`, en: R`The norm of the cross product gives the parallelogram area.` },
              },
            ],
            answer: { tr: R`\(\mathbf u \times \mathbf v = (6, -3, 1)\) ve alan \(\sqrt{46}\).`, en: R`\(\mathbf u \times \mathbf v = (6, -3, 1)\) with area \(\sqrt{46}\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sıra değişirse ok TERS döner: v × u = −(u × v)!", en: "Swapping order FLIPS the arrow: v × u = −(u × v)!" },
            text: {
              tr: R`Nokta çarpımın aksine vektörel çarpımda <b>değişme özelliği yoktur</b>! \(\mathbf u\) ile \(\mathbf v\)'nin yerini değiştirdiğinizde sonuç eksi ile çarpılır (\(\mathbf i \times \mathbf j = \mathbf k\), ama \(\mathbf j \times \mathbf i = -\mathbf k\)). Ayrıca ortadaki \(\mathbf j\) bileşeninin başındaki eksi işaretini asla unutmayın!`,
              en: R`Unlike the dot product, the cross product is <b>anti-commutative</b>: swapping \(\mathbf u\) and \(\mathbf v\) reverses the vector (\(\mathbf i \times \mathbf j = \mathbf k\), but \(\mathbf j \times \mathbf i = -\mathbf k\)). Also never forget the minus sign on the middle \(\mathbf j\)-component!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Sahneyi döndürerek turuncu \(\mathbf u \times \mathbf v\) okunun taralı mavi paralelkenara her açıdan \(90^\circ\) dik olduğunu görün.`, en: R`Orbit the 3D view to confirm the orange \(\mathbf u \times \mathbf v\) arrow rises at \(90^\circ\) from the blue parallelogram.` },
            { tr: R`<b>"Sırayı değiştir (u×v ↔ v×u)"</b> düğmesine tıklayın: turuncu okun anında tam ters yöne döndüğünü, ancak alanın aynı kaldığını izleyin!`, en: R`Toggle <b>"Swap order (u×v ↔ v×u)"</b>: watch the orange arrow flip upside down while the area stays identical!` },
            { tr: R`"Paralel (Alan = 0)" düğmesine basın: paralelkenar tek bir çizgiye çöker ve \(\mathbf u \times \mathbf v = (0, 0, 0)\) olur.`, en: R`Click "Parallel (Area = 0)": the parallelogram collapses to a line and \(\mathbf u \times \mathbf v = (0, 0, 0)\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.cross ??= { u: [2, 0.5, 0.5], v: [0.5, 2, 0.5], flip: false });
        const presets = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(presets, ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 310 });

        let slUz, slVx, slVy;
        const draw = () => {
          const a = s.flip ? s.v : s.u;
          const b = s.flip ? s.u : s.v;
          const c = cross3(a, b);
          const sum = vAdd(s.u, s.v);
          const lbl = s.flip ? "v×u" : "u×v";
          view3d.draw({
            range: 4.5,
            quads: [{ pts: [[0, 0, 0], s.u, sum, s.v], fill: "rgba(42,120,214,0.18)", stroke: COLORS.c1 }],
            vectors: [
              { to: s.u, color: COLORS.c1, label: "u" },
              { to: s.v, color: COLORS.c3, label: "v" },
              { to: c, color: COLORS.c2, width: 3, label: lbl },
            ],
          });
          calc.textContent = `\\(${s.flip ? "\\mathbf v\\times\\mathbf u" : "\\mathbf u\\times\\mathbf v"} = (${tx(c[0], 2)},\\ ${tx(c[1], 2)},\\ ${tx(c[2], 2)}),\\quad \\text{Alan} = ${tx(vNorm(c), 2)},\\quad \\mathbf u\\cdot(\\mathbf u\\times\\mathbf v)=${tx(vDot(s.u, c), 1)}\\)`;
        };
        const setC = (u, v, flip = false) => {
          s.u = [...u]; s.v = [...v]; s.flip = flip;
          slUz.set(u[2]); slVx.set(v[0]); slVy.set(v[1]);
          draw();
        };
        presets.append(
          makePresetBtn({ tr: "Standart", en: "Standard" }, () => setC([2, 0.5, 0.5], [0.5, 2, 0.5], false)),
          makePresetBtn({ tr: "Dik (i × j = k)", en: "Right (i × j = k)" }, () => setC([2, 0, 0], [0, 2, 0], false)),
          makePresetBtn({ tr: "Paralel (Alan=0)", en: "Parallel (Area=0)" }, () => setC([2, 1, 0], [1, 0.5, 0], false)),
          makePresetBtn({ tr: "Sırayı değiştir (u×v ↔ v×u)", en: "Swap (u×v ↔ v×u)" }, () => { s.flip = !s.flip; draw(); }),
        );
        slUz = slider("u_z", { min: -2, max: 2, step: 0.25, value: s.u[2], onInput: (v) => { s.u[2] = v; draw(); } });
        slVx = slider("v_x", { min: -2, max: 2, step: 0.25, value: s.v[0], onInput: (v) => { s.v[0] = v; draw(); } });
        slVy = slider("v_y", { min: -2, max: 2.5, step: 0.25, value: s.v[1], onInput: (v) => { s.v[1] = v; draw(); } });
        ctl.append(slUz, slVx, slVy);
        draw();
      },
    },
    {
      id: "sg-skew",
      mathId: "m-sg-plane",
      title: { tr: "Nokta–Düzlem Uzaklığı ve Uzayda Aykırı Doğrular", en: "Point-to-Plane Distance & Skew Lines in 3D" },
      body: [
        {
          tr: R`Bir \(Q = (q_1, q_2, q_3)\) noktasının \(\Pi: ax + by + cz = d\) düzlemine olan en kısa uzaklığı, 2B nokta–doğru formülünün birebir 3B ikizidir: noktayı denkleme koyar, normalin uzunluğuna böleriz!`,
          en: R`The shortest distance from a point \(Q = (q_1, q_2, q_3)\) to the plane \(\Pi: ax + by + cz = d\) is the exact 3D twin of the 2D point-to-line formula: substitute \(Q\) into the plane equation and divide by the norm of \(\mathbf n\)!`,
        },
        {
          tr: R`Uzayda iki doğru ise düzlemden farklı olarak üçüncü bir şaşırtıcı duruma girebilir: ne paraleldirler ne de kesişirler — bunlara [[skew-lines|aykırı doğrular]] denir! İkisinin ortak dikme yönü \(\mathbf n = \mathbf d_1 \times \mathbf d_2\) olduğundan en kısa mesafe \(P_2 - P_1\) vektörünün bu ortak dikme üzerine [[projection|izdüşümüdür]].`,
          en: R`Meanwhile, two lines in 3D have a surprising third possibility beyond intersecting or parallel: they can miss each other completely ([[skew-lines|skew lines]])! Their common perpendicular direction is \(\mathbf n = \mathbf d_1 \times \mathbf d_2\), so the shortest distance simply projects \(P_2 - P_1\) onto \(\mathbf d_1 \times \mathbf d_2\).`,
        },
        {
          analogy: {
            title: { tr: "Otoyol Üst Geçidi ve Alt Geçit", en: "Highway Overpass & Underpass" },
            text: {
              tr: R`Haritaya kuş bakışı baktığınızda kuzey–güney otoyolu ile doğu–batı otoyolu kesişiyor gibi görünür. Oysa yandan baktığınızda biri diğerinin \(5\) metre üstünden köprüyle geçmektedir! İki yol ne paraleldir ne çarpışır (<b>aykırı doğrular</b>); aralarındaki \(5\) metrelik dik köprü ayağı ise her iki yola da \(90^\circ\) diktir!`,
              en: R`On a flat map, a North–South highway and an East–West highway appear to cross. Look from the side in 3D and one bridges \(5\) meters above the other! They never collide and aren't parallel (<b>skew lines</b>), and the vertical \(5\text{-meter}\) pillar between them is perpendicular to both roads!`,
            },
          },
        },
        { eq: R`d(Q, \Pi) = \frac{|a q_1 + b q_2 + c q_3 - d|}{\sqrt{a^2 + b^2 + c^2}}, \qquad d(\ell_1, \ell_2) = \frac{|(P_2 - P_1) \cdot (\mathbf d_1 \times \mathbf d_2)|}{\|\mathbf d_1 \times \mathbf d_2\|}` },
        {
          example: {
            title: { tr: "Nokta–düzlem uzaklığı ve aykırı doğrular hesabı", en: "Point-to-plane & skew-line distance examples" },
            problem: {
              tr: R`(a) \(Q = (1, 2, 2)\) noktasının \(2x + y + 2z = 2\) düzlemine uzaklığı kaçtır? (b) \(\ell_1: (0,0,0)+t(1,0,0)\) ve \(\ell_2: (0,0,4)+s(0,1,0)\) doğruları arası en kısa mesafe kaçtır?`,
              en: R`(a) Find the distance from \(Q = (1, 2, 2)\) to \(2x + y + 2z = 2\). (b) Find the shortest distance between \(\ell_1: (0,0,0)+t(1,0,0)\) and \(\ell_2: (0,0,4)+s(0,1,0)\).`,
            },
            steps: [
              {
                expr: R`d(Q, \Pi) = \frac{|2(1) + 1(2) + 2(2) - 2|}{\sqrt{2^2 + 1^2 + 2^2}} = \frac{|2 + 2 + 4 - 2|}{\sqrt{9}} = \frac{6}{3} = 2`,
                note: { tr: R`Düzlem \(= 2\) biçiminde olduğu için formülde \(-2\) çıkarırız.`, en: R`Because the plane is written \(= 2\), we subtract \(2\) inside the absolute value.` },
              },
              {
                expr: R`\mathbf d_1 \times \mathbf d_2 = (1,0,0) \times (0,1,0) = (0,0,1), \qquad P_2 - P_1 = (0,0,4)`,
                note: { tr: R`İki yönün vektörel çarpımı ortak dikme yönü \(z\)-eksenini verir.`, en: R`Crossing the two directions yields the common vertical normal \((0, 0, 1)\).` },
              },
              {
                expr: R`d(\ell_1, \ell_2) = \frac{|(0,0,4)\cdot(0,0,1)|}{\|(0,0,1)\|} = \frac{4}{1} = 4`,
                note: { tr: R`Birinci doğru \(z = 0\) zemininde, ikincisi \(z = 4\) yüksekliğinde; en kısa mesafe tam \(4\)'tür ✓.`, en: R`Line 1 lies on floor \(z = 0\) and line 2 at height \(z = 4\), so the shortest bridge has length \(4\) ✓.` },
              },
            ],
            answer: { tr: R`(a) \(d(Q, \Pi) = 2\), (b) \(d(\ell_1, \ell_2) = 4\).`, en: R`(a) \(d(Q, \Pi) = 2\), (b) \(d(\ell_1, \ell_2) = 4\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "ax + by + cz = d ile ax + by + cz + d = 0 işaretine dikkat!", en: "Watch the sign of d in ax + by + cz = d vs. = 0!" },
            text: {
              tr: R`Düzlem \(2x + y + 2z = 2\) şeklinde verildiyse payda \(|2x + y + 2z - 2|\) (<b>eksi</b>) yazılır; \(2x + y + 2z + 2 = 0\) şeklinde verildiyse <b>artı</b> kalır! En güvenli yol her zaman önce tüm terimleri sola toplayıp \(= 0\) yapmaktır.`,
              en: R`If the plane is \(2x + y + 2z = 2\), the numerator is \(|2x + y + 2z - 2|\); if it is \(2x + y + 2z + 2 = 0\), keep the \(+2\)! Safest habit: always move everything to the left-hand side (\(= 0\)) before plugging in \(Q\)!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"Aykırı doğrular"</b> modunda <b>XY</b> kamerasına tıklayın: üstten bakınca iki doğru kesişiyor gibi görünür! Şimdi sürükleyip yandan bakın ve aralarındaki turuncu köprü ayağını görün!`, en: R`In <b>"Skew lines"</b> mode, click <b>XY</b>: from overhead they look like they cross! Now drag to orbit sideways and spot the vertical orange bridge separating them!` },
            { tr: R`\(h = 0\) yapın: iki doğru tam orijinde buluşur ve \(d(\ell_1, \ell_2) = 0\) olur.`, en: R`Slide \(h = 0\): the two lines collide at the origin and \(d(\ell_1, \ell_2) = 0\).` },
            { tr: R`<b>"Nokta–Düzlem"</b> moduna geçip \(q_z\)'yi kaydırarak \(Q\) noktasını düzlemin içinden geçirin ve dikme ayağı \(H\)'yi izleyin.`, en: R`Switch to <b>"Point-to-Plane"</b> mode and slide \(q_z\) through the plane while tracking the perpendicular foot \(H\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.dist3 ??= { mode: "skew", h: 1.8, qz: 2.8, a: 0.4 });
        const modeRow = h("div", { class: "t-controls" });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(modeRow, ctl, host, calc);
        const view3d = createCanvas3D(host, { height: 300 });

        const draw = () => {
          if (s.mode === "skew") {
            const p1 = [0, 0, 0], d1 = [1, 0.25, 0];
            const p2 = [0, 0, s.h], d2 = [0.2, 1, 0];
            const dist = skewLinesDist3D(p1, d1, p2, d2);
            view3d.draw({
              range: 4,
              segments: [
                { from: [-3 * d1[0], -3 * d1[1], 0], to: [3 * d1[0], 3 * d1[1], 0], color: COLORS.c1, width: 2.6 },
                { from: [-3 * d2[0], -3 * d2[1], s.h], to: [3 * d2[0], 3 * d2[1], s.h], color: COLORS.c3, width: 2.6 },
                { from: [0, 0, 0], to: [0, 0, s.h], color: COLORS.c2, dash: [4, 3], width: 2.6 },
              ],
              points: [
                { p: [0, 0, 0], color: COLORS.c1, label: "ℓ₁" },
                { p: [0, 0, s.h], color: COLORS.c3, label: "ℓ₂" },
              ],
            });
            calc.textContent = `\\(d(\\ell_1, \\ell_2) = ${tx(dist, 2)}\\quad (${Math.abs(dist) < 1e-6 ? L({ tr: "\\text{Kesişiyor!}", en: "\\text{Intersecting!}" }) : L({ tr: "\\text{Aykırı doğrular}", en: "\\text{Skew lines}" })})\\)`;
          } else {
            const n = [s.a, 0.4, 1];
            const d = 0.5;
            const Q = [1, 1, s.qz];
            const n2 = n[0] * n[0] + n[1] * n[1] + n[2] * n[2];
            const t = (vDot(n, Q) - d) / n2;
            const H = [Q[0] - n[0] * t, Q[1] - n[1] * t, Q[2] - n[2] * t];
            const dist = pointPlaneDist3D(Q, n, d);
            view3d.draw({
              range: 4,
              planes: [{ normal: n, d, size: 2.8 }],
              segments: [{ from: Q, to: H, color: COLORS.c2, dash: [5, 3], width: 2.4 }],
              vectors: [{ from: H, to: [H[0] + n[0], H[1] + n[1], H[2] + n[2]], color: COLORS.c3, label: "n" }],
              points: [
                { p: Q, color: COLORS.c2, label: "Q" },
                { p: H, color: COLORS.c1, label: "H" },
              ],
            });
            calc.textContent = `\\(${tx(n[0], 1)}x + ${tx(n[1], 1)}y + z = ${tx(d, 1)},\\qquad d(Q,\\Pi) = ${tx(dist, 3)}\\)`;
          }
        };

        const rebuildSliders = () => {
          ctl.replaceChildren();
          if (s.mode === "skew") {
            const slH = slider("h", { min: -2.4, max: 2.4, step: 0.2, value: s.h, onInput: (v) => { s.h = v; draw(); } });
            ctl.append(
              slH,
              makePresetBtn({ tr: "Kesişme (h=0)", en: "Intersect (h=0)" }, () => { s.h = 0; slH.set(0); draw(); }),
              makePresetBtn({ tr: "Köprü (h=2)", en: "Bridge (h=2)" }, () => { s.h = 2; slH.set(2); draw(); }),
            );
          } else {
            ctl.append(
              slider("q_z", { min: -2, max: 3.5, step: 0.2, value: s.qz, onInput: (v) => { s.qz = v; draw(); } }),
              slider("a", { min: -1.2, max: 1.2, step: 0.2, value: s.a, onInput: (v) => { s.a = v; draw(); } }),
            );
          }
          draw();
        };

        modeRow.append(
          segmented(
            [
              ["skew", { tr: "Aykırı doğrular", en: "Skew lines" }],
              ["plane", { tr: "Nokta–Düzlem", en: "Point-to-Plane" }],
            ],
            s.mode,
            (v) => { s.mode = v; rebuildSliders(); },
          ),
        );
        rebuildSliders();
      },
    },
  ],
  playground: {
    title: { tr: "3B Geometri ve Karma Çarpım Atölyesi", en: "3D Geometry & Triple Product Studio" },
    sub: {
      tr: R`Hazır 3B senaryolar arasında geçiş yapın: iki düzlemin kesişim doğrusu (\(\mathbf d = \mathbf n_1 \times \mathbf n_2\)), üç vektörün karma çarpım hacmi (\(|\mathbf a \cdot (\mathbf b \times \mathbf c)|\)) ve üç noktadan geçen düzlem kurulumu!`,
      en: R`Switch between classic 3D setups: the intersection line of two planes (\(\mathbf d = \mathbf n_1 \times \mathbf n_2\)), parallelepiped volume via the scalar triple product (\(|\mathbf a \cdot (\mathbf b \times \mathbf c)|\)), and building a plane through 3 points!`,
    },
    experiments: [
      {
        tr: R`<b>İki düzlemin kesişimi:</b> <i>"İki düzlem kesişimi"</i> modunda sahneyi döndürün: turuncu kesişim doğrusunun hem mavi \(\mathbf n_1\)'e hem yeşil \(\mathbf n_2\)'ye dik (\(\mathbf d = \mathbf n_1 \times \mathbf n_2\)) olduğunu görün!`,
        en: R`<b>Two planes intersect in a line:</b> orbit <i>"Two-plane intersection"</i> to verify that the orange intersection line is perpendicular to BOTH normals (\(\mathbf d = \mathbf n_1 \times \mathbf n_2\))!`,
      },
      {
        tr: R`<b>Hacim ne zaman sıfırlanır (Eşdüzlemlilik)?</b> <i>"Eşdüzlemli (Hacim = 0)"</i> düğmesine basın: \(c_z = 0\) olunca üç vektör aynı \(xy\)-tabanına yatar ve 3B hacim tam \(0\) olur!`,
        en: R`<b>When does volume vanish (Coplanarity)?</b> Click <i>"Coplanar (Vol = 0)"</i>: setting \(c_z = 0\) flattens all three vectors into the \(xy\)-plane so 3D volume drops to \(0\)!`,
      },
      {
        tr: R`<b>Üç ayaklı sehpa = Tek bir düzlem:</b> <i>"3 Noktadan Düzlem"</i> modunda \(A, B, C\) noktalarının oluşturduğu \(\overrightarrow{AB} \times \overrightarrow{AC}\) vektörel çarpımının düzlemin normalini nasıl otomatik ürettiğini inceleyin.`,
        en: R`<b>A 3-legged stool fixes one plane:</b> in <i>"Plane from 3 points"</i> mode, watch \(\overrightarrow{AB} \times \overrightarrow{AC}\) automatically construct the plane's normal vector.`,
      },
      {
        tr: R`<b>Yükseklik = Hacim çarpanı:</b> <i>"Karma çarpım hacmi"</i> modunda \(c_z\) kaydırıcısını iki katına çıkarın: taban alanı sabit kaldığı için hacmin de tam iki katına çıktığını doğrulayın.`,
        en: R`<b>Height scales volume linearly:</b> in <i>"Triple product volume"</i> mode, double \(c_z\) and watch the parallelepiped volume double proportionally.`,
      },
    ],
    build(host, state) {
      const s = (state.pg ??= { preset: "planes", zScale: 1.8, tilt: 0.5 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const view3d = createCanvas3D(stage, { height: 390 });
      const quickBtns = h("div", { class: "t-controls" });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır senaryolar", en: "Quick presets" }) }),
        quickBtns,
        h("div", { class: "mini-title", text: L({ tr: "3B Sahne modu", en: "3D Scene mode" }) }),
        ctl,
        ctl2,
        tiles,
        calc,
      );

      let segMode, slZ;
      const draw = () => {
        if (s.preset === "planes") {
          const n1 = [1, 0, s.tilt], n2 = [0, 1, -s.tilt];
          const dir = cross3(n1, n2);
          const ang = (Math.acos(Math.min(1, Math.abs(vDot(n1, n2)) / (vNorm(n1) * vNorm(n2)))) * 180) / Math.PI;
          view3d.draw({
            range: 4,
            planes: [
              { normal: n1, d: 0, color: "rgba(42,120,214,0.18)", size: 2.8 },
              { normal: n2, d: 0, color: "rgba(27,175,122,0.18)", size: 2.8 },
            ],
            segments: [{ from: [-2.4 * dir[0], -2.4 * dir[1], -2.4 * dir[2]], to: [2.4 * dir[0], 2.4 * dir[1], 2.4 * dir[2]], color: COLORS.c2, width: 3.2 }],
            vectors: [
              { to: n1, color: COLORS.c1, label: "n₁" },
              { to: n2, color: COLORS.c3, label: "n₂" },
            ],
          });
          tiles.replaceChildren(
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Düzlemler açısı", en: "Dihedral angle" }) }), h("span", { class: "pg-tile-value", text: `${ns(ang, 1)}°` })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "‖n₁×n₂‖" }), h("span", { class: "pg-tile-value", text: ns(vNorm(dir), 2) })),
          );
          calc.textContent = `\\(\\mathbf d = \\mathbf n_1 \\times \\mathbf n_2 = (${tx(dir[0], 2)},\\ ${tx(dir[1], 2)},\\ ${tx(dir[2], 2)})\\)`;
        } else if (s.preset === "vol") {
          const a = [2.2, 0.4, 0], b = [0.4, 2.2, 0], c = [0.6, 0.5, s.zScale];
          const baseArea = vNorm(cross3(a, b));
          const vol = Math.abs(triple3(a, b, c));
          view3d.draw({
            range: 4,
            quads: [{ pts: [[0, 0, 0], a, vAdd(a, b), b], fill: "rgba(42,120,214,0.18)", stroke: COLORS.c1 }],
            vectors: [
              { to: a, color: COLORS.c1, label: "a" },
              { to: b, color: COLORS.c3, label: "b" },
              { to: c, color: COLORS.c2, label: "c" },
            ],
          });
          tiles.replaceChildren(
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Taban alanı", en: "Base area" }) }), h("span", { class: "pg-tile-value", text: ns(baseArea, 2) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Hacim |det|", en: "Volume |det|" }) }), h("span", { class: "pg-tile-value", text: ns(vol, 2) })),
          );
          calc.textContent = `\\(\\text{Hacim} = |\\mathbf a\\cdot(\\mathbf b\\times\\mathbf c)| = ${tx(vol, 2)}\\quad ${vol < 1e-6 ? "(\\text{Eşdüzlemli! / Coplanar!})" : ""}\\)`;
        } else {
          const A = [2, 0, 0], B = [0, 2, 0], C = [0, 0, Math.max(0.4, s.zScale)];
          const ab = vSub(B, A);
          const ac = vSub(C, A);
          const n = cross3(ab, ac);
          const d = vDot(n, A);
          const nLen = vNorm(n) || 1;
          const mid = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3];
          view3d.draw({
            range: 4,
            planes: [{ normal: n, d, color: "rgba(141,82,201,0.16)", size: 2.6 }],
            segments: [
              { from: A, to: B, color: COLORS.c1, width: 2.2 },
              { from: A, to: C, color: COLORS.c3, width: 2.2 },
              { from: B, to: C, color: COLORS.muted, dash: [4, 3], width: 1.8 },
            ],
            vectors: [
              { from: mid, to: [mid[0] + (n[0] / nLen) * 1.5, mid[1] + (n[1] / nLen) * 1.5, mid[2] + (n[2] / nLen) * 1.5], color: COLORS.c2, width: 2.8, label: "n" },
            ],
            points: [
              { p: A, color: COLORS.c1, label: "A" },
              { p: B, color: COLORS.c3, label: "B" },
              { p: C, color: COLORS.c2, label: "C" },
            ],
          });
          tiles.replaceChildren(
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Üçgen alanı", en: "Triangle area" }) }), h("span", { class: "pg-tile-value", text: ns(nLen / 2, 2) })),
            h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "C_z" }), h("span", { class: "pg-tile-value", text: ns(C[2], 1) })),
          );
          calc.textContent = `\\(\\mathbf n = \\overrightarrow{AB}\\times\\overrightarrow{AC} = (${tx(n[0], 1)},\\ ${tx(n[1], 1)},\\ ${tx(n[2], 1)}),\\quad ${tx(n[0], 1)}x + ${tx(n[1], 1)}y + ${tx(n[2], 1)}z = ${tx(d, 1)}\\)`;
        }
      };

      const setScene = (preset, zScale, tilt) => {
        s.preset = preset;
        if (zScale !== undefined) { s.zScale = zScale; slZ.set(zScale); }
        if (tilt !== undefined) s.tilt = tilt;
        segMode.set(preset);
        draw();
      };
      quickBtns.append(
        makePresetBtn({ tr: "Dik Düzlemler (90°)", en: "Right Planes (90°)" }, () => setScene("planes", undefined, 0)),
        makePresetBtn({ tr: "Eğik Kesişim", en: "Tilted Planes" }, () => setScene("planes", undefined, 0.6)),
        makePresetBtn({ tr: "Eşdüzlemli (Hacim=0)", en: "Coplanar (Vol=0)" }, () => setScene("vol", 0)),
        makePresetBtn({ tr: "3 Noktadan Düzlem", en: "3-Point Plane" }, () => setScene("pts3", 2)),
      );

      segMode = segmented(
        [
          ["planes", { tr: "İki düzlem", en: "Two planes" }],
          ["vol", { tr: "Karma çarpım", en: "Triple volume" }],
          ["pts3", { tr: "3 Noktadan düzlem", en: "3-Point plane" }],
        ],
        s.preset,
        (v) => { s.preset = v; draw(); },
      );
      ctl.append(segMode);
      slZ = slider("z / c_z", { min: 0, max: 3, step: 0.2, value: s.zScale, onInput: (v) => { s.zScale = v; draw(); } });
      ctl2.append(slZ);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-sg-lines",
      title: { tr: "Uzayda Doğrular, Düzlemler ve 3 Noktadan Düzlem", en: "Lines, Planes & Plane Through 3 Points" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Nesne / İlişki", en: "Object / Relation" },
              { tr: "Denklem veya Test", en: "Equation or Test" },
              { tr: "Geometrik anlam", en: "Geometric meaning" },
            ],
            rows: [
              [{ tr: "Parametrik doğru", en: "Parametric line" }, R`\(\mathbf r(t) = P_0 + t\mathbf d\)`, { tr: "1 serbest parametre (1B nesne)", en: "1 free parameter (1D object)" }],
              [{ tr: "Düzlem", en: "Plane" }, R`\(\mathbf n \cdot (\mathbf x - P_0) = 0 \iff ax+by+cz=d\)`, { tr: "2 serbest boyut; normal \(\mathbf n = (a,b,c)\)", en: "2D sheet; normal \(\mathbf n = (a,b,c)\)" }],
              [{ tr: "Paralel düzlemler", en: "Parallel planes" }, R`\(\mathbf n_1 \times \mathbf n_2 = \mathbf 0\)`, { tr: "Normaller birbirinin katıdır", en: "Normals are scalar multiples" }],
              [{ tr: "Dik düzlemler", en: "Orthogonal planes" }, R`\(\mathbf n_1 \cdot \mathbf n_2 = 0\)`, { tr: "İki düzlem \(90^\circ\) ile kesişir", en: "Planes meet at \(90^\circ\)" }],
              [{ tr: "İki düzlemin kesişimi", en: "Line of intersection" }, R`\(\mathbf d = \mathbf n_1 \times \mathbf n_2\)`, { tr: "Ortak doğru her iki normale de diktir", en: "Shared line is perpendicular to both normals" }],
            ],
          },
        },
        {
          example: {
            title: { tr: "Üç noktadan geçen düzlem denklemini bulmak", en: "Finding the plane through three points" },
            problem: {
              tr: R`\(A = (1, 0, 0)\), \(B = (0, 2, 0)\) ve \(C = (0, 0, 3)\) noktalarından geçen düzlemin denklemini bulun.`,
              en: R`Find the equation of the plane passing through \(A = (1, 0, 0)\), \(B = (0, 2, 0)\), and \(C = (0, 0, 3)\).`,
            },
            steps: [
              {
                expr: R`\overrightarrow{AB} = B - A = (-1, 2, 0), \qquad \overrightarrow{AC} = C - A = (-1, 0, 3)`,
                note: { tr: R`Düzlemin içinde yatan iki farklı kenar vektörü oluşturuyoruz.`, en: R`Build two edge vectors lying inside the plane.` },
              },
              {
                expr: R`\mathbf n = \overrightarrow{AB} \times \overrightarrow{AC} = \big(2(3)-0,\ -( -1(3)-0),\ 0 - (-2)\big) = (6, 3, 2)`,
                note: { tr: R`İkisinin vektörel çarpımı düzleme otomatik olarak \(90^\circ\) dik normali verir!`, en: R`Their cross product automatically gives a normal perpendicular to the plane!` },
              },
              {
                expr: R`6(x - 1) + 3(y - 0) + 2(z - 0) = 0 \implies 6x + 3y + 2z = 6`,
                note: { tr: R`Kontrol: \(A, B, C\)'nin üçü de \(6x + 3y + 2z = 6\) denklemini sağlıyor ✓!`, en: R`Check: all three points \(A, B, C\) satisfy \(6x + 3y + 2z = 6\) ✓!` },
              },
            ],
            answer: { tr: R`\(6x + 3y + 2z = 6\) (veya eksen kesim biçiminde \(\frac{x}{1} + \frac{y}{2} + \frac{z}{3} = 1\)).`, en: R`\(6x + 3y + 2z = 6\) (or intercept form \(\frac{x}{1} + \frac{y}{2} + \frac{z}{3} = 1\)).` },
          },
        },
      ],
    },
    {
      id: "m-sg-cross",
      title: { tr: "Vektörel Çarpım, Diklik İspatı ve Karma Çarpım Hacmi", en: "Cross Product, Orthogonality Proof & Volume" },
      blocks: [
        { eq: R`\|\mathbf u \times \mathbf v\|^2 = \|\mathbf u\|^2\|\mathbf v\|^2 - (\mathbf u\cdot\mathbf v)^2 = \|\mathbf u\|^2\|\mathbf v\|^2\sin^2\theta` },
        {
          derive: {
            title: { tr: "u × v'nin u ve v'ye dik olduğunun ispatı", en: "Proof that u × v is orthogonal to both u and v" },
            steps: [
              { tex: R`\mathbf u \times \mathbf v = (u_2 v_3 - u_3 v_2,\ u_3 v_1 - u_1 v_3,\ u_1 v_2 - u_2 v_1)`, why: { tr: "Vektörel çarpımın üç bileşenini açıkça yazalım.", en: "Write out the three components of u × v." } },
              { tex: R`\mathbf u \cdot (\mathbf u \times \mathbf v) = u_1(u_2 v_3 - u_3 v_2) + u_2(u_3 v_1 - u_1 v_3) + u_3(u_1 v_2 - u_2 v_1)`, why: { tr: "u ile nokta çarpımı hesaplayıp parantezleri açalım.", en: "Compute the dot product with u and expand." } },
              { tex: R`= \cancel{u_1 u_2 v_3} - \cancel{u_1 u_3 v_2} + \cancel{u_2 u_3 v_1} - \cancel{u_2 u_1 v_3} + \cancel{u_3 u_1 v_2} - \cancel{u_3 u_2 v_1} = 0`, why: { tr: "Altı terim ikişer ikişer birbirini tamamen yok eder! Aynı işlem v için de 0 verir.", en: "All six terms cancel in pairs! The exact same cancellation holds for v." } },
            ],
          },
        },
        {
          example: {
            title: { tr: "Karma çarpımla paralelyüz (kutu) hacmi bulmak", en: "Parallelepiped volume via the scalar triple product" },
            problem: {
              tr: R`\(\mathbf a = (2, 0, 0)\), \(\mathbf b = (1, 3, 0)\) ve \(\mathbf c = (0, 1, 4)\) vektörlerinin gerdiği paralelyüzün hacmi kaçtır?`,
              en: R`Find the volume of the parallelepiped spanned by \(\mathbf a = (2, 0, 0)\), \(\mathbf b = (1, 3, 0)\), and \(\mathbf c = (0, 1, 4)\).`,
            },
            steps: [
              {
                expr: R`\mathbf a \times \mathbf b = (0, 0, 2 \cdot 3 - 0 \cdot 1) = (0, 0, 6)`,
                note: { tr: R`Önce taban paralelkenarının alan vektörünü buluruz: taban alanı \(6\).`, en: R`First find the base area vector: base parallelogram area is \(6\).` },
              },
              {
                expr: R`V = |\mathbf c \cdot (\mathbf a \times \mathbf b)| = |(0, 1, 4) \cdot (0, 0, 6)| = |24| = 24`,
                note: { tr: R`Taban alanı (\(6\)) çarpı dik yükseklik (\(4\)) = \(24\)! Aynı değer \(3\times 3\) determinantla da çıkar.`, en: R`Base area (\(6\)) times perpendicular height (\(4\)) = \(24\), matching \(|\det[\mathbf a\ \mathbf b\ \mathbf c]|\)!` },
              },
            ],
            answer: { tr: R`Hacim \(V = 24\) birimküptür.`, en: R`Volume is \(V = 24\) cubic units.` },
          },
        },
      ],
    },
    {
      id: "m-sg-plane",
      title: { tr: "Nokta–Düzlem ve Aykırı Doğru Mesafelerinin İspatı", en: "Proof of Plane & Skew-Line Distance Formulas" },
      blocks: [
        { eq: R`d(Q, \Pi) = \frac{|\mathbf n\cdot Q - d|}{\|\mathbf n\|}, \qquad d(\ell_1, \ell_2) = \frac{|(P_2-P_1)\cdot(\mathbf d_1\times\mathbf d_2)|}{\|\mathbf d_1\times\mathbf d_2\|}` },
        {
          derive: {
            title: { tr: "Nokta–düzlem uzaklığı formülünün ispatı", en: "Derivation of point-to-plane distance" },
            steps: [
              { tex: R`P_0 \in \Pi \implies \mathbf n \cdot P_0 = d`, why: { tr: "Düzlem üzerinde herhangi bir P₀ referans noktası seçeriz.", en: "Pick any anchor point P₀ lying on the plane Π." } },
              { tex: R`d(Q, \Pi) = \left|\frac{\mathbf n \cdot (Q - P_0)}{\|\mathbf n\|}\right|`, why: { tr: "En kısa yol Q − P₀ vektörünün düzleme dik birim normal n/‖n‖ üzerindeki gölge uzunluğudur.", en: "The shortest drop is the scalar projection of Q − P₀ onto the unit normal n/‖n‖." } },
              { tex: R`d(Q, \Pi) = \frac{|\mathbf n\cdot Q - \mathbf n\cdot P_0|}{\|\mathbf n\|} = \frac{|a q_1 + b q_2 + c q_3 - d|}{\sqrt{a^2 + b^2 + c^2}}`, why: { tr: "n·P₀ = d yerine yazılınca 3B nokta–düzlem formülü tamamlanır!", en: "Substitute n·P₀ = d to finish the 3D point-to-plane distance formula!" } },
            ],
          },
        },
        {
          callout: "info",
          title: { tr: "Uzayda iki doğrunun tam sınıflandırma testi", en: "Complete test for two lines in 3D" },
          text: {
            tr: R`1) \(\mathbf d_1 \times \mathbf d_2 = \mathbf 0\) ise doğrular <b>paraleldir</b> (veya çakışıktır). 2) \(\mathbf d_1 \times \mathbf d_2 \ne \mathbf 0\) iken karma çarpım \((P_2-P_1)\cdot(\mathbf d_1\times\mathbf d_2) = 0\) ise doğrular <b>kesişir</b>; \(0\) değilse <b>aykırıdır</b>!`,
            en: R`1) If \(\mathbf d_1\times\mathbf d_2=\mathbf 0\) the lines are <b>parallel</b> (or coincident). 2) Otherwise they <b>intersect</b> iff \((P_2-P_1)\cdot(\mathbf d_1\times\mathbf d_2)=0\), and are <b>skew</b> if that triple product is nonzero!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
