/**
 * Builds the static math platform into dist/: index.html, one <id>.html per ready chapter,
 * and assets/ (one classic IIFE script per page, one stylesheet with inlined KaTeX woff2 fonts).
 * Works both over HTTP and directly from disk (file://).
 */
import * as esbuild from "esbuild";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadChapters, runtimeList } from "./chapters.mjs";
import { readRelease } from "./release.mjs";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SRC = join(ROOT, "src");
export const DIST = join(ROOT, "dist");

const TAB_LABELS = {
  theory: "Teori",
  play: 'Deneme<span class="tab-long"> alanı</span>',
  math: 'Formüller<span class="tab-long"> &amp; İspat</span>',
  practice: "Alıştırma",
};

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232a78d6'/%3E%3Cpath d='M9 22c2-7 5-12 7-12s4 12 7 12' stroke='%23fff' stroke-width='2.2' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='10' r='2.3' fill='%23fff'/%3E%3C/svg%3E";

const LIVE_RELOAD = `<script>new EventSource("/esbuild").addEventListener("change", () => location.reload());</script>`;

const read = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const indent = (text, n) =>
  text
    .trimEnd()
    .split("\n")
    .map((line) => (line ? " ".repeat(n) + line : line))
    .join("\n");

const optional = (dir, file, n) => (existsSync(join(dir, file)) ? indent(read(join(dir, file)), n) : "");

function fill(template, values, name) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`${name}: no value for {{${key}}}`);
    return values[key];
  });
}

/** Inline only woff2 KaTeX fonts (supported by every modern browser) to keep CSS lean. */
const katexWoff2Only = {
  name: "katex-woff2-only",
  setup(build) {
    build.onLoad({ filter: /katex(\.min)?\.css$/ }, (args) => ({
      contents: read(args.path)
        .replace(/,url\([^)]*\.woff\) format\("woff"\)/g, "")
        .replace(/,url\([^)]*\.ttf\) format\("truetype"\)/g, ""),
      loader: "css",
      resolveDir: dirname(args.path),
    }));
  },
};

export function esbuildOptions({ dev, chapters, outdir = DIST, plugins = [] }) {
  const entryPoints = {
    landing: join(SRC, "app/landing.ts"),
    app: join(SRC, "styles/app.css"),
  };
  for (const c of chapters) if (c.url) entryPoints[c.id] = join(c.dir, "main.js");
  return {
    absWorkingDir: ROOT,
    entryPoints,
    outdir: join(outdir, "assets"),
    entryNames: dev ? "[name]" : "[name]-[hash]",
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["es2022"],
    charset: "utf8",
    minify: !dev,
    sourcemap: dev ? "inline" : false,
    legalComments: "eof",
    metafile: true,
    logLevel: "warning",
    define: {
      __CHAPTERS__: JSON.stringify(runtimeList(chapters)),
      __RELEASE__: JSON.stringify(readRelease(ROOT)),
    },
    loader: { ".woff2": "dataurl" },
    plugins: [katexWoff2Only, ...plugins],
  };
}

function assetNames(metafile) {
  const names = {};
  for (const [out, info] of Object.entries(metafile.outputs)) {
    if (!info.entryPoint || out.endsWith(".map")) continue;
    const name = out.split("/").pop();
    const entry = info.entryPoint.replace(/\\/g, "/");
    if (entry.endsWith("styles/app.css")) names.css = name;
    else if (entry.endsWith("app/landing.ts")) names.landing = name;
    else names[entry.split("/").at(-2)] = name;
  }
  return names;
}

export function writePages({ chapters, metafile, dev, outdir = DIST }) {
  const assets = assetNames(metafile);
  const styles = `<link rel="stylesheet" href="assets/${assets.css}">`;
  const script = (file) => `<script src="assets/${file}"></script>` + (dev ? `\n  ${LIVE_RELOAD}` : "");
  const shell = read(join(SRC, "app/shell.html"));
  for (const c of chapters.filter((ch) => ch.url)) {
    const p = c.page;
    const brand = p.brand ?? c.title;
    const tabs = p.tabs
      .map(
        (t, i) =>
          `      <button type="button" role="tab" id="tab-${t}" aria-controls="panel-${t}" aria-selected="${i === 0}" data-i18n="tab.${t}">${TAB_LABELS[t]}</button>`,
      )
      .join("\n");
    const html = fill(
      shell,
      {
        titleTr: esc(`${p.title.tr} · ${c.lecture}`),
        titleEn: esc(`${p.title.en} · ${c.lecture}`),
        favicon: FAVICON,
        id: c.id,
        logo: read(join(c.dir, "logo.svg")).trim(),
        brandTitle: esc(brand.tr),
        brandTitleEn: esc(brand.en),
        brandSub: esc(`${c.lecture} · ${c.sub.tr}`),
        brandSubEn: esc(`${c.lecture} · ${c.sub.en}`),
        tabs,
        panels: indent(read(join(c.dir, "panels.html")), 4),
        badges: optional(c.dir, "badges.html", 6),
        beforeMain: optional(c.dir, "before-main.html", 2),
        afterMain: optional(c.dir, "after-main.html", 2),
        styles,
        scripts: script(assets[c.id]),
      },
      `${c.id}.html`,
    );
    writeFileSync(join(outdir, c.url), html);
  }
  const landing = fill(
    read(join(SRC, "app/landing.html")),
    { favicon: FAVICON, styles, scripts: script(assets.landing) },
    "index.html",
  );
  writeFileSync(join(outdir, "index.html"), landing);
  writeFileSync(join(outdir, ".nojekyll"), "");
}

export async function build({ dev = false, outdir = DIST } = {}) {
  const chapters = loadChapters(join(SRC, "chapters"));
  rmSync(outdir, { recursive: true, force: true });
  mkdirSync(outdir, { recursive: true });
  const result = await esbuild.build(esbuildOptions({ dev, chapters, outdir }));
  writePages({ chapters, metafile: result.metafile, dev, outdir });
  return { chapters, result };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const started = performance.now();
  const { chapters, result } = await build();
  const outputs = Object.entries(result.metafile.outputs).filter(([out]) => !out.endsWith(".map"));
  const totalKB = outputs.reduce((acc, [, info]) => acc + info.bytes, 0) / 1024;
  console.log(`Built ${outputs.length} bundles (${totalKB.toFixed(0)} KB total)`);
  const ready = chapters.filter((c) => c.url);
  console.log(
    `dist/: index.html + ${ready.length} chapter pages in ${Math.round(performance.now() - started)} ms`,
  );
}
