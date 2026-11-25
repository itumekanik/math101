import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { cAdd, cArg, cConj, cDiv, cFromPolar, cMod, cMul, cNthRoots, cPow } from "../../engines/math-core.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "cx-intro",
    title: { tr: "Karmaşık Sayılar, Euler Formülü ve Birimin Kökleri", en: "Complex Numbers, Euler's Formula & n-th Roots" },
    paragraphs: [
      {
        tr: R`Reel sayı doğrusunda her sayının karesi sıfır veya pozitiftir; bu yüzden \(x^2 + 1 = 0\) denkleminin orada çözümü yoktur. \(i^2 = -1\) özelliğini sağlayan <b>sanal birim \(i\)</b>'yi tanımladığımızda 1 boyutlu sayı doğrusundan çıkıp 2 boyutlu <b>Argand (karmaşık) düzlemine</b> adım atarız! Bir [[complex-number|karmaşık sayı]] \(z = a + bi\) biçiminde yazılır: \(a = \operatorname{Re}(z)\) yatay (reel) koordinat, \(b = \operatorname{Im}(z)\) dikey (sanal) koordinat, \(|z| = \sqrt{a^2 + b^2}\) orijine uzaklık ([[modulus-arg|modül]]) ve \(\theta = \arg(z)\) pusula açısıdır (argüman).`,
        en: R`On the 1D real line every square is nonnegative, leaving \(x^2 + 1 = 0\) unsolvable. Defining the <b>imaginary unit \(i\)</b> with \(i^2 = -1\) lifts us off the line into the 2D <b>Argand (complex) plane</b>! Every [[complex-number|complex number]] \(z = a + bi\) plots as \((a, b)\): \(a = \operatorname{Re}(z)\) is the horizontal (real) part, \(b = \operatorname{Im}(z)\) is the vertical (imaginary) part, \(|z| = \sqrt{a^2 + b^2}\) is the distance from the origin ([[modulus-arg|modulus]]), and \(\theta = \arg(z)\) is the compass angle (argument).`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> \(i\) ile çarpmanın neden tam \(90^\circ\) dönüş olduğunu görecek, eşlenik \(\bar z\) ile bölme yapacak, [[euler-formula|Euler formülü]] \(e^{i\theta} = \cos\theta + i\sin\theta\) ile çarpma/kuvvet işlemlerini saniyelere indirecek ve \(z^n = w\) denkleminin \(n\) kökünü düzgün \(n\)-gen olarak çizebileceksiniz!`,
        en: R`<b>By the end of this chapter</b> you will see why multiplying by \(i\) rotates by \(90^\circ\), divide cleanly using conjugates \(\bar z\), unify exponentials and trigonometry through [[euler-formula|Euler's formula]] \(e^{i\theta} = \cos\theta + i\sin\theta\), and plot all \(n\) roots of \(z^n = w\) as a regular \(n\)-gon!`,
      },
    ],
    analogy: {
      title: { tr: "1B sayı doğrusundan 2B pusulaya çıkmak: çarpmak artık döndürmektir!", en: "Stepping off the 1D road onto a 2D compass: multiplication is rotation!" },
      text: {
        tr: R`Sayı doğrusunda \(-1\) ile çarpmak sizi tam \(180^\circ\) ters yöne çevirir. Peki <em>"kendi kendisiyle iki kez yapıldığında \(180^\circ\) dönme veren hareket nedir?"</em> Cevap apaçık: <b>\(90^\circ\) saat yönünün tersine dönmek!</b> İşte \(i\) sayısı hiçbir "hayali büyü" değil, tam olarak \(90^\circ\) çeyrek dönüş operatörüdür: bir kez \(\times i\) sizi kuzeye çevirir, iki kez \(\times i\) (\(= i^2\)) tam \(180^\circ\) batıya (\(-1\)'e) getirir!`,
        en: R`On the real line, multiplying by \(-1\) flips you \(180^\circ\) backwards. So asking <em>"what action performed TWICE gives a \(180^\circ\) flip?"</em> has an obvious geometric answer: <b>a \(90^\circ\) counterclockwise turn!</b> The number \(i\) isn't mystical at all — it is literally a quarter-turn: once (\(\times i\)) turns East into North, twice (\(\times i^2\)) lands at West (\(-1\))!`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 21 · Karmaşık Sayılar", en: "Lecture 21 · Complex Numbers" }],
      [{ tr: "Kartez. ↔ Euler", en: "Rect. ↔ Euler" }, { tr: R`\(z = a + bi = r(\cos\theta + i\sin\theta) = r e^{i\theta}\)`, en: R`\(z = a + bi = r(\cos\theta + i\sin\theta) = r e^{i\theta}\)` }],
      [{ tr: "De Moivre & Kökler", en: "De Moivre & Roots" }, { tr: R`\(z^n = r^n e^{i n\theta},\quad z_k = R^{1/n} e^{i(\varphi + 2\pi k)/n}\)`, en: R`\(z^n = r^n e^{i n\theta},\quad z_k = R^{1/n} e^{i(\varphi + 2\pi k)/n}\)` }],
    ],
    tip: {
      title: { tr: "Hangi biçimi ne zaman kullanmalı?", en: "Which form to pick for each job?" },
      text: {
        tr: R`<b>Toplama ve çıkarma</b> için kartezyen biçim \(a + bi\) çok kolaydır. <b>Çarpma, bölme, yüksek kuvvet alma ve kök bulma</b> içinse mutlaka kutupsal/Euler biçimi \(r e^{i\theta}\) kullanın — 10 satırlık cebiri 1 satıra indirir!`,
        en: R`Use rectangular form \(a + bi\) for <b>addition and subtraction</b>. Switch to polar/Euler form \(r e^{i\theta}\) for <b>multiplication, division, high powers, and roots</b> — it turns 10 lines of algebra into 1!`,
      },
    },
  },
  sections: [
    {
      id: "cx-argand",
      mathId: "m-cx-arith",
      title: { tr: "Neden i² = −1? Argand Düzlemi ve 90° Dönüş", en: "Why i² = −1? The Argand Plane & 90° Rotation" },
      body: [
        {
          tr: R`Her karmaşık sayı \(z = a + bi\), yatay ekseni <b>Reel (\(\operatorname{Re}\))</b> ve dikey ekseni <b>Sanal (\(\operatorname{Im}\))</b> olan 2B Argand düzleminde \((a, b)\) vektörü olarak yaşar. Herhangi bir \(z = a + bi\) sayısını \(i\) ile çarptığınızda: \(i(a + bi) = ai + bi^2 = -b + ai\) elde edilir — bu, uzunluğu hiç değiştirmeden vektörü tam <b>\(90^\circ\) saat yönünün tersine</b> döndürür!`,
          en: R`Every complex number \(z = a + bi\) lives as a 2D vector \((a, b)\) on the Argand plane (horizontal <b>Real</b> axis, vertical <b>Imaginary</b> axis). Multiplying any \(z = a + bi\) by \(i\) gives \(i(a + bi) = -b + ai\) — an exact <b>\(90^\circ\) counterclockwise rotation</b> with zero change in length!`,
        },
        {
          analogy: {
            title: { tr: "Pusulada dört çeyrek turda başladığın yere dönmek", en: "Four quarter-turns on a compass bring you right back home" },
            text: {
              tr: R`\(i\)'nin kuvvetleri sonsuza kadar 4'lü bir döngü yapar: Doğu (\(i^0 = 1\)) → Kuzey (\(i^1 = i\)) → Batı (\(i^2 = -1\)) → Güney (\(i^3 = -i\)) → tekrar Doğu (\(i^4 = 1\))! Büyük bir \(i^n\) kuvvetini bulmak için \(n\)'yi \(4\)'e bölüp sadece <b>kalana</b> bakmak yeterlidir!`,
              en: R`Powers of \(i\) repeat in a clean 4-cycle: East (\(i^0 = 1\)) → North (\(i^1 = i\)) → West (\(i^2 = -1\)) → South (\(i^3 = -i\)) → East (\(i^4 = 1\))! To simplify any huge power \(i^n\), just divide \(n\) by \(4\) and keep the <b>remainder</b>!`,
            },
          },
        },
        { eq: R`i^1 = i,\quad i^2 = -1,\quad i^3 = -i,\quad i^4 = 1, \qquad |a + bi| = \sqrt{a^2 + b^2}` },
        {
          example: {
            title: { tr: "Büyük kuvvet i²³ ve modül |3 − 4i| hesabı", en: "Computing i²³ and the modulus |3 − 4i|" },
            problem: {
              tr: R`(a) \(i^{23}\) sayısını sadeleştirin. (b) \(z = 3 - 4i\) sayısının modülü \(|z|\)'yi ve \(i\cdot z\) dönüşünü bulun.`,
              en: R`(a) Simplify \(i^{23}\). (b) Find the modulus \(|z|\) and \(90^\circ\)-rotated \(i\cdot z\) for \(z = 3 - 4i\).`,
            },
            steps: [
              {
                expr: R`23 = 4\cdot 5 + 3 \implies i^{23} = (i^4)^5\cdot i^3 = 1^5\cdot(-i) = -i`,
                note: { tr: "23'ün 4 ile bölümünden kalan 3 olduğu için i²³ = i³ = −i!", en: "23 leaves remainder 3 mod 4, so i²³ = i³ = −i!" },
              },
              {
                expr: R`|3 - 4i| = \sqrt{3^2 + (-4)^2} = \sqrt{9 + 16} = \sqrt{25} = 5`,
                note: { tr: "3–4–5 dik üçgeni! Modül daima ≥ 0 olan gerçek bir uzunluktur.", en: "A 3–4–5 right triangle! Modulus is always a nonnegative real length." },
              },
              {
                expr: R`i(3 - 4i) = 3i - 4i^2 = 4 + 3i \qquad \big(|4 + 3i| = 5,\; 90^\circ \text{ döndü!}\big)`,
                note: { tr: "(3, −4) vektörü tam 90° dönerek (4, 3) oldu; uzunluğu hâlâ 5!", en: "Vector (3, −4) rotated exactly 90° CCW to (4, 3) with the exact same length 5!" },
              },
            ],
            answer: { tr: R`\(i^{23} = -i\), \(|z| = 5\), \(iz = 4 + 3i\)`, en: R`\(i^{23} = -i\), \(|z| = 5\), \(iz = 4 + 3i\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "Im(3 − 4i) sayısı −4i değil, sadece −4'tür!", en: "Im(3 − 4i) is −4, NOT −4i!" },
            text: {
              tr: R`Bir karmaşık sayının sanal kısmı \(\operatorname{Im}(a + bi) = b\) bir <b>reel sayıdır</b> (\(i\) harfini içermez!). Benzer şekilde modül hesaplarken asla \(\sqrt{3^2 + (-4i)^2}\) yazmayın — doğrusu daima \(\sqrt{a^2 + b^2}\)'dir.`,
              en: R`The imaginary part \(\operatorname{Im}(a + bi) = b\) is a <b>real number</b> (never include \(i\)!). Likewise never write \(\sqrt{3^2 + (-4i)^2}\) for modulus — it is always \(\sqrt{a^2 + b^2}\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`Mavi <b>\(z\)</b> ucunu düzlemde sürükleyin ve <b>"× i (90° döndür)"</b> tuşuna arka arkaya 4 kez basın: vektörün çember üzerinde tam 4 dik adımda başladığı yere döndüğünü görün!`, en: R`Drag blue <b>\(z\)</b> around the plane and click <b>"× i (rotate 90°)"</b> 4 times in a row: watch it march around the circle in four \(90^\circ\) steps right back to \(z\)!` },
            { tr: R`\(z\)'yi pozitif reel eksen üzerine \((2, 0)\) sürükleyip \(i^1, i^2, i^3\) tuşlarına basın: \(2 \to 2i \to -2 \to -2i\) döngüsünü gözlemleyin.`, en: R`Drag \(z\) onto \((2, 0)\) and cycle \(i^1, i^2, i^3\) to verify \(2 \to 2i \to -2 \to -2i\).` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.arg ??= { z: { re: 2.0, im: 0.8 }, k: 1 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 280,
          interactive: true,
          hint: L({ tr: "z ucunu sürükleyin", en: "Drag z tip" }),
        });

        const mulIk = (z, k) => {
          const m = ((k % 4) + 4) % 4;
          if (m === 0) return { re: z.re, im: z.im };
          if (m === 1) return { re: -z.im, im: z.re };
          if (m === 2) return { re: -z.re, im: -z.im };
          return { re: z.im, im: -z.re };
        };

        let segCtrl;
        const draw = () => {
          const r = cMod(s.z);
          const rot = mulIk(s.z, s.k);
          const all4 = [0, 1, 2, 3].map((j) => mulIk(s.z, j));
          const th0 = cArg(s.z);
          const th1 = th0 + s.k * (Math.PI / 2);
          const kLabel = ["z", "i·z", "i²·z = −z", "i³·z = −iz"][s.k];
          plot.draw({
            x: [-3.5, 3.5], y: [-3.5, 3.5], equalAspect: true, xLabel: "Re", yLabel: "Im",
            circles: [{ cx: 0, cy: 0, r, stroke: COLORS.muted, dash: [5, 4] }],
            angles: s.k > 0 ? [{ cx: 0, cy: 0, r: Math.min(0.8, r * 0.45), start: th0, end: th1, color: COLORS.c2, label: `${s.k * 90}°` }] : [],
            vectors: [
              ...all4.map((v) => ({ to: [v.re, v.im], color: COLORS.grid, width: 1.5, dash: [3, 3] })),
              { to: [s.z.re, s.z.im], color: COLORS.c1, width: 2.6, label: "z" },
              ...(s.k > 0 ? [{ to: [rot.re, rot.im], color: COLORS.c2, width: 3, label: kLabel }] : []),
            ],
            handles: [
              { id: "z", x: s.z.re, y: s.z.im, color: COLORS.c1, onDrag: (x, y) => { s.z = { re: x, im: y }; draw(); } },
            ],
          });
          calc.textContent = `\\(z = ${tx(s.z.re, 1)} ${s.z.im >= 0 ? "+" : "-"} ${tx(Math.abs(s.z.im), 1)}i,\\quad i^{${s.k}}z = ${tx(rot.re, 1)} ${rot.im >= 0 ? "+" : "-"} ${tx(Math.abs(rot.im), 1)}i,\\quad |z| = ${tx(r, 2)}\\)`;
        };

        const stepBtn = h("button", { type: "button", class: "btn small primary", text: L({ tr: "× i (90° döndür)", en: "× i (rotate 90°)" }) });
        stepBtn.addEventListener("click", () => {
          s.k = (s.k + 1) % 4;
          segCtrl.set(String(s.k));
          draw();
        });
        segCtrl = segmented([["0", "i⁰·z"], ["1", "i¹·z (90°)"], ["2", "i²·z (180°)"], ["3", "i³·z (270°)"]], String(s.k), (v) => { s.k = Number(v); draw(); });
        ctl.append(segCtrl, stepBtn);
        draw();
      },
    },
    {
      id: "cx-mul",
      mathId: "m-cx-arith",
      title: { tr: "Karmaşık Aritmetik: Toplama, Çarpma ve Eşlenikle Bölme", en: "Complex Arithmetic: Adding, Multiplying & Dividing via Conjugate" },
      body: [
        {
          tr: R`Karmaşık düzlemde her aritmetik işlemin canlı bir geometrik anlamı vardır:<br>• <b>Toplama (\(z_1 + z_2\)):</b> Reel ve sanal kısımlar ayrı ayrı toplanır — geometrik olarak iki [[vector|vektörün]] paralelkenar toplamıdır!<br>• <b>Çarpma (\(z_1 z_2\)):</b> <b>Uzunluklar (modüller) çarpılır, açılar (argümanlar) toplanır!</b><br>• <b>Bölme (\(z_1 / z_2\)):</b> Paydayı reel yapmak için payı ve paydayı <b>karmaşık eşlenik</b> \(\bar z_2 = c - di\) ile çarparız çünkü \(z_2 \bar z_2 = c^2 + d^2 = |z_2|^2\) saf bir reel sayıdır!`,
          en: R`Every complex operation has a crisp geometric picture:<br>• <b>Addition (\(z_1 + z_2\)):</b> add real and imaginary parts separately — geometrically the [[vector|vector]] parallelogram rule!<br>• <b>Multiplication (\(z_1 z_2\)):</b> <b>multiply moduli (lengths) and add arguments (angles)!</b><br>• <b>Division (\(z_1 / z_2\)):</b> multiply top and bottom by the <b>complex conjugate</b> \(\bar z_2 = c - di\) so the denominator becomes a clean real number \(z_2\bar z_2 = c^2 + d^2 = |z_2|^2\)!`,
        },
        {
          analogy: {
            title: { tr: "Eşlenik z̄ = reel eksendeki ayna görüntüsü", en: "The conjugate z̄ = reflection across the real mirror" },
            text: {
              tr: R`\(z\) sayısının açısı \(+\theta\) ise reel eksendeki ayna görüntüsü \(\bar z\)'nin açısı \(-\theta\)'dır. İkisini çarptığınızda açılar birbirini sıfırlar (\(\theta - \theta = 0\)), böylece payda güvenle pozitif reel eksene iner!`,
              en: R`If \(z\) points at angle \(+\theta\), its mirror reflection \(\bar z\) points at \(-\theta\). Multiplying them cancels the angles (\(\theta - \theta = 0\)), pulling the denominator cleanly onto the positive real axis!`,
            },
          },
        },
        { eq: R`z_1 z_2 = (r_1 r_2)\,e^{i(\theta_1 + \theta_2)}, \qquad \frac{z_1}{z_2} = \frac{z_1\,\bar z_2}{|z_2|^2}` },
        {
          example: {
            title: { tr: "Karmaşık bölme: paydadaki i'den eşlenikle kurtulmak", en: "Complex division: clearing i from the denominator" },
            problem: {
              tr: R`\(\dfrac{3 + i}{1 - i}\) bölümünü \(a + bi\) standart biçiminde yazın.`,
              en: R`Express the quotient \(\dfrac{3 + i}{1 - i}\) in standard \(a + bi\) form.`,
            },
            steps: [
              {
                expr: R`\frac{3 + i}{1 - i}\cdot\frac{1 + i}{1 + i}`,
                note: { tr: "Paydanın (1 − i) eşleniği (1 + i) ile pay ve paydayı çarptık.", en: "Multiply numerator and denominator by the conjugate (1 + i) of (1 − i)." },
              },
              {
                expr: R`\text{Pay / Top: } (3 + i)(1 + i) = 3 + 3i + i + i^2 = 3 + 4i - 1 = 2 + 4i`,
                note: { tr: "Dağılma özelliğini uygulayıp i² = −1 yazdık.", en: "Expand carefully and substitute i² = −1." },
              },
              {
                expr: R`\text{Payda / Bottom: } (1 - i)(1 + i) = 1^2 + 1^2 = 2 \implies \frac{2 + 4i}{2} = 1 + 2i`,
                note: { tr: "Payda temiz bir 2 oldu; her terimi 2'ye böldük!", en: "The denominator simplifies to 2; divide both parts by 2!" },
              },
            ],
            answer: { tr: R`\(1 + 2i\)`, en: R`\(1 + 2i\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "(a + bi)(a − bi) = a² − b² değil, a² + b²'dir!", en: "(a + bi)(a − bi) equals a² + b², NOT a² − b²!" },
            text: {
              tr: R`İki kare farkını dikkatsizce uygulayıp \((1 - i)(1 + i) = 1 - 1 = 0\) yazmak çok yaygındır! Doğrusu: \(1^2 - i^2 = 1 - (-1) = 2\)'dir — \(z\bar z\) her zaman \(a^2 + b^2 \ge 0\) olur.`,
              en: R`Carelessly writing \((1 - i)(1 + i) = 1 - 1 = 0\) is a frequent slip! Because \(i^2 = -1\), we get \(1^2 - i^2 = 1 - (-1) = 2\) — \(z\bar z = a^2 + b^2\) is ALWAYS a sum of squares.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"Çarpma (z₁·z₂)"</b> modunda \(z_1\) ve \(z_2\) uçlarını sürükleyin: turuncu çarpım açısının tam \(\theta_1 + \theta_2\), uzunluğunun tam \(|z_1||z_2|\) olduğunu doğrulayın!`, en: R`In <b>"Multiply (z₁·z₂)"</b> mode, drag \(z_1\) and \(z_2\): watch the orange product's angle equal \(\theta_1 + \theta_2\) and its length equal \(|z_1||z_2|\)!` },
            { tr: R`<b>"Toplama (z₁+z₂)"</b> moduna geçip kesikli paralelkenarı görün; ardından <b>"Bölme (z₁/z₂)"</b> modunda yeşil kesikli eşlenik \(\bar z_2\) ile açının nasıl çıkarıldığını (\(\theta_1 - \theta_2\)) inceleyin!`, en: R`Switch to <b>"Add (z₁+z₂)"</b> to see the parallelogram rule, then <b>"Divide (z₁/z₂)"</b> to see the dashed conjugate \(\bar z_2\) and angle subtraction \(\theta_1 - \theta_2\)!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.mul ??= { mode: "mul", z1: { re: 1.5, im: 0.8 }, z2: { re: 0.6, im: 1.2 } });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "z₁ ve z₂ uçlarını sürükleyin", en: "Drag z₁ and z₂" }),
        });

        const draw = () => {
          const r1 = cMod(s.z1), r2 = Math.max(0.15, cMod(s.z2));
          const a1 = (cArg(s.z1) * 180) / Math.PI;
          const a2 = (cArg(s.z2) * 180) / Math.PI;
          const vectors = [
            { to: [s.z1.re, s.z1.im], color: COLORS.c1, label: "z₁" },
            { to: [s.z2.re, s.z2.im], color: COLORS.c3, label: "z₂" },
          ];
          const segments = [];
          if (s.mode === "add") {
            const sum = cAdd(s.z1, s.z2);
            segments.push(
              { from: [s.z1.re, s.z1.im], to: [sum.re, sum.im], color: COLORS.muted, dash: [4, 4] },
              { from: [s.z2.re, s.z2.im], to: [sum.re, sum.im], color: COLORS.muted, dash: [4, 4] },
            );
            vectors.push({ to: [sum.re, sum.im], color: COLORS.c2, width: 3, label: "z₁+z₂" });
            calc.textContent = `\\(z_1 + z_2 = (${tx(s.z1.re, 1)} + ${tx(s.z2.re, 1)}) + (${tx(s.z1.im, 1)} + ${tx(s.z2.im, 1)})i = ${tx(sum.re, 2)} ${sum.im >= 0 ? "+" : "-"} ${tx(Math.abs(sum.im), 2)}i\\)`;
          } else if (s.mode === "mul") {
            const prod = cMul(s.z1, s.z2);
            const rp = cMod(prod);
            const ap = (cArg(prod) * 180) / Math.PI;
            vectors.push({ to: [prod.re, prod.im], color: COLORS.c2, width: 3, label: "z₁z₂" });
            calc.textContent = `\\(|z_1|=${tx(r1, 2)}\\ (\\angle ${tx(a1, 0)}^\\circ),\\; |z_2|=${tx(r2, 2)}\\ (\\angle ${tx(a2, 0)}^\\circ) \\implies |z_1 z_2|=${tx(rp, 2)}\\ (\\angle ${tx(ap, 0)}^\\circ)\\)`;
          } else {
            const safeZ2 = cMod(s.z2) < 0.2 ? { re: 0.2, im: 0 } : s.z2;
            const conj2 = cConj(safeZ2);
            const quot = cDiv(s.z1, safeZ2);
            const rq = cMod(quot);
            const aq = (cArg(quot) * 180) / Math.PI;
            vectors.push(
              { to: [conj2.re, conj2.im], color: COLORS.c4, dash: [4, 3], width: 2, label: "z̄₂" },
              { to: [quot.re, quot.im], color: COLORS.c2, width: 3, label: "z₁/z₂" },
            );
            calc.textContent = `\\(|z_1/z_2| = \\frac{${tx(r1, 2)}}{${tx(cMod(safeZ2), 2)}} = ${tx(rq, 2)},\\qquad \\arg(z_1/z_2) = ${tx(aq, 0)}^\\circ\\)`;
          }
          plot.draw({
            x: [-4.5, 4.5], y: [-4, 4.5], equalAspect: true, xLabel: "Re", yLabel: "Im",
            circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [4, 4] }],
            segments,
            vectors,
            handles: [
              { id: "z1", x: s.z1.re, y: s.z1.im, color: COLORS.c1, onDrag: (x, y) => { s.z1 = { re: x, im: y }; draw(); } },
              { id: "z2", x: s.z2.re, y: s.z2.im, color: COLORS.c3, onDrag: (x, y) => { s.z2 = { re: x, im: y }; draw(); } },
            ],
          });
        };
        ctl.append(
          segmented(
            [
              ["add", { tr: "Toplama (z₁+z₂)", en: "Add (z₁+z₂)" }],
              ["mul", { tr: "Çarpma (z₁·z₂)", en: "Multiply (z₁·z₂)" }],
              ["div", { tr: "Bölme (z₁/z₂)", en: "Divide (z₁/z₂)" }],
            ],
            s.mode,
            (v) => { s.mode = v; draw(); },
          ),
        );
        draw();
      },
    },
    {
      id: "cx-euler",
      mathId: "m-cx-euler",
      title: { tr: "Kutupsal Biçim ve Euler Formülü: e^(iθ) = cos θ + i sin θ", en: "Polar Form & Euler's Formula: e^(iθ) = cos θ + i sin θ" },
      body: [
        {
          tr: R`Düzlemdeki bir noktayı \((a, b)\) diye tarif etmek yerine, orijinden uzaklığı \(r = |z|\) ve açısı \(\theta = \arg z\) ile de tarif edebiliriz: \(a = r\cos\theta\), \(b = r\sin\theta\). Matematiğin en büyüleyici köprüsü olan [[euler-formula|Euler formülü]] \(e^{i\theta} = \cos\theta + i\sin\theta\), birim çember üzerindeki her noktanın aslında saf bir üstel sayı olduğunu gösterir! Çarpmada açıların neden toplandığı da bir anda açıklığa kavuşur: \(e^{i\theta_1}\cdot e^{i\theta_2} = e^{i(\theta_1 + \theta_2)}\)!`,
          en: R`Instead of grid steps \((a, b)\), we can locate \(z\) by its radius \(r = |z|\) and angle \(\theta = \arg z\): \(a = r\cos\theta\), \(b = r\sin\theta\). [[euler-formula|Euler's formula]] \(e^{i\theta} = \cos\theta + i\sin\theta\) reveals that every point on the unit circle is literally an imaginary exponential — instantly explaining why multiplication adds angles: \(e^{i\theta_1}\cdot e^{i\theta_2} = e^{i(\theta_1 + \theta_2)}\)!`,
        },
        {
          analogy: {
            title: { tr: "Şehir içi blok tarifi (a + bi) vs Uçak radarı tarifi (r e^(iθ))", en: "City-block directions (a + bi) vs Radar bearing (r e^(iθ))" },
            text: {
              tr: R`Bir taksici "3 blok doğuya, 4 blok kuzeye git" (\(3 + 4i\)) der; bir hava trafik kontrolörü ise aynı noktaya "5 km mesafede, \(53^\circ\) yönünde" (\(5e^{i\cdot 53^\circ}\)) der! İkisi birebir aynı noktadır — üstelik radar tarifinde döndürmek sadece açıya ekleme yapmaktır!`,
              en: R`A taxi driver says "3 blocks East, 4 blocks North" (\(3 + 4i\)); air traffic control gives the exact same spot as "5 km away at bearing \(53^\circ\)" (\(5e^{i\cdot 53^\circ}\))! Rotating on a radar screen is effortless: just add to the angle!`,
            },
          },
        },
        { eq: R`e^{i\theta} = \cos\theta + i\sin\theta, \qquad z = r e^{i\theta}, \qquad e^{i\pi} + 1 = 0` },
        {
          example: {
            title: { tr: "Euler biçimiyle (1 + i)⁴ kuvvetini tek satırda bulmak", en: "Evaluating (1 + i)⁴ in one line via Euler form" },
            problem: {
              tr: R`\(z = 1 + i\) sayısını Euler biçiminde \(re^{i\theta}\) yazıp \((1 + i)^4\) değerini hesaplayın.`,
              en: R`Write \(z = 1 + i\) in Euler form \(re^{i\theta}\) and compute \((1 + i)^4\).`,
            },
            steps: [
              {
                expr: R`r = \sqrt{1^2 + 1^2} = \sqrt{2}, \qquad \theta = \arctan\!\left(\frac{1}{1}\right) = \frac{\pi}{4}\;\;(45^\circ)`,
                note: { tr: "1 + i birinci bölgede (1, 1) noktası olduğundan uzunluğu √2, açısı 45° = π/4'tür.", en: "1 + i sits at (1, 1) in quadrant I: radius √2 and angle 45° = π/4." },
              },
              {
                expr: R`1 + i = \sqrt{2}\,e^{i\pi/4} \implies (1 + i)^4 = (\sqrt{2})^4\,e^{i\cdot 4(\pi/4)} = 4\,e^{i\pi}`,
                note: { tr: "4. kuvveti alırken yarıçapın 4. kuvvetini (√2)⁴ = 4 aldık, açıyı 4 ile çarptık (π)!", en: "Raising to the 4th power raises radius to 4 and multiplies angle by 4 → π!" },
              },
              {
                expr: R`4\,e^{i\pi} = 4(\cos\pi + i\sin\pi) = 4(-1 + 0i) = -4`,
                note: { tr: "Euler özdeşliği e^(iπ) = −1 sonucu anında verdi!", en: "Euler's identity e^(iπ) = −1 finishes it instantly!" },
              },
            ],
            answer: { tr: R`\((1 + i)^4 = -4\)`, en: R`\((1 + i)^4 = -4\)` },
          },
        },
        {
          tryList: [
            { tr: R`Aşağıdaki <b>"π (180° — Euler!)"</b> tuşuna basın: \(e^{i\pi} = -1\) noktasını birim çemberin en solunda yakalayıp ünlü \(e^{i\pi} + 1 = 0\) özdeşliğini canlı doğrulayın!`, en: R`Click <b>"π (180° — Euler!)"</b> to land at \(e^{i\pi} = -1\) on the far left of the unit circle and verify \(e^{i\pi} + 1 = 0\) live!` },
            { tr: R`\(\theta\) kaydırıcısını \(0^\circ\)'den \(360^\circ\)'ye çevirirken mavi yatay parçanın \(\cos\theta\), yeşil dikey parçanın ise \(\sin\theta\) olduğunu ve \(e^{i\theta}\) ucunun daima birim çember üstünde kaldığını görün!`, en: R`Sweep \(\theta\) from \(0^\circ\) to \(360^\circ\): watch horizontal blue \(\cos\theta\) and vertical green \(\sin\theta\) trace the unit circle smoothly!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.euler ??= { deg: 60 });
        const ctl = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const note = h("p", { class: "pc-msg info" });
        box.append(ctl, ctl2, host, calc, note);
        const plot = createCanvas2D(host, { height: 265 });
        let degSlider;

        const draw = () => {
          const rad = (s.deg * Math.PI) / 180;
          const cx = Math.cos(rad);
          const cy = Math.sin(rad);
          plot.draw({
            x: [-1.55, 1.55], y: [-1.55, 1.55], equalAspect: true, xLabel: "Re", yLabel: "Im",
            circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, width: 1.8 }],
            angles: s.deg > 0 ? [{ cx: 0, cy: 0, r: 0.34, start: 0, end: rad, color: COLORS.c2, label: `${s.deg}°` }] : [],
            segments: [
              { from: [0, 0], to: [cx, 0], color: COLORS.c1, width: 2.6 },
              { from: [cx, 0], to: [cx, cy], color: COLORS.c3, width: 2.6 },
            ],
            vectors: [{ to: [cx, cy], color: COLORS.c2, width: 2.8, label: "e^(iθ)" }],
            points: [{ x: cx, y: cy, color: COLORS.c2, r: 6, ring: true }],
          });
          calc.textContent = `\\(e^{i\\cdot ${s.deg}^\\circ} = \\cos(${s.deg}^\\circ) + i\\sin(${s.deg}^\\circ) = ${tx(cx, 3)} ${cy >= 0 ? "+" : "-"} ${tx(Math.abs(cy), 3)}i\\)`;
          if (s.deg === 180) {
            note.className = "pc-msg good";
            note.textContent = L({
              tr: "Euler Özdeşliği yakalandı! θ = π (180°) ⇒ e^(iπ) = −1 ⇒ e^(iπ) + 1 = 0!",
              en: "Euler's Identity unlocked! θ = π (180°) ⇒ e^(iπ) = −1 ⇒ e^(iπ) + 1 = 0!",
            });
          } else {
            note.className = "pc-msg info";
            note.textContent = L({
              tr: `Mavi taban = cos(${s.deg}°) = ${ns(cx, 3)}, yeşil yükseklik = sin(${s.deg}°) = ${ns(cy, 3)}; hipotenüs |e^(iθ)| = 1.`,
              en: `Blue base = cos(${s.deg}°) = ${ns(cx, 3)}, green height = sin(${s.deg}°) = ${ns(cy, 3)}; radius |e^(iθ)| = 1.`,
            });
          }
        };

        const landmarks = [
          ["0°", 0],
          ["π/4 (45°)", 45],
          ["π/2 (90° = i)", 90],
          ["π (180° — Euler!)", 180],
          ["3π/2 (270° = −i)", 270],
        ];
        for (const [lbl, d] of landmarks) {
          const btn = h("button", { type: "button", class: "btn small", text: lbl });
          btn.addEventListener("click", () => { s.deg = d; degSlider.set(d); draw(); });
          ctl.append(btn);
        }
        degSlider = slider("θ (°)", { min: 0, max: 360, step: 5, value: s.deg, fmt: (v) => `${v}°`, onInput: (v) => { s.deg = v; draw(); } });
        ctl2.append(degSlider);
        draw();
      },
    },
    {
      id: "cx-roots",
      mathId: "m-cx-roots",
      title: { tr: "De Moivre Yasası ve Düzgün Çokgen Olarak n. Kökler", en: "De Moivre's Law & n-th Roots as Regular Polygons" },
      body: [
        {
          tr: R`Kuvvet alırken \(z^n = r^n e^{i n\theta}\) kuralı (De Moivre Yasası) yarıçapı \(n\). kuvvete çıkarır, açıyı \(n\) ile çarpar. Şimdi tam tersini sorup \(z^n = w = R e^{i\varphi}\) denklemini çözelim! Bir açıya tam tur \(2\pi k\) eklemek \(w\) noktasını değiştirmez ama \(n\)'ye bölündüğünde <b>tam \(n\) tane farklı açı</b> üretir: bu [[roots-of-unity|\(n\). dereceden köklerin]] hepsi \(R^{1/n}\) yarıçaplı çember üzerinde <b>düzgün bir \(n\)-gen</b> oluşturur!`,
          en: R`De Moivre's Law \(z^n = r^n e^{i n\theta}\) raises radius to the \(n\)-th power and multiplies angle by \(n\). Reversing it to solve \(z^n = w = R e^{i\varphi}\): adding full circles \(2\pi k\) leaves \(w\) unchanged, yet dividing by \(n\) yields <b>exactly \(n\) distinct angles</b>! All \(n\) [[roots-of-unity|roots]] sit evenly around the circle of radius \(R^{1/n}\) as vertices of a <b>regular \(n\)-gon</b>!`,
        },
        {
          analogy: {
            title: { tr: "Yuvarlak pizzayı n eşit dilime kesmek", en: "Slicing a round pizza into n equal slices" },
            text: {
              tr: R`İlk kök \(z_0\)'ı bulmak pizzaya ilk bıçağı \(\varphi / n\) açısında atmak gibidir. Kalan tüm kökler (\(z_1, z_2, \dots, z_{n-1}\)) çember etrafında her seferinde \(\frac{360^\circ}{n}\) dönerek tam eşit dilimler halinde dizilir!`,
              en: R`Finding the first root \(z_0\) makes the first cut at angle \(\varphi / n\). Every remaining root (\(z_1, \dots, z_{n-1}\)) steps around the crust by equal \(\frac{360^\circ}{n}\) slices!`,
            },
          },
        },
        { eq: R`z^n = r^n e^{i n\theta}, \qquad z_k = R^{1/n}\,e^{\,i\frac{\varphi + 2\pi k}{n}} \quad (k = 0, 1, \dots, n - 1)` },
        {
          example: {
            title: { tr: "z³ = 8 denkleminin tüm 3 karmaşık kökünü bulmak", en: "Finding all 3 complex cube roots of 8" },
            problem: {
              tr: R`\(z^3 = 8\) denkleminin karmaşık düzlemdeki 3 kökünün tamamını bulun.`,
              en: R`Find all 3 complex solutions to \(z^3 = 8\).`,
            },
            steps: [
              {
                expr: R`w = 8 = 8\,e^{i\cdot 0} \implies R = 8,\; \varphi = 0,\; R^{1/3} = 2`,
                note: { tr: "Pozitif reel sayı 8'in açısı 0°, yarıçapı 8; köklerin ortak yarıçapı 8^(1/3) = 2'dir.", en: "Positive real 8 has radius 8 and angle 0°, so all roots share radius 2." },
              },
              {
                expr: R`\theta_k = \frac{0^\circ + 360^\circ k}{3} = 0^\circ,\; 120^\circ,\; 240^\circ \quad (k = 0, 1, 2)`,
                note: { tr: "Üç kök birbirinden 120° aralıklı bir eşkenar üçgenin köşeleridir!", en: "The three roots space out by 120° into an equilateral triangle!" },
              },
              {
                expr: R`z_0 = 2,\qquad z_1 = 2(\cos 120^\circ + i\sin 120^\circ) = -1 + i\sqrt{3},\qquad z_2 = -1 - i\sqrt{3}`,
                note: { tr: "Dikkat: üç kökün toplamı 2 + (−1 + i√3) + (−1 − i√3) = 0 (ağırlık merkezi orijin!)", en: "Bonus check: all three roots sum to 0 (their center of mass is the origin!)" },
              },
            ],
            answer: { tr: R`\(z_0 = 2,\; z_1 = -1 + i\sqrt{3},\; z_2 = -1 - i\sqrt{3}\)`, en: R`\(z_0 = 2,\; z_1 = -1 + i\sqrt{3},\; z_2 = -1 - i\sqrt{3}\)` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sadece k = 0 reel kökünü yazıp diğer (n − 1) kökü unutmak!", en: "Stopping at k = 0 and missing the other (n − 1) roots!" },
            text: {
              tr: R`Reel sayılarda \(\sqrt[3]{8} = 2\) tek sayıdır; ama karmaşık düzlemde \(z^n = w\) (\(w \ne 0\)) denkleminin <b>daima tam \(n\) tane farklı kökü</b> vardır! Her zaman \(k = 0, 1, \dots, n - 1\) değerlerinin tamamını sayın.`,
              en: R`In real algebra \(\sqrt[3]{8} = 2\) is a single number, but over \(\mathbb{C}\) every nonzero equation \(z^n = w\) has <b>exactly \(n\) distinct roots</b>! Always list every \(k = 0, 1, \dots, n - 1\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>"z⁶ = 1"</b> önayarına tıklayın: birim çember üzerinde tam \(60^\circ\) aralıklı kusursuz bir <b>düzgün altıgen</b> oluştuğunu görün!`, en: R`Click <b>"z⁶ = 1"</b> to see a perfect <b>regular hexagon</b> on the unit circle with vertices \(60^\circ\) apart!` },
            { tr: R`<b>"z⁴ = −1"</b> (yani \(\varphi = 180^\circ\)) seçin: hiç reel kök kalmaz, tüm 4 kök \(45^\circ, 135^\circ, 225^\circ, 315^\circ\) köşegenlerinde bir kare oluşturur!`, en: R`Click <b>"z⁴ = −1"</b> (\(\varphi = 180^\circ\)): zero real roots remain — all 4 form a rotated square at \(45^\circ, 135^\circ, 225^\circ, 315^\circ\)!` },
            { tr: R`\(\varphi\) kaydırıcısını yavaşça \(360^\circ\) döndürün: tüm çokgenin yalnızca \(360^\circ / n\) dönerek bir sonraki köşenin yerine oturduğunu gözlemleyin!`, en: R`Rotate \(\varphi\) through one full \(360^\circ\) turn: watch the whole polygon rotate by just \(360^\circ / n\) onto itself!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.roots ??= { n: 5, deg: 0, R: 1.8 });
        const ctl = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, ctl2, host, calc);
        const plot = createCanvas2D(host, { height: 280 });
        let nSl, degSl, rSl;

        const draw = () => {
          const rad = (s.deg * Math.PI) / 180;
          const w = cFromPolar(s.R, rad);
          const roots = cNthRoots(w, s.n);
          const rRoot = s.R ** (1 / s.n);
          plot.draw({
            x: [-2.8, 2.8], y: [-2.8, 2.8], equalAspect: true, xLabel: "Re", yLabel: "Im",
            circles: [{ cx: 0, cy: 0, r: rRoot, stroke: COLORS.c1, dash: [5, 4] }],
            polygons: [{ pts: roots.map((z) => [z.re, z.im]), fill: "rgba(42,120,214,0.14)", stroke: COLORS.c1, width: 2.2 }],
            vectors: [{ to: [w.re, w.im], color: COLORS.c2, dash: [4, 3], label: "w" }],
            points: roots.map((z, k) => ({ x: z.re, y: z.im, color: COLORS.c3, r: 5.5, label: `z${k}` })),
          });
          calc.textContent = `\\(z^{${s.n}} = ${tx(s.R, 1)}\\,e^{i\\cdot ${s.deg}^\\circ} \\implies |z_k| = ${tx(rRoot, 3)},\\quad \\Delta\\theta = \\frac{360^\\circ}{${s.n}} = ${tx(360 / s.n, 1)}^\\circ\\)`;
        };

        const setCase = (n, deg, Rval) => {
          s.n = n; s.deg = deg; s.R = Rval;
          nSl.set(n); degSl.set(deg); rSl.set(Rval);
          draw();
        };
        for (const [lbl, n, d, Rval] of [["z³ = 2", 3, 0, 2.0], ["z⁴ = −1", 4, 180, 1.0], ["z⁶ = 1", 6, 0, 1.0], ["z⁸ = i", 8, 90, 1.5]]) {
          const b = h("button", { type: "button", class: "btn small", text: lbl });
          b.addEventListener("click", () => setCase(n, d, Rval));
          ctl.append(b);
        }
        nSl = slider("n", { min: 2, max: 10, step: 1, value: s.n, fmt: (v) => String(v), onInput: (v) => { s.n = v; draw(); } });
        degSl = slider("φ (°)", { min: 0, max: 360, step: 15, value: s.deg, fmt: (v) => `${v}°`, onInput: (v) => { s.deg = v; draw(); } });
        rSl = slider("R = |w|", { min: 0.5, max: 2.5, step: 0.25, value: s.R, onInput: (v) => { s.R = v; draw(); } });
        ctl2.append(nSl, degSl, rSl);
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "Argand Düzlemi: Eşlenik, De Moivre Spiralleri ve Birim Çember", en: "Argand Plane: Conjugates, De Moivre Spirals & Unit Circle" },
    sub: {
      tr: R`\(z\) ucunu birim çemberin içine, tam üstüne veya dışına sürükleyin! \(z, z^2, z^3, \dots, z^n\) kuvvetlerinin üç dramatik kaderini — <b>içe kapanan spiral</b> (\(|z| < 1\)), <b>saf dönme</b> (\(|z| = 1\)) ve <b>dışa patlayan spiral</b> (\(|z| > 1\)) — canlı izleyin!`,
      en: R`Drag \(z\) inside, onto, or outside the unit circle! Watch the three fates of the De Moivre orbit \(z, z^2, \dots, z^n\): <b>shrinking spiral</b> (\(|z| < 1\)), <b>pure circle rotation</b> (\(|z| = 1\)), and <b>expanding spiral</b> (\(|z| > 1\))!`,
    },
    experiments: [
      { tr: R`<b>"İçe Spiral (|z| < 1)"</b> önayarına tıklayın: \(|z| \approx 0{,}85\) iken kuvvetlerin her adımda kısalıp orijine (\(0\)) doğru sarıldığını görün.`, en: R`Click <b>"Shrinking Spiral (|z| < 1)"</b>: with \(|z| \approx 0.85\), powers shrink inward toward the origin \(0\).` },
      { tr: R`<b>"Dışa Spiral (|z| > 1)"</b> seçin: yarıçap sadece \(1{,}15\) olmasına rağmen \(z^8\) kuvvetinin çemberden hızla dışarı fırladığını fark edin!`, en: R`Click <b>"Expanding Spiral (|z| > 1)"</b>: even with \(|z| \approx 1.15\), \(z^8\) shoots rapidly outward!` },
      { tr: R`<b>"6. Birim Kökü (60°)"</b> seçip \(n = 6\) tutun: \(z^6\) noktası tam olarak \((1, 0)\)'a inip kapalı bir düzgün altıgen çiziyor!`, en: R`Click <b>"6th Root of Unity (60°)"</b> with \(n = 6\): \(z^6\) lands dead-on \((1, 0)\), closing a regular hexagon!` },
      { tr: R`Yeşil kesikli <b>\(\bar z\)</b> eşleniğine dikkat edin: \(z\)'yi yukarı sürükledikçe \(\bar z\) her zaman reel eksenin diğer yanında tam ayna simetriği olarak hareket eder.`, en: R`Watch the dashed green conjugate <b>\(\bar z\)</b>: wherever you drag \(z\), \(\bar z\) mirrors it across the real axis.` },
    ],
    build(host, state) {
      const s = (state.pg ??= { z: { re: 0.75, im: 0.45 }, pow: 7 });
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, {
        height: 400,
        interactive: true,
        hint: L({ tr: "z ucunu birim çemberin içine/üstüne/dışına sürükleyin", en: "Drag z inside, onto, or outside the unit circle" }),
      });
      const presets = h("div", { class: "t-controls" });
      const ctl = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      const badge = h("p", { class: "pc-msg" });
      side.append(presets, ctl, tiles, calc, badge);

      let nSlider;

      const draw = () => {
        const conj = cConj(s.z);
        const r = cMod(s.z);
        const deg = (cArg(s.z) * 180) / Math.PI;
        const pows = Array.from({ length: s.pow }, (_, k) => cPow(s.z, k + 1));
        const segs = [];
        for (let i = 0; i < pows.length - 1; i++) {
          segs.push({ from: [pows[i].re, pows[i].im], to: [pows[i + 1].re, pows[i + 1].im], color: COLORS.c2, dash: [3, 3], width: 1.6 });
        }
        plot.draw({
          x: [-3.5, 3.5], y: [-3.5, 3.5], equalAspect: true, xLabel: "Re", yLabel: "Im",
          circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [5, 4] }],
          segments: segs,
          vectors: [
            { to: [conj.re, conj.im], color: COLORS.c3, dash: [4, 3], label: "z̄" },
            { to: [s.z.re, s.z.im], color: COLORS.c1, width: 2.8, label: "z" },
          ],
          points: pows.map((p, k) => ({ x: p.re, y: p.im, color: k === 0 ? COLORS.c1 : COLORS.c2, r: 4.5, label: k > 0 ? `z^${k + 1}` : undefined })),
          handles: [{ id: "z", x: s.z.re, y: s.z.im, color: COLORS.c1, onDrag: (x, y) => { s.z = { re: x, im: y }; draw(); } }],
        });
        const zn = pows[pows.length - 1];
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "|z|" }), h("span", { class: "pg-tile-value", text: ns(r, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "arg(z)" }), h("span", { class: "pg-tile-value", text: `${ns(deg, 1)}°` })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `|z^${s.pow}|` }), h("span", { class: "pg-tile-value", text: ns(cMod(zn), 3) })),
        );
        calc.textContent = `\\(z = ${tx(s.z.re, 2)} ${s.z.im >= 0 ? "+" : "-"} ${tx(Math.abs(s.z.im), 2)}i = ${tx(r, 2)}\\,e^{i\\cdot ${tx(deg, 1)}^\\circ}\\)`;
        if (Math.abs(r - 1) < 0.04) {
          badge.className = "pc-msg good";
          badge.textContent = L({ tr: "|z| ≈ 1: Birim çemberde saf dönme (uzunluk sabit kalır)!", en: "|z| ≈ 1: Pure rotation on the unit circle (constant radius)!" });
        } else if (r < 1) {
          badge.className = "pc-msg info";
          badge.textContent = L({ tr: "|z| < 1: İçe kapanan spiral — n büyüdükçe zⁿ → 0!", en: "|z| < 1: Shrinking spiral — zⁿ → 0 as n grows!" });
        } else {
          badge.className = "pc-msg bad";
          badge.textContent = L({ tr: "|z| > 1: Dışa açılan spiral — n büyüdükçe |zⁿ| → ∞!", en: "|z| > 1: Expanding spiral — |zⁿ| → ∞ as n grows!" });
        }
      };

      const applyPreset = (re, im, pow) => {
        s.z = { re, im };
        s.pow = pow;
        nSlider.set(pow);
        draw();
      };
      const presetDefs = [
        [{ tr: "İçe Spiral (|z|<1)", en: "Shrink (|z|<1)" }, 0.72, 0.45, 8],
        [{ tr: "Birim Çember (|z|=1)", en: "Unit Circle (|z|=1)" }, Math.cos(0.7), Math.sin(0.7), 8],
        [{ tr: "Dışa Spiral (|z|>1)", en: "Expand (|z|>1)" }, 0.98, 0.58, 7],
        [{ tr: "6. Birim Kökü (60°)", en: "6th Root (60°)" }, 0.5, Math.sqrt(3) / 2, 6],
      ];
      for (const [lbl, re, im, p] of presetDefs) {
        const b = h("button", { type: "button", class: "btn small", text: L(lbl) });
        b.addEventListener("click", () => applyPreset(re, im, p));
        presets.append(b);
      }

      nSlider = slider("n (zⁿ)", { min: 2, max: 10, step: 1, value: s.pow, fmt: (v) => String(v), onInput: (v) => { s.pow = v; draw(); } });
      ctl.append(nSlider);
      draw();
    },
  },
  mathSections: [
    {
      id: "m-cx-arith",
      title: { tr: "Karmaşık Aritmetik, Eşlenik ve Modül Özellikleri", en: "Complex Arithmetic, Conjugate & Modulus Rules" },
      blocks: [
        {
          table: {
            head: [{ tr: "Özellik", en: "Property" }, { tr: "Formül", en: "Formula" }],
            rows: [
              [{ tr: "Eşlenik & reel/sanal kısım", en: "Conjugate & real/imag parts" }, R`\(\bar z = a - bi,\quad \operatorname{Re}(z) = \dfrac{z+\bar z}{2},\quad \operatorname{Im}(z) = \dfrac{z-\bar z}{2i}\)`],
              [{ tr: "Modül karesi", en: "Modulus squared" }, R`\(z\bar z = |z|^2 = a^2 + b^2\)`],
              [{ tr: "Eşlenik dağılması", en: "Conjugate homomorphism" }, R`\(\overline{z_1 + z_2} = \bar z_1 + \bar z_2,\quad \overline{z_1 z_2} = \bar z_1 \bar z_2\)`],
              [{ tr: "Modül çarpımsallığı", en: "Multiplicative modulus" }, R`\(|z_1 z_2| = |z_1|\,|z_2|,\quad \left|\dfrac{z_1}{z_2}\right| = \dfrac{|z_1|}{|z_2|},\quad |z^n| = |z|^n\)`],
              [{ tr: "Üçgen eşitsizliği", en: "Triangle inequality" }, R`\(|z_1 + z_2| \le |z_1| + |z_2|\)`],
            ],
          },
        },
        {
          example: {
            title: { tr: "Modül çarpımsallığıyla dev kesrin uzunluğunu 2 saniyede bulmak", en: "Finding a huge quotient's modulus in 2 seconds" },
            problem: {
              tr: R`\(w = \dfrac{(3 + 4i)^2}{(1 - i)^4}\) karmaşık sayısının modülü \(|w|\) kaçtır?`,
              en: R`What is the modulus \(|w|\) of \(w = \dfrac{(3 + 4i)^2}{(1 - i)^4}\)?`,
            },
            steps: [
              {
                expr: R`|w| = \frac{|3 + 4i|^2}{|1 - i|^4}`,
                note: { tr: "Hiç kuvvet açıp bölme yapmaya gerek yok — modülü doğrudan paya, paydaya ve kuvvete dağıtın!", en: "Never expand! Distribute modulus directly over quotients and powers!" },
              },
              {
                expr: R`|3 + 4i| = \sqrt{9 + 16} = 5,\qquad |1 - i| = \sqrt{1 + 1} = \sqrt{2}`,
                note: { tr: "İki küçük modülü hesapladık.", en: "Compute the two tiny moduli." },
              },
              {
                expr: R`|w| = \frac{5^2}{(\sqrt{2})^4} = \frac{25}{4} = 6{,}25`,
                note: { tr: "10 satırlık işlemi 3 saniyede çözdük!", en: "Solved a 10-line calculation in 3 seconds!" },
              },
            ],
            answer: { tr: R`\(|w| = \dfrac{25}{4} = 6{,}25\)`, en: R`\(|w| = \dfrac{25}{4} = 6.25\)` },
          },
        },
      ],
    },
    {
      id: "m-cx-euler",
      title: { tr: "Euler Formülünün Maclaurin Serisinden Türetilmesi", en: "Deriving Euler's Formula from Maclaurin Series" },
      blocks: [
        {
          derive: {
            title: { tr: "e^(iθ) = cos θ + i sin θ (Ders 17 ile Ders 21'in muhteşem birleşimi!)", en: "e^(iθ) = cos θ + i sin θ (Unifying Lecture 17 & Lecture 21!)" },
            steps: [
              {
                tex: R`e^z = \sum_{n=0}^\infty \frac{z^n}{n!} = 1 + z + \frac{z^2}{2!} + \frac{z^3}{3!} + \frac{z^4}{4!} + \cdots`,
                why: { tr: "Üstel fonksiyonun her yerde yakınsak Maclaurin serisinde z yerine iθ yazalım.", en: "Substitute z = iθ into the everywhere-convergent Maclaurin series for e^z." },
              },
              {
                tex: R`e^{i\theta} = 1 + i\theta - \frac{\theta^2}{2!} - i\frac{\theta^3}{3!} + \frac{\theta^4}{4!} + i\frac{\theta^5}{5!} - \cdots`,
                why: { tr: "i² = −1, i³ = −i, i⁴ = 1 dörtlü döngüsünü uygularız.", en: "Apply the 4-cycle i² = −1, i³ = −i, i⁴ = 1." },
              },
              {
                tex: R`e^{i\theta} = \underbrace{\left(1 - \frac{\theta^2}{2!} + \frac{\theta^4}{4!} - \cdots\right)}_{\cos\theta} + i\underbrace{\left(\theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \cdots\right)}_{\sin\theta}`,
                why: { tr: "Reel (çift üslü) ve sanal (tek üslü) terimleri gruplayınca cos θ ve sin θ serileri eksiksiz ortaya çıkar!", en: "Grouping real (even) and imaginary (odd) powers recovers cos θ and sin θ exactly!" },
              },
              {
                tex: R`e^{i\pi} + 1 = 0`,
                why: { tr: "θ = π koyduğumuzda matematiğin beş temel sabitini (e, i, π, 1, 0) tek denklemde birleştiren Euler Özdeşliği doğar!", en: "Setting θ = π yields Euler's Identity linking e, i, π, 1, and 0 in one equation!" },
              },
            ],
          },
        },
        { eq: R`\cos\theta = \frac{e^{i\theta} + e^{-i\theta}}{2}, \qquad \sin\theta = \frac{e^{i\theta} - e^{-i\theta}}{2i}` },
        {
          callout: "tip",
          title: { tr: "Trigonometri özdeşliklerini ezberlemekten kurtulun!", en: "Never memorize trig identities again!" },
          text: {
            tr: R`\((\cos\theta + i\sin\theta)^2 = e^{i2\theta} = \cos(2\theta) + i\sin(2\theta)\) açılımında reel ve sanal kısımları eşitleyin: anında \(\cos(2\theta) = \cos^2\theta - \sin^2\theta\) ve \(\sin(2\theta) = 2\sin\theta\cos\theta\) çıkar!`,
            en: R`Equating real and imaginary parts of \((\cos\theta + i\sin\theta)^2 = \cos(2\theta) + i\sin(2\theta)\) immediately recovers \(\cos(2\theta) = \cos^2\theta - \sin^2\theta\) and \(\sin(2\theta) = 2\sin\theta\cos\theta\)!`,
          },
        },
      ],
    },
    {
      id: "m-cx-roots",
      title: { tr: "De Moivre, n. Köklerin İspatı ve Eşlenik Kök Teoremi", en: "De Moivre, n-th Roots Proof & Conjugate Root Theorem" },
      blocks: [
        {
          derive: {
            title: { tr: "Neden zⁿ = w denkleminin tam olarak n farklı kökü vardır?", en: "Why does zⁿ = w have exactly n distinct roots?" },
            steps: [
              {
                tex: R`z = r e^{i\theta},\quad w = R e^{i\varphi} \implies r^n e^{i n\theta} = R e^{i(\varphi + 2\pi k)}\quad (k \in \mathbb{Z})`,
                why: { tr: "İki karmaşık sayı ancak yarıçapları eşit ve açıları 2π'nin tam katı kadar farklıysa aynı noktadır.", en: "Two polar numbers match iff their radii match and angles differ by a multiple of 2π." },
              },
              {
                tex: R`r = R^{1/n}, \qquad \theta_k = \frac{\varphi + 2\pi k}{n}`,
                why: { tr: "Pozitif n. kök r'yi, n'ye bölmek ise kök açılarını verir.", en: "Taking the positive nth root gives r; dividing by n gives the angles." },
              },
              {
                tex: R`\theta_{k + n} = \frac{\varphi + 2\pi(k + n)}{n} = \theta_k + 2\pi \implies z_{k + n} = z_k`,
                why: { tr: "k = 0, 1, …, n − 1 için n farklı nokta çıkar; k = n olduğunda açı tam 2π ilerlediği için z₀ tekrar başlar!", en: "k = 0, …, n − 1 produce n distinct vertices; at k = n we wrap by 2π right back onto z₀!" },
              },
            ],
          },
        },
        {
          example: {
            title: { tr: "z⁴ = −16 denkleminin 4 kökünü bulmak", en: "Finding all 4 fourth roots of −16" },
            problem: {
              tr: R`\(z^4 = -16\) denkleminin karmaşık düzlemdeki 4 kökünü kutupsal ve kartezyen biçimde yazın.`,
              en: R`Find all 4 solutions of \(z^4 = -16\) in polar and rectangular form.`,
            },
            steps: [
              {
                expr: R`-16 = 16\,e^{i\pi} \implies r = 16^{1/4} = 2,\quad \theta_k = \frac{\pi + 2\pi k}{4} = \frac{\pi}{4},\;\frac{3\pi}{4},\;\frac{5\pi}{4},\;\frac{7\pi}{4}`,
                note: { tr: "−16 negatif reel eksende (180° = π) durur; tüm kökler yarıçapı 2 olan çemberde 90° aralıklı bir kare oluşturur!", en: "−16 sits on the negative real axis (angle π); all 4 roots form a square of radius 2!" },
              },
              {
                expr: R`z_k = 2\!\left(\pm\frac{\sqrt{2}}{2} \pm i\frac{\sqrt{2}}{2}\right) = \pm\sqrt{2} \pm i\sqrt{2}`,
                note: { tr: "Dört işaret kombinasyonunun tamamı (++, −+, −−, +−) 4 kökü verir!", en: "All four sign combinations give the 4 vertices!" },
              },
            ],
            answer: { tr: R`\(\sqrt{2} + i\sqrt{2},\; -\sqrt{2} + i\sqrt{2},\; -\sqrt{2} - i\sqrt{2},\; \sqrt{2} - i\sqrt{2}\)`, en: R`\(\pm\sqrt{2} \pm i\sqrt{2}\)` },
          },
        },
        {
          callout: "tip",
          title: { tr: "Eşlenik Kök Teoremi (Reel katsayılı polinomlar)", en: "Complex Conjugate Root Theorem" },
          text: {
            tr: R`Reel katsayılı bir polinomun \(z_0\) karmaşık kökü varsa, eşleniği \(\bar z_0\) da mutlaka köktür! Karmaşık kökler daima çiftler hâlinde geldiğinden <b>tek dereceli her reel polinomun en az bir reel kökü olmak zorundadır</b>.`,
            en: R`Whenever a real-coefficient polynomial has a complex root \(z_0\), its conjugate \(\bar z_0\) is guaranteed to be a root too! Because non-real roots arrive in pairs, <b>every odd-degree real polynomial has at least one real root</b>.`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
