// Elementos da marca (manual de identidade 2024, Drive > MARCA > CONSTRUÇÃO):
//  - padrão de folhas ("folhagem"): grade de quadrados, cada um com uma folha em lente na diagonal,
//    folhas de 4 quadrados se encontram no centro e formam a borboleta. Cores: musgo, claro, saúde.
//  - isótipo decomposto em traço: flor (3 pétalas), borboleta (4 pétalas), folha (1 pétala).
// Tudo sai como string SVG inline. Cor dos traços = currentColor (o tema do slide decide).

const PALETA = { musgo: '#343B30', claro: '#78856F', saude: '#CCD77F', branco: '#FFFFFF', papel: '#F7F6F2', marrom: '#4B3A2F', marromclaro: '#B8A08A' };

// gerador determinístico (mesma semente = mesmo padrão)
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

/** Padrão de folhas. cols x rows quadrados de lado `s` px. cores: lista de nomes da PALETA. */
export function padrao({ cols = 20, rows = 1, s = 54, cores = ['musgo', 'claro', 'saude'], seed = 7, classe = 'padrao' } = {}) {
  const r = rng(seed);
  const pick = (exclui) => { const c = cores.filter(x => x !== exclui); return c[Math.floor(r() * c.length)]; };
  let out = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = i * s, y = j * s;
    const folha = cores[Math.floor(r() * cores.length)];
    const f1 = pick(folha), f2 = pick(folha);
    const principal = (i + j) % 2 === 0; // diagonal (0,0)->(s,s); senão (0,s)->(s,0)
    if (principal) {
      out += `<path d="M${x} ${y}H${x + s}V${y + s}Z" fill="${PALETA[f1]}"/><path d="M${x} ${y}V${y + s}H${x + s}Z" fill="${PALETA[f2]}"/>`;
      out += `<path d="M${x} ${y}A${s} ${s} 0 0 1 ${x + s} ${y + s}A${s} ${s} 0 0 1 ${x} ${y}Z" fill="${PALETA[folha]}"/>`;
    } else {
      out += `<path d="M${x} ${y}H${x + s}V${y + s}Z" fill="${PALETA[f1]}"/><path d="M${x} ${y}V${y + s}H${x + s}Z" fill="${PALETA[f2]}"/>`;
      out += `<path d="M${x} ${y + s}A${s} ${s} 0 0 1 ${x + s} ${y}A${s} ${s} 0 0 1 ${x} ${y + s}Z" fill="${PALETA[folha]}"/>`;
    }
  }
  return `<svg class="${classe}" viewBox="0 0 ${cols * s} ${rows * s}" width="${cols * s}" height="${rows * s}" aria-hidden="true">${out}</svg>`;
}

// pétala em lente, do centro (0,0) até a ponta (0,-L)
function petala(L, rot) {
  const w = L * 0.3;
  return `<path transform="rotate(${rot})" d="M0 0C${w} ${-L * 0.3} ${w} ${-L * 0.72} 0 ${-L}C${-w} ${-L * 0.72} ${-w} ${-L * 0.3} 0 0Z"/>`;
}
function marca(nome, angulos, tam, traco) {
  const L = tam / 2.1;
  return `<svg class="marca marca-${nome}" viewBox="${-tam / 2} ${-tam / 2} ${tam} ${tam}" width="${tam}" height="${tam}" fill="none" stroke="currentColor" stroke-width="${traco}" stroke-linejoin="round" aria-hidden="true"><g>${angulos.map(a => petala(L, a)).join('')}</g></svg>`;
}
/** flor: 3 pétalas (beleza) */
export const flor = (tam = 200, traco = 3) => marca('flor', [-60, 0, 60], tam, traco);
/** borboleta: 4 pétalas diagonais (bem-estar) */
export const borboleta = (tam = 200, traco = 3) => marca('borboleta', [60, 120, 240, 300], tam, traco);
/** folha: 1 pétala inclinada (natureza) */
export const folha = (tam = 200, traco = 3) => marca('folha', [50], tam, traco);
/** isótipo completo: 6 pétalas */
export const isotipo = (tam = 200, traco = 3) => marca('isotipo', [0, 60, 120, 180, 240, 300], tam, traco);

export { PALETA };
