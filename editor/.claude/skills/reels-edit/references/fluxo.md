# O fluxo, script por script

Tudo roda da raiz do editor. Nos exemplos, `S=.claude/skills/reels-edit/scripts`
e `P` é o nome do projeto (`2026-10-19-nome-do-video`).

## Antes de tudo, uma vez por computador

```bash
node $S/fontes.mjs      # baixa a STIX Two Text pra .fontes/ (SIL OFL, pode usar)
node $S/grao.mjs        # textura de grão 1080x1920
node $S/grao.mjs --formato youtube
```

Sem a fonte, as peças nem renderizam: o `peca.mjs` para e manda rodar o
`fontes.mjs`. É de propósito. Peça com fonte errada é pior que peça nenhuma.

## 1. Sondar o bruto

```bash
node $S/sonda.mjs brutos/$P/IMG_0001.mov
node $S/sonda.mjs brutos/$P/IMG_0001.mov --formato youtube
```

Diz resolução, fps, cor, áudio e o veredito: se é HDR, se a orientação bate com
o formato, se o fps conversa com a entrega. iPhone grava HDR por padrão, então
quase sempre vai pedir conversão.

## 2. HDR vira SDR

```bash
node $S/sdr.mjs brutos/$P/IMG_0001.mov
```

Sai `IMG_0001-sdr.mov` ao lado. **Monte a partir dele, nunca do original.**

No Mac usa o `avconvert`, que é a conversão de cor da própria Apple e acerta
melhor o tom de pele. Fora do Mac usa o ffmpeg com tonemap hable. `--ffmpeg`
força o caminho do ffmpeg mesmo no Mac. `--forcar` converte um arquivo que já
é SDR (raramente útil).

## 3. Transcrever

```bash
export ELEVENLABS_API_KEY=sua-chave      # ou editor/.env com ELEVENLABS_API_KEY=
node $S/transcrever.mjs brutos/$P/IMG_0001-sdr.mov --projeto $P
```

Sai `trabalho/$P/transcricao.json` com tempo por palavra e os vícios de fala
("né", "tipo", "ééé") já marcados. O `.env` nunca sobe: o `.gitignore` barra.

**Sem chave dá pra seguir.** Escreva os blocos na mão num JSON
(`[{"inicio":2.6,"fim":4.4,"texto":"..."}]`) e passe com `--texto arquivo.json`
pro `legendas.mjs`.

## 4. Legenda, em duas passadas

```bash
node $S/legendas.mjs --projeto $P              # passada 1: picar e mostrar
# ← mostrar pro Victor, esperar o aval, ajustar o texto e a ênfase
node $S/legendas.mjs --projeto $P --render     # passada 2: virar PNG e .srt
```

A primeira passada escreve `legendas.json` (pra editar) e `legendas.txt` (pra
ler). A pausa entre as duas é a etapa 1 do `CLAUDE.md`. Avisa quando um bloco
passou do tamanho e quando tem pausa grande o bastante pra virar corte seco.

A segunda passada gera um PNG por bloco em `trabalho/$P/legendas/`, o
`legendas.srt` (pro YouTube e pra quem usa leitor de tela) e o
`legendas-render.json`, que o montador lê.

Ênfase no texto: `*itálico*` e `**itálico no verde**`. Uma por frase.

## 5. Peças

```bash
node $S/peca.mjs gancho --rotulo "OPINIÃO" --texto "..." --x esquerda --y 300 \
  --saida trabalho/$P/pecas/gancho.png
node $S/peca.mjs --json trabalho/$P/roteiro-de-pecas.json     # várias de uma vez
```

Catálogo completo em `kit-de-pecas.md`. Cada peça sai num PNG transparente do
tamanho do quadro inteiro, então o montador só sobrepõe em 0,0 e cuida do tempo
e da entrada.

## 6. Montar

```bash
node $S/montar.mjs trabalho/$P/montagem.json --previa     # metade da resolução, rápido
node $S/montar.mjs trabalho/$P/montagem.json              # o final, em renders/$P.mp4
```

A prévia existe pra aprovar sem gastar o render bom. O comando ffmpeg inteiro
fica salvo em `trabalho/$P/ffmpeg.txt` toda vez, pra investigar quando der ruim.

## 7. Conferir

```bash
node $S/conferir.mjs renders/$P.mp4 --projeto $P
node $S/conferir.mjs --projeto $P        # só texto e peças, sem render pronto
```

Sai com código 1 se achou coisa contra o `ESTILO.md`. O que ele mede:

| Onde | O que cobra |
| --- | --- |
| arquivo | resolução, fps, codec, pixels, cor bt709 (SDR), áudio AAC, duração, volume |
| texto | travessão, emoji, palavra de texto de IA, molde "não é sobre X, é sobre Y", caixa alta fora de rótulo, mais de uma ênfase verde por frase, frase de fechamento repetida |
| peças | zona segura do Instagram, dois verdes na tela ao mesmo tempo |
| fonte | se os 7 pesos da STIX estão baixados |

O que ele não mede fica no olho: fonte de impacto, transição de programa,
whoosh, 3D cromado, estética importada.
