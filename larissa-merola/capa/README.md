# Capa fixa + slides internos

Templates em HTML renderizados em PNG 1080 x 1350 (feed 4:5).

```bash
cd larissa-merola/capa
node render.mjs capa.html saida/capa      # gera saida/capa.png
node render.mjs slides.html saida/slide   # gera saida/slide-01.png, 02...
```

Usa o Playwright do projeto ou o global (`PLAYWRIGHT_MODULE=/caminho/node_modules/playwright`).

## Capa (padrão fixo, não muda de carrossel pra carrossel)

1. Faixa verde no topo (`.faixa`): três verdes em folhas sobrepostas, 26 px.
2. `@larissamerola` pequeno, cinza, centralizado.
3. Pergunta em duas linhas: `linha1` em Sora (sans, 62 px) e `linha2` em serifa (150 px).
   A linha 2 termina sempre em interrogação.
4. Ilustração figurativa (`.ilustracao`): silhueta ou desenho do tema, até 980 x 620 px,
   fundo branco ou transparente. Nada abstrato.
5. Logo horizontal em verde musgo embaixo, 92 px de altura (menor que a versão antiga).

Troca por carrossel: o texto das duas linhas e o arquivo da ilustração. Só isso.

## Slides internos (`slides.html`)

Quatro layouts pra combinar em ordem livre, 5 a 8 slides por carrossel:

- **A, foto + texto**: coluna de texto à esquerda, imagem ocupando a direita.
- **B, lista**: título com grifo em verde saúde, itens separados por fio, marcador em folha.
- **C, dado**: número grande em serifa, frase em caixa alta, fonte do dado em versalete.
- **D, fechamento**: fundo verde musgo, frase da Dra. em serifa, botão "Link na bio", logo branca.

Regras: sem emoji, texto em Sora, caixa alta só em títulos, `DESLIZE PARA O LADO` em todos
menos no último, rodapé com a logo pequena.

## Fontes

A identidade usa **The Seasons** (serifa, wordmark e títulos) e **Sora** (sans). O SVG da
logo no Drive declara as duas. The Seasons é paga e não está aqui: `tokens.css` usa
**Gloock** como substituta até o arquivo da fonte entrar em `fonts/`. Sora está incluída.

## Ilustrações

`ilustracoes/lipedema-estagios.jpg` é o recorte da capa antiga (asset da própria marca).
`ilustracoes/silhueta-01.svg` é um rascunho em linha contínua, serve de placeholder.
Pra cada carrossel novo, a ilustração precisa vir de banco vetorial ou geração de imagem
com este brief: figura humana completa, estilo flat ou ilustração médica, paleta de pele
quente, sem fundo, sem texto, sem abstração geométrica.

## Montar um carrossel inteiro

```bash
node montar.mjs ../carrosseis/exemplo-lipedema.json
# -> saida/<slug>/index.html e saida/<slug>/<slug>-01.png ... -NN.png
```

Cada rodada gera também `legenda.txt` (primeira linha `Siga @larissamerola`, depois os
parágrafos de `legenda` no JSON, sem emoji) e `<slug>.zip` com os PNGs numerados e a
legenda, pronto pra entregar.

O JSON tem `capa` (linha1, linha2, ilustracao), `legenda` (lista de parágrafos) e `slides` com tipo A, B, C, D ou E
(E = foto inteira com faixa de texto). `foto: "post"` sorteia do banco de imagens de
post, `foto: "doutora"` sorteia das fotos da Dra.; o sorteio não repete uma foto até
usar todas (estado em `banco/uso.json`). O tipo D (fechamento) usa foto da Dra. por
padrão e é sempre o último. Nem todo slide precisa de foto: B e C são só texto de
propósito, pra dar respiro.

Cor: cada slide tem um `tema` (`papel`, `marrom`, `marromclaro`, `musgo`, `saude`; `claro`
existe mas fica fora do rodízio). Sem `tema` no JSON o gerador mescla sozinho (marrom,
papel, saúde, musgo, papel, marrom claro...), o fechamento é sempre musgo, e fundo escuro
usa texto branco e a logo branca. Slides de papel levam uma barra fina em marrom na borda
esquerda. Os dois marrons em `tokens.css` são aproximação: confirmar os hex no Figma
"Posts Larissa".

Viúvas: `tipografia.js` junta as duas últimas palavras de todo título com espaço
inquebrável, e os títulos usam `text-wrap: balance`. Nenhuma linha final fica com
uma palavra só.

## Banco de imagens (`../banco/`)

Vem da pasta do Drive `Larissa Médica / BANCO DE ARQUIVOS`: `FOTOS DOUTORA` vira
`banco/doutora/`, `IMAGENS POST` vira `banco/post/`. As cópias no repositório são
redimensionadas a 1800 px; `banco/manifest.json` lista cada uma com `tags` e `usar`
(ponha `false` pra tirar uma foto de circulação sem apagar). `banco/uso.json` guarda
o que já foi sorteado; apague pra zerar o rodízio.

Limite do Drive por aqui: arquivo acima de ~8 MB não baixa. As fotos de câmera da
Dra. (DSC, 8 a 18 MB) ficaram de fora; basta exportar versões em JPG de até 2000 px
na mesma pasta que entram no próximo ciclo.

## Imagens pros slides internos

Duas fontes, que se somam:

