# ESTILO.md · Norte Sul

Fonte única do estilo dos vídeos da Norte Sul Hidrotecnologia. Toda edição lê este
arquivo antes de começar, e ele vence qualquer regra genérica da skill.

Versão 1.0, 19/out/2026. Montado a partir de três fontes: o logotipo oficial, o
vídeo da linha do tempo já aprovado para a FENASAN e o roteiro institucional
"Norte Sul: experiência, propósito e futuro". Onde as três concordam, virou regra.
Onde só uma falava, está marcado como **a confirmar**.

---

## 1. O estilo em uma frase

Infraestrutura que se lê de longe: azul profundo, branco firme e um amarelo que
só aponta o que importa.

## 2. Princípios

1. **Tem que entender sem som.** O telão da feira toca mudo. Toda informação que
   a narração dá, a tela também dá. Legenda do começo ao fim, sem exceção.
   *Por quê:* é a primeira linha do roteiro, e é o cenário real de exibição.
2. **Leitura à distância manda no tamanho.** Quem assiste está a dez metros, de
   pé, passando. Fonte grande, frase curta, uma ideia por tela.
   *Por quê:* num estande, texto pequeno é texto que ninguém lê.
3. **A obra é a imagem.** Caminhão, rede, poço de visita, equipe em campo. Nada
   de banco de imagens, nada de gente genérica sorrindo.
   *Por quê:* o roteiro pede foto e vídeo reais da empresa. A história de 1985
   até aqui é o ativo; emprestar imagem de fora joga esse ativo fora.
4. **O tempo é personagem.** De 1985 a 2026 existe uma linha que não some. O
   espectador sempre sabe em que ano está.
   *Por quê:* é o que o vídeo-modelo faz, e é o que diferencia a Norte Sul de
   qualquer concorrente novo.
5. **Amarelo aponta, não decora.** Ele marca o ano ativo, abre a legenda e
   destaca uma palavra. Nunca preenche área grande, nunca vira fundo.
6. **Dado antes de adjetivo.** "Contratos no Rio, Uberlândia, Maceió, Goiânia e
   Belo Horizonte" vale mais que "presença nacional".

## 3. Sistema visual

### Cores

| Nome | Hex | Uso |
| --- | --- | --- |
| Azul profundo | `#04306E` | fundo das cartelas, campo das peças, o azul da marca em área |
| Azul noite | `#011A3D` | escurecido sobre vídeo, fundo de caixa escura, base do degradê |
| Azul vivo | `#0092FF` | o azul do símbolo; detalhe, fio, ícone, realce sobre azul profundo |
| Amarelo | `#FFBA00` | acento: barra da legenda, ano ativo, palavra destacada |
| Branco | `#FFFFFF` | texto principal sobre azul e sobre vídeo |
| Cinza claro | `#C8D4E4` | texto secundário sobre azul, rótulo, crédito |
| Azul quase preto | `#001024` | texto sobre fundo claro, wordmark na versão clara |

Regra do amarelo: a mobília do sistema é amarela por desenho e não entra na conta.
São três peças fixas: a barra da etiqueta de ano, a barra da legenda e o ponto
ativo da linha do tempo. Elas podem estar as três na mesma tela, como no vídeo
aprovado. O que a regra limita é **destaque de conteúdo: um por tela**. Uma
palavra realçada, ou uma pílula preenchida, ou um número em destaque. Nunca dois.

Amarelo nunca é fundo de bloco nem cor de texto corrido.

Regra do azul vivo: ele é do símbolo. Sobre azul profundo funciona como fio e
detalhe. Nunca encoste texto de leitura nele: o contraste não fecha.

### Fontes

- **Helvetica Neue** é a fonte da marca. Títulos em Bold, texto e legenda em
  Medium, rótulo em Bold caixa alta com espaçamento de 0,12 em.
- A fonte é licenciada da Monotype e **não** vem no repositório. Ela mora em
  `.fontes/`, que o git ignora. Instalação em `.claude/skills/.../references/fluxo.md`.
