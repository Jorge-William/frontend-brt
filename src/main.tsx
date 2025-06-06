import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { configure } from "mobx";

// Habilita as dev tools apenas em desenvolvimento
if (process.env.NODE_ENV === "development") {
  configure({
    computedRequiresReaction: false,
    reactionRequiresObservable: false,
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
