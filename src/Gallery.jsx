import { useState, useEffect, useRef } from "react";

const LINK_ROW = 3;
const LINK_COLOR = "#464646";
const CARD_SCALE = 8;

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatBirthday(mmdd) {
  const [month, day] = mmdd.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}`;
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

    const totalCols = 3 * w + 2;
    const assembled = Array.from({ length: h }, () => new Array(totalCols).fill(null));

    for (let carIdx = 0; carIdx < 3; carIdx += 1) {
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

    for (const linkX of [w, 2 * w + 1]) {
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
  const [editBirthday, setEditBirthday] = useState(submission.birthday);
  const [busy, setBusy] = useState(false);
  const [queued, setQueued] = useState(false);
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
        body: JSON.stringify({ name: editName, birthday: editBirthday }),
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
      await fetch(`${import.meta.env.VITE_SERVER_URL}/submissions/${submission.id}`, {
        method: "DELETE",
        headers: { "X-API-Key": apiKey },
      });
      onDelete(submission.id);
    } catch {
      setError("Delete failed");
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
      if (!res.ok) throw new Error("Queue failed");
      setQueued(true);
      setTimeout(() => setQueued(false), 4000);
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
            <input
              className="train-edit-input"
              value={editBirthday}
              onChange={(e) => setEditBirthday(e.target.value)}
              placeholder="MM-DD"
              maxLength={5}
            />
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
            {error && <span className="train-card-error">{error}</span>}
            {isAdmin && (
              <div className="train-card-actions">
                <button className="subtle-btn" onClick={() => setEditing(true)} disabled={busy}>Edit</button>
                <button className="subtle-btn show-now-btn" onClick={handleQueue} disabled={busy}>
                  {queued ? "Queued!" : "Show Now"}
                </button>
                <button className="subtle-btn delete-btn" onClick={handleDelete} disabled={busy}>Delete</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Gallery({ isAdmin }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiKey = import.meta.env.VITE_PI_API_KEY || "";

  function fetchSubmissions() {
    setLoading(true);
    fetch(`${import.meta.env.VITE_SERVER_URL}/submissions`)
      .then((r) => r.json())
      .then((data) => { setSubmissions(data); setLoading(false); })
      .catch(() => { setError("Failed to load trains."); setLoading(false); });
  }

  useEffect(() => { fetchSubmissions(); }, []);

  function handleDelete(id) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <h1>The Trains</h1>
        <p className="subtitle">Every train that&apos;s been submitted to the display.</p>
        <a href="/" className="gallery-nav-btn">← Design your own</a>
      </section>


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
        </div>
      </section>
    </main>
  );
}
