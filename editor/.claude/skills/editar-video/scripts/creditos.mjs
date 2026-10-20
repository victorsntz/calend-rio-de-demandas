// Sobe os créditos como fim de filme: a lista de nomes rolando numa coluna de um
// lado, um quadro de fotos e clipes do outro, mesclando um no outro. Fundo da
// marca, fonte da marca, símbolo parado no alto.
//
// uso: node creditos.mjs --projeto <nome> [--tiras] [--midia] [--montar] [--previa]
//      sem etapa nenhuma, faz as três na ordem.
//
// O projeto mora em trabalho/<nome>/creditos.json. A lista de nomes vem de um
// JSON à parte, porque ela é dado do RH e muda sozinha.
import { readFileSync, writeFileSync, existsSync, statSync, rmSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { estilo, FONTES, TRABALHO, RENDERS, R, pasta, roda, CHROMIUM, titulo, conta, aviso } from "./_comum.mjs";
import { fonteAtiva } from "./fontes.mjs";

const args = process.argv.slice(2);
const pega = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const projeto = pega("--projeto");
const previa = args.includes("--previa");
if (!projeto) { console.error("uso: node creditos.mjs --projeto <nome> [--tiras] [--midia] [--montar] [--previa]"); process.exit(1); }

const so = ["--tiras", "--midia", "--montar"].filter((e) => args.includes(e));
const faz = (etapa) => so.length === 0 || so.includes(etapa);

const casa = pasta(join(TRABALHO, projeto));
const arqCfg = join(casa, "creditos.json");
if (!existsSync(arqCfg)) { console.error(`não achei ${arqCfg}`); process.exit(1); }
const C = JSON.parse(readFileSync(arqCfg, "utf8"));
const F = C.formato;
const perto = (p) => (p.startsWith("/") ? p : join(R, p));

titulo(`Créditos · ${projeto}`);

// ---------- 1. a tira de nomes ----------

// O Chromium não desenha uma página de 23 mil pixels de altura: acima de uns
// 16 mil ele devolve quadro vazio. Por isso a tira sai em pedaços e o ffmpeg
// empilha depois. Cada pedaço tem altura exata de (nomes x entrelinha), senão
// a emenda aparece como um pulo no meio da rolagem.
const POR_PEDACO = 100;
// O viewport do headless vem uns 72 px mais baixo que o --window-size. Peço
// sobra e corto, que é o mesmo truque do peca.mjs.
const FOLGA = 160;

function faceDaFonte() {
  const f = fonteAtiva();
  if (!Object.keys(f.arquivos).length) throw new Error(`nenhuma fonte em ${FONTES}. Rode: node fontes.mjs`);
  const regras = Object.entries(f.arquivos).map(([k, caminho]) => {
    const italico = k.endsWith("i");
    const tipo = caminho.toLowerCase().endsWith(".otf") ? "opentype" : "truetype";
    return `@font-face{font-family:'MarcaNS';font-weight:${parseInt(k, 10)};font-style:${italico ? "italic" : "normal"};` +
      `src:url('file://${caminho}') format('${tipo}')}`;
  }).join("");
  return { regras, familia: f.familia, oficial: f.oficial };
}

function pagina(corpo, largura, altura, regras, familia) {
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>
${regras}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${largura}px;height:${altura}px;background:transparent;overflow:hidden}
body{font-family:'MarcaNS','${familia}',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;
  text-rendering:geometricPrecision;text-align:center}
.nome{height:${C.coluna.entrelinha}px;line-height:${C.coluna.entrelinha}px;font-size:${C.coluna.tamanho}px;
  font-weight:${estilo.fonte.pesos.corpo};color:${estilo.cores.branco.hex};
  white-space:nowrap;overflow:hidden;text-overflow:clip}
</style><div>${corpo}</div></html>`;
}

const escapa = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function desenha(html, largura, altura, saida) {
  const tmp = saida.replace(/\.png$/, ".html");
  const bruto = saida.replace(/\.png$/, ".bruto.png");
  writeFileSync(tmp, html);
  await roda(CHROMIUM, [
    "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
    "--force-device-scale-factor=1", "--default-background-color=00000000",
    "--virtual-time-budget=4000",
    `--window-size=${largura},${altura + FOLGA}`,
    `--screenshot=${bruto}`, `file://${tmp}`,
  ]);
  await roda("ffmpeg", ["-y", "-v", "error", "-i", bruto, "-vf", `crop=${largura}:${altura}:0:0`, "-frames:v", "1", saida]);
  rmSync(tmp, { force: true }); rmSync(bruto, { force: true });
}

const dirTiras = pasta(join(casa, "tiras"));
const arqTira = join(casa, "tira-creditos.png");

