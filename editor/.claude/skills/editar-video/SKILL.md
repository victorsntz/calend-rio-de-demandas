---
name: editar-video
description: Edita os vídeos da Norte Sul Hidrotecnologia seguindo o ESTILO.md - institucional de telão, linha do tempo, cortes de operação e vídeo de canal. Use quando aparecer roteiro pra montar, vídeo bruto pra cortar, legenda pra escrever, peça gráfica pra criar (etiqueta de ano, linha do tempo, título, legenda, pílula, cartela, lista, marca), render pra fechar, ou quando o cliente disser "salva isso" sobre uma regra de edição.
---

# Editar vídeo da Norte Sul

## A lei

O `ESTILO.md` da raiz do editor é a fonte única. Ele vence esta skill, vence o
hábito e vence o que ficou bonito. Leia ele inteiro antes de encostar num vídeo.
Os tokens dele estão em `estilo.json`, que é o que as scripts leem.

Mudou algo no `ESTILO.md`? Mude no `estilo.json` também. Os dois andam juntos.

## Duas coisas que mandam em tudo

**Tem que entender sem som.** O telão da feira toca mudo. Legenda do começo ao
fim, sem buraco. Toda informação que a narração dá, a tela também dá.

**É pra ler de longe.** Quem assiste está a dez metros, de pé, passando. Fonte
grande, frase curta, nada menos que 1,2 s na tela.

## A fonte

A marca usa **Helvetica Neue**, que é licenciada da Monotype e não entra no
repositório. Ela mora em `.fontes/`. Sem ela, a esteira roda com a **Inter**, que
é a substituta declarada, e o `conferir.mjs` **reprova a entrega**. Serve pra
aprovar layout e ritmo, não pra mandar pro telão.

## As três etapas, sem pular nenhuma

O cliente aprova duas vezes antes de existir render.

**1. Corte e legenda.** Expanda o roteiro, mostre os tempos e o texto da tela.
**Pare e espere o aval.**

**2. Roteiro de elementos.** O que entra na tela, segundo a segundo. Renderize as
peças e mostre imagem dos momentos principais, não só a lista. **Pare e espere
o aval.**

**3. Render.** Prévia primeiro (`--previa`), depois o final, depois `conferir.mjs`.

## As ferramentas

Tudo em `.claude/skills/editar-video/scripts/`, rodando da raiz do editor.

| Script | O que faz |
| --- | --- |
| `fontes.mjs` | Procura a Helvetica Neue em `.fontes/`; sem ela, baixa a Inter. |
| `roteiro.mjs` | Abre o `roteiro.json` e escreve legendas, peças e montagem. |
| `sonda.mjs` | Olha o bruto e diz o que fazer: HDR, orientação, fps, áudio. |
| `sdr.mjs` | Converte HDR do iPhone pra SDR. |
| `transcrever.mjs` | Fala vira texto com tempo por palavra (ElevenLabs Scribe). |
| `legendas.mjs` | Blocos de legenda viram PNG e `.srt`, em duas passadas. |
| `peca.mjs` | Renderiza uma peça do kit num PNG transparente do tamanho do quadro. |
| `montar.mjs` | Pega o `montagem.json` e cospe o vídeo. `--previa` pra aprovar. |
| `conferir.mjs` | O fiscal do ESTILO. Roda antes de mostrar e antes de entregar. |
| `testar.mjs` | A esteira inteira num bruto de mentira. |

Detalhe de cada uma em `references/fluxo.md`. Catálogo das peças em
`references/kit-de-pecas.md`. Armadilhas de ffmpeg e Chromium que já custaram
caro em `references/ffmpeg.md`.

## O caminho curto

```bash
cd editor
S=.claude/skills/editar-video/scripts
P=institucional-fenasan

node $S/fontes.mjs                              # só na primeira vez
node $S/roteiro.mjs --projeto $P                # ← mostrar e esperar o aval
node $S/roteiro.mjs --projeto $P --render
node $S/legendas.mjs --projeto $P --render      # ← mostrar e esperar o aval
node $S/montar.mjs trabalho/$P/montagem.json --previa
node $S/montar.mjs trabalho/$P/montagem.json
node $S/conferir.mjs renders/$P.mp4 --projeto $P
```

## O roteiro em JSON

`trabalho/<projeto>/roteiro.json` é o roteiro do cliente em formato de máquina:
blocos com tempo, narração, legendas, marcos da linha do tempo e peças. O
`roteiro.mjs` expande ele em `legendas.json`, `pecas.json` e `montagem.json`.

Quando o roteiro mudar, mude lá e rode o `roteiro.mjs` de novo. Nunca edite os
três arquivos na mão: eles são derivados.

## Escrever a legenda

- 6 a 10 palavras por vez, no máximo 2 linhas.
- Legenda em todo trecho com narração. Buraco acima de 1,5 s o fiscal reprova.
- `**palavra**` sai no amarelo. Um destaque de conteúdo por tela.
- Sem emoji, sem travessão, sem caixa alta fora de rótulo.

## A regra do amarelo

A mobília do sistema é amarela por desenho e não entra na conta: a barra da
etiqueta de ano, a barra da legenda e o ponto ativo da linha do tempo. As três
podem estar na mesma tela. O que a regra limita é destaque de conteúdo: **um por
tela**. Uma palavra realçada, ou uma pílula preenchida, ou um número.

## O loop

O telão roda em laço. O primeiro e o último quadro têm que ser a mesma cartela,
pra volta não dar solavanco. O `conferir.mjs` mede isso com SSIM e reprova se
não bater.

## Quando o cliente disser "salva isso"

1. Escreva a regra na seção do `ESTILO.md` onde ela se encaixa.
2. Se a regra tem número, cor ou tempo, atualize o `estilo.json` junto.
3. Acrescente uma linha na seção **8. Notas**: `data · vídeo · o que mudou e por quê`.
4. Commit e push.

## O que nunca fazer

A seção 5 do `ESTILO.md` manda. O `conferir.mjs` cobra o que dá pra medir
(fonte substituta, specs de entrega, loop, travessão, emoji, palavra de texto de
IA, dois destaques juntos, buraco de legenda, zona segura). O resto é olho:
fonte de impacto, foto de banco de imagem, transição de programa, efeito sonoro.

Mídia nunca vai pro GitHub. Se um `.mp4` ou `.mov` aparecer pra commit, pare e
avise. O `.gitignore` já barra, mas a conferência é sua.
