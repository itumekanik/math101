import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "lim-intro",
    title: { tr: "Limitler ve Süreklilik", en: "Limits and Continuity" },
    paragraphs: [
      {
        tr: R`Türevden integrale, sonsuz serilerden fiziksel hıza kadar tüm kalkülüs tek bir temel fikrin üzerinde yükselir: [[limit|limit]]. \(\lim_{x \to a} f(x) = L\) ifadesi sesli olarak <i>"\(x\) sayısı \(a\)'ya yaklaşırken \(f(x)\)'in limiti \(L\)'dir"</i> diye okunur. Buradaki en şaşırtıcı kural şudur: \(f(a)\)'nın ne olduğu — hatta tanımlı olup olmadığı — hiç önemli değildir! Bizi ilgilendiren tek şey, \(x\)'in \(a\)'ya çok yakın komşuluğunda \(f(x)\)'in nereye yöneldiğidir.`,
        en: R`From derivatives and integrals to infinite series, all of calculus rests on one foundation: the [[limit|limit]]. The notation \(\lim_{x \to a} f(x) = L\) is read aloud as <i>"the limit of \(f(x)\) as \(x\) approaches \(a\) equals \(L\)."</i> The crucial twist is that the actual value \(f(a)\) — or even whether \(f(a)\) exists at all — does not matter! Only the trend of \(f(x)\) strictly near \(a\) counts.`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> sağdan/soldan yaklaşmayı ve kaldırılabilir delikleri okuyabilecek, \(\varepsilon\)–\(\delta\) meydan okuma oyununu görsel olarak kazanabilecek, [[squeeze-theorem|Sandviç Teoremi]] ile \(\lim_{x \to 0}\frac{\sin x}{x} = 1\)'i kurabilecek ve [[continuity|süreklilik]] ile Ara Değer Teoremi (IVT) kullanarak kök avlayabileceksiniz.`,
        en: R`<b>By the end of this chapter</b> you will read left/right approaches and removable holes effortlessly, win the \(\varepsilon\)–\(\delta\) challenge game visually, apply the [[squeeze-theorem|Squeeze Theorem]] and [[asymptote|asymptotes]], and locate roots using [[continuity|continuity]] and the Intermediate Value Theorem (IVT).`,
      },
    ],
    analogy: {
      title: { tr: "Köprüdeki eksik tahta", en: "The missing plank on a bridge" },
      text: {
        tr: R`Bir yürüyüş yolunun tam \(x = a\) noktasında tek bir tahtasının söküldüğünü düşünün. Tam o deliğin üzerine basamazsınız (\(f(a)\) tanımsızdır), ama yola hem soldan hem sağdan yaklaştığınızda yolun iki ucu aynı \(L\) yüksekliğine geliyorsa eksik tahtanın hangi yükseklikte olması gerektiğini kesin olarak bilirsiniz — işte bu yükseklik <b>limittir</b>! Yolun iki ucu farklı yükseklikte kalmışsa limit yoktur; eksik tahta tam doğru yüksekliğe (\(f(a) = L\)) geri takıldığında ise yol <b>süreklidir</b>.`,
        en: R`Imagine a footbridge with a single plank missing at \(x = a\). You cannot step directly on \(x = a\) (\(f(a)\) is undefined), yet if both halves of the walkway lead smoothly to the exact same height \(L\) from the left and the right, you know precisely where the missing plank belongs — that predicted height is the <b>limit</b>! If the two sides meet at mismatched heights, no limit exists; if the plank is placed back at height \(f(a) = L\), the bridge is <b>continuous</b>.`,
      },
    },
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 13 · Limitler ve Süreklilik", en: "Lecture 13 · Limits & Continuity" }],
      [{ tr: "Nasıl okunur?", en: "Read aloud" }, { tr: R`\(\lim_{x \to a} f(x) = L\): "\(x\), \(a\)'ya yaklaşırken \(f(x) \to L\)"`, en: R`\(\lim_{x \to a} f(x) = L\): "as \(x\) approaches \(a\), \(f(x) \to L\)"` }],
      [{ tr: "Kesin tanım", en: "Formal definition" }, { tr: R`\(\forall \varepsilon > 0\ \exists \delta > 0:\ 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon\)`, en: R`\(\forall \varepsilon > 0\ \exists \delta > 0:\ 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon\)` }],
      [{ tr: "Altın limitler", en: "Landmark limits" }, { tr: R`\(\lim_{x \to 0}\frac{\sin x}{x} = 1,\quad \lim_{n \to \infty}\left(1+\frac{1}{n}\right)^n = e\)`, en: R`\(\lim_{x \to 0}\frac{\sin x}{x} = 1,\quad \lim_{n \to \infty}\left(1+\frac{1}{n}\right)^n = e\)` }],
    ],
    tip: {
      title: { tr: "Başlangıç ipucu: 0/0 bir son değil, başlangıçtır!", en: "Beginner tip: 0/0 is a clue, not an answer!" },
      text: {
        tr: R`Bir limitte \(x = a\) koyduğunuzda \(\frac{0}{0}\) çıkıyorsa bu "limit yok" demek değildir! Pay ve paydada ortak bir \((x - a)\) çarpanının gizlendiğine işarettir; sadeleştirip yeniden bakın.`,
        en: R`Getting \(\frac{0}{0}\) when plugging in \(x = a\) never automatically means "no limit"! It signals a hidden \((x - a)\) factor waiting to cancel — simplify first and evaluate again.`,
      },
    },
  },

  sections: [
    {
      id: "lim-intuition",
      mathId: "m-lim-algebra",
      title: { tr: "Limit Nedir? Sağdan-Soldan Yaklaşma ve Delikler", en: "What Is a Limit? One-Sided Approaches & Holes" },
      body: [
        {
          tr: R`Sayı doğrusunda bir \(a\) noktasına iki yönden yaklaşabiliriz: <b>soldan</b> (\(x < a\) iken \(a\)'ya doğru, \(x \to a^-\) yazılır) ve <b>sağdan</b> (\(x > a\) iken \(a\)'ya doğru, \(x \to a^+\) yazılır). İki taraflı [[limit|limitin]] var olabilmesi için iki ekibin de aynı hedef yükseklikte buluşması şarttır.`,
          en: R`On the number line you can walk toward \(a\) from two directions: from the <b>left</b> (\(x < a\), written \(x \to a^-\)) and from the <b>right</b> (\(x > a\), written \(x \to a^+\)). A two-sided [[limit|limit]] exists if and only if both sides agree on the exact same destination height \(L\).`,
        },
        {
          note: {
            tr: R`<b>Sembol okuma rehberi:</b> \(x \to 1^-\) "1'e soldan (0,9; 0,99; 0,999 gibi küçük değerlerden) yaklaş" demektir; \(x \to 1^+\) ise "1'e sağdan (1,1; 1,01; 1,001 gibi büyük değerlerden) yaklaş" demektir.`,
            en: R`<b>Reading the symbols:</b> \(x \to 1^-\) means "approach 1 from the left (0.9, 0.99, 0.999…)"; \(x \to 1^+\) means "approach 1 from the right (1.1, 1.01, 1.001…)."`,
          },
        },
        {
          eq: {
            tr: R`\lim_{x \to a} f(x) = L \iff \lim_{x \to a^-} f(x) = L \ \text{ ve }\ \lim_{x \to a^+} f(x) = L`,
            en: R`\lim_{x \to a} f(x) = L \iff \lim_{x \to a^-} f(x) = L \ \text{ and }\ \lim_{x \to a^+} f(x) = L`,
          },
        },
        {
          example: {
            title: { tr: "Deliği kapatmak: (x² − 1) / (x − 1)", en: "Filling a hole: (x² − 1) / (x − 1)" },
            problem: {
              tr: R`\(\lim_{x \to 1} \frac{x^2 - 1}{x - 1}\) limitini adım adım hesaplayın.`,
              en: R`Evaluate \(\lim_{x \to 1} \frac{x^2 - 1}{x - 1}\) step by step.`,
            },
            steps: [
              {
                expr: R`\frac{1^2 - 1}{1 - 1} = \frac{0}{0}`,
                note: { tr: R`Önce doğrudan \(x = 1\) deneriz: \(\frac{0}{0}\) belirsizliği çıkar. Demek ki \(x = 1\)'de grafikte bir delik var.`, en: R`Direct substitution gives \(\frac{0}{0}\), an indeterminate form — there is a hole at \(x = 1\).` },
              },
              {
                expr: R`\frac{x^2 - 1}{x - 1} = \frac{(x - 1)(x + 1)}{x - 1} = x + 1 \quad (x \ne 1)`,
                note: { tr: R`Limit alırken \(x\) hiçbir zaman tam \(1\) olmadığı için \((x - 1) \ne 0\)'dır ve güvenle sadeleştirilebilir!`, en: R`In a limit \(x\) is never equal to \(1\), so \(x - 1 \ne 0\) and cancels cleanly!` },
              },
              {
                expr: R`\lim_{x \to 1} (x + 1) = 1 + 1 = 2`,
                note: { tr: R`Artık \(x\) sayısı \(1\)'e yaklaşırken \(x + 1\) hem soldan hem sağdan \(2\)'ye sıkışır.`, en: R`Now as \(x \to 1\) from either side, \(x + 1\) heads straight to \(2\).` },
              },
            ],
            answer: { tr: R`\(f(1)\) tanımsız olsa bile limit kesin olarak \(2\)'dir!`, en: R`Even though \(f(1)\) is undefined, the limit is unambiguously \(2\)!` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: f(a)'nın değerini limit sanmak", en: "Common mistake: confusing f(a) with the limit" },
            text: {
              tr: R`Biri gelip \(x = 1\) noktasındaki deliği \(y = 2\) yerine \(y = 4\)'e bir nokta koyarak "yamarsa", \(f(1) = 4\) olur ama <b>limit hâlâ 2'dir!</b> Çünkü komşu noktaların hepsi hâlâ \(2\)'ye gidiyordur.`,
              en: R`If someone defines \(f(1) = 4\) while the curve everywhere else equals \(x + 1\), then \(f(1) = 4\), yet <b>the limit is still 2!</b> Nearby points still head toward \(2\).`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>Delik (0/0)</b> modunda \(h\) kaydırıcısını \(0{,}02\)'ye indirin: yeşil (sol) ve turuncu (sağ) noktaların ikisinin de \((1, 2)\) deliğine kilitlendiğini görün.`, en: R`In <b>Hole (0/0)</b> mode, shrink \(h\) down to \(0.02\): watch both the green (left) and orange (right) dots lock onto \((1, 2)\).` },
            { tr: R`<b>Kaymış nokta</b> moduna geçin: \(f(1) = 4\) yukarıda tek başına dururken limitin hâlâ \(2\) kaldığını fark edin.`, en: R`Switch to <b>Moved dot</b>: notice \(f(1) = 4\) floats above the line, yet the limit remains \(2\).` },
            { tr: R`<b>Sıçrama</b> moduna geçin: \(h\)'yi ne kadar küçültürseniz küçültün sol ekip \(1\)'de, sağ ekip \(3\)'te kalır → limit YOKTUR!`, en: R`Switch to <b>Jump</b>: no matter how small \(h\) gets, left stays at \(1\) while right stays at \(3\) → limit DOES NOT EXIST!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.introDemo ??= { kind: "hole", h: 0.7 });
        const modes = {
          hole: {
            label: { tr: "Delik (0/0)", en: "Hole (0/0)" },
            f: (x) => (Math.abs(x - 1) < 1e-9 ? NaN : (x * x - 1) / (x - 1)),
            fAt1: null,
            limL: 2,
            limR: 2,
          },
          moved: {
            label: { tr: "Kaymış nokta", en: "Moved dot" },
            f: (x) => (Math.abs(x - 1) < 1e-9 ? NaN : x + 1),
            fAt1: 4,
            limL: 2,
            limR: 2,
          },
          jump: {
            label: { tr: "Sıçrama", en: "Jump" },
            f: (x) => (x < 1 ? 0.5 * x + 0.5 : 0.5 * x + 2.5),
            fAt1: 3,
            limL: 1,
            limR: 3,
          },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, calc, msg);
        const plot = createCanvas2D(host, { height: 265 });

        const draw = () => {
          const cur = modes[s.kind];
          const a = 1;
          const xL = a - s.h;
          const xR = a + s.h;
          const yL = cur.f(xL);
          const yR = cur.f(xR);
          const pts = [
            { x: xL, y: yL, color: COLORS.c3, r: 5.5, label: `L: ${ns(yL, 2)}` },
            { x: xR, y: yR, color: COLORS.c2, r: 5.5, label: `R: ${ns(yR, 2)}` },
          ];
          if (s.kind === "jump") {
            pts.push({ x: a, y: cur.limL, color: COLORS.c1, r: 5.5, hollow: true });
            pts.push({ x: a, y: cur.limR, color: COLORS.c1, r: 5.5 });
          } else {
            pts.push({ x: a, y: 2, color: COLORS.c1, r: 6, hollow: true, label: "L = 2" });
            if (cur.fAt1 != null) pts.push({ x: a, y: cur.fAt1, color: COLORS.c4, r: 6, label: `f(1) = ${cur.fAt1}` });
          }
          plot.draw({
            x: [-1, 3],
            y: [-0.5, 4.8],
            xLabel: "x",
            yLabel: "f(x)",
            lines: [{ a: 1, b: 0, c: -a, color: COLORS.muted, dash: [4, 4], width: 1.3 }],
            curves: [{ f: cur.f, color: COLORS.c1, width: 2.6 }],
            segments: [
              { from: [xL, 0], to: [xL, yL], color: COLORS.c3, dash: [3, 3], width: 1.4 },
              { from: [xR, 0], to: [xR, yR], color: COLORS.c2, dash: [3, 3], width: 1.4 },
            ],
            points: pts,
          });
          calc.textContent = `\\(f(1 - ${tx(s.h, 2)}) = ${tx(yL, 3)},\\qquad f(1 + ${tx(s.h, 2)}) = ${tx(yR, 3)},\\qquad |f(1+h)-f(1-h)| = ${tx(Math.abs(yR - yL), 3)}\\)`;
          if (cur.limL === cur.limR) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: s.kind === "moved"
                ? `✓ Sağ ve sol yaklaşım aynı hedefe (2) gidiyor → limit = 2! (f(1) = 4 olması limiti değiştirmez, ama sürekliliği bozar.)`
                : `✓ Sağ ve sol yaklaşım aynı hedefe (2) kilitleniyor → lim_{x→1} f(x) = 2.`,
              en: s.kind === "moved"
                ? `✓ Both sides approach 2 → limit = 2! (Having f(1) = 4 does not change the limit, though it breaks continuity.)`
                : `✓ Both left and right approaches lock onto 2 → lim_{x→1} f(x) = 2.`,
            });
          } else {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `✕ Sol limit = 1 ≠ Sağ limit = 3! İki taraf buluşamadığı için iki taraflı limit YOKTUR.`,
              en: `✕ Left limit = 1 ≠ Right limit = 3! Because the two sides disagree, the two-sided limit DOES NOT EXIST.`,
            });
          }
        };

        ctl.append(
          segmented(Object.entries(modes).map(([k, v]) => [k, v.label]), s.kind, (v) => { s.kind = v; draw(); }),
          slider(L({ tr: "Mesafe h", en: "Step h" }), { min: 0.02, max: 1.2, step: 0.02, value: s.h, onInput: (v) => { s.h = v; draw(); } }),
        );
        draw();
      },
    },

    {
      id: "lim-ed",
      mathId: "m-lim-ed",
      title: { tr: "ε–δ Meydan Okuma Oyunu: Kesin Tanımı Görmek", en: "The ε–δ Challenge Game: Seeing the Formal Definition" },
      body: [
        {
          tr: R`"Çok yaklaşmak" sözü günlük dilde hoş durur ama matematikte kesinlik isteriz. \(\forall \varepsilon > 0\ \exists \delta > 0\) ifadesi şöyle okunur: <i>"Ne kadar dar pozitif bir \(\varepsilon\) (epsilon) hedef bandı verilirse verilsin, buna karşılık pozitif bir \(\delta\) (delta) girdi penceresi bulabilirim."</i>`,
          en: R`Saying "gets really close" feels nice informally, but proofs need precision. Read \(\forall \varepsilon > 0\ \exists \delta > 0\) aloud as: <i>"No matter how tiny a target tolerance \(\varepsilon\) (epsilon) you challenge me with, I can answer with an input window \(\delta\) (delta) that keeps the curve inside."</i>`,
        },
        {
          analogy: {
            title: { tr: "Hassas fabrika toleransı oyunu", en: "The precision factory tolerance game" },
            text: {
              tr: R`Bir müşteri size "Ürettiğin çubuğun boyu \(L\) hedefine \(\pm\varepsilon\) hata payı içinde kalsın!" diye meydan okuyor. Sizin elinizde ise makinenin ayar düğmesi \(x\) var. Ayar düğmesini \(a \pm \delta\) aralığında tutarak müşterinin istediği her \(\pm\varepsilon\) toleransını yakalayabiliyorsanız oyunu kazanırsınız — yani limit gerçekten \(L\)'dir!`,
              en: R`A client challenges you: "Keep the part height within \(\pm\varepsilon\) of target \(L\)!" Your control dial is \(x\) near \(a\). If for every tolerance \(\varepsilon > 0\) the client demands you can tighten your dial window \(a \pm \delta\) so every output stays inside \(L \pm \varepsilon\), you win the game — the limit is truly \(L\)!`,
            },
          },
        },
        { eq: R`0 < |x - a| < \delta \implies |f(x) - L| < \varepsilon` },
        {
          example: {
            title: { tr: "Doğrusal fonksiyonda δ bulmak: f(x) = 2x − 1", en: "Finding δ for a linear function: f(x) = 2x − 1" },
            problem: {
              tr: R`\(\lim_{x \to 3} (2x - 1) = 5\) için rakip \(\varepsilon = 0{,}2\) verirse hangi \(\delta\) oyunu kazandırır?`,
              en: R`For \(\lim_{x \to 3} (2x - 1) = 5\), if the challenger picks \(\varepsilon = 0.2\), which \(\delta\) wins?`,
            },
            steps: [
              {
                expr: R`|f(x) - 5| = |(2x - 1) - 5| = |2x - 6| = 2|x - 3|`,
                note: { tr: R`Çıktı hatasını girdi uzaklığı \(|x - 3|\) cinsinden sadeleştiririz.`, en: R`Rewrite the output error in terms of the input distance \(|x - 3|\).` },
              },
              {
                expr: R`2|x - 3| < 0{,}2 \iff |x - 3| < 0{,}1`,
                note: { tr: R`Her iki tarafı \(2\)'ye bölünce sihirli pencere ortaya çıkar: \(\delta = 0{,}1\)!`, en: R`Divide both sides by \(2\) to reveal the winning window: \(\delta = 0.1\)!` },
              },
              {
                expr: { tr: R`\text{Genel kural: } \delta = \frac{\varepsilon}{2}`, en: R`\text{General rule: } \delta = \frac{\varepsilon}{2}` },
                note: { tr: R`Hangi \(\varepsilon > 0\) gelirse gelsin yarısını \(\delta\) seçmek oyunu daima kazandırır.`, en: R`For any \(\varepsilon > 0\) whatsoever, choosing \(\delta = \varepsilon / 2\) always wins.` },
              },
            ],
            answer: { tr: R`\(\varepsilon = 0{,}2\) için \(\delta = 0{,}1\) (genelde \(\delta = \varepsilon/2\)) yeterlidir.`, en: R`For \(\varepsilon = 0.2\), choose \(\delta = 0.1\) (in general \(\delta = \varepsilon / 2\)).` },
          },
        },
        {
          tryList: [
            { tr: R`<b>Sürekli eğri</b> modunda \(\varepsilon\)'u \(0{,}30\)'a daraltın — kutu kırmızıya dönecektir. Sonra \(\delta\)'yı küçülterek şeridi tekrar yeşile çevirin!`, en: R`In <b>Smooth curve</b> mode, shrink \(\varepsilon\) to \(0.30\) — the strip turns red. Now tighten \(\delta\) until it flips back to green!` },
            { tr: R`<b>En iyi δ'yı bul</b> düğmesine basıp makinenin o \(\varepsilon\) için güvenli pencereyi nasıl seçtiğini izleyin.`, en: R`Click <b>Auto-fit δ</b> to see a safe window selected automatically for the current \(\varepsilon\).` },
            { tr: R`<b>Sıçramalı eğri</b> moduna geçip \(\varepsilon = 0{,}35\) yapın: \(\delta\)'yı en küçük değerine (\(0{,}05\)) indirseniz bile grafik kırmızı taşar → limit yok!`, en: R`Switch to <b>Jump curve</b> with \(\varepsilon = 0.35\): even at the tiniest \(\delta = 0.05\), the graph escapes the band → no limit!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.ed ??= { mode: "smooth", eps: 0.7, delta: 0.6 });
        const a = 2;
        const fSmooth = (x) => 0.35 * x * x + 0.5;
        const Lval = fSmooth(a); // 1.9
        const fJump = (x) => (x < a ? 1.2 + 0.15 * (x - a) : 2.6 + 0.15 * (x - a));

        const ctl1 = h("div", { class: "t-controls" });
        const ctl2 = h("div", { class: "t-controls" });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl1, ctl2, host, msg);
        const plot = createCanvas2D(host, { height: 265 });

        let slDelta;
        const draw = () => {
          const f = s.mode === "smooth" ? fSmooth : fJump;
          let maxErr = 0;
          for (let i = 0; i <= 120; i++) {
            const x = a - s.delta + (i / 120) * (2 * s.delta);
            if (Math.abs(x - a) < 1e-6) continue;
            maxErr = Math.max(maxErr, Math.abs(f(x) - Lval));
          }
          const ok = maxErr < s.eps;
          plot.draw({
            x: [0, 4],
            y: [0, 4.2],
            xLabel: "x",
            yLabel: "f(x)",
            bands: [
              { axis: "y", from: Lval - s.eps, to: Lval + s.eps, color: "rgba(42,120,214,0.14)", border: COLORS.c1 },
              {
                axis: "x",
                from: a - s.delta,
                to: a + s.delta,
                color: ok ? "rgba(27,175,122,0.16)" : "rgba(208,59,59,0.16)",
                border: ok ? COLORS.c3 : COLORS.bad,
              },
            ],
            curves: [{ f, color: COLORS.text, width: 2.6 }],
            points: [{ x: a, y: Lval, color: COLORS.c2, r: 5.5, hollow: true, label: `(2, ${ns(Lval, 2)})` }],
          });
          msg.className = ok ? "pc-msg good" : "pc-msg bad";
          msg.textContent = ok
            ? L({
                tr: `✓ Kazandın! δ = ${ns(s.delta, 2)} iken şeritteki en büyük sapma ${ns(maxErr, 2)} < ε = ${ns(s.eps, 2)}.`,
                en: `✓ You win! With δ = ${ns(s.delta, 2)}, worst deviation in strip is ${ns(maxErr, 2)} < ε = ${ns(s.eps, 2)}.`,
              })
            : L({
                tr: s.mode === "jump" && s.eps <= 0.7
                  ? `✕ İmkânsız! Sıçrama yüksekliği 0,7 olduğundan ε ≤ 0,7 için HİÇBİR δ > 0 şeridi kurtaramaz.`
                  : `✕ Taşma var! En büyük sapma ${ns(maxErr, 2)} ≥ ε = ${ns(s.eps, 2)}. δ'yı küçültün.`,
                en: s.mode === "jump" && s.eps <= 0.7
                  ? `✕ Impossible! Because the jump is 0.7 from L, NO δ > 0 can ever keep the curve inside ε ≤ 0.7.`
                  : `✕ Escaped! Worst deviation is ${ns(maxErr, 2)} ≥ ε = ${ns(s.eps, 2)}. Tighten δ.`,
              });
        };

        const fitBtn = h("button", {
          type: "button",
          class: "btn small",
          text: L({ tr: "En iyi δ'yı bul", en: "Auto-fit δ" }),
        });
        fitBtn.addEventListener("click", () => {
          if (s.mode === "smooth") {
            // Solve 0.35*(2+d)^2 + 0.5 - 1.9 = eps => (2+d)^2 = 4 + eps/0.35
            const best = Math.max(0.05, Math.min(1.0, Math.floor((Math.sqrt(4 + s.eps / 0.35) - 2) * 18) / 20));
            s.delta = best;
            slDelta.set(best);
          } else {
            s.delta = 0.05;
            slDelta.set(0.05);
          }
          draw();
        });

        ctl1.append(
          segmented(
            [["smooth", { tr: "Sürekli eğri", en: "Smooth curve" }], ["jump", { tr: "Sıçramalı eğri", en: "Jump curve" }]],
            s.mode,
            (v) => { s.mode = v; draw(); },
          ),
          fitBtn,
        );
        slDelta = slider("δ", { min: 0.05, max: 1.0, step: 0.05, value: s.delta, onInput: (v) => { s.delta = v; draw(); } });
        ctl2.append(
          slider("ε", { min: 0.15, max: 1.2, step: 0.05, value: s.eps, onInput: (v) => { s.eps = v; draw(); } }),
          slDelta,
        );
        draw();
      },
    },

    {
      id: "lim-squeeze",
      mathId: "m-lim-sinx",
      title: { tr: "Sandviç Teoremi, Sonsuzda Limitler ve Asimptotlar", en: "Squeeze Theorem, Limits at Infinity & Asymptotes" },
      body: [
        {
          tr: R`Bazı fonksiyonlar sıfırın dibinde çılgınca titreşir — örneğin \(x^2\sin(1/x)\). Ama bu fonksiyonu alttan ve üstten iki uysal eğrinin arasına sıkıştırabilirsek, [[squeeze-theorem|Sandviç (Sıkıştırma) Teoremi]] bize limiti zahmetsizce verir! Ayrıca \(x \to \pm\infty\) iken fonksiyonun yapıştığı kılavuz doğrulara [[asymptote|yatay asimptot]], paydanın sıfırlandığı patlama çizgilerine ise <b>dikey asimptot</b> denir.`,
          en: R`Some functions oscillate wildly near \(0\), such as \(x^2\sin(1/x)\). Yet if we trap such a curve between two well-behaved outer bounds heading to the same value \(L\), the [[squeeze-theorem|Squeeze Theorem]] locks down its limit instantly! Meanwhile, guide lines a graph hugs as \(x \to \pm\infty\) are <b>horizontal [[asymptote|asymptotes]]</b>, while blow-up lines are <b>vertical asymptotes</b>.`,
        },
        {
          analogy: {
            title: { tr: "İki koruma arasında kapıdan geçmek", en: "Two escorts walking through a doorway" },
            text: {
              tr: R`Ortadaki kişi sağa sola zikzak çizse de (\(\sin(1/x)\) hep \(-1\) ile \(+1\) arasında kalır), iki yanında yürüyen \(-x^2\) ve \(+x^2\) korumaları \(x = 0\)'da tam \(0\) kapısından geçiyorsa, ortadaki kişi de mecburen \(0\)'dan geçmek zorundadır!`,
              en: R`Even if the middle walker zig-zags frantically (since \(-1 \le \sin(1/x) \le 1\)), if two steady escorts (\(-x^2\) below and \(+x^2\) above) pinch together at height \(0\) at \(x = 0\), the trapped walker is forced through \(0\) too!`,
            },
          },
        },
        { eq: R`-x^2 \le x^2\sin\!\left(\frac{1}{x}\right) \le x^2 \implies \lim_{x \to 0} x^2\sin\!\left(\frac{1}{x}\right) = 0` },
        {
          example: {
            title: { tr: "Sonsuzda rasyonel limit ve yatay asimptot", en: "Rational limit at infinity & horizontal asymptote" },
            problem: {
              tr: R`\(\lim_{x \to \infty} \frac{6x^2 - x + 4}{2x^2 + 3x}\) limitini ve yatay asimptotunu bulun.`,
              en: R`Find \(\lim_{x \to \infty} \frac{6x^2 - x + 4}{2x^2 + 3x}\) and its horizontal asymptote.`,
            },
            steps: [
              {
                expr: R`\frac{6x^2 - x + 4}{2x^2 + 3x} = \frac{6 - \frac{1}{x} + \frac{4}{x^2}}{2 + \frac{3}{x}}`,
                note: { tr: R`Pay ve paydayı en büyük kuvvet olan \(x^2\)'ye böleriz.`, en: R`Divide numerator and denominator by the highest power \(x^2\).` },
              },
              {
                expr: R`\lim_{x \to \infty} \frac{1}{x} = 0, \qquad \lim_{x \to \infty} \frac{4}{x^2} = 0`,
                note: { tr: R`\(x\) büyüdükçe paydada \(x\) bulunan tüm küçük parçalar sıfıra erir.`, en: R`As \(x\) grows without bound, every \(1/x\) and \(1/x^2\) term vanishes.` },
              },
              {
                expr: R`\frac{6 - 0 + 0}{2 + 0} = 3`,
                note: { tr: R`Yalnızca en yüksek dereceli terimlerin katsayı oranı kalır!`, en: R`Only the ratio of leading coefficients survives!` },
              },
            ],
            answer: { tr: R`Limit \(3\)'tür; yani \(y = 3\) yatay asimptottur.`, en: R`The limit is \(3\), giving the horizontal asymptote \(y = 3\).` },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: sin(1/x)'in tek başına limiti sanmak", en: "Common mistake: thinking sin(1/x) alone has a limit" },
            text: {
              tr: R`\(x^2\sin(1/x) \to 0\) olması, \(\sin(1/x)\)'in limiti olduğu anlamına <b>gelmez</b>! Başındaki \(x^2\) çarpanı olmadan \(\sin(1/x)\), sıfıra yaklaşırken \(-1\) ile \(+1\) arasında sonsuz kez gidip gelir ve hiçbir değere yerleşmez.`,
              en: R`Just because \(x^2\sin(1/x) \to 0\) does <b>not</b> mean \(\sin(1/x)\) has a limit! Without the damping factor \(x^2\), \(\sin(1/x)\) oscillates infinitely between \(-1\) and \(+1\) near \(0\) and never settles.`,
            },
          },
        },
        {
          tryList: [
            { tr: R`<b>x²·sin(1/x)</b> modunda yakınlaştırıcıyı artırın: mavi eğri ne kadar hızlı titreşirse titreşsin yeşil \(\pm x^2\) koridorunun dışına asla çıkamaz.`, en: R`In <b>x²·sin(1/x)</b> mode, zoom in: no matter how fast the blue curve oscillates, it stays trapped inside the green \(\pm x^2\) funnel.` },
            { tr: R`<b>sin(x)/x</b> moduna geçin: \(\cos x\) (alt sınır) ve \(1\) (üst sınır) sıfırda birleşerek limiti \(1\)'e kilitler.`, en: R`Switch to <b>sin(x)/x</b>: \(\cos x\) below and \(1\) above pinch together at \(0\), locking the limit to \(1\).` },
            { tr: R`<b>Asimptot</b> modunda uzaklaşın (zoom'u düşürün): \((2x+1)/(x-1)\) eğrisinin \(x = 1\) dikey duvarından kaçıp \(y = 2\) yatay çizgisine yapıştığını görün!`, en: R`In <b>Asymptote</b> mode, adjust zoom: see \((2x+1)/(x-1)\) blow up at the vertical wall \(x = 1\) and hug \(y = 2\) far away!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.sq ??= { ex: "x2sin", zoom: 1.5 });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        box.append(ctl, host, calc);
        const plot = createCanvas2D(host, { height: 265 });

        const draw = () => {
          if (s.ex === "x2sin") {
            const span = 1.6 / s.zoom;
            const yMax = Math.max(0.12, span * span * 1.15);
            plot.draw({
              x: [-span, span],
              y: [-yMax, yMax],
              xLabel: "x",
              yLabel: "y",
              areas: [{ f: (x) => x * x, g: (x) => -x * x, from: -span, to: span, fill: "rgba(27,175,122,0.12)" }],
              curves: [
                { f: (x) => x * x, color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: (x) => -x * x, color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: (x) => (Math.abs(x) < 1e-5 ? 0 : x * x * Math.sin(1 / x)), color: COLORS.c1, width: 2.3 },
              ],
              points: [{ x: 0, y: 0, color: COLORS.c2, r: 5.5, hollow: true, label: "L = 0" }],
            });
            calc.textContent = R`\(-x^2 \le x^2\sin(1/x) \le x^2 \implies \lim_{x \to 0} x^2\sin(1/x) = 0\)`;
          } else if (s.ex === "sinc") {
            const span = 2.8 / s.zoom;
            plot.draw({
              x: [-span, span],
              y: [0.35, 1.15],
              xLabel: "x",
              yLabel: "y",
              areas: [{ f: () => 1, g: (x) => Math.cos(x), from: -Math.min(span, 1.4), to: Math.min(span, 1.4), fill: "rgba(27,175,122,0.12)" }],
              curves: [
                { f: (x) => Math.cos(x), color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: () => 1, color: COLORS.c3, dash: [5, 4], width: 1.8 },
                { f: (x) => (Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x), color: COLORS.c1, width: 2.7 },
              ],
              points: [{ x: 0, y: 1, color: COLORS.c2, r: 5.5, hollow: true, label: "L = 1" }],
            });
            calc.textContent = R`\(\cos x \le \dfrac{\sin x}{x} \le 1 \implies \lim_{x \to 0}\dfrac{\sin x}{x} = 1\)`;
          } else {
            const span = 18 / s.zoom;
            plot.draw({
              x: [1 - span, 1 + span],
              y: [-5, 9],
              xLabel: "x",
              yLabel: "y",
              lines: [
                { a: 1, b: 0, c: -1, color: COLORS.c2, dash: [5, 4], width: 1.8, label: "x = 1" },
                { a: 0, b: 1, c: -2, color: COLORS.c3, dash: [5, 4], width: 1.8, label: "y = 2" },
              ],
              curves: [{ f: (x) => (Math.abs(x - 1) < 1e-4 ? NaN : (2 * x + 1) / (x - 1)), color: COLORS.c1, width: 2.6 }],
            });
            calc.textContent = R`\(f(x) = \dfrac{2x+1}{x-1}:\quad \text{${L({ tr: "Dikey", en: "Vertical" })}}\ x = 1,\quad \text{${L({ tr: "Yatay", en: "Horizontal" })}}\ \lim_{x \to \pm\infty} f(x) = 2\)`;
          }
        };
        ctl.append(
          segmented(
            [
              ["x2sin", "x²·sin(1/x)"],
              ["sinc", "sin(x)/x"],
              ["asym", { tr: "Asimptot", en: "Asymptote" }],
            ],
            s.ex,
            (v) => { s.ex = v; draw(); },
          ),
          slider(L({ tr: "Yakınlaştır", en: "Zoom" }), { min: 0.8, max: 5, step: 0.2, value: s.zoom, fmt: (v) => `${ns(v, 1)}×`, onInput: (v) => { s.zoom = v; draw(); } }),
        );
        draw();
      },
    },

    {
      id: "lim-continuity",
      mathId: "m-lim-ivt",
      title: { tr: "Süreklilik ve Ara Değer Teoremi (IVT)", en: "Continuity & The Intermediate Value Theorem (IVT)" },
      body: [
        {
          tr: R`Bir fonksiyonun \(x = a\)'da [[continuity|sürekli]] olması, grafiği \(a\)'dan geçerken <b>kalemi kâğıttan kaldırmadan</b> çizebilmek demektir. Matematiksel olarak bunun 3 parçalı bir kontrol listesi vardır: (1) \(f(a)\) tanımlı olacak, (2) \(\lim_{x \to a} f(x)\) var olacak, (3) bu ikisi <b>birbirine eşit</b> olacak!`,
          en: R`A function is [[continuity|continuous]] at \(x = a\) if you can trace its graph across \(a\) <b>without lifting your pencil</b>. Formally, three boxes must be checked: (1) \(f(a)\) is defined, (2) \(\lim_{x \to a} f(x)\) exists, and (3) they are <b>equal</b>!`,
        },
        {
          analogy: {
            title: { tr: "Dağa yürüyüş ve deniz seviyesi", en: "Hiking past every altitude" },
            text: {
              tr: R`Sabah deniz seviyesinin altında (\(-10\text{ m}\)) başlayıp ışınlanmadan yürüyerek akşama \(+100\text{ m}\) tepeye çıktıysanız, gün içinde tam \(0\text{ m}\) yüksekliğinden en az bir kez geçmiş olmak zorundasınız! İşte <b>Ara Değer Teoremi (IVT)</b> tam olarak budur: sürekli bir fonksiyon bir uçta negatif, diğer uçta pozitifse arada mutlaka bir yerde \(0\)'ı (kökü) keser.`,
              en: R`If you begin a hike below sea level (\(-10\text{ m}\)) and walk continuously without teleporting up to a \(+100\text{ m}\) ridge, you <i>must</i> cross \(0\text{ m}\) at least once! That is the <b>Intermediate Value Theorem (IVT)</b>: a continuous curve that changes sign on \([a, b]\) is guaranteed to cross zero somewhere inside \((a, b)\).`,
            },
          },
        },
        {
          eq: {
            tr: R`\lim_{x \to a} f(x) = f(a)\ (\text{sürekli}), \qquad f(a)\cdot f(b) < 0 \implies \exists\, c \in (a, b):\ f(c) = 0`,
            en: R`\lim_{x \to a} f(x) = f(a)\ (\text{continuous}), \qquad f(a)\cdot f(b) < 0 \implies \exists\, c \in (a, b):\ f(c) = 0`,
          },
        },
        {
          example: {
            title: { tr: "IVT ve ikiye bölme ile kök yakalamak", en: "Trapping a root via IVT & bisection" },
            problem: {
              tr: R`\(f(x) = x^3 + x - 1\) denkleminin \((0, 1)\) aralığında bir kökü olduğunu gösterin ve aralığı yarıya indirin.`,
              en: R`Show \(f(x) = x^3 + x - 1\) has a root in \((0, 1)\) and cut the search interval in half.`,
            },
            steps: [
              {
                expr: R`f(0) = -1 < 0, \qquad f(1) = 1 + 1 - 1 = +1 > 0`,
                note: { tr: R`Polinomlar her yerde süreklidir ve uçlarda işaret zıttır → IVT \((0, 1)\)'de kök garantiler.`, en: R`Polynomials are continuous everywhere and the signs flip → IVT guarantees a root in \((0, 1)\).` },
              },
              {
                expr: R`f(0{,}5) = (0{,}5)^3 + 0{,}5 - 1 = 0{,}125 - 0{,}5 = -0{,}375 < 0`,
                note: { tr: R`Tam orta nokta \(m = 0{,}5\)'te değer hâlâ negatif!`, en: R`At the midpoint \(m = 0.5\), the value is still negative!` },
              },
              {
                expr: R`f(0{,}5) < 0 < f(1) \implies c \in (0{,}5,\ 1)`,
                note: { tr: R`İşaret değişimi sağ yarıda kaldığı için kök kesinlikle \((0{,}5,\ 1)\)'dedir.`, en: R`The sign flip lives in the right half, so the root must lie in \((0.5, 1)\).` },
              },
            ],
            answer: { tr: R`Kök \((0{,}5,\ 1)\) aralığındadır (gerçek kök \(c \approx 0{,}6823\)).`, en: R`The root lies in \((0.5, 1)\) (exact root \(c \approx 0.6823\)).` },
          },
        },
        {
          tryList: [
            { tr: R`<b>Sürekli (x³+x−1)</b> modunda <b>İkiye böl</b> düğmesine 5 kez tıklayın: yeşil kafesin her adımda yarıya inerek kökü \(c \approx 0{,}682\)'ye nasıl kıstırdığını izleyin!`, en: R`In <b>Continuous (x³+x−1)</b> mode, click <b>Bisect 1 step</b> 5 times: watch the green bracket halve at each step to trap \(c \approx 0.682\)!` },
            { tr: R`<b>Sıçramalı (Süreksiz)</b> moduna geçin: \(f(0) < 0\) ve \(f(1) > 0\) olmasına rağmen fonksiyon \(y = 0\) üzerinden atlayıp geçer — süreklilik yoksa IVT garanti vermez!`, en: R`Switch to <b>Jump (Discontinuous)</b>: even though \(f(0) < 0\) and \(f(1) > 0\), the curve leaps right over \(y = 0\) — without continuity, IVT gives no guarantee!` },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.ivt ??= { mode: "cont", lo: 0, hi: 1, step: 0 });
        const fCont = (x) => x * x * x + x - 1;
        const fJump = (x) => (x < 0.5 ? 0.6 * x - 0.8 : 0.6 * x + 0.5);

        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, calc, msg);
        const plot = createCanvas2D(host, { height: 260 });

        const draw = () => {
          if (s.mode === "cont") {
            const m = (s.lo + s.hi) / 2;
            const flo = fCont(s.lo), fhi = fCont(s.hi), fm = fCont(m);
            plot.draw({
              x: [-0.2, 1.3],
              y: [-1.3, 1.5],
              xLabel: "x",
              yLabel: "f(x)",
              bands: [{ axis: "x", from: s.lo, to: s.hi, color: "rgba(27,175,122,0.16)", border: COLORS.c3 }],
              lines: [{ a: 0, b: 1, c: 0, color: COLORS.axis, width: 1.5 }],
              curves: [{ f: fCont, color: COLORS.c1, width: 2.7 }],
              points: [
                { x: s.lo, y: flo, color: COLORS.c2, r: 5, label: `a` },
                { x: s.hi, y: fhi, color: COLORS.c3, r: 5, label: `b` },
                { x: m, y: fm, color: COLORS.c4, r: 5.5, ring: true, label: `m=${ns(m, 3)}` },
              ],
            });
            calc.textContent = `\\([a,b] = [${tx(s.lo, 4)},\\ ${tx(s.hi, 4)}],\\quad m = ${tx(m, 4)},\\quad f(m) = ${tx(fm, 4)}\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Adım ${s.step}: f(a) = ${ns(flo, 3)} < 0 < f(b) = ${ns(fhi, 3)}. Kök kesinlikle genişliği ${ns(s.hi - s.lo, 4)} olan yeşil şeritte!`,
              en: `Step ${s.step}: f(a) = ${ns(flo, 3)} < 0 < f(b) = ${ns(fhi, 3)}. The root is trapped inside the green strip of width ${ns(s.hi - s.lo, 4)}!`,
            });
          } else {
            plot.draw({
              x: [-0.2, 1.3],
              y: [-1.3, 1.5],
              xLabel: "x",
              yLabel: "f(x)",
              lines: [{ a: 0, b: 1, c: 0, color: COLORS.bad, dash: [5, 4], width: 1.5, label: "y = 0" }],
              curves: [{ f: fJump, color: COLORS.c2, width: 2.7 }],
              points: [
                { x: 0, y: fJump(0), color: COLORS.c2, r: 5, label: "f(0) < 0" },
                { x: 1, y: fJump(1), color: COLORS.c3, r: 5, label: "f(1) > 0" },
                { x: 0.5, y: -0.5, color: COLORS.c2, r: 5, hollow: true },
                { x: 0.5, y: 0.8, color: COLORS.c2, r: 5 },
              ],
            });
            calc.textContent = R`\(f(0) = -0{,}8 < 0,\qquad f(1) = +1{,}1 > 0,\qquad \text{${L({ tr: "kök yok!", en: "no root!" })}}\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: `✕ Süreksiz fonksiyon x = 0,5'te y = 0 ekseninin üzerinden atlıyor! IVT yalnızca sürekli fonksiyonlar için geçerlidir.`,
              en: `✕ The discontinuous curve jumps right over y = 0 at x = 0.5! IVT only holds for continuous functions.`,
            });
          }
        };

        const stepBtn = h("button", { type: "button", class: "btn small primary", text: L({ tr: "İkiye böl (+1)", en: "Bisect (+1)" }) });
        const resetBtn = h("button", { type: "button", class: "btn small", text: L({ tr: "Sıfırla", en: "Reset" }) });
        stepBtn.addEventListener("click", () => {
          if (s.mode !== "cont" || s.step >= 12) return;
          const m = (s.lo + s.hi) / 2;
          if (fCont(m) < 0) s.lo = m;
          else s.hi = m;
          s.step++;
          draw();
        });
        resetBtn.addEventListener("click", () => {
          s.lo = 0;
          s.hi = 1;
          s.step = 0;
          draw();
        });

        ctl.append(
          segmented(
            [["cont", { tr: "Sürekli (x³+x−1)", en: "Continuous (x³+x−1)" }], ["jump", { tr: "Sıçramalı (Süreksiz)", en: "Jump (Discontinuous)" }]],
            s.mode,
            (v) => { s.mode = v; draw(); },
          ),
          stepBtn,
          resetBtn,
        );
        draw();
      },
    },
  ],

  playground: {
    title: { tr: "Limit, Belirsizlik ve Süreksizlik Laboratuvarı", en: "Limit, Indeterminate Forms & Discontinuity Lab" },
    sub: {
      tr: R`Hazır senaryolar arasında geçiş yapın ve yaklaşma mesafesi \(h = 10^{-k}\)'yı küçülterek sağ/sol limitlerin nasıl davrandığını canlı olarak gözlemleyin.`,
      en: R`Switch between classic limit scenarios and shrink the probe offset \(h = 10^{-k}\) to inspect left and right approaches live.`,
    },
    experiments: [
      { tr: R`<b>Delik (0/0)</b> senaryosunda \(k\)'yı \(1\)'den \(5\)'e çıkarın: \(f(1 - h)\) ve \(f(1 + h)\) değerlerinin \(1{,}99999\) ile \(2{,}00001\) olarak tam \(2\)'ye sıkıştığını görün.`, en: R`Pick <b>Removable (0/0)</b> and raise \(k\) from \(1\) to \(5\): watch \(f(1 - h)\) and \(f(1 + h)\) squeeze tightly to \(2\).` },
      { tr: R`<b>Sıçrama</b> senaryosunda \(k = 5\) yapın: noktalar mikroskobik kadar yakınlaşsa bile biri \(-1\), diğeri \(+1\) kalır.`, en: R`Pick <b>Jump</b> at \(k = 5\): even microscopically close to \(0\), left stays \(-1\) and right stays \(+1\).` },
      { tr: R`<b>Asimptot 1/x</b> ile <b>1/x²</b>'yi karşılaştırın: \(1/x\)'te sol \(-\infty\) ve sağ \(+\infty\) giderken, \(1/x^2\)'de her iki taraf birlikte \(+\infty\)'a fırlar!`, en: R`Compare <b>Asymptote 1/x</b> against <b>1/x²</b>: \(1/x\) splits to \(-\infty\) and \(+\infty\), whereas both sides of \(1/x^2\) soar together to \(+\infty\)!` },
      { tr: R`<b>Euler (1+x)^(1/x)</b> senaryosunda \(k = 5\) yapın: \(1^\infty\) belirsizliğinin \(1\) değil, gizemli \(e \approx 2{,}71828\) sayısına yakınsadığını keşfedin!`, en: R`Pick <b>Euler (1+x)^(1/x)</b> at \(k = 5\): discover that this \(1^\infty\) form settles not to \(1\), but to \(e \approx 2.71828\)!` },
    ],
    build(host, state) {
      const s = (state.pg ??= { kind: "hole", hExp: 2 });
      const cases = {
        hole: {
          label: { tr: "Delik (0/0)", en: "Removable (0/0)" },
          a: 1,
          f: (x) => (Math.abs(x - 1) < 1e-9 ? NaN : (x * x - 1) / (x - 1)),
          lim: "2",
          y: [-1, 5],
          note: { tr: R`0/0 belirsizliği çarpanlara ayırma ile çözülür: \((x^2-1)/(x-1) = x+1 \to 2\).`, en: R`The 0/0 hole cancels by factoring: \((x^2-1)/(x-1) = x+1 \to 2\).` },
        },
        jump: {
          label: { tr: "Sıçrama", en: "Jump" },
          a: 0,
          f: (x) => (x < 0 ? -1 : 1),
          lim: "∄",
          y: [-2.5, 2.5],
          note: { tr: R`Sol limit \(-1 \ne +1\) sağ limit → iki taraflı limit yoktur.`, en: R`Left limit \(-1 \ne +1\) right limit → two-sided limit does not exist.` },
        },
        asym: {
          label: { tr: "Asimptot 1/x", en: "Asymptote 1/x" },
          a: 0,
          f: (x) => (Math.abs(x) < 1e-9 ? NaN : 1 / x),
          lim: "−∞ / +∞",
          y: [-8, 8],
          note: { tr: R`Sıfıra soldan \(-\infty\), sağdan \(+\infty\) gider: dikey asimptot \(x = 0\).`, en: R`Blows up to \(-\infty\) on the left and \(+\infty\) on the right: vertical asymptote \(x = 0\).` },
        },
        asym2: {
          label: { tr: "Çift Asimptot 1/x²", en: "Even Asym. 1/x²" },
          a: 0,
          f: (x) => (Math.abs(x) < 1e-9 ? NaN : 1 / (x * x)),
          lim: "+∞",
          y: [-1, 12],
          note: { tr: R`Kare her zaman pozitif olduğu için her iki taraf birlikte \(+\infty\)'a çıkar.`, en: R`Because squares are positive, both sides shoot upward together to \(+\infty\).` },
        },
        euler: {
          label: { tr: "Euler (1+x)^(1/x)", en: "Euler (1+x)^(1/x)" },
          a: 0,
          f: (x) => (x > -1 && Math.abs(x) > 1e-8 ? (1 + x) ** (1 / x) : NaN),
          lim: "e ≈ 2.7183",
          y: [0, 5],
          note: { tr: R`Klasik \(1^\infty\) belirsizliği: bileşik faiz limiti olarak \(e \approx 2{,}71828\)'e yaklaşır.`, en: R`Classic \(1^\infty\) indeterminate form: approaches Euler's number \(e \approx 2.71828\).` },
        },
      };

      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);
      const plot = createCanvas2D(stage, { height: 375 });
      const presets = h("div", { class: "t-controls" });
      const ctl = h("div", { class: "t-controls" });
      const ctl2 = h("div", { class: "t-controls" });
      const tiles = h("div", { class: "pg-tiles" });
      const msg = h("p", { class: "pc-msg info" });
      side.append(
        h("div", { class: "mini-title", text: L({ tr: "Hazır senaryolar", en: "Quick presets" }) }),
        presets,
        ctl,
        ctl2,
        tiles,
        msg,
      );

      let seg, slK;
      const draw = () => {
        const cur = cases[s.kind];
        const eps = 10 ** -s.hExp;
        const leftV = cur.f(cur.a - eps);
        const rightV = cur.f(cur.a + eps);
        plot.draw({
          x: [cur.a - 3, cur.a + 3],
          y: cur.y,
          xLabel: "x",
          yLabel: "f(x)",
          lines: [{ a: 1, b: 0, c: -cur.a, color: COLORS.muted, dash: [4, 4] }],
          curves: [{ f: cur.f, color: COLORS.c1, width: 2.6 }],
          points: [
            ...(Number.isFinite(leftV) && leftV >= cur.y[0] && leftV <= cur.y[1] ? [{ x: cur.a - eps, y: leftV, color: COLORS.c3, r: 5.5 }] : []),
            ...(Number.isFinite(rightV) && rightV >= cur.y[0] && rightV <= cur.y[1] ? [{ x: cur.a + eps, y: rightV, color: COLORS.c2, r: 5.5 }] : []),
          ],
          hover: (x) => ({
            title: `x = ${ns(x, 3)}`,
            rows: [{ value: ns(cur.f(x), 4), label: "f(x)", color: COLORS.c1 }],
          }),
        });
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `f(a − 10⁻${s.hExp})` }), h("span", { class: "pg-tile-value", text: ns(leftV, 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: `f(a + 10⁻${s.hExp})` }), h("span", { class: "pg-tile-value", text: ns(rightV, 5) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "lim" }), h("span", { class: "pg-tile-value", text: cur.lim })),
        );
        msg.innerHTML = KIT.T(cur.note);
      };

      const applyPreset = (kind, hExp) => {
        s.kind = kind;
        s.hExp = hExp;
        seg.set(kind);
        slK.set(hExp);
        draw();
      };
      for (const [label, kind, hExp] of [
        [{ tr: "Basit Delik", en: "Simple Hole" }, "hole", 3],
        [{ tr: "Sıçrama (Limit Yok)", en: "Jump (No Limit)" }, "jump", 4],
        [{ tr: "Euler (1^∞)", en: "Euler (1^∞)" }, "euler", 5],
      ]) {
        const b = h("button", { type: "button", class: "btn small", text: L(label) });
        b.addEventListener("click", () => applyPreset(kind, hExp));
        presets.append(b);
      }

      seg = segmented(Object.entries(cases).map(([k, v]) => [k, v.label]), s.kind, (v) => { s.kind = v; draw(); });
      slK = slider("h = 10⁻ᵏ, k", { min: 1, max: 5, step: 1, value: s.hExp, fmt: (v) => String(v), onInput: (v) => { s.hExp = v; draw(); } });
      ctl.append(seg);
      ctl2.append(slK);
      draw();
    },
  },

  mathSections: [
    {
      id: "m-lim-algebra",
      title: { tr: "Limit Yasaları ve Belirsizlik Giderme Taktikleri", en: "Limit Laws & Indeterminate Form Tactics" },
      blocks: [
        {
          p: {
            tr: R`\(\lim_{x \to a} f(x) = L\) ve \(\lim_{x \to a} g(x) = M\) sonlu limitlerse, limit toplama, çıkarma, çarpma ve (payda \(M \ne 0\) iken) bölmeyi doğrudan içeri dağıtır. Belirsizlik çıktığında ise aşağıdaki temel taktikler işe yarar:`,
            en: R`Whenever \(\lim_{x \to a} f(x) = L\) and \(\lim_{x \to a} g(x) = M\) exist finitely, limits distribute over sums, differences, products, and quotients (when \(M \ne 0\)). When an indeterminate form appears, apply the right algebraic tactic:`,
          },
        },
        {
          table: {
            head: [
              { tr: "Belirsizlik türü", en: "Indeterminate form" },
              { tr: "Tipik örnek", en: "Classic example" },
              { tr: "Çözüm taktiği", en: "Resolution tactic" },
            ],
            rows: [
              [{ tr: R`\(\dfrac{0}{0}\) (polinom)`, en: R`\(\dfrac{0}{0}\) (polynomial)` }, R`\(\dfrac{x^2 - 4}{x - 2}\)`, { tr: R`Çarpanlara ayır ve \((x - a)\)'yı sadeleştir`, en: R`Factor and cancel \((x - a)\)` }],
              [{ tr: R`\(\dfrac{0}{0}\) (köklü)`, en: R`\(\dfrac{0}{0}\) (radical)` }, R`\(\dfrac{\sqrt{x+4}-2}{x}\)`, { tr: R`Eşlenikle çarp: \(\sqrt{x+4} + 2\)`, en: R`Multiply by the conjugate \(\sqrt{x+4} + 2\)` }],
              [R`\(\dfrac{\infty}{\infty}\)`, R`\(\dfrac{6x^3 - x}{2x^3 + 5}\)`, { tr: R`Pay ve paydayı en yüksek derece \(x^3\)'e böl`, en: R`Divide top & bottom by highest power \(x^3\)` }],
              [R`\(1^\infty\)`, R`\(\left(1 + \frac{1}{n}\right)^n\)`, { tr: R`Logaritma al veya Euler limitine çevir (\(e\))`, en: R`Take \(\ln\) or rewrite into Euler's limit \(e\)` }],
            ],
          },
        },
        {
          example: {
            title: { tr: "Eşlenikle köklü belirsizlik giderme", en: "Rationalizing a square-root 0/0 limit" },
            problem: { tr: R`\(\lim_{x \to 0} \frac{\sqrt{x + 4} - 2}{x}\) limitini bulun.`, en: R`Compute \(\lim_{x \to 0} \frac{\sqrt{x + 4} - 2}{x}\).` },
            steps: [
              { expr: R`\frac{\sqrt{x+4} - 2}{x} \cdot \frac{\sqrt{x+4} + 2}{\sqrt{x+4} + 2} = \frac{(x + 4) - 4}{x(\sqrt{x+4} + 2)}`, note: { tr: R`\((A - B)(A + B) = A^2 - B^2\) özdeşliği karekökü yok eder.`, en: R`\((A - B)(A + B) = A^2 - B^2\) eliminates the square root.` } },
              { expr: R`= \frac{x}{x(\sqrt{x+4} + 2)} = \frac{1}{\sqrt{x+4} + 2}`, note: { tr: R`\(x \ne 0\) olduğundan \(x\)'ler sadeleşir — \(0/0\) kayboldu!`, en: R`Since \(x \ne 0\), the \(x\) factors cancel — the \(0/0\) is gone!` } },
              { expr: R`\lim_{x \to 0} \frac{1}{\sqrt{x+4} + 2} = \frac{1}{2 + 2} = \frac{1}{4}`, note: { tr: R`Artık \(x = 0\) doğrudan yerine konur.`, en: R`Now substitute \(x = 0\) directly.` } },
            ],
            answer: { tr: R`\(\frac{1}{4} = 0{,}25\).`, en: R`\(\frac{1}{4} = 0.25\).` },
          },
        },
        {
          callout: "warn",
          title: { tr: "c / 0 bir belirsizlik değildir!", en: "c / 0 (with c ≠ 0) is NOT indeterminate!" },
          text: {
            tr: R`Pay \(c \ne 0\) ve payda \(0\)'a gidiyorsa (örneğin \(\frac{5}{x-1}\)), sonuç mutlaka \(\pm\infty\) (veya limit yok) çıkar — sadeleştirme ile kurtarılamaz! Yalnızca \(\frac{0}{0}\) gibi iki gücün yarıştığı durumlar belirsizliktir.`,
            en: R`When the numerator tends to \(c \ne 0\) and the denominator tends to \(0\) (e.g. \(\frac{5}{x-1}\)), the ratio always blows up to \(\pm\infty\) — it is not an indeterminate form.`,
          },
        },
      ],
    },
    {
      id: "m-lim-ed",
      title: { tr: "ε–δ Kesin Tanımı ve Adım Adım İspat", en: "Formal ε–δ Definition & Step-by-Step Proof" },
      blocks: [
        {
          p: {
            tr: R`Bir \(\varepsilon\)–\(\delta\) ispatının altın stratejisi basittir: <b>sondan başa çalış</b>! Önce \(|f(x) - L|\) ifadesini \(|x - a|\) cinsinden büyüt, oradan uygun \(\delta\)'yı seç ve ileri doğru kontrol et.`,
            en: R`The golden strategy for any \(\varepsilon\)–\(\delta\) proof is to <b>work backward first</b>: express \(|f(x) - L|\) in terms of \(|x - a|\) to discover the right \(\delta\), then write the forward verification cleanly.`,
          },
        },
        {
          derive: {
            title: { tr: "lim_{x→3} (2x − 1) = 5 ispatı", en: "Proof that lim_{x→3} (2x − 1) = 5" },
            steps: [
              { tex: R`|(2x - 1) - 5| = |2x - 6| = 2|x - 3|`, why: { tr: R`Hedefimiz olan \(|f(x) - L|\) ifadesini girdi farkı \(|x - 3|\) cinsinden sadeleştirdik.`, en: R`Rewrite our target error \(|f(x) - L|\) in terms of the input distance \(|x - 3|\).` } },
              { tex: R`2|x - 3| < \varepsilon \iff |x - 3| < \frac{\varepsilon}{2}`, why: { tr: R`Eşitsizliği \(|x - 3|\) için çözdüğümüzde \(\delta\)'nın \(\varepsilon/2\) olması gerektiğini görürüz.`, en: R`Solving for \(|x - 3|\) reveals that \(\delta = \varepsilon / 2\) will do the job.` } },
              { tex: { tr: R`\text{Seçim: } \delta = \frac{\varepsilon}{2} \implies \Big(0 < |x - 3| < \delta \Rightarrow |(2x-1) - 5| = 2|x-3| < 2\cdot\frac{\varepsilon}{2} = \varepsilon\Big)`, en: R`\text{Choose } \delta = \frac{\varepsilon}{2} \implies \Big(0 < |x - 3| < \delta \Rightarrow |(2x-1) - 5| = 2|x-3| < 2\cdot\frac{\varepsilon}{2} = \varepsilon\Big)` }, why: { tr: R`Her \(\varepsilon > 0\) için geçerli bir \(\delta\) ürettik; ispat tamamlandı!`, en: R`This works for every \(\varepsilon > 0\), completing the rigorous proof!` } },
            ],
          },
        },
        {
          example: {
            title: { tr: "Doğrusal olmayan örnek: lim_{x→2} x² = 4", en: "Nonlinear example: lim_{x→2} x² = 4" },
            problem: { tr: R`Eğim sabit değilken \(|x^2 - 4| = |x + 2|\,|x - 2| < \varepsilon\) nasıl kontrol edilir?`, en: R`When the slope varies, how do we control \(|x^2 - 4| = |x + 2|\,|x - 2| < \varepsilon\)?` },
            steps: [
              { expr: { tr: R`\text{Ön kısıt: } \delta \le 1 \implies 1 < x < 3 \implies |x + 2| < 5`, en: R`\text{First cap } \delta \le 1 \implies 1 < x < 3 \implies |x + 2| < 5` }, note: { tr: R`Önce \(\delta\)'nın \(1\)'i geçmeyeceğine söz veririz; böylece \(|x + 2|\) çarpanı en fazla \(5\) olur!`, en: R`First promise \(\delta \le 1\); then \(x\) stays in \((1, 3)\), capping \(|x + 2| < 5\)!` } },
              { expr: R`|x^2 - 4| = |x + 2|\,|x - 2| < 5|x - 2| < \varepsilon \iff |x - 2| < \frac{\varepsilon}{5}`, note: { tr: R`Artık üst sınırı \(5\) olan sabit çarpanlı bir eşitsizlik elde ettik.`, en: R`Now we have a simple constant-factor bound \(5|x - 2| < \varepsilon\).` } },
              { expr: R`\delta = \min\!\left(1,\ \frac{\varepsilon}{5}\right)`, note: { tr: R`İki koşulun da aynı anda sağlanması için ikisinin küçüğünü seçeriz!`, en: R`Take the smaller of the two bounds so both conditions hold simultaneously!` } },
            ],
            answer: { tr: R`\(\delta = \min(1,\ \varepsilon / 5)\) her \(\varepsilon > 0\) için \(\lim_{x \to 2} x^2 = 4\)'ü ispatlar.`, en: R`\(\delta = \min(1,\ \varepsilon / 5)\) proves \(\lim_{x \to 2} x^2 = 4\) for every \(\varepsilon > 0\).` },
          },
        },
      ],
    },
    {
      id: "m-lim-sinx",
      title: { tr: "Temel Trigonometrik ve Üstel Limitler (Sandviç İspatı)", en: "Landmark Trig & Exponential Limits (Squeeze Proof)" },
      blocks: [
        { eq: R`\lim_{x \to 0}\frac{\sin x}{x} = 1, \qquad \lim_{x \to 0}\frac{1 - \cos x}{x} = 0, \qquad \lim_{x \to 0}\frac{e^x - 1}{x} = 1, \qquad \lim_{n \to \infty}\left(1 + \frac{1}{n}\right)^n = e` },
        {
          derive: {
            title: { tr: "Birim çember alanlarıyla lim_{x→0} sin(x)/x = 1 ispatı", en: "Geometric proof of lim_{x→0} sin(x)/x = 1" },
            steps: [
              { tex: R`\frac{1}{2}\sin x < \frac{1}{2}x < \frac{1}{2}\tan x \quad \Big(0 < x < \frac{\pi}{2}\Big)`, why: { tr: R`Yarıçapı \(1\) olan çemberde: iç üçgen alanı &lt; daire dilimi alanı &lt; dış dik üçgen alanı (açı \(x\) <b>radyan</b> cinsindendir!).`, en: R`On the unit circle (with \(x\) in <b>radians</b>): inner triangle area &lt; sector area &lt; outer right-triangle area.` } },
              { tex: R`1 < \frac{x}{\sin x} < \frac{1}{\cos x} \implies \cos x < \frac{\sin x}{x} < 1`, why: { tr: R`Pozitif \(\frac{1}{2}\sin x\)'e bölüp ters çevirince eşitsizlikler yön değiştirir; çift fonksiyon olduğundan \(x < 0\) için de geçerlidir.`, en: R`Divide by \(\frac{1}{2}\sin x > 0\) and take reciprocals (flipping inequalities); even symmetry extends this to \(x < 0\).` } },
              { tex: { tr: R`\lim_{x \to 0}\cos x = 1 \text{ ve } \lim_{x \to 0} 1 = 1 \implies \lim_{x \to 0}\frac{\sin x}{x} = 1`, en: R`\lim_{x \to 0}\cos x = 1 \text{ and } \lim_{x \to 0} 1 = 1 \implies \lim_{x \to 0}\frac{\sin x}{x} = 1` }, why: { tr: R`Alt sınır da üst sınır da \(1\)'e gittiğinden Sandviç Teoremi limiti \(1\)'e kilitler!`, en: R`Since both outer bounds converge to \(1\), the Squeeze Theorem forces \(\sin(x)/x \to 1\)!` } },
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Neden derece değil, radyan?", en: "Why radians instead of degrees?" },
          text: {
            tr: R`Daire diliminin alanı yalnızca \(x\) <b>radyan</b> cinsinden ölçüldüğünde \(\frac{1}{2} r^2 x\) olur! Derece kullansaydık \(\lim_{x \to 0}\frac{\sin x^\circ}{x} = \frac{\pi}{180}\) çıkardı — kalkülüsteki tüm sade trigonometrik formüllerin sebebi radyan ölçüsüdür.`,
            en: R`The sector area equals \(\frac{1}{2} r^2 x\) only when \(x\) is measured in <b>radians</b>! In degrees we would get \(\pi/180\) — radian measure is the secret behind every clean trig formula in calculus.`,
          },
        },
      ],
    },
    {
      id: "m-lim-ivt",
      title: { tr: "Süreksizlik Türleri ve Ara Değer Teoremi (IVT)", en: "Discontinuity Types & Intermediate Value Theorem" },
      blocks: [
        {
          p: {
            tr: R`Bir fonksiyonun bir noktada sürekli olmaması 3 temel biçimde karşımıza çıkar; hangi tür olduğunu tanımak grafik çizerken ve integral alırken büyük hız kazandırır:`,
            en: R`When continuity fails at \(x = a\), it falls into one of three recognizable geometric types:`,
          },
        },
        {
          table: {
            head: [
              { tr: "Süreksizlik türü", en: "Discontinuity type" },
              { tr: "Görsel görünüm", en: "Visual signature" },
              { tr: "Klasik örnek", en: "Classic example" },
            ],
            rows: [
              [{ tr: "Kaldırılabilir (Delik)", en: "Removable (Hole)" }, { tr: R`İki taraflı limit var ama \(f(a)\) yok veya farklı`, en: R`Two-sided limit exists, but \(f(a)\) is missing or shifted` }, R`\(\dfrac{x^2-1}{x-1}\)`],
              [{ tr: "Sıçrama (Basamak)", en: "Jump (Step)" }, { tr: R`Sağ ve sol limitler sonlu ama farklı`, en: R`Left & right limits are finite but unequal` }, R`\(\dfrac{|x|}{x}\)`],
              [{ tr: "Sonsuz (Asimptot)", en: "Infinite (Asymptote)" }, { tr: R`En az bir taraf \(\pm\infty\)'a fırlar`, en: R`At least one side blows up to \(\pm\infty\)` }, R`\(\dfrac{1}{x}\)`],
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Ara Değer Teoremi (IVT) özeti", en: "Intermediate Value Theorem (IVT) summary" },
          text: {
            tr: R`\(f\) kapalı \([a, b]\) aralığında sürekli ve \(y_0\) sayısı \(f(a)\) ile \(f(b)\) arasında herhangi bir değerse, \(f(c) = y_0\) sağlayan en az bir \(c \in (a, b)\) vardır. Özel olarak \(f(a)\) ve \(f(b)\) zıt işaretliyse \((a, b)\)'de mutlaka en az bir kök vardır!`,
            en: R`If \(f\) is continuous on closed \([a, b]\) and \(y_0\) lies between \(f(a)\) and \(f(b)\), then \(f(c) = y_0\) for at least one \(c \in (a, b)\). In particular, opposite signs at \(a\) and \(b\) guarantee at least one root in \((a, b)\)!`,
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
