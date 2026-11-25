/*
 * Structured lesson tab (Formulas & Proofs and Practice): sticky TOC, numbered sections,
 * displayed equations, step-by-step interactive derivations/proofs, callouts, tables, and live widgets.
 */
import { L } from "./i18n.js";
import { $, CHAPTER, PLACE_TITLES, chapterOf, h, navigate, scrollMode } from "./core.js";
import { placeLabel, termify } from "./glossary/terms.js";

export const lessonText = (value) => (value == null || typeof value === "string" ? value || "" : L(value));

export function lessonHTML(tag, attrs, html) {
  const node = h(tag, attrs);
  node.innerHTML = termify(lessonText(html));
  return node;
}

export const lessonEq = (tex, cls = "") =>
  h("div", { class: `m-eq ${cls}`.trim(), text: `\\(\\displaystyle ${tex}\\)` });

export function createLesson(config) {
  const L_ = { started: false, rendered: false, observer: null, derive: {}, state: {} };
  const { tab, sections, widgets = {} } = config;
  for (const s of sections) PLACE_TITLES[s.id] = s.title;

  function derivation(block, key) {
    const steps = block.steps;
    const box = h("div", { class: "m-derive" });
    const counter = h("span", { class: "m-derive-count" });
    const list = h("ol", { class: "m-derive-steps" });
    for (const step of steps) {
      list.append(h("li", {}, lessonEq(lessonText(step.tex)), lessonHTML("p", { class: "m-why" }, step.why)));
    }
    const next = h("button", { type: "button", class: "btn small primary", text: L({ tr: "Sonraki adım ↓", en: "Next step ↓" }) });
    const all = h("button", { type: "button", class: "btn small", text: L({ tr: "Hepsini göster", en: "Show all" }) });
    const reset = h("button", { type: "button", class: "btn small", text: L({ tr: "Baştan", en: "Start over" }) });
    const show = (n, animate) => {
      L_.derive[key] = n;
      [...list.children].forEach((li, k) => {
        const visible = k < n;
        if (visible && li.hidden && animate) li.classList.add("m-reveal");
        li.hidden = !visible;
      });
      counter.textContent = L({ tr: `${n} / ${steps.length} adım`, en: `step ${n} of ${steps.length}` });
      next.disabled = n >= steps.length;
      all.disabled = n >= steps.length;
      reset.disabled = n <= 1;
    };
    next.addEventListener("click", () => {
      show(Math.min(steps.length, (L_.derive[key] ?? 1) + 1), true);
      list.children[L_.derive[key] - 1]?.scrollIntoView({ behavior: scrollMode(true), block: "nearest" });
      if (next.disabled) reset.focus({ preventScroll: true });
    });
    all.addEventListener("click", () => {
      show(steps.length, true);
      if (all.disabled) reset.focus({ preventScroll: true });
    });
    reset.addEventListener("click", () => {
      show(1, false);
      next.focus({ preventScroll: true });
    });
    box.append(
      h(
        "div",
        { class: "m-derive-head" },
        h("span", { class: "m-derive-kicker", text: L(block.kicker || { tr: "İspat / Türetme", en: "Proof / Derivation" }) }),
        h("strong", { text: L(block.title) }),
        counter,
      ),
      list,
      h("div", { class: "m-derive-ctl" }, next, all, reset),
    );
    show(L_.derive[key] ?? 1, false);
    return box;
  }

  function renderBlock(block, key) {
    if (block.p) return lessonHTML("p", {}, block.p);
    if (block.h) return h("h3", { class: "m-h3", text: L(block.h) });
    if (block.eq) return lessonEq(lessonText(block.eq));
    if (block.derive) return derivation(block.derive, key);
    if (block.widget) return widgets[block.widget]?.(L_.state) ?? null;
    if (block.model) return lessonHTML("div", { class: "in-model m-model" }, block.model);
    if (block.analogy) {
      const title = block.analogy.title ? L(block.analogy.title) : L({ tr: "Günlük hayattan benzetme", en: "Everyday analogy" });
      return h(
        "div",
        { role: "note", class: "edu-analogy m-model" },
        h("span", { class: "edu-analogy-icon", text: "🧭", "aria-hidden": "true" }),
        h("div", {}, h("strong", { text: title }), lessonHTML("p", {}, block.analogy.text)),
      );
    }
    if (block.example) {
      const ex = block.example;
      const list = h("ol", { class: "edu-ex-steps" });
      for (const st of ex.steps || []) {
        const li = h("li", {});
        if (st && typeof st === "object" && ("expr" in st || "note" in st)) {
          if (st.expr) li.append(h("div", { class: "edu-ex-expr", text: `\\(${lessonText(st.expr)}\\)` }));
          if (st.note) li.append(lessonHTML("p", { class: "edu-ex-note" }, st.note));
        } else {
          li.append(lessonHTML("p", { class: "edu-ex-note" }, st));
        }
        list.append(li);
      }
      return h(
        "div",
        { class: "edu-example m-model" },
        h(
          "div",
          { class: "edu-ex-head" },
          h("span", { class: "edu-ex-badge", text: L({ tr: "Çözümlü Örnek", en: "Worked Example" }) }),
          h("strong", { text: ex.title ? L(ex.title) : L({ tr: "Adım adım çözüm", en: "Step-by-step solution" }) }),
        ),
        ex.problem ? lessonHTML("p", { class: "edu-ex-prob" }, ex.problem) : null,
        list,
        ex.answer
          ? h(
              "div",
              { class: "edu-ex-ans" },
              h("strong", { text: L({ tr: "Sonuç: ", en: "Answer: " }) }),
              lessonHTML("span", {}, ex.answer),
            )
          : null,
      );
    }
    if (block.callout) {
      const icons = { tip: "💡", warn: "⚠️", info: "ℹ️" };
      return h(
        "div",
        { role: "note", class: `tut-callout ${block.callout}` },
        h("span", { class: "tut-callout-icon", text: icons[block.callout] || "ℹ️", "aria-hidden": "true" }),
        h("div", {}, h("strong", { text: L(block.title) }), lessonHTML("p", {}, block.text)),
      );
    }
    if (block.table) {
      return h(
        "div",
        { class: "table-wrap" },
        h(
          "table",
          { class: "data-table m-table" },
          h("thead", {}, h("tr", {}, ...block.table.head.map((c) => lessonHTML("th", {}, c)))),
          h("tbody", {}, ...block.table.rows.map((row) => h("tr", {}, ...row.map((c) => lessonHTML("td", {}, c))))),
        ),
      );
    }
    if (block.list) {
      const list = h(block.ordered ? "ol" : "ul", { class: "tut-list" });
      for (const item of block.list) list.append(lessonHTML("li", {}, item));
      return list;
    }
    if (block.links) {
      return h(
        "div",
        { class: "m-links" },
        h("span", { text: L({ tr: "Ayrıca bakın:", en: "See also:" }) }),
        ...block.links.map((place) => {
          const targetChapter = place.chapter || CHAPTER;
          if (chapterOf(targetChapter)?.url || targetChapter === CHAPTER) {
            return h("a", {
              href: "#",
              "data-go": `${place.tab}:${place.section || ""}`,
              "data-chapter": targetChapter,
              text: `${placeLabel({ chapter: CHAPTER, ...place })} →`,
            });
          }
          return h("span", { text: placeLabel({ chapter: CHAPTER, ...place }) });
        }),
      );
    }
    return null;
  }

  const goTo = (id) => navigate(tab, id);

  function render() {
    const main = $(config.main);
    const toc = $(config.toc);
    if (!main || !toc) return;
    main.replaceChildren();
    toc.replaceChildren();
    sections.forEach((section, k) => {
      const title = L(section.title);
      const kicker = L(config.kicker || { tr: "Kısım", en: "Section" });
      const article = h(
        "article",
        { class: "card tut-step m-step", id: section.id },
        h(
          "header",
          { class: "tut-step-head" },
          h("span", { class: "tut-num", text: String(k + 1) }),
          h(
            "div",
            {},
            h("span", {
              class: "tut-kicker",
              text: L({ tr: `${kicker} ${k + 1} / ${sections.length}`, en: `${kicker} ${k + 1} of ${sections.length}` }),
            }),
            h("h2", { text: title }),
          ),
        ),
      );
      section.blocks.forEach((block, b) => {
        const node = renderBlock(block, `${section.id}:${b}`);
        if (node) article.append(node);
      });
      const navFooter = h("footer", { class: "tut-nav" });
      if (k > 0) {
        const prev = h("button", { type: "button", class: "btn small", text: `← ${L(sections[k - 1].title)}` });
        prev.addEventListener("click", () => goTo(sections[k - 1].id));
        navFooter.append(prev);
      }
      if (k < sections.length - 1) {
        const next = h("button", { type: "button", class: "btn small primary", text: `${L(sections[k + 1].title)} →` });
        next.addEventListener("click", () => goTo(sections[k + 1].id));
        navFooter.append(next);
      }
      article.append(navFooter);
      main.append(article);
      const link = h("button", { type: "button", "data-step": section.id }, h("span", { class: "toc-num", text: String(k + 1) }), h("span", { text: title }));
      link.addEventListener("click", () => goTo(section.id));
      toc.append(h("li", {}, link));
    });

    L_.observer?.disconnect();
    L_.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const b of toc.querySelectorAll("button")) {
            b.classList.toggle("active", b.dataset.step === entry.target.id);
          }
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const article of main.querySelectorAll(".m-step")) L_.observer.observe(article);
    L_.rendered = true;
    config.onRender?.();
  }

  function readingPosition() {
    const steps = [...($(config.main)?.querySelectorAll(".m-step") ?? [])];
    if (!steps.length || !steps[0].getClientRects().length) return null;
    const topbar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h")) || 59;
    let anchor = steps[0];
    for (const step of steps) {
      if (step.getBoundingClientRect().top <= topbar + 40) anchor = step;
      else break;
    }
    return { id: anchor.id, top: anchor.getBoundingClientRect().top };
  }

  function start() {
    if (L_.started) return;
    L_.started = true;
    render();
  }

  document.addEventListener("tab-shown", (event) => {
    if (event.detail === tab) start();
  });

  document.addEventListener("lang-change", () => {
    if (!L_.rendered) return;
    const position = readingPosition();
    render();
    if (!position) return;
    const anchor = document.getElementById(position.id);
    if (!anchor) return;
    if (position.top >= 0) window.scrollBy({ top: anchor.getBoundingClientRect().top - position.top, behavior: "instant" });
    else anchor.scrollIntoView({ behavior: "instant", block: "start" });
  });

  return { state: L_.state, rerender: () => L_.rendered && render() };
}
