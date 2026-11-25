/*
 * Shared chapter building blocks: number formatting for TeX, theme colors,
 * sliders, segmented controls, Theory section cards, and chapter navigation footers.
 */
import { L } from "./i18n.js";
import { CHAPTER, CHAPTERS, TAB_HASHES, cssVar, fmtNum, fmtShort, h, texNum, watchSize } from "./core.js";
import { termify } from "./glossary/terms.js";

export const KIT = (() => {
  const R = String.raw;
  const nf = (v, d = 2) => fmtNum(v, d);
  const ns = (v, d = 3) => fmtShort(v, d);
  const tx = (v, d = 2) => texNum(nf(v, d));
  const txs = (v, d = 2) => (v < 0 ? `-\\,${tx(-v, d)}` : `+\\,${tx(v, d)}`);
  const txp = (v, d = 2) => (v < 0 ? `(${tx(v, d)})` : tx(v, d));
  const T = (value) => termify(L(value));

  function html(tag, attrs, content) {
    const node = h(tag, attrs);
    node.innerHTML = T(content);
    return node;
  }

  const formula = (tex) => h("div", { class: "formula", text: `\\(\\displaystyle ${tex}\\)` });

  const COLORS = {
    c1: "#2a78d6",
    c2: "#eb6834",
    c3: "#1baf7a",
    c4: "#8d52c9",
    good: "#0ca30c",
    bad: "#d03b3b",
    text: "#0b0b0b",
    text2: "#52514e",
    muted: "#6b6a65",
    grid: "#e1e0d9",
    axis: "#c3c2b7",
    surface: "#fcfcfb",
    surface2: "#f2f1ed",
    accent: "#2a78d6",
    accentSoft: "#e3eefb",
    page: "#f9f9f7",
  };
  function readColors() {
    Object.assign(COLORS, {
      c1: cssVar("--series-1") || "#2a78d6",
      c2: cssVar("--series-2") || "#eb6834",
      c3: cssVar("--series-3") || "#1baf7a",
      c4: cssVar("--series-4") || "#8d52c9",
      good: cssVar("--good") || "#0ca30c",
      bad: cssVar("--critical") || "#d03b3b",
      text: cssVar("--text") || "#0b0b0b",
      text2: cssVar("--text-2") || "#52514e",
      muted: cssVar("--muted") || "#6b6a65",
      grid: cssVar("--grid") || "#e1e0d9",
      axis: cssVar("--axis") || "#c3c2b7",
      surface: cssVar("--surface") || "#fcfcfb",
      surface2: cssVar("--surface-2") || "#f2f1ed",
      accent: cssVar("--accent") || "#2a78d6",
      accentSoft: cssVar("--accent-soft") || "#e3eefb",
      page: cssVar("--page") || "#f9f9f7",
    });
  }
  readColors();

  const redrawers = new Set();
  const observers = [];

  document.addEventListener("theme-change", () => {
    readColors();
    for (const fn of redrawers) fn();
  });

  function clearObservers() {
    for (const o of observers) o.disconnect();
    observers.length = 0;
    redrawers.clear();
  }

  function fitCanvas(canvas, render) {
    const view = { w: 0, h: 0 };
    const resize = () => {
      const w = canvas.clientWidth;
      const hgt = canvas.clientHeight;
      if (!w || !hgt) return;
      view.w = w;
      view.h = hgt;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(hgt * dpr);
      render();
    };
    observers.push(watchSize(canvas, resize));
    redrawers.add(() => render());
    requestAnimationFrame(resize);
    return view;
  }

  function slider(label, { min, max, step, value, onInput, fmt = (v) => ns(v, 2) }) {
    const input = h("input", { type: "range", min, max, step, value });
    const out = h("output", { text: fmt(value) });
    input.addEventListener("input", () => {
      const v = Number(input.value);
      out.textContent = fmt(v);
      onInput(v);
    });
    const nameEl = h("span", { class: "pc-slider-name" });
    nameEl.innerHTML = L(label);
    const node = h("label", {}, nameEl, input, out);
    node.set = (v) => {
      input.value = v;
      out.textContent = fmt(v);
    };
    return node;
  }

  function segmented(options, current, onPick, aria) {
    const box = h("div", { class: "seg", role: "group", "aria-label": aria ? L(aria) : null });
    for (const [value, label] of options) {
      const b = h("button", {
        type: "button",
        "aria-pressed": String(value === current),
        "data-value": String(value),
        text: L(label),
      });
      b.addEventListener("click", () => {
        for (const other of box.children) other.setAttribute("aria-pressed", String(other === b));
        onPick(value);
      });
      box.append(b);
    }
    box.set = (value) => {
      for (const b of box.children) b.setAttribute("aria-pressed", String(b.dataset.value === String(value)));
    };
    return box;
  }

  function sectionCard(id, num, title, paragraphs, demo, mathSection = null) {
    const head = h("div", { class: "t-head" }, h("span", { class: "t-num", text: String(num) }), h("h2", { text: L(title) }));
    if (mathSection) {
      head.append(
        h("a", {
          href: "#",
          class: "m-theory-link",
          "data-go": `math:${mathSection}`,
          text: L({ tr: "∑ Formüller & İspat →", en: "∑ Formulas & Proofs →" }),
        }),
      );
    }
    const body = h("div", { class: "t-text" }, head, ...paragraphs);
    return h("article", { class: "card t-section", id }, body, demo);
  }

  function chapterNavCards() {
    const k = CHAPTERS.findIndex((c) => c.id === CHAPTER);
    const prev = CHAPTERS[k - 1];
    const next = CHAPTERS[k + 1];
    const row = h("div", { class: "pc-next-row" });
    if (prev?.url) {
      row.append(
        h(
          "a",
          { class: "pc-next link prev", href: prev.url + TAB_HASHES.theory },
          h("span", { class: "pc-next-go", text: "←" }),
          h("span", { text: L({ tr: "Önceki:", en: "Previous:" }) }),
          h("strong", { text: `${prev.number} · ${L(prev.title)}` }),
        ),
      );
    } else {
      row.append(
        h(
          "a",
          { class: "pc-next link prev", href: "index.html" },
          h("span", { class: "pc-next-go", text: "←" }),
          h("strong", { text: L({ tr: "Öğrenme yoluna dön", en: "Back to learning path" }) }),
        ),
      );
    }
    if (next?.url) {
      row.append(
        h(
          "a",
          { class: "pc-next link", href: next.url + TAB_HASHES.theory },
          h("span", { text: L({ tr: "Sıradaki bölüm:", en: "Next chapter:" }) }),
          h("strong", { text: `${next.number} · ${L(next.title)}` }),
          h("span", { class: "pc-next-go", text: "→" }),
        ),
      );
    } else {
      row.append(
        h(
          "a",
          { class: "pc-next link", href: "index.html" },
          h("strong", { text: L({ tr: "Tüm derslere dön", en: "All lectures" }) }),
          h("span", { class: "pc-next-go", text: "→" }),
        ),
      );
    }
    return row;
  }

  return {
    R, nf, ns, tx, txs, txp, T, html, formula, COLORS, readColors,
    redrawers, observers, clearObservers, fitCanvas, slider, segmented,
    sectionCard, chapterNavCards,
  };
})();
