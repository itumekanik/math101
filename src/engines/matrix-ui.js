/*
 * Reusable interactive matrix widgets: editable numeric grids, formatted matrix display
 * with pivot/augmented-column highlights, and interactive step-by-step Gaussian elimination.
 */
import { h, fmtShort } from "../shared/core.js";
import { L } from "../shared/i18n.js";
import { rrefSteps } from "./math-core.ts";

export function matrixInput(mat, onChange, { augCol = null } = {}) {
  const cols = mat[0].length;
  const grid = h("div", { class: "mx-grid", style: `grid-template-columns:repeat(${cols}, auto)` });
  mat.forEach((row, r) => {
    row.forEach((val, c) => {
      const inp = h("input", {
        type: "number",
        step: "0.5",
        value: String(val),
        class: augCol === c ? "aug" : null,
        "aria-label": `R${r + 1} C${c + 1}`,
      });
      inp.addEventListener("input", () => {
        const num = Number(inp.value);
        if (Number.isFinite(num)) {
          mat[r][c] = num;
          onChange(mat);
        }
      });
      grid.append(inp);
    });
  });
  return grid;
}

export function matrixDisplay(mat, { pivots = [], changedRows = [], augCol = null } = {}) {
  const cols = mat[0]?.length ?? 0;
  const grid = h("div", { class: "mx-grid", style: `grid-template-columns:repeat(${cols}, auto)` });
  const pivotSet = new Set(pivots.map(([r, c]) => `${r},${c}`));
  const changed = new Set(changedRows);
  mat.forEach((row, r) => {
    row.forEach((val, c) => {
      const classes = ["mx-cell"];
      if (pivotSet.has(`${r},${c}`)) classes.push("pivot");
      else if (changed.has(r)) classes.push("changed");
      if (augCol === c) classes.push("aug");
      grid.append(h("span", { class: classes.join(" "), text: fmtShort(val, 2) }));
    });
  });
  return grid;
}

/** Formats a matrix as LaTeX bmatrix string */
export function matToTex(mat, digits = 2) {
  const rows = mat.map((row) =>
    row
      .map((v) => {
        const c = Math.abs(v) < 1e-9 ? 0 : v;
        return Number.isInteger(c) ? String(c) : c.toFixed(digits).replace(/\.?0+$/, "");
      })
      .join(" & "),
  );
  return `\\begin{bmatrix} ${rows.join(" \\\\ ")} \\end{bmatrix}`;
}

/** Interactive Gaussian elimination / RREF stepper widget */
export function createRrefStepper(host, mat, coeffCols) {
  let idx = 0;
  const box = h("div", { class: "t-demo" });
  const controls = h("div", { class: "t-controls" });
  const stage = h("div", { class: "mx-row-wrap" });
  const opNote = h("div", { class: "pc-msg info" });

  let computed = rrefSteps(mat, coeffCols);

  const prevBtn = h("button", { type: "button", class: "btn small", text: L({ tr: "← Önceki", en: "← Prev" }) });
  const nextBtn = h("button", { type: "button", class: "btn small primary", text: L({ tr: "Sonraki adım →", en: "Next step →" }) });
  const endBtn = h("button", { type: "button", class: "btn small", text: "RREF" });
  const badge = h("span", { class: "mx-step-badge" });

  function render() {
    idx = Math.max(0, Math.min(idx, computed.steps.length - 1));
    const step = computed.steps[idx];
    badge.textContent = L({
      tr: `Adım ${idx + 1} / ${computed.steps.length}`,
      en: `Step ${idx + 1} of ${computed.steps.length}`,
    });
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx >= computed.steps.length - 1;
    endBtn.disabled = idx >= computed.steps.length - 1;
    opNote.textContent = L(step.op);
    stage.replaceChildren(
      matrixDisplay(step.matrix, {
        pivots: step.pivots,
        changedRows: step.changedRows,
        augCol: coeffCols < step.matrix[0].length ? coeffCols : null,
      }),
    );
  }

  prevBtn.addEventListener("click", () => { idx--; render(); });
  nextBtn.addEventListener("click", () => { idx++; render(); });
  endBtn.addEventListener("click", () => { idx = computed.steps.length - 1; render(); });

  controls.append(prevBtn, nextBtn, endBtn, badge);
  box.append(controls, opNote, stage);
  host.append(box);
  render();

  return {
    update(newMat, newCoeffCols = coeffCols) {
      computed = rrefSteps(newMat, newCoeffCols);
      idx = 0;
      render();
      return computed;
    },
    getResult: () => computed,
  };
}