async function tiras() {
  const { nomes, titulo: cabeca } = JSON.parse(readFileSync(perto(C.nomes), "utf8"));
  const { regras, familia, oficial } = faceDaFonte();
  if (!oficial) aviso("  rodando com a fonte substituta: a entrega vai ser reprovada");

  const L = C.coluna.largura;
  const pedacos = [];

  // O cabeçalho é o começo da rolagem: dá início à lista em vez de os nomes
  // simplesmente aparecerem do nada.
  if (cabeca) {
    const altura = C.coluna.cabecalho ?? 220;
    const rot = estilo.kit.rotulo;
    const corpo = `<div style="height:${altura}px;display:flex;align-items:flex-end;justify-content:center;
      padding-bottom:${Math.round(C.coluna.entrelinha * 1.1)}px">
      <div style="font-weight:${rot.peso};text-transform:uppercase;letter-spacing:${rot.espacamento}em;
        font-size:${C.coluna.tamanhoCabecalho ?? 22}px;color:${estilo.cores.amarelo.hex}">${escapa(cabeca)}</div></div>`;
    const png = join(dirTiras, "00-cabeca.png");
    await desenha(pagina(corpo, L, altura, regras, familia), L, altura, png);
    pedacos.push(png);
    conta(`  cabeçalho   ${L}x${altura}`);
  }

  for (let i = 0; i < nomes.length; i += POR_PEDACO) {
    const lote = nomes.slice(i, i + POR_PEDACO);
    const altura = lote.length * C.coluna.entrelinha;
    const corpo = lote.map((n) => `<div class="nome">${escapa(n)}</div>`).join("");
    const png = join(dirTiras, `${String(i / POR_PEDACO + 1).padStart(2, "0")}-nomes.png`);
    await desenha(pagina(corpo, L, altura, regras, familia), L, altura, png);
    pedacos.push(png);
    conta(`  nomes ${String(i + 1).padStart(3)}–${String(i + lote.length).padStart(3)}   ${L}x${altura}`);
  }

  // Empilha os pedaços numa tira só. vstack exige largura igual, que é o caso.
  await roda("ffmpeg", ["-y", "-v", "error",
    ...pedacos.flatMap((p) => ["-i", p]),
    "-filter_complex", `${pedacos.map((_, i) => `[${i}:v]`).join("")}vstack=inputs=${pedacos.length}`,
    "-frames:v", "1", arqTira]);

  const [tw, th] = await medida(arqTira);
  conta(`\n  tira: ${tw}x${th} px`);
  return th;
}

async function medida(arq) {
  const { saida } = await roda("ffprobe", ["-v", "error", "-show_entries", "stream=width,height",
    "-of", "csv=p=0:s=x", arq]);
  return String(saida).trim().split("x").map(Number);
}

// ---------- 2. a coluna de mídia ----------

const dirPrep = pasta(join(casa, "preparado"));
const arqMidia = join(casa, "midia.mp4");

