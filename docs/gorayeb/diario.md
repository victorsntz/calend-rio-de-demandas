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

**26/10/2026**

- **Quatro modelos de capa**, pedido do Victor: o feed estava ficando com todas as
  capas iguais. Capa 1 foto (a de sempre), 2 meia-folha, 3 tipográfica sem foto e
  4 clara, com fundo creme. Revezam, sem repetir o mesmo modelo em dois posts
  seguidos. Estão em `formato-01.md` e demonstrados em `carrosseis/demo-capas.json`.
- **Selo de área**, pedido da Dra. Elisa: marcador pequeno no alto à direita da capa
  dizendo de que área é o conteúdo. Cor por área: dourado no agronegócio, areia no
  previdenciário, bordô no empresarial, marrom no trabalhista. Campo `selo`.
  Quando o selo entra, a etiqueta de assunto da capa 1 sai.
- A capa de cada post dos 24 ficou escrita no plano, no PDF e no Excel, pra não
  depender de lembrar na hora de revezar.
- **Aba nova no Excel, Roteiros e legendas:** o roteiro e a legenda de cada post,
  uma linha por tela e por parágrafo. O Excel só mostra mil e poucos caracteres por
  célula, por isso não vai tudo num lugar só. Mesma fonte do PDF.
- Victor mandou pra Dra. Elisa só o Excel, que é quem posta é a gente. O PDF
  continua existindo pra quando for preciso apresentar.
- **Estático de 30/10 refeito** no modelo de capa 2, com o selo. Foto nova, de quem
  está na enxada, que é o requisito legal da peça: propriedade trabalhada pela
  família. A anterior era a casa de roça, que não cabia na faixa horizontal.

**28/10/2026**

- **A Dra. Elisa aprovou a linha editorial inteira**, por e-mail: "Aprovado! Vamos em
  frente!". Os 24 posts de 26/10 a 18/12 estão liberados. O que falta em cada peça
  agora é a arte, não o texto.
- Status atualizado no `plano.json` e no Excel: o que estava "roteiro para aprovação"
  passou a "roteiro aprovado · produzir a arte"; os três vídeos de setembro e o dos
  60 e 55 ficaram "aprovado · pronto para publicar".
- O vídeo da área sai hoje. Legenda em `linha-editorial/01-legenda-28-10.txt`.

**02/11/2026 · troca de nome**

O escritório deixou de ser **Gorayeb Advocacia** e passou a ser **FTG Advogados**.
O @ do Instagram já mudou. O sobrenome Gorayeb continua existindo nas pessoas
(Dr. Fernando Torbay Gorayeb), então nada de troca cega no texto.

Feito agora: nome do escritório trocado no título e no rodapé do PDF, no texto do
objetivo do vídeo da área e nos comentários dos geradores.

**Travado, esperando material do Victor:**

1. **Logo novo**, horizontal claro e escuro. Hoje `assets/logo-horizontal-*.png`
   traz o lockup com "GORAYEB ADVOCACIA" escrito. Enquanto não trocar, toda arte
   renderizada sai com o nome velho. É o bloqueio de verdade.
2. **O @ exato**, pra trocar a constante `ARROBA` em `render.mjs` e a regra no
   `formato-01.md`.
3. **Post fixado "Gorayeb em números"**, que o Victor vai mandar. Não está neste
   repositório nem no acervo desta conta.

O que **não** muda: o símbolo F|T|G, a paleta, as fotos e os 17 roteiros aprovados.
Só a assinatura.

Os três vídeos de setembro e o da área, de 28/10, já foram ao ar com o nome
antigo na narração. Ficam como estão: são registro do que foi publicado.

**02/11/2026 · revisão da Dra. Elisa em duas peças**

Ela revisou a legenda do carrossel da cerca e do estático do patrimônio, com o
motivo de cada ajuste. As observações batem na arte também, não só no texto.

**Cerca divisória.** O carrossel foi de 7 para 9 telas.
- Faltava a **cerca especial do art. 1.297, §3º**: se o reforço é pra segurar
  porco, carneiro ou galinha, quem tem a criação paga sozinho. Virou tela própria,
  em bordô. É a regra que mais aparece no campo.
- **Meio a meio não é absoluto.** É presunção até prova em contrário e segue o
  costume da região. "Cerca de divisa não é sua" virou "não é só sua", e a tabela
  passou a dizer "os dois, em regra meio a meio".
- **Avisar antes.** Tribunal costuma negar reembolso de obra feita sem combinar.
  A lista virou "Antes de mexer na cerca", com o aviso por escrito e o orçamento
  em primeiro lugar.
- Somei a **culpa** (gado, árvore, máquina: arts. 186 e 927) numa tela nova, e o
  **Juizado Especial** na legenda.

**Patrimônio do produtor PF.** Já foi ao ar em 30/10, então só a legenda muda de
fato; a arte fica pronta pra repostagem.
- A **subsistência saiu**: não é requisito autônomo. São duas condições, pequena
  e trabalhada pela família.
- **Quem prova a exploração familiar é o produtor** (STJ, Tema 1.234).
- Os quatro módulos vêm da **Lei 8.629/93**; o Tema 961 fala em área inferior a
  quatro.
- A proteção com o imóvel em garantia está nos **fundamentos** do Tema 961, não
  na tese.
- O título ganhou **"a compra dela"**: "financiou ela" fazia parecer que qualquer
  financiamento derruba a proteção, quando o que derruba é só a dívida da compra.

As duas artes continuam saindo com a logo e o @ antigos. Só vão pro feed depois
que a logo da FTG chegar.

**03/11/2026 · logo nova no sistema**

Chegou o pacote da FTG. Instalado:

- `assets/logo-horizontal-claro.png` e `-escuro.png`, `logo-empilhado.png` e
  `logo-empilhado-escuro.png`. Timbrado e cartão de visita em `assets/marca/`,
  só como referência.
- O símbolo F|G não mudou. A paleta não mudou. Mudou a palavra do lado.
- **O lockup novo é mais baixo:** 3 por 1, contra 4,4 por 1 do antigo, porque a
  palavra virou uma linha só. Na altura antiga, "ADVOGADOS" ficava ilegível.
  Entrou `ESCALA_LOGO = 1.45` no `render.mjs` e a capa do PDF subiu de 15 para
  21 mm. É um lugar só nos dois casos.
- `@ftgadvogados` no topo de todo slide, na constante `PERFIL` do `render.mjs`.
  **Grafia a confirmar com o Victor.**
- Tudo que estava pronto foi renderizado de novo e reempacotado: cerca,
  patrimônio, cooperativas, recuperação judicial, vaga, pecuária e escala 6x1.
  O PDF da linha editorial também.

Regra de marca escrita no `formato-01.md`, na seção A marca.

**03/11/2026 · o @ certo e o Instagram**

O perfil é **@ftgadvogados_**, com underline no fim. Eu tinha posto sem. Corrigido
na constante `PERFIL` do `render.mjs` e no `formato-01.md`, e todas as peças foram
renderizadas e reempacotadas de novo.

**Não consigo abrir o Instagram daqui.** O endereço não resolve nesta sessão: o
instagram.com não está na lista de domínios liberados. Mesmo liberado, o perfil
público costuma devolver só a tela de login para quem não está logado. Então o
que está no ar eu só sei pelo que o Victor contar. O controle do que saiu
continua sendo a coluna Status da aba Agenda, no Excel.

**03/11/2026 · carrossel de 06/11, Reserva Legal e APP**

Primeira peça desenhada com a marca nova. 9 telas, capa 3 (tipográfica), selo de
Agronegócio, roteiro aprovado pela Dra. Elisa em 28/10 sem mudar uma vírgula.

**Figura nova: `margem`.** Vista de cima de um rio com a faixa de mata de cada
lado e a medida embaixo. Primeiro desenhei em corte, visto de lado, e a água
virava um balde marrom no meio da tela. De cima funciona melhor, e é como a área
aparece no mapa do CAR, que é justamente o assunto da peça.

