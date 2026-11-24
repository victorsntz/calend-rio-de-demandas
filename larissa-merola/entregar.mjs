// Monta a pasta de entrega de um post no padrão que o Victor pediu em 24/11:
//   entregas/DD-MM (nome do post)/  com as artes numeradas, legenda.txt e roteiro.txt (quando houver)
//   + o zip de mesmo nome ao lado.
// Uso: node entregar.mjs <DD-MM> "<nome do post>" <pasta em saida/> [carrossel.json]
import { readdir, mkdir, copyFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const aqui = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iLeg = args.indexOf('--legenda');
const legendaExterna = iLeg >= 0 ? args.splice(iLeg, 2)[1] : null;   // estáticos guardam a legenda em posts/
const [data, nome, pastaSaida, jsonCarrossel] = args;
if (!data || !nome || !pastaSaida) {
  console.error('uso: node entregar.mjs 25-11 "nenhum desconto vale uma caneta sem registro" estatico-desconto-caneta-registro [carrosseis/v2/x.json]');
  process.exit(1);
}
if (!/^\d{2}-\d{2}$/.test(data)) { console.error('data no formato DD-MM'); process.exit(1); }

const origem = resolve(aqui, 'saida', pastaSaida);
if (!existsSync(origem)) { console.error('não achei', origem); process.exit(1); }

const destino = resolve(aqui, 'entregas', `${data} (${nome})`);
await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });

// artes: todos os png da pasta de saída, em ordem, renumerados
const pngs = (await readdir(origem)).filter(f => f.endsWith('.png')).sort();
let i = 0;
for (const f of pngs) {
  i += 1;
  const alvo = pngs.length === 1 ? `${data} ${nome}.png` : `${String(i).padStart(2, '0')} - ${nome}.png`;
  await copyFile(join(origem, f), join(destino, alvo));
}

// legenda: a da pasta de saída (carrossel) ou a passada em --legenda (estático)
const legenda = legendaExterna ? resolve(legendaExterna) : join(origem, 'legenda.txt');
const temLegenda = existsSync(legenda);
if (temLegenda) await copyFile(legenda, join(destino, 'legenda.txt'));

// roteiro, gerado na hora a partir do JSON de produção
if (jsonCarrossel) {
  const saida = execFileSync('node', [resolve(aqui, 'carrosseis', 'roteiro.mjs'), resolve(jsonCarrossel)], { encoding: 'utf8' });
  await writeFile(join(destino, 'roteiro.txt'), saida);
}

const zip = `${destino}.zip`;
execFileSync('rm', ['-f', zip]);
execFileSync('bash', ['-c', `cd ${JSON.stringify(destino)} && zip -q -r ${JSON.stringify(zip)} .`]);
console.log(`${basename(destino)}  (${pngs.length} arte${pngs.length > 1 ? 's' : ''}${temLegenda ? ' + legenda' : ''}${jsonCarrossel ? ' + roteiro' : ''})`);
