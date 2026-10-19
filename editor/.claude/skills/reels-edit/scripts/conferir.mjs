// O fiscal do ESTILO.md. Roda antes de postar e antes de mostrar pro Victor.
// Confere o arquivo entregue (specs), o texto que vai na tela (seção 4 e 6)
// e onde as peças caem (zona segura e regra do verde).
//
// uso: node conferir.mjs renders/2026-10-10-nome.mp4 [--formato reels] [--projeto nome]
//      node conferir.mjs --projeto 2026-10-10-nome          (só texto e peças)
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { estilo, formato, oficina, roda, ffprobe, R, titulo, conta } from "./_comum.mjs";

const args = process.argv.slice(2);
const arquivo = args.find((a) => !a.startsWith("--"));
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);
const nomeFormato = pega("--formato", "reels");
const F = formato(nomeFormato);
const projeto = pega("--projeto", arquivo ? basename(arquivo).replace(/\.[^.]+$/, "") : null);

const achados = [];
const erro = (o, q) => achados.push({ nivel: "erro", onde: o, oque: q });
const cuidado = (o, q) => achados.push({ nivel: "cuidado", onde: o, oque: q });
const bom = (o, q) => achados.push({ nivel: "ok", onde: o, oque: q });

// ---------- 1. o arquivo entregue ----------

if (arquivo && existsSync(arquivo)) {
  const d = await ffprobe(arquivo);
  const v = d.streams.find((s) => s.codec_type === "video");
  const a = d.streams.find((s) => s.codec_type === "audio");
  const fps = (() => { const [x, y] = (v?.r_frame_rate || "0/1").split("/").map(Number); return y ? x / y : 0; })();
  const dur = Number(d.format.duration || 0);

  if (!v) erro("arquivo", "sem trilha de vídeo");
  else {
    v.width === F.largura && v.height === F.altura
      ? bom("imagem", `${v.width}x${v.height}`)
      : erro("imagem", `${v.width}x${v.height}, a entrega é ${F.largura}x${F.altura}`);

    Math.abs(fps - F.fps) < 0.05 || Math.abs(fps - 24) < 0.05
      ? bom("fps", fps.toFixed(2))
      : erro("fps", `${fps.toFixed(2)}, a entrega é ${F.fps} (ou 24 se gravou em 24)`);

    v.codec_name === "h264" ? bom("codec", "h264") : erro("codec", `${v.codec_name}, a entrega é H.264`);
    v.pix_fmt === "yuv420p" ? bom("pixels", "yuv420p") : cuidado("pixels", `${v.pix_fmt}, o normal é yuv420p`);

    const corOk = (v.color_primaries ?? "bt709") === "bt709" && !/smpte2084|arib-std-b67/i.test(v.color_transfer || "");
    corOk ? bom("cor", "bt709 (SDR)") : erro("cor", `${v.color_primaries}/${v.color_transfer} — saiu HDR ou fora do bt709`);
  }

  a ? (a.codec_name === "aac" ? bom("áudio", `aac ${a.sample_rate} Hz`) : erro("áudio", `${a.codec_name}, a entrega é AAC`))
    : erro("áudio", "sem trilha de áudio");

  if (nomeFormato === "reels") {
    dur >= 20 && dur <= 60 ? bom("duração", `${dur.toFixed(1)} s`)
      : cuidado("duração", `${dur.toFixed(1)} s — o ESTILO trabalha de 20 a 60 s no Reels`);
  } else {
    bom("duração", `${(dur / 60).toFixed(1)} min`);
  }

  // Volume: o Instagram normaliza, mas entregar fora do padrão tira o peso da voz.
  try {
    const { erroSaida } = await roda("ffmpeg", ["-i", arquivo, "-af", "ebur128=framelog=quiet", "-f", "null", "-"]);
    const m = erroSaida.match(/I:\s+(-?[\d.]+) LUFS/);
    if (m) {
      const lufs = Number(m[1]);
      lufs > -20 && lufs < -12 ? bom("volume", `${lufs.toFixed(1)} LUFS`)
        : cuidado("volume", `${lufs.toFixed(1)} LUFS — a faixa boa é de -18 a -14`);
    }
  } catch { /* ebur128 é um luxo, não um bloqueio */ }
}

