// Estático 02d (sinais anotados): foto real num fundo papel, com linhas finas apontando
// cada sinal e o rótulo ao lado. Referência que o Victor aprovou em 24/11: peça de sinais
// físicos com linhas saindo do corpo. Nada de ilustração e nada de foto de IA (REGRAS.md §4).
//
// JSON: {
//   slug, foto, enquadramento?,            // enquadramento = object-position da foto no quadro
//   rotulo, titulo, fecho?,
//   quadro?: { left, top, w, h },          // posição do bloco de foto em px do slide 1080x1350
//   marcas: [ { lado: "esq"|"dir", texto, ponto: [fx, fy], y } ]
//     ponto = fração (0..1) da imagem ORIGINAL; y = altura do rótulo em px do slide
// }
// Uso: node sinais.mjs sinais/x.json
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const aqui = dirname(fileURLToPath(import.meta.url));
const [, , entrada] = process.argv;
if (!entrada) { console.error('uso: node sinais.mjs sinais/x.json'); process.exit(1); }
const d = JSON.parse(await readFile(entrada, 'utf8'));
const slug = d.slug ?? 'sinais';
const saida = resolve(aqui, '..', 'saida', `estatico-${slug}`);
await mkdir(saida, { recursive: true });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rel = f => relative(saida, resolve(aqui, '..', 'capa', f));
const fotoRel = relative(saida, resolve(dirname(entrada), d.foto));

// tamanho real da imagem, pra saber como o cover recorta e onde cai cada ponto
const [iw, ih] = execFileSync('python3', ['-I', '-c',
  `from PIL import Image; im=Image.open(${JSON.stringify(resolve(dirname(entrada), d.foto))}); print(im.size[0], im.size[1])`])
  .toString().trim().split(' ').map(Number);

const Q = { left: 330, top: 318, w: 420, h: 716, ...(d.quadro ?? {}) };
// object-fit: cover — a escala é a maior das duas, e o excedente é cortado meio a meio
const escala = Math.max(Q.w / iw, Q.h / ih);
const sobraX = (iw * escala - Q.w) / 2, sobraY = (ih * escala - Q.h) / 2;
const naTela = ([fx, fy]) => [Q.left + fx * iw * escala - sobraX, Q.top + fy * ih * escala - sobraY];

// a nota ocupa uma coluna fixa em cada lado; a linha só começa depois dela, nunca por cima
const MARGEM = 62, LARGURA = 248, GAP = 14;
const marcas = (d.marcas ?? []).map(m => {
  const [px, py] = naTela(m.ponto);
  const esquerda = m.lado !== 'dir';
  const xInicio = esquerda ? MARGEM + LARGURA + GAP : 1080 - MARGEM - LARGURA - GAP;
  const xFim = esquerda ? Q.left - 18 : Q.left + Q.w + 18;     // onde a linha encosta no quadro
  return { ...m, px, py, esquerda, xInicio, xFim };
});

const linhas = marcas.map(m => `
  <path d="M ${m.xInicio} ${m.y} H ${m.xFim} L ${m.px.toFixed(1)} ${m.py.toFixed(1)}" fill="none" stroke="rgba(77,57,42,.5)" stroke-width="1.5"/>
  <circle cx="${m.px.toFixed(1)}" cy="${m.py.toFixed(1)}" r="7.5" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="2.2"/>
  <circle cx="${m.px.toFixed(1)}" cy="${m.py.toFixed(1)}" r="3" fill="#CCD77F"/>`).join('');

const textos = marcas.map(m => `<div class="nota ${m.esquerda ? 'e' : 'd'}" style="top:${m.y}px">${m.texto}</div>`).join('');

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(slug)}</title>
<link rel="stylesheet" href="${rel('fonts/fonts.css')}"><link rel="stylesheet" href="${rel('tokens.css')}">
<style>
  html, body { margin: 0; background: #ddd; }
  .slide { position: relative; width: 1080px; height: 1350px; overflow: hidden;
           font-family: var(--sans); color: var(--marrom); background: #EFE8DC; }
  .marca { position: absolute; top: 58px; left: 0; right: 0; text-align: center; font-size: 20px;
           letter-spacing: 0.34em; text-transform: uppercase; font-weight: 500; color: rgba(77,57,42,.6); }
  .topo { position: absolute; top: 132px; left: 76px; right: 76px; text-align: center; }
  .topo .rot { display: block; font-size: 21px; letter-spacing: 0.26em; text-transform: uppercase;
               font-weight: 600; color: #7E8A52; margin-bottom: 20px; }
  .topo h1 { margin: 0; font-family: var(--serif); font-weight: 400; font-size: 58px; line-height: 1.08;
             letter-spacing: -0.015em; color: #3A2B20; }
  .topo h1 b { font-weight: 400; color: #6E7A45; }
  .quadro { position: absolute; left: ${Q.left}px; top: ${Q.top}px; width: ${Q.w}px; height: ${Q.h}px;
            overflow: hidden; border-radius: 210px 210px 18px 18px; background: #E2D9CB; }
  .quadro img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.8) contrast(1.03) brightness(1.02); object-position: ${d.enquadramento ?? '50% 50%'}; }
  svg.fios { position: absolute; inset: 0; width: 1080px; height: 1350px; }
  .nota { position: absolute; width: ${LARGURA}px; font-size: 25px; line-height: 1.34; font-weight: 300;
          color: #4D392A; transform: translateY(-50%); }
  .nota b { font-weight: 600; color: #3A2B20; }
  .nota.e { left: ${MARGEM}px; text-align: right; }
  .nota.d { right: ${MARGEM}px; text-align: left; }
  .fecho { position: absolute; left: 120px; right: 120px; bottom: 148px; text-align: center;
           font-size: 27px; line-height: 1.42; font-weight: 300; color: rgba(77,57,42,.92); }
  .fecho b { font-weight: 600; color: #3A2B20; }
  .pe { position: absolute; left: 0; right: 0; bottom: 62px; display: flex; justify-content: center; }
  .pe img { height: 62px; opacity: .9; }
</style></head><body>
<div class="slide">
  <div class="marca">Dra. Larissa Merola · Nutrologia</div>
  <div class="topo"><span class="rot">${esc(d.rotulo ?? 'Lipedema')}</span><h1>${d.titulo ?? ''}</h1></div>
  <div class="quadro"><img src="${esc(fotoRel)}" alt=""></div>
  <svg class="fios" viewBox="0 0 1080 1350">${linhas}</svg>
  ${textos}
  ${d.fecho ? `<div class="fecho">${d.fecho}</div>` : ''}
  <div class="pe"><img src="${rel('logo.png')}" alt=""></div>
</div>
<script src="${rel('tipografia.js')}"></script>
</body></html>`;

const htmlPath = join(saida, 'index.html');
await writeFile(htmlPath, html);
execFileSync('node', [resolve(aqui, '..', 'capa', 'render.mjs'), htmlPath, join(saida, `estatico-${slug}`)], { stdio: 'inherit' });
console.log('pronto:', saida);
