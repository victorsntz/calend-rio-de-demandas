// Registra no banco imagens já baixadas em banco/raw/pinterest/<slug>/ (escolhidas a dedo).
// Uso: node adicionar.mjs "jeans-folga/jeans-folga-08.jpg:jeans,emagreceu" "balao-murcho/balao-murcho-10.jpg:balao,murcho" ...
// Imprime "<raw> -> post/post-NN.jpg". Pula o que já estiver no manifest (mesma URL de origem).
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const aqui = dirname(fileURLToPath(import.meta.url));
const bancoDir = resolve(aqui, '..', 'banco');
const manifestPath = join(bancoDir, 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
let num = Math.max(0, ...manifest.filter(m => m.grupo === 'post').map(m => Number(m.arquivo.match(/post-(\d+)/)?.[1] ?? 0)));
for (const arg of process.argv.slice(2)) {
  const [caminho, tagsStr] = arg.split(':');
  const [slug, arquivo] = caminho.split('/');
  const fontes = JSON.parse(await readFile(join(bancoDir, 'raw', 'pinterest', slug, 'fontes.json'), 'utf8'));
  const f = fontes.find(x => x.arquivo === arquivo);
  if (!f) { console.error('não achei', arg); continue; }
  const ja = manifest.find(m => (m.origem ?? '').includes(f.imagem));
  if (ja) { console.log(caminho, '-> já no banco:', ja.arquivo); continue; }
  num += 1;
  const arq = `post/post-${num}.jpg`;
  const origem = join(bancoDir, 'raw', 'pinterest', slug, arquivo);
  const [w, h] = execFileSync('python3', ['-I', '-c', `from PIL import Image; im=Image.open(${JSON.stringify(origem)}).convert('RGB'); im.save(${JSON.stringify(join(bancoDir, arq))}, quality=92); print(im.size[0], im.size[1])`]).toString().trim().split(' ').map(Number);
  const tags = (tagsStr ?? '').split(',').map(s => s.trim()).filter(Boolean);
  manifest.push({ arquivo: arq, grupo: 'post', origem: `Pinterest: ${f.imagem}${f.pin ? ' (' + f.pin + ')' : ''}`, drive_id: null, largura: w, altura: h, orientacao: h > w ? 'retrato' : 'paisagem', tags: [...tags, ...(f.descricao ? [f.descricao.toLowerCase().slice(0, 60)] : [])], credito: 'Imagem: Pinterest', usar: true });
  console.log(caminho, '->', arq);
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
