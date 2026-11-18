// Gera o roteiro em texto de um carrossel, slide a slide, a partir do JSON de produção.
// Serve pra subir no portal de demandas e pra equipe acompanhar o que vai em cada slide.
// Uso: node roteiro.mjs v2/x.json [> saida.txt]
import { readFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';

const [, , entrada] = process.argv;
if (!entrada) { console.error('uso: node roteiro.mjs carrossel.json'); process.exit(1); }
const d = JSON.parse(await readFile(entrada, 'utf8'));

const limpo = s => String(s ?? '')
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<\/?[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const foto = f => basename(String(f ?? ''));
const fotos = s => (s.fotos ?? (s.foto ? [s.foto] : [])).map(foto).join(', ') || 'a definir';

const NOME = {
  'capa-colagem': 'Capa de colagem (tipo 2, parede de fotos)',
  'capa-frase': 'Capa de frase (tipo 2, parede de fotos)',
  'corpo-foto': 'Miolo (tipo 2, parede de fotos)',
  'fecho2': 'Fecho com a Dra. (tipo 2)',
  'capa-pergunta': 'Capa de caixa de pergunta (tipo 1)',
  'capa-objecao': 'Capa "Ah, mas..." (tipo 1)',
  'capa-citacao': 'Capa de citação de paciente (tipo 1)',
  'partida': 'Tela partida (tipo 1)',
  'foto-topico': 'Miolo educativo (tipo 1)',
  'fecho-t1': 'Fecho com a Dra. (tipo 1)',
};

const linhas = [];
const titulo = limpo(d.slides[0].titulo ?? d.slides[0].pergunta ?? d.slug);
linhas.push(`# ${titulo}`);
linhas.push(`Dra. Larissa Merola · ${d.arroba ?? '@dralarissamerola'} · ${d.slides.length} slides`);
linhas.push('');
linhas.push('---');

d.slides.forEach((s, i) => {
  linhas.push('');
  linhas.push(`## SLIDE ${i + 1} · ${NOME[s.tipo] ?? s.tipo}`);
  linhas.push(`Imagens: ${s.tipo === 'fecho2' || s.tipo === 'fecho-t1' ? 'foto da Dra.' : fotos(s)}`);
  linhas.push('');
  if (s.pergunta) linhas.push(`Caixinha "Faça uma pergunta":\n"${limpo(s.pergunta)}"`);
  if (s.titulo) linhas.push(limpo(s.titulo));
  if (s.promessa) linhas.push(`\n${limpo(s.promessa)}`);
  if (s.virada) linhas.push(`\nVirada (canto de baixo): ${limpo(s.virada)}`);
  if (s.rotulo) linhas.push(`[rótulo] ${limpo(s.rotulo)}`);
  if (s.texto) linhas.push(`\n${limpo(s.texto)}`);
  if (s.legendas) for (const l of s.legendas) linhas.push(`• ${limpo(l.topo)} **${limpo(l.forte).toUpperCase()}**`);
  if (s.itens) for (const it of s.itens) {
    // o lead vai em negrito na arte: marca com ** pra equipe ver o destaque
    linhas.push(typeof it === 'string' ? `• ${limpo(it)}` : `• **${limpo(it.lead)}** ${limpo(it.texto)}`.trim());
  }
  if (s.convite) linhas.push(`\nConvite: ${limpo(s.convite)}`);
  if (s.ctas) for (const c of s.ctas) linhas.push(`→ ${limpo(c)}`);
  if (s.cta) linhas.push(`→ ${limpo(s.cta)}`);
  linhas.push('');
  linhas.push('---');
});

linhas.push('');
linhas.push('## LEGENDA DO POST');
linhas.push('');
linhas.push(`Siga ${d.arroba ?? '@dralarissamerola'}`);
linhas.push('');
for (const p of d.legenda ?? []) { linhas.push(limpo(p)); linhas.push(''); }

console.log(linhas.join('\n').replace(/\n{3,}/g, '\n\n'));
