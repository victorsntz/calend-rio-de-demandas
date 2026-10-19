# ESTILO.md · Victor Fortunato

Fonte única do estilo dos vídeos. Toda edição lê este arquivo antes de começar, e ele vence qualquer regra genérica da skill.

Rascunho 1, 10/out/2026. Montado a partir do site fortunatoestudio.com (repositório `fortunato-site`: `site.css` e `index.html`). Falta a seção de referências.

---

## 1. O estilo em uma frase

Editorial brasileiro: cara de revista impressa, papo de café e uma provocação por vídeo.

## 2. Princípios

1. **Origem é assinatura.** O vídeo tem cara de Brasil sem fantasia: café, papel, mão, sotaque, música daqui. Nada de estética importada só porque viralizou lá fora. *Por quê:* é a tese do livro Branding pra BraSileiro. Vídeo que contradiz a tese queima a tese.
2. **Papel e tinta fazem quase tudo.** Preto e branco editorial, com o verde aparecendo só como detalhe. *Por quê:* é a regra do site. Marca que troca de roupa em cada canal some.
3. **Calma que prende.** O ritmo vem do corte e da ideia. Efeito gritando fica de fora. *Por quê:* posicionamento premium. Quem cobra o que vale não precisa gritar.
4. **Uma ideia por vídeo, dita sem rodeio.** Frase curta, palavra simples, opinião clara. *Por quê:* autoridade nasce de clareza.
5. **Humor seco.** Piada rápida, de canto de boca, no estilo "929 cafés (e contando)". *Por quê:* tira o peso do assunto sem perder a seriedade.
6. **Verdade antes de produção.** Bastidor real, conversa de verdade, erro que ficou bom. Nada encenado. *Por quê:* o site promete que marca só é forte quando carrega verdade. O vídeo precisa cumprir.

## 3. Sistema visual

### Cores

| Nome | Hex | Uso |
| --- | --- | --- |
| Papel | `#F6F5F1` | fundo de cartela e de caixa, texto sobre vídeo escuro |
| Papel 2 | `#EDEBE5` | caixas internas, respiro |
| Tinta | `#15140F` | texto principal, linhas, cartela escura |
| Tinta suave | `#5C5B55` | texto secundário |
| Tinta apagada | `#6E6A61` | rótulos, créditos, legendas de apoio |
| Espresso | `#121210` | fundo escuro de abertura, fechamento e citação |
| Espresso suave | `#BFBDB5` | texto secundário sobre fundo escuro |
| Verde | `#1F7A45` | acento sobre fundo claro |
| Verde claro | `#8FD1A8` | o mesmo acento quando o fundo é escuro ou é vídeo |

Regra do verde: **no máximo um elemento verde por tela.** Uma palavra, um ponto, um número. Nunca dois.

### Fontes (livre, no Google Fonts)

- **STIX Two Text**: a única fonte dos vídeos. Títulos em 500, legenda em 600, ênfase em itálico 400 ou 500. A legenda é em serifa de propósito: dá cara de revista e foge do Reels genérico.
- **Rótulo (eyebrow):** STIX Two Text 600, caixa alta, espaçamento de 0,26 em, pequeno. Exemplo: `BASTIDORES · DIA 3`.

### Textura

Grão de papel por cima de tudo, 4 a 5% de opacidade, modo multiply (o mesmo do site). Dá cara de impresso e esconde o "liso de computador".

### Legenda

- STIX Two Text 600, em caixa normal. Caixa alta só em rótulo.
- **Reels (1080x1920):** 64 a 72 px, até 2 linhas, 3 a 5 palavras por vez. Centralizada, na faixa entre y 1250 e y 1450.
- **YouTube (1920x1080):** 52 a 56 px, uma linha de preferência, 80 px acima da base.
- Cor sobre vídeo: Papel `#F6F5F1` com sombra suave (0 2px 12px, preto a 35%). Sobre fundo claro: Tinta `#15140F`, sem sombra.
- Ênfase: a palavra-chave da frase em itálico. Se for a palavra do vídeo, itálico em Verde claro `#8FD1A8`. Uma por frase, no máximo.
- Entrada: sobe 6 a 10 px com fade em 0,2 s. Sem quicar, sem pular palavra por palavra.
- Legenda limpa: "né", "tipo" e "ééé" saem do texto mesmo quando ficaram no áudio. Ortografia sempre corrigida.

### Título de gancho (primeiros 1 a 3 segundos)

- Rótulo pequeno em cima, linha de Tinta de 2 px, frase grande embaixo.
- Frase em STIX Two Text 500, 96 a 120 px no Reels, alinhada à esquerda, margem lateral de 96 px.
- Uma palavra pode ir em itálico.
- Sobre vídeo: escurece o fundo em 40% atrás do título. Em cartela: fundo Papel, texto Tinta.

### Kit de peças

