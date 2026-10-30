// Sistema v2 "estáticos compilados em carrossel". Uso: node montar2.mjs ../carrosseis/v2/x.json [--so-capa]
// JSON: { slug, arroba, seed, legenda: [...], slides: [ { tipo, tema, ... } ] }
// tipos: capa-foto { foto, rotulo?, titulo, sub?, credito? }
//        noticia   { print, rotulo?, texto?, fonte? }            (print = caminho do print gerado por estaticos/noticia.mjs)
//        celulas   { titulo, itens: [..], numerar?, texto?, fonte? }
//        dado      { numero, titulo, texto?, fonte? }
//        cards     { titulo, itens: [{ icone, rotulo, texto }], texto?, fonte? }   ícones: site, chat, receita, preco, lote, medico, anvisa
//        passos    { titulo, passos: [..], texto? }
//        foto-frase{ foto, titulo, texto?, credito? }
//        fecho     { titulo, texto, cta?, foto? }                  (sempre o último)
// TIPO 2 (inspiração em perfil real; chip de perfil sobre a foto, sem cabeçalho):
//        capa-colagem { fotos: [3 ou 6-8], titulo, texto }   capa-frase { foto | fotos: [6-8], titulo (aceita <u> e <i>), convite }
//        corpo-foto   { foto | fotos: [2 ou 6-8], rotulo, texto?, itens: [{lead, texto}] }   fecho2 { titulo, texto?, ctas?: [..], foto? }
// temas: salvia (padrão), musgo, papel, marrom, marromclaro, branco. Fotos: "post", "post:tag", "doutora" ou caminho.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { padrao, flor, borboleta, folha } from './elementos.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const [,, entrada] = process.argv;
if (!entrada) { console.error('uso: node montar2.mjs carrossel.json'); process.exit(1); }
const dados = JSON.parse(await readFile(entrada, 'utf8'));
const soCapa = process.argv.includes('--so-capa');
if (soCapa) { dados.slides = dados.slides.slice(0, 1); dados.slug = (dados.slug ?? 'carrossel') + '-capa'; }
const slug = dados.slug ?? 'carrossel';
const saida = resolve(aqui, '..', 'saida', slug);
await mkdir(saida, { recursive: true });

// ---- banco de fotos, rotação sem repetição (mesmo estado do montar.mjs) ----
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
function foto(ref, padraoRef) {
  if (!ref) ref = padraoRef;
  if (!ref) return null;
  const [grupo, tag] = String(ref).split(':');
  if (grupo === 'post' || grupo === 'doutora') { const a = sortear(grupo, tag); return a ? relative(saida, join(bancoDir, a)) : null; }
  return relative(saida, resolve(dirname(entrada), ref));
}
const creditoDe = (caminho) => { const m = manifest.find(x => caminho && caminho.endsWith(x.arquivo)); return m?.credito ?? ''; };
const creditosDe = (lista) => [...new Set(lista.map(creditoDe).filter(Boolean))].join(' · ');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rel = p => relative(saida, resolve(aqui, p));
const arroba = dados.arroba ?? '@larissamerola';
const seed = dados.seed ?? 7;

