/*
 * Glossary side drawer + inline floating term cards with navigation history.
 */
import { hooks } from "../page.ts";
import { I18N, L } from "../i18n.js";
import { $, CHAPTER, chapterOf, goToChapterPlace, h, hideTip, nav, navigate, phoneWidth, scrollMode } from "../core.js";
import { GLOSSARY, GLOSSARY_GROUPS, otherLang, placeLabel, relatedTerms, termPlaces, termify } from "./terms.js";

export const termChip = (key) =>
  h("button", { type: "button", class: "gl-chip gl-term", "data-term": key, text: L(GLOSSARY[key].name) });

export function renderTerm(key, { glossaryLink }) {
  const entry = GLOSSARY[key];
  const alt = entry.name[otherLang()];
  const nodes = [];
  const def = h("div", { class: "g-def" });
  def.innerHTML = termify(L(entry.def), key);
  nodes.push(def);
  if (entry.note) {
    const label = L(entry.noteLabel || { tr: "Önemli nokta", en: "Key insight" });
    const note = h("p", { class: "g-model" }, h("b", { text: `${label}: ` }));
    note.insertAdjacentHTML("beforeend", termify(L(entry.note), key));
    nodes.push(note);
  }
  const related = relatedTerms(key);
  if (related.length) {
    nodes.push(h("div", { class: "g-see" }, h("span", { text: L({ tr: "İlgili:", en: "Related:" }) }), ...related.map(termChip)));
  }
  const links = h("div", { class: "g-links" });
  for (const place of termPlaces(key)) {
    const ch = place.chapter || CHAPTER;
    if (ch !== CHAPTER && !chapterOf(ch)?.url) continue;
    const a = h("a", { href: "#", class: "g-place", text: `${placeLabel(place)} →` });
    a.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      goToPlace(place);
    });
    links.append(a);
  }
  if (glossaryLink) {
    const a = h("a", { href: "#", class: "g-open", text: L({ tr: "Sözlükte aç", en: "Open in glossary" }) });
    a.addEventListener("click", (event) => {
      event.preventDefault();
      closeTerm();
      openGlossary(key);
    });
    links.append(a);
  }
  if (links.childNodes.length) nodes.push(links);
  return { title: L(entry.name), alt: alt !== L(entry.name) ? alt : "", nodes };
}

export function goToPlace(link) {
  closeTerm();
  const target = link.chapter || CHAPTER;
  if (target !== CHAPTER) {
    goToChapterPlace({ ...link, chapter: target });
    return;
  }
  const moves = link.tab !== nav.tab || Boolean(link.section);
  if (glossary.open) closeGlossary({ fromLink: moves });
  if (moves) navigate(link.tab, link.section || null);
}

export function placeNear(el, anchor) {
  el.style.left = "0px";
  el.style.top = "0px";
  const viewW = document.documentElement.clientWidth;
  const viewH = document.documentElement.clientHeight;
  const b = anchor.getBoundingClientRect();
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  let left = b.left + b.width / 2 - width / 2;
  left = Math.max(12, Math.min(left, viewW - width - 12));
  let top = b.bottom + 8;
  if (top + height > viewH - 12 && b.top - height - 8 > 12) top = b.top - height - 8;
  el.style.left = `${left + window.scrollX}px`;
  el.style.top = `${top + window.scrollY}px`;
}

export const termCard = { el: null, anchor: null, key: null, trail: [] };

function buildTermCard() {
  const back = h("button", { type: "button", class: "btn small icon gl-card-back", text: "←" });
  back.addEventListener("click", () => {
    const prev = termCard.trail.pop();
    if (prev) showTerm(prev);
  });
  const close = h("button", { type: "button", class: "btn small icon gl-card-close", text: "×" });
  close.addEventListener("click", closeTerm);
  termCard.el = h(
    "div",
    { class: "gl-card", role: "dialog", hidden: true },
    h(
      "div",
      { class: "gl-card-head" },
      back,
      h("div", { class: "gl-card-titles" }, h("strong", { class: "gl-card-title" }), h("span", { class: "gl-card-alt" })),
      close,
    ),
    h("div", { class: "gl-card-body" }),
  );
  document.body.append(termCard.el);
}

function showTerm(key) {
  termCard.key = key;
  const view = renderTerm(key, { glossaryLink: true });
  const card = termCard.el;
  card.querySelector(".gl-card-title").textContent = view.title;
  card.querySelector(".gl-card-alt").textContent = view.alt;
  card.querySelector(".gl-card-alt").hidden = !view.alt;
  card.querySelector(".gl-card-body").replaceChildren(...view.nodes);
  const back = card.querySelector(".gl-card-back");
  back.hidden = !termCard.trail.length;
  card.querySelector(".gl-card-close").setAttribute("aria-label", L({ tr: "Kapat", en: "Close" }));
  card.setAttribute("aria-label", view.title);
  placeNear(card, termCard.anchor);
}