- **Enquanto a Helvetica Neue não estiver na máquina**, a esteira usa a Inter, que
  é grotesca livre com largura e peso próximos. O `conferir.mjs` **reprova** o
  render feito com a substituta, pra nenhum arquivo ir pra feira trocado.
- Nunca outra fonte. Sem serifa, sem condensada de impacto, sem manuscrita.

### Formato

O telão da FENASAN é um painel de 3 larguras por 2 alturas: **1008 x 672 pixels**,
proporção 3:2. É a medida de entrega, em MP4.

- Zona segura: x de 48 a 960, y de 48 a 624. O que sai daí pode encostar na
  moldura do painel.
- Faixa da legenda: y de 466 a 570.
- Linha do tempo: y 590, recuada 34 px de cada lado pra que o ponto e o ano
  caibam dentro da zona segura.

Também existe o perfil `youtube` (1920x1080) para quando o mesmo material virar
vídeo de canal. O telão manda; o 16:9 é derivado.

### Tipografia na tela

| Peça | Tamanho | Peso |
| --- | --- | --- |
| Título de cartela | 60 a 72 px | Bold |
| Título sobre vídeo | 52 a 60 px | Bold |
| Legenda | 32 a 36 px | Medium |
| Etiqueta de ano | 40 px | Bold |
| Item de lista | 34 px | Medium |
| Rótulo | 16 px | Bold, caixa alta, 0,12 em |
| Linha do tempo | 13 px | Medium |

Legenda: no máximo 2 linhas, 6 a 10 palavras por vez. Mais curta que isso fica
picotada; mais longa não dá tempo de ler de pé.

### Kit de peças

**Etiqueta de ano** — caixa branca, barra amarela de 6 px à esquerda, texto em
azul quase preto. É o carimbo do bloco: `1985–1990`, `2000–2010`.

**Linha do tempo** — fio de 2 px na base com um ponto por marco. O ano ativo
vira ponto amarelo maior com o número em branco; os outros ficam em cinza claro
a 55%. Ela aparece em todo bloco histórico e some quando o vídeo sai da história.

**Título sobre vídeo** — branco, Bold, alinhado à esquerda, sobre um degradê
que escurece a base do quadro. Sem caixa, sem contorno.

**Legenda** — branca, Medium, numa **placa de azul noite a 82%** com a barra
amarela de 4 px à esquerda. A placa é o que faz o branco fechar contraste sobre
obra clara: sem ela a letra se mistura com o fundo e some a dez metros. A barra
é o que amarra a legenda à marca; sem ela vira legenda de qualquer um.

**Pílula** — etiqueta pequena de canto reto suave: contorno branco a 45% com
texto branco, ou preenchida em amarelo com texto azul quase preto quando é o
dado principal. Serve pra cliente (`Sabesp`), praça (`RJ`, `MG`) e natureza do
contrato (`Contrato por performance`).

**Cartela** — quadro inteiro em azul profundo com um clarão radial suave no
canto superior direito, ou sobre vídeo com véu. É abertura, transição e
fechamento.

**Tudo encostado à esquerda, logotipo incluído.** O logotipo abre o bloco de
texto, no mesmo eixo do resto: solto no meio do quadro ele fica distante da
composição e desproporcional. Abaixo de 70 px entra a versão compacta, porque
o descritivo não lê; acima dela, a versão cheia.

**Sublinhado amarelo** sob o título, 6 px por 96 px. É o que tira o bloco do
branco chapado. Quando a frase tem um trecho que precisa saltar, esse trecho vai
em amarelo em vez do sublinhado, nunca os dois no mesmo texto.

**Lista** — cada item com um **check amarelo** antes, empilhados com respiro de
22 px. O marcador é check e não fio: fio amarelo fica igualzinho à barra da
legenda, e aí item de lista e legenda falada viram a mesma coisa na tela.

**Ponto** — um item de cada vez, grande, com índice `01` em amarelo ou com o
check. Mesma fonte e mesma escala da lista, forma diferente. É o que entra em
bloco longo: quatro linhas paradas por trinta segundos viram parede de texto, e
o espectador para de ler.

