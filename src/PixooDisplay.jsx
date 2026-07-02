import { useEffect, useRef, useState, useCallback } from "react";

const SCALE = 8;
const W = 64;
const H = 64;

const C = {
  RED:    [218, 41,  28],
  ORANGE: [237, 139, 0],
  GREEN:  [0,   132, 61],
  BLUE:   [0,   61,  165],
};

const BODY_BG   = 0.16;
const HEADER_BG = 0.24;
const HDR_GB    = 0.28;

function sc(color, f) {
  return color.map(c => Math.max(0, Math.min(255, Math.round(c * f))));
}

function rgb([r, g, b]) { return `rgb(${r},${g},${b})`; }

function bgAt(x, y) {
  if ((y >= 17 && y <= 21) || (y >= 41 && y <= 45)) return [0, 0, 0];
  if (y >= 0 && y <= 4)
    return x >= 49 ? sc(C.BLUE, HDR_GB) : sc(C.GREEN, HDR_GB);
  if ((y >= 22 && y <= 28) || (y >= 46 && y <= 52)) {
    if (x <= 31) return sc(C.GREEN, HDR_GB);
    if (x <= 47) return sc(C.RED, HEADER_BG);
    return sc(C.ORANGE, HEADER_BG);
  }
  if (y >= 0 && y <= 16) return x >= 49 ? sc(C.BLUE, BODY_BG) : sc(C.GREEN, BODY_BG);
  if (x <= 31) return sc(C.GREEN, BODY_BG);
  if (x <= 47) return sc(C.RED, BODY_BG);
  return sc(C.ORANGE, BODY_BG);
}

