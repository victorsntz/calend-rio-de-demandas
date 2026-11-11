// Estático 02 (frase): foto inteira com a mensagem por cima. Dois formatos, conforme REGRAS.md §1b.
//   02a, frase ou dado:      { tipo: "02a", foto, frase, apoio? }
//   02b, gancho "leia a legenda": { tipo: "02b", foto, opcoes: [..], pergunta, gancho? }
// Uso: node frase.mjs ../estaticos/frases/x.json
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const aqui = dirname(fileURLToPath(import.meta.url));
const [, , entrada] = process.argv;
if (!entrada) { console.error('uso: node frase.mjs frase.json'); process.exit(1); }
const d = JSON.parse(await readFile(entrada, 'utf8'));
const slug = d.slug ?? 'estatico';
const saida = resolve(aqui, '..', 'saida', `estatico-${slug}`);
await mkdir(saida, { recursive: true });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rel = f => relative(saida, resolve(aqui, '..', 'capa', f));
const foto = relative(saida, resolve(dirname(entrada), d.foto));
const musgo = d.tom === 'musgo';   // véu verde escuro; padrão é marrom (regra 60/40)

const miolo = d.tipo === '02b'
  ? `<div class="bloco b2">
      <div class="opcoes">${(d.opcoes ?? []).map(o => `<span>${esc(o)}</span>`).join('')}</div>
      <div class="lado"><div class="pergunta">${d.pergunta ?? ''}</div><div class="gancho">${esc(d.gancho ?? 'Leia a legenda')}</div></div>
     </div>`
  : `<div class="bloco b1"><div class="frase">${d.frase ?? ''}</div>${d.apoio ? `<div class="apoio">${d.apoio}</div>` : ''}</div>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(slug)}</title>
<link rel="stylesheet" href="${rel('fonts/fonts.css')}"><link rel="stylesheet" href="${rel('tokens.css')}">
<style>
  :root { --v: ${musgo ? '36,46,34' : '48,36,26'}; --vf: ${musgo ? '28,36,26' : '36,27,20'}; }
  html, body { margin: 0; background: #ddd; }
  .slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; font-family: var(--sans); color: #fff; background: rgb(var(--vf)); }
  .foto { position: absolute; inset: 0; } .foto img { width: 100%; height: 100%; object-fit: cover; object-position: ${d.enquadramento ?? '50% 50%'}; }
  .veu { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(var(--v),.72) 0%, rgba(var(--v),.46) 38%, rgba(var(--v),.52) 66%, rgba(var(--vf),.88) 100%); }
  .marca { position: absolute; top: 56px; left: 0; right: 0; text-align: center; font-size: 21px; letter-spacing: 0.34em; text-transform: uppercase; font-weight: 500; color: rgba(255,255,255,.9); text-shadow: 0 1px 12px rgba(0,0,0,.45); }
  .bloco { position: absolute; left: 88px; right: 88px; }
  .logo { position: absolute; left: 0; right: 0; bottom: 70px; display: flex; justify-content: center; }
  .logo img { height: 84px; opacity: .97; }
  /* 02a: frase grande sobre a foto */
  .b1 { top: 190px; }
  .frase { font-size: 86px; line-height: 1.08; font-weight: 300; letter-spacing: -0.02em; text-transform: uppercase; text-shadow: 0 2px 20px rgba(0,0,0,.45); }
  .frase b { font-weight: 700; }
  .apoio { margin-top: 34px; font-size: 32px; line-height: 1.4; font-weight: 300; max-width: 760px; text-shadow: 0 1px 14px rgba(0,0,0,.45); }
  .apoio b { font-weight: 600; }
  /* 02b: opções grandes à esquerda, pergunta ao lado e "leia a legenda" */
  .b2 { top: 180px; display: flex; gap: 40px; align-items: flex-start; }
  .opcoes { display: flex; flex-direction: column; gap: 10px; }
  .opcoes span { display: block; font-size: 96px; line-height: 1.02; font-weight: 700; letter-spacing: -0.035em; text-shadow: 0 2px 22px rgba(0,0,0,.45); }
  .lado { padding-top: 14px; width: 330px; flex: none; display: flex; flex-direction: column; gap: 42px; }
  .pergunta { font-size: 36px; line-height: 1.32; font-weight: 300; text-shadow: 0 1px 14px rgba(0,0,0,.45); }
  .pergunta b { font-weight: 600; }
  .gancho { font-size: 24px; font-weight: 400; letter-spacing: 0.04em; color: rgba(255,255,255,.82); white-space: nowrap; }
</style></head><body>
<div class="slide">
  <div class="foto"><img src="${esc(foto)}" alt=""></div><div class="veu"></div>
  <div class="marca">Dra. Larissa Merola · Nutrologia</div>
  ${miolo}
  <div class="logo"><img src="${rel('logo-branca.png')}" alt=""></div>
</div>
<script src="${rel('tipografia.js')}"></script>
</body></html>`;
const htmlPath = join(saida, 'index.html');
await (await import('node:fs/promises')).writeFile(htmlPath, html);
execFileSync('node', [resolve(aqui, '..', 'capa', 'render.mjs'), htmlPath, join(saida, `estatico-${slug}`)], { stdio: 'inherit' });
console.log('pronto:', saida);
