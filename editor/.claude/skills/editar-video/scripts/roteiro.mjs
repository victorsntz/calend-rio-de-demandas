// Abre o roteiro.json e escreve os arquivos de trabalho: legendas, lista de
// peças e a montagem. É a ponte entre o roteiro do cliente e a esteira.
//
// uso: node roteiro.mjs --projeto institucional-fenasan [--render]
//      --render também gera os PNGs de todas as peças e legendas.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { estilo, formato, oficina, pasta, R, titulo, conta, aviso } from "./_comum.mjs";
import { renderizaPeca } from "./peca.mjs";

const args = process.argv.slice(2);
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);
const projeto = pega("--projeto");
const vaiRenderizar = args.includes("--render");

if (!projeto) {
  console.error("uso: node roteiro.mjs --projeto <nome> [--render]");
  process.exit(1);
}

const casa = oficina(projeto);
const arqRoteiro = join(casa, "roteiro.json");
if (!existsSync(arqRoteiro)) { console.error(`não achei ${arqRoteiro}`); process.exit(1); }

const R_ = JSON.parse(readFileSync(arqRoteiro, "utf8"));
const nomeFormato = R_.formato || "telao";
const F = formato(nomeFormato);
const destino = pasta(join(casa, "pecas"));

titulo(`Roteiro · ${R_.titulo}`);
conta(`  ${R_.blocos.length} blocos · ${R_.duracao}s · ${F.largura}x${F.altura}`);

// ---------- legendas ----------

const legendas = R_.blocos.flatMap((b) => b.legendas || []).sort((a, b) => a.de - b.de);
writeFileSync(join(casa, "legendas.json"), JSON.stringify({
  projeto, formato: nomeFormato,
  _leia: "Sai do roteiro.json. Ajuste o texto e a ênfase aqui; **palavra** sai no amarelo (uma por tela).",
  blocos: legendas.map((l) => ({ inicio: l.de, fim: l.ate, texto: l.texto })),
}, null, 2));

const txt = legendas.map((l, i) =>
  `${String(i + 1).padStart(3, "0")}  ${l.de.toFixed(1).padStart(6)} → ${l.ate.toFixed(1).padStart(6)}   ${l.texto.replace(/\n/g, " / ")}`
).join("\n");
writeFileSync(join(casa, "legendas.txt"), txt + "\n");

// ---------- peças ----------

const pecas = [];
const nome = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "");

for (const b of R_.blocos) {
  // Bloco com linha do tempo: cada marco vira foto, etiqueta de ano, título e a linha.
  for (const [i, m] of (b.marcos || []).entries()) {
    const id = `b${b.n}-marco${String(i + 1).padStart(2, "0")}-${m.ano}`;
    if (m.foto) {
      if (!existsSync(join(R, m.foto))) aviso(`foto do marco ${m.ano} não existe: ${m.foto}`);
      pecas.push({ tipo: "imagem", src: m.foto, cheia: true, de: m.de, ate: m.ate,
                   entrada: "nenhuma", zoom: true, saida: join(destino, `${id}-foto.png`) });
    }
    pecas.push({ tipo: "ano", texto: m.ano, y: 56, de: m.de, ate: m.ate, saida: join(destino, `${id}-ano.png`) });
    pecas.push({ tipo: "titulo", texto: m.titulo, de: m.de + 0.2, ate: m.ate, saida: join(destino, `${id}-titulo.png`) });
    pecas.push({ tipo: "linha", anos: R_.anosDaLinha, ativo: m.ano, de: m.de, ate: m.ate,
                 entrada: "nenhuma", saida: join(destino, `${id}-linha.png`) });
    pecas.push({ tipo: "marca", de: m.de, ate: m.ate, entrada: "nenhuma", saida: join(destino, `${id}-marca.png`) });
  }
  // Peças soltas declaradas no bloco.
  for (const [i, p] of (b.pecas || []).entries()) {
    const id = `b${b.n}-${nome(p.tipo)}${i + 1}`;
    pecas.push({ ...p, saida: join(destino, `${id}.png`),
                 destaque: /\*\*/.test(`${p.texto || ""}${p.sub || ""}`) || undefined });
  }
  if (b.transicao) {
    // Os tempos da transição saem do roteiro: é ela que fala com quem assiste
    // no trecho sem narração, então precisa cobrir o vão inteiro.
    pecas.push({ tipo: "cartela", texto: b.transicao.texto, alinhar: "centro",
                 de: b.transicao.de, ate: b.transicao.ate,
                 saida: join(destino, `b${b.n}-transicao.png`) });
  }
}

