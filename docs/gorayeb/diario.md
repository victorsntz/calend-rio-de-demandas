# Diário da Gorayeb

O que já foi feito, decidido e entregue. Pra consultar em vez de rolar conversa.
Atualizo isso a cada entrega ou decisão nova.

## Onde estamos

| | |
| --- | --- |
| **Formato padrão** | 01, escrito em `formato-01.md` |
| **Peças prontas** | 5 carrosséis, 1 estático, 1 anúncio de vaga. Publicado: escala 6x1 (16/10) |
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

### 6. Disputas com cooperativas

8 slides pro 29/10, item 20 do calendário. Registro longo. O gancho é que o
cooperado não é cliente: a operação é ato cooperativo (art. 79 da Lei 5.764/71),
então o STJ afasta o CDC. Daí sai a tabela de cliente × cooperado, a tese de que
crédito de ato cooperado fica fora da recuperação judicial (STJ, 3ª Turma, 2024,
que amarra com o carrossel do dia 22), as cinco frentes onde a briga nasce, a
assembleia como único lugar onde a voz do cooperado pesa, o que juntar e o fecho
no estatuto.

Ficou **fora da arte** o teto de 1% ao mês da lei de usura. Tem julgado do STJ
aplicando o limite às cooperativas de crédito, mas o entendimento não é pacífico:
há decisão equiparando a cooperativa a instituição financeira. Foi pra legenda
com a ressalva.

Arquivo: `carrosseis/disputas-cooperativas.json`
Status: **entregue**, aguardando revisão. Falta conferir licença de 4 fotos.

### 7. Vaga: Advogado(a) — Contencioso Cível

Duas artes, feed (1080×1350) e stories (1080×1920), a partir do texto que a Dra.
Elisa mandou. O feed leva o essencial: cargo, cidade, três requisitos de uma linha
e o e-mail com o assunto. O stories, que tem 570px a mais de altura, abre as
atribuições e os requisitos em dois blocos e ainda leva a linha da remuneração e
de Araguari a 30 minutos de Uberlândia.

Foto é do banco da própria Gorayeb, a sala de reuniões vazia. É a exceção à regra
de cenário nacional: em vaga, quem vai se candidatar quer ver onde trabalharia.

**O prazo.** O texto original dizia "até 16/10/2026" numa mensagem de 21/10. Era
data vencida, ficou de fora da arte. A Elisa confirmou 30/10 no mesmo dia e a
chamada entrou nas duas peças: "Envie seu currículo até dia 30/10", com a data em
dourado, logo acima da caixa do e-mail.

Arquivo: `carrosseis/vaga-contencioso-civel.json`
Status: **entregue**, aguardando revisão.

## Calendário editorial

A linha editorial vive em `calendario/`. O `plano.json` é a fonte: o que já está
no ar, a agenda das próximas semanas e o banco de pauta. O `gerar.py` monta o
Excel para mandar ao marketing da Gorayeb.

```
python3 docs/gorayeb/calendario/gerar.py [saída]
```

O texto do e-mail de envio está em `calendario/email-elisa.md`.

**A cada entrega de conteúdo:** marcar o status em `plano.json`, mudar
`atualizado_em` e rodar o gerador. O Excel vai junto com os zips, sempre.

**Rotina quinzenal:** acrescentar as próximas semanas e mandar o arquivo também
para a Dra. Elisa, com o texto de `email-elisa.md`. O nome do arquivo carrega a data,
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
| Entrega sempre em zip + txt da legenda + Excel atualizado | pedido direto |
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

**18/10/2026**

- Carrossel das disputas com cooperativas, pro 29/10.
- Troquei duas fotos depois de olhar o render: a assembleia e a roda de produtores
  tinham rosto identificável em primeiro plano, e foto de Pinterest com gente
  reconhecível num post comercial é risco que não vale. Entraram uma assembleia
  vista de longe, sob a mangueira, e o saco de café subindo no caminhão.
- **Regra nova no template:** `foto-texto` sobre foto ganhou véu próprio, mais
  fechado na faixa do meio, que é onde o texto cai. O véu padrão só fecha no pé e
  deixava o parágrafo brigando com a foto. Melhorou também o slide 7 da
  recuperação judicial.
