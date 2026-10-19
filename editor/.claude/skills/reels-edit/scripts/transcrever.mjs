// Transcreve a fala com tempo por palavra, pra montar o corte em cima do texto.
// Usa o Scribe da ElevenLabs. A chave vai em ELEVENLABS_API_KEY (ou num .env
// na raiz do editor). Chave nenhuma sobe pro GitHub: o .gitignore barra .env.
//
// uso: node transcrever.mjs brutos/2026-10-10-nome/IMG_0001.mov --projeto 2026-10-10-nome
import { writeFileSync, existsSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { estilo, roda, oficina, R, titulo, conta, aviso } from "./_comum.mjs";

const args = process.argv.slice(2);
const entrada = args.find((a) => !a.startsWith("--"));
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);
const projeto = pega("--projeto", entrada ? basename(entrada).replace(/\.[^.]+$/, "") : null);

if (!entrada || !existsSync(entrada)) {
  console.error("uso: node transcrever.mjs <arquivo> [--projeto nome] [--idioma por]");
  process.exit(1);
}

// .env simples: CHAVE=valor por linha.
function chave() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const env = join(R, ".env");
  if (existsSync(env)) {
    const m = readFileSync(env, "utf8").match(/^ELEVENLABS_API_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

const K = chave();
if (!K) {
  console.error([
    "Falta a chave da ElevenLabs.",
    "",
    "  export ELEVENLABS_API_KEY=sua-chave",
    `  ou crie ${join(R, ".env")} com a linha  ELEVENLABS_API_KEY=sua-chave`,
    "",
    "Sem transcrição dá pra seguir: escreva o corte na mão num arquivo de legendas",
    "e passe pro legendas.mjs com --legendas. O .env nunca sobe pro GitHub.",
  ].join("\n"));
  process.exit(1);
}

const casa = oficina(projeto);
const audio = join(casa, "audio.mp3");

titulo(`Transcrição · ${projeto}`);
conta("  tirando o áudio…");
await roda("ffmpeg", ["-y", "-v", "error", "-i", entrada, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "64k", audio]);
conta(`  áudio: ${(statSync(audio).size / 1e6).toFixed(1)} MB`);

conta("  mandando pro Scribe…");
const form = new FormData();
form.append("file", new Blob([readFileSync(audio)], { type: "audio/mpeg" }), "audio.mp3");
form.append("model_id", "scribe_v1");
form.append("language_code", pega("--idioma", "por"));
form.append("timestamps_granularity", "word");
form.append("diarize", "false");

const r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
  method: "POST", headers: { "xi-api-key": K }, body: form,
});
if (!r.ok) {
  console.error(`\nA ElevenLabs recusou: HTTP ${r.status}\n${(await r.text()).slice(0, 600)}`);
  process.exit(1);
}
const bruto = await r.json();

const vicios = new Set(estilo.legenda.limpar.map((v) => v.toLowerCase()));
const limpa = (p) => p.toLowerCase().replace(/[.,!?;:…]/g, "").trim();

const palavras = (bruto.words || [])
  .filter((w) => w.type !== "spacing")
  .map((w) => ({
    p: w.text,
    inicio: Number(w.start),
    fim: Number(w.end),
    vicio: vicios.has(limpa(w.text)),
  }));

const saida = join(casa, "transcricao.json");
writeFileSync(saida, JSON.stringify({
  projeto, origem: entrada, idioma: bruto.language_code || "por",
  texto: bruto.text || palavras.map((w) => w.p).join(" "),
  palavras,
}, null, 2));

const quantosVicios = palavras.filter((w) => w.vicio).length;
conta(`\n  ${palavras.length} palavras · ${quantosVicios} vício(s) de fala marcado(s) pra sair da legenda`);
conta(`  ${saida}`);
conta(`\n  Próximo: node legendas.mjs --projeto ${projeto}`);
if (!palavras.length) aviso("veio sem tempo por palavra. Confira se o áudio tem fala mesmo.");