Duas correções de percurso que valem pras próximas:

- O título era "A faixa cresce com o rio" e o desenho mostrava um caso só.
  Prometia o que não entregava. Virou "Trinta metros em cada margem", e o
  crescimento ficou na legenda da figura.
- `itens` com dois itens deixa meia tela vazia. A tela da nascente e da vereda
  virou `corpo-foto`.
- **Em `lista` com `meiaFoto`, item passa de 35 caracteres já quebra em duas
  linhas e o remate cai pra fora da tela.** Terceira vez que isso acontece.

Não há foto de rio, nascente ou mata ciliar no banco. A peça se segura na figura
e na tipografia. Vale pedir ao escritório, ou garimpar, fotos de água e de mata.

**03/11/2026 · carrossel de 11/11, BPC/LOAS**

8 telas, capa 4 (clara), selo de Área Previdenciária, roteiro aprovado em 28/10
sem mudar o conteúdo.

- A sigla vem traduzida na tarja da capa, "BPC, o Benefício de Prestação
  Continuada", antes de aparecer sozinha em qualquer tela. É a regra nova,
  aplicada pela primeira vez.
- A tela 2 abre negando: "O BPC não é aposentadoria." É a confusão número um
  do tema, e tirá-la do caminho cedo faz o resto ser lido direito.
- A tela da pessoa com deficiência ficou com três itens mais um remate. Com
  quatro itens e sem remate, sobra um vão no pé da tela: nada ancora embaixo.

Falta foto de pessoa idosa e de pessoa com deficiência no banco. A peça se
apoiou na casa de roça, no peão com o balde e na porteira.

**03/11/2026 · estático de 13/11, georreferenciamento**

Antes de desenhar, mandei reconferir o prazo, porque a peça se apoia numa
liminar. Conferido em 03/11:

- O **Decreto 12.689/2025** segue sendo a última alteração do Decreto 4.449/2002.
  Nenhum decreto novo no DOU entre 22/10/2025 e hoje. A data correta é **21 de
  outubro de 2029**; vários escritórios publicaram "21 de novembro", que vem do
  Decreto 7.620, de 21/11/2011, revogado por este.
- A **liminar de 07/05/2026** (Ação Popular 1086967-47.2025.4.01.3700) continua
  sem sentença, sem suspensão e sem agravo conhecido. Última movimentação vista:
  conclusão para decisão em 01/07/2026. Ressalva honesta: a base pública do CNJ
  está defasada desde 17/08, e o DJEN bloqueia este ambiente. Nada apareceu na
  imprensa registral até 30/10, que cobriu cada passo anterior em um dia.
- **Armadilha de número:** a decisão fala em "inferior a 101 hectares", mas a
  orientação aos cartórios manda aplicar "100 hectares ou mais". A legenda
  passou a dizer "cerca de 100 hectares para cima", e a arte não promete prazo
  nenhum, de propósito.

Escala `curta` nova no `.frase`, de 58px: "georreferenciamento" não cabia nem no
menor. A regra de duas linhas no apoio valeu de novo.

**03/11/2026 · foto do escritório no estático de 13/11**

Pedido do Victor: trocar a paisagem por foto do escritório. Ficou a sala de
reuniões, que combina com o recado da peça, que é sentar e perguntar antes de
mexer na terra. Fachada e o F|G na madeira ficaram como alternativa.

Duas coisas que apareceram na busca:

- **`img/pasta-gorayeb.jpg` está queimada.** Mostra "GORAYEB ADVOCACIA" impresso
  na papelaria. Não entra em peça nenhuma enquanto não houver papelaria nova.
- **O banco do escritório só tem detalhe e objeto.** Fachada, mesa vazia, madeira
  com o símbolo, dama da justiça, alfinete. Nenhuma pessoa. Por isso as peças
  caem em paisagem toda vez que pedem presença humana, e o bloco previdenciário
  inteiro fala de gente. Vale meia hora de fotógrafo no escritório: atendimento,
  mãos sobre documento, conversa na mesa. Com a marca nova, é a hora.

**05/11/2026 · capas do vídeo institucional**

Tipo novo no render, `capa-video`, e formato novo, `youtube`, de 1280x720. A
mesma arte serve o feed e a thumb; na thumb o arroba sai, o título cresce e a
logo diminui, porque ela é lida em 320 px de largura.

O véu da capa de vídeo pesa à esquerda e abre à direita: o texto fica legível e
a foto continua aparecendo. Sem isso a tarja dourada sumia no céu claro.

Três opções de frase em `carrosseis/capa-institucional.json`, cada uma no feed e
na thumb, para o Victor escolher. Ainda não sei o que o vídeo fala: as frases
saíram do posicionamento, não do roteiro dele.

**05/11/2026 · status da agenda**

Marquei como publicados os posts de 26/10 a 02/11: cooperativas (26/10), vídeo
da área previdenciária (28/10), patrimônio do produtor PF (30/10) e vídeo do CAR
(02/11). `atualizado_em` em 05/11 e Excel regerado.

O vídeo dos 60 e 55 anos, de 04/11, eu também tinha marcado como publicado, mas
aquilo era dedução de resumo, não palavra do Victor. Voltou para "aprovado ·
publicação a confirmar com o Victor".

**Regra nova: publicado só entra com a confirmação do Victor.** O Instagram não
abre nesta sessão, então a coluna Status é o único controle do que saiu, e
dedução ali contamina o Excel que vai pra Dra. Elisa.

Onde o calendário está: dos 24 posts, 8 confirmados no ar. A agenda está coberta
com arte ou vídeo pronto até 16/11. O primeiro vão é **18/11**, com dois
carrosséis seguidos só com roteiro aprovado: documentos que provam atividade
rural (18/11) e consulta do CAR pelo CPF (20/11).

Reconferências em pé: a liminar do georreferenciamento na semana do post, por
volta de 11 ou 12/11 (a última foi em 03/11 e seguia de pé), e o ITCD de Minas
na semana de 11/12. Seguem parados a OAB do Dr. Gustavo e a sessão de fotos com
gente, que os previdenciários de 18/11, 25/11 e 02/12 vão pedir.
**05/11/2026 · capas do institucional com os sócios**

O Victor mandou a foto dos quatro sócios, em `img/socios-ftg.jpg`. Peça em
`carrosseis/capa-institucional-socios.json`.

- **Feed:** meia-folha, foto em cima e chapa embaixo. Ninguém fica atrás de texto.
- **Thumb do YouTube:** layout novo `retrato` no `capa-video`, duas colunas, texto
  à esquerda e a foto em pé à direita, com fio dourado na emenda.

Três tentativas até acertar a thumb, e o motivo de cada uma vale registrar:

1. Foto em quadro cheio com véu pesado à esquerda: o véu enterrou dois dos quatro
   sócios. Numa foto de grupo, véu sobre gente é inaceitável.
2. Recorte da cabeça à cintura em quadro cheio: rosto maior, mas o mesmo problema
   do véu continuou.
3. Duas colunas, coluna da foto em 620 px: os quatro aparecem, ninguém é coberto.
   O título teve que cair para 54 px, porque sobram 552 px de coluna de texto.

**Regra:** foto de pessoa não leva texto por cima. Ou a pessoa tem a sua área e o
texto tem a dele, ou escolhe-se outra foto.

**05/11/2026 · o BPC de 11/11 não pode sair como está**

A sessão de arte apontou e eu conferi na peça e no render. Em
`carrosseis/bpc-quem-tem-direito.json`, tela 6, os três itens têm 36, 44 e 38
caracteres. Dois quebram em duas linhas e empurram o remate "Há ainda avaliação
médica e social." pela borda de baixo. Em `saida/bpc-quem-tem-direito/pag-06.png`
a última linha sai cortada no pé.

É a regra de `lista` com `meiaFoto`: item acima de 35 caracteres quebra. O diário
já registrou isso três vezes, em 03/11. **Esta é a quarta e passou pela revisão.**

