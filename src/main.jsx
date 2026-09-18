import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Gallery from "./Gallery";
import PixooDisplay from "./PixooDisplay";
import InfoTooltip from "./InfoTooltip";
import { MONTHS } from "./constants";
import "./styles.css";

const searchParams = new URLSearchParams(window.location.search);
const isGallery = searchParams.has("gallery") || searchParams.get("admin") === "true";
const isAdmin = searchParams.get("admin") === "true";
const isDisplay = searchParams.has("display");

const MONTH_TRAIN_THEMES = [
  "snowflakes",
  "hearts",
  "luck symbols — a ladybug and an evil eye",
  "bunnies",
  "flowers",
  "a pride train",
  "an American flag",
  "boobs",
  "pencils",
  "bats",
  "pilgrims and pumpkins",
  "holiday icons",
];

function getDisplayIntroText(monthName, monthTrainTheme) {
  return (
    "Abby has a physical LED display in her apartment which uses live MBTA data to tell her how many minutes she " +
    "should wait before leaving her apartment to catch each of the train lines exactly on time. When a train is " +
    "currently at the station, a little train animation for the appropriate colored line goes by. 1 in 6 train " +
    `animations that goes by has a chance of being a special monthly train. For ${monthName} it's ${monthTrainTheme}! ` +
    "Also, anyone can upload a pixelated train png, which could show up on the display at any time, with increased " +
    "odds during the submitter's birth month! This page is a live simulation of what's showing on the physical " +
    "display in Abby's apartment in real time."
  );
}

function DisplayPage() {
  const monthIndex = new Date().getMonth();
  const monthName = MONTHS[monthIndex].label;
  const monthTrainTheme = MONTH_TRAIN_THEMES[monthIndex];

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-top">
          <h1>Live Display</h1>
          <InfoTooltip
            text={getDisplayIntroText(monthName, monthTrainTheme)}
            learnMoreUrl="https://github.com/abbykatz23/mbta-display/blob/master/README.md"
          />
        </div>
        <p className="subtitle">Real-time simulation of what&apos;s showing on the pixel display.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="/" className="gallery-nav-btn">Designer</a>
          <a href="/?gallery" className="gallery-nav-btn">Gallery</a>
        </div>
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
