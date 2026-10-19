// Peças que todas as scripts usam: onde fica o projeto, o estilo, cor e chamada de processo.
import { execFile } from "node:child_process";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** A raiz do editor é a pasta que tem o ESTILO.md. Subimos até achar. */
export function raiz() {
  let p = AQUI;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(p, "ESTILO.md"))) return p;
    p = resolve(p, "..");
  }
  throw new Error("não achei o ESTILO.md subindo a partir de " + AQUI);
}

export const R = raiz();
export const FONTES = join(R, ".fontes");
export const BRUTOS = join(R, "brutos");
export const RENDERS = join(R, "renders");
export const TRABALHO = join(R, "trabalho");

export const estilo = JSON.parse(readFileSync(join(R, "estilo.json"), "utf8"));

export function formato(nome = "reels") {
  const f = estilo.formatos[nome];
  if (!f) throw new Error(`formato desconhecido: ${nome}. Use reels ou youtube.`);
  return f;
}

export function pasta(p) { mkdirSync(p, { recursive: true }); return p; }

/** Pasta de trabalho de um projeto: editor/trabalho/<projeto>/ */
export function oficina(projeto) { return pasta(join(TRABALHO, projeto)); }

// ---------- cor ----------

export function hexRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function rgba(hex, a) {
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/** ASS guarda cor como &HAABBGGRR. Opacidade 1 = alpha 00. */
export function corAss(hex, opacidade = 1) {
  const [r, g, b] = hexRgb(hex);
  const a = Math.round((1 - opacidade) * 255);
  const h2 = (n) => n.toString(16).toUpperCase().padStart(2, "0");
  return `&H${h2(a)}${h2(b)}${h2(g)}${h2(r)}`;
}

/** Os dois acentos verdes do estilo, pra contar quantos verdes há numa tela. */
export const VERDES = Object.values(estilo.cores).filter((c) => c.acento).map((c) => c.hex.toUpperCase());

// ---------- processo ----------

export function roda(cmd, args, opcoes = {}) {
  return new Promise((ok, falha) => {
    execFile(cmd, args, { maxBuffer: 1 << 28, ...opcoes }, (erro, saida, erroSaida) => {
      if (erro) { erro.stderr = erroSaida; erro.stdout = saida; return falha(erro); }
      ok({ saida, erroSaida });
    });
  });
}

export async function ffprobe(arquivo) {
  const { saida } = await roda("ffprobe", [
    "-v", "error", "-print_format", "json",
    "-show_format", "-show_streams", arquivo,
  ]);
  return JSON.parse(saida);
}

export const CHROMIUM = process.env.CHROMIUM_BIN
  || ["/opt/pw-browsers/chromium", "/usr/bin/chromium", "/usr/bin/chromium-browser",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find((p) => existsSync(p))
  || "chromium";

// ---------- tempo ----------

/** Aceita 12.5, "12.5", "00:01:02.5" e devolve segundos. */
export function segundos(v) {
  if (typeof v === "number") return v;
  const t = String(v).trim();
  if (!t.includes(":")) return Number(t);
  const p = t.split(":").map(Number);
  while (p.length < 3) p.unshift(0);
  return p[0] * 3600 + p[1] * 60 + p[2];
}

/** Segundos -> 0:00:12.50, o jeito que o ASS quer. */
export function tempoAss(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${seg.toFixed(2).padStart(5, "0")}`;
}

// ---------- fala ----------

export function aviso(...a) { console.error("  ⚠", ...a); }
export function conta(...a) { console.log(...a); }
export function titulo(t) { console.log(`\n${t}\n${"─".repeat(Math.min(t.length, 60))}`); }
