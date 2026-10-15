/* Figuras dos carrosséis: donut, barras, mapa, números, tabela e cerca.
 *
 * Regras que valem pra todas:
 *  - no máximo dois dados coloridos por figura; o resto é neutro;
 *  - toda fatia e toda barra carrega rótulo direto, nunca só cor;
 *  - marca fina, grade discreta, um eixo só;
 *  - as cores saem da paleta oficial da marca, conferidas contra a chapa
 *    verde: dourado #b8943d, terracota #a8552c e areia #d4c9aa.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const esc = (s = "") => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
/* costura a última palavra na anterior, pra não sobrar viúva */
const ec = (s = "") => {
  const ps = String(s).split(/ +/).filter(Boolean);
  if (ps.length >= 2) ps[ps.length - 2] += "\u00a0" + ps.pop();
  return esc(ps.join(" "));
};
const n2 = (v) => (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, "");

/* ---- donut de proporção ------------------------------------------------
   Um recorte em destaque contra o todo. O número do meio é a figura; o
   anel só dá a dimensão dele.                                            */
export function donut(f) {
  const R = 252, r = 178, cx = 500, cy = 300;
  const pct = Math.max(0, Math.min(100, Number(f.valor)));
  const ang = (pct / 100) * 2 * Math.PI - Math.PI / 2;
  const ponto = (a, raio) => [cx + raio * Math.cos(a), cy + raio * Math.sin(a)];
  const [x1, y1] = ponto(-Math.PI / 2, R), [x2, y2] = ponto(ang, R);
  const [x3, y3] = ponto(ang, r), [x4, y4] = ponto(-Math.PI / 2, r);
  const grande = pct > 50 ? 1 : 0;
  /* o vão de 2px entre o destaque e o resto é o anel de fundo aparecendo */
  const fatia =
    pct >= 100
      ? `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="var(--dado-1)" stroke-width="${R - r}"/>`
      : `<path d="M${n2(x1)},${n2(y1)} A${R},${R} 0 ${grande} 1 ${n2(x2)},${n2(y2)} L${n2(x3)},${n2(y3)} A${r},${r} 0 ${grande} 0 ${n2(x4)},${n2(y4)} Z" fill="var(--dado-1)"/>`;
  return `
  <div class="figura">
    <svg viewBox="0 0 1000 660" role="img" aria-label="${esc(f.alt || f.rotulo || "")}">
      <circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="var(--dado-base)" stroke-width="${R - r}"/>
      ${fatia}
      <circle cx="${cx}" cy="${cy}" r="${R + 30}" class="mapa-anel"/>
      <text x="${cx}" y="${cy - 6}" class="rot-num" style="font-size:118px" text-anchor="middle">${esc(f.destaque || pct + "%")}</text>
      <text x="${cx}" y="${cy + 54}" class="rot-txt" text-anchor="middle">${esc(f.rotulo || "")}</text>
      ${f.resto ? `<text x="${cx}" y="${cy + R + 96}" class="rot-txt" text-anchor="middle" opacity=".6">${esc(f.resto)}</text>` : ""}
    </svg>
    ${f.legenda ? `<p class="figura-legenda">${ec(f.legenda)}</p>` : ""}
    ${f.fonte ? `<p class="fonte">Fonte: ${esc(f.fonte)}</p>` : ""}
  </div>`;
}

/* ---- barras horizontais ------------------------------------------------
   Série única, rótulo e valor em cima de cada barra. Sem grade, sem eixo:
   o valor já está escrito.                                               */
export function barras(f) {
  const itens = (f.itens || []).slice(0, 5);
  const max = Math.max(...itens.map((i) => Number(i.valor)), 1);
  const alt = 54, vao = 46, x0 = 0, L = 1000;
  const h = itens.length * (alt + vao);
  const linhas = itens
    .map((it, k) => {
      const y = k * (alt + vao) + 34;
      const w = Math.max(8, (Number(it.valor) / max) * L);
      const cor = it.destaque ? "var(--dado-1)" : "var(--dado-2)";
      return `
      <text x="${x0}" y="${y - 12}" class="rot-txt">${esc(it.rotulo)}</text>
      <rect x="${x0}" y="${y}" width="${L}" height="${alt}" rx="6" class="barra-trilho"/>
      <rect x="${x0}" y="${y}" width="${n2(w)}" height="${alt}" rx="6" fill="${cor}"/>
      <text x="${n2(w > L - 230 ? w - 20 : w + 26)}" y="${y + alt - 13}" class="rot-num" style="font-size:38px"${w > L - 230 ? ' text-anchor="end" fill="var(--verde)"' : ""}>${esc(it.valorTexto || it.valor)}</text>`;
    })
    .join("");
  return `
  <div class="figura">
    <svg viewBox="0 0 1000 ${h}" role="img" aria-label="${esc(f.alt || "")}">${linhas}</svg>
    ${f.legenda ? `<p class="figura-legenda">${ec(f.legenda)}</p>` : ""}
    ${f.fonte ? `<p class="fonte">Fonte: ${esc(f.fonte)}</p>` : ""}
  </div>`;
}

