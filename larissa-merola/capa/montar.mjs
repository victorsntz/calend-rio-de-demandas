// Monta um carrossel a partir de um JSON e renderiza em PNG.
// Uso: node montar.mjs ../carrosseis/exemplo.json
// JSON: { slug, arroba, capa: { linha1, linha2, ilustracao }, slides: [ { tipo: "A"|"B"|"C"|"D"|"E", ... } ] }
//   A foto + texto      { titulo, texto, foto?: "post"|"post:tag"|"doutora"|caminho }
//   B lista             { titulo, itens: [...], texto? }
//   C dado              { numero, titulo, texto, fonte }
//   E foto inteira      { titulo, texto?, foto?: "post"|"doutora"|caminho }  (foto ocupa o slide, faixa de texto embaixo)
//   D fechamento        { titulo, texto, cta?, foto?: "doutora"|caminho }   (sempre o último; destaque pra foto da Dra.)
// Fotos: "post" e "doutora" sorteiam do banco (banco/manifest.json) sem repetir até esgotar (estado em banco/uso.json).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const aqui = dirname(fileURLToPath(import.meta.url));
const [,, entrada] = process.argv;
if (!entrada) { console.error('uso: node montar.mjs carrossel.json'); process.exit(1); }
const dados = JSON.parse(await readFile(entrada, 'utf8'));
const slug = dados.slug ?? 'carrossel';
const saida = resolve(aqui, '..', 'saida', slug);
await mkdir(saida, { recursive: true });

// ---- banco de fotos, com rotação sem repetição ------------------------------
const bancoDir = resolve(aqui, '..', 'banco');
const manifestPath = join(bancoDir, 'manifest.json');
const usoPath = join(bancoDir, 'uso.json');
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : [];
const uso = existsSync(usoPath) ? JSON.parse(await readFile(usoPath, 'utf8')) : { doutora: [], post: [] };
const usadasNeste = new Set();
function sortear(grupo, tag) {
  let candidatas = manifest.filter(m => m.grupo === grupo && m.usar !== false);
  if (tag) { const comTag = candidatas.filter(m => (m.tags ?? []).includes(tag)); if (comTag.length) candidatas = comTag; }
  const todas = candidatas.map(m => m.arquivo);
  if (!todas.length) return null;
  let livres = todas.filter(a => !uso[grupo].includes(a) && !usadasNeste.has(a));
  if (!livres.length) { uso[grupo] = []; livres = todas.filter(a => !usadasNeste.has(a)); }
  const escolhida = livres[Math.floor(Math.random() * livres.length)];
  uso[grupo].push(escolhida); usadasNeste.add(escolhida);
  return escolhida;
}
function foto(ref, padrao) {
  if (!ref) ref = padrao;
  if (!ref) return null;
  const [grupo, tag] = String(ref).split(':');
  if (grupo === 'post' || grupo === 'doutora') {
    const a = sortear(grupo, tag);
    return a ? relative(saida, join(bancoDir, a)) : null;
  }
  return relative(saida, resolve(dirname(entrada), ref));
}
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- slides ----------------------------------------------------------------
const rel = p => relative(saida, resolve(aqui, p));
const partes = [];
partes.push(`
<section class="slide capa">
  <svg class="faixa" viewBox="0 0 1080 26" preserveAspectRatio="none" aria-hidden="true">
    <rect width="1080" height="26" fill="#78856F"/>
    <path d="M0 26 C 120 -30, 260 -30, 380 26 Z" fill="#CCD77F"/>
    <path d="M300 26 C 420 -34, 560 -34, 690 26 Z" fill="#343B30"/>
    <path d="M620 26 C 740 -30, 880 -30, 1000 26 Z" fill="#CCD77F"/>
    <path d="M900 26 C 980 -24, 1060 -24, 1140 26 Z" fill="#343B30"/>
    <rect y="22" width="1080" height="4" fill="#343B30"/>
  </svg>
  <div class="arroba">${esc(dados.arroba ?? '@larissamerola')}</div>
  <h1 class="titulo"><span class="linha1">${esc(dados.capa.linha1)}</span><span class="linha2">${esc(dados.capa.linha2)}</span></h1>
  <div class="ilustracao"><img src="${esc(foto(dados.capa.ilustracao, null) ?? '')}" alt=""></div>
  <div class="logo"><img src="${rel('logo.png')}" alt=""></div>
</section>`);