// ---------- 2. o texto que vai na tela ----------

function olhaTexto(onde, texto) {
  if (!texto) return;
  if (/—|–/.test(texto)) erro(onde, `travessão no texto: "${texto.slice(0, 60)}"`);
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(texto)) erro(onde, `emoji no texto: "${texto.slice(0, 60)}"`);
  if (/não é sobre .+?,?\s*é sobre /i.test(texto)) erro(onde, `molde proibido "não é sobre X, é sobre Y"`);
  for (const p of estilo.voz.palavrasProibidas) {
    if (new RegExp(`\\b${p}\\b`, "i").test(texto)) erro(onde, `palavra de texto de IA: "${p}"`);
  }
  const semMarcas = texto.replace(/\*+/g, "").trim();
  const letras = semMarcas.replace(/[^a-záéíóúâêôãõçà-ÿ]/gi, "");
  if (letras.length > 6 && letras === letras.toUpperCase()) {
    cuidado(onde, `tudo em caixa alta: "${semMarcas.slice(0, 50)}". Caixa alta só em rótulo.`);
  }
  const verdes = (texto.match(/\*\*/g) || []).length / 2;
  if (verdes > estilo.legenda.enfase.maxPorFrase) erro(onde, `${verdes} ênfases verdes numa frase só; o máximo é ${estilo.legenda.enfase.maxPorFrase}`);
}

