/**
 * Start page (index.html): course overview, grouped learning path across all 21 lectures,
 * live per-chapter practice progress, and quick part filter.
 */
import { I18N, L, applyStaticTranslations } from "../shared/i18n.js";
import { wireSwitches } from "../shared/switches.ts";
import { CHAPTERS, PARTS, type PartId, type Text } from "../shared/chapters.ts";
import { chapterSummary } from "../shared/practice.ts";
import { REPO, versionLine } from "../shared/version.ts";

/** The downloadable copy of this site (put next to index.html by GitHub Pages CI). */
const ZIP = "math-learning-path.zip";

type Child = Node | string | null | false;
function el(tag: string, attrs: Record<string, string> = {}, ...children: Child[]): HTMLElement {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  for (const child of children) if (child) node.append(child);
  return node;
}

function html(tag: string, text: Text, attrs: Record<string, string> = {}): HTMLElement {
  const node = el(tag, attrs);
  node.innerHTML = L(text);
  return node;
}

const TABS: Text[] = [
  {
    tr: "<b>Teori</b>: her kavram geometrik sezgi ve canlı 2B/3B görselleştirmeyle birlikte",
    en: "<b>Theory</b>: every concept paired with geometric intuition and a live 2D/3D demo",
  },
  {
    tr: "<b>Deneme alanı</b>: kendi fonksiyon, vektör, matris, seri ve karmaşık sayılarınızla deney yapın",
    en: "<b>Playground</b>: experiment freely with your own functions, vectors, matrices, series and complex numbers",
  },
  {
    tr: "<b>Formüller &amp; İspat</b>: teoremler, satır satır açılan ispatlar ve etkileşimli hesaplayıcılar",
    en: "<b>Formulas &amp; Proofs</b>: theorems, line-by-line derivations and interactive calculators",
  },
  {
    tr: "<b>Alıştırma</b>: anında geri bildirimli, her yanlış seçeneğin nedenini açıklayan doğrulamalı sorular",
    en: "<b>Practice</b>: short verified questions with instant feedback explaining every misconception",
  },
];

let activePart: PartId | "all" = "all";

function chapterCard(c: (typeof CHAPTERS)[number]): HTMLElement {
  const practice = chapterSummary(c.id);
  const metaParts = [c.lecture];
  if (practice) {
    metaParts.push(`${L({ tr: "Alıştırma", en: "Practice" })} ${practice.done}/${practice.total}`);
  }
  const doneAll = practice && practice.done >= practice.total;
  const body = [
    el("span", { class: `lp-num${doneAll ? " done" : ""}` }, doneAll ? "✓" : String(c.number)),
    el(
      "span",
      { class: "lp-text" },
      el("span", { class: "lp-title" }, L(c.title)),
      el("span", { class: "lp-sub" }, L(c.sub)),
      el("span", { class: "lp-meta" }, metaParts.join(" · ")),
    ),
    c.url ? el("span", { class: "lp-go", "aria-hidden": "true" }, "→") : null,
  ];
  return el(
    "li",
    {},
    c.url ? el("a", { class: "lp-chapter", href: c.url }, ...body) : el("div", { class: "lp-chapter soon" }, ...body),
  );
}

function overallProgress(): HTMLElement | null {
  let done = 0;
  let startedChapters = 0;
  for (const c of CHAPTERS) {
    const s = chapterSummary(c.id);
    if (s) {
      done += s.done;
      startedChapters++;
    }
  }
  if (!done) return null;
  return el(
    "p",
    { class: "lp-progress-note" },
    L({
      tr: `Tarayıcınızdaki kayıtlı ilerleme: ${startedChapters} bölümde toplam ${done} alıştırma sorusu tamamlandı.`,
      en: `Saved progress in this browser: ${done} practice questions completed across ${startedChapters} chapter(s).`,
    }),
  );
}

