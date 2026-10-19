# Editor de vídeos · Victor Fortunato

Aqui o Claude Code edita os vídeos do Victor Fortunato (Fortunato Estúdio): Reels, vlogs do estúdio e cortes pro YouTube. Tudo em português do Brasil.

## Antes de qualquer edição

1. Ler o `ESTILO.md` inteiro. Ele é a fonte única do estilo e vence qualquer regra genérica da skill de edição.
2. Conferir se o vídeo bruto é HDR (comum em iPhone). Se for, converter pra SDR com a conversão de cor da própria Apple (AVFoundation) antes de montar.

## Pastas

- `brutos/`: vídeos gravados, um subdiretório por projeto (`brutos/2026-10-10-nome-do-video/`).
- `trabalho/`: os intermediários de cada projeto (transcrição, legendas, peças, prévia).
- `renders/`: vídeos prontos, em `renders/<projeto>.mp4`.
- `ESTILO.md`: o estilo. Manda em tudo.
- `estilo.json`: os mesmos tokens em formato de máquina, que é o que as scripts leem.
- `.claude/skills/reels-edit/`: a skill de edição e as scripts.
- `.fontes/`: a STIX Two Text baixada. Não vai pro GitHub, se refaz com um comando.

Vídeo e áudio nunca vão pro GitHub (o `.gitignore` já barra). Se um arquivo de mídia aparecer pra commit, parar e avisar.

Mudou uma regra no `ESTILO.md`? Mudar no `estilo.json` também. Os dois andam juntos.

## Como editar: sempre por etapas

1. **Corte e legenda:** mostrar o corte proposto e o texto da legenda já corrigido. Esperar aprovação.
2. **Roteiro de elementos:** o que entra na tela, segundo a segundo, com imagens dos momentos principais. Esperar aprovação.
3. **Render:** só depois das duas aprovações. Prévia primeiro, depois o final, depois a conferência.

Nunca renderizar direto sem passar pelas etapas 1 e 2.

A skill `reels-edit` leva por essas etapas com uma script pra cada uma. O
caminho curto está no `SKILL.md`; o detalhe, em `references/fluxo.md`.

## Quando o Victor disser "salva isso"

1. Escrever a regra na seção do `ESTILO.md` onde ela se encaixa (legenda, movimento, som e assim por diante).
2. Se a regra tem número, cor ou tempo, atualizar o `estilo.json` junto.
3. Acrescentar uma linha na seção **9. Notas**: `data · vídeo · o que mudou e por quê`.
4. Fazer o commit e o push.

## Como falar com o Victor

Ele é designer de marcas e lidera uma agência. Falar simples, como gente, com exemplo concreto. Sem travessão, sem jargão de IA, sem a frase "não é sobre X, é sobre Y". Pode ter humor rápido.

## Primeira vez num computador novo

Precisa de FFmpeg (com libzimg, pros filtros de cor), Node 20 ou mais novo e um
Chromium. Depois:

```bash
cd editor
node .claude/skills/reels-edit/scripts/fontes.mjs      # baixa a STIX Two Text
node .claude/skills/reels-edit/scripts/grao.mjs        # textura de grão
```

Pronto. Não tem `npm install`, não tem conta em lugar nenhum. A única chave que
entra em cena é a da ElevenLabs, e só pra transcrever: ela vai em
`ELEVENLABS_API_KEY` ou num `.env` aqui na raiz, que o `.gitignore` barra.

Se o Chromium não estiver no caminho esperado, aponte com `CHROMIUM_BIN`.

### Sobre o kit original

O método veio do guia "Edite Reels com IA", que usa o kit
WeAreNoCode-YouTube-Editor (comunidade skool.com/wearenocode) e o HyperFrames.
O kit mora atrás da comunidade e não deu pra baixar, então a skill `reels-edit`
foi escrita do zero em cima do que já existe na máquina: FFmpeg, Chromium
headless e Node. Mesma ideia, sem dependência externa.

O HyperFrames (`npx hyperframes`) continua valendo pro que esta esteira não faz:
3D de verdade com Three.js, luz e sombra reais, do jeito que a seção de 3D do
`ESTILO.md` pede. Ainda não foi testado aqui.
