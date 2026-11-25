/**
 * High-DPI, theme-aware 2D interactive mathematical coordinate canvas.
 * Supports smooth curves with discontinuity clipping, shaded areas, Riemann rectangles,
 * transformed grids (for linear maps & bases), draggable points/vectors, angles, conics, and tooltips.
 */
import { h, hideTip, showTip } from "../shared/core.js";
import { KIT } from "../shared/kit.js";
import { LabelPlacer, anchorCandidates, lineCandidates, pointCandidates, vectorCandidates } from "./label-placer.ts";

export interface DragHandle {
  id: string;
  x: number;
  y: number;
  color?: string;
  label?: string;
  radius?: number;
  onDrag: (x: number, y: number) => void;
}

export interface Scene2D {
  x?: [number, number];
  y?: [number, number];
  equalAspect?: boolean;
  gridStep?: number;
  xLabel?: string;
  yLabel?: string;
  /** Optional transformed grid for linear algebra (columns b1, b2) */
  basisGrid?: { b1: [number, number]; b2: [number, number]; color?: string; range?: number };
  /** Shaded horizontal/vertical bands (e.g. ε-δ or convergence tubes) */
  bands?: { axis: "x" | "y"; from: number; to: number; color: string; border?: string }[];
  /** Polygons (unit square image, parallelogram, triangles, nth-root polygon) */
  polygons?: { pts: [number, number][]; fill?: string; stroke?: string; width?: number; dash?: number[] }[];
  /** Circles / arcs */
  circles?: { cx: number; cy: number; r: number; stroke?: string; fill?: string; dash?: number[]; width?: number }[];
  /** Angle arcs */
  angles?: { cx: number; cy: number; r: number; start: number; end: number; color?: string; label?: string }[];
  /** Riemann / Darboux bars */
  rects?: { x0: number; x1: number; y0: number; y1: number; fill: string; stroke?: string }[];
  /** Shaded region between two curves f(x) and g(x) */
  areas?: { f: (x: number) => number; g?: (x: number) => number; from: number; to: number; fill: string }[];
  /** Infinite lines a x + b y + c = 0 */
  lines?: { a: number; b: number; c: number; color?: string; width?: number; dash?: number[]; label?: string }[];
  /** Explicit function curves y = f(x) */
  curves?: { f: (x: number) => number; color?: string; width?: number; dash?: number[]; label?: string; xRange?: [number, number] }[];
  /** Parametric curves (x(t), y(t)) */
  parametrics?: { fx: (t: number) => number; fy: (t: number) => number; t0: number; t1: number; steps?: number; color?: string; width?: number; dash?: number[] }[];
  /** Segments */
  segments?: { from: [number, number]; to: [number, number]; color?: string; width?: number; dash?: number[] }[];
  /** Arrows / Vectors */
  vectors?: { from?: [number, number]; to: [number, number]; color?: string; width?: number; dash?: number[]; label?: string }[];
  /** Points (static) */
  points?: { x: number; y: number; color?: string; r?: number; hollow?: boolean; ring?: boolean; label?: string }[];
  /** Draggable interactive handles */
  handles?: DragHandle[];
  /** Text annotations */
  labels?: { x: number; y: number; text: string; color?: string; align?: CanvasTextAlign; base?: CanvasTextBaseline }[];
  /** Optional custom hover tooltip formatter */
  hover?: (x: number, y: number) => { title: string; rows: { value: string; label: string; color?: string }[] } | null;
  /** Optional click callback */
  onClick?: (x: number, y: number) => void;
}

