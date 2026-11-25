/*
 * Language support (Turkish / English).
 */
export const I18N = { lang: "tr" };
try {
  const saved = localStorage.getItem("lang");
  if (saved === "tr" || saved === "en") I18N.lang = saved;
} catch { /* default Turkish */ }
document.documentElement.lang = I18N.lang;

export function L(value) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("tr" in value || "en" in value)) {
    return value[I18N.lang] ?? value.tr;
  }
  return value;
}

export const STRINGS = {};
export const STATIC_EN = {
  "a.sections": "Sections",
  "a.theme": "Theme",
  "a.mtoc": "Math sections",
  "a.ptoc": "Practice sections",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System theme",
  "tab.theory": "Theory",
  "tab.play": "Playground",
  "tab.math": 'Formulas<span class="tab-long"> &amp; Proofs</span>',
  "tab.practice": "Practice",
  "math.kicker": "Theorems & Proofs",
  "math.title": "Formulas and derivations",
  "math.loading": "Loading…",
  "practice.kicker": "Question by question",
  "practice.title": "Chapter practice",
};

export function t(key, params) {
  const entry = STRINGS[key];
  let text = entry ? (entry[I18N.lang] ?? entry.tr) : key;
  if (params) text = text.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
  return text;
}

export function applyStaticTranslations() {
  for (const el of document.querySelectorAll("[data-i18n]")) {
    if (el._tr === undefined) el._tr = el.innerHTML;
    const en = el.dataset.en ?? STATIC_EN[el.dataset.i18n];
    el.innerHTML = I18N.lang === "en" && en !== undefined ? en : el._tr;
  }
  for (const el of document.querySelectorAll("[data-i18n-attr]")) {
    el._trAttr ??= {};
    for (const pair of el.dataset.i18nAttr.split(",")) {
      const [attr, key] = pair.split("=").map((s) => s.trim());
      if (!(attr in el._trAttr)) el._trAttr[attr] = el.getAttribute(attr) ?? "";
      const en = STATIC_EN[key];
      el.setAttribute(attr, I18N.lang === "en" && en !== undefined ? en : el._trAttr[attr]);
    }
  }
  const title = document.querySelector("title");
  if (title) {
    title._tr ??= title.textContent;
    document.title = I18N.lang === "en" && title.dataset.en ? title.dataset.en : title._tr;
  }
  for (const b of document.querySelectorAll("#lang-switch button")) {
    b.setAttribute("aria-pressed", String(b.dataset.lang === I18N.lang));
  }
}

export function setLang(lang) {
  if (lang === I18N.lang) return;
  I18N.lang = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem("lang", lang); } catch { /* ignore */ }
  applyStaticTranslations();
  document.dispatchEvent(new CustomEvent("lang-change", { detail: lang }));
}