- Descoberta pra conferir: `img/cafezal-minas.png` tem cara de IA (fileira
  perfeita demais, duas casas quase iguais, luz sem direção). Não está em peça
  nenhuma, só no arquivo de teste. Melhor apagar.
- Pendência que vem de antes: o `corpo-foto` é o único slide sem o
  @gorayebadvocacia no topo, porque a chapa não deixa lugar pra ele em cima da
  foto. Está assim desde a cerca e passou em três revisões. Se o Victor quiser,
  dá pra jogar o arroba pra dentro da chapa.

**21/10/2026**

- Anúncio da vaga do contencioso, feed e stories.
- **Tipo novo no template: `vaga`.** Etiqueta, cargo em duas linhas com a segunda
  em dourado, cidade, requisitos opcionais e caixa de e-mail. O mesmo JSON serve
  as duas peças; o que muda é `formato: "stories"`.
- **Stories passou a existir no render.** `.slide.stories` tem 1920px de altura,
  com margem extra em cima e embaixo, que é onde o Instagram põe a própria
  interface. A janela do Chromium cresce pro maior slide da peça.
- Erro que custou uma rodada: slide mais alto que a janela saía com o pé preto. O
  print do elemento pegava uma faixa que o Chromium ainda não tinha pintado. Entrou
  `scrollIntoViewIfNeeded` e a espera de dois quadros antes de cada print.
- O `empacota.py` passou a pôr o formato no nome do arquivo quando a peça tem mais
  de um (`01-feed.png`, `02-stories.png`) e a medida certa no cabeçalho do txt.
- A vaga entrou na agenda do dia 21/10 como extra, fora da cadência, pra Elisa ver
  no Excel que ela saiu.
- Revisão do Victor: o stories podia levar bem mais informação. O tipo `vaga`
  ganhou `blocos` (subtítulo dourado + lista) e `remate`. O feed continua enxuto.
- Duas correções da Dra. Elisa, que viraram regra: **"conta ponto" não se usa** em
  anúncio de vaga, diferencial vai sob o rótulo **Desejável**; e **"agro" nunca
  abreviado**, sempre **Agronegócio**.
- A regra do Agronegócio foi aplicada também na recuperação judicial, que sai dia
  22 e ainda dava tempo. A escala 6x1 já está publicada desde 16/10 com "Trabalho
  no agro." na capa e "dos contratos do agro" no gráfico: fica como está, a regra
  vale daqui pra frente.
- Prazo da vaga confirmado em 30/10. Campo novo no tipo `vaga`: `chamada`.
- Mais uma rodada com a Dra. Elisa: a remuneração na arte ficou só
  "Remuneração compatível com a experiência" (a qualidade de vida em Araguari saiu
  da arte e continua na legenda), e a chamada virou "Envie seu currículo até dia
  30/10 para o e-mail abaixo indicado:", apontando pra caixa.
- **A legenda da vaga é o texto que ela mesma mandou, palavra por palavra.** Cheguei
  a reescrever em registro institucional quando ela disse que estava informal, mas o
  texto que ela aprovou em seguida é o tom da casa mesmo, com "a gente atua" e
  "marca nos comentários". Quem escreve a legenda de vaga é o cliente; a agência
  formata.
- Divergência de propósito, pendente de palavra dela: na arte o desejável diz
  "Direito Agrário, Agronegócio ou Empresarial", do anúncio original; na legenda
  ficou "Agrário e/ou Empresarial", da versão nova.
- Duas rodadas de "está condensado" no feed da vaga. A primeira resolvi com
  espaçamento e deu pouco. A segunda era quantidade mesmo: a linha da
  pós-graduação saiu do feed, o Desejável virou uma linha só, e os vãos entre
  blocos foram pra 68px. A pós continua no stories e na legenda. Virou regra:
  respiro vem de cortar item, não de apertar entrelinha.
- Dra. Elisa: Direito Agrário e Agronegócio, na lista do Desejável, estavam
  dizendo a mesma coisa. Ficou "Direito do Agronegócio ou Empresarial" nas duas
  artes e na legenda, que é como o escritório se posiciona. "Agrário" saiu da peça.

**22/10/2026**

- Vídeo do dia 20 publicado.
- **Pilar novo: Previdenciário Rural**, pedido da Dra. Elisa. Abre em 23/10, fora da
  cadência, e corre até 28/11. Doze peças: 3 vídeos, 4 carrosséis, 5 estáticos. O
  plano inteiro está em `calendario/bloco-previdenciario.md`.
