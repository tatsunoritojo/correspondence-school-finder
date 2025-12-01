import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/App";
import "./src/index.css";

// This file serves as a fallback entry point if index.html is bypassed.
// It redirects to the new modular application structure in src/.
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
