// Renderiza as peças do evento Elo Lipedema (14/11): anúncio feed/stories em PNG, artes de sacola e camiseta
// em PNG com fundo transparente e em PDF vetorial (fontes embutidas), e os mockups.
// Uso: node elo-evento.mjs   -> saida/elo-evento/
import { createRequire } from 'node:module';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
const require = createRequire('/opt/node-tools/node_modules/');
const { chromium } = require('playwright');

const aqui = dirname(fileURLToPath(import.meta.url));
const html = resolve(aqui, 'elo-evento.html');
const saida = resolve(aqui, '..', 'saida', 'elo-evento');
await mkdir(saida, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2600, height: 2800 }, deviceScaleFactor: 1 });
const abrir = async () => { await page.goto(pathToFileURL(html).href); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300); };
await abrir();

// 1) anúncios
const anuncios = [['anuncio-feed-completo', 0], ['anuncio-feed-teaser', 1], ['anuncio-stories', 2]];
const slides = await page.$$('.slide');
for (const [nome, i] of anuncios) { await slides[i].screenshot({ path: join(saida, `${nome}.png`) }); console.log('ok', nome); }

// 2) artes com fundo transparente (o fundo cinza da página sai antes do print)
await page.addStyleTag({ content: 'html, body { background: transparent !important; }' });
const artes = ['sacola-musgo', 'sacola-branca', 'camiseta-peito-musgo', 'camiseta-peito-branca', 'camiseta-costas-musgo', 'camiseta-costas-branca'];
for (const id of artes) {
  const el = await page.$(`#${id}`);
  await el.screenshot({ path: join(saida, `${id}.png`), omitBackground: true });
  console.log('ok', id);
}

// 3) mockups: usam versões menores das artes
const mocks = { 'mock-sacola-musgo.png': 'sacola-musgo.png', 'mock-sacola-branca.png': 'sacola-branca.png', 'mock-peito-musgo.png': 'camiseta-peito-musgo.png', 'mock-costas-branca.png': 'camiseta-costas-branca.png' };
for (const [m, a] of Object.entries(mocks)) await copyFile(join(saida, a), join(aqui, m));
await abrir();
await (await page.$('#mock-sacolas')).screenshot({ path: join(saida, 'mockup-sacolas.png') });
await (await page.$('#mock-camisetas')).screenshot({ path: join(saida, 'mockup-camisetas.png') });
for (const m of Object.keys(mocks)) execFileSync('rm', ['-f', join(aqui, m)]);
console.log('ok mockups');

// 4) PDF vetorial de cada arte (fontes embutidas, fundo transparente)
const tamanhos = { 'sacola-musgo': [2400, 2400], 'camiseta-peito-musgo': [1200, 600], 'camiseta-costas-musgo': [2400, 2600], 'sacola-branca': [2400, 2400], 'camiseta-peito-branca': [1200, 600], 'camiseta-costas-branca': [2400, 2600] };
for (const [id, [w, h]] of Object.entries(tamanhos)) {
  await abrir();
  await page.addStyleTag({ content: `html, body { background: transparent !important; margin: 0; } .slide { display: none !important; } #${id} { display: flex !important; margin: 0 !important; } @page { size: ${w}px ${h}px; margin: 0; }` });
  await page.pdf({ path: join(saida, `${id}.pdf`), width: `${w}px`, height: `${h}px`, printBackground: false, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log('ok pdf', id);
}
await browser.close();

await writeFile(join(saida, 'LEIA-ME.txt'), `Elo Lipedema, evento de 14/11 (Condomínio Ventana)

ANÚNCIO
- anuncio-feed-completo.png  1080x1350, com data e local
- anuncio-feed-teaser.png    1080x1350, sem data (se o 14/11 ainda não estiver fechado)
- anuncio-stories.png        1080x1920

SACOLA (pra colocar o pareô das pacientes que fecharam)
- sacola-musgo.pdf / .png    arte em 1 cor (verde musgo #343B30), fundo transparente, pra sacola de algodão cru ou kraft
- sacola-branca.pdf / .png   arte em branco, pra sacola verde escura ou preta
- mockup-sacolas.png         prévia nas duas opções
Especificação sugerida: ecobag de algodão cru 100%, 35 x 40 cm, alça de 60 cm, serigrafia 1 cor.
Área de impressão da arte: 24 x 24 cm (a arte tem 2400 px = 24 cm a 100 px/cm, 254 dpi).

CAMISETA (pra equipe no evento)
- camiseta-peito-*.pdf / .png   logo pequeno no peito esquerdo, 10 x 5 cm
- camiseta-costas-*.pdf / .png  arte grande nas costas, 26 x 28 cm
- mockup-camisetas.png          frente off-white com arte musgo, costas verde musgo com arte branca
Especificação sugerida: camiseta 100% algodão penteado 30.1, off-white (impressão musgo) ou verde musgo (impressão branca), serigrafia 1 cor ou DTF.

Os PDFs são vetoriais com fonte embutida: servem direto pra serigrafia. Os PNGs têm fundo transparente.
`);
console.log('pronto:', saida);