- O recorte foi por público, não pela lista de serviços. O escritório faz
  previdenciário inteiro, inclusive BPC/LOAS, PCD e servidor municipal, mas o feed
  fala com o produtor rural. Entra o que já é dor dessa audiência; o urbano fica pro
  banco de janeiro e, se for, rende mais em tráfego pago.
- Mais estático que carrossel neste bloco, cinco contra quatro: aposentadoria rural
  se espalha por WhatsApp de família, não por explore, e frase que cabe num print
  viaja mais que carrossel de dez telas.
- As terças de 27/10, 03/11 e 10/11 ficaram com o bloco ambiental, porque esses
  vídeos já estão gravados. Onze peças de ambiental e da NR-31, todas ainda por
  produzir, foram pro banco de janeiro.
- Roteiro do vídeo 1 pronto em `calendario/roteiro-previdenciario-01.md`: motion sem
  rosto, narração em ElevenLabs, decupagem segundo a segundo.
- Ficou fora de tudo o estudo que sugere subir o tempo mínimo de 15 para 20 anos e a
  idade para 67. Não é lei.
- Os textos que a Elisa mandou de referência são posts de outro perfil. Pauta, não
  fonte, como já tinha sido com o post da escala 6x1.
- Victor derrubou a primeira grade do bloco: eu tinha intercalado os vídeos
  ambientais gravados no meio do previdenciário. Ele estava certo, aquilo resolvia
  problema de produção e não de audiência. **Regra nova: um bloco fala de uma coisa
  só, terça inclusive.** Os três vídeos ambientais foram pro bloco de janeiro.
- Bloco fechado em **12 peças, de 23/10 a 21/11**: 5 vídeos, 3 carrosséis, 4
  estáticos. Victor faz os três primeiros vídeos em motion, o Dr. Gustavo grava os
  dois últimos numa sessão só.
- A NR-31 voltou pra 24/11 e emendou no trabalhista de fim de ano, virando um bloco
  contínuo de duas semanas até 05/12.
- **Padrão de roteiro definido**, a partir do formato que o Victor usa no ElevenLabs:
  emoção em colchete antes da frase, `[pause]` marcando respiração, número por
  extenso. Está no formato 01.
- Victor pegou de novo: mesmo depois de limpar as terças, sobravam duas peças de
  crédito rural dentro da primeira semana e o feed ficava se revezando. **Transição é
  um bloco terminando antes do outro começar, não dois se alternando.** O carrossel
  das cooperativas subiu pra 24/10 e fecha o crédito rural; o estático do patrimônio
  foi pra segunda onda, pronto e empacotado. Bloco fechou em 13 peças.
- A Dra. Elisa pediu um **vídeo de lançamento da área previdenciária**. Ele abre o bloco
  em 23/10; o do segurado especial passou pra 27/10. Roteiro em
  `calendario/roteiro-previdenciario-00-lancamento.md`. A ideia é fazer a ponte que
  justifica a área num escritório de agronegócio: a renda de quem não pode mais
  trabalhar na terra é a única coisa que a terra não garante sozinha.
- O lançamento cita a área inteira, rural e urbana, o que resolve boa parte da
  cobertura da lista da Elisa sem quebrar o recorte rural do bloco educativo. Ficam
  de fora de tudo só aposentadoria por pontos, auxílio-doença acidentário,
  auxílio-reclusão e os dois posts de referência dela (servidor CLT e PCD).
- Saiu o vídeo de 60 e 55, que repetia o vídeo 1. O carrossel 2 trocou pra período
  rural negado pelo INSS, que cobre quatro serviços da lista.
- Pendente: confirmar quem são as pessoas das fotos `patriarca-chapeu` e
  `pai-e-filho-chapeu` antes de usar no lançamento, e o nome e a OAB do Dr. Gustavo
  se ele for citado.
- **Plano em PDF pra Dra. Elisa**, com os 13 roteiros e a fonte de cada informação:
  `calendario/plano-previdenciario/` (o `conteudo.py` é a fonte, o `gerar.py` monta o
  PDF com Chromium). O texto do e-mail está em `calendario/email-elisa-previdenciario.md`.
- No PDF a narração vai em texto corrido. A marcação de voz pro ElevenLabs fica só nos
  `.md` de roteiro, que é material de produção, não de aprovação.
