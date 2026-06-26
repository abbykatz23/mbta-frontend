import { useState, useEffect, useRef, useMemo } from "react";
import { MONTH_NAMES, MONTHS } from "./constants";

const LINK_ROW = 3;
const LINK_COLOR = "#464646";
const CARD_SCALE = 8;

function formatBirthday(mmdd) {
  if (!mmdd) return "";
  const [month, day] = mmdd.split("-").map(Number);
  const monthName = MONTH_NAMES[month - 1] ?? "?";
  return `${monthName} ${day}`;
}

function assembleAndDraw(canvas, pngBase64) {
  const img = new Image();
  img.onload = () => {
    const w = img.width, h = img.height;
    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;
    const tempCtx = temp.getContext("2d");
    tempCtx.drawImage(img, 0, 0);
    const { data } = tempCtx.getImageData(0, 0, w, h);

    const carCount = w < 10 ? 5 : 3;
    const totalCols = carCount * w + (carCount - 1);
    const assembled = Array.from({ length: h }, () => new Array(totalCols).fill(null));

    for (let carIdx = 0; carIdx < carCount; carIdx += 1) {
      const xOffset = carIdx * (w + 1);
      for (let row = 0; row < h; row += 1) {
        for (let col = 0; col < w; col += 1) {
          const i = (row * w + col) * 4;
          if (data[i + 3] >= 10) {
            assembled[row][xOffset + col] = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
          }
        }
      }
    }

    const linkPositions = Array.from({ length: carCount - 1 }, (_, i) => (i + 1) * w + i);
    for (const linkX of linkPositions) {
      assembled[LINK_ROW][linkX] = LINK_COLOR;
      for (let col = linkX - 1; col >= 0 && assembled[LINK_ROW][col] === null; col -= 1) {
        assembled[LINK_ROW][col] = LINK_COLOR;
      }
      for (let col = linkX + 1; col < totalCols && assembled[LINK_ROW][col] === null; col += 1) {
        assembled[LINK_ROW][col] = LINK_COLOR;
      }
    }

    canvas.width = totalCols * CARD_SCALE;
    canvas.height = h * CARD_SCALE;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < h; row += 1) {
      for (let col = 0; col < totalCols; col += 1) {
        const color = assembled[row][col];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(col * CARD_SCALE, row * CARD_SCALE, CARD_SCALE, CARD_SCALE);
      }
    }
  };
  img.src = `data:image/png;base64,${pngBase64}`;
}

