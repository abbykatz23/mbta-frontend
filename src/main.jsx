import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Gallery from "./Gallery";
import PixooDisplay from "./PixooDisplay";
import InfoTooltip from "./InfoTooltip";
import NavTabs from "./NavTabs";
import { getMonthlyTrainIntroText } from "./constants";
import "./styles.css";

const searchParams = new URLSearchParams(window.location.search);
const isGallery = searchParams.has("gallery") || searchParams.get("admin") === "true";
const isAdmin = searchParams.get("admin") === "true";
const isDisplay = searchParams.has("display");

function DisplayPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-top">
          <h1>Live Display</h1>
          <InfoTooltip
            text={getMonthlyTrainIntroText(
              "This page is a live simulation of what's showing on the physical display in Abby's apartment in real time."
            )}
            learnMoreUrl="https://github.com/abbykatz23/mbta-display/blob/master/README.md"
          />
        </div>
        <p className="subtitle">Real-time simulation of what&apos;s showing on the pixel display.</p>
        <NavTabs current="display" />
      </section>
      <section className="card display-card" style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
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