- Fontes: o Planalto não responde daqui (DNS e resposta vazia pelo proxy). A apuração
  foi nas páginas oficiais do INSS em gov.br/inss, que trazem a regra vigente em
  linguagem simples, mais lei, súmula e tema do STJ citados pelo número.
- Achados que entraram nos roteiros: desde 1º/1/2023 o tempo rural do segurado especial
  só se prova pelo cadastro (art. 19-D do RPS); a pensão rural exige 18 meses de
  atividade, não de contribuição; salário-maternidade rural segue com 10 meses na
  página do INSS, apesar da ADI 2110, e o carrossel diz isso com a ressalva.
- As fotos `patriarca-chapeu` e `pai-e-filho-chapeu` são da família Gorayeb no
  escritório. Não usar em peça de previdenciário: dá a entender que o patriarca é
  beneficiário.

**22/10/2026, tarde**

- A Dra. Elisa mandou o **Plano de Marketing do lançamento da área previdenciária**
  (`calendario/referencias/plano-marketing-lancamento-previdenciario-elisa.pdf`). **Ele
  substitui o nosso bloco de 13 peças.** 6 semanas, 18 posts, segunda, quarta e sexta,
  temas misturando rural, BPC, urbano e aposentados, eventos (café de lançamento,
  palestras, café com contadores) e entregas de site, cartilhas e apresentação.
- Frase-guia dela: "Protegemos o patrimônio e o futuro de quem produz, da porteira à
  aposentadoria." Linguagem: "quem trabalha na roça com a família" no lugar de
  "segurado especial", sempre que der.
- **Entregas com o nome Fortunato:** identidade visual da área, ajuste de perfis e
  Google Meu Negócio, banco de 18 posts (antes da semana 1), cartilha do produtor rural
  e apresentação institucional (semana 2), cartilha do BPC (semana 3). Na prática também
  o vídeo de lançamento e, a confirmar, a parte visual do evento.
- Leitura completa, grade dos 18 posts e pendências em
  `calendario/lancamento-previdenciario.html`.
- O vídeo do segurado especial (60 e 55, 15 anos) já foi feito e aprovado. Entra na
  quarta da semana 1, que é o tema "Trabalho no campo conta para a aposentadoria?".
- Roteiro do lançamento refeito no formato dela, com o Dr. Fernando e o Dr. Gustavo.
- **Pendência que trava o calendário: a data de início da semana 1.** E se o feed do agro
  pausa nas 6 semanas.
- Victor fechou: **o lançamento começa sexta, 23/10, e o feed do agro pausa** até o fim
  do bloco (02/12). Depois se monta o próximo. Quem aprova as peças é a Dra. Elisa.
  Prioridade dele: primeiro a linha editorial do Instagram, depois a cartilha, o resto
  (eventos, apresentação, perfis) mais pra frente.
- Linha editorial datada: 18 posts, segunda, quarta e sexta, de 23/10 a 02/12
  (`lancamento-previdenciario/linha-editorial.html`). Temas todos da Elisa; mudou só a
  ordem: o vídeo aprovado dos 60 e 55 abre amanhã com legenda que anuncia a área, o
  vídeo de lançamento com os advogados vai pra 30/10, gravação mais pra trás, e todo
  registro de evento depois do evento.
- As 14 peças do agro que estavam no período foram pro banco `proximo_bloco`,
  incluindo o carrossel das cooperativas e o estático do patrimônio, prontos e aprovados.
- Legenda do post 01 em `lancamento-previdenciario/01-legenda-23-10.txt`.
- Correção do Victor: **o post de amanhã tem que ser o vídeo de lançamento** do plano da
  Elisa, com o Dr. Fernando aparecendo. O vídeo dos 60 e 55 foi pra segunda, 26/10, e o
  resto subiu um passo. Roteiro em `lancamento-previdenciario/00-video-lancamento.md`,
  em duas versões: A, gravada com os dois advogados, com o texto de cada um e um guia
  de gravação rápida; B, reserva sem gravação, com os dois por foto e narração em voz
  institucional (nunca clonar ou imitar a voz dos advogados).
