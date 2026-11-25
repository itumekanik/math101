import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { gramSchmidt, leastSquaresPoly, matTranspose, matVec, simpson, vAdd, vDot, vNorm, vProject, vScale, vSub } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, txs, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "ip-intro",
    title: { tr: "İç Çarpım Uzayları, Gram–Schmidt ve En İyi Yaklaşım", en: "Inner Product Spaces, Gram–Schmidt & Best Approximation" },
    paragraphs: [
      {
        tr: R`İki ok arasındaki açıyı ve uzunluğu nokta çarpımla (\(\mathbf{u}\cdot\mathbf{v}\)) ölçüyorduk. Peki iki <b>polinomun</b> veya iki <b>fonksiyonun</b> birbirine "dik" olması ne demektir? Nokta çarpımın 3 temel kuralını soyutlayarak her vektör uzayına açı ve mesafe kazandıran araca <b>[[inner-product|iç çarpım]]</b> \(\langle u, v \rangle\) denir!`,
        en: R`We measure lengths and angles between arrows using the dot product (\(\mathbf{u}\cdot\mathbf{v}\)). But what does it mean for two <b>polynomials</b> or two <b>sound waves</b> to be "perpendicular"? Abstracting the 3 rules of the dot product gives ANY vector space a built-in ruler and protractor: an <b>[[inner-product|inner product]]</b> \(\langle u, v \rangle\)!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> fonksiyonlarda integral iç çarpımını \(\int_a^b f(x)g(x)\,dx\) görselleştirecek, [[projection|dik izdüşümün]] neden her zaman <b>en yakın noktayı</b> verdiğini kavrayacak, [[gram-schmidt|Gram–Schmidt]] ile eğik tabanları dikleştirecek ve veri noktalarına <b>En Küçük Kareler</b> (\(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\)) eğrisi uydurabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will visualize the function inner product \(\int_a^b f(x)g(x)\,dx\), see why [[projection|orthogonal projection]] ALWAYS finds the <b>closest approximation</b>, orthogonalize any basis with [[gram-schmidt|Gram–Schmidt]], and fit <b>Least Squares</b> curves via \(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\).`,
      },
    ],
    analogy: {
      title: { tr: "Hiç bilmeyenler için: Karanlıkta fenerle gölge düşürmek", en: "Zero-jargon intuition: Shining a flashlight straight down" },
      text: {
        tr: R`Havada duran bir nesnenin üzerinde tam tepeden (\(90^\circ\) dik açıyla) bir fener tuttuğunuzu hayal edin. Yere düşen <b>gölge</b>, yer düzleminde o nesneye <b>en yakın noktadır</b>! Lineer cebirin büyüsü şudur: ister 2B'de bir ok, ister karmaşık bir ses dalgası, ister gürültülü deney verileri olsun — "en iyi yaklaşımı bulmak" her zaman \(90^\circ\) dik gölge düşürmekten ibarettir!`,
        en: R`Hold an object above a flat floor and shine a flashlight straight down at \(90^\circ\). The <b>shadow on the floor</b> is the <b>closest possible flat point</b> to the object! Here is the miracle of linear algebra: whether your vector is a 2D arrow, a sound wave, or noisy lab data, finding the "best approximation" ALWAYS means casting a \(90^\circ\) perpendicular shadow!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 12 · İç Çarpım Uzayları + En İyi Yaklaşım", en: "Lecture 12 · Inner Product Spaces + Best Approximation" }],
      [{ tr: "Fonksiyon iç çarpımı", en: "Function inner product" }, { tr: R`\(\langle f, g \rangle = \int_a^b f(x)g(x)\,dx,\quad f \perp g \iff \langle f, g \rangle = 0\)`, en: R`\(\langle f, g \rangle = \int_a^b f(x)g(x)\,dx,\quad f \perp g \iff \langle f, g \rangle = 0\)` }],
      [{ tr: "En iyi yaklaşım", en: "Best approximation" }, { tr: R`\(\hat{\mathbf{y}} = \sum \langle \mathbf{y}, \mathbf{q}_i \rangle \mathbf{q}_i,\quad (\mathbf{y} - \hat{\mathbf{y}}) \perp W\)`, en: R`\(\hat{\mathbf{y}} = \sum \langle \mathbf{y}, \mathbf{q}_i \rangle \mathbf{q}_i,\quad (\mathbf{y} - \hat{\mathbf{y}}) \perp W\)` }],
      [{ tr: "Normal denklemler", en: "Normal equations" }, { tr: R`\(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\) (En Küçük Kareler)`, en: R`\(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\) (Least Squares)` }],
    ],
    tip: {
      title: { tr: "Sözlü sınavda iki altın kural", en: "Two golden rules for the oral exam" },
      text: {
        tr: R`1) Birim uzunlukta olmayan \(\mathbf{u}\) üzerine izdüşüm alırken paydadaki <b>\(\|\mathbf{u}\|^2 = \langle \mathbf{u}, \mathbf{u} \rangle\)</b> bölümünü asla unutmayın!<br>2) En Küçük Kareler neden \(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\) verir? Tek satırlık cevap: hata vektörü \(\mathbf{y} - A\hat{\mathbf{c}}\), \(A\)'nın tüm sütunlarına dik olmalıdır: \(A^T(\mathbf{y} - A\hat{\mathbf{c}}) = \mathbf{0}\)!`,
        en: R`1) When projecting onto a non-unit vector \(\mathbf{u}\), NEVER forget to divide by <b>\(\|\mathbf{u}\|^2 = \langle \mathbf{u}, \mathbf{u} \rangle\)</b>!<br>2) Why does Least Squares give \(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\)? One-line answer: the residual \(\mathbf{y} - A\hat{\mathbf{c}}\) must be perpendicular to every column of \(A\): \(A^T(\mathbf{y} - A\hat{\mathbf{c}}) = \mathbf{0}\)!`,
      },
    },
  },
  sections: [
    {
      id: "ip-fn-orth",
      mathId: "m-ip-axioms",
      title: { tr: "Genel İç Çarpım: Nokta Çarpımdan Dik Fonksiyonlara", en: "Generalized Inner Products: Dot Product & Orthogonal Functions" },
      body: [
        {
          tr: R`<b>Sembolleri sesli okuyalım:</b> \(\langle u, v \rangle\) sembolü "\(u\) ile \(v\)'nin iç çarpımı", \(\|u\| = \sqrt{\langle u, u \rangle}\) sembolü "\(u\)'nun uzunluğu (normu)", \(u \perp v\) ise "\(u\) ve \(v\) birbirine <b>diktir (ortogonaldir)</b>" diye okunur. İki fonksiyonun \([a, b]\) aralığındaki iç çarpımı, noktadan noktaya çarpımlarının toplamı olan <b>belirli integraldir</b>:`,
          en: R`<b>How to read the symbols aloud:</b> \(\langle u, v \rangle\) reads "the inner product of \(u\) and \(v\)", \(\|u\| = \sqrt{\langle u, u \rangle}\) reads "the norm (length) of \(u\)", and \(u \perp v\) reads "\(u\) is <b>orthogonal (perpendicular)</b> to \(v\)". For two functions on \([a, b]\), the inner product generalizes the dot product into a <b>definite integral</b>:`,
        },
        { eq: R`\langle f, g \rangle = \int_a^b f(x)g(x)\,dx, \qquad \|f\| = \sqrt{\int_a^b [f(x)]^2\,dx}, \qquad f \perp g \iff \langle f, g \rangle = 0` },
        {
          analogy: {
            title: { tr: "Sonsuz bileşenli vektör çarpımı: Artı ve eksi alanların dengesi", en: "An infinite-entry dot product: Balancing positive & negative areas" },
            text: {
              tr: R`Bir \(f(x)\) fonksiyonunu \([a, b]\) aralığındaki her \(x\) noktası için bir sayı saklayan "sonsuz uzunlukta vektör" gibi düşünün. İntegral \(\int_a^b f(x)g(x)\,dx\), bu sonsuz sayı çiftlerini çarpıp toplar! Eğer \(f(x)g(x)\) eğrisinin \(x\)-ekseninin <b>üstündeki pozitif alanları</b> (yeşil) ile <b>altındaki negatif alanları</b> (turuncu) birbirini tam götürüyorsa toplam \(0\) olur — yani bu iki fonksiyon birbirine <b>\(90^\circ\) diktir</b>!`,
              en: R`Picture a function \(f(x)\) on \([a, b]\) as a vector with infinitely many entries — one height at every \(x\). The integral \(\int_a^b f(x)g(x)\,dx\) multiplies matching heights and adds them all up! Whenever the <b>positive area above the axis</b> (green) equals the <b>negative area below</b> (orange), they cancel to \(0\) — the two functions are <b>\(90^\circ\) orthogonal</b>!`,
            },
          },
        },
        {
          example: {
            title: { tr: "[−1, 1] aralığında f(x) = 1 ve g(x) = x neden diktir?", en: "Why are f(x) = 1 and g(x) = x orthogonal on [−1, 1]?" },
            problem: {
              tr: R`\([-1, 1]\) aralığında \(\langle f, g \rangle = \int_{-1}^1 f(x)g(x)\,dx\) iç çarpımına göre \(\langle 1, x \rangle\), \(\|1\|\) ve \(\|x\|\) değerlerini hesaplayın.`,
              en: R`Under \(\langle f, g \rangle = \int_{-1}^1 f(x)g(x)\,dx\) on \([-1, 1]\), compute \(\langle 1, x \rangle\), \(\|1\|\), and \(\|x\|\).`,
            },
            steps: [
              {
                expr: R`\langle 1, x \rangle = \int_{-1}^{1} 1 \cdot x\,dx = \left[\frac{x^2}{2}\right]_{-1}^{1} = \frac{1}{2} - \frac{1}{2} = 0`,
                note: { tr: R`İç çarpım tam \(0\) çıktı → \(1 \perp x\)! (Soldaki eksi üçgen sağdaki artı üçgeni götürdü.)`, en: R`The inner product is exactly \(0\) → \(1 \perp x\)! (The negative triangle on the left cancels the positive triangle on the right.)` },
              },
              {
                expr: R`\|1\|^2 = \int_{-1}^{1} 1^2\,dx = 2 \implies \|1\| = \sqrt{2}`,
                note: { tr: R`Sabit fonksiyon \(1\)'in \([-1, 1]\)'deki uzunluğu (normu) \(1\) değil \(\sqrt{2}\)'dir!`, en: R`Notice the length (norm) of the constant function \(1\) on \([-1, 1]\) is \(\sqrt{2}\), not \(1\)!` },
              },
              {
                expr: R`\|x\|^2 = \int_{-1}^{1} x^2\,dx = \left[\frac{x^3}{3}\right]_{-1}^{1} = \frac{2}{3} \implies \|x\| = \sqrt{\frac{2}{3}}`,
                note: { tr: R`Artık istersek \(1/\sqrt{2}\) ve \(\sqrt{3/2}\,x\) şeklinde birim uzunluğa (ortonormal hâle) bile getirebiliriz!`, en: R`If needed, dividing by their norms turns them into orthonormal functions \(1/\sqrt{2}\) and \(\sqrt{3/2}\,x\)!` },
              },
            ],
            answer: { tr: R`\(\langle 1, x \rangle = 0\) (ortogonal!), \(\|1\| = \sqrt{2}\) ve \(\|x\| = \sqrt{2/3}\).`, en: R`\(\langle 1, x \rangle = 0\) (orthogonal!), \(\|1\| = \sqrt{2}\), and \(\|x\| = \sqrt{2/3}\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Aralık değişirse diklik de değişir!", en: "Change the interval and orthogonality can vanish!" },
            text: {
              tr: R`\(f(x) = 1\) ve \(g(x) = x\) fonksiyonları simetrik \([-1, 1]\) aralığında diktir (\(\int_{-1}^1 x\,dx = 0\)). Ama aralığı \([0, 1]\) yaparsanız \(\int_0^1 x\,dx = \frac{1}{2} \ne 0\) olur — artık <b>dik değildirler</b>! İç çarpım sorusunda aralığa \([a, b]\) daima dikkat edin.`,
              en: R`\(f(x) = 1\) and \(g(x) = x\) are orthogonal on the symmetric interval \([-1, 1]\), YET on \([0, 1]\) we get \(\int_0^1 x\,dx = \frac{1}{2} \ne 0\) — <b>NOT orthogonal</b>! Always pay attention to the interval \([a, b]\)!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"1 ve x [−1, 1]"</b> seçeneğine bakın: sol taraftaki turuncu (negatif) üçgen ile sağ taraftaki yeşil (pozitif) üçgenin alanı birebir eşit → net integral \(0\)!`, en: R`Inspect <b>"1 & x [−1, 1]"</b>: the orange negative triangle on the left matches the green positive triangle on the right → net integral \(0\)!` },
            { tr: R`<b>"1 ve x² [−1, 1]"</b> seçeneğine tıklayın: \(x^2\) hep pozitif olduğundan tüm alan yeşil kalır → dik DEĞİL (\(\langle 1, x^2 \rangle = \frac{2}{3}\))!`, en: R`Click <b>"1 & x² [−1, 1]"</b>: since \(x^2 \ge 0\), the entire region stays green → NOT orthogonal (\(\langle 1, x^2 \rangle = \frac{2}{3}\))!` },
            { tr: R`<b>"sin(mx) · sin(nx)"</b> moduna geçin: \(m \ne n\) iken yeşil ve turuncu dalgalar birbirini tamamen sıfırlar; \(m = n\) yapınca eğri sıfırın altına hiç inmez ve alan \(\pi \approx 3{,}142\) olur!`, en: R`Switch to <b>"sin(mx) · sin(nx)"</b>: whenever \(m \ne n\) the green and orange lobes cancel perfectly to 0; set \(m = n\) and the curve stays \(\ge 0\) with area \(\pi \approx 3.142\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.fnIp ??= { mode: "1x", m: 1, n: 2 });
        const ctlMode = h("div", { class: "t-controls" });
        const ctlFreq = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctlMode, ctlFreq, host, calc, msg);
        const plot = createCanvas2D(host, { height: 255 });

        const specs = {
          "1x": {
            label: { tr: "1 ve x [−1,1]", en: "1 & x [−1,1]" },
            a: -1, b: 1, yRange: [-1.4, 1.4],
            f: () => 1, g: (x) => x,
            texF: "1", texG: "x", limA: "-1", limB: "1",
          },
          "1x2": {
            label: { tr: "1 ve x² [−1,1]", en: "1 & x² [−1,1]" },
            a: -1, b: 1, yRange: [-1.4, 1.4],
            f: () => 1, g: (x) => x * x,
            texF: "1", texG: "x^2", limA: "-1", limB: "1",
          },
          sc: {
            label: { tr: "sin(x) & cos(x)", en: "sin(x) & cos(x)" },
            a: -Math.PI, b: Math.PI, yRange: [-1.3, 1.3],
            f: (x) => Math.sin(x), g: (x) => Math.cos(x),
            texF: "\\sin x", texG: "\\cos x", limA: "-\\pi", limB: "\\pi",
          },
          sinmn: {
            label: { tr: "sin(mx) & sin(nx)", en: "sin(mx) & sin(nx)" },
            a: -Math.PI, b: Math.PI, yRange: [-1.3, 1.3],
            f: (x) => Math.sin(s.m * x), g: (x) => Math.sin(s.n * x),
            texF: () => `\\sin(${s.m}x)`, texG: () => `\\sin(${s.n}x)`, limA: "-\\pi", limB: "\\pi",
          },
        };

        const draw = () => {
          ctlFreq.style.display = s.mode === "sinmn" ? "" : "none";
          const sp = specs[s.mode];
          const prod = (x) => sp.f(x) * sp.g(x);
          const ip = simpson(prod, sp.a, sp.b, 200);
          const nfVal = Math.sqrt(Math.max(0, simpson((x) => sp.f(x) ** 2, sp.a, sp.b, 200)));
          const ngVal = Math.sqrt(Math.max(0, simpson((x) => sp.g(x) ** 2, sp.a, sp.b, 200)));
          const orth = Math.abs(ip) < 1e-4;
          const pad = (sp.b - sp.a) * 0.08;

          plot.draw({
            x: [sp.a - pad, sp.b + pad],
            y: sp.yRange,
            xLabel: "x",
            yLabel: "f·g",
            areas: [
              { f: (x) => Math.max(0, prod(x)), from: sp.a, to: sp.b, fill: "rgba(27, 175, 122, 0.28)" },
              { f: (x) => Math.min(0, prod(x)), from: sp.a, to: sp.b, fill: "rgba(235, 104, 52, 0.28)" },
            ],
            curves: [
              { f: sp.f, color: COLORS.muted, width: 1.3, dash: [4, 4], xRange: [sp.a, sp.b] },
              { f: sp.g, color: COLORS.c4, width: 1.3, dash: [4, 4], xRange: [sp.a, sp.b] },
              { f: prod, color: COLORS.c1, width: 2.7, xRange: [sp.a, sp.b] },
            ],
          });

          const tf = typeof sp.texF === "function" ? sp.texF() : sp.texF;
          const tg = typeof sp.texG === "function" ? sp.texG() : sp.texG;
          calc.textContent = `\\(\\langle ${tf},\\ ${tg} \\rangle = \\int_{${sp.limA}}^{${sp.limB}} (${tf})(${tg})\\,dx = ${tx(ip, 3)},\\quad \\|f\\| = ${tx(nfVal, 2)},\\quad \\|g\\| = ${tx(ngVal, 2)}\\)`;
          if (orth) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: "ORTOGONAL (Dik!): Yeşil (+) alan ile turuncu (−) alan birbirini tam sıfırladı → ⟨f, g⟩ = 0!",
              en: "ORTHOGONAL (Perpendicular!): Green (+) area and orange (−) area cancel to 0 → ⟨f, g⟩ = 0!",
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `Dik değil: Pozitif alan ağır bastı (net integral = ${ns(ip, 3)} ≠ 0).`,
              en: `Not orthogonal: Positive area dominates (net integral = ${ns(ip, 3)} ≠ 0).`,
            });
          }
        };

        ctlMode.append(segmented(Object.entries(specs).map(([k, v]) => [k, v.label]), s.mode, (v) => { s.mode = v; draw(); }));
        ctlFreq.append(
          slider("m", { min: 1, max: 4, step: 1, value: s.m, fmt: (v) => String(v), onInput: (v) => { s.m = v; draw(); } }),
          slider("n", { min: 1, max: 4, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "ip-proj",
      mathId: "m-ip-best",
      title: { tr: "Dik İzdüşüm: Bir Alt Uzaydaki En Yakın Nokta", en: "Orthogonal Projection: The Closest Point in a Subspace" },
      body: [
        {
          tr: R`Diyelim ki elimizde bir doğru (veya düzlem) alt uzayı \(W\) ve dışında duran bir hedef vektör \(\mathbf{y}\) var. \(W\)'nin içinde \(\mathbf{y}\)'ye <b>en yakın</b> olan \(\hat{\mathbf{y}}\) noktasını nasıl buluruz? \(\mathbf{y}\)'den \(W\)'ye \(90^\circ\) dik indiririz! Bu iniş noktasına <b>[[projection|dik izdüşüm]]</b> (\(\hat{\mathbf{y}}\)), aradaki dik farka ise <b>artık / hata vektörü</b> (\(\mathbf{r} = \mathbf{y} - \hat{\mathbf{y}}\)) denir:`,
          en: R`Suppose we have a line (or plane) subspace \(W\) and a target vector \(\mathbf{y}\) outside it. How do we find the single point \(\hat{\mathbf{y}} \in W\) that is <b>closest</b> to \(\mathbf{y}\)? Drop a strict \(90^\circ\) perpendicular from \(\mathbf{y}\) onto \(W\)! That landing spot is the <b>[[projection|orthogonal projection]]</b> \(\hat{\mathbf{y}}\), and the perpendicular gap \(\mathbf{r} = \mathbf{y} - \hat{\mathbf{y}}\) is the <b>residual error</b>:`,
        },
        { eq: R`\hat{\mathbf{y}} = \operatorname{proj}_{\mathbf{u}}(\mathbf{y}) = \frac{\langle \mathbf{y}, \mathbf{u} \rangle}{\langle \mathbf{u}, \mathbf{u} \rangle}\,\mathbf{u}, \qquad \mathbf{r} = \mathbf{y} - \hat{\mathbf{y}} \perp \mathbf{u}` },
        {
          analogy: {
            title: { tr: "Tarladan otoyola en kısa koşu (Pisagor kanıtı)", en: "Shortest sprint to a straight highway (Pythagorean proof)" },
            text: {
              tr: R`Tarlanın ortasından (\(\mathbf{y}\)) düz bir otoyola (\(W\)) en hızlı şekilde ulaşmak istiyorsunuz. Çapraz herhangi başka bir \(\mathbf{w}\) noktasına koşarsanız, \(\mathbf{y}, \hat{\mathbf{y}}, \mathbf{w}\) noktaları bir <b>dik üçgen</b> oluşturur ve çapraz yol hipotenüstür — dik mesafeden <b>daima daha uzundur</b>: \(\|\mathbf{y}-\mathbf{w}\|^2 = \|\mathbf{y}-\hat{\mathbf{y}}\|^2 + \|\hat{\mathbf{y}}-\mathbf{w}\|^2\)!`,
              en: R`Standing in a field (\(\mathbf{y}\)), you want to reach a straight highway (\(W\)) in the shortest distance. Running diagonally to any other point \(\mathbf{w} \in W\) forms a <b>right triangle</b> \((\mathbf{y}, \hat{\mathbf{y}}, \mathbf{w})\) whose diagonal hypotenuse is ALWAYS strictly longer than the perpendicular leg: \(\|\mathbf{y}-\mathbf{w}\|^2 = \|\mathbf{y}-\hat{\mathbf{y}}\|^2 + \|\hat{\mathbf{y}}-\mathbf{w}\|^2\)!`,
            },
          },
        },
        {
          example: {
            title: { tr: "y = (3, 4) vektörünü u = (2, 1) doğrusuna dik izdüşürme", en: "Projecting y = (3, 4) orthogonally onto u = (2, 1)" },
            problem: {
              tr: R`\(\mathbf{y} = (3, 4)\) noktasına \(W = \operatorname{span}\{(2, 1)\}\) doğrusundaki en yakın nokta \(\hat{\mathbf{y}}\)'yi ve en kısa mesafeyi bulun.`,
              en: R`Find the closest point \(\hat{\mathbf{y}}\) on the line \(W = \operatorname{span}\{(2, 1)\}\) to \(\mathbf{y} = (3, 4)\), and the shortest distance.`,
            },
            steps: [
              {
                expr: R`\langle \mathbf{y}, \mathbf{u} \rangle = 3(2) + 4(1) = 10, \qquad \langle \mathbf{u}, \mathbf{u} \rangle = \|\mathbf{u}\|^2 = 2^2 + 1^2 = 5`,
                note: { tr: R`Pay için \(\mathbf{y}\cdot\mathbf{u}\), payda için \(\|\mathbf{u}\|^2\) hesaplanır.`, en: R`Compute the numerator \(\mathbf{y}\cdot\mathbf{u}\) and denominator \(\|\mathbf{u}\|^2\).` },
              },
              {
                expr: R`\hat{\mathbf{y}} = \frac{10}{5}\,(2, 1) = 2(2, 1) = (4, 2)`,
                note: { tr: R`İzdüşüm noktası (gölge) \(\hat{\mathbf{y}} = (4, 2)\)!`, en: R`The shadow (closest point) is \(\hat{\mathbf{y}} = (4, 2)\)!` },
              },
              {
                expr: R`\mathbf{r} = \mathbf{y} - \hat{\mathbf{y}} = (3 - 4,\ 4 - 2) = (-1, 2), \qquad \mathbf{r}\cdot\mathbf{u} = (-1)(2) + (2)(1) = 0\;\checkmark`,
                note: { tr: R`Artık vektör \(\mathbf{r}\) gerçekten \(\mathbf{u}\)'ya dik! En kısa mesafe \(\|\mathbf{r}\| = \sqrt{(-1)^2 + 2^2} = \sqrt{5}\).`, en: R`Residual \(\mathbf{r}\) is strictly perpendicular to \(\mathbf{u}\)! Minimum distance \(= \|\mathbf{r}\| = \sqrt{1 + 4} = \sqrt{5}\).` },
              },
            ],
            answer: { tr: R`En yakın nokta \(\hat{\mathbf{y}} = (4, 2)\), en kısa uzaklık \(\sqrt{5} \approx 2{,}24\).`, en: R`Closest point \(\hat{\mathbf{y}} = (4, 2)\), shortest distance \(\sqrt{5} \approx 2.24\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "En yaygın formül kazası: ‖u‖² paydasını unutmak!", en: "Most common formula slip: Forgetting the ‖u‖² denominator!" },
            text: {
              tr: R`Kısa formül \(\langle \mathbf{y}, \mathbf{q} \rangle \mathbf{q}\) <b>YALNIZCA \(\mathbf{q}\) birim vektörse (\(\|\mathbf{q}\| = 1\))</b> geçerlidir! Eğer \(\mathbf{u} = (2, 1)\) gibi uzunluğu 1 olmayan bir vektörle çalışıyorsanız ve \(\|\mathbf{u}\|^2 = 5\)'e bölmeyi unutursanız gölgeniz 5 kat yanlış çıkar!`,
              en: R`The shortcut \(\langle \mathbf{y}, \mathbf{q} \rangle \mathbf{q}\) ONLY holds when \(\mathbf{q}\) is a <b>unit vector (\(\|\mathbf{q}\| = 1\))</b>! For \(\mathbf{u} = (2, 1)\) with \(\|\mathbf{u}\|^2 = 5\), forgetting the denominator blows up your shadow by a factor of 5!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Turuncu hedef \(\mathbf{y}\)'yi sürükleyin: kırmızı kesikli hata parçası \(\mathbf{r}\)'nin mavi doğruya her zaman \(90^\circ\) dik açıyla indiğine dikkat edin!`, en: R`Drag orange target \(\mathbf{y}\): notice the dashed red residual \(\mathbf{r}\) ALWAYS lands on the blue line at a crisp \(90^\circ\) corner!` },
            { tr: R`<b>Rakip nokta \(t\)</b> sürgüsünü oynatın: mor nokta \(\mathbf{w} = t\mathbf{u}\) doğrudan başka bir yere gittikçe hipotenüs \(\|\mathbf{y} - \mathbf{w}\|\) daima dik uzaklık \(\|\mathbf{y} - \hat{\mathbf{y}}\|\)'den büyüktür!`, en: R`Slide <b>rival point \(t\)</b>: as purple \(\mathbf{w} = t\mathbf{u}\) moves anywhere else on \(W\), hypotenuse \(\|\mathbf{y} - \mathbf{w}\|\) is ALWAYS longer than perpendicular \(\|\mathbf{y} - \hat{\mathbf{y}}\|\)!` },
            { tr: R`\(\mathbf{y}\)'yi doğrudan mavi çizginin üzerine sürükleyin: artık \(\mathbf{r} = \mathbf{0}\) olur ve gölge kendisiyle çakışır (\(\hat{\mathbf{y}} = \mathbf{y}\)).`, en: R`Drag \(\mathbf{y}\) straight onto the blue line: the residual vanishes (\(\mathbf{r} = \mathbf{0}\)) and \(\hat{\mathbf{y}} = \mathbf{y}\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.proj ??= { line: "slope", y: [2, 3.2], t: 0.4 });
        const lines = {
          slope: { label: { tr: "u = (2, 1)", en: "u = (2, 1)" }, u: [2, 1] },
          horiz: { label: { tr: "Yatay (1, 0)", en: "Horizontal (1, 0)" }, u: [1, 0] },
          diag: { label: { tr: "45° (1, 1)", en: "45° (1, 1)" }, u: [1, 1] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 280,
          interactive: true,
          hint: L({ tr: "Turuncu hedef nokta y'yi sürükleyin", en: "Drag the orange target point y" }),
        });

        const draw = () => {
          const u = lines[s.line].u;
          const yhat = vProject(s.y, u);
          const r = vSub(s.y, yhat);
          const w = vScale(u, s.t);
          const distBest = vNorm(r);
          const distRival = vNorm(vSub(s.y, w));

          // Build a tiny crisp right-angle square at yhat if r is non-trivial
          const sqSegs = [];
          const uLen = vNorm(u);
          if (distBest > 0.25 && uLen > 1e-6) {
            const eu = vScale(u, 0.28 / uLen);
            const er = vScale(r, 0.28 / distBest);
            const c1 = vAdd(yhat, eu);
            const c2 = vAdd(c1, er);
            const c3 = vAdd(yhat, er);
            sqSegs.push(
              { from: c1, to: c2, color: COLORS.bad, width: 1.5 },
              { from: c2, to: c3, color: COLORS.bad, width: 1.5 },
            );
          }

          plot.draw({
            x: [-3.5, 5],
            y: [-3, 4.8],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            lines: [{ a: -u[1], b: u[0], c: 0, color: COLORS.c1, width: 2.6, label: "W" }],
            polygons: [{ pts: [s.y, yhat, w], fill: "rgba(141, 82, 201, 0.12)" }],
            segments: [
              { from: s.y, to: yhat, color: COLORS.bad, width: 2.3, dash: [5, 4] },
              { from: s.y, to: w, color: COLORS.c4, width: 1.9, dash: [3, 3] },
              ...sqSegs,
            ],
            vectors: [
              { to: yhat, color: COLORS.good, width: 3, label: "ŷ" },
              { to: s.y, color: COLORS.c2, width: 2.6, label: "y" },
            ],
            points: [
              { x: yhat[0], y: yhat[1], color: COLORS.good, r: 5.5, ring: true },
              { x: w[0], y: w[1], color: COLORS.c4, r: 5.5, label: "w" },
            ],
            handles: [
              { id: "y", x: s.y[0], y: s.y[1], color: COLORS.c2, onDrag: (x, y) => { s.y = [x, y]; draw(); } },
            ],
          });

          calc.textContent = `\\(\\hat{\\mathbf{y}} = (${tx(yhat[0], 2)},\\ ${tx(yhat[1], 2)}),\\quad \\|\\mathbf{y}-\\hat{\\mathbf{y}}\\| = ${tx(distBest, 2)} \\le ${tx(distRival, 2)} = \\|\\mathbf{y}-\\mathbf{w}\\|,\\quad \\mathbf{r}\\cdot\\mathbf{u} = ${tx(vDot(r, u), 3)}\\)`;
          msg.className = "pc-msg good";
          msg.textContent = L({
            tr: `Dik uzaklık ${ns(distBest, 2)} ≤ rakip uzaklık ${ns(distRival, 2)}! (Hata r, doğruya tam 90° dik.)`,
            en: `Perpendicular distance ${ns(distBest, 2)} ≤ rival distance ${ns(distRival, 2)}! (Error r meets W at 90°.)`,
          });
        };

        ctl.append(
          segmented(Object.entries(lines).map(([k, v]) => [k, v.label]), s.line, (v) => { s.line = v; draw(); }),
          slider(L({ tr: "Rakip w (t)", en: "Rival w (t)" }), { min: -1.5, max: 2.5, step: 0.1, value: s.t, onInput: (v) => { s.t = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "ip-gs",
      mathId: "m-ip-gs",
      title: { tr: "Adım Adım Gram–Schmidt: Eğik Tabanı Dikleştirme", en: "Gram–Schmidt Step-by-Step: Turning Any Basis Orthonormal" },
      body: [
        {
          tr: R`Bir taban <b>[[orthogonality|ortonormal]]</b> ise (yani vektörler hem birbirine dik \(\mathbf{q}_i \cdot \mathbf{q}_j = 0\) hem de birim uzunlukta \(\|\mathbf{q}_i\| = 1\) ise), koordinat bulmak için matris tersine hiç gerek kalmaz — tek bir iç çarpım yeterlidir: \(c_i = \langle \mathbf{x}, \mathbf{q}_i \rangle\)! Peki elimizde eğik bir \(\{\mathbf{v}_1, \mathbf{v}_2\}\) tabanı varsa onu nasıl ortonormal yaparız? İşte <b>[[gram-schmidt|Gram–Schmidt]]</b> süreci:`,
          en: R`In an <b>[[orthogonality|orthonormal]]</b> basis (mutually perpendicular unit vectors: \(\mathbf{q}_i \cdot \mathbf{q}_j = 0\) and \(\|\mathbf{q}_i\| = 1\)), coordinates need ZERO matrix inversion — just a single inner product \(c_i = \langle \mathbf{x}, \mathbf{q}_i \rangle\)! How do we upgrade ANY slanted basis \(\{\mathbf{v}_1, \mathbf{v}_2\}\) into an orthonormal one? With the <b>[[gram-schmidt|Gram–Schmidt]]</b> recipe:`,
        },
        { eq: R`\mathbf{q}_1 = \frac{\mathbf{v}_1}{\|\mathbf{v}_1\|}, \qquad \mathbf{u}_2 = \mathbf{v}_2 - \langle \mathbf{v}_2, \mathbf{q}_1 \rangle\,\mathbf{q}_1, \qquad \mathbf{q}_2 = \frac{\mathbf{u}_2}{\|\mathbf{u}_2\|}` },
        {
          analogy: {
            title: { tr: "Eğik çadır direğini düzeltmek", en: "Straightening a leaning tent pole" },
            text: {
              tr: R`İlk direği (\(\mathbf{v}_1\)) zemin referansı seçip boyunu 1 metreye kesiyoruz → <b>\(\mathbf{q}_1\)</b>. İkinci direk (\(\mathbf{v}_2\)) yana yatık duruyor! Onun zemin boyunca düşen yatay gölgesini (\(\langle \mathbf{v}_2, \mathbf{q}_1 \rangle \mathbf{q}_1\)) kesip attığımızda elimizde saf \(90^\circ\) dik duran parça <b>\(\mathbf{u}_2\)</b> kalır. Onun da boyunu 1 metreye getirince <b>\(\mathbf{q}_2\)</b> hazırdır!`,
              en: R`Keep the first pole (\(\mathbf{v}_1\)) as your reference floor direction and trim it to length 1 → <b>\(\mathbf{q}_1\)</b>. The second pole (\(\mathbf{v}_2\)) leans sideways! Subtract its floor shadow (\(\langle \mathbf{v}_2, \mathbf{q}_1 \rangle \mathbf{q}_1\)) and what remains (\(\mathbf{u}_2\)) stands strictly upright at \(90^\circ\)! Trim it to length 1 → <b>\(\mathbf{q}_2\)</b>!`,
            },
          },
        },
        {
          example: {
            title: { tr: "v₁ = (3, 4) ve v₂ = (1, 0) üzerine adım adım Gram–Schmidt", en: "Step-by-step Gram–Schmidt on v₁ = (3, 4) and v₂ = (1, 0)" },
            problem: {
              tr: R`\(\mathbf{v}_1 = (3, 4)\) ve \(\mathbf{v}_2 = (1, 0)\) tabanına Gram–Schmidt uygulayarak ortonormal \(\{\mathbf{q}_1, \mathbf{q}_2\}\) tabanını kurun.`,
              en: R`Apply Gram–Schmidt to \(\mathbf{v}_1 = (3, 4)\) and \(\mathbf{v}_2 = (1, 0)\) to produce an orthonormal basis \(\{\mathbf{q}_1, \mathbf{q}_2\}\).`,
            },
            steps: [
              {
                expr: R`\|\mathbf{v}_1\| = \sqrt{3^2 + 4^2} = 5 \implies \mathbf{q}_1 = \frac{1}{5}(3, 4) = \left(\frac{3}{5},\ \frac{4}{5}\right)`,
                note: { tr: R`<b>Adım 1:</b> İlk vektörü kendi uzunluğuna bölüp birim vektör \(\mathbf{q}_1\) yapıyoruz.`, en: R`<b>Step 1:</b> Divide \(\mathbf{v}_1\) by its length to create unit vector \(\mathbf{q}_1\).` },
              },
              {
                expr: R`\langle \mathbf{v}_2, \mathbf{q}_1 \rangle = 1\cdot\frac{3}{5} + 0\cdot\frac{4}{5} = \frac{3}{5}`,
                note: { tr: R`<b>Adım 2a:</b> \(\mathbf{v}_2\)'nin \(\mathbf{q}_1\) üzerindeki gölge katsayısını hesaplıyoruz.`, en: R`<b>Step 2a:</b> Measure the shadow length of \(\mathbf{v}_2\) along \(\mathbf{q}_1\).` },
              },
              {
                expr: R`\mathbf{u}_2 = (1, 0) - \frac{3}{5}\left(\frac{3}{5}, \frac{4}{5}\right) = \left(\frac{16}{25},\ -\frac{12}{25}\right)`,
                note: { tr: R`<b>Adım 2b:</b> Gölgeyi çıkarıyoruz! Kontrol: \(\mathbf{u}_2 \cdot \mathbf{q}_1 = \frac{48}{125} - \frac{48}{125} = 0\) ✓.`, en: R`<b>Step 2b:</b> Subtract the shadow! Quick check: \(\mathbf{u}_2 \cdot \mathbf{q}_1 = \frac{48}{125} - \frac{48}{125} = 0\) ✓.` },
              },
              {
                expr: R`\|\mathbf{u}_2\| = \frac{\sqrt{16^2 + (-12)^2}}{25} = \frac{20}{25} = \frac{4}{5} \implies \mathbf{q}_2 = \frac{\mathbf{u}_2}{4/5} = \left(\frac{4}{5},\ -\frac{3}{5}\right)`,
                note: { tr: R`<b>Adım 3:</b> \(\mathbf{u}_2\)'yi normalize ederek birim vektör \(\mathbf{q}_2\)'yi elde ediyoruz!`, en: R`<b>Step 3:</b> Normalize \(\mathbf{u}_2\) to finish with unit vector \(\mathbf{q}_2\)!` },
              },
            ],
            answer: { tr: R`\(\mathbf{q}_1 = \left(\frac{3}{5}, \frac{4}{5}\right)\) ve \(\mathbf{q}_2 = \left(\frac{4}{5}, -\frac{3}{5}\right)\) — hem dik (\(\mathbf{q}_1\cdot\mathbf{q}_2 = 0\)) hem birim uzunlukta!`, en: R`\(\mathbf{q}_1 = \left(\frac{3}{5}, \frac{4}{5}\right)\) and \(\mathbf{q}_2 = \left(\frac{4}{5}, -\frac{3}{5}\right)\) — perpendicular and unit length!` },
          },
        },
        {
          pitfall: {
            title: { tr: "Dikkat: Normalize etmeden sadece ⟨v₂, v₁⟩ v₁ çıkarmak!", en: "Watch out: Subtracting ⟨v₂, v₁⟩ v₁ without normalizing!" },
            text: {
              tr: R`Eğer önce \(\mathbf{q}_1 = \mathbf{v}_1/\|\mathbf{v}_1\|\) yapmadıysanız, \(\mathbf{v}_2 - \langle\mathbf{v}_2, \mathbf{v}_1\rangle \mathbf{v}_1\) formülü <b>YANLIŞTIR</b> (dik olmaz!). Normalize etmeden çalışmak isterseniz paydaya mutlaka \(\|\mathbf{v}_1\|^2\) koymalısınız: \(\mathbf{u}_2 = \mathbf{v}_2 - \frac{\langle\mathbf{v}_2, \mathbf{v}_1\rangle}{\|\mathbf{v}_1\|^2}\mathbf{v}_1\).`,
              en: R`If you haven't normalized \(\mathbf{v}_1\) into \(\mathbf{q}_1\) yet, writing \(\mathbf{v}_2 - \langle\mathbf{v}_2, \mathbf{v}_1\rangle \mathbf{v}_1\) is <b>WRONG</b> (not orthogonal!). Without normalizing first, you MUST divide by \(\|\mathbf{v}_1\|^2\): \(\mathbf{u}_2 = \mathbf{v}_2 - \frac{\langle\mathbf{v}_2, \mathbf{v}_1\rangle}{\|\mathbf{v}_1\|^2}\mathbf{v}_1\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>Adım 1 → Adım 2 → Adım 3</b> butonlarına sırayla tıklayın: önce \(\mathbf{q}_1\)'in birim çember üzerinde doğuşunu, sonra gölge çıkarılarak dik \(\mathbf{u}_2\)'nin oluşuşunu, en son \(\mathbf{q}_2\)'nin birim çembere oturuşunu izleyin!`, en: R`Click <b>Step 1 → Step 2 → Step 3</b> in order: watch \(\mathbf{q}_1\) snap onto the unit circle, then watch the shadow subtract to form perpendicular \(\mathbf{u}_2\), then watch \(\mathbf{q}_2\) normalize!` },
            { tr: R`<b>"3-4-5 Örneği"</b> butonuna tıklayıp çözümlü örnekteki \(\left(\frac{3}{5}, \frac{4}{5}\right)\) ve \(\left(\frac{4}{5}, -\frac{3}{5}\right)\) çiftini kanvasta görün.`, en: R`Click <b>"3-4-5 Example"</b> to see \(\left(\frac{3}{5}, \frac{4}{5}\right)\) and \(\left(\frac{4}{5}, -\frac{3}{5}\right)\) from the worked example live.` },
            { tr: R`Yeşil \(\mathbf{v}_2\) ucunu mavi \(\mathbf{v}_1\) doğrusuna yaklaştırın: \(\mathbf{u}_2\)'nin sıfıra küçüldüğünü görün (Gram–Schmidt bağımlılığı anında yakalar!).`, en: R`Drag green \(\mathbf{v}_2\) onto \(\mathbf{v}_1\)'s line: watch \(\mathbf{u}_2\) shrink to zero (Gram–Schmidt automatically detects linear dependence!).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.gs ??= { v1: [2.4, 0.8], v2: [1.4, 2.2], step: 3 });
        const ctlStep = h("div", { class: "t-controls" });
        const presets = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctlStep, presets, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 295,
          interactive: true,
          hint: L({ tr: "v₁ ve v₂ uçlarını sürükleyin", en: "Drag tips of v₁ and v₂" }),
        });

        const draw = () => {
          const { orthogonal, orthonormal } = gramSchmidt([s.v1, s.v2]);
          const q1 = orthonormal[0], q2 = orthonormal[1], u2 = orthogonal[1];
          const proj = vProject(s.v2, s.v1);
          const u2Norm = vNorm(u2);
          const dep = u2Norm < 0.1 || vNorm(s.v1) < 0.1;

          const vectors = [
            { to: s.v1, color: COLORS.c1, dash: [5, 3], width: 2.1, label: "v₁" },
            { to: s.v2, color: COLORS.c3, dash: [5, 3], width: 2.1, label: "v₂" },
            { to: q1, color: COLORS.c1, width: 3.2, label: "q₁" },
          ];
          const segments = [];
          if (s.step >= 2 && !dep) {
            segments.push({ from: s.v2, to: proj, color: COLORS.muted, dash: [4, 3], width: 1.8 });
            vectors.push(
              { to: proj, color: COLORS.muted, width: 2, label: "proj" },
              { to: u2, color: COLORS.c4, width: 2.3, dash: [4, 3], label: "u₂" },
            );
          }
          if (s.step >= 3 && !dep) {
            vectors.push({ to: q2, color: COLORS.c2, width: 3.2, label: "q₂" });
          }

          plot.draw({
            x: [-3.2, 4],
            y: [-2.8, 3.8],
            equalAspect: true,
            xLabel: "x₁",
            yLabel: "x₂",
            circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [4, 4] }],
            segments,
            vectors,
            handles: [
              { id: "v1", x: s.v1[0], y: s.v1[1], color: COLORS.c1, onDrag: (x, y) => { s.v1 = [x, y]; draw(); } },
              { id: "v2", x: s.v2[0], y: s.v2[1], color: COLORS.c3, onDrag: (x, y) => { s.v2 = [x, y]; draw(); } },
            ],
          });

          if (dep) {
            calc.textContent = `\\(\\|\\mathbf{u}_2\\| \\approx 0 \\implies \\text{${L({ tr: "Doğrusal bağımlı! (Taban değil)", en: "Linearly dependent! (Not a basis)" })}}\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "v₁ ve v₂ aynı doğrultuda! Gölgeyi çıkarınca u₂ = 0 kaldı — ikinci dik yön üretilemiyor.",
              en: "v₁ and v₂ are collinear! Subtracting the shadow leaves u₂ = 0 — no second perpendicular direction exists.",
            });
          } else if (s.step === 1) {
            calc.textContent = `\\(\\|\\mathbf{v}_1\\| = ${tx(vNorm(s.v1), 2)} \\implies \\mathbf{q}_1 = \\frac{\\mathbf{v}_1}{\\|\\mathbf{v}_1\\|} = (${tx(q1[0], 2)},\\ ${tx(q1[1], 2)})\\)`;
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: "Adım 1: v₁ birim çemberin üzerine ölçeklenerek q₁ (‖q₁‖ = 1) elde edildi.",
              en: "Step 1: v₁ is normalized onto the unit circle to form q₁ (‖q₁‖ = 1).",
            });
          } else if (s.step === 2) {
            const coeff = vDot(s.v2, q1);
            calc.textContent = `\\(\\mathbf{u}_2 = \\mathbf{v}_2 - (${tx(coeff, 2)})\\,\\mathbf{q}_1 = (${tx(u2[0], 2)},\\ ${tx(u2[1], 2)}),\\quad \\mathbf{u}_2\\cdot\\mathbf{q}_1 = ${tx(vDot(u2, q1), 3)}\\)`;
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: "Adım 2: v₂'nin gölgesi (proj) çıkarıldı! Mor u₂ artık q₁'e tam 90° dik.",
              en: "Step 2: Subtracted the shadow (proj) from v₂! Purple u₂ is now strictly 90° perpendicular to q₁.",
            });
          } else {
            calc.textContent = `\\(\\mathbf{q}_1 = (${tx(q1[0], 2)},\\ ${tx(q1[1], 2)}),\\quad \\mathbf{q}_2 = (${tx(q2[0], 2)},\\ ${tx(q2[1], 2)}),\\quad \\mathbf{q}_1\\cdot\\mathbf{q}_2 = ${tx(vDot(q1, q2), 3)}\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: "Adım 3 tamam: {q₁, q₂} hem birbirine tam dik (q₁·q₂ = 0) hem de birim çember üzerinde (‖q₁‖ = ‖q₂‖ = 1)!",
              en: "Step 3 complete: {q₁, q₂} are strictly perpendicular (q₁·q₂ = 0) and unit length (‖q₁‖ = ‖q₂‖ = 1)!",
            });
          }
        };

        ctlStep.append(
          segmented(
            [
              [1, { tr: "1: q₁", en: "1: q₁" }],
              [2, { tr: "2: Gölgeyi Çıkar (u₂)", en: "2: Subtract Shadow (u₂)" }],
              [3, { tr: "3: Hepsi (q₁, q₂)", en: "3: Full (q₁, q₂)" }],
            ],
            s.step,
            (v) => { s.step = Number(v); draw(); },
          ),
        );
        const mkBtn = (label, v1, v2) => {
          const bt = h("button", { type: "button", class: "btn small", text: L(label) });
          bt.addEventListener("click", () => { s.v1 = [...v1]; s.v2 = [...v2]; draw(); });
          return bt;
        };
        presets.append(
          mkBtn({ tr: "Eğik Taban", en: "Skew Basis" }, [2.4, 0.8], [1.4, 2.2]),
          mkBtn({ tr: "3-4-5 Örneği", en: "3-4-5 Example" }, [1.8, 2.4], [1.5, 0]),
          mkBtn({ tr: "Dar Açı", en: "Narrow Angle" }, [2.8, 0.6], [2.4, 1.3]),
        );
        draw();
      },
    },
    {
      id: "ip-lsq",
      mathId: "m-ip-lsq",
      title: { tr: "En İyi Yaklaşım ve En Küçük Kareler (AᵀA ĉ = Aᵀy)", en: "Best Approximation & Least Squares Fitting (AᵀA ĉ = Aᵀy)" },
      body: [
        {
          tr: R`Gerçek hayatta laboratuvardan 5 veri noktası \((x_i, y_i)\) ölçtüğünüzde, bunların <b>hepsinden birden</b> geçen tek bir doğru yoktur — yani \(A\mathbf{c} = \mathbf{y}\) sisteminin tam çözümü yoktur (\(\mathbf{y} \notin \operatorname{Col}(A)\))! Vazgeçmek yerine az önceki dik izdüşüm fikrini kullanırız: \(\mathbf{y}\)'ye \(\operatorname{Col}(A)\) içinde <b>en yakın</b> vektör \(\hat{\mathbf{y}} = A\hat{\mathbf{c}}\)'yi seçeriz! Dikey hata kareleri toplamını (\(\mathrm{SSR} = \sum (y_i - \hat{y}_i)^2\)) en aza indiren bu \(\hat{\mathbf{c}}\), <b>Normal Denklemler</b> ile bulunur:`,
          en: R`When you collect 5 noisy lab measurements \((x_i, y_i)\), NO single straight line passes through all of them — the system \(A\mathbf{c} = \mathbf{y}\) has no exact solution (\(\mathbf{y} \notin \operatorname{Col}(A)\))! Instead of giving up, we project \(\mathbf{y}\) orthogonally onto \(\operatorname{Col}(A)\) to find \(\hat{\mathbf{y}} = A\hat{\mathbf{c}}\) minimizing the sum of squared vertical errors (\(\mathrm{SSR} = \sum (y_i - \hat{y}_i)^2\)). That optimal \(\hat{\mathbf{c}}\) solves the <b>Normal Equations</b>:`,
        },
        { eq: R`\min_{\mathbf{c}}\; \|A\mathbf{c} - \mathbf{y}\|^2 \;\Longleftrightarrow\; A^T(\mathbf{y} - A\hat{\mathbf{c}}) = \mathbf{0} \;\Longleftrightarrow\; A^T A\,\hat{\mathbf{c}} = A^T \mathbf{y}` },
        {
          analogy: {
            title: { tr: "Raptiyelere dikey lastiklerle bağlı tahta cetvel", en: "A wooden ruler tethered to thumbtacks with vertical rubber bands" },
            text: {
              tr: R`Bir mantar panodaki 5 dağınık raptiyeye dikey lastikler takıp bunları düz bir tahta cetvele bağlayın ve cetveli serbest bırakın. Lastiklerin gerilme enerjisi (uzaklık karelerinin toplamı!) en düşük olduğu dengede cetvel kendiliğinden duracaktır — işte o denge konumu <b>En Küçük Kareler doğrusudur</b>!`,
              en: R`Stick 5 scattered thumbtacks into a corkboard, tie a vertical rubber band from each tack to a straight wooden ruler, and let go. The ruler settles naturally where the total rubber-band energy (sum of squared vertical stretches!) is minimized — that equilibrium IS the <b>Least Squares line</b>!`,
            },
          },
        },
        {
          example: {
            title: { tr: "3 noktaya en küçük kareler doğrusu uydurma", en: "Fitting the least-squares line to 3 non-collinear points" },
            problem: {
              tr: R`\((0, 1),\ (1, 2),\ (2, 4)\) noktalarına en iyi uyan \(\hat{y} = c_0 + c_1 x\) doğrusunu normal denklemlerle bulun.`,
              en: R`Use the normal equations to fit the best line \(\hat{y} = c_0 + c_1 x\) to \((0, 1),\ (1, 2),\ (2, 4)\).`,
            },
            steps: [
              {
                expr: R`A = \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{bmatrix}, \qquad \mathbf{y} = \begin{bmatrix} 1 \\ 2 \\ 4 \end{bmatrix}`,
                note: { tr: R`Her \((x_i, y_i)\) noktası için \(c_0 \cdot 1 + c_1 \cdot x_i \approx y_i\) denklemini matris formuna yazarız.`, en: R`Stack \(c_0 \cdot 1 + c_1 \cdot x_i \approx y_i\) for all 3 points into \(A\) and \(\mathbf{y}\).` },
              },
              {
                expr: R`A^T A = \begin{bmatrix} 3 & 3 \\ 3 & 5 \end{bmatrix}, \qquad A^T \mathbf{y} = \begin{bmatrix} 1+2+4 \\ 0+2+8 \end{bmatrix} = \begin{bmatrix} 7 \\ 10 \end{bmatrix}`,
                note: { tr: R`\(A^T A\) (her zaman simetrik!) ve \(A^T \mathbf{y}\)'yi hesaplıyoruz.`, en: R`Compute \(A^T A\) (always symmetric!) and \(A^T \mathbf{y}\).` },
              },
              {
                expr: R`\begin{cases} 3c_0 + 3c_1 = 7 \\ 3c_0 + 5c_1 = 10 \end{cases} \implies 2c_1 = 3 \implies c_1 = \frac{3}{2} = 1{,}5,\quad c_0 = \frac{5}{6}`,
                note: { tr: R`Alttaki denklemden üsttekini çıkarınca \(c_1 = 1{,}5\) ve \(c_0 = \frac{5}{6} \approx 0{,}83\) hemen bulunur!`, en: R`Subtract the top equation from the bottom to get \(c_1 = 1.5\) and \(c_0 = \frac{5}{6} \approx 0.83\)!` },
              },
            ],
            answer: { tr: R`\(\hat{y}(x) = \frac{5}{6} + \frac{3}{2}x\) (en küçük hata kareleri toplamı \(\mathrm{SSR} = \frac{1}{6} \approx 0{,}167\)).`, en: R`\(\hat{y}(x) = \frac{5}{6} + \frac{3}{2}x\) (minimum sum of squared residuals \(\mathrm{SSR} = \frac{1}{6} \approx 0.167\)).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Aşırı uydurma (Overfitting) tuzağı: Yüksek derece her zaman iyi değildir!", en: "The Overfitting trap: Higher polynomial degree is NOT always better!" },
            text: {
              tr: R`Dereceyi artırdıkça \(\mathrm{SSR}\) her zaman düşer ve 5 noktaya 4. derece polinom uydurursanız \(\mathrm{SSR} = 0,\ R^2 = 1\) olur! Ama bu, eğrinin gerçek kuralı öğrendiği anlamına gelmez — sadece gürültüyü ezberleyip noktalar arasında vahşice dalgalanır!`,
              en: R`Raising the degree always lowers \(\mathrm{SSR}\), and fitting a degree-4 curve through 5 points forces \(\mathrm{SSR} = 0,\ R^2 = 1\)! Yet that doesn't mean it learned the true law — it merely memorized noise and oscillates wildly between points!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"Parabolik Veri"</b> butonuna tıklayın: \(d = 1\) (doğru) ile turuncu hata çubuklarının dev gibi olduğunu ve \(R^2\)'nin düştüğünü görün; ardından <b>\(d = 2\) (Parabol)</b> seçip eğrinin veriyi nasıl sarıp kucakladığını izleyin!`, en: R`Click <b>"Parabolic Data"</b>: at \(d = 1\) (line) the orange residual bars are huge and \(R^2\) drops; now click <b>\(d = 2\) (Parabola)</b> and watch the curve hug every point!` },
            { tr: R`<b>"Aykırı Değer"</b> butonuna tıklayın veya tek bir yeşil noktayı çok uzağa sürükleyin: kareli ceza yüzünden tek bir aykırı noktanın doğruyu ne kadar güçlü çektiğini fark edin!`, en: R`Click <b>"Outlier"</b> or drag one green point far away: notice how squaring errors lets one outlier yank the fitted line strongly toward itself!` },
            { tr: R`<b>"3-Nokta Örneği"</b> butonuna tıklayıp çözümlü örnekteki \(\hat{y} = 0{,}83 + 1{,}5x\) ve \(\mathrm{SSR} = 0{,}167\) değerlerini doğrulayın.`, en: R`Click <b>"3-Point Example"</b> to verify \(\hat{y} = 0.83 + 1.5x\) and \(\mathrm{SSR} = 0.167\) from the worked example.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.lsq ??= {
          deg: 1,
          pts: [[-2, -1.2], [-1, -0.2], [0, 0.7], [1, 1.8], [2, 2.7]],
        });
        const ctlPre = h("div", { class: "t-controls" });
        const ctlDeg = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctlPre, ctlDeg, host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 270,
          interactive: true,
          hint: L({ tr: "Yeşil veri noktalarını sürükleyin", en: "Drag the green data points" }),
        });

        let degSeg;
        const draw = () => {
          const effDeg = Math.min(s.deg, s.pts.length - 1);
          const fit = leastSquaresPoly(s.pts, effDeg);
          const f = (x) => fit.coeffs.reduce((acc, c, p) => acc + c * x ** p, 0);
          plot.draw({
            x: [-3.5, 3.5],
            y: [-3, 5],
            xLabel: "x",
            yLabel: "y",
            curves: [{ f, color: COLORS.c1, width: 2.8 }],
            segments: s.pts.map(([x, y]) => ({ from: [x, y], to: [x, f(x)], color: COLORS.c2, dash: [4, 3], width: 1.9 })),
            handles: s.pts.map(([x, y], i) => ({
              id: `p${i}`, x, y, color: COLORS.c3,
              onDrag: (nx, ny) => { s.pts[i] = [nx, ny]; draw(); },
            })),
          });
          const terms = fit.coeffs
            .map((c, p) => (p === 0 ? tx(c, 2) : `${txs(c, 2)}\\,x${p > 1 ? `^${p}` : ""}`))
            .join(" ");
          calc.textContent = `\\(\\hat{y}(x) = ${terms},\\qquad \\mathrm{SSR} = ${tx(fit.ssr, 3)},\\quad R^2 = ${tx(fit.r2, 3)}\\)`;
          msg.className = fit.r2 > 0.9 ? "pc-msg good" : "pc-msg info";
          msg.textContent = L({
            tr: `Turuncu kesikli çizgiler dikey hatalar (rᵢ = yᵢ − ŷᵢ). Normal denklemler bunların kareleri toplamını (${ns(fit.ssr, 3)}) en aza indirir!`,
            en: `Orange dashed segments are vertical residuals (rᵢ = yᵢ − ŷᵢ). Normal equations minimize their squared sum (${ns(fit.ssr, 3)})!`,
          });
        };

        const mkBtn = (label, pts, deg) => {
          const bt = h("button", { type: "button", class: "btn small", text: L(label) });
          bt.addEventListener("click", () => {
            s.pts = pts.map((p) => [...p]);
            if (deg != null) { s.deg = deg; degSeg.set(deg); }
            draw();
          });
          return bt;
        };
        ctlPre.append(
          mkBtn({ tr: "Doğrusal Veri", en: "Linear Data" }, [[-2, -1.2], [-1, -0.2], [0, 0.7], [1, 1.8], [2, 2.7]], 1),
          mkBtn({ tr: "Parabolik Veri", en: "Parabolic Data" }, [[-2, 3.2], [-1, 0.6], [0, -0.3], [1, 0.9], [2, 3.4]], 1),
          mkBtn({ tr: "3-Nokta Örneği", en: "3-Point Example" }, [[0, 1], [1, 2], [2, 4]], 1),
          mkBtn({ tr: "Aykırı Değer", en: "Outlier" }, [[-2, -1], [-1, 0], [0, 1], [1, 2], [2, -1.5]], 1),
        );
        degSeg = segmented(
          [
            [1, { tr: "Doğru (d=1)", en: "Line (d=1)" }],
            [2, { tr: "Parabol (d=2)", en: "Parabola (d=2)" }],
            [3, { tr: "Kübik (d=3)", en: "Cubic (d=3)" }],
          ],
          s.deg,
          (v) => { s.deg = Number(v); draw(); },
        );
        ctlDeg.append(degSeg);
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "En Küçük Kareler ve En İyi Yaklaşım Stüdyosu", en: "Least-Squares & Best Approximation Studio" },
    sub: {
      tr: R`Veri noktalarını sürükleyin, hazır deney senaryolarını yükleyin ve \(d = 0\) (sabit ortalama) ile \(d = 4\) (tam interpolasyon) arasında polinom derecelerini karşılaştırın; her seferinde artık vektörünün dikliğini (\(\|A^T\mathbf{r}\| = 0\)) canlı doğrulayın!`,
      en: R`Drag points, load preset datasets, and sweep polynomial degrees from \(d = 0\) (constant mean) up to \(d = 4\) (exact interpolation), while checking residual orthogonality (\(\|A^T\mathbf{r}\| = 0\)) live!`,
    },
    experiments: [
      { tr: R`<b>"Sabit (d=0)"</b> seçeneğine tıklayın: yatay çizgi her zaman noktaların tam <b>aritmetik ortalaması</b> \(\hat{y} = \bar{y}\) yüksekliğinde durur!`, en: R`Click <b>"Constant (d=0)"</b>: the best horizontal line ALWAYS sits at the exact <b>arithmetic mean</b> \(\hat{y} = \bar{y}\) of the data!` },
      { tr: R`<b>"Parabol (U-Şekli)"</b> yükleyip \(d = 1 \to 2 \to 3\) geçin: \(d = 2\)'de \(R^2\)'nin bir anda \(0{,}99\) üstüne fırladığını, \(d = 3\)'ün ise neredeyse hiç ekstra fayda getirmediğini görün.`, en: R`Load <b>"Parabola (U-Shape)"</b> and sweep \(d = 1 \to 2 \to 3\): see \(R^2\) leap past \(0.99\) at \(d = 2\), while \(d = 3\) adds almost no real improvement.` },
      { tr: R`Herhangi bir senaryoda <b>"Derece 4 (d=4)"</b> seçin: 5 noktanın hepsinden geçip \(\mathrm{SSR} = 0\) ve \(R^2 = 1\) verir — ama ara bölgelerde nasıl aşırı kıvrıldığına (<b>overfitting</b>!) dikkat edin.`, en: R`Pick <b>"Degree 4 (d=4)"</b> on any preset: it hits all 5 points with \(\mathrm{SSR} = 0,\ R^2 = 1\) — notice the wild wiggles between points (<b>overfitting</b>!).` },
      { tr: R`Sağdaki <b>\(\|A^T \mathbf{r}\|\)</b> kutusuna bakın: noktaları nereye sürüklerseniz sürükleyin bu sayı daima <b>\(0{,}000\)</b> kalır — çünkü artık vektörü \(\mathbf{r}\) her zaman \(\operatorname{Col}(A)\)'ya diktir!`, en: R`Watch the <b>\(\|A^T \mathbf{r}\|\)</b> tile on the right: no matter how you drag the points, it ALWAYS stays <b>\(0.000\)</b> — confirming \(\mathbf{r} \perp \operatorname{Col}(A)\)!` },
    ],
    build(host, state) {
      const s = (state.pg ??= {
        pts: [[-3, -1.5], [-1.5, -0.3], [0, 0.8], [1.5, 1.4], [3, 3.2]],
        deg: 1,
      });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, {
        height: 400,
        interactive: true,
        hint: L({ tr: "Veri noktalarını sürükleyin", en: "Drag data points" }),
      });
      const ctlPre = h("div", { class: "t-controls" });
      const ctlDeg = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(ctlPre, ctlDeg, tiles, calc);

      let degSeg;
      const draw = () => {
        const fit = leastSquaresPoly(s.pts, s.deg);
        const f = (x) => fit.coeffs.reduce((acc, c, p) => acc + c * x ** p, 0);
        const res = s.pts.map(([x, y]) => y - f(x));
        const maxRes = Math.max(...res.map((r) => Math.abs(r)));
        const A = s.pts.map(([x]) => Array.from({ length: s.deg + 1 }, (_, p) => x ** p));
        const AtR = matVec(matTranspose(A), res);
        const orthErr = vNorm(AtR);

        plot.draw({
          x: [-4.2, 4.2],
          y: [-4, 5],
          xLabel: "x",
          yLabel: "y",
          curves: [{ f, color: COLORS.c1, width: 2.8 }],
          segments: s.pts.map(([x, y]) => ({ from: [x, y], to: [x, f(x)], color: COLORS.c2, dash: [4, 3], width: 1.9 })),
          handles: s.pts.map(([x, y], i) => ({
            id: `p${i}`, x, y, color: COLORS.c3,
            onDrag: (nx, ny) => { s.pts[i] = [nx, ny]; draw(); },
          })),
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "SSR (‖r‖²)" }), h("span", { class: "pg-tile-value", text: ns(fit.ssr, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "R²" }), h("span", { class: "pg-tile-value", text: ns(fit.r2, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "max |rᵢ|" }), h("span", { class: "pg-tile-value", text: ns(maxRes, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "‖Aᵀr‖" }), h("span", { class: "pg-tile-value", text: ns(orthErr, 3) })),
        );
        const terms = fit.coeffs
          .map((c, p) => (p === 0 ? tx(c, 2) : `${txs(c, 2)}\\,x${p > 1 ? `^${p}` : ""}`))
          .join(" ");
        calc.textContent = `\\(\\hat{y}(x) = ${terms}\\)`;
      };

      const mkBtn = (label, pts, deg) => {
        const bt = h("button", { type: "button", class: "btn small", text: L(label) });
        bt.addEventListener("click", () => {
          s.pts = pts.map((p) => [...p]);
          if (deg != null) { s.deg = deg; degSeg.set(deg); }
          draw();
        });
        return bt;
      };
      ctlPre.append(
        mkBtn({ tr: "Gürültülü Doğru", en: "Noisy Line" }, [[-3, -1.5], [-1.5, -0.3], [0, 0.8], [1.5, 1.4], [3, 3.2]], 1),
        mkBtn({ tr: "Parabol (U-Şekli)", en: "Parabola (U-Shape)" }, [[-3, 3.6], [-1.5, 0.5], [0, -0.6], [1.5, 0.7], [3, 3.9]], 2),
        mkBtn({ tr: "Kübik Dalga", en: "Cubic Wave" }, [[-3, -2.5], [-1.5, 1.4], [0, 0.1], [1.5, -1.2], [3, 2.8]], 3),
        mkBtn({ tr: "Tam Doğrusal", en: "Exact Line" }, [[-2, -1], [-1, 0], [0, 1], [1, 2], [2, 3]], 1),
        mkBtn({ tr: "Aykırı Nokta", en: "Outlier" }, [[-3, -1.5], [-1.5, -0.5], [0, 0.5], [1.5, 1.5], [3, -2.2]], 1),
      );
      degSeg = segmented(
        [
          [0, { tr: "Sabit (d=0)", en: "Const (d=0)" }],
          [1, { tr: "d=1", en: "d=1" }],
          [2, { tr: "d=2", en: "d=2" }],
          [3, { tr: "d=3", en: "d=3" }],
          [4, { tr: "d=4", en: "d=4" }],
        ],
        s.deg,
        (v) => { s.deg = Number(v); draw(); },
      );
      ctlDeg.append(degSeg);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-ip-axioms",
      title: { tr: "İç Çarpım Aksiyomları, Pisagor ve Cauchy–Schwarz", en: "Inner Product Axioms, Pythagoras & Cauchy–Schwarz" },
      blocks: [
        {
          p: {
            tr: R`Bir reel vektör uzayı \(V\) üzerindeki \(\langle \cdot, \cdot \rangle : V \times V \to \mathbb{R}\) işlemi şu 3 aksiyomu sağladığında bir <b>[[inner-product|iç çarpım]]</b> olur:`,
            en: R`An operation \(\langle \cdot, \cdot \rangle : V \times V \to \mathbb{R}\) on a real vector space \(V\) is an <b>[[inner-product|inner product]]</b> when it obeys these 3 axioms:`,
          },
        },
        {
          eq: R`\text{(1) }\langle u, v \rangle = \langle v, u \rangle, \qquad \text{(2) }\langle \alpha u + \beta w, v \rangle = \alpha\langle u, v \rangle + \beta\langle w, v \rangle, \qquad \text{(3) }\langle u, u \rangle > 0\ (u \ne 0)`,
        },
        {
          table: {
            head: [{ tr: "Uzay", en: "Space" }, { tr: "Klasik İç Çarpım", en: "Classic Inner Product" }, { tr: "Uygulama", en: "Application" }],
            rows: [
              [R`\(\mathbb{R}^n\)`, R`\(\langle \mathbf{u}, \mathbf{v} \rangle = \sum_{i=1}^n u_i v_i\)`, { tr: "Standart Öklid geometrisi", en: "Standard Euclidean geometry" }],
              [R`\(\mathbb{R}^n\) (ağırlıklı)`, R`\(\langle \mathbf{u}, \mathbf{v} \rangle_w = \sum_{i=1}^n w_i u_i v_i\ (w_i > 0)\)`, { tr: "Ağırlıklı en küçük kareler", en: "Weighted least squares" }],
              [R`\(C([a, b])\)`, R`\(\langle f, g \rangle = \int_a^b f(x)g(x)\,dx\)`, { tr: "Fourier serileri & Legendre polinomları", en: "Fourier series & Legendre polynomials" }],
              [R`\(\mathbb{R}^{m \times n}\)`, R`\(\langle A, B \rangle_F = \operatorname{tr}(A^T B) = \sum_{i,j} A_{ij} B_{ij}\)`, { tr: "Frobenius matris normu", en: "Frobenius matrix norm" }],
            ],
          },
        },
        {
          derive: {
            title: { tr: "İspat 1: Soyut Pisagor Teoremi ve Cauchy–Schwarz Eşitsizliği", en: "Proof 1: Abstract Pythagoras & Cauchy–Schwarz Inequality" },
            steps: [
              { tex: R`\|u + v\|^2 = \langle u + v, u + v \rangle = \langle u, u \rangle + 2\langle u, v \rangle + \langle v, v \rangle = \|u\|^2 + 2\langle u, v \rangle + \|v\|^2`, why: { tr: "Simetri ve doğrusallığı kullanarak iç çarpımı tıpkı (a+b)² gibi açarız!", en: "Expand via symmetry and bilinearity just like (a+b)²!" } },
              { tex: R`\langle u, v \rangle = 0 \implies \|u + v\|^2 = \|u\|^2 + \|v\|^2`, why: { tr: "Ortogonal (dik) vektörlerde ortadaki terim 0 olur: Pisagor Teoremi her iç çarpım uzayında (fonksiyonlarda bile!) geçerlidir.", en: "For orthogonal vectors the cross term vanishes: Pythagoras holds in EVERY inner product space (even for functions!)." } },
              { tex: R`0 \le \|u - t v\|^2 = \|u\|^2 - 2t\langle u, v \rangle + t^2 \|v\|^2 \quad (\forall\, t \in \mathbb{R})`, why: { tr: "Cauchy–Schwarz için: pozitif tanımlılık gereği bu kuadratik fonksiyon t ne olursa olsun asla negatif olamaz.", en: "For Cauchy–Schwarz: by positive-definiteness, this quadratic in t can never dip below zero." } },
              { tex: R`\Delta = 4\langle u, v \rangle^2 - 4\|u\|^2\|v\|^2 \le 0 \implies |\langle u, v \rangle| \le \|u\|\,\|v\|`, why: { tr: "Negatif olmayan bir kuadratik ifadenin diskriminantı Δ ≤ 0 olmak zorundadır — işte meşhur Cauchy–Schwarz eşitsizliği!", en: "A non-negative quadratic must have discriminant Δ ≤ 0 — yielding the famous Cauchy–Schwarz inequality!" } },
            ],
          },
        },
        {
          example: {
            title: { tr: "[0, 1] aralığında f(x) = 1 ve g(x) = x arasındaki \"açı\" kaç derecedir?", en: "What is the \"angle\" between f(x) = 1 and g(x) = x on [0, 1]?" },
            problem: {
              tr: R`\([0, 1]\) aralığında \(\langle f, g \rangle = \int_0^1 f(x)g(x)\,dx\) iç çarpımına göre \(1\) ve \(x\) fonksiyonları arasındaki açıyı bulun.`,
              en: R`Under \(\langle f, g \rangle = \int_0^1 f(x)g(x)\,dx\) on \([0, 1]\), find the angle \(\theta\) between \(f(x) = 1\) and \(g(x) = x\).`,
            },
            steps: [
              { expr: R`\langle 1, x \rangle = \int_0^1 x\,dx = \frac{1}{2}`, note: { tr: R`İç çarpım \(\frac{1}{2} \ne 0\) — yani \([0, 1]\)'de dik değiller!`, en: R`Inner product is \(\frac{1}{2} \ne 0\) — not orthogonal on \([0, 1]\)!` } },
              { expr: R`\|1\| = \sqrt{\int_0^1 1\,dx} = 1, \qquad \|x\| = \sqrt{\int_0^1 x^2\,dx} = \frac{1}{\sqrt{3}}`, note: { tr: R`Her iki fonksiyonun normlarını (uzunluklarını) hesaplıyoruz.`, en: R`Compute the norms (lengths) of both functions.` } },
              { expr: R`\cos\theta = \frac{\langle 1, x \rangle}{\|1\|\,\|x\|} = \frac{1/2}{1 \cdot (1/\sqrt{3})} = \frac{\sqrt{3}}{2} \implies \theta = 30^\circ = \frac{\pi}{6}`, note: { tr: R`İnanılmaz değil mi? \([0, 1]\) aralığında \(1\) ve \(x\) fonksiyonları arasında tam \(30^\circ\) açı vardır!`, en: R`Isn't that neat? On \([0, 1]\), the functions \(1\) and \(x\) sit at an exact \(30^\circ\) angle!` } },
            ],
            answer: { tr: R`\(\theta = 30^\circ = \frac{\pi}{6}\) radyan.`, en: R`\(\theta = 30^\circ = \frac{\pi}{6}\) radians.` },
          },
        },
      ],
    },
    {
      id: "m-ip-gs",
      title: { tr: "Gram–Schmidt Algoritması, Legendre Polinomları ve QR", en: "Gram–Schmidt Algorithm, Legendre Polynomials & QR" },
      blocks: [
        {
          p: {
            tr: R`Genel olarak doğrusal bağımsız \(\{\mathbf{v}_1, \dots, \mathbf{v}_k\}\) vektörlerinden ortonormal \(\{\mathbf{q}_1, \dots, \mathbf{q}_k\}\) tabanı üretirken her adımda yeni vektörden <b>daha önce oluşturulan tüm \(\mathbf{q}_j\) yönlerindeki gölgeler</b> çıkarılır:`,
            en: R`In general, given any linearly independent vectors \(\{\mathbf{v}_1, \dots, \mathbf{v}_k\}\), step \(i\) removes the shadow along <b>every previously constructed \(\mathbf{q}_j\)</b> and normalizes:`,
          },
        },
        {
          eq: R`\mathbf{u}_i = \mathbf{v}_i - \sum_{j=1}^{i-1} \langle \mathbf{v}_i, \mathbf{q}_j \rangle\,\mathbf{q}_j, \qquad \mathbf{q}_i = \frac{\mathbf{u}_i}{\|\mathbf{u}_i\|} \qquad (i = 1, \dots, k)`,
        },
        {
          example: {
            title: { tr: "Polinomlara Gram–Schmidt: İlk 3 Legendre ortogonal polinomu!", en: "Gram–Schmidt on polynomials: The first 3 Legendre orthogonal polynomials!" },
            problem: {
              tr: R`\([-1, 1]\) üzerinde \(\langle f, g \rangle = \int_{-1}^1 f(x)g(x)\,dx\) ile \(\{1,\ x,\ x^2\}\) tabanını ortogonal hâle getirin.`,
              en: R`Orthogonalize \(\{1,\ x,\ x^2\}\) on \([-1, 1]\) under \(\langle f, g \rangle = \int_{-1}^1 f(x)g(x)\,dx\).`,
            },
            steps: [
              { expr: R`u_1(x) = 1, \qquad u_2(x) = x - \frac{\langle x, 1 \rangle}{\langle 1, 1 \rangle}\cdot 1 = x - \frac{0}{2} = x`, note: { tr: R`\(1\) ve \(x\) zaten \([-1, 1]\)'de dik olduğu için \(u_2 = x\) aynen kalır!`, en: R`Since \(1 \perp x\) already on \([-1, 1]\), \(u_2 = x\) needs no adjustment!` } },
              { expr: R`\langle x^2, 1 \rangle = \int_{-1}^1 x^2\,dx = \frac{2}{3}, \quad \langle 1, 1 \rangle = 2, \quad \langle x^2, x \rangle = \int_{-1}^1 x^3\,dx = 0`, note: { tr: R`\(x^2\)'nin \(u_1 = 1\) ve \(u_2 = x\) yönlerindeki iç çarpımlarını hesaplıyoruz (\(x^3\) tek fonksiyon olduğundan 0!).`, en: R`Compute inner products of \(x^2\) with \(1\) and \(x\) (\(x^3\) is odd, so its integral vanishes!).` } },
              { expr: R`u_3(x) = x^2 - \frac{2/3}{2}\cdot 1 - 0\cdot x = x^2 - \frac{1}{3}`, note: { tr: R`Kontrol: \(\int_{-1}^1 (x^2 - \frac{1}{3})\,dx = \frac{2}{3} - \frac{2}{3} = 0\) ✓ — bu meşhur Legendre polinomudur!`, en: R`Check: \(\int_{-1}^1 (x^2 - \frac{1}{3})\,dx = \frac{2}{3} - \frac{2}{3} = 0\) ✓ — the famous Legendre polynomial!` } },
            ],
            answer: { tr: R`Ortogonal taban: \(\left\{1,\ x,\ x^2 - \frac{1}{3}\right\}\).`, en: R`Orthogonal basis: \(\left\{1,\ x,\ x^2 - \frac{1}{3}\right\}\).` },
          },
        },
        {
          callout: "tip",
          title: { tr: "Gram–Schmidt = QR Matris Ayrışımı!", en: "Gram–Schmidt = QR Matrix Factorization!" },
          text: {
            tr: R`\(A = [\mathbf{v}_1\ \dots\ \mathbf{v}_k]\) matrisinin sütunlarına Gram–Schmidt uygulayıp çıkan birim vektörleri \(Q = [\mathbf{q}_1\ \dots\ \mathbf{q}_k]\) matrisine dizersek \(A = QR\) elde ederiz; burada \(Q^T Q = I\) ve \(R\) üst üçgendir! Bu ayrışım sayısal en küçük karelerde \(A^T A\) kurmaktan çok daha kararlıdır.`,
            en: R`Stacking Gram–Schmidt's outputs into \(Q = [\mathbf{q}_1\ \dots\ \mathbf{q}_k]\) yields \(A = QR\) where \(Q^T Q = I\) and \(R\) is upper triangular! In scientific computing, \(QR\) solves least squares far more stably than forming \(A^T A\).`,
          },
        },
      ],
    },
    {
      id: "m-ip-best",
      title: { tr: "En İyi Yaklaşım Teoremi ve Normal Denklemler İspatı", en: "Best Approximation Theorem & Normal Equations Proof" },
      blocks: [
        {
          derive: {
            title: { tr: "İspat 2: Dik izdüşüm ŷ neden W içindeki tek EN YAKIN noktadır?", en: "Proof 2: Why orthogonal projection ŷ uniquely minimizes ‖y − w‖ over W" },
            steps: [
              { tex: R`\mathbf{y} - \mathbf{w} = (\mathbf{y} - \hat{\mathbf{y}}) + (\hat{\mathbf{y}} - \mathbf{w}) \qquad (\forall\,\mathbf{w} \in W)`, why: { tr: "W alt uzayındaki keyfi bir rakip nokta w için fark vektörünü dik izdüşüm ŷ üzerinden iki parçaya böleriz.", en: "For any rival w ∈ W, split y − w at the orthogonal projection ŷ." } },
              { tex: R`\langle \mathbf{y} - \hat{\mathbf{y}},\ \hat{\mathbf{y}} - \mathbf{w} \rangle = 0`, why: { tr: "ŷ − w ∈ W (kapalılık) ve artık y − ŷ tüm W'ye dik olduğundan iki parça birbirine 90° diktir!", en: "Since ŷ − w ∈ W and the residual y − ŷ ⊥ W, the two pieces are strictly orthogonal!" } },
              { tex: R`\|\mathbf{y} - \mathbf{w}\|^2 = \|\mathbf{y} - \hat{\mathbf{y}}\|^2 + \|\hat{\mathbf{y}} - \mathbf{w}\|^2 \ge \|\mathbf{y} - \hat{\mathbf{y}}\|^2`, why: { tr: "Pisagor Teoremi gereği ikinci kare ≥ 0'dır; eşitlik ancak ve ancak w = ŷ iken sağlanır (en yakın nokta tektir!).", en: "By Pythagoras, the extra squared term is ≥ 0, with equality if and only if w = ŷ (uniqueness!)." } },
              { tex: R`A^T(\mathbf{y} - A\hat{\mathbf{c}}) = \mathbf{0} \;\Longleftrightarrow\; A^T A\,\hat{\mathbf{c}} = A^T \mathbf{y}`, why: { tr: "W = Col(A) seçildiğinde artığın A'nın her sütununa dik olması tam olarak Normal Denklemleri verir!", en: "For W = Col(A), requiring the residual to be perpendicular to every column of A gives AᵀAĉ = Aᵀy!" } },
            ],
          },
        },
        {
          callout: "warn",
          title: { tr: "AᵀA ne zaman tersinirdir?", en: "When is AᵀA guaranteed to be invertible?" },
          text: {
            tr: R`Normal denklemler \(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\) ancak ve ancak \(A\)'nın sütunları <b>doğrusal bağımsız</b> ise (\(\ker(A) = \{\mathbf{0}\}\)) tek bir çözüme sahiptir! Örneğin tüm veri noktalarının \(x\)-değerleri aynıysa \((2, 1),\ (2, 3),\ (2, 5)\), \(A\)'nın sütunları bağımlı olur ve tek bir eğim tanımlanamaz!`,
            en: R`The normal equations \(A^T A \hat{\mathbf{c}} = A^T \mathbf{y}\) have a unique solution if and only if the columns of \(A\) are <b>linearly independent</b> (\(\ker(A) = \{\mathbf{0}\}\))! For instance, if all data points share the same \(x\)-value like \((2, 1), (2, 3), (2, 5)\), the columns of \(A\) are dependent and no unique slope exists!`,
          },
        },
      ],
    },
    {
      id: "m-ip-lsq",
      title: { tr: "Tam Çözüm, En Küçük Kareler ve Ortonormal İzdüşüm Karşılaştırması", en: "Comparing Exact Systems, Least Squares & Orthonormal Projection" },
      blocks: [
        {
          table: {
            head: [{ tr: "Durum", en: "Setting" }, { tr: "Formül", en: "Formula" }, { tr: "Ne zaman kullanılır?", en: "When to use?" }],
            rows: [
              [{ tr: "Tam çözüm (kare & tersinir)", en: "Exact (square & invertible)" }, R`\(\mathbf{c} = A^{-1}\mathbf{y}\)`, { tr: R`\(\mathbf{y} \in \operatorname{Col}(A)\), hata \(\mathrm{SSR} = 0\)`, en: R`\(\mathbf{y} \in \operatorname{Col}(A)\), zero error` }],
              [{ tr: "Genel En Küçük Kareler", en: "General Least Squares" }, R`\(A^T A\,\hat{\mathbf{c}} = A^T \mathbf{y}\)`, { tr: R`Ölçüm sayısı \(m > k\) (veri uydurma / regresyon)`, en: R`Overdetermined \(m > k\) (curve fitting / regression)` }],
              [{ tr: "Ortonormal taban (QᵀQ = I)", en: "Orthonormal basis (QᵀQ = I)" }, R`\(\hat{\mathbf{c}} = Q^T\mathbf{y},\quad \hat{\mathbf{y}} = QQ^T\mathbf{y}\)`, { tr: R`Gram–Schmidt veya Fourier sonrası — matris tersi yok!`, en: R`After Gram–Schmidt or Fourier — NO matrix inverse!` }],
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Harika bağlantı: d = 0 En Küçük Kareler = Aritmetik Ortalama!", en: "Beautiful connection: d = 0 Least Squares = The Arithmetic Mean!" },
          text: {
            tr: R`Veri noktalarına sabit bir \(y = c_0\) yatay doğrusu uydurursak \(A = [1, 1, \dots, 1]^T\) olur. O zaman \(A^T A = n\) ve \(A^T \mathbf{y} = \sum_{i=1}^n y_i\), dolayısıyla \(n c_0 = \sum y_i \implies \hat{c}_0 = \bar{y}\)! Demek ki liseden beri bildiğimiz aritmetik ortalama bile aslında bir dik izdüşümmüş!`,
            en: R`Fitting a constant line \(y = c_0\) uses \(A = [1, 1, \dots, 1]^T\). Then \(A^T A = n\) and \(A^T \mathbf{y} = \sum_{i=1}^n y_i\), giving \(\hat{c}_0 = \frac{1}{n}\sum y_i = \bar{y}\)! Even the everyday arithmetic mean is secretly an orthogonal projection!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
