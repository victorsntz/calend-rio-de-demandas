// Renderiza uma peça do kit do ESTILO.md num PNG transparente do tamanho do quadro.
// Transparente e do tamanho do quadro porque aí o montar.mjs só sobrepõe em 0,0 e
// cuida do tempo e da entrada. Uma peça por PNG.
//
// uso:
//   node peca.mjs rotulo    --texto "BASTIDORES · DIA 3" --y 300
//   node peca.mjs gancho    --rotulo "OPINIÃO" --texto "Sua marca pede *desculpas* por ser daqui"
//   node peca.mjs pilula    --texto "Fale com o estúdio" --ponto --seta --quadros 57
//   node peca.mjs citacao   --texto "A origem é a **assinatura**." --assinatura
//   node peca.mjs --json roteiro-de-pecas.json
//
// Ênfase no texto:  *itálico*   **itálico no verde de acento**  (uma por frase)
import { writeFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import {
  estilo, formato, FONTES, TRABALHO, pasta, roda, rgba, CHROMIUM,
  titulo, conta, aviso,
} from "./_comum.mjs";

const C = estilo.cores;
const K = estilo.kit;

// ---------- fonte ----------

const ARQ_FONTE = {
  400: "STIXTwoText-Regular.ttf", 500: "STIXTwoText-Medium.ttf",
  600: "STIXTwoText-SemiBold.ttf", 700: "STIXTwoText-Bold.ttf",
  "400i": "STIXTwoText-Italic.ttf", "500i": "STIXTwoText-MediumItalic.ttf",
  "600i": "STIXTwoText-SemiBoldItalic.ttf",
};

function faceDaFonte() {
  const faltando = Object.values(ARQ_FONTE).filter((f) => !existsSync(join(FONTES, f)));
  if (faltando.length) {
    throw new Error(`fonte faltando em ${FONTES}. Rode: node fontes.mjs`);
  }
  return Object.entries(ARQ_FONTE).map(([k, f]) => {
    const italico = k.endsWith("i");
    const peso = parseInt(k, 10);
    return `@font-face{font-family:'STIX Two Text';font-weight:${peso};` +
      `font-style:${italico ? "italic" : "normal"};` +
      `src:url('file://${join(FONTES, f)}') format('truetype')}`;
  }).join("");
}

// ---------- texto ----------

const escapa = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Conta quantos acentos verdes a peça pediu, pra cobrar a regra de um por tela. */
let verdesNaPeca = 0;

/** *x* vira itálico. **x** vira itálico no verde do fundo. */
function enfatiza(texto, sobreEscuro = false) {
  const verde = sobreEscuro ? C.verdeClaro.hex : C.verde.hex;
  return escapa(texto)
    .replace(/\*\*(.+?)\*\*/g, (_, p) => { verdesNaPeca++; return `<em style="color:${verde}">${p}</em>`; })
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function limpaVicios(texto) {
  if (/—/.test(texto)) aviso("tem travessão no texto da tela. O ESTILO.md proíbe (seção 6).");
  const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  if (emoji.test(texto)) aviso("tem emoji no texto da tela. O ESTILO.md proíbe (seção 6).");
  for (const p of estilo.voz.palavrasProibidas) {
    if (new RegExp(`\\b${p}\\b`, "i").test(texto)) aviso(`palavra de texto de IA na tela: "${p}".`);
  }
  if (/não é sobre .+?,? é sobre /i.test(texto)) aviso('frase no molde proibido "não é sobre X, é sobre Y".');
  return texto;
}

// ---------- as peças ----------

const SOMBRA = `0 ${K.sombra.y}px ${K.sombra.desfoque}px ${rgba(K.sombra.cor, K.sombra.opacidade)}`;

/** Peça usada solta precisa do .bloco, que é quem posiciona. Dentro de outra
 *  peça o .bloco atrapalha, então quem chama de dentro passa _interno. */
const envolve = (html, o) => (o._interno ? html : `<div class="bloco">${html}</div>`);

function pecaRotulo(o, F) {
  const cor = o.escuro ? C.espressoSuave.hex : C.tintaApagada.hex;
  return envolve(
    `<div class="rotulo" style="color:${o.cor || cor};font-size:${o.tamanho || Math.round(F.largura * 0.026)}px">${escapa(o.texto).toUpperCase()}</div>`,
    o);
}

function pecaGancho(o, F) {
  const g = F.gancho;
  const tam = o.tamanho || g.tamanhoMax;
  // Sobre vídeo: papel sobre um escurecido. Em cartela: tinta sobre papel, sem sombra.
  const claro = !!o.sobreClaro;
  const corTexto = claro ? C.tinta.hex : C.papel.hex;
  const fundo = claro ? `<div class="cheia" style="background:${C.papel.hex}"></div>`
    : (o.escurecer === false ? "" :
      `<div class="scrim" style="background:linear-gradient(to bottom,transparent,${rgba(C.espresso.hex, o.escurecer ?? g.escurecerFundo)} 18%,${rgba(C.espresso.hex, o.escurecer ?? g.escurecerFundo)} 82%,transparent)"></div>`);
  const rot = o.rotulo ? pecaRotulo({ texto: o.rotulo, escuro: !claro, _interno: true }, F) : "";
  const fio = o.rotulo ? `<div style="height:2px;background:${corTexto};opacity:${claro ? 1 : .9};margin:18px 0 26px;width:${Math.round(F.largura * 0.13)}px"></div>` : "";
  const sombra = claro ? "" : `text-shadow:0 2px 14px ${rgba("#000000", .45)}`;
  return `${fundo}<div class="bloco" style="text-align:left">
    ${rot}${fio}
    <div style="font-weight:500;font-size:${tam}px;line-height:1.08;letter-spacing:-.01em;color:${corTexto};${sombra}">${enfatiza(o.texto, !claro)}</div>
  </div>`;
}

function pecaCartao(o, F) {
  const esc = !!o.escuro;
  const fundo = esc ? C.espresso.hex : (o.sobrePapel ? C.papel2.hex : C.papel.hex);
  const texto = esc ? C.papel.hex : C.tinta.hex;
  const raio = o.raio || (esc ? K.cartao.escuro.raio[1] : K.cartao.raio[1]);
  const respiro = o.respiro || K.cartao.respiro[1];
  const tam = o.tamanho || Math.round(F.largura * 0.052);
  const rot = o.rotulo ? pecaRotulo({ texto: o.rotulo, escuro: esc, _interno: true }, F) + `<div style="height:14px"></div>` : "";
  const tit = o.titulo ? `<div style="font-weight:500;font-size:${Math.round(tam * 1.25)}px;line-height:1.12;margin-bottom:${Math.round(respiro * .4)}px">${enfatiza(o.titulo, esc)}</div>` : "";
  return `<div class="bloco"><div style="background:${fundo};color:${texto};border-radius:${raio}px;
    border:1px solid ${rgba(C.tinta.hex, esc ? .35 : K.cartao.borda.opacidade)};
    padding:${respiro}px;box-shadow:${SOMBRA};font-size:${tam}px;line-height:1.3">
    ${rot}${tit}<div>${enfatiza(o.texto, esc)}</div></div></div>`;
}

function pecaPilula(o, F) {
  const cheia = !!o.preenchida;
  const tam = o.tamanho || Math.round(F.largura * 0.032);
  const fundo = cheia ? C.tinta.hex : "transparent";
  const texto = cheia ? C.papel.hex : (o.escuro ? C.papel.hex : C.tinta.hex);
  const borda = cheia ? C.tinta.hex : (o.escuro ? C.papel.hex : C.tinta.hex);
  let ponto = "";
  if (o.ponto) {
    verdesNaPeca++;
    ponto = `<span class="ponto" style="width:${K.pilula.ponto.diametro}px;height:${K.pilula.ponto.diametro}px;background:${C.verde.hex}"></span>`;
  }
  const seta = o.seta ? `<span class="seta">${K.pilula.seta.glifo}</span>` : "";
  return `<div class="bloco" style="text-align:${o.alinhar || "center"}">
    <div class="pilula" style="background:${fundo};color:${texto};border:1px solid ${borda};
      font-size:${tam}px;padding:${Math.round(tam * .62)}px ${Math.round(tam * 1.15)}px;gap:${Math.round(tam * .5)}px">
      ${ponto}<span>${escapa(o.texto)}</span>${seta}</div></div>`;
}

function pecaNumero(o, F) {
  if (o.verde !== false) verdesNaPeca++;
  const cor = o.verde === false ? C.tinta.hex : (o.escuro ? C.verdeClaro.hex : C.verde.hex);
  const tam = o.tamanho || Math.round(F.largura * 0.3);
  const rot = o.rotulo ? pecaRotulo({ texto: o.rotulo, escuro: o.escuro, _interno: true }, F) : "";
  return `<div class="bloco" style="text-align:center">
    <div style="font-weight:500;font-size:${tam}px;letter-spacing:${K.numero.espacamento}em;line-height:.95;color:${cor}">${escapa(o.texto)}</div>
    ${rot ? `<div style="margin-top:10px">${rot}</div>` : ""}</div>`;
}

function pecaLista(o, F) {
  verdesNaPeca++;
  const esc = !!o.escuro;
  const corIdx = esc ? C.verdeClaro.hex : C.verde.hex;
  const tam = o.tamanho || Math.round(F.largura * 0.055);
  const fundo = esc ? C.espresso.hex : C.papel.hex;
  const texto = esc ? C.papel.hex : C.tinta.hex;
  const corpo = o.texto ? `<div style="font-size:${Math.round(tam * .72)}px;color:${esc ? C.espressoSuave.hex : C.tintaSuave.hex};margin-top:12px;line-height:1.35">${enfatiza(o.texto, esc)}</div>` : "";
  return `<div class="bloco"><div style="background:${fundo};color:${texto};border-radius:${K.cartao.raio[1]}px;
    border:1px solid ${rgba(C.tinta.hex, esc ? .35 : K.cartao.borda.opacidade)};padding:${K.cartao.respiro[1]}px;box-shadow:${SOMBRA}">
    <div class="rotulo" style="color:${corIdx};font-size:${Math.round(tam * .45)}px">${escapa(o.indice || "01")}</div>
    <div style="font-weight:500;font-size:${tam}px;line-height:1.14;margin-top:10px">${enfatiza(o.titulo || o.texto, esc)}</div>
    ${o.titulo ? corpo : ""}</div></div>`;
}

function pecaCitacao(o, F) {
  verdesNaPeca++;
  const esc = o.escuro !== false;
  const texto = esc ? C.papel.hex : C.tinta.hex;
  const tam = o.tamanho || Math.round(F.largura * 0.068);
  const corBarra = esc ? C.verdeClaro.hex : C.verde.hex;
  const ass = o.assinatura === false ? "" :
    `<div class="rotulo" style="color:${esc ? C.espressoSuave.hex : C.tintaApagada.hex};font-size:${Math.round(F.largura * 0.024)}px;margin-top:${Math.round(tam * .6)}px">${escapa(typeof o.assinatura === "string" ? o.assinatura : K.citacao.assinatura)}</div>`;
  return `<div class="bloco">
    <div style="border-left:${K.citacao.barra.largura}px solid ${corBarra};padding-left:${Math.round(tam * .5)}px">
      <div style="font-style:italic;font-weight:400;font-size:${tam}px;line-height:1.22;color:${texto}">${escapa(o.texto)}</div>
      ${ass}</div></div>`;
}

function pecaAssinatura(o, F) {
  const esc = !!o.escuro;
  const cor = esc ? C.papel.hex : C.tinta.hex;
  const sec = esc ? C.espressoSuave.hex : C.tintaSuave.hex;
  const tam = o.tamanho || Math.round(F.largura * 0.058);
  const site = o.site === false ? "" :
    `<div class="rotulo" style="color:${sec};font-size:${Math.round(F.largura * 0.022)}px;margin-top:${Math.round(tam * .7)}px;text-align:center">${escapa(K.assinatura.site)}</div>`;
  return envolve(`<div style="text-align:center">
    <div style="display:inline-flex;align-items:center;gap:${Math.round(tam * .42)}px">
      <span style="font-weight:600;letter-spacing:${K.assinatura.espacamento}em;font-size:${tam}px;color:${cor}">${K.assinatura.texto}</span>
      <span style="width:1px;height:${Math.round(tam * 1.15)}px;background:${rgba(cor, .45)}"></span>
      <span class="rotulo" style="color:${sec};font-size:${Math.round(tam * .3)}px;text-align:left;line-height:1.45">
        ${K.assinatura.secundario.map((l) => escapa(l)).join("<br>")}</span>
    </div>${site}</div>`, o);
}

function pecaMonograma(o, F) {
  const lado = o.tamanho || Math.round(F.largura * 0.11);
  return `<div class="bloco" style="text-align:${o.alinhar || "center"}">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:${lado}px;height:${lado}px;
      background:${C.tinta.hex};border-radius:${Math.round(lado * .24)}px;box-shadow:${SOMBRA}">
      <span style="font-weight:600;font-size:${Math.round(lado * .62)}px;color:${C.papel.hex};line-height:1">${K.monograma.letra}</span>
    </div></div>`;
}

function pecaCartela(o, F) {
  const esc = !!o.escuro;
  const fundo = esc ? C.espresso.hex : C.papel.hex;
  const texto = esc ? C.papel.hex : C.tinta.hex;
  const tam = o.tamanho || Math.round(F.largura * 0.085);
  const rot = o.rotulo ? pecaRotulo({ texto: o.rotulo, escuro: esc, _interno: true }, F) + "<div style='height:22px'></div>" : "";
  const ass = o.comAssinatura ? `<div style="position:absolute;left:0;right:0;bottom:${Math.round(F.altura * 0.11)}px">${pecaAssinatura({ escuro: esc, _interno: true }, F)}</div>` : "";
  return `<div class="cheia" style="background:${fundo}"></div>
    <div class="bloco" style="text-align:center;color:${texto}">
      ${rot}<div style="font-weight:500;font-size:${tam}px;line-height:1.14">${enfatiza(o.texto, esc)}</div>
    </div>${ass}`;
}


function pecaLegenda(o, F) {
  // A legenda do ESTILO: serifa, caixa normal, centralizada, na faixa de baixo.
  // Ela sai como PNG do tamanho do quadro igual às outras peças, então o montar
  // só sobrepõe e anima. Assim o peso 600 e o entrelinha saem exatos.
  const L = estilo.legenda;
  const cfg = F.legenda;
  const claro = !!o.sobreClaro;
  const tam = o.tamanho || cfg.tamanhoMax;
  const cor = claro ? L.corSobreClaro : L.corSobreVideo;
  const s = L.sombraSobreVideo;
  const sombra = claro ? "" : `text-shadow:${s.x}px ${s.y}px ${s.desfoque}px ${rgba(s.cor, s.opacidade)}`;
  const faixa = cfg.faixaY;
  const alturaFaixa = Math.max(faixa[1] - faixa[0], tam * (cfg.linhasMax + 0.6));
  // Centralizada no quadro, mas com recuo que a segura dentro da zona dos dois lados.
  const centro = F.largura / 2;
  const recuo = Math.round(centro - Math.min(centro - F.zonaSegura.x1, F.zonaSegura.x2 - centro));
  return `<div style="position:absolute;left:0;right:0;top:${faixa[0]}px;height:${alturaFaixa}px;
    display:flex;align-items:center;justify-content:center;padding:0 ${recuo}px">
    <div style="font-weight:${estilo.fonte.pesos.legenda};font-size:${tam}px;line-height:1.18;
      text-align:${cfg.alinhamento === "centro" ? "center" : cfg.alinhamento};color:${cor};${sombra}">${enfatiza(o.texto, !claro)}</div>
  </div>`;
}

function pecaLinha(o, F) {
  const larg = o.largura || Math.round(F.largura * 0.14);
  return `<div class="bloco" style="text-align:${o.alinhar || "center"}">
    <div style="display:inline-block;width:${larg}px;height:${o.espessura || K.linha.largura[1]}px;background:${o.escuro ? C.papel.hex : C.tinta.hex}"></div></div>`;
}

function pecaImagem(o, F) {
  if (!o.src) throw new Error("a peça imagem precisa de --src caminho/da/imagem.jpg");
  if (!existsSync(o.src)) throw new Error(`não achei a imagem: ${o.src}`);
  const larg = o.largura || Math.round(F.largura * 0.76);
  const alt = o.altura || Math.round(larg * (o.proporcao || 1.25));
  const raio = o.raio || (larg < F.largura * 0.4 ? K.imagem.raioPequeno : K.imagem.raio);
  const legenda = o.legenda ? `<div class="rotulo" style="color:${o.escuro ? C.espressoSuave.hex : C.tintaApagada.hex};font-size:${Math.round(F.largura * 0.022)}px;margin-top:14px">${escapa(o.legenda)}</div>` : "";
  return `<div class="bloco" style="text-align:center">
    <img src="file://${o.src}" style="width:${larg}px;height:${alt}px;object-fit:cover;display:block;margin:0 auto;
      border-radius:${raio}px;border:${K.imagem.borda.largura}px solid ${rgba(K.imagem.borda.cor, K.imagem.borda.opacidade)};box-shadow:${SOMBRA}">
    ${legenda}</div>`;
}

const PECAS = {
  legenda: pecaLegenda,
  rotulo: pecaRotulo, gancho: pecaGancho, cartao: pecaCartao, pilula: pecaPilula,
  numero: pecaNumero, lista: pecaLista, citacao: pecaCitacao, assinatura: pecaAssinatura,
  monograma: pecaMonograma, cartela: pecaCartela, linha: pecaLinha, imagem: pecaImagem,
};

// ---------- a página ----------

function paginaDaPeca(tipo, o, F) {
  const fn = PECAS[tipo];
  if (!fn) throw new Error(`peça desconhecida: ${tipo}. Tem: ${Object.keys(PECAS).join(", ")}`);

  const Z = F.zonaSegura;
  // A zona segura do ESTILO é torta (no Reels, 60 à esquerda e 140 à direita). Peça
  // centralizada no quadro só cabe nos dois lados se a largura for o dobro do lado
  // mais apertado; usar a largura cheia da zona joga o texto pra fora à direita.
  const centro = F.largura / 2;
  const larguraCentrada = 2 * Math.min(centro - Z.x1, Z.x2 - centro);
  const larguraPadrao = tipo === "gancho" ? F.largura - F.gancho.margemLateral * 2
    : o.x === "esquerda" || o.x === "direita" ? Z.x2 - Z.x1
    : larguraCentrada;
  const larguraMax = o.larguraMax || larguraPadrao;

  // y é o topo da peça. "centro" centraliza na vertical.
  const posY = o.y === "centro" || o.y == null
    ? `top:50%;transform:translateY(-50%)`
    : `top:${Number(o.y)}px`;
  const posX = o.x === "esquerda" ? `left:${tipo === "gancho" ? F.gancho.margemLateral : Z.x1}px`
    : o.x === "direita" ? `right:${Z.largura ?? (F.largura - Z.x2)}px`
    : typeof o.x === "number" || /^\d+$/.test(String(o.x || "")) ? `left:${Number(o.x)}px`
    : `left:50%;margin-left:${-Math.round(larguraMax / 2)}px`;

  const corpo = fn(o, F);
  // cartela, gancho e legenda pintam o quadro inteiro; as outras moram dentro do .bloco.

  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>
${faceDaFonte()}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${F.largura}px;height:${F.altura}px;background:transparent;overflow:hidden}
body{font-family:'STIX Two Text',Georgia,serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
em{font-style:italic;font-weight:inherit}
.quadro{position:relative;width:${F.largura}px;height:${F.altura}px}
.cheia{position:absolute;inset:0}
.scrim{position:absolute;inset:0}
.bloco{position:absolute;width:${larguraMax}px;${posX};${posY}}
.rotulo{font-weight:${K.rotulo.peso};text-transform:uppercase;letter-spacing:${K.rotulo.espacamento}em}
.pilula{display:inline-flex;align-items:center;border-radius:999px;font-weight:500;white-space:nowrap}
.ponto{border-radius:50%;flex:0 0 auto;animation:pulso ${K.pilula.ponto.pulso}s ${estilo.movimento.curva} infinite}
.seta{display:inline-block;animation:desliza .6s ${estilo.movimento.curva} .25s both}
@keyframes pulso{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.78)}}
@keyframes desliza{from{transform:translateX(0)}to{transform:translateX(${K.pilula.seta.desliza}px)}}
</style><div class="quadro">${corpo}</div></html>`;
}

/** Peças que pintam o quadro todo de propósito: nelas o canto opaco é esperado. */
const SANGRIA = new Set(["cartela", "gancho"]);

/** Lê os pixels crus de um pedacinho do PNG. Nada de signalstats: o yuv é de faixa
 *  limitada e aí branco puro (235) e papel (226) ficam perto demais pra decidir. */
async function cantoCru(png, lado = 4) {
  const cru = png.replace(/\.png$/i, ".canto.raw");
  await roda("ffmpeg", ["-y", "-v", "error", "-i", png,
    "-vf", `crop=${lado}:${lado}:0:0`, "-pix_fmt", "rgba", "-f", "rawvideo", cru]);
  const b = readFileSync(cru);
  rmSync(cru, { force: true });
  const px = [];
  for (let i = 0; i + 3 < b.length; i += 4) px.push([b[i], b[i + 1], b[i + 2], b[i + 3]]);
  return px;
}

/** O Chromium sai com código 0 até quando mostra a página de erro dele, que é
 *  branca e opaca. A prova de que a página carregou está no pixel do canto. */
async function confereCanto(png, tipo) {
  const quebrou = () => new Error(
    `${basename(png)} saiu com a cara da página de erro do Chromium. ` +
    `Quase sempre é caminho relativo no file:// ou fonte faltando (rode node fontes.mjs). ` +
    `Abra o HTML que fica ao lado do PNG pra ver o que o navegador recebeu.`
  );

  let px;
  try { px = await cantoCru(png); } catch { return; }   // sem leitura, sem veredito
  if (!px.length) return;

  if (!SANGRIA.has(tipo)) {
    // Peça comum: o canto do quadro tem que estar vazio.
    if (px.every(([, , , a]) => a > 8)) throw quebrou();
    return;
  }
  // Peça de sangria: opaca de propósito, mas nenhuma cor do ESTILO é branco puro.
  // Papel é 246,245,241; espresso é 18,18,16. A página de erro é 255,255,255.
  if (px.every(([r, g, b, a]) => a > 250 && r > 252 && g > 252 && b > 252)) throw quebrou();
}