function openTerm(key, anchor) {
  if (termCard.anchor === anchor && termCard.key === key && !termCard.trail.length) {
    closeTerm();
    return;
  }
  termCard.anchor?.setAttribute("aria-expanded", "false");
  termCard.anchor = anchor;
  termCard.trail = [];
  anchor.setAttribute("aria-expanded", "true");
  hideTip();
  termCard.el.hidden = false;
  showTerm(key);
  termCard.el.querySelector(".gl-card-close").focus({ preventScroll: true });
}

export function closeTerm() {
  if (!termCard.anchor) return;
  termCard.anchor.setAttribute("aria-expanded", "false");
  const anchor = termCard.anchor;
  termCard.anchor = null;
  termCard.key = null;
  termCard.trail = [];
  termCard.el.hidden = true;
  if (termCard.el.contains(document.activeElement) && anchor.isConnected) anchor.focus({ preventScroll: true });
}

export const glossary = { el: null, list: null, search: null, empty: null, count: null, open: false, opener: null };
const fold = (s) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i");

function buildGlossary() {
  const close = h("button", { type: "button", class: "btn small icon glossary-close", text: "×" });
  close.addEventListener("click", () => closeGlossary());
  glossary.search = h("input", { type: "search", class: "glossary-search", autocomplete: "off", spellcheck: "false" });
  glossary.search.addEventListener("input", filterGlossary);
  glossary.count = h("span", { class: "glossary-count" });
  glossary.list = h("div", { class: "glossary-list" });
  glossary.empty = h("p", { class: "glossary-empty", hidden: true });
  glossary.el = h(
    "aside",
    { class: "glossary", id: "glossary", "aria-labelledby": "glossary-title", inert: "" },
    h("div", { class: "glossary-head" }, h("div", {}, h("h2", { id: "glossary-title" }), glossary.count), close),
    h("div", { class: "glossary-tools" }, glossary.search),
    glossary.list,
    glossary.empty,
  );
  document.body.append(glossary.el);
  renderGlossary();
}

function renderGlossary() {
  glossary.el.querySelector("#glossary-title").textContent = L({ tr: "Matematik Sözlüğü", en: "Math Glossary" });
  glossary.el.querySelector(".glossary-close").setAttribute("aria-label", L({ tr: "Sözlüğü kapat", en: "Close glossary" }));
  glossary.search.placeholder = L({ tr: "Kavram ara (TR veya EN)…", en: "Search a term (EN or TR)…" });
  glossary.empty.textContent = L({ tr: "Bu aramayla eşleşen kavram yok.", en: "No term matches this search." });
  const collator = new Intl.Collator(I18N.lang);
  const sections = GLOSSARY_GROUPS.map((group) => {
    const keys = Object.keys(GLOSSARY)
      .filter((key) => GLOSSARY[key].group === group.key)
      .sort((a, b) => collator.compare(L(GLOSSARY[a].name), L(GLOSSARY[b].name)));
    return h(
      "section",
      { class: "glossary-group", "data-group": group.key },
      h("h3", { text: L(group.title) }),
      ...keys.map((key) => {
        const view = renderTerm(key, { glossaryLink: false });
        return h(
          "article",
          { class: "g-entry", id: `g-${key}`, "data-term-entry": key, tabindex: "-1" },
          h("h4", {}, h("span", { text: view.title }), view.alt ? h("span", { class: "g-alt", text: view.alt }) : null),
          ...view.nodes,
        );
      }),
    );
  });
  glossary.list.replaceChildren(...sections);
  filterGlossary();
}

function filterGlossary() {
  const query = fold(glossary.search.value.trim());
  let shown = 0;
  for (const article of glossary.list.querySelectorAll(".g-entry")) {
    const entry = GLOSSARY[article.dataset.termEntry];
    const names = fold([entry.name.tr, entry.name.en, ...(entry.aka || [])].join(" "));
    const text = fold(article.textContent);
    const match = !query || names.includes(query) || text.includes(query);
    article.hidden = !match;
    article.classList.toggle("g-name-match", Boolean(query) && names.includes(query));
    if (match) shown++;
  }
  for (const section of glossary.list.querySelectorAll(".glossary-group")) {
    section.hidden = !section.querySelector(".g-entry:not([hidden])");
  }
  glossary.empty.hidden = shown > 0;
  const total = Object.keys(GLOSSARY).length;
  glossary.count.textContent = query
    ? L({ tr: `${shown} / ${total} kavram`, en: `${shown} of ${total} terms` })
    : L({ tr: `${total} kavram`, en: `${total} terms` });
}