function render(): void {
  const main = document.getElementById("landing");
  if (!main) return;
  const offline = location.protocol === "file:";
  const isLocal = location.hostname === "127.0.0.1" || location.hostname === "localhost";
  const first = CHAPTERS.find((c) => c.url);

  const filterBar = el("div", { class: "seg lp-filter", role: "group", "aria-label": L({ tr: "Modül filtresi", en: "Module filter" }) });
  const filterChoices: { id: PartId | "all"; label: Text }[] = [
    { id: "all", label: { tr: `Tümü (${CHAPTERS.length})`, en: `All (${CHAPTERS.length})` } },
    ...PARTS.map((p) => ({ id: p.id, label: p.short })),
  ];
  for (const item of filterChoices) {
    const btn = el("button", { type: "button", "aria-pressed": String(activePart === item.id) }, L(item.label));
    btn.addEventListener("click", () => {
      activePart = item.id;
      render();
    });
    filterBar.append(btn);
  }

  const visibleParts = activePart === "all" ? PARTS : PARTS.filter((p) => p.id === activePart);
  const partSections = visibleParts.map((part) => {
    const items = CHAPTERS.filter((c) => c.part === part.id);
    return el(
      "div",
      { class: "lp-part" },
      el(
        "div",
        { class: "lp-part-head" },
        el("span", { class: "lp-part-tag" }, part.roman),
        el("h3", {}, L(part.title)),
        el("span", { class: "lp-part-range" }, L(part.range)),
      ),
      el("ol", { class: "lp-list" }, ...items.map(chapterCard)),
    );
  });

  main.replaceChildren(
    el(
      "section",
      { class: "card lp-hero" },
      html("h2", {
        tr: "Fonksiyonlardan Karmaşık Sayılara: Etkileşimli Üniversite Matematiği",
        en: "From Functions to Complex Numbers: Interactive University Mathematics",
      }),
      html("p", {
        tr: "Bu platform, 21 derslik üniversite matematiği müfredatını (analitik geometri, lineer cebir, diferansiyel ve integral kalkülüs, seriler ve karmaşık sayılar) adım adım, görsel sezgiden kesin ispatlara uzanan bir öğrenme yolu olarak sunar. Her bölüm dört sekmeden oluşur:",
        en: "This platform presents a complete 21-lecture university mathematics curriculum (analytic geometry, linear algebra, differential and integral calculus, series, and complex numbers) as an interactive path from visual intuition to rigorous proofs. Each chapter has four tabs:",
      }),
      el("ul", { class: "lp-tabs" }, ...TABS.map((t) => html("li", t))),
      overallProgress(),
      first
        ? el(
            "a",
            { class: "btn primary lp-start", href: first.url ?? "#" },
            L({ tr: `Başlayın: ${L(first.title)} →`, en: `Start: ${L(first.title)} →` }),
          )
        : null,
    ),
    el(
      "section",
      { class: "lp-path" },
      el("div", { class: "lp-path-head" }, html("h2", { tr: "Öğrenme yolu (21 Ders · 18 Bölüm)", en: "Learning path (21 Lectures · 18 Chapters)" }), filterBar),
      ...partSections,
    ),
    el(
      "section",
      { class: "card lp-offline" },
      html("h2", { tr: "Kurulum gerekmez", en: "Nothing to install" }),
      html("p", {
        tr: "Tüm grafikler, 3B uzay çizimleri, Gauss yok etme adımları, seri yakınsamaları ve KaTeX formülleri doğrudan tarayıcınızda çalışır. Sunucu veya internet bağlantısı gerekmez; cevaplarınız yalnızca bu tarayıcıda saklanır.",
        en: "All plots, 3D geometry viewports, Gaussian elimination steps, series convergence visuals and KaTeX formulas run directly in your browser. No server or internet connection is needed; your progress stays in this browser.",
      }),
      offline
        ? html("p", {
            tr: "Şu an bu sitenin bilgisayarınızdaki çevrimdışı kopyasını (<code>file://</code>) kullanıyorsunuz.",
            en: "You are currently using the local offline copy (<code>file://</code>) on your computer.",
          })
        : isLocal
          ? html("p", {
              tr: "İnternetsiz çalışmak için <code>dist/index.html</code> dosyasını doğrudan tarayıcıda açabilir veya <code>start.bat</code> dosyasını çalıştırabilirsiniz.",
              en: "To work offline, open <code>dist/index.html</code> directly in any browser or double-click <code>start.bat</code>.",
            })
          : html("p", {
              tr: `İnternetsiz kullanmak için <a href="${ZIP}" download>sitenin ZIP dosyasını indirin</a>, bir klasöre açın ve <code>index.html</code>'e çift tıklayın.`,
              en: `To use it offline, <a href="${ZIP}" download>download the site as a ZIP file</a>, unpack it into a folder and double-click <code>index.html</code>.`,
            }),
      REPO
        ? html("p", {
            tr: `Kaynak kod ve sürüm geçmişi: <a href="${REPO}" target="_blank" rel="noopener">GitHub</a>.`,
            en: `Source code and release history: <a href="${REPO}" target="_blank" rel="noopener">GitHub</a>.`,
          })
        : null,
    ),
    el("footer", { class: "lp-foot" }, versionLine("lp-version", { full: true })),
  );
  document.documentElement.lang = I18N.lang;
}

wireSwitches();
applyStaticTranslations();
render();
document.addEventListener("lang-change", render);