writeFileSync(join(casa, "pecas.json"), JSON.stringify({ projeto, formato: nomeFormato, pecas }, null, 2));

// ---------- montagem ----------

// A base do vídeo é uma fita contínua. Onde o bloco declara clipes, entram eles;
// o resto (trecho sob cartela ou sob foto de acervo) vira campo de cor.
const janelas = R_.blocos
  .filter((b) => b.clipes?.length && b.cobre)
  .map((b) => ({ de: b.cobre[0], ate: b.cobre[1], clipes: b.clipes, bloco: b.n }))
  .sort((a, b) => a.de - b.de);

const fita = [];
let relogio = 0;
for (const j of janelas) {
  if (j.de > relogio + 0.01) fita.push({ cor: null, dur: Number((j.de - relogio).toFixed(3)), _oque: `preenchimento até ${j.de}s` });
  const soma = j.clipes.reduce((t, c) => t + (c.ate - c.de), 0);
  const janela = j.ate - j.de;
  if (Math.abs(soma - janela) > 0.05) {
    aviso(`bloco ${j.bloco}: os clipes somam ${soma.toFixed(2)}s mas a janela é ${janela.toFixed(2)}s`);
  }
  fita.push(...j.clipes);
  relogio = j.ate;
}
if (relogio < R_.duracao - 0.01) {
  fita.push({ cor: null, dur: Number((R_.duracao - relogio).toFixed(3)), _oque: "preenchimento até o fim" });
}
const totalFita = fita.reduce((t, c) => t + (c.dur ?? c.ate - c.de), 0);

const montagem = {
  projeto, formato: nomeFormato,
  _leia: "A base é contínua: clipe onde aparece imagem, campo de cor onde cartela ou foto de acervo cobre tudo.",
  clipes: fita,
  legendas: true,
  pecas: pecas.map(({ saida, de, ate, entrada, destaque }) => ({
    png: saida.replace(R + "/", ""), de, ate,
    ...(entrada ? { entrada } : {}), ...(destaque ? { destaque } : {}),
  })),
  trilha: null,
  loopConferido: false,
  saida: `renders/${projeto}.mp4`,
};
writeFileSync(join(casa, "montagem.json"), JSON.stringify(montagem, null, 2));

conta(`\n  legendas.json   ${legendas.length} blocos`);
conta(`  legendas.txt    pra ler e aprovar`);
conta(`  pecas.json      ${pecas.length} peças`);
conta(`  montagem.json   ${fita.length} trechos de base · ${totalFita.toFixed(1)}s de ${R_.duracao}s`);

// ---------- render ----------

if (vaiRenderizar) {
  titulo("Renderizando as peças");
  let feitas = 0;
  for (const p of pecas) {
    try {
      await renderizaPeca(p.tipo, p, nomeFormato);
      feitas++;
    } catch (e) {
      aviso(`${p.tipo} (${p.saida.split("/").pop()}): ${String(e.message).split("\n")[0]}`);
    }
  }
  conta(`  ${feitas} de ${pecas.length} peças renderizadas em ${destino}`);
  conta(`\n  Agora as legendas: node legendas.mjs --projeto ${projeto} --render`);
}

if (R_.pendencias?.length) {
  titulo("Pendências do roteiro");
  R_.pendencias.forEach((p) => conta(`  · ${p}`));
}
