/*
 * Shared by every chapter page: DOM and locale number helpers, tooltip, history-aware
 * tab navigation, resize helper, theme/language wiring and grouped chapter dropdown menu.
 */
import { TABS, hooks } from "./page.ts";
import { wireSwitches } from "./switches.ts";
import { CHAPTERS, PARTS } from "./chapters.ts";
import { versionLine } from "./version.ts";
import { I18N, L, applyStaticTranslations } from "./i18n.js";

export const $ = (selector, root = document) => root.querySelector(selector);
export const SVG_NS = "http://www.w3.org/2000/svg";

export function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children) if (child != null) node.append(child);
  return node;
}

export function svg(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) if (value != null) node.setAttribute(key, value);
  return node;
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const locale = () => (I18N.lang === "en" ? "en-US" : "tr-TR");
export const formats = {};
export function fmtNum(value, digits = 2) {
  if (!Number.isFinite(value)) return value > 0 ? "+∞" : value < 0 ? "−∞" : "—";
  const clean = Math.abs(value) < 0.5 * 10 ** -(digits + 2) ? 0 : value;
  const key = `${I18N.lang}:${digits}`;
  formats[key] ??= new Intl.NumberFormat(locale(), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return formats[key].format(clean);
}
export function fmtShort(value, maxDigits = 3) {
  if (!Number.isFinite(value)) return value > 0 ? "+∞" : value < 0 ? "−∞" : "—";
  const clean = Math.abs(value) < 1e-10 ? 0 : value;
  return new Intl.NumberFormat(locale(), { maximumFractionDigits: maxDigits }).format(clean);
}
export const texNum = (text) => String(text).replace(/,/g, "{,}");

export function hexToRgb(hex) {
  const v = parseInt(hex.replace("#", ""), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

// =====================================================================
// Tooltip
// =====================================================================
export const tip = $("#tooltip");

export function showTip(x, y, title, rows = []) {
  if (!tip) return;
  tip.replaceChildren();
  if (title) tip.append(h("div", { class: "tip-title", text: title }));
  for (const row of rows) {
    const line = h("div", { class: "tip-row" });
    if (row.color) line.append(h("span", { class: "tip-key", style: `background:${row.color}` }));
    line.append(h("strong", { text: row.value }), h("span", { text: row.label }));
    tip.append(line);
  }
  tip.hidden = false;
  const box = tip.getBoundingClientRect();
  let left = x + 14;
  let top = y + 14;
  if (left + box.width > innerWidth - 8) left = x - 14 - box.width;
  if (top + box.height > innerHeight - 8) top = y - 14 - box.height;
  tip.style.left = `${Math.max(8, left)}px`;
  tip.style.top = `${Math.max(8, top)}px`;
}

export function hideTip() {
  if (tip) tip.hidden = true;
}

export function watchSize(target, callback) {
  let frame = 0;
  const observer = new ResizeObserver(() => {
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      callback();
    });
  });
  observer.observe(target);
  return {
    disconnect() {
      cancelAnimationFrame(frame);
      frame = 0;
      observer.disconnect();
    },
  };
}

// =====================================================================
// Tabs & Browser History Navigation
// =====================================================================
history.scrollRestoration = "manual";
export const nav = { tab: null, section: null, scroll: {} };
export const firstTab = () => Object.keys(TABS)[0];
export const glossaryOpenNow = () => Boolean(hooks.glossaryIsOpen?.());

export function parseHash(hash) {
  let text = hash || "";
  try {
    text = decodeURIComponent(text);
  } catch {
    text = "";
  }
  const [base, section] = text.split("/");
  const tab = Object.keys(TABS).find((key) => TABS[key].hash === base) || firstTab();
  return { tab, section: section || null };
}

export const hashFor = (tab, section) => TABS[tab].hash + (section ? `/${section}` : "");

export function showTab(name) {
  if (!TABS[name]) name = firstTab();
  if (nav.tab && nav.tab !== name) nav.scroll[nav.tab] = window.scrollY;
  nav.tab = name;
  document.body.dataset.tab = name;
  for (const [key, tab] of Object.entries(TABS)) {
    const active = key === name;
    const btn = $(tab.tab);
    const panel = $(tab.panel);
    if (btn) {
      btn.setAttribute("aria-selected", String(active));
      btn.tabIndex = active ? 0 : -1;
    }
    if (panel) panel.hidden = !active;
  }
  hideTip();
  document.dispatchEvent(new CustomEvent("tab-shown", { detail: name }));
}

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
export const scrollMode = (smooth) => (smooth && !reducedMotion.matches ? "smooth" : "instant");

export function scrollWhenReady({ y = null, section = null, smooth = false, flash = false, focus = false }) {
  const started = performance.now();
  const attempt = () => {
    const waited = performance.now() - started;
    if (section) {
      const target = document.getElementById(section);
      if (target && target.getClientRects().length) {
        target.scrollIntoView({ behavior: scrollMode(smooth), block: "start" });
        if (focus) {
          if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
          target.classList.add("nav-target");
          target.focus({ preventScroll: true });
        }
        if (flash) {
          target.classList.remove("nav-flash");
          void target.getBoundingClientRect();
          target.classList.add("nav-flash");
          setTimeout(() => target.classList.remove("nav-flash"), 1800);
        }
        return;
      }
    } else if (y != null) {
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (room >= y - 2 || waited > 2500) {
        window.scrollTo({ top: y, behavior: "instant" });
        return;
      }
    }
    if (waited < 4000) requestAnimationFrame(attempt);
  };
  attempt();
}

export function navigate(tab, section = null, { replace = false } = {}) {
  if (!TABS[tab] || (tab === nav.tab && !section)) return;
  if (tab === nav.tab && section === nav.section) {
    scrollWhenReady({ section, smooth: true });
    return;
  }
  history.replaceState({ ...history.state, tab: nav.tab, scroll: window.scrollY }, "");
  const entry = { tab, section, scroll: null, glossary: glossaryOpenNow() };
  if (replace) history.replaceState(entry, "", hashFor(tab, section));
  else history.pushState(entry, "", hashFor(tab, section));
  const sameTab = tab === nav.tab;
  nav.section = section;
  showTab(tab);
  if (section) scrollWhenReady({ section, smooth: sameTab, flash: !sameTab, focus: !glossaryOpenNow() });
  else scrollWhenReady({ y: nav.scroll[tab] ?? 0 });
}

export const selectTab = (name) => navigate(name);

window.addEventListener("popstate", (event) => {
  const state = event.state || { ...parseHash(location.hash), scroll: null };
  const section = state.section ?? null;
  const panelOnly = state.tab === nav.tab && section === nav.section && Boolean(state.glossary) !== glossaryOpenNow();
  nav.section = section;
  hooks.syncGlossary?.(state);
  if (panelOnly) return;
  showTab(state.tab);
  if (state.scroll != null) scrollWhenReady({ y: state.scroll });
  else if (state.section) scrollWhenReady({ section: state.section });
  else scrollWhenReady({ y: 0 });
});

export const phoneWidth = matchMedia("(max-width: 720px)");
let scrollSaveTimer = 0;
window.addEventListener("scroll", () => {
  clearTimeout(scrollSaveTimer);
  scrollSaveTimer = setTimeout(() => {
    if (nav.tab) history.replaceState({ ...history.state, tab: nav.tab, scroll: window.scrollY }, "");
  }, 250);
}, { passive: true });

const topbar = $(".topbar");
if (topbar) {
  new ResizeObserver(() =>
    document.documentElement.style.setProperty("--topbar-h", `${topbar.offsetHeight}px`),
  ).observe(topbar);
}

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("[data-go]");
  if (!link) return;
  event.preventDefault();
  const [tab, section] = link.dataset.go.split(":");
  goToChapterPlace({ chapter: link.dataset.chapter, tab, section: section || null });
  if (!section && TABS[tab] && !link.getClientRects().length) $(TABS[tab].tab)?.focus();
});