/* ---- mapa com destaque -------------------------------------------------
   Silhueta apagada, um ponto de interesse em dourado e o anel fino, no
   espírito da peça de referência. A geometria vem de assets/mapas.       */
const MAPAS = JSON.parse(readFileSync(join(AQUI, "assets", "mapas", "mapas.json"), "utf8"));

export function mapa(f) {
  const m = MAPAS[f.mapa || "brasil"];
  if (!m) throw new Error(`mapa desconhecido: ${f.mapa}`);
  const [lon0, my0, lon1, my1] = m.bbox_lonlat;
  const [, , W, H] = m.viewBox.split(" ").map(Number);
  const merc = (lat) => (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2));
  const proj = (lon, lat) => [((lon - lon0) / (lon1 - lon0)) * W, ((my1 - merc(lat)) / (my1 - my0)) * H];

  const its = f.pontos || [];
  /* a bolha cresce pela raiz do valor: é a área que conta, não o raio */
  const maior = Math.max(...its.map((p) => Number(p.valor) || 0), 0);
  const raio = (p) =>
    p.raio ?? (maior > 0 && p.valor ? 26 + 36 * Math.sqrt(Number(p.valor) / maior) : 44);

  const pontos = its
    .map((p, k) => {
      const [x, y] = proj(p.lon, p.lat);
      const r = raio(p);
      /* numera na ordem da lista e repete o número na legenda embaixo */
      const num = its.length > 1 && p.valor
        ? `<text x="${n2(x)}" y="${n2(y + 16)}" class="mapa-num" text-anchor="middle">${k + 1}</text>`
        : "";
      return `
      <circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}" class="mapa-destaque" opacity=".92"/>
      <circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r + 24)}" class="mapa-anel"/>
      ${num}`;
    })
    .join("");

  const chaves = its.some((p) => p.rotulo)
    ? `<ul class="mapa-chaves${its.length > 3 ? " duas" : ""}">${its
        .map((p, k) => {
          if (!p.rotulo) return "";
          const marca = p.valor
            ? `<span class="ordem">${k + 1}</span>`
            : `<span class="ponto"></span>`;
          const valor = p.valor ? `<b>${esc(p.valor)}</b>` : "";
          return `<li>${marca}<span class="nome">${ec(p.rotulo)}</span>${valor}</li>`;
        })
        .join("")}</ul>`
    : "";

  return `
  <div class="figura">
    <svg viewBox="${m.viewBox}" role="img" aria-label="${esc(f.alt || "Mapa do Brasil com destaque")}"
         style="max-height:${f.altura || 600}px;margin:0 auto">
      <path d="${m.d}" class="mapa-base"/>
      ${pontos}
    </svg>
    ${chaves}
    ${f.legenda ? `<p class="figura-legenda">${ec(f.legenda)}</p>` : ""}
    ${f.fonte ? `<p class="fonte">Fonte: ${esc(f.fonte)}</p>` : ""}
  </div>`;
}


/* ---- ícones ------------------------------------------------------------
   Desenho de linha, traço único, no mesmo peso da marca. Entram ao lado da
   cifra pra dar o assunto num relance, nunca sozinhos.                    */
export const ICONES = {
  boi: `<path d="M20 25c0-7 24-7 24 0l-2 15c0 8-20 8-20 0z"/>
        <path d="M21 27c-6-3-12-2-15 2 3 5 11 6 15 3"/>
        <path d="M43 27c6-3 12-2 15 2-3 5-11 6-15 3"/>
        <path d="M24 23c-3-8-9-11-14-10"/>
        <path d="M40 23c3-8 9-11 14-10"/>
        <ellipse cx="32" cy="42" rx="6" ry="4"/>`,
  navio: `<path d="M8 40h48l-7 12H15z"/>
          <path d="M22 40V28h10v12"/>
          <path d="M32 40V22h10v18"/>
          <path d="M42 40v-7h6v7"/>
          <path d="M4 57c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3 4-3 8-3 4 3 8 3"/>`,
  dinheiro: `<rect x="6" y="16" width="52" height="32" rx="4"/>
             <circle cx="32" cy="32" r="8"/>
             <path d="M16 24h4M44 40h4"/>`,
  mapa: `<path d="M8 18l16-6 16 6 16-6v34l-16 6-16-6-16 6z"/>
         <path d="M24 12v34M40 18v34"/>`,
  documento: `<path d="M16 8h20l12 12v36H16z"/>
              <path d="M36 8v12h12"/>
              <path d="M24 32h16M24 42h16"/>`,
};
const icone = (nome) =>
  ICONES[nome]
    ? `<svg class="icone" viewBox="0 0 64 64" aria-hidden="true">${ICONES[nome]}</svg>`
    : "";

/* ---- números em diagonal ----------------------------------------------
   Até quatro figuras escalonadas na diagonal, cada uma com seu rótulo,
   como na peça de referência da lavoura.                                 */
