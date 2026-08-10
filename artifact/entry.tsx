/**
 * Entrada do empacotamento do app em página única (Artifact/standalone).
 * `npx esbuild artifact/entry.tsx --bundle ...` — ver artifact/build.mjs.
 */
import { createRoot } from "react-dom/client";
import App from "@/components/App";

createRoot(document.getElementById("root")!).render(<App />);
