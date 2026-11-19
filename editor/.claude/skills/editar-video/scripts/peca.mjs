// Renderiza uma peça do kit do ESTILO.md num PNG transparente do tamanho do quadro.
// Transparente e do tamanho do quadro porque aí o montar.mjs só sobrepõe em 0,0 e
// cuida do tempo e da entrada. Uma peça por PNG.
//
// uso:
//   node peca.mjs ano       --texto "1985–1990" --y 56
//   node peca.mjs titulo    --texto "Tudo começou com um **caminhão**" --y 420
//   node peca.mjs legenda   --texto "1988: já são 3 hidrojatos desobstruindo redes."
//   node peca.mjs linha     --ativo 1988
//   node peca.mjs cartela   --rotulo "FENASAN 2026" --texto "Linha do tempo" --comMarca
//   node peca.mjs lista     --titulo "NOSSA MISSÃO" --itens "Soluções para as necessidades reais|Bem-estar da população"
//   node peca.mjs --json roteiro-de-pecas.json
//
// Ênfase no texto:  **palavra**  sai no amarelo de acento. Uma por frase.
import { writeFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import {
  estilo, formato, FONTES, TRABALHO, MARCA, R, pasta, roda, rgba, CHROMIUM,
  titulo, conta, aviso,
} from "./_comum.mjs";
import { fonteAtiva } from "./fontes.mjs";

const C = estilo.cores;
const K = estilo.kit;
const cor = (n) => C[n].hex;

// ---------- fonte ----------

function faceDaFonte() {
  const f = fonteAtiva();
  if (!Object.keys(f.arquivos).length) {
    throw new Error(`nenhuma fonte em ${FONTES}. Rode: node fontes.mjs`);
  }
  const regras = Object.entries(f.arquivos).map(([k, caminho]) => {
    const italico = k.endsWith("i");
    const peso = parseInt(k, 10);
    const tipo = caminho.toLowerCase().endsWith(".otf") ? "opentype" : "truetype";
    return `@font-face{font-family:'MarcaNS';font-weight:${peso};font-style:${italico ? "italic" : "normal"};` +
      `src:url('file://${caminho}') format('${tipo}')}`;
  }).join("");
  return { regras, familia: f.familia, oficial: f.oficial };
}

// ---------- texto ----------

// A quebra de linha do JSON tem que virar quebra na tela: no telão quem decide
// onde a frase corta é quem escreveu, não a largura da caixa.
const escapa = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/\n/g, "<br>");

/** Conta só os DESTAQUES amarelos de conteúdo. A mobília do sistema (barra do
 *  ano, barra da legenda, ponto ativo da linha) é amarela por desenho e não entra. */
let amarelosNaPeca = 0;
const contaAmarelo = () => { amarelosNaPeca++; };

/** **x** vira amarelo. Uma por frase, diz o ESTILO. */
function enfatiza(texto) {
  return escapa(texto).replace(/\*\*(.+?)\*\*/g, (_, p) => {
    contaAmarelo();
    return `<span style="color:${cor("amarelo")}">${p}</span>`;
  });
}

function limpaVicios(texto) {
  if (/—|–/.test(texto)) aviso("travessão no texto da tela. O ESTILO proíbe (seção 5).");
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(texto)) aviso("emoji no texto da tela. O ESTILO proíbe.");
  for (const p of estilo.voz.palavrasProibidas) {
    if (new RegExp(`\\b${p}\\b`, "i").test(texto)) aviso(`palavra de texto de IA na tela: "${p}".`);
  }
  return texto;
}

const lista = (v) => (Array.isArray(v) ? v : String(v).split("|").map((s) => s.trim()).filter(Boolean));

// ---------- as peças ----------

/** Peça usada solta precisa do .bloco, que é quem posiciona. Dentro de outra
 *  peça o .bloco atrapalha, então quem chama de dentro passa _interno. */
const envolve = (html, o) => (o._interno ? html : `<div class="bloco">${html}</div>`);

function pecaRotulo(o, F) {
  const t = o.tamanho || K.rotulo.tamanho;
  return envolve(`<div class="rotulo" style="color:${o.cor || K.rotulo.cor};font-size:${t}px">${escapa(o.texto).toUpperCase()}</div>`, o);
}

