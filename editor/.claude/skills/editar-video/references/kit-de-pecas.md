# Kit de peças

Toda peça gráfica do vídeo sai daqui. O `peca.mjs` renderiza cada uma num PNG
transparente do tamanho do quadro, na fonte da marca e nas cores do `estilo.json`.

```bash
node $S/peca.mjs <tipo> [opções] --saida trabalho/$P/pecas/nome.png
node $S/peca.mjs --json trabalho/$P/pecas.json
```

## Opções que toda peça entende

| Opção | O que faz |
| --- | --- |
| `--texto "..."` | O texto. `**palavra**` sai no amarelo. `\n` quebra a linha. |
| `--x esquerda\|centro\|direita\|<px>` | Âncora horizontal. Padrão: esquerda, na zona segura. |
| `--y <px>\|centro` | O topo da peça. Padrão: centro do quadro. |
| `--rodape <px>` | O rodapé da peça, quando é mais fácil medir por baixo. |
| `--tamanho <px>` | Tamanho da fonte. Cada peça tem um padrão proporcional. |
| `--larguraMax <px>` | Largura do bloco. O padrão já respeita a zona segura. |
| `--formato telao\|youtube` | Tamanho do quadro. Padrão: telao (1008x672). |

## O catálogo

### `ano` — a etiqueta de ano
Caixa branca com barra amarela à esquerda e texto em azul quase preto. É o
carimbo do bloco histórico.
```bash
node $S/peca.mjs ano --texto "1985" --y 56
```

### `linha` — a linha do tempo
Fio na base com um ponto por marco. O ano ativo vira ponto amarelo maior com o
número em branco; os outros ficam apagados.
```bash
node $S/peca.mjs linha --anos "1985|1990|1995|2000|2010|2015|2020|2026" --ativo 1995
```

### `titulo` — o título sobre vídeo
Branco, Bold, à esquerda, com um degradê que escurece a base do quadro. Sem
posição definida, ele senta logo acima da faixa da legenda, como no modelo.
```bash
node $S/peca.mjs titulo --texto "Tudo começou com um **caminhão**"
node $S/peca.mjs titulo --texto "Sem escurecer o fundo" --semDegrade
```

### `legenda` — a legenda falada
Branca, numa placa de azul noite com a barra amarela à esquerda, na faixa de
baixo. A placa é o que faz o branco fechar contraste sobre obra clara.
`--placa false` troca a placa por sombra pesada, pra fundo já escuro.
```bash
node $S/peca.mjs legenda --texto "1988: já são 3 hidrojatos desobstruindo redes."
```

### `ponto` — um item de cada vez, grande
Mesma fonte e mesma escala da lista, forma diferente. É o que entra em bloco
longo, onde quatro linhas paradas viram parede de texto. Aceita `--indice` (um
número grande em amarelo) ou `--check`.
```bash
node $S/peca.mjs ponto --rotulo "NOSSA VISÃO · 2025 A 2030" --indice "01" --texto "Inovação e qualidade" --veu 0.7
node $S/peca.mjs ponto --rotulo "NOSSOS VALORES" --check --texto "Parceria, confiança\ne lealdade" --veu 0.7
```

### `pilula` — etiqueta de cliente, praça ou contrato
Contorno branco com texto branco, ou `--preenchida` em amarelo com texto escuro.
Aceita várias de uma vez separadas por `|`.
```bash
node $S/peca.mjs pilula --texto "Sabesp|Interior e litoral de SP" --y 300
node $S/peca.mjs pilula --texto "Contrato por performance" --preenchida --y 300
```

### `cartela` — o quadro cheio
Azul profundo com um clarão no canto. Abertura, transição e fechamento.
`--comMarca` põe a assinatura e o site no rodapé.
```bash
node $S/peca.mjs cartela --rotulo "FENASAN 2026" --texto "Água. Esgotos.\nDrenagem." --sub "Desde 1985" --comMarca
```

### `lista` — vários itens juntos
Cada item com um **check amarelo** antes. O título vai em rótulo amarelo em
cima. O marcador é check e não fio: fio amarelo fica igual à barra da legenda e
aí lista e legenda falada viram a mesma coisa na tela.
```bash
node $S/peca.mjs lista --titulo "NOSSA MISSÃO" --itens "Soluções para as necessidades reais|Bem-estar da população"
node $S/peca.mjs lista --titulo "NOSSOS VALORES" --itens "..." --veu 0.72
```
`--veu 0.72` põe um véu de azul noite no quadro todo, atrás da lista. **Use
sempre que a lista for por cima de vídeo:** branco sobre obra clara não lê de
dez metros. A obra continua aparecendo por baixo, e o véu vem na mesma peça pra
não custar uma sobreposição a mais.

### `marca` — o logotipo
No canto superior direito usa a versão compacta, sem o descritivo, que é a que
lê em 44 px. `--canto rodape` usa a versão cheia centralizada, com o site.
```bash
node $S/peca.mjs marca
node $S/peca.mjs marca --canto rodape
node $S/peca.mjs marca --claro          # pra fundo claro
```

### `numero` — o número de destaque
Branco e grande. `--destaque` joga ele no amarelo, e aí conta como o destaque da tela.
```bash
node $S/peca.mjs numero --texto "40" --rotulo "anos de operação" --destaque
```

### `rotulo` — o eyebrow
Caixa alta, espaçamento aberto, cinza claro.
```bash
node $S/peca.mjs rotulo --texto "NOSSOS VALORES" --y 120
```

### `degrade` — só o escurecido
Quando o texto vem de outra peça mas o fundo precisa fechar contraste.
```bash
node $S/peca.mjs degrade --ate 0.65
```

### `imagem` — foto de acervo ou retângulo
`--cheia` preenche o quadro inteiro, que é o normal na linha do tempo.
```bash
node $S/peca.mjs imagem --src brutos/acervo/1985-primeiro-equipamento.png --cheia
node $S/peca.mjs imagem --src brutos/acervo/1996-primeiro-caminhao-novo.png --largura 520 --legenda "1996" --y 180
```

## A regra do amarelo

A mobília do sistema é amarela por desenho e não entra na conta: a barra da
etiqueta de ano, a barra da legenda e o ponto ativo da linha do tempo. As três
podem estar na mesma tela, como no vídeo aprovado.

O que a regra limita é **destaque de conteúdo: um por tela**. Conta como
destaque: `**palavra**` no texto, `pilula --preenchida` e `numero --destaque`.
O `peca.mjs` avisa quando passa; o `conferir.mjs` reprova quando duas peças com
destaque aparecem ao mesmo tempo no `montagem.json`.
