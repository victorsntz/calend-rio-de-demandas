// Monta o vídeo final a partir de um roteiro em JSON (o EDL).
// uso: node montar.mjs trabalho/<projeto>/montagem.json [--previa]
//
// Formato do montagem.json (tempos em segundos, "de"/"ate" dos clipes são do
// arquivo bruto; os das peças são da linha do tempo já montada):
// {
//   "projeto": "institucional-fenasan", "formato": "telao",
//   "clipes": [{ "arquivo": "brutos/.../a-sdr.mov", "de": 3.2, "ate": 8.9, "zoom": true }],
//   "legendas": true,
//   "pecas":   [{ "png": "trabalho/.../gancho.png", "de": 0, "ate": 2.6, "entrada": "subir" }],
//   "trilha":  { "arquivo": "trilha.mp3", "db": -20 },
//   "saida": "renders/2026-10-10-nome.mp4"
// }
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import {
  estilo, formato, R, RENDERS, oficina, pasta, roda, ffprobe,
  segundos, titulo, conta, aviso,
} from "./_comum.mjs";

const args = process.argv.slice(2);
const arqEdl = args.find((a) => !a.startsWith("--"));
const previa = args.includes("--previa");

if (!arqEdl || !existsSync(arqEdl)) {
  console.error("uso: node montar.mjs <montagem.json> [--previa]");
  process.exit(1);
}

const edl = JSON.parse(readFileSync(arqEdl, "utf8"));
const F = formato(edl.formato || "telao");
const projeto = edl.projeto || "sem-nome";
const casa = oficina(projeto);

// Na prévia a imagem cai pela metade e o encode fica rápido: é pra aprovar, não pra postar.
const L = previa ? Math.round(F.largura / 2) : F.largura;
const A = previa ? Math.round(F.altura / 2) : F.altura;
const FPS = F.fps;

const perto = (p) => (p.startsWith("/") ? p : resolve(R, p));

// ---------- clipes ----------

if (!edl.clipes?.length) { console.error("o montagem.json não tem clipes."); process.exit(1); }

const clipes = [];
for (const c of edl.clipes) {
  const arquivo = perto(c.arquivo);
  if (!existsSync(arquivo)) { console.error(`não achei o clipe: ${arquivo}`); process.exit(1); }
  const d = await ffprobe(arquivo);
  const de = segundos(c.de ?? 0);
  const ate = segundos(c.ate ?? d.format.duration);
  if (ate <= de) { console.error(`clipe com tempo invertido: ${c.arquivo} (${de} → ${ate})`); process.exit(1); }
  clipes.push({ ...c, arquivo, de, ate, dur: ate - de, temAudio: d.streams.some((s) => s.codec_type === "audio") });
}

const duracaoTotal = clipes.reduce((s, c) => s + c.dur, 0);

// ---------- peças e legendas ----------

const pecas = [...(edl.pecas || [])].map((p) => ({ ...p, png: perto(p.png) }));

if (edl.legendas) {
  const arq = join(casa, "legendas-render.json");
  if (!existsSync(arq)) {
    console.error(`"legendas": true mas não achei ${arq}.\nRode: node legendas.mjs --projeto ${projeto} --render`);
    process.exit(1);
  }
  for (const b of JSON.parse(readFileSync(arq, "utf8")).blocos) {
    pecas.push({ png: perto(b.png), de: b.inicio, ate: b.fim, entrada: "legenda" });
  }
}

for (const p of pecas) {
  if (!existsSync(p.png)) { console.error(`não achei a peça: ${p.png}`); process.exit(1); }
  p.de = segundos(p.de ?? 0);
  p.ate = segundos(p.ate ?? duracaoTotal);
  if (p.ate > duracaoTotal + 0.01) aviso(`peça passa do fim do vídeo: ${p.png} vai até ${p.ate}s e o vídeo tem ${duracaoTotal.toFixed(2)}s`);
}

