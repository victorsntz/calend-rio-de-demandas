# Dois projetos neste repositório

Antes de mexer em alguma coisa, veja em qual dos dois você está. Eles não se
falam e não compartilham código.

## `editor/`: Editor de vídeos da Norte Sul

Onde o Claude Code edita os vídeos da Norte Sul Hidrotecnologia: institucional
de telão, linha do tempo, cortes de operação. Tem a própria lei
(`editor/ESTILO.md`), as próprias regras de trabalho (`editor/CLAUDE.md`) e a
própria skill (`editor/.claude/skills/editar-video/`). Comece pelo
`editor/LEIA-ME.md`.

A fonte da marca é a **Helvetica Neue**, que é paga e mora em `editor/.fontes/`,
fora do git. Sem ela a esteira roda com a Inter e o fiscal reprova a entrega.

## Raiz: Calendário de Demandas

App Next.js do calendário de demandas de carrossel do Fortunato Estúdio
(`app/`, `components/`, `lib/`, `artifact/`). `npm run dev` sobe em
`localhost:3000`. É de outro cliente e não tem relação com o editor.

## Mídia

Vídeo, áudio e foto de acervo nunca vão pro GitHub: o `.gitignore` barra em
qualquer pasta. Se um `.mp4` ou `.mov` aparecer pra commit, pare e avise. Os
logotipos em `editor/marca/` são exceção: são infraestrutura da marca e sobem.
