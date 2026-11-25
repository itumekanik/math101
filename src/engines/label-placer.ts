/**
 * Deterministic, fast collision-aware label placement engine for 2D & 3D math canvases.
 * Prevents labels from overlapping each other, arrow shafts, dots/handles, plot edges,
 * axis titles, or overlay hints/buttons, and renders every label with a crisp surface halo.
 */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SegObstacle {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  /** Weight multiplier: 1.0 for main arrows/segments, 0.35 for faint axes/guides */
  weight?: number;
}

export interface CircleObstacle {
  x: number;
  y: number;
  r: number;
}

export interface LabelCandidate {
  x: number;
  y: number;
  bias?: number;
}

export interface LabelRequest {
  text: string;
  color: string;
  font: string;
  fontSize?: number;
  priority: number;
  candidates: LabelCandidate[];
}

export interface PlotBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function rectOverlapArea(a: Rect, b: Rect, pad = 3): number {
  const ox = Math.min(a.x + a.w + pad, b.x + b.w + pad) - Math.max(a.x - pad, b.x - pad);
  if (ox <= 0) return 0;
  const oy = Math.min(a.y + a.h + pad, b.y + b.h + pad) - Math.max(a.y - pad, b.y - pad);
  return oy > 0 ? ox * oy : 0;
}

function pointToSegDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-6) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Liang–Barsky segment vs axis-aligned rectangle intersection test */
function segIntersectsRect(ax: number, ay: number, bx: number, by: number, r: Rect): boolean {
  const dx = bx - ax;
  const dy = by - ay;
  let t0 = 0;
  let t1 = 1;
  const checks: [number, number][] = [
    [-dx, ax - r.x],
    [dx, r.x + r.w - ax],
    [-dy, ay - r.y],
    [dy, r.y + r.h - ay],
  ];
  for (const [p, q] of checks) {
    if (Math.abs(p) < 1e-9) {
      if (q < 0) return false;
    } else {
      const t = q / p;
      if (p < 0) {
        if (t > t1) return false;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return false;
        if (t < t1) t1 = t;
      }
    }
  }
  return t0 <= t1;
}

function rectToSegMinDist(box: Rect, seg: SegObstacle): number {
  if (segIntersectsRect(seg.ax, seg.ay, seg.bx, seg.by, box)) return 0;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const x1 = box.x;
  const x2 = box.x + box.w;
  const y1 = box.y;
  const y2 = box.y + box.h;
  return Math.min(
    pointToSegDist(cx, cy, seg.ax, seg.ay, seg.bx, seg.by),
    pointToSegDist(x1, y1, seg.ax, seg.ay, seg.bx, seg.by),
    pointToSegDist(x2, y1, seg.ax, seg.ay, seg.bx, seg.by),
    pointToSegDist(x1, y2, seg.ax, seg.ay, seg.bx, seg.by),
    pointToSegDist(x2, y2, seg.ax, seg.ay, seg.bx, seg.by),
    pointToSegDist(cx, y1, seg.ax, seg.ay, seg.bx, seg.by),
    pointToSegDist(cx, y2, seg.ax, seg.ay, seg.bx, seg.by),
  );
}

function rectToCircleDist(box: Rect, c: CircleObstacle): number {
  const nx = Math.max(box.x, Math.min(c.x, box.x + box.w));
  const ny = Math.max(box.y, Math.min(c.y, box.y + box.h));
  return Math.hypot(c.x - nx, c.y - ny) - c.r;
}

/** Candidate centers around a point/handle dot at 12 directions × 2 rings */
export function pointCandidates(px: number, py: number, r: number, w: number, h: number): LabelCandidate[] {
  const dirs: [number, number, number][] = [
    [0.75, -0.66, 0],   // NE
    [-0.75, -0.66, 3],  // NW
    [0.75, 0.66, 4],    // SE
    [-0.75, 0.66, 6],   // SW
    [1, 0, 8],          // E
    [-1, 0, 10],        // W
    [0, -1, 11],        // N
    [0, 1, 13],         // S
    [0.92, -0.38, 15],
    [-0.92, -0.38, 16],
    [0.92, 0.38, 17],
    [-0.92, 0.38, 18],
  ];
  const out: LabelCandidate[] = [];
  for (const [ringIdx, extra] of [6, 17].entries()) {
    for (const [dx, dy, bias] of dirs) {
      const rx = r + extra + Math.abs(dx) * (w / 2);
      const ry = r + extra + Math.abs(dy) * (h / 2);
      out.push({ x: px + dx * rx, y: py + dy * ry, bias: bias + ringIdx * 45 });
    }
  }
  return out;
}

