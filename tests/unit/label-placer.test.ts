import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LabelPlacer, pointCandidates, vectorCandidates } from "../../src/engines/label-placer.ts";

function fakeCtx() {
  const drawn: { text: string; x: number; y: number }[] = [];
  const ctx = {
    font: "",
    textAlign: "left",
    textBaseline: "alphabetic",
    lineJoin: "miter",
    miterLimit: 10,
    lineWidth: 1,
    strokeStyle: "",
    fillStyle: "",
    save() {},
    restore() {},
    measureText(text: string) {
      return { width: text.length * 7.5 };
    },
    strokeText() {},
    fillText(text: string, x: number, y: number) {
      drawn.push({ text, x, y });
    },
  } as unknown as CanvasRenderingContext2D;
  return { ctx, drawn };
}

describe("collision-aware label placer (engines/label-placer.ts)", () => {
  it("separates coincident vector, unit vector, and endpoint handle labels cleanly", () => {
    const placer = new LabelPlacer({ left: 40, top: 16, right: 540, bottom: 250 });
    // P at (250, 180), Q at (340, 60), vector PQ and collinear unit vector v̂
    placer.addCircle(250, 180, 9);
    placer.addCircle(340, 60, 9);
    placer.addSegment(250, 180, 340, 60, 1);
    placer.addSegment(250, 180, 268, 156, 1);

    placer.queue({
      text: "P",
      color: "#000",
      font: "700 12.5px sans-serif",
      fontSize: 12.5,
      priority: 5,
      candidates: pointCandidates(250, 180, 10, 14, 16.5),
    });
    placer.queue({
      text: "Q",
      color: "#000",
      font: "700 12.5px sans-serif",
      fontSize: 12.5,
      priority: 5,
      candidates: pointCandidates(340, 60, 10, 16, 16.5),
    });
    placer.queue({
      text: "v = PQ",
      color: "#2a78d6",
      font: "650 13px sans-serif",
      fontSize: 13,
      priority: 20,
      candidates: vectorCandidates(250, 180, 340, 60, 50, 17, true),
    });
    placer.queue({
      text: "v̂",
      color: "#eb6834",
      font: "650 13px sans-serif",
      fontSize: 13,
      priority: 20,
      candidates: vectorCandidates(250, 180, 268, 156, 14, 17, false),
    });

    const { ctx, drawn } = fakeCtx();
    placer.renderAll(ctx, "#fff");
    assert.equal(drawn.length, 4);

    // Every pair of placed labels must keep non-overlapping separation
    for (let i = 0; i < drawn.length; i++) {
      for (let j = i + 1; j < drawn.length; j++) {
        const d = Math.hypot(drawn[i]!.x - drawn[j]!.x, drawn[i]!.y - drawn[j]!.y);
        assert.ok(d >= 16, `Labels ${drawn[i]!.text} and ${drawn[j]!.text} too close (${d.toFixed(1)}px)`);
      }
      // Every label stays inside bounds
      assert.ok(drawn[i]!.x >= 40 && drawn[i]!.x <= 540);
      assert.ok(drawn[i]!.y >= 16 && drawn[i]!.y <= 250);
    }
  });
});
