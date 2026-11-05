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
import { padrao, flor, borboleta, folha } from './elementos.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const [,, entrada] = process.argv;
if (!entrada) { console.error('uso: node montar.mjs carrossel.json'); process.exit(1); }
const dados = JSON.parse(await readFile(entrada, 'utf8'));
const soCapa = process.argv.includes('--so-capa');   // renderiza só a capa (pra comparar estilos)
if (soCapa) { dados.slides = []; dados.slug = (dados.slug ?? 'carrossel') + '-capa-' + (dados.capa.tipo ?? 'ilustracao'); }
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
const estiloCapa = dados.capa.tipo ?? 'ilustracao';
if (estiloCapa === 'social') {
  // capa "post social": perfil dela em cima, texto corrido, foto embaixo (sem emoji)
  const avatar = rel('../banco/doutora/avatar.jpg');
  const f = foto(dados.capa.foto, 'post');
  const texto = Array.isArray(dados.capa.texto) ? dados.capa.texto.join('\n') : (dados.capa.texto ?? '');
  partes.push(`
<section class="slide capa-social">
  <div class="perfil"><div class="avatar"><img src="${avatar}" alt=""></div><div><div class="nome">Dra. Larissa Merola</div><div class="arroba">${esc(dados.arroba ?? '@larissamerola')}</div></div></div>
  <div class="mais"><i></i><i></i><i></i></div>
  <div class="corpo"><div class="texto">${esc(texto)}</div>
  <div class="arrasta">${esc(dados.capa.arrasta ?? 'Arrasta')}<b>&rarr;</b></div>
  <div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div></div>
</section>`);
} else if (estiloCapa === 'foto') {
  // capa "foto inteira": texto centralizado fino, logo branca embaixo
  const f = foto(dados.capa.foto, 'post');
  const l = dados.capa.linhas ?? [dados.capa.linha1, dados.capa.linha2];
  const classes = ['grande', 'pequena', 'grande', 'pequena'];
  partes.push(`
<section class="slide capa-foto">
  <div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div><div class="veu"></div>
  <h1 class="titulo">${l.map((t, i) => `<span class="${dados.capa.classes?.[i] ?? classes[i % 4]}">${esc(t)}</span>`).join('')}</h1>
  <div class="deslize-c">Deslize para o lado</div>
  <div class="logo"><img src="${rel('logo-branca.png')}" alt=""></div>
  ${dados.capa.credito ? `<div class="credito">${esc(dados.capa.credito)}</div>` : ''}
</section>`);
} else {
  // capa padrão (fixa): pergunta em duas linhas, ilustração figurativa, logo menor embaixo, padrão de folhas da marca no topo
  partes.push(`
<section class="slide capa">
  ${padrao({ cols: 20, rows: 1, s: 54, seed: dados.seed ?? 7, classe: 'faixa-padrao' })}
  <div class="arroba">${esc(dados.arroba ?? '@larissamerola')}</div>
  <h1 class="titulo"><span class="linha1">${esc(dados.capa.linha1)}</span><span class="linha2">${esc(dados.capa.linha2)}</span></h1>
  <div class="ilustracao"><img src="${esc(foto(dados.capa.ilustracao, null) ?? '')}" alt=""></div>
  <div class="logo"><img src="${rel('logo.png')}" alt=""></div>
</section>`);
}

const deslize = '<div class="deslize">Deslize para o lado</div>';
// Tema de cor: o JSON pode fixar `tema` ("papel"|"marrom"|"marromclaro"|"musgo"|"saude"|"claro"); senão a gente mescla.
const ciclo = ['marrom', 'papel', 'saude', 'musgo', 'papel', 'marromclaro'];
function temaDe(s, i, n) {
  if (s.tema) return s.tema;
  if (s.tipo === 'D') return s.tema ?? 'musgo';
  let t = ciclo[i % ciclo.length];
  if (i === n - 2 && t === 'musgo') t = 'saude';   // não emendar dois musgos antes do fechamento
  return t;
}
const rodapeDe = t => `<div class="rodape"><img src="${rel(['claro', 'musgo', 'marrom', 'degrade'].includes(t) ? 'logo-branca.png' : 'logo.png')}" alt=""></div>`;
dados.slides.forEach((s, i) => {
  const ultimo = i === dados.slides.length - 1;
  const tema = temaDe(s, i, dados.slides.length);
  const cls = `t-${tema}`;
  const rodape = rodapeDe(tema);
  if (s.tipo === 'A') {
    const f = foto(s.foto, 'post');
    partes.push(`<section class="slide a ${cls}">
  ${folha(84, 3.2)}
  <div class="texto"><h2>${esc(s.titulo)}</h2><p>${esc(s.texto)}</p></div>
  <div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div>${ultimo ? '' : deslize}
</section>`);
  } else if (s.tipo === 'B') {
    partes.push(`<section class="slide b ${cls}">
  <div class="texto"><h2>${s.titulo}</h2>
    <ul>${s.itens.map(it => `<li><i></i>${esc(it)}</li>`).join('')}</ul>
    ${s.texto ? `<p>${esc(s.texto)}</p>` : ''}</div>${borboleta(96, 3.2)}${s.padrao === false ? '' : padrao({ cols: 20, rows: 1, s: 54, seed: (dados.seed ?? 7) + i, classe: 'padrao-rodape' })}${ultimo ? '' : deslize}${rodape}
</section>`);
  } else if (s.tipo === 'C') {
    partes.push(`<section class="slide c ${cls}">
  <div class="texto"><div class="numero">${esc(s.numero)}</div><h2>${esc(s.titulo)}</h2>
    ${s.texto ? `<p style="margin-top:36px">${esc(s.texto)}</p>` : ''}
    ${s.fonte ? `<div class="fonte">Fonte: ${esc(s.fonte)}</div>` : ''}</div>${flor(300, 2.6)}${ultimo ? '' : deslize}${rodape}
</section>`);
  } else if (s.tipo === 'E') {
    const f = foto(s.foto, 'post');
    partes.push(`<section class="slide e ${cls}">
  <div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div>${s.credito ? `<div class="credito">${esc(s.credito)}</div>` : ''}
  <div class="faixa-texto"><h2>${esc(s.titulo)}</h2>${s.texto ? `<p>${esc(s.texto)}</p>` : ''}</div>${ultimo ? '' : deslize}
</section>`);
  } else if (s.tipo === 'D') {
    const f = foto(s.foto, 'doutora');
    partes.push(`<section class="slide d ${cls}">
  ${borboleta(110, 3.4)}
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

if (soCapa) { console.log('capa pronta:', saida); process.exit(0); }
// legenda.txt: primeira linha "Siga @arroba", depois os parágrafos do JSON. Sem emoji.
const arroba = dados.arroba ?? '@larissamerola';
const legenda = [`Siga ${arroba}`, '', ...(dados.legenda ?? []).flatMap(p => [p, ''])].join('\n').trimEnd() + '\n';
await writeFile(join(saida, 'legenda.txt'), legenda);

// zip de entrega: só os PNGs numerados + legenda.txt
const zipPath = join(saida, `${slug}.zip`);
try { execFileSync('rm', ['-f', zipPath]); execFileSync('zip', ['-j', '-q', zipPath, ...dados.slides.map((_, i) => join(saida, `${slug}-${String(i + 2).padStart(2, '0')}.png`)), join(saida, `${slug}-01.png`), join(saida, 'legenda.txt')]); console.log('zip:', zipPath); }
catch (e) { console.warn('zip não gerado:', e.message); }
console.log('pronto:', saida);