const deslize = '<div class="deslize">Deslize para o lado</div>';
// Tema de cor: o JSON pode fixar `tema` ("papel"|"claro"|"musgo"|"saude"); senão a gente mescla.
const ciclo = ['claro', 'papel', 'saude', 'musgo', 'papel', 'saude'];
function temaDe(s, i, n) {
  if (s.tema) return s.tema;
  if (s.tipo === 'D') return 'musgo';
  let t = ciclo[i % ciclo.length];
  if (i === n - 2 && t === 'musgo') t = 'saude';   // não emendar dois musgos antes do fechamento
  return t;
}
const rodapeDe = t => `<div class="rodape"><img src="${rel(t === 'claro' || t === 'musgo' ? 'logo-branca.png' : 'logo.png')}" alt=""></div>`;
dados.slides.forEach((s, i) => {
  const ultimo = i === dados.slides.length - 1;
  const tema = temaDe(s, i, dados.slides.length);
  const cls = `t-${tema}`;
  const rodape = rodapeDe(tema);
  if (s.tipo === 'A') {
    const f = foto(s.foto, 'post');
    partes.push(`<section class="slide a ${cls}">
  <div class="texto"><h2>${esc(s.titulo)}</h2><p>${esc(s.texto)}</p></div>
  <div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div>${ultimo ? '' : deslize}
</section>`);
  } else if (s.tipo === 'B') {
    partes.push(`<section class="slide b ${cls}">
  <div class="texto"><h2>${s.titulo}</h2>
    <ul>${s.itens.map(it => `<li><i></i>${esc(it)}</li>`).join('')}</ul>
    ${s.texto ? `<p>${esc(s.texto)}</p>` : ''}</div>${ultimo ? '' : deslize}${rodape}
</section>`);
  } else if (s.tipo === 'C') {
    partes.push(`<section class="slide c ${cls}">
  <div class="texto"><div class="numero">${esc(s.numero)}</div><h2>${esc(s.titulo)}</h2>
    ${s.texto ? `<p style="margin-top:36px">${esc(s.texto)}</p>` : ''}
    ${s.fonte ? `<div class="fonte">Fonte: ${esc(s.fonte)}</div>` : ''}</div>${ultimo ? '' : deslize}${rodape}
</section>`);
  } else if (s.tipo === 'E') {
    const f = foto(s.foto, 'post');
    partes.push(`<section class="slide e ${cls}">
  <div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div>
  <div class="faixa-texto"><h2>${esc(s.titulo)}</h2>${s.texto ? `<p>${esc(s.texto)}</p>` : ''}</div>${ultimo ? '' : deslize}
</section>`);
  } else if (s.tipo === 'D') {
    const f = foto(s.foto, 'doutora');
    partes.push(`<section class="slide d t-musgo">
  <div class="texto"><h2>${esc(s.titulo)}</h2><p>${esc(s.texto)}</p><div class="cta">${esc(s.cta ?? 'Link na bio')}</div></div>
  <div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div>
  <div class="logo"><img src="${rel('logo-branca.png')}" alt=""></div>
  <div class="arroba">${esc(dados.arroba ?? '@larissamerola')}</div>
</section>`);
  }
});

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(slug)}</title>
<link rel="stylesheet" href="${rel('fonts/fonts.css')}"><link rel="stylesheet" href="${rel('tokens.css')}">
<link rel="stylesheet" href="${rel('carrossel.css')}"></head><body>
${partes.join('\n')}
<script src="${rel('tipografia.js')}"></script></body></html>`;
const htmlPath = join(saida, 'index.html');
await writeFile(htmlPath, html);
await writeFile(usoPath, JSON.stringify(uso, null, 2));
execFileSync('node', [join(aqui, 'render.mjs'), htmlPath, join(saida, slug)], { stdio: 'inherit' });
console.log('pronto:', saida);