async function midia() {
  const Q = C.quadro;
  const prontos = [];

  for (const [i, m] of C.midia.entries()) {
    const fonte = perto(m.arquivo);
    if (!existsSync(fonte)) { console.error(`não achei: ${fonte}`); process.exit(1); }
    const saida = join(dirPrep, `${String(i + 1).padStart(2, "0")}-${basename(fonte).replace(/\.[^.]+$/, "")}.mp4`);
    if (existsSync(saida) && statSync(saida).size > 10000 && !args.includes("--forcar")) { prontos.push(saida); continue; }

    // Preenche o quadro e corta o que sobra: foto em 3:4 e clipe em 9:16 cabem
    // no mesmo retrato sem barra preta e sem deformar ninguém.
    const vf = `scale=${Q.largura}:${Q.altura}:force_original_aspect_ratio=increase,` +
      `crop=${Q.largura}:${Q.altura},setsar=1,fps=${F.fps},format=yuv420p`;
    const entrada = m.foto
      ? ["-loop", "1", "-t", m.dur.toFixed(3), "-i", fonte]
      : ["-ss", String(m.de ?? 0), "-t", m.dur.toFixed(3), "-i", fonte];
    await roda("ffmpeg", ["-y", "-v", "error", ...entrada, "-vf", vf,
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-an", saida]);
    prontos.push(saida);
  }
  conta(`  ${prontos.length} item(ns) no quadro de ${Q.largura}x${Q.altura}`);

  // Mesclagem encadeada: o deslocamento anda no tempo acumulado, que encurta a
  // duração da mescla a cada passagem.
  const M = C.mescla;
  const filtro = [];
  let v = "[0:v]", acc = C.midia[0].dur;
  for (let i = 1; i < prontos.length; i++) {
    const alvo = i === prontos.length - 1 ? "[fim]" : `[x${i}]`;
    filtro.push(`${v}[${i}:v]xfade=transition=fade:duration=${M}:offset=${(acc - M).toFixed(3)}${alvo}`);
    v = alvo; acc += C.midia[i].dur - M;
  }
  await roda("ffmpeg", ["-y", "-v", "error", "-stats",
    ...prontos.flatMap((p) => ["-i", p]),
    "-filter_complex", filtro.join(";"), "-map", "[fim]",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-an", arqMidia]);

  conta(`  coluna de mídia: ${acc.toFixed(2)}s`);
  return acc;
}

// ---------- 3. a montagem ----------

async function montar(alturaTira, duracao) {
  const Q = C.quadro, Col = C.coluna;
  const sim = perto(C.simbolo.arquivo);
  if (!existsSync(sim)) { console.error(`não achei o símbolo: ${sim}`); process.exit(1); }

  const esperaAntes = C.esperaAntes ?? 2, esperaDepois = C.esperaDepois ?? 4;
  // A tira entra pelo pé do quadro e sai pelo topo. A velocidade é o que
  // decide se dá pra ler: o nome fica na tela (altura do quadro / velocidade).
  const percurso = alturaTira + F.altura;
  const rolagem = duracao - esperaAntes - esperaDepois;
  const vel = percurso / rolagem;
  conta(`  rolagem: ${vel.toFixed(1)} px/s · cada nome ${(F.altura / vel).toFixed(1)}s na tela`);

  const colX = Math.round(Col.centro - Col.largura / 2);
  const quadroX = Math.round(Q.centro - Q.largura / 2);
  const quadroY = Math.round((F.altura - Q.altura) / 2);
  const simH = C.simbolo.altura;

  const filtro = [
    `[1:v]format=rgba[tira]`,
    `[0:v][tira]overlay=x=${colX}:y='${F.altura}-(t-${esperaAntes})*${vel.toFixed(4)}'[a]`,
    `[a][2:v]overlay=x=${quadroX}:y=${quadroY}[b]`,
    `[3:v]scale=-1:${simH}[n]`,
    `[b][n]overlay=x=(W-w)/2:y=${C.simbolo.topo}[c]`,
    `[c]fade=t=in:st=0:d=${C.entrada ?? 1.5},fade=t=out:st=${(duracao - (C.saida ?? 1.5)).toFixed(2)}:d=${C.saida ?? 1.5}[v]`,
  ];

  const saida = previa ? join(casa, `${projeto}-previa.mp4`) : perto(C.saida || join(RENDERS, `${projeto}.mp4`));
  pasta(dirname(saida));

  await roda("ffmpeg", ["-y", "-v", "error", "-stats",
    "-f", "lavfi", "-t", duracao.toFixed(3), "-i", `color=c=${C.fundo}:s=${F.largura}x${F.altura}:r=${F.fps}`,
    "-loop", "1", "-t", duracao.toFixed(3), "-i", arqTira,
    "-i", arqMidia,
    "-loop", "1", "-t", duracao.toFixed(3), "-i", sim,
    // Faixa muda: arquivo sem áudio trava player e sobe torto em rede social.
    "-f", "lavfi", "-t", duracao.toFixed(3), "-i", "anullsrc=r=48000:cl=stereo",
    "-filter_complex", filtro.join(";"),
    "-map", "[v]", "-map", "4:a",
    "-c:v", "libx264", "-preset", previa ? "veryfast" : "medium", "-crf", previa ? "28" : "17",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.2",
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
    "-r", String(F.fps), "-c:a", "aac", "-b:a", "96k", "-ar", "48000",
    "-movflags", "+faststart", "-t", duracao.toFixed(3), saida]);

  const mb = (statSync(saida).size / 1e6).toFixed(1);
  conta(`\n  ${saida.replace(R + "/", "")}  (${mb} MB · ${Math.floor(duracao / 60)}:${String(Math.round(duracao % 60)).padStart(2, "0")})`);
}

// ---------- roda ----------

let alturaTira = 0, duracao = 0;
if (faz("--tiras")) alturaTira = await tiras();
else if (existsSync(arqTira)) alturaTira = (await medida(arqTira))[1];

if (faz("--midia")) duracao = await midia();
else duracao = C.midia.reduce((s, m) => s + m.dur, 0) - (C.midia.length - 1) * C.mescla;

if (faz("--montar")) {
  if (!alturaTira) { console.error("sem a tira de nomes. Rode com --tiras."); process.exit(1); }
  await montar(alturaTira, duracao);
}