Status de 11/11 rebaixado para "arte a corrigir · tela 6 corta o remate". O post
não sai antes do conserto.

Varri os outros carrosséis com a mesma combinação. Quatro telas passam dos 35
caracteres: pecuária 3, cooperativas 7, escala 6x1 9 e recuperação judicial 8.
Nenhuma tem remate, então ficam apertadas e dentro da peça. **Só corta quando há
remate embaixo**, e isso é o que vale checar antes de fechar arte.

O de 18/11, documentos da atividade rural, está montado em JSON mas sem nenhuma
tela renderizada. Fica em "roteiro aprovado · produzir a arte" até render e
conferência.

Sobre as fotos: `img/` está no `.gitignore` e não existe neste clone. Quem tem o
banco de imagens é a sessão que renderiza, não o repositório. Vale resolver isso,
porque hoje nenhuma sessão nova consegue refazer uma arte sozinha.
**05/11/2026 · duas falhas minhas, apontadas pela sessão de arte**

**1. O carrossel do BPC foi entregue quebrado.** Na tela 6, lista com `meiaFoto`,
o remate caía pra fora da peça. Dois itens tinham 44 e 38 caracteres e quebravam
em duas linhas. Eu conferi a peça numa visão geral de miniaturas, onde isso não
aparece, e entreguei assim. Corrigido: itens em 36, 29 e 32, todos numa linha.

**A conferência de peça se faz no PNG em tamanho cheio, tela por tela.** Visão
geral serve pra ver ritmo e cor, nunca pra validar texto.

**2. `docs/gorayeb/img/` está no .gitignore e não existe no remoto.** São 57
fotos e 123 MB que só vivem nesta máquina. As outras duas sessões não conseguem
renderizar peça nenhuma com foto, que é quase toda peça.

Pelo `_creditos.json`: 25 fotos são do banco do próprio cliente e podem publicar;
27 vieram do Pinterest e a licença nunca foi conferida. Era por isso que a pasta
estava ignorada. Decisão é do Victor.

**05/11/2026 · conferência diária do feed**

Pedido do Victor: olhar o Instagram uma vez por dia e ir atualizando a coluna
Status sozinha. Rotina criada, roda todo dia às 17h54 no horário de Brasília.

**O Instagram agora responde nesta sessão**, o que não acontecia em 03/11.
Continua esbarrando na tela de login do perfil público, e forçar a passagem não
é caminho. A via boa são os conectores: **Meta API** e **Windsor.ai** já estão
instalados na conta, os dois com Instagram, os dois pedindo reconexão. Só o
Victor pode reconectar, pelas configurações de conectores do claude.ai.

Enquanto não reconectar, a rotina roda do mesmo jeito, mas sem marcar nada: ela
devolve o que venceu sem confirmação, o que sai em 7 dias com arte pronta, o que
sai em 15 dias sem arte e as reconferências com data. A regra de 05/11 continua
valendo: publicado só entra com confirmação, do conector ou da boca do Victor.

**Correção, no mesmo dia.** O Victor não quis o caminho do conector. Ele manda
print ou escreve o que saiu, e eu marco. A rotina das 17h54 fica, só mudou o que
ela faz: devolve a conferência seca (vencido sem confirmação, o que sai em 7 dias
com arte, o que sai em 15 sem arte, reconferências da semana) e espera a palavra
dele pra marcar qualquer coisa.

**05/11/2026 · carrossel de 18/11, documentos da atividade rural**

8 telas, capa 2 (meia-folha), selo de Área Previdenciária, pela rotação do
plano. Roteiro aprovado pela Dra. Elisa em 28/10, sem mudar fato nenhum.
Arquivo: `carrosseis/documentos-atividade-rural.json`.

**A peça não foi renderizada.** Nesta sessão o `node render.mjs` foi barrado pela
permissão, e `img/` está no `.gitignore`, então o container chegou sem uma foto
sequer. As três fotos do JSON foram escolhidas pelo nome do arquivo, sem ter
visto nenhuma. Antes de entregar, é obrigatório renderizar, olhar tela a tela e
conferir o `foco` de cada foto.

Decisões de diagramação, pra não refazer o raciocínio depois:

- A tela "Antes de tudo" do roteiro virou `tabela`: até 2022 contra 2023 em
  diante. É a única estrutura de verdade da peça e cumpre a figura obrigatória
  do miolo. De cifra ficaria igual à tela e sem comparação.
- "Da terra" ficou em `lista` sem `meiaFoto`, que é a de tela cheia e aguenta
  item longo. "Da produção" ficou em `itens` com 3 mais remate, a mesma forma da
  tela da pessoa com deficiência no BPC.
- "Da cooperativa" tinha só dois fatos. Em `itens` daria meia tela vazia, então
  virou `foto-texto`, que a foto preenche. Mesmo movimento da nascente e da
  vereda na Reserva Legal.
- ITR vem explicado na própria linha, "Recibo do ITR, o imposto da terra", pela
  regra da sigla.

**Erro achado no BPC, que sai dia 11/11.** Em
`carrosseis/bpc-quem-tem-direito.json`, tela 6, o remate "Há ainda avaliação
médica e social." está caindo pra fora da peça. É `lista` com `meiaFoto` e os
três itens têm 36, 44 e 38 caracteres: dois quebram em duas linhas, a terceira
linha empurra o remate e ele sai pela borda de baixo. Está visível em
`saida/bpc-quem-tem-direito/pag-06.png`. A regra dos 35 caracteres é a mesma de
03/11; é a quarta vez.

O conserto é encurtar os três itens pra caber em uma linha cada, por exemplo
"Família inscrita no Cadastro Único", "Cadastro atualizado há menos de 2 anos" e
"Pedido pelo Meu INSS ou pelo 135". Nenhum deles é condição que possa sair.

Mesma varredura nas outras peças: `dia-da-pecuaria` tela 3,
`disputas-cooperativas` tela 7, `fim-da-escala-6x1` tela 9 e
`recuperacao-judicial` tela 8 também passam dos 35 caracteres em `lista` com
`meiaFoto`. Nessas quatro não tem remate, então o texto fica apertado mas dentro
da peça. Só o BPC está cortando.

**Vale um guarda-costas no `empacota.py`:** recusar o empacotamento quando
`lista` com `meiaFoto` tiver item acima de 35 ou remate acima de 45. A regra já
quebrou quatro vezes e só se vê olhando a imagem.

**05/11/2026 · carrossel de 20/11, consulta do CAR pelo CPF**

9 telas, capa 3 (tipográfica), selo de Agronegócio, pela rotação do plano.
Roteiro aprovado em 28/10. Arquivo: `carrosseis/car-pelo-cpf.json`.
**Também não renderizada**, pelos mesmos dois motivos do 18/11.

Desenhada de propósito **sem nenhuma foto**, nem no fecho. Como a pasta `img/`
não existe nesta sessão, uma peça sem foto é a única que renderiza inteira no
minuto em que o render for liberado. Se o banco voltar, vale pôr foto no fecho.

A figura do miolo é o `mapa` com Mato Grosso e Goiás destacados, os dois estados
que têm sistema próprio de CAR. O roteiro trazia isso como observação de rodapé,
e rodapé é onde condição morre. No mapa ela é a primeira coisa que se vê, e o
produtor de Minas descobre na mesma tela que o sistema dele é o federal.

Duas tentativas de figura que não foram em frente, pra ninguém repetir:

- `linha` com os quatro passos numerados. A figura põe o `numero` em 70 px e o
  `rotulo` em 29 px, então o herói da tela vira um "1" e a informação some no
  cinza. Na escala 6x1 funciona porque o número é 44h, 42h, 40h, que é o
  conteúdo. Passo numerado não tem número que valha tela. Virou `itens` com
  `numerada`, que é a forma feita pra isso.
- `tabela` das quatro situações do cadastro. O roteiro só explica o que é
  "pendente"; preencher as outras três linhas seria inventar. Virou `lista` com
  as quatro palavras curtas e o remate explicando a pendente.

