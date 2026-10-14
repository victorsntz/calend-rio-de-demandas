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

O JSON tem `capa` (linha1, linha2, ilustracao) e `slides` com tipo A, B, C, D ou E
(E = foto inteira com faixa de texto). `foto: "post"` sorteia do banco de imagens de
post, `foto: "doutora"` sorteia das fotos da Dra.; o sorteio não repete uma foto até
usar todas (estado em `banco/uso.json`). O tipo D (fechamento) usa foto da Dra. por
padrão e é sempre o último. Nem todo slide precisa de foto: B e C são só texto de
propósito, pra dar respiro.

Cor: cada slide tem um `tema` (`papel`, `claro`, `musgo`, `saude`). Sem `tema` no JSON
o gerador mescla sozinho (claro, papel, saúde, musgo, papel, saúde...), o fechamento é
sempre musgo, e fundo escuro usa texto branco e a logo branca. Slides de papel levam
uma barra fina em verde saúde na borda esquerda.

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