// ---- ícones de linha (64x64), traço = currentColor via CSS ----
const ICONES = {
  site: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24"/><ellipse cx="32" cy="32" rx="10" ry="24"/><line x1="8" y1="32" x2="56" y2="32"/><line x1="12" y1="20" x2="52" y2="20"/><line x1="12" y1="44" x2="52" y2="44"/></svg>',
  chat: '<svg viewBox="0 0 64 64"><path d="M10 14h44v30H26l-12 10V44h-4z"/><circle cx="24" cy="29" r="1.6"/><circle cx="32" cy="29" r="1.6"/><circle cx="40" cy="29" r="1.6"/></svg>',
  receita: '<svg viewBox="0 0 64 64"><path d="M16 8h22l10 10v38H16z"/><path d="M38 8v10h10"/><line x1="24" y1="30" x2="40" y2="30"/><line x1="24" y1="38" x2="40" y2="38"/><line x1="24" y1="46" x2="34" y2="46"/><line x1="22" y1="20" x2="22" y2="20"/></svg>',
  preco: '<svg viewBox="0 0 64 64"><path d="M34 8h20v20L28 54 8 34z"/><circle cx="44" cy="18" r="3.5"/><line x1="18" y1="36" x2="36" y2="18"/></svg>',
  lote: '<svg viewBox="0 0 64 64"><rect x="10" y="18" width="44" height="32" rx="2"/><line x1="18" y1="26" x2="18" y2="42"/><line x1="24" y1="26" x2="24" y2="42"/><line x1="30" y1="26" x2="30" y2="42"/><line x1="38" y1="26" x2="38" y2="42"/><line x1="46" y1="26" x2="46" y2="42"/></svg>',
  medico: '<svg viewBox="0 0 64 64"><circle cx="32" cy="20" r="10"/><path d="M12 56c2-12 10-18 20-18s18 6 20 18"/><line x1="32" y1="38" x2="32" y2="52"/><line x1="25" y1="45" x2="39" y2="45"/></svg>',
  anvisa: '<svg viewBox="0 0 64 64"><path d="M32 6l22 8v16c0 14-9 24-22 28C19 54 10 44 10 30V14z"/><path d="M22 32l7 7 13-14"/></svg>',
  caneta: '<svg viewBox="0 0 64 64"><rect x="26" y="4" width="12" height="40" rx="4"/><line x1="32" y1="44" x2="32" y2="60"/><line x1="26" y1="16" x2="38" y2="16"/><line x1="26" y1="30" x2="38" y2="30"/></svg>',
};
const icone = n => ICONES[n] ?? ICONES.site;
const cabecalho = `<div class="cabecalho">Dra. Larissa Merola<i></i>Nutrologia</div>`;
const rodape = (i) => padrao({ cols: 30, rows: 1, s: 36, seed: seed + i, classe: 'rodape-padrao', cores: dados.padrao ?? ['musgo', 'marrom', 'marromclaro', 'saude'] });   // amarronzado
const chip = `<div class="chip"><div class="avatar"><img src="${rel('../banco/doutora/avatar.jpg')}" alt=""></div><div><div class="nome">Dra. Larissa Merola<span class="selo"></span></div><div class="arroba">${esc(arroba)}</div></div></div>`;
const SETA = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const SETA_BAIXO = '<svg class="seta" viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
// parede: 5+ fotos em duas fileiras (a de cima leva a metade maior)
const parede = fs => { const n = Math.ceil(fs.length / 2); const cel = f => `<div>${f ? `<img src="${esc(f)}" alt="">` : ''}</div>`; return `<div class="parede"><div class="fileira">${fs.slice(0, n).map(cel).join('')}</div><div class="fileira">${fs.slice(n).map(cel).join('')}</div></div>`; };
const fonteDe = s => s.fonte ? `<div class="fonte">Fonte: ${esc(s.fonte)}</div>` : '';