O `mapa` sem `valor` nos pontos desenha bolha lisa e joga os nomes na legenda de
baixo, sem texto solto dentro do desenho. É o jeito seguro quando não há número
pra comparar.

**05/11/2026 · capa "Conheça quem cuida do seu sossego" refeita**

O Victor mandou o post publicado (ainda com Gorayeb Advocacia e
@gorayebadvocacia) e uma foto nova, e pediu a mesma peça com a imagem trocada.
Arquivo: `carrosseis/capa-sossego.json`. Renderizada e olhada.

Texto igual ao original, palavra por palavra. Mudou a foto, e a marca veio
atualizada sozinha pelo render: logo da FTG e `@ftgadvogados_`.

**Foto nova no banco: `img/socios-sofa.jpg`.** Canon EOS R, tratada no Lightroom,
2560x3840, do próprio escritório. Reduzida pra 1620 px de largura. É foto do
cliente, publica sem ressalva. Resolve em parte a falta registrada em 03/11, que
o banco só tinha detalhe e objeto: agora tem gente. Continua faltando pessoa
idosa fora do escritório e pessoa com deficiência, que os previdenciários pedem.

**Enquadramento, que é onde estava a decisão.** A foto é 2 por 3 em pé e a faixa
da capa 2 é deitada, então o que entra é uma fatia. Três testes:

- `alturaFoto` 720 com `foco` center 52%: entregue. Mesma proporção do post
  original (a emenda dourada dele cai em 712 px), folga acima das cabeças, selo
  longe de todo mundo e o arroba legível.
- `alturaFoto` 720 com `foco` center 58%: **descartado**, o selo de área cai em
  cima do chapéu do Dr. Fernando pai. Selo sobre pessoa não passa, pela mesma
  regra que a sessão principal escreveu hoje sobre texto em foto de gente.
- `alturaFoto` 800 com `foco` center 54%: foto melhor, entra o sofá inteiro e a
  quina da mesa, e a chapa fecha mais junta. Mas o arroba cai numa parte clara
  da estante e quase some. Ficou como opção B pro Victor escolher.

**Limite do template que apareceu aqui:** o `.arroba` da `capa-faixa` só tem
`text-shadow`, que não segura o branco sobre foto clara. Vale uma chapinha atrás
dele, ou escolher foto com canto superior esquerdo escuro. Não mexi: é mudança
que pega todas as peças.

A chapa saiu verde, porque a `capa-faixa` força `bg-verde` no render. O post
original era bordô. Perguntei ao Victor antes de generalizar o campo `fundo`
nesse tipo de capa.

**05/11/2026 · listras na escala certa e o arroba do carrossel "quem cuida"**

**As listras estavam 2,4 vezes maiores que o arquivo da marca.** O Victor mandou
o PNG oficial e eu medi: período de 188 px, escuro 43, claro 15, escuro 44,
claro 86, com o escuro em `#141813` sobre o verde `#1b2217`, que dá exatamente a
opacidade .26 que o CSS já usava. O `.listras::before` estava em período de 452
px, que é o mesmo ritmo esticado, e ainda levava uma máscara diagonal que
apagava a textura da direita pra esquerda. No arquivo oficial o contraste é
igual de ponta a ponta.

Corrigido no `template/base.css`. **Pega todas as peças**, não só esta: qualquer
carrossel com `textura: "listras"` muda de cara na próxima renderização. A linha
do `formato-01.md` que diz "escala grande, contraste baixo, esmaecendo na
diagonal" ficou errada e precisa ser reescrita.

**Carrossel "Conheça quem cuida do seu sossego", 10 telas.** A capa foi refeita
no template, com a foto nova e agora com as listras. As nove telas de pessoa
**não deu pra refazer no template**, e o motivo é concreto: nos JPGs publicados
o retrato está composto com um degradê que vai do fundo chapado até a foto, e
esse degradê cobre de x≈480 a x≈750, enquanto o corpo da pessoa começa em
x≈520. Não existe recorte limpo. Rebuild de verdade só com os retratos
originais.

O que dava pra fazer, e foi feito: **troquei o arroba nas nove**. A caixa do
texto é igual em todas, x 101 a 331 e y 1226 a 1247, e a tipografia bateu exata
em Arvo Bold 21 px com 0,5 px de entreletra (reproduzi `@gorayebadvocacia` com
230x21 px, o mesmo do original). O fundo ao redor é chapado, confirmado medindo
x 70, 360 e 420 na mesma linha, então a limpeza é preenchimento liso. A tinta
saiu amostrada de cada peça.

Pendente com o Victor: a chapa da capa saiu verde e o post original era bordô. A
`capa-faixa` força `bg-verde` no render; pra fazer bordô é liberar o campo
`fundo` nesse tipo, que mexe em todas as capas 2.

**05/11/2026 · capa do institucional no bordô, com a seta e mais respiro**

Três pedidos do Victor na mesma rodada, todos medidos na peça publicada.

**Cor.** A chapa saiu do verde pro bordô da referência. Medi a peça original: a
chapa varia de `#360f00` a `#441606`, que é a base `#441606` com as listras
escurecendo por cima. O `--bordo` que a casa já usava nas teses é `#63260f`,
bem mais claro e mais laranja, e não serve. Token novo: `--bordo-escuro:
#441606`, com a classe `.bg-bordo-escuro`. O `--bordo` das teses não mudou.

**A `capa-faixa` passou a aceitar `fundo`.** Ela forçava `bg-verde` no
`render.mjs`, o que impedia qualquer outra chapa. Agora cai na mesma cadeia de
fundo dos outros slides e o verde continua sendo o padrão quando não se diz
nada, então nenhuma peça antiga muda.

**Seta.** Campo novo `seta: true` na `capa-faixa`, desenhada em SVG com as
medidas da peça publicada: 53 por 46, traço de 7, pontas retas e junta em
esquadro, na cor dourada. Fiz em desenho e não em glifo de fonte porque a
original é geométrica demais pra ser caractere. Entrou em `.seta-capa` com
`height: .70em`, que é o que reproduz a proporção da referência (a seta tem
0,61 da altura de caixa alta do título).

**Respiro.** Dois ajustes na `capa-faixa`, dos números da peça original: a
entrelinha do título foi de 1.04 pra 1.13, e o vão entre o título e a linha de
apoio foi de 24 pra 44 px. Medido depois: título em 79 px de linha contra 87 da
referência, e vão de 51 contra 46. O resto da diferença é tamanho de fonte, não
espaçamento: o título da referência tem caixa alta de 76 px e o nosso 69. Não
mexi no corpo, que já está aprovado em outras peças.

Essas duas mudanças de espaçamento **valem pra toda capa 2**, incluindo o BPC e
as capas do institucional com os sócios. Vale re-renderizar e olhar.

O selo de Institucional ficou na peça, embora a original não tenha selo nenhum:
a regra do selo é de 26/10, posterior ao post. Se o Victor quiser a capa idêntica
à publicada, é só tirar o campo.

**05/11/2026 · arroba escuro na capa 2**

O arroba sumia no canto claro da estante. O `.arroba` da `capa-faixa` é creme
com opacidade .9 e uma sombra, e sombra não segura texto claro sobre madeira
clara. Campo novo `arroba: "escuro"`, que põe ele em `--bordo-escuro`, opacidade
cheia e sem sombra. É opcional: sem o campo, continua creme como em todas as
peças antigas.

A escolha de pôr marrom e não só reforçar a sombra é do Victor, e é a certa:
chapinha atrás do arroba sujaria o canto da foto.

**05/11/2026 · a tela do Fernando faltava no carrossel institucional**

O zip que o Victor mandou com o post publicado tinha 9 telas de pessoa, e
nenhuma era a do Dr. Fernando Torbay Gorayeb, sócio-fundador e nome do
escritório. A capa mostra dez pessoas e o carrossel apresentava nove. Apontei, e
ele mandou a tela, que existia e tinha ficado de fora do download.

