import { useEffect, useMemo, useRef, useState } from "react";
import bucketIcon from "./static/bucket.png";
import { MONTHS } from "./constants";

const GRID_WIDTH = 26;
const GRID_HEIGHT = 5;
const PIXEL_SIZE = 30;
const PREVIEW_PIXEL_SIZE = 10;
const LINK_ROW = 3;
const LINK_COLOR = "#464646";
const TRANSPARENT_COLOR = "__TRANSPARENT__";

function makeSvgCursor(svgPath, hotspotX, hotspotY) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="${svgPath}" fill="white" stroke="#222" stroke-width="0.8" paint-order="stroke"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspotX} ${hotspotY}, crosshair`;
}

const CURSOR_PAINT = makeSvgCursor(
  "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  2, 22
);
const CURSOR_FILL = makeSvgCursor(
  "M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.58-.58.58-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z",
  2, 20
);

const DEFAULT_PALETTE = ["#DA291C", "#ED8B00", "#00843D", "#003DA5"];
const SAMPLE_COLORS = {
  red: "#DA291C",
  orange: "#ED8B00",
  green: "#00843D",
  blue: "#003DA5",
  white: "#F5F5F5",
  pink: "#FF5FB2",
  yellow: "#FFE066",
  aqua: "#66E0FF"
};

function makeGridFromRows(rows) {
  return rows.map((row) =>
    row.map((cell) => {
      if (cell === ".") {
        return null;
      }
      return SAMPLE_COLORS[cell] || null;
    })
  );
}

function makeGridFromHexRows(rows) {
  return rows.map((row) => row.map((cell) => (cell === "." ? null : String(cell).toUpperCase())));
}

function buildSamples() {
  return [
    {
      name: "party-wave",
      pixels: makeGridFromRows([
        ["red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua"],
        ["orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue"],
        ["yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink"],
        ["green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red"],
        ["aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange", "yellow", "green", "aqua", "blue", "pink", "red", "orange"]
      ])
    },
    {
      name: "train-pixels-1",
      pixels: makeGridFromHexRows([
        ["#182E15", "#61AA44", "#61AA44", "#478B3E", "#478B3E", "#61AA44", "#61AA44", "#478B3E", "#478B3E", "#9EC868", "#61AA44", "#61AA44", "#61AA44", "#61AA44", "#9EC868", "#478B3E", "#478B3E", "#9EC868", "#9EC868", "#9EC868", "#61AA44", "#61AA44", "#478B3E", "#61AA44", "#61AA44", "#9EC868"],
        ["#182E15", "#61AA44", "#478B3E", "#9EC868", "#61AA44", "#61AA44", "#61AA44", "#61AA44", "#9EC868", "#478B3E", "#478B3E", "#61AA44", "#9EC868", "#478B3E", "#9EC868", "#478B3E", "#61AA44", "#9EC868", "#61AA44", "#478B3E", "#61AA44", "#0F0F0F", "#0F0F0F", "#9EC868", "#0F0F0F", "#478B3E"],
        ["#182E15", "#61AA44", "#478B3E", "#61AA44", "#61AA44", "#478B3E", "#9EC868", "#61AA44", "#478B3E", "#478B3E", "#9EC868", "#478B3E", "#61AA44", "#9EC868", "#9EC868", "#9EC868", "#9EC868", "#9EC868", "#478B3E", "#9EC868", "#61AA44", "#61AA44", "#0F0F0F", "#0F0F0F", "#61AA44", "#478B3E"],
        ["#182E15", "#61AA44", "#478B3E", "#61AA44", "#478B3E", "#61AA44", "#9EC868", "#61AA44", "#478B3E", "#9EC868", "#9EC868", "#478B3E", "#61AA44", "#478B3E", "#478B3E", "#478B3E", "#61AA44", "#61AA44", "#61AA44", "#61AA44", "#61AA44", "#0F0F0F", "#0F0F0F", "#478B3E", "#0F0F0F", "#9EC868"],
        ["#182E15", "#9EC868", "#61AA44", "#9EC868", "#61AA44", "#478B3E", "#61AA44", "#478B3E", "#61AA44", "#61AA44", "#61AA44", "#61AA44", "#61AA44", "#478B3E", "#9EC868", "#61AA44", "#61AA44", "#478B3E", "#9EC868", "#61AA44", "#61AA44", "#9EC868", "#478B3E", "#478B3E", "#9EC868", "#61AA44"]
      ])
    },
    {
      name: "train-pixels-2",
      pixels: makeGridFromHexRows([
        [".", "#C57F3E", ".", "#C57F3E", ".", ".", ".", "#14171A", ".", "#14171A", ".", ".", ".", "#C57F3E", ".", "#C57F3E", ".", ".", ".", "#14171A", ".", "#14171A", ".", ".", ".", "."],
        ["#C57F3E", "#C57F3E", "#C57F3E", "#C57F3E", "#C57F3E", ".", "#14171A", "#14171A", "#14171A", "#14171A", "#14171A", ".", "#C57F3E", "#C57F3E", "#C57F3E", "#C57F3E", "#C57F3E", ".", "#14171A", "#14171A", "#14171A", "#14171A", "#14171A", ".", ".", "."],
        ["#D6D0C2", "#274E3C", "#C57F3E", "#274E3C", "#D6D0C2", ".", "#D6D0C2", "#182E15", "#14171A", "#182E15", "#D6D0C2", ".", "#D6D0C2", "#274E3C", "#C57F3E", "#274E3C", "#D6D0C2", ".", "#D6D0C2", "#274E3C", "#14171A", "#274E3C", "#D6D0C2", ".", ".", "."],
        ["#C57F3E", "#8B5D4F", "#AC5C5E", "#8B5D4F", "#C57F3E", ".", "#14171A", "#2E3138", "#AC5C5E", "#2E3138", "#14171A", ".", "#C57F3E", "#8B5D4F", "#AC5C5E", "#8B5D4F", "#C57F3E", ".", "#14171A", "#2E3138", "#AC5C5E", "#2E3138", "#14171A", ".", ".", "."],
        ["#C57F3E", "#C99E76", "#C99E76", "#C99E76", "#C57F3E", ".", "#14171A", "#444046", "#444046", "#444046", "#14171A", ".", "#C57F3E", "#C99E76", "#C99E76", "#C99E76", "#C57F3E", ".", "#14171A", "#444046", "#444046", "#444046", "#14171A", ".", ".", "."]
      ])
    }
  ];
}

function makeEmptyPixels() {
  return Array.from({ length: GRID_HEIGHT }, () => Array.from({ length: GRID_WIDTH }, () => null));
}

function clonePixels(grid) {
  return grid.map((row) => [...row]);
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const byteChars = atob(base64);
  const array = new Uint8Array(byteChars.length);

  for (let i = 0; i < byteChars.length; i += 1) {
    array[i] = byteChars.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}

export default function App() {
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const drawingRef = useRef(false);
  const colorPanelRef = useRef(null);
  const addSwatchRef = useRef(null);
  const draftColorRef = useRef(null);

  const now = useMemo(() => new Date(), []);
  const [name, setName] = useState("");
  const [birthMonth, setBirthMonth] = useState(String(now.getMonth() + 1));
  const [birthDay, setBirthDay] = useState(String(now.getDate()));
  const [currentTool, setCurrentTool] = useState("paint");
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [currentColor, setCurrentColor] = useState(DEFAULT_PALETTE[0]);
  const [pickerColor, setPickerColor] = useState(DEFAULT_PALETTE[0]);
  const [draftColor, setDraftColor] = useState(DEFAULT_PALETTE[0]);
  draftColorRef.current = draftColor;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingDeleteColor, setPendingDeleteColor] = useState(null);
  const [pixels, setPixels] = useState(makeEmptyPixels);
  const sampleIndexRef = useRef(-1);
  const [undoStack, setUndoStack] = useState([]);
  const [tintedBucketIcon, setTintedBucketIcon] = useState(bucketIcon);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "loading" | "success" | "error"
  const [submitError, setSubmitError] = useState("");
  const [flipRtl, setFlipRtl] = useState(true);
  const flipPreviewCanvasRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const selectedToolColor = currentColor === TRANSPARENT_COLOR ? "#EFEFEF" : currentColor;

  const samples = useMemo(() => buildSamples(), []);

  const dayOptions = useMemo(() => {
    const monthMeta = MONTHS.find((month) => String(month.value) === birthMonth) || MONTHS[0];
    return Array.from({ length: monthMeta.days }, (_, index) => String(index + 1));
  }, [birthMonth]);

  useEffect(() => {
    if (!dayOptions.includes(birthDay)) {
      setBirthDay(dayOptions[dayOptions.length - 1]);
    }
  }, [birthDay, dayOptions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < GRID_HEIGHT; row += 1) {
      for (let col = 0; col < GRID_WIDTH; col += 1) {
        const color = pixels[row][col];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
      }
    }

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;

    for (let col = 0; col <= GRID_WIDTH; col += 1) {
      const x = col * PIXEL_SIZE + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let row = 0; row <= GRID_HEIGHT; row += 1) {
      const y = row * PIXEL_SIZE + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.restore();
  }, [pixels]);

  const hasPixels = useMemo(() => pixels.some((row) => row.some((cell) => cell !== null)), [pixels]);

  const previewCarCount = useMemo(() => {
    let left = GRID_WIDTH, right = -1;
    for (let col = 0; col < GRID_WIDTH; col += 1) {
      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        if (pixels[row][col] !== null) {
          if (col < left) left = col;
          if (col > right) right = col;
        }
      }
    }
    if (right === -1) return 3;
    return (right - left + 1) < 15 ? 5 : 3;
  }, [pixels]);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    let left = GRID_WIDTH, right = -1;
    for (let col = 0; col < GRID_WIDTH; col += 1) {
      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        if (pixels[row][col] !== null) {
          if (col < left) left = col;
          if (col > right) right = col;
        }
      }
    }

    const ctx = canvas.getContext("2d");

    if (right === -1) {
      canvas.width = 1;
      canvas.height = GRID_HEIGHT * PREVIEW_PIXEL_SIZE;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const W = right - left + 1;
    const carCount = W < 15 ? 5 : 3;
    const totalCols = carCount * W + (carCount - 1);
    canvas.width = totalCols * PREVIEW_PIXEL_SIZE;
    canvas.height = GRID_HEIGHT * PREVIEW_PIXEL_SIZE;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const assembled = Array.from({ length: GRID_HEIGHT }, () => new Array(totalCols).fill(null));
    for (let carIdx = 0; carIdx < carCount; carIdx += 1) {
      const xOffset = carIdx * (W + 1);
      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        for (let col = left; col <= right; col += 1) {
          assembled[row][xOffset + (col - left)] = pixels[row][col];
        }
      }
    }

    const linkPositions = Array.from({ length: carCount - 1 }, (_, i) => (i + 1) * W + i);
    for (const linkX of linkPositions) {
      assembled[LINK_ROW][linkX] = LINK_COLOR;
      for (let col = linkX - 1; col >= 0 && assembled[LINK_ROW][col] === null; col -= 1) {
        assembled[LINK_ROW][col] = LINK_COLOR;
      }
      for (let col = linkX + 1; col < totalCols && assembled[LINK_ROW][col] === null; col += 1) {
        assembled[LINK_ROW][col] = LINK_COLOR;
      }
    }

    for (let row = 0; row < GRID_HEIGHT; row += 1) {
      for (let col = 0; col < totalCols; col += 1) {
        const color = assembled[row][col];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(col * PREVIEW_PIXEL_SIZE, row * PREVIEW_PIXEL_SIZE, PREVIEW_PIXEL_SIZE, PREVIEW_PIXEL_SIZE);
      }
    }

    const flipCanvas = flipPreviewCanvasRef.current;
    if (flipCanvas) {
      flipCanvas.width = totalCols * PREVIEW_PIXEL_SIZE;
      flipCanvas.height = GRID_HEIGHT * PREVIEW_PIXEL_SIZE;
      const fCtx = flipCanvas.getContext("2d");
      fCtx.imageSmoothingEnabled = false;
      fCtx.clearRect(0, 0, flipCanvas.width, flipCanvas.height);
      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        for (let col = 0; col < totalCols; col += 1) {
          const color = assembled[row][col];
          if (!color) continue;
          fCtx.fillStyle = color;
          fCtx.fillRect((totalCols - 1 - col) * PREVIEW_PIXEL_SIZE, row * PREVIEW_PIXEL_SIZE, PREVIEW_PIXEL_SIZE, PREVIEW_PIXEL_SIZE);
        }
      }
    }
  }, [pixels, flipRtl]);

  useEffect(() => {
    if (submitStatus === "success") {
      return;
    }

    let cancelled = false;

    function tryRender() {
      if (cancelled || !turnstileContainerRef.current || turnstileWidgetIdRef.current) {
        return;
      }
      if (!window.turnstile) {
        requestAnimationFrame(tryRender);
        return;
      }
      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        callback: setCaptchaToken,
        "expired-callback": () => setCaptchaToken(""),
      });
    }

    tryRender();

    return () => {
      cancelled = true;
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [submitStatus === "success"]);

  useEffect(() => {
    const endDrawing = () => {
      drawingRef.current = false;
    };

    window.addEventListener("pointerup", endDrawing);
    return () => window.removeEventListener("pointerup", endDrawing);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        undoLastChange();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoLastChange]);

  useEffect(() => {
    if (!showColorPicker) {
      return;
    }

    function commitAndClose() {
      addColorToPalette(draftColorRef.current);
      setShowColorPicker(false);
    }

    function handlePointerDown(event) {
      const panelEl = colorPanelRef.current;
      const addEl = addSwatchRef.current;
      const target = event.target;
      if (panelEl?.contains(target) || addEl?.contains(target)) {
        return;
      }
      commitAndClose();
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        commitAndClose();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showColorPicker]);

  useEffect(() => {
    if (!pendingDeleteColor) {
      return;
    }

    function handleDismissTrash(event) {
      if (event.button === 2) {
        return;
      }
      if (event.target.closest(".swatch-delete")) {
        return;
      }
      setPendingDeleteColor(null);
    }

    window.addEventListener("pointerdown", handleDismissTrash);
    return () => window.removeEventListener("pointerdown", handleDismissTrash);
  }, [pendingDeleteColor]);

  useEffect(() => {
    let cancelled = false;
    const { r, g, b } = hexToRgb(selectedToolColor);
    const image = new Image();

    image.onload = () => {
      if (cancelled) {
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setTintedBucketIcon(bucketIcon);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const pr = data[i];
        const pg = data[i + 1];
        const pb = data[i + 2];
        const pa = data[i + 3];

        if (pa === 0) {
          continue;
        }

        const isNearWhite = pr > 235 && pg > 235 && pb > 235;
        if (isNearWhite) {
          data[i + 3] = 0;
          continue;
        }

        const avg = (pr + pg + pb) / 3;
        const darkness = 1 - avg / 255;
        const alphaScale = Math.max(0.35, darkness);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.round(pa * alphaScale);
      }

      ctx.putImageData(imageData, 0, 0);
      setTintedBucketIcon(canvas.toDataURL("image/png"));
    };

    image.onerror = () => {
      if (!cancelled) {
        setTintedBucketIcon(bucketIcon);
      }
    };

    image.src = bucketIcon;

    return () => {
      cancelled = true;
    };
  }, [selectedToolColor]);

  function paintCell(event) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    const col = Math.floor(x / PIXEL_SIZE);
    const row = Math.floor(y / PIXEL_SIZE);

    if (col < 0 || col >= GRID_WIDTH || row < 0 || row >= GRID_HEIGHT) {
      return;
    }

    if (!currentColor) {
      return;
    }

    setPixels((previous) => {
      const next = clonePixels(previous);
      next[row][col] = currentColor === TRANSPARENT_COLOR ? null : currentColor;
      return next;
    });
  }

  function fillAtCell(event) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    const startCol = Math.floor(x / PIXEL_SIZE);
    const startRow = Math.floor(y / PIXEL_SIZE);

    if (startCol < 0 || startCol >= GRID_WIDTH || startRow < 0 || startRow >= GRID_HEIGHT) {
      return;
    }

    const replacementColor = currentColor === TRANSPARENT_COLOR ? null : currentColor;

    setPixels((previous) => {
      const next = clonePixels(previous);
      const targetColor = previous[startRow][startCol];

      if (targetColor === replacementColor) {
        return previous;
      }

      const stack = [[startRow, startCol]];
      while (stack.length > 0) {
        const [row, col] = stack.pop();
        if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) {
          continue;
        }
        if (next[row][col] !== targetColor) {
          continue;
        }

        next[row][col] = replacementColor;
        stack.push([row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]);
      }

      return next;
    });
  }

  function pushUndoSnapshot() {
    setUndoStack((previous) => [...previous, clonePixels(pixels)].slice(-120));
  }

  function handlePointerDown(event) {
    pushUndoSnapshot();
    if (currentTool === "fill") {
      fillAtCell(event);
      drawingRef.current = false;
      return;
    }
    drawingRef.current = true;
    paintCell(event);
  }

  function handlePointerMove(event) {
    if (!drawingRef.current) {
      return;
    }
    paintCell(event);
  }

  function clearCanvas() {
    pushUndoSnapshot();
    setPixels(makeEmptyPixels());
  }

  function undoLastChange() {
    if (undoStack.length === 0) return;
    const restored = undoStack[undoStack.length - 1];
    setPixels(clonePixels(restored));
    setUndoStack((prev) => prev.slice(0, -1));
  }

  function cycleSampleTrain() {
    pushUndoSnapshot();
    const next = (sampleIndexRef.current + 1) % samples.length;
    sampleIndexRef.current = next;
    setPixels(clonePixels(samples[next].pixels));
  }

  function getBirthdayString() {
    return `${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;
  }

  function getPngDataUrl() {
    let left = GRID_WIDTH;
    let right = -1;
    for (let col = 0; col < GRID_WIDTH; col += 1) {
      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        if (pixels[row][col] !== null) {
          if (col < left) left = col;
          if (col > right) right = col;
        }
      }
    }

    if (right === -1) {
      left = 0;
      right = GRID_WIDTH - 1;
    }

    const trimmedWidth = right - left + 1;
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = trimmedWidth;
    offscreenCanvas.height = GRID_HEIGHT;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) {
      return "";
    }

    offscreenCtx.imageSmoothingEnabled = false;
    offscreenCtx.clearRect(0, 0, trimmedWidth, GRID_HEIGHT);

    for (let row = 0; row < GRID_HEIGHT; row += 1) {
      for (let col = left; col <= right; col += 1) {
        const color = pixels[row][col];
        if (!color) {
          continue;
        }
        offscreenCtx.fillStyle = color;
        offscreenCtx.fillRect(col - left, row, 1, 1);
      }
    }

    return offscreenCanvas.toDataURL("image/png");
  }

  function getAssembledPngDataUrl() {
    let left = GRID_WIDTH, right = -1;
    for (let col = 0; col < GRID_WIDTH; col += 1) {
      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        if (pixels[row][col] !== null) {
          if (col < left) left = col;
          if (col > right) right = col;
        }
      }
    }
    if (right === -1) { left = 0; right = GRID_WIDTH - 1; }

    const W = right - left + 1;
    const carCount = W < 15 ? 5 : 3;
    const totalCols = carCount * W + (carCount - 1);
    const offscreen = document.createElement("canvas");
    offscreen.width = totalCols;
    offscreen.height = GRID_HEIGHT;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return "";
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, totalCols, GRID_HEIGHT);

    const assembled = Array.from({ length: GRID_HEIGHT }, () => new Array(totalCols).fill(null));
    for (let carIdx = 0; carIdx < carCount; carIdx += 1) {
      const xOffset = carIdx * (W + 1);
      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        for (let col = left; col <= right; col += 1) {
          assembled[row][xOffset + (col - left)] = pixels[row][col];
        }
      }
    }
    const linkPositions = Array.from({ length: carCount - 1 }, (_, i) => (i + 1) * W + i);
    for (const linkX of linkPositions) {
      assembled[LINK_ROW][linkX] = LINK_COLOR;
      for (let col = linkX - 1; col >= 0 && assembled[LINK_ROW][col] === null; col -= 1) {
        assembled[LINK_ROW][col] = LINK_COLOR;
      }
      for (let col = linkX + 1; col < totalCols && assembled[LINK_ROW][col] === null; col += 1) {
        assembled[LINK_ROW][col] = LINK_COLOR;
      }
    }
    for (let row = 0; row < GRID_HEIGHT; row += 1) {
      for (let col = 0; col < totalCols; col += 1) {
        const color = assembled[row][col];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(col, row, 1, 1);
      }
    }
    return offscreen.toDataURL("image/png");
  }

  function downloadPng() {
    const dataUrl = getAssembledPngDataUrl();
    if (!dataUrl) return;
    const blob = dataUrlToBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "train-pixels.png";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    const payload = {
      name: name.trim(),
      birthday: getBirthdayString(),
      pngData: getPngDataUrl(),
      flip_rtl: flipRtl,
      captchaToken
    };

    setSubmitStatus("loading");
    setSubmitError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || `Server error (${response.status})`);
      }

      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setCaptchaToken("");
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    }
  }

  function handleDesignAnother() {
    setPixels(makeEmptyPixels());
    setName("");
    setUndoStack([]);
    sampleIndexRef.current = -1;
    setSubmitStatus(null);
    setSubmitError("");
    setFlipRtl(true);
  }

  function normalizeColor(hexColor) {
    return String(hexColor || "").toUpperCase();
  }

  function hexToRgb(hexColor) {
    const safe = normalizeColor(hexColor).replace("#", "");
    const normalized = safe.length === 3 ? safe.split("").map((c) => `${c}${c}`).join("") : safe;
    const value = normalized.padEnd(6, "0").slice(0, 6);
    return {
      r: Number.parseInt(value.slice(0, 2), 16) || 0,
      g: Number.parseInt(value.slice(2, 4), 16) || 0,
      b: Number.parseInt(value.slice(4, 6), 16) || 0
    };
  }

  function rgbToHex(r, g, b) {
    const clamp = (x) => Math.max(0, Math.min(255, x));
    return `#${[clamp(r), clamp(g), clamp(b)]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`;
  }

  function addColorToPalette(hexColor) {
    const nextColor = normalizeColor(hexColor);
    if (!nextColor) {
      return;
    }

    setPalette((previous) => {
      if (previous.includes(nextColor)) {
        return previous;
      }
      return [...previous, nextColor];
    });
    setCurrentColor(nextColor);
    setPickerColor(nextColor);
    setPendingDeleteColor(null);
  }

  function handlePaletteSelect(color) {
    setCurrentColor(color);
    setPickerColor(color);
    setPendingDeleteColor(null);
  }

  function handleSwatchContextMenu(event, color) {
    event.preventDefault();
    setPendingDeleteColor((previous) => (previous === color ? null : color));
  }

  function deleteColorFromPalette(colorToDelete) {
    setPalette((previous) => {
      const next = previous.filter((color) => color !== colorToDelete);
      if (currentColor === colorToDelete) {
        if (next.length > 0) {
          setCurrentColor(next[0]);
          setPickerColor(next[0]);
        } else {
          setCurrentColor(TRANSPARENT_COLOR);
        }
      }
      return next;
    });
    setPendingDeleteColor(null);
  }

  function openColorPicker() {
    setPendingDeleteColor(null);
    setDraftColor(pickerColor || currentColor || DEFAULT_PALETTE[0]);
    setShowColorPicker(true);
  }

