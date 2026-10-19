// Transforma uma apresentação num vídeo, com dissolução suave entre os slides.
// Cada slide fica no ar pelo tempo de ler o que tem nele: slide de divisória
// passa rápido, slide de artigo de portaria fica. O tempo sai da contagem de
// palavras da transcrição, então a transcrição é parte da receita, não um extra.
//
// Antes: exportar um PNG por slide (as imagens originais, se o .pptx for só
// imagem) e escrever a transcricao.md com um cabeçalho "## Slide N" por slide.
//
// uso: node apresentacao.mjs <pasta-dos-png> <transcricao.md> <saida.mp4> [--previa]
import { readFileSync, existsSync, statSync } from "node:fs";
import { readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";

const [pastaPng, arqTexto, saida] = process.argv.slice(2);
const previa = process.argv.includes("--previa");
if (!pastaPng || !arqTexto || !saida) {
  console.error("uso: node montar-psa.mjs <pasta-png> <transcricao.md> <saida.mp4> [--previa]");
  process.exit(1);
}

const L = 1920, A = 1080, FPS = 30;
const DISSOLVE = 0.9;   // a passagem de um slide pro outro
const ABRE = 1.2;       // entrada do preto
const FECHA = 1.6;      // saída pro preto

// ---------- quanto tempo cada slide fica ----------

// Só o texto do slide conta. As anotações que eu escrevi na transcrição (linhas
// em itálico, o cabeçalho do arquivo) não estão na tela e não podem puxar o tempo.
function palavrasPorSlide(md) {
  const partes = md.split(/^## Slide (\d+)[^\n]*$/m);
  const fora = [];
  for (let i = 1; i < partes.length; i += 2) {
    const n = Number(partes[i]);
    const corpo = partes[i + 1]
      .split("\n")
      .filter((l) => !/^\s*\*[^*].*\*\s*$/.test(l))   // minhas notas em itálico
      .filter((l) => !/^\s*---\s*$/.test(l))
      .join(" ")
      .replace(/[*_>#`]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    fora[n - 1] = corpo ? corpo.split(" ").length : 0;
  }
  return fora;
}

// Leitura confortável na tela gira em torno de 4 palavras por segundo quando a
// pessoa está varrendo cartões, não lendo prosa. O piso de 6 s é pra divisória
// não piscar; o teto de 22 s é pra slide de portaria não virar tela parada.
const tempo = (p) => Math.min(22, Math.max(6, 4.0 + p / 4.0));

const md = readFileSync(arqTexto, "utf8");
const palavras = palavrasPorSlide(md);

const pngs = readdirSync(pastaPng).filter((f) => /\.png$/i.test(f)).sort()
  .map((f) => join(pastaPng, f));
if (pngs.length !== palavras.length) {
  console.error(`${pngs.length} imagens mas ${palavras.length} slides na transcrição. Os dois têm que bater.`);
  process.exit(1);
}

const duracoes = palavras.map((p) => Number(tempo(p).toFixed(2)));
const n = duracoes.length;
// Cada dissolução come DISSOLVE segundos, porque os dois slides dividem o mesmo trecho.
const total = duracoes.reduce((s, d) => s + d, 0) - (n - 1) * DISSOLVE;

console.log(`Curso PSA · ${n} slides`);
console.log("slide  palavras  tempo");
duracoes.forEach((d, i) => console.log(`  ${String(i + 1).padStart(2)}   ${String(palavras[i]).padStart(6)}   ${d.toFixed(1)}s`));
console.log(`\n  total: ${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, "0")} com dissolução de ${DISSOLVE}s`);

// ---------- o filtro ----------

const entradas = [];
const filtro = [];

for (const [i, png] of pngs.entries()) {
  // Cada PNG precisa do seu próprio -t: sem ele o ffmpeg gera quadros do slide
  // inteiro pro vídeo todo e o render não acaba nunca.
  entradas.push("-loop", "1", "-t", duracoes[i].toFixed(3), "-i", png);
  // As imagens saem em 1921x1080. Corto 1 px em vez de esticar: esticar amassa
  // a letra, cortar tira uma coluna de fundo.
  filtro.push(`[${i}:v]crop=${L}:${A}:0:0,fps=${FPS},format=yuv420p,setsar=1[s${i}]`);
}

// Dissolução encadeada. O deslocamento é no tempo acumulado, que encurta
// DISSOLVE a cada passagem.
let v = "[s0]";
let acumulado = duracoes[0];
for (let i = 1; i < n; i++) {
  const desloca = acumulado - DISSOLVE;
  const alvo = i === n - 1 ? "[dissolvido]" : `[x${i}]`;
  filtro.push(`${v}[s${i}]xfade=transition=fade:duration=${DISSOLVE}:offset=${desloca.toFixed(3)}${alvo}`);
  v = alvo;
  acumulado += duracoes[i] - DISSOLVE;
}

filtro.push(`${v}fade=t=in:st=0:d=${ABRE},fade=t=out:st=${(total - FECHA).toFixed(3)}:d=${FECHA}[v]`);

// Trilha muda: arquivo sem faixa de áudio trava player e sobe torto em rede social.
entradas.push("-f", "lavfi", "-t", total.toFixed(3), "-i", "anullsrc=r=48000:cl=stereo");

const cmd = [
  "-y", "-v", "error", "-stats",
  ...entradas,
  "-filter_complex", filtro.join(";"),
  "-map", "[v]", "-map", `${n}:a`,
  "-c:v", "libx264", "-preset", previa ? "veryfast" : "medium", "-crf", previa ? "28" : "16",
  "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.2",
  "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
  "-r", String(FPS),
  "-c:a", "aac", "-b:a", "96k", "-ar", "48000",
  "-movflags", "+faststart",
  "-t", total.toFixed(3),
  saida,
];

console.log(`\nRenderizando${previa ? " (prévia)" : ""}...`);
const p = spawn("ffmpeg", cmd, { stdio: ["ignore", "inherit", "inherit"] });
p.on("exit", (code) => {
  if (code !== 0) { console.error(`\nffmpeg saiu com ${code}`); process.exit(code); }
  const mb = (statSync(saida).size / 1e6).toFixed(1);
  console.log(`\n  ${saida}  (${mb} MB)`);
});
