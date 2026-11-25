/**
 * Interactive drag-to-orbit 3D mathematical viewport (no external WebGL libraries needed).
 * Renders 3D axes, vectors, parallelograms, planes, lines, points, and solids of revolution.
 */
import { h } from "../shared/core.js";
import { L } from "../shared/i18n.js";
import { KIT } from "../shared/kit.js";
import { LabelPlacer, anchorCandidates, pointCandidates, vectorCandidates } from "./label-placer.ts";

export type Vec3 = [number, number, number];

export interface Scene3D {
  range?: number;
  vectors?: { from?: Vec3; to: Vec3; color?: string; label?: string; width?: number }[];
  segments?: { from: Vec3; to: Vec3; color?: string; dash?: number[]; width?: number }[];
  points?: { p: Vec3; color?: string; label?: string; dropToXY?: boolean }[];
  planes?: { normal: Vec3; d: number; color?: string; size?: number; label?: string }[];
  quads?: { pts: [Vec3, Vec3, Vec3, Vec3]; fill: string; stroke?: string }[];
  /** Solid of revolution around the x-axis: y = R(x), optional inner r(x), on [a, b] */
  revolution?: {
    R: (x: number) => number;
    r?: (x: number) => number;
    a: number;
    b: number;
    sliceX?: number;
    color?: string;
  };
}