// Regra do amarelo: dois destaques de conteúdo ao mesmo tempo na tela é demais.
const sobrepoe = (a, b) => a.de < b.ate && b.de < a.ate;
const destaques = pecas.filter((p) => p.destaque);
for (let i = 0; i < destaques.length; i++) {
  for (let j = i + 1; j < destaques.length; j++) {
    if (sobrepoe(destaques[i], destaques[j])) {
      aviso(`dois destaques amarelos na tela ao mesmo tempo (${destaques[i].de}s e ${destaques[j].de}s). O ESTILO deixa um.`);
    }
  }
}

// ---------- o filtro ----------

const entradas = [];
const filtro = [];
let n = 0;
const proximo = () => n++;

// 1. clipes: corta, enquadra no formato e normaliza o relógio
const rotulosV = [], rotulosA = [];
for (const [i, c] of clipes.entries()) {
  entradas.push("-ss", String(c.de), "-t", String(c.dur), "-i", c.arquivo);
  const idx = proximo();
  const enquadra = `scale=${L}:${A}:force_original_aspect_ratio=increase,crop=${L}:${A}`;
  // Zoom de ênfase: 1,00 → 1,06 em meio segundo. O ESTILO deixa um a cada 8 s.
  const z = c.zoom
    ? `,zoompan=z='min(${estilo.movimento.zoomEnfase.para},1+${(estilo.movimento.zoomEnfase.para - 1).toFixed(3)}*on/${Math.round(estilo.movimento.zoomEnfase.duracao * FPS)})':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${L}x${A}:fps=${FPS}`
    : "";
  filtro.push(`[${idx}:v]fps=${FPS},${enquadra}${z},setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v${i}]`);
  rotulosV.push(`[v${i}]`);
  if (c.temAudio && !c.mudo) {
    filtro.push(`[${idx}:a]aresample=48000,asetpts=PTS-STARTPTS[a${i}]`);
  } else {
    entradas.push("-f", "lavfi", "-t", String(c.dur), "-i", "anullsrc=r=48000:cl=stereo");
    filtro.push(`[${proximo()}:a]asetpts=PTS-STARTPTS[a${i}]`);
  }
  rotulosA.push(`[a${i}]`);
}

// O concat quer os pares intercalados: [v0][a0][v1][a1]… e não todos os vídeos primeiro.
const paresConcat = rotulosV.map((rv, i) => rv + rotulosA[i]).join("");
filtro.push(`${paresConcat}concat=n=${clipes.length}:v=1:a=1[vcat][voz0]`);

let v = "[vcat]";

// 2. peças e legendas, cada uma com sua entrada
const M = estilo.movimento;
const escala = previa ? 0.5 : 1;
for (const [i, p] of pecas.entries()) {
  entradas.push("-loop", "1", "-i", p.png);
  const idx = proximo();
  const dur = Math.max(p.ate - p.de, 0.1);
  const ehLegenda = p.entrada === "legenda";
  const subir = Math.round((ehLegenda ? estilo.legenda.entrada.subir : M.entrada.subir) * escala);
  const fadeIn = ehLegenda ? estilo.legenda.entrada.fade : M.entrada.duracao;
  const fadeOut = Math.min(ehLegenda ? 0.12 : 0.3, dur / 2);

  filtro.push(
    `[${idx}:v]scale=${L}:${A},setsar=1,format=rgba,` +
    `fade=t=in:st=0:d=${fadeIn.toFixed(2)}:alpha=1,` +
    `fade=t=out:st=${(dur - fadeOut).toFixed(2)}:d=${fadeOut.toFixed(2)}:alpha=1,` +
    `setpts=PTS-STARTPTS+${p.de.toFixed(3)}/TB[p${i}]`
  );

  // Sobe os últimos pixels enquanto aparece. Sem quicar: entra e assenta.
  const y = p.entrada === "nenhuma"
    ? "0"
    : `'if(lt(t-${p.de.toFixed(3)},${fadeIn.toFixed(2)}),${subir}*(1-(t-${p.de.toFixed(3)})/${fadeIn.toFixed(2)}),0)'`;

  filtro.push(`${v}[p${i}]overlay=x=0:y=${y}:enable='between(t,${p.de.toFixed(3)},${p.ate.toFixed(3)})':eof_action=pass[v${i}o]`);
  v = `[v${i}o]`;
}

