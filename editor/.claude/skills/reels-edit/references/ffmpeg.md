# Armadilhas de ffmpeg e Chromium

Cada item aqui custou um render errado. Leia antes de mexer nas scripts.

## Chromium

**`file://` só engole caminho absoluto.** Com caminho relativo o Chromium abre
a página de erro dele, branca e opaca, e **sai com código 0**. O PNG sai do
tamanho certo, parece normal na listagem, e só aparece no vídeo montado. O
`peca.mjs` resolve todo caminho pra absoluto e ainda confere o pixel do canto
depois do screenshot: peça comum tem que ter canto transparente, peça de
sangria não pode ser branco puro (nenhuma cor do ESTILO é 255,255,255).

**Transparência precisa de `--default-background-color=00000000`.** Sem isso o
fundo sai branco opaco e a peça come o vídeo inteiro.

**Fonte precisa de tempo pra carregar.** `--virtual-time-budget=400` dá esse
tempo e, de quebra, adianta as animações de forma determinística: é assim que
`--quadros` gera a sequência do ponto verde pulsando, um screenshot por tempo
virtual diferente.

**Medir pixel: leia o cru.** `signalstats` trabalha em YUV de faixa limitada,
onde branco puro vira 235 e o papel `#F6F5F1` vira 226. Nove de diferença não
decide nada. Extraia `rawvideo` com `-pix_fmt rgba` e leia os bytes.

## ffmpeg

**`-v error` cala o que você quer ler.** `cropdetect`, `metadata=print` e vários
outros escrevem em nível `info`. Com `-v error` a saída vem vazia, o regex não
acha nada, e a conferência vira enfeite que sempre passa. Para medir, use
`-hide_banner -v info`.

**`cropdetect` não solta nada com um quadro só.** Ele só imprime quando o
recorte muda e pula os primeiros quadros. Pra achar a caixa do que foi pintado
num PNG, reduza o alpha e leia os bytes:
`alphaextract,scale=270:480:flags=area -pix_fmt gray -f rawvideo`.

**`concat` quer os pares intercalados.** É `[v0][a0][v1][a1]concat=n=2:v=1:a=1`,
nunca `[v0][v1][a0][a1]`. Com a ordem errada o erro é "Media type mismatch",
que não diz qual é o problema.

**Clipe sem áudio quebra o concat com `a=1`.** Sonde cada clipe e injete
`anullsrc` do tamanho dele quando faltar trilha.

**A entrada com `-loop 1` nunca acaba.** O `-t` na saída é o que fecha o vídeo.
Sem ele o render roda até o disco acabar.

**`fade` no overlay vem antes do `setpts`.** O `st=` do fade conta a partir do
começo do próprio stream (zero). O `setpts=PTS-STARTPTS+X/TB` é que empurra a
peça pro lugar dela na linha do tempo. Inverter a ordem põe o fade na hora
errada.

**Entrada que sobe sem quicar.** A animação é expressão de `y` no `overlay`:
`y='if(lt(t-DE,D), SOBE*(1-(t-DE)/D), 0)'`. Começa SOBE pixels abaixo e assenta
em D segundos. Nada de `sin()`: o ESTILO não quica.

**Grão em multiply.** `blend=all_mode=multiply:all_opacity=0.045:shortest=1`. O
ruído é claro (180 a 255) de propósito: ruído médio em multiply escurece a
imagem toda em vez de dar dente de papel.

**`amix` normaliza por padrão.** Isso afunda a voz quando a trilha entra. Use
`amix=inputs=2:duration=first:normalize=0` e deixe a trilha em `-20dB`, que é o
que o ESTILO pede.

**HDR do iPhone.** A etiqueta está em `color_transfer`: `arib-std-b67` (HLG) ou
`smpte2084` (PQ). A cadeia que funciona é
`zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`.
Precisa de ffmpeg com libzimg. No Mac, o `avconvert` acerta melhor o tom de pele.

**Marque a cor na saída.** `-color_primaries bt709 -color_trc bt709 -colorspace
bt709`. Sem isso o arquivo sai sem etiqueta e cada player escolhe uma cor, aí o
verde do estilo muda de tom no celular.

**`-movflags +faststart`** sempre. Sem isso o Instagram demora pra começar a
tocar.

## Quando der ruim

O `montar.mjs` salva o comando inteiro em `trabalho/<projeto>/ffmpeg.txt` toda
vez, prévia inclusive. Copie, cole no terminal e vá cortando filtro até achar o
culpado.

## O que ficou de fora

O `CLAUDE.md` fala do kit WeAreNoCode-YouTube-Editor e do HyperFrames. O kit
mora numa comunidade do Skool e não dá pra baixar daqui, então a esteira foi
montada do zero em cima do que já existe na máquina: ffmpeg, Chromium headless
e Node. Sem dependência de npm, sem conta em lugar nenhum.

O HyperFrames (`npx hyperframes`, "HTML video compositions") continua valendo pro
que esta esteira não faz: 3D de verdade com Three.js, luz e sombra reais, do
jeito que a seção de 3D do `ESTILO.md` pede. Quando for montar o livro
*Branding pra BraSileiro* flutuando, é por lá. Ainda não foi testado aqui.
