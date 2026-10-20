# Editor de vídeos · Norte Sul

Aqui o Claude Code edita os vídeos da Norte Sul Hidrotecnologia: institucional de
telão, linha do tempo, cortes de operação e vídeo de canal. Tudo em português
do Brasil.

## Antes de qualquer edição

1. Ler o `ESTILO.md` inteiro. Ele é a fonte única do estilo e vence qualquer
   regra genérica da skill de edição.
2. Conferir a fonte. A marca usa Helvetica Neue, que é licenciada e mora em
   `.fontes/`. Sem ela a esteira roda com a Inter e **a entrega é reprovada**.
3. Conferir se o vídeo bruto é HDR (comum em iPhone). Se for, converter pra SDR
   antes de montar.

## Pastas

- `brutos/`: material bruto, uma pasta por projeto. `brutos/acervo/` guarda as
  fotos históricas de 1985 a 2026, com o ano no nome.
- `trabalho/`: os intermediários de cada projeto (roteiro, legendas, peças, prévia).
- `renders/`: vídeos prontos, em `renders/<projeto>.mp4`.
- `marca/`: os logotipos. Versão clara, escura e as compactas sem o descritivo.
- `ESTILO.md`: o estilo. Manda em tudo.
- `estilo.json`: os mesmos tokens em formato de máquina, que é o que as scripts leem.
- `.claude/skills/editar-video/`: a skill de edição e as scripts.
- `.fontes/`: a Helvetica Neue do cliente mais a Inter substituta. Fora do git.

Vídeo, áudio e foto de acervo nunca vão pro GitHub (o `.gitignore` já barra). Se
um arquivo de mídia aparecer pra commit, parar e avisar. Os logotipos em
`marca/` são exceção: eles são infraestrutura da marca e sobem.

Mudou uma regra no `ESTILO.md`? Mudar no `estilo.json` também. Os dois andam juntos.

## As duas coisas que mandam em tudo

**Tem que entender sem som.** O telão da feira toca mudo. Legenda do começo ao
fim, sem buraco.

**É pra ler de longe.** Dez metros, de pé, passando. Fonte grande, frase curta,
nada menos que 1,2 s na tela.

## Como editar: sempre por etapas

1. **Corte e legenda:** mostrar os tempos e o texto da tela já corrigido. Esperar aprovação.
2. **Roteiro de elementos:** o que entra na tela, segundo a segundo, com imagens
   dos momentos principais. Esperar aprovação.
3. **Render:** só depois das duas aprovações. Prévia primeiro, depois o final,
   depois a conferência.

Nunca renderizar direto sem passar pelas etapas 1 e 2.

A skill `editar-video` leva por essas etapas com uma script pra cada uma. O
caminho curto está no `SKILL.md`; o detalhe, em `references/fluxo.md`.

## Quando o cliente disser "salva isso"

1. Escrever a regra na seção do `ESTILO.md` onde ela se encaixa.
2. Se a regra tem número, cor ou tempo, atualizar o `estilo.json` junto.
3. Acrescentar uma linha na seção **8. Notas**: `data · vídeo · o que mudou e por quê`.
4. Fazer o commit e o push.

## Como falar com o Victor

Ele é designer de marcas e lidera a agência que atende a Norte Sul. Falar
simples, como gente, com exemplo concreto. Sem travessão, sem jargão de IA, sem
a frase "não é sobre X, é sobre Y". Pode ter humor rápido.

## Primeira vez num computador novo

Precisa de FFmpeg (com libzimg, pros filtros de cor), Node 20 ou mais novo e um
Chromium. Depois:

```bash
cd editor
node .claude/skills/editar-video/scripts/fontes.mjs
```

Ele procura a Helvetica Neue em `.fontes/` e, se não achar, baixa a Inter pra
esteira não parar. Copie os arquivos da Helvetica pra lá antes de qualquer
render de entrega.

Não tem `npm install` e não tem conta em lugar nenhum. A única chave que entra em
cena é a da ElevenLabs, e só pra transcrever: ela vai em `ELEVENLABS_API_KEY` ou
num `.env` aqui na raiz, que o `.gitignore` barra.

Se o Chromium não estiver no caminho esperado, aponte com `CHROMIUM_BIN`.