/** Candidate centers along a vector arrow shaft (both perpendicular sides + tip extensions) */
export function vectorCandidates(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  w: number,
  h: number,
  tipCrowded: boolean,
): LabelCandidate[] {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  if (len < 2) return pointCandidates(bx, by, 5, w, h);

  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const perp = Math.abs(nx) * (w / 2) + Math.abs(ny) * (h / 2) + 8;
  const perpFar = perp + 10;

  const out: LabelCandidate[] = [];
  // Tip extension candidates (preferred for standalone vectors without a handle at the tip)
  const tipOff = Math.abs(ux) * (w / 2) + Math.abs(uy) * (h / 2) + 10;
  const tipBias = tipCrowded ? 65 : 0;
  out.push({ x: bx + ux * tipOff, y: by + uy * tipOff, bias: tipBias });
  out.push({ x: bx + (ux * 0.7 + nx * 0.7) * tipOff, y: by + (uy * 0.7 + ny * 0.7) * tipOff, bias: tipBias + 8 });
  out.push({ x: bx + (ux * 0.7 - nx * 0.7) * tipOff, y: by + (uy * 0.7 - ny * 0.7) * tipOff, bias: tipBias + 10 });

  // Shaft perpendicular candidates (preferred when tip has a handle/point, or when tip extension crosses another shaft!)
  const shaftBias = tipCrowded ? 0 : 12;
  const fracs = len > 42 ? [0.55, 0.44, 0.68, 0.34, 0.78] : [0.65, 0.45];
  fracs.forEach((t, idx) => {
    const mx = ax + dx * t;
    const my = ay + dy * t;
    out.push({ x: mx + nx * perp, y: my + ny * perp, bias: shaftBias + idx * 5 });
    out.push({ x: mx - nx * perp, y: my - ny * perp, bias: shaftBias + idx * 5 + 2 });
    if (idx < 2) {
      out.push({ x: mx + nx * perpFar, y: my + ny * perpFar, bias: shaftBias + 35 + idx * 5 });
      out.push({ x: mx - nx * perpFar, y: my - ny * perpFar, bias: shaftBias + 37 + idx * 5 });
    }
  });
  return out;
}

/** Candidate centers along a clipped infinite line */
export function lineCandidates(ax: number, ay: number, bx: number, by: number, w: number, h: number): LabelCandidate[] {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  if (len < 10) return [];
  const nx = -dy / len;
  const ny = dx / len;
  const perp = Math.abs(nx) * (w / 2) + Math.abs(ny) * (h / 2) + 7;
  const fracs = [0.22, 0.78, 0.35, 0.65, 0.5, 0.14, 0.86];
  const out: LabelCandidate[] = [];
  fracs.forEach((t, idx) => {
    const mx = ax + dx * t;
    const my = ay + dy * t;
    out.push({ x: mx + nx * perp, y: my + ny * perp, bias: idx * 4 });
    out.push({ x: mx - nx * perp, y: my - ny * perp, bias: idx * 4 + 2 });
  });
  return out;
}

/** Candidate centers around an explicit anchor (for custom labels & angle labels) */
export function anchorCandidates(cx: number, cy: number, w: number, h: number): LabelCandidate[] {
  const stepX = Math.max(14, w * 0.45);
  const stepY = Math.max(14, h * 0.9);
  return [
    { x: cx, y: cy, bias: 0 },
    { x: cx, y: cy - stepY, bias: 10 },
    { x: cx, y: cy + stepY, bias: 12 },
    { x: cx + stepX, y: cy, bias: 14 },
    { x: cx - stepX, y: cy, bias: 16 },
    { x: cx + stepX, y: cy - stepY, bias: 22 },
    { x: cx - stepX, y: cy - stepY, bias: 24 },
    { x: cx + stepX, y: cy + stepY, bias: 26 },
    { x: cx - stepX, y: cy + stepY, bias: 28 },
  ];
}

