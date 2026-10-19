// Transcrição -> legendas no estilo. Duas passadas de propósito:
//   1) node legendas.mjs --projeto X           escreve legendas.json e legendas.txt pra aprovar
//   2) node legendas.mjs --projeto X --render  depois do aval, gera os PNGs e o .srt
// A pausa entre as duas é a etapa 1 do CLAUDE.md. Render sem aval não existe.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { estilo, formato, oficina, pasta, titulo, conta, aviso } from "./_comum.mjs";
import { renderizaPeca } from "./peca.mjs";

const args = process.argv.slice(2);
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);
const projeto = pega("--projeto");
const nomeFormato = pega("--formato", "reels");
const soRenderizar = args.includes("--render");

if (!projeto) {
  console.error("uso: node legendas.mjs --projeto <nome> [--formato reels|youtube] [--render]");
  process.exit(1);
}

const F = formato(nomeFormato);
const casa = oficina(projeto);
const arqLegendas = join(casa, "legendas.json");
const [minP, maxP] = F.legenda.palavrasPorVez;

// ---------- passada 1: picar a transcrição ----------

function pica(palavras) {
  const blocos = [];
  let atual = [];
  const fecha = () => {
    if (!atual.length) return;
    blocos.push({
      inicio: Number(atual[0].inicio.toFixed(2)),
      fim: Number((atual[atual.length - 1].fim + 0.08).toFixed(2)),
      texto: atual.map((w) => w.p).join(" ").replace(/\s+([,.!?;:])/g, "$1").trim(),
    });
    atual = [];
  };

  for (let i = 0; i < palavras.length; i++) {
    const w = palavras[i];
    if (w.vicio) continue;              // "né", "tipo" e companhia saem do texto
    atual.push(w);
    const prox = palavras.slice(i + 1).find((x) => !x.vicio);
    const pontoFinal = /[.!?]$/.test(w.p);
    const virgula = /[,;:]$/.test(w.p);
    const buraco = prox ? prox.inicio - w.fim : Infinity;

    if (pontoFinal) fecha();
    else if (atual.length >= maxP) fecha();
    else if (atual.length >= minP && (virgula || buraco > 0.45)) fecha();
  }
  fecha();
  return blocos;
}

function limpaTexto(t) {
  return t
    .replace(/\s{2,}/g, " ")
    .replace(/^([a-záéíóúâêôãõç])/, (m) => m.toUpperCase() === m ? m : m);
}

if (!soRenderizar) {
  const arqTransc = join(casa, "transcricao.json");
  const deMao = pega("--texto");

  let blocos;
  if (existsSync(arqTransc)) {
    const t = JSON.parse(readFileSync(arqTransc, "utf8"));
    blocos = pica(t.palavras).map((b) => ({ ...b, texto: limpaTexto(b.texto) }));
  } else if (deMao && existsSync(deMao)) {
    blocos = JSON.parse(readFileSync(deMao, "utf8"));
  } else {
    console.error(`não achei ${arqTransc}.\nRode o transcrever.mjs antes, ou passe --texto arquivo.json com os blocos na mão.`);
    process.exit(1);
  }

  // Avisos que ajudam a decidir o corte na etapa 1.
  const longos = blocos.filter((b) => b.texto.split(/\s+/).length > maxP);
  const buracos = [];
  for (let i = 1; i < blocos.length; i++) {
    const pausa = blocos[i].inicio - blocos[i - 1].fim;
    if (pausa > F.ritmo.pausaMaxEntreFrases) buracos.push({ depoisDe: i - 1, pausa: Number(pausa.toFixed(2)) });
  }

  writeFileSync(arqLegendas, JSON.stringify({
    projeto, formato: nomeFormato,
    _leia: `Ajuste o texto e a ênfase aqui. *itálico* e **itálico no verde** (uma por frase). Depois: node legendas.mjs --projeto ${projeto} --render`,
    blocos,
  }, null, 2));

  const txt = blocos.map((b, i) =>
    `${String(i + 1).padStart(3, "0")}  ${b.inicio.toFixed(2).padStart(6)} → ${b.fim.toFixed(2).padStart(6)}   ${b.texto}`
  ).join("\n");
  writeFileSync(join(casa, "legendas.txt"), txt + "\n");

  titulo(`Legendas · ${projeto}`);
  conta(txt);
  conta(`\n  ${blocos.length} blocos · ${minP} a ${maxP} palavras por vez`);
  if (longos.length) aviso(`${longos.length} bloco(s) passaram de ${maxP} palavras. Quebre ou encurte.`);
  if (buracos.length) aviso(`${buracos.length} pausa(s) acima de ${F.ritmo.pausaMaxEntreFrases}s. Candidatas a corte seco.`);
  conta(`\n  Arquivo pra editar: ${arqLegendas}`);
  conta(`  Marque a ênfase, mostre pro Victor e só depois rode com --render.`);
  process.exit(0);
}

// ---------- passada 2: render ----------

if (!existsSync(arqLegendas)) {
  console.error(`não achei ${arqLegendas}. Rode sem --render primeiro.`);
  process.exit(1);
}
const { blocos } = JSON.parse(readFileSync(arqLegendas, "utf8"));
const destino = pasta(join(casa, "legendas"));

titulo(`Legendas · render · ${projeto}`);
const saidaBlocos = [];
for (let i = 0; i < blocos.length; i++) {
  const b = blocos[i];
  const png = join(destino, `${String(i + 1).padStart(3, "0")}.png`);
  const { verdes } = await renderizaPeca("legenda", {
    texto: b.texto, sobreClaro: !!b.sobreClaro, tamanho: b.tamanho, saida: png,
  }, nomeFormato);
  saidaBlocos.push({ ...b, png, verdes });
  conta(`  ${String(i + 1).padStart(3, "0")}  ${b.texto}`);
}

// .srt sem as marcas de ênfase, pra subir no YouTube e pra quem usa leitor de tela.
const srt = saidaBlocos.map((b, i) => {
  const rel = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const seg = (s % 60).toFixed(3).padStart(6, "0").replace(".", ",");
    return `${h}:${m}:${seg}`;
  };
  const texto = b.texto.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
  return `${i + 1}\n${rel(b.inicio)} --> ${rel(b.fim)}\n${texto}\n`;
}).join("\n");
writeFileSync(join(casa, "legendas.srt"), srt);

writeFileSync(join(casa, "legendas-render.json"), JSON.stringify({ projeto, formato: nomeFormato, blocos: saidaBlocos }, null, 2));

const comVerde = saidaBlocos.filter((b) => b.verdes > 0).length;
conta(`\n  ${saidaBlocos.length} PNGs em ${destino}`);
conta(`  legendas.srt pronto pro YouTube`);
conta(`  ${comVerde} bloco(s) com ênfase em verde`);
if (comVerde > Math.ceil(saidaBlocos.length / 4)) {
  aviso("verde demais. O ESTILO manda uma ênfase por frase e uma palavra verde por tela; use com fome.");
}
