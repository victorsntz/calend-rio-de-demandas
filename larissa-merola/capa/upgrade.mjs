// Rebaixa em resolução cheia as fotos do banco que entraram pela grade do Pinterest (736px).
// O slide é 1080x1350, então 736px chega esticado na arte. Troca o arquivo só quando
// a versão nova é maior, e atualiza largura/altura/origem no manifest.
// Uso: node upgrade.mjs [--so-listar]
import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const aqui = dirname(fileURLToPath(import.meta.url));
const bancoDir = resolve(aqui, '..', 'banco');
const manifestPath = join(bancoDir, 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const soListar = process.argv.includes('--so-listar');

const dimensoes = f => execFileSync('python3', ['-I', '-c',
  `from PIL import Image; im=Image.open(${JSON.stringify(f)}); print(im.size[0], im.size[1])`])
  .toString().trim().split(' ').map(Number);

let trocadas = 0, tentadas = 0;
for (const m of manifest) {
  const url = (m.origem ?? '').match(/https:\/\/i\.pinimg\.com\/(?:236x|474x|564x|736x|1200x|originals)\/(\S+)/)?.[1];
  if (!url) continue;
  const arquivo = join(bancoDir, m.arquivo);
  const [w, h] = dimensoes(arquivo);
  if (Math.max(1080 / w, 1350 / h) <= 1.0) continue;    // já cobre o slide
  tentadas += 1;
  if (soListar) { console.log(`${m.arquivo}  ${w}x${h}`); continue; }
  const semExt = url.replace(/\.\w+$/, '');
  const tmp = `/tmp/upgrade-${process.pid}.img`;
  let melhor = null;
  for (const u of [`originals/${url}`, `originals/${semExt}.png`, `originals/${semExt}.webp`, `1200x/${url}`]) {
    try {
      execFileSync('curl', ['-sS', '-f', '--max-time', '40', '-o', tmp, `https://i.pinimg.com/${u}`]);
      const [nw, nh] = dimensoes(tmp);
      if (nw * nh > w * h) { melhor = { u, nw, nh, bytes: readFileSync(tmp) }; break; }
    } catch { /* tenta a próxima */ }
  }
  if (!melhor) { console.log(`-- ${m.arquivo}  ${w}x${h}  (não achei maior)`); continue; }
  execFileSync('python3', ['-I', '-c',
    `from PIL import Image; im=Image.open(${JSON.stringify(tmp)}).convert('RGB'); im.thumbnail((2400,3600)); im.save(${JSON.stringify(arquivo)}, quality=93); print(im.size)`]);
  const [fw, fh] = dimensoes(arquivo);
  m.largura = fw; m.altura = fh;
  m.origem = m.origem.replace(/https:\/\/i\.pinimg\.com\/\S+/, `https://i.pinimg.com/${melhor.u}`);
  trocadas += 1;
  console.log(`ok ${m.arquivo}  ${w}x${h} -> ${fw}x${fh}`);
}
if (!soListar) await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\n${trocadas} de ${tentadas} fotos trocadas por versão maior`);