async function tiraFoto(html, png, F, tempoVirtual = 400) {
  // file:// só engole caminho absoluto. Relativo vira a página de erro do Chromium,
  // que é branca e opaca e passa despercebida até o render ficar pronto.
  const alvo = resolve(png);
  const tmp = alvo.replace(/\.png$/i, ".html");
  writeFileSync(tmp, html);
  await roda(CHROMIUM, [
    "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
    "--force-device-scale-factor=1", "--default-background-color=00000000",
    `--virtual-time-budget=${tempoVirtual}`,
    `--window-size=${F.largura},${F.altura}`,
    `--screenshot=${alvo}`, `file://${tmp}`,
  ]).catch((e) => { if (!existsSync(alvo)) throw e; });
  if (!existsSync(alvo)) { throw new Error("o Chromium não gerou o PNG: " + alvo); }
  return tmp;
}

export async function renderizaPeca(tipo, o, nomeFormato = "reels") {
  const F = formato(nomeFormato);
  verdesNaPeca = 0;
  for (const campo of ["texto", "titulo", "rotulo"]) if (o[campo]) limpaVicios(o[campo]);

  const html = paginaDaPeca(tipo, o, F);
  const saida = resolve(o.saida || join(pasta(join(TRABALHO, "_pecas")), `${tipo}-${Date.now()}.png`));
  pasta(dirname(saida));

  const quadros = Number(o.quadros || 1);
  const feitos = [];
  if (quadros > 1) {
    const fps = Number(o.fps || F.fps);
    const base = saida.replace(/\.png$/i, "");
    for (let i = 0; i < quadros; i++) {
      const png = `${base}.${String(i).padStart(4, "0")}.png`;
      // O Chromium adianta as animações pelo tempo virtual, então cada quadro sai no ponto certo.
      const tmp = await tiraFoto(html, png, F, 400 + Math.round((i * 1000) / fps));
      if (i === 0) await confereCanto(png, tipo);
      rmSync(tmp, { force: true });
      feitos.push(resolve(png));
    }
  } else {
    const tmp = await tiraFoto(html, saida, F);
    await confereCanto(saida, tipo).finally(() => rmSync(tmp, { force: true }));
    feitos.push(saida);
  }

  if (verdesNaPeca > estilo.regraDoVerde.maxElementosPorTela) {
    aviso(`${verdesNaPeca} elementos verdes nessa peça. O ESTILO.md deixa ${estilo.regraDoVerde.maxElementosPorTela} por tela.`);
  }
  return { arquivos: feitos, verdes: verdesNaPeca };
}