function pecaAno(o, F) {
  // O carimbo do bloco: caixa branca, barra amarela, texto azul quase preto.
  const t = o.tamanho || K.ano.tamanho;
  const [rv, rh] = K.ano.respiro;
  return envolve(`<div style="display:inline-flex;align-items:stretch;border-radius:${K.ano.raio}px;overflow:hidden;background:${K.ano.fundo}">
    <div style="width:${K.ano.barra.largura}px;background:${K.ano.barra.cor};flex:0 0 auto"></div>
    <div style="padding:${rv}px ${rh + 6}px;font-weight:${estilo.fonte.pesos.titulo};font-size:${t}px;line-height:1.1;color:${K.ano.texto};white-space:nowrap">${escapa(o.texto)}</div>
  </div>`, o);
}

function pecaTitulo(o, F) {
  const cfg = F.titulo;
  const t = o.tamanho || cfg.tamanhoMax;
  const degrade = o.semDegrade ? "" : pecaDegrade({ _interno: true }, F);
  // Sombra atrás da letra, não embaixo: sobre obra clara o degradê de base não
  // dá conta sozinho e o branco se mistura com o fundo.
  const sb = K.titulo.sombra;
  const sombraTitulo = sb ? `text-shadow:0 ${sb.y}px ${sb.desfoque}px ${rgba(sb.cor, sb.opacidade)}` : "";
  return `${degrade}<div class="bloco" style="text-align:${o.alinhar || cfg.alinhamento === "esquerda" ? "left" : "center"}">
    <div style="font-weight:${estilo.fonte.pesos.titulo};font-size:${t}px;line-height:1.1;letter-spacing:-.015em;color:${K.titulo.cor};${sombraTitulo}">${enfatiza(o.texto)}</div>
  </div>`;
}

function pecaLegenda(o, F) {
  // Legenda numa placa de azul noite com a barra amarela à esquerda. A placa é
  // o que faz o branco fechar contraste sobre obra clara: sem ela a letra se
  // mistura com o fundo e some a dez metros. A barra amarra à marca.
  const L = estilo.legenda;
  const cfg = F.legenda;
  const P = L.placa;
  const t = o.tamanho || cfg.tamanhoMax;
  const faixa = cfg.faixaY;
  const x = F.zonaSegura.x1;
  const larg = F.zonaSegura.x2 - x;
  const comPlaca = o.placa !== false && P;
  const fundo = comPlaca
    ? `background:${rgba(cor(P.cor), P.opacidade)};padding:${P.respiro[0]}px ${P.respiro[1]}px;border-radius:${P.raio}px;`
    : `text-shadow:0 2px 10px ${rgba("#000000", .75)}, 0 0 22px ${rgba("#000000", .55)};`;
  return `<div style="position:absolute;left:${x}px;top:${faixa[0]}px;width:${larg}px;height:${faixa[1] - faixa[0]}px;
      display:flex;align-items:flex-end">
    <div style="display:flex;align-items:stretch;gap:${L.barra.respiro}px;max-width:100%;${fundo}">
      <div style="width:${L.barra.largura}px;background:${L.barra.cor};flex:0 0 auto;border-radius:1px"></div>
      <div style="font-weight:${estilo.fonte.pesos.legenda};font-size:${t}px;line-height:1.26;color:${L.cor}">${enfatiza(o.texto)}</div>
    </div></div>`;
}