export function createCanvas3D(host: HTMLElement, opts: { height?: number; ariaLabel?: string } = {}) {
  const { COLORS, fitCanvas } = KIT;
  const canvas = h("canvas", { role: "img", "aria-label": opts.ariaLabel || "3D math view" }) as HTMLCanvasElement;
  const wrap = h("div", { class: "math-canvas-wrap interactive", style: `height:${opts.height ?? 340}px` }, canvas);

  let yaw = 0.65;
  let pitch = 0.48;
  let scene: Scene3D = { range: 4 };
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const btns = h("div", { class: "canvas-overlay-btns" });
  const views: [string, number, number][] = [
    ["3D", 0.65, 0.48],
    ["XY", 0, 1.56],
    ["XZ", 0, 0.02],
  ];
  for (const [name, yw, pt] of views) {
    const b = h("button", { type: "button", class: "btn small", text: name });
    b.addEventListener("click", () => {
      yaw = yw;
      pitch = pt;
      render();
    });
    btns.append(b);
  }
  const hintEl = h("div", { class: "canvas-hint", text: L({ tr: "Döndürmek için sürükleyin", en: "Drag to orbit" }) });
  wrap.append(btns, hintEl);
  host.append(wrap);

  const ctx = canvas.getContext("2d")!;

  function project(p: Vec3, scale: number, cx: number, cy: number): [number, number, number] {
    // Rotate around z-axis by yaw, then tilt by pitch so +z points up
    const x1 = p[0] * Math.cos(yaw) - p[1] * Math.sin(yaw);
    const y1 = p[0] * Math.sin(yaw) + p[1] * Math.cos(yaw);
    const z1 = p[2];
    const y2 = y1 * Math.sin(pitch) - z1 * Math.cos(pitch);
    const z2 = y1 * Math.cos(pitch) + z1 * Math.sin(pitch);
    const persp = 1 / (1 - y2 * 0.045);
    return [cx + x1 * scale * persp, cy - z2 * scale * persp, y2];
  }

  function arrow3(from: Vec3, to: Vec3, color: string, width: number, scale: number, cx: number, cy: number) {
    const [ax, ay] = project(from, scale, cx, cy);
    const [bx, by] = project(to, scale, cx, cy);
    const ang = Math.atan2(by - ay, bx - ax);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx - 7 * Math.cos(ang), by - 7 * Math.sin(ang));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - 10 * Math.cos(ang - 0.38), by - 10 * Math.sin(ang - 0.38));
    ctx.lineTo(bx - 10 * Math.cos(ang + 0.38), by - 10 * Math.sin(ang + 0.38));
    ctx.closePath();
    ctx.fill();
  }

  function planeBasis(n: Vec3): { p0: Vec3; u: Vec3; v: Vec3 } | null {
    const n2 = n[0] ** 2 + n[1] ** 2 + n[2] ** 2;
    if (n2 < 1e-10) return null;
    const len = Math.sqrt(n2);
    const nu: Vec3 = [n[0] / len, n[1] / len, n[2] / len];
    const ref: Vec3 = Math.abs(nu[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const uRaw: Vec3 = [
      nu[1] * ref[2] - nu[2] * ref[1],
      nu[2] * ref[0] - nu[0] * ref[2],
      nu[0] * ref[1] - nu[1] * ref[0],
    ];
    const uLen = Math.hypot(...uRaw);
    const u: Vec3 = [uRaw[0] / uLen, uRaw[1] / uLen, uRaw[2] / uLen];
    const v: Vec3 = [
      nu[1] * u[2] - nu[2] * u[1],
      nu[2] * u[0] - nu[0] * u[2],
      nu[0] * u[1] - nu[1] * u[0],
    ];
    return { p0: [0, 0, 0], u, v };
  }

  function render() {
    if (!view.w || !view.h) return;
    const dpr = canvas.width / view.w;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, view.w, view.h);
    ctx.fillStyle = COLORS.surface;
    ctx.fillRect(0, 0, view.w, view.h);

    const R = scene.range ?? 4;
    const cx = view.w / 2;
    const cy = view.h / 2 + 10;
    const scale = Math.min(view.w, view.h) / (R * 2.9);

    const reserved = [
      { x: view.w - Math.max(122, btns.offsetWidth + 14), y: 2, w: Math.max(124, btns.offsetWidth + 16), h: Math.max(34, btns.offsetHeight + 12) },
      { x: 4, y: view.h - Math.max(28, hintEl.offsetHeight + 12), w: Math.max(165, hintEl.offsetWidth + 16), h: Math.max(26, hintEl.offsetHeight + 10) },
    ];
    const placer = new LabelPlacer({ left: 8, top: 8, right: view.w - 8, bottom: view.h - 8 }, reserved);
    for (const pt of scene.points || []) {
      const [px, py] = project(pt.p, scale, cx, cy);
      placer.addCircle(px, py, 7);
    }

    // Reference XY grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    const gStep = R > 5 ? 2 : 1;
    for (let k = -Math.floor(R); k <= Math.floor(R); k += gStep) {
      const a = project([k, -R, 0], scale, cx, cy);
      const b = project([k, R, 0], scale, cx, cy);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      const c = project([-R, k, 0], scale, cx, cy);
      const d = project([R, k, 0], scale, cx, cy);
      ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
    }

    // Planes (translucent mesh patches)
    for (const pl of scene.planes || []) {
      const basis = planeBasis(pl.normal);
      if (!basis) continue;
      const n2 = pl.normal[0] ** 2 + pl.normal[1] ** 2 + pl.normal[2] ** 2;
      const base: Vec3 = [(pl.normal[0] * pl.d) / n2, (pl.normal[1] * pl.d) / n2, (pl.normal[2] * pl.d) / n2];
      const sz = pl.size ?? R * 0.85;
      const pt = (s: number, t: number): Vec3 => [
        base[0] + s * basis.u[0] + t * basis.v[0],
        base[1] + s * basis.u[1] + t * basis.v[1],
        base[2] + s * basis.u[2] + t * basis.v[2],
      ];
      const corners = [pt(-sz, -sz), pt(sz, -sz), pt(sz, sz), pt(-sz, sz)].map((c) => project(c, scale, cx, cy));
      ctx.fillStyle = pl.color ?? "rgba(42, 120, 214, 0.16)";
      ctx.strokeStyle = pl.color ? pl.color.replace(/0\.\d+\)/, "0.65)") : COLORS.c1;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      corners.forEach((p, idx) => (idx ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Faint grid lines on plane
      ctx.globalAlpha = 0.35;
      for (let k = -2; k <= 2; k++) {
        const a = project(pt(-sz, (k * sz) / 3), scale, cx, cy);
        const b = project(pt(sz, (k * sz) / 3), scale, cx, cy);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Quads (e.g. cross-product parallelogram)
    for (const q of scene.quads || []) {
      const pts = q.pts.map((p) => project(p, scale, cx, cy));
      ctx.fillStyle = q.fill;
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      ctx.fill();
      if (q.stroke) {
        ctx.strokeStyle = q.stroke;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    }

    // Solid of revolution (around x-axis)
    if (scene.revolution) {
      const { R: rOuter, r: rInner, a, b, sliceX, color = COLORS.c1 } = scene.revolution;
      const rings = 18;
      const segs = 32;
      const drawRing = (x: number, rad: number, stroke: string, fill?: string, lw = 1.1) => {
        if (rad < 1e-4) return;
        ctx.beginPath();
        for (let j = 0; j <= segs; j++) {
          const th = (j / segs) * Math.PI * 2;
          const [px, py] = project([x, rad * Math.cos(th), rad * Math.sin(th)], scale, cx, cy);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lw;
        ctx.stroke();
      };
      for (let i = 0; i <= rings; i++) {
        const x = a + (i / rings) * (b - a);
        drawRing(x, Math.abs(rOuter(x)), color, i === 0 || i === rings ? "rgba(42,120,214,0.14)" : undefined, 1.0);
        if (rInner) drawRing(x, Math.abs(rInner(x)), COLORS.c2, undefined, 0.9);
      }
      // Meridians
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.2;
      for (const th of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
        ctx.beginPath();
        for (let i = 0; i <= 36; i++) {
          const x = a + (i / 36) * (b - a);
          const rad = Math.abs(rOuter(x));
          const [px, py] = project([x, rad * Math.cos(th), rad * Math.sin(th)], scale, cx, cy);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (sliceX !== undefined && sliceX >= a && sliceX <= b) {
        drawRing(sliceX, Math.abs(rOuter(sliceX)), COLORS.c2, "rgba(235, 104, 52, 0.32)", 2.3);
        if (rInner) drawRing(sliceX, Math.abs(rInner(sliceX)), COLORS.surface, COLORS.surface, 1.5);
      }
    }

    // 3D Axes
    const axes: [Vec3, Vec3, string][] = [
      [[-R, 0, 0], [R, 0, 0], "x"],
      [[0, -R, 0], [0, R, 0], "y"],
      [[0, 0, -R * 0.7], [0, 0, R], "z"],
    ];
    for (const [f, t, lbl] of axes) {
      arrow3(f, t, COLORS.axis, 1.4, scale, cx, cy);
      const a = project(f, scale, cx, cy);
      const b = project(t, scale, cx, cy);
      placer.addSegment(a[0], a[1], b[0], b[1], 0.35);
      const [lx, ly] = project([t[0] * 1.09, t[1] * 1.09, t[2] * 1.09], scale, cx, cy);
      const font = "italic 600 13px Cambria, 'Times New Roman', serif";
      const { w, h: lh } = placer.measure(ctx, lbl, font, 13);
      placer.queue({
        text: lbl,
        color: COLORS.text2,
        font,
        fontSize: 13,
        priority: 30,
        candidates: anchorCandidates(lx, ly, w, lh),
      });
    }

    // Segments
    for (const seg of scene.segments || []) {
      const a = project(seg.from, scale, cx, cy);
      const b = project(seg.to, scale, cx, cy);
      ctx.strokeStyle = seg.color ?? COLORS.c2;
      ctx.lineWidth = seg.width ?? 2.2;
      ctx.setLineDash(seg.dash ?? []);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.setLineDash([]);
      placer.addSegment(a[0], a[1], b[0], b[1], seg.dash?.length ? 0.55 : 0.85);
    }

    // Vectors
    for (const vec of scene.vectors || []) {
      const from = vec.from ?? [0, 0, 0];
      arrow3(from, vec.to, vec.color ?? COLORS.c1, vec.width ?? 2.6, scale, cx, cy);
      const [fx, fy] = project(from, scale, cx, cy);
      const [tx, ty] = project(vec.to, scale, cx, cy);
      placer.addSegment(fx, fy, tx, ty, 1.0);
      if (vec.label) {
        const font = "650 13px system-ui, sans-serif";
        const { w, h: lh } = placer.measure(ctx, vec.label, font, 13);
        const tipCrowded = placer.hasCircleNear(tx, ty, 12);
        placer.queue({
          text: vec.label,
          color: vec.color ?? COLORS.c1,
          font,
          fontSize: 13,
          priority: 15,
          candidates: vectorCandidates(fx, fy, tx, ty, w, lh, tipCrowded),
        });
      }
    }

    // Points
    for (const pt of scene.points || []) {
      if (pt.dropToXY) {
        const a = project(pt.p, scale, cx, cy);
        const b = project([pt.p[0], pt.p[1], 0], scale, cx, cy);
        ctx.strokeStyle = COLORS.muted;
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        ctx.setLineDash([]);
      }
      const [px, py] = project(pt.p, scale, cx, cy);
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = pt.color ?? COLORS.c2;
      ctx.fill();
      ctx.strokeStyle = COLORS.surface;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      if (pt.label) {
        const font = "650 12px system-ui, sans-serif";
        const { w, h: lh } = placer.measure(ctx, pt.label, font, 12);
        placer.queue({
          text: pt.label,
          color: COLORS.text,
          font,
          fontSize: 12,
          priority: 8,
          candidates: pointCandidates(px, py, 6, w, lh),
        });
      }
    }

    placer.renderAll(ctx, COLORS.surface);
  }

  const view = fitCanvas(canvas, render);

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    yaw += (e.clientX - lastX) * 0.011;
    pitch = Math.max(-1.45, Math.min(1.56, pitch + (e.clientY - lastY) * 0.011));
    lastX = e.clientX;
    lastY = e.clientY;
    render();
  });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  canvas.addEventListener("pointercancel", () => { dragging = false; });

  return {
    wrap,
    canvas,
    draw(next?: Scene3D) {
      if (next) scene = next;
      render();
    },
  };
}
