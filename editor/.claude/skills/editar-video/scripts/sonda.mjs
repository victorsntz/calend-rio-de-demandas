// Olha um vídeo bruto e diz o que fazer com ele. Primeira coisa antes de montar.
// uso: node sonda.mjs brutos/2026-10-10-nome/IMG_0001.mov [--formato reels]
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { ffprobe, formato, titulo, conta, aviso } from "./_comum.mjs";

const args = process.argv.slice(2);
const arquivo = args.find((a) => !a.startsWith("--"));
const nomeFormato = args.includes("--formato") ? args[args.indexOf("--formato") + 1] : "telao";

if (!arquivo || !existsSync(arquivo)) {
  console.error("uso: node sonda.mjs <arquivo de vídeo> [--formato telao|youtube]");
  process.exit(1);
}

const F = formato(nomeFormato);
const d = await ffprobe(arquivo);
const v = d.streams.find((s) => s.codec_type === "video");
const a = d.streams.find((s) => s.codec_type === "audio");

if (!v) { console.error("esse arquivo não tem trilha de vídeo."); process.exit(1); }

const fps = (() => { const [n, m] = (v.r_frame_rate || "0/1").split("/").map(Number); return m ? n / m : 0; })();
const dur = Number(d.format.duration || v.duration || 0);
// iPhone grava HDR em HLG (arib-std-b67) ou PQ (smpte2084). Os dois precisam virar SDR.
const transferencia = v.color_transfer || "";
const ehHdr = /smpte2084|arib-std-b67/i.test(transferencia) || /bt2020/i.test(v.color_primaries || "");
const girado = (v.side_data_list || []).some((s) => s.rotation);
const rotacao = (v.side_data_list || []).find((s) => s.rotation)?.rotation ?? 0;

titulo(`Bruto · ${basename(arquivo)}`);
conta(`  imagem      ${v.width}x${v.height}  ${fps.toFixed(3)} fps  ${v.codec_name}  ${v.pix_fmt}`);
conta(`  duração     ${dur.toFixed(2)} s`);
conta(`  cor         primárias ${v.color_primaries || "?"} · transferência ${transferencia || "?"} · matriz ${v.color_space || "?"}`);
conta(`  áudio       ${a ? `${a.codec_name} ${a.sample_rate} Hz ${a.channels} canal(is)` : "nenhum"}`);
if (girado) conta(`  rotação     ${rotacao}° na etiqueta (o ffmpeg corrige sozinho)`);

titulo("Veredito");
const fazer = [];

if (ehHdr) {
  fazer.push(`HDR detectado (${transferencia}). Converter pra SDR antes de montar: node sdr.mjs "${arquivo}"`);
} else {
  conta("  ✓ já é SDR, pode montar direto");
}

const alvoVertical = F.altura > F.largura;
const brutoVertical = v.height > v.width || Math.abs(rotacao) === 90;
if (alvoVertical !== brutoVertical) {
  fazer.push(`o bruto é ${brutoVertical ? "vertical" : "horizontal"} e o alvo (${nomeFormato}) é ${alvoVertical ? "vertical" : "horizontal"}. Vai precisar de recorte, e aí a composição do enquadramento muda.`);
} else {
  conta(`  ✓ orientação combina com ${nomeFormato}`);
}

if (Math.abs(fps - F.fps) > 0.05 && Math.abs(fps - 24) > 0.05) {
  fazer.push(`gravado a ${fps.toFixed(2)} fps e a entrega é ${F.fps} fps. O montar.mjs reamostra, mas se foi slow-motion avise antes.`);
} else {
  conta(`  ✓ ${fps.toFixed(2)} fps conversa com a entrega de ${F.fps} fps`);
}

if (!a) fazer.push("sem áudio. Se é fala pra câmera, confira se pegou o arquivo certo.");
if (v.width < F.largura || v.height < F.altura) {
  fazer.push(`resolução menor que a entrega (${v.width}x${v.height} contra ${F.largura}x${F.altura}). Vai esticar e perder nitidez.`);
}

if (fazer.length) { conta(""); fazer.forEach((f, i) => aviso(`${i + 1}. ${f}`)); }
else conta("\n  Nada travando. Próximo passo: transcrever e propor o corte.");
