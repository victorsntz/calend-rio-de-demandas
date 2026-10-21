# Formato 01 — carrossel Gorayeb

O formato padrão. Quando o Victor pede **"tema X no formato 01"**, é isto aqui,
sem precisar repetir nada.

## A regra curta

5 a 10 slides, 1080 × 1350. Abre em capa de foto no grid de quatro faixas, fecha
em foto com a logo. No meio, pelo menos uma figura: gráfico, tabela, mapa ou
número grande. Tudo alinhado à esquerda. Sem assinatura escrita, em lugar nenhum.

## Decisões fechadas com o Victor

Cada uma veio de um pedido dele na revisão. Não voltar atrás sem ele mandar.

| Ponto | Regra |
| --- | --- |
| **Logo** | Só na **capa** e no **último slide**. Nunca no miolo. |
| **Assinatura** | "Do agro, pelo agro." **não entra em lugar nenhum**: nem na arte, nem na legenda do post. |
| **Alinhamento** | **Tudo à esquerda**, por padrão. Inclusive o fecho. O único centro que sobra é o número dentro do donut, que é composição do gráfico. |
| **@gorayebadvocacia** | Topo, à esquerda, alinhado com o resto. Com folga de 46 px abaixo. |
| **Marca d'água** | A chapa do `corpo-foto` fica em **cor sólida**. A marca ao fundo só entra se for pedida. |
| **Listras** | Textura, não padrão. Escala grande, contraste baixo, esmaecendo na diagonal. Nunca em todo slide do carrossel. |
| **Viúvas** | Palavra sozinha fechando linha **não passa**. O render costura sozinho; se ainda ficar feia, encurtar a frase. |
| **Respiro** | Corpo em 34 px, entrelinha 1,58, medida de 19 caracteres. Nada espremido. Todo slide de figura leva folga entre o título e o desenho. |
| **Fecho** | Honra quem faz, não vende serviço. A chamada pede marcação, que puxa mais comentário que pergunta. |
| **Título de chapa** | Uma linha só, no `corpo-foto`. O `\n` no JSON marca onde começa o itálico, não quebra linha. Se não couber, encurtar o título. |
| **Tamanho** | 5 a 7 slides no padrão. Até 10 quando a pauta é técnica e pede texto corrido, como mudança de lei. |
| **Véu sobre foto** | O `foto-texto` leva véu próprio, mais fechado na faixa do meio. O véu padrão fecha só no pé e deixa o parágrafo brigando com a imagem. |
| **Rosto em foto de banco** | Close de gente identificável não entra. Foto de Pinterest com rosto reconhecível em post comercial é risco sem retorno. Multidão de longe, de costas ou em contraluz, pode. |
| **"Agro"** | **Nunca abreviado.** Sempre **Agronegócio**, na arte e na legenda. Regra da Dra. Elisa, 21/10. |
| **"Agrário" e "Agronegócio"** | Não listar os dois juntos: pra cliente são a mesma coisa. O termo da casa é **Direito do Agronegócio**. Regra da Dra. Elisa, 21/10. |
| **"Conta ponto"** | Fora. Diferencial de vaga vai sob o rótulo **Desejável**. Regra da Dra. Elisa, 21/10. |
| **Barra de progresso** | **Não usar.** Existe no template (`progresso: true`), mas ficou de fora por decisão do Victor. |

## A capa

Grid de **quatro faixas horizontais** de 337 px:

1. e 2. Foto limpa. A paisagem respira.
3. Etiqueta de assunto, título e linha de apoio, centrados na faixa.
4. Logo, dentro da sombra, em tamanho generoso.

A sombra sobe até a metade da peça, então as duas faixas de baixo têm base
escura e o texto nunca briga com o fundo.

## O que entra no miolo

Alternar. Nenhum fundo repete dentro do mesmo carrossel.

- **Fundos**: verde, off-white, branco, areia, bordô, marrom, foto com véu.
- **Texturas**: listras, marca d'água (opcional), ou nada.
- **Figuras**: donut, blocos, barras, tabela, mapa, números, cerca e linha do tempo.
  Proporção perto dos extremos vai de **blocos**; no meio do caminho, de **rosca**.
  Com 96% o anel fecha e vira um círculo, que não informa nada. Pelo menos uma por
  carrossel, que é o que diferencia o nosso do que já estava sendo publicado.
  Quando a pauta tem uma coisa concreta (uma cerca, uma porteira, uma divisa),
  desenhar a coisa vale mais que um gráfico genérico.
