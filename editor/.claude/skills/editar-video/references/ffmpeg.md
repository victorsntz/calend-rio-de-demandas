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

**O viewport é mais baixo que a janela.** `--window-size=1008,672` entrega um
viewport de uns 600 px: sobra a altura da barra do navegador. O screenshot sai
com os 1008x672 pedidos, mas os últimos 72 px vêm transparentes, então tudo
perto da base do quadro **some calado**. Foi assim que a linha do tempo inteira
desapareceu sem erro nenhum. A saída é pedir a janela com folga
(`altura + 160`) e recortar o quadro de verdade com o ffmpeg depois.

**Fonte precisa de tempo pra carregar.** `--virtual-time-budget=450` dá esse
tempo e, de quebra, adianta as animações de forma determinística.

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

**`amix` normaliza por padrão.** Isso afunda a voz quando a trilha entra. Use
`amix=inputs=2:duration=first:normalize=0` e deixe a trilha em `-20dB`, que é o
que o ESTILO pede.

**HDR do iPhone.** A etiqueta está em `color_transfer`: `arib-std-b67` (HLG) ou
`smpte2084` (PQ). A cadeia que funciona é
`zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`.
Precisa de ffmpeg com libzimg. No Mac, o `avconvert` acerta melhor o tom de pele.

**Marque a cor na saída.** `-color_primaries bt709 -color_trc bt709 -colorspace
bt709`. Sem isso o arquivo sai sem etiqueta e cada player escolhe uma cor, aí o
azul da marca muda de tom no telão.

**`-movflags +faststart`** sempre. Player de telão costuma ser simples e engasga
com arquivo que tem o índice no fim.

## Quando der ruim

O `montar.mjs` salva o comando inteiro em `trabalho/<projeto>/ffmpeg.txt` toda
vez, prévia inclusive. Copie, cole no terminal e vá cortando filtro até achar o
culpado.

**Testar o loop com SSIM.** `[0][1]ssim` compara o primeiro quadro com o último
e imprime `All: 0.99…`. Acima de 0,97 a volta do laço não dá solavanco no telão.
Como todo filtro de medição, ele escreve em nível `info`.

## Fonte paga

A Helvetica Neue é licenciada da Monotype e **não** pode ser baixada nem entrar
no repositório. Ela mora em `.fontes/`, que o git ignora. O `fontes.mjs` procura
por nome e, se não achar, baixa a Inter como substituta declarada no ESTILO. O
`conferir.mjs` reprova qualquer entrega feita com a substituta: no telão da feira
a fonte trocada é a primeira coisa que um designer vê.