// 3. som: voz nivelada, trilha bem embaixo
let a = "[voz0]";
filtro.push(`${a}loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[voz]`);
a = "[voz]";

if (edl.trilha?.arquivo) {
  const trilha = perto(edl.trilha.arquivo);
  if (!existsSync(trilha)) { console.error(`não achei a trilha: ${trilha}`); process.exit(1); }
  entradas.push("-stream_loop", "-1", "-i", trilha);
  const idx = proximo();
  const db = edl.trilha.db ?? -estilo.som.trilha.dbAbaixoDaVoz;
  filtro.push(
    `[${idx}:a]aresample=48000,volume=${db}dB,` +
    `afade=t=in:st=0:d=1,afade=t=out:st=${Math.max(duracaoTotal - 1.2, 0).toFixed(2)}:d=1.2,` +
    `atrim=0:${duracaoTotal.toFixed(3)},asetpts=PTS-STARTPTS[trilha]`
  );
  filtro.push(`${a}[trilha]amix=inputs=2:duration=first:normalize=0[mix]`);
  a = "[mix]";
}

// ---------- render ----------

// A prévia vai sempre pra pasta de trabalho, mesmo quando o EDL diz onde salvar:
// prévia escrevendo por cima do render final é perda de uma hora de encode.
const saida = previa
  ? join(casa, `${projeto}-previa.mp4`)
  : perto(edl.saida || join(RENDERS, `${projeto}.mp4`));
pasta(dirname(saida));

const cmd = [
  "-y", "-v", "error", "-stats",
  ...entradas,
  "-filter_complex", filtro.join(";"),
  "-map", v, "-map", a,
  "-c:v", "libx264",
  "-preset", previa ? "veryfast" : "slow",
  "-crf", previa ? "28" : "17",
  "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-level", "4.2",
  "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
  "-r", String(FPS),
  "-c:a", "aac", "-b:a", previa ? "128k" : "256k", "-ar", "48000",
  "-movflags", "+faststart",
  "-t", duracaoTotal.toFixed(3),
  saida,
];

titulo(`Montagem · ${projeto}${previa ? " · prévia" : ""}`);
conta(`  ${clipes.length} clipe(s) · ${pecas.length} peça(s) na tela · ${duracaoTotal.toFixed(2)} s · ${L}x${A} ${FPS}fps`);
// O ESTILO manda o fim casar com o começo, pra rodar em loop no telão sem solavanco.
if (!previa && estilo.movimento.loop?.primeiroQuadroIgualAoUltimo && !edl.loopConferido) {
  aviso("o ESTILO pede o primeiro e o último quadro iguais, pra fechar o loop no telão.");
  aviso('marque "loopConferido": true no montagem.json quando tiver conferido.');
}

const roteiro = join(casa, previa ? "ffmpeg-previa.txt" : "ffmpeg.txt");
await import("node:fs").then((fs) => fs.writeFileSync(roteiro, "ffmpeg " + cmd.map((x) => (/[ '"]/.test(x) ? JSON.stringify(x) : x)).join(" ") + "\n"));

try {
  await roda("ffmpeg", cmd, { stdio: "inherit" });
} catch (e) {
  console.error("\no ffmpeg reclamou:\n" + String(e.stderr || e.message).split("\n").slice(-25).join("\n"));
  console.error(`\no comando inteiro está em ${roteiro}`);
  process.exit(1);
}

conta(`\n  ${saida}  (${(statSync(saida).size / 1e6).toFixed(1)} MB)`);
conta(previa
  ? `  Prévia pra aprovar. Depois do aval: node montar.mjs ${arqEdl}`
  : `  Confira antes de postar: node conferir.mjs "${saida}" --formato ${edl.formato || "telao"}`);
