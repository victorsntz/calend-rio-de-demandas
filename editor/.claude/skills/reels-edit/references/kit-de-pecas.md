# Kit de peças

Toda peça gráfica do vídeo sai daqui. O `peca.mjs` renderiza cada uma num PNG
transparente do tamanho do quadro inteiro, com a STIX Two Text, nas cores do
`estilo.json`. Peça nova nasce aqui, com o mesmo DNA: papel, tinta, canto
arredondado, linha fina.

```bash
node $S/peca.mjs <tipo> [opções] --saida trabalho/$P/pecas/nome.png
node $S/peca.mjs --json lista-de-pecas.json
```

## Opções que toda peça entende

| Opção | O que faz |
| --- | --- |
| `--texto "..."` | O texto. Aceita `*itálico*` e `**itálico no verde**`. |
| `--x centro\|esquerda\|direita\|<px>` | Onde ancora na horizontal. Padrão: centro. |
| `--y <px>\|centro` | O topo da peça. Padrão: centro do quadro. |
| `--tamanho <px>` | Tamanho da fonte. Cada peça tem um padrão proporcional. |
| `--larguraMax <px>` | Largura do bloco. O padrão já respeita a zona segura. |
| `--escuro` | Versão pra fundo escuro (ou a versão escura da peça). |
| `--formato reels\|youtube` | Tamanho do quadro. Padrão: reels. |
| `--saida caminho.png` | Onde salvar. |
| `--quadros <n> --fps <n>` | Sequência numerada, pra peça com animação própria. |

Centralizada quer dizer centralizada **no quadro**, com largura cortada pra
caber na zona segura dos dois lados. No Reels a zona é torta (60 à esquerda e
140 à direita), então uma peça centralizada tem 800 px de largura útil, não 880.

## O catálogo

### `rotulo` — o eyebrow
Caixa alta, espaçamento de 0,26 em, pequeno, em tinta apagada.
```bash
node $S/peca.mjs rotulo --texto "BASTIDORES · DIA 3" --y 300
```

### `gancho` — o título dos primeiros 1 a 3 segundos
Rótulo em cima, fio de 2 px, frase grande alinhada à esquerda. Sobre vídeo vem
com o fundo escurecido em 40%; com `--sobreClaro` vira tinta sobre papel.
```bash
node $S/peca.mjs gancho --rotulo "OPINIÃO" --texto "Sua marca pede *desculpas* por ser daqui" --x esquerda --y 300
node $S/peca.mjs gancho --rotulo "LISTA" --texto "3 sinais" --sobreClaro
```
Opções próprias: `--escurecer 0.4` (ou `--escurecer false`), `--sobreClaro`.

### `cartao` — a caixa de texto
Fundo papel, cantos de 20 px, borda de 1 px em tinta a 15%, respiro de 44 px.
`--escuro` troca pra espresso com texto papel. `--sobrePapel` usa o papel 2,
pra quando o fundo já é papel.
```bash
node $S/peca.mjs cartao --rotulo "O ERRO" --titulo "Sotaque emprestado" --texto "A marca fala inglês num mercado que compra em português." --y 700
```

### `pilula` — etiqueta, chamada, botão
Cantos redondos, contorno de 1 px. `--preenchida` inverte pra tinta cheia com
texto papel. `--ponto` põe o ponto verde de 9 px que pulsa. `--seta` põe a seta
que desliza 5 px.
```bash
node $S/peca.mjs pilula --texto "Fale com o estúdio" --ponto --seta --y 1600
node $S/peca.mjs pilula --texto "MARCA APROVADA" --preenchida --y 1400
```
Sobre vídeo escuro, `--escuro` troca o contorno pra papel. Sem isso a pílula de
contorno fica tinta sobre tinta e some.

O pulso e o deslize só existem em movimento: use `--quadros 57 --fps 30` pra
sair uma sequência de 1,9 s.

A zona segura do Reels acaba em y 1500, então pílula de chamada cabe até mais
ou menos y 1400. Mais baixo que isso o fiscal reprova.

### `numero` — o número de destaque
Bem grande, espaçamento de -0,03 em, em verde por padrão. `--verde false` deixa
em tinta (use quando já tem outro verde na tela).
```bash
node $S/peca.mjs numero --texto "929" --rotulo "cafés (e contando)" --y 820
```

### `lista` — o item numerado
Cartão com `01`, `02`, `03` pequeno em verde antes do título.
```bash
node $S/peca.mjs lista --indice "02" --titulo "Sotaque emprestado" --texto "..." --y 760
```
O índice vai entre aspas pra não perder o zero da frente.

### `citacao` — a citação
Barra vertical verde de 3 px à esquerda, texto em itálico, assinatura embaixo
em rótulo. `--escuro false` pra fundo claro. `--assinatura "OUTRO NOME"` troca
a assinatura; `--assinatura false` tira.
```bash
node $S/peca.mjs citacao --texto "Brasilidade não se fantasia. Se carrega." --y 700
```

### `assinatura` — o lockup FORTUNATO
`FORTUNATO` em 600 com espaçamento de 0,2 em, fio vertical, `ESTÚDIO / DE
MARCAS` ao lado, e o site embaixo em rótulo. Entra na abertura do vlog e no
fechamento de todo vídeo. `--site false` tira o endereço.
```bash
node $S/peca.mjs assinatura --escuro --y 1500
```

### `monograma` — o F
Letra papel num quadrado tinta com cantos arredondados. Marca d'água opcional
no canto do vlog.
```bash
node $S/peca.mjs monograma --tamanho 110 --x direita --y 120
```

### `cartela` — o quadro cheio
Papel ou espresso cobrindo tudo, com a frase no meio. `--comAssinatura` põe a
assinatura FORTUNATO embaixo. É a peça de fechamento.
```bash
node $S/peca.mjs cartela --texto "A origem é a **assinatura**." --escuro --comAssinatura
```

### `linha` — o fio
1 a 2 px em tinta. Separa bloco e mora embaixo de rótulo.
```bash
node $S/peca.mjs linha --largura 150 --y 420
```

### `imagem` — o retângulo de foto, print ou tela
Cantos de 18 px, borda de 2 px em tinta a 12%, a imagem cobrindo sem esticar.
```bash
node $S/peca.mjs imagem --src brutos/$P/print.jpg --largura 820 --proporcao 1.25 --legenda "ANTES" --y 500
```

### `legenda` — a legenda falada
O `legendas.mjs` chama essa sozinho. Direto é útil pra testar um texto:
```bash
node $S/peca.mjs legenda --texto "marca brasileira não precisa de **sotaque** emprestado"
```

## Em lote

```json
[
  { "tipo": "gancho", "rotulo": "OPINIÃO", "texto": "...", "x": "esquerda", "y": 300,
    "saida": "trabalho/2026-10-19-nome/pecas/gancho.png" },
  { "tipo": "cartela", "texto": "A origem é a **assinatura**.", "escuro": true,
    "comAssinatura": true, "saida": "trabalho/2026-10-19-nome/pecas/fim.png" }
]
```
```bash
node $S/peca.mjs --json trabalho/$P/roteiro-de-pecas.json
```

## A regra do verde

Um elemento verde por tela. O `peca.mjs` conta os verdes de cada peça e avisa
quando passa de um. O `conferir.mjs` cobra o outro lado: duas peças marcadas
com `"verde": true` no `montagem.json` que aparecem ao mesmo tempo.

Peças que já nascem com verde: `numero` (a menos que `--verde false`), `lista`,
`citacao`, e `pilula --ponto`. Texto com `**palavra**` também conta.
