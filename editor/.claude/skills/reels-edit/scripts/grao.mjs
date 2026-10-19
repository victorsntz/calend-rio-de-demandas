// Gera a textura de grão de papel que vai por cima de tudo (4 a 5%, multiply).
// uso: node grao.mjs [--formato reels] [--saida caminho.png] [--semente 7]
import { join } from "node:path";
import { formato, estilo, roda, TRABALHO, pasta, titulo, conta } from "./_comum.mjs";

const args = process.argv.slice(2);
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);

const F = formato(pega("--formato", "reels"));
const semente = Number(pega("--semente", estilo.textura.grao.semente));
const saida = pega("--saida", join(pasta(join(TRABALHO, "_textura")), `grao-${F.largura}x${F.altura}.png`));

// Ruído claro (180 a 255) com um sopro de desfoque: por cima em multiply dá dente de
// papel sem escurecer a imagem. Ruído puro fica com cara de chuvisco de TV.
await roda("ffmpeg", [
  "-y", "-v", "error",
  "-f", "lavfi", "-i", `nullsrc=s=${F.largura}x${F.altura}`,
  "-vf", [
    `geq=lum='180+random(${semente})*75':cb=128:cr=128`,
    "gblur=sigma=0.5",
    "eq=contrast=1.25",
    "format=gray",
  ].join(","),
  "-frames:v", "1", saida,
]);

titulo("Grão de papel");
conta(`  ${F.largura}x${F.altura} · semente ${semente}`);
conta(`  ${saida}`);
conta(`  entra em multiply a ${(estilo.textura.grao.opacidade * 100).toFixed(1)}% no montar.mjs`);