function TrainCard({ submission, isAdmin, apiKey, onDelete, onRefresh }) {
  const canvasRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(submission.name);
  const [editMonth, setEditMonth] = useState(String(Number(submission.birthday.split("-")[0])));
  const [editDay, setEditDay] = useState(String(Number(submission.birthday.split("-")[1])));
  const [editFlipRtl, setEditFlipRtl] = useState(submission.flip_rtl !== false);
  const [busy, setBusy] = useState(false);

  const editDayOptions = useMemo(() => {
    const monthMeta = MONTHS.find((m) => String(m.value) === editMonth) || MONTHS[0];
    return Array.from({ length: monthMeta.days }, (_, i) => String(i + 1));
  }, [editMonth]);

  useEffect(() => {
    if (!editDayOptions.includes(editDay)) {
      setEditDay(editDayOptions[editDayOptions.length - 1]);
    }
  }, [editDay, editDayOptions]);
  const [queuedMsg, setQueuedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (canvasRef.current) assembleAndDraw(canvasRef.current, submission.png_base64);
  }, [submission.png_base64]);

  async function handleSave() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ name: editName, birthday: `${String(editMonth).padStart(2, "0")}-${String(editDay).padStart(2, "0")}`, flip_rtl: editFlipRtl }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Update failed");
      }
      setEditing(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${submission.name}'s train?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/submissions/${submission.id}`, {
        method: "DELETE",
        headers: { "X-API-Key": apiKey },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Delete failed");
      }
      setBusy(false);
      onDelete(submission.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function handleQueue() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/queue/${submission.id}`, {
        method: "POST",
        headers: { "X-API-Key": apiKey },
      });
      if (!res.ok) throw new Error(`Queue failed (${res.status})`);
      setQueuedMsg("Queued! It'll show on the next train animation.");
      setTimeout(() => setQueuedMsg(""), 6000);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="train-card">
      <div className="train-card-canvas-wrap">
        <canvas ref={canvasRef} className="train-card-canvas" />
      </div>
      <div className="train-card-body">
        {editing ? (
          <div className="train-card-edit">
            <input
              className="train-edit-input"
              value={editName}
              maxLength={60}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
            />
            <div className="birthday-row">
              <label className="select-wrap">
                <span className="sr-only">Month</span>
                <select value={editMonth} onChange={(e) => setEditMonth(e.target.value)}>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </label>
              <label className="select-wrap">
                <span className="sr-only">Day</span>
                <select value={editDay} onChange={(e) => setEditDay(e.target.value)}>
                  {editDayOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flip-rtl-label">
              <input
                type="checkbox"
                checked={editFlipRtl}
                onChange={(e) => setEditFlipRtl(e.target.checked)}
              />
              <span>Mirror when moving left</span>
            </label>
            {error && <span className="train-card-error">{error}</span>}
            <div className="train-card-actions">
              <button className="subtle-btn" onClick={handleSave} disabled={busy}>Save</button>
              <button className="subtle-btn" onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <span className="train-card-name">{submission.name}</span>
            <span className="train-card-birthday">{formatBirthday(submission.birthday)}</span>
            {submission.flip_rtl === false && <span className="train-card-no-mirror">no mirror</span>}
            {error && <span className="train-card-error">{error}</span>}
            {queuedMsg && <span className="train-card-queued">{queuedMsg}</span>}
            {isAdmin && (
              <div className="train-card-actions">
                <button className="subtle-btn" onClick={() => setEditing(true)} disabled={busy || !apiKey}>Edit</button>
                <button className="subtle-btn show-now-btn" onClick={handleQueue} disabled={busy || !apiKey}>
                  Show Now
                </button>
                <button className="subtle-btn delete-btn" onClick={handleDelete} disabled={busy || !apiKey}>Delete</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function SpecialTrainCard({ train, isAdmin, apiKey }) {
  const canvasRef = useRef(null);
  const [queuedMsg, setQueuedMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [flipRtl, setFlipRtl] = useState(Boolean(train.flip_rtl));

  const currentMonth = new Date().getMonth() + 1;
  const isCurrentMonth = train.birthday_month === currentMonth;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * CARD_SCALE;
      canvas.height = img.height * CARD_SCALE;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = `/month_trains/${train.name}.png`;
  }, [train.name]);

  async function handleQueue() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/queue-special/${train.name}`, {
        method: "POST",
        headers: { "X-API-Key": apiKey },
      });
      if (!res.ok) throw new Error(`Queue failed (${res.status})`);
      setQueuedMsg("Queued! It'll show on the next train animation.");
      setTimeout(() => setQueuedMsg(""), 6000);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  async function handleFlipToggle(e) {
    const next = e.target.checked;
    setFlipRtl(next);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/special-trains/${train.name}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ flip_rtl: next }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
    } catch (err) {
      setError(err.message);
      setFlipRtl(!next);
    }
  }

  const label = train.birthday_month
    ? MONTH_LABELS[train.birthday_month - 1]
    : train.name.charAt(0).toUpperCase() + train.name.slice(1);

  return (
    <div className={`train-card month-train-card${isCurrentMonth ? " month-train-card--active" : ""}`}>
      <div className="train-card-canvas-wrap">
        <canvas ref={canvasRef} className="train-card-canvas" />
      </div>
      <div className="train-card-body">
        <span className="train-card-name">
          {label}
          {isCurrentMonth && <span className="month-train-active-badge">active now</span>}
        </span>
        {train.birthday && <span className="train-card-birthday">{formatBirthday(train.birthday)}</span>}
        {error && <span className="train-card-error">{error}</span>}
        {queuedMsg && <span className="train-card-queued">{queuedMsg}</span>}
        {isAdmin && (
          <>
            <label className="flip-rtl-label">
              <input type="checkbox" checked={flipRtl} onChange={handleFlipToggle} disabled={!apiKey} />
              <span>Mirror when moving left</span>
            </label>
            <div className="train-card-actions">
              <button className="subtle-btn show-now-btn" onClick={handleQueue} disabled={busy || !apiKey}>
                Show Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Gallery({ isAdmin }) {
  const [submissions, setSubmissions] = useState([]);
  const [specialTrains, setSpecialTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("adminKey") || "");

  function fetchSubmissions() {
    setLoading(true);
    fetch(`${import.meta.env.VITE_SERVER_URL}/submissions`)
      .then((r) => { if (!r.ok) throw new Error(`Server error (${r.status})`); return r.json(); })
      .then((data) => { setSubmissions(data); setLoading(false); })
      .catch(() => { setError("Failed to load trains."); setLoading(false); });
  }

  useEffect(() => { fetchSubmissions(); }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/special-trains`)
      .then((r) => r.json())
      .then((data) => setSpecialTrains(data.sort((a, b) => {
        if (a.birthday_month && b.birthday_month) return a.birthday_month - b.birthday_month;
        if (a.birthday_month) return -1;
        if (b.birthday_month) return 1;
        return a.name.localeCompare(b.name);
      })))
      .catch(() => {});
  }, []);

  const monthTrains = specialTrains.filter((t) => t.birthday_month);
  const otherSpecialTrains = specialTrains.filter((t) => !t.birthday_month);

  function handleDelete(id) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }

  function handleApiKeyChange(e) {
    const val = e.target.value;
    setApiKey(val);
    sessionStorage.setItem("adminKey", val);
  }

  if (isAdmin && !apiKey) {
    return (
      <main className="page-shell">
        <section className="card">
          <label className="field">
            <span>Admin key</span>
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter API key"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              autoFocus
            />
          </label>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <h1>The Trains</h1>
        <p className="subtitle">Every train that&apos;s been submitted to the display.</p>
        <a href="/" className="gallery-nav-btn">← Design your own</a>
      </section>

      {isAdmin && (
        <div className="admin-key-hint">
          Admin mode — <button className="link-btn" onClick={() => { sessionStorage.removeItem("adminKey"); const url = new URL(window.location); url.searchParams.delete("admin"); window.location.href = url; }}>exit admin mode</button>
        </div>
      )}

      <section className="card">
        {loading && <p className="gallery-loading">Loading trains…</p>}
        {error && <p className="submit-error">{error}</p>}
        {!loading && !error && submissions.length === 0 && (
          <p className="gallery-loading">No trains yet.</p>
        )}
        <div className="gallery-grid">
          {submissions.map((s) => (
            <TrainCard
              key={s.id}
              submission={s}
              isAdmin={isAdmin}
              apiKey={apiKey}
              onDelete={handleDelete}
              onRefresh={fetchSubmissions}
            />
          ))}
          {otherSpecialTrains.map((t) => (
            <SpecialTrainCard
              key={t.name}
              train={t}
              isAdmin={isAdmin}
              apiKey={apiKey}
            />
          ))}
        </div>
      </section>

      {monthTrains.length > 0 && (
        <section className="card">
          <p className="month-trains-heading">Month Trains</p>
          <p className="subtitle" style={{ marginBottom: "1rem" }}>Special trains that show up randomly during their month.</p>
          <div className="gallery-grid">
            {monthTrains.map((t) => (
              <SpecialTrainCard
                key={t.name}
                train={t}
                isAdmin={isAdmin}
                apiKey={apiKey}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