Toda peça gráfica que entrar no vídeo sai daqui. Se precisar de uma peça nova, ela nasce com o mesmo DNA: papel, tinta, canto arredondado, linha fina.

**Caixa de texto (cartão)**
- Fundo Papel `#F6F5F1` (ou Papel 2 `#EDEBE5` quando o fundo já é Papel).
- Cantos de 18 a 20 px. Borda de 1 px em Tinta a 15% de opacidade.
- Respiro interno de 32 a 44 px.
- Versão escura: fundo Espresso `#121210`, texto Papel, cantos de 20 a 26 px.

**Pílula (etiqueta, chamada, botão)**
- Cantos totalmente redondos.
- Contorno de 1 px em Tinta com texto Tinta, ou preenchida em Tinta com texto Papel.
- STIX Two Text 15 a 16 px na escala do site (no vídeo, escala proporcional).
- Na chamada principal, um ponto Verde de 9 px à esquerda, pulsando a cada 1,9 s.
- Seta `→` depois do texto, que desliza 5 px pra direita quando a pílula aparece.

**Retângulo de imagem (foto, print, tela)**
- Cantos de 18 px (14 px em peças pequenas).
- Borda de 2 px em Tinta a 12%.
- A imagem cobre o retângulo inteiro, nunca fica esticada.

**Linha**
- 1 a 2 px em Tinta. Separa blocos e fica embaixo de rótulo. É o "fio" do site.

**Número de destaque**
- STIX Two Text 500, bem grande, espaçamento de -0,03 em.
- Quando houver vários números, o principal vai em Verde.
- Número que aparece conta subindo, como os números do site.

**Lista numerada**
- Sempre `01`, `02`, `03`, pequeno, em Verde, antes do título do item.

**Citação**
- Barra vertical Verde de 3 px à esquerda.
- Texto em itálico, grande, em Tinta (ou Papel sobre Espresso).
- Assinatura embaixo em rótulo: `VICTOR FORTUNATO`.

**Monograma F**
- O F do favicon: letra Papel num quadrado Tinta com cantos arredondados.
- Pode entrar pequeno no canto como marca d'água no vlog. Opcional.

**Sombra**
- Só uma: longa, macia, escura e baixa (0 18px 30px, preto a 30%). Nada de sombra dura ou colorida.

**3D**
- Objeto de papel e tinta: material fosco, textura de papel, luz suave de lado, sombra longa e macia.
- Movimento de flutuar, igual ao livro no site: sobe e desce 7 px em 7 s, inclina 1,5 grau pra cada lado. Ou gira bem devagar.
- Bons candidatos: o livro Branding pra BraSileiro, um cartão com o nome da marca do cliente, um bloco com o número `01`, o monograma F em relevo.
- Feito com Three.js de verdade (luz e sombra reais). Antes de criar do zero, procurar no catálogo do HyperFrames.
- Nada de cromado, vidro, neon, brilho estourado ou texto 3D girando feito em CSS.

### Assinatura FORTUNATO

Igual ao cabeçalho do site: `FORTUNATO` em STIX Two Text 600 com espaçamento de 0,2 em, um fio vertical fino e, ao lado, `ESTÚDIO / DE MARCAS` em duas linhas pequenas, caixa alta, Tinta suave. Entra na abertura do vlog e no fechamento de todo vídeo, com `fortunatoestudio.com` em rótulo.

### Movimento

- Curva padrão: `cubic-bezier(.2,.8,.2,1)`. Entra rápido, assenta devagar.
- Elementos entram subindo 20 a 26 px com fade, em 0,4 a 0,6 s.
- Zoom de ênfase: de 1,00 para 1,06 em 0,5 s. No máximo um a cada 8 segundos.
- Movimento contínuo sempre sutil. Nada balançando, nada quicando.
- Transição: corte seco. Quando precisar, fade de 6 quadros ou uma cartela Papel entrando de baixo.

### Câmera e cor

- Luz natural, de lado, puxando pro quente. Câmera na altura do olho.
- B-roll de textura: mão rabiscando, papel, café sendo servido, tela com a marca, conversa com cliente, detalhe da mesa do estúdio.
- Cor neutra puxando pro quente, saturação um pouco abaixo do normal, preto levemente aberto (lembra papel). Pele sempre natural.
- Citação forte pode virar preto e branco por 2 a 3 segundos.

### Ritmo

- **Reels:** alguma coisa muda a cada 2 a 4 s (corte, texto, zoom, B-roll). Depois da frase mais forte, meio segundo de respiro antes do próximo corte.
- **Vlog no YouTube:** planos de 4 a 8 s. A fala corta seco, a imagem pode durar.
- Pausa máxima entre frases: 0,4 s no Reels, 0,8 s no vlog.

### Som

- Trilha instrumental brasileira com licença livre: violão, bossa, samba lento, MPB instrumental. Bem abaixo da voz (cerca de 20 dB a menos que a fala).
- Efeitos só de som de verdade, analógicos e baixinhos: papel virando, lápis riscando, xícara no pires, clique de caneta.
- Abertura e fechamento podem ter 1 s de som ambiente do estúdio.

