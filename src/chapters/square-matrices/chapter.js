import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { det2, det3, inv2, invMatrix, matMul, matTranspose, matVec, vNorm } from "../../engines/math-core.ts";
import { matToTex, matrixInput } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

const isOrthogonal = (M, eps = 1e-3) => {
  const n = M.length;
  const prod = matMul(matTranspose(M), M);
  return prod.every((row, i) => row.every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < eps));
};

mountChapter({
  intro: {
    id: "sq-intro",
    title: {
      tr: "Kare Matrisler: Determinant, Ters Matris ve Ortogonal Dönmeler",
      en: "Square Matrices: Determinants, Inverses & Orthogonal Maps",
    },
    paragraphs: [
      {
        tr: R`Satır ve sütun sayısı birbirine eşit olan \(n\times n\) matrisler (<b>kare matrisler</b>) özel bir süper güce sahiptir: bir uzayı <em>kendi içine</em> dönüştürürler (2B'yi 2B'ye, 3B'yi 3B'ye). Bu sayede şu üç temel soruyu sorabiliriz: dönüşüm alanı/hacmi kaç kat büyüttü? İşlemi tam olarak geri alabilir miyiz? Uzunluk ve açıları hiç bozmadan sadece döndürme/yansıtma mı yaptı?`,
        en: R`When a matrix has equal rows and columns (\(n\times n\), a <b>square matrix</b>), it gains a superpower: it maps a space <em>back into itself</em> (2D to 2D, 3D to 3D). That lets us ask three natural questions: how much did areas or volumes stretch? Can we undo the map? Did it preserve all lengths and angles like a rigid motion?`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> [[determinant|determinantı]] \(\det(A)\) ("\(A\)'nın determinantı") tek bakışta yönlü alan ölçeği olarak okuyacak, \(\det(A) = 0\) olduğunda [[inverse-matrix|ters matrisin]] \(A^{-1}\) ("\(A\) ters") neden yok olduğunu görecek ve [[orthogonal-matrix|ortogonal matrislerin]] (\(Q^T Q = I\)) neden en temiz dönüşümler olduğunu ispatlayacaksınız.`,
        en: R`<b>By the end of this chapter</b> you will read the [[determinant|determinant]] \(\det(A)\) ("det of \(A\)") as a signed area/volume factor, see why \(\det(A) = 0\) makes the [[inverse-matrix|inverse]] \(A^{-1}\) ("\(A\) inverse") impossible, and prove why [[orthogonal-matrix|orthogonal matrices]] (\(Q^T Q = I\)) preserve every length and angle.`,
      },
    ],
    analogy: {
      title: {
        tr: "Lastik Çarşafın Alan Çarpanı ve Geri Sarma (Ctrl+Z) Düğmesi",
        en: "The Rubber-Sheet Area Multiplier & Undo (Ctrl+Z) Button",
      },
      text: {
        tr: R`Esnek bir lastik çarşafın üstüne \(1\times 1\)'lik bir kare etiket yapıştırdığınızı düşünün. Çarşafı bir kare matris \(A\) ile büktüğünüzde: <b>1) Determinant \(\det(A)\)</b>, etiketin yeni alanının kaç katına çıktığını (ve çarşaf ters yüz edildiyse önüne eksi işareti konmuş hâlini) söyleyen tek sayıdır. <b>2) Ters matris \(A^{-1}\)</b>, çarşafı eski hâline getiren <b>Ctrl+Z (Geri Al)</b> tuşudur — ama çarşafı incecik bir çizgiye ezdiyseniz (\(\det(A) = 0\)), artık geri saramazsınız! <b>3) Ortogonal matris \(Q\)</b> ise çarşafı hiç esnetmeyen, yalnızca katı bir tahta levha gibi döndüren veya ayna gibi çeviren harekettir.`,
        en: R`Imagine sticking a \(1\times 1\) square sticker onto a stretchy rubber sheet and warping it with a square matrix \(A\). <b>1) The determinant \(\det(A)\)</b> is the single number telling you the sticker's new area factor (with a minus sign if you flipped the sheet over!). <b>2) The inverse \(A^{-1}\)</b> is the <b>Undo (Ctrl+Z)</b> button — impossible if you squashed the sheet completely flat into a 1D line (\(\det(A) = 0\))! <b>3) An orthogonal matrix \(Q\)</b> never stretches at all — it spins or flips space like a rigid wooden board.`,
      },
    },
    summary: [
      [
        { tr: "Ders", en: "Lecture" },
        { tr: "Ders 7 · Kare Matrisler", en: "Lecture 7 · Square Matrices" },
      ],
      [
        { tr: "Determinantın anlamı", en: "Meaning of det(A)" },
        { tr: "Yönlü alan (2B) / hacim (3B) ölçekleme çarpanı", en: "Signed area (2D) / volume (3D) scaling factor" },
      ],
      [
        { tr: "Tersinirlik koşulu", en: "Invertibility test" },
        {
          tr: R`\(A^{-1}\text{ var} \iff \det(A) \ne 0\)`,
          en: R`\(A^{-1}\text{ exists} \iff \det(A) \ne 0\)`,
        },
      ],
      [
        { tr: "Katı hareketler", en: "Rigid motions" },
        {
          tr: R`Ortogonal: \(Q^T Q = I \implies Q^{-1} = Q^T,\ \det(Q) = \pm 1\)`,
          en: R`Orthogonal: \(Q^T Q = I \implies Q^{-1} = Q^T,\ \det(Q) = \pm 1\)`,
        },
      ],
    ],
    tip: {
      title: { tr: "Tekil (Singular) kelimesi ne demek?", en: "What does 'singular' mean in plain words?" },
      text: {
        tr: R`Bir matrise "tekil" (singüler) dendiğinde aklınıza tek bir resim gelsin: <b>boyut çöktü, alan sıfıra indi (\(\det(A) = 0\)) ve geri dönüş yok!</b> Tersinir (regüler / nonsingular) ise bunun tam tersidir: \(\det(A) \ne 0\).`,
        en: R`Whenever you hear "singular matrix," picture one image: <b>space collapsed flat to zero area (\(\det(A) = 0\)) with no way to undo it!</b> "Invertible" (nonsingular) is the exact opposite: \(\det(A) \ne 0\).`,
      },
    },
  },

  sections: [
    {
      id: "sq-det",
      mathId: "m-sq-det",
      title: {
        tr: "Determinant = Yönlü Alan (ve Hacim) Ölçekleme Çarpanı",
        en: "Determinant = Signed Area (and Volume) Scaling Factor",
      },
      body: [
        {
          tr: R`Birim karenin kenarları \(\mathbf e_1 = (1,0)\) ile \(\mathbf e_2 = (0,1)\) ve alanı tam \(1\)'dir. \(A = \begin{bmatrix}a & b\\ c & d\end{bmatrix}\) dönüşümünü uyguladığımızda bu kare, kenarları \(A\)'nın sütunları \(\mathbf a_1 = (a, c)\) ve \(\mathbf a_2 = (b, d)\) olan bir paralelkenara dönüşür. İşte bu paralelkenarın <b>yönlü alanı</b> tam olarak [[determinant|determinanttır]]: \(\det(A) = ad - bc\)!`,
          en: R`The unit square spanned by \(\mathbf e_1 = (1,0)\) and \(\mathbf e_2 = (0,1)\) has area \(1\). Under \(A = \begin{bmatrix}a & b\\ c & d\end{bmatrix}\), it transforms into the parallelogram formed by columns \(\mathbf a_1 = (a, c)\) and \(\mathbf a_2 = (b, d)\). The <b>signed area</b> of that parallelogram is literally the [[determinant|determinant]]: \(\det(A) = ad - bc\)!`,
        },
        {
          analogy: {
            title: { tr: "İşaret (+, 0, −) ne anlatıyor?", en: "What do the three signs (+, 0, −) tell us?" },
            text: {
              tr: R`<b>\(\det(A) > 0\):</b> Şeklin yüzü hâlâ yukarı bakıyor (yönelim korundu), alan \(\det(A)\) katına çıktı. <b>\(\det(A) < 0\):</b> Kâğıdı ters çevirmiş gibi ayna yansıması oldu (yönelim terslendi), alan \(|\det(A)|\) katına çıktı. <b>\(\det(A) = 0\):</b> İki sütun üst üste veya aynı doğruya düştü, paralelkenar ezilip çizgiye döndü — alan sıfırlandı!`,
              en: R`<b>\(\det(A) > 0\):</b> the sheet stays face-up (orientation preserved) and areas scale by \(\det(A)\). <b>\(\det(A) < 0\):</b> the sheet flipped upside-down like a mirror (orientation reversed) and areas scale by \(|\det(A)|\). <b>\(\det(A) = 0\):</b> both columns lie on the same line, crushing the parallelogram flat to zero area!`,
            },
          },
        },
        {
          eq: {
            tr: R`\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc, \qquad \text{Alan} = |\det(A)|`,
            en: R`\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc, \qquad \text{Area} = |\det(A)|`,
          },
        },
        {
          tr: R`Notasyon uyarısı: determinant bazen \(\det(A)\) yerine \(|A|\) biçiminde düz çizgilerle de yazılır. Bu sakın "mutlak değer" ile karıştırılmasın — determinant rahatlıkla <b>negatif</b> çıkabilir!`,
          en: R`Notation heads-up: \(\det(A)\) is sometimes written with vertical bars as \(|A|\). Do NOT mistake this for absolute value — a determinant can easily be <b>negative</b>!`,
        },
        {
          example: {
            title: { tr: "2×2 determinant hesaplama ve geometrik yorum", en: "Computing a 2×2 determinant & reading its geometry" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 3 & 1 \\ 2 & 4 \end{bmatrix}\) matrisinin determinantını hesaplayın ve düzlemin alanına etkisini yorumlayın.`,
              en: R`Compute \(\det(A)\) for \(A = \begin{bmatrix} 3 & 1 \\ 2 & 4 \end{bmatrix}\) and describe what \(A\) does to areas in the plane.`,
            },
            steps: [
              {
                expr: R`a\cdot d = 3 \cdot 4 = 12`,
                note: {
                  tr: R`Ana köşegen (sol üstten sağ alta) elemanlarını çarpıyoruz.`,
                  en: R`Multiply along the main diagonal (top-left to bottom-right).`,
                },
              },
              {
                expr: R`b\cdot c = 1 \cdot 2 = 2`,
                note: {
                  tr: R`Ters köşegen (sağ üstten sol alta) elemanlarını çarpıyoruz.`,
                  en: R`Multiply along the off-diagonal (top-right to bottom-left).`,
                },
              },
              {
                expr: R`\det(A) = ad - bc = 12 - 2 = 10`,
                note: {
                  tr: R`Sonuç \(10 > 0\): düzlemdeki her şeklin alanı tam \(10\) katına çıkar, yönelim terslenmez ve \(A\) tersinirdir!`,
                  en: R`Result is \(10 > 0\): every shape in the plane grows to \(10\times\) its area, orientation stays intact, and \(A\) is invertible!`,
                },
              },
            ],
            answer: {
              tr: R`\(\det(A) = 10\) (alan \(10\) kat büyür, yönelim korunur).`,
              en: R`\(\det(A) = 10\) (area scales by \(10\), orientation preserved).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Klasik sınav tuzağı: det(cA) ≠ c det(A) ve det(A+B) ≠ det(A)+det(B)!", en: "Classic exam trap: det(cA) ≠ c det(A) and det(A+B) ≠ det(A)+det(B)!" },
            text: {
              tr: R`Bir \(2\times 2\) matrisi \(3\) ile çarptığınızda hem eni hem boyu \(3\) kat uzar; dolayısıyla alan \(3^2 = 9\) kat büyür! Genel \(n\times n\) matriste <b>\(\det(cA) = c^n \det(A)\)</b> olur. Ayrıca determinant toplamaya <b>asla</b> dağılmaz: \(\det(I_2 + I_2) = \det(2I_2) = 4 \ne 1 + 1 = 2\)!`,
              en: R`Multiplying a \(2\times 2\) matrix by \(3\) triples BOTH width and height, so area multiplies by \(3^2 = 9\)! In general for \(n\times n\), <b>\(\det(cA) = c^n \det(A)\)</b>. And determinants are NEVER additive: \(\det(I_2 + I_2) = \det(2I_2) = 4 \ne 1 + 1 = 2\)!`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>Pozitif</b>, <b>Çökme (det = 0)</b> ve <b>Ayna (det < 0)</b> düğmelerini sırayla deneyin; paralelkenarın renginin yeşilden kırmızıya ve turuncuya nasıl döndüğünü izleyin.`,
              en: R`Click <b>Positive</b>, <b>Collapse (det = 0)</b>, and <b>Flip (det < 0)</b> to watch the parallelogram switch from green to red to orange.`,
            },
            {
              tr: R`Yeşil \(\mathbf a_2\) ucunu mavi \(\mathbf a_1\) doğrusunun bir tarafından diğer tarafına yavaşça geçirin: tam çizgi üstündeyken \(\det(A) = 0\) olup diğer tarafta eksiye döndüğünü görün!`,
              en: R`Slowly drag the green \(\mathbf a_2\) tip across the line of \(\mathbf a_1\): watch \(\det(A)\) hit \(0\) right on the line and flip negative on the far side!`,
            },
            {
              tr: R`<b>Kaydırma (Shear)</b> düğmesine basın: kare yana ciddi biçimde yatmasına rağmen taban ve yüksekliği \(1\) kaldığı için \(\det(A) = 1\) hiç değişmez!`,
              en: R`Click <b>Shear</b>: even though the square leans sharply sideways, its base and height stay \(1\), so \(\det(A) = 1\) stays unchanged!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.det ??= { c1: [2, 0.5], c2: [0.5, 1.5], preset: "pos" });
        const presets = {
          pos: { label: { tr: "Pozitif (det > 0)", en: "Positive (det > 0)" }, c1: [2, 0.5], c2: [0.5, 1.5] },
          shear: { label: { tr: "Kaydırma (det = 1)", en: "Shear (det = 1)" }, c1: [1, 0], c2: [1.5, 1] },
          collapse: { label: { tr: "Çökme (det = 0)", en: "Collapse (det = 0)" }, c1: [2, 1], c2: [1, 0.5] },
          flip: { label: { tr: "Ayna (det < 0)", en: "Flip (det < 0)" }, c1: [0.5, 1.8], c2: [2, 0.4] },
        };
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, calc, msg);

        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "Sütun vektörlerini (a₁ ve a₂) sürükleyin", en: "Drag column tips a₁ and a₂" }),
        });

        let seg = null;
        const draw = () => {
          const A = [
            [s.c1[0], s.c2[0]],
            [s.c1[1], s.c2[1]],
          ];
          const d = det2(A);
          const sum = [s.c1[0] + s.c2[0], s.c1[1] + s.c2[1]];
          const fill =
            Math.abs(d) < 0.08
              ? "rgba(208,59,59,0.25)"
              : d > 0
                ? "rgba(27,175,122,0.22)"
                : "rgba(235,104,52,0.24)";
          plot.draw({
            x: [-3.5, 4.2],
            y: [-3, 4.2],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            polygons: [
              { pts: [[0, 0], [1, 0], [1, 1], [0, 1]], stroke: COLORS.muted, dash: [4, 3], width: 1.4 },
              {
                pts: [[0, 0], s.c1, sum, s.c2],
                fill,
                stroke: Math.abs(d) < 0.08 ? COLORS.bad : d > 0 ? COLORS.c3 : COLORS.c2,
                width: 2.2,
              },
            ],
            vectors: [
              { to: s.c1, color: COLORS.c1, label: "a₁" },
              { to: s.c2, color: COLORS.c3, label: "a₂" },
            ],
            handles: [
              {
                id: "c1",
                x: s.c1[0],
                y: s.c1[1],
                color: COLORS.c1,
                onDrag: (x, y) => {
                  s.c1 = [x, y];
                  s.preset = "custom";
                  seg?.set("custom");
                  draw();
                },
              },
              {
                id: "c2",
                x: s.c2[0],
                y: s.c2[1],
                color: COLORS.c3,
                onDrag: (x, y) => {
                  s.c2 = [x, y];
                  s.preset = "custom";
                  seg?.set("custom");
                  draw();
                },
              },
            ],
          });
          calc.textContent = `\\(A = ${matToTex(A)},\\quad \\det(A) = (${tx(A[0][0], 2)})(${tx(A[1][1], 2)}) - (${tx(A[0][1], 2)})(${tx(A[1][0], 2)}) = ${tx(d, 2)}\\)`;
          if (Math.abs(d) < 0.08) {
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "Tekil matris (det ≈ 0): paralelkenar düz bir çizgiye çöktü, alan = 0 ve A⁻¹ YOK!",
              en: "Singular matrix (det ≈ 0): parallelogram collapsed flat, area = 0, and A⁻¹ DOES NOT EXIST!",
            });
          } else if (d > 0) {
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `det > 0: yönelim korundu ve alan ${ns(d, 2)} katına çıktı. Matris tersinir!`,
              en: `det > 0: orientation preserved and area scaled by ${ns(d, 2)}. Invertible!`,
            });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({
              tr: `det < 0: yönelim terslendi (ayna çevirmesi), alan çarpanı ${ns(Math.abs(d), 2)}. Tersinir!`,
              en: `det < 0: orientation flipped (mirror), area factor ${ns(Math.abs(d), 2)}. Invertible!`,
            });
          }
        };

        seg = segmented(
          Object.entries(presets).map(([k, v]) => [k, v.label]),
          s.preset,
          (k) => {
            s.preset = k;
            s.c1 = [...presets[k].c1];
            s.c2 = [...presets[k].c2];
            draw();
          },
        );
        ctl.append(seg);
        draw();
      },
    },

    {
      id: "sq-inv",
      mathId: "m-sq-inv",
      title: {
        tr: "Tersinir ve Tekil Matrisler: Dönüşümü Geri Alma (A⁻¹)",
        en: "Invertible vs. Singular Matrices: Undoing a Map (A⁻¹)",
      },
      body: [
        {
          tr: R`Bir \(n\times n\) matrisi \(A\) için \(A A^{-1} = A^{-1} A = I_n\) koşulunu sağlayan bir \(A^{-1}\) matrisi varsa \(A\)'ya <b>tersinir</b> (regüler) denir. \(A^{-1}\) sembolü "\(A\) ters" diye okunur (sakın \(\tfrac{1}{A}\) gibi sayı bölmesi sanmayın — matrise bölme diye bir işlem yoktur!). Eğer \(A\mathbf x = \mathbf b\) denkleminde \(A\) tersinirse her iki tarafı soldan \(A^{-1}\) ile çarparak çözümü tek hamlede buluruz: \(\mathbf x = A^{-1}\mathbf b\).`,
          en: R`An \(n\times n\) matrix \(A\) is <b>invertible</b> if there exists a matrix \(A^{-1}\) (read aloud: "\(A\) inverse" — NOT \(1/A\)!) satisfying \(A A^{-1} = A^{-1} A = I_n\). Whenever \(A\) is invertible, solving \(A\mathbf x = \mathbf b\) takes one clean step: multiply both sides on the left by \(A^{-1}\) to get \(\mathbf x = A^{-1}\mathbf b\).`,
        },
        {
          analogy: {
            title: { tr: "Geri Al (Ctrl+Z) tuşu neden bazen çalışmaz?", en: "Why Ctrl+Z works on some maps and fails on others" },
            text: {
              tr: R`Bir fotoğrafı \(45^\circ\) döndürdüğünüzde veya 2 kat büyüttüğünüzde hiçbir piksel bilgisi kaybolmaz — tam tersini yaparak (\(-45^\circ\) döndür veya yarıya küçült) orijinale dönebilirsiniz. Ama tüm fotoğrafı tek bir çizgiye ezdiyseniz (\(\det(A) = 0\)), pek çok farklı nokta üst üste binmiş ve bilgi sonsuza dek silinmiştir — hiçbir \(A^{-1}\) makinesi o noktaları geri ayıramaz!`,
              en: R`Rotating a photo by \(45^\circ\) or zooming in by \(2\times\) loses zero information — just rotate by \(-45^\circ\) or zoom out by \(\tfrac{1}{2}\) to undo it. But squashing a 2D image onto a 1D line (\(\det(A) = 0\)) merges infinitely many points onto the same spot, destroying information forever — no \(A^{-1}\) can ever un-squash it!`,
            },
          },
        },
        {
          eq: R`A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \implies A^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix} \qquad (ad - bc \ne 0)`,
        },
        {
          tr: R`\(2\times 2\) ters matris formülünü ezberlemenin en kolay yolu şu üç adımdır: <b>(1)</b> Ana köşegendeki \(a\) ile \(d\)'yi yer değiştir, <b>(2)</b> Ters köşegendeki \(b\) ile \(c\)'nin işaretini çevir, <b>(3)</b> Her şeyi \(\det(A) = ad - bc\)'ye böl! \(3\times 3\) ve daha büyük matrisler içinse <b>Gauss–Jordan</b> yöntemiyle \([A \mid I_n]\) matrisini satır işlemleriyle \([I_n \mid A^{-1}]\) hâline getiririz.`,
          en: R`The \(2\times 2\) inverse recipe takes three quick moves: <b>(1)</b> swap the main diagonal (\(a \leftrightarrow d\)), <b>(2)</b> negate the off-diagonal (\(-b, -c\)), and <b>(3)</b> divide every entry by \(\det(A) = ad - bc\)! For \(3\times 3\) and larger matrices, use <b>Gauss–Jordan elimination</b>: row-reduce \([A \mid I_n]\) into \([I_n \mid A^{-1}]\).`,
        },
        {
          example: {
            title: { tr: "2×2 ters matris bulma ve AA⁻¹ = I₂ kontrolü", en: "Finding a 2×2 inverse & verifying AA⁻¹ = I₂" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 4 & 3 \\ 2 & 2 \end{bmatrix}\) matrisinin tersini bulun ve \(A A^{-1} = I_2\) olduğunu doğrulayın.`,
              en: R`Find \(A^{-1}\) for \(A = \begin{bmatrix} 4 & 3 \\ 2 & 2 \end{bmatrix}\) and verify \(A A^{-1} = I_2\).`,
            },
            steps: [
              {
                expr: R`\det(A) = 4\cdot 2 - 3\cdot 2 = 8 - 6 = 2 \ne 0`,
                note: {
                  tr: R`Determinant sıfırdan farklı, demek ki \(A^{-1}\) var!`,
                  en: R`Determinant is nonzero, so \(A^{-1}\) exists!`,
                },
              },
              {
                expr: R`A^{-1} = \frac{1}{2}\begin{bmatrix} 2 & -3 \\ -2 & 4 \end{bmatrix} = \begin{bmatrix} 1 & -3/2 \\ -1 & 2 \end{bmatrix}`,
                note: {
                  tr: R`Köşegeni yer değiştirip (\(4 \leftrightarrow 2\)), diğerlerinin işaretini çevirip (\(-3, -2\)) \(2\)'ye böldük.`,
                  en: R`Swap the diagonal (\(4 \leftrightarrow 2\)), negate off-diagonal (\(-3, -2\)), and divide by \(2\).`,
                },
              },
              {
                expr: R`A A^{-1} = \begin{bmatrix} 4 & 3 \\ 2 & 2 \end{bmatrix}\begin{bmatrix} 1 & -3/2 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 4 - 3 & -6 + 6 \\ 2 - 2 & -3 + 4 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}`,
                note: {
                  tr: R`Sağlama tam tuttu: \(AA^{-1} = I_2\) ✓!`,
                  en: R`Check succeeds: \(AA^{-1} = I_2\) ✓!`,
                },
              },
            ],
            answer: {
              tr: R`\(A^{-1} = \begin{bmatrix} 1 & -3/2 \\ -1 & 2 \end{bmatrix}\)`,
              en: R`\(A^{-1} = \begin{bmatrix} 1 & -3/2 \\ -1 & 2 \end{bmatrix}\)`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: (AB)⁻¹ = A⁻¹ B⁻¹ yazmak!", en: "Common mistake: Writing (AB)⁻¹ = A⁻¹ B⁻¹!" },
            text: {
              tr: R`Çarpımın tersi de transpoz gibi <b>sırayı ters çevirir</b>: <b>\((AB)^{-1} = B^{-1} A^{-1}\)</b>! Önce çorap (\(B\)) sonra ayakkabı (\(A\)) giydiyseniz, eve dönünce önce ayakkabıyı (\(A^{-1}\)), sonra çorabı (\(B^{-1}\)) çıkarmanız gerekir. Kontrol: \((AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = I\).`,
              en: R`Just like transpose, the inverse of a product <b>reverses the order</b>: <b>\((AB)^{-1} = B^{-1} A^{-1}\)</b>! If you put on socks (\(B\)) then shoes (\(A\)), to undo it you must take off shoes (\(A^{-1}\)) first, then socks (\(B^{-1}\)). Check: \((AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = I\).`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>Tam Sayılı (det = 1)</b> seçeneğine tıklayın: tam sayılı bir matrisin determinantı \(\pm 1\) olduğunda tersinin de kesirsiz tam sayılardan oluştuğunu görün!`,
              en: R`Click <b>Integer Inv (det = 1)</b>: whenever an integer matrix has \(\det(A) = \pm 1\), its inverse has clean integer entries too!`,
            },
            {
              tr: R`<b>Tekil Tuzak (det = 0)</b> düğmesine basın: 2. satır 1. satırın tam yarısı olduğu için \(\det = 0\) ve ters matris yok! Şimdi herhangi bir kutuyu sadece \(1\) değiştirip \(A^{-1}\)'in anında ortaya çıkışını izleyin.`,
              en: R`Click <b>Singular Trap (det = 0)</b>: row 2 is half of row 1 so \(\det = 0\) and no inverse exists! Change ANY single entry by \(1\) and watch \(A^{-1}\) spring to life.`,
            },
            {
              tr: R`<b>Dönme 90°</b> seçeneğine bakın: \(A^{-1}\) matrisinin tam olarak \(A^T\) ile aynı çıktığını fark edin — sıradaki konumuzun ipucu!`,
              en: R`Click <b>Rotate 90°</b>: notice \(A^{-1}\) is literally just \(A^T\) — a sneak peek at Section 3!`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.inv ??= { A: [[2, 1], [1, 2]], preset: "gen" });
        const presets = {
          gen: { label: { tr: "Genel", en: "General" }, A: [[2, 1], [1, 2]] },
          intInv: { label: { tr: "Tam Sayılı (det = 1)", en: "Integer Inv (det = 1)" }, A: [[3, 2], [1, 1]] },
          rot90: { label: { tr: "Dönme 90°", en: "Rotate 90°" }, A: [[0, -1], [1, 0]] },
          sing: { label: { tr: "Tekil Tuzak (det = 0)", en: "Singular Trap (det = 0)" }, A: [[2, 4], [1, 2]] },
        };
        const ctl = h("div", { class: "t-controls" });
        const row = h("div", { class: "mx-row-wrap" });
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, row, calc, msg);

        const draw = () => {
          const d = det2(s.A);
          const inv = inv2(s.A);
          if (inv) {
            const prod = matMul(s.A, inv);
            calc.textContent = `\\(\\det(A) = ${tx(d, 2)} \\ne 0,\\quad A^{-1} = ${matToTex(inv)},\\quad A A^{-1} = ${matToTex(prod)}\\)`;
            msg.className = "pc-msg good";
            msg.textContent = L({
              tr: `Tersinir! det(A⁻¹) = 1 / ${ns(d, 2)} = ${ns(1 / d, 3)}. Çarpım tam olarak I₂ verdi ✓`,
              en: `Invertible! det(A⁻¹) = 1 / ${ns(d, 2)} = ${ns(1 / d, 3)}. Product verified as I₂ ✓`,
            });
          } else {
            calc.textContent = `\\(\\det(A) = (${tx(s.A[0][0], 2)})(${tx(s.A[1][1], 2)}) - (${tx(s.A[0][1], 2)})(${tx(s.A[1][0], 2)}) = 0\\)`;
            msg.className = "pc-msg bad";
            msg.textContent = L({
              tr: "Tekil matris! 1 / det(A) = 1 / 0 tanımsız olduğundan A⁻¹ YOKTUR — herhangi bir girişi değiştirerek tekillikten kurtulun.",
              en: "Singular matrix! Since 1 / det(A) = 1 / 0 is undefined, A⁻¹ DOES NOT EXIST — tweak any entry to break singularity.",
            });
          }
        };

        const rebuildEditor = () => {
          row.replaceChildren(h("div", {}, h("div", { class: "mini-title", text: "A" }), matrixInput(s.A, draw)));
          draw();
        };

        ctl.append(
          segmented(
            Object.entries(presets).map(([k, v]) => [k, v.label]),
            s.preset,
            (k) => {
              s.preset = k;
              s.A = presets[k].A.map((r) => [...r]);
              rebuildEditor();
            },
          ),
        );
        rebuildEditor();
      },
    },

    {
      id: "sq-orth",
      mathId: "m-sq-orth",
      title: {
        tr: "Ortogonal Matrisler (QᵀQ = I): Uzunluk ve Açıyı Koruyan Dönmeler",
        en: "Orthogonal Matrices (QᵀQ = I): Pure Rotations & Reflections",
      },
      body: [
        {
          tr: R`Kare matrislerin en zarif ailesi [[orthogonal-matrix|ortogonal matrislerdir]]. Bir \(Q\) matrisi \(Q^T Q = I\) koşulunu sağlıyorsa ona ortogonal denir. Bunun ilk müthiş sonucu şudur: <b>ters matrisi hesaplamaya hiç gerek yoktur, çünkü \(Q^{-1} = Q^T\)</b>! Sadece satırlarla sütunları yer değiştirmek tersi verir.`,
          en: R`The most elegant family of square matrices is the [[orthogonal-matrix|orthogonal matrices]]. A square matrix \(Q\) is orthogonal if \(Q^T Q = I\). Its first superpower is immediate: <b>computing the inverse takes zero arithmetic because \(Q^{-1} = Q^T\)</b> — just flip rows and columns!`,
        },
        {
          analogy: {
            title: { tr: "Katı bir tahta gönyeyi çevirmek veya ters yüz etmek", en: "Spinning or flipping a rigid wooden set-square" },
            text: {
              tr: R`Bir tahta gönyeyi orijin etrafında ne kadar döndürürseniz döndürün (\(\det = +1\)) veya masa üstünde ters yüz çevirin (\(\det = -1\)), kenar uzunlukları ve içindeki \(90^\circ\) dik açı <b>hiç bozulmaz</b>. İşte ortogonal matrisler tam olarak bu katı hareketlerdir: her vektörün [[norm|uzunluğunu]] (\(\|Q\mathbf x\| = \|\mathbf x\|\)) ve iki vektör arasındaki açıyı birebir korurlar!`,
              en: R`No matter how you spin a wooden triangle around the origin (\(\det = +1\)) or flip it face-down (\(\det = -1\)), its side lengths and right angle stay <b>100% rigid</b>. Orthogonal matrices are exactly these rigid motions: they preserve every vector's [[norm|length]] (\(\|Q\mathbf x\| = \|\mathbf x\|\)) and every angle between vectors!`,
            },
          },
        },
        {
          eq: {
            tr: R`Q^T Q = I \iff Q^{-1} = Q^T \implies \|Q\mathbf x\| = \|\mathbf x\| \quad \text{ve} \quad \det(Q) = \pm 1`,
            en: R`Q^T Q = I \iff Q^{-1} = Q^T \implies \|Q\mathbf x\| = \|\mathbf x\| \quad \text{and} \quad \det(Q) = \pm 1`,
          },
        },
        {
          tr: R`\(Q^T Q = I\) koşulunu sütunlarla okursanız şunu görürsünüz: \(Q\)'nun her sütunu \(1\) uzunluklu bir birim vektördür (\(\|\mathbf q_i\| = 1\)) ve farklı her iki sütun birbirine tam diktir (\(\mathbf q_i \cdot \mathbf q_j = 0\)) — yani sütunlar <b>ortonormal</b>dir. 2B'de her ortogonal matris ya saf bir <b>dönme</b> (\(\det = +1\)) ya da bir doğruya göre saf bir <b>yansımadır</b> (\(\det = -1\)).`,
          en: R`Reading \(Q^T Q = I\) column by column reveals why: every column of \(Q\) has unit length (\(\|\mathbf q_i\| = 1\)) and any two distinct columns are perpendicular (\(\mathbf q_i \cdot \mathbf q_j = 0\)) — an <b>orthonormal</b> set! In 2D, every orthogonal matrix is either a pure <b>rotation</b> (\(\det = +1\)) or a pure <b>reflection</b> (\(\det = -1\)).`,
        },
        {
          example: {
            title: { tr: "Bir matrisin ortogonal olduğunu kontrol edip tersini anında yazma", en: "Checking orthogonality & reading Q⁻¹ instantly" },
            problem: {
              tr: R`\(Q = \begin{bmatrix} 3/5 & -4/5 \\ 4/5 & 3/5 \end{bmatrix}\) matrisinin ortogonal olduğunu gösterin, türünü (dönme/yansıma) belirleyin ve \(Q^{-1}\)'i yazın.`,
              en: R`Verify that \(Q = \begin{bmatrix} 3/5 & -4/5 \\ 4/5 & 3/5 \end{bmatrix}\) is orthogonal, identify whether it is a rotation or reflection, and write \(Q^{-1}\).`,
            },
            steps: [
              {
                expr: R`\|\mathbf q_1\|^2 = \left(\tfrac{3}{5}\right)^2 + \left(\tfrac{4}{5}\right)^2 = \tfrac{9 + 16}{25} = 1, \qquad \|\mathbf q_2\|^2 = \left(-\tfrac{4}{5}\right)^2 + \left(\tfrac{3}{5}\right)^2 = 1`,
                note: {
                  tr: R`Her iki sütunun da uzunluğu tam \(1\) (birim vektör ✓).`,
                  en: R`Both columns have length \(1\) (unit vectors ✓).`,
                },
              },
              {
                expr: R`\mathbf q_1 \cdot \mathbf q_2 = \left(\tfrac{3}{5}\right)\left(-\tfrac{4}{5}\right) + \left(\tfrac{4}{5}\right)\left(\tfrac{3}{5}\right) = -\tfrac{12}{25} + \tfrac{12}{25} = 0`,
                note: {
                  tr: R`Nokta çarpımları \(0\): iki sütun birbirine tam dik (ortogonal ✓)! Dolayısıyla \(Q^T Q = I_2\).`,
                  en: R`Dot product is \(0\): the columns are perpendicular ✓! Hence \(Q^T Q = I_2\).`,
                },
              },
              {
                expr: R`\det(Q) = \tfrac{9}{25} - \left(-\tfrac{16}{25}\right) = +1, \qquad Q^{-1} = Q^T = \begin{bmatrix} 3/5 & 4/5 \\ -4/5 & 3/5 \end{bmatrix}`,
                note: {
                  tr: R`\(\det(Q) = +1\) olduğu için saf bir dönmedir (yaklaşık \(53{,}1^\circ\)), tersi ise doğrudan \(Q^T\)'dir!`,
                  en: R`Since \(\det(Q) = +1\), it is a pure rotation (about \(53.1^\circ\)), and its inverse is immediately \(Q^T\)!`,
                },
              },
            ],
            answer: {
              tr: R`Ortogonal dönme matrisi (\(\det = +1\)), \(Q^{-1} = Q^T = \begin{bmatrix} 3/5 & 4/5 \\ -4/5 & 3/5 \end{bmatrix}\).`,
              en: R`Orthogonal rotation matrix (\(\det = +1\)), \(Q^{-1} = Q^T = \begin{bmatrix} 3/5 & 4/5 \\ -4/5 & 3/5 \end{bmatrix}\).`,
            },
          },
        },
        {
          pitfall: {
            title: { tr: "Sık yapılan hata: 'Ortogonal = sadece det = +1' veya 'sadece sütunlar dik'", en: "Common mistake: Thinking det(Q) = +1 always, or forgetting unit length" },
            text: {
              tr: R`İki tuzağa dikkat! <b>1)</b> Yansıma matrisleri de ortogonaldir ve determinantları <b>\(-1\)</b>'dir (\(Q^T Q = I \Rightarrow (\det Q)^2 = 1 \Rightarrow \det Q = \pm 1\)). <b>2)</b> Sütunların yalnızca dik olması yetmez, <b>uzunlukları da \(1\) olmalıdır</b>: örneğin \(2I_2\)'nin sütunları diktir ama \((2I_2)^T(2I_2) = 4I_2 \ne I_2\)!`,
              en: R`Watch out for two traps! <b>1)</b> Reflections are also orthogonal and have <b>\(\det(Q) = -1\)</b> (\(Q^T Q = I \Rightarrow (\det Q)^2 = 1 \Rightarrow \det Q = \pm 1\)). <b>2)</b> Perpendicular columns alone are NOT enough — they must also have <b>unit length \(1\)</b>: for example, \(2I_2\) has perpendicular columns yet \((2I_2)^T(2I_2) = 4I_2 \ne I_2\)!`,
            },
          },
        },
        {
          tryList: [
            {
              tr: R`<b>Dönme (\(\det = +1\))</b> modunda \(\theta\) açısını \(0^\circ\)'den \(360^\circ\)'ye sürükleyin: \(\mathbf q_1\) ve \(\mathbf q_2\) oklarının birim çember üzerinde hep \(90^\circ\) açıyla döndüğünü ve \(\|Q\mathbf x\| = \|\mathbf x\|\) uzunluğunun milim oynamadığını izleyin!`,
              en: R`In <b>Rotation (\(\det = +1\))</b> mode, sweep \(\theta\) from \(0^\circ\) to \(360^\circ\): watch \(\mathbf q_1, \mathbf q_2\) stay on the unit circle at \(90^\circ\) and \(\|Q\mathbf x\| = \|\mathbf x\|\) never budge!`,
            },
            {
              tr: R`<b>Yansıma (\(\det = -1\))</b> moduna geçin: kesikli ayna doğrusunu ve birim karenin ters yüz çevrildiğini görün — buna rağmen \(\|Q\mathbf x\| = \|\mathbf x\|\) ve \(Q^T Q = I_2\) hâlâ kusursuz sağlanır!`,
              en: R`Switch to <b>Reflection (\(\det = -1\))</b>: see the dashed mirror axis appear and the square flip orientation — yet \(\|Q\mathbf x\| = \|\mathbf x\|\) and \(Q^T Q = I_2\) still hold perfectly!`,
            },
            {
              tr: R`Siyah \(\mathbf x\) ucunu sürükleyip farklı uzunluklarda vektörler deneyin: turuncu \(Q\mathbf x\) okunun uzunluğu daima \(\mathbf x\) ile aynı kalacaktır.`,
              en: R`Drag the dark handle \(\mathbf x\) to test vectors of any length: the orange arrow \(Q\mathbf x\) always keeps the exact same length as \(\mathbf x\).`,
            },
          ],
        },
      ],
      demo(box, state) {
        const s = (state.orth ??= { mode: "rot", deg: 45, x: [1.8, 0.9] });
        const ctl = h("div", { class: "t-controls" });
        const host = h("div");
        const calc = h("div", { class: "pc-calc" });
        const msg = h("p", { class: "pc-msg" });
        box.append(ctl, host, calc, msg);

        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "x vektörünün ucunu sürükleyin", en: "Drag the tip of vector x" }),
        });

        const draw = () => {
          const rad = (s.deg * Math.PI) / 180;
          const c = Math.cos(rad);
          const sn = Math.sin(rad);
          const Q =
            s.mode === "rot"
              ? [
                  [c, -sn],
                  [sn, c],
                ]
              : [
                  [c, sn],
                  [sn, -c],
                ];
          const q1 = [Q[0][0], Q[1][0]];
          const q2 = [Q[0][1], Q[1][1]];
          const sum = [q1[0] + q2[0], q1[1] + q2[1]];
          const qx = matVec(Q, s.x);
          const lenX = vNorm(s.x);
          const lenQX = vNorm(qx);
          const d = det2(Q);

          // Mirror axis for H_theta is the line at angle theta/2: sin(theta/2) x - cos(theta/2) y = 0
          const half = rad / 2;
          const lines =
            s.mode === "refl"
              ? [
                  {
                    a: Math.sin(half),
                    b: -Math.cos(half),
                    c: 0,
                    color: COLORS.c4,
                    width: 1.8,
                    dash: [6, 4],
                    label: L({ tr: "ayna", en: "mirror" }),
                  },
                ]
              : [];

          plot.draw({
            x: [-3.2, 3.2],
            y: [-2.8, 3.2],
            equalAspect: true,
            xLabel: "x",
            yLabel: "y",
            circles: [{ cx: 0, cy: 0, r: 1, stroke: COLORS.muted, dash: [3, 3], width: 1.2 }],
            lines,
            polygons: [
              { pts: [[0, 0], [1, 0], [1, 1], [0, 1]], stroke: COLORS.muted, dash: [4, 3], width: 1.2 },
              {
                pts: [[0, 0], q1, sum, q2],
                fill: s.mode === "rot" ? "rgba(42,120,214,0.16)" : "rgba(235,104,52,0.18)",
                stroke: s.mode === "rot" ? COLORS.c1 : COLORS.c2,
                width: 2,
              },
            ],
            vectors: [
              { to: q1, color: COLORS.c1, label: "q₁" },
              { to: q2, color: COLORS.c3, label: "q₂" },
              { to: s.x, color: COLORS.muted, width: 2.2, label: "x" },
              { to: qx, color: COLORS.c2, width: 2.8, label: "Qx" },
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

          calc.textContent = `\\(Q = ${matToTex(Q)},\\quad \\det(Q) = ${tx(d, 0)},\\quad \\|Q\\mathbf x\\| = \\|\\mathbf x\\| = ${tx(lenQX, 2)}\\)`;
          msg.className = s.mode === "rot" ? "pc-msg good" : "pc-msg info";
          msg.textContent =
            s.mode === "rot"
              ? L({
                  tr: `Saf dönme (${s.deg}°): det(Q) = +1, QᵀQ = I₂ ve ||Qx|| = ||x|| = ${ns(lenX, 2)} (uzunluk ve yönelim korundu!).`,
                  en: `Pure rotation (${s.deg}°): det(Q) = +1, QᵀQ = I₂, and ||Qx|| = ||x|| = ${ns(lenX, 2)} (length & orientation preserved!).`,
                })
              : L({
                  tr: `Saf yansıma (${ns(s.deg / 2, 1)}° aynası): det(Q) = −1, QᵀQ = I₂ ve ||Qx|| = ||x|| = ${ns(lenX, 2)} (uzunluk korundu, yönelim terslendi!).`,
                  en: `Pure reflection (${ns(s.deg / 2, 1)}° mirror): det(Q) = −1, QᵀQ = I₂, and ||Qx|| = ||x|| = ${ns(lenX, 2)} (length preserved, orientation flipped!).`,
                });
        };

        ctl.append(
          segmented(
            [
              ["rot", { tr: "Dönme (det = +1)", en: "Rotation (det = +1)" }],
              ["refl", { tr: "Yansıma (det = −1)", en: "Reflection (det = −1)" }],
            ],
            s.mode,
            (v) => {
              s.mode = v;
              draw();
            },
          ),
          slider("θ (°)", {
            min: 0,
            max: 360,
            step: 15,
            value: s.deg,
            fmt: (v) => `${v}°`,
            onInput: (v) => {
              s.deg = v;
              draw();
            },
          }),
        );
        draw();
      },
    },
  ],

  playground: {
    title: {
      tr: "3×3 Determinant, İz, Ters Matris ve Ortogonallik Laboratuvarı",
      en: "3×3 Determinant, Trace, Inverse & Orthogonality Lab",
    },
    sub: {
      tr: R`Hazır senaryolardan birini seçin veya 3×3 kare matrisin kutularını kendiniz düzenleyin; \(\det(A)\), iz \(\operatorname{tr}(A)\), tersinirlik, ortogonallik ve \(A^{-1}\)'i canlı görün.`,
      en: R`Load a preset or edit any entry of a 3×3 square matrix to inspect \(\det(A)\), trace \(\operatorname{tr}(A)\), invertibility, orthogonality, and \(A^{-1}\) live.`,
    },
    experiments: [
      {
        tr: R`<b>Üçgensel Kısayol:</b> <b>Üçgensel</b> düğmesine tıklayın ve köşegendeki üç sayıyı zihninizden çarpın: \(2\cdot 3\cdot (-2) = -12\). Köşegenin üstündeki diğer sayıların determinanta hiç etki etmediğini doğrulayın!`,
        en: R`<b>Triangular Shortcut:</b> click <b>Triangular</b> and multiply the three diagonal numbers mentally: \(2\cdot 3\cdot (-2) = -12\). Notice the entries above the diagonal do not change \(\det(A)\) at all!`,
      },
      {
        tr: R`<b>Tekillik Çöküşü:</b> <b>Tekil (det = 0)</b> düğmesine basın (2. satır, 1. satırın tam \(2\) katı). Şimdi 2. satırdaki tek bir sayıyı \(1\) artırın ve \(\det(A)\)'nın sıfırdan fırlayıp \(A^{-1}\)'in anında ortaya çıkmasını izleyin!`,
        en: R`<b>Breaking Singularity:</b> click <b>Singular (det = 0)</b> (row 2 is twice row 1). Increase just ONE entry in row 2 by \(1\) and watch \(\det(A)\) jump off zero and \(A^{-1}\) appear!`,
      },
      {
        tr: R`<b>3B Ortogonal Dönme:</b> <b>Ortogonal</b> düğmesine basın — \(\det(A) = 1\), <b>Ortogonal? = Evet</b> ve \(A^{-1}\)'in doğrudan \(A^T\) olduğunu görün!`,
        en: R`<b>3D Orthogonal Rotation:</b> click <b>Orthogonal</b> — check that \(\det(A) = 1\), <b>Orthogonal? = Yes</b>, and \(A^{-1}\) is literally \(A^T\)!`,
      },
      {
        tr: R`<b>Satır Takası Testi:</b> <b>Sınav Sorusu</b> senaryosunda \(\det(A) = 5\) değerini not edin, sonra 1. ve 2. satırları elle yer değiştirin — determinantın tam \(-5\)'e döndüğünü doğrulayın!`,
        en: R`<b>Row-Swap Test:</b> in <b>Exam Matrix</b>, note \(\det(A) = 5\), then manually swap row 1 and row 2 — watch \(\det(A)\) flip to exact \(-5\)!`,
      },
    ],
    build(host, state) {
      const s = (state.pg ??= {
        M: [[2, 1, 0], [0, 3, 1], [1, 0, 2]],
        preset: "gen",
      });
      const presets = {
        gen: { label: { tr: "Genel", en: "General" }, M: [[2, 1, 0], [0, 3, 1], [1, 0, 2]] },
        tri: { label: { tr: "Üçgensel", en: "Triangular" }, M: [[2, 4, -1], [0, 3, 5], [0, 0, -2]] },
        orth: { label: { tr: "Ortogonal", en: "Orthogonal" }, M: [[0, -1, 0], [1, 0, 0], [0, 0, 1]] },
        sing: { label: { tr: "Tekil (det = 0)", en: "Singular (det = 0)" }, M: [[1, 2, 3], [2, 4, 6], [0, 1, 1]] },
        exam: { label: { tr: "Sınav Sorusu", en: "Exam Matrix" }, M: [[1, 0, 2], [2, 1, 0], [0, 1, 1]] },
      };

      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const ctl = h("div", { class: "t-controls" });
      const gridWrap = h("div", { class: "mx-row-wrap" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      const msg = h("p", { class: "pc-msg" });
      stage.append(ctl, gridWrap);
      side.append(tiles, calc, msg);

      const draw = () => {
        const d = det3(s.M);
        const tr = s.M[0][0] + s.M[1][1] + s.M[2][2];
        const inv = invMatrix(s.M);
        const orth = isOrthogonal(s.M);

        tiles.replaceChildren(
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: "det(A)" }),
            h("span", { class: "pg-tile-value", text: ns(d, 3) }),
          ),
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: "tr(A)" }),
            h("span", { class: "pg-tile-value", text: ns(tr, 2) }),
          ),
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: L({ tr: "Tersinir?", en: "Invertible?" }) }),
            h("span", { class: "pg-tile-value", text: inv ? L({ tr: "Evet ✓", en: "Yes ✓" }) : L({ tr: "Hayır ✕", en: "No ✕" }) }),
          ),
          h(
            "div",
            { class: "pg-tile" },
            h("span", { class: "pg-tile-label", text: L({ tr: "Ortogonal?", en: "Orthogonal?" }) }),
            h("span", { class: "pg-tile-value", text: orth ? L({ tr: "Evet ✓", en: "Yes ✓" }) : L({ tr: "Hayır", en: "No" }) }),
          ),
        );

        if (inv) {
          calc.textContent = `\\(A^{-1} = ${matToTex(inv)},\\qquad \\det(A^{-1}) = ${tx(1 / d, 3)}\\)`;
          msg.className = "pc-msg good";
          msg.textContent = orth
            ? L({
                tr: "Ortogonal matris! AᵀA = I₃ olduğundan A⁻¹ doğrudan Aᵀ'ye eşittir ve hacmi (|det| = 1) korur.",
                en: "Orthogonal matrix! Since AᵀA = I₃, A⁻¹ equals Aᵀ directly and preserves volume (|det| = 1).",
              })
            : L({
                tr: `Tersinir 3×3 matris: 3B hacimleri ${ns(Math.abs(d), 2)} kat ölçekler (${d > 0 ? "yönelim korunur" : "yönelim terslenir"}).`,
                en: `Invertible 3×3 matrix: scales 3D volumes by ${ns(Math.abs(d), 2)} (${d > 0 ? "orientation preserved" : "orientation flipped"}).`,
              });
        } else {
          calc.textContent = `\\(\\det(A) = 0 \\implies A^{-1}\\ \\text{${L({ tr: "yoktur (tekil)", en: "does not exist (singular)" })}}\\)`;
          msg.className = "pc-msg bad";
          msg.textContent = L({
            tr: "3B uzay bir düzleme veya doğruya çöktü (hacim = 0): bu matrisin tersi yoktur!",
            en: "3D space collapsed into a plane or line (volume = 0): this matrix has no inverse!",
          });
        }
      };

      const rebuildEditor = () => {
        gridWrap.replaceChildren(matrixInput(s.M, draw));
        draw();
      };

      ctl.append(
        segmented(
          Object.entries(presets).map(([k, v]) => [k, v.label]),
          s.preset,
          (k) => {
            s.preset = k;
            s.M = presets[k].M.map((r) => [...r]);
            rebuildEditor();
          },
        ),
      );
      rebuildEditor();
    },
  },

  mathSections: [
    {
      id: "m-sq-det",
      title: { tr: "Determinant Yasaları ve 3×3 Kofaktör Açılımı", en: "Determinant Laws & 3×3 Cofactor Expansion" },
      blocks: [
        {
          p: {
            tr: R`Determinant hesaplarını hızlandıran tüm kurallar aşağıdaki özet tabloda toplanmıştır. Özellikle <b>üçgensel matrisler</b> ve <b>satır işlemleri</b> büyük matrislerde hayat kurtarır:`,
            en: R`Every determinant shortcut lives in the table below. In practice, <b>triangular matrices</b> and <b>row operations</b> save enormous effort on large matrices:`,
          },
        },
        {
          table: {
            head: [
              { tr: "İşlem / Durum", en: "Operation / Property" },
              { tr: "Determinanta etkisi", en: "Effect on determinant" },
            ],
            rows: [
              [
                { tr: "İki satırı (veya sütunu) yer değiştirme", en: "Swap two rows (or columns)" },
                { tr: R`İşaret değişir: \(-\det(A)\)`, en: R`Sign flips: \(-\det(A)\)` },
              ],
              [
                { tr: R`<b>Tek bir satırı</b> \(c\) ile çarpma`, en: R`Scale <b>one row</b> by \(c\)` },
                { tr: R`\(c\det(A)\)`, en: R`\(c\det(A)\)` },
              ],
              [
                { tr: R`<b>Tüm matrisi</b> \(c\) ile çarpma (\(cA\), \(n\times n\))`, en: R`Scale <b>entire matrix</b> (\(cA\), \(n\times n\))` },
                { tr: R`\(c^n \det(A)\)`, en: R`\(c^n \det(A)\)` },
              ],
              [
                { tr: "Bir satıra başka bir satırın katını ekleme", en: "Add a multiple of one row to another" },
                { tr: R`<b>Hiç değişmez!</b> \(\det(A)\)`, en: R`<b>Unchanged!</b> \(\det(A)\)` },
              ],
              [
                { tr: R`Matris çarpımı \(AB\)`, en: R`Matrix product \(AB\)` },
                { tr: R`\(\det(AB) = \det(A)\det(B)\)`, en: R`\(\det(AB) = \det(A)\det(B)\)` },
              ],
              [
                { tr: R`Transpoz \(A^T\)`, en: R`Transpose \(A^T\)` },
                { tr: R`\(\det(A^T) = \det(A)\)`, en: R`\(\det(A^T) = \det(A)\)` },
              ],
              [
                { tr: R`Ters matris \(A^{-1}\)`, en: R`Inverse \(A^{-1}\)` },
                { tr: R`\(\det(A^{-1}) = \dfrac{1}{\det(A)}\)`, en: R`\(\det(A^{-1}) = \dfrac{1}{\det(A)}\)` },
              ],
              [
                { tr: "Köşegen veya üçgensel matris", en: "Diagonal or triangular matrix" },
                { tr: R`Köşegen elemanlarının çarpımı: \(a_{11}a_{22}\cdots a_{nn}\)`, en: R`Product of diagonal entries: \(a_{11}a_{22}\cdots a_{nn}\)` },
              ],
            ],
          },
        },
        {
          example: {
            title: { tr: "3×3 Determinantı Kofaktör Açılımıyla Hesaplama", en: "Computing a 3×3 Determinant by Cofactor Expansion" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 2 & 0 & 3 \\ 1 & 4 & -1 \\ 0 & 2 & 5 \end{bmatrix}\) matrisinin determinantını en pratik satırdan açarak bulun.`,
              en: R`Find \(\det(A)\) for \(A = \begin{bmatrix} 2 & 0 & 3 \\ 1 & 4 & -1 \\ 0 & 2 & 5 \end{bmatrix}\) by expanding along a row with a zero.`,
            },
            steps: [
              {
                expr: {
                  tr: R`\text{İşaret daması: } \begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}`,
                  en: R`\text{Sign checkerboard: } \begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}`,
                },
                note: {
                  tr: R`Kofaktör işaretleri satranç tahtası gibi \((-1)^{i+j}\) ile değişir. 1. satırda bir \(0\) olduğu için 1. satırdan açmak en kolay yoldur!`,
                  en: R`Cofactor signs alternate like a checkerboard \((-1)^{i+j}\). Row 1 has a \(0\), making it a great choice!`,
                },
              },
              {
                expr: R`\det(A) = +2\det\begin{bmatrix} 4 & -1 \\ 2 & 5 \end{bmatrix} - 0\cdot(\dots) + 3\det\begin{bmatrix} 1 & 4 \\ 0 & 2 \end{bmatrix}`,
                note: {
                  tr: R`Her elemanın bulunduğu satır ve sütunu kapatıp kalan \(2\times 2\) alt matrisin determinantını alıyoruz.`,
                  en: R`Cross out each entry's row and column and take the determinant of the remaining \(2\times 2\) minor.`,
                },
              },
              {
                expr: R`= 2\big(4\cdot 5 - (-1)\cdot 2\big) + 3\big(1\cdot 2 - 4\cdot 0\big) = 2(22) + 3(2) = 44 + 6 = 50`,
                note: {
                  tr: R`İki küçük \(2\times 2\) hesapla sonuca ulaşıyoruz!`,
                  en: R`Two tiny \(2\times 2\) calculations finish the job!`,
                },
              },
            ],
            answer: {
              tr: R`\(\det(A) = 50\)`,
              en: R`\(\det(A) = 50\)`,
            },
          },
        },
        {
          callout: "warn",
          title: { tr: "Klasik sınav tuzağı: det(cA) = cⁿ det(A)!", en: "Classic exam trap: det(cA) = cⁿ det(A)!" },
          text: {
            tr: R`\(A\) boyutu \(3\times 3\) ve \(\det(A) = 5\) ise \(\det(2A)\) kesinlikle \(10\) değildir! Her üç satır da \(2\) ile çarpıldığı için \(\det(2A) = 2^3 \det(A) = 8\cdot 5 = 40\) olur.`,
            en: R`If \(A\) is \(3\times 3\) with \(\det(A) = 5\), then \(\det(2A)\) is NOT \(10\)! All three rows are scaled by \(2\), giving \(\det(2A) = 2^3 \det(A) = 8\cdot 5 = 40\).`,
          },
        },
      ],
    },

    {
      id: "m-sq-inv",
      title: { tr: "Ters Matrisin Tekliği, (AB)⁻¹ İspatı ve Gauss–Jordan", en: "Uniqueness of Inverse, (AB)⁻¹ Proof & Gauss–Jordan" },
      blocks: [
        {
          derive: {
            title: { tr: "Ters matris tektir, (AB)⁻¹ = B⁻¹A⁻¹ ve det(A⁻¹) = 1/det(A)", en: "Proof of uniqueness, (AB)⁻¹ = B⁻¹A⁻¹, and det(A⁻¹) = 1/det(A)" },
            steps: [
              {
                tex: R`B = B I = B(AC) = (BA)C = I C = C`,
                why: {
                  tr: R`<b>Teklik ispatı:</b> Hem \(B\) hem \(C\), \(A\)'nın tersi olsun (\(BA = I\) ve \(AC = I\)). Matris çarpımının birleşme özelliği \(B = C\) olduğunu tek satırda kanıtlar!`,
                  en: R`<b>Uniqueness:</b> suppose both \(B\) and \(C\) invert \(A\) (\(BA = I\) and \(AC = I\)). Associativity immediately forces \(B = C\)!`,
                },
              },
              {
                tex: R`(AB)(B^{-1} A^{-1}) = A(B B^{-1}) A^{-1} = A I A^{-1} = A A^{-1} = I`,
                why: {
                  tr: R`<b>Ters sıra kuralı:</b> \(B^{-1}A^{-1}\) ifadesi \(AB\) ile çarpılınca \(I\) verdiğine göre (ve ters tek olduğuna göre) \((AB)^{-1} = B^{-1}A^{-1}\) olmak zorundadır!`,
                  en: R`<b>Reversal law:</b> multiplying \(AB\) by \(B^{-1}A^{-1}\) yields \(I\); by uniqueness of the inverse, \((AB)^{-1} = B^{-1}A^{-1}\)!`,
                },
              },
              {
                tex: R`A A^{-1} = I \implies \det(A)\det(A^{-1}) = \det(I) = 1 \implies \det(A^{-1}) = \frac{1}{\det(A)}`,
                why: {
                  tr: R`Determinantın çarpımsallığı \(\det(AB) = \det(A)\det(B)\) uygulanır. Bu aynı zamanda \(\det(A) = 0\) iken ters matrisin neden olamayacağını (\(0 \cdot \text{sayı} = 1\) imkânsız!) kanıtlar.`,
                  en: R`Apply \(\det(AB) = \det(A)\det(B)\). This also proves why \(\det(A) = 0\) can NEVER have an inverse (\(0 \cdot \text{anything} \ne 1\))!`,
                },
              },
            ],
          },
        },
        {
          example: {
            title: { tr: "Gauss–Jordan Yöntemiyle [A | I] → [I | A⁻¹]", en: "Gauss–Jordan Inversion: [A | I] → [I | A⁻¹]" },
            problem: {
              tr: R`\(A = \begin{bmatrix} 1 & 2 \\ 3 & 7 \end{bmatrix}\) matrisinin tersini Gauss–Jordan satır indirgemesiyle bulun.`,
              en: R`Find \(A^{-1}\) for \(A = \begin{bmatrix} 1 & 2 \\ 3 & 7 \end{bmatrix}\) using Gauss–Jordan row reduction.`,
            },
            steps: [
              {
                expr: R`\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 3 & 7 & 0 & 1 \end{array}\right]`,
                note: {
                  tr: R`\(A\)'nın sağ yanına birim matris \(I_2\)'yi yapıştırıyoruz. Sol tarafı \(I_2\) yapınca sağ tarafta otomatik olarak \(A^{-1}\) belirecek!`,
                  en: R`Place \(I_2\) next to \(A\). Whatever row operations turn the left side into \(I_2\) will turn the right side into \(A^{-1}\)!`,
                },
              },
              {
                expr: R`R_2 \leftarrow R_2 - 3R_1 \implies \left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & -3 & 1 \end{array}\right]`,
                note: {
                  tr: R`1. sütundaki \(3\)'ü sıfırlıyoruz (2. satırda pivot kendiliğinden \(1\) oldu!).`,
                  en: R`Zero out the \(3\) below pivot 1 (giving a clean pivot \(1\) in row 2!).`,
                },
              },
              {
                expr: R`R_1 \leftarrow R_1 - 2R_2 \implies \left[\begin{array}{cc|cc} 1 & 0 & 7 & -2 \\ 0 & 1 & -3 & 1 \end{array}\right]`,
                note: {
                  tr: R`Sol taraf \(I_2\) oldu! Sağ yarıda okunan matris tam olarak \(A^{-1}\)'dir.`,
                  en: R`The left half is now \(I_2\), so the right half is \(A^{-1}\)!`,
                },
              },
            ],
            answer: {
              tr: R`\(A^{-1} = \begin{bmatrix} 7 & -2 \\ -3 & 1 \end{bmatrix}\) (aynı yöntem \(3\times 3\) ve \(n\times n\) matrislerde de birebir çalışır!).`,
              en: R`\(A^{-1} = \begin{bmatrix} 7 & -2 \\ -3 & 1 \end{bmatrix}\) (this exact method works for any \(n\times n\) matrix!).`,
            },
          },
        },
      ],
    },

    {
      id: "m-sq-orth",
      title: { tr: "Ortogonal Matrisler: Norm, Açı ve Determinant İspatı", en: "Orthogonal Matrices: Proof of Length, Angle & det = ±1" },
      blocks: [
        {
          derive: {
            title: { tr: "QᵀQ = I ise ‖Qx‖ = ‖x‖, (Qu)·(Qv) = u·v ve det(Q) = ±1", en: "Proof that QᵀQ = I preserves dot products, norms, and gives det(Q) = ±1" },
            steps: [
              {
                tex: R`(Q\mathbf u)\cdot(Q\mathbf v) = (Q\mathbf u)^T (Q\mathbf v) = \mathbf u^T Q^T Q \mathbf v`,
                why: {
                  tr: R`Nokta çarpımı \(\mathbf a \cdot \mathbf b = \mathbf a^T \mathbf b\) olarak yazar ve \((Q\mathbf u)^T = \mathbf u^T Q^T\) ters sıra kuralını uygularız.`,
                  en: R`Rewrite the dot product as \(\mathbf a^T \mathbf b\) and apply the transpose reversal rule \((Q\mathbf u)^T = \mathbf u^T Q^T\).`,
                },
              },
              {
                tex: R`= \mathbf u^T I \mathbf v = \mathbf u^T \mathbf v = \mathbf u \cdot \mathbf v`,
                why: {
                  tr: R`\(Q^T Q = I\) yerine konduğunda \(Q\) tamamen ortadan kaybolur! Nokta çarpım korunduğu için tüm <b>açılar</b> da korunur.`,
                  en: R`Substitute \(Q^T Q = I\) and \(Q\) vanishes completely! Since dot products stay identical, all <b>angles</b> stay identical.`,
                },
              },
              {
                tex: R`\|Q\mathbf x\|^2 = (Q\mathbf x)\cdot(Q\mathbf x) = \mathbf x \cdot \mathbf x = \|\mathbf x\|^2 \implies \|Q\mathbf x\| = \|\mathbf x\|`,
                why: {
                  tr: R`Özel olarak \(\mathbf u = \mathbf v = \mathbf x\) alınca her vektörün uzunluğunun korunduğu çıkar.`,
                  en: R`Setting \(\mathbf u = \mathbf v = \mathbf x\) shows every vector keeps its exact length!`,
                },
              },
              {
                tex: R`1 = \det(I) = \det(Q^T Q) = \det(Q^T)\det(Q) = (\det Q)^2 \implies \det(Q) = \pm 1`,
                why: {
                  tr: R`Son olarak her iki tarafın determinantını alıyoruz: karesi \(1\) olan reel sayılar yalnızca \(+1\) (dönme) ve \(-1\) (yansıma) olabilir!`,
                  en: R`Finally take determinants on both sides: the only real numbers squaring to \(1\) are \(+1\) (rotation) and \(-1\) (reflection)!`,
                },
              },
            ],
          },
        },
        {
          callout: "tip",
          title: { tr: "Bilgisayarlar ortogonal matrisleri neden çok sever?", en: "Why computers love orthogonal matrices" },
          text: {
            tr: R`3B oyun motorlarında, robotikte ve veri biliminde (QR ayrışımı, SVD) ortogonal matrisler altın değerindedir: hem \(Q^{-1} = Q^T\) sıfır maliyetle bulunur hem de uzunluklar değişmediği için yuvarlama hataları asla büyüyüp patlamaz!`,
            en: R`In 3D graphics, robotics, and data science (QR, SVD), orthogonal matrices are pure gold: \(Q^{-1} = Q^T\) costs zero flops and preserving lengths means floating-point rounding errors never blow up!`,
          },
        },
      ],
    },

    {
      id: "m-sq-special",
      title: { tr: "Özel Kare Matris Aileleri ve İz (Trace)", en: "Special Square Matrix Families & Trace" },
      blocks: [
        {
          p: {
            tr: R`Bir kare matrisin <b>izi</b> (trace), ana köşegendeki sayıların toplamıdır: \(\operatorname{tr}(A) = a_{11} + a_{22} + \dots + a_{nn}\). Matris çarpımı değişmeli olmasa bile iz şaşırtıcı bir <b>döngüsel özelliğe</b> sahiptir: \(\operatorname{tr}(AB) = \operatorname{tr}(BA)\)!`,
            en: R`The <b>trace</b> of a square matrix is the sum of its main diagonal entries: \(\operatorname{tr}(A) = a_{11} + a_{22} + \dots + a_{nn}\). Even though \(AB \ne BA\) in general, the trace obeys the surprising <b>cyclic rule</b>: \(\operatorname{tr}(AB) = \operatorname{tr}(BA)\)!`,
          },
        },
        {
          table: {
            head: [
              { tr: "Aile", en: "Family" },
              { tr: "Tanım", en: "Definition" },
              { tr: "Determinant & Ters kısayolu", en: "det & inverse shortcut" },
            ],
            rows: [
              [
                { tr: "Köşegen (Diagonal)", en: "Diagonal" },
                { tr: R`\(D = \operatorname{diag}(d_1,\dots,d_n)\)`, en: R`\(D = \operatorname{diag}(d_1,\dots,d_n)\)` },
                { tr: R`\(\det = \prod d_i\); tüm \(d_i \ne 0\) ise \(D^{-1} = \operatorname{diag}(1/d_i)\)`, en: R`\(\det = \prod d_i\); if all \(d_i \ne 0\), \(D^{-1} = \operatorname{diag}(1/d_i)\)` },
              ],
              [
                { tr: "Üçgensel (Triangular)", en: "Triangular" },
                { tr: "Köşegenin altı (veya üstü) hep 0", en: "All zeros below (or above) diagonal" },
                { tr: R`\(\det = \prod a_{ii}\); tersi varsa yine aynı tür üçgenseldir`, en: R`\(\det = \prod a_{ii}\); inverse stays triangular of same type` },
              ],
              [
                { tr: "Simetrik", en: "Symmetric" },
                { tr: R`\(A^T = A\)`, en: R`\(A^T = A\)` },
                { tr: R`Tersinirse \(A^{-1}\) de simetriktir`, en: R`If invertible, \(A^{-1}\) is also symmetric` },
              ],
              [
                { tr: "Ortogonal", en: "Orthogonal" },
                { tr: R`\(Q^T Q = I\)`, en: R`\(Q^T Q = I\)` },
                { tr: R`\(\det(Q) = \pm 1\) ve \(Q^{-1} = Q^T\)`, en: R`\(\det(Q) = \pm 1\) and \(Q^{-1} = Q^T\)` },
              ],
              [
                { tr: "Tekil (Singular)", en: "Singular" },
                { tr: R`\(\det(A) = 0\)`, en: R`\(\det(A) = 0\)` },
                { tr: R`Tersi \(A^{-1}\) yoktur; uzayı daha düşük boyuta ezer`, en: R`No inverse \(A^{-1}\); collapses space to lower dimension` },
              ],
            ],
          },
        },
        {
          links: [
            { tab: "theory", section: "sq-det" },
            { tab: "theory", section: "sq-inv" },
            { tab: "theory", section: "sq-orth" },
            { tab: "play" },
          ],
        },
      ],
    },
  ],

  practiceSections: PRACTICE,
});
