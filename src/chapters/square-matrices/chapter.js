import { mountChapter } from "../../engines/chapter-runtime.js";
import { createCanvas2D } from "../../engines/canvas2d.ts";
import { det2, det3, inv2, invMatrix } from "../../engines/math-core.ts";
import { matToTex, matrixInput } from "../../engines/matrix-ui.js";
import { h } from "../../shared/core.js";
import { L } from "../../shared/i18n.js";
import { KIT } from "../../shared/kit.js";
import { PRACTICE } from "./questions.ts";

const { R, COLORS, ns, tx, slider, segmented } = KIT;

mountChapter({
  intro: {
    id: "sq-intro",
    title: { tr: "Kare Matrisler: Determinant ve Ters Matris", en: "Square Matrices: Determinants & Inverses" },
    paragraphs: [
      {
        tr: R`Bir \(n\times n\) kare matris uzayı kendisine dönüştürür. [[determinant|Determinant]] \(\det(A)\), bu dönüşümün alanı (veya 3B'de hacmi) kaç kat büyüttüğünü ve yönelimi çevirip çevirmediğini tek bir sayıyla söyler!`,
        en: R`An \(n\times n\) square matrix maps a space back into itself. Its [[determinant|determinant]] \(\det(A)\) captures in one number both the area/volume scaling factor and whether orientation flips!`,
      },
      {
        tr: R`<b>Bu bölümün sonunda</b> \(\det(A)=0\)'ın neden uzayı çökertip [[inverse-matrix|ters matrisi]] imkânsız kıldığını görecek, \(2\times 2\) ve \(3\times 3\) determinantları/tersleri hesaplayacak ve [[orthogonal-matrix|ortogonal matrislerin]] neden normu koruduğunu ispatlayacaksınız.`,
        en: R`<b>By the end of this chapter</b> you will see why \(\det(A)=0\) collapses space and destroys invertibility, compute \(2\times 2\) and \(3\times 3\) determinants and inverses, and prove why [[orthogonal-matrix|orthogonal matrices]] preserve lengths.`,
      },
    ],
    summary: [
      [{ tr: "Ders", en: "Lecture" }, { tr: "Ders 7 · Kare Matrisler", en: "Lecture 7 · Square Matrices" }],
      [{ tr: "Tersinirlik koşulu", en: "Invertibility" }, { tr: R`\(A^{-1}\text{ var} \iff \det(A) \ne 0\)`, en: R`\(A^{-1}\text{ exists} \iff \det(A) \ne 0\)` }],
      [{ tr: "Özel aileler", en: "Special families" }, { tr: R`Köşegen, üçgensel, simetrik (\(A^T=A\)), ortogonal (\(Q^T Q=I\))`, en: R`Diagonal, triangular, symmetric (\(A^T=A\)), orthogonal (\(Q^T Q=I\))` }],
    ],
  },
  sections: [
    {
      id: "sq-det",
      mathId: "m-sq-det",
      title: { tr: "Determinant = Yönlü Alan Ölçeği", en: "Determinant = Signed Area Scaling Factor" },
      body: [
        {
          tr: R`Birim karenin alanı 1'dir. \(A\) dönüşümü altında bu kare, kenarları \(A\)'nın sütunları olan bir paralelkenara dönüşür ve bu paralelkenarın <b>yönlü alanı</b> tam olarak \(\det(A) = ad - bc\)'dir!`,
          en: R`The unit square has area 1. Under \(A\), it transforms into the parallelogram spanned by the columns of \(A\), whose <b>signed area</b> is literally \(\det(A) = ad - bc\)!`,
        },
        { eq: R`\det\begin{bmatrix}a & b\\ c & d\end{bmatrix} = ad - bc` },
        {
          tr: R`<b>Deneyin:</b> \(b\) ve \(d\) sütununu sürükleyin. İki sütun aynı doğruya geldiğinde paralelkenar ezilir ve \(\det(A) = 0\) olur (tekil/singüler matris!). Sütunlar yer değiştirdiğinde işaret eksiye döner (yönelim terslenir).`,
          en: R`<b>Try it:</b> drag the column tips. When the two columns align, the parallelogram collapses flat and \(\det(A) = 0\) (singular matrix!). Swapping their order flips the sign of \(\det(A)\).`,
        },
      ],
      demo(box, state) {
        const s = (state.det ??= { c1: [2, 0.5], c2: [0.5, 1.5] });
        const host = h("div");
        const msg = h("p", { class: "pc-msg" });
        const calc = h("div", { class: "pc-calc" });
        box.append(host, calc, msg);
        const plot = createCanvas2D(host, {
          height: 290,
          interactive: true,
          hint: L({ tr: "Sütun vektörlerini sürükleyin", en: "Drag column tips" }),
        });

        const draw = () => {
          const A = [[s.c1[0], s.c2[0]], [s.c1[1], s.c2[1]]];
          const d = det2(A);
          const sum = [s.c1[0] + s.c2[0], s.c1[1] + s.c2[1]];
          const fill = Math.abs(d) < 0.08 ? "rgba(208,59,59,0.25)" : d > 0 ? "rgba(27,175,122,0.22)" : "rgba(235,104,52,0.24)";
          plot.draw({
            x: [-3.5, 4], y: [-3, 4], equalAspect: true, xLabel: "x", yLabel: "y",
            polygons: [
              { pts: [[0, 0], [1, 0], [1, 1], [0, 1]], stroke: COLORS.muted, dash: [4, 3], width: 1.3 },
              { pts: [[0, 0], s.c1, sum, s.c2], fill, stroke: d >= 0 ? COLORS.c3 : COLORS.c2, width: 2.2 },
            ],
            vectors: [
              { to: s.c1, color: COLORS.c1, label: "a₁" },
              { to: s.c2, color: COLORS.c3, label: "a₂" },
            ],
            handles: [
              { id: "c1", x: s.c1[0], y: s.c1[1], color: COLORS.c1, onDrag: (x, y) => { s.c1 = [x, y]; draw(); } },
              { id: "c2", x: s.c2[0], y: s.c2[1], color: COLORS.c3, onDrag: (x, y) => { s.c2 = [x, y]; draw(); } },
            ],
          });
          calc.textContent = `\\(A = ${matToTex(A)},\\qquad \\det(A) = ${tx(d, 2)},\\qquad \\text{Alan} = ${tx(Math.abs(d), 2)}\\)`;
          if (Math.abs(d) < 0.08) {
            msg.className = "pc-msg bad";
            msg.textContent = L({ tr: "Tekil matris (det ≈ 0): düzlem bir doğruya çöktü, A⁻¹ yok!", en: "Singular matrix (det ≈ 0): plane collapsed to a line, A⁻¹ does not exist!" });
          } else if (d > 0) {
            msg.className = "pc-msg good";
            msg.textContent = L({ tr: `det > 0: yönelim korundu ve alan ${ns(d, 2)} katına çıktı. Tersinir!`, en: `det > 0: orientation preserved and area scaled by ${ns(d, 2)}. Invertible!` });
          } else {
            msg.className = "pc-msg info";
            msg.textContent = L({ tr: `det < 0: yönelim terslendi (ayna çevirmesi), alan çarpanı ${ns(Math.abs(d), 2)}. Tersinir!`, en: `det < 0: orientation flipped (mirror), area factor ${ns(Math.abs(d), 2)}. Invertible!` });
          }
        };
        draw();
      },
    },
    {
      id: "sq-inv",
      mathId: "m-sq-inv",
      title: { tr: "Ters Matris: Dönüşümü Geri Alma", en: "Matrix Inverse: Undoing a Transformation" },
      body: [
        {
          tr: R`\(\det(A) \ne 0\) olduğunda dönüşüm hiçbir bilgi kaybetmez ve geri alınabilir: \(A^{-1}(A\mathbf x) = \mathbf x\). \(2\times 2\) matrislerde köşegeni yer değiştirip, ters köşegenin işaretini değiştirip \(\det(A)\)'ya böleriz:`,
          en: R`When \(\det(A)\ne 0\), no information is lost and the map can be undone: \(A^{-1}(A\mathbf x)=\mathbf x\). For \(2\times 2\) matrices, swap the diagonal, negate the off-diagonal, and divide by \(\det(A)\):`,
        },
        { eq: R`A^{-1} = \frac{1}{ad - bc}\begin{bmatrix}d & -b\\ -c & a\end{bmatrix}` },
        {
          tr: R`<b>Deneyin:</b> \(A\)'nın girişlerini değiştirip \(A^{-1}\)'i ve \(AA^{-1} = I\) kontrolünü anlık görün; \(ad = bc\) yapıp tekillik anını test edin.`,
          en: R`<b>Try it:</b> edit entries of \(A\) to compute \(A^{-1}\) live; make \(ad = bc\) to trigger singularity.`,
        },
      ],
      demo(box, state) {
        const s = (state.inv ??= { A: [[2, 1], [1, 2]] });
        const row = h("div", { class: "mx-row-wrap" });
        const calc = h("div", { class: "pc-calc" });
        box.append(row, calc);
        const draw = () => {
          const d = det2(s.A);
          const inv = inv2(s.A);
          calc.textContent = inv
            ? `\\(\\det(A) = ${tx(d, 2)}\\ne 0 \\implies A^{-1} = ${matToTex(inv)},\\qquad A A^{-1} = I_2\\)`
            : `\\(\\det(A) = 0 \\implies A^{-1}\\ \\text{${L({ tr: "yoktur (tekil matris)", en: "does not exist (singular)" })}}\\)`;
        };
        row.append(h("div", {}, h("div", { class: "mini-title", text: "A" }), matrixInput(s.A, draw)));
        draw();
      },
    },
  ],
  playground: {
    title: { tr: "3×3 Determinant, Ters Matris ve Ortogonallik Hesaplayıcı", en: "3×3 Determinant, Inverse & Orthogonality Lab" },
    sub: {
      tr: R`3×3 bir kare matrisi düzenleyin veya hazır örneklerden (üst üçgensel, ortogonal dönme, tekil) birini seçerek \(\det(A)\), iz \(\operatorname{tr}(A)\) ve \(A^{-1}\)'i hesaplayın.`,
      en: R`Edit a 3×3 square matrix or load presets (upper triangular, orthogonal rotation, singular) to compute \(\det(A)\), trace \(\operatorname{tr}(A)\), and \(A^{-1}\).`,
    },
    build(host, state) {
      const s = (state.pg ??= {
        M: [[2, 1, 0], [0, 3, 1], [1, 0, 2]],
        preset: "gen",
      });
      const presets = {
        gen: { label: { tr: "Genel", en: "General" }, M: [[2, 1, 0], [0, 3, 1], [1, 0, 2]] },
        tri: { label: { tr: "Üçgensel", en: "Triangular" }, M: [[2, 4, -1], [0, 3, 5], [0, 0, -2]] },
        orth: { label: { tr: "Ortogonal", en: "Orthogonal" }, M: [[0, -1, 0], [1, 0, 0], [0, 0, 1]] },
        sing: { label: { tr: "Tekil (det=0)", en: "Singular" }, M: [[1, 2, 3], [2, 4, 6], [0, 1, 1]] },
      };
      const stage = h("div", { class: "pg-stage" });
      const side = h("div", { class: "pg-side" });
      host.append(stage, side);

      const ctl = h("div", { class: "t-controls" });
      const gridWrap = h("div", { class: "mx-row-wrap" });
      const tiles = h("div", { class: "pg-tiles" });
      const calc = h("div", { class: "pc-calc" });
      stage.append(ctl, gridWrap);
      side.append(tiles, calc);

      const draw = () => {
        const d = det3(s.M);
        const tr = s.M[0][0] + s.M[1][1] + s.M[2][2];
        const inv = invMatrix(s.M);
        tiles.replaceChildren(
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "det(A)" }), h("span", { class: "pg-tile-value", text: ns(d, 3) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: "tr(A)" }), h("span", { class: "pg-tile-value", text: ns(tr, 2) })),
          h("div", { class: "pg-tile" }, h("span", { class: "pg-tile-label", text: L({ tr: "Tersinir?", en: "Invertible?" }) }), h("span", { class: "pg-tile-value", text: inv ? L({ tr: "Evet", en: "Yes" }) : L({ tr: "Hayır", en: "No" }) })),
        );
        calc.textContent = inv
          ? `\\(A^{-1} = ${matToTex(inv)}\\)`
          : `\\(\\det(A) = 0 \\implies A\\ \\text{${L({ tr: "tekildir (tersi yoktur)", en: "is singular (no inverse)" })}}\\)`;
      };

      const rebuildEditor = () => {
        gridWrap.replaceChildren(matrixInput(s.M, draw));
        draw();
      };
      ctl.append(
        segmented(Object.entries(presets).map(([k, v]) => [k, v.label]), s.preset, (k) => {
          s.preset = k;
          s.M = presets[k].M.map((r) => [...r]);
          rebuildEditor();
        }),
      );
      rebuildEditor();
    },
  },
  mathSections: [
    {
      id: "m-sq-det",
      title: { tr: "Determinant Özellikleri ve Kofaktör Açılımı", en: "Determinant Laws & Cofactor Expansion" },
      blocks: [
        { eq: R`\det(AB) = \det(A)\det(B), \qquad \det(A^T) = \det(A), \qquad \det(cA) = c^n\det(A)` },
        {
          callout: "warn",
          title: { tr: "Klasik sınav tuzağı: det(cA) ≠ c det(A)!", en: "Classic exam trap: det(cA) ≠ c det(A)!" },
          text: {
            tr: R`Bir \(n\times n\) matrisi \(c\) ile çarpmak <b>her satırı</b> \(c\) ile çarpar, dolayısıyla \(\det(cA) = c^n \det(A)\) olur! Örneğin \(3\times 3\) matriste \(\det(2A) = 8\det(A)\).`,
            en: R`Multiplying an \(n\times n\) matrix by \(c\) scales <b>every row</b> by \(c\), so \(\det(cA) = c^n \det(A)\)! For a \(3\times 3\) matrix, \(\det(2A) = 8\det(A)\).`,
          },
        },
      ],
    },
    {
      id: "m-sq-inv",
      title: { tr: "Ters Matrisin Tekliği ve Ortogonal Matris İspatı", en: "Uniqueness of Inverse & Orthogonal Norm Preservation" },
      blocks: [
        {
          derive: {
            title: { tr: "det(A⁻¹) = 1 / det(A) ve Ortogonal matrislerin normu koruması", en: "Proof of det(A⁻¹) = 1/det(A) and ‖Qx‖ = ‖x‖" },
            steps: [
              { tex: R`A A^{-1} = I \implies \det(A)\det(A^{-1}) = \det(I) = 1`, why: { tr: "Determinantın çarpımsallığı kullanılır.", en: "Apply multiplicativity of the determinant." } },
              { tex: R`\det(A^{-1}) = \frac{1}{\det(A)}`, why: { tr: "A tersinir olduğundan det(A) ≠ 0'dır ve bölebiliriz.", en: "Since A is invertible, det(A) ≠ 0." } },
              { tex: R`\|Q\mathbf x\|^2 = (Q\mathbf x)^T (Q\mathbf x) = \mathbf x^T Q^T Q \mathbf x = \mathbf x^T I \mathbf x = \|\mathbf x\|^2`, why: { tr: "Ortogonal matriste QᵀQ = I olduğundan her vektörün uzunluğu korunur!", en: "For orthogonal Q (QᵀQ = I), every vector's length is preserved!" } },
            ],
          },
        },
      ],
    },
  ],
  practiceSections: PRACTICE,
});
