// Roda a esteira inteira com um bruto de mentira e confere o resultado.
// É a conferência de máquina nova e o teste de regressão das scripts.
// uso: node testar.mjs [--manter]
import { existsSync, rmSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { estilo, formato, R, BRUTOS, TRABALHO, RENDERS, FONTES, pasta, roda, ffprobe, titulo, conta } from "./_comum.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const P = "_teste";
const manter = process.argv.includes("--manter");
const no = (...p) => join(AQUI, ...p);
const F = formato("telao");

const passos = [];
let falhou = 0;
async function passo(nome, fn) {
  try { const extra = await fn(); passos.push(["✓", nome, extra || ""]); }
  catch (e) { falhou++; passos.push(["✗", nome, String(e.message || e).split("\n")[0].slice(0, 110)]); }
}

titulo("Teste da esteira · Norte Sul");

const bruto = join(pasta(join(BRUTOS, P)), "bruto.mp4");
const casa = pasta(join(TRABALHO, P));
const pecas = pasta(join(casa, "pecas"));

await passo("ffmpeg responde", async () => {
  const { saida } = await roda("ffmpeg", ["-hide_banner", "-version"]);
  if (!saida.includes("libzimg")) throw new Error("ffmpeg sem libzimg: a conversão HDR→SDR não vai rodar");
  return saida.split("\n")[0].match(/ffmpeg version (\S+)/)?.[1];
});

await passo("fonte preparada", async () => {
  if (!existsSync(FONTES) || !readdirSync(FONTES).some((f) => f.endsWith(".ttf") || f.endsWith(".otf"))) {
    await roda("node", [no("fontes.mjs")]);
  }
  const { fonteAtiva } = await import("./fontes.mjs");
  const f = fonteAtiva();
  if (!Object.keys(f.arquivos).length) throw new Error("nenhuma fonte disponível");
  return f.oficial ? `${f.familia} (oficial)` : `${f.familia} (substituta)`;
});

await passo("logotipos no lugar", async () => {
  const faltam = [estilo.kit.marca.arquivoEscuro, estilo.kit.marca.arquivoClaro,
                  estilo.kit.marca.assinaturaEscura, estilo.kit.marca.assinaturaClara]
    .filter((a) => !existsSync(join(R, a)));
  if (faltam.length) throw new Error(`faltando: ${faltam.join(", ")}`);
  return "4 versões";
});

await passo("bruto de mentira", async () => {
  await roda("ffmpeg", ["-y", "-v", "error",
    "-f", "lavfi", "-i", `gradients=s=${F.largura}x${F.altura}:c0=0x04306E:c1=0x011A3D:speed=0.03:d=12`,
    "-f", "lavfi", "-i", "sine=frequency=180:duration=12,volume=0.12",
    "-vf", "noise=alls=4:allf=t,format=yuv420p",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-r", String(F.fps),
    "-c:a", "aac", "-t", "12", bruto]);
  return "12 s";
});

await passo("sonda lê o bruto", async () => {
  const { saida } = await roda("node", [no("sonda.mjs"), bruto]);
  if (!saida.includes(`${F.largura}x${F.altura}`)) throw new Error("a sonda não leu a resolução");
});

await passo("roteiro vira derivados", async () => {
  writeFileSync(join(casa, "roteiro.json"), JSON.stringify({
    projeto: P, titulo: "Teste", formato: "telao", duracao: 12,
    anosDaLinha: ["1985", "2000", "2026"],
    blocos: [
      { n: 1, nome: "Abertura", de: 0, ate: 4,
        pecas: [{ tipo: "cartela", rotulo: "TESTE", texto: "Água. Esgotos.\nDrenagem.", sub: "Desde 1985", de: 0, ate: 4 }],
        legendas: [{ de: 0.4, ate: 3.8, texto: "Por trás de uma cidade que funciona" }] },
      { n: 2, nome: "História", de: 4, ate: 12,
        marcos: [
          { ano: "1985", titulo: "O início", de: 4, ate: 8 },
          { ano: "2026", titulo: "Evolução contínua", de: 8, ate: 12 },
        ],
        legendas: [
          { de: 4.2, ate: 7.8, texto: "Os anos passaram e vieram novas equipes." },
          { de: 8.0, ate: 11.8, texto: "A Norte Sul ampliou sua **atuação**." },
        ] },
    ],
  }, null, 2));
  await roda("node", [no("roteiro.mjs"), "--projeto", P, "--render"]);
  if (!existsSync(join(casa, "legendas.json"))) throw new Error("não saiu legendas.json");
  if (!existsSync(join(casa, "montagem.json"))) throw new Error("não saiu montagem.json");
  const n = JSON.parse(readFileSync(join(casa, "pecas.json"), "utf8")).pecas.length;
  return `${n} peças mapeadas`;
});

await passo("peças do kit renderizam", async () => {
  const quais = [
    ["ano", ["--texto", "1985", "--y", "56"]],
    ["linha", ["--anos", "1985|2000|2026", "--ativo", "2000"]],
    ["titulo", ["--texto", "Tudo começou com um **caminhão**"]],
    ["legenda", ["--texto", "1988: já são 3 hidrojatos desobstruindo redes."]],
    ["pilula", ["--texto", "Sabesp|Interior de SP", "--y", "300"]],
    ["cartela", ["--rotulo", "TESTE", "--texto", "Água. Esgotos.\\nDrenagem.", "--comMarca"]],
    ["lista", ["--titulo", "NOSSA MISSÃO", "--itens", "Soluções reais|Bem-estar da população", "--y", "180"]],
    ["marca", []],
    ["numero", ["--texto", "40", "--rotulo", "anos", "--y", "220"]],
    ["rotulo", ["--texto", "NOSSOS VALORES", "--y", "120"]],
    ["degrade", []],
  ];
  for (const [tipo, args] of quais) {
    await roda("node", [no("peca.mjs"), tipo, ...args, "--saida", join(pecas, `${tipo}.png`)]);
  }
  return `${quais.length} peças`;
});

await passo("peça usa a base do quadro", async () => {
  // O viewport do Chromium headless é mais baixo que a janela; sem a folga, a
  // linha do tempo some calada. Este passo é a trava desse bug.
  const png = join(pecas, "linha.png");
  const cru = join(casa, "_l.raw");
  await roda("ffmpeg", ["-y", "-v", "error", "-i", png, "-vf", "alphaextract",
    "-pix_fmt", "gray", "-f", "rawvideo", cru]);
  const b = readFileSync(cru); rmSync(cru, { force: true });
  let maisBaixo = -1;
  for (let i = 0; i < b.length; i++) if (b[i] > 16) maisBaixo = Math.floor(i / F.largura);
  if (maisBaixo < F.linhaDoTempo.y) throw new Error(`nada pintado abaixo de y ${F.linhaDoTempo.y}; o viewport cortou`);
  return `pinta até y ${maisBaixo}`;
});

await passo("legendas viram PNG", async () => {
  await roda("node", [no("legendas.mjs"), "--projeto", P, "--render"]);
  const n = readdirSync(join(casa, "legendas")).filter((f) => f.endsWith(".png")).length;
  if (n !== 3) throw new Error(`esperava 3 PNGs de legenda, saíram ${n}`);
  return "3 blocos";
});

await passo("montagem gera o vídeo", async () => {
  const edl = JSON.parse(readFileSync(join(casa, "montagem.json"), "utf8"));
  edl.clipes = [{ arquivo: bruto, de: 0, ate: 12 }];
  edl.saida = join(RENDERS, `${P}.mp4`);
  writeFileSync(join(casa, "montagem.json"), JSON.stringify(edl, null, 2));
  await roda("node", [no("montar.mjs"), join(casa, "montagem.json"), "--previa"]);
  const previa = join(casa, `${P}-previa.mp4`);
  if (!existsSync(previa)) throw new Error("a prévia não saiu");
  const v = (await ffprobe(previa)).streams.find((s) => s.codec_type === "video");
  if (v.width !== Math.round(F.largura / 2)) throw new Error(`prévia com ${v.width} de largura`);
  return `prévia ${v.width}x${v.height}`;
});

await passo("fiscal aprova o que está certo", async () => {
  const { saida } = await roda("node", [no("conferir.mjs"), "--projeto", P]).catch((e) => ({ saida: String(e.stdout || "") }));
  if (!saida.includes("zona segura")) throw new Error("o fiscal não conferiu a zona segura");
  // Sem a Helvetica ele reprova de propósito; o resto tem que estar limpo.
  const outros = saida.split("\n").filter((l) => l.includes("✗") && !l.includes("fonte"));
  if (outros.length) throw new Error(`reprovou algo que deveria passar: ${outros[0].trim()}`);
  return saida.includes("✗ fonte") ? "reprovou só pela fonte substituta, como esperado" : "limpo";
});

await passo("fiscal barra o que está errado", async () => {
  const arq = join(casa, "legendas.json");
  const bom = readFileSync(arq, "utf8");
  const d = JSON.parse(bom);
  d.blocos[0].texto = "Uma jornada que vai — potencializar tudo 🔥";
  d.blocos[1].texto = "Com **dois** destaques **amarelos** na mesma tela";
  writeFileSync(arq, JSON.stringify(d, null, 2));
  let saida = "";
  try { ({ saida } = await roda("node", [no("conferir.mjs"), "--projeto", P])); }
  catch (e) { saida = String(e.stdout || ""); }
  writeFileSync(arq, bom);
  const pegou = ["travessão", "emoji", "jornada", "potencializar", "destaques amarelos"]
    .filter((t) => saida.includes(t));
  if (pegou.length < 4) throw new Error(`deixou passar: achou só ${pegou.join(", ") || "nada"}`);
  return pegou.join(", ");
});

titulo("Resultado");
for (const [i, nome, extra] of passos) conta(`  ${i} ${nome.padEnd(30)} ${extra}`);

if (!manter) {
  rmSync(join(BRUTOS, P), { recursive: true, force: true });
  rmSync(casa, { recursive: true, force: true });
  rmSync(join(RENDERS, `${P}.mp4`), { force: true });
  conta("\n  Sujeira do teste apagada. Use --manter pra olhar os arquivos.");
}

conta(falhou ? `\n  ${falhou} passo(s) falharam.` : "\n  Esteira inteira de pé.");
process.exit(falhou ? 1 : 0);