export function wireTabs() {
  for (const [key, tab] of Object.entries(TABS)) {
    $(tab.tab)?.addEventListener("click", () => navigate(key));
  }
  $(".tabs")?.addEventListener("keydown", (event) => {
    const keys = Object.keys(TABS);
    const i = keys.indexOf(nav.tab);
    const next = {
      ArrowRight: keys[(i + 1) % keys.length],
      ArrowLeft: keys[(i - 1 + keys.length) % keys.length],
      Home: keys[0],
      End: keys[keys.length - 1],
    }[event.key];
    if (!next) return;
    event.preventDefault();
    navigate(next, null, { replace: true });
    $(TABS[next].tab)?.focus();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireTabs();
  const { tab, section } = parseHash(location.hash);
  const saved = history.state?.tab === tab ? history.state.scroll : null;
  history.replaceState({ tab, section, scroll: saved ?? null }, "", hashFor(tab, section));
  nav.section = section;
  showTab(tab);
  if (saved != null) scrollWhenReady({ y: saved });
  else if (section) scrollWhenReady({ section });
});

// =====================================================================
// Chapters & Dropdown Menu
// =====================================================================
export { CHAPTERS, PARTS };
export const CHAPTER = document.body.dataset.chapter || "";
export const TAB_HASHES = { theory: "#teori", play: "#deneme", math: "#matematik", practice: "#alistirma" };
export const TAB_NAMES = {
  theory: { tr: "Teori", en: "Theory" },
  play: { tr: "Deneme alanı", en: "Playground" },
  math: { tr: "Formüller & İspat", en: "Formulas & Proofs" },
  practice: { tr: "Alıştırma", en: "Practice" },
};
export const chapterOf = (id) => CHAPTERS.find((c) => c.id === id);
export const PLACE_TITLES = {};

export function goToChapterPlace({ chapter, tab, section = null }) {
  if (!chapter || chapter === CHAPTER) {
    navigate(tab, section);
    return;
  }
  const target = chapterOf(chapter);
  if (target?.url) location.href = target.url + (TAB_HASHES[tab] || "") + (section ? `/${section}` : "");
}

export function renderChapters() {
  const button = $("#chapter-btn");
  const menu = $("#chapter-menu");
  if (!button || !menu) return;
  const pathName = L({ tr: "Öğrenme yolu", en: "Learning path" });
  const top = h(
    "div",
    { class: "chm-top" },
    h("span", { class: "chm-head", text: pathName }),
    h("a", { class: "chm-home", href: "index.html", text: L({ tr: "← Ana sayfa", en: "← Home" }) }),
  );
  const frag = document.createDocumentFragment();
  frag.append(top);
  for (const part of PARTS) {
    const items = CHAPTERS.filter((c) => c.part === part.id);
    if (!items.length) continue;
    frag.append(h("div", { class: "chm-group", text: `${part.roman}. ${L(part.short)}` }));
    const list = h("ol", { class: "chm-list" });
    for (const c of items) {
      const current = c.id === CHAPTER;
      const meta = current ? `${c.lecture} · ${L({ tr: "şu an buradasınız", en: "you are here" })}` : c.lecture;
      const inner = [
        h("span", { class: "chm-num", text: String(c.number) }),
        h(
          "span",
          { class: "chm-text" },
          h("span", { class: "chm-title", text: L(c.title) }),
          h("span", { class: "chm-sub", text: L(c.sub) }),
          h("span", { class: "chm-meta", text: meta }),
        ),
      ];
      const item =
        c.url && !current
          ? h("a", { class: "chm-item", href: c.url }, ...inner)
          : h("span", { class: `chm-item${current ? " current" : ""}`, "aria-current": current ? "page" : null }, ...inner);
      list.append(h("li", {}, item));
    }
    frag.append(list);
  }
  frag.append(versionLine("chm-version"));
  menu.setAttribute("aria-label", pathName);
  menu.replaceChildren(frag);
  const here = CHAPTERS.findIndex((c) => c.id === CHAPTER) + 1;
  button.title = `${pathName} · ${L({ tr: "Bölüm", en: "Chapter" })} ${here}/${CHAPTERS.length}`;
}

export function setChapterMenu(open, { focusButton = false } = {}) {
  const button = $("#chapter-btn");
  const menu = $("#chapter-menu");
  if (!button || !menu || open === !menu.hidden) return;
  if (open && topbar) {
    const bar = topbar.getBoundingClientRect();
    menu.style.top = `${Math.round(bar.bottom - menu.parentElement.getBoundingClientRect().top + 6)}px`;
    menu.style.maxHeight = `${Math.max(160, Math.round(window.innerHeight - bar.bottom - 14))}px`;
  }
  menu.hidden = !open;
  button.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("chapter-menu-open", open);
  if (focusButton) button.focus();
}

document.addEventListener("click", (event) => {
  const menu = $("#chapter-menu");
  if (!menu) return;
  if (event.target.closest("#chapter-btn")) setChapterMenu(menu.hidden);
  else if (!event.target.closest("#chapter-menu")) setChapterMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || $("#chapter-menu")?.hidden !== false) return;
  event.stopImmediatePropagation();
  setChapterMenu(false, { focusButton: true });
}, true);
$(".brand")?.addEventListener("focusout", (event) => {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setChapterMenu(false);
});
document.addEventListener("lang-change", renderChapters);
renderChapters();

wireSwitches();
applyStaticTranslations();