// ---------- linha de comando ----------

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const nomeFormato = args.includes("--formato") ? args[args.indexOf("--formato") + 1] : "reels";

  if (args.includes("--json")) {
    const lista = JSON.parse(readFileSync(args[args.indexOf("--json") + 1], "utf8"));
    titulo("Kit de peças");
    for (const p of (Array.isArray(lista) ? lista : lista.pecas)) {
      const { arquivos } = await renderizaPeca(p.tipo, p, p.formato || nomeFormato);
      conta(`  ${p.tipo.padEnd(11)} ${basename(arquivos[0])}${arquivos.length > 1 ? ` (+${arquivos.length - 1} quadros)` : ""}`);
    }
  } else {
    const tipo = args.find((a) => !a.startsWith("--"));
    if (!tipo) {
      console.error(`uso: node peca.mjs <${Object.keys(PECAS).join("|")}> --texto "..." [--y 300] [--x centro|esquerda]`);
      console.error(`     node peca.mjs --json roteiro-de-pecas.json`);
      process.exit(1);
    }
    const o = {};
    for (let i = 0; i < args.length; i++) {
      if (!args[i].startsWith("--")) continue;
      const chave = args[i].slice(2);
      const prox = args[i + 1];
      // "02" precisa continuar "02": zero à esquerda é texto, não número.
      const ehNumero = /^-?\d+(\.\d+)?$/.test(prox || "") && !/^0\d/.test(prox);
      o[chave] = prox == null || prox.startsWith("--") ? true : (ehNumero ? Number(prox) : prox);
    }
    const { arquivos, verdes } = await renderizaPeca(tipo, o, nomeFormato);
    titulo(`Peça · ${tipo}`);
    arquivos.forEach((a) => conta(`  ${a}`));
    conta(`  ${verdes} elemento(s) verde(s)`);
  }
}
