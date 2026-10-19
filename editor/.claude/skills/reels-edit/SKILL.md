---
name: reels-edit
description: Edita os vídeos do Victor Fortunato (Fortunato Estúdio) seguindo o ESTILO.md - Reels, vlogs do estúdio e cortes pro YouTube. Use quando aparecer vídeo bruto pra cortar, legenda pra escrever, peça gráfica pra criar (gancho, cartela, pílula, citação, lista, assinatura FORTUNATO), render pra fechar, ou quando o Victor disser "salva isso" sobre uma regra de edição.
---

# Editar vídeo do Fortunato Estúdio

## A lei

O `ESTILO.md` da raiz do editor é a fonte única. Ele vence esta skill, vence
o hábito e vence o que ficou bonito. Leia ele inteiro antes de encostar num
vídeo. Os tokens dele estão em `estilo.json`, que é o que as scripts leem.

Mudou algo no `ESTILO.md`? Mude no `estilo.json` também. Os dois andam juntos.

## As três etapas, sem pular nenhuma

O Victor aprova duas vezes antes de existir render.

**1. Corte e legenda.** Sonde o bruto, transcreva, pique a legenda, corrija o
texto. Mostre o corte proposto e o texto já limpo. **Pare e espere o aval.**

**2. Roteiro de elementos.** O que entra na tela, segundo a segundo. Renderize
as peças e mostre imagem dos momentos principais, não só a lista. **Pare e
espere o aval.**

**3. Render.** Prévia primeiro (`--previa`, metade da resolução, rápida). Com o
aval da prévia, o render final. Depois `conferir.mjs`, sempre.

Render antes dos dois avais não existe. Se o Victor pedir "manda logo", mostre
a prévia: ela leva vinte segundos e evita refazer uma hora de trabalho.

## As ferramentas

Tudo em `.claude/skills/reels-edit/scripts/`, rodando da raiz do editor.

| Script | O que faz |
| --- | --- |
| `fontes.mjs` | Baixa a STIX Two Text pra `.fontes/`. Uma vez por computador. |
| `sonda.mjs` | Olha o bruto e diz o que fazer: HDR, orientação, fps, áudio. |
| `sdr.mjs` | Converte HDR do iPhone pra SDR. No Mac usa a conversão da Apple. |
| `transcrever.mjs` | Fala vira texto com tempo por palavra (ElevenLabs Scribe). |
| `legendas.mjs` | Transcrição vira blocos de 3 a 5 palavras; depois do aval, vira PNG e `.srt`. |
| `peca.mjs` | Renderiza uma peça do kit num PNG transparente do tamanho do quadro. |
| `grao.mjs` | Gera a textura de grão de papel. Uma vez por formato. |
| `montar.mjs` | Pega o `montagem.json` e cospe o vídeo. `--previa` pra aprovar. |
| `conferir.mjs` | O fiscal do ESTILO. Roda antes de mostrar e antes de postar. |

Detalhe de cada uma em `references/fluxo.md`. Catálogo das peças com todas as
opções em `references/kit-de-pecas.md`. Armadilhas de ffmpeg e Chromium que já
custaram caro em `references/ffmpeg.md`.

## O caminho curto

```bash
cd editor
node .claude/skills/reels-edit/scripts/fontes.mjs                      # só na primeira vez
node .claude/skills/reels-edit/scripts/grao.mjs                        # só na primeira vez

S=.claude/skills/reels-edit/scripts
P=2026-10-19-nome-do-video

node $S/sonda.mjs brutos/$P/IMG_0001.mov
node $S/sdr.mjs  brutos/$P/IMG_0001.mov                                # se a sonda pedir
node $S/transcrever.mjs brutos/$P/IMG_0001-sdr.mov --projeto $P
node $S/legendas.mjs --projeto $P                                      # ← mostrar e esperar o aval
node $S/legendas.mjs --projeto $P --render
node $S/peca.mjs gancho --rotulo "OPINIÃO" --texto "..." --x esquerda --y 300 \
  --saida trabalho/$P/pecas/gancho.png                                 # ← mostrar e esperar o aval
node $S/montar.mjs trabalho/$P/montagem.json --previa                  # ← mostrar e esperar o aval
node $S/montar.mjs trabalho/$P/montagem.json
node $S/conferir.mjs renders/$P.mp4 --projeto $P
```

