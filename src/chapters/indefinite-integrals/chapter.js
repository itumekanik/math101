import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { numDiff } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "ii-intro",
    title: { tr: "Belirsiz İntegraller ve İntegrasyon Teknikleri", en: "Indefinite Integrals & Integration Techniques" },
    paragraphs: [
      {
        tr: R`Türev bize bir fonksiyonun <b>değişim hızını (eğimini)</b> verir. Peki ya elimizde yalnızca eğim fonksiyonu \(f(x)\) varsa ve asıl fonksiyonu geri bulmak istiyorsak? İşte türevi geriye sarma işlemine [[antiderivative|belirsiz integral (ilkel fonksiyon)]] denir. Sembolü olan \(\int f(x)\,dx\) ifadesini sesli olarak <em>"\(f(x)\)'in \(x\)'e göre integrali"</em> diye okuruz: uzatılmış S harfi \(\int\) "topla/geri kur", \(dx\) ise değişkenin \(x\) olduğunu söyler.`,
        en: R`The [[derivative|derivative]] gives us a function's <b>rate of change (slope)</b>. What if we are handed only the slope function \(f(x)\) and want to recover the original function? Reversing differentiation is called finding the [[antiderivative|antiderivative (indefinite integral)]]. We read \(\int f(x)\,dx\) aloud as <em>"the integral of \(f(x)\) with respect to \(x\)"</em>: the elongated S symbol \(\int\) says "reconstruct/sum", and \(dx\) tells us the variable is \(x\).`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> neden her belirsiz integralin sonuna mutlaka \(+ C\) eklendiğini görecek; türev kurallarını tersine çevirerek [[u-substitution|değişken değiştirme (\(u\)-dönüşümü)]], [[integration-by-parts|kısmi integrasyon (LAPTU/LIATE)]] ve <b>basit kesirlere ayırma</b> tekniklerini adım adım uygulayabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will understand why every indefinite integral carries an arbitrary constant \(+ C\), and master the three essential techniques: [[u-substitution|\(u\)-substitution]], [[integration-by-parts|integration by parts (LIATE)]], and <b>partial fractions</b>.`,
      },
    ],
    analogy: {
      title: { tr: "Yürüyüş parkurunun eğim haritasından yükseklik profilini çizmek", en: "Reconstructing a hiking trail's elevation from a slope map" },
      text: {
        tr: R`Bir arkadaşınız çıktığı doğa yürüyüşünde her kilometrede yolun ne kadar dik olduğunu (eğimi \(f(x)\)) not etmiş ama kaç metre yükseklikten başladığını yazmayı unutmuş olsun. Eğim notlarından her yokuşu ve inişi birebir çizebilirsiniz; tek bilmediğiniz şey yürüyüşün deniz seviyesinden mi (\(C = 0\)) yoksa 500 m yükseklikteki bir yayladan mı (\(C = 500\)) başladığıdır! İşte bu bilinmeyen başlangıç yüksekliği \(+ C\) sabitidir — tek bir nokta \((x_0, y_0)\) bilindiğinde tüm rota kesinleşir!`,
        en: R`Imagine a friend hiked a trail and wrote down the steepness (slope \(f(x)\)) at every kilometer, but forgot to record the starting altitude. From the slope notes alone, you can rebuild the exact shape of every hill and valley — the only missing piece is whether they started at sea level (\(C = 0\)) or at a 500 m mountain cabin (\(C = 500\))! That unknown starting height is literally \(+ C\), and knowing a single point \((x_0, y_0)\) locks in the exact curve!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 18 · Belirsiz İntegraller", en: "Lecture 18 · Indefinite Integrals" }],
      [{ tr: "Altın kural", en: "Golden rule" }, { tr: R`\(\int f(x)\,dx = F(x) + C \iff F'(x) = f(x)\)`, en: R`\(\int f(x)\,dx = F(x) + C \iff F'(x) = f(x)\)` }],
      [{ tr: "Üç ana teknik", en: "Three core methods" }, { tr: R`\(u\)-dönüşümü, Kısmi İntegrasyon (LAPTU), Basit Kesirler`, en: R`\(u\)-substitution, By Parts (LIATE), Partial Fractions` }],
    ],
    tip: {
      title: { tr: "İntegralin yerleşik sağlaması!", en: "Built-in self-check!" },
      text: {
        tr: R`Belirsiz integralde cevabınızdan asla şüphe etmenize gerek yok: bulduğunuz \(F(x)\) sonucunun türevini alın! Eğer \(F'(x) = f(x)\) çıkıyorsa çözümünüz %100 doğrudur.`,
        en: R`You never have to guess whether an indefinite integral is right: just differentiate your answer \(F(x)\)! If \(F'(x) = f(x)\), your answer is 100% guaranteed correct.`,
      },
    },
  },
  sections: [
    {
      id: "ii-family",
      mathId: "m-ii-table",
      title: { tr: "Türevin Tersi ve Neden + C Vardır?", en: "Reversing the Derivative & Why + C Exists" },
      body: [
        {
          tr: R`Bir fonksiyonun türevini alırken sabit sayılar yok olur: \((x^2)' = 2x\), \((x^2 + 5)' = 2x\) ve \((x^2 - 100)' = 2x\). Bu yüzden "türevi \(2x\) olan fonksiyon hangisidir?" sorusunun tek bir cevabı yoktur — yukarı veya aşağı kaydırılmış <b>sonsuz bir paralel eğri ailesi</b> \(x^2 + C\) vardır.`,
          en: R`Differentiation erases constants: \((x^2)' = 2x\), \((x^2 + 5)' = 2x\), and \((x^2 - 100)' = 2x\). So asking "which function has derivative \(2x\)?" does not have one answer — it produces an <b>infinite family of vertically shifted curves</b> \(x^2 + C\).`,
        },
        {
          note: {
            tr: R`<b>Kuvvet kuralı tersten:</b> Türevde üssü başa indirip 1 azaltıyorduk; integralde tam tersini yaparız — <b>üssü 1 artır ve yeni üsse böl:</b> \(\int x^n\,dx = \frac{x^{n+1}}{n+1} + C\) (\(n \ne -1\)). Özel durum \(n = -1\) için \(\int \frac{1}{x}\,dx = \ln|x| + C\) olur.`,
            en: R`<b>Power rule in reverse:</b> differentiation multiplies by the exponent and subtracts 1; integration reverses both steps — <b>add 1 to the exponent and divide by the new exponent:</b> \(\int x^n\,dx = \frac{x^{n+1}}{n+1} + C\) (\(n \ne -1\)). The special case \(n = -1\) gives \(\int \frac{1}{x}\,dx = \ln|x| + C\).`,
          },
        },
        { eq: R`\int f(x)\,dx = F(x) + C \iff \frac{d}{dx}\big(F(x) + C\big) = F'(x) = f(x)` },
        {
          example: {
            title: { tr: "Başlangıç koşuluyla C sabitini bulmak", en: "Pinning down C with an initial point" },
            problem: {
              tr: R`Eğimi \(F'(x) = 3x^2 - 2\) olan ve \((1, 5)\) noktasından geçen tekil \(F(x)\) eğrisini bulun.`,
              en: R`Find the exact curve \(F(x)\) whose slope is \(F'(x) = 3x^2 - 2\) and which passes through \((1, 5)\).`,
            },
            steps: [
              {
                expr: R`F(x) = \int (3x^2 - 2)\,dx = 3\cdot\frac{x^3}{3} - 2x + C = x^3 - 2x + C`,
                note: { tr: "Her terimin üssünü 1 artırıp yeni üsse böldük ve bilinmeyen + C sabitini ekledik.", en: "Apply the reverse power rule to each term and add the unknown constant + C." },
              },
              {
                expr: R`F(1) = 1^3 - 2(1) + C = 5 \implies -1 + C = 5 \implies C = 6`,
                note: { tr: R`Grafik \((1, 5)\) noktasından geçtiği için \(x = 1\) yazıp sonucu \(5\)'e eşitledik.`, en: R`Plug in the known point \((1, 5)\): set \(x = 1\) and solve for \(C\).` },
              },
              {
                expr: R`F'(x) = (x^3 - 2x + 6)' = 3x^2 - 2 \;\checkmark`,
                note: { tr: "Türev alarak ve F(1) = 1 - 2 + 6 = 5 olduğunu görerek sağlamasını yaptık!", en: "Quick check: its derivative is 3x² − 2 and F(1) = 1 − 2 + 6 = 5!" },
              },
            ],
            answer: { tr: R`\(F(x) = x^3 - 2x + 6\)`, en: R`\(F(x) = x^3 - 2x + 6\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "+ C'yi ve ln|x| içindeki mutlak değeri unutmak!", en: "Forgetting + C or absolute value bars in ln|x|!" },
            text: {
              tr: R`Belirsiz integralde \(+ C\) yazmamak sonsuz çözümden yalnızca birini söylemektir. Ayrıca \(\int \frac{1}{x}\,dx = \ln|x| + C\) yazarken mutlak değeri unutmayın: \(1/x\) fonksiyonu \(x < 0\) için de tanımlıdır, ama \(\ln(x)\) negatif sayılarda tanımsız kalır!`,
              en: R`Omitting \(+ C\) throws away infinitely many valid antiderivatives. Also never drop the absolute value in \(\int \frac{1}{x}\,dx = \ln|x| + C\): the integrand \(1/x\) works for \(x < 0\) too, whereas \(\ln(x)\) is undefined for negative inputs!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Turuncu <b>\((x_0, y_0)\) noktasını</b> grafikte sürükleyin — arka plandaki eğim çizgilerine (slope field) paralel tek bir mavi eğrinin bu noktadan geçtiğini görün.`, en: R`Drag the orange <b>point \((x_0, y_0)\)</b> on the plot — watch the unique blue curve thread through the background slope field right through your point.` },
            { tr: R`Aynı dikey \(x_0\) çizgisinde noktayı yalnızca <b>yukarı/aşağı</b> hareket ettirin: \(C\) değişir ama turuncu teğetin eğimi \(f(x_0)\) milim bile kıpırdamaz!`, en: R`Drag the point strictly <b>up and down</b> at the same \(x_0\): \(C\) changes, yet the orange tangent slope \(f(x_0)\) stays completely unchanged!` },
            { tr: R`Üstten \(f(x) = \cos x\) seçip \((0, 1)\) civarına sürükleyin ve \(C = 1\) için \(\sin x + 1\) eğrisini gözlemleyin.`, en: R`Switch to \(f(x) = \cos x\), drag near \((0, 1)\), and watch the curve lock onto \(\sin x + 1\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.fam ??= { fn: "quad", x0: 1, y0: 0.85 });
        const fams = {
          quad: { label: "f(x)=x²", f: (x) => x * x, F: (x) => (x * x * x) / 3, Ftex: "\\tfrac{1}{3}x^3" },
          lin: { label: "f(x)=2x", f: (x) => 2 * x, F: (x) => x * x, Ftex: "x^2" },
          cos: { label: "f(x)=cos x", f: (x) => Math.cos(x), F: (x) => Math.sin(x), Ftex: "\\sin x" },
          exp: { label: "f(x)=½eˣ", f: (x) => 0.5 * Math.exp(x), F: (x) => 0.5 * Math.exp(x), Ftex: "\\tfrac{1}{2}e^x" },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "(x₀, y₀) başlangıç noktasını sürükleyin", en: "Drag initial point (x₀, y₀)" }),
        });

        const draw = () => {
          const cur = fams[s.fn];
          const C = s.y0 - cur.F(s.x0);
          const slope = cur.f(s.x0);
          const ghosts = [-2, -1, 0, 1, 2].map((c) => ({ f: (x) => cur.F(x) + c, color: COLORS.grid, width: 1.4 }));
          // Build subtle slope field segments showing f(x) at grid points
          const fieldSegs = [];
          for (let gx = -2.5; gx <= 2.51; gx += 0.5) {
            const m = cur.f(gx);
            const dx = 0.14 / Math.hypot(1, m);
            const dy = m * dx;
            for (let gy = -3; gy <= 3.5; gy += 0.8) {
              fieldSegs.push({ from: [gx - dx, gy - dy], to: [gx + dx, gy + dy], color: COLORS.axis, width: 1 });
            }
          }
          plot.draw({
            x: [-3, 3], y: [-3.5, 4], xLabel: "x", yLabel: "F(x)+C",
            segments: fieldSegs,
            curves: [
              ...ghosts,
              { f: (x) => cur.F(x) + C, color: COLORS.c1, width: 2.8 },
            ],
            lines: [
              { a: 1, b: 0, c: -s.x0, color: COLORS.muted, dash: [4, 4] },
              { a: slope, b: -1, c: s.y0 - slope * s.x0, color: COLORS.c2, width: 2.2 },
            ],
            handles: [
              {
                id: "pt",
                x: s.x0,
                y: s.y0,
                color: COLORS.c2,
                label: `(${ns(s.x0, 1)}, ${ns(s.y0, 1)})`,
                onDrag: (x, y) => {
                  s.x0 = Math.max(-2.4, Math.min(2.4, x));
                  s.y0 = Math.max(-3, Math.min(3.4, y));
                  draw();
                },
              },
            ],
          });
          calc.textContent = `\\(F(x)+C = ${cur.Ftex} ${C >= 0 ? "+" : "-"} ${tx(Math.abs(C), 2)},\\qquad F'(${tx(s.x0, 1)}) = f(${tx(s.x0, 1)}) = ${tx(slope, 2)}\\)`;
        };
        const resetBtn = h("button", { type: "button", class: "btn small", text: L({ tr: "C = 0 yap", en: "Set C = 0" }) });
        resetBtn.addEventListener("click", () => {
          s.x0 = 1;
          s.y0 = fams[s.fn].F(1);
          draw();
        });
        ctl.append(
          segmented(Object.entries(fams).map(([k, v]) => [k, v.label]), s.fn, (v) => {
            s.fn = v;
            s.y0 = fams[v].F(s.x0) + 0.5;
            draw();
          }),
          resetBtn,
        );
        draw();
      },
    },
    {
      id: "ii-usub",
      mathId: "m-ii-usub",
      title: { tr: "u-Dönüşümü: Zincir Kuralını Geriye Sarmak", en: "u-Substitution: Reversing the Chain Rule" },
      body: [
        {
          tr: R`[[chain-rule|Zincir Kuralı]], iç içe geçmiş bir fonksiyonun türevini alırken dışın türevini için türeviyle çarpar: \(\frac{d}{dx}F(g(x)) = F'(g(x))\cdot g'(x)\). İntegralde bunun tersini gördüğümüzde — yani bir "iç parça" \(g(x)\) ve hemen yanında onun türevi \(g'(x)\) (sabit bir çarpan farkıyla bile olsa!) duruyorsa — iç parçaya tek bir harf \(u = g(x)\) deriz!`,
          en: R`The [[chain-rule|Chain Rule]] differentiates nested functions by multiplying by the inner derivative: \(\frac{d}{dx}F(g(x)) = F'(g(x))\cdot g'(x)\). When an integral contains an "inside expression" \(u = g(x)\) sitting right next to its derivative \(g'(x)\) (even up to a constant multiple!), we collapse the inside into one clean variable \(u\)!`,
        },
        {
          analogy: {
            title: { tr: "Karmaşık bir paketi tek kutuya koyup etiketlemek", en: "Packing a messy expression into one labeled box" },
            text: {
              tr: R`Evinizi taşırken tabakları tek tek değil, "Mutfak Kutusu (\(u\))" içine koyup taşırsınız; yeni eve varınca kutuyu tekrar açarsınız. \(u\)-dönüşümü de aynısıdır: kalabalık \(x^2 + 1\) ifadesini tek bir \(u\) kutusuna koyar, basit \(\int u^2\,du\) integralini alır, iş bitince kutuyu geri açıp \(x\)'e dönersiniz!`,
              en: R`When moving houses, you pack dishes into one labeled box ("\(u\)"), carry the simple box easily, and unpack it at the end. In \(u\)-substitution, you pack the messy inner expression into \(u\), integrate the simple \(u\)-formula, and unpack \(u = g(x)\) back at the finish!`,
            },
          },
        },
        { eq: R`\int f\big(g(x)\big)\,g'(x)\,dx = \int f(u)\,du \qquad \Big(u = g(x),\; du = g'(x)\,dx\Big)` },
        {
          example: {
            title: { tr: "Adım adım u-dönüşümü", en: "Step-by-step u-substitution" },
            problem: {
              tr: R`\(\int 6x(x^2 + 1)^2\,dx\) belirsiz integralini hesaplayın.`,
              en: R`Evaluate the indefinite integral \(\int 6x(x^2 + 1)^2\,dx\).`,
            },
            steps: [
              {
                expr: R`u = x^2 + 1 \implies \frac{du}{dx} = 2x \implies du = 2x\,dx`,
                note: { tr: "Parantez içindeki ifadeyi u seçtik; türevi 2x dışarıda 6x olarak (3 katıyla) hazır bekliyor!", en: "Pick the inside expression as u; its derivative 2x appears outside inside 6x = 3·(2x)!" },
              },
              {
                expr: R`6x\,dx = 3(2x\,dx) = 3\,du \implies \int 6x(x^2 + 1)^2\,dx = \int 3u^2\,du`,
                note: { tr: "Tüm x'ler ve dx tamamen u ve du'ya dönüştü — artık hiç x kalmadı!", en: "Every x and dx converts cleanly into u and du — zero x's left behind!" },
              },
              {
                expr: R`\int 3u^2\,du = 3\cdot\frac{u^3}{3} + C = u^3 + C = (x^2 + 1)^3 + C`,
                note: { tr: "Basit kuvvet kuralıyla integre ettik ve en son u kutusunu geri açıp x² + 1 yazdık.", en: "Integrate via the power rule, then unpack u = x² + 1 back into x." },
              },
            ],
            answer: { tr: R`\((x^2 + 1)^3 + C\) (Türev kontrolü: \(3(x^2+1)^2\cdot 2x = 6x(x^2+1)^2\;\checkmark\))`, en: R`\((x^2 + 1)^3 + C\) (Check: \(3(x^2+1)^2\cdot 2x = 6x(x^2+1)^2\;\checkmark\))` },
          },
        },
        {
          pitfall: {
            title: { tr: "Cevabı u cinsinden bırakmak veya katsayıyı unutmak", en: "Leaving the answer in u or dropping the constant factor" },
            text: {
              tr: R`İki klasik tuzak: (1) Belirsiz integralde sonucu \(u^3 + C\) bırakıp \(x\)'e geri dönmemek. (2) \(\int \cos(3x)\,dx\) çözerken \(du = 3\,dx \implies dx = \frac{1}{3}du\) çarpanını unutup \(\sin(3x) + C\) yazmak (doğrusu \(\frac{1}{3}\sin(3x) + C\))!`,
              en: R`Two classic traps: (1) stopping at \(u^3 + C\) without substituting \(g(x)\) back in; (2) forgetting the constant adjustment — for \(\int \cos(3x)\,dx\), \(du = 3\,dx\) means \(dx = \frac{1}{3}du\), giving \(\frac{1}{3}\sin(3x) + C\), NOT \(\sin(3x) + C\)!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Aşağıdaki 3 klasik \(u\)-dönüşümü örneğini sırayla seçip hangi parçanın \(u\), hangisinin \(du\) olduğuna dikkat edin.`, en: R`Click through the 3 classic \(u\)-substitution examples below and spot which piece becomes \(u\) and which becomes \(du\).` },
            { tr: R`\(x_0\) kaydırıcısını oynatarak mavi \(F(x)\) eğrisindeki teğet eğiminin, turuncu kesikli \(f(x)\) eğrisinin tam yüksekliğine eşit olduğunu doğrulayın!`, en: R`Slide \(x_0\) and confirm that the tangent slope of blue \(F(x)\) matches the height of dashed orange \(f(x)\) everywhere!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.usub ??= { ex: "cosx2", x0: 1 });
        const examples = {
          cosx2: {
            label: "2x cos(x²)",
            steps: [
              R`\int 2x\cos(x^2)\,dx \quad \Big(u = x^2,\; du = 2x\,dx\Big)`,
              R`= \int \cos(u)\,du = \sin(u) + C = \sin(x^2) + C`,
            ],
            f: (x) => 2 * x * Math.cos(x * x),
            F: (x) => Math.sin(x * x),
            xr: [-2.4, 2.4],
            yr: [-4.5, 4.5],
          },
          log: {
            label: "2x/(x²+1)",
            steps: [
              R`\int \frac{2x}{x^2 + 1}\,dx \quad \Big(u = x^2 + 1,\; du = 2x\,dx\Big)`,
              R`= \int \frac{1}{u}\,du = \ln|u| + C = \ln(x^2 + 1) + C`,
            ],
            f: (x) => (2 * x) / (x * x + 1),
            F: (x) => Math.log(x * x + 1),
            xr: [-3, 3],
            yr: [-1.6, 2.8],
          },
          rad: {
            label: "x/√(x²+1)",
            steps: [
              R`\int \frac{x}{\sqrt{x^2 + 1}}\,dx \quad \Big(u = x^2 + 1,\; x\,dx = \tfrac{1}{2}du\Big)`,
              R`= \tfrac{1}{2}\int u^{-1/2}\,du = \sqrt{u} + C = \sqrt{x^2 + 1} + C`,
            ],
            f: (x) => x / Math.sqrt(x * x + 1),
            F: (x) => Math.sqrt(x * x + 1),
            xr: [-3, 3],
            yr: [-1.4, 3.6],
          },
        };
        const ctl = h("div", { class: "t-controls" });
        const stepsBox = h("div", { class: "m-widget-out" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, stepsBox, host, calc);
        const plot = createCanvas2D(host, { height: 220 });

        const draw = () => {
          const ex = examples[s.ex];
          stepsBox.replaceChildren(...ex.steps.map((tex) => h("div", { class: "m-eq", text: `\\(\\displaystyle ${tex}\\)` })));
          const x0 = Math.max(ex.xr[0] + 0.3, Math.min(ex.xr[1] - 0.3, s.x0));
          const yF = ex.F(x0);
          const yf = ex.f(x0);
          const dF = numDiff(ex.F, x0);
          plot.draw({
            x: ex.xr, y: ex.yr, xLabel: "x", yLabel: "y",
            curves: [
              { f: ex.f, color: COLORS.c2, width: 2, dash: [5, 4] },
              { f: ex.F, color: COLORS.c1, width: 2.7 },
            ],
            lines: [
              { a: dF, b: -1, c: yF - dF * x0, color: COLORS.c3, width: 1.9, dash: [3, 3] },
            ],
            points: [
              { x: x0, y: yF, color: COLORS.c1, r: 5.5, label: "F(x₀)" },
              { x: x0, y: yf, color: COLORS.c2, r: 5, label: "f(x₀)" },
            ],
          });
          calc.textContent = `\\(x_0 = ${tx(x0, 2)}:\\quad F'(${tx(x0, 2)}) = ${tx(dF, 4)} = f(${tx(x0, 2)}) = ${tx(yf, 4)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(examples).map(([k, v]) => [k, v.label]), s.ex, (v) => { s.ex = v; draw(); }),
          slider("x₀", { min: -2, max: 2, step: 0.2, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "ii-parts",
      mathId: "m-ii-parts",
      title: { tr: "Kısmi İntegrasyon (∫ u dv) ve LAPTU / LIATE Rehberi", en: "Integration by Parts (∫ u dv) & The LIATE Guide" },
      body: [
        {
          tr: R`Peki \(x \cdot e^x\) veya \(x \cdot \sin x\) gibi <b>farklı türden iki fonksiyonun çarpımı</b> ile karşılaşırsak ve \(u\)-dönüşümü işe yaramazsa ne yaparız? Çarpımın türevi kuralını tersten okuruz! İntegralin içini iki parçaya ayırırız: türevini aldığımızda sadeleşen parça \(u\), integralini rahatça alabildiğimiz parça \(dv\).`,
          en: R`What if the integrand is a <b>product of two different function types</b> like \(x \cdot e^x\) or \(x \cdot \sin x\) where \(u\)-substitution fails? Reverse the Product Rule! Split the integrand into two parts: \(u\) (the piece that gets simpler when differentiated) and \(dv\) (the piece you can easily integrate).`,
        },
        {
          note: {
            tr: R`<b>Hangi parçayı \(u\) seçeceğim? — LAPTU (İngilizce LIATE) öncelik sırası:</b><br><b>L</b>ogaritmik (\(\ln x\)) → <b>A</b>rk / Ters trig (\(\arctan x\)) → <b>P</b>olinom (\(x, x^2\)) → <b>T</b>rigonometrik (\(\sin x, \cos x\)) → <b>Ü</b>stel (\(e^x\)).<br>Listede <b>daha önce gelen</b> fonksiyonu \(u\) seçin! (Örneğin \(x e^x\)'te Polinom, Üstel'den önce gelir → \(u = x\), \(dv = e^x\,dx\).)`,
            en: R`<b>How do I pick \(u\)? — The LIATE priority rule:</b><br><b>L</b>ogarithmic (\(\ln x\)) → <b>I</b>nverse trig (\(\arctan x\)) → <b>A</b>lgebraic / Polynomial (\(x, x^2\)) → <b>T</b>rigonometric (\(\sin x, \cos x\)) → <b>E</b>xponential (\(e^x\)).<br>Pick whichever appears <b>earlier</b> in LIATE as \(u\)! (In \(x e^x\), Algebraic beats Exponential → \(u = x\), \(dv = e^x\,dx\).)`,
          },
        },
        { eq: R`\int u\,dv = u v - \int v\,du` },
        {
          example: {
            title: { tr: "Klasik kısmi integrasyon: ∫ x eˣ dx", en: "Classic integration by parts: ∫ x eˣ dx" },
            problem: {
              tr: R`\(\int x e^x\,dx\) integralini LAPTU/LIATE rehberiyle çözün.`,
              en: R`Evaluate \(\int x e^x\,dx\) using the LIATE priority rule.`,
            },
            steps: [
              {
                expr: R`u = x \;\Rightarrow\; du = 1\,dx, \qquad dv = e^x\,dx \;\Rightarrow\; v = \int e^x\,dx = e^x`,
                note: { tr: "Polinom (x), Üstel (eˣ)'ten önce geldiği için u = x seçtik: türevi 1 olup kaybolacak!", en: "Polynomial (x) beats Exponential (eˣ), so pick u = x: differentiating kills the x!" },
              },
              {
                expr: R`\int x e^x\,dx = u v - \int v\,du = x e^x - \int e^x\cdot 1\,dx`,
                note: { tr: "Formülü yerine yazdık; kalan integral artık en kolay temel integral!", en: "Plug into uv − ∫ v du; the remaining integral is now effortless!" },
              },
              {
                expr: R`= x e^x - e^x + C = (x - 1)e^x + C`,
                note: { tr: "Sağlama: [(x − 1)eˣ]' = 1·eˣ + (x − 1)eˣ = x eˣ ✓", en: "Check: [(x − 1)eˣ]' = 1·eˣ + (x − 1)eˣ = x eˣ ✓" },
              },
            ],
            answer: { tr: R`\((x - 1)e^x + C\)`, en: R`\((x - 1)e^x + C\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "u ile dv'yi ters seçmek işi büyütür!", en: "Choosing u and dv backwards makes things worse!" },
            text: {
              tr: R`\(\int x e^x\,dx\) sorusunda tersini deneyip \(u = e^x\) ve \(dv = x\,dx\) derseniz \(v = \frac{1}{2}x^2\) olur ve yeni integral \(\int \frac{1}{2}x^2 e^x\,dx\) çıkar — derece azalacağına büyüdü! Yeni integral eskisinden zorlaştıysa hemen \(u\) ve \(dv\) seçimini değiştirin.`,
              en: R`If you pick backwards (\(u = e^x\), \(dv = x\,dx\)) for \(\int x e^x\,dx\), you get \(v = \frac{1}{2}x^2\) and the new integral \(\int \frac{1}{2}x^2 e^x\,dx\) — harder than what you started with! Whenever \(\int v\,du\) gets messier, swap your choices of \(u\) and \(dv\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>\(\int \ln x\,dx\)</b> örneğine tıklayın: tek fonksiyon gibi görünse de \(dv = 1\,dx\) gizli çarpanıyla kısmi integrasyonun nasıl çalıştığını görün!`, en: R`Click <b>\(\int \ln x\,dx\)</b>: see how the sneaky hidden factor \(dv = 1\,dx\) solves a single-function integral!` },
            { tr: R`<b>\(x\sin x\)</b> ve <b>\(x e^x\)</b> arasında geçiş yapıp \(x_0\) kaydırıcısıyla \(F'(x_0) = f(x_0)\) doğrulamasını kontrol edin.`, en: R`Switch between <b>\(x\sin x\)</b> and <b>\(x e^x\)</b> and slide \(x_0\) to verify \(F'(x_0) = f(x_0)\) numerically.` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.parts ??= { ex: "xex", x0: 1.2 });
        const examples = {
          xex: {
            label: "x eˣ",
            pick: R`u = x,\; dv = e^x dx \;\Longrightarrow\; du = dx,\; v = e^x`,
            res: R`\int x e^x\,dx = x e^x - \int e^x\,dx = (x - 1)e^x + C`,
            f: (x) => x * Math.exp(x),
            F: (x) => (x - 1) * Math.exp(x),
            xr: [-2.5, 2],
            yr: [-2, 6],
            minX: -2,
            maxX: 1.6,
          },
          xsin: {
            label: "x sin x",
            pick: R`u = x,\; dv = \sin x\,dx \;\Longrightarrow\; du = dx,\; v = -\cos x`,
            res: R`\int x\sin x\,dx = -x\cos x + \int \cos x\,dx = \sin x - x\cos x + C`,
            f: (x) => x * Math.sin(x),
            F: (x) => Math.sin(x) - x * Math.cos(x),
            xr: [-3.5, 3.5],
            yr: [-4, 4.5],
            minX: -3,
            maxX: 3,
          },
          lnx: {
            label: "ln x",
            pick: R`u = \ln x,\; dv = 1\,dx \;\Longrightarrow\; du = \tfrac{1}{x}dx,\; v = x`,
            res: R`\int \ln x\,dx = x\ln x - \int 1\,dx = x\ln x - x + C`,
            f: (x) => (x > 0 ? Math.log(x) : NaN),
            F: (x) => (x > 0 ? x * Math.log(x) - x : NaN),
            xr: [-0.2, 4.5],
            yr: [-2, 3.5],
            minX: 0.3,
            maxX: 4,
          },
        };
        const ctl = h("div", { class: "t-controls" });
        const out = h("div", { class: "m-widget-out" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, out, host, calc);
        const plot = createCanvas2D(host, { height: 220 });

        const draw = () => {
          const ex = examples[s.ex];
          out.replaceChildren(
            h("div", { class: "m-eq", text: `\\(\\displaystyle ${ex.pick}\\)` }),
            h("div", { class: "m-eq", text: `\\(\\displaystyle ${ex.res}\\)` }),
          );
          const x0 = Math.max(ex.minX, Math.min(ex.maxX, s.x0));
          const yF = ex.F(x0);
          const yf = ex.f(x0);
          const dF = numDiff(ex.F, x0);
          plot.draw({
            x: ex.xr, y: ex.yr, xLabel: "x", yLabel: "y",
            curves: [
              { f: ex.f, color: COLORS.c2, width: 2, dash: [5, 4] },
              { f: ex.F, color: COLORS.c1, width: 2.7 },
            ],
            lines: [
              { a: dF, b: -1, c: yF - dF * x0, color: COLORS.c3, width: 1.9, dash: [3, 3] },
            ],
            points: [
              { x: x0, y: yF, color: COLORS.c1, r: 5.5, label: "F(x₀)" },
              { x: x0, y: yf, color: COLORS.c2, r: 5, label: "f(x₀)" },
            ],
          });
          calc.textContent = `\\(x_0 = ${tx(x0, 2)}:\\quad F'(${tx(x0, 2)}) = ${tx(dF, 4)} = f(${tx(x0, 2)}) = ${tx(yf, 4)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(examples).map(([k, v]) => [k, v.label]), s.ex, (v) => { s.ex = v; draw(); }),
          slider("x₀", { min: -2, max: 3, step: 0.2, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },
    {
      id: "ii-partial",
      mathId: "m-ii-partial",
      title: { tr: "Rasyonel Fonksiyonlar İçin Basit Kesirlere Ayırma", en: "Partial Fractions for Rational Functions" },
      body: [
        {
          tr: R`Liseden bildiğimiz payda eşitleme işlemini hatırlayın: \(\frac{1}{x-1} - \frac{1}{x+1} = \frac{2}{x^2 - 1}\). Sağdaki tek kesrin integralini almak zor görünür ama soldaki iki basit kesrin integrali anında logaritma verir! <b>Basit kesirlere ayırma</b>, işte bu payda eşitlemeyi geriye sararak rasyonel bir kesri kolay parçalara bölmektir.`,
          en: R`Remember adding fractions in algebra: \(\frac{1}{x-1} - \frac{1}{x+1} = \frac{2}{x^2 - 1}\). The combined right-hand side looks intimidating to integrate, whereas the two simple pieces on the left integrate immediately into logarithms! <b>Partial fractions</b> simply runs fraction addition backwards.`,
        },
        {
          analogy: {
            title: { tr: "Tek bir kasa fişini kalem kalem ayırmak", en: "Splitting a single receipt total back into its items" },
            text: {
              tr: R`Tek bir büyük kesir, iki basit kesrin "payda eşitlenip toplanmış toplam tutarı" gibidir. Paydayı çarpanlarına ayırıp \(A\) ve \(B\) katsayılarını bulduğumuzda, karmaşık toplamı iki ayrı ve çok kolay parçaya geri ayırmış oluruz!`,
              en: R`A combined rational function is like a single receipt total from two simple fractions added together. Factoring the denominator and solving for \(A\) and \(B\) unpacks that total back into two tiny, easy pieces!`,
            },
          },
        },
        { eq: R`\frac{P(x)}{(x - a)(x - b)} = \frac{A}{x - a} + \frac{B}{x - b} \implies \int = A\ln|x - a| + B\ln|x - b| + C` },
        {
          example: {
            title: { tr: "Kökleri yerine koyarak A ve B'yi saniyeler içinde bulmak", en: "Finding A and B in seconds by plugging in roots" },
            problem: {
              tr: R`\(\int \frac{5x - 1}{(x - 2)(x + 1)}\,dx\) integralini basit kesirlere ayırarak çözün.`,
              en: R`Evaluate \(\int \frac{5x - 1}{(x - 2)(x + 1)}\,dx\) using partial fractions.`,
            },
            steps: [
              {
                expr: R`\frac{5x - 1}{(x - 2)(x + 1)} = \frac{A}{x - 2} + \frac{B}{x + 1}`,
                note: { tr: "Payda iki farklı doğrusal çarpandan oluştuğu için iki basit kesir yazdık.", en: "Two distinct linear factors in the denominator split into two simple fractions." },
              },
              {
                expr: R`5x - 1 = A(x + 1) + B(x - 2)`,
                note: { tr: "Her iki tarafı (x − 2)(x + 1) ile çarparak paydalardan kurtulduk.", en: "Multiply both sides by (x − 2)(x + 1) to clear denominators." },
              },
              {
                expr: R`x = 2 \Rightarrow 9 = 3A \Rightarrow A = 3; \qquad x = -1 \Rightarrow -6 = -3B \Rightarrow B = 2`,
                note: { tr: "Akıllı hamle: x = 2 yazınca B terimi sıfırlanır; x = −1 yazınca A terimi sıfırlanır!", en: "Clever trick: x = 2 zeroes out B immediately, and x = −1 zeroes out A!" },
              },
              {
                expr: R`\int \left(\frac{3}{x - 2} + \frac{2}{x + 1}\right)dx = 3\ln|x - 2| + 2\ln|x + 1| + C`,
                note: { tr: "Her parça artık doğrudan logaritma kuralıyla integre edilir.", en: "Each term integrates instantly to a natural logarithm." },
              },
            ],
            answer: { tr: R`\(3\ln|x - 2| + 2\ln|x + 1| + C\)`, en: R`\(3\ln|x - 2| + 2\ln|x + 1| + C\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "Payın derecesi paydadan büyük veya eşitse hemen ayırmaya kalkmayın!", en: "Always check degree(numerator) < degree(denominator) first!" },
            text: {
              tr: R`Basit kesirler yalnızca <b>basit (öz) kesirlerde</b> (\(\deg P < \deg Q\)) geçerlidir. Örneğin \(\frac{x^2 + 1}{x^2 - 1}\) için önce polinom bölmesiyle \(1 + \frac{2}{x^2 - 1}\) yazmalı, sonra kalan kesri ayırmalısınız!`,
              en: R`Partial fractions only works on <b>proper fractions</b> (\(\deg P < \deg Q\)). For \(\frac{x^2 + 1}{x^2 - 1}\), do polynomial long division first to get \(1 + \frac{2}{x^2 - 1}\), then split the proper remainder!`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Üç rasyonel fonksiyondan birini seçip paydanın köklerinde (dikey kesikli asimptotlar) hem \(f(x)\)'in hem \(F(x)\)'in nasıl sonsuza sıçradığını görün.`, en: R`Pick one of the three rational functions and notice how both \(f(x)\) and \(F(x)\) blow up at the denominator's roots (dashed vertical asymptotes).` },
            { tr: R`Asimptot dışındaki bir \(x_0\) noktası seçip \(F'(x_0) = f(x_0)\) sayısal sağlamasının kesin tuttuğunu görün!`, en: R`Move \(x_0\) away from the poles and verify that \(F'(x_0) = f(x_0)\) matches to 4 decimal places!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.pf ??= { ex: "ex1", x0: 2.6 });
        const examples = {
          ex1: {
            label: "2/(x²−1)",
            decomp: R`\frac{2}{x^2 - 1} = \frac{1}{x - 1} - \frac{1}{x + 1}`,
            res: R`F(x) = \ln|x - 1| - \ln|x + 1| + C = \ln\!\left|\frac{x - 1}{x + 1}\right| + C`,
            f: (x) => 2 / (x * x - 1),
            F: (x) => Math.log(Math.abs((x - 1) / (x + 1))),
            poles: [-1, 1],
          },
          ex2: {
            label: "(5x−1)/((x−2)(x+1))",
            decomp: R`\frac{5x - 1}{(x - 2)(x + 1)} = \frac{3}{x - 2} + \frac{2}{x + 1}`,
            res: R`F(x) = 3\ln|x - 2| + 2\ln|x + 1| + C`,
            f: (x) => (5 * x - 1) / ((x - 2) * (x + 1)),
            F: (x) => 3 * Math.log(Math.abs(x - 2)) + 2 * Math.log(Math.abs(x + 1)),
            poles: [-1, 2],
          },
          ex3: {
            label: "2/(x(x+2))",
            decomp: R`\frac{2}{x(x + 2)} = \frac{1}{x} - \frac{1}{x + 2}`,
            res: R`F(x) = \ln|x| - \ln|x + 2| + C = \ln\!\left|\frac{x}{x + 2}\right| + C`,
            f: (x) => 2 / (x * (x + 2)),
            F: (x) => Math.log(Math.abs(x / (x + 2))),
            poles: [-2, 0],
          },
        };
        const ctl = h("div", { class: "t-controls" });
        const out = h("div", { class: "m-widget-out" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, out, host, calc);
        const plot = createCanvas2D(host, { height: 220 });

        const draw = () => {
          const ex = examples[s.ex];
          out.replaceChildren(
            h("div", { class: "m-eq", text: `\\(\\displaystyle ${ex.decomp}\\)` }),
            h("div", { class: "m-eq", text: `\\(\\displaystyle ${ex.res}\\)` }),
          );
          const nearPole = ex.poles.some((p) => Math.abs(s.x0 - p) < 0.16);
          const x0 = nearPole ? s.x0 + 0.25 : s.x0;
          const yF = ex.F(x0);
          const yf = ex.f(x0);
          const dF = numDiff(ex.F, x0);
          plot.draw({
            x: [-3.5, 4], y: [-5, 6], xLabel: "x", yLabel: "y",
            lines: ex.poles.map((p) => ({ a: 1, b: 0, c: -p, color: COLORS.bad, dash: [4, 4], width: 1.4 })),
            curves: [
              { f: ex.f, color: COLORS.c2, width: 2, dash: [5, 4] },
              { f: ex.F, color: COLORS.c1, width: 2.6 },
            ],
            points: [
              { x: x0, y: yF, color: COLORS.c1, r: 5.5, label: "F(x₀)" },
              { x: x0, y: yf, color: COLORS.c2, r: 5, label: "f(x₀)" },
            ],
          });
          calc.textContent = `\\(x_0 = ${tx(x0, 2)}:\\quad F'(${tx(x0, 2)}) = ${tx(dF, 4)},\\qquad f(${tx(x0, 2)}) = ${tx(yf, 4)}\\)`;
        };
        ctl.append(
          segmented(Object.entries(examples).map(([k, v]) => [k, v.label]), s.ex, (v) => { s.ex = v; draw(); }),
          slider("x₀", { min: -3, max: 3.6, step: 0.2, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } }),
        );
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Türev–İlkel Doğrulama Laboratuvarı", en: "Antiderivative Verification Studio" },
    sub: {
      tr: R`Klasik belirsiz integralleri canlı olarak keşfedin: integrandı \(f(x)\) (turuncu kesikli) ve ilkel fonksiyon \(F(x) + C\)'yi (mavi) aynı eksende izleyin; \(F(x) + C\) eğrisinin yeşil teğet eğiminin her noktada \(f(x_0)\)'a eşit olduğunu doğrulayın!`,
      en: R`Explore classic indefinite integrals live: plot the integrand \(f(x)\) (dashed orange) alongside \(F(x) + C\) (blue), and watch the green tangent slope of \(F(x) + C\) match \(f(x_0)\) at every single point!`,
    },
    experiments: [
      { tr: R`<b>"Temel: 1/(1+x²)"</b> önayarını seçip \(x_0 = 0\)'da \(f(0) = 1\) iken \(\arctan x\) eğrisinin tam \(45^\circ\) (eğim \(1\)) ile yükseldiğini görün.`, en: R`Click <b>"Basic: 1/(1+x²)"</b> and check \(x_0 = 0\): \(f(0) = 1\), so \(\arctan x\) crosses the origin at an exact \(45^\circ\) slope of \(1\).` },
      { tr: R`<b>\(C\)</b> kaydırıcısını \(-1{,}5\) ile \(+1{,}5\) arasında oynatın: \(F(x) + C\) değeri değişir ama sağdaki \(F'(x_0)\) kutucuğu milim kıpırdamaz!`, en: R`Slide <b>\(C\)</b> from \(-1.5\) to \(+1.5\): \(F(x) + C\) shifts up and down, yet the \(F'(x_0)\) readout never budges!` },
      { tr: R`<b>"Kısmi İnt.: ln x"</b> önayarında \(x_0 = 1\) seçin: \(\ln(1) = 0\) olduğu için \(F(x) = x\ln x - x\) eğrisinin tam \(x = 1\)'de yatay teğet (minimum!) yaptığını yakalayın!`, en: R`Pick <b>"By Parts: ln x"</b> at \(x_0 = 1\): because \(\ln(1) = 0\), \(F(x) = x\ln x - x\) hits a horizontal tangent (minimum!) right at \(x = 1\)!` },
      { tr: R`<b>"u-Dönüşümü: 2x cos(x²)"</b> seçip \(x_0\)'ı kaydırın: \(f(x) > 0\) olduğu her aralıkta \(F(x)\)'in yükseldiğini, \(f(x) < 0\) olduğunda ise düştüğünü gözlemleyin.`, en: R`Try <b>"u-Sub: 2x cos(x²)"</b> and sweep \(x_0\): whenever \(f(x) > 0\), \(F(x)\) climbs; whenever \(f(x) < 0\), \(F(x)\) falls.` },
    ],
    build(host, state) {
      const s = (state.pg ??= { ex: "atan", C: 0, x0: 1 });
      const items = {
        atan: { label: "1/(1+x²)", f: (x) => 1 / (1 + x * x), F: (x) => Math.atan(x), name: "\\arctan x", xr: [-3.5, 3.5], yr: [-2.6, 2.8] },
        xlnx: { label: "ln(x)", f: (x) => (x > 0 ? Math.log(x) : NaN), F: (x) => (x > 0 ? x * Math.log(x) - x : NaN), name: "x\\ln x - x", xr: [-0.2, 4.5], yr: [-2.6, 3.2] },
        sin2: { label: "sin(2x)", f: (x) => Math.sin(2 * x), F: (x) => -0.5 * Math.cos(2 * x), name: "-\\tfrac{1}{2}\\cos(2x)", xr: [-3.5, 3.5], yr: [-2.4, 2.4] },
        cosx2: { label: "2x cos(x²)", f: (x) => 2 * x * Math.cos(x * x), F: (x) => Math.sin(x * x), name: "\\sin(x^2)", xr: [-2.4, 2.4], yr: [-4.2, 4.2] },
        xexp: { label: "x e⁻ˣ/²", f: (x) => x * Math.exp(-0.5 * x), F: (x) => -2 * (x + 2) * Math.exp(-0.5 * x), name: "-2(x+2)e^{-x/2}", xr: [-1.5, 5], yr: [-4.8, 2.6] },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 390 });
      const presets = h("div", { class: "t-controls" });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      side.append(presets, ctl, ctl2, tiles, calc);

      let segCtrl, cSlider, xSlider;

      const draw = () => {
        const cur = items[s.ex];
        const x0 = s.ex === "xlnx" ? Math.max(0.25, s.x0) : Math.max(cur.xr[0] + 0.3, Math.min(cur.xr[1] - 0.3, s.x0));
        const yF = cur.F(x0) + s.C;
        const yf = cur.f(x0);
        const dF = numDiff(cur.F, x0);
        plot.draw({
          x: cur.xr,
          y: cur.yr,
          xLabel: "x",
          yLabel: "y",
          curves: [
            { f: cur.f, color: COLORS.c2, width: 2.2, dash: [5, 4] },
            { f: (x) => cur.F(x) + s.C, color: COLORS.c1, width: 2.8 },
          ],
          lines: [
            { a: dF, b: -1, c: yF - dF * x0, color: COLORS.c3, width: 2, dash: [3, 3] },
          ],
          points: [
            { x: x0, y: yf, color: COLORS.c2, r: 5, label: "f(x₀)" },
            { x: x0, y: yF, color: COLORS.c1, r: 5.5, ring: true, label: "F(x₀)+C" },
          ],
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "f(x₀)" }), h("span", { class: "pg-tile-value", text: ns(yf, 4) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "F'(x₀)" }), h("span", { class: "pg-tile-value", text: ns(dF, 4) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Fark", en: "Diff" }) }), h("span", { class: "pg-tile-value", text: ns(Math.abs(dF - yf), 6) })),
        );
        calc.textContent = `\\(F(x)+C = ${cur.name} ${s.C >= 0 ? "+" : "-"} ${tx(Math.abs(s.C), 2)},\\qquad F'(${tx(x0, 2)}) = f(${tx(x0, 2)}) = ${tx(yf, 3)}\\)`;
      };

      const applyPreset = (ex, C, x0) => {
        s.ex = ex;
        s.C = C;
        s.x0 = x0;
        segCtrl.set(ex);
        cSlider.set(C);
        xSlider.set(x0);
        draw();
      };

      const presetDefs = [
        [{ tr: "Temel: 1/(1+x²)", en: "Basic: 1/(1+x²)" }, "atan", 0, 0],
        [{ tr: "Kısmi İnt.: ln x", en: "By Parts: ln x" }, "xlnx", 0, 1],
        [{ tr: "u-Dön.: 2x cos(x²)", en: "u-Sub: 2x cos(x²)" }, "cosx2", 0.5, 1.2],
        [{ tr: "Sınav: x e⁻ˣ/²", en: "Exam: x e⁻ˣ/²" }, "xexp", 1, 2],
      ];
      for (const [lbl, ex, C, x0] of presetDefs) {
        const b = h("button", { type: "button", class: "btn small", text: L(lbl) });
        b.addEventListener("click", () => applyPreset(ex, C, x0));
        presets.append(b);
      }

      segCtrl = segmented(Object.entries(items).map(([k, v]) => [k, v.label]), s.ex, (v) => { s.ex = v; draw(); });
      cSlider = slider("C", { min: -1.5, max: 1.5, step: 0.25, value: s.C, onInput: (v) => { s.C = v; draw(); } });
      xSlider = slider("x₀", { min: -2.2, max: 3.2, step: 0.2, value: s.x0, onInput: (v) => { s.x0 = v; draw(); } });
      ctl.append(segCtrl);
      ctl2.append(cSlider, xSlider);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-ii-table",
      title: { tr: "Temel Belirsiz İntegraller Tablosu ve Doğrusallık", en: "Elementary Indefinite Integrals & Linearity" },
      blocks: [
        {
          p: {
            tr: R`Belirsiz integral <b>doğrusal</b> bir işlemdir: sabitler dışarı çıkar ve toplamlar ayrı ayrı integre edilir: \(\int [\alpha f(x) + \beta g(x)]\,dx = \alpha\int f(x)\,dx + \beta\int g(x)\,dx\). Aşağıdaki temel tablo tüm ileri tekniklerin yapı taşlarıdır:`,
            en: R`Indefinite integration is <b>linear</b>: constants pull out and sums split apart: \(\int [\alpha f(x) + \beta g(x)]\,dx = \alpha\int f(x)\,dx + \beta\int g(x)\,dx\). Every advanced method reduces integrals down to this core table:`,
          },
        },
        {
          table: {
            head: [{ tr: "İntegral", en: "Integral" }, { tr: "İlkel Fonksiyon", en: "Antiderivative" }, { tr: "Not / Koşul", en: "Note / Condition" }],
            rows: [
              [R`\(\int x^n\,dx\)`, R`\(\dfrac{x^{n+1}}{n+1} + C\)`, R`\(n \ne -1\)`],
              [R`\(\int \dfrac{1}{x}\,dx\)`, R`\(\ln|x| + C\)`, R`\(x \ne 0\)`],
              [R`\(\int e^{ax}\,dx\)`, R`\(\dfrac{1}{a}e^{ax} + C\)`, R`\(a \ne 0\)`],
              [R`\(\int \sin(ax)\,dx,\; \int \cos(ax)\,dx\)`, R`\(-\dfrac{1}{a}\cos(ax)+C,\; \dfrac{1}{a}\sin(ax)+C\)`, { tr: "İşaretlere dikkat!", en: "Watch the minus sign!" }],
              [R`\(\int \dfrac{1}{a^2 + x^2}\,dx\)`, R`\(\dfrac{1}{a}\arctan\!\left(\dfrac{x}{a}\right) + C\)`, R`\(a > 0\)`],
              [R`\(\int \dfrac{1}{\sqrt{a^2 - x^2}}\,dx\)`, R`\(\arcsin\!\left(\dfrac{x}{a}\right) + C\)`, R`\(|x| < a\)`],
              [R`\(\int \ln x\,dx\)`, R`\(x\ln x - x + C\)`, { tr: "Kısmi integrasyonla", en: "Via by parts" }],
            ],
          },
        },
        {
          example: {
            title: { tr: "Köklü ve kesirli kuvvetleri tek hamlede integre etmek", en: "Integrating roots and negative powers" },
            problem: {
              tr: R`\(\int \left(3\sqrt{x} - \frac{2}{x^2}\right)dx\) integralini hesaplayın.`,
              en: R`Evaluate \(\int \left(3\sqrt{x} - \frac{2}{x^2}\right)dx\).`,
            },
            steps: [
              {
                expr: R`\int \left(3x^{1/2} - 2x^{-2}\right)dx`,
                note: { tr: "Önce kökü ve paydadaki x²'yi üslü biçimde yazın — böylece tek kural yeter!", en: "Rewrite roots and fractions as powers of x first so one rule handles everything!" },
              },
              {
                expr: R`= 3\cdot\frac{x^{3/2}}{3/2} - 2\cdot\frac{x^{-1}}{-1} + C = 2x^{3/2} + \frac{2}{x} + C`,
                note: { tr: "1/2 + 1 = 3/2 ve −2 + 1 = −1; iki eksi birbirini artı yapar!", en: "1/2 + 1 = 3/2 and −2 + 1 = −1; the two minuses cancel to a plus!" },
              },
            ],
            answer: { tr: R`\(2x\sqrt{x} + \frac{2}{x} + C\)`, en: R`\(2x\sqrt{x} + \frac{2}{x} + C\)` },
          },
        },
        {
          callout: "warn",
          title: { tr: "Çarpım ve bölümde doğrudan dağılma YOKTUR!", en: "Integrals do NOT split across products or quotients!" },
          text: {
            tr: R`\(\int f(x)g(x)\,dx \ne \left(\int f\right)\left(\int g\right)\)! Örneğin \(\int x\cdot x\,dx = \frac{x^3}{3}\), oysa \(\left(\frac{x^2}{2}\right)\left(\frac{x^2}{2}\right) = \frac{x^4}{4}\). Çarpımlar için \(u\)-dönüşümü veya kısmi integrasyon gerekir.`,
            en: R`\(\int f(x)g(x)\,dx \ne \left(\int f\right)\left(\int g\right)\)! For example \(\int x\cdot x\,dx = \frac{x^3}{3}\), whereas \(\left(\frac{x^2}{2}\right)^2 = \frac{x^4}{4}\). Products require \(u\)-substitution or integration by parts.`,
          },
        },
      ],
    },
    {
      id: "m-ii-usub",
      title: { tr: "Değişken Değiştirme (u-Dönüşümü) İspatı", en: "Proof of u-Substitution" },
      blocks: [
        {
          derive: {
            title: { tr: "Zincir Kuralı → u-Dönüşümü", en: "Chain Rule → u-Substitution" },
            steps: [
              {
                tex: R`F'(u) = f(u) \quad \text{olsun / suppose}`,
                why: { tr: "Önce dıştaki f fonksiyonunun bir ilkel fonksiyonuna F diyelim.", en: "Let F be an antiderivative of the outer function f." },
              },
              {
                tex: R`\frac{d}{dx}\Big[F\big(g(x)\big)\Big] = F'\big(g(x)\big)\cdot g'(x) = f\big(g(x)\big)\,g'(x)`,
                why: { tr: "Zincir Kuralı ile F(g(x)) bileşkesinin türevini alırız.", en: "Differentiate the composition F(g(x)) using the Chain Rule." },
              },
              {
                tex: R`\int f\big(g(x)\big)\,g'(x)\,dx = F\big(g(x)\big) + C = \left.\int f(u)\,du\,\right|_{u = g(x)}`,
                why: { tr: "İki tarafın belirsiz integralini aldığımızda, u = g(x) ve du = g'(x) dx koymanın neden birebir doğru sonuç verdiği kanıtlanır!", en: "Integrating both sides proves why setting u = g(x) and du = g'(x) dx gives the exact antiderivative!" },
              },
            ],
          },
        },
        {
          example: {
            title: { tr: "Payda türevi payda: logaritmik desen ∫ g'(x)/g(x) dx", en: "The logarithmic pattern ∫ g'(x)/g(x) dx" },
            problem: {
              tr: R`\(\int \tan x\,dx\) integralini \(u\)-dönüşümüyle bulun.`,
              en: R`Find \(\int \tan x\,dx\) via \(u\)-substitution.`,
            },
            steps: [
              {
                expr: R`\int \tan x\,dx = \int \frac{\sin x}{\cos x}\,dx`,
                note: { tr: "Tanjantı sin x / cos x olarak açınca paydanın türevi (−sin x) payda hazır duruyor!", en: "Rewriting tan x as sin x / cos x reveals the denominator's derivative (−sin x) right in the numerator!" },
              },
              {
                expr: R`u = \cos x \implies du = -\sin x\,dx \implies \sin x\,dx = -du`,
                note: { tr: "Paydaya u dedik ve eksi işaretini du tarafına geçirdik.", en: "Set u = cos x and move the minus sign onto du." },
              },
              {
                expr: R`= -\int \frac{du}{u} = -\ln|u| + C = -\ln|\cos x| + C = \ln|\sec x| + C`,
                note: { tr: "İşte ünlü tanjant integralinin sırrı!", en: "That is the secret behind the integral of tangent!" },
              },
            ],
            answer: { tr: R`\(-\ln|\cos x| + C\)`, en: R`\(-\ln|\cos x| + C\)` },
          },
        },
      ],
    },
    {
      id: "m-ii-parts",
      title: { tr: "Kısmi İntegrasyonun İspatı ve Özel Taktikler", en: "Proof of Integration by Parts & Special Tactics" },
      blocks: [
        {
          derive: {
            title: { tr: "Çarpım Kuralı → Kısmi İntegrasyon", en: "Product Rule → Integration by Parts" },
            steps: [
              {
                tex: R`\frac{d}{dx}\big[u(x)\,v(x)\big] = u'(x)\,v(x) + u(x)\,v'(x)`,
                why: { tr: "İki türevlenebilir fonksiyonun çarpım kuralıyla başlarız.", en: "Start from the product rule for two differentiable functions." },
              },
              {
                tex: R`u(x)\,v(x) = \int v(x)\,u'(x)\,dx + \int u(x)\,v'(x)\,dx`,
                why: { tr: "Her iki tarafın x'e göre belirsiz integralini alırız.", en: "Integrate both sides with respect to x." },
              },
              {
                tex: R`\int u(x)\,v'(x)\,dx = u(x)\,v(x) - \int v(x)\,u'(x)\,dx`,
                why: { tr: "İstediğimiz integrali yalnız bırakırız.", en: "Isolate the target integral on the left." },
              },
              {
                tex: R`\int u\,dv = u v - \int v\,du`,
                why: { tr: "Kısa diferansiyel gösterimle du = u'(x)dx ve dv = v'(x)dx yazınca ünlü formül ortaya çıkar!", en: "Writing du = u'(x)dx and dv = v'(x)dx yields the compact formula!" },
              },
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Döngüsel kısmi integrasyon (∫ eˣ sin x dx)", en: "Boomerang / cyclic by parts (∫ eˣ sin x dx)" },
          text: {
            tr: R`\(I = \int e^x \sin x\,dx\) gibi iki tarafın da türevle bitmediği sorularda kısmi integrasyonu <b>iki kez üst üste</b> uygularsanız sağda tekrar \(-I\) çıkar! Onu sola atıp \(2I = e^x(\sin x - \cos x)\) diyerek \(I\)'yı kolayca çekebilirsiniz.`,
            en: R`When neither factor vanishes (like \(I = \int e^x \sin x\,dx\)), apply by parts <b>twice</b> until \(-I\) reappears on the right! Move it left to get \(2I = e^x(\sin x - \cos x)\) and divide by 2.`,
          },
        },
      ],
    },
    {
      id: "m-ii-partial",
      title: { tr: "Basit Kesirlere Ayırma Şablonları ve Kapatma Kısayolu", en: "Partial Fractions Templates & Cover-Up Shortcut" },
      blocks: [
        {
          table: {
            head: [{ tr: "Paydadaki çarpan", en: "Denominator factor" }, { tr: "Basit kesir şablonu", en: "Partial fraction template" }],
            rows: [
              [{ tr: R`Farklı doğrusal: \((x-a)(x-b)\)`, en: R`Distinct linear: \((x-a)(x-b)\)` }, R`\(\dfrac{A}{x-a} + \dfrac{B}{x-b}\)`],
              [{ tr: R`Katlı doğrusal: \((x-a)^2\)`, en: R`Repeated linear: \((x-a)^2\)` }, R`\(\dfrac{A}{x-a} + \dfrac{B}{(x-a)^2}\)`],
              [{ tr: R`İndirgenemez kuadratik: \(x^2 + k^2\)`, en: R`Irreducible quadratic: \(x^2 + k^2\)` }, R`\(\dfrac{Ax + B}{x^2 + k^2}\)`],
            ],
          },
        },
        {
          derive: {
            title: { tr: "Heaviside Kapatma (Cover-Up) Kısayolu", en: "Heaviside Cover-Up Shortcut" },
            steps: [
              {
                tex: R`\frac{P(x)}{(x - a)(x - b)} = \frac{A}{x - a} + \frac{B}{x - b} \quad (a \ne b)`,
                why: { tr: "Farklı iki doğrusal kökü olan öz kesirle başlıyoruz.", en: "Start with a proper fraction having two distinct linear roots." },
              },
              {
                tex: R`\frac{P(x)}{x - b} = A + B\frac{x - a}{x - b}`,
                why: { tr: "Her iki tarafı (x − a) ile çarparız (sanki soldaki (x − a) çarpanını parmağımızla kapattık!).", en: "Multiply both sides by (x − a) — visually covering up (x − a) on the left!" },
              },
              {
                tex: R`x = a \implies A = \frac{P(a)}{a - b}, \qquad \text{benzer şekilde / similarly } B = \frac{P(b)}{b - a}`,
                why: { tr: "x = a yazınca B terimi sıfırlanır ve A doğrudan tek satırda çıkar!", en: "Setting x = a kills the B term and gives A in one line!" },
              },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