function pecaLinha(o, F) {
  // A linha do tempo viva na base: um ponto por marco, o ativo em amarelo.
  const cfg = F.linhaDoTempo;
  const T = K.linhaDoTempo;
  const anos = lista(o.anos || "1985|1990|1995|2000|2005|2010|2015|2020|2025");
  const ativo = String(o.ativo ?? anos[0]);
  // O ponto ativo tem raio e o ano tem largura: sem recuo os dois vazam a zona
  // segura nas pontas. O recuo é o que mantém a linha inteira dentro do painel.
  const recuo = cfg.recuoLateral ?? 34;
  const x1 = F.zonaSegura.x1 + recuo, x2 = F.zonaSegura.x2 - recuo;

  const pontos = anos.map((ano, i) => {
    const p = anos.length === 1 ? 0 : i / (anos.length - 1);
    const px = x1 + p * (x2 - x1);
    const eh = ano === ativo;
    const r = eh ? cfg.raioPontoAtivo : cfg.raioPonto;
    return `<div style="position:absolute;left:${px - r}px;top:${-r}px;width:${r * 2}px;height:${r * 2}px;
        border-radius:50%;background:${eh ? T.corAtivo : T.cor};opacity:${eh ? 1 : T.opacidade}"></div>
      <div style="position:absolute;left:${px - 30}px;top:${cfg.raioPontoAtivo + 7}px;width:60px;text-align:center;
        font-weight:${eh ? estilo.fonte.pesos.titulo : estilo.fonte.pesos.corpo};font-size:${T.tamanhoAno}px;
        color:${eh ? "#FFFFFF" : T.cor};opacity:${eh ? 1 : T.opacidade};letter-spacing:.04em">${escapa(ano)}</div>`;
  }).join("");

  return `<div style="position:absolute;left:0;top:${o.y ?? cfg.y}px;width:${F.largura}px;height:0">
    <div style="position:absolute;left:${x1}px;top:${-cfg.espessura / 2}px;width:${x2 - x1}px;height:${cfg.espessura}px;
      background:${T.cor};opacity:${T.opacidade}"></div>${pontos}</div>`;
}

function pecaPilula(o, F) {
  const P = K.pilula;
  const t = o.tamanho || P.tamanho;
  const [rv, rh] = P.respiro;
  const itens = lista(o.texto);
  const cheia = !!o.preenchida;
  if (cheia) contaAmarelo();
  const uma = (txt) => `<span style="display:inline-flex;align-items:center;border-radius:${P.raio}px;
    padding:${rv}px ${rh}px;font-weight:${estilo.fonte.pesos.legenda};font-size:${t}px;line-height:1;white-space:nowrap;
    ${cheia ? `background:${P.preenchida.fundo};color:${P.preenchida.texto}`
            : `border:${P.contorno.largura}px solid ${rgba(P.contorno.cor, P.contorno.opacidade)};color:${P.contorno.cor}`}">${escapa(txt)}</span>`;
  return envolve(`<div style="display:flex;flex-wrap:wrap;gap:${Math.round(t * .5)}px;justify-content:${o.alinhar === "centro" ? "center" : "flex-start"}">${itens.map(uma).join("")}</div>`, o);
}

