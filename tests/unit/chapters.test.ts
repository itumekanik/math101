import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { loadChapters, runtimeList } from "../../scripts/chapters.mjs";

const here = dirname(fileURLToPath(import.meta.url));

describe("chapter discovery (scripts/chapters.mjs)", () => {
  it("loads all 18 chapters (Lectures 1–21) in exact syllabus order", () => {
    const chapters = loadChapters(join(here, "../../src/chapters"));
    assert.equal(chapters.length, 18);
    assert.deepEqual(
      chapters.map((c) => c.id),
      [
        "functions",
        "vectors",
        "plane-geometry",
        "space-geometry",
        "matrices",
        "square-matrices",
        "linear-systems",
        "vector-spaces",
        "basis-dimension",
        "inner-product",
        "limits",
        "derivatives",
        "sequences-series",
        "function-series",
        "indefinite-integrals",
        "definite-integrals",
        "integral-apps",
        "complex-numbers",
      ],
    );
    assert.deepEqual(
      chapters.map((c) => c.number),
      Array.from({ length: 18 }, (_, i) => i + 1),
    );
    assert.ok(chapters.every((c) => c.url === `${c.id}.html`));
    assert.ok(!("dir" in runtimeList(chapters)[0]));
  });
});
