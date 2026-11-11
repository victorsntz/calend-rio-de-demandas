# Regras de produção (Larissa Merola)

## 1. Toda demanda começa com uma pergunta: tipo 1 ou tipo 2?

Quando o Victor jogar um tema aqui, antes de produzir, perguntar qual tipo ele quer:

- **Tipo 1, sistema da própria Larissa.** Slides que valem sozinhos como estático: cabeçalho
  "DRA. LARISSA MEROLA · NUTROLOGIA", título na serifa da logo, sálvia/papel/marrom com textura,
  células, numeral gigante, cards com ícone, padrão de folhas no rodapé, fecho com a Dra. e
  "Link na bio". Capas: foto inteira, print de notícia ou ilustração. Bom pra notícia, dado,
  explicação passo a passo. (`capa/montar2.mjs`, tipos capa-foto, noticia, celulas, dado, cards,
  passos, foto-frase, fecho.)
- **Tipo 2, inspirado em perfil real (ref. Gabriela Farias).** Foto inteira ocupando tudo, chip
  de perfil (avatar + nome + @) em cima da foto, sem cabeçalho e sem logo no miolo, frase grande
  em sans pesada com grifo, rótulo em caixa marrom-claro, texto corrido falando com a leitora,
  itens com seta, convite explícito pra comentar e mandar pra uma amiga. Duas capas:
  **colagem** (3 fotos + "se você…, salva esse post") ou **frase** (1 foto + "As mulheres não estão
  com X pelo A, pelo B e nem pelo C"). A Dra. nunca na capa; ela fecha, com CTA em três linhas.
  (`capa/montar2.mjs`, tipos capa-colagem, capa-frase, corpo-foto, fecho2.)

**Capa do tipo 1 (referência de 11/11, "Ah, mas ser saudável é muito caro..."):** foto inteira e
clara, a objeção que a seguidora fala em caixa alta (Sora leve, branca, canto superior esquerdo),
"DESLIZE PARA O LADO" pequeno e espaçado no canto superior direito, uma frase de virada no canto
inferior direito e a logo centralizada no pé. O miolo é educativo: explica, desmonta a crença e
fecha com a Dra. O Victor quer o tipo 1 nesse formato alternando com o tipo 2 (parede de fotos).

Se ele já disser o tipo na mensagem, não perguntar. Se não disser, perguntar com uma linha de
explicação de cada um.

## 1b. Estáticos: 01 notícia, 02 frase (11/11)

O Victor gosta muito dos estáticos de notícia e quer mais deles. Nomes fixos:

- **Estático 01, notícia.** Faixa "NOTÍCIA" no topo (verde-saúde com letra musgo, ou vinho quando o tom é alerta) e a Dra. assinando no pé.
  - **01a, print real:** print da matéria (veículo, título, linha fina e foto) dentro do cartão. Gerador: `estaticos/noticia.mjs`.
  - **01b, card de manchete:** manchete reescrita em caixa alta com a virada em negrito ("Exercício não é complemento do tratamento. **É o tratamento.**"), uma linha de dado embaixo ("128 mil pessoas. 1.000 estudos.") e foto na metade de baixo.
- **Estático 02, frase.** Foto inteira com a mensagem por cima.
  - **02a, frase ou dado:** frase grande e uma linha de apoio ("49 milhões de brasileiros têm apneia do sono. A maioria nem sabe.").
  - **02b, gancho "leia a legenda":** números ou opções grandes à esquerda, pergunta curta ao lado e "Leia a legenda" ("5 mg, 10 mg, 15 mg. Quais os resultados esperados de cada dose?"). A resposta fica inteira na legenda.

Notícia sempre com veículo e data na legenda. Nada de preço de medicamento na arte.

## 2. Cor: mais marrom, menos verde

Feedback de 28/10: "tá verde demais, falta amarronzar". Ajuste de 28/10 à noite: marrom predominante, uns 60%, e o verde
escuro de volta nos outros 40%, porque ele é parte da composição dela. No tipo 2 o véu das fotos
alterna marrom e musgo (slides ímpares em verde, fecho em verde); no tipo 1, capa em musgo, miolo
em papel/marrom-claro/marrom, dado e fecho em musgo. O resto em papel quente, marrom-claro, marrom, taupe
e foto com véu marrom. Padrão de folhas do rodapé nas cores musgo + marrom + marrom-claro + saúde.
Tons já listados em `capa/v2.css`: `--marrom #4D392A`, `--marrom-claro #B8A08A`, taupe `#8C7B6B`,
papel quente `#EFE8DC`.

## 2b. Alinhamento: um só por carrossel

Regra do Victor (28/10): se um slide está alinhado à esquerda, todos os textos de todos os slides
ficam à esquerda. Nada de capa centralizada com miolo à esquerda. No tipo 2 tudo é à esquerda,
inclusive colagem e mosaico. No tipo 1, o que for centralizado (notícia, capa de ilustração) só
convive com slides também centralizados.

## 2b2. Chip de perfil (tipo 2)

Avatar = foto do perfil real do Instagram (`banco/doutora/avatar.jpg`, @larissamerola). Na capa
colagem e no fecho o chip fica junto do texto, logo acima do título; nos slides de miolo, no canto
superior esquerdo.

## 2c. Viúvas: nunca

Nenhum título, rótulo ou frase de destaque termina com uma palavra sozinha na última linha
(`capa/tipografia.js` junta as duas últimas palavras com espaço fixo em h1, h2, h3, rótulos em
caixa e títulos de card). Conferir na prancha antes de entregar. Vale também pra palavra curta solta no fim da linha
("E", "a", "de", "que", "pra"): o script cola no termo seguinte. Frase de capa que termina em
"salva esse post" quebra antes do "salva", pra ficar inteira na última linha.

## 3. Tom de voz: menos professora, mais conversa

Feedback de 28/10: "muito professoral". O que muda no texto:

- Falar com ela, não sobre ela: "você sente", "me conta", "a gente investiga".
- Abrir validando: "não é frescura", "você não está exagerando", "muita mulher passa por isso".
- Um dado por carrossel, no máximo dois, sempre traduzido ("1 em cada 8 mulheres", não "12,3%").
- Palavra técnica só quando vem com a explicação na mesma frase ("lipedema, uma gordura diferente,
  dolorida, que não responde a dieta").
- Convite explícito pra comentar e pra mandar pra uma amiga em todo fecho. Pergunta aberta
  ("o que você sente?"), não fechada.
- Nada de "estudos demonstram", "é fundamental", "é imprescindível", "portanto". Nada de emoji.
- Técnica continua existindo, mas como prova de que ela sabe o que faz, não como aula.
- Dentro do CFM e da Anvisa: sem promessa de resultado, sem preço de prescrição, sem antes/depois.

## 4. Fotos: inflar de imagem

Pedido de 30/10: "exagera na quantidade, 6 a 8 fotos por slide". No tipo 2, todo slide de miolo e as duas
capas usam a **parede de fotos**: duas fileiras cheias (4+4, 4+3 ou 3+3), véu sobre a de baixo e o texto por
cima. Só o fecho fica com a Dra. em foto inteira. No JSON é só passar `fotos: [6 a 8 caminhos]` em
capa-colagem, capa-frase ou corpo-foto. Fotos escolhidas a dedo nas pranchas de `banco/raw/pinterest/` e
registradas com `node capa/adicionar.mjs "pasta/arquivo.jpg:tag,tag"`. Recortes de posts antigos que
carregam cabeçalho ou texto não entram em célula pequena. Layouts antigos (colagem de 3, duas empilhadas,
mosaico de 4) continuam existindo pra quando houver menos imagem.
Banco em `banco/` (38 fotos): Drive BANCO DE ARQUIVOS + recortes limpos das fotos de banco que a
agência já licenciou em posts anteriores (`origem` no manifest diz de onde veio). Pinterest liberado no
ambiente (28/10): `node capa/pinterest.mjs "termo ou link de pin/pasta" --n 10 --tags a,b --slug nome --banco`
abre a grade pública num Chromium (sem login), baixa as imagens em 736px pra `banco/raw/pinterest/<slug>/`
com `fontes.json` e, com `--banco`, registra no manifest com a URL de origem. As imagens em 736 px
cobrem meio slide ou um mosaico com folga; em foto inteira ficam no limite, preferir pins grandes.
Foto de famosa e foto de imprensa são de terceiros: usar como referência cultural, sempre com a
origem registrada, como a agência já fazia em set/2026. A Dra. só no último slide. Rotação
sem repetir (`banco/uso.json`).

## 5. Entrega

Zip com PNGs numerados + `legenda.txt` (primeira linha "Siga @larissamerola", parágrafos, bloco
de fontes). Preview na página de revisão com comentários. Confirmar o @ ativo
(`@larissamerola` × `@dralarissamerola`) antes de publicar.
