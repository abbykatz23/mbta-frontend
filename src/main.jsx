import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Gallery from "./Gallery";
import "./styles.css";

const searchParams = new URLSearchParams(window.location.search);
const isGallery = searchParams.has("gallery") || searchParams.get("admin") === "true";
const isAdmin = searchParams.get("admin") === "true";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isGallery ? <Gallery isAdmin={isAdmin} /> : <App />}
  </React.StrictMode>
);
