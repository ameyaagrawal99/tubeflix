import React from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_PREFERENCES } from "../core/preferences";
import { buildDemoModel } from "../demo/data";
import { NetflixShell } from "../ui/NetflixShell";
import styles from "../ui/styles.css?inline";

const style = document.createElement("style");
style.textContent = styles;
document.head.appendChild(style);
const params = new URLSearchParams(location.search);
const route = params.get("route") === "watch" ? "watch" : "home";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NetflixShell
      model={buildDemoModel(route)}
      preferences={DEFAULT_PREFERENCES}
      preview
      initialModal={params.get("modal") === "1"}
    />
  </React.StrictMode>
);
