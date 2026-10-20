// Normaliza os clipes do roteiro uma vez só: gira o que veio deitado, converte
// HDR pra SDR, acerta o fps e já entrega no tamanho do quadro. Depois disso a
// montagem é só cortar e sobrepor, e cada render leva minutos em vez de meia hora.
//
// uso: node preparar.mjs --projeto institucional-fenasan [--forcar]
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { formato, oficina, pasta, roda, R, titulo, conta, aviso } from "./_comum.mjs";

const args = process.argv.slice(2);
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);
const projeto = pega("--projeto");
const forcar = args.includes("--forcar");
if (!projeto) { console.error("uso: node preparar.mjs --projeto <nome> [--forcar]"); process.exit(1); }

const casa = oficina(projeto);
const arqEdl = join(casa, "montagem.json");
if (!existsSync(arqEdl)) { console.error(`não achei ${arqEdl}. Rode o roteiro.mjs antes.`); process.exit(1); }

const edl = JSON.parse(readFileSync(arqEdl, "utf8"));
const F = formato(edl.formato || "telao");
const destino = pasta(join(casa, "preparado"));
const perto = (p) => (p.startsWith("/") ? p : join(R, p));

titulo(`Preparando o material · ${projeto}`);
conta(`  alvo: ${F.largura}x${F.altura} · ${F.fps} fps · bt709`);

const novos = [];
let feitos = 0, reaproveitados = 0;

for (const [i, c] of edl.clipes.entries()) {
  if (c.cor || !c.arquivo) { novos.push(c); continue; }

  const fonte = perto(c.arquivo);
  if (!existsSync(fonte)) { console.error(`não achei o clipe: ${fonte}`); process.exit(1); }

  // Um arquivo por trecho: o nome carrega origem e corte, então trecho repetido
  // do mesmo bruto não se atropela.
  const etiqueta = `${String(i + 1).padStart(2, "0")}-${basename(c.arquivo).replace(/\.[^.]+$/, "")}-${c.de}-${c.ate}`
    .replace(/[^a-z0-9.-]+/gi, "-");
  const saida = join(destino, `${etiqueta}.mp4`);
  const dur = Number((c.ate - c.de).toFixed(3));

  if (existsSync(saida) && statSync(saida).size > 10000 && !forcar) {
    reaproveitados++;
    novos.push({ arquivo: saida.replace(R + "/", ""), de: 0, ate: dur, _oque: c._oque, zoom: c.zoom });
    continue;
  }

  const gira = c.girar === "esquerda" ? "transpose=2," : c.girar === "direita" ? "transpose=1," : "";
  const tonemap = c.hdr
    ? "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,"
    : "";
  const vf = `fps=${F.fps},${gira}${tonemap}` +
    `scale=${F.largura}:${F.altura}:force_original_aspect_ratio=increase,crop=${F.largura}:${F.altura},` +
    `setsar=1,format=yuv420p`;

  // -ss antes do -i busca rápido no arquivo grande em vez de decodificar tudo.
  await roda("ffmpeg", ["-y", "-v", "error",
    "-ss", String(c.de), "-t", String(dur), "-i", fonte,
    "-vf", vf,
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
    "-an", saida]);

  feitos++;
  const mb = (statSync(saida).size / 1e6).toFixed(1);
  const marcas = [c.girar ? "girado" : null, c.hdr ? "HDR→SDR" : null].filter(Boolean).join(" · ") || "direto";
  conta(`  ${basename(saida).padEnd(44)} ${mb.padStart(5)} MB  ${marcas}`);
  novos.push({ arquivo: saida.replace(R + "/", ""), de: 0, ate: dur, _oque: c._oque, zoom: c.zoom });
}

// A montagem passa a apontar pros preparados. O roteiro.json segue mandando:
// rodar o roteiro.mjs de novo reescreve a montagem com os brutos, e aí é só
// preparar outra vez.
edl.clipes = novos;
edl._preparado = true;
writeFileSync(arqEdl, JSON.stringify(edl, null, 2));

conta(`\n  ${feitos} preparado(s), ${reaproveitados} reaproveitado(s)`);
conta(`  montagem.json aponta agora pros arquivos de ${destino.replace(R + "/", "")}`);
conta(`\n  Agora: node montar.mjs ${arqEdl.replace(R + "/", "")} --previa`);