## Escrever a legenda

- 3 a 5 palavras por vez, no máximo 2 linhas, na faixa de baixo.
- Tira "né", "tipo", "ééé". O `transcrever.mjs` já marca; o `legendas.mjs` já corta.
- Ortografia corrigida sempre, mesmo quando a boca falou errado.
- Ênfase: `*palavra*` sai em itálico. `**palavra**` sai em itálico no verde.
  Uma por frase. Se todo bloco tem verde, nenhum tem.
- Sem emoji, sem travessão, sem caixa alta fora de rótulo.

## Escrever o roteiro de elementos

O `montagem.json` mora em `trabalho/<projeto>/`. Os tempos dos clipes são do
arquivo bruto; os das peças são da linha do tempo já montada.

```json
{
  "projeto": "2026-10-19-nome", "formato": "reels",
  "clipes": [
    { "arquivo": "brutos/2026-10-19-nome/a-sdr.mov", "de": 3.2, "ate": 8.9, "zoom": true }
  ],
  "legendas": true,
  "pecas": [
    { "png": "trabalho/2026-10-19-nome/pecas/gancho.png", "de": 0, "ate": 2.6, "entrada": "subir" },
    { "png": "trabalho/2026-10-19-nome/pecas/cartela.png", "de": 42, "ate": 45, "verde": true }
  ],
  "trilha": { "arquivo": "brutos/2026-10-19-nome/trilha.mp3", "db": -20 },
  "grao": true
}
```

Marque `"verde": true` na peça que carrega o acento. O montador e o fiscal usam
isso pra cobrar a regra de um verde por tela.

## Ritmo, pelo ESTILO

- Reels: alguma coisa muda a cada 2 a 4 s. Meio segundo de respiro depois da
  frase mais forte. Pausa máxima entre frases: 0,4 s.
- Vlog: planos de 4 a 8 s, fala cortando seco, imagem podendo durar.
- Zoom de ênfase (`"zoom": true` no clipe): no máximo um a cada 8 s.
- Transição é corte seco. Fade só quando o corte não resolve.

## As receitas do ESTILO (seção 5)

- **A. Provocação** (Reels 30 a 60 s): gancho polêmico nos 2 primeiros segundos,
  erro comum com exemplo, porquê e caminho com B-roll a cada 3 a 5 s, cartela de
  fechamento e pílula com o ponto verde.
- **B. Lista**: gancho com o número, cada item abrindo em `01`, `02`, `03`, o
  último sendo o mais forte.
- **C. Case**: problema numa frase, antes e processo e depois, manifesto em
  citação, fechamento com `MARCA APROVADA` e a assinatura.
- **D. Vlog**: abertura fria de 5 a 10 s, vinheta de até 3 s, capítulos com
  rótulo (`PRELÚDIO`, `IMERSÃO`, `ESTRATÉGIA`, `CRIAÇÃO`, `APLICAÇÃO`,
  `EVOLUÇÃO`), fechamento com o que ficou do dia.

## Quando o Victor disser "salva isso"

1. Escreva a regra na seção do `ESTILO.md` onde ela se encaixa.
2. Se a regra tem número, cor ou tempo, atualize o `estilo.json` junto.
3. Acrescente uma linha na seção **9. Notas**: `data · vídeo · o que mudou e por quê`.
4. Commit e push.

## O que nunca fazer

A seção 6 do `ESTILO.md` manda. O `conferir.mjs` cobra o que dá pra medir
(travessão, emoji, palavra de texto de IA, molde proibido, dois verdes juntos,
caixa alta, zona segura, specs de entrega). O resto é olho: fonte de impacto,
transição de programa, whoosh, 3D cromado, estética importada.

Mídia nunca vai pro GitHub. Se um `.mp4` ou `.mov` aparecer pra commit, pare e
avise. O `.gitignore` já barra, mas a conferência é sua.
