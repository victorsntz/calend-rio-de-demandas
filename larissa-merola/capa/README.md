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