function pecaCartela(o, F) {
  // Quadro inteiro em azul profundo com um clarão no canto, ou sobre vídeo com
  // véu. Tudo encostado à esquerda, logotipo incluído: o logotipo solto no meio
  // do quadro ficava distante do resto e desproporcional.
  const Cc = K.cartela;
  const Z = F.zonaSegura;
  const t = o.tamanho || F.cartela.tamanhoMax;
  const centro = o.alinhar === "centro";

  const fundo = o.veu
    ? `<div class="cheia" style="background:${rgba(cor("azulNoite"), Number(o.veu))}"></div>`
    : `<div class="cheia" style="background:${Cc.fundo}"></div>
       <div class="cheia" style="background:radial-gradient(70% 90% at 88% 6%, ${rgba(Cc.clarao.cor, Cc.clarao.opacidade)} 0%, transparent 62%)"></div>`;

  // O vão entre o rótulo e o título sai do corpo do título. Fixo em 16 px, o
  // "FENASAN 2026" encostava no acento do Á.
  const rot = o.rotulo
    ? pecaRotulo({ texto: o.rotulo, _interno: true }, F) + `<div style="height:${Math.round(t * .46)}px"></div>`
    : "";

  // Entrelinha 1.08 comia o acento da primeira linha contra a linha de cima.
  const chamada = o.texto
    ? `<div style="font-weight:${estilo.fonte.pesos.titulo};font-size:${t}px;line-height:1.16;` +
      `letter-spacing:-.02em;color:${cor("branco")}">${enfatiza(o.texto)}</div>`
    : "";

  // Sublinhado amarelo sob o título: é o que tira o bloco do branco chapado.
  const sub_ = K.cartela.sublinhado;
  const risco = o.sublinhado
    ? `<div style="height:${sub_.espessura}px;width:${sub_.largura}px;background:${cor("amarelo")};
         margin:${Math.round(t * .40)}px 0 0;${centro ? "margin-left:auto;margin-right:auto;" : ""}"></div>`
    : "";

  const sub = o.sub
    ? `<div style="margin-top:${Math.round(t * (risco ? .40 : .34))}px;font-weight:${estilo.fonte.pesos.corpo};` +
      `font-size:${Math.round(t * .42)}px;line-height:1.3;color:${cor("cinzaClaro")}">${enfatiza(o.sub)}</div>`
    : "";
  const site = o.comSite
    ? `<div class="rotulo" style="margin-top:${Math.round(t * .62)}px;font-size:${K.rotulo.tamanho}px;color:${cor("cinzaClaro")}">${escapa(K.marca.site)}</div>`
    : "";

  const texto = `${rot}${chamada}${risco}${sub}${site}`;

  // Com assinatura a cartela ocupa a zona segura inteira: logotipo no alto,
  // texto deitado no pé. Empilhado num bloco só, tudo subia pro terço de cima e
  // o terço de baixo ficava vazio.
  if (o.comMarca) {
    // Os quatro logotipos vêm aparados, então a altura pedida é a altura do
    // desenho. Abaixo do limiar o descritivo vira borrão: ali entra a compacta.
    const alturaMarca = o.alturaMarca || 52;
    const cheia = alturaMarca >= (K.marca.alturaMinimaAssinatura ?? 54);
    // O texto para ACIMA da faixa da legenda. Deitado no pé da zona segura, a
    // placa da legenda cobria o "Desde 1985" na abertura e a assinatura no fecho.
    const baseLivre = Z.y2 - (F.legenda.faixaY[0] - 18);
    const arq = resolve(R, cheia ? K.marca.assinaturaEscura : K.marca.arquivoEscuro);
    if (!existsSync(arq)) throw new Error(`não achei o logotipo em ${arq}`);
    return `${fundo}
      <div style="position:absolute;left:${Z.x1}px;top:${Z.y1}px;width:${Z.x2 - Z.x1}px;
        height:${Z.y2 - Z.y1}px;padding:${o.respiroTopo ?? 56}px 0 ${o.respiroBase ?? baseLivre}px;
        display:flex;flex-direction:column;justify-content:space-between;
        text-align:${centro ? "center" : "left"}">
        <img src="file://${arq}" style="height:${alturaMarca}px;width:auto;display:block;
          align-self:${centro ? "center" : "flex-start"}">
        <div>${texto}</div>
      </div>`;
  }

  return `${fundo}
    <div class="bloco" style="text-align:${centro ? "center" : "left"}">${texto}</div>`;
}

function pecaLista(o, F) {
  const Li = K.lista;
  const t = o.tamanho || Li.tamanho;
  const itens = lista(o.itens || o.texto);
  // Lista por cima de vídeo precisa de véu: branco sobre obra clara não lê de
  // dez metros. O véu é azul noite no quadro todo, com a marca ainda aparecendo
  // por baixo. Vem na mesma peça pra não custar uma sobreposição a mais.
  const veu = o.veu
    ? `<div class="cheia" style="background:${rgba(cor("azulNoite"), Number(o.veu))}"></div>`
    : "";
  const tit = o.titulo ? pecaRotulo({ texto: o.titulo, _interno: true, tamanho: Math.round(t * .52), cor: cor("amarelo") }, F) + `<div style="height:${Li.respiro}px"></div>` : "";

  // Check, não fio. O fio amarelo era igualzinho à barra da legenda, e aí item
  // de lista e legenda falada viravam a mesma coisa na tela.
  const lado = Math.round(t * 0.82);
  const marcador = `<svg width="${lado}" height="${lado}" viewBox="0 0 24 24" fill="none"
      style="flex:0 0 auto;margin-top:${Math.round(t * .18)}px">
      <path d="M3.5 12.8 L9 18.3 L20.5 6.2" stroke="${Li.corMarcador}" stroke-width="3.2"
        stroke-linecap="square" stroke-linejoin="miter"/></svg>`;

  const linhas = itens.map((it) => `<div style="display:flex;align-items:flex-start;gap:${Math.round(t * .42)}px;margin-bottom:${Li.respiro}px">
      ${marcador}
      <div style="font-weight:${estilo.fonte.pesos.corpo};font-size:${t}px;line-height:1.24;color:${cor("branco")}">${enfatiza(it)}</div>
    </div>`).join("");
  return veu + envolve(`${tit}${linhas}`, o);
}

