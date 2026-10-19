// Baixa a STIX Two Text pra editor/.fontes/. Roda uma vez por computador.
// A fonte é SIL OFL 1.1, então pode baixar e usar sem dor de cabeça.
import { writeFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { estilo, FONTES, pasta, titulo, conta, aviso } from "./_comum.mjs";

const NOMES = {
  "400": "STIXTwoText-Regular.ttf",
  "500": "STIXTwoText-Medium.ttf",
  "600": "STIXTwoText-SemiBold.ttf",
  "700": "STIXTwoText-Bold.ttf",
  "400i": "STIXTwoText-Italic.ttf",
  "500i": "STIXTwoText-MediumItalic.ttf",
  "600i": "STIXTwoText-SemiBoldItalic.ttf",
};

pasta(FONTES);
titulo("Fonte · STIX Two Text");

let baixadas = 0, jaTinha = 0;
for (const [peso, url] of Object.entries(estilo.fonte.arquivos)) {
  const destino = join(FONTES, NOMES[peso] ?? `STIXTwoText-${peso}.ttf`);
  if (existsSync(destino) && statSync(destino).size > 20000) { jaTinha++; continue; }
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!r.ok) { aviso(`peso ${peso} falhou: HTTP ${r.status}`); continue; }
  writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
  conta(`  baixei  ${NOMES[peso]}`);
  baixadas++;
}

writeFileSync(join(FONTES, "LICENCA.txt"),
  "STIX Two Text · SIL Open Font License 1.1\nhttps://github.com/stipub/stixfonts\nBaixada do Google Fonts por scripts/fontes.mjs.\n");

conta(`\n${baixadas} baixada(s), ${jaTinha} já estava(m) aqui. Pasta: ${FONTES}`);
if (baixadas + jaTinha < 7) aviso("faltou alguma. Sem a fonte certa, legenda e peças saem erradas.");