export function numeros(f) {
  const itens = (f.itens || []).slice(0, 4);
  const linhas = itens
    .map(
      (it, k) => `
      <div class="diag-item" style="margin-left:${k * 70}px">
        ${icone(it.icone)}
        <div class="diag-linha">
          <span class="n dourado">${esc(it.numero)}</span>
          <span class="r">${esc(it.rotulo)}</span>
        </div>
      </div>`
    )
    .join("");
  return `
  <div class="figura" style="gap:54px">
    ${linhas}
    ${f.fonte ? `<p class="fonte" style="margin-top:18px">Fonte: ${esc(f.fonte)}</p>` : ""}
  </div>`;
}


/* ---- tabela de comparação -------------------------------------------
   Duas colunas, uma por cenário, e uma linha por critério. Serve pra
   mostrar "de um jeito é assim, do outro é assado" sem texto corrido.  */
export function tabela(f) {
  const cols = (f.colunas || []).slice(0, 2);
  const linhas = (f.linhas || []).slice(0, 5);
  const cab = cols
    .map(
      (c, i) =>
        `<th class="${i === 0 ? "col-a" : "col-b"}"><span>${ec(c)}</span></th>`
    )
    .join("");
  const corpo = linhas
    .map(
      (l) => `<tr>
        <th scope="row">${ec(l.criterio)}</th>
        <td class="col-a">${ec(l.a)}</td>
        <td class="col-b">${ec(l.b)}</td>
      </tr>`
    )
    .join("");
  return `
  <div class="figura">
    <table class="tabela">
      <thead><tr><th></th>${cab}</tr></thead>
      <tbody>${corpo}</tbody>
    </table>
    ${f.legenda ? `<p class="figura-legenda">${ec(f.legenda)}</p>` : ""}
    ${f.fonte ? `<p class="fonte">Fonte: ${esc(f.fonte)}</p>` : ""}
  </div>`;
}

/* ---- cerca de divisa ---------------------------------------------------
   Ilustração, não gráfico. Uma cerca de arame vista de lado, cortada ao
   meio pelo marco da divisa: metade dourada, metade terracota. O mesmo
   dado do donut, só que desenhado como a coisa de que a peça fala.     */
export function cerca(f) {
  const topo = 274, solo = 500, meio = 500;
  const postes = [140, 320, 500, 680, 860];
  const arames = [308, 360, 412, 464];
  const cor = (x) => (x < meio ? "var(--dado-1)" : x > meio ? "var(--dado-2)" : "var(--areia)");

  /* mourão grosso, fincado um pouco abaixo da linha do chão */
  const madeira = postes
    .map((x) => {
      const divisa = x === meio;
      const l = divisa ? 20 : 15;
      const alto = divisa ? topo - 52 : topo;
      return `<rect x="${x - l / 2}" y="${alto}" width="${l}" height="${solo + 16 - alto}" rx="4" fill="${cor(x)}"/>`;
    })
    .join("\n      ");

  /* arame fino, pra não competir com o mourão */
  const fio = (y) =>
    `<line x1="140" y1="${y}" x2="${meio - 10}" y2="${y}" stroke="var(--dado-1)" stroke-width="3.5"/>
      <line x1="${meio + 10}" y1="${y}" x2="860" y2="${y}" stroke="var(--dado-2)" stroke-width="3.5"/>`;

  /* chave embaixo de cada metade, que é onde mora a divisão da conta */
  const chave = (a, b, rot, cl) => `
      <path d="M${a},${solo + 50} v16 H${b} v-16" fill="none" stroke="${cl}" stroke-width="3.5" opacity=".65"/>
      <text x="${(a + b) / 2}" y="${solo + 112}" class="rot-txt" text-anchor="middle">${esc(rot)}</text>
      <text x="${(a + b) / 2}" y="${topo - 78}" class="rot-num" style="font-size:78px" text-anchor="middle" fill="${cl}">50%</text>`;

  return `
  <div class="figura">
    <svg viewBox="0 0 1000 660" role="img" aria-label="${esc(f.alt || "Cerca de arame dividida ao meio pelo marco da divisa")}">
      <line x1="${meio}" y1="120" x2="${meio}" y2="596" stroke="var(--areia)" stroke-width="2"
            stroke-dasharray="9 13" opacity=".45"/>
      <line x1="60" y1="${solo}" x2="940" y2="${solo}" stroke="var(--areia)" stroke-width="2.5" opacity=".4"/>
      ${arames.map(fio).join("\n      ")}
      ${madeira}
      ${chave(140, meio - 18, f.rotuloA || "metade é sua", "var(--dado-1)")}
      ${chave(meio + 18, 860, f.rotuloB || "metade é dele", "var(--dado-2)")}
    </svg>
    ${f.legenda ? `<p class="figura-legenda">${ec(f.legenda)}</p>` : ""}
    ${f.fonte ? `<p class="fonte">Fonte: ${esc(f.fonte)}</p>` : ""}
  </div>`;
}

export const FIGURAS = { donut, barras, mapa, numeros, tabela, cerca };

