// O fiscal do ESTILO.md. Roda antes de mostrar pro cliente e antes de mandar
// pro telão. Confere o arquivo entregue, o texto que vai na tela e onde as
// peças caem.
//
// uso: node conferir.mjs renders/institucional-fenasan.mp4 --projeto institucional-fenasan
//      node conferir.mjs --projeto institucional-fenasan        (só texto e peças)
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { estilo, formato, oficina, roda, ffprobe, R, FONTES, titulo, conta } from "./_comum.mjs";
import { fonteAtiva } from "./fontes.mjs";

const args = process.argv.slice(2);
const arquivo = args.find((a) => !a.startsWith("--"));
const pega = (n, pad) => (args.includes(n) ? args[args.indexOf(n) + 1] : pad);
const nomeFormato = pega("--formato", "telao");
const F = formato(nomeFormato);
const projeto = pega("--projeto", arquivo ? basename(arquivo).replace(/\.[^.]+$/, "") : null);

const achados = [];
const erro = (o, q) => achados.push({ nivel: "erro", onde: o, oque: q });
const cuidado = (o, q) => achados.push({ nivel: "cuidado", onde: o, oque: q });
const bom = (o, q) => achados.push({ nivel: "ok", onde: o, oque: q });

// ---------- 1. a fonte ----------
// Vem primeiro porque é o que impede a entrega, não só o que incomoda.

const fonte = fonteAtiva();
if (fonte.oficial) {
  bom("fonte", `${fonte.familia} — a fonte da marca`);
} else {
  erro("fonte", `o render sairia com ${fonte.familia}, que é substituta. A entrega pede ${estilo.fonte.familia}. ` +
    `Copie os arquivos pra ${FONTES} e renderize de novo.`);
}

// ---------- 2. o arquivo entregue ----------

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
      : erro("imagem", `${v.width}x${v.height}, o telão é ${F.largura}x${F.altura}`);

    Math.abs(fps - F.fps) < 0.05
      ? bom("fps", fps.toFixed(2))
      : erro("fps", `${fps.toFixed(2)}, a entrega é ${F.fps}`);

    v.codec_name === "h264" ? bom("codec", "h264") : erro("codec", `${v.codec_name}, a entrega é H.264`);
    v.pix_fmt === "yuv420p" ? bom("pixels", "yuv420p") : cuidado("pixels", `${v.pix_fmt}, o normal é yuv420p`);

    const corOk = (v.color_primaries ?? "bt709") === "bt709" && !/smpte2084|arib-std-b67/i.test(v.color_transfer || "");
    corOk ? bom("cor", "bt709 (SDR)") : erro("cor", `${v.color_primaries}/${v.color_transfer} — saiu HDR ou fora do bt709`);
  }

  a ? (a.codec_name === "aac" ? bom("áudio", `aac ${a.sample_rate} Hz`) : erro("áudio", `${a.codec_name}, a entrega é AAC`))
    : cuidado("áudio", "sem trilha de áudio. O telão toca mudo, mas o arquivo final costuma levar a locução.");

  bom("duração", `${Math.floor(dur / 60)}:${String(Math.round(dur % 60)).padStart(2, "0")}`);

  // O ESTILO manda o fim casar com o começo, pra rodar em loop sem solavanco.
  if (v && dur > 1) {
    try {
      const casa = projeto ? oficina(projeto) : "/tmp";
      const a0 = join(casa, "_loop-inicio.png"), a1 = join(casa, "_loop-fim.png");
      await roda("ffmpeg", ["-y", "-v", "error", "-i", arquivo, "-frames:v", "1", a0]);
      await roda("ffmpeg", ["-y", "-v", "error", "-sseof", "-0.2", "-i", arquivo, "-frames:v", "1", "-update", "1", a1]);
      const { erroSaida } = await roda("ffmpeg", ["-hide_banner", "-v", "info", "-i", a0, "-i", a1,
        "-filter_complex", "[0][1]ssim", "-f", "null", "-"]);
      rmSync(a0, { force: true }); rmSync(a1, { force: true });
      const m = erroSaida.match(/All:\s*([\d.]+)/);
      if (m) {
        const ssim = Number(m[1]);
        ssim > 0.97 ? bom("loop", `primeiro e último quadro batem (SSIM ${ssim.toFixed(3)})`)
          : erro("loop", `primeiro e último quadro diferentes (SSIM ${ssim.toFixed(3)}). No telão a volta vai dar solavanco.`);
      }
    } catch { /* o teste de loop é um luxo, não um bloqueio */ }
  }
}

