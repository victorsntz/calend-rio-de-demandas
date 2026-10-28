// Baixa imagens do Pinterest pra dentro do banco de fotos.
// Uso: node pinterest.mjs "<termo de busca ou URL de pin/pasta>" [--n 10] [--tags "cabelo,famosa"] [--slug farrah]
// Abre a página num Chromium de verdade (sem login), lê a grade de resultados, troca a miniatura pela
// imagem grande (736x, senão originals) e salva em banco/raw/pinterest/<slug>/ com um fontes.json.
// Com --banco, copia pro banco/post como post-NN.jpg e registra no manifest (origem = URL da imagem).
// Pinterest exige login só pra interagir; a grade pública carrega sem isso. Nada aqui disfarça o cliente.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('/opt/node-tools/node_modules/');
const { chromium } = require('playwright');

const aqui = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const flag = k => args.includes(k);
const entrada = args.find(a => !a.startsWith('--') && !args.includes(`--${a}`) && args[args.indexOf(a) - 1]?.startsWith('--') !== true);
if (!entrada) { console.error('uso: node pinterest.mjs "termo ou url" [--n 10] [--tags a,b] [--slug nome] [--banco]'); process.exit(1); }
const n = Number(opt('--n', 10));
const tags = (opt('--tags', '') || '').split(',').map(s => s.trim()).filter(Boolean);
const url = /^https?:\/\//.test(entrada) ? entrada : `https://br.pinterest.com/search/pins/?q=${encodeURIComponent(entrada)}`;
const slug = opt('--slug', entrada.replace(/^https?:\/\/[^/]+\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 40) || 'pinterest');
const destino = resolve(aqui, '..', 'banco', 'raw', 'pinterest', slug);
await mkdir(destino, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1800 }, locale: 'pt-BR' });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(3500);
for (let i = 0; i < 5; i++) { await p.mouse.wheel(0, 1400); await p.waitForTimeout(1000); }
const vistos = await p.evaluate(() => [...document.querySelectorAll('img')]
  .map(i => ({ src: i.currentSrc || i.src, alt: (i.alt || '').trim().slice(0, 140), w: i.naturalWidth, h: i.naturalHeight, pin: i.closest('a[href*="/pin/"]')?.getAttribute('href') ?? '' }))
  .filter(i => /i\.pinimg\.com\/(236x|474x|564x|736x|originals)\//.test(i.src)));
await b.close();
// remove duplicatas (mesma imagem em tamanhos diferentes) e chips pequenos
const porId = new Map();
for (const v of vistos) { const id = v.src.replace(/.*\/([0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]+\.\w+)$/, '$1'); if (!porId.has(id)) porId.set(id, v); }
const lista = [...porId.values()].slice(0, n);
console.log(`página: ${url}\nimagens na grade: ${porId.size}, baixando ${lista.length}`);

const fontes = [];
let k = 0;
for (const v of lista) {
  const grande = v.src.replace(/\/(236x|474x|564x)\//, '/736x/');
  const alternativas = [grande, v.src.replace(/\/(236x|474x|564x|736x)\//, '/originals/'), v.src];
  for (const u of alternativas) {
    try {
      // curl respeita o proxy do ambiente (o fetch do Node não)
      const buf = execFileSync('curl', ['-sS', '-f', '--max-time', '30', u], { maxBuffer: 50 * 1024 * 1024 });
      if (buf.length < 15000) continue;
      k += 1;
      const ext = (u.match(/\.(jpe?g|png|webp)$/i)?.[1] ?? 'jpg').toLowerCase().replace('jpeg', 'jpg');
      const nome = `${slug}-${String(k).padStart(2, '0')}.${ext}`;
      await writeFile(join(destino, nome), buf);
      fontes.push({ arquivo: nome, imagem: u, pin: v.pin ? `https://br.pinterest.com${v.pin}` : '', descricao: v.alt, busca: url, baixado_em: new Date().toISOString().slice(0, 10) });
      console.log('ok', nome, `${Math.round(buf.length / 1024)} KB`, v.alt ? `· ${v.alt.slice(0, 60)}` : '');
      break;
    } catch (e) { /* tenta a próxima */ }
  }
}
await writeFile(join(destino, 'fontes.json'), JSON.stringify(fontes, null, 2));
console.log(`salvo em ${destino} (${fontes.length} imagens + fontes.json)`);

if (flag('--banco') && fontes.length) {
  const bancoDir = resolve(aqui, '..', 'banco');
  const manifestPath = join(bancoDir, 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : [];
  let num = Math.max(0, ...manifest.filter(m => m.grupo === 'post').map(m => Number(m.arquivo.match(/post-(\d+)/)?.[1] ?? 0)));
  const sharp = (() => { try { return require('sharp'); } catch { return null; } })();
  for (const f of fontes) {
    num += 1;
    const arq = `post/post-${num}.jpg`;
    const origem = join(destino, f.arquivo);
    let largura = 0, altura = 0;
    if (sharp) { const img = sharp(origem); const meta = await img.metadata(); largura = meta.width; altura = meta.height; await img.jpeg({ quality: 92 }).toFile(join(bancoDir, arq)); }
    else { const { execFileSync } = await import('node:child_process'); execFileSync('python3', ['-I', '-c', `from PIL import Image; im=Image.open(${JSON.stringify(origem)}).convert('RGB'); im.save(${JSON.stringify(join(bancoDir, arq))}, quality=92); print(im.size[0], im.size[1])`]).toString().trim().split(' ').map(Number).forEach((v, i) => { if (i === 0) largura = v; else altura = v; }); }
    manifest.push({ arquivo: arq, grupo: 'post', origem: `Pinterest: ${f.imagem}${f.pin ? ' (' + f.pin + ')' : ''}`, drive_id: null, largura, altura, orientacao: altura > largura ? 'retrato' : 'paisagem', tags: [...tags, ...(f.descricao ? [f.descricao.toLowerCase().slice(0, 60)] : [])], credito: 'Imagem: Pinterest', usar: true });
    console.log('banco:', arq);
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}