const draftRgb = useMemo(() => hexToRgb(draftColor), [draftColor]);

  return (
    <main className="page-shell">
      <section className="hero">
        <h1>Design Your Pixel Train</h1>
        <p className="subtitle">
          Create a 5 x 26 train sprite and it can show up on Abby&apos;s train display, with extra odds during your
          birthday week.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="/?gallery" className="gallery-nav-btn">Gallery</a>
          <a href="/?display" className="gallery-nav-btn">Live display</a>
        </div>
      </section>

      <section className="card">
        {submitStatus === "success" ? (
          <div className="submit-success submit-success--full">
            <p>Your train has been successfully submitted!</p>
            <button type="button" className="submit-btn make-another-btn" onClick={handleDesignAnother}>
              Make another train
            </button>
          </div>
        ) : (
        <form className="submission-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label className="field" htmlFor="name">
              <span>Name</span>
              <input
                id="name"
                name="name"
                type="text"
                maxLength={60}
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <div className="field birthday-fieldset">
              <span>Birthday</span>
              <div className="birthday-row">
                <label className="select-wrap">
                  <span className="sr-only">Month</span>
                  <select
                    id="birth-month"
                    name="birthMonth"
                    value={birthMonth}
                    onChange={(event) => setBirthMonth(event.target.value)}
                    required
                  >
                    {MONTHS.map((month) => (
                      <option value={month.value} key={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="select-wrap">
                  <span className="sr-only">Day</span>
                  <select
                    id="birth-day"
                    name="birthDay"
                    value={birthDay}
                    onChange={(event) => setBirthDay(event.target.value)}
                    required
                  >
                    {dayOptions.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          <section className="designer">
            <div className="toolbar">
              <div className="tool-group">
                <button
                  type="button"
                  className={`tool-btn ${currentTool === "paint" ? "active" : ""}`}
                  onClick={() => setCurrentTool("paint")}
                  style={{ color: selectedToolColor }}
                  aria-label="Paint"
                  title="Paint"
                >
                  <svg className="tool-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M14.3 3.2L20.8 9.7L10 20.5L3.2 20.8L3.5 14L14.3 3.2ZM14.3 6L6.3 14L6.2 17.8L10 17.7L18 9.7L14.3 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`tool-btn ${currentTool === "fill" ? "active" : ""}`}
                  onClick={() => setCurrentTool("fill")}
                  style={{ color: selectedToolColor }}
                  aria-label="Fill"
                  title="Fill"
                >
                  <img src={tintedBucketIcon} className="tool-icon fill-bucket-icon" alt="" aria-hidden="true" />
                </button>
              </div>

              <div className="tool-group color-tools">
                <div className="palette-row">
                  <button
                    type="button"
                    className={`swatch transparent-swatch ${currentColor === TRANSPARENT_COLOR ? "selected" : ""}`}
                    title="Transparent pixel"
                    aria-label="Transparent pixel"
                    onClick={() => handlePaletteSelect(TRANSPARENT_COLOR)}
                  />
                  {palette.map((color) => (
                    <div className="swatch-slot" key={color}>
                      <button
                        type="button"
                        className={`swatch ${currentColor === color ? "selected" : ""}`}
                        title={`${color} (right click to remove)`}
                        style={{ "--swatch": color }}
                        onClick={() => handlePaletteSelect(color)}
                        onContextMenu={(event) => handleSwatchContextMenu(event, color)}
                      />
                      {pendingDeleteColor === color && (
                        <button
                          type="button"
                          className="swatch-delete"
                          aria-label={`Remove ${color} from palette`}
                          title="Delete from palette"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteColorFromPalette(color);
                          }}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M9 3H15L16 5H21V7H3V5H8L9 3ZM6 9H18L17 21H7L6 9ZM10 11V19H12V11H10ZM13 11V19H15V11H13Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    ref={addSwatchRef}
                    type="button"
                    className="swatch add-swatch"
                    title="Add a new color"
                    aria-label="Add a new color"
                    onClick={openColorPicker}
                  />
                </div>
                {showColorPicker && (
                  <div ref={colorPanelRef} className="color-picker-panel" role="dialog" aria-label="Choose a color">
                    <div className="picker-row">
                      <span className="picker-preview" style={{ "--swatch": draftColor }} />
                      <span className="picker-hex">{draftColor}</span>
                    </div>
                    <label className="picker-field">
                      <span>Hex</span>
                      <input
                        type="text"
                        maxLength={7}
                        value={draftColor}
                        onChange={(event) => {
                          const raw = event.target.value.toUpperCase();
                          const withHash = raw.startsWith("#") ? raw : `#${raw}`;
                          if (/^#[0-9A-F]{0,6}$/.test(withHash)) {
                            setDraftColor(withHash);
                          }
                        }}
                        onBlur={() => {
                          const color = rgbToHex(draftRgb.r, draftRgb.g, draftRgb.b);
                          setDraftColor(color);
                          setCurrentColor(color);
                        }}
                      />
                    </label>
                    <label className="picker-field">
                      <span>Spectrum</span>
                      <input
                        type="color"
                        className="picker-spectrum"
                        value={rgbToHex(draftRgb.r, draftRgb.g, draftRgb.b)}
                        onChange={(event) => {
                          const color = normalizeColor(event.target.value);
                          setDraftColor(color);
                          setCurrentColor(color);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="tool-group">
                <button
                  id="undo-canvas"
                  type="button"
                  className="subtle-btn icon-only-btn"
                  onClick={undoLastChange}
                  disabled={undoStack.length === 0}
                  aria-label="Undo"
                  title="Undo"
                >
                  <svg className="tool-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M11 5L4 12L11 19V14C15.4 14 18.4 15.4 21 19C20 13 17 9 11 9V5Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button id="inspire-sample" type="button" className="subtle-btn" onClick={cycleSampleTrain}>
                  Inspire Me
                </button>
                <button id="clear-canvas" type="button" className="subtle-btn" onClick={clearCanvas}>
                  Clear
                </button>
              </div>
            </div>

            <div className="canvas-wrap">
              <div className="canvas-with-labels">
                <div className="direction-label direction-back">← back</div>
                <canvas
                  ref={canvasRef}
                  id="pixel-canvas"
                  width={780}
                  height={150}
                  aria-label="Train pixel canvas"
                  role="img"
                  style={{ cursor: currentTool === "fill" ? CURSOR_FILL : CURSOR_PAINT }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                />
                <div className="direction-label direction-front">front →</div>
              </div>
            </div>

            <div className="preview-wrap" style={{ display: hasPixels ? undefined : "none" }}>
              <span className="preview-label">{previewCarCount}-car preview</span>
              <canvas
                ref={previewCanvasRef}
                className="preview-canvas"
                aria-label="multi-car train preview"
                role="img"
              />
            </div>
          </section>

          <div className="flip-rtl-row">
            <div className="flip-rtl-control">
              <label className="flip-toggle">
                <input
                  type="checkbox"
                  checked={flipRtl}
                  onChange={(e) => setFlipRtl(e.target.checked)}
                />
                <span className="flip-toggle-slider" />
              </label>
              <span className="flip-rtl-label">Mirror when moving left</span>
            </div>
            <span className="flip-rtl-hint">Keep on for animals, turn off for text</span>
            <canvas
              ref={flipPreviewCanvasRef}
              className="flip-preview-canvas"
              style={{ display: hasPixels && flipRtl ? undefined : "none" }}
              aria-label="Flipped multi-car preview"
              role="img"
            />
          </div>

          <div ref={turnstileContainerRef} className="captcha-row" />

          <div className="submit-row">
            <button id="download-png" type="button" className="subtle-btn" onClick={downloadPng}>
              Download PNG
            </button>
            <button type="submit" className="submit-btn" disabled={submitStatus === "loading" || !captchaToken}>
              {submitStatus === "loading" ? "Submitting…" : "Submit"}
            </button>
          </div>
          {submitStatus === "error" && (
            <p className="submit-error">{submitError}</p>
          )}
        </form>
        )}
      </section>
    </main>
  );
}