Sobre vídeo, a lista vem num **véu de azul noite a 72%** cobrindo o quadro. A
obra continua aparecendo por baixo, e o texto fecha contraste. Sem o véu, branco
sobre obra clara não lê de dez metros: o degradê de base não resolve, porque a
lista mora no meio do quadro.

**Marca** — o logotipo no canto superior direito, altura de 44 px, sempre a
versão de fundo escuro quando estiver sobre azul ou sobre vídeo. No fechamento,
Norte Sul e Metropolitana lado a lado, com o site em rótulo, **acima da faixa da
legenda** e no mesmo alinhamento do texto da cartela. A assinatura no pé do
quadro era atropelada pela legenda.

O logotipo compacto (sem o descritivo) é o da marca d'água, porque em 44 px o
"Hidrotecnologia e Comércio LTDA" vira borrão. **Ao recortar o descritivo, cortar
na faixa de linhas vazias abaixo do wordmark**, nunca numa altura chutada: o pé
do L fica logo acima dela e some junto.

**Número de destaque** — Bold, bem grande, branco, com o rótulo em cinza claro
embaixo. Quando o número é o assunto da tela, ele pode ir em amarelo.

### Movimento

- Curva padrão: `cubic-bezier(.25,.8,.25,1)`.
- Peça entra subindo 18 px com fade, em 0,45 s.
- Legenda entra subindo 8 px com fade, em 0,18 s. Sem quicar, sem letra por letra.
- A linha do tempo anda: o ponto ativo desliza até o ano novo em 0,6 s.
- Transição entre blocos: corte seco, ou cartela azul entrando de baixo em 0,4 s.
- Zoom lento na foto histórica: 1,00 para 1,05 ao longo do tempo que ela fica na
  tela. Foto parada em telão parece erro de projeção.
- **A volta do laço é suave, não idêntica.** Abertura e fechamento são peças
  diferentes, cada uma com arte própria, mas as duas no azul e no mesmo nível de
  brilho, pra emenda não piscar. Repetir a mesma cartela nas duas pontas parece
  erro de montagem. As pontas não têm transição: peça que começa em 0 entra já
  inteira, peça que vai até o fim fica inteira até o fim. O `conferir.mjs` mede
  o salto de brilho entre o último quadro e o primeiro.

### Imagem e cor

- Foto de acervo: manter o grão e a cor da época, sem tentar "consertar" pra
  parecer nova. 1988 tem que parecer 1988.
- **Material de câmera chega torto.** Arquivo de Sony pode vir girado 90 graus
  sem etiqueta de rotação, e o ffmpeg não corrige sozinho; iPhone grava em HDR.
  O `montar.mjs` resolve os dois no mesmo passe, com `"girar"` e `"hdr"` no
  clipe. Conferir quadro a quadro antes de montar, nunca confiar na etiqueta.
- **Vídeo em pé não entra.** O telão é 3:2 deitado; material vertical perde
  quase tudo no corte e fica de fora da seleção.
- Vídeo atual: cor neutra, azul levemente puxado, sem estourar o branco do
  caminhão.
- Sobre foto ou vídeo com texto por cima, escurecer a base em 55% num degradê
  que começa transparente na metade da altura.
- **Título sobre vídeo leva sombra atrás da letra**, não só o degradê de base.
  Sobre obra clara o degradê sozinho não dá conta.

### Ritmo

- Marco histórico: cerca de 3 s cada. Oito marcos cabem nos 25 s que o roteiro
  reserva pra passagem do tempo.
- Blocos de missão, visão e valores: a frase fica na tela o tempo da narração
  mais 0,4 s de respiro.
- Nada na tela por menos de 1,2 s. De pé, a dez metros, menos que isso não lê.

### Som

- Narração em português do Brasil, locução profissional, ritmo calmo.
- Trilha instrumental com licença livre, cerca de 20 dB abaixo da voz.
- Sem efeito sonoro de transição. O vídeo tem que fazer sentido no mudo, então o
  som é conforto, não informação.

## 4. Voz

- Português do Brasil, frase curta, afirmativa.
- Sujeito concreto: "a Norte Sul", "a equipe", "a rede", não "a empresa" solto.
- Fala de serviço, não de slogan. O roteiro já define o tom; a tela não inventa
  frase nova, resume a que foi narrada.