function pecaPonto(o, F) {
  // Um ponto de cada vez, grande. Mesma fonte e mesma escala da lista, forma
  // diferente: aqui a frase ocupa a tela em vez de virar item encaixotado.
  // Serve pra bloco longo, onde quatro linhas paradas viram parede de texto.
  const Li = K.lista;
  const t = o.tamanho || Math.round(F.cartela.tamanhoMin * 0.78);
  const veu = o.veu
    ? `<div class="cheia" style="background:${rgba(cor("azulNoite"), Number(o.veu))}"></div>`
    : "";
  const rot = o.rotulo
    ? pecaRotulo({ texto: o.rotulo, _interno: true, tamanho: K.rotulo.tamanho, cor: cor("amarelo") }, F) +
      `<div style="height:${Math.round(t * .5)}px"></div>`
    : "";

  let selo = "";
  if (o.indice) {
    selo = `<div style="font-weight:${estilo.fonte.pesos.titulo};font-size:${Math.round(t * 1.9)}px;
      line-height:.82;letter-spacing:-.04em;color:${cor("amarelo")}">${escapa(o.indice)}</div>`;
  } else if (o.check) {
    const lado = Math.round(t * 1.1);
    selo = `<svg width="${lado}" height="${lado}" viewBox="0 0 24 24" fill="none">
      <path d="M3.5 12.8 L9 18.3 L20.5 6.2" stroke="${Li.corMarcador}" stroke-width="3.2"
        stroke-linecap="square" stroke-linejoin="miter"/></svg>`;
  }

  const frase = `<div style="font-weight:${estilo.fonte.pesos.titulo};font-size:${t}px;line-height:1.14;
    letter-spacing:-.01em;color:${cor("branco")}">${enfatiza(o.texto)}</div>`;

  const corpo = selo
    ? `<div style="display:flex;align-items:flex-start;gap:${Math.round(t * .62)}px">
         <div style="flex:0 0 auto;padding-top:${Math.round(t * .04)}px">${selo}</div>
         <div>${frase}</div></div>`
    : frase;

  return veu + envolve(`${rot}${corpo}`, o);
}

function pecaMarca(o, F) {
  const M = F.marca;
  const rodape = o.canto === "rodape";
  const chave = rodape ? (o.claro ? "assinaturaClara" : "assinaturaEscura")
                       : (o.claro ? "arquivoClaro" : "arquivoEscuro");
  const arq = resolve(R, K.marca[chave]);
  if (!existsSync(arq)) throw new Error(`não achei o logotipo em ${arq}`);
  const h = o.altura || M.altura;
  if (rodape) {
    const site = o.semSite ? "" : `<div class="rotulo" style="margin-top:14px;font-size:${K.rotulo.tamanho}px;color:${cor("cinzaClaro")}">${escapa(K.marca.site)}</div>`;
    // O fator 1.5 vinha de quando o arquivo da assinatura tinha 29% de
    // transparência em cima e embaixo: a altura pedida só virava 41% de
    // desenho. Com o arquivo aparado, altura pedida é altura desenhada.
    // A assinatura para ACIMA da faixa da legenda. Antes ela morava a 12% do pé
    // do quadro e a legenda passava por cima do logotipo e do site.
    const base = F.altura - (F.legenda.faixaY[0] - 26);
    // A assinatura segue o alinhamento da cartela: centralizada ao lado de um
    // texto encostado à esquerda ela fica solta no quadro.
    const lado = o.alinhar === "centro" ? "center" : "left";
    const recuo = o.alinhar === "centro" ? 0 : F.zonaSegura.x1;
    return `<div style="position:absolute;left:${recuo}px;right:${recuo}px;bottom:${base}px;text-align:${lado}">
      <img src="file://${arq}" style="height:${Math.round(h * 1.15)}px;display:inline-block">${site}</div>`;
  }
  // A margem sai da própria zona segura, que pode ser torta. Número solto no
  // estilo.json já fez a marca pisar fora do painel.
  const topo = o.margem ?? F.zonaSegura.y1;
  const lado = o.margem ?? (o.canto === "superior-esquerdo"
    ? F.zonaSegura.x1 : F.largura - F.zonaSegura.x2);
  const pos = o.canto === "superior-esquerdo" ? `left:${lado}px` : `right:${lado}px`;
  return `<img src="file://${arq}" style="position:absolute;top:${topo}px;${pos};height:${h}px">`;
}

