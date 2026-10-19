# Dois projetos do Fortunato Estúdio neste repositório

Antes de mexer em alguma coisa, veja em qual dos dois você está. Eles não se
falam e não compartilham código.

## Raiz: Calendário de Demandas

App Next.js do calendário de demandas dos clientes de carrossel
(`app/`, `components/`, `lib/`, `artifact/`). `npm run dev` sobe em
`localhost:3000`. O `README.md` explica o modelo comercial que ele reflete.

## `editor/`: Editor de vídeos

Onde o Claude Code edita os Reels, vlogs e cortes do estúdio. Tem a própria
lei (`editor/ESTILO.md`), as próprias regras de trabalho (`editor/CLAUDE.md`) e
a própria skill (`editor/.claude/skills/reels-edit/`). Comece pelo
`editor/LEIA-ME.md`.

Nada de mídia vai pro GitHub: o `.gitignore` barra vídeo e áudio em qualquer
pasta. Se um `.mp4` ou `.mov` aparecer pra commit, pare e avise.
