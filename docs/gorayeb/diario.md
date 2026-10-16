# Diário da Gorayeb

O que já foi feito, decidido e entregue. Pra consultar em vez de rolar conversa.
Atualizo isso a cada entrega ou decisão nova.

## Onde estamos

| | |
| --- | --- |
| **Formato padrão** | 01, escrito em `formato-01.md` |
| **Peças prontas** | 3 carrosséis, nenhum publicado ainda |
| **Pendente com o Victor** | licença das fotos do Pinterest |
| **Em aberto** | autorização da ABCZ pra retrato de pioneiro |

## Peças

### 1. Cerca divisória: quem paga a conta

7 slides sobre o art. 1.297 do Código Civil. Capa no cerrado, chapa com o cavalo
de ferro, a cerca de arame dividida ao meio, tabela comparando cerca em cima da
divisa e cerca pra dentro, estrada de terra, lista de provas e o chapéu no sofá.

Arquivo: `carrosseis/cerca-divisoria.json`
Status: **aprovado na revisão**, zip entregue. Falta conferir licença de 3 fotos.

### 2. Dia da Pecuária: os primeiros

7 slides, recorte nacional, pro 14 de outubro. Boiada na estrada, o Herd Book de
1919 em Uberaba, os nomes que assinaram o começo, o mapa dos cinco maiores
rebanhos, as três cifras com ícone e o fecho em homenagem à classe.

Arquivo: `carrosseis/dia-da-pecuaria.json`
Status: **aprovado na revisão**, zip entregue. Falta conferir licença de 5 fotos.

### 3. Fim da escala 6x1: o que muda no campo

10 slides sobre a PEC 221/2019, aprovada no Senado em 14/10. Versão longa e
textual: o que foi aprovado, a linha do tempo da transição, a tabela de antes e
depois, as exceções, a rosca dos 96,6% do agro, por que o ajuste no campo é mais
difícil, onde a conta aparece, o que revisar e o fecho.

A pauta veio de um post da abrada.oficial que o Victor mandou. Não aproveitei
número nenhum de lá: apurei tudo de novo. O ângulo é outro, o prazo, que é o que
ninguém estava contando.

Arquivo: `carrosseis/fim-da-escala-6x1.json`
Status: **entregue**, aguardando revisão. Falta conferir licença de 5 fotos.

## Calendário editorial

A linha editorial vive em `calendario/`. O `plano.json` é a fonte: o que já está
no ar, a agenda das próximas semanas e o banco de pauta. O `gerar.py` monta o
Excel para mandar ao marketing da Gorayeb.

```
python3 docs/gorayeb/calendario/gerar.py [saída]
```

**Rotina quinzenal:** marcar em `plano.json` o que saiu, acrescentar as próximas
semanas, rodar o gerador e mandar o arquivo. O nome do arquivo carrega a data,
então não sobrescreve o que já foi enviado.

Os quatro vídeos gravados e os roteiros deles estão em
`calendario/roteiros-gravados.md`, com a ordem de publicação e o porquê.

O raciocínio do remanejamento de 16/10 está em `calendario.md`. Em uma linha: o
calendário não estava sendo seguido porque o feed já tem pauta própria, então ele
passou a valer como **estoque de pauta, não como agenda**.

## Decisões que viraram padrão

Cada uma saiu de um pedido do Victor. Não voltar atrás sem ele mandar.
O detalhe de cada uma está em `formato-01.md`.

| Decisão | De onde veio |
| --- | --- |
| Logo só na capa e no último slide | revisão da cerca |
| "Do agro, pelo agro." fora da arte **e** da legenda | revisão da cerca |
| Tudo alinhado à esquerda | revisão da cerca |
| Capa num grid de quatro faixas, logo na sombra | revisão da cerca |
| @gorayebadvocacia no topo, inclusive na capa | revisão da pecuária |
| Chapa do `corpo-foto` em cor sólida, sem marca ao fundo | revisão da cerca |
| Listras viram textura, não padrão de fundo | "tá muito blasé" |
| Viúva não passa | "não acho bonito" |
| Figura obrigatória no miolo | "falta gráfico, falta mapa" |
| Quando a pauta tem coisa concreta, desenha a coisa | a rosca virou cerca |
| Cenário nacional, não o escritório | revisão da pecuária |
| Fecho honra quem faz, chamada pede marcação | revisão da pecuária |
| Entrega sempre em zip + txt da legenda | pedido direto |
| Diário atualizado a cada entrega | pedido direto |
| Referência de concorrente é pauta, não fonte | post da abrada |
| Referência mandada = quase cópia da estrutura, com a nossa IDV | pedido direto |
| Estrutura se copia, frase não: reescrever todo o texto | revisão da escala 6x1 |
| Da referência se copia o conteúdo, não a espinha visual | revisão da escala 6x1 |
| Barra de progresso não entra | revisão da escala 6x1 |
| Calendário é estoque de pauta, não agenda; notícia fura a fila | reconciliação de 16/10 |
| Ritmo: 1 vídeo (terça) + 2 peças da agência por semana | pedido direto |
| Carrossel e estático trocam de lugar na execução; o vídeo tem dia fixo | pedido direto |
| Duas trilhas: terça segue o estoque de vídeo, quinta e sábado seguem o pilar | estoque gravado de 16/10 |
| Peça pronta não espera pilar | estoque gravado de 16/10 |
| Pauta de lei informa o que mudou; projeção de custo fica na legenda | retorno do cliente |
| Pauta técnica pede registro longo, até 10 slides | revisão da escala 6x1 |
| Número sem fonte não entra | contrato |
| Data que diverge entre fontes fica de fora | pesquisa da pecuária |