let fechamentos = 0;
if (projeto) {
  const casa = oficina(projeto);
  const arqLeg = join(casa, "legendas.json");
  if (existsSync(arqLeg)) {
    const { blocos } = JSON.parse(readFileSync(arqLeg, "utf8"));
    blocos.forEach((b, i) => olhaTexto(`legenda ${String(i + 1).padStart(3, "0")}`, b.texto));
    const longos = blocos.filter((b) => b.texto.replace(/\*/g, "").split(/\s+/).length > F.legenda.palavrasPorVez[1]);
    longos.length ? cuidado("legendas", `${longos.length} bloco(s) acima de ${F.legenda.palavrasPorVez[1]} palavras`)
      : bom("legendas", `${blocos.length} blocos dentro do tamanho`);
    for (const f of estilo.voz.frasesDeFechamento) {
      if (blocos.some((b) => b.texto.toLowerCase().includes(f.toLowerCase().replace(/\.$/, "")))) fechamentos++;
    }
  }

  const arqEdl = join(casa, "montagem.json");
  if (existsSync(arqEdl)) {
    const edl = JSON.parse(readFileSync(arqEdl, "utf8"));
    for (const [i, p] of (edl.pecas || []).entries()) {
      for (const campo of ["texto", "titulo", "rotulo"]) olhaTexto(`peça ${i + 1} (${campo})`, p[campo]);
    }
    if (edl.pecas?.some((p) => p.texto)) {
      for (const f of estilo.voz.frasesDeFechamento) {
        if (edl.pecas.some((p) => (p.texto || "").toLowerCase().includes(f.toLowerCase().replace(/\.$/, "")))) fechamentos++;
      }
    }
    // Dois verdes ao mesmo tempo na tela.
    const vs = (edl.pecas || []).filter((p) => p.verde);
    for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) {
      if (vs[i].de < vs[j].ate && vs[j].de < vs[i].ate) erro("verde", `duas peças verdes juntas em ${vs[j].de}s`);
    }
  }

  if (fechamentos > estilo.voz.maxFrasesDeFechamentoPorVideo) {
    erro("voz", `${fechamentos} frases de fechamento da marca; o ESTILO deixa ${estilo.voz.maxFrasesDeFechamentoPorVideo} por vídeo`);
  }

  // ---------- 3. zona segura das peças ----------
  // Mede a caixa do que foi pintado lendo o alpha reduzido. O cropdetect do ffmpeg
  // não solta nada com um quadro só, e signalstats não dá a posição.
  const Z = F.zonaSegura;
  const LARG = 270, ALT = Math.round((F.altura / F.largura) * LARG);
  const fator = F.largura / LARG;

  async function caixaDoPng(png) {
    const cru = join(casa, "_alpha.raw");
    await roda("ffmpeg", ["-y", "-v", "error", "-i", png,
      "-vf", `alphaextract,scale=${LARG}:${ALT}:flags=area`,
      "-pix_fmt", "gray", "-f", "rawvideo", cru]);
    const b = readFileSync(cru);
    rmSync(cru, { force: true });
    let x1 = LARG, y1 = ALT, x2 = -1, y2 = -1;
    for (let y = 0; y < ALT; y++) {
      for (let x = 0; x < LARG; x++) {
        // 64 e não 8: a sombra do kit é um borrão de 30 px a 30%, e a franja dela
        // não é conteúdo. Medir a partir de 8 reprovava peça com o texto no lugar.
        if (b[y * LARG + x] > 64) {
          if (x < x1) x1 = x; if (x > x2) x2 = x;
          if (y < y1) y1 = y; if (y > y2) y2 = y;
        }
      }
    }
    if (x2 < 0) return null;
    return {
      x: Math.round(x1 * fator), y: Math.round(y1 * fator),
      w: Math.round((x2 - x1 + 1) * fator), h: Math.round((y2 - y1 + 1) * fator),
    };
  }

  let conferidas = 0, fora = 0;
  for (const pp of [join(casa, "legendas"), join(casa, "pecas")].filter(existsSync)) {
    for (const nome of readdirSync(pp).filter((f) => f.endsWith(".png")).slice(0, 80)) {
      let c;
      try { c = await caixaDoPng(join(pp, nome)); } catch { continue; }
      if (!c) continue;
      conferidas++;
      // Peça que encosta nas duas bordas é de sangria (cartela, escurecido do gancho).
      // Texto nunca chega na borda, então essa é uma separação segura.
      if (c.x <= 2 && c.x + c.w >= F.largura - 2) continue;
      if (c.x < Z.x1 || c.y < Z.y1 || c.x + c.w > Z.x2 || c.y + c.h > Z.y2) {
        fora++;
        erro("zona segura", `${nome} ocupa x ${c.x}–${c.x + c.w}, y ${c.y}–${c.y + c.h}; a zona é x ${Z.x1}–${Z.x2}, y ${Z.y1}–${Z.y2}`);
      }
    }
  }
  if (conferidas) {
    fora ? cuidado("zona segura", `${fora} de ${conferidas} peça(s) fora`)
         : bom("zona segura", `${conferidas} peça(s) dentro da zona do Instagram`);
  }
}

// ---------- 4. a fonte ----------
const fontes = join(R, ".fontes");
if (existsSync(fontes)) {
  const ttf = readdirSync(fontes).filter((f) => f.endsWith(".ttf"));
  ttf.length >= 7 ? bom("fonte", `STIX Two Text, ${ttf.length} pesos`) : cuidado("fonte", `só ${ttf.length} peso(s). Rode: node fontes.mjs`);
} else cuidado("fonte", "a pasta .fontes não existe. Rode: node fontes.mjs");

// ---------- veredito ----------

titulo(`Conferência · ${projeto || basename(arquivo || "")}`);
const icone = { ok: "✓", cuidado: "⚠", erro: "✗" };
for (const nivel of ["erro", "cuidado", "ok"]) {
  for (const a of achados.filter((x) => x.nivel === nivel)) {
    conta(`  ${icone[nivel]} ${a.onde.padEnd(16)} ${a.oque}`);
  }
}

const erros = achados.filter((a) => a.nivel === "erro").length;
const cuidados = achados.filter((a) => a.nivel === "cuidado").length;
conta("");
if (erros) {
  conta(`  ${erros} coisa(s) contra o ESTILO.md. Conserte antes de mostrar pro Victor.`);
  process.exit(1);
}
conta(cuidados ? `  Passou, com ${cuidados} ponto(s) pra olhar.` : "  Passou limpo. Pode entregar.");
