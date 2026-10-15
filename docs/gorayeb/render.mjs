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
/* Logos oficiais da pasta ENTREGA > LOGOS E SÍMBOLOS do Drive. Nunca
   redesenhar: é só escolher a versão certa pro fundo. */
const LOCKUP = (altura = 74, claro = true) =>
  `<img class="logo" style="height:${altura}px" alt="Gorayeb Advocacia"
     src="../assets/logo-horizontal-${claro ? "claro" : "escuro"}.png">`;

function foto(s) {
  if (!s.foto) return "";
  const img = `<img class="foto" src="${esc(s.foto)}" alt="">`;
  /* capa e perspectiva trazem o próprio véu, em dois gradientes */
  if (s.veu === "nenhum" || s.tipo === "capa-foto" || s.tipo === "perspectiva") return img;
  const veu = s.veu === "marrom" ? "veu-marrom" : s.veu === "topo" ? "veu-topo" : "veu-verde";
  return `${img}<div class="${veu}"></div>`;
}

/* fundos claros: a logo vai na versão escura e o texto em verde */
const CLAROS = new Set(["creme", "areia", "offwhite", "branco"]);

function monta(s) {
  const claro = !CLAROS.has(s.fundo) || !!s.foto;
  const LOGO = (h) => LOCKUP(h, claro);
  const cls = ["slide", "vinheta"];
  if (s.foto && !s.meiaFoto && s.tipo !== "corpo-foto") cls.push("bg-foto");
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
  if (s.tipo === "fecho" && s.foto) cls.push("fecho-foto");
  if (s.tipo === "capa-foto" || s.tipo === "perspectiva") cls.push("capa-foto", "bg-foto");
  if (s.tipo === "corpo-foto") cls.push("corpo-foto", "bg-verde");

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
        <div class="rodape"></div>`;
      break;

    /* foto com um bloco de texto embaixo */
    case "foto-texto":
      corpo = `
        ${ARROBA}
        <div class="empurra"></div>
        ${s.titulo ? `<h2 class="titulo menor">${titulo(s.titulo)}</h2><div class="espaco"></div>` : ""}
        ${s.texto ? `<p class="corpo">${rico(s.texto)}</p>` : ""}
        <div class="espaco-lg"></div>
        <div class="rodape"></div>`;
      break;

    /* citação em itálico dentro de caixa de borda fina, centrada no slide */
    case "citacao":
      corpo = `
        ${ARROBA}
        <div class="meio"><div class="caixa-fina"><p class="citacao">${titulo(s.citacao)}</p></div></div>
        <div class="rodape"></div>`;
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
        <div class="rodape"></div>`;
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
        <div class="rodape"></div>`;
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
          <div style="display:flex;justify-content:center">${LOGO(72)}</div>
        </div>
        <div class="empurra"></div>`;
      break;


    /* capa de foto: foto sangrando, marca no alto, etiqueta e título no pé.
       Modelo que o Victor mandou, enxugado: sem carimbo e sem a assinatura
       repetida no topo. */
    case "capa-foto":
      corpo = `
        <div class="veu-capa"></div>
        ${LOGO(66)}
        <div class="empurra"></div>
        ${s.etiqueta ? `<span class="etiqueta"><span class="bolota"></span>${esc(s.etiqueta)}</span>` : ""}
        <h1 class="titulo-capa ${s.escala || ""}">${titulo(s.titulo)}</h1>
        ${s.sub ? `<p class="sub-capa">${titulo(s.sub)}</p>` : ""}`;
      break;

    /* corpo de foto: foto em cima, chapa embaixo com a marca d'água da casa */
    case "corpo-foto": {
      const [l1, l2] = String(s.titulo || "").split("\n");
      corpo = `
        <div class="faixa-img"><img src="${esc(s.foto || "")}" alt=""></div>
        <div class="chapa">
          <h2 class="titulo-corpo">
            <span class="l1">${titulo(l1 || "")}</span>
            ${l2 ? `<span class="l2">${titulo(l2)}</span>` : ""}
          </h2>
          ${(s.paragrafos || []).map((t) => `<p class="texto-corpo">${rico(t)}</p>`).join("")}
        </div>`;
      break;
    }

    /* gráfico em perspectiva: as cifras deitadas no plano da foto, seguindo
       a diagonal do terreno, diminuindo conforme se afastam. */
    case "perspectiva": {
      const its = (s.itens || []).slice(0, 4);
      const g = s.guia || {};
      const x0 = g.x0 ?? 10, y0 = g.y0 ?? 42, x1 = g.x1 ?? 62, y1 = g.y1 ?? 88;
      const giro = g.giro ?? 16, incl = g.incl ?? -9;
      const e0 = g.escala0 ?? 1, e1 = g.escala1 ?? 0.62;
      const fios = its
        .map((_, k) => {
          const t = its.length > 1 ? k / (its.length - 1) : 0;
          const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
          return `<line x1="${(x - 7).toFixed(1)}%" y1="${(y + 1.4).toFixed(1)}%" x2="${(x + 34).toFixed(1)}%" y2="${(y - 7).toFixed(1)}%"
                    stroke="rgba(235,227,200,.9)" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
        })
        .join("");
      const marcas = its
        .map((it, k) => {
          const t = its.length > 1 ? k / (its.length - 1) : 0;
          const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
          const e = e0 + (e1 - e0) * t;
          return `<div class="persp-item" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;
                       transform:rotate(${giro}deg) skewX(${incl}deg) scale(${e.toFixed(3)})">
                    <span class="n" style="font-size:${s.corpoNum || 88}px">${esc(it.numero)}</span>
                    <span class="r" style="font-size:${s.corpoRot || 27}px">${esc(it.rotulo)}</span>
                  </div>`;
        })
        .join("");
      corpo = `
        <div class="veu-capa"></div>
        ${LOGO(60)}
        <svg class="persp-fios" viewBox="0 0 100 100" preserveAspectRatio="none">${fios}</svg>
        <div class="perspectiva">${marcas}</div>
        <div class="empurra"></div>
        <div class="pe-persp">
          ${s.titulo ? `<h2 class="titulo menor">${titulo(s.titulo)}</h2>` : ""}
          ${s.fonte ? `<div class="espaco-sm"></div><p class="fonte">Fonte: ${esc(s.fonte)}</p>` : ""}
        </div>`;
      break;
    }

    /* figura: donut, barras, mapa ou números em diagonal */
    case "figura": {
      const fab = FIGURAS[s.figura];
      if (!fab) throw new Error(`figura desconhecida: ${s.figura}`);
      corpo = `
        ${ARROBA}
        ${s.titulo ? `<div class="espaco"></div><h2 class="titulo menor">${titulo(s.titulo)}</h2>` : ""}
        <div class="meio">${fab(s)}</div>
        <div class="rodape"></div>`;
      break;
    }

    default:
      throw new Error(`tipo de slide desconhecido: ${s.tipo}`);
  }
  if (s.tipo === "corpo-foto") {
    return `<div class="${cls.join(" ")}">${corpo}</div>`;
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