// ---------- 3. o texto que vai na tela ----------

function olhaTexto(onde, texto) {
  if (!texto) return;
  if (/—|–/.test(texto)) erro(onde, `travessão no texto: "${texto.slice(0, 60)}"`);
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(texto)) erro(onde, `emoji no texto: "${texto.slice(0, 60)}"`);
  for (const p of estilo.voz.palavrasProibidas) {
    if (new RegExp(`\\b${p}\\b`, "i").test(texto)) erro(onde, `palavra de texto de IA: "${p}"`);
  }
  const destaques = (texto.match(/\*\*/g) || []).length / 2;
  if (destaques > estilo.regraDoAmarelo.maxDestaquesPorTela) {
    erro(onde, `${destaques} destaques amarelos na mesma tela; o máximo é ${estilo.regraDoAmarelo.maxDestaquesPorTela}`);
  }
}

if (projeto) {
  const casa = oficina(projeto);

  const arqLeg = join(casa, "legendas.json");
  if (existsSync(arqLeg)) {
    const { blocos } = JSON.parse(readFileSync(arqLeg, "utf8"));
    blocos.forEach((b, i) => olhaTexto(`legenda ${String(i + 1).padStart(3, "0")}`, b.texto));
    const [minP, maxP] = F.legenda.palavrasPorVez;
    const longos = blocos.filter((b) => b.texto.replace(/\*/g, "").split(/\s+/).length > maxP);
    longos.length ? cuidado("legendas", `${longos.length} bloco(s) acima de ${maxP} palavras`)
      : bom("legendas", `${blocos.length} blocos dentro do tamanho`);

    // Nada pode ficar menos que o mínimo na tela: de pé, a dez metros, não lê.
    const rapidos = blocos.filter((b) => b.fim - b.inicio < F.ritmo.minimoNaTela);
    if (rapidos.length) cuidado("ritmo", `${rapidos.length} legenda(s) com menos de ${F.ritmo.minimoNaTela}s na tela`);

    // O ESTILO manda legenda do começo ao fim da narração. Trecho sem narração
    // conta como coberto quando uma peça com texto está na tela: cartela de
    // transição e lista também falam com quem assiste no mudo.
    if (blocos.length > 1) {
      const arqPecas = join(casa, "pecas.json");
      const comTexto = existsSync(arqPecas)
        ? JSON.parse(readFileSync(arqPecas, "utf8")).pecas
            .filter((p) => p.texto || p.itens || p.titulo)
            .map((p) => ({ de: p.de ?? 0, ate: p.ate ?? 0 }))
        : [];
      const cobre = (de, ate) => comTexto.some((p) => p.de <= de + 0.2 && p.ate >= ate - 0.2);

      const buracos = [];
      for (let i = 1; i < blocos.length; i++) {
        const de = blocos[i - 1].fim, ate = blocos[i].inicio;
        if (ate - de > 1.5 && !cobre(de, ate)) buracos.push({ de, ate });
      }
      buracos.length
        ? erro("cobertura", `${buracos.length} trecho(s) sem nada escrito na tela, o maior de ${Math.max(...buracos.map((b) => b.ate - b.de)).toFixed(1)}s em ${buracos[0].de.toFixed(1)}s. O telão toca mudo.`)
        : bom("cobertura", "texto na tela do começo ao fim");
    }
  }

  const arqEdl = join(casa, "montagem.json");
  if (existsSync(arqEdl)) {
    const edl = JSON.parse(readFileSync(arqEdl, "utf8"));
    for (const [i, p] of (edl.pecas || []).entries()) {
      for (const campo of ["texto", "titulo", "rotulo", "sub"]) olhaTexto(`peça ${i + 1} (${campo})`, p[campo]);
    }
    const ds = (edl.pecas || []).filter((p) => p.destaque);
    for (let i = 0; i < ds.length; i++) for (let j = i + 1; j < ds.length; j++) {
      if (ds[i].de < ds[j].ate && ds[j].de < ds[i].ate) erro("amarelo", `dois destaques na tela ao mesmo tempo em ${ds[j].de}s`);
    }
  }

  // ---------- 4. zona segura das peças ----------
  const Z = F.zonaSegura;
  const LARG = 252, ALT = Math.round((F.altura / F.largura) * LARG);
  const fator = F.largura / LARG;

  async function caixaDoPng(png) {
    const cru = join(casa, "_alpha.raw");
    await roda("ffmpeg", ["-y", "-v", "error", "-i", png,
      "-vf", `alphaextract,scale=${LARG}:${ALT}:flags=area`, "-pix_fmt", "gray", "-f", "rawvideo", cru]);
    const b = readFileSync(cru);
    rmSync(cru, { force: true });
    let x1 = LARG, y1 = ALT, x2 = -1, y2 = -1;
    for (let y = 0; y < ALT; y++) for (let x = 0; x < LARG; x++) {
      // 64 e não 8: sombra e degradê não são conteúdo.
      if (b[y * LARG + x] > 64) {
        if (x < x1) x1 = x; if (x > x2) x2 = x;
        if (y < y1) y1 = y; if (y > y2) y2 = y;
      }
    }
    if (x2 < 0) return null;
    return { x: Math.round(x1 * fator), y: Math.round(y1 * fator),
             w: Math.round((x2 - x1 + 1) * fator), h: Math.round((y2 - y1 + 1) * fator) };
  }

  let conferidas = 0, fora = 0;
  for (const pp of [join(casa, "legendas"), join(casa, "pecas")].filter(existsSync)) {
    for (const nome of readdirSync(pp).filter((f) => f.endsWith(".png")).slice(0, 120)) {
      let c;
      try { c = await caixaDoPng(join(pp, nome)); } catch { continue; }
      if (!c) continue;
      conferidas++;
      // Peça que encosta nas duas bordas é de sangria (cartela, foto, degradê).
      if (c.x <= 2 && c.x + c.w >= F.largura - 2) continue;
      if (c.x < Z.x1 || c.y < Z.y1 || c.x + c.w > Z.x2 || c.y + c.h > Z.y2) {
        fora++;
        erro("zona segura", `${nome} ocupa x ${c.x}–${c.x + c.w}, y ${c.y}–${c.y + c.h}; a zona é x ${Z.x1}–${Z.x2}, y ${Z.y1}–${Z.y2}`);
      }
    }
  }
  if (conferidas) {
    fora ? cuidado("zona segura", `${fora} de ${conferidas} peça(s) fora`)
         : bom("zona segura", `${conferidas} peça(s) dentro da zona do painel`);
  }
}

// ---------- veredito ----------

titulo(`Conferência · ${projeto || basename(arquivo || "")}`);
const icone = { ok: "✓", cuidado: "⚠", erro: "✗" };
for (const nivel of ["erro", "cuidado", "ok"]) {
  for (const a of achados.filter((x) => x.nivel === nivel)) conta(`  ${icone[nivel]} ${a.onde.padEnd(14)} ${a.oque}`);
}

const erros = achados.filter((a) => a.nivel === "erro").length;
const cuidados = achados.filter((a) => a.nivel === "cuidado").length;
conta("");
if (erros) {
  conta(`  ${erros} coisa(s) contra o ESTILO.md. Conserte antes de mandar pro telão.`);
  process.exit(1);
}
conta(cuidados ? `  Passou, com ${cuidados} ponto(s) pra olhar.` : "  Passou limpo. Pode entregar.");
