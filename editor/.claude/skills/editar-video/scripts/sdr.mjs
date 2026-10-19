// Converte vídeo HDR (o padrão do iPhone) pra SDR antes de montar.
// Se não converter, a imagem sai lavada e o verde do estilo muda de cor.
// uso: node sdr.mjs brutos/2026-10-10-nome/IMG_0001.mov [--saida arquivo.mov] [--forcar]
import { existsSync, statSync } from "node:fs";
import { basename, extname, join, dirname } from "node:path";
import { platform } from "node:os";
import { ffprobe, roda, titulo, conta, aviso } from "./_comum.mjs";

const args = process.argv.slice(2);
const entrada = args.find((a) => !a.startsWith("--"));
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);

if (!entrada || !existsSync(entrada)) {
  console.error("uso: node sdr.mjs <arquivo> [--saida arquivo.mov] [--forcar]");
  process.exit(1);
}

const base = basename(entrada, extname(entrada));
const saida = pega("--saida", join(dirname(entrada), `${base}-sdr.mov`));

const d = await ffprobe(entrada);
const v = d.streams.find((s) => s.codec_type === "video");
const transferencia = v.color_transfer || "";
const ehHdr = /smpte2084|arib-std-b67/i.test(transferencia) || /bt2020/i.test(v.color_primaries || "");

titulo(`HDR → SDR · ${basename(entrada)}`);
if (!ehHdr && !args.includes("--forcar")) {
  conta(`  esse arquivo já é SDR (transferência ${transferencia || "?"}). Nada a fazer.`);
  conta("  se quiser converter mesmo assim, use --forcar.");
  process.exit(0);
}

// No Mac, o caminho do CLAUDE.md é a conversão da própria Apple: ela acerta o tom
// de pele melhor que qualquer curva genérica. Fora do Mac, o ffmpeg faz o serviço.
const noMac = platform() === "darwin";
const temAvconvert = noMac && existsSync("/usr/bin/avconvert");

if (temAvconvert && !args.includes("--ffmpeg")) {
  conta("  usando a conversão de cor da Apple (avconvert)");
  await roda("/usr/bin/avconvert", [
    "--source", entrada, "--output", saida,
    "--preset", "PresetHighestQuality", "--disableSubtitles",
    "--replace",
  ]);
} else {
  if (noMac) aviso("avconvert não encontrado; caindo pro ffmpeg.");
  conta(`  usando o ffmpeg (tonemap hable, ${transferencia || "bt2020"} → bt709)`);
  // linear → tonemap → bt709. O desat=0 segura a cor sem lavar a pele.
  await roda("ffmpeg", [
    "-y", "-v", "error", "-stats", "-i", entrada,
    "-vf", [
      "zscale=t=linear:npl=100",
      "format=gbrpf32le",
      "zscale=p=bt709",
      "tonemap=tonemap=hable:desat=0",
      "zscale=t=bt709:m=bt709:r=tv",
      "format=yuv420p",
    ].join(","),
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
    "-c:a", "copy", saida,
  ], { stdio: "inherit" });
}

const tam = (statSync(saida).size / 1e6).toFixed(1);
conta(`\n  ${saida}  (${tam} MB)`);
conta("  Monte a partir desse arquivo, não do original.");
