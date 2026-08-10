/**
 * Empacota o calendário em UM arquivo HTML auto-contido (para publicar como
 * Artifact ou abrir localmente): JS do React via esbuild + CSS compilado do
 * build do Next (Tailwind) com as fontes EB Garamond embutidas em data URIs.
 *
 * Uso: node artifact/build.mjs <saida.html>  (rodar após `next build`)
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] ?? join(root, "artifact", "calendario.html");

execSync(
  `npx esbuild artifact/entry.tsx --bundle --minify --format=iife ` +
    `--tsconfig=tsconfig.json --jsx=automatic ` +
    `--define:process.env.NODE_ENV='"production"' --outfile=artifact/app.js`,
  { cwd: root, stdio: "inherit" },
);
const js = readFileSync(join(root, "artifact", "app.js"), "utf8");

const chunks = join(root, ".next", "static", "chunks");
const cssFile = readdirSync(chunks).find((f) => f.endsWith(".css"));
if (!cssFile) throw new Error("CSS do build não encontrado — rode `next build` antes.");
let css = readFileSync(join(chunks, cssFile), "utf8");

// Fontes: url(../media/x.woff2) → data URI embutida.
css = css.replace(/url\((\.\.\/media\/[^)]+)\)/g, (_, rel) => {
  const buf = readFileSync(join(chunks, rel));
  return `url(data:font/woff2;base64,${buf.toString("base64")})`;
});

// O layout do Next aplica a variável da fonte via classe no <html>; aqui ela
// vira uma regra global, junto com os utilitários do html/body do layout.
css += `\n:root{--font-eb-garamond:"EB Garamond","EB Garamond Fallback"}` +
  `\nhtml{height:100%;-webkit-font-smoothing:antialiased}` +
  `\nbody{min-height:100%;display:flex;flex-direction:column}`;

const html = `<title>Calendário de Demandas — Fortunato Estúdio</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${css}</style>
<div id="root"></div>
<script>${js.replace(/<\/script>/gi, "<\\/script>")}</script>
`;

writeFileSync(out, html);
console.log(`ok: ${out} (${Math.round(html.length / 1024)} KB)`);
