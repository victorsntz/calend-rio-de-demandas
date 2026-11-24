// Busca fotos livres pra um tema e salva em imagens/<tema>/ com os créditos.
// Fontes: Openverse (sem chave, só licenças CC0/CC BY/CC BY-SA com uso comercial)
//         Pexels (precisa de PEXELS_API_KEY; licença Pexels, uso comercial liberado)
// Uso: node buscar-imagens.mjs "mulher caminhando" 6
// Precisa de rede liberada pra api.openverse.org e, se usar Pexels, api.pexels.com + images.pexels.com.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [,, tema = 'woman walking', n = '6'] = process.argv;
const pasta = join('imagens', tema.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
await mkdir(pasta, { recursive: true });
const creditos = [];

async function baixar(url, nome) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  await writeFile(join(pasta, nome), Buffer.from(await r.arrayBuffer()));
}

// Openverse
try {
  const q = new URLSearchParams({ q: tema, license_type: 'commercial,modification', page_size: n, orientation: 'tall' });
  const r = await fetch(`https://api.openverse.org/v1/images/?${q}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const j = await r.json();
  for (const [i, it] of (j.results ?? []).entries()) {
    const nome = `openverse-${String(i + 1).padStart(2, '0')}.jpg`;
    try { await baixar(it.url, nome); creditos.push({ arquivo: nome, fonte: 'Openverse', autor: it.creator, licenca: it.license, url: it.foreign_landing_url }); }
    catch (e) { console.warn('falhou', it.url, e.message); }
  }
} catch (e) { console.warn('Openverse indisponível:', e.message); }

// Pexels
if (process.env.PEXELS_API_KEY) {
  try {
    const q = new URLSearchParams({ query: tema, per_page: n, orientation: 'portrait' });
    const r = await fetch(`https://api.pexels.com/v1/search?${q}`, { headers: { Authorization: process.env.PEXELS_API_KEY } });
    const j = await r.json();
    for (const [i, p] of (j.photos ?? []).entries()) {
      const nome = `pexels-${String(i + 1).padStart(2, '0')}.jpg`;
      try { await baixar(p.src.large2x, nome); creditos.push({ arquivo: nome, fonte: 'Pexels', autor: p.photographer, licenca: 'Pexels License', url: p.url }); }
      catch (e) { console.warn('falhou', p.url, e.message); }
    }
  } catch (e) { console.warn('Pexels indisponível:', e.message); }
}

await writeFile(join(pasta, 'creditos.json'), JSON.stringify(creditos, null, 2));
console.log(`${creditos.length} imagens em ${pasta}`);