export function createCanvas2D(
  host: HTMLElement,
  opts: { height?: number; ratio?: number; interactive?: boolean; hint?: string; ariaLabel?: string } = {},
) {
  const { COLORS, fitCanvas, ns } = KIT;
  const canvas = h("canvas", { role: "img", "aria-label": opts.ariaLabel || "2D math plot" }) as HTMLCanvasElement;
  const style = opts.height ? `height:${opts.height}px` : `aspect-ratio:${opts.ratio ?? 1.45}`;
  const wrap = h("div", { class: `math-canvas-wrap is-2d${opts.interactive ? " interactive" : ""}`, style }, canvas);
  const hintEl = opts.hint ? h("div", { class: "canvas-hint", text: opts.hint }) : null;
  if (hintEl) wrap.append(hintEl);
  host.append(wrap);

  const ctx = canvas.getContext("2d")!;
  let scene: Scene2D = { x: [-5, 5], y: [-5, 5] };
  let activeHandle: DragHandle | null = null;
  let bounds = { x0: -5, x1: 5, y0: -5, y1: 5 };
  const pad = { l: 38, r: 16, t: 14, b: 26 };

  function computeBounds() {
    let [x0, x1] = scene.x ?? [-5, 5];
    let [y0, y1] = scene.y ?? [-5, 5];
    const iw = Math.max(1, view.w - pad.l - pad.r);
    const ih = Math.max(1, view.h - pad.t - pad.b);
    if (scene.equalAspect) {
      const rx = (x1 - x0) / iw;
      const ry = (y1 - y0) / ih;
      if (rx > ry) {
        const cy = (y0 + y1) / 2;
        const half = (rx * ih) / 2;
        y0 = cy - half;
        y1 = cy + half;
      } else {
        const cx = (x0 + x1) / 2;
        const half = (ry * iw) / 2;
        x0 = cx - half;
        x1 = cx + half;
      }
    }
    bounds = { x0, x1, y0, y1 };
  }

  const toPx = (x: number, y: number): [number, number] => {
    const iw = Math.max(1, view.w - pad.l - pad.r);
    const ih = Math.max(1, view.h - pad.t - pad.b);
    return [
      pad.l + ((x - bounds.x0) / (bounds.x1 - bounds.x0)) * iw,
      pad.t + (1 - (y - bounds.y0) / (bounds.y1 - bounds.y0)) * ih,
    ];
  };

  const toData = (px: number, py: number): [number, number] => {
    const iw = Math.max(1, view.w - pad.l - pad.r);
    const ih = Math.max(1, view.h - pad.t - pad.b);
    return [
      bounds.x0 + ((px - pad.l) / iw) * (bounds.x1 - bounds.x0),
      bounds.y0 + (1 - (py - pad.t) / ih) * (bounds.y1 - bounds.y0),
    ];
  };

  function niceGridStep(span: number): number {
    const raw = span / 7;
    const p = 10 ** Math.floor(Math.log10(Math.max(1e-9, raw)));
    const f = raw / p;
    return (f <= 1.2 ? 1 : f <= 2.5 ? 2 : f <= 6 ? 5 : 10) * p;
  }

  function clipLine(a: number, b: number, c: number): [[number, number], [number, number]] | null {
    const { x0, x1, y0, y1 } = bounds;
    const pts: [number, number][] = [];
    if (Math.abs(b) > 1e-12) {
      for (const x of [x0, x1]) {
        const y = -(a * x + c) / b;
        if (y >= y0 - 1e-6 && y <= y1 + 1e-6) pts.push([x, y]);
      }
    }
    if (Math.abs(a) > 1e-12) {
      for (const y of [y0, y1]) {
        const x = -(b * y + c) / a;
        if (x >= x0 - 1e-6 && x <= x1 + 1e-6) pts.push([x, y]);
      }
    }
    if (pts.length < 2) return null;
    let best: [[number, number], [number, number]] = [pts[0]!, pts[1]!];
    let far = 0;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i]![0] - pts[j]![0], pts[i]![1] - pts[j]![1]);
        if (d > far) {
          far = d;
          best = [pts[i]!, pts[j]!];
        }
      }
    }
    return far > 1e-9 ? best : null;
  }

  function drawArrow(from: [number, number], to: [number, number], color: string, width = 2.4, dash: number[] = []) {
    const [ax, ay] = toPx(from[0], from[1]);
    const [bx, by] = toPx(to[0], to[1]);
    const len = Math.hypot(bx - ax, by - ay);
    if (len < 2) return;
    const ang = Math.atan2(by - ay, bx - ax);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx - Math.min(9, len * 0.4) * Math.cos(ang), by - Math.min(9, len * 0.4) * Math.sin(ang));
    ctx.stroke();
    ctx.setLineDash([]);
    const head = Math.min(11, Math.max(7, len * 0.35));
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - head * Math.cos(ang - 0.38), by - head * Math.sin(ang - 0.38));
    ctx.lineTo(bx - head * Math.cos(ang + 0.38), by - head * Math.sin(ang + 0.38));
    ctx.closePath();
    ctx.fill();
  }

  function render() {
    if (!view.w || !view.h) return;
    computeBounds();
    const dpr = canvas.width / view.w;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, view.w, view.h);
    ctx.fillStyle = COLORS.surface;
    ctx.fillRect(0, 0, view.w, view.h);

    const left = pad.l;
    const top = pad.t;
    const right = view.w - pad.r;
    const bottom = view.h - pad.b;

    const reserved = [];
    if (hintEl) {
      const hw = Math.max(120, hintEl.offsetWidth + 14);
      const hh = Math.max(22, hintEl.offsetHeight + 8);
      reserved.push({ x: view.w - hw - 6, y: 4, w: hw + 4, h: hh + 4 });
    }
    if (scene.xLabel) {
      ctx.font = "italic 13px Cambria, 'Times New Roman', serif";
      const xw = ctx.measureText(scene.xLabel).width + 10;
      reserved.push({ x: right - xw - 2, y: bottom - 20, w: xw + 4, h: 20 });
    }
    if (scene.yLabel) {
      ctx.font = "italic 13px Cambria, 'Times New Roman', serif";
      const yw = ctx.measureText(scene.yLabel).width + 10;
      reserved.push({ x: left + 2, y: top + 1, w: yw + 4, h: 20 });
    }
    const placer = new LabelPlacer({ left: left + 3, top: top + 3, right: right - 3, bottom: bottom - 3 }, reserved);

    // Pre-register handles & points as circle obstacles so vector/line labels can detect tip crowds!
    for (const hd of scene.handles || []) {
      const [px, py] = toPx(hd.x, hd.y);
      placer.addCircle(px, py, (hd.radius ?? 7) + 2);
    }
    for (const pt of scene.points || []) {
      const [px, py] = toPx(pt.x, pt.y);
      placer.addCircle(px, py, (pt.r ?? 5) + (pt.ring ? 4 : 0));
    }

    const xStep = scene.gridStep ?? niceGridStep(bounds.x1 - bounds.x0);
    const yStep = scene.gridStep ?? niceGridStep(bounds.y1 - bounds.y0);

    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, right - left, bottom - top);
    ctx.clip();

    // Standard grid
    ctx.lineWidth = 1;
    for (let v = Math.ceil(bounds.x0 / xStep) * xStep; v <= bounds.x1 + 1e-9; v += xStep) {
      const [px] = toPx(v, 0);
      ctx.strokeStyle = Math.abs(v) < xStep * 1e-5 ? COLORS.axis : COLORS.grid;
      ctx.lineWidth = Math.abs(v) < xStep * 1e-5 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(px) + 0.5, top);
      ctx.lineTo(Math.round(px) + 0.5, bottom);
      ctx.stroke();
    }
    for (let v = Math.ceil(bounds.y0 / yStep) * yStep; v <= bounds.y1 + 1e-9; v += yStep) {
      const [, py] = toPx(0, v);
      ctx.strokeStyle = Math.abs(v) < yStep * 1e-5 ? COLORS.axis : COLORS.grid;
      ctx.lineWidth = Math.abs(v) < yStep * 1e-5 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(left, Math.round(py) + 0.5);
      ctx.lineTo(right, Math.round(py) + 0.5);
      ctx.stroke();
    }

    // Optional transformed basis grid
    if (scene.basisGrid) {
      const { b1, b2, color = COLORS.accent, range = 6 } = scene.basisGrid;
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1.1;
      for (let k = -range; k <= range; k++) {
        const p1 = toPx(-range * b1[0] + k * b2[0], -range * b1[1] + k * b2[1]);
        const p2 = toPx(range * b1[0] + k * b2[0], range * b1[1] + k * b2[1]);
        ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
        const q1 = toPx(k * b1[0] - range * b2[0], k * b1[1] - range * b2[1]);
        const q2 = toPx(k * b1[0] + range * b2[0], k * b1[1] + range * b2[1]);
        ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Bands
    for (const band of scene.bands || []) {
      ctx.fillStyle = band.color;
      if (band.axis === "y") {
        const [, py1] = toPx(0, band.to);
        const [, py2] = toPx(0, band.from);
        ctx.fillRect(left, Math.min(py1, py2), right - left, Math.abs(py2 - py1));
        if (band.border) {
          ctx.strokeStyle = band.border;
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(left, py1); ctx.lineTo(right, py1); ctx.moveTo(left, py2); ctx.lineTo(right, py2); ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        const [px1] = toPx(band.from, 0);
        const [px2] = toPx(band.to, 0);
        ctx.fillRect(Math.min(px1, px2), top, Math.abs(px2 - px1), bottom - top);
        if (band.border) {
          ctx.strokeStyle = band.border;
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(px1, top); ctx.lineTo(px1, bottom); ctx.moveTo(px2, top); ctx.lineTo(px2, bottom); ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Shaded areas
    for (const area of scene.areas || []) {
      const steps = 160;
      const g = area.g ?? (() => 0);
      ctx.fillStyle = area.fill;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const vx = area.from + (i / steps) * (area.to - area.from);
        const vy = area.f(vx);
        const [px, py] = toPx(vx, Number.isFinite(vy) ? vy : 0);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      for (let i = steps; i >= 0; i--) {
        const vx = area.from + (i / steps) * (area.to - area.from);
        const vy = g(vx);
        const [px, py] = toPx(vx, Number.isFinite(vy) ? vy : 0);
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }

    // Rectangles (Riemann / Darboux)
    for (const rc of scene.rects || []) {
      const [px0, py0] = toPx(rc.x0, rc.y0);
      const [px1, py1] = toPx(rc.x1, rc.y1);
      ctx.fillStyle = rc.fill;
      ctx.fillRect(Math.min(px0, px1), Math.min(py0, py1), Math.abs(px1 - px0), Math.abs(py1 - py0));
      if (rc.stroke) {
        ctx.strokeStyle = rc.stroke;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(Math.min(px0, px1), Math.min(py0, py1), Math.abs(px1 - px0), Math.abs(py1 - py0));
      }
    }

    // Polygons
    for (const poly of scene.polygons || []) {
      if (poly.pts.length < 2) continue;
      ctx.beginPath();
      poly.pts.forEach((p, idx) => {
        const [px, py] = toPx(p[0], p[1]);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      if (poly.fill) {
        ctx.fillStyle = poly.fill;
        ctx.fill();
      }
      if (poly.stroke) {
        ctx.strokeStyle = poly.stroke;
        ctx.lineWidth = poly.width ?? 2;
        ctx.setLineDash(poly.dash ?? []);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Circles
    for (const ci of scene.circles || []) {
      const [cx, cy] = toPx(ci.cx, ci.cy);
      const [rxPt] = toPx(ci.cx + ci.r, ci.cy);
      const [, ryPt] = toPx(ci.cx, ci.cy + ci.r);
      const rx = Math.abs(rxPt - cx);
      const ry = Math.abs(cy - ryPt);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      if (ci.fill) { ctx.fillStyle = ci.fill; ctx.fill(); }
      if (ci.stroke) {
        ctx.strokeStyle = ci.stroke;
        ctx.lineWidth = ci.width ?? 1.8;
        ctx.setLineDash(ci.dash ?? []);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Angle arcs
    for (const ang of scene.angles || []) {
      const [cx, cy] = toPx(ang.cx, ang.cy);
      const [rxPt] = toPx(ang.cx + ang.r, ang.cy);
      const rPx = Math.abs(rxPt - cx);
      ctx.strokeStyle = ang.color ?? COLORS.c2;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, -ang.end, -ang.start, false);
      ctx.stroke();
      if (ang.label) {
        const mid = (ang.start + ang.end) / 2;
        const font = "600 12px system-ui, sans-serif";
        const { w, h: lh } = placer.measure(ctx, ang.label, font, 12);
        const ax = cx + (rPx + 14) * Math.cos(mid);
        const ay = cy - (rPx + 14) * Math.sin(mid);
        placer.queue({
          text: ang.label,
          color: ang.color ?? COLORS.c2,
          font,
          fontSize: 12,
          priority: 40,
          candidates: anchorCandidates(ax, ay, w, lh),
        });
      }
    }

    // Infinite lines
    for (const line of scene.lines || []) {
      const seg = clipLine(line.a, line.b, line.c);
      if (!seg) continue;
      const p1 = toPx(seg[0][0], seg[0][1]);
      const p2 = toPx(seg[1][0], seg[1][1]);
      ctx.strokeStyle = line.color ?? COLORS.c1;
      ctx.lineWidth = line.width ?? 2.2;
      ctx.setLineDash(line.dash ?? []);
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
      ctx.setLineDash([]);
      placer.addSegment(p1[0], p1[1], p2[0], p2[1], line.dash?.length ? 0.55 : 0.85);
      if (line.label) {
        const font = "600 12px system-ui, sans-serif";
        const { w, h: lh } = placer.measure(ctx, line.label, font, 12);
        placer.queue({
          text: line.label,
          color: line.color ?? COLORS.c1,
          font,
          fontSize: 12,
          priority: 30,
          candidates: lineCandidates(p1[0], p1[1], p2[0], p2[1], w, lh),
        });
      }
    }

    // Function curves
    const steps = Math.max(240, Math.round((right - left) * 1.3));
    const ySpan = bounds.y1 - bounds.y0;
    for (const c of scene.curves || []) {
      const rx0 = c.xRange ? Math.max(bounds.x0, c.xRange[0]) : bounds.x0;
      const rx1 = c.xRange ? Math.min(bounds.x1, c.xRange[1]) : bounds.x1;
      if (rx1 <= rx0) continue;
      ctx.strokeStyle = c.color ?? COLORS.c1;
      ctx.lineWidth = c.width ?? 2.4;
      ctx.lineJoin = "round";
      ctx.setLineDash(c.dash ?? []);
      ctx.beginPath();
      let pen = false;
      let prevY = 0;
      for (let i = 0; i <= steps; i++) {
        const vx = rx0 + (i / steps) * (rx1 - rx0);
        const vy = c.f(vx);
        if (!Number.isFinite(vy) || Math.abs(vy) > ySpan * 40) {
          pen = false;
          continue;
        }
        if (pen && Math.abs(vy - prevY) > ySpan * 1.4) pen = false; // break at vertical asymptotes / jumps
        const [px, py] = toPx(vx, vy);
        if (pen) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
        pen = true;
        prevY = vy;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Parametric curves
    for (const pm of scene.parametrics || []) {
      const n = pm.steps ?? 240;
      ctx.strokeStyle = pm.color ?? COLORS.c1;
      ctx.lineWidth = pm.width ?? 2.3;
      ctx.setLineDash(pm.dash ?? []);
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= n; i++) {
        const t = pm.t0 + (i / n) * (pm.t1 - pm.t0);
        const vx = pm.fx(t);
        const vy = pm.fy(t);
        if (!Number.isFinite(vx) || !Number.isFinite(vy)) { pen = false; continue; }
        const [px, py] = toPx(vx, vy);
        if (pen) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
        pen = true;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Segments
    for (const seg of scene.segments || []) {
      const p1 = toPx(seg.from[0], seg.from[1]);
      const p2 = toPx(seg.to[0], seg.to[1]);
      ctx.strokeStyle = seg.color ?? COLORS.text2;
      ctx.lineWidth = seg.width ?? 1.8;
      ctx.setLineDash(seg.dash ?? []);
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
      ctx.setLineDash([]);
      placer.addSegment(p1[0], p1[1], p2[0], p2[1], seg.dash?.length ? 0.55 : 0.85);
    }

    // Vectors
    for (const vec of scene.vectors || []) {
      const from = vec.from ?? [0, 0];
      drawArrow(from, vec.to, vec.color ?? COLORS.c1, vec.width ?? 2.5, vec.dash ?? []);
      const [fx, fy] = toPx(from[0], from[1]);
      const [tx, ty] = toPx(vec.to[0], vec.to[1]);
      placer.addSegment(fx, fy, tx, ty, vec.dash?.length ? 0.75 : 1.0);
      if (vec.label) {
        const font = "650 13px system-ui, sans-serif";
        const { w, h: lh } = placer.measure(ctx, vec.label, font, 13);
        const tipCrowded = placer.hasCircleNear(tx, ty, 12);
        placer.queue({
          text: vec.label,
          color: vec.color ?? COLORS.c1,
          font,
          fontSize: 13,
          priority: 20,
          candidates: vectorCandidates(fx, fy, tx, ty, w, lh, tipCrowded),
        });
      }
    }

    // Static points
    for (const pt of scene.points || []) {
      const [px, py] = toPx(pt.x, pt.y);
      const r = pt.r ?? 5;
      if (pt.ring) {
        ctx.strokeStyle = pt.color ?? COLORS.accent;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py, r + 4, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = pt.hollow ? COLORS.surface : (pt.color ?? COLORS.accent);
      ctx.fill();
      ctx.strokeStyle = pt.hollow ? (pt.color ?? COLORS.accent) : COLORS.surface;
      ctx.lineWidth = pt.hollow ? 2.2 : 1.5;
      ctx.stroke();
      if (pt.label) {
        const font = "600 12px system-ui, sans-serif";
        const { w, h: lh } = placer.measure(ctx, pt.label, font, 12);
        placer.queue({
          text: pt.label,
          color: pt.color ?? COLORS.text,
          font,
          fontSize: 12,
          priority: 12,
          candidates: pointCandidates(px, py, r + (pt.ring ? 4 : 0), w, lh),
        });
      }
    }

    // Draggable handles
    for (const hd of scene.handles || []) {
      const [px, py] = toPx(hd.x, hd.y);
      const r = hd.radius ?? 7;
      ctx.beginPath();
      ctx.arc(px, py, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = hd.color ?? COLORS.accent;
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = hd.color ?? COLORS.accent;
      ctx.fill();
      ctx.strokeStyle = COLORS.surface;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (hd.label) {
        const font = "700 12.5px system-ui, sans-serif";
        const { w, h: lh } = placer.measure(ctx, hd.label, font, 12.5);
        placer.queue({
          text: hd.label,
          color: COLORS.text,
          font,
          fontSize: 12.5,
          priority: 5,
          candidates: pointCandidates(px, py, r + 3, w, lh),
        });
      }
    }

    // Labels
    for (const lb of scene.labels || []) {
      const [px, py] = toPx(lb.x, lb.y);
      const font = "600 12px system-ui, sans-serif";
      const { w, h: lh } = placer.measure(ctx, lb.text, font, 12);
      const align = lb.align ?? "left";
      const base = lb.base ?? "bottom";
      const cx = align === "center" ? px : align === "right" ? px - w / 2 : px + w / 2;
      const cy = base === "middle" ? py : base === "top" ? py + lh / 2 : py - lh / 2;
      placer.queue({
        text: lb.text,
        color: lb.color ?? COLORS.text2,
        font,
        fontSize: 12,
        priority: 35,
        candidates: anchorCandidates(cx, cy, w, lh),
      });
    }

    // Render all queued labels last with automatic collision avoidance + crisp surface halo
    placer.renderAll(ctx, COLORS.surface);

    ctx.restore();

    // Ticks outside clip (avoid clipping at corners)
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = COLORS.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let v = Math.ceil(bounds.x0 / xStep) * xStep; v <= bounds.x1 + 1e-9; v += xStep) {
      const [px] = toPx(v, 0);
      if (px >= left + 8 && px <= right - 8) ctx.fillText(ns(v, 2), px, bottom + 5);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let v = Math.ceil(bounds.y0 / yStep) * yStep; v <= bounds.y1 + 1e-9; v += yStep) {
      const [, py] = toPx(0, v);
      if (py >= top + 6 && py <= bottom - 6) ctx.fillText(ns(v, 2), left - 6, py);
    }
    ctx.font = "italic 13px Cambria, 'Times New Roman', serif";
    ctx.fillStyle = COLORS.text2;
    if (scene.xLabel) {
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(scene.xLabel, right - 4, bottom - 4);
    }
    if (scene.yLabel) {
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(scene.yLabel, left + 6, top + 3);
    }
  }

  const view = fitCanvas(canvas, render);

  // Pointer interaction: dragging handles, clicking, tooltips
  canvas.addEventListener("pointerdown", (e) => {
    const box = canvas.getBoundingClientRect();
    const px = e.clientX - box.left;
    const py = e.clientY - box.top;
    let best: DragHandle | null = null;
    let bestD = 22;
    for (const hd of scene.handles || []) {
      const [hx, hy] = toPx(hd.x, hd.y);
      const d = Math.hypot(hx - px, hy - py);
      if (d < bestD) { bestD = d; best = hd; }
    }
    if (best) {
      activeHandle = best;
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    } else if (scene.onClick) {
      const [dx, dy] = toData(px, py);
      scene.onClick(dx, dy);
    }
  });

  canvas.addEventListener("pointermove", (e) => {
    const box = canvas.getBoundingClientRect();
    const px = e.clientX - box.left;
    const py = e.clientY - box.top;
    if (activeHandle) {
      const [dx, dy] = toData(px, py);
      const clampedX = Math.max(bounds.x0, Math.min(bounds.x1, dx));
      const clampedY = Math.max(bounds.y0, Math.min(bounds.y1, dy));
      activeHandle.onDrag(Math.round(clampedX * 20) / 20, Math.round(clampedY * 20) / 20);
      return;
    }
    if (e.pointerType === "touch") return;
    if (scene.hover && px >= pad.l && px <= view.w - pad.r && py >= pad.t && py <= view.h - pad.b) {
      const [dx, dy] = toData(px, py);
      const info = scene.hover(dx, dy);
      if (info) showTip(e.clientX, e.clientY, info.title, info.rows);
      else hideTip();
    }
  });

  canvas.addEventListener("pointerup", () => { activeHandle = null; });
  canvas.addEventListener("pointercancel", () => { activeHandle = null; });
  canvas.addEventListener("pointerleave", () => { activeHandle = null; hideTip(); });

  return {
    wrap,
    canvas,
    draw(next?: Scene2D) {
      if (next) scene = next;
      render();
    },
  };
}