- Termos que a casa usa: água, esgotos, drenagem, rede coletora, poço de visita,
  hidrojato, desobstrução, televisionamento, perdas, concessionária.

## 5. Nunca fazer

- Texto fora da zona segura do painel.
- Legenda ausente em qualquer trecho com narração.
- Amarelo como fundo de bloco, ou terceiro elemento amarelo na mesma tela.
- Texto de leitura em cima do azul vivo `#0092FF`.
- Qualquer fonte que não seja a Helvetica Neue (ou a substituta declarada).
- Foto de banco de imagem no lugar de foto da obra.
- Transição de programa: cubo, giro, glitch, zoom com borrão.
- Efeito sonoro de impacto, whoosh, boom.
- Logotipo esticado, girado, com sombra ou sobre fundo que não fecha contraste.
- Entregar fora de 1008x672 sem o cliente ter pedido outro tamanho.
- Travessão no texto da tela.
- Palavra de texto de IA: "jornada", "desbloquear", "potencializar",
  "no cenário atual", "soluções inovadoras" solto, "excelência" como enfeite.

## 6. Especificações técnicas

- **Telão FENASAN:** 1008x672, 30 fps, H.264 + AAC, cores BT.709, MP4 com
  `+faststart`. Zona segura: x de 48 a 960, y de 48 a 624.
- **YouTube:** 1920x1080, 30 fps, H.264 + AAC, BT.709.
- Primeiro e último quadro iguais, pra fechar o loop.
- Entrega em `renders/<projeto>.mp4`.

## 7. Referências

*A confirmar.* Entram de 3 a 5 vídeos institucionais de infraestrutura, e pra
cada um o que roubar (o princípio) e o que deixar (o visual que é dele).

| Referência | O que roubar | O que deixar |
| --- | --- | --- |
| Linha do Tempo Norte Sul (FENASAN, 2026) | etiqueta de ano, linha do tempo viva na base, legenda com barra amarela, pílula de cliente e praça | a resolução de 720x480 do arquivo que circulou no WhatsApp |

## 8. Notas

*Cresce a cada vídeo. Formato: data · vídeo · o que mudou e por quê.*

- 19/out/2026 · institucional FENASAN · estilo criado. Cores tiradas do logotipo
  oficial e amostradas no vídeo da linha do tempo já aprovado; amarelo medido em
  `#FFBA00` sobre 56 mil pixels de 12 quadros. Formato 1008x672 informado pelo
  cliente (painel 3L x 2A).
- 19/out/2026 · institucional FENASAN · Helvetica Neue instalada, 5 pesos. O
  render de entrega passou a ser possível; antes disso o fiscal barrava tudo.
- 19/out/2026 · institucional FENASAN · segunda decupagem. Tudo à esquerda,
  logotipo dentro do bloco de texto, sublinhado amarelo na cartela, legenda de
  36 pra 29 px e fechamento com arte própria em vez de repetir a abertura.
  Cada ponto de um bloco longo passou a ter seu próprio clipe: quatro telas
  seguidas no mesmo plano parecem quadro parado.
- 19/out/2026 · institucional FENASAN · primeira decupagem do cliente. Entraram:
  placa atrás da legenda, check no lugar do fio na lista, peça `ponto` pra bloco
  longo, sombra no título, assinatura acima da faixa da legenda e correção do
  recorte do logotipo, que tinha comido o pé do L.
- 19/out/2026 · institucional FENASAN · as pontas perderam a transição e a
  cartela de abertura ganhou a assinatura, igual à de fechamento. Sem isso o
  laço dava um piscada na volta (SSIM 0,920; agora 0,988).
- 19/out/2026 · institucional FENASAN · lista sobre vídeo ganhou véu de 72%.
  A primeira prévia mostrou missão, visão e valores ilegíveis sobre a obra.
- 19/out/2026 · institucional FENASAN · 13 clipes de operação selecionados pelo
  cliente. Cinco vieram girados 90 graus sem etiqueta e três em HDR, então a
  regra de "conferir quadro a quadro antes de montar" entrou na seção 3. Um
  clipe vertical ficou de fora.