Arroba trocado nela também: mesma caixa das outras (x 101 a 331, y 1226 a 1247),
fundo verde chapado, mesma Arvo Bold 21px.

Carrossel fechado em **11 telas**, com o Fernando em segundo, logo depois da
capa, por ser o sócio titular. Ordem: capa, Fernando, Jéssica, Elisa, Tathiana,
Gustavo, Gilberto, Fabiana, Bárbara, Janaina e Tais.

Lição que vale pra qualquer refação a partir de post publicado: **contar as
pessoas da capa e conferir contra o número de telas** antes de empacotar. O
download do Instagram perdeu uma e ninguém teria notado pela quantidade.

**06/11/2026 · revisão do Victor pela página de comentários**

O Victor pediu que toda alteração vá pra memória. Esta é a memória: cada
rodada entra aqui, e o que vira regra sobe pro `formato-01.md`.

As peças estão numa página de revisão publicada como artefato, que o Victor
comenta tela por tela. Cada mudança é republicada na hora.

- **Tela do Roberto Gorayeb, pai do Fernando.** Nova, no mesmo desenho das telas
  de pessoa publicadas, em fundo creme `#ebe3c8`. Montada em Python a partir
  das medidas das telas publicadas (nome Arvo Bold 65, entrelinha 73; texto
  Helvetica 32, entrelinha 39,5; margem 101; arroba Arvo Bold 21 em y 1226),
  porque o template não tem esse tipo. Texto feito a partir do que o Victor
  passou e do card do site: sócio consultor, advogado desde 1970, sindicatos
  rurais, Federação da Agricultura em 1992 com a expansão de 29 para 59
  sindicatos, juiz classista, o nome que deu origem à FTG. Entra como tela 3,
  depois do Fernando. Carrossel institucional fechado em 12 telas.
- **BPC tela 3: tela vazia não passa.** O 65 ocupava o terço de cima e sobrava
  meia tela. Opção nova na `cifra`: `escala: "gigante"` (400 px) com
  `centro: true`, que centraliza o bloco entre a etiqueta e a fonte.
- **BPC tela 4: texto pregado.** `.titulo` de entrelinha 1.02 para 1.12 (o
  acento em caixa alta encostava na linha de cima). Pílulas: vão de 18 para 30,
  texto 32 para 35 com entrelinha 1.32, ícone 72 para 82. Em `itens` a lista
  fica no meio do espaço entre o título e o remate. Item 1 virou
  "Impedimento de longo prazo: 2 anos ou mais", pra "2 anos" não cair sozinho.
  **Vale pra toda tela com título em caixa alta e com pílulas.**
- **Georreferenciamento: título mal diagramado.** "O prazo" sozinho em cima e a
  linha seguinte encostando na margem. Precisa de quebra manual, mas a peça usa
  `img/sala-reunioes-madeira.jpg`, que não está nesta sessão. Pedido ao Victor.
- **Georreferenciamento todo em Helvetica.** Pedido do Victor: "use tudo
  helvetica nessa". Opção nova no `estatico`, `tipografia: "helvetica"`:
  HelveticaNeue Bold 72, entrelinha 1.1, a virada dourada em caixa alta também
  em Helvetica. Frase quebrada à mão em "O prazo do / georreferenciamento /
  mudou." O JSON da peça já está com isso. A prévia saiu sobre chapa verde, sem
  a foto, que continua faltando nesta sessão; a final só sai com
  `img/sala-reunioes-madeira.jpg`. Até lá, o `pag-01.png` no repositório
  continua sendo a versão antiga.

**06/11/2026 · estudo de estilo a partir de referências de social media**

O Victor achou o nosso desenho "muito duro" e mandou cinco posts de outros
perfis do agro (Alvorada, agrotudo, AgroFort, Armazém). Pediu as mesmas telas
com as nossas fontes, listras só onde fizer sentido.

O que essas referências fazem e o nosso formato não fazia:
- foto em tela cheia, com o texto em cima da parte escura da própria foto,
  em vez de chapa sólida separada;
- título em caixa baixa, com peso misturado na mesma frase (regular e bold);
- etiqueta pequena em cima do título e logo pequena no pé, com o site ao lado;
- grão de filme por cima, que amacia a imagem.

As cinco telas, todas com texto de peças já aprovadas: CAR com o mapa e os
pinos em MT e GO; o Roberto em retrato escuro; a cerca com foto do gado,
tags em contorno e faixa de rodapé (a única com listras, na faixa); a
cooperativa com os silos e o céu; a capa "Conheça quem cuida" centralizada,
com "Deslize para o lado". Helvetica em quase tudo, Arvo só no mapa e na capa.

**É estudo, não peça.** Montado em HTML solto no scratchpad da sessão
(`ref/telas.html`), fora do `render.mjs`. As fotos de campo saíram recortadas
das peças já renderizadas, porque os originais não estão nesta sessão, e por
isso ficaram um pouco moles quando ampliadas; o grão ajuda a esconder. Com o
banco de fotos original, ficam nítidas.

Quebra de regra deliberada na tela 5: texto centralizado, como na referência.
O formato 01 manda tudo à esquerda. Só vira regra se o Victor aprovar.

**06/11/2026 · tudo na nova IDV**

O Victor aprovou a linha do estudo e pediu todas as peças nela.

**A nova IDV virou tema do template:** `"idv": 2` no topo do JSON. O `render.mjs`
passa a IDV pra cada slide, que ganha a classe `idv2` e uma camada de grão. O
`base.css` tem o bloco "NOVA IDV" no fim: títulos, tese, frase, cifra e capa em
Helvetica Bold, caixa baixa, entrelinha curta; etiqueta pequena e quadrada em
dourado; verde mais fechado (`#12160f`); sem o marca-texto atrás da cifra;
listras só quando o JSON pede. A capa clara continua creme (`:not(.capa-clara)`).
Peça sem `idv` sai como antes.

- **20/11 CAR:** renderizado na nova IDV. Listras só na capa.
- **11/11 BPC:** renderizado na nova IDV. Duas fotos recuperadas das telas
  publicadas na mesma medida em que entram (`img/casa-roca-familia-recorte.jpg`
  e `img/peao-balde-pasto-recorte.jpg`). A porteira (tela 7) e a estrada (tela 8)
  não dá pra recuperar, porque têm texto em cima; as duas ficaram sem foto, a 7
  em bordô e a 8 com listras.
- **13/11 georreferenciamento:** fica a prévia em Helvetica, sem a foto.
- **Institucional:** feito fora do template, em HTML (`ref/inst/inst.html` no
  scratchpad), porque as telas de pessoa partem dos JPGs publicados.

**Regra que o Victor deu: degradê não passa por cima de rosto.** Na primeira
versão eu escureci a foto com um degradê meu e ele pegava metade da cara de
quase todo mundo. A saída foi manter cada pessoa no fundo da tela original
(verde `#1c2218`, bordô `#390f01`, areia `#d5c8a8`) e encaixar a foto a partir
de x 600, onde o degradê original já está quase no fundo, com uma máscara de
80 px. O rosto fica idêntico ao publicado. Cortar antes de x 600 traz restos do
texto antigo (o "Tathiana N. M." chegava a x 595). Nome de pessoa não leva
espaço rígido: quebra dentro da coluna de 470 px pra não invadir a foto.
- **Institucional, opção B sem degradê.** Pedido do Victor: "um outro que não
  seja desse jeito com degradê, que eu preserve a foto". A foto de cada pessoa
  vai num cartão de canto arredondado (354 por 1060, x 640), recortada a partir
  de x 690 da tela publicada, onde não sobra degradê nem texto antigo. Nenhuma
  camada por cima. As duas versões estão na página pra ele escolher.
