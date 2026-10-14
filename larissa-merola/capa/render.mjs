// Renderiza cada elemento .slide de um HTML em PNG 1080x1350.
// Uso: node render.mjs capa.html saida            -> saida.png (um slide) ou saida-01.png, saida-02.png...
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); }
catch { pw = require(process.env.PLAYWRIGHT_MODULE ?? '/opt/node-tools/node_modules/playwright'); }
const { chromium } = pw;

const [,, entrada = 'capa.html', saida = 'capa'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(entrada)).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
const slides = await page.$$('.slide');
for (let i = 0; i < slides.length; i++) {
  const nome = slides.length === 1 ? `${saida}.png` : `${saida}-${String(i + 1).padStart(2, '0')}.png`;
  await slides[i].screenshot({ path: nome });
  console.log('ok', nome);
}
await browser.close();