## 4. Voz (texto na tela e roteiro)

- Português do Brasil, simples, como quem explica pro amigo no café.
- Frase curta, palavra comum, exemplo concreto.
- Provoca com fundamento: aponta o erro comum e mostra o caminho.
- Humor seco e rápido, sem forçar.
- Frases da marca que podem fechar um vídeo (uma por vídeo, no máximo):
  - "A origem é a assinatura."
  - "Brasilidade não se fantasia. Se carrega."
  - "Marca brasileira não precisa de sotaque emprestado."

## 5. Formatos e receitas

### A. Provocação (Reels, 30 a 60 s)

Victor falando pra câmera, uma opinião forte.

1. **0 a 2 s:** gancho. A frase mais polêmica do vídeo em título grande. O primeiro quadro já tem texto, porque vira a capa no perfil.
2. **2 a 10 s:** o erro comum, com um exemplo concreto.
3. **10 a 45 s:** o porquê e o caminho. B-roll a cada 3 a 5 s.
4. **Fim:** a frase de fechamento em cartela (Papel e Tinta), 2 s, e a pílula de chamada com o ponto verde.

### B. Lista (Reels, 30 a 60 s)

Exemplo: "3 sinais de que sua marca pede desculpas por ser daqui".

1. Gancho com o número.
2. Cada item abre com `01`, `02`, `03` em Verde e um título curto numa caixa de texto.
3. O último item é o mais forte.
4. Fechamento com a assinatura e a chamada.

### C. Case (Reels, 20 a 40 s)

1. Gancho: o problema do cliente numa frase.
2. Antes (rápido), processo (rabisco, conversa, mesa) e depois (a marca aplicada em retângulos de imagem).
3. A frase do manifesto da marca em itálico, em citação.
4. Fechamento: rótulo `MARCA APROVADA`, nome do cliente e a assinatura FORTUNATO.

### D. Vlog do estúdio (YouTube 16:9, 8 a 15 min, com cortes verticais pros Reels)

1. **Abertura fria:** 5 a 10 s da cena mais forte do dia, sem vinheta.
2. **Vinheta curta:** assinatura FORTUNATO entrando sobre Espresso, até 3 s.
3. **Capítulos** com rótulo no canto, usando as estações do método quando fizer sentido: `PRELÚDIO`, `IMERSÃO`, `ESTRATÉGIA`, `CRIAÇÃO`, `APLICAÇÃO`, `EVOLUÇÃO`.
4. Victor narra por cima das imagens sempre que der. É isso que faz a edição por IA funcionar bem.
5. **Fechamento:** o que ficou do dia, numa frase, e a assinatura.

## 6. Nunca fazer

- Legenda amarela, caixa alta gritando, fonte de impacto (Impact, Montserrat Black, The Bold Font e parecidas).
- Qualquer fonte além da STIX Two Text. Isso inclui a Allura do site e qualquer manuscrita.
- Emoji na legenda.
- Mais de um elemento verde por tela. Gradiente, neon, brilho.
- Transição de programa: cubo, giro, glitch, zoom com borrão.
- Whoosh, boom, risada de plateia, som de meme.
- Elemento balançando ou quicando sem parar.
- Peça gráfica fora do kit: canto reto onde o kit pede arredondado, borda grossa, sombra dura, cor fora da paleta.
- 3D cromado, de vidro ou brilhante. Texto 3D girando feito em CSS.
- Música sem licença.
- Texto fora da zona segura do Instagram.
- Estética importada só porque é tendência.
- Travessão no texto da tela.
- Frase no molde "Não é sobre X, é sobre Y".
- Palavra de texto de IA: "jornada", "desbloquear", "potencializar", "no cenário atual".
- Copiar uma referência inteira. Da referência a gente rouba o princípio, e o visual continua sendo o nosso.

## 7. Especificações técnicas

- **Reels:** 1080x1920, 30 fps, H.264 + AAC, cores BT.709. Zona segura: x de 60 a 940, y de 220 a 1500.
- **YouTube:** 1920x1080, 30 fps (ou 24 se a gravação for em 24), H.264 + AAC, BT.709.
- Vídeo do iPhone em HDR: converter pra SDR com a conversão da própria Apple antes de montar.
- Primeiro quadro do Reels sempre com imagem e texto que façam sentido sozinhos.
- Entrega em `renders/<projeto>.mp4`.

## 8. Referências

*Pendente. Entram de 3 a 5 vídeos. Pra cada um: o que roubar (o princípio) e o que deixar (o visual que é dele).*

| Referência | O que roubar | O que deixar |
| --- | --- | --- |
| | | |

## 9. Notas

*Cresce a cada vídeo. Formato: data · vídeo · o que mudou e por quê.*