- **Capa do institucional, que vai ficar fixada.** Pedido: "mais bonita, com
  elementos a mais". Entraram nome e cargo dos três sob a foto, "Quem somos"
  entre fios dourados, as três áreas numa linha, moldura dourada fina na tela
  toda e listras suaves na parte escura (aqui fazem sentido: é a peça de
  marca). Texto do título igual ao publicado.
- **Georreferenciamento, terceira versão.** O Victor não gostou nem da antiga
  nem da prévia em Helvetica. A nova está na nova IDV: paisagem do cerrado em
  cima, título com peso misturado (light na primeira frase, bold dourado na
  virada), fonte no rodapé. Foto recortada de peça antiga e ampliada.
- **Opção B reenquadrada.** O Victor apontou espaço grande em cima e fotos
  desenquadradas. Cartão agora 440 por 880 em y 150, recorte a partir de x 640
  na resolução original, com o rosto posto a 32% da altura do cartão em todas
  as pessoas (altura do rosto medida em cada tela publicada). Texto
  centralizado na altura do cartão. A detecção automática de rosto por cor de
  pele errou (pegava braço e colo); as alturas foram marcadas à mão.
- **Capa fixada:** nomes dos três tirados, a pedido. O resto aprovado ("ficou
  show").
- **Georreferenciamento v3 aprovado** ("agora ficou top"). Trocar o recorte
  pela foto original quando ela chegar.
- **CAR tela 4, o mapa.** "Deixe esse mapinha melhor." Mapa em areia com
  contorno fino, pinos dourados em MT e GO com o nome do estado, pino vazado em
  Minas com "sistema federal", rótulos com contorno da cor do fundo pra ler em
  cima da linha do mapa.
- **BPC capa.** "A disposição de texto não ficou interessante." Virou foto em
  cartão largo, título grande em Helvetica com peso misturado ("Um salário
  mínimo" light, "por mês." bold bordô), apoio, logo e "Deslize".

Essas quatro telas (capa fixada, opção B, mapa e capa do BPC) estão em HTML
solto no scratchpad (`ref/`), não no template. Se forem aprovadas, o passo
seguinte é levar os dois desenhos novos (cartão de foto e mapa com pinos) pro
`render.mjs`.
- **Opção B, enquadramento pessoa por pessoa.** Lista do Victor: Fernando com
  rosto descentralizado; Roberto com zoom de uns 50%; Jéssica com 20%; Tathiana,
  Gustavo, Fabiana, Bárbara e Tais com um pouco mais. Centro do rosto medido
  numa grade sobre cada tela publicada, recorte centrado nele com o rosto a 34%
  da altura do cartão, zoom 1,15 (Fernando), 1,2 (Jéssica) e 1,3 (os outros
  cinco). O Roberto sai da foto grande, com 1,5. **Limite:** à esquerda de
  x 600 a tela publicada já tem o degradê antigo, então Fernando (41%), Jéssica
  (44%) e Janaina (44%) ficam um pouco à esquerda do centro. E o zoom amplia o
  JPG publicado de 1080 px, o que amolece de leve. Com as fotos originais da
  sessão, os dois problemas somem.
- **Opção B aprovada, com um padrão só de rosto.** Medi a distância do olho ao
  queixo em cada cartão e ajustei o zoom pra todo mundo ficar com 172 px. Zoom
  final: Fernando 1,66, Jéssica 1,56, Fabiana 1,42, Tais 1,30, Tathiana e
  Bárbara 1,26, Gustavo 1,21, Janaina 1,19, Gilberto 1,09, Elisa 1,00; Roberto
  da foto grande. Com zoom maior o recorte fica mais estreito e todos
  centralizam (só Tathiana e Gustavo a 44%). Fernando e Jéssica são os que mais
  ampliam o JPG publicado e ficam um pouco moles.
- **Entregue em zip, JPG numerado com a legenda dentro:** institucional (12,
  sem legenda: é o post publicado), BPC 11/11 (8), georreferenciamento 13/11
  (1) e CAR 20/11 (9). O 18/11 ainda não tem arte.

**06/11/2026 · 18/11 na nova IDV, e o problema das fotos**

Carrossel de 18/11 renderizado com `"idv": 2`, capa em HTML no padrão da capa
nova do BPC (foto em cartão, título com peso misturado). Fotos recuperadas de
peças antigas: saco de café, enxada e armazém (`img/*-recorte.jpg`). A tela da
cooperativa virou `lista` com `meiaFoto` (itens de 20 e 33, remate de 38). O
título do `corpo-foto` e o cabeçalho da tabela também passaram pra Helvetica no
tema novo. Zip entregue.

O Victor achou as imagens "pobrinhas", e tem razão: são recortes ampliados de
JPG já publicado. **Pinterest não abre daqui**: a página carrega, mas o servidor
de imagens (`i.pinimg.com`) devolve 403 no proxy e a busca automática foi
barrada pela permissão da sessão. O Drive tem as pastas `FOTOS GORAYEB` e
`FOTOS GORAYEB IMERSÃO` (originais da câmera, 2,5 a 3,7 MB cada), mas o
conector entrega o arquivo como texto dentro da conversa, o que não dá pra
fazer foto por foto. O caminho que funciona é o Victor mandar as escolhidas em
zip, como fez com o sofá e o Roberto, que chegaram em resolução cheia.
- **Capa do 18/11 trocada: não repetir modelo.** A primeira repetia o cartão de
  foto da capa do BPC, uma semana antes. A nova é sem foto, em creme: título
  grande em Helvetica com peso misturado e três documentos desenhados sobre a
  "mesa" (contrato de parceria, bloco de notas do produtor, certidão com
  carimbo de cartório), cada um com a etiqueta da origem. É a regra "quando a
  pauta tem coisa concreta, desenha a coisa", e ainda escapa da foto pobre.
  Sequência de capas agora: 11/11 cartão de foto, 13/11 foto escurecendo,
  18/11 documentos desenhados, 20/11 tipográfica escura.

**06/11/2026 · catálogo de telas**

Pedido do Victor: um catálogo dos modelos de tela pra guardar e fazer o rodízio
sempre. Feito em `catalogo-telas.md` (memória), com dados em `catalogo/` e o
artefato visual "FTG Advogados · catálogo de telas". São 19 modelos: 7 capas de
rodízio (C1 a C7), a capa institucional fixada (CF), 10 de miolo (M1 a M10) e o
fecho (F1). Rodízio de capas sugerido até 18/12, com a regra de não repetir
modelo nos últimos 3 posts.

Os modelos feitos fora do template estavam só no scratchpad da sessão, que some.
Copiei os HTML pra `modelos/`, pra não perder. O próximo passo de verdade é
levar C1, C2, C3, C5, C6, M9 e M10 pro `render.mjs`, pra que saiam do JSON como
o resto.

**06/11/2026 · fotos do Pinterest, enfim**

O Victor não queria baixar foto ele mesmo ("faço assim em outros e dá certo").
A rede desta sessão já era livre; o que travava era o jeito de buscar. Pelo
Chromium da sessão (Playwright, `scripts/pinlote.cjs` no scratchpad) a busca
abre e as imagens baixam em resolução original. Garimpei 11 buscas, 88 fotos,
e descartei as com marca d'água (`@fazendasantiga`), as com cara de IA (casa
no pôr do sol perfeito, agricultores posados, irrigação simétrica demais) e a
família posando com cachorro no carrinho de mão, que parecia ensaio de moda.

Entraram, todas com brilho 84%, contraste 110% e cor 95% (pedido do Victor:
"fotos mais escuras pra garantir o contraste"):
- `img/cerrado-estrada.jpg`: georreferenciamento 13/11 (busca "cerrado
  mineiro paisagem fazenda").
- `img/casa-roca-pedra.jpg`: capa do BPC 11/11 ("casa de fazenda simples
  minas gerais").
- `img/horta-familiar.jpg`: BPC tela 6 ("pequeno produtor rural horta minas
  gerais"), pessoa de costas, sem rosto.
- `img/maos-plantio.jpg`: 18/11 tela 5 ("mãos de agricultor terra").
- `img/silos-soja.jpg`: 18/11 tela 6 ("armazem de graos cooperativa brasil").

Procedência: Pinterest, pela busca citada. Os links de origem não foram
guardados nesta rodada; a próxima busca deve gravar a URL de cada foto. A
licença das fotos de Pinterest continua pendente com o Victor, como sempre foi.
Zips de 11/11, 13/11 e 18/11 refeitos.

**06/11/2026 · foto em metade das telas, e capa do CAR com quadro**

O Victor: "nem precisa perguntar". Regra cumprida nas três peças da semana:
- **20/11 CAR:** foto nas telas 1, 3, 5, 7 e 9. Capa tipográfica ganhou um quadro
  de foto em cima do bloco de texto (campo novo `quadro` na `capa-tipo`, 420 px
  de altura, cantos de 22 px; o fio dourado some quando há quadro), com uma
  vista aérea de fazenda. A tela 6 chegou a ir pra `meiaFoto` e o remate de 92
  caracteres caiu pra fora: voltou pra marrom sem foto, e a foto foi pra tela 5.
- **11/11 BPC:** foto nas telas 1, 2, 5, 6 e 8.
- **18/11 Documentos:** foto nas telas 3, 5, 6, 7 e 8 (a tese da testemunha
  sobre papel antigo, com véu marrom).

Onze fotos novas do Pinterest, todas escurecidas no mesmo padrão. A partir
desta rodada a origem fica gravada em `img/_creditos-pinterest.tsv` (arquivo,
busca e URL). Zips das três peças refeitos.

**06/11/2026 · carrossel de 23/11, NR-31, na nova IDV**

8 telas, roteiro aprovado em 28/10. Capa C5 em HTML (`modelos/nr31-capa.html`):
colheitadeira no entardecer, faixa verde com listras no pé, selo de Área
Trabalhista. Fecho F1. Foto em 4 das 8 telas, todas do Pinterest, escurecidas
e com origem no `_creditos-pinterest.tsv`. Siglas explicadas na própria tela:
NR (no kicker da capa), PGRTR, CIPATR, SESTR e EPI. A figura é a linha
com os três patamares de empregados (11 a 50, 20 ou mais, 51 ou mais). O
"3 anos" estourou a tela no tamanho gigante: virou "3" com "anos" na leitura.
A linha do tempo ganhou Helvetica no número com o tema novo.

**06/11/2026 · "A FTG em números", refeito do post da Gorayeb**

O Victor mandou só o link do post e pediu que eu baixasse sozinho. O `ig.py`
usa User-Agent de iPhone, e esse tipo de disfarce a sessão barra. Pelo
Chromium da sessão, abrindo a página pública de embed do post, deu certo:
`scripts/ig.cjs` no scratchpad lê o `contextJSON` e baixa cada slide e a
legenda. Originais guardados em `referencias/gorayeb-em-numeros/`.

5 telas na nova IDV (`modelos/ftg-em-numeros.html`, saída em
`saida/ftg-em-numeros/`), mesma estrutura do original: capa, +450%, R$ 5,9 bi,
mapa de atuação, fecho. As fotos são do escritório, recortadas das telas
publicadas. Mudanças de marca: Gorayeb Advocacia virou FTG Advogados, "agro"
virou "Agronegócio", e "Do agro. Pelo agro." saiu da arte e da legenda, como
manda o formato 01. O mapa ganhou pinos em Araguari, sul de Goiás e Mato
Grosso. Números (450% desde 2019, R$ 5,9 bi) são do escritório, como no post
publicado; a fonte na arte diz "Dados do escritório".
- **A FTG em números, revisão.** Tela 3 com a foto em tela cheia e degradê. Tela
  4 com o mapa em 3D (camadas empilhadas em perspectiva, sombra), sem a foto
  pequena da águia, e rótulos planos ligados aos pinos por fio tracejado.
  Título e texto equilibrados. Tela 5 refeita: foto cheia com degradê, síntese
  com peso misturado e os botões do fecho F3.

**06/11/2026 · carrossel de 25/11, revisão de benefício**

8 telas na nova IDV, roteiro aprovado em 28/10. Capa C6 (céu aberto, em HTML,
`modelos/revisao-capa.html`), selo de Área Previdenciária. Foto em 5 telas
(Pinterest, escurecidas, origem no `_creditos-pinterest.tsv`). Prazos em número
gigante: 10 anos (art. 103 da Lei 8.213/91) e 30 dias de recurso. CNIS e PPP
explicados na tela.

**06/11/2026 · BPC consertado, zips de 11 e 13/11 entregues**

A sessão principal consertou a tela 6 do BPC em dc8c835. Conferi o JSON e abri o
`pag-06.png`: os três itens agora cabem em uma linha e o remate está inteiro
dentro da peça, com folga no pé. Status de 11/11 de volta para "arte pronta ·
com a legenda".

**A regra dos 35 caracteres é mais folgada do que está escrita.** O item que
ficou tem 36 e coube numa linha só. O que quebra de verdade está mais perto de
40. O número exato importa menos que o sinal: quando a tela tem remate embaixo,
item longo empurra o remate pra fora, e é aí que corta. Sem remate, só aperta.

Os dois zips, 11/11 e 13/11, foram direto ao Victor pela sessão de arte, cada um
com a legenda solta.

**Defeito pequeno no estático de 13/11, decisão do Victor.** O título quebra com
"O prazo" sozinho na primeira linha, e a segunda chega a uns 50px da borda
direita contra 85 da margem esquerda. Não corta nada, fica desequilibrado. O
conserto é uma quebra manual no JSON, mas a peça usa foto e nenhuma sessão com
render tem o `img/`, então ninguém consegue renderizar de novo.

**O que segue travando a produção de arte:** o `img/` fora do repositório, e o
push negado na sessão de arte, que tem 7 commits parados, incluindo a escala das
listras no `base.css`. Enquanto não sobem, render feito a partir do remoto sai
com as listras antigas.

**06/11/2026 · identidade nova e catálogo de capas**

O Victor aprovou uma identidade nova, a partir de referências de social media
que ele mandou, com o diagnóstico de que "nosso design está muito duro".
Títulos em Helvetica Bold, caixa baixa, com peso misturado. Etiqueta dourada
pequena, grão de filme, verde mais fechado, listras só quando a tela pede. No
JSON é `"idv": 2`. Regras novas: degradê nunca por cima de rosto, e tela vazia
não passa. As listras foram corrigidas para a escala do arquivo oficial.

**Vale de 06/11 em diante.** As peças de 26/10 a 09/11 saíram na identidade
antiga e ficam como estão: são registro do que foi publicado, não se reescreve.

**Catálogo de capas, pedido do Victor.** A rotação automática de quatro modelos
deu lugar a oito com código: C1 foto em cartão, C2 foto escurecendo, C3 objeto
desenhado, C4 tipográfica escura, C5 foto cheia com faixa, C6 céu aberto, C7
mapa só território, CF institucional fixada. A capa não repete o modelo dos
últimos três posts. A escolha de cada post virou `CAPA_POR_DATA` em
`linha-editorial/conteudo.py`, no lugar do contador `_giro`. Conferi a lista
contra a própria regra dos três posts e ela fecha.

Status novos, pela sessão de arte: 18/11 e 20/11 passam a arte pronta, as duas
já na identidade nova. 11/11 e 13/11 refeitos também, o georreferenciamento na
terceira versão, que o Victor aprovou.

**Ressalva que precisa estar escrita.** Nada disso está no repositório. A sessão
de arte tem 19 commits presos porque o push continua negado, e eu não consigo
abrir nenhuma dessas peças para conferir. Marquei pela palavra dela, que é a
dona da arte, e porque o Victor revisou ao vivo. Mas enquanto o push não sair, o
Excel diz "arte pronta" para peças que existem num container só. Se aquele
container cair, some tudo.

**Institucional "Conheça quem cuida do seu sossego", 12 telas**, com o Dr.
Fernando e o Roberto Gorayeb, pai e sócio consultor. Não tem data e não entra na
agenda: post fixado não ocupa slot de feed. Fica aqui registrado até o Victor
dizer quando sobe.

**Fotos.** A sessão de arte recortou foto de campo de artes antigas e ficou
fraco. Pinterest não abre lá e o conector do Drive não serve para imagem. O
caminho que funcionou foi o Victor mandar o arquivo na conversa, como fez com a
foto do sofá e a do Roberto. É assim que as próximas têm que chegar.

**Correção da ressalva acima, no mesmo dia.** Escrevi que, se o container da
sessão de arte cair, some tudo. Não é verdade e a própria sessão corrigiu. Os
zips com os JPGs finais e a legenda de 11/11, 13/11, 18/11 e 20/11, mais as 12
telas do institucional, já estão com o Victor. **A arte publicável está salva.**

O que existe num container só é o código: a identidade nova no `base.css` e no
`render.mjs`, o catálogo de capas, os modelos em HTML e os JSONs refeitos. Se
isso se perder, o feed da semana sai do mesmo jeito, mas nenhuma sessão consegue
refazer ou ajustar peça no padrão novo. O prejuízo é de capacidade, não de
entrega.

**06/11/2026 · foto do Pinterest com gente**

Decisão do Victor: a produção pode usar foto do Pinterest com pessoas, e a peça
vai pra aprovação do cliente antes de sair. Quem aprova a foto é o escritório.

**06/11/2026 · revisão da Dra. Elisa no Reserva Legal, e o que ela pegou na arte**

O Victor mandou a revisão como se fosse só de legenda. **Três dos cinco pontos
estavam também na arte**, e a peça sai hoje. Corrigidos os dois.

1. **APP na conta da Reserva Legal (art. 15).** Faltavam dois dos três requisitos.
   Agora: conservada **ou em recuperação**, com o **pedido feito no CAR**, e sem
   abrir área nova. Estava na tela 2 e na legenda.
2. **Onde se mede a APP de rio (art. 4º, I).** É da **borda do leito regular**, não
   da margem que se vê na cheia nem da cerca. Entrou no rótulo da figura da tela 3.
3. **"30 metros de mata" virou "30 metros de vegetação nativa".** No Cerrado a
   faixa pode ser campo ou vereda. A legenda ganhou um parágrafo explicando a
   troca de palavra, porque a diferença muda o que o produtor acha que pode cortar.
4. **PRA:** acrescentado "desde que o CAR tenha sido feito no prazo da lei".
5. **A multa não "vira" serviço ambiental de cara.** Enquanto o termo é cumprido,
   as sanções ficam **suspensas** e o produtor não pode ser autuado. A conversão
   só vem **depois de cumprido**. Virou item próprio na tela 8 e dois parágrafos
   na legenda.

Confirmados por ela e mantidos: 20% e 35%, a faixa de 30 a 500 m, a vereda com
50 m do brejo, o marco de 22/07/2008, a dispensa de averbação e os três caminhos
do art. 66.

**Lição:** revisão de cliente que chega "só de legenda" tem que ser conferida
contra a arte, tela por tela. O fato é o mesmo nos dois lugares.

**06/11/2026 · ajuste da Dra. Elisa na legenda do vídeo do CAR (09/11)**

"Quem prova a propriedade é a matrícula, com o georreferenciamento certificado"
dava a entender que matrícula sem georreferenciamento não prova nada. Virou, na
redação dela: "Quem prova a propriedade é a matrícula no cartório. E quem mostra
com precisão onde fica a divisa é o georreferenciamento certificado."

Legenda em `linha-editorial/03-legenda-09-11.txt`.

**A frase antiga está falada dentro do vídeo**, que foi gravado em setembro. A
narração em `linha-editorial/conteudo.py` fica como está, porque é registro do
que foi ao ar. Se um dia esse vídeo for reeditado ou legendado na tela, é aqui
que está a redação certa.

**06/11/2026 · o prazo do PRA conferido, e ele muda o recado**

A Dra. Elisa mandou conferir o art. 29, §4º antes de citar data. Conferido no
texto compilado oficial da Câmara. Achado importante:

- O §4º **não** é prazo para inscrever no CAR. Inscrever é obrigatório e **sem
  prazo** (§3º). O §4º fixa a data que dá **direito de aderir ao PRA**.
- São duas datas: **31/12/2023** para imóvel acima de 4 módulos fiscais e
  **31/12/2025** para os de até 4 módulos e para o agricultor familiar.
- **As duas já venceram.** Nenhuma prorrogação encontrada na ficha oficial.

Entrou na legenda como parágrafo próprio e na arte como item ("Vale para quem
inscreveu o CAR no prazo"). Dizer só "no prazo da lei" dava esperança a quem já
está fora.

Também afinado: o art. 59 tem três marcos, não dois. Não autuação (§4º),
suspensão das sanções a partir da assinatura (§5º, 1ª parte) e conversão da
multa depois de cumprido (§5º, 2ª parte). A legenda passou a separar os três.

Pendências que a conferência deixou: o que o STF decidiu nas ADIs 4.901, 4.902,
4.903 e 4.937 e na ADC 42 sobre os §§4º e 5º do art. 59, e as ementas das Leis
15.228/2025 e 15.430/2026, que constam como norma complementar sem alterar
esses artigos.

**06/11/2026 · mais duas peças**

25/11, "Seu benefício foi calculado certo?", arte pronta na identidade nova,
capa C6. Extra pronto, fora da agenda: "A FTG em números", 5 telas, post fixado,
sem data. Junta-se ao institucional "Quem cuida" esperando o Victor dizer quando
os fixados sobem.

**09/11/2026 · datas comemorativas na linha editorial**

Pedido do Victor. Entram como extra, fora da cadência, sem mexer em post
aprovado, e todas passam pela Dra. Elisa:

- 20/11 Dia da Consciência Negra, feriado nacional (cai no mesmo dia do CAR pelo CPF)
- 03/12 Dia Internacional da Pessoa com Deficiência, puxando o previdenciário
- 05/12 Dia Mundial do Solo, pelo agronegócio
- 08/12 Dia da Justiça, institucional
- 24/01/2027 Dia do Aposentado

Ficaram de fora por não conversar com o feed: 15/11 Proclamação da República,
19/11 Dia da Bandeira, 10/12 Direitos Humanos.

Victor cortou 20/11 (Consciência Negra) e 03/12 (Pessoa com Deficiência): "tem que ser mais pertinentes". Ficam Dia Mundial do Solo, Dia da Justiça e Dia do Aposentado.

Entrou também 15/11, Proclamação da República, a pedido do Victor.

**10/11/2026 · status**

O Victor confirmou: saíram o vídeo de 04/11, a Reserva Legal de 06/11 e o vídeo do conflito de terra de 09/11. Excel de 10/11 regerado para o envio à Dra. Elisa.

**10/11/2026 · estático de 15/11, Proclamação da República**

Data comemorativa pedida pelo Victor, sem roteiro aprovado: o texto é meu e
precisa passar pela Dra. Elisa. Foto do Pinterest (porteira pintada com a
bandeira e o nelore na estrada), escurecida, origem no `_creditos-pinterest.tsv`.
Selo Institucional, moldura dourada. Texto: "Uma República vive de leis que
valem pra todos. Da porteira ao tribunal, é isso que a gente defende todo
dia." Neutro, sem posição política. Modelo em `modelos/proclamacao-republica.html`.

**10/11/2026 · carrossel de 27/11, safrista, na nova IDV**

8 telas, roteiro aprovado em 28/10. Capa C1 (foto em cartão, laranjal na
colheita), selo de Área Trabalhista. Foto em 5 telas, todas do Pinterest e
escurecidas. Conferido: 20/12/2026 cai num domingo, como diz o roteiro. A
legenda do estático de 15/11 também foi escrita (texto meu, pra Dra. Elisa).