- **Ícones de linha** (`boi`, `navio`, `dinheiro`, `mapa`, `documento`) em cima
  de cada cifra, pra dar o assunto num relance. Nunca sozinhos, sempre com o
  número.
- **Mapa com mais de um destaque** vira bolha proporcional numerada, com a
  legenda embaixo repetindo o número. Texto solto dentro do desenho estoura a
  margem da peça.

## Quando vem uma referência

O Victor manda um post de outro perfil. **A regra é quase cópia da estrutura,
com a nossa identidade.**

1. **Ver as artes, não só a legenda.** Slide a slide: quantos são, o que cada um
   carrega, onde entra gráfico, onde entra ícone, como fecha. A legenda sozinha
   não mostra isso e leva a um carrossel mais pobre que o original.
2. **Seguir o conteúdo, não o desenho.** Mesma quantidade de slides, mesmo
   assunto, mesmo nível de detalhe. Se eles foram mais visuais e didáticos, a
   nossa também vai. Mas **a espinha visual tem que ser outra**: se eles empilham
   cinco telas de número gigante, a gente distribui a mesma informação em chapa
   de texto, linha do tempo, tabela, blocos e números em diagonal. Juntar três
   cifras deles num slide só já muda o ritmo inteiro.
   Nenhum desenho se repete em dois slides seguidos.
3. **Trocar só a casca.** Nossa paleta, nossa tipografia, nossos ícones, nosso
   jeito de desenhar gráfico. O conteúdo e o encadeamento ficam.
   **Reescrever todo o texto**, inclusive título de slide e nome de item de
   lista. Mesma informação, outras palavras: estrutura a gente copia, frase não.
   Quando a referência fala com um público diferente do nosso (eles falam com
   advogado, a Gorayeb fala com produtor), muda o destinatário, não a lista.
4. **Conferir cada informação** em fonte independente antes de entrar na arte.
   Corrigir o que estiver errado e **avisar na entrega** o que foi corrigido e
   por quê.
5. **Melhorar o fechamento** se o deles for melhor que o nosso padrão. Vale
   copiar a ideia do fecho.

Para baixar a referência: `python3 docs/gorayeb/ig.py "<link>" <pasta>`. A rede
precisa permitir `www.instagram.com` e `*.cdninstagram.com`, com o curinga, que
os arquivos ficam em subdomínio regional.

## O eixo: informar, não medir

A pauta de mudança de lei existe para **o público entender o que mudou**, não
para medir o tamanho do impacto no setor. Projeção de custo e de emprego é
assunto de entidade, e empilhada vira lobby.

Na arte entra: **o que muda, quando começa, quem entra, quem fica de fora e o
que fazer.** Um número de contexto basta, o que responde "isso me pega?". As
projeções vão para a legenda, com a ressalva de metodologia junto.

O teste é simples: alguém que não entende nada de PEC consegue explicar a
mudança depois de passar o dedo? Se a resposta depende de ler, falta desenho.
Foi assim que nasceu a figura `semana`: catorze quadrados explicam a escala 6x1
sem uma linha de texto.

## Linguagem

Dois registros, conforme a pauta.

**Curto**, para pauta de opinião, data comemorativa e conceito: frase seca,
espelhada, pouca palavra por slide. É o padrão.

**Longo**, para mudança de lei, prazo e número: parágrafo corrido, registro
técnico, até 10 slides. Nesse caso **menos frase de efeito**: o título do slide
descreve o que vem, não faz piada nem trocadilho. A referência é como os
escritórios grandes do agro escrevem no LinkedIn.

Nos dois: a casa afirma seco, nega e corrige, espelha duas frases e fala com o produtor.
**Nunca fala sobre o próprio post.** Fora: "entenda", "veja", "confira", "em uma
imagem", "neste carrossel", "tudo o que você precisa saber". A regra inteira,
com os exemplos levantados das peças publicadas, está no guia de conteúdo.

## De quem é o assunto

O padrão é **cenário nacional**: a pauta é o setor, não o escritório. Nada de
foto da casa, da equipe ou da família na arte, a não ser que o Victor peça. O
escritório aparece no fim, na logo e na chamada.