// 3×5 pixel font bitmaps — rows top to bottom, cols left to right
const FONT = {
  "0": [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  "1": [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  "2": [[1,1,1],[0,0,1],[0,1,1],[1,0,0],[1,1,1]],
  "3": [[1,1,1],[0,0,1],[0,1,1],[0,0,1],[1,1,1]],
  "4": [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  "5": [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  "6": [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
  "7": [[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
  "8": [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
  "9": [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  "A": [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  "B": [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  "C": [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  "E": [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  "F": [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
  "G": [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
  "H": [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  "K": [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  "L": [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  "R": [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  "S": [[0,1,1],[1,0,0],[0,1,1],[0,0,1],[1,1,0]],
  "T": [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  "W": [[1,0,1],[1,0,1],[1,0,1],[1,1,1],[0,1,0]],
  // custom glyphs matching Python overrides
  "D": [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  "O": [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  "U": [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  "f": [[0,0,0],[1,1,1],[1,0,0],[1,1,0],[1,0,0]],
  "/": [[0,0,0],[0,0,1],[0,1,0],[0,1,0],[1,0,0]],
  "o": [[0,0,0],[1,1,1],[1,0,1],[1,0,1],[1,1,1]],
  "u": [[0,0,0],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  "i": [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  "m": [[0,0,0],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
  "n": [[0,0,0],[1,1,0],[1,0,1],[1,0,1],[1,0,1]],
  "s": [[0,1,1],[1,0,0],[0,1,1],[0,0,1],[1,1,0]],
  "t": [[0,1,0],[1,1,1],[0,1,0],[0,1,0],[0,0,1]],
  "w": [[1,0,1],[1,0,1],[1,0,1],[1,1,1],[0,1,0]],
};

function drawChar(ctx, ch, px, py, color) {
  const bitmap = FONT[ch];
  if (!bitmap) return;
  ctx.fillStyle = rgb(color);
  for (let row = 0; row < bitmap.length; row++) {
    for (let col = 0; col < 3; col++) {
      if (bitmap[row][col]) {
        const sx = px + col;
        const sy = py + row;
        if (sx >= 0 && sx < W && sy >= 0 && sy < H) {
          ctx.fillRect(sx * SCALE, sy * SCALE, SCALE, SCALE);
        }
      }
    }
  }
}

function drawText(ctx, text, px, py, color) {
  for (let i = 0; i < text.length; i++) {
    drawChar(ctx, text[i], px + i * 4, py, color);
  }
}

function dimmedColor(color, minutes) {
  if (minutes == null) return color;
  const clamped = Math.max(0, Math.min(10, minutes));
  const factor = 1 - (clamped / 10) * (1 - 0.42);
  return color.map(c => Math.max(0, Math.min(255, Math.round(c * factor))));
}

function drawValue(ctx, value, px, py, color) {
  if (value == null) return;
  const dimmed = dimmedColor(color, value);
  const text = String(value);
  const ox = text.length === 1 ? 2 : 0;
  drawText(ctx, text, px + ox, py, dimmed);
}

function fillRect(ctx, x1, y1, x2, y2, color) {
  ctx.fillStyle = typeof color === "string" ? color : rgb(color);
  ctx.fillRect(x1 * SCALE, y1 * SCALE, (x2 - x1 + 1) * SCALE, (y2 - y1 + 1) * SCALE);
}

function drawBackground(ctx) {
  const DG = sc(C.GREEN,  BODY_BG);
  const DR = sc(C.RED,    BODY_BG);
  const DO = sc(C.ORANGE, BODY_BG);
  const DB = sc(C.BLUE,   BODY_BG);
  const LG = sc(C.GREEN,  HDR_GB);
  const LR = sc(C.RED,    HEADER_BG);
  const LO = sc(C.ORANGE, HEADER_BG);
  const LB = sc(C.BLUE,   HDR_GB);

  fillRect(ctx, 0,  0,  48, 16, DG);
  fillRect(ctx, 49, 0,  63, 16, DB);
  fillRect(ctx, 0,  22, 31, 63, DG);
  fillRect(ctx, 32, 22, 47, 63, DR);
  fillRect(ctx, 48, 22, 63, 63, DO);
  fillRect(ctx, 0,  0,  48,  4, LG);
  fillRect(ctx, 49, 0,  63,  4, LB);
  fillRect(ctx, 0,  22, 31, 28, LG);
  fillRect(ctx, 32, 22, 47, 28, LR);
  fillRect(ctx, 48, 22, 63, 28, LO);
  fillRect(ctx, 0,  46, 31, 52, LG);
  fillRect(ctx, 32, 46, 47, 52, LR);
  fillRect(ctx, 48, 46, 63, 52, LO);
  fillRect(ctx, 0,  17, 63, 21, "black");
  fillRect(ctx, 0,  41, 63, 45, "black");
}

function drawLabels(ctx) {
  drawText(ctx, "union",  0,  -1, C.GREEN);
  drawText(ctx, "m/tfts", 23, -1, C.GREEN);
  drawText(ctx, "won",    51, -1, C.BLUE);

  drawText(ctx, "B",   6,  23, C.GREEN);
  drawText(ctx, "C",   22, 23, C.GREEN);
  drawText(ctx, "ALE", 34, 23, C.RED);
  drawText(ctx, "OAK", 50, 23, C.ORANGE);

  drawText(ctx, "D",   6,  47, C.GREEN);
  drawText(ctx, "E",   22, 47, C.GREEN);
  drawText(ctx, "ASH", 34, 47, C.RED);
  drawText(ctx, "FOR", 50, 47, C.ORANGE);
}

function drawPredictions(ctx, p) {
  if (!p) return;

  drawValue(ctx, p.north_d[0], 6,  5,  C.GREEN);
  drawValue(ctx, p.north_e[0], 30, 5,  C.GREEN);
  drawValue(ctx, p.wonderland[0], 53, 5,  C.BLUE);
  drawValue(ctx, p.north_d[1], 6,  11, C.GREEN);
  drawValue(ctx, p.north_e[1], 30, 11, C.GREEN);
  drawValue(ctx, p.wonderland[1], 53, 11, C.BLUE);

  drawValue(ctx, p.b[0],       4,  29, C.GREEN);
  drawValue(ctx, p.c[0],       20, 29, C.GREEN);
  drawValue(ctx, p.alewife[0], 36, 29, C.RED);
  drawValue(ctx, p.oak_grove[0], 52, 29, C.ORANGE);
  drawValue(ctx, p.b[1],       4,  35, C.GREEN);
  drawValue(ctx, p.c[1],       20, 35, C.GREEN);
  drawValue(ctx, p.alewife[1], 36, 35, C.RED);
  drawValue(ctx, p.oak_grove[1], 52, 35, C.ORANGE);

  drawValue(ctx, p.d[0],       4,  53, C.GREEN);
  drawValue(ctx, p.e[0],       20, 53, C.GREEN);
  drawValue(ctx, p.ashmont_braintree[0], 36, 53, C.RED);
  drawValue(ctx, p.forest_hills[0],      52, 53, C.ORANGE);
  drawValue(ctx, p.d[1],       4,  59, C.GREEN);
  drawValue(ctx, p.e[1],       20, 59, C.GREEN);
  drawValue(ctx, p.ashmont_braintree[1], 36, 59, C.RED);
  drawValue(ctx, p.forest_hills[1],      52, 59, C.ORANGE);
}

const COLOR_MAP = {
  red:    C.RED,
  orange: C.ORANGE,
  green:  C.GREEN,
  blue:   C.BLUE,
};

// Draws a multi-car train sprite at pixel position x0 in lane y (5px tall)
// using the loaded Image (or null to draw a solid color block)
function drawTrainAt(ctx, x0, laneY, img, colors) {
  if (img) {
    const sw = img.naturalWidth;
    const sh = img.naturalHeight;
    // clear the band first
    fillRect(ctx, 0, laneY, 63, laneY + 4, "black");
    // draw the sprite clipped to the display
    const srcX = x0 < 0 ? -x0 : 0;
    const dstX = x0 < 0 ? 0 : x0;
    const drawW = Math.min(sw - srcX, W - dstX);
    if (drawW > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, srcX, 0, drawW, sh, dstX * SCALE, laneY * SCALE, drawW * SCALE, sh * SCALE);
    }
  } else {
    // fallback: draw a solid colored block
    const color = colors.length ? COLOR_MAP[colors[0]] || C.GREEN : C.GREEN;
    fillRect(ctx, 0, laneY, 63, laneY + 4, "black");
    const x1 = Math.max(0, x0);
    const x2 = Math.min(63, x0 + 25);
    if (x2 >= x1) fillRect(ctx, x1, laneY, x2, laneY + 4, color);
  }
}

const SPRITE_URL_BASE = "/normal_trains/";

function spriteUrl(colors) {
  if (!colors || colors.length === 0) return `${SPRITE_URL_BASE}green.png`;
  const sorted = [...colors].sort().join("_");
  return `${SPRITE_URL_BASE}${sorted}.png`;
}

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export default function PixooDisplay() {
  const canvasRef = useRef(null);
  const bgRef = useRef(null); // offscreen canvas for background
  const stateRef = useRef({ predictions: null, arrivals: [], pushed_at: null });
  const animRef = useRef(null);
  const lastPushedAtRef = useRef(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stale, setStale] = useState(false);

  const redrawBackground = useCallback((predictions) => {
    const bg = bgRef.current;
    if (!bg) return;
    const ctx = bg.getContext("2d");
    ctx.clearRect(0, 0, bg.width, bg.height);
    drawBackground(ctx);
    drawLabels(ctx);
    drawPredictions(ctx, predictions);
  }, []);

  const compositeToMain = useCallback(() => {
    const canvas = canvasRef.current;
    const bg = bgRef.current;
    if (!canvas || !bg) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0);
  }, []);

  const runArrivals = useCallback(async (arrivals) => {
    if (!arrivals || arrivals.length === 0) return;

    // Load all sprites up front
    const loaded = await Promise.all(arrivals.map(async (arrival) => {
      const img = arrival.sprite_b64
        ? await loadImage(`data:image/png;base64,${arrival.sprite_b64}`)
        : await loadImage(spriteUrl(arrival.colors));
      const sw = img ? img.naturalWidth : 26;
      const ltr = arrival.direction === "left_to_right";
      const laneY = arrival.lane === "bottom_right" ? 41 : 17;
      // +1 so sprite fully exits before stopping (matches Python range)
      const positions = ltr
        ? Array.from({ length: sw + W + 1 }, (_, i) => -sw + i)
        : Array.from({ length: sw + W + 1 }, (_, i) => W - i);
      return { ...arrival, img, sw, ltr, laneY, positions };
    }));

    // Blink exclamations (all lanes together, single background repaint per blink)
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      for (let b = 0; b < 3; b++) {
        ctx.drawImage(bgRef.current, 0, 0);
        for (const a of loaded) {
          const color = a.colors.length ? COLOR_MAP[a.colors[0]] || C.GREEN : C.GREEN;
          ctx.fillStyle = rgb(color);
          const ax = a.lane === "bottom_right" ? 62 : 2;
          ctx.fillRect(ax * SCALE, a.laneY * SCALE, SCALE, SCALE * 3);
          ctx.fillRect(ax * SCALE, (a.laneY + 4) * SCALE, SCALE, SCALE);
        }
        await new Promise(r => setTimeout(r, 120));
        ctx.drawImage(bgRef.current, 0, 0);
        await new Promise(r => setTimeout(r, 120));
      }
    }

    // Single RAF loop animates all trains simultaneously (prevents mutual overwrite)
    const FPS = 20;
    const MS_PER_FRAME = 1000 / FPS;
    const totalFrames = Math.max(...loaded.map(a => a.positions.length));

    await new Promise((resolve) => {
      let idx = 0;
      let lastTime = null;

      function step(ts) {
        if (!lastTime) { lastTime = ts; animRef.current = requestAnimationFrame(step); return; }
        const framesToAdvance = Math.floor((ts - lastTime) / MS_PER_FRAME);
        if (framesToAdvance > 0) {
          idx += framesToAdvance;
          lastTime += framesToAdvance * MS_PER_FRAME;
        }

        if (idx >= totalFrames) { compositeToMain(); resolve(); return; }

        const canvas = canvasRef.current;
        if (!canvas) { resolve(); return; }
        const ctx = canvas.getContext("2d");

        // Single background repaint per frame, then all trains on top
        ctx.drawImage(bgRef.current, 0, 0);
        for (const a of loaded) {
          const frameIdx = Math.min(idx, a.positions.length - 1);
          const x0 = a.positions[frameIdx];
          ctx.fillStyle = "black";
          ctx.fillRect(0, a.laneY * SCALE, W * SCALE, 5 * SCALE);
          if (a.img) {
            const srcX = x0 < 0 ? -x0 : 0;
            const dstX = x0 < 0 ? 0 : x0;
            const drawW = Math.min(a.sw - srcX, W - dstX);
            if (drawW > 0) {
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(a.img, srcX, 0, drawW, a.img.naturalHeight,
                dstX * SCALE, a.laneY * SCALE, drawW * SCALE, a.img.naturalHeight * SCALE);
            }
          } else {
            const color = a.colors.length ? COLOR_MAP[a.colors[0]] || C.GREEN : C.GREEN;
            const x1 = Math.max(0, x0);
            const x2 = Math.min(W - 1, x0 + a.sw - 1);
            if (x2 >= x1) {
              ctx.fillStyle = rgb(color);
              ctx.fillRect(x1 * SCALE, a.laneY * SCALE, (x2 - x1 + 1) * SCALE, 5 * SCALE);
            }
          }
        }

        animRef.current = requestAnimationFrame(step);
      }

      animRef.current = requestAnimationFrame(step);
    });
  }, [compositeToMain]);

  useEffect(() => {
    bgRef.current = document.createElement("canvas");
    bgRef.current.width = W * SCALE;
    bgRef.current.height = H * SCALE;
    redrawBackground(null);
    compositeToMain();
  }, [redrawBackground, compositeToMain]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/display-state`);
        if (!res.ok || cancelled) return;
        const data = await res.json();

        stateRef.current = data;
        const isNew = data.pushed_at && data.pushed_at !== lastPushedAtRef.current;
        lastPushedAtRef.current = data.pushed_at;

        if (data.pushed_at) {
          const age = (Date.now() - new Date(data.pushed_at).getTime()) / 1000;
          setStale(age > 120);
          setLastUpdated(new Date(data.pushed_at));
        }

        redrawBackground(data.predictions);
        compositeToMain();

        if (isNew && data.arrivals?.length > 0) {
          if (animRef.current) cancelAnimationFrame(animRef.current);
          runArrivals(data.arrivals);
        }
      } catch (_) {}
    }

    poll();
    const id = setInterval(poll, 7000);
    return () => {
      cancelled = true;
      clearInterval(id);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [redrawBackground, compositeToMain, runArrivals]);

  function formatAge(date) {
    if (!date) return "";
    const secs = Math.round((Date.now() - date.getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    return `${Math.round(secs / 60)}m ago`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        border: "6px solid #1a1a1a",
        borderRadius: 10,
        background: "#000",
        display: "inline-block",
        boxShadow: "0 0 24px rgba(0,0,0,0.7)",
      }}>
        <canvas
          ref={canvasRef}
          width={W * SCALE}
          height={H * SCALE}
          style={{ display: "block", imageRendering: "pixelated" }}
        />
      </div>
      <div style={{ fontSize: 12, color: stale ? "#f87171" : "#888" }}>
        {lastUpdated
          ? `Last updated ${formatAge(lastUpdated)}${stale ? " — Pi may be offline" : ""}`
          : "Waiting for display data…"}
      </div>
    </div>
  );
}
