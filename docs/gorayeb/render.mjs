/* Renderiza um carrossel da Gorayeb a partir de um JSON de slides.
 *
 *   node docs/gorayeb/render.mjs docs/gorayeb/carrosseis/<nome>.json
 *
 * Sai em docs/gorayeb/saida/<nome>/pag-01.png ... (1080×1350).
 * Cada slide do JSON tem { tipo, ...campos }. Tipos em `monta()`.
 */
import playwright from "/opt/node-tools/node_modules/playwright/index.js";
const { chromium } = playwright;
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { FIGURAS } from "./figuras.mjs";
import { basename, dirname, resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const esc = (s = "") => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

/* Viúva é palavra sozinha fechando um bloco. Costura as duas últimas
   palavras de cada linha com espaço rígido, pra nunca sobrar uma só.
   Em título e frase curta costura também monossílabos no meio da linha. */
const NBSP = "\u00a0";
const CURTAS = /^(a|à|ao|as|às|o|os|e|é|em|no|na|nos|nas|de|do|da|dos|das|um|uma|uns|umas|por|pra|pro|que|se|com|sem|sob|ou|já|só|até|mas|nem)$/i;
function costura(txt, agressivo = false) {
  return txt
    .split("\n")
    .map((linha) => {
      let ps = linha.split(/ +/).filter(Boolean);
      if (ps.length < 2) return linha;
      if (agressivo) {
        /* junta preposição e artigo à palavra seguinte */
        const out = [];
        for (let i = 0; i < ps.length; i++) {
          if (CURTAS.test(ps[i]) && i < ps.length - 1) {
            out.push(ps[i] + NBSP + ps[i + 1]);
            i++;
          } else out.push(ps[i]);
        }
        ps = out;
      }
      if (ps.length >= 2) ps[ps.length - 2] += NBSP + ps.pop();
      return ps.join(" ");
    })
    .join("\n");
}

/* _texto_ sublinha, *texto* engrossa, quebra de linha vira <br> */
const rico = (s = "", agressivo = false) =>
  esc(costura(String(s), agressivo))
    .replace(/_([^_]+)_/g, '<span class="marca-texto">$1</span>')
    .replace(/\*([^*]+)\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

/* títulos, teses e frases curtas levam costura agressiva */
const titulo = (s) => rico(s, true);

const ARROBA = '<div class="arroba">@gorayebadvocacia</div>';
const ASSINA = (classe = "") => `<div class="assinatura ${classe}">Do agro, pelo agro.</div>`;
/* Logos oficiais da pasta ENTREGA > LOGOS E SÍMBOLOS do Drive. Nunca
   redesenhar: é só escolher a versão certa pro fundo. */
const LOCKUP = (altura = 74, claro = true) =>
  `<img class="logo" style="height:${altura}px" alt="Gorayeb Advocacia"
     src="../assets/logo-horizontal-${claro ? "claro" : "escuro"}.png">`;

function foto(s) {
  if (!s.foto) return "";
  const veu = s.veu === "marrom" ? "veu-marrom" : s.veu === "topo" ? "veu-topo" : "veu-verde";
  return `<img class="foto" src="${esc(s.foto)}" alt=""><div class="${veu}"></div>`;
}

/* fundos claros: a logo vai na versão escura e o texto em verde */
const CLAROS = new Set(["creme", "areia", "offwhite", "branco"]);

function monta(s) {
  const claro = !CLAROS.has(s.fundo) || !!s.foto;
  const LOGO = (h) => LOCKUP(h, claro);
  const cls = ["slide", "vinheta"];
  if (s.foto && !s.meiaFoto) cls.push("bg-foto");
  else if (s.fundo === "creme") cls.push("bg-creme");
  else if (s.fundo === "areia") cls.push("bg-areia");
  else if (s.fundo === "offwhite") cls.push("bg-offwhite");
  else if (s.fundo === "branco") cls.push("bg-branco");
  else if (s.fundo === "bordo") cls.push("bg-bordo");
  else if (s.fundo === "marrom") cls.push("bg-marrom");
  else cls.push("bg-verde");

  /* textura: listras, marca d'água ou nada. Nenhuma é padrão em todo slide. */
  if (s.textura === "listras") cls.push("listras");
  if (s.textura === "marca") cls.push("marca-dagua");
  if (s.textura === "marca-baixo") cls.push("marca-dagua", "canto-baixo");
  if (s.textura === "marca-esq") cls.push("marca-dagua", "canto-esq");
  if (s.borda === "dourada") cls.push("borda-dourada");
  if (s.borda === "bordo") cls.push("borda-bordo");
  if (s.meiaFoto) cls.push("meia-foto");

  let corpo = "";
  switch (s.tipo) {
    /* capa: foto + título grande + gancho + pílula de arraste + lockup */
    case "capa":
      corpo = `
        ${LOGO(70)}
        <div class="espaco-lg"></div>
        <h1 class="titulo ${s.escala || ""}">${titulo(s.titulo)}</h1>
        ${s.gancho ? `<div class="espaco"></div><div class="caixa-fina corpo menor">${titulo(s.gancho)}</div>` : ""}
        <div class="rodape">
          <div class="pilula">${esc(s.arraste || "Arrasta pro lado")} <span>▶</span></div>
          ${ASSINA()}
        </div>`;
      break;

    /* tese: a frase-chave entre dois fios dourados, com um parágrafo abaixo */
    case "tese":
      corpo = `
        ${ARROBA}
        <div class="meio">
          <div class="entre-fios"><p class="tese ${s.centro ? "centro" : ""}">${titulo(s.tese)}</p></div>
          ${s.texto ? `<div class="espaco"></div><p class="corpo">${rico(s.texto)}</p>` : ""}
        </div>
        <div class="rodape"><span></span>${ASSINA()}</div>`;
      break;

    /* foto com um bloco de texto embaixo */
    case "foto-texto":
      corpo = `
        ${ARROBA}
        <div class="empurra"></div>
        ${s.titulo ? `<h2 class="titulo menor">${titulo(s.titulo)}</h2><div class="espaco"></div>` : ""}
        ${s.texto ? `<p class="corpo">${rico(s.texto)}</p>` : ""}
        <div class="espaco-lg"></div>
        <div class="rodape"><span></span>${ASSINA()}</div>`;
      break;

    /* citação em itálico dentro de caixa de borda fina, centrada no slide */
    case "citacao":
      corpo = `
        ${ARROBA}
        <div class="meio"><div class="caixa-fina"><p class="citacao">${titulo(s.citacao)}</p></div></div>
        <div class="rodape"><span></span>${ASSINA()}</div>`;
      break;

    /* lista curta: até 4 itens, um por linha */
    case "lista":
      corpo = `
        ${ARROBA}
        <div class="empurra"></div>
        ${s.titulo ? `<h2 class="titulo menor">${titulo(s.titulo)}</h2><div class="espaco"></div>` : ""}
        <ul class="lista">${(s.itens || []).map((i) => `<li><span>${rico(i)}</span></li>`).join("")}</ul>
        ${s.remate ? `<div class="espaco"></div><p class="tese">${titulo(s.remate)}</p>` : ""}
        <div class="empurra"></div>
        <div class="rodape"><span></span>${ASSINA()}</div>`;
      break;

    /* dado: um número grande com a leitura embaixo */
    case "dado":
      corpo = `
        ${ARROBA}
        <div class="empurra"></div>
        <p class="titulo maior dourado">${rico(s.numero)}</p>
        <div class="espaco-sm"></div>
        <p class="tese">${titulo(s.leitura)}</p>
        ${s.texto ? `<div class="espaco"></div><p class="corpo">${rico(s.texto)}</p>` : ""}
        <div class="empurra"></div>
        <div class="rodape"><span></span>${ASSINA()}</div>`;
      break;

    /* fecho: síntese + CTA + assinatura + lockup */
    case "fecho":
      corpo = `
        ${ARROBA}
        <div class="empurra"></div>
        <p class="titulo menor centro" style="text-align:center">${titulo(s.sintese)}</p>
        ${s.cta ? `<div class="espaco"></div><div class="centro" style="text-align:center"><span class="cta">${rico(s.cta)}</span></div>` : ""}
        <div class="espaco-lg"></div>
        <div class="centro" style="text-align:center">
          <p class="titulo menor" style="font-size:34px">Do agro, pelo agro.</p>
          <div class="espaco"></div>
          <div style="display:flex;justify-content:center">${LOGO(66)}</div>
        </div>
        <div class="empurra"></div>`;
      break;

    /* figura: donut, barras, mapa ou números em diagonal */
    case "figura": {
      const fab = FIGURAS[s.figura];
      if (!fab) throw new Error(`figura desconhecida: ${s.figura}`);
      corpo = `
        ${ARROBA}
        ${s.titulo ? `<div class="espaco"></div><h2 class="titulo menor">${titulo(s.titulo)}</h2>` : ""}
        <div class="meio">${fab(s)}</div>
        <div class="rodape"><span></span>${ASSINA()}</div>`;
      break;
    }

    default:
      throw new Error(`tipo de slide desconhecido: ${s.tipo}`);
  }
  if (s.meiaFoto) {
    return `<div class="${cls.join(" ")}">
      <div class="faixa-img"><img src="${esc(s.foto || "")}" alt=""></div>
      <div class="faixa-txt">${corpo}</div>
    </div>`;
  }
  return `<div class="${cls.join(" ")}">${foto(s)}${corpo}</div>`;
}

const specPath = resolve(process.argv[2] || "");
if (!specPath) {
  console.error("uso: node docs/gorayeb/render.mjs <spec.json>");
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const nome = spec.id || basename(specPath).replace(/\.json$/, "");
const saida = join(AQUI, "saida", nome);
mkdirSync(saida, { recursive: true });

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="base.css"></head><body style="background:#333">
${spec.slides.map(monta).join("\n")}
</body></html>`;
const htmlPath = join(AQUI, "template", `_${nome}.html`);
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
/* centra o jugo exatamente no vão entre o F e o G de cada lockup */
await page.evaluate(() => {
  for (const m of document.querySelectorAll(".marca")) {
    const f = m.querySelector(".f").getBoundingClientRect();
    const g = m.querySelector(".g").getBoundingClientRect();
    const base = m.getBoundingClientRect();
    m.style.setProperty("--vao", `${(f.right + g.left) / 2 - base.left}px`);
  }
});

const nos = await page.$$(".slide");
for (const [i, no] of nos.entries()) {
  const arq = join(saida, `pag-${String(i + 1).padStart(2, "0")}.png`);
  await no.screenshot({ path: arq });
  console.log(arq);
}
await browser.close();
console.log(`${nos.length} slides em ${saida}`);