1. **Pasta no Drive** (`Larissa Médica / CRIATIVOS / BANCO DE IMAGENS`, a criar):
   o Victor curadoria fotos da Dra. e imagens escolhidas; o agente lê a pasta,
   distribui nos slides e anota em `imagens/creditos.json` de onde veio cada uma.
   Funciona hoje, sem mexer em rede.
2. **Bancos livres** via `buscar-imagens.mjs` (Openverse sem chave, Pexels com
   `PEXELS_API_KEY`). Depende de liberar na rede do ambiente:
   `api.openverse.org`, `api.pexels.com`, `images.pexels.com` e os domínios
   das imagens que o Openverse devolver (varia por foto; Wikimedia e Flickr são
   os mais comuns: `upload.wikimedia.org`, `live.staticflickr.com`).

Pinterest não serve como ponte: o domínio é bloqueado aqui e não tem API aberta.

## Elementos da marca (Drive > MARCA > CONSTRUÇÃO), desde 26/10

`elementos.mjs` reproduz em SVG o que está na apresentação da identidade:

- **Padrão de folhas** (`padrao()`): grade de quadrados com uma folha em lente na diagonal; as folhas
  de quatro quadrados vizinhos se encontram e formam a borboleta. Cores musgo, claro e saúde,
  sorteio determinístico pela `seed` do JSON. Entra na faixa do topo da capa fixa (54 px) e no rodapé
  dos slides de lista (B). `"padrao": false` num slide B tira a faixa.
- **Isótipo em traço**: `flor()` (3 pétalas), `borboleta()` (4), `folha()` (1), `isotipo()` (6).
  Cor vem de `currentColor`, então cada tema pinta do jeito certo. Flor nos slides de dado (C),
  folha nos de foto e texto (A), borboleta na lista (B) e no fechamento (D).
- **Degradê verde** (`"tema": "degrade"`): o fundo da logo na apresentação. Funciona em qualquer
  layout, inclusive no fechamento (`D` aceita `tema`).

## Três estilos de capa (`capa.tipo`)

- `ilustracao` (padrão, o combinado): pergunta em duas linhas, ilustração figurativa, logo menor,
  padrão de folhas no topo.
- `social`: cartão branco com avatar (`banco/doutora/avatar.jpg`), nome, @, texto corrido
  (`capa.texto`, string ou lista de linhas), "Arrasta" com seta e foto arredondada embaixo
  (`capa.foto`). Sem emoji.
- `foto`: foto inteira com véu escuro, até quatro linhas centralizadas alternando grande/pequena
  (`capa.linhas`, ou `capa.classes` pra forçar), "Deslize para o lado", logo branca embaixo,
  `capa.credito` opcional no canto.

`node montar.mjs x.json --so-capa` renderiza só a capa (pra comparar estilos sem gastar fotos
do rodízio). Slides E aceitam `credito` (texto pequeno no topo da foto).

## Estático "Notícia" (`../estaticos/noticia.mjs`)

Print real da matéria dentro de um cartão, faixa NOTÍCIA em musgo, nome da Dra. embaixo:

```bash
node noticia.mjs "https://agenciabrasil.ebc.com.br/..." anvisa-canetas --foto ../banco/post/post-16.jpg
```

Tira o print com o Playwright (aceita cookies, esconde widgets fixos, força lazy load) e recorta até o
fim do primeiro parágrafo (ou `--altura N`). `--foto` injeta uma imagem quando o site não entrega a
foto pro print (o proxy daqui bloqueia o CDN da EBC). `--chamada "texto"` põe uma frase abaixo do cartão.

## Sistema v2: "estáticos compilados em carrossel" (26/10)

Depois do raio-X dos criativos 2024–2026 (`../ANALISE-CRIATIVOS-2024-2026.md`), o gerador ganhou um
segundo sistema em que cada slide se sustenta sozinho como estático: cabeçalho micro
"DRA. LARISSA MEROLA · NUTROLOGIA", conteúdo, faixa do padrão de folhas no rodapé.

```bash
node montar2.mjs ../carrosseis/v2/anvisa-canetas-internet.json      # saida/<slug>/ + zip + legenda
node montar2.mjs ../carrosseis/v2/x.json --so-capa                   # só o primeiro slide
```

Tipos de slide (`tipo`): `capa-foto`, `noticia` (print do `estaticos/noticia.mjs`), `celulas`,
`dado`, `cards` (ícones de linha: site, chat, receita, preco, lote, medico, anvisa, caneta),
`passos`, `foto-frase`, `fecho`. Temas: `salvia` (padrão, com textura), `musgo`, `papel`,
`marrom`, `marromclaro`, `branco`. Estilos em `v2.css`. Fotos e rotação iguais ao `montar.mjs`.

## Pinterest (`pinterest.mjs`)

```bash
node pinterest.mjs "farrah fawcett hair" --n 8 --slug farrah-fawcett            # só baixa
node pinterest.mjs "https://br.pinterest.com/<user>/<pasta>/" --n 20 --tags cabelo,famosa --banco   # baixa e registra no banco
```

Abre a busca ou a pasta num Chromium sem login, lê a grade pública, troca a miniatura pela imagem
de 736 px e salva em `banco/raw/pinterest/<slug>/` com `fontes.json` (URL da imagem, descrição,
busca, data). `--banco` copia pra `banco/post/post-NN.jpg` e registra no manifest com
`origem: Pinterest: <url>`. Precisa do host `i.pinimg.com` liberado no ambiente.
