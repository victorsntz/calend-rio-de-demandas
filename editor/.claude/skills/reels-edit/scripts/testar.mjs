// Roda a esteira inteira com um bruto de mentira e confere o resultado.
// É a conferência de máquina nova e o teste de regressão das scripts.
// uso: node testar.mjs [--manter]
import { existsSync, rmSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { R, BRUTOS, TRABALHO, RENDERS, FONTES, pasta, roda, ffprobe, titulo, conta } from "./_comum.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const P = "_teste";
const manter = process.argv.includes("--manter");
const no = (...p) => join(AQUI, ...p);

const passos = [];
let falhou = 0;
async function passo(nome, fn) {
  try { const extra = await fn(); passos.push(["✓", nome, extra || ""]); }
  catch (e) { falhou++; passos.push(["✗", nome, String(e.message || e).split("\n")[0].slice(0, 120)]); }
}

titulo("Teste da esteira");

const bruto = join(pasta(join(BRUTOS, P)), "bruto.mp4");
const casa = pasta(join(TRABALHO, P));

await passo("ffmpeg responde", async () => {
  const { saida } = await roda("ffmpeg", ["-hide_banner", "-version"]);
  const v = saida.split("\n")[0].match(/ffmpeg version (\S+)/)?.[1];
  if (!saida.includes("libzimg")) throw new Error("ffmpeg sem libzimg: a conversão HDR→SDR não vai rodar");
  return v;
});

await passo("fonte baixada", async () => {
  if (!existsSync(FONTES)) await roda("node", [no("fontes.mjs")]);
  const ttf = readdirSync(FONTES).filter((f) => f.endsWith(".ttf"));
  if (ttf.length < 7) throw new Error(`só ${ttf.length} peso(s) da STIX; rode node fontes.mjs`);
  return `${ttf.length} pesos`;
});

await passo("grão gerado", async () => {
  await roda("node", [no("grao.mjs")]);
  return "1080x1920";
});

await passo("bruto de mentira", async () => {
  await roda("ffmpeg", ["-y", "-v", "error",
    "-f", "lavfi", "-i", "gradients=s=1080x1920:c0=0x6B5B4A:c1=0x2A2520:speed=0.03:d=14",
    "-f", "lavfi", "-i", "sine=frequency=180:duration=14,volume=0.12",
    "-vf", "noise=alls=6:allf=t,format=yuv420p",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-r", "30",
    "-c:a", "aac", "-t", "14", bruto]);
  return "14 s";
});

await passo("sonda lê o bruto", async () => {
  const { saida } = await roda("node", [no("sonda.mjs"), bruto]);
  if (!saida.includes("1080x1920")) throw new Error("a sonda não leu a resolução");
});

await passo("legendas viram PNG", async () => {
  writeFileSync(join(casa, "legendas.json"), JSON.stringify({
    projeto: P, formato: "reels",
    blocos: [
      { inicio: 2.6, fim: 4.4, texto: "Sua marca pede desculpas" },
      { inicio: 4.5, fim: 6.3, texto: "por ser brasileira" },
      { inicio: 6.4, fim: 8.4, texto: "e o mercado *sente* isso" },
    ],
  }, null, 2));
  await roda("node", [no("legendas.mjs"), "--projeto", P, "--render"]);
  const n = readdirSync(join(casa, "legendas")).filter((f) => f.endsWith(".png")).length;
  if (n !== 3) throw new Error(`esperava 3 PNGs de legenda, saíram ${n}`);
  return "3 blocos";
});

await passo("peças do kit renderizam", async () => {
  const pecas = pasta(join(casa, "pecas"));
  const quais = [
    ["gancho", ["--rotulo", "OPINIÃO", "--texto", "Sua marca pede *desculpas*", "--x", "esquerda", "--y", "300"]],
    ["cartela", ["--texto", "A origem é a **assinatura**.", "--escuro", "--comAssinatura"]],
    ["pilula", ["--texto", "Fale com o estúdio", "--ponto", "--seta", "--y", "1380"]],
    ["citacao", ["--texto", "Brasilidade não se fantasia.", "--y", "700"]],
    ["numero", ["--texto", "929", "--rotulo", "cafés", "--y", "820"]],
    ["lista", ["--indice", "02", "--titulo", "Sotaque emprestado", "--y", "760"]],
    ["assinatura", ["--escuro", "--y", "1260"]],
    ["monograma", ["--y", "260"]],
    ["linha", ["--y", "500"]],
    ["rotulo", ["--texto", "BASTIDORES · DIA 3", "--y", "300"]],
  ];
  for (const [tipo, args] of quais) {
    await roda("node", [no("peca.mjs"), tipo, ...args, "--saida", join(pecas, `${tipo}.png`)]);
  }
  return `${quais.length} peças`;
});

await passo("montagem gera o vídeo", async () => {
  writeFileSync(join(casa, "montagem.json"), JSON.stringify({
    projeto: P, formato: "reels",
    clipes: [
      { arquivo: bruto, de: 0, ate: 2.5, zoom: true },
      { arquivo: bruto, de: 4, ate: 11 },
    ],
    legendas: true,
    pecas: [
      { png: join(casa, "pecas", "gancho.png"), de: 0, ate: 2.5, entrada: "subir" },
      { png: join(casa, "pecas", "cartela.png"), de: 7.5, ate: 9.5, verde: true },
    ],
    grao: true,
    saida: join(RENDERS, `${P}.mp4`),
  }, null, 2));
  await roda("node", [no("montar.mjs"), join(casa, "montagem.json"), "--previa"]);
  const previa = join(casa, `${P}-previa.mp4`);
  if (!existsSync(previa)) throw new Error("a prévia não saiu");
  const d = await ffprobe(previa);
  const v = d.streams.find((s) => s.codec_type === "video");
  if (v.width !== 540) throw new Error(`prévia com ${v.width} de largura, esperava 540`);
  return `prévia ${v.width}x${v.height}`;
});

await passo("fiscal aprova o que está certo", async () => {
  const { saida } = await roda("node", [no("conferir.mjs"), "--projeto", P]);
  if (!saida.includes("zona segura")) throw new Error("o fiscal não conferiu a zona segura");
  if (saida.includes("✗")) throw new Error("o fiscal reprovou um caso que deveria passar");
});

await passo("fiscal barra o que está errado", async () => {
  const arq = join(casa, "legendas.json");
  const bom = readFileSync(arq, "utf8");
  const d = JSON.parse(bom);
  d.blocos[0].texto = "Sua marca — e a sua jornada 🔥";
  d.blocos[1].texto = "não é sobre preço, é sobre valor";
  writeFileSync(arq, JSON.stringify(d, null, 2));
  let barrou = false;
  try { await roda("node", [no("conferir.mjs"), "--projeto", P]); }
  catch (e) { barrou = String(e.stdout || "").includes("contra o ESTILO.md"); }
  writeFileSync(arq, bom);
  if (!barrou) throw new Error("o fiscal deixou passar travessão, emoji, palavra de IA e molde proibido");
  return "travessão, emoji, palavra de IA, molde proibido";
});

titulo("Resultado");
for (const [i, nome, extra] of passos) conta(`  ${i} ${nome.padEnd(32)} ${extra}`);

if (!manter) {
  rmSync(join(BRUTOS, P), { recursive: true, force: true });
  rmSync(casa, { recursive: true, force: true });
  rmSync(join(RENDERS, `${P}.mp4`), { force: true });
  conta("\n  Sujeira do teste apagada. Use --manter pra olhar os arquivos.");
}

conta(falhou ? `\n  ${falhou} passo(s) falharam.` : "\n  Esteira inteira de pé.");
process.exit(falhou ? 1 : 0);
