// Prepara a fonte dos vídeos. A Helvetica Neue é licenciada da Monotype e não
// pode ser baixada: ela precisa ser copiada pra .fontes/ na mão. Enquanto não
// estiver lá, esta script baixa a Inter, que é a substituta declarada no ESTILO.
//
// uso: node fontes.mjs            prepara o que der
//      node fontes.mjs --estado   só diz o que tem e o que falta
import { writeFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import { estilo, FONTES, R, pasta, titulo, conta, aviso } from "./_comum.mjs";

const F = estilo.fonte;
const EXT = new Set([".otf", ".ttf", ".woff2", ".woff"]);

/** Varre .fontes/ atrás dos arquivos da Helvetica Neue, por nome, sem ligar pra caixa. */
export function helvetica() {
  if (!existsSync(FONTES)) return {};
  const tem = readdirSync(FONTES).filter((f) => EXT.has(extname(f).toLowerCase()));
  const achados = {};
  const limpo = (f) => f.toLowerCase().replace(/[\s_()-]/g, "");
  const semExt = (f) => limpo(f.replace(/\.[^.]+$/, ""));
  for (const [peso, nomes] of Object.entries(F.arquivosEsperados)) {
    const alvos = nomes.map(limpo);
    // Nome exato primeiro. Prefixo sozinho não serve: "HelveticaNeue" é prefixo
    // de Thin, Black e Heavy, e aí o peso 400 vinha com a fonte errada.
    const exato = tem.find((f) => alvos.includes(semExt(f)));
    // No prefixo, o nome mais curto ganha: Bold antes de BoldItalic.
    const porPrefixo = tem
      .filter((f) => alvos.some((a) => semExt(f).startsWith(a)))
      .sort((a, b) => a.length - b.length)[0];
    const certo = exato || porPrefixo;
    if (certo) achados[peso] = join(FONTES, certo);
  }
  return achados;
}

export function substituta() {
  const achados = {};
  for (const peso of Object.keys(F.substituta.arquivos)) {
    const p = join(FONTES, `Inter-${peso}.ttf`);
    if (existsSync(p) && statSync(p).size > 20000) achados[peso] = p;
  }
  return achados;
}

/** Qual fonte a esteira vai usar agora. As peças e o fiscal perguntam isso. */
export function fonteAtiva() {
  const hn = helvetica();
  // sem o peso 700 não dá pra fazer título; aí não é Helvetica de verdade
  if (hn["700"] && (hn["500"] || hn["400"])) {
    return { familia: F.familia, oficial: true, arquivos: hn };
  }
  return { familia: F.substituta.familia, oficial: false, arquivos: substituta(), faltando: hn };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  pasta(FONTES);
  titulo("Fonte");

  const hn = helvetica();
  const pesos = Object.keys(F.arquivosEsperados);
  const achou = pesos.filter((p) => hn[p]);

  if (achou.length) {
    conta(`  Helvetica Neue: ${achou.length} de ${pesos.length} peso(s) em ${FONTES}`);
    for (const p of pesos) conta(`    ${p.padEnd(5)} ${hn[p] ? "✓ " + hn[p].split("/").pop() : "— falta"}`);
  } else {
    conta(`  Helvetica Neue: nenhum arquivo em ${FONTES}`);
  }

  if (!process.argv.includes("--estado")) {
    const falta = Object.entries(F.substituta.arquivos).filter(([p]) => !substituta()[p]);
    if (falta.length) {
      conta(`\n  Baixando a ${F.substituta.familia} (substituta declarada no ESTILO)…`);
      for (const [peso, url] of falta) {
        const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
        if (!r.ok) { aviso(`peso ${peso} falhou: HTTP ${r.status}`); continue; }
        writeFileSync(join(FONTES, `Inter-${peso}.ttf`), Buffer.from(await r.arrayBuffer()));
        conta(`    Inter-${peso}.ttf`);
      }
      writeFileSync(join(FONTES, "LICENCA-Inter.txt"),
        "Inter · SIL Open Font License 1.1\nhttps://rsms.me/inter/\nBaixada do Google Fonts por scripts/fontes.mjs.\n");
    }
  }

  const ativa = fonteAtiva();
  titulo("O que a esteira vai usar");
  if (ativa.oficial) {
    conta(`  ✓ ${ativa.familia} — a fonte da marca. Pode renderizar pra entrega.`);
  } else {
    conta(`  ⚠ ${ativa.familia} — substituta. Serve pra aprovar layout e ritmo.`);
    conta("");
    conta("  Pra entregar com a fonte da marca, copie os arquivos da Helvetica Neue pra:");
    conta(`    ${FONTES}`);
    conta("  Nomes que a esteira reconhece:");
    for (const [peso, nomes] of Object.entries(F.arquivosEsperados)) {
      conta(`    peso ${peso.padEnd(5)} ${nomes.map((n) => n + ".otf").join("  ou  ")}`);
    }
    conta(`\n  ${F.licenca}`);
    conta("  O conferir.mjs avisa em todo render que saiu com a substituta.");
  }
}