function pecaNumero(o, F) {
  const N = K.numero;
  const t = o.tamanho || Math.round(F.largura * 0.17);
  if (o.destaque) contaAmarelo();
  const rot = o.rotulo ? `<div class="rotulo" style="margin-top:10px;font-size:${K.rotulo.tamanho}px;color:${K.rotulo.cor}">${escapa(o.rotulo).toUpperCase()}</div>` : "";
  return envolve(`<div style="text-align:${o.alinhar === "esquerda" ? "left" : "center"}">
    <div style="font-weight:${N.peso};font-size:${t}px;line-height:.95;letter-spacing:${N.espacamento}em;color:${o.destaque ? N.corDestaque : N.cor}">${escapa(o.texto)}</div>${rot}</div>`, o);
}

function pecaDegrade(o, F) {
  // Escurece a base do quadro pra o texto branco fechar contraste sobre vídeo.
  const D = K.degrade;
  const ate = o.ate ?? D.ate;
  return `<div class="cheia" style="background:linear-gradient(to bottom, transparent ${D.comecaEm * 100}%, ${rgba(cor("azulNoite"), ate)} 100%)"></div>`;
}

function pecaImagem(o, F) {
  if (!o.src) throw new Error("a peça imagem precisa de --src caminho/da/imagem.jpg");
  const src = resolve(R, o.src);
  if (!existsSync(src)) throw new Error(`não achei a imagem: ${src}`);
  if (o.cheia) {
    return `<img src="file://${src}" style="position:absolute;inset:0;width:${F.largura}px;height:${F.altura}px;object-fit:cover">`;
  }
  const larg = o.largura || Math.round(F.largura * 0.52);
  const alt = o.altura || Math.round(larg * (o.proporcao || 0.68));
  const leg = o.legenda ? `<div class="rotulo" style="margin-top:12px;font-size:${K.rotulo.tamanho}px;color:${K.rotulo.cor}">${escapa(o.legenda).toUpperCase()}</div>` : "";
  return envolve(`<div style="text-align:${o.alinhar === "centro" ? "center" : "left"}">
    <img src="file://${src}" style="width:${larg}px;height:${alt}px;object-fit:cover;display:block;border-radius:4px;
      border:1px solid ${rgba(cor("branco"), .2)}">${leg}</div>`, o);
}

const PECAS = {
  ano: pecaAno, linha: pecaLinha, titulo: pecaTitulo, legenda: pecaLegenda,
  pilula: pecaPilula, cartela: pecaCartela, lista: pecaLista, ponto: pecaPonto, marca: pecaMarca,
  numero: pecaNumero, rotulo: pecaRotulo, degrade: pecaDegrade, imagem: pecaImagem,
};

/** Peças que pintam o quadro todo de propósito. A imagem só quando é em sangria. */
const SANGRIA = new Set(["cartela", "degrade", "titulo"]);
const ehSangria = (tipo, o = {}) => SANGRIA.has(tipo) || (tipo === "imagem" && !!o.cheia)
  || ((tipo === "lista" || tipo === "ponto") && !!o.veu);
/** Foto em sangria pode ter qualquer cor no canto, inclusive céu branco: não dá
 *  pra julgar pelo pixel. Ela já é conferida pelo existsSync do caminho. */
const semVeredito = (tipo, o = {}) => tipo === "imagem" && !!o.cheia;
/** Peças que se posicionam sozinhas, sem o .bloco. */
const SOZINHAS = new Set(["legenda", "linha", "marca", "degrade", "cartela", "titulo"]);

// ---------- a página ----------

