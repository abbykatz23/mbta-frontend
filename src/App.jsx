import { useEffect, useMemo, useRef, useState } from "react";
import bucketIcon from "./static/bucket.png";

const GRID_WIDTH = 26;
const GRID_HEIGHT = 5;
const PIXEL_SIZE = 30;
const TRANSPARENT_COLOR = "__TRANSPARENT__";

const MONTHS = [
  { value: 1, label: "January", days: 31 },
  { value: 2, label: "February", days: 29 },
  { value: 3, label: "March", days: 31 },
  { value: 4, label: "April", days: 30 },
  { value: 5, label: "May", days: 31 },
  { value: 6, label: "June", days: 30 },
  { value: 7, label: "July", days: 31 },
  { value: 8, label: "August", days: 31 },
  { value: 9, label: "September", days: 30 },
  { value: 10, label: "October", days: 31 },
  { value: 11, label: "November", days: 30 },
  { value: 12, label: "December", days: 31 }
];

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
  const drawingRef = useRef(false);
  const colorPanelRef = useRef(null);
  const addSwatchRef = useRef(null);

  const now = useMemo(() => new Date(), []);
  const [name, setName] = useState("");
  const [birthMonth, setBirthMonth] = useState(String(now.getMonth() + 1));
  const [birthDay, setBirthDay] = useState(String(now.getDate()));
  const [currentTool, setCurrentTool] = useState("paint");
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [currentColor, setCurrentColor] = useState(DEFAULT_PALETTE[0]);
  const [pickerColor, setPickerColor] = useState(DEFAULT_PALETTE[0]);
  const [draftColor, setDraftColor] = useState(DEFAULT_PALETTE[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingDeleteColor, setPendingDeleteColor] = useState(null);
  const [pixels, setPixels] = useState(makeEmptyPixels);
  const [sampleIndex, setSampleIndex] = useState(-1);
  const [undoStack, setUndoStack] = useState([]);
  const [tintedBucketIcon, setTintedBucketIcon] = useState(bucketIcon);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "loading" | "success" | "error"
  const [submitError, setSubmitError] = useState("");
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

  useEffect(() => {
    const endDrawing = () => {
      drawingRef.current = false;
    };

    window.addEventListener("pointerup", endDrawing);
    return () => window.removeEventListener("pointerup", endDrawing);
  }, []);

  useEffect(() => {
    if (!showColorPicker) {
      return;
    }

    function handlePointerDown(event) {
      const panelEl = colorPanelRef.current;
      const addEl = addSwatchRef.current;
      const target = event.target;
      if (panelEl?.contains(target) || addEl?.contains(target)) {
        return;
      }
      cancelAddColor();
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        cancelAddColor();
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

    if (currentTool === "paint" && !currentColor) {
      return;
    }

    setPixels((previous) => {
      const next = clonePixels(previous);
      next[row][col] = currentTool === "erase" || currentColor === TRANSPARENT_COLOR ? null : currentColor;
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

    const replacementColor = currentTool === "erase" || currentColor === TRANSPARENT_COLOR ? null : currentColor;

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
    setUndoStack((previous) => {
      if (previous.length === 0) {
        return previous;
      }
      const restored = previous[previous.length - 1];
      setPixels(clonePixels(restored));
      return previous.slice(0, -1);
    });
  }

  function cycleSampleTrain() {
    pushUndoSnapshot();
    setSampleIndex((previous) => {
      const next = (previous + 1) % samples.length;
      setPixels(clonePixels(samples[next].pixels));
      return next;
    });
  }

  function getBirthdayString() {
    return `${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;
  }

  function getPngDataUrl() {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = GRID_WIDTH;
    offscreenCanvas.height = GRID_HEIGHT;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) {
      return "";
    }

    offscreenCtx.imageSmoothingEnabled = false;
    offscreenCtx.clearRect(0, 0, GRID_WIDTH, GRID_HEIGHT);

    for (let row = 0; row < GRID_HEIGHT; row += 1) {
      for (let col = 0; col < GRID_WIDTH; col += 1) {
        const color = pixels[row][col];
        if (!color) {
          continue;
        }
        offscreenCtx.fillStyle = color;
        offscreenCtx.fillRect(col, row, 1, 1);
      }
    }

    return offscreenCanvas.toDataURL("image/png");
  }

  function downloadPng() {
    const dataUrl = getPngDataUrl();
    if (!dataUrl) {
      return;
    }

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
      pngData: getPngDataUrl()
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
    }
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
    if (currentTool === "erase") {
      setCurrentTool("paint");
    }
    setPendingDeleteColor(null);
  }

  function handlePaletteSelect(color) {
    setCurrentColor(color);
    setPickerColor(color);
    if (currentTool === "erase") {
      setCurrentTool("paint");
    }
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

  function confirmAddColor() {
    addColorToPalette(draftColor);
    setShowColorPicker(false);
  }

  function cancelAddColor() {
    setShowColorPicker(false);
  }

  const draftRgb = useMemo(() => hexToRgb(draftColor), [draftColor]);

  return (
    <main className="page-shell">
      <section className="hero">
        <h1>Design Your Pixel Train</h1>
        <p className="subtitle">
          Create a 5 x 26 train sprite and it can show up on Abby&apos;s train display, with extra odds on your
          birthday.
        </p>
      </section>

      <section className="card">
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
                        onBlur={() => setDraftColor(rgbToHex(draftRgb.r, draftRgb.g, draftRgb.b))}
                      />
                    </label>
                    <label className="picker-field">
                      <span>Spectrum</span>
                      <input
                        type="color"
                        className="picker-spectrum"
                        value={rgbToHex(draftRgb.r, draftRgb.g, draftRgb.b)}
                        onChange={(event) => setDraftColor(normalizeColor(event.target.value))}
                      />
                    </label>
                    <div className="picker-actions">
                      <button type="button" className="subtle-btn picker-add-btn" onClick={confirmAddColor}>
                        Select
                      </button>
                    </div>
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
              <canvas
                ref={canvasRef}
                id="pixel-canvas"
                width={780}
                height={150}
                aria-label="Train pixel canvas"
                role="img"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
              />
            </div>
          </section>

          <div className="submit-row">
            <button id="download-png" type="button" className="subtle-btn" onClick={downloadPng}>
              Download PNG
            </button>
            <button type="submit" className="submit-btn" disabled={submitStatus === "loading"}>
              {submitStatus === "loading" ? "Submitting…" : "Submit"}
            </button>
          </div>
          {submitStatus === "success" && (
            <p className="submit-success">Submitted! Your train is pending review.</p>
          )}
          {submitStatus === "error" && (
            <p className="submit-error">{submitError}</p>
          )}
        </form>
      </section>
    </main>
  );
}