const partes = [];
dados.slides.forEach((s, i) => {
  const ultimo = i === dados.slides.length - 1;
  const tema = s.tema ?? (s.tipo === 'fecho' ? 'musgo' : 'salvia');
  // tipo 2: véu das fotos alterna marrom (padrão, ~60%) e verde escuro (~40%); `tom: "musgo"|"marrom"` força
  const tom = s.tom ?? (s.tipo === 'fecho2' ? 'musgo' : (i % 3 === 1 ? 'musgo' : 'marrom'));   // ~40% verde: slides 2, 5 e fecho
  const vcls = tom === 'musgo' ? ' v-musgo' : '';
  const cls = `slide ${s.tipo} t-${tema}`;
  const deslize = ultimo ? '' : '<div class="deslize">Deslize</div>';
  if (s.tipo === 'capa-foto') {
    const f = foto(s.foto, 'post');
    const cred = s.credito ?? creditoDe(f);
    partes.push(`<section class="${cls}${s.tom === 'marrom' ? '' : ' v-musgo'}"><div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div><div class="veu"></div>${cabecalho}
  ${cred ? `<div class="credito">${esc(cred)}</div>` : ''}
  <div class="bloco">${s.rotulo ? `<div class="rotulo">${esc(s.rotulo)}</div>` : ''}<h1>${esc(s.titulo)}</h1>${s.sub ? `<div class="sub">${esc(s.sub)}</div>` : ''}</div>
  <div class="deslize">Deslize</div><div class="logo"><img src="${rel('logo-branca.png')}" alt=""></div></section>`);
  } else if (s.tipo === 'noticia') {
    const print = relative(saida, resolve(dirname(entrada), s.print));
    partes.push(`<section class="${cls}">${cabecalho}
  <div class="cartao"><div class="faixa"><i></i>${esc(s.rotulo ?? 'Notícia')}</div><img class="print" src="${esc(print)}" alt=""></div>
  <div class="legenda">${s.texto ? `<p>${esc(s.texto)}</p>` : ''}${fonteDe(s)}</div>${deslize}</section>`);
  } else if (s.tipo === 'celulas') {
    const itens = s.itens.map((it, k) => `<li>${s.numerar === false ? '' : `<span class="n">${String(k + 1).padStart(2, '0')}</span>`}<span>${it}</span></li>`).join('');
    partes.push(`<section class="${cls}">${cabecalho}
  <div class="miolo"><h2>${s.titulo}</h2><ul>${itens}</ul>${s.texto ? `<p>${s.texto}</p>` : ''}${fonteDe(s)}</div>${flor(150, 2.6)}${rodape(i)}${deslize}</section>`);
  } else if (s.tipo === 'dado') {
    partes.push(`<section class="${cls}">${cabecalho}
  <div class="miolo"><div class="numero">${esc(s.numero)}</div><h2>${esc(s.titulo)}</h2>${s.texto ? `<p>${s.texto}</p>` : ''}${fonteDe(s)}</div>${rodape(i)}${deslize}</section>`);
  } else if (s.tipo === 'cards') {
    const cards = s.itens.map(it => `<div class="card">${icone(it.icone)}<div class="t">${it.rotulo ? `<b>${esc(it.rotulo)}</b>` : ''}${it.texto}</div></div>`).join('');
    partes.push(`<section class="${cls}">${cabecalho}
  <div class="miolo"><h2>${s.titulo}</h2><div class="lista">${cards}</div>${s.texto ? `<p>${s.texto}</p>` : ''}${fonteDe(s)}</div>${borboleta(150, 2.6)}${rodape(i)}${deslize}</section>`);
  } else if (s.tipo === 'passos') {
    const li = s.passos.map((p, k) => `<li><span class="n">${k + 1}</span><span>${p}</span></li>`).join('');
    partes.push(`<section class="${cls}">${cabecalho}
  <div class="miolo"><h2>${s.titulo}</h2><ol>${li}</ol>${s.texto ? `<p>${s.texto}</p>` : ''}</div>${folha(150, 2.6)}${rodape(i)}${deslize}</section>`);
  } else if (s.tipo === 'foto-frase') {
    const f = foto(s.foto, 'post');
    const cred = s.credito ?? creditoDe(f);
    partes.push(`<section class="${cls}"><div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div>${cabecalho}${cred ? `<div class="credito">${esc(cred)}</div>` : ''}
  <div class="tarja"><h2>${s.titulo}</h2>${s.texto ? `<p>${s.texto}</p>` : ''}</div></section>`);
  } else if (s.tipo === 'capa-colagem') {
    // TIPO 2, capa cheia de imagens: 3 fotos (2 em cima, 1 embaixo), rótulo em caixa e texto curto
    const fs = (s.fotos ?? ['post', 'post', 'post']).map(r => foto(r, 'post'));
    const fundo = fs.length >= 5 ? parede(fs) : `<div class="grade">${fs.map(f => `<div>${f ? `<img src="${esc(f)}" alt="">` : ''}</div>`).join('')}</div>`;
    partes.push(`<section class="slide tipo2 capa-colagem${vcls}${fs.length >= 5 ? ' com-parede' : ''}">${fundo}<div class="veu"></div>
  <div class="bloco">${chip.replace('class="chip"', 'class="chip chip-junto"')}<div><span class="rotulo-caixa">${s.titulo}</span></div>${s.texto ? `<div class="texto">${s.texto}</div>` : ''}</div>${creditosDe(fs) ? `<div class="credito">${esc(creditosDe(fs))}</div>` : ''}</section>`);
  } else if (s.tipo === 'capa-frase') {
    // TIPO 2, capa de frase: foto inteira, frase grande em sans pesada com grifo, convite pra comentar
    const fs = s.fotos ? s.fotos.map(r => foto(r, 'post')) : [foto(s.foto, 'post')];
    const fundo = fs.length >= 5 ? parede(fs) : `<div class="foto">${fs[0] ? `<img src="${esc(fs[0])}" alt="">` : ''}</div>`;
    partes.push(`<section class="slide tipo2 capa-frase${vcls}${fs.length >= 5 ? ' com-parede' : ''}">${fundo}<div class="veu"></div>${chip}
  <div class="bloco"><h1>${s.titulo}</h1>${s.convite ? `<div class="convite">${s.convite}${SETA_BAIXO}</div>` : ''}</div>${creditosDe(fs) ? `<div class="credito">${esc(creditosDe(fs))}</div>` : ''}</section>`);
  } else if (s.tipo === 'corpo-foto') {
    // TIPO 2, miolo: foto inteira (ou duas empilhadas, `fotos: [2]`), rótulo em caixa, texto corrido e itens com seta
    const fs = s.fotos ? s.fotos.map(r => foto(r, 'post')) : [foto(s.foto, 'post')];
    const cred = creditosDe(fs);
    const itens = (s.itens ?? []).map(it => `<li>${SETA}<span>${it.lead ? `<b>${it.lead}</b> ` : ''}${it.texto}</span></li>`).join('');
    const fotoHtml = fs.length >= 5 ? parede(fs) : fs.length > 1 ? `<div class="foto">${fs.map(f => `<div>${f ? `<img src="${esc(f)}" alt="">` : ''}</div>`).join('')}</div>` : `<div class="foto">${fs[0] ? `<img src="${esc(fs[0])}" alt="">` : ''}</div>`;
    partes.push(`<section class="slide tipo2 corpo-foto${fs.length >= 5 ? ' com-parede' : fs.length > 1 ? ' duas' : ''}${vcls}">${fotoHtml}<div class="veu"></div>${chip}
  <div class="bloco">${s.rotulo ? `<div><span class="rotulo-caixa">${s.rotulo}</span></div>` : ''}${s.texto ? `<div class="texto">${s.texto}</div>` : ''}${itens ? `<ul>${itens}</ul>` : ''}</div>${cred ? `<div class="credito">${esc(cred)}</div>` : ''}${deslize}</section>`);
  } else if (s.tipo === 'mosaico') {
    // TIPO 2, quatro fotos em grade e uma frase no meio
    const fs = (s.fotos ?? ['post', 'post', 'post', 'post']).map(r => foto(r, 'post'));
    const cred = creditosDe(fs);
    const itensM = (s.itens ?? []).map(it => `<li>${SETA}<span>${it.lead ? `<b>${it.lead}</b> ` : ''}${it.texto}</span></li>`).join('');
    partes.push(`<section class="slide tipo2 mosaico${vcls}${itensM ? ' com-itens' : ''}"><div class="grade">${fs.map(f => `<div>${f ? `<img src="${esc(f)}" alt="">` : ''}</div>`).join('')}</div><div class="veu"></div>${chip}
  <div class="bloco"><div><span class="rotulo-caixa">${s.titulo}</span></div>${s.texto ? `<div class="texto">${s.texto}</div>` : ''}${itensM ? `<ul>${itensM}</ul>` : ''}</div>${cred ? `<div class="credito">${esc(cred)}</div>` : ''}${deslize}</section>`);
  } else if (s.tipo === 'fecho2') {
    // TIPO 2, fecho: a Dra. em foto inteira, três chamadas (comenta, salva/manda, link)
    const f = foto(s.foto, 'doutora');
    const ctas = (s.ctas ?? ['Me conta nos comentários', 'Salva e manda pra uma amiga', 'Consulta pelo link na bio']).map(t => `<div class="cta">${SETA}<span>${esc(t)}</span></div>`).join('');
    partes.push(`<section class="slide tipo2 fecho2${vcls}"><div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div><div class="veu"></div>
  <div class="bloco">${chip.replace('class="chip"', 'class="chip chip-junto"')}<h1>${s.titulo}</h1>${s.texto ? `<div class="convite">${s.texto}</div>` : ''}<div class="ctas">${ctas}</div></div>
  <div class="logo"><img src="${rel('logo-branca.png')}" alt=""></div></section>`);
  } else if (s.tipo === 'fecho') {
    const f = foto(s.foto, 'doutora');
    partes.push(`<section class="${cls}"><div class="foto">${f ? `<img src="${esc(f)}" alt="">` : ''}</div>${cabecalho}
  <div class="miolo"><h2>${esc(s.titulo)}</h2><p>${s.texto}</p><div class="cta"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>${esc(s.cta ?? 'Link na bio')}</div></div>
  <div class="arroba">${esc(arroba)}</div><div class="logo"><img src="${rel('logo-branca.png')}" alt=""></div></section>`);
  }
});

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(slug)}</title>
<link rel="stylesheet" href="${rel('fonts/fonts.css')}"><link rel="stylesheet" href="${rel('v2.css')}"></head><body>
${partes.join('\n')}
<script src="${rel('tipografia.js')}"></script></body></html>`;
const htmlPath = join(saida, 'index.html');
await writeFile(htmlPath, html);
await writeFile(usoPath, JSON.stringify(uso, null, 2));
execFileSync('node', [join(aqui, 'render.mjs'), htmlPath, join(saida, slug)], { stdio: 'inherit' });
if (soCapa) { console.log('capa pronta:', saida); process.exit(0); }

const legenda = [`Siga ${arroba}`, '', ...(dados.legenda ?? []).flatMap(p => [p, ''])].join('\n').trimEnd() + '\n';
await writeFile(join(saida, 'legenda.txt'), legenda);
const zipPath = join(saida, `${slug}.zip`);
const pngs = dados.slides.map((_, i) => join(saida, `${slug}-${String(i + 1).padStart(2, '0')}.png`));
try { execFileSync('rm', ['-f', zipPath]); execFileSync('zip', ['-j', '-q', zipPath, ...pngs, join(saida, 'legenda.txt')]); console.log('zip:', zipPath); }
catch (e) { console.warn('zip não gerado:', e.message); }
console.log('pronto:', saida);