function paginaDaPeca(tipo, o, F) {
  const fn = PECAS[tipo];
  if (!fn) throw new Error(`peça desconhecida: ${tipo}. Tem: ${Object.keys(PECAS).join(", ")}`);

  const Z = F.zonaSegura;
  const centro = F.largura / 2;
  // A zona segura pode ser torta: peça centralizada só cabe nos dois lados se a
  // largura for o dobro do lado mais apertado.
  const larguraCentrada = 2 * Math.min(centro - Z.x1, Z.x2 - centro);
  const ladoEsquerdo = o.x === "esquerda" || o.x == null;
  const larguraMax = o.larguraMax || (ladoEsquerdo || o.x === "direita" ? Z.x2 - Z.x1 : larguraCentrada);

  // A âncora de rodapé se chama "rodape" e não "ate" de propósito: no roteiro e
  // na montagem, "de" e "ate" são tempo. Misturar os dois mandava a etiqueta de
  // ano pra fora do quadro, porque ela tem "ate: 8" de segundos.
  // O título sem posição senta logo acima da faixa da legenda, como no modelo.
  if (tipo === "titulo" && o.y == null && o.rodape == null) o = { ...o, rodape: F.legenda.faixaY[0] - 14 };
  const posY = o.rodape != null ? `bottom:${F.altura - Number(o.rodape)}px`
    : o.y === "centro" || o.y == null ? `top:50%;transform:translateY(-50%)`
    : `top:${Number(o.y)}px`;
  const posX = o.x === "direita" ? `right:${F.largura - Z.x2}px`
    : o.x === "centro" ? `left:50%;margin-left:${-Math.round(larguraMax / 2)}px`
    : typeof o.x === "number" || /^\d+$/.test(String(o.x || "")) ? `left:${Number(o.x)}px`
    : `left:${Z.x1}px`;

  const { regras, familia } = faceDaFonte();
  const corpo = fn(o, F);

  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>
${regras}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${F.largura}px;height:${F.altura}px;background:transparent;overflow:hidden}
body{font-family:'MarcaNS','${familia}',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.quadro{position:relative;width:${F.largura}px;height:${F.altura}px}
.cheia{position:absolute;inset:0}
.bloco{position:absolute;width:${larguraMax}px;${posX};${posY}}
.rotulo{font-weight:${K.rotulo.peso};text-transform:uppercase;letter-spacing:${K.rotulo.espacamento}em}
</style><div class="quadro">${corpo}</div></html>`;
}

/** Lê os pixels crus de um pedacinho do PNG, pra saber se a página carregou. */
async function cantoCru(png, lado = 4) {
  const cru = png.replace(/\.png$/i, ".canto.raw");
  await roda("ffmpeg", ["-y", "-v", "error", "-i", png,
    "-vf", `crop=${lado}:${lado}:0:0`, "-pix_fmt", "rgba", "-f", "rawvideo", cru]);
  const b = readFileSync(cru);
  rmSync(cru, { force: true });
  const px = [];
  for (let i = 0; i + 3 < b.length; i += 4) px.push([b[i], b[i + 1], b[i + 2], b[i + 3]]);
  return px;
}

/** O Chromium sai com código 0 até quando mostra a página de erro dele, que é
 *  branca e opaca. A prova de que a página carregou está no pixel do canto. */
async function confereCanto(png, tipo, o = {}) {
  if (semVeredito(tipo, o)) return;
  const quebrou = () => new Error(
    `${basename(png)} saiu com a cara da página de erro do Chromium. ` +
    `Quase sempre é caminho relativo no file:// ou fonte faltando (rode node fontes.mjs). ` +
    `Abra o HTML que fica ao lado do PNG pra ver o que o navegador recebeu.`
  );
  let px;
  try { px = await cantoCru(png); } catch { return; }
  if (!px.length) return;

  if (!ehSangria(tipo, o)) {
    if (px.every(([, , , a]) => a > 8)) throw quebrou();
    return;
  }
  // Peça de sangria: opaca de propósito, mas nenhuma cor do ESTILO é branco puro.
  if (px.every(([r, g, b, a]) => a > 250 && r > 252 && g > 252 && b > 252)) throw quebrou();
}

// O Chromium headless entrega um viewport mais baixo que o --window-size (sobra a
// altura da barra do navegador, aqui uns 72 px) e completa o screenshot com
// transparência. Resultado: tudo perto da base do quadro sumia calado. A saída é
// pedir a janela com folga e recortar o quadro de verdade.
const FOLGA = 160;

