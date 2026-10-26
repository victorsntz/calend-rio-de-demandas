// Estático "NOTÍCIA": print real de uma matéria dentro de um cartão, faixa NOTÍCIA em cima, nome da Dra. embaixo.
// Uso: node noticia.mjs <url> <slug> [--foto caminho.jpg] [--altura 760] [--chamada "texto"]
//   --foto    injeta uma foto na imagem principal da matéria quando o site não entrega a imagem pro print (lazy load/proxy)
//   --altura  altura do recorte da página em px CSS (largura fixa 1000). Padrão: até o fim do primeiro parágrafo.
//   --topo N   pula os N px do topo da página (cabeçalho do site que não carrega direito)
//   --chamada texto curto opcional abaixo do cartão (ex.: "O que isso muda pra quem já comprou? Deslize.")
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const require = createRequire('/opt/node-tools/node_modules/');
const { chromium } = require('playwright');

const aqui = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const posicionais = []; for (let i = 0; i < args.length; i++) { if (args[i].startsWith('--')) { i++; continue; } posicionais.push(args[i]); }
const [url, slug = 'noticia'] = posicionais;
const fotoPath = opt('--foto'); const alturaFixa = Number(opt('--altura', 0)); const chamada = opt('--chamada', ''); const topo = Number(opt('--topo', 0));   // --topo N pula o cabeçalho do site
const saida = resolve(aqui, '..', 'saida', `noticia-${slug}`);
await mkdir(saida, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 2, locale: 'pt-BR' });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(2500);
for (const t of ['OK', 'Aceitar', 'Aceitar todos', 'Concordo', 'Entendi', 'Fechar']) { const bt = p.getByRole('button', { name: t }).first(); if (await bt.count()) { try { await bt.click({ timeout: 1500 }); } catch {} } }
for (let y = 0; y < 2400; y += 400) { await p.mouse.wheel(0, 400); await p.waitForTimeout(200); }
await p.waitForTimeout(1200);
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(600);
await p.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); if (cs.position === 'fixed' && el.offsetHeight < 700) el.style.visibility = 'hidden'; }
  for (const el of document.querySelectorAll('[id^="ht"], [class*="handtalk"], [class*="hand-talk"], [class*="vlibras"], [id*="vlibras"], [id*="accessib"], [class*="accessib"]')) el.remove(); });
if (fotoPath) {
  const dataUrl = 'data:image/jpeg;base64,' + (await readFile(resolve(fotoPath))).toString('base64');
  await p.evaluate((src) => {
    const art = document.querySelector('article, main, .content, body');
    const img = [...art.querySelectorAll('img')].find(i => i.alt && i.alt.length > 10 && (i.naturalWidth === 0 || i.naturalWidth > 400));
    if (img) { img.src = src; img.srcset = ''; img.style.width = '100%'; img.style.height = 'auto'; img.style.maxWidth = '100%'; img.style.objectFit = 'cover'; img.style.visibility = 'visible'; }
  }, dataUrl);
  await p.waitForTimeout(800);
}
await p.evaluate(() => window.scrollTo(0, 0));
let altura = alturaFixa;
if (!altura) {
  altura = await p.evaluate(() => {
    const art = document.querySelector('article, main, .content') ?? document.body;
    const ps = [...art.querySelectorAll('p')].filter(e => e.textContent.trim().length > 80);
    const img = [...art.querySelectorAll('img')].find(i => i.getBoundingClientRect().width > 400);
    const base = img ? img.getBoundingClientRect().bottom + window.scrollY : 0;
    const p1 = ps.find(e => e.getBoundingClientRect().top + window.scrollY > base);
    return Math.round((p1 ? p1.getBoundingClientRect().bottom + window.scrollY : 900) + 24);
  });
}
altura = Math.min(Math.max(altura, 600), 960);   // cabe no cartão com a assinatura embaixo
const printPath = join(saida, 'print.png');
await p.screenshot({ path: printPath, clip: { x: 0, y: topo, width: 1000, height: altura - topo } });
await b.close();

const rel = f => resolve(aqui, '..', 'capa', f);
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Notícia</title>
<link rel="stylesheet" href="${rel('fonts/fonts.css')}"><link rel="stylesheet" href="${rel('tokens.css')}">
<style>
  html, body { margin: 0; background: #ddd; }
  .slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: var(--papel); color: var(--musgo); font-family: var(--sans); }
  .cartao { position: absolute; left: 60px; right: 60px; top: 64px; border-radius: 26px; overflow: hidden; background: #fff; box-shadow: 0 18px 50px rgba(52,59,48,.16); }
  .faixa { height: 104px; background: var(--musgo); color: var(--branco); display: flex; align-items: center; justify-content: center; font-size: 58px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
  .faixa i { width: 14px; height: 14px; border-radius: 50%; background: var(--saude); margin-right: 26px; }
  .print { display: block; width: 960px; height: auto; }
  .assina { position: absolute; left: 60px; right: 60px; bottom: 76px; display: flex; flex-direction: column; align-items: center; gap: 18px; }
  .assina .nome { font-size: 26px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--musgo); }
  .assina .chamada { font-size: 30px; font-weight: 400; color: var(--musgo); text-align: center; max-width: 820px; line-height: 1.35; }
  .assina img { height: 54px; opacity: .95; }
</style></head><body>
<div class="slide">
  <div class="cartao"><div class="faixa"><i></i>Notícia</div><img class="print" src="${printPath}" alt=""></div>
  <div class="assina">${chamada ? `<div class="chamada">${chamada}</div>` : ''}<div class="nome">Dra. Larissa Merola · Nutrologia</div></div>
</div></body></html>`;
const htmlPath = join(saida, 'index.html');
await writeFile(htmlPath, html);
execFileSync('node', [resolve(aqui, '..', 'capa', 'render.mjs'), htmlPath, join(saida, `noticia-${slug}`)], { stdio: 'inherit' });
console.log('pronto:', saida, 'recorte:', altura, 'px');
