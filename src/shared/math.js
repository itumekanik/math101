/*
 * Math typesetting with KaTeX + MutationObserver for live demos and language switches.
 */
import renderMathInElement from "katex/contrib/auto-render";
export { texNum } from "./core.js";

export const MATH_OPTIONS = {
  delimiters: [{ left: "\\(", right: "\\)", display: false }],
  ignoredClasses: ["katex", "katex-display", "katex-mathml", "katex-html"],
  throwOnError: false,
  strict: "ignore",
};

const OBSERVER_OPTS = { childList: true, subtree: true };
let observing = false;

export function typesetMath(root) {
  if (!root) return;
  if (observing) mathObserver.disconnect();
  try {
    renderMathInElement(root, MATH_OPTIONS);
  } finally {
    if (observing) {
      mathObserver.takeRecords();
      mathObserver.observe(document.body, OBSERVER_OPTS);
    }
  }
}

export const hasMath = (node) => {
  if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains("katex")) return false;
  const text = node.nodeType === Node.TEXT_NODE ? node.data : node.textContent || "";
  return text.includes("\\(") && text.includes("\\)");
};

export const mathObserver = new MutationObserver((records) => {
  const roots = new Set();
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (hasMath(node)) roots.add(node.nodeType === Node.TEXT_NODE ? record.target : node);
    }
  }
  for (const root of roots) {
    if (root.isConnected && ![...roots].some((other) => other !== root && other.contains(root))) {
      typesetMath(root);
    }
  }
});

typesetMath(document.body);
observing = true;
mathObserver.observe(document.body, OBSERVER_OPTS);
