/*
 * Unified chapter bootstrapper: registers tabs, renders Theory & Playground panels cleanly
 * with full TR/EN language switching while preserving interactive state, and mounts Math + Practice tabs.
 */
import { TABS } from "../shared/page.ts";
import { L } from "../shared/i18n.js";
import { $, PLACE_TITLES, h } from "../shared/core.js";
import { KIT } from "../shared/kit.js";
import { createLesson } from "../shared/lesson.js";
import { createPractice } from "../shared/practice-view.js";

export function mountChapter({ intro, sections, playground, mathSections, mathWidgets = {}, practiceSections }) {
  Object.assign(TABS, {
    theory: { tab: "#tab-theory", panel: "#panel-theory", hash: "#teori" },
    play: { tab: "#tab-play", panel: "#panel-play", hash: "#deneme" },
    math: { tab: "#tab-math", panel: "#panel-math", hash: "#matematik" },
    practice: { tab: "#tab-practice", panel: "#panel-practice", hash: "#alistirma" },
  });

  // Register section titles for glossary & cross-links
  for (const s of sections) PLACE_TITLES[s.id] = s.title;

  const state = {};
  const { html, formula, sectionCard, chapterNavCards, clearObservers } = KIT;

  function renderExample(ex) {
    const title = ex.title ? L(ex.title) : L({ tr: "Adım adım çözüm", en: "Step-by-step solution" });
    const list = h("ol", { class: "edu-ex-steps" });
    for (const st of ex.steps || []) {
      const li = h("li", {});
      if (st && typeof st === "object" && ("expr" in st || "note" in st)) {
        if (st.expr) li.append(h("div", { class: "edu-ex-expr", text: `\\(${L(st.expr)}\\)` }));
        if (st.note) li.append(html("p", { class: "edu-ex-note" }, st.note));
      } else {
        li.append(html("p", { class: "edu-ex-note" }, st));
      }
      list.append(li);
    }
    const card = h(
      "div",
      { class: "edu-example" },
      h(
        "div",
        { class: "edu-ex-head" },
        h("span", { class: "edu-ex-badge", text: L({ tr: "Çözümlü Örnek", en: "Worked Example" }) }),
        h("strong", { text: title }),
      ),
      ex.problem ? html("p", { class: "edu-ex-prob" }, ex.problem) : null,
      list,
      ex.answer
        ? h(
            "div",
            { class: "edu-ex-ans" },
            h("strong", { text: L({ tr: "Sonuç: ", en: "Answer: " }) }),
            html("span", {}, ex.answer),
          )
        : null,
    );
    return card;
  }

  function renderAnalogy(an) {
    const title = an.title ? L(an.title) : L({ tr: "Günlük hayattan benzetme", en: "Everyday analogy" });
    return h(
      "div",
      { class: "edu-analogy", role: "note" },
      h("span", { class: "edu-analogy-icon", text: "🧭", "aria-hidden": "true" }),
      h("div", {}, h("strong", { text: title }), html("p", {}, an.text)),
    );
  }

  function renderPitfall(pf) {
    const title = pf.title ? L(pf.title) : L({ tr: "Sık yapılan hata", en: "Common mistake" });
    return h(
      "div",
      { class: "tut-callout warn", role: "note" },
      h("span", { class: "tut-callout-icon", text: "⚠️", "aria-hidden": "true" }),
      h("div", {}, h("strong", { text: title }), html("p", {}, pf.text)),
    );
  }

  function renderTryList(items, title) {
    const ol = h("ol", { class: "edu-try-list" });
    for (const item of items) ol.append(html("li", {}, item));
    return h(
      "div",
      { class: "edu-try" },
      h(
        "div",
        { class: "edu-try-head" },
        h("span", { text: "🧪", "aria-hidden": "true" }),
        h("strong", { text: title ? L(title) : L({ tr: "Kendin dene ve gözlemle", en: "Try it yourself & observe" }) }),
      ),
      ol,
    );
  }

  function renderIntro() {
    const left = h("div", { class: "t-intro-text" }, h("h2", { text: L(intro.title) }));
    for (const p of intro.paragraphs) left.append(html("p", {}, p));
    if (intro.analogy) left.append(renderAnalogy(intro.analogy));

    const side = h("div", { class: "t-intro-side" });
    if (intro.summary?.length) {
      const dl = h("dl", {});
      for (const [k, v] of intro.summary) {
        dl.append(html("dt", {}, k), html("dd", {}, v));
      }
      side.append(h("div", { class: "t-summary-box" }, dl));
    }
    if (intro.tip) {
      side.append(
        h(
          "div",
          { class: "tut-callout tip", role: "note" },
          h("span", { class: "tut-callout-icon", text: "💡", "aria-hidden": "true" }),
          h("div", {}, h("strong", { text: L(intro.tip.title) }), html("p", {}, intro.tip.text)),
        ),
      );
    }
    return h("section", { class: "card t-intro", id: intro.id || "t-intro" }, left, side);
  }

  function renderTheoryAndPlay() {
    clearObservers();

    const theoryPanel = $("#panel-theory");
    if (theoryPanel) {
      const nodes = [renderIntro()];
      sections.forEach((sec, idx) => {
        const textNodes = [];
        for (const item of sec.body) {
          if (item && typeof item === "object" && "eq" in item) textNodes.push(formula(L(item.eq)));
          else if (item && typeof item === "object" && "note" in item) textNodes.push(html("div", { class: "in-model" }, item.note));
          else if (item && typeof item === "object" && "analogy" in item) textNodes.push(renderAnalogy(item.analogy));
          else if (item && typeof item === "object" && "example" in item) textNodes.push(renderExample(item.example));
          else if (item && typeof item === "object" && "pitfall" in item) textNodes.push(renderPitfall(item.pitfall));
          else if (item && typeof item === "object" && "tryList" in item) textNodes.push(renderTryList(item.tryList, item.title));
          else if (item && typeof item === "object" && "list" in item) {
            const ul = h(item.ordered ? "ol" : "ul", { class: "tut-list" });
            for (const li of item.list) ul.append(html("li", {}, li));
            textNodes.push(ul);
          } else textNodes.push(html("p", {}, item));
        }
        const demoBox = h("div", { class: "t-demo" });
        sec.demo(demoBox, state);
        nodes.push(sectionCard(sec.id, idx + 1, sec.title, textNodes, demoBox, sec.mathId || null));
      });
      nodes.push(chapterNavCards());
      theoryPanel.replaceChildren(...nodes);
    }

    const playPanel = $("#panel-play");
    if (playPanel && playground) {
      const head = h(
        "section",
        { class: "card pg-intro" },
        h("h2", { text: L(playground.title) }),
        html("p", { class: "sub" }, playground.sub),
      );
      if (playground.experiments?.length) {
        head.append(
          renderTryList(
            playground.experiments,
            { tr: "Deneme rehberi — bunları mutlaka dene!", en: "Guided experiments — try these!" },
          ),
        );
      }
      const body = h("section", { class: "card pg-layout" });
      playground.build(body, state);
      playPanel.replaceChildren(head, body);
    }
  }

  renderTheoryAndPlay();
  document.addEventListener("lang-change", renderTheoryAndPlay);

  // Math (Formulas & Proofs) tab
  if (mathSections?.length) {
    createLesson({
      tab: "math",
      main: "#m-main",
      toc: "#m-toc",
      sections: mathSections,
      widgets: mathWidgets,
      kicker: { tr: "Kısım", en: "Section" },
    });
  }

  // Practice tab
  if (practiceSections?.length) {
    createPractice({
      main: "#px-main",
      toc: "#px-toc",
      summary: "#px-summary",
      sections: practiceSections,
    });
  }
}