## Foto

1. **Banco da Gorayeb primeiro** quando a pauta é da casa. Escritório, equipe, Fernando, as aplicações da
   marca. Publicam sem ressalva.
2. **Pinterest só pro cenário de campo**, e com termo que diga Brasil:
   *"fazenda brasileira cerrado mineiro"*, não *"fazenda cerca"*.
3. Abrir em tamanho cheio e descartar **marca d'água** de banco ou assinatura de
   fotógrafo, e qualquer coisa com **cara de IA**: madeira uniforme demais, gado
   simétrico, telhado regular demais, luz sem direção. Retrato de stock sorrindo
   pra câmera quase sempre é IA.
4. Quando a foto tem rosto, conferir o corte com `foco` no JSON. O padrão corta
   no centro e decapita gente em pé.

## Número e data

**Sem fonte não entra na arte.** O contrato exige que toda informação factual
seja verificável. Dado de órgão oficial ou de entidade do setor, com a fonte
escrita no slide.

Data histórica que **diverge entre fontes não entra**. Fica de fora e, se for
importante, vai avisado na entrega. Retrato de figura histórica também não: ou
tem autorização do acervo, ou não vai.

## O estático

Uma tela só, 1080 × 1350. A frase é a peça; o desenvolvimento inteiro vai na
legenda. Segue o que o feed já faz: uma frase de contexto em corpo normal e a
virada em **caixa alta dourada**, marcada com `*asterisco*` no JSON.

Leva etiqueta, logo e, quando houver base legal, a fonte no rodapé. Serve bem
para regra com exceção, que é onde uma frase curta rende mais que dez slides.

## A vaga

Anúncio de contratação sai em duas peças, **feed 1080×1350 e stories 1080×1920**,
do mesmo JSON: o slide de stories só leva `formato: "stories"`.

**O feed leva o mínimo que faz alguém se candidatar:** cargo, cidade, presencial
ou não, dois ou três requisitos de uma linha, e o e-mail com o assunto do envio.
**Respiro vem de cortar item, não de apertar entrelinha.** Quando a peça passa de
uns cinco itens entre todos os blocos, o jeito de arejar é tirar linha, não
diminuir corpo: o que sai do feed continua no stories e na legenda.

**O stories leva muito mais**, porque tem 570px a mais de altura: as atribuições e
os requisitos em `blocos`, cada um com subtítulo dourado, e o `remate` com
remuneração e o que a cidade oferece. É a peça que alguém abre com tempo.

Aqui a **foto é do escritório**, não cenário nacional. É a exceção: quem vai se
candidatar quer ver onde trabalharia.

O stories ganha margem extra em cima e embaixo, que é onde o Instagram põe a
própria interface. Nada de texto encosta ali.

**A legenda de vaga é do cliente.** Vaga não segue a linguagem da casa: quem
define o texto é o escritório, que é quem vai receber o currículo. A agência
formata e aponta o que destoa, não reescreve por conta.

**Prazo só entra se estiver certo.** Data de inscrição vencida ou que não bate com
a data do envio fica de fora até o cliente confirmar. Confirmada, ela vira a
`chamada`: uma linha de ação logo acima da caixa do e-mail, com a data em dourado.

## Como entrego

**Toda vez que fecho conteúdo, vão três coisas**, sem precisar pedir:

1. **O zip** de cada peça, com as artes numeradas na ordem do post e o
   `legenda.txt` dentro.
2. **O .txt da legenda** solto, pra colar direto sem abrir o zip.
3. **O calendário editorial atualizado**, em Excel, com o status da peça já
   marcado e a data no nome do arquivo.

A sequência:

```
node docs/gorayeb/render.mjs docs/gorayeb/carrosseis/<peça>.json
python3 docs/gorayeb/empacota.py docs/gorayeb/carrosseis/<peça>.json
# marcar o status em calendario/plano.json e mudar atualizado_em
python3 docs/gorayeb/calendario/gerar.py
```

## Diário

Toda entrega ou decisão nova entra no `diario.md`, que é o resumo do que já foi
feito. É pra consultar lá em vez de rolar conversa.

## Limites da OAB

Informativo e educativo. Sem promessa de resultado, sem "melhor" ou "maior",
sem honorário, sem caso de cliente. Quem aprova é o Fernando.
