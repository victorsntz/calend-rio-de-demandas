// Avisa quando uma foto do carrossel vai chegar esticada na arte.
// O slide é 1080x1350; num slide de foto inteira a imagem precisa cobrir isso, e numa
// tela partida, 540x1350. Acima de ~1.25x de ampliação já dá pra ver o borrão.
// Uso: node resolucao.mjs ../carrosseis/v2/x.json [...]
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const LIMITE = 1.25;
let ruins = 0;
for (const entrada of process.argv.slice(2)) {
  const d = JSON.parse(await readFile(entrada, 'utf8'));
  console.log(`\n${entrada}`);
  d.slides.forEach((s, i) => {
    const fotos = s.fotos ?? (s.foto && s.foto !== 'doutora' ? [s.foto] : []);
    // parede de fotos: duas fileiras, cada célula é uma fração do quadro; tela partida: meia largura
    const parede = fotos.length >= 5;
    const largura = parede ? Math.round(1080 / Math.ceil(fotos.length / 2)) : fotos.length === 2 ? 540 : 1080;
    const altura = parede ? 675 : 1350;
    for (const f of fotos) {
      const caminho = resolve(dirname(entrada), f);
      let w, h;
      try { [w, h] = execFileSync('python3', ['-I', '-c',
        `from PIL import Image; im=Image.open(${JSON.stringify(caminho)}); print(im.size[0], im.size[1])`])
        .toString().trim().split(' ').map(Number); } catch { console.log(`  slide ${i + 1}: não achei ${f}`); continue; }
      const escala = Math.max(largura / w, altura / h);
      const marca = escala > LIMITE ? 'ESTICA' : 'ok    ';
      if (escala > LIMITE) ruins += 1;
      console.log(`  ${marca} slide ${i + 1}  ${f.split('/').pop()}  ${w}x${h}  ${escala.toFixed(2)}x`);
    }
  });
}
console.log(`\n${ruins} foto(s) esticando acima de ${LIMITE}x`);
process.exit(ruins ? 1 : 0);
