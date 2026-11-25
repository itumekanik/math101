import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PRACTICE as P01 } from "../../src/chapters/functions/questions.ts";
import { PRACTICE as P02 } from "../../src/chapters/vectors/questions.ts";
import { PRACTICE as P03 } from "../../src/chapters/plane-geometry/questions.ts";
import { PRACTICE as P04 } from "../../src/chapters/space-geometry/questions.ts";
import { PRACTICE as P05 } from "../../src/chapters/matrices/questions.ts";
import { PRACTICE as P06 } from "../../src/chapters/square-matrices/questions.ts";
import { PRACTICE as P07 } from "../../src/chapters/linear-systems/questions.ts";
import { PRACTICE as P08 } from "../../src/chapters/vector-spaces/questions.ts";
import { PRACTICE as P09 } from "../../src/chapters/basis-dimension/questions.ts";
import { PRACTICE as P10 } from "../../src/chapters/inner-product/questions.ts";
import { PRACTICE as P11 } from "../../src/chapters/limits/questions.ts";
import { PRACTICE as P12 } from "../../src/chapters/derivatives/questions.ts";
import { PRACTICE as P13 } from "../../src/chapters/sequences-series/questions.ts";
import { PRACTICE as P14 } from "../../src/chapters/function-series/questions.ts";
import { PRACTICE as P15 } from "../../src/chapters/indefinite-integrals/questions.ts";
import { PRACTICE as P16 } from "../../src/chapters/definite-integrals/questions.ts";
import { PRACTICE as P17 } from "../../src/chapters/integral-apps/questions.ts";
import { PRACTICE as P18 } from "../../src/chapters/complex-numbers/questions.ts";
import { chapterSummary, createProgress, matches, parseNumber, plainMath } from "../../src/shared/practice.ts";

const BANKS = [
  ["functions", P01],
  ["vectors", P02],
  ["plane-geometry", P03],
  ["space-geometry", P04],
  ["matrices", P05],
  ["square-matrices", P06],
  ["linear-systems", P07],
  ["vector-spaces", P08],
  ["basis-dimension", P09],
  ["inner-product", P10],
  ["limits", P11],
  ["derivatives", P12],
  ["sequences-series", P13],
  ["function-series", P14],
  ["indefinite-integrals", P15],
  ["definite-integrals", P16],
  ["integral-apps", P17],
  ["complex-numbers", P18],
] as const;

describe("practice helpers (shared/practice.ts)", () => {
  it("parses Turkish commas and English dots", () => {
    assert.equal(parseNumber("0,5"), 0.5);
    assert.equal(parseNumber("−2.25"), -2.25);
    assert.equal(parseNumber("abc"), null);
  });

  it("persists progress cleanly per chapter", () => {
    let mem: string | null = null;
    const store = { getItem: () => mem, setItem: (_k: string, v: string) => { mem = v; } };
    const p = createProgress("vectors", ["a", "b"], store);
    p.set("a", { status: "correct", value: "13" });
    assert.deepEqual(p.summary(), { total: 2, done: 1, correct: 1 });
    assert.deepEqual(chapterSummary("vectors", store), { total: 2, done: 1 });
    p.clearAll();
    assert.equal(chapterSummary("vectors", store), null);
  });
});

describe("all 18 chapter question banks", () => {
  const globalIds = new Set<string>();

  for (const [name, sections] of BANKS) {
    const qs = sections.flatMap((s) => s.questions);
    it(`${name}: has verified bilingual questions with unique ids (${qs.length} questions)`, () => {
      assert.ok(qs.length >= 3, `${name} should have at least 3 questions`);
      for (const q of qs) {
        assert.ok(!globalIds.has(q.id), `duplicate id ${q.id}`);
        globalIds.add(q.id);
        assert.ok(q.q.tr.trim() && q.q.en.trim(), `${q.id} empty question`);
        assert.notEqual(q.q.tr, q.q.en, `${q.id} untranslated question`);
        assert.ok(q.explain.tr.trim() && q.explain.en.trim(), `${q.id} empty explain`);

        if (q.kind === "number") {
          assert.ok(plainMath(q.label.tr) && plainMath(q.label.en), `${q.id} empty label`);
          assert.ok(matches(q.compute(), q.answer, q.tolerance), `${q.id}: computed ${q.compute()} != ${q.answer}`);
        } else if (q.kind === "predict") {
          const res = q.run();
          assert.equal(res.answer, q.answer, `${q.id}: run() disagreed`);
          assert.ok(res.result.tr && res.result.en);
        } else {
          assert.ok(q.answer >= 0 && q.answer < q.options.length, `${q.id}: answer out of range`);
          if (q.compute) assert.equal(q.compute(), q.answer, `${q.id}: compute() disagreed`);
          q.options.forEach((opt, idx) => {
            if (idx !== q.answer) assert.ok(opt.why?.tr && opt.why?.en, `${q.id} opt ${idx} missing why`);
          });
        }
      }
    });
  }
});
