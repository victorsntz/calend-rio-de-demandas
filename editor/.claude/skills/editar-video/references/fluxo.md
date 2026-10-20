# O fluxo, script por script

Tudo roda da raiz do editor. Nos exemplos, `S=.claude/skills/editar-video/scripts`
e `P` é o nome do projeto (`institucional-fenasan`).

## Antes de tudo, uma vez por computador

```bash
node $S/fontes.mjs
```

Ele procura a Helvetica Neue em `.fontes/` e, se não achar, baixa a Inter pra
esteira não parar. **A Helvetica Neue é paga e não pode ser baixada.** Copie os
arquivos do cliente pra `.fontes/` com os nomes que o `fontes.mjs --estado`
lista. Sem ela, o `conferir.mjs` reprova toda entrega.

## 1. Expandir o roteiro

```bash
node $S/roteiro.mjs --projeto $P              # escreve os derivados
node $S/roteiro.mjs --projeto $P --render     # e renderiza as peças
```

Lê `trabalho/$P/roteiro.json` e escreve:

| Arquivo | O que é |
| --- | --- |
| `legendas.json` | os blocos de legenda, pra ajustar texto e ênfase |
| `legendas.txt` | a mesma coisa pra ler e aprovar |
| `pecas.json` | toda peça gráfica com tempo de entrada e saída |
| `montagem.json` | o esqueleto da edição |

Os três são **derivados**. Mudou o roteiro, mude no `roteiro.json` e rode de
novo. Editar os derivados na mão é perder o trabalho na próxima rodada.

## 2. Sondar e preparar o bruto

```bash
node $S/sonda.mjs brutos/$P/IMG_0001.mov
node $S/sdr.mjs  brutos/$P/IMG_0001.mov      # se a sonda apontar HDR
```

No Mac o `sdr.mjs` usa o `avconvert`, que é a conversão da própria Apple e
acerta melhor o tom de pele. Fora do Mac usa o ffmpeg com tonemap hable.

## 3. Transcrever, quando houver locução

```bash
export ELEVENLABS_API_KEY=sua-chave      # ou editor/.env
node $S/transcrever.mjs brutos/$P/locucao.wav --projeto $P
```

Sem chave dá pra seguir: os tempos de legenda já estão no `roteiro.json`. A
transcrição serve pra casar esses tempos com a voz gravada de verdade.

## 4. Legendas

```bash
node $S/legendas.mjs --projeto $P              # pica e mostra
# ← mostrar, esperar o aval, ajustar texto e ênfase
node $S/legendas.mjs --projeto $P --render     # vira PNG e .srt
```

A pausa entre as duas passadas é a etapa 1 do `CLAUDE.md`.

## 5. Peças

```bash
node $S/peca.mjs ano --texto "1985" --y 56
node $S/peca.mjs --json trabalho/$P/pecas.json
```

Catálogo em `kit-de-pecas.md`. Cada peça sai num PNG transparente do tamanho do
quadro, então o montador só sobrepõe em 0,0 e cuida do tempo.

`PECA_DEBUG=1` guarda o HTML ao lado do PNG, pra ver o que o Chromium recebeu.

## 6. Preparar o material

```bash
node $S/preparar.mjs --projeto $P
```

Normaliza cada trecho de clipe uma vez só: gira o que veio deitado, converte
HDR pra SDR, acerta o fps e já entrega no tamanho do quadro. Depois disso a
montagem é só cortar e sobrepor, e o render cai de meia hora pra um minuto.
O `montagem.json` passa a apontar pros preparados; `--forcar` refaz tudo.

Mudou o roteiro? Rode o `roteiro.mjs` de novo (ele reescreve a montagem com os
brutos) e o `preparar.mjs` em seguida, que reaproveita o que já existe.

## 7. Montar

```bash
node $S/montar.mjs trabalho/$P/montagem.json --previa    # metade da resolução
node $S/montar.mjs trabalho/$P/montagem.json             # o final
```

A prévia existe pra aprovar sem gastar o render bom, e nunca escreve por cima
dele. O comando ffmpeg inteiro fica em `trabalho/$P/ffmpeg.txt`.

## 8. Conferir

```bash
node $S/conferir.mjs renders/$P.mp4 --projeto $P
node $S/conferir.mjs --projeto $P        # só texto e peças
```

Sai com código 1 se achou coisa contra o `ESTILO.md`:

| Onde | O que cobra |
| --- | --- |
| fonte | se o render sairia com a substituta em vez da Helvetica Neue |
| arquivo | 1008x672, 30 fps, H.264, AAC, cor bt709 |
| loop | se o primeiro e o último quadro batem (SSIM acima de 0,97) |
| texto | travessão, emoji, palavra de texto de IA, dois destaques juntos |
| cobertura | buraco de legenda acima de 1,5 s |
| ritmo | legenda com menos de 1,2 s na tela |
| peças | zona segura do painel |

## 9. Testar a esteira

```bash
node $S/testar.mjs            # roda tudo num bruto de mentira e limpa depois
node $S/testar.mjs --manter   # deixa os arquivos pra olhar
```
