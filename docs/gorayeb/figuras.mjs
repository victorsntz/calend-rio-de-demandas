/* Figuras dos carrosséis: donut, barras, mapa e números em diagonal.
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

  const pontos = (f.pontos || [])
    .map((p) => {
      const [x, y] = proj(p.lon, p.lat);
      const r = p.raio || 46;
      return `
      <circle cx="${n2(x)}" cy="${n2(y)}" r="${r}" class="mapa-destaque" opacity=".9"/>
      <circle cx="${n2(x)}" cy="${n2(y)}" r="${r + 30}" class="mapa-anel"/>
      ${p.rotulo ? `<text x="${n2(x + r + 48)}" y="${n2(y + 10)}" class="rot-txt" style="font-size:54px">${esc(p.rotulo)}</text>` : ""}`;
    })
    .join("");

  return `
  <div class="figura">
    <svg viewBox="${m.viewBox}" role="img" aria-label="${esc(f.alt || "Mapa do Brasil com destaque")}"
         style="max-height:600px;margin:0 auto">
      <path d="${m.d}" class="mapa-base"/>
      ${pontos}
    </svg>
    ${f.legenda ? `<p class="figura-legenda">${ec(f.legenda)}</p>` : ""}
    ${f.fonte ? `<p class="fonte">Fonte: ${esc(f.fonte)}</p>` : ""}
  </div>`;
}

/* ---- números em diagonal ----------------------------------------------
   Até quatro figuras escalonadas na diagonal, cada uma com seu rótulo,
   como na peça de referência da lavoura.                                 */
export function numeros(f) {
  const itens = (f.itens || []).slice(0, 4);
  const linhas = itens
    .map(
      (it, k) => `
      <div class="diag-item" style="margin-left:${k * 92}px">
        <span class="n dourado">${esc(it.numero)}</span>
        <span class="r">${esc(it.rotulo)}</span>
      </div>`
    )
    .join("");
  return `
  <div class="figura" style="flex:1;justify-content:center;gap:40px">
    ${linhas}
    ${f.fonte ? `<p class="fonte">Fonte: ${esc(f.fonte)}</p>` : ""}
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

export const FIGURAS = { donut, barras, mapa, numeros, tabela };