## O que aprendi sobre a linguagem deles

Afirmam seco, negam e corrigem, espelham duas frases, falam com o produtor.
**Nunca falam sobre o próprio post.** Fora: "entenda", "veja", "confira", "em uma
imagem". O teste é ler em voz alta como se fosse o Fernando na porteira.

Isso saiu da leitura das peças publicadas, e está inteiro em `guia-de-conteudo.md`.

## Ferramenta

```
node docs/gorayeb/render.mjs docs/gorayeb/carrosseis/<peça>.json
python3 docs/gorayeb/empacota.py docs/gorayeb/carrosseis/<peça>.json
```

Tipos de slide, figuras e ícones estão na tabela do `README.md`.

## Pendências

1. **Licença das fotos do Pinterest.** Oito no total entre as duas peças.
   Descartei as que tinham marca d'água do Freepik e assinatura de fotógrafo,
   mas "sem marca" não é "liberada". Opções: comprar equivalentes num banco, ou
   pedir foto de curral e boiada pra alguém do círculo do Fernando.
2. **Retrato de pioneiro.** O Victor pediu foto dos grandes no carrossel da
   pecuária. Não coloquei: os retratos que existem são de acervo da ABCZ e
   precisam de autorização. Se conseguir, monto um slide só com eles.
3. **Instagram.** Liberado na rede, mas o `WebFetch` resolve DNS por fora do
   proxy e não enxerga. Pelo Chromium dá pra ler a legenda, mas as imagens do
   carrossel não vêm: sem login o site segura as artes e, depois de algumas
   tentativas, passa a devolver 429. **Para referência, pedir os prints.**
4. **Figma.** O MCP do Figma não conecta nessa sessão, dá 403 no proxy. Tudo que
   foi feito saiu das peças do Drive e do `hex.pdf` oficial.

## Histórico

**15/10/2026**

- Li a pasta de criativos no Drive e levantei paleta, tipografia e linguagem.
- Montei o template: tipos de slide, fundos, texturas e as figuras.
- Puxei as fotos: Pinterest liberado em duas etapas, e 208 das 297 do banco da
  Gorayeb (89 passam do teto de 6,28 MB do MCP do Drive).
- Carrossel da cerca divisória, revisado em cinco rodadas de comentário.
- Formato 01 escrito e fechado.
- Carrossel do Dia da Pecuária, revisado em três rodadas.
- Correção: era Dia do Pecuarista, 15 de julho. É Dia da Pecuária, 14 de outubro.
- Empacotador de entrega.
- Diário criado.

**16/10/2026**

- Correção: os vídeos dos itens 1, 9, 10 e 15 não estavam no ar, estavam
  gravados e editados. Entraram nas terças de 20/10 a 10/11, e a primeira
  quinzena de novembro virou bloco ambiental para acompanhá-los. A NR-31 abre
  em 24/11.
- Calendário editorial reconciliado. 20 posts previstos até 15/10, 4 do
  calendário feitos, mas o feed publicou bem mais que isso com pauta própria.
  Agenda refeita de 17/10 em diante, pilar trabalhista deslocado uma semana, e
  gerador de Excel montado para a entrega quinzenal ao marketing.

- Carrossel do fim da escala 6x1, a partir de um post que o Victor mandou como
  referência. Instagram liberado na rede pra conseguir ler o original.
- Figura nova: linha do tempo.
- Regra nova: número de concorrente não entra sem conferir em fonte
  independente. Caiu a projeção da FAEP de R$ 4,1 bilhões, que é calculada em
  cima de 36 horas e não das 40 aprovadas.
- Refeito em dez slides, no registro técnico da referência, com menos frase de
  efeito. O formato 01 passou a ter dois registros, curto e longo.
- A tabela ganhou `realce`, pra poder destacar a segunda coluna.
- **Refeito como releitura da referência**, depois que consegui baixar as artes
  do post pelo endpoint de embed. Os 9 slides deles, slide a slide, com a nossa
  identidade, mais a linha do tempo que eles não trazem.
- Peças novas no template: barra de progresso, etiqueta em pílula, slide de
  `cifra`, lista `itens` em pílula com ícone ou número, caixa de dado, mapinha
  de canto e nove ícones novos.
- Revisão: contador numérico da barra fora, texto todo reescrito pra não ficar
  com cara de cópia, e o slide do placar ganhou foto do plenário do Senado.
- Ainda ficou parecido demais. Reestruturado de vez: a barra saiu, e a espinha
  de cinco cifras seguidas deu lugar a sete desenhos diferentes. Três cifras
  deles viraram um slide de números em diagonal; entraram tabela e linha do
  tempo, que o original não tem.
- Retorno do cliente: o conteúdo tem que informar o público sobre as mudanças,
  de um jeito fácil de entender. Refeito no eixo informativo. Saíram da arte as
  projeções de custo e entraram a semana em quadrados, a tabela com a linha que
  não muda e o slide de quem fica de fora. Figura nova: `semana`.
- Revisão em quatro comentários. Três correções que valem pro template inteiro:
  a chapa do `corpo-foto` era fixa em 48% e cortava texto comprido, agora cresce
  com o conteúdo; a rosca de 96,6% virou `blocos`, porque anel quase fechado não
  informa nada; e o título da chapa passou a correr numa linha só, com o corpo
  cedendo conforme o tamanho da frase.
