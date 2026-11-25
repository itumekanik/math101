/**
 * Development watch server with live reload at http://127.0.0.1:5173/
 */
import * as esbuild from "esbuild";
import { mkdirSync, rmSync, watch } from "node:fs";
import { join } from "node:path";
import { DIST, SRC, esbuildOptions, writePages } from "./build.mjs";
import { loadChapters } from "./chapters.mjs";

const PORT = Number(process.env.PORT ?? 5173);
const chapters = loadChapters(join(SRC, "chapters"));
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const pages = {
  name: "pages",
  setup(build) {
    build.onEnd((result) => {
      if (!result.metafile) return;
      try {
        writePages({ chapters, metafile: result.metafile, dev: true });
      } catch (e) {
        console.error(e.message);
      }
    });
  },
};

const ctx = await esbuild.context(esbuildOptions({ dev: true, chapters, plugins: [pages] }));
await ctx.watch();
const { port } = await ctx.serve({ servedir: DIST, host: "127.0.0.1", port: PORT });
console.log(`Serving dist/ at http://127.0.0.1:${port}/ (Ctrl+C to stop)`);

watch(SRC, { recursive: true }, (_event, file) => {
  if (!file) return;
  if (/\.(html|svg)$/.test(file)) ctx.rebuild().catch(() => {});
});