- Nomes e OAB vieram do site grupoftg.com.br, seção Equipe (os dados ficam no script do
  site, não no HTML): Dr. Fernando Torbay Gorayeb, OAB/MG 144.479; Dr. Gustavo Freitas
  Marcelino, advogado associado, sem OAB publicada. Fotos dos dois baixadas pra
  `img/fernando-site.jpg` e `img/gustavo-site.jpg`. Falta a OAB do Dr. Gustavo.

**23/10/2026**

- **PDF da linha editorial inteira**, no padrão de uma peça por página: os 18 posts do
  plano da Elisa, de 23/10 a 02/12, com objetivo, roteiro e fontes de cada um. Fonte em
  `lancamento-previdenciario/conteudo.py`; o gerador do plano de 22/10 passou a aceitar
  `--conteudo` e saem os dois.
- Sete temas novos apurados nas páginas do INSS: BPC/LOAS, BPC para crianças com TEA,
  aposentadoria especial (pontos 86/76/66 pra quem já contribuía em 2019, idade 60/58/55
  pra quem começou depois, PPP), auxílio por incapacidade temporária, revisão (10 anos,
  e o fim da revisão da vida toda no STF em 2024), planejamento e dúvidas frequentes.
- **Correção:** o auxílio-doença acidentário é de empregado com carteira e doméstico, não
  de quem trabalha na roça com a família. O plano de 22/10 tinha uma frase sugerindo o
  contrário, no carrossel da família rural; no novo está certo.
- O lançamento é a única peça com duas páginas: roteiro em tabela numa, legenda e
  fontes na outra.


**23/10/2026, noite**

- **E-mail da Dra. Elisa:** gostou do vídeo, mas ele falava só do previdenciário rural; pediu
  para incluir os outros benefícios. O Dr. Fernando não quer o lançamento da área do jeito
  que estava no plano. Ficou assim: um vídeo que informa a área, os conteúdos do cronograma
  **uma vez por semana**, ênfase no agronegócio e no empresarial, e os vídeos gravados em
  setembro rodando. Os demais itens do lançamento ficam suspensos.
- Vídeo novo da área em `linha-editorial/01-video-area-previdenciaria.md`: 90 segundos,
  narração institucional no ElevenLabs, sem ninguém aparecendo. Fala de aposentadoria por
  idade (rural e urbana), especial, híbrida, planejamento, BPC/LOAS, pensão,
  salário-maternidade, auxílio por incapacidade temporária e revisão. Sai na quarta, 28/10.
  Legenda em `linha-editorial/01-legenda-28-10.txt`.
- **Linha editorial nova, de 26/10 a 18/12:** 24 posts. Quarta é do previdenciário (8 posts).
  Segunda e sexta, agronegócio e empresarial em blocos: crédito rural (cooperativas e
  patrimônio, prontos), ambiental e fundiário (os três vídeos gravados nas segundas 02, 09
  e 16/11, mais reserva legal, georreferenciamento e consulta do CAR), trabalhista rural
  (NR-31, 13º do safrista antes de 30/11, atualizações, EPI) e sucessão e holding em dezembro.
  A regra "um bloco fala de uma coisa só" cedeu ao pedido da cliente: o previdenciário corre
  em paralelo, uma vez por semana.
- PDF: `calendario/saida/Linha_Editorial_Gorayeb_2026-10-23.pdf`, 29 páginas, fonte em
  `linha-editorial/conteudo.py`. Roteiros novos do agronegócio e do empresarial em
  `linha-editorial/agro_*.py`, todos conferidos em fonte oficial. Excel do dia 23/10.
- Os outros 5 temas previdenciários (TEA, especial, planejamento, dúvidas, urbana x rural)
  foram para janeiro. Os dois vídeos que dependiam de gravação do Dr. Gustavo viram
  narração.
- **Correção:** o estático do patrimônio citava a Súmula 349 do STJ como fonte da exceção à
  impenhorabilidade. A 349 é sobre FGTS. A exceção é o art. 833, §1º do CPC. Apoio, rodapé
  e legenda corrigidos, zip refeito. O título da arte ficou igual.
- Georreferenciamento: o Decreto 12.689/2025 jogou tudo para 21/10/2029, mas uma liminar da
  Justiça Federal no Maranhão (maio de 2026) suspendeu isso para imóveis maiores. O estático
  não promete prazo; conferir o processo na semana de 13/11.
- Holding: ITCD de Minas em 5% hoje, com projeto de alíquota progressiva na Assembleia.
  Conferir na semana de 11/12.
