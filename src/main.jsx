import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Gallery from "./Gallery";
import PixooDisplay from "./PixooDisplay";
import "./styles.css";

const searchParams = new URLSearchParams(window.location.search);
const isGallery = searchParams.has("gallery") || searchParams.get("admin") === "true";
const isAdmin = searchParams.get("admin") === "true";
const isDisplay = searchParams.has("display");

function DisplayPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <h1>Live Display</h1>
        <p className="subtitle">Real-time simulation of what&apos;s showing on the pixel display.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="/" className="gallery-nav-btn">← Designer</a>
          <a href="/?gallery" className="gallery-nav-btn">Gallery</a>
        </div>
      </section>
      <section className="card" style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <PixooDisplay />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isDisplay ? <DisplayPage /> : isGallery ? <Gallery isAdmin={isAdmin} /> : <App />}
  </React.StrictMode>
);