export class LabelPlacer {
  private readonly placed: Rect[] = [];
  private readonly requests: LabelRequest[] = [];
  private readonly segments: SegObstacle[] = [];
  private readonly circles: CircleObstacle[] = [];
  private readonly bounds: PlotBounds;

  constructor(bounds: PlotBounds, reserved: Rect[] = []) {
    this.bounds = bounds;
    for (const r of reserved) this.placed.push(r);
  }

  addSegment(ax: number, ay: number, bx: number, by: number, weight = 1): void {
    if (Math.hypot(bx - ax, by - ay) < 1) return;
    this.segments.push({ ax, ay, bx, by, weight });
  }

  addCircle(x: number, y: number, r: number): void {
    this.circles.push({ x, y, r });
  }

  addReserved(r: Rect): void {
    this.placed.push(r);
  }

  hasCircleNear(x: number, y: number, radius = 16): boolean {
    return this.circles.some((c) => Math.hypot(c.x - x, c.y - y) <= c.r + radius);
  }

  queue(req: LabelRequest): void {
    if (!req.text) return;
    this.requests.push(req);
  }

  measure(ctx: CanvasRenderingContext2D, text: string, font: string, fontSize = 12.5): { w: number; h: number } {
    ctx.font = font;
    return { w: ctx.measureText(text).width + 6, h: fontSize + 4 };
  }

  renderAll(ctx: CanvasRenderingContext2D, surfaceColor: string): void {
    const sorted = [...this.requests].sort((a, b) => a.priority - b.priority);
    const { left, top, right, bottom } = this.bounds;

    for (const req of sorted) {
      if (!req.candidates.length) continue;
      const { w, h } = this.measure(ctx, req.text, req.font, req.fontSize ?? 12.5);

      let bestX = req.candidates[0]!.x;
      let bestY = req.candidates[0]!.y;
      let bestScore = Infinity;

      for (const cand of req.candidates) {
        const box: Rect = { x: cand.x - w / 2, y: cand.y - h / 2, w, h };
        let score = cand.bias ?? 0;

        // 1. Keep strictly inside plot bounds
        const spillL = Math.max(0, left - box.x);
        const spillR = Math.max(0, box.x + box.w - right);
        const spillT = Math.max(0, top - box.y);
        const spillB = Math.max(0, box.y + box.h - bottom);
        const spill = spillL + spillR + spillT + spillB;
        if (spill > 0) score += 12000 + spill * 250;

        // 2. Avoid ALL already-placed labels and reserved zones (hint, buttons, axis names)
        for (const other of this.placed) {
          const area = rectOverlapArea(box, other, 3);
          if (area > 0) score += 5000 + area * 60;
        }

        // 3. Avoid ALL dots / draggable handles
        for (const c of this.circles) {
          const d = rectToCircleDist(box, c);
          if (d < 4) score += 3200 + (4 - d) * 140;
        }

        // 4. Avoid ALL arrows / segments / lines
        for (const seg of this.segments) {
          const d = rectToSegMinDist(box, seg);
          if (d < 6) {
            const wt = seg.weight ?? 1;
            score += (d === 0 ? 1500 : 350 + (6 - d) * 90) * wt;
          }
        }

        if (score < bestScore) {
          bestScore = score;
          bestX = cand.x;
          bestY = cand.y;
          if (score === (cand.bias ?? 0)) break; // perfect collision-free placement found
        }
      }

      // Gentle final clamp so text is never sliced off at canvas border
      const minX = left + w / 2;
      const maxX = right - w / 2;
      const minY = top + h / 2;
      const maxY = bottom - h / 2;
      const cx = maxX >= minX ? Math.max(minX, Math.min(maxX, bestX)) : bestX;
      const cy = maxY >= minY ? Math.max(minY, Math.min(maxY, bestY)) : bestY;

      this.placed.push({ x: cx - w / 2, y: cy - h / 2, w, h });

      ctx.save();
      ctx.font = req.font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = surfaceColor;
      ctx.strokeText(req.text, cx, cy);
      ctx.fillStyle = req.color;
      ctx.fillText(req.text, cx, cy);
      ctx.restore();
    }
  }
}