async function tiraFoto(html, png, F, tempoVirtual = 450) {
  // file:// só engole caminho absoluto. Relativo vira a página de erro do Chromium,
  // que é branca e opaca e passa despercebida até o render ficar pronto.
  const alvo = resolve(png);
  const tmp = alvo.replace(/\.png$/i, ".html");
  const bruto = alvo.replace(/\.png$/i, ".bruto.png");
  writeFileSync(tmp, html);
  await roda(CHROMIUM, [
    "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
    "--force-device-scale-factor=1", "--default-background-color=00000000",
    `--virtual-time-budget=${tempoVirtual}`,
    `--window-size=${F.largura},${F.altura + FOLGA}`,
    `--screenshot=${bruto}`, `file://${tmp}`,
  ]).catch((e) => { if (!existsSync(bruto)) throw e; });
  if (!existsSync(bruto)) throw new Error("o Chromium não gerou o PNG: " + alvo);
  await roda("ffmpeg", ["-y", "-v", "error", "-i", bruto,
    "-vf", `crop=${F.largura}:${F.altura}:0:0`, "-frames:v", "1", alvo]);
  rmSync(bruto, { force: true });
  return tmp;
}

export async function renderizaPeca(tipo, o, nomeFormato = "telao") {
  const F = formato(nomeFormato);
  amarelosNaPeca = 0;
  for (const campo of ["texto", "titulo", "rotulo", "sub"]) if (typeof o[campo] === "string") limpaVicios(o[campo]);

  const html = paginaDaPeca(tipo, o, F);
  const saida = resolve(o.saida || join(pasta(join(TRABALHO, "_pecas")), `${tipo}-${Date.now()}.png`));
  pasta(dirname(saida));

  const tmp = await tiraFoto(html, saida, F);
  // PECA_DEBUG=1 guarda o HTML ao lado do PNG: é o jeito de ver o que o Chromium recebeu.
  const limpa = () => { if (!process.env.PECA_DEBUG) rmSync(tmp, { force: true }); };
  await confereCanto(saida, tipo, o).finally(limpa);

  if (amarelosNaPeca > estilo.regraDoAmarelo.maxDestaquesPorTela) {
    aviso(`${amarelosNaPeca} destaques amarelos nessa peça. O ESTILO deixa ${estilo.regraDoAmarelo.maxDestaquesPorTela} por tela.`);
  }
  return { arquivo: saida, amarelos: amarelosNaPeca };
}

// ---------- linha de comando ----------

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const nomeFormato = args.includes("--formato") ? args[args.indexOf("--formato") + 1] : "telao";

  if (args.includes("--json")) {
    const dados = JSON.parse(readFileSync(args[args.indexOf("--json") + 1], "utf8"));
    titulo("Kit de peças");
    for (const p of (Array.isArray(dados) ? dados : dados.pecas)) {
      const { arquivo, amarelos } = await renderizaPeca(p.tipo, p, p.formato || nomeFormato);
      conta(`  ${p.tipo.padEnd(9)} ${basename(arquivo).padEnd(34)} ${amarelos} destaque(s)`);
    }
  } else {
    const tipo = args.find((a) => !a.startsWith("--"));
    if (!tipo) {
      console.error(`uso: node peca.mjs <${Object.keys(PECAS).join("|")}> --texto "..." [--y 300] [--x esquerda|centro|direita]`);
      console.error(`     node peca.mjs --json roteiro-de-pecas.json`);
      process.exit(1);
    }
    const o = {};
    for (let i = 0; i < args.length; i++) {
      if (!args[i].startsWith("--")) continue;
      const chave = args[i].slice(2);
      const prox = args[i + 1];
      const ehNumero = /^-?\d+(\.\d+)?$/.test(prox || "") && !/^0\d/.test(prox);
      o[chave] = prox == null || prox.startsWith("--") ? true : (ehNumero ? Number(prox) : prox);
    }
    const { arquivo, amarelos } = await renderizaPeca(tipo, o, nomeFormato);
    const f = fonteAtiva();
    titulo(`Peça · ${tipo}`);
    conta(`  ${arquivo}`);
    conta(`  ${amarelos} destaque(s) amarelo(s) · fonte ${f.familia}${f.oficial ? "" : " (substituta)"}`);
  }
}