/** Standard reusable HTML snippet for every chapter's panels.html */
export function makePanelsHtml(mathTitleTr, mathTitleEn, practiceTitleTr, practiceTitleEn) {
  return `<!-- Theory and Playground -->
<section class="panel" id="panel-theory" role="tabpanel" aria-labelledby="tab-theory"></section>
<section class="panel" id="panel-play" role="tabpanel" aria-labelledby="tab-play" hidden></section>

<!-- Formulas & Proofs -->
<section class="panel" id="panel-math" role="tabpanel" aria-labelledby="tab-math" hidden>
  <div class="tut">
    <nav class="tut-toc" aria-label="Formül kısımları" data-i18n-attr="aria-label=a.mtoc">
      <div class="tut-toc-head">
        <span class="tb-label" data-i18n="math.kicker">Teoremler &amp; İspatlar</span>
        <strong data-i18n data-en="${mathTitleEn}">${mathTitleTr}</strong>
      </div>
      <ol id="m-toc"></ol>
    </nav>
    <div class="tut-main" id="m-main"><p class="placeholder" data-i18n="math.loading">Yükleniyor…</p></div>
  </div>
</section>

<!-- Practice -->
<section class="panel" id="panel-practice" role="tabpanel" aria-labelledby="tab-practice" hidden>
  <div class="card px-summary" id="px-summary"></div>
  <div class="tut">
    <nav class="tut-toc" aria-label="Alıştırma kısımları" data-i18n-attr="aria-label=a.ptoc">
      <div class="tut-toc-head">
        <span class="tb-label" data-i18n="practice.kicker">Soru soru</span>
        <strong data-i18n data-en="${practiceTitleEn}">${practiceTitleTr}</strong>
      </div>
      <ol id="px-toc"></ol>
    </nav>
    <div class="tut-main" id="px-main"><p class="placeholder" data-i18n="math.loading">Yükleniyor…</p></div>
  </div>
</section>
`;
}