function showGlossaryEntry(key, { smooth = true } = {}) {
  let article = glossary.list.querySelector(`#g-${CSS.escape(key)}`);
  if (article?.hidden) {
    glossary.search.value = "";
    filterGlossary();
    article = glossary.list.querySelector(`#g-${CSS.escape(key)}`);
  }
  if (!article) return;
  article.scrollIntoView({ behavior: scrollMode(smooth), block: "start" });
  article.classList.remove("nav-flash");
  void article.getBoundingClientRect();
  article.classList.add("nav-flash");
  setTimeout(() => article.classList.remove("nav-flash"), 1800);
  article.focus({ preventScroll: true });
}

function setGlossaryVisible(visible) {
  glossary.open = visible;
  glossary.el.classList.toggle("open", visible);
  glossary.el.toggleAttribute("inert", !visible);
  document.body.classList.toggle("glossary-open", visible);
  $("#glossary-btn")?.setAttribute("aria-expanded", String(visible));
  for (const el of document.querySelectorAll("body > main")) el.inert = visible && phoneWidth.matches;
}

export function openGlossary(key = null) {
  if (!glossary.open) {
    glossary.opener = document.activeElement;
    history.replaceState({ ...history.state, tab: nav.tab, scroll: window.scrollY }, "");
    history.pushState({ ...history.state, glossary: true, glossaryStep: true, gscroll: 0 }, "");
    setGlossaryVisible(true);
  }
  if (key) showGlossaryEntry(key, { smooth: false });
  else {
    glossary.list.scrollTop = 0;
    glossary.search.focus({ preventScroll: true });
  }
}

export function closeGlossary({ fromLink = false } = {}) {
  if (!glossary.open) return;
  if (fromLink) {
    history.replaceState({ ...history.state, gscroll: glossary.list.scrollTop }, "");
    setGlossaryVisible(false);
    return;
  }
  if (history.state?.glossaryStep) history.back();
  else {
    history.replaceState({ ...history.state, glossary: false }, "");
    setGlossaryVisible(false);
  }
  if (glossary.opener?.isConnected && glossary.opener !== document.body) glossary.opener.focus({ preventScroll: true });
}

export const glossaryIsOpen = () => glossary.open;

export function syncGlossary(state) {
  const want = Boolean(state?.glossary);
  if (want === glossary.open) return;
  setGlossaryVisible(want);
  if (want) glossary.list.scrollTop = state.gscroll || 0;
}

buildTermCard();
buildGlossary();

$("#glossary-btn")?.addEventListener("click", () => (glossary.open ? closeGlossary() : openGlossary()));

document.addEventListener("click", (event) => {
  const term = event.target.closest?.(".gl-term");
  if (term) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const key = term.dataset.term;
    if (!GLOSSARY[key]) return;
    if (glossary.el.contains(term)) showGlossaryEntry(key);
    else if (termCard.el.contains(term)) {
      termCard.trail.push(termCard.key);
      showTerm(key);
    } else openTerm(key, term);
    return;
  }
  if (termCard.anchor && !event.composedPath().includes(termCard.el)) closeTerm();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (termCard.anchor) {
    closeTerm();
    event.stopImmediatePropagation();
  } else if (glossary.open) {
    if (document.activeElement === glossary.search && glossary.search.value) {
      glossary.search.value = "";
      filterGlossary();
    } else closeGlossary();
    event.stopImmediatePropagation();
  }
}, true);

window.addEventListener("resize", () => { if (termCard.anchor) placeNear(termCard.el, termCard.anchor); });
document.addEventListener("tab-shown", closeTerm);

function labelGlossaryButton() {
  const btn = $("#glossary-btn");
  if (!btn) return;
  const span = btn.querySelector(".glossary-btn-text");
  if (span) span.textContent = L({ tr: "Sözlük", en: "Glossary" });
  btn.title = L({ tr: "Kavramlar sözlüğü", en: "Glossary of terms" });
}
labelGlossaryButton();
document.addEventListener("lang-change", () => {
  renderGlossary();
  if (termCard.anchor && termCard.key) showTerm(termCard.key);
  labelGlossaryButton();
});

hooks.glossaryIsOpen = glossaryIsOpen;
hooks.syncGlossary = syncGlossary;
